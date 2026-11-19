import { ChartGradientPaintOverride } from './chart-gradient-export';
import { SecurityLimits } from '../../core/security/limits';
import { chartTextBody, primaryChartTitleTextKey, ChartTextTarget, ChartTextLane } from './chart-text-source';
import { TextBody } from '../../core/text/text-body';
import { chartGradientOwner, replaceChartGradientFill, ChartGradientTarget, ChartGradientLane } from './chart-gradient-target';
import { GradientFillOptions } from '../../core/shapes/gradient-fill-options';
import { GradientStopEditor } from '../../core/shapes/gradient-stop-editor';
import { GradientFillError, buildGradientFill } from '../../core/shapes/write-gradient-fill';
import { findChild } from '../../core/shapes/dom-utils';
import { PackagePart } from '../../core/package/package-model';
import { PackagePartAccess } from '../../core/package/package-part-access';
import { getCachedXlsxRoot, Ej2XlsxRootModule } from './xlsx-surface';
import { getXlsxChartHostApi } from './xlsx-chart-api';
import { notifySourceSlideDirty, markChartGradientPaintOverride } from './chart-data-edit';
import { readChartGradientSources, ChartGradientSource } from './chart-gradient-sources';
import { OoxmlElement, parseXml, serializeXml } from '../../core/xml/dom';
/**
 * Chart handle bound to a slide graphicFrame + chart instance.
 *
 * @remarks
 * TASK-1068: public read surface on `slide.charts` (`length` + `.at`).
 * TASK-1071: dual-write data edit (`dataRange`, series formulas, cell-backed
 * values) + {@link Chart.refresh}. Mutations open the embedded xlsx under
 * nested package limits, rebuild a session host chart (ej2-xlsx does not
 * round-trip worksheet charts after `Workbook.save`), update formulas / cells,
 * then flush chart part XML + embedding bytes via `PackagePartAccess.setPart`.
 *
 * TASK-1072: title / chart area / plot area **properties** (no `setTitle`
 * `applyTitle` public verbs). Writes dual-flush via the same session path.
 * Title colour and frame fill/line accept RRGGBB only (engine rejects theme
 * objects — never schemeClr → sRGB write-back on this path).
 *
 * TASK-1073: series name / values (formulas + cell dual-write), `serieFormat`
 * (`c:ser`/`c:spPr`), series `dataLabels` (`c:dLbls`), and collection mutators
 * {@link Chart.addSeries} / {@link Chart.removeSeries} only (R1.1). Nested
 * format bags flush via {@link Chart.commitSeriesFormat}
 * {@link Chart.commitSeriesDataLabels}.
 *
 * TASK-1074: `hasLegend` / `legend` (position, textArea, frameFormat) dual-write.
 * No public `setLegend` / `applyDataLabels` verbs (ADR 2026-09-18). Chart-level
 * plot `c:dLbls` is not a separate live bag on the engine — series
 * {@link Chart.commitSeriesDataLabels} is the modelled data-label path.
 *
 * TASK-1075: `primaryCategoryAxis` / `primaryValueAxis` (title, visible,
 * gridlines, scale, ticks, line, numberFormat, titleArea). No public
 * `setAxis` verbs. Secondary / date / series axes deferred (ADR).
 *
 * **Honesty:** dual-write keeps `c:f` + embedding cells; presentation-chart
 * `numCache`/`strCache` are filled from those cells only (never fabricated).
 * `refresh()` does **not** run full Excel calculation, trendlines, OLE
 * automation, or network fetch for external-only data sources.
 *
 * Citations: ECMA-376 Part 1 §14.2.1 / plotArea+title; Part 4 §12.2.1;
 * req/spec 037; ADR 2026-09-18; DRAWINGML_CHART_URI.
 */
import { Presentation } from '../../core/package/index';
import { Shape } from '../../core/shapes/shape';
import { arrayAt } from '../../core/util/es5-compat';
import {
    AddChartSeriesOptions,
    ChartEditSession,
    ChartSeriesView,
    ensureEditSession,
    flushDualWrite,
    readValuesAlongFormula,
    refreshChartFromEmbedding,
    requireEmbeddedForEdit,
    seriesFormulasFromParsed,
    writeValuesAlongFormula
} from './chart-data-edit';
import { ChartsError } from './errors';
import { chartHasColorStyle, chartHasEmbeddedPackage, chartHasStyle, chartHasUnknownRelatedParts, chartHasUserShapes,
    chartPartName } from './read-model';
import { ChartInstance } from './resolve-chart';
import { ChartAxisFormat, ChartDataSource, ChartFrameFillFormat, ChartFrameFormat, ChartFrameLineFormat,
    ChartLegendFormat, ChartSeriesDataLabels, ChartTitleAreaFormat, ParsedChartSpace,
    HostChartSeries } from './xlsx-chart-api';
export { AddChartSeriesOptions, ChartSeriesView } from './chart-data-edit';
export { ChartAxisFormat, ChartFrameFillFormat, ChartFrameFormat, ChartFrameLineFormat, ChartLegendFormat,
    ChartSeriesDataLabels, ChartTitleAreaFormat } from './xlsx-chart-api';
/**
 * One classic DrawingML chart on a slide (graphicFrame + chart part).
 *
 * @public
 */
