import { DocumentEditorContainer } from '../../../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../../../src/document-editor-container/tool-bar/tool-bar';
import { createElement } from '@syncfusion/ej2-base';
import {DocumentEditor, ParagraphFormatProperties} from '../../../../src';
/**
 * Document Editor container
 */


describe('Document Editor container setDefaultCharacterFormat', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer();
        let CharacterFormat = {
            fontColor: "Empty",
            fontFamily: 'Times New Roman',
            fontSize: 8,
            backgroundColor: "#000000"
        }
        let ParagraphFormat: ParagraphFormatProperties = {
            afterSpacing: 10,
            beforeSpacing: 10,
            lineSpacing: 1,
            lineSpacingType: 'Multiple',
            textAlignment: 'Center'
        }
        let sectionFormat = {
            headerDistance: 36,
            footerDistance: 36,
            pageWidth: 612,
            pageHeight: 792,
            leftMargin: 72,
            rightMargin: 72,
            topMargin: 72,
            bottomMargin: 72,
            differentFirstPage: false,
            differentOddAndEvenPages: false,
            bidi: false
        }
        container.setDefaultCharacterFormat(CharacterFormat);
        container.setDefaultParagraphFormat(ParagraphFormat);
        container.setDefaultSectionFormat(sectionFormat);
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
    it('setDefaultCharacterFormat', () => {
        console.log('setDefaultCharacterFormat');
        expect(container.documentEditor.selection.characterFormat.fontFamily).toBe('Times New Roman');
    });
    it('setDefaultParagraphFormat', () => {
        console.log('setDefaultParagraphFormat');
        expect(container.documentEditor.selection.paragraphFormat.afterSpacing).toBe(10);
    });
    it('setDefaultSectionFormat', () => {
        console.log('setDefaultSectionFormat');
        expect(container.documentEditor.selection.sectionFormat.pageWidth).toBe(612);
    });
});
describe('Document Editor container properties', () => {
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
    it('On property zoomfactorchange',() => {
        console.log('On property zoomfactorchange');
        container.documentEditor.zoomFactor = 2;
        expect(container.documentEditor.documentHelper.zoomFactor).toBe(1);
    });
    it('On property showHiddenMarks',() => {
        console.log('On property showHiddenMarks');
        container.documentEditor.documentEditorSettings.showHiddenMarks = true;
        expect(container.documentEditor.documentEditorSettings.showHiddenMarks).toBe(true);
    });
});
describe('Document Editor container properties', () => {
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
    it('enable track', () => {
        console.log('enable track');
        container.enableTrackChanges = true;
        expect(container.documentEditor.enableTrackChanges).toBe(false);
        container.enableTrackChanges = false;
        expect(container.documentEditor.enableTrackChanges).toBe(false);
    });
    it('enable Local paste', () => {
        console.log('enable Local paste');
        container.enableLocalPaste = true;
        expect(container.documentEditor.enableLocalPaste).toBe(false);
        container.enableLocalPaste = false;
        expect(container.documentEditor.enableLocalPaste).toBe(false);
    });
    it('serviceUrl', () => {
        console.log('serviceUrl');
        container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
        expect(container.serviceUrl).toBe('https://ej2services.syncfusion.com/production/web-services/api/documenteditor/');
    });
    
});

