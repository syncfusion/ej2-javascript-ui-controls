
import { PMEditorState, PMNodeType, PMResolvedPos } from '../../pm/pm-guard';

/**
 * Returns the depth of the nearest `codeBlock` ancestor of `$pos`,
 * or `-1` when not inside one.
 *
 * @param {PMResolvedPos} $pos - Resolved document position to inspect.
 * @returns {number} Depth of the nearest `codeBlock` ancestor, or `-1`.
 */
function findCodeBlockDepth($pos: PMResolvedPos): number {
    for (let d: number = $pos.depth; d >= 0; d--) {
        if ($pos.node(d).type.name === 'codeBlock') { return d; }
    }
    return -1;
}

/**
 * Gets the text content of the code block associated with the current selection.
 *
 * @param {PMEditorState} pmState - The current ProseMirror editor state.
 * @returns {string} The text content of the code block, or an empty string if no code block is available.
 *
 * @hidden
 */
export function getCodeBlockContent(pmState: PMEditorState): string {
    const codeBlockType: PMNodeType | undefined = pmState.schema.nodes['codeBlock'];
    if (!codeBlockType) { return ''; }

    const depth: number = findCodeBlockDepth(pmState.selection.$from);
    if (depth !== -1) {
        const node: { textContent?: string } | null = pmState.selection.$from.node(depth);
        return node && typeof node.textContent === 'string' ? node.textContent : '';
    }

    // Fallback: walk the doc for the first codeBlock and read its
    // textContent. This consumes ProseMirror's resolved-position path
    // (`doc.nodeAt(pos).textContent`) so the same line-merging rules
    // that the editor uses internally apply — no risk of a hand-rolled
    // text concat duplicating separators or skipping hard-break nodes.
    let found: { pos: number } | null = null;
    pmState.doc.descendants((node: { type: { name: string } }, pos: number): boolean => {
        if (node.type.name === 'codeBlock') {
            found = { pos };
            return false; // stop the walk on first hit
        }
        return true;
    });
    if (!found) { return ''; }

    const target: { textContent?: string } | null = pmState.doc.nodeAt(found.pos) as { textContent?: string } | null;
    return target && typeof target.textContent === 'string' ? target.textContent : '';
}

/**
 * Gets the language of the code block associated with the current selection.
 *
 * @param {PMEditorState} pmState - The current ProseMirror editor state.
 * @returns {string} The language of the code block, or an empty string if no code block is available.
 *
 * @hidden
 */

export function getCodeBlockLanguage(pmState: PMEditorState): string {
    const codeBlockType: PMNodeType | undefined = pmState.schema.nodes['codeBlock'];
    if (!codeBlockType) { return ''; }

    const depth: number = findCodeBlockDepth(pmState.selection.$from);
    if (depth !== -1) {
        const node: { attrs?: Record<string, unknown> } | null = pmState.selection.$from.node(depth);
        if (!node || !node.attrs) { return ''; }
        const language: unknown = node.attrs['language'];
        return typeof language === 'string' ? language : '';
    }

    // Fallback: walk the doc for the first codeBlock and read its
    // language attribute. This mirrors `setCodeBlockLanguage` /
    // `readCodeBlockContent` so all three header surfaces stay
    // consistent when the cursor sits outside the code block.
    let found: { pos: number } | null = null;
    pmState.doc.descendants((node: { type: { name: string } }, pos: number): boolean => {
        if (node.type.name === 'codeBlock') {
            found = { pos };
            return false; // stop the walk on first hit
        }
        return true;
    });
    if (!found) { return ''; }

    const target: { attrs?: Record<string, unknown> } | null =
        pmState.doc.nodeAt(found.pos) as { attrs?: Record<string, unknown> } | null;
    if (!target || !target.attrs) { return ''; }
    const language: unknown = target.attrs['language'];
    return typeof language === 'string' ? language : '';
}
