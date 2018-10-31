import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { LayoutViewer, PageLayoutViewer } from '../../src/index';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';

/**
 * Auto Convert List Test script
 */

describe('Auto convert list using space key possible cases and level pattern arabic validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Starting numerical text 1 and followed by .', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(36);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(36);
    });
    it('Starting numerical text 1 and followed by -', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('-', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(36);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(36);
    });
    it('Starting numerical text 1 and followed by >', () => {
        editor.openBlank();
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('>', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text 1 and followed by )', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText(')', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text 1 and followed by &', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('&', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
    it('Starting numerical text 1 and followed by . and also paragraph is not empty', () => {
        editor.openBlank();
        editor.editorModule.insertText('Adventure', false);
        viewer.selection.handleHomeKey();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
});

describe('Auto convert list using tab key possible cases with  level pattern low letter and up letter validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Starting numerical text a and followed by .', () => {
        editor.openBlank();
        editor.editorModule.insertText('a', false);
        editor.editorModule.insertText('.', false);
        viewer.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(36);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(36);
    });
    it('Starting numerical text a and followed by -', () => {
        editor.openBlank();
        editor.editorModule.insertText('a', false);
        editor.editorModule.insertText('-', false);
        viewer.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text a and followed by )', () => {
        editor.openBlank();
        editor.editorModule.insertText('a', false);
        editor.editorModule.insertText(')', false);
        viewer.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text a and followed by & with not possible cases', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('&', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
    it('Starting numerical text 1 and followed by . and also paragraph is not empty', () => {
        editor.openBlank();
        editor.editorModule.insertText('Adventure', false);
        viewer.selection.handleHomeKey();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });

});

describe('Auto convert list using space and tab key possible cases with  level pattern low Roman and Up Roman validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Starting numerical text i and followed by .', () => {
        editor.openBlank();
        editor.editorModule.insertText('i', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text I and followed by -', () => {
        editor.openBlank();
        editor.editorModule.insertText('I', false);
        editor.editorModule.insertText('-', false);
        viewer.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text i and followed by >', () => {
        editor.openBlank();
        editor.editorModule.insertText('i', false);
        editor.editorModule.insertText('>', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text I and followed by )', () => {
        editor.openBlank();
        editor.editorModule.insertText('I', false);
        editor.editorModule.insertText(')', false);
        viewer.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text I and followed by &', () => {
        editor.openBlank();
        editor.editorModule.insertText('I', false);
        editor.editorModule.insertText('&', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
    it('Starting numerical text i and followed by . and also paragraph is not empty', () => {
        editor.openBlank();
        editor.editorModule.insertText('Adventure', false);
        viewer.selection.handleHomeKey();
        editor.editorModule.insertText('i', false);
        editor.editorModule.insertText('.', false);
        viewer.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });

});

describe('Auto convert list using space and tab key with not possible cases and also text ', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Starting numerical text 2 and followed by .', () => {
        editor.openBlank();
        editor.editorModule.insertText('2', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
    it('Starting numerical text I and followed by ,', () => {
        editor.openBlank();
        editor.editorModule.insertText('I', false);
        editor.editorModule.insertText(',', false);
        viewer.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        viewer.selection.handleTabKey(false, false);
        viewer.selection.handleTabKey(false, false);
        viewer.selection.handleTabKey(false, false);
    });
    it('Starting numerical text z and followed by >', () => {
        editor.openBlank();
        editor.editorModule.insertText('z', false);
        editor.editorModule.insertText('>', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
    it('Starting numerical text 0 and followed by )', () => {
        editor.openBlank();
        editor.editorModule.insertText('0', false);
        editor.editorModule.insertText(')', false);
        viewer.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text i and followed by . and also paragraph is not empty', () => {
        editor.openBlank();
        editor.editorModule.insertText('Adventure', false);
        editor.editorModule.insertText('i', false);
        editor.editorModule.insertText('.', false);
        viewer.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
    it('Apply list to already list contain paragraph', () => {
        editor.openBlank();
        editor.editorModule.insertText('Adventure', false);
        editor.editorModule.applyBulletOrNumbering('%1.', 'Arabic', 'Verdana');
        viewer.selection.handleHomeKey();
        editor.editorModule.insertText('i', false);
        editor.editorModule.insertText('.', false);
        viewer.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Apply list to already list contain paragraph', () => {
        editor.openBlank();
        editor.editorModule.insertText('Adventure', false);
        editor.editorModule.applyBulletOrNumbering('%1.', 'Arabic', 'Verdana');
        viewer.selection.handleEndKey();
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editorModule.insertText('I', false);
        editor.editorModule.insertText('.', false);
        viewer.selection.handleTabKey(false, false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Previous span is field', () => {
        editor.openBlank();
        editor.editorModule.insertText('www.google.com', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('I', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });

});

describe('Auto convert list using space key possible cases with level pattern as Leading zero', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Starting numerical text 01 and followed by .', () => {
        editor.openBlank();
        editor.editorModule.insertText('01', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
    });
    it('Starting numerical text 01 and followed by -', () => {
        editor.openBlank();
        editor.editorModule.insertText('01', false);
        editor.editorModule.insertText('-', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text 01 and followed by >', () => {
        editor.openBlank();
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('01', false);
        editor.editorModule.insertText('>', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text 00 and followed by )', () => {
        editor.openBlank();
        editor.editorModule.insertText('00', false);
        editor.editorModule.insertText(')', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('Starting numerical text 01 and followed by &', () => {
        editor.openBlank();
        editor.editorModule.insertText('01', false);
        editor.editorModule.insertText('&', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
    it('Starting numerical text 01 and followed by . and also paragraph is not empty', () => {
        editor.openBlank();
        editor.editorModule.insertText('Adventure', false);
        viewer.selection.handleHomeKey();
        editor.editorModule.insertText('01', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
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
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Multiple tab followed by text 1 and followed by )', () => {
        editor.openBlank();
        viewer.owner.editorModule.handleTextInput('\t');
        viewer.owner.editorModule.handleTextInput('\t');
        viewer.owner.editorModule.handleTextInput('\t');
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText(')', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('combination of space and tab followed by text A and followed by >', () => {
        editor.openBlank();
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        viewer.owner.editorModule.handleTextInput('\t');
        editor.editorModule.insertText('A', false);
        editor.editorModule.insertText('>', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });

    it('get List Level Pattern branch validation', () => {
        editor.openBlank();
        let value = (editor.editorModule as any).getListLevelPattern('2.');
        expect(value).toBe('None');
    });
});
describe('Different left indent with paragraph contains only space , tab and combination of both validation - 1', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('combination of tab and space followed by text I and followed by >', () => {
        editor.openBlank();
        viewer.owner.editorModule.handleTextInput('\t');
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('I', false);
        editor.editorModule.insertText('>', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('combination of text, tab and space followed by text I and followed by >', () => {
        editor.openBlank();
        editor.editorModule.insertText('sample', false);
        viewer.owner.editorModule.handleTextInput('\t');
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('I', false);
        editor.editorModule.insertText('>', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
    it('span is image validation', () => {
        editor.openBlank();
        editor.editor.insertImage(imageString, 100, 100);
        viewer.selection.handleRightKey();
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
    it('span is image validation and previous span is image', () => {
        editor.openBlank();
        editor.editor.insertImage(imageString, 100, 100);
        viewer.selection.handleRightKey();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
});


//Apply Bullet or Numbering public API Validation
describe('Multi Level List apply validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Multilevel number brace validation', () => {
        editor.openBlank();
        editor.editor.applyNumbering('numbering');
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
    });
    it('MultiLevel Number dot validation', () => {
        editor.openBlank();
        editor.editor.applyNumbering('multiLevel');
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('MultiLevel Bullet List validation', () => {
        editor.openBlank();
        editor.editor.applyNumbering('bullet');
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('MultiLevel None validation', () => {
        editor.openBlank();
        editor.selection.paragraphFormat.setList(undefined);
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
});
describe('Numbering apply validation in different scenario', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Numbering list with previous Paragrph contains list and next paragraph is table and next paragraph is empty', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Adventure', false);
        let listId = editor.selection.paragraphFormat.listId;
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editor.insertTable(2, 2);
        editor.selection.moveDown();
        editor.selection.moveDown();
        editor.editor.applyNumbering('%1.', 'Arabic');
        expect(editor.selection.paragraphFormat.listId).not.toBe(listId);
    });
    it('Numbering list with previous Paragrph contains list and next paragraph is table and next paragraph is not empty', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Adventure', false);
        let listId = editor.selection.paragraphFormat.listId;
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Adventure', false);
        editor.editorModule.onEnter();
        editor.editor.applyNumbering('%1.', 'Arabic');
        expect(editor.selection.paragraphFormat.listId).not.toBe(listId);
    });
    it('Numbering list with previous Paragrph contains list and next paragraph is table and next paragraph is not empty', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Adventure', false);
        let listId = editor.selection.paragraphFormat.listId;
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editor.applyNumbering('%1.', 'UpLetter');
        expect(editor.selection.paragraphFormat.listId).not.toBe(listId);
    });
    it('Numbering list with previous Paragrph contains list and next paragraph is table and next paragraph is not empty', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Adventure', false);
        let listId = editor.selection.paragraphFormat.listId;
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editor.applyNumbering('%1.', 'UpLetter');
        expect(editor.selection.paragraphFormat.listId).not.toBe(listId);
    });


});

describe('Bullet list Apply validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Bullet List validation', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Adventure', false);
        let listId = editor.selection.paragraphFormat.listId;
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editor.applyBullet('\uf0b7', 'Symbol');
        expect(editor.selection.paragraphFormat.listId).not.toBe(listId);
        editor.editor.applyBullet('\uf0b7', 'Windings');

    });
    it('Bullet List validation with back ward selection', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Adventure', false);
        let listId = editor.selection.paragraphFormat.listId;
        editor.selection.extendToLineStart();
        editor.editor.applyBullet('\uf0b7', 'Symbol');
        expect(editor.selection.paragraphFormat.listId).not.toBe(listId);

    });
    it('Applying same list validation', () => {
        editor.openBlank();
        editor.editor.applyNumbering('%1.', 'Arabic');
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
        editor.editor.applyNumbering('%1.', 'Arabic');
    });
    describe('Asterisk and hyphen Apply validation', () => {
        let editor: DocumentEditor;
        let viewer: LayoutViewer;
        beforeAll((): void => {
            let ele: HTMLElement = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            DocumentEditor.Inject(Editor, Selection, EditorHistory);
            editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
            editor.acceptTab = true;
            (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
            (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
            (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
            (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
            editor.appendTo('#container');
            viewer = editor.viewer as PageLayoutViewer;
        });
        afterAll((done): void => {
            viewer.destroy();
            viewer = undefined;
            editor.destroy();
            document.body.removeChild(document.getElementById('container'));
            editor = undefined;
            setTimeout(function () {
                done();
            }, 1000);
        });
        it('Asterisk List validation', () => {
            editor.openBlank();
            editor.editorModule.insertText('*', false);
            editor.editorModule.insertText(' ', false);
            expect(editor.selection.paragraphFormat.listId).toBe(0);
        });
        it('Hyphen list validation', () => {
            editor.openBlank();
            editor.editorModule.insertText('-', false);
            editor.editorModule.insertText(' ', false);
            expect(editor.selection.paragraphFormat.listId).toBe(1);
        });
    });
});

describe('Table relayouting validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Table with 30 column editing', () => {
        editor.editorModule.insertTable(2, 30);
        for (let i: number = 0; i < 20; i++) {
            editor.editorModule.insertText('efefefefef', false);
        }
        expect(editor.viewer.pages.length).toBeGreaterThan(1);
    });
    it('undo changes', () => {
        for (let i: number = 0; i < 20; i++) {
            editor.editorHistory.undo();
        }
        expect(editor.viewer.pages.length).toBe(1);
    });
    it('redo changes', () => {
        for (let i: number = 0; i < 20; i++) {
            editor.editorHistory.redo();
        }
        expect(editor.viewer.pages.length).toBeGreaterThan(1);
    });
});