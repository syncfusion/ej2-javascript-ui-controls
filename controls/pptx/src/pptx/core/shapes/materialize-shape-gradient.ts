import { bindGradientPlaceholder } from './bind-gradient-placeholder';
import { uniqueGradientChild } from './gradient-materialization-dom';
import { arrayAt } from '../util/es5-compat';
import { OoxmlElement, OoxmlText, parseXml, serializeXml } from '../xml/dom';
import { cloneScopedElement, scopedElementPath, ScopedCloneError, ScopedElementSource } from '../xml/clone-scoped-element';
import { SecurityLimits } from '../security/limits';
import { PackageLimitError } from '../security/errors';
import { GradientHostResult } from '../resolve/gradient-hosts';
import { findShapeSpPr, readUseBgFill } from './read-fill-line';
import { asMutable } from './dom-utils';
import { commitShapeFill, shapeFillNamespace } from './mutate-shape-fill';
/** Authored source identity under the owning part, never a resolved RGB projection. @internal */
export interface GradientMaterializationSource {
    readonly gradient?: OoxmlElement; readonly reference?: ScopedElementSource;
    readonly id: string; readonly root: OoxmlElement; readonly shape: OoxmlElement; readonly partName: string;
}
/**
 * Creates a local shape gradient from an already selected direct/layout/master source.
 * Whole stop lists retain their source scope; existing local gradient fields are untouched.
 * Theme placeholder colors retain authored choices and reference-before-stop transforms.
 *
 * @internal
 * @param {GradientMaterializationSource} target - Local slide shape.
 * @param {ReadonlyArray<GradientMaterializationSource>} sources - Exact matched inheritance tiers.
 * @param {GradientHostResult} selected - Canonical resolver result for this target.
 * @param {SecurityLimits} limits - Existing package limits.
 * @returns {boolean} Whether a local override was published.
 */
export function materializeShapeGradient(target: GradientMaterializationSource,

                                         sources: ReadonlyArray<GradientMaterializationSource>, selected: GradientHostResult,
                                         limits: SecurityLimits): boolean {
    const ns: string = shapeFillNamespace(target.shape, target.partName);
    const path: OoxmlElement[] = scopedElementPath({ root: target.root, node: target.shape }, limits, target.partName);
    const fail: (reason: string) => never = (reason: string): never => { throw new ScopedCloneError(reason, target.partName); };
    if (readUseBgFill(target.shape)) { fail('background-owned-gradient'); }
    if (selected.kind !== 'gradient') { return fail('not-gradient'); }
    if (selected.groupOwner && selected.groupOwner.id !== undefined && target.shape.localName !== 'grpSp') {
        fail('group-owned-gradient');
    }
    const source: GradientMaterializationSource | undefined = sources.find(
        (value: GradientMaterializationSource): boolean => value.id === selected.source);
    if (!source) { return fail('gradient-source-unavailable'); }
    const isLocal: boolean = source.root === target.root && source.shape === target.shape && source.gradient === undefined;
    const base: OoxmlElement | undefined = source.gradient || gradient(source.shape, ns);
    if (!base) { return fail('gradient-source-unavailable'); }
    if (base.namespaceUri !== ns) { return fail('gradient-dialect-mismatch'); }
    const local: OoxmlElement | undefined = gradient(target.shape, ns);
    const originalList: OoxmlElement | undefined = uniqueGradientChild(base, ns, 'gsLst');
    if (isLocal && originalList) { return false; }
    let copy: OoxmlElement = isLocal ? { ...base, children: base.children.slice() } :
        cloneScopedElement({ root: source.root, node: base, partName: source.partName },
                           { partName: target.partName, limits, depth: path.length + 2 });
    if (!originalList) {
        if (selected.gradient.stops.source.kind !== 'source') { return fail('gradient-stops-unavailable'); }
        const stopSourceId: string = selected.gradient.stops.source.id;
        const stopSource: GradientMaterializationSource | undefined = sources.find((value: GradientMaterializationSource): boolean =>
            value.id === stopSourceId);
        const stopGradient: OoxmlElement | undefined = stopSource && (stopSource.gradient || gradient(stopSource.shape, ns));
        const list: OoxmlElement | undefined = stopGradient && uniqueGradientChild(stopGradient, ns, 'gsLst');
        if (!stopSource || !list) { return fail('gradient-stops-unavailable'); }
        const copiedList: OoxmlElement = cloneScopedElement({ root: stopSource.root, node: list, partName: stopSource.partName },
                                                            { partName: target.partName, limits, depth: path.length + 3 });
        if (stopSource.gradient) { bindGradientPlaceholder(copiedList, stopSource.reference, target.partName, limits); }
        copy = { ...copy, children: [copiedList, ...copy.children] };
    }
    if (originalList && source.gradient) { bindGradientPlaceholder(copy, source.reference, target.partName, limits); }
    const properties: OoxmlElement | undefined = findShapeSpPr(target.shape);
    if (!properties) { return fail('gradient-host-unavailable'); }
    const scratchProperties: OoxmlElement = { ...properties, children: properties.children.slice() };
    const scratchShape: OoxmlElement = { ...target.shape, children: target.shape.children.map(
        (value: OoxmlElement | OoxmlText): OoxmlElement | OoxmlText => value === properties ? scratchProperties : value) };
    commitShapeFill(scratchShape, target.partName, copy);
    validateGradientReplacement(target.root, target.shape, scratchShape, target.partName, limits);
    if (local && isLocal) { asMutable(local).children = copy.children.slice(); }
    else { commitShapeFill(target.shape, target.partName, copy); }
    return true;
}
/** @param {OoxmlElement} shape - Exact native shape.
 * @param {string} ns - Target DrawingML namespace.
 * @returns {OoxmlElement | undefined} Unique direct native gradient. */
