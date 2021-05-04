import { DocumentEditor } from '../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer, SfdtExport, DocumentHelper } from '../../src/index';

import { TestHelper } from '../test-helper.spec';
import { createElement } from '@syncfusion/ej2-base';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { TextPosition } from '../../src/index';
import { LineWidget, ParagraphWidget, TextElementBox, BodyWidget } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { WSectionFormat } from '../../src/document-editor/implementation/format/section-format';
/**
 * Selection Spec
 */
/**
 * Selection Spec
 */

describe('Selection Module Unit Test script', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    beforeEach(() => {
        editor.openBlank();
        editor.editorModule.insertText('Adventure Works cycles');
        documentHelper.selection.selectAll()
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
    it('toggle highlight color testing', () => {
console.log('toggle highlight color testing');
        documentHelper.selection.characterFormat.highlightColor = undefined;
        editor.editorModule.toggleHighlightColor();
        expect(documentHelper.selection.characterFormat.highlightColor).toBe('Yellow');
    });
    it('toggle highlight no color testing', () => {
console.log('toggle highlight no color testing');
        documentHelper.selection.characterFormat.highlightColor = 'Yellow';
        editor.editorModule.toggleHighlightColor();
        expect(documentHelper.selection.characterFormat.highlightColor).toBe('NoColor');
    });
});
describe('Selection Public APi testing ', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, SfdtExport, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.enableLocalPaste = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Cut, Copy , paste validation', () => {
console.log('Cut, Copy , paste validation');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.selectAll();
        editor.selection.copy();
        expect(editor.editorModule.copiedData).not.toBe('');
        editor.editorModule.paste();
        editor.selection.selectAll();
        editor.editor.cut();
        expect(editor.selectionModule.start.paragraph.isEmpty()).toBe(true);
        editor.editorModule.insertText('Syncfusion Software');
        expect(editor.selectionModule.start.paragraph.isEmpty()).toBe(false);
    });
    it('insert hyperlink with same display text', () => {
console.log('insert hyperlink with same display text');
        let text = editor.selection.text;
        editor.editorModule.insertHyperlinkInternal('https://syncfusion.com', text, true);
    });
    it('Insert hyperlink with different display text', () => {
console.log('Insert hyperlink with different display text');
        editor.editorModule.insertHyperlinkInternal('https://syncfusion.com', 'Syncfusion', true);
    });
    it('Toggle text alignment', () => {
console.log('Toggle text alignment');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.selectAll();
        editor.selectionModule.toggleTextAlignment('Center');
        expect(editor.selectionModule.paragraphFormat.textAlignment).toBe('Center');
        editor.selectionModule.toggleTextAlignment('Center');
        expect(editor.selectionModule.paragraphFormat.textAlignment).toBe('Left');
        editor.selectionModule.toggleTextAlignment('Center');
        expect(editor.selectionModule.paragraphFormat.textAlignment).toBe('Center');
        editor.editorHistory.undo();
        expect(editor.selectionModule.paragraphFormat.textAlignment).toBe('Left');
        editor.editorHistory.redo();
        expect(editor.selectionModule.paragraphFormat.textAlignment).toBe('Center');
    });
    it('Increase indent and decrease indent', () => {
console.log('Increase indent and decrease indent');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.selectAll();
        editor.selectionModule.increaseIndent();
        expect(editor.selectionModule.paragraphFormat.leftIndent).toBeGreaterThan(0);
        editor.selectionModule.decreaseIndent();
        expect(editor.selectionModule.paragraphFormat.leftIndent).toBeGreaterThanOrEqual(0);
        editor.editorHistory.undo();
        expect(editor.selectionModule.paragraphFormat.leftIndent).toBeGreaterThan(0);
        editor.editorHistory.redo();
        expect(editor.selectionModule.paragraphFormat.leftIndent).toBeGreaterThanOrEqual(0);
    });

    it('Add selection range testing', () => {
console.log('Add selection range testing');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.start.setPositionForCurrentIndex('0;0;0;0;5');
        expect(editor.selection.start.hierarchicalPosition).toBe('0;0;0;0;5');
        editor.selection.end.setPositionForCurrentIndex('0;0;0;0;7');
    });
});
describe('Selection Public APi testing - 2', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.enableLocalPaste = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Toggle Bold texting', () => {
console.log('Toggle Bold texting');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.selectAll();
        editor.selectionModule.toggleBold();
        expect(editor.selectionModule.characterFormat.bold).toBe(true);
        editor.selectionModule.toggleBold();
        expect(editor.selectionModule.characterFormat.bold).toBe(false);
        editor.selectionModule.toggleBold();
        expect(editor.selectionModule.characterFormat.bold).toBe(true);
        editor.editorHistory.undo();
        expect(editor.selectionModule.characterFormat.bold).toBe(false);
        editor.editorHistory.redo();
        expect(editor.selectionModule.characterFormat.bold).toBe(true);
    });
    it('Toggle italic validation', () => {
console.log('Toggle italic validation');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.selectAll();
        editor.selectionModule.toggleItalic();
        expect(editor.selectionModule.characterFormat.italic).toBe(true);
        editor.selectionModule.toggleItalic();
        expect(editor.selectionModule.characterFormat.italic).toBe(false);
        editor.selectionModule.toggleItalic();
        expect(editor.selectionModule.characterFormat.italic).toBe(true);
        editor.editorHistory.undo();
        expect(editor.selectionModule.characterFormat.italic).toBe(false);
        editor.editorHistory.redo();
        expect(editor.selectionModule.characterFormat.italic).toBe(true);
    });
    it('Toggle Underline validation', () => {
console.log('Toggle Underline validation');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.selectAll();
        editor.selectionModule.toggleUnderline('Single');
        expect(editor.selectionModule.characterFormat.underline).toBe('Single');
        editor.selectionModule.toggleUnderline('Single');
        expect(editor.selectionModule.characterFormat.underline).toBe('None');
        editor.selectionModule.toggleUnderline('Single');
        expect(editor.selectionModule.characterFormat.underline).toBe('Single');
        editor.editorHistory.undo();
        expect(editor.selectionModule.characterFormat.underline).toBe('None');
        editor.editorHistory.redo();
        expect(editor.selectionModule.characterFormat.underline).toBe('Single');
    });
    it('Toggle highlight validation', () => {
console.log('Toggle highlight validation');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.selectAll();
        editor.selectionModule.toggleHighlightColor('Yellow');
        expect(editor.selectionModule.characterFormat.highlightColor).toBe('Yellow');
        editor.selectionModule.toggleHighlightColor('Yellow');
        expect(editor.selectionModule.characterFormat.highlightColor).toBe('NoColor');
        editor.selectionModule.toggleHighlightColor('Yellow');
        expect(editor.selectionModule.characterFormat.highlightColor).toBe('Yellow');
        editor.editorHistory.undo();
        expect(editor.selectionModule.characterFormat.highlightColor).toBe('NoColor');
        editor.editorHistory.redo();
        expect(editor.selectionModule.characterFormat.highlightColor).toBe('Yellow');
    });
    it('Toggle Strike through validation', () => {
console.log('Toggle Strike through validation');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.selectAll();
        editor.selectionModule.toggleStrikethrough();
        expect(editor.selectionModule.characterFormat.strikethrough).toBe('SingleStrike');
        editor.selectionModule.toggleStrikethrough();
        expect(editor.selectionModule.characterFormat.strikethrough).toBe('None');
        editor.selectionModule.toggleStrikethrough('SingleStrike');
        expect(editor.selectionModule.characterFormat.strikethrough).toBe('SingleStrike');
        editor.editorHistory.undo();
        expect(editor.selectionModule.characterFormat.strikethrough).toBe('None');
        editor.editorHistory.redo();
        expect(editor.selectionModule.characterFormat.strikethrough).toBe('SingleStrike');
    });
    it('Toggle Subscript validation', () => {
console.log('Toggle Subscript validation');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.selectAll();
        editor.selection.toggleSubscript();
        expect(editor.selection.characterFormat.baselineAlignment).toBe('Subscript');
        editor.selection.toggleSubscript();
        expect(editor.selection.characterFormat.baselineAlignment).toBe('Normal');
        editor.selection.toggleSubscript();
        expect(editor.selection.characterFormat.baselineAlignment).toBe('Subscript');
        editor.editorHistory.undo();
        expect(editor.selectionModule.characterFormat.baselineAlignment).toBe('Normal');
        editor.editorHistory.redo();
        expect(editor.selectionModule.characterFormat.baselineAlignment).toBe('Subscript');
    });
    it('Toggle Superscript validation', () => {
console.log('Toggle Superscript validation');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.selectAll();
        editor.selectionModule.toggleSuperscript();
        expect(editor.selectionModule.characterFormat.baselineAlignment).toBe('Superscript');
        editor.selectionModule.toggleSuperscript();
        expect(editor.selectionModule.characterFormat.baselineAlignment).toBe('Normal');
        editor.selectionModule.toggleSuperscript();
        expect(editor.selectionModule.characterFormat.baselineAlignment).toBe('Superscript');
        editor.editorHistory.undo();
        expect(editor.selectionModule.characterFormat.baselineAlignment).toBe('Normal');
        editor.editorHistory.redo();
        expect(editor.selectionModule.characterFormat.baselineAlignment).toBe('Superscript');
    });
    it('Get Selected text and Move to previous paragraph end ', () => {
console.log('Get Selected text and Move to previous paragraph end ');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Syncfusion Software');

        let start: TextPosition = editor.selection.getDocumentStart();
        start.setPositionInternal(start);
        let end: TextPosition = new TextPosition(editor)
        end.setPositionForCurrentIndex(start.paragraph.getHierarchicalIndex('0;10'))

        editor.selectionModule.selectPosition(start, end);

        expect(editor.selectionModule.text).toBe('Syncfusion');

        editor.selectionModule.selectPosition(editor.documentEnd, editor.documentEnd);

        editor.selectionModule.start.moveToPreviousParagraph(editor.selectionModule);
        // expect(editor.selectionModule.start.offset).toBe(span.text.length);

    });
    // it('Move to word ,paragraph start and end', () => {
    //     editor.openBlank();
    //     editor.editorModule.insertText('Syncfusion Software');
    //     editor.editorModule.onEnter();
    //     editor.editorModule.insertText('Syncfusion Software');

    //     editor.selectionModule.selectPosition(editor.documentEnd, editor.documentEnd);
    //     editor.selectionModule.start.moveToLineStartInternal(editor.selection, false);
    //     expect(editor.selectionModule.start.offset).toBe(11);
    //     editor.selectionModule.start.moveWordEnd();
    //     expect(editor.selectionModule.start.offset).toBe(span1.length);
    //     editor.selection.start.moveToLineStart();
    //     expect(editor.selectionModule.start.offset).toBe(0);
    //     editor.selection.start.moveToLineEnd();
    //     expect(editor.selectionModule.start.offset).toBe(span1.length);

    //     editor.selection.start.moveToParagraphStart();
    //     expect(editor.selectionModule.start.offset).toBe(0);
    //     editor.selection.start.moveToParagraphEnd();
    //     expect(editor.selectionModule.start.offset).toBe(span1.length + 1);

    //     editor.selection.start.moveToPreviousParagraphEnd();
    //     expect(editor.selectionModule.start.offset).toBe(span.length);
    //     expect(editor.selectionModule.start.paragraph).toBe(paragraph);
    //     editor.selection.start.moveToParagraphEnd();
    //     expect(editor.selectionModule.start.offset).toBe(20);
    //     editor.selection.start.moveToNextParagraphStart();
    //     expect(editor.selectionModule.start.offset).toBe(0);
    //     expect(editor.selectionModule.start.paragraph).toBe(paragraph1);
    // });
});
// describe('Text Position API validation', () => {
//     let editor: DocumentEditor;
//     let documentHelper:DocumentHelper;
//     beforeAll(() => {
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.appendChild(ele);
//         DocumentEditor.Inject(Selection, Editor, EditorHistory);
//         editor = new DocumentEditor({ enableEditor: true,isReadOnly: false, enablePaste: true, enableSelection: true, enableEditorHistory: true });
//         (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.appendTo('#container');
//         documentHelper=editor.documentHelper;
//     });
//     afterAll((done) => {
//         editor.destroy();
//         editor = undefined;
//         document.body.removeChild(document.getElementById('container'));
//         setTimeout(() => {
//             done();
//         }, 1000);
//     });
//     it('Move to previous position inside table validation', () => {
//         let paragraph: WParagraph = new WParagraph();

