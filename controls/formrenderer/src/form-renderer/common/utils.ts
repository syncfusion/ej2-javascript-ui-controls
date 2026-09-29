import { FormNode, ConditionRule } from '../form-renderer/types/form-schema';
import { Internationalization } from '@syncfusion/ej2-base';
import { DataManager, Query, UrlAdaptor, WebApiAdaptor, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { ConditionalRuleEngine } from './conditional-rule-engine';
import { UI_TYPE_TO_SEMANTIC_TYPE } from './json-converter';
import { ExpressionEngine } from './expressions/expression-engine';

/**
 * @private
 */
export const VALIDATION_REGEX: { [key: string]: RegExp } = {
    EMAIL: /^(?!.*\.\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    // eslint-disable-next-line security/detect-unsafe-regex
    URL: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
    DATE_ISO: /^([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/,
    DIGITS: /^[0-9]*$/,
    PHONE: /^[+]?[0-9]{9,13}$/,
    CREDIT_CARD: /^\d{13,16}$/
};

/**
 * Form field value type (aligned with FormValidator)
 *
 * @private
 */
export type FormValueType = string | number | boolean | Date | bigint | symbol | File 
| FileList | string[] | number[] | any | null | undefined;

/**
 * @private
 */
export interface AvailableField {
  name: string;
  type: string;
  format?: string;
}

/**
 * Maps button style to Syncfusion CSS classes
 * @param style - Button style ('primary' | 'flat' | 'information' | 'error' | 'success' | 'warning')
 * @returns Space-separated CSS class string
 * @private
 */
export const mapButtonStyleToClass = (style?: string): string => {
  const styleMap: Record<string, string> = {
    'primary': 'e-primary',
    'flat': 'e-flat',
    'information': 'e-info',
    'error': 'e-danger',
    'success': 'e-success',
    'warning': 'e-warning'
  };
  return styleMap[style || 'primary'] || 'e-primary';
};

/**
 * Resolves button type to valid HTML button type
 * @param type - Button type ('submit' | 'reset' | 'button')
 * @returns Resolved button type
 * @private
 */
export const resolveButtonType = (type?: 'submit' | 'reset' | 'button'): 'submit' | 'reset' | 'button' => {
  return (type === 'submit' || type === 'reset') ? type : 'button';
};

/**
 * Maps button position to CSS justifyContent value
 * @param position - Button position ('Left' | 'Right' | 'Center')
 * @returns CSS justifyContent value
 * @private
 */
export const mapPositionToJustifyContent = (position?: string): string => {
  const positionMap: Record<string, string> = {
    'Left': 'flex-start',
    'Right': 'flex-end',
    'Center': 'center'
  };
  return positionMap[position || 'Left'] || 'flex-start';
};

/**
 * @private
 */
export function splitWidths(input: Array<number | null>): number[] {
  const result: Array<number> = input.map(v => (v === null ? NaN : Number(v)));
  const sumKnown = result.reduce((s, v) => s + (isNaN(v) ? 0 : v), 0);
  // If knowns already >= 100, unknowns become 0
  const remainingInt = Math.max(0, Math.round(100 - sumKnown));
  const unknownIndexes = result.map((v, i) => (isNaN(v) ? i : -1)).filter(i => i >= 0);
  const k = unknownIndexes.length;
  if (k === 0) {
    // nothing to split; just clamp/round knowns so they sum to 100 if you prefer, but return as-is
    return result.map(v => Math.round(v));
  }

  // Distribute integer percentage points to avoid fractional rounding problems
  const base = Math.floor(remainingInt / k);
  let remainder = remainingInt - base * k;

  // Fill unknowns with base + 1 for first `remainder` items
  unknownIndexes.forEach((idx) => {
    const add = remainder > 0 ? base + 1 : base;
    result[idx as number] = add;
    remainder = Math.max(0, remainder - 1);
  });

  // Convert any NaN (shouldn't remain) to 0 and round knowns
  return result.map(v => (isNaN(v) ? 0 : Math.round(v)));
}

/**
 * @private
 */
export function extractAllDescendantIds(component: FormNode): string[] {
  const childIds: string[] = [];

  function traverse(comps: FormNode[]) {
    for (const comp of comps) {
      childIds.push(comp.id);

      // Recursively traverse nested structures
      if (comp.children && Array.isArray(comp.children)) {
        traverse(comp.children);
      }

      // Handle table cells
      if (comp.tableCells && Array.isArray(comp.tableCells)) {
        comp.tableCells.forEach((row) => {
          if (Array.isArray(row)) {
            row.forEach((cell) => {
              if (Array.isArray(cell)) {
                traverse(cell);
              }
            });
          }
        });
      }

      // Handle tab items
      if (comp.tabItems && Array.isArray(comp.tabItems)) {
        comp.tabItems.forEach((tabItem) => {
          if (tabItem.content && Array.isArray(tabItem.content)) {
            traverse(tabItem.content);
          }
        });
      }
    }
  }

  // Start with direct children
  if (component.children && Array.isArray(component.children)) {
    traverse(component.children);
  }

  // Handle table cells
  if (component.tableCells && Array.isArray(component.tableCells)) {
    component.tableCells.forEach((row) => {
      if (Array.isArray(row)) {
        row.forEach((cell) => {
          if (Array.isArray(cell)) {
            traverse(cell);
          }
        });
      }
    });
  }

  // Handle tab items
  if (component.tabItems && Array.isArray(component.tabItems)) {
    component.tabItems.forEach((tabItem) => {
      if (tabItem.content && Array.isArray(tabItem.content)) {
        traverse(tabItem.content);
      }
    });
  }

  return childIds;
}

/**
 * @private
 */
export function formatDateValues(component: FormNode, value: any): any {
  const intl = new Internationalization();
  let dFormatter = intl.getDateFormat({
    format: 'MM/dd/yyyy',
    type: 'date'
  });
  if (component.type === 'date') {
    value = dFormatter(new Date(value));
  }
  if (component.type === 'time') {
    dFormatter = intl.getDateFormat({
      format: 'hh:mm a',
      type: 'time'
    });
    value = dFormatter(new Date(value))
  }
  if (component.type === 'dateTime') {
    dFormatter = intl.getDateFormat({
      format: 'MM/dd/yyyy hh:mm a',
      type: 'dateTime'
    });
    value = dFormatter(new Date(value))
  }
  if (component.type === 'dateRange' && Array.isArray(value)) {
    value = value.map(date =>
      date ? dFormatter(new Date(date)) : null
    );
  }
  return value
}

/**
 * @private
 */
export const getComponentFromSchema = (id?: string, formSchema?: any): any | null => {
  if (!id || !formSchema) return null;
  const findInComponents = (components: FormNode[]): FormNode | null => {
    for (const comp of components) {
      if (comp.id === id || comp.name === id) return comp;

      if (comp.children) {
        const found = findInComponents(comp.children);
        if (found) return found;
      }

      if (comp.tableCells) {
        for (const row of comp.tableCells) {
          for (const cell of row) {
            const found = findInComponents(cell);
            if (found) return found;
          }
        }
      }
      if (comp.tabItems) {
        for (const tab of comp.tabItems) {
          if (tab.content) {
            const found = findInComponents(tab.content);
            if (found) return found;
          }
        }
      }
    }
    return null;
  };
  return findInComponents(formSchema.components || []);
};

/**
 * Helper function to get the appropriate adaptor instance
 * @param adaptorType - Type of adaptor ('WebApiAdaptor' | 'UrlAdaptor' | 'ODataV4Adaptor')
 * @returns Adaptor instance
 * @private
 */
export const getAdaptorInstance = (adaptorType?: string): any => {
  switch (adaptorType) {
    case 'WebApiAdaptor':
      return new WebApiAdaptor();
    case 'ODataV4Adaptor':
      return new ODataV4Adaptor();
    case 'UrlAdaptor':
    default:
      return new UrlAdaptor();
  }
};

/**
 * Extracts data from a nested path using dot notation and array indices
 * @param data - The data object or array
 * @param path - Path to the data (e.g., 'results.items', '[0].data', 'response[0].values')
 * @returns Extracted data or empty array
 * @private
 */
export const extractDataFromPath = (data: any, path?: string): any => {
  if (!path || data === null || data === undefined) return data;

  // Split by dots but preserve array indices
  const parts = path.split(/\.(?![^\[]*\])/); // Split by dots not inside brackets
  let current = data;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return null;
    }

    // Handle array index notation like [0] or results[0]
    const arrayMatch = part.match(/^(\w*)\[(\d+)\]$/);
    if (arrayMatch) {
      const propName = arrayMatch[1];
      const index = parseInt(arrayMatch[2]);

      // If propName is empty, current should be an array
      if (!propName) {
        current = current[index as number];
      } else {
        current = current[propName as string] && current[propName as string][index as number];
      }
    } else {
      // Regular property access
      current = current[part as string];
    }
  }

  return current;
};

/**
 * Build name-indexed context from ID-indexed formValues
 * Simple traversal to map field names to their values
 * @private
 */
const buildNameContext = (formValues: Record<string, any>, components: FormNode[]): Record<string, any> => {
  const context: Record<string, any> = {};
  const traverse = (comps: FormNode[]) => {
    comps.forEach(comp => {
      // Map name -> value from formValues (keyed by ID)
      if (comp.name && comp.id in formValues) {
        context[comp.name] = formValues[comp.id];
      }
      if (comp.children) traverse(comp.children);
      if (comp.tabItems) comp.tabItems.forEach(t => t.content && traverse(t.content));
      if (comp.tableCells) comp.tableCells.forEach(row => row.forEach(cell => traverse(cell)));
    });
  };
  traverse(components);
  return context;
};

/**
 * @private
 */
const sharedFieldBindingEngine: ExpressionEngine = new ExpressionEngine();

/**
 * @private
 */
export const resolveFieldBinding = (
  value: any,
  formValues: Record<string, any>,
  components?: FormNode[]
): any => {
  if (typeof value !== 'string' || !/{[^}]+}/.test(value)) {
    return value; // No field references
  }

  // Build context: map field names to values from ID-keyed formValues
  const context = components
    ? buildNameContext(formValues, components)
    : formValues;

  try {
    const result: any = sharedFieldBindingEngine.evaluate(value, context);
    return result !== null && result !== undefined ? String(result) : '';
  } catch (err) {
    return value; // Return original on error
  }
};

/**
 * @private
 * (useFetchOptions is NOT located here — see ./option-fetcher.ts)
 * (useFetchLookupOptions is NOT located here — see ./option-fetcher.ts)
 */
export const resolveOptions = (options: any, fetchedOptions: string[], fetchedLookupDataSource?: any[]): any[] => {
  // If lookup type with fetched data, return fetched lookup records
  if (options && typeof options === 'object' && !Array.isArray(options) && (options as any).type === 'lookup' && fetchedLookupDataSource) {
    return fetchedLookupDataSource && fetchedLookupDataSource.length > 0 ? fetchedLookupDataSource : [];
  }

  // If URL type with fetched data, return fetched options
  if (options && typeof options === 'object' && !Array.isArray(options) && (options as any).type === 'url') {
    return fetchedOptions.length > 0 ? fetchedOptions : [];
  }

  // If already an array, return as-is
  if (Array.isArray(options)) {
    return options;
  }

  // If it's raw data type
  if (options && typeof options === 'object' && !Array.isArray(options) && (options as any).type === 'raw') {
    return Array.isArray((options as any).data) ? (options as any).data : [];
  }

  return [];
};

/**
 * @private
 */
export const collectAvailableFieldNames = (components: FormNode[]): AvailableField[] => {
  const fieldNames: AvailableField[] = [];

  const traverse = (comps: FormNode[]) => {
    comps.forEach(comp => {
      // Only add fields that have a name and aren't layout components
      if (comp.name && ['panel', 'table', 'tabs', 'card', 'message', 'button', 'splitButton', 'staticHtml'].indexOf(comp.type) === -1) {
        // Get semantic type mapping for this component
        const semanticType = UI_TYPE_TO_SEMANTIC_TYPE[comp.type];
        if (semanticType) {
          fieldNames.push({
            name: comp.name,
            type: semanticType.type,
            ...(semanticType.format && { format: semanticType.format })
          });
        }
      }

      // Traverse nested components
      if (comp.children) traverse(comp.children);
      if (comp.tabItems) {
        comp.tabItems.forEach(tab => {
          if (tab.content) traverse(tab.content);
        });
      }
      if (comp.tableCells) {
        comp.tableCells.forEach(row => {
          row.forEach(cell => traverse(cell));
        });
      }
    });
  };

  traverse(components);
  return fieldNames;
};

/**
 * Resolve conditional data for a DataGrid component
 * Evaluates all conditionalData rules and applies the first matching one
 * Returns both dataSource and custom columns if defined
 *
 * @param conditions - Component conditions including conditional data rules
 * @param formValues - Current form field values
 * @returns Object with dataSource and columns, or undefined if no condition matches
 * @private
 */
export const resolveConditionalData = (
  conditions: ConditionRule | undefined,
  formValues: Record<string, any>
): { dataSource?: any[]; columns?: any[] } | undefined => {
  if (!conditions || !conditions.conditionalData || !Array.isArray(conditions.conditionalData)) {
    return undefined;
  }

  // Evaluate each conditional data rule in order
  for (const rule of conditions.conditionalData) {
    if (ConditionalRuleEngine.evaluateCondition(rule.condition, formValues)) {
      // Condition is met - resolve and return both data source and columns
      return {
        dataSource: rule.dataSource as any[],
        columns: (rule as any).columns && (rule as any).columns.length > 0 ? rule.columns : undefined
      };
    }
  }

  return undefined;
};

/**
 * Reads the current builder mode from the URL `mode` query parameter.
 * @returns 'Simple' | 'Developer' | undefined if not present or invalid
 * @private
 */
export const getCurrentMode = (): 'Simple' | 'Developer' | undefined => {
  if (typeof window === 'undefined') return undefined;
  const urlMode = new URLSearchParams(window.location.search).get('mode');
  if (urlMode === 'developer') return 'Developer';
  if (urlMode === 'simple') return 'Simple';
  return undefined;
};

/**
 * Navigates to a URL while preserving the current `mode` query parameter.
 * - If `mode` is already in target, it is kept as-is.
 * - If `mode` is present in the current URL, it is appended to the target.
 *
 * @param target - Target path (may include existing query params), e.g. '/?sample=builder&formId=123'
 * @private
 */
export const navigateTo = (target: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const url = new URL('/demo'+ target, window.location.origin);
    window.location.href = url.toString();
  } catch {
    window.location.href = '/demo'+ target;
  }
};

