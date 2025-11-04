import { BookmarkDialog, ContentControlInfo, DocumentEditor, DocumentEditorSettings, FormFieldData, Regular, XmlHttpRequestEventArgs, XmlHttpRequestHandler } from '../../../../src/index';
import { createElement, Browser } from '@syncfusion/ej2-base';
import 'node_modules/es6-promise/dist/es6-promise';
import { TestHelper } from '../../../test-helper.spec';
import { DocumentEditorContainer } from '../../../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../../../src/document-editor-container/tool-bar/tool-bar';


describe('Show Dialog documenteditor properties_1 ', () => {
    let documenteditor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        documenteditor = new DocumentEditor({isReadOnly:false})
        documenteditor.enableAllModules();
        documenteditor.appendTo("#container");
    });
    afterAll((done) => {
        documenteditor.destroy();
        document.body.removeChild(document.getElementById('container'));
        documenteditor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('ShowBookmarkDialog', () => {
        console.log('ShowBookmarkDialog');
        expect(() => documenteditor.showDialog('Bookmark')).not.toThrowError();
        documenteditor.documentHelper.hideDialog();
    });
    it('ShowHyperlinkDialog', () => {
        console.log('ShowHyperlinkDialog');
        expect(() => documenteditor.showDialog('Hyperlink')).not.toThrowError();
        documenteditor.documentHelper.hideDialog();
    });
    it('ShowTableDialog', () => {
        console.log('ShowTableDialog');
        documenteditor.editor.insertTable(2, 2);
        expect(() => documenteditor.showDialog('Table')).not.toThrowError();
        documenteditor.documentHelper.hideDialog();
    });
});
describe('Show Dialog documenteditor properties_1 ', () => {
    let documenteditor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        documenteditor = new DocumentEditor({isReadOnly:false})
        documenteditor.enableAllModules();
        documenteditor.appendTo("#container");
    });
    afterAll((done) => {
        documenteditor.destroy();
        document.body.removeChild(document.getElementById('container'));
        documenteditor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
        it('showTableOfContentsDialog', () => {
            console.log('showTableOfContentsDialog');
            expect(() => documenteditor.showDialog('TableOfContents')).not.toThrowError();
            documenteditor.documentHelper.hideDialog();
        });
        it('showPageSetupDialog', () => {
            console.log('showPageSetupDialog');
            expect(() => documenteditor.showDialog('PageSetup')).not.toThrowError();
            documenteditor.documentHelper.hideDialog();
        });
        it('showColumnsDialog', () => {
            console.log('showColumnsDialog');
            expect(() => documenteditor.showDialog('Columns')).not.toThrowError();
            documenteditor.documentHelper.hideDialog();
        });
        it('showStyleDialog', () => {
            console.log('showStyleDialog');
            expect(() => documenteditor.showDialog('Style')).not.toThrowError();
            documenteditor.documentHelper.hideDialog();
        });
    });
    describe('Show Dialog documenteditor properties_2 ', () => {
        let documenteditor: DocumentEditor;
        beforeAll((): void => {
            let ele: HTMLElement = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            documenteditor = new DocumentEditor({ isReadOnly: false })
            documenteditor.enableAllModules();
            documenteditor.appendTo("#container");
        });
        afterAll((done) => {
            documenteditor.destroy();
            document.body.removeChild(document.getElementById('container'));
            documenteditor = undefined;
            
            setTimeout(function () {
                done();
            }, 1000);
        });
        it('showListDialog', () => {
            console.log('showListDialog');
            expect(() => documenteditor.showDialog('List')).not.toThrowError();
            documenteditor.documentHelper.hideDialog();

        });
        it('showStylesDialog', () => {
            console.log('showStylesDialog');
            documenteditor.showDialog('Style')
            expect(() => documenteditor.showDialog('Styles')).not.toThrow();
            documenteditor.documentHelper.hideDialog();
        });
        it('showParagraphDialog', () => {
            console.log('showParagraphDialog');
            expect(() => documenteditor.showDialog('Paragraph')).not.toThrowError();
            documenteditor.documentHelper.hideDialog();
        });
    });
    describe('Show Dialog documenteditor properties_1 ', () => {
        let documenteditor: DocumentEditor;
        beforeAll((): void => {
            let ele: HTMLElement = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            documenteditor = new DocumentEditor({isReadOnly:false})
            documenteditor.enableAllModules();
            documenteditor.appendTo("#container");
        });
        afterAll((done) => {
            documenteditor.destroy();
            document.body.removeChild(document.getElementById('container'));
            documenteditor = undefined;
            
            setTimeout(function () {
                done();
            }, 1000);
        });
        it('showFontDialog', () => {
            console.log('showFontDialog');
            expect(() => documenteditor.showDialog('Font')).not.toThrowError();
            documenteditor.documentHelper.hideDialog();
        });
        it('showTablePropertiesDialog', () => {
            console.log('showTablePropertiesDialog');
           documenteditor.editor.insertTable(2, 2);
            expect(() => {
                documenteditor.showDialog('TableProperties')}).not.toThrowError();
            documenteditor.documentHelper.hideDialog();
        });

        it('showBordersAndShadingDialog', () => {
            console.log('showBordersAndShadingDialog');
            expect(() => documenteditor.showDialog('BordersAndShading')).not.toThrowError();
            documenteditor.documentHelper.hideDialog();
        });
        it('showTableOptionsDialog', () => {
            console.log('showTableOptionsDialog');
            documenteditor.editor.insertTable(2, 2);
            expect(() => documenteditor.showDialog('TableOptions')).not.toThrowError();
        });
        it('show cell options dialog', () => {
            console.log('showcellOptionsDialog');
            documenteditor.editor.insertTable(2, 2);
            expect(() => documenteditor.showCellOptionsDialog()).not.toThrowError();
        });
        // it('showSpellCheckDialog', () => {
        //     console.log('showSpellCheckDialog');
        //     expect(() => documenteditor.showSpellCheckDialog()).not.toThrowError();
            //    documenteditor.documentHelper.hideDialog();
        // });
    });
    describe('Show Dialog documenteditor properties_1 ', () => {
        let documenteditor: DocumentEditor;
        beforeAll((): void => {
            let ele: HTMLElement = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            documenteditor = new DocumentEditor({isReadOnly:false})
            documenteditor.enableAllModules();
            documenteditor.appendTo("#container");
        });
        afterAll((done) => {
            documenteditor.destroy();
            document.body.removeChild(document.getElementById('container'));
            documenteditor = undefined;
            
            setTimeout(function () {
                done();
            }, 1000);
        });
        it('showDateContentDialog', () => {
            console.log('showDateContentDialog');
            expect(() => documenteditor.showDialog('DatepickerContentControl')).not.toThrowError();
            documenteditor.documentHelper.hideDialog();
        });
        it('showPicContentControlDialog', () => {
            console.log('showPicContentControlDialog');
            expect(() => documenteditor.showDialog('PictureContentControl')).not.toThrowError();
            documenteditor.documentHelper.hideDialog();
        });
        it('showContentPropertiesDialog', () => {
            console.log('showContentPropertiesDialog');
            expect(() => documenteditor.showDialog('ContentControlProperties')).not.toThrowError();
            documenteditor.documentHelper.hideDialog();
        });

    });
