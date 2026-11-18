/**
 * Feature-local XML tree for DrawingML diagram parts.
 *
 * @remarks
 * Encryption's EncryptionInfo parser drops text nodes and is unsuitable for
 * `dgm:pt/dgm:t` text bodies. This helper keeps element children **and** text,
 * rejects DTD/entity expansion, and applies nesting/attribute/text limits.
 * Namespace URI is authoritative; prefixes are preserved for stable serialize.
 * @private
 */

import { Literal } from '../../core/literal-type';
import { DiagramPartError } from './errors';

/** Attribute on a diagram XML element. */
export interface DiagramXmlAttribute {
    readonly prefix: string;
    readonly localName: string;
    readonly namespaceUri: string;
    readonly value: string;
    /** Original `name` or `prefix:name` as written in source. */
    readonly qName: string;
}

/** Element node. */
export interface DiagramXmlElement {
    readonly kind: 'element';
    readonly prefix: string;
    readonly localName: string;
    readonly namespaceUri: string;
    readonly qName: string;
    readonly attributes: ReadonlyArray<DiagramXmlAttribute>;
    readonly children: ReadonlyArray<DiagramXmlNode>;
}

/** Text node (significant or whitespace). */
export interface DiagramXmlText {
    readonly kind: 'text';
    readonly value: string;
}

export type DiagramXmlNode = DiagramXmlElement | DiagramXmlText;

const DEFAULT_MAX_DEPTH: Literal<256> = 256;
const DEFAULT_MAX_ATTRS: Literal<4096> = 4096;
const DEFAULT_MAX_TEXT: number = 32 * 1024 * 1024;
const XMLNS_NS: Literal<'http://www.w3.org/2000/xmlns/'> = 'http://www.w3.org/2000/xmlns/';
const XML_NS: Literal<'http://www.w3.org/XML/1998/namespace'> = 'http://www.w3.org/XML/1998/namespace';

export interface DiagramXmlParseLimits {
    readonly maxDepth?: number;
    readonly maxAttributesPerElement?: number;
    readonly maxTextNodeLength?: number;
}

/**
 * Parses a single-root diagram part XML document.
 *
 * @param {string} xmlText - The xml text.
 * @param {DiagramXmlParseLimits} limits - The limits.
 * @returns {DiagramXmlElement} The result.
 * @throws {DiagramPartError} Malformed XML or missing root.
 */
