import { GradientHostResult, GradientHostSource as HostSource, resolveGradientHostSources as resolveHost } from './gradient-host-sources';
export { GradientGroupOwner, GradientHostResult, GradientHostDiagnostic } from './gradient-host-sources';
import { DirectFill } from '../shapes/fill-line-types';
/** Non-mutating host-specific gradient inheritance using existing placeholder matches. */
import { Shape } from '../shapes/shape';
import { findShapeSpPr, readDirectFill, readShapeFillReference } from '../shapes/read-fill-line';
import { OoxmlElement, OoxmlText } from '../xml/dom';
import { arrayAt } from '../util/es5-compat';
import { findChild, getAttr } from '../shapes/dom-utils';
import { DirectSlideBackground, readBackgroundFillReference, readDirectBackground } from '../presentation/background';
import { EffectiveColorContext } from '../theme/resolve-color';
import { AuthoredFillMatrixReference } from '../theme/read-fill-reference';
import { GradientThemeStyles, GradientThemeStyle } from '../theme/gradient-theme-styles';
import { AuthoredGradientFill } from '../theme/gradient-types';
import { getGradientDrawingNamespace, readAuthoredGradient } from '../theme/read-gradient';
import { ResolveContext } from './resolve-style';

/** Background root selected by the existing slide/layout/master relationship chain. @internal */
export interface GradientBackgroundSource {
    readonly id: 'slide' | 'layout' | 'master';
    readonly root: OoxmlElement;
    readonly partName: string;
}
/**
 * Resolves shape direct/style fields followed by already matched placeholders.
 *
 * @param {Shape} shape - Live slide shape.
 * @param {ResolveContext} context - Existing type/index placeholder match context.
 * @param {GradientThemeStyles | undefined} theme - Current applicable theme matrices.
 * @returns {GradientHostResult} Effective fill with source/color diagnostics.
 * @internal
 */
export function resolveShapeGradientHost(
    shape: Shape, context: ResolveContext, theme: GradientThemeStyles | undefined
): GradientHostResult {
    const sources: HostSource[] = [];
    appendShape(sources, shape, 'direct', 'style');
    if (context.layoutShape !== undefined) { appendShape(sources, context.layoutShape, 'layout', 'layout-style'); }
    if (context.masterShape !== undefined) { appendShape(sources, context.masterShape, 'master', 'master-style'); }
    const direct: GradientHostResult = resolveHost(sources, theme, context.colorContext, false);
    if (direct.kind === 'other' && direct.fillKind === 'group') {
        if (direct.source === 'layout' || direct.source === 'layout-style' ||
            direct.source === 'master' || direct.source === 'master-style') {
            return { ...direct, reason: 'inherited-group-owner-unresolved' };
        }
        return resolveParentGroup(shape, theme, context.colorContext, direct);
    }
    return shape.elementKind === 'grpSp' && direct.kind !== 'missing' ?
        groupOwner(direct, shape.id, [shape.id], shape.getPartName()) : direct;
}
/**
 * Resolves background fills in slide/layout/master order without hiding explicit choices.
 *
 * @param {ReadonlyArray<GradientBackgroundSource>} backgrounds - Applicable relationship-linked roots.
 * @param {GradientThemeStyles | undefined} theme - Applicable theme matrices.
 * @param {EffectiveColorContext | undefined} colors - Current map/scheme context.
 * @returns {GradientHostResult} Effective gradient, explicit non-gradient, invalid reference or white fallback.
 * @internal
 */
export function resolveGradientBackgroundHost(
    backgrounds: ReadonlyArray<GradientBackgroundSource>, theme: GradientThemeStyles | undefined, colors: EffectiveColorContext | undefined
): GradientHostResult {
    const sources: HostSource[] = [];
    for (let i: number = 0; i < backgrounds.length; i++) {
        const item: GradientBackgroundSource = arrayAt(backgrounds, i);
        const direct: DirectSlideBackground = readDirectBackground(item.root, undefined);
        const common: OoxmlElement | undefined = findChild(item.root, item.root.namespaceUri, 'cSld');
        const background: OoxmlElement | undefined = common === undefined ? undefined : findChild(common, item.root.namespaceUri, 'bg');
        const properties: OoxmlElement | undefined = background === undefined ? undefined : findChild(background, item.root.namespaceUri, 'bgPr');
        if (direct.kind === 'fill') {
            sources.push({ id: item.id, fill: direct.fill.kind === 'gradient' ? gradientChild(properties, item.partName) :
                barrier(direct.fill.kind), shadeToTitle: direct.shadeToTitle });
        } else {
            sources.push({ id: item.id, fill: { kind: 'missing' }, reference: readBackgroundFillReference(item.root, item.partName) });
        }
    }
    return resolveHost(sources, theme, colors, true);
}
/**
 * Adds direct shape and style tiers without mutating or searching other shapes.
 *
 * @param {HostSource[]} sources - Collected tiers.
 * @param {Shape} shape - Already selected live shape.
 * @param {string} directId - Direct tier identity.
 * @param {string} styleId - Style tier identity.
 * @returns {void} Appends direct and reference tiers.
 */
