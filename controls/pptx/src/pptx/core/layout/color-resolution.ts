import { ColorValue } from '../theme/color-value';
import { ThemeColorTransform } from '../theme/theme-render-model';
import { LayoutThemeSnapshot } from './layout-model';

/** Resolved CSS colour and opacity. @private */
export interface LayoutRenderColor { readonly color: string; readonly opacity: number; }
interface RgbaColor { readonly red: number; readonly green: number; readonly blue: number; readonly opacity: number; }

/**
 * ports `ThemeUtilities` colour resolution used by `GDIRenderer.GetGradientBrush`.
 *
 * @param {ColorValue | undefined} value - Authored colour value.
 * @param {ReadonlyArray<ThemeColorTransform>} transforms - Theme colour transforms.
 * @param {LayoutThemeSnapshot} theme - Effective theme snapshot.
 * @param {ColorValue} placeholder - Placeholder colour from the style reference.
 * @returns {LayoutRenderColor} Resolved CSS colour and opacity.
 * @private
 */
export function resolveLayoutColor(
    value: ColorValue | undefined,
    transforms: ReadonlyArray<ThemeColorTransform> = [],
    theme?: LayoutThemeSnapshot,
    placeholder?: ColorValue
): LayoutRenderColor {
    let current: RgbaColor = colorValueToRgba(resolveColorValue(value, theme, placeholder));
    for (const transform of transforms) {
        current = applyTransform(current, transform);
    }
    return { color: '#' + [current.red, current.green, current.blue].map(toHexByte).join(''), opacity: current.opacity };
}

