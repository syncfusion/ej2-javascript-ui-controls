import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { DocumentHelper, Editor, EditorHistory, SfdtExport, WordExport, CommentCharacterElementBox, TextElementBox } from '../../src/index';
import { Selection } from '../../src/index';
import { TestHelper } from '../test-helper.spec';

describe('Comment insert, undo, redo multiple iteration', () => {
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
    beforeEach((): void => {
        editor.openBlank();
        editor.editorModule.insertText("The quick brown fox jumps over a lazy dog. The quick brown fox jumps over a lazy dog. The quick brown fox jumps over a lazy dog. The quick brown fox jumps over a lazy dog.");
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
    it('Insert comment at paragraph end', () => {
        editor.selection.moveToDocumentEnd();
        editor.editor.insertComment("Hello world");
        let currentLine = editor.selection.start.currentWidget;
        let lastElement = currentLine.children[currentLine.children.length - 1];
        expect((lastElement instanceof CommentCharacterElementBox) && ((lastElement as CommentCharacterElementBox).comment.commentStart === currentLine.children[currentLine.children.length - 3])).toBe(true);

        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(currentLine.children.length).toBe(2);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });

    it('Insert comment at paragraph selecting mutiple line', () => {
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");
        let currentLine = editor.selection.start.currentWidget;
        expect((currentLine.children[0] as TextElementBox).text).toBe('The quick brown fox ');
        expect((currentLine.children.length)).toBe(3);
        expect((currentLine.children[2] as TextElementBox).text).toBe('jumps over a lazy dog. The quick brown fox jumps over a lazy dog. The quick brown ');

        currentLine = editor.selection.end.currentWidget;

        expect((currentLine.children[0] as TextElementBox).text).toBe('fox jumps over a laz');
        expect((currentLine.children.length)).toBe(3);
        expect((currentLine.children[2] as TextElementBox).text).toBe('y dog. The quick brown fox jumps over a lazy dog.');

        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        //expect(currentLine.children.length).toBe(2);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });

    it('Insert comment at paragraph selecting mutiple paragraph', () => {
        editor.editorModule.onEnter();
        editor.editorModule.insertText("The quick brown fox jumps over a lazy dog. The quick brown fox jumps over a lazy dog. The quick brown fox jumps over a lazy dog. The quick brown fox jumps over a lazy dog.");
        editor.selection.select('0;0;20', '0;1;122');
        editor.editor.insertComment("Hello world");
        let currentLine = editor.selection.start.currentWidget;
        expect((currentLine.children[0] as TextElementBox).text).toBe('The quick brown fox ');
        expect((currentLine.children.length)).toBe(3);
        expect((currentLine.children[2] as TextElementBox).text).toBe('jumps over a lazy dog. The quick brown fox jumps over a lazy dog. The quick brown ');

        currentLine = editor.selection.end.currentWidget;

        expect((currentLine.children[0] as TextElementBox).text).toBe('fox jumps over a laz');
        expect((currentLine.children.length)).toBe(3);
        expect((currentLine.children[2] as TextElementBox).text).toBe('y dog. The quick brown fox jumps over a lazy dog.');

        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        //expect(currentLine.children.length).toBe(2);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Resolve comment undo, redo validation', () => {
        editor.editorModule.onEnter();
        editor.editorModule.insertText("The quick brown fox jumps over a lazy dog. The quick brown fox jumps over a lazy dog. The quick brown fox jumps over a lazy dog. The quick brown fox jumps over a lazy dog.");
        editor.selection.select('0;0;20', '0;1;122');
        editor.editor.insertComment("Hello world");
        
        editor.editor.resolveComment(editor.documentHelper.comments[0]);
        
        expect(editor.documentHelper.comments[0].isResolved).toBe(true);
        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments[0].isResolved).toBe(false);
        //expect(currentLine.children.length).toBe(2);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.documentHelper.comments[0].isResolved).toBe(true);
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Reopen comment undo, redo validation', () => {
        editor.editorModule.onEnter();
        editor.editorModule.insertText("The quick brown fox jumps over a lazy dog. The quick brown fox jumps over a lazy dog. The quick brown fox jumps over a lazy dog. The quick brown fox jumps over a lazy dog.");
        editor.selection.select('0;0;20', '0;1;122');
        editor.editor.insertComment("Hello world");
        
        editor.editor.resolveComment(editor.documentHelper.comments[0]);
        editor.editor.reopenComment(editor.documentHelper.comments[0]);
        
        expect(editor.documentHelper.comments[0].isResolved).toBe(false);
        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments[0].isResolved).toBe(true);
        //expect(currentLine.children.length).toBe(2);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.documentHelper.comments[0].isResolved).toBe(false);
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
});

describe('Select and insert', () => {
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
    beforeEach((): void => {
        editor.openBlank();
        editor.editorModule.insertText("The quick brown fox jumps over a lazy dog. The quick brown fox jumps over a lazy dog. The quick brown fox jumps over a lazy dog. The quick brown fox jumps over a lazy dog.");
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
    it('Text in selection range with comment', () => {
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");
        editor.selection.select('0;0;19', '0;0;124');
        editor.editor.insertText('S');
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        editor.editorHistory.redo();
        expect(editor.documentHelper.comments.length).toBe(0);
    });
    it('Text in selection range with comment start alone', () => {
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");
        editor.selection.select('0;0;19', '0;0;25');
        editor.editor.insertText('S');
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.documentHelper.comments.length).toBe(1);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        editor.editorHistory.redo();
        expect(editor.documentHelper.comments.length).toBe(1);
    });
    it('Text in selection range with mutiple comment comment start ', () => {
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");
        editor.editor.replyComment(editor.documentHelper.comments[0], 'Reply 1');
        editor.editor.replyComment(editor.documentHelper.comments[0], 'Reply 2');

        editor.selection.select('0;0;10', '0;0;30');
        editor.editor.insertText('S');
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        let commentStartCount: number = 0;
        for (let i: number = 0; i < editor.selection.start.currentWidget.children.length; i++) {
            if (editor.selection.start.currentWidget.children[i] instanceof CommentCharacterElementBox) {
                commentStartCount++;
            }
        }
        expect(commentStartCount).toBe(3);
        expect(editor.documentHelper.comments.length).toBe(1);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        editor.editorHistory.redo();
        expect(editor.documentHelper.comments.length).toBe(1);
    });
    it('Section break before comment start', () => {
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");
        editor.selection.select('0;0;15','0;0;15');
        editor.editor.insertSectionBreak();

        expect(editor.documentHelper.comments.length).toBe(1);

        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Section break after comment start', () => {
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");
        editor.selection.select('0;0;25','0;0;25');
        editor.editor.insertSectionBreak();

        expect(editor.documentHelper.comments.length).toBe(1);

        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Enter in selection range with comment', () => {
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");
        editor.selection.select('0;0;19', '0;0;124');
        editor.editor.onEnter();

        expect(editor.documentHelper.comments.length).toBe(0);

        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Cut in selection range with comment', () => {
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");
        editor.selection.select('0;0;19', '0;0;124');
        editor.editor.cut();

        expect(editor.documentHelper.comments.length).toBe(0);

        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });

    it('Image in selection range with comment', () => {
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");
        editor.selection.select('0;0;18', '0;0;125');
        editor.editor.insertImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAgVBMVEX///8AAADgAADY2Njl5eVcXFxjY2NZWVl/f3+wsLCmpqb4+PiioqKpqam7u7vV1dX2uLj2wsLhFRXzpKT3vb30sbHhCwv74+P40dH+9vbkIyO2trbBwcHLy8tsbGycnJz529v4zMzrbGzlLS3qZmblNzfrdXXoRkbvi4vvgYHlHh7CZsBOAAADpUlEQVR4nO3da1faQBSF4ekAUQlUEFs14AXxVv7/D6yaQiZx5mSEYXF2ut+PNKzyyK5diYDmR9czx34AB49C/CjE759w3jvvWr15Tdgz3atXE54f++EcIArxoxA/CvGjED8K8aMQPwrxoxA/CvGLEeZ9jPJdhfk4GyCUjb3ECGE/Q6m/q3DwfudjP0ERZYN9hKdn2hvd3+0jHJz5/kBVuTk96bbQUEjhYR9ckiikUH8UUqg/CinUH4UU6o9CCvVHIYX6o5BC/VFIof4opFB/FFKoPwop1B+FFOqPQgrjyxfjVC38Lxk9tnAxGqZqdKtSOE4GHA5/fuNJpDCtcNHbv4VqYYqPLjgfUViPQgrjozA2CptRSGF8/59w+Wrt+rr1btNna1cPzg0wwuXavncxabnX7PfHYYXzlYARvlobQZyUR9mXm+1NMEK7SSLONgcVV9vb8IQXv4J3KSeKKlxXxNCzONkeYp8AV3p9UT1+P3FWHVAsq5thhGZSEb1DrSZq7dS5HUdoLiuBZ6jORG3tCwAkNJfCUJ2Jrqe1P0ESCkMNTdSACYNDDU7UoAkDQw1P1MAJvUMVJmrwhJ6hShM1gMIvQxUnahCFjaHKEzWQQneoxR95ogZTWBuqPFEDKnSHKk/UoArdoYoTNbDC5lBDEzW4QjMpYiZqgIXG/S76JhwHK5zVVipcnkIVuv/RW/HyFKhwYhuFr6NiCmdNoDBUSGFjovJQEYXuRN9ahwoorJ8uSZenPsMTNk+X2q6jwgm/ntHL11HhhL4zenmoYEL/Gb04VCxh6KKTNFQoYfiikzBUJKF00Sk8VCChfF00OFQcYdt10dBQYYRT5xn0n9G7Q0X8GfCzNNEyZ6iPgD/HlydaVg11DfhajJaJlm2HugIUrlomWrYZKuJKHz6vHhbSM/hROdRnxNe1meuXYvW0DB6+aflYrB7dlzDiCM3N1dVN6GDhMCDhjlHYjEIK46MwNgqbUUhhfJ/vA07wO8N1vw94ONo/3e/lTpVOYfc/UyG//ZmqW52fi/FuTNW3/lZ+eguF+qOQQv1RSKH+KKRQfxRSqD8KKdQfhRTqj0IK9UchhfqjkEL9UUih/iikUH8UUqg/CmXh6Hsv3jlK+wnvD/vgkrSHMMuyu1P9ZdmuwnycDQYn+svG3n9KEUKT9zHyf6+IEWJHIX4U4kchfhTiRyF+FOJHIX4U4kchfnVhijeZa6sunCf4ZdPamteEHY5C/CjEr/vCv0ec0g+AtS1QAAAAAElFTkSuQmCC');

        expect(editor.documentHelper.comments.length).toBe(0);


        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Table in selection range with comment', () => {
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");
        editor.selection.select('0;0;18', '0;0;125');
        editor.editor.insertTable(2, 2);

        expect(editor.documentHelper.comments.length).toBe(0);

        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Table of content in selection range with comment', () => {
        editor.editor.onEnter();
        editor.editor.insertText("Hello world");
        editor.editorModule.applyStyle('Heading 1');
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");
        editor.selection.select('0;0;18', '0;0;125');
        editor.editor.insertTableOfContents();

        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.documentHelper.comments.length).toBe(0);
        // let sfdt = editor.serialize();
        // for (let i = 0; i <= 3; i++) {
        //     editor.editorHistory.undo();
        //     expect(editor.serialize()).toBe(sfdt_AfterUndo);
        //     editor.editorHistory.redo();
        //     expect(editor.serialize()).toBe(sfdt);
        // }
    });
    it('Page number in selection range with comment', () => {
        editor.editor.onEnter();
        editor.editor.insertText("Hello world");
        editor.editorModule.applyStyle('Heading 1');
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");
        editor.selection.select('0;0;18', '0;0;125');
        editor.editor.insertPageNumber();

        expect(editor.documentHelper.comments.length).toBe(0);


        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Page count in selection range with comment', () => {
        editor.editor.onEnter();
        editor.editor.insertText("Hello world");
        editor.editorModule.applyStyle('Heading 1');
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");
        editor.selection.select('0;0;18', '0;0;125');
        editor.editor.insertPageCount();

        expect(editor.documentHelper.comments.length).toBe(0);


        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Hyperlink in selection range with comment with same display text', () => {
        editor.editor.onEnter();
        editor.editor.insertText("Hello world");
        editor.editorModule.applyStyle('Heading 1');
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");
        editor.selection.select('0;0;18', '0;0;125');
        editor.editor.insertHyperlink('https://syncfusion.com', editor.selection.text);

        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.documentHelper.comments.length).toBe(1);

        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Hyperlink in selection range with comment with different display text', () => {
        editor.editor.onEnter();
        editor.editor.insertText("Hello world");
        editor.editorModule.applyStyle('Heading 1');
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");
        editor.selection.selectComment(editor.documentHelper.comments[0]);

        editor.editor.insertHyperlink('https://syncfusion.com', 'Syncfusion');

        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(0);
        expect(editor.documentHelper.comments.length).toBe(0);

        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
});

describe('Single Delete and Backspace before and after comment character', () => {
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
    beforeEach((): void => {
        editor.openBlank();
        editor.editorModule.insertText("Hello World");
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
    it('Single back space after comment end', () => {
        editor.selection.selectAll();
        editor.editor.insertComment("Hello world");
        editor.selection.moveToLineEnd();
        editor.editor.onBackSpace();
        expect(editor.documentHelper.comments.length).toBe(0);
        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Single back space before comment end', () => {
        editor.selection.selectAll();
        editor.editor.insertComment("Hello world");
        editor.selection.moveToLineEnd();
        editor.selection.movePreviousPosition();
        editor.editor.onBackSpace();

        expect(editor.documentHelper.comments.length).toBe(1);

        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Single back space after comment start', () => {
        editor.selection.selectAll();
        editor.editor.insertComment("Hello world");
        editor.selection.select('0;0;1', '0;0;1');
        editor.editor.onBackSpace();

        expect(editor.documentHelper.comments.length).toBe(1);

        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(0);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Single back space before comment start', () => {
        editor.selection.selectAll();
        editor.editor.insertComment("Hello world");
        editor.selection.select('0;0;0', '0;0;0');
        editor.editor.onBackSpace();

        expect(editor.documentHelper.comments.length).toBe(1);

        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(0);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Single delete after comment end', () => {
        editor.selection.selectAll();
        editor.editor.insertComment("Hello world");
        editor.selection.moveToLineEnd();
        editor.editor.delete();

        expect(editor.documentHelper.comments.length).toBe(1);

        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(0);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Single delete before comment end', () => {
        editor.selection.selectAll();
        editor.editor.insertComment("Hello world");
        editor.selection.moveToLineEnd();
        editor.selection.movePreviousPosition();
        editor.editor.delete();

        expect(editor.documentHelper.comments.length).toBe(1);

        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(0);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Single delete after comment start', () => {
        editor.selection.selectAll();
        editor.editor.insertComment("Hello world");
        editor.selection.select('0;0;1', '0;0;1');
        editor.editor.delete();

        expect(editor.documentHelper.comments.length).toBe(1);

        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Single delete before comment start', () => {
        editor.selection.selectAll();
        editor.editor.insertComment("Hello world");
        editor.selection.select('0;0;0', '0;0;0');
        editor.editor.delete();

        expect(editor.documentHelper.comments.length).toBe(1);

        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
});

describe('Select and remove', () => {
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
    beforeEach((): void => {
        editor.openBlank();
        editor.editorModule.insertText("The quick brown fox jumps over a lazy dog. The quick brown fox jumps over a lazy dog. The quick brown fox jumps over a lazy dog. The quick brown fox jumps over a lazy dog.");
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
    it('Select entire comment and backspace in same paragraph', () => {
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");

        editor.selection.selectComment(editor.documentHelper.comments[0]);
        editor.editor.onBackSpace();

        expect(editor.documentHelper.comments.length).toBe(0);
        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });

    it('Select entire comment and delete in same paragraph', () => {
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");

        editor.selection.selectComment(editor.documentHelper.comments[0]);
        editor.editor.delete();

        expect(editor.documentHelper.comments.length).toBe(0);
        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });

    it('Select entire comment and cut in same paragraph', () => {
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");

        editor.selection.selectComment(editor.documentHelper.comments[0]);
        editor.editor.cut();

        expect(editor.documentHelper.comments.length).toBe(0);
        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });

    it('Select comment end alone and backspace in same paragraph', () => {
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");

        editor.selection.select('0;0;119', '0;0;126');
        editor.editor.onBackSpace();

        expect(editor.documentHelper.comments.length).toBe(0);
        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });

    it('Select comment end alone and backspace in inside table ', () => {
        editor.editor.insertText('Hello World');
        editor.editor.insertTable(3, 3);
        editor.selection.select('0;0;0', '0;1;2;2;0;1');
        editor.editorModule.insertComment("Hello world");
        editor.selection.moveNextPosition();
        editor.selection.selectTable();
        editor.editorModule.onBackSpace();

        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(0);
        expect(editor.documentHelper.comments.length).toBe(0);
        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });

    it('Select comment end alone and delete in same paragraph', () => {
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");

        editor.selection.select('0;0;119', '0;0;126');
        editor.editor.delete();

        expect(editor.documentHelper.comments.length).toBe(0);
        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });

    it('Select comment end alone and cut in same paragraph', () => {
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");

        editor.selection.select('0;0;119', '0;0;126');
        editor.editor.cut();

        expect(editor.documentHelper.comments.length).toBe(0);
        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });


    it('Select comment start alone and backspace in same paragraph', () => {
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");

        editor.selection.select('0;0;18', '0;0;26');
        editor.editor.onBackSpace();

        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);

        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });

    it('Select comment start alone and delete in same paragraph', () => {
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");

        editor.selection.select('0;0;18', '0;0;26');
        editor.editor.delete();

        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);

        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });

    it('Select comment start alone and cut in same paragraph', () => {
        editor.selection.select('0;0;20', '0;0;122');
        editor.editor.insertComment("Hello world");

        editor.selection.select('0;0;18', '0;0;26');
        editor.editor.cut();

        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);

        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
});

describe('Select table, row, cell, column with comments and ', () => {
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
    beforeEach((): void => {
        editor.openBlank();
        editor.editor.insertTable(3, 3);

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
    it('Delete table using backspace', () => {
        editor.selection.selectTable();
        editor.editor.insertComment("Hello world");
        editor.selection.selectTable();
        editor.editor.onBackSpace();
        expect(editor.documentHelper.comments.length).toBe(0);
        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete table using delete', () => {
        editor.selection.selectTable();
        editor.editor.insertComment("Hello world");
        editor.selection.selectTable();
        editor.editor.delete();
        expect(editor.documentHelper.comments.length).toBe(0);

        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete table using delete table api', () => {
        editor.selection.selectTable();
        editor.editor.insertComment("Hello world");
        editor.selection.selectTable();
        editor.editor.deleteTable();
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });

    it('Delete row using backspace', () => {
        editor.selection.selectRow();
        editor.editor.insertComment("Hello world");
        editor.selection.selectRow();
        editor.editor.onBackSpace();
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete row using delete', () => {
        editor.selection.selectRow();
        editor.editor.insertComment("Hello world");
        editor.selection.selectRow();
        editor.editor.delete();
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete row using delete table api', () => {
        editor.selection.selectRow();
        editor.editor.insertComment("Hello world");
        editor.selection.selectRow();
        editor.editor.deleteRow();
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });

    it('Delete column using backspace', () => {
        editor.selection.selectColumn();
        editor.editor.insertComment("Hello world");
        editor.selection.selectColumn();
        editor.editor.onBackSpace();
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete column using delete', () => {
        editor.selection.selectColumn();
        editor.editor.insertComment("Hello world");
        editor.selection.selectColumn();
        editor.editor.delete();
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete column using delete table api', () => {
        editor.selection.selectColumn();
        editor.editor.insertComment("Hello world");
        editor.selection.selectColumn();
        editor.editor.deleteColumn();
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });

    it('Delete cell using backspace', () => {
        editor.editor.insertComment("Hello world");
        editor.selection.selectCell();
        editor.editor.onBackSpace();
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete cell using delete', () => {
        editor.editor.insertComment("Hello world");
        editor.selection.selectCell();
        editor.editor.delete();
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });

});

describe('Delete table with comments ', () => {
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
    beforeEach((): void => {
        editor.openBlank();
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
    it('Delete table using delete table api', () => {
        editor.editor.insertTable(3, 3);
        editor.selection.selectTable();
        editor.editor.insertComment("Hello world");
        editor.selection.moveNextPosition();
        editor.editor.deleteTable();

        expect(editor.documentHelper.comments.length).toBe(0);
        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete table with only comment start using delete table API', () => {
        editor.editor.insertText('Hello World');
        editor.selection.moveToDocumentStart();
        editor.editor.insertTable(3, 3);
        editor.selection.selectAll();
        editor.editorModule.insertComment("Hello world");
        editor.selection.moveToDocumentStart();
        editor.editorModule.deleteTable();

        expect(editor.selection.start.currentWidget.children[0] instanceof CommentCharacterElementBox).toBe(true)
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete table with only comment start using backspace', () => {
        editor.editor.insertText('Hello World');
        editor.selection.moveToDocumentStart();
        editor.editor.insertTable(3, 3);
        editor.selection.selectAll();
        editor.editorModule.insertComment("Hello world");
        editor.selection.moveToDocumentStart();
        editor.selection.selectTable();
        editor.editorModule.onBackSpace();

        expect(editor.selection.start.currentWidget.children[0] instanceof CommentCharacterElementBox).toBe(true)
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt = editor.serialize();
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.serialize()).toBe(sfdt);
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete table with only comment start using delete', () => {
        editor.editor.insertText('Hello World');
        editor.selection.moveToDocumentStart();
        editor.editor.insertTable(3, 3);
        editor.selection.selectAll();
        editor.editorModule.insertComment("Hello world");
        editor.selection.moveToDocumentStart();
        editor.selection.selectTable();
        editor.editorModule.delete();

        expect(editor.selection.start.currentWidget.children[0] instanceof CommentCharacterElementBox).toBe(true)
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.documentHelper.comments.length).toBe(1);

        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete table with only comment end using delete table API', () => {
        editor.editor.insertText('Hello World');
        editor.editor.insertTable(3, 3);
        editor.selection.select('0;0;0', '0;1;2;2;0;1');
        editor.editorModule.insertComment("Hello world");
        editor.selection.moveNextPosition();
        editor.editorModule.deleteTable();

        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(0);
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete table with only comment end using backspace', () => {
        editor.editor.insertText('Hello World');
        editor.editor.insertTable(3, 3);
        editor.selection.select('0;0;0', '0;1;2;2;0;1');
        editor.editorModule.insertComment("Hello world");
        editor.selection.moveNextPosition();
        editor.selection.selectTable();
        editor.editorModule.onBackSpace();

        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(0);
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete table with only comment end using delete', () => {
        editor.editor.insertText('Hello World');
        editor.editor.insertTable(3, 3);
        editor.selection.select('0;0;0', '0;1;2;2;0;1');
        editor.editorModule.insertComment("Hello world");
        editor.selection.moveNextPosition();
        editor.selection.selectTable();
        editor.editorModule.delete();

        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(0);
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
});

describe('Delete row with comments ', () => {
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
    beforeEach((): void => {
        editor.openBlank();
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

    it('Delete row using delete row api', () => {
        editor.editor.insertTable(3, 3);
        editor.selection.selectRow();
        editor.editor.insertComment("Hello world");
        editor.selection.moveNextPosition();
        editor.editor.deleteRow();

        expect(editor.documentHelper.comments.length).toBe(0);

        editor.editorHistory.undo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete row with only comment start using delete row API', () => {
        editor.editor.insertText('Hello World');
        editor.selection.moveToDocumentStart();
        editor.editor.insertTable(3, 3);
        editor.selection.selectAll();
        editor.editorModule.insertComment("Hello world");
        editor.selection.moveToDocumentStart();
        editor.editorModule.deleteRow();

        expect(editor.selection.start.currentWidget.children[0] instanceof CommentCharacterElementBox).toBe(true)
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.documentHelper.comments.length).toBe(1);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete row with only comment start using backspace', () => {
        editor.editor.insertText('Hello World');
        editor.selection.moveToDocumentStart();
        editor.editor.insertTable(3, 3);
        editor.selection.selectAll();
        editor.editorModule.insertComment("Hello world");
        editor.selection.moveToDocumentStart();
        editor.selection.selectRow();
        editor.editorModule.onBackSpace();

        expect(editor.selection.start.currentWidget.children[0] instanceof CommentCharacterElementBox).toBe(true)
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.documentHelper.comments.length).toBe(1);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete row with only comment start using delete', () => {
        editor.editor.insertText('Hello World');
        editor.selection.moveToDocumentStart();
        editor.editor.insertTable(3, 3);
        editor.selection.selectAll();
        editor.editorModule.insertComment("Hello world");
        editor.selection.moveToDocumentStart();
        editor.selection.selectRow();
        editor.editorModule.delete();

        expect(editor.selection.start.currentWidget.children[0] instanceof CommentCharacterElementBox).toBe(true)
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.documentHelper.comments.length).toBe(1);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete row with only comment end using delete row API', () => {
        editor.editor.insertText('Hello World');
        editor.editor.insertTable(3, 3);
        editor.selection.select('0;0;0', '0;1;2;2;0;1');
        editor.editorModule.insertComment("Hello world");
        editor.selection.moveNextPosition();
        editor.editorModule.deleteRow();

        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(0);
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(0);
        expect(editor.documentHelper.comments.length).toBe(0);
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete table with only comment end using backspace', () => {
        editor.editor.insertText('Hello World');
        editor.editor.insertTable(3, 3);
        editor.selection.select('0;0;0', '0;1;2;2;0;1');
        editor.editorModule.insertComment("Hello world");
        editor.selection.moveNextPosition();
        editor.selection.selectRow();
        editor.editorModule.onBackSpace();

        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(0);
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete table with only comment end using delete', () => {
        editor.editor.insertText('Hello World');
        editor.editor.insertTable(3, 3);
        editor.selection.select('0;0;0', '0;1;2;2;0;1');
        editor.editorModule.insertComment("Hello world");
        editor.selection.moveNextPosition();
        editor.selection.selectRow();
        editor.editorModule.delete();

        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(0);
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
});

describe('Delete column with comments ', () => {
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
    beforeEach((): void => {
        editor.openBlank();
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

    it('Delete column using delete column api', () => {
        editor.editor.insertTable(3, 3);
        editor.selection.selectColumn();
        editor.editor.insertComment("Hello world");
        editor.selection.moveNextPosition();
        editor.editor.deleteColumn();

        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete column with only comment start using delete column API', () => {
        editor.editor.insertText('Hello World');
        editor.selection.moveToDocumentStart();
        editor.editor.insertTable(3, 3);
        editor.selection.selectAll();
        editor.editorModule.insertComment("Hello world");
        editor.selection.moveToDocumentStart();
        editor.editorModule.deleteColumn();

        expect(editor.selection.start.currentWidget.children[0] instanceof CommentCharacterElementBox).toBe(true)
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.documentHelper.comments.length).toBe(1);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete column with only comment start using backspace', () => {
        editor.editor.insertText('Hello World');
        editor.selection.moveToDocumentStart();
        editor.editor.insertTable(3, 3);
        editor.selection.selectAll();
        editor.editorModule.insertComment("Hello world");
        editor.selection.moveToDocumentStart();
        editor.selection.selectColumn();
        editor.editorModule.onBackSpace();

        expect(editor.selection.start.currentWidget.children[0] instanceof CommentCharacterElementBox).toBe(true)
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.documentHelper.comments.length).toBe(1);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete column with only comment start using delete', () => {
        editor.editor.insertText('Hello World');
        editor.selection.moveToDocumentStart();
        editor.editor.insertTable(3, 3);
        editor.selection.selectAll();
        editor.editorModule.insertComment("Hello world");
        editor.selection.moveToDocumentStart();
        editor.selection.selectColumn();
        editor.editorModule.delete();

        expect(editor.selection.start.currentWidget.children[0] instanceof CommentCharacterElementBox).toBe(true)
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.documentHelper.comments.length).toBe(1);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete column with only comment end using delete column API', () => {
        editor.editor.insertText('Hello World');
        editor.editor.insertTable(3, 3);
        editor.selection.select('0;0;0', '0;1;2;2;0;1');
        editor.editorModule.insertComment("Hello world");
        editor.selection.moveNextPosition();
        editor.editorModule.deleteColumn();

        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(0);
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(1);
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(0);
        expect(editor.documentHelper.comments.length).toBe(0);
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete table with only comment end using backspace', () => {
        editor.editor.insertText('Hello World');
        editor.editor.insertTable(3, 3);
        editor.selection.select('0;0;0', '0;1;2;2;0;1');
        editor.editorModule.insertComment("Hello world");
        editor.selection.moveNextPosition();
        editor.selection.selectColumn();
        editor.editorModule.onBackSpace();

        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(0);
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
    it('Delete table with only comment end using delete', () => {
        editor.editor.insertText('Hello World');
        editor.editor.insertTable(3, 3);
        editor.selection.select('0;0;0', '0;1;2;2;0;1');
        editor.editorModule.insertComment("Hello world");
        editor.selection.moveNextPosition();
        editor.selection.selectColumn();
        editor.editorModule.delete();

        expect(editor.element.getElementsByClassName('e-de-cmt-mark').length).toBe(0);
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments.length).toBe(1);
        let sfdt_AfterUndo = editor.serialize();
        editor.editorHistory.redo();
        let sfdt = editor.serialize();
        for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
    });
});
