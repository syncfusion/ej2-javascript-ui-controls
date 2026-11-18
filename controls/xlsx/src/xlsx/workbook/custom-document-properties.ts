/**
 * Custom Document Properties — Attach arbitrary named metadata to workbooks.
 *
 * Phase 2: OPC integration for loading and saving to /docProps/custom.xml
 */

import {
    DEFAULT_CUSTOM_PROPERTIES_PART_NAME,
    CUSTOM_PROPERTIES_REL_TYPE_TRANSITIONAL,
    CUSTOM_PROPERTIES_CONTENT_TYPE,
    DOC_PROPS_VTYPES_NS,
    isCustomPropertiesRelationshipType
} from '../core/package/constants';
import { OpcPackage } from '../core/package/opc-package';
import { OpcRelationship } from '../core/package/relationships';
import { decodeUtf8, encodeUtf8 } from '../core/xml/minimal-xml';

/**
 * A single custom document property with name, value, and type.
 *
 * @public
 */
export interface CustomDocumentProperty {
  /**
   * Property name (read-only, set via add/update).
   */
  readonly name: string;

  /**
   * Property value. Assign string, number, boolean, Date, null, or undefined.
   * Type is automatically detected on assignment.
   */
  value: string | number | boolean | Date | undefined | null;

  /**
   * Property data type (read-only, inferred from value).
   * Values: 'string' | 'number' | 'boolean' | 'date' | 'unknown'
   */
  readonly type: 'string' | 'number' | 'boolean' | 'date' | 'unknown';

  /**
   * Whether this property is linked to document content (reserved for Phase 2).
   * Default: false
   */
  linkToContent: boolean;

  /**
   * If linkToContent is true, the source reference for linked content (reserved for Phase 2).
   */
  linkSource: string | undefined;
}

/**
 * Collection of custom document properties attached to a workbook.
 *
 * @public
 */
export interface CustomDocumentProperties {
  /**
   * Get a custom property by name, or undefined if not found.
   *
   * @param name - Property name
   * @returns The property, or undefined if not found
   *
   * @example
   * ```typescript
   * const prop = workbook.customDocumentProperties.get('ClientID');
   * if (prop) {
   *   console.log(prop.value); // 'ACME-001'
   * }
   * ```
   */
  get(name: string): CustomDocumentProperty | undefined;

  /**
   * Add or update a custom property. If the property already exists,
   * returns the existing property; otherwise creates a new one.
   *
   * @param name - Property name (required, non-empty)
   * @param value - Initial value (optional; can be string, number, boolean, Date, null, or undefined)
   * @returns The new or existing property
   *
   * @example
   * ```typescript
   * const prop = workbook.customDocumentProperties.add('ProjectID', 'P-2025-001');
   * prop.value = 'P-2025-002'; // Update
   * ```
   */
  add(name: string, value?: string | number | boolean | Date | null): CustomDocumentProperty;

  /**
   * Remove a custom property by name.
   *
   * @param name - Property name
   * @returns true if removed, false if not found
   *
   * @example
   * ```typescript
   * if (workbook.customDocumentProperties.remove('Temporary')) {
   *   console.log('Removed');
   * }
   * ```
   */
  remove(name: string): boolean;

  /**
   * Check if a custom property with the given name exists.
   *
   * @param name - Property name
   * @returns true if the property exists, false otherwise
   */
  contains(name: string): boolean;

  /**
   * Get a property by zero-based index.
   *
   * @param index - Zero-based index
   * @returns The property at the given index
   * @throws RangeError if index is out of bounds
   */
  getAt(index: number): CustomDocumentProperty;

  /**
   * Number of custom properties in this collection (read-only).
   */
  readonly length: number;

  /**
   * Clear all custom properties from the collection.
   *
   * @example
   * ```typescript
   * workbook.customDocumentProperties.clear();
   * ```
   */
  clear(): void;

  /**
   * Iterate over all custom properties.
   *
   * @example
   * ```typescript
   * for (const prop of workbook.customDocumentProperties) {
   *   console.log(`${prop.name}: ${prop.value} (${prop.type})`);
   * }
   * ```
   */
  [Symbol.iterator](): Iterator<CustomDocumentProperty>;
}

/**
 * Internal implementation of CustomDocumentProperty.
 * @internal
 */
