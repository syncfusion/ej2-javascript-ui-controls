/**
 * AttributeDefinition — describes a typed attribute on a node or mark.
 */
export interface AttributeDefinition {
    /** Attribute name as it appears in EditorNode.attrs. */
    name: string;
    /** Value type. Use 'enum' for a fixed set of values. */
    type: 'string' | 'number' | 'boolean' | 'enum';
    /** Default value — required so PM schema always has a fallback. */
    default?: unknown;
    /** If true, the attribute must be supplied explicitly; no default is used. */
    required?: boolean;
    /** Allowed values when type is 'enum'. Must be non-empty when type is 'enum'. */
    values?: string[];
}

/**
 * Validates an AttributeDefinition.
 * Throws if type is 'enum' and values is missing or empty.
 *
 * @param {AttributeDefinition} attr - The attribute definition to validate.
 * @returns {void}
 */
export function validateAttributeDefinition(attr: AttributeDefinition): void {
    if (attr.type === 'enum') {
        if (!attr.values || attr.values.length === 0) {
            throw new Error(
                `AttributeDefinition '${attr.name}': type 'enum' requires a non-empty 'values' array.`
            );
        }
    }
}
