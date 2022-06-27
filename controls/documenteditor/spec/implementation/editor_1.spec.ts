import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, DocumentHelper, WordExport, SfdtExport } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { LayoutViewer, PageLayoutViewer } from '../../src/index';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';

/**
 * Auto Convert List Test script
 */

describe('Auto convert list using space key possible cases and level pattern arabic validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Starting numerical text 1 and followed by .', () => {
console.log('Starting numerical text 1 and followed by .');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(36);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(36);
    });
    it('Starting numerical text 1 and followed by -', () => {
console.log('Starting numerical text 1 and followed by -');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('-');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(36);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(36);
    });
    it('Starting numerical text 1 and followed by >', () => {
console.log('Starting numerical text 1 and followed by >');
        editor.openBlank();
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('>');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text 1 and followed by )', () => {
console.log('Starting numerical text 1 and followed by )');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText(')');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text 1 and followed by &', () => {
console.log('Starting numerical text 1 and followed by &');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('&');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
    it('Starting numerical text 1 and followed by . and also paragraph is not empty', () => {
console.log('Starting numerical text 1 and followed by . and also paragraph is not empty');
        editor.openBlank();
        editor.editorModule.insertText('Adventure');
        documentHelper.selection.handleHomeKey();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
});

describe('Auto convert list using tab key possible cases with  level pattern low letter and up letter validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Starting numerical text a and followed by .', () => {
console.log('Starting numerical text a and followed by .');
        editor.openBlank();
        editor.editorModule.insertText('a');
        editor.editorModule.insertText('.');
        documentHelper.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(36);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(36);
    });
    it('Starting numerical text a and followed by -', () => {
console.log('Starting numerical text a and followed by -');
        editor.openBlank();
        editor.editorModule.insertText('a');
        editor.editorModule.insertText('-');
        documentHelper.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text a and followed by )', () => {
console.log('Starting numerical text a and followed by )');
        editor.openBlank();
        editor.editorModule.insertText('a');
        editor.editorModule.insertText(')');
        documentHelper.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text a and followed by & with not possible cases', () => {
console.log('Starting numerical text a and followed by & with not possible cases');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('&');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
    it('Starting numerical text 1 and followed by . and also paragraph is not empty', () => {
console.log('Starting numerical text 1 and followed by . and also paragraph is not empty');
        editor.openBlank();
        editor.editorModule.insertText('Adventure');
        documentHelper.selection.handleHomeKey();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });

});

describe('Auto convert list using space and tab key possible cases with  level pattern low Roman and Up Roman validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Starting numerical text i and followed by .', () => {
console.log('Starting numerical text i and followed by .');
        editor.openBlank();
        editor.editorModule.insertText('i');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text I and followed by -', () => {
console.log('Starting numerical text I and followed by -');
        editor.openBlank();
        editor.editorModule.insertText('I');
        editor.editorModule.insertText('-');
        documentHelper.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text i and followed by >', () => {
console.log('Starting numerical text i and followed by >');
        editor.openBlank();
        editor.editorModule.insertText('i');
        editor.editorModule.insertText('>');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text I and followed by )', () => {
console.log('Starting numerical text I and followed by )');
        editor.openBlank();
        editor.editorModule.insertText('I');
        editor.editorModule.insertText(')');
        documentHelper.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text I and followed by &', () => {
console.log('Starting numerical text I and followed by &');
        editor.openBlank();
        editor.editorModule.insertText('I');
        editor.editorModule.insertText('&');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
    it('Starting numerical text i and followed by . and also paragraph is not empty', () => {
console.log('Starting numerical text i and followed by . and also paragraph is not empty');
        editor.openBlank();
        editor.editorModule.insertText('Adventure');
        documentHelper.selection.handleHomeKey();
        editor.editorModule.insertText('i');
        editor.editorModule.insertText('.');
        documentHelper.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });

});

