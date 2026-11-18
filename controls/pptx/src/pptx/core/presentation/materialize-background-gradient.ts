import { bindGradientPlaceholder } from '../shapes/bind-gradient-placeholder';
import { uniqueGradientChild } from '../shapes/gradient-materialization-dom';
import { OoxmlElement, OoxmlText, OoxmlAttribute } from '../xml/dom';
import { cloneScopedElement, scopedElementPath, ScopedCloneError, ScopedElementSource } from '../xml/clone-scoped-element';
import { SecurityLimits } from '../security/limits';
import { GradientHostResult, GradientBackgroundSource } from '../resolve/gradient-hosts';
import { getGradientDrawingNamespace } from '../theme/read-gradient';
import { asMutable } from '../shapes/dom-utils';
import { validateGradientReplacement } from '../shapes/materialize-shape-gradient';
/** Native wrapper context and an optional independently owned theme style. @internal */
export interface BackgroundMaterializationSource extends GradientBackgroundSource {
    readonly style?: { readonly gradient: ScopedElementSource; readonly reference: ScopedElementSource | undefined; };
}
/**
 * Copies the selected authored background locally, retaining wrapper flags/effects.
 *
 * @internal
 * @param {GradientBackgroundSource} target - Slide background owner.
 * @param {ReadonlyArray<GradientBackgroundSource>} sources - Exact slide/layout/master chain.
 * @param {GradientHostResult} selected - Canonical source selection.
 * @param {SecurityLimits} limits - Existing package limits.
 * @returns {boolean} Whether a local background override was published.
 */
export function materializeBackgroundGradient(target: GradientBackgroundSource,
                                              sources: ReadonlyArray<BackgroundMaterializationSource>, selected: GradientHostResult,
                                              limits: SecurityLimits): boolean {
    const fail: (reason: string) => never = (reason: string): never => { throw new ScopedCloneError(reason, target.partName); };
    if (selected.kind !== 'gradient') { return fail('not-gradient'); }
    const ns: string | undefined = getGradientDrawingNamespace(target.root.namespaceUri);
    if (!ns) { return fail('background-namespace'); }
    const source: BackgroundMaterializationSource | undefined = sources.find((value: BackgroundMaterializationSource): boolean =>
        value.id === selected.source);
    if (!source) { return fail('gradient-source-unavailable'); }
    const common: OoxmlElement | undefined = uniqueGradientChild(target.root, target.root.namespaceUri, 'cSld');
    const sourceCommon: OoxmlElement | undefined = uniqueGradientChild(source.root, source.root.namespaceUri, 'cSld');
    const background: OoxmlElement | undefined = sourceCommon && uniqueGradientChild(sourceCommon, source.root.namespaceUri, 'bg');
    const properties: OoxmlElement | undefined = background && uniqueGradientChild(background, source.root.namespaceUri, 'bgPr');
    const gradient: OoxmlElement | undefined = source.style ? source.style.gradient.node :
        properties && uniqueGradientChild(properties, ns, 'gradFill');
    if (!common || !background || !gradient) { return fail('gradient-source-unavailable'); }
    if (gradient.namespaceUri !== ns) { return fail('gradient-dialect-mismatch'); }
    if (background.children.filter((value: OoxmlElement | OoxmlText): boolean => value.kind === 'element' &&
        value.namespaceUri === background.namespaceUri && ['bgPr', 'bgRef'].indexOf(value.localName) >= 0).length !== 1 ||
        properties && properties.children.filter((value: OoxmlElement | OoxmlText): boolean => value.kind === 'element' &&
            value.namespaceUri === ns && ['noFill', 'solidFill', 'gradFill', 'blipFill', 'pattFill', 'grpFill'].
            indexOf(value.localName) >= 0).length > 1) { return fail('ambiguous-background-source'); }

    const local: OoxmlElement | undefined = uniqueGradientChild(common, target.root.namespaceUri, 'bg');
    const path: OoxmlElement[] = scopedElementPath({ root: target.root, node: common }, limits, target.partName);
    const list: OoxmlElement | undefined = uniqueGradientChild(gradient, ns, 'gsLst');
    if (source.root === target.root && !source.style && list) { return false; }
    if (local && source.root !== target.root) { return fail('ambiguous-local-background'); }
    let copiedList: OoxmlElement | undefined;
    if (!list) {
        if (selected.gradient.stops.source.kind !== 'source') { return fail('gradient-stops-unavailable'); }
        const stopId: string = selected.gradient.stops.source.id;
        const stopSource: BackgroundMaterializationSource | undefined = sources.find(
            (value: BackgroundMaterializationSource): boolean => value.id === stopId);
        const stopCommon: OoxmlElement | undefined = stopSource && uniqueGradientChild(stopSource.root, stopSource.root.namespaceUri, 'cSld');
        const stopBg: OoxmlElement | undefined = stopCommon && uniqueGradientChild(stopCommon, source.root.namespaceUri, 'bg');
        const stopPr: OoxmlElement | undefined = stopBg && uniqueGradientChild(stopBg, source.root.namespaceUri, 'bgPr');
        const stopGradient: OoxmlElement | undefined = stopSource && stopSource.style ? stopSource.style.gradient.node :
            stopPr && uniqueGradientChild(stopPr, ns, 'gradFill');
        const sourceList: OoxmlElement | undefined = stopGradient && uniqueGradientChild(stopGradient, ns, 'gsLst');
        if (!stopSource || !sourceList) { return fail('gradient-stops-unavailable'); }
        copiedList = cloneScopedElement({ root: stopSource.style ? stopSource.style.gradient.root : stopSource.root,
            node: sourceList, partName: stopSource.style ? stopSource.style.gradient.partName : stopSource.partName },
                                        { partName: target.partName, limits, depth: path.length + 4 });
        if (stopSource.style) { bindGradientPlaceholder(copiedList, stopSource.style.reference, target.partName, limits); }
    }
    if (source.root === target.root && !source.style) {
        if (!copiedList) { return fail('gradient-stops-unavailable'); }
        const candidate: OoxmlElement = { ...gradient, children: [copiedList, ...gradient.children] };
        validateGradientReplacement(target.root, gradient, candidate, target.partName, limits);
        asMutable(gradient).children = candidate.children.slice();
    } else {
        const copy: OoxmlElement = cloneScopedElement({ root: source.root, node: background, partName: source.partName },
                                                      { partName: target.partName, limits, depth: path.length + 1 });
        if (source.style) {
            const reference: OoxmlElement | undefined = uniqueGradientChild(copy, target.root.namespaceUri, 'bgRef');
            if (!reference || reference.attributes.some((attribute: OoxmlAttribute): boolean =>
                attribute.namespaceUri !== '' || attribute.localName !== 'idx') ||
                reference.children.some((value: OoxmlElement | OoxmlText): boolean => value.kind === 'text' ?
                    value.text.trim() !== '' : value.namespaceUri !== ns ||
                    ['srgbClr', 'scrgbClr', 'hslClr', 'sysClr', 'schemeClr', 'prstClr'].indexOf(value.localName) < 0)) {
                return fail('background-reference-metadata');
            }
            const styleCopy: OoxmlElement = cloneScopedElement(source.style.gradient,
                                                               { partName: target.partName, limits, depth: path.length + 3 });
            const boundStops: number = bindGradientPlaceholder(styleCopy, source.style.reference, target.partName, limits);
            if (boundStops === 0 && source.style.reference && opaqueReferenceColor(source.style.reference.node, ns)) {
                return fail('unused-background-reference-metadata');
            }
            const newProperties: OoxmlElement = { kind: 'element', namespaceUri: target.root.namespaceUri,
                localName: 'bgPr', prefixHint: background.prefixHint, attributes: [], children: [styleCopy] };
            asMutable(copy).children = copy.children.map((value: OoxmlElement | OoxmlText): OoxmlElement | OoxmlText =>
                value === reference ? newProperties : value);
        }
        if (copiedList) {
            const copyPr: OoxmlElement | undefined = uniqueGradientChild(copy, target.root.namespaceUri, 'bgPr');
            const copyGradient: OoxmlElement | undefined = copyPr && uniqueGradientChild(copyPr, ns, 'gradFill');
            if (!copyGradient) { return fail('gradient-source-unavailable'); }
            asMutable(copyGradient).children = [copiedList, ...copyGradient.children];
        }
        const children: Array<OoxmlElement | OoxmlText> = local ? common.children.map(
            (value: OoxmlElement | OoxmlText): OoxmlElement | OoxmlText => value === local ? copy : value) : [copy, ...common.children];
        validateGradientReplacement(target.root, common, { ...common, children }, target.partName, limits);
        asMutable(common).children = children;
    }
    return true;
}

