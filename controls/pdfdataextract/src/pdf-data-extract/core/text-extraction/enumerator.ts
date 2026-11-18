/**
 * Represents the tag type
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Initialize a new instance of the `PdfDataExtractor` class
 * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
 * // Get the page from the PDF document
 * let page: PdfPage = document.getPage(0);
 * // Extract structure elements from a particular page in the PDF document
 * let pageElements: PdfStructureElement[] = extractor.getStructureElements(page);
 * // Extract the tag type of the first element
 * let element: PdfStructureElement = pageElements[0];
 * let tag: PdfTagType = element.tagType;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfTagType {
    /**
     * Specifies the type of `annotation` tag.
     */
    annotation = 0,
    /**
     * Specifies the type of `article` tag.
     */
    article = 1,
    /**
     * Specifies the type of `bibliographyEntry` tag.
     */
    bibliographyEntry = 2,
    /**
     * Specifies the type of `blockQuotation` tag.
     */
    blockQuotation = 3,
    /**
     * Specifies the type of `caption` tag.
     */
    caption = 4,
    /**
     * Specifies the type of `code` tag.
     */
    code = 5,
    /**
     * Specifies the type of `division` tag.
     */
    division = 6,
    /**
     * Specifies the type of `document` tag.
     */
    documentType = 7,
    /**
     * Specifies the type of `figure` tag.
     */
    figure = 8,
    /**
     * Specifies the type of `form` tag.
     */
    form = 9,
    /**
     * Specifies the type of `formula` tag.
     */
    formula = 10,
    /**
     * Specifies the type of `heading` tag.
     */
    heading = 11,
    /**
     * Specifies the type of `headingLevel1` tag.
     */
    headingLevel1 = 12,
    /**
     * Specifies the type of `headingLevel2` tag.
     */
    headingLevel2 = 13,
    /**
     * Specifies the type of `headingLevel3` tag.
     */
    headingLevel3 = 14,
    /**
     * Specifies the type of `headingLevel4` tag.
     */
    headingLevel4 = 15,
    /**
     * Specifies the type of `headingLevel5` tag.
     */
    headingLevel5 = 16,
    /**
     * Specifies the type of `headingLevel6` tag.
     */
    headingLevel6 = 17,
    /**
     * Specifies the type of `index` tag.
     */
    index = 18,
    /**
     * Specifies the type of `label` tag.
     */
    label = 19,
    /**
     * Specifies the type of `link` tag.
     */
    link = 20,
    /**
     * Specifies the type of `list` tag.
     */
    list = 21,
    /**
     * Specifies the type of `listBody` tag.
     */
    listBody = 22,
    /**
     * Specifies the type of `listItem` tag.
     */
    listItem = 23,
    /**
     * Specifies the type of `note` tag.
     */
    note = 24,
    /**
     * Specifies the type of `paragraph` tag.
     */
    paragraph = 25,
    /**
     * Specifies the type of `part` tag.
     */
    part = 26,
    /**
     * Specifies the type of `private` tag.
     */
    privateType = 27,
    /**
     * Specifies the type of `quotation` tag.
     */
    quotation = 28,
    /**
     * Specifies the type of `reference` tag.
     */
    reference = 29,
    /**
     * Specifies the type of `ruby` tag.
     */
    ruby = 30,
    /**
     * Specifies the type of `section` tag.
     */
    section = 31,
    /**
     * Specifies the type of `span` tag.
     */
    span = 32,
    /**
     * Specifies the type of `table` tag.
     */
    table = 33,
    /**
     * Specifies the type of `tableBodyRowGroup` tag.
     */
    tableBodyRowGroup = 34,
    /**
     * Specifies the type of `tableDataCell` tag.
     */
    tableDataCell = 35,
    /**
     * Specifies the type of `tableFooterRowGroup` tag.
     */
    tableFooterRowGroup = 36,
    /**
     * Specifies the type of `tableHeader` tag.
     */
    tableHeader = 37,
    /**
     * Specifies the type of `tableHeaderRowGroup` tag.
     */
    tableHeaderRowGroup = 38,
    /**
     * Specifies the type of `tableOfContent` tag.
     */
    tableOfContent = 39,
    /**
     * Specifies the type of `tableOfContentItem` tag.
     */
    tableOfContentItem = 40,
    /**
     * Specifies the type of `tableRow` tag.
     */
    tableRow = 41,
    /**
     * Specifies the type of `warichu` tag.
     */
    warichu = 42,
    /**
     * Specifies the type of `none` tag.
     */
    none = 43
}
/**
 * Represents the scope type of tag.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Initialize a new instance of the `PdfDataExtractor` class
 * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
 * // Get the page from the PDF document
 * let page: PdfPage = document.getPage(0);
 * // Extract structure elements from a particular page in the PDF document
 * let pageElements: PdfStructureElement[] = extractor.getStructureElements(page);
 * // Extract the scope type of the first element
 * let element: PdfStructureElement = pageElements[0];
 * let scope: ScopeType = element.scope;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum ScopeType {
    /**
     * Specifies `row` type of scope.
     */
    row = 0,
    /**
     * Specifies `column` type of scope.
     */
    column = 1,
    /**
     * Specifies `both` scope, meaning row and column types of scope are specified.
     */
    both = 2,
    /**
     * Specifies `none` scope, meaning no scope type is specified.
     */
    none = 3
}