describe('Auto convert list using space and tab key with not possible cases and also text ', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Starting numerical text 2 and followed by .', () => {
console.log('Starting numerical text 2 and followed by .');
        editor.openBlank();
        editor.editorModule.insertText('2');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
    it('Starting numerical text I and followed by ,', () => {
console.log('Starting numerical text I and followed by ,');
        editor.openBlank();
        editor.editorModule.insertText('I');
        editor.editorModule.insertText(',');
        documentHelper.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        documentHelper.selection.handleTabKey(false, false);
        documentHelper.selection.handleTabKey(false, false);
        documentHelper.selection.handleTabKey(false, false);
    });
    it('Starting numerical text z and followed by >', () => {
console.log('Starting numerical text z and followed by >');
        editor.openBlank();
        editor.editorModule.insertText('z');
        editor.editorModule.insertText('>');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
    it('Starting numerical text 0 and followed by )', () => {
console.log('Starting numerical text 0 and followed by )');
        editor.openBlank();
        editor.editorModule.insertText('0');
        editor.editorModule.insertText(')');
        documentHelper.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text i and followed by . and also paragraph is not empty', () => {
console.log('Starting numerical text i and followed by . and also paragraph is not empty');
        editor.openBlank();
        editor.editorModule.insertText('Adventure');
        editor.editorModule.insertText('i');
        editor.editorModule.insertText('.');
        documentHelper.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
    it('Apply list to already list contain paragraph', () => {
console.log('Apply list to already list contain paragraph');
        editor.openBlank();
        editor.editorModule.insertText('Adventure');
        editor.editorModule.applyBulletOrNumbering('%1.', 'Arabic', 'Verdana');
        documentHelper.selection.handleHomeKey();
        editor.editorModule.insertText('i');
        editor.editorModule.insertText('.');
        documentHelper.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Apply list to already list contain paragraph', () => {
console.log('Apply list to already list contain paragraph');
        editor.openBlank();
        editor.editorModule.insertText('Adventure');
        editor.editorModule.applyBulletOrNumbering('%1.', 'Arabic', 'Verdana');
        documentHelper.selection.handleEndKey();
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editorModule.insertText('I');
        editor.editorModule.insertText('.');
        documentHelper.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Previous span is field', () => {
console.log('Previous span is field');
        editor.openBlank();
        editor.editorModule.insertText('www.google.com');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('I');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });

});

describe('Auto convert list using space key possible cases with level pattern as Leading zero', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Starting numerical text 01 and followed by .', () => {
console.log('Starting numerical text 01 and followed by .');
        editor.openBlank();
        editor.editorModule.insertText('01');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
    });
    it('Starting numerical text 01 and followed by -', () => {
console.log('Starting numerical text 01 and followed by -');
        editor.openBlank();
        editor.editorModule.insertText('01');
        editor.editorModule.insertText('-');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text 01 and followed by >', () => {
console.log('Starting numerical text 01 and followed by >');
        editor.openBlank();
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('01');
        editor.editorModule.insertText('>');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text 00 and followed by )', () => {
console.log('Starting numerical text 00 and followed by )');
        editor.openBlank();
        editor.editorModule.insertText('00');
        editor.editorModule.insertText(')');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text 01 and followed by &', () => {
console.log('Starting numerical text 01 and followed by &');
        editor.openBlank();
        editor.editorModule.insertText('01');
        editor.editorModule.insertText('&');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
    it('Starting numerical text 01 and followed by . and also paragraph is not empty', () => {
console.log('Starting numerical text 01 and followed by . and also paragraph is not empty');
        editor.openBlank();
        editor.editorModule.insertText('Adventure');
        documentHelper.selection.handleHomeKey();
        editor.editorModule.insertText('01');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });

});

let imageString: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADQSURBVFhH7ZbRDYQgDIYZ5UZhFEdxlBuFUUhY4N7vwWtTURJz5tem8GAbTYS0/eGjWsN7hJVSAuku3c2FuyF31BvqBNu90/mLmnSRjKDbMZULt2csz/kV8hRbVjSkSZkxRC0yKcbl+6FLhttSDIV5W6vYnKeZVWkR1WyFGbhIHrAbCzPhEcL1XCvqptYMd7xXExUXM4+pT3ENe53OP5yGqJ8kDDZGpIld6E730uFR/uuDs1J6OmolQDzcUeOslJ6OWgkQD3fUOCulJ6Ome4j9AGEu0k90WN54AAAAAElFTkSuQmCC';
describe('Different left indent with paragraph contains only space , tab and combination of both validation - 1', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Multiple tab followed by text 1 and followed by )', () => {
console.log('Multiple tab followed by text 1 and followed by )');
        editor.openBlank();
        editor.documentHelper.owner.editorModule.handleTextInput('\t');
        editor.documentHelper.owner.editorModule.handleTextInput('\t');
        editor.documentHelper.owner.editorModule.handleTextInput('\t');
        editor.editorModule.insertText('1');
        editor.editorModule.insertText(')');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('combination of space and tab followed by text A and followed by >', () => {
console.log('combination of space and tab followed by text A and followed by >');
        editor.openBlank();
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.documentHelper.owner.editorModule.handleTextInput('\t');
        editor.editorModule.insertText('A');
        editor.editorModule.insertText('>');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });

    it('get List Level Pattern branch validation', () => {
console.log('get List Level Pattern branch validation');
        editor.openBlank();
        let value = (editor.editorModule as any).getListLevelPattern('2.');
        expect(value).toBe('None');
    });
});
describe('Different left indent with paragraph contains only space , tab and combination of both validation - 1', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('combination of tab and space followed by text I and followed by >', () => {
console.log('combination of tab and space followed by text I and followed by >');
        editor.openBlank();
        editor.documentHelper.owner.editorModule.handleTextInput('\t');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('I');
        editor.editorModule.insertText('>');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('combination of text, tab and space followed by text I and followed by >', () => {
console.log('combination of text, tab and space followed by text I and followed by >');
        editor.openBlank();
        editor.editorModule.insertText('sample');
        editor.documentHelper.owner.editorModule.handleTextInput('\t');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('I');
        editor.editorModule.insertText('>');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
    it('span is image validation', () => {
console.log('span is image validation');
        editor.openBlank();
        editor.editor.insertImage(imageString, 100, 100);
        documentHelper.selection.handleRightKey();
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
    it('span is image validation and previous span is image', () => {
console.log('span is image validation and previous span is image');
        editor.openBlank();
        editor.editor.insertImage(imageString, 100, 100);
        documentHelper.selection.handleRightKey();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
});



// describe('Numbering apply validation in different scenario', () => {
//     let editor: DocumentEditor;
//     let documentHelper: DocumentHelper;
//     beforeAll((): void => {
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.appendChild(ele);
//         DocumentEditor.Inject(Editor, Selection, EditorHistory);
//         editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
//         editor.acceptTab = true;
//         (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.appendTo('#container');
//         documentHelper = editor.documentHelper;
//     });
//     afterAll((done): void => {
//         documentHelper.destroy();
//         documentHelper = undefined;
//         editor.destroy();
//         document.body.removeChild(document.getElementById('container'));
//         editor = undefined;
//         setTimeout(function () {
//             document.body.innerHTML = '';
//             done();
//         }, 1000);
//     });
//     it('Numbering list with previous Paragrph contains list and next paragraph is table and next paragraph is empty', () => {
// console.log('Numbering list with previous Paragrph contains list and next paragraph is table and next paragraph is empty');
//         editor.openBlank();
//         editor.editorModule.insertText('1');
//         editor.editorModule.insertText('.');
//         editor.editorModule.insertText(' ');
//         editor.editorModule.insertText('Adventure');
//         let listId = editor.selection.paragraphFormat.listId;
//         editor.editorModule.onEnter();
//         editor.editorModule.onEnter();
//         editor.editor.insertTable(2, 2);
//         editor.selection.moveDown();
//         editor.selection.moveDown();
//         editor.editor.applyNumbering('%1.', 'Arabic');
//         expect(editor.selection.paragraphFormat.listId).not.toBe(listId);
//     });
//     it('Numbering list with previous Paragrph contains list and next paragraph is table and next paragraph is not empty', () => {
// console.log('Numbering list with previous Paragrph contains list and next paragraph is table and next paragraph is not empty');
//         editor.openBlank();
//         editor.editorModule.insertText('1');
//         editor.editorModule.insertText('.');
//         editor.editorModule.insertText(' ');
//         editor.editorModule.insertText('Adventure');
//         let listId = editor.selection.paragraphFormat.listId;
//         editor.editorModule.onEnter();
//         editor.editorModule.onEnter();
//         editor.editorModule.insertText('Adventure');
//         editor.editorModule.onEnter();
//         editor.editor.applyNumbering('%1.', 'Arabic');
//         expect(editor.selection.paragraphFormat.listId).not.toBe(listId);
//     });
//     it('Numbering list with previous Paragrph contains list and next paragraph is table and next paragraph is not empty', () => {
// console.log('Numbering list with previous Paragrph contains list and next paragraph is table and next paragraph is not empty');
//         editor.openBlank();
//         editor.editorModule.insertText('1');
//         editor.editorModule.insertText('.');
//         editor.editorModule.insertText(' ');
//         editor.editorModule.insertText('Adventure');
//         let listId = editor.selection.paragraphFormat.listId;
//         editor.editorModule.onEnter();
//         editor.editorModule.onEnter();
//         editor.editor.applyNumbering('%1.', 'UpLetter');
//         expect(editor.selection.paragraphFormat.listId).not.toBe(listId);
//     });
//     it('Numbering list with previous Paragrph contains list and next paragraph is table and next paragraph is not empty', () => {
// console.log('Numbering list with previous Paragrph contains list and next paragraph is table and next paragraph is not empty');
//         editor.openBlank();
//         editor.editorModule.insertText('1');
//         editor.editorModule.insertText('.');
//         editor.editorModule.insertText(' ');
//         editor.editorModule.insertText('Adventure');
//         let listId = editor.selection.paragraphFormat.listId;
//         editor.editorModule.onEnter();
//         editor.editorModule.onEnter();
//         editor.editorModule.onEnter();
//         editor.editorModule.onEnter();
//         editor.editorModule.onEnter();
//         editor.editor.applyNumbering('%1.', 'UpLetter');
//         expect(editor.selection.paragraphFormat.listId).not.toBe(listId);
//     });


// });

describe('Bullet list Apply validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
//     it('Bullet List validation', () => {
// console.log('Bullet List validation');
//         editor.openBlank();
//         editor.editorModule.insertText('1');
//         editor.editorModule.insertText('.');
//         editor.editorModule.insertText(' ');
//         editor.editorModule.insertText('Adventure');
//         let listId = editor.selection.paragraphFormat.listId;
//         editor.editorModule.onEnter();
//         editor.editorModule.onEnter();
//         editor.editor.applyBullet('\uf0b7', 'Symbol');
//         expect(editor.selection.paragraphFormat.listId).not.toBe(listId);
//         editor.editor.applyBullet('\uf0b7', 'Windings');

//     });
    it('Bullet List validation with back ward selection', () => {
console.log('Bullet List validation with back ward selection');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Adventure');
        let listId = editor.selection.paragraphFormat.listId;
        editor.selection.extendToLineStart();
        editor.editor.applyBullet('\uf0b7', 'Symbol');
        expect(editor.selection.paragraphFormat.listId).not.toBe(listId);

    });
//     it('Applying same list validation', () => {
// console.log('Applying same list validation');
//         editor.openBlank();
//         editor.editor.applyNumbering('%1.', 'Arabic');
//         expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
//         editor.editor.applyNumbering('%1.', 'Arabic');
//     });
    describe('Asterisk and hyphen Apply validation', () => {
        let editor: DocumentEditor;
        let documentHelper: DocumentHelper;
        beforeAll((): void => {
            let ele: HTMLElement = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            DocumentEditor.Inject(Editor, Selection, EditorHistory);
            editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
            editor.acceptTab = true;
            (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
            (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
            (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
            (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
            editor.appendTo('#container');
            documentHelper = editor.documentHelper;
        });
        afterAll((done): void => {
            documentHelper.destroy();
            documentHelper = undefined;
            editor.destroy();
            document.body.removeChild(document.getElementById('container'));
            editor = undefined;
            setTimeout(function () {
                document.body.innerHTML = '';
                done();
            }, 1000);
        });
        it('Asterisk List validation', (done) => {
console.log('Asterisk List validation');
            editor.openBlank();
            editor.editorModule.insertText('*');
            editor.editorModule.insertText(' ');
            setTimeout(function () {
                expect(editor.selection.paragraphFormat.listId).toBe(0);
                done();
            }, 200);            
        });
        it('Hyphen list validation', (done) => {
console.log('Hyphen list validation');
            editor.openBlank();
            editor.editorModule.insertText('-');
            editor.editorModule.insertText(' ');
            setTimeout(function () {
                expect(editor.selection.paragraphFormat.listId).toBe(1);
                done();
            }, 200); 
            
        });
    });
});

describe('Table relayouting validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Table with 30 column editing', () => {
console.log('Table with 30 column editing');
        editor.editorModule.insertTable(2, 30);
        for (let i: number = 0; i < 20; i++) {
            editor.editorModule.insertText('efefefefef');
        }
        expect(editor.documentHelper.pages.length).toBeGreaterThan(1);
    });
    it('undo changes', () => {
console.log('undo changes');
        for (let i: number = 0; i < 20; i++) {
            editor.editorHistory.undo();
        }
        expect(editor.documentHelper.pages.length).toBe(1);
    });
    it('redo changes', () => {
console.log('redo changes');
        for (let i: number = 0; i < 20; i++) {
            editor.editorHistory.redo();
        }
        expect(editor.documentHelper.pages.length).toBeGreaterThan(1);
    });
});

describe("Press enter key", () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 500);
    });
    it("Inside nested table", () => {
        editor.editor.insertTable(2, 2);
        editor.editor.onEnter();
        editor.editor.insertTable(2, 2);
        editor.selection.moveUp();
        editor.selection.characterFormat.fontSize = 96;
        for (let i = 0; i < 7; i++) {
            editor.editor.onEnter();
        }
        editor.selection.moveDown();
        expect(function () { editor.editor.onEnter() }).not.toThrowError();

    });
});
let text: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false,"endnoteNumberFormat":"LowerCaseRoman","footNoteNumberFormat":"Arabic","restartIndexForFootnotes":"DoNotRestart","restartIndexForEndnotes":"DoNotRestart","initialFootNoteNumber":1,"initialEndNoteNumber":1,"pageNumberStyle":"Arabic"},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bidi":false},"inlines":[{"characterFormat":{"bidi":false},"text":"aaa"},{"footnoteType":"Footnote","characterFormat":{"baselineAlignment":"Superscript"},"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"baselineAlignment":"Superscript"},"text":"1"},{"characterFormat":{},"text":" "},{"characterFormat":{"bidi":false},"text":"aa"}]}]}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"baselineAlignment":"Superscript"},"inlines":[{"characterFormat":{"bidi":false},"text":"bbb"},{"footnoteType":"Footnote","characterFormat":{"baselineAlignment":"Superscript"},"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"baselineAlignment":"Superscript"},"text":"2"},{"characterFormat":{},"text":" "},{"characterFormat":{"bidi":false},"text":"bb"}]}]}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"baselineAlignment":"Superscript"},"inlines":[{"characterFormat":{},"text":"\f"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"cc"},{"footnoteType":"Footnote","characterFormat":{"baselineAlignment":"Superscript"},"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"baselineAlignment":"Superscript"},"text":"3"},{"characterFormat":{},"text":" "},{"characterFormat":{"bidi":false},"text":"cc"}]}]},{"characterFormat":{"bidi":false},"text":"c"}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenHeader":{},"evenFooter":{},"firstPageHeader":{},"firstPageFooter":{}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"fontColor":"#00000000"},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"fontColor":"#00000000"},"text":"\u0004"}]}]}};
describe('Check the footnote position after editing that', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container' }));
        DocumentEditor.Inject(Editor, Selection, WordExport, SfdtExport, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableWordExport: true, enableEditor: true, isReadOnly: false, enableSelection: true, enableSfdtExport: true, enableComment: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Check the footnote position after editing that', () => {
        editor.openBlank();
        editor.open(text);
        editor.editor.onEnter();
        expect(editor.documentHelper.pages[0].footnoteWidget.bodyWidgets.length).toBe(2);
    });
});