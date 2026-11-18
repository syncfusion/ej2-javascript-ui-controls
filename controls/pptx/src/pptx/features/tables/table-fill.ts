/** Direct optional-table fill adapter; schema order is independent of shape properties. */
import { OoxmlElement, OoxmlText } from '../../core/xml/dom';
import { asMutable, findChild } from '../../core/shapes/dom-utils';
import { DirectFill } from '../../core/shapes/fill-line-types';
import { readFillProperties } from '../../core/shapes/read-fill-line';
import { getGradientDrawingNamespace, readAuthoredGradient } from '../../core/theme/read-gradient';
import { AuthoredGradientFill } from '../../core/theme/gradient-types';
import { GradientFillError } from '../../core/shapes/write-gradient-fill';
import { arrayAt } from '../../core/util/es5-compat';
const FILLS: ReadonlyArray<string> = ['noFill', 'solidFill', 'gradFill', 'blipFill', 'pattFill', 'grpFill'];
/**
 * @param {OoxmlElement} host - Exact tbl or tc.
 * @param {string} partName - Source identity.
 * @returns {string} Owning DrawingML dialect.
 * @internal
 */
export function tableFillNamespace(host: OoxmlElement, partName?: string): string {
    const ns: string | undefined = getGradientDrawingNamespace(host.namespaceUri);
    if (ns !== host.namespaceUri || (host.localName !== 'tbl' && host.localName !== 'tc')) {
        throw new GradientFillError(partName, 'fill.table.host');
    }
    return ns;
}
/**
 * @param {OoxmlElement} host - Validated table or cell.
 * @returns {OoxmlElement | undefined} Direct properties only.
 * @internal
 */
export function tableFillProperties(host: OoxmlElement): OoxmlElement | undefined {
    return findChild(host, host.namespaceUri, host.localName === 'tbl' ? 'tblPr' : 'tcPr');
}
/**
 * @param {OoxmlElement} host - Exact table or cell.
 * @param {string} partName - Source identity.
 * @returns {DirectFill} Authored fill classification, not table-style resolution.
 * @internal
 */
export function readTableFill(host: OoxmlElement, partName?: string): DirectFill {
    tableFillNamespace(host, partName);
    const properties: OoxmlElement | undefined = tableFillProperties(host);
    return properties === undefined ? { kind: 'missing' } : readFillProperties(properties);
}
/**
 * @param {OoxmlElement} host - Exact table or cell.
 * @param {string} partName - Source identity.
 * @returns {AuthoredGradientFill | undefined} Complete sparse authored gradient.
 * @internal
 */
export function readTableGradient(host: OoxmlElement, partName?: string): AuthoredGradientFill | undefined {
    const gradient: OoxmlElement | undefined = tableGradientElement(host, partName);
    return gradient === undefined ? undefined : readAuthoredGradient(gradient, partName);
}
/**
 * @param {OoxmlElement} host - Exact table or cell.
 * @param {string} partName - Source identity.
 * @returns {OoxmlElement | undefined} Gradient only when it is the first selected fill choice.
 * @internal
 */
export function tableGradientElement(host: OoxmlElement, partName?: string): OoxmlElement | undefined {
    tableFillNamespace(host, partName);
    const properties: OoxmlElement | undefined = tableFillProperties(host);
    if (properties === undefined) { return undefined; }
    for (let i: number = 0; i < properties.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(properties.children, i);
        if (child.kind === 'element' && child.namespaceUri === host.namespaceUri && FILLS.indexOf(child.localName) >= 0) {
            return child.localName === 'gradFill' ? child : undefined;
        }
    }
    return undefined;
}

/**
 * Commits only prevalidated fill children, creating an absent carrier in schema order.
 *
 * @param {OoxmlElement} host - Exact table or physical cell (merge ownership unchanged).
 * @param {OoxmlElement} replacement - Detached validated fill or reset.
 * @param {string} partName - Source identity.
 * @returns {boolean} Whether the DOM changed.
 * @internal
 */
export function commitTableFill(host: OoxmlElement, replacement: OoxmlElement | undefined, partName?: string): boolean {
    const ns: string = tableFillNamespace(host, partName);
    const old: OoxmlElement | undefined = tableFillProperties(host);
    if (old === undefined && replacement === undefined) { return false; }
    const properties: OoxmlElement = old === undefined ? { kind: 'element', namespaceUri: ns,
        localName: host.localName === 'tbl' ? 'tblPr' : 'tcPr', attributes: [], children: [], prefixHint: host.prefixHint } : old;
    const children: Array<OoxmlElement | OoxmlText> = properties.children.filter((child: OoxmlElement | OoxmlText): boolean =>
        !(child.kind === 'element' && child.namespaceUri === ns && FILLS.indexOf(child.localName) >= 0));
    if (replacement === undefined && children.length === properties.children.length) { return false; }
    if (replacement !== undefined) {
        const after: ReadonlyArray<string> = host.localName === 'tbl' ?
            ['effectLst', 'effectDag', 'tableStyle', 'tableStyleId', 'extLst'] : ['headers', 'extLst'];
        let at: number = children.length;
        for (let i: number = 0; i < children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(children, i);
            if (child.kind === 'element' && child.namespaceUri === ns && after.indexOf(child.localName) >= 0) { at = i; break; }
        }
        children.splice(at, 0, replacement);
    }
    let hostChildren: Array<OoxmlElement | OoxmlText> | undefined;
    if (old === undefined) {
        hostChildren = host.children.slice();
        let at: number = hostChildren.length;
        for (let i: number = 0; i < hostChildren.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(hostChildren, i);
            if (child.kind === 'element' && child.namespaceUri === ns &&
                (host.localName === 'tbl' ? ['tblGrid', 'tr'].indexOf(child.localName) >= 0 : child.localName === 'extLst')) { at = i; break; }
        }
        hostChildren.splice(at, 0, properties);
    }
    asMutable(properties).children = children;
    if (hostChildren !== undefined) { asMutable(host).children = hostChildren; }
    return true;
}
