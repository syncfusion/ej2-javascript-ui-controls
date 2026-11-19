/**
 * Pure sparse gradient inheritance, MS-OI29500 2.1.1284 and CT_RelativeRect.
 * Host adapters supply applicable sources; this module does not invent a universal
 * shape/text/background traversal. No resolved value is written to source XML.
 */
import { arrayAt } from '../util/es5-compat';
import { AuthoredGradientFill, AuthoredGradientRectangle, AuthoredGradientStop, GradientTileFlip } from '../theme/gradient-types';
import { GradientLexical } from '../theme/gradient-values';
import { ThemeGradientPath } from '../theme/theme-render-model';
import { EffectiveGradientFill, EffectiveGradientRectangle, EffectiveGradientShade, EffectiveGradientStop,
    EffectiveGradientValue, GradientInheritanceSource, GradientValueSource } from './gradient-resolution-types';

/** One compatible gradient contributor. */
interface Contributor { readonly id: string; readonly fill: AuthoredGradientFill; }
/** Whole selected rectangle and its owning source. */
interface RectangleSource { readonly id: string; readonly rectangle: AuthoredGradientRectangle; }

/**
 * Resolves applicable same-type fields, then Office/schema defaults.
 *
 * @remarks First non-missing fill selects the choice. A different selected fill
 * returns undefined. Later incompatible fills/shades cannot contribute their
 * fields, but do not erase the selected target or suppress later compatible
 * passes (M1 footnote 1). Lists inherit whole (footnote 2); present rectangles
 * use schema edge defaults (footnote 3). Invalid tokens remain invalid.
 * @param {ReadonlyArray<GradientInheritanceSource>} sources - Applicable host tiers, highest priority first.
 * @returns {EffectiveGradientFill | undefined} Effective gradient or a non-gradient/missing selection.
 * @internal
 */
export function resolveGradientFill(sources: ReadonlyArray<GradientInheritanceSource>): EffectiveGradientFill | undefined {
    const contributors: Contributor[] = [];
    let selected: boolean = false;
    for (let i: number = 0; i < sources.length; i++) {
        const source: GradientInheritanceSource = arrayAt(sources, i);
        if (source.fill.kind === 'missing') { continue; }
        if (!selected) {
            if (source.fill.kind !== 'gradient') { return undefined; }
            selected = true;
        }
        if (source.fill.kind === 'gradient') { contributors.push({ id: source.id, fill: source.fill }); }
    }
    if (contributors.length === 0) { return undefined; }
    const first: Contributor = arrayAt(contributors, 0);
    const shadeSource: Contributor | undefined = contributors.filter((item: Contributor): boolean => item.fill.shade !== undefined)[0];
    const shadeKind: 'linear' | 'path' = shadeSource !== undefined && shadeSource.fill.shade !== undefined ?
        shadeSource.fill.shade.kind : 'linear';
    const compatible: Contributor[] = contributors.filter((item: Contributor): boolean =>
        item.fill.shade !== undefined && item.fill.shade.kind === shadeKind);
    const shadeProvenance: GradientValueSource = shadeSource === undefined ? office() : sourceValue(shadeSource.id);
    let shade: EffectiveGradientShade;
    if (shadeKind === 'linear') {
        shade = {
            kind: 'linear', source: shadeProvenance,
            angle: select(compatible, (item: Contributor): GradientLexical<number> =>
                item.fill.shade !== undefined && item.fill.shade.kind === 'linear' ? item.fill.shade.angle : absent<number>(), 0),
            scaled: select(compatible, (item: Contributor): GradientLexical<boolean> =>
                item.fill.shade !== undefined && item.fill.shade.kind === 'linear' ? item.fill.shade.scaled : absent<boolean>(), false)
        };
    } else {
        const focus: RectangleSource | undefined = firstRectangle(compatible, (item: Contributor): AuthoredGradientRectangle | undefined =>
            item.fill.shade !== undefined && item.fill.shade.kind === 'path' ? item.fill.shade.fillToRect : undefined);
        shade = {
            kind: 'path', source: shadeProvenance,
            path: select(compatible, (item: Contributor): GradientLexical<ThemeGradientPath> =>
                item.fill.shade !== undefined && item.fill.shade.kind === 'path' ? item.fill.shade.path : absent<ThemeGradientPath>(), 'shape'),
            fillToRect: focus === undefined ? defaultRectangle(0.5) : resolveRectangle(focus)
        };
    }
    const listSource: Contributor | undefined = contributors.filter((item: Contributor): boolean => item.fill.stops !== undefined)[0];
    const stops: EffectiveGradientStop[] = [];
    if (listSource !== undefined && listSource.fill.stops !== undefined) {
        for (let i: number = 0; i < listSource.fill.stops.length; i++) {
            const stop: AuthoredGradientStop = arrayAt(listSource.fill.stops, i);
            stops.push({ position: lexical(stop.position, listSource.id), color: stop.color, colorTransforms: stop.colorTransforms });
        }
    } else {
        stops.push({ position: defaultValue(0), color: { kind: 'srgb', val: '000000' }, colorTransforms: [] });
        stops.push({ position: defaultValue(1), color: { kind: 'srgb', val: 'FFFFFF' }, colorTransforms: [] });
    }
    const tile: RectangleSource | undefined = firstRectangle(
        contributors, (item: Contributor): AuthoredGradientRectangle | undefined => item.fill.tileRect
    );
    const diagnostics: { source: string; diagnostic: AuthoredGradientFill['diagnostics'][number]; }[] = [];
    for (let i: number = 0; i < contributors.length; i++) {
        const item: Contributor = arrayAt(contributors, i);
        for (let j: number = 0; j < item.fill.diagnostics.length; j++) {
            diagnostics.push({ source: item.id, diagnostic: arrayAt(item.fill.diagnostics, j) });
        }
    }
    return {
        kind: 'gradient', source: sourceValue(first.id), shade,
        stops: { values: stops, source: listSource === undefined ? office() : sourceValue(listSource.id) },
        rotateWithShape: select(contributors, (item: Contributor): GradientLexical<boolean> => item.fill.rotateWithShape, true),
        flip: select<GradientTileFlip>(contributors, (item: Contributor): GradientLexical<GradientTileFlip> => item.fill.flip, 'none'),
        tileRect: tile === undefined ? undefined : resolveRectangle(tile), diagnostics
    };
}

