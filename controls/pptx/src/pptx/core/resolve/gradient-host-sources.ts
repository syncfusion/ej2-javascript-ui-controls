/** Canonical pure gradient selection and checked colors, reusable by live and wire host adapters. */
import { FillMatrixSelection } from '../theme/fill-matrix-reference';
import { AuthoredFillMatrixReference, selectAuthoredFillMatrixEntry } from '../theme/read-fill-reference';
import { GradientThemeStyles, GradientThemeStyle } from '../theme/gradient-theme-styles';
import { EffectiveColorContext } from '../theme/resolve-color';
import { GradientColorResult, resolveGradientStopColor } from '../layout/gradient-color-resolution';
import { EffectiveGradientFill, EffectiveGradientStop, GradientInheritanceSource } from './gradient-resolution-types';
import { resolveGradientFill } from './resolve-gradient';
import { arrayAt } from '../util/es5-compat';

/** Effective host result, distinct from direct getters and writer input. */
export interface GradientGroupOwner {
    /** Actual owning group id, absent only for malformed unidentified source groups. */
    readonly id: string | undefined;
    /** Owning package part; never inferred from shape names. */
    readonly partName: string | undefined;
    /** Referenced groups, nearest first, ending at the selected owner. */
    readonly chain: ReadonlyArray<string | undefined>;
}
/** Effective fill plus optional group-space ownership; direct getters remain authored. */
export type GradientHostResult = ({
    readonly kind: 'gradient';
    readonly source: string;
    readonly gradient: EffectiveGradientFill;
    readonly colors: ReadonlyArray<GradientColorResult>;
    readonly reference: AuthoredFillMatrixReference | undefined;
    readonly shadeToTitle: boolean | undefined;
    readonly diagnostics: ReadonlyArray<GradientHostDiagnostic>;
} | {
    readonly kind: 'missing' | 'none' | 'other' | 'invalid-reference';
    readonly source: string;
    readonly fillKind?: string;
    readonly reason?: string;
    readonly reference?: AuthoredFillMatrixReference;
    readonly shadeToTitle?: boolean;
}) & { readonly groupOwner?: GradientGroupOwner; };
/** A lower-priority reference that could not contribute to a selected gradient. */
export interface GradientHostDiagnostic {
    /** Source tier of the finding. */
    readonly source: string;
    /** Explicit reference-selection failure. */
    readonly reason: string;
}
export interface GradientHostSource extends GradientInheritanceSource {
    readonly reference?: AuthoredFillMatrixReference;
    readonly shadeToTitle?: boolean;
}

/**
 * Expands complete references and resolves applicable fields/colors without writeback.
 *
 * @param {ReadonlyArray<GradientHostSource>} inputs - Host-specific source tiers.
 * @param {GradientThemeStyles | undefined} theme - Loaded sparse matrices.
 * @param {EffectiveColorContext | undefined} colors - Current map/scheme.
 * @param {boolean} background - Whether the all-missing fallback is a white background.
 * @returns {GradientHostResult} Effective view with explicit invalid-reference separation.
 */
export function resolveGradientHostSources(
    inputs: ReadonlyArray<GradientHostSource>, theme: GradientThemeStyles | undefined,
    colors: EffectiveColorContext | undefined, background: boolean
): GradientHostResult {
    const sources: GradientInheritanceSource[] = [];
    const references: Map<string, AuthoredFillMatrixReference> = new Map<string, AuthoredFillMatrixReference>();
    const diagnostics: GradientHostDiagnostic[] = [];
    let selected: GradientHostSource | undefined;
    for (let i: number = 0; i < inputs.length; i++) {
        const input: GradientHostSource = arrayAt(inputs, i);
        let fill: GradientThemeStyle = input.fill;
        if (input.reference !== undefined) {
            references.set(input.id, input.reference);
            const selection: FillMatrixSelection<GradientThemeStyle> = selectAuthoredFillMatrixEntry(
                input.reference, theme === undefined ? undefined : theme.fills, theme === undefined ? undefined : theme.backgrounds
            );
            if (selection.kind === 'invalid') {
                if (selected === undefined) { return { kind: 'invalid-reference', source: input.id, reason: selection.reason, reference: input.reference }; }
                diagnostics.push({ source: input.id, reason: selection.reason }); continue;
            }
            fill = selection.kind === 'none' ? { kind: 'none' } : selection.style;
        }
        if (fill.kind === 'missing') { continue; }
        if (selected === undefined) {
            selected = { ...input, fill };
            if (fill.kind === 'none') { return { kind: 'none', source: input.id, reference: input.reference, shadeToTitle: input.shadeToTitle }; }
            if (fill.kind !== 'gradient') { return { kind: 'other', source: input.id, fillKind: fill.kind, shadeToTitle: input.shadeToTitle }; }
        }
        sources.push({ id: input.id, fill });
    }
    if (selected === undefined) {
        return background ? { kind: 'other', source: 'default', fillKind: 'solid', shadeToTitle: false } : { kind: 'missing', source: 'default' };
    }
    const gradient: EffectiveGradientFill | undefined = resolveGradientFill(sources);
    if (gradient === undefined) { return { kind: 'invalid-reference', source: selected.id, reason: 'invalid-gradient-selection' }; }
    const reference: AuthoredFillMatrixReference | undefined = gradient.stops.source.kind === 'source' ?
        references.get(gradient.stops.source.id) : undefined;
    return {
        kind: 'gradient', source: selected.id, gradient, reference, shadeToTitle: selected.shadeToTitle, diagnostics,
        colors: gradient.stops.values.map(
            (stop: EffectiveGradientStop): GradientColorResult => {
                return resolveGradientStopColor(stop.color, stop.colorTransforms, colors, reference);
            }
        )
    };
}
