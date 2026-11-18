/**
 * Direct shape fill, line, and style-matrix reference models (read/preserve).
 *
 * @remarks
 * Citation: Transitional `dml-main.xsd` `EG_FillProperties` (noFill, solidFill,
 * gradFill, blipFill, pattFill, grpFill), `CT_LineProperties` / `EG_LineFillProperties`,
 * `CT_ShapeStyle` / `CT_StyleMatrixReference`.
 *
 * **Missing** fill (no `EG_FillProperties` child under `spPr`) is distinct from
 * explicit `a:noFill`. `p:style` fill/line refs are **not** direct fills — they
 * live on {@link ShapeStyleRefs} and must not be flattened to solid RGB on save.
 */
import { ColorValue } from '../theme/color-value';
import { ThemeColorTransform, ThemeGradientFillToRect, ThemeGradientPath, ThemeGradientStop } from '../theme/theme-render-model';
/**
 * Direct fill classified from the first `EG_FillProperties` child under `a:spPr`.
 *
 * @remarks
 * Gradient / blip / pattern / group are opaque bags for Phase 2: classified so
 * callers know the kind, without deep edit models. Markup remains on the live DOM.
 */
export type DirectFill = MissingFill | NoFill | SolidFill | GradientFill | BlipFill | PatternFill | GroupFill;
/** No `EG_FillProperties` child under `spPr` (or no `spPr`). */
export interface MissingFill {
    /** Discriminant for a missing fill (no EG_FillProperties child under spPr). */
    readonly kind: 'missing';
}
/** Explicit `a:noFill` under `spPr`. */
export interface NoFill {
    /** Discriminant for explicit a:noFill under spPr. */
    readonly kind: 'noFill';
}
/**
 * `a:solidFill` with optional `EG_ColorChoice` colour.
 *
 * @remarks
 * When colour is `scheme`, it is a **reference** — never interchangeable with a
 * resolved RGB view.
 */
export interface SolidFill {
    /** Discriminant for a:solidFill. */
    readonly kind: 'solid';
    /** Direct colour choice under the solid fill; undefined if missing/invalid. */
    readonly color: ColorValue | undefined;
    /** Authored colour transforms in application order. */
    readonly colorTransforms?: ReadonlyArray<ThemeColorTransform>;
}
/**
 * `a:gradFill` — stops and attributes stay on the live DOM (opaque bag).
 */
export interface GradientFill {
    /** Discriminant for a:gradFill (stops remain on the live DOM). */
    readonly kind: 'gradient';
    readonly stops: ReadonlyArray<ThemeGradientStop>;
    /** Linear angle in degrees. */
    readonly angle: number | undefined;
    /** Authored `a:lin/@scaled`. */
    readonly scaled: boolean | undefined;
    /** Authored `a:gradFill/@rotWithShape`. */
    readonly rotateWithShape: boolean | undefined;
    readonly path: ThemeGradientPath | undefined;
    readonly fillToRect: ThemeGradientFillToRect | undefined;
}
/**
 * `a:blipFill` — relationship ids are recorded; targets are **not** fetched or decoded.
 *
 * @remarks
 * Security: classification must not open external `r:link` targets or decode image
 * bytes. Picture part ownership is a later task; this path only preserves markup.
 */
export interface BlipFill {
    /** Discriminant for a:blipFill. */
    readonly kind: 'blip';
    /** `a:blip/@r:embed` when present. */
    readonly embedRelationshipId: string | undefined;
    /** `a:blip/@r:link` when present (must not be fetched). */
    readonly linkRelationshipId: string | undefined;
}
/**
 * `a:pattFill` — pattern details stay on the live DOM (opaque bag).
 */
export interface PatternFill {
    /** Discriminant for a:pattFill (pattern details remain on the live DOM). */
    readonly kind: 'pattern';
    readonly preset: string | undefined;
    readonly foregroundColor: ColorValue | undefined;
    readonly foregroundTransforms: ReadonlyArray<ThemeColorTransform>;
    readonly backgroundColor: ColorValue | undefined;
    readonly backgroundTransforms: ReadonlyArray<ThemeColorTransform>;
}
/**
 * `a:grpFill` — inherits group fill; details stay on the live DOM.
 */
export interface GroupFill {
    /** Discriminant for a:grpFill (inherits group fill). */
    readonly kind: 'group';
}
/**
 * Direct line fill under `a:ln` (`EG_LineFillProperties`).
 *
 * @remarks
 * Line fill allows noFill, solidFill, gradFill, pattFill — not blipFill/grpFill
 * (Transitional `dml-main.xsd` `EG_LineFillProperties`).
 */
export type DirectLineFill = MissingFill | NoFill | SolidFill | GradientFill | PatternFill;
/**
 * Direct `a:ln` properties under `spPr`.
 *
 * @remarks
 * Width is EMUs (`ST_LineWidth`). Unmodeled children (join, ends, extLst) remain
 * on the live DOM for preserve.
 */
