/**
 * Create a classic DrawingML chart on a slide (`addChart`).
 *
 * @remarks
 * Algorithms (spec 037 / TASK-1069 + TASK-1070):
 * 1. Validate classic type catalog (refuse ChartEx / unknown).
 * 2. shapesPerSlide + entryCount + relationship limits.
 * 3. Allocate **new** shape id only (`cNvPr/@id`); never renumber.
 * 4a. **From scratch:** demo seed workbook + worksheet `addChart`.
 * 4b. **From Excel:** nested-limit check + `Workbook.open` / live workbook;
 *     resolve sheet + category/value ranges; `addChart` on that sheet;
 *     embed a **subset** workbook (copied range values only — not a silent
 *     full consumer-package copy).
 * 5. `exportChartPart` + write `/ppt/charts/chartN.xml` + embedding XLSX.
 * 6. Chart→embedding package rel; slide→chart rel; `p:graphicFrame` + `c:chart`.
 * 7. Return bound {@link Chart} handle.
 *
 * Citations: ECMA-376 Part 1 §14.2.1; Part 4 §12.2.1 / §13.2.9; ADR 2026-09-18;
 * constants in `./constants.js` only (no invented CT/rel strings).
 *
 * @packageDocumentation
 */
import { allocateNextRelationshipId } from '../../core/package/allocate-relationship-id';
import { PackagePartAccess } from '../../core/package/package-part-access';
import { resolveInternalTarget } from '../../core/package/paths';
import { PackageRelationship } from '../../core/package/relationships';
import { PML_NS, OFFICE_REL_ATTR_NS } from '../../core/presentation/constants';
import { InvalidPackageError, PackageLimitError } from '../../core/security/errors';
import { _decode } from '../../core/errors';
import { findSpTree, ShapeBounds } from '../../core/shapes/add-text-box';
import { DML_NS } from '../../core/shapes/constants';
import { asMutable } from '../../core/shapes/dom-utils';
import { allocateNextDrawingElementId } from '../../core/shapes/drawing-element-id';
import { Shape } from '../../core/shapes/shape';
import { walkSlideShapeTree } from '../../core/shapes/walk';
import { Slide } from '../../core/slideimplementation/slide';
import { arrayAt } from '../../core/util/es5-compat';
import { coordinateToEmuString } from '../../core/util/length-units';
import { OoxmlAttribute, OoxmlElement } from '../../core/xml/index';
import { Chart } from './chart';
import { isChartExTypeKey, isClassicChartType, ClassicChartTypeKey } from './classic-chart-types';
import { CHART_CONTENT_TYPE, CHART_RELATIONSHIP_TYPE, DRAWINGML_CHART_URI, EMBEDDED_PACKAGE_RELATIONSHIP_TYPE } from './constants';
import { ChartsError, partNameOptions } from './errors';
import { openNestedXlsxPackageSync } from './nested-package-security';
import { asChartSync, ChartInstance } from './resolve-chart';
import { DEFAULT_CHART_CACHE_SHEET_NAME, enrichChartPartCachesFromSheet } from './chart-part-caches';
import { ChartCellSheet } from './chart-cell-sheet';
import { writeChartEmbeddingXlsx } from './embedding-writer';
import { readEmbeddingCellSheet } from './xlsx-value-reader';
import { getXlsxChartHostApi, HostChart, HostWorkbook, HostWorksheet, XlsxChartHostApi, ChartPartExport } from './xlsx-chart-api';
import { getXlsxRootRequired, Ej2XlsxRootModule } from './xlsx-surface';
import { stringIncludes } from '../../core/util/es5-compat';
import { Presentation } from '../../core/package/presentation';
import { SecurityLimits } from '../../core/security/limits';
const utf8: TextEncoder = new TextEncoder();
/** Absolute prefix for chart parts (path safety). */
export const PPT_CHART_PART_PREFIX: string = '/ppt/charts';
/** Absolute prefix for embedded workbook parts. */
export const PPT_EMBEDDING_PART_PREFIX: string = '/ppt/embeddings';
/**
 * SpreadsheetML package content type for embedded `.xlsx` (fixture Default).
 *
 * @remarks
 * Citation: corpus fixtures / `tests/features/charts/*` Content_Types Default
 * Extension=`xlsx` →
 * `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.
 * Not the workbook **main** part type (`…sheet.main+xml`).
 */
export const EMBEDDED_XLSX_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
/** Default `cNvPr/@name` for a new chart frame. */
export const DEFAULT_CHART_NAME: string = 'Chart';
/**
 * Default bounds: origin, 4" × 3" (288 pt × 216 pt; same physical size as prior EMU default).
 */
export const DEFAULT_CHART_BOUNDS: Readonly<ShapeBounds> = Object.freeze({
    x: 0,
    y: 0,
    width: 288,
    height: 216
});
/**
 * Default category / value A1 range when `from.range` is omitted (from-excel).
 *
 * @remarks
 * Two-column layout: categories left (`A2:A4`), values right (`B2:B4`) — same
 * geometry as the scratch demo seed. Pass an explicit `range` for other layouts.
 */
