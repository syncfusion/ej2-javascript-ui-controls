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
import { PMDOMParser, PMNode, PMSchema } from '../../../pm/pm-guard';
import { DocumentMapper } from '../../../pm/adapters/document-mapper';

/**
 * Parses an HTML string into a `DocumentRoot` using the schema-driven pipeline.
 *
 * @param {string} html - The HTML markup to parse.
 * @param {PMSchema} pmSchema - The PM schema compiled from registered extensions.
 * @returns {DocumentRoot} The parsed document tree.
 *
 * @hidden
 */
export function parseHtmlToDocument(html: string, pmSchema: PMSchema): DocumentRoot {
    const htmlDOM: Element = new window.DOMParser()
        .parseFromString(html, 'text/html')
        .body;

    const pmParser: PMDOMParser = PMDOMParser.fromSchema(pmSchema);
    const pmDoc: PMNode = pmParser.parse(htmlDOM);

    return DocumentMapper.fromPMDoc(pmDoc);
}
