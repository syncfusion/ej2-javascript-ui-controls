/**
 * Shared building blocks for block-level text alignment.
 *
 * Every alignable block extension (paragraph, heading, blockquote, listItem,
 * taskItem) repeats the same three pieces of wiring:
 *
 *   1. A `align: string` node attribute with default `null`.
 *   2. A whitelist of allowed values (`'left' | 'center' | 'right' | 'justify'`).
 *   3. A `toDOM` branch that merges a `text-align: <value>` style onto the
 *      block's existing HTML attribute bag.
 *
 * This module is the single source of truth for all three. Block extensions
 * import `textAlignAttribute` for (1) and either `isTextAlign` (2/3) or
 * `mergeAlignStyle` (2/3) — never both — to render the inline style.
 */

import type { AttributeDefinition } from '../../../schema/types/attribute-definition';

/**
 * The literal union of supported alignment values.
 *
 * `as const` keeps the tuple narrow so `TextAlignValue` collapses to the
 * exact union rather than widening to `string`.
 */
export const TEXT_ALIGN_VALUES: readonly ['left', 'center', 'right', 'justify'] = [
    'left',
    'center',
    'right',
    'justify'
] as const;

/**
 * The narrow type accepted by the `setTextAlign` command and stored in the
 * `align` node attribute.
 */
export type TextAlignValue = typeof TEXT_ALIGN_VALUES[number];

/**
 * The `align` node attribute, shared by every alignable block.
 *
 * `default: null` mirrors the existing inline definitions exactly — the
 * `null` fallback is what tells `unsetTextAlign` "no value to clear".
 */
export const textAlignAttribute: AttributeDefinition = {
    name: 'align',
    type: 'string',
    default: null
};

/**
 * Type guard for the `align` attribute.
 *
 * Use this when the block extension renders the align value inline (e.g.
 * task-list's NodeView fallback) and only needs the yes/no check.
 *
 * @param {unknown} value Candidate value (typically `nodeAttrs['align']`).
 * @returns {boolean} `true` when `value` is a valid alignment literal.
 */
export function isTextAlign(value: unknown): value is TextAlignValue {
    return typeof value === 'string'
        && (TEXT_ALIGN_VALUES as readonly string[]).indexOf(value) !== -1;
}

/**
 * Merge a `text-align: <value>` declaration onto a base attribute bag when
 * `align` is a recognized value; otherwise return the bag unchanged.
 *
 * The returned object is always a fresh shallow copy so callers can safely
 * mutate the base bag (which is usually a `Readonly<Record<string, string>>`
 * from `this.options.htmlAttributes`) without aliasing.
 *
 * @param {Readonly<Record<string, string>>} baseAttrs Existing HTML attribute bag.
 * @param {unknown} align Candidate align value.
 * @returns {Record<string, string>} Either `baseAttrs` or a new bag with `style` set.
 */
export function mergeAlignStyle(
    baseAttrs: Readonly<Record<string, string>>,
    align: unknown
): Record<string, string> {
    if (isTextAlign(align)) {
        return { ...baseAttrs, style: `text-align: ${align}` };
    }
    return { ...baseAttrs };
}
