/**
 * lower-case.ts — Public facade: convert selected text to lowercase.
 *
 * Reads the current selection's text, transforms it, and dispatches
 * a single transaction that replaces the range. Inline marks on the
 * original range are preserved.
 */

import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMFragment, PMNode, PMSlice, PMTransaction, PMSelection, TextSelection } from '../../../pm/pm-guard';

export const toLowerCaseCommand: PMCommandInternal<void> = {
    name: 'toLowerCase',
    meta: { label: 'lowercase', category: 'formatting', shortcut: 'Mod-Shift-l' },

    canExecute(_ctx: PMCommandContext): boolean {
        return true;
    },

    execute(ctx: PMCommandContext): void {
        const pmState: PMEditorState = ctx.pmState;
        const selection: PMSelection = pmState.selection;
        if (selection.empty) {
            return;
        }
        const transformNode: (node: PMNode) => PMNode = (node: PMNode): PMNode => {
            if (node.isText) {
                const text: string = node.text === undefined ? '' : node.text;
                return pmState.schema.text(text.toLowerCase(), node.marks);
            }
            const content: PMFragment = PMFragment.fromArray(node.content.content.map(transformNode));
            return node.copy(content);
        };
        const selectedSlice: PMSlice = selection.content();
        const transformedSlice: PMSlice = new PMSlice(
            PMFragment.fromArray(selectedSlice.content.content.map(transformNode)),
            selectedSlice.openStart,
            selectedSlice.openEnd
        );
        const transaction: PMTransaction = pmState.tr.replaceSelection(transformedSlice);
        if (transaction.docChanged) {
            // Upper/lower-case preserves content length, so the original range (from..to)
            // still maps to the transformed text. Restoring it keeps the selection visible
            // across cross-block partial selections where replaceSelection would otherwise
            // collapse the selection.
            transaction.setSelection(TextSelection.create(transaction.doc, selection.from, selection.to));
            ctx.dispatch(wrapTransaction(transaction));
        }
    }
};
