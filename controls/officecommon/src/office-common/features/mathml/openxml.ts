/**
 * Local structural OpenXml element-tree contract for mathml parse/serialize.
 *
 * office-common has no shared `src/core/xml` yet (TASK-9002/9003). This
 * mirrors ej2-docx `src/core/xml/model.ts` so TASK-9011 can pass the same
 * tree shape across the boundary. Unify when core XML lands.
 *
 * These types are part of the public `@syncfusion/ej2-office-common/mathml` surface
 * (parse/serialize boundary). Keep them public under stripInternal builds —
 * never tag this module as internal.
 */

/** Attribute on an OpenXml element. */
export interface OpenXmlAttribute {
    readonly namespaceUri: string;
    readonly localName: string;
    readonly prefix: string;
    readonly value: string;
}

/** Namespace declaration (`xmlns` / `xmlns:prefix`). */
export interface NamespaceDeclaration {
    readonly prefix: string;
    readonly namespaceUri: string;
}

/** Element node. */
export interface OpenXmlElement {
    readonly kind: 'element';
    readonly namespaceUri: string;
    readonly localName: string;
    readonly prefix: string;
    readonly attributes: ReadonlyArray<OpenXmlAttribute>;
    readonly namespaceDeclarations: ReadonlyArray<NamespaceDeclaration>;
    readonly children: ReadonlyArray<OpenXmlChild>;
}

/** Text node. */
export interface OpenXmlText {
    readonly kind: 'text';
    readonly value: string;
}

/** Child of an element. */
export type OpenXmlChild = OpenXmlElement | OpenXmlText;

/**
 * Create an immutable element node.
 *
 * @param {string} namespaceUri - The namespace uri.
 * @param {string} localName - The local name.
 * @param {string} prefix - The prefix.
 * @param {object | undefined} options - The options.
 * @returns {OpenXmlElement} The result.
 */
export function createElement(namespaceUri: string, localName: string, prefix: string, options?: {
    readonly attributes?: ReadonlyArray<OpenXmlAttribute>;
    readonly namespaceDeclarations?: ReadonlyArray<NamespaceDeclaration>;
    readonly children?: ReadonlyArray<OpenXmlChild>;
}): OpenXmlElement {
    return { kind: 'element',
        namespaceUri,
        localName,
        prefix,
        attributes: function (): ReadonlyArray<OpenXmlAttribute> {
            const _nc: ReadonlyArray<OpenXmlAttribute> = options == null ? void 0 : options.attributes;
            return _nc != null ? _nc : [];
        }(),
        namespaceDeclarations: function (): ReadonlyArray<NamespaceDeclaration> {
            const _nc: ReadonlyArray<NamespaceDeclaration> = options == null ? void 0 : options.namespaceDeclarations;
            return _nc != null ? _nc : [];
        }(),
        children: function (): ReadonlyArray<OpenXmlChild> {
            const _nc: ReadonlyArray<OpenXmlChild> = options == null ? void 0 : options.children;
            return _nc != null ? _nc : [];
        }()
    };
}

/**
 * Create a text node.
 *
 * @param {string} value - The value.
 * @returns {OpenXmlText} The result.
 */
export function createText(value: string): OpenXmlText {
    return {
        kind: 'text',
        value
    };
}

/**
 * Filter element children only.
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {ReadonlyArray<OpenXmlElement>} The result.
 */
export function childElements(element: OpenXmlElement): ReadonlyArray<OpenXmlElement> {
    return element.children.filter((c: OpenXmlChild): c is OpenXmlElement => c.kind === 'element');
}

/**
 * Read the first matching attribute value by local name (any namespace).
 *
 * @param {OpenXmlElement} element - The element.
 * @param {string} localName - The local name.
 * @returns {string | undefined} The result.
 */
export function attrValue(element: OpenXmlElement, localName: string): string | undefined {
    return function (): string {
        const _om: OpenXmlAttribute = element.attributes.find((a: OpenXmlAttribute) => a.localName === localName);
        return _om == null ? void 0 : _om.value;
    }();
}

/**
 * Read attribute value restricted to a namespace URI.
 *
 * @param {OpenXmlElement} element - The element.
 * @param {string} namespaceUri - The namespace uri.
 * @param {string} localName - The local name.
 * @returns {string | undefined} The result.
 */
export function attrValueNs(element: OpenXmlElement, namespaceUri: string, localName: string): string | undefined {
    return function (): string {
        const _om: OpenXmlAttribute = element.attributes.find(
            (a: OpenXmlAttribute) => a.namespaceUri === namespaceUri && a.localName === localName);
        return _om == null ? void 0 : _om.value;
    }();
}

/**
 * Concatenate direct text-node children.
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {string} The result.
 */
export function textContent(element: OpenXmlElement): string {
    let out: string = '';
    for (const child of element.children) {
        if (child.kind === 'text') {
            out += child.value;
        }
    }
    return out;
}
