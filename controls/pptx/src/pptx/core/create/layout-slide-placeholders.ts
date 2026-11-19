/**
 * Copies layout placeholders onto a newly created slide.
 *
 * @remarks
 * Office-family generators (and the .NET PowerPoint library's `AddLayout*`
 * methods) place a `p:sp` on the slide for each non-footer placeholder on the
 * chosen layout. Matching is by `p:ph/@type` + `@idx` (`CT_Placeholder`), so
 * the slide shape keeps the layout shape's `p:ph` attributes and an empty
 * `p:txBody`. Geometry is inherited from the layout and is not copied.
 *
 * Date, footer, and slide-number placeholders (`dt` / `ftr` / `sldNum`) are
 * not copied. The blank layout in `defaultContent.zip` contains only that
 * footer triple, so a blank slide stays empty.
 *
 * Citation: Transitional `pml.xsd` `CT_Placeholder` / `ST_PlaceholderType`
 * (~1213–1249); ECMA-376-1 §19.3.1.36 `p:ph`. Placeholder markup is copied
 * from the layout part already in the package — types and idx values are not
 * invented.
 */
import { PML_NS } from '../presentation/constants';
import { OoxmlAttribute, OoxmlElement, OoxmlText } from '../xml/dom';
import { PlaceholderInfo } from '../placeholders/placeholder-info';
import { asMutable, findChild } from '../shapes/dom-utils';
import { Shape } from '../shapes/shape';
import { DML_NS } from '../shapes/constants';

/** Footer placeholders that stay on the layout and are not cloned onto the slide. */
const FOOTER_PLACEHOLDER_TYPES: ReadonlyArray<string> = Object.freeze(['dt', 'ftr', 'sldNum']);

/**
 * Appends one slide placeholder per non-footer layout placeholder.
 *
 * @param slideRoot - Parsed `p:sld` of the slide being created.
 * @param layoutShapes - Layout shape walk (`LayoutSlide.placeholderShapes`).
 * @returns Number of placeholders appended.
 */
export function applyLayoutPlaceholdersToSlide(slideRoot: OoxmlElement, layoutShapes: ReadonlyArray<Shape>): number {
    const spTree: OoxmlElement | undefined = findSlideSpTree(slideRoot);
    if (spTree === undefined) {
        return 0;
    }
    let added: number = 0;
    for (let i: number = 0; i < layoutShapes.length; i++) {
        const layoutShape: Shape = layoutShapes[i];
        if (layoutShape === undefined || !layoutShape.isPlaceholder) {
            continue;
        }
        const info: PlaceholderInfo | undefined = layoutShape.placeholder;
        if (info === undefined || isFooterPlaceholder(info.type)) {
            continue;
        }
        const id: string = String(added + 2);
        const name: string = layoutShape.name.length > 0 ? layoutShape.name : placeholderName(info.type, added);
        asMutable(spTree).children.push(buildSlidePlaceholder(id, name, info));
        added++;
    }
    return added;
}

/**
 * @param type - Authored `p:ph/@type` (XSD default `obj` when omitted).
 * @returns True for date, footer, and slide-number placeholders.
 */
function isFooterPlaceholder(type: string): boolean {
    for (let i: number = 0; i < FOOTER_PLACEHOLDER_TYPES.length; i++) {
        if (FOOTER_PLACEHOLDER_TYPES[i] === type) {
            return true;
        }
    }
    return false;
}

/**
 * @param slideRoot - Slide document element.
 * @returns `p:cSld/p:spTree` when present.
 */
function findSlideSpTree(slideRoot: OoxmlElement): OoxmlElement | undefined {
    const cSld: OoxmlElement | undefined = findChild(slideRoot, PML_NS, 'cSld');
    if (cSld === undefined) {
        return undefined;
    }
    return findChild(cSld, PML_NS, 'spTree');
}

