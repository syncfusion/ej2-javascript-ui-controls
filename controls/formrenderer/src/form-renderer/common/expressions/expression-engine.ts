import { ExpressionParser } from './expression-parser';
import { DependencyTracker } from './dependency-tracker';
import { Internationalization } from '@syncfusion/ej2-base';
import { FormValueType } from '../utils';

/**
 * @private
 */
export interface EvaluationOptions {
  timeout?: number;
  maxDepth?: number;
  locale?: string;
  currencyCode?: string;
  throwOnError?: boolean;
}

/**
 * @private
 */
export type DependencyGraph = Record<string, string[]>;

/**
 * ExpressionEngine - Core evaluation engine
 *
 * Safely evaluates user-defined expressions against form state
 * Supports field references, math operations, functions, and conditionals
 * @private
 */
export class ExpressionEngine {
  private parser: ExpressionParser;
  private dependencyTracker: DependencyTracker;
  private evaluationCache: Map<string, any> = new Map();
  private compiledFunctions: Map<string, any> = new Map();

  constructor() {
    this.parser = new ExpressionParser();
    this.dependencyTracker = new DependencyTracker();
  }

  /**
   * Evaluate expression against form values
   */
  evaluate(
    expression: string,
    formValues: Record<string, FormValueType>,
    options: EvaluationOptions = {},
    isCustomValidation: boolean = false
  ): any {
    try {
      if (!expression || expression.trim() === '') {
        return null;
      }

      const {
        timeout = 5000,
        maxDepth = 10,
        locale = 'en-US',
        throwOnError = false
      } = options;

      // Check cache
      const cacheKey = this.getCacheKey(expression, formValues);
      if (!isCustomValidation &&this.evaluationCache.has(cacheKey)) {
        return this.evaluationCache.get(cacheKey);
      }

      // Get or compile function
      let fn = this.compiledFunctions.get(expression);
      if (!fn) {
        fn = this.parser.compile(expression, {
          timeout,
          maxDepth,
          locale,
          isCustomValidation
        });
        this.compiledFunctions.set(expression, fn);
      }

      // Execute with context
      const context = this.buildContext(formValues);
      const startTime = Date.now();

      const result = fn(context);

      // Validate timeout
      if (Date.now() - startTime > timeout) {
        const error = new Error(`Expression evaluation exceeded timeout of ${timeout}ms`);
        if (throwOnError) throw error;
        return null;
      }

      // Cache result
      this.evaluationCache.set(cacheKey, result);

      return result;

    } catch (error) {
      if (options.throwOnError) {
        throw error;
      }
      return null;
    }
  }

  /**
   * Extract field names referenced in expression
   */
  extractDependencies(expression: string): string[] {
    if (!expression) return [];
    return this.dependencyTracker.extractFieldReferences(expression);
  }

  /**
   * Build dependency graph for all expressions
   */
  buildDependencyGraph(components: any[]): DependencyGraph {
    const graph: DependencyGraph = {};

    components.forEach(comp => {
      if (comp.expressionValue) {
        const deps = this.extractDependencies(comp.expressionValue);
        graph[comp.name as string] = deps;
      }
    });

    return graph;
  }

