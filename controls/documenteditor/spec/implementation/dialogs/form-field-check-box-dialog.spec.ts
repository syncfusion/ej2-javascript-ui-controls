import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { DocumentHelper, CheckBoxFormField, EditorHistory, SfdtExport } from '../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { CheckBoxFormFieldDialog } from '../../../src/document-editor/implementation/dialogs/form-field-check-box-dialog';
import { ChangeEventArgs } from '@syncfusion/ej2-buttons';

describe('Form field CheckBox dialog', () => {
    let editor: DocumentEditor;
    let dialog: CheckBoxFormFieldDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, CheckBoxFormFieldDialog);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.checkBoxFormFieldDialogModule;
        dialog.show();
        dialog.onCancelButtonClick();
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Insert Form field Checkbox Dialog', () => {
console.log('Insert Form field Checkbox Dialog');
        editor.editorModule.insertFormField('CheckBox');
        (dialog as any).checkedButton.checked = true;
        (dialog as any).exactButton.checked = true;
        (dialog as any).exactlyNumber.value = 20;
        (dialog as any).tooltipInputText.value = 'Sync';
        (dialog as any).bookmarkInputText.value = 'Test';
        (dialog as any).checBoxEnableElement.checked = false;
        editor.selection.selectAll();
        dialog.insertCheckBoxField();
        editor.selection.selectAll();
        let fieldData: CheckBoxFormField = editor.selection.getCurrentFormField().formFieldData as CheckBoxFormField;
        expect(fieldData.checked).toBe(true);
        expect(fieldData.sizeType).toBe('Exactly');
        expect(fieldData.size).toBe(20);
        expect(fieldData.helpText).toBe('Sync');
        expect(fieldData.name).toBe('Test');
        expect(fieldData.enabled).toBe(false);
    });
    it('Load Values - Form field Checkbox Dialog', () => {
console.log('Load Values - Form field Checkbox Dialog');
        editor.editorModule.insertFormField('CheckBox');
        editor.selection.selectAll();
        dialog.loadCheckBoxDialog();
        editor.selection.selectAll();
        let fieldData: CheckBoxFormField = editor.selection.getCurrentFormField().formFieldData as CheckBoxFormField;
        expect(fieldData.checked).toBe((dialog as any).checkedButton.checked);
        if (fieldData.sizeType === 'Exactly') {
            expect((dialog as any).exactButton.checked).toBe(true);
        }
        expect(fieldData.size).toBe((dialog as any).exactlyNumber.value);
        expect(fieldData.helpText).toBe((dialog as any).tooltipInputText.value);
        expect(fieldData.name).toBe((dialog as any).bookmarkInputText.value);
        expect(fieldData.enabled).toBe((dialog as any).checBoxEnableElement.checked);
    });
    it('Change Bidrirectional - Form field Checkbox Dialog', () => {
console.log('Change Bidrirectional - Form field Checkbox Dialog');
        (dialog as any).exactButton.checked = true;
        let event: any = {};
        event.value = 'exact';
        dialog.changeBidirectional(event as ChangeEventArgs);
        expect((dialog as any).autoButton.checked).toBe(false);
        event.value = '';
        (dialog as any).exactButton.checked = false;
        dialog.changeBidirectional(event as ChangeEventArgs);
        expect((dialog as any).exactButton.checked).toBe(true);
    });
    it('Change Bidrirect - Form field Checkbox Dialog', () => {
console.log('Change Bidrirect - Form field Checkbox Dialog');
        (dialog as any).checkedButton.checked = true;
        let event: any = {};
        event.value = 'check';
        dialog.changeBidirect(event as ChangeEventArgs);
        expect((dialog as any).notCheckedButton.checked).toBe(false);
        event.value = '';
        (dialog as any).checkedButton.checked = false;
        dialog.changeBidirect(event as ChangeEventArgs);
        expect((dialog as any).checkedButton.checked).toBe(true);
    });
});
describe('Check API to modify CheckBox form field name in Inline mode', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Check the number of form fields', () => {
        console.log('Check the number of form fields');
        container.openBlank();
        container.editor.insertFormField('CheckBox');
        container.editor.insertFormField('CheckBox');
        container.editor.insertFormField('CheckBox');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        container.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
        let formFieldNames1: any = container.getFormFieldNames();
        expect(formFieldNames1.length).toEqual(3);
        let field: any = container.getFormFieldInfo(formFieldNames1[1]);
        field.name = 'CheckBox3';
        container.setFormFieldInfo(formFieldNames1[1], field);
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2.length).toEqual(2);
        container.editor.stopProtection('123');
    });
    it('Check the names of Form Fields', () => {
        console.log('Check the names of form fields');
        container.openBlank();
        container.editor.insertFormField('CheckBox');
        container.editor.insertFormField('CheckBox');
        container.editor.insertFormField('CheckBox');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        container.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
        let formFieldNames1: any = container.getFormFieldNames();
        expect(formFieldNames1[0]).toEqual('CheckBox1');
        expect(formFieldNames1[1]).toEqual('CheckBox2');
        expect(formFieldNames1[2]).toEqual('CheckBox3');
        let field: any = container.getFormFieldInfo(formFieldNames1[1]);
        field.name = 'CheckBox3';
        container.setFormFieldInfo(formFieldNames1[1], field);
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2[0]).toEqual('CheckBox1');
        expect(formFieldNames2[1]).toEqual('CheckBox3');
        container.editor.stopProtection('123');
    });
    it('Modifying form field without modifying name', () => {
        console.log('modifying Form Field without changing name');
        container.openBlank();
        container.editor.insertFormField('CheckBox');
        container.editor.insertFormField('CheckBox');
        container.editor.insertFormField('CheckBox');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        container.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
        let formFieldNames1: any = container.getFormFieldNames();
        let field: any = container.getFormFieldInfo(formFieldNames1[1]);
        field.defaultValue = true;
        field.type = "CheckBox";
        container.setFormFieldInfo(formFieldNames1[1], field);
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2.length).toEqual(3);
        container.editor.stopProtection('123');
    });
    it('Check new name for form fields', () => {
        console.log('Check unique name for form fields');
        container.openBlank();
        container.editor.insertFormField('CheckBox');
        container.editor.insertFormField('CheckBox');
        container.editor.insertFormField('CheckBox');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        container.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
        let formFieldNames1: any = container.getFormFieldNames();
        let field1: any = container.getFormFieldInfo(formFieldNames1[1]);
        field1.name = 'NewFormFieldName';
        container.setFormFieldInfo(formFieldNames1[1], field1);
        let field2: any = container.getFormFieldInfo("NewFormFieldName");
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2).toContain("NewFormFieldName");
        expect(field2.name).toBeDefined();
        container.editor.stopProtection('123');
    });
});
describe('Check API to modify CheckBox form field name in popup mode', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Check the number of form fields', () => {
        console.log('Check the number of form fields');
        container.openBlank();
        container.editor.insertFormField('CheckBox');
        container.editor.insertFormField('CheckBox');
        container.editor.insertFormField('CheckBox');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        let formFieldNames1: any = container.getFormFieldNames();
        expect(formFieldNames1.length).toEqual(3);
        let field: any = container.getFormFieldInfo(formFieldNames1[1]);
        field.name = 'CheckBox3';
        container.setFormFieldInfo(formFieldNames1[1], field);
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2.length).toEqual(2);
        container.editor.stopProtection('123');
    });
    it('Check the names of Form Fields', () => {
        console.log('Check the names of form fields');
        container.openBlank();
        container.editor.insertFormField('CheckBox');
        container.editor.insertFormField('CheckBox');
        container.editor.insertFormField('CheckBox');
        let formFieldNames1: any = container.getFormFieldNames();
        expect(formFieldNames1[0]).toEqual('CheckBox1');
        expect(formFieldNames1[1]).toEqual('CheckBox2');
        expect(formFieldNames1[2]).toEqual('CheckBox3');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        let field: any = container.getFormFieldInfo(formFieldNames1[1]);
        field.name = 'CheckBox3';
        container.setFormFieldInfo(formFieldNames1[1], field);
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2[0]).toEqual('CheckBox1');
        expect(formFieldNames2[1]).toEqual('CheckBox3');
        container.editor.stopProtection('123');
    });
    it('Modifying form field without modifying name', () => {
        console.log('modifying Form Field without changing name');
        container.openBlank();
        container.editor.insertFormField('CheckBox');
        container.editor.insertFormField('CheckBox');
        container.editor.insertFormField('CheckBox');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        let formFieldNames1: any = container.getFormFieldNames();
        let field: any = container.getFormFieldInfo(formFieldNames1[1]);
        field.defaultValue = true;
        field.type = "CheckBox";
        container.setFormFieldInfo(formFieldNames1[1], field);
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2.length).toEqual(3);
        container.editor.stopProtection('123');
    });
    it('Check new name for form fields', () => {
        console.log('Check unique name for form fields');
        container.openBlank();
        container.editor.insertFormField('CheckBox');
        container.editor.insertFormField('CheckBox');
        container.editor.insertFormField('CheckBox');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        let formFieldNames1: any = container.getFormFieldNames();
        let field1: any = container.getFormFieldInfo(formFieldNames1[1]);
        field1.name = 'NewFormFieldName';
        container.setFormFieldInfo(formFieldNames1[1], field1);
        let field2: any = container.getFormFieldInfo("NewFormFieldName");
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2).toContain("NewFormFieldName");
        expect(field2.name).toBeDefined();
        container.editor.stopProtection('123');
    });
});
