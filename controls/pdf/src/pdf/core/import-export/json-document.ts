import { _ExportHelper } from './xfdf-document';
import { PdfDocument } from './../pdf-document';
import { _stringToAnnotationFlags, _convertToColor, _encode, _byteArrayToHexString, _stringToBytes, _annotationFlagsToString, _bytesToString, _hexStringToByteArray, _decode } from './../utils';
import { PdfPage } from './../pdf-page';
import { PdfAnnotation, PdfLineAnnotation } from './../annotations/annotation';
import { PdfAnnotationCollection } from './../annotations/annotation-collection';
import { _PdfDictionary, _PdfName, _PdfReference } from './../pdf-primitives';
import { _PdfBaseStream, _PdfContentStream, _PdfStream } from './../base-stream';
import { PdfForm } from './../form/form';
import { PdfField } from './../form/field';
import { PdfAnnotationFlag } from './../enumerator';
export class _JsonDocument extends _ExportHelper {
    _isImport: boolean = false;
    _isColorSpace: boolean = false;
    _isDuplicate: boolean = false;
    _isGroupingSupport: boolean = false;
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
        this._exportAnnotationData(document, document.pageCount);
        return this._save();
    }
    _exportFormFields(document: PdfDocument): Uint8Array {
        this._document = document;
        this._crossReference = document._crossReference;
        this._isAnnotationExport = false;
        const form: PdfForm = this._document.form;
        if (form !== null && typeof form !== 'undefined') {
            this._exportEmptyFields = form.exportEmptyFields;
            const count: number = this._document.form.count;
            for (let i: number = 0; i < count; i++) {
                const field: PdfField = this._document.form.fieldAt(i);
                this._exportFormFieldsData(field);
            }
            this._writeFormFieldData();
        }
        return this._save();
    }
    _save(): Uint8Array {
        const result: Uint8Array = new Uint8Array(this._jsonData);
        this._jsonData = [];
        return result;
    }
    _writeFormFieldData(): void {
        this._jsonData.push(this._openingBrace);
        let index: number = 0;
        this._table.forEach((value: string | string[], key: string) => {
            key = this._getValidString(key);
            this._jsonData.push(this._doubleQuotes);
            this._jsonData = _stringToBytes(key, true, false, this._jsonData) as number[];
            if (typeof value === 'string' || (Array.isArray(value) && value.length === 1)) {
                value = this._getValidString(typeof value === 'string' ? value : value[0]);
                this._jsonData.push(this._doubleQuotes, this._colon, this._doubleQuotes);
                this._jsonData = _stringToBytes(value, true, false, this._jsonData) as number[];
                this._jsonData.push(this._doubleQuotes);
            } else {
                this._jsonData.push(this._doubleQuotes, this._colon, this._openingBracket);
                for (let j: number = 0; j < value.length; j++) {
                    this._jsonData.push(this._doubleQuotes);
                    const entry: string = value[Number.parseInt(j.toString(), 10)];
                    for (let k: number = 0; k < entry.length; k++) {
                        this._jsonData.push(entry.charCodeAt(k));
                    }
                    this._jsonData.push(this._doubleQuotes);
                    if (j < value.length - 1) {
                        this._jsonData.push(this._comma);
                    }
                }
                this._jsonData.push(this._closingBracket);
            }
            if (index < this._table.size - 1) {
                this._jsonData.push(this._comma);
            }
            index++;
        });
        this._jsonData.push(this._closingBrace);
    }
    _exportAnnotationData(document: PdfDocument, pageCount: number): void {
        let isAnnotationAdded: boolean = false;
        this._jsonData.push(this._openingBrace, this._doubleQuotes, 112, 100, 102, 65, 110, 110, 111, 116, 97, 116, 105, 111, 110,
                            this._doubleQuotes, this._colon, this._openingBrace);
        for (let i: number = 0; i < pageCount; i++) {
            const page: PdfPage = document.getPage(i);
            if (page && page.annotations.count > 0) {
                this._jsonData.push(i !== 0 && isAnnotationAdded ? this._comma : this._space, this._doubleQuotes);
                const pageNumber: number[] = _stringToBytes(i.toString(), true, false, []) as number[];
                pageNumber.forEach((entry: number) => {
                    this._jsonData.push(entry);
                });
                this._jsonData.push(this._doubleQuotes, this._colon,
                                    this._openingBrace, this._doubleQuotes, 115, 104, 97, 112, 101, 65, 110, 110, 111, 116, 97, 116,
                                    105, 111, 110, this._doubleQuotes, this._colon, this._openingBracket);
                isAnnotationAdded = true;
            }
            let count: number = 0;
            for (let k: number = 0; k < page.annotations.count; k++) {
                const annotation: PdfAnnotation = page.annotations.at(k);
                if (annotation) {
                    if (count !== 0) {
                        this._jsonData.push(this._comma);
                    }
                    count++;
                    this._exportAnnotation(annotation, i);
                    this._jsonData = _stringToBytes(this._convertToJson(this._table), true, false, this._jsonData) as number[];
                    this._table.clear();
                }
            }
            if (page && page.annotations.count > 0) {
                this._jsonData.push(this._closingBracket, this._closingBrace);
            }
        }
        this._jsonData.push(this._closingBrace, this._closingBrace);
    }
    _exportAnnotation(annotation: PdfAnnotation, index: number): void {
        let hasAppearance: boolean = false;
        const dictionary: _PdfDictionary = annotation._dictionary;
        const type: string = this._getAnnotationType(annotation._dictionary);
        this._skipBorderStyle = false;
        if (type && type !== '') {
            this._table.set('type', type);
            this._table.set('page', index.toString());
            let lineAnnotation: PdfLineAnnotation;
            let points: number[];
            switch (type) {
            case 'Line':
                lineAnnotation = annotation as PdfLineAnnotation;
                points = lineAnnotation.linePoints;
                this._table.set('start', points[0].toString() + ',' + points[1].toString());
                this._table.set('end', points[2].toString() + ',' + points[3].toString());
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
            this._writeDictionary(dictionary, index, hasAppearance);
        }
    }
    _writeDictionary(dictionary: _PdfDictionary, pageIndex: number, hasAppearance: boolean): void {
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
                    case 'BE':
                        this._writeDictionary(entry, pageIndex, false);
                        break;
                    case 'IRT':
                        if (entry.has('NM')) {
                            this._table.set('inreplyto', this._getValue(entry.get('NM'), true));
                        }
                        break;
                    }
                } else if (value instanceof _PdfDictionary) {
                    this._writeDictionary(value, pageIndex, false);
                } else if ((!isBorderStyle) || (isBorderStyle && key !== 'S')) {
                    this._writeAttribute(key, value, dictionary);
                }
            }
        });
        if (dictionary.has('Measure')) {
            this._exportMeasureDictionary(dictionary.get('Measure'));
        }
        if ((this.exportAppearance || hasAppearance) && dictionary.has('AP')) {
            const stream: Uint8Array = this._getAppearanceString(dictionary.get('AP'));
            if (stream && stream.length > 0) {
                this._table.set('appearance', _encode(stream));
            }
        }
        if (dictionary.has('Sound')) {
            const sound: _PdfBaseStream = dictionary.get('Sound');
            if (sound && sound.dictionary) {
                const soundDictionary: _PdfDictionary = sound.dictionary;
                if (soundDictionary.has('B')) {
                    this._table.set('bits', this._getValue(soundDictionary.get('B'), true));
                }
                if (soundDictionary.has('C')) {
                    this._table.set('channels', this._getValue(soundDictionary.get('C'), true));
                }
                if (soundDictionary.has('E')) {
                    this._table.set('encoding', this._getValue(soundDictionary.get('E'), true));
                }
                if (soundDictionary.has('R')) {
                    this._table.set('rate', this._getValue(soundDictionary.get('R'), true));
                }
                if (soundDictionary.has('Length') && soundDictionary.get('Length') > 0) {
                    const data: string = _byteArrayToHexString(sound.getBytes());
                    if (data && data !== '') {
                        this._table.set('MODE', 'raw');
                        this._table.set('encoding', 'hex');
                        if (soundDictionary.has('Length')) {
                            this._table.set('length', this._getValue(soundDictionary.get('Length'), true));
                        }
                        if (soundDictionary.has('Filter')) {
                            this._table.set('filter', this._getValue(soundDictionary.get('Filter'), true));
                        }
                        this._table.set('data', data);
                    }
                }
            }
        } else if (dictionary.has('FS')) {
            const fsDictionary: _PdfDictionary = dictionary.get('FS');
            if (fsDictionary) {
                if (fsDictionary.has('F')) {
                    this._table.set('file', this._getValue(fsDictionary.get('F'), true));
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
                                        const value: string = this._getValue(paramsDictionary.get('CreationDate'), true);
                                        this._table.set('creation', value);
                                    }
                                    if (paramsDictionary.has('ModificationDate')) {
                                        const value: string = this._getValue(paramsDictionary.get('ModificationDate'), true);
                                        this._table.set('modification', value);
                                    }
                                    if (paramsDictionary.has('Size')) {
                                        this._table.set('size', this._getValue(paramsDictionary.get('Size'), true));
                                    }
                                    if (paramsDictionary.has('CheckSum')) {
                                        const value: string = this._getValue(paramsDictionary.get('CheckSum'), true);
                                        const checksum: Uint8Array = _stringToBytes(value) as Uint8Array;
                                        const hexString: string = _byteArrayToHexString(checksum);
                                        this._table.set('checksum', hexString);
                                    }
                                }
                            }
                            const data: string = _byteArrayToHexString(fStream.getBytes());
                            if (data && data !== '') {
                                this._table.set('MODE', 'raw');
                                this._table.set('encoding', 'hex');
                                if (fDictionary.has('Length')) {
                                    this._table.set('length', this._getValue(fDictionary.get('Length'), true));
                                }
                                if (fDictionary.has('Filter')) {
                                    this._table.set('filter', this._getValue(fDictionary.get('Filter'), true));
                                }
                                this._table.set('data', data);
                            }
                        }
                    }
                }
            }
        }
    }
    _writeColor(primitive: any, attribute: string, tag?: string): void { // eslint-disable-line
        const color: string = this._getColor(primitive);
        if (typeof primitive === 'number' && tag) {
            const c: string = this._getValue(primitive, true);
            if (c && c !== '') {
                this._table.set(tag, c);
            }
        }
        if (color && color !== '') {
            this._table.set(attribute, color);
        }
    }
    _writeAttributeString(attribute: string, primitive: any, isLowerCase: boolean = false): void { // eslint-disable-line
        const value: string = this._getValue(primitive, true);
        this._table.set(attribute, isLowerCase ? value.toLowerCase() : value);
    }
    _writeAttribute(key: string, primitive: any, dictionary: _PdfDictionary): void { // eslint-disable-line
        let value: string;
        switch (key) {
        case 'C':
            this._writeColor(primitive, 'color', 'c');
            break;
        case 'IC':
            this._writeColor(primitive, 'interior-color');
            break;
        case 'DA':
            value = dictionary.get('DA');
            if (value) {
                this._table.set('defaultappearance', value);
            }
            break;
        case 'M':
            this._writeAttributeString('date', primitive);
            break;
        case 'NM':
            this._table.set('name', primitive);
            break;
        case 'Name':
            this._writeAttributeString('icon', primitive);
            break;
        case 'Subj':
            this._writeAttributeString('subject', primitive);
            break;
        case 'T':
            this._writeAttributeString('title', primitive);
            break;
        case 'Rect':
            value = this._getValue(primitive, true);
            if (value) {
                const rectArray: string[] = value.split(',');
                const subTable: Map<string, string> = new Map<string, string>();
                subTable.set('x', rectArray[0]);
                subTable.set('y', rectArray[1]);
                subTable.set('width', rectArray[2]);
                subTable.set('height', rectArray[3]);
                this._table.set(key.toLowerCase(), this._convertToJson(subTable));
            }
            break;
        case 'CreationDate':
            this._writeAttributeString('creationdate', primitive);
            break;
        case 'Rotate':
            this._writeAttributeString('rotation', primitive);
            break;
        case 'W':
            this._writeAttributeString('width', primitive);
            break;
        case 'LE':
            if (primitive && Array.isArray(primitive)) {
                if (primitive.length === 2) {
                    this._table.set('head', this._getValue(primitive[0], true));
                    this._table.set('tail', this._getValue(primitive[1], true));
                }
            } else if (primitive instanceof _PdfName) {
                this._writeAttributeString('head', primitive);
            }
            break;
        case 'S':
            switch (this._getValue(primitive, true)) {
            case 'D':
                this._table.set('style', 'dash');
                break;
            case 'C':
                this._table.set('style', 'cloudy');
                break;
            case 'S':
                this._table.set('style', 'solid');
                break;
            case 'B':
                this._table.set('style', 'bevelled');
                break;
            case 'I':
                this._table.set('style', 'inset');
                break;
            case 'U':
                this._table.set('style', 'underline');
                break;
            }
            break;
        case 'D':
            this._writeAttributeString('dashes', primitive);
            break;
        case 'I':
            this._writeAttributeString('intensity', primitive);
            break;
        case 'RD':
            this._writeAttributeString('fringe', primitive);
            break;
        case 'IT':
            this._writeAttributeString('IT', primitive);
            break;
        case 'RT':
            this._writeAttributeString('replyType', primitive, true);
            break;
        case 'LL':
            this._writeAttributeString('leaderLength', primitive);
            break;
        case 'LLE':
            this._writeAttributeString('leaderExtend', primitive);
            break;
        case 'Cap':
            this._writeAttributeString('caption', primitive);
            break;
        case 'CP':
            this._writeAttributeString('caption-style', primitive);
            break;
        case 'CL':
            this._writeAttributeString('callout', primitive);
            break;
        case 'QuadPoints':
            this._writeAttributeString('coords', primitive);
            break;
        case 'CA':
            this._writeAttributeString('opacity', primitive);
            break;
        case 'F':
            if (typeof primitive === 'number') {
                const flag: string = _annotationFlagsToString(primitive);
                this._table.set('flags', flag);
            }
            break;
        case 'Contents':
            value = dictionary.get('Contents');
            if (value && value.length > 0) {
                this._table.set('contents', this._getValidString(value));
            }
            break;
        case 'InkList':
            this._writeInkList(dictionary);
            break;
        case 'Vertices':
            this._writeVertices(dictionary);
            break;
        case 'DS':
            value = dictionary.get('DS');
            if (value) {
                const styleTable: Map<string, string> = new Map<string, string>();
                const textStyle: string[] = value.split(';');
                for (let i: number = 0; i < textStyle.length; i++) {
                    const text: string[] = textStyle[Number.parseInt(i.toString(), 10)].split(':');
                    if (text && text.length > 0 && text[0] && text[0].length > 1 && text[0].startsWith(' ')) {
                        text[0] = text[0].substring(1);
                    }
                    styleTable.set(text[0], text[1]);
                }
                this._table.set('defaultStyle', this._convertToJson(styleTable));
            }
            break;
        case 'AllowedInteractions':
            if (primitive) {
                const bytes: Uint8Array = _stringToBytes(primitive) as Uint8Array;
                const styleTable: Map<string, string> = new Map<string, string>();
                styleTable.set('unicodeData', _byteArrayToHexString(bytes));
                this._table.set(key, this._convertToJson(styleTable));
            }
            break;
        case 'Type':
        case 'Subtype':
        case 'P':
        case 'Parent':
        case 'L':
        case 'RC':
        case 'FS':
        case 'MeasurementTypes':
        case 'GroupNesting':
        case 'ITEx':
        case 'TextMarkupContent':
            break;
        case 'Border':
        case 'A':
        case 'R':
        case 'X':
        case 'ca':
            this._writeAttributeString(key.toLowerCase(), primitive);
            break;
        default:
            if (typeof primitive === 'string' && primitive.startsWith('{') && primitive.endsWith('}')) {
                this._table.set(key, primitive);
            } else {
                this._writeAttributeString(key, primitive);
            }
            break;
        }
    }
    _writeVertices(dictionary: _PdfDictionary): void {
        const vertices: number[] = dictionary.getArray('Vertices');
        if (vertices && vertices.length > 0) {
            const elementCount: number = vertices.length;
            if (elementCount % 2 === 0) {
                let vertice: string = '';
                for (let i: number = 0; i < elementCount - 1; i++) {
                    vertice += this._getValue(vertices[Number.parseInt(i.toString(), 10)], true) + (i % 2 !== 0 ? ';' : ',');
                }
                vertice += this._getValue(vertices[elementCount - 1], true);
                if (vertice && vertice !== '') {
                    this._table.set('vertices', vertice);
                }
            }
        }
    }
    _writeInkList(dictionary: _PdfDictionary): void {
        const inkList: Array<number[]> = dictionary.getArray('InkList');
        if (inkList && inkList.length > 0) {
            const points: Map<string, string> = new Map<string, string>();
            let json: string = '[';
            for (let j: number = 0; j < inkList.length; j++) {
                json += '[' + this._getValue(inkList[Number.parseInt(j.toString(), 10)], true) + ']';
                if (j < inkList.length - 1) {
                    json += ',';
                }
            }
            json += ']';
            points.set('gesture', json);
            this._table.set('inklist', this._convertToJson(points));
        }
    }
    _exportMeasureDictionary(dictionary: _PdfDictionary): void {
        if (dictionary) {
            if (dictionary.has('Type')) {
                this._table.set('type1', 'Measure');
            }
            if (dictionary.has('R')) {
                this._table.set('ratevalue', this._getValue(dictionary.get('R'), true));
            }
            if (dictionary.has('SubType')) {
                this._table.set('SubType', this._getValue(dictionary.get('SubType'), true));
            }
            if (dictionary.has('TargetUnitConversion')) {
                this._table.set('TargetUnitConversion', this._getValue(dictionary.get('TargetUnitConversion'), true));
            }
            if (dictionary.has('A')) {
                const array: _PdfDictionary[] = dictionary.getArray('A');
                if (array && array.length > 0 && array[0]) {
                    this._exportMeasureFormatDetails('area', array[0]);
                }
            }
            if (dictionary.has('D')) {
                const array: _PdfDictionary[] = dictionary.getArray('D');
                if (array && array.length > 0 && array[0]) {
                    this._exportMeasureFormatDetails('distance', array[0]);
                }
            }
            if (dictionary.has('X')) {
                const array: _PdfDictionary[] = dictionary.getArray('X');
                if (array && array.length > 0 && array[0]) {
                    this._exportMeasureFormatDetails('xformat', array[0]);
                }
            }
            if (dictionary.has('T')) {
                const array: _PdfDictionary[] = dictionary.getArray('T');
                if (array && array.length > 0 && array[0]) {
                    this._exportMeasureFormatDetails('tformat', array[0]);
                }
            }
            if (dictionary.has('V')) {
                const array: _PdfDictionary[] = dictionary.getArray('V');
                if (array && array.length > 0 && array[0]) {
                    this._exportMeasureFormatDetails('vformat', array[0]);
                }
            }
        }
    }
    _exportMeasureFormatDetails(key: string, measurementDetails: _PdfDictionary): void {
        const details: Map<string, string> = new Map<string, string>();
        if (measurementDetails.has('C')) {
            details.set('c', this._getValue(measurementDetails.get('C'), true));
        }
        if (measurementDetails.has('F')) {
            details.set('f', this._getValue(measurementDetails.get('F'), true));
        }
        if (measurementDetails.has('D')) {
            details.set('d', this._getValue(measurementDetails.get('D'), true));
        }
        if (measurementDetails.has('RD')) {
            details.set('rd', this._getValue(measurementDetails.get('RD'), true));
        }
        if (measurementDetails.has('U')) {
            details.set('u', this._getValue(measurementDetails.get('U'), true));
        }
        if (measurementDetails.has('RT')) {
            details.set('rt', this._getValue(measurementDetails.get('RT'), true));
        }
        if (measurementDetails.has('SS')) {
            details.set('ss', this._getValue(measurementDetails.get('SS'), true));
        }
        if (measurementDetails.has('FD')) {
            details.set('fd', this._getValue(measurementDetails.get('FD'), true));
        }
        this._table.set(key, this._convertToJson(details));
    }
    _getAppearanceString(appearance: _PdfDictionary): Uint8Array {
        const parentTable: Map<string, string> = new Map<string, string>();
        const appearanceTable: Map<string, string> = new Map<string, string>();
        this._writeAppearanceDictionary(appearanceTable, appearance);
        parentTable.set('ap', this._convertToJson(appearanceTable));
        return _stringToBytes(this._convertToJson(parentTable)) as Uint8Array;
    }
    _writeAppearanceDictionary(table: Map<string, string>, dictionary: _PdfDictionary): void {
        if (dictionary && dictionary.size > 0) {
            dictionary.forEach((key: string, value: any) => { // eslint-disable-line
                if (key === 'OC' && value instanceof Array || (key !== 'P' && key !== 'Parent' && key !== 'Dest' && key !== 'OC' && !(key === 'AP' && this._isGroupingSupport)) ) {
                    this._writeObject(table, ((value instanceof _PdfReference) ? dictionary.get(key) : value), dictionary, key);
                }
            });
        }
    }
    _writeObject(table?: Map<string, string>,
                 value?: any, dictionary?: _PdfDictionary, key?: string, array?: Map<string, string>[], isColorSpace: boolean = false): void { // eslint-disable-line
        if (value instanceof _PdfName) {
            value.name = this._getValidString(value.name);
            this._writeTable('name', value.name, table, key, array);
        } else if (Array.isArray(value)) {
            const list: Map<string, string>[] = [];
            if (key === 'ColorSpace' || isColorSpace) {
                this._writeArray(list, value, dictionary, true);
            } else {
                this._writeArray(list, value, dictionary);
            }
            this._isColorSpace = false;
            this._writeTable('array', this._convertToJsonArray(list), table, key, array);
        } else if (typeof value === 'string') {
            let isTabSpace: boolean = false;
            if (value.indexOf('\t') !== -1) {
                isTabSpace = true;
            }
            if (key !== 'AllowedInteractions') {
                value = this._getValidString(value);
            }
            if (this._isColorSpace || key === 'AllowedInteractions' || this._hasUnicodeCharacters(value) || isTabSpace) {
                const bytes: Uint8Array = _stringToBytes(value) as Uint8Array;
                this._writeTable('unicodeData', _byteArrayToHexString(bytes), table, key, array);
                isTabSpace = false;
            } else {
                this._writeTable('string', value, table, key, array);
            }
        } else if (typeof value === 'number') {
            this._writeTable(Number.isInteger(value) ? 'int' : 'fixed', value.toString(), table, key, array);
        } else if (typeof value === 'boolean') {
            this._writeTable('boolean', value ? 'true' : 'false', table, key, array);
        } else if (value instanceof _PdfDictionary) {
            const subTable: Map<string, string> = new Map<string, string>();
            this._writeAppearanceDictionary(subTable, value);
            this._writeTable('dict', this._convertToJson(subTable), table, key, array);
        } else if (value instanceof _PdfBaseStream && value.dictionary) {
            const dataTable: Map<string, any> = new Map<string, any>(); // eslint-disable-line
            const streamTable: Map<string, any> = new Map<string, any>(); // eslint-disable-line
            const streamDictionary: _PdfDictionary = value.dictionary;
            let data: string;
            let baseStream: any = value; // eslint-disable-line
            let isImageStream: boolean = false;
            if (streamDictionary.has('Subtype') && streamDictionary.get('Subtype').name === 'Image') {
                isImageStream = true;
            }
            if (isImageStream && baseStream.stream) {
                if (baseStream.stream instanceof _PdfStream) {
                    if (typeof baseStream._initialized === 'boolean' && baseStream._cipher) {
                        const streamLength: number = baseStream.stream.end - baseStream.stream.start;
                        baseStream.getBytes(streamLength);
                        const bytes: Uint8Array = baseStream.buffer.subarray(0, baseStream.bufferLength);
                        data = baseStream.getString(true, bytes);
                    } else {
                        const stream: _PdfStream = baseStream.stream;
                        data = baseStream.getString(true, stream.getByteRange(stream.start, stream.end) as Uint8Array);
                    }
                } else if (baseStream.stream.stream) {
                    const flateStream: any = baseStream.stream; // eslint-disable-line
                    if (flateStream.stream instanceof _PdfStream && typeof flateStream._initialized === 'boolean' && flateStream._cipher) {
                        const streamLength: number = flateStream.stream.end - flateStream.stream.start;
                        flateStream.getBytes(streamLength);
                        const bytes: Uint8Array = flateStream.buffer.subarray(0, flateStream.bufferLength);
                        data = flateStream.getString(true, bytes);
                    } else if (flateStream.stream instanceof _PdfStream) {
                        const stream: _PdfStream = flateStream.stream;
                        data = flateStream.getString(true, stream.getByteRange(stream.start, stream.end) as Uint8Array);
                    }
                }
            } else {
                data = value.getString(true);
            }
            if (!streamDictionary.has('Length') && data && data !== '') {
                streamDictionary.update('Length', value.length);
            }
            this._writeAppearanceDictionary(streamTable, streamDictionary);
            let type: string;
            if (streamDictionary.has('Subtype')) {
                type = this._getValue(streamDictionary.get('Subtype'));
            }
            if ((!streamDictionary.has('Type') && !streamDictionary.has('Subtype')) ||
                (streamDictionary.has('Subtype') &&
                (type === 'Image' || type === 'Form' || type === 'CIDFontType0C' || type === 'OpenType'))) {
                dataTable.set('mode', 'raw');
                dataTable.set('encoding', 'hex');
            } else {
                dataTable.set('mode', 'filtered');
                dataTable.set('encoding', 'ascii');
            }
            if (data && data !== '') {
                dataTable.set('bytes', data);
            }
            streamTable.set('data', this._convertToJson(dataTable));
            this._writeTable('stream', this._convertToJson(streamTable), table, key, array);
        } else if (value instanceof _PdfReference && this._crossReference) {
            this._writeObject(table, this._crossReference._fetch(value), dictionary, key, array);
        } else if (value === null || typeof value === 'undefined') {
            this._writeTable('null', 'null', table, key, array);
        }
    }
    _writeTable(tableKey: string, value: string, table: Map<string, string>, key: string, array: Map<string, string>[]): void {
        const map: Map<string, string> = new Map<string, string>();
        map.set(tableKey, value);
        if (key) {
            table.set(key, this._convertToJson(map));
        } else if (array) {
            array.push(map);
        }
    }
    _writeArray(array: Map<string, string>[], value: any[], dictionary: _PdfDictionary, isColorSpace: boolean = false): void { // eslint-disable-line
        for (let i: number = 0; i < value.length; i++) {
            if (isColorSpace && typeof value[Number.parseInt(i.toString(), 10)] === 'string') {
                this._isColorSpace = true;
            }
            this._writeObject(null, value[Number.parseInt(i.toString(), 10)], dictionary, null, array, isColorSpace);
        }
    }
    _convertToJson(table: Map<string, string>): string {
        let j: number = 0;
        let json: string = '{';
        table.forEach((value: string, key: string) => {
            if (value.startsWith('{') || value.startsWith('[')) {
                if (key === 'AllowedInteractions') {
                    json += `"${key}":${value}`;
                } else {
                    json += '"' + key + '":' + value;
                }
            } else {
                if (value.startsWith(' ') && value.length > 1 && (value[1] === '[' || value[1] === '{')) {
                    value = value.substring(1);
                }
                json += '"' + key + '":"' + value + '"';
            }
            if (j < table.size - 1) {
                json += ',';
            }
            j++;
        });
        return json + '}';
    }
    _hasUnicodeCharacters(value: string): boolean {
        const unicodeRegex = /[^\x00-\x7F]/; // eslint-disable-line
        return value.split('').some(char => unicodeRegex.exec(char) !== null); // eslint-disable-line
    }
    _convertToJsonArray(array: Map<string, string>[]): string {
        let json: string = '[';
        for (let i: number = 0; i < array.length; i++) {
            json += this._convertToJson(array[Number.parseInt(i.toString(), 10)]);
            if (i < array.length - 1) {
                json += ',';
            }
        }
        return json + ']';
    }
    // #import
    _parseJson(document: PdfDocument, data: Uint8Array): any { // eslint-disable-line
        this._document = document;
        this._crossReference = document._crossReference;
        let stringData: string = _bytesToString(data, true);
        if (stringData.startsWith('{') && !stringData.endsWith('}')) {
            while (stringData.length > 0 && !stringData.endsWith('}')) {
                stringData = stringData.substring(0, stringData.length - 1);
            }
        }
        return JSON.parse(stringData);
    }
    _importFormData(document: PdfDocument, data: Uint8Array): void {
        const json: any = this._parseJson(document, data); // eslint-disable-line
        if (json) {
            const keys: string[] = Object.keys(json);
            if (keys && keys.length > 0) {
                for (let i: number = 0; i < keys.length; i++) {
                    const key: string = keys[Number.parseInt(i.toString(), 10)];
                    const value = json[key]; // eslint-disable-line
                    if (Array.isArray(value)) {
                        if (this._fields.has('key')) {
                            value.forEach((entry: any) => { // eslint-disable-line
                                this._fields.get(key).push(entry);
                            });
                        } else {
                            this._fields.set(key, value);
                        }
                    } else {
                        if (this._fields.has('key')) {
                            this._fields.get(key).push(value);
                        } else {
                            this._fields.set(key, [value]);
                        }
                    }
                }
                this._importField();
            }
        }
    }
    _importAnnotations(document: PdfDocument, data: Uint8Array): void {
        const json: any = this._parseJson(document, data); // eslint-disable-line
        if (json) {
            const keys: string[] = Object.keys(json);
            if (keys.indexOf('pdfAnnotation') !== -1) {
                const pageAnnotations: any = json.pdfAnnotation; // eslint-disable-line
                const pageCount: number = document.pageCount;
                const pageKeys: string[] = Object.keys(pageAnnotations);
                if (pageKeys && pageKeys.length > 0) {
                    pageKeys.forEach((key: string) => {
                        const pageIndex: number = Number.parseInt(key, 10);
                        if (typeof pageIndex !== 'undefined' && pageIndex < pageCount) {
                            const page: PdfPage = document.getPage(pageIndex);
                            const pageAnnotation: any = pageAnnotations[key]; // eslint-disable-line
                            if (pageAnnotation) {
                                const pageAnnotationKeys: string[] = Object.keys(pageAnnotation);
                                if (pageAnnotationKeys && pageAnnotationKeys.length > 0 && pageAnnotationKeys.indexOf('shapeAnnotation') !== -1) {
                                    const annotations: any[] = pageAnnotation['shapeAnnotation']; // eslint-disable-line
                                    if (annotations && annotations.length > 0) {
                                        annotations.forEach((annotation: any) => { // eslint-disable-line
                                            const annotationKeys: string[] = Object.keys(annotation);
                                            if (annotationKeys && annotationKeys.length > 0 && annotationKeys.indexOf('type') !== -1) {
                                                const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
                                                dictionary.update('Type', _PdfName.get('Annot'));
                                                let isValidType: boolean = true;
                                                switch (annotation['type'].toLowerCase()) {
                                                case 'line':
                                                    dictionary.update('Subtype', _PdfName.get('Line'));
                                                    break;
                                                case 'circle':
                                                    dictionary.update('Subtype', _PdfName.get('Circle'));
                                                    break;
                                                case 'square':
                                                    dictionary.update('Subtype', _PdfName.get('Square'));
                                                    break;
                                                case 'polyline':
                                                    dictionary.update('Subtype', _PdfName.get('PolyLine'));
                                                    break;
                                                case 'polygon':
                                                    dictionary.update('Subtype', _PdfName.get('Polygon'));
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
                                                case 'redact':
                                                    dictionary.update('Subtype', _PdfName.get('Redact'));
                                                    break;
                                                case 'caret':
                                                    dictionary.update('Subtype', _PdfName.get('Caret'));
                                                    break;
                                                default:
                                                    isValidType = false;
                                                    break;
                                                }
                                                if (isValidType) {
                                                    this._addAnnotationData(dictionary, annotation, annotationKeys);
                                                    const pageDictionary: _PdfDictionary = page._pageDictionary;
                                                    if (pageDictionary) {
                                                        const annotations: PdfAnnotationCollection = page.annotations;
                                                        const annotation: PdfAnnotation = annotations._parseAnnotation(dictionary);
                                                        if (annotation) {
                                                            annotation._isImported = true;
                                                            const reference: _PdfReference = this._crossReference._getNextReference();
                                                            this._crossReference._cacheMap.set(reference, dictionary);
                                                            if (dictionary.has('NM') || dictionary.has('IRT')) {
                                                                this._addReferenceToGroup(reference, dictionary);
                                                            }
                                                            annotation._ref = reference;
                                                            const index: number = annotations._annotations.length;
                                                            annotations._annotations.push(reference);
                                                            pageDictionary.set('Annots', annotations._annotations);
                                                            pageDictionary._updated = true;
                                                            annotations._parsedAnnotations.set(index, annotation);
                                                            this._handlePopup(annotations, reference, dictionary, pageDictionary);
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    });
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
            }
        }
    }
    _addAnnotationData(dictionary: _PdfDictionary, annotation: any, annotationKeys: string[]): void { // eslint-disable-line
        const borderEffectDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
        const borderStyleDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
        const dataStream: Map<string, string> = new Map<string, string>();
        let linePoints: number[] = [];
        let beginLineStyle: string;
        let endLineStyle: string;
        let values: string = '';
        let rect: {x: string, y: string, width: string, height: string};
        let outColor: string[];
        annotationKeys.forEach((key: string) => {
            let value: any = annotation[key]; // eslint-disable-line
            switch (key.toLowerCase()) {
            case 'start':
            case 'end':
                this._addLinePoints(value, linePoints);
                if (linePoints.length === 4) {
                    dictionary.update('L', linePoints);
                    linePoints = [];
                }
                break;
            case 'itex':
                break;
            case 'state':
                this._addString(dictionary, 'State', value);
                break;
            case 'statemodel':
                this._addString(dictionary, 'StateModel', value);
                break;
            case 'replytype':
                if (value.toLowerCase() === 'group') {
                    dictionary.update('RT', _PdfName.get('Group'));
                }
                break;
            case 'inreplyto':
                this._addString(dictionary, 'IRT', value);
                break;
            case 'dashes':
            case 'width':
            case 'intensity':
            case 'style':
                this._addBorderStyle(key, value, borderEffectDictionary, borderStyleDictionary);
                break;
            case 'rect':
                rect = value;
                if (rect) {
                    const points: number[] = [];
                    points.push(Number.parseFloat(rect.x));
                    points.push(Number.parseFloat(rect.y));
                    points.push(Number.parseFloat(rect.width));
                    points.push(Number.parseFloat(rect.height));
                    if (points && points.length === 4) {
                        dictionary.update('Rect', points);
                    }
                }
                break;
            case 'color':
                value = _convertToColor(value);
                if (value && value.length === 3) {
                    dictionary.update('C', [value[0] / 255, value[1] / 255, value[2] / 255]);
                }
                break;
            case 'oc':
                if (value && dictionary.get('Subtype').name === 'Redact') {
                    outColor = value.split(',');
                    const color: number[] = [];
                    outColor.forEach((entry: string) => {
                        color.push(Number.parseFloat(entry));
                    });
                    if (color && color.length > 0) {
                        dictionary.update('OC', color);
                    }
                }
                break;
            case 'interior-color':
                value = _convertToColor(value);
                if (value && value.length === 3) {
                    dictionary.update('IC', [value[0] / 255, value[1] / 255, value[2] / 255]);
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
                if (value) {
                    dictionary.update('Name', _PdfName.get(value));
                }
                break;
            case 'subject':
                this._addString(dictionary, 'Subj', value);
                break;
            case 'title':
                this._addString(dictionary, 'T', value);
                break;
            case 'rotation':
                dictionary.update('Rotate', Number.parseFloat(value));
                break;
            case 'fringe':
                this._addFloatPoints(dictionary, 'RD', this._parseFloatPoints(value));
                break;
            case 'it':
                if (value) {
                    dictionary.update('IT', _PdfName.get(value));
                }
                break;
            case 'leaderlength':
                dictionary.update('LL', Number.parseFloat(value));
                break;
            case 'leaderextend':
                dictionary.update('LLE', Number.parseFloat(value));
                break;
            case 'caption':
                this._addBoolean(dictionary, 'Cap', value.toLowerCase());
                break;
            case 'caption-style':
                if (value) {
                    dictionary.update('CP', _PdfName.get(value));
                }
                break;
            case 'callout':
                this._addFloatPoints(dictionary, 'CL', this._parseFloatPoints(value));
                break;
            case 'coords':
                this._addFloatPoints(dictionary, 'QuadPoints', this._parseFloatPoints(value));
                break;
            case 'border':
                this._addFloatPoints(dictionary, 'Border', this._parseFloatPoints(value));
                break;
            case 'opacity':
                dictionary.update('CA', Number.parseFloat(value));
                break;
            case 'defaultstyle':
                if (value) {
                    const styleKeys: string[] = Object.keys(value);
                    if (styleKeys && styleKeys.length > 0) {
                        let style: string = '';
                        let count: number = 0;
                        styleKeys.forEach((styleKey: string) => {
                            const styleValue: string = value[styleKey]; // eslint-disable-line
                            style += styleKey + ':' + styleValue;
                            if (count < styleKeys.length - 1) {
                                style += ';';
                            }
                            count++;
                        });
                        this._addString(dictionary, 'DS', style);
                    }
                }
                break;
            case 'defaultappearance':
                this._addString(dictionary, 'DA', value);
                break;
            case 'flags':
                if (value && typeof value === 'string') {
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
                this._addBoolean(dictionary, 'Open', value.toLowerCase());
                break;
            case 'repeat':
                this._addBoolean(dictionary, 'Repeat', value.toLowerCase());
                break;
            case 'overlaytext':
                this._addString(dictionary, 'OverlayText', value);
                break;
            case 'contents':
                if (typeof value === 'string') {
                    if (value.indexOf('\\r') !== -1) {
                        value = value.replace('\\r', '\r');
                    }
                    if (value) {
                        this._addString(dictionary, 'Contents', value);
                    }
                }
                break;
            case 'q':
                dictionary.update('Q', Number.parseInt(value, 10));
                break;
            case 'inklist':
                if (value) {
                    const gestureKeys: string[] = Object.keys(value);
                    if (gestureKeys && gestureKeys.length > 0 && gestureKeys.indexOf('gesture') !== -1) {
                        const gesture: number[][] = value.gesture;
                        if (gesture && gesture.length > 0) {
                            dictionary.update('InkList', gesture);
                        }
                    }
                }
                break;
            case 'head':
                beginLineStyle = value;
                break;
            case 'tail':
                endLineStyle = value;
                break;
            case 'creation':
            case 'modification':
            case 'file':
            case 'bits':
            case 'channels':
            case 'encoding':
            case 'rate':
            case 'length':
            case 'filter':
            case 'mode':
            case 'size':
                dataStream.set(key, value);
                break;
            case 'data':
                values = value;
                break;
            case 'vertices':
                if (value && typeof value === 'string') {
                    const split: string[] = value.split(/[,;]/);
                    if (split && split.length > 0) {
                        const vertices: number[] = [];
                        for (let i: number = 0; i < split.length; i++) {
                            vertices.push(Number.parseFloat(split[Number.parseInt(i.toString(), 10)]));
                        }
                        if (vertices.length > 0 && vertices.length % 2 === 0) {
                            dictionary.update('Vertices', vertices);
                        }
                    }
                }
                break;
            case 'appearance':
                this._addAppearanceData(dictionary, value);
                break;
            case 'allowedinteractions':
                if (value) {
                    if (value && typeof value === 'string') {
                        this._addString(dictionary, 'AllowedInteractions', value);
                    } else {
                        const interactionKeys: string[] = Object.keys(value);
                        if (interactionKeys && interactionKeys.length > 0 && interactionKeys.indexOf('unicodeData') !== -1) {
                            let convertString: string = JSON.stringify(value['unicodeData']);
                            convertString = convertString.substring(1, convertString.length - 1);
                            value =  _bytesToString(_hexStringToByteArray(convertString, false) as Uint8Array, true);
                            this._addString(dictionary, 'AllowedInteractions', value);
                        }
                    }
                }
                break;
            default:
                if (this._document._allowImportCustomData && key !== 'type' && key !== 'page') {
                    this._addString(dictionary, key, typeof value === 'string' ? value : JSON.stringify(value));
                }
                break;
            }
        });
        this._addMeasureDictionary(dictionary, annotation, annotationKeys);
        if (beginLineStyle) {
            if (endLineStyle) {
                dictionary.update('LE', [_PdfName.get(beginLineStyle), _PdfName.get(endLineStyle)]);
            } else {
                dictionary.update('LE', beginLineStyle);
            }
        } else if (endLineStyle) {
            dictionary.update('LE', endLineStyle);
        }
        if (borderStyleDictionary.size > 0) {
            borderStyleDictionary.update('Type', _PdfName.get('Border'));
            const reference: _PdfReference = this._crossReference._getNextReference();
            borderStyleDictionary.objId = reference.objectNumber + ' ' + reference.generationNumber;
            this._crossReference._cacheMap.set(reference, borderStyleDictionary);
            dictionary.update('BS', reference);
        }
        if (borderEffectDictionary.size > 0) {
            const reference: _PdfReference = this._crossReference._getNextReference();
            borderStyleDictionary.objId = reference.objectNumber + ' ' + reference.generationNumber;
            this._crossReference._cacheMap.set(reference, borderEffectDictionary);
            dictionary.update('BE', reference);
        }
        this._addStreamData(dictionary, dataStream, values);
    }
    _addLinePoints(value: string, linePoints: number[]): void {
        if (value && value.indexOf(',') !== -1) {
            const points: string[] = value.split(',');
            points.forEach((point: string) => {
                linePoints.push(Number.parseFloat(point));
            });
        }
    }
    _addString(dictionary: _PdfDictionary, key: string, value: string): void {
        if (value) {
            dictionary.update(key, value);
        }
    }
    _addBoolean(dictionary: _PdfDictionary, key: string, value: string): void {
        if (value) {
            dictionary.update(key, value === 'yes' || value === 'true');
        }
    }
    _addBorderStyle(key: string, value: any, borderEffectDictionary: _PdfDictionary, borderStyleDictionary: _PdfDictionary): void { // eslint-disable-line
        let style: string = '';
        let isBasicStyle: boolean = true;
        switch (value) {
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
        switch (key.toLowerCase()) {
        case 'width':
            borderStyleDictionary.update('W', Number.parseFloat(value));
            break;
        case 'intensity':
            borderEffectDictionary.update('I', Number.parseFloat(value));
            break;
        case 'dashes':
            if (value && value.indexOf(',') !== -1) {
                borderStyleDictionary.update('D', this._parseFloatPoints(value));
            }
            break;
        }
        if (style) {
            if (isBasicStyle) {
                borderStyleDictionary.update('S', _PdfName.get(style));
            } else {
                borderEffectDictionary.update('S', _PdfName.get(style));
            }
        }
    }
    _parseFloatPoints(value: string): number[] {
        const dashes: string[] = value.split(',');
        const dashArray: number[] = [];
        dashes.forEach((dash: string) => {
            dashArray.push(Number.parseFloat(dash));
        });
        return dashArray;
    }
    _addFloatPoints(dictionary: _PdfDictionary, key: string, value: number[]): void {
        if (value && value.length > 0) {
            dictionary.update(key, value);
        }
    }
    _addMeasureDictionary(dictionary: _PdfDictionary, annotation: any, annotationKeys: string[]): void { // eslint-disable-line
        const measureDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
        const aArray: _PdfDictionary[] = [];
        const dArray: _PdfDictionary[] = [];
        const xArray: _PdfDictionary[] = [];
        const tArray: _PdfDictionary[] = [];
        const vArray: _PdfDictionary[] = [];
        measureDictionary.set('A', aArray);
        measureDictionary.set('D', dArray);
        measureDictionary.set('X', xArray);
        measureDictionary.set('T', tArray);
        measureDictionary.set('V', vArray);
        if (annotationKeys.indexOf('ratevalue') !== -1) {
            this._addString(measureDictionary, 'R', annotation['ratevalue']);
        }
        if (annotationKeys.indexOf('subtype') !== -1) {
            this._addString(measureDictionary, 'Subtype', annotation['subtype']);
        }
        if (annotationKeys.indexOf('targetunitconversion') !== -1) {
            this._addString(measureDictionary, 'TargetUnitConversion', annotation['targetunitconversion']);
        }
        if (annotationKeys.indexOf('area') !== -1) {
            aArray.push(this._readDictionaryElements(annotation['area']));
        }
        if (annotationKeys.indexOf('distance') !== -1) {
            dArray.push(this._readDictionaryElements(annotation['distance']));
        }
        if (annotationKeys.indexOf('xformat') !== -1) {
            xArray.push(this._readDictionaryElements(annotation['xformat']));
        }
        if (annotationKeys.indexOf('tformat') !== -1) {
            tArray.push(this._readDictionaryElements(annotation['tformat']));
        }
        if (annotationKeys.indexOf('vformat') !== -1) {
            vArray.push(this._readDictionaryElements(annotation['vformat']));
        }
        if (annotationKeys.indexOf('type1') !== -1) {
            measureDictionary.set('Type', _PdfName.get('Measure'));
            const reference: _PdfReference = this._crossReference._getNextReference();
            measureDictionary.objId = reference.objectNumber + ' ' + reference.generationNumber;
            this._crossReference._cacheMap.set(reference, measureDictionary);
            dictionary.update('Measure', reference);
        }
    }
    _readDictionaryElements(elements: any): _PdfDictionary { // eslint-disable-line
        const keys: string[] = Object.keys(elements);
        const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
        if (keys && keys.length > 0) {
            keys.forEach((key: string) => {
                const value: any = elements[key]; // eslint-disable-line
                if (key && value) {
                    switch (key) {
                    case 'd':
                        dictionary.set('D', Number.parseFloat(value));
                        break;
                    case 'c':
                        dictionary.set('C', Number.parseFloat(value));
                        break;
                    case 'rt':
                        dictionary.set('RT', value);
                        break;
                    case 'rd':
                        dictionary.set('RD', value);
                        break;
                    case 'ss':
                        dictionary.set('SS', value);
                        break;
                    case 'u':
                        dictionary.set('U', value);
                        break;
                    case 'f':
                        dictionary.set('F', _PdfName.get(value));
                        break;
                    case 'fd':
                        dictionary.set('FD', value);
                        break;
                    case 'type':
                        dictionary.set('Type', _PdfName.get(value));
                        break;
                    }
                }
            });
        }
        return dictionary;
    }
    _addStreamData(dictionary: _PdfDictionary, data: Map<string, string>, values: string): void {
        const subtype: string = dictionary.get('Subtype').name;
        const bytes: number[] = _hexStringToByteArray(values, true) as number[];
        if (subtype === 'Sound') {
            const soundStream: _PdfContentStream = new _PdfContentStream(bytes);
            soundStream.dictionary._crossReference = this._crossReference;
            soundStream.dictionary.update('Type', _PdfName.get('Sound'));
            data.forEach((value: string, key: string) => {
                if (key && value) {
                    switch (key) {
                    case 'bits':
                    case 'rate':
                    case 'channels':
                        soundStream.dictionary.set(key, Number.parseInt(value, 10));
                        break;
                    case 'encoding':
                        soundStream.dictionary.set('E', _PdfName.get(value));
                        break;
                    case 'filter':
                        soundStream.dictionary.set('Filter', _PdfName.get('FlateDecode'));
                        break;
                    }
                }
            });
            soundStream.reference = this._crossReference._getNextReference();
            soundStream.dictionary.objId = soundStream.reference.objectNumber + ' ' + soundStream.reference.generationNumber;
            this._crossReference._cacheMap.set(soundStream.reference, soundStream);
            dictionary.update('Sound', soundStream.reference);
        } else if (subtype === 'FileAttachment') {
            const fileDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            fileDictionary.update('Type', _PdfName.get('Filespec'));
            const fileStream: _PdfContentStream = new _PdfContentStream(bytes);
            fileStream.dictionary._crossReference = this._crossReference;
            const param: _PdfDictionary = new _PdfDictionary(this._crossReference);
            data.forEach((value: string, key: string) => {
                if (key && value) {
                    let size: number;
                    switch (key) {
                    case 'file':
                        this._addString(fileDictionary, 'F', value);
                        this._addString(fileDictionary, 'UF', value);
                        break;
                    case 'size':
                        size = Number.parseInt(value, 10);
                        if (typeof size !== 'undefined') {
                            param.update('Size', size);
                            fileStream.dictionary.update('DL', size);
                        }
                        break;
                    case 'creation':
                        this._addString(param, 'CreationDate', value);
                        break;
                    case 'modification':
                        this._addString(param, 'ModificationDate', value);
                        break;
                    }
                }
            });
            fileStream.dictionary.update('Params', param);
            fileStream.dictionary.update('Filter', _PdfName.get('FlateDecode'));
            fileStream.reference = this._crossReference._getNextReference();
            fileStream.dictionary.objId = fileStream.reference.objectNumber + ' ' + fileStream.reference.generationNumber;
            this._crossReference._cacheMap.set(fileStream.reference, fileStream);
            const embeddedFile: _PdfDictionary = new _PdfDictionary(this._crossReference);
            embeddedFile.update('F', fileStream.reference);
            fileDictionary.update('EF', embeddedFile);
            const reference: _PdfReference = this._crossReference._getNextReference();
            fileDictionary.objId = reference.objectNumber + ' ' + reference.generationNumber;
            this._crossReference._cacheMap.set(reference, fileDictionary);
            dictionary.update('FS', reference);
        }
    }
    _addAppearanceData(dictionary: _PdfDictionary, data: string): void {
        if (data) {
            const encoded: Uint8Array = _decode(data, false) as Uint8Array;
            let decoded: string = _bytesToString(encoded);
            if (decoded.startsWith('{') && !decoded.endsWith('}')) {
                while (decoded.length > 0 && !decoded.endsWith('}')) {
                    decoded = decoded.substring(0, decoded.length - 1);
                }
            }
            const json: any = JSON.parse(decoded); // eslint-disable-line
            if (json) {
                const keys: string[] = Object.keys(json);
                if (keys && keys.length > 0 && keys.indexOf('ap') !== -1) {
                    dictionary.update('AP', this._parseDictionary(json['ap']));
                }
            }
        }
    }
    _parseAppearance(element: any): any { // eslint-disable-line
        let value: any; // eslint-disable-line
        const keys: string[] = Object.keys(element);
        if (keys.indexOf('name') !== -1) {
            value = _PdfName.get(element.name);
        } else if (keys.indexOf('int') !== -1) {
            value = Number.parseInt(element.int, 10);
        } else if (keys.indexOf('fixed') !== -1) {
            value = Number.parseFloat(element.fixed);
        } else if (keys.indexOf('string') !== -1) {
            value = element.string;
        } else if (keys.indexOf('boolean') !== -1) {
            value = element.boolean === 'true' ? true : false;
        } else if (keys.indexOf('array') !== -1) {
            const array: any[] = element.array; // eslint-disable-line
            value = [];
            array.forEach((element: any) => { // eslint-disable-line
                value.push(this._parseAppearance(element));
            });
        } else if (keys.indexOf('dict') !== -1) {
            const dictionary: _PdfDictionary = this._parseDictionary(element.dict);
            value = this._crossReference._getNextReference();
            dictionary.objId = value.objectNumber + ' ' + value.generationNumber;
            this._crossReference._cacheMap.set(value, dictionary);
        } else if (keys.indexOf('stream') !== -1) {
            const stream: _PdfContentStream = this._parseStream(element.stream);
            value = this._crossReference._getNextReference();
            stream.reference = value;
            stream.dictionary.objId = value.objectNumber + ' ' + value.generationNumber;
            this._crossReference._cacheMap.set(value, stream);
        } else if (keys.indexOf('unicodeData') !== -1) {
            value = _bytesToString(_hexStringToByteArray(element.unicodeData, false) as Uint8Array, true);
        } else {
            value = null;
        }
        return value;
    }
    _parseDictionary(element: any): _PdfDictionary { // eslint-disable-line
        const result: _PdfDictionary = new _PdfDictionary(this._crossReference);
        if (element) {
            const keys: string[] = Object.keys(element);
            if (keys && keys.length > 0) {
                keys.forEach((key: string) => {
                    const value: any = element[key]; // eslint-disable-line
                    if (key !== 'data') {
                        const primitive: any = this._parseAppearance(value); // eslint-disable-line
                        result.update(key, primitive);
                    }
                });
            }
        }
        return result;
    }
    _parseStream(element: any): _PdfContentStream { // eslint-disable-line
        let result: _PdfContentStream;
        const keys: string[] = Object.keys(element);
        if (element && keys.indexOf('data')) {
            const data: any = element.data; // eslint-disable-line
            let bytes: number[];
            if (data) {
                const dataKeys: string[] = Object.keys(data);
                if (dataKeys && dataKeys.indexOf('bytes') !== -1) {
                    const byteString: string = data.bytes;
                    if (byteString) {
                        bytes = _hexStringToByteArray(byteString, true) as number[];
                    }
                }
            }
            if (!bytes) {
                bytes = [];
            }
            const stream: _PdfContentStream = new _PdfContentStream(bytes);
            if (this._crossReference) {
                this._parseStreamElements(stream, element);
            } else {
                stream._pendingResources = JSON.stringify(element);
            }
            result = stream;
        }
        return result;
    }
    _parseStreamElements(stream: _PdfContentStream, element?: any): void { // eslint-disable-line
        if (typeof element === 'undefined' && stream._pendingResources) {
            element = JSON.parse(stream._pendingResources);
        }
        if (element) {
            const dictionary: _PdfDictionary = this._parseDictionary(element);
            let isImage: boolean = false;
            if (dictionary && dictionary.has('Subtype')) {
                const type: _PdfName = dictionary.get('Subtype');
                isImage = type && type.name === 'Image';
            }
            if (isImage) {
                stream._isCompress = false;
            } else {
                if (dictionary.has('Length')) {
                    delete dictionary._map.Length;
                }
                if (dictionary.has('Filter')) {
                    delete dictionary._map.Filter;
                }
            }
            stream.dictionary = dictionary;
        }
    }
    _getValidString(value: string): string {
        if (value.indexOf('\\') !== -1) {
            value = value.replace(/\\/g, '\\\\');
        }
        if (value.indexOf('"') !== -1) {
            value = value.replace(/"/g, '\\"');
        }
        if (value.indexOf('[') !== -1) {
            value = value.replace(/\[/g, '\\[');
        }
        if (value.indexOf(']') !== -1) {
            value = value.replace(/\[/g, '\\]');
        }
        if (value.indexOf('{') !== -1) {
            value = value.replace(/\[/g, '\\{');
        }
        if (value.indexOf('}') !== -1) {
            value = value.replace(/\}/g, '\\}');
        }
        if (value.indexOf('\n') !== -1) {
            value = value.replace(/\n/g, '\\n');
        }
        if (value.indexOf('\r') !== -1) {
            value = value.replace(/\r/g, '\\r');
        }
        return value;
    }
}