export class CustomDocumentPropertyImpl implements CustomDocumentProperty {
  private _name: string;
  private _value: string | number | boolean | Date | undefined | null;
  private _type: 'string' | 'number' | 'boolean' | 'date' | 'unknown';
  public linkToContent: boolean = false;
  public linkSource: string | undefined;

  constructor(name: string, value?: string | number | boolean | Date | null) {
    if (!name || typeof name !== 'string') {
      throw new Error('Property name must be a non-empty string');
    }
    this._name = name;
    this._value = value;
    this._type = this.detectType(value);
  }

  get name(): string {
    return this._name;
  }

  get value(): string | number | boolean | Date | undefined | null {
    return this._value;
  }

  set value(newValue: string | number | boolean | Date | undefined | null) {
    this._value = newValue;
    this._type = this.detectType(newValue);
  }

  get type(): 'string' | 'number' | 'boolean' | 'date' | 'unknown' {
    return this._type;
  }

  /**
   * Detect property type from value.
   * @internal
   */
  private detectType(value: any): 'string' | 'number' | 'boolean' | 'date' | 'unknown' {
    if (value === null || value === undefined) {
      return 'unknown';
    }
    if (typeof value === 'string') {
      return 'string';
    }
    if (typeof value === 'number') {
      return 'number';
    }
    if (typeof value === 'boolean') {
      return 'boolean';
    }
    if (value instanceof Date) {
      return 'date';
    }
    return 'unknown';
  }
}

/**
 * Internal implementation of CustomDocumentProperties collection.
 * @internal
 */
export class CustomDocumentPropertiesImpl implements CustomDocumentProperties {
  private properties: Map<string, CustomDocumentPropertyImpl> = new Map();
  private propertyList: CustomDocumentPropertyImpl[] = [];

  get(name: string): CustomDocumentProperty | undefined {
    return this.properties.get(name);
  }

  add(name: string, value?: string | number | boolean | Date | null): CustomDocumentProperty {
    // Idempotent: return existing if present
    let prop = this.properties.get(name);
    if (prop) {
      if (value !== undefined) {
        prop.value = value;
      }
      return prop;
    }

    // Create new property
    prop = new CustomDocumentPropertyImpl(name, value);
    this.properties.set(name, prop);
    this.propertyList.push(prop);

    // Mark as dirty
    this.markDirty();

    return prop;
  }

  remove(name: string): boolean {
    const prop = this.properties.get(name);
    if (!prop) {
      return false;
    }

    this.properties.delete(name);
    const index = this.propertyList.indexOf(prop);
    if (index >= 0) {
      this.propertyList.splice(index, 1);
    }

    this.markDirty();
    return true;
  }

  contains(name: string): boolean {
    return this.properties.has(name);
  }

  getAt(index: number): CustomDocumentProperty {
    if (index < 0 || index >= this.propertyList.length) {
      throw new RangeError(`Index ${index} out of bounds. Collection has ${this.propertyList.length} items.`);
    }
    return this.propertyList[index];
  }

  get length(): number {
    return this.propertyList.length;
  }

  clear(): void {
    if (this.propertyList.length > 0) {
      this.properties.clear();
      this.propertyList = [];
      this.markDirty();
    }
  }

  *[Symbol.iterator](): Iterator<CustomDocumentProperty> {
    for (const prop of this.propertyList) {
      yield prop;
    }
  }

  /**
   * Dirty tracking callback.
   * @internal
   */
  private dirtyCallback: (() => void) | undefined;

  /**
   * Dirty flag for this collection.
   * @internal
   */
  private isDirtyFlag: boolean = false;

  /**
   * Set dirty callback (called by Workbook to mark itself as dirty).
   * @internal
   */
  setDirtyCallback(callback: () => void): void {
    this.dirtyCallback = callback;
  }

  /**
   * Mark collection as dirty (modified).
   * @internal
   */
  private markDirty(): void {
    this.isDirtyFlag = true;
    if (this.dirtyCallback) {
      this.dirtyCallback();
    }
  }

  /**
   * Check if this collection is dirty.
   * @internal
   */
  isDirty(): boolean {
    return this.isDirtyFlag;
  }

  /**
   * Reset dirty flag after flush.
   * @internal
   */
  private resetDirty(): void {
    this.isDirtyFlag = false;
  }

