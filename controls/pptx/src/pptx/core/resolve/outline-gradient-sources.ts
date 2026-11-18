/** Office-specific line matrix resolution; never selects fill/background matrix entries. */
import { GradientThemeStyle } from '../theme/gradient-theme-styles';
import { AuthoredLineMatrixReference } from '../theme/read-fill-reference';
import { EffectiveColorContext } from '../theme/resolve-color';
import { GradientHostResult, GradientHostDiagnostic } from './gradient-host-sources';
import { EffectiveGradientFill, EffectiveGradientStop, GradientInheritanceSource } from './gradient-resolution-types';
import { resolveGradientFill } from './resolve-gradient';
import { GradientColorResult, resolveGradientStopColor } from '../layout/gradient-color-resolution';
import { arrayAt } from '../util/es5-compat';
/** Caller supplies actual source tiers; placeholder matching stays in the host bridge. @internal */
export interface OutlineGradientSource {
    readonly id: string;
    readonly fill: GradientThemeStyle;
    readonly reference?: AuthoredLineMatrixReference;
}
type LineSelection = { readonly kind: 'style'; readonly fill: GradientThemeStyle; } |
{ readonly kind: 'invalid'; readonly reason: string; };
/**
 * Resolves ordered direct/style/layout/master outline sources without source writeback.
 *
 * @remarks MS-OI29500§2.1.1264a selects lnStyleLst, correcting the ECMA lnRef
 * description. The named Office policy treats0/1000 as no-line references,
 * consistent with the existing .NET Shape.GetLineWidthFromStyle route. No1001
 * background-fill offset is used. Reference transforms apply only to phClr stops
 * originating in the selected style; direct phClr retains its unresolved context.
 * @param {ReadonlyArray<OutlineGradientSource>} inputs - Highest to lowest actual source tiers.
 * @param {ReadonlyArray<GradientThemeStyle>} lineStyles - Independent sparse lnStyleLst; undefined means unavailable.
 * @param {EffectiveColorContext} colors - Current scheme/map context, if available.
 * @returns {GradientHostResult} Checked canonical paint with explicit reference failures.
 * @internal
 */
export function resolveOutlineGradientSources(
    inputs: ReadonlyArray<OutlineGradientSource>, lineStyles: ReadonlyArray<GradientThemeStyle> | undefined,
    colors?: EffectiveColorContext
): GradientHostResult {
    const sources: GradientInheritanceSource[] = [];
    const references: Map<string, AuthoredLineMatrixReference> = new Map<string, AuthoredLineMatrixReference>();
    const diagnostics: GradientHostDiagnostic[] = [];
    let selected: string | undefined;
    let barrier: boolean = false;
    for (const input of inputs) {
        if (barrier) { break; }
        for (let phase: number = 0; phase < 2; phase++) {
            const id: string = input.id + (phase === 0 ? '' : '-style');
            let fill: GradientThemeStyle = input.fill;
            if (phase === 1) {
                if (input.reference === undefined) { continue; }
                const entry: LineSelection = selectLine(input.reference, lineStyles);
                if (entry.kind === 'invalid') {
                    if (selected === undefined) { return { kind: 'invalid-reference', source: id, reason: entry.reason }; }
                    diagnostics.push({ source: id, reason: entry.reason }); continue;
                }
                fill = entry.fill; references.set(id, input.reference);
            }
            if (fill.kind === 'missing') { continue; }
            if (selected === undefined) {
                selected = id;
                if (fill.kind === 'none') { return { kind: 'none', source: id }; }
                if (fill.kind !== 'gradient') { return { kind: 'other', source: id, fillKind: fill.kind }; }
            }
            sources.push({ id, fill });
            if (fill.kind !== 'gradient') { barrier = true; break; }
        }
    }
    if (selected === undefined) { return { kind: 'missing', source: 'outline-default' }; }
    const gradient: EffectiveGradientFill | undefined = resolveGradientFill(sources);
    if (gradient === undefined) { return { kind: 'invalid-reference', source: selected, reason: 'invalid-outline-gradient' }; }
    const reference: AuthoredLineMatrixReference | undefined = gradient.stops.source.kind === 'source' ?
        references.get(gradient.stops.source.id) : undefined;
    return { kind: 'gradient', source: selected, gradient, reference: undefined, shadeToTitle: undefined, diagnostics,
        colors: gradient.stops.values.map((stop: EffectiveGradientStop): GradientColorResult =>
            resolveGradientStopColor(stop.color, stop.colorTransforms, colors, reference)) };
}
/**
 * @param {AuthoredLineMatrixReference} reference - Complete raw line reference.
 * @param {ReadonlyArray<GradientThemeStyle>} styles - Only lnStyleLst entries.
 * @returns {LineSelection} Named Office selection or bounded failure.
 */
function selectLine(reference: AuthoredLineMatrixReference, styles: ReadonlyArray<GradientThemeStyle> | undefined): LineSelection {
    if (reference.index.kind !== 'value') {
        return { kind: 'invalid', reason: reference.index.kind === 'absent' ? 'missing-line-index' : 'invalid-line-index' };
    }
    const index: number = reference.index.value;
    if (!Number.isInteger(index) || index < 0 || index > 4294967295) { return { kind: 'invalid', reason: 'invalid-line-index' }; }
    if (index === 0 || index === 1000) { return { kind: 'style', fill: { kind: 'none' } }; }
    if (styles === undefined) { return { kind: 'invalid', reason: 'line-list-unavailable' }; }
    const fill: GradientThemeStyle | undefined = arrayAt(styles, index - 1);
    return fill === undefined ? { kind: 'invalid', reason: 'line-index-out-of-range' } : { kind: 'style', fill };
}
