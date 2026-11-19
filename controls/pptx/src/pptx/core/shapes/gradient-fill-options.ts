import { ColorValue } from '../theme/color-value';
/** An authored color operation. Amounts are ratios; hue/hueOff use degrees. @public */
export interface GradientColorOperation {
    /** Exact DrawingML EG_ColorTransform element name. Unsupported names are rejected. */
    readonly kind: string;
    /** Omit for comp/inv/gray/gamma/invGamma. Ratios use 1 = 100 percent. */
    readonly value?: number;
}
/** One edited stop. Theme references remain references. @public */
export interface GradientStopOptions {
    /** Normalized position in [0, 1]. Equal positions keep input order. */
    readonly position: number;
    /** One of the six existing authored DrawingML color choices. */
    readonly color: ColorValue;
    /** Operations applied in this order; no transform is baked into the color. */
    readonly transforms?: ReadonlyArray<GradientColorOperation>;
}
/** Relative inset/outset ratios; omitted edges remain absent. @public */
export interface GradientRectangleOptions {
    /** Left inset ratio; negative values are outsets. */
    readonly left?: number;
    /** Top inset ratio; negative values are outsets. */
    readonly top?: number;
    /** Right inset ratio; negative values are outsets. */
    readonly right?: number;
    /** Bottom inset ratio; negative values are outsets. */
    readonly bottom?: number;
}
/** A present shading choice. Omit fields to retain OOXML absence. @public */
export type GradientShadeOptions = {
    readonly kind: 'linear';
    /** Clockwise degrees in [0, 360). */
    readonly angle?: number;
    /** Aspect-scaled direction flag. */
    readonly scaled?: boolean;
} | {
    readonly kind: 'path';
    /** Exact path token; omission remains absent. */
    readonly path?: 'circle' | 'rect' | 'shape';
    /** Present empty rectangle differs from an absent rectangle. */
    readonly fillToRect?: GradientRectangleOptions;
};
/** Complete replacement input for Shape.setGradientFill. @public */
export interface GradientFillOptions {
    /** At least two stops, in authored order. No implicit sort. */
    readonly stops: ReadonlyArray<GradientStopOptions>;
    /** Optional shading choice. */
    readonly shade?: GradientShadeOptions;
    /** Optional rotation flag. */
    readonly rotateWithShape?: boolean;
    /** Optional tile flip token; painting may expose a narrower capability. */
    readonly flip?: 'none' | 'x' | 'y' | 'xy';
    /** Optional relative tile rectangle. */
    readonly tileRect?: GradientRectangleOptions;
}
