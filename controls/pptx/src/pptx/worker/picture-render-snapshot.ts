/**
 * JSON-safe picture data emitted by the lazy presentation Worker.
 *
 * @remarks
 * Authored relationship ids and DrawingML values are kept in `direct`; OPC
 * targets and package metadata are kept in `resolved`. External targets are
 * metadata only and must never be fetched by the library.
 */

/** Fractional rectangle values converted from DrawingML 1/100000 percentages. */
export interface PictureRelativeRectangleSnapshot {
    /** Fraction inset from the left edge. */
    readonly left?: number;
    /** Fraction inset from the top edge. */
    readonly top?: number;
    /** Fraction inset from the right edge. */
    readonly right?: number;
    /** Fraction inset from the bottom edge. */
    readonly bottom?: number;
}

/** Authored stretch settings under `a:blipFill`. */
export interface PictureStretchSnapshot {
    /** Optional authored `a:fillRect`. */
    readonly fillRectangle?: PictureRelativeRectangleSnapshot;
}

/** Authored tile settings under `a:blipFill`. */
export interface PictureTileSnapshot {
    /** Horizontal tile offset in EMUs. */
    readonly offsetXEmu?: number;
    /** Vertical tile offset in EMUs. */
    readonly offsetYEmu?: number;
    /** Horizontal scale converted from 1/100000 percentage units. */
    readonly scaleX?: number;
    /** Vertical scale converted from 1/100000 percentage units. */
    readonly scaleY?: number;
    /** Authored DrawingML tile flip token. */
    readonly flip?: PictureTileFlip;
    /** Authored DrawingML tile alignment token. */
    readonly alignment?: PictureTileAlignment;
}

/** DrawingML tile mirror mode. */
export type PictureTileFlip = 'none' | 'x' | 'y' | 'xy';

/** DrawingML rectangle alignment used by tiled pictures. */
export type PictureTileAlignment = 'tl' | 't' | 'tr' | 'l' | 'ctr' | 'r' | 'bl' | 'b' | 'br';

/** Known ordered `a:blip` effect kind. */
export type PictureBlipEffectKind = 'alphaBiLevel' | 'alphaCeiling' | 'alphaFloor' | 'alphaInverse' | 'alphaMod' |
'alphaModFix' | 'alphaOffset' | 'biLevel' | 'colorChange' | 'colorReplace' | 'duotone' | 'grayscale' | 'luminance' |
'unknown';

/** JSON-safe DrawingML colour used by a picture effect. */
export interface PictureEffectColorSnapshot {
    /** Colour model local name such as `srgb`, `scheme`, or `system`. */
    readonly kind: string;
    /** Authored colour token, when that model uses `val`. */
    readonly value?: string;
    /** Authored system-colour fallback. */
    readonly lastColor?: string;
    /** Authored scRGB red channel. */
    readonly red?: string;
    /** Authored scRGB green channel. */
    readonly green?: string;
    /** Authored scRGB blue channel. */
    readonly blue?: string;
    /** Authored HSL hue channel. */
    readonly hue?: string;
    /** Authored HSL saturation channel. */
    readonly saturation?: string;
    /** Authored HSL luminance channel. */
    readonly luminance?: string;
    /** Ordered authored colour transforms. */
    readonly transforms: ReadonlyArray<{ readonly kind: string; readonly value?: number }>;
}

/** Ordered direct effect under `a:blip`. */
export interface PictureBlipEffectSnapshot {
    /** Normalized effect kind. */
    readonly kind: PictureBlipEffectKind;
    /** Original local element name, including for unknown effects. */
    readonly authoredKind: string;
    /** Fractional amount for alpha effects. */
    readonly amount?: number;
    /** Fractional threshold for bilevel effects. */
    readonly threshold?: number;
    /** Fractional brightness for luminance effects. */
    readonly brightness?: number;
    /** Fractional contrast for luminance effects. */
    readonly contrast?: number;
    /** Ordered authored colours for duotone/recolour effects. */
    readonly colors: ReadonlyArray<PictureEffectColorSnapshot>;
}

/** Direct relationship ids from a picture fallback branch. */
export interface PictureDirectRelationshipSnapshot {
    /** Authored internal `r:embed` id. */
    readonly embedRelationshipId?: string;
    /** Authored external `r:link` id. */
    readonly linkRelationshipId?: string;
}

