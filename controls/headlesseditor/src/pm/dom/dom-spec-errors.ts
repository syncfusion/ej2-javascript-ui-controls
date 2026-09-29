/**
 * dom-spec-errors.ts — Typed errors for DOM spec registration and lookup.
 *
 * These are PM-layer configuration errors. They are thrown during schema
 * compilation when a node or mark type has no toDOM entry in the DOMSpecRegistry.
 * They are internal to src/pm/ and are never part of the public API.
 */

/**
 * Thrown when a node or mark type is compiled into a PM NodeSpec / MarkSpec
 * but no toDOM entry exists in the DOMSpecRegistry.
 *
 * This is a configuration error that must be fixed before the editor can mount.
 * Extensions that contribute custom node/mark types must also supply a
 * DOMSpecs capability entry for each type they declare.
 */
export class MissingDOMSpecError extends Error {
    public readonly nodeType: string;
    public readonly kind: 'node' | 'mark';

    public constructor(kind: 'node' | 'mark', name: string) {
        super(
            `[DOMSpecRegistry] No toDOM specification found for ${kind} type "${name}". ` +
            `Register a DOMSpecs capability for this ${kind} before schema compilation.`
        );
        this.name = 'MissingDOMSpecError';
        this.nodeType = name;
        this.kind = kind;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * Thrown when two extension DOM spec contributions attempt to register a
 * toDOM entry for the same node or mark name.
 *
 * Built-in defaults can be overridden; duplicate extension contributions
 * (extension-to-extension collisions) are treated as errors.
 */
export class DuplicateDOMSpecError extends Error {
    public readonly nodeType: string;
    public readonly kind: 'node' | 'mark';

    public constructor(kind: 'node' | 'mark', name: string) {
        super(
            `[DOMSpecRegistry] A toDOM spec for ${kind} type "${name}" is already registered ` +
            `by another extension. Each ${kind} name must have exactly one DOM spec.`
        );
        this.name = 'DuplicateDOMSpecError';
        this.nodeType = name;
        this.kind = kind;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