  /**
   * Detect circular dependencies
   */
  detectCircularDependencies(graph: DependencyGraph): string[][] {
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
   * Get topological order for evaluation
   */
  getTopologicalOrder(graph: DependencyGraph): string[] {
    const visited = new Set<string>();
    const order: string[] = [];

    const visit = (node: string): void => {
      if (visited.has(node)) return;
      visited.add(node);

      const deps = graph[node as string] || [];
      for (const dep of deps) {
        visit(dep);
      }

      order.push(node);
    };

    for (const node of Object.keys(graph)) {
      visit(node);
    }

    return order;
  }

  /**
   * Clear internal caches
   */
  clearCache(): void {
    this.evaluationCache.clear();
    this.compiledFunctions.clear();
  }

  // Private helper methods

  private getCacheKey(expression: string, formValues: Record<string, any>): string {
    // Simple cache key (in production, use better hashing)
    return `${expression}:${JSON.stringify(formValues)}`;
  }

  private buildContext(formValues: Record<string, FormValueType>): Record<string, any> {
    const intl = new Internationalization();
    const dFormatter = intl.getDateFormat({
      format: 'MM/dd/yyyy',
      type: 'date'
    });

    return {
      // Field values
      ...formValues,

      // Constants
      PI: Math.PI,
      TRUE: true,
      FALSE: false,
      NULL: null,
      UNDEFINED: undefined,
      Math: Math,

      // Aggregate Functions
      SUM: (values: any[]) => Array.isArray(values) ? values.reduce((a, b) => Number(a) + Number(b), 0) : 0,
      AVG: (values: any[]) => {
        if (!Array.isArray(values) || values.length === 0) return 0;
        const sum = values.reduce((a, b) => Number(a) + Number(b), 0);
        return sum / values.length;
      },
      MIN: (values: any[]) => Array.isArray(values) && values.length > 0 ? Math.min(...values.map(Number)) : 0,
      MAX: (values: any[]) => Array.isArray(values) && values.length > 0 ? Math.max(...values.map(Number)) : 0,
      COUNT: (values: any[]) => Array.isArray(values) ? values.length : 0,

      // Math Functions
      ROUND: (value: number, decimals: number = 0) => Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals),
      FLOOR: Math.floor,
      CEIL: Math.ceil,
      ABS: Math.abs,
      SQRT: Math.sqrt,

      // String Functions
      UPPER: (text: string) => String(text).toUpperCase(),
      LOWER: (text: string) => String(text).toLowerCase(),
      CONCAT: (...strings: string[]) => strings.map(String).join(''),
      LENGTH: (text: string) => String(text).length,
      TRIM: (text: string) => String(text).trim(),
      SUBSTRING: (text: string, start: number, length?: number) =>
        length !== undefined
          ? String(text).substr(start, length)
          : String(text).substr(start),

      // Date Functions
      TODAY:
        () => {
          const value = dFormatter(new Date())
          return value;
        },

      AGE: (birthDate: Date | string) => {
        const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        return age;
      },
      DATEFORMAT: (date: Date | string, format: string) => {
        const d = typeof date === 'string' ? new Date(date) : date;

        const formatter = intl.getDateFormat({
          format: format,
          type: 'date'
        });
        // Simple date format implementation
        return formatter(d);
      },
      DATEDIFF: (date1: Date | string, date2: Date | string) => {
        const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
        const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
        return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
      },
      // Add days to a date (for date arithmetic like {date} + 5)
      ADDDAYS: (date: Date | string, days: number) => {
        const d = typeof date === 'string' ? new Date(date) : new Date(date);
        d.setDate(d.getDate() + Number(days));
        return dFormatter(d);
      },
      // Add days to a date (for date arithmetic like {date} + 5)
      SUBDAYS: (date: Date | string, days: number) => {
        const d = typeof date === 'string' ? new Date(date) : new Date(date);
        d.setDate(d.getDate() - Number(days));
        return dFormatter(d);
      }
    };
  }
}

/**
 * ExpressionValidator - Validates expressions before runtime
 *
 * Checks syntax, validates field references, and detects circular dependencies
 * @private
 */
export class ExpressionValidator {
  private supportedFunctions = [
    'SUM', 'AVG', 'MIN', 'MAX', 'COUNT',
    'ROUND', 'FLOOR', 'CEIL', 'ABS', 'SQRT',
    'UPPER', 'LOWER', 'CONCAT', 'LENGTH', 'TRIM', 'SUBSTRING',
    'TODAY', 'AGE', 'DATEFORMAT', 'DATEDIFF', 'ADDDAYS', 'SUBDAYS'
  ];
  private keywords = ['PI', 'TRUE', 'FALSE', 'NULL', 'UNDEFINED', 'and', 'or', 'in'];