export class Chart {
    /** @internal */
    private readonly _shape: Shape;
    /** @internal */
    private readonly instance: ChartInstance;
    /**
     * Owning presentation (package access for dual-write / refresh).
     *
     * @internal
     */
    private readonly document: Presentation;
    /**
     * Lazy dual-write session (host chart + open embedding workbook).
     *
     * @internal
     */
    private editSession: ChartEditSession | undefined;
    /**
     * @internal
     * @param {Shape} shape - Host graphicFrame shape (id stable; never renumbered).
     * @param {ChartInstance} instance - Bound ChartInstance from package-graph resolve.
     * @param {Presentation} document - Owning presentation (package access for later tasks).
     */
    constructor(shape: Shape, instance: ChartInstance, document: Presentation) {
        this._shape = shape;
        this.instance = instance;
        this.document = document;
    }
    /**
     * Attaches the chart-local cell grid created by `addChart` so the first edit
     * is a synchronous cache hit (no embedding reopen).
     *
     * @internal
     * @param {ChartEditSession} session - Session whose sheet is a {@link ChartCellSheet}.
     * @returns {void}
     */
    attachAuthoringSession(session: ChartEditSession): void {
        this.editSession = session;
    }
    private gradientSource: { root: OoxmlElement; xml: string; active: boolean } | undefined;
    /**
     * Replaces only a direct chart source fill, retaining symbolic theme colors and line metadata.
     *
     * @param {ChartGradientTarget} target - Existing area/title/legend/series, or explicit point override.
     * @param {GradientFillOptions} options - Validated authored gradient options.
     * @param {ChartGradientLane} lane - Independent fill or outline; defaults to fill.
     * @returns {void} Nothing. Workbook and relationships are not rewritten.
     */
    setSourceGradientFill(target: ChartGradientTarget, options: GradientFillOptions, lane: ChartGradientLane = 'fill'): void {
        const record: { root: OoxmlElement; xml: string; active: boolean } = this.sourceGradientRoot();
        const main: string = record.root.namespaceUri === 'http://purl.oclc.org/ooxml/drawingml/chart' ?
            'http://purl.oclc.org/ooxml/drawingml/main' : 'http://schemas.openxmlformats.org/drawingml/2006/main';
        const fill: OoxmlElement = buildGradientFill(options, main, this.partName);
        if (lane !== 'fill' && lane !== 'outline') { throw new GradientFillError(this.partName, 'chart.lane'); }
        const owner: OoxmlElement | undefined = chartGradientOwner(record.root, target, true, this.partName);
        if (owner === undefined) { throw new GradientFillError(this.partName, 'chart.target'); }
        replaceChartGradientFill(owner, lane, fill, main); this.publishGradientSource(record);
    }
    /**
     * Sets explicit noFill on one direct source paint lane.
     *
     * @param {ChartGradientTarget} target - Exact source target.
     * @param {ChartGradientLane} lane - Fill or outline.
     * @returns {void} Nothing.
     */
    setSourceNoFill(target: ChartGradientTarget, lane: ChartGradientLane = 'fill'): void {
        const record: { root: OoxmlElement; xml: string; active: boolean } = this.sourceGradientRoot();
        if (lane !== 'fill' && lane !== 'outline') { throw new GradientFillError(this.partName, 'chart.lane'); }
        const main: string = record.root.namespaceUri === 'http://purl.oclc.org/ooxml/drawingml/chart' ?
            'http://purl.oclc.org/ooxml/drawingml/main' : 'http://schemas.openxmlformats.org/drawingml/2006/main';
        const owner: OoxmlElement | undefined = chartGradientOwner(record.root, target, true, this.partName);
        if (owner === undefined) { throw new GradientFillError(this.partName, 'chart.target'); }
        replaceChartGradientFill(owner, lane, { kind: 'element', namespaceUri: main, localName: 'noFill', attributes: [], children: [] }, main);
        this.publishGradientSource(record);
    }
    /**
     * Removes only direct fill alternatives. Existing carrier and line metadata remain.
     *
     * @param {ChartGradientTarget} target - Exact source target; a missing point is a no-op.
     * @param {ChartGradientLane} lane - Fill or outline.
     * @returns {void} Nothing.
     */
    clearSourceFill(target: ChartGradientTarget, lane: ChartGradientLane = 'fill'): void {
        const record: { root: OoxmlElement; xml: string; active: boolean } = this.sourceGradientRoot();
        if (lane !== 'fill' && lane !== 'outline') { throw new GradientFillError(this.partName, 'chart.lane'); }
        const main: string = record.root.namespaceUri === 'http://purl.oclc.org/ooxml/drawingml/chart' ?
            'http://purl.oclc.org/ooxml/drawingml/main' : 'http://schemas.openxmlformats.org/drawingml/2006/main';
        const owner: OoxmlElement | undefined = chartGradientOwner(record.root, target, false, this.partName);
        if (owner !== undefined && replaceChartGradientFill(owner, lane, undefined, main)) { this.publishGradientSource(record); }
    }
    /**
     * Acquires a selective stop session; replacement or later engine export makes it stale.
     *
     * @param {ChartGradientTarget} target - Existing source gradient target.
     * @param {ChartGradientLane} lane - Fill or outline.
     * @returns {GradientStopEditor} Dispose after editing.
     */
    editSourceGradientFill(target: ChartGradientTarget, lane: ChartGradientLane = 'fill'): GradientStopEditor {
        const record: { root: OoxmlElement; xml: string; active: boolean } = this.sourceGradientRoot();
        if (lane !== 'fill' && lane !== 'outline') { throw new GradientFillError(this.partName, 'chart.lane'); }
        const main: string = record.root.namespaceUri === 'http://purl.oclc.org/ooxml/drawingml/chart' ?
            'http://purl.oclc.org/ooxml/drawingml/main' : 'http://schemas.openxmlformats.org/drawingml/2006/main';
        return new GradientStopEditor((): OoxmlElement | undefined => {
            this.assertGradientSource(record);
            const owner: OoxmlElement | undefined = chartGradientOwner(record.root, target, false, this.partName);
            const properties: OoxmlElement | undefined = owner === undefined ? undefined : findChild(owner, owner.namespaceUri, 'spPr');
            const parent: OoxmlElement | undefined = properties === undefined ? undefined : lane === 'fill' ? properties :
                findChild(properties, main, 'ln');
            return parent === undefined ? undefined : findChild(parent, main, 'gradFill');
        }, this.partName, (): void => this.publishGradientSource(record));
    }
    /**
     * Formats existing chart rich text or independent text defaults atomically.
     *
     * @remarks Reuses TextBody/TextRange/Font glyph and decoration source contracts.
     * Rich text never replaces a field reference; defaults may create txPr explicitly.
     * The synchronous callback receives an isolated body. Retained objects cannot mutate
     * the chart later. Workbook/data caches and unrelated source remain unchanged.
     * @param {ChartTextTarget} target - Existing title, legend, axis or data-label owner.
     * @param {Function} edit - Synchronous canonical text formatting callback; throw to discard.
     * @param {ChartTextLane} lane - Rich content by default, or independent text defaults.
     * @returns {void} Publishes one validated chart-part mutation after the callback succeeds.
     * @throws {GradientFillError} Invalid/ambiguous source, asynchronous callback, stale source or destination limits.
     */
    editSourceText(target: ChartTextTarget, edit: (body: TextBody) => void, lane: ChartTextLane = 'rich'): void {
        if (typeof edit !== 'function') { throw new GradientFillError(this.partName, 'chart.text.callback'); }
        const record: { root: OoxmlElement; xml: string; active: boolean } = this.sourceGradientRoot();
        const limits: SecurityLimits = this.document.packagePartAccess().limits;
        const candidate: OoxmlElement = parseXml(record.xml, { limits, partName: this.partName });
        const body: OoxmlElement = chartTextBody(candidate, target, lane, this.partName);
        const result: unknown = edit(new TextBody(body, limits, this.partName));
        if (result !== null && (typeof result === 'object' || typeof result === 'function') &&
            typeof Reflect.get(result, 'then') === 'function') {
            void Promise.resolve(result).catch((): void => undefined);
            throw new GradientFillError(this.partName, 'chart.text.callback');
        }
        this.assertGradientSource(record);
        const xml: string = serializeXml(candidate);
        if (new TextEncoder().encode(xml).byteLength > limits.singlePartUncompressedBytes) {
            throw new GradientFillError(this.partName, 'chart.source.size');
        }
        if (xml === record.xml) { return; }
        record.root = parseXml(xml, { limits, partName: this.partName });
        this.publishGradientSource(record);
    }
    /** @returns {object} Current source root, parsed lazily under package limits. */
    private sourceGradientRoot(): { root: OoxmlElement; xml: string; active: boolean } {
        if (this.gradientSource === undefined || !this.gradientSource.active || this.gradientSource.xml !== this.instance.originalXml) {
            this.gradientSource = { root: parseXml(this.instance.originalXml, {
                limits: this.document.packagePartAccess().limits, partName: this.partName
            }), xml: this.instance.originalXml, active: true };
        }
        this.assertGradientSource(this.gradientSource); return this.gradientSource;
    }
    /**
     * @param {object} record - Bound source session.
     * @param {OoxmlElement} record.root - Parsed source.
     * @param {string} record.xml - Last published source bytes.
     * @param {boolean} record.active - Session liveness.
     * @returns {void} Nothing; stale/foreign/missing sources throw before mutation.
     */
    private assertGradientSource(record: { root: OoxmlElement; xml: string; active: boolean }): void {
        const part: PackagePart | undefined = this.document.packagePartAccess().getPart(this.partName);
        if (!record.active || record !== this.gradientSource || record.xml !== this.instance.originalXml ||
            part === undefined || new TextDecoder().decode(part.data) !== record.xml ||
            (this.editSession !== undefined && this.editSession.dirty)) { throw new GradientFillError(this.partName, 'chart.source.stale'); }
    }
    /**
     * @param {object} record - Already validated source mutation.
     * @param {OoxmlElement} record.root - Parsed source.
     * @param {string} record.xml - Last published XML.
     * @param {boolean} record.active - Liveness flag.
     * @returns {void} Publishes only the chart part and its parsed read view.
     */
    private publishGradientSource(record: { root: OoxmlElement; xml: string; active: boolean }): void {
        try {
            this.assertGradientSource(record);
            const access: PackagePartAccess = this.document.packagePartAccess();
            const xml: string = serializeXml(record.root);
            const bytes: Uint8Array = new TextEncoder().encode(xml);
            if (bytes.byteLength > access.limits.singlePartUncompressedBytes) { throw new GradientFillError(this.partName, 'chart.source.size'); }
            parseXml(xml, { limits: access.limits, partName: this.partName });
            const module: Ej2XlsxRootModule | undefined = getCachedXlsxRoot();
            if (module === undefined) { throw new GradientFillError(this.partName, 'chart.engine'); }
            const parsed: ParsedChartSpace | undefined = getXlsxChartHostApi(module).parseChartSpace(xml, undefined, this.partName);
            const part: PackagePart | undefined = access.getPart(this.partName);
            if (parsed === undefined || part === undefined) { throw new GradientFillError(this.partName, 'chart.source'); }
            access.setPart({ name: part.name, contentType: part.contentType, data: bytes });
            const current: { originalXml: string; parsed: ParsedChartSpace; sourcePaintAuthored?: boolean } = this.instance;
            current.originalXml = xml; current.parsed = parsed; current.sourcePaintAuthored = true; record.xml = xml;
            notifySourceSlideDirty(this.document, this.instance.sourcePartName);
        } catch (error) { record.active = false; throw error; }
    }
    /**
     * Complete direct body/outline source fills for existing classic chart owners.
     *
     * @remarks Does not resolve theme/style references or apply engine paint defaults. Paths belong to this snapshot.
     * @returns {ReadonlyArray<ChartGradientSource>} Clone-safe authored source inventory; no XML mutation.
     */
    get authoredGradientSources(): ReadonlyArray<ChartGradientSource> {
        return readChartGradientSources(parseXml(this.instance.originalXml, {
            limits: this.document.packagePartAccess().limits, partName: this.partName
        }), this.partName);
    }
    /**
     * Host graphic-frame shape for this chart.
     *
     * @remarks Shape {@link Shape.id} is the authored `cNvPr/@id` and is never renumbered by this module (animations / hyperlinks /
     * comments may reference it).
     * @returns {Shape} The result.
     */
    get shape(): Shape {
        return this._shape;
    }
    /**
     * Absolute chart part name (`/ppt/charts/chartN.xml`).
     *
     * @returns {string} The result.
     */
    get partName(): string {
        return chartPartName(this.instance);
    }
    /**
     * Relationship id from `c:chart/@r:id` on the slide (or source) part.
     *
     * @returns {string} The result.
     */
    get relationshipId(): string {
        return this.instance.relationshipId;
    }
    /**
     * Original chart part XML (UTF-8). Preserve authority for unmutated parts (req 022).
     *
     * @returns {string} The result.
     */
    get originalXml(): string {
        return this.instance.originalXml;
    }
    /**
     * Engine chart type string from `parseChartSpace` (may be empty / unknown).
     *
     * @remarks Read-only bridge of {@link ParsedChartSpace.type}. Type mutation is not part of TASK-1071 dual-write (series / dataRange /
     * refresh only).
     * @returns {string} The result.
     */
    get type(): string {
        return this.instance.parsed.type;
    }
    /**
     * Whether the chart reports a title (`c:title` when exported).
     *
     * @remarks Setter dual-writes via the edit session. Prefer {@link Chart.applyHasTitle} when you need to await the flush. No public
     * `setTitle` verb (ADR 2026-09-18).
     * @returns {boolean} The result.
     */
    get hasTitle(): boolean {
        if (this.editSession !== undefined) {
            return this.editSession.hostChart.hasTitle === true;
        }
        return this.instance.parsed.hasTitle === true;
    }
    /**
     *
     * @param {boolean} value - The value value.
     * @returns {void} Nothing.
     */
    set hasTitle(value: boolean) {
        void this.applyHasTitle(value);
    }
    /**
     * Whether the chart reports a legend (`c:legend` when exported).
     *
     * @remarks Setter dual-writes via the edit session. Prefer {@link Chart.applyHasLegend} when you need to await the flush. No public
     * `setLegend` verb (ADR 2026-09-18).
     * @returns {boolean} The result.
     */
    get hasLegend(): boolean {
        if (this.editSession !== undefined) {
            return this.editSession.hostChart.hasLegend === true;
        }
        return this.instance.parsed.hasLegend === true;
    }
    /**
     *
     * @param {boolean} value - The value value.
     * @returns {void} Nothing.
     */
    set hasLegend(value: boolean) {
        void this.applyHasLegend(value);
    }
    /**
     * Legend position, text area, and frame (`c:legend` / `c:legendPos` / spPr).
     *
     * @remarks Live mutable bag while a session is open; otherwise a snapshot from parse. Nested mutations need {@link Chart.commitLegend}
     * (or another dual-write flush). Position strings match engine `LegendPosition` (`bottom` | `top` | `left` | `right` | `corner`).
     * Colours are RRGGBB only.
     * @returns {ChartLegendFormat} The result.
     */
    get legend(): ChartLegendFormat {
        if (this.editSession !== undefined) {
            return this.editSession.hostChart.legend;
        }
        return snapshotLegend(this.instance.parsed);
    }
    /**
     * Primary category (X) axis — engine `primaryCategoryAxis` → `c:catAx`.
     *
     * @remarks Live mutable bag while a session is open; otherwise a cold snapshot from parse (`categoryAxis`). Nested mutations need
     * {@link Chart.commitPrimaryCategoryAxis}. Colours on line/titleArea are RRGGBB only. Tick marks are engine strings (`none` | `inside`
     * | `outside` | `cross`). Number format is an opaque string (no invented format codes). Scale uses `minimumValue` / `maximumValue`
     * (auto when `undefined`).
     * @returns {ChartAxisFormat} The result.
     */
    get primaryCategoryAxis(): ChartAxisFormat {
        if (this.editSession !== undefined) {
            return this.editSession.hostChart.primaryCategoryAxis;
        }
        return snapshotAxis(this.instance.parsed.categoryAxis, 'commitPrimaryCategoryAxis');
    }
    /**
     * Primary value (Y) axis — engine `primaryValueAxis` → `c:valAx`.
     *
     * @remarks Live mutable bag while a session is open; otherwise a cold snapshot from parse (`valueAxis`). Nested mutations need {@link
     * Chart.commitPrimaryValueAxis}. Secondary axes are not modelled (ADR 2026-09-18 / TASK-1075 Later).
     * @returns {ChartAxisFormat} The result.
     */
    get primaryValueAxis(): ChartAxisFormat {
        if (this.editSession !== undefined) {
            return this.editSession.hostChart.primaryValueAxis;
        }
        return snapshotAxis(this.instance.parsed.valueAxis, 'commitPrimaryValueAxis');
    }
    /**
     * Chart title text when known; otherwise `undefined`.
     *
     * @remarks Setter enables the title and dual-writes. Prefer {@link Chart.applyChartTitle} when you need to await the flush.
     * @returns {string | undefined} The result.
     */
    get chartTitle(): string | undefined {
        if (this.editSession !== undefined) {
            const t: string = this.editSession.hostChart.chartTitle;
            return typeof t === 'string' && t.length > 0 ? t : undefined;
        }
        const title: string = this.instance.parsed.chartTitle;
        return typeof title === 'string' && title.length > 0 ? title : undefined;
    }
    /**
     *
     * @param {string | undefined} value - The value value.
     * @returns {void} Nothing.
     */
    set chartTitle(value: string | undefined) {
        void this.applyChartTitle(value);
    }
    /**
     * Title text-run formatting (`a:rPr` on title rich text when exported).
     *
     * @remarks Live mutable bag while a session is open; otherwise a snapshot from parse. Mutating nested fields does not flush until
     * {@link Chart.commitTitleArea} or another dual-write mutator runs. Colour is RRGGBB / #RRGGBB only.
     * @returns {ChartTitleAreaFormat} The result.
     */
    get chartTitleArea(): ChartTitleAreaFormat {
        if (this.editSession !== undefined) {
            return this.editSession.hostChart.chartTitleArea;
        }
        return snapshotTitleArea(this.instance.parsed.chartTitleArea);
    }
    /**
     * Chart space frame format (`c:chartSpace` / chart area `c:spPr`).
     *
     * @remarks Live bag while session open; parse snapshot otherwise. Nested mutations need {@link Chart.commitChartArea} (or another
     * flush) to persist.
     * @returns {ChartFrameFormat} The result.
     */
    get chartArea(): ChartFrameFormat {
        if (this.editSession !== undefined) {
            return this.editSession.hostChart.chartArea;
        }
        return snapshotFrame(this.instance.parsed.chartArea);
    }
    /**
     * Plot area frame format (`c:plotArea` / `c:spPr`).
     *
     * @remarks Live bag while session open; parse snapshot otherwise. Nested mutations need {@link Chart.commitPlotArea} (or another flush)
     * to persist.
     * @returns {ChartFrameFormat} The result.
     */
    get plotArea(): ChartFrameFormat {
        if (this.editSession !== undefined) {
            return this.editSession.hostChart.plotArea;
        }
        return snapshotFrame(this.instance.parsed.plotArea);
    }
    /**
     * Engine data-source descriptor from parse (may be `kind: 'none'` when the host
     * passed `pkg: undefined` and did not open embeddings).
     *
     * @returns {ChartDataSource | undefined} The result.
     */
    get dataSource(): ChartDataSource | undefined {
        return this.instance.parsed.dataSource;
    }
    /**
     * Category/value data range formula when known (session host or parse).
     *
     * @remarks Setter dual-writes host `dataRange` and flushes chart part + embedding. Requires an embedded package; external-only throws
     * {@link Error}. Prefer {@link Chart.applyDataRange} when you need to await the flush.
     * @returns {string | undefined} The result.
     */
    get dataRange(): string | undefined {
        if (this.editSession !== undefined) {
            return this.editSession.hostChart.dataRange;
        }
        const dr: string = this.instance.parsed.dataRange;
        return typeof dr === 'string' && dr.length > 0 ? dr : undefined;
    }
    /**
     *
     * @param {string | undefined} value - The value value.
     * @returns {void} Nothing.
     */
    set dataRange(value: string | undefined) {
        void this.applyDataRange(value);
    }
    /**
     * Whether series are laid out in rows (host chart / engine).
     *
     * @remarks Read returns session value when an edit session is open; otherwise `false` (parse surface does not always expose this flag).
     * Prefer {@link Chart.applyIsSeriesInRows} when you need to await the flush.
     * @returns {boolean} The result.
     */
    get isSeriesInRows(): boolean {
        if (this.editSession !== undefined) {
            return this.editSession.hostChart.isSeriesInRows;
        }
        return false;
    }
    /**
     *
     * @param {boolean} value - The value value.
     * @returns {void} Nothing.
     */
    set isSeriesInRows(value: boolean) {
        void this.applyIsSeriesInRows(value);
    }
    /**
     * Series views (title / categoryLabels / values + optional format bags).
     *
     * @remarks Live session returns host series with mutable `serieFormat` / `dataLabels`. Cold parse maps formulas and optional bags when
     * present on the entry. Nested format mutations need {@link Chart.commitSeriesFormat} / {@link Chart.commitSeriesDataLabels} (or
     * another dual-write flush).
     * @returns {*} The result.
     */
    get series(): ReadonlyArray<ChartSeriesView> {
        if (this.editSession !== undefined) {
            return this.editSession.hostChart.series.map((s: HostChartSeries) => ({
                title: s.title,
                categoryLabels: s.categoryLabels,
                values: s.values,
                serieFormat: s.serieFormat,
                dataLabels: s.dataLabels
            }));
        }
        const list: ReadonlyArray<unknown> = this.instance.parsed.series;
        if (!Array.isArray(list)) {
            return [];
        }
        return list.map((entry: unknown) => {
            const f: { title?: string; categoryLabels?: string; values?: string; } = seriesFormulasFromParsed(entry);
            const bags: { serieFormat?: ChartFrameFormat; dataLabels?: ChartSeriesDataLabels; } = seriesCustomizeBagsFromParsed(entry);
            return {
                title: f.title,
                categoryLabels: f.categoryLabels,
                values: f.values,
                ...(bags.serieFormat !== undefined ? { serieFormat: bags.serieFormat } : {}),
                ...(bags.dataLabels !== undefined ? { dataLabels: bags.dataLabels } : {})
            };
        });
    }
    /**
     * Underlying engine parse result (read-only view of current instance state).
     *
     * @remarks Prefer typed getters above for product code. Exposed for advanced read and tests.
     * @returns {ParsedChartSpace} The result.
     */
    get parsed(): ParsedChartSpace {
        return this.instance.parsed;
    }
    /**
     * Bound host instance (related parts + originalXml).
     *
     * @internal
     * @returns {ChartInstance} The result.
     */
    getInternalInstance(): ChartInstance {
        return this.instance;
    }
    /**
     *
     * @returns {boolean} The result.
     */
    get hasUserShapes(): boolean {
        return chartHasUserShapes(this.instance);
    }
    /**
     *
     * @returns {boolean} The result.
     */
    get hasColorStyle(): boolean {
        return chartHasColorStyle(this.instance);
    }
    /**
     *
     * @returns {boolean} The result.
     */
    get hasStyle(): boolean {
        return chartHasStyle(this.instance);
    }
    /**
     *
     * @returns {boolean} The result.
     */
    get hasEmbeddedPackage(): boolean {
        return chartHasEmbeddedPackage(this.instance);
    }
    /**
     *
     * @returns {boolean} The result.
     */
    get hasUnknownRelatedParts(): boolean {
        return chartHasUnknownRelatedParts(this.instance);
    }
    /**
     * Retains the document reference so mutators can dirty the package.
     *
     * @internal
     * @returns {Presentation} The result.
     */
    getPresentation(): Presentation {
        return this.document;
    }
    /**
     * Apply `dataRange` and dual-write flush (async authority for the setter).
     *
     * @throws {Error} When embedding is missing or external-only.
     * @public
     * @param {string | undefined} value - A1 data range or `undefined` to clear when the engine allows.
     * @returns {*} Resolves when chart part + embedding are written.
     */
    applyDataRange(value: string | undefined): void {
        const session: ChartEditSession = this.ensureSession();
        session.hostChart.dataRange = value;
        session.dirty = true;
        flushDualWrite(this.document, this.instance, session);
    }
    /**
     * Apply `isSeriesInRows` and dual-write flush.
     *
     * @public
     * @param {boolean} value - Series-in-rows layout flag.
     * @returns {*} Resolves when chart part + embedding are written.
     */
    applyIsSeriesInRows(value: boolean): void {
        const session: ChartEditSession = this.ensureSession();
        session.hostChart.isSeriesInRows = value;
        session.dirty = true;
        flushDualWrite(this.document, this.instance, session);
    }
    /**
     * Add a series by formula refs and dual-write flush.
     *
     * @public
     * @param {AddChartSeriesOptions} options - Must include non-empty `values` formula (R1.1).
     * @returns {*} The added series view after flush.
     */
    addSeries(options: AddChartSeriesOptions): ChartSeriesView {
        const session: ChartEditSession = this.ensureSession();
        const created: HostChartSeries = session.hostChart.addSeries(options);
        session.dirty = true;
        flushDualWrite(this.document, this.instance, session);
        return {
            title: created.title,
            categoryLabels: created.categoryLabels,
            values: created.values,
            serieFormat: created.serieFormat,
            dataLabels: created.dataLabels
        };
    }
    /**
     * Remove series at index and dual-write flush.
     *
     * @public
     * @param {number} index - Zero-based series index.
     * @returns {*} The result.
     */
    removeSeries(index: number): void {
        const session: ChartEditSession = this.ensureSession();
        session.hostChart.removeSeries(index);
        session.dirty = true;
        flushDualWrite(this.document, this.instance, session);
    }
    /**
     * Write cell values along the series values formula, then flush dual-write.
     *
     * @remarks Primary dual-write path for point data: sheet cells change and chart `c:f` targets remain; export stays formula-only (no
     * invented caches).
     * @public
     * @param {number} seriesIndex - Zero-based series index.
     * @param {*} values - Values written into the simple A1 range of
     * `series.values`.
     * @returns {*} The result.
     */
    setSeriesValueCells(seriesIndex: number,
                              values: ReadonlyArray<string | number | boolean | Date | null | undefined>): void {
        const session: ChartEditSession = this.ensureSession();
        const ser: HostChartSeries = arrayAt(session.hostChart.series, seriesIndex);
        if (ser === undefined) {
            throw new ChartsError(`Chart series index ${String(seriesIndex)} is out of range`);
        }
        const formula: string = ser.values;
        if (formula === undefined || formula.length === 0) {
            throw new ChartsError(`Chart series ${String(seriesIndex)} has no values formula`);
        }
        writeValuesAlongFormula(session.sheet, formula, values);
        session.dirty = true;
        flushDualWrite(this.document, this.instance, session);
    }
    /**
     * Write category label cells along the series category formula, then flush.
     *
     * @public
     * @param {number} seriesIndex - Zero-based series index.
     * @param {*} labels - Labels written into the simple A1 category
     * range.
     * @returns {*} The result.
     */
    setSeriesCategoryCells(seriesIndex: number,
                                 labels: ReadonlyArray<string | number | boolean | Date | null | undefined>): void {
        const session: ChartEditSession = this.ensureSession();
        const ser: HostChartSeries = arrayAt(session.hostChart.series, seriesIndex);
        if (ser === undefined) {
            throw new ChartsError(`Chart series index ${String(seriesIndex)} is out of range`);
        }
        const formula: string = ser.categoryLabels;
        if (formula === undefined || formula.length === 0) {
            throw new ChartsError(`Chart series ${String(seriesIndex)} has no categoryLabels formula`);
        }
        writeValuesAlongFormula(session.sheet, formula, labels);
        session.dirty = true;
        flushDualWrite(this.document, this.instance, session);
    }
    /**
     * Read current sheet cell values for a series values formula (session open).
     *
     * @public
     * @param {number} seriesIndex - Zero-based series index.
     * @returns {*} Cell values along the formula; empty when
     * unmappable.
     */
    readSeriesValueCells(seriesIndex: number): ReadonlyArray<string | number | boolean | Date | null | undefined> {
        const session: ChartEditSession = this.ensureSession();
        const ser: HostChartSeries = arrayAt(session.hostChart.series, seriesIndex);
        if (ser === undefined || ser.values === undefined) {
            return [];
        }
        return readValuesAlongFormula(session.sheet, ser.values);
    }
    /**
     * Flush pending host series formula edits to package.
     *
     * @public
     * @returns {*} The result.
     */
    commitSeriesEdits(): void {
        const session: ChartEditSession = this.ensureSession();
        session.dirty = true;
        flushDualWrite(this.document, this.instance, session);
    }
    /**
     * Replace series formulas at index and dual-write flush.
     *
     * @public
     * @param {number} seriesIndex - Zero-based series index.
     * @param {*} formulas - The formulas value.
     * @param {string} [formulas.title] - Series title formula.
     * @param {string} [formulas.categoryLabels] - Category labels formula.
     * @param {string} [formulas.values] - Values formula.
     * @returns {*} The result.
     */
    replaceSeriesFormulas(seriesIndex: number, formulas: {
        readonly title?: string | undefined;
        readonly categoryLabels?: string | undefined;
        readonly values?: string | undefined;
    }): void {
        const session: ChartEditSession = this.ensureSession();
        const ser: HostChartSeries = arrayAt(session.hostChart.series, seriesIndex);
        if (ser === undefined) {
            throw new ChartsError(`Chart series index ${String(seriesIndex)} is out of range`);
        }
        if ('title' in formulas) {
            ser.title = formulas.title;
        }
        if ('categoryLabels' in formulas) {
            ser.categoryLabels = formulas.categoryLabels;
        }
        if ('values' in formulas) {
            ser.values = formulas.values;
        }
        session.dirty = true;
        flushDualWrite(this.document, this.instance, session);
    }
    /**
     * Apply legend visibility and dual-write flush (async authority for `hasLegend`).
     *
     * @public
     * @param {boolean} value - When `true`, legend is enabled for export.
     * @returns {*} Resolves when chart part + embedding are written.
     */
    applyHasLegend(value: boolean): void {
        const session: ChartEditSession = this.ensureSession();
        session.hostChart.hasLegend = value;
        session.dirty = true;
        flushDualWrite(this.document, this.instance, session);
    }
    /**
     * Ensure an edit session, apply optional legend fields, and dual-write.
     *
     * @public
     * @param {*} partial - Optional position / textArea / frameFormat field bags.
     * @returns {*} Resolves when flushed.
     */
    commitLegend(partial?: Readonly<{
        position?: string;
        textArea?: Readonly<Partial<ChartTitleAreaFormat>>;
        frameFormat?: Readonly<{
            fill?: Readonly<Partial<ChartFrameFillFormat>>;
            line?: Readonly<Partial<ChartFrameLineFormat>>;
        }>;
    }>): void {
        const session: ChartEditSession = this.ensureSession();
        if (partial !== undefined) {
            const leg: ChartLegendFormat = session.hostChart.legend;
            if (typeof partial.position === 'string') {
                leg.position = partial.position;
            }
            const ta: Readonly<Partial<ChartTitleAreaFormat>> = partial.textArea;
            if (ta !== undefined) {
                if (typeof ta.bold === 'boolean') {
                    leg.textArea.bold = ta.bold;
                }
                if (typeof ta.italic === 'boolean') {
                    leg.textArea.italic = ta.italic;
                }
                if (ta.size !== undefined) {
                    leg.textArea.size = ta.size;
                }
                if (ta.fontName !== undefined) {
                    leg.textArea.fontName = ta.fontName;
                }
                if (ta.color !== undefined) {
                    leg.textArea.color = ta.color;
                    markChartGradientPaintOverride(session, { kind: 'legend-text' }, { fill: { type: 'solid', foreColor: ta.color } });
                }
            }
            if (partial.frameFormat !== undefined) {
                applyFramePartial(leg.frameFormat, partial.frameFormat);
            }
        }
        markChartGradientPaintOverride(session, { kind: 'legend' }, partial === undefined ? undefined : partial.frameFormat);
        session.dirty = true;
        flushDualWrite(this.document, this.instance, session);
    }
    /**
     * Ensure an edit session, apply optional primary category axis fields, and dual-write.
     *
     * @public
     * @param {*} partial - Optional title / gridlines / scale / ticks / line / titleArea bags.
     * @returns {*} Resolves when flushed.
     */
    commitPrimaryCategoryAxis(partial?: Readonly<Partial<ChartAxisFormat>> & {
        readonly line?: Readonly<Partial<ChartFrameLineFormat>>;
        readonly titleArea?: Readonly<Partial<ChartTitleAreaFormat>>;
    }): void {
        const session: ChartEditSession = this.ensureSession();
        if (partial && partial.titleArea && partial.titleArea.color !== undefined) {
            const key: string | undefined = primaryChartTitleTextKey(parseXml(this.instance.originalXml, {
                limits: this.document.packagePartAccess().limits, partName: this.partName
            }), true, this.partName);
            if (key) { markChartGradientPaintOverride(session, { kind: key + '-text' },
                                                      { fill: { type: 'solid', foreColor: partial.titleArea.color } }); }
        }
        if (partial !== undefined) {
            applyAxisPartial(session.hostChart.primaryCategoryAxis, partial);
        }
        session.dirty = true;
        flushDualWrite(this.document, this.instance, session);
    }
    /**
     * Ensure an edit session, apply optional primary value axis fields, and dual-write.
     *
     * @public
     * @param {*} partial - Optional title / gridlines / scale / ticks / line / titleArea bags.
     * @returns {*} Resolves when flushed.
     */
    commitPrimaryValueAxis(partial?: Readonly<Partial<ChartAxisFormat>> & {
        readonly line?: Readonly<Partial<ChartFrameLineFormat>>;
        readonly titleArea?: Readonly<Partial<ChartTitleAreaFormat>>;
    }): void {
        const session: ChartEditSession = this.ensureSession();
        if (partial && partial.titleArea && partial.titleArea.color !== undefined) {
            const key: string | undefined = primaryChartTitleTextKey(parseXml(this.instance.originalXml, {
                limits: this.document.packagePartAccess().limits, partName: this.partName
            }), false, this.partName);
            if (key) { markChartGradientPaintOverride(session, { kind: key + '-text' },
                                                      { fill: { type: 'solid', foreColor: partial.titleArea.color } }); }
        }
        if (partial !== undefined) {
            applyAxisPartial(session.hostChart.primaryValueAxis, partial);
        }
        session.dirty = true;
        flushDualWrite(this.document, this.instance, session);
    }
    /**
     * Apply title visibility and dual-write flush (async authority for `hasTitle`).
     *
     * @public
     * @param {boolean} value - When `true`, chart title is enabled for export.
     * @returns {*} Resolves when chart part + embedding are written.
     */
    applyHasTitle(value: boolean): void {
        const session: ChartEditSession = this.ensureSession();
        session.hostChart.hasTitle = value;
        session.dirty = true;
        flushDualWrite(this.document, this.instance, session);
    }
    /**
     * Apply title text and dual-write flush (async authority for `chartTitle`).
     *
     * @remarks Enables `hasTitle` when a non-empty string is set. Empty / `undefined` clears the host title string but leaves `hasTitle`
     * unless callers toggle it.
     * @public
     * @param {string | undefined} value - Title plain text, or `undefined` to clear.
     * @returns {*} Resolves when chart part + embedding are written.
     */
    applyChartTitle(value: string | undefined): void {
        const session: ChartEditSession = this.ensureSession();
        if (session.sourcePaintOverrides === undefined) { session.sourcePaintOverrides = []; }
        if (!session.sourcePaintOverrides.some((value: ChartGradientPaintOverride): boolean => value.kind === 'title' && value.lane === 'text-content')) {
            session.sourcePaintOverrides.push({ kind: 'title', lane: 'text-content' });
        }
        if (typeof value === 'string' && value.length > 0) {
            session.hostChart.hasTitle = true;
            session.hostChart.chartTitle = value;
        }
        else {
            session.hostChart.chartTitle = value;
        }
        session.dirty = true;
        flushDualWrite(this.document, this.instance, session);
    }
    /**
     * Ensure an edit session, apply optional title-area fields, and dual-write.
     *
     * @public
     * @param {*} partial - Fields to assign on {@link Chart.chartTitleArea}.
     * @returns {*} Resolves when flushed.
     */
    commitTitleArea(partial?: Readonly<Partial<ChartTitleAreaFormat>>): void {
        const session: ChartEditSession = this.ensureSession();
        if (partial !== undefined) {
            const area: ChartTitleAreaFormat = session.hostChart.chartTitleArea;
            if (typeof partial.bold === 'boolean') {
                area.bold = partial.bold;
            }
            if (typeof partial.italic === 'boolean') {
                area.italic = partial.italic;
            }
            if (partial.size !== undefined) {
                area.size = partial.size;
            }
            if (partial.fontName !== undefined) {
                area.fontName = partial.fontName;
            }
            if (partial.color !== undefined) {
                area.color = partial.color;
                markChartGradientPaintOverride(session, { kind: 'title-text' }, { fill: { type: 'solid', foreColor: partial.color } });
            }
        }
        session.dirty = true;
        flushDualWrite(this.document, this.instance, session);
    }
    /**
     * Ensure an edit session, apply optional chart-area fill/line, and dual-write.
     *
     * @public
     * @param {*} partial - Optional fill / line field bags.
     * @returns {*} Resolves when flushed.
     */
    commitChartArea(partial?: Readonly<{
        fill?: Readonly<Partial<ChartFrameFillFormat>>;
        line?: Readonly<Partial<ChartFrameLineFormat>>;
    }>): void {
        const session: ChartEditSession = this.ensureSession();
        if (partial !== undefined) {
            applyFramePartial(session.hostChart.chartArea, partial);
        }
        markChartGradientPaintOverride(session, { kind: 'chart-area' }, partial);
        session.dirty = true;
        flushDualWrite(this.document, this.instance, session);
    }
    /**
     * Ensure an edit session, apply optional plot-area fill/line, and dual-write.
     *
     * @public
     * @param {*} partial - Optional fill / line field bags.
     * @returns {*} Resolves when flushed.
     */
    commitPlotArea(partial?: Readonly<{
        fill?: Readonly<Partial<ChartFrameFillFormat>>;
        line?: Readonly<Partial<ChartFrameLineFormat>>;
    }>): void {
        const session: ChartEditSession = this.ensureSession();
        if (partial !== undefined) {
            applyFramePartial(session.hostChart.plotArea, partial);
        }
        markChartGradientPaintOverride(session, { kind: 'plot-area' }, partial);
        session.dirty = true;
        flushDualWrite(this.document, this.instance, session);
    }
    /**
     * Ensure session, apply optional series `serieFormat` fill/line, dual-write.
     *
     * @public
     * @param {number} seriesIndex - Zero-based series index.
     * @param {*} partial - Optional fill / line field bags (`c:ser` / `c:spPr`).
     * @returns {*} Resolves when flushed.
     */
    commitSeriesFormat(seriesIndex: number, partial?: Readonly<{
        fill?: Readonly<Partial<ChartFrameFillFormat>>;
        line?: Readonly<Partial<ChartFrameLineFormat>>;
    }>): void {
        const session: ChartEditSession = this.ensureSession();
        const ser: HostChartSeries = arrayAt(session.hostChart.series, seriesIndex);
        if (ser === undefined) {
            throw new ChartsError(`Chart series index ${String(seriesIndex)} is out of range`);
        }
        if (partial !== undefined) {
            applyFramePartial(ser.serieFormat, partial);
        }
        markChartGradientPaintOverride(session, { kind: 'series', series: seriesIndex }, partial);
        session.dirty = true;
        flushDualWrite(this.document, this.instance, session);
    }
    /**
     * @public
     * @param {number} seriesIndex - Zero-based series index.
     * @param {*} partial - Optional `c:dLbls` fields (`isValue`, position, textArea, …).
     * @returns {*} Resolves when flushed.
     */
    commitSeriesDataLabels(seriesIndex: number, partial?: Readonly<{
        isValue?: boolean;
        isCategoryName?: boolean;
        isSeriesName?: boolean;
        isPercentage?: boolean;
        position?: string | undefined;
        textArea?: Readonly<Partial<ChartTitleAreaFormat>>;
    }>): void {
        const session: ChartEditSession = this.ensureSession();
        const ser: HostChartSeries = arrayAt(session.hostChart.series, seriesIndex);
        if (ser === undefined) {
            throw new ChartsError(`Chart series index ${String(seriesIndex)} is out of range`);
        }
        if (partial !== undefined) {
            const dl: ChartSeriesDataLabels = ser.dataLabels;
            if (typeof partial.isValue === 'boolean') {
                dl.isValue = partial.isValue;
            }
            if (typeof partial.isCategoryName === 'boolean') {
                dl.isCategoryName = partial.isCategoryName;
            }
            if (typeof partial.isSeriesName === 'boolean') {
                dl.isSeriesName = partial.isSeriesName;
            }
            if (typeof partial.isPercentage === 'boolean') {
                dl.isPercentage = partial.isPercentage;
            }
            if ('position' in partial) {
                dl.position = partial.position;
            }
            const ta: Readonly<Partial<ChartTitleAreaFormat>> = partial.textArea;
            if (ta !== undefined) {
                if (typeof ta.bold === 'boolean') {
                    dl.textArea.bold = ta.bold;
                }
                if (typeof ta.italic === 'boolean') {
                    dl.textArea.italic = ta.italic;
                }
                if (ta.size !== undefined) {
                    dl.textArea.size = ta.size;
                }
                if (ta.fontName !== undefined) {
                    dl.textArea.fontName = ta.fontName;
                }
                if (ta.color !== undefined) {
                    dl.textArea.color = ta.color;
                    markChartGradientPaintOverride(session, { kind: 'series:' + seriesIndex + ':labels-text' },
                                                   { fill: { type: 'solid', foreColor: ta.color } });
                }
            }
        }
        session.dirty = true;
        flushDualWrite(this.document, this.instance, session);
    }
    /**
     * Re-open the embedding under nested limits, rebuild host chart from current
     * sheet cells + series formulas, and rewrite the chart part.
     *
     * @remarks **Not** a full Excel calc engine. Does not fetch external-only workbooks, execute VBA/OLE,
         or invent trendline point caches. Missing embedding or external-only data source → typed refuse.
     * @public
     * @returns {*} Resolves when chart XML + embedding bytes are flushed.
     */
    refresh(): void {
        requireEmbeddedForEdit(this.instance, 'chart.refresh()');
        const holder: {
            current: ChartEditSession | undefined;
        } = {
            current: this.editSession
        };
        refreshChartFromEmbedding(this.document, this.instance, holder);
        this.editSession = holder.current;
    }
    /**
     * Open embedding + rebuild host chart session (idempotent).
     *
     * @internal
     * @returns {*} The result.
     */
    private ensureSession(): ChartEditSession {
        this.editSession = ensureEditSession(this.document, this.instance, this.editSession);
        return this.editSession;
    }
}
/**
 *
 * @param {*} source - The source value.
 * @returns {ChartTitleAreaFormat} The result.
 */
