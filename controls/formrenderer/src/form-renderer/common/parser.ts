import { FormSchema, FormNode } from '../form-renderer/types/form-schema';
import { sanitizeId, VALIDATION_REGEX } from './utils';

/**
 * @private
 */
export interface ParserConfig {
  strict: boolean;
  maxInputSize: number;
  defaultTextType: 'textbox' | 'textarea';
  inferTypeFromValue: boolean;
  generateIds: boolean;
  includeMetadata: boolean;
  customTypeMap?: Record<string, string>;
  validateUnknownFields?: boolean;
}

/**
 * @private
 */
export interface FormatDetectionResult {
  format: 'json-schema' | 'surveyjs' | 'openapi' | 'data-inference' | 'configured-schema' | 'unknown';
  confidence: 'high' | 'medium' | 'low';
  hints: string[];
  ambiguousFormats?: string[];
}

/**
 * @private
 */
export interface ParseResult {
  success: boolean;
  schema: FormSchema | null;
  errors: string[];
  warnings: string[];
  metadata: {
    detectedFormat: string;
    confidence: 'high' | 'medium' | 'low';
    sourceHints: string[];
  };
}

/**
 * @private
 */
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

/**
 * @private
 */
export interface ParseComponentsResult {
  components: FormNode[];
  warnings: string[];
}

/**
 * @private
 */
const DEFAULT_CONFIG: ParserConfig = {
  strict: false,
  maxInputSize: 5 * 1024 * 1024,
  defaultTextType: 'textbox',
  inferTypeFromValue: true,
  generateIds: true,
  includeMetadata: true,
  customTypeMap: {},
  validateUnknownFields: false
};

/**
 * @private
 */
export class UniversalJsonParser {
  private config: ParserConfig;

