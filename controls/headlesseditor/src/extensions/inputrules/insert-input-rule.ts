/**
 * Factory for creating node insertion input rule definitions.
 *
 * Extensions use this to contribute rules that insert standalone nodes (horizontal rules, leaf blocks, etc.)
 * when a text pattern matches. The rule handler uses only dispatchCommand() to apply the node insertion,
 * ensuring proper undo/redo grouping and event tracking.
 *
 * ```ts
 * const hrRule = createNodeRule({
 *   id: 'horizontal-rule',
 *   pattern: /^---$/,
 *   target: 'horizontalRule'
 * });
 * ```
 */

import { InputRuleContext, InputRuleDefinition } from '../types';

/**
 * Defines configuration options for creating a node insertion input rule.
 */
export interface CreateNodeRuleOptions {
    /**
     * Unique identifier for the rule.
     */
    id: string;

    /**
     * Regular expression pattern to match in the input text.
     */
    pattern: RegExp;

    /**
     * Target node type name to insert (e.g., 'horizontalRule', 'image').
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
 * Creates a node insertion input rule definition.
 *
 * Generates a reusable input rule that detects text patterns and inserts standalone nodes into the document.
 * The handler receives the matched positions and dispatches an 'inputRuleInsert' command to ensure
 * proper undo/redo support and command event tracking.
 *
 * @param {CreateNodeRuleOptions} options - Rule configuration options.
 *
 * @returns {InputRuleDefinition} The generated input rule definition.
 */
export function createNodeRule(options: CreateNodeRuleOptions): InputRuleDefinition {
    return {
        id: options.id,
        pattern: options.pattern,
        allowUndo: options.allowUndo ?? true,
        handler(ctx: InputRuleContext): void {
            const attrs: Record<string, unknown> = typeof options.attributeProvider === 'function'
                ? options.attributeProvider(ctx.match)
                : options.attributeProvider ?? {};
            ctx.dispatchCommand(
                'inputRuleInsert',
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
