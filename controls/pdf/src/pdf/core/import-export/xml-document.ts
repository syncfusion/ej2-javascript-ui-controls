import { PdfDocument } from './../pdf-document';
import { _XmlWriter } from './xml-writer';
import { PdfForm } from './../form/form';
import { _bytesToString, _getNewGuidString } from './../utils';
import { PdfField } from './../form/field';
import { _ExportHelper } from './xfdf-document';
export class _XmlDocument extends _ExportHelper {
    constructor(fileName?: string) {
        super();
        if (fileName !== null && typeof fileName !== 'undefined') {
            this._fileName = fileName;
        }
    }
    _exportAnnotations(): Uint8Array {
        throw new Error('Method not implemented.');
    }
    _exportFormFields(document: PdfDocument): Uint8Array {
        this._document = document;
        this._crossReference = document._crossReference;
        this._isAnnotationExport = false;
        this._format = 'XML';
        this._key = _getNewGuidString();
        return this._save();
    }
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
    _writeFormFieldData(writer: _XmlWriter, isAcrobat: boolean = false): void {
        if (isAcrobat) {
            this._table.forEach((value: any, key: any) => { // eslint-disable-line
                if (key.includes(' ')) {
                    const text: string = key.replace(' ', '');
                    writer._writeStartElement(text.toString());
                    writer._writeAttributeString('original', key.toString(), 'xfdf', null);
                } else {
                    writer._writeStartElement(key.toString());
                }
                writer._writeString(value.toString());
                writer._writeEndElement();
            });
        } else {
            this._table.forEach((value: any, key: any) => { // eslint-disable-line
                if (key.includes(' ')) {
                    key = key.replace(' ', '_x0020_');
                }
                writer._writeStartElement(key.toString());
                writer._writeString(value.toString());
                writer._writeEndElement();
            });
        }
        writer._writeEndElement();
    }

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
    _parseFormData(root: HTMLElement): void {
        const child: NodeListOf<ChildNode> = root.childNodes;
        if (child !== null && typeof child !== 'undefined' && child.length > 0) {
            for (let i: number = 0; i < child.length; i++) {
                const childNode: Node = child.item(i);
                if (childNode !== null && typeof childNode !== 'undefined' && childNode.nodeType === 1) {
                    const element: Element = childNode as Element;
                    let text: string = '';
                    if (element.attributes !== null && typeof element.attributes !== 'undefined' && element.attributes.length > 0) {
                        const attribute: any = element.attributes.item(0); // eslint-disable-line
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
    _importField(): void {
        const form: PdfForm = this._document.form;
        const count: number = form.count;
        if (count) {
            this._table.forEach((value: any, key: any) => { // eslint-disable-line
                let textValue: string;
                if (this._table.size > 0 && this._table.has(key)) {
                    textValue = this._table.get(key);
                }
                let text: string = key.toString();
                if (text.indexOf('_x0020_') !== -1) {
                    text = text.replace('_x0020_', ' ');
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
    _checkXml(xmlDocument: Document): void {
        if (xmlDocument.getElementsByTagName('parsererror').length > 0) {
            throw new Error('Invalid XML file.');
        }
    }
}
