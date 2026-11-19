/**
 * Factory for creating link input rule definitions.
 *
 * Extensions use this to contribute rules that convert URL patterns and Markdown link syntax into link marks.
 * Supports both auto-linked URLs (e.g., `https://example.com` or `www.example.com`) and Markdown syntax
 * (e.g., `[text](url)`). The rule handler uses only dispatchCommand() to apply the link mark,
 * ensuring proper undo/redo grouping and event tracking.
 *
 * ```ts
 * const urlRule = createLinkRule({
 *   id: 'autolink-rule',
 *   pattern: /(?:https?:\/\/|www\.)\S+$/
 * });
 * ```
 */

import { InputRuleContext, InputRuleDefinition } from '../types';

/**
 * Defines configuration options for creating a link input rule.
 */
export interface CreateLinkRuleOptions {
    /**
     * Unique identifier for the rule.
     */
    id: string;

    /**
     * Regular expression pattern to match URLs or Markdown link syntax in the input text.
     * Can match auto-links (URLs) or Markdown-style links with capturing groups for text and href.
     */
    pattern: RegExp;

    /**
     * If set to true, enables undo support for the rule. @default true
     */
    allowUndo?: boolean;
}

/**
 * Creates a link input rule definition.
 *
 * Generates a reusable input rule that detects URL patterns and Markdown link syntax, then converts them
 * into link marks in the document. Supports both auto-linking (plain URLs) and explicit Markdown syntax.
 * The handler receives the matched positions and dispatches an 'inputRuleMark' command to ensure
 * proper undo/redo support and command event tracking.
 *
 * @param {CreateLinkRuleOptions} options - Rule configuration options.
 *
 * @returns {InputRuleDefinition} The generated input rule definition.
 */
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
