import { PdfListFieldItem, PdfRadioButtonListItem, PdfStateItem, PdfWidgetAnnotation } from './annotations/annotation';
import { PdfPageOrientation } from './enumerator';
import { PdfFont, PdfFontFamily, PdfFontStyle, PdfStandardFont } from './fonts/pdf-standard-font';
import { PdfButtonField, PdfCheckBoxField, PdfComboBoxField, PdfField, PdfListField, PdfRadioButtonListField, PdfSignatureField, PdfTextBoxField } from './form/field';
import { PdfForm } from './form/form';
import { PdfTemplate } from './graphics/pdf-template';
import { _PdfCrossReference } from './pdf-cross-reference';
import { PdfDocument, PdfPageSettings } from './pdf-document';
import { PdfBookmark, PdfBookmarkBase, PdfNamedDestination } from './pdf-outline';
import { PdfDestination, PdfPage } from './pdf-page';
import { PdfPageImportOptions } from './pdf-page-import-options';
import { _PdfDictionary, _PdfName, _PdfReference } from './pdf-primitives';
import { _getItemValue } from './utils';
import { _PdfBaseStream, _PdfContentStream, _PdfStream } from './base-stream';
import { PdfAnnotationCollection } from './annotations/annotation-collection';

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
    _fieldNames: string[] = [];
    _crossReference: _PdfCrossReference;
    _destinationDocument: PdfDocument;
    _sourceDocument: PdfDocument;
    _options: PdfPageImportOptions = new PdfPageImportOptions();
    _kidsReference: any[] = []; // eslint-disable-line
    _formFieldsCollection: Map<number, _PdfReference> = new Map<number, _PdfReference>();
    _formFields: _PdfReference[] = [];
    _isDuplicatePage: boolean = false;
    _fieldCount: number = 0;
    _copier: _PdfCopier;
    constructor(crossReference: _PdfCrossReference, destination: PdfDocument, source: PdfDocument,
                pageReference: Map<_PdfDictionary, PdfPage>, options: PdfPageImportOptions) {
        this._crossReference = crossReference;
        this._destinationDocument = destination;
        this._sourceDocument = source;
        this._pageReference = pageReference;
        if (typeof options !== 'undefined') {
            this._options = options;
        }
        this._copier = new _PdfCopier(this._crossReference, this._sourceDocument._crossReference);
    }
    _importPages(page: PdfPage, index: number, layers: boolean, isCopiedPage: boolean): void {
        let template: PdfTemplate;
        let  newPage: PdfPage;
        const pageDictionary: _PdfDictionary = page._pageDictionary;
        this._isDuplicatePage = isCopiedPage;
        if (typeof index === 'number') {
            newPage = this._insertNewPage(page, index);
        } else if (this._isDuplicatePage) {
            newPage = this._insertNewPage(page, page._pageIndex + 1);
        } else {
            newPage = this._insertNewPage(page);
        }
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
            template._content.dictionary.update('Resources', this._copier._copy(pageDictionary.getRaw('Resources')));
            this._pageReference.set(pageDictionary, newPage);
            if (!isCopiedPage) {
                this._bookmarksPageLinkReference.set(page._ref, newPage._pageIndex);
            }
        }
        if (pageDictionary.has('Annots')) {
            this._importAnnotation(page, newPage);
            if (typeof this._options !== 'undefined' && this._options.groupFormFields && this._sourceDocument._catalog._catalogDictionary.has('AcroForm')) {
                this._formFieldsGroupingSupport(this._sourceDocument.form, page, newPage);
            } else if (this._sourceDocument._catalog._catalogDictionary.has('AcroForm')) {
                this._importFormField(page, this._sourceDocument.form, newPage, this._sourceDocument._crossReference);
            }
        }
        if (!isCopiedPage) {
            const bookMarkMap: Map<PdfPage, PdfBookmarkBase[]> = this._sourceDocument._parseBookmarkDestination();
            if (bookMarkMap && bookMarkMap.has(page)) {
                const bookmarks: PdfBookmarkBase[] = bookMarkMap.get(page);
                for (let i: number = 0; i < bookmarks.length; i++) {
                    this._bookmarks.push(bookmarks[Number.parseInt(i.toString(), 10)]);
                }
            }
        }
        if ((!isCopiedPage && layers) || !this._options.optimizeResources) {
            this._mergeLayer(newPage._pageDictionary, pageDictionary, this._sourceDocument._crossReference);
        }
        newPage._pageDictionary._updated = true;
    }
    _importAnnotation(page: PdfPage, newPage: PdfPage): void {
        const array: any[] = []; // eslint-disable-line
        let dest: any[]; // eslint-disable-line
        let isDestination: boolean = false;
        const oldCollection: PdfAnnotationCollection = page.annotations;
        const count: number = oldCollection.count;
        for (let i: number = 0; i < count; i++) {
            const annotationReference: _PdfReference = oldCollection._annotations[Number.parseInt(i.toString(), 10)];
            if (annotationReference) {
                const annotationDictionary: _PdfDictionary = this._sourceDocument._crossReference._fetch(annotationReference);
                if (annotationDictionary) {
                    if (annotationDictionary.has('Dest')) {
                        dest = [];
                        const destinationArray: any = annotationDictionary.get('Dest'); // eslint-disable-line
                        const destination: any = annotationDictionary._get('Dest'); // eslint-disable-line
                        if (destinationArray instanceof Array) {
                            const destArray: any[] = destinationArray; // eslint-disable-line
                            for (let j: number = 0; j < destArray.length; j++) {
                                dest.push(destArray[Number.parseInt(j.toString(), 10)]);
                            }
                            isDestination = true;
                        } else if (destination instanceof _PdfReference) {
                            dest.push(destination);
                        }
                    }
                    if (dest && dest.length > 0) {
                        this._destination.push(dest);
                    }
                    if (annotationDictionary.has('OC')) {
                        const reference: any = annotationDictionary.getRaw('OC'); // eslint-disable-line
                        if (reference instanceof _PdfReference) {
                            this._annotationLayer.set(i, reference);
                        }
                    }
                    const copiedAnnotationReference: _PdfReference = this._copier._copy(annotationReference);
                    const copiedAnnotationDictionary: _PdfDictionary = this._destinationDocument._crossReference.
                        _fetch(copiedAnnotationReference);
                    if (isDestination) {
                        copiedAnnotationDictionary.update('Dest', dest);
                    }
                    copiedAnnotationDictionary.update('P', newPage._ref);
                    this._crossReference._cacheMap.set(copiedAnnotationReference, copiedAnnotationDictionary);
                    array.push(copiedAnnotationReference);
                }
            }
            isDestination = false;
            dest = [];
        }
        if (array.length > 0) {
            newPage._pageDictionary.update('Annots', array);
        }
    }
    _formFieldsGroupingSupport(form: PdfForm, oldPage: PdfPage, newPage: PdfPage): void {
        let array: _PdfReference[] = [];
        const fieldNames: string[] = [];
        let kidsArray: _PdfReference[] = [];
        let formFields: PdfForm;
        let drEntry: _PdfDictionary = form._dictionary.get('DR');
        if (form._dictionary.has('DR'))  {
            drEntry = form._dictionary.get('DR');
        }
        if (newPage._pageDictionary.has('Annots')) {
            array = newPage._pageDictionary.get('Annots');
        }
        if (oldPage._pageDictionary.has('Annots')) {
            kidsArray = oldPage._pageDictionary.get('Annots');
        }
        if (!this._isDuplicatePage) {
            formFields = this._destinationDocument.form;
            this._fieldCount = formFields.count;
            for (let k: number = 0; k < this._fieldCount; k++) {
                fieldNames.push(formFields.fieldAt(k).name);
            }
        }
        for (let i: number = 0; i < form.count; i++) {
            const field: PdfField = form.fieldAt(i);
            let formField: PdfField;
            let destinationKids: _PdfReference[] = [];
            const sourceKids: _PdfReference[] = field._dictionary.get('Kids');
            if (fieldNames.indexOf(field.name) !== -1 || this._isDuplicatePage) {
                if (!this._isDuplicatePage) {
                    formField = formFields.fieldAt(fieldNames.indexOf(field.name));
                    if (formField._dictionary.get('Kids')) {
                        destinationKids = formField._dictionary.get('Kids');
                    }
                } else {
                    formField = field;
                    destinationKids = sourceKids;
                }
                field._isDuplicatePage = true;
                if ((field instanceof PdfSignatureField && formField instanceof PdfSignatureField) || !(field instanceof
                    PdfSignatureField)) {
                    if (sourceKids !== undefined && sourceKids.length > 0) {
                        for (let j: number = 0; j < sourceKids.length; j++) {
                            const fieldItem = field.itemAt(j); // eslint-disable-line
                            if (fieldItem.page === oldPage) {
                                formField._page = newPage;
                                array = this._groupFormFieldsKids(formField, field, kidsArray, destinationKids, sourceKids, newPage._ref,
                                                                  array, j, i, drEntry, fieldItem);
                            }
                        }
                    } else {
                        array = this._groupFormFieldsKids(formField, field, kidsArray, destinationKids, sourceKids, newPage._ref, array,
                                                          0, i, drEntry);
                    }
                }
            } else {
                array = this._insertFormFields(i, form._crossReference, field, form, newPage._ref, array, kidsArray);
            }
        }
        if (array.length > 0) {
            newPage._pageDictionary.update('Annots', array);
        }
    }
    _groupFormFieldsKids(destinationField: PdfField, field: PdfField, kidsArray: _PdfReference[], destKids: _PdfReference[], oldKids:
                         _PdfReference[], ref: _PdfReference, array: _PdfReference[], index?: number, fieldIndex?: number, drEntry?: _PdfDictionary, widget?: any) : _PdfReference[] { // eslint-disable-line
        if (field._dictionary.has('Kids') && destinationField._dictionary.has('Kids')) {
            if (kidsArray.indexOf(oldKids[Number.parseInt(index.toString(), 10)]) !== -1) {
                const oldDictionary: _PdfDictionary = field._crossReference._fetch(oldKids[Number.parseInt(index.toString(), 10)]);
                const dictionary: _PdfDictionary = this._copier._copyDictionary(oldDictionary, !this._isDuplicatePage);
                dictionary.update('P', ref);
                const reference: _PdfReference = this._crossReference._getNextReference();
                this._crossReference._cacheMap.set(reference, dictionary);
                array.push(reference);
                dictionary.update('Parent', destinationField._ref);
                destKids.push(reference);
                dictionary._updated = true;
                destinationField._dictionary._updated = true;
                if (!this._isDuplicatePage) {
                    if ((destinationField instanceof PdfTextBoxField || destinationField instanceof PdfButtonField || destinationField instanceof PdfComboBoxField) && dictionary.has('AS')) {
                        delete dictionary._map.AS;
                    }
                    this._createAppearance(destinationField, field, oldDictionary, dictionary, drEntry, widget);
                }
            }
        } else if (field._dictionary.has('Kids') && !destinationField._dictionary.has('Kids') || this._isDuplicatePage) {
            const fieldDictionary: _PdfDictionary = this._copier._copyDictionary(destinationField._dictionary, !this._isDuplicatePage);
            this._updateFieldsWithKids(destinationField, field, fieldDictionary, index, fieldIndex, ref, oldKids, array, drEntry,
                                       destinationField._dictionary);
        } else if ((!field._dictionary.has('Kids') && destinationField._dictionary.has('Kids'))) {
            const fieldDict: _PdfDictionary = this._copier._copyDictionary(field._dictionary);
            this._updateFieldDictionary(fieldDict, ref, destinationField._ref);
            const reference: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference, fieldDict);
            destKids.push(reference);
            array.push(reference);
            destinationField._dictionary._updated = true;
            this._createAppearance(destinationField, field, field._dictionary, fieldDict, drEntry, widget);
        } else if (!field._dictionary.has('Kids') && !destinationField._dictionary.has('Kids')) {
            const fieldDictionary: _PdfDictionary = this._copier._copyDictionary(destinationField._dictionary);
            const formFieldDict: _PdfDictionary = this._copier._copyDictionary(field._dictionary, !this._isDuplicatePage);
            this._removeFieldDictionary(formFieldDict, ['Parent', 'FT', 'T', 'Ff']);
            formFieldDict.update('P', ref);
            this._updateFieldsWithKids(destinationField, field, fieldDictionary, index, fieldIndex, ref, oldKids, array, drEntry ,
                                       formFieldDict);
        }
        return array;
    }
    _updateFieldsWithKids(destinationField: PdfField, field: PdfField, fieldDictionary: _PdfDictionary, index: number, fieldIndex: number,
                          ref: _PdfReference, oldKids: _PdfReference[], array: _PdfReference[], drEntry: _PdfDictionary,
                          formFieldDictionary?: _PdfDictionary): void {
        const newFieldReference: _PdfReference = this._crossReference._getNextReference();
        const newFieldDict: _PdfDictionary = this._createNewFieldDictionary(fieldDictionary, destinationField._dictionary);
        newFieldDict.objId = newFieldReference.toString();
        this._crossReference._cacheMap.set(newFieldReference, newFieldDict);
        const newField: PdfField = this._destinationDocument.form._parseFields(newFieldDict, newFieldReference);
        destinationField._dictionary.update('Parent', newFieldReference);
        newField._dictionary._updated = true;
        this._updateFieldDictionary(fieldDictionary, ref, newFieldReference);
        this._destinationDocument.form._dictionary._updated = true;
        let oldDictionary: _PdfDictionary;
        if (oldKids !== undefined && oldKids.length > 0) {
            oldDictionary = field._crossReference._fetch(oldKids[Number.parseInt(index.toString(), 10)]);
        } else {
            oldDictionary = formFieldDictionary;
        }
        const dictionary: _PdfDictionary = this._copier._copyDictionary(oldDictionary, !this._isDuplicatePage);
        if ((destinationField instanceof PdfTextBoxField || destinationField instanceof PdfButtonField || destinationField instanceof PdfComboBoxField) && dictionary.has('AS')) {
            delete dictionary._map.AS;
        }
        const reference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(reference, dictionary);
        dictionary.update('P', ref);
        array.push(reference);
        dictionary.update('Parent', newField._ref);
        const kidsElement: _PdfReference[] = [];
        kidsElement.push(destinationField._ref);
        kidsElement.push(reference);
        dictionary._updated = true;
        destinationField._dictionary._updated = true;
        newFieldDict.update('Kids', kidsElement);
        newField._kids = kidsElement;
        this._formFieldsCollection.set(fieldIndex, newFieldReference);
        this._destinationDocument.form._parsedFields.set(fieldIndex, newField);
        if (!this._isDuplicatePage) {
            this._createAppearance(newField, field, oldDictionary, dictionary, drEntry);
        }
        newFieldDict._updated = true;
    }
    _removeFieldDictionary(dictionary: _PdfDictionary, keys: string[]): _PdfDictionary {
        keys.forEach(key => { // eslint-disable-line
            if (dictionary.has(key))  {
                delete dictionary._map[key]; // eslint-disable-line
            }
        });
        return dictionary;
    }
    _updateFieldDictionary(dictionary: _PdfDictionary, pageRef: _PdfReference, parentRef: _PdfReference): void {
        dictionary = this._removeFieldDictionary(dictionary, ['Parent', 'FT', 'T', 'Ff']);
        dictionary.update('P', pageRef);
        dictionary.update('Parent', parentRef);
        dictionary._updated = true;
    }
    _createNewFieldDictionary(fieldDictionary: _PdfDictionary, destDictionary: _PdfDictionary): _PdfDictionary {
        const newFieldDict: _PdfDictionary = new _PdfDictionary(this._crossReference);
        ['Parent', 'FT', 'T', 'V', 'Ff', 'TU', 'Opt', 'I'].forEach(key => { // eslint-disable-line
            if (fieldDictionary.has(key)) {
                newFieldDict.update(key, fieldDictionary.get(key));
                delete fieldDictionary._map[key]; // eslint-disable-line
                delete destDictionary._map[key]; // eslint-disable-line
            }
        });
        return newFieldDict;
    }
    _getItemStyle(item: any, field: PdfField): void { // eslint-disable-line
        const mkDictionary: _PdfDictionary = item._dictionary.get('MK');
        if (mkDictionary && mkDictionary.has('CA')) {
            item._styleText = mkDictionary.get('CA').charAt(0);
        } else {
            item._styleText = (field instanceof PdfRadioButtonListField) ? 'l' : '4';
        }
    }
    _createAppearance(destinationField: PdfField, field: PdfField, oldDictionary: _PdfDictionary, dictionary: _PdfDictionary,
                      drEntry: _PdfDictionary, widget?: any): void { // eslint-disable-line
        const previousIndex: number = destinationField._kidsCount - 1;
        let itemValue: string;
        if (destinationField instanceof PdfCheckBoxField) {
            const item: PdfStateItem = destinationField.itemAt(previousIndex);
            item._enableGrouping = true;
            this._getItemStyle(item, destinationField);
            if (field instanceof PdfRadioButtonListField) {
                item._dictionary.update('AS', _PdfName.get('Off'));
                itemValue = _getItemValue(oldDictionary);
            } else {
                item._postProcess(destinationField.checked ? 'Yes' : 'Off');
            }
            destinationField._drawAppearance(item, itemValue);
        } else if (destinationField instanceof PdfRadioButtonListField) {
            const item: PdfRadioButtonListItem = destinationField.itemAt(previousIndex);
            this._getItemStyle(item, destinationField);
            if (item._dictionary.has('AS')) {
                item._postProcess((item._dictionary.get('AS') as _PdfName).name);
            } else {
                item._postProcess('Off');
            }
            item._enableGrouping = true;
            destinationField._enableGrouping = true;
            destinationField._drawAppearance(item);
        } else if (destinationField instanceof PdfListField)  {
            const item: PdfListFieldItem = destinationField.itemAt(previousIndex);
            if (typeof widget !== 'undefined') {
                item.rotationAngle = widget.rotationAngle;
            }
            if (item && !destinationField._checkFieldFlag(item._dictionary)) {
                item._enableGrouping = true;
                const template: PdfTemplate = destinationField._createAppearance(item);
                destinationField._addAppearance(item._dictionary, template, 'N');
                item._dictionary._updated = true;
            }
        } else if (destinationField instanceof PdfTextBoxField || destinationField instanceof PdfButtonField || destinationField instanceof
                   PdfSignatureField) {
            const widgetAnnotation: PdfWidgetAnnotation = PdfWidgetAnnotation._load(dictionary, this._crossReference);
            if (typeof widget !== 'undefined' && widget !== null && destinationField instanceof PdfSignatureField) {
                destinationField._createAppearance(widget, false);
            } else {
                widgetAnnotation.setAppearance(true);
                widgetAnnotation._enableGrouping = true;
                let pdfFont: PdfFont;
                if (typeof widget !== 'undefined' && widget !== null) {
                    pdfFont = this._obtainFont(widget._dictionary, drEntry);
                } else {
                    pdfFont = this._obtainFont(dictionary, drEntry);
                }
                widgetAnnotation._pdfFont = pdfFont;
                if (destinationField instanceof PdfSignatureField) {
                    destinationField._createAppearance(widgetAnnotation, false);
                } else {
                    destinationField._postProcess(false, widgetAnnotation);
                }
            }
        }
    }
    _obtainFont(item: _PdfDictionary, formDictionary: _PdfDictionary): PdfFont {
        let fontFamily: string = '';
        let fontSize: number = 8;
        let pdfFont: PdfFont;
        if (item && (item.has('DS') || item.has('DA'))) {
            if (item.has('DS')) {
                const collection: string[] = item.get('DS').split(';');
                for (let i: number = 0; i < collection.length; i++) {
                    const entry: string[] = collection[Number.parseInt(i.toString(), 10)].split(':');
                    if (collection[Number.parseInt(i.toString(), 10)].indexOf('font-family') !== -1) {
                        fontFamily = entry[1];
                    } else if (collection[Number.parseInt(i.toString(), 10)].indexOf('font-style') === -1 && collection[Number.parseInt(i.toString(), 10)].indexOf('font') !== -1) {
                        const name: string = entry[1];
                        const split: string[] = name.split(' ');
                        for (let j: number = 0; j < split.length; j++) {
                            if (split[Number.parseInt(j.toString(), 10)] !== '' && !split[Number.parseInt(j.toString(), 10)].endsWith('pt')) {
                                fontFamily += split[Number.parseInt(j.toString(), 10)] + ' ';
                            }
                        }
                        while (fontFamily !== ' ' && fontFamily.endsWith(' ')) {
                            fontFamily = fontFamily.substring(0, fontFamily.length - 2);
                        }
                        if (fontFamily.indexOf(',') !== -1) {
                            fontFamily = fontFamily.split(',')[0];
                        }
                    }
                }
            } else {
                const value: string = item.get('DA');
                if (value && value !== '' && value.indexOf('Tf') !== -1) {
                    const textCollection: string[] = value.split(' ');
                    for (let i: number = 0; i < textCollection.length; i++) {
                        if (textCollection[Number.parseInt(i.toString(), 10)].indexOf('Tf') !== -1) {
                            fontFamily = textCollection[i - 2];
                            while (fontFamily !== '' && fontFamily.length > 1 && fontFamily[0] === '/') {
                                fontFamily = fontFamily.substring(1);
                            }
                            fontSize = Number.parseFloat(textCollection[i - 1]);
                        }
                    }
                    if (fontSize === 0) {
                        fontSize = 8;
                    }
                }
            }
        }
        fontFamily = fontFamily.trim();
        let fontStyle: PdfFontStyle = PdfFontStyle.regular;
        let baseFontName: string;
        if (typeof formDictionary != 'undefined' && formDictionary.has('Font')) {
            const dictionary: _PdfDictionary = formDictionary.get('Font').get(fontFamily);
            if (typeof dictionary !== 'undefined') {
                baseFontName = dictionary.get('BaseFont').name;
                fontStyle = this._getFontStyle(baseFontName);
            }
        }
        switch (fontFamily) {
        case 'Helv':
            pdfFont = new PdfStandardFont(PdfFontFamily.helvetica, fontSize, fontStyle);
            break;
        case 'Courier':
        case 'Cour':
            pdfFont = new PdfStandardFont(PdfFontFamily.courier, fontSize, fontStyle);
            break;
        case 'Symb':
            pdfFont = new PdfStandardFont(PdfFontFamily.symbol, fontSize, fontStyle);
            break;
        case 'TiRo':
        case 'TiIt':
            pdfFont = new PdfStandardFont(PdfFontFamily.timesRoman, fontSize, fontStyle);
            break;
        case 'ZaDb':
            pdfFont = new PdfStandardFont(PdfFontFamily.zapfDingbats, fontSize, fontStyle);
            break;
        default:
            pdfFont = new PdfStandardFont(PdfFontFamily.helvetica, fontSize, fontStyle);
            break;
        }
        return pdfFont;
    }
    _getFontStyle(fontStyle: string): PdfFontStyle {
        let style: PdfFontStyle = PdfFontStyle.regular;
        if (fontStyle.includes('Bold')) {
            style = PdfFontStyle.bold;
        } else if (fontStyle.includes('Italic')) {
            style = PdfFontStyle.italic;
        }
        return style;
    }
    _importFormField(page: PdfPage, pdfForm: PdfForm, newPage: PdfPage, crossReference: _PdfCrossReference): void {
        const form: PdfForm = this._destinationDocument.form;
        let array: _PdfReference[] = [];
        if (newPage && newPage._pageDictionary && newPage._pageDictionary.has('Annots')) {
            array = newPage._pageDictionary.get('Annots');
        }
        let kidsArray: _PdfReference[] = [];
        let widgetArray: _PdfReference[] = [];
        if (this._destinationDocument.form._dictionary.has('Fields')) {
            const formFields: PdfForm = this._destinationDocument.form;
            this._fieldCount = formFields.count;
            for (let k: number = 0; k < this._fieldCount; k++) {
                const name: string = formFields.fieldAt(k).name;
                this._fieldNames.push(name);
            }
        }
        if (page._pageDictionary.has('Annots')) {
            widgetArray = page._pageDictionary.get('Annots');
        }
        const count: number = pdfForm.count;
        for (let i: number = 0; i < count; ++i) {
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
            const drDictionary: any  = this._copier._copyDictionary(dr); // eslint-disable-line
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
        if (array.length > 0) {
            newPage._pageDictionary.update('Annots', array);
        }
    }
    _insertFormFields(index: number, crossReference: _PdfCrossReference, pdfField: PdfField, form: PdfForm, ref: _PdfReference,
                      array: _PdfReference[], kidsArray: _PdfReference[]): _PdfReference[] {
        let dictionary: _PdfDictionary = new _PdfDictionary();
        if (pdfField._dictionary.has('Kids')) {
            pdfField._dictionary.forEach((key: any, value: any) => { // eslint-disable-line
                if (key !== 'Kids') {
                    dictionary.update(key, value);
                }
            });
        } else {
            dictionary = this._copier._copyDictionary(pdfField._dictionary);
        }
        const newReference: _PdfReference = this._crossReference._getNextReference();
        dictionary.objId = newReference.toString();
        const field: PdfField = form._parseFields(dictionary, ref);
        this._crossReference._cacheMap.set(newReference, field._dictionary);
        if (pdfField._dictionary.has('Kids')) {
            const oldKids: _PdfReference[] = pdfField._dictionary.get('Kids');
            const kids: _PdfReference[] = [];
            for (let j: number = 0; j < oldKids.length ; j++) {
                if ((kidsArray.indexOf(oldKids[Number.parseInt(j.toString(), 10)]) !== -1)) {
                    const oldDictionary: _PdfDictionary = pdfField._crossReference._fetch(oldKids[Number.parseInt(j.toString(), 10)]);
                    const dict: _PdfDictionary = this._copier._copyDictionary(oldDictionary);
                    dict.update('P', ref);
                    dict.update('Parent', newReference);
                    dict._updated = true;
                    const reference: _PdfReference = this._crossReference._getNextReference();
                    this._crossReference._cacheMap.set(reference, dict);
                    array.push(reference);
                    kids.push(reference);
                }
            }
            dictionary.update('Kids', kids);
            field._kids = kids;
        } else {
            field._dictionary.update('P', ref);
            array.push(newReference);
        }
        field._dictionary._updated = true;
        let  i: number = 0;
        let fieldName: string = field.name;
        let modified: boolean = false;
        while (this._fieldNames.indexOf(fieldName) !== -1) {
            fieldName = field.name + i;
            modified = true;
            ++i;
        }
        if (modified) {
            field._dictionary.update('T', fieldName);
            field._name = fieldName;
        }
        field._dictionary._updated = true;
        if (this._fieldCount > 0) {
            this._destinationDocument.form._parsedFields.set(this._fieldCount, field);
            field._annotationIndex = this._fieldCount;
            this._fieldCount++;
        } else {
            this._destinationDocument.form._parsedFields.set(index, field);
            field._annotationIndex = index;
        }
        this._destinationDocument.form._fields.push(newReference);
        return array;
    }
    _mergeFormFieldsWithDocument(): void {
        let pdfFields: _PdfReference[];
        if (this._formFieldsCollection.size > 0) {
            pdfFields = this._destinationDocument.form._dictionary.get('Fields');
            this._formFieldsCollection.forEach((value: _PdfReference, key: number) => {
                pdfFields[Number.parseInt(key.toString(), 10)] = value;
            });
        } else {
            pdfFields = this._destinationDocument.form._fields;
        }
        if (this._destinationDocument.form._dictionary.get('NeedAppearances')) {
            this._destinationDocument.form._dictionary.set('NeedAppearances', false);
        }
        this._destinationDocument.form._dictionary.set('Fields', pdfFields);
        this._destinationDocument.form._fields = pdfFields;
        this._destinationDocument.form._dictionary._updated = true;
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
                    if (destination.length > 0 && destination[0] && destination[0] instanceof _PdfReference) {
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
    _insertNewPage(page: PdfPage, index?: number): PdfPage {
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
    _objectDispose(): void {
        this. _bookmarkHashTable = new Map();
        this._namedDestinations = [];
        this._bookmarks = [];
        this._pageReference = new Map();
        this._bookmarksPageLinkReference.clear();
        this._destination = [];
        this._newList = new Map();
        this._annotationLayer = new Map();
        this._fieldNames = [];
        if (this._destinationDocument && this._destinationDocument._form && this._destinationDocument._form._widgetReferences) {
            this._destinationDocument._form._widgetReferences = [];
        }
    }
}
export class _PdfCopier {
    _traversedObjects: Map<_PdfReference, _PdfReference> = new Map<_PdfReference, _PdfReference>();
    _targetCrossReference: _PdfCrossReference;
    _sourceCrossReference: _PdfCrossReference;
    _isGroupingSupport: boolean = false;
    constructor(targetCrossReference: _PdfCrossReference, sourceCrossReference: _PdfCrossReference) {
        this._targetCrossReference = targetCrossReference;
        this._sourceCrossReference = sourceCrossReference;
    }
    _copy(object: any): any { // eslint-disable-line
        let clonedObject: any; // eslint-disable-line
        if (object instanceof _PdfDictionary) {
            clonedObject = this._copyDictionary(object);
        } else if (Array.isArray(object)) {
            clonedObject = this._copyArray(object);
        } else if (object instanceof _PdfBaseStream) {
            clonedObject = this._copyStream(object);
        } else if (object instanceof _PdfReference) {
            clonedObject = this._copyReference(object);
        } else if (object instanceof _PdfName || typeof object === 'number' ||
                    typeof object === 'string' || typeof object === 'boolean') {
            clonedObject = object;
        }
        return clonedObject;
    }
    _copyDictionary(element: _PdfDictionary, copiedPage?: boolean): _PdfDictionary {
        const clonedDictionary: _PdfDictionary = new _PdfDictionary(this._targetCrossReference);
        if (element && element.size > 0) {
            element.forEach((key: string, value: any) => { // eslint-disable-line
                if (key === 'OC' && value instanceof Array || (key !== 'P' && key !== 'Parent' && key !== 'Dest' && key !== 'OC' && !(key === 'AP' && copiedPage)) ) {
                    const copiedValue: any = this._copy(value); // eslint-disable-line
                    if (copiedValue !== null && typeof copiedValue !== 'undefined') {
                        clonedDictionary.update(key, copiedValue);
                    }
                }
            });
        }
        clonedDictionary._updated = true;
        return clonedDictionary;
    }
    _copyArray(originalArray: any[]): any[] { // eslint-disable-line 
        const newArray: any[] = []; // eslint-disable-line 
        for (let i: number = 0; i < originalArray.length; i++) {
            newArray.push(this._copy(originalArray[Number.parseInt(i.toString(), 10)]));
        }
        return newArray;
    }
    _copyStream(originalStream: _PdfBaseStream): _PdfBaseStream {
        let bytes: number[] | Uint8Array;
        let imageStream: boolean = false;
        const baseStream: any = originalStream; // eslint-disable-line
        if (originalStream.dictionary.has('Subtype') && originalStream.dictionary.get('Subtype').name === 'Image') {
            imageStream = true;
            if (originalStream instanceof _PdfStream) {
                bytes = originalStream.getByteRange(originalStream.offset, originalStream.end);
            } else if (originalStream && baseStream.stream && baseStream.stream instanceof _PdfStream) {
                if (typeof baseStream._initialized === 'boolean' && baseStream._cipher) {
                    const streamLength: number = baseStream.stream.end - baseStream.stream.start;
                    baseStream.getBytes(streamLength);
                    bytes = baseStream.buffer.subarray(0, baseStream.bufferLength);
                } else {
                    const stream: _PdfStream = baseStream.stream;
                    bytes = stream.getByteRange(stream.start, stream.end);
                }
            } else if (baseStream.stream && baseStream.stream.stream) {
                const flateStream: any = baseStream.stream; // eslint-disable-line
                if (flateStream.stream instanceof _PdfStream && typeof flateStream._initialized === 'boolean' && flateStream._cipher) {
                    const streamLength: number = flateStream.stream.end - flateStream.stream.start;
                    flateStream.getBytes(streamLength);
                    bytes = flateStream.buffer.subarray(0, flateStream.bufferLength);
                } else if (flateStream.stream && flateStream.stream instanceof _PdfStream) {
                    const stream: _PdfStream = flateStream.stream;
                    bytes = stream.getByteRange(stream.start, stream.end) as Uint8Array;
                } else {
                    bytes = [];
                }
            } else {
                bytes = originalStream.getBytes();
                if ((!bytes || bytes.length === 0) && originalStream instanceof _PdfContentStream) {
                    bytes = originalStream._bytes;
                }
            }
        } else {
            bytes = originalStream.getBytes();
            if ((!bytes || bytes.length === 0) && originalStream instanceof _PdfContentStream) {
                bytes = originalStream._bytes;
            }
        }
        const content: _PdfContentStream = new _PdfContentStream(Array.from(bytes));
        content._isImage = imageStream;
        content.dictionary = this._copyDictionary(originalStream.dictionary);
        content.dictionary._updated = true;
        return content;
    }
    _copyReference(element: _PdfReference): any { // eslint-disable-line
        if (this._traversedObjects.has(element)) {
            return this._traversedObjects.get(element);
        } else {
            this._traversedObjects.set(element, null);
            const dereferencedValue: any = this._sourceCrossReference._fetch(element); // eslint-disable-line
            const copyValue: any = this._copy(dereferencedValue); // eslint-disable-line
            if (copyValue instanceof _PdfDictionary || copyValue instanceof _PdfBaseStream) {
                const newRef: _PdfReference = this._addToDestination(copyValue);
                this._traversedObjects.set(element, newRef);
                return newRef;
            } else {
                this._traversedObjects.set(element, copyValue);
                return copyValue;
            }
        }
    }
    _addToDestination(element: any): _PdfReference { // eslint-disable-line
        const newRef: _PdfReference = this._targetCrossReference._getNextReference();
        this._targetCrossReference._cacheMap.set(newRef, element);
        element.objId = `${newRef.objectNumber} ${newRef.generationNumber}`;
        return newRef;
    }
}
