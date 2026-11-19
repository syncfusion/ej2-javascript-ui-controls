/**
 * View-only resolved colour types (never serialized over `schemeClr`).
 */
import { ColorSchemeIndex } from './constants';
import { ColorValue } from './color-value';
/**
 * Why a scheme reference could not be resolved to a concrete scheme colour.
 */
export type UnresolvedColorReason = 'phClr' | 'missing-context' | 'unknown-token' | 'nested-scheme';
/**
 * Resolved colour **view** produced by {@link resolveColor} / {@link resolveSchemeColor}.
 *
 * @remarks
 * This type is intentionally **distinct** from {@link ColorValue} and from
 * scheme-ref direct values. Callers must not treat a resolved RGB view as the
 * authored colour, and serializers must never replace `a:schemeClr` with
 * `a:srgbClr` because a resolve was performed.
 *
 * - `srgb` — scheme slot held a direct `srgbClr`
 * - `direct` — scheme slot (or passthrough) held another non-scheme `ColorValue`
 * - `unresolved` — `phClr`, missing map/scheme context, unknown token, or nested `schemeClr`
 */
export type ResolvedColor = ResolvedSrgbColor | ResolvedDirectColor | UnresolvedColor;
/**
 * Resolved sRGB view of a scheme slot.
 */
export interface ResolvedSrgbColor {
    /** Discriminant for a resolved sRGB colour view. */
    readonly kind: 'srgb';
    /** Six hex digits without `#`. */
    readonly val: string;
    /** Scheme slot the map (or direct index) selected. */
    readonly sourceSlot: ColorSchemeIndex;
}
/**
 * Resolved non-sRGB colour view (scheme slot or non-scheme passthrough).
 */
export interface ResolvedDirectColor {
    /** Discriminant for a resolved non-sRGB direct colour view. */
    readonly kind: 'direct';
    /** Authored colour (sys, prst, scrgb, …) — not a nested scheme ref. */
    readonly value: ColorValue;
    /**
     * Scheme slot when this came from `clrScheme`; omitted for non-scheme
     * {@link resolveColor} passthrough.
     */
    readonly sourceSlot?: ColorSchemeIndex;
}
/**
 * Explicit unresolved result — not an exception for expected cases like `phClr`.
 */
export interface UnresolvedColor {
    /** Discriminant for an unresolved colour reference result. */
    readonly kind: 'unresolved';
    /** Why the scheme reference could not be resolved (phClr, missing context, …). */
    readonly reason: UnresolvedColorReason;
    /** Original `schemeClr/@val` or reference token when known. */
    readonly token: string | undefined;
}