/**
 * @private
 */
export function sanitizeId(rawId: unknown, fallback?: string): string {
  const MAX_ID_LEN = 100;
  const safeFallback = typeof fallback === 'string' && fallback ? fallback : `field_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  if (rawId === null || rawId === undefined) return safeFallback;
  let id = String(rawId).trim();
  // Reject obvious prototype/constructor keys outright
  if (!id || id === '__proto__' || id === 'prototype' || id === 'constructor') {
    return safeFallback;
  }
  // Replace any character that is not alnum, dash, or underscore with underscore.
  id = id.replace(/[^A-Za-z0-9_-]/g, '_');
  // Ensure it starts with a letter or underscore (prepend if necessary).
  if (!/^[A-Za-z_]/.test(id)) {
    id = `f_${id}`;
  }
  // Truncate to a reasonable max length
  if (id.length > MAX_ID_LEN) {
    id = id.slice(0, MAX_ID_LEN);
  }
  // Final guard: avoid reserved names
  if (id === '__proto__' || id === 'prototype' || id === 'constructor') {
    return safeFallback;
  }
  return id;
}

// Exported EJ2 data symbols re-exported for downstream consumers (form-renderer option fetcher).
// `DataManager` / `Query` are used by OptionFetcher (see ./option-fetcher.ts).
export { DataManager, Query };