export function parseDiagramXml(
    xmlText: string,
    limits: DiagramXmlParseLimits = {}
): DiagramXmlElement {
    if (/<!DOCTYPE/i.test(xmlText) || /<!ENTITY/i.test(xmlText)) {
        throw new DiagramPartError('Diagram XML must not contain DTD or entities');
    }

    const maxDepth: number = (limits.maxDepth != null ? limits.maxDepth : DEFAULT_MAX_DEPTH);
    const maxAttrs: number = (limits.maxAttributesPerElement != null ? limits.maxAttributesPerElement : DEFAULT_MAX_ATTRS);
    const maxText: number = (limits.maxTextNodeLength != null ? limits.maxTextNodeLength : DEFAULT_MAX_TEXT);

    let i: number = 0;
    const length: number = xmlText.length;

    const skipWs: () => void = (): void => {
        while (i < length) {
            const c: number = xmlText.charCodeAt(i);
            if (c === 0x20 || c === 0x09 || c === 0x0a || c === 0x0d) {
                i += 1;
            } else {
                break;
            }
        }
    };

    const peek: () => string = (): string => (i < length ? xmlText.charAt(i) : '');

    const startsWith: (s: string) => boolean = (s: string): boolean => xmlText.startsWith(s, i);

    const readName: () => string = (): string => {
        const start: number = i;
        while (i < length) {
            const c: string = xmlText.charAt(i);
            if (/[A-Za-z0-9:_.-]/.test(c)) {
                i += 1;
            } else {
                break;
            }
        }
        if (i === start) {
            throw new DiagramPartError('Diagram XML is invalid: expected name');
        }
        return xmlText.slice(start, i);
    };

    const decodeEntities: (raw: string) => string = (raw: string): string =>
        raw
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, '\'')
            .replace(/&amp;/g, '&');

    const readAttrValue: () => string = (): string => {
        const quote: string = peek();
        if (quote !== '"' && quote !== '\'') {
            throw new DiagramPartError('Diagram XML is invalid: attribute value');
        }
        i += 1;
        const start: number = i;
        while (i < length && xmlText.charAt(i) !== quote) {
            i += 1;
            if (i - start > maxText) {
                throw new DiagramPartError('Diagram XML text/attribute exceeds limit');
            }
        }
        if (i >= length) {
            throw new DiagramPartError('Diagram XML is invalid: unclosed attribute');
        }
        const value: string = xmlText.slice(start, i);
        i += 1;
        return decodeEntities(value);
    };

  type NsFrame = Map<string, string>;

  const resolveQName: (
      qName: string,
      nsStack: ReadonlyArray<NsFrame>,
      isAttr: boolean
  ) => { prefix: string; localName: string; namespaceUri: string; } = (
      qName: string,
      nsStack: ReadonlyArray<NsFrame>,
      isAttr: boolean
  ): { prefix: string; localName: string; namespaceUri: string } => {
      const colon: number = qName.indexOf(':');
      const prefix: string = colon === -1 ? '' : qName.slice(0, colon);
      const localName: string = colon === -1 ? qName : qName.slice(colon + 1);
      if (prefix === 'xmlns') {
          return { prefix, localName, namespaceUri: XMLNS_NS };
      }
      if (isAttr && prefix === '') {
          if (localName === 'xmlns') {
              return { prefix: '', localName: 'xmlns', namespaceUri: XMLNS_NS };
          }
          return { prefix: '', localName, namespaceUri: '' };
      }
      if (prefix === 'xml') {
          return { prefix, localName, namespaceUri: XML_NS };
      }
      for (const frameAt of nsStack.slice().reverse()) {
          if (frameAt === undefined) {
              continue;
          }
          const uri: string = frameAt.get(prefix);
          if (uri !== undefined) {
              return { prefix, localName, namespaceUri: uri };
          }
      }
      return { prefix, localName, namespaceUri: '' };
  };

  const parseElement: (nsStack: NsFrame[], depth: number) => DiagramXmlElement = (nsStack: NsFrame[], depth: number): DiagramXmlElement => {
      if (depth > maxDepth) {
          throw new DiagramPartError('Diagram XML nesting depth exceeds limit');
      }
      if (peek() !== '<') {
          throw new DiagramPartError('Diagram XML is invalid: expected element');
      }
      i += 1;
      if (peek() === '/') {
          throw new DiagramPartError('Diagram XML is invalid: unexpected end tag');
      }
      const rawName: string = readName();
      const frame: NsFrame = new Map();
      const pendingAttrs: { qName: string; value: string }[] = [];

      skipWs();
      while (peek() !== '>' && peek() !== '/' && i < length) {
          const attrQName: string = readName();
          skipWs();
          if (peek() !== '=') {
              throw new DiagramPartError('Diagram XML is invalid: expected = after attribute name');
          }
          i += 1;
          skipWs();
          const value: string = readAttrValue();
          pendingAttrs.push({ qName: attrQName, value });
          if (attrQName === 'xmlns') {
              frame.set('', value);
          } else if (attrQName.startsWith('xmlns:')) {
              frame.set(attrQName.slice(6), value);
          }
          skipWs();
          if (pendingAttrs.length > maxAttrs) {
              throw new DiagramPartError('Diagram XML attribute count exceeds limit');
          }
      }

      const childStack: NsFrame[] = [...nsStack, frame];
      const nameResolved: { prefix: string; localName: string; namespaceUri: string; } = resolveQName(rawName, childStack, false);
      const attributes: DiagramXmlAttribute[] = pendingAttrs.map((a: { qName: string; value: string; }) => {
          const r: { prefix: string; localName: string; namespaceUri: string; } = resolveQName(a.qName, childStack, true);
          return {
              prefix: r.prefix,
              localName: r.localName,
              namespaceUri: r.namespaceUri,
              value: a.value,
              qName: a.qName
          };
      });

      let selfClosing: boolean = false;
      if (startsWith('/>')) {
          i += 2;
          selfClosing = true;
      } else if (peek() === '>') {
          i += 1;
      } else {
          throw new DiagramPartError('Diagram XML is invalid: malformed start tag');
      }

      const children: DiagramXmlNode[] = [];
      if (!selfClosing) {
          for (;;) {
              if (i >= length) {
                  throw new DiagramPartError('Diagram XML is invalid: unclosed element');
              }
              if (startsWith('</')) {
                  i += 2;
                  const endName: string = readName();
                  skipWs();
                  if (peek() !== '>') {
                      throw new DiagramPartError('Diagram XML is invalid: malformed end tag');
                  }
                  i += 1;
                  if (endName !== rawName) {
                      throw new DiagramPartError(
                          `Diagram XML is invalid: end tag ${endName} does not match ${rawName}`
                      );
                  }
                  break;
              }
              if (startsWith('<!--')) {
                  const end: number = xmlText.indexOf('-->', i + 4);
                  if (end < 0) {
                      throw new DiagramPartError('Diagram XML is invalid: unclosed comment');
                  }
                  i = end + 3;
                  continue;
              }
              if (startsWith('<?')) {
                  const end: number = xmlText.indexOf('?>', i + 2);
                  if (end < 0) {
                      throw new DiagramPartError('Diagram XML is invalid: unclosed processing instruction');
                  }
                  i = end + 2;
                  continue;
              }
              if (startsWith('<![CDATA[')) {
                  const end: number = xmlText.indexOf(']]>', i + 9);
                  if (end < 0) {
                      throw new DiagramPartError('Diagram XML is invalid: unclosed CDATA');
                  }
                  const text: string = xmlText.slice(i + 9, end);
                  if (text.length > maxText) {
                      throw new DiagramPartError('Diagram XML text exceeds limit');
                  }
                  children.push({ kind: 'text', value: text });
                  i = end + 3;
                  continue;
              }
              if (peek() === '<') {
                  children.push(parseElement(childStack, depth + 1));
                  continue;
              }
              const textStart: number = i;
              while (i < length && xmlText.charAt(i) !== '<') {
                  i += 1;
                  if (i - textStart > maxText) {
                      throw new DiagramPartError('Diagram XML text exceeds limit');
                  }
              }
              const rawText: string = xmlText.slice(textStart, i);
              if (rawText.length > 0) {
                  children.push({ kind: 'text', value: decodeEntities(rawText) });
              }
          }
      }

      return { kind: 'element',
          prefix: nameResolved.prefix,
          localName: nameResolved.localName,
          namespaceUri: nameResolved.namespaceUri,
          qName: rawName,
          attributes,
          children
      };
  };

  skipWs();
  if (startsWith('\uFEFF')) {
      i += 1;
      skipWs();
  }
  while (startsWith('<?') || startsWith('<!--')) {
      if (startsWith('<?')) {
          const end: number = xmlText.indexOf('?>', i + 2);
          if (end < 0) {
              throw new DiagramPartError('Diagram XML is invalid: unclosed declaration');
          }
          i = end + 2;
      } else {
          const end: number = xmlText.indexOf('-->', i + 4);
          if (end < 0) {
              throw new DiagramPartError('Diagram XML is invalid: unclosed comment');
          }
          i = end + 3;
      }
      skipWs();
  }

  const root: DiagramXmlElement = parseElement([new Map<string, string>()], 1);
  skipWs();
  if (i < length) {
      throw new DiagramPartError('Diagram XML is invalid: trailing content');
  }
  return root;
}