  constructor(customConfig?: Partial<ParserConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...customConfig };
  }

  parse(input: string | any): ParseResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Handle string input
    if (typeof input === 'string') {
      if (input.length > this.config.maxInputSize) {
        return this.formatError(
          errors,
          warnings,
          `Input exceeds maximum size of ${this.config.maxInputSize} bytes`
        );
      }

      const jsonValidation = validateJSON(input);
      if (!jsonValidation.valid) {
        return this.formatError(
          errors,
          warnings,
          (jsonValidation.errors && jsonValidation.errors[0]) || 'Invalid JSON'
        );
      }

      try {
        input = JSON.parse(input);
      } catch (error) {
        return this.formatError(
          errors,
          warnings,
          `Failed to parse JSON: ${(error as Error).message}`
        );
      }
    }

    // Detect format
    const detection = this.detectFormat(input);

    // Add warnings for ambiguous format detection
    if (detection.ambiguousFormats && detection.ambiguousFormats.length > 0) {
      warnings.push(`Ambiguous format detected.`);
      warnings.push(`Using ${detection.format} format (${detection.format === 'json-schema' ? 'properties priority' : 'pages priority'})`);
    }

    // Parse based on format
    let components: FormNode[] = [];
    switch (detection.format) {
      case 'configured-schema':
        // Already in our standard format, just use directly
        components = input.properties || [];
        break;
      case 'json-schema': {
        const jsonSchemaResult = this.parseJsonSchema(input);
        components = jsonSchemaResult.components;
        if (jsonSchemaResult.warnings) {
          warnings.push(...jsonSchemaResult.warnings);
        }
        break;
      }
      case 'surveyjs':
        components = this.parseSurveyJS(input);
        break;
      case 'openapi':
        components = this.parseOpenAPI(input);
        break;
      case 'data-inference':
        components = this.parseDataInference(input);
        // Only warn about inferred types if components were actually created
        if (components.length > 0) {
          warnings.push('Field types inferred from data; please verify');
        }
        break;
      default:
        errors.push('Could not determine input format');
    }

    if (components.length === 0) {
      errors.push('No form fields could be extracted from input');
    }

    // Add default submit button if not already present
    const hasSubmitButton = components.some(
      (comp: any) => comp.type === 'button' && comp.buttonType === 'submit'
    );

    if (!hasSubmitButton && components.length > 0) {
      components.push({
        id: this.generateComponentId('button'),
        type: 'button',
        label: 'Submit',
        style: 'primary',
        buttonType: 'submit',
      } as FormNode);
    }

    const schema: FormSchema = {
      version: input.version || "0.1.0",
      components
    };

    const schemaValidation = validateFormSchema(schema);
    if (!schemaValidation.valid && schemaValidation.errors) {
      errors.push(...schemaValidation.errors);
    }
    if (schemaValidation.warnings) {
      warnings.push(...schemaValidation.warnings);
    }

    if (this.config.strict && warnings.length > 0) {
      errors.push(...warnings);
      warnings.length = 0;
    }

    const sanitized = sanitizeFormSchema(schema);

    return {
      success: errors.length === 0,
      schema: sanitized,
      errors,
      warnings,
      metadata: {
        detectedFormat: detection.format,
        confidence: detection.confidence,
        sourceHints: detection.hints
      }
    };
  }

  private formatError(
    errors: string[],
    warnings: string[],
    message: string
  ): ParseResult {
    errors.push(message);
    return {
      success: false,
      schema: null,
      errors,
      warnings,
      metadata: {
        detectedFormat: 'unknown',
        confidence: 'low',
        sourceHints: []
      }
    };
  }

  private detectFormat(input: any): FormatDetectionResult {
    const hints: string[] = [];
    const ambiguousFormats: string[] = [];

    if (!input || typeof input !== 'object') {
      return {
        format: 'unknown',
        confidence: 'low',
        hints: ['Input is not a valid object']
      };
    }

    // Check for JSON Schema indicators
    if (input.$schema && typeof input.$schema === 'string' && input.$schema.includes('json-schema')) {
      hints.push('$schema property detected');
      return { format: 'json-schema', confidence: 'high', hints };
    }

    // Detect ambiguous formats (Test Case 8)
    const hasProperties = input.properties && typeof input.properties === 'object';
    const hasPages = input.pages && Array.isArray(input.pages);
    const hasElements = input.elements && Array.isArray(input.elements);

    if (hasProperties && hasPages) {
      hints.push('Multiple format patterns detected');
      hints.push('Selected based on priority rules');
      ambiguousFormats.push('properties format', 'pages format');
      // JSON Schema has priority
      return {
        format: 'json-schema',
        confidence: 'medium',
        hints,
        ambiguousFormats
      };
    }

    // Check for SurveyJS with pages
    if (hasPages) {
      hints.push('pages array detected');
      if (input.pages[0] && input.pages[0].elements) hints.push('elements structure matched');
      return { format: 'surveyjs', confidence: 'high', hints };
    }

    // Check for SurveyJS with elements at root
    if (hasElements && !hasProperties) {
      hints.push('elements array at root level');
      return { format: 'surveyjs', confidence: 'medium', hints };
    }

    // Check for JSON Schema with properties
    if (hasProperties) {
      hints.push('properties object detected');
      if (input.type === 'object') hints.push('type: object matched');
      if (input.required && Array.isArray(input.required)) hints.push('required array found');

      // Check for API schema indicators (example fields pattern)
      if (this.hasExampleFields(input.properties)) {
        hints.push('example fields detected (API schema pattern)');
        return { format: 'openapi', confidence: 'high', hints };
      }
      return { format: 'json-schema', confidence: 'high', hints };
    }

    // Check for Data Inference
    if (this.isDataInferenceCandidate(input)) {
      hints.push('Simple object with primitive values');
      hints.push('No schema indicators found');
      return { format: 'data-inference', confidence: 'medium', hints };
    }

    return {
      format: 'unknown',
      confidence: 'low',
      hints: ['Could not identify format']
    };
  }

  private hasExampleFields(properties: any): boolean {
    if (!properties || typeof properties !== 'object') return false;
    const keys: string[] = Object.keys(properties);
    for (const key of keys) {
      const prop: any = (properties as Record<string, any>)[key as string];
      if (prop && 'example' in prop) { return true; }
    }
    return false;
  }

  private isDataInferenceCandidate(input: any): boolean {
    if (!input || typeof input !== 'object') return false;
    if (input.$schema || input.properties || input.pages || input.elements) return false;

    const inputKeys: string[] = Object.keys(input);
    return inputKeys.every((k: string) => {
      const val: any = (input as Record<string, any>)[k as string];
      if (val === null || val === undefined) return true;
      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return true;
      if (Array.isArray(val)) {
        return val.every(
          (item: any) =>
            typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean'
        );
      }
      return false;
    });
  }

  private inferComponentType(
    fieldName: string,
    value: any
  ): { type: string; textboxType?: string; confidence: 'high' | 'medium' | 'low'; method: string } {
    const valueType = this.inferTypeFromValue(fieldName, value);
    if (valueType.type) {
      return { ...valueType, confidence: 'high', method: 'value-type' };
    }

    const patternMatch = this.matchFieldNamePattern(fieldName);
    if (patternMatch.type) {
      return { ...patternMatch, confidence: 'high', method: 'name-pattern' };
    }

    return {
      type: this.config.defaultTextType,
      confidence: 'low',
      method: 'fallback'
    };
  }

  private inferTypeFromValue(fieldName: string, value: any): { type: string; textboxType?: string } {
    if (!this.config.inferTypeFromValue) return { type: 'textbox' };
    if (value === null || value === undefined) {
      // Even with null/undefined values, check field name patterns
      return this.matchFieldNamePattern(fieldName);
    }

    if (typeof value === 'string') {
      // Check value-based patterns first (highest confidence)
      if (value.includes('@') && value.includes('.')) {
        return { type: 'textbox', textboxType: 'email' };
      }
      // eslint-disable-next-line security/detect-unsafe-regex
      if (/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}/.test(value)) {
        return { type: 'textbox', textboxType: 'url' };
      }
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        return { type: 'date' };
      }

      // For generic strings, check field name patterns
      const fieldNameMatch = this.matchFieldNamePattern(fieldName);
      if (fieldNameMatch.type !== 'textbox' || fieldNameMatch.textboxType) {
        return fieldNameMatch;
      }

      return { type: this.config.defaultTextType };
    }

    if (typeof value === 'number') {
      return { type: 'number' };
    }

    if (typeof value === 'boolean') {
      return { type: 'checkbox' };
    }

    if (Array.isArray(value)) {
      return { type: 'multiselect' };
    }

    return { type: 'textbox' };
  }

  private matchFieldNamePattern(fieldName: string): { type: string; textboxType?: string } {
    if (this.config.customTypeMap) {
      const customType = this.config.customTypeMap[fieldName.toLowerCase()];
      if (customType) return { type: customType };
    }

    const lower = fieldName.toLowerCase();
    const normalized = lower.replace(/[_\-\s]+/g, ' ');

    if (/email|mail|e-?mail/.test(normalized)) return { type: 'textbox', textboxType: 'email' };
    if (/date|birth|birthday|dob|created|updated/.test(normalized)) return { type: 'date' };
    if (/phone|tel|mobile|cell|cellphone|msisdn/.test(normalized)) return { type: 'textbox', textboxType: 'number' };
    if (/url|link|uri|website/.test(normalized)) return { type: 'textbox', textboxType: 'url' };
    if (/password|pwd|pass|security|secret|key|token/.test(normalized)) return { type: 'textbox', textboxType: 'password' };
    if (/\b(?:age|count|qty|quantity|amount|price|cost|salary|fee|rate|number|num)\b/.test(normalized))
      return { type: 'number' };
    if (/active|enabled|visible|deleted|archived|approved|confirmed/.test(normalized))
      return { type: 'checkbox' };
    if (/select|choice|option|type|status|category|kind/.test(normalized))
      return { type: 'dropdown' };
    if (/description|comment|note|bio|biography|about|message|content|summary|details/.test(normalized))
      return { type: 'textarea' };

    return { type: 'textbox' };
  }

  private parseJsonSchema(schema: any): ParseComponentsResult {
    const components: FormNode[] = [];
    const warnings: string[] = [];
    if (!schema.properties || typeof schema.properties !== 'object') return { components, warnings };

    const flattenedProperties: any = this.flattenNestedProperties(schema.properties, '', warnings);

    const flatKeys: string[] = Object.keys(flattenedProperties);
    for (const key of flatKeys) {
      const propDef: any = flattenedProperties[key as string];
      const typeInfo: any = this.mapJsonSchemaType(propDef);
      const requiredArr: string[] = schema.required || [];
      const isRequired: boolean = requiredArr.indexOf(key) !== -1;
      components.push(
        this.createComponent(key, propDef, typeInfo, { required: isRequired })
      );
    }

    return { components, warnings };
  }

  private flattenNestedProperties(properties: any, prefix: string, warnings: string[]): any {
    const flattened: any = {};
    let hasNested: boolean = false;

    const propKeys: string[] = Object.keys(properties);
    for (const key of propKeys) {
      const propDef: any = (properties as Record<string, any>)[key as string];
      const fullKey: string = prefix ? `${prefix}_${key}` : key;

      // Check if this is a nested object (Test Case 9)
      if (propDef.type === 'object' && propDef.properties && typeof propDef.properties === 'object') {
        hasNested = true;
        const nestedFlattened: any = this.flattenNestedProperties(propDef.properties, fullKey, warnings);
        Object.assign(flattened, nestedFlattened);
      } else {
        flattened[fullKey as string] = propDef;
      }
    }

    // Add warnings for nested objects
    if (hasNested && !prefix) {
      warnings.push('NESTED_OBJECTS_FLATTENED: Nested objects converted to flat structure');
      const outerKeys: string[] = Object.keys(properties);
      for (const key of outerKeys) {
        const propDef: any = (properties as Record<string, any>)[key as string];
        if (propDef.type === 'object' && propDef.properties) {
          this.collectFlattenedFieldNames(propDef.properties, key, warnings);
        }
      }
    }

    return flattened;
  }

  private collectFlattenedFieldNames(properties: any, prefix: string, warnings: string[]): void {
    const collKeys: string[] = Object.keys(properties);
    for (const key of collKeys) {
      const propDef: any = (properties as Record<string, any>)[key as string];
      const fullKey: string = `${prefix}_${key}`;
      warnings.push(`Field '${prefix}.${key}' flattened to '${fullKey}'`);

      if (propDef.type === 'object' && propDef.properties) {
        this.collectFlattenedFieldNames(propDef.properties, fullKey, warnings);
      }
    }
  }

  private parseSurveyJS(schema: any): FormNode[] {
    const components: FormNode[] = [];

    if (schema.pages && Array.isArray(schema.pages)) {
      schema.pages.forEach((page: any) => {
        if (page.elements && Array.isArray(page.elements)) {
          page.elements.forEach((element: any) => {
            components.push(this.createComponentFromSurveyJS(element));
          });
        }
      });
    }

    if (!components.length && schema.elements && Array.isArray(schema.elements)) {
      schema.elements.forEach((element: any) => {
        components.push(this.createComponentFromSurveyJS(element));
      });
    }

    return components;
  }

  private createComponentFromSurveyJS(element: any): FormNode {
    const type = this.mapSurveyJSType(element.type || 'text');
    const validation: any = {};

    // Only add required if explicitly true
    if (element.isRequired === true) {
      validation.required = true;
    }

    if (element.validators && Array.isArray(element.validators)) {
      element.validators.forEach((validator: any) => {
        if (validator.type === 'numeric') {
          if (validator.minValue !== undefined) validation.minValue = validator.minValue;
          if (validator.maxValue !== undefined) validation.maxValue = validator.maxValue;
        }
        if (validator.type === 'text') {
          if (validator.minLength !== undefined) validation.minLength = validator.minLength;
          if (validator.maxLength !== undefined) validation.maxLength = validator.maxLength;
        }
      });
    }

    const component: any = {
      id: this.generateComponentId(type),
      type: type,
      label: element.title || element.label || this.humanizeFieldName(element.name),
      defaultValue: element.defaultValue,
      expressionValue: element.expressionValue,
      ...Object.keys(validation).length > 0 ? validation : undefined
    };

    if (type === 'dropdown' || type === 'multiselect' || type === 'radio' || type === 'splitButton') {
      if (element.choices && Array.isArray(element.choices)) {
        component.options = element.choices;
      }
    }

    return component as FormNode;
  }

  private mapSurveyJSType(surveyType: string): string {
    const typeMap: Record<string, string> = {
      text: 'textbox',
      email: 'email',
      number: 'number',
      checkbox: 'checkbox',
      radiogroup: 'radio',
      dropdown: 'dropdown',
      tagbox: 'multiselect',
      multiselect: 'multiselect',
      rating: 'number',
      comment: 'textarea',
      date: 'date'
    };
    return typeMap[surveyType as string] || 'textbox';
  }

  private parseOpenAPI(schema: any): FormNode[] {
    const components: FormNode[] = [];
    if (!schema.properties || typeof schema.properties !== 'object') return components;

    const openAPIKeys: string[] = Object.keys(schema.properties);
    const requiredArr: string[] = schema.required || [];
    for (const key of openAPIKeys) {
      const propDef: any = (schema.properties as Record<string, any>)[key as string];
      const typeInfo: any = this.mapJsonSchemaType(propDef);
      const isRequired: boolean = requiredArr.indexOf(key) !== -1;
      components.push(
        this.createComponent(key, propDef, typeInfo, { required: isRequired })
      );
    }

    return components;
  }

  private parseDataInference(data: any): FormNode[] {
    const components: FormNode[] = [];

    const dataKeys: string[] = Object.keys(data);
    for (const key of dataKeys) {
      const value: any = (data as Record<string, any>)[key as string];
      const typeInference: any = this.inferComponentType(key, value);

      const component: any = {
        id: this.generateComponentId(typeInference.type),
        type: typeInference.type,
        label: this.humanizeFieldName(key),
        defaultValue: value,
        expressionValue: undefined
      };

      if (typeInference.textboxType) {
        component.textboxType = typeInference.textboxType;
        // Add default regex patterns for email and url
        if (typeInference.textboxType === 'email') {
          component.regex = VALIDATION_REGEX['EMAIL'];
        } else if (typeInference.textboxType === 'url') {
          component.regex = VALIDATION_REGEX['URL'];
        }
      }

      if (typeInference.type === 'date' && component.defaultValue !== undefined && component.defaultValue !== null) {
        const formatted = this.formatDateTimeValue(component.defaultValue);
        if (formatted) component.defaultValue = formatted;
      }

      if (Array.isArray(value) && value.length > 0) {
        component.options = value;
      }

      components.push(component as FormNode);
    }

    return components;
  }

  private createComponent(
    fieldName: string,
    propDef: any,
    typeInfo: any,
    context: any
  ): FormNode {
    const validation: any = {};

    // Only add required if explicitly true
    const isRequired = propDef.required !== undefined ? propDef.required : context.required;
    if (isRequired === true) {
      validation.required = true;
    }

    if (propDef.minLength) validation.minLength = propDef.minLength;
    if (propDef.maxLength) validation.maxLength = propDef.maxLength;
    if (propDef.minDate) validation.minDate = propDef.minDate;
    if (propDef.maxDate) validation.maxDate = propDef.maxDate;
    if (propDef.minTime) validation.minTime = propDef.minTime;
    if (propDef.minValue) validation.minValue = propDef.minValue;
    if (propDef.maxValue) validation.maxValue = propDef.maxValue;
    if (propDef.pattern) {
      validation.pattern = propDef.pattern;
    }
    
    const rawId = propDef.id || this.generateComponentId(typeInfo.type);
    const safeGeneratedId = sanitizeId(rawId, this.generateComponentId(typeInfo.type));
    const component: any = {
      id: safeGeneratedId,
      name: propDef.name,
      type: typeInfo.type,
      label: propDef.title || propDef.label || this.humanizeFieldName(fieldName),
      defaultValue: propDef.default || propDef.defaultValue || undefined,
      expressionValue: propDef.expressionValue || undefined,
      content: propDef.content,
      buttonType: propDef.buttonType,
      textboxType: propDef.textboxType,
      ...Object.keys(validation).length > 0 ? validation : undefined
    };

    if (typeInfo.textboxType) {
      component.textboxType = typeInfo.textboxType;

      // Add default regex patterns for email and url
      if (typeInfo.textboxType === 'email') {
        if (!validation.pattern) {
          validation.regex = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'; // Standard email regex
          validation.validationMessage = 'Please enter a valid email address';
        }
      } else if (typeInfo.textboxType === 'url') {
        if (!validation.pattern) {
          validation.regex = '^(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$';
          validation.validationMessage = 'Please enter a valid URL';
        }
      }
    }

    if (typeInfo.type === 'date' && component.defaultValue !== undefined && component.defaultValue !== null) {
      const formatted = this.formatDateTimeValue(component.defaultValue);
      if (formatted) component.defaultValue = formatted;
    }

    if ((typeInfo.type === 'splitButton' || typeInfo.type === 'dropdown' || typeInfo.type === 'multiselect' || typeInfo.type === 'radio') && (propDef.enum || propDef.options)) {
      component.options = propDef.enum || propDef.options;
    }

    return component as FormNode;
  }

  private parseDateFromValue(value: any): Date | null {
    if (value == null) return null;
    // numeric timestamps
    if (typeof value === 'number') {
      // assume seconds if small
      if (value < 1e12) return new Date(value * 1000);
      return new Date(value);
    }
    if (typeof value === 'string') {
      const s = value.trim();
      // Try ISO / RFC parse
      const dIso = new Date(s);
      if (!isNaN(dIso.getTime())) return dIso;

      // yyyy-mm-dd[ T hh:mm(:ss)]
      // eslint-disable-next-line security/detect-unsafe-regex
      const m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/);
      if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4] || 0), Number(m[5] || 0), Number(m[6] || 0));

      // mm/dd/yyyy or m/d/yyyy
      // eslint-disable-next-line security/detect-unsafe-regex
      const m2 = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ T](\d{1,2}):(\d{2})(?:[:](\d{2}))?)?/);
      if (m2) return new Date(Number(m2[3]), Number(m2[1]) - 1, Number(m2[2]), Number(m2[4] || 0), Number(m2[5] || 0), Number(m2[6] || 0));
    }
    return null;
  }

  private formatDate(d: Date): string {
    const monthNum: number = d.getMonth() + 1;
    const dayNum: number = d.getDate();
    const mm: string = monthNum < 10 ? '0' + monthNum : String(monthNum);
    const dd: string = dayNum < 10 ? '0' + dayNum : String(dayNum);
    const yyyy: number = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  // private formatTime(d: Date): string {
  //   let hours = d.getHours();
  //   const minutes = d.getMinutes().toString().padStart(2, '0');
  //   const ampm = hours >= 12 ? 'PM' : 'AM';
  //   hours = hours % 12;
  //   if (hours === 0) hours = 12;
  //   return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  // }

  private formatDateTimeValue(value: any): string | undefined {
    const d = this.parseDateFromValue(value);
    if (!d) return undefined;
    const datePart = this.formatDate(d);
    const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0 || /\dT\d{2}:\d{2}/.test(String(value));
    if (hasTime) return `${datePart}`;
    return datePart;
  }

  private mapJsonSchemaType(propDef: any): { type: string; textboxType?: string } {
    const schemaType = propDef.type;

    if (schemaType === 'string') {
      const fmt = (propDef.format || '').toString().toLowerCase();
      const text = ((propDef.title || propDef.label || '') + ' ' + (propDef.description || '')).toLowerCase();

      if (/email|mail|e-?mail/.test(fmt) || /email|mail|e-?mail/.test(text))
        return { type: 'textbox', textboxType: 'email' };

      if (/uri|url|link|website/.test(fmt) || /uri|url|link|website/.test(text))
        return { type: 'textbox', textboxType: 'url' };

      if (/phone|tel|mobile|cell|msisdn/.test(fmt) || /phone|tel|mobile|cell|msisdn/.test(text))
        return { type: 'textbox', textboxType: 'number' };

      if (/password|pwd|pass|security|secret|key/.test(fmt) || /password|pwd|pass|security|secret|key/.test(text))
        return { type: 'textbox', textboxType: 'password' };

      if (fmt === 'date' || fmt === 'date-time' || /date|birthday|dob/.test(text))
        return { type: 'date' };

      if (propDef.enum) return { type: 'dropdown' };

      if (propDef.options) return { type: 'dropdown' };

      return { type: this.config.defaultTextType };
    }

    if (schemaType === 'number' || schemaType === 'integer') return { type: 'number' };
    if (schemaType === 'boolean') return { type: 'checkbox' };
    if (schemaType === 'array') return { type: 'multiselect' };
    // Presentation / custom widget types
    if (schemaType === 'message') return { type: 'message' };
    if (schemaType === 'button') return { type: 'button' };
    if (schemaType === 'signature' || schemaType === 'sign') return { type: 'signature' };
    if (schemaType === 'image' || schemaType === 'imageEditor') return { type: 'imageEditor' };
    if (schemaType === 'file' || schemaType === 'fileUpload') return { type: 'fileUpload' };
    if (schemaType === 'color' || schemaType === 'colorPicker') return { type: 'colorPicker' };
    if (schemaType === 'splitButton') return { type: 'splitButton' };

    return { type: this.config.defaultTextType };
  }

  private generateComponentId(type: string): string {
    if (!this.config.generateIds) return '';
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${type}_${timestamp}_${random}`;
  }

  private humanizeFieldName(fieldName: string): string {
    let result = fieldName.replace(/_/g, ' ');
    result = result.replace(/([a-z])([A-Z])/g, '$1 $2');
    return result;
  }
}

/**
 * @private
 */
export const validateJSON = (jsonString: string): ValidationResult => {
  try {
    JSON.parse(jsonString);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [`Invalid JSON syntax: ${(error as Error).message}`]
    };
  }
};

/**
 * @private
 */
export const validateFormSchema = (schema: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!schema.components) {
    errors.push('Missing required property: components');
  } else if (!Array.isArray(schema.components)) {
    errors.push('Property "components" must be an array');
  }

  // Validate component structure
  if (Array.isArray(schema.components)) {
    const componentIds = new Set<string>();

    const validateComponent = (comp: any, path: string = 'root') => {
      if (!comp.id) {
        errors.push(`Component at ${path} is missing "id" property`);
      } else {
        if (componentIds.has(comp.id)) {
          errors.push(`Duplicate component ID found: ${comp.id}`);
        }
        componentIds.add(comp.id);
      }

      if (!comp.type) {
        errors.push(`Component "${comp.id || 'unknown'}" is missing "type" property`);
      }

      if (comp.children && Array.isArray(comp.children)) {
        comp.children.forEach((child: any, index: number) => {
          validateComponent(child, `${path}.children[${index}]`);
        });
      }

      if (comp.tabItems && Array.isArray(comp.tabItems)) {
        comp.tabItems.forEach((tab: any, tabIndex: number) => {
          if (tab.content && Array.isArray(tab.content)) {
            tab.content.forEach((child: any, index: number) => {
              validateComponent(child, `${path}.tabItems[${tabIndex}].content[${index}]`);
            });
          }
        });
      }

      if (comp.tableCells && Array.isArray(comp.tableCells)) {
        comp.tableCells.forEach((row: any, rowIndex: number) => {
          if (Array.isArray(row)) {
            row.forEach((cell: any, colIndex: number) => {
              if (Array.isArray(cell)) {
                cell.forEach((child: any, index: number) => {
                  validateComponent(child, `${path}.tableCells[${rowIndex}][${colIndex}][${index}]`);
                });
              }
            });
          }
        });
      }
    };

    schema.components.forEach((comp: any, index: number) => {
      validateComponent(comp, `components[${index}]`);
    });
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  };
};

/**
 * @private
 */
export const sanitizeFormSchema = (schema: any): FormSchema => {
  const sanitized: FormSchema = {
    version: schema.version || "0.1.0",
    components: schema.components || []
  };

  const sanitizeComponent = (comp: any): any => {
    const sanitizedComp: any = {
      ...comp,
      _configured: true
    };

    if (comp.children && Array.isArray(comp.children)) {
      sanitizedComp.children = comp.children.map(sanitizeComponent);
    }

    if (comp.tabItems && Array.isArray(comp.tabItems)) {
      sanitizedComp.tabItems = comp.tabItems.map((tab: any) => ({
        ...tab,
        content: tab.content ? tab.content.map(sanitizeComponent) : []
      }));
    }

    if (comp.tableCells && Array.isArray(comp.tableCells)) {
      sanitizedComp.tableCells = comp.tableCells.map((row: any) =>
        row.map((cell: any) =>
          Array.isArray(cell) ? cell.map(sanitizeComponent) : []
        )
      );
    }

    return sanitizedComp as FormNode;
  };

  sanitized.components = sanitized.components.map(sanitizeComponent);

  return sanitized;
};

/**
 * @private
 */
export const exportFormSchema = (schema: FormSchema): string => {
  return JSON.stringify(schema, null, 2);
};
