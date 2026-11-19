/**
 * ContentExpression — internal representation of a PM content grammar expression.
 * Consumers use the NodeContent fluent builder; PMSchemaAdapter compiles to PM strings.
 */


type ExpressionKind = 'group' | 'node' | 'sequence' | 'choice';
type QuantifierKind = 'none' | 'oneOrMore' | 'zeroOrMore' | 'optional' | 'exactly' | 'atLeast';


/**
 * ExpressionTree
 *
 * @hidden
 */
export interface ExpressionTree {
    kind: ExpressionKind;
    /** For 'group' and 'node': the name of the group or node type. */
    name?: string;
    /** For 'sequence' and 'choice': the child expressions. */
    children?: ExpressionTree[];
    quantifier: QuantifierKind;
    /** For 'exactly' and 'atLeast': the numeric argument. */
    n?: number;
}

/**
 * Filter a content expression so its CHOICE alternatives only reference node
 * types that exist in the schema being compiled.
 *
 * Extension composability rule: a choice offers alternatives, so an editor
 * without a given extension should degrade to the remaining alternatives
 * instead of failing to build its schema. For example, listItem's
 * `(paragraph | heading) block*` degrades to `paragraph block*` when the
 * heading extension is not registered — paragraph stays because the list
 * extensions treat it as a mandatory alternative.
 *
 * Rules:
 *   - Inside a `choice`, `node`-kind children whose name is NOT in
 *     `availableNodes` are dropped. Groups (`block`, `inline`) always stay
 *     because their membership is resolved from the registered nodes.
 *   - A node reference OUTSIDE a choice is untouched — a missing hard
 *     dependency (e.g. `table → tableRow+` without the table extension)
 *     must still fail loudly at schema construction.
 *   - A sequence member whose entire choice disappeared becomes null; the
 *     sequence keeps going only when that member was optional (`?` / `*`).
 *   - A choice reduced to one alternative collapses to that alternative.
 *
 * @param {ExpressionTree} tree - The expression tree to prune.
 * @param {ReadonlySet<string>} availableNodes - Node type names registered in the schema.
 * @returns {ExpressionTree | null} The pruned tree, or null when a required
 * choice lost every alternative.
 *
 * @hidden
 */
export function pruneExpressionTree(
    tree: ExpressionTree,
    availableNodes: ReadonlySet<string>
): ExpressionTree | null {
    switch (tree.kind) {
    case 'group':
    case 'node': {
        return tree;
    }
    case 'choice': {
        const children: ExpressionTree[] = [];
        for (const child of tree.children ?? []) {
            if (child.kind === 'node' && child.name !== undefined && !availableNodes.has(child.name)) {
                // Missing node references are removable only because this node is an alternative inside a choice.
                continue;
            }
            const pruned: ExpressionTree | null = pruneExpressionTree(child, availableNodes);
            if (pruned !== null) {
                children.push(pruned);
            }
        }
        if (children.length === 0) {
            return null;
        }
        if (children.length === 1) {
            // Degenerate choice — collapse to its single survivor, keeping
            // the choice's own quantifier semantic (the child's quantifier
            // is 'none' inside an unquantified choice).
            return { ...children[0], quantifier: tree.quantifier };
        }
        return { ...tree, children };
    }
    case 'sequence': {
        const children: ExpressionTree[] = [];
        for (const child of tree.children ?? []) {
            const pruned: ExpressionTree | null = pruneExpressionTree(child, availableNodes);
            if (pruned === null) {
                if (child.quantifier === 'zeroOrMore' || child.quantifier === 'optional') {
                    // Optional sequence parts may vanish harmlessly.
                    continue;
                }
                // A required sequence member lost every alternative — the
                // whole sequence is unsatisfiable.
                return null;
            }
            children.push(pruned);
        }
        return { ...tree, children };
    }
    default: {
        return tree;
    }
    }
}

