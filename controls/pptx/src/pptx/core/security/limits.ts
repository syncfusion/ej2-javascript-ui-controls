/**
 * Numeric guards applied while opening and walking untrusted PPTX packages.
 *
 * @remarks
 * Defaults match `.agent/policies/security.md`. Callers may supply a partial override
 * through {@link resolveLimits}; library defaults are never mutated in place.
 * Exceeding a limit must raise a typed error — never silent truncation.
 */
export interface SecurityLimits {
    /** Maximum sum of uncompressed part bytes across the package. */
    readonly totalUncompressedBytes: number;
    /** Maximum allowed inflated-to-deflated size ratio for a single ZIP entry. */
    readonly compressionRatio: number;
    /** Maximum number of package parts (ZIP entries). */
    readonly entryCount: number;
    /** Maximum uncompressed size of any single part. */
    readonly singlePartUncompressedBytes: number;
    /** Maximum element nesting depth during XML parse. */
    readonly xmlNestingDepth: number;
    /** Maximum attribute count on a single XML element. */
    readonly xmlAttributesPerElement: number;
    /** Maximum length in bytes of a single XML text node. */
    readonly textNodeLengthBytes: number;
    /** Maximum relationship entries in one `.rels` part. */
    readonly relationshipsPerPart: number;
    /** Maximum slide count in the presentation. */
    readonly slideCount: number;
    /** Maximum shapes on a single slide (including nested group children). */
    readonly shapesPerSlide: number;
    /** Maximum group-shape nesting depth. */
    readonly groupNestingDepth: number;
    /** Maximum total size of embedded media parts. */
    readonly totalEmbeddedMediaBytes: number;
    /** Maximum nodes walked in an animation timing tree. */
    readonly animationTimingNodeCount: number;
}
const ONE_KIB: number = 1024;
const ONE_MIB: number = ONE_KIB * 1024;
const ONE_GIB: number = ONE_MIB * 1024;
/**
 * Normative default security limits from `.agent/policies/security.md`.
 *
 * @remarks
 * The object is frozen. Do not loosen these values in a minor release without an ADR
 * and human approval (`.agent/policies/autonomy.md`).
 *
 * @defaultValue See property values; sourced from the security policy table.
 */
export const DEFAULT_SECURITY_LIMITS: SecurityLimits = Object.freeze({
    totalUncompressedBytes: 1 * ONE_GIB,
    compressionRatio: 200,
    entryCount: 10000,
    singlePartUncompressedBytes: 256 * ONE_MIB,
    xmlNestingDepth: 256,
    xmlAttributesPerElement: 4096,
    textNodeLengthBytes: 32 * ONE_MIB,
    relationshipsPerPart: 10000,
    slideCount: 5000,
    shapesPerSlide: 10000,
    groupNestingDepth: 64,
    totalEmbeddedMediaBytes: 512 * ONE_MIB,
    animationTimingNodeCount: 100000
});
/**
 * Builds an effective {@link SecurityLimits} object from optional caller overrides.
 *
 * @example ```ts const limits = resolveLimits({ entryCount: 100, slideCount: 50 }); ```
 * @param {*} overrides - Partial limits to replace matching default fields. Omitted keys
 * @returns {SecurityLimits} A new frozen {@link SecurityLimits} instance.
 */
export function resolveLimits(overrides?: Partial<SecurityLimits>): SecurityLimits {
    if (overrides === undefined) {
        return Object.freeze({ ...DEFAULT_SECURITY_LIMITS });
    }
    const resolved: SecurityLimits = {
        totalUncompressedBytes: (overrides.totalUncompressedBytes !== null && overrides.totalUncompressedBytes !== undefined
            ? overrides.totalUncompressedBytes
            : DEFAULT_SECURITY_LIMITS.totalUncompressedBytes),
        compressionRatio: (overrides.compressionRatio !== null && overrides.compressionRatio !== undefined
            ? overrides.compressionRatio
            : DEFAULT_SECURITY_LIMITS.compressionRatio),
        entryCount: (overrides.entryCount !== null && overrides.entryCount !== undefined
            ? overrides.entryCount
            : DEFAULT_SECURITY_LIMITS.entryCount),
        singlePartUncompressedBytes: (overrides.singlePartUncompressedBytes !== null && overrides.singlePartUncompressedBytes !== undefined
            ? overrides.singlePartUncompressedBytes
            : DEFAULT_SECURITY_LIMITS.singlePartUncompressedBytes),
        xmlNestingDepth: (overrides.xmlNestingDepth !== null && overrides.xmlNestingDepth !== undefined
            ? overrides.xmlNestingDepth
            : DEFAULT_SECURITY_LIMITS.xmlNestingDepth),
        xmlAttributesPerElement: (overrides.xmlAttributesPerElement !== null && overrides.xmlAttributesPerElement !== undefined
            ? overrides.xmlAttributesPerElement
            : DEFAULT_SECURITY_LIMITS.xmlAttributesPerElement),
        textNodeLengthBytes: (overrides.textNodeLengthBytes !== null && overrides.textNodeLengthBytes !== undefined
            ? overrides.textNodeLengthBytes
            : DEFAULT_SECURITY_LIMITS.textNodeLengthBytes),
        relationshipsPerPart: (overrides.relationshipsPerPart !== null && overrides.relationshipsPerPart !== undefined
            ? overrides.relationshipsPerPart
            : DEFAULT_SECURITY_LIMITS.relationshipsPerPart),
        slideCount: (overrides.slideCount !== null && overrides.slideCount !== undefined
            ? overrides.slideCount
            : DEFAULT_SECURITY_LIMITS.slideCount),
        shapesPerSlide: (overrides.shapesPerSlide !== null && overrides.shapesPerSlide !== undefined
            ? overrides.shapesPerSlide
            : DEFAULT_SECURITY_LIMITS.shapesPerSlide),
        groupNestingDepth: (overrides.groupNestingDepth !== null && overrides.groupNestingDepth !== undefined
            ? overrides.groupNestingDepth
            : DEFAULT_SECURITY_LIMITS.groupNestingDepth),
        totalEmbeddedMediaBytes: (overrides.totalEmbeddedMediaBytes !== null && overrides.totalEmbeddedMediaBytes !== undefined
            ? overrides.totalEmbeddedMediaBytes
            : DEFAULT_SECURITY_LIMITS.totalEmbeddedMediaBytes),
        animationTimingNodeCount: (overrides.animationTimingNodeCount !== null && overrides.animationTimingNodeCount !== undefined
            ? overrides.animationTimingNodeCount
            : DEFAULT_SECURITY_LIMITS.animationTimingNodeCount)
    };
    return Object.freeze(resolved);
}
