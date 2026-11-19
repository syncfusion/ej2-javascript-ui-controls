import { arrayAt } from '../util/es5-compat';
import { OoxmlAttribute, OoxmlElement, OoxmlText } from '../xml/dom';
import { getGradientDrawingNamespace } from '../theme/read-gradient';
import { asMutable, getAttr } from './dom-utils';
import { findShapeSpPr, readUseBgFill } from './read-fill-line';
import { GradientFillError } from './write-gradient-fill';
const FILL_CHOICES: ReadonlyArray<string> = ['noFill', 'solidFill', 'gradFill', 'blipFill', 'pattFill', 'grpFill'];
const FOLLOWING: ReadonlyArray<string> = ['ln', 'effectLst', 'effectDag', 'scene3d', 'sp3d', 'extLst'];
/**
 * Checks support before any edit. Missing required spPr is rejected, not repaired.
 *
 * @internal
 * @param {OoxmlElement} shape - Actual host element.
 * @param {string | undefined} partName - Target part.
 * @returns {string} Owning DrawingML namespace.
 */
export function shapeFillNamespace(shape: OoxmlElement, partName: string | undefined): string {
    const ns: string | undefined = getGradientDrawingNamespace(shape.namespaceUri);
    if ((shape.localName !== 'sp' && shape.localName !== 'cxnSp' && shape.localName !== 'grpSp') || ns === undefined || !findShapeSpPr(shape)) {
        throw new GradientFillError(partName, 'fill.host');
    }
    return ns;
}
/**
 * Commits prevalidated fill and host-flag arrays before notifying mutation hooks.
 * Unknown namespaces, IDs, geometry, outline, effects and extensions retain identity.
 *
 * @internal
 * @param {OoxmlElement} shape - Actual host element.
 * @param {string | undefined} partName - Target part.
 * @param {OoxmlElement | undefined} replacement - New fill, or absent to reset inheritance.
 * @returns {boolean} Whether a successful mutation occurred.
 */
export function commitShapeFill(shape: OoxmlElement, partName: string | undefined, replacement: OoxmlElement | undefined): boolean {
    const ns: string = shapeFillNamespace(shape, partName);
    const spPr: OoxmlElement | undefined = findShapeSpPr(shape);
    if (!spPr) { throw new GradientFillError(partName, 'fill.host'); }
    const children: Array<OoxmlElement | OoxmlText> = spPr.children.filter((child: OoxmlElement | OoxmlText): boolean =>
        !(child.kind === 'element' && child.namespaceUri === ns && FILL_CHOICES.indexOf(child.localName) >= 0));
    const removed: boolean = children.length !== spPr.children.length;
    if (replacement !== undefined) {
        let at: number = children.length;
        for (let i: number = 0; i < children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(children, i);
            if (child.kind === 'element' && child.namespaceUri === ns && FOLLOWING.indexOf(child.localName) >= 0) { at = i; break; }
        }
        children.splice(at, 0, replacement);
    } else if (!removed) { return false; }
    // Explicit fills override useBgFill. Prepare both arrays before any live assignment.
    const attributes: ReadonlyArray<OoxmlAttribute> = replacement !== undefined && shape.localName !== 'grpSp' && readUseBgFill(shape) === true ?
        shape.attributes.map((attr: OoxmlAttribute): OoxmlAttribute =>
            attr.namespaceUri === '' && attr.localName === 'useBgFill' ?
                { namespaceUri: '', localName: 'useBgFill', value: '0' } : attr) : shape.attributes;
    asMutable(spPr).children = children;
    if (attributes !== shape.attributes) { asMutable(shape).attributes = attributes; }
    return true;
}

/**
 * Authors CT_Shape background sampling while preserving its independent owned fill.
 *
 * @param {OoxmlElement} shape - Actual native PML sp; connectors/groups/pictures do not own this attribute.
 * @param {string | undefined} partName - Actual source part identity.
 * @param {boolean | undefined} value - Explicit on/off; undefined removes the direct flag.
 * @returns {boolean} Whether the native attribute changed after full validation.
 * @internal
 */
export function writeUseBackgroundFill(shape: OoxmlElement, partName: string | undefined, value: boolean | undefined): boolean {
    if (value !== undefined && typeof value !== 'boolean') { throw new GradientFillError(partName, 'fill.background.value'); }
    const ns: string = shapeFillNamespace(shape, partName);
    if (shape.localName !== 'sp' || shape.namespaceUri === ns) { throw new GradientFillError(partName, 'fill.background.host'); }
    const raw: string | undefined = getAttr(shape, '', 'useBgFill');
    if (value === undefined && raw === undefined || value === true && (raw === '1' || raw === 'true') ||
        value === false && (raw === '0' || raw === 'false')) { return false; }
    const attributes: OoxmlAttribute[] = shape.attributes.filter((attribute: OoxmlAttribute): boolean =>
        attribute.namespaceUri !== '' || attribute.localName !== 'useBgFill');
    if (value !== undefined) { attributes.push({ namespaceUri: '', localName: 'useBgFill', value: value ? '1' : '0' }); }
    asMutable(shape).attributes = attributes; return true;
}