export const DEFAULT_FROM_EXCEL_RANGE: string = 'A2:B4';
/**
 * Consumer Excel source for {@link addChart} (TASK-1070).
 *
 * @remarks
 * Discriminated by presence of `data` **or** `workbook` (exactly one). Data
 * octets (`Uint8Array` / `number[]`, or base64 `string` matching the
 * {@link PictureDataInput} convention) are security-scanned via
 * {@link openNestedXlsxPackage} before the sync cell read. Live `workbook` must
 * already be an ej2-xlsx host surface from {@link XlsxChartHostApi.createWorkbook}
 * / `openWorkbook`.
 *
 * **Embedding policy (subset):** the PPT package stores a **new minimal XLSX**
 * containing only the chart data range cells (plus a single series header row),
 * not a byte-for-byte copy of the consumer package. Formulas are not evaluated;
 * cell **values** at add time are copied. Network fetch of remote workbooks is
 * refused (data/workbook only — no URL field).
 *
 * @public
 */
export type AddChartFromExcelSource = {
    readonly data: Uint8Array | number[] | string;
    readonly workbook?: never;
    /** Sheet tab name or 0-based index. Default: first worksheet. */
    readonly sheet?: string | number;
    /**
     * Inclusive A1 range covering categories (left column) and values (right
     * column), e.g. `A2:B4`. Single-area only; no sheet! prefix. Default
     * {@link DEFAULT_FROM_EXCEL_RANGE}.
     */
    readonly range?: string;
} | {
    readonly workbook: HostWorkbook;
    readonly data?: never;
    readonly sheet?: string | number;
    readonly range?: string;
};
/**
 * Options for {@link addChart}.
 *
 * @public
 */
export interface AddChartOptions {
    /**
     * Classic catalog key (xlsx `ChartType` property name, e.g. `ColumnClustered`).
     *
     * @remarks
     * ChartEx keys and unknown strings throw {@link Error}.
     */
    readonly type: ClassicChartTypeKey | string;
    /**
     * Frame position and size in **points** (written as EMU `p:xfrm` under `graphicFrame`).
     *
     * @defaultValue DEFAULT_CHART_BOUNDS
     */
    readonly bounds?: ShapeBounds;
    /**
     * `cNvPr/@name` for the graphic frame.
     *
     * @defaultValue DEFAULT_CHART_NAME
     */
    readonly name?: string;
    /**
     * When set, build the chart from consumer Excel data (TASK-1070).
     * When omitted, uses the scratch demo seed (TASK-1069).
     */
    readonly from?: AddChartFromExcelSource;
}
/**
 * Adds a classic chart to the slide and returns its handle.
 *
 * @throws {Error} When the type is ChartEx/unknown or the slide is unbound.
 * @throws {Error} When shapes/parts/relationships/bytes limits would be exceeded.
 * @throws {Error} When `p:spTree` is missing.
 * @remarks **Async** because ej2-xlsx `Workbook.save()` returns a `Promise`. Shape ids: allocates one new id only; never renumbers existing. Embedding is a **subset** workbook coherent with the chart series (scratch demo seed, or values copied from `options.from` — never a silent full consumer-package copy).
 * @public
 * @param {Slide} slide - Host slide (must be bound to a {@link Presentation}).
 * @param {AddChartOptions} options - Classic type key and optional geometry / name.
 * @returns {*} Bound {@link Chart} for the new graphic frame.
 */
