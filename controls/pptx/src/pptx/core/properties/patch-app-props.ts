/**
 * Updates slide-count statistics inside an existing extended-properties part
 * without dropping metadata siblings.
 *
 * Citation: ECMA-376-4 Transitional `shared-documentPropertiesExtended.xsd`
 * `Slides`, `HeadingPairs`, `TitlesOfParts`.
 */
import { buildAppPropsXml } from '../create/templates';
import { SecurityLimits } from '../security/limits';
import { asMutable, findChild } from '../shapes/dom-utils';
import { arrayAt } from '../util/es5-compat';
import { OoxmlElement, OoxmlText, parseXml, serializeXmlDocument } from '../xml/index';

const EXT_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/extended-properties';
const VT_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes';

/**
 * Returns extended-properties XML whose slide statistics match `slideCount`.
 * When the part is not the expected root, the original text is returned unchanged.
 *
 * @param {Uint8Array} data - Current part bytes.
 * @param {number} slideCount - Live `p:sldIdLst` length.
 * @param {SecurityLimits} limits - XML limits for the reparse.
 * @param {string} partName - Part name for diagnostics.
 * @returns {string} Serialized part.
 */
export function patchExtendedSlideCount(data: Uint8Array, slideCount: number, limits: SecurityLimits, partName: string): string {
    const text: string = new TextDecoder('utf-8').decode(data);
    let root: OoxmlElement;
    try {
        root = parseXml(text, { limits, partName });
    } catch {
        return buildAppPropsXml(slideCount);
    }
    if (root.localName !== 'Properties' || root.namespaceUri !== EXT_NS) {
        return buildAppPropsXml(slideCount);
    }
    setTextChild(root, 'Slides', String(slideCount));
    patchHeadingPairs(root, slideCount);
    patchTitles(root, slideCount);
    return serializeXmlDocument(root);
}

function setTextChild(root: OoxmlElement, localName: string, text: string): void {
    const existing: OoxmlElement | undefined = findChild(root, EXT_NS, localName);
    const next: OoxmlElement = {
        kind: 'element',
        namespaceUri: EXT_NS,
        localName,
        attributes: [],
        children: [{ kind: 'text', text }]
    };
    const children = asMutable(root).children;
    if (existing === undefined) {
        children.push(next);
        return;
    }
    children[children.indexOf(existing)] = next;
}

function patchHeadingPairs(root: OoxmlElement, slideCount: number): void {
    const heading: OoxmlElement | undefined = findChild(root, EXT_NS, 'HeadingPairs');
    if (heading === undefined) {
        return;
    }
    const vector: OoxmlElement | undefined = findChild(heading, VT_NS, 'vector');
    if (vector === undefined) {
        return;
    }
    const variants: OoxmlElement[] = [];
    for (let i: number = 0; i < vector.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(vector.children, i);
        if (child.kind === 'element' && child.localName === 'variant') {
            variants.push(child);
        }
    }
    for (let i: number = 0; i + 1 < variants.length; i += 2) {
        const label: string = nestedText(arrayAt(variants, i));
        if (label === 'Slide Titles') {
            const countVariant: OoxmlElement = {
                kind: 'element',
                namespaceUri: VT_NS,
                localName: 'variant',
                attributes: [],
                children: [{
                    kind: 'element',
                    namespaceUri: VT_NS,
                    localName: 'i4',
                    attributes: [],
                    children: [{ kind: 'text', text: String(slideCount) }]
                }]
            };
            const children = asMutable(vector).children;
            children[children.indexOf(arrayAt(variants, i + 1))] = countVariant;
        }
    }
}

function patchTitles(root: OoxmlElement, slideCount: number): void {
    const titles: OoxmlElement | undefined = findChild(root, EXT_NS, 'TitlesOfParts');
    if (titles === undefined) {
        return;
    }
    const vector: OoxmlElement | undefined = findChild(titles, VT_NS, 'vector');
    if (vector === undefined) {
        return;
    }
    const items: Array<OoxmlElement | OoxmlText> = [];
    let seenSlideTitle: boolean = false;
    for (let i: number = 0; i < vector.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(vector.children, i);
        if (child.kind === 'element' && child.localName === 'lpstr' && directText(child) === 'PowerPoint Presentation') {
            if (!seenSlideTitle) {
                seenSlideTitle = true;
                for (let n: number = 0; n < slideCount; n++) {
                    items.push({
                        kind: 'element',
                        namespaceUri: VT_NS,
                        localName: 'lpstr',
                        attributes: [],
                        children: [{ kind: 'text', text: 'PowerPoint Presentation' }]
                    });
                }
            }
            continue;
        }
        items.push(child);
    }
    if (!seenSlideTitle) {
        for (let n: number = 0; n < slideCount; n++) {
            items.push({
                kind: 'element',
                namespaceUri: VT_NS,
                localName: 'lpstr',
                attributes: [],
                children: [{ kind: 'text', text: 'PowerPoint Presentation' }]
            });
        }
    }
    const mutable = asMutable(vector);
    mutable.children = items;
    mutable.attributes = replaceSize(vector.attributes, items.filter((c) => c.kind === 'element' && c.localName === 'lpstr').length);
}

function replaceSize(attributes: OoxmlElement['attributes'], size: number): OoxmlElement['attributes'] {
    const next: Array<{ namespaceUri: string; localName: string; value: string; prefix?: string }> = [];
    let found: boolean = false;
    for (let i: number = 0; i < attributes.length; i++) {
        const attr = arrayAt(attributes, i);
        if (attr.localName === 'size' && attr.namespaceUri === '') {
            next.push({ namespaceUri: '', localName: 'size', value: String(size), prefix: attr.prefix });
            found = true;
        } else {
            next.push(attr);
        }
    }
    if (!found) {
        next.push({ namespaceUri: '', localName: 'size', value: String(size) });
    }
    return next;
}

function nestedText(el: OoxmlElement): string {
    let out: string = '';
    for (let i: number = 0; i < el.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(el.children, i);
        if (child.kind === 'text') {
            out += child.text;
        } else {
            out += nestedText(child);
        }
    }
    return out;
}

function directText(el: OoxmlElement): string {
    let out: string = '';
    for (let i: number = 0; i < el.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(el.children, i);
        if (child.kind === 'text') {
            out += child.text;
        }
    }
    return out;
}
