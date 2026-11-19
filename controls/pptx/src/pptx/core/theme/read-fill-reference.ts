/** Complete authored fillRef/bgRef data; ECMA-376 Part 1 19.3.1.3, 20.1.4.2.10. */
import { OoxmlElement, OoxmlText } from '../xml/dom';
import { getAttr } from '../shapes/dom-utils';
import { arrayAt } from '../util/es5-compat';
import { ColorValue } from './color-value';
import { GradientReadDiagnostic } from './gradient-types';
import { GradientDialect, GradientLexical } from './gradient-values';
import { getGradientDrawingNamespace, readGradientColorTransforms } from './read-gradient';
import { tryParseColorChoiceChild } from './parse-color-choice';
import { ThemeColorTransform } from './theme-render-model';
import { FillMatrixReferenceKind, FillMatrixSelection, selectFillMatrixEntry } from './fill-matrix-reference';

/** Shared lexical/color context; indexing policies remain reference-specific. @internal */
export interface AuthoredMatrixReferenceData {
    readonly index: GradientLexical<number>;
    readonly color: ColorValue | undefined;
    readonly colorTransforms: ReadonlyArray<ThemeColorTransform>;
    readonly diagnostics: ReadonlyArray<GradientReadDiagnostic>;
}
/** Clone-safe fill/background reference; no fallback index or resolved RGB. @internal */
export interface AuthoredFillMatrixReference extends AuthoredMatrixReferenceData {
    /** Fill/background indexing is distinct from line indexing. */
    readonly kind: FillMatrixReferenceKind;
}
/** Complete line-style reference; do not pass through the fill matrix selector. @public */
export interface AuthoredLineMatrixReference extends AuthoredMatrixReferenceData {
    readonly kind: 'lnRef';
}
/**
 * Reads references in their actual namespace scope without changing source XML.
 *
 * @param {OoxmlElement} element - Candidate fillRef or bgRef.
 * @param {string} partName - Optional owning OPC part for diagnostics.
 * @returns {AuthoredFillMatrixReference | undefined} Direct reference or foreign/unrelated element.
 * @internal
 */
export function readFillMatrixReference(element: OoxmlElement, partName?: string): AuthoredFillMatrixReference | undefined {
    const ns: string | undefined = getGradientDrawingNamespace(element.namespaceUri);
    const fill: boolean = element.localName === 'fillRef' && element.namespaceUri === ns;
    const background: boolean = element.localName === 'bgRef' &&
        (element.namespaceUri === 'http://schemas.openxmlformats.org/presentationml/2006/main' ||
        element.namespaceUri === 'http://purl.oclc.org/ooxml/presentationml/main');
    if (ns === undefined || (!fill && !background)) { return undefined; }
    const kind: FillMatrixReferenceKind = fill ? 'fillRef' : 'bgRef';
    return { kind, ...readMatrixReferenceData(element, ns, kind, partName) };
}
/**
 * @param {OoxmlElement} element - Candidate actual DrawingML lnRef.
 * @param {string} partName - Source identity for diagnostics.
 * @returns {AuthoredLineMatrixReference | undefined} Complete context, with raw index state.
 * @internal
 */
export function readLineMatrixReference(element: OoxmlElement, partName?: string): AuthoredLineMatrixReference | undefined {
    const ns: string | undefined = getGradientDrawingNamespace(element.namespaceUri);
    if (element.localName !== 'lnRef' || ns !== element.namespaceUri) { return undefined; }
    return { kind: 'lnRef', ...readMatrixReferenceData(element, ns, 'lnRef', partName) };
}
/**
 * @param {OoxmlElement} element - Exact namespace-scoped reference.
 * @param {string} ns - Owning DrawingML namespace.
 * @param {string} kind - Reference diagnostic label; does not select a matrix.
 * @param {string} partName - Owning part.
 * @returns {AuthoredMatrixReferenceData} Shared scalar/color context without changing source.
 */
function readMatrixReferenceData(
    element: OoxmlElement, ns: string, kind: string, partName: string | undefined
): AuthoredMatrixReferenceData {
    const index: GradientLexical<number> = parseIndex(getAttr(element, '', 'idx'));
    const diagnostics: GradientReadDiagnostic[] = [];
    if (index.kind !== 'value') {
        diagnostics.push({ field: kind + '/@idx', stopIndex: undefined, message: 'Missing or invalid unsigned style index.', partName });
    }
    const color: ColorValue | undefined = tryParseColorChoiceChild(element, ns);
    const choices: OoxmlElement[] = [];
    for (let i: number = 0; i < element.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(element.children, i);
        if (child.kind === 'element' && child.namespaceUri === ns && isColorChoice(child.localName)) { choices.push(child); }
    }
    if (choices.length > 1 || (choices.length > 0 && color === undefined)) {
        diagnostics.push({ field: kind + '/color', stopIndex: undefined, message: 'Invalid or multiple reference color choices.', partName });
    }
    const dialect: GradientDialect = ns === 'http://purl.oclc.org/ooxml/drawingml/main' ? 'strict' : 'transitional';
    return {
        index, color, diagnostics,
        colorTransforms: readGradientColorTransforms(choices.length ? arrayAt(choices, 0) : undefined, ns, dialect)
    };
}
/**
 * Selects a matrix entry without coercing a missing/invalid raw index to zero.
 *
 * @template T
 * @param {AuthoredFillMatrixReference} reference - Complete direct reference.
 * @param {ReadonlyArray<T> | undefined} fills - Independent fillStyleLst.
 * @param {ReadonlyArray<T> | undefined} backgrounds - Independent bgFillStyleLst.
 * @returns {FillMatrixSelection<T>} Selection or an explicit reference diagnostic.
 * @internal
 */
export function selectAuthoredFillMatrixEntry<T>(
    reference: AuthoredFillMatrixReference, fills: ReadonlyArray<T> | undefined, backgrounds: ReadonlyArray<T> | undefined
): FillMatrixSelection<T> {
    if (reference.index.kind === 'invalid') {
        return { kind: 'invalid', referenceKind: reference.kind, index: undefined, reason: 'invalid-index' };
    }
    return selectFillMatrixEntry(reference.kind, reference.index.kind === 'value' ? reference.index.value : undefined, fills, backgrounds);
}
/**
 * Parses XML unsignedInt lexemes completely, retaining their source spelling.
 *
 * @param {string | undefined} raw - Direct idx value.
 * @returns {GradientLexical<number>} Missing, invalid, or valid unsigned index.
 */
function parseIndex(raw: string | undefined): GradientLexical<number> {
    if (raw === undefined) { return { kind: 'absent' }; }
    const token: string = raw.replace(/^[ \t\r\n]+/, '').replace(/[ \t\r\n]+$/, '');
    const value: number = Number(token);
    return /^[+-]?[0-9]+$/.test(token) && Number.isFinite(value) && value >= 0 && value <= 4294967295 ?
        { kind: 'value', raw, value: value === 0 ? 0 : value } : { kind: 'invalid', raw };
}
/**
 * Identifies the six DrawingML color-choice elements.
 *
 * @param {string} name - Case-sensitive local name.
 * @returns {boolean} Whether the element is a color choice.
 */
function isColorChoice(name: string): boolean {
    return name === 'srgbClr' || name === 'scrgbClr' || name === 'hslClr' ||
        name === 'sysClr' || name === 'schemeClr' || name === 'prstClr';
}
