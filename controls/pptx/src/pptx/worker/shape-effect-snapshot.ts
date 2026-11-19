/** Clone-safe direct shape effects needed by the browser render pipeline. */

import { ColorValue } from '../core/theme/color-value';
import { ThemeColorTransform } from '../core/theme/theme-render-model';

/** Direct `a:outerShdw` values; unknown sibling effect markup remains untouched. */
export interface OuterShadowEffectSnapshot {
    readonly kind: 'outerShadow';
    readonly blurRadiusEmu?: number;
    readonly distanceEmu?: number;
    readonly directionDegrees?: number;
    readonly alignment?: string;
    readonly rotateWithShape?: boolean;
    readonly scaleX?: number;
    readonly scaleY?: number;
    readonly skewXDegrees?: number;
    readonly skewYDegrees?: number;
    readonly color?: ColorValue;
    readonly colorTransforms: ReadonlyArray<ThemeColorTransform>;
}

/** Phase 1 direct effect subset. Unsupported effects remain in source XML. */
export type ShapeEffectSnapshot = OuterShadowEffectSnapshot;
