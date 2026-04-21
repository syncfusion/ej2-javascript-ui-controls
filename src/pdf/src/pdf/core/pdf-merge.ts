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

/**
 * Helper that merges/imports pages, annotations, form fields, layers, and bookmarks between PDF documents.
 *
 * @private
 */
export class _PdfMergeHelper {
    /**
     * Cache mapping pages to their bookmark nodes for efficient updates.
     *
     * @private
     */
    _bookmarkHashTable: Map<PdfPage, PdfBookmarkBase[]>;
    /**
     * Accumulator for named destinations to be written to the Names tree.
     *
     * @private
     */
    _namedDestinations: any[] = []; // eslint-disable-line
    /**
     * Accumulates bookmark nodes discovered during import.
     *
     * @private
     */
    _bookmarks: any[] = []; // eslint-disable-line
    /**
     * Temporary storage for imported form fields.
     *
     * @private
     */
    _fields: any[] = []; // eslint-disable-line
    /**
     * Mapping of source page dictionaries to destination page objects.
     *
     * @private
     */
    _pageReference: Map<_PdfDictionary, PdfPage> = new Map<_PdfDictionary, PdfPage>();
    /**
     * Mapping of source page references to destination page indexes for bookmark link fix-ups.
     *
     * @private
     */
    _bookmarksPageLinkReference: Map<_PdfReference, number> = new Map<_PdfReference, number>();
    /**
     * Collected destination arrays from annotations to be fixed after import.
     *
     * @private
     */
    _destination: any[] = []; // eslint-disable-line
    /**
     * Lookup of oldtonew references created during copy to reconcile layer references.
     *
     * @private
     */
    _newList: Map<_PdfReference, _PdfReference> = new Map<_PdfReference, _PdfReference>();
    /**
     * Mapping of annotation index to its associated layer reference.
     *
     * @private
     */
    _annotationLayer: Map<number, _PdfReference> = new Map<number, _PdfReference>();
    /**
     * Indicates if optional content are present during import.
     *
     * @private
     */
    _isLayersPresent: boolean = false;
    /**
     * Tracks field names already present in destination to avoid duplicates.
     *
     * @private
     */
    _fieldNames: string[] = [];
    /**
     * Destination document cross-reference table.
     *
     * @private
     */
    _crossReference: _PdfCrossReference;
    /**
     * Destination document receiving pages and objects.
     *
     * @private
     */
    _destinationDocument: PdfDocument;
    /**
     * Source document providing pages and objects to import.
     *
     * @private
     */
    _sourceDocument: PdfDocument;
    /**
     * Options that control how pages and related resources are imported.
     *
     * @private
     */
    _options: PdfPageImportOptions = new PdfPageImportOptions();
    /**
     * Temporary storage for widget/field kid references encountered during processing.
     *
     * @private
     */
    _kidsReference: any[] = []; // eslint-disable-line
    /**
     * Mapping of source field index to newly created parent field reference in the destination.
     *
     * @private
     */
    _formFieldsCollection: Map<number, _PdfReference> = new Map<number, _PdfReference>();
    /**
     * Collected field references that will be assigned to the destination AcroForm.
     *
     * @private
     */
    _formFields: _PdfReference[] = [];
    /**
     * Indicates whether the current operation duplicates an existing page within the same document.
     *
     * @private
     */
    _isDuplicatePage: boolean = false;
    /**
     * Running count used when appending newly parsed fields into the destination form.
     *
     * @private
     */
    _fieldCount: number = 0;
    /**
     * Helper responsible for copying dictionaries, streams, arrays, and references between xrefs.
     *
     * @private
     */
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
    /**
     * Imports a page from the source document into the destination document, handling resources, annotations, form fields, and layers.
     *
     * @private
     * @param {PdfPage} page The source page to import.
     * @param {number} index The index at which the page should be inserted in the destination document.
     * @param {boolean} layers Indicates whether optional content should be merged.
     * @param {boolean} isCopiedPage Specifies whether the operation is duplicating an existing page.
     * @param {PdfPageImportOptions} [options] Optional import settings including rotation and optimization.
     * @param {boolean} [isSplitDocument] Indicates whether the operation is part of splitting a document.
     * @returns {void}
     */
    _importPages(page: PdfPage, index: number, layers: boolean, isCopiedPage: boolean, options?: PdfPageImportOptions,
                 isSplitDocument?: boolean): void {
        let template: PdfTemplate;
        let  newPage: PdfPage;
        const pageDictionary: _PdfDictionary = page._pageDictionary;
        this._isDuplicatePage = isCopiedPage;
        if (!options) {
            this._options.rotation = page.rotation;
        } else {
            this._options.rotation = options.rotation;
        }
        if (typeof index === 'number') {
            newPage = this._insertNewPage(page, index);
        } else if (this._isDuplicatePage) {
            newPage = this._insertNewPage(page, page._pageIndex + 1);
        } else {
            newPage = this._insertNewPage(page);
        }
        if ((isCopiedPage || isSplitDocument) && this._options.optimizeResources) {
            const newContents: any[] = []; // eslint-disable-line
            pageDictionary.forEach((key: string, value: any) => { // eslint-disable-line
                if (key === 'Contents' && newContents.length === 0) {
                    let contents: any = value; // eslint-disable-line
                    if (contents instanceof _PdfReference) {
                        const pageContent: any = isSplitDocument ?  this._copier._copy(contents) : contents; // eslint-disable-line
                        newPage._pageDictionary.update(key, pageContent);
                    } else if (contents instanceof Array) {
                        contents.forEach((content: any) => { // eslint-disable-line
                            const newContent: any = isSplitDocument ? this._copier._copy(content) : content; // eslint-disable-line
                            newContents.push(newContent);
                        });
                        newPage._pageDictionary.update(key, newContents);
                    }
                } else if (key === 'Resources' && value) {
                    const resourceValue: any = isSplitDocument ? this._copier._copy(value) : value; // eslint-disable-line
                    if (resourceValue) {
                        newPage._pageDictionary.update(key, resourceValue);
                    }
                } else if (key !== 'Resources' && key !== 'MediaBox' && key !== 'CropBox' && key !== 'Parent' && key !== 'Annots'
                           && key !== 'Contents' && key !== 'Rotate') {
                    newPage._pageDictionary.update(key, value);
                }
            });
        } else {
            template = page._contentTemplate;
            newPage.graphics.drawTemplate(template, {x: 0, y: 0, width: template._size.width, height: template._size.height});
            template._content.dictionary.update('Resources', this._copier._copy(pageDictionary.getRaw('Resources')));
            this._pageReference.set(pageDictionary, newPage);
            if (!isCopiedPage) {
                this._bookmarksPageLinkReference.set(page._ref, newPage._pageIndex);
            }
        }
        if (pageDictionary.has('Annots')) {
            this._importAnnotation(page, newPage);
            if (typeof this._options !== 'undefined' && this._options.groupFormFields && this._sourceDocument._catalog._catalogDictionary.has('AcroForm')
                && this._destinationDocument.form.count > 0) {
                this._formFieldsGroupingSupport(this._sourceDocument.form, page, newPage);
            } else if (this._sourceDocument._catalog._catalogDictionary.has('AcroForm')) {
                this._importFormField(page, this._sourceDocument.form, newPage);
            }
        }
        if (!isCopiedPage) {
            const bookMarkMap: Map<PdfPage, PdfBookmarkBase[]> = this._sourceDocument._parseBookmarkDestination();
            if (bookMarkMap && bookMarkMap.has(page)) {
                const bookmarks: PdfBookmarkBase[] = bookMarkMap.get(page);
                this._bookmarks.push(...bookmarks);
            }
        }
        if ((!isCopiedPage && layers) || !this._options.optimizeResources) {
            this._mergeLayer(newPage._pageDictionary, pageDictionary, this._sourceDocument._crossReference);
        }
        newPage._pageDictionary._updated = true;
    }
    /**
     * Imports annotations from a source page into a destination page, preserving destinations and optional content references.
     *
     * @private
     * @param {PdfPage} page The source page containing annotations.
     * @param {PdfPage} newPage The destination page to receive the copied annotations.
     * @returns {void}
     */
    _importAnnotation(page: PdfPage, newPage: PdfPage): void {
        const array: any[] = []; // eslint-disable-line
        let dest: any[]; // eslint-disable-line
        let isDestination: boolean = false;
        const oldCollection: PdfAnnotationCollection = page.annotations;
        const annotations: Array<_PdfReference> = oldCollection._annotations;
        annotations.forEach((annotationReference: _PdfReference, i: number) => {
            if (annotationReference) {
                const annotationDictionary: _PdfDictionary = this._sourceDocument._crossReference._fetch(annotationReference);
                if (annotationDictionary) {
                    if (annotationDictionary.has('Dest')) {
                        dest = [];
                        const destinationArray: any = annotationDictionary.get('Dest'); // eslint-disable-line
                        const destination: any = annotationDictionary._get('Dest'); // eslint-disable-line
                        if (Array.isArray(destinationArray)) {
                            dest.push(...destinationArray);
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
        });
        if (array.length > 0) {
            newPage._pageDictionary.update('Annots', array);
        }
    }
    /**
     * Groups and merges form fields for the imported page, aligning kids arrays and regenerating appearances when required.
     *
     * @private
     * @param {PdfForm} form The source form collection to analyze.
     * @param {PdfPage} oldPage The original page where the widgets reside.
     * @param {PdfPage} newPage The destination page where widgets will be grouped.
     * @returns {void}
     */
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
                array = this._insertFormFields(i, field, form, newPage._ref, array, kidsArray);
            }
        }
        if (array.length > 0) {
            newPage._pageDictionary.update('Annots', array);
        }
    }
    /**
     * Groups kids between source and destination fields, creating or updating widget dictionaries and appearances.
     *
     * @private
     * @param {PdfField} destinationField The destination field to receive kids.
     * @param {PdfField} field The source field providing kids.
     * @param {_PdfReference[]} kidsArray The source page annotations array.
     * @param {_PdfReference[]} destKids The kids array of the destination field to be updated.
     * @param {_PdfReference[]} oldKids The original kids from the source field.
     * @param {_PdfReference} ref The destination page reference to assign to widgets.
     * @param {_PdfReference[]} array The destination page annotations array to append to.
     * @param {number} [index] Optional index of the kid in the source field.
     * @param {number} [fieldIndex] Optional field index used for mapping.
     * @param {_PdfDictionary} [drEntry] Optional default resources dictionary for appearance generation.
     * @param {any} [widget] Optional widget information used for certain field types. // eslint-disable-line
     * @returns {_PdfReference[]} The updated annotations array with any new widget references.
     */
    _groupFormFieldsKids(destinationField: PdfField, field: PdfField, kidsArray: _PdfReference[], destKids: _PdfReference[], oldKids:
                         _PdfReference[], ref: _PdfReference, array: _PdfReference[], index?: number, fieldIndex?: number, drEntry?: _PdfDictionary, widget?: any) : _PdfReference[] { // eslint-disable-line
        if (field._dictionary.has('Kids') && destinationField._dictionary.has('Kids')) {
            if (index !== null && typeof index !== 'undefined' && index >= 0 && oldKids.length > index) {
                const oldKid: _PdfReference = oldKids[<number>index];
                if (oldKid && kidsArray.indexOf(oldKid) !== -1) {
                    const oldDictionary: _PdfDictionary = field._crossReference._fetch(oldKid);
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
                        if ((destinationField instanceof PdfTextBoxField ||
                             destinationField instanceof PdfButtonField ||
                             destinationField instanceof PdfComboBoxField) &&
                             dictionary.has('AS')) {
                            delete dictionary._map.AS;
                        }
                        this._createAppearance(destinationField, field, oldDictionary, dictionary, drEntry, widget);
                    }
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
    /**
     * Creates or updates a destination parent field with kids and appends the appropriate widget dictionaries and references.
     *
     * @private
     * @param {PdfField} destinationField The destination field to update.
     * @param {PdfField} field The source field used to derive structure and widget data.
     * @param {_PdfDictionary} fieldDictionary The field dictionary used to build a new parent field.
     * @param {number} index The source kid index, or `null/undefined` when using a provided dictionary.
     * @param {number} fieldIndex The index of the form field in the global collection.
     * @param {_PdfReference} ref The destination page reference for widget placement.
     * @param {_PdfReference[]} oldKids The original kids from the source field.
     * @param {_PdfReference[]} array The annotations array to append new widget references to.
     * @param {_PdfDictionary} drEntry The default resources dictionary, for fonts and appearance resources.
     * @param {_PdfDictionary} [formFieldDictionary] Optional field dictionary when no kid index is selected.
     * @returns {void}
     */
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
        if (oldKids !== undefined && oldKids.length > 0 && typeof index !== 'undefined' && index !== null && oldKids.length > index && index >= 0) {
            oldDictionary = field._crossReference._fetch(oldKids[<number>index]);
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
    /**
     * Removes the specified keys from a dictionary and returns the updated dictionary.
     *
     * @private
     * @param {_PdfDictionary} dictionary The dictionary to modify.
     * @param {string[]} keys The keys to remove from the dictionary.
     * @returns {_PdfDictionary} The updated dictionary without the specified keys.
     */
    _removeFieldDictionary(dictionary: _PdfDictionary, keys: string[]): _PdfDictionary {
        keys.forEach(key => { // eslint-disable-line
            if (dictionary.has(key))  {
                delete dictionary._map[key]; // eslint-disable-line
            }
        });
        return dictionary;
    }
    /**
     * Updates a field or widget dictionary with page and parent references and marks it as updated.
     *
     * @private
     * @param {_PdfDictionary} dictionary The dictionary to update.
     * @param {_PdfReference} pageRef The page reference where the widget resides.
     * @param {_PdfReference} parentRef The parent field reference to assign.
     * @returns {void}
     */
    _updateFieldDictionary(dictionary: _PdfDictionary, pageRef: _PdfReference, parentRef: _PdfReference): void {
        dictionary = this._removeFieldDictionary(dictionary, ['Parent', 'FT', 'T', 'Ff']);
        dictionary.update('P', pageRef);
        dictionary.update('Parent', parentRef);
        dictionary._updated = true;
    }
    /**
     * Creates a new field dictionary by copying selected entries from an existing dictionary and removing them from the originals.
     *
     * @private
     * @param {_PdfDictionary} fieldDictionary The source field dictionary to copy from.
     * @param {_PdfDictionary} destDictionary The destination dictionary from which keys will also be removed.
     * @returns {_PdfDictionary} A new field dictionary to act as a parent.
     */
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
    /**
     * Determines the style glyph or state used for checkbox/radio appearances based on MK dictionary or field type.
     *
     * @private
     * @param {any} item The widget item to assign style information to. // eslint-disable-line
     * @param {PdfField} field The associated field to infer default style when MK is not present.
     * @returns {void}
     */
    _getItemStyle(item: any, field: PdfField): void { // eslint-disable-line
        const mkDictionary: _PdfDictionary = item._dictionary.get('MK');
        if (mkDictionary && mkDictionary.has('CA')) {
            item._styleText = mkDictionary.get('CA').charAt(0);
        } else {
            item._styleText = (field instanceof PdfRadioButtonListField) ? 'l' : '4';
        }
    }
    /**
     * Creates appearance streams and templates for the destination field and its widgets using the provided DR resources.
     *
     * @private
     * @param {PdfField} destinationField The destination field to render appearance for.
     * @param {PdfField} field The source field guiding appearance characteristics.
     * @param {_PdfDictionary} oldDictionary The source widget dictionary.
     * @param {_PdfDictionary} dictionary The destination widget dictionary.
     * @param {_PdfDictionary} drEntry The default resources dictionary for font resolution.
     * @param {any} [widget] Optional widget context for signatures or list items. // eslint-disable-line
     * @returns {void}
     */
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
    /**
     * Resolves a PDF font for widget appearance from DS/DA entries and the form default resources dictionary.
     *
     * @private
     * @param {_PdfDictionary} item The annotation or widget dictionary that may contain DS/DA.
     * @param {_PdfDictionary} formDictionary The form default resources dictionary (DR) used to resolve fonts.
     * @returns {PdfFont} The resolved PDF font.
     */
    _obtainFont(item: _PdfDictionary, formDictionary: _PdfDictionary): PdfFont {
        let fontFamily: string = '';
        let fontSize: number = 8;
        let pdfFont: PdfFont;
        if (item && (item.has('DS') || item.has('DA'))) {
            if (item.has('DS')) {
                const collection: string[] = item.get('DS').split(';');
                collection.forEach((item: string) => {
                    const entry: string[] = item.split(':');
                    if (item.indexOf('font-family') !== -1) {
                        fontFamily = entry[1];
                    } else if (item.indexOf('font-style') === -1 && item.indexOf('font') !== -1) {
                        const name: string = entry[1];
                        const split: string[] = name.split(' ');
                        split.forEach((part: string) => {
                            if (part !== '' && !part.endsWith('pt')) {
                                fontFamily += part + ' ';
                            }
                        });
                        while (fontFamily !== ' ' && fontFamily.endsWith(' ')) {
                            fontFamily = fontFamily.substring(0, fontFamily.length - 2);
                        }
                        if (fontFamily.indexOf(',') !== -1) {
                            fontFamily = fontFamily.split(',')[0];
                        }
                    }
                });
            } else {
                const value: string = item.get('DA');
                if (value && value !== '' && value.indexOf('Tf') !== -1) {
                    const textCollection: string[] = value.split(' ');
                    textCollection.forEach((text: string, index: number) => {
                        if (text.indexOf('Tf') !== -1) {
                            fontFamily = textCollection[index - 2];
                            while (fontFamily !== '' && fontFamily.length > 1 && fontFamily[0] === '/') {
                                fontFamily = fontFamily.substring(1);
                            }
                            fontSize = Number.parseFloat(textCollection[index - 1]);
                        }
                    });
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
    /**
     * Resolves the font style (bold/italic/regular) from a base font name.
     *
     * @private
     * @param {string} fontStyle The base font name.
     * @returns {PdfFontStyle} The resolved style.
     */
    _getFontStyle(fontStyle: string): PdfFontStyle {
        let style: PdfFontStyle = PdfFontStyle.regular;
        if (fontStyle.includes('Bold')) {
            style = PdfFontStyle.bold;
        } else if (fontStyle.includes('Italic')) {
            style = PdfFontStyle.italic;
        }
        return style;
    }
    /**
     * Imports form fields for a given page, creating widgets in the destination and merging form DR resources.
     *
     * @private
     * @param {PdfPage} page The source page that contains the fields.
     * @param {PdfForm} pdfForm The source form collection to read from.
     * @param {PdfPage} newPage The destination page to place the widgets on.
     * @returns {void}
     */
    _importFormField(page: PdfPage, pdfForm: PdfForm, newPage: PdfPage): void {
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
                            array = this._insertFormFields(i, pdfField, form, newPage._ref, array, widgetArray);
                            break;
                        }
                    }
                } else if (kidsArray.length === 1) {
                    if (pdfField.page === page) {
                        array = this._insertFormFields(i, pdfField, form, newPage._ref, array, widgetArray);
                    }
                }
            } else {
                if (pdfField.page === page) {
                    array = this._insertFormFields(i, pdfField, form, newPage._ref, array, widgetArray);
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
    /**
     * Inserts form fields and widgets for the given source field into the destination form and page annotations.
     *
     * @private
     * @param {number} index The index of the source field within the form.
     * @param {PdfField} pdfField The source field to insert.
     * @param {PdfForm} form The destination form collection.
     * @param {_PdfReference} ref The destination page reference to assign to widgets.
     * @param {_PdfReference[]} array The destination page annotations array to append to.
     * @param {_PdfReference[]} kidsArray The list of source widget references on the page for filtering.
     * @returns {_PdfReference[]} The updated annotations array with newly added widget references.
     */
    _insertFormFields(index: number, pdfField: PdfField, form: PdfForm, ref: _PdfReference,
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
        field._ref = newReference;
        this._crossReference._cacheMap.set(newReference, field._dictionary);
        if (pdfField._dictionary.has('Kids')) {
            const oldKids: _PdfReference[] = pdfField._dictionary.get('Kids');
            const kids: _PdfReference[] = [];
            oldKids.forEach((kid: _PdfReference) => {
                if (kidsArray.indexOf(kid) !== -1) {
                    const oldDictionary: _PdfDictionary = pdfField._crossReference._fetch(kid);
                    const dict: _PdfDictionary = this._copier._copyDictionary(oldDictionary);
                    dict.update('P', ref);
                    dict.update('Parent', newReference);
                    dict._updated = true;
                    const reference: _PdfReference = this._crossReference._getNextReference();
                    this._crossReference._cacheMap.set(reference, dict);
                    array.push(reference);
                    kids.push(reference);
                }
            });
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
    /**
     * Merges the updated form fields collection into the destination document's AcroForm dictionary.
     *
     * @private
     * @returns {void}
     */
    _mergeFormFieldsWithDocument(): void {
        let pdfFields: _PdfReference[] = [];
        if (this._formFieldsCollection.size > 0) {
            const formDictionary: _PdfDictionary = this._destinationDocument.form._dictionary;
            if (formDictionary && formDictionary.has('Fields')) {
                pdfFields = formDictionary.get('Fields');
            }
            this._formFieldsCollection.forEach((value: _PdfReference, key: number) => {
                pdfFields[<number>key] = value;
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
    /**
     * Imports optional content (layers) properties into the destination document and merges default view settings.
     *
     * @private
     * @param {_PdfDictionary} ocProperties The source catalog dictionary that contains OCProperties.
     * @param {boolean} layers Indicates whether layers are present and should be merged.
     * @returns {void}
     */
    _importLayers(ocProperties: _PdfDictionary, layers: boolean): void {
        this._isLayersPresent = layers;
        if (this._isLayersPresent && this._destinationDocument._catalog._catalogDictionary.has('OCProperties')) {
            const destinationOCProperties: _PdfDictionary = this._destinationDocument._catalog._catalogDictionary.get('OCProperties');
            const currentOCProperties: _PdfDictionary = ocProperties.get('OCProperties');
            if (destinationOCProperties.has('OCGs')) {
                const ocgs: any[] = destinationOCProperties.get('OCGs'); // eslint-disable-line
                const Cocgs: any[] = currentOCProperties.get('OCGs'); // eslint-disable-line
                if (ocgs.length > 0) {
                    ocgs.push(...Cocgs);
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
                            order.push(...existingOrder);
                        }
                    } else if (existingDefaultView.has('Order')) {
                        curreneDefaultView.set('Order', existingDefaultView.get('Order'));
                    }
                    if (curreneDefaultView.has('RBGroups') && existingDefaultView.has('RBGroups')) {
                        const groups: any[] = curreneDefaultView.get('RBGroups'); // eslint-disable-line
                        const existingRBGroups: any[] = existingDefaultView.get('RBGroups'); // eslint-disable-line
                        if (groups.length > 0 && existingRBGroups.length > 0) {
                            groups.push(...existingRBGroups);
                        }
                    } else if (existingDefaultView.has('RBGroups')) {
                        curreneDefaultView.set('RBGroups', existingDefaultView.get('RBGroups'));
                        curreneDefaultView._updated = true;
                    }
                    if (curreneDefaultView.has('ON') && existingDefaultView.has('ON')) {
                        const on: any[] = curreneDefaultView.get('ON'); // eslint-disable-line
                        const existingON: any[] = existingDefaultView.get('ON'); // eslint-disable-line
                        if (on.length > 0 && existingON.length > 0) {
                            on.push(...existingON);
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
                                    currentUsageGroup.push(...usageGroup);
                                }
                            }
                            elements.push(...existingElements);
                        }
                    } else if (existingDefaultView.has('AS')) {
                        curreneDefaultView.set('AS', existingDefaultView.get('AS'));
                    }
                    if (curreneDefaultView.has('OFF') && existingDefaultView.has('OFF')) {
                        const off: any[] = curreneDefaultView.get('OFF'); // eslint-disable-line
                        const existingOff:any[] = existingDefaultView.get('OFF'); // eslint-disable-line
                        if (off.length > 0 && existingOff.length > 0) {
                            off.push(...existingOff);
                        }
                    } else if (existingDefaultView.has('OFF')) {
                        curreneDefaultView.set('OFF', existingDefaultView.get('OFF'));
                    }
                }
                if (curreneDefaultView.has('Locked') && existingDefaultView.has('Locked') ) {
                    const locked: any[] = curreneDefaultView.get('Locked'); // eslint-disable-line
                    const existingLocked: any[] = existingDefaultView.get('Locked'); // eslint-disable-line
                    if (locked.length > 0 && existingLocked.length > 0) {
                        locked.push(...existingLocked);
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
    /**
     * Merges layer properties from the source page into the destination page including Properties, XObject, and annotations.
     *
     * @private
     * @param {_PdfDictionary} newPageDictionary The destination page dictionary.
     * @param {_PdfDictionary} oldPageDictionary The source page dictionary.
     * @param {_PdfCrossReference} crossReference The cross-reference used to dereference objects.
     * @returns {void}
     */
    _mergeLayer(newPageDictionary: _PdfDictionary, oldPageDictionary: _PdfDictionary , crossReference: _PdfCrossReference): void {
        const res: _PdfDictionary = newPageDictionary.get('Resources');
        const xobject: _PdfDictionary = res.get('XObject');
        let xobjdict: any ; // eslint-disable-line
        if (xobject) {
            xobject.forEach((key: any, value: any) => { // eslint-disable-line
                xobjdict = this._crossReference._fetch(value);
            });
        }
        let resource: _PdfDictionary;
        if (xobjdict) {
            resource = xobjdict.dictionary.get('Resources');
        }
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
                const pdfAnnotation: any = annotations[<number>index]; // eslint-disable-line
                const annotDictionary: _PdfDictionary = this._crossReference._fetch(pdfAnnotation);
                this._newList.forEach((value , oldReference) => { // eslint-disable-line
                    if (reference === oldReference) {
                        annotDictionary.set('OC', value);
                    }
                });
            });
        }
    }
    /**
     * Exports collected bookmarks to the destination document, fixing page destinations and named destinations.
     *
     * @private
     * @param {PdfDocument} document The destination document to write bookmarks to.
     * @param {number} pageCount The number of pages considered during export.
     * @returns {void}
     */
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
    /**
     * Creates a new named destination mapped to a new page based on an existing named destination.
     *
     * @private
     * @param {PdfNamedDestination} nDest The source named destination.
     * @param {PdfPage} page The destination page to associate with.
     * @returns {PdfNamedDestination} The cloned named destination with updated page reference.
     */
    _getNamedDestination(nDest: PdfNamedDestination, page: PdfPage): PdfNamedDestination {
        const newNamedDest:any = new PdfNamedDestination(nDest.title); // eslint-disable-line
        newNamedDest.destination = this._getDestination(page, nDest.destination);
        return newNamedDest;
    }
    /**
     * Clones a destination for a different page while preserving mode, zoom, and location.
     *
     * @private
     * @param {PdfPage} page The new page for the destination.
     * @param {PdfDestination} dest The original destination to copy.
     * @returns {PdfDestination} The new destination that targets the given page.
     */
    _getDestination(page: PdfPage, dest: PdfDestination): PdfDestination {
        const newDest: PdfDestination = new PdfDestination(page, dest.location);
        newDest._location = dest._location;
        newDest.mode = dest.mode;
        newDest.zoom = dest.zoom;
        newDest.location = dest.location;
        return newDest;
    }
    /**
     * Serializes a PDF object (primitive, array, dictionary, or reference) into a target container.
     *
     * @private
     * @param {PdfDocument} document The document being written to.
     * @param {_PdfDictionary} [table] The destination dictionary when writing key/value pairs.
     * @param {any} [value] The value to serialize. // eslint-disable-line
     * @param {_PdfDictionary} [dictionary] The current context dictionary used for dereferencing.
     * @param {string} [key] The key under which to store the value in the table.
     * @param {any[]} [array] The destination array when writing list entries. // eslint-disable-line
     * @param {_PdfReference} [ref] Optional reference handle for object mapping.
     * @returns {void}
     */
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
    /**
     * Writes a key/value or list into a dictionary or array, managing reference remapping for layers.
     *
     * @private
     * @param {any} value The primitive value to write, if any. // eslint-disable-line
     * @param {_PdfDictionary} table The destination dictionary for key/value pairs.
     * @param {string} key The key name for dictionary insertion.
     * @param {any[]} array The destination array when writing list entries. // eslint-disable-line
     * @param {_PdfReference} ref The reference used to map or replace objects.
     * @param {any[]|_PdfDictionary} list The serialized list or sub-dictionary being written. // eslint-disable-line
     * @returns {void}
     */
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
    /**
     * Serializes an array of PDF objects into a destination list.
     *
     * @private
     * @param {PdfDocument} document The document being written to.
     * @param {any[]} array The destination list to receive serialized items. // eslint-disable-line
     * @param {any[]} value The source array to serialize. // eslint-disable-line
     * @param {_PdfDictionary} dictionary The context dictionary used for dereferencing.
     * @returns {void}
     */
    _writeArray(document: PdfDocument, array: any[], value: any[], dictionary: _PdfDictionary): void { // eslint-disable-line
        value.forEach((item: any) => { // eslint-disable-line
            this._writeObject(document, null, item, dictionary, null, array);
        });
    }
    /**
     * Writes all properties from a source dictionary into a destination dictionary, dereferencing references when needed.
     *
     * @private
     * @param {PdfDocument} document The document being written to.
     * @param {_PdfDictionary} table The destination dictionary to populate.
     * @param {_PdfDictionary} dictionary The source dictionary whose entries will be serialized.
     * @returns {void}
     */
    _writePropertiesDictionary(document: PdfDocument, table: _PdfDictionary, dictionary: _PdfDictionary): void {
        if (dictionary && dictionary.size > 0) {
            dictionary.forEach((key: string, value: any) => { // eslint-disable-line
                this._writeObject(document, table, ((value instanceof _PdfReference) ? dictionary.get(key) : value), dictionary, key);
            });
        }
    }
    /**
     * Fixes stored destinations to point to the newly created page references after import.
     *
     * @private
     * @param {PdfDocument} document The destination document to resolve references against.
     * @returns {void}
     */
    _fixDestinations(document: PdfDocument): void {
        const pageLinkReference: Map<_PdfDictionary, PdfPage> = this._pageReference;
        if (this._destination.length > 0) {
            this._destination.forEach((dest: any) => { // eslint-disable-line
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
            });
        }
    }
    /**
     * Inserts a new page in the destination document mirroring size, boxes, margins, orientation, and rotation from the source.
     *
     * @private
     * @param {PdfPage} page The source page to mirror.
     * @param {number} [index] Optional insertion index.
     * @returns {PdfPage} The newly created destination page.
     */
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
        pagesettings.orientation = (page.size.width > page.size.height) ? PdfPageOrientation.landscape : PdfPageOrientation.portrait;
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
    /**
     * Disposes internal state and temporary collections used during import/merge operations.
     *
     * @private
     * @returns {void}
     */
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
/**
 * Provides low-level object copying helpers for PDF structures, including dictionaries, arrays, streams, and references.
 *
 * @private
 */
export class _PdfCopier {
    /**
     * Tracks source-to-destination reference mappings to avoid duplicate cloning.
     *
     * @private
     */
    _traversedObjects: Map<_PdfReference, _PdfReference> = new Map<_PdfReference, _PdfReference>();
    /**
     * Cross-reference table of the target document where copied objects are stored.
     *
     * @private
     */
    _targetCrossReference: _PdfCrossReference;
    /**
     * Cross-reference table of the source document from which objects are fetched.
     *
     * @private
     */
    _sourceCrossReference: _PdfCrossReference;
    /**
     * Indicates whether grouping support is enabled during copy operations.
     *
     * @private
     */
    _isGroupingSupport: boolean = false;
    /**
     * Initializes a new copier with target and source cross reference tables.
     *
     * @private
     * @param {_PdfCrossReference} targetCrossReference The destination cross-reference table.
     * @param {_PdfCrossReference} sourceCrossReference The source cross-reference table.
     */
    constructor(targetCrossReference: _PdfCrossReference, sourceCrossReference: _PdfCrossReference) {
        this._targetCrossReference = targetCrossReference;
        this._sourceCrossReference = sourceCrossReference;
    }
    /**
     * Copies a PDF object depending on its type, returning a copied value or mapped reference.
     *
     * @private
     * @param {any} object The object to copy.
     * @returns {any} The copied object or target reference.
     */
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
    /**
     * Copies a dictionary and its entries, with optional handling for appearance dictionaries when copying pages.
     *
     * @private
     * @param {_PdfDictionary} element The dictionary to copy from the source cross reference.
     * @param {boolean} [copiedPage] Indicates whether the dictionary belongs to a page copy.
     * @returns {_PdfDictionary} The cloned dictionary in the target context.
     */
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
    /**
     * Deep-copies an array by copying each element into the target context.
     *
     * @private
     * @param {any[]} originalArray The array to copy.
     * @returns {any[]} The copied array.
     */
    _copyArray(originalArray: any[]): any[] { // eslint-disable-line 
        const newArray: any[] = []; // eslint-disable-line
        originalArray.forEach((item: any) => { // eslint-disable-line
            newArray.push(this._copy(item));
        });
        return newArray;
    }
    /**
     * Copies a base stream or content stream, preserving bytes and cloning its dictionary.
     *
     * @private
     * @param {_PdfBaseStream} originalStream The source stream to copy.
     * @returns {_PdfBaseStream} The cloned content stream in the target context.
     */
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
    /**
     * Copies or reuses a reference, ensuring a consistent mapping from source to target references.
     *
     * @private
     * @param {_PdfReference} element The source reference to copy.
     * @returns {any} The new reference or copied value for non-container objects. // eslint-disable-line
     */
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
    /**
     * Adds a copied object to the target cross reference and returns its newly created reference.
     *
     * @private
     * @param {any} element The dictionary or stream to add. // eslint-disable-line
     * @returns {_PdfReference} The new reference pointing to the added object.
     */
    _addToDestination(element: any): _PdfReference { // eslint-disable-line
        const newRef: _PdfReference = this._targetCrossReference._getNextReference();
        this._targetCrossReference._cacheMap.set(newRef, element);
        element.objId = `${newRef.objectNumber} ${newRef.generationNumber}`;
        return newRef;
    }
}
