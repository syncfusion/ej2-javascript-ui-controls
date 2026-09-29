/**
 *
 * Factory for creating wrapping block input rule definitions (bullet list, ordered list, etc.).
 * Extensions use this to contribute rules that wrap content in block containers.
 *
 * The rule handler uses ONLY dispatchCommand() to apply the wrapping,
 * ensuring proper undo/redo grouping and event tracking.
 */

import { InputRuleContext, InputRuleDefinition } from '../types';

/**
 * Creates a wrapping input rule.
 *
 * @param {CreateWrappingRuleOptions} options
 * @returns {InputRuleDefinition}
 */

export interface CreateWrappingRuleOptions {
    id: string;
    pattern: RegExp;
    target: string;
    allowUndo?: boolean;
    attributeProvider?:
    | Record<string, unknown>
    | ((match: RegExpMatchArray) => Record<string, unknown>);
}

/**
 * Creates an input rule definition for wrapping blocks (e.g., "- " → bullet list, "> " → blockquote).
 *
 * @param {CreateWrappingRuleOptions}options - Rule configuration including pattern, target node type, and optional attributes.
 * @returns {InputRuleDefinition}An InputRuleDefinition that dispatches a wrapping command.
 *
 * Note: The handler computes attributes from the match but delegates all PM state
 * manipulation to the command framework via dispatchCommand().
 */
export function createWrappingRule(options: CreateWrappingRuleOptions): InputRuleDefinition {
    return {
        id: options.id,
        pattern: options.pattern,
        allowUndo: options.allowUndo ?? true,

        handler(ctx: InputRuleContext): void {
            const attrs: Record<string, unknown> =
                typeof options.attributeProvider === 'function'
                    ? options.attributeProvider(ctx.match)
                    : options.attributeProvider ?? {};
            ctx.dispatchCommand(
                'inputRuleWrap',
                {
                    nodeType: options.target,
                    attrs,
                    matchStart: ctx.start,
                    matchEnd: ctx.end
                }
            );
        }
    };
}