describe('Form Field documenteditor properties ', () => {
    let documenteditor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        documenteditor = new DocumentEditor({isReadOnly:false})
        documenteditor.enableAllModules();
        documenteditor.appendTo("#container");
    });
    afterAll((done) => {
        documenteditor.destroy();
        document.body.removeChild(document.getElementById('container'));
        documenteditor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('TextFormFieldDialog', () => {
        console.log('TextFormFieldDialog');
        documenteditor.editor.insertFormField('Text');
        expect(() => documenteditor.textFormFieldDialogModule.show()).not.toThrowError();
        documenteditor.documentHelper.hideDialog();
    });
    it('CheckBoxFormFieldDialog', () => {
        console.log('CheckBoxFormFieldDialog');
        documenteditor.editor.insertFormField('CheckBox');
        expect(() => documenteditor.checkBoxFormFieldDialogModule.show()).not.toThrowError();
        documenteditor.documentHelper.hideDialog();
    });
    it('DropDownFormFieldDialog', () => {
        console.log('DropDownFormFieldDialog');
        documenteditor.editor.insertFormField('DropDown');
        expect(() => documenteditor.dropDownFormFieldDialogModule.show()).not.toThrowError();
        documenteditor.documentHelper.hideDialog();
    });
    it('Export form field', () => {
        console.log('Export form field');
        documenteditor.editor.insertFormField('Text');
        documenteditor.editor.insertFormField('CheckBox');
        documenteditor.editor.insertFormField('DropDown');
        let formFieldDate: FormFieldData[] = documenteditor.exportFormData();
        expect(formFieldDate.length).toBe(6);
    });
    it('Import form field', () => {
        console.log('Import form field');
        documenteditor.editor.insertFormField('Text');
        documenteditor.editor.insertFormField('CheckBox');
        documenteditor.editor.insertFormField('DropDown');
        let textformField: FormFieldData = { fieldName: 'Text1', value: 'Hello World' };
        let checkformField: FormFieldData = { fieldName: 'Check1', value: true };
        let dropdownformField: FormFieldData = { fieldName: 'Drop1', value: 1 };
        let formFieldDate: FormFieldData[] = documenteditor.exportFormData();
        documenteditor.importFormData([textformField, checkformField, dropdownformField]);
        expect(formFieldDate.length).toBe(9);
    });
    it('Reset form fields', () => {
        console.log('Reset form fields');
        documenteditor.editor.insertFormField('Text');
        documenteditor.editor.insertFormField('CheckBox');
        documenteditor.editor.insertFormField('DropDown');
        documenteditor.resetFormFields();
        expect(documenteditor.getFormFieldInfo.length).toBe(1);
    });
});
describe('Save functionality documenteditor properties ', () => {
    let documenteditor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        documenteditor = new DocumentEditor({ isReadOnly: false })
        documenteditor.enableAllModules();
        documenteditor.appendTo("#container");
        documenteditor.editor.insertText("Adventure Works Cycles, the fictitious company on which the Adventure Works sample ");
    });
    afterAll((done) => {
        documenteditor.destroy();
        document.body.removeChild(document.getElementById('container'));
        documenteditor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Save Docx', () => {
        console.log('Save Docx');
        expect(()=>{ documenteditor.save('sample', 'Docx');}).not.toThrowError();
    });
    it('Save sfdt', () => {
        console.log('Save sfdt');
        expect(()=>{ documenteditor.save('sample', 'Sfdt');}).not.toThrowError();
    });
    it('Save txt', () => {
        console.log('Save txt');
        expect(()=>{ documenteditor.save('sample', 'Txt');}).not.toThrowError();
    });
    it('Save as Blob', () => {
        console.log('Save as Blob');
        expect(()=>{ documenteditor.saveAsBlob('Docx');}).not.toThrowError();
    });
    it('Save as Blob - Sfdt', () => {
        console.log('Save as Blob - Sfdt');
        expect(()=>{ documenteditor.saveAsBlob('Sfdt');}).not.toThrowError();
    });
});