export function addChart(slide: Slide, options: AddChartOptions): Chart {
    const typeKey: string = options.type;
    if (isChartExTypeKey(typeKey)) {
        throw new ChartsError(`ChartEx type "${typeKey}" is not authorable; classic catalog only (TASK-1069)`,
                              partNameOptions(slide.partName));
    }
    if (!isClassicChartType(typeKey)) {
        throw new ChartsError(`Unknown or unsupported chart type catalog key "${typeKey}"`, partNameOptions(slide.partName));
    }
    const document: Presentation = slide.getPresentation();
    if (document === undefined) {
        throw new ChartsError('Slide is not bound to a presentation document; cannot add chart', partNameOptions(slide.partName));
    }
    const limits: SecurityLimits = slide.getLimits();
    const root: OoxmlElement = slide.getRoot();
    const spTree: OoxmlElement = findSpTree(root);
    if (spTree === undefined) {
        throw new InvalidPackageError('Slide has no p:spTree; cannot add chart', {
            partName: slide.partName
        });
    }
    const existingShapes: Array<Shape> = walkSlideShapeTree(root, limits, slide.partName, undefined, (): void => {
        slide.notifyMutate();
    });
    if (existingShapes.length >= limits.shapesPerSlide) {
        throw new PackageLimitError('shapesPerSlide', {
            partName: slide.partName,
            actual: existingShapes.length + 1
        });
    }
    const xlsx: Ej2XlsxRootModule = getXlsxRootRequired();
    const api: XlsxChartHostApi = getXlsxChartHostApi(xlsx);
    const engineType: string = api.chartTypeByKey.get(typeKey);
    if (engineType === undefined || engineType.length === 0) {
        throw new ChartsError(`ej2-xlsx ChartType has no engine value for key "${typeKey}"`, partNameOptions(slide.partName));
    }
    const access: PackagePartAccess = document.packagePartAccess();
    const chartPartName: string = allocateNextChartPartName(access);
    const embeddingPartName: string = allocateNextEmbeddingPartName(access);
    assertSafeChartPaths(chartPartName, embeddingPartName, slide.partName);
    // Relative targets matching fixture style (slide → chart; chart → embedding).
    const chartRelTarget: string = relativeTargetFromSource(slide.partName, chartPartName);
    const embeddingRelTarget: string = relativeTargetFromSource(chartPartName, embeddingPartName);
    // Validate resolution (fail-closed path safety).
    if (resolveInternalTarget(slide.partName, chartRelTarget) !== chartPartName) {
        throw new ChartsError(`Chart relationship target does not resolve to ${chartPartName}`, partNameOptions(slide.partName));
    }
    if (resolveInternalTarget(chartPartName, embeddingRelTarget) !== embeddingPartName) {
        throw new ChartsError(`Embedding relationship target does not resolve to ${embeddingPartName}`, partNameOptions(slide.partName));
    }
    const built: BuiltHostChart = buildHostChartAndEmbedding(api, engineType, options.from, slide.partName);
    const hostChart: HostChart = built.hostChart;
    // Embedding rel id on the chart part — allocate after we know existing chart rels (empty).
    const chartPartExistingRels: PackageRelationship[] = [];
    const embeddingRelId: string = allocateNextRelationshipId(chartPartExistingRels);
    hostChart.dataSource = { kind: 'embedded', relationshipId: embeddingRelId };
    const exported: ChartPartExport = api.exportChartPart(hostChart, { embeddedTarget: embeddingRelTarget });
    if (exported.contentType !== CHART_CONTENT_TYPE) {
        throw new ChartsError(`exportChartPart contentType mismatch: expected chart CT constant, got "${exported.contentType}"`,
                              partNameOptions(slide.partName));
    }
    if (exported.chartRelationshipType.length > 0 &&
        exported.chartRelationshipType !== CHART_RELATIONSHIP_TYPE &&
        !exported.chartRelationshipType.endsWith('/chart')) {
        throw new ChartsError(`exportChartPart chartRelationshipType is not a chart relationship: "${exported.chartRelationshipType}"`,
                              partNameOptions(slide.partName));
    }
    const sheetName: string = typeof built.sheet.name === 'string' && built.sheet.name.length > 0
        ? built.sheet.name
        : DEFAULT_CHART_CACHE_SHEET_NAME;
    const chartXml: string = enrichChartPartCachesFromSheet(exported.xml, built.sheet, sheetName);
    const xlsxBytes: Uint8Array = built.xlsxBytes;
    const chartXmlBytes: Uint8Array = utf8.encode(chartXml);
    const newPartsByteLengths: Array<number> = [chartXmlBytes.byteLength, xlsxBytes.byteLength];
    enforceCreateLimits(access, slide.partName, newPartsByteLengths, 2);
    const slideRels: ReadonlyArray<PackageRelationship> = access.getRelationships(slide.partName);
    const slideChartRelId: string = allocateNextRelationshipId(slideRels);
    if (slideRels.length + 1 > access.limits.relationshipsPerPart) {
        throw new PackageLimitError('relationshipsPerPart', {
            partName: slide.partName,
            actual: slideRels.length + 1
        });
    }
    // Chart-part relationships: prefer export rows; ensure embedding package rel.
    const chartRels: PackageRelationship[] = [];
    if (exported.relationships.length > 0) {
        for (let i: number = 0; i < exported.relationships.length; i++) {
            const edge: any = arrayAt(exported.relationships, i);// eslint-disable-line
            if (edge.type !== EMBEDDED_PACKAGE_RELATIONSHIP_TYPE && !edge.type.endsWith('/package')) {
                // Still accept only known package embedding type from constants.
                throw new ChartsError(`exportChartPart emitted unsupported relationship type "${edge.type}"`,
                                      partNameOptions(chartPartName));
            }
            const targetAbs: string = resolveInternalTarget(chartPartName, edge.target);
            if (targetAbs !== embeddingPartName) {
                throw new ChartsError(`exportChartPart embedding target resolved to "${targetAbs}", expected "${embeddingPartName}"`,
                                      partNameOptions(chartPartName));
            }
            chartRels.push({
                id: edge.id,
                type: EMBEDDED_PACKAGE_RELATIONSHIP_TYPE,
                target: edge.target,
                targetMode: 'Internal',
                targetPartName: embeddingPartName
            });

        }
    }
    else {
        chartRels.push({
            id: embeddingRelId,
            type: EMBEDDED_PACKAGE_RELATIONSHIP_TYPE,
            target: embeddingRelTarget,
            targetMode: 'Internal',
            targetPartName: embeddingPartName
        });
    }
    if (chartRels.length > access.limits.relationshipsPerPart) {
        throw new PackageLimitError('relationshipsPerPart', {
            partName: chartPartName,
            actual: chartRels.length
        });
    }
    access.setPart({
        name: chartPartName,
        contentType: CHART_CONTENT_TYPE,
        data: chartXmlBytes
    });
    access.ensureContentTypeOverride(chartPartName, CHART_CONTENT_TYPE);
    access.setPart({
        name: embeddingPartName,
        contentType: EMBEDDED_XLSX_CONTENT_TYPE,
        data: xlsxBytes
    });
    access.ensureContentTypeOverride(embeddingPartName, EMBEDDED_XLSX_CONTENT_TYPE);
    access.replaceRelationships(chartPartName, chartRels);
    const mergedSlideRels: PackageRelationship[] = [
        ...slideRels,
        {
            id: slideChartRelId,
            type: CHART_RELATIONSHIP_TYPE,
            target: chartRelTarget,
            targetMode: 'Internal',
            targetPartName: chartPartName
        }
    ];
    access.replaceRelationships(slide.partName, mergedSlideRels);
    const id: string = allocateNextDrawingElementId(root);
    const name: string = (options.name !== null && options.name !== undefined ? options.name : DEFAULT_CHART_NAME);
    const bounds: ShapeBounds = (options.bounds !== null && options.bounds !== undefined ? options.bounds : DEFAULT_CHART_BOUNDS);
    const frame: OoxmlElement = buildChartGraphicFrame({
        id,
        name,
        bounds,
        chartRelId: slideChartRelId
    });
    asMutable(spTree).children.push(frame);
    slide.notifyMutate();
    const shape: Shape = new Shape(frame, 'graphicFrame', id, name, limits, slide.partName, slide.getMediaAccess(), 0, (): void => {
        slide.notifyMutate();
    });
    const instance: ChartInstance = asChartSync(shape, document);
    if (instance === undefined) {
        throw new ChartsError('Failed to bind newly added chart graphicFrame', partNameOptions(slide.partName));
    }
    const handle: Chart = new Chart(shape, instance, document);
    const localSheet: ChartCellSheet = new ChartCellSheet(sheetName);
    copyHostSheetValues(built.sheet, localSheet);
    handle.attachAuthoringSession({
        hostChart,
        sheet: localSheet,
        embeddingPartName,
        embeddingRelId,
        embeddingRelTarget,
        dirty: false
    });
    return handle;
}
interface BuiltHostChart {
    readonly hostChart: HostChart;
    readonly xlsxBytes: Uint8Array;
    /** Sheet holding dual-write cells used to enrich presentation-chart caches. */
    readonly sheet: HostWorksheet;
}
/**
 * Builds host chart + embedding XLSX bytes (scratch seed or from-excel subset).
 *
 * @param {XlsxChartHostApi} api - The api value.
 * @param {string} engineType - The engineType value.
 * @param {AddChartFromExcelSource | undefined} from - The from value.
 * @param {string} slidePartName - The slidePartName value.
 * @returns {*} The result.
 */
