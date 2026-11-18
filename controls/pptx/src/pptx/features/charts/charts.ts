/**
 * Per-slide Charts collection (`length` + `at`).
 *
 * @remarks
 * Supported public access is {@link Charts.at} — not a numeric indexer
 * (`charts[i]` is not part of the locked product API). Out-of-range and
 * `Array.prototype.at` negative-index rules apply; OOB returns `undefined`.
 *
 * Materialization is **synchronous** and requires a warmed ej2-xlsx root
 * (`await loadXlsxRoot()` or `await ensureFeature(CHARTS_FEATURE_ID)`). When the
 * root is cold, chart frames soft-skip (empty collection) rather than throwing
 * from the getter. Incomplete hooks also soft-skip (spec 037).
 *
 * Citations: req/spec 037; ADR 2026-09-18 (`.at` lock); TASK-1068; API-RULES R1.6.
 */
import { Presentation } from '../../core/package/index';
import { Shape } from '../../core/shapes/shape';
import { Slide } from '../../core/slideimplementation/slide';
import { Chart } from './chart';
import { ChartsError } from './errors';
import { asChartSync, ChartInstance } from './resolve-chart';
import { getCachedXlsxRoot } from './xlsx-surface';
import { arrayAt } from '../../core/util/es5-compat';
/**
 * Ordered classic charts on one slide (document / shape-tree walk order).
 *
 * @public
 */
export class Charts {
    /**
     * @internal
     */
    private readonly items: ReadonlyArray<Chart>;
    /**
     * @internal
     * @param {*} items - Pre-resolved Chart handles (shape-tree order).
     */
    constructor(items: ReadonlyArray<Chart> = []) {
        this.items = items;
    }
    /**
     * Empty collection (detached slide with no owning document, or cold xlsx).
     *
     * @internal
     * @returns {Charts} The result.
     */
    static empty(): Charts {
        return EMPTY_CHARTS;
    }
    /**
     * Number of resolvable charts on this slide.
     *
     * @remarks Counts graphic frames that bind successfully via {@link asChartSync}. Incomplete chart hooks are soft-skipped so the getter
     * does not throw while enumerating. Order matches the slide shape-tree walk (`slide.shapes`).
     * @returns {number} The result.
     */
    get length(): number {
        return this.items.length;
    }
    /**
     * Returns the chart at `index`, using `Array.prototype.at` semantics.
     *
     * @remarks **Locked product API** (ADR 2026-09-18): use `.at(index)`, not `charts[index]`. Extreme negatives and indexes ≥ `length`
     * yield `undefined` (no throw). `Math.trunc` is applied (same as `Array.prototype.at`).
     * @example ```ts import '@syncfusion/ej2-pptx/charts'; await loadXlsxRoot(); // or ensureFeature(CHARTS_FEATURE_ID) const chart =
     * slide.charts.at(0); ```
     * @param {number} index - Zero-based index, or negative index from the end (`-1` is last).
     * @returns {Chart | undefined} The {@link Chart} handle, or `undefined` when out of range.
     */
    at(index: number): Chart | undefined {
        const len: number = this.items.length;
        const relative: number = Math.trunc(index);
        const k: number = relative < 0 ? len + relative : relative;
        if (k < 0 || k >= len) {
            return undefined;
        }
        return arrayAt(this.items, k);
    }
}
/** Shared empty instance for unbound slides / cold xlsx. */
const EMPTY_CHARTS: Charts = new Charts([]);
/**
 * Soft-bind: non-chart → undefined; incomplete chart frame → undefined;
 * cold xlsx → undefined (ChartsError from asChartSync).
 *
 * @param {Shape} shape - The shape value.
 * @param {Presentation} document - The document value.
 * @returns {ChartInstance | undefined} The result.
 */
function tryResolveChart(shape: Shape, document: Presentation): ChartInstance | undefined {
    try {
        return asChartSync(shape, document);
    }
    catch (err) {
        if (err instanceof ChartsError) {
            return undefined;
        }
        throw err;
    }
}
/**
 *
 * @param {Slide} slide - The slide value.
 * @param {Presentation} document - The document value.
 * @returns {*} The result.
 */
function materializeCharts(slide: Slide, document: Presentation): ReadonlyArray<Chart> {
    // Sync public API: require warmed xlsx root (dynamic import is async).
    if (getCachedXlsxRoot() === undefined) {
        return [];
    }
    const result: Chart[] = [];
    for (let i: number = 0; i < slide.shapes.length; i++) {
        const shape: Shape = arrayAt(slide.shapes, i);
        const instance: ChartInstance = tryResolveChart(shape, document);
        if (instance === undefined) {
            continue;
        }
        // Shape must be present on resolved collection entries (graphicFrame walk).
        const hostShape: Shape = (instance.shape !== null && instance.shape !== undefined ? instance.shape : shape);
        result.push(new Chart(hostShape, instance, document));

    }
    return result;
}
/**
 * Builds a {@link Charts} collection for a slide when a document is bound.
 *
 * @internal
 * @param {Slide} slide - Slide instance (must have presentation document attached).
 * @returns {Charts} Collection; empty when the slide has no owning document or xlsx is cold.
 */
export function chartsForSlide(slide: Slide): Charts {
    const document: Presentation = slide.getPresentation();
    if (document === undefined) {
        return Charts.empty();
    }
    return new Charts(materializeCharts(slide, document));
}
