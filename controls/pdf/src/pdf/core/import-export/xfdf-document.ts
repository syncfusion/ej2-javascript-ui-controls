import { _XmlWriter } from './xml-writer';
import { PdfDocument } from './../pdf-document';
import { PdfPage } from './../pdf-page';
import { PdfForm } from './../form/form';
import { PdfWidgetAnnotation, PdfAnnotation, PdfLineAnnotation, PdfFileLinkAnnotation, PdfTextWebLinkAnnotation, PdfDocumentLinkAnnotation, PdfUriAnnotation, PdfRadioButtonListItem, PdfStateItem } from './../annotations/annotation';
import { PdfAnnotationCollection } from './../annotations/annotation-collection';
import { _PdfAnnotationType, PdfAnnotationFlag } from './../enumerator';
import { _PdfDictionary, _PdfName, _PdfReference } from './../pdf-primitives';
import { _PdfBaseStream, _PdfContentStream } from './../base-stream';
import { _hexStringToByteArray, _stringToAnnotationFlags, _convertToColor, _bytesToString, _hexStringToString, _getSpecialCharacter, _getLatinCharacter, _getInheritableProperty, _getNewGuidString, _byteArrayToHexString, _stringToBytes, _annotationFlagsToString, _encode } from './../utils';
import { _PdfCrossReference } from './../pdf-cross-reference';
import { PdfCheckBoxField, PdfComboBoxField, PdfField, PdfListBoxField, PdfRadioButtonListField, PdfTextBoxField, PdfListField } from './../form/field';
export abstract class _ExportHelper {
    exportAppearance: boolean;
    _asPerSpecification: boolean = false;
    _skipBorderStyle: boolean;
    _fileName: string = '';
    _document: PdfDocument;
    _crossReference: _PdfCrossReference;
    _isAnnotationExport: boolean;
    _isAnnotationImport: boolean;
    _key: string;
    _formKey: string = '';
    _exportEmptyFields: boolean = false;
    _groupReferences: Map<string, _PdfReference> = new Map<string, _PdfReference>();
    _groupHolders: Array<_PdfDictionary> = [];
    _encodeDictionary: _PdfDictionary;
    _annotationTypes: Array<_PdfAnnotationType>;
    _annotationAttributes: Array<string>;
    _xmlDocument: Document;
    _richTextPrefix: string = '<?xml version="1.0"?>';
    _parser: DOMParser;
    _table: Map<any, any> = new Map<any, any>(); // eslint-disable-line
    _fields: Map<string, string[]> = new Map<string, string[]>();
    _richTextValues: Map<string, string> = new Map<string, string>();
    _jsonData: number[] = [];
    _openingBrace: number = 123;
    _openingBracket: number = 91;
    _closingBrace: number = 125;
    _closingBracket: number = 93;
    _colon: number = 58;
    _doubleQuotes: number = 34;
    _comma: number = 44;
    _space: number = 32;
    _format: string;
    _annotationID: string;
    fdfString: string = '';
    _xmlImport: boolean = false;
    abstract _exportAnnotations(document?: PdfDocument): Uint8Array;
    abstract _exportFormFields(document: PdfDocument): Uint8Array;
    abstract _save(): Uint8Array;
    _exportFormFieldsData(field: PdfField): string | string[] {
        let textValue: string = '';
        if (field !== null && typeof field !== 'undefined' && field.export) {
            const type: _PdfName = _getInheritableProperty(field._dictionary, 'FT', false, true, 'Parent');
            if (type && type.name !== null && typeof type.name !== 'undefined') {
                const font: _PdfDictionary = this._getEncodedFontDictionary(field._dictionary);
                let fieldName: string = field.name;
                if (font !== null && typeof font !== 'undefined') {
                    fieldName = this._getEncodedValue(fieldName, font);
                }
                let value: any; // eslint-disable-line
                let selectedValue: string | string[];
                switch (type.name) {
                case 'Tx':
                    textValue = _getInheritableProperty(field._dictionary, 'V', false, true, 'Parent');
                    if (textValue !== null && typeof textValue !== 'undefined') {
                        textValue = this._getEncodedValue(textValue, font);
                        this._table.set(fieldName, textValue);
                    } else if (this._exportEmptyFields) {
                        textValue = '';
                        this._table.set(fieldName, textValue);
                    }
                    break;
                case 'Ch':
                    value = _getInheritableProperty(field._dictionary, 'V', true, true, 'Parent');
                    if (value !== null && typeof value !== 'undefined') {
                        selectedValue = this._getExportValue(value);
                    }
                    if (!value && field._dictionary.has('I') && (field instanceof PdfListBoxField || field instanceof PdfComboBoxField)) {
                        selectedValue = field._obtainSelectedValue();
                    }
                    if (selectedValue !== null && typeof selectedValue !== 'undefined') {
                        if (typeof selectedValue === 'string' && selectedValue !== '') {
                            selectedValue = this._getEncodedValue(selectedValue, font);
                            textValue = selectedValue;
                            this._table.set(fieldName, textValue);
                        } else if (selectedValue instanceof Array && selectedValue.length > 0) {
                            const values: string[] = [];
                            for (let i: number = 0; i < selectedValue.length; i++) {
                                values.push(this._getEncodedValue(selectedValue[Number.parseInt(i.toString(), 10)], font));
                            }
                            this._table.set(fieldName, values);
                            return values;
                        }
                    } else if (this._exportEmptyFields) {
                        textValue = '';
                        this._table.set(fieldName, textValue);
                    }
                    break;
                case 'Btn':
                    value = _getInheritableProperty(field._dictionary, 'V', false, true, 'Parent');
                    if (value !== null && typeof value !== 'undefined') {
                        let text: string = this._getExportValue(value, field) as string;
                        if (text !== null && typeof text !== 'undefined' && text !== '') {
                            let radioButton: PdfRadioButtonListField;
                            if (field instanceof PdfRadioButtonListField) {
                                radioButton = field;
                            }
                            if (!field._dictionary.has('Opt') ||
                                (radioButton !== null &&
                                typeof radioButton !== 'undefined'
                                && radioButton.selectedIndex === -1)) {
                                text = this._getEncodedValue(text, font);
                                textValue = text;
                                this._table.set(fieldName, textValue);
                            } else {
                                if (field._dictionary.has('Opt')) {
                                    const options: string[] = field._dictionary.getArray('Opt');
                                    let index: number = Number.parseInt(text, 10);
                                    if (index === null || typeof index === 'undefined' || Number.isNaN(index)) {
                                        index = 0;
                                    }
                                    if (options !== null && typeof options !== 'undefined') {
                                        let current: string;
                                        if (radioButton) {
                                            current = options[radioButton.selectedIndex];
                                        } else {
                                            current = options[Number.parseInt(index.toString(), 10)];
                                        }
                                        if (current !== null && typeof current !== 'undefined') {
                                            text = current;
                                        }
                                        if (text !== null && typeof text !== 'undefined' && text !== '') {
                                            text = this._getEncodedValue(text, font);
                                            textValue = text;
                                            this._table.set(fieldName, textValue);
                                        }
                                    }
                                }
                            }
                        } else if (field instanceof PdfRadioButtonListField || field instanceof PdfCheckBoxField) {
                            if (this._exportEmptyFields) {
                                textValue = text;
                            } else {
                                textValue = 'Off';
                            }
                            this._table.set(fieldName, textValue);
                        }
                    } else {
                        if (field instanceof PdfRadioButtonListField) {
                            textValue =  field._getAppearanceStateValue();
                            if (!textValue) {
                                if (this._exportEmptyFields) {
                                    textValue = '';
                                } else {
                                    textValue = 'Off';
                                }
                            }
                            this._table.set(fieldName, textValue);
                        } else {
                            const widget: PdfWidgetAnnotation = field.itemAt(field._defaultIndex);
                            let dictionary: _PdfDictionary;
                            if (widget) {
                                dictionary = widget._dictionary;
                            } else {
                                dictionary = field._dictionary;
                            }
                            if (dictionary && dictionary.has('AS')) {
                                textValue = dictionary.get('AS').name;
                                this._table.set(fieldName, textValue);
                            } else if (this._exportEmptyFields) {
                                textValue = '';
                                this._table.set(fieldName, textValue);
                            }
                        }
                    }
                    break;
                }
            }
        }
        return textValue;
    }
    _exportFormFieldData(field: PdfField): void {
        const type: _PdfName = _getInheritableProperty(field._dictionary, 'FT', false, true, 'Parent');
        if (type && type.name !== null && typeof type.name !== 'undefined') {
            const font: _PdfDictionary = this._getEncodedFontDictionary(field._dictionary);
            let fieldName: string = field.name;
            if (font !== null && typeof font !== 'undefined') {
                fieldName = this._getEncodedValue(fieldName, font);
            }
            let textValue: string;
            let value: any; // eslint-disable-line
            switch (type.name) {
            case 'Tx':
                textValue = _getInheritableProperty(field._dictionary, 'V', false, true, 'Parent');
                if (this._asPerSpecification) {
                    if (field._dictionary.has('RV')) {
                        textValue = _getInheritableProperty(field._dictionary, 'RV', false, true, 'Parent');
                        if (textValue !== null && typeof textValue !== 'undefined') {
                            textValue += this._key;
                            this._formKey = this._key;
                            this._table.set(fieldName, textValue);
                        }
                    } else if (textValue !== null && typeof textValue !== 'undefined') {
                        textValue = this._getEncodedValue(textValue, font);
                        let replaceValue: string = textValue;
                        if (field instanceof PdfTextBoxField && field.multiLine) {
                            replaceValue = replaceValue.replace('\n', '');
                            replaceValue = replaceValue.replace('\r', '\r\n');
                            textValue = replaceValue;
                        }
                        this._table.set(fieldName, textValue);
                    }
                } else {
                    if (textValue !== null && typeof textValue !== 'undefined') {
                        textValue = this._getEncodedValue(textValue, font);
                        this._table.set(fieldName, textValue);
                    } else if (this._exportEmptyFields) {
                        this._table.set(fieldName, '');
                    }
                }
                break;
            case 'Ch':
                value = _getInheritableProperty(field._dictionary, 'V', true, true, 'Parent');
                if (this._asPerSpecification) {
                    if (field instanceof PdfListField) {
                        if (Array.isArray(value)) {
                            this._table.set(fieldName, value);
                        } else {
                            if (typeof value === 'string') {
                                value = this._getEncodedValue(value, font);
                                this._table.set(fieldName, value);
                            } else if ((value === null || typeof value === 'undefined') && field._dictionary.has('I')) {
                                let selectedValue: string | string[] = field._obtainSelectedValue();
                                if (selectedValue !== null && typeof selectedValue !== 'undefined') {
                                    if (typeof selectedValue === 'string' && selectedValue !== '') {
                                        selectedValue = this._getEncodedValue(selectedValue, font);
                                        this._table.set(fieldName, textValue);
                                    } else if (selectedValue instanceof Array && selectedValue.length > 0) {
                                        const values: string[] = [];
                                        for (let i: number = 0; i < selectedValue.length; i++) {
                                            values.push(this._getEncodedValue(selectedValue[Number.parseInt(i.toString(), 10)], font));
                                        }
                                        this._table.set(fieldName, values);
                                    }
                                }
                            }
                        }
                    }
                } else {
                    let selectedValue: string | string[];
                    if (value !== null && typeof value !== 'undefined') {
                        selectedValue = this._getExportValue(value);
                    }
                    if (!value && field._dictionary.has('I') && (field instanceof PdfListBoxField || field instanceof PdfComboBoxField)) {
                        selectedValue = field._obtainSelectedValue();
                    }
                    if (selectedValue !== null && typeof selectedValue !== 'undefined') {
                        if (typeof selectedValue === 'string' && selectedValue !== '') {
                            selectedValue = this._getEncodedValue(selectedValue, font);
                            this._table.set(fieldName, selectedValue);
                        } else if (selectedValue instanceof Array && selectedValue.length > 0) {
                            const values: string[] = [];
                            for (let i: number = 0; i < selectedValue.length; i++) {
                                values.push(this._getEncodedValue(selectedValue[Number.parseInt(i.toString(), 10)], font));
                            }
                            this._table.set(fieldName, values);
                        } else if (this._exportEmptyFields) {
                            this._table.set(fieldName, '');
                        }
                    } else if (this._exportEmptyFields) {
                        this._table.set(fieldName, '');
                    }
                }
                break;
            case 'Btn':
                value = _getInheritableProperty(field._dictionary, 'V', false, true, 'Parent');
                if (value !== null && typeof value !== 'undefined') {
                    let text: string = this._getExportValue(value, field) as string;
                    if (text !== null && typeof text !== 'undefined' && text !== '') {
                        if (this._asPerSpecification && this._format !== 'XML') {
                            text = _hexStringToString(text);
                        }
                        let radioButton: PdfRadioButtonListField;
                        if (field instanceof PdfRadioButtonListField) {
                            radioButton = field;
                        }
                        if (!field._dictionary.has('Opt') ||
                            (radioButton !== null &&
                            typeof radioButton !== 'undefined'
                            && radioButton.selectedIndex === -1)) {
                            text = this._getEncodedValue(text, font);
                            this._table.set(fieldName, text);
                        } else {
                            if (field._dictionary.has('Opt')) {
                                const options: string[] = field._dictionary.getArray('Opt');
                                let index: number = Number.parseInt(text, 10);
                                if (index === null || typeof index === 'undefined' || Number.isNaN(index)) {
                                    index = 0;
                                }
                                if (options !== null && typeof options !== 'undefined') {
                                    let current: string;
                                    if (radioButton) {
                                        current = options[radioButton.selectedIndex];
                                    } else {
                                        current = options[Number.parseInt(index.toString(), 10)];
                                    }
                                    if (current !== null && typeof current !== 'undefined') {
                                        text = current;
                                    }
                                    if (text !== null && typeof text !== 'undefined' && text !== '') {
                                        text = this._getEncodedValue(text, font);
                                        this._table.set(fieldName, text);
                                    }
                                }
                            }
                        }
                    } else if (field instanceof PdfRadioButtonListField || field instanceof PdfCheckBoxField) {
                        if (this._exportEmptyFields) {
                            this._table.set(fieldName, text);
                        } else {
                            this._table.set(fieldName, 'Off');
                        }
                    }
                } else {
                    if (field instanceof PdfRadioButtonListField) {
                        let text: string =  field._getAppearanceStateValue();
                        if (!text) {
                            if (this._exportEmptyFields) {
                                text = '';
                            } else {
                                text = 'Off';
                            }
                        }
                        this._table.set(fieldName, text);
                    } else {
                        const widget: PdfWidgetAnnotation = field.itemAt(field._defaultIndex);
                        let dictionary: _PdfDictionary;
                        if (widget) {
                            dictionary = widget._dictionary;
                        } else {
                            dictionary = field._dictionary;
                        }
                        if (dictionary && dictionary.has('AS')) {
                            this._table.set(fieldName, dictionary.get('AS').name);
                        } else if (this._exportEmptyFields) {
                            this._table.set(fieldName, '');
                        }
                    }
                }
                break;
            }
        }
    }
    _getAnnotationType(dictionary: _PdfDictionary): string {
        let type: string = '';
        if (dictionary.has('Subtype')) {
            const subtype: _PdfName = dictionary.get('Subtype');
            if (subtype) {
                type = subtype.name;
            }
        }
        return type;
    }
    _getValue(primitive: any, isJson: boolean = false): string { // eslint-disable-line
        let value: string = '';
        if (typeof primitive !== 'undefined' && primitive !== null) {
            if (primitive instanceof _PdfName) {
                value = primitive.name;
            } else if (typeof primitive === 'boolean') {
                value = primitive ? isJson ? 'true' : 'yes' : isJson ? 'false' : 'no';
            } else if (typeof primitive === 'string') {
                value = this._getValidString(primitive);
            } else if (Array.isArray(primitive)) {
                const colorArray: any[] = primitive; // eslint-disable-line
                if (colorArray.length > 0) {
                    value = this._getValue(colorArray[0], isJson);
                }
                for (let i: number = 1; i < colorArray.length; i++) {
                    value += ',' + this._getValue(colorArray[Number.parseInt(i.toString(), 10)], isJson);
                }
            } else if (typeof primitive === 'number') {
                value = primitive.toString();
            }
        }
        return value;
    }
    _getColor(primitive: any): string { // eslint-disable-line
        let color: string = '';
        if (primitive && Array.isArray(primitive) && primitive.length >= 3) {
            const r: string = Math.round(primitive[0] * 255).toString(16).toUpperCase();
            const g: string = Math.round(primitive[1] * 255).toString(16).toUpperCase();
            const b: string = Math.round(primitive[2] * 255).toString(16).toUpperCase();
            color = '#' + (r.length === 1 ? ('0' + r) : r) + (g.length === 1 ? ('0' + g) : g) + (b.length === 1 ? ('0' + b) : b);
        }
        return color;
    }
    _getValidString(value: string): string {
        if (value.indexOf('\n') !== -1) {
            value = value.replace(/\n/g, '\\n');
        }
        if (value.indexOf('\r') !== -1) {
            value = value.replace(/\r/g, '\\r');
        }
        return value;
    }
    _getEncodedFontDictionary(source: _PdfDictionary): _PdfDictionary {
        let font: _PdfDictionary;
        let kids: any[]; // eslint-disable-line
        if (source.has('Kids') && !source.has('AP')) {
            kids = source.getArray('Kids');
        }
        if (source.has('AP') || (kids !== null && typeof kids !== 'undefined' && Array.isArray(kids))) {
            let appearance: _PdfDictionary;
            if (kids !== null && typeof kids !== 'undefined' && kids.length > 0) {
                const kid: _PdfDictionary = kids[0];
                if (kid !== null && typeof kid !== 'undefined' && kid.has('AP')) {
                    appearance = kid.get('AP');
                }
            } else {
                appearance = source.get('AP');
            }
            if (appearance !== null && typeof appearance !== 'undefined' && appearance.has('N')) {
                const normal: _PdfBaseStream = appearance.get('N');
                if (normal !== null && typeof normal !== 'undefined' && normal instanceof _PdfBaseStream && normal.dictionary.has('Resources')) {
                    const resource: _PdfDictionary = normal.dictionary.get('Resources');
                    if (resource !== null && typeof resource !== 'undefined' && resource.has('Font')) {
                        font = resource.get('Font');
                    }
                }
            }
        }
        return font;
    }
    _getEncodedValue(value: string, dictionary?: _PdfDictionary): string {
        const text: string = value;
        let structure: _FontStructure;
        if (this._encodeDictionary !== null && typeof this._encodeDictionary !== 'undefined') {
            structure = new _FontStructure(this._encodeDictionary);
            return this._replaceNotUsedCharacters(text, structure);
        } else {
            const root: _PdfDictionary = this._document.form._dictionary;
            if (root !== null && typeof root !== 'undefined' && root.has('DR')) {
                const resource: _PdfDictionary = root.get('DR');
                if (resource !== null && typeof resource !== 'undefined' && resource.has('Encoding')) {
                    const encoding: _PdfDictionary = resource.get('Encoding');
                    if (encoding !== null && typeof encoding !== 'undefined' && encoding.has('PDFDocEncoding')) {
                        const pdfEncoding: _PdfDictionary = encoding.get('PDFDocEncoding');
                        if (pdfEncoding !== null && typeof pdfEncoding !== 'undefined' && pdfEncoding.has('Differences')) {
                            const encodingDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
                            encodingDictionary.set('Differences', pdfEncoding.get('Differences'));
                            const reference: _PdfReference = this._crossReference._getNextReference();
                            this._crossReference._cacheMap.set(reference, encodingDictionary);
                            const fontEncodeDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
                            fontEncodeDictionary.set('Subtype', _PdfName.get('Type1'));
                            fontEncodeDictionary.set('Encoding', reference);
                            structure = new _FontStructure(fontEncodeDictionary);
                            if (structure !== null &&
                                typeof structure !== 'undefined' &&
                                structure.differencesDictionary !== null &&
                                typeof structure.differencesDictionary !== 'undefined' &&
                                structure.differencesDictionary.size > 0) {
                                this._encodeDictionary = fontEncodeDictionary;
                                return this._replaceNotUsedCharacters(text, structure);
                            }
                        }
                    }
                }
            }
            if (value !== null &&
                typeof value !== 'undefined' &&
                dictionary !== null &&
                typeof dictionary !== 'undefined' &&
                dictionary.size > 0) {
                let result: string;
                let isSkip: boolean = false;
                dictionary.forEach((key: string, value: any) => { // eslint-disable-line
                    if (!isSkip && value !== null && typeof value !== 'undefined') {
                        let fontDictionary: _PdfDictionary;
                        if (value instanceof _PdfDictionary) {
                            fontDictionary = value;
                        } else if (value instanceof _PdfReference) {
                            const holder: any = this._crossReference._fetch(value); // eslint-disable-line
                            if (holder !== null && typeof holder !== 'undefined' && holder instanceof _PdfDictionary) {
                                fontDictionary = holder;
                            }
                        }
                        if (fontDictionary) {
                            structure = new _FontStructure(fontDictionary);
                            result = this._replaceNotUsedCharacters(text, structure);
                            isSkip = true;
                        }
                    }
                });
                if (!isSkip) {
                    return result;
                }
            }
            return text;
        }
    }
    _replaceNotUsedCharacters(input: string, structure: _FontStructure): string {
        let updatedString: string = '';
        const differencesDictionary: Map<string, string> = structure.differencesDictionary;
        for (let i: number = 0; i < input.length; i++) {
            const text: string = input[Number.parseInt(i.toString(), 10)];
            const code: number = input.charCodeAt(i);
            if (differencesDictionary.has(text)) {
                const difference: string = differencesDictionary.get(text);
                if ((difference.length > 1 && structure._fontType !== 'Type3') ||
                    (code > 127 && code <= 255 && structure._fontType === 'Type1' &&
                    structure._baseFontEncoding !== 'WinAnsiEncoding' &&
                    structure._fontEncoding === 'Encoding' && structure._fontName === 'ZapfDingbats')) {
                    updatedString += text;
                } else {
                    updatedString += difference;
                }
            } else {
                updatedString += text;
            }
        }
        return updatedString;
    }
    _getExportValue(primitive: any, field?: PdfField) : string | string[] { // eslint-disable-line
        let value: string;
        if (primitive !== null && typeof primitive !== 'undefined') {
            if (field !== null && typeof field !== 'undefined') {
                if (primitive instanceof _PdfName) {
                    value = primitive.name;
                } else if (typeof primitive === 'string') {
                    value = primitive;
                }
                if (value !== null &&
                    typeof value !== 'undefined' &&
                    value !== '' &&
                    field instanceof PdfRadioButtonListField &&
                    field.selectedIndex !== -1) {
                    const item: PdfRadioButtonListItem = field.itemAt(field.selectedIndex);
                    if (item !== null && typeof item !== 'undefined' && item.value === value) {
                        value = item.value;
                    }
                }
            } else {
                if (primitive instanceof _PdfName) {
                    value = primitive.name;
                } else if (typeof primitive === 'string') {
                    value = primitive;
                } else if (Array.isArray(primitive)) {
                    const values: string[] = [];
                    for (let i: number = 0; i < primitive.length; i++) {
                        const element: any = primitive[Number.parseInt(i.toString(), 10)]; // eslint-disable-line
                        if (element instanceof _PdfName) {
                            values.push(element.name);
                        } else if (typeof element === 'string') {
                            values.push(element);
                        }
                    }
                    return values;
                }
            }
        }
        return value;
    }
    _addReferenceToGroup(reference: _PdfReference, dictionary: _PdfDictionary): void {
        let name: string = dictionary.get('NM');
        if (name && name !== '') {
            this._groupReferences.set(name, reference);
            if (dictionary.has('IRT')) {
                this._groupHolders.push(dictionary);
            }
        } else if (!name && dictionary.has('IRT')) {
            name = dictionary.get('IRT');
            if (name && name !== '' && this._groupReferences.has(name)) {
                dictionary.update('IRT', this._groupReferences.get(name));
            }
        }
    }
    _handlePopup(annotations: PdfAnnotationCollection,
                 reference: _PdfReference,
                 annotationDictionary: _PdfDictionary,
                 pageDictionary: _PdfDictionary): void {
        if (annotationDictionary.has('Popup')) {
            const popupReference: _PdfReference = annotationDictionary.getRaw('Popup');
            const popup: _PdfDictionary = annotationDictionary.get('Popup');
            if (popup instanceof _PdfDictionary) {
                if (popupReference && popup ) {
                    popup.update('Parent', reference);
                }
                const popupAnnotation: PdfAnnotation = annotations._parseAnnotation(popup);
                const index: number = annotations._annotations.length;
                annotations._annotations.push(reference);
                pageDictionary.set('Annots', annotations._annotations);
                pageDictionary._updated = true;
                annotations._parsedAnnotations.set(index, popupAnnotation);
            }
        }
    }
    _importField(): void {
        const form: PdfForm = this._document.form;
        const count: number = form.count;
        if (count) {
            this._fields.forEach((value: string[], key: string) => {
                let richTextValue: string;
                if (this._richTextValues.size > 0 && this._richTextValues.has(key)) {
                    richTextValue = this._richTextValues.get(key);
                }
                const index: number = form._getFieldIndex(key);
                if (index !== -1 && index < count) {
                    const field: PdfField = form.fieldAt(index);
                    if (field && field !== null && typeof field !== 'undefined') {
                        if (richTextValue && richTextValue !== '') {
                            field._dictionary.update('RV', richTextValue);
                        }
                        this._importFieldData(field, value);
                    }
                }
            });
        }
    }
    _importFieldData(field: PdfField, values: string[]): void {
        if (values !== null &&
            typeof values !== 'undefined' &&
            values.length > 0 &&
            field !== null &&
            typeof field !== 'undefined' &&
            !field.readOnly) {
            let value: string = values[0];
            if (field instanceof PdfTextBoxField) {
                if (value !== null && typeof value !== 'undefined') {
                    if (field instanceof PdfTextBoxField && field.multiLine) {
                        value = value.replace('\r\n', '\r');
                        value = value.replace('\n', '\r');
                    }
                    field.text = value;
                }
            } else if (field instanceof PdfListBoxField || field instanceof PdfComboBoxField) {
                let selectedValues: string[];
                if (values.length > 1) {
                    selectedValues = values;
                } else {
                    if (this._xmlImport) {
                        selectedValues = (value.indexOf(',') !== -1 ? value.split(',') : [value]);
                    } else {
                        selectedValues = [value.indexOf(',') !== -1 ? value.split(',')[0] : value];
                    }
                }
                const indexes: number[] = [];
                const options: string[][] = field._options;
                if (options && options.length > 0) {
                    options.forEach((option: string[]) => {
                        if (selectedValues.indexOf(option[0]) !== -1 || selectedValues.indexOf(option[1]) !== -1) {
                            indexes.push(options.indexOf(option));
                        }
                    });
                }
                if (indexes.length > 0) {
                    field.selectedIndex = indexes;
                    if (field instanceof PdfComboBoxField && this._asPerSpecification && field._dictionary.has('AP')) {
                        delete field._dictionary._map.AP;
                        field._dictionary._updated = true;
                    }
                }
            } else if (field instanceof PdfCheckBoxField) {
                const lowerCase: string = value.toLowerCase();
                if (this._containsExportValue(value, field) || lowerCase === 'on' || lowerCase === 'yes') {
                    field.checked = true;
                } else {
                    field.checked = false;
                }
            } else if (field instanceof PdfRadioButtonListField) {
                let index: number = -1;
                for (let i: number = 0; i < field._kidsCount; i++) {
                    const item: PdfRadioButtonListItem = field.itemAt(i);
                    if (item && item.value && item.value === value) {
                        index = i;
                        break;
                    }
                }
                if (index !== -1 && field.selectedIndex !== index) {
                    field.selectedIndex = index;
                }
            }
        }
    }
    _containsExportValue(value: string, field: PdfCheckBoxField): boolean {
        let result: boolean = false;
        if (field._kidsCount > 0) {
            for (let i: number = 0; i < field._kidsCount; i++) {
                const kid: PdfStateItem = field.itemAt(i);
                if (kid && this._checkSelected(kid._dictionary, value)) {
                    return true;
                }
            }
        } else {
            result = this._checkSelected(field._dictionary, value);
            if (!result && this._asPerSpecification && field._dictionary.has('AS')) {
                const asEntry: _PdfName = field._dictionary.get('AS');
                if (asEntry && (asEntry.name === 'Off' || asEntry.name === 'No')) {
                    if (field._dictionary.has('Opt')) {
                        const options: string[] = field._dictionary.getArray('Opt');
                        if (options && options.length > 0) {
                            options.forEach((option: string) => {
                                if (option === value) {
                                    result = true;
                                }
                            });
                        }
                    }
                } else {
                    result = true;
                }
            }
        }
        return result;
    }
    _checkSelected(dictionary: _PdfDictionary, value: string): boolean {
        if (dictionary && dictionary.has('AP')) {
            const appearance: _PdfDictionary = dictionary.get('AP');
            if (appearance && appearance instanceof _PdfDictionary && appearance.has('N')) {
                const normalTemplate: _PdfDictionary = appearance.get('N');
                if (normalTemplate &&
                    normalTemplate instanceof _PdfDictionary &&
                    normalTemplate.has(value) &&
                    !(value.toLocaleLowerCase() === 'off' || value.toLocaleLowerCase() === 'no')) {
                    return true;
                }
            }
        }
        return false;
    }
    _dispose(): void {
        this.exportAppearance = undefined;
        this._asPerSpecification = undefined;
        this._skipBorderStyle = undefined;
        this._fileName = undefined;
        this._document = undefined;
        this._crossReference = undefined;
        this._isAnnotationExport = undefined;
        this._isAnnotationImport = undefined;
        this._key = undefined;
        this._formKey = undefined;
        this._exportEmptyFields = undefined;
        this._groupReferences = undefined;
        this._groupHolders = undefined;
        this._encodeDictionary = undefined;
        this._annotationTypes = undefined;
        this._annotationAttributes = undefined;
        this._xmlDocument = undefined;
        this._parser = undefined;
        this._table = undefined;
        this._fields = undefined;
        this._richTextValues = undefined;
        this._jsonData = undefined;
    }
}
export class _XfdfDocument extends _ExportHelper {
    constructor(fileName?: string) {
        super();
        if (fileName !== null && typeof fileName !== 'undefined') {
            this._fileName = fileName;
        }
    }
    // #region Export Annotations
    _exportAnnotations(document: PdfDocument): Uint8Array {
        this._document = document;
        this._crossReference = document._crossReference;
        this._isAnnotationExport = true;
        return this._save();
    }
    _exportFormFields(document: PdfDocument): Uint8Array {
        this._document = document;
        this._crossReference = document._crossReference;
        this._isAnnotationExport = false;
        this._key = _getNewGuidString();
        return this._save();
    }
    _save(): Uint8Array {
        const writer: _XmlWriter = new _XmlWriter();
        writer._writeStartDocument();
        writer._writeStartElement('xfdf');
        writer._writeAttributeString(null, 'http://ns.adobe.com/xfdf/', 'xmlns', null);
        writer._writeAttributeString('space', 'preserve', 'xml', null);
        if (this._isAnnotationExport) {
            writer._writeStartElement('annots');
            if (this._document) {
                for (let i: number = 0; i < this._document.pageCount; i++) {
                    const page: PdfPage = this._document.getPage(i);
                    const annotations: PdfAnnotationCollection = page.annotations;
                    for (let j: number = 0; j < annotations.count; j++) {
                        const annotation: PdfAnnotation = annotations.at(j);
                        if (annotation && (!this._annotationTypes ||
                            this._annotationTypes.length === 0 ||
                            (this._annotationTypes && this._annotationTypes.length > 0 && this._checkAnnotationType(annotation)))) {
                            this._exportAnnotationData(annotation, writer, i);
                        }
                    }
                }
            }
            writer._writeEndElement();
        } else {
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
        }
        if (!this._asPerSpecification) {
            writer._writeStartElement('f');
            writer._writeAttributeString('href', this._fileName);
        }
        const result: Uint8Array = writer._save();
        writer._destroy();
        return result;
    }
    _writeFormFieldData(writer: _XmlWriter, isAcrobat: boolean = false): void {
        if (isAcrobat) {
            writer._writeStartElement('f');
            writer._writeAttributeString('href', this._fileName);
            writer._writeEndElement();
            const elements: Map<any, any> = this._getElements(this._table); // eslint-disable-line
            if (elements && elements.size > 0) {
                writer._writeStartElement('fields');
                let flag: boolean = false;
                elements.forEach((value: any, key: any) => { // eslint-disable-line
                    writer._writeStartElement('field');
                    writer._writeAttributeString('name', key.toString());
                    if (Array.isArray(value)) {
                        value.forEach((item: any) => { // eslint-disable-line
                            writer._writeStartElement('value');
                            writer._writeString(item.toString());
                            writer._writeEndElement();
                            flag = true;
                        });
                    }
                    if (value instanceof Map) {
                        this._writeFieldName(value, writer);
                    } else if (!flag && !value.toString().endsWith(this._formKey) || (!flag && this._formKey === '')) {
                        writer._writeStartElement('value');
                        writer._writeString(value.toString());
                        writer._writeEndElement();
                    } else if (this._formKey !== '' && value.toString().endsWith(this._formKey)) {
                        writer._writeStartElement('value-richtext');
                        let text: string = value.toString();
                        if (text.startsWith('<?xml version="1.0"?>')) {
                            text = text.substring(21);
                        }
                        const start: number = text.length - this._formKey.length;
                        text = text.substring(0, start) + text.substring(start + this._formKey.length);
                        writer._writeRaw(text);
                        writer._writeEndElement();
                    }
                    writer._writeEndElement();
                    flag = false;
                });
                writer._writeEndElement();
            }
            writer._writeStartElement('ids');
            let hasId: boolean = false;
            if (this._crossReference._root.has('ID')) {
                const id: string[] = this._crossReference._root.getArray('ID');
                if (id && id.length >= 1) {
                    writer._writeAttributeString('original', id[0]);
                    writer._writeAttributeString('modified', id[1]);
                    hasId = true;
                }
            }
            if (!hasId) {
                writer._writeAttributeString('original', '');
                writer._writeAttributeString('modified', '');
            }
            writer._writeEndElement();
        } else {
            writer._writeStartElement('fields');
            this._table.forEach((value: any, key: any) => { // eslint-disable-line
                writer._writeStartElement('field');
                writer._writeAttributeString('name', key.toString());
                if (Array.isArray(value)) {
                    value.forEach((item: any) => { // eslint-disable-line
                        writer._writeStartElement('value');
                        writer._writeString(item.toString());
                        writer._writeEndElement();
                    });
                } else {
                    writer._writeStartElement('value');
                    writer._writeString(value.toString());
                    writer._writeEndElement();
                }
                writer._writeEndElement();
            });
            writer._writeEndElement();
        }
    }
    _writeFieldName(value: Map<any, any>, writer: _XmlWriter): void { // eslint-disable-line
        value.forEach((value: any, key: any) => { // eslint-disable-line
            if (value instanceof Map) {
                writer._writeStartElement('field');
                writer._writeAttributeString('name', key.toString());
                this._writeFieldName(value, writer);
                writer._writeEndElement();
            } else {
                writer._writeStartElement('field');
                writer._writeAttributeString('name', key.toString());
                if (Array.isArray(value)) {
                    value.forEach((item: any) => { // eslint-disable-line
                        writer._writeStartElement('value');
                        writer._writeString(item.toString());
                        writer._writeEndElement();
                    });
                } else {
                    if (!value.toString().endsWith(this._formKey) || this._formKey === '') {
                        writer._writeStartElement('value');
                        writer._writeString(value.toString());
                    } else {
                        writer._writeStartElement('value-richtext');
                        let text: string = value.toString();
                        if (text.startsWith('<?xml version="1.0"?>')) {
                            text = text.substring(21);
                        }
                        const start: number = text.length - this._formKey.length;
                        text = text.substring(0, start) + text.substring(start + this._formKey.length);
                        writer._writeRaw(text);
                    }
                    writer._writeEndElement();
                }
                writer._writeEndElement();
            }
        });
    }
    _getElements(table: Map<any, any>): Map<any, any> { // eslint-disable-line
        const elements: Map<any, any> = new Map<any, any>(); // eslint-disable-line
        table.forEach((value: any, key: any) => { // eslint-disable-line
            let parentElements: any = elements; // eslint-disable-line
            if (key.toString().indexOf('.') !== -1) {
                const values: string[] = key.toString().split('.');
                for (let i: number = 0; i < values.length; i++) {
                    const element: string = values[Number.parseInt(i.toString(), 10)];
                    if (parentElements.has(element)) {
                        this._getElements(parentElements[element]); // eslint-disable-line
                        parentElements = parentElements[element]; // eslint-disable-line
                    } else {
                        if (i === values.length - 1) {
                            parentElements.set(element, value);
                        } else {
                            const newTable: Map<any, any> = new Map<any, any>(); // eslint-disable-line
                            parentElements.set(element, newTable);
                            parentElements = newTable;
                        }
                    }
                }
            } else {
                parentElements.set(key, value);
            }
        });
        return elements;
    }
    _checkAnnotationType(annotation: PdfAnnotation): boolean {
        return (typeof annotation._type !== 'undefined' && this._annotationTypes.indexOf(annotation._type) !== -1);
    }
    _exportAnnotationData(annotation: PdfAnnotation, writer: _XmlWriter, pageIndex: number): void {
        if (annotation._dictionary &&
            !(annotation instanceof PdfFileLinkAnnotation ||
            annotation instanceof PdfTextWebLinkAnnotation ||
            annotation instanceof PdfDocumentLinkAnnotation ||
            annotation instanceof PdfUriAnnotation)) {
            this._writeAnnotationData(writer, pageIndex, annotation);
        }
    }
    _writeAnnotationData(writer: _XmlWriter, pageIndex: number, annotation: PdfAnnotation): void
    _writeAnnotationData(writer: _XmlWriter, pageIndex: number, dictionary: _PdfDictionary): void
    _writeAnnotationData(writer: _XmlWriter, pageIndex: number, source: PdfAnnotation | _PdfDictionary): void {
        let hasAppearance: boolean = false;
        let annotation: PdfAnnotation;
        let dictionary: _PdfDictionary;
        if (source instanceof PdfAnnotation) {
            annotation = source;
            dictionary = source._dictionary;
        } else {
            dictionary = source;
        }
        const type: string = this._getAnnotationType(dictionary);
        this._skipBorderStyle = false;
        if (type && type !== '') {
            if (!this._annotationAttributes) {
                this._annotationAttributes = [];
            }
            writer._writeStartElement(type.toLowerCase());
            writer._writeAttributeString('page', pageIndex.toString());
            let lineAnnotation: PdfLineAnnotation;
            let points: number[];
            switch (type) {
            case 'Line':
                lineAnnotation = annotation as PdfLineAnnotation;
                points = lineAnnotation.linePoints;
                writer._writeAttributeString('start', points[0].toString() + ',' + points[1].toString());
                writer._writeAttributeString('end', points[2].toString() + ',' + points[3].toString());
                break;
            case 'Stamp':
                hasAppearance = true;
                break;
            case 'Square':
                hasAppearance = true;
                break;
            }
            if (dictionary && dictionary.has('BE') && dictionary.has('BS')) {
                const borderEffect: _PdfDictionary = dictionary.get('BE');
                if (borderEffect && borderEffect.has('S')) {
                    this._skipBorderStyle = true;
                }
            }
            this._writeDictionary(dictionary, pageIndex, writer, hasAppearance);
            writer._writeEndElement();
            this._annotationAttributes = [];
        }
    }
    _writeDictionary(dictionary: _PdfDictionary, pageIndex: number, writer: _XmlWriter, hasAppearance: boolean): void {
        let isBorderStyle: boolean = false;
        if (dictionary.has('Type')) {
            const type: _PdfName = dictionary.get('Type');
            isBorderStyle = (type && type.name === 'Border' && this._skipBorderStyle);
        }
        dictionary.forEach((key: string, value: any) => { // eslint-disable-line
            if (!((!hasAppearance && key === 'AP') || key === 'P' || key === 'Parent')) {
                let entry: any; // eslint-disable-line
                if (value instanceof _PdfReference) {
                    entry = dictionary.get(key);
                }
                if (entry && entry instanceof _PdfDictionary) {
                    switch (key) {
                    case 'BS':
                        this._writeDictionary(entry, pageIndex, writer, false);
                        break;
                    case 'BE':
                        this._writeDictionary(entry, pageIndex, writer, false);
                        break;
                    case 'IRT':
                        if (entry.has('NM')) {
                            writer._writeAttributeString('inreplyto', this._getValue(entry.get('NM')));
                        }
                        break;
                    }
                } else if (value instanceof _PdfDictionary) {
                    this._writeDictionary(value, pageIndex, writer, false);
                } else if ((!isBorderStyle) || (isBorderStyle && key !== 'S')) {
                    this._writeAttribute(writer, key, value);
                }
            }
        });
        if ((this.exportAppearance || hasAppearance) && dictionary.has('AP')) {
            const stream: Uint8Array = this._getAppearanceString(dictionary.get('AP'));
            if (stream && stream.length > 0) {
                writer._writeStartElement('appearance');
                writer._writeRaw(_encode(stream));
                writer._writeEndElement();
            }
        }
        if (dictionary.has('Measure')) {
            this._exportMeasureDictionary(dictionary.get('Measure'), writer);
        }
        if (dictionary.has('Sound')) {
            const sound: _PdfBaseStream = dictionary.get('Sound');
            if (sound && sound.dictionary) {
                const soundDictionary: _PdfDictionary = sound.dictionary;
                if (soundDictionary.has('B')) {
                    writer._writeAttributeString('bits', this._getValue(soundDictionary.get('B')));
                }
                if (soundDictionary.has('C')) {
                    writer._writeAttributeString('channels', this._getValue(soundDictionary.get('C')));
                }
                if (soundDictionary.has('E')) {
                    writer._writeAttributeString('encoding', this._getValue(soundDictionary.get('E')));
                }
                if (soundDictionary.has('R')) {
                    writer._writeAttributeString('rate', this._getValue(soundDictionary.get('R')));
                }
                if (soundDictionary.has('Length') && soundDictionary.get('Length') > 0) {
                    const data: string = _byteArrayToHexString(sound.getBytes());
                    if (data && data !== '') {
                        writer._writeStartElement('data');
                        writer._writeAttributeString('MODE', 'raw');
                        writer._writeAttributeString('encoding', 'hex');
                        if (soundDictionary.has('Length')) {
                            writer._writeAttributeString('length', this._getValue(soundDictionary.get('Length')));
                        }
                        if (soundDictionary.has('Filter')) {
                            writer._writeAttributeString('filter', this._getValue(soundDictionary.get('Filter')));
                        }
                        writer._writeRaw(data);
                        writer._writeEndElement();
                    }
                }
            }
        } else if (dictionary.has('FS')) {
            const fsDictionary: _PdfDictionary = dictionary.get('FS');
            if (fsDictionary) {
                if (fsDictionary.has('F')) {
                    writer._writeAttributeString('file', this._getValue(fsDictionary.get('F')));
                }
                if (fsDictionary.has('EF')) {
                    const efDictionary: _PdfDictionary = fsDictionary.get('EF');
                    if (efDictionary && efDictionary.has('F')) {
                        const fStream: _PdfBaseStream = efDictionary.get('F');
                        if (fStream && fStream.dictionary) {
                            const fDictionary: _PdfDictionary = fStream.dictionary;
                            if (fDictionary.has('Params')) {
                                const paramsDictionary: _PdfDictionary = fDictionary.get('Params');
                                if (paramsDictionary) {
                                    if (paramsDictionary.has('CreationDate')) {
                                        const value: string = this._getValue(paramsDictionary.get('CreationDate'));
                                        writer._writeAttributeString('creation', value);
                                    }
                                    if (paramsDictionary.has('ModificationDate')) {
                                        const value: string = this._getValue(paramsDictionary.get('ModificationDate'));
                                        writer._writeAttributeString('modification', value);
                                    }
                                    if (paramsDictionary.has('Size')) {
                                        writer._writeAttributeString('size', this._getValue(paramsDictionary.get('Size')));
                                    }
                                    if (paramsDictionary.has('CheckSum')) {
                                        const value: string = this._getValue(paramsDictionary.get('CheckSum'));
                                        const checksum: Uint8Array = _stringToBytes(value) as Uint8Array;
                                        const hexString: string = _byteArrayToHexString(checksum);
                                        writer._writeAttributeString('checksum', hexString);
                                    }
                                }
                            }
                            const data: string = _byteArrayToHexString(fStream.getBytes());
                            if (data && data !== '') {
                                writer._writeStartElement('data');
                                writer._writeAttributeString('MODE', 'raw');
                                writer._writeAttributeString('encoding', 'hex');
                                if (fDictionary.has('Length')) {
                                    writer._writeAttributeString('length', this._getValue(fDictionary.get('Length')));
                                }
                                if (fDictionary.has('Filter')) {
                                    writer._writeAttributeString('filter', this._getValue(fDictionary.get('Filter')));
                                }
                                writer._writeRaw(data);
                                writer._writeEndElement();
                            }
                        }
                    }
                }
            }
        }
        if (dictionary.has('Vertices')) {
            writer._writeStartElement('vertices');
            const vertices: number[] = dictionary.getArray('Vertices');
            if (vertices && vertices.length > 0) {
                const elementCount: number = vertices.length;
                if (elementCount % 2 === 0) {
                    let value: string = '';
                    for (let i: number = 0; i < elementCount - 1; i++) {
                        value += this._getValue(vertices[Number.parseInt(i.toString(), 10)]) + (i % 2 !== 0 ? ';' : ',');
                    }
                    value += this._getValue(vertices[elementCount - 1]);
                    if (value && value !== '') {
                        writer._writeRaw(value);
                    }
                }
            }
            writer._writeEndElement();
        }
        if (dictionary.has('Popup')) {
            const popup: _PdfDictionary = dictionary.get('Popup');
            if (popup) {
                this._writeAnnotationData(writer, pageIndex, popup);
            }
        }
        if (dictionary.has('DA')) {
            const defaultAppearance: string = dictionary.get('DA');
            if (defaultAppearance) {
                this._writeRawData(writer, 'defaultappearance', defaultAppearance);
            }
        }
        if (dictionary.has('DS')) {
            const defaultStyle: string = dictionary.get('DS');
            if (defaultStyle) {
                this._writeRawData(writer, 'defaultstyle', defaultStyle);
            }
        }
        if (dictionary.has('InkList')) {
            const inkList: Array<number[]> = dictionary.getArray('InkList');
            if (inkList && inkList.length > 0) {
                writer._writeStartElement('inklist');
                for (let j: number = 0; j < inkList.length; j++) {
                    writer._writeElementString('gesture', this._getValue(inkList[Number.parseInt(j.toString(), 10)]));
                }
                writer._writeEndElement();
            }
        }
        if (dictionary.has('RC')) {
            let value: string = dictionary.get('RC');
            if (value && value !== '') {
                const index: number = value.indexOf('<body');
                if (index > 0) {
                    value = value.substring(index);
                }
                this._writeRawData(writer, 'contents-richtext', value);
            }
        }
        if (dictionary.has('Contents')) {
            const value: string = dictionary.get('Contents');
            if (value && value.length > 0) {
                writer._writeStartElement('contents');
                writer._writeString(value);
                writer._writeEndElement();
            }
        }
    }
    _getAppearanceString(appearance: _PdfDictionary): Uint8Array {
        const textWriter: _XmlWriter = new _XmlWriter(true);
        textWriter._writeStartElement('DICT');
        textWriter._writeAttributeString('KEY', 'AP');
        this._writeAppearanceDictionary(textWriter, appearance);
        textWriter._writeEndElement();
        const buffer: Uint8Array = textWriter.buffer;
        textWriter._destroy();
        return buffer;
    }
    _writeAppearanceDictionary(writer: _XmlWriter, dictionary: _PdfDictionary): void {
        if (dictionary && dictionary.size > 0) {
            dictionary.forEach((key: string, value: any) => { // eslint-disable-line
                this._writeObject(writer, value instanceof _PdfReference ? dictionary.get(key) : value, dictionary, key);
            });
        }
    }
    _writeObject(writer: _XmlWriter, primitive: any, dictionary: _PdfDictionary, key?: string): void { // eslint-disable-line
        if (primitive !== null && typeof primitive !== 'undefined') {
            if (primitive instanceof _PdfName) {
                this._writePrefix(writer, 'NAME', key);
                writer._writeAttributeString('VAL', primitive.name);
                writer._writeEndElement();
            } else if (Array.isArray(primitive)) {
                this._writePrefix(writer, 'ARRAY', key);
                if (dictionary.has(key)) {
                    this._writeArray(writer, dictionary.getArray(key), dictionary);
                } else {
                    this._writeArray(writer, primitive, dictionary);
                }
                writer._writeEndElement();
            } else if (typeof primitive === 'string') {
                this._writePrefix(writer, 'STRING', key);
                writer._writeAttributeString('VAL', primitive);
                writer._writeEndElement();
            } else if (typeof primitive === 'number') {
                if (Number.isInteger(primitive)) {
                    this._writePrefix(writer, 'INT', key);
                    writer._writeAttributeString('VAL', primitive.toString());
                } else {
                    this._writePrefix(writer, 'FIXED', key);
                    writer._writeAttributeString('VAL', primitive.toFixed(6));
                }
                writer._writeEndElement();
            } else if (typeof primitive === 'boolean') {
                this._writePrefix(writer, 'BOOL', key);
                writer._writeAttributeString('VAL', primitive ? 'true' : 'false');
                writer._writeEndElement();
            } else if (primitive instanceof _PdfDictionary) {
                this._writePrefix(writer, 'DICT', key);
                this._writeAppearanceDictionary(writer, primitive);
                writer._writeEndElement();
            } else if (primitive === null) {
                this._writePrefix(writer, 'NULL', key);
                writer._writeEndElement();
            } else if (primitive instanceof _PdfBaseStream && primitive.dictionary) {
                const streamDictionary: _PdfDictionary = primitive.dictionary;
                this._writePrefix(writer, 'STREAM', key);
                writer._writeAttributeString('DEFINE', '');
                if ((streamDictionary.has('Subtype') &&
                    this._getValue(streamDictionary.get('Subtype')) === 'Image') ||
                    (!streamDictionary.has('Type') && !streamDictionary.has('Subtype'))) {
                    const data: string = primitive.getString(true);
                    if (!streamDictionary.has('Length') && data && data !== '') {
                        streamDictionary.update('Length', primitive.length);
                    }
                    this._writeAppearanceDictionary(writer, streamDictionary);
                    writer._writeStartElement('DATA');
                    writer._writeAttributeString('MODE', 'RAW');
                    writer._writeAttributeString('ENCODING', 'HEX');
                    if (data && data !== '') {
                        writer._writeRaw(data);
                    }
                } else {
                    let data: string = primitive.getString();
                    if (!streamDictionary.has('Length') && data && data !== '') {
                        streamDictionary.update('Length', primitive.length);
                    }
                    data = data.replace(/</g, '&lt;');
                    data = data.replace(/>/g, '&gt;');
                    this._writeAppearanceDictionary(writer, streamDictionary);
                    writer._writeStartElement('DATA');
                    writer._writeAttributeString('MODE', 'FILTERED');
                    writer._writeAttributeString('ENCODING', 'ASCII');
                    if (data && data !== '') {
                        writer._writeRaw(data);
                    }
                }
                writer._writeEndElement();
                writer._writeEndElement();
            } else if (primitive instanceof _PdfReference && this._crossReference) {
                this._writeObject(writer, this._crossReference._fetch(primitive), dictionary, key);
            }
        }
    }
    _writePrefix(writer: _XmlWriter, name: string, key?: string): void {
        writer._writeStartElement(name);
        if (key) {
            writer._writeAttributeString('KEY', key);
        }
    }
    _writeArray(writer: _XmlWriter, array: any[], dictionary: _PdfDictionary): void { // eslint-disable-line
        array.forEach((entry: any) => { // eslint-disable-line
            this._writeObject(writer, entry, dictionary);
        });
    }
    _getFormatedString(value: string, isParsing: boolean = false): string {
        if (isParsing) {
            value = value.replace('&amp;', '&');
            value = value.replace('&lt;', '<');
            value = value.replace('&gt;', '>');
        } else {
            value = value.replace('&', '&amp;');
            value = value.replace('<', '&lt;');
            value = value.replace('>', '&gt;');
        }
        return value;
    }
    _writeAttribute(writer: _XmlWriter, key: string, primitive: any): void { // eslint-disable-line
        if (this._annotationAttributes && this._annotationAttributes.indexOf(key) === -1) {
            switch (key) {
            case 'C':
                this._writeColor(writer, primitive, 'color', 'c');
                break;
            case 'IC':
                this._writeColor(writer, primitive, 'interior-color');
                break;
            case 'M':
                this._writeAttributeString(writer, 'date', primitive);
                break;
            case 'NM':
                this._writeAttributeString(writer, 'name', primitive);
                break;
            case 'Name':
                this._writeAttributeString(writer, 'icon', primitive);
                break;
            case 'Subj':
                this._writeAttributeString(writer, 'subject', primitive);
                break;
            case 'T':
                this._writeAttributeString(writer, 'title', primitive);
                break;
            case 'Rotate':
                this._writeAttributeString(writer, 'rotation', primitive);
                break;
            case 'W':
                this._writeAttributeString(writer, 'width', primitive);
                break;
            case 'LE':
                if (primitive && Array.isArray(primitive)) {
                    if (primitive.length === 2) {
                        writer._writeAttributeString('head', this._getValue(primitive[0]));
                        writer._writeAttributeString('tail', this._getValue(primitive[1]));
                    }
                } else if (primitive instanceof _PdfName) {
                    this._writeAttributeString(writer, 'head', primitive);
                }
                break;
            case 'S':
                if (this._annotationAttributes.indexOf('style') === -1) {
                    switch (this._getValue(primitive)) {
                    case 'D':
                        writer._writeAttributeString('style', 'dash');
                        break;
                    case 'C':
                        writer._writeAttributeString('style', 'cloudy');
                        break;
                    case 'S':
                        writer._writeAttributeString('style', 'solid');
                        break;
                    case 'B':
                        writer._writeAttributeString('style', 'bevelled');
                        break;
                    case 'I':
                        writer._writeAttributeString('style', 'inset');
                        break;
                    case 'U':
                        writer._writeAttributeString('style', 'underline');
                        break;
                    }
                    this._annotationAttributes.push('style');
                }
                break;
            case 'D':
                this._writeAttributeString(writer, 'dashes', primitive);
                break;
            case 'I':
                this._writeAttributeString(writer, 'intensity', primitive);
                break;
            case 'RD':
                this._writeAttributeString(writer, 'fringe', primitive);
                break;
            case 'IT':
                this._writeAttributeString(writer, 'IT', primitive);
                break;
            case 'RT':
                this._writeAttributeString(writer, 'replyType', primitive, true);
                break;
            case 'LL':
                this._writeAttributeString(writer, 'leaderLength', primitive);
                break;
            case 'LLE':
                this._writeAttributeString(writer, 'leaderExtend', primitive);
                break;
            case 'Cap':
                this._writeAttributeString(writer, 'caption', primitive);
                break;
            case 'Q':
                this._writeAttributeString(writer, 'justification', primitive);
                break;
            case 'CP':
                this._writeAttributeString(writer, 'caption-style', primitive);
                break;
            case 'CL':
                this._writeAttributeString(writer, 'callout', primitive);
                break;
            case 'QuadPoints':
                this._writeAttributeString(writer, 'coords', primitive);
                break;
            case 'CA':
                this._writeAttributeString(writer, 'opacity', primitive);
                break;
            case 'F':
                if (typeof primitive === 'number' && this._annotationAttributes.indexOf('flags') === -1) {
                    const flag: string = _annotationFlagsToString(primitive);
                    writer._writeAttributeString('flags', flag);
                    this._annotationAttributes.push('flags');
                }
                break;
            case 'InkList':
            case 'Type':
            case 'Subtype':
            case 'P':
            case 'Parent':
            case 'L':
            case 'Contents':
            case 'RC':
            case 'DA':
            case 'DS':
            case 'FS':
            case 'MeasurementTypes':
            case 'Vertices':
            case 'GroupNesting':
            case 'ITEx':
            case 'TextMarkupContent':
                break;
            default:
                this._writeAttributeString(writer, key.toLowerCase(), primitive);
                break;
            }
        }
    }
    _writeAttributeString(writer: _XmlWriter, attribute: string, primitive: any, isLowerCase: boolean = false): void { // eslint-disable-line
        if (this._annotationAttributes.indexOf(attribute) === -1) {
            const value: string = this._getValue(primitive);
            writer._writeAttributeString(attribute, isLowerCase ? value.toLowerCase() : value);
            this._annotationAttributes.push(attribute);
        }
    }
    _writeRawData(writer: _XmlWriter, name: string, value: string): void {
        if (value && value !== '') {
            writer._writeStartElement(name);
            writer._writeRaw(value);
            writer._writeEndElement();
        }
    }
    _writeColor(writer: _XmlWriter, primitive: any, attribute: string, tag?: string): void { // eslint-disable-line
        const color: string = this._getColor(primitive);
        if (typeof primitive === 'number' && tag) {
            const c: string = this._getValue(primitive);
            if (c && c !== '' && this._annotationAttributes.indexOf(tag) === -1) {
                writer._writeAttributeString(tag, c);
                this._annotationAttributes.push(tag);
            }
        }
        if (color && color !== '' && this._annotationAttributes.indexOf(attribute) === -1) {
            writer._writeAttributeString(attribute, color);
            this._annotationAttributes.push(attribute);
        }
    }
    _exportMeasureDictionary(dictionary: _PdfDictionary, writer: _XmlWriter): void {
        writer._writeStartElement('measure');
        if (dictionary) {
            if (dictionary.has('R')) {
                writer._writeAttributeString('rateValue', this._getValue(dictionary.get('R')));
            }
            if (dictionary.has('A')) {
                const array: _PdfDictionary[] = dictionary.getArray('A');
                writer._writeStartElement('area');
                this._exportMeasureFormatDetails(array[0], writer);
                writer._writeEndElement();
            }
            if (dictionary.has('D')) {
                const array: _PdfDictionary[] = dictionary.getArray('D');
                writer._writeStartElement('distance');
                this._exportMeasureFormatDetails(array[0], writer);
                writer._writeEndElement();
            }
            if (dictionary.has('X')) {
                const array: _PdfDictionary[] = dictionary.getArray('X');
                writer._writeStartElement('xformat');
                this._exportMeasureFormatDetails(array[0], writer);
                writer._writeEndElement();
            }
        }
        writer._writeEndElement();
    }
    _exportMeasureFormatDetails(measurementDetails: _PdfDictionary, writer: _XmlWriter): void {
        if (measurementDetails.has('C')) {
            writer._writeAttributeString('c', this._getValue(measurementDetails.get('C')));
        }
        if (measurementDetails.has('F')) {
            writer._writeAttributeString('f', this._getValue(measurementDetails.get('F')));
        }
        if (measurementDetails.has('D')) {
            writer._writeAttributeString('d', this._getValue(measurementDetails.get('D')));
        }
        if (measurementDetails.has('RD')) {
            writer._writeAttributeString('rd', this._getValue(measurementDetails.get('RD')));
        }
        if (measurementDetails.has('U')) {
            writer._writeAttributeString('u', this._getValue(measurementDetails.get('U')));
        }
        if (measurementDetails.has('RT')) {
            writer._writeAttributeString('rt', this._getValue(measurementDetails.get('RT')));
        }
        if (measurementDetails.has('SS')) {
            writer._writeAttributeString('ss', this._getValue(measurementDetails.get('SS')));
        }
        if (measurementDetails.has('FD')) {
            writer._writeAttributeString('fd', this._getValue(measurementDetails.get('FD')));
        }
    }
    //#endregion Export Annotations
    //#region Import Annotations
    _importAnnotations(document: PdfDocument, data: Uint8Array): void {
        this._document = document;
        this._crossReference = document._crossReference;
        this._isAnnotationExport = false;
        const xml: string = _bytesToString(data, true);
        this._xmlDocument = (new DOMParser()).parseFromString(xml, 'text/xml');
        this._isAnnotationImport = true;
        this._readXmlData(this._xmlDocument.documentElement);
    }
    _importFormData(document: PdfDocument, data: Uint8Array): void {
        this._document = document;
        this._crossReference = document._crossReference;
        this._isAnnotationExport = false;
        this._xmlDocument = (new DOMParser()).parseFromString(_bytesToString(data, true), 'text/xml');
        this._readXmlData(this._xmlDocument.documentElement);
    }
    _readXmlData(root: HTMLElement): void {
        if (root && root.nodeType === 1) {
            this._checkXfdf(root);
            if (this._isAnnotationImport) {
                const xList: HTMLCollectionOf<Element> = root.getElementsByTagName('annots');
                if (xList && xList.length > 0) {
                    for (let i: number = 0; i < xList.length; i++) {
                        const child: Element = xList.item(i);
                        if (child && child.localName === 'annots' && child.hasChildNodes()) {
                            const childeNodes: NodeList = child.childNodes;
                            for (let j: number = 0; j < childeNodes.length; j++) {
                                const childNode: Node = childeNodes.item(j);
                                if (childNode && childNode.nodeType === 1) {
                                    const element: Element = childNode as Element;
                                    if (element && element.nodeType === 1) {
                                        this._parseAnnotationData(element);
                                    }
                                }
                            }
                        }
                    }
                }
                if (this._groupHolders.length > 0) {
                    for (let i: number = 0; i < this._groupHolders.length; i++) {
                        const dictionary: _PdfDictionary = this._groupHolders[Number.parseInt(i.toString(), 10)];
                        const inReplyTo: string = dictionary.get('IRT');
                        if (inReplyTo && inReplyTo !== '') {
                            if (this._groupReferences.has(inReplyTo)) {
                                dictionary.update('IRT', this._groupReferences.get(inReplyTo));
                            } else {
                                delete dictionary._map.IRT;
                            }
                        }
                    }
                }
                this._groupHolders = [];
                this._groupReferences = new Map<string, _PdfReference>();
            } else {
                this._parseFormData(root);
            }
        }
        this._dispose();
    }
    _checkXfdf(element: HTMLElement): void {
        if (element.nodeName !== 'xfdf') {
            throw new Error('Invalid XFDF file.');
        }
    }
    _parseFormData(root: HTMLElement): void {
        let list: HTMLCollectionOf<Element> = root.getElementsByTagName('f');
        if (list && list.length > 0) {
            const fileNameElement: Element = list.item(0);
            if (fileNameElement && fileNameElement.localName === 'f' && fileNameElement.hasAttribute('href')) {
                const fileName: string = fileNameElement.getAttribute('href');
                if (fileName && fileName !== '') {
                    this._fileName = fileName;
                }
            }
        }
        list = root.getElementsByTagName('ids');
        if (list && list.length > 0) {
            this._asPerSpecification = true;
        }
        const child: NodeListOf<ChildNode> = root.childNodes;
        if (child && child.length > 0) {
            for (let i: number = 0; i < child.length; i++) {
                const childNode: Node = child.item(i);
                if (childNode && childNode.nodeType === 1) {
                    const element: Element = childNode as Element;
                    if (element && element.localName === 'fields' && element.hasChildNodes()) {
                        const fieldList: NodeListOf<ChildNode> = element.childNodes;
                        const elements: Element[] = [];
                        for (let j: number = 0; j < fieldList.length; j++) {
                            const field: Node = fieldList.item(j);
                            if (field && field.nodeType === 1) {
                                const filedElement: Element = field as Element;
                                if (filedElement && filedElement.localName === 'field') {
                                    elements.push(filedElement);
                                }
                            }
                        }
                        this._importFormNodes(elements);
                    }
                }
            }
        }
        this._importField();
    }
    _importFormNodes(list: Element[]): void {
        for (let i: number = 0; i < list.length; i++) {
            const child: Element = list[Number.parseInt(i.toString(), 10)];
            let fieldName: string = '';
            if (child) {
                if (child.hasAttribute('name')) {
                    fieldName = child.getAttribute('name');
                }
                if (fieldName && fieldName !== '') {
                    let values: HTMLCollectionOf<Element> = child.getElementsByTagName('value');
                    if (values && values.length > 0) {
                        let node: Element = child;
                        let textName: string = '';
                        while (node.localName !== 'fields') {
                            if (textName.length > 0) {
                                textName = '.' + textName;
                            }
                            let skip: boolean = false;
                            if (node.hasAttribute('name')) {
                                const name: string = node.getAttribute('name');
                                if (name && name !== '') {
                                    textName = name + textName;
                                    skip = true;
                                }
                            }
                            if (!skip) {
                                textName += node.localName;
                            }
                            node = node.parentElement;
                        }
                        fieldName = textName;
                        let dataValues: string[];
                        if (this._fields.has(fieldName)) {
                            dataValues = this._fields.get(fieldName);
                        } else {
                            dataValues = [];
                        }
                        for (let j: number = 0; j < values.length; j++) {
                            dataValues.push(values.item(j).textContent);
                        }
                        this._fields.set(fieldName, dataValues);
                    } else {
                        values = child.getElementsByTagName('value-richtext');
                        if (values && values.length > 0) {
                            const element: Element = values.item(0);
                            if (element) {
                                let node: Element = child;
                                let textName: string = '';
                                while (node.localName !== 'fields') {
                                    if (textName.length > 0) {
                                        textName = '.' + textName;
                                    }
                                    let skip: boolean = false;
                                    if (node.hasAttribute('name')) {
                                        const name: string = node.getAttribute('name');
                                        if (name && name !== '') {
                                            textName = name + textName;
                                            skip = true;
                                        }
                                    }
                                    if (!skip) {
                                        textName += node.localName;
                                    }
                                    node = node.parentElement;
                                }
                                fieldName = textName;
                                let richText: string = element.textContent;
                                if (element.childNodes && element.childNodes.length > 0) {
                                    const childNode: Node = element.childNodes[0];
                                    if (childNode && childNode.hasChildNodes()) {
                                        richText = '';
                                        const childNodes: NodeListOf<ChildNode> = childNode.childNodes;
                                        for (let j: number; j < childNodes.length; j++) {
                                            richText += childNodes.item(j).textContent + '\r';
                                        }
                                        if (richText.length > 0) {
                                            richText = richText.substring(0, richText.length - 1);
                                        } else {
                                            richText = element.textContent;
                                        }
                                    }
                                }
                                let dataValues: string[];
                                if (this._fields.has(fieldName)) {
                                    dataValues = this._fields.get(fieldName);
                                } else {
                                    dataValues = [];
                                }
                                for (let j: number = 0; j < values.length; j++) {
                                    dataValues.push(richText);
                                }
                                this._fields.set(fieldName, dataValues);
                                if (!this._richTextValues.has(fieldName)) {
                                    this._richTextValues.set(fieldName, element.innerHTML);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    _parseAnnotationData(element: Element): void {
        if (element) {
            let pageIndex: number = -1;
            if (element.hasAttributes && element.hasAttribute('page')) {
                pageIndex = Number.parseInt(element.getAttribute('page'), 10);
                if (pageIndex >= 0 && pageIndex < this._document.pageCount) {
                    const page: PdfPage = this._document.getPage(pageIndex);
                    const annotationDictionary: _PdfDictionary = this._getAnnotationDictionary(page, element);
                    if (annotationDictionary && annotationDictionary.size > 0) {
                        const pageDictionary: _PdfDictionary = page._pageDictionary;
                        if (pageDictionary) {
                            const annotations: PdfAnnotationCollection = page.annotations;
                            const annotation: PdfAnnotation = annotations._parseAnnotation(annotationDictionary);
                            if (annotation) {
                                annotation._isImported = true;
                                const reference: _PdfReference = this._crossReference._getNextReference();
                                this._crossReference._cacheMap.set(reference, annotationDictionary);
                                if (annotationDictionary.has('NM') || annotationDictionary.has('IRT')) {
                                    this._addReferenceToGroup(reference, annotationDictionary);
                                }
                                annotation._ref = reference;
                                const index: number = annotations._annotations.length;
                                annotations._annotations.push(reference);
                                pageDictionary.set('Annots', annotations._annotations);
                                pageDictionary._updated = true;
                                annotations._parsedAnnotations.set(index, annotation);
                                this._handlePopup(annotations, reference, annotationDictionary, pageDictionary);
                            }
                        }
                    }
                }
            }
        }
    }
    _getAnnotationDictionary(page: PdfPage, element: Element): _PdfDictionary {
        const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
        dictionary.update('Type', _PdfName.get('Annot'));
        let isValidType: boolean = true;
        switch (element.localName.toLowerCase()) {
        case 'line':
            dictionary.update('Subtype', _PdfName.get('Line'));
            if (element.hasAttribute('start') && element.hasAttribute('end')) {
                const points: number[] = [];
                element.getAttribute('start').split(',').forEach((value: string) => {
                    points.push(Number.parseFloat(value));
                });
                element.getAttribute('end').split(',').forEach((value: string) => {
                    points.push(Number.parseFloat(value));
                });
                if (points.length === 4) {
                    dictionary.update('L', points);
                }
            }
            this._addLineEndStyle(dictionary, element);
            break;
        case 'circle':
            dictionary.update('Subtype', _PdfName.get('Circle'));
            break;
        case 'square':
            dictionary.update('Subtype', _PdfName.get('Square'));
            break;
        case 'polyline':
            dictionary.update('Subtype', _PdfName.get('PolyLine'));
            this._addLineEndStyle(dictionary, element);
            break;
        case 'polygon':
            dictionary.update('Subtype', _PdfName.get('Polygon'));
            this._addLineEndStyle(dictionary, element);
            break;
        case 'ink':
            dictionary.update('Subtype', _PdfName.get('Ink'));
            break;
        case 'popup':
            dictionary.update('Subtype', _PdfName.get('Popup'));
            break;
        case 'text':
            dictionary.update('Subtype', _PdfName.get('Text'));
            break;
        case 'freetext':
            dictionary.update('Subtype', _PdfName.get('FreeText'));
            this._addLineEndStyle(dictionary, element);
            break;
        case 'stamp':
            dictionary.update('Subtype', _PdfName.get('Stamp'));
            break;
        case 'highlight':
            dictionary.update('Subtype', _PdfName.get('Highlight'));
            break;
        case 'squiggly':
            dictionary.update('Subtype', _PdfName.get('Squiggly'));
            break;
        case 'underline':
            dictionary.update('Subtype', _PdfName.get('Underline'));
            break;
        case 'strikeout':
            dictionary.update('Subtype', _PdfName.get('StrikeOut'));
            break;
        case 'fileattachment':
            dictionary.update('Subtype', _PdfName.get('FileAttachment'));
            break;
        case 'sound':
            dictionary.update('Subtype', _PdfName.get('Sound'));
            break;
        case 'caret':
            dictionary.update('Subtype', _PdfName.get('Caret'));
            break;
        case 'redact':
            dictionary.update('Subtype', _PdfName.get('Redact'));
            break;
        default:
            isValidType = false;
            break;
        }
        if (isValidType) {
            this._addAnnotationData(dictionary, element, page);
        }
        return dictionary;
    }
    _addAnnotationData(dictionary: _PdfDictionary, element: Element, page: PdfPage): void {
        this._addBorderStyle(dictionary, element);
        this._applyAttributeValues(dictionary, element.attributes);
        this._parseInnerElements(dictionary, element, page);
        this._addMeasureDictionary(dictionary, element);
    }
    _addBorderStyle(dictionary: _PdfDictionary, element: Element): void {
        const borderEffectDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
        const borderStyleDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
        if (element.hasAttribute('width')) {
            borderStyleDictionary.update('W', Number.parseFloat(element.getAttribute('width')));
        }
        let isBasicStyle: boolean = true;
        if (element.hasAttribute('style')) {
            let style: string = '';
            switch (element.getAttribute('style')) {
            case 'dash':
                style = 'D';
                break;
            case 'solid':
                style = 'S';
                break;
            case 'bevelled':
                style = 'B';
                break;
            case 'inset':
                style = 'I';
                break;
            case 'underline':
                style = 'U';
                break;
            case 'cloudy':
                style = 'C';
                isBasicStyle = false;
                break;
            }
            if (style !== '') {
                (isBasicStyle ? borderStyleDictionary : borderEffectDictionary).update('S', _PdfName.get(style));
                if (!isBasicStyle && element.hasAttribute('intensity')) {
                    borderEffectDictionary.update('I', Number.parseFloat(element.getAttribute('intensity')));
                } else if (element.hasAttribute('dashes')) {
                    const dashes: number[] = [];
                    element.getAttribute('dashes').split(',').forEach((value: string) => {
                        dashes.push(Number.parseFloat(value));
                    });
                    borderStyleDictionary.update('D', dashes);
                }
            }
        }
        if (borderEffectDictionary.size > 0) {
            dictionary.update('BE', borderEffectDictionary);
        }
        if (borderStyleDictionary.size > 0) {
            borderStyleDictionary.update('Type', 'Border');
            dictionary.update('BS', borderStyleDictionary);
        }
    }
    _applyAttributeValues(dictionary: _PdfDictionary, attributes: NamedNodeMap): void {
        for (let i: number = 0; i < attributes.length; i++) {
            const attribute: Attr = attributes[Number.parseInt(i.toString(), 10)];
            const value: string = attribute.value;
            let values: number[];
            let leaderExtend : number;
            switch (attribute.name.toLowerCase()) {
            case 'page':
            case 'start':
            case 'end':
            case 'width':
            case 'head':
            case 'tail':
            case 'style':
            case 'intensity':
            case 'itex':
                break;
            case 'state':
                this._addString(dictionary, 'State', value);
                break;
            case 'statemodel':
                this._addString(dictionary, 'StateModel', value);
                break;
            case 'replytype':
                if (value === 'group') {
                    dictionary.update('RT', _PdfName.get('Group'));
                }
                break;
            case 'inreplyto':
                this._addString(dictionary, 'IRT', value);
                break;
            case 'rect':
                values = this._obtainPoints(value);
                if (values && values.length === 4) {
                    dictionary.update('Rect', values);
                }
                break;
            case 'color':
                values = _convertToColor(value);
                if (values && values.length === 3) {
                    dictionary.update('C', [values[0] / 255, values[1] / 255, values[2] / 255]);
                }
                break;
            case 'interior-color':
                values = _convertToColor(value);
                if (values && values.length === 3) {
                    dictionary.update('IC', [values[0] / 255, values[1] / 255, values[2] / 255]);
                }
                break;
            case 'date':
                this._addString(dictionary, 'M', value);
                break;
            case 'creationdate':
                this._addString(dictionary, 'CreationDate', value);
                break;
            case 'name':
                this._addString(dictionary, 'NM', value);
                break;
            case 'icon':
                if (value && value !== '') {
                    dictionary.update('Name', _PdfName.get(value));
                }
                break;
            case 'subject':
                this._addString(dictionary, 'Subj', this._getFormatedString(value, true));
                break;
            case 'title':
                this._addString(dictionary, 'T', this._getFormatedString(value, true));
                break;
            case 'rotation':
                this._addInt(dictionary, 'Rotate', value);
                break;
            case 'justification':
                this._addInt(dictionary, 'Q', value);
                break;
            case 'fringe':
                this._addFloatPoints(dictionary, this._obtainPoints(value), 'RD');
                break;
            case 'it':
                if (value && value !== '') {
                    dictionary.update('IT', _PdfName.get(value));
                }
                break;
            case 'leaderlength':
                this._addFloat(dictionary, 'LL', value);
                break;
            case 'leaderextend':
                leaderExtend = Number.parseFloat(value);
                if (typeof leaderExtend !== 'undefined') {
                    dictionary.update('LLE', leaderExtend);
                }
                break;
            case 'caption':
                if (value && value !== '') {
                    dictionary.update('Cap', value.toLowerCase() === 'yes' ? true : false);
                }
                break;
            case 'caption-style':
                if (value && value !== '') {
                    dictionary.update('CP', _PdfName.get(value));
                }
                break;
            case 'callout':
                this._addFloatPoints(dictionary, this._obtainPoints(value), 'CL');
                break;
            case 'coords':
                this._addFloatPoints(dictionary, this._obtainPoints(value), 'QuadPoints');
                break;
            case 'border':
                this._addFloatPoints(dictionary, this._obtainPoints(value), 'Border');
                break;
            case 'opacity':
                this._addFloat(dictionary, 'CA', value);
                break;
            case 'flags':
                if (value && value !== '') {
                    let annotFlag: PdfAnnotationFlag = PdfAnnotationFlag.default;
                    const flags: string[] = value.split(',');
                    for (let i: number = 0; i < flags.length; i++) {
                        const flagType: PdfAnnotationFlag = _stringToAnnotationFlags(flags[Number.parseInt(i.toString(), 10)]);
                        if (i === 0) {
                            annotFlag = flagType;
                        } else {
                            annotFlag |= flagType;
                        }
                    }
                    dictionary.update('F', annotFlag);
                }
                break;
            case 'open':
                if (value && value !== '') {
                    dictionary.update('Open', (value === 'true' || value === 'yes') ? true : false);
                }
                break;
            case 'calibrate':
                this._addString(dictionary, 'Calibrate', value);
                break;
            case 'customdata':
                this._addString(dictionary, 'CustomData', value);
                break;
            case 'overlaytext':
                dictionary.update('OverlayText', value);
                break;
            case 'repeat':
                dictionary.update('Repeat', (value === 'true' || value === 'yes') ? true : false);
                break;
            default:
                if (this._document._allowImportCustomData) {
                    this._addString(dictionary, attribute.name, value);
                }
                break;
            }
        }
    }
    _obtainPoints(value: string): number[] {
        const points: number[] = [];
        value.split(',').forEach((value: string) => {
            points.push(Number.parseFloat(value));
        });
        return points;
    }
    _parseInnerElements(dictionary: _PdfDictionary, element: Element, page: PdfPage): void {
        if (element.hasChildNodes) {
            const children: NodeList = element.childNodes;
            for (let index: number = 0; index < children.length; index++) {
                const child: Node = children[Number.parseInt(index.toString(), 10)];
                if (child.nodeType === 1) {
                    const childElement: Element = child as Element;
                    const textContent: string = child.textContent;
                    const innerHTML: string = childElement.innerHTML;
                    switch (child.nodeName.toLowerCase()) {
                    case 'popup':
                        if (childElement && childElement.hasAttributes) {
                            const popupDictionary: _PdfDictionary = this._getAnnotationDictionary(page, childElement);
                            if (popupDictionary.size > 0) {
                                const reference: _PdfReference = this._crossReference._getNextReference();
                                this._crossReference._cacheMap.set(reference, popupDictionary);
                                dictionary.update('Popup', reference);
                                if (popupDictionary.has('NM')) {
                                    this._addReferenceToGroup(reference, popupDictionary);
                                }
                            }
                        }
                        break;
                    case 'contents':
                        if (textContent && textContent !== '') {
                            dictionary.update('Contents', this._getFormatedString(textContent, true));
                        }
                        break;
                    case 'contents-richtext':
                        if (innerHTML && innerHTML !== '') {
                            dictionary.update('RC', this._richTextPrefix + innerHTML);
                        }
                        break;
                    case 'defaultstyle':
                        this._addString(dictionary, 'DS', textContent);
                        break;
                    case 'defaultappearance':
                        this._addString(dictionary, 'DA', textContent);
                        break;
                    case 'vertices':
                        if (textContent && textContent !== '') {
                            const vertices: string[] = [];
                            textContent.split(',').forEach((value: string) => {
                                if (value.indexOf(';') !== -1) {
                                    value.split(';').forEach((innerValue: string) => {
                                        vertices.push(innerValue);
                                    });
                                } else {
                                    vertices.push(value);
                                }
                            });
                            if (vertices.length > 0) {
                                const verticesArray: number[] = [];
                                vertices.forEach((value: string) => {
                                    verticesArray.push(Number.parseFloat(value));
                                });
                                dictionary.update('Vertices', verticesArray);
                            }
                        }
                        break;
                    case 'appearance':
                        this._addAppearanceData(child, dictionary);
                        break;
                    case 'inklist':
                        if (child.hasChildNodes) {
                            const inkListCollection: Array<number[]> = [];
                            const childNodes: NodeList = child.childNodes;
                            for (let i: number = 0; i < childNodes.length; i++) {
                                const inkChild: Node = childNodes[Number.parseInt(i.toString(), 10)];
                                if (inkChild && inkChild.nodeType === 1) {
                                    const inkChildElement: Element = inkChild as Element;
                                    if (inkChildElement.nodeName.toLowerCase() === 'gesture') {
                                        if (inkChildElement.textContent && inkChildElement.textContent !== '') {
                                            const points: string[] = [];
                                            inkChildElement.textContent.split(',').forEach((value: string) => {
                                                if (value.indexOf(';') !== -1) {
                                                    value.split(';').forEach((innerValue: string) => {
                                                        points.push(innerValue);
                                                    });
                                                } else {
                                                    points.push(value);
                                                }
                                            });
                                            if (points.length > 0) {
                                                const pointsArray: number[] = [];
                                                points.forEach((value: string) => {
                                                    pointsArray.push(Number.parseFloat(value));
                                                });
                                                inkListCollection.push(pointsArray);
                                            }
                                        }
                                    }
                                }
                            }
                            dictionary.update('InkList', inkListCollection);
                        }
                        break;
                    case 'data':
                        this._addStreamData(child, dictionary, element);
                        break;
                    }
                }
            }
        }
    }
    _addStreamData(child: Node, dictionary: _PdfDictionary, parent: Element): void {
        if (child && child.textContent && child.textContent !== '') {
            const raw: number[] = _hexStringToByteArray(child.textContent, true) as number[];
            if (raw && raw.length > 0) {
                if (dictionary.has('Subtype')) {
                    const subtype: _PdfName = dictionary.get('Subtype');
                    if (subtype && subtype.name === 'FileAttachment') {
                        this._addFileAttachment(dictionary, parent, raw);
                    } else if (subtype && subtype.name === 'Sound') {
                        this._addSound(dictionary, parent, raw);
                    }
                }
            }
        }
    }
    _addSound(dictionary: _PdfDictionary, element: Element, raw: number[]): void {
        const soundStream: _PdfContentStream = new _PdfContentStream(raw);
        soundStream.dictionary._crossReference = this._crossReference;
        soundStream.dictionary.update('Type', _PdfName.get('Sound'));
        if (element.hasAttribute('bits')) {
            this._addInt(soundStream.dictionary, 'B', element.getAttribute('bits'));
        }
        if (element.hasAttribute('rate')) {
            this._addInt(soundStream.dictionary, 'R', element.getAttribute('rate'));
        }
        if (element.hasAttribute('channels')) {
            this._addInt(soundStream.dictionary, 'C', element.getAttribute('channels'));
        }
        if (element.hasAttribute('encoding')) {
            const value: string = element.getAttribute('encoding');
            if (value && value !== '') {
                soundStream.dictionary.update('E', _PdfName.get(value));
            }
        }
        if (element.hasAttribute('filter')) {
            soundStream.dictionary.update('Filter', _PdfName.get('FlateDecode'));
        }
        const soundReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(soundReference, soundStream);
        dictionary.update('Sound', soundReference);
    }
    _addFileAttachment(dictionary: _PdfDictionary, element: Element, raw: number[]): void {
        const fileDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
        fileDictionary.update('Type', _PdfName.get('Filespec'));
        if (element.hasAttribute('file')) {
            const value: string = element.getAttribute('file');
            this._addString(fileDictionary, 'F', value);
            this._addString(fileDictionary, 'UF', value);
        }
        const fileStream: _PdfContentStream = new _PdfContentStream(raw);
        fileStream.dictionary._crossReference = this._crossReference;
        const param: _PdfDictionary = new _PdfDictionary(this._crossReference);
        if (element.hasAttribute('size')) {
            const size: number = Number.parseInt(element.getAttribute('size'), 10);
            if (typeof size !== 'undefined') {
                param.update('Size', size);
                fileStream.dictionary.update('DL', size);
            }
        }
        if (element.hasAttribute('modification')) {
            this._addString(param, 'ModDate', element.getAttribute('modification'));
        }
        if (element.hasAttribute('creation')) {
            this._addString(param, 'CreationDate', element.getAttribute('creation'));
        }
        fileStream.dictionary.update('Params', param);
        if (element.hasAttribute('mimetype')) {
            this._addString(fileStream.dictionary, 'Subtype', element.getAttribute('mimetype'));
        }
        fileStream.dictionary.update('Filter', _PdfName.get('FlateDecode'));
        const embeddedFile: _PdfDictionary = new _PdfDictionary(this._crossReference);
        const reference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(reference, fileStream);
        embeddedFile.update('F', reference);
        fileDictionary.update('EF', embeddedFile);
        const fileReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(fileReference, fileDictionary);
        dictionary.update('FS', fileReference);
    }
    _addAppearanceData(element: Node, dictionary: _PdfDictionary): void {
        const innerText: string = element.textContent;
        if (innerText && innerText !== '') {
            const document: Document = (new DOMParser()).parseFromString(atob(innerText), 'text/xml');
            if (document && document.hasChildNodes) {
                let childNodes: NodeList = document.childNodes;
                if (childNodes && childNodes.length === 1) {
                    const rootNode: Node = childNodes[0];
                    if (rootNode && rootNode.nodeType === 1) {
                        const rootElement: Element = rootNode as Element;
                        if (rootElement.nodeName.toUpperCase() === 'DICT' && rootElement.hasAttribute('KEY')) {
                            const key: string = rootElement.getAttribute('KEY');
                            if (key && key === 'AP' && rootElement.hasChildNodes) {
                                const appearance: _PdfDictionary = new _PdfDictionary(this._crossReference);
                                childNodes = rootElement.childNodes;
                                for (let i: number = 0; i < childNodes.length; i++) {
                                    this._getAppearance(appearance, childNodes[Number.parseInt(i.toString(), 10)]);
                                }
                                if (appearance.size > 0) {
                                    dictionary.update('AP', appearance);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    _getAppearance(source: _PdfDictionary | _PdfContentStream, child: Node): void {
        const appearance: _PdfDictionary = source instanceof _PdfDictionary ? source : source.dictionary;
        if (child && child.nodeType === 1) {
            const element: Element = child as Element;
            if (element && element.localName) {
                let stream: _PdfContentStream;
                let dictionary: _PdfDictionary;
                let data: number[];
                switch (element.localName) {
                case 'STREAM':
                    stream = this._getStream(element);
                    if (stream) {
                        const reference: _PdfReference = this._crossReference._getNextReference();
                        this._crossReference._cacheMap.set(reference, stream);
                        this._addKey(reference, appearance, element);
                    }
                    break;
                case 'DICT':
                    dictionary = this._getDictionary(element);
                    if (dictionary) {
                        const reference: _PdfReference = this._crossReference._getNextReference();
                        this._crossReference._cacheMap.set(reference, dictionary);
                        this._addKey(reference, appearance, element);
                    }
                    break;
                case 'ARRAY':
                    this._addKey(this._getArray(element), appearance, element);
                    break;
                case 'FIXED':
                    this._addKey(this._getFixed(element), appearance, element);
                    break;
                case 'INT':
                    this._addKey(this._getInt(element), appearance, element);
                    break;
                case 'STRING':
                    this._addKey(this._getString(element), appearance, element);
                    break;
                case 'NAME':
                    this._addKey(this._getName(element), appearance, element);
                    break;
                case 'BOOL':
                    this._addKey(this._getBoolean(element), appearance, element);
                    break;
                case 'DATA':
                    data = this._getData(element);
                    if (data && data.length > 0 && source instanceof _PdfContentStream) {
                        source._bytes = data;
                        let isImage: boolean = false;
                        if (appearance && appearance.has('Subtype')) {
                            const type: _PdfName = appearance.get('Subtype');
                            isImage = type && type.name === 'Image';
                        }
                        if (isImage) {
                            source._isCompress = false;
                        } else {
                            if (source.dictionary.has('Length')) {
                                delete source.dictionary._map.Length;
                            }
                            if (source.dictionary.has('Filter')) {
                                delete source.dictionary._map.Filter;
                            }
                        }
                    }
                    break;
                }
            }
        }
    }
    _getStream(element: Element): _PdfContentStream {
        const stream: _PdfContentStream = new _PdfContentStream([]);
        stream.dictionary._crossReference = this._crossReference;
        if (element.hasChildNodes) {
            const childNodes: NodeList = element.childNodes;
            for (let i: number = 0; i < childNodes.length; i++) {
                const child: Node = childNodes[Number.parseInt(i.toString(), 10)];
                if (child && child.nodeType === 1) {
                    this._getAppearance(stream, child);
                }
            }
        }
        return stream;
    }
    _getDictionary(element: Element): _PdfDictionary {
        const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
        if (element.hasChildNodes) {
            const childNodes: NodeList = element.childNodes;
            for (let i: number = 0; i < childNodes.length; i++) {
                const child: Node = childNodes[Number.parseInt(i.toString(), 10)];
                if (child && child.nodeType === 1) {
                    this._getAppearance(dictionary, child);
                }
            }
        }
        return dictionary;
    }
    _getArray(element: Element): any { // eslint-disable-line
        const array: any = []; // eslint-disable-line
        if (element.hasChildNodes) {
            const childNodes: NodeList = element.childNodes;
            for (let i: number = 0; i < childNodes.length; i++) {
                const child: Node = childNodes[Number.parseInt(i.toString(), 10)];
                if (child && child.nodeType === 1) {
                    this._addArrayElements(array, child);
                }
            }
        }
        return array;
    }
    _getData(element: Element): number[] {
        let data: number[] = [];
        if (element && element.textContent &&
            element.textContent !== '' &&
            element.hasAttribute('MODE') && element.hasAttribute('ENCODING')) {
            const mode: string = element.getAttribute('MODE');
            const encoding: string = element.getAttribute('ENCODING');
            if (mode && encoding) {
                const innerText: string = this._getFormatedString(element.textContent, true);
                if (mode === 'FILTERED' && encoding === 'ASCII') {
                    data = _stringToBytes(innerText, true) as number[];
                } else if (mode === 'RAW' && encoding === 'HEX') {
                    data = _hexStringToByteArray(innerText, true) as number[];
                }
            }
        }
        return data;
    }
    _addArrayElements(array: any, child: Node) { // eslint-disable-line
        if (child && child.nodeType === 1) {
            const element: Element = child as Element;
            let stream: _PdfContentStream;
            let dictionary: _PdfDictionary;
            let value: any; // eslint-disable-line
            let floatValue: number;
            let intValue: number;
            let name: _PdfName;
            let bool: boolean;
            switch (element.localName) {
            case 'STREAM':
                stream = this._getStream(element);
                if (stream) {
                    const reference: _PdfReference = this._crossReference._getNextReference();
                    stream.reference = reference;
                    this._crossReference._cacheMap.set(reference, stream);
                    array.push(reference);
                }
                break;
            case 'DICT':
                dictionary = this._getDictionary(element);
                if (dictionary) {
                    const reference: _PdfReference = this._crossReference._getNextReference();
                    this._crossReference._cacheMap.set(reference, dictionary);
                    array.push(reference);
                }
                break;
            case 'ARRAY':
                value = this._getArray(element);
                if (value) {
                    array.push(value);
                }
                break;
            case 'FIXED':
                floatValue = this._getFixed(element);
                if (typeof floatValue !== 'undefined' && !isNaN(floatValue)) {
                    array.push(floatValue);
                }
                break;
            case 'INT':
                intValue = this._getInt(element);
                if (typeof intValue !== 'undefined' && !isNaN(intValue)) {
                    array.push(intValue);
                }
                break;
            case 'NAME':
                name = this._getName(element);
                if (name) {
                    array.push(name);
                }
                break;
            case 'BOOL':
                bool  = this._getBoolean(element);
                if (typeof bool !== 'undefined' && bool !== null) {
                    array.push(bool);
                }
                break;
            }
        }
    }
    _getFixed(element: Element): number {
        let value: number;
        if (element && element.hasAttribute('VAL')) {
            value = Number.parseFloat(element.getAttribute('VAL'));
        }
        return value;
    }
    _getInt(element: Element): number {
        let value: number;
        if (element && element.hasAttribute('VAL')) {
            value = Number.parseInt(element.getAttribute('VAL'), 10);
        }
        return value;
    }
    _getString(element: Element): string {
        let value: string;
        if (element && element.hasAttribute('VAL')) {
            value = element.getAttribute('VAL');
        }
        return value;
    }
    _getName(element: Element): _PdfName {
        let value: _PdfName;
        if (element && element.hasAttribute('VAL')) {
            value = _PdfName.get(element.getAttribute('VAL'));
        }
        return value;
    }
    _getBoolean(element: Element): boolean {
        let value: boolean;
        if (element && element.hasAttribute('VAL')) {
            value = element.getAttribute('VAL') === 'true' ? true : false;
        }
        return value;
    }
    _addMeasureDictionary(dictionary: _PdfDictionary, element: Element): void {
        let measurement: Element;
        let area: Element;
        let distance: Element;
        let xformat: Element;
        if (element.hasChildNodes) {
            const childNodes: NodeList = element.childNodes;
            for (let i: number = 0; i < childNodes.length; i++) {
                const childElement: Element = childNodes[Number.parseInt(i.toString(), 10)] as Element;
                if (childElement && childElement.localName === 'measure') {
                    measurement = childElement;
                    break;
                }
            }
        }
        const measureDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
        const dDict: _PdfDictionary = new _PdfDictionary(this._crossReference);
        const aDict: _PdfDictionary = new _PdfDictionary(this._crossReference);
        const xDict: _PdfDictionary = new _PdfDictionary(this._crossReference);
        const dArray: _PdfDictionary[] = [];
        const aArray: _PdfDictionary[] = [];
        const xArray: _PdfDictionary[] = [];
        if (measurement) {
            measureDictionary.update('Type', _PdfName.get('Measure'));
            if (measurement.hasAttribute('rateValue')) {
                const attribute: string = measurement.getAttribute('rateValue');
                if (attribute && attribute !== '') {
                    measureDictionary.update('R', attribute);
                }
            }
            if (measurement.hasChildNodes) {
                const childNodes: NodeList = measurement.childNodes;
                for (let i: number = 0; i < childNodes.length; i++) {
                    const child: Node = childNodes[Number.parseInt(i.toString(), 10)];
                    if (child && child.nodeType === 1) {
                        const childElement: Element = child as Element;
                        switch (childElement.nodeName.toLowerCase()) {
                        case 'distance':
                            distance = childElement;
                            break;
                        case 'area':
                            area = childElement;
                            break;
                        case 'xformat':
                            xformat = childElement;
                            break;
                        }
                    }
                }
            }
        }
        if (xformat) {
            this._addElements(xformat, xDict);
            xArray.push(xDict);
        }
        if (distance) {
            this._addElements(distance, dDict);
            dArray.push(dDict);
        }
        if (area) {
            this._addElements(area, aDict);
            aArray.push(aDict);
        }
        measureDictionary.set('A', aArray);
        measureDictionary.set('D', dArray);
        measureDictionary.set('X', xArray);
        if (measureDictionary.size > 0 && measureDictionary.has('Type')) {
            const reference: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference, measureDictionary);
            dictionary.update('Measure', reference);
        }
    }
    _addElements(element: Element, dictionary: _PdfDictionary): void {
        if (element.hasAttribute('d')) {
            this._addFloat(dictionary, 'D', element.getAttribute('d'));
        }
        if (element.hasAttribute('c')) {
            this._addFloat(dictionary, 'C', element.getAttribute('c'));
        }
        if (element.hasAttribute('rt')) {
            dictionary.update('RT', element.getAttribute('rt'));
        }
        if (element.hasAttribute('rd')) {
            dictionary.update('RD', element.getAttribute('rt'));
        }
        if (element.hasAttribute('ss')) {
            dictionary.update('SS', element.getAttribute('ss'));
        }
        if (element.hasAttribute('u')) {
            dictionary.update('U', element.getAttribute('u'));
        }
        if (element.hasAttribute('f')) {
            dictionary.update('F', _PdfName.get(element.getAttribute('f')));
        }
        if (element.hasAttribute('fd')) {
            dictionary.update('FD', element.getAttribute('fd') === 'yes' ? true : false);
        }
    }
    _addString(dictionary: _PdfDictionary, key: string, value: string): void {
        if (value && value !== '') {
            dictionary.update(key, value);
        }
    }
    _addInt(dictionary: _PdfDictionary, key: string, value: string): void {
        const intValue: number = Number.parseInt(value, 10);
        if (typeof intValue !== 'undefined') {
            dictionary.update(key, intValue);
        }
    }
    _addFloat(dictionary: _PdfDictionary, key: string, value: string): void {
        const floatValue: number = Number.parseFloat(value);
        if (typeof floatValue !== 'undefined') {
            dictionary.update(key, floatValue);
        }
    }
    _addFloatPoints(dictionary: _PdfDictionary, points: number[], key: string): void {
        if (points && points.length > 0) {
            dictionary.update(key, points);
        }
    }
    _addKey(primitive: any, dictionary: _PdfDictionary, element: Element): void { // eslint-disable-line
        if (typeof primitive !== 'undefined' && primitive !== null && element.hasAttribute('KEY')) {
            dictionary.update(element.getAttribute('KEY'), primitive);
        }
    }
    _addLineEndStyle(dictionary: _PdfDictionary, element: Element): void {
        let beginLineStyle: string = '';
        if (element.hasAttribute('head')) {
            beginLineStyle = element.getAttribute('head');
        }
        let endLineStyle: string = '';
        if (element.hasAttribute('tail')) {
            endLineStyle = element.getAttribute('tail');
        }
        if (beginLineStyle && beginLineStyle !== '') {
            if (endLineStyle && endLineStyle !== '') {
                const lineEndingStyles: _PdfName[] = [];
                lineEndingStyles.push(_PdfName.get(beginLineStyle));
                lineEndingStyles.push(_PdfName.get(endLineStyle));
                dictionary.update('LE', lineEndingStyles);
            } else {
                dictionary.update('LE', _PdfName.get(beginLineStyle));
            }
        } else if (endLineStyle && endLineStyle !== '') {
            dictionary.update('LE', _PdfName.get(endLineStyle));
        }
    }
    //#endregion Import Annotations
}

export class _FontStructure {
    _dictionary: _PdfDictionary;
    _differencesDictionary: Map<string, string>;
    _fontType: string;
    _baseFontEncoding: string = '';
    _fontEncoding: string;
    _fontName: string;
    constructor(dictionary: _PdfDictionary) {
        this._dictionary = dictionary;
        this._fontType = this._dictionary.get('Subtype').name;
    }
    get differencesDictionary(): Map<string, string> {
        if (!this._differencesDictionary) {
            this._differencesDictionary = this._getDifferencesDictionary();
        }
        return this._differencesDictionary;
    }
    get baseFontEncoding(): string {
        return this._baseFontEncoding;
    }
    get fontEncoding(): string {
        if (!this._fontEncoding) {
            this._fontEncoding = this._getFontEncoding();
        }
        return this._fontEncoding;
    }
    get fontName(): string {
        if (!this._fontName) {
            this._fontName = this._getFontName();
        }
        return this._fontName;
    }
    _getFontEncoding(): string {
        let encoding: string = '';
        if (this._dictionary !== null && typeof this._dictionary !== 'undefined' && this._dictionary.has('Encoding')) {
            const baseFont: any = this._dictionary.get('Encoding'); // eslint-disable-line
            if (baseFont instanceof _PdfName) {
                encoding = baseFont.name;
            } else if (baseFont instanceof _PdfDictionary) {
                if (baseFont.has('BaseEncoding')) {
                    const baseFontEncoding: _PdfName = baseFont.get('BaseEncoding');
                    if (baseFontEncoding && baseFontEncoding instanceof _PdfName) {
                        this._baseFontEncoding = baseFontEncoding.name;
                    }
                }
                if (baseFont.has('Type')) {
                    const fontEncoding: _PdfName = baseFont.get('Type');
                    if (fontEncoding !== null && typeof fontEncoding !== 'undefined') {
                        encoding = fontEncoding.name;
                    }
                }
            }
        }
        if (encoding.toString() === 'identity#2dh' || encoding === 'CMap') {
            encoding = 'Identity-H';
        }
        return encoding;
    }
    _getDifferencesDictionary(): Map<string, string> {
        const result: Map<string, string> = new Map<string, string>();
        if (this._dictionary !== null && typeof this._dictionary !== 'undefined' && this._dictionary.has('Encoding')) {
            const encoding: _PdfDictionary = this._dictionary.get('Encoding');
            if (encoding !== null &&
                typeof encoding !== 'undefined' &&
                encoding instanceof _PdfDictionary &&
                encoding.has('Differences')) {
                const differences: any[] = encoding.getArray('Differences'); // eslint-disable-line
                let count: number = 0;
                if (differences !== null && typeof differences !== 'undefined') {
                    for (let i: number = 0; i < differences.length; i++) {
                        let text: string = '';
                        const item: any = differences[Number.parseInt(i.toString(), 10)]; // eslint-disable-line
                        if (typeof item === 'number') {
                            text = item.toString();
                            count = Number.parseInt(text, 10);
                        } else if (item instanceof _PdfName) {
                            text = item.name;
                            if (this._fontType === 'Type1' && text === '.notdef') {
                                text = ' ';
                                result.set(count.toString(), _getLatinCharacter(text));
                            } else {
                                text = _getLatinCharacter(text);
                                text = _getSpecialCharacter(text);
                                if (!result.has(count.toString())) {
                                    result.set(count.toString(), _getLatinCharacter(text));
                                }
                                count++;
                            }
                        }
                    }
                }
            }
        }
        return result;
    }
    _getFontName(): string {
        let fontName: string = '';
        if (this._dictionary !== null && typeof this._dictionary !== 'undefined' && this._dictionary.has('BaseFont')) {
            const baseFont: _PdfName = this._dictionary.get('BaseFont');
            let font: string = baseFont.name;
            if (font.indexOf('#20') !== -1 && font.indexOf('+') === -1) {
                const index: number = font.lastIndexOf('#20');
                font = font.substring(0, index);
                font += '+';
            }
            if (baseFont.name.indexOf('+') !== -1) {
                fontName = baseFont.name.split('+')[1];
            } else {
                fontName = baseFont.name;
            }
            if (fontName.indexOf('-') !== -1) {
                fontName = fontName.split('-')[0];
            } else if (fontName.indexOf(',') !== -1) {
                fontName = fontName.split(',')[0];
            }
            if (fontName.indexOf('MT') !== -1) {
                fontName = fontName.replace('MT', '');
            }
            if (fontName.indexOf('#20') !== -1) {
                fontName = fontName.replace('#20', ' ');
            }
            if (fontName.indexOf('#') !== -1) {
                fontName = this._decodeHexFontName(fontName);
            }
        }
        return fontName;
    }
    _decodeHexFontName(fontName: string): string {
        let result: string = fontName;
        for (let i: number = 0; i < fontName.length; i++) {
            if (fontName[Number.parseInt(i.toString(), 10)] === '#') {
                const hexValue: string = fontName[i + 1] + fontName[i + 2];
                const value: number = Number.parseInt(hexValue, 16);
                if (value !== 0) {
                    result = result.replace(`#${hexValue}`, String.fromCharCode(value));
                    i += 2;
                }
                if (result.indexOf('#') === -1) {
                    break;
                }
            }
        }
        return result;
    }
}
