/**
 * Internal ChartEx model and serializer for Excel 2016+ chart families.
 *
 * **Not a public package API.** Authors use `Worksheet.addChart` with a
 * ChartEx layout on `ChartType` (e.g. `ChartType.Funnel`). Authoring mirrors
 * classic chart value ranges (`categoryLabels` / `values` / `dataRange`).
 * OOXML `cx:strDim` / `cx:numDim` dimensions are compiled here for
 * serialization only.
 *
 * Package materialize (via `charts.ts`) writes the ChartEx part, `chartEx`
 * relationship, and drawing `graphicFrame` (`a:graphicData` uri = chartex ns
 * + CT_RelId `chart`).
 *
 * OOXML source: [MS-ODRAWXML] §2.1.5 ChartEx part, §2.24.1.1 chart element
 * (CT_RelId), §5.22 CT_ChartSpace / CT_ChartData / CT_Series.
 */

import { parseA1Range, CellRange } from '../address/cell-address';
import { InvalidArgumentError, InvalidChartError } from '../core/errors';
import { escapeXml } from '../core/xml/minimal-xml';

/**
 * ChartEx series layout string tokens ([MS-ODRAWXML] ST_SeriesLayout).
 * Public authoring uses the same keys on `ChartType` (`ChartType.Funnel`, …).
 * Values must stay identical to those tokens.
 */
export type ChartExLayoutValue =
    | 'boxWhisker'
    | 'funnel'
    | 'paretoLine'
    | 'sunburst'
    | 'treemap'
    | 'waterfall'
    | 'histogram'
    | 'regionMap';

const CHART_EX_TYPE_VALUES: Set<string> = new Set<string>([
    'boxWhisker',
    'funnel',
    'paretoLine',
    'sunburst',
    'treemap',
    'waterfall',
    'histogram',
    'regionMap'
]);

/**
 * True when `value` is a supported ChartEx layout token.
 *
 * @param {*} value - The value parameter.
 * @returns {boolean} - Returns the result.
 */
export function isChartExType(value: unknown): value is ChartExLayoutValue {
    return typeof value === 'string' && CHART_EX_TYPE_VALUES.has(value);
}

/** Local layout id constants (not public API — use ChartType.*). */
const ChartExLayout: any = {
    BoxAndWhisker: 'boxWhisker',
    /** A funnel chart showing values shrinking stage by stage. */
    Funnel: 'funnel',
    /** A Pareto chart combining bars with a cumulative percentage line. */
    Pareto: 'paretoLine',
    /** A hierarchical chart drawn as concentric rings. */
    Sunburst: 'sunburst',
    /** A hierarchical chart drawn as nested, sized rectangles. */
    TreeMap: 'treemap',
    /** A waterfall chart showing how running totals rise and fall. */
    Waterfall: 'waterfall',
    /** A histogram (`clusteredColumn` layout with binning). */
    Histogram: 'histogram',
    /** A filled (region) map. */
    FilledMap: 'regionMap'
};

/**
 * Input for a ChartEx part supplying its layout, title, and data (used by
 * `addChart` / package materialize).
 *
 * Supply either:
 * - `dataRange` (optional `isSeriesInRows` / `sheetName`), or
 * - `categoryLabels` + `values` formulas, or
 * - cached `categories` + `valuePoints` literals.
 *
 * TreeMap and Sunburst accept multiple category level formulas (or a multi-column
 * `dataRange` whose trailing column is the size measure).
 *
 * @private
 */
export interface ChartExOptions {
    /** The chart layout to create, such as waterfall, funnel, or treemap. */
    readonly type: ChartExLayoutValue;
    readonly title?: string;
    /**
     * The cell reference providing category labels, or several references
     * for hierarchy-based charts like treemap and sunburst (outermost level
     * first).
     */
    readonly categoryLabels?: string | ReadonlyArray<string>;
    /**
     * The cell reference providing each point's value, or its size for
     * treemap and sunburst charts.
     */
    readonly values?: string;
    /**
     * The source data range for the whole chart, including headers, such as
     * `A1:C4` or `Sheet1!A1:C4`.
     */
    readonly dataRange?: string;
    /**
     * When `true`, each row of the source range becomes one series; when
     * `false` (the default), each column does.
     */
    readonly isSeriesInRows?: boolean;
    /**
     * The sheet assumed for ranges and references that don't name one.
     * Defaults to `Sheet1`.
     */
    readonly sheetName?: string;
    /** The number format applied to the chart's numeric values. */
    readonly formatCode?: string;
    /**
     * Category labels to store directly in the chart instead of referencing
     * cells: one array for a single level, or nested arrays for a hierarchy.
     * Cannot be combined with `categoryLabels` or `dataRange`.
     */
    readonly categories?: ReadonlyArray<string> | ReadonlyArray<ReadonlyArray<string>>;
    /**
     * Optional names for the stored category levels, in the same order as
     * `categories`.
     */
    readonly categoryNames?: ReadonlyArray<string>;
    /**
     * Numeric values to store directly in the chart instead of referencing
     * cells, in point order. Cannot be combined with `values` or `dataRange`.
     */
    readonly valuePoints?: ReadonlyArray<number>;
    /**
     * Histogram only: the width of each bin, in value units. Mutually
     * exclusive with `binCount`. When neither is set, Excel picks the bins.
     */
    readonly binWidth?: number;
    /**
     * Histogram only: the number of bins. Mutually exclusive with `binWidth`.
     */
    readonly binCount?: number;
}