/**
 * NodeContent — fluent builder for content expressions.
 *
 * Examples:
 *   NodeContent.block().oneOrMore()          → "block+"
 *   NodeContent.inline().zeroOrMore()        → "inline*"
 *   NodeContent.text().optional()            → "text?"
 *   NodeContent.node('tableRow').exactly(3)  → "tableRow{3}"
 *   NodeContent.sequence(
 *     NodeContent.node('tableRow').oneOrMore(),
 *     NodeContent.node('caption').optional()
 *   )                                        → "tableRow+ caption?"
 */
export class NodeContent {
    /** @internal */
    public readonly _tree: ExpressionTree;

    private constructor(tree: ExpressionTree) {
        this._tree = tree;
    }

    // ── Factory methods ─────────────────────────────────────────────────────

    /**
     * Matches any node in the 'block' group.
     *
     * @returns {NodeContent} A new expression for the 'block' group.
     */
    public static block(): NodeContent {
        return new NodeContent({ kind: 'group', name: 'block', quantifier: 'none' });
    }

    /**
     * Matches any node in the 'inline' group.
     *
     * @returns {NodeContent} A new expression for the 'inline' group.
     */
    public static inline(): NodeContent {
        return new NodeContent({ kind: 'group', name: 'inline', quantifier: 'none' });
    }

    /**
     * Matches a text leaf node.
     *
     * @returns {NodeContent} A new expression for the 'text' node.
     */
    public static text(): NodeContent {
        return new NodeContent({ kind: 'node', name: 'text', quantifier: 'none' });
    }

    /**
     * Matches a specific named node type.
     *
     * @param {string} name - The name of the node type to match.
     * @returns {NodeContent} A new expression for the named node.
     */
    public static node(name: string): NodeContent {
        return new NodeContent({ kind: 'node', name, quantifier: 'none' });
    }

    /**
     * Sequence combinator — compiles child expressions separated by spaces.
     * When a quantifier is applied (e.g. `.oneOrMore()`), the group is
     * automatically wrapped in parentheses: `(A B)+`.
     *
     * @param {...NodeContent[]} parts - Child expressions to combine in order.
     * @returns {NodeContent} A new sequence expression.
     */
    public static sequence(...parts: NodeContent[]): NodeContent {
        return new NodeContent({ kind: 'sequence', children: parts.map((p: NodeContent) => p._tree), quantifier: 'none' });
    }

    /**
     * Choice combinator — compiles child expressions separated by ' | '.
     * When a quantifier is applied (e.g. `.oneOrMore()`), the group is
     * automatically wrapped in parentheses: `(A | B)+`.
     *
     * @param {...NodeContent[]} parts - Child expressions to offer as alternatives.
     * @returns {NodeContent} A new choice expression.
     */
    public static choice(...parts: NodeContent[]): NodeContent {
        return new NodeContent({ kind: 'choice', children: parts.map((p: NodeContent) => p._tree), quantifier: 'none' });
    }

    // ── Quantifier methods ───────────────────────────────────────────────────

    private withQuantifier(q: QuantifierKind, n?: number): NodeContent {
        return new NodeContent({ ...this._tree, quantifier: q, n });
    }

    /**
     * One or more — compiles to "name+"
     *
     * @returns {NodeContent} A new expression with the oneOrMore quantifier.
     */
    public oneOrMore(): NodeContent { return this.withQuantifier('oneOrMore'); }

    /**
     * Zero or more — compiles to "name*"
     *
     * @returns {NodeContent} A new expression with the zeroOrMore quantifier.
     */
    public zeroOrMore(): NodeContent { return this.withQuantifier('zeroOrMore'); }

    /**
     * Zero or one — compiles to "name?"
     *
     * @returns {NodeContent} A new expression with the optional quantifier.
     */
    public optional(): NodeContent { return this.withQuantifier('optional'); }

    /**
     * Exactly n — compiles to "name{n}"
     *
     * @param {number} n - The exact number of repetitions required.
     * @returns {NodeContent} A new expression with the exactly quantifier.
     */
    public exactly(n: number): NodeContent { return this.withQuantifier('exactly', n); }

    /**
     * At least n — compiles to "name{n,}"
     *
     * @param {number} n - The minimum number of repetitions required.
     * @returns {NodeContent} A new expression with the atLeast quantifier.
     */
    public atLeast(n: number): NodeContent { return this.withQuantifier('atLeast', n); }
}
