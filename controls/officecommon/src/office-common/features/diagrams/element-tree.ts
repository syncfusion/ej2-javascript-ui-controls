/**
 * Local structural element tree for diagram parsers/serializers.
 *
 * Parsers MUST accept ElementTree only (no raw XML/bytes). A later TASK-9003
 * unification may replace this with a shared core type; the public parse
 * surface stays ElementTree-shaped.
 */

/** Attribute on an element. Namespace may be null for unnamespaced attrs. */
export interface ElementAttr {
    readonly name: string;
    readonly value: string;
    readonly namespaceUri?: string | null;
    readonly prefix?: string | null;
}

/**
 * Structural element node.
 * `localName` is the unqualified name; `namespaceUri` is the expanded NS.
 */
export interface ElementNode {
    readonly kind: 'element';
    readonly localName: string;
    readonly namespaceUri: string | null;
    readonly prefix?: string | null;
    readonly attributes: ReadonlyArray<ElementAttr>;
    readonly children: ReadonlyArray<ElementChild>;
}

export interface TextNode {
    readonly kind: 'text';
    readonly text: string;
}

export type ElementChild = ElementNode | TextNode;

/** Document or fragment root accepted by parsers (single element root preferred). */
export type ElementTree = ElementNode;

/**
 * The is element node.
 *
 * @param {ElementChild | ElementTree} node - The node.
 * @returns {boolean} The result.
 */
export function isElementNode(node: ElementChild | ElementTree): node is ElementNode {
    return node.kind === 'element';
}

/**
 * The is text node.
 *
 * @param {ElementChild} node - The node.
 * @returns {boolean} The result.
 */
export function isTextNode(node: ElementChild): node is TextNode {
    return node.kind === 'text';
}

/**
 * Create an element node.
 *
 * @param {string} localName - The local name.
 * @param {string | null} namespaceUri - The namespace uri.
 * @param {ReadonlyArray<ElementAttr>} attributes - The attributes.
 * @param {ReadonlyArray<ElementChild>} children - The children.
 * @param {string | null | undefined} prefix - The prefix.
 * @returns {ElementNode} The result.
 */
export function el(
    localName: string,
    namespaceUri: string | null,
    attributes: ReadonlyArray<ElementAttr> = [],
    children: ReadonlyArray<ElementChild> = [],
    prefix?: string | null
): ElementNode {
    const node: ElementNode = { kind: 'element',
        localName,
        namespaceUri,
        attributes,
        children
    };
    if (prefix != null && prefix !== '') {
        return { ...node, prefix };
    }
    return node;
}

/**
 * Create a text node.
 *
 * @param {string} value - The value.
 * @returns {TextNode} The result.
 */
export function text(value: string): TextNode {
    return { kind: 'text', text: value  };
}

/**
 * Attribute helper.
 *
 * @param {string} name - The name.
 * @param {string} value - The value.
 * @param {string | null | undefined} namespaceUri - The namespace uri.
 * @param {string | null | undefined} prefix - The prefix.
 * @returns {ElementAttr} The result.
 */
export function attr(
    name: string,
    value: string,
    namespaceUri?: string | null,
    prefix?: string | null
): ElementAttr {
    const a: ElementAttr = { name, value };
    if (namespaceUri !== undefined) {
        return {
            ...a,
            namespaceUri,
            ...(prefix != null && prefix !== '' ? { prefix } : {})
        };
    }
    return a;
}

/**
 * Read attribute value by local name (any namespace) — first match.
 *
 * @param {ElementNode} node - The node.
 * @param {string} localName - The local name.
 * @returns {string | undefined} The result.
 */
export function getAttr(node: ElementNode, localName: string): string | undefined {
    for (const a of node.attributes) {
        if (a.name === localName) {return a.value; }
    }
    return undefined;
}

/**
 * Read attribute by local name + namespace URI (null = unnamespaced / any empty).
 *
 * @param {ElementNode} node - The node.
 * @param {string} localName - The local name.
 * @param {string | null} namespaceUri - The namespace uri.
 * @returns {string | undefined} The result.
 */
export function getAttrNS(
    node: ElementNode,
    localName: string,
    namespaceUri: string | null
): string | undefined {
    for (const a of node.attributes) {
        const ans: string = (a.namespaceUri != null ? a.namespaceUri : null);
        if (a.name === localName && ans === namespaceUri) {return a.value; }
    }
    return undefined;
}

/**
 * Element children only.
 *
 * @param {ElementNode} node - The node.
 * @returns {ElementNode[]} The result.
 */
export function elementChildren(node: ElementNode): ElementNode[] {
    const out: ElementNode[] = [];
    for (const c of node.children) {
        if (c.kind === 'element') {out.push(c); }
    }
    return out;
}

/**
 * First element child with localName (+ optional ns predicate).
 *
 * @param {ElementNode} node - The node.
 * @param {string} localName - The local name.
 * @param {Function | undefined} nsPred - The ns pred.
 * @returns {ElementNode | undefined} The result.
 */
export function findChild(
    node: ElementNode,
    localName: string,
    nsPred?: (ns: string | null) => boolean
): ElementNode | undefined {
    for (const c of node.children) {
        if (c.kind !== 'element') {continue; }
        if (c.localName !== localName) {continue; }
        if (nsPred && !nsPred(c.namespaceUri)) {continue; }
        return c;
    }
    return undefined;
}

/**
 * All element children with localName (+ optional ns predicate).
 *
 * @param {ElementNode} node - The node.
 * @param {string} localName - The local name.
 * @param {Function | undefined} nsPred - The ns pred.
 * @returns {ElementNode[]} The result.
 */
export function findChildren(
    node: ElementNode,
    localName: string,
    nsPred?: (ns: string | null) => boolean
): ElementNode[] {
    const out: ElementNode[] = [];
    for (const c of node.children) {
        if (c.kind !== 'element') {continue; }
        if (c.localName !== localName) {continue; }
        if (nsPred && !nsPred(c.namespaceUri)) {continue; }
        out.push(c);
    }
    return out;
}

/**
 * Concatenate descendant text (depth-first).
 *
 * @param {ElementNode} node - The node.
 * @returns {string} The result.
 */
export function textContent(node: ElementNode): string {
    let s: string = '';
    for (const c of node.children) {
        if (c.kind === 'text') {s += c.text; }
        else {s += textContent(c); }
    }
    return s;
}

/**
 * Deep-clone an element tree (mutable copies).
 *
 * @param {ElementNode} node - The node.
 * @returns {ElementNode} The result.
 */
export function cloneElement(node: ElementNode): ElementNode {
    return { kind: 'element',
        localName: node.localName,
        namespaceUri: node.namespaceUri,
        ...(node.prefix != null ? { prefix: node.prefix } : {}),
        attributes: node.attributes.map((a: ElementAttr) => ({ ...a })),
        children: node.children.map((c: ElementChild): ElementChild =>
            c.kind === 'text' ? { kind: 'text', text: c.text  } : cloneElement(c)
        )
    };
}
