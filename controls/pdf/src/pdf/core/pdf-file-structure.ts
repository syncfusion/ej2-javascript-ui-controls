import { PdfCrossReferenceType } from './enumerator';
/**
 * `PdfFileStructure` class represents the internal structure of the PDF file.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access the internal file structure of the PDF document
 * let fileStructure: PdfFileStructure = document.fileStructure;
 * // Set the cross reference type
 * fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfFileStructure {
    _crossReferenceType: PdfCrossReferenceType;
    /**
     * Gets the cross reference type of the PDF document.
     *
     * @returns {PdfCrossReferenceType} - Returns the cross reference type of the PDF document.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the internal file structure of the PDF document
     * let fileStructure: PdfFileStructure = document.fileStructure;
     * // Get the cross reference type
     * let type: PdfCrossReferenceType = fileStructure.crossReferenceType;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get crossReferenceType(): PdfCrossReferenceType {
        return this._crossReferenceType;
    }
    /**
     * Sets the cross reference type of the PDF document.
     *
     * @param {PdfCrossReferenceType} value - Specifies the cross reference type of the PDF document.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the internal file structure of the PDF document
     * let fileStructure: PdfFileStructure = document.fileStructure;
     * // Set the cross reference type
     * fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set crossReferenceType(value: PdfCrossReferenceType) {
        this._crossReferenceType = value;
    }
}
