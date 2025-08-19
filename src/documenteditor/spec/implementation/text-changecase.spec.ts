import { createElement, select } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { Editor } from '../../src/document-editor/implementation/editor/editor';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { DocumentHelper } from '../../src/index';
import { Selection, SfdtExport } from '../../src/index';
import { TestHelper } from '../test-helper.spec';

/**
 * Change case feature spec
 */
describe('Change case testing', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    
    beforeEach(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory, SfdtExport);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true, enableSfdtExport: true});
        editor.enableLocalPaste = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterEach((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Toggle case Testing', () => {
        console.log('Toggle case Testing');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion');
        editor.selection.selectAll();
        editor.editor.changeCase('ToggleCase');
        expect(editor.selection.text).toMatch('sYNCFUSION');
    });
    it('Toggle case Undo and Redo Testing', () => {
        console.log('Toggle case Undo and Redo Testing');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion');
        editor.selection.selectAll();
        editor.editor.changeCase('ToggleCase');
        editor.editorHistory.undo();
        expect(editor.selection.text).toMatch('Syncfusion');
        editor.editorHistory.redo();
        editor.selection.selectAll();
        expect(editor.selection.text).toMatch('sYNCFUSION');
    });
    it('Uppercase Testing', () => {
        console.log('Uppercase Testing');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion');
        editor.selection.selectAll();
        editor.editor.changeCase('Uppercase');
        expect(editor.selection.text).toMatch('SYNCFUSION');
    });
    it('Uppercase undo and redo Testing', () => {
        console.log('Uppercase undo and redo Testing');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion');
        editor.selection.selectAll();
        editor.editor.changeCase('Uppercase');
        editor.editorHistory.undo();
        expect(editor.selection.text).toMatch('Syncfusion');
        editor.editorHistory.redo();
        editor.selection.selectAll();
        expect(editor.selection.text).toMatch('SYNCFUSION');
    });
    it('Lowercase Testing', () => {
        console.log('Lowercase Testing');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion');
        editor.selection.selectAll();
        editor.editor.changeCase('Lowercase');
        expect(editor.selection.text).toMatch('syncfusion');
    });
    it('Lowercase undo and redo Testing', () => {
        console.log('Lowercase undo and redo Testing');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion');
        editor.selection.selectAll();
        editor.editor.changeCase('Lowercase');
        editor.editorHistory.undo();
        expect(editor.selection.text).toMatch('Syncfusion');
        editor.editorHistory.redo();
        editor.selection.selectAll();
        expect(editor.selection.text).toMatch('syncfusion');
    });

    //Capitalize each word feature testing

    it('Capitalize each word Testing', () => {
        console.log('Capitalize each word Testing');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion software');
        editor.selection.selectAll();
        editor.editor.changeCase('CapitalizeEachWord');
        expect(editor.selection.text).toMatch('Syncfusion Software');
    });
    it('Capitalize each word undo and redo Testing', () => {
        console.log('Capitalize each word undo and redo Testing');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion software');
        editor.selection.selectAll();
        editor.editor.changeCase('CapitalizeEachWord');
        editor.editorHistory.undo();
        expect(editor.selection.text).toMatch('Syncfusion software');
        editor.editorHistory.redo();
        editor.selection.selectAll();
        expect(editor.selection.text).toMatch('Syncfusion Software');
    });
    it('Capitalize each word in Table ', () => {
        console.log('Capitalize each word in Table');
        editor.openBlank();
        editor.editorModule.insertTable(1,2);
        editor.editorModule.insertText('Syncfusion software.');
        editor.selection.selectTableCell();
        editor.editor.changeCase('CapitalizeEachWord');
        expect(editor.selection.text).toMatch('Syncfusion Software');
        editor.selection.handleTabKey(true,false);
        editor.editorModule.insertText('syncfusion@software');
        editor.selection.selectTableCell();
        editor.editor.changeCase('CapitalizeEachWord');
        expect(editor.selection.text).toMatch('Syncfusion@Software')
    });
    it('Capitalize each word with special characters Testing', () => {
        console.log('Capitalize each word with special characters Testing');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion !software');
        editor.selection.selectAll();
        editor.editor.changeCase('CapitalizeEachWord');
        expect(editor.selection.text).toMatch('Syncfusion !Software');
    });
    it('Capitalize each word with special characters Testing in List', () => {
        console.log('Capitalize each word with special characters Testing in List');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion !software');
        editor.editorModule.applyBullet('\uf0b7', 'Symbol');
        editor.selection.selectAll();
        editor.editor.changeCase('CapitalizeEachWord');
        expect(editor.selection.text).toMatch('Syncfusion !Software');
    });
    it('Capitalize each word with special characters undo and redo Testing', () => {
        console.log('Capitalize each word with special characters undo and redo Testing');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion !software');
        editor.selection.selectAll();
        editor.editor.changeCase('CapitalizeEachWord');
        editor.editorHistory.undo();
        expect(editor.selection.text).toMatch('Syncfusion !software');
        editor.editorHistory.redo();
        editor.selection.selectAll();
        expect(editor.selection.text).toMatch('Syncfusion !Software');
    });

    //Sentence case feature testing

    it('Sentencecase Testing', () => {
        console.log('Sentence case Testing');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion software.private limited');
        editor.selection.selectAll();
        editor.editor.changeCase('SentenceCase');
        expect(editor.selection.text).toMatch('Syncfusion software.private limited');
    });
    it('Sentencecase Testing for correct sentence', () => {
        console.log('Sentence case Testing for correct sentence');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion software. private limited');
        editor.selection.selectAll();
        editor.editor.changeCase('SentenceCase');
        expect(editor.selection.text).toMatch('Syncfusion software. Private limited');
    });
    it('Sentencecase Testing in Table', () => {
        console.log('Sentence case Testing in table');
        editor.openBlank();
        editor.editorModule.insertTable(1,2);
        editor.editorModule.insertText('Syncfusion software. private limited');
        editor.selection.selectTableCell();
        editor.editor.changeCase('SentenceCase');
        expect(editor.selection.text).toMatch('Syncfusion software. Private limited');
        editor.selection.handleTabKey(true,false);
        editor.editorModule.insertText('syncfusion software.private limited');
        editor.selection.selectTableCell();
        editor.editor.changeCase('SentenceCase');
        expect(editor.selection.text).toMatch('Syncfusion software.private limited');
    });
    it('Sentencecase undo and redo Testing', () => {
        console.log('Sentence case undo and redo Testing');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion software. private limited');
        editor.selection.selectAll();
        editor.editor.changeCase('SentenceCase');
        editor.editorHistory.undo();
        expect(editor.selection.text).toMatch('Syncfusion software. private limited');
        editor.editorHistory.redo();
        editor.selection.selectAll();
        expect(editor.selection.text).toMatch('Syncfusion software. Private limited');
    });
    it('Sentencecase Testing for List', () => {
        console.log('Sentence case Testing in list');
        editor.openBlank();
        editor.editorModule.insertText('syncfusion software. private limited');
        editor.editorModule.applyBullet('\uf0b7', 'Symbol');
        editor.selection.selectAll();
        editor.editor.changeCase('SentenceCase');
        expect(editor.selection.text).toMatch('Syncfusion software. Private limited');
    });

    //Testing feature by saving it and open again.

    it('Changecase save and open testing', () => {
        console.log('Change case save and open Testing');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion software. private limited');
        editor.selection.selectAll();
        editor.editor.changeCase('SentenceCase');
        let value = editor.serialize();
        editor.open(value);
        editor.selection.selectAll();
        expect(editor.selection.text).toMatch('Syncfusion software. Private limited');

    });
    
});

describe('Allcaps property testing', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            
            done();
        }, 1000);
    });
    it('AllCaps property value Testing', () => {
        console.log('AllCaps property value Testing');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion');
        editor.selection.selectAll();
        editor.editor.changeCase('Uppercase');
        expect(editor.selection.characterFormat.allCaps).toBe(true);
        editor.selection.selectAll();
        editor.editor.changeCase('Lowercase');
        expect(editor.selection.characterFormat.allCaps).toBe(false);
    });
});