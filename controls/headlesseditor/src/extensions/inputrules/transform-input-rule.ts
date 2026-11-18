/**
 * Factory for creating text block transformation input rule definitions.
 *
 * Extensions use this to contribute rules that transform existing text blocks into different node types
 * (e.g., paragraph to heading, text to code block, etc.). The rule handler uses only dispatchCommand()
 * to apply the transformation, ensuring proper undo/redo grouping and event tracking.
 *
 * ```ts
 * const headingRule = createTextBlockRule({
 *   id: 'heading-rule',
 *   pattern: /^(#{1,6})\s+/,
 *   target: 'heading',
 *   attributeProvider: (match) => ({ level: match[1].length })
 * });
 * ```
 */

import { InputRuleContext, InputRuleDefinition } from '../types';

/**
 * Defines configuration options for creating a text block transformation input rule.
 */
export interface CreateTextBlockRuleOptions {
    /**
     * Unique identifier for the rule.
     */
    id: string;

    /**
     * Regular expression pattern to match in the input text.
     */
    pattern: RegExp;

    /**
     * Target block node type to transform the current block into (e.g., 'heading', 'codeBlock').
     */
    target: string;

    /**
     * If set to true, enables undo support for the rule. @default true
     */
    allowUndo?: boolean;

    /**
     * Static attributes or a function that computes attributes from the regex match.
     * Used to populate node attributes when the rule is triggered.
     */
    attributeProvider?:
    | Record<string, unknown>
    | ((match: RegExpMatchArray) => Record<string, unknown>);
}

/**
 * Creates a text block transformation input rule definition.
 *
 * Generates a reusable input rule that detects text patterns and transforms the current text block into
 * a different node type. The handler receives the matched positions and dispatches an 'inputRuleTransform'
 * command to ensure proper undo/redo support and command event tracking.
 *
 * @param {CreateTextBlockRuleOptions} options - Rule configuration options.
 *
 * @returns {InputRuleDefinition} The generated input rule definition.
 */
export function createTextBlockRule(options: CreateTextBlockRuleOptions): InputRuleDefinition {
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
                'inputRuleTransform',
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