//         let section: WSection = new WSection();
//         section.blocks.push(paragraph);
//         let word: WordDocument = new WordDocument();
//         word.sections.push(section);

//         viewer.document = word;

//         editor.selection.end.moveToPreviousParagraphInTable(editor.selection);

//         expect(editor.selection.end.paragraph).toBe(paragraph);
//         expect(editor.selection.end.offset).toBe(0);
//         expect(() => { editor.selection.selectionRanges.checkSelectionRangesIsExist(viewer, editor.selection.start, editor.selection.end) }).not.toThrowError();
//         expect(editor.selection.start.document).toBe(word);
//         editor.selection.start.moveToPreviousParagraphEnd();
//         expect(editor.selection.start.paragraph).toBe(paragraph);
//         expect(editor.selection.start.offset).toBe(0);
//         expect(editor.selection.start.isInSameDocument(editor.selection.end)).toBe(true);

//     });
//     it('Add existing range in Selection range validation', () => {
//         let range: SelectionRange = editor.selection.selectionRanges.last;
//         editor.selection.selectionRanges.addRange(range);
//         expect(editor.selection.selectionRanges.length).toBe(1);
//         expect(() => { (editor.selection.start as any).getNextWordOffsetFieldSeparator({} as any); }).not.toThrowError();
//     });
//     it('Navigate Hyperlink texting', () => {
//         viewer.document = editor.createEmptyDocument();
//         let spy = jasmine.createSpy('spy');
//         editor.requestNavigate = spy
//         editor.selection.navigateHyperlink();
//         expect(spy).not.toHaveBeenCalled();
//     });
//     it('API testing on Readonly mode', () => {
//         editor.isReadOnly = true;
//         editor.dataBind();
//         editor.editor.mergeCells();
//         editor.selection.clearFormatting();
//     });
// });
describe('Selection with out clearing multi selection', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
        editor.enableLocalPaste = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Select without clearing selection range', () => {
console.log('Select without clearing selection range');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.selectCurrentWord();
        let line: LineWidget = editor.selection.start.paragraph.childWidgets[0] as LineWidget;
        let startPos = new TextPosition(editor);
        startPos.setPositionForCurrentIndex(line.getHierarchicalIndex('2'));
        let endPos = new TextPosition(editor);
        endPos.setPositionForCurrentIndex(line.getHierarchicalIndex('2'));

        editor.selection.start = startPos;
        editor.selection.end = endPos;
        editor.selection.selectParagraph();
        editor.selection.extendToLineStart();
        editor.selection.extendToLineEnd();
        editor.selection.extendToParagraphStart();
        editor.selection.extendToParagraphEnd();
        editor.selection.moveToPreviousParagraph();
        editor.selection.moveToNextParagraph();
        editor.selection.moveToLineEnd();
        editor.selection.selects(line, 2, false);
    });
});