describe('Document Editor Color Picker Properties', () => {
    let documenteditor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        documenteditor = new DocumentEditor({isReadOnly:false})
        documenteditor.enableAllModules();
        documenteditor.appendTo("#container");
    });

    afterAll((done) => {
        documenteditor.destroy();
        document.body.removeChild(document.getElementById('container'));
        documenteditor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });

    it('should change color picker properties and apply them', () => {
        console.log('applyColorPickerProperties mode change');

        // Define new color picker settings
        documenteditor.documentEditorSettings = {colorPickerSettings : {
            mode: 'Picker',
            modeSwitcher: true,
            showButtons: true,
            columns: 5,
            disabled: false,
            inline: false,
            noColor: true
        }};

        // Verify that the color picker settings were applied correctly
        const settings = documenteditor.documentEditorSettings.colorPickerSettings;
        expect(settings.mode).toBe('Picker');
        expect(settings.columns).toBe(5);
    });
});

describe('Document Editor enableOptimizedTextMeasuring', () => {
    let documenteditor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        documenteditor = new DocumentEditor({isReadOnly:false , documentEditorSettings: { enableOptimizedTextMeasuring: false, showRuler: true }});
        documenteditor.enableAllModules();
        documenteditor.appendTo("#container");
    });

    afterAll((done) => {
        documenteditor.destroy();
        document.body.removeChild(document.getElementById('container'));
        documenteditor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });

    it('enable optimized rendering false validation', () => {
        console.log('enable optimized rendering false validation');
        documenteditor.editor.insertText("Adventure Works Cycles, the fictitious company on which the Adventure Works sample ");
        documenteditor.selection.selectAll();
        documenteditor.selection.characterFormat.fontSize = 20;

        documenteditor.selection.characterFormat.bold = true;
        documenteditor.selection.characterFormat.italic = true;
        documenteditor.selection.characterFormat.fontSize = 0.1;
        expect(documenteditor.documentEditorSettings.enableOptimizedTextMeasuring).toBe(false);
    });
    it('regular branch coverage', () => {
        console.log('regular branch coverage');
        expect(() => { (documenteditor.textMeasureHelper as Regular).applyStyle(undefined, undefined, ''); }).not.toThrowError();
    });
    it('show Ruler validation', () => {
        console.log('show Ruler validation');
        expect(documenteditor.documentEditorSettings.showRuler).toBe(true);
    });
});

