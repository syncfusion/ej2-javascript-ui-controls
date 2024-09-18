import { Toolbar } from "../../src/document-editor-container/tool-bar/tool-bar"
import { createElement } from "@syncfusion/ej2-base";
import { TestHelper } from "../test-helper.spec";
import { DocumentEditor } from "../../src/document-editor/document-editor";
import { Editor } from "../../src/document-editor/implementation/editor/editor";
import { Selection } from '../../src/document-editor/implementation/selection/selection';
import { EditorHistory } from "../../src/document-editor/implementation/editor-history/editor-history";
import { SfdtExport } from "../../src/document-editor/implementation/writer/sfdt-export";
import { SpellChecker } from "../../src/document-editor/implementation/spell-check/spell-checker";
import { Search } from "../../src/document-editor/implementation/search/search";

describe('Spellcheck enabled testcase', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SpellChecker);
       container = new DocumentEditor({ isReadOnly: false, enableSpellCheck:true,documentEditorSettings: { showHiddenMarks: true, showBookmarks: true } });
         container.enableAllModules();
        container.serviceUrl = 'https://services.syncfusion.com/js/production/api/documenteditor/';
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
        var spellChecker = container.spellChecker;
        spellChecker.languageID = 1033;
        spellChecker.removeUnderline = false;
        spellChecker.allowSpellCheckAndSuggestion = true;
        spellChecker.enableOptimizedSpellCheck = true;
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('spellcheck enabled rendering cases',() => {
        console.log('spellcheck enabled rendering cases');
        var text: string = '{"sfdt":"UEsDBAoAAAAIABdL+VhDPK89EQMAAAIYAAAEAAAAc2ZkdM2YSW+jMBiG/wryXKMqgQQCt1FH0RxGo0pzrHIwYAMas4ztTtpG+e/9vNCENEnplpDLa7x92xODvEZ1I4uyeCR/aCpRJPkdGSFBEhTdrhFow1G0Rs0KRf7EHaEmR1EQQoOV0ADlVqXV2GqeosjzR4haTWmDojFoTUwjLoyAJfSbrG5wRtAIkYqiCJZTpTDMi1aJ1oJWKJqAEqNNVgnY4DvHcZHA+iqpmdAj5N9KK4tlopeakdvlBozq6BqqQotTLpRKcGsNY0wa5ZnR2D7nRv4rARWyUo7XvMQM7DLlpx5IqJlYaBuJsQEPFDNBoF8yMIQETgVNMwenlJNMOgJTnskcbZabJdgymy1H7Xq7XO9qW1Q8QnwQIIUp6BqzIuYFeHKngxXSZBdryU0GYInyxCxSrZ1lONnuTHFniEIxyF5PpwOi+lAuWVHZIhulVqXxPhZasBFbXmYjrNkzTdb9v8pq215Vz+1V0uK9LRYV1iNJmWmkcmWAtdQQC2IOziIIXVilpbHfGElzWRpPKDUOJnXZ2FI8yNh6qfKAFPHfFvqHNEkPGpUOT3bzj2V1H8nqfmtiMzIWfxKcFlXmTD7L6KulVMfIbi2vxkE48X1/Ng4CdxxOg25xJy8isej7XfSdX0WWS1UZnV93MZuGPtqjeTupy/RO/4Fuc2Ls/Nl38+Zc55ijV5LbTpIGjUtG8YNQfMekc4M5zjhucmdRV/LZ5SPDHdc3+/G5Z4Pnbey4x9jxBsGO24cd9zg73sDYaV32BoqDdwwH92QiJwsv8L2vx8Hrg4N3HIezR9ETh+lAcZi+xKFoPxEGcDpM++AwPYTDhaLoicNsoDjMDpwOl6dg1oeC2cFDYYjF9wdafP9NxT/XG8HvU3z/jcW/3IsgGGjxg/e9CM5FQdCHguC9L4LL4TAfKA7zY5+J46vZyVR6+vf1QMz7ADE//qF4gTh6IhEOFInw1AkxKDbCPmyEpw+LAUNC+OcQcvgy8eWVWSfPOqXWi9apRV3LyztlvVA3xkxdPIPCoNakNMrt473RosyE3vYJUEsBAhQACgAAAAgAF0v5WEM8rz0RAwAAAhgAAAQAAAAAAAAAAAAAAAAAAAAAAHNmZHRQSwUGAAAAAAEAAQAyAAAAMwMAAAAA"}';
        expect(() => { container.open(text); }).not.toThrowError();

     });

     it('spellcheck enabled by inserting text',() => {
        console.log('spellcheck enabled by inserting text');
        container.openBlank();
        container.editor.insertText('sdfdgvdg');
        container.editor.insertText(' '); 
       expect(() => { container.editor.onEnter();}).not.toThrowError();

     });
});
describe('exportAspath API', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false,enableEditorHistory: true, enableSfdtExport: true, documentEditorSettings: { showHiddenMarks: true, showBookmarks: true } });
       // container.documentEditorSettings.showHiddenMarks =true;
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });

    it('exportasPath API',() => {
        console.log('exportasPath API');
        //container.openBlank();
       expect(() => { container.exportAsPath(1);}).not.toThrowError();

     });
});


describe('Find', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        container = new DocumentEditor({  isReadOnly: false });
       // container.documentEditorSettings.showHiddenMarks =true;
       container.enableAllModules();
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });

    it('search the text in paragraph and table',() => {
        console.log('search the text in paragraph and table'); 
        container.editor.insertText('you can create and edit Word documents online much faster and easier using intuitive UI options of the document editor');
        container.editor.insertTable(2,2);
        container.editor.insertText('you can create and edit Word documents online much faster and easier using intuitive UI options of the document editor');
        container.search.findAll('and');
        expect(container.search.searchResults.length).not.toBe(0);

     });
});

