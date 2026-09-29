import { InputRuleContext, InputRuleDefinition } from '../types';

/**
 * Creates a link input rule.
 *
 * @param {CreateLinkRuleOptions} options - Rule configuration.
 * @returns {InputRuleDefinition} Input rule definition.
 */
export interface CreateLinkRuleOptions {
    id: string;
    pattern: RegExp;
    allowUndo?: boolean;
}
export function createLinkRule(options: CreateLinkRuleOptions): InputRuleDefinition {
    return {
        id: options.id,
        pattern: options.pattern,
        allowUndo: options.allowUndo ?? true,
        handler(ctx: InputRuleContext): void {
            const fullMatch: string = ctx.match[0];
            let text: string;
            let href: string;
            // Markdown link:
            // [Google](https://google.com)
            if (ctx.match.length >= 3) {
                text = ctx.match[1];
                href = ctx.match[2];
            } else {
                // URL / Email auto-link
                text = fullMatch;
                href = fullMatch.startsWith('www.') ? `https://${fullMatch}` : fullMatch;
            }
            ctx.dispatchCommand(
                'inputRuleMark',
                {
                    markType: 'link',
                    text,
                    matchStart: ctx.start,
                    matchEnd: ctx.end,
                    attrs: {href}
                }
            );
        }
    };
}
