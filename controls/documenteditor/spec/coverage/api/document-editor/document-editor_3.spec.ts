import { BookmarkDialog, ContentControlInfo, DocumentEditor, DocumentEditorSettings, FormFieldData, XmlHttpRequestEventArgs, XmlHttpRequestHandler } from '../../../../src/index';
import { createElement, Browser } from '@syncfusion/ej2-base';
import 'node_modules/es6-promise/dist/es6-promise';
import { TestHelper } from '../../../test-helper.spec';



describe('Show hide pane ', () => {
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
    it('show hide hidden mark using key',()=>{
        console.log('show hide hidden mark using key');
        documenteditor.toggleShowHiddenMarksInternal();
        expect(documenteditor.documentEditorSettings.showHiddenMarks).toBe(true);

    });
    it('show options pane', () => {
        console.log('show options pane');
        expect(() => { documenteditor.showOptionsPane(); }).not.toThrowError();

    });
    it('show xml pane', () => {
        console.log('show xml pane');
        expect(() => { documenteditor.showXmlPane(); }).not.toThrowError();

    });
    it('show restrict pane', () => {
        console.log('show restrict pane');
        expect(() => { documenteditor.showRestrictEditingPane(); }).not.toThrowError();

    });
    it('show Spell check dialog', () => {
        console.log('show Spell check dialog');
        expect(() => { documenteditor.showSpellCheckDialog(); }).toThrowError();

    });
    it('Update field',()=>{
        console.log('Update field');
        expect(() => { documenteditor.updateFields(); }).not.toThrowError();

    })
});

describe('Open document from URL',()=>{
    let documenteditor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        documenteditor = new DocumentEditor({isReadOnly:false})
        documenteditor.serviceUrl ='https://services.syncfusion.com/js/production/api/documenteditor/';
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
    it('From URL',()=>{
        console.log('From URL');
        documenteditor.documentChange = () => {
            expect(documenteditor.documentHelper.pages.length).toBe(3);
        }
        documenteditor.open('https://cdn.syncfusion.com/content/document-editor/GiantPanda.docx');
    });
});