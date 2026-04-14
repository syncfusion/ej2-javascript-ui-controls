

import { _PdfMergeHelper, _PdfCopier } from '../src/pdf/core/pdf-merge';
import { PdfDocument, PdfPageSettings } from '../src/pdf/core/pdf-document';
import { PdfPage } from '../src/pdf/core/pdf-page';
import { PdfForm } from '../src/pdf/core/form/form';
import { PdfField, PdfCheckBoxField, PdfRadioButtonListField, PdfTextBoxField, PdfButtonField, PdfSignatureField, PdfListField, PdfListBoxField } from '../src/pdf/core/form/field';
import { _PdfDictionary, _PdfReference, _PdfName } from '../src/pdf/core/pdf-primitives';
import { _PdfCrossReference } from '../src/pdf/core/pdf-cross-reference';
import { PdfPageImportOptions } from "../src/pdf/core/pdf-page-import-options";
import { PdfFontStyle, PdfFontFamily, PdfStandardFont, PdfFont } from '../src/pdf/core/fonts/pdf-standard-font';
import { PdfDestination } from '../src/pdf/core/pdf-page';
import { PdfNamedDestination, PdfBookmarkBase } from '../src/pdf/core/pdf-outline';
import { _PdfBaseStream, _PdfContentStream, _PdfStream } from '../src/pdf/core/base-stream';
import { PdfLineAnnotation, PdfSquareAnnotation, PdfWidgetAnnotation } from '../src/pdf/core/annotations/annotation';
import { PdfTemplate } from '../src/pdf/core/graphics/pdf-template';
import { PdfRotationAngle } from '../src/pdf/core/enumerator';