/**
 * Represents an advanced chart, such as a waterfall, funnel, or treemap,
 * created from worksheet data.
 */
export interface ChartEx {
    /** The chart's layout, such as waterfall, funnel, or treemap. */
    readonly type: ChartExLayoutValue;
    /** The text shown in the chart's title, if any. */
    readonly title: string | undefined;
    /**
     * The cell references that provide the category labels, from the
     * outermost level inward, when the categories come from cells.
     */
    readonly categoryLabels: ReadonlyArray<string> | undefined;
    /**
     * The cell reference that provides each point's value or size, when the
     * values come from cells.
     */
    readonly values: string | undefined;
    /** The source data range the chart was created from, when provided. */
    readonly dataRange: string | undefined;
    /**
     * When `true`, the source range's rows were treated as series rather
     * than its columns.
     */
    readonly isSeriesInRows: boolean;
    /** The number format applied to the chart's numeric values. */
    readonly formatCode: string | undefined;
    /**
     * The category labels stored directly in the chart, one array per
     * hierarchy level, when they were supplied as values rather than cell
     * references.
     */
    readonly categories: ReadonlyArray<ReadonlyArray<string>> | undefined;
    /** Optional names for the stored category levels, in the same order. */
    readonly categoryNames: ReadonlyArray<string> | undefined;
    /**
     * The numeric values stored directly in the chart, in point order, when
     * they were supplied as values rather than cell references.
     */
    readonly valuePoints: ReadonlyArray<number> | undefined;
    /** Histogram only: the width of each bin, when set. */
    readonly binWidth: number | undefined;
    /** Histogram only: the number of bins, when set. */
    readonly binCount: number | undefined;
}

/** Internal ChartEx package metadata used only during serialization. */
interface ChartExPackageOptions {
    readonly version?: string;
    readonly featureList?: string;
}

/** A cached string point in a ChartEx string level. */
interface ChartExStringPoint {
    readonly index: number;
    readonly value: string;
}

/** A cached numeric point in a ChartEx numeric level. */
interface ChartExNumericPoint {
    readonly index: number;
    readonly value: number;
}

/** A string level in a ChartEx hierarchy. */
interface ChartExStringLevel {
    readonly name?: string;
    readonly points: ReadonlyArray<ChartExStringPoint>;
}

/** A numeric level in a ChartEx hierarchy. */
interface ChartExNumericLevel {
    readonly name?: string;
    readonly formatCode?: string;
    readonly points: ReadonlyArray<ChartExNumericPoint>;
}

/** Internal string dimension (formula XOR levels). */
interface ChartExStringDimension {
    readonly type: 'cat' | 'colorStr' | 'entityId';
    readonly formula?: string;
    readonly levels?: ReadonlyArray<ChartExStringLevel>;
}

/** Internal numeric dimension (formula XOR levels). */
interface ChartExNumericDimension {
    readonly type: 'val' | 'x' | 'y' | 'size' | 'colorVal';
    readonly formula?: string;
    readonly formatCode?: string;
    readonly levels?: ReadonlyArray<ChartExNumericLevel>;
}

/** Internal ChartEx data dimension (string or numeric). */
type ChartExDimension = ChartExStringDimension | ChartExNumericDimension;

/**
 * Creates an advanced chart model, such as a waterfall, funnel, or treemap, from a cell range or cached values. Compiles author input into OOXML dimensions used by {@link serializeChartEx}. Formulas are not evaluated. Prefer `sheet.addChart(ChartType.*, row, column, width, height, data, values?)` for public authoring — this helper is package-internal.
 *
 * @param {ChartExOptions} options - The options parameter.
 * @returns {ChartEx} - Returns the result.
 */
export function createChartEx(options: ChartExOptions): ChartEx {
    const normalized: NormalizedChartEx = normalizeOptions(options);
    return Object.freeze({
        type: normalized.type,
        title: normalized.title,
        categoryLabels: normalized.categoryLabels,
        values: normalized.values,
        dataRange: normalized.dataRange,
        isSeriesInRows: normalized.isSeriesInRows,
        formatCode: normalized.formatCode,
        categories: normalized.categories,
        categoryNames: normalized.categoryNames,
        valuePoints: normalized.valuePoints,
        binWidth: normalized.binWidth,
        binCount: normalized.binCount
    });
}

