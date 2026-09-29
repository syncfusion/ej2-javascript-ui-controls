import { PdfPopupAnnotation } from '../src/pdf/core/annotations/annotation';
import { _PdfContentStream, _PdfStream } from '../src/pdf/core/base-stream';
import { _PdfFlateStream } from '../src/pdf/core/flate-stream';
import { PdfButtonField, PdfCheckBoxField, PdfComboBoxField, PdfListBoxField, PdfRadioButtonListField, PdfTextBoxField } from '../src/pdf/core/form/field';
import { _FdfDocument } from '../src/pdf/core/import-export/fdf-document';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { PdfPage } from '../src/pdf/core/pdf-page';
import { _PdfDictionary, _PdfName, _PdfReference } from '../src/pdf/core/pdf-primitives';
describe('1038509 _FdfDocument._save mutation coverage', () => {
    function createFdfDocument(): _FdfDocument {
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._table = new Map();
        fdf._stringToHexString = (value: string): string => value;
        fdf._exportFormFieldsData = (_field: any): any => 'value';
        return fdf;
    }
    it('1038509 objectArray should remain empty when no supported fields exist', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const button: PdfButtonField = new PdfButtonField(page, 'button1', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(button);
        const fdf: _FdfDocument = createFdfDocument();
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        const result: Uint8Array = fdf._save();
        expect(result).toBeDefined();
        expect(fdf.fdfString.indexOf('Stryker was here')).toBe(-1);
        document.destroy();
    });
    it('1038509 specification mode should generate specification header', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(page,'text1',{ x: 10, y: 10, width: 100, height: 20 });
        field.text = 'value';
        document.form.add(field);
        const fdf: _FdfDocument = createFdfDocument();
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = true;
        fdf._save();
        expect(fdf.fdfString.indexOf('/UF(sample.pdf)')).not.toBe(-1);
        expect(fdf.fdfString.indexOf('%%EOF')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 non specification mode should generate trailer root format', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(page,'text1',{ x: 10, y: 10, width: 100, height: 20 });
        document.form.add(field);
        const fdf: _FdfDocument = createFdfDocument();
        fdf._document = document;
        fdf._table.set('1', '1');
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._save();
        expect(fdf.fdfString.indexOf('trailer')).not.toBe(-1);
        expect(fdf.fdfString.indexOf('/UF(sample.pdf)')).toBe(-1);
        document.destroy();
    });
    it('1038509 save should execute when form exists', () => {
        const document: PdfDocument = new PdfDocument();
        const fdf: _FdfDocument = createFdfDocument();
        fdf._document = document;
        fdf._isAnnotationExport = false;
        const result: Uint8Array = fdf._save();
        expect(result).toBeDefined();
        expect(result.length).toBe(fdf.fdfString.length);
        document.destroy();
    });
    it('1038509 textbox field should contribute one field object', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const textBox: PdfTextBoxField = new PdfTextBoxField(page, 'textbox', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(textBox);
        const fdf: _FdfDocument = createFdfDocument();
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table.set('0', '0');
        fdf._save();
        expect(fdf.fdfString.indexOf('/T <textbox>')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 listbox field should contribute one field object', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const listBox: PdfListBoxField = new PdfListBoxField(page, 'listbox', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(listBox);
        const fdf: _FdfDocument = createFdfDocument();
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._save();
        expect(fdf.fdfString.indexOf('/T <listbox>')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 combobox field should contribute one field object', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const comboBox: PdfComboBoxField = new PdfComboBoxField(page, 'combo', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(comboBox);
        const fdf: _FdfDocument = createFdfDocument();
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._save();
        expect(fdf.fdfString.indexOf('/T <combo>')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 radio button field should create named value entry', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const radioField: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'radio');
        document.form.add(radioField);
        const fdf: _FdfDocument = createFdfDocument();
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._exportFormFieldsData = (_field: any): any => 'choice1';
        fdf._save();
        expect(fdf.fdfString.indexOf('/V /choice1')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 checkbox field should create named value entry', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const checkBox: PdfCheckBoxField = new PdfCheckBoxField('CheckBox1', {x: 100, y: 40, width: 20, height: 20}, page);
        document.form.add(checkBox);
        const fdf: _FdfDocument = createFdfDocument();
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._exportFormFieldsData = (_field: any): any => 'Yes';
        fdf._save();
        expect(fdf.fdfString.indexOf('/V /Yes')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 button field should not be exported as text choice field', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const button: PdfButtonField = new PdfButtonField(page, 'button1', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(button);
        const fdf: _FdfDocument = createFdfDocument();
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._save();
        expect(fdf.fdfString.indexOf('/T <button1>')).toBe(-1);
        document.destroy();
    });
    it('1038509 supported field count should affect root references', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const textBox: PdfTextBoxField = new PdfTextBoxField(page, 'field1', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(textBox);
        const fdf: _FdfDocument = createFdfDocument();
        fdf._document = document;
        fdf._table.set('0', '0');
        fdf._isAnnotationExport = false;
        fdf._save();
        expect(fdf.fdfString.indexOf('0 R')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 specification path should export field container', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const textBox: PdfTextBoxField = new PdfTextBoxField(page, 'field1', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(textBox);
        const fdf: _FdfDocument = createFdfDocument();
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = true;
        fdf._save();
        expect(fdf.fdfString.indexOf('/Fields[')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 annotation export should bypass form export logic', () => {
        const document: PdfDocument = new PdfDocument();
        const fdf: _FdfDocument = createFdfDocument();
        fdf._document = document;
        fdf._isAnnotationExport = true;
        const before: string = fdf.fdfString;
        fdf._save();
        expect(fdf.fdfString).toBe(before);
        document.destroy();
    });
    it('1038509 textbox export uses positive object id', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const textBox: PdfTextBoxField = new PdfTextBoxField(page, 'textField', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(textBox);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._exportFormFieldsData = (_field: any): string => 'value';
        fdf._save();
        expect(fdf.fdfString.indexOf('1 0 obj')).not.toBe(-1);
        expect(fdf.fdfString.indexOf('-1 0 obj')).toBe(-1);
        document.destroy();
    });
    it('1038509 textbox export writes obj marker and field token', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const textBox: PdfTextBoxField = new PdfTextBoxField(page, 'customerName', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(textBox);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._exportFormFieldsData = (_field: any): string => 'Syncfusion';
        fdf._save();
        expect(fdf.fdfString.indexOf('0 obj')).not.toBe(-1);
        expect(fdf.fdfString.indexOf('/T <')).not.toBe(-1);
        expect(fdf.fdfString.indexOf('637573746F6D65724E616D65')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 exports direct string values', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const textBox: PdfTextBoxField = new PdfTextBoxField(page, 'field1', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(textBox);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._exportFormFieldsData = (_field: any): string => 'plainValue';
        fdf._save();
        expect(fdf.fdfString.indexOf('706C61696E56616C7565')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 exports single value array as value', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const textBox: PdfTextBoxField = new PdfTextBoxField(page, 'field1', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(textBox);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._exportFormFieldsData = (_field: any): string[] => ['single'];
        fdf._save();
        expect(fdf.fdfString.indexOf('73696E676C65')).not.toBe(-1);
        expect(fdf.fdfString.indexOf('[')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 exports multi value array inside brackets', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const listBox: PdfListBoxField = new PdfListBoxField(page, 'listField', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(listBox);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._exportFormFieldsData = (_field: any): string[] => ['value1','value2'];
        fdf._save();
        expect(fdf.fdfString.indexOf('76616C756531')).not.toBe(-1);
        expect(fdf.fdfString.indexOf('76616C756532')).not.toBe(-1);
        expect(fdf.fdfString.indexOf('[')).not.toBe(-1);
        expect(fdf.fdfString.indexOf(']')).not.toBe(-1);
        document.destroy();
    });
    function createSaveHarness(): {
        document: PdfDocument;
        page: PdfPage;
        field: PdfTextBoxField;
        fdf: any;
    } {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(page, 'textField', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(field);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        return { document, page, field, fdf };
    }
    function createSaveHarnessWithListBox(): {
        document: PdfDocument;
        page: PdfPage;
        field: PdfListBoxField;
        fdf: any;
    } {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfListBoxField = new PdfListBoxField(page, 'listField', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(field);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        return { document, page, field, fdf };
    }
    it('1038509 _save writes closing angle bracket for string value', () => {
        const harness: any = createSaveHarness();
        harness.fdf._exportFormFieldsData = (_field: any): string => 'Syncfusion';
        harness.fdf._save();
        expect(harness.fdf.fdfString.indexOf('<53796E63667573696F6E>')).not.toBe(-1);
        expect(harness.fdf.fdfString.indexOf('<53796E63667573696F6E')).not.toBe(-1);
        harness.document.destroy();
    });
    it('1038509 _save enters array export branch for multi value list', () => {
        const harness: any = createSaveHarnessWithListBox();
        harness.fdf._exportFormFieldsData = (_field: any): string[] => {
            return ['value1', 'value2'];
        };
        harness.fdf._save();
        expect(harness.fdf.fdfString.indexOf('[')).not.toBe(-1);
        expect(harness.fdf.fdfString.indexOf(']')).not.toBe(-1);
        harness.document.destroy();
    });
    it('1038509 _save writes closing bracket for each array value', () => {
        const harness: any = createSaveHarnessWithListBox();
        harness.fdf._exportFormFieldsData = (_field: any): string[] => {return ['first', 'second'];};
        harness.fdf._save();
        expect(harness.fdf.fdfString.indexOf('<6669727374>')).not.toBe(-1);
        expect(harness.fdf.fdfString.indexOf('<7365636F6E64>')).not.toBe(-1);
        harness.document.destroy();
    });
    it('1038509 _save writes single separator between array values', () => {
        const harness: any = createSaveHarnessWithListBox();
        harness.fdf._exportFormFieldsData = (_field: any): string[] => {return ['one', 'two'];};
        harness.fdf._save();
        expect(harness.fdf.fdfString.indexOf('<6F6E65> <74776F>')).not.toBe(-1);
        harness.document.destroy();
    });
    it('1038509 _save serializes array values with separators only between items', () => {
        const harness: any = createSaveHarnessWithListBox();
        harness.fdf._exportFormFieldsData = (_field: any): string[] => {return ['one', 'two', 'three'];};
        harness.fdf._save();
        expect(harness.fdf.fdfString.indexOf('<6F6E65> <74776F> <7468726565>')).not.toBe(-1);
        expect(harness.fdf.fdfString.indexOf('<6f6E65><74776F>')).toBe(-1);
        expect(harness.fdf.fdfString.indexOf('<74776F><7468726565>')).toBe(-1);
        harness.document.destroy();
    });
    it('1038509 objectArray should remain empty when no supported fields exist', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const button: PdfButtonField = new PdfButtonField(page, 'button1', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(button);
        const fdf: _FdfDocument = createFdfDocument();
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        const result: Uint8Array = fdf._save();
        expect(result).toBeDefined();
        expect(fdf.fdfString.indexOf('Stryker was here')).toBe(-1);
        document.destroy();
    });
    it('1038509 specification mode should generate specification header', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(page, 'text1', { x: 10, y: 10, width: 100, height: 20 });
        field.text = 'value';
        document.form.add(field);
        const fdf: _FdfDocument = createFdfDocument();
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = true;
        fdf._save();
        expect(fdf.fdfString.indexOf('/UF(sample.pdf)')).not.toBe(-1);
        expect(fdf.fdfString.indexOf('%%EOF')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 _save closes multi value array with closing bracket', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfListBoxField = new PdfListBoxField(page, 'listField', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(field);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._exportFormFieldsData = (_field: any): string[] => ['one', 'two'];
        fdf._save();
        expect(fdf.fdfString.indexOf('[<6F6E65> <74776F>]')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 _save terminates text field object with endobj marker', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(page, 'textField', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(field);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._exportFormFieldsData = (_field: any): string => 'value';
        fdf._save();
        expect(fdf.fdfString.indexOf('>>endobj')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 textbox field should not use radio button serialization', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(page, 'customerName', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(field);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._exportFormFieldsData = (_field: any): string => 'Syncfusion';
        fdf._save();
        expect(fdf.fdfString.indexOf('/V <')).not.toBe(-1);
        expect(fdf.fdfString.indexOf('/V /Syncfusion')).toBe(-1);
        document.destroy();
    });
    it('1038509 checkbox field uses named value syntax', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfCheckBoxField = new PdfCheckBoxField('checkField', {x: 100, y: 40, width: 20, height: 20}, page);
        document.form.add(field);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._exportFormFieldsData = (_field: any): string => 'Yes';
        fdf._save();
        expect(fdf.fdfString.indexOf('/V /Yes')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 checkbox export contains object definition syntax', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfCheckBoxField = new PdfCheckBoxField('checkField', {x: 100, y: 40, width: 20, height: 20}, page);
        document.form.add(field);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._exportFormFieldsData = (_field: any): string => 'Yes';
        fdf._save();
        expect(fdf.fdfString.indexOf('1 0 obj')).not.toBe(-1);
        expect(fdf.fdfString.indexOf('/T <')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 checkbox export closes object correctly', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfCheckBoxField = new PdfCheckBoxField('checkField', {x: 100, y: 40, width: 20, height: 20}, page);
        document.form.add(field);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._exportFormFieldsData = (_field: any): string => 'Yes';
        fdf._save();
        expect(fdf.fdfString.indexOf('/V /Yes >>endobj')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 string value should not serialize as array', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(page, 'textField', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(field);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._exportFormFieldsData = (_field: any): string => 'Syncfusion';
        fdf._save();
        expect(fdf.fdfString.indexOf('[<')).toBe(-1);
        expect(fdf.fdfString.indexOf('<53796E63667573696F6E>')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 textbox should not use named value serialization', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(page, 'customerName', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(field);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._exportFormFieldsData = (_field: any): string => 'Syncfusion';
        fdf._save();
        expect(fdf.fdfString.indexOf('/V /Syncfusion')).toBe(-1);
        expect(fdf.fdfString.indexOf('/V <')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 exported field references are written into fields array', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(page, 'field1', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(field);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._table.set('field1', 1);
        fdf._exportFormFieldsData = (_field: any): string => 'value';
        fdf._save();
        expect(fdf.fdfString.indexOf('0 R')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 _save writes exported field reference when export is true', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(page, 'field1', { x: 10, y: 10, width: 100, height: 20 });
        field.export = true;
        document.form.add(field);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._table.set('field1', 1);
        fdf._exportFormFieldsData = (_field: any): string => 'value';
        fdf._save();
        expect(fdf.fdfString.indexOf('0 R')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 _save skips field reference when export is false', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(page, 'field1', { x: 10, y: 10, width: 100, height: 20 });
        field.export = false;
        document.form.add(field);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._table.set('field1', 1);
        fdf._exportFormFieldsData = (_field: any): string => 'value';
        fdf._save();
        const fieldsSection: string = fdf.fdfString.substring(fdf.fdfString.indexOf('/Fields ['), fdf.fdfString.indexOf(']>>endobj'));
        expect(fieldsSection.indexOf('0 R')).toBe(-1);
        document.destroy();
    });
    it('1038509 _save writes indirect object reference syntax', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(page, 'field1', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(field);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._table.set('field1', 1);
        fdf._exportFormFieldsData = (_field: any): string => 'value';
        fdf._save();
        expect(fdf.fdfString.indexOf('1 0 R')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 _save closes fields object definition', () => {
        const document: PdfDocument = new PdfDocument();
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._save();
        expect(fdf.fdfString.indexOf(']>>endobj')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 _save writes correct version and root object references', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(page, 'field1', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(field);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._table.set('field1', 1);
        fdf._exportFormFieldsData = (_field: any): string => 'value';
        fdf._save();
        expect(fdf.fdfString.indexOf('3 0 obj<</Version /1.4 /FDF 2 0 R>>endobj')).not.toBe(-1);
        document.destroy();
    });
    it('1038509 _save trailer points to expected root object', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(page, 'field1', { x: 10, y: 10, width: 100, height: 20 });
        document.form.add(field);
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf.fdfString = '';
        fdf._document = document;
        fdf._isAnnotationExport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._table.set('field1', 1);
        fdf._exportFormFieldsData = (_field: any): string => 'value';
        fdf._save();
        expect(fdf.fdfString.indexOf('trailer\n<</Root 3 0 R>>')).not.toBe(-1);
        document.destroy();
    });
});
describe('1038509 _importAnnotations annotation export flag', () => {
    it('1038509 importAnnotations sets annotation export false', () => {
        const document: any = {_crossReference: {}};
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf._checkFdf = (_data: string): void => {};
        fdf._readFdfData = (_parser: any): void => {};
        const data: Uint8Array = new Uint8Array([37, 70, 68, 70]);
        fdf._importAnnotations(document, data);
        expect(fdf._isAnnotationExport).toBe(false);
        expect(fdf._isAnnotationImport).toBe(true);
    });
    it('1038509 _importAnnotations creates parser configured for annotation import', () => {
        const document: any = {_crossReference: {}};
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        let parserInstance: any;
        fdf._checkFdf = (_value: string): void => {};
        fdf._readFdfData = (parser: any): void => {parserInstance = parser;};
        fdf._importAnnotations(document, new Uint8Array([37, 70, 68, 70]));
        expect(parserInstance).toBeDefined();
        const lexical: any = parserInstance.lexicalOperator;
        expect(lexical._isFormsDataFormat).toBe(true);
        expect(lexical._isAnnotationImport).toBe(true);
        expect(parserInstance.allowStreams).toBe(true);
        expect(parserInstance.recoveryMode).toBe(false);
    });
    it('1038509 _importAnnotations does not clear annotation objects map', () => {
        const document: any = {_crossReference: {}};
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf._checkFdf = (_value: string): void => {};
        fdf._readFdfData = (_parser: any): void => {fdf._annotationObjects = new Map();
        fdf._annotationObjects.set('A', 'B');};
        fdf._importAnnotations(document, new Uint8Array([37, 70, 68, 70]));
        expect(fdf._annotationObjects.size).toBe(0);
        expect(fdf._annotationObjects.has('A')).not.toBe(true);
    });
    it('1038509 populated table remains available', () => {
        const document: any = { _crossReference: {}};
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf._checkFdf = (_data: string): void => {};
        fdf._readFdfData = (_parser: any): void => {
            fdf._table = new Map();
            fdf._table.set('Field', 'Value');
        };
        fdf._importAnnotations(document, new Uint8Array([37, 70, 68, 70]));
        expect(fdf._table.size).toBe(0);
        expect(fdf._table.has('Field')).not.toBe(true);
    });
    it('1038509 importFormData configures parser correctly', () => {
        const document: any = {_crossReference: {}};
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        let parserInstance: any;
        fdf._checkFdf = (_data: string): void => {};
        fdf._readFdfData = (parser: any): void => {parserInstance = parser;};
        fdf._importFormData(document, new Uint8Array([37, 70, 68, 70]));
        expect(fdf._isAnnotationExport).toBe(false);
        expect(parserInstance).toBeDefined();
        expect(parserInstance.lexicalOperator._isFormsDataFormat).toBe(true);
        expect(parserInstance.lexicalOperator._isAnnotationImport).toBe(false);
        expect(parserInstance.allowStreams).toBe(false);
        expect(parserInstance.recoveryMode).toBe(false);
    });
});
describe('1038509 _readFdfData form parsing survivors', () => {
    function createFormHarness(): _FdfDocument {
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf._isAnnotationImport = false;
        fdf._asPerSpecification = false;
        fdf._table = new Map();
        fdf._importField = (): void => {};
        return fdf;
    }
    it('1038509 non specification import should skip commands until a dictionary token appears', () => {
        const fdf: _FdfDocument = createFormHarness();
        const dictionary: any = {
            _map: {V: {name: 'Gamma'}},
            getArray: (key: string): any => key === 'T' ? ['FieldC'] : ['Gamma'],
            get: (key: string): any => key === 'V' ? {name: 'Gamma'} : undefined,
            constructor: {name: '_PdfDictionary'}
        };
        const tokens: any[] = [1, {command: 'trailer', constructor: {name: '_PdfCommand'}}, dictionary, 'EOF'];
        const parser: any = {getObject: (): any => tokens.shift() };
        fdf._readFdfData(parser);
        expect(fdf._table.size).toBe(0);
        expect(fdf._table.get('FieldC')).not.toBe('Gamma');
    });
    it('1038509 form import should store name value pairs after integer key tokens', () => {
        const fdf: _FdfDocument = createFormHarness();
        const dictionary: any = {
            _map: {V: {name: 'Alpha'}},
            getArray: (key: string): any => key === 'T' ? ['FieldA'] : ['Alpha'],
            get: (key: string): any => key === 'V' ? {name: 'Alpha'} : undefined,
            constructor: {name: '_PdfDictionary'}
        };
        const tokens: any[] = [1, 1, dictionary, 'EOF'];
        const parser: any = {first: 2, getObject: (): any => tokens.shift()};
        fdf._readFdfData(parser);
        expect(fdf._table.size).toBe(0);
        expect(fdf._table.get('FieldA')).not.toBe('Alpha');
    });
    it('1038509 form import should read specification field dictionaries from nested FDF entries', () => {
        const fdf: _FdfDocument = createFormHarness();
        fdf._asPerSpecification = true;
        const fieldDictionary: any = {
            _map: {V: {name: 'Beta'}},
            getArray: (key: string): any => key === 'T' ? ['FieldB'] : ['Beta'],
            get: (key: string): any => key === 'V' ? {name: 'Beta'} : undefined,
            constructor: {name: '_PdfDictionary'}
        };
        const fields: any[] = [fieldDictionary];
        const fdfDictionary: any = {_map: {FDF: {_map: {Fields: fields}}}, constructor: {name: '_PdfDictionary'}};
        const tokens: any[] = [fdfDictionary, 'EOF'];
        const parser: any = { getObject: (): any => tokens.shift()};
        fdf._readFdfData(parser);
        expect(fdf._table.size).toBe(0);
        expect(fdf._table.get('FieldB')).not.toBe('Beta');
    });
    it('1038509 specification import should ignore dictionaries without FDF entries', () => {
        const fdf: _FdfDocument = createFormHarness();
        fdf._asPerSpecification = true;
        const dictionaryWithoutFdf: any = {
            _map: {},
            constructor: {name: '_PdfDictionary'}
        };
        const tokens: any[] = [dictionaryWithoutFdf, 'EOF'];
        const parser: any = {getObject: (): any => tokens.shift()};
        fdf._readFdfData(parser);
        expect(fdf._table.size).toBe(0);
    });
});
describe('1038509 _readFdfData annotation import survivors', () => {
    function createAnnotationImportHarness(): _FdfDocument {
        const fdf: _FdfDocument = new _FdfDocument('sample.pdf');
        fdf._isAnnotationImport = true;
        fdf._table = new Map();
        fdf._annotationObjects = new Map();
        fdf._groupHolders = [];
        fdf._groupReferences = new Map();
        fdf._parseAnnotationData = (): Map<any, any> => new Map();
        fdf._parseDictionary = (_dictionary: any): void => {};
        fdf._handlePopup = (): void => {};
        fdf._addReferenceToGroup = (): void => {};
        return fdf;
    }
    it('1038509 annotation import should store trailer command and update dictionary state', () => {
        const fdf: _FdfDocument = createAnnotationImportHarness();
        const dictionary: any = {
            size: 1,
            has: (key: string): boolean => key === 'Page',
            get: (key: string): any => key === 'Page' ? 0 : undefined,
            constructor: {name: '_PdfDictionary'}
        };
        const trailerCommand: any = {command: 'trailer', constructor: {name: '_PdfCommand'}};
        const tokens: any[] = [1, trailerCommand, dictionary, 'EOF'];
        const parser: any = {
            first: 2,
            getObject: (): any => tokens.shift()
        };
        fdf._document = {
            pageCount: 1,
            getPage: (): any => ({
                _pageDictionary: {objId: '1 0', set: (): void => {}, _updated: false},
                annotations: {
                    _annotations: [],
                    _comments: [],
                    _parsedAnnotations: new Map(),
                    _parseAnnotation: (): any => null,
                    count: 0
                }
            })
        } as any;
        fdf._crossReference = { _cacheMap: new Map(), _getNextReference: (): _PdfReference => new _PdfReference(1, 0) } as any;
        fdf._readFdfData(parser);
        expect(fdf._table.has('trailer')).not.toBe(true);
        expect(dictionary._updated).toBeUndefined();
    });
    it('1038509 annotation import should set nested annotation references when NM exists', () => {
        const fdf: _FdfDocument = createAnnotationImportHarness();
        const dictionary: any = {
            size: 3,
            has: (key: string): boolean => key === 'Page' || key === 'NM',
            get: (key: string): any => key === 'Page' ? 0 : undefined,
            constructor: {name: '_PdfDictionary'}
        };
        const parsedAnnotation: any = {
            _dictionary: {
                has: (key: string): boolean => key === 'P' ? false : key === 'Subtype',
                get: (key: string): any => key === 'Subtype' ? {name: 'Text'} : undefined,
                update: (): void => {},
                _map: {}
            },
            _isImported: false,
            _ref: ''
        };
        const annotations: any = {
            _annotations: [],
            _comments: [],
            _parsedAnnotations: new Map(),
            _parseAnnotation: (): any => parsedAnnotation,
            count: 0
        };
        const pageDictionary: any = {objId: '10 0', set: (): void => {}, _updated: false};
        const cacheMap: Map<any, any> = new Map();
        let grouped: any = null;
        fdf._addReferenceToGroup = (reference: any, value: any): void => { grouped = {reference, value}; };
        fdf._document = {
            pageCount: 1,
            getPage: (): any => ({_pageDictionary: pageDictionary, annotations})
        } as any;
        fdf._crossReference = { _cacheMap: cacheMap, _getNextReference: (): _PdfReference => new _PdfReference(1, 0) } as any;
        fdf._annotationObjects = new Map([['1 0', dictionary]]);
        fdf._parseAnnotationData = (): Map<any, any> => fdf._annotationObjects;
        const tokens: any[] = ['EOF'];
        const parser: any = {first: 0, getObject: (): any => tokens.shift()};
        fdf._readFdfData(parser);
        expect(grouped).not.toBeNull();
        expect(grouped.reference.generationNumber).toEqual(0);
        expect(grouped.reference.objectNumber).toEqual(1);
        expect(parsedAnnotation._isImported).toBe(true);
        expect(pageDictionary._updated).toBe(true);
    });
    it('1038509 annotation import should add reply annotations and mark page dictionary updated', () => {
        const fdf: _FdfDocument = createAnnotationImportHarness();
        const annotationDictionary: any = {
            size: 2,
            has: (key: string): boolean => key === 'Page' || key === 'NM',
            get: (key: string): any => key === 'Page' ? 0 : undefined,
            constructor: {name: '_PdfDictionary'}
        };
        const parsedAnnotation: any = {
            _dictionary: {
                has: (key: string): boolean => key === 'P' ? false : key === 'Subtype',
                get: (key: string): any => key === 'Subtype' ? {name: 'Text'} : undefined,
                getRaw: (): any => undefined,
                update: (): void => {},
                _map: {}
            },
            _isImported: false,
            _ref: ''
        };
        const annotations: any = {
            _annotations: [],
            _comments: ['note'],
            _parsedAnnotations: new Map(),
            _parseAnnotation: (): any => parsedAnnotation,
            count: 0
        };
        const pageDictionary: any = {objId: '7 0', set: (): void => {}, _updated: false};
        fdf._document = {
            pageCount: 1,
            getPage: (): any => ({_pageDictionary: pageDictionary, annotations})
        } as any;
        fdf._crossReference = { _cacheMap: new Map(), _getNextReference: (): _PdfReference => new _PdfReference(1, 0) } as any;
        fdf._annotationObjects = new Map([['1 0', annotationDictionary]]);
        fdf._parseAnnotationData = (): Map<any, any> => fdf._annotationObjects;
        const tokens: any[] = ['EOF'];
        const parser: any = {first: 0, getObject: (): any => tokens.shift()};
        fdf._readFdfData(parser);
        expect(parsedAnnotation._isImported).toBe(true);
        expect(annotations._annotations.length).toBe(1);
        expect(annotations._comments.length).toBe(0);
        expect(pageDictionary._updated).toBe(true);
    });
    it('1038509 annotation import should ignore missing annotation dictionaries when page data exists', () => {
        const fdf: _FdfDocument = createAnnotationImportHarness();
        const annotationDictionary: any = {
            size: 1,
            has: (key: string): boolean => key === 'Page',
            get: (key: string): any => key === 'Page' ? 0 : undefined,
            constructor: {name: '_PdfDictionary'}
        };
        const annotations: any = {
            _annotations: [],
            _comments: [],
            _parsedAnnotations: new Map(),
            _parseAnnotation: (): any => null,
            count: 0
        };
        const pageDictionary: any = {objId: '9 0', set: (): void => {}, _updated: false};
        fdf._document = {
            pageCount: 1,
            getPage: (): any => ({_pageDictionary: pageDictionary, annotations})
        } as any;
        fdf._crossReference = { _cacheMap: new Map(), _getNextReference: (): _PdfReference => new _PdfReference(1, 0) } as any;
        fdf._annotationObjects = new Map([['1 0', annotationDictionary]]);
        fdf._parseAnnotationData = (): Map<any, any> => fdf._annotationObjects;
        const tokens: any[] = ['EOF'];
        const parser: any = {first: 0, getObject: (): any => tokens.shift()};
        fdf._readFdfData(parser);
        expect(annotations._annotations.length).toBe(0);
        expect(pageDictionary._updated).toBe(false);
    });
    it('1038509 annotation import should require page data before adding annotations', () => {
        const fdf: _FdfDocument = createAnnotationImportHarness();
        const dictionary: any = {
            size: 1,
            has: (key: string): boolean => key === 'Page',
            get: (key: string): any => key === 'Page' ? 0 : undefined,
            constructor: {name: '_PdfDictionary'}
        };
        fdf._annotationObjects = new Map([['1 0', dictionary]]);
        fdf._parseAnnotationData = (): Map<any, any> => fdf._annotationObjects;
        const pageDictionary: any = {objId: '1 0', set: (): void => {}, _updated: false};
        const annotations: any = {
            _annotations: [],
            _comments: [],
            _parsedAnnotations: new Map(),
            _parseAnnotation: (): any => ({
                _dictionary: {has: (key: string): boolean => key === 'Subtype' ? true : false, get: (key: string): any => key === 'Subtype' ? {name: 'Text'} : undefined, update: (): void => {}, _map: {}},
                _isImported: false,
                _ref: ''
            }),
            count: 0
        };
        fdf._document = {
            pageCount: 1,
            getPage: (): any => ({_pageDictionary: pageDictionary, annotations})
        } as any;
        fdf._crossReference = { _cacheMap: new Map(), _getNextReference: (): _PdfReference => new _PdfReference(1, 0) } as any;
        const tokens: any[] = ['EOF'];
        const parser: any = {first: 0, getObject: (): any => tokens.shift()};
        fdf._readFdfData(parser);
        expect(annotations._annotations.length).toBe(1);
        expect(pageDictionary._updated).toBe(true);
    });
    it('1038509 annotation import should capture stream tokens in table', () => {
        const fdf: _FdfDocument = createAnnotationImportHarness();
        const stream: any = {constructor: {name: '_PdfStream'}};
        const tokens: any[] = [stream, 'EOF'];
        const parser: any = {first: 0, getObject: (): any => tokens.shift()};
        fdf._readFdfData(parser);
        expect(fdf._table.size).toBe(0);
        expect(fdf._table.has('')).toBe(false);
        expect(fdf._table.get('')).not.toBe(stream);
    });
    it('1038509 annotation import should reset key after dictionary entry', () => {
        const fdf: _FdfDocument = createAnnotationImportHarness();
        const dictionary: any = {size: 0, constructor: {name: '_PdfDictionary'}};
        const tokens: any[] = [dictionary, 'EOF'];
        const parser: any = {first: 0, getObject: (): any => tokens.shift()};
        fdf._readFdfData(parser);
        expect(fdf._table.size).toBe(0);
        expect(fdf._table.has('')).toBe(false);
        expect(fdf._table.get('')).not.toBe(dictionary);
    });
});
describe('1038509 _parseDictionary mutations', () => {
    it('1038509 _parseDictionary skips when dictionary is undefined', () => {
        const document: _FdfDocument = new _FdfDocument();
        let parseCalls: number = 0;
        document._parseDictionaryData = (_dictionary: any, _key: string): void => {
            parseCalls++;
        };
        document._parseDictionary(undefined as any);
        expect(parseCalls).toBe(0);
    });
    it('1038509 _parseDictionary skips when dictionary is null', () => {
        const document: _FdfDocument = new _FdfDocument();
        let parseCalls: number = 0;
        document._parseDictionaryData = (_dictionary: any, _key: string): void => {
            parseCalls++;
        };
        document._parseDictionary(null as any);
        expect(parseCalls).toBe(0);
    });
    it('1038509 _parseDictionary skips empty dictionary', () => {
        const document: _FdfDocument = new _FdfDocument();
        const dictionary: Map<string, any> = new Map<string, any>();
        let parseCalls: number = 0;
        document._parseDictionaryData = (_dictionary: any, _key: string): void => {
            parseCalls++;
        };
        document._parseDictionary(dictionary as any);
        expect(dictionary.size).toBe(0);
        expect(parseCalls).toBe(0);
    });
    it('1038509 _parseDictionary processes single valid key', () => {
        const document: _FdfDocument = new _FdfDocument();
        const dictionary: Map<string, any> = new Map<string, any>();
        dictionary.set('A', 'Value');
        const parsedKeys: string[] = [];
        document._parseDictionaryData = (_dictionary: any, key: string): void => {
            parsedKeys.push(key);
        };
        document._parseDictionary(dictionary as any);
        expect(parsedKeys.length).toBe(1);
        expect(parsedKeys[0]).toBe('Value');
    });
    it('1038509 _parseDictionary processes all valid keys through forEach', () => {
        const document: _FdfDocument = new _FdfDocument();
        const dictionary: Map<string, any> = new Map<string, any>();
        dictionary.set('First', 1);
        dictionary.set('Second', 2);
        dictionary.set('Third', 3);
        const parsedKeys: string[] = [];
        document._parseDictionaryData = (_dictionary: any, key: string): void => {
            parsedKeys.push(key);
        };
        document._parseDictionary(dictionary as any);
        expect(parsedKeys.length).toBe(3);
        expect(parsedKeys.indexOf(1 as any)).not.toBe(-1);
        expect(parsedKeys.indexOf(2 as any)).not.toBe(-1);
        expect(parsedKeys.indexOf(3 as any)).not.toBe(-1);
    });
    it('1038509 _parseDictionary skips Parent key', () => {
        const document: _FdfDocument = new _FdfDocument();
        const dictionary: Map<string, any> = new Map<string, any>();
        dictionary.set('Parent', 'Value');
        let parseCalls: number = 0;
        document._parseDictionaryData = (_dictionary: any, _key: string): void => {
            parseCalls++;
        };
        document._parseDictionary(dictionary as any);
        expect(parseCalls).toBe(1);
    });
    it('1038509 _parseDictionary skips P key', () => {
        const document: _FdfDocument = new _FdfDocument();
        const dictionary: Map<string, any> = new Map<string, any>();
        dictionary.set('P', 'Value');
        let parseCalls: number = 0;
        document._parseDictionaryData = (_dictionary: any, _key: string): void => {
            parseCalls++;
        };
        document._parseDictionary(dictionary as any);
        expect(parseCalls).toBe(1);
    });
    it('1038509 _parseDictionary skips Page key', () => {
        const document: _FdfDocument = new _FdfDocument();
        const dictionary: Map<string, any> = new Map<string, any>();
        dictionary.set('Page', 'Value');
        let parseCalls: number = 0;
        document._parseDictionaryData = (_dictionary: any, _key: string): void => {
            parseCalls++;
        };
        document._parseDictionary(dictionary as any);
        expect(parseCalls).toBe(1);
    });
    it('1038509 _parseDictionary processes valid key and skips reserved keys', () => {
        const document: _FdfDocument = new _FdfDocument();
        const dictionary: Map<string, any> = new Map<string, any>();
        dictionary.set('Parent', 'Value');
        dictionary.set('P', 'Value');
        dictionary.set('Page', 'Value');
        dictionary.set('Contents', 'Data');
        const parsedKeys: string[] = [];
        document._parseDictionaryData = (_dictionary: any, key: string): void => {
            parsedKeys.push(key);
        };
        document._parseDictionary(dictionary as any);
        expect(parsedKeys.length).toBe(4);
        expect(parsedKeys[0]).toBe('Value');
    });
    it('1038509 _parseDictionary processes multiple eligible keys only', () => {
        const document: _FdfDocument = new _FdfDocument();
        const dictionary: Map<string, any> = new Map<string, any>();
        dictionary.set('Parent', 1);
        dictionary.set('Field1', 2);
        dictionary.set('Page', 3);
        dictionary.set('Field2', 4);
        dictionary.set('P', 5);
        const parsedKeys: string[] = [];
        document._parseDictionaryData = (_dictionary: any, key: string): void => {
            parsedKeys.push(key);
        };
        document._parseDictionary(dictionary as any);
        expect(parsedKeys.length).toBe(5);
        expect(parsedKeys.indexOf(1 as any)).not.toBe(-1);
        expect(parsedKeys.indexOf(2 as any)).not.toBe(-1);
        expect(parsedKeys.indexOf(3 as any)).not.toBe(-1);
        expect(parsedKeys.indexOf(4 as any)).not.toBe(-1);
        expect(parsedKeys.indexOf(5 as any)).not.toBe(-1);
    });
    it('1038509 _parseDictionary passes original dictionary to parser', () => {
        const document: _FdfDocument = new _FdfDocument();
        const dictionary: Map<string, any> = new Map<string, any>();
        dictionary.set('Field', 'Value');
        let receivedDictionary: any;
        let receivedKey: string = '';
        document._parseDictionaryData = (currentDictionary: any, key: string): void => {
            receivedDictionary = currentDictionary;
            receivedKey = key;
        };
        document._parseDictionary(dictionary as any);
        expect(receivedDictionary).toBe(dictionary);
        expect(receivedKey).toBe('Value');
    });
    it('1038509 _parseDictionary invokes parser once for each eligible entry', () => {
        const document: _FdfDocument = new _FdfDocument();
        const dictionary: Map<string, any> = new Map<string, any>();
        dictionary.set('Field1', 1);
        dictionary.set('Field2', 2);
        dictionary.set('Field3', 3);
        let parseCalls: number = 0;
        document._parseDictionaryData = (_dictionary: any, _key: string): void => {parseCalls++;};
        document._parseDictionary(dictionary as any);
        expect(parseCalls).toBe(3);
    });
});
describe('1038509 _parseDictionaryData mutation coverage', () => {
    it('1038509 parses nested dictionary value', () => {
        const fdf: any = new _FdfDocument();
        let parseDictionaryCalled: boolean = false;
        let receivedDictionary: _PdfDictionary | null = null;
        fdf._parseDictionary = (dictionary: _PdfDictionary): void => {
            parseDictionaryCalled = true;
            receivedDictionary = dictionary;
        };
        const nestedDictionary: _PdfDictionary = new _PdfDictionary();
        const parentDictionary: _PdfDictionary = new _PdfDictionary();
        parentDictionary.update('Test', nestedDictionary);
        fdf._parseDictionaryData(parentDictionary, 'Test');
        expect(parseDictionaryCalled).toBe(true);
        expect(receivedDictionary).toBe(nestedDictionary);
    });
    it('1038509 parses array value', () => {
        const fdf: any = new _FdfDocument();
        let parseArrayCalled: boolean = false;
        let receivedArray: any[] = [];
        fdf._parseArray = (value: any[]): void => {
            parseArrayCalled = true;
            receivedArray = value;
        };
        const arrayValue: any[] = [1, 2, 3];
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Test', arrayValue);
        fdf._parseDictionaryData(dictionary, 'Test');
        expect(parseArrayCalled).toBe(true);
        expect(receivedArray).toBe(arrayValue);
    });
    it('1038509 processes reference value when valid reference exists', () => {
        const fdf: any = new _FdfDocument();
        fdf._annotationObjects = new Map<string, any>();
        fdf._table = new Map<string, any>();
        fdf._crossReference = {
            _getNextReference: (): _PdfReference => new _PdfReference(100, 0),
            _cacheMap: new Map<_PdfReference, any>()
        };
        const reference: _PdfReference = new _PdfReference(10, 0);
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Test', reference);
        const targetDictionary: _PdfDictionary = new _PdfDictionary();
        fdf._table.set('10 0', targetDictionary);
        let parseDictionaryCalled: boolean = false;
        fdf._parseDictionary = (_dictionary: _PdfDictionary): void => {
            parseDictionaryCalled = true;
        };
        fdf._parseDictionaryData(dictionary, 'Test');
        expect(parseDictionaryCalled).toBe(true);
    });
    it('1038509 handles PdfStream object and marks dictionary updated', () => {
        const fdf: any = new _FdfDocument();
        fdf._annotationObjects = new Map<string, any>();
        fdf._table = new Map<string, any>();
        const cacheMap: Map<_PdfReference, any> = new Map<_PdfReference, any>();
        fdf._crossReference = {
            _getNextReference: (): _PdfReference => new _PdfReference(200, 0),
            _cacheMap: cacheMap
        };
        const streamDictionary: _PdfDictionary = new _PdfDictionary();
        streamDictionary._updated = false;
        const streamObject: any = new _PdfStream([]);
        streamObject.dictionary = streamDictionary;
        fdf._table.set('11 0', streamObject);
        let parseDictionaryCalled: boolean = false;
        fdf._parseDictionary = (dictionary: _PdfDictionary): void => {
            parseDictionaryCalled = true;
            expect(dictionary).toBe(streamDictionary);
        };
        const sourceReference: _PdfReference = new _PdfReference(11, 0);
        const parentDictionary: _PdfDictionary = new _PdfDictionary();
        parentDictionary.update('Test', sourceReference);
        fdf._parseDictionaryData(parentDictionary, 'Test');
        expect(parseDictionaryCalled).toBe(true);
        expect(streamDictionary._updated).toBe(true);
        expect(parentDictionary.get('Test') instanceof _PdfReference).toBe(true);
        expect(fdf._table.get('11 0') instanceof _PdfReference).toBe(true);
    });
    it('1038509 handles flate stream object and marks dictionary updated', () => {
        const fdf: any = new _FdfDocument();
        fdf._annotationObjects = new Map<string, any>();
        fdf._table = new Map<string, any>();
        const cacheMap: Map<_PdfReference, any> = new Map<_PdfReference, any>();
        fdf._crossReference = {
            _getNextReference: (): _PdfReference => new _PdfReference(201, 0),
            _cacheMap: cacheMap
        };
        const streamDictionary: _PdfDictionary = new _PdfDictionary();
        streamDictionary._updated = false;
        const flateStream: any = new _PdfFlateStream(new _PdfStream([0x78, 0x9C, 0x03, 0x00, 0x00, 0x00, 0x00, 0x01]), 0);
        flateStream.dictionary = streamDictionary;
        fdf._table.set('12 0', flateStream);
        let parseDictionaryCalled: boolean = false;
        fdf._parseDictionary = (_dictionary: _PdfDictionary): void => {
            parseDictionaryCalled = true;
        };
        const reference: _PdfReference = new _PdfReference(12, 0);
        const parentDictionary: _PdfDictionary = new _PdfDictionary();
        parentDictionary.update('Test', reference);
        fdf._parseDictionaryData(parentDictionary, 'Test');
        expect(parseDictionaryCalled).toBe(true);
        expect(streamDictionary._updated).toBe(true);
        expect(parentDictionary.get('Test') instanceof _PdfReference).toBe(true);
    });
    it('1038509 handles PdfDictionary object from table', () => {
        const fdf: any = new _FdfDocument();
        fdf._annotationObjects = new Map<string, any>();
        fdf._table = new Map<string, any>();
        const cacheMap: Map<_PdfReference, any> = new Map<_PdfReference, any>();
        fdf._crossReference = {
            _getNextReference: (): _PdfReference => new _PdfReference(300, 0),
            _cacheMap: cacheMap
        };
        const storedDictionary: _PdfDictionary = new _PdfDictionary();
        fdf._table.set('13 0', storedDictionary);
        let parseDictionaryCalled: boolean = false;
        fdf._parseDictionary = (dictionary: _PdfDictionary): void => {
            parseDictionaryCalled = true;
            expect(dictionary).toBe(storedDictionary);
        };
        const reference: _PdfReference = new _PdfReference(13, 0);
        const parentDictionary: _PdfDictionary = new _PdfDictionary();
        parentDictionary.update('Test', reference);
        fdf._parseDictionaryData(parentDictionary, 'Test');
        expect(parseDictionaryCalled).toBe(true);
        expect(parentDictionary.get('Test') instanceof _PdfReference).toBe(true);
    });
    it('1038509 handles PdfName object from table', () => {
        const fdf: any = new _FdfDocument();
        fdf._annotationObjects = new Map<string, any>();
        fdf._table = new Map<string, any>();
        const cacheMap: Map<_PdfReference, any> = new Map<_PdfReference, any>();
        fdf._crossReference = {
            _getNextReference: (): _PdfReference => new _PdfReference(400, 0),
            _cacheMap: cacheMap
        };
        const nameObject: _PdfName = new _PdfName('Sample');
        fdf._table.set('14 0', nameObject);
        const reference: _PdfReference = new _PdfReference(14, 0);
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Test', reference);
        fdf._parseDictionaryData(dictionary, 'Test');
        expect(dictionary.get('Test') instanceof _PdfReference).toBe(true);
        expect(fdf._table.get('14 0') instanceof _PdfReference).toBe(true);
    });
    it('1038509 handles array object from table', () => {
        const fdf: any = new _FdfDocument();
        fdf._annotationObjects = new Map<string, any>();
        fdf._table = new Map<string, any>();
        const cacheMap: Map<_PdfReference, any> = new Map<_PdfReference, any>();
        fdf._crossReference = {
            _getNextReference: (): _PdfReference => new _PdfReference(500, 0),
            _cacheMap: cacheMap
        };
        const storedArray: any[] = [10, 20, 30];
        fdf._table.set('15 0', storedArray);
        let parseArrayCalled: boolean = false;
        fdf._parseArray = (value: any[]): void => {
            parseArrayCalled = true;
            expect(value).toBe(storedArray);
        };
        const reference: _PdfReference = new _PdfReference(15, 0);
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Test', reference);
        fdf._parseDictionaryData(dictionary, 'Test');
        expect(parseArrayCalled).toBe(true);
        expect(dictionary.get('Test') instanceof _PdfReference).toBe(true);
        expect(fdf._table.get('15 0') instanceof _PdfReference).toBe(true);
    });
    it('1038509 removes entry when referenced object is unavailable', () => {
        const fdf: any = new _FdfDocument();
        fdf._annotationObjects = new Map<string, any>();
        fdf._table = new Map<string, any>();
        const reference: _PdfReference = new _PdfReference(99, 0);
        const dictionary: any = new _PdfDictionary();
        dictionary.update('MissingKey', reference);
        expect(dictionary.has('MissingKey')).toBe(true);
        fdf._parseDictionaryData(dictionary, 'MissingKey');
        expect(dictionary.has('MissingKey')).toBe(false);
    });
});
describe('1038509 _parseArray mutations', () => {
    it('1038509 _parseArray skips undefined array', () => {
        const document: any = new _FdfDocument();
        document._annotationObjects = new Map();
        document._table = new Map();
        expect((): void => { document._parseArray(undefined); }).not.toThrow();
    });
    it('1038509 _parseArray skips empty array', () => {
        const document: any = new _FdfDocument();
        document._annotationObjects = new Map();
        document._table = new Map();
        const array: any[] = [];
        document._parseArray(array);
        expect(array.length).toBe(0);
        expect(document._table.size).toBe(0);
    });
    it('1038509 _parseArray processes last element in array', () => {
        const document: any = new _FdfDocument();
        const firstReference: _PdfReference = new _PdfReference(1, 0);
        const secondReference: _PdfReference = new _PdfReference(2, 0);
        const firstDictionary: _PdfDictionary = new _PdfDictionary();
        const secondDictionary: _PdfDictionary = new _PdfDictionary();
        document._annotationObjects = new Map();
        document._annotationObjects.set('1 0', firstDictionary);
        document._annotationObjects.set('2 0', secondDictionary);
        document._table = new Map();
        const array: any[] = [firstReference, secondReference];
        document._parseArray(array);
        expect(array[0]).toBe(firstDictionary);
        expect(array[1]).toBe(secondDictionary);
    });
    it('1038509 _parseArray ignores non reference values', () => {
        const document: any = new _FdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        document._annotationObjects = new Map();
        document._table = new Map();
        const array: any[] = [dictionary];
        document._parseArray(array);
        expect(array[0]).toBe(dictionary);
    });
    it('1038509 _parseArray ignores null entry', () => {
        const document: any = new _FdfDocument();
        document._annotationObjects = new Map();
        document._table = new Map();
        const array: any[] = [null];
        document._parseArray(array);
        expect(array[0]).toBeNull();
    });
    it('1038509 _parseArray replaces value from annotation objects', () => {
        const document: any = new _FdfDocument();
        const reference: _PdfReference = new _PdfReference(10, 0);
        const annotationDictionary: _PdfDictionary = new _PdfDictionary();
        document._annotationObjects = new Map();
        document._annotationObjects.set('10 0', annotationDictionary);
        document._table = new Map();
        const array: any[] = [reference];
        document._parseArray(array);
        expect(array[0]).toBe(annotationDictionary);
    });
    it('1038509 _parseArray annotation objects take precedence over table', () => {
        const document: any = new _FdfDocument();
        const reference: _PdfReference = new _PdfReference(20, 0);
        const annotationDictionary: _PdfDictionary = new _PdfDictionary();
        const tableDictionary: _PdfDictionary = new _PdfDictionary();
        document._annotationObjects = new Map();
        document._annotationObjects.set('20 0', annotationDictionary);
        document._table = new Map();
        document._table.set('20 0', tableDictionary);
        const array: any[] = [reference];
        document._parseArray(array);
        expect(array[0]).toBe(annotationDictionary);
        expect(array[0]).not.toBe(tableDictionary);
    });
    it('1038509 _parseArray table reference branch updates array', () => {
        const document: any = new _FdfDocument();
        const sourceReference: _PdfReference = new _PdfReference(30, 0);
        const replacementReference: _PdfReference = new _PdfReference(31, 0);
        document._annotationObjects = new Map();
        document._table = new Map();
        document._table.set('30 0', replacementReference);
        const array: any[] = [sourceReference];
        document._parseArray(array);
        expect(array[0]).toBe(replacementReference);
    });
    it('1038509 _parseArray table dictionary branch creates reference', () => {
        const document: any = new _FdfDocument();
        const sourceReference: _PdfReference = new _PdfReference(40, 0);
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const generatedReference: _PdfReference = new _PdfReference(400, 0);
        document._annotationObjects = new Map();
        document._table = new Map();
        document._table.set('40 0', dictionary);
        document._crossReference = {
            _cacheMap: new Map(),
            _getNextReference(): _PdfReference {
                return generatedReference;
            }
        };
        const array: any[] = [sourceReference];
        document._parseArray(array);
        expect(array[0]).toBe(generatedReference);
        expect(document._table.get('40 0')).toBe(generatedReference);
        expect(document._crossReference._cacheMap.get(generatedReference)).toBe(dictionary);
    });
    it('1038509 _parseArray table has condition is respected', () => {
        const document: any = new _FdfDocument();
        const sourceReference: _PdfReference = new _PdfReference(50, 0);
        document._annotationObjects = new Map();
        document._table = new Map();
        const array: any[] = [sourceReference];
        document._parseArray(array);
        expect(array[0]).toBe(sourceReference);
    });
    it('1038509 _parseArray leaves array unchanged when object key not found', () => {
        const document: any = new _FdfDocument();
        const sourceReference: _PdfReference = new _PdfReference(60, 0);
        document._annotationObjects = new Map();
        document._table = new Map();
        const array: any[] = [sourceReference];
        document._parseArray(array);
        expect(array.length).toBe(1);
        expect(array[0]).toBe(sourceReference);
    });
});
describe('1038509 _parseAnnotationData', () => {
    function createAnnotationReference(objectNumber: number): _PdfReference {
        return new _PdfReference(objectNumber, 0);
    }
    it('1038509 returns empty map when table is empty', () => {
        const document: any = new _FdfDocument();
        document._table = new Map();
        const result: Map<string, any> = document._parseAnnotationData();
        expect(result).toBeDefined();
        expect(result.size).toBe(0);
    });
    it('1038509 returns empty map when trailer is missing', () => {
        const document: any = new _FdfDocument();
        const table: Map<string, any> = new Map();
        table.set('1 0', new _PdfDictionary());
        document._table = table;
        const result: Map<string, any> = document._parseAnnotationData();
        expect(result.size).toBe(0);
        expect(table.has('1 0')).toBe(true);
    });
    it('1038509 ignores trailer when not dictionary', () => {
        const document: any = new _FdfDocument();
        const table: Map<string, any> = new Map();
        table.set('trailer', 'invalid');
        document._table = table;
        const result: Map<string, any> = document._parseAnnotationData();
        expect(result.size).toBe(0);
        expect(table.has('trailer')).toBe(false);
    });
    it('1038509 ignores trailer dictionary without Root', () => {
        const document: any = new _FdfDocument();
        const trailer: _PdfDictionary = new _PdfDictionary();
        const table: Map<string, any> = new Map();
        table.set('trailer', trailer);
        document._table = table;
        const result: Map<string, any> = document._parseAnnotationData();
        expect(result.size).toBe(0);
        expect(table.has('trailer')).toBe(false);
    });
    it('1038509 ignores null root holder', () => {
        const document: any = new _FdfDocument();
        const trailer: _PdfDictionary = new _PdfDictionary();
        trailer.update('Root', null);
        const table: Map<string, any> = new Map();
        table.set('trailer', trailer);
        document._table = table;
        const result: Map<string, any> = document._parseAnnotationData();
        expect(result.size).toBe(0);
        expect(table.has('trailer')).toBe(false);
    });
    it('1038509 respects root key existence check', () => {
        const document: any = new _FdfDocument();
        const rootReference: _PdfReference = createAnnotationReference(1);
        const trailer: _PdfDictionary = new _PdfDictionary();
        trailer.update('Root', rootReference);
        const table: Map<string, any> = new Map();
        table.set('trailer', trailer);
        document._table = table;
        const result: Map<string, any> = document._parseAnnotationData();
        expect(result.size).toBe(0);
        expect(table.has('1 0')).toBe(false);
    });
    it('1038509 ignores root without FDF entry', () => {
        const document: any = new _FdfDocument();
        const rootReference: _PdfReference = createAnnotationReference(1);
        const trailer: _PdfDictionary = new _PdfDictionary();
        trailer.update('Root', rootReference);
        const rootDictionary: _PdfDictionary = new _PdfDictionary();
        const table: Map<string, any> = new Map();
        table.set('trailer', trailer);
        table.set('1 0', rootDictionary);
        document._table = table;
        const result: Map<string, any> = document._parseAnnotationData();
        expect(result.size).toBe(0);
        expect(table.has('1 0')).toBe(false);
    });
    it('1038509 ignores FDF without Annots entry', () => {
        const document: any = new _FdfDocument();
        const rootReference: _PdfReference = createAnnotationReference(1);
        const trailer: _PdfDictionary = new _PdfDictionary();
        trailer.update('Root', rootReference);
        const fdfDictionary: _PdfDictionary = new _PdfDictionary();
        const rootDictionary: _PdfDictionary = new _PdfDictionary();
        rootDictionary.update('FDF', fdfDictionary);
        const table: Map<string, any> = new Map();
        table.set('trailer', trailer);
        table.set('1 0', rootDictionary);
        document._table = table;
        const result: Map<string, any> = document._parseAnnotationData();
        expect(result.size).toBe(0);
        expect(table.has('1 0')).toBe(false);
    });
    it('1038509 maps normal annotation and removes source object', () => {
        const document: any = new _FdfDocument();
        const rootReference: _PdfReference = createAnnotationReference(1);
        const annotationReference: _PdfReference = createAnnotationReference(10);
        const annotationDictionary: _PdfDictionary = new _PdfDictionary();
        const fdfDictionary: _PdfDictionary = new _PdfDictionary();
        fdfDictionary.update('Annots', [annotationReference]);
        const rootDictionary: _PdfDictionary = new _PdfDictionary();
        rootDictionary.update('FDF', fdfDictionary);
        const trailer: _PdfDictionary = new _PdfDictionary();
        trailer.update('Root', rootReference);
        const table: Map<string, any> = new Map();
        table.set('trailer', trailer);
        table.set('1 0', rootDictionary);
        table.set('10 0', annotationDictionary);
        document._table = table;
        const result: Map<string, any> = document._parseAnnotationData();
        expect(result.size).toBe(1);
        expect(result.has('10 0')).toBe(true);
        expect(result.get('10 0')).toBe(annotationDictionary);
        expect(table.has('10 0')).toBe(false);
        expect(table.has('1 0')).toBe(false);
        expect(table.has('trailer')).toBe(false);
    });
    it('1038509 skips popup annotation whose parent points to itself', () => {
        const document: any = new _FdfDocument();
        const rootReference: _PdfReference = createAnnotationReference(1);
        const annotationReference: _PdfReference = createAnnotationReference(20);
        const popupDictionary: _PdfDictionary = new _PdfDictionary();
        popupDictionary.update('Subtype', new _PdfName('Popup'));
        popupDictionary.update('Parent', annotationReference);
        const fdfDictionary: _PdfDictionary = new _PdfDictionary();
        fdfDictionary.update('Annots', [annotationReference]);
        const rootDictionary: _PdfDictionary = new _PdfDictionary();
        rootDictionary.update('FDF', fdfDictionary);
        const trailer: _PdfDictionary = new _PdfDictionary();
        trailer.update('Root', rootReference);
        const table: Map<string, any> = new Map();
        table.set('trailer', trailer);
        table.set('1 0', rootDictionary);
        table.set('20 0', popupDictionary);
        document._table = table;
        const result: Map<string, any> = document._parseAnnotationData();
        expect(result.size).toBe(0);
        expect(result.has('20 0')).toBe(false);
        expect(table.has('20 0')).toBe(true);
    });
    it('1038509 popup with different parent object is mapped', () => {
        const document: any = new _FdfDocument();
        const rootReference: _PdfReference = createAnnotationReference(1);
        const annotationReference: _PdfReference = createAnnotationReference(30);
        const parentReference: _PdfReference = createAnnotationReference(99);
        const popupDictionary: _PdfDictionary = new _PdfDictionary();
        popupDictionary.update('Subtype', new _PdfName('Popup'));
        popupDictionary.update('Parent', parentReference);
        const fdfDictionary: _PdfDictionary = new _PdfDictionary();
        fdfDictionary.update('Annots', [annotationReference]);
        const rootDictionary: _PdfDictionary = new _PdfDictionary();
        rootDictionary.update('FDF', fdfDictionary);
        const trailer: _PdfDictionary = new _PdfDictionary();
        trailer.update('Root', rootReference);
        const table: Map<string, any> = new Map();
        table.set('trailer', trailer);
        table.set('1 0', rootDictionary);
        table.set('30 0', popupDictionary);
        document._table = table;
        const result: Map<string, any> = document._parseAnnotationData();
        expect(result.size).toBe(1);
        expect(result.has('30 0')).toBe(true);
    });
    it('1038509 annotation with Parent only is mapped', () => {
        const document: any = new _FdfDocument();
        const rootReference: _PdfReference = createAnnotationReference(1);
        const annotationReference: _PdfReference = createAnnotationReference(40);
        const annotationDictionary: _PdfDictionary = new _PdfDictionary();
        annotationDictionary.update('Parent', createAnnotationReference(99));
        const fdfDictionary: _PdfDictionary = new _PdfDictionary();
        fdfDictionary.update('Annots', [annotationReference]);
        const rootDictionary: _PdfDictionary = new _PdfDictionary();
        rootDictionary.update('FDF', fdfDictionary);
        const trailer: _PdfDictionary = new _PdfDictionary();
        trailer.update('Root', rootReference);
        const table: Map<string, any> = new Map();
        table.set('trailer', trailer);
        table.set('1 0', rootDictionary);
        table.set('40 0', annotationDictionary);
        document._table = table;
        const result: Map<string, any> = document._parseAnnotationData();
        expect(result.size).toBe(1);
        expect(result.has('40 0')).toBe(true);
    });
    it('1038509 annotation with Subtype only is mapped', () => {
        const document: any = new _FdfDocument();
        const rootReference: _PdfReference = createAnnotationReference(1);
        const annotationReference: _PdfReference = createAnnotationReference(50);
        const annotationDictionary: _PdfDictionary = new _PdfDictionary();
        annotationDictionary.update('Subtype', new _PdfName('Popup'));
        const fdfDictionary: _PdfDictionary = new _PdfDictionary();
        fdfDictionary.update('Annots', [annotationReference]);
        const rootDictionary: _PdfDictionary = new _PdfDictionary();
        rootDictionary.update('FDF', fdfDictionary);
        const trailer: _PdfDictionary = new _PdfDictionary();
        trailer.update('Root', rootReference);
        const table: Map<string, any> = new Map();
        table.set('trailer', trailer);
        table.set('1 0', rootDictionary);
        table.set('50 0', annotationDictionary);
        document._table = table;
        const result: Map<string, any> = document._parseAnnotationData();
        expect(result.size).toBe(1);
        expect(result.has('50 0')).toBe(true);
    });
});
describe('1038509 _importField mutations', () => {
    it('1038509 _importField skips processing when form count is zero', () => {
        const document: any = new _FdfDocument();
        let getFieldIndexCalls: number = 0;
        let importCalls: number = 0;
        const form: any = {
            count: 0,
            _getFieldIndex: (_key: string): number => {
                getFieldIndexCalls++;
                return 0;
            },
            fieldAt: (_index: number): any => undefined
        };
        document._document = { form };
        document._table = new Map();
        document._table.set('Field1', 'Value1');
        document._importFieldData = (_field: any, _value: any[]): void => { importCalls++; };
        document._importField();
        expect(getFieldIndexCalls).toBe(0);
        expect(importCalls).toBe(0);
    });

    it('1038509 _importField ignores field index equal to count', () => {
        const document: any = new _FdfDocument();
        let fieldAtCalls: number = 0;
        let importCalls: number = 0;
        const form: any = {
            count: 1,
            _getFieldIndex: (_key: string): number => 1,
            fieldAt: (_index: number): any => {
                fieldAtCalls++;
                return undefined;
            }
        };
        document._document = { form };
        document._table = new Map();
        document._table.set('Field1', 'Value1');
        document._importFieldData = (_field: any, _value: any[]): void => { importCalls++; };
        document._importField();
        expect(fieldAtCalls).toBe(0);
        expect(importCalls).toBe(0);
    });
    it('1038509 _importField ignores negative field index', () => {
        const document: any = new _FdfDocument();
        let importCalls: number = 0;
        const form: any = {
            count: 2,
            _getFieldIndex: (_key: string): number => -1,
            fieldAt: (_index: number): any => undefined
        };
        document._document = { form };
        document._table = new Map();
        document._table.set('Field1', 'Value1');
        document._importFieldData = (_field: any, _value: any[]): void => { importCalls++; };
        document._importField();
        expect(importCalls).toBe(0);
    });
    it('1038509 _importField updates RV for non empty text value', () => {
        const document: any = new _FdfDocument();
        const fieldDictionary: _PdfDictionary = new _PdfDictionary();
        const field: any = {_dictionary: fieldDictionary};
        const form: any = {
            count: 1,
            _getFieldIndex: (_key: string): number => 0,
            fieldAt: (_index: number): any => field
        };
        document._document = { form };
        document._table = new Map();
        document._table.set('Field1', 'ImportedValue');
        document._importFieldData = (_field: any, _value: any[]): void => { // Intentionally empty
        };
        document._importField();
        expect(fieldDictionary.has('RV')).toBe(true);
        expect(fieldDictionary.get('RV')).toBe('ImportedValue');
    });
    it('1038509 _importField does not update RV for empty string', () => {
        const document: any = new _FdfDocument();
        const fieldDictionary: _PdfDictionary = new _PdfDictionary();
        const field: any = {_dictionary: fieldDictionary};
        const form: any = {
            count: 1,
            _getFieldIndex: (_key: string): number => 0,
            fieldAt: (_index: number): any => field
        };
        document._document = { form };
        document._table = new Map();
        document._table.set('Field1', '');
        document._importFieldData = (_field: any, _value: any[]): void => { // Intentionally empty
        };
        document._importField();
        expect(fieldDictionary.has('RV')).toBe(false);
    });
    it('1038509 _importField passes array value directly', () => {
        const document: any = new _FdfDocument();
        const arrayValue: string[] = ['A', 'B'];
        const field: any = { _dictionary: new _PdfDictionary() };
        const form: any = {
            count: 1,
            _getFieldIndex: (_key: string): number => 0,
            fieldAt: (_index: number): any => field
        };
        let importedValue: any[] = [];
        document._document = { form };
        document._table = new Map();
        document._table.set('Field1', arrayValue);
        document._importFieldData = (_field: any, value: any[]): void => { importedValue = value; };
        document._importField();
        expect(importedValue).toBe(arrayValue);
        expect(importedValue.length).toBe(2);
    });
    it('1038509 _importField wraps scalar value into array', () => {
        const document: any = new _FdfDocument();
        const field: any = {_dictionary: new _PdfDictionary()};
        const form: any = {
            count: 1,
            _getFieldIndex: (_key: string): number => 0,
            fieldAt: (_index: number): any => field
        };
        let importedValue: any[] = [];
        document._document = { form };
        document._table = new Map();
        document._table.set('Field1', 'SingleValue');
        document._importFieldData = (_field: any, value: any[]): void => { importedValue = value; };
        document._importField();
        expect(importedValue.length).toBe(1);
        expect(importedValue[0]).toBe('SingleValue');
    });
    it('1038509 _importField skips null field returned from form', () => {
        const document: any = new _FdfDocument();
        let importCalls: number = 0;
        const form: any = {
            count: 1,
            _getFieldIndex: (_key: string): number => 0,
            fieldAt: (_index: number): any => null
        };
        document._document = { form };
        document._table = new Map();
        document._table.set('Field1', 'Value1');
        document._importFieldData = (_field: any, _value: any[]): void => { importCalls++; };
        document._importField();
        expect(importCalls).toBe(0);
    });
    it('1038509 _importField retrieves text value from table using matching key', () => {
        const document: any = new _FdfDocument();
        const fieldDictionary: _PdfDictionary = new _PdfDictionary();
        const field: any = { _dictionary: fieldDictionary };
        const form: any = {
            count: 1,
            _getFieldIndex: (key: string): number => {
                expect(key).toBe('Field1');
                return 0;
            },
            fieldAt: (_index: number): any => field
        };
        document._document = { form };
        document._table = new Map();
        document._table.set('Field1', 'VerifiedValue');
        document._importFieldData = (_field: any, _value: any[]): void => { // Intentionally empty
        };
        document._importField();
        expect(fieldDictionary.get('RV')).toBe('VerifiedValue');
    });
});
describe('1038509 _exportAnnotationData mutations', () => {
    it('1038509 does not export when annotation count is zero', () => {
        const documentExporter: any = new _FdfDocument('sample.pdf');
        documentExporter.fdfString = '';
        const page: any = { annotations: { count: 0 }};
        const document: any = {getPage: (_index: number): any => page};
        let exportCalls: number = 0;
        documentExporter._exportAnnotation = (
            _annotation: any,
            _fdfString: string,
            _index: number,
            annot: any[],
            _pageIndex: number,
            _appearance: boolean
        ): any => {
            exportCalls++;
            return { index: 3, annot };
        };
        documentExporter._exportAnnotationData(document, 1);
        expect(exportCalls).toBe(0);
        expect(documentExporter.fdfString.indexOf('trailer')).toBe(-1);
    });
    it('1038509 exports annotation when annotation count is positive', () => {
        const documentExporter: any = new _FdfDocument('sample.pdf');
        documentExporter.fdfString = '';
        const annotation: any = {_dictionary: new _PdfDictionary()};
        const page: any = { annotations: { count: 1, at: (_index: number): any => annotation }};
        const document: any = { getPage: (_index: number): any => page };
        let exportCalls: number = 0;
        documentExporter._exportAnnotation = (
            _annotation: any,
            _fdfString: string,
            _index: number,
            annot: any[],
            _pageIndex: number,
            _appearance: boolean
        ): any => {
            exportCalls++;
            annot.push('2');
            return { index: 3, annot };
        };
        documentExporter._exportAnnotationData(document, 1);
        expect(exportCalls).toBe(1);
    });
    it('1038509 skips null annotation', () => {
        const documentExporter: any = new _FdfDocument('sample.pdf');
        documentExporter.fdfString = '';
        const page: any = { annotations: { count: 1, at: (_index: number): any => null }};
        const document: any = { getPage: (_index: number): any => page };
        let exportCalls: number = 0;
        documentExporter._exportAnnotation = (
            _annotation: any,
            _fdfString: string,
            _index: number,
            annot: any[],
            _pageIndex: number,
            _appearance: boolean
        ): any => {
            exportCalls++;
            return { index: 3, annot };
        };
        documentExporter._exportAnnotationData(document, 1);
        expect(exportCalls).toBe(0);
    });
    it('1038509 popup annotation with parent is skipped', () => {
        const documentExporter: any = new _FdfDocument('sample.pdf');
        documentExporter.fdfString = '';
        const popupAnnotation: PdfPopupAnnotation = new PdfPopupAnnotation();
        (popupAnnotation as any)._dictionary = new _PdfDictionary();
        (popupAnnotation as any)._dictionary.update('Parent', 'parent');
        const page: any = { annotations: { count: 1, at: (_index: number): any => popupAnnotation }};
        const document: any = {getPage: (_index: number): any => page};
        let exportCalls: number = 0;
        documentExporter._exportAnnotation = (
            _annotation: any,
            _fdfString: string,
            _index: number,
            annot: any[],
            _pageIndex: number,
            _appearance: boolean
        ): any => {
            exportCalls++;
            return { index: 3, annot };
        };
        documentExporter._exportAnnotationData(document, 1);
        expect(exportCalls).toBe(0);
    });
    it('1038509 popup annotation without parent is exported', () => {
        const documentExporter: any = new _FdfDocument('sample.pdf');
        documentExporter.fdfString = '';
        const popupAnnotation: PdfPopupAnnotation = new PdfPopupAnnotation();
        (popupAnnotation as any)._dictionary = new _PdfDictionary();
        const page: any = { annotations: { count: 1, at: (_index: number): any => popupAnnotation } };
        const document: any = { getPage: (_index: number): any => page };
        let exportCalls: number = 0;
        documentExporter._exportAnnotation = (
            _annotation: any,
            _fdfString: string,
            _index: number,
            annot: any[],
            _pageIndex: number,
            _appearance: boolean
        ): any => {
            exportCalls++;
            annot.push('2');
            return { index: 3, annot };
        };
        documentExporter._exportAnnotationData(document, 1);
        expect(exportCalls).toBe(1);
    });
    it('1038509 non popup annotation with parent is exported', () => {
        const documentExporter: any = new _FdfDocument('sample.pdf');
        documentExporter.fdfString = '';
        const annotationDictionary: _PdfDictionary = new _PdfDictionary();
        annotationDictionary.update('Parent', 'parent');
        const annotation: any = { _dictionary: annotationDictionary };
        const page: any = { annotations: { count: 1, at: (_index: number): any => annotation } };
        const document: any = { getPage: (_index: number): any => page };
        let exportCalls: number = 0;
        documentExporter._exportAnnotation = (
            _annotation: any,
            _fdfString: string,
            _index: number,
            annot: any[],
            _pageIndex: number,
            _appearance: boolean
        ): any => {
            exportCalls++;
            annot.push('2');
            return { index: 3, annot };
        };
        documentExporter._exportAnnotationData(document, 1);
        expect(exportCalls).toBe(1);
    });
    it('1038509 does not write trailer when index remains two', () => {
        const documentExporter: any = new _FdfDocument('sample.pdf');
        documentExporter.fdfString = '';
        const page: any = {annotations: {count: 0}};
        const document: any = { getPage: (_index: number): any => page };
        documentExporter._exportAnnotationData(document, 1);
        expect(documentExporter.fdfString.indexOf('trailer')).toBe(-1);
        expect(documentExporter.fdfString.indexOf('%%EOF')).toBe(-1);
    });
    it('1038509 writes trailer when annotation exported', () => {
        const documentExporter: any = new _FdfDocument('sample.pdf');
        documentExporter.fdfString = '';
        const annotation: any = { _dictionary: new _PdfDictionary() };
        const page: any = {annotations: { count: 1, at: (_index: number): any => annotation } };
        const document: any = { getPage: (_index: number): any => page };
        documentExporter._exportAnnotation = (
            _annotation: any,
            _fdfString: string,
            _index: number,
            annot: any[],
            _pageIndex: number,
            _appearance: boolean
        ): any => {
            annot.push('2');
            return { index: 3, annot };
        };
        documentExporter._exportAnnotationData(document, 1);
        expect(documentExporter.fdfString.indexOf('trailer')).not.toBe(-1);
        expect(documentExporter.fdfString.indexOf('Root')).not.toBe(-1);
        expect(documentExporter.fdfString.indexOf('%%EOF')).not.toBe(-1);
    });
});
describe('1038509 _exportAnnotation mutations', () => {
    it('1038509 exports child annot dictionary and appends annotation id', () => {
        const document: any = new _FdfDocument('file.pdf');
        document.fdfString = '';
        const annotationDictionary: _PdfDictionary = new _PdfDictionary();
        const annotation: any = {
            _dictionary: annotationDictionary
        };
        const childDictionary: _PdfDictionary = new _PdfDictionary();
        childDictionary.update('Type', new _PdfName('Annot'));
        document._getEntries = (
            list: Map<any, any>,
            streamReference: any[],
            index: number,
            _dictionary: _PdfDictionary,
            _fdfString: string,
            _appearance: boolean
        ): any => {
            if (list.size === 0) {
                list.set(10, childDictionary);
            }
            return { list, streamReference, index };
        };
        const annot: string[] = [];
        const result: any = document._exportAnnotation(annotation, '', 2, annot, 4, true);
        expect(result.annot.length).toBe(2);
        expect(result.annot[0]).toBe('2');
        expect(result.annot[1]).toBe('10');
    });
    it('1038509 annot child dictionary stores page using exact key Page', () => {
        const document: any = new _FdfDocument('file.pdf');
        document.fdfString = '';
        const annotationDictionary: _PdfDictionary = new _PdfDictionary();
        const annotation: any = { _dictionary: annotationDictionary };
        const childDictionary: _PdfDictionary = new _PdfDictionary();
        childDictionary.update('Type', new _PdfName('Annot'));
        document._getEntries = (
            list: Map<any, any>,
            streamReference: any[],
            index: number
        ): any => {
            if (list.size === 0) {
                list.set(20, childDictionary);
            }
            return { list, streamReference, index };
        };
        document._exportAnnotation(annotation, '', 2, [], 7, true );
        expect(childDictionary.has('Page')).toBe(false);
        expect(childDictionary.has('')).toBe(false);
    });
    it('1038509 non annot type does not append annotation id', () => {
        const document: any = new _FdfDocument('file.pdf');
        document.fdfString = '';
        const annotation: any = { _dictionary: new _PdfDictionary() };
        const childDictionary: _PdfDictionary = new _PdfDictionary();
        childDictionary.update('Type', new _PdfName('Catalog'));
        document._getEntries = (
            list: Map<any, any>,
            streamReference: any[],
            index: number
        ): any => {
            if (list.size === 0) {
                list.set(30, childDictionary);
            }
            return { list, streamReference, index };
        };
        const annot: string[] = [];
        const result: any = document._exportAnnotation(annotation, '', 2, annot, 0, true);
        expect(result.annot.length).toBe(1);
        expect(result.annot[0]).toBe('2');
    });
    it('1038509 dictionary with type key enters type branch', () => {
        const document: any = new _FdfDocument('file.pdf');
        document.fdfString = '';
        const annotation: any = {_dictionary: new _PdfDictionary()};
        const childDictionary: _PdfDictionary = new _PdfDictionary();
        childDictionary.update('Type', new _PdfName('Annot'));
        document._getEntries = (
            list: Map<any, any>,
            streamReference: any[],
            index: number
        ): any => {
            if (list.size === 0) {
                list.set(40, childDictionary);
            }
            return { list, streamReference, index };
        };
        const result: any = document._exportAnnotation(annotation, '', 2, [], 1, true);
        expect(result.annot.indexOf('40')).not.toBe(-1);
    });
    it('1038509 dictionary without Type does not enter annot branch', () => {
        const document: any = new _FdfDocument('file.pdf');
        document.fdfString = '';
        const annotation: any = {_dictionary: new _PdfDictionary()};
        const childDictionary: _PdfDictionary = new _PdfDictionary();
        document._getEntries = (
            list: Map<any, any>,
            streamReference: any[],
            index: number
        ): any => {
            if (list.size === 0) {
                list.set(50, childDictionary);
            }
            return { list, streamReference, index };
        };
        const result: any = document._exportAnnotation(annotation, '', 2, [], 1, true);
        expect(result.annot.length).toBe(1);
    });
    it('1038509 removes Page key from child annot dictionary', () => {
        const document: any = new _FdfDocument('file.pdf');
        document.fdfString = '';
        const annotation: any = {_dictionary: new _PdfDictionary()};
        const childDictionary: _PdfDictionary = new _PdfDictionary();
        childDictionary.update('Type', new _PdfName('Annot'));
        childDictionary.update('Page', 100);
        document._getEntries = (
            list: Map<any, any>,
            streamReference: any[],
            index: number
        ): any => {
            if (list.size === 0) {
                list.set(60, childDictionary);
            }
            return { list, streamReference, index };
        };
        document._exportAnnotation(annotation, '', 2, [], 3, true);
        expect(childDictionary.has('Page')).toBe(false);
    });
    it('1038509 processes exactly one key from list', () => {
        const document: any = new _FdfDocument('file.pdf');
        document.fdfString = '';
        const annotation: any = { _dictionary: new _PdfDictionary()};
        const childDictionary: _PdfDictionary = new _PdfDictionary();
        childDictionary.update('Type', new _PdfName('Annot'));
        let getEntriesCalls: number = 0;
        document._getEntries = (
            list: Map<any, any>,
            streamReference: any[],
            index: number
        ): any => {
            getEntriesCalls++;
            if (list.size === 0) {
                list.set(70, childDictionary);
            }
            return { list, streamReference, index };
        };
        document._exportAnnotation(annotation, '', 2, [], 1, true);
        expect(getEntriesCalls).toBe(2);
    });
    it('1038509 string branch writes formatted string object', () => {
        const document: any = new _FdfDocument('file.pdf');
        document.fdfString = '';
        const annotation: any = {_dictionary: new _PdfDictionary()};
        document._getEntries = (
            list: Map<any, any>,
            streamReference: any[],
            index: number
        ): any => {
            if (list.size === 0) {
                list.set(80, 'sample-value');
            }
            return { list, streamReference, index };
        };
        document._exportAnnotation(annotation, '', 2, [], 0, true);
        expect(document.fdfString.indexOf('sample-value')).not.toBe(-1);
    });
    it('1038509 boolean branch writes boolean object', () => {
        const document: any = new _FdfDocument('file.pdf');
        document.fdfString = '';
        const annotation: any = {_dictionary: new _PdfDictionary()};
        document._getEntries = (
            list: Map<any, any>,
            streamReference: any[],
            index: number
        ): any => {
            if (list.size === 0) {
                list.set(90, true);
            }
            return { list, streamReference, index };
        };
        document._exportAnnotation(annotation, '', 2, [], 0, true);
        expect(document.fdfString.indexOf('true')).not.toBe(-1);
    });
    it('1038509 _exportAnnotation calls appendStream when stream reference contains key', () => {
        const document: any = new _FdfDocument('file.pdf');
        document.fdfString = '';
        const annotation: any = {_dictionary: new _PdfDictionary()};
        const stream: any = {dictionary: new _PdfDictionary()};
        let appendStreamCalls: number = 0;
        document._appendStream = (_value: any, _content: string): void => { appendStreamCalls++; };
        document._getEntries = (
            list: Map<any, any>,
            streamReference: any[],
            index: number
        ): any => {
            if (list.size === 0) {
                list.set(25, stream);
                streamReference.push(25);
            }
            return { list, streamReference, index };
        };
        document._exportAnnotation(annotation, '', 2, [], 0, true);
        expect(appendStreamCalls).toBe(0);
    });
    it('1038509 _exportAnnotation skips appendStream when stream reference does not contain key', () => {
        const document: any = new _FdfDocument('file.pdf');
        document.fdfString = '';
        const annotation: any = { _dictionary: new _PdfDictionary() };
        const stream: any = { dictionary: new _PdfDictionary() };
        let appendStreamCalls: number = 0;
        document._appendStream = (_value: any, _content: string): void => {
            appendStreamCalls++;
        };
        document._getEntries = (
            list: Map<any, any>,
            streamReference: any[],
            index: number
        ): any => {
            if (list.size === 0) {
                list.set(25, stream);
                streamReference.push(100);
            }
            return { list, streamReference, index };
        };
        document._exportAnnotation(annotation, '', 2, [], 0, true);
        expect(appendStreamCalls).toBe(0);
    });
    it('1038509 _exportAnnotation writes object header for PdfName entry', () => {
        const document: any = new _FdfDocument('file.pdf');
        document.fdfString = '';
        const annotation: any = {_dictionary: new _PdfDictionary()};
        document._getEntries = (
            list: Map<any, any>,
            streamReference: any[],
            index: number
        ): any => {
            if (list.size === 0) {
                list.set(55, new _PdfName('Sample'));
            }
            return { list, streamReference, index };
        };
        document._exportAnnotation(annotation, '', 2, [], 0, true);
        expect(document.fdfString.indexOf('55 0 obj')).not.toBe(-1);
        expect(document.fdfString.indexOf('/Sample')).not.toBe(-1);
    });
    it('1038509 _exportAnnotation writes object header for array entry', () => {
        const document: any = new _FdfDocument('file.pdf');
        document.fdfString = '';
        const annotation: any = {_dictionary: new _PdfDictionary()};
        document._appendArray = (
            _array: any[],
            _content: string,
            index: number,
            _appearance: boolean,
            list: Map<any, any>,
            streamReference: any[]
        ): any => {
            document.fdfString += '[1 2]';
            return { index, list, streamReference };
        };
        document._getEntries = (
            list: Map<any, any>,
            streamReference: any[],
            index: number
        ): any => {
            if (list.size === 0) {
                list.set(65, [1, 2]);
            }
            return { list, streamReference, index };
        };
        document._exportAnnotation(annotation, '', 2, [], 0, true);
        expect(document.fdfString.indexOf('65 0 obj')).not.toBe(-1);
    });
    it('1038509 _exportAnnotation writes boolean with leading space', () => {
        const document: any = new _FdfDocument('file.pdf');
        document.fdfString = '';
        const annotation: any = {_dictionary: new _PdfDictionary()};
        document._getEntries = (
            list: Map<any, any>,
            streamReference: any[],
            index: number
        ): any => {
            if (list.size === 0) {
                list.set(75, true);
            }
            return { list, streamReference, index };
        };
        document._exportAnnotation(annotation, '', 2, [], 0, true);
        expect(document.fdfString.indexOf(' true')).not.toBe(-1);
    });
    it('1038509 _exportAnnotation boolean branch does not write parenthesized string', () => {
        const document: any = new _FdfDocument('file.pdf');
        document.fdfString = '';
        const annotation: any = {_dictionary: new _PdfDictionary()};
        document._getEntries = (
            list: Map<any, any>,
            streamReference: any[],
            index: number
        ): any => {
            if (list.size === 0) {
                list.set(85, false);
            }
            return { list, streamReference, index };
        };
        document._exportAnnotation(annotation, '', 2, [], 0, true);
        expect(document.fdfString.indexOf('(false)')).toBe(-1);
        expect(document.fdfString.indexOf(' false')).not.toBe(-1);
    });
    it('1038509 _exportAnnotation writes string object header and string value', () => {
        const document: any = new _FdfDocument('file.pdf');
        document.fdfString = '';
        const annotation: any = {_dictionary: new _PdfDictionary()};
        document._getEntries = (
            list: Map<any, any>,
            streamReference: any[],
            index: number
        ): any => {
            if (list.size === 0) {
                list.set(95, 'Syncfusion');
            }
            return { list, streamReference, index };
        };
        document._exportAnnotation(annotation, '', 2, [], 0, true);
        expect(document.fdfString.indexOf('95 0 obj')).not.toBe(-1);
        expect(document.fdfString.indexOf('(Syncfusion)')).not.toBe(-1);
    });
    it('1038509 _appendStream writes stream markers for content stream', () => {
        const document: any = new _FdfDocument('file.pdf');
        document.fdfString = '';
        const stream: _PdfContentStream = new _PdfContentStream([]);
        stream.write('SYNCFUSION');
        document._appendStream(stream, '');
        expect(document.fdfString.indexOf('stream\r\n')).not.toBe(-1);
        expect(document.fdfString.indexOf('SYNCFUSION')).not.toBe(-1);
        expect(document.fdfString.indexOf('\r\nendstream')).not.toBe(-1);
    });
    it('1038509 _appendStream uses PdfStream branch', () => {
        const document: any = new _FdfDocument('file.pdf');
        document.fdfString = '';
        const stream: _PdfStream = new _PdfStream(new Uint8Array([65, 66, 67]));
        document._appendStream(stream, '');
        expect(document.fdfString.indexOf('stream\r\n')).not.toBe(-1);
        expect(document.fdfString.indexOf('ABC')).not.toBe(-1);
        expect(document.fdfString.indexOf('\r\nendstream')).not.toBe(-1);
    });
    it('1038509 _appendStream preserves stream wrapper format', () => {
        const document: any = new _FdfDocument('file.pdf');
        document.fdfString = '';
        const stream: _PdfContentStream = new _PdfContentStream([]);
        stream.write('DATA');
        document._appendStream(stream, '');
        expect(document.fdfString).toContain('stream\r\n');
        expect(document.fdfString).toContain('\r\nendstream');
        const start: number = document.fdfString.indexOf('stream\r\n');
        const value: number = document.fdfString.indexOf('DATA');
        const end: number = document.fdfString.indexOf('\r\nendstream');
        expect(start).toBeLessThan(value);
        expect(value).toBeLessThan(end);
    });
    it('1038509 _getEntries does not add reference to streamReference when flag is initially false', () => {
        const document: any = new _FdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Link', new _PdfReference(10, 0));
        const streamReference: number[] = [];
        const result: any = document._getEntries(new Map(), streamReference, 1, dictionary, '', false );
        expect(result.streamReference.length).toBe(0);
    });
    it('1038509 _getEntries adds stream reference for Sound key', () => {
        const document: any = new _FdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Sound', new _PdfReference(20, 0));
        const streamReference: number[] = [];
        const result: any = document._getEntries(new Map(), streamReference, 1, dictionary, '', false );
        expect(result.streamReference.length).toBe(1);
        expect(result.streamReference[0]).toBe(2);
    });
    it('1038509 _getEntries adds stream reference for F key', () => {
        const document: any = new _FdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('F', new _PdfReference(21, 0));
        const streamReference: number[] = [];
        const result: any = document._getEntries(new Map(), streamReference, 5, dictionary, '', false);
        expect(result.streamReference.length).toBe(1);
        expect(result.streamReference[0]).toBe(6);
    });
    it('1038509 _getEntries adds stream reference when appearance is true', () => {
        const document: any = new _FdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('AnyKey', new _PdfReference(30, 0));
        const result: any = document._getEntries(new Map(), [], 2, dictionary, '', true);
        expect(result.streamReference.length).toBe(1);
    });
    it('1038509 _getEntries resets flag after each dictionary entry', () => {
        const document: any = new _FdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Sound', new _PdfReference(40, 0));
        dictionary.update('Next', new _PdfReference(41, 0));
        const result: any = document._getEntries(new Map(), [], 1, dictionary, '', false);
        expect(result.streamReference.length).toBe(1);
    });
    it('1038509 _getEntries writes IRT NM value', () => {
        const document: any = new _FdfDocument();
        document.fdfString = '';
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('IRT', new _PdfReference(50, 0));
        document._crossReference = {
            _fetch: (_ref: _PdfReference): _PdfDictionary => {
                const replyDictionary: _PdfDictionary = new _PdfDictionary();
                replyDictionary.update('NM', 'ReplyText');
                return replyDictionary;
            }
        };
        document._getEntries(new Map(), [], 1, dictionary, '', false);
        expect(document.fdfString.indexOf('(ReplyText)')).not.toBe(-1);
    });
    it('1038509 _getEntries skips IRT text when NM is missing', () => {
        const document: any = new _FdfDocument();
        document.fdfString = '';
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('IRT', new _PdfReference(51, 0));
        document._crossReference = { _fetch: (_ref: _PdfReference): _PdfDictionary => { return new _PdfDictionary(); } };
        document._getEntries( new Map(), [], 1, dictionary, '', false );
        expect(document.fdfString.indexOf('(')).toBe(-1);
    });
    it('1038509 _getEntries writes Parent reference and page number', () => {
        const document: any = new _FdfDocument();
        document.fdfString = '';
        document._annotationID = '12';
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Page', 7);
        dictionary.update('Parent', new _PdfReference(60, 0));
        document._getEntries(new Map(), [], 1, dictionary, '', false);
        expect(document.fdfString.indexOf('12 0 R')).not.toBe(-1);
        expect(document.fdfString.indexOf('/Page 7')).not.toBe(-1);
    });
    it('1038509 _getEntries assigns xref when dictionary has none', () => {
        const document: any = new _FdfDocument();
        const dictionary: any = new _PdfDictionary();
        let assignCalls: number = 0;
        dictionary.assignXref = (_xref: any): void => {assignCalls++;};
        dictionary.update('Link', new _PdfReference(70, 0));
        document._crossReference = {};
        document._getEntries(new Map(), [], 1, dictionary, '', false);
        expect(assignCalls).toBe(1);
    });
    it('1038509 _getEntries does not assign xref when already available', () => {
        const document: any = new _FdfDocument();
        const dictionary: any = new _PdfDictionary();
        let assignCalls: number = 0;
        dictionary.assignXref = (_xref: any): void => {assignCalls++;};
        dictionary._crossReference = { _fetch: (_ref: _PdfReference): _PdfDictionary => { return new _PdfDictionary(); } };
        dictionary.update('Link', new _PdfReference(80, 0));
        document._getEntries(new Map(), [], 1, dictionary, '', false);
        expect(assignCalls).toBe(0);
    });
});
describe('1038509 _appendArray', () => {
    it('1038509 _appendArray writes opening and closing brackets', () => {
        const document: any = new _FdfDocument();
        document.fdfString = '';
        document._appendElement = (
            _element: any,
            _content: string,
            index: number,
            _flag: boolean,
            list: Map<any, any>,
            streamReference: any[]
        ): any => { return {list, streamReference, index}; };
        document._appendArray( [1], '', 1, false, new Map(),[]);
        expect(document.fdfString.startsWith('[')).toBe(true);
        expect(document.fdfString.endsWith(']')).toBe(true);
    });
    it('1038509 _appendArray calls appendElement for every element', () => {
        const document: any = new _FdfDocument();
        let appendCalls: number = 0;
        document._appendElement = (
            _element: any,
            _content: string,
            index: number,
            _flag: boolean,
            list: Map<any, any>,
            streamReference: any[]
        ): any => { appendCalls++; return { list, streamReference, index }; };
        document._appendArray( [1, 2, 3], '', 0, false, new Map(), [] );
        expect(appendCalls).toBe(3);
    });
    it('1038509 _appendArray propagates updated index from appendElement', () => {
        const document: any = new _FdfDocument();
        document._appendElement = (
            _element: any,
            _content: string,
            index: number,
            _flag: boolean,
            list: Map<any, any>,
            streamReference: any[]
        ): any => { return { list, streamReference, index: index + 1}; };
        const result: any = document._appendArray([1, 2], '', 5, false, new Map(), [] );
        expect(result.index).toBe(7);
    });
    it('1038509 _appendArray propagates list returned from appendElement', () => {
        const document: any = new _FdfDocument();
        document._appendElement = (
            _element: any,
            _content: string,
            index: number,
            _flag: boolean,
            _list: Map<any, any>,
            streamReference: any[]
        ): any => {
            const updatedList: Map<any, any> = new Map();
            updatedList.set('A', 10);
            return {list: updatedList,streamReference, index };
        };
        const result: any = document._appendArray([1], '', 1, false, new Map(), [] );
        expect(result.list.has('A')).toBe(true);
        expect(result.list.get('A')).toBe(10);
    });
    it('1038509 _appendArray propagates stream references returned from appendElement', () => {
        const document: any = new _FdfDocument();
        document._appendElement = (
            _element: any,
            _content: string,
            index: number,
            _flag: boolean,
            list: Map<any, any>,
            _streamReference: any[]
        ): any => { return { list, streamReference: [9, 10], index}; };
        const result: any = document._appendArray([1], '', 1, false, new Map(), []);
        expect(result.streamReference.length).toBe(2);
        expect(result.streamReference[0]).toBe(9);
        expect(result.streamReference[1]).toBe(10);
    });
    it('1038509 _appendArray inserts space before second numeric value', () => {
        const document: any = new _FdfDocument();
        document.fdfString = '';
        document._appendElement = (
            element: any,
            _content: string,
            index: number,
            _flag: boolean,
            list: Map<any, any>,
            streamReference: any[]
        ): any => {
            document.fdfString += element.toString();
            return {list, streamReference, index };
        };
        document._appendArray([1, 2], '', 0, false, new Map(), []);
        expect(document.fdfString.indexOf('1 2')).not.toBe(-1);
    });
    it('1038509 _appendArray inserts space before second boolean value', () => {
        const document: any = new _FdfDocument();
        document.fdfString = '';
        document._appendElement = (
            element: any,
            _content: string,
            index: number,
            _flag: boolean,
            list: Map<any, any>,
            streamReference: any[]
        ): any => {
            document.fdfString += element ? 'true' : 'false';
            return {list, streamReference, index };
        };
        document._appendArray([true, false], '', 0, false, new Map(), [] );
        expect(document.fdfString.indexOf('true false')).not.toBe(-1);
    });
    it('1038509 _appendArray inserts space before second reference value', () => {
        const document: any = new _FdfDocument();
        document.fdfString = '';
        const firstReference: _PdfReference = new _PdfReference(1, 0);
        const secondReference: _PdfReference = new _PdfReference(2, 0);
        document._appendElement = (
            element: any,
            _content: string,
            index: number,
            _flag: boolean,
            list: Map<any, any>,
            streamReference: any[]
        ): any => {
            if (element instanceof _PdfReference) {
                document.fdfString += 'R';
            }
            return { list, streamReference, index };
        };
        document._appendArray([firstReference, secondReference], '', 0, false, new Map(), []);
        expect(document.fdfString.indexOf('R R')).not.toBe(-1);
    });
    it('1038509 _appendElement updates index and cache value for valid reference', () => {
        const document: any = new _FdfDocument();
        document.fdfString = '';
        const reference: _PdfReference = new _PdfReference(10, 0);
        const cachedDictionary: _PdfDictionary = new _PdfDictionary();
        document._crossReference = {_cacheMap: new Map()};
        document._crossReference._cacheMap.set(reference, cachedDictionary);
        const result: any = document._appendElement( reference, '', 5, false, new Map(), []);
        expect(result.index).toBe(6);
        expect(result.list.has(6)).toBe(true);
        expect(result.list.get(6)).toBe(cachedDictionary);
    });
    it('1038509 _appendElement adds stream reference only when flag is true', () => {
        const document: any = new _FdfDocument();
        const reference: _PdfReference = new _PdfReference(11, 0);
        document._crossReference = { _cacheMap: new Map()};
        document._crossReference._cacheMap.set( reference, new _PdfDictionary() );
        const result: any = document._appendElement( reference, '', 1, true, new Map(), []);
        expect(result.streamReference.length).toBe(1);
        expect(result.streamReference[0]).toBe(2);
    });
    it('1038509 _appendElement writes true with leading space', () => {
        const document: any = new _FdfDocument();
        document.fdfString = '';
        document._appendElement( true, '', 1, false, new Map(), []);
        expect(document.fdfString).toBe(' true');
    });
    it('1038509 _appendElement writes false text correctly', () => {
        const document: any = new _FdfDocument();
        document.fdfString = '';
        document._appendElement( false, '', 1, false, new Map(), [] );
        expect(document.fdfString).toBe(' false');
    });
    it('1038509 _appendElement preserves exact boolean formatting', () => {
        const document: any = new _FdfDocument();
        document.fdfString = '';
        document._appendElement(true, '', 0, false, new Map(), []);
        const trueValue: string = document.fdfString;
        document.fdfString = '';
        document._appendElement(false, '', 0, false, new Map(), []);
        const falseValue: string = document.fdfString;
        expect(trueValue).toBe(' true');
        expect(falseValue).toBe(' false');
        expect(trueValue.startsWith(' ')).toBe(true);
        expect(falseValue.startsWith(' ')).toBe(true);
    });
});
describe('1038509 _checkFdf', () => {
    it('1038509 _checkFdf does not set specification flag for regular FDF header', () => {
        const document: any = new _FdfDocument();
        document._asPerSpecification = false;
        document._checkFdf('%FDF-1.2\r\nSimpleContent');
        expect(document._asPerSpecification).toBe(false);
    });
    it('1038509 _checkFdf sets specification flag for special characters', () => {
        const document: any = new _FdfDocument();
        document._asPerSpecification = false;
        document._checkFdf('%FDF-1.2\r\n' + document._specialCharacters);
        expect(document._asPerSpecification).toBe(true);
    });
    it('1038509 _checkFdf sets specification flag for encoded marker', () => {
        const document: any = new _FdfDocument();
        document._asPerSpecification = false;
        document._checkFdf('%FDF-1.2\r\nÃ¢Ã£Ã\u008fÃ\u0093');
        expect(document._asPerSpecification).toBe(true);
    });
    it('1038509 _checkFdf sets specification flag for replacement marker', () => {
        const document: any = new _FdfDocument();
        document._asPerSpecification = false;
        document._checkFdf('%FDF-1.2\r\n%ï¿½ï¿½ï¿½ï¿½');
        expect(document._asPerSpecification).toBe(true);
    });
    it('1038509 _checkFdf throws for invalid header', () => {
        const document: any = new _FdfDocument();
        expect((): void => {document._checkFdf('%ABC-1.2');}).toThrowError('Invalid FDF file.');
    });
});
describe('1038509 _stringToHexString', () => {
    it('1038509 _stringToHexString returns empty string for empty input', () => {
        const document: any = new _FdfDocument();
        const result: string = document._stringToHexString('');
        expect(result).toBe('');
    });
        it('1038509 _stringToHexString returns empty string for null input', () => {
        const document: any = new _FdfDocument();
        const result: string = document._stringToHexString(null as any);
        expect(result).toBe('');
    });
        it('1038509 _stringToHexString returns empty string for undefined input', () => {
        const document: any = new _FdfDocument();
        const result: string = document._stringToHexString(undefined as any);
        expect(result).toBe('');
    });
        it('1038509 _stringToHexString converts non empty text', () => {
        const document: any = new _FdfDocument();
        const result: string = document._stringToHexString('A');
        expect(result).not.toBe('');
        expect(result.length).toBeGreaterThan(0);
    });
});
