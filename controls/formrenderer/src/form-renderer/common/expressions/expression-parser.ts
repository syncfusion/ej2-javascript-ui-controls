import { AvailableField } from "../utils";

/**
 * ExpressionParser - Parse and compile expressions
 *
 * Converts string expressions into safe, compiled functions
 * Supports field references, operators, functions, and conditionals
 * @private
 */
export class ExpressionParser {
  private supportedFunctions = [
    'SUM', 'AVG', 'MIN', 'MAX', 'COUNT',
    'ROUND', 'FLOOR', 'CEIL', 'ABS', 'SQRT',
    'UPPER', 'LOWER', 'CONCAT', 'LENGTH', 'TRIM', 'SUBSTRING',
    'TODAY', 'AGE', 'DATEFORMAT', 'DATEDIFF', 'ADDDAYS', 'SUBDAYS', 'INCLUDES', 'CONTAINS', 'ISNAN', 'SUPPORTEDVALUESOF', 'TOSTRING', 'DATE', 'GETTIME',
    'EVERY', 'SOME'
  ];

  private availableFields: Map<string, AvailableField> = new Map();

  /**
   * Initialize parser with available fields for type validation
   */
  setAvailableFields(fields: AvailableField[]): void {
    this.availableFields.clear();
    fields.forEach(field => {
      this.availableFields.set(field.name, field);
    });
  }

  private validateFieldOperations(expression: string): string[] {
    const errors: string[] = [];

    // Skip if no fields available
    if (this.availableFields.size === 0) {
      return errors;
    }

    // Invalid operators for string fields (allow only + for concatenation)
    const stringInvalidOps = ['-', '*', '/', '%', '^'];

    // All operators invalid for date fields
    const dateInvalidOps = ['-', '*', '/', '%', '^', '+'];

    // Track reported operator positions to avoid duplicates
    const reportedOperators = new Set<string>();

    // Extract all field references and their surrounding operators
    const fieldRefPattern = /(\{[^}]+\})/g;
    let match;

    while ((match = fieldRefPattern.exec(expression)) !== null) {
      const fieldRef = match[0];
      const fieldName = fieldRef.slice(1, -1); // Remove { }
      const field = this.availableFields.get(fieldName);

      if (!field) continue; // Field not found in available fields, skip validation

      const fieldIndex = match.index;
      const fieldEndIndex = fieldIndex + fieldRef.length;

      // Get context around field reference (including spaces)
      const textBefore: string = expression.substring(Math.max(0, fieldIndex - 10), fieldIndex);
      const textAfter: string = expression.substring(fieldEndIndex, Math.min(expression.length, fieldEndIndex + 10));

      // Extract the operator if present (skip spaces)
      const operatorBefore: string = textBefore.replace(/\s+$/, '').slice(-1);
      const operatorAfter: string = textAfter.replace(/^\s+/, '').charAt(0);

      // Calculate actual position of operators in the original expression
      const textBeforeTrimmed: string = textBefore.replace(/\s+$/, '');
      const textAfterTrimmed: string = textAfter.replace(/^\s+/, '');
      const operatorBeforePos: number = fieldIndex - (textBefore.length - textBeforeTrimmed.length) - 1;
      const operatorAfterPos: number = fieldEndIndex + (textAfter.length - textAfterTrimmed.length);

      // For STRING fields: reject all operators except +
      if (field.type === 'string' && !field.format) {
        if (operatorBefore && stringInvalidOps.indexOf(operatorBefore) !== -1) {
          const key: string = `${operatorBeforePos}:${operatorBefore}`;
          if (!reportedOperators.has(key)) {
            errors.push(`Cannot perform '${operatorBefore}' operation on string field '{${fieldName}}'`);
            reportedOperators.add(key);
          }
        }
        if (operatorAfter && stringInvalidOps.indexOf(operatorAfter) !== -1) {
          const key: string = `${operatorAfterPos}:${operatorAfter}`;
          if (!reportedOperators.has(key)) {
            errors.push(`Cannot perform '${operatorAfter}' operation on string field '{${fieldName}}'`);
            reportedOperators.add(key);
          }
        }
      }

      // For DATE fields: reject ALL operators including +
      if (field.format === 'date' || field.format === 'date-time' || field.format === 'time') {
        if (operatorBefore && dateInvalidOps.indexOf(operatorBefore) !== -1) {
          const key: string = `${operatorBeforePos}:${operatorBefore}`;
          if (!reportedOperators.has(key)) {
            errors.push(`Cannot perform '${operatorBefore}' operation on date field '{${fieldName}}'`);
            reportedOperators.add(key);
          }
        }
        if (operatorAfter && dateInvalidOps.indexOf(operatorAfter) !== -1) {
          const key: string = `${operatorAfterPos}:${operatorAfter}`;
          if (!reportedOperators.has(key)) {
            errors.push(`Cannot perform '${operatorAfter}' operation on date field '{${fieldName}}'`);
            reportedOperators.add(key);
          }
        }
      }
    }

