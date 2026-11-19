/**
 * Three-way merge of a loaded chart part with the model-driven export.
 *
 * ej2-xlsx owns only part of the DrawingML chart vocabulary; its export drops
 * everything it has no model for (`c:date1904`, `mc:AlternateContent`, theme
 * colour transforms, rich text properties, ...). On load the original part is
 * kept as a DOM together with a baseline export of the model exactly as loaded.
 * On save the current export is merged in:
 * - subtree unchanged since load (current equals baseline): the original element wins;
 * - subtree changed through the model: the current export wins;
 * - original element the model never knew about: kept at its original position;
 * - baseline element absent from the current export: removed through the model.
 *
 * @private
 */
import { ownGet, ownSet } from '../../core/compat/object-compat';
import { OpenXmlAttribute, OpenXmlChild, OpenXmlElement, parseXml, serializeXml } from '../../core/xml/index';
import { NamespaceDeclaration } from '../../core/xml/model';

/**
 * Loaded-chart snapshot used to merge on save.
 *
 * @private
 */
export interface LoadedChartPart {
    readonly original: OpenXmlElement;
    readonly baseline: OpenXmlElement | undefined;
}

/** Property leaves that are replaced whole when the model changes them (merging inside could mix two fills). */
const ATOMIC: string[] = ['solidFill', 'noFill', 'gradFill', 'pattFill', 'blipFill', 'ln', 'bodyPr', 'lstStyle', 'p', 'rich', 'strRef', 'numRef', 'v'];

const DECLARATION: string = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

function isElement(node: OpenXmlChild): node is OpenXmlElement {
    return node.kind === 'element';
}

function elementsOf(el: OpenXmlElement | undefined): OpenXmlElement[] {
    return el === undefined ? [] : el.children.filter(isElement);
}

function hasText(el: OpenXmlElement): boolean {
    return el.children.some((c: OpenXmlChild) => c.kind === 'text' && c.value.trim().length > 0);
}

function idsOf(list: ReadonlyArray<OpenXmlElement>): string[] {
    const seen: { [key: string]: number } = {};
    return list.map((e: OpenXmlElement) => {
        const key: string = e.namespaceUri + '|' + e.localName;
        ownSet(seen, key, (ownGet(seen, key) === undefined ? 0 : ownGet(seen, key)) + 1);
        return key + '#' + ownGet(seen, key);
    });
}

function indexById(list: ReadonlyArray<OpenXmlElement>): { [id: string]: OpenXmlElement } {
    const ids: string[] = idsOf(list);
    const map: { [id: string]: OpenXmlElement } = {};
    // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
    ids.forEach((id: string, i: number) => { ownSet(map, id, list[i]); });
    return map;
}

function attrKey(a: OpenXmlAttribute): string {
    return a.namespaceUri + '|' + a.localName;
}

function mergeAttributes(o: OpenXmlElement, b: OpenXmlElement | undefined, c: OpenXmlElement): OpenXmlAttribute[] {
    const known: { [key: string]: boolean } = {};
    c.attributes.forEach((a: OpenXmlAttribute) => { known[attrKey(a)] = true; });
    (b === undefined ? [] : b.attributes).forEach((a: OpenXmlAttribute) => { known[attrKey(a)] = true; });
    return c.attributes.concat(o.attributes.filter((a: OpenXmlAttribute) => !known[attrKey(a)]));
}

function mergeDeclarations(o: OpenXmlElement, c: OpenXmlElement): OpenXmlElement['namespaceDeclarations'] {
    const have: { [prefix: string]: boolean } = {};
    c.namespaceDeclarations.forEach((d: NamespaceDeclaration) => { have[d.prefix] = true; });
    return c.namespaceDeclarations.concat(o.namespaceDeclarations.filter((d: NamespaceDeclaration) => !have[d.prefix]));
}

function mergeChildren(o: OpenXmlElement, b: OpenXmlElement | undefined, c: OpenXmlElement): OpenXmlElement[] {
    const oList: OpenXmlElement[] = elementsOf(o);
    const cList: OpenXmlElement[] = elementsOf(c);
    const oIds: string[] = idsOf(oList);
    const cIds: string[] = idsOf(cList);
    const bMap: { [id: string]: OpenXmlElement; } = indexById(elementsOf(b));
    const oMap: { [id: string]: OpenXmlElement; } = indexById(oList);
    // An element the model synthesised on export (in baseline and current, absent from the
    // original part) must not be added back: the original deliberately lacks it.
    const out: Array<{ id: string; node: OpenXmlElement }> = cList
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        .map((el: OpenXmlElement, i: number) => ({ id: cIds[i], el }))
        .filter(
            (x: { id: string; el: OpenXmlElement }) =>
                !(oMap[x.id] === undefined && bMap[x.id] !== undefined && serializeXml(bMap[x.id]) === serializeXml(x.el))
        )
        .map((x: { id: string; el: OpenXmlElement }) => ({ id: x.id, node: mergeNode(oMap[x.id], bMap[x.id], x.el) }));
    let last: number = -1;
    oList.forEach((el: OpenXmlElement, i: number) => {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const id: string = oIds[i];
        const at: number = out.map((x: { id: string; node: OpenXmlElement; }) => x.id).indexOf(id);
        if (at >= 0) {
            last = at;
        } else if (ownGet(bMap, id) === undefined) {
            last += 1;
            out.splice(last, 0, { id, node: el });
        }
    });
    return out.map((x: { id: string; node: OpenXmlElement; }) => x.node);
}

function mergeNode(o: OpenXmlElement | undefined, b: OpenXmlElement | undefined, c: OpenXmlElement): OpenXmlElement {
    if (o === undefined) {
        return c;
    }
    if (b !== undefined && serializeXml(b) === serializeXml(c)) {
        return o;
    }
    if (ATOMIC.indexOf(c.localName) >= 0 || elementsOf(c).length === 0 || hasText(c) || hasText(o)) {
        return c;
    }
    return {
        kind: 'element',
        namespaceUri: c.namespaceUri,
        localName: c.localName,
        prefix: c.prefix,
        attributes: mergeAttributes(o, b, c),
        namespaceDeclarations: mergeDeclarations(o, c),
        children: mergeChildren(o, b, c)
    };
}

/**
 * Parse a chart part for use as the original or baseline snapshot.
 *
 * @param {string} xml - Chart part XML.
 * @returns {OpenXmlElement} Parsed DOM.
 * @private
 */
export function parseChartPart(xml: string): OpenXmlElement {
    return parseXml(xml);
}

/**
 * Merge the current model export into the loaded chart part.
 *
 * @param {LoadedChartPart} loaded - Snapshot captured on load.
 * @param {string} currentXml - Chart part exported from the current model.
 * @returns {string} Serialized chart part.
 * @private
 */
export function mergeLoadedChart(loaded: LoadedChartPart, currentXml: string): string {
    const merged: OpenXmlElement = mergeNode(loaded.original, loaded.baseline, parseXml(currentXml));
    return DECLARATION + serializeXml(merged);
}