function buildHostChartAndEmbedding(api: XlsxChartHostApi, engineType: string, from: AddChartFromExcelSource | undefined,
                                     slidePartName: string): BuiltHostChart {
    if (from === undefined) {
        return buildScratchHostChart(api, engineType, slidePartName);
    }
    return buildFromExcelHostChart(api, engineType, from, slidePartName);
}
/**
 *
 * @param {XlsxChartHostApi} api - The api value.
 * @param {string} engineType - The engineType value.
 * @param {string} slidePartName - The slidePartName value.
 * @returns {*} The result.
 */
function buildScratchHostChart(api: XlsxChartHostApi, engineType: string, slidePartName: string): BuiltHostChart {
    const wb: HostWorkbook = api.createWorkbook();
    const sheet: HostWorksheet = wb.worksheets[0];
    if (sheet === undefined) {
        throw new ChartsError('Workbook has no worksheets', partNameOptions(slidePartName));
    }
    // Demo seed: headers + three category/value rows (probe-xlsx-export).
    sheet.getCell('A1').value = 'Category';
    sheet.getCell('B1').value = 'Value';
    sheet.getCell('A2').value = 'A';
    sheet.getCell('B2').value = 1;
    sheet.getCell('A3').value = 'B';
    sheet.getCell('B3').value = 2;
    sheet.getCell('A4').value = 'C';
    sheet.getCell('B4').value = 3;
    const hostChart: HostChart = sheet.addChart(engineType, 0, 2, 10, 10, 'A2:A4', 'B2:B4');
    const local: ChartCellSheet = new ChartCellSheet(sheet.name);
    copyHostSheetValues(sheet, local);
    const xlsxBytes: Uint8Array = writeChartEmbeddingXlsx({
        sheetName: local.name,
        cells: local.occupiedCells()
    });
    return { hostChart, xlsxBytes, sheet };
}
/**
 *
 * @param {XlsxChartHostApi} api - The api value.
 * @param {string} engineType - The engineType value.
 * @param {AddChartFromExcelSource} from - The from value.
 * @param {string} slidePartName - The slidePartName value.
 * @returns {*} The result.
 */
