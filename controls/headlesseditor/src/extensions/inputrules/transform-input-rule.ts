import { InputRuleContext, InputRuleDefinition } from '../types';

/**
 * Creates a text block input rule.
 *
 * @param {CreateTextBlockRuleOptions} options - rule configuration.
 * @returns {InputRuleDefinition} Input rule defination.
 */
export interface CreateTextBlockRuleOptions {
    id: string;
    pattern: RegExp;
    target: string;
    allowUndo?: boolean;
    attributeProvider?:
    | Record<string, unknown>
    | ((match: RegExpMatchArray) => Record<string, unknown>);
}

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
