import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { DocumentHelper, DropDownFormField } from '../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { DropDownFormFieldDialog } from '../../../src/document-editor/implementation/dialogs/form-field-drop-down-dialog';

describe('Form field Dropdown dialog', () => {
    let editor: DocumentEditor;
    let dialog: DropDownFormFieldDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, DropDownFormFieldDialog);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.dropDownFormFieldDialogModule;
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
    it('Insert Form field Dropdown value updates', () => {
console.log('Insert Form field Dropdown value updates');
        editor.editorModule.insertFormField('DropDown');
        let arrValue: string[] = ['Sync', 'Syncfusion'];
        (dialog as any).dropDownItems = arrValue;
        (dialog as any).bookmarkInput.value = 'Test';
        (dialog as any).dropDownEnable.checked = false;
        (dialog as any).tooltipInput.value = 'testsync';
        editor.selection.selectAll();
        dialog.insertDropDownField();
        editor.selection.selectAll();
        let fieldData: DropDownFormField = editor.selection.getCurrentFormField().formFieldData as DropDownFormField;
        expect(fieldData.dropdownItems[0]).toBe('Sync');
        expect(fieldData.dropdownItems[1]).toBe('Syncfusion');
        expect(fieldData.name).toBe('Test');
        expect(fieldData.enabled).toBe(false);
        expect(fieldData.helpText).toBe('testsync');
    });
    it('Load Values - Form field Dropdown Dialog', () => {
console.log('Load Values - Form field Dropdown Dialog');
        editor.editorModule.insertFormField('DropDown');
        editor.selection.selectAll();
        dialog.loadDropDownDialog();
        editor.selection.selectAll();
        let fieldData: DropDownFormField = editor.selection.getCurrentFormField().formFieldData as DropDownFormField;
        expect(fieldData.dropdownItems.length).toBe(0);
        expect(fieldData.helpText).toBe((dialog as any).tooltipInput.value);
        expect(fieldData.name).toBe((dialog as any).bookmarkInput.value);
        expect(fieldData.enabled).toBe((dialog as any).dropDownEnable.checked);
    });
    it('add items - Form field Dropdown Dialog', () => {
console.log('add items - Form field Dropdown Dialog');
        editor.editorModule.insertFormField('DropDown');
        editor.selection.selectAll();
        (dialog as any).drpDownItemsInput.value = 'Sync';
        dialog.addItemtoList();
        expect((dialog as any).dropDownItems[0]).toBe('Sync');
    });
    it('remove items - Form field Dropdown Dialog', () => {
console.log('remove items - Form field Dropdown Dialog');
        editor.editorModule.insertFormField('DropDown');
        editor.selection.selectAll();
        (dialog as any).dropDownItems = [];
        (dialog as any).drpDownItemsInput.value = 'Sync';
        dialog.addItemtoList();
        dialog.removeItemFromList();
        expect((dialog as any).dropDownItems.length).toBe(0);
    });
    it('move Up items - Form field Dropdown Dialog', () => {
console.log('move Up items - Form field Dropdown Dialog');
        editor.editorModule.insertFormField('DropDown');
        editor.selection.selectAll();
        (dialog as any).dropDownItems = [];
        (dialog as any).drpDownItemsInput.value = 'Test1';
        dialog.addItemtoList();
        (dialog as any).drpDownItemsInput.value = 'Test2';
        dialog.addItemtoList();
        (dialog as any).drpDownItemsInput.value = 'Test3';
        dialog.addItemtoList();
        dialog.moveUpItem();
        expect((dialog as any).dropDownItems[1]).toBe('Test3');
        expect((dialog as any).dropDownItems[2]).toBe('Test2');
        dialog.moveUpItem();
        dialog.moveUpItem();
        expect((dialog as any).dropDownItems[2]).toBe('Test3');
    });
    it('move Down items - Form field Dropdown Dialog', () => {
console.log('move Down items - Form field Dropdown Dialog');
        editor.editorModule.insertFormField('DropDown');
        editor.selection.selectAll();
        (dialog as any).dropDownItems = [];
        (dialog as any).drpDownItemsInput.value = 'Test1';
        dialog.addItemtoList();
        (dialog as any).drpDownItemsInput.value = 'Test2';
        dialog.addItemtoList();
        (dialog as any).drpDownItemsInput.value = 'Test3';
        dialog.addItemtoList();
        dialog.moveDownItem();
        expect((dialog as any).dropDownItems[0]).toBe('Test3');
        expect((dialog as any).dropDownItems[1]).toBe('Test1');
        dialog.moveDownItem();
        expect((dialog as any).dropDownItems[1]).toBe('Test3');
    });
    it('Key up input- enable disable add button - Form field Dropdown Dialog', () => {
console.log('Key up input- enable disable add button - Form field Dropdown Dialog');
        editor.editorModule.insertFormField('DropDown');
        editor.selection.selectAll();
        (dialog as any).dropDownItems = [];
        (dialog as any).addButton.disabled = true;
        (dialog as any).drpDownItemsInput.value = 'Sync';
        dialog.onKeyUpOnTextBox();
        expect((dialog as any).addButton.disabled).toBe(false);
    });
});