function buildFromExcelHostChart(api: XlsxChartHostApi, engineType: string, from: AddChartFromExcelSource,
                                  slidePartName: string): BuiltHostChart {
    const hasBytes: boolean = from.data !== undefined;
    const hasWorkbook: boolean = from.workbook !== undefined;
    if (hasBytes === hasWorkbook) {
        throw new ChartsError('addChart from-excel requires exactly one of from.data or from.workbook', partNameOptions(slidePartName));
    }
    let sourceWb: HostWorkbook;
    if (from.data !== undefined) {
        // Security pre-check (TASK-1066 / TASK-1070) then sync cell read — no Workbook.open.
        // data accepts Uint8Array / number[] / base64 string (PictureDataInput convention).
        const nestedBytes: Uint8Array = decodeSourceData(from.data);
        openNestedXlsxPackageSync(nestedBytes, undefined, { partName: slidePartName });
        const readSheet: ChartCellSheet = readEmbeddingCellSheet(nestedBytes, slidePartName);
        sourceWb = workbookFromLocalSheet(api, readSheet);
    }
    else {
        sourceWb = from.workbook;
    }
    const sourceSheet: HostWorksheet = resolveSourceSheet(sourceWb, from.sheet, slidePartName);
    const rangeText: string = (from.range !== null && from.range !== undefined ? from.range : DEFAULT_FROM_EXCEL_RANGE);
    // Read values from the consumer sheet; discard consumer A1 addresses for the
    // embedding (subset uses a normalized A/B layout so formulas match the XLSX
    // we actually store — docs honesty: not a full consumer-package copy).
    const { rows } = readTwoColumnSeries(sourceSheet, rangeText, slidePartName);
    // Subset embedding: new minimal workbook with copied values only.
    const embedWb: HostWorkbook = api.createWorkbook();
    const embedSheet: HostWorksheet = embedWb.worksheets[0];
    if (embedSheet === undefined) {
        throw new ChartsError('Subset workbook has no worksheets', partNameOptions(slidePartName));
    }
    embedSheet.getCell('A1').value = 'Category';
    embedSheet.getCell('B1').value = 'Value';
    for (let i: number = 0; i < rows.length; i += 1) {
        const row: SeriesRow | undefined = arrayAt(rows, i);
        if (row === undefined) {
            continue;
        }
        const a1: string = `A${String(i + 2)}`;
        const b1: string = `B${String(i + 2)}`;
        embedSheet.getCell(a1).value = row.category;
        embedSheet.getCell(b1).value = row.value;
    }
    const lastDataRow: number = rows.length + 1;
    const embedCategoryRange: string = `A2:A${String(lastDataRow)}`;
    const embedValueRange: string = `B2:B${String(lastDataRow)}`;
    // Host chart lives on the subset sheet so c:f / cached points match embedding.
    const hostChart: HostChart = embedSheet.addChart(engineType, 0, 2, 10, 10, embedCategoryRange, embedValueRange);
    const local: ChartCellSheet = new ChartCellSheet(embedSheet.name);
    copyHostSheetValues(embedSheet, local);
    const xlsxBytes: Uint8Array = writeChartEmbeddingXlsx({
        sheetName: local.name,
        cells: local.occupiedCells()
    });
    return { hostChart, xlsxBytes, sheet: embedSheet };
}
/**
 * Normalizes {@link AddChartFromExcelSource} data octets to a fresh `Uint8Array`.
 *
 * @remarks Base64 `string` is decoded via {@link _decode} (payload only, no
 * data-URL prefix strip — same convention as `PictureDataInput`). The copy is
 * detached from caller-owned buffers before nested security scanning.
 * @internal
 * @param {Uint8Array | number[] | string} data - Raw or base64 source octets.
 * @returns {Uint8Array} The result.
 */
function decodeSourceData(data: Uint8Array | number[] | string): Uint8Array {
    if (typeof data === 'string') {
        const decoded: Uint8Array | Array<number> = _decode(data, false);
        return decoded instanceof Uint8Array ? decoded.slice() : new Uint8Array(decoded);
    }
    return data instanceof Uint8Array ? data.slice() : Uint8Array.from(data);
}
/**
 * Rebuilds a host workbook from a chart-local sheet so `addChart` can bind ranges.
 *
 * @param {XlsxChartHostApi} api - Host API.
 * @param {ChartCellSheet} local - Cells read from embedding bytes.
 * @returns {HostWorkbook} Workbook whose first sheet mirrors the local grid.
 */
function workbookFromLocalSheet(api: XlsxChartHostApi, local: ChartCellSheet): HostWorkbook {
    const wb: HostWorkbook = api.createWorkbook();
    const sheet: HostWorksheet | undefined = wb.worksheets[0];
    if (sheet === undefined) {
        throw new ChartsError('Workbook has no worksheets');
    }
    const cells: ReadonlyArray<{ col: number; row: number; value: string | number | boolean | Date | null | undefined }> =
        local.occupiedCells();
    for (let i: number = 0; i < cells.length; i++) {
        const cell: { col: number; row: number; value: string | number | boolean | Date | null | undefined } = cells[i];
        sheet.getCell(colLetters(cell.col) + String(cell.row)).value = cell.value;
    }
    return wb;
}
/**
 * Copies occupied values between sheets that expose `getCell` (A1:ZZ200).
 *
 * @param {HostWorksheet} source - Source sheet.
 * @param {ChartCellSheet} dest - Destination chart-local sheet.
 * @returns {void}
 */
function copyHostSheetValues(source: HostWorksheet, dest: ChartCellSheet): void {
    if (source instanceof ChartCellSheet) {
        const cells: ReadonlyArray<{ col: number; row: number; value: string | number | boolean | Date | null | undefined }> =
            source.occupiedCells();
        for (let i: number = 0; i < cells.length; i++) {
            const cell: { col: number; row: number; value: string | number | boolean | Date | null | undefined } = cells[i];
            dest.getCell(colLetters(cell.col) + String(cell.row)).value = cell.value;
        }
        return;
    }
    for (let r: number = 1; r <= 200; r++) {
        let emptyStreak: number = 0;
        let any: boolean = false;
        for (let c: number = 0; c < 26; c++) {
            const addr: string = colLetters(c) + String(r);
            let value: string | number | boolean | Date | null | undefined;
            try {
                value = source.getCell(addr).value;
            }
            catch {
                break;
            }
            if (value !== undefined && value !== null) {
                dest.getCell(addr).value = value;
                any = true;
                emptyStreak = 0;
            }
        }
        if (!any) {
            emptyStreak += 1;
            if (emptyStreak >= 3 && r > 3) {
                break;
            }
        }
    }
}
/**
 *
 * @param {number} col0 - Zero-based column.
 * @returns {string} Column letters.
 */
