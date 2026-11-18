/*
 * Minimal attribute-oriented XML element parser for OFFCRYPTO EncryptionInfo.
 *
 * @remarks
 * EncryptionInfo XML is a small attribute-heavy tree (encryption / keyData /
 * dataIntegrity / keyEncryptors). This parser intentionally does **not** pull a
 * full OOXML DOM. It supports nested elements, attributes, default namespaces,
 * and rejects DOCTYPE / entity expansion.
 *
 * @private
 */

import { Literal } from '../core/literal-type';
import {
    EncryptedPackageError,
    PackageLimitError,
    DecryptSecurityLimits
} from './errors';

/** Parsed element node used by Agile EncryptionInfo mapping. */
export interface XmlElement {
    readonly kind: 'element';
    readonly localName: string;
    readonly namespaceUri: string;
    readonly attributes: ReadonlyArray<XmlAttribute>;
    readonly children: ReadonlyArray<XmlElement>;
}

export interface XmlAttribute {
    readonly localName: string;
    readonly namespaceUri: string;
    readonly value: string;
}

const DEFAULT_XML_NESTING: Literal<256> = 256;
const DEFAULT_XML_ATTRS: Literal<4096> = 4096;
const DEFAULT_TEXT_NODE: number = 32 * 1024 * 1024;

/**
 * Parses EncryptionInfo UTF-8 XML into a single root element tree.
 *
 * @param {string} xmlText - The xml text.
 * @param {DecryptSecurityLimits} limits - The limits.
 * @param {string} partName - The part name.
 * @returns {XmlElement} The result.
 * @throws {EncryptedPackageError} Malformed XML.
 * @throws {PackageLimitError} Nesting / attribute / text limits.
 */
