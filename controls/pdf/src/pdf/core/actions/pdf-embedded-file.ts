/**
 * Represents binary data embedded within a PDF file specification.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * // Add a page to the document
 * let page: PdfPage = document.addPage();
 * // Create the embedded file data
 * let attachmentData: Uint8Array =
 *     new Uint8Array([72, 101, 108, 108, 111]);
 * // Create an embedded file
 * let embeddedFile: PdfEmbeddedFile =
 *     new PdfEmbeddedFile(attachmentData);
 * // Create a file specification
 * let fileSpecification: PdfFileSpecification =
 *     new PdfFileSpecification('input.txt');
 * // Assign the embedded file to the file specification
 * fileSpecification.embeddedFile = embeddedFile;
 * // Create an import-data action using the file specification
 * let action: PdfImportDataAction =
 *     new PdfImportDataAction(fileSpecification);
 * // Create a button field
 * let field: PdfButtonField =
 *     new PdfButtonField(
 *         page,
 *         'ImportData',
 *         { x: 20, y: 20, width: 120, height: 30 }
 *     );
 * // Assign the action to the button field
 * field.actions.mouseUp = action;
 * // Add the button field to the document
 * document.form.add(field);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfEmbeddedFile {
    /**
     * Stores the binary data of the embedded file.
     *
     * @private
     */
    private _data: Uint8Array;
    /**
     * Initializes a new instance of the `PdfEmbeddedFile` class with the specified binary data.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Create the embedded file data
     * let attachmentData: Uint8Array =
     *     new Uint8Array([72, 101, 108, 108, 111]);
     * // Create an embedded file
     * let embeddedFile: PdfEmbeddedFile =
     *     new PdfEmbeddedFile(attachmentData);
     * // Create a file specification
     * let fileSpecification: PdfFileSpecification =
     *     new PdfFileSpecification('input.txt');
     * // Assign the embedded file to the file specification
     * fileSpecification.embeddedFile = embeddedFile;
     * // Create an import-data action
     * let action: PdfImportDataAction =
     *     new PdfImportDataAction(fileSpecification);
     * // Create a button field
     * let field: PdfButtonField =
     *     new PdfButtonField(
     *         page,
     *         'ImportData',
     *         { x: 20, y: 20, width: 120, height: 30 }
     *     );
     * // Assign the action to the button field
     * field.actions.mouseUp = action;
     * // Add the button field to the document
     * document.form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {Uint8Array} data The binary data to store in the embedded file.
     */
    public constructor(data: Uint8Array) {
        this._data = data;
    }
    /**
     * Gets the binary data stored in the embedded file.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Create the embedded file data
     * let attachmentData: Uint8Array =
     *     new Uint8Array([72, 101, 108, 108, 111]);
     * // Create an embedded file
     * let embeddedFile: PdfEmbeddedFile =
     *     new PdfEmbeddedFile(attachmentData);
     * // Get the embedded file data
     * let embeddedData: Uint8Array = embeddedFile.data;
     * // Create a file specification
     * let fileSpecification: PdfFileSpecification =
     *     new PdfFileSpecification('input.txt');
     * // Assign the embedded file to the file specification
     * fileSpecification.embeddedFile = embeddedFile;
     * // Create an import-data action
     * let action: PdfImportDataAction =
     *     new PdfImportDataAction(fileSpecification);
     * // Create a button field
     * let field: PdfButtonField =
     *     new PdfButtonField(
     *         page,
     *         'ImportData',
     *         { x: 20, y: 20, width: 120, height: 30 }
     *     );
     * // Assign the action to the button field
     * field.actions.mouseUp = action;
     * // Add the button field to the document
     * document.form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {Uint8Array} The binary data stored in the embedded file.
     */
    public get data(): Uint8Array {
        return this._data;
    }
    /**
     * Sets the binary data stored in the embedded file.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Create the initial embedded file data
     * let attachmentData: Uint8Array =
     *     new Uint8Array([72, 101, 108, 108, 111]);
     * // Create an embedded file
     * let embeddedFile: PdfEmbeddedFile =
     *     new PdfEmbeddedFile(attachmentData);
     * // Create the updated embedded file data
     * let updatedData: Uint8Array =
     *     new Uint8Array([85, 112, 100, 97, 116, 101, 100]);
     * // Set the updated embedded file data
     * embeddedFile.data = updatedData;
     * // Create a file specification
     * let fileSpecification: PdfFileSpecification =
     *     new PdfFileSpecification('input.txt');
     * // Assign the embedded file to the file specification
     * fileSpecification.embeddedFile = embeddedFile;
     * // Create an import-data action
     * let action: PdfImportDataAction =
     *     new PdfImportDataAction(fileSpecification);
     * // Create a button field
     * let field: PdfButtonField =
     *     new PdfButtonField(
     *         page,
     *         'ImportData',
     *         { x: 20, y: 20, width: 120, height: 30 }
     *     );
     * // Assign the action to the button field
     * field.actions.mouseUp = action;
     * // Add the button field to the document
     * document.form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {Uint8Array} value The binary data to store in the embedded file.
     */
    public set data(value: Uint8Array) {
        this._data = value;
    }
}
