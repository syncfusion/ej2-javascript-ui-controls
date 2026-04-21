import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer, DocumentHelper } from '../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { FontDialog } from '../../../src/document-editor/implementation/dialogs/font-dialog';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { ContextMenu } from '../../../src/document-editor/implementation/context-menu';

import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { WCharacterFormat } from '../../../src/document-editor/implementation/format/character-format';
import { BookmarkDialog } from '../../../src/document-editor/implementation/dialogs/bookmark-dialog';
import { ParagraphWidget, LineWidget, BookmarkElementBox } from '../../../src/index';
import { LineInfo } from '../../../src/document-editor/implementation/editor/editor-helper';


describe('BookMark add validation', () => {
    let editor: DocumentEditor;
    let documentHelper:DocumentHelper;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog, ContextMenu, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, enableBookmarkDialog: true, isReadOnly: false, enableContextMenu: true, enableFontDialog: true });
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
        }, 2000);
    });
    it('Add Bookmark validation', () => {
console.log('Add Bookmark validation');
        editor.editorModule.insertTextInternal('Sample',true);
        editor.selection.selectAll();
        editor.bookmarkDialogModule.show();
        (editor.bookmarkDialogModule as any).addBookmark();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(3);
    });
    it('undo validation in Bookmark', () => {
console.log('undo validation in Bookmark');
        editor.editorHistory.undo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(1);
    });
    it('redo validation in bookmark', () => {
console.log('redo validation in bookmark');
        editor.editorHistory.redo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(3);
    });
    //it('undo and redo validation', () => {
    //    let i: number = 1;
    //    while (i <= 5) {
    //        editor.editorHistory.undo();
    //        editor.editorHistory.redo();
    //        i++;
    //    }
     //   expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(3);
    //});

});


describe('Goto and Delete BookMark validation', () => {
    let editor: DocumentEditor;
    let documentHelper:DocumentHelper;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog, ContextMenu, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, enableBookmarkDialog: true, isReadOnly: false, enableContextMenu: true, enableFontDialog: true });
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
        }, 2000);
    });
    it('GoTo validation Bookmark validation', () => {
console.log('GoTo validation Bookmark validation');
        editor.editorModule.insertTextInternal('Sample',true);
        editor.selection.selectAll();
        editor.bookmarkDialogModule.show();
        (editor.bookmarkDialogModule as any).textBoxInput.value = 'first';
        (editor.bookmarkDialogModule as any).addBookmark();
        editor.bookmarkDialogModule.show();
        let args: any = { text: 'first' };
        (editor.bookmarkDialogModule as any).selectHandler(args);
        (editor.bookmarkDialogModule as any).gotoBookmark();
        expect(editor.selection.start.offset).toBe(0);
        // expect(editor.selection.end.offset).toBe(8);
    });
    it('Delete Bookmark', () => {
console.log('Delete Bookmark');
        (editor.bookmarkDialogModule as any).deleteBookmark();
        expect(editor.documentHelper.bookmarks.keys.length).toBe(0);
        (editor.bookmarkDialogModule as any).removeObjects();
    });
    it('undo validation', () => {
console.log('undo validation');
        editor.editorHistory.undo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(3);
    });
    it('redo validation', () => {
console.log('redo validation');
        editor.editorHistory.redo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(1);
    });
    it('undo and redo validation', () => {
console.log('undo and redo validation');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(1);
    });
});



describe('Edit validation in Bookmark', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog, EditorHistory);
        editor = new DocumentEditor({ enableSelection: true, enableEditor: true, isReadOnly: false, enableBookmarkDialog: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Book Mark insert validation', () => {
console.log('Book Mark insert validation');
        editor.editorModule.insertText('Sample Work');
        editor.selection.selectAll();
        editor.bookmarkDialogModule.show();
        (editor.bookmarkDialogModule as any).addBookmark();
        editor.selection.handleHomeKey();
        editor.editorModule.insertText('s');
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] instanceof BookmarkElementBox).toBe(true);
    });
   it('Backspace in bookmark validation', () => {
console.log('Backspace in bookmark validation');
        editor.openBlank();
        editor.editorModule.insertText('Back');
        editor.selection.selectAll();
        editor.bookmarkDialogModule.show();
        (editor.bookmarkDialogModule as any).addBookmark();
        editor.selection.handleEndKey();
        editor.editorModule.onBackSpace();
        editor.editorModule.onBackSpace();
        editor.editorModule.onBackSpace();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] instanceof BookmarkElementBox).toBe(true);
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2] instanceof BookmarkElementBox).toBe(true);
    });
    it('Backspace in bookmark validation', () => {
console.log('Backspace in bookmark validation');
        editor.editorModule.onBackSpace();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(true);
    });
    // it('undo validation', () => {
    //     editor.editorHistory.undo();
    // });
    // it('redo validation', () => {
    //     editor.editorHistory.redo();
    // });
    // it('undo and redo validation', () => {
    //     let i: number = 1;
    //     while (i <= 5) {
    //         editor.editorHistory.undo();
    //         editor.editorHistory.redo();
    //         i++;
    //     }
    // });
});