function gradient(shape: OoxmlElement, ns: string): OoxmlElement | undefined {
    const properties: OoxmlElement | undefined = findShapeSpPr(shape);
    if (properties === undefined) { return undefined; }
    const fills: ReadonlyArray<string> = ['noFill', 'solidFill', 'gradFill', 'blipFill', 'pattFill', 'grpFill'];
    if (properties.children.filter((value: OoxmlElement | OoxmlText): boolean => value.kind === 'element' &&
        value.namespaceUri === ns && fills.indexOf(value.localName) >= 0).length > 1) {
        throw new ScopedCloneError('ambiguous-gradient-source');
    }
    return uniqueGradientChild(properties, ns, 'gradFill');
}
/** Checks a detached replacement at its actual destination without publishing it.
 *
 * @internal
 * @param {OoxmlElement} root - Owning part root.
 * @param {OoxmlElement} node - Exact destination node.
 * @param {OoxmlElement} replacement - Detached candidate.
 * @param {string} partName - Destination part.
 * @param {SecurityLimits} limits - Existing package limits.
 * @returns {void} Throws before mutation if validation fails. */
export function validateGradientReplacement(root: OoxmlElement, node: OoxmlElement, replacement: OoxmlElement,
                                            partName: string, limits: SecurityLimits): void {
    const path: OoxmlElement[] = scopedElementPath({ root, node }, limits, partName);
    let candidate: OoxmlElement = replacement;
    for (let i: number = path.length - 2; i >= 0; i--) {
        const parent: OoxmlElement = arrayAt(path, i); const old: OoxmlElement = arrayAt(path, i + 1);
        const replacement: OoxmlElement = candidate;
        candidate = { ...parent, children: parent.children.map((value: OoxmlElement | OoxmlText): OoxmlElement | OoxmlText =>
            value === old ? replacement : value) };
    }
    const xml: string = serializeXml(candidate); const bytes: number = new TextEncoder().encode(xml).length;
    if (bytes > limits.singlePartUncompressedBytes) {
        throw new PackageLimitError('singlePartUncompressedBytes', { partName: partName, actual: bytes });
    }
    // Reparse before publication also validates actual destination depth and synthesized bindings.
    parseXml(xml, { limits, partName: partName });
}
