import { NodeDefinition, NodeGroup } from './types/node-definition';
import { MarkDefinition } from './types/mark-definition';
import { AttributeDefinition, validateAttributeDefinition } from './types/attribute-definition';
import { SchemaDefinition } from './types/schema-definition';
import { validateNodeDefinition } from './validation/validate-node-definition';
import { ExpressionTree } from './types';
import { ValidationResult } from '../errors/validation-error';

/**
 * SchemaManager — internal registry for node and mark definitions.
 *
 * - Validates attribute definitions on registration.
 * - Enforces no duplicate names within nodes or marks.
 */
export class SchemaManager {
    private readonly _nodes: Map<string, NodeDefinition> = new Map<string, NodeDefinition>();
    private readonly _marks: Map<string, MarkDefinition> = new Map<string, MarkDefinition>();

    // ── Registration ──────────────────────────────────────────────────────────

    public registerNode(def: NodeDefinition): void {
        if (this._nodes.has(def.name)) {
            throw new Error(`SchemaManager: duplicate node registration "${def.name}".`);
        }
        const result: ValidationResult = validateNodeDefinition(def);
        if (!result.valid) {
            const summary: string = result.errors
                .map((e: { path: string; message: string }) => `${e.path}: ${e.message}`)
                .join('; ');
            throw new Error(`SchemaManager: invalid node definition "${def.name}" — ${summary}`);
        }
        this._validateAttrs(def.attrs, def.name, 'node');
        this._nodes.set(def.name, def);
    }

    public registerMark(def: MarkDefinition): void {
        if (this._marks.has(def.name)) {
            throw new Error(`SchemaManager: duplicate mark registration "${def.name}".`);
        }
        this._validateAttrs(def.attrs, def.name, 'mark');
        this._marks.set(def.name, def);
    }

    // ── Bulk loading from SchemaDefinition ───────────────────────────────────

    public load(schema: SchemaDefinition): void {
        for (const nodeDef of schema.nodes) {
            this.registerNode(nodeDef);
        }
        for (const markDef of schema.marks) {
            this.registerMark(markDef);
        }
    }

    // ── Retrieval ─────────────────────────────────────────────────────────────

    public getNode(name: string): NodeDefinition | undefined {
        return this._nodes.get(name);
    }

    public getMark(name: string): MarkDefinition | undefined {
        return this._marks.get(name);
    }

    public getAllNodes(): NodeDefinition[] {
        return Array.from(this._nodes.values());
    }

    public getAllMarks(): MarkDefinition[] {
        return Array.from(this._marks.values());
    }

    // ── Validation ────────────────────────────────────────────────────────────

    /**
     * Returns true if `childName` is a valid direct child of `parentName`
     * according to the parent's content expression group membership.
     *
     * This is a lightweight heuristic check used before PM schema compilation.
     * Full validation happens at PM schema compile time.
     *
     * @param {string} parentName - The parent node's registered name.
     * @param {string} childName - The child node's registered name.
     * @returns {boolean} True if the child is permitted by the parent's content expression.
     */
    public isValidChild(parentName: string, childName: string): boolean {
        const parent: NodeDefinition | undefined = this._nodes.get(parentName);
        const child: NodeDefinition | undefined = this._nodes.get(childName);
        if (!parent || !child) { return false; }
        if (!parent.content) { return false; }

        const { _tree } = parent.content;
        const childGroup: NodeGroup = child.group;

        // Simple group membership check for top-level group expressions
        if (_tree.kind === 'group') {
            return _tree.name === childGroup;
        }
        // Named node check
        if (_tree.kind === 'node') {
            return _tree.name === childName;
        }
        // For sequence/choice: check if any child matches
        if (_tree.kind === 'sequence' || _tree.kind === 'choice') {
            const children: ExpressionTree[] = _tree.children ?? [];
            return children.some((c: ExpressionTree) => {
                if (c.kind === 'group') { return c.name === childGroup; }
                if (c.kind === 'node') { return c.name === childName; }
                return false;
            });
        }
        return false;
    }

    /**
     * Validates the entire registered schema.
     * Throws if: no 'document' root node is registered.
     *
     * @returns {void}
     */
    public validate(): void {
        if (!this._nodes.has('document')) {
            throw new Error('SchemaManager: schema must include a node named "document" as the root.');
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private _validateAttrs(
        attrs: AttributeDefinition[] | undefined,
        ownerName: string,
        ownerKind: 'node' | 'mark'
    ): void {
        if (!attrs) { return; }
        for (const attr of attrs) {
            try {
                validateAttributeDefinition(attr);
            } catch (e) {
                const msg: string = e instanceof Error ? e.message : String(e);
                throw new Error(`SchemaManager: invalid attribute "${attr.name}" on ${ownerKind} "${ownerName}": ${msg}`);
            }
        }
    }
}
