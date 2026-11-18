/**
 * Default ZIP/OPC safety ceilings for Phase 1 full-memory load.
 *
 * Recorded assumptions for TASK-1102 / `docs/specs/opc-package.md` open questions.
 * Tunable via {@link ZipReadOptions}.
 */

/** Maximum number of ZIP file entries (central directory records). */
export const DEFAULT_MAX_ENTRY_COUNT: 64000 = 64_000;

/** Maximum total uncompressed payload bytes across all entries. */
export const DEFAULT_MAX_UNCOMPRESSED_BYTES: number = 512 * 1024 * 1024;

/** Maximum uncompressed size of a single entry. */
export const DEFAULT_MAX_ENTRY_UNCOMPRESSED_BYTES: number = 256 * 1024 * 1024;

/** Maximum compressed size of a single entry (guards truncated bombs). */
export const DEFAULT_MAX_ENTRY_COMPRESSED_BYTES: number = 256 * 1024 * 1024;

/**
 * Options controlling ZIP read guards.
 */
export interface ZipReadOptions {
    readonly maxEntryCount?: number;
    readonly maxUncompressedBytes?: number;
    readonly maxEntryUncompressedBytes?: number;
    readonly maxEntryCompressedBytes?: number;
}

/**
 * Resolved limits with defaults applied.
 */
export interface ResolvedZipLimits {
    readonly maxEntryCount: number;
    readonly maxUncompressedBytes: number;
    readonly maxEntryUncompressedBytes: number;
    readonly maxEntryCompressedBytes: number;
}

/**
 * Apply defaults to optional read limits.
 *
 * @param {ZipReadOptions} options - The options parameter.
 * @returns {ResolvedZipLimits} - Returns the result.
 */
export function resolveZipLimits(options?: ZipReadOptions): ResolvedZipLimits {
    return {
        maxEntryCount: ((__t: number): number => (__t != null ? __t : DEFAULT_MAX_ENTRY_COUNT))(
            options == null ? undefined : options.maxEntryCount
        ),
        maxUncompressedBytes: ((__t: number): number => (__t != null ? __t : DEFAULT_MAX_UNCOMPRESSED_BYTES))(
            options == null ? undefined : options.maxUncompressedBytes
        ),
        maxEntryUncompressedBytes: ((__t: number): number => (__t != null ? __t : DEFAULT_MAX_ENTRY_UNCOMPRESSED_BYTES))(
            options == null ? undefined : options.maxEntryUncompressedBytes
        ),
        maxEntryCompressedBytes: ((__t: number): number => (__t != null ? __t : DEFAULT_MAX_ENTRY_COMPRESSED_BYTES))(
            options == null ? undefined : options.maxEntryCompressedBytes
        )
    };
}
