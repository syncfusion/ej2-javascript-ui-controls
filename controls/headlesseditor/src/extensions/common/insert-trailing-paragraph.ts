/**
 * Special-block insertion helpers.
 *
 * Decomposed into pure functions that compose into the *caller's* existing
 * `PMTransaction`. No new position helper is introduced — block-position
 * lookup uses the `tr.doc.descendants((node, pos) => ...)` walk that Image's
 * existing command already relies on (`commands/builtins/image/insert-image.ts`).
 *
 * Boundary: PM imports go through `pm/pm-guard` only.
 */

import { PMNode, PMNodeType, PMSchema, PMTransaction, TextSelection } from '../../pm/pm-guard';

/**
 * Focus rule applied after a special block is inserted at document end.
 *
 * `trailing-paragraph`        Focus the appended trailing paragraph.
 * `block-deep-first-text-pos` Focus the first valid text position inside
 *                             the inserted block.
 *
 * Table's first-cell focus remains owned by the table command adapter.
 *
 * @hidden
 */
export type SpecialBlockFocusAfter =
    | 'trailing-paragraph'
    | 'block-deep-first-text-pos';

/**
 * Appends one Paragraph at the document end iff the block at `blockPos`
 * is the current last top-level child of `tr.doc`.
 *
 * Uses the block's document position instead of PMNode object identity so
 * the check remains valid if transaction steps recreate or normalize nodes.
 *
 * @param  {PMTransaction} tr        Current insertion transaction.
 * @param  {PMSchema}      schema    Editor schema used to create a paragraph.
 * @param  {number}        blockPos  Start position of the inserted block.
 * @returns {boolean}                `true` when a Paragraph was appended.
 *
 * @hidden
 */
export function appendTrailingParagraphIfFinal(
    tr: PMTransaction,
    schema: PMSchema,
    blockPos: number
): boolean {
    if (tr.doc.childCount === 0) {
        return false;
    }
    const lastChild: PMNode = tr.doc.child(tr.doc.childCount - 1);
    const lastChildPos: number =
        tr.doc.content.size - lastChild.nodeSize;
    if (lastChildPos !== blockPos) {
        return false;
    }
    const paragraphType: PMNodeType | undefined =
        schema.nodes['paragraph'];
    const trailing: PMNode | null = paragraphType
        ? paragraphType.createAndFill()
        : null;
    if (!trailing) {
        return false;
    }
    tr.insert(tr.doc.content.size, trailing);
    return true;
}

/**
 * Sets the editor selection per the supplied rule.
 *
 * Resolves the current block from its document position instead of relying
 * on PMNode object identity.
 *
 * @param  {PMTransaction}          tr        Open transaction.
 * @param  {number}                  blockPos  Start position of the block.
 * @param  {SpecialBlockFocusAfter} rule      Focus rule to apply after insertion.
 * @returns {boolean}                         `true` when the selection was set.
 *
 * @hidden
 */
export function focusAfterBlock(
    tr: PMTransaction,
    blockPos: number,
    rule: SpecialBlockFocusAfter
): boolean {
    const block: PMNode | null = tr.doc.nodeAt(blockPos);
    if (!block) {
        return false;
    }
    switch (rule) {
    case 'trailing-paragraph': {
        // Appended Paragraph is the last child; block is the second-to-last.
        // Paragraph start = blockPos + block.nodeSize.
        const paragraphStart: number = blockPos + block.nodeSize;
        const inner: number = paragraphStart + 1;
        tr.setSelection(
            TextSelection.create(tr.doc, inner)
        );
        return true;
    }
    case 'block-deep-first-text-pos': {
        const inner: number = blockPos + 1;
        tr.setSelection(
            TextSelection.near(tr.doc.resolve(inner), 1)
        );
        return true;
    }
    }
}
