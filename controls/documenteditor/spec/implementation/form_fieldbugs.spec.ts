import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../test-helper.spec';
import { DropDownFormFieldDialog, Selection, TextFormFieldDialog, TextFormFieldInfo } from '../../src/index';
import { CheckBoxFormFieldInfo, DropDownFormFieldInfo } from '../../blazor';

describe('form fields', () => {
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
        document.body.innerHTML = '';
    });
    it('validate text formfield input texts', ()=>{
        editor.openBlank();
        editor.editor.insertFormField('Text');
        let formfieldInfo:TextFormFieldInfo  = editor.getFormFieldInfo('Text1') as TextFormFieldInfo;
        formfieldInfo.defaultValue = "<<defaultvalue>>";
        formfieldInfo.helpText = "<<Helptext>>";
        formfieldInfo.name = "<<name>>";
        editor.setFormFieldInfo('Text1',formfieldInfo);
        editor.textFormFieldDialogModule.show();
        editor.textFormFieldDialogModule.insertTextField();
        expect((editor.getFormFieldInfo('<<name>>') as TextFormFieldInfo).helpText === formfieldInfo.helpText).toBe(true);
        expect((editor.getFormFieldInfo('<<name>>') as TextFormFieldInfo).name === formfieldInfo.name).toBe(true);
        expect((editor.getFormFieldInfo('<<name>>') as TextFormFieldInfo).defaultValue === formfieldInfo.defaultValue).toBe(true);
    });
    it('validate check-box formfield input texts', ()=>{
        editor.openBlank();
        editor.editor.insertFormField('CheckBox');
        let formfieldInfo:CheckBoxFormFieldInfo  = editor.getFormFieldInfo('CheckBox1') as CheckBoxFormFieldInfo;
        formfieldInfo.helpText = "<<Helptext>>";
        formfieldInfo.name = "<<name>>";
        editor.setFormFieldInfo('CheckBox1',formfieldInfo);
        editor.checkBoxFormFieldDialogModule.show();
        editor.checkBoxFormFieldDialogModule.insertCheckBoxField();
        expect((editor.getFormFieldInfo('<<name>>') as CheckBoxFormFieldInfo).helpText === formfieldInfo.helpText).toBe(true);
        expect((editor.getFormFieldInfo('<<name>>') as CheckBoxFormFieldInfo).name === formfieldInfo.name).toBe(true);
    });

    it('validate Dropdown formfield input texts', ()=>{
        editor.openBlank();
        editor.editor.insertFormField('DropDown');
        let formfieldInfo:DropDownFormFieldInfo  = editor.getFormFieldInfo('DropDown1') as DropDownFormFieldInfo;
        formfieldInfo.helpText = "<<Helptext>>";
        formfieldInfo.name = "<<name>>";
        formfieldInfo.dropdownItems.push("<<item1>>");
        editor.setFormFieldInfo('DropDown1',formfieldInfo);
        editor.dropDownFormFieldDialogModule.show();
        editor.dropDownFormFieldDialogModule.insertDropDownField();
        expect((editor.getFormFieldInfo('<<name>>') as DropDownFormFieldInfo).helpText === formfieldInfo.helpText).toBe(true);
        expect((editor.getFormFieldInfo('<<name>>') as DropDownFormFieldInfo).name === formfieldInfo.name).toBe(true);
        expect((editor.getFormFieldInfo('<<name>>') as DropDownFormFieldInfo).dropdownItems[0] == formfieldInfo.dropdownItems[0]).toBe(true);
        
    });
})