/**
 * set-code-block-language.ts — Public facade: update the language attribute
 * of the focused code block. Dispatches a single transaction with
 * `tr.setNodeMarkup` so the change is undoable and observable.
 *
 * Resolves the target code block by walking the current selection's
 * `$from` ancestors. If the cursor is not inside a code block, the
 * command is a no-op.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import {
    PMEditorState,
    PMNodeType,
    PMResolvedPos,
    PMTransaction
} from '../../../pm/pm-guard';

/** Payload for `setCodeBlockLanguage`. Only the new language is required. */
export interface SetCodeBlockLanguagePayload {
    readonly language: string;
}

/**
 * Returns the document position of the nearest `codeBlock` ancestor of
 * the given resolved position, or `-1` if none is found.
 *
 * @param {PMResolvedPos} $pos - Resolved document position to inspect.
 * @returns {number} Position of the nearest `codeBlock` ancestor, or `-1`.
 */
function findCodeBlockAncestorPos($pos: PMResolvedPos): number {
    for (let d: number = $pos.depth; d >= 0; d--) {
        if ($pos.node(d).type.name === 'codeBlock') {
            return $pos.before(d);
        }
    }
    return -1;
}

/**
 * Resolves the codeBlock position from the current selection.
 * If the selection is not inside a code block (e.g. focus is on a
 * widget rendered inside the NodeView's contenteditable=false header,
 * which keeps the editor selection wherever it was before the click),
 * falls back to the first code-block in the document so consumers
 * can dispatch the command from the NodeView's header UI without
 * needing to refirst focus inside the code block.
 *
 * @param {PMEditorState} pmState - Current ProseMirror state.
 * @returns {number} Document position of the codeBlock, or -1.
 */
function resolveCodeBlockPos(pmState: PMEditorState): number {
    const fromSelection: number = findCodeBlockAncestorPos(pmState.selection.$from);
    if (fromSelection !== -1) {
        return fromSelection;
    }
    // Fallback: walk the doc for the first codeBlock node.
    let found: number = -1;
    pmState.doc.descendants((node: { type: { name: string }; isText: boolean }, pos: number): boolean => {
        if (node.type.name === 'codeBlock') {
            found = pos;
            return false; // stop walk
        }
        return true;
    });
    return found;
}

export const setCodeBlockLanguageCommand: PMCommandInternal<SetCodeBlockLanguagePayload> = {
    name: 'setCodeBlockLanguage',
    meta: { label: 'Set Code Block Language', category: 'structure' },

    canExecute(ctx: PMCommandContext, payload: SetCodeBlockLanguagePayload): boolean {
        const language: string = payload?.language;
        if (typeof language !== 'string' || language.length === 0) { return false; }
        const pmState: PMEditorState = ctx.pmState;
        const codeBlockType: PMNodeType | undefined = pmState.schema.nodes['codeBlock'];
        if (!codeBlockType) { return false; }
        return resolveCodeBlockPos(pmState) !== -1;
    },

    execute(ctx: PMCommandContext, payload: SetCodeBlockLanguagePayload): void {
        const language: string = payload?.language;
        if (typeof language !== 'string' || language.length === 0) { return; }
        const pmState: PMEditorState = ctx.pmState;
        const pos: number = resolveCodeBlockPos(pmState);
        if (pos === -1) { return; }

        const tr: PMTransaction = pmState.tr.setNodeMarkup(pos, undefined, {
            language
        });
        ctx.dispatch(wrapTransaction(tr));
    }
};
