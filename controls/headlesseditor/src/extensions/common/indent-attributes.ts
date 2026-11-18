/**
 * Shared indent helpers used by block-level extensions.
 */

import type { AttributeDefinition } from '../../core/schema/types/attribute-definition';

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
 * Adds margin-left styling for a positive indent value.
 *
 * @param {Record<string, unknown>} baseAttributes Existing node attributes.
 * @param {number} indentValue Indent depth (0 = no margin).
 * @returns {Record<string, unknown>} Merged attributes with updated `style`.
 *
 * @hidden
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
