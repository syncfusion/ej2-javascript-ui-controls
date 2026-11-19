import { OoxmlElement } from '../xml/dom';
import { findChild, getAttr } from '../shapes/dom-utils';
/** Sparse authored line geometry. Lexicals remain source data, including invalid values. @public */
export interface TextLineStyleSnapshot {
    /** Raw optional CT_LineProperties @w in EMUs; zero and absence remain distinct. */
    readonly widthEmu?: string;
    /** Authored cap token; Office underline rendering may ignore it. */
    readonly cap?: string;
    /** Authored compound line token. */
    readonly compound?: string;
    /** Authored center/inset alignment token. */
    readonly align?: string;
    /** Atomic preset/custom dash choice; custom lengths retain source percentage lexicals. */
    readonly dash?: { readonly kind: 'preset'; readonly value?: string } |
    { readonly kind: 'custom'; readonly stops: ReadonlyArray<{ readonly dash?: string; readonly space?: string }> };
    /** Atomic join choice, including raw miter percentage when present. */
    readonly join?: { readonly kind: 'round' | 'bevel' } | { readonly kind: 'miter'; readonly limit?: string };
}
/** @internal
 * @param {OoxmlElement} line - Exact independently validated ln/uLn carrier.
 * @param {string} namespace - Owning DrawingML dialect.
 * @returns {TextLineStyleSnapshot | undefined} Sparse clone-safe fields; no rendering defaults or live nodes. */
export function readTextLineStyle(line: OoxmlElement, namespace: string): TextLineStyleSnapshot | undefined {
    const width: string | undefined = getAttr(line, '', 'w');
    const cap: string | undefined = getAttr(line, '', 'cap');
    const compound: string | undefined = getAttr(line, '', 'cmpd');
    const align: string | undefined = getAttr(line, '', 'algn');
    const preset: OoxmlElement | undefined = findChild(line, namespace, 'prstDash');
    const custom: OoxmlElement | undefined = findChild(line, namespace, 'custDash');
    const join: OoxmlElement | undefined = line.children.find((node: OoxmlElement['children'][number]): node is OoxmlElement =>
        node.kind === 'element' && node.namespaceUri === namespace && ['round', 'bevel', 'miter'].indexOf(node.localName) >= 0);
    const dash: TextLineStyleSnapshot['dash'] = preset ? { kind: 'preset', ...optional('value', getAttr(preset, '', 'val')) } :
        custom ? { kind: 'custom', stops: custom.children.filter((node: OoxmlElement['children'][number]): node is OoxmlElement =>
            node.kind === 'element' && node.namespaceUri === namespace && node.localName === 'ds').map((node: OoxmlElement):
        { readonly dash?: string; readonly space?: string } =>
            ({ ...optional('dash', getAttr(node, '', 'd')), ...optional('space', getAttr(node, '', 'sp')) })) } : undefined;
    const style: TextLineStyleSnapshot = { ...optional('widthEmu', width), ...optional('cap', cap),
        ...optional('compound', compound), ...optional('align', align), ...(dash ? { dash } : {}),
        ...(join ? { join: join.localName === 'miter' ? { kind: 'miter', ...optional('limit', getAttr(join, '', 'lim')) } :
            { kind: join.localName === 'round' ? 'round' : 'bevel' } } : {}) };
    return Object.keys(style).length ? style : undefined;
}
/** @param {string} key - Known lexical field.
 * @param {string | undefined} value - Authored attribute.
 * @returns {Record<string, string>} Present-only source value; undefined stays absent. */
function optional(key: string, value: string | undefined): Record<string, string> {
    return value === undefined ? {} : { [key]: value };
}
