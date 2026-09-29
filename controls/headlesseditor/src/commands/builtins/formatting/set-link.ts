/**
 * setLink Command
 *
 * Applies a link mark to the current selection. Optionally replaces the
 * selection with custom display text.
 *
 * Modes:
 *  - Mark-only: no displayText → selection gets the link, text unchanged
 *  - Mark + Text: displayText → selection replaced + wrapped in link
 *
 * URL is validated to block javascript:/data:/vbscript: XSS vectors.
 */

import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMMark, PMMarkType, PMSchema, PMTransaction, TextSelection } from '../../../pm/pm-guard';

export interface SetLinkPayload {
    /** Destination URL of the link. */
    href: string;
    /** Tooltip text shown on hover. */
    title?: string | null;
    /** Where to open the link (`_blank`, `_self`, etc.). */
    target?: string | null;
    /** Link relationship metadata (`noopener noreferrer`, etc.). */
    rel?: string | null;
    /**
     * Optional display text. When provided, the current selection is
     * replaced with this text in the same transaction so the link mark
     * wraps the new text. Falls back to current selection text, then href.
     * If omitted, the selection is left as-is (mark-only).
     */
    displayText?: string;
}

/**
 * Check whether a URL is safe to attach as a link.
 * Blocks XSS-via-`javascript:` and similar dangerous protocols.
 *
 * @param {string} url - The URL to validate.
 * @returns {boolean} `true` if the URL is allowed; `false` otherwise.
 */
export function isValidUrl(url: string): boolean {
    // Reject empty / whitespace-only input up front — no link to validate.
    if (!url || url.trim() === '') {
        return false;
    }

    // XSS blocklist: protocols that can execute arbitrary code on click.
    const blockedProtocols: string[] = ['javascript:', 'data:', 'vbscript:'];
    // Common safe protocols plus root-relative paths (`/foo`).
    const allowedProtocols: string[] = ['http://', 'https://', 'mailto:', 'tel:', 'ftp://', '/'];
    // Lowercase once for case-insensitive protocol matching.
    const lowerUrl: string = url.toLowerCase();

    // 1. Block dangerous protocols first — overrides any later allow match.
    if (blockedProtocols.some((proto: string) => lowerUrl.startsWith(proto))) {
        return false;
    }
    // 2. Accept known safe protocols.
    if (allowedProtocols.some((proto: string) => lowerUrl.startsWith(proto))) {
        return true;
    }
    // 3. Relative paths and in-page anchors are always safe.
    if (lowerUrl.startsWith('.') || lowerUrl.startsWith('#')) {
        return true;
    }
    // 4. Bare hostnames (e.g. "google.com") — the browser will prepend a protocol.
    if (lowerUrl.includes('.') && !lowerUrl.includes(' ')) {
        return true; // bare hostname like "google.com" — browser adds protocol
    }

    // 5. Anything else (e.g. random text, malformed input) is rejected.
    return false;
}

/**
 * Build a link mark attribute object from a setLink payload.
 * `displayText` is excluded — it controls text insertion, not mark attrs.
 *
 * @param {SetLinkPayload} payload - The setLink command payload.
 * @returns {Record<string, string | null>} Attribute object for `markType.create()`.
 */
export function buildLinkAttrs(payload: SetLinkPayload): Record<string, string | null> {
    return {
        href: payload.href,
        title: payload.title ?? null,
        target: payload.target ?? null,
        rel: payload.rel ?? null
    };
}

/**
 * Command: setLink
 *
 * Applies a link mark. If `displayText` is provided, also replaces the
 * selection with that text — both in a single PM transaction.
 *
 * @example
 * Mark only:
 * ```typescript
 * editor.execute('setLink', { href: 'https://example.com' });
 * ```
 *
 * @example
 * Mark + display text:
 * ```typescript
 * editor.execute('setLink', { href: 'https://example.com', displayText: 'Click here' });
 * ```
 */
export const setLinkCommand: PMCommandInternal<SetLinkPayload> = {
    name: 'setLink',
    meta: { label: 'Set Link', category: 'formatting', shortcut: 'Mod-k' },

    /**
     * Refuse the command when the payload is missing or the URL is unsafe.
     * Only `href` is checked here — `displayText` is plain text.
     *
     * @param {PMCommandContext} _ctx - The command execution context (unused).
     * @param {SetLinkPayload} payload - The setLink command payload.
     * @returns {boolean} `true` if the command may run.
     */
    canExecute(_ctx: PMCommandContext, payload: SetLinkPayload): boolean {
        if (!payload || !payload.href) {
            return false;
        }
        // XSS gate: refuse dangerous protocols before delegating to PM.
        return isValidUrl(payload.href);
    },

    /**
     * Applies the link mark to the current selection. If `displayText` is
     * provided, also replaces the selection with that text.
     *
     * @param {PMCommandContext} ctx - The command execution context.
     * @param {SetLinkPayload} payload - The setLink command payload.
     * @returns {void}
     */
    execute(ctx: PMCommandContext, payload: SetLinkPayload): void {
        // Resolve the link mark type from the schema.
        const pmState: PMEditorState = ctx.pmState;
        const schema: PMSchema = pmState.schema;
        const markType: PMMarkType = schema.marks.link;
        if (!markType) {
            return;
        }

        const { from, to, empty } = pmState.selection;
        const providedText: string = (payload.displayText ?? '').trim();
        // Whether the caller passed a non-empty displayText.
        const hasProvidedText: boolean = providedText.length > 0;
        // Text inside the current selection (empty for cursor-only).
        const selectedText: string = empty ? '' : pmState.doc.textBetween(from, to, '\n', '\ufffc');
        // Final display text: provided → selection → href.
        const displayText: string = hasProvidedText ? providedText : selectedText || payload.href;

        // addMark overwrites any existing link in the range with these new attrs.
        const linkMark: PMMark = markType.create(buildLinkAttrs(payload));
        let transaction: PMTransaction = pmState.tr;

        // Empty selection: store the mark for the next typed character.
        // Otherwise: apply the mark across the selected range.
        if (empty) {
            transaction = transaction.addStoredMark(linkMark);
        } else {
            transaction = transaction.addMark(from, to, linkMark);
        }

        // Replace the selection with displayText so the new text inherits the link.
        if (hasProvidedText) {
            transaction = transaction.insertText(displayText, from, to);
            if (!empty) {
                transaction = transaction.setSelection(
                    TextSelection.create(transaction.doc, from, from + displayText.length)
                );
            }
        }

        ctx.dispatch(wrapTransaction(transaction));
    }
};
