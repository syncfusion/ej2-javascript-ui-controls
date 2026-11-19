/** Checked gradient paint colors layered over shared semantic/color-transform services. */
import { ColorValue } from '../theme/color-value';
import { EffectiveColorContext, resolveColor } from '../theme/resolve-color';
import { ResolvedColor } from '../theme/resolved-color';
import { ThemeColorTransform } from '../theme/theme-render-model';
import { GradientLexical, parseGradientAngle, parseGradientPercentage } from '../theme/gradient-values';
import { GRADIENT_PRESET_COLORS } from '../theme/gradient-preset-colors';
import { arrayAt, objectGet } from '../util/es5-compat';
import { LayoutRenderColor, resolveLayoutColor } from './color-resolution';

/** Reference color/transforms substitute only for a stop's phClr. @internal */
export interface GradientReferenceColor {
    /** Direct color on fillRef/bgRef; never a replacement for unrelated stops. */
    readonly color: ColorValue | undefined;
    /** Applied before the phClr stop's own transforms. */
    readonly colorTransforms: ReadonlyArray<ThemeColorTransform>;
}
/** Explicit failure/capability classification. @internal */
export type GradientColorFailure = 'missing-color' | 'unresolved-reference' | 'invalid-color' |
'unsupported-transform' | 'invalid-transform';
/** Explicit capability result; unresolved input never silently becomes white/black. @internal */
export type GradientColorResult = ({ readonly kind: 'resolved'; } & LayoutRenderColor) | {
    readonly kind: 'unresolved';
    readonly reason: GradientColorFailure;
    /** Reference/transform token identifying the unresolved capability. */
    readonly detail: string | undefined;
};

/**
 * Resolves one gradient color using current scheme/map and ordered transforms.
 *
 * @remarks Reuses resolveColor for clrMap context and resolveLayoutColor for the
 * existing verified transform subset. Unsupported transforms return a capability
 * diagnostic rather than being silently ignored. No caching means theme/map
 * revisions take effect immediately. Source XML/direct ColorValue is never changed.
 * @param {ColorValue | undefined} color - Direct stop color choice.
 * @param {ReadonlyArray<ThemeColorTransform>} transforms - Stop transforms in source order.
 * @param {EffectiveColorContext} context - Current effective scheme and color map.
 * @param {GradientReferenceColor} reference - Optional phClr reference color and transforms.
 * @returns {GradientColorResult} Paint color/opacity or explicit diagnostic.
 * @internal
 */
