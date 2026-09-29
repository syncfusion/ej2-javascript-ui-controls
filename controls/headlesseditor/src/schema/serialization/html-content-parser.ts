/**
 * html-content-parser.ts — Shared HTML → DocumentRoot parsing pipeline.
 *
 * Single source of truth for converting an HTML string into a `DocumentRoot`
 * using a ProseMirror schema. Used by:
 *   - `EditorBuilder._parseHtmlContent` (initial `config.content` at create time)
 *   - `HeadlessEditor.setContent` (runtime full-content replacement)
 *
 * The parse leverages every `parseDOM` rule contributed by registered
 * extensions via the PM schema, then converts the resulting PM document to
 * a `DocumentRoot` through `DocumentMapper.fromPMDoc` (preserving node IDs).
 *
 * This module is an internal implementation detail and is NOT exported from
 * the public package barrel (`src/index.ts`).
 */
import { DocumentRoot } from '../../model/editor-node';
import { IdGenerator } from '../../utils/id-generator';
import { PMDOMParser, PMNode, PMSchema } from '../../pm/pm-guard';
import { DocumentMapper } from '../../pm/adapters/document-mapper';

/**
 * Parses an HTML string into a `DocumentRoot` using the schema-driven pipeline.
 *
 * Pipeline:
 *   HTML string
 *     ↓  window.DOMParser (text/html)
 *     body element
 *     ↓  PMDOMParser.fromSchema(schema) — respects all extension parseDOM rules
 *     PM document
 *     ↓  DocumentMapper.fromPMDoc — preserves node IDs
 *     DocumentRoot
 *
 * @param {string} html - The HTML markup to parse.
 * @param {PMSchema} pmSchema - The PM schema compiled from registered extensions.
 * @param {IdGenerator} idGen - Generator used when a parsed node carries no id.
 * @returns {DocumentRoot} The parsed document tree.
 *
 * @throws {Error} When the HTML cannot be parsed (malformed input, unregistered
 *                 node types, or a DOMParser failure). Callers own the fallback
 *                 policy; this helper is intentionally strict so failures are
 *                 visible at the call site.
 * @hidden
 */
export function parseHtmlToDocument(html: string, pmSchema: PMSchema, idGen: IdGenerator): DocumentRoot {
    // Step 1: Parse the HTML string into a DOM tree.
    const htmlDOM: Element = new window.DOMParser()
        .parseFromString(html, 'text/html')
        .body;

    // Step 2: Create a PM parser from the schema. This respects all parseDOM
    // rules from all registered extensions.
    const pmParser: PMDOMParser = PMDOMParser.fromSchema(pmSchema);
    const pmDoc: PMNode = pmParser.parse(htmlDOM);

    // Step 3: Convert the PM document to a DocumentRoot. This preserves node
    // IDs and structure while converting types and attributes.
    return DocumentMapper.fromPMDoc(pmDoc, idGen);
}