describe('DeleteSelected content on backspace ', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog, EditorHistory);
        editor = new DocumentEditor({ enableSelection: true, enableEditor: true, isReadOnly: false, enableBookmarkDialog: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Book Mark insert validation', () => {
console.log('Book Mark insert validation');
        editor.editorModule.insertText('Sample Work');
        editor.selection.selectAll();
        editor.bookmarkDialogModule.show();
        (editor.bookmarkDialogModule as any).addBookmark();
        editor.selection.handleHomeKey();
        editor.editorModule.insertText('sample 1');
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] instanceof BookmarkElementBox).toBe(true);
    });
//     it('Backspace at bookmark start validation', () => {
// console.log('Backspace at bookmark start validation');
//         editor.selection.handleLeftKey();
//         editor.selection.handleLeftKey();
//         editor.selection.handleShiftRightKey();
//         editor.selection.handleShiftRightKey();
//         editor.selection.handleShiftRightKey();
//         editor.selection.handleShiftRightKey();
//         editor.editorModule.onBackSpace();
//         expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as BookmarkElementBox).bookmarkType).toBe(0);
//     });
//     it('undo validation', () => {
// console.log('undo validation');
//         editor.editorHistory.undo();
//         expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(6);
//         expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2] as BookmarkElementBox).bookmarkType).toBe(0);
//     });
//     it('redo validation', () => {
// console.log('redo validation');
//         editor.editorHistory.redo();
//         expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(4);
//         expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as BookmarkElementBox).bookmarkType).toBe(0);
//     });
//     it('undo and redo validation', () => {
// console.log('undo and redo validation');
//         let i: number = 1;
//         while (i <= 5) {
//             editor.editorHistory.undo();
//             editor.editorHistory.redo();
//             i++;
//         }
//         expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(4);
//         expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as BookmarkElementBox).bookmarkType).toBe(0);
//     });

//     it('undo and redo validation', () => {
// console.log('undo and redo validation');
//         let i: number = 1;
//         while (i <= 5) {
//             editor.editorHistory.undo();
//             editor.editorHistory.redo();
//             i++;
//         }
//         editor.editorHistory.undo();
//         expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(6);
//         expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2] as BookmarkElementBox).bookmarkType).toBe(0);
//     });
});
describe('DeleteSelected content on backspace at bookmar end', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog, EditorHistory);
        editor = new DocumentEditor({ enableSelection: true, enableEditor: true, isReadOnly: false, enableBookmarkDialog: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Book Mark insert validation', () => {
console.log('Book Mark insert validation');
        editor.editorModule.insertText('Sample Work');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('sample');
        editor.selection.handleControlLeftKey();
        editor.selection.handleRightKey();
        editor.selection.handleShiftHomeKey();
        editor.bookmarkDialogModule.show();
        (editor.bookmarkDialogModule as any).addBookmark();
        expect(editor.documentHelper.bookmarks.keys.length).toBe(1);
    });
    it('Backspace at bookmark start validation', () => {
console.log('Backspace at bookmark start validation');
        editor.selection.handleRightKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.editorModule.onBackSpace();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2] as BookmarkElementBox).bookmarkType).toBe(1);
    });
    it('undo validation', () => {
console.log('undo validation');
        editor.editorHistory.undo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(5);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[3] as BookmarkElementBox).bookmarkType).toBe(1);
    });
    it('redo validation', () => {
console.log('redo validation');
        editor.editorHistory.redo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(4);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2] as BookmarkElementBox).bookmarkType).toBe(1);
    });
    it('undo and redo validation', () => {
console.log('undo and redo validation');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(4);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2] as BookmarkElementBox).bookmarkType).toBe(1);
    });
    it('undo and redo validation', () => {
console.log('undo and redo validation');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(5);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[3] as BookmarkElementBox).bookmarkType).toBe(1);
    });
});