    return errors;
  }

  /**
   * Validate expression syntax
   */
  validate(expression: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!expression || expression.trim() === '') {
      return { valid: true, errors: [] };
    }

    // Check for unbalanced braces
    const openBraces = (expression.match(/\{/g) || []).length;
    const closeBraces = (expression.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push('Unbalanced braces in expression');
    }

    // Check for unbalanced parentheses
    const openParens = (expression.match(/\(/g) || []).length;
    const closeParens = (expression.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push('Unbalanced parentheses in expression');
    }

    // Check for invalid function calls
    const funcPattern = /(\w+)\s*\(/g;
    let match;
    while ((match = funcPattern.exec(expression)) !== null) {
      const funcName = match[1].toUpperCase();
      // Only validate uppercase-named functions
      if (funcName === funcName.toUpperCase() && this.supportedFunctions.indexOf(funcName) === -1) {
        errors.push(`Unknown function: ${funcName}`);
      }
    }

    // Validate field operations based on field types
    const fieldOpErrors = this.validateFieldOperations(expression);
    errors.push(...fieldOpErrors);

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Compile expression to executable function
   */
  compile(expression: string, options: any = {}): any  {
    try {
      // Set available fields for validation if provided
      if (options.availableFields && Array.isArray(options.availableFields)) {
        this.setAvailableFields(options.availableFields);
      }

      // Validate expression before compiling
      const validation = this.validate(expression);
      if (!validation.valid) {
        return (): any => null;
      }

      // Replace field references with context lookups
      let compiled = expression;

      // Handle field references FIRST (this includes refs inside ${...})
      compiled = this.compileFieldReferences(compiled);

      compiled = options.isCustomValidation ? this.compileInputReferences(compiled) : compiled;

      // Handle bare function calls SECOND (e.g., SUM([...]) without braces)
      compiled = this.compileBareFunctionCalls(compiled);

      // Handle math expressions THIRD (now ${} and {} contain already-replaced refs)
      compiled = this.compileMatrixExpressions(compiled);

      return (context: Record<string, any>) => {
        try {
          // This uses Function constructor with controlled context binding
          // which is safer than eval() but still allows expressions
          // Note: compiled expression already uses context['field'] syntax
          const func = new Function('context', `
            try {
              return ${compiled};
            } catch (e) {
              return null;
            }
          `);
          return func(context);
        } catch (e) {
          return null;
        }
      };
    } catch (error) {
      return (): any => null;
    }
  }

  // Private helpers

  private compileMatrixExpressions(expression: string): string {
    let compiled = expression;
    const constants = ['PI', 'TRUE', 'FALSE', 'NULL', 'UNDEFINED', 'Math'];
    const functions = [
      'SUM', 'AVG', 'MIN', 'MAX', 'COUNT',
      'ROUND', 'FLOOR', 'CEIL', 'ABS', 'SQRT',
      'UPPER', 'LOWER', 'CONCAT', 'LENGTH', 'TRIM', 'SUBSTRING',
      'TODAY', 'AGE', 'DATEFORMAT', 'DATEDIFF', 'ADDDAYS', 'SUBDAYS'
    ];

    // Create fresh regex each time to avoid lastIndex issues with g flag
    const mathExprPattern = /\$?\{([^}]+)\}/g;

    // Process ${...} and {...} blocks: replace bare identifiers with context lookups
    compiled = compiled.replace(mathExprPattern, (_match, content) => {
      let transformed = content;

      // STEP 1: Handle function calls first
      // Match function names followed by ( and prefix with context.
      // Use negative lookbehind to avoid double-replacing (e.g., context.SUM)
      functions.forEach(fn => {
        // eslint-disable-next-line security/detect-non-literal-regexp
        const funcCallRegex = new RegExp(`(?<!context\\.)\\b${fn}\\b(?=\\s*\\()`, 'g');
        transformed = transformed.replace(funcCallRegex, `context.${fn}`);
      });

      constants.forEach(constant => {
        // eslint-disable-next-line security/detect-non-literal-regexp
        const constantRegex = new RegExp(`\\b${constant}\\b`, 'g');
        transformed = transformed.replace(constantRegex, `context.${constant}`);
      });

      // Return as parenthesized expression
      return `(${transformed})`;
    });

    return compiled;
  }

  private compileBareFunctionCalls(expression: string): string {
    let compiled = expression;
    const functions = [
      'SUM', 'AVG', 'MIN', 'MAX', 'COUNT',
      'ROUND', 'FLOOR', 'CEIL', 'ABS', 'SQRT',
      'UPPER', 'LOWER', 'CONCAT', 'LENGTH', 'TRIM', 'SUBSTRING',
      'TODAY', 'AGE', 'DATEFORMAT', 'DATEDIFF', 'ADDDAYS', 'SUBDAYS'
    ];

    // Handle bare function calls like SUM([...]) that are not inside ${...} or {...}
    // Use negative lookbehind to avoid matching if already preceded by context.
    functions.forEach(fn => {
      // eslint-disable-next-line security/detect-non-literal-regexp
      const funcCallRegex = new RegExp(`(?<!context\\.)\\b${fn}\\b(?=\\s*\\()`, 'g');
      compiled = compiled.replace(funcCallRegex, `context.${fn}`);
    });

    return compiled;
  }

  private compileFieldReferences(expression: string): string {
    let compiled = expression;

    // Create fresh regex each time to avoid lastIndex issues with g flag
    const fieldRefPattern = /\{([^{}]+)\}/g;

    // Replace {fieldName} with context['fieldName'] or field access
    compiled = compiled.replace(fieldRefPattern, (match, ref) => {
      // Handle escaped braces
      if (ref.startsWith('\\') && ref.endsWith('\\')) {
        return match; // Keep as is
      }
      // Handle nested paths like {customer.name}
      return `context['${ref.replace(/\./g, '\'].[')}']`;
    });

    return compiled;
  }

  private compileInputReferences(expression: string): string {
    const compiled = expression;

    // First, protect string literals to avoid replacing 'input' inside strings
    const strings: string[] = [];
    let stringProtected = compiled;
    // eslint-disable-next-line security/detect-unsafe-regex
    stringProtected = stringProtected.replace(/(['"`])(?:(?=(\\?))\2.)*?\1/g, (match: any) => {
      strings.push(match);
      return `__STRING_${strings.length - 1}__`;
    });

    // Case 1: Replace input.property with context['input'].property
    const inputPropertyPattern = /(?<!context\[')\binput\./g;
    stringProtected = stringProtected.replace(inputPropertyPattern, 'context[\'input\'].');

    // Case 2: Replace bare 'input' with context['input']
    // Use negative lookbehind to avoid replacing if already preceded by context.'
    const inputPattern = /(?<!context\[')\binput\b(?!\s*[(\.])/g;
    stringProtected = stringProtected.replace(inputPattern, 'context[\'input\']');

    // Restore string literals
    let result = stringProtected;
    strings.forEach((str, idx) => {
      result = result.replace(`__STRING_${idx}__`, str);
    });

    return result;
  }
}
