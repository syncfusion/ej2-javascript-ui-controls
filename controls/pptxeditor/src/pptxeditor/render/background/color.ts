import { ColorValue } from '@syncfusion/ej2-pptx';
import {
    SlideFrameColorTransform,
    SlideFrameThemeSnapshot
} from '../../main-slide/slide-frame-model';

/**
 * @internal
 */
export interface RenderColor {
    readonly color: string;
    readonly opacity: number;
}

interface RgbaColor {
    readonly red: number;
    readonly green: number;
    readonly blue: number;
    readonly opacity: number;
}

/**
 * ports `ThemeUtilities` colour resolution used by `GDIRenderer.GetGradientBrush`.
 * @param {ColorValue|undefined} value - value
 * @param {Array.<SlideFrameColorTransform>} transforms - transforms
 * @param {SlideFrameThemeSnapshot} theme - theme
 * @param {ColorValue} placeholder - placeholder
 * @returns {RenderColor} result
 * @internal
 */
export function resolveRenderColor(
    value: ColorValue | undefined,
    transforms: ReadonlyArray<SlideFrameColorTransform> = [],
    theme?: SlideFrameThemeSnapshot,
    placeholder?: ColorValue,
    placeholderTransforms?: ReadonlyArray<SlideFrameColorTransform>
): RenderColor {
    let current: RgbaColor = colorValueToRgba(resolveColorValue(value, theme, placeholder));
    // Style-reference (phClr) colour transforms apply before the theme style's own.
    for (const transform of placeholderTransforms || []) {
        current = applyTransform(current, transform);
    }
    for (const transform of transforms) {
        current = applyTransform(current, transform);
    }
    return {
        color: '#' + [current.red, current.green, current.blue]
            .map(toHexByte)
            .join(''),
        opacity: current.opacity
    };
}

function toHexByte(component: number): string {
    const hex: string = component.toString(16);
    return (hex.length < 2 ? '0' + hex : hex).toUpperCase();
}

function resolveColorValue(
    value: ColorValue | undefined,
    theme: SlideFrameThemeSnapshot | undefined,
    placeholder: ColorValue | undefined,
    visited: ReadonlySet<string> = new Set<string>()
): ColorValue | undefined {
    if (!value || value.kind !== 'scheme') {
        return value;
    }
    if (value.val === 'phClr') {
        return resolveColorValue(placeholder, theme, undefined, visited);
    }
    if (visited.has(value.val)) {
        return undefined;
    }
    const mapped: string = optionalProperty(optionalProperty(theme, 'colorMap'), value.val) || value.val;
    const next: ColorValue | undefined = optionalProperty(optionalProperty(theme, 'colors'), mapped);
    return resolveColorValue(next, theme, placeholder, new Set([...visited, value.val]));
}