  /**
   * Validate expression against available fields
   */
  validate(expression: string, availableFields: string[] | any[]): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!expression || expression.trim() === '') {
      return errors; // Empty expression is valid
    }

    // Check syntax
    const syntaxErrors = this.validateSyntax(expression);
    errors.push(...syntaxErrors);

    // Check field references
    const fieldErrors = this.validateFieldReferences(expression, availableFields);
    errors.push(...fieldErrors);

    // Check function calls
    const funcErrors = this.validateFunctionCalls(expression);
    errors.push(...funcErrors);

    // Check field operations based on types
    const opErrors = this.validateFieldOperations(expression, availableFields);
    errors.push(...opErrors);

    return errors;
  }

  /**
   * Validate field operations - check for invalid operators on string/date types
   */
  private validateFieldOperations(expression: string, availableFields: string[] | any[]): ValidationError[] {
    const errors: ValidationError[] = [];

    // Skip if not field objects with type info
    if (!Array.isArray(availableFields) || availableFields.length === 0) {
      return errors;
    }

    const firstField = availableFields[0];
    if (typeof firstField === 'string') {
      return errors; // No type information available
    }

    // Build field map from objects
    const fieldMap = new Map<string, any>();
    availableFields.forEach(field => {
      if (field && typeof field === 'object' && (field as any).name) {
        fieldMap.set((field as any).name, field);
      }
    });

    if (fieldMap.size === 0) return errors;

    // Track reported operator positions to avoid duplicates
    const reportedOperators = new Set<string>();

    // Check each field reference for invalid operations
    const fieldRefPattern = /(\{[^}]+\})/g;
    let match;

    // Invalid operators for string fields (allow only + for concatenation)
    const stringInvalidOps = ['-', '*', '/', '%', '^'];

    // Operators invalid for date fields (allow + for date arithmetic with numbers)
    const dateInvalidOps = ['-', '*', '/', '%', '^', '+'];

    while ((match = fieldRefPattern.exec(expression)) !== null) {
      const fieldRef = match[0];
      const fieldName = fieldRef.slice(1, -1); // Remove { }
      const field = fieldMap.get(fieldName);

      if (!field) continue;

      const fieldIndex: number = match.index;
      const fieldEndIndex: number = fieldIndex + fieldRef.length;

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

      // For STRING fields (without format)
      if (field.type === 'string' && !field.format) {
        if (operatorBefore && stringInvalidOps.indexOf(operatorBefore) !== -1) {
          const key: string = `${operatorBeforePos}:${operatorBefore}`;
          if (!reportedOperators.has(key)) {
            errors.push({
              type: 'InvalidOperation',
              message: `Cannot perform '${operatorBefore}' operation on string field '{${fieldName}}'`
            });
            reportedOperators.add(key);
          }
        }
        if (operatorAfter && stringInvalidOps.indexOf(operatorAfter) !== -1) {
          const key: string = `${operatorAfterPos}:${operatorAfter}`;
          if (!reportedOperators.has(key)) {
            errors.push({
              type: 'InvalidOperation',
              message: `Cannot perform '${operatorAfter}' operation on string field '{${fieldName}}'`
            });
            reportedOperators.add(key);
          }
        }
      }

      // For DATE fields - allow + with numbers, reject other operators
      if (field.format === 'date' || field.format === 'date-time' || field.format === 'time') {
        if (operatorBefore && dateInvalidOps.indexOf(operatorBefore) !== -1) {
          const key: string = `${operatorBeforePos}:${operatorBefore}`;
          if (!reportedOperators.has(key)) {
            errors.push({
              type: 'InvalidOperation',
              message: `Cannot perform '${operatorBefore}' operation on date field '{${fieldName}}'`
            });
            reportedOperators.add(key);
          }
        }
        if (operatorAfter && dateInvalidOps.indexOf(operatorAfter) !== -1) {
          const key: string = `${operatorAfterPos}:${operatorAfter}`;
          if (!reportedOperators.has(key)) {
            errors.push({
              type: 'InvalidOperation',
              message: `Cannot perform '${operatorAfter}' operation on date field '{${fieldName}}'`
            });
            reportedOperators.add(key);
          }
        }

        // Allow + only when combined with numbers or number fields
        if (operatorAfter === '+') {
          const operandAfter: string = textAfter.replace(/^\s+/, '').substring(1).trim();
          const isNumberField: boolean = /^\{[^}]+\}/.test(operandAfter) && fieldMap.get(operandAfter.slice(1, -1)) && fieldMap.get(operandAfter.slice(1, -1)).type === 'number';
          const isNumberLiteral: boolean = /^\d+/.test(operandAfter);

          if (!isNumberField && !isNumberLiteral) {
            const key = `${operatorAfterPos}:${operatorAfter}`;
            if (!reportedOperators.has(key)) {
              errors.push({
                type: 'InvalidOperation',
                message: `Date field '{${fieldName}}' can only be used with +number or +{numberField}, not '${operatorAfter}${operandAfter.substring(0, 10)}'`
              });
              reportedOperators.add(key);
            }
          }
        }

        if (operatorBefore === '+') {
          const trimmedBefore: string = textBefore.replace(/\s+$/, '');
          const operandBefore: string = trimmedBefore.substring(0, trimmedBefore.length - 1).trim();
          const isNumberField: boolean = /\{[^}]+\}$/.test(operandBefore) && fieldMap.get(operandBefore.slice(operandBefore.lastIndexOf('{') + 1, -1)) && fieldMap.get(operandBefore.slice(operandBefore.lastIndexOf('{') + 1, -1)).type === 'number';
          const isNumberLiteral: boolean = /\d+$/.test(operandBefore);

          if (!isNumberField && !isNumberLiteral) {
            const key = `${operatorBeforePos}:${operatorBefore}`;
            if (!reportedOperators.has(key)) {
              errors.push({
                type: 'InvalidOperation',
                message: `Date field '{${fieldName}}' can only be used with +number or +{numberField}`
              });
              reportedOperators.add(key);
            }
          }
        }
      }
    }

    return errors;
  }

  private validateSyntax(expression: string): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check balanced braces
    const openBraces = (expression.match(/\{/g) || []).length;
    const closeBraces = (expression.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push({
        type: 'SyntaxError',
        message: 'Unbalanced braces in expression'
      });
    }

    // Check balanced parentheses
    const openParens = (expression.match(/\(/g) || []).length;
    const closeParens = (expression.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push({
        type: 'SyntaxError',
        message: 'Unbalanced parentheses in expression'
      });
    }

    // Check balanced $ brackets
    const openDollar = (expression.match(/\$\{/g) || []).length;
    const closeDollar = (expression.match(/\}/g) || []).length;
    if (openDollar > closeDollar) {
      errors.push({
        type: 'SyntaxError',
        message: 'Unbalanced ${ } in expression'
      });
    }

    return errors;
  }

  /**
   * @private
   */
  public validateFieldReferences(expression: string, availableFields: string[] | any[]): ValidationError[] {
    const errors: ValidationError[] = [];

    // Skip field validation if availableFields is not properly populated
    // This allows expressions to work at runtime even if we can't validate field names at editor time
    if (!availableFields || availableFields.length === 0) {
      return errors;
    }

    const fieldRefPattern = /\{([^{}]+)\}/g;
    let match;

    // Handle both string[] and AvailableField[] formats
    let availableFieldsSet: Set<string>;
    if (typeof availableFields[0] === 'string') {
      availableFieldsSet = new Set(availableFields as string[]);
    } else {
      availableFieldsSet = new Set((availableFields as any[]).map(f => f.name));
    }

    while ((match = fieldRefPattern.exec(expression)) !== null) {
      const ref = match[1].trim();

      // Skip if it's a function call
      if (this.isFunctionCall(ref)) continue;

      // Skip if it's a math expression (contains operators or numbers)
      // This distinguishes between {fieldName} and ${5 + 3}
      if (this.isMathExpression(ref)) continue;

      // Extract field name from nested paths (e.g., "customer.name" -> "customer")
      const fieldName = ref.split(/[.\[\]]/)[0].trim();

      // Check if field exists
      if (fieldName && this.keywords.indexOf(fieldName.toUpperCase()) === -1) {
        if (!availableFieldsSet.has(fieldName)) {
          errors.push({
            type: 'UndefinedField',
            message: `Field '${fieldName}' is not defined in the form`,
            field: fieldName
          });
        }
      }
    }

    return errors;
  }

  private validateFunctionCalls(expression: string): ValidationError[] {
    const errors: ValidationError[] = [];
    const funcPattern = /(\w+)\s*\(/g;
    let match;

    while ((match = funcPattern.exec(expression)) !== null) {
      const funcName = match[1];

      // Only validate uppercase functions (user-defined lowercase functions might be allowed)
      if (funcName === funcName.toUpperCase() && this.supportedFunctions.indexOf(funcName) === -1) {
        errors.push({
          type: 'InvalidFunction',
          message: `Unknown function: '${funcName}'. Supported functions: ${this.supportedFunctions.join(', ')}`
        });
      }
    }

    return errors;
  }

  private isFunctionCall(ref: string): boolean {
    return /^\w+\s*\(/.test(ref);
  }

  private isMathExpression(ref: string): boolean {
    // Check if the expression contains math operators, numbers, or other non-field-name patterns
    // Math expressions like: "5 + 3", "qty * 2", "age > 18", "sum([1,2,3])"
    // should be skipped, while field references like "fieldName" or "customer.name" should be validated
    const mathOperatorPattern = /[\+\-\*\/\%\=\<\>\!\&\|\^\~\s\d]/;
    return mathOperatorPattern.test(ref);
  }
}

/**
 * @private
 */
export interface ValidationError {
  type: 'SyntaxError' | 'UndefinedField' | 'InvalidFunction' | 'CircularDependency' | 'InvalidOperation';
  message: string;
  field?: string;
  line?: number;
  column?: number;
}