const escapeText: (value: string) => string = (value: string): string =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

const escapeAttr: (value: string) => string = (value: string): string =>
    escapeText(value).replace(/"/g, '&quot;');

/**
 * Serializes a diagram XML element tree to a UTF-8 XML document string.
 *
 * @param {DiagramXmlElement} root - The root.
 * @param {boolean} withDecl - The with decl.
 * @returns {string} The result.
 */
export function serializeDiagramXml(root: DiagramXmlElement, withDecl: boolean = true): string {
    const body: string = serializeNode(root);
    return withDecl ? `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n${body}` : body;
}

/**
 * The serialize node.
 *
 * @param {DiagramXmlNode} node - The node.
 * @returns {string} The result.
 */
function serializeNode(node: DiagramXmlNode): string {
    if (node.kind === 'text') {
        return escapeText(node.value);
    }
    const attrParts: string[] = [];
    for (const a of node.attributes) {
        attrParts.push(`${a.qName}="${escapeAttr(a.value)}"`);
    }
    const attrStr: string = attrParts.length > 0 ? ` ${attrParts.join(' ')}` : '';
    if (node.children.length === 0) {
        return `<${node.qName}${attrStr}/>`;
    }
    const inner: string = node.children.map(serializeNode).join('');
    return `<${node.qName}${attrStr}>${inner}</${node.qName}>`;
}

/**
 * Returns unprefixed or namespace-aware attribute value.
 *
 * @param {DiagramXmlElement} el - The el.
 * @param {string} localName - The local name.
 * @param {string} namespaceUri - The namespace uri.
 * @returns {string | undefined} The result.
 */
export function getAttribute(
    el: DiagramXmlElement,
    localName: string,
    namespaceUri: string = ''
): string | undefined {
    for (const a of el.attributes) {
        if (a.localName === localName && a.namespaceUri === namespaceUri) {
            return a.value;
        }
    }
    return undefined;
}

/**
 * Element children only (skips text).
 *
 * @param {DiagramXmlElement} el - The el.
 * @returns {ReadonlyArray<DiagramXmlElement>} The result.
 */
export function elementChildren(el: DiagramXmlElement): ReadonlyArray<DiagramXmlElement> {
    const out: DiagramXmlElement[] = [];
    for (const c of el.children) {
        if (c.kind === 'element') {
            out.push(c);
        }
    }
    return out;
}

/**
 * First child element with local name + namespace.
 *
 * @param {DiagramXmlElement} el - The el.
 * @param {string} localName - The local name.
 * @param {string} namespaceUri - The namespace uri.
 * @returns {DiagramXmlElement | undefined} The result.
 */
export function findChild(
    el: DiagramXmlElement,
    localName: string,
    namespaceUri: string
): DiagramXmlElement | undefined {
    for (const c of el.children) {
        if (c.kind === 'element' && c.localName === localName && c.namespaceUri === namespaceUri) {
            return c;
        }
    }
    return undefined;
}

/**
 * All child elements with local name + namespace.
 *
 * @param {DiagramXmlElement} el - The el.
 * @param {string} localName - The local name.
 * @param {string} namespaceUri - The namespace uri.
 * @returns {ReadonlyArray<DiagramXmlElement>} The result.
 */
export function findChildren(
    el: DiagramXmlElement,
    localName: string,
    namespaceUri: string
): ReadonlyArray<DiagramXmlElement> {
    const out: DiagramXmlElement[] = [];
    for (const c of el.children) {
        if (c.kind === 'element' && c.localName === localName && c.namespaceUri === namespaceUri) {
            out.push(c);
        }
    }
    return out;
}

/**
 * Deep-clones an element tree (for immutable public part wrappers).
 *
 * @param {DiagramXmlElement} el - The el.
 * @returns {DiagramXmlElement} The result.
 */
export function cloneElement(el: DiagramXmlElement): DiagramXmlElement {
    return { kind: 'element',
        prefix: el.prefix,
        localName: el.localName,
        namespaceUri: el.namespaceUri,
        qName: el.qName,
        attributes: el.attributes.map((a: DiagramXmlAttribute) => ({ ...a })),
        children: el.children.map((c: DiagramXmlNode) => (c.kind === 'text' ? { ...c } : cloneElement(c)))
    };
}
