/**
 * View DTOs for style inheritance resolve (never written back as direct markup).
 */
import { ResolvedColor } from '../theme/resolved-color';
/**
 * Layer that contributed a resolved text or geometry property.
 *
 * @remarks
 * Walk order for text: `direct` → `layout` → `master` → `txStyles` →
 * `defaultTextStyle` → `theme`. Geometry (`xfrm`) stops at master placeholder.
 *
 * Citation: eng-ref chain; Transitional `pml.xsd` `CT_SlideMasterTextStyles`.
 */
export type StyleInheritanceSource = 'direct' | 'layout' | 'master' | 'txStyles' | 'defaultTextStyle' | 'theme';
/**
 * Resolved text style view for one paragraph or run.
 *
 * @remarks
 * **Not** interchangeable with direct `a:rPr` / `a:defRPr` markup. Properties
 * are filled independently (first-defined-wins per property). `source` is the
 * contributing layer of the highest-priority present property (`color` then
 * `fontSizePt`); when nothing resolved it is `'direct'` (empty view).
 *
 * Never assign {@link ResolvedColor} into the package serializer path.
 */
export interface ResolvedTextStyle {
    /**
     * Font size in points when `@sz` was found (`ST_TextFontSize` hundredths ÷ 100).
     */
    readonly fontSizePt?: number;
    /** Layer that supplied {@link ResolvedTextStyle.fontSizePt}. */
    readonly fontSizeSource?: StyleInheritanceSource;
    /**
     * View-only colour after scheme/map resolve when a solid fill colour was found.
     */
    readonly color?: ResolvedColor;
    /** Layer that supplied {@link ResolvedTextStyle.color}. */
    readonly colorSource?: StyleInheritanceSource;
    /**
     * Overall source label: `colorSource` if set, else `fontSizeSource`, else `'direct'`.
     */
    readonly source: StyleInheritanceSource;
}
/**
 * Resolved 2D transform from `a:xfrm` (`a:off` / `a:ext`), EMUs as numbers.
 *
 * @remarks
 * Direct geometry APIs remain absent when the slide shape has no `xfrm`.
 * Resolve may copy layout then master placeholder `xfrm` for placeholder-backed
 * shapes only. Values are view-only and must not be written back automatically.
 *
 * Citation: `dml-main.xsd` `CT_Transform2D`; eng-ref placeholder geometry inherit.
 */
export interface ResolvedTransform {
    /** `a:off/@x` in EMUs when present. */
    readonly x?: number;
    /** `a:off/@y` in EMUs when present. */
    readonly y?: number;
    /** Width in EMUs from `a:ext/@cx` when present. */
    readonly width?: number;
    /** Height in EMUs from `a:ext/@cy` when present. */
    readonly height?: number;
    /** Layer that supplied this transform (`direct` | `layout` | `master`). */
    readonly source: 'direct' | 'layout' | 'master';
}
