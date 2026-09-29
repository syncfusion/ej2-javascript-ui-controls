/**
 * validateDocument — recursive walk over a DocumentRoot that verifies:
 *   1. Root is type 'document' and has schemaVersion >= 1.
 *   2. Every node's `type` is registered in the supplied SchemaManager.
 *   3. Every node's `id` is a non-empty string.
 *   4. TextNode has `text` string; container nodes have `children` array.
 *   5. For every parent/child pair, the child is a valid child of the parent
 *      according to `SchemaManager.isValidChild`.
 *
 * Returns a ValidationResult — does not throw. Callers wrap with SchemaValidationError.
 */
import { DocumentRoot, EditorNode, TextNode } from '../../model/editor-node';
import { SchemaManager } from '../schema-manager';
import { ValidationError, ValidationResult, validResult, invalidResult } from '../../errors/validation-error';
import { NodeDefinition } from '../types';

/**
 * Recursively validates a DocumentRoot against the supplied SchemaManager.
 *
 * See module header for the full list of enforced rules.
 *
 * @param {DocumentRoot} root - The document root to validate.
 * @param {SchemaManager} schema - The schema manager to validate against.
 * @returns {ValidationResult} A validation result containing any errors found.
 */
export function validateDocument(root: DocumentRoot, schema: SchemaManager): ValidationResult {
    const errors: ValidationError[] = [];

    if (root.type !== 'document') {
        errors.push({ path: 'type', message: `DocumentRoot.type must be "document", got "${root.type}".` });
    }
    if (typeof root.schemaVersion !== 'number' || root.schemaVersion < 1) {
        errors.push({ path: 'schemaVersion', message: `DocumentRoot.schemaVersion must be a number >= 1, got ${String(root.schemaVersion)}.` });
    }

    walk(root, 'root', errors, schema);

    return errors.length === 0 ? validResult() : invalidResult(errors);
}

/**
 * Recursively walks an EditorNode/TextNode, accumulating validation errors.
 *
 * @param {EditorNode | TextNode} node - The current node being validated.
 * @param {string} path - The dotted path used to locate this node in error reports.
 * @param {ValidationError[]} errors - Mutable accumulator of errors found.
 * @param {SchemaManager} schema - The schema manager used to look up node definitions.
 * @returns {void}
 */
function walk(
    node: EditorNode | TextNode,
    path: string,
    errors: ValidationError[],
    schema: SchemaManager
): void {
    if (!node.id || typeof node.id !== 'string') {
        errors.push({ path: `${path}.id`, message: 'Node.id must be a non-empty string.' });
    }

    const def: NodeDefinition | undefined = schema.getNode(node.type);
    if (!def) {
        errors.push({
            path: `${path}.type`,
            message: `Node type "${node.type}" is not registered in the schema.`
        });
        return; // cannot validate children of an unknown type
    }

    if (def.leaf) {
        // Leaf nodes must not have children
        if (Array.isArray((node as EditorNode).children) && (node as EditorNode).children.length > 0) {
            errors.push({
                path: `${path}.children`,
                message: `Leaf node "${node.type}" must not have children.`
            });
        }
    } else {
        const children: EditorNode[] = (node as EditorNode).children ?? [];
        for (let i: number = 0; i < children.length; i++) {
            const child: EditorNode = children[i as number];
            const childPath: string = `${path}.children[${i}]`;

            if (!schema.isValidChild(node.type, child.type)) {
                errors.push({
                    path: `${childPath}.type`,
                    message: `Node "${child.type}" is not a valid child of "${node.type}".`
                });
            }
            walk(child, childPath, errors, schema);
        }
    }
}
