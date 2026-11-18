/**
 * Nested XLSX package security for chart embedding paths (TASK-1066 CH-0).
 *
 * @remarks
 * Embedded chart workbooks are full OPC packages inside the PPTX. Spec 037
 * ADR 2026-09-18 require size, part-count, inflate-ratio, and path-safety
 * limits on nested packages when opened for edit. Core never opens nested
 * XLSX on plain presentation open; only charts-feature paths may.
 *
 * This module enforces **PPT-side** fail-closed limits by reusing
 * {@link readZipEntries} + {@link resolveLimits} **before** any later
 * `Workbook.open` call. It does not fetch network content, execute VBA/OLE,
 * or evaluate spreadsheet formulas.
 *
 * Path traversal is rejected inside `readZipEntries` via
 * {@link zipEntryToPartName}. OLE compound-file / CFB nested packages raise
 * {@link Error} (fail closed — nested encrypt not supported
 * on chart edit paths in this phase).
 *
 * Citations: `.agent/policies/security.md`; `docs/specs/037-chart-edit.md`
 * security; ADR `docs/adr/2026-09-18-chart-edit.md`.
 */
import { readZipEntries, readZipEntriesSync } from '../../core/package/zip-reader';
import { EncryptedPackageError, InvalidPackageError, PackageLimitError, resolveLimits, SecurityLimits } from '../../core/security/index';
import { ChartsError, partNameOptions } from './errors';
/**
 * Result of a successful nested-package limit check.
 *
 * @remarks
 * Entries are absolute OPC part names → uncompressed bytes, same contract as
 * core zip reading. Callers that later open a workbook must still treat this
 * as a security pre-check only — xlsx `Workbook.open` does not accept limits
 * in the 0.0.0 surface verified under TASK-1066.
 *
 * @public
 */
export interface NestedPackageOpenResult {
    /** Uncompressed parts from the nested ZIP (directories omitted). */
    readonly parts: ReadonlyMap<string, Uint8Array>;
    /** Effective limits used for the check (frozen). */
    readonly limits: SecurityLimits;
}
/**
 * Validates nested package bytes under security limits without network I/O.
 *
 * @throws {Error} when entry count, sizes, or ratio exceed limits.
 * @throws {Error} for OLE CFB / encrypted nested packages.
 * @throws {Error} for malformed ZIP or path-unsafe entry names.
 * @throws {Error} when `data` is empty.
 * @public
 * @param {Uint8Array | ArrayBuffer} data - Raw embedding bytes (expected ZIP/XLSX; CFB rejected).
 * @param {*} overrides - Optional limit overrides (never silent-weaken defaults).
 * @param {*} options - Optional partName context for errors.
 * @param {string} [options.partName] - Part name for error context.
 * @returns {*} Parsed parts map when within limits.
 */
export async function openNestedXlsxPackage(data: Uint8Array | ArrayBuffer, overrides?: Partial<SecurityLimits>, options: {
    readonly partName?: string;
} = {}): Promise<NestedPackageOpenResult> {
    const bytes: Uint8Array = data instanceof Uint8Array ? data : new Uint8Array(data);
    if (bytes.byteLength === 0) {
        throw new ChartsError('Nested chart workbook embedding is empty', partNameOptions(options.partName));
    }
    const limits: SecurityLimits = resolveLimits(overrides);
    // Fail closed through the same ZIP reader core uses for PPTX packages.
    // PackageLimitError / EncryptedPackageError / InvalidPackageError propagate.
    const parts: Map<string, Uint8Array> = await readZipEntries(bytes, limits);
    return { parts, limits };
}
/**
 * Synchronous sibling of {@link openNestedXlsxPackage}.
 *
 * @remarks Same empty-byte, limit, encryption, and path-safety checks. Uses
 * {@link readZipEntriesSync} so chart load/edit does not await inflate.
 * @internal
 * @param {Uint8Array | ArrayBuffer} data - Raw embedding bytes.
 * @param {Partial<SecurityLimits>} [overrides] - Optional limit overrides.
 * @param {{ readonly partName?: string }} [options] - Error context.
 * @returns {NestedPackageOpenResult} Parsed parts when within limits.
 */
export function openNestedXlsxPackageSync(data: Uint8Array | ArrayBuffer, overrides?: Partial<SecurityLimits>, options: {
    readonly partName?: string;
} = {}): NestedPackageOpenResult {
    const bytes: Uint8Array = data instanceof Uint8Array ? data : new Uint8Array(data);
    if (bytes.byteLength === 0) {
        throw new ChartsError('Nested chart workbook embedding is empty', partNameOptions(options.partName));
    }
    const limits: SecurityLimits = resolveLimits(overrides);
    const parts: Map<string, Uint8Array> = readZipEntriesSync(bytes, limits);
    return { parts, limits };
}
/**
 * Type guard: error is a core nested-package security failure.
 *
 * @public
 * @param {*} err - Unknown thrown value.
 * @returns {boolean} True when the error is a limit, encryption, or invalid-package failure.
 */
export function isNestedPackageSecurityError(err: unknown): boolean {
    return (err instanceof PackageLimitError ||
        err instanceof EncryptedPackageError ||
        err instanceof InvalidPackageError);
}
