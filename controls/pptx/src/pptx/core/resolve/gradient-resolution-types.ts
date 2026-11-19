/** Internal effective gradient DTOs; never serialized as authored XML. */
import { ColorValue } from '../theme/color-value';
import { AuthoredGradientFill, GradientReadDiagnostic, GradientTileFlip } from '../theme/gradient-types';
import { ThemeColorTransform, ThemeGradientPath } from '../theme/theme-render-model';

/** One applicable host source, already ordered by the host's own traversal rules. @internal */
export interface GradientInheritanceSource {
    /** Caller-owned layer identity, e.g. direct, style or master placeholder. */
    readonly id: string;
    /** Missing means continue; another selected fill type blocks gradient selection. */
    readonly fill: AuthoredGradientFill | {
        readonly kind: 'missing' | 'none' | 'solid' | 'picture' | 'pattern' | 'group' | 'unknown';
    };
}
/** Provenance distinguishes Office defaults from present-element schema defaults. @internal */
export type GradientValueSource =
    { readonly kind: 'source'; readonly id: string; } |
    { readonly kind: 'schema-default'; readonly id: string; } |
    { readonly kind: 'office-default'; };
/** Invalid authored tokens block inheritance; missing required stop positions remain absent. @internal */
export type EffectiveGradientValue<T> =
    { readonly kind: 'absent'; readonly source: GradientValueSource; } |
    { readonly kind: 'value'; readonly value: T; readonly source: GradientValueSource; } |
    { readonly kind: 'invalid'; readonly raw: string; readonly source: GradientValueSource; };
/** View-only stop; color references and transform order remain unresolved. @internal */
export interface EffectiveGradientStop {
    /** Authored or default position, with provenance. */
    readonly position: EffectiveGradientValue<number>;
    /** Direct color choice, not a theme-resolved RGB replacement. */
    readonly color: ColorValue | undefined;
    /** Ordered direct transforms. */
    readonly colorTransforms: ReadonlyArray<ThemeColorTransform>;
}
/** Rectangle edges with per-field provenance. @internal */
export interface EffectiveGradientRectangle {
    /** Left inset/outset. */
    readonly left: EffectiveGradientValue<number>;
    /** Top inset/outset. */
    readonly top: EffectiveGradientValue<number>;
    /** Right inset/outset. */
    readonly right: EffectiveGradientValue<number>;
    /** Bottom inset/outset. */
    readonly bottom: EffectiveGradientValue<number>;
}
/** Resolved linear/path choice; fields never cross incompatible shading choices. @internal */
export type EffectiveGradientShade = {
    readonly kind: 'linear';
    readonly source: GradientValueSource;
    readonly angle: EffectiveGradientValue<number>;
    readonly scaled: EffectiveGradientValue<boolean>;
} | {
    readonly kind: 'path';
    readonly source: GradientValueSource;
    readonly path: EffectiveGradientValue<ThemeGradientPath>;
    readonly fillToRect: EffectiveGradientRectangle;
};
/** Non-mutating result, separate from sparse direct getter values. @internal */
export interface EffectiveGradientFill {
    /** Selected fill choice. */
    readonly kind: 'gradient';
    /** Layer that selected the fill choice. */
    readonly source: GradientValueSource;
    /** Whole stop list selected atomically, including invalid/empty lists. */
    readonly stops: { readonly values: ReadonlyArray<EffectiveGradientStop>; readonly source: GradientValueSource; };
    /** Effective compatible shading choice and fields. */
    readonly shade: EffectiveGradientShade;
    /** Per-field rotation provenance. */
    readonly rotateWithShape: EffectiveGradientValue<boolean>;
    /** Base Office default only; renderer-specific flip override is separate. */
    readonly flip: EffectiveGradientValue<GradientTileFlip>;
    /** Absent remains absent until paint bounds are chosen. */
    readonly tileRect: EffectiveGradientRectangle | undefined;
    /** Read diagnostics retain owning part and contributing source identity. */
    readonly diagnostics: ReadonlyArray<{ readonly source: string; readonly diagnostic: GradientReadDiagnostic; }>;
}
