import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { DocumentHelper, CheckBoxFormField } from '../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { CheckBoxFormFieldDialog } from '../../../src/document-editor/implementation/dialogs/form-field-check-box-dialog';

describe('Form field CheckBox dialog', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
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
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Insert Form field Checkbox Dialog', () => {
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
});