function snapshotTitleArea(source: ParsedChartSpace['chartTitleArea']): ChartTitleAreaFormat {
    const s: Readonly<Partial<ChartTitleAreaFormat>> = source;
    const bold: boolean = s != null && s.bold === true;
    const italic: boolean = s != null && s.italic === true;
    const size: number = s != null && typeof s.size === 'number' && Number.isFinite(s.size) ? s.size : undefined;
    const fontName: string = s != null && typeof s.fontName === 'string' ? s.fontName : undefined;
    const color: string = s != null && typeof s.color === 'string' ? s.color : undefined;
    return {
        /**
         *
         * @returns {boolean} The result.
         */
        get bold(): boolean {
            return bold;
        },
        /**
         *
         * @param {boolean} _value - The _value value.
         * @returns {void} Nothing.
         */
        set bold(_value: boolean) {
            throw new ChartsError('chartTitleArea is read-only until an edit session is open; use commitTitleArea()');
        },
        /**
         *
         * @returns {boolean} The result.
         */
        get italic(): boolean {
            return italic;
        },
        /**
         *
         * @param {boolean} _value - The _value value.
         * @returns {void} Nothing.
         */
        set italic(_value: boolean) {
            throw new ChartsError('chartTitleArea is read-only until an edit session is open; use commitTitleArea()');
        },
        /**
         *
         * @returns {number | undefined} The result.
         */
        get size(): number | undefined {
            return size;
        },
        /**
         *
         * @param {number | undefined} _value - The _value value.
         * @returns {void} Nothing.
         */
        set size(_value: number | undefined) {
            throw new ChartsError('chartTitleArea is read-only until an edit session is open; use commitTitleArea()');
        },
        /**
         *
         * @returns {string | undefined} The result.
         */
        get fontName(): string | undefined {
            return fontName;
        },
        /**
         *
         * @param {string | undefined} _value - The _value value.
         * @returns {void} Nothing.
         */
        set fontName(_value: string | undefined) {
            throw new ChartsError('chartTitleArea is read-only until an edit session is open; use commitTitleArea()');
        },
        /**
         *
         * @returns {string | undefined} The result.
         */
        get color(): string | undefined {
            return color;
        },
        /**
         *
         * @param {string | undefined} _value - The _value value.
         * @returns {void} Nothing.
         */
        set color(_value: string | undefined) {
            throw new ChartsError('chartTitleArea is read-only until an edit session is open; use commitTitleArea()');
        }
    };
}
/**
 *
 * @param {*} source - The source value.
 * @param {string} commitName - The commitName value.
 * @returns {ChartAxisFormat} The result.
 */