function appendShape(sources: HostSource[], shape: Shape, directId: string, styleId: string): void {
    const element: OoxmlElement = shape.getElement();
    const direct: DirectFill = readDirectFill(element);
    sources.push({ id: directId, fill: direct.kind === 'gradient' ? gradientChild(findShapeSpPr(element)) : barrier(direct.kind) });
    const reference: AuthoredFillMatrixReference | undefined = readShapeFillReference(element);
    if (reference !== undefined) { sources.push({ id: styleId, fill: { kind: 'missing' }, reference }); }
}
/**
 * Reads a complete direct gradient from its owning properties, preserving sparse fields.
 *
 * @param {OoxmlElement | undefined} properties - Shape/background fill container.
 * @param {string} partName - Optional owning part.
 * @returns {GradientThemeStyle} Direct gradient or explicit unrecognized barrier.
 */
function gradientChild(properties: OoxmlElement | undefined, partName?: string): GradientThemeStyle {
    if (properties !== undefined) {
        const ns: string | undefined = getGradientDrawingNamespace(properties.namespaceUri);
        for (let i: number = 0; i < properties.children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(properties.children, i);
            if (child.kind !== 'element' || child.namespaceUri !== ns || child.localName !== 'gradFill') { continue; }
            const gradient: AuthoredGradientFill | undefined = readAuthoredGradient(child, partName);
            if (gradient !== undefined) { return gradient; }
        }
    }
    return { kind: 'unknown' };
}
/**
 * Converts a legacy non-gradient classification into a same-type merge barrier.
 *
 * @param {string} kind - Direct fill choice.
 * @returns {GradientThemeStyle} Choice barrier without fabricated gradient defaults.
 */
function barrier(kind: string): GradientThemeStyle {
    switch (kind) {
    case 'noFill': return { kind: 'none' };
    case 'missing': return { kind: 'missing' };
    case 'solid': return { kind: 'solid' };
    case 'picture': return { kind: 'picture' };
    case 'pattern': return { kind: 'pattern' };
    case 'group': return { kind: 'group' };
    default: return { kind: 'unknown' };
    }
}
/**
 * Follows only explicit grpFill links through the already captured ancestor path.
 * Missing or another fill choice stops the chain; no slide-wide search or source
 * mutation occurs. Source rectangles/flip remain intact for later paint profiles.
 *
 * @param {Shape} shape - Recipient of the selected group reference.
 * @param {GradientThemeStyles | undefined} theme - Applicable theme data.
 * @param {EffectiveColorContext | undefined} colors - Existing map and scheme.
 * @param {GradientHostResult} unresolved - Selected reference when no parent exists.
 * @returns {GradientHostResult} Actual parent ownership, or an explicit unresolved reference.
 */
function resolveParentGroup(shape: Shape, theme: GradientThemeStyles | undefined,
                            colors: EffectiveColorContext | undefined, unresolved: GradientHostResult): GradientHostResult {
    const parents: ReadonlyArray<OoxmlElement> = shape.getGroupAncestors();
    const chain: (string | undefined)[] = [];
    const seen: Set<OoxmlElement> = new Set();
    for (let i: number = parents.length - 1; i >= 0; i--) {
        const parent: OoxmlElement = arrayAt(parents, i);
        if (seen.has(parent) || (parent.localName !== 'grpSp' && parent.localName !== 'spTree') ||
            getGradientDrawingNamespace(parent.namespaceUri) === undefined) {
            return { kind: 'invalid-reference', source: 'group', reason: 'invalid-group-ancestry' };
        }
        seen.add(parent);
        const nonVisual: OoxmlElement | undefined = findChild(parent, parent.namespaceUri, 'nvGrpSpPr');
        const identity: OoxmlElement | undefined = nonVisual === undefined ? undefined : findChild(nonVisual, parent.namespaceUri, 'cNvPr');
        const id: string | undefined = identity === undefined ? undefined : getAttr(identity, '', 'id');
        chain.push(id);
        const fill: DirectFill = readDirectFill(parent);
        if (fill.kind === 'group') { continue; }
        const source: string = 'group:' + (id === undefined ? 'depth-' + String(i) : id);
        const result: GradientHostResult = resolveHost([{ id: source,
            fill: fill.kind === 'gradient' ? gradientChild(findShapeSpPr(parent), shape.getPartName()) : barrier(fill.kind)
        }], theme, colors, false);
        return groupOwner(result, id, chain, shape.getPartName());
    }
    return { kind: 'other', source: unresolved.source, fillKind: 'group', reason: 'missing-group-owner' };
}
/**
 * @param {GradientHostResult} result - Selected effective group fill.
 * @param {string | undefined} id - Actual source group identity.
 * @param {ReadonlyArray<string | undefined>} chain - Referenced group identities.
 * @param {string | undefined} partName - Existing owner part.
 * @returns {GradientHostResult} Fill view with ownership; no authored paint is copied.
 */
function groupOwner(result: GradientHostResult, id: string | undefined, chain: ReadonlyArray<string | undefined>,
                    partName: string | undefined): GradientHostResult {
    return { ...result, groupOwner: { id, chain, partName } };
}