/**
 * Serialize a detached ChartEx model as a `cx:chartSpace` part. Package-level only — not re-exported from the public barrel.
 *
 * @param {ChartEx} chart - The chart parameter.
 * @param {ChartExPackageOptions} packageOptions - The packageOptions parameter.
 * @returns {string} - Returns the result.
 */
export function serializeChartEx(chart: ChartEx, packageOptions?: ChartExPackageOptions): string {
    const dimensions: ChartExDimension[] = compileDimensions(chart);
    const dimensionsXml: string = dimensions.map((dimension: ChartExDimension): string => serializeDimension(dimension)).join('');
    const title: string =
        chart.title === undefined
            ? ''
            : `<cx:title><cx:tx><cx:txData><cx:v>${escapeXml(chart.title)}</cx:v></cx:txData></cx:tx></cx:title>`;
    const version: string = escapeXml(
        ((__t: string): string => (__t != null ? __t : '16.0'))(packageOptions == null ? undefined : packageOptions.version)
    );
    const featureList: string = escapeXml(
        ((__t: string): string => (__t != null ? __t : ''))(packageOptions == null ? undefined : packageOptions.featureList)
    );
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<cx:chartSpace xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" ' +
        'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" ' +
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
        `version="${version}" featureList="${featureList}">` +
        `<cx:chartData><cx:data id="0">${dimensionsXml}</cx:data></cx:chartData>` +
        `<cx:chart>${title}<cx:plotArea><cx:plotAreaRegion>` +
        `<cx:series layoutId="${layoutIdFor(chart.type)}"><cx:dataId val="0"/>${serializeLayoutPr(chart)}${serializeSeriesAxisIds(chart.type)}</cx:series>` +
        `</cx:plotAreaRegion>${serializeAxes(chart.type)}</cx:plotArea></cx:chart></cx:chartSpace>`
    );
}

/**
 * The `cx:series/@layoutId` for a layout token. A histogram is the
 * `clusteredColumn` layout with binning; every other token is its own layout id.
 *
 * @param {ChartExLayoutValue} type - The type parameter.
 * @returns {string} - Returns the result.
 */
function layoutIdFor(type: ChartExLayoutValue): string {
    return type === ChartExLayout.Histogram ? 'clusteredColumn' : type;
}

/**
 * `cx:layoutPr` (CT_SeriesLayoutProperties) for layouts that carry layout
 * properties: histogram binning and region-map geography. Empty for others.
 *
 * @param {ChartEx} chart - The chart parameter.
 * @returns {string} - Returns the result.
 */
function serializeLayoutPr(chart: ChartEx): string {
    if (chart.type === ChartExLayout.Histogram) {
        // CT_Binning: optional choice of binSize | binCount (xsd:double / xsd:unsignedInt
        // text content, [MS-ODRAWXML] 2.24.3.7), then attributes.
        let body: string = '';
        if (chart.binWidth !== undefined) {
            body = `<cx:binSize>${chart.binWidth}</cx:binSize>`;
        } else if (chart.binCount !== undefined) {
            body = `<cx:binCount>${chart.binCount}</cx:binCount>`;
        }
        return `<cx:layoutPr><cx:binning intervalClosed="r">${body}</cx:binning></cx:layoutPr>`;
    }
    if (chart.type === ChartExLayout.FilledMap) {
        // CT_Geography requires cultureLanguage, cultureRegion and attribution.
        // No geoCache is written: Excel resolves place names when it opens the file.
        return (
            '<cx:layoutPr><cx:geography cultureLanguage="en-US" cultureRegion="US" ' +
            'attribution="Powered by Bing"/></cx:layoutPr>'
        );
    }
    return '';
}

/**
 * Series-to-axis references (CT_Series `axisId`, ST_AxisId text content).
 * Only the histogram declares axes.
 *
 * @param {ChartExLayoutValue} type - The type parameter.
 * @returns {string} - Returns the result.
 */
function serializeSeriesAxisIds(type: ChartExLayoutValue): string {
    return type === ChartExLayout.Histogram ? '<cx:axisId>0</cx:axisId><cx:axisId>1</cx:axisId>' : '';
}

/**
 * `cx:axis` elements. A histogram needs a category axis with no gap between
 * columns (`gapWidth="0"`) and a value axis, which is what makes the columns
 * read as bins.
 *
 * @param {ChartExLayoutValue} type - The type parameter.
 * @returns {string} - Returns the result.
 */
function serializeAxes(type: ChartExLayoutValue): string {
    if (type !== ChartExLayout.Histogram) {
        return '';
    }
    return (
        '<cx:axis id="0"><cx:catScaling gapWidth="0"/><cx:tickLabels/></cx:axis>' +
        '<cx:axis id="1"><cx:valScaling/><cx:majorGridlines/><cx:tickLabels/></cx:axis>'
    );
}