/**
 * Builds a slide `p:sp` whose `p:ph` matches the layout placeholder.
 *
 * Citation: `pml.xsd` `CT_Shape` (`nvSpPr`, `spPr` required; `txBody` optional);
 * `CT_Placeholder` attributes `type`, `orient`, `sz`, `idx`;
 * `dml-main.xsd` `CT_TextBody` (`bodyPr` required, `p` minOccurs 1).
 * Omitted `@type` (XSD default `obj`) is omitted again so content placeholders
 * stay distinguishable from explicit `body` placeholders.
 *
 * @param id - New `cNvPr/@id`. Slide ids start at 2; layout ids are not reused.
 * @param name - `cNvPr/@name` copied from the layout placeholder.
 * @param info - Direct placeholder metadata from the layout shape.
 * @returns A new `p:sp` element.
 */
function buildSlidePlaceholder(id: string, name: string, info: PlaceholderInfo): OoxmlElement {
    const phAttributes: OoxmlAttribute[] = [];
    if (info.type !== 'obj') {
        phAttributes.push(attribute('type', info.type));
    }
    if (info.orient !== undefined) {
        phAttributes.push(attribute('orient', info.orient));
    }
    if (info.sz !== undefined) {
        phAttributes.push(attribute('sz', info.sz));
    }
    if (info.idx !== 0) {
        phAttributes.push(attribute('idx', String(info.idx)));
    }
    if (info.hasCustomPrompt !== undefined) {
        phAttributes.push(attribute('hasCustomPrompt', info.hasCustomPrompt));
    }
    const cNvPr: OoxmlElement = element(PML_NS, 'cNvPr', 'p', [attribute('id', id), attribute('name', name)], []);
    const spLocks: OoxmlElement = element(DML_NS, 'spLocks', 'a', [attribute('noGrp', '1')], []);
    const cNvSpPr: OoxmlElement = element(PML_NS, 'cNvSpPr', 'p', [], [spLocks]);
    const ph: OoxmlElement = element(PML_NS, 'ph', 'p', phAttributes, []);
    const nvPr: OoxmlElement = element(PML_NS, 'nvPr', 'p', [], [ph]);
    const nvSpPr: OoxmlElement = element(PML_NS, 'nvSpPr', 'p', [], [cNvPr, cNvSpPr, nvPr]);
    const spPr: OoxmlElement = element(PML_NS, 'spPr', 'p', [], []);
    const txBody: OoxmlElement = element(PML_NS, 'txBody', 'p', [], [
        element(DML_NS, 'bodyPr', 'a', [], []),
        element(DML_NS, 'lstStyle', 'a', [], []),
        element(DML_NS, 'p', 'a', [], [])
    ]);
    return element(PML_NS, 'sp', 'p', [], [nvSpPr, spPr, txBody]);
}

/**
 * @param type - Placeholder type token.
 * @param index - Zero-based index among copied placeholders.
 * @returns A fallback `cNvPr/@name` when the layout shape has an empty name.
 */
function placeholderName(type: string, index: number): string {
    return 'Placeholder ' + String(index + 1) + ' (' + type + ')';
}

/**
 * @param namespaceUri - Element namespace URI.
 * @param localName - Element local name.
 * @param prefixHint - Serialization prefix.
 * @param attributes - Attributes.
 * @param children - Child nodes.
 * @returns An element node.
 */
function element(namespaceUri: string, localName: string, prefixHint: string, attributes: ReadonlyArray<OoxmlAttribute>,
                 children: ReadonlyArray<OoxmlElement | OoxmlText>): OoxmlElement {
    return {
        kind: 'element',
        namespaceUri,
        localName,
        prefixHint,
        attributes,
        children
    };
}

/**
 * @param localName - Un-namespaced attribute name.
 * @param value - Attribute value.
 * @returns An attribute node.
 */
function attribute(localName: string, value: string): OoxmlAttribute {
    return { namespaceUri: '', localName, value };
}
