/**
 * Default resource limits for untrusted packages and XML.
 * Values are from `.agent/policies/security.md`.
 */
/**
 * ZIP and XML resource limits applied on load.
 *
 * Required on the public surface under `stripInternal` because
 * {@link DEFAULT_RESOURCE_LIMITS} and {@link ResourceLimitOverrides} reference
 * this type.
 *
 * @private
 */
export interface ResourceLimits {
    /** Total uncompressed bytes across ZIP entries. Default 512 MiB. */
    readonly totalUncompressedSize: number;
    /** Max inflate ratio per entry. Default 200. */
    readonly compressionRatio: number;
    /** Max ZIP entries. Default 10_000. */
    readonly entryCount: number;
    /** Max uncompressed size of one part. Default 128 MiB. */
    readonly singlePartUncompressedSize: number;
    /** Max XML element nesting. Default 256. */
    readonly xmlNestingDepth: number;
    /** Max attributes per element. Default 4096. */
    readonly xmlAttributeCount: number;
    /** Max `w:t` / text node length. Default 32 MiB. */
    readonly textNodeLength: number;
    /** Max relationships in one relationships part. Default 10_000. */
    readonly relationshipCountPerPart: number;
}
/** @public */
export const DEFAULT_RESOURCE_LIMITS: ResourceLimits = {
    totalUncompressedSize: 512 * 1024 * 1024,
    compressionRatio: 200,
    entryCount: 10000,
    singlePartUncompressedSize: 128 * 1024 * 1024,
    xmlNestingDepth: 256,
    xmlAttributeCount: 4096,
    textNodeLength: 32 * 1024 * 1024,
    relationshipCountPerPart: 10000
};
/**
 * Partial override of {@link ResourceLimits}. Unspecified fields keep the defaults.
 *
 * @public
 */
export type ResourceLimitOverrides = Partial<ResourceLimits>;
export function resolveResourceLimits(overrides?: ResourceLimitOverrides): ResourceLimits {
    if (overrides === undefined) {
        return DEFAULT_RESOURCE_LIMITS;
    }
    return {
        totalUncompressedSize:
            overrides.totalUncompressedSize != null ? overrides.totalUncompressedSize : DEFAULT_RESOURCE_LIMITS.totalUncompressedSize,
        compressionRatio: overrides.compressionRatio != null ? overrides.compressionRatio : DEFAULT_RESOURCE_LIMITS.compressionRatio,
        entryCount: overrides.entryCount != null ? overrides.entryCount : DEFAULT_RESOURCE_LIMITS.entryCount,
        singlePartUncompressedSize:
            overrides.singlePartUncompressedSize != null
                ? overrides.singlePartUncompressedSize
                : DEFAULT_RESOURCE_LIMITS.singlePartUncompressedSize,
        xmlNestingDepth: overrides.xmlNestingDepth != null ? overrides.xmlNestingDepth : DEFAULT_RESOURCE_LIMITS.xmlNestingDepth,
        xmlAttributeCount: overrides.xmlAttributeCount != null ? overrides.xmlAttributeCount : DEFAULT_RESOURCE_LIMITS.xmlAttributeCount,
        textNodeLength: overrides.textNodeLength != null ? overrides.textNodeLength : DEFAULT_RESOURCE_LIMITS.textNodeLength,
        relationshipCountPerPart:
            overrides.relationshipCountPerPart != null
                ? overrides.relationshipCountPerPart
                : DEFAULT_RESOURCE_LIMITS.relationshipCountPerPart
    };
}