function snapshotAxis(source: ParsedChartSpace['categoryAxis'] | ParsedChartSpace['valueAxis'] | undefined,
                      commitName: string): ChartAxisFormat {
    const guidance: string = `axis is read-only until an edit session is open; use ${commitName}()`;
    const s: ParsedChartSpace['categoryAxis'] | ParsedChartSpace['valueAxis'] | undefined = source;
    const title: string = s != null && typeof s.title === 'string' && s.title.length > 0 ? s.title : undefined;
    const visible: boolean = s == null || s.visible !== false;
    const hasMajorGridLines: boolean = s != null && s.hasMajorGridLines === true;
    const hasMinorGridLines: boolean = s != null && s.hasMinorGridLines === true;
    const numberFormat: string = s != null && typeof s.numberFormat === 'string' && s.numberFormat.length > 0
        ? s.numberFormat
        : undefined;
    const minimumValue: number = s != null && typeof s.minimumValue === 'number' && Number.isFinite(s.minimumValue)
        ? s.minimumValue
        : undefined;
    const maximumValue: number = s != null && typeof s.maximumValue === 'number' && Number.isFinite(s.maximumValue)
        ? s.maximumValue
        : undefined;
    const majorTickMark: string = s != null && typeof s.majorTickMark === 'string' && s.majorTickMark.length > 0
        ? s.majorTickMark
        : 'none';
    const minorTickMark: string = s != null && typeof s.minorTickMark === 'string' && s.minorTickMark.length > 0
        ? s.minorTickMark
        : 'none';
    const titleArea: ChartTitleAreaFormat = snapshotTitleArea(s != null ? s.titleArea : undefined);
    const sourceLine: ChartFrameLineFormat & Readonly<Partial<ChartFrameLineFormat>> = s != null ? s.line : undefined;
    const lineColor: string = sourceLine != null && typeof sourceLine.color === 'string' ? sourceLine.color : undefined;
    const weightPt: number = sourceLine != null && typeof sourceLine.weightPt === 'number' && Number.isFinite(sourceLine.weightPt)
        ? sourceLine.weightPt
        : undefined;
    const line: ChartFrameLineFormat = {
        /**
         *
         * @returns {string | undefined} The result.
         */
        get color(): string | undefined {
            return lineColor;
        },
        /**
         *
         * @param {string | undefined} _value - The _value value.
         * @returns {void} Nothing.
         */
        set color(_value: string | undefined) {
            throw new ChartsError(guidance);
        },
        /**
         *
         * @returns {number | undefined} The result.
         */
        get weightPt(): number | undefined {
            return weightPt;
        },
        /**
         *
         * @param {number | undefined} _value - The _value value.
         * @returns {void} Nothing.
         */
        set weightPt(_value: number | undefined) {
            throw new ChartsError(guidance);
        }
    };
    return {
        /**
         *
         * @returns {string | undefined} The result.
         */
        get title(): string | undefined {
            return title;
        },
        /**
         *
         * @param {string | undefined} _value - The _value value.
         * @returns {void} Nothing.
         */
        set title(_value: string | undefined) {
            throw new ChartsError(guidance);
        },
        /**
         *
         * @returns {boolean} The result.
         */
        get visible(): boolean {
            return visible;
        },
        /**
         *
         * @param {boolean} _value - The _value value.
         * @returns {void} Nothing.
         */
        set visible(_value: boolean) {
            throw new ChartsError(guidance);
        },
        /**
         *
         * @returns {boolean} The result.
         */
        get hasMajorGridLines(): boolean {
            return hasMajorGridLines;
        },
        /**
         *
         * @param {boolean} _value - The _value value.
         * @returns {void} Nothing.
         */
        set hasMajorGridLines(_value: boolean) {
            throw new ChartsError(guidance);
        },
        /**
         *
         * @returns {boolean} The result.
         */
        get hasMinorGridLines(): boolean {
            return hasMinorGridLines;
        },
        /**
         *
         * @param {boolean} _value - The _value value.
         * @returns {void} Nothing.
         */
        set hasMinorGridLines(_value: boolean) {
            throw new ChartsError(guidance);
        },
        /**
         *
         * @returns {string | undefined} The result.
         */
        get numberFormat(): string | undefined {
            return numberFormat;
        },
        /**
         *
         * @param {string | undefined} _value - The _value value.
         * @returns {void} Nothing.
         */
        set numberFormat(_value: string | undefined) {
            throw new ChartsError(guidance);
        },
        /**
         *
         * @returns {number | undefined} The result.
         */
        get minimumValue(): number | undefined {
            return minimumValue;
        },
        /**
         *
         * @param {number | undefined} _value - The _value value.
         * @returns {void} Nothing.
         */
        set minimumValue(_value: number | undefined) {
            throw new ChartsError(guidance);
        },
        /**
         *
         * @returns {number | undefined} The result.
         */
        get maximumValue(): number | undefined {
            return maximumValue;
        },
        /**
         *
         * @param {number | undefined} _value - The _value value.
         * @returns {void} Nothing.
         */
        set maximumValue(_value: number | undefined) {
            throw new ChartsError(guidance);
        },
        /**
         *
         * @returns {string} The result.
         */
        get majorTickMark(): string {
            return majorTickMark;
        },
        /**
         *
         * @param {string} _value - The _value value.
         * @returns {void} Nothing.
         */
        set majorTickMark(_value: string) {
            throw new ChartsError(guidance);
        },
        /**
         *
         * @returns {string} The result.
         */
        get minorTickMark(): string {
            return minorTickMark;
        },
        /**
         *
         * @param {string} _value - The _value value.
         * @returns {void} Nothing.
         */
        set minorTickMark(_value: string) {
            throw new ChartsError(guidance);
        },
        /**
         *
         * @returns {ChartFrameLineFormat} The result.
         */
        get line(): ChartFrameLineFormat {
            return line;
        },
        /**
         *
         * @returns {ChartTitleAreaFormat} The result.
         */
        get titleArea(): ChartTitleAreaFormat {
            return titleArea;
        }
    };
}
/**
 *
 * @param {ChartAxisFormat} target - The target value.
 * @param {*} partial - The partial value.
 * @returns {void} Nothing.
 */