/**
 * Deep-copy a detached ChartEx model without shared mutable arrays. Package-level only — not re-exported from the public barrel.
 *
 * @param {ChartEx} chart - The chart parameter.
 * @returns {ChartEx} - Returns the result.
 */
export function cloneChartEx(chart: ChartEx): ChartEx {
    return createChartEx({
        type: chart.type,
        ...(chart.title !== undefined ? { title: chart.title } : {}),
        ...(chart.categoryLabels !== undefined ? { categoryLabels: [...chart.categoryLabels] } : {}),
        ...(chart.values !== undefined ? { values: chart.values } : {}),
        ...(chart.dataRange !== undefined ? { dataRange: chart.dataRange } : {}),
        isSeriesInRows: chart.isSeriesInRows,
        ...(chart.formatCode !== undefined ? { formatCode: chart.formatCode } : {}),
        ...(chart.categories !== undefined
            ? { categories: chart.categories.map((level: ReadonlyArray<string>): string[] => [...level]) }
            : {}),
        ...(chart.categoryNames !== undefined ? { categoryNames: [...chart.categoryNames] } : {}),
        ...(chart.valuePoints !== undefined ? { valuePoints: [...chart.valuePoints] } : {}),
        ...(chart.binWidth !== undefined ? { binWidth: chart.binWidth } : {}),
        ...(chart.binCount !== undefined ? { binCount: chart.binCount } : {})
    });
}

/**
 * NormalizedChartEx.
 */
interface NormalizedChartEx {
    readonly type: ChartExLayoutValue;
    readonly title: string | undefined;
    readonly categoryLabels: ReadonlyArray<string> | undefined;
    readonly values: string | undefined;
    readonly dataRange: string | undefined;
    readonly isSeriesInRows: boolean;
    readonly formatCode: string | undefined;
    readonly categories: ReadonlyArray<ReadonlyArray<string>> | undefined;
    readonly categoryNames: ReadonlyArray<string> | undefined;
    readonly valuePoints: ReadonlyArray<number> | undefined;
    readonly binWidth: number | undefined;
    readonly binCount: number | undefined;
}

/**
 * normalizeOptions function.
 *
 * @param {ChartExOptions} options - The options parameter.
 * @returns {NormalizedChartEx} - Returns the result.
 */
function normalizeOptions(options: ChartExOptions): NormalizedChartEx {
    if (options === null || typeof options !== 'object') {
        throw new InvalidArgumentError('ChartEx options must be an object');
    }
    if (!isChartExType(options.type)) {
        throw new InvalidChartError(`Unknown ChartEx type "${String(options.type)}"`);
    }

    const title: string = options.title === undefined ? undefined : String(options.title);
    const isSeriesInRows: boolean = options.isSeriesInRows === true;
    const sheetName: string =
        options.sheetName === undefined || String(options.sheetName).trim().length === 0 ? 'Sheet1' : String(options.sheetName).trim();
    const formatCode: string = options.formatCode === undefined ? undefined : String(options.formatCode);
    if (formatCode !== undefined && formatCode.trim().length === 0) {
        throw new InvalidChartError('ChartEx formatCode must not be empty');
    }

    const dataRangeRaw: string = options.dataRange === undefined ? undefined : String(options.dataRange).trim();
    const dataRange: string = dataRangeRaw !== undefined && dataRangeRaw.length > 0 ? dataRangeRaw : undefined;

    let categoryLabels: ReadonlyArray<string> = normalizeFormulaList(options.categoryLabels, 'categoryLabels');
    let values: string = normalizeOptionalFormula(options.values, 'values');
    const categories: ReadonlyArray<ReadonlyArray<string>> = normalizeCachedCategories(options.categories);
    const categoryNames: ReadonlyArray<string> = normalizeOptionalStringList(options.categoryNames, 'categoryNames');
    const valuePoints: ReadonlyArray<number> = normalizeValuePoints(options.valuePoints);

    if (dataRange !== undefined) {
        if (categoryLabels !== undefined || values !== undefined) {
            throw new InvalidChartError('ChartEx dataRange cannot be combined with categoryLabels or values');
        }
        if (categories !== undefined || valuePoints !== undefined) {
            throw new InvalidChartError('ChartEx dataRange cannot be combined with cached categories or valuePoints');
        }
        const derived: { categoryLabels: ReadonlyArray<string>; values: string } = deriveFromDataRange(
            dataRange,
            isSeriesInRows,
            sheetName,
            options.type
        );
        categoryLabels = derived.categoryLabels;
        values = derived.values;
    }

    const hasFormulaCats: boolean = categoryLabels !== undefined && categoryLabels.length > 0;
    const hasFormulaVals: boolean = values !== undefined;
    const hasCachedCats: boolean = categories !== undefined;
    const hasCachedVals: boolean = valuePoints !== undefined;

    if (!hasFormulaVals && !hasCachedVals) {
        throw new InvalidChartError('ChartEx requires values or valuePoints (or a dataRange that derives them)');
    }
    if (hasFormulaVals && hasCachedVals) {
        throw new InvalidChartError('ChartEx values and valuePoints are mutually exclusive');
    }
    if (hasFormulaCats && hasCachedCats) {
        throw new InvalidChartError('ChartEx categoryLabels and categories are mutually exclusive');
    }
    if (categoryNames !== undefined && !hasCachedCats) {
        throw new InvalidChartError('ChartEx categoryNames require cached categories');
    }
    if (categoryNames !== undefined && categories !== undefined && categoryNames.length > categories.length) {
        throw new InvalidChartError('ChartEx categoryNames longer than categories levels');
    }

    const binWidth: number = options.binWidth;
    const binCount: number = options.binCount;
    if (binWidth !== undefined || binCount !== undefined) {
        if (options.type !== ChartExLayout.Histogram) {
            throw new InvalidChartError('ChartEx binWidth and binCount are only valid for a histogram');
        }
        if (binWidth !== undefined && binCount !== undefined) {
            throw new InvalidChartError('Histogram binWidth and binCount are mutually exclusive');
        }
        if (binWidth !== undefined && !(typeof binWidth === 'number' && isFinite(binWidth) && binWidth > 0)) {
            throw new InvalidChartError('Histogram binWidth must be a positive number');
        }
        if (binCount !== undefined && !(typeof binCount === 'number' && Math.floor(binCount) === binCount && binCount > 0)) {
            throw new InvalidChartError('Histogram binCount must be a positive integer');
        }
    }

    return {
        type: options.type,
        title,
        categoryLabels: hasFormulaCats ? categoryLabels : undefined,
        values: hasFormulaVals ? values : undefined,
        dataRange,
        isSeriesInRows,
        formatCode,
        categories: hasCachedCats ? categories : undefined,
        categoryNames,
        valuePoints: hasCachedVals ? valuePoints : undefined,
        binWidth,
        binCount
    };
}