  /**
   * Load properties from OPC package (/docProps/custom.xml).
   * @internal
   */
  static fromPackage(pkg: OpcPackage, relId?: string): CustomDocumentPropertiesImpl {
    const instance = new CustomDocumentPropertiesImpl();

    if (!relId) {
      // No custom properties part in package
      return instance;
    }

    try {
      // Get package-level relationships to find custom properties part
      const rels = pkg.getRelationships(null);
      let customPropsRel: OpcRelationship | undefined;
      for (const rel of rels) {
        if (rel.id === relId && isCustomPropertiesRelationshipType(rel.type)) {
          customPropsRel = rel;
          break;
        }
      }

      if (!customPropsRel) {
        return instance;
      }

      // Load the custom properties part
      const partName = customPropsRel.resolvedTarget;
      const part = pkg.getPart(partName);
      if (!part) {
        return instance;
      }

      // Parse XML: /docProps/custom.xml
      const xmlString = decodeUtf8(part.data);

      // Expected structure:
      // <Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/custom-properties">
      //   <property fmtid="..." pid="..." name="PropertyName">
      //     <vt:string>value</vt:string>
      //   </property>
      //   ...
      // </Properties>

      parseCustomPropertiesXml(xmlString, instance);

      // Clear dirty flag since we just loaded
      instance.resetDirty();
    } catch (err) {
      // On error, return empty instance (no data loss, graceful fallback)
      instance.resetDirty();
    }

    return instance;
  }

  /**
   * Save properties to OPC package (/docProps/custom.xml).
   * @internal
   */
  flush(pkg: OpcPackage): void {
    try {
      if (this.propertyList.length === 0) {
        // No properties — don't create part
        this.resetDirty();
        return;
      }

      // Build XML
        let xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
        xml += '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/custom-properties" ' +
            `xmlns:vt="${DOC_PROPS_VTYPES_NS}">\n`;

      let pid = 2; // pid starts at 2 (0–1 reserved)
      for (const prop of this.propertyList) {
        const safeName = escapeXmlAttribute(prop.name);
        xml += `  <property fmtid="{D5CDD505-2E9C-101B-9397-08002B2CF9AE}" pid="${pid}" name="${safeName}">\n`;
        xml += serializeVariant(prop);
        xml += '  </property>\n';
        pid++;
      }

      xml += '</Properties>';

      // Add/update part in OPC package using setPart
      const bytes = encodeUtf8(xml);
      pkg.setPart(
        DEFAULT_CUSTOM_PROPERTIES_PART_NAME,
        bytes,
        CUSTOM_PROPERTIES_CONTENT_TYPE
      );

      // Add or update relationship from package root
      const packageRels = Array.from(pkg.getRelationships(null));
      let hasCustomPropsRel = false;
      let nextRelId = 'rId1';

      // Find if custom properties relationship exists, and determine next relationship ID
      let maxRelNum = 0;
      for (const rel of packageRels) {
        if (isCustomPropertiesRelationshipType(rel.type)) {
          hasCustomPropsRel = true;
        }
        // Parse relationship ID number for allocating next ID
        const m = /^rId(\d+)$/i.exec(rel.id);
        if (m !== null && m[1] !== undefined) {
          const n = Number.parseInt(m[1], 10);
          if (n > maxRelNum) {
            maxRelNum = n;
          }
        }
      }

      // If relationship doesn't exist, add it
      if (!hasCustomPropsRel) {
        nextRelId = `rId${maxRelNum + 1}`;
        const newRel: OpcRelationship = {
          id: nextRelId,
          type: CUSTOM_PROPERTIES_REL_TYPE_TRANSITIONAL,
          target: DEFAULT_CUSTOM_PROPERTIES_PART_NAME,
          resolvedTarget: DEFAULT_CUSTOM_PROPERTIES_PART_NAME,
        };
        const updatedRels = [...packageRels, newRel];
        pkg.setRelationships(null, updatedRels);
      }

      this.resetDirty();
    } catch (err) {
      // On error, keep dirty flag set (will retry on next save)
      // This ensures no silent data loss
    }
  }
}

/**
 * Parse custom.xml content and populate the collection.
 * Uses string-based XML parsing like the rest of EJ2-XLSX.
 * @internal
 */
function parseCustomPropertiesXml(xml: string, instance: CustomDocumentPropertiesImpl): void {
  // Strip XML declaration and comments
  const trimmed = xml.replace(/<\?xml[^?]*\?>/g, '').replace(/<!--[\s\S]*?-->/g, '');

  // Find all <property> elements
  const propertyRegex = /<property[^>]*?name="([^"]*)"[^>]*>([\s\S]*?)<\/property>/gi;
  let match;

  while ((match = propertyRegex.exec(trimmed)) !== null) {
    const name = unescapeXmlAttribute(match[1]);
    const content = match[2];

    // Parse variant value from property content
    const value = parseVariantFromXml(content);
    instance.add(name, value);
  }
}