function applyAxisPartial(target: ChartAxisFormat, partial: Readonly<Partial<ChartAxisFormat>> & {
    readonly line?: Readonly<Partial<ChartFrameLineFormat>>;
    readonly titleArea?: Readonly<Partial<ChartTitleAreaFormat>>;
}): void {
    if ('title' in partial) {
        target.title = partial.title;
    }
    if (typeof partial.visible === 'boolean') {
        target.visible = partial.visible;
    }
    if (typeof partial.hasMajorGridLines === 'boolean') {
        target.hasMajorGridLines = partial.hasMajorGridLines;
    }
    if (typeof partial.hasMinorGridLines === 'boolean') {
        target.hasMinorGridLines = partial.hasMinorGridLines;
    }
    if ('numberFormat' in partial) {
        target.numberFormat = partial.numberFormat;
    }
    if ('minimumValue' in partial) {
        target.minimumValue = partial.minimumValue;
    }
    if ('maximumValue' in partial) {
        target.maximumValue = partial.maximumValue;
    }
    if (typeof partial.majorTickMark === 'string') {
        target.majorTickMark = partial.majorTickMark;
    }
    if (typeof partial.minorTickMark === 'string') {
        target.minorTickMark = partial.minorTickMark;
    }
    if (partial.line !== undefined) {
        if (partial.line.color !== undefined) {
            target.line.color = partial.line.color;
        }
        if (partial.line.weightPt !== undefined) {
            target.line.weightPt = partial.line.weightPt;
        }
    }
    const ta: ChartTitleAreaFormat & Readonly<Partial<ChartTitleAreaFormat>> = partial.titleArea;
    if (ta !== undefined) {
        if (typeof ta.bold === 'boolean') {
            target.titleArea.bold = ta.bold;
        }
        if (typeof ta.italic === 'boolean') {
            target.titleArea.italic = ta.italic;
        }
        if (ta.size !== undefined) {
            target.titleArea.size = ta.size;
        }
        if (ta.fontName !== undefined) {
            target.titleArea.fontName = ta.fontName;
        }
        if (ta.color !== undefined) {
            target.titleArea.color = ta.color;
        }
    }
}
/**
 *
 * @param {ParsedChartSpace} parsed - The parsed value.
 * @returns {ChartLegendFormat} The result.
 */
