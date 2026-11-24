/**
 * Detect a DrawingML chart under a `graphicFrame` shape and bind a {@link Chart}
 * handle so `slide.shapes[n]` can be cast (tables/images parity).
 *
 * @remarks
 * Detection path (req/spec 037, same predicate as `isChartGraphicFrame` in
 * `resolve-chart`): `kind === 'graphicFrame'` → `a:graphic` → `a:graphicData`
 * with exact chart URI. Binding then resolves the chart relationship + part
 * through the owning document (sync path requires a warmed xlsx root —
 * `await ensureFeature(CHARTS_FEATURE_ID)`). Citation: Transitional
 * `pml.xsd` `CT_GraphicalObjectFrame`; ECMA-376 Part 1 §14.2.1.
 */
import { Chart } from './chart';
import { Shape } from '../../core/shapes/shape';
import { Presentation } from '../../core/package/index';
import { asChartSync, ChartInstance } from './resolve-chart';
import { getXlsxRootRequired } from './xlsx-surface';
import { arrayAt } from '../../core/util/es5-compat';
/**
 * Returns a {@link Chart} when `shape` is a chart graphic frame on `document`
 * and the xlsx root is warm; otherwise `undefined` (non-chart frames, cold
 * root, or incomplete chart hooks soft-skip).
 *
 * @public
 * @param {Shape} shape - Shape handle from the slide/group walk (`graphicFrame` or other).
 * @param {Presentation} document - Open presentation owning the chart part.
 * @returns {Chart | undefined} Bound chart handle, or `undefined`.
 */
export function asChartHandle(shape: Shape, document: Presentation): Chart | undefined {
    if (shape instanceof Chart) {
        return shape;
    }
    // Warm the engine synchronously when possible (statically imported root);
    // genuinely missing xlsx soft-skips (undefined), no throw from the cast.
    try {
        getXlsxRootRequired();
    }
    catch {
        return undefined;
    }
    let instance: ChartInstance | undefined;
    try {
        instance = asChartSync(shape, document);
    }
    catch {
        return undefined;
    }
    if (instance === undefined) {
        return undefined;
    }
    const hostShape: Shape = (instance.shape !== null && instance.shape !== undefined ? instance.shape : shape);
    const chart: Chart = new Chart(hostShape, instance, document);
    if (hostShape !== shape) {
        chart.adoptChartFrame(shape);
    }
    return chart;
}
/**
 * Upgrades walked slide shapes in place: chart graphic frames become
 * {@link Chart} handles (cast parity with `Table` / `Picture`). Non-chart
 * shapes pass through untouched. Soft-skips on cold xlsx or incomplete chart
 * hooks (no throw from `slide.shapes`).
 *
 * @internal
 * @param {ReadonlyArray<Shape>} shapes - Walked shapes for one slide.
 * @param {Presentation} document - Owning presentation.
 * @returns {ReadonlyArray<Shape>} Same length list with chart frames upgraded.
 */
export function upgradeChartShapes(shapes: ReadonlyArray<Shape>, document: Presentation): ReadonlyArray<Shape> {
    // Warm the engine synchronously when possible; missing xlsx passes through.
    try {
        getXlsxRootRequired();
    }
    catch {
        return shapes;
    }
    const out: Shape[] = [];
    for (let i: number = 0; i < shapes.length; i += 1) {
        const shape: Shape | undefined = arrayAt(shapes, i);
        if (shape === undefined) {
            break;
        }
        const chart: Chart | undefined = asChartHandle(shape, document);
        out.push(chart !== undefined ? chart : shape);
    }
    return out;
}