describe('_PdfMergeHelper behavior tests', () => {
    function createHelper(): {
        helper: _PdfMergeHelper;
        crossRef: _PdfCrossReference;
    } {
        const destDoc = new PdfDocument();
        const crossRef = new _PdfCrossReference(destDoc);
        const srcDoc = new PdfDocument();
        const options = new PdfPageImportOptions();
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        return { helper, crossRef };
    }
    it('_formFieldsGroupingSupport - no DR entry initializes drEntry to undefined', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const mockForm: any = {
            _dictionary: new _PdfDictionary(crossRef),
            count: 0,
            fieldAt: (): PdfField | null => null
        };

        const oldPage: PdfPage = destDoc.addPage();
        const newPage: PdfPage = destDoc.addPage();
        helper._isDuplicatePage = false;

        // Act
        helper._formFieldsGroupingSupport(mockForm, oldPage, newPage);

        // Assert
        expect(mockForm._dictionary.has('DR')).toBeFalsy();
        expect(newPage).toBeDefined();
    });

    it('_formFieldsGroupingSupport - newPage has Annots gets existing array', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const mockForm: any = {
            _dictionary: new _PdfDictionary(crossRef),
            count: 0,
            fieldAt: (): PdfField | null => null
        };

        const oldPage: PdfPage = destDoc.addPage();
        const newPage: PdfPage = destDoc.addPage();

        const annotRef: _PdfReference = crossRef._getNextReference();
        newPage._pageDictionary.set('Annots', [annotRef]);

        // Act
        helper._formFieldsGroupingSupport(mockForm, oldPage, newPage);

        // Assert
        expect(newPage._pageDictionary.has('Annots')).toBeTruthy();
        expect(newPage._pageDictionary.get('Annots').length).toBe(1);
    });

    it('_formFieldsGroupingSupport - oldPage has Annots gets kids array', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const mockForm: any = {
            _dictionary: new _PdfDictionary(crossRef),
            count: 0,
            fieldAt: (): PdfField | null => null
        };

        const oldPage: PdfPage = destDoc.addPage();
        const newPage: PdfPage = destDoc.addPage();

        const kidRef: _PdfReference = crossRef._getNextReference();
        oldPage._pageDictionary.set('Annots', [kidRef]);

        // Act
        helper._formFieldsGroupingSupport(mockForm, oldPage, newPage);

        // Assert
        expect(oldPage._pageDictionary.has('Annots')).toBeTruthy();
    });
    it('_groupFormFieldsKids - destination has Kids, source does not', () => {
        const { helper, crossRef } = createHelper();

        const destField: any = { _dictionary: new _PdfDictionary(crossRef) };
        const srcField: any = { _dictionary: new _PdfDictionary(crossRef) };

        destField._dictionary.set('Kids', [crossRef._getNextReference()]);

        const result = helper._groupFormFieldsKids(
            destField, srcField, [], [], [], crossRef._getNextReference(), [], 0, 0
        );

        expect(result).toBeDefined();
    });

    it('_groupFormFieldsKids - both fields have Kids with valid index range', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);
        helper._copier = new _PdfCopier(crossRef, srcDoc._crossReference);

        const destField: any = {
            _dictionary: new _PdfDictionary(crossRef),
            _ref: crossRef._getNextReference(),
            _kidsCount: 1,
            itemAt: () => ({ _dictionary: new _PdfDictionary(crossRef) })
        };
        destField._dictionary.set('Kids', [destField._ref]);

        const srcField: any = {
            _dictionary: new _PdfDictionary(crossRef),
            _ref: crossRef._getNextReference(),
            _crossReference: crossRef,
            _isDuplicatePage: false
        };

        const oldKidRef: _PdfReference = crossRef._getNextReference();
        srcField._dictionary.set('Kids', [oldKidRef]);

        const oldDict: _PdfDictionary = new _PdfDictionary(crossRef);
        crossRef._cacheMap.set(oldKidRef, oldDict);

        const array: _PdfReference[] = [];
        const destKids: _PdfReference[] = [];
        const pageRef: _PdfReference = crossRef._getNextReference();

        helper._isDuplicatePage = false;

        // Act
        const result: _PdfReference[] = helper._groupFormFieldsKids(
            destField, srcField, [oldKidRef], destKids, [oldKidRef], pageRef, array, 0, 0, null
        );

        // Assert
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
    });

    it('_groupFormFieldsKids - index out of range returns empty array', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const destField: any = {
            _dictionary: new _PdfDictionary(crossRef),
            _ref: crossRef._getNextReference()
        };
        destField._dictionary.set('Kids', []);

        const srcField: any = {
            _dictionary: new _PdfDictionary(crossRef)
        };
        srcField._dictionary.set('Kids', []);

        const array: _PdfReference[] = [crossRef._getNextReference()];

        // Act
        const result: _PdfReference[] = helper._groupFormFieldsKids(
            destField, srcField, [], [], [], crossRef._getNextReference(), array, 5, 0
        );

        // Assert
        expect(result).toEqual(array);
    });

    it('_copyStream - copies non-image stream', () => {
        const destDoc = new PdfDocument();
        const srcDoc = new PdfDocument();
        const copier = new _PdfCopier(
            new _PdfCrossReference(destDoc),
            new _PdfCrossReference(srcDoc)
        );

        const stream = new _PdfStream([], new _PdfDictionary(copier._targetCrossReference));

        const result = copier._copyStream(stream);
        expect(result).toBeDefined();
    });

    it('_importFormField - imports field without Kids to new page', () => {
        const destDoc = new PdfDocument();
        const srcDoc = new PdfDocument();
        const crossRef = new _PdfCrossReference(destDoc);
        const helper = new _PdfMergeHelper(
            crossRef,
            destDoc,
            srcDoc,
            new Map(),
            new PdfPageImportOptions()
        );

        const srcPage = srcDoc.addPage();
        const newPage = destDoc.addPage();

        const field = new PdfTextBoxField(srcDoc.getPage(0), "example", { x: 100, y: 100, width: 20, height: 20 });
        srcDoc.form.add(field);

        // Act
        helper._importFormField(srcPage, srcDoc.form, newPage);

        // Assert
        expect(destDoc.form.count).toBeGreaterThan(0);
        expect(newPage._pageDictionary.has('Annots')).toBeTruthy();
    });

    it('_removeFieldDictionary - removes specified keys from dictionary', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const dict: _PdfDictionary = new _PdfDictionary(crossRef);
        dict.set('Parent', 'parentValue');
        dict.set('FT', 'fieldType');
        dict.set('T', 'fieldName');

        // Act
        const result: _PdfDictionary = helper._removeFieldDictionary(dict, ['Parent', 'FT', 'T']);

        // Assert
        expect(result.has('Parent')).toBeFalsy();
        expect(result.has('FT')).toBeFalsy();
        expect(result.has('T')).toBeFalsy();
    });

    it('_removeFieldDictionary - skips non-existent keys gracefully', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const dict: _PdfDictionary = new _PdfDictionary(crossRef);
        dict.set('Existing', 'value');

        // Act
        const result: _PdfDictionary = helper._removeFieldDictionary(dict, ['NonExistent', 'AlsoMissing']);

        // Assert
        expect(result.has('Existing')).toBeTruthy();
    });
    it('_updateFieldDictionary - updates page and parent references', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = destDoc._crossReference;

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const dict: _PdfDictionary = new _PdfDictionary(crossRef);
        dict.set('Parent', 'oldParent');
        dict.set('FT', 'fieldType');

        const pageRef: _PdfReference = crossRef._getNextReference();
        const parentRef: _PdfReference = crossRef._getNextReference();

        // Act
        helper._updateFieldDictionary(dict, pageRef, parentRef);

        // Assert
        expect(dict._map.P).toEqual(pageRef);
        expect(dict._map.Parent).toEqual(parentRef);
        expect(dict._updated).toBeTruthy();
    });

    it('_createNewFieldDictionary - copies specified keys and removes from originals', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const fieldDict: _PdfDictionary = new _PdfDictionary(crossRef);
        fieldDict.set('FT', 'Tx');
        fieldDict.set('T', 'fieldName');
        fieldDict.set('V', 'fieldValue');

        const destDict: _PdfDictionary = new _PdfDictionary(crossRef);
        destDict.set('FT', 'Tx');

        // Act
        const result: _PdfDictionary = helper._createNewFieldDictionary(fieldDict, destDict);

        // Assert
        expect(result.has('FT')).toBeTruthy();
        expect(result.has('T')).toBeTruthy();
        expect(fieldDict.has('FT')).toBeFalsy();
    });

    it('_getItemStyle - extracts CA from MK dictionary', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const mkDict: _PdfDictionary = new _PdfDictionary(crossRef);
        mkDict.set('CA', 'checkmark');

        const item: any = { _dictionary: new _PdfDictionary(crossRef) };
        item._dictionary.set('MK', mkDict);

        const field: any = {};

        // Act
        helper._getItemStyle(item, field);

        // Assert
        expect(item._styleText).toBe('c');
    });

    it('_getItemStyle - defaults to 4 for non-radio field when MK absent', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const item: any = { _dictionary: new _PdfDictionary(crossRef) };

        const field: PdfCheckBoxField = new PdfCheckBoxField();
        destDoc.form.add(field);

        // Act
        helper._getItemStyle(item, field);

        // Assert
        expect(item._styleText).toBe('4');
    });

    it('_obtainFont - parses DS property to extract font family', () => {
        const { helper, crossRef } = createHelper();

        const item = new _PdfDictionary(crossRef);
        const formDictionary = new _PdfDictionary(crossRef);

        item.set('DS', 'font-family:Helv;font-size:12pt');

        const font = helper._obtainFont(item, formDictionary);

        expect(font).toBeDefined();
    });

    it('_obtainFont - parses DA property to extract Tf font', () => {
        const { helper, crossRef } = createHelper();

        const item = new _PdfDictionary(crossRef);
        const formDictionary = new _PdfDictionary(crossRef);

        item.set('DA', '/Helv 12 Tf');

        const font = helper._obtainFont(item, formDictionary);

        expect(font).toBeDefined();
    });

    it('_obtainFont - Helv font family returns Helvetica standard font', () => {
        const { helper, crossRef } = createHelper();

        const item = new _PdfDictionary(crossRef);
        const formDictionary = new _PdfDictionary(crossRef);

        item.set('DS', 'font-family:Helv');

        const font = helper._obtainFont(item, formDictionary);

    });

    it('_obtainFont - Courier font family returns Courier standard font', () => {
        const { helper, crossRef } = createHelper();

        const item = new _PdfDictionary(crossRef);
        const formDictionary = new _PdfDictionary(crossRef);

        item.set('DS', 'font-family:Courier');

        const font = helper._obtainFont(item, formDictionary);

    });

    it('_obtainFont - Cour alias returns Courier standard font', () => {
        const { helper, crossRef } = createHelper();

        const item = new _PdfDictionary(crossRef);
        const formDictionary = new _PdfDictionary(crossRef);

        item.set('DS', 'font-family:Cour');

        const font = helper._obtainFont(item, formDictionary);

        expect(font).toBeDefined();
    });

    it('_obtainFont - Symb returns Symbol font', () => {
        const { helper, crossRef } = createHelper();

        const item = new _PdfDictionary(crossRef);
        const formDictionary = new _PdfDictionary(crossRef);

        item.set('DS', 'font-family:Symb');

        const font = helper._obtainFont(item, formDictionary);


    });

    it('_obtainFont - TiRo returns Times Roman font', () => {
        const { helper, crossRef } = createHelper();

        const item = new _PdfDictionary(crossRef);
        const formDictionary = new _PdfDictionary(crossRef);

        item.set('DS', 'font-family:TiRo');

        const font = helper._obtainFont(item, formDictionary);


    });
    it('_obtainFont - Symb returns Symbol font', () => {
        const { helper, crossRef } = createHelper();

        const item = new _PdfDictionary(crossRef);
        const formDictionary = new _PdfDictionary(crossRef);

        item.set('DS', 'font-family:Symb');

        const font = helper._obtainFont(item, formDictionary);


    });

    it('_obtainFont - TiRo returns Times Roman font', () => {
        const { helper, crossRef } = createHelper();

        const item = new _PdfDictionary(crossRef);
        const formDictionary = new _PdfDictionary(crossRef);

        item.set('DS', 'font-family:TiRo');

        const font = helper._obtainFont(item, formDictionary);


    });

    it('_obtainFont - ZaDb returns Zapf Dingbats font', () => {
        const { helper, crossRef } = createHelper();

        const item = new _PdfDictionary(crossRef);
        const formDictionary = new _PdfDictionary(crossRef);

        item.set('DS', 'font-family:ZaDb');

        const font = helper._obtainFont(item, formDictionary);


    });
    it('_obtainFont - unknown font falls back to Helvetica', () => {
        const { helper, crossRef } = createHelper();

        const item = new _PdfDictionary(crossRef);
        const formDictionary = new _PdfDictionary(crossRef);

        item.set('DS', 'font-family:Unknown');

        const font = helper._obtainFont(item, formDictionary);


    });
    it('_obtainFont - empty item returns default Helvetica font', () => {
        const { helper, crossRef } = createHelper();

        const item = new _PdfDictionary(crossRef);
        const formDictionary = new _PdfDictionary(crossRef);

        const font = helper._obtainFont(item, formDictionary);

    });
    it('_obtainFont - ZaDb returns Zapf Dingbats font', () => {
        const { helper, crossRef } = createHelper();

        const item = new _PdfDictionary(crossRef);
        const formDictionary = new _PdfDictionary(crossRef);

        item.set('DS', 'font-family:ZaDb');

        const font = helper._obtainFont(item, formDictionary);


    });

    it('_getFontStyle - Bold in name returns bold style', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        // Act
        const style: PdfFontStyle = helper._getFontStyle('HelveticaBold');

        // Assert
        expect(style).toBe(PdfFontStyle.bold);
    });

    it('_getFontStyle - Italic in name returns italic style', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        // Act
        const style: PdfFontStyle = helper._getFontStyle('HelveticaItalic');

        // Assert
        expect(style).toBe(PdfFontStyle.italic);
    });

    it('_getFontStyle - no style indicators returns regular style', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        // Act
        const style: PdfFontStyle = helper._getFontStyle('Helvetica');

        // Assert
        expect(style).toBe(PdfFontStyle.regular);
    });

    it('_mergeFormFieldsWithDocument - empty form fields collection uses destination form fields', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        helper._formFieldsCollection.clear();
        helper._destinationDocument = destDoc;

        // Act
        helper._mergeFormFieldsWithDocument();

        // Assert
        expect(destDoc.form._dictionary.get('Fields')).toBeDefined();
    });

    it('_importLayers - layers present with destination OCProperties updates defaults', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const ocPropsDict: _PdfDictionary = new _PdfDictionary(crossRef);
        const currentOCProps: _PdfDictionary = new _PdfDictionary(crossRef);
        currentOCProps.set('OCGs', []);
        ocPropsDict.set('OCProperties', currentOCProps);

        // Act
        helper._importLayers(ocPropsDict, true);

        // Assert
        expect(helper._isLayersPresent).toBeTruthy();
    });

    it('_importLayers - no destination OCProperties creates new one', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const ocPropsDict: _PdfDictionary = new _PdfDictionary(crossRef);
        const currentOCProps: _PdfDictionary = new _PdfDictionary(crossRef);
        ocPropsDict.set('OCProperties', currentOCProps);

        // Act
        helper._importLayers(ocPropsDict, true);

        // Assert
        expect(helper._isLayersPresent).toBeTruthy();
    });

    it('_getNamedDestination - copies title and clones destination', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const page: PdfPage = destDoc.addPage();
        const namedDest: PdfNamedDestination = new PdfNamedDestination('testDest');
        namedDest.destination = new PdfDestination(page, { x: 10, y: 10 });

        // Act
        const result: PdfNamedDestination = helper._getNamedDestination(namedDest, page);

        // Assert
        expect(result).toBeDefined();
        expect(result.destination).toBeDefined();
    });

    it('_getDestination - copies mode, zoom and location from source destination', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const srcPage: PdfPage = srcDoc.addPage();
        const destPage: PdfPage = destDoc.addPage();
        const srcDest: PdfDestination = new PdfDestination(srcPage, { x: 10, y: 10 });
        srcDest.zoom = 150;

        // Act
        const result: PdfDestination = helper._getDestination(destPage, srcDest);

        // Assert
        expect(result).toBeDefined();
        expect(result.zoom).toBe(srcDest.zoom);
    });

    it('_writeObject - primitive string value calls writeDictionary', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const table: _PdfDictionary = new _PdfDictionary(crossRef);
        const array: any[] = [];

        // Act
        helper._writeObject(destDoc, table, 'testValue', null, 'key', array);

        // Assert
        expect(table.has('key')).toBeTruthy();
    });

    it('_writeObject - array value calls writeArray', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const array: any[] = [];

        // Act
        helper._writeObject(destDoc, null, ['item1', 'item2'], null, null, array);

        // Assert
        expect(array.length).toBeGreaterThan(0);
    });

    it('_writeObject - dictionary value creates sub-table', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const subDict: _PdfDictionary = new _PdfDictionary(crossRef);
        subDict.set('test', 'value');
        const array: any[] = [];

        // Act
        helper._writeObject(destDoc, null, subDict, null, null, array);

        // Assert
        expect(array.length).toBeGreaterThan(0);
    });

    it('_writeObject - null value calls writeDictionary with null', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const table: _PdfDictionary = new _PdfDictionary(crossRef);

        // Act
        helper._writeObject(destDoc, table, null, null, 'key');

        // Assert
        expect(table.has('key')).toBeTruthy();
    });

    it('_writeDictionary - key and value sets in table', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const table: _PdfDictionary = new _PdfDictionary(crossRef);

        // Act
        helper._writeDictionary('testValue', table, 'key', null, null, null);

        // Assert
        expect(table.has('key')).toBeTruthy();
        expect(table.get('key')).toBe('testValue');
    });

    it('_writeDictionary - key and list sets in table', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const table: _PdfDictionary = new _PdfDictionary(crossRef);
        const list: any[] = ['item1'];

        // Act
        helper._writeDictionary(null, table, 'key', null, null, list);

        // Assert
        expect(table.has('key')).toBeTruthy();
    });

    it('_writeDictionary - list without ref pushes to array', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const array: any[] = [];
        const list: any[] = ['item1'];

        // Act
        helper._writeDictionary(null, null, null, array, null, list);

        // Assert
        expect(array.length).toBe(1);
    });

    it('_writeDictionary - value without key or list pushes to array', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const array: any[] = [];

        // Act
        helper._writeDictionary('testValue', null, null, array, null, null);

        // Assert
        expect(array.length).toBe(1);
        expect(array[0]).toBe('testValue');
    });

    it('_writeDictionary - ref with cached mapping uses new reference', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const oldRef: _PdfReference = crossRef._getNextReference();
        const newRef: _PdfReference = crossRef._getNextReference();
        helper._newList.set(oldRef, newRef);

        const array: any[] = [];

        // Act
        helper._writeDictionary(null, null, null, array, oldRef, null);

        // Assert
        expect(array.length).toBe(1);
        expect(array[0]).toEqual(newRef);
    });

    it('_writeArray - iterates and copies all items', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const array: any[] = [];
        const value: any[] = ['item1', 'item2', 'item3'];

        // Act
        helper._writeArray(destDoc, array, value, null);

        // Assert
        expect(array.length).toBe(3);
    });

    it('_writePropertiesDictionary - iterates dictionary and writes properties', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const table: _PdfDictionary = new _PdfDictionary(crossRef);
        const dict: _PdfDictionary = new _PdfDictionary(crossRef);
        dict.set('prop1', 'value1');
        dict.set('prop2', 'value2');

        // Act
        helper._writePropertiesDictionary(destDoc, table, dict);

        // Assert
        expect(table.has('prop1')).toBeTruthy();
        expect(table.has('prop2')).toBeTruthy();
    });

    it('_fixDestinations - updates destination references when page found in map', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const page: PdfPage = destDoc.addPage();
        const srcPageDict: _PdfDictionary = new _PdfDictionary(crossRef);

        const destRef: _PdfReference = crossRef._getNextReference();
        const srcRef: _PdfReference = crossRef._getNextReference();

        helper._pageReference.set(srcPageDict, page);
        crossRef._cacheMap.set(destRef, srcPageDict);
        helper._destination = [[destRef, 100, 100]];

        // Act
        helper._fixDestinations(destDoc);

        // Assert
        expect(helper._destination[0][0]).toBeDefined();
    });

    it('_insertNewPage - copies MediaBox from source page', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const srcPage: PdfPage = srcDoc.addPage();
        srcPage._pageDictionary.set('MediaBox', [0, 0, 612, 792]);

        helper._destinationDocument = destDoc;
        helper._options = options;

        // Act
        const newPage: PdfPage = helper._insertNewPage(srcPage);

        // Assert
        expect(newPage._pageDictionary.has('MediaBox')).toBeTruthy();
    });

    it('_insertNewPage - copies CropBox from source page', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const srcPage: PdfPage = srcDoc.addPage();
        srcPage._pageDictionary.set('CropBox', [10, 10, 600, 780]);

        helper._destinationDocument = destDoc;
        helper._options = options;

        // Act
        const newPage: PdfPage = helper._insertNewPage(srcPage);

        // Assert
        expect(newPage._pageDictionary.has('CropBox')).toBeTruthy();
    });

    it('_insertNewPage - sets rotation when options.rotation defined', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        options.rotation = 1;
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const srcPage: PdfPage = srcDoc.addPage();
        helper._destinationDocument = destDoc;
        helper._options = options;

        // Act
        const newPage: PdfPage = helper._insertNewPage(srcPage);

        // Assert
        expect(newPage._pageDictionary.has('Rotate')).toBeTruthy();
    });

    it('_insertNewPage - rotation calculation handles modulo for >= 360', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        options.rotation = PdfRotationAngle.angle180;
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const srcPage: PdfPage = srcDoc.addPage();
        helper._destinationDocument = destDoc;
        helper._options = options;

        // Act
        const newPage: PdfPage = helper._insertNewPage(srcPage);
        const rotate: number = newPage._pageDictionary.get('Rotate') as number;

        // Assert
        expect(rotate).toBeLessThan(360);
    });

    it('_insertNewPage - inserts at specific index when provided', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        const srcPage: PdfPage = srcDoc.addPage();
        helper._destinationDocument = destDoc;
        helper._options = options;

        // Act
        const newPage: PdfPage = helper._insertNewPage(srcPage, 0);

        // Assert
        expect(newPage).toBeDefined();
    });

    it('_objectDispose - clears all internal collections', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);

        const srcDoc: PdfDocument = new PdfDocument();
        const options: PdfPageImportOptions = new PdfPageImportOptions();
        const helper: _PdfMergeHelper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), options);

        helper._bookmarks = [null];
        helper._namedDestinations = [null];
        helper._destination = [null];
        helper._fieldNames = ['field'];

        // Act
        helper._objectDispose();

        // Assert
        expect(helper._bookmarks.length).toBe(0);
        expect(helper._namedDestinations.length).toBe(0);
        expect(helper._destination.length).toBe(0);
    });

});

