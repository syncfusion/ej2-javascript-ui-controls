import { PdfDocument } from './../pdf-document';
import { _XmlWriter } from './xml-writer';
import { PdfForm } from './../form/form';
import { _bytesToString, _getNewGuidString } from './../utils';
import { PdfField } from './../form/field';
import { _ExportHelper } from './xfdf-document';
/**
 * Provides XML document handling for importing and exporting PDF form fields with support for both
 * Acrobat-compatible and standard XML formats.
 *
 * @private
 */
export class _XmlDocument extends _ExportHelper {
    /**
     * Initializes a new instance of the _XmlDocument class with an optional file name.
     *
     * @private
     * @param {string} [fileName] Optional file name to associate with the XML document.
     * @returns {void}
     */
    constructor(fileName?: string) {
        super();
        if (fileName !== null && typeof fileName !== 'undefined') {
            this._fileName = fileName;
        }
    }
    /* eslint-disable */
    /**
     * Exports all annotations from the PDF document into a serialized byte array.
     *
     * @private
     * @throws {Error} Indicates that the method is not implemented.
     * @returns {Uint8Array} as annotation. // eslint-disable-line
     */
    _exportAnnotations(): Uint8Array {
        throw new Error('Method not implemented.');
    }
    /* eslint-disable */
    /**
     * Exports form fields from the PDF document and returns the serialized data.
     *
     * @private
     * @param {PdfDocument} document The PDF document to export form fields from.
     * @returns {Uint8Array} The exported form fields as a byte array.
     */
    _exportFormFields(document: PdfDocument): Uint8Array {
        this._document = document;
        this._crossReference = document._crossReference;
        this._isAnnotationExport = false;
        this._format = 'XML';
        this._key = _getNewGuidString();
        return this._save();
    }
    /**
     * Saves the XML document and returns the serialized byte array.
     *
     * @private
     * @returns {Uint8Array} The saved XML document as a byte array.
     */
    _save(): Uint8Array {
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartDocument();
        if (this._asPerSpecification) {
            writer._writeStartElement('fields');
            writer._writeAttributeString('xfdf', 'http://ns.adobe.com/xfdf-transition/', 'xmlns', null);
        } else {
            writer._writeStartElement('Fields');
        }
        const form: PdfForm = this._document.form;
        if (form !== null && typeof form !== 'undefined') {
            this._exportEmptyFields = form.exportEmptyFields;
            const count: number = this._document.form.count;
            for (let i: number = 0; i < count; i++) {
                const field: PdfField = this._document.form.fieldAt(i);
                if (field !== null && typeof field !== 'undefined' && field.export) {
                    this._exportFormFieldData(field);
                }
            }
            this._writeFormFieldData(writer, this._asPerSpecification);
        }
        const result: Uint8Array = writer._save();
        writer._destroy();
        return result;
    }
    /**
     * Writes form field data to the XML writer honoring the specified format.
     *
     * @private
     * @param {_XmlWriter} writer The XML writer to write field data to.
     * @param {boolean} [isAcrobat=false] Whether to use Acrobat-compatible format with attributes.
     * @returns {void}
     */
    _writeFormFieldData(writer: _XmlWriter, isAcrobat: boolean = false): void {
        if (isAcrobat) {
            this._table.forEach((value: any, key: any) => {
                if (key.includes(' ')) {
                    const text: string = key.replace(/ /g, '');
                    writer._writeStartElement(text.toString());
                    writer._writeAttributeString('original', key.toString(), 'xfdf', null);
                } else {
                    writer._writeStartElement(key.toString());
                }
                writer._writeString(value.toString());
                writer._writeEndElement();
            });
        } else {
            this._table.forEach((value: any, key: any) => {
                if (key.includes(' ')) {
                    key = key.replace(/ /g, '_x0020_');
                }
                writer._writeStartElement(key.toString());
                writer._writeString(value.toString());
                writer._writeEndElement();
            });
        }
        writer._writeEndElement();
    }

    /**
     * Imports form field data from an XML byte array into the PDF document.
     *
     * @private
     * @param {PdfDocument} document The PDF document to import form data into.
     * @param {Uint8Array} data The XML data containing form field values.
     * @returns {void}
     */
    _importFormData(document: PdfDocument, data: Uint8Array): void {
        this._document = document;
        this._crossReference = document._crossReference;
        this._isAnnotationExport = false;
        let value: string = _bytesToString(data);
        value = value.replace(/(\r\n|\n|\r)/gm, '');
        value = value.replace(/[^\x20-\x7E]/g, '');
        this._xmlDocument = (new DOMParser()).parseFromString(value, 'text/xml');
        this._checkXml(this._xmlDocument);
        this._xmlImport = true;
        this._parseFormData(this._xmlDocument.documentElement);
        this._xmlImport = false;
    }
    /**
     * Parses form field data from the XML document root element.
     *
     * @private
     * @param {HTMLElement} root The root element of the XML document to parse.
     * @returns {void}
     */
    _parseFormData(root: HTMLElement): void {
        const child: NodeListOf<ChildNode> = root.childNodes;
        if (child !== null && typeof child !== 'undefined' && child.length > 0) {
            for (let i: number = 0; i < child.length; i++) {
                const childNode: Node = child.item(i);
                if (childNode !== null && typeof childNode !== 'undefined' && childNode.nodeType === 1) {
                    const element: Element = childNode as Element;
                    let text: string = '';
                    if (element.attributes !== null && typeof element.attributes !== 'undefined' && element.attributes.length > 0) {
                        const attribute: any = element.attributes.item(0);
                        if (attribute !== null && typeof attribute !== 'undefined' && attribute.name === 'xfdf:original') {
                            text = attribute.value;
                        }
                    } else {
                        text = element.tagName;
                    }
                    const v: string = element.textContent;
                    if (text !== null && text !== undefined && text.length > 0) {
                        this._table.set(text, v);
                    }
                }
            }
        }
        this._importField();
    }
    /**
     * Imports form field values into the PDF document's form fields using the internal table data.
     *
     * @private
     * @returns {void}
     */
    _importField(): void {
        const form: PdfForm = this._document.form;
        const count: number = form.count;
        if (count) {
            this._table.forEach((value: any, key: any) => {
                let textValue: string;
                if (this._table.size > 0 && this._table.has(key)) {
                    textValue = this._table.get(key);
                }
                let text: string = key.toString();
                if (text.indexOf('_x0020_') !== -1) {
                    text = text.replace(/_x0020_/g, ' ');
                }
                const index: number = form._getFieldIndex(text);
                if (index !== -1 && index < count) {
                    const field: PdfField = form.fieldAt(index);
                    if (field && field !== null && typeof field !== 'undefined') {
                        if (textValue && textValue !== '') {
                            field._dictionary.update('RV', textValue);
                        }
                        const param: Array<string> = [];
                        param.push(value);
                        this._importFieldData(field, param);
                    }
                }
            });
        }
    }
    /**
     * Validates the XML document for parsing errors.
     *
     * @private
     * @param {Document} xmlDocument The XML document to validate.
     * @returns {void}
     * @throws {Error} Throws an error if the XML document contains parser errors.
     */
    _checkXml(xmlDocument: Document): void {
        if (xmlDocument.getElementsByTagName('parsererror').length > 0) {
            throw new Error('Invalid XML file.');
        }
    }
}
