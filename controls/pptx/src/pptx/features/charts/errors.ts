/**
 * Typed errors for the optional charts module.
 *
 * @remarks
 * Package/XML malformation and ZIP limit breaches continue to use core
 * {@link Error}, {@link Error},
 * {@link Error}, and XML limit types. This type covers
 * host-side chart-bridge failures (incomplete hook binding, missing embedding
 * when a later task opens one, refused deep-import policy notes, etc.).
 *
 * Citation: ADR `docs/adr/2026-09-18-chart-edit.md`; TASK-1066.
 */
/**
 * Builds ChartsError options without passing explicit `undefined`
 * (`exactOptionalPropertyTypes`).
 *
 * @param {string | undefined} partName - Absolute package part URI when known.
 * @returns {object} Options object, empty when part name is absent.
 */
export function partNameOptions(partName: string | undefined): {
    readonly partName?: string;
} {
    return partName === undefined || partName.length === 0 ? {} : { partName };
}
/**
 * Host charts-domain failure (incomplete binding, policy refusal, …).
 *
 * @remarks
 * Exported from `@syncfusion/ej2-pptx/charts` so callers can discriminate
 * chart bridge failures (`instanceof ChartsError`) from core package/security
 * errors.
 *
 * @public
 */
export class ChartsError extends Error {
    /** Absolute package part URI when known (source slide or missing target). */
    readonly partName: string | undefined;
    /**
     * @param {string} message - Human-readable description (no secrets).
     * @param {object} options - Optional part name for diagnostics.
     * @param {*} options.partName - The options.partName value.
     */
    constructor(message: string, options: {
        readonly partName?: string;
    } = {}) {
        super(message);
        this.name = 'ChartsError';
        this.partName = options.partName;
    }
}