/** Direct, authored `p:pic` values before relationship resolution. */
export interface PictureDirectSnapshot extends PictureDirectRelationshipSnapshot {
    /** Authored SVG extension relationship id. */
    readonly svgRelationshipId?: string;
    /** Authored crop rectangle. */
    readonly sourceRectangle?: PictureRelativeRectangleSnapshot;
    /** Authored stretch settings. */
    readonly stretch?: PictureStretchSnapshot;
    /** Authored tile settings. */
    readonly tile?: PictureTileSnapshot;
    /** Ordered authored blip effects. */
    readonly effects: ReadonlyArray<PictureBlipEffectSnapshot>;
    /** Relationship ids from `mc:Fallback`, when the picture is wrapped in Alternate Content. */
    readonly alternateContentFallback?: PictureDirectRelationshipSnapshot;
}

/** Pixel dimensions read from a supported image header. */
export interface PictureIntrinsicSizeSnapshot {
    /** Intrinsic image width in pixels. */
    readonly widthPx: number;
    /** Intrinsic image height in pixels. */
    readonly heightPx: number;
}

/** Resolved embedded picture part metadata. */
export interface PictureEmbeddedSourceSnapshot {
    /** Source discriminator. */
    readonly kind: 'embedded';
    /** Relationship id that selected this package part. */
    readonly relationshipId: string;
    /** Absolute OPC part name. */
    readonly partName: string;
    /** Declared or safely inferred media type. */
    readonly mimeType: string;
    /** Opaque token for an on-demand Worker media request. */
    readonly mediaRequestId: string;
    /** Header-derived intrinsic size when supported. */
    readonly intrinsicSize?: PictureIntrinsicSizeSnapshot;
}

/** Resolved external picture metadata; the target is never fetched by the library. */
export interface PictureLinkedSourceSnapshot {
    /** Source discriminator. */
    readonly kind: 'linked';
    /** Relationship id that selected this external target. */
    readonly relationshipId: string;
    /** Authored OPC external Target. */
    readonly target: string;
}

/** Resolved sources for a primary or Alternate Content fallback picture. */
export interface PictureResolvedRelationshipSnapshot {
    /** Resolved package part for `r:embed`. */
    readonly embedded?: PictureEmbeddedSourceSnapshot;
    /** Resolved external Target for `r:link`; never fetched. */
    readonly linked?: PictureLinkedSourceSnapshot;
}

/** Relationship-resolved picture sources, separate from authored ids. */
export interface PictureResolvedSnapshot extends PictureResolvedRelationshipSnapshot {
    /** Resolved SVG extension part, when present. */
    readonly svg?: PictureEmbeddedSourceSnapshot;
    /** Resolved relationship data from the `mc:Fallback` picture. */
    readonly alternateContentFallback?: PictureResolvedRelationshipSnapshot;
}

/** Clone-safe render data for one `p:pic`. */
export interface PictureRenderSnapshot {
    /** Authored non-visual description (`cNvPr/@descr`). */
    readonly description?: string;
    /** Authored non-visual title (`cNvPr/@title`). */
    readonly title?: string;
    /** Direct DrawingML values and relationship ids. */
    readonly direct: PictureDirectSnapshot;
    /** Resolved OPC targets and media metadata. */
    readonly resolved: PictureResolvedSnapshot;
}

/** Clone-safe render data for a shape-level DrawingML `a:blipFill`. */
export type ShapePictureFillRenderSnapshot = PictureRenderSnapshot;

/** Request for one picture part retained by the Worker. */
export interface PictureMediaRequest {
    /** Worker message discriminator. */
    readonly type: 'media';
    /** Caller correlation id. */
    readonly requestId: string;
    /** Opaque id supplied by `PictureEmbeddedSourceSnapshot`. */
    readonly mediaRequestId: string;
}

/** Transferable response containing one requested package image part. */
export interface PictureMediaResponse {
    /** Worker message discriminator. */
    readonly type: 'media';
    /** Caller correlation id. */
    readonly requestId: string;
    /** Opaque id from the request. */
    readonly mediaRequestId: string;
    /** Declared or safely inferred media type. */
    readonly mimeType: string;
    /** Header-derived intrinsic size when supported. */
    readonly intrinsicSize?: PictureIntrinsicSizeSnapshot;
    /** Exact package-part bytes, transferred rather than cloned. */
    readonly data: ArrayBuffer;
}
