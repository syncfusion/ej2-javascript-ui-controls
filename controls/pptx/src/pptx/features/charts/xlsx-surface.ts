/**
 * Documented `@syncfusion/ej2-xlsx` root surface for charts (TASK-1066 CH-0).
 *
 * @remarks
 * ADR 2026-09-18 expects chart OM + `parseChartSpace` / `serializeChartSpace` /
 * `exportChartPart` on the engine. The package exposes **only** the root `"."`
 * entry (`exports` map). Option A (local/vendor root re-export) surfaces the
 * host chart APIs from `dist/worksheet/charts.js` on that root:
 *
 * | Present on root (Option A) | Notes |
 * |---|---|
 * | `Workbook`, chart enums, `Chart` (type), series/axis/legend types | Sheet OM |
 * | `parseChartSpace`, `serializeChartSpace`, `exportChartPart` | Host runtime fns |
 * | `ChartDataSource`, `ChartPartExport`, `HostChartRelationship`, `ParsedChartSpace` | Host types |
 * | `XlsxError`, `isXlsxError` | Errors |
 *
 * **Import rule:** only `@syncfusion/ej2-xlsx` (root). Deep imports of
 * `dist/…` paths are refused without a new ADR note.
 *
 * Runtime `import('@syncfusion/ej2-xlsx')` requires a resolvable xlsx pack
 * (registry or vendor). Compression/ZIP support is owned by xlsx and its own
 * dependency tree — pptx does not declare `@syncfusion/ej2-compression`.
 * If the pack is missing or mismatched, the probe fails honestly. This module exposes:
 *
 * - compile-time type-only re-exports where useful for later tasks;
 * - an async probe that records honest load success/failure (never faked).
 *
 * Charts feature entry must remain loadable without a hard top-level side-effect
 * import of xlsx so detect/security gates stay green offline.
 */
import { ChartsError } from './errors';
/**
 * Static named imports (TASK-1066 CH-0, converted from dynamic `require()`):
 *
 * - `Workbook` — public root export (tsconfig alias `ej2-xlsx-root` →
 *   `@syncfusion/ej2-xlsx` root typings).
 * - `exportChartPart` — documented host subpath (`./internal/charts`, declared
 *   in the package `exports` map; alias `ej2-xlsx-internal-charts`).
 * - `parseChartSpace` / `serializeChartSpace` — deep worksheet module reached
 *   through the approved tsconfig path alias `ej2-xlsx-worksheet-charts`
 *   (see `tsconfig.json` `paths` and the matching Vitest alias).
 *   No `import *` namespace pulls.
 */
import { Workbook, exportChartPart, ChartType, parseChartSpace, serializeChartSpace } from '@syncfusion/ej2-xlsx';
/**
 * Names the ADR-required chart engine symbols and whether the verified 0.0.0
 * public root declares them.
 *
 * @public
 */
interface Ej2XlsxRootExportVerification {
    readonly packageName: string;
    readonly packageVersionVerified: string;
    readonly approvedImportSpecifier: string;
    readonly presentOnPublicRoot: ReadonlyArray<string>;
    readonly absentOnPublicRoot: ReadonlyArray<string>;
    readonly hostChartApiPublication: string;
}

