/** Fill-only authoring for CT_LineProperties and text underline wrappers. */
import { OoxmlElement, OoxmlText } from '../xml/dom';
import { asMutable, findChild } from './dom-utils';
import { findShapeSpPr } from './read-fill-line';
import { getGradientDrawingNamespace } from '../theme/read-gradient';
import { GradientFillError } from './write-gradient-fill';
import { arrayAt } from '../util/es5-compat';
/** Independent text decoration paint target, separate from glyph fill. @public */
export type TextGradientDecoration = 'outline' | 'underline-fill' | 'underline-outline';
const LINE_FILLS: ReadonlyArray<string> = ['noFill', 'solidFill', 'gradFill', 'pattFill'];
const ALL_FILLS: ReadonlyArray<string> = ['noFill', 'solidFill', 'gradFill', 'pattFill', 'blipFill', 'grpFill'];
const LINE_FOLLOWING: ReadonlyArray<string> = ['prstDash', 'custDash', 'round', 'bevel', 'miter', 'headEnd', 'tailEnd', 'extLst'];
const FONT_FOLLOWING: ReadonlyArray<string> = ['latin', 'ea', 'cs', 'sym', 'hlinkClick', 'hlinkMouseOver', 'rtl', 'extLst'];
/**
 * @param {OoxmlElement} shape - Supported shape, connector or picture.
 * @param {string | undefined} partName - Diagnostic part.
 * @returns {string} Exact owning DrawingML dialect.
 * @internal
 */
export function outlineNamespace(shape: OoxmlElement, partName: string | undefined): string {
    const ns: string | undefined = getGradientDrawingNamespace(shape.namespaceUri);
    if (ns === undefined || ['sp', 'cxnSp', 'pic'].indexOf(shape.localName) < 0 || findShapeSpPr(shape) === undefined) {
        throw new GradientFillError(partName, 'outline.host');
    }
    return ns;
}
/**
 * @param {OoxmlElement} properties - Character properties.
 * @param {TextGradientDecoration} target - Independent decoration lane.
 * @param {string | undefined} partName - Diagnostic part.
 * @returns {string} Exact supported character dialect.
 * @internal
 */
export function decorationNamespace(properties: OoxmlElement, target: TextGradientDecoration, partName: string | undefined): string {
    const ns: string | undefined = getGradientDrawingNamespace(properties.namespaceUri);
    if (ns === undefined || ns !== properties.namespaceUri || ['rPr', 'defRPr', 'endParaRPr'].indexOf(properties.localName) < 0 ||
        ['outline', 'underline-fill', 'underline-outline'].indexOf(target) < 0) { throw new GradientFillError(partName, 'decoration.host'); }
    return ns;
}
/**
 * @param {OoxmlElement} shape - Existing supported shape.
 * @param {OoxmlElement | undefined} fill - Detached validated fill, or reset.
 * @param {string | undefined} partName - Diagnostic part.
 * @returns {boolean} Whether a fill was replaced or removed.
 * @internal
 */
export function commitOutlineFill(shape: OoxmlElement, fill: OoxmlElement | undefined, partName: string | undefined): boolean {
    const ns: string = outlineNamespace(shape, partName);
    const properties: OoxmlElement | undefined = findShapeSpPr(shape);
    if (properties === undefined) { throw new GradientFillError(partName, 'outline.host'); }
    const existing: OoxmlElement | undefined = findChild(properties, ns, 'ln');
    if (existing === undefined && fill === undefined) { return false; }
    const line: OoxmlElement = existing || element('ln', ns);
    const changed: boolean = replaceLineFill(line, ns, fill);
    if (existing === undefined && changed) {
        replaceChoice(properties, ns, ['ln'], line, ['effectLst', 'effectDag', 'scene3d', 'sp3d', 'extLst']);
    }
    return changed;
}
/**
 * @param {OoxmlElement} properties - Existing character properties.
 * @param {TextGradientDecoration} target - Independent decoration lane.
 * @param {OoxmlElement | undefined} fill - Detached validated fill or reset.
 * @param {string | undefined} partName - Diagnostic part.
 * @param {boolean} follow - Explicit underline follow-text choice.
 * @returns {boolean} Whether the owned choice changed.
 * @internal
 */
export function commitDecorationFill(properties: OoxmlElement, target: TextGradientDecoration, fill: OoxmlElement | undefined,
                                     partName: string | undefined, follow: boolean = false): boolean {
    const ns: string = decorationNamespace(properties, target, partName);
    if (follow && target === 'outline') { throw new GradientFillError(partName, 'decoration.followText'); }
    const name: string = target === 'outline' ? 'ln' : target === 'underline-fill' ? 'uFill' : 'uLn';
    const choices: string[] = target === 'outline' ? ['ln'] : [name, name + 'Tx'];
    const following: string[] = target === 'outline' ? ALL_FILLS.concat(['effectLst', 'effectDag', 'highlight', 'uLn', 'uLnTx', 'uFill', 'uFillTx'], FONT_FOLLOWING) :
        target === 'underline-outline' ? ['uFill', 'uFillTx'].concat(FONT_FOLLOWING) : FONT_FOLLOWING.slice();
    const existing: OoxmlElement | undefined = findChild(properties, ns, name);
    if (follow) { return replaceChoice(properties, ns, choices, element(name + 'Tx', ns), following); }
    if (target === 'underline-fill' && fill === undefined) { return replaceChoice(properties, ns, choices, undefined, following); }
    if (existing === undefined && fill === undefined) { return replaceChoice(properties, ns, choices, undefined, following); }
    const wrapper: OoxmlElement = existing || element(name, ns);
    const changed: boolean = replaceChoice(wrapper, ns, target === 'underline-fill' ? ALL_FILLS : LINE_FILLS, fill, LINE_FOLLOWING);
    if (fill !== undefined) { replaceChoice(properties, ns, choices, wrapper, following); }
    return changed;
}
/**
 * @param {OoxmlElement | undefined} properties - Current character properties.
 * @param {TextGradientDecoration} target - Independent decoration lane.
 * @returns {OoxmlElement | undefined} Current direct gradient, excluding follow-text.
 * @internal
 */