/**
 * Selects the first present lexical field, then its Office default.
 *
 * @template T
 *
 * @param {ReadonlyArray<Contributor>} sources - Compatible tiers.
 * @param {Function} read - Field getter.
 * @param {T} fallback - Office base value after all tiers.
 * @returns {EffectiveGradientValue<T>} Value or invalid token with provenance.
 */
function select<T>(
    sources: ReadonlyArray<Contributor>, read: (item: Contributor) => GradientLexical<T>, fallback: T
): EffectiveGradientValue<T> {
    for (let i: number = 0; i < sources.length; i++) {
        const item: Contributor = arrayAt(sources, i);
        const value: GradientLexical<T> = read(item);
        if (value.kind !== 'absent') { return lexical(value, item.id); }
    }
    return defaultValue(fallback);
}
/**
 * Maps a present token without losing invalidity. Missing required stop positions stay invalid.
 *
 * @template T
 * @param {GradientLexical<T>} value - Direct field.
 * @param {string} id - Owning source.
 * @returns {EffectiveGradientValue<T>} Effective view without authored mutation.
 */
function lexical<T>(value: GradientLexical<T>, id: string): EffectiveGradientValue<T> {
    if (value.kind === 'absent') { return { kind: 'absent', source: sourceValue(id) }; }
    return value.kind === 'value' ? { kind: 'value', value: value.value, source: sourceValue(id) } :
        { kind: 'invalid', raw: value.raw, source: sourceValue(id) };
}
/**
 * Finds one whole rectangle; empty rectangles block inheritance.
 *
 * @param {ReadonlyArray<Contributor>} sources - Compatible sources.
 * @param {Function} read - Rectangle getter.
 * @returns {RectangleSource | undefined} First present rectangle.
 */
function firstRectangle(
    sources: ReadonlyArray<Contributor>, read: (item: Contributor) => AuthoredGradientRectangle | undefined
): RectangleSource | undefined {
    for (let i: number = 0; i < sources.length; i++) {
        const item: Contributor = arrayAt(sources, i);
        const rectangle: AuthoredGradientRectangle | undefined = read(item);
        if (rectangle !== undefined) { return { id: item.id, rectangle }; }
    }
    return undefined;
}
/**
 * Applies CT_RelativeRect zero defaults only inside a present rectangle.
 *
 * @param {RectangleSource} input - Whole selected rectangle.
 * @returns {EffectiveGradientRectangle} Edge values with schema provenance.
 */
function resolveRectangle(input: RectangleSource): EffectiveGradientRectangle {
    const edge: (value: GradientLexical<number>) => EffectiveGradientValue<number> =
        (value: GradientLexical<number>): EffectiveGradientValue<number> =>
            value.kind === 'absent' ? { kind: 'value', value: 0, source: { kind: 'schema-default', id: input.id } } : lexical(value, input.id);
    return {
        left: edge(input.rectangle.left), top: edge(input.rectangle.top),
        right: edge(input.rectangle.right), bottom: edge(input.rectangle.bottom)
    };
}
/**
 * Supplies an Office missing-focus rectangle, distinct from a present empty element.
 *
 * @param {number} value - Office edge ratio.
 * @returns {EffectiveGradientRectangle} All four default edges.
 */
function defaultRectangle(value: number): EffectiveGradientRectangle {
    return { left: defaultValue(value), top: defaultValue(value), right: defaultValue(value), bottom: defaultValue(value) };
}
/**
 * Identifies an Office base default.
 *
 * @returns {GradientValueSource} Office default provenance.
 */
function office(): GradientValueSource { return { kind: 'office-default' }; }
/**
 * Identifies an authored source tier.
 *
 * @param {string} id - Caller-owned source identity.
 * @returns {GradientValueSource} Authored provenance.
 */
function sourceValue(id: string): GradientValueSource { return { kind: 'source', id }; }
/**
 * Supplies a view-only Office default without a fabricated XML token.
 *
 * @template T
 * @param {T} value - Base default.
 * @returns {EffectiveGradientValue<T>} Default value with provenance.
 */
function defaultValue<T>(value: T): EffectiveGradientValue<T> { return { kind: 'value', value, source: office() }; }
/**
 * Supplies an internal absent sentinel for a narrowed choice.
 *
 * @template T
 * @returns {GradientLexical<T>} Absent value.
 */
function absent<T>(): GradientLexical<T> { return { kind: 'absent' }; }