/**
 * normalizeOptionalFormula function.
 *
 * @param {string} value - The value parameter.
 * @param {string} label - The label parameter.
 * @returns {string} - Returns the result.
 */
function normalizeOptionalFormula(value: string | undefined, label: string): string | undefined {
    if (value === undefined) {
        return undefined;
    }
    const trimmed: string = String(value).trim();
    if (trimmed.length === 0) {
        throw new InvalidChartError(`ChartEx ${label} must not be empty`);
    }
    return trimmed;
}

/**
 * normalizeFormulaList function.
 *
 * @param {string} value - The value parameter.
 * @param {string} label - The label parameter.
 * @returns {string} - Returns the result.
 */
function normalizeFormulaList(value: string | ReadonlyArray<string> | undefined, label: string): ReadonlyArray<string> | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value === 'string') {
        const one: string = normalizeOptionalFormula(value, label);
        return one === undefined ? undefined : [one];
    }
    if (!Array.isArray(value) || value.length === 0) {
        throw new InvalidChartError(`ChartEx ${label} must be a non-empty formula or formula list`);
    }
    return value.map((item: any, index: number): any => {
        const trimmed: any = String(item).trim();
        if (trimmed.length === 0) {
            throw new InvalidChartError(`ChartEx ${label}[${index}] must not be empty`);
        }
        return trimmed;
    });
}

/**
 * normalizeOptionalStringList function.
 *
 * @param {string} value - The value parameter.
 * @param {string} label - The label parameter.
 * @returns {string} - Returns the result.
 */
function normalizeOptionalStringList(value: ReadonlyArray<string> | undefined, label: string): ReadonlyArray<string> | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (!Array.isArray(value)) {
        throw new InvalidChartError(`ChartEx ${label} must be an array of strings`);
    }
    return value.map((item: any, index: number): any => {
        const trimmed: any = String(item).trim();
        if (trimmed.length === 0) {
            throw new InvalidChartError(`ChartEx ${label}[${index}] must not be empty`);
        }
        return trimmed;
    });
}

