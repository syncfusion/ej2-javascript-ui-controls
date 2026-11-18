import { ColorValue } from '@syncfusion/ej2-pptx';

/** Clone-safe theme data required by the slide-frame renderer. * @internal
 */
export interface SlideFrameThemeSnapshot {
    readonly colors: Readonly<Partial<Record<string, ColorValue>>>;
    readonly colorMap: Readonly<Partial<Record<string, string>>>;
    readonly fonts?: {
        readonly major: SlideFrameFontCollection;
        readonly minor: SlideFrameFontCollection;
    };
    /** Shape fill matrix (`a:fillStyleLst`) in authored order. */
    readonly fillStyles?: ReadonlyArray<SlideFrameFill>;
    readonly backgroundFillStyles?: ReadonlyArray<SlideFrameFill>;
    readonly lineStyles?: ReadonlyArray<SlideFrameLineStyle>;
}

/** Clone-safe theme format-matrix line entry. * @internal
 */
export interface SlideFrameLineStyle {
    readonly width?: number;
    readonly cap?: string;
    readonly compound?: string;
    readonly alignment?: string;
    readonly dash?: string;
    readonly fill: SlideFrameFill;
}

/** Theme typefaces retained for later text rendering. * @internal
 */
export interface SlideFrameFontCollection {
    /** Latin theme typeface; empty means the slot is not authored. */
    readonly latin: string;
    /** East-Asian theme typeface; empty means the script default applies. */
    readonly eastAsian: string;
    /** Complex-script theme typeface; empty means the script default applies. */
    readonly complexScript: string;
    /** Ordered script-specific theme typefaces preserved from `a:font` children. */
    readonly supplementalFonts?: ReadonlyArray<{
    /** DrawingML four-letter script identifier. */
        readonly script: string;
        /** Authored typeface for the script. */
        readonly typeface: string;
    }>;
}

/** Presentation-level geometry and theme context. * @internal
 */
export interface PresentationFrameInfo {
    readonly slideWidthPt: number;
    readonly slideHeightPt: number;
    readonly slideSizeType?: string;
    readonly theme?: SlideFrameThemeSnapshot;
}

/** One clone-safe gradient stop. * @internal
 */
export interface SlideFrameGradientStop {
    readonly position: number;
    readonly color?: ColorValue;
    readonly colorTransforms?: ReadonlyArray<SlideFrameColorTransform>;
}

/** One authored DrawingML colour transform in source order. * @internal
 */
export interface SlideFrameColorTransform {
    readonly kind: string;
    readonly value?: number;
}

/** Clone-safe fill data emitted by the library parse session. * @internal
 */
export type SlideFrameFill =
  | { readonly kind: 'noFill' }
  | {
      readonly kind: 'solid';
      readonly color?: ColorValue;
      readonly colorTransforms?: ReadonlyArray<SlideFrameColorTransform>;
  }
  | {
      readonly kind: 'gradient';
      readonly stops: ReadonlyArray<SlideFrameGradientStop>;
      readonly angle?: number;
      readonly path?: 'circle' | 'rect' | 'shape';
      readonly fillToRect?: {
          readonly left?: number;
          readonly top?: number;
          readonly right?: number;
          readonly bottom?: number;
      };
  }
  | { readonly kind: 'pattern'; readonly preset?: string }
  | {
      readonly kind: 'picture';
      readonly data?: ArrayBuffer;
      readonly contentType?: string;
      readonly externalUrl?: string;
      readonly mode?: 'stretch' | 'tile';
  }
  | { readonly kind: 'group' | 'unknown' };

/** Source-aware background emitted for one slide. * @internal
 */
export interface SlideFrameBackgroundSnapshot {
    readonly source: 'slide' | 'layout' | 'master' | 'default';
    readonly background:
    | { readonly kind: 'fill'; readonly fill: SlideFrameFill; readonly shadeToTitle?: boolean }
    | {
        readonly kind: 'theme';
        readonly styleIndex: number;
        readonly color?: ColorValue;
        readonly colorTransforms?: ReadonlyArray<SlideFrameColorTransform>;
    };
}

/** A direct authored background before inheritance is resolved. * @internal
 */
export type SlideFrameDirectBackgroundSnapshot =
  | { readonly kind: 'missing' }
  | SlideFrameBackgroundSnapshot['background'];

/** Direct levels plus the source-aware resolved background. * @internal
 */
export interface SlideFrameBackgroundLevels {
    readonly slide: SlideFrameDirectBackgroundSnapshot;
    readonly layout: SlideFrameDirectBackgroundSnapshot;
    readonly master: SlideFrameDirectBackgroundSnapshot;
    readonly resolved: SlideFrameBackgroundSnapshot;
}

/** Per-slide clone-safe data consumed by the render model. * @internal
 */
export interface SlideFrameSnapshot {
    readonly index: number;
    readonly partName: string;
    readonly isHidden: boolean;
    readonly showMasterShapes: boolean;
    readonly layoutShowMasterShapes: boolean;
    readonly backgrounds: SlideFrameBackgroundLevels;
    /** Compatibility alias for `backgrounds.resolved`. */
    readonly background: SlideFrameBackgroundSnapshot;
}