export function decorationGradient(properties: OoxmlElement | undefined, target: TextGradientDecoration): OoxmlElement | undefined {
    if (properties === undefined) { return undefined; }
    const ns: string = decorationNamespace(properties, target, undefined);
    const name: string = target === 'outline' ? 'ln' : target === 'underline-fill' ? 'uFill' : 'uLn';
    if (target !== 'outline' && findChild(properties, ns, name + 'Tx') !== undefined) { return undefined; }
    const wrapper: OoxmlElement | undefined = findChild(properties, ns, name);
    return wrapper === undefined ? undefined : findChild(wrapper, ns, 'gradFill');
}
/**
 * @param {OoxmlElement} owner - Exact choice owner.
 * @param {string} ns - Exact namespace.
 * @param {ReadonlyArray<string>} choices - Owned alternatives only.
 * @param {OoxmlElement | undefined} replacement - Prevalidated new choice.
 * @param {ReadonlyArray<string>} following - Known schema successors.
 * @returns {boolean} Whether a replacement/removal occurred.
 */
function replaceChoice(owner: OoxmlElement, ns: string, choices: ReadonlyArray<string>, replacement: OoxmlElement | undefined,
                       following: ReadonlyArray<string>): boolean {
    const children: (OoxmlElement | OoxmlText)[] = owner.children.filter((child: OoxmlElement | OoxmlText): boolean =>
        !(child.kind === 'element' && child.namespaceUri === ns && choices.indexOf(child.localName) >= 0));
    if (replacement === undefined && children.length === owner.children.length) { return false; }
    if (replacement !== undefined) {
        let at: number = children.length;
        for (let i: number = 0; i < children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(children, i);
            if (child.kind === 'element' && child.namespaceUri === ns && following.indexOf(child.localName) >= 0) { at = i; break; }
        }
        children.splice(at, 0, replacement);
    }
    asMutable(owner).children = children; return true;
}
/**
 * @param {string} name - Legal wrapper kind.
 * @param {string} ns - Exact dialect.
 * @returns {OoxmlElement} Detached empty wrapper.
 */
function element(name: string, ns: string): OoxmlElement {
    return { kind: 'element', namespaceUri: ns, localName: name, prefixHint: 'a', attributes: [], children: [] };
}

/**
 * Replaces the validated line-fill choice while preserving all other line children.
 *
 * @param {OoxmlElement} line - Actual or detached CT_LineProperties carrier.
 * @param {string} ns - Owning DrawingML dialect.
 * @param {OoxmlElement | undefined} fill - Detached validated fill or reset.
 * @returns {boolean} Whether the owned fill changed.
 * @internal
 */
export function replaceLineFill(line: OoxmlElement, ns: string, fill: OoxmlElement | undefined): boolean {
    return replaceChoice(line, ns, LINE_FILLS, fill, LINE_FOLLOWING);
}

/**
 * Replaces only CT_TextCharacterProperties' glyph fill choice. Decoration,
 * highlight, font, hyperlink and extension carriers remain independent.
 *
 * @param {OoxmlElement} properties - Exact character host in its owning dialect.
 * @param {OoxmlElement | undefined} fill - Detached validated glyph fill, or reset.
 * @param {string | undefined} partName - Owning part for diagnostics.
 * @returns {boolean} Whether authored glyph state changed.
 * @internal
 */
export function commitCharacterGlyphFill(
    properties: OoxmlElement, fill: OoxmlElement | undefined, partName: string | undefined
): boolean {
    const ns: string = decorationNamespace(properties, 'outline', partName);
    if (fill !== undefined && (fill.namespaceUri !== ns || ALL_FILLS.indexOf(fill.localName) < 0)) {
        throw new GradientFillError(partName, 'glyph.fill');
    }
    const existing: (OoxmlElement | OoxmlText)[] = properties.children.filter((child: OoxmlElement | OoxmlText): boolean =>
        child.kind === 'element' && child.namespaceUri === ns && ALL_FILLS.indexOf(child.localName) >= 0);
    if (fill && existing.length === 1 && JSON.stringify(arrayAt(existing, 0)) === JSON.stringify(fill)) { return false; }
    return replaceChoice(properties, ns, ALL_FILLS, fill, ['effectLst', 'effectDag', 'highlight', 'uLnTx', 'uLn',
        'uFillTx', 'uFill', 'latin', 'ea', 'cs', 'sym', 'hlinkClick', 'hlinkMouseOver', 'rtl', 'extLst']);
}