function snapshotLegend(parsed: ParsedChartSpace): ChartLegendFormat {
    const position: string = typeof parsed.legendPosition === 'string' && parsed.legendPosition.length > 0
        ? parsed.legendPosition
        : '';
    const textArea: ChartTitleAreaFormat = snapshotTitleArea(parsed.legendTextArea);
    const frameFormat: ChartFrameFormat = snapshotFrame(parsed.legendFrame);
    const guidance: string = 'legend is read-only until an edit session is open; use commitLegend()';
    return {
        /**
         *
         * @returns {string} The result.
         */
        get position(): string {
            return position;
        },
        /**
         *
         * @param {string} _value - The _value value.
         * @returns {void} Nothing.
         */
        set position(_value: string) {
            throw new ChartsError(guidance);
        },
        /**
         *
         * @returns {ChartTitleAreaFormat} The result.
         */
        get textArea(): ChartTitleAreaFormat {
            return textArea;
        },
        /**
         *
         * @returns {ChartFrameFormat} The result.
         */
        get frameFormat(): ChartFrameFormat {
            return frameFormat;
        }
    };
}
/**
 *
 * @param {*} source - The source value.
 * @returns {ChartFrameFormat} The result.
 */
function snapshotFrame(source: ParsedChartSpace['chartArea'] | ParsedChartSpace['plotArea'] | ParsedChartSpace['legendFrame']): ChartFrameFormat {
    const s: ParsedChartSpace['chartArea'] | ParsedChartSpace['plotArea'] | ParsedChartSpace['legendFrame'] = source;
    const sourceFill: Readonly<Partial<ChartFrameFillFormat>> = s != null ? s.fill : undefined;
    const sourceLine: Readonly<Partial<ChartFrameLineFormat>> = s != null ? s.line : undefined;
    const fillType: string = sourceFill != null && typeof sourceFill.type === 'string' ? sourceFill.type : '';
    const foreColor: string = sourceFill != null && typeof sourceFill.foreColor === 'string' ? sourceFill.foreColor : undefined;
    const transparency: number = sourceFill != null && typeof sourceFill.transparency === 'number' &&
        Number.isFinite(sourceFill.transparency)
        ? sourceFill.transparency
        : undefined;
    const lineColor: string = sourceLine != null && typeof sourceLine.color === 'string' ? sourceLine.color : undefined;
    const weightPt: number = sourceLine != null && typeof sourceLine.weightPt === 'number' && Number.isFinite(sourceLine.weightPt)
        ? sourceLine.weightPt
        : undefined;
    const fill: ChartFrameFillFormat = {
        /**
         *
         * @returns {string} The result.
         */
        get type(): string {
            return fillType;
        },
        /**
         *
         * @param {string} _value - The _value value.
         * @returns {void} Nothing.
         */
        set type(_value: string) {
            throw new ChartsError('chart/plot area is read-only until an edit session is open; use commitChartArea/commitPlotArea()');
        },
        /**
         *
         * @returns {string | undefined} The result.
         */
        get foreColor(): string | undefined {
            return foreColor;
        },
        /**
         *
         * @param {string | undefined} _value - The _value value.
         * @returns {void} Nothing.
         */
        set foreColor(_value: string | undefined) {
            throw new ChartsError('chart/plot area is read-only until an edit session is open; use commitChartArea/commitPlotArea()');
        },
        /**
         *
         * @returns {number | undefined} The result.
         */
        get transparency(): number | undefined {
            return transparency;
        },
        /**
         *
         * @param {number | undefined} _value - The _value value.
         * @returns {void} Nothing.
         */
        set transparency(_value: number | undefined) {
            throw new ChartsError('chart/plot area is read-only until an edit session is open; use commitChartArea/commitPlotArea()');
        }
    };
    const line: ChartFrameLineFormat = {
        /**
         *
         * @returns {string | undefined} The result.
         */
        get color(): string | undefined {
            return lineColor;
        },
        /**
         *
         * @param {string | undefined} _value - The _value value.
         * @returns {void} Nothing.
         */
        set color(_value: string | undefined) {
            throw new ChartsError('chart/plot area is read-only until an edit session is open; use commitChartArea/commitPlotArea()');
        },
        /**
         *
         * @returns {number | undefined} The result.
         */
        get weightPt(): number | undefined {
            return weightPt;
        },
        /**
         *
         * @param {number | undefined} _value - The _value value.
         * @returns {void} Nothing.
         */
        set weightPt(_value: number | undefined) {
            throw new ChartsError('chart/plot area is read-only until an edit session is open; use commitChartArea/commitPlotArea()');
        }
    };
    return { fill: fill, line: line };
}
/**
 *
 * @param {ChartFrameFormat} target - The target value.
 * @param {*} partial - The partial value.
 * @returns {void} Nothing.
 */
