/**
 * Typed errors for the optional tables module.
 *
 * @remarks
 * Package/XML malformation and ZIP limit breaches continue to use core
 * {@link Error}, {@link Error}, and XML limit types.
 * This type covers tables-domain option validation and structural fail-closed
 * refusals (TASK-1080 / TASK-1082).
 *
 * Citation: ADR `docs/adr/2026-09-22-table-create-structural.md`; req/spec **038**.
 */
/**
 * Builds TablesError options without passing explicit `undefined`
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
 * Tables-domain failure (invalid create/structural options, merge fail-closed, …).
 *
 * @remarks
 * Exported from `@syncfusion/ej2-pptx/tables` so callers can discriminate
 * table failures (`instanceof TablesError`) from core package/security errors.
 *
 * @public
 */
export class TablesError extends Error {
    /** Absolute package part URI when known (source slide). */
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
        this.name = 'TablesError';
        this.partName = options.partName;
    }
}
