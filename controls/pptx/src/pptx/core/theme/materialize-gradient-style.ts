import { OoxmlElement, OoxmlText } from '../xml/dom';
import { ScopedElementSource, ScopedCloneError } from '../xml/clone-scoped-element';
import { readFillMatrixReference, selectAuthoredFillMatrixEntry, AuthoredFillMatrixReference } from './read-fill-reference';
import { FillMatrixSelection } from './fill-matrix-reference';
import { getGradientDrawingNamespace } from './read-gradient';
import { uniqueGradientChild } from '../shapes/gradient-materialization-dom';
/** Actual selected style XML and reference color; no effective color/default projection. @internal */
export interface GradientStyleSource {
    readonly gradient: OoxmlElement;
    readonly reference: ScopedElementSource | undefined;
}
/**
 * Selects a raw theme style with the canonical independent fill/background index policy.
 *
 * @internal
 * @param {OoxmlElement} root - Owning loaded theme root.
 * @param {ScopedElementSource} reference - Exact fillRef/bgRef source scope.
 * @returns {GradientStyleSource} Authored gradient and optional authored placeholder color.
 */
export function selectGradientStyleSource(root: OoxmlElement, reference: ScopedElementSource): GradientStyleSource {
    const ns: string | undefined = getGradientDrawingNamespace(root.namespaceUri);
    if (!ns) { throw new ScopedCloneError('theme-namespace', reference.partName); }
    const elements: OoxmlElement | undefined = uniqueGradientChild(root, ns, 'themeElements');
    const format: OoxmlElement | undefined = elements && uniqueGradientChild(elements, ns, 'fmtScheme');
    const fills: OoxmlElement | undefined = format && uniqueGradientChild(format, ns, 'fillStyleLst');
    const backgrounds: OoxmlElement | undefined = format && uniqueGradientChild(format, ns, 'bgFillStyleLst');
    const parsed: AuthoredFillMatrixReference | undefined = readFillMatrixReference(reference.node, reference.partName);
    if (!parsed) { throw new ScopedCloneError('gradient-reference-unavailable', reference.partName); }
    const selection: FillMatrixSelection<OoxmlElement> = selectAuthoredFillMatrixEntry(
        parsed,

        fills === undefined ? undefined : nativeChildren(fills, ns),
        backgrounds === undefined ? undefined : nativeChildren(backgrounds, ns));
    if (selection.kind !== 'style' || selection.style.localName !== 'gradFill') {
        throw new ScopedCloneError('gradient-reference-unavailable', reference.partName);
    }
    const choices: ReadonlyArray<string> = [
        'srgbClr', 'scrgbClr', 'hslClr', 'sysClr', 'schemeClr', 'prstClr'
    ];
    const colors: OoxmlElement[] = nativeChildren(reference.node, ns).filter(
        (value: OoxmlElement): boolean =>
            choices.indexOf(value.localName) >= 0);
    if (colors.length > 1) { throw new ScopedCloneError('ambiguous-reference-color', reference.partName); }
    return { gradient: selection.style, reference: colors[0] === undefined ? undefined :
        { root: reference.root, node: colors[0], partName: reference.partName } };
}
/** @param {OoxmlElement} parent - Exact style carrier.
 * @param {string} ns - Owning DrawingML namespace.
 * @returns {OoxmlElement[]} Native children in original slot order, including unknown barriers. */
function nativeChildren(parent: OoxmlElement, ns: string): OoxmlElement[] {
    return parent.children.filter((value: OoxmlElement | OoxmlText): value is OoxmlElement =>
        value.kind === 'element' && value.namespaceUri === ns);
}