export function parseEncryptionInfoXml(
    xmlText: string,
    limits: DecryptSecurityLimits,
    partName: string = 'EncryptionInfo'
): XmlElement {
    if (/<!DOCTYPE/i.test(xmlText) || /<!ENTITY/i.test(xmlText)) {
        throw new EncryptedPackageError('EncryptionInfo XML must not contain DTD or entities');
    }

    const maxDepth: number = (limits.xmlNestingDepth != null ? limits.xmlNestingDepth : DEFAULT_XML_NESTING);
    const maxAttrs: number = (limits.xmlAttributesPerElement != null ? limits.xmlAttributesPerElement : DEFAULT_XML_ATTRS);
    const maxText: number = (limits.textNodeLengthBytes != null ? limits.textNodeLengthBytes : DEFAULT_TEXT_NODE);

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
            throw new EncryptedPackageError('EncryptionInfo XML is invalid: expected name');
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
            throw new EncryptedPackageError('EncryptionInfo XML is invalid: attribute value');
        }
        i += 1;
        const start: number = i;
        while (i < length && xmlText.charAt(i) !== quote) {
            i += 1;
            if (i - start > maxText) {
                throw new PackageLimitError('textNodeLengthBytes', { partName, actual: i - start });
            }
        }
        if (i >= length) {
            throw new EncryptedPackageError('EncryptionInfo XML is invalid: unclosed attribute');
        }
        const value: string = xmlText.slice(start, i);
        i += 1; // closing quote
        return decodeEntities(value);
    };

  type NsFrame = Map<string, string>;

  const resolveQName: (qName: string, nsStack: ReadonlyArray<NsFrame>, isAttr: boolean) => { localName: string; namespaceUri: string; } = (
      qName: string,
      nsStack: ReadonlyArray<NsFrame>,
      isAttr: boolean
  ): { localName: string; namespaceUri: string } => {
      const colon: number = qName.indexOf(':');
      const prefix: string = colon === -1 ? '' : qName.slice(0, colon);
      const localName: string = colon === -1 ? qName : qName.slice(colon + 1);
      if (isAttr && prefix === '') {
          return { localName, namespaceUri: '' };
      }
      if (prefix === 'xmlns') {
          return { localName, namespaceUri: 'http://www.w3.org/2000/xmlns/' };
      }
      for (const frame of nsStack.slice().reverse()) {
          const uri: string = frame.get(prefix);
          if (uri !== undefined) {
              return { localName, namespaceUri: uri };
          }
      }
      return { localName, namespaceUri: '' };
  };

  const parseElement: (nsStack: NsFrame[], depth: number) => XmlElement = (nsStack: NsFrame[], depth: number): XmlElement => {
      if (depth > maxDepth) {
          throw new PackageLimitError('xmlNestingDepth', { partName, actual: depth });
      }
      if (peek() !== '<') {
          throw new EncryptedPackageError('EncryptionInfo XML is invalid: expected element');
      }
      i += 1; // <
      if (peek() === '/') {
          throw new EncryptedPackageError('EncryptionInfo XML is invalid: unexpected end tag');
      }
      // Skip processing instructions / comments / XML declaration at this level via caller.
      const rawName: string = readName();
      skipWs();

      const pendingAttrs: { qName: string; value: string }[] = [];
      let selfClosing: boolean = false;
      const localNs: NsFrame = new Map();

      while (i < length && peek() !== '>' && peek() !== '/') {
          const attrName: string = readName();
          skipWs();
          if (peek() !== '=') {
              throw new EncryptedPackageError('EncryptionInfo XML is invalid: expected =');
          }
          i += 1;
          skipWs();
          const attrValue: string = readAttrValue();
          skipWs();

          if (attrName === 'xmlns') {
              localNs.set('', attrValue);
          } else if (attrName.startsWith('xmlns:')) {
              localNs.set(attrName.slice(6), attrValue);
          } else {
              pendingAttrs.push({ qName: attrName, value: attrValue });
          }
          if (pendingAttrs.length > maxAttrs) {
              throw new PackageLimitError('xmlAttributesPerElement', {
                  partName,
                  actual: pendingAttrs.length
              });
          }
      }

      if (startsWith('/>')) {
          selfClosing = true;
          i += 2;
      } else if (peek() === '>') {
          i += 1;
      } else {
          throw new EncryptedPackageError('EncryptionInfo XML is invalid: element tag');
      }

      const childNsStack: NsFrame[] = [...nsStack, localNs];
      const nameResolved: { localName: string; namespaceUri: string; } = resolveQName(rawName, childNsStack, false);
      const attributes: XmlAttribute[] = pendingAttrs.map((a: { qName: string; value: string; }) => {
          const r: { localName: string; namespaceUri: string; } = resolveQName(a.qName, childNsStack, true);
          return { localName: r.localName, namespaceUri: r.namespaceUri, value: a.value };
      });

      if (selfClosing) {
          return { kind: 'element',
              localName: nameResolved.localName,
              namespaceUri: nameResolved.namespaceUri,
              attributes,
              children: []
          };
      }

      const children: XmlElement[] = [];
      for (;;) {
          skipWs();
          if (i >= length) {
              throw new EncryptedPackageError('EncryptionInfo XML is invalid: unclosed element');
          }
          if (startsWith('</')) {
              i += 2;
              const endName: string = readName();
              skipWs();
              if (peek() !== '>') {
                  throw new EncryptedPackageError('EncryptionInfo XML is invalid: end tag');
              }
              i += 1;
              if (endName !== rawName) {
                  throw new EncryptedPackageError(
                      `EncryptionInfo XML is invalid: mismatched end tag ${endName}`
                  );
              }
              break;
          }
          if (startsWith('<!--')) {
              const end: number = xmlText.indexOf('-->', i + 4);
              if (end < 0) {
                  throw new EncryptedPackageError('EncryptionInfo XML is invalid: unclosed comment');
              }
              i = end + 3;
              continue;
          }
          if (startsWith('<?')) {
              const end: number = xmlText.indexOf('?>', i + 2);
              if (end < 0) {
                  throw new EncryptedPackageError('EncryptionInfo XML is invalid: unclosed PI');
              }
              i = end + 2;
              continue;
          }
          if (peek() === '<') {
              children.push(parseElement(childNsStack, depth + 1));
              continue;
          }
          // Text node — EncryptionInfo does not need text content; skip with limit.
          const textStart: number = i;
          while (i < length && peek() !== '<') {
              i += 1;
              if (i - textStart > maxText) {
                  throw new PackageLimitError('textNodeLengthBytes', {
                      partName,
                      actual: i - textStart
                  });
              }
          }
      }

      return { kind: 'element',
          localName: nameResolved.localName,
          namespaceUri: nameResolved.namespaceUri,
          attributes,
          children
      };
  };

  // Skip BOM / XML declaration / leading comments.
  skipWs();
  if (startsWith('\uFEFF')) {
      i += 1;
      skipWs();
  }
  while (startsWith('<?') || startsWith('<!--')) {
      if (startsWith('<?')) {
          const end: number = xmlText.indexOf('?>', i + 2);
          if (end < 0) {
              throw new EncryptedPackageError('EncryptionInfo XML is invalid: unclosed declaration');
          }
          i = end + 2;
      } else {
          const end: number = xmlText.indexOf('-->', i + 4);
          if (end < 0) {
              throw new EncryptedPackageError('EncryptionInfo XML is invalid: unclosed comment');
          }
          i = end + 3;
      }
      skipWs();
  }

  const root: XmlElement = parseElement([new Map()], 1);
  skipWs();
  if (i < length) {
      // Allow trailing whitespace only (already skipped); anything else is junk.
      throw new EncryptedPackageError('EncryptionInfo XML is invalid: trailing content');
  }
  return root;
}
