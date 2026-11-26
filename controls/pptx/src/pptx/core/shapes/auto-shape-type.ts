/**
 * Predefined auto-shape kinds for {@link ShapeCollection.addShape}.
 *
 * @remarks
 * Public keys and values use PascalCase Office-facing names. On write, each
 * kind maps to a Transitional DrawingML `ST_ShapeType` token on
 * `a:prstGeom/@prst` — never invented strings.
 *
 * There is **no** `circle` token in `ST_ShapeType`. {@link AutoShapeType.Circle}
 * maps to wire `ellipse`; callers supply equal width and height when a visual
 * circle is required. {@link AutoShapeType.Oval} also maps to `ellipse` but
 * keeps a distinct public identity and default `cNvPr/@name`.
 *
 * Citation: Transitional `dml-main.xsd` `ST_ShapeType` (~1717) —
 * `line`, `rect`, `ellipse`, `arc` among the enumerated values;
 * `CT_PresetGeometry2D` `@prst` required (`~2088`).
 */
/**
 * Public auto-shape kinds (string enum; string literals are rejected at compile time).
 *
 * @remarks
 * Covers the five kinds requested for {@link ShapeCollection.addShape}:
 * Rectangle, Oval, Circle, Arc, and Line. Additional XSD enumerations
 * (e.g. `roundRect`, `triangle`) are intentionally not exposed until product
 * direction expands the surface.
 *
 * Values are **public kind identifiers** (not raw `ST_ShapeType` tokens) so
 * Circle and Oval remain distinguishable even though both write `prst="ellipse"`.
 * Use {@link autoShapePrst} for the OOXML token.
 *
 * @example
 * ```ts
 * import { AutoShapeType, Presentation } from '@syncfusion/ej2-pptx';
 *
 * const doc = Presentation.create();
 * doc.slides.add();
 * const slide = doc.slides[0];
 * if (slide !== undefined) {
 *   slide.shapes.addShape(AutoShapeType.Rectangle, {
 *     x: 0,
 *     y: 0,
 *     width: 1828800,
 *     height: 914400,
 *   });
 * }
 * ```
 */
import { arrayIncludes, objectValues, objectGet } from '../util/es5-compat';
export enum AutoShapeType {
    /** Rectangle → wire `rect`. */
    Rectangle = 'Rectangle',
    /** Oval → wire `ellipse`. */
    Oval = 'Oval',
    /**
     * Circle → wire `ellipse` (no `circle` in `ST_ShapeType`).
     * Use equal `width` and `height` for a visual circle.
     */
    Circle = 'Circle',
    /** Arc → wire `arc`. */
    Arc = 'Arc',
    /** Straight line auto-shape → wire `line` as `p:sp` + `prstGeom` (not `p:cxnSp`). */
    Line = 'Line'
}
/**
 * One public predefined auto-shape kind identifier.
 */
export type AutoShapeTypeValue = AutoShapeType;
/**
 * OOXML `ST_ShapeType` tokens emitted by this API for `a:prstGeom/@prst`.
 *
 * @remarks
 * Subset of Transitional `dml-main.xsd` `ST_ShapeType` (~1717).
 */
export type AutoShapePrst = 'rect' | 'ellipse' | 'arc' | 'line';
const AUTO_SHAPE_TYPE_VALUES: ReadonlyArray<AutoShapeTypeValue> = Object.freeze(objectValues<AutoShapeTypeValue>(AutoShapeType));
/**
 * Returns `true` when `value` is one of the public {@link AutoShapeType} kind ids.
 *
 * @param {string} value - Candidate string (public kind name, not an OOXML `prst` token).
 * @returns {boolean} `true` when `value` is Rectangle, Oval, Circle, Arc, or Line.
 */
export function isAutoShapeType(value: string): value is AutoShapeTypeValue {
    return arrayIncludes(AUTO_SHAPE_TYPE_VALUES as ReadonlyArray<string>, value);
}
/**
 * Default `cNvPr/@name` for each public auto-shape kind.
 *
 * @remarks
 * Circle keeps the public name `"Circle"` even though the wire `prst` is
 * `ellipse`, so round-tripped handles remain distinguishable from Oval.
 */
export const DEFAULT_AUTO_SHAPE_NAMES: Readonly<Record<AutoShapeTypeValue, string>> = Object.freeze({
    Rectangle: 'Rectangle',
    Oval: 'Oval',
    Circle: 'Circle',
    Arc: 'Arc',
    Line: 'Line'
});
/**
 * Maps a public {@link AutoShapeType} kind to its `ST_ShapeType` wire token.
 *
 * @remarks Citation: Transitional `dml-main.xsd` `ST_ShapeType` — `rect`, `ellipse`, `arc`, `line`. Circle has no distinct token and shares
 * `ellipse` with Oval.
 * @param {AutoShapeTypeValue} type - Public kind (`AutoShapeType.Rectangle`, …).
 * @returns {AutoShapePrst} OOXML `a:prstGeom/@prst` token.
 */
export function autoShapePrst(type: AutoShapeTypeValue): AutoShapePrst {
    switch (type) {
    case AutoShapeType.Rectangle:
        return 'rect';
    case AutoShapeType.Oval:
    case AutoShapeType.Circle:
        return 'ellipse';
    case AutoShapeType.Arc:
        return 'arc';
    case AutoShapeType.Line:
        return 'line';
    default: {
        const _exhaustive: any = type; // eslint-disable-line
        return _exhaustive;
    }
    }
}
/**
 * Resolves the default display name for a public auto-shape kind.
 *
 * @internal
 * @param {AutoShapeTypeValue} type - {@link AutoShapeType} kind.
 * @returns {string} Default `cNvPr/@name`.
 */
export function defaultAutoShapeName(type: AutoShapeTypeValue): string {
    const name: string | undefined = objectGet<string>(DEFAULT_AUTO_SHAPE_NAMES, String(type));
    return name === undefined ? String(type) : name;
}