describe('DeleteSelected content on delete at bookmark start', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog, EditorHistory);
        editor = new DocumentEditor({ enableSelection: true, enableEditor: true, isReadOnly: false, enableBookmarkDialog: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Book Mark insert validation', () => {
console.log('Book Mark insert validation');
        editor.editorModule.insertText('Sample Work');
        editor.selection.selectAll();
        editor.bookmarkDialogModule.show();
        (editor.bookmarkDialogModule as any).addBookmark();
        editor.selection.handleHomeKey();
        editor.editorModule.insertText('sample 1');
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] instanceof BookmarkElementBox).toBe(true);
    });
//     it('Backspace at bookmark start validation', () => {
// console.log('Backspace at bookmark start validation');
//         editor.selection.handleLeftKey();
//         editor.selection.handleLeftKey();
//         editor.selection.handleShiftRightKey();
//         editor.selection.handleShiftRightKey();
//         editor.selection.handleShiftRightKey();
//         editor.selection.handleShiftRightKey();
//         editor.editorModule.delete();
//         expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as BookmarkElementBox).bookmarkType).toBe(0);
//     });
//     it('undo validation', () => {
// console.log('undo validation');
//         editor.editorHistory.undo();
//         expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(6);
//         expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2] as BookmarkElementBox).bookmarkType).toBe(0);
//     });
//     it('redo validation', () => {
// console.log('redo validation');
//         editor.editorHistory.redo();
//         expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(4);
//         expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as BookmarkElementBox).bookmarkType).toBe(0);
//     });
//     it('undo and redo validation', () => {
// console.log('undo and redo validation');
//         let i: number = 1;
//         while (i <= 5) {
//             editor.editorHistory.undo();
//             editor.editorHistory.redo();
//             i++;
//         }
//         expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(4);
//         expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as BookmarkElementBox).bookmarkType).toBe(0);
//     });
//     it('undo and redo validation', () => {
// console.log('undo and redo validation');
//         let i: number = 1;
//         while (i <= 5) {
//             editor.editorHistory.undo();
//             editor.editorHistory.redo();
//             i++;
//         }
//         editor.editorHistory.undo();
//         expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(6);
//         expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2] as BookmarkElementBox).bookmarkType).toBe(0);
//     });
});
describe('DeleteSelected content on onDelete at bookmar end', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog, EditorHistory);
        editor = new DocumentEditor({ enableSelection: true, enableEditor: true, isReadOnly: false, enableBookmarkDialog: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Book Mark insert validation', () => {
console.log('Book Mark insert validation');
        editor.editorModule.insertText('Sample Work');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('sample');
        editor.selection.handleControlLeftKey();
        editor.selection.handleRightKey();
        editor.selection.handleShiftHomeKey();
        editor.bookmarkDialogModule.show();
        (editor.bookmarkDialogModule as any).addBookmark();
        expect(editor.documentHelper.bookmarks.keys.length).toBe(1);
    });
    it('Backspace at bookmark start validation', () => {
console.log('Backspace at bookmark start validation');
        editor.selection.handleRightKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.editorModule.delete();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2] as BookmarkElementBox).bookmarkType).toBe(1);
    });
    it('undo validation', () => {
console.log('undo validation');
        editor.editorHistory.undo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(5);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[3] as BookmarkElementBox).bookmarkType).toBe(1);
    });
    it('redo validation', () => {
console.log('redo validation');
        editor.editorHistory.redo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(4);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2] as BookmarkElementBox).bookmarkType).toBe(1);
    });
    it('undo and redo validation', () => {
console.log('undo and redo validation');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(4);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2] as BookmarkElementBox).bookmarkType).toBe(1);
    });
    it('undo and redo validation', () => {
console.log('undo and redo validation');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(5);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[3] as BookmarkElementBox).bookmarkType).toBe(1);
    });
});