function colLetters(col0: number): string {
    let n: number = col0 + 1;
    let s: string = '';
    while (n > 0) {
        const rem: number = (n - 1) % 26;
        s = String.fromCharCode(65 + rem) + s;
        n = Math.floor((n - 1) / 26);
    }
    return s;
}
/**
 *
 * @param {HostWorkbook} wb - The wb value.
 * @param {string | number | undefined} sheet - The sheet value.
 * @param {string} slidePartName - The slidePartName value.
 * @returns {HostWorksheet} The result.
 */
function resolveSourceSheet(wb: HostWorkbook, sheet: string | number | undefined, slidePartName: string): HostWorksheet {
    try {
        if (sheet === undefined) {
            const first: HostWorksheet = wb.worksheets[0];
            if (first === undefined) {
                throw new ChartsError('Source workbook has no worksheets', partNameOptions(slidePartName));
            }
            return first;
        }
        return wb.sheet(sheet);
    }
    catch (err) {
        if (err instanceof ChartsError) {
            throw err;
        }
        // Host workbook may throw InvalidArgumentError (or similar) for missing
        // sheets — surface a typed ChartsError for the public addChart contract.
        const detail: string = err instanceof Error ? err.message : String(err);
        throw new ChartsError(`from.sheet could not be resolved: ${detail}`, partNameOptions(slidePartName));
    }
}
interface SeriesRow {
    readonly category: string | number | boolean | Date | null | undefined;
    readonly value: string | number | boolean | Date | null | undefined;
}
interface ParsedTwoColumnSeries {
    readonly categoryRange: string;
    readonly valueRange: string;
    readonly rows: ReadonlyArray<SeriesRow>;
}
/**
 * Parse a single-area A1 range into left-column categories + right-column values.
 *
 * @remarks Requires exactly two columns. Sheet-qualified refs (`Sheet1!A1:B3`) and multi-area unions are refused. Citations: Excel A1
 * addressing used by ej2-xlsx `addChart`.
 * @param {HostWorksheet} sheet - The sheet value.
 * @param {string} rangeText - The rangeText value.
 * @param {string} slidePartName - The slidePartName value.
 * @returns {ParsedTwoColumnSeries} The result.
 */
function readTwoColumnSeries(sheet: HostWorksheet, rangeText: string, slidePartName: string): ParsedTwoColumnSeries {
    const trimmed: string = rangeText.trim();
    if (trimmed.length === 0) {
        throw new ChartsError('from.range must be a non-empty A1 range', partNameOptions(slidePartName));
    }
    if (stringIncludes(trimmed, '!') || stringIncludes(trimmed, ',') || stringIncludes(trimmed, ' ')) {
        throw new ChartsError(`from.range "${trimmed}" must be a single-area A1 range without sheet prefix`,
                              partNameOptions(slidePartName));
    }
    const parts: Array<string> = trimmed.split(':');
    if (parts.length !== 2 || parts[0] === undefined || parts[1] === undefined) {
        throw new ChartsError(`from.range "${trimmed}" must be an inclusive A1 pair (e.g. A2:B4)`, partNameOptions(slidePartName));
    }
    const start: { readonly col: number; readonly row: number; } = parseA1Cell(parts[0], slidePartName);
    const end: { readonly col: number; readonly row: number; } = parseA1Cell(parts[1], slidePartName);
    const col0: number = Math.min(start.col, end.col);
    const col1: number = Math.max(start.col, end.col);
    const row0: number = Math.min(start.row, end.row);
    const row1: number = Math.max(start.row, end.row);
    if (col1 - col0 !== 1) {
        throw new ChartsError(`from.range "${trimmed}" must span exactly two columns (categories + values)`,
                              partNameOptions(slidePartName));
    }
    if (row1 < row0) {
        throw new ChartsError(`from.range "${trimmed}" has an empty row span`, partNameOptions(slidePartName));
    }
    const catColLetter: string = columnIndexToLetters(col0);
    const valColLetter: string = columnIndexToLetters(col1);
    const categoryRange: string = `${catColLetter}${String(row0)}:${catColLetter}${String(row1)}`;
    const valueRange: string = `${valColLetter}${String(row0)}:${valColLetter}${String(row1)}`;
    const rows: SeriesRow[] = [];
    for (let r: number = row0; r <= row1; r += 1) {
        const catAddr: string = `${catColLetter}${String(r)}`;
        const valAddr: string = `${valColLetter}${String(r)}`;
        let category: SeriesRow['category'];
        let value: SeriesRow['value'];
        try {
            category = sheet.getCell(catAddr).value;
            value = sheet.getCell(valAddr).value;
        }
        catch (err) {
            const msg: string = err instanceof Error ? err.message : String(err);
            throw new ChartsError(`Failed to read cells for from.range "${trimmed}": ${msg}`, partNameOptions(slidePartName));
        }
        rows.push({ category, value });
    }
    if (rows.length === 0) {
        throw new ChartsError(`from.range "${trimmed}" produced no series rows`, partNameOptions(slidePartName));
    }
    return { categoryRange, valueRange, rows };
}
/**
 *
 * @param {string} address - The address value.
 * @param {string} slidePartName - The slidePartName value.
 * @returns {object} The result.
 */
