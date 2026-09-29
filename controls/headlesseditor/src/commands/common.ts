/**
 * preserve-block-format.ts — Shared helper for `setBlockType` calls that need
 * to preserve the source block's `align` / `indent` attributes while still
 * layering the new attributes on top (e.g. converting a paragraph to a heading
 * must keep its existing `indent: 2` and `align: "right"`).
 *
 * Without this helper, `prosemirror-commands.setBlockType` overwrites the
 * entire attribute bag with whatever the caller passes, dropping every
 * pre-existing attribute that the caller did not explicitly forward.
 */

import { PMNode } from '../pm/pm-guard';

const PRESERVED_BLOCK_ATTRS: readonly string[] = ['align', 'indent'];

/**
 * Returns a fresh attribute bag that starts from the source node's existing
 * attribute values (filtered to {@link PRESERVED_BLOCK_ATTRS}) and layers the
 * caller-supplied `newAttrs` on top.
 *
 * `id` is intentionally NOT preserved — every transformed node receives a
 * fresh stable ID from `DefaultIdGenerator` (see `transformNodeCommand` for
 * the precedent). Pass the caller-supplied `id` explicitly in `newAttrs`
 * when you need a specific value.
 *
 * @param {PMNode} oldNode - The original block node being transformed.
 * @param {Record<string, unknown> | undefined} newAttrs - The new attrs to apply on top.
 * @returns {Record<string, unknown>} A merged attribute bag.
 * @hidden
 */
export function preserveBlockFormat(
    oldNode: PMNode,
    newAttrs: Record<string, unknown> | undefined
): Record<string, unknown> {
    const preserved: Record<string, unknown> = {};
    const sourceAttrs: Record<string, unknown> = (oldNode && oldNode.attrs)
        ? (oldNode.attrs as Record<string, unknown>)
        : {};
    for (const name of PRESERVED_BLOCK_ATTRS) {
        if (Object.prototype.hasOwnProperty.call(sourceAttrs, name)) {
            // eslint-disable-next-line security/detect-object-injection
            const value: unknown = sourceAttrs[name];
            // Skip explicit `undefined` values so the spread doesn't reintroduce
            // the key with an `undefined` value. The caller-supplied newAttrs
            // still wins for any key it explicitly supplies (including `null`,
            // which is the schema "no value" sentinel for align).
            if (value !== undefined) {
                // eslint-disable-next-line security/detect-object-injection
                preserved[name] = value;
            }
        }
    }
    return { ...preserved, ...(newAttrs ?? {}) };
}
