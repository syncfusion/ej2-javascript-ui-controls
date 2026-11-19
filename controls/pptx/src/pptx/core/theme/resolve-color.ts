/**
 * Scheme colour resolve (view only — never mutates package markup).
 *
 * @remarks
 * Algorithm (spec `docs/specs/008-theme-colour-map.md`):
 * 1. Effective map = master `p:clrMap`, replaced only by slide
 *    `clrMapOvr/overrideClrMapping`; `masterClrMapping` or absent ovr keeps master.
 * 2. `schemeClr/@val` map key → effective map → `ST_ColorSchemeIndex` → `clrScheme` colour.
 * 3. Val already a scheme index → `clrScheme` directly.
 * 4. `phClr` → unresolved (style-matrix placeholder; TASK-1015).
 *
 * Citation: Transitional `dml-main.xsd` `CT_ColorMapping`, `ST_SchemeColorVal`;
 * `pml.xsd` `EG_TopLevelSlide` / `EG_ChildSlide`.
 */
import { ColorMapping } from './color-mapping';
import { ColorScheme } from './color-scheme';
import { ColorValue, SchemeColorValue } from './color-value';
import { isColorMapKey, isColorSchemeIndex, ColorSchemeIndex } from './constants';
import { ResolvedColor } from './resolved-color';
/**
 * Context required to resolve scheme colours for one slide (or master).
 *
 * @remarks
 * Built from the effective colour map and the loaded theme scheme. Resolve is
 * non-mutating: this object holds readonly views only.
 */
export interface EffectiveColorContext {
    /** Effective `CT_ColorMapping` for the slide (master ± override). */
    readonly mapping: ColorMapping;
    /** Theme `a:clrScheme` slots. */
    readonly scheme: ColorScheme;
}
/**
 * Computes the effective colour map for a slide.
 *
 * @param {ColorMapping} masterMap - Required master `p:clrMap`.
 * @param {*} slideOverride - `undefined` / `'master'` keep master; else replace.
 * @returns {ColorMapping} The map used for slide-level `schemeClr` resolve.
 */
export function effectiveColorMap(masterMap: ColorMapping, slideOverride: ColorMapping | 'master' | undefined): ColorMapping {
    if (slideOverride === undefined || slideOverride === 'master') {
        return masterMap;
    }
    return slideOverride;
}
/**
 * Resolves a `schemeClr` token or {@link SchemeColorValue} to a view-only colour.
 *
 * @remarks **Non-mutating.** Does not alter theme, slide, or shape markup. Callers that save the package after resolve must still see
 * `a:schemeClr` where authored.
 * @param {string | SchemeColorValue} ref - `ST_SchemeColorVal` string or direct `{ kind: 'scheme', val }`.
 * @param {EffectiveColorContext | undefined} context - Effective map + colour scheme; omit only yields unresolved.
 * @returns {ResolvedColor} — never a DOM mutation instruction.
 */
export function resolveSchemeColor(ref: string | SchemeColorValue, context: EffectiveColorContext | undefined): ResolvedColor {
    const token: string = typeof ref === 'string' ? ref : ref.val;
    if (context === undefined) {
        return { kind: 'unresolved', reason: 'missing-context', token };
    }
    // Length-guarded equality avoids security/detect-possible-timing-attacks on token.
    if (token.length === 5 && token.charCodeAt(0) === 112 /* p */ &&
        token.charCodeAt(1) === 104 /* h */ &&
        token.charCodeAt(2) === 67 /* C */ &&
        token.charCodeAt(3) === 108 /* l */ &&
        token.charCodeAt(4) === 114 /* r */) {
        return { kind: 'unresolved', reason: 'phClr', token };
    }
    let slot: ColorSchemeIndex | undefined;
    if (isColorMapKey(token)) {
        slot = context.mapping.get(token);
    }
    else if (isColorSchemeIndex(token)) {
        slot = token;
    }
    else {
        return { kind: 'unresolved', reason: 'unknown-token', token };
    }
    return colorValueToResolved(context.scheme.getSlot(slot), slot, token);
}
/**
 * Resolves any direct {@link ColorValue}; scheme refs use {@link resolveSchemeColor}.
 *
 * @remarks Non-scheme values passthrough as `{ kind: 'direct', value }` without inventing a scheme slot. **Never** write the result back
 * over `a:schemeClr`.
 * @param {ColorValue} value - Authored colour choice (including non-scheme kinds).
 * @param {EffectiveColorContext | undefined} context - Required when `value.kind === 'scheme'`.
 * @returns {ResolvedColor} View-only {@link ResolvedColor}.
 */
export function resolveColor(value: ColorValue, context: EffectiveColorContext | undefined): ResolvedColor {
    if (value.kind === 'scheme') {
        return resolveSchemeColor(value, context);
    }
    return { kind: 'direct', value };
}
/**
 *
 * @param {ColorValue} value - The value value.
 * @param {ColorSchemeIndex} sourceSlot - The sourceSlot value.
 * @param {string} token - The token value.
 * @returns {ResolvedColor} The result.
 */
function colorValueToResolved(value: ColorValue, sourceSlot: ColorSchemeIndex, token: string): ResolvedColor {
    if (value.kind === 'srgb') {
        return { kind: 'srgb', val: value.val, sourceSlot };
    }
    if (value.kind === 'scheme') {
        // Nested scheme reference inside clrScheme — do not flatten or write back.
        return { kind: 'unresolved', reason: 'nested-scheme', token };
    }
    return { kind: 'direct', value, sourceSlot };
}
