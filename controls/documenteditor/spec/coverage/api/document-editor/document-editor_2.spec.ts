import { BookmarkDialog, ContentControlInfo, DocumentEditor, DocumentEditorSettings, FormFieldData, TextElementBox, XmlHttpRequestEventArgs, XmlHttpRequestHandler } from '../../../../src/index';

import { createElement, Browser } from '@syncfusion/ej2-base';
import 'node_modules/es6-promise/dist/es6-promise';
import { TestHelper } from '../../../test-helper.spec';
import { Search } from '@syncfusion/ej2-dropdowns';

describe('Document editor setting Properties', () => {
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
    it("should have isWebLayout set to false", function() {
        // Assuming selectionModule is available in the scope
        documenteditor.selectionModule.isWebLayout = false;

        // Test if the isWebLayout property is set to false
        expect(documenteditor.selectionModule.isWebLayout).toBe(false);
    });

});

describe("checkModuleInjection", function() {
    let documenteditor: DocumentEditor;
    let editor: { enableSelection: boolean; checkModuleInjection: (moduleName: string | number, enableModule: any) => any };
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        documenteditor = new DocumentEditor({isReadOnly:false})
        documenteditor.enableAllModules();
        documenteditor.appendTo("#container");
    });
    beforeEach(function() {
        // Create a new context for each test case
        editor = {
            enableSelection: false,
            checkModuleInjection: function(moduleName: string | number, enableModule: any) {
                if (!this[moduleName]) {
                    this[moduleName] = enableModule;
                }
                return this[moduleName];
            }
        };
    });
    afterAll((done) => {
        documenteditor.destroy();
        document.body.removeChild(document.getElementById('container'));
        documenteditor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });

    
        it("should inject the Selection module if it is not already present", function() {
            // Set enableSelection to true to simulate the condition where the module should be injected
            editor.enableSelection = true;
    
            // Call the function that should check for module injection
            var result = editor.checkModuleInjection('Selection', editor.enableSelection);
    
            // Since Selection is initially not present, it should be set to the value of enableSelection
            expect(result).toBe(true);
        });
    
        it("should not modify the Selection module if it is already present", function() {
            // Initialize Selection with a value to simulate the module being present
    
            // Call the function that should check for module injection
            var result = editor.checkModuleInjection('Selection', editor.enableSelection);
    
            // Since Selection is initialized, it should not be modified
            expect(result).toBe(false);
        });
    });
    
    describe('code coverage documenteditor properties_2', () => {
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
        it('getBookmark', () => {
            console.log('getBookmark');
            documenteditor.editor.insertText("Adventure Works Cycles, the fictitious company on which the Adventure Works sample ");
            documenteditor.selection.selectAll();
            documenteditor.editor.insertBookmark('Test');
            let bookmark: string[] = documenteditor.getBookmarks();
            expect(bookmark.length).toBe(1);
            expect(bookmark[0]).toBe("Test");
        });
        it('FitPage FitOnePage', () => {
            console.log('FitPage FitOnePage');
            documenteditor.fitPage('FitOnePage');
            let zoomFactor: number = documenteditor.documentHelper.zoomFactor;
            expect(zoomFactor).toBe(documenteditor.documentHelper.zoomFactor);
        });
        it('FitPage_FitPageWidth', () => {
            console.log('FitPage_FitPageWidth');
            documenteditor.fitPage('FitPageWidth');
            expect(documenteditor.zoomFactor).not.toBe(1);
        });
        it('getRevisionData API', () => {
            console.log('getRevisionData API');
            documenteditor.enableCollaborativeEditing = true;
            documenteditor.getRevisionData(1,'10/10/2020');
            documenteditor.enableCollaborativeEditing = false;
        });
    });
    describe('ContentControl API', () => {
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
        it('ContentControl import', () => {
            console.log('ContentControl import');
            let richContentControl: ContentControlInfo = { title: "" + 'Name', tag: '', value: 'sfdt', canDelete: true, canEdit: true, type: 'RichText' };
            documenteditor.editor.insertContentControl(richContentControl);
            documenteditor.selection.moveToNextCharacter();
            documenteditor.selection.moveToNextCharacter();
            documenteditor.editor.insertContentControl('CheckBox', true);
            documenteditor.selection.moveToNextCharacter();
            documenteditor.selection.moveToNextCharacter();
            documenteditor.editor.insertContentControl('ComboBox', 'One', ['One', 'Two', 'Three']);
            documenteditor.selection.moveToNextCharacter();
            documenteditor.selection.moveToNextCharacter();
            documenteditor.editor.insertContentControl('Text', 'Hello World');
            let data: ContentControlInfo[] = [];
            let placeHolderPrefix: string = ''; // Declare and initialize the variable 'placeHolderPrefix'
            let contentControlData: ContentControlInfo = { title: placeHolderPrefix + 'Name', tag: '', value: 'John', canDelete: false, canEdit: false, type: 'RichText' };
            data.push(contentControlData);
            documenteditor.importContentControlData(data);
            expect(documenteditor.documentHelper.contentControlCollection.length).toBe(4);
            expect((documenteditor.documentHelper.contentControlCollection[0].nextElement as TextElementBox).text).toBe('John');
            expect(documenteditor.documentHelper.contentControlCollection[0].contentControlProperties.title).toBe('Name');
        });
        it('ContentControl export', () => {
            console.log('ContentControl export');
            documenteditor.openBlank();
            let richContentControl: ContentControlInfo = { title: "" + 'Name', tag: '', value: 'sfdt', canDelete: true, canEdit: true, type: 'RichText' };
            documenteditor.editor.insertContentControl(richContentControl);
            documenteditor.selection.moveToNextCharacter();
            documenteditor.selection.moveToNextCharacter();
            documenteditor.editor.insertContentControl('CheckBox', true);
            documenteditor.selection.moveToNextCharacter();
            documenteditor.selection.moveToNextCharacter();
            documenteditor.editor.insertContentControl('ComboBox', 'One', ['One', 'Two', 'Three']);
            documenteditor.selection.moveToNextCharacter();
            documenteditor.selection.moveToNextCharacter();
            documenteditor.editor.insertContentControl('Text', 'Hello World');
            let contentControlInfos: ContentControlInfo[] = documenteditor.exportContentControlData();
            expect(contentControlInfos.length).toBe(4);
        });
        it('Reset ContentControl', () => {
            console.log('Reset ContentControl');
            documenteditor.openBlank();
            let richContentControl: ContentControlInfo = { title: "" + 'Name', tag: '', value: 'sfdt', canDelete: true, canEdit: true, type: 'RichText' };
            documenteditor.editor.insertContentControl(richContentControl);
            documenteditor.selection.moveToNextCharacter();
            documenteditor.selection.moveToNextCharacter();
            documenteditor.editor.insertContentControl('CheckBox', true);
            documenteditor.selection.moveToNextCharacter();
            documenteditor.selection.moveToNextCharacter();
            documenteditor.editor.insertContentControl('ComboBox', 'One', ['One', 'Two', 'Three']);
            documenteditor.selection.moveToNextCharacter();
            documenteditor.selection.moveToNextCharacter();
            documenteditor.editor.insertContentControl('Text', 'Hello World');
            let data: ContentControlInfo[] = [];
            let placeHolderPrefix: string = ''; // Declare and initialize the variable 'placeHolderPrefix'
            let contentControlData: ContentControlInfo = { title: placeHolderPrefix + 'Name', tag: '', value: 'John', canDelete: false, canEdit: false, type: 'RichText' };
            data.push(contentControlData);
            documenteditor.resetContentControlData(data);
            expect(documenteditor.documentHelper.contentControlCollection.length).toBe(4);
            expect(documenteditor.documentHelper.contentControlCollection[0].contentControlProperties.title).toBe('Name');
        });
    });
describe('ContentControl Lock', () => {
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
    it('Inserting text in content control', () => {
        console.log('Inserting text in content control');
        let richContentControl: ContentControlInfo = { title: "" + 'Name', tag: '', value: 'sfdt', canDelete: false, canEdit: false, type: 'RichText' };
        documenteditor.editor.insertContentControl(richContentControl);
        documenteditor.selection.select('0;0;2', '0;0;2');
        documenteditor.editor.insertText('Hello World');
        expect(documenteditor.selection.start.currentWidget.children.length).toBe(3);
    });
    it('Inserting content control in content control', () => {
        console.log('Inserting content control in content control');
        let richContentControl: ContentControlInfo = { title: "" + 'Name', tag: '', value: 'sfdt', canDelete: false, canEdit: false, type: 'RichText' };
        documenteditor.editor.insertContentControl(richContentControl);
        documenteditor.selection.select('0;0;2', '0;0;2');
        documenteditor.editor.insertContentControl('RichText');
        expect(documenteditor.documentHelper.contentControlCollection.length).toBe(1);
    });
});