/**
 * normalizeCachedCategories function.
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function normalizeCachedCategories(
    value: ReadonlyArray<string> | ReadonlyArray<ReadonlyArray<string>> | undefined
): ReadonlyArray<ReadonlyArray<string>> | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (!Array.isArray(value) || value.length === 0) {
        throw new InvalidChartError('ChartEx categories must be a non-empty array');
    }
    // Flat string[] → one level; (string[])[] → hierarchy.
    if (typeof value[0] === 'string') {
        const level: string[] = (value as ReadonlyArray<string>).map((item: string, index: number): string => {
            if (typeof item !== 'string') {
                throw new InvalidChartError(`ChartEx categories[${index}] must be a string`);
            }
            return item;
        });
        if (level.length === 0) {
            throw new InvalidChartError('ChartEx categories level must not be empty');
        }
        return [level];
    }
    const levels: string[][] = (value as ReadonlyArray<ReadonlyArray<string>>).map(
        (level: ReadonlyArray<string>, levelIndex: number): string[] => {
            if (!Array.isArray(level) || level.length === 0) {
                throw new InvalidChartError(`ChartEx categories[${levelIndex}] must be a non-empty string array`);
            }
            return level.map((item: any, index: number): string => {
                if (typeof item !== 'string') {
                    throw new InvalidChartError(`ChartEx categories[${levelIndex}][${index}] must be a string`);
                }
                return item;
            });
        }
    );
    return levels;
}

/**
 * normalizeValuePoints function.
 *
 * @param {number} value - The value parameter.
 * @returns {number} - Returns the result.
 */
function normalizeValuePoints(value: ReadonlyArray<number> | undefined): ReadonlyArray<number> | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (!Array.isArray(value) || value.length === 0) {
        throw new InvalidChartError('ChartEx valuePoints must be a non-empty number array');
    }
    return value.map((item: any, index: number): number => {
        if (typeof item !== 'number' || !Number.isFinite(item)) {
            throw new InvalidChartError(`ChartEx valuePoints[${index}] must be a finite number`);
        }
        return item;
    });
}

/**
 * isHierarchicalLayout function.
 *
 * @param {ChartExLayoutValue} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
function isHierarchicalLayout(type: ChartExLayoutValue): boolean {
    return type === ChartExLayout.TreeMap || type === ChartExLayout.Sunburst;
}

/**
 * numericDimensionType function.
 *
 * @param {ChartExLayoutValue} type - The type parameter.
 * @returns {Object} - Returns the result.
 */
function numericDimensionType(type: ChartExLayoutValue): 'val' | 'size' | 'colorVal' {
    if (type === ChartExLayout.FilledMap) {
        // A filled map shades each region by this value.
        return 'colorVal';
    }
    return isHierarchicalLayout(type) ? 'size' : 'val';
}

/**
 * Derive category + value formulas from a rectangular data range with headers. Layout matches common XlsIO DataRange behaviour (headers included): - series in columns (default): category columns then one value column; hierarchical layouts treat every column except the last as a category level. - series in rows: transposed of the above.
 *
 * @param {string} dataRange - The dataRange parameter.
 * @param {boolean} isSeriesInRows - The isSeriesInRows parameter.
 * @param {string} defaultSheetName - The defaultSheetName parameter.
 * @param {ChartExLayoutValue} type - The type parameter.
 * @returns {Object} - Returns the result.
 */
function deriveFromDataRange(
    dataRange: string,
    isSeriesInRows: boolean,
    defaultSheetName: string,
    type: ChartExLayoutValue
): { categoryLabels: ReadonlyArray<string>; values: string } {
    const { sheetName, range } = splitSheetRange(dataRange, defaultSheetName);
    const sheetPrefix: string = quoteSheetName(sheetName);
    const hierarchical: boolean = isHierarchicalLayout(type);

    if (type === ChartExLayout.Histogram) {
        // A histogram bins one run of numbers, so a single header-plus-values
        // column (or row) is enough and there are no category labels.
        if (isSeriesInRows && range.startRow === range.endRow && range.startCol < range.endCol) {
            return { categoryLabels: [], values: absSheetRange(sheetPrefix, range.startRow, range.startCol + 1, range.endRow, range.endCol) };
        }
        if (!isSeriesInRows && range.startCol === range.endCol && range.startRow < range.endRow) {
            return { categoryLabels: [], values: absSheetRange(sheetPrefix, range.startRow + 1, range.startCol, range.endRow, range.endCol) };
        }
    }

    if (isSeriesInRows) {
        const catStartCol: number = range.startCol + 1;
        if (catStartCol > range.endCol || range.startRow >= range.endRow) {
            throw new InvalidChartError('dataRange is too small to derive ChartEx series in rows');
        }
        if (hierarchical) {
            if (range.endRow - range.startRow < 2) {
                throw new InvalidChartError('hierarchical ChartEx dataRange in rows needs header, at least one category row, and values');
            }
            const categoryLabels: string[] = [];
            for (let r: number = range.startRow + 1; r < range.endRow; r++) {
                categoryLabels.push(absSheetRange(sheetPrefix, r, catStartCol, r, range.endCol));
            }
            const values: string = absSheetRange(sheetPrefix, range.endRow, catStartCol, range.endRow, range.endCol);
            return { categoryLabels, values };
        }
        const categoryLabels: string[] = [absSheetRange(sheetPrefix, range.startRow, catStartCol, range.startRow, range.endCol)];
        const values: string = absSheetRange(sheetPrefix, range.startRow + 1, catStartCol, range.startRow + 1, range.endCol);
        return { categoryLabels, values };
    }

    const catStartRow: number = range.startRow + 1;
    if (catStartRow > range.endRow || range.startCol >= range.endCol) {
        throw new InvalidChartError('dataRange is too small to derive ChartEx series in columns');
    }

    if (hierarchical) {
        if (range.endCol - range.startCol < 1) {
            throw new InvalidChartError('hierarchical ChartEx dataRange needs at least one category column and one value column');
        }
        const categoryLabels: string[] = [];
        for (let c: number = range.startCol; c < range.endCol; c++) {
            categoryLabels.push(absSheetRange(sheetPrefix, catStartRow, c, range.endRow, c));
        }
        const values: string = absSheetRange(sheetPrefix, catStartRow, range.endCol, range.endRow, range.endCol);
        return { categoryLabels, values };
    }

    const categoryLabels: string[] = [absSheetRange(sheetPrefix, catStartRow, range.startCol, range.endRow, range.startCol)];
    const values: string = absSheetRange(sheetPrefix, catStartRow, range.startCol + 1, range.endRow, range.startCol + 1);
    return { categoryLabels, values };
}