export interface DirectLine {
    /** True when an `a:ln` element exists under `spPr`. */
    readonly present: boolean;
    /** `a:ln/@w` in EMUs when present and parseable. */
    readonly widthEmu: number | undefined;
    /** `a:ln/@cap` when present. */
    readonly cap: string | undefined;
    /** `a:ln/@cmpd` compound line token when present. */
    readonly compound: string | undefined;
    /** `a:ln/@algn` pen alignment when present. */
    readonly align: string | undefined;
    /** `a:prstDash/@val` when a preset dash child is present. */
    readonly presetDash: string | undefined;
    /** Authored line join. */
    readonly join: LineJoin | undefined;
    /** Authored start line ending. */
    readonly headEnd: LineEnd | undefined;
    /** Authored end line ending. */
    readonly tailEnd: LineEnd | undefined;
    /** Line fill classification under `a:ln`. */
    readonly fill: DirectLineFill;
}

/** Direct line join choice. */
export type LineJoin = { readonly kind: 'round' } | { readonly kind: 'bevel' } |
{ readonly kind: 'miter'; readonly limit: number | undefined };

/** Direct `a:headEnd` / `a:tailEnd` tokens. */
export interface LineEnd {
    readonly type: string | undefined;
    readonly width: string | undefined;
    readonly length: string | undefined;
}
/**
 * One `CT_StyleMatrixReference` (`idx` required + optional colour choice).
 *
 * @remarks
 * Matrix index is a style-list reference into theme `fmtScheme`, not a flattened
 * solid fill. Optional colour often supplies `phClr` replacement context.
 */
export interface StyleMatrixReference {
    /** `ST_StyleMatrixColumnIndex` as decimal string (`@idx`). */
    readonly idx: string;
    /** Optional `EG_ColorChoice` under the ref element. */
    readonly color: ColorValue | undefined;
    /** Authored colour transforms under the reference colour choice, in source order. */
    readonly colorTransforms?: ReadonlyArray<ThemeColorTransform>;
}
/**
 * Optional `p:style` / `a:CT_ShapeStyle` references on a shape.
 *
 * @remarks
 * All four refs are required by the XSD when `style` is present; individual fields
 * may still be undefined if markup is incomplete. Never serialize these as direct
 * `spPr` solid fills.
 */
export interface ShapeStyleRefs {
    /** Optional p:style / CT_ShapeStyle line matrix reference (a:lnRef). */
    readonly lnRef: StyleMatrixReference | undefined;
    /** Optional p:style / CT_ShapeStyle fill matrix reference (a:fillRef). */
    readonly fillRef: StyleMatrixReference | undefined;
    /** Optional p:style / CT_ShapeStyle effect matrix reference (a:effectRef). */
    readonly effectRef: StyleMatrixReference | undefined;
    /** Optional p:style / CT_ShapeStyle font matrix reference (a:fontRef). */
    readonly fontRef: StyleMatrixReference | undefined;
}
/**
 * View-only effective fill after direct → style-ref consideration.
 *
 * @remarks
 * **Not** interchangeable with {@link DirectFill}. Never write this back in place of
 * `schemeClr` or `fillRef`. Full theme `fmtScheme` matrix expand is optional smoke:
 * style refs stay as refs.
 */
export type ResolvedFill = ResolvedDirectFill | ResolvedStyleRefFill | ResolvedMissingFill;
/** Resolved view when a direct `spPr` fill child is present (including noFill). */
export interface ResolvedDirectFill {
    /** Discriminant for a resolved direct fill view. */
    readonly kind: 'direct';
    /** Direct fill classification excluding missing (noFill, solid, gradient, …). */
    readonly fill: Exclude<DirectFill, MissingFill>;
    /** Always 'direct' when a spPr fill child is present. */
    readonly source: 'direct';
}
/**
 * Resolved view when direct fill is missing and `style/fillRef` is present.
 *
 * @remarks
 * Does not flatten to RGB solid. Theme matrix entry lookup remains a future expansion;
 * callers still see the matrix idx + optional colour.
 */
export interface ResolvedStyleRefFill {
    /** Discriminant for a resolved style fillRef view (not flattened RGB). */
    readonly kind: 'styleRef';
    /** Style-matrix fill reference used when direct fill is missing. */
    readonly fillRef: StyleMatrixReference;
    /** Always 'style' when fill comes from style/fillRef. */
    readonly source: 'style';
}
/** No direct fill and no fillRef. */
export interface ResolvedMissingFill {
    /** Discriminant for no direct fill and no fillRef. */
    readonly kind: 'missing';
    /** Always 'none' when neither direct fill nor fillRef is present. */
    readonly source: 'none';
}