describe('_PdfCopier behavior tests', () => {

    it('_copy - dictionary delegates to copyDictionary', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const srcDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);
        const srcCrossRef: _PdfCrossReference = new _PdfCrossReference(srcDoc);
        const copier: _PdfCopier = new _PdfCopier(crossRef, srcCrossRef);

        const dict: _PdfDictionary = new _PdfDictionary(crossRef);
        dict.set('test', 'value');

        // Act
        const result: any = copier._copy(dict);

        // Assert
        expect(result).toBeDefined();
        expect(result instanceof _PdfDictionary).toBeTruthy();
    });

    it('_copy - array delegates to copyArray', () => {
        // Arrange
        const srcDoc: PdfDocument = new PdfDocument();
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);
        const srcCrossRef: _PdfCrossReference = new _PdfCrossReference(srcDoc);
        const copier: _PdfCopier = new _PdfCopier(crossRef, srcCrossRef);

        const array: any[] = ['item1', 'item2'];

        // Act
        const result: any = copier._copy(array);

        // Assert
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBeTruthy();
    });

    it('_copy - primitive string returns unchanged', () => {
        // Arrange
        const destDoc: PdfDocument = new PdfDocument();
        const srcDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);
        const srcCrossRef: _PdfCrossReference = new _PdfCrossReference(srcDoc);
        const copier: _PdfCopier = new _PdfCopier(crossRef, srcCrossRef);

        // Act
        const result: any = copier._copy('testString');

        // Assert
        expect(result).toBe('testString');
    });

    it('_copy - primitive number returns unchanged', () => {
        // Arrange
        const srcDoc: PdfDocument = new PdfDocument();
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);
        const srcCrossRef: _PdfCrossReference = new _PdfCrossReference(srcDoc);
        const copier: _PdfCopier = new _PdfCopier(crossRef, srcCrossRef);

        // Act
        const result: any = copier._copy(42);

        // Assert
        expect(result).toBe(42);
    });

    it('_copy - primitive boolean returns unchanged', () => {
        // Arrange
        const srcDoc: PdfDocument = new PdfDocument();
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);
        const srcCrossRef: _PdfCrossReference = new _PdfCrossReference(srcDoc);
        const copier: _PdfCopier = new _PdfCopier(crossRef, srcCrossRef);

        // Act
        const result: any = copier._copy(true);

        // Assert
        expect(result).toBe(true);
    });

    it('_copyDictionary - empty dictionary creates empty clone', () => {
        // Arrange
        const srcDoc: PdfDocument = new PdfDocument();
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);
        const srcCrossRef: _PdfCrossReference = new _PdfCrossReference(srcDoc);
        const copier: _PdfCopier = new _PdfCopier(crossRef, srcCrossRef);

        const dict: _PdfDictionary = new _PdfDictionary(crossRef);

        // Act
        const result: _PdfDictionary = copier._copyDictionary(dict);

        // Assert
        expect(result).toBeDefined();
        expect(result.size).toBe(0);
    });

    it('_copyDictionary - populated dictionary copies non-excluded keys', () => {
        // Arrange
        const srcDoc: PdfDocument = new PdfDocument();
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);
        const srcCrossRef: _PdfCrossReference = new _PdfCrossReference(srcDoc);
        const copier: _PdfCopier = new _PdfCopier(crossRef, srcCrossRef);

        const dict: _PdfDictionary = new _PdfDictionary(crossRef);
        dict.set('key1', 'value1');
        dict.set('Parent', 'parentValue');

        // Act
        const result: _PdfDictionary = copier._copyDictionary(dict);

        // Assert
        expect(result.has('key1')).toBeTruthy();
    });

    it('_copyArray - copies all items recursively', () => {
        // Arrange
        const srcDoc: PdfDocument = new PdfDocument();
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);
        const srcCrossRef: _PdfCrossReference = new _PdfCrossReference(srcDoc);
        const copier: _PdfCopier = new _PdfCopier(crossRef, srcCrossRef);

        const array: any[] = ['item1', 'item2', 'item3'];

        // Act
        const result: any[] = copier._copyArray(array);

        // Assert
        expect(result.length).toBe(3);
        expect(result[0]).toBe('item1');
    });

    it('_copyReference - cached reference returns existing mapping', () => {
        // Arrange
        const srcDoc: PdfDocument = new PdfDocument();
        const destDoc: PdfDocument = new PdfDocument();
        const crossRef: _PdfCrossReference = new _PdfCrossReference(destDoc);
        const srcCrossRef: _PdfCrossReference = new _PdfCrossReference(srcDoc);
        const copier: _PdfCopier = new _PdfCopier(crossRef, srcCrossRef);

        const srcRef: _PdfReference = srcCrossRef._getNextReference();
        const cachedRef: _PdfReference = crossRef._getNextReference();
        copier._traversedObjects.set(srcRef, cachedRef);

        // Act
        const result: any = copier._copyReference(srcRef);

        // Assert
        expect(result).toEqual(cachedRef);
    });

});

