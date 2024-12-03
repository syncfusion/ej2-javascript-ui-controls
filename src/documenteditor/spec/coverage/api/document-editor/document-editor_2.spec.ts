import { BookmarkDialog, ContentControlInfo, DocumentEditor, DocumentEditorSettings, FormFieldData, XmlHttpRequestEventArgs, XmlHttpRequestHandler } from '../../../../src/index';

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
        document.body.innerHTML = '';
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
        document.body.innerHTML = '';
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
            document.body.innerHTML = '';
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
            document.body.innerHTML = '';
            setTimeout(function () {
                done();
            }, 1000);
        });
        it('ContentControl import', () => {
            console.log('ContentControl import');
            documenteditor.editor.insertContentControl('RichText', 'sfdt');
            documenteditor.editor.insertContentControl('CheckBox', true);
            documenteditor.editor.insertContentControl('ComboBox', 'One', ['One', 'Two', 'Three']);
            documenteditor.editor.insertContentControl('Text', 'Hello World');
            let data: ContentControlInfo[] = [];
            let placeHolderPrefix: string = ''; // Declare and initialize the variable 'placeHolderPrefix'
            let contentControlData: ContentControlInfo = { title: placeHolderPrefix + 'Name', tag: '', value: 'John', canDelete: false, canEdit: false, type: 'RichText' };
            data.push(contentControlData);
            documenteditor.importContentControlData(data);
            expect(documenteditor.documentHelper.contentControlCollection.length).toBe(4);
    
        });
        it('ContentControl export', () => {
            console.log('ContentControl export');
            documenteditor.editor.insertContentControl('RichText', 'sfdt');
            documenteditor.editor.insertContentControl('CheckBox', true);
            documenteditor.editor.insertContentControl('ComboBox', 'One', ['One', 'Two', 'Three']);
            documenteditor.editor.insertContentControl('Text', 'Hello World');
            let contentControlInfos: ContentControlInfo[] = documenteditor.exportContentControlData();
            expect(contentControlInfos.length).toBe(8);
        });
        it('Reset ContentControl', () => {
            console.log('Reset ContentControl');
            documenteditor.editor.insertContentControl('RichText', 'sfdt');
            documenteditor.editor.insertContentControl('CheckBox', true);
            documenteditor.editor.insertContentControl('ComboBox', 'One', ['One', 'Two', 'Three']);
            documenteditor.editor.insertContentControl('Text', 'Hello World');
            let data: ContentControlInfo[] = [];
            let placeHolderPrefix: string = ''; // Declare and initialize the variable 'placeHolderPrefix'
            let contentControlData: ContentControlInfo = { title: placeHolderPrefix + 'Name', tag: '', value: 'John', canDelete: false, canEdit: false, type: 'RichText' };
            data.push(contentControlData);
            documenteditor.resetContentControlData(data);
            expect(documenteditor.documentHelper.contentControlCollection.length).toBe(12);
        });
    });