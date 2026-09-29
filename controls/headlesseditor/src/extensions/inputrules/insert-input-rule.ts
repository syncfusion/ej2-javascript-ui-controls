/**
 * Factory for creating node insertion input rule definitions (horizontal rule, leaf blocks, etc.).
 * Extensions use this to contribute rules that insert nodes when a pattern matches.
 *
 * The rule handler uses ONLY dispatchCommand() to apply the node insertion,
 * ensuring proper undo/redo grouping and event tracking.
 */

import { InputRuleContext, InputRuleDefinition } from '../types';

/**
 **Creates a node input rule.
 *
 * @param {CreateNodeRuleOptions} options - Rule configuration.
 * @returns {InputRuleDefinition} Input rule *efinition.
 */
export interface CreateNodeRuleOptions {
    id: string;
    pattern: RegExp;
    target: string; // Node type name (e.g., 'horizontalRule')
    allowUndo?: boolean;
    attributeProvider?:
    | Record<string, unknown>
    | ((match: RegExpMatchArray) => Record<string, unknown>);
}
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