function parseA1Cell(address: string, slidePartName: string): {
    readonly col: number;
    readonly row: number;
} {
    const m: RegExpExecArray = /^([A-Za-z]+)([1-9][0-9]*)$/.exec(address.trim());
    if (m === null || m[1] === undefined || m[2] === undefined) {
        throw new ChartsError(`Invalid A1 cell address "${address}" in from.range`, partNameOptions(slidePartName));
    }
    const col: number = lettersToColumnIndex(m[1].toUpperCase());
    const row: number = Number.parseInt(m[2], 10);
    if (!Number.isFinite(row) || row < 1) {
        throw new ChartsError(`Invalid A1 row in "${address}"`, partNameOptions(slidePartName));
    }
    return { col, row };
}
/**
 * 0-based column index from Excel letters (A=0).
 *
 * @param {string} letters - The letters value.
 * @returns {number} The result.
 */
function lettersToColumnIndex(letters: string): number {
    let n: number = 0;
    for (let i: number = 0; i < letters.length; i += 1) {
        const code: number = letters.charCodeAt(i);
        if (code < 65 || code > 90) {
            throw new ChartsError(`Invalid column letters "${letters}"`);
        }
        n = n * 26 + (code - 64);
    }
    return n - 1;
}
/**
 * Excel column letters from 0-based index.
 *
 * @param {number} index - The index value.
 * @returns {string} The result.
 */
function columnIndexToLetters(index: number): string {
    if (!Number.isInteger(index) || index < 0) {
        throw new ChartsError(`Invalid column index ${String(index)}`);
    }
    let n: number = index + 1;
    let s: string = '';
    while (n > 0) {
        const rem: number = (n - 1) % 26;
        s = String.fromCharCode(65 + rem) + s;
        n = Math.floor((n - 1) / 26);
    }
    return s;
}
/**
 *
 * @param {PackagePartAccess} access - The access value.
 * @returns {string} The result.
 */
function allocateNextChartPartName(access: PackagePartAccess): string {
    let n: number = 1;
    while (access.getPart(`${PPT_CHART_PART_PREFIX}/chart${String(n)}.xml`) !== undefined) {
        n += 1;
        if (n > 100000) {
            throw new ChartsError('Unable to allocate a free chart part name');
        }
    }
    return `${PPT_CHART_PART_PREFIX}/chart${String(n)}.xml`;
}
/**
 *
 * @param {PackagePartAccess} access - The access value.
 * @returns {string} The result.
 */
function allocateNextEmbeddingPartName(access: PackagePartAccess): string {
    let n: number = 1;
    while (access.getPart(`${PPT_EMBEDDING_PART_PREFIX}/Microsoft_Excel_Worksheet${String(n)}.xlsx`) !== undefined) {
        n += 1;
        if (n > 100000) {
            throw new ChartsError('Unable to allocate a free embedding part name');
        }
    }
    return `${PPT_EMBEDDING_PART_PREFIX}/Microsoft_Excel_Worksheet${String(n)}.xlsx`;
}
/**
 *
 * @param {string} chartPartName - The chartPartName value.
 * @param {string} embeddingPartName - The embeddingPartName value.
 * @param {string} slidePartName - The slidePartName value.
 * @returns {void} Nothing.
 */
function assertSafeChartPaths(chartPartName: string, embeddingPartName: string, slidePartName: string): void {
    const items: string[] = [chartPartName, embeddingPartName];
    for (let i: number = 0; i < items.length; i++) {
        const name: string = arrayAt(items, i);
        if (stringIncludes(name, '..') || stringIncludes(name, '//') || !name.startsWith('/ppt/')) {
            throw new ChartsError(`Refusing unsafe chart package path: "${name}"`, partNameOptions(slidePartName));
        }

    }
    if (!chartPartName.startsWith(`${PPT_CHART_PART_PREFIX}/`)) {
        throw new ChartsError(`Chart part must live under ${PPT_CHART_PART_PREFIX}`, partNameOptions(slidePartName));
    }
    if (!embeddingPartName.startsWith(`${PPT_EMBEDDING_PART_PREFIX}/`)) {
        throw new ChartsError(`Embedding part must live under ${PPT_EMBEDDING_PART_PREFIX}`, partNameOptions(slidePartName));
    }
}
/**
 * Builds a relative Target from source part directory to absolute target part.
 *
 * @param {string} sourcePartName - The sourcePartName value.
 * @param {string} targetPartName - The targetPartName value.
 * @returns {string} The result.
 */
function relativeTargetFromSource(sourcePartName: string, targetPartName: string): string {
    const sourceDir: string = sourcePartName.slice(0, sourcePartName.lastIndexOf('/'));
    const targetDir: string = targetPartName.slice(0, targetPartName.lastIndexOf('/'));
    const targetFile: string = targetPartName.slice(targetPartName.lastIndexOf('/') + 1);
    const sourceSegs: Array<string> = sourceDir === '' ? [] : sourceDir.slice(1).split('/');
    const targetSegs: Array<string> = targetDir === '' ? [] : targetDir.slice(1).split('/');
    let common: number = 0;
    while (common < sourceSegs.length &&
        common < targetSegs.length &&
        arrayAt(sourceSegs, common) === arrayAt(targetSegs, common)) {
        common += 1;
    }
    const up: number = sourceSegs.length - common;
    const down: Array<string> = targetSegs.slice(common);
    const parts: string[] = [];
    for (let i: number = 0; i < up; i += 1) {
        parts.push('..');
    }
    for (let i2: number = 0; i2 < down.length; i2++) {
        const seg: string = arrayAt(down, i2);
        parts.push(seg);

    }
    parts.push(targetFile);
    return parts.join('/');
}
/**
 *
 * @param {PackagePartAccess} access - The access value.
 * @param {string} slidePartName - The slidePartName value.
 * @param {*} newPartByteLengths - The newPartByteLengths value.
 * @param {number} newPartCount - The newPartCount value.
 * @returns {void} Nothing.
 */
