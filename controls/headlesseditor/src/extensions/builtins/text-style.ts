import { defineExtension } from '../define-extension';
import type { AttributeDefinition } from '../../schema/types/attribute-definition';
import type { MarkDefinition } from '../../schema/types/mark-definition';
import { DOMOutputDescriptor, ExtensionDefinition, ExtensionDOMSpecs, ExtensionOptions, ExtensionScope} from '../types';
import type { Command } from '../../commands/types';

/** Attribute names on the `textStyle` mark. */
type TextStyleAttribute = 'color' | 'backgroundColor' | 'fontFamily' | 'fontSize';

/** CSS properties emitted in the inline `style` attribute. */
type TextStyleCssProperty = 'color' | 'background-color' | 'font-family' | 'font-size';

/**
 * Configuration for a `textStyle` attribute, including its CSS mapping and serialization behavior.
 */
interface TextStyleProperty {
    /** Attribute name on the mark. */
    readonly attribute: TextStyleAttribute;
    /** CSS property name in the inline `style` attribute. */
    readonly cssProperty: TextStyleCssProperty;
    /** Whether the value must be wrapped in double quotes in CSS. */
    readonly needsCssQuoting: boolean;
}

/**
 * List of supported text style attributes and their corresponding
 * CSS properties used for style generation and serialization.
 */
const TEXT_STYLE_PROPERTIES: readonly TextStyleProperty[] = [
    { attribute: 'color', cssProperty: 'color', needsCssQuoting: false },
    { attribute: 'backgroundColor', cssProperty: 'background-color', needsCssQuoting: false },
    { attribute: 'fontFamily', cssProperty: 'font-family', needsCssQuoting: true },
    { attribute: 'fontSize', cssProperty: 'font-size', needsCssQuoting: false }
];

/**
 * Builds mark attribute definitions from the supported text style properties.
 *
 * @returns {AttributeDefinition[]} An array of attribute definitions.
 */
function buildTextStyleAttributeDefinitions(): AttributeDefinition[] {
    return TEXT_STYLE_PROPERTIES.map(
        ({ attribute }: TextStyleProperty): AttributeDefinition => ({
            name: attribute,
            type: 'string',
            default: null
        })
    );
}

/**
 * Checks whether a font-family name should be wrapped in quotes.
 *
 * Font family names containing spaces (for example, "Times New Roman"
 * or "Segoe UI") need quotes so CSS treats them as a single font name
 * instead of multiple separate values. Names that are already quoted
 * do not require additional quoting.
 *
 * @param {string} family The font-family value to evaluate.
 * @returns {boolean} True if the value needs double-quoting.
 */
