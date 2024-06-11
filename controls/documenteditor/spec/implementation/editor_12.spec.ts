import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget, SfdtExport, Widget } from '../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, TableCellWidget, TextElementBox, TextHelper, RtlInfo, ListTextElementBox, LineWidget, TabElementBox, TextPosition } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { BorderSettings } from '../../src/document-editor/implementation/editor/editor';

describe('Paste content validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, isReadOnly: false, enableLocalPaste: false });
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
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
//     it('Paste content validation if the result is null', () => {
// console.log('Paste content validation if the result is null');
//         (editor.editor as any).copiedTextContent = "Hello world";
//         (editor.editor as any).pasteFormattedContent({ data: null });
//         expect(((editor.selection.start.currentWidget as LineWidget).children[0] as TextElementBox).text).toBe('Hello world');
//     });
});

describe('Paste Text Formatting formatting option', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, isReadOnly: false });
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
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Paste Text Formatting formatting option', () => {
console.log('Paste Text Formatting formatting option');
        (editor.editor as any).copiedTextContent = 'Welcome to the new world';
        (editor.editor as any).copiedContent = '';
        (editor.editor as any).pasteContents((editor.editor as any).copiedTextContent);
        (editor.editor as any).applyPasteOptions('KeepSourceFormatting');
        // expect((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children.length).toBe(1);
    });
});
/**
 * Toc content creation validation.
 */
describe('Toc content creation validation', () => {
    let editor: DocumentEditor = undefined;
    let tocSettings: TableOfContentsSettings = {
        startLevel: 1,
        endLevel: 3,
        includeHyperlink: true,
        includePageNumber: true,
        rightAlign: true
    };
    let text: string = "welcome";
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, enableEditorHistory: true, isReadOnly: false });
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
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Applying style on selection including para mark and inserting Toc', () => {
console.log('Applying style on selection including para mark and inserting Toc');
        editor.editor.insertText(text);
        editor.selection.selectAll();
        editor.editor.applyStyle('Heading 1');
        editor.selection.handleHomeKey();
        editor.editor.handleEnterKey();
        editor.selection.handleUpKey();
        editor.editor.insertTableOfContents(tocSettings);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[6] as TextElementBox).text).toBe(text);
    });
    it('Applying style on selection not including para mark and inserting Toc', () => {
console.log('Applying style on selection not including para mark and inserting Toc');
        editor.openBlank();
        editor.editor.insertText(text);
        editor.selection.handleHomeKey();
        editor.selection.selectCurrentWord();
        editor.editor.applyStyle('Heading 1');
        editor.selection.handleHomeKey();
        editor.editor.handleEnterKey();
        editor.selection.handleUpKey();
        editor.editor.insertTableOfContents(tocSettings);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[6] as TextElementBox).text).toBe(text);
    });
});

describe('Paste Heading content and TOC validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, enableEditorHistory: true, isReadOnly: false, enableSfdtExport: true, enableLocalPaste: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
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
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 500);
    });
    it('Copy Paste Heading and Inserting TOC', () => {
console.log('Copy Paste Heading and Inserting TOC');
        editor.editor.insertText('Heading1');
        editor.selection.selectAll();
        editor.editor.applyStyle('Heading 1');
        editor.selection.copy();
        editor.selection.handleRightKey();
        editor.editor.onEnter();
        editor.editor.paste();
        editor.selection.handleUpKey();
        editor.selection.handleHomeKey();
        editor.editor.onEnter();
        editor.selection.handleUpKey();
        editor.editor.insertTableOfContents();
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(6); 
    });
    it('Copy Paste word in paragraph', () => {
console.log('Copy Paste word in paragraph');
        editor.openBlank();
        editor.editor.insertText('Hello World');
        editor.selection.selectAll();
        editor.editor.applyStyle('Heading 1');
        editor.selection.handleRightKey();
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        editor.selection.copy();
        editor.selection.handleRightKey();
        editor.editor.onEnter();
        editor.editor.paste();
        expect(editor.selection.paragraphFormat.styleName).toBe('Normal');
    });
    it('Copy Paste whole paragraph', () => {
console.log('Copy Paste whole paragraph');
        editor.openBlank();
        editor.editor.insertText('Hello World');
        editor.selection.selectAll();
        editor.editor.applyStyle('Heading 1');
        editor.selection.copy();
        editor.selection.handleRightKey();
        editor.editor.onEnter();
        editor.editor.paste();
        expect(editor.selection.paragraphFormat.styleName).toBe('Heading 1');
    });
});

// undo and redo validation for list

describe('apply list to rtl paragraph with history validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, isReadOnly: false, enableLocalPaste: false });
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
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
//     it('apply RTL', () => {
// console.log('apply RTL');
//         editor.selection.paragraphFormat.bidi = true;
//         editor.editor.insertText('יקךךם');
//         editor.editor.onEnter();
//         editor.editor.insertText('יקךךם');
//         editor.editor.onEnter();
//         editor.editor.insertText('יקךךם');
//         editor.selection.selectAll();
//         editor.editor.applyNumbering('%1.', 'Arabic');
//         editor.selection.handleDownKey();
//         editor.selection.handleHomeKey();
//         editor.selection.handleUpKey();
//         editor.selection.handleTabKey(true, false);
//         expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
//         expect(((editor.selection.start.paragraph.nextWidget as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(3);
//     });
    it('undo after list apply to RTL', () => {
console.log('undo after list apply to RTL');
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);

    });
//     it('redo after list apply to RTL', () => {
// console.log('redo after list apply to RTL');
//         editor.editorHistory.redo();
//         expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);

//     });
    it('Footer widgets y position validation', () => {
console.log('Footer widgets y position validation');
        editor.openBlank();
        editor.selection.goToFooter();
        editor.editor.insertTable(2,2);
        editor.editor.insertText('Check');
        expect((editor.documentHelper.pages[0].footerWidget.childWidgets[0] as Widget).y).toBeLessThan((editor.documentHelper.pages[0].footerWidget.childWidgets[1] as Widget).y);
    });
});
