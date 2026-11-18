/**
 * Low-level OMML element builders shared by the Office Math serializer.
 *
 * Source: ECMA-376-1 §22.1 (shared-math.xsd). The schema declares `attributeFormDefault="qualified"`,
 * so `m:val`-style attributes are written in the math namespace, as Word does.
 */

import { MATH_NAMESPACE, MATH_PREFIX_FALLBACKS } from '../constants';
import { MathmlValidationError, MathmlConstraintKind } from '../errors';
import { createElement, OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../openxml';
import { MathDocumentAdapter } from '../office-math/adapter';
import { ExplicitPropertyStore } from '../office-math/property-store';

/** Options of the Office Math serializer. @public */
export interface SerializeOfficeMathOptions {
    /** Math prefix to write. Defaults to the first free entry of `m`, `m1`, `m2`… */
    readonly prefix?: string;
    /** Prefixes already claimed in the outer document. */
    readonly reservedPrefixes?: ReadonlyArray<string>;
    /**
     * Forces `m:oMathPara` (true) or a bare `m:oMath` (false). When omitted the root is display when
     * the paragraph has explicit justification or does not hold exactly one equation.
     */
    readonly display?: boolean;
}

/** State threaded through one serialization. @private */
export interface WriteContext {
    readonly prefix: string;
    readonly adapter: MathDocumentAdapter | undefined;
}

/**
 * Picks the math prefix for a save.
 *
 * @param {SerializeOfficeMathOptions} options The serializer options.
 * @returns {string} The prefix.
 * @private
 */
export function resolveMathPrefix(options?: SerializeOfficeMathOptions): string {
    if (options !== undefined && options.prefix !== undefined && options.prefix.length > 0) { return options.prefix; }
    const reserved: ReadonlyArray<string> = options !== undefined && options.reservedPrefixes !== undefined ? options.reservedPrefixes : [];
    const free: string[] = MATH_PREFIX_FALLBACKS.filter((p: string) => reserved.indexOf(p) === -1);
    return free.length > 0 ? free[0] : 'm999';
}

/**
 * Creates an `m:` element. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {string} name The local name.
 * @param {ReadonlyArray<OpenXmlChild>} children The children.
 * @param {ReadonlyArray<OpenXmlAttribute>} attributes The attributes.
 * @returns {OpenXmlElement} The element.
 */
export function mathElement(ctx: WriteContext, name: string, children: ReadonlyArray<OpenXmlChild> = [],
                            attributes: ReadonlyArray<OpenXmlAttribute> = []): OpenXmlElement {
    return createElement(MATH_NAMESPACE, name, ctx.prefix, { attributes, children });
}

/**
 * Creates a namespace-qualified math attribute. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {string} name The attribute local name.
 * @param {string} value The value.
 * @returns {OpenXmlAttribute} The attribute.
 */
export function mathAttribute(ctx: WriteContext, name: string, value: string): OpenXmlAttribute {
    return { namespaceUri: MATH_NAMESPACE, localName: name, prefix: ctx.prefix, value };
}

/**
 * Creates `<m:name m:val="value"/>`. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {string} name The element local name.
 * @param {string} value The value.
 * @returns {OpenXmlElement} The element.
 */
export function valueElement(ctx: WriteContext, name: string, value: string): OpenXmlElement {
    return mathElement(ctx, name, [], [mathAttribute(ctx, 'val', value)]);
}

/**
 * Creates an on/off element using the canonical `1` / `0`. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {string} name The element local name.
 * @param {boolean} value The value.
 * @returns {OpenXmlElement} The element.
 */
export function onOffElement(ctx: WriteContext, name: string, value: boolean): OpenXmlElement {
    return valueElement(ctx, name, value ? '1' : '0');
}

/**
 * Throws a validation error. @private
 *
 * @param {string} message The message.
 * @param {string} path The element path.
 * @param {MathmlConstraintKind} kind The violated constraint.
 * @returns {never} Never returns.
 */
export function invalid(message: string, path: string, kind: MathmlConstraintKind): never {
    throw new MathmlValidationError(message, path, kind);
}

/**
 * Maps an enum value to its OMML token, failing on out-of-range values. @private
 *
 * @param {ReadonlyArray<string>} table Tokens indexed by enum value.
 * @param {number} value The enum value.
 * @param {string} path The element path.
 * @param {string} label The schema type name.
 * @returns {string} The token.
 */
export function token(table: ReadonlyArray<string>, value: number, path: string, label: string): string {
    const result: string | undefined = table[value as number];
    return result !== undefined ? result : invalid('Illegal ' + label + ' value ' + String(value), path, 'enum-value');
}

/**
 * Asserts an unsigned integer. @private
 *
 * @param {number} value The value.
 * @param {string} path The element path.
 * @returns {string} The decimal text.
 */
export function unsigned(value: number, path: string): string {
    return Number.isInteger(value) && value >= 0 ? String(value) : invalid('Expected an unsigned integer, got ' + String(value), path, 'value-range');
}

/** An explicit on/off property: store key, element name and current value. @private */
export type FlagEntry = [number, string, boolean];

/**
 * Appends an on/off element for every flag that was explicitly set. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {OpenXmlChild[]} out The children being built.
 * @param {ExplicitPropertyStore} store The owner of the properties.
 * @param {FlagEntry[]} entries Entries in schema order.
 * @returns {void}
 */
export function writeFlags(ctx: WriteContext, out: OpenXmlChild[], store: ExplicitPropertyStore, entries: FlagEntry[]): void {
    entries.forEach((e: FlagEntry) => { if (store.isExplicit(e[0])) { out.push(onOffElement(ctx, e[1], e[2])); } });
}

/**
 * Appends a value element when the property was explicitly set. @private
 *
 * @param {WriteContext} ctx The write context.
 * @param {OpenXmlChild[]} out The children being built.
 * @param {ExplicitPropertyStore} store The owner of the property.
 * @param {number} key The property key.
 * @param {string} name The element local name.
 * @param {Function} value Lazily produces the text, so unset properties are never evaluated.
 * @returns {void}
 */
export function writeValue(ctx: WriteContext, out: OpenXmlChild[], store: ExplicitPropertyStore, key: number, name: string,
                           value: () => string): void {
    if (store.isExplicit(key)) { out.push(valueElement(ctx, name, value())); }
}
