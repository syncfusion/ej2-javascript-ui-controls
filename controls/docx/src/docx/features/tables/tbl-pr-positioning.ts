/**
 * `w:tblpPr` read/write helpers for floating table position.
 *
 * Citations: ECMA-376 CT_TblPPr; Transitional wml.xsd.
 *
 * @private
 */
import { elementChildren, isWml, wmlAttr, wmlElement } from '../document/wml';
import { OpenXmlElement, OpenXmlAttribute } from '../../core/xml/index';
import {
    emptyPropsToUndefined,
    parseDecimalVal,
    pointToTwips,
    twipsToPoint,
    upsertPropChild,
    wmlAttrVal
} from './tbl-pr';
import { TableHorizontalOrigin, TableVerticalOrigin } from './format';

/**
 * Internal bag for floating table position (public units: points).
 *
 * @private
 */
export interface TablePositioningBag {
    readonly horizontalPosition?: number;
    readonly verticalPosition?: number;
    readonly horizontalOrigin?: TableHorizontalOrigin;
    readonly verticalOrigin?: TableVerticalOrigin;
    readonly distanceFromTop?: number;
    readonly distanceFromBottom?: number;
    readonly distanceFromLeft?: number;
    readonly distanceFromRight?: number;
    /** Unmodeled attributes preserved on rewrite. */
    readonly unknownAttributes?: ReadonlyArray<OpenXmlAttribute>;
}

const KNOWN_ATTRS: { [local: string]: true } = {
    leftFromText: true,
    rightFromText: true,
    topFromText: true,
    bottomFromText: true,
    vertAnchor: true,
    horzAnchor: true,
    tblpX: true,
    tblpY: true,
    tblpXSpec: true,
    tblpYSpec: true
};

function findWmlChild(parent: OpenXmlElement, localName: string): OpenXmlElement | undefined {
    for (const child of elementChildren(parent)) {
        if (isWml(child, localName)) {
            return child;
        }
    }
    return undefined;
}

function parseHorzAnchor(raw: string | undefined): TableHorizontalOrigin | undefined {
    if (raw === 'margin') {
        return TableHorizontalOrigin.Margin;
    }
    if (raw === 'page') {
        return TableHorizontalOrigin.Page;
    }
    if (raw === 'column') {
        return TableHorizontalOrigin.Column;
    }
    return undefined;
}

function parseVertAnchor(raw: string | undefined): TableVerticalOrigin | undefined {
    if (raw === 'margin') {
        return TableVerticalOrigin.Margin;
    }
    if (raw === 'page') {
        return TableVerticalOrigin.Page;
    }
    if (raw === 'paragraph') {
        return TableVerticalOrigin.Paragraph;
    }
    return undefined;
}

function twipAttrPoints(el: OpenXmlElement, localName: string): number | undefined {
    const raw: string = wmlAttrVal(el, localName);
    const n: number = parseDecimalVal(raw);
    return n !== undefined ? twipsToPoint(n) : undefined;
}

/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @returns {TablePositioningBag | undefined} The result.
 * @private
 */
export function readTablePositioning(tblPr: OpenXmlElement): TablePositioningBag | undefined {
    const el: OpenXmlElement = findWmlChild(tblPr, 'tblpPr');
    if (el === undefined) {
        return undefined;
    }
    const unknown: OpenXmlAttribute[] = [];
    for (const a of el.attributes) {
        if (KNOWN_ATTRS[a.localName] !== true) {
            unknown.push(a);
        }
    }
    const bag: TablePositioningBag = {
        horizontalPosition: twipAttrPoints(el, 'tblpX'),
        verticalPosition: twipAttrPoints(el, 'tblpY'),
        horizontalOrigin: parseHorzAnchor(wmlAttrVal(el, 'horzAnchor')),
        verticalOrigin: parseVertAnchor(wmlAttrVal(el, 'vertAnchor')),
        distanceFromTop: twipAttrPoints(el, 'topFromText'),
        distanceFromBottom: twipAttrPoints(el, 'bottomFromText'),
        distanceFromLeft: twipAttrPoints(el, 'leftFromText'),
        distanceFromRight: twipAttrPoints(el, 'rightFromText'),
        ...(unknown.length > 0 ? { unknownAttributes: unknown } : {})
    };
    return bag;
}

function pushTwip(attrs: OpenXmlAttribute[], localName: string, points: number | undefined): void {
    if (points === undefined) {
        return;
    }
    attrs.push(wmlAttr(localName, String(pointToTwips(points))));
}

/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @param {TablePositioningBag | undefined} bag - The bag.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function writeTablePositioning(
    tblPr: OpenXmlElement,
    bag: TablePositioningBag | undefined
): OpenXmlElement {
    if (bag === undefined) {
        return upsertPropChild(tblPr, 'tblPr', 'tblpPr', undefined);
    }
    const existing: OpenXmlElement = findWmlChild(tblPr, 'tblpPr');
    const attrs: OpenXmlAttribute[] = [];
    pushTwip(attrs, 'leftFromText', bag.distanceFromLeft);
    pushTwip(attrs, 'rightFromText', bag.distanceFromRight);
    pushTwip(attrs, 'topFromText', bag.distanceFromTop);
    pushTwip(attrs, 'bottomFromText', bag.distanceFromBottom);
    if (bag.verticalOrigin !== undefined) {
        attrs.push(wmlAttr('vertAnchor', bag.verticalOrigin));
    }
    if (bag.horizontalOrigin !== undefined) {
        attrs.push(wmlAttr('horzAnchor', bag.horizontalOrigin));
    }
    pushTwip(attrs, 'tblpX', bag.horizontalPosition);
    pushTwip(attrs, 'tblpY', bag.verticalPosition);

    // Preserve unknown attributes from the existing element and bag.
    const seen: { [k: string]: true } = {};
    for (const attribute of attrs) {
        seen[attribute.localName] = true;
    }
    const preserveFrom: ReadonlyArray<OpenXmlAttribute> = bag.unknownAttributes !== undefined
        ? bag.unknownAttributes
        : existing !== undefined
            ? existing.attributes
            : [];
    for (const a of preserveFrom) {
        if (KNOWN_ATTRS[a.localName] === true) {
            continue;
        }
        if (seen[a.localName] === true) {
            continue;
        }
        attrs.push(a);
        seen[a.localName] = true;
    }

    // Also keep known attrs present on existing that we did not set (e.g. tblpXSpec).
    if (existing !== undefined) {
        for (const a of existing.attributes) {
            if (seen[a.localName] === true) {
                continue;
            }
            // Only keep known alignment-spec style attrs we do not model yet.
            if (a.localName === 'tblpXSpec' || a.localName === 'tblpYSpec') {
                attrs.push(a);
                seen[a.localName] = true;
            }
        }
    }

    const element: OpenXmlElement = wmlElement('tblpPr', {
        attributes: attrs,
        namespaceDeclarations: existing !== undefined ? existing.namespaceDeclarations : undefined,
        children: existing !== undefined ? elementChildren(existing) : undefined
    });
    const next: OpenXmlElement = upsertPropChild(tblPr, 'tblPr', 'tblpPr', element);
    return emptyPropsToUndefined(next) !== undefined ? next : tblPr;
}
