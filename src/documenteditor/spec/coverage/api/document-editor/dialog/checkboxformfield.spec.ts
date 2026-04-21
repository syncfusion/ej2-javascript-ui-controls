import { DropDownFormFieldDialog, TextFormFieldDialog } from '../../../../../src';
import { DocumentEditor } from '../../../../../src/document-editor/document-editor';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { TestHelper } from '../../../../test-helper.spec';

describe('Form-Field-text-checkbox', () => {
    let editor: DocumentEditor;
    let element: HTMLElement;
    let dialog: DropDownFormFieldDialog;
    let textdialog: TextFormFieldDialog;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false });
        editor.enableAllModules();
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.dropDownFormFieldDialogModule;
        textdialog = editor.textFormFieldDialogModule;
    });
    afterAll(() => {
        editor.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        expect(() => { editor.destroy(); }).not.toThrowError();
        element = undefined;
        editor = undefined;
        
    });
    it('Text-form-field - insertTextfield', () => {
        console.log('Text-form-field - insertTextfield');
        editor.openBlank();
        editor.editor.insertFormField('Text');
        editor.textFormFieldDialogModule.show();
        editor.textFormFieldDialogModule.insertTextField();
        // expect(() =>).not.toThrowError();
    });
    it('Checkboxformfield-dialog - insertCheckBoxField', () => {
        console.log('Checkboxformfield-dialog - insertCheckBoxField');
        editor.openBlank();
        editor.editor.insertFormField('CheckBox')
        editor.checkBoxFormFieldDialogModule.show();
        editor.checkBoxFormFieldDialogModule.insertCheckBoxField();
        // expect(() => editor.editor.insertFormField('CheckBox')).not.toThrowError();
    });
    it('Text-form-field - changeTypeDropDown', () => {
        console.log('Text-form-field - changeTypeDropDown');
        let args: any;
        args = { preventDefault: function () { }, value: "Number" };
        editor.textFormFieldDialogModule.show();
        editor.textFormFieldDialogModule.changeTypeDropDown(args);
        expect(() => editor.textFormFieldDialogModule.insertTextField()).not.toThrowError();
    });
    it('Drop-down-form-field - add items', () => {
        console.log('Drop-down-form-field - add items');
        editor.editor.insertFormField('DropDown');
        editor.dropDownFormFieldDialogModule.show();
        (dialog as any).drpDownItemsInput.value = 'eeee';
        (dialog as any).drpDownItemsInput.value = 'eeee1';
        editor.dropDownFormFieldDialogModule.addItemtoList();
        (dialog as any).moveUp();
        (dialog as any).moveDown();
        // editor.dropDownFormFieldDialogModu.value = 'eeee';
        expect(() => editor.dropDownFormFieldDialogModule.insertDropDownField()).not.toThrowError();
    });

    it('Drop-down-form-field -  remove items', () => {
        console.log('Drop-down-form-field -remove items');
        editor.editor.insertFormField('DropDown');
        editor.dropDownFormFieldDialogModule.show();
        (dialog as any).drpDownItemsInput.value = 'eeee';
        (dialog as any).drpDownItemsInput.value = 'eeee1';
        (dialog as any).drpDownItemsInput.value = 'eeee2';
        editor.dropDownFormFieldDialogModule.addItemtoList();
        (dialog as any).moveUpItem();
        editor.dropDownFormFieldDialogModule.removeItemFromList();
        (dialog as any).moveDownItem();

        expect(() => editor.dropDownFormFieldDialogModule.removeItemFromList()).not.toThrowError();
    });
    it('DropDown form field cancel button', () => {
        console.log('DropDown form field cancel button');
        editor.dropDownFormFieldDialogModule.show();
        expect(() => editor.dropDownFormFieldDialogModule.onCancelButtonClick()).not.toThrowError();
    });
    it('Textbox form field cancel button', () => {
        console.log('Textbox form field cancel button');
        editor.textFormFieldDialogModule.show();
        expect(() => editor.textFormFieldDialogModule.onCancelButtonClick()).not.toThrowError();
    });
    it('changeTypeDropDown-Regular text', () => {
        console.log('changeTypeDropDown-Regular text');
        let args: any;
        args = { preventDefault: function () { }, value: "Regular text" };
        editor.textFormFieldDialogModule.show();
        editor.textFormFieldDialogModule.changeTypeDropDown(args);
        expect(() => editor.textFormFieldDialogModule.insertTextField()).not.toThrowError();
    });
    it('changeTypeDropDown-Date', () => {
        console.log('changeTypeDropDown-Date');
        let args: any;
        args = { preventDefault: function () { }, value: "Date" };
        editor.textFormFieldDialogModule.show();
        editor.textFormFieldDialogModule.changeTypeDropDown(args);
        expect(() => editor.textFormFieldDialogModule.insertTextField()).not.toThrowError();
    });

    it('Text form field cancel button', () => {
        console.log('Text form field cancel button');
        editor.textFormFieldDialogModule.show();
        expect(() => editor.textFormFieldDialogModule.onCancelButtonClick()).not.toThrowError();
    });
    it('Valid Date format - Form field Text Dialog', () => {
        console.log('Valid Date format - Form field Text Dialog');
        editor.editorModule.insertFormField('Text');
        editor.selection.selectAll();
        (textdialog as any).defaultTextInput.value = '3/20/2020';
        expect(textdialog.isValidDateFormat()).toBe(true);
        (textdialog as any).defaultTextInput.value = '3022020';
        expect(textdialog.isValidDateFormat()).toBe(false);
    });
});
