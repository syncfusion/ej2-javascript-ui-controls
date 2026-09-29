import { DOMOutputSpec, PMNode, PMMark } from '../pm-guard';
import { MissingDOMSpecError } from './dom-spec-errors';
import { DEFAULT_NODE_DOM_MAP } from './default-node-dom';
import { DEFAULT_MARK_DOM_MAP } from './default-mark-dom';

// ─── toDOM function signatures ────────────────────────────────────────────────

/**
 * The toDOM function signature for a node, matching ProseMirror's NodeSpec.toDOM.
 * Lives inside src/pm/ — never exposed outside the PM boundary.
 */
export type NodeToDOMFn = (node: PMNode) => DOMOutputSpec;

/**
 * The toDOM function signature for a mark, matching ProseMirror's MarkSpec.toDOM.
 * Lives inside src/pm/ — never exposed outside the PM boundary.
 */
export type MarkToDOMFn = (mark: PMMark, inline: boolean) => DOMOutputSpec;

// ─── Spec containers ──────────────────────────────────────────────────────────

/**
 * DOM rendering spec for a single node type.
 *
 * `toDOM` is the required field for EditorView mounting.
 * `parseDOM` is optional HTML parsing rules for clipboard/paste support.
 */
export interface NodeDOMSpec {
    readonly toDOM: NodeToDOMFn;
    /** Optional: Parse rules for converting HTML to this node type during paste/import. */
    parseDOM?: readonly unknown[];
}

/**
 * DOM rendering spec for a single mark type.
 *
 * `toDOM` is the required field for EditorView mounting.
 * `parseDOM` is optional HTML parsing rules for clipboard/paste support.
 */
export interface MarkDOMSpec {
    readonly toDOM: MarkToDOMFn;
    /** Optional: Parse rules for converting HTML to this mark type during paste/import. */
    parseDOM?: readonly unknown[];
}

// ─── Registry interface ───────────────────────────────────────────────────────

/**
 * DOMSpecRegistry — read-only, immutable after construction.
 *
 * Supplies ProseMirror toDOM specs for node and mark types.
 * NodeSpecBuilder and MarkSpecBuilder ask this registry for the spec,
 * then attach `spec.toDOM` to the PM NodeSpec / MarkSpec they produce.
 *
 * Design rules:
 * - Immutable after construction — no register() / mutate() methods.
 * - Missing names throw MissingDOMSpecError — no silent fallbacks.
 * - Only toDOM is used today; parseDOM slot is reserved.
 * - All PM-specific rendering knowledge lives here, not in schema types.
 */
export interface DOMSpecRegistry {
    /**
     * Returns the NodeDOMSpec for the named node type.
     * Throws MissingDOMSpecError if no entry exists.
     */
    getNodeDOMSpec(name: string): NodeDOMSpec;

    /**
     * Returns the MarkDOMSpec for the named mark type.
     * Throws MissingDOMSpecError if no entry exists.
     */
    getMarkDOMSpec(name: string): MarkDOMSpec;
}

// ─── Default implementation ───────────────────────────────────────────────────

/**
 * DefaultDOMSpecRegistry — standard, immutable implementation of DOMSpecRegistry.
 *
 * Do not construct directly — use the static factories:
 *   - `DefaultDOMSpecRegistry.createDefault()` for the built-in registry
 *   - `DefaultDOMSpecRegistry.create(nodeMap, markMap)` when ExtensionCompiler
 *     has merged built-in defaults with extension contributions
 */
export class DefaultDOMSpecRegistry implements DOMSpecRegistry {
    private readonly _nodeMap: ReadonlyMap<string, NodeDOMSpec>;
    private readonly _markMap: ReadonlyMap<string, MarkDOMSpec>;

    private constructor(
        nodeMap: Map<string, NodeDOMSpec>,
        markMap: Map<string, MarkDOMSpec>
    ) {
        this._nodeMap = nodeMap;
        this._markMap = markMap;
    }

    /**
     * Creates a registry pre-populated with all built-in node and mark specs.
     * Use this when no extensions contribute custom DOMSpecs.
     *
     * @returns {DefaultDOMSpecRegistry} - The default registry
     */
    public static createDefault(): DefaultDOMSpecRegistry {
        return new DefaultDOMSpecRegistry(
            new Map(DEFAULT_NODE_DOM_MAP),
            new Map(DEFAULT_MARK_DOM_MAP)
        );
    }

    /**
     * Creates a registry from caller-supplied maps.
     * Used by ExtensionCompiler after it has merged the built-in defaults with
     * any DOMSpecs capability contributions from loaded extensions.
     *
     * @param {Map<string, NodeDOMSpec>} nodeMap - Nodes
     * @param {Map<string, MarkDOMSpec>} markMap - Marks
     * @returns {DefaultDOMSpecRegistry} - The default registry
     */
    public static create(
        nodeMap: Map<string, NodeDOMSpec>,
        markMap: Map<string, MarkDOMSpec>
    ): DefaultDOMSpecRegistry {
        return new DefaultDOMSpecRegistry(nodeMap, markMap);
    }

    public getNodeDOMSpec(name: string): NodeDOMSpec {
        const spec: NodeDOMSpec = this._nodeMap.get(name);
        if (!spec) {
            throw new MissingDOMSpecError('node', name);
        }
        return spec;
    }

    public getMarkDOMSpec(name: string): MarkDOMSpec {
        const spec: MarkDOMSpec = this._markMap.get(name);
        if (!spec) {
            throw new MissingDOMSpecError('mark', name);
        }
        return spec;
    }
}
