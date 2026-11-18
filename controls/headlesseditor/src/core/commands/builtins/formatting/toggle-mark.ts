/**
 * toggle-mark.ts — Internal infrastructure command for toggling inline marks.
 *
 * This is NOT in typed-surface.d.ts. Public facades (toggle-bold, etc.)
 * delegate to this command with a fixed markType.
 *
 * Uses ProseMirror's `removeWhenPresent: false` ("all" semantics) for
 * range selections: the mark is only removed when EVERY node in the
 * selection already carries it. On a partially formatted ("mixed")
 * selection the command instead applies the mark across the whole
 * range, so toggling Bold over a paragraph that is half bold makes
 * the entire paragraph bold. The default "some" semantics would
 * strip the existing formatting instead — the exact defect this
 * prevents.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../../pm/adapters/editor-state-adapter';
import { pmToggleMark } from '../../../../pm/pm-guard';
import { PMCommand, PMEditorState, PMTransaction, PMMarkType, PMSchema, PMNode, PMResolvedPos, TextSelection } from '../../../../pm/pm-guard';

export interface ToggleMarkPayload {
    markType: string;
    attrs?: Record<string, unknown>;
}

/**
 * Options passed to ProseMirror's toggleMark for every toggle facade.
 * `removeWhenPresent: false` is the "all" toggle described above.
 */
const TOGGLE_OPTIONS: { removeWhenPresent: false } = { removeWhenPresent: false };

// Matches characters that act as word boundaries: whitespace, separators, control characters, punctuation, and symbols.
const BOUNDARY_CHAR_REGEX: RegExp = /[\s\p{Z}\p{C}\p{P}\p{S}]/u;

/**
 * Returns true if the given character is a word boundary.
 * Word boundaries include whitespace, separators, control characters,
 * punctuation, and symbols. Letters and numbers are treated as word characters.
 *
 * @param {string} character Character to check.
 * @returns {boolean} True if the character is a word boundary.
 *
 * @hidden
 */
export function isBoundaryChar(character: string): boolean {
    return BOUNDARY_CHAR_REGEX.test(character);
}

interface CursorSelection {
    // Editor state with the selection
    state: PMEditorState;
    // Caret position to restore after the cursor selection.
    // Set only when the selection was expanded.
    cursorPosition?: number;
}

export interface WordRange {
    // Cursor offset within the text node.
    cursorOffset: number;
    // Word start offset.
    start: number;
    // Word end offset.
    end: number;
}

/**
 * Returns the word range containing the cursor within a text node,
 * or null if the cursor is not inside a word.
 *
 * @param {PMResolvedPos} $pos Cursor position to inspect.
 * @returns {WordRange | null} Word offsets relative to the text node, or null.
 *
 * @hidden
 */
export function wordRangeAround($pos: PMResolvedPos): WordRange | null {
    // Get the parent node that contains the cursor.
    const parent: PMNode = $pos.parent;
    // Process only text blocks.
    if (!parent.isTextblock) {
        return null;
    }
    // Get the index of the child containing the cursor.
    const childIndex: number = $pos.index();
    // Calculate the total size of nodes before the current text node..
    let priorNodeSize: number = 0;
    for (let i: number = 0; i < childIndex; i++) {
        priorNodeSize += parent.child(i).nodeSize;
    }
    // Get the cursor offset within the current text node.
    const cursorOffset: number = $pos.parentOffset - priorNodeSize;
    // Get the text node containing the cursor.
    const textNode: PMNode | null = parent.maybeChild(childIndex);
    // Return if the cursor is not inside a valid text node.
    if (textNode?.isText !== true || cursorOffset <= 0 || cursorOffset >= textNode.nodeSize) {
        return null;
    }
    const text: string = textNode.text as string;
    // Return if the cursor is at a word boundary.
    if (isBoundaryChar(text.charAt(cursorOffset - 1)) || isBoundaryChar(text.charAt(cursorOffset))) {
        return null;
    }
    // Find the start and end of the word containing the cursor.
    let wordStart: number = cursorOffset;
    let wordEnd: number = cursorOffset;
    // Expand left until a word boundary is reached.
    while (wordStart > 0 && !isBoundaryChar(text.charAt(wordStart - 1))) {
        wordStart--;
    }
    // Expand right until a word boundary is reached.
    while (wordEnd < text.length && !isBoundaryChar(text.charAt(wordEnd))) {
        wordEnd++;
    }
    // Return if no word was found.
    if (wordStart === wordEnd) {
        return null;
    }
    // Return the detected word range
    return { cursorOffset, start: wordStart, end: wordEnd };
}

/**
 * Expands a collapsed cursor to the current word and returns it as a selection.
 *
 * If the cursor is inside a word, the word is temporarily selected so formatting can be applied to it.
 * Otherwise, the original cursor position is preserved.
 *
 * @param {PMEditorState} pmState Current editor state.
 * @returns {CursorSelection} Editor state with the expanded selection and the original cursor position.
 */
function getCursorSelection(pmState: PMEditorState): CursorSelection {
    // Get the current cursor position.
    const cursor: PMResolvedPos = pmState.selection.$from;
    // Process only collapsed selections inside text blocks.
    if (!pmState.selection.empty || !cursor.parent.isTextblock) {
        return { state: pmState };
    }
    // Get the word range around the cursor.
    const word: WordRange | null = wordRangeAround(cursor);
    // Return the original state when no word is found.
    if (word === null) {
        return { state: pmState };
    }
    // Convert word offsets to document positions.
    const textFrom: number = cursor.pos - word.cursorOffset + word.start;
    const textTo: number = cursor.pos - word.cursorOffset + word.end;
    return {
        // Expand the selection to cover the word.
        state: pmState.apply(pmState.tr.setSelection(TextSelection.create(pmState.doc, textFrom, textTo))),
        // Preserve the original cursor position.
        cursorPosition: pmState.selection.from
    };
}

export const toggleMarkCommand: PMCommandInternal<ToggleMarkPayload> = {
    name: 'toggleMark',
    meta: { label: 'Toggle Mark', category: 'formatting' },

    canExecute(ctx: PMCommandContext, payload: ToggleMarkPayload): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const schema: PMSchema = pmState.schema;
        const markType: PMMarkType = schema.marks[payload.markType];
        if (!markType) { return false; }
        const markAttrs: Record<string, unknown> | undefined = payload.attrs;
        const cmd: PMCommand = pmToggleMark(markType, markAttrs, TOGGLE_OPTIONS);
        return cmd(getCursorSelection(pmState).state);
    },

    execute(ctx: PMCommandContext, payload: ToggleMarkPayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const schema: PMSchema = pmState.schema;
        const markType: PMMarkType = schema.marks[payload.markType];
        if (!markType) { return; }

        const markAttrs: Record<string, unknown> | undefined = payload.attrs;
        const cmd: PMCommand = pmToggleMark(markType, markAttrs, TOGGLE_OPTIONS);
        const cursorSelection: CursorSelection = getCursorSelection(pmState);
        cmd(cursorSelection.state, (tr: PMTransaction) => {
            if (cursorSelection.cursorPosition !== undefined) {
                tr.setSelection(TextSelection.create(tr.doc, cursorSelection.cursorPosition));
            }
            ctx.dispatch(wrapTransaction(tr));
        });
    }
};
