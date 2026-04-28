import { DocumentEditorContainer } from '../../../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../../../src/document-editor-container/tool-bar/tool-bar';
import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditor, ParagraphFormatProperties, SpellChecker } from '../../../../src';
/**
 * Document Editor container
 */
describe('Document Editor container properties_3', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer();
        container.appendTo(element);
    });
 afterAll((done) => {
        container.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        expect(() => { container.destroy(); }).not.toThrowError();
        
        element = undefined;
        container = undefined;
        setTimeout(() => {
            done();
        },100);
    });
    // it('enable spellcheck', () => {
    //     console.log('enable spellcheck');
    //     container.enableSpellCheck = true;
    //     expect(container.documentEditor.enableSpellCheck).toBe(true);

    // });
    it('customizeDocumentEditorSettings', () => {
        console.log('customizeDocumentEditorSettings');
        container.documentEditorSettings = {fontFamilies : ['Arial']};
        expect(container.documentEditor.documentEditorSettings.fontFamilies.length).not.toBe(0);
    });
    it('currentUser', () => {
        console.log('currentUser');
        container.currentUser = "John";
        container.documentEditor.editor.insertText("Hello");
        container.enableTrackChanges = true;
        container.documentEditor.editor.insertText("world");
        expect(container.currentUser).toContain("John");
    });
    it('userColor', () => {
        console.log('userColor');
        container.userColor = "#FF0000";
        expect(container.documentEditor.userColor).toEqual("#FFFF00");
    });
    it('layoutType', () => {
        console.log('layoutType');
        container.layoutType = 'Continuous';
        expect(container.documentEditor.layoutType).toEqual('Pages');
    }); 
});
describe('Document Editor container properties_4', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer();
        container.appendTo(element);
    });
 afterAll((done) => {
        container.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        expect(() => { container.destroy(); }).not.toThrowError();
        
        element = undefined;
        container = undefined;
        setTimeout(() => {
            done();
        },100);
    });
    it('Height', () => {
        console.log('Height');
        container.height = "500px";
        container.documentEditor.resize();
        expect(container.documentEditor.height).toBe("100%");
    });
    it('Width', () => {
        console.log('Width');
        container.width = "750px";
        container.documentEditor.resize();
        expect(container.documentEditor.width).toBe("100%");
    });
    it('enableAutoFocus', () => {
        console.log('enableAutoFocus');
        expect(container.documentEditor.enableAutoFocus).toBe(true);
        container.enableAutoFocus = false;
        // expect(container.enableAutoFocus).toBe(false);
    });
    it('autoResizeOnVisibilityChange', () => {
        console.log('autoResizeOnVisibilityChange');
        container.autoResizeOnVisibilityChange = true;
        expect(container.documentEditor.autoResizeOnVisibilityChange).toBe(false);
    });
    it('header',()=>{
        console.log('custom headers');
        container.headers = [{"sync":"Header"}];
        expect(container.headers).not.toBeUndefined();
    });
});