function needsCssQuoting(family: string): boolean {
    if (/^["'].*["']$/.test(family)) {
        return false;
    }
    return /[\s\d]/.test(family);
}

/**
 * Returns a CSS-safe font-family value by adding quotes when needed.
 * This ensures values containing spaces are preserved as a single font-family value
 * when written to the CSS style attribute.
 *
 * @param {string} family The font-family value to evaluate.
 * @returns {string} The font-family value, wrapped in double quotes if required for valid CSS.
 */
function cssQuoteFamily(family: string): string {
    return needsCssQuoting(family) ? `"${family}"` : family;
}

/**
 * Converts a font-family value into a CSS-safe format.
 *
 * Splits the value on commas, trims each part, and adds CSS quotes
 * to any family name that contains spaces or digits.
 *
 * Example:
 *   input  = "Arial, Times New Roman,  Segoe UI"
 *   output = "Arial, \"Times New Roman\", \"Segoe UI\""
 *
 * @param {string} value The font-family value.
 * @returns {string} The formatted CSS font-family value.
 */
function cssFontFamilyValue(value: string): string {
    // Collect the formatted font-family values.
    const parts: string[] = [];
    // Process each font-family value separately.
    for (const rawPart of value.split(',')) {
        // Trim whitespace and add quotes when required.
        parts.push(cssQuoteFamily(rawPart.trim()));
    }
    // Rebuild the font-family value in a CSS-safe format.
    return parts.join(', ');
}

/**
 * Represents the attributes stored on a textStyle mark.
 * Attributes are optional and may contain values from ProseMirror.
 */
type TextStyleMarkAttributes = Partial<Record<TextStyleAttribute, unknown>>;

/**
 * Creates a CSS declaration for the given text style property.
 *
 * Applies any required value formatting before generating the
 * corresponding CSS property/value pair.
 *
 * @param {TextStyleProperty} property The text style property to render.
 * @param {string} value The property's value.
 * @returns {string} A CSS declaration in the format `property: value`.
 */
function renderCssDeclaration(property: TextStyleProperty, value: string): string {
    const cssValue: string = property.needsCssQuoting ? cssFontFamilyValue(value) : value;
    return `${property.cssProperty}: ${cssValue}`;
}

/**
 * Builds the inline CSS style string for a textStyle mark.
 *
 * Includes only text style properties that have valid values and
 * combines them into a single style attribute value.
 *
 * @param {TextStyleMarkAttributes} markAttributes The attributes stored on the textStyle mark.
 * @returns {string} The generated inline style string, or an empty string if no styles are present.
 */
function buildInlineStyle(markAttributes: TextStyleMarkAttributes): string {
    const declarations: string[] = [];
    for (const property of TEXT_STYLE_PROPERTIES) {
        const value: unknown = markAttributes[property.attribute];
        if (typeof value === 'string' && value !== '') {
            declarations.push(renderCssDeclaration(property, value));
        }
    }
    return declarations.join('; ');
}

/**
 * Parses an inline style string and extracts textStyle mark attributes.
 * Recognizes color, background-color, font-family, and font-size CSS properties.
 *
 * @param {string} styleString The inline style attribute value.
 * @returns {TextStyleMarkAttributes} The extracted textStyle mark attributes (only non-null values).
 */
function parseInlineStyle(styleString: string): TextStyleMarkAttributes {
    const attrs: TextStyleMarkAttributes = {};
    if (!styleString) {
        return attrs;
    }

    // Parse CSS declarations from the style string
    const declarations: string[] = styleString.split(';');
    for (const decl of declarations) {
        const trimmed: string = decl.trim();
        if (!trimmed) { continue; }

        const colonIdx: number = trimmed.indexOf(':');
        if (colonIdx === -1) { continue; }

        const prop: string = trimmed.substring(0, colonIdx).trim().toLowerCase();
        const value: string = trimmed.substring(colonIdx + 1).trim();

        if (prop === 'color' && value) {
            attrs.color = value;
        } else if (prop === 'background-color' && value) {
            attrs.backgroundColor = value;
        } else if (prop === 'font-family' && value) {
            // Remove surrounding quotes if present
            const unquoted: string = value.replace(/^["']|["']$/g, '');
            attrs.fontFamily = unquoted;
        } else if (prop === 'font-size' && value) {
            attrs.fontSize = value;
        }
    }

    return attrs;
}

/**
 * Collects textStyle mark attributes by reading the inline `style` attribute
 * of the given DOM element and walking up the ancestor chain of `<span>`
 * elements, merging any text-style properties found along the way. Innermost span wins for shared keys
 * (Fix for ProseMirror's default behavior.)
 *
 * @param {Element | null} dom The DOM element being matched by the parse rule.
 * @returns {TextStyleMarkAttributes | false} The merged attributes, or `false`
 *     when no relevant styles are present in the span ancestry.
 */
function collectTextStyleAttrs(dom: Element | null): TextStyleMarkAttributes | false {
    // Walk inner -> outer. Each span contributes only the keys that have
    // not already been seen, so the innermost span wins for shared keys
    // and outer spans fill in everything else.
    const collected: TextStyleMarkAttributes = {};
    let current: Element | null = dom;
    while (current && current.nodeType === 1 && (current as Element).nodeName === 'SPAN') {
        const styleAttr: string | null = (current as Element).getAttribute
            ? (current as Element).getAttribute('style')
            : null;
        if (styleAttr) {
            const parsed: TextStyleMarkAttributes = parseInlineStyle(styleAttr);
            for (const key in parsed) {
                if (Object.prototype.hasOwnProperty.call(parsed, key)) {
                    if (collected[key as TextStyleAttribute] === undefined) {
                        collected[key as TextStyleAttribute] = parsed[key as TextStyleAttribute];
                    }
                }
            }
        }
        current = (current as Element).parentElement;
    }

    if (!hasAnyTextStyleAttr(collected)) {
        return false;
    }
    return collected;
}

/**
 * Returns `true` when the given attribute bag contains at least one defined
 * text-style property. Used to decide whether a parse rule should add a mark.
 *
 * @param {TextStyleMarkAttributes} attrs The attribute bag to inspect.
 * @returns {boolean} True when any text-style property is present and non-null.
 */
function hasAnyTextStyleAttr(attrs: TextStyleMarkAttributes): boolean {
    for (const key in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, key)) {
            const value: unknown = attrs[key as TextStyleAttribute];
            if (value !== undefined && value !== null && value !== '') {
                return true;
            }
        }
    }
    return false;
}

/**
 * Provides a `textStyle` mark for applying inline text formatting.
 *
 * The extension supports font color, background color, font family,
 * and font size. All styles are stored as mark attributes and rendered
 * as CSS styles on a single `span` element.
 *
 * Custom HTML attributes can be supplied through the `htmlAttributes`
 * option and will be added to the rendered element.
 */
export const textStyleExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    name: 'textStyle',

    /**
     * Defines the default extension options.
     *
     * @returns {ExtensionOptions} The default configuration.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Defines the `textStyle` mark and its supported style attributes.
     *
     * @returns {MarkDefinition[]} The textStyle mark definition.
     */
    marks(): MarkDefinition[] {
        return [
            {
                name: 'textStyle',
                inclusive: true,
                /**
                 * Returns:
                 *     [
                 *         { name: 'color',           type: 'string', default: null },
                 *         { name: 'backgroundColor', type: 'string', default: null },
                 *         { name: 'fontFamily',      type: 'string', default: null },
                 *         { name: 'fontSize',        type: 'string', default: null }
                 *     ]
                 */
                attrs: buildTextStyleAttributeDefinitions()
            }
        ];
    },

    /**
     * Defines the DOM representation of the textStyle mark.
     *
     * The mark is rendered as a span element with the configured text
     * style attributes applied as inline CSS styles.
     *
     * @param {ExtensionScope<ExtensionOptions>} this The extension scope.
     * @returns {ExtensionDOMSpecs} The DOM rendering specifications for the textStyle mark.
     */
    domSpecs(this: ExtensionScope<ExtensionOptions>): ExtensionDOMSpecs {
        const userAttributes: Readonly<Record<string, string>> = this.options?.htmlAttributes ?? {};
        return {
            marks: {
                textStyle: {
                    /**
                     * Renders a textStyle mark as a span element with the
                     * corresponding inline styles.
                     *
                     * @param {TextStyleMarkAttributes} markAttributes The attributes carried by the textStyle mark.
                     * @returns {DOMOutputDescriptor} The DOM representation of the mark.
                     */
                    toDOM: (markAttributes: TextStyleMarkAttributes): DOMOutputDescriptor => {
                        const inlineStyle: string = buildInlineStyle(markAttributes);
                        return ['span', { style: inlineStyle, ...userAttributes }, 0];
                    },
                    parseDOM: [
                        {
                            tag: 'span[style]',
                            getAttrs: (dom: any) => {
                                return collectTextStyleAttrs(dom as Element | null);
                            }
                        }
                    ]
                }
            }
        };
    }
});

export default textStyleExtension;