/**
 * compileDimensions function.
 *
 * @param {ChartEx} chart - The chart parameter.
 * @returns {ChartExDimension[]} - Returns the result.
 */
function compileDimensions(chart: ChartEx): ChartExDimension[] {
    const dimensions: ChartExDimension[] = [];

    if (chart.categoryLabels !== undefined) {
        for (const formula of chart.categoryLabels) {
            dimensions.push({ type: 'cat', formula });
        }
    } else if (chart.categories !== undefined) {
        const levels: ChartExStringLevel[] = chart.categories.map(
            (points: ReadonlyArray<string>, levelIndex: number): { points: { index: number; value: string }[]; name?: string } => {
                // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
                const name: string = chart.categoryNames == null ? undefined : chart.categoryNames[levelIndex];
                return {
                    ...(name !== undefined ? { name } : {}),
                    points: points.map((value: string, index: number): { index: number; value: string } => ({ index, value }))
                };
            }
        );
        dimensions.push({ type: 'cat', levels });
    }

    const numType: 'val' | 'size' | 'colorVal' = numericDimensionType(chart.type);
    if (chart.values !== undefined) {
        dimensions.push({
            type: numType,
            formula: chart.values,
            ...(chart.formatCode !== undefined ? { formatCode: chart.formatCode } : {})
        });
    } else if (chart.valuePoints !== undefined) {
        dimensions.push({
            type: numType,
            ...(chart.formatCode !== undefined ? { formatCode: chart.formatCode } : {}),
            levels: [
                {
                    points: chart.valuePoints.map((value: number, index: number): { index: number; value: number } => ({ index, value })),
                    ...(chart.formatCode !== undefined ? { formatCode: chart.formatCode } : {})
                }
            ]
        });
    }

    if (dimensions.length === 0) {
        throw new InvalidChartError('ChartEx requires at least one data dimension');
    }
    for (const dimension of dimensions) {
        validateDimension(dimension);
    }
    return dimensions;
}

/**
 * validateDimension function.
 *
 * @param {ChartExDimension} dimension - The dimension parameter.
 * @returns {void} - Returns the result.
 */
function validateDimension(dimension: ChartExDimension): void {
    const hasFormula: boolean = dimension.formula !== undefined;
    const hasLevels: boolean = dimension.levels !== undefined;
    if (hasFormula === hasLevels) {
        throw new InvalidChartError('A ChartEx dimension requires formula or levels, but not both');
    }
    if (hasFormula) {
        const formula: string = dimension.formula;
        if (formula === undefined || formula.trim().length === 0) {
            throw new InvalidChartError('ChartEx dimension formula must not be empty');
        }
    }
    if (hasLevels) {
        const levels: ReadonlyArray<ChartExStringLevel> | ReadonlyArray<ChartExNumericLevel> = dimension.levels;
        if (levels === undefined || levels.length === 0) {
            throw new InvalidChartError('ChartEx dimension levels must not be empty');
        }
    }
}

/**
 * splitSheetRange function.
 *
 * @param {string} dataRange - The dataRange parameter.
 * @param {string} defaultSheetName - The defaultSheetName parameter.
 * @returns {Object} - Returns the result.
 */
function splitSheetRange(dataRange: string, defaultSheetName: string): { sheetName: string; range: CellRange } {
    const trimmed: string = dataRange.trim();
    const bang: number = trimmed.lastIndexOf('!');
    let sheetName: string = defaultSheetName;
    let local: string = trimmed;
    if (bang >= 0) {
        sheetName = unquoteSheetName(trimmed.slice(0, bang));
        local = trimmed.slice(bang + 1);
    }
    try {
        const range: CellRange = parseA1Range(local.replace(/\$/g, ''));
        return { sheetName, range };
    } catch (err) {
        throw new InvalidChartError(`Invalid dataRange "${dataRange}"`, { cause: err });
    }
}

