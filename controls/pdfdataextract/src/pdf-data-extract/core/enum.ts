export enum _TextProcessingMode {
    textExtraction,
    textLayOut,
    redaction,
    textLineExtraction,
    imageExtraction,
}
/**
 * Public enum for PDF image format.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Initialize a new instance of the `PdfDataExtractor` class
 * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
 * // Extract collection of `PdfEmbeddedImage` from the PDF document.
 * let imageInfoCollection: PdfEmbeddedImage[] = extractor.extractImages({ startPageIndex: 0, endPageIndex: document.pageCount - 1});
 * Gets the image format.
 * let imageInfo: PdfEmbeddedImage = imageInfoCollection[0];
 * let imageFormat: ImageFormat = imageInfo.ImageFormat;
 * // Destroy the documents
 * document.destroy();
 * ```
 */
export enum ImageFormat {
    /**
     * Gets the W3C Portable Network Graphics (PNG) image format.
     */
    png,
    /**
     * Gets the Joint Photographic Experts Group (JPEG) image format.
     */
    jpeg,
    /**
     * Specifies the unknown image type.
     */
    unknown
}
