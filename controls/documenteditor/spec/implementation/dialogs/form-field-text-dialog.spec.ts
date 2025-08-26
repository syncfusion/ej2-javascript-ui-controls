import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { BodyWidget, DocumentHelper, EditorHistory, LineWidget, ListTextElementBox, ParagraphWidget, SfdtExport, TextElementBox, TextFormField, TextFormFieldInfo } from '../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { TextFormFieldDialog } from '../../../src/document-editor/implementation/dialogs/form-field-text-dialog';
import { ChangeEventArgs } from '@syncfusion/ej2-dropdowns/src/drop-down-list';

describe('Form field Text dialog', () => {
    let editor: DocumentEditor;
    let dialog: TextFormFieldDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, TextFormFieldDialog);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.textFormFieldDialogModule;
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
        
        setTimeout(function () {
            done();
        }, 2000);
    });
    // it('Insert Form field Text Value updates', () => {
    //     console.log('Insert Form field Text Value updates');
    //     editor.editorModule.insertFormField('Text');
    //     (dialog as any).typeDropDown.value = 'Date';
    //     (dialog as any).defaultTextInput.value = '3/20/2020';
    //     (dialog as any).maxLengthNumber.value = 0;
    //     (dialog as any).textFormatDropDown.value = 'M/d/yy';
    //     (dialog as any).bookmarkTextInput.value = 'Test';
    //     (dialog as any).fillInEnable.checked = false;
    //     (dialog as any).tooltipTextInput.value = 'testsync';
    //     editor.selection.selectAll();
    //     dialog.insertTextField();
    //     dialog.show();
    //     dialog.onCancelButtonClick();
    //     editor.selection.selectAll();
    //     let fieldData: TextFormField = editor.selection.getCurrentFormField().formFieldData as TextFormField;
    //     expect(fieldData.type).toBe('Date');
    //     expect(fieldData.defaultValue).toBe('3/20/20');
    //     expect(fieldData.maxLength).toBe(0);
    //     expect(fieldData.format).toBe('M/d/yy');
    //     expect(fieldData.name).toBe('Test');
    //     expect(fieldData.enabled).toBe(false);
    //     expect(fieldData.helpText).toBe('testsync');
    // });
    // it('Load Values - Form field Text Dialog', () => {
    //     console.log('Load Values - Form field Text Dialog');
    //     editor.editorModule.insertFormField('Text');
    //     editor.selection.selectAll();
    //     dialog.loadTextDialog();
    //     editor.selection.selectAll();
    //     let fieldData: TextFormField = editor.selection.getCurrentFormField().formFieldData as TextFormField;
    //     expect(fieldData.defaultValue).toBe((dialog as any).defaultTextInput.value);
    //     if (fieldData.type === 'Text') {
    //         expect((dialog as any).typeDropDown.value).toBe('Regular text');
    //     }
    //     expect(fieldData.maxLength).toBe((dialog as any).maxLengthNumber.value);
    //     expect(fieldData.format).toBe((dialog as any).textFormatDropDown.value);
    //     expect(fieldData.helpText).toBe((dialog as any).tooltipTextInput.value);
    //     expect(fieldData.name).toBe((dialog as any).bookmarkTextInput.value);
    //     expect(fieldData.enabled).toBe((dialog as any).fillInEnable.checked);
    // });
    // it('Valid Date format - Form field Text Dialog', () => {
    //     console.log('Valid Date format - Form field Text Dialog');
    //     editor.editorModule.insertFormField('Text');
    //     editor.selection.selectAll();
    //     (dialog as any).defaultTextInput.value = '3/20/2020';
    //     expect(dialog.isValidDateFormat()).toBe(true);
    //     (dialog as any).defaultTextInput.value = '3022020';
    //     expect(dialog.isValidDateFormat()).toBe(false);
    // });
    // it('Change Type DropDown - Form field Text Dialog', () => {
    //     console.log('Change Type DropDown - Form field Text Dialog');
    //     editor.editorModule.insertFormField('Text');
    //     let event: any = {};
    //     event.value = 'Number';
    //     (dialog as any).typeDropDown.value = 'Number';
    //     dialog.changeTypeDropDown(event as ChangeEventArgs);
    //     (dialog as any).defaultTextInput.value = '34';
    //     dialog.updateTextFormtas();
    //     expect((dialog as any).textFormatDropDown.dataSource[0]).toBe('0');
    //     event.value = 'Date';
    //     (dialog as any).typeDropDown.value = 'Date';
    //     (dialog as any).textFormatDropDown.value = 'M/d/yy';
    //     dialog.changeTypeDropDown(event as ChangeEventArgs);
    //     (dialog as any).defaultTextInput.value = '3/20/2020';
    //     dialog.updateTextFormtas();
    //     expect((dialog as any).textFormatDropDown.dataSource[0]).toBe('M/d/yyyy');
    //     event.value = 'Regular text';
    //     dialog.changeTypeDropDown(event as ChangeEventArgs);
    //     (dialog as any).defaultTextInput.value = 'Syncfusion';
    //     dialog.updateTextFormtas();
    //     expect((dialog as any).textFormatDropDown.dataSource[0].Value).toBe('Uppercase');
    // });
    // it('Change Type DropDown isinteracted - Form field Text Dialog', () => {
    //     console.log('Change Type DropDown isinteracted - Form field Text Dialog');
    //     editor.editorModule.insertFormField('Text');
    //     let event: any = {};
    //     (dialog as any).defaultTextInput.value = 'Sync';
    //     event.value = '';
    //     event.isInteracted = true;
    //     dialog.changeTypeDropDown(event as ChangeEventArgs);
    //     expect((dialog as any).defaultTextInput.value).toBe('');
    // });
    // it('Insert Form field Text Value updates', () => {
    //     console.log('Insert Form field Text Value updates - Date time validation');
    //     editor.editorModule.insertFormField('Text');
    //     (dialog as any).typeDropDown.value = 'Date';
    //     (dialog as any).textFormatDropDown.value = 'M/d/yyyy h:mm am/pm';
    //     (dialog as any).defaultTextInput.value = '10/1/2021 2:12 AM';
    //     (dialog as any).maxLengthNumber.value = 0;

    //     (dialog as any).bookmarkTextInput.value = 'Test';
    //     (dialog as any).fillInEnable.checked = false;
    //     (dialog as any).tooltipTextInput.value = 'testsync';
    //     editor.selection.selectAll();
    //     dialog.insertTextField();
    //     dialog.show();

    //     dialog.onCancelButtonClick();
    //     editor.selection.selectAll();
    //     let fieldData: TextFormField = editor.selection.getCurrentFormField().formFieldData as TextFormField;
    //     expect(fieldData.defaultValue).toBe('10/1/2021 2:12 AM');
    // });
});
describe('Check API to modify text form field name in Inline mode', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        
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
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Check the number of form fields', () => {
        console.log('Check the number of form fields');
        container.openBlank();
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        container.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
        let formFieldNames1: any = container.getFormFieldNames();
        expect(formFieldNames1.length).toEqual(3);
        let field: any = container.getFormFieldInfo(formFieldNames1[1]);
        field.name = 'Text3';
        container.setFormFieldInfo(formFieldNames1[1], field);
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2.length).toEqual(2);
        container.editor.stopProtection('123');
    });
    it('Check the names of Form Fields', () => {
        console.log('Check the names of form fields');
        container.openBlank();
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        container.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
        let formFieldNames1: any = container.getFormFieldNames();
        expect(formFieldNames1[0]).toEqual('Text1');
        expect(formFieldNames1[1]).toEqual('Text2');
        expect(formFieldNames1[2]).toEqual('Text3');
        let field: any = container.getFormFieldInfo(formFieldNames1[1]);
        field.name = 'Text3';
        container.setFormFieldInfo(formFieldNames1[1], field);
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2[0]).toEqual('Text1');
        expect(formFieldNames2[1]).toEqual('Text3');
        container.editor.stopProtection('123');
    });
    it('Modifying form fields without modifying name', () => {
        console.log('modifying Form Field without changing name');
        container.openBlank();
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        container.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
        let formFieldNames1: any = container.getFormFieldNames();
        let field: any = container.getFormFieldInfo(formFieldNames1[1]);
        field.defaultValue = "Hello";
        field.format = "Uppercase";
        field.type = "Text";
        container.setFormFieldInfo(formFieldNames1[1], field);
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2.length).toEqual(3);
        container.editor.stopProtection('123');
    });
    it('Check new name for form fields', () => {
        console.log('Check unique name for form fields');
        container.openBlank();
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
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
describe('Check API to modify text form field name in popup mode', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        
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
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Check the number of form fields', () => {
        console.log('Check the number of form fields');
        container.openBlank();
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        let formFieldNames1: any = container.getFormFieldNames();
        expect(formFieldNames1.length).toEqual(3);
        let field: any = container.getFormFieldInfo(formFieldNames1[1]);
        field.name = 'Text3';
        container.setFormFieldInfo(formFieldNames1[1], field);
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2.length).toEqual(2);
        container.editor.stopProtection('123');
    });
    it('Check the names of Form Fields', () => {
        console.log('Check the names of form fields');
        container.openBlank();
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        let formFieldNames1: any = container.getFormFieldNames();
        expect(formFieldNames1[0]).toEqual('Text1');
        expect(formFieldNames1[1]).toEqual('Text2');
        expect(formFieldNames1[2]).toEqual('Text3');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        let field: any = container.getFormFieldInfo(formFieldNames1[1]);
        field.name = 'Text3';
        container.setFormFieldInfo(formFieldNames1[1], field);
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2[0]).toEqual('Text1');
        expect(formFieldNames2[1]).toEqual('Text3');
        container.editor.stopProtection('123');
    });
    it('Modifying form fields without modifying name', () => {
        console.log('modifying Form Field without changing name');
        container.openBlank();
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        let formFieldNames1: any = container.getFormFieldNames();
        let field: any = container.getFormFieldInfo(formFieldNames1[1]);
        field.defaultValue = "Hello";
        field.format = "Uppercase";
        field.type = "Text";
        container.setFormFieldInfo(formFieldNames1[1], field);
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2.length).toEqual(3);
        container.editor.stopProtection('123');
    });
    it('Check new name for form fields', () => {
        console.log('Check unique name for form fields');
        container.openBlank();
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
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