export function resolveGradientStopColor(
    color: ColorValue | undefined, transforms: ReadonlyArray<ThemeColorTransform>,
    context?: EffectiveColorContext, reference?: GradientReferenceColor
): GradientColorResult {
    let input: ColorValue | undefined = color;
    let pipeline: ReadonlyArray<ThemeColorTransform> = transforms;
    if (input !== undefined && input.kind === 'scheme' && token(input.val) === 'phClr') {
        if (reference === undefined) { return unresolved('unresolved-reference', 'phClr'); }
        input = reference.color;
        pipeline = reference.colorTransforms.concat(transforms);
    }
    if (input === undefined) { return unresolved('missing-color'); }
    if (input.kind === 'scheme') { input = { kind: 'scheme', val: token(input.val) }; }
    let resolved: ResolvedColor;
    try { resolved = resolveColor(input, context); } catch (error) {
        if (error instanceof RangeError) { return unresolved('unresolved-reference', 'missing-theme-color'); }
        throw error;
    }
    if (resolved.kind === 'unresolved') { return unresolved('unresolved-reference', resolved.reason); }
    const direct: ColorValue = resolved.kind === 'srgb' ? { kind: 'srgb', val: resolved.val } : resolved.value;
    const paintInput: ColorValue | undefined = normalizeColor(direct);
    if (paintInput === undefined) { return unresolved('invalid-color', direct.kind); }
    for (let i: number = 0; i < pipeline.length; i++) {
        const transform: ThemeColorTransform = arrayAt(pipeline, i);
        if (transform.kind === 'comp' || transform.kind === 'inv' || transform.kind === 'gray') { continue; }
        if (!isSupportedTransform(transform.kind)) { return unresolved('unsupported-transform', transform.kind); }
        if (!validTransformValue(transform)) {
            return unresolved('invalid-transform', transform.kind);
        }
    }
    const paint: LayoutRenderColor = resolveLayoutColor(paintInput, pipeline);
    if (!/^#[0-9A-F]{6}$/.test(paint.color) || !Number.isFinite(paint.opacity)) { return unresolved('invalid-color', direct.kind); }
    return { kind: 'resolved', color: paint.color, opacity: paint.opacity };
}

/**
 * Converts validated literal choices into the shared engine's numeric units.
 *
 * @param {ColorValue} color - Literal source after scheme lookup.
 * @returns {ColorValue | undefined} Normalized paint input, or invalid/unavailable.
 */
function normalizeColor(color: ColorValue): ColorValue | undefined {
    switch (color.kind) {
    case 'srgb': {
        const hex: string = token(color.val);
        return /^[0-9A-Fa-f]{6}$/.test(hex) ? { kind: 'srgb', val: hex.toUpperCase() } : undefined;
    }
    case 'sys': return color.lastClr === undefined ? undefined : normalizeColor({ kind: 'srgb', val: color.lastClr });
    case 'prst': {
        const key: string = token(color.val);
        const hex: string | undefined = objectGet<string>(GRADIENT_PRESET_COLORS, key);
        return hex === undefined ? undefined : { kind: 'srgb', val: hex };
    }
    case 'scrgb': {
        const red: number | undefined = percentage(color.r);
        const green: number | undefined = percentage(color.g);
        const blue: number | undefined = percentage(color.b);
        if (red === undefined || green === undefined || blue === undefined) { return undefined; }
        // ECMA 20.1.2.3.30: scRGB is linear gamma 1.0; its 50% example is BCBCBC.
        return { kind: 'srgb', val: linearHex(red) + linearHex(green) + linearHex(blue) };
    }
    case 'hsl': {
        const hue: GradientLexical<number> = parseGradientAngle(color.hue);
        const saturation: number | undefined = percentage(color.sat);
        const luminance: number | undefined = percentage(color.lum);
        if (hue.kind !== 'value' || saturation === undefined || luminance === undefined) { return undefined; }
        return { kind: 'hsl', hue: String(hue.value * 60000), sat: String(saturation * 100000), lum: String(luminance * 100000) };
    }
    default: return undefined;
    }
}
/**
 * Parses strict percent strings or Transitional integer color channels.
 *
 * @param {string} raw - Direct channel token.
 * @returns {number | undefined} Finite normalized ratio, or invalid token.
 */
function percentage(raw: string): number | undefined {
    const value: GradientLexical<number> = parseGradientPercentage(raw, 'transitional', 'rectangle');
    return value.kind === 'value' ? value.value : undefined;
}
/**
 * Encodes one linear RGB channel for an sRGB paint value.
 *
 * @param {number} channel - Linear normalized channel; out-of-gamut values clip for paint only.
 * @returns {string} Uppercase two-digit sRGB channel.
 */
function linearHex(channel: number): string {
    const clipped: number = Math.max(0, Math.min(1, channel));
    const encoded: number = clipped <= 0.0031308 ? clipped * 12.92 : 1.055 * Math.pow(clipped, 1 / 2.4) - 0.055;
    const hex: string = Math.round(encoded * 255).toString(16).toUpperCase();
    return hex.length < 2 ? '0' + hex : hex;
}
/**
 * Lists only transform operations actually implemented by the shared engine.
 *
 * @param {string} name - Authored transform name.
 * @returns {boolean} Whether ordered application is supported.
 */
function isSupportedTransform(name: string): boolean {
    return name === 'tint' || name === 'shade' || name === 'satMod' || name === 'hueMod' || name === 'lumMod' ||
        name === 'lumOff' || name === 'alpha' || name === 'alphaMod' || name === 'alphaOff';
}
/**
 * Enforces the applicable EG_ColorTransform value domains before painting.
 *
 * @param {ThemeColorTransform} transform - Supported value-bearing transform.
 * @returns {boolean} Whether the parsed amount is finite and inside its schema domain.
 */
function validTransformValue(transform: ThemeColorTransform): boolean {
    const value: number | undefined = transform.value;
    if (value === undefined || !Number.isFinite(value)) { return false; }
    if (transform.kind === 'tint' || transform.kind === 'shade' || transform.kind === 'alpha') {
        return value >= 0 && value <= 100000;
    }
    if (transform.kind === 'alphaOff') { return value >= -100000 && value <= 100000; }
    if (transform.kind === 'alphaMod' || transform.kind === 'hueMod') { return value >= 0; }
    return true;
}
/**
 * Retains an explicit unresolved capability without a fabricated color.
 *
 * @param {GradientColorFailure} reason - Failure classification.
 * @param {string} detail - Optional token/context.
 * @returns {GradientColorResult} Unresolved view.
 */
function unresolved(
    reason: GradientColorFailure, detail?: string
): GradientColorResult { return { kind: 'unresolved', reason, detail }; }
/**
 * Collapses XML token edge whitespace for enumerations and hexBinary.
 *
 * @param {string} raw - Direct token.
 * @returns {string} XML-trimmed token.
 */
function token(raw: string): string { return raw.replace(/^[ \t\r\n]+/, '').replace(/[ \t\r\n]+$/, ''); }