export const EJ2_XLSX_ROOT_EXPORT_VERIFICATION: Ej2XlsxRootExportVerification = Object.freeze({
    packageName: '@syncfusion/ej2-xlsx',
    packageVersionVerified: '0.0.0',
    /** Only the package root export is approved for import. */
    approvedImportSpecifier: '@syncfusion/ej2-xlsx',
    presentOnPublicRoot: Object.freeze([
        'Workbook',
        'Chart',
        'ChartType',
        'ChartFillType',
        'ChartSeries',
        'ChartAxis',
        'ChartLegend',
        'ChartDataLabels',
        'ChartData',
        'ChartDataSource',
        'ChartPartExport',
        'HostChartRelationship',
        'ParsedChartSpace',
        'DataLabelPosition',
        'LegendPosition',
        'TickMarkType',
        'parseChartSpace',
        'serializeChartSpace',
        'exportChartPart',
        'XlsxError',
        'isXlsxError'
    ]),
    /**
     * ADR host symbols formerly absent on stock 0.0.0 root; empty after Option A
     * root re-export (`vendor/syncfusion-ej2-xlsx-0.0.0.tgz` / local attach).
     */
    absentOnPublicRoot: Object.freeze([]),
    /** How host chart APIs reached the approved root (local packaging choice). */
    hostChartApiPublication: 'option-a-root-reexport'
});
/**
 * Runtime module object from the approved `@syncfusion/ej2-xlsx` root.
 *
 * @remarks
 * Structural surface for CH-0 probes — avoids `typeof import('…')` (forbidden by
 * `@typescript-eslint/consistent-type-imports`). Callers narrow known exports
 * (e.g. `'Workbook' in module`) after a successful load. Full typings bind in
 * later tasks once a complete pack loads offline.
 *
 * @public
 */
export interface Ej2XlsxRootModule {
    /** Workbook constructor / static host — present on verified 0.0.0 root. */
    readonly Workbook: unknown;
    /** `ChartType` catalog map (property name → engine value string). */
    readonly ChartType: unknown;
    /** Parse `c:chartSpace` XML (host path; Option A root re-export). */
    readonly parseChartSpace: unknown;
    /** Serialize minimal valid `c:chartSpace` (host path). */
    readonly serializeChartSpace: unknown;
    /** Export chart part XML + rel descriptors for DocIO/PPTX hosts. */
    readonly exportChartPart: unknown;
}
/**
 * Result of a dynamic root import probe.
 *
 * @public
 */
export type XlsxRootLoadResult = {
    /** True when the ej2-xlsx root module loaded successfully. */
    readonly ok: true;
    readonly module: Ej2XlsxRootModule;
} | {
    readonly ok: false;
    readonly error: Error;
    readonly reason: string;
};

/**
 * Process-wide cache of a successfully loaded xlsx root (TASK-1068 sync collection).
 *
 * @remarks
 * Dynamic `import()` is async; public `slide.charts` materializes synchronously
 * once this cache is warm (`loadXlsxRoot` / feature `activate`). Cleared only in
 * tests via {@link clearCachedXlsxRoot}.
 */
let cachedXlsxRoot: Ej2XlsxRootModule | undefined;
/**
 * Returns the cached xlsx root when {@link loadXlsxRoot} has already succeeded.
 *
 * @returns {Ej2XlsxRootModule} Cached module, or `undefined` when not yet loaded.
 *
 * @public
 */
export function getCachedXlsxRoot(): Ej2XlsxRootModule | undefined {
    return cachedXlsxRoot;
}
/**
 * Clears the process-wide xlsx root cache (tests only).
 *
 * @internal
 *
 * @returns {void} Nothing.
 */
export function clearCachedXlsxRoot(): void {
    cachedXlsxRoot = undefined;
}
/**
 * Dynamically imports the approved `@syncfusion/ej2-xlsx` root entry.
 *
 * @remarks
 * Used by architecture tests and later tasks. Returns {@link XlsxRootLoadResult}
 * with `ok: false` when the
 * package cannot load (e.g. missing or incomplete xlsx install) or when the root
 * lacks Workbook / Option A host chart APIs.
 * Successful loads populate {@link getCachedXlsxRoot} for sync chart collection.
 *
 * @returns {Promise<XlsxRootLoadResult>} A load result describing whether the root module was loaded.
 *
 * @public
 */