describe('Select Current Word', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableSelection: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = (editor as any).documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Select current word validation in list text element box', () => {
console.log('Select current word validation in list text element box');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        editor.editor.applyNumbering('%1.', 'Arabic');
        editor.selection.handleHomeKey();
        editor.selection.selectCurrentWord();
        expect(editor.selection.getText(true)).toBe('Syncfusion ');
    });
    it('Select current word validation in list text element box with continous word', () => {
console.log('Select current word validation in list text element box with continous word');
        editor.openBlank();
        editor.editorModule.insertText('SyncfusionSoftwareSyncfusionSoftwareSyncfusionSoftwareSyncfusionSoftwareSyncfusionSoftware');
        editor.editor.applyNumbering('%1.', 'Arabic');
        editor.selection.handleUpKey();
        editor.selection.handleHomeKey();
        editor.selection.selectCurrentWord();
        expect(editor.selection.getText(true)).toBe('SyncfusionSoftwareSyncfusionSoftwareSyncfusionSoftwareSyncfusionSoftwareSyncfusionSoftware');
    });
    it('Select current word validation in text element box with out list', () => {
console.log('Select current word validation in text element box with out list');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.handleHomeKey();
        editor.selection.selectCurrentWord();
        expect(editor.selection.getText(true)).toBe('Syncfusion ');
    });
    it('Select current word validation text element box without list', () => {
console.log('Select current word validation text element box without list');
        editor.openBlank();
        editor.editorModule.insertText('SyncfusionSoftwareSyncfusionSoftwareSyncfusionSoftwareSyncfusionSoftwareSyncfusionSoftware');
        editor.selection.handleUpKey();
        editor.selection.handleHomeKey();
        editor.selection.selectCurrentWord();
        expect(editor.selection.getText(true)).toBe('SyncfusionSoftwareSyncfusionSoftwareSyncfusionSoftwareSyncfusionSoftwareSyncfusionSoftware');
    });
    it('Select current word inside field', () => {
        console.log('Select current word inside field');
        editor.openBlank();
        var fieldCode = 'MERGEFIELD  ' + 'Hello' + "  \\* MERGEFORMAT ";
        editor.editor.insertField(fieldCode, '«' + 'Hello' + '»');
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        expect(editor.selection.start.offset).toBeGreaterThan(0);
        // Insert Text inside field
        editor.editorModule.insertText('World');
        expect(editor.selection.start.currentWidget.children.length).toBe(5)
    });
});

describe('Cut and Copy operation without SfdtExport', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Cut, Copy , paste validation', () => {
console.log('Cut, Copy , paste validation');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.selectAll();
        expect(() => { editor.selection.copy() }).not.toThrowError();
        expect(() => { editor.editorModule.cut() }).not.toThrowError();
    });
});
