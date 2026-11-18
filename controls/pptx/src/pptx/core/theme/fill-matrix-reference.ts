/** Fill-matrix selection: ECMA-376 Part 1 19.3.1.3 and 20.1.4.2.10. */
import { arrayAt } from '../util/es5-compat';

/** Fill-reference context; line references use lnStyleLst separately. @internal */
export type FillMatrixReferenceKind = 'fillRef' | 'bgRef';
/** Structured reference failure; never clamp a bad index to a style. @internal */
export type FillMatrixReferenceFailure = 'missing-index' | 'invalid-index' | 'missing-theme-list' | 'out-of-range';
/** Generic so complete authored entries and legacy projections share index semantics. @internal */
export type FillMatrixSelection<T> = {
    readonly kind: 'none';
    readonly referenceKind: FillMatrixReferenceKind;
    readonly index: number;
} | {
    readonly kind: 'invalid';
    readonly referenceKind: FillMatrixReferenceKind;
    readonly index: number | undefined;
    readonly reason: FillMatrixReferenceFailure;
} | {
    readonly kind: 'style';
    readonly referenceKind: FillMatrixReferenceKind;
    readonly index: number;
    readonly list: 'fill' | 'background';
    /** Zero-based index into the identified list. */
    readonly listIndex: number;
    /** Read-only view of the selected entry; never normalized or mutated. */
    readonly style: T;
};

/**
 * Selects a fill style using the two independent format-scheme lists.
 *
 * @remarks 0/1000 are explicit no-fill sentinels, 1..999 index fillStyleLst,
 * and 1001+ index bgFillStyleLst after subtracting 1001. Sentinels need no
 * theme. Missing/invalid/out-of-bounds references remain diagnostic results.
 * Do not use this helper for lnRef, which indexes lnStyleLst independently.
 * @template T
 * @param {FillMatrixReferenceKind} referenceKind - fillRef or bgRef owner.
 * @param {number | undefined} index - Parsed ST_StyleMatrixColumnIndex (unsignedInt).
 * @param {ReadonlyArray<T> | undefined} fillStyles - fillStyleLst, or unavailable theme list.
 * @param {ReadonlyArray<T> | undefined} backgroundStyles - Independent bgFillStyleLst.
 * @returns {FillMatrixSelection<T>} Sentinel, selected style or explicit failure.
 * @internal
 */
export function selectFillMatrixEntry<T>(
    referenceKind: FillMatrixReferenceKind, index: number | undefined,
    fillStyles: ReadonlyArray<T> | undefined, backgroundStyles: ReadonlyArray<T> | undefined
): FillMatrixSelection<T> {
    if (index === undefined) { return { kind: 'invalid', referenceKind, index, reason: 'missing-index' }; }
    if (!Number.isFinite(index) || Math.floor(index) !== index || index < 0 || index > 4294967295) {
        return { kind: 'invalid', referenceKind, index, reason: 'invalid-index' };
    }
    if (index === 0 || index === 1000) { return { kind: 'none', referenceKind, index }; }
    const list: 'fill' | 'background' = index < 1000 ? 'fill' : 'background';
    const styles: ReadonlyArray<T> | undefined = list === 'fill' ? fillStyles : backgroundStyles;
    const listIndex: number = list === 'fill' ? index - 1 : index - 1001;
    if (styles === undefined) { return { kind: 'invalid', referenceKind, index, reason: 'missing-theme-list' }; }
    if (listIndex >= styles.length) { return { kind: 'invalid', referenceKind, index, reason: 'out-of-range' }; }
    return { kind: 'style', referenceKind, index, list, listIndex, style: arrayAt(styles, listIndex) };
}
