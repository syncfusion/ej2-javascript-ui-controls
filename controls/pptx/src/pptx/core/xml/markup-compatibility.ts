/**
 * Markup Compatibility (ECMA-376 Part 3) helpers for the core XML DOM.
 *
 * @remarks
 * MustUnderstand is evaluated during parse while namespace bindings are live.
 * The understood-set is **conservative**: only namespaces core already processes.
 * Extension namespaces (e.g. p14, ink) are **not** understood for MustUnderstand.
 *
 * Citations: ECMA-376 Part 3 §7.4 MustUnderstand; `docs/specs/027-mc-edge-cases.md`.
 */
/** Markup Compatibility namespace URI (ECMA-376 Part 3). */
export const MC_NS: string = 'http://schemas.openxmlformats.org/markup-compatibility/2006';
const XML_NS: string = 'http://www.w3.org/XML/1998/namespace';
const XMLNS_NS: string = 'http://www.w3.org/2000/xmlns/';
/**
 * Namespaces the library implements for MustUnderstand satisfaction (Phase 5).
 *
 * @remarks
 * URIs match package / presentation / DrawingML constants; duplicated here so
 * `src/pptx/core/xml` does not import higher layers. **Not** included: MC itself as a
 * MustUnderstand target (Part 3 forbids), p14, ink, or arbitrary extension NS.
 */
export const MC_UNDERSTOOD_NAMESPACE_URIS: ReadonlySet<string> = new Set([
    // PresentationML main
    'http://schemas.openxmlformats.org/presentationml/2006/main',
    // DrawingML main (theme, text, geometry)
    'http://schemas.openxmlformats.org/drawingml/2006/main',
    // Office document relationships attribute NS (`r:id`)
    'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    // OPC content types
    'http://schemas.openxmlformats.org/package/2006/content-types',
    // OPC relationships part
    'http://schemas.openxmlformats.org/package/2006/relationships',
    // Exact Strict aliases already handled by the core dialect-aware readers.
    'http://purl.oclc.org/ooxml/presentationml/main',
    'http://purl.oclc.org/ooxml/drawingml/main',
    'http://purl.oclc.org/ooxml/officeDocument/relationships',
    // XML / XMLNS system namespaces
    XML_NS,
    XMLNS_NS
]);
/**
 * Local names of MC attributes whose values are whitespace-delimited prefix
 * (or `prefix:local` / `prefix:*` for ProcessContent / Preserve*) token lists.
 *
 * @remarks
 * Token strings are preserved verbatim when original xmlns declarations are
 * retained on the element (`namespaceDeclarations`).
 */
export const MC_PREFIX_TOKEN_ATTRIBUTES: ReadonlySet<string> = new Set([
    'Ignorable',
    'ProcessContent',
    'MustUnderstand',
    'PreserveElements',
    'PreserveAttributes'
]);
/**
 * Discriminator for {@link MarkupCompatibilityError}.
 *
 * @internal
 */
export type MarkupCompatibilityErrorCode = 'mustUnderstand' | 'unboundPrefix' | 'invalidMustUnderstand';
/**
 * Raised when Markup Compatibility MustUnderstand cannot be satisfied.
 *
 * @remarks
 * Not part of the public package surface; import only from core internals/tests.
 *
 * @internal
 */
export class MarkupCompatibilityError extends Error {
    /** Stable machine-readable code. */
    readonly code: MarkupCompatibilityErrorCode;
    /** Offending package part name when known. */
    readonly partName: string | undefined;
    /** Namespace URI that failed MustUnderstand, when resolved. */
    readonly namespaceUri: string | undefined;
    /** Prefix token that failed, when applicable. */
    readonly prefix: string | undefined;
    /**
     * @param {string} message - Human-readable description.
     * @param {*} options - Code, optional part name, namespace URI, and prefix.
     * @param {*} options.code - The options.code value.
     * @param {*} options.partName - The options.partName value.
     * @param {*} options.namespaceUri - The options.namespaceUri value.
     * @param {*} options.prefix - The options.prefix value.
     */
    constructor(message: string, options: {
        readonly code: MarkupCompatibilityErrorCode;
        readonly partName?: string;
        readonly namespaceUri?: string;
        readonly prefix?: string;
    }) {
        super(message);
        this.name = 'MarkupCompatibilityError';
        this.code = options.code;
        this.partName = options.partName;
        this.namespaceUri = options.namespaceUri;
        this.prefix = options.prefix;
    }
}
/**
 * Splits a whitespace-delimited MC attribute token list (Part 3 §7.2–7.4).
 *
 * @param {string} value - Attribute value; may have leading/trailing whitespace.
 * @returns {string[]} Non-empty tokens in document order.
 */
export function splitMcPrefixTokens(value: string): string[] {
    const trimmed: string = value.trim();
    if (trimmed.length === 0) {
        return [];
    }
    return trimmed.split(/\s+/u);
}
