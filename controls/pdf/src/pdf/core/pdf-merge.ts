import { PdfAnnotation } from './annotations/annotation';
import { PdfPageOrientation } from './enumerator';
import { PdfForm } from './form';
import { PdfField } from './form/field';
import { PdfTemplate } from './graphics/pdf-template';
import { _JsonDocument } from './import-export/json-document';
import { _PdfCrossReference } from './pdf-cross-reference';
import { PdfDocument, PdfPageSettings } from './pdf-document';
import { PdfBookmark, PdfBookmarkBase, PdfNamedDestination } from './pdf-outline';
import { PdfDestination, PdfPage } from './pdf-page';
import { PdfPageImportOptions } from './pdf-page-import-options';
import { _PdfDictionary, _PdfName, _PdfReference } from './pdf-primitives';

export class _PdfMergeHelper {
    _bookmarkHashTable: Map<PdfPage, PdfBookmarkBase[]>;
    _namedDestinations: any[] = []; // eslint-disable-line
    _bookmarks: any[] = []; // eslint-disable-line
    _fields: any[] = []; // eslint-disable-line
    _pageReference: Map<_PdfDictionary, PdfPage> = new Map<_PdfDictionary, PdfPage>();
    _bookmarksPageLinkReference: Map<_PdfReference, number> = new Map<_PdfReference, number>();
    _destination: any[] = []; // eslint-disable-line
    _newList: Map<_PdfReference, _PdfReference> = new Map<_PdfReference, _PdfReference>();
    _annotationLayer: Map<number, _PdfReference> = new Map<number, _PdfReference>();
    _isLayersPresent: boolean = false;
    _fieldNames: any[] = []; // eslint-disable-line
    _crossReference: _PdfCrossReference;
    _destinationDocument: PdfDocument;
    _options: PdfPageImportOptions = new PdfPageImportOptions();
    _kidsReference: any[] = []; // eslint-disable-line
    _formFieldsCollection: Map<number, PdfField> = new Map<number, PdfField>();
    _formFields: _PdfReference[] = [];
    _isDuplicatePage: boolean = false;
    _fieldCount: number = 0;
    constructor(crossReference: _PdfCrossReference, currentDocument: PdfDocument, pageReference: Map<_PdfDictionary, PdfPage>,
                options: PdfPageImportOptions) {
        this._crossReference = crossReference;
        this._destinationDocument = currentDocument;
        this._pageReference = pageReference;
        if (typeof options !== 'undefined') {
            this._options = options;
        }
    }
    _importPages(page: PdfPage, document: PdfDocument, index: number, layers: boolean, isCopiedPage: boolean): void {
        let template: PdfTemplate;
        let  newPage: PdfPage;
        const pageDictionary: _PdfDictionary = page._pageDictionary;
        this._isDuplicatePage = isCopiedPage;
        if (isCopiedPage) {
            if (typeof this._options.targetIndex !== 'undefined') {
                newPage = this._insertNewPage(page, this._options.targetIndex);
            } else {
                newPage = this._insertNewPage(page, page._pageIndex + 1);
            }
        } else {
            newPage = this._insertNewPage(page, index);
        }
        newPage._isDuplicate = true;
        if (isCopiedPage && this._options.optimizeResources) {
            const newContents: any[] = []; // eslint-disable-line
            pageDictionary.forEach((key: string, value: any) => { // eslint-disable-line
                if (key === 'Contents' && newContents.length === 0) {
                    let contents: any = value; // eslint-disable-line
                    if (contents instanceof _PdfReference) {
                        newPage._pageDictionary.update(key, contents);
                    } else if (contents instanceof Array) {
                        for (let i: number = 0; i < contents.length; i++) {
                            newContents.push(contents[Number.parseInt(i.toString(), 10)]);
                        }
                        newPage._pageDictionary.update(key, newContents);
                    }
                } else if (key !== 'MediaBox' && key !== 'CropBox' && key !== 'Parent' && key !== 'Annots' && key !== 'Contents' && key !== 'Rotate') {
                    newPage._pageDictionary.update(key, value);
                }
            });
        } else {
            template = page._contentTemplate;
            newPage.graphics.drawTemplate(template, {x: 0, y: 0, width: template._size[0], height: template._size[1]});
            this._pageReference.set(pageDictionary, newPage);
            if (!isCopiedPage) {
                this._bookmarksPageLinkReference.set(page._ref, newPage._pageIndex);
            }
        }
        if (pageDictionary.has('Annots')) {
            this._importAnnotation(page, newPage , document._crossReference);
        }
        if (typeof this._options !== 'undefined' && this._options.groupFormFields && document._catalog._catalogDictionary.has('AcroForm')) {
            this._groupFormFields(document.form, page, newPage, document._crossReference);
        } else if (document._catalog._catalogDictionary.has('AcroForm')) {
            this._importFormField(page, document.form, newPage, document._crossReference);
        }
        if (!isCopiedPage) {
            const bookMarkMap: Map<PdfPage, PdfBookmarkBase[]> = document._parseBookmarkDestination();
            if (bookMarkMap && bookMarkMap.has(page)) {
                const bookmarks: PdfBookmarkBase[] = bookMarkMap.get(page);
                for (let i: number = 0; i < bookmarks.length; i++) {
                    this._bookmarks.push(bookmarks[Number.parseInt(i.toString(), 10)]);
                }
            }
        }
        if ((!isCopiedPage && layers) || !this._options.optimizeResources) {
            this._mergeLayer(newPage._pageDictionary, pageDictionary, document._crossReference);
        }
        newPage._pageDictionary._updated = true;
    }
    _importAnnotation(page: PdfPage, newPage: PdfPage, crossReference: _PdfCrossReference): void {
        let jsonDocument: _JsonDocument = new _JsonDocument();
        let resourceTable: Map<string, string> = new Map<string, string>();
        let appearance: string = '';
        const array: any[] = []; // eslint-disable-line
        let dest: any[]; // eslint-disable-line
        let isDestination: boolean = false;
        const count: number = page.annotations.count;
        for (let i: number = 0; i < count; i++) {
            const annotation: PdfAnnotation = page.annotations.at(i);
            if (typeof annotation !== 'undefined') {
                if (annotation._dictionary.has('Dest')) {
                    dest = [];
                    const destinationArray: any = annotation._dictionary.get('Dest'); // eslint-disable-line
                    const destination: any = annotation._dictionary._get('Dest'); // eslint-disable-line
                    if (destinationArray instanceof Array) {
                        const destArray: any[]  = destinationArray; // eslint-disable-line
                        for (let j: number = 0; j < destArray.length; j++) {
                            dest.push(destArray[Number.parseInt(j.toString(), 10)]);
                        }
                        isDestination = true;
                    }
                    else if (destination instanceof _PdfReference) {
                        dest.push(destination);
                    }
                }
                if (dest && dest.length > 0) {
                    this._destination.push(dest);
                }
                if (annotation._dictionary.has('OC')) {
                    let reference: any = annotation._dictionary.getRaw('OC'); // eslint-disable-line
                    if (reference instanceof _PdfReference) {
                        this._annotationLayer.set(i, reference);
                    }
                }
                jsonDocument = new _JsonDocument();
                resourceTable = new Map<string, string>();
                jsonDocument._crossReference = crossReference;
                jsonDocument._isDuplicate = true;
                jsonDocument._writeObject(resourceTable, annotation._dictionary, annotation._dictionary, 'annot');
                appearance = jsonDocument._convertToJson(resourceTable);
                jsonDocument = new _JsonDocument();
                jsonDocument._crossReference = this._crossReference;
                const json: any = JSON.parse(appearance); // eslint-disable-line
                if (json) {
                    const entry: any = json['annot']; // eslint-disable-line
                    if (entry) {
                        const dict: any  = jsonDocument._parseDictionary(entry['dict']); // eslint-disable-line
                        const ref: _PdfReference = newPage._ref;
                        if (isDestination) {
                            dict.update('Dest', dest);
                        }
                        dict.update('P', ref);
                        const newReference: _PdfReference = this._crossReference._getNextReference();
                        this._crossReference._cacheMap.set(newReference, dict);
                        array.push(newReference);
                    }
                }
            }
            isDestination = false;
            dest = [];
        }
        if (array.length > 0) {
            newPage._pageDictionary.update('Annots', array);
        }
    }
    _groupFormFields(form: PdfForm, oldPage: PdfPage, newPage: PdfPage, crossReference: _PdfCrossReference): void {
        if (form) {
            let array: _PdfReference[] = [];
            if (newPage && newPage._pageDictionary && newPage._pageDictionary.has('Annots')) {
                array = newPage._pageDictionary.get('Annots');
            }
            let kidsArray: _PdfReference[] = [];
            if (oldPage._pageDictionary.has('Annots')) {
                kidsArray = oldPage._pageDictionary.get('Annots');
            }
            for (let i: number = 0; i < form.count; i++) {
                const field: PdfField = form.fieldAt(i);
                let existingkids: _PdfReference[] = [];
                const isTextbox : _PdfName = field._dictionary.get('FT');
                if (isTextbox.name.toString() === 'Tx') {
                    if (field._dictionary.has('Kids')) {
                        existingkids = field._dictionary.get('Kids');
                        if (existingkids.length > 1) {
                            for (let j: number = 0; j < existingkids.length; j++) {
                                let fieldItem: any = field.itemAt(j); // eslint-disable-line
                                if (fieldItem.page === oldPage) {
                                    array = this._combineFormFields(form, field, kidsArray, existingkids, newPage._ref, array, i);
                                    break;
                                }
                            }
                        } else if (existingkids.length === 1) {
                            if (field.page === oldPage) {
                                array = this._combineFormFields(form, field, kidsArray, existingkids, newPage._ref, array, i);
                            }
                        }
                    } else {
                        if (field.page === oldPage) {
                            array = this._combineFormFields(form, field, kidsArray, existingkids, newPage._ref, array, i);
                        }
                    }
                } else {
                    array = this._insertFormFields(i, crossReference, field, form, newPage._ref, array, kidsArray);
                }
            }
            if (array.length > 0) {
                newPage._pageDictionary.update('Annots', array);
            }
        }
    }
    _combineFormFields(form: PdfForm, field: PdfField, kidsArray: _PdfReference[], existingkids: _PdfReference[], ref: _PdfReference,
                       array: _PdfReference[], index: number) : _PdfReference[] {
        const fieldDictionary: _PdfDictionary = this._exportFormFieldDictionary(this._crossReference, field);
        if (fieldDictionary.has('Kids')) {
            const kids: _PdfReference[] = fieldDictionary.get('Kids');
            for (let j: number = 0; j < kids.length; j++) {
                if ((kidsArray.indexOf(existingkids[Number.parseInt(j.toString(), 10)]) !== -1)) {
                    const dictionary: _PdfDictionary = this._crossReference._fetch(kids[Number.parseInt(j.toString(), 10)]);
                    dictionary.update('P', ref);
                    array.push(kids[Number.parseInt(j.toString(), 10)]);
                    const oldDictionary: _PdfDictionary = this._crossReference._fetch(existingkids[Number.parseInt(j.toString(), 10)]);
                    oldDictionary.forEach((key:any, value: any) => { // eslint-disable-line
                        if (key === 'Parent') {
                            dictionary.update(key, value);
                        }
                    });
                    this._kidsReference.push(existingkids[Number.parseInt(j.toString(), 10)]);
                    existingkids.push(kids[Number.parseInt(j.toString(), 10)]);
                    dictionary._updated = true;
                    field._dictionary._updated = true;
                }
            }
        } else {
            const newFieldDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            if (fieldDictionary.has('Parent')) {
                newFieldDictionary.update('Parent', fieldDictionary.get('Parent'));
                delete field._dictionary._map.Parent;
            }
            if (fieldDictionary.has('FT')) {
                newFieldDictionary.update('FT', fieldDictionary.get('FT'));
                delete field._dictionary._map.FT;
                delete fieldDictionary._map.FT;
            }
            if (fieldDictionary.has('T')) {
                newFieldDictionary.update('T', fieldDictionary.get('T'));
                delete field._dictionary._map.T;
                delete fieldDictionary._map.T;
            }
            if (fieldDictionary.has('V')) {
                newFieldDictionary.update('V', fieldDictionary.get('V'));
            }
            if (fieldDictionary.has('DA')) {
                newFieldDictionary.update('DA', fieldDictionary.get('DA'));
                delete field._dictionary._map.DA;
                delete fieldDictionary._map.DA;
            }
            if (fieldDictionary.has('Ff')) {
                newFieldDictionary.update('Ff', fieldDictionary.get('Ff'));
                delete field._dictionary._map.Ff;
                delete fieldDictionary._map.Ff;
            }
            const kidsElement: _PdfReference[] = [];
            kidsElement.push(field._ref);
            const newFieldReference: _PdfReference = this._crossReference._getNextReference();
            newFieldDictionary.objId = newFieldReference.toString();
            this._crossReference._cacheMap.set(newFieldReference, newFieldDictionary);
            const newField: PdfField = form._parseFields(newFieldDictionary, newFieldReference);
            field._dictionary.update('Parent', newFieldReference);
            this._formFields.push(newFieldReference);
            form._parsedFields.set(index, newField);
            newField._dictionary._updated = true;
            const reference: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference, fieldDictionary);
            fieldDictionary.update('P', ref);
            fieldDictionary.update('Parent', newFieldReference);
            form._dictionary._updated = true;
            kidsElement.push(reference);
            newFieldDictionary.update('Kids', kidsElement);
            newField._kids = kidsElement;
            array.push(reference);
            this._formFieldsCollection.set(index, newField);
        }
        return array;
    }
    _importFormField(page: PdfPage, pdfForm: PdfForm, newPage: PdfPage, crossReference: _PdfCrossReference): void {
        let jsonDocument: _JsonDocument = new _JsonDocument();
        let appearance: string = '';
        const form: PdfForm = this._destinationDocument.form;
        let array: _PdfReference[] = [];
        if (newPage && newPage._pageDictionary && newPage._pageDictionary.has('Annots')) {
            array = newPage._pageDictionary.get('Annots');
        }
        let kidsArray: _PdfReference[] = [];
        let widgetArray: _PdfReference[] = [];
        if (this._destinationDocument.form._dictionary.has('Fields')) {
            this._fieldCount = this._destinationDocument.form._fields.length;
        }
        if (page._pageDictionary.has('Annots')) {
            widgetArray = page._pageDictionary.get('Annots');
        }
        for (let i: number = 0; i < pdfForm.count; ++i) {
            const pdfField: PdfField = pdfForm.fieldAt(i);
            if (pdfField._dictionary.has('Kids')) {
                kidsArray = pdfField._dictionary.get('Kids');
                if (kidsArray.length > 1) {
                    for (let j: number = 0; j < kidsArray.length; j++) {
                        let fieldItem: any = pdfField.itemAt(j); // eslint-disable-line
                        if (fieldItem.page === page) {
                            array = this._insertFormFields(i, crossReference, pdfField, form, newPage._ref, array, widgetArray);
                            break;
                        }
                    }
                } else if (kidsArray.length === 1) {
                    if (pdfField.page === page) {
                        array = this._insertFormFields(i, crossReference, pdfField, form, newPage._ref, array, widgetArray);
                    }
                }
            } else {
                if (pdfField.page === page) {
                    array = this._insertFormFields(i, crossReference, pdfField, form, newPage._ref, array, widgetArray);
                }
            }
        }
        if (pdfForm._dictionary.has('DR')) {
            const dr: _PdfDictionary = pdfForm._dictionary.get('DR');
            const resourceTable: Map<string, string> = new Map<string, string>();
            jsonDocument._crossReference = crossReference;
            jsonDocument._writeObject(resourceTable, dr, dr, 'dr');
            appearance = jsonDocument._convertToJson(resourceTable);
            jsonDocument = new _JsonDocument();
            jsonDocument._crossReference = this._crossReference;
            const json: any = JSON.parse(appearance); // eslint-disable-line
            const entry: any = json['dr']; // eslint-disable-line
            if (entry) {
                const drDictionary: any  = jsonDocument._parseDictionary(entry['dict']); // eslint-disable-line
                let font: any; // eslint-disable-line
                if (drDictionary.has('Font')) {
                    font = drDictionary.get('Font');
                }
                if (this._destinationDocument.form._dictionary.has('DR')) {
                    const curreneDR: _PdfDictionary = this._destinationDocument.form._dictionary.get('DR');
                    if (curreneDR.has('Font')) {
                        const currentFont: any = curreneDR.get('Font'); // eslint-disable-line
                        if (font) {
                            font.forEach((key: string, value: any) => { // eslint-disable-line
                                currentFont.set(key, value);
                            });
                        }
                        currentFont._updated = true;
                    }
                } else {
                    this._destinationDocument.form._dictionary.update('DR', drDictionary);
                }
            }
        }
        if (array.length > 0) {
            newPage._pageDictionary.update('Annots', array);
        }
    }
    _insertFormFields(index: number, crossReference: _PdfCrossReference, pdfField: PdfField, form: PdfForm, ref: _PdfReference,
                      array: _PdfReference[], kidsArray: _PdfReference[]): _PdfReference[] {
        const dict: _PdfDictionary = this._exportFormFieldDictionary(crossReference, pdfField);
        this._fieldNames.push(pdfField.name);
        const newReference: _PdfReference = this._crossReference._getNextReference();
        dict.objId = newReference.toString();
        const field: PdfField = form._parseFields(dict, ref);
        this._crossReference._cacheMap.set(newReference, field._dictionary);
        if (field._dictionary.has('Kids')) {
            const existingkids: _PdfReference[] = pdfField._dictionary.get('Kids');
            const kids: _PdfReference[] = field._dictionary.get('Kids');
            for (let j: number = 0; j < kids.length; j++) {
                if ((kidsArray.indexOf(existingkids[Number.parseInt(j.toString(), 10)]) !== -1)){
                    const dictionary: _PdfDictionary = this._crossReference._fetch(kids[Number.parseInt(j.toString(), 10)]);
                    dictionary.update('P', ref);
                    dictionary.update('Parent', newReference);
                    dictionary._updated = true;
                    array.push(kids[Number.parseInt(j.toString(), 10)]);
                }
            }
        } else {
            field._dictionary.update('P', ref);
            array.push(newReference);
        }
        field._dictionary._updated = true;
        this._fields.push(newReference);
        if (this._fieldCount > 0) {
            this._destinationDocument.form._parsedFields.set(this._fieldCount, field);
            field._annotationIndex = this._fieldCount;
            this._fieldCount++;
        } else {
            this._destinationDocument.form._parsedFields.set(index, field);
            field._annotationIndex = index;
        }
        return array;
    }
    _mergeFormFieldsWithDocument(): void {
        if (this._formFields.length > 0) {
            let pdfFields: any[] = this._destinationDocument.form._dictionary.get('Fields'); // eslint-disable-line
            for (let i: number = 0; i < pdfFields.length; i++) {
                if (!this._formFieldsCollection.has(i)) {
                    this._formFields.push(pdfFields[Number.parseInt(i.toString(), 10)]);
                }
            }
        }
        if (this._fields.length > 0) {
            let fieldsCount: number = 0;
            if (this._destinationDocument.form._dictionary.has('Fields')) {
                fieldsCount = this._destinationDocument.form._fields.length;
            }
            if (this._formFields.length === 0) {
                this._formFields = this._destinationDocument.form._fields;
            }
            if (fieldsCount > 0) {
                const pdfFields: _PdfReference[] = this._formFields;
                const exFieldCount: number = this._fields.length;
                let fieldName : string = '';
                for (let i: number = 0; i < exFieldCount; i++) {
                    const formFieldDictionary: _PdfDictionary = this._crossReference._fetch(this._fields[Number.parseInt(i.toString(), 10)]
                    );
                    if (formFieldDictionary.has('T')) {
                        fieldName = formFieldDictionary.get('T').toString();
                    }
                    const count: number = this._fieldNames.length;
                    for (let j: number = 0; j < count; j++) {
                        if (fieldName === this._fieldNames[Number.parseInt(j.toString(), 10)]) {
                            const name: string = fieldName + ' ' + i;
                            formFieldDictionary.update('T', name);
                            formFieldDictionary._updated = true;
                            break;
                        }
                    }
                }

                for (let i: number = 0; i < exFieldCount; i++) {
                    pdfFields.push(this._fields[Number.parseInt(i.toString(), 10)]);
                }
                this._destinationDocument.form._dictionary.set('Fields', pdfFields);
                this._destinationDocument.form._fields = pdfFields;
                if (!this._options.groupFormFields && !this._isDuplicatePage) {
                    this._destinationDocument.form._dictionary.update('NeedAppearances', false);
                }
                this._destinationDocument.form._dictionary._updated = true;
            } else {
                this._destinationDocument.form._dictionary.set('Fields', this._fields);
                this._destinationDocument.form._fields = this._fields;
                this._destinationDocument.form._dictionary._updated = true;
            }
        } else {
            if (this._formFields.length > 0) {
                this._destinationDocument.form._dictionary.set('Fields', this._formFields);
                this._destinationDocument.form._fields = this._formFields;
                this._destinationDocument.form._dictionary._updated = true;
            }
        }
    }
    _importLayers(ocProperties: _PdfDictionary, layers: boolean): void {
        this._isLayersPresent = layers;
        if (this._isLayersPresent && this._destinationDocument._catalog._catalogDictionary.has('OCProperties')) {
            const destinationOCProperties: _PdfDictionary = this._destinationDocument._catalog._catalogDictionary.get('OCProperties');
            const currentOCProperties: _PdfDictionary = ocProperties.get('OCProperties');
            if (destinationOCProperties.has('OCGs')) {
                const ocgs: any[] = destinationOCProperties.get('OCGs'); // eslint-disable-line
                const Cocgs: any[] = currentOCProperties.get('OCGs'); // eslint-disable-line
                if (ocgs.length > 0) {
                    for (let i: number = 0; i < Cocgs.length; i++) {
                        ocgs.push(Cocgs[Number.parseInt(i.toString(), 10)]);
                    }
                }
            }
            destinationOCProperties._updated = true;
            if (destinationOCProperties.has('D') && currentOCProperties.has('D')) {
                const curreneDefaultView: _PdfDictionary = destinationOCProperties.get('D');
                const existingDefaultView: _PdfDictionary = currentOCProperties.get('D');
                if (curreneDefaultView && existingDefaultView) {
                    if (curreneDefaultView.has('Order') && existingDefaultView.has('Order')) {
                        const order: any[] = curreneDefaultView.get('Order'); // eslint-disable-line
                        const existingOrder: any[] = existingDefaultView.get('Order'); // eslint-disable-line
                        if (order.length > 0 && existingOrder.length > 0) {
                            for (let i: number = 0; i < existingOrder.length; i++) {
                                order.push(existingOrder[Number.parseInt(i.toString(), 10)]);
                            }
                        }
                    } else if (existingDefaultView.has('Order')) {
                        curreneDefaultView.set('Order', existingDefaultView.get('Order'));
                    }
                    if (curreneDefaultView.has('RBGroups') && existingDefaultView.has('RBGroups')) {
                        const groups: any[] = curreneDefaultView.get('RBGroups'); // eslint-disable-line
                        const existingRBGroups: any[] = existingDefaultView.get('RBGroups'); // eslint-disable-line
                        if (groups.length > 0 && existingRBGroups.length > 0) {
                            for (let i: number = 0; i < existingRBGroups.length; i++) {
                                groups.push(existingRBGroups[Number.parseInt(i.toString(), 10)]);
                            }
                        }
                    } else if (existingDefaultView.has('RBGroups')) {
                        curreneDefaultView.set('RBGroups', existingDefaultView.get('RBGroups'));
                        curreneDefaultView._updated = true;
                    }
                    if (curreneDefaultView.has('ON') && existingDefaultView.has('ON')) {
                        const on: any[] = curreneDefaultView.get('ON'); // eslint-disable-line
                        const existingON: any[] = existingDefaultView.get('ON'); // eslint-disable-line
                        if (on.length > 0 && existingON.length > 0) {
                            for (let i: number = 0; i < existingON.length; i++) {
                                on.push(existingON[Number.parseInt(i.toString(), 10)]);
                            }
                        }
                    } else if (existingDefaultView.has('ON')) {
                        curreneDefaultView.set('ON', existingDefaultView.get('ON'));
                    }
                    if (curreneDefaultView.has('AS') && existingDefaultView.has('AS')) {
                        const elements: any[] = curreneDefaultView.get('AS'); // eslint-disable-line
                        const existingElements: any[] = existingDefaultView.get('AS'); // eslint-disable-line
                        if (elements.length > 0 && existingElements.length > 0) {
                            let asDictionary: _PdfDictionary = existingElements[0];
                            let currentASDictionary: _PdfDictionary = elements[0];
                            if (asDictionary instanceof _PdfReference && currentASDictionary instanceof _PdfReference) {
                                asDictionary = this._crossReference._fetch(asDictionary);
                                currentASDictionary = this._crossReference._fetch(currentASDictionary);
                            }
                            if (asDictionary.has('OCGs') && currentASDictionary.has('OCGs')) {
                                const usageGroup: any[] = asDictionary.get('OCGs'); // eslint-disable-line
                                const currentUsageGroup: any[] = currentASDictionary.get('OCGs'); // eslint-disable-line
                                if (usageGroup.length > 0 && currentUsageGroup.length > 0) {
                                    for (let i: number = 0; i < usageGroup.length; i++) {
                                        currentUsageGroup.push(usageGroup[Number.parseInt(i.toString(), 10)]);
                                    }
                                }
                            }
                            for (let i: number = 0; i < existingElements.length; i++) {
                                elements.push(existingElements[Number.parseInt(i.toString(), 10)]);
                            }
                        }
                    } else if (existingDefaultView.has('AS')) {
                        curreneDefaultView.set('AS', existingDefaultView.get('AS'));
                    }
                    if (curreneDefaultView.has('OFF') && existingDefaultView.has('OFF')) {
                        const off: any[] = curreneDefaultView.get('OFF'); // eslint-disable-line
                        const existingOff:any[] = existingDefaultView.get('OFF'); // eslint-disable-line
                        if (off.length > 0 && existingOff.length > 0) {
                            for (let i: number = 0; i < existingOff.length; i++) {
                                off.push(existingOff[Number.parseInt(i.toString(), 10)]);
                            }
                        }
                    } else if (existingDefaultView.has('OFF')) {
                        curreneDefaultView.set('OFF', existingDefaultView.get('OFF'));
                    }
                }
                if (curreneDefaultView.has('Locked') && existingDefaultView.has('Locked') ) {
                    const locked: any[] = curreneDefaultView.get('Locked'); // eslint-disable-line
                    const existingLocked: any[] = existingDefaultView.get('Locked'); // eslint-disable-line
                    if (locked.length > 0 && existingLocked.length > 0) {
                        for (let i: number = 0; i < existingLocked.length; i++) {
                            locked.push(existingLocked[Number.parseInt(i.toString(), 10)]);
                        }
                    }
                } else if (existingDefaultView.has('Locked')) {
                    curreneDefaultView.set('Locked', existingDefaultView.get('Locked'));
                }
            } else if (currentOCProperties.has('D')) {
                destinationOCProperties.set('D', currentOCProperties.get('D'));
            }
            destinationOCProperties._updated = true;
            this._destinationDocument._catalog._catalogDictionary._updated = true;
            this._crossReference._allowCatalog = true;
        } else if (this._isLayersPresent) {
            this._destinationDocument._catalog._catalogDictionary.update('OCProperties', ocProperties.get('OCProperties'));
            this._destinationDocument._catalog._catalogDictionary._updated = true;
            this._crossReference._allowCatalog = true;
        }
    }
    _mergeLayer(newPageDictionary: _PdfDictionary, oldPageDictionary: _PdfDictionary , crossReference: _PdfCrossReference): void {
        const res: _PdfDictionary = newPageDictionary.get('Resources');
        const xobject: _PdfDictionary = res.get('XObject');
        let xobjdict: any ; // eslint-disable-line
        xobject.forEach((key: any, value: any) => { // eslint-disable-line
            xobjdict = this._crossReference._fetch(value);
        });
        const resource: _PdfDictionary = xobjdict.dictionary.get('Resources');
        let XObject: any; // eslint-disable-line
        const oldPageList: Map<string, _PdfReference> = new Map<string, _PdfReference>();
        const oldPageResource: _PdfDictionary = oldPageDictionary.get('Resources');
        let layerDictionary: any; // eslint-disable-line
        let dict: any; // eslint-disable-line
        if (oldPageResource.has('Properties')) {
            layerDictionary = oldPageResource.get('Properties');
            layerDictionary.forEach((key: string , value: _PdfReference) => {
                oldPageList.set(key, value);
            });
            const properties: _PdfDictionary = new _PdfDictionary(this._crossReference);
            oldPageList.forEach((value: _PdfReference, key: string) => {
                this._newList.forEach((layerValue: _PdfReference, layerkey: _PdfReference) => {
                    if (value === layerkey) {
                        properties.set(key, layerValue);
                    }
                });
            });
            resource.set('Properties', properties);
            resource._updated = true;
            properties._updated = true;
        } else if (oldPageResource.has('XObject')){
            XObject = resource.get('XObject');
            layerDictionary = oldPageResource.get('XObject');
            layerDictionary.forEach((key: string , value: any) => { // eslint-disable-line
                if (value instanceof _PdfReference) {
                    dict = crossReference._fetch(value);
                    dict.dictionary.forEach((annotationKey: any, annotationValue: any) => { // eslint-disable-line
                        if (annotationKey === 'OC') {
                            this._newList.forEach((layerValue: _PdfReference, layerKey: _PdfReference) => {
                                if (layerKey === annotationValue) {
                                    if (XObject.has(key)) {
                                        const xobjDictionary: any = XObject.get(key); // eslint-disable-line
                                        xobjDictionary.dictionary.set(annotationKey, layerValue);
                                        xobjDictionary._updated = true;
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
        if (this._annotationLayer.size > 0) {
            let annotations: any = newPageDictionary._get('Annots'); // eslint-disable-line
            this._annotationLayer.forEach((reference, index) => { // eslint-disable-line
                const pdfAnnotation: any = annotations[Number.parseInt(index.toString(), 10)]; // eslint-disable-line
                const annotDictionary: _PdfDictionary = this._crossReference._fetch(pdfAnnotation);
                this._newList.forEach((value , oldReference) => { // eslint-disable-line
                    if (reference === oldReference) {
                        annotDictionary.set('OC', value);
                    }
                });
            });
        }
    }
    _exportBookmarks(document: PdfDocument, pageCount: number): void {
        if (this._bookmarks.length > 0) {
            const bookmark: PdfBookmarkBase[] = this._bookmarks;
            let currentBase: PdfBookmarkBase = this._destinationDocument.bookmarks;
            let current: PdfBookmarkBase = document.bookmarks;
            let bkCollection: any[]; // eslint-disable-line
            if (current) {
                const stack: {index: number, base: PdfBookmarkBase, kids: PdfBookmarkBase[]}[] = [];
                let nodeInformation: {index: number, base: PdfBookmarkBase, kids: PdfBookmarkBase[]} = {index: 0, base: currentBase, kids:
                current._bookMarkList};
                if (document.pageCount !== pageCount) {
                    nodeInformation = {index: 0, base: currentBase, kids: bookmark};
                    bkCollection = [];
                }
                do {
                    for (; nodeInformation.index < nodeInformation.kids.length; ) {
                        current = nodeInformation.kids[nodeInformation.index];
                        if (bookmark.indexOf(current) !== -1 && typeof bkCollection !== 'undefined' && bkCollection.indexOf((current as PdfBookmark).title) === -1) {
                            const bm: PdfBookmark = current as PdfBookmark;
                            const newBm: PdfBookmark = currentBase.add(bm.title);
                            const dest: PdfDestination = bm.destination;
                            newBm.color = bm.color;
                            newBm.textStyle = bm.textStyle;
                            let newDest: PdfDestination = null;
                            let newPage: PdfPage = null;
                            let page : PdfPage = null;
                            const nDest : PdfNamedDestination = bm.namedDestination;
                            if (nDest) {
                                if (nDest.destination) {
                                    page = nDest.destination.page;
                                    this._bookmarksPageLinkReference.forEach((value: number, key: _PdfReference) => {
                                        if (page._ref === key) {
                                            newPage = this._destinationDocument.getPage(value);
                                        }
                                    });
                                    if (newPage) {
                                        const newNameddest: PdfNamedDestination = this._getNamedDestination(nDest, newPage);
                                        newBm.namedDestination = newNameddest;
                                        delete newBm._dictionary._map.C;
                                        this._namedDestinations.push(newNameddest._title);
                                        const reference: _PdfReference = this._crossReference._getNextReference();
                                        this._crossReference._cacheMap.set(reference, newNameddest._dictionary);
                                        this._namedDestinations.push(reference);
                                    }
                                }
                            } else if (dest) {
                                page = dest.page;
                                this._bookmarksPageLinkReference.forEach((value: number, key: _PdfReference) => {
                                    if (page._ref === key) {
                                        newPage = this._destinationDocument.getPage(value);
                                    }
                                });
                                if (newPage) {
                                    newDest = new PdfDestination(newPage, dest.location);
                                    newDest.mode = dest.mode;
                                    newDest.zoom = dest.zoom;
                                    newDest.location = dest.location;
                                    newBm.destination = newDest;
                                }
                            }
                            currentBase = newBm;
                            bkCollection.push(newBm.title);
                        } else if (typeof bkCollection === 'undefined' || (typeof bkCollection !== 'undefined' && bkCollection.indexOf((current as PdfBookmark).title) === -1)) {
                            const bm: PdfBookmark = current as PdfBookmark;
                            const dest: PdfDestination = bm.destination;
                            let newDest: PdfDestination = null;
                            let newpage: PdfPage = null;
                            let page : PdfPage = null;
                            const nDest : PdfNamedDestination = bm.namedDestination;
                            if (document.pageCount === pageCount) {
                                const newBm: PdfBookmark = currentBase.add(bm.title);
                                if (bm._dictionary.has('A')) {
                                    newBm._dictionary.update('A', bm._dictionary.get('A'));
                                }
                                newBm.textStyle = bm.textStyle;
                                newBm.color = bm.color;
                                if (nDest) {
                                    if (nDest._destination) {
                                        page = nDest.destination.page;
                                        this._bookmarksPageLinkReference.forEach((value: number, key: _PdfReference) => {
                                            if (page._ref === key) {
                                                newpage = this._destinationDocument.getPage(value);
                                            }
                                        });
                                        if (newpage) {
                                            const newNameddest: PdfNamedDestination = this._getNamedDestination(nDest, newpage);
                                            newBm.namedDestination = newNameddest;
                                            delete newBm._dictionary._map.C;
                                            this._namedDestinations.push(newNameddest._title);
                                            const reference: _PdfReference = this._crossReference._getNextReference();
                                            this._crossReference._cacheMap.set(reference, newNameddest._dictionary);
                                            this._namedDestinations.push(reference);
                                        }
                                    }
                                } else if (dest) {
                                    page = dest.page;
                                    this._bookmarksPageLinkReference.forEach((value: number, key: _PdfReference) => {
                                        if (page._ref === key) {
                                            newpage = this._destinationDocument.getPage(value);
                                        }
                                    });
                                    if (newpage) {
                                        newDest = new PdfDestination(newpage, dest.location);
                                        newDest.mode = dest.mode;
                                        newDest.zoom = dest.zoom;
                                        newDest.location = dest.location;
                                        newBm.destination = newDest;
                                    }
                                }
                                currentBase = newBm;
                            }
                        }
                        nodeInformation.index += 1;
                        if (current.count > 0) {
                            stack.push(nodeInformation);
                            nodeInformation = { index: 0, base: currentBase, kids: current._bookMarkList};
                        }
                        else {
                            currentBase = nodeInformation.base;
                        }
                    }
                    if (stack.length > 0) {
                        nodeInformation = stack.pop();
                        while ((nodeInformation.index === nodeInformation.kids.length) && (stack.length > 0)) {
                            nodeInformation = stack.pop();
                        }
                        currentBase = nodeInformation.base;
                    }
                } while (nodeInformation.index < nodeInformation.kids.length);
            }
            let reference: _PdfReference;
            if (this._namedDestinations.length > 0) {
                let dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
                dictionary.update('Names', this._namedDestinations);
                reference = this._crossReference._getNextReference();
                this._crossReference._cacheMap.set(reference, dictionary);
                dictionary = new _PdfDictionary(this._crossReference);
                dictionary.update('Dests', reference);
                reference = this._crossReference._getNextReference();
                this._crossReference._cacheMap.set(reference, dictionary);
                this._destinationDocument._catalog._catalogDictionary.set('Names', reference);
            }
            this._destinationDocument._catalog._catalogDictionary._updated = true;
            this._destinationDocument._catalog._catalogDictionary.isCatalog = true;
            this._crossReference._allowCatalog = true;
        }
    }
    _getNamedDestination(nDest: PdfNamedDestination, page: PdfPage): PdfNamedDestination {
        const newNamedDest:any = new PdfNamedDestination(nDest.title); // eslint-disable-line
        newNamedDest.destination = this._getDestination(page, nDest.destination);
        return newNamedDest;
    }
    _getDestination(page: PdfPage, dest: PdfDestination): PdfDestination {
        const newDest: PdfDestination = new PdfDestination(page, dest.location);
        newDest._location = dest._location;
        newDest.mode = dest.mode;
        newDest.zoom = dest.zoom;
        newDest.location = dest.location;
        return newDest;
    }
    _writeObject(document: PdfDocument, table?: _PdfDictionary,
        value?: any, dictionary?: _PdfDictionary, key?: string, array?: any[], ref?: _PdfReference): void { // eslint-disable-line                 
        if (value instanceof _PdfName || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            this._writeDictionary(value, table, key, array, ref, null);
        } else if (Array.isArray(value)) {
            const list: any[] = []; // eslint-disable-line
            this._writeArray(document, list, value, dictionary);
            this._writeDictionary(null, table, key, array, ref, list);
        } else if (value instanceof _PdfDictionary) {
            const subTable: _PdfDictionary = new _PdfDictionary(this._crossReference);
            this._writePropertiesDictionary(document, subTable, value);
            this._writeDictionary(null, table, key, array, ref, subTable);
        } else if (value instanceof _PdfReference && this._crossReference) {
            this._writeObject(document, table, document._crossReference._fetch(value), dictionary, key, array, value);
        } else if (value === null || typeof value === 'undefined') {
            this._writeDictionary('null', table, key, array, ref, null);
        }
    }
    _writeDictionary(value: any, table: _PdfDictionary, key: string, array: any[] , ref: _PdfReference, list: any[]| // eslint-disable-line
    _PdfDictionary): void {
        if (key && value) {
            table.set(key, value);
        } else if (key && list) {
            table.set(key, list);
        } else if (list && !ref) {
            array.push(list);
        } else if (value) {
            array.push(value);
        } else if (ref) {
            let reference: _PdfReference;
            if (this._newList && this._newList.size > 0) {
                this._newList.forEach((value: _PdfReference, key: _PdfReference) => {
                    if (key === ref) {
                        reference = value;
                    }
                });
            }
            if (reference) {
                array.push(reference);
            } else {
                const layerList: _PdfDictionary = list as _PdfDictionary;
                reference = this._crossReference._getNextReference();
                this._crossReference._cacheMap.set(reference, layerList);
                layerList._updated = true;
                array.push(reference);
                this._newList.set(ref, reference);
            }
        }
    }
    _writeArray(document: PdfDocument, array: any[], value: any[], dictionary: _PdfDictionary): void { // eslint-disable-line
        for (let i: number = 0; i < value.length; i++) {
            this._writeObject(document, null, value[Number.parseInt(i.toString(), 10)], dictionary, null, array);
        }
    }
    _writePropertiesDictionary(document: PdfDocument, table: _PdfDictionary, dictionary: _PdfDictionary): void {
        if (dictionary && dictionary.size > 0) {
            dictionary.forEach((key: string, value: any) => { // eslint-disable-line
                this._writeObject(document, table, ((value instanceof _PdfReference) ? dictionary.get(key) : value), dictionary, key);
            });
        }
    }
    _fixDestinations(document: PdfDocument): void {
        const pageLinkReference: Map<_PdfDictionary, PdfPage> = this._pageReference;
        if (this._destination.length > 0) {
            for (let i: number = 0; i < this._destination.length; i++) {
                const dest: any = this._destination[Number.parseInt(i.toString(), 10)]; // eslint-disable-line
                if (dest instanceof Array) {
                    const destination: any = dest; // eslint-disable-line
                    if (destination.length > 0) {
                        const ref: any = document._crossReference._fetch(destination[0]); // eslint-disable-line
                        const index: PdfPage = pageLinkReference.get(ref) as PdfPage;
                        if (ref && pageLinkReference.has(ref) && index !== null) {
                            destination[0] = index._ref;
                        }
                        if (ref && pageLinkReference.has(ref) && index === null) {
                            destination[0] = null;
                        }
                    }
                }
            }
        }
    }
    _insertNewPage(page: PdfPage, index: number): PdfPage {
        let newPage: PdfPage;
        const pagesettings: PdfPageSettings = new PdfPageSettings();
        pagesettings.size = page.size;
        pagesettings.margins.left = 0;
        pagesettings.margins.top = 0;
        pagesettings.margins.right = 0;
        pagesettings.margins.bottom = 0;
        if (typeof this._options !== 'undefined' && typeof this._options.rotation !== 'undefined') {
            pagesettings.rotation = this._options.rotation;
        } else {
            pagesettings.rotation = page.rotation;
        }
        pagesettings.orientation = (page.size[0] > page.size[1]) ? PdfPageOrientation.landscape : PdfPageOrientation.portrait;
        if (typeof index !== 'undefined') {
            newPage = this._destinationDocument.addPage(index, pagesettings);
        } else {
            newPage = this._destinationDocument.addPage(pagesettings);
        }
        const pageDictionary: _PdfDictionary = page._pageDictionary;
        if (pageDictionary._get('MediaBox')) {
            const mBox: any = pageDictionary._get('MediaBox'); // eslint-disable-line
            newPage._pageDictionary.update('MediaBox', mBox);
        }
        if (pageDictionary._get('CropBox')) {
            const cBox: any = pageDictionary._get('CropBox'); // eslint-disable-line
            newPage._pageDictionary.update('CropBox', cBox);
        }
        if (typeof this._options.rotation !== 'undefined' || page._pageDictionary.has('Rotate') ) {
            let rotate: number;
            if (typeof this._options.rotation !== 'undefined') {
                rotate = Math.floor(this._options.rotation) * 90;
            } else {
                rotate = Math.floor(page.rotation) * 90;
            }
            rotate = rotate >= 360 ? rotate % 360 : rotate;
            newPage._pageDictionary.update('Rotate', rotate);
        }
        return newPage;
    }
    _exportFormFieldDictionary(crossReference: _PdfCrossReference, field: PdfField): _PdfDictionary {
        let fieldDictionary: _PdfDictionary;
        let jsonDocument: _JsonDocument = new _JsonDocument();
        const resourceTable: Map<string, string> = new Map<string, string>();
        jsonDocument._crossReference = crossReference;
        jsonDocument._writeObject(resourceTable, field._dictionary, field._dictionary, 'fields');
        const appearance: string = jsonDocument._convertToJson(resourceTable);
        jsonDocument = new _JsonDocument();
        jsonDocument._crossReference = this._crossReference;
        const json: any = JSON.parse(appearance); // eslint-disable-line
        if (json) {
            const entry: any = json['fields']; // eslint-disable-line
            if (entry) {
                fieldDictionary = jsonDocument._parseDictionary(entry['dict']);
            }
        }
        return fieldDictionary;
    }
    _objectDispose(): void {
        this. _bookmarkHashTable = new Map();
        this._namedDestinations = [];
        this._bookmarks = [];
        this._fields = [];
        this._pageReference = new Map();
        this._bookmarksPageLinkReference.clear();
        this._destination = [];
        this._newList = new Map();
        this._annotationLayer = new Map();
        this._fieldNames = [];
        this._destinationDocument.form._widgetReferences = [];
    }
}
