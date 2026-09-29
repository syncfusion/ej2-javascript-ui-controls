import { PdfListFieldItem, PdfRadioButtonListItem, PdfStateItem } from "../src/pdf/core/annotations/annotation";
import { PdfRotationAngle } from "../src/pdf/core/enumerator";
import { PdfCheckBoxField, PdfComboBoxField, PdfRadioButtonListField, PdfSignatureField, PdfTextBoxField } from "../src/pdf/core/form/field";
import { PdfDocument } from "../src/pdf/core/pdf-document";
import { _PdfCopier, _PdfMergeHelper } from "../src/pdf/core/pdf-merge";
import { PdfBookmark, PdfBookmarkBase } from "../src/pdf/core/pdf-outline";
import { PdfPage } from "../src/pdf/core/pdf-page";
import { PdfPageImportOptions } from "../src/pdf/core/pdf-page-import-options";
import { _PdfDictionary, _PdfName, _PdfReference } from "../src/pdf/core/pdf-primitives";
describe('1041642 _PdfMergeHelper surviving mutants', () => {
    let sourceDocument: PdfDocument;
    let destinationDocument: PdfDocument;
    let helper: _PdfMergeHelper;
    beforeEach(() => {
        sourceDocument = new PdfDocument();
        destinationDocument = new PdfDocument();
        helper = new _PdfMergeHelper(
            destinationDocument._crossReference,
            destinationDocument,
            sourceDocument,
            new Map<_PdfDictionary, PdfPage>(),
            new PdfPageImportOptions()
        );
    });
    afterEach(() => {
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    describe('1041642 _removeFieldDictionary', () => {
        it('1041642 removes every requested field entry and keeps unrelated entries', () => {
            const dictionary: _PdfDictionary = new _PdfDictionary(
                destinationDocument._crossReference
            );
            const parentReference: _PdfReference =
                destinationDocument._crossReference._getNextReference();
            dictionary.update('Parent', parentReference);
            dictionary.update('FT', _PdfName.get('Tx'));
            dictionary.update('T', 'CustomerName');
            dictionary.update('Ff', 1);
            dictionary.update('V', 'John');
            const result: _PdfDictionary = helper._removeFieldDictionary(
                dictionary,
                ['Parent', 'FT', 'T', 'Ff']
            );
            expect(result).toBe(dictionary);
            expect(result.has('Parent')).toBe(false);
            expect(result.has('FT')).toBe(false);
            expect(result.has('T')).toBe(false);
            expect(result.has('Ff')).toBe(false);
            expect(result.has('V')).toBe(true);
            expect(result.get('V')).toBe('John');
        });
        it('1041642 ignores missing removal entries without altering existing entries', () => {
            const dictionary: _PdfDictionary = new _PdfDictionary(
                destinationDocument._crossReference
            );
            dictionary.update('V', 'Retained value');
            const result: _PdfDictionary = helper._removeFieldDictionary(
                dictionary,
                ['Parent', 'FT', 'T', 'Ff']
            );
            expect(result).toBe(dictionary);
            expect(result.size).toBe(1);
            expect(result.has('V')).toBe(true);
            expect(result.get('V')).toBe('Retained value');
        });
    });
    describe('1041642 _updateFieldDictionary', () => {
        it('1041642 replaces field-level entries with page and parent references', () => {
            const dictionary: _PdfDictionary = new _PdfDictionary(
                destinationDocument._crossReference
            );
            const oldParentReference: _PdfReference =
                destinationDocument._crossReference._getNextReference();
            const pageReference: _PdfReference =
                destinationDocument._crossReference._getNextReference();
            const parentReference: _PdfReference =
                destinationDocument._crossReference._getNextReference();
            dictionary.update('Parent', oldParentReference);
            dictionary.update('FT', _PdfName.get('Tx'));
            dictionary.update('T', 'Address');
            dictionary.update('Ff', 1);
            dictionary.update('V', 'Chennai');
            dictionary._updated = false;
            helper._updateFieldDictionary(
                dictionary,
                pageReference,
                parentReference
            );
            expect(dictionary.has('FT')).toBe(false);
            expect(dictionary.has('T')).toBe(false);
            expect(dictionary.has('Ff')).toBe(false);
            expect(dictionary.getRaw('P')).toBe(pageReference);
            expect(dictionary.getRaw('Parent')).toBe(parentReference);
            expect(dictionary.get('V')).toBe('Chennai');
            expect(dictionary._updated).toBe(true);
        });
    });
    describe('1041642 _createNewFieldDictionary', () => {
        it('1041642 moves all supported parent entries from both widget dictionaries', () => {
            // Arrange
            const fieldDictionary: _PdfDictionary = new _PdfDictionary(
                destinationDocument._crossReference
            );
            const destinationDictionary: _PdfDictionary = new _PdfDictionary(
                destinationDocument._crossReference
            );
            const parentReference: _PdfReference =
                destinationDocument._crossReference._getNextReference();
            const parentDictionary: _PdfDictionary = new _PdfDictionary(
                destinationDocument._crossReference
            );
            const options: string[] = ['One', 'Two'];
            parentDictionary.update('T', 'ParentField');
            destinationDocument._crossReference._cacheMap.set(
                parentReference,
                parentDictionary
            );
            fieldDictionary.update('Parent', parentReference);
            fieldDictionary.update('FT', _PdfName.get('Ch'));
            fieldDictionary.update('T', 'Country');
            fieldDictionary.update('V', 'One');
            fieldDictionary.update('Ff', 2);
            fieldDictionary.update('TU', 'Country selection');
            fieldDictionary.update('Opt', options);
            fieldDictionary.update('I', [0]);
            fieldDictionary.update('P', parentReference);
            destinationDictionary.update('Parent', parentReference);
            destinationDictionary.update('FT', _PdfName.get('Ch'));
            destinationDictionary.update('T', 'Country');
            destinationDictionary.update('V', 'Two');
            destinationDictionary.update('Ff', 2);
            destinationDictionary.update('TU', 'Country selection');
            destinationDictionary.update('Opt', options);
            destinationDictionary.update('I', [1]);
            destinationDictionary.update('P', parentReference);
            // Act
            const result: _PdfDictionary = helper._createNewFieldDictionary(
                fieldDictionary,
                destinationDictionary
            );
            // Assert
            expect(result.has('Parent')).toBe(true);
            expect(result.getRaw('Parent')).toBe(parentDictionary);
            expect((result.get('FT') as _PdfName).name).toBe('Ch');
            expect(result.get('T')).toBe('Country');
            expect(result.get('V')).toBe('One');
            expect(result.get('Ff')).toBe(2);
            expect(result.get('TU')).toBe('Country selection');
            expect(result.get('Opt')).toBe(options);
            expect((result.get('I') as number[])[0]).toBe(0);
            expect(fieldDictionary.has('Parent')).toBe(false);
            expect(fieldDictionary.has('FT')).toBe(false);
            expect(fieldDictionary.has('T')).toBe(false);
            expect(fieldDictionary.has('V')).toBe(false);
            expect(fieldDictionary.has('Ff')).toBe(false);
            expect(fieldDictionary.has('TU')).toBe(false);
            expect(fieldDictionary.has('Opt')).toBe(false);
            expect(fieldDictionary.has('I')).toBe(false);
            expect(destinationDictionary.has('Parent')).toBe(false);
            expect(destinationDictionary.has('FT')).toBe(false);
            expect(destinationDictionary.has('T')).toBe(false);
            expect(destinationDictionary.has('V')).toBe(false);
            expect(destinationDictionary.has('Ff')).toBe(false);
            expect(destinationDictionary.has('TU')).toBe(false);
            expect(destinationDictionary.has('Opt')).toBe(false);
            expect(destinationDictionary.has('I')).toBe(false);
            expect(fieldDictionary.getRaw('P')).toBe(parentReference);
            expect(destinationDictionary.getRaw('P')).toBe(parentReference);
        });
        it('1041642 does not add unsupported or absent field entries', () => {
            const fieldDictionary: _PdfDictionary = new _PdfDictionary(
                destinationDocument._crossReference
            );
            const destinationDictionary: _PdfDictionary = new _PdfDictionary(
                destinationDocument._crossReference
            );
            fieldDictionary.update('Subtype', _PdfName.get('Widget'));
            destinationDictionary.update('Subtype', _PdfName.get('Widget'));
            const result: _PdfDictionary = helper._createNewFieldDictionary(
                fieldDictionary,
                destinationDictionary
            );
            expect(result.size).toBe(0);
            expect(fieldDictionary.has('Subtype')).toBe(true);
            expect(destinationDictionary.has('Subtype')).toBe(true);
        });
    });
    describe('1041642 _groupFormFieldsKids common kids branch', () => {
        it('1041642 copies the selected existing kid and updates its structural entries', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfTextBoxField = new PdfTextBoxField(
                sourcePage,
                'SharedText',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfTextBoxField = new PdfTextBoxField(
                destinationPage,
                'SharedText',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const sourceKidReference: _PdfReference =
                sourceField._dictionary.getRaw('Kids')[0] as _PdfReference;
            const sourceKids: _PdfReference[] = [sourceKidReference];
            const pageKids: _PdfReference[] = [sourceKidReference];
            const destinationKids: _PdfReference[] =
                destinationField._dictionary.getRaw('Kids') as _PdfReference[];
            const annotations: _PdfReference[] = [];
            const result: _PdfReference[] = helper._groupFormFieldsKids(
                destinationField,
                sourceField,
                pageKids,
                destinationKids,
                sourceKids,
                destinationPage._ref,
                annotations,
                0,
                0,
                new _PdfDictionary(destinationDocument._crossReference),
                sourceField.itemAt(0)
            );
            expect(result).toBe(annotations);
            expect(result.length).toBe(1);
            expect(destinationKids.length).toBe(2);
            const copiedReference: _PdfReference = result[0];
            const copiedDictionary: _PdfDictionary =
                destinationDocument._crossReference._fetch(copiedReference);
            expect(copiedDictionary).toBeDefined();
            expect(copiedDictionary.getRaw('P')).toBe(destinationPage._ref);
            expect(copiedDictionary.getRaw('Parent')).toBe(
                destinationField._ref
            );
            expect(copiedDictionary._updated).toBe(true);
            expect(destinationField._dictionary._updated).toBe(true);
        });
        it('1041642 skips a source kid that is not present on the imported page', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfTextBoxField = new PdfTextBoxField(
                sourcePage,
                'SkippedText',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfTextBoxField = new PdfTextBoxField(
                destinationPage,
                'SkippedText',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const sourceKidReference: _PdfReference =
                sourceField._dictionary.getRaw('Kids')[0] as _PdfReference;
            const destinationKids: _PdfReference[] =
                destinationField._dictionary.getRaw('Kids') as _PdfReference[];
            const originalDestinationKidsCount: number =
                destinationKids.length;
            const annotations: _PdfReference[] = [];
            const result: _PdfReference[] = helper._groupFormFieldsKids(
                destinationField,
                sourceField,
                [],
                destinationKids,
                [sourceKidReference],
                destinationPage._ref,
                annotations,
                0,
                0,
                new _PdfDictionary(destinationDocument._crossReference)
            );
            expect(result.length).toBe(0);
            expect(destinationKids.length).toBe(
                originalDestinationKidsCount
            );
        });
        it('1041642 skips common kids branch when index is null', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfTextBoxField = new PdfTextBoxField(
                sourcePage,
                'NullIndex',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfTextBoxField = new PdfTextBoxField(
                destinationPage,
                'NullIndex',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const sourceKidReference: _PdfReference =
                sourceField._dictionary.getRaw('Kids')[0] as _PdfReference;
            const annotations: _PdfReference[] = [];
            helper._groupFormFieldsKids(
                destinationField,
                sourceField,
                [sourceKidReference],
                destinationField._dictionary.getRaw('Kids') as _PdfReference[],
                [sourceKidReference],
                destinationPage._ref,
                annotations,
                null as any,
                0,
                new _PdfDictionary(destinationDocument._crossReference)
            );
            expect(annotations.length).toBe(0);
        });
        it('1041642 skips common kids branch when index is undefined', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfTextBoxField = new PdfTextBoxField(
                sourcePage,
                'UndefinedIndex',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfTextBoxField = new PdfTextBoxField(
                destinationPage,
                'UndefinedIndex',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const sourceKidReference: _PdfReference =
                sourceField._dictionary.getRaw('Kids')[0] as _PdfReference;
            const annotations: _PdfReference[] = [];
            helper._groupFormFieldsKids(
                destinationField,
                sourceField,
                [sourceKidReference],
                destinationField._dictionary.getRaw('Kids') as _PdfReference[],
                [sourceKidReference],
                destinationPage._ref,
                annotations,
                undefined,
                0,
                new _PdfDictionary(destinationDocument._crossReference)
            );
            expect(annotations.length).toBe(0);
        });
        it('1041642 skips common kids branch when index is negative', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfTextBoxField = new PdfTextBoxField(
                sourcePage,
                'NegativeIndex',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfTextBoxField = new PdfTextBoxField(
                destinationPage,
                'NegativeIndex',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const sourceKidReference: _PdfReference =
                sourceField._dictionary.getRaw('Kids')[0] as _PdfReference;
            const annotations: _PdfReference[] = [];
            helper._groupFormFieldsKids(
                destinationField,
                sourceField,
                [sourceKidReference],
                destinationField._dictionary.getRaw('Kids') as _PdfReference[],
                [sourceKidReference],
                destinationPage._ref,
                annotations,
                -1,
                0,
                new _PdfDictionary(destinationDocument._crossReference)
            );
            expect(annotations.length).toBe(0);
        });
        it('1041642 skips common kids branch when index equals kids length', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfTextBoxField = new PdfTextBoxField(
                sourcePage,
                'UpperBoundIndex',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfTextBoxField = new PdfTextBoxField(
                destinationPage,
                'UpperBoundIndex',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const sourceKidReference: _PdfReference =
                sourceField._dictionary.getRaw('Kids')[0] as _PdfReference;
            const sourceKids: _PdfReference[] = [sourceKidReference];
            const annotations: _PdfReference[] = [];
            helper._groupFormFieldsKids(
                destinationField,
                sourceField,
                [sourceKidReference],
                destinationField._dictionary.getRaw('Kids') as _PdfReference[],
                sourceKids,
                destinationPage._ref,
                annotations,
                sourceKids.length,
                0,
                new _PdfDictionary(destinationDocument._crossReference)
            );
            expect(annotations.length).toBe(0);
        });
    });
    describe('1041642 _groupFormFieldsKids structure branches', () => {
        it('1041642 converts a destination field without kids into a parent with kids', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfTextBoxField = new PdfTextBoxField(
                sourcePage,
                'SourceWithKids',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfTextBoxField = new PdfTextBoxField(
                destinationPage,
                'SourceWithKids',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const sourceKidReference: _PdfReference =
                sourceField._dictionary.getRaw('Kids')[0] as _PdfReference;
            delete destinationField._dictionary._map.Kids;
            const annotations: _PdfReference[] = [];
            helper._groupFormFieldsKids(
                destinationField,
                sourceField,
                [sourceKidReference],
                [],
                [sourceKidReference],
                destinationPage._ref,
                annotations,
                0,
                0,
                new _PdfDictionary(destinationDocument._crossReference)
            );
            expect(destinationField._dictionary.has('Parent')).toBe(true);
            expect(annotations.length).toBe(1);
            const copiedDictionary: _PdfDictionary =
                destinationDocument._crossReference._fetch(annotations[0]);
            expect(copiedDictionary.getRaw('P')).toBe(destinationPage._ref);
            expect(copiedDictionary.has('Parent')).toBe(true);
        });
        it('1041642 adds a source field without kids to destination kids', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfTextBoxField = new PdfTextBoxField(
                sourcePage,
                'SourceWithoutKids',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfTextBoxField = new PdfTextBoxField(
                destinationPage,
                'SourceWithoutKids',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            delete sourceField._dictionary._map.Kids;
            const destinationKids: _PdfReference[] =
                destinationField._dictionary.getRaw('Kids') as _PdfReference[];
            const originalKidsCount: number = destinationKids.length;
            const annotations: _PdfReference[] = [];
            helper._groupFormFieldsKids(
                destinationField,
                sourceField,
                [],
                destinationKids,
                [],
                destinationPage._ref,
                annotations,
                0,
                0,
                new _PdfDictionary(destinationDocument._crossReference)
            );
            expect(destinationKids.length).toBe(originalKidsCount + 1);
            expect(annotations.length).toBe(1);
            const insertedDictionary: _PdfDictionary =
                destinationDocument._crossReference._fetch(annotations[0]);
            expect(insertedDictionary.getRaw('P')).toBe(destinationPage._ref);
            expect(insertedDictionary.getRaw('Parent')).toBe(
                destinationField._ref
            );
            expect(destinationField._dictionary._updated).toBe(true);
        });
        it('1041642 converts two fields without kids into parent and widget dictionaries', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfTextBoxField = new PdfTextBoxField(
                sourcePage,
                'BothWithoutKids',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfTextBoxField = new PdfTextBoxField(
                destinationPage,
                'BothWithoutKids',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            delete sourceField._dictionary._map.Kids;
            delete destinationField._dictionary._map.Kids;
            sourceField._dictionary.update('Parent',
                sourceDocument._crossReference._getNextReference());
            sourceField._dictionary.update('FT', _PdfName.get('Tx'));
            sourceField._dictionary.update('T', 'BothWithoutKids');
            sourceField._dictionary.update('Ff', 0);
            const annotations: _PdfReference[] = [];
            helper._groupFormFieldsKids(
                destinationField,
                sourceField,
                [],
                [],
                [],
                destinationPage._ref,
                annotations,
                0,
                0,
                new _PdfDictionary(destinationDocument._crossReference)
            );
            expect(annotations.length).toBe(1);
            expect(destinationField._dictionary.has('Parent')).toBe(true);
            const widgetDictionary: _PdfDictionary =
                destinationDocument._crossReference._fetch(annotations[0]);
            expect(widgetDictionary.getRaw('P')).toBe(destinationPage._ref);
            expect(widgetDictionary.has('Parent')).toBe(true);
            expect(widgetDictionary.has('FT')).toBe(false);
            expect(widgetDictionary.has('T')).toBe(false);
            expect(widgetDictionary.has('Ff')).toBe(false);
        });
        it('1041642 uses the conversion branch while duplicating a page', () => {
            // Arrange
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfTextBoxField = new PdfTextBoxField(
                sourcePage,
                'DuplicateField',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfTextBoxField = new PdfTextBoxField(
                destinationPage,
                'DuplicateField',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const sourceKids: _PdfReference[] =
                sourceField._dictionary.getRaw('Kids') as _PdfReference[];
            const sourceKidReference: _PdfReference = sourceKids[0];
            const annotations: _PdfReference[] = [];
            delete destinationField._dictionary._map.Kids;
            helper._isDuplicatePage = true;
            // Act
            helper._groupFormFieldsKids(
                destinationField,
                sourceField,
                [sourceKidReference],
                [],
                sourceKids,
                destinationPage._ref,
                annotations,
                0,
                0,
                new _PdfDictionary(destinationDocument._crossReference)
            );
            // Restore
            helper._isDuplicatePage = false;
            // Assert
            expect(destinationField._dictionary.has('Parent')).toBe(true);
            expect(annotations.length).toBe(1);
            const widgetDictionary: _PdfDictionary =
                destinationDocument._crossReference._fetch(annotations[0]);
            expect(widgetDictionary).toBeDefined();
            expect(widgetDictionary.getRaw('P')).toBe(destinationPage._ref);
            expect(widgetDictionary.has('Parent')).toBe(true);
        });
    });
    describe('1041642 _updateFieldsWithKids guards and output', () => {
        it('1041642 uses the selected old kid when index is valid', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfTextBoxField = new PdfTextBoxField(
                sourcePage,
                'ValidKid',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfTextBoxField = new PdfTextBoxField(
                destinationPage,
                'ValidKid',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const sourceKidReference: _PdfReference =
                sourceField._dictionary.getRaw('Kids')[0] as _PdfReference;
            const sourceKidDictionary: _PdfDictionary =
                sourceDocument._crossReference._fetch(sourceKidReference);
            sourceKidDictionary.update('UniqueMarker', 'Selected kid');
            sourceKidDictionary.update('AS', _PdfName.get('On'));
            const fieldDictionary: _PdfDictionary =
                helper._copier._copyDictionary(destinationField._dictionary);
            const annotations: _PdfReference[] = [];
            helper._updateFieldsWithKids(
                destinationField,
                sourceField,
                fieldDictionary,
                0,
                0,
                destinationPage._ref,
                [sourceKidReference],
                annotations,
                new _PdfDictionary(destinationDocument._crossReference)
            );
            expect(annotations.length).toBe(1);
            const copiedDictionary: _PdfDictionary =
                destinationDocument._crossReference._fetch(annotations[0]);
            expect(copiedDictionary.get('UniqueMarker')).toBe('Selected kid');
            expect(copiedDictionary.getRaw('P')).toBe(destinationPage._ref);
            expect(copiedDictionary.has('Parent')).toBe(true);
            expect(copiedDictionary.has('AS')).toBe(false);
            expect(copiedDictionary._updated).toBe(true);
            expect(destinationField._dictionary._updated).toBe(true);
        });
        it('1041642 uses supplied dictionary when old kids is undefined', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfTextBoxField = new PdfTextBoxField(
                sourcePage,
                'UndefinedKids',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfTextBoxField = new PdfTextBoxField(
                destinationPage,
                'UndefinedKids',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const providedDictionary: _PdfDictionary = new _PdfDictionary(
                sourceDocument._crossReference
            );
            providedDictionary.update('Subtype', _PdfName.get('Widget'));
            providedDictionary.update('UniqueMarker', 'Provided dictionary');
            const fieldDictionary: _PdfDictionary =
                helper._copier._copyDictionary(destinationField._dictionary);
            const annotations: _PdfReference[] = [];
            helper._updateFieldsWithKids(
                destinationField,
                sourceField,
                fieldDictionary,
                undefined as any,
                1,
                destinationPage._ref,
                undefined as any,
                annotations,
                new _PdfDictionary(destinationDocument._crossReference),
                providedDictionary
            );
            expect(annotations.length).toBe(1);
            const copiedDictionary: _PdfDictionary =
                destinationDocument._crossReference._fetch(annotations[0]);
            expect(copiedDictionary.get('UniqueMarker')).toBe(
                'Provided dictionary'
            );
        });
        it('1041642 uses supplied dictionary when old kids is empty', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfTextBoxField = new PdfTextBoxField(
                sourcePage,
                'EmptyKids',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfTextBoxField = new PdfTextBoxField(
                destinationPage,
                'EmptyKids',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const providedDictionary: _PdfDictionary = new _PdfDictionary(
                sourceDocument._crossReference
            );
            providedDictionary.update('Subtype', _PdfName.get('Widget'));
            providedDictionary.update('UniqueMarker', 'Empty kids fallback');
            const annotations: _PdfReference[] = [];
            helper._updateFieldsWithKids(
                destinationField,
                sourceField,
                helper._copier._copyDictionary(destinationField._dictionary),
                0,
                2,
                destinationPage._ref,
                [],
                annotations,
                new _PdfDictionary(destinationDocument._crossReference),
                providedDictionary
            );
            const copiedDictionary: _PdfDictionary =
                destinationDocument._crossReference._fetch(annotations[0]);
            expect(copiedDictionary.get('UniqueMarker')).toBe(
                'Empty kids fallback'
            );
        });
        it('1041642 uses supplied dictionary when index is undefined', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfTextBoxField = new PdfTextBoxField(
                sourcePage,
                'UndefinedKidIndex',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfTextBoxField = new PdfTextBoxField(
                destinationPage,
                'UndefinedKidIndex',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const sourceKidReference: _PdfReference =
                sourceField._dictionary.getRaw('Kids')[0] as _PdfReference;
            const providedDictionary: _PdfDictionary = new _PdfDictionary(
                sourceDocument._crossReference
            );
            providedDictionary.update('Subtype', _PdfName.get('Widget'));
            providedDictionary.update(
                'UniqueMarker',
                'Undefined index fallback'
            );
            const annotations: _PdfReference[] = [];
            helper._updateFieldsWithKids(
                destinationField,
                sourceField,
                helper._copier._copyDictionary(destinationField._dictionary),
                undefined as any,
                3,
                destinationPage._ref,
                [sourceKidReference],
                annotations,
                new _PdfDictionary(destinationDocument._crossReference),
                providedDictionary
            );
            const copiedDictionary: _PdfDictionary =
                destinationDocument._crossReference._fetch(annotations[0]);
            expect(copiedDictionary.get('UniqueMarker')).toBe(
                'Undefined index fallback'
            );
        });
        it('1041642 uses supplied dictionary when index is null', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfTextBoxField = new PdfTextBoxField(
                sourcePage,
                'NullKidIndex',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfTextBoxField = new PdfTextBoxField(
                destinationPage,
                'NullKidIndex',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const sourceKidReference: _PdfReference =
                sourceField._dictionary.getRaw('Kids')[0] as _PdfReference;
            const providedDictionary: _PdfDictionary = new _PdfDictionary(
                sourceDocument._crossReference
            );
            providedDictionary.update('Subtype', _PdfName.get('Widget'));
            providedDictionary.update('UniqueMarker', 'Null index fallback');
            const annotations: _PdfReference[] = [];
            helper._updateFieldsWithKids(
                destinationField,
                sourceField,
                helper._copier._copyDictionary(destinationField._dictionary),
                null as any,
                4,
                destinationPage._ref,
                [sourceKidReference],
                annotations,
                new _PdfDictionary(destinationDocument._crossReference),
                providedDictionary
            );
            const copiedDictionary: _PdfDictionary =
                destinationDocument._crossReference._fetch(annotations[0]);
            expect(copiedDictionary.get('UniqueMarker')).toBe(
                'Null index fallback'
            );
        });
        it('1041642 uses supplied dictionary when index is negative', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfTextBoxField = new PdfTextBoxField(
                sourcePage,
                'NegativeKidIndex',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfTextBoxField = new PdfTextBoxField(
                destinationPage,
                'NegativeKidIndex',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const sourceKidReference: _PdfReference =
                sourceField._dictionary.getRaw('Kids')[0] as _PdfReference;
            const providedDictionary: _PdfDictionary = new _PdfDictionary(
                sourceDocument._crossReference
            );
            providedDictionary.update('Subtype', _PdfName.get('Widget'));
            providedDictionary.update(
                'UniqueMarker',
                'Negative index fallback'
            );
            const annotations: _PdfReference[] = [];
            helper._updateFieldsWithKids(
                destinationField,
                sourceField,
                helper._copier._copyDictionary(destinationField._dictionary),
                -1,
                5,
                destinationPage._ref,
                [sourceKidReference],
                annotations,
                new _PdfDictionary(destinationDocument._crossReference),
                providedDictionary
            );
            const copiedDictionary: _PdfDictionary =
                destinationDocument._crossReference._fetch(annotations[0]);
            expect(copiedDictionary.get('UniqueMarker')).toBe(
                'Negative index fallback'
            );
        });
        it('1041642 uses supplied dictionary when index equals old kids length', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfTextBoxField = new PdfTextBoxField(
                sourcePage,
                'UpperBoundKidIndex',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfTextBoxField = new PdfTextBoxField(
                destinationPage,
                'UpperBoundKidIndex',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const sourceKidReference: _PdfReference =
                sourceField._dictionary.getRaw('Kids')[0] as _PdfReference;
            const sourceKids: _PdfReference[] = [sourceKidReference];
            const providedDictionary: _PdfDictionary = new _PdfDictionary(
                sourceDocument._crossReference
            );
            providedDictionary.update('Subtype', _PdfName.get('Widget'));
            providedDictionary.update(
                'UniqueMarker',
                'Upper bound fallback'
            );
            const annotations: _PdfReference[] = [];
            helper._updateFieldsWithKids(
                destinationField,
                sourceField,
                helper._copier._copyDictionary(destinationField._dictionary),
                sourceKids.length,
                6,
                destinationPage._ref,
                sourceKids,
                annotations,
                new _PdfDictionary(destinationDocument._crossReference),
                providedDictionary
            );
            const copiedDictionary: _PdfDictionary =
                destinationDocument._crossReference._fetch(annotations[0]);
            expect(copiedDictionary.get('UniqueMarker')).toBe(
                'Upper bound fallback'
            );
        });
        it('1041642 creates a parent containing destination and copied widget references', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfTextBoxField = new PdfTextBoxField(
                sourcePage,
                'ParentKids',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfTextBoxField = new PdfTextBoxField(
                destinationPage,
                'ParentKids',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const sourceKidReference: _PdfReference =
                sourceField._dictionary.getRaw('Kids')[0] as _PdfReference;
            const fieldIndex: number = 7;
            const annotations: _PdfReference[] = [];
            helper._updateFieldsWithKids(
                destinationField,
                sourceField,
                helper._copier._copyDictionary(destinationField._dictionary),
                0,
                fieldIndex,
                destinationPage._ref,
                [sourceKidReference],
                annotations,
                new _PdfDictionary(destinationDocument._crossReference)
            );
            const newFieldReference: _PdfReference =
                destinationField._dictionary.getRaw('Parent');
            const parentDictionary: _PdfDictionary =
                destinationDocument._crossReference._fetch(newFieldReference);
            const parentKids: _PdfReference[] =
                parentDictionary.getRaw('Kids') as _PdfReference[];
            expect(parentKids.length).toBe(2);
            expect(parentKids[0]).toBe(destinationField._ref);
            expect(parentKids[1]).toBe(annotations[0]);
            expect(parentDictionary._updated).toBe(true);
            expect(helper._formFieldsCollection.get(fieldIndex)).toBe(
                newFieldReference
            );
            expect(destinationDocument.form._parsedFields.has(fieldIndex))
                .toBe(true);
        });
    });
    describe('1041642 _getItemStyle and _createAppearance', () => {
        it('1041642 reads item style from MK caption', () => {
            // Arrange
            const page: PdfPage = destinationDocument.addPage();
            const checkBox: PdfCheckBoxField = new PdfCheckBoxField(
                'StyledCheckBox',
                { x: 10, y: 10, width: 20, height: 20 },
                page
            );
            destinationDocument.form.add(checkBox);
            const item: PdfStateItem = checkBox.itemAt(0);
            const appearanceDictionary: _PdfDictionary = new _PdfDictionary(
                destinationDocument._crossReference
            );
            appearanceDictionary.update('CA', '8');
            item._dictionary.update('MK', appearanceDictionary);
            // Act
            helper._getItemStyle(item, checkBox);
            // Assert
            expect(item._styleText).toBe('8');
        });
        it('1041642 uses radio default style when MK caption is absent', () => {
            // Arrange
            const page: PdfPage = destinationDocument.addPage();
            const radioField: PdfRadioButtonListField =
                new PdfRadioButtonListField(
                    page,
                    'RadioStyle',
                    {
                        items: [
                            {
                                name: 'RadioItem',
                                bounds: {
                                    x: 10,
                                    y: 10,
                                    width: 20,
                                    height: 20
                                }
                            }
                        ]
                    }
                );
            destinationDocument.form.add(radioField);
            const item: PdfRadioButtonListItem = radioField.itemAt(0);
            delete item._dictionary._map.MK;
            // Act
            helper._getItemStyle(item, radioField);
            // Assert
            expect(item._styleText).toBe('l');
        });
        it('1041642 uses check box default style when MK caption is absent', () => {
            // Arrange
            const page: PdfPage = destinationDocument.addPage();
            const checkBox: PdfCheckBoxField = new PdfCheckBoxField(
                'CheckBoxStyle',
                { x: 10, y: 10, width: 20, height: 20 },
                page
            );
            destinationDocument.form.add(checkBox);
            const item: PdfStateItem = checkBox.itemAt(0);
            delete item._dictionary._map.MK;
            // Act
            helper._getItemStyle(item, checkBox);
            // Assert
            expect(item._styleText).toBe('4');
        });
        it('1041642 forces copied radio value to Off for check box appearance', () => {
            // Arrange
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceRadio: PdfRadioButtonListField =
                new PdfRadioButtonListField(
                    sourcePage,
                    'SourceRadio',
                    {
                        items: [
                            {
                                name: 'SourceRadioItem',
                                bounds: {
                                    x: 10,
                                    y: 10,
                                    width: 20,
                                    height: 20
                                }
                            }
                        ]
                    }
                );
            const destinationCheckBox: PdfCheckBoxField =
                new PdfCheckBoxField(
                    'DestinationCheckBox',
                    {
                        x: 20,
                        y: 20,
                        width: 20,
                        height: 20
                    },
                    destinationPage
                );
            sourceDocument.form.add(sourceRadio);
            destinationDocument.form.add(destinationCheckBox);
            const sourceDictionary: _PdfDictionary =
                sourceRadio.itemAt(0)._dictionary;
            sourceDictionary.update('AS', _PdfName.get('Selected'));
            const destinationItem: PdfStateItem =
                destinationCheckBox.itemAt(0);
            destinationItem._dictionary.update(
                'AS',
                _PdfName.get('BeforeUpdate')
            );
            // Act
            helper._createAppearance(
                destinationCheckBox,
                sourceRadio,
                sourceDictionary,
                destinationItem._dictionary,
                new _PdfDictionary(destinationDocument._crossReference)
            );
            // Assert
            expect(
                (destinationItem._dictionary.get('AS') as _PdfName).name
            ).toBe('Off');
            expect(destinationItem._enableGrouping).toBe(true);
        });
        it('1041642 applies rotation and creates list-field appearance when grouping is allowed', () => {
            // Arrange
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfComboBoxField = new PdfComboBoxField(
                sourcePage,
                'SourceList',
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 20
                }
            );
            const destinationField: PdfComboBoxField = new PdfComboBoxField(
                destinationPage,
                'DestinationList',
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 20
                }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const sourceItem: PdfListFieldItem = sourceField.itemAt(0);
            const destinationItem: PdfListFieldItem =
                destinationField.itemAt(0);
            sourceItem.rotationAngle = PdfRotationAngle.angle90;
            destinationItem.rotationAngle = PdfRotationAngle.angle0;
            // Act
            helper._createAppearance(
                destinationField,
                sourceField,
                sourceItem._dictionary,
                destinationItem._dictionary,
                new _PdfDictionary(destinationDocument._crossReference),
                sourceItem
            );
            // Assert
            expect((destinationItem as any).rotationAngle).toBe(
                PdfRotationAngle.angle90
            );
            expect(destinationItem._enableGrouping).toBe(true);
            expect(destinationItem._dictionary.has('AP')).toBe(true);
            expect(destinationItem._dictionary._updated).toBe(true);
        });
        it('1041642 does not create list appearance when field flag prevents grouping', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfComboBoxField = new PdfComboBoxField(
                sourcePage,
                'FlaggedSourceList',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfComboBoxField = new PdfComboBoxField(
                destinationPage,
                'FlaggedDestinationList',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const sourceItem: PdfListFieldItem = sourceField.itemAt(0);
            const destinationItem: PdfListFieldItem =
                destinationField.itemAt(0);
            destinationItem._dictionary.update('Ff', 1);
            const originalCheckFieldFlag:
                (dictionary: _PdfDictionary) => boolean =
                destinationField._checkFieldFlag;
            destinationField._checkFieldFlag =
                (_dictionary: _PdfDictionary): boolean => true;
            helper._createAppearance(
                destinationField,
                sourceField,
                sourceItem._dictionary,
                destinationItem._dictionary,
                new _PdfDictionary(destinationDocument._crossReference),
                sourceItem
            );
            destinationField._checkFieldFlag = originalCheckFieldFlag;
            expect(destinationItem._enableGrouping).not.toBe(true);
            expect(destinationItem._dictionary.has('AP')).toBe(false);
        });
        it('1041642 does not apply widget rotation when widget is undefined', () => {
            // Arrange
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfComboBoxField = new PdfComboBoxField(
                sourcePage,
                'NoWidgetSourceList',
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 20
                }
            );
            const destinationField: PdfComboBoxField = new PdfComboBoxField(
                destinationPage,
                'NoWidgetDestinationList',
                {
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 20
                }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const sourceItem: PdfListFieldItem = sourceField.itemAt(0);
            const destinationItem: PdfListFieldItem =
                destinationField.itemAt(0);
            destinationItem.rotationAngle = PdfRotationAngle.angle180;
            // Act
            helper._createAppearance(
                destinationField,
                sourceField,
                sourceItem._dictionary,
                destinationItem._dictionary,
                new _PdfDictionary(destinationDocument._crossReference)
            );
            // Assert
            expect(destinationItem.rotationAngle).toBe(
                PdfRotationAngle.angle180
            );
        });
    });
    describe('1041642 _formFieldsGroupingSupport output', () => {
        it('1041642 groups matching fields and writes resulting page annotations', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfTextBoxField = new PdfTextBoxField(
                sourcePage,
                'GroupedField',
                { x: 10, y: 10, width: 100, height: 20 }
            );
            const destinationField: PdfTextBoxField = new PdfTextBoxField(
                destinationPage,
                'GroupedField',
                { x: 20, y: 20, width: 100, height: 20 }
            );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const sourceKids: _PdfReference[] =
                sourceField._dictionary.getRaw('Kids') as _PdfReference[];
            sourcePage._pageDictionary.update('Annots', sourceKids);
            destinationPage._pageDictionary.update(
                'Annots',
                destinationField._dictionary.getRaw('Kids')
            );
            helper._formFieldsGroupingSupport(
                sourceDocument.form,
                sourcePage,
                destinationPage
            );
            const annotations: _PdfReference[] =
                destinationPage._pageDictionary.getRaw('Annots');
            expect(annotations.length).toBeGreaterThan(1);
            expect(destinationField._dictionary._updated).toBe(true);
        });
        it('1041642 does not group a signature field into a non-signature field', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceSignature: PdfSignatureField =
                new PdfSignatureField(
                    sourcePage,
                    'SameName',
                    { x: 10, y: 10, width: 100, height: 30 }
                );
            const destinationText: PdfTextBoxField =
                new PdfTextBoxField(
                    destinationPage,
                    'SameName',
                    { x: 20, y: 20, width: 100, height: 20 }
                );
            sourceDocument.form.add(sourceSignature);
            destinationDocument.form.add(destinationText);
            const destinationKids: _PdfReference[] =
                destinationText._dictionary.getRaw('Kids') as _PdfReference[];
            const originalCount: number = destinationKids.length;
            sourcePage._pageDictionary.update(
                'Annots',
                sourceSignature._dictionary.getRaw('Kids')
            );
            destinationPage._pageDictionary.update(
                'Annots',
                destinationKids
            );
            helper._formFieldsGroupingSupport(
                sourceDocument.form,
                sourcePage,
                destinationPage
            );
            expect(
                (destinationText._dictionary.getRaw('Kids') as _PdfReference[])
                    .length
            ).toBe(originalCount);
        });
        it('1041642 groups two signature fields having the same name', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceSignature: PdfSignatureField =
                new PdfSignatureField(
                    sourcePage,
                    'MatchingSignature',
                    { x: 10, y: 10, width: 100, height: 30 }
                );
            const destinationSignature: PdfSignatureField =
                new PdfSignatureField(
                    destinationPage,
                    'MatchingSignature',
                    { x: 20, y: 20, width: 100, height: 30 }
                );
            sourceDocument.form.add(sourceSignature);
            destinationDocument.form.add(destinationSignature);
            sourcePage._pageDictionary.update(
                'Annots',
                sourceSignature._dictionary.getRaw('Kids')
            );
            destinationPage._pageDictionary.update(
                'Annots',
                destinationSignature._dictionary.getRaw('Kids')
            );
            helper._formFieldsGroupingSupport(
                sourceDocument.form,
                sourcePage,
                destinationPage
            );
            expect(
                (destinationSignature._dictionary.getRaw('Kids') as
                    _PdfReference[]).length
            ).toBeGreaterThan(1);
        });
        it('1041642 groups source widgets and updates destination annotations', () => {
            // Arrange
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceField: PdfRadioButtonListField =
                new PdfRadioButtonListField(
                    sourcePage,
                    'PageSpecificField',
                    {
                        items: [
                            {
                                name: 'FirstItem',
                                bounds: {
                                    x: 10,
                                    y: 10,
                                    width: 20,
                                    height: 20
                                }
                            },
                            {
                                name: 'SecondItem',
                                bounds: {
                                    x: 10,
                                    y: 40,
                                    width: 20,
                                    height: 20
                                }
                            }
                        ]
                    }
                );
            const destinationField: PdfRadioButtonListField =
                new PdfRadioButtonListField(
                    destinationPage,
                    'PageSpecificField',
                    {
                        items: [
                            {
                                name: 'DestinationItem',
                                bounds: {
                                    x: 20,
                                    y: 20,
                                    width: 20,
                                    height: 20
                                }
                            }
                        ]
                    }
                );
            sourceDocument.form.add(sourceField);
            destinationDocument.form.add(destinationField);
            const sourceKids: _PdfReference[] =
                sourceField._dictionary.getRaw('Kids') as _PdfReference[];
            const destinationKids: _PdfReference[] =
                destinationField._dictionary.getRaw('Kids') as _PdfReference[];
            const originalDestinationKidsCount: number =
                destinationKids.length;
            const originalAnnotationCount: number =
                destinationKids.length;
            sourcePage._pageDictionary.update(
                'Annots',
                sourceKids.slice()
            );
            /*
             * Keep Annots and Kids as separate arrays. The implementation pushes
             * each imported reference into both collections.
             */
            destinationPage._pageDictionary.update(
                'Annots',
                destinationKids.slice()
            );
            // Act
            helper._formFieldsGroupingSupport(
                sourceDocument.form,
                sourcePage,
                destinationPage
            );
            // Assert
            const updatedKids: _PdfReference[] =
                destinationField._dictionary.getRaw('Kids') as _PdfReference[];
            const updatedAnnotations: _PdfReference[] =
                destinationPage._pageDictionary.getRaw(
                    'Annots'
                ) as _PdfReference[];
            expect(sourceKids.length).toBe(2);
            expect(updatedKids.length).toBe(
                originalDestinationKidsCount + sourceKids.length
            );
            expect(updatedAnnotations.length).toBe(
                originalAnnotationCount + sourceKids.length
            );
            expect(updatedKids.length).toBe(3);
            expect(updatedAnnotations.length).toBe(3);
            expect(destinationField._page).toBe(destinationPage);
            expect(destinationField._dictionary._updated).toBe(true);
        });
        it('1041642 leaves page annotations unchanged when no field output is produced', () => {
            const sourcePage: PdfPage = sourceDocument.addPage();
            const destinationPage: PdfPage = destinationDocument.addPage();
            const sourceSignature: PdfSignatureField =
                new PdfSignatureField(
                    sourcePage,
                    'NonMatchingSignature',
                    { x: 10, y: 10, width: 100, height: 30 }
                );
            const destinationText: PdfTextBoxField =
                new PdfTextBoxField(
                    destinationPage,
                    'NonMatchingSignature',
                    { x: 20, y: 20, width: 100, height: 20 }
                );
            sourceDocument.form.add(sourceSignature);
            destinationDocument.form.add(destinationText);
            const existingAnnotations: _PdfReference[] =
                destinationText._dictionary.getRaw('Kids');
            destinationPage._pageDictionary.update(
                'Annots',
                existingAnnotations
            );
            helper._formFieldsGroupingSupport(
                sourceDocument.form,
                sourcePage,
                destinationPage
            );
            expect(
                destinationPage._pageDictionary.getRaw('Annots')
            ).toBe(existingAnnotations);
        });
    });
});