import { PdfAnnotation, PdfRadioButtonListItem, PdfRectangleAnnotation, PdfStateItem, PdfWidgetAnnotation } from "../../src/pdf/core/annotations/annotation";
import { _PdfBaseStream } from "../../src/pdf/core/base-stream";
import { _PdfCheckFieldState } from "../../src/pdf/core/enumerator";
import { PdfButtonField, PdfCheckBoxField, PdfField, PdfRadioButtonListField } from "../../src/pdf/core/form/field";
import { PdfForm } from "../../src/pdf/core/form/form";
import { PdfTemplate } from "../../src/pdf/core/graphics/pdf-template";
import { PdfDocument } from "../../src/pdf/core/pdf-document";
import { PdfPage } from "../../src/pdf/core/pdf-page";
import { _PdfDictionary, _PdfName, _PdfReference } from "../../src/pdf/core/pdf-primitives";
function createCheckBoxHarness(): {
    document: PdfDocument;
    page: PdfPage;
    field: PdfCheckBoxField;
    item: PdfStateItem;
} {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const field: PdfCheckBoxField = new PdfCheckBoxField(
        'checkBox', { x: 20, y: 20, width: 20, height: 10 }, page
    );
    document.form.add(field);
    const item: PdfStateItem = field.itemAt(0);
    return { document, page, field, item };
}
function setStateAppearance(
    item: PdfStateItem | PdfField,
    stateName: string,
    stream: _PdfBaseStream,
    reference?: _PdfReference
): _PdfDictionary {
    const normalAppearance: _PdfDictionary = new _PdfDictionary(item._crossReference);
    if (reference) {
        normalAppearance.set(stateName, reference);
        item._crossReference._cacheMap.set(reference, stream);
    } else {
        normalAppearance.set(stateName, stream);
    }
    const appearance: _PdfDictionary = new _PdfDictionary();
    appearance.set('N', normalAppearance);
    item._dictionary.update('AP', appearance);
    return normalAppearance;
}
function createStateTemplateHarness(
    matrix: number[],
    bounds: number[]
): {
    document: PdfDocument;
    field: PdfCheckBoxField;
    item: PdfStateItem;
    stream: _PdfBaseStream;
    reference: _PdfReference;
} {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const field: PdfCheckBoxField = new PdfCheckBoxField(
        'checkbox',
        { x: 10, y: 10, width: 20, height: 20 },
        page
    );
    document.form.add(field);
    const item: PdfStateItem = field.itemAt(0);
    const appearanceTemplate: PdfTemplate = new PdfTemplate(
        [0, 0, 20, 20],
        field._crossReference
    );
    const stream: _PdfBaseStream =
        appearanceTemplate._content as _PdfBaseStream;
    const reference: _PdfReference =
        field._crossReference._getNextReference();
    const normalAppearance: _PdfDictionary =
        new _PdfDictionary(field._crossReference);
    const appearanceDictionary: _PdfDictionary =
        new _PdfDictionary(field._crossReference);
    if (typeof matrix !== 'undefined') {
        stream.dictionary.update('Matrix', matrix);
    }
    if (typeof bounds !== 'undefined') {
        stream.dictionary.update('BBox', bounds);
    }
    field._crossReference._cacheMap.set(reference, stream);
    normalAppearance.update('Off', reference);
    appearanceDictionary.update('N', normalAppearance);
    item._dictionary.update('AP', appearanceDictionary);
    return {
        document,
        field,
        item,
        stream,
        reference
    };
}
function createRadioAppearanceContext(): {
    document: PdfDocument;
    field: PdfRadioButtonListField;
    item: PdfRadioButtonListItem;
    normalAppearance: _PdfDictionary;
    stream: _PdfBaseStream;
    reference: _PdfReference;
    streamDictionary: _PdfDictionary;
} {
    let document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'RadioAppearance');
    field.add('First', { x: 10, y: 10, width: 20, height: 20 });
    field.selectedIndex = 0;
    field.setAppearance(true);
    document.form.add(field);
    const data: Uint8Array = document.save();
    document.destroy();
    document = new PdfDocument(data);
    const loadedField: PdfRadioButtonListField = document.form.fieldAt(0) as PdfRadioButtonListField;
    const item: PdfRadioButtonListItem = loadedField.itemAt(0);
    const appearanceDictionary: _PdfDictionary = item._dictionary.get('AP');
    const normalAppearance: _PdfDictionary = appearanceDictionary.get('N');
    const stream: _PdfBaseStream = normalAppearance.get('First');
    const reference: _PdfReference = normalAppearance.getRaw('First');
    return {
        document,
        field: loadedField,
        item,
        normalAppearance,
        stream,
        reference,
        streamDictionary: stream.dictionary
    };
}
function createLoadedRadioField(): {
    document: PdfDocument;
    field: PdfRadioButtonListField;
    item: PdfRadioButtonListItem;
    normalAppearance: _PdfDictionary;
} {
    let document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'RadioAppearance');
    field.add('First', { x: 10, y: 10, width: 20, height: 20 });
    field.selectedIndex = 0;
    field.setAppearance(true);
    document.form.add(field);
    const data: Uint8Array = document.save();
    document.destroy();
    document = new PdfDocument(data);
    const loadedField: PdfRadioButtonListField = document.form.fieldAt(0) as PdfRadioButtonListField;
    const loadedItem: PdfRadioButtonListItem = loadedField.itemAt(0);
    const appearanceDictionary: _PdfDictionary = loadedItem._dictionary.get('AP');
    const normalAppearance: _PdfDictionary = appearanceDictionary.get('N');
    return { document, field: loadedField, item: loadedItem, normalAppearance };
}
function createBoundsBranchContext(): {
    document: PdfDocument;
    field: PdfRadioButtonListField;
    item: PdfRadioButtonListItem;
    normalAppearance: _PdfDictionary;
    stream: _PdfBaseStream;
    reference: _PdfReference;
    streamDictionary: _PdfDictionary;
} {
    let document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'BoundsBranchRadio');
    field.add('First', { x: 10, y: 10, width: 20, height: 20 });
    field.selectedIndex = 0;
    field.setAppearance(true);
    document.form.add(field);
    const data: Uint8Array = document.save();
    document.destroy();
    document = new PdfDocument(data);
    const loadedField: PdfRadioButtonListField = document.form.fieldAt(0) as PdfRadioButtonListField;
    const item: PdfRadioButtonListItem = loadedField.itemAt(0);
    const appearanceDictionary: _PdfDictionary = item._dictionary.get('AP');
    const normalAppearance: _PdfDictionary = appearanceDictionary.get('N');
    const stream: _PdfBaseStream = normalAppearance.get('First');
    const reference: _PdfReference = normalAppearance.getRaw('First');
    return {
        document,
        field: loadedField,
        item,
        normalAppearance,
        stream,
        reference,
        streamDictionary: stream.dictionary
    };
}
type StateTemplateField = PdfField & {
    _getStateTemplate: (state: _PdfCheckFieldState, item: PdfStateItem | PdfField) => PdfTemplate;
    _getCheckboxFieldTemplates: () => PdfTemplate[];
    _defaultIndex: number;
};
type StreamWithDictionary = _PdfBaseStream & {
    dictionary: _PdfDictionary;
    reference: _PdfReference;
    offset: number;
};
describe('PdfField template survived mutation coverage', () => {
    it('should create templates for all grouped button field items', () => {
        // Arrange
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const form: PdfForm = document.form;
        const firstField: PdfButtonField = new PdfButtonField(
            page,
            'GroupedButton',
            { x: 10, y: 10, width: 100, height: 30 }
        );
        firstField.text = 'First';
        firstField.setAppearance(true);
        form.add(firstField);
        const secondField: PdfButtonField = new PdfButtonField(
            page,
            'GroupedButton',
            { x: 10, y: 50, width: 100, height: 30 }
        );
        secondField.text = 'Second';
        secondField.setAppearance(true);
        form.add(secondField);
        const savedData: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(savedData);
        const loadedField: PdfButtonField =
            document.form.fieldAt(0) as PdfButtonField;
        // Act
        const templates: PdfTemplate[] =
            loadedField._getFieldsTemplate();
        // Assert
        expect(loadedField._kidsCount).toBe(2);
        expect(loadedField.itemAt(0)).toBeDefined();
        expect(loadedField.itemAt(1)).toBeDefined();
        expect(templates.length).toBe(2);
        expect(templates[0]).toBeDefined();
        expect(templates[1]).toBeDefined();
        expect(templates[0] instanceof PdfTemplate).toBeTruthy();
        expect(templates[1] instanceof PdfTemplate).toBeTruthy();
        document.destroy();
    });
    it('should create a field template from the field dictionary when no child item exists', () => {
        // Arrange
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfButtonField = new PdfButtonField(
            page,
            'SingleButton',
            { x: 10, y: 10, width: 100, height: 30 }
        );
        field.text = 'Single';
        field.setAppearance(true);
        document.form.add(field);
        const savedData: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(savedData);
        const loadedField: PdfButtonField =
            document.form.fieldAt(0) as PdfButtonField;
        const widget: PdfWidgetAnnotation = loadedField.itemAt(0);
        const originalKids: _PdfReference[] = loadedField._kids;
        const originalItems: Map<number, PdfWidgetAnnotation> =
            loadedField._parsedItems;
        const originalDictionary: _PdfDictionary = loadedField._dictionary;
        loadedField._dictionary = widget._dictionary;
        loadedField._kids = [];
        loadedField._parsedItems = new Map<number, PdfWidgetAnnotation>();
        // Act
        const templates: PdfTemplate[] =
            loadedField._getFieldsTemplate();
        // Assert
        expect(loadedField._kidsCount).toBe(0);
        expect(loadedField._dictionary).toBe(widget._dictionary);
        expect(loadedField._dictionary.has('AP')).toBeTruthy();
        expect(templates.length).toBe(1);
        expect(templates[0]).toBeDefined();
        expect(templates[0] instanceof PdfTemplate).toBeTruthy();
        loadedField._dictionary = originalDictionary;
        loadedField._kids = originalKids;
        loadedField._parsedItems = originalItems;
        document.destroy();
    });
    it('should return no field template when the widget and field dictionary are unavailable', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfButtonField = new PdfButtonField(
            page,
            'UnavailableButton',
            { x: 10, y: 10, width: 100, height: 30 }
        );
        document.form.add(field);
        const originalKids: _PdfReference[] = field._kids;
        const originalItems:
            Map<number, PdfWidgetAnnotation> = field._parsedItems;
        const originalDictionary: _PdfDictionary = field._dictionary;
        field._kids = [];
        field._parsedItems = new Map<number, PdfWidgetAnnotation>();
        field._dictionary = undefined;
        // Act
        const templates: PdfTemplate[] =
            field._getFieldsTemplate();
        // Assert
        expect(field._kidsCount).toBe(0);
        expect(field._dictionary).toBeUndefined();
        expect(templates.length).toBe(0);
        expect(templates).toEqual([]);
        field._dictionary = originalDictionary;
        field._kids = originalKids;
        field._parsedItems = originalItems;
        document.destroy();
    });
    it('should create templates only for valid grouped checkbox state items', () => {
        // Arrange
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const form: PdfForm = document.form;
        const firstField: PdfCheckBoxField = new PdfCheckBoxField(
            'GroupedCheckBox',
            { x: 10, y: 10, width: 20, height: 20 },
            page
        );
        firstField.exportValue = 'First';
        firstField.checked = true;
        firstField.setAppearance(true);
        form.add(firstField);
        const secondField: PdfCheckBoxField = new PdfCheckBoxField(
            'GroupedCheckBox',
            { x: 40, y: 10, width: 20, height: 20 },
            page
        );
        secondField.exportValue = 'Second';
        secondField.checked = false;
        secondField.setAppearance(true);
        form.add(secondField);
        const savedData: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(savedData);
        const loadedField: PdfCheckBoxField =
            document.form.fieldAt(0) as PdfCheckBoxField;
        const firstItem: PdfWidgetAnnotation = loadedField.itemAt(0);
        const secondItem: PdfWidgetAnnotation = loadedField.itemAt(1);
        // Act
        const templates: PdfTemplate[] =
            loadedField._getCheckboxFieldTemplates();
        // Assert
        expect(loadedField._kidsCount).toBe(2);
        expect(firstItem).toBeDefined();
        expect(secondItem).toBeDefined();
        expect(firstItem instanceof PdfStateItem).toBeTruthy();
        expect(secondItem instanceof PdfStateItem).toBeTruthy();
        expect(loadedField._checkFieldFlag(firstItem._dictionary)).toBeFalsy();
        expect(loadedField._checkFieldFlag(secondItem._dictionary)).toBeFalsy();
        expect(templates.length).toBe(2);
        expect(templates[0]).toBeDefined();
        expect(templates[1]).toBeDefined();
        expect(templates[0] instanceof PdfTemplate).toBeTruthy();
        expect(templates[1] instanceof PdfTemplate).toBeTruthy();
        document.destroy();
    });
    it('should skip a grouped checkbox state item having print and no-view flags', () => {
        // Arrange
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const form: PdfForm = document.form;
        const firstField: PdfCheckBoxField = new PdfCheckBoxField(
            'FlaggedCheckBox',
            { x: 10, y: 10, width: 20, height: 20 },
            page
        );
        firstField.exportValue = 'First';
        firstField.checked = true;
        firstField.setAppearance(true);
        form.add(firstField);
        const secondField: PdfCheckBoxField = new PdfCheckBoxField(
            'FlaggedCheckBox',
            { x: 40, y: 10, width: 20, height: 20 },
            page
        );
        secondField.exportValue = 'Second';
        secondField.checked = false;
        secondField.setAppearance(true);
        form.add(secondField);
        const savedData: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(savedData);
        const loadedField: PdfCheckBoxField =
            document.form.fieldAt(0) as PdfCheckBoxField;
        const firstItem: PdfWidgetAnnotation = loadedField.itemAt(0);
        const secondItem: PdfWidgetAnnotation = loadedField.itemAt(1);
        const originalFlag: number = secondItem._dictionary.get('F');
        secondItem._dictionary.update('F', 6);
        // Act
        const templates: PdfTemplate[] =
            loadedField._getCheckboxFieldTemplates();
        // Assert
        expect(loadedField._kidsCount).toBe(2);
        expect(firstItem instanceof PdfStateItem).toBeTruthy();
        expect(secondItem instanceof PdfStateItem).toBeTruthy();
        expect(loadedField._checkFieldFlag(firstItem._dictionary)).toBeFalsy();
        expect(loadedField._checkFieldFlag(secondItem._dictionary)).toBeTruthy();
        expect(templates.length).toBe(1);
        expect(templates[0]).toBeDefined();
        expect(templates[0] instanceof PdfTemplate).toBeTruthy();
        secondItem._dictionary.update('F', originalFlag);
        document.destroy();
    });
    it('should not add a checkbox template when the appearance dictionary is unavailable', () => {
        // Arrange
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfCheckBoxField = new PdfCheckBoxField(
            'CheckBoxWithoutAppearance',
            { x: 10, y: 10, width: 20, height: 20 },
            page
        );
        field.checked = true;
        field.setAppearance(true);
        document.form.add(field);
        const savedData: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(savedData);
        const loadedField: PdfCheckBoxField =
            document.form.fieldAt(0) as PdfCheckBoxField;
        const item: PdfWidgetAnnotation = loadedField.itemAt(0);
        const appearanceDictionary: _PdfDictionary =
            item._dictionary.get('AP');
        delete item._dictionary._map.AP;
        // Act
        const templates: PdfTemplate[] =
            loadedField._getCheckboxFieldTemplates();
        // Assert
        expect(loadedField._kidsCount).toBe(1);
        expect(item instanceof PdfStateItem).toBeTruthy();
        expect(item._dictionary.has('AP')).toBeFalsy();
        expect(loadedField._checkFieldFlag(item._dictionary)).toBeFalsy();
        expect(templates.length).toBe(0);
        expect(templates).toEqual([]);
        item._dictionary.update('AP', appearanceDictionary);
        document.destroy();
    });
});
describe('PdfField _getFieldsTemplate survived mutation coverage', () => {
    it('should create templates for every grouped button field item', () => {
        // Arrange
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const form: PdfForm = document.form;
        const firstField: PdfButtonField = new PdfButtonField(
            page,
            'GroupedButtonTemplate',
            { x: 10, y: 10, width: 100, height: 30 }
        );
        firstField.text = 'First';
        firstField.setAppearance(true);
        form.add(firstField);
        const secondField: PdfButtonField = new PdfButtonField(
            page,
            'GroupedButtonTemplate',
            { x: 10, y: 50, width: 100, height: 30 }
        );
        secondField.text = 'Second';
        secondField.setAppearance(true);
        form.add(secondField);
        const savedData: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(savedData);
        const loadedField: PdfButtonField =
            document.form.fieldAt(0) as PdfButtonField;
        const originalItemAt:
            (index: number) => PdfWidgetAnnotation = loadedField.itemAt;
        const accessedIndexes: number[] = [];
        loadedField.itemAt = (index: number): PdfWidgetAnnotation => {
            accessedIndexes.push(index);
            return originalItemAt.call(loadedField, index);
        };
        // Act
        const templates: PdfTemplate[] =
            loadedField._getFieldsTemplate();
        // Assert
        expect(loadedField._kidsCount).toBe(2);
        expect(accessedIndexes).toEqual([0, 1]);
        expect(templates.length).toBe(2);
        expect(templates[0]).toBeDefined();
        expect(templates[1]).toBeDefined();
        expect(templates[0] instanceof PdfTemplate).toBeTruthy();
        expect(templates[1] instanceof PdfTemplate).toBeTruthy();
        loadedField.itemAt = originalItemAt;
        document.destroy();
    });
    it('should skip an unavailable grouped button field item', () => {
        // Arrange
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const form: PdfForm = document.form;
        const firstField: PdfButtonField = new PdfButtonField(
            page,
            'GroupedButtonUnavailableItem',
            { x: 10, y: 10, width: 100, height: 30 }
        );
        firstField.text = 'First';
        firstField.setAppearance(true);
        form.add(firstField);
        const secondField: PdfButtonField = new PdfButtonField(
            page,
            'GroupedButtonUnavailableItem',
            { x: 10, y: 50, width: 100, height: 30 }
        );
        secondField.text = 'Second';
        secondField.setAppearance(true);
        form.add(secondField);
        const savedData: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(savedData);
        const loadedField: PdfButtonField =
            document.form.fieldAt(0) as PdfButtonField;
        const firstItem: PdfWidgetAnnotation = loadedField.itemAt(0);
        const originalItemAt:
            (index: number) => PdfWidgetAnnotation = loadedField.itemAt;
        loadedField.itemAt = (index: number): PdfWidgetAnnotation => {
            return index === 0 ? firstItem : undefined;
        };
        // Act
        const templates: PdfTemplate[] =
            loadedField._getFieldsTemplate();
        // Assert
        expect(loadedField._kidsCount).toBe(2);
        expect(firstItem).toBeDefined();
        expect(templates.length).toBe(1);
        expect(templates[0]).toBeDefined();
        expect(templates[0] instanceof PdfTemplate).toBeTruthy();
        loadedField.itemAt = originalItemAt;
        document.destroy();
    });
    it('should create a template from the widget dictionary when child items are unavailable', () => {
        // Arrange
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfButtonField = new PdfButtonField(
            page,
            'ButtonDictionaryTemplate',
            { x: 10, y: 10, width: 100, height: 30 }
        );
        field.text = 'Dictionary';
        field.setAppearance(true);
        document.form.add(field);
        const savedData: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(savedData);
        const loadedField: PdfButtonField =
            document.form.fieldAt(0) as PdfButtonField;
        const widget: PdfWidgetAnnotation = loadedField.itemAt(0);
        const originalKids: _PdfReference[] = loadedField._kids;
        const originalItems: Map<number, PdfWidgetAnnotation> =
            loadedField._parsedItems;
        const originalDictionary: _PdfDictionary =
            loadedField._dictionary;
        loadedField._dictionary = widget._dictionary;
        loadedField._kids = [];
        loadedField._parsedItems =
            new Map<number, PdfWidgetAnnotation>();
        // Act
        const templates: PdfTemplate[] =
            loadedField._getFieldsTemplate();
        // Assert
        expect(loadedField._kidsCount).toBe(0);
        expect(loadedField.itemAt(0)).toBeUndefined();
        expect(loadedField._dictionary).toBe(widget._dictionary);
        expect(loadedField._dictionary.has('AP')).toBeTruthy();
        expect(templates.length).toBe(1);
        expect(templates[0]).toBeDefined();
        expect(templates[0] instanceof PdfTemplate).toBeTruthy();
        loadedField._dictionary = originalDictionary;
        loadedField._kids = originalKids;
        loadedField._parsedItems = originalItems;
        document.destroy();
    });
    it('should use the available default item without loading the field dictionary', () => {
        // Arrange
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfButtonField = new PdfButtonField(
            page,
            'AvailableDefaultItem',
            { x: 10, y: 10, width: 100, height: 30 }
        );
        field.text = 'Default';
        field.setAppearance(true);
        document.form.add(field);
        const savedData: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(savedData);
        const loadedField: PdfButtonField =
            document.form.fieldAt(0) as PdfButtonField;
        const defaultItem: PdfWidgetAnnotation =
            loadedField.itemAt(0);
        const originalKids: _PdfReference[] = loadedField._kids;
        const originalItemAt:
            (index: number) => PdfWidgetAnnotation = loadedField.itemAt;
        const originalDictionary: _PdfDictionary =
            loadedField._dictionary;
        let itemAtCallCount: number = 0;
        loadedField._kids = [];
        loadedField.itemAt =
            (_index: number): PdfWidgetAnnotation => {
                itemAtCallCount++;
                return defaultItem;
            };
        // Act
        const templates: PdfTemplate[] =
            loadedField._getFieldsTemplate();
        // Assert
        expect(loadedField._kidsCount).toBe(0);
        expect(itemAtCallCount).toBe(1);
        expect(defaultItem).toBeDefined();
        expect(loadedField._dictionary).toBe(originalDictionary);
        expect(templates.length).toBe(1);
        expect(templates[0]).toBeDefined();
        expect(templates[0] instanceof PdfTemplate).toBeTruthy();
        loadedField.itemAt = originalItemAt;
        loadedField._kids = originalKids;
        document.destroy();
    });
});
describe('PdfField radio template survived mutation coverage', () => {
    it('should use the no-item radio field branch when the kids count is zero', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'EmptyRadio');
        document.form.add(field);
        const expectedTemplate: PdfTemplate = new PdfTemplate();
        const originalGetStateTemplate: typeof field._getStateTemplate = field._getStateTemplate;
        let receivedState: _PdfCheckFieldState;
        field._getStateTemplate = (
            state: _PdfCheckFieldState,
            _item: PdfRadioButtonListField
        ): PdfTemplate => {
            receivedState = state;
            return expectedTemplate;
        };
        // Act
        const templates: PdfTemplate[] = field._getPdfRadioButtonListFieldTemplates();
        // Assert
        expect(field._kidsCount).toBe(0);
        expect(field.selectedIndex).toBe(-1);
        expect(receivedState).toBe(_PdfCheckFieldState.unchecked);
        expect(templates.length).toBe(1);
        expect(templates[0]).toBe(expectedTemplate);
        field._getStateTemplate = originalGetStateTemplate;
        document.destroy();
    });
    it('should not process child items when the receiver is not a radio button list field', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfButtonField = new PdfButtonField(
            page,
            'ButtonReceiver',
            { x: 10, y: 10, width: 100, height: 30 }
        );
        document.form.add(field);
        const originalItemAt: typeof field.itemAt = field.itemAt;
        let itemAtCallCount: number = 0;
        field.itemAt = (index: number): PdfWidgetAnnotation => {
            itemAtCallCount++;
            return originalItemAt.call(field, index);
        };
        // Act
        const templates: PdfTemplate[] = field._getPdfRadioButtonListFieldTemplates();
        // Assert
        expect(field._kidsCount).toBe(1);
        expect(field instanceof PdfRadioButtonListField).toBeFalsy();
        expect(itemAtCallCount).toBe(0);
        expect(templates.length).toBe(0);
        expect(templates).toEqual([]);
        field.itemAt = originalItemAt;
        document.destroy();
    });
    it('should skip a defined child item that is not a radio button list item', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const buttonField: PdfButtonField = new PdfButtonField(
            page,
            'ButtonItem',
            { x: 10, y: 10, width: 100, height: 30 }
        );
        document.form.add(buttonField);
        const buttonItem: PdfWidgetAnnotation = buttonField.itemAt(0);
        const radioField: PdfRadioButtonListField =
            new PdfRadioButtonListField(page, 'RadioTarget');
        document.form.add(radioField);
        const originalKids: _PdfReference[] = radioField._kids;
        const originalItemAt: (index: number) => PdfRadioButtonListItem =
            radioField.itemAt;
        const originalGetStateTemplate: (
            state: _PdfCheckFieldState,
            item: PdfStateItem | PdfField
        ) => PdfTemplate = radioField._getStateTemplate;
        let stateTemplateCallCount: number = 0;
        radioField._kids = [buttonItem._ref];
        radioField.itemAt = (_index: number): PdfRadioButtonListItem => {
            return buttonItem as PdfRadioButtonListItem;
        };
        radioField._getStateTemplate = (
            _state: _PdfCheckFieldState,
            _item: PdfStateItem | PdfField
        ): PdfTemplate => {
            stateTemplateCallCount++;
            return new PdfTemplate();
        };
        // Act
        const templates: PdfTemplate[] =
            radioField._getPdfRadioButtonListFieldTemplates();
        // Assert
        expect(radioField._kidsCount).toBe(1);
        expect(buttonItem).toBeDefined();
        expect(buttonItem instanceof PdfRadioButtonListItem).toBeFalsy();
        expect(stateTemplateCallCount).toBe(0);
        expect(templates.length).toBe(0);
        expect(templates).toEqual([]);
        radioField._getStateTemplate = originalGetStateTemplate;
        radioField.itemAt = originalItemAt;
        radioField._kids = originalKids;
        document.destroy();
    });
    it('should not add an undefined template for a valid radio button list item', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'RadioWithoutTemplate');
        const item: PdfRadioButtonListItem = field.add(
            'First',
            { x: 10, y: 10, width: 20, height: 20 }
        );
        document.form.add(field);
        const originalGetStateTemplate: typeof field._getStateTemplate = field._getStateTemplate;
        field._getStateTemplate = (
            _state: _PdfCheckFieldState,
            _item: PdfRadioButtonListItem
        ): PdfTemplate => undefined;
        // Act
        const templates: PdfTemplate[] = field._getPdfRadioButtonListFieldTemplates();
        // Assert
        expect(field._kidsCount).toBe(1);
        expect(item instanceof PdfRadioButtonListItem).toBeTruthy();
        expect(field._checkFieldFlag(item._dictionary)).toBeFalsy();
        expect(templates.length).toBe(0);
        expect(templates).toEqual([]);
        field._getStateTemplate = originalGetStateTemplate;
        document.destroy();
    });
    it('should read AP only when the radio item dictionary contains AP', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'RadioWithoutAP');
        const item: PdfRadioButtonListItem = field.add(
            'First',
            { x: 10, y: 10, width: 20, height: 20 }
        );
        document.form.add(field);
        const dictionary: _PdfDictionary = item._dictionary;
        const originalGet: typeof dictionary.get = dictionary.get;
        let appearanceReadCount: number = 0;
        dictionary.get = (key: string): ReturnType<_PdfDictionary['get']> => {
            if (key === 'AP') {
                appearanceReadCount++;
            }
            return originalGet.call(dictionary, key);
        };
        // Act
        const template: PdfTemplate = field._getStateTemplate(_PdfCheckFieldState.checked, item);
        // Assert
        expect(dictionary.has('AP')).toBeFalsy();
        expect(appearanceReadCount).toBe(0);
        expect(template).toBeUndefined();
        dictionary.get = originalGet;
        document.destroy();
    });
    it('should not read the normal appearance when the AP dictionary has no N entry', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'RadioWithoutNormalAppearance');
        const item: PdfRadioButtonListItem = field.add(
            'First',
            { x: 10, y: 10, width: 20, height: 20 }
        );
        document.form.add(field);
        const appearanceDictionary: _PdfDictionary = new _PdfDictionary();
        const originalGet: typeof appearanceDictionary.get = appearanceDictionary.get;
        let normalAppearanceReadCount: number = 0;
        item._dictionary.update('AP', appearanceDictionary);
        appearanceDictionary.get = (key: string): ReturnType<_PdfDictionary['get']> => {
            if (key === 'N') {
                normalAppearanceReadCount++;
            }
            return originalGet.call(appearanceDictionary, key);
        };
        // Act
        const template: PdfTemplate = field._getStateTemplate(_PdfCheckFieldState.checked, item);
        // Assert
        expect(item._dictionary.has('AP')).toBeTruthy();
        expect(appearanceDictionary.has('N')).toBeFalsy();
        expect(normalAppearanceReadCount).toBe(0);
        expect(template).toBeUndefined();
        appearanceDictionary.get = originalGet;
        delete item._dictionary._map.AP;
        document.destroy();
    });
    it('should resolve a radio appearance stream into a template', () => {
        // Arrange
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'RadioAppearance');
        field.add('First', { x: 10, y: 10, width: 20, height: 20 });
        field.selectedIndex = 0;
        field.setAppearance(true);
        document.form.add(field);
        const savedData: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(savedData);
        const loadedField: PdfRadioButtonListField =
            document.form.fieldAt(0) as PdfRadioButtonListField;
        const loadedItem: PdfRadioButtonListItem = loadedField.itemAt(0) as PdfRadioButtonListItem;
        // Act
        const template: PdfTemplate = loadedField._getStateTemplate(
            _PdfCheckFieldState.checked,
            loadedItem
        );
        // Assert
        expect(loadedItem._dictionary.has('AP')).toBeTruthy();
        expect(loadedItem._dictionary.get('AP').has('N')).toBeTruthy();
        expect(template).toBeDefined();
        expect(template instanceof PdfTemplate).toBeTruthy();
        expect(template._isExported).toBeTruthy();
        document.destroy();
    });
});
describe('PdfField _getStateTemplate survived mutation coverage for lines 961 to 971', () => {
    it('should assign the raw reference to the checked appearance stream', () => {
        // Arrange
        const context: {
            document: PdfDocument;
            field: PdfRadioButtonListField;
            item: PdfRadioButtonListItem;
            normalAppearance: _PdfDictionary;
        } = createLoadedRadioField();
        const checkedStream: _PdfBaseStream =
            context.normalAppearance.get('First');
        const checkedReference: _PdfReference =
            context.normalAppearance.getRaw('First');
        const originalGet: typeof context.normalAppearance.get =
            context.normalAppearance.get;
        const originalGetRaw: typeof context.normalAppearance.getRaw =
            context.normalAppearance.getRaw;
        context.normalAppearance.get = (
            key: string
        ): ReturnType<_PdfDictionary['get']> => {
            if (key === 'First') {
                return checkedStream;
            }
            return originalGet.call(context.normalAppearance, key);
        };
        context.normalAppearance.getRaw = (
            key: string
        ): ReturnType<_PdfDictionary['getRaw']> => {
            if (key === 'First') {
                return checkedReference;
            }
            return originalGetRaw.call(context.normalAppearance, key);
        };
        checkedStream.reference = undefined;
        // Act
        const template: PdfTemplate =
            context.field._getStateTemplate(
                _PdfCheckFieldState.checked,
                context.item
            );
        // Assert
        expect(context.normalAppearance instanceof _PdfDictionary).toBeTruthy();
        expect(context.normalAppearance.has('First')).toBeTruthy();
        expect(checkedReference).toBeDefined();
        expect(checkedStream).toBeDefined();
        expect(checkedStream.dictionary instanceof _PdfDictionary).toBeTruthy();
        expect(checkedStream.reference).toBe(checkedReference);
        expect(template).toBeDefined();
        expect(template instanceof PdfTemplate).toBeTruthy();
        expect(template._isExported).toBeTruthy();
        context.normalAppearance.getRaw = originalGetRaw;
        context.normalAppearance.get = originalGet;
        context.document.destroy();
    });
    it('should create the checked template without assigning a missing raw reference', () => {
        // Arrange
        const context: {
            document: PdfDocument;
            field: PdfRadioButtonListField;
            item: PdfRadioButtonListItem;
            normalAppearance: _PdfDictionary;
        } = createLoadedRadioField();
        const checkedStream: _PdfBaseStream =
            context.normalAppearance.get('First');
        const originalGet: typeof context.normalAppearance.get =
            context.normalAppearance.get;
        const originalGetRaw: typeof context.normalAppearance.getRaw =
            context.normalAppearance.getRaw;
        context.normalAppearance.get = (
            key: string
        ): ReturnType<_PdfDictionary['get']> => {
            if (key === 'First') {
                return checkedStream;
            }
            return originalGet.call(context.normalAppearance, key);
        };
        context.normalAppearance.getRaw = (
            key: string
        ): ReturnType<_PdfDictionary['getRaw']> => {
            if (key === 'First') {
                return undefined;
            }
            return originalGetRaw.call(context.normalAppearance, key);
        };
        checkedStream.reference = undefined;
        // Act
        const template: PdfTemplate =
            context.field._getStateTemplate(
                _PdfCheckFieldState.checked,
                context.item
            );
        // Assert
        expect(context.normalAppearance.has('First')).toBeTruthy();
        expect(context.normalAppearance.getRaw('First')).toBeUndefined();
        expect(checkedStream.dictionary instanceof _PdfDictionary).toBeTruthy();
        expect(checkedStream.reference).toBeUndefined();
        expect(template).toBeDefined();
        expect(template instanceof PdfTemplate).toBeTruthy();
        expect(template._isExported).toBeTruthy();
        context.normalAppearance.getRaw = originalGetRaw;
        context.normalAppearance.get = originalGet;
        context.document.destroy();
    });
    it('should return undefined when the normal appearance is not a dictionary', () => {
        // Arrange
        const context: {
            document: PdfDocument;
            field: PdfRadioButtonListField;
            item: PdfRadioButtonListItem;
            normalAppearance: _PdfDictionary;
        } = createLoadedRadioField();
        const appearanceDictionary: _PdfDictionary =
            context.item._dictionary.get('AP');
        const originalGet: typeof appearanceDictionary.get =
            appearanceDictionary.get;
        const invalidAppearance: _PdfName =
            _PdfName.get('InvalidAppearance');
        appearanceDictionary.get = (
            key: string
        ): ReturnType<_PdfDictionary['get']> => {
            if (key === 'N') {
                return invalidAppearance;
            }
            return originalGet.call(appearanceDictionary, key);
        };
        // Act
        const template: PdfTemplate =
            context.field._getStateTemplate(
                _PdfCheckFieldState.checked,
                context.item
            );
        // Assert
        expect(context.item._dictionary.has('AP')).toBeTruthy();
        expect(appearanceDictionary.has('N')).toBeTruthy();
        expect(appearanceDictionary.get('N')).toBe(invalidAppearance);
        expect(
            appearanceDictionary.get('N') instanceof _PdfDictionary
        ).toBeFalsy();
        expect(template).toBeUndefined();
        appearanceDictionary.get = originalGet;
        context.document.destroy();
    });
    it('should return undefined when the checked appearance value is unavailable', () => {
        // Arrange
        const context: {
            document: PdfDocument;
            field: PdfRadioButtonListField;
            item: PdfRadioButtonListItem;
            normalAppearance: _PdfDictionary;
        } = createLoadedRadioField();
        const checkedAppearance: _PdfBaseStream = context.normalAppearance.get('First');
        const checkedReference: _PdfReference = context.normalAppearance.getRaw('First');
        delete context.normalAppearance._map.First;
        // Act
        const template: PdfTemplate = context.field._getStateTemplate(
            _PdfCheckFieldState.checked,
            context.item
        );
        // Assert
        expect(context.normalAppearance.has('First')).toBeFalsy();
        expect(template).toBeUndefined();
        context.normalAppearance.update('First', checkedReference ? checkedReference : checkedAppearance);
        context.document.destroy();
    });
    it('should return undefined when the selected appearance stream has no stream dictionary', () => {
        // Arrange
        const context: {
            document: PdfDocument;
            field: PdfRadioButtonListField;
            item: PdfRadioButtonListItem;
            normalAppearance: _PdfDictionary;
        } = createLoadedRadioField();
        const checkedAppearance: _PdfBaseStream = context.normalAppearance.get('First');
        const checkedReference: _PdfReference = context.normalAppearance.getRaw('First');
        context.normalAppearance.update('First', _PdfName.get('InvalidStream'));
        // Act
        const template: PdfTemplate = context.field._getStateTemplate(
            _PdfCheckFieldState.checked,
            context.item
        );
        // Assert
        expect(context.normalAppearance.has('First')).toBeTruthy();
        expect(context.normalAppearance.get('First') instanceof _PdfBaseStream).toBeFalsy();
        expect(template).toBeUndefined();
        context.normalAppearance.update('First', checkedReference ? checkedReference : checkedAppearance);
        context.document.destroy();
    });
    it('should assign the raw reference to the stream returned by the appearance dictionary', () => {
        // Arrange
        const context: {
            document: PdfDocument;
            field: PdfRadioButtonListField;
            item: PdfRadioButtonListItem;
            normalAppearance: _PdfDictionary;
        } = createLoadedRadioField();
        const checkedStream: _PdfBaseStream =
            context.normalAppearance.get('First');
        const checkedReference: _PdfReference =
            context.normalAppearance.getRaw('First');
        const originalGet: typeof context.normalAppearance.get =
            context.normalAppearance.get;
        const originalGetRaw: typeof context.normalAppearance.getRaw =
            context.normalAppearance.getRaw;
        context.normalAppearance.get = (
            key: string
        ): ReturnType<_PdfDictionary['get']> => {
            if (key === 'First') {
                return checkedStream;
            }
            return originalGet.call(context.normalAppearance, key);
        };
        context.normalAppearance.getRaw = (
            key: string
        ): ReturnType<_PdfDictionary['getRaw']> => {
            if (key === 'First') {
                return checkedReference;
            }
            return originalGetRaw.call(context.normalAppearance, key);
        };
        checkedStream.reference = undefined;
        // Act
        const template: PdfTemplate =
            context.field._getStateTemplate(
                _PdfCheckFieldState.checked,
                context.item
            );
        // Assert
        expect(context.normalAppearance instanceof _PdfDictionary).toBeTruthy();
        expect(context.normalAppearance.has('First')).toBeTruthy();
        expect(checkedReference instanceof _PdfReference).toBeTruthy();
        expect(checkedStream).toBeDefined();
        expect(checkedStream.dictionary instanceof _PdfDictionary).toBeTruthy();
        expect(checkedStream.reference).toBe(checkedReference);
        expect(template).toBeDefined();
        expect(template instanceof PdfTemplate).toBeTruthy();
        expect(template._isExported).toBeTruthy();
        context.normalAppearance.getRaw = originalGetRaw;
        context.normalAppearance.get = originalGet;
        context.document.destroy();
    });
    it('should create the checked template without assigning an unavailable raw reference', () => {
        // Arrange
        const context: {
            document: PdfDocument;
            field: PdfRadioButtonListField;
            item: PdfRadioButtonListItem;
            normalAppearance: _PdfDictionary;
        } = createLoadedRadioField();
        const checkedStream: _PdfBaseStream =
            context.normalAppearance.get('First');
        const originalGet: typeof context.normalAppearance.get =
            context.normalAppearance.get;
        const originalGetRaw: typeof context.normalAppearance.getRaw =
            context.normalAppearance.getRaw;
        context.normalAppearance.get = (
            key: string
        ): ReturnType<_PdfDictionary['get']> => {
            if (key === 'First') {
                return checkedStream;
            }
            return originalGet.call(context.normalAppearance, key);
        };
        context.normalAppearance.getRaw = (
            key: string
        ): ReturnType<_PdfDictionary['getRaw']> => {
            if (key === 'First') {
                return undefined;
            }
            return originalGetRaw.call(context.normalAppearance, key);
        };
        checkedStream.reference = undefined;
        // Act
        const template: PdfTemplate =
            context.field._getStateTemplate(
                _PdfCheckFieldState.checked,
                context.item
            );
        // Assert
        expect(context.normalAppearance.has('First')).toBeTruthy();
        expect(context.normalAppearance.get('First')).toBe(checkedStream);
        expect(context.normalAppearance.getRaw('First')).toBeUndefined();
        expect(checkedStream.dictionary instanceof _PdfDictionary).toBeTruthy();
        expect(checkedStream.reference).toBeUndefined();
        expect(template).toBeDefined();
        expect(template instanceof PdfTemplate).toBeTruthy();
        expect(template._isExported).toBeTruthy();
        context.normalAppearance.getRaw = originalGetRaw;
        context.normalAppearance.get = originalGet;
        context.document.destroy();
    });
});
describe('PdfField _getStateTemplate fixed mutation coverage for lines 975 to 994', () => {
    it('should read Matrix and BBox from the selected stream dictionary', () => {
        // Arrange
        const context: ReturnType<typeof createRadioAppearanceContext> = createRadioAppearanceContext();
        const originalAppearanceGet: typeof context.normalAppearance.get = context.normalAppearance.get;
        const originalAppearanceGetRaw: typeof context.normalAppearance.getRaw = context.normalAppearance.getRaw;
        const originalGetArray: typeof context.streamDictionary.getArray = context.streamDictionary.getArray;
        const matrix: number[] = [2, 0, 0, 3, 0, 0];
        const bounds: number[] = [0, 0, 20, 20];
        const requestedKeys: string[] = [];
        context.normalAppearance.get = (key: string): ReturnType<_PdfDictionary['get']> => {
            return key === 'First' ? context.stream : originalAppearanceGet.call(context.normalAppearance, key);
        };
        context.normalAppearance.getRaw = (key: string): ReturnType<_PdfDictionary['getRaw']> => {
            return key === 'First' ? context.reference : originalAppearanceGetRaw.call(context.normalAppearance, key);
        };
        context.streamDictionary.getArray = (key: string): number[] => {
            requestedKeys.push(key);
            if (key === 'Matrix') {
                return matrix;
            }
            if (key === 'BBox') {
                return bounds;
            }
            return originalGetArray.call(context.streamDictionary, key);
        };
        context.stream.offset = 12;
        // Act
        const template: PdfTemplate = context.field._getStateTemplate(
            _PdfCheckFieldState.checked,
            context.item
        );
        // Assert
        expect(requestedKeys).toEqual(['Matrix', 'BBox']);
        expect(template).toBeDefined();
        expect(template._size.width).toBe(40);
        expect(template._size.height).toBe(60);
        expect(context.stream.offset).toBe(811);
        context.streamDictionary.getArray = originalGetArray;
        context.normalAppearance.getRaw = originalAppearanceGetRaw;
        context.normalAppearance.get = originalAppearanceGet;
        context.document.destroy();
    });
    it('should use matching widget bounds when Matrix is unavailable', () => {
        // Arrange
        const context: ReturnType<typeof createRadioAppearanceContext> = createRadioAppearanceContext();
        const originalAppearanceGet: typeof context.normalAppearance.get = context.normalAppearance.get;
        const originalAppearanceGetRaw: typeof context.normalAppearance.getRaw = context.normalAppearance.getRaw;
        const originalGetArray: typeof context.streamDictionary.getArray = context.streamDictionary.getArray;
        const requestedKeys: string[] = [];
        context.normalAppearance.get = (key: string): ReturnType<_PdfDictionary['get']> => {
            return key === 'First' ? context.stream : originalAppearanceGet.call(context.normalAppearance, key);
        };
        context.normalAppearance.getRaw = (key: string): ReturnType<_PdfDictionary['getRaw']> => {
            return key === 'First' ? context.reference : originalAppearanceGetRaw.call(context.normalAppearance, key);
        };
        context.streamDictionary.getArray = (key: string): number[] => {
            requestedKeys.push(key);
            return key === 'BBox' ? [0, 0, 20, 20] : undefined;
        };
        // Act
        const template: PdfTemplate = context.field._getStateTemplate(
            _PdfCheckFieldState.checked,
            context.item
        );
        // Assert
        expect(requestedKeys).toEqual(['Matrix', 'BBox']);
        expect(context.item.bounds.width).toBe(20);
        expect(context.item.bounds.height).toBe(20);
        expect(template).toBeDefined();
        expect(template._size.width).toBe(20);
        expect(template._size.height).toBe(20);
        context.streamDictionary.getArray = originalGetArray;
        context.normalAppearance.getRaw = originalAppearanceGetRaw;
        context.normalAppearance.get = originalAppearanceGet;
        context.document.destroy();
    });
    it('should reject matching-size condition when only width matches', () => {
        // Arrange
        const context: ReturnType<typeof createRadioAppearanceContext> = createRadioAppearanceContext();
        const originalAppearanceGet: typeof context.normalAppearance.get = context.normalAppearance.get;
        const originalAppearanceGetRaw: typeof context.normalAppearance.getRaw = context.normalAppearance.getRaw;
        const originalGetArray: typeof context.streamDictionary.getArray = context.streamDictionary.getArray;
        context.normalAppearance.get = (key: string): ReturnType<_PdfDictionary['get']> => {
            return key === 'First' ? context.stream : originalAppearanceGet.call(context.normalAppearance, key);
        };
        context.normalAppearance.getRaw = (key: string): ReturnType<_PdfDictionary['getRaw']> => {
            return key === 'First' ? context.reference : originalAppearanceGetRaw.call(context.normalAppearance, key);
        };
        context.streamDictionary.getArray = (key: string): number[] => {
            return key === 'BBox' ? [5, 6, 20, 30] : undefined;
        };
        // Act
        const template: PdfTemplate = context.field._getStateTemplate(
            _PdfCheckFieldState.checked,
            context.item
        );
        // Assert
        expect(context.item.bounds.width).toBe(20);
        expect(context.item.bounds.height).toBe(20);
        expect(template).toBeDefined();
        expect(template._size.width).toBe(20);
        expect(template._size.height).toBe(30);
        expect(context.streamDictionary.getArray('Matrix')).toBeUndefined();
        context.streamDictionary.getArray = originalGetArray;
        context.normalAppearance.getRaw = originalAppearanceGetRaw;
        context.normalAppearance.get = originalAppearanceGet;
        context.document.destroy();
    });
    it('should reject matching-size condition when only height matches', () => {
        // Arrange
        const context: ReturnType<typeof createRadioAppearanceContext> = createRadioAppearanceContext();
        const originalAppearanceGet: typeof context.normalAppearance.get = context.normalAppearance.get;
        const originalAppearanceGetRaw: typeof context.normalAppearance.getRaw = context.normalAppearance.getRaw;
        const originalGetArray: typeof context.streamDictionary.getArray = context.streamDictionary.getArray;
        context.normalAppearance.get = (key: string): ReturnType<_PdfDictionary['get']> => {
            return key === 'First' ? context.stream : originalAppearanceGet.call(context.normalAppearance, key);
        };
        context.normalAppearance.getRaw = (key: string): ReturnType<_PdfDictionary['getRaw']> => {
            return key === 'First' ? context.reference : originalAppearanceGetRaw.call(context.normalAppearance, key);
        };
        context.streamDictionary.getArray = (key: string): number[] => {
            return key === 'BBox' ? [5, 6, 30, 20] : undefined;
        };
        // Act
        const template: PdfTemplate = context.field._getStateTemplate(
            _PdfCheckFieldState.checked,
            context.item
        );
        // Assert
        expect(context.item.bounds.width).toBe(20);
        expect(context.item.bounds.height).toBe(20);
        expect(template).toBeDefined();
        expect(template._size.width).toBe(30);
        expect(template._size.height).toBe(20);
        expect(context.streamDictionary.getArray('Matrix')).toBeUndefined();
        context.streamDictionary.getArray = originalGetArray;
        context.normalAppearance.getRaw = originalAppearanceGetRaw;
        context.normalAppearance.get = originalAppearanceGet;
        context.document.destroy();
    });
    it('should return undefined when the selected stream dictionary is unavailable', () => {
        // Arrange
        const context: ReturnType<typeof createRadioAppearanceContext> = createRadioAppearanceContext();
        const originalAppearanceGet: typeof context.normalAppearance.get = context.normalAppearance.get;
        const originalAppearanceGetRaw: typeof context.normalAppearance.getRaw = context.normalAppearance.getRaw;
        const originalDictionary: _PdfDictionary = context.stream.dictionary;
        context.normalAppearance.get = (key: string): ReturnType<_PdfDictionary['get']> => {
            return key === 'First' ? context.stream : originalAppearanceGet.call(context.normalAppearance, key);
        };
        context.normalAppearance.getRaw = (key: string): ReturnType<_PdfDictionary['getRaw']> => {
            return key === 'First' ? context.reference : originalAppearanceGetRaw.call(context.normalAppearance, key);
        };
        context.stream.dictionary = undefined;
        // Act
        const template: PdfTemplate = context.field._getStateTemplate(
            _PdfCheckFieldState.checked,
            context.item
        );
        // Assert
        expect(context.stream.dictionary).toBeUndefined();
        expect(template).toBeUndefined();
        context.stream.dictionary = originalDictionary;
        context.normalAppearance.getRaw = originalAppearanceGetRaw;
        context.normalAppearance.get = originalAppearanceGet;
        context.document.destroy();
    });
});
describe('PdfField _getStateTemplate mutation coverage for lines 995 to 1000', () => {
    it('should enter the bounds branch when Rect equals BBox and write the exact Matrix', () => {
        // Arrange
        const context: ReturnType<typeof createBoundsBranchContext> = createBoundsBranchContext();
        const originalAppearanceGet: typeof context.normalAppearance.get = context.normalAppearance.get;
        const originalAppearanceGetRaw: typeof context.normalAppearance.getRaw = context.normalAppearance.getRaw;
        const originalGetArray: typeof context.streamDictionary.getArray = context.streamDictionary.getArray;
        const originalWidgetGet: typeof context.item._dictionary.get = context.item._dictionary.get;
        const originalUpdate: typeof context.streamDictionary.update = context.streamDictionary.update;
        const bounds: number[] = [5, 6, 25, 26];
        let updatedKey: string;
        let updatedMatrix: number[];
        context.normalAppearance.get = (key: string): ReturnType<_PdfDictionary['get']> => {
            return key === 'First' ? context.stream : originalAppearanceGet.call(context.normalAppearance, key);
        };
        context.normalAppearance.getRaw = (key: string): ReturnType<_PdfDictionary['getRaw']> => {
            return key === 'First' ? context.reference : originalAppearanceGetRaw.call(context.normalAppearance, key);
        };
        context.streamDictionary.getArray = (key: string): number[] => {
            if (key === 'Matrix') {
                return undefined;
            }
            if (key === 'BBox') {
                return bounds;
            }
            return originalGetArray.call(context.streamDictionary, key);
        };
        context.item._dictionary.get = (key: string): ReturnType<_PdfDictionary['get']> => {
            return key === 'Rect' ? bounds : originalWidgetGet.call(context.item._dictionary, key);
        };
        context.streamDictionary.update = (key: string, value: number[]): void => {
            updatedKey = key;
            updatedMatrix = value;
            originalUpdate.call(context.streamDictionary, key, value);
        };
        // Act
        const template: PdfTemplate = context.field._getStateTemplate(
            _PdfCheckFieldState.checked,
            context.item
        );
        // Assert
        expect(context.item.bounds.width).toBe(20);
        expect(context.item.bounds.height).toBe(20);
        expect(bounds[2]).not.toBe(context.item.bounds.width);
        expect(bounds[3]).not.toBe(context.item.bounds.height);
        expect(updatedKey).toBe('Matrix');
        expect(updatedMatrix).toEqual([1, 0, 0, 1, -5, -6]);
        expect(template).toBeDefined();
        expect(template._size.width).toBe(20);
        expect(template._size.height).toBe(20);
        context.streamDictionary.update = originalUpdate;
        context.item._dictionary.get = originalWidgetGet;
        context.streamDictionary.getArray = originalGetArray;
        context.normalAppearance.getRaw = originalAppearanceGetRaw;
        context.normalAppearance.get = originalAppearanceGet;
        context.document.destroy();
    });
    it('should use BBox size when the resolved widget contains Vertices', () => {
        // Arrange
        const context: ReturnType<typeof createBoundsBranchContext> = createBoundsBranchContext();
        const originalAppearanceGet: typeof context.normalAppearance.get = context.normalAppearance.get;
        const originalAppearanceGetRaw: typeof context.normalAppearance.getRaw = context.normalAppearance.getRaw;
        const originalGetArray: typeof context.streamDictionary.getArray = context.streamDictionary.getArray;
        const originalWidgetGet: typeof context.item._dictionary.get = context.item._dictionary.get;
        const bounds: number[] = [5, 6, 25, 26];
        context.normalAppearance.get = (key: string): ReturnType<_PdfDictionary['get']> => {
            return key === 'First' ? context.stream : originalAppearanceGet.call(context.normalAppearance, key);
        };
        context.normalAppearance.getRaw = (key: string): ReturnType<_PdfDictionary['getRaw']> => {
            return key === 'First' ? context.reference : originalAppearanceGetRaw.call(context.normalAppearance, key);
        };
        context.streamDictionary.getArray = (key: string): number[] => {
            return key === 'BBox' ? bounds : undefined;
        };
        context.item._dictionary.get = (key: string): ReturnType<_PdfDictionary['get']> => {
            return key === 'Rect' ? bounds : originalWidgetGet.call(context.item._dictionary, key);
        };
        context.item._dictionary.update('Vertices', [5, 6, 25, 26]);
        // Act
        const template: PdfTemplate = context.field._getStateTemplate(
            _PdfCheckFieldState.checked,
            context.item
        );
        // Assert
        expect(context.item._dictionary.has('Vertices')).toBeTruthy();
        expect(template).toBeDefined();
        expect(template._size.width).toBe(25);
        expect(template._size.height).toBe(26);
        delete context.item._dictionary._map.Vertices;
        context.item._dictionary.get = originalWidgetGet;
        context.streamDictionary.getArray = originalGetArray;
        context.normalAppearance.getRaw = originalAppearanceGetRaw;
        context.normalAppearance.get = originalAppearanceGet;
        context.document.destroy();
    });
    it('should use widget size when the resolved widget does not contain Vertices', () => {
        // Arrange
        const context: ReturnType<typeof createBoundsBranchContext> = createBoundsBranchContext();
        const originalAppearanceGet: typeof context.normalAppearance.get = context.normalAppearance.get;
        const originalAppearanceGetRaw: typeof context.normalAppearance.getRaw = context.normalAppearance.getRaw;
        const originalGetArray: typeof context.streamDictionary.getArray = context.streamDictionary.getArray;
        const originalWidgetGet: typeof context.item._dictionary.get = context.item._dictionary.get;
        const bounds: number[] = [5, 6, 25, 26];
        context.normalAppearance.get = (key: string): ReturnType<_PdfDictionary['get']> => {
            return key === 'First' ? context.stream : originalAppearanceGet.call(context.normalAppearance, key);
        };
        context.normalAppearance.getRaw = (key: string): ReturnType<_PdfDictionary['getRaw']> => {
            return key === 'First' ? context.reference : originalAppearanceGetRaw.call(context.normalAppearance, key);
        };
        context.streamDictionary.getArray = (key: string): number[] => {
            return key === 'BBox' ? bounds : undefined;
        };
        context.item._dictionary.get = (key: string): ReturnType<_PdfDictionary['get']> => {
            return key === 'Rect' ? bounds : originalWidgetGet.call(context.item._dictionary, key);
        };
        delete context.item._dictionary._map.Vertices;
        // Act
        const template: PdfTemplate = context.field._getStateTemplate(
            _PdfCheckFieldState.checked,
            context.item
        );
        // Assert
        expect(context.item._dictionary.has('Vertices')).toBeFalsy();
        expect(template).toBeDefined();
        expect(template._size.width).toBe(20);
        expect(template._size.height).toBe(20);
        context.item._dictionary.get = originalWidgetGet;
        context.streamDictionary.getArray = originalGetArray;
        context.normalAppearance.getRaw = originalAppearanceGetRaw;
        context.normalAppearance.get = originalAppearanceGet;
        context.document.destroy();
    });
    it('should return the existing appearance template without creating a new template', () => {
        // Arrange
        const annotation: PdfRectangleAnnotation = new PdfRectangleAnnotation({
            x: 0,
            y: 0,
            width: 100,
            height: 50
        });
        const existingTemplate: PdfTemplate = {} as PdfTemplate;
        let createTemplateCallCount: number = 0;
        annotation._appearanceTemplate = existingTemplate;
        annotation._createTemplate = (): PdfTemplate => {
            createTemplateCallCount++;
            return {} as PdfTemplate;
        };
        // Act
        const actual: PdfTemplate = annotation.createTemplate();
        // Assert
        expect(createTemplateCallCount).toBe(0);
        expect(actual).toBe(existingTemplate);
        expect(annotation._appearanceTemplate).toBe(existingTemplate);
    });
});
describe('PdfField template survived mutation coverage', () => {
    it('should use the checkbox fallback branch when the checkbox has no child items', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfCheckBoxField = new PdfCheckBoxField(
            'checkbox',
            { x: 10, y: 10, width: 20, height: 20 },
            page
        );
        const expectedTemplate: PdfTemplate = new PdfTemplate(
            [0, 0, 20, 20],
            field._crossReference
        );
        const originalGetStateTemplate:
            (state: _PdfCheckFieldState, item: PdfStateItem | PdfField) => PdfTemplate =
            field._getStateTemplate;
        let receivedState: _PdfCheckFieldState;
        let receivedItem: PdfStateItem | PdfField;
        field._kids = [];
        field._getStateTemplate = (
            state: _PdfCheckFieldState,
            item: PdfStateItem | PdfField
        ): PdfTemplate => {
            receivedState = state;
            receivedItem = item;
            return expectedTemplate;
        };
        // Act
        const templates: PdfTemplate[] = field._getCheckboxFieldTemplates();
        field._getStateTemplate = originalGetStateTemplate;
        // Assert
        expect(templates.length).toBe(1);
        expect(templates[0]).toBe(expectedTemplate);
        expect(receivedItem).toBe(field);
        expect(receivedState).toBe(_PdfCheckFieldState.unchecked);
        document.destroy();
    });
    it('should ignore a checkbox child that is not a PdfStateItem', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const checkboxField: PdfCheckBoxField = new PdfCheckBoxField(
            'checkbox',
            { x: 10, y: 10, width: 20, height: 20 },
            page
        );
        const field: PdfField = checkboxField;
        const unrelatedWidget: PdfWidgetAnnotation = new PdfWidgetAnnotation();
        const originalItemAt:
            (index: number) => PdfWidgetAnnotation = field.itemAt;
        const originalGetStateTemplate:
            (
                state: _PdfCheckFieldState,
                item: PdfStateItem | PdfField
            ) => PdfTemplate = field._getStateTemplate;
        let stateTemplateCallCount: number = 0;
        field._kids = [new _PdfReference(1, 0)];
        field.itemAt = (_index: number): PdfWidgetAnnotation => {
            return unrelatedWidget;
        };
        field._getStateTemplate = (
            _state: _PdfCheckFieldState,
            _item: PdfStateItem | PdfField
        ): PdfTemplate => {
            stateTemplateCallCount++;
            return new PdfTemplate(
                [0, 0, 20, 20],
                field._crossReference
            );
        };
        // Act
        const templates: PdfTemplate[] =
            field._getCheckboxFieldTemplates();
        // Restore
        field.itemAt = originalItemAt;
        field._getStateTemplate = originalGetStateTemplate;
        // Assert
        expect(unrelatedWidget instanceof PdfStateItem).toBeFalsy();
        expect(templates.length).toBe(0);
        expect(stateTemplateCallCount).toBe(0);
        document.destroy();
    });
    it('should not execute the radio fallback branch for a checkbox field', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfCheckBoxField = new PdfCheckBoxField(
            'checkbox',
            { x: 10, y: 10, width: 20, height: 20 },
            page
        );
        const originalGetStateTemplate:
            (state: _PdfCheckFieldState, item: PdfStateItem | PdfField) => PdfTemplate =
            field._getStateTemplate;
        let stateTemplateCallCount: number = 0;
        field._kids = [];
        field._getStateTemplate = (
            _state: _PdfCheckFieldState,
            _item: PdfStateItem | PdfField
        ): PdfTemplate => {
            stateTemplateCallCount++;
            return new PdfTemplate([0, 0, 20, 20], field._crossReference);
        };
        // Act
        const templates: PdfTemplate[] =
            field._getPdfRadioButtonListFieldTemplates();
        field._getStateTemplate = originalGetStateTemplate;
        // Assert
        expect(templates.length).toBe(0);
        expect(stateTemplateCallCount).toBe(0);
        document.destroy();
    });
    it('should request the checked state for a selected radio button field without child items', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfRadioButtonListField =
            new PdfRadioButtonListField(page, 'radio');
        const expectedTemplate: PdfTemplate = new PdfTemplate(
            [0, 0, 20, 20],
            field._crossReference
        );
        const originalGetStateTemplate:
            (state: _PdfCheckFieldState, item: PdfStateItem | PdfField) => PdfTemplate =
            field._getStateTemplate;
        let receivedState: _PdfCheckFieldState;
        field._kids = [];
        field._selectedIndex = 0;
        field._getStateTemplate = (
            state: _PdfCheckFieldState,
            _item: PdfStateItem | PdfField
        ): PdfTemplate => {
            receivedState = state;
            return expectedTemplate;
        };
        // Act
        const templates: PdfTemplate[] =
            field._getPdfRadioButtonListFieldTemplates();
        field._getStateTemplate = originalGetStateTemplate;
        // Assert
        expect(templates.length).toBe(1);
        expect(templates[0]).toBe(expectedTemplate);
        expect(receivedState).toBe(_PdfCheckFieldState.checked);
        document.destroy();
    });
    it('should not add an undefined radio appearance template', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfRadioButtonListField =
            new PdfRadioButtonListField(page, 'radio');
        const originalGetStateTemplate:
            (state: _PdfCheckFieldState, item: PdfStateItem | PdfField) => PdfTemplate =
            field._getStateTemplate;
        field._kids = [];
        field._selectedIndex = -1;
        field._getStateTemplate = (
            _state: _PdfCheckFieldState,
            _item: PdfStateItem | PdfField
        ): PdfTemplate => {
            return undefined;
        };
        // Act
        const templates: PdfTemplate[] =
            field._getPdfRadioButtonListFieldTemplates();
        field._getStateTemplate = originalGetStateTemplate;
        // Assert
        expect(templates.length).toBe(0);
        expect(templates[0]).toBeUndefined();
        document.destroy();
    });
    it('should resolve a base stream appearance dictionary and preserve its reference', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfCheckBoxField = new PdfCheckBoxField(
            'checkbox',
            { x: 10, y: 10, width: 20, height: 20 },
            page
        );
        document.form.add(field);
        const item: PdfStateItem = field.itemAt(0) as PdfStateItem;
        const appearanceTemplate: PdfTemplate = new PdfTemplate(
            [0, 0, 20, 20],
            field._crossReference
        );
        const appearanceStream: _PdfBaseStream =
            appearanceTemplate._content as _PdfBaseStream;
        const appearanceReference: _PdfReference =
            field._crossReference._getNextReference();
        const normalAppearance: _PdfDictionary =
            new _PdfDictionary(field._crossReference);
        const appearanceDictionary: _PdfDictionary =
            new _PdfDictionary(field._crossReference);
        appearanceStream.dictionary.update('BBox', [0, 0, 20, 20]);
        appearanceStream.dictionary.update('Matrix', [1, 0, 0, 1, 0, 0]);
        field._crossReference._cacheMap.set(
            appearanceReference,
            appearanceStream
        );
        normalAppearance.update('Yes', appearanceReference);
        appearanceDictionary.update('N', normalAppearance);
        item._dictionary.update('AP', appearanceDictionary);
        item._dictionary.update('AS', _PdfName.get('Yes'));
        // Act
        const template: PdfTemplate = field._getStateTemplate(
            _PdfCheckFieldState.checked,
            item
        );
        // Assert
        expect(template).toBeDefined();
        expect(template._isExported).toBeTruthy();
        expect(appearanceStream.reference).toBe(appearanceReference);
        expect(template._size.width).toBe(20);
        expect(template._size.height).toBe(20);
        document.destroy();
    });
    it('should return undefined when the field state has no resolved widget', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const checkboxField: PdfCheckBoxField = new PdfCheckBoxField(
            'checkbox',
            { x: 10, y: 10, width: 20, height: 20 },
            page
        );
        const field: PdfField = checkboxField;
        const appearanceTemplate: PdfTemplate = new PdfTemplate(
            [0, 0, 20, 20],
            field._crossReference
        );
        const appearanceStream: _PdfBaseStream =
            appearanceTemplate._content as _PdfBaseStream;
        const normalAppearance: _PdfDictionary =
            new _PdfDictionary(field._crossReference);
        const appearanceDictionary: _PdfDictionary =
            new _PdfDictionary(field._crossReference);
        const originalItemAt:
            (index: number) => PdfWidgetAnnotation = field.itemAt;
        appearanceStream.dictionary.update('BBox', [0, 0, 20, 20]);
        normalAppearance.update('Yes', appearanceStream);
        appearanceDictionary.update('N', normalAppearance);
        field._dictionary.update('AP', appearanceDictionary);
        field._dictionary.update('V', _PdfName.get('Yes'));
        field.itemAt = (_index: number): PdfWidgetAnnotation => {
            return undefined;
        };
        // Act
        const template: PdfTemplate = field._getStateTemplate(
            _PdfCheckFieldState.checked,
            field
        );
        // Restore
        field.itemAt = originalItemAt;
        // Assert
        expect(template).toBeUndefined();
        document.destroy();
    });
    it('should copy every numeric matrix value before transforming the appearance bounds', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfCheckBoxField = new PdfCheckBoxField(
            'checkbox',
            { x: 10, y: 10, width: 20, height: 20 },
            page
        );
        document.form.add(field);
        const item: PdfStateItem = field.itemAt(0) as PdfStateItem;
        const appearanceTemplate: PdfTemplate = new PdfTemplate(
            [0, 0, 20, 20],
            field._crossReference
        );
        const appearanceStream: _PdfBaseStream =
            appearanceTemplate._content as _PdfBaseStream;
        const normalAppearance: _PdfDictionary =
            new _PdfDictionary(field._crossReference);
        const appearanceDictionary: _PdfDictionary =
            new _PdfDictionary(field._crossReference);
        const originalTransformBBox:
            (
                bounds: { x: number; y: number; width: number; height: number },
                matrix: number[]
            ) => number[] = item._transformBBox;
        let receivedMatrix: number[] = [];
        appearanceStream.dictionary.update('BBox', [0, 0, 20, 20]);
        appearanceStream.dictionary.update('Matrix', [2, 0, 0, 3, 4, 5]);
        normalAppearance.update('Yes', appearanceStream);
        appearanceDictionary.update('N', normalAppearance);
        item._dictionary.update('AP', appearanceDictionary);
        item._transformBBox = (
            _bounds: { x: number; y: number; width: number; height: number },
            matrix: number[]
        ): number[] => {
            receivedMatrix = matrix;
            return [0, 0, 40, 60];
        };
        // Act
        const template: PdfTemplate = field._getStateTemplate(
            _PdfCheckFieldState.checked,
            item
        );
        item._transformBBox = originalTransformBBox;
        // Assert
        expect(receivedMatrix.length).toBe(6);
        expect(receivedMatrix[0]).toBe(2);
        expect(receivedMatrix[1]).toBe(0);
        expect(receivedMatrix[2]).toBe(0);
        expect(receivedMatrix[3]).toBe(3);
        expect(receivedMatrix[4]).toBe(4);
        expect(receivedMatrix[5]).toBe(5);
        expect(template._size.width).toBe(40);
        expect(template._size.height).toBe(60);
        expect(template._templateOriginalSize.width).toBe(20);
        expect(template._templateOriginalSize.height).toBe(20);
        document.destroy();
    });
});
describe('PdfField _getStateTemplate survived mutation coverage', () => {
    it('should copy every matrix value and preserve transformed template dimensions', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            field: PdfCheckBoxField;
            item: PdfStateItem;
            stream: _PdfBaseStream;
            reference: _PdfReference;
        } = createStateTemplateHarness(
            [2, 0, 0, 3, 4, 5],
            [2, 3, 22, 33]
        );
        const originalTransformBBox:
            (
                bounds: {
                    x: number;
                    y: number;
                    width: number;
                    height: number;
                },
                matrix: number[]
            ) => number[] = harness.item._transformBBox;
        let receivedMatrix: number[] = [];
        harness.item._transformBBox = (
            bounds: {
                x: number;
                y: number;
                width: number;
                height: number;
            },
            matrix: number[]
        ): number[] => {
            receivedMatrix = matrix;
            return [
                bounds.x,
                bounds.y,
                bounds.width * matrix[0],
                bounds.height * matrix[3]
            ];
        };
        // Act
        const template: PdfTemplate = harness.field._getStateTemplate(
            _PdfCheckFieldState.unchecked,
            harness.item
        );
        // Restore
        harness.item._transformBBox = originalTransformBBox;
        // Assert
        expect(receivedMatrix.length).toBe(6);
        expect(receivedMatrix[0]).toBe(2);
        expect(receivedMatrix[1]).toBe(0);
        expect(receivedMatrix[2]).toBe(0);
        expect(receivedMatrix[3]).toBe(3);
        expect(receivedMatrix[4]).toBe(4);
        expect(receivedMatrix[5]).toBe(5);
        expect(receivedMatrix[6]).toBeUndefined();
        expect(template._size.width).toBe(40);
        expect(template._size.height).toBe(90);
        expect(template._templateOriginalSize.width).toBe(20);
        expect(template._templateOriginalSize.height).toBe(30);
        harness.document.destroy();
    });
    it('should not transform an appearance when BBox contains only three values', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            field: PdfCheckBoxField;
            item: PdfStateItem;
            stream: _PdfBaseStream;
            reference: _PdfReference;
        } = createStateTemplateHarness(
            [1, 0, 0, 1, 0, 0],
            [0, 0, 20]
        );
        const originalTransformBBox:
            (
                bounds: {
                    x: number;
                    y: number;
                    width: number;
                    height: number;
                },
                matrix: number[]
            ) => number[] = harness.item._transformBBox;
        let transformCallCount: number = 0;
        harness.item._transformBBox = (
            _bounds: {
                x: number;
                y: number;
                width: number;
                height: number;
            },
            _matrix: number[]
        ): number[] => {
            transformCallCount++;
            return [0, 0, 20, 20];
        };
        // Act
        const template: PdfTemplate = harness.field._getStateTemplate(
            _PdfCheckFieldState.unchecked,
            harness.item
        );
        // Restore
        harness.item._transformBBox = originalTransformBBox;
        // Assert
        expect(template).toBeDefined();
        expect(transformCallCount).toBe(0);
        expect(template._templateOriginalSize).toBeUndefined();
        harness.document.destroy();
    });
    it('should use transformed dimensions when widget bounds exactly match template dimensions', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            field: PdfCheckBoxField;
            item: PdfStateItem;
            stream: _PdfBaseStream;
            reference: _PdfReference;
        } = createStateTemplateHarness(
            undefined,
            [5, 6, 50, 60]
        );
        const originalGetTransformMatrix:
            (
                rect: number[],
                bounds: number[],
                matrix: number[]
            ) => number[] = harness.item._getTransformMatrix;
        let receivedIdentityMatrix: number[] = [];
        let transformCallCount: number = 0;
        harness.item.bounds = {
            x: 10,
            y: 10,
            width: 30,
            height: 40
        };
        if (harness.stream.dictionary.has('Matrix')) {
            delete harness.stream.dictionary._map.Matrix;
        }
        harness.item._getTransformMatrix = (
            _rect: number[],
            _bounds: number[],
            matrix: number[]
        ): number[] => {
            transformCallCount++;
            receivedIdentityMatrix = matrix;
            return [30, 0, 0, 40, 0, 0];
        };
        // Act
        const template: PdfTemplate = harness.field._getStateTemplate(
            _PdfCheckFieldState.unchecked,
            harness.item
        );
        const resultMatrix: number[] =
            harness.stream.dictionary.getArray('Matrix');
        // Restore
        harness.item._getTransformMatrix = originalGetTransformMatrix;
        // Assert
        expect(transformCallCount).toBe(1);
        expect(harness.item.bounds.width).toBe(30);
        expect(harness.item.bounds.height).toBe(40);
        expect(receivedIdentityMatrix.length).toBe(6);
        expect(receivedIdentityMatrix[0]).toBe(1);
        expect(receivedIdentityMatrix[1]).toBe(0);
        expect(receivedIdentityMatrix[2]).toBe(0);
        expect(receivedIdentityMatrix[3]).toBe(1);
        expect(receivedIdentityMatrix[4]).toBe(0);
        expect(receivedIdentityMatrix[5]).toBe(0);
        expect(template).toBeDefined();
        expect(template._size.width).toBe(30);
        expect(template._size.height).toBe(40);
        expect(resultMatrix.length).toBe(6);
        expect(resultMatrix[0]).toBe(30);
        expect(resultMatrix[1]).toBe(0);
        expect(resultMatrix[2]).toBe(0);
        expect(resultMatrix[3]).toBe(40);
        expect(resultMatrix[4]).toBe(0);
        expect(resultMatrix[5]).toBe(0);
        harness.document.destroy();
    });
    it('should reset a nonzero numeric stream offset to zero', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            field: PdfCheckBoxField;
            item: PdfStateItem;
            stream: _PdfBaseStream;
            reference: _PdfReference;
        } = createStateTemplateHarness(
            [1, 0, 0, 1, 0, 0],
            [0, 0, 20, 20]
        );
        harness.stream.offset = 5;
        // Act
        const template: PdfTemplate = harness.field._getStateTemplate(
            _PdfCheckFieldState.unchecked,
            harness.item
        );
        // Assert
        expect(template).toBeDefined();
        expect(harness.stream.offset).toBe(0);
        harness.document.destroy();
    });
    it('should not assign the stream offset when offset is already zero', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            field: PdfCheckBoxField;
            item: PdfStateItem;
            stream: _PdfBaseStream;
            reference: _PdfReference;
        } = createStateTemplateHarness(
            [1, 0, 0, 1, 0, 0],
            [0, 0, 20, 20]
        );
        let currentOffset: number = 0;
        let assignmentCount: number = 0;
        Object.defineProperty(harness.stream, 'offset', {
            configurable: true,
            get: (): number => {
                return currentOffset;
            },
            set: (value: number): void => {
                assignmentCount++;
                currentOffset = value;
            }
        });
        // Act
        const template: PdfTemplate = harness.field._getStateTemplate(
            _PdfCheckFieldState.unchecked,
            harness.item
        );
        // Restore
        delete harness.stream.offset;
        harness.stream.offset = currentOffset;
        // Assert
        expect(template).toBeDefined();
        expect(currentOffset).toBe(0);
        expect(assignmentCount).toBe(0);
        harness.document.destroy();
    });
    it('should not reset a nonnumeric stream offset', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            field: PdfCheckBoxField;
            item: PdfStateItem;
            stream: _PdfBaseStream;
            reference: _PdfReference;
        } = createStateTemplateHarness(
            [1, 0, 0, 1, 0, 0],
            [0, 0, 20, 20]
        );
        const streamWithStringOffset: { offset: string } =
            harness.stream as unknown as { offset: string };
        streamWithStringOffset.offset = '5';
        // Act
        const template: PdfTemplate = harness.field._getStateTemplate(
            _PdfCheckFieldState.unchecked,
            harness.item
        );
        // Assert
        expect(template).toBeDefined();
        expect(streamWithStringOffset.offset).toBe('5');
        expect(typeof streamWithStringOffset.offset).toBe('string');
        harness.document.destroy();
    });
    it('should use matching BBox dimensions without calculating another transform', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            field: PdfCheckBoxField;
            item: PdfStateItem;
            stream: _PdfBaseStream;
            reference: _PdfReference;
        } = createStateTemplateHarness(
            undefined,
            [0, 0, 20, 20]
        );
        const originalGetTransformMatrix:
            (
                rect: number[],
                bounds: number[],
                matrix: number[]
            ) => number[] = harness.item._getTransformMatrix;
        let transformCallCount: number = 0;
        harness.item._getTransformMatrix = (
            _rect: number[],
            _bounds: number[],
            _matrix: number[]
        ): number[] => {
            transformCallCount++;
            return [20, 0, 0, 20, 0, 0];
        };
        // Act
        const template: PdfTemplate = harness.field._getStateTemplate(
            _PdfCheckFieldState.unchecked,
            harness.item
        );
        const resultMatrix: number[] =
            harness.stream.dictionary.getArray('Matrix');
        // Restore
        harness.item._getTransformMatrix = originalGetTransformMatrix;
        // Assert
        expect(template).toBeDefined();
        expect(transformCallCount).toBe(0);
        expect(template._size.width).toBe(20);
        expect(template._size.height).toBe(20);
        expect(resultMatrix.length).toBe(6);
        expect(resultMatrix[0]).toBe(1);
        expect(resultMatrix[1]).toBe(0);
        expect(resultMatrix[2]).toBe(0);
        expect(resultMatrix[3]).toBe(1);
        expect(resultMatrix[4]).toBe(0);
        expect(resultMatrix[5]).toBe(0);
        harness.document.destroy();
    });
    it('should pass the complete identity matrix for an unmatched BBox', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            field: PdfCheckBoxField;
            item: PdfStateItem;
            stream: _PdfBaseStream;
            reference: _PdfReference;
        } = createStateTemplateHarness(
            undefined,
            [5, 6, 30, 40]
        );
        const originalGetTransformMatrix:
            (
                rect: number[],
                bounds: number[],
                matrix: number[]
            ) => number[] = harness.item._getTransformMatrix;
        let receivedMatrix: number[] = [];
        harness.item._getTransformMatrix = (
            _rect: number[],
            _bounds: number[],
            matrix: number[]
        ): number[] => {
            receivedMatrix = matrix;
            return [25, 0, 0, 35, 0, 0];
        };
        // Act
        const template: PdfTemplate = harness.field._getStateTemplate(
            _PdfCheckFieldState.unchecked,
            harness.item
        );
        const resultMatrix: number[] =
            harness.stream.dictionary.getArray('Matrix');
        // Restore
        harness.item._getTransformMatrix = originalGetTransformMatrix;
        // Assert
        expect(receivedMatrix.length).toBe(6);
        expect(receivedMatrix[0]).toBe(1);
        expect(receivedMatrix[1]).toBe(0);
        expect(receivedMatrix[2]).toBe(0);
        expect(receivedMatrix[3]).toBe(1);
        expect(receivedMatrix[4]).toBe(0);
        expect(receivedMatrix[5]).toBe(0);
        expect(template._size.width).toBe(30);
        expect(template._size.height).toBe(40);
        expect(resultMatrix.length).toBe(6);
        expect(resultMatrix[0]).toBe(1);
        expect(resultMatrix[1]).toBe(0);
        expect(resultMatrix[2]).toBe(0);
        expect(resultMatrix[3]).toBe(1);
        expect(resultMatrix[4]).toBe(-5);
        expect(resultMatrix[5]).toBe(-6);
        harness.document.destroy();
    });
});
describe('PdfField checkbox state template mutation coverage', () => {
    it('returns no checkbox template for a non-checkbox field without items', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfButtonField = new PdfButtonField(
            page, 'button', { x: 20, y: 20, width: 40, height: 20 }
        );
        document.form.add(field);
        const internalField: StateTemplateField = field as unknown as StateTemplateField;
        const originalGetStateTemplate: (state: _PdfCheckFieldState,
            item: PdfStateItem | PdfField) => PdfTemplate = internalField._getStateTemplate;
        internalField._getStateTemplate = (_state: _PdfCheckFieldState,
            _item: PdfStateItem | PdfField): PdfTemplate => new PdfTemplate();
        // Act
        const templates: PdfTemplate[] = internalField._getCheckboxFieldTemplates();
        // Assert
        expect(templates.length).toBe(0);
        internalField._getStateTemplate = originalGetStateTemplate;
        document.destroy();
    });
    it('does not append an undefined checkbox state template', () => {
        // Arrange
        const harness: {
            document: PdfDocument; page: PdfPage; field: PdfCheckBoxField;
            item: PdfStateItem
        } = createCheckBoxHarness();
        const internalField: StateTemplateField = harness.field as unknown as StateTemplateField;
        const originalGetStateTemplate: (state: _PdfCheckFieldState,
            item: PdfStateItem | PdfField) => PdfTemplate = internalField._getStateTemplate;
        internalField._getStateTemplate = (_state: _PdfCheckFieldState,
            _item: PdfStateItem | PdfField): PdfTemplate => undefined;
        // Act
        const templates: PdfTemplate[] = internalField._getCheckboxFieldTemplates();
        // Assert
        expect(templates.length).toBe(0);
        expect(templates[0]).toBeUndefined();
        internalField._getStateTemplate = originalGetStateTemplate;
        harness.document.destroy();
    });
    it('resolves a normal appearance stored through a base stream dictionary and assigns its reference', () => {
        // Arrange
        const harness: {
            document: PdfDocument; page: PdfPage; field: PdfCheckBoxField;
            item: PdfStateItem
        } = createCheckBoxHarness();
        const stateTemplate: PdfTemplate = new PdfTemplate([0, 0, 20, 10], harness.field._crossReference);
        const stateStream: StreamWithDictionary = stateTemplate._content as StreamWithDictionary;
        stateStream.dictionary.update('BBox', [0, 0, 20, 10]);
        const stateReference: _PdfReference = harness.field._crossReference._getNextReference();
        harness.field._crossReference._cacheMap.set(stateReference, stateStream);
        const normalAppearance: _PdfDictionary = new _PdfDictionary(harness.field._crossReference);
        normalAppearance.update('Yes', stateReference);
        const appearanceContainer: PdfTemplate = new PdfTemplate([0, 0, 20, 10], harness.field._crossReference);
        const appearanceStream: StreamWithDictionary = appearanceContainer._content as StreamWithDictionary;
        appearanceStream.dictionary = normalAppearance;
        const appearance: _PdfDictionary = new _PdfDictionary(harness.field._crossReference);
        appearance.update('N', appearanceStream);
        harness.item._dictionary.update('AP', appearance);
        // Act
        const result: PdfTemplate = harness.field._getStateTemplate(_PdfCheckFieldState.checked, harness.item);
        // Assert
        expect(result).toBeDefined();
        expect(result._isExported).toBeTruthy();
        expect(stateStream.reference).toBe(stateReference);
        harness.document.destroy();
    });
    it('uses the configured default item and passes an empty matrix to the widget transformation', () => {
        // Arrange
        const harness: {
            document: PdfDocument; page: PdfPage; field: PdfCheckBoxField;
            item: PdfStateItem
        } = createCheckBoxHarness();
        harness.field._createItem({ x: 60, y: 20, width: 30, height: 15 });
        const secondItem: PdfStateItem = harness.field.itemAt(1);
        const originalTransformBBox: (bounds: { x: number; y: number; width: number; height: number },
            matrix: number[]) => number[] = secondItem._transformBBox;
        let receivedMatrix: number[];
        secondItem._transformBBox = (_bounds: { x: number; y: number; width: number; height: number },
            matrix: number[]): number[] => {
            receivedMatrix = matrix;
            return [0, 0, 30, 15];
        };
        const streamTemplate: PdfTemplate = new PdfTemplate(
            [0, 0, 20, 10], harness.field._crossReference
        );
        const stream: StreamWithDictionary = streamTemplate._content as StreamWithDictionary;
        stream.dictionary.update('Matrix', []);
        stream.dictionary.update('BBox', [0, 0, 30, 15]);
        const reference: _PdfReference = harness.field._crossReference._getNextReference();
        harness.field._crossReference._cacheMap.set(reference, stream);
        setStateAppearance(harness.field, 'Yes', stream, reference);
        harness.field._defaultIndex = 1;
        // Act
        const result: PdfTemplate = harness.field._getStateTemplate(
            _PdfCheckFieldState.checked, harness.field
        );
        // Assert
        expect(result).toBeDefined();
        expect(result._isExported).toBeTruthy();
        expect(receivedMatrix).toEqual([]);
        expect(result._size.width).toBe(30);
        expect(result._size.height).toBe(15);
        expect(secondItem.bounds.width).toBe(30);
        expect(secondItem.bounds.height).toBe(15);
        secondItem._transformBBox = originalTransformBBox;
        harness.document.destroy();
    });
    it('does not read matrix or bounds when the stream dictionary becomes undefined', () => {
        // Arrange
        const harness: {
            document: PdfDocument; page: PdfPage; field: PdfCheckBoxField;
            item: PdfStateItem
        } = createCheckBoxHarness();
        const streamTemplate: PdfTemplate = new PdfTemplate(
            [0, 0, 20, 10], harness.field._crossReference
        );
        const stream: StreamWithDictionary = streamTemplate._content as StreamWithDictionary;
        const validDictionary: _PdfDictionary = stream.dictionary;
        validDictionary.update('BBox', [0, 0, 20, 10]);
        let dictionaryReadCount: number = 0;
        Object.defineProperty(stream, 'dictionary', {
            configurable: true,
            get: (): _PdfDictionary => {
                dictionaryReadCount++;
                return dictionaryReadCount === 1 ? validDictionary : undefined;
            }
        });
        setStateAppearance(harness.item, 'Yes', stream);
        // Act
        const resolveTemplate: () => PdfTemplate = (): PdfTemplate =>
            harness.field._getStateTemplate(_PdfCheckFieldState.checked, harness.item);
        // Assert
        expect(resolveTemplate).not.toThrow();
        expect(dictionaryReadCount).toBe(3);
        Object.defineProperty(stream, 'dictionary', {
            configurable: true,
            writable: true,
            value: validDictionary
        });
        harness.document.destroy();
    });
    it('does not read matrix or bounds when the stream dictionary becomes null', () => {
        // Arrange
        const harness: {
            document: PdfDocument; page: PdfPage; field: PdfCheckBoxField;
            item: PdfStateItem
        } = createCheckBoxHarness();
        const streamTemplate: PdfTemplate = new PdfTemplate(
            [0, 0, 20, 10], harness.field._crossReference
        );
        const stream: StreamWithDictionary = streamTemplate._content as StreamWithDictionary;
        const validDictionary: _PdfDictionary = stream.dictionary;
        let dictionaryReadCount: number = 0;
        Object.defineProperty(stream, 'dictionary', {
            configurable: true,
            get: (): _PdfDictionary => {
                dictionaryReadCount++;
                return dictionaryReadCount === 1 ? validDictionary : null;
            }
        });
        setStateAppearance(harness.item, 'Yes', stream);
        // Act
        const resolveTemplate: () => PdfTemplate = (): PdfTemplate =>
            harness.field._getStateTemplate(_PdfCheckFieldState.checked, harness.item);
        // Assert
        expect(resolveTemplate).not.toThrow();
        expect(dictionaryReadCount).toBe(3);
        Object.defineProperty(stream, 'dictionary', {
            configurable: true,
            writable: true,
            value: validDictionary
        });
        harness.document.destroy();
    });
    it('returns the state template when the appearance stream has no bounds', () => {
        // Arrange
        const harness: {
            document: PdfDocument; page: PdfPage; field: PdfCheckBoxField;
            item: PdfStateItem
        } = createCheckBoxHarness();
        const streamTemplate: PdfTemplate = new PdfTemplate(
            [0, 0, 20, 10], harness.field._crossReference
        );
        const stream: StreamWithDictionary = streamTemplate._content as StreamWithDictionary;
        delete stream.dictionary._map.BBox;
        delete stream.dictionary._map.Matrix;
        setStateAppearance(harness.item, 'Yes', stream);
        // Act
        const result: PdfTemplate = harness.field._getStateTemplate(
            _PdfCheckFieldState.checked, harness.item
        );
        // Assert
        expect(result).toBeDefined();
        expect(result._isExported).toBeTruthy();
        expect(result._size).toBeUndefined();
        harness.document.destroy();
    });
    it('uses bounds when only the transformed width matches the widget width', () => {
        // Arrange
        const harness: {
            document: PdfDocument; page: PdfPage; field: PdfCheckBoxField;
            item: PdfStateItem
        } = createCheckBoxHarness();
        const originalGetTransformMatrix: (rect: number[], bounds: number[],
            matrix: number[]) => number[] = harness.item._getTransformMatrix;
        harness.item._getTransformMatrix = (_rect: number[], _bounds: number[],
            _matrix: number[]): number[] => [20, 0, 0, 99];
        const streamTemplate: PdfTemplate = new PdfTemplate(
            [0, 0, 40, 30], harness.field._crossReference
        );
        const stream: StreamWithDictionary = streamTemplate._content as StreamWithDictionary;
        stream.dictionary.update('BBox', [0, 0, 40, 30]);
        delete stream.dictionary._map.Matrix;
        setStateAppearance(harness.item, 'Yes', stream);

        // Act
        const result: PdfTemplate = harness.field._getStateTemplate(
            _PdfCheckFieldState.checked, harness.item
        );

        // Assert
        expect(result).toBeDefined();
        expect(result._size.width).toBe(40);
        expect(result._size.height).toBe(30);
        expect(stream.dictionary.getArray('Matrix')).toEqual([1, 0, 0, 1, -0, -0]);
        harness.item._getTransformMatrix = originalGetTransformMatrix;
        harness.document.destroy();
    });

    it('uses bounds when only the transformed height matches the widget height', () => {
        // Arrange
        const harness: {
            document: PdfDocument; page: PdfPage; field: PdfCheckBoxField;
            item: PdfStateItem
        } = createCheckBoxHarness();
        const originalGetTransformMatrix: (rect: number[], bounds: number[],
            matrix: number[]) => number[] = harness.item._getTransformMatrix;
        harness.item._getTransformMatrix = (_rect: number[], _bounds: number[],
            _matrix: number[]): number[] => [99, 0, 0, 10];
        const streamTemplate: PdfTemplate = new PdfTemplate(
            [0, 0, 40, 30], harness.field._crossReference
        );
        const stream: StreamWithDictionary = streamTemplate._content as StreamWithDictionary;
        stream.dictionary.update('BBox', [0, 0, 40, 30]);
        delete stream.dictionary._map.Matrix;
        setStateAppearance(harness.item, 'Yes', stream);

        // Act
        const result: PdfTemplate = harness.field._getStateTemplate(
            _PdfCheckFieldState.checked, harness.item
        );

        // Assert
        expect(result).toBeDefined();
        expect(result._size.width).toBe(40);
        expect(result._size.height).toBe(30);
        expect(stream.dictionary.getArray('Matrix')).toEqual([1, 0, 0, 1, -0, -0]);
        harness.item._getTransformMatrix = originalGetTransformMatrix;
        harness.document.destroy();
    });

});
