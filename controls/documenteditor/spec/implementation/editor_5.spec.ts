import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, FieldElementBox } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import {
    LineWidget, ParagraphWidget, TextElementBox, TableWidget, TableRowWidget, TableCellWidget
} from '../../src/index';
/**
 * Editor 
 */
function tableWithPara(editor: DocumentEditor) {
    editor.editorModule.insertTable(5, 5);
    editor.editorModule.insertText('the', false);
    editor.selection.handleDownKey();
    editor.editorModule.insertText('quick', false);
    editor.selection.handleDownKey();
    editor.editorModule.insertText('brown', false);
    editor.selection.handleDownKey();
    editor.editorModule.insertText('fox', false);
    editor.selection.handleDownKey();
    editor.editorModule.insertText('jumps', false);
    editor.selection.handleDownKey();
    editor.editorModule.insertText('over', false);
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('the', false);
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('lazy', false);
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('dog', false);
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('the', false);
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('quick', false);
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('brown', false);
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('fox', false);
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('jumps', false);
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('over', false);
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('the', false);
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('lazy', false);
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('dog', false);
}
describe('Insert table validation', () => {
    let editor: DocumentEditor = undefined;
    beforeEach(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterEach((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('insert table with paragraph testing', () => {
        tableWithPara(editor);
        let lastParaLength = editor.viewer.pages[0].bodyWidgets[0].childWidgets.length - 1;
        expect((((editor.viewer.pages[0].bodyWidgets[0].childWidgets[lastParaLength] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('dog');
    });
    it('insert table with paragraph multiple times undo operation', () => {
        tableWithPara(editor);
        let count: number = 1;
        while (count <= 30) {
            editor.editorHistory.undo();
            count++;
        }
        expect((((((editor.viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(0);
    });
    it('insert table with paragraph multiple times redo operation', () => {
        tableWithPara(editor);
        let count: number = 1;
        while (count <= 30) {
            editor.editorHistory.undo();
            count++;
        }
        count = 1;
        while (count <= 30) {
            editor.editorHistory.redo();
            count++;
        }
        expect((((((editor.viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(1);
    });
    it('paragraph,table, paragraph combinations with undo, redo validation', () => {
        editor.editorModule.insertText('The quick brown fox jumps over the lazy dog', false);
        editor.editorModule.insertText('The quick brown fox jumps over the lazy dog', false);
        tableWithPara(editor);
        let count: number = 1;
        while (count <= 30) {
            editor.editorHistory.undo();
            count++;
        }
        count = 1;
        while (count <= 30) {
            editor.editorHistory.redo();
            count++;
        }
        editor.editorHistory.undo();
        expect((((editor.viewer.pages[0].bodyWidgets[0].childWidgets[13] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('lazy');
    });
    it('paragraph, image, table, paragraph combinations with undo, redo validation', () => {
        let imageString: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADQSURBVFhH7ZbRDYQgDIYZ5UZhFEdxlBuFUUhY4N7vwWtTURJz5tem8GAbTYS0/eGjWsN7hJVSAuku3c2FuyF31BvqBNu90/mLmnSRjKDbMZULt2csz/kV8hRbVjSkSZkxRC0yKcbl+6FLhttSDIV5W6vYnKeZVWkR1WyFGbhIHrAbCzPhEcL1XCvqptYMd7xXExUXM4+pT3ENe53OP5yGqJ8kDDZGpIld6E730uFR/uuDs1J6OmolQDzcUeOslJ6OWgkQD3fUOCulJ6Ome4j9AGEu0k90WN54AAAAAElFTkSuQmCC';
        editor.editorModule.insertText('The quick brown fox jumps over the lazy dog', false);
        editor.editorModule.insertText('The quick brown fox jumps over the lazy dog', false);
        editor.editor.insertImage(imageString, 100, 100);
        tableWithPara(editor);
        let count: number = 1;
        while (count <= 30) {
            editor.editorHistory.undo();
            count++;
        }
        count = 1;
        while (count <= 30) {
            editor.editorHistory.redo();
            count++;
        }
        editor.editorHistory.undo();
        expect((((editor.viewer.pages[0].bodyWidgets[0].childWidgets[13] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('lazy');
    });
});
describe('Insert table with header validation', () => {
    let editor: DocumentEditor = undefined;
    beforeEach(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterEach((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('insert table with paragraph on header validation', () => {
        let event: any = { offsetX: 573, offsetY: 56 };
        editor.viewer.onDoubleTap(event);
        tableWithPara(editor);
        let lastParaIndex: number = editor.viewer.pages[0].headerWidget.childWidgets.length - 1;
        expect((((editor.viewer.pages[0].headerWidget.childWidgets[lastParaIndex] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('dog');
    });
    it('insert table with paragraph on header multiple times undo operation validation', () => {
        let event: any = { offsetX: 573, offsetY: 56 };
        editor.viewer.onDoubleTap(event);
        tableWithPara(editor);
        let count: number = 1;
        while (count <= 30) {
            editor.editorHistory.undo();
            count++;
        }
        expect((((((editor.viewer.pages[0].headerWidget.childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(0);
    });
    it('insert table with paragraph on header multiple times redo operation validation', () => {
        let event: any = { offsetX: 573, offsetY: 56 };
        editor.viewer.onDoubleTap(event);
        tableWithPara(editor);
        let count: number = 1;
        while (count <= 30) {
            editor.editorHistory.undo();
            count++;
        }
        count = 1;
        while (count <= 30) {
            editor.editorHistory.redo();
            count++;
        }
        expect((((((editor.viewer.pages[0].headerWidget.childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(1);
    });
    it('paragraph,table, paragraph combinations on header with undo, redo validation', () => {
        let event: any = { offsetX: 573, offsetY: 56 };
        editor.viewer.onDoubleTap(event);
        editor.editorModule.insertText('The quick brown fox jumps over the lazy dog', false);
        editor.editorModule.insertText('The quick brown fox jumps over the lazy dog', false);
        tableWithPara(editor);
        let count: number = 1;
        while (count <= 30) {
            editor.editorHistory.undo();
            count++;
        }
        count = 1;
        while (count <= 30) {
            editor.editorHistory.redo();
            count++;
        }
        editor.editorHistory.undo();
        expect((((editor.viewer.pages[0].headerWidget.childWidgets[13] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('lazy');
    });
    it('paragraph, image, table, paragraph combinations on header with undo, redo validation', () => {
        let imageString: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADQSURBVFhH7ZbRDYQgDIYZ5UZhFEdxlBuFUUhY4N7vwWtTURJz5tem8GAbTYS0/eGjWsN7hJVSAuku3c2FuyF31BvqBNu90/mLmnSRjKDbMZULt2csz/kV8hRbVjSkSZkxRC0yKcbl+6FLhttSDIV5W6vYnKeZVWkR1WyFGbhIHrAbCzPhEcL1XCvqptYMd7xXExUXM4+pT3ENe53OP5yGqJ8kDDZGpIld6E730uFR/uuDs1J6OmolQDzcUeOslJ6OWgkQD3fUOCulJ6Ome4j9AGEu0k90WN54AAAAAElFTkSuQmCC';
        let event: any = { offsetX: 573, offsetY: 56 };
        editor.viewer.onDoubleTap(event);
        editor.editorModule.insertText('The quick brown fox jumps over the lazy dog', false);
        editor.editorModule.insertText('The quick brown fox jumps over the lazy dog', false);
        editor.editor.insertImage(imageString, 100, 100);
        tableWithPara(editor);
        let count: number = 1;
        while (count <= 30) {
            editor.editorHistory.undo();
            count++;
        }
        count = 1;
        while (count <= 30) {
            editor.editorHistory.redo();
            count++;
        }
        editor.editorHistory.undo();
        expect((((editor.viewer.pages[0].headerWidget.childWidgets[13] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('lazy');
    });
});
describe('Insert table with footer validation', () => {
    let editor: DocumentEditor = undefined;
    beforeEach(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterEach((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('insert table with paragraph on footer validation', () => {
        editor.viewer.viewerContainer.scrollTop = 850;
        let event: any = { offsetX: 506, offsetY: 980 };
        editor.viewer.onDoubleTap(event);
        tableWithPara(editor);
        let lastParaIndex: number = editor.viewer.pages[0].footerWidget.childWidgets.length - 1;
        expect((((editor.viewer.pages[0].footerWidget.childWidgets[lastParaIndex] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('dog');
    });
    it('insert table with paragraph on footer multiple times undo operation validation', () => {
        editor.viewer.viewerContainer.scrollTop = 850;
        let event: any = { offsetX: 506, offsetY: 980 };
        editor.viewer.onDoubleTap(event);
        tableWithPara(editor);
        let count: number = 1;
        while (count <= 30) {
            editor.editorHistory.undo();
            count++;
        }
        expect((((((editor.viewer.pages[0].footerWidget.childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(0);
    });
    it('insert table with paragraph on footer multiple times redo operation validation', () => {
        editor.viewer.viewerContainer.scrollTop = 850;
        let event: any = { offsetX: 506, offsetY: 980 };
        editor.viewer.onDoubleTap(event);
        tableWithPara(editor);
        let count: number = 1;
        while (count <= 30) {
            editor.editorHistory.undo();
            count++;
        }
        count = 1;
        while (count <= 30) {
            editor.editorHistory.redo();
            count++;
        }
        expect((((((editor.viewer.pages[0].footerWidget.childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(1);
    });
    it('paragraph,table, paragraph combinations on footer with undo, redo validation', () => {
        editor.viewer.viewerContainer.scrollTop = 850;
        let event: any = { offsetX: 506, offsetY: 980 };
        editor.viewer.onDoubleTap(event);
        editor.editorModule.insertText('The quick brown fox jumps over the lazy dog', false);
        editor.editorModule.insertText('The quick brown fox jumps over the lazy dog', false);
        tableWithPara(editor);
        let count: number = 1;
        while (count <= 30) {
            editor.editorHistory.undo();
            count++;
        }
        count = 1;
        while (count <= 30) {
            editor.editorHistory.redo();
            count++;
        }
        editor.editorHistory.undo();
        expect((((editor.viewer.pages[0].footerWidget.childWidgets[13] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('lazy');
    });
    // it('paragraph, image, table, paragraph combinations on footer with undo, redo validation',()=>{
    //     let imageString: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADQSURBVFhH7ZbRDYQgDIYZ5UZhFEdxlBuFUUhY4N7vwWtTURJz5tem8GAbTYS0/eGjWsN7hJVSAuku3c2FuyF31BvqBNu90/mLmnSRjKDbMZULt2csz/kV8hRbVjSkSZkxRC0yKcbl+6FLhttSDIV5W6vYnKeZVWkR1WyFGbhIHrAbCzPhEcL1XCvqptYMd7xXExUXM4+pT3ENe53OP5yGqJ8kDDZGpIld6E730uFR/uuDs1J6OmolQDzcUeOslJ6OWgkQD3fUOCulJ6Ome4j9AGEu0k90WN54AAAAAElFTkSuQmCC';
    //     editor.viewer.viewerContainer.scrollTop = 850;
    //     let event: any = { offsetX: 506, offsetY: 980 };
    //     editor.viewer.onDoubleTap(event);
    //     editor.editorModule.insertText('The quick brown fox jumps over the lazy dog', false);
    //     editor.editorModule.insertText('The quick brown fox jumps over the lazy dog', false);
    //     editor.selectionModule.insertImage(imageString, 100, 100);
    //     tableWithPara(editor);
    //     let count: number = 1;
    //     while (count <= 30) {
    //         editor.editorHistory.undo();
    //         count++;
    //     }
    //     count = 1;
    //     while (count <= 30) {
    //         editor.editorHistory.redo();
    //         count++;
    //     }
    //     editor.editorHistory.undo();
    //     expect((((editor.viewer.pages[0].footerWidget.childWidgets[13] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('lazy');
    // });
});
describe('Insert left validation-', () => {
    let editor: DocumentEditor = undefined;
    beforeEach(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterEach((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Insert left validation', () => {
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        editor.editor.insertColumn(true);
        expect(((editor.viewer.pages[0].bodyWidgets[0].childWidgets[14] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(6);
    });
    it('insert left with undo validation', () => {
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        editor.editor.insertColumn(true);
        let count: number = 1;
        while (count <= 15) {
            editor.editorHistory.undo();
            count++;
        }
        expect((((editor.viewer.pages[0].bodyWidgets[0].childWidgets[6] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('quick');
    });
    it('insert left redo validation', () => {
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        let insertLeftCount: number = 1;
        while (insertLeftCount <= 3) {
            editor.editor.insertColumn(true);
            insertLeftCount++;
        }
        let count: number = 1;
        while (count <= 15) {
            editor.editorHistory.undo();
            count++;
        }
        count = 1;
        while (count <= 15) {
            editor.editorHistory.redo();
            count++;
        }
        expect(((editor.viewer.pages[0].bodyWidgets[0].childWidgets[14] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(8);
    });
});
describe('Insert right validation-', () => {
    let editor: DocumentEditor = undefined;
    beforeEach(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterEach((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Insert right validation', () => {
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        editor.editor.insertColumn(false);
        expect(((editor.viewer.pages[0].bodyWidgets[0].childWidgets[14] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(6);
    });
    it('insert right with undo validation', () => {
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        editor.editor.insertColumn(false);
        let count: number = 1;
        while (count <= 15) {
            editor.editorHistory.undo();
            count++;
        }
        expect((((editor.viewer.pages[0].bodyWidgets[0].childWidgets[6] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('quick');
    });
    it('insert right redo validation', () => {
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        let insertRightCount: number = 1;
        while (insertRightCount <= 3) {
            editor.editor.insertColumn(false);
            insertRightCount++;
        }
        let count: number = 1;
        while (count <= 15) {
            editor.editorHistory.undo();
            count++;
        }
        count = 1;
        while (count <= 15) {
            editor.editorHistory.redo();
            count++;
        }
        expect(((editor.viewer.pages[0].bodyWidgets[0].childWidgets[14] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(8);
    });
});
describe('Insert above validation-', () => {
    let editor: DocumentEditor = undefined;
    beforeEach(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterEach((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Insert above validation', () => {
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        editor.editor.insertRow(true);
        expect((editor.viewer.pages[0].bodyWidgets[0].childWidgets[14] as TableWidget).childWidgets.length).toBe(6);
    });
    it('insert above with undo validation', () => {
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        editor.editor.insertRow(true);
        let count: number = 1;
        while (count <= 15) {
            editor.editorHistory.undo();
            count++;
        }
        expect((((editor.viewer.pages[0].bodyWidgets[0].childWidgets[6] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('quick');
    });
    it('insert above redo validation', () => {
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        let insertAboveCount: number = 1;
        while (insertAboveCount <= 3) {
            editor.editor.insertRow(true);
            insertAboveCount++;
        }
        let count: number = 1;
        while (count <= 15) {
            editor.editorHistory.undo();
            count++;
        }
        count = 1;
        while (count <= 15) {
            editor.editorHistory.redo();
            count++;
        }
        expect((editor.viewer.pages[0].bodyWidgets[0].childWidgets[14] as TableWidget).childWidgets.length).toBe(8);
    });
});
describe('Insert below validation-', () => {
    let editor: DocumentEditor = undefined;
    beforeEach(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterEach((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Insert below validation', () => {
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        editor.editor.insertRow(false);
        expect((editor.viewer.pages[0].bodyWidgets[0].childWidgets[14] as TableWidget).childWidgets.length).toBe(6);
    });
    it('insert below with undo validation', () => {
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        editor.editor.insertRow(false);
        let count: number = 1;
        while (count <= 15) {
            editor.editorHistory.undo();
            count++;
        }
        expect((((editor.viewer.pages[0].bodyWidgets[0].childWidgets[6] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('quick');
    });
    it('insert below redo validation', () => {
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        let insertAboveCount: number = 1;
        while (insertAboveCount <= 3) {
            editor.editor.insertRow(false);
            insertAboveCount++;
        }
        let count: number = 1;
        while (count <= 15) {
            editor.editorHistory.undo();
            count++;
        }
        count = 1;
        while (count <= 15) {
            editor.editorHistory.redo();
            count++;
        }
        expect((editor.viewer.pages[0].bodyWidgets[0].childWidgets[14] as TableWidget).childWidgets.length).toBe(8);
    });
    // it('insert above, below, left and right combination testing', () => {
    //     editor.editorModule.insertTable(5, 5);
    //     let count: number = 1;
    //     while (count <= 2) {
    //         editor.editor.insertColumn(true);
    //         editor.editor.insertColumn(false);
    //         editor.editor.insertRow(true);
    //         editor.editor.insertRow(false);
    //         count++;
    //     }
    //     expect('').toBe('');
    // });
    // it('insert above, below, left and right with undo, redo combination testing', () => {
    //     editor.editorModule.insertTable(5, 5);
    //     let count: number = 1;
    //     while (count <= 2) {
    //         editor.editor.insertColumn(true);
    //         editor.editor.insertColumn(false);
    //         editor.editor.insertRow(true);
    //         editor.editor.insertRow(false);
    //         count++;
    //     }
    //     count = 1;
    //     while (count <= 5) {
    //         editor.editorHistory.undo();
    //         count++;
    //     }
    //     count = 1;
    //     while (count <= 5) {
    //         editor.editorHistory.redo();
    //         count++;
    //     }
    //     expect('').toBe('');
    // });
});
describe('Delete row, column, table validation-', () => {
    let editor: DocumentEditor = undefined;
    beforeEach(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterEach((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('delete row tesing', () => {
        editor.editorModule.insertTable(5, 5);
        let rowCount: number = (editor.viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets.length;
        editor.editor.deleteRow();
        expect((editor.viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets.length).not.toBe(rowCount);
    });
    it('delete row with undo, redo testing', () => {
        editor.editorModule.insertTable(5, 5);
        let rowCount: number = (editor.viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets.length;
        editor.editor.deleteRow();
        let count: number = 1;
        while (count <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            count++;
        }
        editor.editorHistory.undo();
        expect((editor.viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets.length).toBe(rowCount);
    });
    it('delete column testing', () => {
        editor.editorModule.insertTable(5, 5);
        let columnCount: number = ((editor.viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length;
        editor.editor.deleteColumn();
        let count: number = 1;
        while (count <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            count++;
        }
        editor.editorHistory.undo();
        expect(((editor.viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(columnCount);
    });
    it('delete table testing', () => {
        editor.editorModule.insertTable(5, 5);
        let tableCount: number = editor.viewer.pages[0].bodyWidgets[0].childWidgets.length;
        editor.editor.deleteTable();
        expect(editor.viewer.pages[0].bodyWidgets[0].childWidgets.length).not.toBe(tableCount);
    });
    it('delete table with undo, redo testing', () => {
        editor.editorModule.insertTable(5, 5);
        let tableCount: number = editor.viewer.pages[0].bodyWidgets[0].childWidgets.length;
        editor.editor.deleteTable();
        let count: number = 1;
        while (count <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            count++;
        }
        editor.editorHistory.undo();
        expect(editor.viewer.pages[0].bodyWidgets[0].childWidgets.length).toBe(tableCount);
    });
});
describe('Insert Field API Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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

    it('insert field validation with field code', () => {
        editor.editor.insertField('MERGEFIELD  MyField  \\* MERGEFORMAT', '«MyField»');
        let fieldCode = editor.selection.getFieldCode((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children[0] as FieldElementBox)
        expect(fieldCode).toBe('MERGEFIELD  MyField  \\* MERGEFORMAT');
    });

    it('insert field validation without field code', () => {
        editor.openBlank();
        editor.editor.insertField('MERGEFIELD  MyField  \\* MERGEFORMAT');
        let fieldCode = editor.selection.getFieldCode((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children[0] as FieldElementBox)
        expect(fieldCode).toBe('MERGEFIELD  MyField  \\* MERGEFORMAT');
        editor.selection.selectAll();
        expect(editor.selection.text).not.toBe('');
    });

    it('undo validation after merge field', () => {
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(true);
    });

    it('redo validation after merge field', () => {
        editor.editorHistory.redo();
        let fieldCode = editor.selection.getFieldCode((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children[0] as FieldElementBox)
        expect(fieldCode).toBe('MERGEFIELD  MyField  \\* MERGEFORMAT');
    });
    it(' after Multiple undo and redo after merge field', () => {
        let count: number = 1;
        while (count <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            count++;
        }
        let fieldCode = editor.selection.getFieldCode((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children[0] as FieldElementBox)
        expect(fieldCode).toBe('MERGEFIELD  MyField  \\* MERGEFORMAT');
    });

    it('insert field validation with multiple space in start of field code', () => {
        editor.openBlank();
        editor.editor.insertField('                            MERGEFIELD MyField  \\* MERGEFORMAT');
        editor.selection.selectAll();
        expect(editor.selection.text).not.toBe('');
    });
});
describe('Insert Table Validation with selectedd content replace', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
    it('Insert Table in selected content', () => {
        editor.editor.insertText('sample', false);
        editor.selection.selectAll();
        editor.editorModule.insertTable(2, 2);
        expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
    });
    it('undo after insert Table', () => {
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(false);
    });
    it('redo after undo insert table column testing', () => {
        editor.editorHistory.redo();
        editor.selection.moveUp();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
    });
    it(' after Multiple undo and redo insert table column testing', () => {
        let count: number = 1;
        while (count <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            count++;
        }
        editor.selection.moveUp();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
    });
    it('undo after Multiple undo and redo insert table column testing', () => {
        let count: number = 1;
        while (count <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            count++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(false);
    });
});
describe('Insert table Multiple time', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Insert table one after validation', () => {
        editor.editorModule.insertTable(2, 2);
        editor.selection.moveDown();
        editor.selection.moveDown();
        editor.editorModule.insertTable(2, 2);
        expect(editor.selection.start.paragraph.associatedCell.ownerTable.childWidgets.length).toBe(4);
        expect(editor.selection.start.paragraph.bodyWidget.childWidgets.length).toBe(2);
    });
});
describe('Insert table Multiple time', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Insert table one after validation', () => {
        editor.editorModule.insertTable(2, 2);
        editor.selection.moveDown();
        editor.selection.moveDown();
        editor.editorModule.onEnter();
        editor.editorModule.insertTable(2, 2);
        editor.selection.moveUp();
        editor.selection.moveUp();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.editorModule.onBackSpace();
        expect(editor.selection.start.paragraph.bodyWidget.childWidgets.length).toBe(3);
    });
    it('Undo redo multiple time', () => {
        for (let i: number = 0; i < 15; i++) {
            editor.editorHistory.undo();
            expect(editor.selection.start.paragraph.bodyWidget.childWidgets.length).toBe(4);
            editor.editorHistory.redo();
            expect(editor.selection.start.paragraph.bodyWidget.childWidgets.length).toBe(3);
        }
    });
});