/**
 * Canonical authored gradient data for shared readers and clone-safe snapshots.
 *
 * @remarks
 * Internal expansion contract: existing public GradientFill/ThemeGradientStop
 * projections retain their required members. No resolved defaults, paint colors,
 * live DOM objects or editor state belong here. Sources: CT_GradientFillProperties,
 * CT_GradientStopList, CT_PathShadeProperties and CT_RelativeRect in both dialects.
 */
import { ColorValue } from './color-value';
import { ThemeColorTransform, ThemeGradientPath } from './theme-render-model';
import { GradientLexical } from './gradient-values';

/** Authored tile-flip token, distinct from the effective Office behavior. @internal */
export type GradientTileFlip = 'none' | 'x' | 'y' | 'xy';

/** One stop, including a missing/invalid position without coercion to zero. @internal */
export interface AuthoredGradientStop {
    /** Normalized ratio with original position token and validity. */
    readonly position: GradientLexical<number>;
    /** Direct color reference/choice; undefined when unrecognized or absent. */
    readonly color: ColorValue | undefined;
    /** Color transforms in authored order, without resolution. */
    readonly colorTransforms: ReadonlyArray<ThemeColorTransform>;
}

/** Present rectangle; each edge independently retains absence or invalidity. @internal */
export interface AuthoredGradientRectangle {
    /** Left inset/outset ratio; not bounded to 0..1. */
    readonly left: GradientLexical<number>;
    /** Top inset/outset ratio; not bounded to 0..1. */
    readonly top: GradientLexical<number>;
    /** Right inset/outset ratio; not bounded to 0..1. */
    readonly right: GradientLexical<number>;
    /** Bottom inset/outset ratio; not bounded to 0..1. */
    readonly bottom: GradientLexical<number>;
}

/** A present shading element, distinct from absent shading. @internal */
export type AuthoredGradientShade = {
    /** Linear shading element is authored even if its attributes are absent. */
    readonly kind: 'linear';
    /** Clockwise degrees from integer DrawingML angle units. */
    readonly angle: GradientLexical<number>;
    /** Authored aspect-scaled direction flag; no default applied. */
    readonly scaled: GradientLexical<boolean>;
} | {
    /** Path shading element is authored even if its path attribute is absent. */
    readonly kind: 'path';
    /** Circle/rectangle/shape token with absence/validity and raw value. */
    readonly path: GradientLexical<ThemeGradientPath>;
    /** Undefined means absent element; a present empty rectangle has absent edges. */
    readonly fillToRect: AuthoredGradientRectangle | undefined;
};

/** Location-aware read diagnostic; raw unsupported XML stays on the live DOM. @internal */
export interface GradientReadDiagnostic {
    /** Owning package part when supplied by the host reader. */
    readonly partName?: string;
    /** Relative field/element path inside the owning gradient. */
    readonly field: string;
    /** Stop index for a stop-specific issue, otherwise undefined. */
    readonly stopIndex: number | undefined;
    /** Diagnostic description without applying a fallback to authored data. */
    readonly message: string;
}

/** Complete sparse authored data, separate from effective values and paint. @internal */
export interface AuthoredGradientFill {
    /** Gradient classification; the owning host records its source/part identity. */
    readonly kind: 'gradient';
    /** Undefined is absent gsLst; an empty array is a present invalid empty list. */
    readonly stops: ReadonlyArray<AuthoredGradientStop> | undefined;
    /** Undefined is absent lin/path; a present empty path is explicit path shading. */
    readonly shade: AuthoredGradientShade | undefined;
    /** Rotation flag with authored absence/validity. */
    readonly rotateWithShape: GradientLexical<boolean>;
    /** Preserved tile-flip token; not the resolved Office flip rule. */
    readonly flip: GradientLexical<GradientTileFlip>;
    /** Undefined is absent tileRect; a present empty rectangle has absent edges. */
    readonly tileRect: AuthoredGradientRectangle | undefined;
    /** Read findings; never a reason to rewrite or drop the original subtree. */
    readonly diagnostics: ReadonlyArray<GradientReadDiagnostic>;
}