/** Unknown reference-color data needs a bound stop carrier; never silently discard it.
 *
 * @param {OoxmlElement} color - Actual authored reference color.
 * @param {string} ns - Native DrawingML namespace.
 * @returns {boolean} Whether replacing the reference would discard unrecognized XML. */
function opaqueReferenceColor(color: OoxmlElement, ns: string): boolean {
    const fields: ReadonlyArray<string> = ['val', 'lastClr', 'r', 'g', 'b', 'hue', 'sat', 'lum'];
    if (color.attributes.some((attribute: OoxmlAttribute): boolean => attribute.namespaceUri !== '' ||
        fields.indexOf(attribute.localName) < 0)) { return true; }
    const operations: ReadonlyArray<string> = ['tint', 'shade', 'comp', 'inv', 'gray', 'alpha', 'alphaOff', 'alphaMod',
        'hue', 'hueOff', 'hueMod', 'sat', 'satOff', 'satMod', 'lum', 'lumOff', 'lumMod', 'red', 'redOff', 'redMod',
        'green', 'greenOff', 'greenMod', 'blue', 'blueOff', 'blueMod', 'gamma', 'invGamma'];
    return color.children.some((value: OoxmlElement | OoxmlText): boolean => value.kind === 'text' ? value.text.trim() !== '' :
        value.namespaceUri !== ns || operations.indexOf(value.localName) < 0 ||
        value.attributes.some((attribute: OoxmlAttribute): boolean => attribute.namespaceUri !== '' || attribute.localName !== 'val') ||
        value.children.some((child: OoxmlElement | OoxmlText): boolean => child.kind === 'element' || child.text.trim() !== ''));
}