describe('Document Editor applyStyle different Headings', () => {
    let documenteditor: DocumentEditorContainer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditorContainer.Inject(Toolbar);
        documenteditor = new DocumentEditorContainer({ showPropertiesPane: false, enableLocalPaste: true });
        documenteditor.appendTo("#container");
        jasmine.clock().install();
    });
    afterAll((done) => {
        documenteditor.destroy();
        document.body.removeChild(document.getElementById('container'));
        documenteditor = undefined;
        jasmine.clock().uninstall();
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Apply Heading 7', () => {
        documenteditor.documentEditor.editor.insertText("Heading 7");
        documenteditor.documentEditor.selection.selectAll();
        const style = document.querySelector('#container_editor_font_properties_style') as any;
        const dropdownIcon = style.ej2_instances[0];
        dropdownIcon.showPopup();
        const options = document.querySelectorAll('li[role="option"]');
        let heading = null;
        for (let i = 0; i < options.length; i++) {
            if (options[i].textContent && options[i].textContent.indexOf('Heading 7') !== -1) {
                heading = options[i] as any;
                break;
            }
        }
        
        if (heading) {
            heading.click();
            jasmine.clock().tick(100);
        }
        expect(documenteditor.documentEditor.editor.documentHelper.selection.paragraphFormat.styleName).toBe("Heading 7");
    });
    it('Apply Heading 8', () => {
        documenteditor.documentEditor.editor.insertText("Heading 8");
        documenteditor.documentEditor.selection.selectAll();
        const style = document.querySelector('#container_editor_font_properties_style') as any;
        const dropdownIcon = style.ej2_instances[0];
        dropdownIcon.showPopup();
        const options = document.querySelectorAll('li[role="option"]');
        let heading = null;
        for (let i = 0; i < options.length; i++) {
            if (options[i].textContent && options[i].textContent.indexOf('Heading 8') !== -1) {
                heading = options[i] as any;
                break;
            }
        }
        
        if (heading) {
            heading.click();
            jasmine.clock().tick(100);
        }
        expect(documenteditor.documentEditor.editor.documentHelper.selection.paragraphFormat.styleName).toBe("Heading 8");
    });
    it('Apply Heading 9', () => {
        documenteditor.documentEditor.editor.insertText("Heading 9");
        documenteditor.documentEditor.selection.selectAll();
        const style = document.querySelector('#container_editor_font_properties_style') as any;
        const dropdownIcon = style.ej2_instances[0];
        dropdownIcon.showPopup();
        const options = document.querySelectorAll('li[role="option"]');
        let heading = null;
        for (let i = 0; i < options.length; i++) {
            if (options[i].textContent && options[i].textContent.indexOf('Heading 9') !== -1) {
                heading = options[i] as any;
                break;
            }
        }
        
        if (heading) {
            heading.click();
            jasmine.clock().tick(100);
        }
        expect(documenteditor.documentEditor.editor.documentHelper.selection.paragraphFormat.styleName).toBe("Heading 9");
    });
});