function applyFramePartial(target: ChartFrameFormat, partial: Readonly<{
    fill?: Readonly<Partial<ChartFrameFillFormat>>;
    line?: Readonly<Partial<ChartFrameLineFormat>>;
}>): void {
    if (partial.fill !== undefined) {
        if (typeof partial.fill.type === 'string') {
            target.fill.type = partial.fill.type;
        }
        if (partial.fill.foreColor !== undefined) {
            target.fill.foreColor = partial.fill.foreColor;
        }
        if (partial.fill.transparency !== undefined) {
            target.fill.transparency = partial.fill.transparency;
        }
    }
    if (partial.line !== undefined) {
        if (partial.line.color !== undefined) {
            target.line.color = partial.line.color;
        }
        if (partial.line.weightPt !== undefined) {
            target.line.weightPt = partial.line.weightPt;
        }
    }
}
/**
 * Cold-parse snapshot bags for series customize (read-only until session).
 *
 * @internal
 * @param {*} entry - The entry value.
 * @returns {*} The result.
 */
function seriesCustomizeBagsFromParsed(entry: unknown): {
    serieFormat?: ChartFrameFormat;
    dataLabels?: ChartSeriesDataLabels;
} {
    if (entry === null || typeof entry !== 'object') {
        return {};
    }
    const rec: {
        readonly serieFormat?: ParsedChartSpace['chartArea'];
        readonly dataLabels?: {
            readonly isValue?: boolean;
            readonly isCategoryName?: boolean;
            readonly isSeriesName?: boolean;
            readonly isPercentage?: boolean;
            readonly position?: string;
            readonly textArea?: ParsedChartSpace['chartTitleArea'];
        };
    } = entry as {
        readonly serieFormat?: ParsedChartSpace['chartArea'];
        readonly dataLabels?: {
            readonly isValue?: boolean;
            readonly isCategoryName?: boolean;
            readonly isSeriesName?: boolean;
            readonly isPercentage?: boolean;
            readonly position?: string;
            readonly textArea?: ParsedChartSpace['chartTitleArea'];
        };
    };
    const out: {
        serieFormat?: ChartFrameFormat;
        dataLabels?: ChartSeriesDataLabels;
    } = {};
    if (rec.serieFormat !== undefined) {
        out.serieFormat = snapshotFrame(rec.serieFormat);
    }
    if (rec.dataLabels !== undefined) {
        out.dataLabels = snapshotSeriesDataLabels(rec.dataLabels);
    }
    return out;
}
/**
 * @param {*} source - The source value.
 * @param {boolean} [source.isValue] - Show value labels.
 * @param {boolean} [source.isCategoryName] - Show category name.
 * @param {boolean} [source.isSeriesName] - Show series name.
 * @param {boolean} [source.isPercentage] - Show percentage.
 * @param {string} [source.position] - Label position.
 * @param {*} [source.textArea] - Label text area format.
 * @returns {ChartSeriesDataLabels} The result.
 */
