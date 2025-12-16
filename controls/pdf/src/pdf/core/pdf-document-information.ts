/**
 * Represents the information about the PDF document.
 *
 * @property {string} title - The title of the PDF document.
 * @property {string} author - The author of the PDF document.
 * @property {string} subject - The subject of the PDF document.
 * @property {string} keywords - Keywords associated with the PDF document.
 * @property {string} creator - The application or tool that created the PDF.
 * @property {string} producer - The software that produced the PDF.
 * @property {string} language - The language of the PDF content.
 * @property {Date} creationDate - Indicates when the PDF document was originally created.
 * @property {Date} modificationDate - Indicates the most recent date the PDF document was modified.
 */
export type PdfDocumentInformation = {
    title?: string; // Specifies the title of the PDF document (optional)
    author?: string; // Specifies the author name of the PDF document. (optional)
    subject?: string; // Specifies the subject of the PDF document (optional)
    keywords?: string; // Specifies the keywords of the PDF document (optional)
    creator?: string; // Specifies the creator of the PDF document (optional)
    producer?: string; // Specifies the producer of the PDF document (optional)
    language?: string; // Specifies the language of the PDF document (optional)
    creationDate?: Date; // Specifies the creation date of the PDF document (optional)
    modificationDate?: Date; // Specifies the modification date of the PDF document (optional)
};
