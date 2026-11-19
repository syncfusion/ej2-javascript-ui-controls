/** Exact known Office namespace/type aliases for read selection, never serialization. */
const TRANS_OFFICE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/';
const STRICT_OFFICE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/';
/**
 * @param {string} owner - Actual source-owner namespace.
 * @param {string} expected - Existing reader's namespace token.
 * @returns {string} Expected namespace in the source owner's known dialect.
 * @internal
 */
export function ownerNamespace(owner: string, expected: string): string {
    if (owner !== 'http://purl.oclc.org/ooxml/presentationml/main' &&
        owner !== 'http://purl.oclc.org/ooxml/drawingml/main' &&
        owner !== 'http://purl.oclc.org/ooxml/drawingml/chart') { return expected; }
    switch (expected) {
    case 'http://schemas.openxmlformats.org/presentationml/2006/main':
        return 'http://purl.oclc.org/ooxml/presentationml/main';
    case 'http://schemas.openxmlformats.org/drawingml/2006/main':
        return 'http://purl.oclc.org/ooxml/drawingml/main';
    case 'http://schemas.openxmlformats.org/officeDocument/2006/relationships':
        return 'http://purl.oclc.org/ooxml/officeDocument/relationships';
    default: return expected;
    }
}
/**
 * @param {string} actual - Source root namespace, retained unchanged.
 * @param {string} expected - Known Transitional root namespace.
 * @returns {boolean} Whether this is that exact known Office root dialect.
 * @internal
 */
export function officeRootNamespace(actual: string, expected: string): boolean {
    return actual === expected || (actual === 'http://purl.oclc.org/ooxml/presentationml/main' ||
        actual === 'http://purl.oclc.org/ooxml/drawingml/main') && actual === ownerNamespace(actual, expected);
}
/**
 * @param {string} actual - Unchanged relationship Type URI.
 * @param {string} expected - Controlled Office relationship constant.
 * @returns {boolean} Exact URI or its known Strict equivalent; no local-name matching.
 * @internal
 */
export function officeRelationshipType(actual: string, expected: string): boolean {
    return actual === expected || expected.indexOf(TRANS_OFFICE) === 0 &&
        actual === STRICT_OFFICE + expected.slice(TRANS_OFFICE.length);
}