function snapshotSeriesDataLabels(source: {
    readonly isValue?: boolean;
    readonly isCategoryName?: boolean;
    readonly isSeriesName?: boolean;
    readonly isPercentage?: boolean;
    readonly position?: string;
    readonly textArea?: ParsedChartSpace['chartTitleArea'];
}): ChartSeriesDataLabels {
    const isValue: boolean = source.isValue === true;
    const isCategoryName: boolean = source.isCategoryName === true;
    const isSeriesName: boolean = source.isSeriesName === true;
    const isPercentage: boolean = source.isPercentage === true;
    const position: string = typeof source.position === 'string' ? source.position : undefined;
    const textArea: ChartTitleAreaFormat = snapshotTitleArea(source.textArea);
    const guidance: string = 'series dataLabels is read-only until an edit session is open; use commitSeriesDataLabels()';
    return {
        /**
         *
         * @returns {boolean} The result.
         */
        get isValue(): boolean {
            return isValue;
        },
        /**
         *
         * @param {boolean} _value - The _value value.
         * @returns {void} Nothing.
         */
        set isValue(_value: boolean) {
            throw new ChartsError(guidance);
        },
        /**
         *
         * @returns {boolean} The result.
         */
        get isCategoryName(): boolean {
            return isCategoryName;
        },
        /**
         *
         * @param {boolean} _value - The _value value.
         * @returns {void} Nothing.
         */
        set isCategoryName(_value: boolean) {
            throw new ChartsError(guidance);
        },
        /**
         *
         * @returns {boolean} The result.
         */
        get isSeriesName(): boolean {
            return isSeriesName;
        },
        /**
         *
         * @param {boolean} _value - The _value value.
         * @returns {void} Nothing.
         */
        set isSeriesName(_value: boolean) {
            throw new ChartsError(guidance);
        },
        /**
         *
         * @returns {boolean} The result.
         */
        get isPercentage(): boolean {
            return isPercentage;
        },
        /**
         *
         * @param {boolean} _value - The _value value.
         * @returns {void} Nothing.
         */
        set isPercentage(_value: boolean) {
            throw new ChartsError(guidance);
        },
        /**
         *
         * @returns {string | undefined} The result.
         */
        get position(): string | undefined {
            return position;
        },
        /**
         *
         * @param {string | undefined} _value - The _value value.
         * @returns {void} Nothing.
         */
        set position(_value: string | undefined) {
            throw new ChartsError(guidance);
        },
        /**
         *
         * @returns {ChartTitleAreaFormat} The result.
         */
        get textArea(): ChartTitleAreaFormat {
            return textArea;
        }
    };
}
