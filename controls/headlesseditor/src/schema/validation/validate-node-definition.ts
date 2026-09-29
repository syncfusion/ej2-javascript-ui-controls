/**
 * validateNodeDefinition — runtime guard for a single NodeDefinition.
 *
 * Catches structural misconfigurations that cannot be expressed in the
 * TypeScript types but cause silent failures at PM-schema compile time.
 *
 * Rules enforced:
 *  1. `name` is non-empty.
 *  2. Exactly one of {inline, leaf, content} is allowed; they are mutually exclusive.
 *     - `leaf=true`   → no `content` allowed.
 *     - `inline=true` → no `content` allowed.
 *     - `content`     → `inline` and `leaf` must both be false/undefined.
 *  3. The root node MUST be named 'document' AND have `group: 'root'`.
 *  4. Non-root nodes MUST NOT be in the 'root' group.
 *  5. `attrs[].name` is unique within the node.
 */
import { NodeDefinition } from '../types/node-definition';
import { ValidationResult, ValidationError, validResult, invalidResult } from '../../errors/validation-error';

/**
 * Validates a single NodeDefinition against the structural rules that
 * cannot be expressed in the TypeScript type system.
 *
 * See module header for the full list of enforced rules.
 *
 * @param {NodeDefinition} def - The node definition to validate.
 * @returns {ValidationResult} A validation result containing any errors found.
 */
export function validateNodeDefinition(def: NodeDefinition): ValidationResult {
    const errors: ValidationError[] = [];

    if (!def.name || def.name.trim().length === 0) {
        errors.push({ path: 'name', message: 'NodeDefinition.name must be a non-empty string.' });
    }

    // ── Mutual exclusion: inline / leaf / content ─────────────────────────────
    const hasContent: boolean = def.content !== undefined;
    const hasInline: boolean = def.inline === true;
    const hasLeaf: boolean = def.leaf === true;

    if (hasInline && hasContent) {
        errors.push({
            path: 'content',
            message: 'NodeDefinition.inline nodes cannot declare a content expression.'
        });
    }
    if (hasLeaf && hasContent) {
        errors.push({
            path: 'content',
            message: 'NodeDefinition.leaf nodes cannot declare a content expression.'
        });
    }
    if (hasInline && hasLeaf) {
        errors.push({
            path: 'inline',
            message: 'NodeDefinition cannot be both inline and leaf — these flags are mutually exclusive.'
        });
    }

    // ── Root rules ────────────────────────────────────────────────────────────
    if (def.name === 'document') {
        if (def.group !== 'root') {
            errors.push({
                path: 'group',
                message: 'The "document" node must have group="root".'
            });
        }
    } else {
        if (def.group === 'root') {
            errors.push({
                path: 'group',
                message: 'Only the "document" node may use group="root".'
            });
        }
    }

    // ── Attr name uniqueness ─────────────────────────────────────────────────
    if (def.attrs && def.attrs.length > 0) {
        const seen: Set<string> = new Set<string>();
        for (const attr of def.attrs) {
            if (seen.has(attr.name)) {
                errors.push({
                    path: `attrs.${attr.name}`,
                    message: `Duplicate attribute name "${attr.name}" on node "${def.name}".`
                });
            }
            seen.add(attr.name);
        }
    }

    return errors.length === 0 ? validResult() : invalidResult(errors);
}