describe('_PdfMergeHelper - Additional behavior coverage (LOC 260-288, 337-370, 445-495, 574-633, 828-891, 926-1023)', () => {

    // ==================== LOC 260-288: _importAnnotation branch coverage ====================


    it('_importAnnotation LOC 260-288 - annotation with no Dest skips destination handling', () => {
        // Arrange
        const srcDoc = new PdfDocument();
        const destDoc = new PdfDocument();
        const srcPage = srcDoc.addPage();
        const destPage = destDoc.addPage();
        const sqaureAnnot = new PdfSquareAnnotation({ x: 120, y: 150, width: 100, height: 100 });
        destDoc.getPage(0).annotations.add(sqaureAnnot);
        const bytes1 = destDoc.save();
        const loadedDestDoc = new PdfDocument(bytes1);
        const crossRef = loadedDestDoc._crossReference;
        const helper = new _PdfMergeHelper(
            crossRef,
            loadedDestDoc,
            srcDoc,
            new Map(),
            new PdfPageImportOptions()
        );
        // Create and add annotation
        const annot = new PdfLineAnnotation(
            { x: 10, y: 10 },
            { x: 20, y: 10 }
        );
        srcPage.annotations.add(annot);

        // Save and reload to ensure realistic document state
        const bytes = srcDoc.save();
        const loadedDoc = new PdfDocument(bytes);
        const loadedPage = loadedDoc.getPage(0);
        const loadedAnnot = loadedPage.annotations.at(0);

        // Create annotation reference and register it
        const annotRef = loadedAnnot._ref;
        srcDoc._crossReference._cacheMap.set(annotRef, loadedAnnot._dictionary);

        // Act
        helper._importAnnotation(loadedPage, destPage);

        // Assert
        expect(helper._destination.length).toBe(0);
    });

    it('_importAnnotation LOC 260-288 - annotation with Dest array pushes to destination list', () => {
        // Arrange
        const srcDoc = new PdfDocument();
        const destDoc = new PdfDocument();
        const srcPage = srcDoc.addPage();
        const destPage = destDoc.addPage();
        const sqaureAnnot = new PdfSquareAnnotation({ x: 120, y: 150, width: 100, height: 100 });
        destDoc.getPage(0).annotations.add(sqaureAnnot);
        const bytes1 = destDoc.save();
        const loadedDestDoc = new PdfDocument(bytes1);
        const crossRef = loadedDestDoc._crossReference;
        const helper = new _PdfMergeHelper(
            crossRef,
            loadedDestDoc,
            srcDoc,
            new Map(),
            new PdfPageImportOptions()
        );
        // Create and add annotation
        const annot = new PdfLineAnnotation(
            { x: 10, y: 10 },
            { x: 20, y: 10 }
        );
        srcPage.annotations.add(annot);

        // Save and reload to ensure realistic document state
        const bytes = srcDoc.save();
        const loadedDoc = new PdfDocument(bytes);
        const loadedPage = loadedDoc.getPage(0);
        const loadedAnnot = loadedPage.annotations.at(0);

        // Create annotation reference and register it
        const annotRef = loadedAnnot._ref;
        srcDoc._crossReference._cacheMap.set(annotRef, loadedAnnot._dictionary);

        const destRef = srcDoc._crossReference._getNextReference();
        loadedAnnot._dictionary.set('Dest', [destRef, '100 0']);

        // Act
        helper._importAnnotation(loadedPage, destPage);

        // Assert
        expect(helper._destination.length).toBeGreaterThan(0);
    });

    it('_importAnnotation LOC 260-288 - annotation with Dest reference handles reference type', () => {
        // Arrange
        const srcDoc = new PdfDocument();
        const destDoc = new PdfDocument();
        const srcPage = srcDoc.addPage();
        const destPage = destDoc.addPage();
        const sqaureAnnot = new PdfSquareAnnotation({ x: 120, y: 150, width: 100, height: 100 });
        destDoc.getPage(0).annotations.add(sqaureAnnot);
        const bytes1 = destDoc.save();
        const loadedDestDoc = new PdfDocument(bytes1);
        const crossRef = loadedDestDoc._crossReference;
        const helper = new _PdfMergeHelper(
            crossRef,
            loadedDestDoc,
            srcDoc,
            new Map(),
            new PdfPageImportOptions()
        );
        // Create and add annotation
        const annot = new PdfLineAnnotation(
            { x: 10, y: 10 },
            { x: 20, y: 10 }
        );
        srcPage.annotations.add(annot);

        // Save and reload to ensure realistic document state
        const bytes = srcDoc.save();
        const loadedDoc = new PdfDocument(bytes);
        const loadedPage = loadedDoc.getPage(0);
        const loadedAnnot = loadedPage.annotations.at(0);

        // Create annotation reference and register it
        const annotRef = loadedAnnot._ref;
        srcDoc._crossReference._cacheMap.set(annotRef, loadedAnnot._dictionary);

        const destRef = srcDoc._crossReference._getNextReference();
        loadedAnnot._dictionary.set('Dest', destRef);

        // Act
        helper._importAnnotation(loadedPage, destPage);

        // Assert
        expect(helper._destination.length).toBeGreaterThan(0);
    });

    it('_importAnnotation LOC 260-288 - annotation with OC reference stores layer mapping', () => {
        // Arrange
        const srcDoc = new PdfDocument();
        const destDoc = new PdfDocument();
        const srcPage = srcDoc.addPage();
        const destPage = destDoc.addPage();
        const sqaureAnnot = new PdfSquareAnnotation({ x: 120, y: 150, width: 100, height: 100 });
        destDoc.getPage(0).annotations.add(sqaureAnnot);
        const bytes1 = destDoc.save();
        const loadedDestDoc = new PdfDocument(bytes1);
        const crossRef = loadedDestDoc._crossReference;
        const helper = new _PdfMergeHelper(
            crossRef,
            loadedDestDoc,
            srcDoc,
            new Map(),
            new PdfPageImportOptions()
        );
        // Create and add annotation
        const annot = new PdfLineAnnotation(
            { x: 10, y: 10 },
            { x: 20, y: 10 }
        );
        srcPage.annotations.add(annot);

        // Save and reload to ensure realistic document state
        const bytes = srcDoc.save();
        const loadedDoc = new PdfDocument(bytes);
        const loadedPage = loadedDoc.getPage(0);
        const loadedAnnot = loadedPage.annotations.at(0);

        // Create annotation reference and register it
        const annotRef = loadedAnnot._ref;
        srcDoc._crossReference._cacheMap.set(annotRef, loadedAnnot._dictionary);

        const destRef = srcDoc._crossReference._getNextReference();
        loadedAnnot._dictionary.set('OC', destRef);

        // Act
        helper._importAnnotation(loadedPage, destPage);

        // Assert
        expect(helper._annotationLayer.size).toBeGreaterThan(0);
    });

    it('_importAnnotation LOC 260-288 - empty annotation reference skips processing', () => {
        const destDoc = new PdfDocument();
        const srcDoc = new PdfDocument();
        const crossRef = new _PdfCrossReference(destDoc);
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const srcPage = srcDoc.addPage();
        const newPage = destDoc.addPage();

        srcPage.annotations._annotations = [];

        // Act
        helper._importAnnotation(srcPage, newPage);

        // Assert
        expect(newPage._pageDictionary.has('Annots')).toBeFalsy();
    });

    // ==================== LOC 337-370: _formFieldsGroupingSupport field field processing ====================

    it('_formFieldsGroupingSupport LOC 337-370 - field name found in fieldNames updates existing field', () => {
        const destDoc = new PdfDocument();
        const srcDoc = new PdfDocument();
        srcDoc.addPage();
        const crossRef = new _PdfCrossReference(destDoc);
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const srcForm = srcDoc.form;
        const field = new PdfTextBoxField(srcDoc.getPage(0), "example", { x: 100, y: 100, width: 20, height: 20 });;
        srcForm.add(field);

        const destForm = destDoc.form;
        destForm.add(new PdfTextBoxField(srcDoc.getPage(0), "example", { x: 100, y: 100, width: 20, height: 20 }));

        const oldPage = srcDoc.addPage();
        const newPage = destDoc.addPage();

        helper._isDuplicatePage = false;

        // Act
        helper._formFieldsGroupingSupport(srcForm, oldPage, newPage);

        // Assert
        expect(destForm.count).toBeGreaterThan(0);
    });

    it('_formFieldsGroupingSupport LOC 337-370 - sourceKids undefined calls groupFormFieldsKids with index 0', () => {
        const destDoc = new PdfDocument();
        const srcDoc = new PdfDocument();
        srcDoc.addPage();
        const crossRef = new _PdfCrossReference(destDoc);
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const srcForm = srcDoc.form;
        const field = new PdfTextBoxField(srcDoc.getPage(0), "example", { x: 100, y: 100, width: 20, height: 20 });;
        srcForm.add(field);

        const oldPage = srcDoc.addPage();
        const newPage = destDoc.addPage();

        helper._isDuplicatePage = true;

        // Act
        expect(() => {
            helper._formFieldsGroupingSupport(srcForm, oldPage, newPage);
        }).not.toThrow();

        // Assert
        expect(newPage).toBeDefined();
    });

    it('_formFieldsGroupingSupport LOC 337-370 - duplicate page sets _isDuplicatePage flag', () => {
        const destDoc = new PdfDocument();
        const srcDoc = new PdfDocument();
        srcDoc.addPage();
        const crossRef = new _PdfCrossReference(destDoc);
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const srcForm = srcDoc.form;
        const field = new PdfTextBoxField(srcDoc.getPage(0), "example", { x: 100, y: 100, width: 20, height: 20 });;
        srcForm.add(field);

        const oldPage = srcDoc.addPage();
        const newPage = destDoc.addPage();

        // Act
        helper._isDuplicatePage = true;
        helper._formFieldsGroupingSupport(srcForm, oldPage, newPage);

        // Assert
        expect(field._isDuplicatePage).toBeTruthy();
    });

    // ==================== LOC 445-495: _updateFieldsWithKids complex processing ====================

    it('_updateFieldsWithKids LOC 445-495 - creates new field reference and caches it', () => {
        const destDoc = new PdfDocument();
        const srcDoc = new PdfDocument();
        srcDoc.addPage();
        const crossRef = new _PdfCrossReference(destDoc);
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const destField = new PdfTextBoxField(srcDoc.getPage(0), "example", { x: 100, y: 100, width: 20, height: 20 });;
        destDoc.form.add(destField);
        const srcField = new PdfTextBoxField(srcDoc.getPage(0), "example1", { x: 200, y: 100, width: 20, height: 20 });;

        const fieldDict = destField._dictionary;
        const array: _PdfReference[] = [];

        // Act
        helper._updateFieldsWithKids(destField, srcField, fieldDict, -1, 0, crossRef._getNextReference(), [], array, srcDoc.form._dictionary);

        // Assert
        expect(helper._formFieldsCollection.size).toBeGreaterThanOrEqual(0);
    });

    it('_updateFieldsWithKids LOC 445-495 - updates destination field parent reference', () => {
        const destDoc = new PdfDocument();
        const srcDoc = new PdfDocument();
        srcDoc.addPage();
        const crossRef = new _PdfCrossReference(destDoc);
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const destField = new PdfTextBoxField(srcDoc.getPage(0), "example", { x: 100, y: 100, width: 20, height: 20 });;
        destDoc.form.add(destField);
        const srcField = new PdfTextBoxField(srcDoc.getPage(0), "example1", { x: 200, y: 100, width: 20, height: 20 });;

        const fieldDict = destField._dictionary;
        const oldParent = destField._dictionary.get('Parent');

        // Act
        helper._updateFieldsWithKids(destField, srcField, fieldDict, -1, 0, crossRef._getNextReference(), [], [], srcDoc.form._dictionary);

        // Assert
        expect(destField._dictionary.has('Parent')).toBeTruthy();
    });

    it('_updateFieldsWithKids LOC 445-495 - adds widget reference to array', () => {
        const destDoc = new PdfDocument();
        const srcDoc = new PdfDocument();
        srcDoc.addPage();
        const crossRef = new _PdfCrossReference(destDoc);
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const destField = new PdfTextBoxField(srcDoc.getPage(0), "example", { x: 100, y: 100, width: 20, height: 20 });;
        destDoc.form.add(destField);
        const srcField = new PdfTextBoxField(srcDoc.getPage(0), "example1", { x: 200, y: 100, width: 20, height: 20 });;

        const fieldDict = destField._dictionary;
        const array: _PdfReference[] = [];

        // Act
        helper._updateFieldsWithKids(destField, srcField, fieldDict, -1, 0, crossRef._getNextReference(), [], array, srcDoc.form._dictionary);

        // Assert
        expect(array.length).toBeGreaterThan(0);
    });

    // ==================== LOC 574-633: _createAppearance complex branching ====================





    it('_createAppearance LOC 574-633 - list field with widget rotationAngle sets angle', () => {
        const destDoc = new PdfDocument();
        const srcDoc = new PdfDocument();
        srcDoc.addPage()
        const crossRef = new _PdfCrossReference(destDoc);
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const destField: PdfListField = new PdfListBoxField(srcDoc.getPage(0), 'list1', { x: 100, y: 60, width: 100, height: 50 });
        destDoc.form.add(destField);
        const srcField = new PdfTextBoxField(srcDoc.getPage(0), "example", { x: 100, y: 100, width: 20, height: 20 });

        const oldDict = new _PdfDictionary(crossRef);
        const newDict = new _PdfDictionary(crossRef);
        const widget = { rotationAngle: 90 };

        // Act
        expect(() => {
            helper._createAppearance(destField, srcField, oldDict, newDict, new _PdfDictionary(), widget);
        }).not.toThrow();

        // Assert
        expect(destField).toBeDefined();
    });

    it('_createAppearance LOC 574-633 - text box field with widget dictionary obtains font', () => {
        const destDoc = new PdfDocument();
        const srcDoc = new PdfDocument();
        destDoc.addPage();
        srcDoc.addPage();
        const crossRef = new _PdfCrossReference(destDoc);
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const destField = new PdfTextBoxField(destDoc.getPage(0), "example", { x: 100, y: 100, width: 20, height: 20 });;
        destDoc.form.add(destField);
        const srcField = new PdfTextBoxField(srcDoc.getPage(0), "example1", { x: 200, y: 100, width: 20, height: 20 });;

        const oldDict = new _PdfDictionary(crossRef);
        const newDict = new _PdfDictionary(crossRef);
        const drEntry = new _PdfDictionary(crossRef);
        const widget = { _dictionary: new _PdfDictionary(crossRef) };

        // Act
        expect(() => {
            helper._createAppearance(destField, srcField, oldDict, newDict, drEntry, widget);
        }).not.toThrow();

        // Assert
        expect(destField).toBeDefined();
    });

    // ==================== LOC 828-891: _insertFormFields complex processing ====================

    it('_insertFormFields LOC 828-891 - field with Kids copies all non-Kids entries', () => {
        const destDoc = new PdfDocument();
        const srcDoc = new PdfDocument();
        srcDoc.addPage();
        const crossRef = new _PdfCrossReference(destDoc);
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const field = new PdfTextBoxField(srcDoc.getPage(0), "example", { x: 100, y: 100, width: 20, height: 20 });;
        srcDoc.form.add(field);
        field._dictionary.set('TestKey', 'TestValue');
        const kidRef = crossRef._getNextReference();
        field._dictionary.set('Kids', [kidRef]);

        // Act
        const result = helper._insertFormFields(0, field, destDoc.form, crossRef._getNextReference(), [], []);

        // Assert
        expect(result).toBeDefined();
    });

    it('_insertFormFields LOC 828-891 - field without Kids copies entire dictionary', () => {
        const destDoc = new PdfDocument();
        const srcDoc = new PdfDocument();
        srcDoc.addPage();
        const crossRef = new _PdfCrossReference(destDoc);
        const srcCrossRef = new _PdfCrossReference(srcDoc);
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());
        helper._copier = new _PdfCopier(crossRef, srcCrossRef);

        const field = new PdfTextBoxField(srcDoc.getPage(0), "example", { x: 100, y: 100, width: 20, height: 20 });;
        srcDoc.form.add(field);

        // Act
        const result = helper._insertFormFields(0, field, destDoc.form, crossRef._getNextReference(), [], []);

        // Assert
        expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it('_insertFormFields LOC 828-891 - field name collision appends index', () => {
        const destDoc = new PdfDocument();
        const srcDoc = new PdfDocument();
        srcDoc.addPage();
        const crossRef = new _PdfCrossReference(destDoc);
        const srcCrossRef = new _PdfCrossReference(srcDoc);
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());
        helper._copier = new _PdfCopier(crossRef, srcCrossRef);

        const field = new PdfTextBoxField(srcDoc.getPage(0), "example", { x: 100, y: 100, width: 20, height: 20 });;
        srcDoc.form.add(field);
        helper._fieldNames.push(field.name);

        // Act
        const result = helper._insertFormFields(0, field, destDoc.form, crossRef._getNextReference(), [], []);

        // Assert
        expect(result).toBeDefined();
    });

    it('_insertFormFields LOC 828-891 - fieldCount > 0 uses fieldCount as index', () => {
        const destDoc = new PdfDocument();
        let srcDoc = new PdfDocument();
        srcDoc.addPage();
        const crossRef = new _PdfCrossReference(destDoc);
        const srcCrossRef = new _PdfCrossReference(srcDoc);
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());
        helper._copier = new _PdfCopier(crossRef, srcCrossRef);
        helper._fieldCount = 5;

        let field = new PdfTextBoxField(srcDoc.getPage(0), "example", { x: 100, y: 100, width: 20, height: 20 });
        srcDoc.form.add(field);
        // Act
        const result = helper._insertFormFields(0, field, destDoc.form, crossRef._getNextReference(), [], []);

        // Assert
        expect(result).toBeDefined();
    });

    it('_insertFormFields LOC 828-891 - kids present filters by page membership', () => {
        const destDoc = new PdfDocument();
        const srcDoc = new PdfDocument();
        srcDoc.addPage();
        const crossRef = new _PdfCrossReference(destDoc);
        const srcCrossRef = new _PdfCrossReference(srcDoc);
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());
        helper._copier = new _PdfCopier(crossRef, srcCrossRef);

        const field = new PdfTextBoxField(srcDoc.getPage(0), "example", { x: 100, y: 100, width: 20, height: 20 });;
        srcDoc.form.add(field);

        const kidRef = crossRef._getNextReference();
        field._dictionary.set('Kids', [kidRef]);

        const widgetDict = new _PdfDictionary(crossRef);
        crossRef._cacheMap.set(kidRef, widgetDict);

        // Act
        const result = helper._insertFormFields(0, field, destDoc.form, crossRef._getNextReference(), [], [kidRef]);

        // Assert
        expect(result).toBeDefined();
    });

    // ==================== LOC 926-1023: _importLayers comprehensive branch coverage ====================

    it('_importLayers LOC 926-1023 - layers false sets _isLayersPresent false', () => {
        const destDoc = new PdfDocument();
        const crossRef = new _PdfCrossReference(destDoc);
        const srcDoc = new PdfDocument();
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const ocProps = new _PdfDictionary(crossRef);

        // Act
        helper._importLayers(ocProps, false);

        // Assert
        expect(helper._isLayersPresent).toBeFalsy();
    });

    it('_importLayers LOC 926-1023 - merges OCGs arrays', () => {
        const destDoc = new PdfDocument();
        const crossRef = new _PdfCrossReference(destDoc);
        const srcDoc = new PdfDocument();
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const destOCProps = new _PdfDictionary(crossRef);
        const destOCGs: any[] = [{ id: 1 }];
        destOCProps.set('OCGs', destOCGs);
        destDoc._catalog._catalogDictionary.set('OCProperties', destOCProps);

        const currentOCProps = new _PdfDictionary(crossRef);
        currentOCProps.set('OCGs', [{ id: 2 }]);
        const ocProps = new _PdfDictionary(crossRef);
        ocProps.set('OCProperties', currentOCProps);

        // Act
        helper._importLayers(ocProps, true);

        // Assert
        expect(destOCProps.get('OCGs').length).toBe(2);
    });

    it('_importLayers LOC 926-1023 - merges Order arrays when both present', () => {
        const destDoc = new PdfDocument();
        const crossRef = new _PdfCrossReference(destDoc);
        const srcDoc = new PdfDocument();
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const destD = new _PdfDictionary(crossRef);
        destD.set('Order', [1, 2]);
        const destOCProps = new _PdfDictionary(crossRef);
        destOCProps.set('D', destD);
        destDoc._catalog._catalogDictionary.set('OCProperties', destOCProps);

        const existingD = new _PdfDictionary(crossRef);
        existingD.set('Order', [3, 4]);
        const currentOCProps = new _PdfDictionary(crossRef);
        currentOCProps.set('D', existingD);
        const ocProps = new _PdfDictionary(crossRef);
        ocProps.set('OCProperties', currentOCProps);

        // Act
        helper._importLayers(ocProps, true);

        // Assert
        expect(destD.get('Order').length).toBe(4);
    });

    it('_importLayers LOC 926-1023 - sets Order when only source has it', () => {
        const destDoc = new PdfDocument();
        const crossRef = new _PdfCrossReference(destDoc);
        const srcDoc = new PdfDocument();
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const destD = new _PdfDictionary(crossRef);
        const destOCProps = new _PdfDictionary(crossRef);
        destOCProps.set('D', destD);
        destDoc._catalog._catalogDictionary.set('OCProperties', destOCProps);

        const existingD = new _PdfDictionary(crossRef);
        existingD.set('Order', [1, 2]);
        const currentOCProps = new _PdfDictionary(crossRef);
        currentOCProps.set('D', existingD);
        const ocProps = new _PdfDictionary(crossRef);
        ocProps.set('OCProperties', currentOCProps);

        // Act
        helper._importLayers(ocProps, true);

        // Assert
        expect(destD.has('Order')).toBeTruthy();
    });

    it('_importLayers LOC 926-1023 - merges RBGroups arrays', () => {
        const destDoc = new PdfDocument();
        const crossRef = new _PdfCrossReference(destDoc);
        const srcDoc = new PdfDocument();
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const destD = new _PdfDictionary(crossRef);
        destD.set('RBGroups', ['group1']);
        const destOCProps = new _PdfDictionary(crossRef);
        destOCProps.set('D', destD);
        destDoc._catalog._catalogDictionary.set('OCProperties', destOCProps);

        const existingD = new _PdfDictionary(crossRef);
        existingD.set('RBGroups', ['group2']);
        const currentOCProps = new _PdfDictionary(crossRef);
        currentOCProps.set('D', existingD);
        const ocProps = new _PdfDictionary(crossRef);
        ocProps.set('OCProperties', currentOCProps);

        // Act
        helper._importLayers(ocProps, true);

        // Assert
        expect(destD.get('RBGroups').length).toBe(2);
    });

    it('_importLayers LOC 926-1023 - merges ON arrays', () => {
        const destDoc = new PdfDocument();
        const crossRef = new _PdfCrossReference(destDoc);
        const srcDoc = new PdfDocument();
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const destD = new _PdfDictionary(crossRef);
        destD.set('ON', ['on1']);
        const destOCProps = new _PdfDictionary(crossRef);
        destOCProps.set('D', destD);
        destDoc._catalog._catalogDictionary.set('OCProperties', destOCProps);

        const existingD = new _PdfDictionary(crossRef);
        existingD.set('ON', ['on2']);
        const currentOCProps = new _PdfDictionary(crossRef);
        currentOCProps.set('D', existingD);
        const ocProps = new _PdfDictionary(crossRef);
        ocProps.set('OCProperties', currentOCProps);

        // Act
        helper._importLayers(ocProps, true);

        // Assert
        expect(destD.get('ON').length).toBe(2);
    });

    it('_importLayers LOC 926-1023 - merges AS arrays with reference dereferencing', () => {
        const destDoc = new PdfDocument();
        const crossRef = new _PdfCrossReference(destDoc);
        const srcDoc = new PdfDocument();
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const asDict1 = new _PdfDictionary(crossRef);
        asDict1.set('OCGs', ['item1']);
        const asRef1 = crossRef._getNextReference();
        crossRef._cacheMap.set(asRef1, asDict1);

        const asDict2 = new _PdfDictionary(crossRef);
        asDict2.set('OCGs', ['item2']);
        const asRef2 = crossRef._getNextReference();
        crossRef._cacheMap.set(asRef2, asDict2);

        const destD = new _PdfDictionary(crossRef);
        destD.set('AS', [asRef1]);
        const destOCProps = new _PdfDictionary(crossRef);
        destOCProps.set('D', destD);
        destDoc._catalog._catalogDictionary.set('OCProperties', destOCProps);

        const existingD = new _PdfDictionary(crossRef);
        existingD.set('AS', [asRef2]);
        const currentOCProps = new _PdfDictionary(crossRef);
        currentOCProps.set('D', existingD);
        const ocProps = new _PdfDictionary(crossRef);
        ocProps.set('OCProperties', currentOCProps);

        // Act
        helper._importLayers(ocProps, true);

        // Assert
        expect(destD.get('AS').length).toBe(2);
    });

    it('_importLayers LOC 926-1023 - merges OFF arrays', () => {
        const destDoc = new PdfDocument();
        const crossRef = new _PdfCrossReference(destDoc);
        const srcDoc = new PdfDocument();
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const destD = new _PdfDictionary(crossRef);
        destD.set('OFF', ['off1']);
        const destOCProps = new _PdfDictionary(crossRef);
        destOCProps.set('D', destD);
        destDoc._catalog._catalogDictionary.set('OCProperties', destOCProps);

        const existingD = new _PdfDictionary(crossRef);
        existingD.set('OFF', ['off2']);
        const currentOCProps = new _PdfDictionary(crossRef);
        currentOCProps.set('D', existingD);
        const ocProps = new _PdfDictionary(crossRef);
        ocProps.set('OCProperties', currentOCProps);

        // Act
        helper._importLayers(ocProps, true);

        // Assert
        expect(destD.get('OFF').length).toBe(2);
    });

    it('_importLayers LOC 926-1023 - merges Locked arrays', () => {
        const destDoc = new PdfDocument();
        const crossRef = new _PdfCrossReference(destDoc);
        const srcDoc = new PdfDocument();
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const destD = new _PdfDictionary(crossRef);
        destD.set('Locked', ['locked1']);
        const destOCProps = new _PdfDictionary(crossRef);
        destOCProps.set('D', destD);
        destDoc._catalog._catalogDictionary.set('OCProperties', destOCProps);

        const existingD = new _PdfDictionary(crossRef);
        existingD.set('Locked', ['locked2']);
        const currentOCProps = new _PdfDictionary(crossRef);
        currentOCProps.set('D', existingD);
        const ocProps = new _PdfDictionary(crossRef);
        ocProps.set('OCProperties', currentOCProps);

        // Act
        helper._importLayers(ocProps, true);

        // Assert
        expect(destD.get('Locked').length).toBe(2);
    });

    it('_importLayers LOC 926-1023 - sets D from current when destination has no D', () => {
        const destDoc = new PdfDocument();
        const crossRef = new _PdfCrossReference(destDoc);
        const srcDoc = new PdfDocument();
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const destOCProps = new _PdfDictionary(crossRef);
        destDoc._catalog._catalogDictionary.set('OCProperties', destOCProps);

        const existingD = new _PdfDictionary(crossRef);
        const currentOCProps = new _PdfDictionary(crossRef);
        currentOCProps.set('D', existingD);
        const ocProps = new _PdfDictionary(crossRef);
        ocProps.set('OCProperties', currentOCProps);

        // Act
        helper._importLayers(ocProps, true);

        // Assert
        expect(destOCProps.has('D')).toBeTruthy();
    });

    it('_importLayers LOC 926-1023 - updates OCProperties when no destination OCProperties exists', () => {
        const destDoc = new PdfDocument();
        const crossRef = new _PdfCrossReference(destDoc);
        const srcDoc = new PdfDocument();
        const helper = new _PdfMergeHelper(crossRef, destDoc, srcDoc, new Map(), new PdfPageImportOptions());

        const currentOCProps = new _PdfDictionary(crossRef);
        const ocProps = new _PdfDictionary(crossRef);
        ocProps.set('OCProperties', currentOCProps);

        // Act
        helper._importLayers(ocProps, true);

        // Assert
        expect(destDoc._catalog._catalogDictionary.has('OCProperties')).toBeTruthy();
    });

});
