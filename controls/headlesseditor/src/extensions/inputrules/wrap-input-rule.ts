/**
 * Factory for creating block wrapping input rule definitions.
 *
 * Extensions use this to contribute rules that wrap content in block containers (bullet lists, ordered lists,
 * blockquotes, etc.). The rule handler uses only dispatchCommand() to apply the wrapping,
 * ensuring proper undo/redo grouping and event tracking.
 *
 * ```ts
 * const bulletListRule = createWrappingRule({
 *   id: 'bullet-list-rule',
 *   pattern: /^\s*[-*]\s+/,
 *   target: 'bulletList'
 * });
 * ```
 */

import { InputRuleContext, InputRuleDefinition } from '../types';

/**
 * Defines configuration options for creating a block wrapping input rule.
 */
export interface CreateWrappingRuleOptions {
    /**
     * Unique identifier for the rule.
     */
    id: string;

    /**
     * Regular expression pattern to match in the input text.
     */
    pattern: RegExp;

    /**
     * Target wrapper node type (e.g., 'bulletList', 'orderedList', 'blockquote').
     */
    target: string;

    /**
     * If set to true, enables undo support for the rule. @default true
     */
    allowUndo?: boolean;

    /**
     * Static attributes or a function that computes attributes from the regex match.
     * Used to populate wrapper node attributes when the rule is triggered.
     */
    attributeProvider?:
    | Record<string, unknown>
    | ((match: RegExpMatchArray) => Record<string, unknown>);
}

/**
 * Creates a block wrapping input rule definition.
 *
 * Generates a reusable input rule that detects text patterns and wraps the current block within a container node.
 * Useful for creating lists, blockquotes, and other wrapper structures. The handler receives the matched positions
 * and dispatches an 'inputRuleWrap' command to ensure proper undo/redo support and command event tracking.
 *
 * @param {CreateWrappingRuleOptions} options - Rule configuration options.
 *
 * @returns {InputRuleDefinition} The generated input rule definition.
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