/**
 * Parse variant element content: <vt:string>...</vt:string>, etc.
 * @internal
 */
function parseVariantFromXml(content: string): string | number | boolean | Date | null {
  // Extract the text between variant tags (supports both lpstr and lpwstr)
  let stringMatch = /<vt:lpstr[^>]*>([\s\S]*?)<\/vt:lpstr>/i.exec(content);
  if (stringMatch) {
    return unescapeXmlContent(stringMatch[1]);
  }

  // Unicode wide string (lpwstr) — used for non-ASCII characters
  stringMatch = /<vt:lpwstr[^>]*>([\s\S]*?)<\/vt:lpwstr>/i.exec(content);
  if (stringMatch) {
    return unescapeXmlContent(stringMatch[1]);
  }

  const i4Match = /<vt:i4[^>]*>([\s\S]*?)<\/vt:i4>/i.exec(content);
  if (i4Match) {
    return parseInt(i4Match[1] || '0', 10);
  }

  const r8Match = /<vt:r8[^>]*>([\s\S]*?)<\/vt:r8>/i.exec(content);
  if (r8Match) {
    return parseFloat(r8Match[1] || '0');
  }

  const boolMatch = /<vt:bool[^>]*>([\s\S]*?)<\/vt:bool>/i.exec(content);
  if (boolMatch) {
    const boolStr = (boolMatch[1] || '').toLowerCase();
    return boolStr === 'true' || boolStr === '1';
  }

  const filetimeMatch = /<vt:filetime[^>]*>([\s\S]*?)<\/vt:filetime>/i.exec(content);
  if (filetimeMatch) {
    try {
      return new Date(filetimeMatch[1]);
    } catch {
      return null;
    }
  }

  // Unknown variant type
  return null;
}

/**
 * Serialize property value to variant XML.
 * @internal
 */
/**
 * Detect if a string contains non-ASCII Unicode characters (> U+00FF).
 * Returns 'lpwstr' for Unicode strings, 'lpstr' for ASCII/Latin-1.
 * @internal
 */
function detectStringVariantType(value: string): 'lpstr' | 'lpwstr' {
  // Check if any character is outside Latin-1 range (U+0000 to U+00FF)
  for (let i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) > 0xFF) {
      return 'lpwstr';
    }
  }
  return 'lpstr';
}

function serializeVariant(prop: CustomDocumentPropertyImpl): string {
  let xml = '';

  switch (prop.type) {
    case 'string':
      const strValue = escapeXmlContent(String(prop.value || ''));
      // Use lpwstr for non-ASCII Unicode, lpstr for ASCII/Latin-1 (ECMA-376-1 compliance)
      const variantType = detectStringVariantType(String(prop.value || ''));
      xml += `    <vt:${variantType}>${strValue}</vt:${variantType}>\n`;
      break;

    case 'number':
      const num = prop.value as number;
      if (Number.isInteger(num)) {
        xml += `    <vt:i4>${num}</vt:i4>\n`;
      } else {
        xml += `    <vt:r8>${num}</vt:r8>\n`;
      }
      break;

    case 'boolean':
      const boolStr = prop.value ? 'true' : 'false';
      xml += `    <vt:bool>${boolStr}</vt:bool>\n`;
      break;

    case 'date':
      const date = prop.value as Date;
      const isoStr = date.toISOString ? date.toISOString() : String(date);
      xml += `    <vt:filetime>${escapeXmlContent(isoStr)}</vt:filetime>\n`;
      break;

    case 'unknown':
      // Unknown type — serialize as empty string
      xml += '    <vt:lpstr></vt:lpstr>\n';
      break;
  }

  return xml;
}

/**
 * Escape XML special characters in attribute values.
 * @internal
 */
function escapeXmlAttribute(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Escape XML special characters in text content.
 * @internal
 */
function escapeXmlContent(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Unescape XML special characters in attribute values.
 * @internal
 */
function unescapeXmlAttribute(text: string): string {
  if (!text) return '';
  return text
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/**
 * Unescape XML special characters in text content.
 * @internal
 */
function unescapeXmlContent(text: string): string {
  if (!text) return '';
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}
