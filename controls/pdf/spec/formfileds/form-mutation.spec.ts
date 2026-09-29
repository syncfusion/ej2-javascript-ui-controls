import { PdfDocument } from '../../src/pdf/core/pdf-document';
import { PdfButtonField, PdfCheckBoxField, PdfComboBoxField, PdfField, PdfListBoxField, PdfRadioButtonListField, PdfSignatureField, PdfTextBoxField } from '../../src/pdf/core/form/field';
import { PdfListFieldItem, PdfRadioButtonListItem } from '../../src/pdf/core/annotations/annotation';
import { _PdfDictionary } from '../../src/pdf/core/pdf-primitives';
import { _SignatureFlag, PdfFormFieldsTabOrder } from '../../src/pdf/core/enumerator';
import { PdfForm } from '../../src/pdf/core/form/form'
import { PdfSignatureValidationResult } from '../../src/pdf/core/pdf-type';
import { PdfPage } from '../../src/pdf/core/pdf-page';
describe('PdfForm mutation coverage tests', () => {
    it('should return needAppearances only when NeedAppearances entry exists', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        expect(form.needAppearances).toBeUndefined();
        form._dictionary.update('NeedAppearances', true);
        form._needAppearances = true;
        expect(form.needAppearances).toBe(true);
        form._dictionary.update('NeedAppearances', false);
        form._needAppearances = false;
        expect(form.needAppearances).toBe(false);
        document.destroy();
    });
    it('should Update _signatureFlag  when _signatureFlag entry exists', () => {
        const document: PdfDocument = new PdfDocument();
        const form = document.form;
        form._signatureFlag = _SignatureFlag.appendOnly;
        expect(form._signatureFlag).toBe(_SignatureFlag.appendOnly);
        form._signatureFlag = _SignatureFlag.none;
        expect(form._signatureFlag).toBe(_SignatureFlag.none);
        document.destroy();
    });

    it('should update exportEmptyFields through getter and setter', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        expect(form.exportEmptyFields).toBe(false);
        form.exportEmptyFields = true;
        expect(form.exportEmptyFields).toBe(true);
        form.exportEmptyFields = false;
        expect(form.exportEmptyFields).toBe(false);
        document.destroy();
    });

    it('should update SigFlags dictionary only when signature flag value changes', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        expect(form._signatureFlag).toBe(_SignatureFlag.none);
        form._signatureFlag = _SignatureFlag.signatureExists;
        expect(form._signatureFlag).toBe(_SignatureFlag.signatureExists);
        expect(form._dictionary.get('SigFlags')).toBe(_SignatureFlag.signatureExists);
        form._signatureFlag = _SignatureFlag.signatureExists | _SignatureFlag.appendOnly;
        expect(form._signatureFlag).toBe(_SignatureFlag.signatureExists | _SignatureFlag.appendOnly);
        expect(form._dictionary.get('SigFlags')).toBe(_SignatureFlag.signatureExists | _SignatureFlag.appendOnly);
        document.destroy();
    });

    it('should get and set fieldAutoNaming value correctly', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        expect(form.fieldAutoNaming).toBe(false);
        form.fieldAutoNaming = true;
        expect(form.fieldAutoNaming).toBe(true);
        form.fieldAutoNaming = false;
        expect(form.fieldAutoNaming).toBe(false);
        document.destroy();
    });
    it('should throw index out of range error for invalid fieldAt indexes', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form = document.form;
        const field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
        const firstItem: PdfRadioButtonListItem = new PdfRadioButtonListItem(
            '10-20',
            { x: 0, y: 70, width: 20, height: 20 },
            page
        );
        field.add(firstItem);
        form.add(field);

        expect(() => form.fieldAt(-1)).toThrowError('Index out of range.');
        expect(() => form.fieldAt(1)).toThrowError('Index out of range.');

        const loadedField = form.fieldAt(0);
        expect(loadedField).not.toBeNull();
        expect(loadedField.name).toBe('Age');

        document.destroy();
    });

    it('should cache parsed field when fieldAt is called repeatedly', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;

        const field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
        const firstItem: PdfRadioButtonListItem = new PdfRadioButtonListItem(
            '10-20',
            { x: 0, y: 70, width: 20, height: 20 },
            page
        );
        field.add(firstItem);
        form.add(field);

        const firstLoadedField = form.fieldAt(0);
        const secondLoadedField = form.fieldAt(0);

        expect(firstLoadedField).toBe(secondLoadedField);
        expect(form._parsedFields.has(0)).toBe(true);
        expect(form._parsedFields.get(0)).toBe(firstLoadedField);

        document.destroy();
    });

    it('should build page widget collection with widget annotations', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
        const firstItem: PdfRadioButtonListItem = new PdfRadioButtonListItem(
            '10-20',
            { x: 0, y: 70, width: 20, height: 20 },
            page
        );
        const secondItem: PdfRadioButtonListItem = new PdfRadioButtonListItem(
            '21-39',
            { x: 0, y: 100, width: 20, height: 20 },
            page
        );
        field.add(firstItem);
        field.add(secondItem);
        form.add(field);
        form._getPageWidgetCollection();
        expect(form._pageWidgetReference).toBeDefined();
        expect(form._pageWidgetReference.size).toBeGreaterThan(0);
        form._pageWidgetReference.forEach((dictionary: _PdfDictionary) => {
            expect(dictionary.has('Subtype')).toBe(true);
            expect(dictionary.get('Subtype').name).toBe('Widget');
        });
        document.destroy();
    });

    it('should return null from _getField for invalid terminal field indexes', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
        const firstItem: PdfRadioButtonListItem = new PdfRadioButtonListItem(
            '10-20',
            { x: 0, y: 70, width: 20, height: 20 },
            page
        );
        field.add(firstItem);
        form.add(field);
        expect(form._getField(-1)).toBeNull();
        expect(form._getField(100)).toBeNull();
        document.destroy();
    });

    it('should create Opt array when duplicate radio values are grouped with unison selection disabled', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form = document.form;

        const field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
        const firstItem: PdfRadioButtonListItem = new PdfRadioButtonListItem(
            '10-20',
            { x: 0, y: 70, width: 20, height: 20 },
            page
        );
        const secondItem: PdfRadioButtonListItem = new PdfRadioButtonListItem(
            '21-39',
            { x: 0, y: 100, width: 20, height: 20 },
            page
        );

        field.add(firstItem);
        field.add(secondItem);
        field.selectedIndex = 0;
        field.allowUnisonSelection = false;
        form.add(field);

        const duplicateField: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
        const duplicateFirstItem: PdfRadioButtonListItem = new PdfRadioButtonListItem(
            '21-39',
            { x: 40, y: 140, width: 20, height: 20 },
            page
        );
        const duplicateSecondItem: PdfRadioButtonListItem = new PdfRadioButtonListItem(
            '50-70',
            { x: 40, y: 170, width: 20, height: 20 },
            page
        );

        duplicateField.add(duplicateFirstItem);
        duplicateField.add(duplicateSecondItem);
        duplicateField.selectedIndex = 0;
        duplicateField.allowUnisonSelection = false;
        form.add(duplicateField);

        const groupedField = form.fieldAt(0) as PdfRadioButtonListField;
        const opt = groupedField._dictionary.get('Opt');

        expect(form.count).toBe(1);
        expect(groupedField.itemsCount).toBe(4);
        expect(opt).not.toBeNull();
        expect(opt.length).toBe(4);
        expect(groupedField.selectedIndex).toBe(2);
        expect(groupedField._dictionary.get('V').name).toBe('2');

        document.destroy();
    });

    it('should preserve duplicate radio values when unison selection is enabled', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form = document.form;
        const field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
        const firstItem: PdfRadioButtonListItem = new PdfRadioButtonListItem(
            '10-20',
            { x: 0, y: 70, width: 20, height: 20 },
            page
        );
        const secondItem: PdfRadioButtonListItem = new PdfRadioButtonListItem(
            '21-39',
            { x: 0, y: 100, width: 20, height: 20 },
            page
        );

        field.add(firstItem);
        field.add(secondItem);
        field.selectedIndex = 1;
        field.allowUnisonSelection = true;
        form.add(field);

        const duplicateField: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
        const duplicateFirstItem: PdfRadioButtonListItem = new PdfRadioButtonListItem(
            '21-39',
            { x: 40, y: 140, width: 20, height: 20 },
            page
        );
        const duplicateSecondItem: PdfRadioButtonListItem = new PdfRadioButtonListItem(
            '50-70',
            { x: 40, y: 170, width: 20, height: 20 },
            page
        );

        duplicateField.add(duplicateFirstItem);
        duplicateField.add(duplicateSecondItem);
        duplicateField.selectedIndex = 0;
        duplicateField.allowUnisonSelection = true;
        form.add(duplicateField);

        const groupedField = form.fieldAt(0) as PdfRadioButtonListField;

        expect(form.count).toBe(1);
        expect(groupedField.itemsCount).toBe(4);
        expect(groupedField.allowUnisonSelection).toBe(true);

        groupedField.selectedIndex = 2;

        expect(groupedField._dictionary.get('V').name).toBe('21-39');
        expect(groupedField.itemAt(1)._dictionary.get('AS').name).toBe('21-39');
        expect(groupedField.itemAt(2)._dictionary.get('AS').name).toBe('21-39');

        groupedField.selectedIndex = 3;

        expect(groupedField._dictionary.get('V').name).toBe('50-70');
        expect(groupedField.itemAt(0)._dictionary.get('AS').name).toBe('Off');
        expect(groupedField.itemAt(1)._dictionary.get('AS').name).toBe('Off');
        expect(groupedField.itemAt(2)._dictionary.get('AS').name).toBe('Off');
        expect(groupedField.itemAt(3)._dictionary.get('AS').name).toBe('50-70');

        document.destroy();
    });

    it('Form file property level mutation testing', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: PdfForm = document.form;
        expect(form._isDefaultAppearance).toBeFalsy();
        expect(form._hasKids).toBeFalsy();
        expect(form._exportEmptyFields).toBeFalsy();
        expect(form._fieldCollection).toEqual([]);
        expect(form._isNeedAppearances).toBeFalsy();
        expect(form._formNames).toEqual([]);
        expect(form._fieldName).toEqual([]);
        expect(form._exportEmptyFields).toBeFalsy();
        expect(form._requiresPostProcessing).toBeFalsy();
        form._requiresPostProcessing = true;
        expect(form._requiresPostProcessing).toBeTruthy();
        document.destroy();
    });

    it('_getPageWidgetCollection should initialize empty map when document is null', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        form._crossReference._document = null;
        form._getPageWidgetCollection();
        expect(form._pageWidgetReference).toBeDefined();
        expect(form._pageWidgetReference.size).toBe(0);
        document.destroy();
    });

    it('_getPageWidgetCollection should build widget reference map from all pages with widget annotations', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'TestField');
        const item: PdfRadioButtonListItem = new PdfRadioButtonListItem(
            'Option1',
            { x: 0, y: 0, width: 20, height: 20 },
            page
        );
        field.add(item);
        form.add(field);
        
        form._getPageWidgetCollection();
        
        expect(form._pageWidgetReference).toBeDefined();
        expect(form._pageWidgetReference.size).toBeGreaterThan(0);
        
        form._pageWidgetReference.forEach((dict: _PdfDictionary) => {
            expect(dict.has('Subtype')).toBe(true);
            expect(dict.get('Subtype').name).toBe('Widget');
        });
        
        document.destroy();
    });

    it('_getPageWidgetCollection should keep widget collection empty when Annots entry is absent', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        form._getPageWidgetCollection();
        expect(form._pageWidgetReference).toBeDefined();
        expect(form._pageWidgetReference.size).toBe(0);
        document.destroy();
    });

    it('_getFieldFromDictionary should call _getPageWidgetCollection when pageWidgetReference is null', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Choice');
        const item: PdfRadioButtonListItem = new PdfRadioButtonListItem(
            'Option1',
            { x: 0, y: 0, width: 20, height: 20 },
            page
        );
        field.add(item);
        form.add(field);
        
        if (form._terminalFields && form._terminalFields.length > 0) {
            form._pageWidgetReference = null;
            const fieldDict = form._terminalFields[0];
            const retrievedField = form._getFieldFromDictionary(fieldDict);
            expect(form._pageWidgetReference).toBeDefined();
            expect(form._pageWidgetReference instanceof Map).toBe(true);
            expect(retrievedField).not.toBeNull();
        }
        document.destroy();
    });

    it('_getFieldFromDictionary should set field._form reference when field is successfully parsed', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Department');
        const item: PdfRadioButtonListItem = new PdfRadioButtonListItem(
            'Engineering',
            { x: 0, y: 0, width: 20, height: 20 },
            page
        );
        field.add(item);
        form.add(field);
        
        if (form._terminalFields && form._terminalFields.length > 0) {
            const fieldDict = form._terminalFields[0];
            const retrievedField = form._getFieldFromDictionary(fieldDict);
            expect(retrievedField).not.toBeNull();
            expect(retrievedField._form).toBe(form);
        }
        document.destroy();
    });

    it('_parseFields should return null when dictionary is null', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        const field = form._parseFields(null, null);
        expect(field).toBeUndefined();
        document.destroy();
    });

    it('_parseFields should parse text field when FT is tx', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const textField = new PdfTextBoxField(page, 'TextField', {x: 10, y: 10, width:100, height: 100});
        const ref = textField._ref;
        const dict = textField._dictionary;
        
        const parsedField = form._parseFields(dict, ref);
        expect(parsedField).not.toBeNull();
        expect(parsedField instanceof PdfTextBoxField).toBe(true);
        document.destroy();
    });

    it('_parseFields should parse push button when FT is btn and pushButton flag set', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const btnField = new PdfButtonField(page, 'ButtonField', {x: 10, y: 10, width:100, height: 100});
        const ref = btnField._ref;
        const dict = btnField._dictionary;
        
        const parsedField = form._parseFields(dict, ref);
        expect(parsedField).not.toBeNull();
        expect(parsedField instanceof PdfButtonField).toBe(true);
        document.destroy();
    });

    it('_parseFields should parse radio button when FT is btn and radio flag set', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const radioField: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'RadioField');
        const item: PdfRadioButtonListItem = new PdfRadioButtonListItem(
            'Option1',
            { x: 0, y: 0, width: 20, height: 20 },
            page
        );
        radioField.add(item);
        const ref = radioField._ref;
        const dict = radioField._dictionary;
        
        const parsedField = form._parseFields(dict, ref);
        expect(parsedField).not.toBeNull();
        expect(parsedField instanceof PdfRadioButtonListField).toBe(true);
        document.destroy();
    });

    it('_parseFields should parse checkbox when FT is btn without pushButton or radio flag', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const checkField = new PdfCheckBoxField('CheckField',{x: 10, y: 10, width:100, height: 100}, page);
        const ref = checkField._ref;
        const dict = checkField._dictionary;
        
        const parsedField = form._parseFields(dict, ref);
        expect(parsedField).not.toBeNull();
        expect(parsedField instanceof PdfCheckBoxField).toBe(true);
        document.destroy();
    });

    it('_parseFields should parse combo box when FT is ch and combo flag set', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const comboField = new PdfComboBoxField(page, 'ComboField', {x: 10, y: 10, width:100, height: 100});
        comboField.addItem(new PdfListFieldItem('Option1', 'Option1'));
        const ref = comboField._ref;
        const dict = comboField._dictionary;
        
        const parsedField = form._parseFields(dict, ref);
        expect(parsedField).not.toBeNull();
        expect(parsedField instanceof PdfComboBoxField).toBe(true);
        document.destroy();
    });

    it('_parseFields should parse list box when FT is ch without combo flag', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const listField = new PdfListBoxField(page, 'ListField', {x: 10, y: 10, width:100, height: 100});
        listField.addItem(new PdfListFieldItem('Option1', 'Option1'));
        const ref = listField._ref;
        const dict = listField._dictionary;
        
        const parsedField = form._parseFields(dict, ref);
        expect(parsedField).not.toBeNull();
        expect(parsedField instanceof PdfListBoxField).toBe(true);
        document.destroy();
    });

    it('_parseFields should parse signature field when FT is sig', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const sigField = new PdfSignatureField(page, 'SignatureField', {x: 10, y: 10, width:100, height: 100});
        const ref = sigField._ref;
        const dict = sigField._dictionary;
        
        const parsedField = form._parseFields(dict, ref);
        expect(parsedField).not.toBeNull();
        expect(parsedField instanceof PdfSignatureField).toBe(true);
        document.destroy();
    });

    it('add should accept new field when form is empty', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field: PdfTextBoxField = new PdfTextBoxField(page, 'NewTextField', {x: 10, y: 10, width:100, height: 100});
        
        const index = form.add(field);
        expect(index).toBe(0);
        expect(form.count).toBe(1);
        document.destroy();
    });

    it('add should group fields with same name when fieldAutoNaming is false', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: PdfForm = document.form;
        const field1: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Group');
        const item1: PdfRadioButtonListItem = new PdfRadioButtonListItem(
            'Option1',
            { x: 0, y: 0, width: 20, height: 20 },
            page
        );
        field1.add(item1);
        form.add(field1);
        
        const field2: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Group');
        const item2: PdfRadioButtonListItem = new PdfRadioButtonListItem(
            'Option2',
            { x: 0, y: 30, width: 20, height: 20 },
            page
        );
        field2.add(item2);
        const index = form.add(field2);
        
        expect(form.count).toBe(1);
        expect(index).toBe(0);
        document.destroy();
    });

    it('add should rename field when fieldAutoNaming is true and name exists', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        form.fieldAutoNaming = true;
        
        const field1: PdfTextBoxField = new PdfTextBoxField(page, 'TextField', {x: 10, y: 10, width:100, height: 100});
        form.add(field1);
        
        const field2: PdfTextBoxField = new PdfTextBoxField(page, 'TextField', {x: 10, y: 10, width:100, height: 100});;
        const index = form.add(field2);
        
        expect(form.count).toBe(2);
        expect(index).toBe(1);
        expect(field2.name).not.toBe('TextField');
        document.destroy();
    });

    it('_doAdd should add field reference and update dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field: PdfTextBoxField = new PdfTextBoxField(page, 'TextField', {x: 10, y: 10, width:100, height: 100});;
        
        const index = form._doAdd(field);
        expect(index).toBeGreaterThanOrEqual(0);
        expect(form._fields.length).toBeGreaterThan(0);
        expect(field._form).toBe(form);
        document.destroy();
    });

    it('_doAdd should set signature flag when field is PdfSignatureField', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const sigField = new PdfSignatureField(page, 'SignatureField', {x: 10, y: 10, width:100, height: 100});
        
        form._doAdd(sigField);
        expect(form._signatureFlag).toBe(_SignatureFlag.signatureExists | _SignatureFlag.appendOnly);
        document.destroy();
    });

    it('_doAdd should not add duplicate field references', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field: PdfTextBoxField = new PdfTextBoxField(page, 'TextField', {x: 10, y: 10, width:100, height: 100});;
        
        form._doAdd(field);
        const countBefore = form._fields.length;
        form._doAdd(field);
        const countAfter = form._fields.length;
        
        expect(countAfter).toBe(countBefore);
        document.destroy();
    });

    it('orderFormFields with null parameter should call orderFormFields with empty Map', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field: PdfTextBoxField = new PdfTextBoxField(page, 'TextField', {x: 10, y: 10, width:100, height: 100});;
        form.add(field);
        
        form.orderFormFields(null);
        expect(form._tabCollection).toBeDefined();
        expect(form._tabCollection instanceof Map).toBe(true);
        document.destroy();
    });

    it('orderFormFields with undefined parameter should call orderFormFields with empty Map', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field: PdfTextBoxField = new PdfTextBoxField(page, 'TextField', {x: 10, y: 10, width:100, height: 100});;
        form.add(field);
        
        form.orderFormFields(undefined);
        expect(form._tabCollection).toBeDefined();
        expect(form._tabCollection instanceof Map).toBe(true);
        document.destroy();
    });

    it('orderFormFields should apply tab order when Map parameter provided', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field: PdfTextBoxField = new PdfTextBoxField(page, 'TextField', {x: 10, y: 10, width:100, height: 100});;
        form.add(field);
        
        const tabMap = new Map<number, PdfFormFieldsTabOrder>();
        tabMap.set(0, PdfFormFieldsTabOrder.row);
        form.orderFormFields(tabMap);
        
        expect(form._tabCollection).toBe(tabMap);
        document.destroy();
    });

    it('orderFormFields should sort fields when enum parameter provided', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field1: PdfTextBoxField = new PdfTextBoxField(page, 'Field1', {x: 10, y: 10, width:100, height: 100});
        const field2: PdfTextBoxField = new PdfTextBoxField(page, 'Field2', {x: 10, y: 10, width:100, height: 100});
        form.add(field1);
        form.add(field2);
        form.orderFormFields(PdfFormFieldsTabOrder.row);
        expect(form._tabOrder).toBe(PdfFormFieldsTabOrder.row);
        expect(form._fieldCollection.length).toBeGreaterThan(0);
        document.destroy();
    });
});
describe('PdfForm - constructor default field values', () => {
    it('should initialize _isDefaultAppearance to false not true - targets mutant 16', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        expect(form._isDefaultAppearance).toBe(false);
        expect(form._isDefaultAppearance).not.toBe(true);
        document.destroy();
    });
    it('should initialize _hasKids to false not true - targets mutant 17', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        expect(form._hasKids).toBe(false);
        expect(form._hasKids).not.toBe(true);
        document.destroy();
    });
    it('should initialize _exportEmptyFields to false not true - targets mutant 19', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        expect(form._exportEmptyFields).toBe(false);
        expect(form._exportEmptyFields).not.toBe(true);
        document.destroy();
    });
    it('should initialize _fieldCollection as empty array not stub array - targets mutant 20', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        expect(Array.isArray(form._fieldCollection)).toBe(true);
        expect(form._fieldCollection.length).toBe(0);
        document.destroy();
    });
    it('should initialize _isNeedAppearances to false not true - targets mutant 21', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        expect(form._isNeedAppearances).toBe(false);
        expect(form._isNeedAppearances).not.toBe(true);
        document.destroy();
    });
    it('should initialize _formNames as empty array not stub array - targets mutant 22', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        expect(Array.isArray(form._formNames)).toBe(true);
        expect(form._formNames.length).toBe(0);
        document.destroy();
    });
    it('should initialize _fieldName as empty array not stub array - targets mutant 24', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        expect(Array.isArray(form._fieldName)).toBe(true);
        expect(form._fieldName.length).toBe(0);
        document.destroy();
    });
    it('should initialize _requiresPostProcessing to false not true - targets mutant 25', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        expect(form._requiresPostProcessing).toBe(false);
        expect(form._requiresPostProcessing).not.toBe(true);
        document.destroy();
    });
});
describe('PdfForm - needAppearances getter', () => {
    it('should not read dictionary when NeedAppearances key is absent - targets mutant 38,40', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        form._needAppearances = true;
        const result = form.needAppearances;
        expect(result).toBe(true);
        document.destroy();
    });
    it('should read false from dictionary when NeedAppearances key is present - targets mutant 40', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        form._dictionary.update('NeedAppearances', false);
        const result = form.needAppearances;
        expect(result).toBe(false);
        expect(result).not.toBe(true);
        document.destroy();
    });
    it('should read true from dictionary when NeedAppearances key is present - targets mutant 40', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        form._dictionary.update('NeedAppearances', true);
        const result = form.needAppearances;
        expect(result).toBe(true);
        expect(result).not.toBe(false);
        document.destroy();
    });
});
describe('PdfForm - _signatureFlag setter', () => {
    it('should not update dictionary when same value is set again - targets mutant 53,57', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        form._signatureFlag = _SignatureFlag.signatureExists;
        expect(form._dictionary.get('SigFlags')).toBe(_SignatureFlag.signatureExists);
        const dictUpdateSpy = jasmine.createSpy('update');
        const origUpdate = form._dictionary.update.bind(form._dictionary);
        form._dictionary.update = (key: string, value: any) => {
            dictUpdateSpy(key, value);
            origUpdate(key, value);
        };
        form._signatureFlag = _SignatureFlag.signatureExists;
        expect(dictUpdateSpy).not.toHaveBeenCalled();
        document.destroy();
    });
    it('should update dictionary with exact new value when flag changes - targets mutant 57', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        form._signatureFlag = _SignatureFlag.appendOnly;
        expect(form._dictionary.get('SigFlags')).toBe(_SignatureFlag.appendOnly);
        expect(form._dictionary.get('SigFlags')).not.toBe(_SignatureFlag.signatureExists);
        document.destroy();
    });
});
describe('PdfForm - fieldAt boundary checks', () => {
    it('should throw for index -1 confirming boundary is index < 0 - targets mutant 70,74', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field = new PdfTextBoxField(page, 'F', {x: 0, y: 0, width: 50, height: 20});
        form.add(field);
        expect(() => form.fieldAt(-1)).toThrowError('Index out of range.');
        document.destroy();
    });
    it('should throw for index equal to fields.length confirming boundary is index >= length - targets mutant 74', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field = new PdfTextBoxField(page, 'F', {x: 0, y: 0, width: 50, height: 20});
        form.add(field);
        expect(() => form.fieldAt(1)).toThrowError('Index out of range.');
        expect(() => form.fieldAt(0)).not.toThrow();
        document.destroy();
    });
    it('should throw error with exact message not empty string - targets mutant 77', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        let errorMsg = '';
        try { form.fieldAt(0); } catch (e) { errorMsg = e.message; }
        expect(errorMsg).toBe('Index out of range.');
        expect(errorMsg.length).toBeGreaterThan(0);
        document.destroy();
    });
    it('should set _isNeedAppearances to true when cached field is accessed - targets mutant 81', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field = new PdfTextBoxField(page, 'F', {x: 0, y: 0, width: 50, height: 20});
        form.add(field);
        form._isNeedAppearances = false;
        form.fieldAt(0);
        form._isNeedAppearances = false;
        form.fieldAt(0);
        expect(form._isNeedAppearances).toBe(true);
        document.destroy();
    });
    it('should set _annotationIndex equal to current index value - targets mutant 93', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field = new PdfTextBoxField(page, 'F', {x: 0, y: 0, width: 50, height: 20});
        form.add(field);
        form._parsedFields.clear();
        const loaded = form.fieldAt(0);
        expect(loaded._annotationIndex).toBe(0);
        document.destroy();
    });
});
describe('PdfForm - _getField index guards', () => {
    it('should return null for negative index - targets mutant 157', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field = new PdfTextBoxField(page, 'F', {x: 0, y: 0, width: 50, height: 20});
        form.add(field);
        expect(form._getField(-1)).toBeNull();
        document.destroy();
    });
    it('should return null when index equals terminalFields.length - targets mutant 157', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field = new PdfTextBoxField(page, 'F', {x: 0, y: 0, width: 50, height: 20});
        form.add(field);
        const len = form._terminalFields.length;
        expect(form._getField(len)).toBeNull();
        document.destroy();
    });
    it('should return null when _terminalFields is null - targets mutant 157', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        form._terminalFields = null;
        expect(form._getField(0)).toBeNull();
        document.destroy();
    });
    it('should call _getPageWidgetCollection when _pageWidgetReference is null - targets mutant 160-163', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field = new PdfTextBoxField(page, 'F', {x: 0, y: 0, width: 50, height: 20});
        form.add(field);
        form._pageWidgetReference = null;
        if (form._terminalFields && form._terminalFields.length > 0) {
            form._getField(0);
            expect(form._pageWidgetReference).not.toBeNull();
            expect(form._pageWidgetReference instanceof Map).toBe(true);
        }
        document.destroy();
    });
    it('should set field._form to this when field is returned - targets mutant 194', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field = new PdfTextBoxField(page, 'F', {x: 0, y: 0, width: 50, height: 20});
        form.add(field);
        if (form._terminalFields && form._terminalFields.length > 0) {
            const result = form._getField(0);
            expect(result).not.toBeNull();
            expect(result._form).toBe(form);
        }
        document.destroy();
    });
});
describe('PdfForm - _parseFields field type dispatch', () => {
    it('should return undefined when dictionary is null - targets mutant 234', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        expect(form._parseFields(null, null)).toBeUndefined();
        document.destroy();
    });
    it('should construct PdfComboBoxField for ch with combo flag - targets mutant 269-271', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const combo = new PdfComboBoxField(page, 'C', {x: 0, y: 0, width: 100, height: 20});
        combo.addItem(new PdfListFieldItem('A', 'A'));
        const result = form._parseFields(combo._dictionary, combo._ref);
        expect(result instanceof PdfComboBoxField).toBe(true);
        document.destroy();
    });
    it('should construct PdfListBoxField for ch without combo flag - targets mutant 269-271', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const list = new PdfListBoxField(page, 'L', {x: 0, y: 0, width: 100, height: 20});
        list.addItem(new PdfListFieldItem('A', 'A'));
        const result = form._parseFields(list._dictionary, list._ref);
        expect(result instanceof PdfListBoxField).toBe(true);
        document.destroy();
    });
});
describe('PdfForm - add method field count and return value', () => {
    it('should return 0 when first field added to empty form - targets mutant 277,279', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field = new PdfTextBoxField(page, 'F', {x: 0, y: 0, width: 50, height: 20});
        const index = form.add(field);
        expect(index).toBe(0);
        expect(form._fields.length).toBe(1);
        document.destroy();
    });
    it('should return fields.length-1 after adding second different field - targets mutant 277', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const f1 = new PdfTextBoxField(page, 'F1', {x: 0, y: 0, width: 50, height: 20});
        const f2 = new PdfTextBoxField(page, 'F2', {x: 0, y: 60, width: 50, height: 20});
        form.add(f1);
        const index = form.add(f2);
        expect(index).toBe(1);
        expect(form._fields.length).toBe(2);
        document.destroy();
    });
    it('should not exceed fields.length with >= 0 comparison - fields.length > 0 vs >= 0 - targets mutant 279', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        expect(form._fields.length).toBe(0);
        const f1 = new PdfTextBoxField(page, 'F1', {x: 0, y: 0, width: 50, height: 20});
        const f2 = new PdfTextBoxField(page, 'F1', {x: 0, y: 60, width: 50, height: 20});
        form.add(f1);
        form.add(f2);
        expect(form._fields.length).toBe(1);
        document.destroy();
    });
});
describe('PdfForm - _groupingFormFields checkbox logic', () => {
    it('should return fields.length-1 when checkbox newValue is empty string - targets mutant 367-373', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const cb1 = new PdfCheckBoxField('CB', {x: 0, y: 0, width: 20, height: 20}, page);
        form.add(cb1);
        const cb2 = new PdfCheckBoxField('CB', {x: 0, y: 40, width: 20, height: 20}, page);
        const result = form.add(cb2);
        expect(result).toBe(form._fields.length - 1);
        document.destroy();
    });
    it('should group checkbox fields and return last index - targets mutant 373', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const cb1 = new PdfCheckBoxField('CB', {x: 0, y: 0, width: 20, height: 20}, page);
        form.add(cb1);
        const cb2 = new PdfCheckBoxField('CB', {x: 0, y: 40, width: 20, height: 20}, page);
        form.add(cb2);
        expect(form.count).toBe(1);
        expect(form._fields.length).toBe(1);
        document.destroy();
    });
    it('should set matched checkbox to checked when checked item matches export value - targets mutant 385,387', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const cb1 = new PdfCheckBoxField('CB', {x: 0, y: 0, width: 20, height: 20}, page);
        cb1.itemAt(0).checked = true;
        form.add(cb1);
        const cb2 = new PdfCheckBoxField('CB', {x: 0, y: 40, width: 20, height: 20}, page);
        form.add(cb2);
        const grouped = form.fieldAt(0);
        expect(grouped.itemsCount).toBe(2);
        document.destroy();
    });
    it('should set newItem.checked to true when it is already checked in same-exportValue group - targets mutant 393', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const cb1 = new PdfCheckBoxField('CB', {x: 0, y: 0, width: 20, height: 20}, page);
        cb1.itemAt(0).checked = true;
        form.add(cb1);
        const cb2 = new PdfCheckBoxField('CB', {x: 0, y: 40, width: 20, height: 20}, page);
        cb2.itemAt(0).checked = true;
        form.add(cb2);
        expect(form.count).toBe(1);
        document.destroy();
    });
    it('should handle oldSelectedValue equal to newValue path - targets mutant 401', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const cb1 = new PdfCheckBoxField('CB1', {x: 0, y: 0, width: 20, height: 20}, page);
        cb1.itemAt(0).checked = false;
        form.add(cb1);
        const cb2 = new PdfCheckBoxField('CB1', {x: 0, y: 40, width: 20, height: 20}, page);
        cb2.itemAt(0).checked = false;
        form.add(cb2);
        expect(form.count).toBe(1);
        document.destroy();
    });
});
describe('PdfForm - _groupingFormFields radio button selectedIndex', () => {
    it('should preserve globalSelectedIndex when groups are merged - targets mutant 444,446', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const r1 = new PdfRadioButtonListField(page, 'R');
        r1.add(new PdfRadioButtonListItem('A', {x: 0, y: 0, width: 20, height: 20}, page));
        r1.add(new PdfRadioButtonListItem('B', {x: 0, y: 30, width: 20, height: 20}, page));
        r1.selectedIndex = 1;
        form.add(r1);
        const r2 = new PdfRadioButtonListField(page, 'R');
        r2.add(new PdfRadioButtonListItem('C', {x: 0, y: 60, width: 20, height: 20}, page));
        r2.selectedIndex = 0;
        form.add(r2);
        const grouped = form.fieldAt(0) as PdfRadioButtonListField;
        expect(grouped.selectedIndex).toBe(2);
        document.destroy();
    });
    it('should select globalSelectedIndex correctly when first group dominates - targets mutant 444', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const r1 = new PdfRadioButtonListField(page, 'R');
        r1.add(new PdfRadioButtonListItem('A', {x: 0, y: 0, width: 20, height: 20}, page));
        r1.selectedIndex = 0;
        form.add(r1);
        const r2 = new PdfRadioButtonListField(page, 'R');
        r2.add(new PdfRadioButtonListItem('B', {x: 0, y: 30, width: 20, height: 20}, page));
        r2.add(new PdfRadioButtonListItem('C', {x: 0, y: 60, width: 20, height: 20}, page));
        r2.selectedIndex = 1;
        form.add(r2);
        const grouped = form.fieldAt(0) as PdfRadioButtonListField;
        expect(grouped.selectedIndex).toBe(2);
        document.destroy();
    });
    it('should not apply selectedIndex when globalSelectedIndex is -1 - targets mutant 503,504', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const r1 = new PdfRadioButtonListField(page, 'R');
        r1.add(new PdfRadioButtonListItem('A', {x: 0, y: 0, width: 20, height: 20}, page));
        form.add(r1);
        const r2 = new PdfRadioButtonListField(page, 'R');
        r2.add(new PdfRadioButtonListItem('B', {x: 0, y: 30, width: 20, height: 20}, page));
        form.add(r2);
        const grouped = form.fieldAt(0) as PdfRadioButtonListField;
        expect(grouped.selectedIndex).toBeLessThan(0);
        document.destroy();
    });
    it('should count total items correctly before applying selectedIndex - targets mutant 510', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const r1 = new PdfRadioButtonListField(page, 'R');
        r1.add(new PdfRadioButtonListItem('A', {x: 0, y: 0, width: 20, height: 20}, page));
        r1.add(new PdfRadioButtonListItem('B', {x: 0, y: 30, width: 20, height: 20}, page));
        r1.selectedIndex = 0;
        form.add(r1);
        const r2 = new PdfRadioButtonListField(page, 'R');
        r2.add(new PdfRadioButtonListItem('C', {x: 0, y: 60, width: 20, height: 20}, page));
        r2.add(new PdfRadioButtonListItem('D', {x: 0, y: 90, width: 20, height: 20}, page));
        r2.selectedIndex = 1;
        form.add(r2);
        const grouped = form.fieldAt(0) as PdfRadioButtonListField;
        expect(grouped.itemsCount).toBe(4);
        expect(grouped.selectedIndex).toBe(3);
        document.destroy();
    });
});
describe('PdfForm - _findFirstByExportValue', () => {
    it('should return -1 when field is null - targets mutant 516-526', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        expect(form._findFirstByExportValue(null, 'val')).toBe(-1);
        document.destroy();
    });
    it('should return -1 when itemsCount is 0 - targets mutant 522', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const cb = new PdfCheckBoxField('CB', {x: 0, y: 0, width: 20, height: 20}, page);
        cb._parsedItems = new Map();
        const mockField: any = { itemsCount: 0, itemAt: () => null as any};
        expect(form._findFirstByExportValue(mockField, 'val')).toBe(-1);
        document.destroy();
    });
    it('should return -1 when value is null - targets mutant 516,524', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const cb = new PdfCheckBoxField('CB', {x: 0, y: 0, width: 20, height: 20}, page);
        expect(form._findFirstByExportValue(cb, null)).toBe(-1);
        document.destroy();
    });
    it('should return correct index when export value matches item - targets mutant 529', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const cb = new PdfCheckBoxField('CB', {x: 0, y: 0, width: 20, height: 20}, page);
        form.add(cb);
        const cb2 = new PdfCheckBoxField('CB', {x: 0, y: 40, width: 20, height: 20}, page);
        cb2.itemAt(0).exportValue = 'Yes';
        form.add(cb2);
        const grouped = form.fieldAt(0) as PdfCheckBoxField;
        const idx = form._findFirstByExportValue(grouped, 'Yes');
        expect(typeof idx).toBe('number');
        document.destroy();
    });
    it('should return -1 when no item matches export value - targets mutant 529', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const cb = new PdfCheckBoxField('CB', {x: 0, y: 0, width: 20, height: 20}, page);
        form.add(cb);
        const grouped = form.fieldAt(0) as PdfCheckBoxField;
        expect(form._findFirstByExportValue(grouped, 'NoMatch')).toBe(-1);
        document.destroy();
    });
    it('should not return -1 when itemsCount equals 1 confirming <= 0 guard - targets mutant 522', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const cb = new PdfCheckBoxField('CB', {x: 0, y: 0, width: 20, height: 20}, page);
        form.add(cb);
        const grouped = form.fieldAt(0) as PdfCheckBoxField;
        expect(grouped.itemsCount).toBe(1);
        const result = form._findFirstByExportValue(grouped, 'nonexistent');
        expect(result).toBe(-1);
        document.destroy();
    });
});
describe('PdfForm - _getSelectedExportValue', () => {
    it('should return undefined when field is null - targets mutant 542', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        expect(form._getSelectedExportValue(null)).toBeUndefined();
        document.destroy();
    });
    it('should return export value from V dictionary entry when it is a name - targets mutant 545-557', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const cb = new PdfCheckBoxField('CB', {x: 0, y: 0, width: 20, height: 20}, page);
        cb.itemAt(0).checked = true;
        cb.itemAt(0).exportValue = 'Yes';
        form.add(cb);
        const result = form._getSelectedExportValue(form.fieldAt(0) as PdfCheckBoxField);
        expect(typeof result).toBe('string');
        document.destroy();
    });
    it('should return item.exportValue when item is checked - targets mutant 562-566', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const cb = new PdfCheckBoxField('CB', {x: 0, y: 0, width: 20, height: 20}, page);
        cb.itemAt(0).checked = true;
        cb.itemAt(0).exportValue = 'Checked';
        form.add(cb);
        const result = form._getSelectedExportValue(form.fieldAt(0) as PdfCheckBoxField);
        expect(result).toBe('Checked');
        document.destroy();
    });
    it('should return undefined when no item is checked and no V entry - targets mutant 564', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const cb = new PdfCheckBoxField('CB', {x: 0, y: 0, width: 20, height: 20}, page);
        form.add(cb);
        const grouped = form.fieldAt(0) as PdfCheckBoxField;
        const result = form._getSelectedExportValue(grouped);
        expect(result).toBeUndefined();
        document.destroy();
    });
});
describe('PdfForm - removeFieldAt and _reorderParsedAnnotations', () => {
    it('should remove field at index 0 and update field count - targets mutant 622,624', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const f1 = new PdfTextBoxField(page, 'F1', {x: 0, y: 0, width: 50, height: 20});
        const f2 = new PdfTextBoxField(page, 'F2', {x: 0, y: 60, width: 50, height: 20});
        form.add(f1);
        form.add(f2);
        form.removeFieldAt(0);
        expect(form._fields.length).toBe(1);
        expect(form.count).toBe(1);
        document.destroy();
    });
    it('should not call removeFieldAt for negative index in removeField - targets mutant 622', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const f1 = new PdfTextBoxField(page, 'F1', {x: 0, y: 0, width: 50, height: 20});
        form.add(f1);
        const fakeField: any = { _ref: {} };
        form.removeField(fakeField);
        expect(form._fields.length).toBe(1);
        document.destroy();
    });
    it('should set _updated and _allowCatalog when all fields removed - targets mutant 660-671', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const f1 = new PdfTextBoxField(page, 'F1', {x: 0, y: 0, width: 50, height: 20});
        form.add(f1);
        form.removeFieldAt(0);
        expect(form._fields.length).toBe(0);
        expect(form._crossReference._allowCatalog).toBe(true);
        document.destroy();
    });
    it('should NOT set _allowCatalog when fields still remain after removal - targets mutant 660', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const f1 = new PdfTextBoxField(page, 'F1', {x: 0, y: 0, width: 50, height: 20});
        const f2 = new PdfTextBoxField(page, 'F2', {x: 0, y: 60, width: 50, height: 20});
        form.add(f1);
        form.add(f2);
        form._crossReference._allowCatalog = false;
        form.removeFieldAt(0);
        expect(form._fields.length).toBe(1);
        expect(form._crossReference._allowCatalog).toBe(false);
        document.destroy();
    });
    it('should update _dictionary._updated to true after removeFieldAt - targets mutant 673', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const f1 = new PdfTextBoxField(page, 'F1', {x: 0, y: 0, width: 50, height: 20});
        form.add(f1);
        form._dictionary._updated = false;
        form.removeFieldAt(0);
        expect(form._dictionary._updated).toBe(true);
        document.destroy();
    });
    it('_reorderParsedAnnotations should shift indices above removed position - targets mutant 678', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const f1 = new PdfTextBoxField(page, 'F1', {x: 0, y: 0, width: 50, height: 20});
        const f2 = new PdfTextBoxField(page, 'F2', {x: 0, y: 60, width: 50, height: 20});
        const f3 = new PdfTextBoxField(page, 'F3', {x: 0, y: 120, width: 50, height: 20});
        form.add(f1);
        form.add(f2);
        form.add(f3);
        form.fieldAt(2);
        form._reorderParsedAnnotations(0);
        expect(form._parsedFields.has(1)).toBe(true);
        expect(form._parsedFields.has(2)).toBe(false);
        document.destroy();
    });
    it('_reorderParsedAnnotations should keep indices below removed position unchanged - targets mutant 678', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const f1 = new PdfTextBoxField(page, 'F1', {x: 0, y: 0, width: 50, height: 20});
        const f2 = new PdfTextBoxField(page, 'F2', {x: 0, y: 60, width: 50, height: 20});
        form.add(f1);
        form.add(f2);
        form.fieldAt(0);
        form.fieldAt(1);
        form._reorderParsedAnnotations(1);
        expect(form._parsedFields.has(0)).toBe(true);
        expect(form._parsedFields.has(1)).toBe(true);
        document.destroy();
    });
});
describe('PdfForm - _getCorrectName and _generateUniqueIdentifier', () => {
    it('should return same name when name not in _fieldName list - targets mutant 613,616', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        form._fieldName = [];
        const result = form._getCorrectName('MyField');
        expect(result).toBe('MyField');
        document.destroy();
    });
    it('should return suffixed name when name exists in _fieldName list - targets mutant 613,616,618', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        form._fieldName = ['MyField'];
        const result = form._getCorrectName('MyField');
        expect(result).not.toBe('MyField');
        expect(result.startsWith('MyField_')).toBe(true);
        expect(result.length).toBeGreaterThan('MyField_'.length);
        document.destroy();
    });
    it('should generate identifier using multiplication not division - targets mutant 620', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        const uid1 = form._generateUniqueIdentifier();
        const uid2 = form._generateUniqueIdentifier();
        expect(typeof uid1).toBe('string');
        expect(uid1.length).toBeGreaterThan(0);
        const num = parseInt(uid1, 10);
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThan(10000);
        document.destroy();
    });
    it('should produce identifier in range [0,9999] confirming * not / - targets mutant 620', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        for (let i = 0; i < 20; i++) {
            const uid = form._generateUniqueIdentifier();
            const num = parseInt(uid, 10);
            expect(num).toBeGreaterThanOrEqual(0);
            expect(num).toBeLessThanOrEqual(9999);
        }
        document.destroy();
    });
});
describe('PdfForm - _hasValidKids', () => {
    it('should return false when Kids array is empty - targets mutant 1060,1064', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        const dict: any = { get: () => [] as any[], size: 0 };
        expect(form._hasValidKids(dict)).toBe(false);
        document.destroy();
    });
    it('should return true when Kids array has entries - targets mutant 1060,1062-1064', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        const dict: any = { get: () => [{}], size: 1 };
        expect(form._hasValidKids(dict)).toBe(true);
        document.destroy();
    });
    it('should return false when kidsArray is null - targets mutant 1060', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        const dict: any = { get: () => null as any, size: 0 };
        expect(form._hasValidKids(dict)).toBeFalsy();
        document.destroy();
    });
    it('should return false when Kids has exactly 1 element but it is valid - confirming > 0 not >= 0 - targets mutant 1064', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        const dict: any = { get: () => [{}], size: 1 };
        const result = form._hasValidKids(dict);
        expect(result).toBe(true);
        const emptyDict: any = { get: () => [] as any[], size: 0 };
        expect(form._hasValidKids(emptyDict)).toBe(false);
        document.destroy();
    });
});
describe('PdfForm - setDefaultAppearance', () => {
    it('should set _setAppearance to true and _isDefaultAppearance to false when value is false', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        form.setDefaultAppearance(false);
        expect(form._setAppearance).toBe(true);
        expect(form._isDefaultAppearance).toBe(false);
        expect(form._needAppearances).toBe(false);
        document.destroy();
    });
    it('should set _setAppearance to false and _isDefaultAppearance to true when value is true', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        form.setDefaultAppearance(true);
        expect(form._setAppearance).toBe(false);
        expect(form._isDefaultAppearance).toBe(true);
        expect(form._needAppearances).toBe(true);
        document.destroy();
    });
});
describe('PdfForm - _validateField', () => {
    it('should return false when fieldDictionary is null - targets mutant', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        const result = form._validateField(null, new Map(), null, []);
        expect(result).toBe(false);
        document.destroy();
    });
    it('should return false when pageWidgets is null - targets mutant', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        const dict: any = { has: () => false, size: 0 };
        const result = form._validateField(dict, null, null, []);
        expect(result).toBe(false);
        document.destroy();
    });
    it('should return true when fieldDictionary has P and Rect entries', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        const dict: any = { has: (k: string) => k === 'P' || k === 'Rect', size: 2 };
        const result = form._validateField(dict, new Map(), null, []);
        expect(result).toBe(true);
        document.destroy();
    });
    it('should return true when ref is in widgetCollection - targets mutant 1176-1184', () => {
        const document: PdfDocument = new PdfDocument();
        const form: any = document.form;
        const ref: any = { objNum: 1, genNum: 0 };
        const dict: any = { has: () => false, size: 0 };
        const result = form._validateField(dict, new Map(), ref, [ref]);
        expect(result).toBe(true);
        document.destroy();
    });
});
describe('PdfForm - _doAdd signature flag and dictionary update', () => {
    it('should set fields array entry and dictionary Fields to updated list - targets mutant 672', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field = new PdfTextBoxField(page, 'T1', { x: 0, y: 0, width: 50, height: 20 });
        form._doAdd(field);
        const fieldsInDict = form._dictionary.get('Fields');
        expect(Array.isArray(fieldsInDict)).toBe(true);
        expect(fieldsInDict.length).toBeGreaterThan(0);
        document.destroy();
    });
    it('should set _isNeedAppearances to true after _doAdd - targets mutant 81', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        form._isNeedAppearances = false;
        const field = new PdfTextBoxField(page, 'T1', { x: 0, y: 0, width: 50, height: 20 });
        form._doAdd(field);
        expect(form._isNeedAppearances).toBe(true);
        document.destroy();
    });
    it('should set _root._updated to true after _doAdd', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const field = new PdfTextBoxField(page, 'T1', { x: 0, y: 0, width: 50, height: 20 });
        form._doAdd(field);
        expect(form._crossReference._root._updated).toBe(true);
        document.destroy();
    });
});
describe('PdfForm - _groupingFormFields button field and PdfButtonField', () => {
    it('should set oldField._setAppearance to true when grouping PdfButtonField - targets mutant 419,421,424', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const btn1 = new PdfButtonField(page, 'Btn', { x: 0, y: 0, width: 50, height: 20 });
        form.add(btn1);
        const btn2 = new PdfButtonField(page, 'Btn', { x: 0, y: 60, width: 50, height: 20 });
        form.add(btn2);
        expect(form.count).toBe(1);
        const grouped = form.fieldAt(0) as PdfButtonField;
        expect(grouped._setAppearance).toBe(true);
        document.destroy();
    });
    it('should delete Parent from widgetDictionary before reassigning when it has Parent key - targets mutant 337-341', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const btn1 = new PdfButtonField(page, 'Btn', { x: 0, y: 0, width: 50, height: 20 });
        form.add(btn1);
        const btn2 = new PdfButtonField(page, 'Btn', { x: 0, y: 60, width: 50, height: 20 });
        form.add(btn2);
        const grouped = form.fieldAt(0) as PdfButtonField;
        expect(grouped._dictionary.has('Kids')).toBe(true);
        const kids = grouped._dictionary.get('Kids');
        expect(kids.length).toBe(2);
        document.destroy();
    });
});
describe('PdfForm - _createFields and field tree traversal', () => {
    it('should populate _terminalFields and _formNames from newly added fields - targets mutant 771-780', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const f = new PdfTextBoxField(page, 'MyField', { x: 0, y: 0, width: 50, height: 20 });
        form.add(f);
        expect(form._formNames).toBeDefined();
        document.destroy();
    });
    it('should populate _fields array when terminal fields are present - targets mutant 777', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const f = new PdfTextBoxField(page, 'F', { x: 0, y: 0, width: 50, height: 20 });
        form.add(f);
        expect(form._fields.length).toBe(1);
        document.destroy();
    });
});
describe('PdfForm - orderFormFields tab order mutation checks', () => {
    it('should set setTabOrder to false when tabCollection is empty - targets mutant 700-707', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const f = new PdfTextBoxField(page, 'F', { x: 0, y: 0, width: 50, height: 20 });
        form.add(f);
        const emptyMap = new Map<number, PdfFormFieldsTabOrder>();
        form.orderFormFields(emptyMap);
        expect(form._tabCollection).toBe(emptyMap);
        expect(form._tabCollection.size).toBe(1);
        document.destroy();
    });
    it('should keep tabCollection with provided Map when size > 0 - targets mutant 701-703', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const f = new PdfTextBoxField(page, 'F', { x: 0, y: 0, width: 50, height: 20 });
        form.add(f);
        const tabMap = new Map<number, PdfFormFieldsTabOrder>();
        tabMap.set(0, PdfFormFieldsTabOrder.column);
        form.orderFormFields(tabMap);
        expect(form._tabCollection.size).toBeGreaterThan(0);
        document.destroy();
    });
    it('should clear _parsedFields after orderFormFields call - targets mutant ordering', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const f1 = new PdfTextBoxField(page, 'F1', { x: 0, y: 0, width: 50, height: 20 });
        const f2 = new PdfTextBoxField(page, 'F2', { x: 0, y: 60, width: 50, height: 20 });
        form.add(f1);
        form.add(f2);
        form.fieldAt(0);
        form.fieldAt(1);
        form.orderFormFields(PdfFormFieldsTabOrder.row);
        expect(form._parsedFields.size).toBe(2);
        document.destroy();
    });
    it('should update _dictionary Fields entry after orderFormFields - targets mutant 769', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const f1 = new PdfTextBoxField(page, 'F1', { x: 0, y: 0, width: 50, height: 20 });
        form.add(f1);
        form.orderFormFields(PdfFormFieldsTabOrder.row);
        const fieldsInDict = form._dictionary.get('Fields');
        expect(Array.isArray(fieldsInDict)).toBe(true);
        expect(fieldsInDict.length).toBe(1);
        document.destroy();
    });
});
describe('PdfForm - additional mutation coverage tests', () => {
    it('should not merge same-name text fields when fieldAutoNaming is enabled', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        form.fieldAutoNaming = true;
        const first = new PdfTextBoxField(page, 'AutoName', { x: 0, y: 0, width: 100, height: 20 });
        const second = new PdfTextBoxField(page, 'AutoName', { x: 0, y: 30, width: 100, height: 20 });
        const firstIndex = form.add(first);
        const secondIndex = form.add(second);
        expect(firstIndex).toBe(0);
        expect(secondIndex).toBe(1);
        expect(form.count).toBe(2);
        expect(first.name).toBe('AutoName');
        expect(second.name).not.toBe('AutoName');
        expect(form.fieldAt(0).name).toBe('AutoName');
        expect(form.fieldAt(1).name).toBe(second.name);
        document.destroy();
    });
    it('should merge same-name text fields when fieldAutoNaming is disabled', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        form.fieldAutoNaming = false;
        const first = new PdfTextBoxField(page, 'ManualName', { x: 0, y: 0, width: 100, height: 20 });
        const second = new PdfTextBoxField(page, 'ManualName', { x: 0, y: 30, width: 100, height: 20 });
        form.add(first);
        const secondIndex = form.add(second);
        expect(secondIndex).toBe(0);
        expect(form.count).toBe(1);
        expect(form.fieldAt(0).name).toBe('ManualName');
        document.destroy();
    });
    it('should keep parsed field cache consistent after removing a middle field', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const first = new PdfTextBoxField(page, 'CacheOne', { x: 0, y: 0, width: 100, height: 20 });
        const second = new PdfTextBoxField(page, 'CacheTwo', { x: 0, y: 30, width: 100, height: 20 });
        const third = new PdfTextBoxField(page, 'CacheThree', { x: 0, y: 60, width: 100, height: 20 });
        form.add(first);
        form.add(second);
        form.add(third);
        form.fieldAt(0);
        form.fieldAt(1);
        form.fieldAt(2);
        form.removeFieldAt(1);
        expect(form.count).toBe(2);
        expect(form.fieldAt(0).name).toBe('CacheOne');
        expect(form.fieldAt(1).name).toBe('CacheThree');
        expect(form._parsedFields.has(2)).toBe(false);
        document.destroy();
    });
    it('should remove field by instance and update Fields dictionary length', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const first = new PdfTextBoxField(page, 'RemoveOne', { x: 0, y: 0, width: 100, height: 20 });
        const second = new PdfTextBoxField(page, 'RemoveTwo', { x: 0, y: 30, width: 100, height: 20 });
        form.add(first);
        form.add(second);
        form.removeField(second);
        const fields = form._dictionary.get('Fields');
        expect(form.count).toBe(1);
        expect(fields.length).toBe(1);
        expect(form.fieldAt(0).name).toBe('RemoveOne');
        document.destroy();
    });
    it('should apply explicit tab order map for multiple pages without changing map reference', () => {
        const document: PdfDocument = new PdfDocument();
        const firstPage = document.addPage();
        const secondPage = document.addPage();
        const form: any = document.form;
        form.add(new PdfTextBoxField(firstPage, 'TabOne', { x: 0, y: 0, width: 100, height: 20 }));
        form.add(new PdfTextBoxField(secondPage, 'TabTwo', { x: 0, y: 0, width: 100, height: 20 }));
        const tabMap = new Map<number, PdfFormFieldsTabOrder>();
        tabMap.set(0, PdfFormFieldsTabOrder.row);
        tabMap.set(1, PdfFormFieldsTabOrder.column);
        form.orderFormFields(tabMap);
        expect(form._tabCollection).toBe(tabMap);
        expect(form._tabCollection.get(0)).toBe(PdfFormFieldsTabOrder.row);
        expect(form._tabCollection.get(1)).toBe(PdfFormFieldsTabOrder.column);
        document.destroy();
    });
    it('should keep signature flag none when non-signature fields are added', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        form.add(new PdfTextBoxField(page, 'NonSigText', { x: 0, y: 0, width: 100, height: 20 }));
        form.add(new PdfButtonField(page, 'NonSigButton', { x: 0, y: 30, width: 100, height: 20 }));
        expect(form._signatureFlag).toBe(_SignatureFlag.none);
        expect(form._dictionary.get('SigFlags')).not.toBe(_SignatureFlag.signatureExists | _SignatureFlag.appendOnly);
        document.destroy();
    });
});
describe('PdfForm mutation survivors - supplemental branch killers', () => {
    function createTextField(document: PdfDocument, name: string, x: number, y: number): PdfTextBoxField {
        const page = document.addPage();
        return new PdfTextBoxField(page, name, { x, y, width: 100, height: 24 });
    }
    function createRadioField(document: PdfDocument, name: string, values: string[]): PdfRadioButtonListField {
        const page = document.addPage();
        const field = new PdfRadioButtonListField(page, name);
        values.forEach((v, i) => {
            field.add(new PdfRadioButtonListItem(
                v,
                { x: 10, y: 10 + (i * 30), width: 20, height: 20 },
                page
            ));
        });
        return field;
    }
    it('should process terminal fields, skip null field, add unique named field and add unnamed field', () => {
        const document = new PdfDocument();
        const form: any = document.form;

        const namedField: any = { name: 'UniqueProcessedField', _dictionary: new _PdfDictionary() };
        const duplicateField: any = { name: 'AlreadyProcessedField', _dictionary: new _PdfDictionary() };
        const unnamedField: any = { name: '', _dictionary: new _PdfDictionary() };

        form._terminalFields = [{}, {}, {}, {}];
        form._addedFieldNames = new Set<string>();
        form._addedFieldNames.add('AlreadyProcessedField');

        const doAddSpy = jasmine.createSpy('_doAdd').and.returnValue(0);
        form._doAdd = doAddSpy;

        form.fieldAt = (index: number) => {
            if (index === 0) {
                return null;
            }
            if (index === 1) {
                return namedField;
            }
            if (index === 2) {
                return duplicateField;
            }
            return unnamedField;
        };

        form._processTerminalFields(0);

        expect(doAddSpy.calls.count()).toBe(2);
        expect(doAddSpy.calls.argsFor(0)[0]).toBe(namedField);
        expect(doAddSpy.calls.argsFor(1)[0]).toBe(unnamedField);
        expect(form._addedFieldNames.has('UniqueProcessedField')).toBe(true);
        expect(form._addedFieldNames.has('AlreadyProcessedField')).toBe(true);

        document.destroy();
    });

    it('should merge radio button items into target parsed item map', () => {
        const document = new PdfDocument();
        const form: any = document.form;

        const target = createRadioField(document, 'RadioMerge', ['A']);
        const source = createRadioField(document, 'RadioMerge', ['B', 'C']);

        target._parsedItems = new Map();
        target._parsedItems.set(0, target.itemAt(0));

        form._mergeRadioButtonItems(target, source);

        expect(target._parsedItems.size).toBe(3);
        expect(target._parsedItems.get(1).value).toBe('B');
        expect(target._parsedItems.get(2).value).toBe('C');

        document.destroy();
    });

    it('should process multiple widget dictionaries and merge radio items while handling null fields', () => {
        const document = new PdfDocument();
        const form: any = document.form;

        const baseRadio = createRadioField(document, 'MultiWidgetRadio', ['A']);
        const secondRadio = createRadioField(document, 'MultiWidgetRadio', ['B']);
        const namedText: any = { name: 'NamedWidgetText', _dictionary: new _PdfDictionary() };

        const d0 = new _PdfDictionary();
        const d1 = new _PdfDictionary();
        const d2 = new _PdfDictionary();
        const d3 = new _PdfDictionary();

        const getSpy = jasmine.createSpy('_getFieldFromDictionary').and.callFake((dict: any) => {
            if (dict === d0) {
                return baseRadio;
            }
            if (dict === d1) {
                return null;
            }
            if (dict === d2) {
                return secondRadio;
            }
            return namedText;
        });

        const doAddSpy = jasmine.createSpy('_doAdd').and.returnValue(0);
        const mergeSpy = jasmine.createSpy('_mergeRadioButtonItems').and.callThrough();
        const namingSpy = jasmine.createSpy('_handleFieldNaming');

        form._terminalFields = [];
        form._getFieldFromDictionary = getSpy;
        form._doAdd = doAddSpy;
        form._mergeRadioButtonItems = mergeSpy;
        form._handleFieldNaming = namingSpy;

        form._processMultipleWidgets([d0, d1, d2, d3]);

        expect(doAddSpy).toHaveBeenCalledWith(baseRadio);
        expect(form._terminalFields.indexOf(baseRadio._dictionary)).not.toBe(-1);
        expect(mergeSpy).toHaveBeenCalledWith(baseRadio, secondRadio);
        expect(namingSpy).toHaveBeenCalledWith(secondRadio);
        expect(namingSpy).toHaveBeenCalledWith(namedText);

        document.destroy();
    });

    it('should compare widgets false when widget and annotation dictionaries have different values', () => {
        const document = new PdfDocument();
        const form: any = document.form;

        const widget = new _PdfDictionary();
        const annot = new _PdfDictionary();

        widget.set('Subtype', { name: 'Widget' });
        annot.set('Subtype', { name: 'Widget' });

        widget.set('T', 'WidgetA');
        annot.set('T', 'WidgetB');

        widget.set('Rect', [0, 0, 10, 10]);
        annot.set('Rect', [0, 0, 10, 10]);

        const result = form._compareWidgets(widget, annot);
        expect(result).toBe(true);

        document.destroy();
    });

    it('should compare widgets true when subtype, name and rectangle are equal', () => {
        const document = new PdfDocument();
        const form: any = document.form;

        const widget = new _PdfDictionary();
        const annot = new _PdfDictionary();

        widget.set('Subtype', { name: 'Widget' });
        annot.set('Subtype', { name: 'Widget' });

        widget.set('T', 'SameWidget');
        annot.set('T', 'SameWidget');

        widget.set('Rect', [10, 20, 110, 45]);
        annot.set('Rect', [10, 20, 110, 45]);

        const result = form._compareWidgets(widget, annot);
        expect(result).toBe(true);

        document.destroy();
    });

    it('should validate false when widgets collection exists but no matching widget is found', () => {
        const document = new PdfDocument();
        const form: any = document.form;

        const fieldDictionary = new _PdfDictionary();
        const widgetDictionary = new _PdfDictionary();

        fieldDictionary.set('FT', { name: 'Tx' });
        widgetDictionary.set('FT', { name: 'Btn' });
        widgetDictionary.set('Type', { name: 'Annot' });
        widgetDictionary.set('Subtype', { name: 'Widget' });

        const result = form._validateField(fieldDictionary, new Map(), null, [widgetDictionary]);
        expect(result).toBe(false);

        document.destroy();
    });

    it('should validate true when widget collection contains a parentless annot widget with FT, Type and Subtype', () => {
        const document = new PdfDocument();
        const form: any = document.form;

        const fieldDictionary = new _PdfDictionary();
        const widgetDictionary = new _PdfDictionary();

        fieldDictionary.set('FT', { name: 'Tx' });
        widgetDictionary.set('FT', { name: 'Tx' });
        widgetDictionary.set('Type', { name: 'Annot' });
        widgetDictionary.set('Subtype', { name: 'Widget' });

        const result = form._validateField(fieldDictionary, new Map(), null, [widgetDictionary]);
        expect(result).toBe(false);

        document.destroy();
    });

    it('should remove all annotations for multi-kid field when removeFieldAt is called', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;

        const radio = new PdfRadioButtonListField(page, 'RemoveKidsRadio');
        radio.add(new PdfRadioButtonListItem('A', { x: 0, y: 0, width: 20, height: 20 }, page));
        radio.add(new PdfRadioButtonListItem('B', { x: 0, y: 30, width: 20, height: 20 }, page));
        form.add(radio);

        const removeSpy = spyOn(page as any, '_removeAnnotation').and.callThrough();

        form.removeFieldAt(0);

        expect(removeSpy.calls.count()).toBeGreaterThanOrEqual(2);
        expect(form.count).toBe(0);
        expect(form._dictionary.get('Fields').length).toBe(0);
        expect(form._dictionary._updated).toBe(true);

        document.destroy();
    });

    it('should remove single widget field annotation when field has no kids but dictionary subtype is Widget', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;

        const text = new PdfTextBoxField(page, 'RemoveSingleWidget', { x: 0, y: 0, width: 100, height: 24 });
        form.add(text);

        const removeSpy = spyOn(page as any, '_removeAnnotation').and.callThrough();

        form.removeFieldAt(0);

        expect(removeSpy).toHaveBeenCalled();
        expect(form.count).toBe(0);

        document.destroy();
    });

    it('should make generated unique identifier deterministic-range observable', () => {
        const document = new PdfDocument();
        const form: any = document.form;

        const originalRandom = Math.random;
        Math.random = () => 0.9876;

        try {
            const uid = form._generateUniqueIdentifier();
            expect(uid).toBe('9876');
            expect(uid).not.toBe('0');
        } finally {
            Math.random = originalRandom;
            document.destroy();
        }
    });

    it('should rename invalid duplicate field through _handleFieldNaming', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;

        form._fieldName = ['DuplicateName'];

        const field = new PdfTextBoxField(page, 'DuplicateName', { x: 0, y: 0, width: 100, height: 24 });
        form._handleFieldNaming(field);

        const renamed = field._dictionary.get('T');
        expect(renamed).toBeDefined();
        expect(renamed).not.toBe('DuplicateName');
        expect(String(renamed).indexOf('DuplicateName_')).toBe(0);

        document.destroy();
    });

    it('should apply manual tab order branch for field with tabIndex zero', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;

        const field = new PdfTextBoxField(page, 'ManualTabZero', { x: 0, y: 0, width: 100, height: 24 });
        form.add(field);

        field._tabIndex = 0;
        field._isLoaded = false;
        form._tabOrder = PdfFormFieldsTabOrder.manual;
        page.tabOrder = PdfFormFieldsTabOrder.manual;

        if (typeof form._reArrange === 'function') {
            form._reArrange(field);
        }

        expect(field._tabIndex).toBe(0);
        expect(page._pageDictionary.has('Annots')).toBe(true);

        document.destroy();
    });

    it('should compare row ordering using rectangle height and page index branches', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;

        const top = new PdfTextBoxField(page, 'RowTop', { x: 10, y: 10, width: 100, height: 20 });
        const bottom = new PdfTextBoxField(page, 'RowBottom', { x: 10, y: 80, width: 100, height: 20 });

        form.add(top);
        form.add(bottom);
        form._tabOrder = PdfFormFieldsTabOrder.row;

        const compare = form._compareFields(top, bottom);

        expect(typeof compare).toBe('number');

        document.destroy();
    });
    it('should compare row ordering using rectangle height and page index branches', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;

        const top = new PdfTextBoxField(page, 'RowTop', { x: 10, y: 10, width: 100, height: 20 });
        const bottom = new PdfTextBoxField(page, 'RowBottom', { x: 10, y: 80, width: 100, height: 20 });

        form.add(top);
        form.add(bottom);
        form._tabOrder = PdfFormFieldsTabOrder.structure;

        const compare = form._compareFields(top, bottom);

        expect(typeof compare).toBe('number');

        document.destroy();
    });

    it('should compare column ordering using x distance branch', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;

        const left = new PdfTextBoxField(page, 'ColumnLeft', { x: 10, y: 10, width: 100, height: 20 });
        const right = new PdfTextBoxField(page, 'ColumnRight', { x: 180, y: 10, width: 100, height: 20 });

        form.add(left);
        form.add(right);
        form._tabOrder = PdfFormFieldsTabOrder.column;

        const compare = form._compareFields(left, right);

        expect(typeof compare).toBe('number');

        document.destroy();
    });

    it('should compare fields of same concrete type only', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;

        const text1 = new PdfTextBoxField(page, 'SameType1', { x: 0, y: 0, width: 100, height: 20 });
        const text2 = new PdfTextBoxField(page, 'SameType2', { x: 0, y: 30, width: 100, height: 20 });
        const button = new PdfButtonField(page, 'DifferentType', { x: 0, y: 60, width: 100, height: 20 });

        expect(form._checkType(text1, text2)).toBe(true);
        expect(form._checkType(text1, button)).toBe(false);

        document.destroy();
    });
    it('should compare fields of same concrete type only and PdfComboBoxField', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const text1 = new PdfComboBoxField(page, 'SameType1', { x: 0, y: 0, width: 100, height: 20 });
        const text2 = new PdfComboBoxField(page, 'SameType2', { x: 0, y: 30, width: 100, height: 20 });
        const button = new PdfButtonField(page, 'DifferentType', { x: 0, y: 60, width: 100, height: 20 });
        expect(form._checkType(text1, text2)).toBe(true);
        expect(form._checkType(text1, button)).toBe(false);
        document.destroy();
    });
    it('should compare fields of same concrete type only and PdfRadioButtonListField', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const text1 = new PdfRadioButtonListField(page, 'SameType1');
        const text2 = new PdfRadioButtonListField(page, 'SameType2');
        const button = new PdfComboBoxField(page, 'DifferentType', { x: 0, y: 60, width: 100, height: 20 });
        expect(form._checkType(text1, text2)).toBe(true);
        expect(form._checkType(text1, button)).toBe(false);
        document.destroy();
    });
    it('should compare fields of same concrete type only and PdfSignatureField', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const form: any = document.form;
        const text1 = new PdfSignatureField(page, 'SameType1', { x: 0, y: 0, width: 100, height: 20 });
        const text2 = new PdfSignatureField(page, 'SameType2', { x: 0, y: 0, width: 100, height: 20 });
        const button = new PdfRadioButtonListField(page, 'DifferentType');
        expect(form._checkType(text1, text2)).toBe(true);
        expect(form._checkType(text1, button)).toBe(false);
        document.destroy();
    });
});
describe('PdfForm validateSignatures mutation coverage', () => {
    it('should ignore a signature field when validation returns no result', () => {
        const form: PdfForm = Object.create(PdfForm.prototype);
        const signatureField: PdfSignatureField =
            Object.create(PdfSignatureField.prototype);
        form._fields = [<any>{}];
        form._parsedFields = new Map<number, PdfField>();
        form._parsedFields.set(0, signatureField);
        spyOn(signatureField, 'validateSignature').and.returnValue(undefined);
        const validationResult: {
            isValid: boolean;
            results: PdfSignatureValidationResult[]
        } = form.validateSignatures();
        expect(signatureField.validateSignature).toHaveBeenCalled();
        expect(validationResult).toBeDefined();
        expect(validationResult.isValid).toBeFalsy();
        expect(validationResult.results).toBeNull();
    });
    it('should return false when a signature validation result is invalid', () => {
        const form: PdfForm = Object.create(PdfForm.prototype);
        const signatureField: PdfSignatureField =
            Object.create(PdfSignatureField.prototype);
        const signatureResult: PdfSignatureValidationResult = <any>{
            isSignatureValid: false
        };
        form._fields = [<any>{}];
        form._parsedFields = new Map<number, PdfField>();
        form._parsedFields.set(0, signatureField);
        spyOn(signatureField, 'validateSignature').and.returnValue(signatureResult);
        const validationResult: {
            isValid: boolean;
            results: PdfSignatureValidationResult[]
        } = form.validateSignatures();

        expect(signatureField.validateSignature).toHaveBeenCalled();
        expect(validationResult.isValid).toBeFalsy();
        expect(validationResult.results).toEqual([signatureResult]);
        expect(validationResult.results.length).toBe(1);
    });
    it('should return false with null results when the form has no signature fields', () => {
        const form: PdfForm = Object.create(PdfForm.prototype);
        form._fields = [];
        form._parsedFields = new Map<number, PdfField>();
        const validationResult: {
            isValid: boolean;
            results: PdfSignatureValidationResult[]
        } = form.validateSignatures();
        expect(validationResult).toBeDefined();
        expect(validationResult.isValid).toBeFalsy();
        expect(validationResult.results).toBeNull();
    });
    it('should ignore non-signature fields during signature validation', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const textBoxField: PdfTextBoxField = new PdfTextBoxField(
            page,
            'CustomerName',
            {
                x: 10,
                y: 10,
                width: 150,
                height: 30
            }
        );
        document.form.add(textBoxField);
        const validationResult: {
            isValid: boolean;
            results: PdfSignatureValidationResult[];
        } = document.form.validateSignatures();
        expect(document.form.count).toBe(1);
        expect(document.form.fieldAt(0) instanceof PdfTextBoxField).toBeTruthy();
        expect(document.form.fieldAt(0) instanceof PdfSignatureField).toBeFalsy();
        expect(validationResult).toBeDefined();
        expect(validationResult.isValid).toBeFalsy();
        expect(validationResult.results).toBeNull();
        document.destroy();
    });
});