function toHexByte(component: number): string {
    const hex: string = component.toString(16);
    return (hex.length < 2 ? '0' + hex : hex).toUpperCase();
}
function resolveColorValue(
    value: ColorValue | undefined, theme: LayoutThemeSnapshot | undefined,
    placeholder: ColorValue | undefined, visited: ReadonlySet<string> = new Set<string>()
): ColorValue | undefined {
    if (!value || value.kind !== 'scheme') { return value; }
    if (value.val === 'phClr') { return resolveColorValue(placeholder, theme, undefined, visited); }
    if (visited.has(value.val)) { return undefined; }
    const mapped: string = optionalProperty(optionalProperty(theme, 'colorMap'), value.val) || value.val;
    const next: ColorValue | undefined = optionalProperty(optionalProperty(theme, 'colors'), mapped);
    return resolveColorValue(next, theme, placeholder, new Set<string>(Array.from(visited).concat(value.val)));
}
function colorValueToRgba(value: ColorValue | undefined): RgbaColor {
    if (!value) { return { red: 255, green: 255, blue: 255, opacity: 1 }; }
    if (value.kind === 'srgb') {
        const hex: string = (value.val.replace(/^#/, '') + '000000').slice(0, 6);
        return { red: parseInt(hex.slice(0, 2), 16), green: parseInt(hex.slice(2, 4), 16),
            blue: parseInt(hex.slice(4, 6), 16), opacity: 1 };
    }
    if (value.kind === 'sys') { return colorValueToRgba({ kind: 'srgb', val: value.lastClr || '000000' }); }
    if (value.kind === 'scrgb') {
        return { red: channelFromPercentage(value.r), green: channelFromPercentage(value.g),
            blue: channelFromPercentage(value.b), opacity: 1 };
    }
    if (value.kind === 'hsl') {
        return fromHsl({ red: 0, green: 0, blue: 0, opacity: 1 }, {
            hue: Number(value.hue) / 60000,
            saturation: Number(value.sat) / 100000,
            luminance: Number(value.lum) / 100000
        });
    }
    if (value.kind === 'prst') {
        const presets: Readonly<Record<string, string>> = {
            black: '000000', white: 'FFFFFF', red: 'FF0000', green: '008000', blue: '0000FF',
            yellow: 'FFFF00', gray: '808080', grey: '808080', transparent: 'FFFFFF'
        };
        return colorValueToRgba({ kind: 'srgb', val: presets[value.val] || '000000' });
    }
    return { red: 0, green: 0, blue: 0, opacity: 1 };
}
function channelFromPercentage(value: string): number { return clampByte(Math.round(Number(value) * 255 / 100000)); }
function applyTransform(color: RgbaColor, transform: ThemeColorTransform): RgbaColor {
    const amount: number = (transform.value || 0) / 100000;
    switch (transform.kind) {
    case 'tint': return mapRgb(color, (channel: number): number => calcInt(calcDouble(channel) * amount + (1 - amount)));
    case 'shade': return mapRgb(color, (channel: number): number => calcInt(calcDouble(channel) * amount));
    case 'satMod': return fromHsl(color, { ...toHsl(color), saturation: toHsl(color).saturation * amount });
    case 'hueMod': return fromHsl(color, { ...toHsl(color), hue: toHsl(color).hue * amount });
    case 'lumMod': return fromHsl(color, { ...toHsl(color), luminance: toHsl(color).luminance * amount });
    case 'lumOff': return fromHsl(color, { ...toHsl(color), luminance: toHsl(color).luminance + amount });
    case 'alpha': return { ...color, opacity: clamp01(amount) };
    case 'alphaMod': return { ...color, opacity: clamp01(color.opacity * amount) };
    case 'alphaOff': return { ...color, opacity: clamp01(color.opacity + amount) };
    case 'comp': return fromHsl(color, { ...toHsl(color), hue: (toHsl(color).hue + 180) % 360 });
    case 'inv': return { ...color, red: 255 - color.red, green: 255 - color.green, blue: 255 - color.blue };
    case 'gray': {
        const gray: number = clampByte(roundToEven(0.299 * color.red + 0.587 * color.green + 0.114 * color.blue));
        return { ...color, red: gray, green: gray, blue: gray };
    }
    default: return color;
    }
}
function mapRgb(color: RgbaColor, apply: (channel: number) => number): RgbaColor {
    return { ...color, red: apply(color.red), green: apply(color.green), blue: apply(color.blue) };
}
interface HslColor { readonly hue: number; readonly saturation: number; readonly luminance: number; }
function toHsl(color: RgbaColor): HslColor {
    const red: number = color.red / 255; const green: number = color.green / 255; const blue: number = color.blue / 255;
    const max: number = Math.max(red, green, blue); const min: number = Math.min(red, green, blue);
    const delta: number = max - min; const luminance: number = (max + min) / 2; let hue: number = 0;
    if (delta !== 0) {
        if (max === red) { hue = 60 * ((green - blue) / delta) + (green < blue ? 360 : 0); }
        else if (max === green) { hue = 60 * ((blue - red) / delta) + 120; }
        else { hue = 60 * ((red - green) / delta) + 240; }
    }
    const saturation: number = delta === 0 ? 0 : luminance <= 0.5 ? delta / (max + min) : delta / (2 - max - min);
    return { hue, saturation, luminance };
}
function fromHsl(source: RgbaColor, hsl: HslColor): RgbaColor {
    const saturation: number = clamp01(hsl.saturation); const luminance: number = clamp01(hsl.luminance);
    if (saturation === 0) { const gray: number = roundToEven(luminance * 255); return { ...source, red: gray, green: gray, blue: gray }; }
    const temp1: number = luminance < 0.5 ? luminance * (1 + saturation) : luminance + saturation - luminance * saturation;
    const temp2: number = 2 * luminance - temp1; const hue: number = ((hsl.hue % 360) + 360) % 360 / 360;
    const channels: number[] = [hue + 1 / 3, hue, hue - 1 / 3].map((component: number): number => {
        let current: number = component; if (current < 0) { current += 1; } if (current > 1) { current -= 1; }
        if (current * 6 < 1) { return roundToEven((temp2 + (temp1 - temp2) * 6 * current) * 255); }
        if (current * 2 < 1) { return roundToEven(temp1 * 255); }
        if (current * 3 < 2) { return roundToEven((temp2 + (temp1 - temp2) * (2 / 3 - current) * 6) * 255); }
        return roundToEven(temp2 * 255);
    });
    return { ...source, red: channels[0], green: channels[1], blue: channels[2] };
}
/** Linearises an sRGB channel per the .NET source.
 * @param {number} channel - sRGB channel in 0–255.
 * @returns {number} Linearised channel value.
 */
function calcDouble(channel: number): number {
    const value: number = channel / 255;
    return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}
/** Re-encodes a linear channel to sRGB, rounding ties to even per the .NET source.
 * @param {number} value - Linear channel value.
 * @returns {number} sRGB channel in 0–255.
 */
function calcInt(value: number): number {
    const normalized: number = value < 0 ? 0 : value <= 0.0031308 ? value * 12.92
        : value < 1 ? 1.055 * Math.pow(value, 1 / 2.4) - 0.055 : 1;
    return clampByte(roundToEven(normalized * 255));
}
/** Rounds to the nearest integer, with exact .5 ties going to the even value.
 * @param {number} value - Value to round.
 * @returns {number} Rounded value.
 */
function roundToEven(value: number): number {
    const floor: number = Math.floor(value);
    const fraction: number = value - floor;
    return fraction !== 0.5 ? Math.round(value) : floor % 2 === 0 ? floor : floor + 1;
}
function clampByte(value: number): number { return Math.max(0, Math.min(255, value)); }
function clamp01(value: number): number { return Math.max(0, Math.min(1, value)); }
/** Reads a property only when its owner is present. Keys are static `keyof` members. */
/** Reads a property only when its owner is present. Keys are static `keyof` members.
 * @param {*} value - Potentially absent owner.
 * @param {*} key - Property key.
 * @returns {*} Property value or undefined.
 */
function optionalProperty<T, K extends keyof T>(value: T | null | undefined, key: K): T[K] | undefined {
    // eslint-disable-next-line security/detect-object-injection -- key is a statically inferred keyof T member
    return value !== undefined && value !== null ? value[key] : undefined;
}