function enforceCreateLimits(access: PackagePartAccess, slidePartName: string, newPartByteLengths: ReadonlyArray<number>,
                             newPartCount: number): void {
    const nextEntryCount: number = access.partCount() + newPartCount;
    if (nextEntryCount > access.limits.entryCount) {
        throw new PackageLimitError('entryCount', {
            partName: slidePartName,
            actual: nextEntryCount
        });
    }
    for (let i: number = 0; i < newPartByteLengths.length; i++) {
        const byteLength: number = arrayAt(newPartByteLengths, i);
        if (byteLength > access.limits.singlePartUncompressedBytes) {
            throw new PackageLimitError('singlePartUncompressedBytes', {
                partName: slidePartName,
                actual: byteLength
            });
        }

    }
}
/**
 * @param {*} args - The args value.
 * @param {*} args.id - The args.id value.
 * @param {*} args.name - The args.name value.
 * @param {*} args.bounds - The args.bounds value.
 * @param {*} args.chartRelId - The args.chartRelId value.
 * @returns {OoxmlElement} The result.
 */
function buildChartGraphicFrame(args: {
    readonly id: string;
    readonly name: string;
    readonly bounds: ShapeBounds;
    readonly chartRelId: string;
}): OoxmlElement {
    const cNvPr: OoxmlElement = el(PML_NS, 'cNvPr', 'p', [attr('', 'id', args.id), attr('', 'name', args.name)], []);
    const cNvGraphicFramePr: OoxmlElement = el(PML_NS, 'cNvGraphicFramePr', 'p', [], []);
    const nvPr: OoxmlElement = el(PML_NS, 'nvPr', 'p', [], []);
    const nvGraphicFramePr: OoxmlElement = el(PML_NS, 'nvGraphicFramePr', 'p', [], [cNvPr, cNvGraphicFramePr, nvPr]);
    const off: OoxmlElement = el(DML_NS, 'off', 'a', [
        attr('', 'x', coordinateToEmuString(args.bounds.x, 'bounds.x')),
        attr('', 'y', coordinateToEmuString(args.bounds.y, 'bounds.y'))
    ], []);
    const ext: OoxmlElement = el(DML_NS, 'ext', 'a', [
        attr('', 'cx', coordinateToEmuString(args.bounds.width, 'bounds.width')),
        attr('', 'cy', coordinateToEmuString(args.bounds.height, 'bounds.height'))
    ], []);
    const xfrmEl: OoxmlElement = el(PML_NS, 'xfrm', 'p', [], [off, ext]);
    // c:chart with r:id — DrawingML chart namespace + office rel attribute ns.
    const chartHook: OoxmlElement = el(DRAWINGML_CHART_URI, 'chart', 'c', [attr(OFFICE_REL_ATTR_NS, 'id', args.chartRelId, 'r')], [], [
        { prefix: 'c', uri: DRAWINGML_CHART_URI },
        { prefix: 'r', uri: OFFICE_REL_ATTR_NS }
    ]);
    const graphicData: OoxmlElement = el(DML_NS, 'graphicData', 'a', [attr('', 'uri', DRAWINGML_CHART_URI)], [chartHook]);
    const graphic: OoxmlElement = el(DML_NS, 'graphic', 'a', [], [graphicData]);
    return el(PML_NS, 'graphicFrame', 'p', [], [nvGraphicFramePr, xfrmEl, graphic]);
}
/**
 *
 * @param {string} namespaceUri - The namespaceUri value.
 * @param {string} localName - The localName value.
 * @param {string} value - The value value.
 * @param {string} prefix - The prefix value.
 * @returns {OoxmlAttribute} The result.
 */
function attr(namespaceUri: string, localName: string, value: string, prefix?: string): OoxmlAttribute {
    if (prefix !== undefined) {
        return { namespaceUri, localName, value, prefix };
    }
    return { namespaceUri, localName, value };
}
/**
 *
 * @param {string} namespaceUri - The namespaceUri value.
 * @param {string} localName - The localName value.
 * @param {string} prefixHint - The prefixHint value.
 * @param {*} attributes - The attributes value.
 * @param {*} children - The children value.
 * @param {*} namespaceDeclarations - Namespace declarations.
 * @returns {OoxmlElement} The result.
 */
function el(namespaceUri: string, localName: string, prefixHint: string, attributes: ReadonlyArray<OoxmlAttribute>,
            children: ReadonlyArray<OoxmlElement>, namespaceDeclarations?: ReadonlyArray<{
                readonly prefix: string;
                readonly uri: string;
            }>): OoxmlElement {
    if (namespaceDeclarations !== undefined && namespaceDeclarations.length > 0) {
        return {
            kind: 'element' as 'element',
            namespaceUri,
            localName,
            attributes,
            children,
            prefixHint,
            namespaceDeclarations
        };
    }
    return {
        kind: 'element' as 'element',
        namespaceUri,
        localName,
        attributes,
        children,
        prefixHint
    };
}