function colorValueToRgba(value: ColorValue | undefined): RgbaColor {
    if (!value) {
        return { red: 255, green: 255, blue: 255, opacity: 1 };
    }
    if (value.kind === 'srgb') {
        const hex: string = (value.val.replace(/^#/, '') + '000000').slice(0, 6);
        return {
            red: parseInt(hex.slice(0, 2), 16),
            green: parseInt(hex.slice(2, 4), 16),
            blue: parseInt(hex.slice(4, 6), 16),
            opacity: 1
        };
    }
    if (value.kind === 'sys') {
        return colorValueToRgba({ kind: 'srgb', val: value.lastClr || '000000' });
    }
    if (value.kind === 'scrgb') {
        return {
            red: channelFromPercentage(value.r),
            green: channelFromPercentage(value.g),
            blue: channelFromPercentage(value.b),
            opacity: 1
        };
    }
    return { red: 0, green: 0, blue: 0, opacity: 1 };
}

function channelFromPercentage(value: string): number {
    return clampByte(Math.round(Number(value) * 255 / 100000));
}

function applyTransform(color: RgbaColor, transform: SlideFrameColorTransform): RgbaColor {
    const amount: number = (transform.value || 0) / 100000;
    switch (transform.kind) {
    case 'tint': return mapRgb(color, (channel: number): number =>
        calcInt(calcDouble(channel) * amount + (1 - amount)));
    case 'shade': return mapRgb(color, (channel: number): number => calcInt(calcDouble(channel) * amount));
    case 'satMod': return fromHsl(color, { ...toHsl(color), saturation: toHsl(color).saturation * amount });
    case 'lumMod': return fromHsl(color, { ...toHsl(color), luminance: toHsl(color).luminance * amount });
    case 'lumOff': return fromHsl(color, { ...toHsl(color), luminance: toHsl(color).luminance + amount });
    case 'alpha': return { ...color, opacity: clamp01(amount) };
    case 'alphaMod': return { ...color, opacity: clamp01(color.opacity * amount) };
    case 'alphaOff': return { ...color, opacity: clamp01(color.opacity + amount) };
    default: return color;
    }
}

function mapRgb(color: RgbaColor, apply: (channel: number) => number): RgbaColor {
    return { ...color, red: apply(color.red), green: apply(color.green), blue: apply(color.blue) };
}

interface HslColor { readonly hue: number; readonly saturation: number; readonly luminance: number; }

function toHsl(color: RgbaColor): HslColor {
    const red: number = color.red / 255;
    const green: number = color.green / 255;
    const blue: number = color.blue / 255;
    const max: number = Math.max(red, green, blue);
    const min: number = Math.min(red, green, blue);
    const delta: number = max - min;
    const luminance: number = (max + min) / 2;
    let hue: number = 0;
    if (delta !== 0) {
        if (max === red) {
            hue = 60 * ((green - blue) / delta) + (green < blue ? 360 : 0);
        } else if (max === green) {
            hue = 60 * ((blue - red) / delta) + 120;
        } else {
            hue = 60 * ((red - green) / delta) + 240;
        }
    }
    const saturation: number = delta === 0 ? 0 :
        luminance <= 0.5 ? delta / (max + min) : delta / (2 - max - min);
    return { hue, saturation, luminance };
}

function fromHsl(source: RgbaColor, hsl: HslColor): RgbaColor {
    const saturation: number = clamp01(hsl.saturation);
    const luminance: number = clamp01(hsl.luminance);
    if (saturation === 0) {
        const gray: number = roundToEven(luminance * 255);
        return { ...source, red: gray, green: gray, blue: gray };
    }
    const temp1: number = luminance < 0.5
        ? luminance * (1 + saturation)
        : luminance + saturation - luminance * saturation;
    const temp2: number = 2 * luminance - temp1;
    const hue: number = hsl.hue / 360;
    const channels: number[] = [hue + 1 / 3, hue, hue - 1 / 3].map((component: number): number => {
        let value: number = component;
        if (value < 0) {
            value += 1;
        }
        if (value > 1) {
            value -= 1;
        }
        if (value * 6 < 1) {
            value = temp2 + (temp1 - temp2) * 6 * value;
        } else if (value * 2 < 1) {
            value = temp1;
        } else if (value * 3 < 2) {
            value = temp2 + (temp1 - temp2) * (2 / 3 - value) * 6;
        } else {
            value = temp2;
        }
        return roundToEven(value * 255);
    });
    return { ...source, red: channels[0], green: channels[1], blue: channels[2] };
}

function calcDouble(channel: number): number {
    const value: number = channel / 255;
    return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}

function calcInt(value: number): number {
    const normalized: number = value < 0 ? 0 : value <= 0.0031308
        ? value * 12.92 : value < 1 ? 1.055 * Math.pow(value, 1 / 2.4) - 0.055 : 1;
    return clampByte(roundToEven(normalized * 255));
}

function roundToEven(value: number): number {
    const floor: number = Math.floor(value);
    const fraction: number = value - floor;
    if (fraction !== 0.5) {
        return Math.round(value);
    }
    return floor % 2 === 0 ? floor : floor + 1;
}

function clampByte(value: number): number {
    return Math.max(0, Math.min(255, value));
}
function clamp01(value: number): number {
    return Math.max(0, Math.min(1, value));
}

/** Reads a property only when its owner is present.
 * @param {*} value - Potentially absent owner.
 * @param {*} key - Property key.
 * @returns {*} Property value or undefined.
 */
function optionalProperty<T, K extends keyof T>(value: T | null | undefined, key: K): T[K] | undefined {
    return value !== undefined && value !== null ? value[key] : undefined;
}
