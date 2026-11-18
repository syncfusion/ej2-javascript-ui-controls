/**
 * list-style-defaults.ts — Shared marker-style defaults for list commands.
 */

/**
 * Default marker style applied to newly created `bulletList` containers.
 */
export const DEFAULT_BULLET_LIST_STYLE: string = 'disc';

/**
 * Default marker style applied to newly created `orderedList` containers.
 */
export const DEFAULT_ORDERED_LIST_STYLE: string = 'decimal';

/**
 * Build the list-level attribute bag for a newly created or converted list
 * container, including the marker-style default for the target type.
 *
 * Only marker-style tokens that match a known `listStyleType` are honored as
 * overrides. Unrecognized tokens (or non-marker strings like legacy node IDs)
 * are treated as absent and the target type's default is applied instead.
 *
 * @param {string} listType - The logical target list type ('bullet' | 'ordered').
 * @param {string=} listStyleType - Optional explicit `listStyleType` override;
 * when omitted or unrecognized, the target type's default is applied.
 * @returns {object} The complete list-level attribute bag.
 *
 * @hidden
 */
export function buildListAttributes(
    listType: 'bullet' | 'ordered',
    listStyleType?: string
): Record<string, unknown> {
    const attrs: Record<string, unknown> = {};
    const style: string = typeof listStyleType === 'string' && listStyleType.length > 0
        ? listStyleType
        : (listType === 'ordered' ? DEFAULT_ORDERED_LIST_STYLE : DEFAULT_BULLET_LIST_STYLE);
    if (listType === 'ordered') {
        attrs['order'] = 1;
    }
    attrs['listStyleType'] = style;
    return attrs;
}
