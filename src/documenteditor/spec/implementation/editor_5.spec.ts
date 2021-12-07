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
    editor.editorModule.insertText('the');
    editor.selection.handleDownKey();
    editor.editorModule.insertText('quick');
    editor.selection.handleDownKey();
    editor.editorModule.insertText('brown');
    editor.selection.handleDownKey();
    editor.editorModule.insertText('fox');
    editor.selection.handleDownKey();
    editor.editorModule.insertText('jumps');
    editor.selection.handleDownKey();
    editor.editorModule.insertText('over');
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('the');
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('lazy');
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('dog');
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('the');
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('quick');
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('brown');
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('fox');
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('jumps');
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('over');
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('the');
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('lazy');
    editor.editorModule.handleEnterKey();
    editor.editorModule.insertText('dog');
}
describe('Insert table validation', () => {
    let editor: DocumentEditor = undefined;
    beforeEach(() => {
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
    afterEach((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('insert table with paragraph testing', () => {
console.log('insert table with paragraph testing');
        tableWithPara(editor);
        let lastParaLength = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length - 1;
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[lastParaLength] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('dog');
    });
//     it('insert table with paragraph multiple times undo operation', () => {
// console.log('insert table with paragraph multiple times undo operation');
//         tableWithPara(editor);
//         let count: number = 1;
//         while (count <= 30) {
//             editor.editorHistory.undo();
//             count++;
//         }
//         expect((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(0);
//     });
    it('insert table with paragraph multiple times redo operation', () => {
console.log('insert table with paragraph multiple times redo operation');
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
        expect((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(1);
    });
    it('paragraph,table, paragraph combinations with undo, redo validation', () => {
console.log('paragraph,table, paragraph combinations with undo, redo validation');
        editor.editorModule.insertText('The quick brown fox jumps over the lazy dog');
        editor.editorModule.insertText('The quick brown fox jumps over the lazy dog');
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
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[13] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('lazy');
    });
});
describe('Insert table validation1', () => {
    let editor: DocumentEditor = undefined;
    beforeEach(() => {
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
    afterEach((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('paragraph, image, table, paragraph combinations with undo, redo validation', () => {
console.log('paragraph, image, table, paragraph combinations with undo, redo validation');
        let imageString: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADQSURBVFhH7ZbRDYQgDIYZ5UZhFEdxlBuFUUhY4N7vwWtTURJz5tem8GAbTYS0/eGjWsN7hJVSAuku3c2FuyF31BvqBNu90/mLmnSRjKDbMZULt2csz/kV8hRbVjSkSZkxRC0yKcbl+6FLhttSDIV5W6vYnKeZVWkR1WyFGbhIHrAbCzPhEcL1XCvqptYMd7xXExUXM4+pT3ENe53OP5yGqJ8kDDZGpIld6E730uFR/uuDs1J6OmolQDzcUeOslJ6OWgkQD3fUOCulJ6Ome4j9AGEu0k90WN54AAAAAElFTkSuQmCC';
        editor.editorModule.insertText('The quick brown fox jumps over the lazy dog');
        editor.editorModule.insertText('The quick brown fox jumps over the lazy dog');
        //editor.editor.insertImage(imageString, 10, 10);
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
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[13] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('lazy');
    });
});
describe('Insert table with header validation', () => {
    let editor: DocumentEditor = undefined;
    beforeEach(() => {
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
    afterEach((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('insert table with paragraph on header validation', () => {
console.log('insert table with paragraph on header validation');
        let event: any = { offsetX: 573, offsetY: 56 };
        editor.documentHelper.onDoubleTap(event);
        tableWithPara(editor);
        let lastParaIndex: number = editor.documentHelper.pages[0].headerWidget.childWidgets.length - 1;
        expect((((editor.documentHelper.pages[0].headerWidget.childWidgets[lastParaIndex] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('dog');
    });
//     it('insert table with paragraph on header multiple times undo operation validation', () => {
// console.log('insert table with paragraph on header multiple times undo operation validation');
//         let event: any = { offsetX: 573, offsetY: 56 };
//         editor.documentHelper.onDoubleTap(event);
//         tableWithPara(editor);
//         let count: number = 1;
//         while (count <= 30) {
//             editor.editorHistory.undo();
//             count++;
//         }
//         expect((((((editor.documentHelper.pages[0].headerWidget.childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(0);
//     });

    //Commented below test script cause for disconnecting 

    // it('insert table with paragraph on header multiple times redo operation validation', () => {
    //     let event: any = { offsetX: 573, offsetY: 56 };
    //     editor.documentHelper.onDoubleTap(event);
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
    //     expect((((((editor.documentHelper.pages[0].headerWidget.childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(1);
    // });
    // it('paragraph,table, paragraph combinations on header with undo, redo validation', () => {
    //     let event: any = { offsetX: 573, offsetY: 56 };
    //     editor.documentHelper.onDoubleTap(event);
    //     editor.editorModule.insertText('The quick brown fox jumps over the lazy dog');
    //     editor.editorModule.insertText('The quick brown fox jumps over the lazy dog');
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
    //     expect((((editor.documentHelper.pages[0].headerWidget.childWidgets[13] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('lazy');
    // });
    // it('paragraph, image, table, paragraph combinations on header with undo, redo validation', () => {
    //     let imageString: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADQSURBVFhH7ZbRDYQgDIYZ5UZhFEdxlBuFUUhY4N7vwWtTURJz5tem8GAbTYS0/eGjWsN7hJVSAuku3c2FuyF31BvqBNu90/mLmnSRjKDbMZULt2csz/kV8hRbVjSkSZkxRC0yKcbl+6FLhttSDIV5W6vYnKeZVWkR1WyFGbhIHrAbCzPhEcL1XCvqptYMd7xXExUXM4+pT3ENe53OP5yGqJ8kDDZGpIld6E730uFR/uuDs1J6OmolQDzcUeOslJ6OWgkQD3fUOCulJ6Ome4j9AGEu0k90WN54AAAAAElFTkSuQmCC';
    //     let event: any = { offsetX: 573, offsetY: 56 };
    //     editor.documentHelper.onDoubleTap(event);
    //     editor.editorModule.insertText('The quick brown fox jumps over the lazy dog');
    //     editor.editorModule.insertText('The quick brown fox jumps over the lazy dog');
    //     editor.editor.insertImage(imageString, 100, 100);
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
    //     expect((((editor.documentHelper.pages[0].headerWidget.childWidgets[13] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('lazy');
    // });
});
describe('Insert table with footer validation', () => {
    let editor: DocumentEditor = undefined;
    beforeEach(() => {
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
    afterEach((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('insert table with paragraph on footer validation', () => {
console.log('insert table with paragraph on footer validation');
        editor.documentHelper.viewerContainer.scrollTop = 850;
        let event: any = { offsetX: 506, offsetY: 980 };
        editor.documentHelper.onDoubleTap(event);
        tableWithPara(editor);
        let lastParaIndex: number = editor.documentHelper.pages[0].footerWidget.childWidgets.length - 1;
        expect((((editor.documentHelper.pages[0].footerWidget.childWidgets[lastParaIndex] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('dog');
    });
//     it('insert table with paragraph on footer multiple times undo operation validation', () => {
// console.log('insert table with paragraph on footer multiple times undo operation validation');
//         editor.documentHelper.viewerContainer.scrollTop = 850;
//         let event: any = { offsetX: 506, offsetY: 980 };
//         editor.documentHelper.onDoubleTap(event);
//         tableWithPara(editor);
//         let count: number = 1;
//         while (count <= 30) {
//             editor.editorHistory.undo();
//             count++;
//         }
//         expect((((((editor.documentHelper.pages[0].footerWidget.childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(0);
//     });
    it('insert table with paragraph on footer multiple times redo operation validation', () => {
console.log('insert table with paragraph on footer multiple times redo operation validation');
        editor.documentHelper.viewerContainer.scrollTop = 850;
        let event: any = { offsetX: 506, offsetY: 980 };
        editor.documentHelper.onDoubleTap(event);
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
        expect((((((editor.documentHelper.pages[0].footerWidget.childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(1);
    });
    it('paragraph,table, paragraph combinations on footer with undo, redo validation', () => {
console.log('paragraph,table, paragraph combinations on footer with undo, redo validation');
        editor.documentHelper.viewerContainer.scrollTop = 850;
        let event: any = { offsetX: 506, offsetY: 980 };
        editor.documentHelper.onDoubleTap(event);
        editor.editorModule.insertText('The quick brown fox jumps over the lazy dog');
        editor.editorModule.insertText('The quick brown fox jumps over the lazy dog');
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
        expect((((editor.documentHelper.pages[0].footerWidget.childWidgets[13] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('lazy');
    });
    // it('paragraph, image, table, paragraph combinations on footer with undo, redo validation',()=>{
    //     let imageString: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADQSURBVFhH7ZbRDYQgDIYZ5UZhFEdxlBuFUUhY4N7vwWtTURJz5tem8GAbTYS0/eGjWsN7hJVSAuku3c2FuyF31BvqBNu90/mLmnSRjKDbMZULt2csz/kV8hRbVjSkSZkxRC0yKcbl+6FLhttSDIV5W6vYnKeZVWkR1WyFGbhIHrAbCzPhEcL1XCvqptYMd7xXExUXM4+pT3ENe53OP5yGqJ8kDDZGpIld6E730uFR/uuDs1J6OmolQDzcUeOslJ6OWgkQD3fUOCulJ6Ome4j9AGEu0k90WN54AAAAAElFTkSuQmCC';
    //     editor.documentHelper.viewerContainer.scrollTop = 850;
    //     let event: any = { offsetX: 506, offsetY: 980 };
    //     editor.documentHelper.onDoubleTap(event);
    //     editor.editorModule.insertText('The quick brown fox jumps over the lazy dog');
    //     editor.editorModule.insertText('The quick brown fox jumps over the lazy dog');
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
    //     expect((((editor.documentHelper.pages[0].footerWidget.childWidgets[13] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('lazy');
    // });
});
describe('Insert left validation-', () => {
    let editor: DocumentEditor = undefined;
    beforeEach(() => {
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
    afterEach((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Insert left validation', () => {
console.log('Insert left validation');
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        editor.editor.insertColumn(true);
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[14] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(6);
    });
    it('insert left with undo validation', () => {
console.log('insert left with undo validation');
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        editor.editor.insertColumn(true);
        let count: number = 1;
        while (count <= 15) {
            editor.editorHistory.undo();
            count++;
        }
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[6] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('quick');
    });
    it('insert left redo validation', () => {
console.log('insert left redo validation');
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
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[14] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(8);
    });
});
describe('Insert right validation-', () => {
    let editor: DocumentEditor = undefined;
    beforeEach(() => {
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
    afterEach((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Insert right validation', () => {
console.log('Insert right validation');
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        editor.editor.insertColumn(false);
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[14] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(6);
    });
    it('insert right with undo validation', () => {
console.log('insert right with undo validation');
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        editor.editor.insertColumn(false);
        let count: number = 1;
        while (count <= 15) {
            editor.editorHistory.undo();
            count++;
        }
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[6] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('quick');
    });
    it('insert right redo validation', () => {
console.log('insert right redo validation');
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
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[14] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(8);
    });
});
describe('Insert above validation-', () => {
    let editor: DocumentEditor = undefined;
    beforeEach(() => {
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
    afterEach((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Insert above validation', () => {
console.log('Insert above validation');
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        editor.editor.insertRow(true);
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[14] as TableWidget).childWidgets.length).toBe(6);
    });
    it('insert above with undo validation', () => {
console.log('insert above with undo validation');
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        editor.editor.insertRow(true);
        let count: number = 1;
        while (count <= 15) {
            editor.editorHistory.undo();
            count++;
        }
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[6] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('quick');
    });
    it('insert above redo validation', () => {
console.log('insert above redo validation');
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
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[14] as TableWidget).childWidgets.length).toBe(8);
    });
});
describe('Insert below validation-', () => {
    let editor: DocumentEditor = undefined;
    beforeEach(() => {
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
    afterEach((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Insert below validation', () => {
console.log('Insert below validation');
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        editor.editor.insertRow(false);
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[14] as TableWidget).childWidgets.length).toBe(6);
    });
    it('insert below with undo validation', () => {
console.log('insert below with undo validation');
        tableWithPara(editor);
        editor.editorModule.insertTable(5, 5);
        editor.editor.insertRow(false);
        let count: number = 1;
        while (count <= 15) {
            editor.editorHistory.undo();
            count++;
        }
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[6] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('quick');
    });
    it('insert below redo validation', () => {
console.log('insert below redo validation');
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
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[14] as TableWidget).childWidgets.length).toBe(8);
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
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
console.log('delete row tesing');
        editor.editorModule.insertTable(5, 5);
        let rowCount: number = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets.length;
        editor.editor.deleteRow();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets.length).not.toBe(rowCount);
    });
    it('delete row with undo, redo testing', () => {
console.log('delete row with undo, redo testing');
        editor.editorModule.insertTable(5, 5);
        let rowCount: number = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets.length;
        editor.editor.deleteRow();
        let count: number = 1;
        while (count <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            count++;
        }
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets.length).toBe(rowCount);
    });
    it('delete column testing', () => {
console.log('delete column testing');
        editor.editorModule.insertTable(5, 5);
        let columnCount: number = ((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length;
        editor.editor.deleteColumn();
        let count: number = 1;
        while (count <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            count++;
        }
        editor.editorHistory.undo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(columnCount);
    });
    it('delete table testing', () => {
console.log('delete table testing');
        editor.editorModule.insertTable(5, 5);
        let tableCount: number = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length;
        editor.editor.deleteTable();
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).not.toBe(tableCount);
    });
    it('delete table with undo, redo testing', () => {
console.log('delete table with undo, redo testing');
        editor.editorModule.insertTable(5, 5);
        let tableCount: number = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length;
        editor.editor.deleteTable();
        let count: number = 1;
        while (count <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            count++;
        }
        editor.editorHistory.undo();
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(tableCount);
    });
});
describe('Insert Field API Validation', () => {
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
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

    it('insert field validation with field code', () => {
console.log('insert field validation with field code');
        editor.editor.insertField('MERGEFIELD  MyField  \\* MERGEFORMAT', '«MyField»');
        let fieldCode = editor.selection.getFieldCode((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children[0] as FieldElementBox)
        expect(fieldCode).toBe('MERGEFIELD  MyField  \\* MERGEFORMAT');
    });

    it('insert field validation without field code', () => {
console.log('insert field validation without field code');
        editor.openBlank();
        editor.editor.insertField('MERGEFIELD  MyField  \\* MERGEFORMAT');
        let fieldCode = editor.selection.getFieldCode((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children[0] as FieldElementBox)
        expect(fieldCode).toBe('MERGEFIELD  MyField  \\* MERGEFORMAT');
        editor.selection.selectAll();
        expect(editor.selection.text).not.toBe('');
    });

    it('undo validation after merge field', () => {
console.log('undo validation after merge field');
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(true);
    });

    it('redo validation after merge field', () => {
console.log('redo validation after merge field');
        editor.editorHistory.redo();
        let fieldCode = editor.selection.getFieldCode((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children[0] as FieldElementBox)
        expect(fieldCode).toBe('MERGEFIELD  MyField  \\* MERGEFORMAT');
    });
    it(' after Multiple undo and redo after merge field', () => {
console.log(' after Multiple undo and redo after merge field');
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
console.log('insert field validation with multiple space in start of field code');
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
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Insert Table in selected content', () => {
console.log('Insert Table in selected content');
        editor.editor.insertText('sample');
        editor.selection.selectAll();
        editor.editorModule.insertTable(2, 2);
        expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
    });
    it('undo after insert Table', () => {
console.log('undo after insert Table');
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(false);
    });
    it('redo after undo insert table column testing', () => {
console.log('redo after undo insert table column testing');
        editor.editorHistory.redo();
        editor.selection.moveUp();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
    });
    it(' after Multiple undo and redo insert table column testing', () => {
console.log(' after Multiple undo and redo insert table column testing');
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
console.log('undo after Multiple undo and redo insert table column testing');
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
        setTimeout(() => {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Insert table one after validation', () => {
console.log('Insert table one after validation');
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
        setTimeout(() => {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Insert table one after validation', () => {
console.log('Insert table one after validation');
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
console.log('Undo redo multiple time');
        for (let i: number = 0; i < 15; i++) {
            editor.editorHistory.undo();
            expect(editor.selection.start.paragraph.bodyWidget.childWidgets.length).toBe(4);
            editor.editorHistory.redo();
            expect(editor.selection.start.paragraph.bodyWidget.childWidgets.length).toBe(3);
        }
    });
});

describe('Insert Field Format Validation', () => {
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
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

    it('insert field validation with current selection format', () => {
console.log('insert field validation with current selection format');
        editor.selection.characterFormat.bold = true;
        editor.editor.insertText('Hello');
        editor.editor.insertField('MERGEFIELD ' + 'World' + ' \\* MERGEFORMAT');
        let childWidgets: any = editor.selection.start.paragraph.childWidgets[0];
        expect(childWidgets.children[4].characterFormat.bold).toBe(true);
    });
});
