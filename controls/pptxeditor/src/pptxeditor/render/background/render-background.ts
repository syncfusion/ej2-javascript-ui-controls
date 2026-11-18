import {
    SlideFrameBackgroundSnapshot,
    SlideFrameFill,
    SlideFrameGradientStop,
    SlideFrameThemeSnapshot
} from '../../main-slide/slide-frame-model';
import { resolveRenderColor, RenderColor } from './color';

/**
 * @internal
 */
export type BackgroundPaint =
  | ({ readonly kind: 'solid' } & RenderColor)
  | {
      readonly kind: 'linearGradient';
      readonly angle: number;
      readonly stops: ReadonlyArray<{ readonly offset: number } & RenderColor>;
  }
  | {
      readonly kind: 'radialGradient';
      readonly centerX: number;
      readonly centerY: number;
      readonly focusX: number;
      readonly focusY: number;
      readonly radiusOfMaxDimension: number;
      readonly stops: ReadonlyArray<{ readonly offset: number } & RenderColor>;
  }
  | {
      readonly kind: 'picture';
      readonly data?: ArrayBuffer;
      readonly contentType?: string;
      readonly externalUrl?: string;
      readonly mode: 'stretch' | 'tile';
  };

/**
 * ports `Background.SetFillFormat`, `GDIRenderer.FillSlideBackground`, `FillBackground`, and `GetGradientBrush`.
 * @param {SlideFrameBackgroundSnapshot} resolved - resolved
 * @param {SlideFrameThemeSnapshot} theme - theme
 * @returns {BackgroundPaint} result
 * @internal
 */
export function renderBackground(
    resolved: SlideFrameBackgroundSnapshot,
    theme?: SlideFrameThemeSnapshot
): BackgroundPaint {
    const direct: { readonly kind: 'fill'; readonly fill: SlideFrameFill; readonly shadeToTitle?: boolean; } | { readonly kind: 'theme'; readonly styleIndex: number; readonly color?: import('@syncfusion/ej2-pptx').ColorValue; readonly colorTransforms?: ReadonlyArray<import('../../main-slide/slide-frame-model').SlideFrameColorTransform>; } = resolved.background;
    const placeholder: import('@syncfusion/ej2-pptx').ColorValue = direct.kind === 'theme' ? direct.color : undefined;
    const fill: SlideFrameFill = direct.kind === 'fill'
        ? direct.fill
        : resolveThemeFill(direct.styleIndex, theme);
    if (fill.kind === 'picture') {
        return {
            kind: 'picture',
            ...(fill.data ? { data: fill.data } : {}),
            ...(fill.contentType ? { contentType: fill.contentType } : {}),
            ...(fill.externalUrl ? { externalUrl: fill.externalUrl } : {}),
            mode: fill.mode || 'stretch'
        };
    }
    if (fill.kind === 'gradient') {
        if (fill.path === 'circle') {
            const focus: { readonly x: number; readonly y: number } = radialFocus(fill.fillToRect);
            return {
                kind: 'radialGradient',
                centerX: 0.5,
                centerY: 0.5,
                focusX: focus.x,
                focusY: focus.y,
                // ports the NetStandard branch of `GDIRenderer.GetRadialGradientBrush`.
                // Licensed 35.1.39 output uses an unscaled device-space circle whose
                // radius is half the longer bound; the sqrt(3) branch is not compiled.
                radiusOfMaxDimension: 0.5,
                // PathGradientBrush positions run boundary → centre; SVG runs focus → edge.
                // Keeping authored positions here is the equivalent of the reference's
                // reversed positions under the opposite brush convention.
                stops: gradientStops(fill.stops, theme, placeholder, false)
            };
        }
        return {
            kind: 'linearGradient',
            angle: normalizeAngle((fill.angle || 0) + 180),
            stops: gradientStops(fill.stops, theme, placeholder)
        };
    }
    if (fill.kind === 'solid') {
        if (direct.kind === 'theme' && direct.color) {
            return {
                kind: 'solid',
                ...resolveRenderColor(direct.color, direct.colorTransforms, theme)
            };
        }
        const color: RenderColor = resolveRenderColor(
            fill.color,
            fill.colorTransforms,
            theme,
            placeholder
        );
        return { kind: 'solid', ...color };
    }
    return { kind: 'solid', color: '#FFFFFF', opacity: 1 };
}

/**
 * ports `GDIRenderer.GetRadialGradientBrush` corner selection from `PathShadeImpl`.
 * @param {Object} fillToRect - fillToRect
 * @returns {Object} result
 */
function radialFocus(fillToRect: Extract<SlideFrameFill, { readonly kind: 'gradient' }>['fillToRect']):
{ readonly x: number; readonly y: number } {
    if (optionalProperty(fillToRect, 'left') === 0 && fillToRect.bottom === 0) {
        return { x: 0, y: 1 };
    }
    if (optionalProperty(fillToRect, 'right') === 0 && fillToRect.bottom === 0) {
        return { x: 1, y: 1 };
    }
    if (optionalProperty(fillToRect, 'right') === 0 && fillToRect.top === 0) {
        return { x: 1, y: 0 };
    }
    if (optionalProperty(fillToRect, 'left') === 0 && fillToRect.top === 0) {
        return { x: 0, y: 0 };
    }
    return { x: 0.5, y: 0.5 };
}

function resolveThemeFill(index: number, theme: SlideFrameThemeSnapshot | undefined): SlideFrameFill {
    const styles: ReadonlyArray<SlideFrameFill> = optionalProperty(theme, 'backgroundFillStyles');
    const normalized: number = index >= 1001 ? index - 1001 : Math.max(0, index - 1);
    return optionalProperty(styles, normalized) || {
        kind: 'solid', color: { kind: 'srgb', val: 'FFFFFF' }, colorTransforms: []
    };
}

function gradientStops(
    stops: ReadonlyArray<SlideFrameGradientStop>,
    theme: SlideFrameThemeSnapshot | undefined,
    placeholder: import('@syncfusion/ej2-pptx').ColorValue | undefined,
    reverse: boolean = true
): ReadonlyArray<{ readonly offset: number } & RenderColor> {
    const source: ReadonlyArray<SlideFrameGradientStop> = stops.length > 0 ? stops : [
        { position: 0, color: { kind: 'srgb', val: '000000' }, colorTransforms: [] },
        { position: 1, color: { kind: 'srgb', val: 'FFFFFF' }, colorTransforms: [] }
    ];
    const rendered: { color: string; opacity: number; offset: number; }[] = source.map((stop: SlideFrameGradientStop) => ({
        offset: clamp01(reverse ? 1 - stop.position : stop.position),
        ...resolveRenderColor(stop.color, stop.colorTransforms, theme, placeholder)
    })).sort((
        left: { color: string; opacity: number; offset: number; },
        right: { color: string; opacity: number; offset: number; }
    ): number => left.offset - right.offset);
    if (rendered[0].offset > 0) {
        rendered.unshift({ ...rendered[0], offset: 0 });
    }
    if (rendered[rendered.length - 1].offset < 1) {
        rendered.push({ ...rendered[rendered.length - 1], offset: 1 });
    }
    return rendered;
}

function normalizeAngle(value: number): number {
    return ((value % 360) + 360) % 360;
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