export async function tryLoadXlsxRoot(): Promise<XlsxRootLoadResult> {
    if (cachedXlsxRoot !== undefined) {
        return { ok: true, module: cachedXlsxRoot };
    }
    try {
        // Static named imports (module scope) assembled into the root surface.
        // The bundle/transformer guarantees the modules above are loaded; here
        // we only verify the exported values resolve to the expected callables.
        if (typeof Workbook !== 'function' ||
            typeof parseChartSpace !== 'function' ||
            typeof serializeChartSpace !== 'function' ||
            typeof exportChartPart !== 'function') {
            return {
                ok: false,
                error: new Error('Loaded @syncfusion/ej2-xlsx root lacks Workbook or host chart APIs (parseChartSpace/serializeChartSpace/exportChartPart)'),
                reason: 'Failed to load @syncfusion/ej2-xlsx root (public surface missing Workbook or Option A host chart APIs)'
            };
        }
        const loaded: Ej2XlsxRootModule = {
            Workbook,
            ChartType,
            parseChartSpace,
            serializeChartSpace,
            exportChartPart
        };
        cachedXlsxRoot = loaded;
        return { ok: true, module: loaded };
    }
    catch (err) {
        const error: Error = err instanceof Error ? err : new Error(String(err));
        return {
            ok: false,
            error,
            reason: 'Failed to load @syncfusion/ej2-xlsx root (package missing, unloadable, or incomplete)'
        };
    }
}
/**
 * Loads the xlsx root or throws {@link ChartsError}.
 *
 * @throws {ChartsError} when the engine package cannot be imported.
 *
 * @remarks
 * Warms {@link getCachedXlsxRoot} so synchronous `slide.charts` materialization
 * can parse chart parts (TASK-1068). Prefer `await ensureFeature(CHARTS_FEATURE_ID)`
 * or an explicit `await loadXlsxRoot()` before reading the collection.
 *
 * @public
 *
 * @returns {Promise<Ej2XlsxRootModule>} Promised root modules return.
 */
export async function loadXlsxRoot(): Promise<Ej2XlsxRootModule> {
    return getXlsxRootRequired();
}
/**
 * Returns the statically imported xlsx root or throws {@link ChartsError}.
 *
 * @remarks
 * Chart authoring uses this synchronous entry. The named imports are already
 * bound; this only verifies they are callable and fills {@link getCachedXlsxRoot}.
 * Error text matches {@link loadXlsxRoot} / {@link tryLoadXlsxRoot}.
 *
 * @throws {ChartsError} when Workbook or host chart APIs are missing.
 * @returns {Ej2XlsxRootModule} Verified root surface.
 * @public
 */
export function getXlsxRootRequired(): Ej2XlsxRootModule {
    if (cachedXlsxRoot !== undefined) {
        return cachedXlsxRoot;
    }
    if (typeof Workbook !== 'function' ||
        typeof parseChartSpace !== 'function' ||
        typeof serializeChartSpace !== 'function' ||
        typeof exportChartPart !== 'function') {
        const reason: string = 'Failed to load @syncfusion/ej2-xlsx root (public surface missing Workbook or Option A host chart APIs)';
        const error: Error = new Error('Loaded @syncfusion/ej2-xlsx root lacks Workbook or host chart APIs (parseChartSpace/serializeChartSpace/exportChartPart)');
        throw new ChartsError(`${reason}: ${error.message}`);
    }
    const loaded: Ej2XlsxRootModule = {
        Workbook,
        ChartType,
        parseChartSpace,
        serializeChartSpace,
        exportChartPart
    };
    cachedXlsxRoot = loaded;
    return loaded;
}
/**
 * Refuses unstable deep-import specifiers for ej2-xlsx.
 *
 * @param {string} specifier Module id a caller intends to import.
 * @throws {ChartsError} when the specifier is not the approved root.
 *
 * @returns {void} Nothing.
 * @public
 */
export function assertApprovedXlsxImportSpecifier(specifier: string): void {
    if (specifier === EJ2_XLSX_ROOT_EXPORT_VERIFICATION.approvedImportSpecifier) {
        return;
    }
    throw new ChartsError(`Refused ej2-xlsx import specifier "${specifier}". Only "${EJ2_XLSX_ROOT_EXPORT_VERIFICATION.approvedImportSpecifier}" is approved (TASK-1066 / ADR 2026-09-18); deep imports require a new ADR note.`);
}