/**
 * unquoteSheetName function.
 *
 * @param {string} name - The name parameter.
 * @returns {string} - Returns the result.
 */
function unquoteSheetName(name: string): string {
    const t: string = name.trim();
    if (t.startsWith('\'') && t.endsWith('\'') && t.length >= 2) {
        return t.slice(1, -1).replace(/''/g, '\'');
    }
    return t;
}

/**
 * quoteSheetName function.
 *
 * @param {string} name - The name parameter.
 * @returns {string} - Returns the result.
 */
function quoteSheetName(name: string): string {
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
        return name;
    }
    return `'${name.replace(/'/g, '\'\'')}'`;
}

/**
 * absSheetRange function.
 *
 * @param {string} sheetPrefix - The sheetPrefix parameter.
 * @param {number} r1 - The r1 parameter.
 * @param {number} c1 - The c1 parameter.
 * @param {number} r2 - The r2 parameter.
 * @param {number} c2 - The c2 parameter.
 * @returns {string} - Returns the result.
 */
function absSheetRange(sheetPrefix: string, r1: number, c1: number, r2: number, c2: number): string {
    return `${sheetPrefix}!$${colLetters(c1)}$${r1}:$${colLetters(c2)}$${r2}`;
}

/**
 * colLetters function.
 *
 * @param {number} col - The col parameter.
 * @returns {string} - Returns the result.
 */
function colLetters(col: number): string {
    let n: number = col;
    let s: string = '';
    while (n > 0) {
        const rem: number = (n - 1) % 26;
        s = String.fromCharCode(65 + rem) + s;
        n = Math.floor((n - 1) / 26);
    }
    return s;
}

/**
 * serializeDimension function.
 *
 * @param {ChartExDimension} dimension - The dimension parameter.
 * @returns {string} - Returns the result.
 */
function serializeDimension(dimension: ChartExDimension): string {
    if (!isNumericDimension(dimension)) {
        let body: string = '';
        if (dimension.formula !== undefined) {
            body = `<cx:f>${escapeXml(dimension.formula)}</cx:f>`;
        } else if (dimension.levels !== undefined) {
            body = dimension.levels.map(serializeStringLevel).join('');
        }
        return `<cx:strDim type="${dimension.type}">${body}</cx:strDim>`;
    }
    let formulaOrLevels: string = '';
    if (dimension.formula !== undefined) {
        formulaOrLevels = `<cx:f>${escapeXml(dimension.formula)}</cx:f>`;
    } else if (dimension.levels !== undefined) {
        formulaOrLevels = dimension.levels.map(serializeNumericLevel).join('');
    }
    // formatCode on formula-backed numDim is retained on the model for authoring;
    // Excel fills the numeric cache on load. Cached levels carry formatCode in XML.
    void dimension.formatCode;
    return `<cx:numDim type="${dimension.type}">${formulaOrLevels}</cx:numDim>`;
}

/**
 * isNumericDimension function.
 *
 * @param {ChartExDimension} dimension - The dimension parameter.
 * @returns {boolean} - Returns the result.
 */
function isNumericDimension(dimension: ChartExDimension): dimension is ChartExNumericDimension {
    return (
        dimension.type === 'val' ||
        dimension.type === 'x' ||
        dimension.type === 'y' ||
        dimension.type === 'size' ||
        dimension.type === 'colorVal'
    );
}

/**
 * serializeStringLevel function.
 *
 * @param {ChartExStringLevel} level - The level parameter.
 * @returns {string} - Returns the result.
 */
function serializeStringLevel(level: ChartExStringLevel): string {
    const name: string = level.name === undefined ? '' : ` name="${escapeXml(level.name)}"`;
    const points: string = level.points
        .map((point: ChartExStringPoint): string => `<cx:pt idx="${point.index}">${escapeXml(point.value)}</cx:pt>`)
        .join('');
    return `<cx:lvl ptCount="${level.points.length}"${name}>${points}</cx:lvl>`;
}

/**
 * serializeNumericLevel function.
 *
 * @param {ChartExNumericLevel} level - The level parameter.
 * @returns {string} - Returns the result.
 */
function serializeNumericLevel(level: ChartExNumericLevel): string {
    const name: string = level.name === undefined ? '' : ` name="${escapeXml(level.name)}"`;
    const formatCode: string = level.formatCode === undefined ? '' : ` formatCode="${escapeXml(level.formatCode)}"`;
    const points: string = level.points
        .map((point: ChartExNumericPoint): string => `<cx:pt idx="${point.index}">${point.value}</cx:pt>`)
        .join('');
    return `<cx:lvl ptCount="${level.points.length}"${formatCode}${name}>${points}</cx:lvl>`;
}
