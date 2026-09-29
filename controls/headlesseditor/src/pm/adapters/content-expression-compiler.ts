import { NodeContent, ExpressionTree } from '../../schema/types/content-expression';

/**
 * ContentExpressionCompiler — compiles a NodeContent expression tree into a
 * ProseMirror grammar string. e.g. NodeContent.block().oneOrMore() → "block+"
 *
 * Only used internally by NodeSpecBuilder to convert Syncfusion schema definitions
 * into PM-compatible NodeSpecs.
 */
export class ContentExpressionCompiler {
    public compile(expr: NodeContent): string {
        return this._compileTree(expr._tree);
    }

    private _compileTree(tree: ExpressionTree): string {
        switch (tree.kind) {
        case 'group':
        case 'node': {
            const leafName: string = tree.name ?? '';
            if (leafName === '') {
                throw new Error(`ContentExpressionCompiler: ${tree.kind} expression is missing its name.`);
            }
            return this.applyQuantifier(leafName, tree);
        }

        case 'sequence': {
            const parts: string[] = (tree.children ?? []).map((c: ExpressionTree) => this._compileTree(c));
            const inner: string = parts.join(' ');
            // Wrap in parens when a quantifier is applied so PM sees "(A B)+"
            return this.applyQuantifier(`(${inner})`, tree);
        }

        case 'choice': {
            const parts: string[] = (tree.children ?? []).map((c: ExpressionTree) => this._compileTree(c));
            const inner: string = parts.join(' | ');
            // Wrap in parens when a quantifier is applied so PM sees "(A | B)+"
            return this.applyQuantifier(`(${inner})`, tree);
        }

        default: {
            const unknown: { kind: string } = tree as { kind: string };
            throw new Error(`ContentExpressionCompiler: unknown expression kind "${unknown.kind}".`);
        }
        }
    }

    private applyQuantifier(name: string, tree: ExpressionTree): string {
        switch (tree.quantifier) {
        case 'none':       return name;
        case 'oneOrMore':  return `${name}+`;
        case 'zeroOrMore': return `${name}*`;
        case 'optional':   return `${name}?`;
        case 'exactly':    return `${name}{${tree.n}}`;
        case 'atLeast':    return `${name}{${tree.n},}`;
        default: {
            const unknown: { quantifier: string } = tree as { quantifier: string };
            throw new Error(`ContentExpressionCompiler: unknown quantifier "${unknown.quantifier}".`);
        }
        }
    }
}
