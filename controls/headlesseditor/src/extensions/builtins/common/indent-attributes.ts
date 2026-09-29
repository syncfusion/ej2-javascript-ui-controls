/**
 * Shared indent helpers used by block-level extensions.
 */

import type { AttributeDefinition } from '../../../schema/types/attribute-definition';

/** Pixel width of one indent step. Indent value `n` renders as `n * INDENT_STEP_PX`. */
export const INDENT_STEP_PX: number = 20;

/**
 * Shared indent attribute.
 */
export const indentAttribute: AttributeDefinition = {
    name: 'indent',
    type: 'number',
    default: 0
};

/**
 * Returns true when the value is a valid indent step.
 *
 * @param {number | string} value Candidate value (typically `nodeAttrs['indent']`).
 * @returns {boolean} `true` when `value` is a valid indent step.
 */
export function isIndentStep(value: unknown): value is number {
    return typeof value === 'number'
        && Number.isFinite(value)
        && value >= 0
        && Math.floor(value) === value;
}

/**
 * Adds margin-left styling for a positive indent value.
 *
 * @param {Record<string, unknown>} baseAttributes Existing node attributes.
 * @param {number} indentValue Indent depth (0 = no margin).
 * @returns {Record<string, unknown>} Merged attributes with updated `style`.
 */
export function mergeIndentStyle(baseAttributes: Record<string, unknown>, indentValue: unknown): Record<string, unknown> {
    const rawIndent: number = typeof indentValue === 'number' && Number.isFinite(indentValue)
        ? Math.floor(indentValue)
        : 0;
    // No indent to apply.
    if (rawIndent <= 0) {
        return baseAttributes;
    }
    const currentStyleString: string = typeof baseAttributes['style'] === 'string'
        ? baseAttributes['style'].trim()
        : '';
    const newMarginStyle: string = `margin-left: ${rawIndent * 20}px;`;
    // Combine cleanly with any existing styles (like text-alignment)
    const updatedStyleString: string = currentStyleString
        ? `${currentStyleString.endsWith(';') ? currentStyleString : currentStyleString + ';'} ${newMarginStyle}`
        : newMarginStyle;
    return {
        ...baseAttributes,
        style: updatedStyleString
    };
}
