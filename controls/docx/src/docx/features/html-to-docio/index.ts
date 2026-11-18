/**
 * @private
 */

export { _HTMLToDocIOMapper } from './mapper.js';
import { _HTMLToDocIOMapper } from './mapper.js';
import { _ImageMapper } from './image-mapper.js';
import { _HTMLParser } from '../html-parser/parser.js';
import { registerHtmlConverter, registerHtmlAsyncConverter, WordDocument } from '../document/document.js';

// Register the HTML → WordDocument conversion used by WordDocument.open/openSync (sync path).
// The barrel (not document.ts) performs this wiring because the mapper imports
// document types and a static import inside document.ts would create a
// load-time cycle.
registerHtmlConverter(function convertHtmlToDocument(
    html: string,
    doc: WordDocument
): void {
    const htmlDoc = new _HTMLParser(html).parse();
    const mapper = new _HTMLToDocIOMapper(htmlDoc, doc);
    try {
        mapper.mapToDocument();
    } finally {
       _ImageMapper.setResolvedImages(undefined);
    }
});

// Register the async HTML → WordDocument conversion (openAsync path).
// Resolves images inside the HTML parser (parseAsync) before conversion.
// This way, image downloading happens at parser level, not in document.ts,
// and both DOCX and PDF (or any other format) can use the same parsed tree.
registerHtmlAsyncConverter(async function convertHtmlToDocumentAsync(
    html: string,
    doc: WordDocument
): Promise<void> {
    // Supplied images (LoadOptions.images) are published by the open path via
    // _ImageMapper.setResolvedImages() before this converter runs.
    const supplied = _ImageMapper.getResolvedImages();

    // ✅ New: Parse HTML with automatic image resolution
    // parseAsync() does everything at parser level:
    // - Extract <img src> URLs
    // - Download http(s) images
    // - Decode data URIs
    // - Skip URLs in supplied (images param)
    // - Store resolved bytes in element._resolvedImageBytes
    const parser = new _HTMLParser(html);
    const htmlDoc = await parser.parseAsync(supplied);

    // Now map to document with pre-resolved images
    const mapper = new _HTMLToDocIOMapper(htmlDoc, doc);
    _ImageMapper.setResolvedImages(supplied);
    try {
        mapper.mapToDocument();
    } finally {
        _ImageMapper.setResolvedImages(undefined);
    }
});

// Mapper classes and utilities are intentionally NOT exported - they are internal only
