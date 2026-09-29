/**
 * DependencyTracker - Extract and track field dependencies
 *
 * Analyzes expressions to find field references and build dependency graphs
 * Detects circular dependencies and calculates evaluation order
 * @private
 */
export class DependencyTracker {

  private escapedBracePattern = /\\{.*?\\}/g;

  /**
   * Extract field names referenced in expression
   */
  extractFieldReferences(expression: string): string[] {
    if (!expression) return [];

    const refs = new Set<string>();
    let match;

    // Remove escaped braces first
    const cleanExpression = expression.replace(this.escapedBracePattern, '');

    // Extract field references from {field} syntax
    const fieldRefPattern = /\{([^{}]+)\}/g;
    while ((match = fieldRefPattern.exec(cleanExpression)) !== null) {
      const ref = match[1].trim();

      // Skip if it's a function call or operator
      if (!this.isFunctionCall(ref) && !this.isOperator(ref)) {
        // Extract field name from nested paths
        const fieldName = ref.split(/[.\[\]]/)[0].trim();
        if (fieldName && !this.isKeyword(fieldName)) {
          refs.add(fieldName);
        }
      }
    }

    // Extract identifiers from ${...} math expressions
    const mathExprPattern = /\$\{([^}]+)\}/g;
    while ((match = mathExprPattern.exec(cleanExpression)) !== null) {
      const mathExpr = match[1];

      // Extract all identifiers from the math expression
      // Match word boundaries followed by identifier characters
      // But skip if followed by ( or . (those are function calls or property access)
      const identPattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b(?!\s*[(\.])/g;
      let idMatch;

      while ((idMatch = identPattern.exec(mathExpr)) !== null) {
        const identifier = idMatch[1];

        // Skip keywords and constants
        if (!this.isKeyword(identifier) && identifier !== 'Math') {
          refs.add(identifier);
        }
      }
    }

    return Array.from(refs);
  }

  /**
   * Build dependency graph from multiple expressions
   */
  buildGraph(expressions: Record<string, string>): Record<string, string[]> {
    const graph: Record<string, string[]> = {};
    const keys: string[] = Object.keys(expressions);

    for (const fieldName of keys) {
      const deps: string[] = this.extractFieldReferences(expressions[fieldName as string]);
      graph[fieldName as string] = deps;
    }

    return graph;
  }

  /**
   * Detect circular dependencies using DFS
   */
  detectCircularDependencies(graph: Record<string, string[]>): string[][] {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const cycles: string[][] = [];

    const visit = (node: string, path: string[]): void => {
      visited.add(node);
      recursionStack.add(node);
      path.push(node);

      const deps = graph[node as string] || [];
      for (const dep of deps) {
        if (!visited.has(dep)) {
          visit(dep, [...path]);
        } else if (recursionStack.has(dep)) {
          const cycleStart = path.indexOf(dep);
          cycles.push([...path.slice(cycleStart), dep]);
        }
      }

      recursionStack.delete(node);
    };

    for (const node of Object.keys(graph)) {
      if (!visited.has(node)) {
        visit(node, []);
      }
    }

    return cycles;
  }

  /**
   * Get topological sort order for evaluation
   */
  getTopologicalOrder(graph: Record<string, string[]>): string[] {
    const visited = new Set<string>();
    const order: string[] = [];

    const visit = (node: string): void => {
      if (visited.has(node)) return;
      visited.add(node);

      const deps = graph[node as string] || [];
      for (const dep of deps) {
        if (graph[dep as string]) {
          visit(dep);
        }
      }

      order.push(node);
    };

    for (const node of Object.keys(graph)) {
      visit(node);
    }

    return order;
  }

  // Private helpers

  private isFunctionCall(ref: string): boolean {
    return /^\w+\s*\(/.test(ref);
  }

  private isOperator(ref: string): boolean {
    return /^[+\-*/()=!<>&|]/.test(ref);
  }

  private isKeyword(name: string): boolean {
    const keywords: string[] = ['PI', 'TRUE', 'FALSE', 'NULL', 'UNDEFINED', 'and', 'or', 'in'];
    return keywords.indexOf(name.toUpperCase()) !== -1;
  }
}
