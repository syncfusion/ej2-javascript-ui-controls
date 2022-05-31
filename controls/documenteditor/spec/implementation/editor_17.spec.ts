import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget, BookmarkDialog, BookmarkElementBox, BorderSettings, TableWidget, TableRowWidget } from '../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, EditorHistory, TableCellWidget, TextElementBox, TextHelper, RtlInfo, ListTextElementBox, LineWidget, TabElementBox, TextPosition, WSectionFormat } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';
/**
 * Insert comment validation
 */
describe('Insert comment', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
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
    it('In header footer', () => {
console.log('In header footer');
        editor.selection.goToHeader();
        editor.editor.insertComment();
        expect(editor.documentHelper.comments.length).toBe(0);
    });
});


//Restrict editing test cases



describe('Open restrict document with para mark at end of table cell', () => {
    let editor: DocumentEditor = undefined;
    let restrictJson: string = '{"sections":[{"blocks":[{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"name":"_GoBack","bookmarkType":0},{"editRangeId":"76489596","columnFirst":0,"columnLast":0,"group":"everyone"},{"editRangeId":"1283593602","columnFirst":0,"columnLast":0,"group":"everyone"},{"name":"_GoBack","bookmarkType":1},{"editRangeId":"76489596","editableRangeStart":{"editRangeId":"76489596","columnFirst":0,"columnLast":0,"group":"everyone"}},{"editRangeId":"1283593602","editableRangeStart":{"editRangeId":"1283593602","columnFirst":0,"columnLast":0,"group":"everyone"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Top","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false}},{"paragraphFormat":{"styleName":"Normal"},"inlines":[]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Character","name":"Default Paragraph Font"},{"type":"Paragraph","name":"Normal (Web)","basedOn":"Normal","next":"Normal (Web)","characterFormat":{"fontSize":12.0,"fontFamily":"Times New Roman","fontSizeBidi":12.0,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"beforeSpacing":5.0,"afterSpacing":5.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"}}],"defaultTabWidth":36.0,"formatting":false,"protectionType":"ReadOnly","enforcement":true,"hashValue":"TCxiQ0q35iQIo6TqY+Nt/fkYblPiB9+D5pV5DdK2hIe+NqzJPJeZ0E2hpJSz3YL+VVPvrpQG8VnRLh8lyqlOIw==","saltValue":"UNBPXLxCmZ737H4/B2p0xg=="}';
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
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
        restrictJson = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Document open', () => {
console.log('Document open');
        expect(() => { editor.open(restrictJson) }).not.toThrowError();
    });
    it('insert text at non-editable region', () => {
console.log('insert text at non-editable region');
        let currentLineLength: number = editor.selection.start.currentWidget.children.length;
        editor.editor.handleTextInput('s');
        expect(editor.selection.start.currentWidget.children.length).toBe(currentLineLength);
    });
    it('insert text at editable region', () => {
console.log('insert text at editable region');
        editor.selection.select('0;0;0;0;0;6', '0;0;0;0;0;6');
        let currentLineLength: number = editor.selection.start.currentWidget.children.length;
        editor.editor.handleTextInput('s');
        expect(editor.selection.start.currentWidget.children.length).not.toBe(currentLineLength);
    });
});

//Character formatting for multiple inline validation

describe('Apply character format validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
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
    it('Bold property', () => {
console.log('Bold property');
        editor.editor.insertText('Sample hello world');
        editor.selection.handleControlLeftKey();
        editor.selection.handleControlLeftKey();
        editor.selection.selectCurrentWord();
        editor.selection.characterFormat.bold = true;
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
    it('Bold property for multiple different inline', () => {
console.log('Bold property for multiple different inline');
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleShiftEndKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.characterFormat.bold = true;
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
    it('Undo after bold', () => {
console.log('Undo after bold');
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.bold).toBeUndefined();
    });
    it('Redo after bold', () => {
console.log('Redo after bold');
        editor.editorHistory.redo();
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
});

/**
 * Paste match formatting validation
 */

describe('Paste formatting with underline validation', () => {
    let editor: DocumentEditor = undefined;
    let pasteString: string = '{"sections":[{"blocks":[{"characterFormat":{"bold":true,"italic":true,"underline":"Single","strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#ED7D31FF","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"BodyText","textAlignment":"Left","styleName":"Normal","bidi":false,"contextualSpacing":false},"inlines":[{"text":"Source format","characterFormat":{"bold":true,"italic":true,"underline":"Single","strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#ED7D31FF","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"}}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36,"footerDistance":36,"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#00000000","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left"}},{"type":"Character","name":"Default Paragraph Font"}],"defaultTabWidth":35.400001525878906,"formatting":false,"protectionType":"NoProtection","enforcement":false,"dontUseHTMLParagraphAutoSpacing":false}';
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
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
        pasteString = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Merge formatting', () => {
console.log('Merge formatting');
        editor.editor.insertText('Sample');
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.editor.paste(pasteString, 'MergeWithExistingFormatting');
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        expect(editor.selection.characterFormat.underline).toBe('Single');
    });
    it('undo after merge formatting', () => {
console.log('undo after merge formatting');
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.underline).toBe('None');
    });
    it('redo after merge formatting', () => {
console.log('redo after merge formatting');
        editor.editorHistory.redo();
        editor.selection.handleLeftKey();
        expect(editor.selection.characterFormat.underline).toBe('Single');
    });
    it('Alignment after para delete', () => {
console.log('Alignment after para delete');
        editor.openBlank();
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.editor.onApplyParagraphFormat('textAlignment', 'Center', false, true);
        editor.editor.insertText('check');
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).paragraphFormat.textAlignment).toBe('Center');
    });
    it('Replacing a paragraph with text validation', () => {
console.log('Replacing a paragraph with text validation');
        editor.openBlank();
        editor.editor.insertText('hello');
        editor.editor.handleEnterKey();
        editor.editor.insertText('syncfusion');
        editor.editor.handleEnterKey();
        editor.editor.insertText('world');
        editor.documentHelper.selection.handleHomeKey();
        editor.documentHelper.selection.handleUpKey();
        editor.documentHelper.selection.handleUpKey();
        editor.documentHelper.selection.handleControlShiftRightKey();
        editor.documentHelper.selection.handleControlShiftDownKey();
        editor.editor.insertText('check');
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
    });
    it('Comment mark is not removed after deleting the comment validation', () => {
console.log('Comment mark is not removed after deleting the comment validation');
        editor.openBlank();
        editor.enableTrackChanges = true;
        editor.editor.insertComment('hello');
        editor.selection.selectAll();
        editor.editor.deleteComment();
        expect(editor.documentHelper.comments.length).toBe(0);
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(0);
    });
});   
describe('Comment initial validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, enableComment: true });
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
    it('Comment initial construction validation', () => {
console.log('Comment initial construction validation');
        editor.openBlank();
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.editor.insertComment('check');
        editor.selection.selectAll();
        editor.editor.deleteComment();
        expect(editor.documentHelper.comments.length).toBe(0);
    }); 
});
describe('Paste in list validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, enableComment: true });
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
    it('Paste in list validation', () => {
        editor.openBlank();
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.selection.copy();
        editor.editor.onEnter();
        editor.editorModule.insertText('Syncfusion Software');
        editor.editor.applyNumbering('%1.', 'Number');
        editor.editor.paste();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).paragraphFormat.listFormat).not.toBe(undefined);
    }); 
});
describe('Paste contents in document with header distance greater than 36', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, enableComment: true });
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
    it('Paste contents in document with header distance greater than 36', () => {
        editor.openBlank();
        let sectoinFormat: WSectionFormat = new WSectionFormat();
        sectoinFormat.footerDistance = 50;
        sectoinFormat.headerDistance = 50;
        editor.editorModule.onApplySectionFormat(undefined, sectoinFormat);
        editor.editorModule.insertText('Adventure');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('world');
        editor.editorModule.onEnter();
        editor.enableLocalPaste = true;
        editor.selection.selectAll();
        editor.selection.copy();
        editor.selection.selectAll();
        editor.editorModule.paste();
        expect(editor.selection.start.paragraph.bodyWidget.sectionFormat.footerDistance).toBe(50);
        expect(editor.selection.start.paragraph.bodyWidget.sectionFormat.headerDistance).toBe(50);
    }); 
});
describe('Bookmark delete validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, enableComment: true });
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
    it('Bookmark delete validation', function () {
      editor.openBlank();
      editor.editor.insertText('check');
      editor.editor.insertText('Bookmark');
      editor.editor.insertText('content');
      editor.selection.handleHomeKey();
      editor.selection.handleControlRightKey();
      editor.selection.handleControlShiftRightKey();
      editor.editor.insertBookmark('check');
      editor.selection.handleHomeKey();
      editor.selection.handleControlRightKey();
      editor.selection.handleControlRightKey();
      editor.editor.onBackSpace();
      expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as any).childWidgets[0] as LineWidget).children[1].line.indexInOwner).toBe((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as any).childWidgets[0] as LineWidget).children[1] as BookmarkElementBox).reference.line.indexInOwner);
    });
});
describe('Inserting a same bookmark multiple times validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, enableComment: true });
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
    it('Inserting a same bookmark multiple times validation', function () {
      editor.openBlank();
      editor.editor.insertText('check');
      editor.editor.onEnter();
      editor.editor.insertText('Bookmark');
      editor.editor.onEnter();
      editor.editor.insertText('content');
      editor.editor.onEnter();
      editor.editor.insertText('editor');
      editor.selection.handleHomeKey();
      editor.selection.handleUpKey();
      editor.selection.handleUpKey();
      editor.selection.handleUpKey();
      editor.selection.handleControlShiftRightKey();
      editor.selection.handleControlShiftDownKey();
      editor.selection.handleControlShiftDownKey();
      editor.selection.handleControlShiftDownKey();
      editor.editor.insertBookmark('check');
      editor.selection.handleHomeKey();
      editor.selection.handleUpKey();
      editor.selection.handleControlRightKey();
      editor.selection.handleControlRightKey();
      editor.editor.insertBookmark('check1');
      editor.selection.handleHomeKey();
      editor.selection.handleUpKey();
      editor.selection.handleUpKey();
      editor.editor.insertBookmark('check');
      expect(editor.documentHelper.bookmarks.length).toBe(2);
    });
});
let mergetable: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":null},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":null},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":null},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":2}],"rowFormat":{"height":0,"heightType":"Auto","borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":null},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":null},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":312,"cellWidth":312,"columnSpan":2,"rowSpan":2},"columnIndex":1}],"rowFormat":{"height":0,"heightType":"Auto","borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":null},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":0}],"rowFormat":{"height":0,"heightType":"Auto","borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":null},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":null},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":null},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":2}],"rowFormat":{"height":0,"heightType":"Auto","borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0}}],"grid":[156,156,156],"tableFormat":{"borders":{"top":{"lineStyle":"Single","lineWidth":0.5},"left":{"lineStyle":"Single","lineWidth":0.5},"right":{"lineStyle":"Single","lineWidth":0.5},"bottom":{"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{},"diagonalUp":{},"horizontal":{"lineStyle":"Single","lineWidth":0.5},"vertical":{"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":0,"topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto"},"columnCount":3},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":null},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":null},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":null},"inlines":[]}]},"evenHeader":{},"evenFooter":{},"firstPageHeader":{},"firstPageFooter":{}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":null},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{"fontSize":null}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontSize":null,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontSize":null,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontSize":null,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontSize":null,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontSize":null,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontSize":null,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[]};
describe('Apply table border via pane validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, enableComment: true });
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
    it('Apply table border via pane validation', function () {
        editor.open(JSON.stringify(mergetable));
        editor.selection.handleControlShiftDownKey();
        editor.selection.handleControlShiftDownKey();
        editor.selection.handleControlShiftDownKey();
        editor.selection.handleControlShiftDownKey();
        editor.selection.handleControlShiftDownKey();
        editor.selection.handleControlShiftDownKey();
        let settings: BorderSettings = { type: 'AllBorders', borderColor: 'red', lineWidth: 1, borderStyle: 'Single' };
        expect(() => { editor.editor.applyBorders(settings) }).toThrowError();
    });
});
let table: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":1008,"leftMargin":36,"rightMargin":36,"topMargin":36,"bottomMargin":36,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Arial"},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{},"tabs":[{"position":58.849998474121094,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"text":"G."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":54.29999923706055,"preferredWidthType":"Point","cellWidth":54.29999964980949,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{},"tabs":[{"position":58.849998474121094,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontSize":8,"fontFamily":"Arial","highlightColor":"Yellow","fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":8,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontSize":8,"fontFamily":"Arial","highlightColor":"Yellow","fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":8,"fontFamilyBidi":"Arial"},"text":"Base Rent:"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":105.55000305175781,"preferredWidthType":"Point","cellWidth":105.55000385407186,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"empty","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"empty","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#0070C0FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#0070C0FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"text":"From"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":18,"preferredWidthType":"Point","cellWidth":110.40000086654479,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#0070C0FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#0070C0FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"text":"To"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":18,"preferredWidthType":"Point","cellWidth":110.40000086654479,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#0070C0FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#0070C0FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"text":"Base Rent ($/MO)"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":18,"preferredWidthType":"Point","cellWidth":110.40000086654479,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#0070C0FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#0070C0FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"text":"October 01, 2020"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":18,"preferredWidthType":"Point","cellWidth":110.40000086654479,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#0070C0FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#0070C0FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"text":"September 30, 2021"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":18,"preferredWidthType":"Point","cellWidth":110.40000086654479,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#0070C0FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#0070C0FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"text":"$5,212.80"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":18,"preferredWidthType":"Point","cellWidth":110.40000086654479,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#0070C0FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#0070C0FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"text":"October 01, 2021"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":18,"preferredWidthType":"Point","cellWidth":110.40000086654479,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#0070C0FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#0070C0FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"text":"September 30, 2022"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":18,"preferredWidthType":"Point","cellWidth":110.40000086654479,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#0070C0FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#0070C0FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"text":"$5,369.18"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":18,"preferredWidthType":"Point","cellWidth":110.40000086654479,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0}}],"grid":[110.40000086654479,110.40000086654479,110.40000086654479],"tableFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidth":100,"preferredWidthType":"Percent","bidi":false,"allowAutoFit":false},"description":null,"title":null,"columnCount":3},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":342,"preferredWidthType":"Point","cellWidth":342.0000025996343,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2}],"rowFormat":{"height":12.399999618530273,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0,"leftIndent":21.05}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{},"tabs":[{"position":58.849998474121094,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontSize":3,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":3,"fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":54.29999923706055,"preferredWidthType":"Point","cellWidth":54.29999964980949,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{},"tabs":[{"position":58.849998474121094,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontSize":3,"fontFamily":"Arial","highlightColor":"Yellow","fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":3,"fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":105.55000305175781,"preferredWidthType":"Point","cellWidth":105.55000385407186,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{},"tabs":[{"position":58.849998474121094,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontSize":3,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":3,"fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":342,"preferredWidthType":"Point","cellWidth":342.0000025996343,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2}],"rowFormat":{"height":7.650000095367432,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0,"leftIndent":21.05}}],"grid":[54.29999964980949,105.55000385407186,342.0000025996343],"tableFormat":{"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"shading":{},"leftIndent":21.049999237060547,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidth":501.8500061035156,"preferredWidthType":"Point","bidi":false,"allowAutoFit":false},"description":null,"title":null,"columnCount":3},{"paragraphFormat":{"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"beforeSpacing":7,"lineSpacing":5,"lineSpacingType":"Exactly","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":5,"fontColor":"empty","fontSizeBidi":5},"inlines":[]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"Normal","listFormat":{},"tabs":[{"position":-36,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"inlines":[]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"Normal","listFormat":{},"tabs":[{"position":-36,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"inlines":[]}]},"evenHeader":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenFooter":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageHeader":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontColor":"empty"},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":1,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"bold":true,"fontSize":8,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontSizeBidi":8,"fontFamilyBidi":"Arial"},"basedOn":"Normal","link":"Heading 1 Char","next":"Heading 1"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"bold":true,"fontSize":8,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontSizeBidi":8,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{"fontColor":"empty"}},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"afterSpacing":0,"outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2E74B5FF","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2E74B5FF","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"leftIndent":36,"listFormat":{},"contextualSpacing":true},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","next":"List Paragraph"},{"name":"Body Text","type":"Paragraph","paragraphFormat":{"leftIndent":6,"beforeSpacing":2.799999952316284,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"empty","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"basedOn":"Normal","link":"Body Text Char","next":"Body Text"},{"name":"Body Text Char","type":"Character","characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"empty","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Table Paragraph","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","next":"Table Paragraph"},{"name":"Header","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{"fontColor":"empty"},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{"fontColor":"empty"},"basedOn":"Default Paragraph Font"},{"name":"zzmpTrailerItem","type":"Character","characterFormat":{"fontSize":8,"fontFamily":"Calibri","strikethrough":"None","baselineAlignment":"Normal","fontColor":"#00000000","fontSizeBidi":8,"fontFamilyBidi":"Calibri"},"basedOn":"Default Paragraph Font"},{"name":"Balloon Text","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Tahoma","fontColor":"empty","fontSizeBidi":8,"fontFamilyBidi":"Tahoma"},"basedOn":"Normal","link":"Balloon Text Char","next":"Balloon Text"},{"name":"Balloon Text Char","type":"Character","characterFormat":{"fontSize":8,"fontFamily":"Tahoma","fontColor":"empty","fontSizeBidi":8,"fontFamilyBidi":"Tahoma"},"basedOn":"Default Paragraph Font"},{"name":"Body Text Indent","type":"Paragraph","paragraphFormat":{"leftIndent":18,"afterSpacing":6,"listFormat":{}},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","link":"Body Text Indent Char","next":"Body Text Indent"},{"name":"Body Text Indent Char","type":"Character","characterFormat":{"fontColor":"empty"},"basedOn":"Default Paragraph Font"},{"name":"Date","type":"Paragraph","paragraphFormat":{"leftIndent":216,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Date Char","next":"Normal"},{"name":"Date Char","type":"Character","characterFormat":{"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Inside Address","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"Inside Address"},{"name":"Subject Line","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"Subject Line"},{"name":"Signature","type":"Paragraph","paragraphFormat":{"leftIndent":216,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Signature Char","next":"Signature"},{"name":"Signature Char","type":"Character","characterFormat":{"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Signature Company","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman"},"basedOn":"Signature","next":"Signature Company"},{"name":"DeltaView Insertion","type":"Character","characterFormat":{"underline":"Double","fontColor":"#0000FFFF"},"basedOn":"Default Paragraph Font"},{"name":"No Spacing","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontColor":"empty"},"next":"No Spacing"},{"name":"Hyperlink","type":"Character","characterFormat":{"underline":"Single","fontColor":"#0563C1FF"},"basedOn":"Default Paragraph Font"},{"name":"Unresolved Mention1","type":"Character","characterFormat":{"fontColor":"#605E5CFF"},"basedOn":"Default Paragraph Font"},{"name":"paragraph","type":"Paragraph","paragraphFormat":{"beforeSpacing":5,"afterSpacing":5,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"paragraph"},{"name":"normaltextrun","type":"Character","characterFormat":{"fontColor":"empty"},"basedOn":"Default Paragraph Font"},{"name":"eop","type":"Character","characterFormat":{"fontColor":"empty"},"basedOn":"Default Paragraph Font"},{"name":"Date_0","type":"Paragraph","paragraphFormat":{"leftIndent":216,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Date Char_0","next":"Normal_0"},{"name":"Date Char_0","type":"Character","characterFormat":{"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Normal_0","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontColor":"empty","fontFamilyBidi":"Calibri"},"next":"Normal_0"},{"name":"Inside Address_0","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"Inside Address_0"},{"name":"Body Text_0","type":"Paragraph","paragraphFormat":{"leftIndent":6,"beforeSpacing":2.799999952316284,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"empty","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"basedOn":"Normal","link":"Body Text Char_0","next":"Body Text_0"},{"name":"Body Text Char_0","type":"Character","characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"empty","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Signature_0","type":"Paragraph","paragraphFormat":{"leftIndent":216,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Signature Char_0","next":"Signature_0"},{"name":"Signature Char_0","type":"Character","characterFormat":{"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Signature Company_0","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman"},"basedOn":"Signature","next":"Signature Company_0"},{"name":"Header_0","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontSize":12,"fontFamily":"Courier New","fontColor":"empty","fontSizeBidi":12,"fontFamilyBidi":"Courier New"},"basedOn":"Normal","link":"Header Char_0","next":"Header_0"},{"name":"Header Char_0","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Courier New","fontColor":"empty","fontSizeBidi":12,"fontFamilyBidi":"Courier New"},"basedOn":"Default Paragraph Font"},{"name":"List Paragraph_0","type":"Paragraph","paragraphFormat":{"leftIndent":36,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":true},"characterFormat":{"fontSize":12,"fontFamily":"Arial Narrow","fontColor":"empty","fontSizeBidi":12,"fontFamilyBidi":"Arial Narrow"},"basedOn":"Normal","next":"List Paragraph_0"},{"name":"MsoNormal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","next":"MsoNormal"},{"name":"MsoListParagraph0","type":"Character","characterFormat":{"fontColor":"empty"},"basedOn":"Default Paragraph Font"},{"name":"MsoNormal0","type":"Character","characterFormat":{"fontColor":"empty"},"basedOn":"Default Paragraph Font"},{"name":"MsoBodyText","type":"Character","characterFormat":{"fontColor":"empty"},"basedOn":"Default Paragraph Font"},{"name":"MsoBodyText Paragraph","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"basedOn":"Body Text","next":"MsoBodyText Paragraph"},{"name":"NonTocText","type":"Character","characterFormat":{"fontColor":"empty"},"basedOn":"Default Paragraph Font"},{"name":"VEItalic","type":"Character","characterFormat":{"fontColor":"empty"},"basedOn":"Default Paragraph Font"},{"name":"VEBoldUnderline","type":"Character","characterFormat":{"fontColor":"empty"},"basedOn":"Default Paragraph Font"},{"name":"MsoBodyTextParagraph","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"basedOn":"Body Text","next":"MsoBodyTextParagraph"},{"name":"MsoBodyTextParagraphParagraph","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"basedOn":"Body Text","next":"MsoBodyTextParagraphParagraph"},{"name":"MsoBodyTextParagraph Character","type":"Character","characterFormat":{"fontColor":"empty"},"basedOn":"Default Paragraph Font"},{"name":"MsoListParagraph","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","next":"MsoListParagraph"},{"name":"MsoNormalCharacter","type":"Character","characterFormat":{"fontColor":"empty"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Nested table with preferred width type percentage', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, enableComment: true });
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
    it('Nested table with preferred width type percentage', function () {
        editor.open(JSON.stringify(table));
        let nestedTable: TableWidget = ((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[2] as TableCellWidget).childWidgets[2] as TableWidget);
        expect(nestedTable.tableFormat.preferredWidthType).toBe('Percent');
        expect(((nestedTable.childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.cellWidth).toBeGreaterThan(((nestedTable.childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.preferredWidth);
        expect(((nestedTable.childWidgets[0] as TableRowWidget).childWidgets[1] as TableCellWidget).cellFormat.cellWidth).toBeGreaterThan(((nestedTable.childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.preferredWidth);
        expect(((nestedTable.childWidgets[0] as TableRowWidget).childWidgets[2] as TableCellWidget).cellFormat.cellWidth).toBeGreaterThan(((nestedTable.childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.preferredWidth);
    });
});
let tableclip : any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"u"},{"characterFormat":{"fontColor":"empty"},"text":"f"},{"characterFormat":{"fontColor":"empty"},"text":"g"},{"characterFormat":{"fontColor":"empty"},"text":"h"},{"characterFormat":{"fontColor":"empty"},"text":"j"},{"characterFormat":{"fontColor":"empty"},"text":"f"},{"characterFormat":{"fontColor":"empty"},"text":"g"},{"characterFormat":{"fontColor":"empty"},"text":"j"},{"characterFormat":{"fontColor":"empty"},"text":"f"},{"characterFormat":{"fontColor":"empty"},"text":"h"},{"characterFormat":{"fontColor":"empty"},"text":"j"},{"characterFormat":{"fontColor":"empty"},"text":"f"},{"characterFormat":{"fontColor":"empty"},"text":"h"},{"characterFormat":{"fontColor":"empty"},"text":"j"},{"characterFormat":{"fontColor":"empty"},"text":"f"},{"characterFormat":{"fontColor":"empty"},"text":"h"},{"characterFormat":{"fontColor":"empty"},"text":"j"},{"characterFormat":{"fontColor":"empty"},"text":"f"},{"characterFormat":{"fontColor":"empty"},"text":"h"},{"characterFormat":{"fontColor":"empty"},"text":"t"},{"characterFormat":{"fontColor":"empty"},"text":"u"},{"characterFormat":{"fontColor":"empty"},"text":"u"},{"characterFormat":{"fontColor":"empty"},"text":"f"},{"characterFormat":{"fontColor":"empty"},"text":"g"},{"characterFormat":{"fontColor":"empty"},"text":"h"},{"characterFormat":{"fontColor":"empty"},"text":"j"},{"characterFormat":{"fontColor":"empty"},"text":"f"},{"characterFormat":{"fontColor":"empty"},"text":"g"},{"characterFormat":{"fontColor":"empty"},"text":"h"},{"characterFormat":{"fontColor":"empty"},"text":"j"},{"characterFormat":{"fontColor":"empty"},"text":"f"},{"characterFormat":{"fontColor":"empty"},"text":"g"},{"characterFormat":{"fontColor":"empty"},"text":"h"},{"characterFormat":{"fontColor":"empty"},"text":"j"},{"characterFormat":{"fontColor":"empty"},"text":"f"},{"characterFormat":{"fontColor":"empty"},"text":"g"},{"characterFormat":{"fontColor":"empty"},"text":"h"},{"characterFormat":{"fontColor":"empty"},"text":"j"},{"characterFormat":{"fontColor":"empty"},"text":"f"},{"characterFormat":{"fontColor":"empty"},"text":"g"},{"characterFormat":{"fontColor":"empty"},"text":"h"},{"characterFormat":{"fontColor":"empty"},"text":"j"},{"characterFormat":{"fontColor":"empty"},"text":"f"},{"characterFormat":{"fontColor":"empty"},"text":"g"},{"characterFormat":{"fontColor":"empty"},"text":"h"},{"characterFormat":{"fontColor":"empty"},"text":"t"},{"characterFormat":{"fontColor":"empty"},"text":"u"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":13.899999618530273,"preferredWidthType":"Point","cellWidth":13.899999618530273,"columnSpan":1,"rowSpan":4,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":116.8499984741211,"preferredWidthType":"Point","cellWidth":116.8499984741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":58.45000076293945,"preferredWidthType":"Point","cellWidth":58.45000076293945,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":58.45000076293945,"preferredWidthType":"Point","cellWidth":58.45000076293945,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":3},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":116.9000015258789,"preferredWidthType":"Point","cellWidth":116.9000015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":4}],"rowFormat":{"height":1,"allowBreakAcrossPages":false,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":116.8499984741211,"preferredWidthType":"Point","cellWidth":116.8499984741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":116.9000015258789,"preferredWidthType":"Point","cellWidth":116.9000015258789,"columnSpan":2,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":116.9000015258789,"preferredWidthType":"Point","cellWidth":116.9000015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":4}],"rowFormat":{"height":10.199999809265137,"allowBreakAcrossPages":true,"heightType":"Exactly","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":116.8499984741211,"preferredWidthType":"Point","cellWidth":116.8499984741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":116.9000015258789,"preferredWidthType":"Point","cellWidth":116.9000015258789,"columnSpan":2,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":116.9000015258789,"preferredWidthType":"Point","cellWidth":116.9000015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":4}],"rowFormat":{"height":10.199999809265137,"allowBreakAcrossPages":true,"heightType":"Exactly","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":116.8499984741211,"preferredWidthType":"Point","cellWidth":116.8499984741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":116.9000015258789,"preferredWidthType":"Point","cellWidth":116.9000015258789,"columnSpan":2,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":116.9000015258789,"preferredWidthType":"Point","cellWidth":116.9000015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":4}],"rowFormat":{"height":25.25,"allowBreakAcrossPages":true,"heightType":"Exactly","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}}],"grid":[13.899999618530273,116.8499984741211,58.45000076293945,58.45000076293945,116.9000015258789],"tableFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":false},"description":null,"title":null,"columnCount":5},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenHeader":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenFooter":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageHeader":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontColor":"empty"},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{"fontColor":"empty"}},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Table clipping if the last row height type is exactly', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, enableComment: true });
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
    it('Table clipping if the last row height type is exactly', function () {
        editor.open(JSON.stringify(tableclip));
        //check whether the table was clipped if not the table will split to 2nd page
        expect(editor.documentHelper.pages.length).toBe(1);
        
    });
});
describe('Paste optionv validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, enableComment: true });
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
    it('Paste option validation', function () {
        editor.openBlank();
        editor.editor.insertText('Hello');
        editor.selection.selectAll();
        editor.selection.copy();
        editor.editor.paste();
        editor.editor.applyPasteOptions('KeepSourceFormatting');
        expect(editor.editor.previousParaFormat).toBe(undefined);
        
    });
});
describe('Paste option rearrange validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, enableComment: true, enableRtl: true });
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
    it('Paste option rearrange validation', function () {
        editor.openBlank();
        editor.editor.insertText('כתובת');
        editor.editor.insertText(':');
        editor.editor.insertText('  ');
        editor.editor.insertText('כתובת');
        editor.selection.selectAll();
        editor.selection.copy();
        editor.editor.paste();
        editor.editor.applyPasteOptions('KeepTextOnly');
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as TextElementBox).text).toBe(':  ');   
    });
});
let rtlDel: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":63.79999923706055,"rightMargin":37.900001525878906,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":0,"footerDistance":8.5,"bidi":true},"blocks":[{"paragraphFormat":{"textAlignment":"Right","styleName":"List Paragraph","listFormat":{"listId":8,"listLevelNumber":0},"bidi":true},"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"empty","bidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"inlines":[{"characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Calibri","fontColor":"empty","bidi":true,"boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"ניהול מו"},{"characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Calibri","fontColor":"empty","bidi":true,"boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"\""},{"characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Calibri","fontColor":"empty","bidi":true,"boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"מ"},{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"empty","bidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":" "},{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"empty","bidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"עם ספקים בארץ ובחול"},{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"empty","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":" "}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8.5,"fontColor":"empty","fontSizeBidi":8.5},"inlines":[]}]},"evenHeader":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenFooter":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageHeader":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Times New Roman","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":3,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{"fontColor":"empty"}},{"name":"apple-converted-space","type":"Character","characterFormat":{"fontColor":"empty"},"basedOn":"Default Paragraph Font"},{"name":"Header","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":207.64999389648438,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":415.29998779296875,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":207.64999389648438,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":415.29998779296875,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"basedOn":"Default Paragraph Font"},{"name":"Hyperlink","type":"Character","characterFormat":{"underline":"Single","fontColor":"#0000FFFF"},"basedOn":"Default Paragraph Font"},{"name":"Unresolved Mention1","type":"Character","characterFormat":{"fontColor":"#808080FF"},"basedOn":"Default Paragraph Font"},{"name":"FollowedHyperlink","type":"Character","characterFormat":{"underline":"Single","fontColor":"#800080FF"},"basedOn":"Default Paragraph Font"},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"leftIndent":36,"listFormat":{},"contextualSpacing":true},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","next":"List Paragraph"},{"name":"annotation reference","type":"Character","characterFormat":{"fontSize":8,"fontColor":"empty","fontSizeBidi":8},"basedOn":"Default Paragraph Font"},{"name":"annotation text","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontColor":"empty","fontSizeBidi":10},"basedOn":"Normal","link":"Comment Text Char","next":"annotation text"},{"name":"Comment Text Char","type":"Character","characterFormat":{"fontColor":"empty"},"basedOn":"Default Paragraph Font"},{"name":"annotation subject","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"basedOn":"annotation text","link":"Comment Subject Char","next":"annotation text"},{"name":"Comment Subject Char","type":"Character","characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"basedOn":"Comment Text Char"},{"name":"Balloon Text","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":9,"fontFamily":"Tahoma","fontColor":"empty","fontSizeBidi":9,"fontFamilyBidi":"Tahoma"},"basedOn":"Normal","link":"Balloon Text Char","next":"Balloon Text"},{"name":"Balloon Text Char","type":"Character","characterFormat":{"fontSize":9,"fontFamily":"Tahoma","fontColor":"empty","fontSizeBidi":9,"fontFamilyBidi":"Tahoma"},"basedOn":"Default Paragraph Font"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[{"abstractListId":8,"levelOverrides":[],"listId":8}],"abstractLists":[{"abstractListId":8,"levels":[{"characterFormat":{"fontFamily":"Symbol","fontColor":"empty","fontFamilyBidi":"Symbol"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontColor":"empty","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings","fontColor":"empty","fontFamilyBidi":"Wingdings"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Symbol","fontColor":"empty","fontFamilyBidi":"Symbol"},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontColor":"empty","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings","fontColor":"empty","fontFamilyBidi":"Wingdings"},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Symbol","fontColor":"empty","fontFamilyBidi":"Symbol"},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontColor":"empty","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings","fontColor":"empty","fontFamilyBidi":"Wingdings"},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0}]}],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8.5,"fontColor":"empty","fontSizeBidi":8.5},"inlines":[{"characterFormat":{"fontSize":8.5,"fontColor":"empty","fontSizeBidi":8.5},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8.5,"fontColor":"empty","fontSizeBidi":8.5},"inlines":[{"characterFormat":{"fontSize":8.5,"fontColor":"empty","fontSizeBidi":8.5},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8.5,"fontColor":"empty","fontSizeBidi":8.5},"inlines":[{"characterFormat":{"fontSize":8.5,"fontColor":"empty","fontSizeBidi":8.5},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8.5,"fontColor":"empty","fontSizeBidi":8.5},"inlines":[{"characterFormat":{"fontSize":8.5,"fontColor":"empty","fontSizeBidi":8.5},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('RTL delete validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, enableComment: true });
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
    it('RTL delete validation', function () {
        editor.open(JSON.stringify(rtlDel));
        editor.selection.select('0;0;30', '0;0;0');
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets.length).toBe(1);                
    });
});
describe('undo redo validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, enableEditorHistory: true, enableComment: true });
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
    it('undo redo validation', function () {
        editor.openBlank();
        editor.editor.insertText('h');
        editor.editor.insertText('e');
        editor.editor.insertText('l');
        editor.editor.insertText('l');
        editor.editor.insertText('0');
        editor.editorHistory.undo();
        editor.editorHistory.redo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets.length).toBe(1);        
    });
});
let contentControl: any = {"sections":[{"sectionFormat":{"pageWidth":595.2999877929688,"pageHeight":841.9000244140625,"leftMargin":36,"rightMargin":36,"topMargin":86.44999694824219,"bottomMargin":86.44999694824219,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":35.45000076293945,"footerDistance":35.45000076293945,"bidi":false},"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Title","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":3.4200000762939453,"preferredWidthType":"Percent","cellWidth":17.899999618530273,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Title","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Accordo di pagamento"}]},{"paragraphFormat":{"styleName":"Title","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"del paziente"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#1F497DFF","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":45.13999938964844,"preferredWidthType":"Percent","cellWidth":236.1999969482422,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1,"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","appearance":"Hidden","type":"RichText","hasPlaceHolderText":true,"multiline":false,"isTemporary":true,"characterFormat":{},"contentControlListItems":[]}},{"blocks":[{"paragraphFormat":{"styleName":"Title","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":48.099998474121094,"preferredWidthType":"Percent","cellWidth":251.6999969482422,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"styleName":"Title","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":3.3399999141693115,"preferredWidthType":"Percent","cellWidth":17.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":3}],"rowFormat":{"height":49.150001525878906,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}}],"grid":[17.8968603657907,236.21761636445663,251.7072915445464,17.47821951817508],"tableFormat":{"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidth":100,"preferredWidthType":"Percent","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":4},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"La ringraziamo per averci concesso l'opportunità di aiutarLa a raggiungere i Suoi obiettivi sanitari. "},{"characterFormat":{},"text":"Durante la discussione riguardante la raccomandazione terapeutica e le nostre politiche finanziarie "},{"characterFormat":{},"text":"scritte, sono state prese le seguenti disposizioni finanziarie:"}]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","appearance":"Hidden","type":"RichText","hasPlaceHolderText":true,"multiline":false,"isTemporary":true,"characterFormat":{},"contentControlListItems":[]}},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","appearance":"Hidden","type":"RichText","hasPlaceHolderText":true,"multiline":false,"isTemporary":true,"characterFormat":{},"contentControlListItems":[]}},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Il costo del trattamento con il dottor ___________________ è di ____________ $. Si stima che la "},{"characterFormat":{},"text":"copertura assicurativa copra ____________ $ e che la responsabilità del paziente per il trattamento sia "},{"characterFormat":{},"text":"di __________ $. Una volta iniziato il trattamento, potrebbero essere necessari cambiamenti nel piano di "},{"characterFormat":{},"text":"trattamento previsto, a seconda delle condizioni esistenti riscontrate. Provvederemo a informarLa nel "},{"characterFormat":{},"text":"caso in cui ciò si verifiche e Le verrà data la possibilità di continuare il trattamento o di apporvi "},{"characterFormat":{},"text":"modifiche. "}]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","appearance":"Hidden","type":"RichText","hasPlaceHolderText":true,"multiline":false,"isTemporary":true,"characterFormat":{},"contentControlListItems":[]}},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","appearance":"Hidden","type":"RichText","hasPlaceHolderText":true,"multiline":false,"isTemporary":true,"characterFormat":{},"contentControlListItems":[]}},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Il sottoscritto _________ (iniziali paziente) ha discusso le opzioni di pagamento e concordato un piano di "},{"characterFormat":{},"text":"pagamento con la compagnia assicurativa e con il fornitore sottoscritto. Nel caso in cui l'assicurazione "},{"characterFormat":{},"text":"non rimborsi l'intero importo annotato sul Piano di trattamento, il sottoscritto comprende che è "},{"characterFormat":{},"text":"responsabile per il pagamento dei servizi resi, nonché responsabile per il pagamento di eventuali "},{"characterFormat":{},"text":"co-payment e franchigie non coperti dall'assicurazione."}]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","appearance":"Hidden","type":"RichText","hasPlaceHolderText":true,"multiline":false,"isTemporary":true,"characterFormat":{},"contentControlListItems":[]}},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","appearance":"Hidden","type":"RichText","hasPlaceHolderText":true,"multiline":false,"isTemporary":true,"characterFormat":{},"contentControlListItems":[]}},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"La ricezione del pagamento prima del completamento del trattamento è parte delle politiche di tale "},{"characterFormat":{},"text":"trattamento. In caso di interruzione del trattamento prima del completamento dello stesso, il rimborso "},{"characterFormat":{},"text":"sarà determinato al momento della revisione del caso. Il paziente ha accettato di pagare la sua parte "},{"characterFormat":{},"text":"della quota di trattamento nel modo seguente:"}]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","appearance":"Hidden","type":"RichText","hasPlaceHolderText":true,"multiline":false,"isTemporary":true,"characterFormat":{},"contentControlListItems":[]}},{"blocks":[{"paragraphFormat":{"styleName":"List Bullet","listFormat":{}},"characterFormat":{"fontColor":"#00000000"},"inlines":[{"characterFormat":{"fontColor":"#00000000","styleName":"Placeholder Text"},"text":"Pagamento integrale dell'importo di _____________ $; pagato tramite: ______________________"}]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","appearance":"Hidden","type":"RichText","hasPlaceHolderText":true,"multiline":false,"isTemporary":true,"characterFormat":{},"contentControlListItems":[]}},{"blocks":[{"paragraphFormat":{"styleName":"List Bullet","listFormat":{}},"characterFormat":{"fontColor":"#00000000"},"inlines":[{"characterFormat":{"fontColor":"#00000000","styleName":"Placeholder Text"},"text":"Deposito richiesto: ____________________ $; deposito pagato tramite: "},{"characterFormat":{"fontColor":"#00000000","styleName":"Placeholder Text"},"text":"_________________________"}]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","appearance":"Hidden","type":"RichText","hasPlaceHolderText":true,"multiline":false,"isTemporary":true,"characterFormat":{},"contentControlListItems":[]}},{"blocks":[{"paragraphFormat":{"styleName":"List Bullet","listFormat":{}},"characterFormat":{"fontColor":"#00000000"},"inlines":[{"characterFormat":{"fontColor":"#00000000","styleName":"Placeholder Text"},"text":"Costo restante del trattamento: _________________ $; pagamento da effettuare entro il: "},{"characterFormat":{"fontColor":"#00000000","styleName":"Placeholder Text"},"text":"__________tramite __________"}]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","appearance":"Hidden","type":"RichText","hasPlaceHolderText":true,"multiline":false,"isTemporary":true,"characterFormat":{},"contentControlListItems":[]}},{"blocks":[{"paragraphFormat":{"styleName":"List Bullet","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"fontColor":"#00000000","styleName":"Placeholder Text"},"text":"___ parità retributiva di _____________________ $"}]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","appearance":"Hidden","type":"RichText","hasPlaceHolderText":true,"multiline":false,"isTemporary":true,"characterFormat":{},"contentControlListItems":[]}},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"In caso di domande sul piano di trattamento o sulle opzioni di pagamento disponibili, rivolgersi al "},{"characterFormat":{},"text":"richiedente. Il nostro compito è quello di fornire l'assistenza sanitaria che il paziente desidera o "},{"characterFormat":{},"text":"necessita."}]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","appearance":"Hidden","type":"RichText","hasPlaceHolderText":true,"multiline":false,"isTemporary":true,"characterFormat":{},"contentControlListItems":[]}},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"color":"#1F497DFF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":1.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":308.1000061035156,"preferredWidthType":"Point","cellWidth":304.6690673828125,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Bottom"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":21.700000762939453,"preferredWidthType":"Point","cellWidth":21.71099090576172,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Bottom"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"color":"#1F497DFF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":1.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":183.1999969482422,"preferredWidthType":"Point","cellWidth":181.55496215820312,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Bottom"},"columnIndex":2}],"rowFormat":{"height":28.799999237060547,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Testo blu","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Firma paziente, genitore o tutore"}]}],"cellFormat":{"borders":{"top":{"color":"#1F497DFF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":1.5},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":308.1000061035156,"preferredWidthType":"Point","cellWidth":304.6690673828125,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Testo blu","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":21.700000762939453,"preferredWidthType":"Point","cellWidth":21.71099090576172,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Testo blu","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"fontColor":"#1F497DFF","styleName":"Placeholder Text"},"text":"Data"}]}],"cellFormat":{"borders":{"top":{"color":"#1F497DFF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":1.5},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":183.1999969482422,"preferredWidthType":"Point","cellWidth":181.55496215820312,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2,"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","appearance":"Hidden","type":"RichText","hasPlaceHolderText":true,"multiline":false,"isTemporary":true,"characterFormat":{},"contentControlListItems":[]}}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Testo blu","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"color":"#1F497DFF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":1.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":513,"preferredWidthType":"Point","cellWidth":507.9350280761719,"columnSpan":3,"rowSpan":1,"verticalAlignment":"Bottom"},"columnIndex":0}],"rowFormat":{"height":28.799999237060547,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Testo blu","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Nome paziente (in stampatello)"}]}],"cellFormat":{"borders":{"top":{"color":"#1F497DFF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":1.5},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":513,"preferredWidthType":"Point","cellWidth":507.9350280761719,"columnSpan":3,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0,"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","appearance":"Hidden","type":"RichText","hasPlaceHolderText":true,"multiline":false,"isTemporary":true,"characterFormat":{},"contentControlListItems":[]}}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}}],"grid":[298.571718951995,21.02890749983827,177.53436195148706],"tableFormat":{"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"shading":{},"leftIndent":0,"tableAlignment":"Center","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidth":95,"preferredWidthType":"Percent","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":3},{"paragraphFormat":{"leftIndent":0,"afterSpacing":0,"styleName":"Testo blu","listFormat":{}},"characterFormat":{"fontSize":6,"fontSizeBidi":6},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"textAlignment":"Right","styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"imageString":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAhcAAACDCAYAAAA+sTk0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAEKXaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzA2NyA3OS4xNTc3NDcsIDIwMTUvMDMvMzAtMjM6NDA6NDIgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiCiAgICAgICAgICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTktMDUtMjNUMTA6NDk6MDMrMDg6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE5LTA1LTI5VDEzOjU3OjI1KzA4OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxOS0wNS0yOVQxMzo1NzoyNSswODowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6Y2FjOTRlY2ItMDM5MS1mYjRmLTk1OWMtYmMzNWY0NTMzNjVlPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6OWViMGJiMzktODFkNi0xMWU5LThhNzQtZTgxNDgzYmMwMDNmPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6Njk1ZDg0MDUtMjNlMS02MDQwLWI2NTItODI2MjNlN2QwM2E0PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjY5NWQ4NDA1LTIzZTEtNjA0MC1iNjUyLTgyNjIzZTdkMDNhNDwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxOS0wNS0yM1QxMDo0OTowMyswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDowMmVhZmM2Mi1jNGZmLTYxNGMtOTM2ZS1lOWM5ZTRmMDA3N2U8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTktMDUtMjNUMTM6MzM6MTArMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MjBjNDE1NGUtMjc2OS05YTQxLTk4YTAtNjA1YjQ4ZmQ4NWI4PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE5LTA1LTI5VDEzOjU3OjI1KzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jb252ZXJ0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnBhcmFtZXRlcnM+ZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZzwvc3RFdnQ6cGFyYW1ldGVycz4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmRlcml2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnBhcmFtZXRlcnM+Y29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmc8L3N0RXZ0OnBhcmFtZXRlcnM+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmNhYzk0ZWNiLTAzOTEtZmI0Zi05NTljLWJjMzVmNDUzMzY1ZTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxOS0wNS0yOVQxMzo1NzoyNSswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDx4bXBNTTpEZXJpdmVkRnJvbSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgIDxzdFJlZjppbnN0YW5jZUlEPnhtcC5paWQ6MjBjNDE1NGUtMjc2OS05YTQxLTk4YTAtNjA1YjQ4ZmQ4NWI4PC9zdFJlZjppbnN0YW5jZUlEPgogICAgICAgICAgICA8c3RSZWY6ZG9jdW1lbnRJRD54bXAuZGlkOjY5NWQ4NDA1LTIzZTEtNjA0MC1iNjUyLTgyNjIzZTdkMDNhNDwvc3RSZWY6ZG9jdW1lbnRJRD4KICAgICAgICAgICAgPHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD54bXAuZGlkOjY5NWQ4NDA1LTIzZTEtNjA0MC1iNjUyLTgyNjIzZTdkMDNhNDwvc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8L3htcE1NOkRlcml2ZWRGcm9tPgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8cGhvdG9zaG9wOklDQ1Byb2ZpbGU+c1JHQiBJRUM2MTk2Ni0yLjE8L3Bob3Rvc2hvcDpJQ0NQcm9maWxlPgogICAgICAgICA8cGhvdG9zaG9wOlRleHRMYXllcnM+CiAgICAgICAgICAgIDxyZGY6QmFnPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHBob3Rvc2hvcDpMYXllck5hbWU+SUwgVFVPIExPR088L3Bob3Rvc2hvcDpMYXllck5hbWU+CiAgICAgICAgICAgICAgICAgIDxwaG90b3Nob3A6TGF5ZXJUZXh0PklMIFRVTyBMT0dPPC9waG90b3Nob3A6TGF5ZXJUZXh0PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6QmFnPgogICAgICAgICA8L3Bob3Rvc2hvcDpUZXh0TGF5ZXJzPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj41MzU8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MTMxPC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz6sNUvJAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAABbYSURBVHja7J19sFXVeYcfMAgGdLjEkWH8nBNMNFFp5zq0RFpqe0FSJzFRL/WjmjbqpVqaamK82jRNUpPI1ZjYxKgXE8f4GblabRSj3BuNBjhTynWk1uiMcKoSRskYcCYyKXFg94+1jh7wnnvOXmvtffbH75k5AxzO3mvvd797r99+17veNSGKIoQQQgghQjFRJhBCCCGExIUQQgghJC6EEEIIUQ7eV/LznwC8HzgYOBQ4BjgA2B842v7mCGAGsBt4zn63FXjTfvcS8CqwDdhpvxNCCCHK27mWLKFzOvAR4GRgnhUN8wLuv2rFxdPAWuAZKzqUNSuEEELioiAcBBwHnAIsDCwk4giOZ4FHrNh4XW4nhBBC4iJfTAFOAi7CDGnMy9jxrQFWAD8F3pALCiGEkLjI6HkAx1tB0Z1BQTEWVWA78F3gF8Dv5I5CCCEkLjrPRGAxcBUwP8fnUQWGge9gEkWFEEIIiYuUmQT0AhfnXFQ0ExnfQ0MmQgghJC5SYSJwFrCMfAx9+IiMUeBrEhlCCCEkLpJjDnAdZtZHWagCdwC3ovoZQgghJC6CMQ24hvwkaibBMPBFYKNcVgghhMSFx7EBZ1P8IZB2qdfLuAJ4S+YQQgghcRGPqcAgcK4u0Zgi43PABplCCCGExEV7nAB8n2LNAklCYAwBN6DS4kIIISQumh8LsBQ4Hw2DtMtDwN+i2hhCCCEkLt7DfsCP0DCIC1WgD/gfmUIIIYTEhWEKcC/wqQzYowb81kYCXrXfbceU5p6MWZod4DBMXkj935UMCIyrgKfk0kIIIcouLrqAO4FTOyAi9mCmdq4FXgZetN/virmvCnAk8GHM+iYnAQd2QHBUMeXDh+TWQgghyiouDsNELNJK3KwBzwNPWkGxPsG2KlZk/IX9c3aKAmPIigwhhBCiVOLiMGAlySdu1oAtwP3Af9i/p81k4NPAacBcko9oSGAIIYQonbjoAn5CshGLGmYZ8xvJVj2IGZjky/OBYxMWGHcAt8jFhRBCFF1cTMGUsk5KWNSAx4Dr7d+zylQrMj6DWTMlKYGhHAwhhBCFFheTgAdJJnmzhsmh+FLGRcVYNvln4BySycuoApcD6+TqQgghiiYuJmBmhSRRx2I9ZmnyR3N8HWYDy4E/JHxORhX4LGY2jBBCCFEYcXEZ8O3A+6wBdwFfB94uyPU4C7ia8FGMNZil6v9PLi+EECJpJqbQxglAb+B9bsKE+79SIGEB8GPgk4SfJjsfs16LEEIIkThJRy6mYhIsQyZwrsckQ24s8HWZiimHHnqY5ALgNrm9EEKIJEk6cvHdgMKiBjwMfLzgwgJgJ3AmphZIyATVC4Fj5PZCCCGSJMnIRa/tHEMKi0tTtM0M4FDM+iHTgN3AVuB1YFuKxxE6D2MN8Gf2fIQQQojciItpwGrCVOCsYepW3JSQDSZhkh0XAUcDh1hhAWMPSdQaogtv2H8/BazCLHKWBCcCN9s/Q/B5VMFTCCFEzsTFTcDFgYTFN4EfBj6+6Zh1Pz5BuLU/6muXPGqFVeh6GxXgIcziaL5UgdMxURghhBAi8+Jijn3L9o1a1IB7gC8HjgB8geTX+KgBrwArMDNAQnEScHsgMXQfZshFCCGEyLS42A/4OWGSOO/ErMER6q3/X4A/Id2l0OsiYzkmmhGCC4B/CnQePcDPdBsIIYTIsrg4D7Ngli+rMfUednnuZyYmUnFGyqJiLJHxPCYKE2Kmy9WYkuG+57QGWADs0a0ghBAii+JiEiax0Xc4ZCNmuulrnvu5BFhGsquPuoiMJ4F/xCSE+nCHFXO+nEq+S6cLIYQosLg4B7jbcx+bgLPxXyb9Zszsj0pG7f6UFQZbPPYxGbN0/SLPY1H0QgghRFAmBtyP7+yQGnClp7CYCTyecWGB7cxXYRI0XdkF/A3+wyzzgcW6FYQQQmRNXCzGP4nzF8ADHtvPzYmwqHM8Zmjj7zz28Rom/8J32utVpLPOjBBCCImLtphgOycfXvDcxxmYIZk5ObN/BfgicK3HPh4gTPTiZN0OQgghsiIuPoxf1KKGKbrlmsA5FzPVc3ZOr0HFiqNlHvv4Ev7Ri4t0OwghhMiKuLjAc/stwI2O287CFKqanfPrUAEuA/7ScfsX8F/H5QhM5VIhhBCio+JiMn5JifV1Q1yYhKlWOacg16IC/Bvu5b1vwMy2cWUepsiYEEII0VFxMR+/uhavYFY7daE+3bRIzAZ+wLsLp8VhG3C/Z/v/oFtCCCFEp8WFT55ADfeVOZdR3ATEuZjS5y7cgF/0YhpmVVghRHN6gH5gGIjG+Ky0/98tUxXCrn223Q1NjqvffmSrRqIocv0cFEXRusidNY7tzoyi6JdRsdkcRdEZjva5xrPtXg+f6MRnc2Db9yRwPQdTtkl/Bny4Yo8lSuD6NDtvl2vXF9Ou2x3u5b4Urnme/TaLdu2Komi5o80q++yr0nB+fQW01Zgfn8jFcZ5DIq41LS4lWyW9k6ACXOG47R34zRw5Ry9QQuxFL7AdMyutq+H7AcxKyxMaPgsxSeaN9/KgfevtkSlzYdd+e1yN0YgRTJHHCft8Pmi/H2mIcmxu2LbLRhe6SueDHsrka55v5rMc2qwk8Kaa5ejFJY7X5gmPdtdFUTQpZ9GLfT+DbZ5r6AjJcEbOf7zIxXb7/41vV3HfYnvasHFlnOMbbtP/Q9iiu2GfG1oc11iflU2OrbvFdr1Nzmt5BiN7nfDbLNq1Yn3ENZrbvY9vbxhjf30FsVVikYu6OnJlI251LUItNZ6X6EUfZkZOXHympc6zalwUjxF7bQc8o1sjwFL7DNiR8XMetR+AoRjnXX/j7B3j/5Y27LMZQ9bOY70VD5fYB7Nq1x77Zr9vjsIS22a7vraw4fi6PXMecu2DruLiA55DIi6d3xzKV0VyDqb+RVx+7Nl5fEz9cCGFRWgxMGJDslkXGPXjiyssepqc80ib+xkYpyMro8DIql17mgxdjMQQFo1caT9FtFXi4sKntkQNWO2w3WUlilo0cr5D9OJN4HmPNk9XX5xrKmPcc0sSaqtm36JaHUOWREYrBsd54xyJ2d7QOA/3lSXzyyzatXucTnbE41wHHIVJYXzQVVz8qUebWzCJKXHwLdaVZ47FrZ7HOo82Z2CKlIliMJBwdGHI80GcJfoZOwzt2uGMF7ruJf0pjLLr3tGBlQGPaV+WOt53hfBBV3HhM45UddhmEfkv8e3D4pTsXGcepuaFyD819s4cT1LA5J0KJhu/lT3j2r9VR1L0iGxW7TrY4je+6zXtIP7wSGF80EVcTMCtgqTPG/Viys3Jjnb2uTlmql8uBCtSameE1glmWWewzQ4jbgfT6u256NGLLNq1r0V0wOWYmt1/tTL6oIu4mIp7MmcNWJ9S51okJgMLYm7zNvCiR5tHqF+WuIjJUI7t1EPrGgAunU07HUtfgaMXWbVrfwLH5HsPFsoHXcTFBzza24NZAyMOC3CbjlkkKrhFb172aPOj6pdzSz3rfZR0Z3KMjHEMeaEvgTfGOPQW1BezaNd2OtKQxzRURh90ERdHebTnEqY/lXLOEhlL1cbFZ50RrYuQf3GRdpJlo5jpypm9Ot259xXUD7No17RtXaP1kGHhfNBFXPiU3nbp7A5XXwGYPJepMbd52aM9Cbr804kciDzOGmlXuCcVkq7fb0UT9Fm0a6fsXC/RvaIsPvg+h23282jPpbObpT7inQs/k3jRn00yWylZ2MG2l+TQXu0+UJMeYuoh/0mxWbdru9GBmmzlh0vk4kCP9nY6bHOo+op3ODjm77d6tjdBJhclICsLinXJronbtVu2SscHXcSFzyyCLTF/Pxm8Vm4tGi7TQ10V+DyZW5SErAwBdsuuidu1W7ZKxwez3nEfgsb+G4mbf7Ldsz1FLkQZhEVXho5Fdk3WrhXZKh0fdBEXPpUy43Z2KuTUWXtMlslFwemSCUpj14pslR4u4sKnLPRbMX+vZM692V8mEKKwD/aK7FpKuxbSVi7i4i2P9uK+Cb+mZ99e/D7l9vbI5EIIIdIQFz7TG+OG9bfpEnXUHr+XyYUQQqQhLtLk16Q/3zjLxJ1t47PAXFXmFiUgS8+XHbJrKe1aSFu5iItXPdqLW7NiFwrNN+ISufAZQ4tkclFwduhYSmPXmmyVbXHxW4/2XApwbUXUeSPm7zXbRojWD9OsPNxrsmvidq3JVun4oIu42O3R3lEO2yip892LHjdy4TNt+C2ZXJSEUR1Haewa6pg2YyK7vp9KUX3QRVy8kLK42IIAUzo9bvl0H3HxXzK5kLhI/Q1Wdk3WrqOyVTo+6CIuXvZo70MO24ygpE6Axxy2OdKjvWdl8o6w0r7R9MsUhXiwx6lhMFIwv82iXUPZ+IOYCsaNnxUO29aK6oMu4uI3nu3FzQNYjUnsLDM1x4t+tEeb/6s+J3W6eHfVxh0yR2oMtWnviuM1bfceHy2Y32bRrqMZtXPhfNBFXOzEfZpiBZjrsN26kj/8dlmRFYdJwDEebb6KSJu+hr9LXISj0oZNhzp8jCsK6rdZtGs7tu5E1cxC+aCLuIjwWxDrYw7brCr5w/EpRzv7TENV5yZxkRTtnFvIh3tXG+0OJPhWn4eOJSm/zaJd24kSdEJcFMoHXYto+YROXJbyfpRy512sTsnOdarA2+rrU39Al2UF4Hbu5VAP9y772dGi3VobD9ekQtIrcvx8a+W3WbTrjgQ7ct/7ojA+6CounvZo83DiV47cBawvaaezyYorl8iFK2vV16dKF+9N4CyymG733LoDtNUTo80rExA9rX6f1Y4upN9m0a4DZDP3ojA+6CouNnq0WQFOdtjuOyWNXtxD/ITW6cBHPdp8DJEm/SWKWkD7yckhbNIdo81aGw/3uMfU6vcDOX6uteu3WbXr0oR9z1V4F8IHXcXFb/Bbe+JMh23Wl/CN+jngWoftTvO8OTYi0qKP8k07bXf2U0+AN+u+mIJmoMVv4x7TeNGXoRxHLeL6bRbtOgoscWzDNaLQzvBDIXzQVVxEnh39XNxKU3+1ZNGLW4hfOIsWN0wrqvhNNxbt0wsMjtMBF5l2wr++eSiD9oE/RLyp3EtoHjLvjdnZ9IzTsS0tmd9m0a5D4/hi3E680obPLy2LD/qsiuoTOq/ENFCj4z5Qko5nPXCro219pqCuRQuWpcFyTOGhstLug225h7Dopb0w877ssA/3WpO3wHafXX1N3mZHgYXkc0aQj99m1a4DTXwkznBlpUWEYEnMCEHufdBHXGwk/aERgOvxK0GeB2qYHBOXGRvneL7tKd8iObrtA2sz44eUyzINeEUbAqMXGI7h0932930tHtDt3IMnNol4DNI6ZN7XRBgN2f3uKKnfZtWuA7w34ttlhVQ7vjc4jog+Ebdpnvn2wSiKfD6PRO5sjqLoE47tLrPbF5VVjnaZGkXRLz3aXRdF0QGePpH2J7Qf9GTg+m9OyFZJMBjguHravI7LoyjqHWP7ShRF/VEUDTf8dth+H8Ju/U2Op3+MNnqjKFrZ5Pd9Cd4HefTbLNq1so8fNR5Td5Nz2DDG77cHPq48+OBeH98dLPJ0xic82r69oMLiP6MomuFokys9274pZ8JC4qIY4qLVgzoOGxJ6gHZZceNCfwr3QV79Nqt27Rmng25lg6SOK+s+uNdnQhR5Da9PAZ7AvWBTDbgUeNhh28nAT3Gb1ppVNtnhIpfZGlMxK5ke69H+H6CZIiIb9DeMZfe1eIasaAj3ppEIWx/H7m0Smh5tOJYhXcrc27W/4c+uJsN79RlQoyW31Tv4iguA7wHLPLZ/Evhzx20Px5QGP74geRaXAw86bn8lcI1H+1VgPrBHzzghhBA+TAywj0HP7Y8EznPcdgtwMfmftlfDzAxxFRYzgfM9j+EnEhZCCCGyIi6eB9Z4bF8BvoAJ67uwFvjXHAuMGmZYaLnHPr6B33BIFbhLt4MQQoisiIsIv3A8wBzgKx7b/wi4EFPRMm/C4kZM3okrC/DPO6kBv9LtIIQQIgQhci7qIuUpzJi9Twd3Ov7rltxmO9ys8wImQehhj31MBh73PN8qZlhqs24HIYQQoURBCPYAN3vuo4KJQMzyFCinAneS7WGS9cAZnsICTJ6Gr5CqSVgIIYTIorgAM92l6rmPOcDtwCSPfezEJDfeipnamSXq5ctPwb/K6NXASZ77qOI3HCWEEEIkKi7exj96AbAItzU19mU5ZorrLXQ+ilHDTLn9LKaOxZue+zsP/zLf9eNS1EIIIURQQuVc1NkP+Dl+uRf1Tu+ugG/V9YTROQE65Ljn8YYVOg8G2udc4G5gtud+qpgCLFt1GwghhAjJxMD7240pqOU7PFIB/hqTlxCCjZhk0YuB1SQfyagBG4DrgD8KKCxmAT8IICzA1LWQsBBCCBGc0JGLOjfZjtyXTcDZtqMOySzgNMwQTKhoRg14xYqXVYSfFhuy3PkazJDR27oFhBBC5EVcTLOd7LwA+3oOk2OQ1JoX04HF9nMUpqQ4LQRHPfLxhn37H8EsVZ5URGQqZiZNqEhOD/Azub8QQog8iQsw4/krA+1rE3AF4YYX2unMZwIH2z8PB7ZZMfFr+/ftKR1LBbgD/5khde4DzpLrCyGEyKO4APghZoZECOrrbywv0fVZgFkYLtTCbFXMUNBbcn0hhBB5FRdTMcMF8wPtrz6l88ISXJtLMGuuhJrdUgU+R/j8FSGEEGIvJia8/53A3+M/e6ROBZPQ+DhmuKKofDuwsABT5EzCQgghRO7FBcB/244tFBVMaP8Rwg0XZIXpwL9jZrKEFBb3ATfI3YUQQqRB0sMi77SDWe/j3MD73QTcA3yd/E+rPAP4MmZqbEjWAB9HeRZCCCEKJi7ArBfyIGZhsdBsAL5JerNJQnIs8A2SqR6qKpxCCCEKLS4ApgDDhEvwbKQGPA9cj1n+PevMBC4FlpBMSfIq8BngJbm5EEKIIosLgC5M6en5Ce0/6yKjLirOJEwZ72bC4nJgnVxcCCFEGcQFwGGYAlvzEmyjLjKGbFu7OmzrBZgoxaIERUVdWHwLkxgqhBBClEZc1AXGvSQXwWhkE6Yc+f2YOhlpcTxm5sdpwAySX5G1CnzVnqsQQghROnEBZojkTpJJ8hyLGrAHs07JWvtZH3D/FUyZ7j+2fx5Ieku8VzGLxW2UWwshhCizuACT5Hkv8KkOtF1faOw14EXgZczKpm8Cr9r/244pBjYZOMR+dyhwgBUOR9nPhzB1QyodOI81mCXqX5FLCyGEkLgw7IdZ9fNcXZLYDAN/BeyQKYQQQkhc7HMswFLgfJJN9CwKVWAU+Dz5LyAmhBBC4iJRTgC+TzqJnnkWFpoRIoQQQuIiBlOBQTRMMhbDmGXsfyVTCCGEkLiIeWzA2cAyNEwCJlrxJGaqqYZBhBBCSFx4MA24Bugusch4CFNxc7NcVgghhMRFOOYA1wELS3R96rkVDwKR3FUIIYTERXgmAmdR/KGSKia34lpMjQ0hhBBC4iJhJmGWEr+YYs0qqQKrMLNl3pR7CiGEkLhIn4nAYuCqnIuMKnA3cBvwO7mlEEIIiYsMnAdmkbCLyE/iZxVTYvxWTPnuXXJHIYQQEhfZZApm0bCLgCMyKDSGgduBR9HQhxBCCImL3HEQcBxwCmaWSSeERhV4FngEeAZ4XW4nhBBC4qI4TAc+ApxshcaMwIKjCuwGnsYs5/4MsA1NIxVCCCFxUZ7zB94PHIxZRv0YzFLq+wNH298cYUXIbuA5+91WzJDGbuAlTO7ENsy00d1yKyGEEBIXQgghhBCBmCgTCCGEEELiQgghhBASF0IIIYQoB/8/AFMSPK3WYq0DAAAAAElFTkSuQmCC","isMetaFile":false,"width":148.5,"height":35.99999000000001,"iscrop":false,"name":"Immagine 12","visible":true,"widthScale":37.009346,"heightScale":36.64122,"verticalPosition":-3.2,"verticalOrigin":"Paragraph","verticalAlignment":"None","horizontalPosition":357,"horizontalOrigin":"Column","horizontalAlignment":"None","allowOverlap":true,"textWrappingStyle":"InFrontOfText","textWrappingType":"Both","layoutInCell":true,"zOrderPosition":251671040}]}]},"footer":{"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Contatti","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"lineStyle":"None","lineWidth":0},"left":{"lineStyle":"None","lineWidth":0},"right":{"lineStyle":"None","lineWidth":0},"bottom":{"lineStyle":"None","lineWidth":0},"diagonalDown":{"lineStyle":"None","lineWidth":0},"diagonalUp":{"lineStyle":"None","lineWidth":0},"horizontal":{"lineStyle":"None","lineWidth":0},"vertical":{"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":179.8000030517578,"preferredWidthType":"Point","cellWidth":174.0500030517578,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Contatti","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"lineStyle":"None","lineWidth":0},"left":{"lineStyle":"None","lineWidth":0},"right":{"lineStyle":"None","lineWidth":0},"bottom":{"lineStyle":"None","lineWidth":0},"diagonalDown":{"lineStyle":"None","lineWidth":0},"diagonalUp":{"lineStyle":"None","lineWidth":0},"horizontal":{"lineStyle":"None","lineWidth":0},"vertical":{"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":179.85000610351562,"preferredWidthType":"Point","cellWidth":174.1999969482422,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"styleName":"Contatti","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"lineStyle":"None","lineWidth":0},"left":{"lineStyle":"None","lineWidth":0},"right":{"lineStyle":"None","lineWidth":0},"bottom":{"lineStyle":"None","lineWidth":0},"diagonalDown":{"lineStyle":"None","lineWidth":0},"diagonalUp":{"lineStyle":"None","lineWidth":0},"horizontal":{"lineStyle":"None","lineWidth":0},"vertical":{"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":179.85000610351562,"preferredWidthType":"Point","cellWidth":175.0500030517578,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":28.799999237060547,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"lineStyle":"None","lineWidth":0},"left":{"lineStyle":"None","lineWidth":0},"right":{"lineStyle":"None","lineWidth":0},"bottom":{"lineStyle":"None","lineWidth":0},"diagonalDown":{"lineStyle":"None","lineWidth":0},"diagonalUp":{"lineStyle":"None","lineWidth":0},"horizontal":{"lineStyle":"None","lineWidth":0},"vertical":{"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridBeforeWidth":0,"gridBeforeWidthType":"Point","gridAfter":0,"gridAfterWidth":0,"gridAfterWidthType":"Point","leftIndent":0}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Contatti","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"lineStyle":"None","lineWidth":0},"left":{"lineStyle":"None","lineWidth":0},"right":{"lineStyle":"None","lineWidth":0},"bottom":{"lineStyle":"None","lineWidth":0},"diagonalDown":{"lineStyle":"None","lineWidth":0},"diagonalUp":{"lineStyle":"None","lineWidth":0},"horizontal":{"lineStyle":"None","lineWidth":0},"vertical":{"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":179.8000030517578,"preferredWidthType":"Point","cellWidth":174.0500030517578,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Contatti","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"lineStyle":"None","lineWidth":0},"left":{"lineStyle":"None","lineWidth":0},"right":{"lineStyle":"None","lineWidth":0},"bottom":{"lineStyle":"None","lineWidth":0},"diagonalDown":{"lineStyle":"None","lineWidth":0},"diagonalUp":{"lineStyle":"None","lineWidth":0},"horizontal":{"lineStyle":"None","lineWidth":0},"vertical":{"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":179.85000610351562,"preferredWidthType":"Point","cellWidth":174.1999969482422,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"styleName":"Contatti","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"lineStyle":"None","lineWidth":0},"left":{"lineStyle":"None","lineWidth":0},"right":{"lineStyle":"None","lineWidth":0},"bottom":{"lineStyle":"None","lineWidth":0},"diagonalDown":{"lineStyle":"None","lineWidth":0},"diagonalUp":{"lineStyle":"None","lineWidth":0},"horizontal":{"lineStyle":"None","lineWidth":0},"vertical":{"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":179.85000610351562,"preferredWidthType":"Point","cellWidth":175.0500030517578,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"lineStyle":"None","lineWidth":0},"left":{"lineStyle":"None","lineWidth":0},"right":{"lineStyle":"None","lineWidth":0},"bottom":{"lineStyle":"None","lineWidth":0},"diagonalDown":{"lineStyle":"None","lineWidth":0},"diagonalUp":{"lineStyle":"None","lineWidth":0},"horizontal":{"lineStyle":"None","lineWidth":0},"vertical":{"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridBeforeWidth":0,"gridBeforeWidthType":"Point","gridAfter":0,"gridAfterWidth":0,"gridAfterWidthType":"Point","leftIndent":0}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Contatti","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"[INDIRIZZO UFFICIO]"}]}],"cellFormat":{"borders":{"top":{"lineStyle":"None","lineWidth":0},"left":{"lineStyle":"None","lineWidth":0},"right":{"lineStyle":"None","lineWidth":0},"bottom":{"lineStyle":"None","lineWidth":0},"diagonalDown":{"lineStyle":"None","lineWidth":0},"diagonalUp":{"lineStyle":"None","lineWidth":0},"horizontal":{"lineStyle":"None","lineWidth":0},"vertical":{"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":179.8000030517578,"preferredWidthType":"Point","cellWidth":174.0500030517578,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Contatti","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"[NUMERO DI TELEFONO]"}]}],"cellFormat":{"borders":{"top":{"lineStyle":"None","lineWidth":0},"left":{"lineStyle":"None","lineWidth":0},"right":{"lineStyle":"None","lineWidth":0},"bottom":{"lineStyle":"None","lineWidth":0},"diagonalDown":{"lineStyle":"None","lineWidth":0},"diagonalUp":{"lineStyle":"None","lineWidth":0},"horizontal":{"lineStyle":"None","lineWidth":0},"vertical":{"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":179.85000610351562,"preferredWidthType":"Point","cellWidth":174.1999969482422,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1,"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","appearance":"Hidden","type":"Text","hasPlaceHolderText":true,"multiline":false,"isTemporary":true,"characterFormat":{},"contentControlListItems":[]}},{"blocks":[{"paragraphFormat":{"styleName":"Contatti","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"[INDIRIZZO DI POSTA "},{"characterFormat":{},"text":"ELETTRONICA]"}]}],"cellFormat":{"borders":{"top":{"lineStyle":"None","lineWidth":0},"left":{"lineStyle":"None","lineWidth":0},"right":{"lineStyle":"None","lineWidth":0},"bottom":{"lineStyle":"None","lineWidth":0},"diagonalDown":{"lineStyle":"None","lineWidth":0},"diagonalUp":{"lineStyle":"None","lineWidth":0},"horizontal":{"lineStyle":"None","lineWidth":0},"vertical":{"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":179.85000610351562,"preferredWidthType":"Point","cellWidth":175.0500030517578,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"lineStyle":"None","lineWidth":0},"left":{"lineStyle":"None","lineWidth":0},"right":{"lineStyle":"None","lineWidth":0},"bottom":{"lineStyle":"None","lineWidth":0},"diagonalDown":{"lineStyle":"None","lineWidth":0},"diagonalUp":{"lineStyle":"None","lineWidth":0},"horizontal":{"lineStyle":"None","lineWidth":0},"vertical":{"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridBeforeWidth":0,"gridBeforeWidthType":"Point","gridAfter":0,"gridAfterWidth":0,"gridAfterWidthType":"Point","leftIndent":0}}],"grid":[174.40099488602894,174.44949645346992,174.44949645346992],"tableFormat":{"borders":{"top":{"lineStyle":"None","lineWidth":0},"left":{"lineStyle":"None","lineWidth":0},"right":{"lineStyle":"None","lineWidth":0},"bottom":{"lineStyle":"None","lineWidth":0},"diagonalDown":{"lineStyle":"None","lineWidth":0},"diagonalUp":{"lineStyle":"None","lineWidth":0},"horizontal":{"lineStyle":"None","lineWidth":0},"vertical":{"lineStyle":"None","lineWidth":0}},"shading":{},"cellSpacing":0,"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidth":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":true},"columnCount":3},{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Franklin Gothic Book","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Franklin Gothic Book","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"leftIndent":17.850000381469727,"rightIndent":17.850000381469727,"lineSpacing":14,"lineSpacingType":"Exactly","listFormat":{}},"characterFormat":{"fontFamily":"Franklin Gothic Book","fontFamilyBidi":"Franklin Gothic Book"},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Header","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Intestazione Carattere","next":"Header"},{"name":"Intestazione Carattere","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Piè di pagina Carattere","next":"Footer"},{"name":"Piè di pagina Carattere","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"Title","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"textAlignment":"Center","listFormat":{},"contextualSpacing":true},"characterFormat":{"bold":true,"fontSize":16,"fontFamily":"Constantia","fontColor":"#FFFFFFFF","boldBidi":true,"fontSizeBidi":16,"fontFamilyBidi":"Constantia"},"basedOn":"Normal","link":"Titolo Carattere","next":"Normal"},{"name":"Titolo Carattere","type":"Character","characterFormat":{"bold":true,"fontSize":16,"fontFamily":"Constantia","fontColor":"#FFFFFFFF","boldBidi":true,"fontSizeBidi":16,"fontFamilyBidi":"Constantia"},"basedOn":"Default Paragraph Font"},{"name":"Normal (Web)","type":"Paragraph","paragraphFormat":{"beforeSpacing":5,"afterSpacing":5,"listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"Normal (Web)"},{"name":"Testo","type":"Paragraph","paragraphFormat":{"afterSpacing":12,"listFormat":{}},"characterFormat":{"fontSize":11,"fontColor":"#000000FF","fontSizeBidi":11},"basedOn":"Normal","next":"Normal"},{"name":"Testo blu","type":"Paragraph","paragraphFormat":{"afterSpacing":6,"listFormat":{}},"characterFormat":{"fontSize":11,"fontColor":"#1F497DFF","fontSizeBidi":11},"basedOn":"Normal","next":"Testo blu"},{"name":"Contatti","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","listFormat":{}},"characterFormat":{"fontColor":"#1F497DFF"},"basedOn":"Normal","next":"Contatti"},{"name":"Placeholder Text","type":"Character","characterFormat":{"fontColor":"#808080FF"},"basedOn":"Default Paragraph Font"},{"name":"Testo in grassetto","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":12},"basedOn":"Testo","next":"Testo in grassetto"},{"name":"Testo in grassetto blu","type":"Paragraph","paragraphFormat":{"afterSpacing":10,"listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"fontColor":"#1F497DFF","boldBidi":true,"fontSizeBidi":12},"basedOn":"Testo blu","next":"Testo in grassetto blu"},{"name":"Note","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"italic":true,"fontSize":10,"italicBidi":true,"fontSizeBidi":10},"basedOn":"Testo blu","next":"Note"},{"name":"List Bullet","type":"Paragraph","paragraphFormat":{"leftIndent":54,"afterSpacing":6,"listFormat":{"listId":0}},"characterFormat":{},"basedOn":"Normal","next":"List Bullet"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[{"abstractListId":0,"levelOverrides":[],"listId":0}],"abstractLists":[{"abstractListId":0,"levels":[{"characterFormat":{"fontFamily":"Symbol","fontFamilyBidi":"Symbol"},"paragraphFormat":{"leftIndent":18,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":18,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]}],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Backspace on content control validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, enableEditorHistory: true, enableComment: true });
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
    it('Backspace on content control validation', function () {
        editor.open(JSON.stringify(contentControl));
        editor.selection.select('0;9;0', '0;9;0');
        expect(() => { editor.editor.onBackSpace(); }).not.toThrowError();
    });
});
describe('paragraph and character format perservation in row insertion validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, enableEditorHistory: true, enableComment: true, enableSelection: true });
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
    it('paragraph and character format perservation in row insertion', function () {
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.selection.select('0;0;1;0;0;0', '0;0;1;0;0;0');
        editor.editor.insertText('text');
        editor.selection.handleControlShiftLeftKey();
        editor.editor.onApplyParagraphFormat('textAlignment', 'Center', false, true);
        editor.editor.onApplyCharacterFormat('bold', true, false);
        editor.editor.insertRow(false);
        editor.editor.insertText('text');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');        
    });
});
describe('character style validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, enableEditorHistory: true, enableComment: true, enableSelection: true });
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
    it('character style validation', function () {
        editor.openBlank();
        var temp = {
            type: 'Character',
            name: 'Paragraph 10',
            basedOn: 'Default Paragraph Font',
            characterFormat: {
                fontSize: 32.0,
                fontFamily: 'Calibri',
                bold: true,
            },
        };
        editor.editor.createStyle(JSON.stringify(temp));
        editor.editor.insertText('syncfusion document editor');
        editor.editor.applyStyle(temp.name);
        editor.editor.insertText('component');
        expect(editor.selection.characterFormat.fontSize).toBe(32);
        editor.selection.handleControlLeftKey();
        editor.selection.handleControlLeftKey();
        editor.selection.handleControlLeftKey();
        editor.editor.applyStyle(temp.name);
        editor.editor.insertText('component');
        expect(editor.selection.characterFormat.fontSize).toBe(32);
        editor.selection.handleControlRightKey();
        editor.selection.handleRightKey();
        editor.editor.applyStyle(temp.name);
    });
});
let Doc:any = {
	"sections": [
		{
			"sectionFormat": {
				"pageWidth": 595.2999877929688,
				"pageHeight": 841.9000244140625,
				"leftMargin": 99.25,
				"rightMargin": 42.54999923706055,
				"topMargin": 56.70000076293945,
				"bottomMargin": 56.70000076293945,
				"differentFirstPage": true,
				"differentOddAndEvenPages": false,
				"headerDistance": 35.45000076293945,
				"footerDistance": 35.45000076293945,
				"bidi": false
			},
			"blocks": [
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "DILIGENCIA.-"
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": " "
						},
						{
							"characterFormat": {},
							"text": "La "
						},
						{
							"characterFormat": {},
							"text": "extiendo "
						},
						{
							"characterFormat": {},
							"text": "yo, "
						},
						{
							"characterFormat": {},
							"text": "el/la "
						},
						{
							"characterFormat": {},
							"text": "Letrado "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "Administración "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "Justicia, "
						},
						{
							"characterFormat": {},
							"text": "para "
						},
						{
							"characterFormat": {},
							"text": "hacer "
						},
						{
							"characterFormat": {},
							"text": "constar "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "día "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "fecha "
						},
						{
							"characterFormat": {},
							"text": "por "
						},
						{
							"characterFormat": {},
							"text": "el/la "
						},
						{
							"characterFormat": {},
							"text": "Procurador/a, "
						},
						{
							"characterFormat": {},
							"text": "D/Dª "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_106_20297953"
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "Procurador:Demandante"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_106_20297953"
						},
						{
							"characterFormat": {},
							"text": ", "
						},
						{
							"characterFormat": {},
							"text": "se "
						},
						{
							"characterFormat": {},
							"text": "ha "
						},
						{
							"characterFormat": {},
							"text": "presentado "
						},
						{
							"characterFormat": {},
							"text": "escrito "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_402_20333750"
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "EL "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "ESCRITO "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "QUE "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "HAYA "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "PRESENTADO"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_402_20333750"
						},
						{
							"characterFormat": {},
							"text": " por "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_402_20358640"
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "se "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "solicita "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "concurso "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "o "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "se "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "subsana "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "lo "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "que "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "fuere"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_402_20358640"
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "."
						},
						{
							"characterFormat": {},
							"text": " Doy "
						},
						{
							"characterFormat": {},
							"text": "fe."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"bold": true,
						"boldBidi": true
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"bold": true,
						"boldBidi": true
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"bold": true,
						"boldBidi": true
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Center",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontSize": 18,
						"fontSizeBidi": 18
					},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 18,
								"boldBidi": true,
								"fontSizeBidi": 18
							},
							"text": "A U T O"
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_203_115442609"
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "Tratamiento "
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "Juez"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_203_115442609"
						},
						{
							"characterFormat": {},
							"text": " QUE "
						},
						{
							"characterFormat": {},
							"text": "LO "
						},
						{
							"characterFormat": {},
							"text": "DICTA: "
						},
						{
							"characterFormat": {},
							"text": "D/Dª. "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_204_115442843"
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "NOMBRE "
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "JUEZ"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_204_115442843"
						},
						{
							"characterFormat": {},
							"text": " "
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "Lugar: "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_217_115442281"
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "Localidad"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_217_115442281"
						},
						{
							"characterFormat": {},
							"text": " "
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "Fecha: "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_214_115442000"
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "Fecha"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_214_115442000"
						},
						{
							"characterFormat": {},
							"text": " "
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Center",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"bold": true,
						"fontSize": 13,
						"boldBidi": true,
						"fontSizeBidi": 13
					},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 13,
								"boldBidi": true,
								"fontSizeBidi": 13
							},
							"text": "ANTECEDENTES DE HECHO"
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "ÚNICO.-"
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": " "
						},
						{
							"characterFormat": {},
							"text": "Por "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "Procurador "
						},
						{
							"characterFormat": {},
							"text": "D/Dña. "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_106_563562"
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "Procurador:Demandante"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_106_563562"
						},
						{
							"characterFormat": {},
							"text": ", "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "nombre "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "representación "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "D/Dña. "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_101_1368734"
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "Nombre "
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "y "
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "apellidos:Demandante"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_101_1368734"
						},
						{
							"characterFormat": {},
							"text": ", "
						},
						{
							"characterFormat": {},
							"text": "se "
						},
						{
							"characterFormat": {},
							"text": "ha "
						},
						{
							"characterFormat": {},
							"text": "presentado "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "Juzgado "
						},
						{
							"characterFormat": {},
							"text": "Decano "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "Pamplona "
						},
						{
							"characterFormat": {},
							"text": "con "
						},
						{
							"characterFormat": {},
							"text": "fecha "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_402_8821421"
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "FECHA"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_402_8821421"
						},
						{
							"characterFormat": {},
							"text": " escrito "
						},
						{
							"characterFormat": {},
							"text": "solicitando "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "declaración "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "concurso "
						},
						{
							"characterFormat": {},
							"text": "voluntario "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "su "
						},
						{
							"characterFormat": {},
							"text": "representado "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "liquidación "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "citada "
						},
						{
							"characterFormat": {},
							"text": "entidad, "
						},
						{
							"characterFormat": {},
							"text": "acompañando "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "documentos "
						},
						{
							"characterFormat": {},
							"text": "expresados "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "artículo "
						},
						{
							"characterFormat": {},
							"text": "6 "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "Ley "
						},
						{
							"characterFormat": {},
							"text": "Concursal "
						},
						{
							"characterFormat": {},
							"text": "(LC), "
						},
						{
							"characterFormat": {},
							"text": "así "
						},
						{
							"characterFormat": {},
							"text": "como "
						},
						{
							"characterFormat": {},
							"text": "plan "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "liquidación."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Center",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"bold": true,
						"boldBidi": true
					},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "FUNDAMENTOS DE DERECHO"
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "PRIMERO.-"
						},
						{
							"characterFormat": {},
							"text": "\t"
						},
						{
							"characterFormat": {},
							"text": "De "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "documentación "
						},
						{
							"characterFormat": {},
							"text": "aportada, "
						},
						{
							"characterFormat": {},
							"text": "apreciada "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "su "
						},
						{
							"characterFormat": {},
							"text": "conjunto, "
						},
						{
							"characterFormat": {},
							"text": "resulta "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "existencia "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "un "
						},
						{
							"characterFormat": {},
							"text": "endeudamiento "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "mercantil "
						},
						{
							"characterFormat": {},
							"text": "solicitante "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "un "
						},
						{
							"characterFormat": {},
							"text": "sobreseimiento "
						},
						{
							"characterFormat": {},
							"text": "general "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "sus "
						},
						{
							"characterFormat": {},
							"text": "pagos "
						},
						{
							"characterFormat": {},
							"text": "reveladores "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "un "
						},
						{
							"characterFormat": {},
							"text": "estado "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "insolvencia "
						},
						{
							"characterFormat": {},
							"text": "actual "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "impide "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "misma "
						},
						{
							"characterFormat": {},
							"text": "cumplir "
						},
						{
							"characterFormat": {},
							"text": "puntual "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "regularmente "
						},
						{
							"characterFormat": {},
							"text": "con "
						},
						{
							"characterFormat": {},
							"text": "sus "
						},
						{
							"characterFormat": {},
							"text": "obligaciones "
						},
						{
							"characterFormat": {},
							"text": "exigibles."
						}
					]
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "SEGUNDO.-"
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": " "
						},
						{
							"characterFormat": {},
							"text": "El "
						},
						{
							"characterFormat": {},
							"text": "domicilio "
						},
						{
							"characterFormat": {},
							"text": "social "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "solicitante "
						},
						{
							"characterFormat": {},
							"text": "se "
						},
						{
							"characterFormat": {},
							"text": "encuentra "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_104_20786906"
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "Domicilio:Demandante"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_104_20786906"
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF",
								"styleName": "Campos"
							},
							"text": "de"
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": " "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_114_21307312"
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "Localidad:Demandante"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_114_21307312"
						},
						{
							"characterFormat": {},
							"text": ", "
						},
						{
							"characterFormat": {},
							"text": "donde "
						},
						{
							"characterFormat": {},
							"text": "debe "
						},
						{
							"characterFormat": {},
							"text": "presumirse "
						},
						{
							"characterFormat": {},
							"text": "tiene "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "centro "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "sus "
						},
						{
							"characterFormat": {},
							"text": "intereses "
						},
						{
							"characterFormat": {},
							"text": "principales, "
						},
						{
							"characterFormat": {},
							"text": "conforme "
						},
						{
							"characterFormat": {},
							"text": "al "
						},
						{
							"characterFormat": {},
							"text": "art. "
						},
						{
							"characterFormat": {},
							"text": "10 "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "Ley "
						},
						{
							"characterFormat": {},
							"text": "Concursal."
						}
					]
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "\t"
						},
						{
							"characterFormat": {},
							"text": "Por "
						},
						{
							"characterFormat": {},
							"text": "ello "
						},
						{
							"characterFormat": {},
							"text": "procede, "
						},
						{
							"characterFormat": {},
							"text": "conforme "
						},
						{
							"characterFormat": {},
							"text": "previene "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "art. "
						},
						{
							"characterFormat": {},
							"text": "14 "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "Ley "
						},
						{
							"characterFormat": {},
							"text": "Concursal, "
						},
						{
							"characterFormat": {},
							"text": "declarar "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "concurso "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "sociedad "
						},
						{
							"characterFormat": {},
							"text": "deudora "
						},
						{
							"characterFormat": {},
							"text": "solicitante "
						},
						{
							"characterFormat": {},
							"text": "con "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "pronunciamientos "
						},
						{
							"characterFormat": {},
							"text": "inherentes "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "tal "
						},
						{
							"characterFormat": {},
							"text": "declaración, "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "conformidad "
						},
						{
							"characterFormat": {},
							"text": "con "
						},
						{
							"characterFormat": {},
							"text": "lo "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "establece "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "art. "
						},
						{
							"characterFormat": {},
							"text": "21 "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "demás "
						},
						{
							"characterFormat": {},
							"text": "concordantes "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "referida "
						},
						{
							"characterFormat": {},
							"text": "Ley."
						}
					]
				},
				{
					"paragraphFormat": {
						"rightIndent": 18,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "TERCERO.-"
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": " "
						},
						{
							"characterFormat": {},
							"text": "Establece "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "art. "
						},
						{
							"characterFormat": {},
							"text": "190.1 "
						},
						{
							"characterFormat": {},
							"text": "LC, "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "redacción "
						},
						{
							"characterFormat": {},
							"text": "dada "
						},
						{
							"characterFormat": {},
							"text": "al "
						},
						{
							"characterFormat": {},
							"text": "mismo "
						},
						{
							"characterFormat": {},
							"text": "por "
						},
						{
							"characterFormat": {},
							"text": "Real "
						},
						{
							"characterFormat": {},
							"text": "Decreto "
						},
						{
							"characterFormat": {},
							"text": "Ley "
						},
						{
							"characterFormat": {},
							"text": "38/2011, "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "10 "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "Octubre, "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "juez "
						},
						{
							"characterFormat": {},
							"text": "podrá "
						},
						{
							"characterFormat": {},
							"text": "aplicar "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "procedimiento "
						},
						{
							"characterFormat": {},
							"text": "abreviado "
						},
						{
							"characterFormat": {},
							"text": "cuando, "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "vista "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "información "
						},
						{
							"characterFormat": {},
							"text": "disponible, "
						},
						{
							"characterFormat": {},
							"text": "considere "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "concurso "
						},
						{
							"characterFormat": {},
							"text": "no "
						},
						{
							"characterFormat": {},
							"text": "reviste "
						},
						{
							"characterFormat": {},
							"text": "especial "
						},
						{
							"characterFormat": {},
							"text": "complejidad, "
						},
						{
							"characterFormat": {},
							"text": "atendiendo "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "las "
						},
						{
							"characterFormat": {},
							"text": "siguientes "
						},
						{
							"characterFormat": {},
							"text": "circunstancias:"
						}
					]
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "1º "
						},
						{
							"characterFormat": {},
							"text": "Que "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "lista "
						},
						{
							"characterFormat": {},
							"text": "presentada "
						},
						{
							"characterFormat": {},
							"text": "por "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "deudor "
						},
						{
							"characterFormat": {},
							"text": "incluya "
						},
						{
							"characterFormat": {},
							"text": "menos "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "cincuenta "
						},
						{
							"characterFormat": {},
							"text": "acreedores."
						}
					]
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "2º "
						},
						{
							"characterFormat": {},
							"text": "Que "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "estimación "
						},
						{
							"characterFormat": {},
							"text": "inicial "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "pasivo "
						},
						{
							"characterFormat": {},
							"text": "no "
						},
						{
							"characterFormat": {},
							"text": "supere "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "cinco "
						},
						{
							"characterFormat": {},
							"text": "millones "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "euros."
						}
					]
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "3º "
						},
						{
							"characterFormat": {},
							"text": "Que "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "valoración "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "bienes "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "derechos "
						},
						{
							"characterFormat": {},
							"text": "no "
						},
						{
							"characterFormat": {},
							"text": "alcance "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "cinco "
						},
						{
							"characterFormat": {},
							"text": "millones "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "euros."
						}
					]
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "El "
						},
						{
							"characterFormat": {},
							"text": "apartado "
						},
						{
							"characterFormat": {},
							"text": "tercero "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "mismo "
						},
						{
							"characterFormat": {},
							"text": "articulo"
						},
						{
							"characterFormat": {},
							"text": " dispone "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "juez "
						},
						{
							"characterFormat": {},
							"text": "aplicará "
						},
						{
							"characterFormat": {},
							"text": "necesariamente "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "procedimiento "
						},
						{
							"characterFormat": {},
							"text": "abreviado "
						},
						{
							"characterFormat": {},
							"text": "cuando "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "deudor "
						},
						{
							"characterFormat": {},
							"text": "presente, "
						},
						{
							"characterFormat": {},
							"text": "junto "
						},
						{
							"characterFormat": {},
							"text": "con "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "solicitud "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "concurso, "
						},
						{
							"characterFormat": {},
							"text": "un "
						},
						{
							"characterFormat": {},
							"text": "plan "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "liquidación "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "contenga "
						},
						{
							"characterFormat": {},
							"text": "una "
						},
						{
							"characterFormat": {},
							"text": "propuesta "
						},
						{
							"characterFormat": {},
							"text": "escrita "
						},
						{
							"characterFormat": {},
							"text": "vinculante "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "compra "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "unidad "
						},
						{
							"characterFormat": {},
							"text": "productiva "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "funcionamiento "
						},
						{
							"characterFormat": {},
							"text": "o "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "deudor "
						},
						{
							"characterFormat": {},
							"text": "hubiera "
						},
						{
							"characterFormat": {},
							"text": "cesado "
						},
						{
							"characterFormat": {},
							"text": "completamente "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "su "
						},
						{
							"characterFormat": {},
							"text": "actividad "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "no "
						},
						{
							"characterFormat": {},
							"text": "tuviera "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "vigor "
						},
						{
							"characterFormat": {},
							"text": "contratos "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "trabajo."
						}
					]
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "En "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "presente "
						},
						{
							"characterFormat": {},
							"text": "supuesto "
						},
						{
							"characterFormat": {},
							"text": "nos "
						},
						{
							"characterFormat": {},
							"text": "encontramos "
						},
						{
							"characterFormat": {},
							"text": "ante "
						},
						{
							"characterFormat": {},
							"text": "una "
						},
						{
							"characterFormat": {},
							"text": "solicitud "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "concurso "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "revela "
						},
						{
							"characterFormat": {},
							"text": "un "
						},
						{
							"characterFormat": {},
							"text": "procedimiento "
						},
						{
							"characterFormat": {},
							"text": "sin "
						},
						{
							"characterFormat": {},
							"text": "especial "
						},
						{
							"characterFormat": {},
							"text": "complejidad "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "vista "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "parámetros "
						},
						{
							"characterFormat": {},
							"text": "fijados "
						},
						{
							"characterFormat": {},
							"text": "legalmente, "
						},
						{
							"characterFormat": {},
							"text": "por "
						},
						{
							"characterFormat": {},
							"text": "lo "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "procede "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "tramitación "
						},
						{
							"characterFormat": {},
							"text": "como "
						},
						{
							"characterFormat": {},
							"text": "concurso "
						},
						{
							"characterFormat": {},
							"text": "abreviado."
						}
					]
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "\t"
						}
					]
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "CUARTO.-"
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": " "
						},
						{
							"characterFormat": {},
							"text": "De "
						},
						{
							"characterFormat": {},
							"text": "conformidad "
						},
						{
							"characterFormat": {},
							"text": "con "
						},
						{
							"characterFormat": {},
							"text": "lo "
						},
						{
							"characterFormat": {},
							"text": "previsto "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "art. "
						},
						{
							"characterFormat": {},
							"text": "23.1 "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "Ley "
						},
						{
							"characterFormat": {},
							"text": "Concursal "
						},
						{
							"characterFormat": {},
							"text": "se "
						},
						{
							"characterFormat": {},
							"text": "acuerda "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "publicación "
						},
						{
							"characterFormat": {},
							"text": "gratuita "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "B.O.E., "
						},
						{
							"characterFormat": {},
							"text": "debiéndose "
						},
						{
							"characterFormat": {},
							"text": "hacer "
						},
						{
							"characterFormat": {},
							"text": "constar "
						},
						{
							"characterFormat": {},
							"text": "así "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "oficio "
						},
						{
							"characterFormat": {},
							"text": "adjuntando "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "edicto "
						},
						{
							"characterFormat": {},
							"text": "dirigido "
						},
						{
							"characterFormat": {},
							"text": "al "
						},
						{
							"characterFormat": {},
							"text": "B.O.E, "
						},
						{
							"characterFormat": {},
							"text": "con "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "contenido "
						},
						{
							"characterFormat": {},
							"text": "previsto "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "párrafo "
						},
						{
							"characterFormat": {},
							"text": "segundo "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "citado "
						},
						{
							"characterFormat": {},
							"text": "precepto."
						}
					]
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontSize": 10,
						"fontColor": "#000000FF",
						"fontSizeBidi": 10
					},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "QUINTO.-"
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": " "
						},
						{
							"characterFormat": {},
							"text": "Conforme "
						},
						{
							"characterFormat": {},
							"text": "al "
						},
						{
							"characterFormat": {},
							"text": "art. "
						},
						{
							"characterFormat": {},
							"text": "191 "
						},
						{
							"characterFormat": {},
							"text": "ter.1, "
						},
						{
							"characterFormat": {},
							"text": "si "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "deudor "
						},
						{
							"characterFormat": {},
							"text": "hubiera "
						},
						{
							"characterFormat": {},
							"text": "solicitado "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "liquidación "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "acuerdo "
						},
						{
							"characterFormat": {},
							"text": "con "
						},
						{
							"characterFormat": {},
							"text": "lo "
						},
						{
							"characterFormat": {},
							"text": "previsto "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "artículo "
						},
						{
							"characterFormat": {},
							"text": "190.2, "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "juez "
						},
						{
							"characterFormat": {},
							"text": "acordará "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "inmediato "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "apertura "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "fase "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "liquidación."
						}
					]
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "En "
						},
						{
							"characterFormat": {},
							"text": "cumplimiento "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "art. "
						},
						{
							"characterFormat": {},
							"text": "145 "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "LC, "
						},
						{
							"characterFormat": {},
							"text": "deberá "
						},
						{
							"characterFormat": {},
							"text": "suspenderse "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "ejercicio "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "las "
						},
						{
							"characterFormat": {},
							"text": "funciones "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "administración "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "disposición "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "concursado "
						},
						{
							"characterFormat": {},
							"text": "sobre "
						},
						{
							"characterFormat": {},
							"text": "su "
						},
						{
							"characterFormat": {},
							"text": "patrimonio, "
						},
						{
							"characterFormat": {},
							"text": "con "
						},
						{
							"characterFormat": {},
							"text": "todos "
						},
						{
							"characterFormat": {},
							"text": "lo"
						},
						{
							"characterFormat": {},
							"text": " efectos "
						},
						{
							"characterFormat": {},
							"text": "establecidos "
						},
						{
							"characterFormat": {},
							"text": "para "
						},
						{
							"characterFormat": {},
							"text": "ella "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "título "
						},
						{
							"characterFormat": {},
							"text": "III "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "LC, "
						},
						{
							"characterFormat": {},
							"text": "así "
						},
						{
							"characterFormat": {},
							"text": "como "
						},
						{
							"characterFormat": {},
							"text": "deberá "
						},
						{
							"characterFormat": {},
							"text": "declararse "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "disolución "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "entidad "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "concurso."
						}
					]
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "La "
						},
						{
							"characterFormat": {},
							"text": "apertura "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "liquidación "
						},
						{
							"characterFormat": {},
							"text": "produce "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "vencimiento "
						},
						{
							"characterFormat": {},
							"text": "anticipado "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "créditos "
						},
						{
							"characterFormat": {},
							"text": "concursales "
						},
						{
							"characterFormat": {},
							"text": "aplazados "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "conversión "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "dinero "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "aquellos "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "consistan "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "otras "
						},
						{
							"characterFormat": {},
							"text": "prestaciones."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Center",
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 108,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"bold": true,
						"boldBidi": true
					},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "PARTE DISPOSITIVA"
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "1.- "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "SE "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "DECLARA "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "EL "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "CONCURSO "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "VOLUNTARIO"
						},
						{
							"characterFormat": {},
							"text": " de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "entidad "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_101_1465593"
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "Nombre "
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "y "
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "apellidos:Demandante"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_101_1465593"
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "\t"
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "\t"
						},
						{
							"characterFormat": {},
							"text": "Se "
						},
						{
							"characterFormat": {},
							"text": "abre "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "fase "
						},
						{
							"characterFormat": {},
							"text": "común "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "tramitación "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "concurso "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "se "
						},
						{
							"characterFormat": {},
							"text": "sustanciará "
						},
						{
							"characterFormat": {},
							"text": "conforme "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "trámites "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "procedimiento "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "abreviado"
						},
						{
							"characterFormat": {},
							"text": " y "
						},
						{
							"characterFormat": {},
							"text": "fórmense "
						},
						{
							"characterFormat": {},
							"text": "las "
						},
						{
							"characterFormat": {},
							"text": "Secciones "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "primera"
						},
						{
							"characterFormat": {},
							"text": " a "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "cuarta,"
						},
						{
							"characterFormat": {},
							"text": " en "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "forma "
						},
						{
							"characterFormat": {},
							"text": "prevista "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "Ley, "
						},
						{
							"characterFormat": {},
							"text": "ordenándose "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "cuantas "
						},
						{
							"characterFormat": {},
							"text": "piezas "
						},
						{
							"characterFormat": {},
							"text": "sean "
						},
						{
							"characterFormat": {},
							"text": "necesarias "
						},
						{
							"characterFormat": {},
							"text": "o "
						},
						{
							"characterFormat": {},
							"text": "convenientes. "
						},
						{
							"characterFormat": {},
							"text": "Expídase "
						},
						{
							"characterFormat": {},
							"text": "testimonio "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "esta "
						},
						{
							"characterFormat": {},
							"text": "resolución "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "fin "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "encabezar "
						},
						{
							"characterFormat": {},
							"text": "dichas "
						},
						{
							"characterFormat": {},
							"text": "Secciones."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "\t"
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "2.- "
						},
						{
							"characterFormat": {},
							"text": "El "
						},
						{
							"characterFormat": {},
							"text": "administrador "
						},
						{
							"characterFormat": {},
							"text": "concursal "
						},
						{
							"characterFormat": {},
							"text": "deberá "
						},
						{
							"characterFormat": {},
							"text": "presentar "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "inventario "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "bienes "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "derechos "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "masa "
						},
						{
							"characterFormat": {},
							"text": "activa "
						},
						{
							"characterFormat": {},
							"text": "dentro "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "15 "
						},
						{
							"characterFormat": {},
							"text": "días "
						},
						{
							"characterFormat": {},
							"text": "siguientes "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "aceptación "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "cargo."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "\t"
						},
						{
							"characterFormat": {},
							"text": "El "
						},
						{
							"characterFormat": {},
							"text": "administrador "
						},
						{
							"characterFormat": {},
							"text": "concursal "
						},
						{
							"characterFormat": {},
							"text": "deberá "
						},
						{
							"characterFormat": {},
							"text": "presentar "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "informe "
						},
						{
							"characterFormat": {},
							"text": "previsto "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "artículo "
						},
						{
							"characterFormat": {},
							"text": "75 "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "plazo "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "un "
						},
						{
							"characterFormat": {},
							"text": "mes, "
						},
						{
							"characterFormat": {},
							"text": "contado "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "partir "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "aceptación "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "cargo."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "\t"
						},
						{
							"characterFormat": {},
							"text": "El "
						},
						{
							"characterFormat": {},
							"text": "Administrador "
						},
						{
							"characterFormat": {},
							"text": "Concursal "
						},
						{
							"characterFormat": {},
							"text": "practicará "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "comunicación "
						},
						{
							"characterFormat": {},
							"text": "prevista "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "art. "
						},
						{
							"characterFormat": {},
							"text": "95.1 "
						},
						{
							"characterFormat": {},
							"text": "al "
						},
						{
							"characterFormat": {},
							"text": "menos "
						},
						{
							"characterFormat": {},
							"text": "cinco "
						},
						{
							"characterFormat": {},
							"text": "días "
						},
						{
							"characterFormat": {},
							"text": "antes "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "presentación "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "lista "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "acreedores."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"bold": true,
						"boldBidi": true
					},
					"inlines": [
						{
							"characterFormat": {},
							"text": "\t"
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "3.-"
						},
						{
							"characterFormat": {},
							"text": " "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "Se "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "abre "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "la "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "fase "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "de "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "liquidación "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "de "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "concurso "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "que "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "se "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "sustanciará "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "conforme "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "al "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "artículo "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "191 "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "ter "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "de "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "la "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "LC"
						},
						{
							"characterFormat": {},
							"text": " y "
						},
						{
							"characterFormat": {},
							"text": "fórmese "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "Sección "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "quinta"
						},
						{
							"characterFormat": {},
							"text": ", "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "forma "
						},
						{
							"characterFormat": {},
							"text": "prevista "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "Ley, "
						},
						{
							"characterFormat": {},
							"text": "ordenándose "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "cuantas "
						},
						{
							"characterFormat": {},
							"text": "piezas "
						},
						{
							"characterFormat": {},
							"text": "sean "
						},
						{
							"characterFormat": {},
							"text": "necesarias "
						},
						{
							"characterFormat": {},
							"text": "o "
						},
						{
							"characterFormat": {},
							"text": "convenientes "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "con "
						},
						{
							"characterFormat": {},
							"text": "testimonio "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "esta "
						},
						{
							"characterFormat": {},
							"text": "resolución."
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": " "
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "\t"
						},
						{
							"characterFormat": {},
							"text": "Se "
						},
						{
							"characterFormat": {},
							"text": "suspende "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "ejercicio "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "las "
						},
						{
							"characterFormat": {},
							"text": "funciones "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "administración "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "disposición "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "concursado "
						},
						{
							"characterFormat": {},
							"text": "sobre "
						},
						{
							"characterFormat": {},
							"text": "su "
						},
						{
							"characterFormat": {},
							"text": "patrimonio, "
						},
						{
							"characterFormat": {},
							"text": "con "
						},
						{
							"characterFormat": {},
							"text": "todos "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "efectos "
						},
						{
							"characterFormat": {},
							"text": "establecidos "
						},
						{
							"characterFormat": {},
							"text": "para "
						},
						{
							"characterFormat": {},
							"text": "ella "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "título "
						},
						{
							"characterFormat": {},
							"text": "III "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "LC."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "\t"
						},
						{
							"characterFormat": {},
							"text": "La "
						},
						{
							"characterFormat": {},
							"text": "apertura "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "liquidación "
						},
						{
							"characterFormat": {},
							"text": "produce "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "vencimiento "
						},
						{
							"characterFormat": {},
							"text": "anticipado "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "créditos "
						},
						{
							"characterFormat": {},
							"text": "concursales "
						},
						{
							"characterFormat": {},
							"text": "aplazados "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "conversión "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "dinero "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "aquéllos "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "consistan "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "otras "
						},
						{
							"characterFormat": {},
							"text": "prestaciones."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "\t"
						},
						{
							"characterFormat": {},
							"text": "El "
						},
						{
							"characterFormat": {},
							"text": "deudor "
						},
						{
							"characterFormat": {},
							"text": "deberá "
						},
						{
							"characterFormat": {},
							"text": "comparecer "
						},
						{
							"characterFormat": {},
							"text": "personalmente "
						},
						{
							"characterFormat": {},
							"text": "ante "
						},
						{
							"characterFormat": {},
							"text": "este "
						},
						{
							"characterFormat": {},
							"text": "Juzgado "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "ante "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "administración "
						},
						{
							"characterFormat": {},
							"text": "concursal "
						},
						{
							"characterFormat": {},
							"text": "cuantas "
						},
						{
							"characterFormat": {},
							"text": "veces "
						},
						{
							"characterFormat": {},
							"text": "sea "
						},
						{
							"characterFormat": {},
							"text": "requerido, "
						},
						{
							"characterFormat": {},
							"text": "así "
						},
						{
							"characterFormat": {},
							"text": "como "
						},
						{
							"characterFormat": {},
							"text": "colaborar "
						},
						{
							"characterFormat": {},
							"text": "e "
						},
						{
							"characterFormat": {},
							"text": "informar "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "todo "
						},
						{
							"characterFormat": {},
							"text": "lo "
						},
						{
							"characterFormat": {},
							"text": "necesario "
						},
						{
							"characterFormat": {},
							"text": "conveniente "
						},
						{
							"characterFormat": {},
							"text": "para "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "interés "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "concurso."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "\t"
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "4.- "
						},
						{
							"characterFormat": {},
							"text": "Se "
						},
						{
							"characterFormat": {},
							"text": "declara "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "disolución "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "entidad "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "concurso."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "5.- "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "La "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "Administración "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "concursal "
						},
						{
							"characterFormat": {},
							"text": "estará "
						},
						{
							"characterFormat": {},
							"text": "integrada "
						},
						{
							"characterFormat": {},
							"text": "por "
						},
						{
							"characterFormat": {},
							"text": "un "
						},
						{
							"characterFormat": {},
							"text": "único "
						},
						{
							"characterFormat": {},
							"text": "miembro, "
						},
						{
							"characterFormat": {},
							"text": "nombrándose "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "D. "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_402_13880593"
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "INSERTAR "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "NOMBRE"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_402_13880593"
						},
						{
							"characterFormat": {},
							"text": " en "
						},
						{
							"characterFormat": {},
							"text": "su "
						},
						{
							"characterFormat": {},
							"text": "condición "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_402_13900140"
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "ECONOMISTA/ABOGADO"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_402_13900140"
						},
						{
							"characterFormat": {},
							"text": ", "
						},
						{
							"characterFormat": {},
							"text": "inscrito "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "las "
						},
						{
							"characterFormat": {},
							"text": "listas "
						},
						{
							"characterFormat": {},
							"text": "remitidas "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "efectos "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "art.27.3 "
						},
						{
							"characterFormat": {},
							"text": "LC "
						},
						{
							"characterFormat": {},
							"text": "por "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "correspondiente "
						},
						{
							"characterFormat": {},
							"text": "Colegio. "
						},
						{
							"characterFormat": {},
							"text": "Comuníquese "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "nombramiento "
						},
						{
							"characterFormat": {},
							"text": "al "
						},
						{
							"characterFormat": {},
							"text": "designado "
						},
						{
							"characterFormat": {},
							"text": "haciéndole "
						},
						{
							"characterFormat": {},
							"text": "saber "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "mayor "
						},
						{
							"characterFormat": {},
							"text": "brevedad "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "todo "
						},
						{
							"characterFormat": {},
							"text": "caso "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "plazo "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "cinco "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "días "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "siguientes"
						},
						{
							"characterFormat": {},
							"text": " al "
						},
						{
							"characterFormat": {},
							"text": "recibo "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "comunicación "
						},
						{
							"characterFormat": {},
							"text": "deberá "
						},
						{
							"characterFormat": {},
							"text": "comparecer "
						},
						{
							"characterFormat": {},
							"text": "ante "
						},
						{
							"characterFormat": {},
							"text": "este "
						},
						{
							"characterFormat": {},
							"text": "Juzgado "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "manifestar "
						},
						{
							"characterFormat": {},
							"text": "su "
						},
						{
							"characterFormat": {},
							"text": "aceptación "
						},
						{
							"characterFormat": {},
							"text": "o "
						},
						{
							"characterFormat": {},
							"text": "no "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "cargo"
						}
					]
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "\t"
						},
						{
							"characterFormat": {},
							"text": "Hasta "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "aceptación "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "administrador "
						},
						{
							"characterFormat": {},
							"text": "concursal "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "deudor "
						},
						{
							"characterFormat": {},
							"text": "podrá "
						},
						{
							"characterFormat": {},
							"text": "realizar "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "actos "
						},
						{
							"characterFormat": {},
							"text": "propios "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "su "
						},
						{
							"characterFormat": {},
							"text": "giro "
						},
						{
							"characterFormat": {},
							"text": "o "
						},
						{
							"characterFormat": {},
							"text": "tráfico "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "sean "
						},
						{
							"characterFormat": {},
							"text": "imprescindibles "
						},
						{
							"characterFormat": {},
							"text": "para "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "continuación "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "su "
						},
						{
							"characterFormat": {},
							"text": "actividad, "
						},
						{
							"characterFormat": {},
							"text": "siempre "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "se "
						},
						{
							"characterFormat": {},
							"text": "ajusten "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "las "
						},
						{
							"characterFormat": {},
							"text": "condiciones "
						},
						{
							"characterFormat": {},
							"text": "normales "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "mercado."
						}
					]
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "6.- "
						},
						{
							"characterFormat": {},
							"text": "De "
						},
						{
							"characterFormat": {},
							"text": "conformidad "
						},
						{
							"characterFormat": {},
							"text": "con "
						},
						{
							"characterFormat": {},
							"text": "lo "
						},
						{
							"characterFormat": {},
							"text": "dispuesto "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "artículos "
						},
						{
							"characterFormat": {},
							"text": "21. "
						},
						{
							"characterFormat": {},
							"text": "1. "
						},
						{
							"characterFormat": {},
							"text": "5º "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "Ley "
						},
						{
							"characterFormat": {},
							"text": "Concursal "
						},
						{
							"characterFormat": {},
							"text": "se "
						},
						{
							"characterFormat": {},
							"text": "llama "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "todos "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "acreedores "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "entidad "
						},
						{
							"characterFormat": {},
							"text": "cuyo "
						},
						{
							"characterFormat": {},
							"text": "concurso "
						},
						{
							"characterFormat": {},
							"text": "se "
						},
						{
							"characterFormat": {},
							"text": "declara "
						},
						{
							"characterFormat": {},
							"text": "para "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "plazo "
						},
						{
							"characterFormat": {},
							"text": "de"
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": " UN "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "MES"
						},
						{
							"characterFormat": {},
							"text": " "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "a "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "contar "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "desde "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "el "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "día "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "siguiente "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "a "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "la "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "publicación "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "en "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "el "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "«Boletín "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "Oficial "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "del "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "Estado» "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "del "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "auto "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "de "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "declaración "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "de "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "concurso"
						},
						{
							"characterFormat": {},
							"text": ", "
						},
						{
							"characterFormat": {},
							"text": "comuniquen "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "administración "
						},
						{
							"characterFormat": {},
							"text": "concursal "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "existencia "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "sus "
						},
						{
							"characterFormat": {},
							"text": "créditos, "
						},
						{
							"characterFormat": {},
							"text": "por "
						},
						{
							"characterFormat": {},
							"text": "escrito "
						},
						{
							"characterFormat": {},
							"text": "firmado "
						},
						{
							"characterFormat": {},
							"text": "por "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "acreedor, "
						},
						{
							"characterFormat": {},
							"text": "por "
						},
						{
							"characterFormat": {},
							"text": "cualquier "
						},
						{
							"characterFormat": {},
							"text": "otro "
						},
						{
							"characterFormat": {},
							"text": "interesado "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "crédito "
						},
						{
							"characterFormat": {},
							"text": "o "
						},
						{
							"characterFormat": {},
							"text": "por "
						},
						{
							"characterFormat": {},
							"text": "quien "
						},
						{
							"characterFormat": {},
							"text": "acredite "
						},
						{
							"characterFormat": {},
							"text": "representación "
						},
						{
							"characterFormat": {},
							"text": "suficiente "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "ellos, "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "se "
						},
						{
							"characterFormat": {},
							"text": "expresará "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "nombre, "
						},
						{
							"characterFormat": {},
							"text": "domicilio, "
						},
						{
							"characterFormat": {},
							"text": "correo "
						},
						{
							"characterFormat": {},
							"text": "electrónico "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "demás "
						},
						{
							"characterFormat": {},
							"text": "datos "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "identidad "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "acreedor, "
						},
						{
							"characterFormat": {},
							"text": "así "
						},
						{
							"characterFormat": {},
							"text": "como "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "relativos "
						},
						{
							"characterFormat": {},
							"text": "al "
						},
						{
							"characterFormat": {},
							"text": "crédito, "
						},
						{
							"characterFormat": {},
							"text": "concepto, "
						},
						{
							"characterFormat": {},
							"text": "cuantía, "
						},
						{
							"characterFormat": {},
							"text": "fechas "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "adquisición "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "vencimiento, "
						},
						{
							"characterFormat": {},
							"text": "características "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "calificación "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "se "
						},
						{
							"characterFormat": {},
							"text": "pretenda "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "caso "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "invocarse "
						},
						{
							"characterFormat": {},
							"text": "un "
						},
						{
							"characterFormat": {},
							"text": "privilegio "
						},
						{
							"characterFormat": {},
							"text": "especial, "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "bienes "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "derechos "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "afecte "
						},
						{
							"characterFormat": {},
							"text": "y, "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "su "
						},
						{
							"characterFormat": {},
							"text": "caso, "
						},
						{
							"characterFormat": {},
							"text": "datos "
						},
						{
							"characterFormat": {},
							"text": "registrales, "
						},
						{
							"characterFormat": {},
							"text": "todo "
						},
						{
							"characterFormat": {},
							"text": "ello "
						},
						{
							"characterFormat": {},
							"text": "acompañado "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "originales "
						},
						{
							"characterFormat": {},
							"text": "o "
						},
						{
							"characterFormat": {},
							"text": "copia "
						},
						{
							"characterFormat": {},
							"text": "auténtica "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "título "
						},
						{
							"characterFormat": {},
							"text": "o "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "documentos "
						},
						{
							"characterFormat": {},
							"text": "relativos "
						},
						{
							"characterFormat": {},
							"text": "al "
						},
						{
							"characterFormat": {},
							"text": "crédito."
						}
					]
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "\t"
						},
						{
							"characterFormat": {},
							"text": "La "
						},
						{
							"characterFormat": {},
							"text": "administración "
						},
						{
							"characterFormat": {},
							"text": "concursal "
						},
						{
							"characterFormat": {},
							"text": "realizará "
						},
						{
							"characterFormat": {},
							"text": "sin "
						},
						{
							"characterFormat": {},
							"text": "demora "
						},
						{
							"characterFormat": {},
							"text": "una "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "comunicación "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "individualizada"
						},
						{
							"characterFormat": {},
							"text": " a "
						},
						{
							"characterFormat": {},
							"text": "cada "
						},
						{
							"characterFormat": {},
							"text": "uno "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "acreedores "
						},
						{
							"characterFormat": {},
							"text": "cuya "
						},
						{
							"characterFormat": {},
							"text": "identidad, "
						},
						{
							"characterFormat": {},
							"text": "domicilio "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "dirección "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "electrónica"
						},
						{
							"characterFormat": {},
							"text": " consten "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "concurso, "
						},
						{
							"characterFormat": {},
							"text": "informándoles "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "declaración "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "éste "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "deber "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "comunicar "
						},
						{
							"characterFormat": {},
							"text": "sus "
						},
						{
							"characterFormat": {},
							"text": "créditos "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "forma "
						},
						{
							"characterFormat": {},
							"text": "establecida "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "artículo "
						},
						{
							"characterFormat": {},
							"text": "85."
						}
					]
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"rightIndent": 2.200000047683716,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "\t"
						},
						{
							"characterFormat": {},
							"text": "Además, "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "administración "
						},
						{
							"characterFormat": {},
							"text": "concursal "
						},
						{
							"characterFormat": {},
							"text": "informará "
						},
						{
							"characterFormat": {},
							"text": "sin "
						},
						{
							"characterFormat": {},
							"text": "demora, "
						},
						{
							"characterFormat": {},
							"text": "por "
						},
						{
							"characterFormat": {},
							"text": "escrito "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "mediante "
						},
						{
							"characterFormat": {},
							"text": "envío "
						},
						{
							"characterFormat": {},
							"text": "individualizado, "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "acreedores"
						},
						{
							"characterFormat": {},
							"text": " conocidos "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "tengan "
						},
						{
							"characterFormat": {},
							"text": "su "
						},
						{
							"characterFormat": {},
							"text": "residencia "
						},
						{
							"characterFormat": {},
							"text": "habitual, "
						},
						{
							"characterFormat": {},
							"text": "domicilio "
						},
						{
							"characterFormat": {},
							"text": "o "
						},
						{
							"characterFormat": {},
							"text": "sede "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "en "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "el "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "extranjero"
						},
						{
							"characterFormat": {},
							"text": ", "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "extremos "
						},
						{
							"characterFormat": {},
							"text": "previstos "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "art. "
						},
						{
							"characterFormat": {},
							"text": "214.2 "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "Ley "
						},
						{
							"characterFormat": {},
							"text": "Concursal."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"bold": true,
						"boldBidi": true
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "\t"
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "7.- "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "Una "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "vez "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "acepte "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "la "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "Administración "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "concursal "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "el "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "cargo, "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "hágase "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "pública "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "la "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "presente "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "declaración "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "de "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "concurso "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "de "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "forma "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "gratuita "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "y"
						},
						{
							"characterFormat": {},
							"text": " en "
						},
						{
							"characterFormat": {},
							"text": "extracto "
						},
						{
							"characterFormat": {},
							"text": "por "
						},
						{
							"characterFormat": {},
							"text": "medio "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "edictos "
						},
						{
							"characterFormat": {},
							"text": "conteniendo "
						},
						{
							"characterFormat": {},
							"text": "únicamente "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "datos "
						},
						{
							"characterFormat": {},
							"text": "indispensables "
						},
						{
							"characterFormat": {},
							"text": "para "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "identificación "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "concursado, "
						},
						{
							"characterFormat": {},
							"text": "incluyendo "
						},
						{
							"characterFormat": {},
							"text": "su "
						},
						{
							"characterFormat": {},
							"text": "NIF, "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "juzgado "
						},
						{
							"characterFormat": {},
							"text": "competente, "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "número "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "autos, "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "Número "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "Identificación "
						},
						{
							"characterFormat": {},
							"text": "General "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "procedimiento, "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "fecha "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "auto "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "declaración "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "concurso, "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "plazo "
						},
						{
							"characterFormat": {},
							"text": "establecido "
						},
						{
							"characterFormat": {},
							"text": "para "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "comunicación "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "créditos, "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "identidad "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "administradores "
						},
						{
							"characterFormat": {},
							"text": "concursales, "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "domicilio "
						},
						{
							"characterFormat": {},
							"text": "postal "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "dirección "
						},
						{
							"characterFormat": {},
							"text": "electrónica "
						},
						{
							"characterFormat": {},
							"text": "señalados "
						},
						{
							"characterFormat": {},
							"text": "para "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "acreedores, "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "su "
						},
						{
							"characterFormat": {},
							"text": "elección, "
						},
						{
							"characterFormat": {},
							"text": "efectúen "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "comunicación "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "créditos "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "conformidad "
						},
						{
							"characterFormat": {},
							"text": "con "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "artículo "
						},
						{
							"characterFormat": {},
							"text": "85, "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "régimen "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "suspensión "
						},
						{
							"characterFormat": {},
							"text": "o "
						},
						{
							"characterFormat": {},
							"text": "intervención "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "facultades "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "concursado "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "Dirección "
						},
						{
							"characterFormat": {},
							"text": "electrónica "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "Registro "
						},
						{
							"characterFormat": {},
							"text": "Público "
						},
						{
							"characterFormat": {},
							"text": "concursal "
						},
						{
							"characterFormat": {},
							"text": "donde "
						},
						{
							"characterFormat": {},
							"text": "se "
						},
						{
							"characterFormat": {},
							"text": "publicarán "
						},
						{
							"characterFormat": {},
							"text": "las "
						},
						{
							"characterFormat": {},
							"text": "resoluciones "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "traigan "
						},
						{
							"characterFormat": {},
							"text": "causa "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "concurso, "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "se "
						},
						{
							"characterFormat": {},
							"text": "insertarán "
						},
						{
							"characterFormat": {},
							"text": "con "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "mayor "
						},
						{
							"characterFormat": {},
							"text": "urgencia "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "Boletín "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "Oficial "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "del "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "Estado."
						},
						{
							"characterFormat": {},
							"text": " "
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontColor": "#000000FF"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "\t"
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "Dese "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "publicidad "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "a "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "la "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "presente "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "resolución "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "mediante "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "publicación "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "en "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "el "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontColor": "#000000FF",
								"boldBidi": true
							},
							"text": "RPC"
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontColor": "#000000FF"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontColor": "#000000FF"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "De "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "conformidad "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "con "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "lo "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "dispuesto "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "en "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "el "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "Art. "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "8.1 "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "del "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "R.D. "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "829/13 "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "de "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "15 "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "de "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "Noviembre"
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": " por "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "el "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "que "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "se "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "regula "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "el "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "RPC, "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "no "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "siendo "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "hasta "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "el "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "momento "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "posible "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "el "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "traslado "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "de "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "las "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "resoluciones "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "a "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "través "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "de "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "la "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "aplicación "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "electrónica, "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "entréguese "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "la "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "documentación "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "necesaria "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "para "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "su "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "publicidad "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "en "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "el "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "RPC "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "al "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "Procurador "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "del "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "solicitante "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "del "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "concurso "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "para "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "su "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "inmediata "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "remisión "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "al "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "RPC, "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontColor": "#000000FF",
								"boldBidi": true
							},
							"text": "haciendo "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontColor": "#000000FF",
								"boldBidi": true
							},
							"text": "constar "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontColor": "#000000FF",
								"boldBidi": true
							},
							"text": "que "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontColor": "#000000FF",
								"boldBidi": true
							},
							"text": "la "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontColor": "#000000FF",
								"boldBidi": true
							},
							"text": "presente "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontColor": "#000000FF",
								"boldBidi": true
							},
							"text": "resolución "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontColor": "#000000FF",
								"boldBidi": true
							},
							"text": "no "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontColor": "#000000FF",
								"boldBidi": true
							},
							"text": "es "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontColor": "#000000FF",
								"boldBidi": true
							},
							"text": "firme"
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "Líbrense "
						},
						{
							"characterFormat": {},
							"text": "al "
						},
						{
							"characterFormat": {},
							"text": "procurador "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "solicitante "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "oficios "
						},
						{
							"characterFormat": {},
							"text": "con "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "edictos "
						},
						{
							"characterFormat": {},
							"text": "correspondientes, "
						},
						{
							"characterFormat": {},
							"text": "apercibiéndole "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "su "
						},
						{
							"characterFormat": {},
							"text": "cumplimentación "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "remisión "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "inmediato "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "anteriores "
						},
						{
							"characterFormat": {},
							"text": "medios "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "publicidad "
						},
						{
							"characterFormat": {},
							"text": "acordados, "
						},
						{
							"characterFormat": {},
							"text": "cosa "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "deberá "
						},
						{
							"characterFormat": {},
							"text": "acreditar "
						},
						{
							"characterFormat": {},
							"text": "haber "
						},
						{
							"characterFormat": {},
							"text": "hecho "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "plazo "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "DIEZ "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "DÍAS"
						},
						{
							"characterFormat": {},
							"text": "."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "8.- "
						},
						{
							"characterFormat": {},
							"text": "Siendo "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "solicitante "
						},
						{
							"characterFormat": {},
							"text": "sujeto "
						},
						{
							"characterFormat": {},
							"text": "inscribible "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "Registro "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "Mercantil"
						},
						{
							"characterFormat": {},
							"text": " líbrese "
						},
						{
							"characterFormat": {},
							"text": "mandamiento "
						},
						{
							"characterFormat": {},
							"text": "por "
						},
						{
							"characterFormat": {},
							"text": "duplicado "
						},
						{
							"characterFormat": {},
							"text": "al "
						},
						{
							"characterFormat": {},
							"text": "Registro "
						},
						{
							"characterFormat": {},
							"text": "Mercantil "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "provincia "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "Navarra, "
						},
						{
							"characterFormat": {},
							"text": "haciéndole "
						},
						{
							"characterFormat": {},
							"text": "saber "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "declaración "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "concurso "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_101_1531375"
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "Nombre "
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "y "
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "apellidos:Demandante"
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": " "
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_101_1531375"
						},
						{
							"characterFormat": {},
							"text": " "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "suspensión "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "ejercicio "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "sus "
						},
						{
							"characterFormat": {},
							"text": "facultades "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "administración "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "disposición "
						},
						{
							"characterFormat": {},
							"text": "respecto "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "su "
						},
						{
							"characterFormat": {},
							"text": "patrimonio, "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "nombramiento "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "administrador "
						},
						{
							"characterFormat": {},
							"text": "concursal "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "apertura "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "liquidación "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "disolución "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "ordenándose "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "inscripción "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "las "
						},
						{
							"characterFormat": {},
							"text": "anteriores "
						},
						{
							"characterFormat": {},
							"text": "circunstancias "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "hoja "
						},
						{
							"characterFormat": {},
							"text": "abierta "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "a"
						},
						{
							"characterFormat": {},
							"text": " "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_101_1571093"
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "Nombre "
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "y "
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "apellidos:Demandante"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_101_1571093"
						},
						{
							"characterFormat": {},
							"text": ", "
						},
						{
							"characterFormat": {},
							"text": "con "
						},
						{
							"characterFormat": {},
							"text": "NIF "
						},
						{
							"characterFormat": {},
							"text": "nº"
						},
						{
							"characterFormat": {},
							"text": " "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_103_22389468"
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": "Identificación:Demandante"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_103_22389468"
						},
						{
							"characterFormat": {
								"styleName": "Campos"
							},
							"text": ","
						},
						{
							"characterFormat": {},
							"text": " "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_402_14798296"
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "inscrita "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "al "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "tomo, "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "folio, "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "hoja, "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "inscripción"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_402_14798296"
						},
						{
							"characterFormat": {},
							"text": ". "
						},
						{
							"characterFormat": {},
							"text": "Entréguense "
						},
						{
							"characterFormat": {},
							"text": "al "
						},
						{
							"characterFormat": {},
							"text": "Procurador "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "solicitante "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "mandamientos "
						},
						{
							"characterFormat": {},
							"text": "correspondientes "
						},
						{
							"characterFormat": {},
							"text": "para "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "práctica "
						},
						{
							"characterFormat": {},
							"text": "inmediata "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "asientos "
						},
						{
							"characterFormat": {},
							"text": "acordados."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontColor": "#0000FFFF"
					},
					"inlines": [
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "G_1354735000"
						},
						{
							"characterFormat": {
								"fontColor": "#0000FFFF"
							},
							"text": "Elegir "
						},
						{
							"characterFormat": {
								"fontColor": "#0000FFFF"
							},
							"text": "Párrafo"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "G_1354735000"
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontColor": "#000000FF"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "9.- "
						},
						{
							"characterFormat": {},
							"text": "Hágase "
						},
						{
							"characterFormat": {},
							"text": "saber "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "declaración "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "concurso "
						},
						{
							"characterFormat": {},
							"text": "al "
						},
						{
							"characterFormat": {},
							"text": "Juzgado "
						},
						{
							"characterFormat": {},
							"text": "Decano "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "F_402_21500671"
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "PAMPLONA "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "Y "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "partido "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "judicial "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "donde "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "tenga "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "el "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "domicilio "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "la "
						},
						{
							"characterFormat": {
								"styleName": "Avisos"
							},
							"text": "concursada"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "F_402_21500671"
						},
						{
							"characterFormat": {},
							"text": " para "
						},
						{
							"characterFormat": {},
							"text": "su "
						},
						{
							"characterFormat": {},
							"text": "comunicación "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "Juzgados "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "Primera "
						},
						{
							"characterFormat": {},
							"text": "Instancia "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "lo "
						},
						{
							"characterFormat": {},
							"text": "Social "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "efectos "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "arts. "
						},
						{
							"characterFormat": {},
							"text": "50 "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "55 "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "Ley "
						},
						{
							"characterFormat": {},
							"text": "Concursal."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"firstLineIndent": 36,
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "10.- "
						},
						{
							"characterFormat": {},
							"text": "Cítese "
						},
						{
							"characterFormat": {},
							"text": "como "
						},
						{
							"characterFormat": {},
							"text": "parte "
						},
						{
							"characterFormat": {},
							"text": "al "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "FONDO "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "DE "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "GARANTÍA "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "SALARIAL"
						},
						{
							"characterFormat": {},
							"text": " mediante "
						},
						{
							"characterFormat": {},
							"text": "notificación "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "presente "
						},
						{
							"characterFormat": {},
							"text": "resolución "
						},
						{
							"characterFormat": {},
							"text": "por "
						},
						{
							"characterFormat": {},
							"text": "si "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "proceso "
						},
						{
							"characterFormat": {},
							"text": "pudiera "
						},
						{
							"characterFormat": {},
							"text": "derivarse "
						},
						{
							"characterFormat": {},
							"text": "su "
						},
						{
							"characterFormat": {},
							"text": "responsabilidad "
						},
						{
							"characterFormat": {},
							"text": "para "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "abono "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "salarios "
						},
						{
							"characterFormat": {},
							"text": "o "
						},
						{
							"characterFormat": {},
							"text": "indemnizaciones "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "trabajadores."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "MODO "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "DE "
						},
						{
							"characterFormat": {
								"bold": true,
								"boldBidi": true
							},
							"text": "IMPUGNACIÓN"
						},
						{
							"characterFormat": {},
							"text": ":"
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "\t"
						},
						{
							"characterFormat": {},
							"text": "1.- "
						},
						{
							"characterFormat": {},
							"text": "Contra "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "DECLARACIÓN "
						},
						{
							"characterFormat": {},
							"text": "DE "
						},
						{
							"characterFormat": {},
							"text": "CONCURSO "
						},
						{
							"characterFormat": {},
							"text": "cabe, "
						},
						{
							"characterFormat": {},
							"text": "por "
						},
						{
							"characterFormat": {},
							"text": "quien "
						},
						{
							"characterFormat": {},
							"text": "acredite "
						},
						{
							"characterFormat": {},
							"text": "interés "
						},
						{
							"characterFormat": {},
							"text": "legítimo, "
						},
						{
							"characterFormat": {},
							"text": "RECURSO "
						},
						{
							"characterFormat": {},
							"text": "DE "
						},
						{
							"characterFormat": {},
							"text": "APELACIÓN "
						},
						{
							"characterFormat": {},
							"text": "ante "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "Audiencia "
						},
						{
							"characterFormat": {},
							"text": "Provincial, "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "no "
						},
						{
							"characterFormat": {},
							"text": "tendrá "
						},
						{
							"characterFormat": {},
							"text": "carácter "
						},
						{
							"characterFormat": {},
							"text": "suspensivo."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "\t"
						},
						{
							"characterFormat": {},
							"text": "El "
						},
						{
							"characterFormat": {},
							"text": "recurso "
						},
						{
							"characterFormat": {},
							"text": "se "
						},
						{
							"characterFormat": {},
							"text": "interpondrá "
						},
						{
							"characterFormat": {},
							"text": "por "
						},
						{
							"characterFormat": {},
							"text": "medido "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "escrito "
						},
						{
							"characterFormat": {},
							"text": "presentado "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "este "
						},
						{
							"characterFormat": {},
							"text": "Juzgado "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "plazo "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "VEINTE "
						},
						{
							"characterFormat": {},
							"text": "DÍAS, "
						},
						{
							"characterFormat": {},
							"text": "contados "
						},
						{
							"characterFormat": {},
							"text": "desde "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "última "
						},
						{
							"characterFormat": {},
							"text": "publicación "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "anuncio "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "declaración "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "concurso "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "limitado "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "citar "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "resolución "
						},
						{
							"characterFormat": {},
							"text": "recurrida."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "\t"
						},
						{
							"characterFormat": {},
							"text": "2.- "
						},
						{
							"characterFormat": {},
							"text": "Contra "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "DEMÁS "
						},
						{
							"characterFormat": {},
							"text": "PRONUNCIAMIENTOS "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "auto "
						},
						{
							"characterFormat": {},
							"text": "cabe "
						},
						{
							"characterFormat": {},
							"text": "RECURSO "
						},
						{
							"characterFormat": {},
							"text": "DE "
						},
						{
							"characterFormat": {},
							"text": "REPOSICIÓN "
						},
						{
							"characterFormat": {},
							"text": "por "
						},
						{
							"characterFormat": {},
							"text": "medio "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "escrito "
						},
						{
							"characterFormat": {},
							"text": "presentado "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "este "
						},
						{
							"characterFormat": {},
							"text": "Juzgado, "
						},
						{
							"characterFormat": {},
							"text": "no "
						},
						{
							"characterFormat": {},
							"text": "obstante"
						},
						{
							"characterFormat": {},
							"text": " lo "
						},
						{
							"characterFormat": {},
							"text": "cual "
						},
						{
							"characterFormat": {},
							"text": "se "
						},
						{
							"characterFormat": {},
							"text": "llevará "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "efecto "
						},
						{
							"characterFormat": {},
							"text": "lo "
						},
						{
							"characterFormat": {},
							"text": "acordado, "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "plazo "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "CINCO "
						},
						{
							"characterFormat": {},
							"text": "DÍAS, "
						},
						{
							"characterFormat": {},
							"text": "computados, "
						},
						{
							"characterFormat": {},
							"text": "para "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "deudor "
						},
						{
							"characterFormat": {},
							"text": "desde "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "notificación "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "auto "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "para "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "demás "
						},
						{
							"characterFormat": {},
							"text": "legitimados "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "forma "
						},
						{
							"characterFormat": {},
							"text": "expresada "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "apartado "
						},
						{
							"characterFormat": {},
							"text": "anterior, "
						},
						{
							"characterFormat": {},
							"text": "con "
						},
						{
							"characterFormat": {},
							"text": "expresión "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "infracción "
						},
						{
							"characterFormat": {},
							"text": "cometida "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "juicio "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "recurrente, "
						},
						{
							"characterFormat": {},
							"text": "sin "
						},
						{
							"characterFormat": {},
							"text": "cuyos "
						},
						{
							"characterFormat": {},
							"text": "requisitos "
						},
						{
							"characterFormat": {},
							"text": "no "
						},
						{
							"characterFormat": {},
							"text": "se "
						},
						{
							"characterFormat": {},
							"text": "admitirá "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "trámite "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "recurso "
						},
						{
							"characterFormat": {},
							"text": "(artículos "
						},
						{
							"characterFormat": {},
							"text": "20.2 "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "197 "
						},
						{
							"characterFormat": {},
							"text": "LC "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "452 "
						},
						{
							"characterFormat": {},
							"text": "LEC)."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "\t"
						},
						{
							"characterFormat": {},
							"text": "Lo "
						},
						{
							"characterFormat": {},
							"text": "acuerda "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "firma "
						},
						{
							"characterFormat": {},
							"text": "S.Sª"
						},
						{
							"characterFormat": {},
							"text": ", "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "Ilma. "
						},
						{
							"characterFormat": {},
							"text": "Sra. "
						},
						{
							"characterFormat": {},
							"text": "Dña. "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "TF_204_228723"
						},
						{
							"characterFormat": {
								"fontColor": "#0000FFFF"
							},
							"text": "Nombre "
						},
						{
							"characterFormat": {
								"fontColor": "#0000FFFF"
							},
							"text": "Juez"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "TF_204_228723"
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": ", "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "Magistrada "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "Titular "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "del "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "TF_201_256051"
						},
						{
							"characterFormat": {
								"fontColor": "#0000FFFF"
							},
							"text": "Juzgado "
						},
						{
							"characterFormat": {
								"fontColor": "#0000FFFF"
							},
							"text": "de "
						},
						{
							"characterFormat": {
								"fontColor": "#0000FFFF"
							},
							"text": "Primera "
						},
						{
							"characterFormat": {
								"fontColor": "#0000FFFF"
							},
							"text": "Instancia "
						},
						{
							"characterFormat": {
								"fontColor": "#0000FFFF"
							},
							"text": "Nº "
						},
						{
							"characterFormat": {
								"fontColor": "#0000FFFF"
							},
							"text": "1"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "TF_201_256051"
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": ". "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "Doy "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "fe"
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"rows": [
						{
							"cells": [
								{
									"blocks": [
										{
											"paragraphFormat": {
												"styleName": "Normal",
												"listFormat": {}
											},
											"characterFormat": {
												"fontColor": "#000000FF"
											},
											"inlines": [
												{
													"characterFormat": {},
													"text": "El/la "
												},
												{
													"characterFormat": {},
													"bookmarkType": 0,
													"name": "TF_203_102247"
												},
												{
													"characterFormat": {
														"fontColor": "#0000FFFF"
													},
													"text": "Tratamiento Juez"
												},
												{
													"characterFormat": {},
													"bookmarkType": 1,
													"name": "TF_203_102247"
												}
											]
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"topMargin": 0,
										"rightMargin": 5.400000095367432,
										"leftMargin": 5.400000095367432,
										"bottomMargin": 0,
										"preferredWidth": 167.39999389648438,
										"preferredWidthType": "Point",
										"cellWidth": 167.39999389648438,
										"columnSpan": 1,
										"rowSpan": 1,
										"verticalAlignment": "Top"
									},
									"columnIndex": 0
								},
								{
									"blocks": [
										{
											"paragraphFormat": {
												"styleName": "Normal",
												"listFormat": {}
											},
											"characterFormat": {},
											"inlines": [
												{
													"characterFormat": {},
													"text": "El/La Letrado de la Administración de Justicia"
												}
											]
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"topMargin": 0,
										"rightMargin": 5.400000095367432,
										"leftMargin": 5.400000095367432,
										"bottomMargin": 0,
										"preferredWidth": 264.79998779296877,
										"preferredWidthType": "Point",
										"cellWidth": 264.79998779296877,
										"columnSpan": 1,
										"rowSpan": 1,
										"verticalAlignment": "Top"
									},
									"columnIndex": 1
								}
							],
							"rowFormat": {
								"height": 1,
								"allowBreakAcrossPages": true,
								"heightType": "AtLeast",
								"isHeader": false,
								"borders": {
									"top": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"left": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"right": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"bottom": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalDown": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalUp": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"horizontal": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"vertical": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									}
								},
								"gridBefore": 0,
								"gridAfter": 0
							}
						}
					],
					"grid": [
						167.39999389648438,
						264.79998779296877
					],
					"tableFormat": {
						"borders": {
							"top": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"left": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"right": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"bottom": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"diagonalDown": {
								"hasNoneStyle": false,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"diagonalUp": {
								"hasNoneStyle": false,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"horizontal": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"vertical": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							}
						},
						"shading": {},
						"leftIndent": 0,
						"tableAlignment": "Left",
						"topMargin": 0,
						"rightMargin": 5.4,
						"leftMargin": 5.4,
						"bottomMargin": 0,
						"preferredWidthType": "Auto",
						"bidi": false,
						"allowAutoFit": true
					},
					"description": null,
					"title": null,
					"columnCount": 2
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"fontColor": "#000000FF",
								"boldBidi": true
							},
							"text": "DEPÓSITO "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontColor": "#000000FF",
								"boldBidi": true
							},
							"text": "PARA "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontColor": "#000000FF",
								"boldBidi": true
							},
							"text": "RECURRIR "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontColor": "#000000FF",
								"boldBidi": true
							},
							"text": "APELACIÓN: "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "Deberá"
						},
						{
							"characterFormat": {},
							"text": " acreditarse "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "momento "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "anuncio "
						},
						{
							"characterFormat": {},
							"text": "haber "
						},
						{
							"characterFormat": {},
							"text": "consignado "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "cuenta "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "depósitos "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "consignaciones "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "este "
						},
						{
							"characterFormat": {},
							"text": "órgano "
						},
						{
							"characterFormat": {},
							"text": "abierta "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "TF_402_577186"
						},
						{
							"characterFormat": {
								"fontColor": "#FF0000FF"
							},
							"text": "BANCO "
						},
						{
							"characterFormat": {
								"fontColor": "#FF0000FF"
							},
							"text": "SANTANDER"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "TF_402_577186"
						},
						{
							"characterFormat": {
								"fontColor": "#FF0000FF"
							},
							"text": "  "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "TF_225_615060"
						},
						{
							"characterFormat": {
								"fontColor": "#0000FFFF"
							},
							"text": "Cuenta "
						},
						{
							"characterFormat": {
								"fontColor": "#0000FFFF"
							},
							"text": "Bancaria"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "TF_225_615060"
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": ","
						},
						{
							"characterFormat": {},
							"text": " la "
						},
						{
							"characterFormat": {},
							"text": "suma "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "50 "
						},
						{
							"characterFormat": {},
							"text": "EUROS "
						},
						{
							"characterFormat": {},
							"text": "con "
						},
						{
							"characterFormat": {},
							"text": "apercibimiento "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "no "
						},
						{
							"characterFormat": {},
							"text": "verificarlo "
						},
						{
							"characterFormat": {},
							"text": "no "
						},
						{
							"characterFormat": {},
							"text": "se "
						},
						{
							"characterFormat": {},
							"text": "admitirá "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "trámite "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "recurso "
						},
						{
							"characterFormat": {},
							"text": "pretendido; "
						},
						{
							"characterFormat": {},
							"text": "salvo "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "recurrente "
						},
						{
							"characterFormat": {},
							"text": "sea: "
						},
						{
							"characterFormat": {},
							"text": "beneficiario "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "justicia "
						},
						{
							"characterFormat": {},
							"text": "gratuita, "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "Ministerio "
						},
						{
							"characterFormat": {},
							"text": "Fiscal, "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "Estado, "
						},
						{
							"characterFormat": {},
							"text": "Comunidad "
						},
						{
							"characterFormat": {},
							"text": "Autónoma, "
						},
						{
							"characterFormat": {},
							"text": "entidad "
						},
						{
							"characterFormat": {},
							"text": "local "
						},
						{
							"characterFormat": {},
							"text": "u "
						},
						{
							"characterFormat": {},
							"text": "organismo "
						},
						{
							"characterFormat": {},
							"text": "autónomo "
						},
						{
							"characterFormat": {},
							"text": "dependiente "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "alguno "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "anteriores."
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"fontColor": "#000000FF",
								"boldBidi": true
							},
							"text": "DEPOSITO "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontColor": "#000000FF",
								"boldBidi": true
							},
							"text": "PARA "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontColor": "#000000FF",
								"boldBidi": true
							},
							"text": "RECURRIR "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontColor": "#000000FF",
								"boldBidi": true
							},
							"text": "REPOSICIÓN: "
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": "Deberá"
						},
						{
							"characterFormat": {},
							"text": " acreditarse "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "momento "
						},
						{
							"characterFormat": {},
							"text": "del "
						},
						{
							"characterFormat": {},
							"text": "anuncio "
						},
						{
							"characterFormat": {},
							"text": "haber "
						},
						{
							"characterFormat": {},
							"text": "consignado "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"text": "la "
						},
						{
							"characterFormat": {},
							"text": "cuenta "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "depósitos "
						},
						{
							"characterFormat": {},
							"text": "y "
						},
						{
							"characterFormat": {},
							"text": "consignaciones "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "este "
						},
						{
							"characterFormat": {},
							"text": "órgano "
						},
						{
							"characterFormat": {},
							"text": "abierta "
						},
						{
							"characterFormat": {},
							"text": "en "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "TF_402_629560"
						},
						{
							"characterFormat": {
								"fontColor": "#FF0000FF"
							},
							"text": "BANCO "
						},
						{
							"characterFormat": {
								"fontColor": "#FF0000FF"
							},
							"text": "SANTANDER"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "TF_402_629560"
						},
						{
							"characterFormat": {
								"fontColor": "#FF0000FF"
							},
							"text": " "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "TF_225_646560"
						},
						{
							"characterFormat": {
								"fontColor": "#0000FFFF"
							},
							"text": "Cuenta "
						},
						{
							"characterFormat": {
								"fontColor": "#0000FFFF"
							},
							"text": "Bancaria"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "TF_225_646560"
						},
						{
							"characterFormat": {
								"fontColor": "#000000FF"
							},
							"text": ","
						},
						{
							"characterFormat": {},
							"text": " la "
						},
						{
							"characterFormat": {},
							"text": "suma "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "25 "
						},
						{
							"characterFormat": {},
							"text": "EUROS "
						},
						{
							"characterFormat": {},
							"text": "con "
						},
						{
							"characterFormat": {},
							"text": "apercibimiento "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "no "
						},
						{
							"characterFormat": {},
							"text": "verificarlo "
						},
						{
							"characterFormat": {},
							"text": "no "
						},
						{
							"characterFormat": {},
							"text": "se "
						},
						{
							"characterFormat": {},
							"text": "admitirá "
						},
						{
							"characterFormat": {},
							"text": "a "
						},
						{
							"characterFormat": {},
							"text": "trámite "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "recurso "
						},
						{
							"characterFormat": {},
							"text": "pretendido; "
						},
						{
							"characterFormat": {},
							"text": "salvo "
						},
						{
							"characterFormat": {},
							"text": "que "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "recurrente "
						},
						{
							"characterFormat": {},
							"text": "sea: "
						},
						{
							"characterFormat": {},
							"text": "beneficiario "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "justicia "
						},
						{
							"characterFormat": {},
							"text": "gratuita, "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "Ministerio "
						},
						{
							"characterFormat": {},
							"text": "Fiscal, "
						},
						{
							"characterFormat": {},
							"text": "el "
						},
						{
							"characterFormat": {},
							"text": "Estado, "
						},
						{
							"characterFormat": {},
							"text": "Comunidad "
						},
						{
							"characterFormat": {},
							"text": "Autónoma, "
						},
						{
							"characterFormat": {},
							"text": "entidad "
						},
						{
							"characterFormat": {},
							"text": "local "
						},
						{
							"characterFormat": {},
							"text": "u "
						},
						{
							"characterFormat": {},
							"text": "organismo "
						},
						{
							"characterFormat": {},
							"text": "autónomo "
						},
						{
							"characterFormat": {},
							"text": "dependiente "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "alguno "
						},
						{
							"characterFormat": {},
							"text": "de "
						},
						{
							"characterFormat": {},
							"text": "los "
						},
						{
							"characterFormat": {},
							"text": "anteriores.     "
						}
					]
				}
			],
			"headersFooters": {
				"header": {
					"blocks": [
						{
							"paragraphFormat": {
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": [
								{
									"characterFormat": {},
									"shapeId": 3,
									"name": "Rectangle",
									"visible": true,
									"width": 281,
									"height": 25,
									"widthScale": 100,
									"heightScale": 100,
									"verticalPosition": 0,
									"verticalOrigin": "Page",
									"verticalAlignment": "None",
									"verticalRelativePercent": -3.4028235e38,
									"horizontalPosition": 0,
									"horizontalOrigin": "Margin",
									"horizontalAlignment": "Center",
									"horizontalRelativePercent": -3.4028235e38,
									"zOrderPosition": 1024,
									"allowOverlap": true,
									"textWrappingStyle": "Behind",
									"textWrappingType": "Both",
									"distanceBottom": 0,
									"distanceLeft": 0,
									"distanceRight": 0,
									"distanceTop": 0,
									"layoutInCell": true,
									"lockAnchor": false,
									"autoShapeType": "Rectangle",
									"fillFormat": {
										"color": "#FFFFFFFF",
										"fill": true
									},
									"lineFormat": {
										"lineFormatType": "None",
										"color": "#000000FF",
										"weight": 1,
										"lineStyle": "Solid",
										"line": false
									},
									"textFrame": {
										"textVerticalAlignment": "Top",
										"leftMargin": 5.31526,
										"rightMargin": 5.31526,
										"topMargin": 2.76372,
										"bottomMargin": 2.76372,
										"blocks": [
											{
												"paragraphFormat": {
													"styleName": "Normal",
													"listFormat": {}
												},
												"characterFormat": {},
												"inlines": [
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "Created"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": " "
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "with"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": " a trial "
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "version"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": " "
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "of"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": " "
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "Syncfusion"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": " "
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "Essential"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": " "
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "DocIO"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "."
													}
												]
											}
										]
									}
								}
							]
						},
						{
							"paragraphFormat": {
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": []
						}
					]
				},
				"evenHeader": {
					"blocks": [
						{
							"paragraphFormat": {
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": [
								{
									"characterFormat": {},
									"shapeId": 1,
									"name": "Rectangle",
									"visible": true,
									"width": 281,
									"height": 25,
									"widthScale": 100,
									"heightScale": 100,
									"verticalPosition": 0,
									"verticalOrigin": "Page",
									"verticalAlignment": "None",
									"verticalRelativePercent": -3.4028235e38,
									"horizontalPosition": 0,
									"horizontalOrigin": "Margin",
									"horizontalAlignment": "Center",
									"horizontalRelativePercent": -3.4028235e38,
									"zOrderPosition": 2048,
									"allowOverlap": true,
									"textWrappingStyle": "Behind",
									"textWrappingType": "Both",
									"distanceBottom": 0,
									"distanceLeft": 0,
									"distanceRight": 0,
									"distanceTop": 0,
									"layoutInCell": true,
									"lockAnchor": false,
									"autoShapeType": "Rectangle",
									"fillFormat": {
										"color": "#FFFFFFFF",
										"fill": true
									},
									"lineFormat": {
										"lineFormatType": "None",
										"color": "#000000FF",
										"weight": 1,
										"lineStyle": "Solid",
										"line": false
									},
									"textFrame": {
										"textVerticalAlignment": "Top",
										"leftMargin": 5.31526,
										"rightMargin": 5.31526,
										"topMargin": 2.76372,
										"bottomMargin": 2.76372,
										"blocks": [
											{
												"paragraphFormat": {
													"styleName": "Normal",
													"listFormat": {}
												},
												"characterFormat": {},
												"inlines": [
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "Created"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": " "
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "with"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": " a trial "
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "version"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": " "
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "of"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": " "
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "Syncfusion"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": " "
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "Essential"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": " "
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "DocIO"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "."
													}
												]
											}
										]
									}
								}
							]
						},
						{
							"paragraphFormat": {
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": []
						}
					]
				},
				"firstPageHeader": {
					"blocks": [
						{
							"paragraphFormat": {
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": [
								{
									"characterFormat": {},
									"shapeId": 2,
									"name": "Rectangle",
									"visible": true,
									"width": 281,
									"height": 25,
									"widthScale": 100,
									"heightScale": 100,
									"verticalPosition": 0,
									"verticalOrigin": "Page",
									"verticalAlignment": "None",
									"verticalRelativePercent": -3.4028235e38,
									"horizontalPosition": 0,
									"horizontalOrigin": "Margin",
									"horizontalAlignment": "Center",
									"horizontalRelativePercent": -3.4028235e38,
									"zOrderPosition": 3072,
									"allowOverlap": true,
									"textWrappingStyle": "Behind",
									"textWrappingType": "Both",
									"distanceBottom": 0,
									"distanceLeft": 0,
									"distanceRight": 0,
									"distanceTop": 0,
									"layoutInCell": true,
									"lockAnchor": false,
									"autoShapeType": "Rectangle",
									"fillFormat": {
										"color": "#FFFFFFFF",
										"fill": true
									},
									"lineFormat": {
										"lineFormatType": "None",
										"color": "#000000FF",
										"weight": 1,
										"lineStyle": "Solid",
										"line": false
									},
									"textFrame": {
										"textVerticalAlignment": "Top",
										"leftMargin": 5.31526,
										"rightMargin": 5.31526,
										"topMargin": 2.76372,
										"bottomMargin": 2.76372,
										"blocks": [
											{
												"paragraphFormat": {
													"styleName": "Normal",
													"listFormat": {}
												},
												"characterFormat": {},
												"inlines": [
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "Created"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": " "
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "with"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": " a trial "
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "version"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": " "
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "of"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": " "
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "Syncfusion"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": " "
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "Essential"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": " "
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "DocIO"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 11,
															"fontFamily": "Calibri",
															"fontColor": "#000000FF",
															"boldBidi": true,
															"fontSizeBidi": 11,
															"fontFamilyBidi": "Calibri"
														},
														"text": "."
													}
												]
											}
										]
									}
								}
							]
						},
						{
							"paragraphFormat": {
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": []
						}
					]
				}
			}
		}
	],
	"characterFormat": {
		"bold": false,
		"italic": false,
		"fontSize": 11,
		"fontFamily": "Times New Roman",
		"underline": "None",
		"strikethrough": "None",
		"baselineAlignment": "Normal",
		"highlightColor": "NoColor",
		"fontColor": "#00000000",
		"boldBidi": false,
		"italicBidi": false,
		"fontSizeBidi": 11,
		"fontFamilyBidi": "Times New Roman",
		"allCaps": false
	},
	"paragraphFormat": {
		"leftIndent": 0,
		"rightIndent": 0,
		"firstLineIndent": 0,
		"textAlignment": "Left",
		"beforeSpacing": 0,
		"afterSpacing": 0,
		"lineSpacing": 1,
		"lineSpacingType": "Multiple",
		"listFormat": {},
		"bidi": false,
		"keepLinesTogether": false,
		"keepWithNext": false,
		"widowControl": true
	},
	"defaultTabWidth": 36,
	"trackChanges": false,
	"enforcement": false,
	"hashValue": "",
	"saltValue": "",
	"formatting": false,
	"protectionType": "NoProtection",
	"dontUseHTMLParagraphAutoSpacing": false,
	"formFieldShading": true,
	"compatibilityMode": "Word2013",
	"styles": [
		{
			"name": "Normal",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 12,
				"fontFamily": "Arial",
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Arial"
			},
			"next": "Normal"
		},
		{
			"name": "Heading 1",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 12,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level1",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 16,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496FF",
				"fontSizeBidi": 16,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Normal",
			"link": "Heading 1 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 1 Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 16,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496FF",
				"fontSizeBidi": 16,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Default Paragraph Font",
			"type": "Character",
			"characterFormat": {}
		},
		{
			"name": "Heading 2",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 2,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level2",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 13,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496FF",
				"fontSizeBidi": 13,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Normal",
			"link": "Heading 2 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 2 Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 13,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496FF",
				"fontSizeBidi": 13,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 3",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 2,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level3",
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Calibri Light",
				"fontColor": "#1F3763FF",
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Normal",
			"link": "Heading 3 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 3 Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 12,
				"fontFamily": "Calibri Light",
				"fontColor": "#1F3763FF",
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 4",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 2,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level4",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496FF",
				"italicBidi": true,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Normal",
			"link": "Heading 4 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 4 Char",
			"type": "Character",
			"characterFormat": {
				"italic": true,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496FF",
				"italicBidi": true,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 5",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 2,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level5",
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496FF",
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Normal",
			"link": "Heading 5 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 5 Char",
			"type": "Character",
			"characterFormat": {
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496FF",
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 6",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 2,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level6",
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Calibri Light",
				"fontColor": "#1F3763FF",
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Normal",
			"link": "Heading 6 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 6 Char",
			"type": "Character",
			"characterFormat": {
				"fontFamily": "Calibri Light",
				"fontColor": "#1F3763FF",
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Ref. de comentario1",
			"type": "Character",
			"characterFormat": {
				"fontSize": 8,
				"fontSizeBidi": 8
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Texto comentario1",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontSizeBidi": 10
			},
			"basedOn": "Normal",
			"next": "Texto comentario1"
		},
		{
			"name": "Asunto del comentario1",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"bold": true,
				"boldBidi": true
			},
			"basedOn": "Texto comentario1",
			"next": "Texto comentario1"
		},
		{
			"name": "Campos",
			"type": "Character",
			"characterFormat": {
				"fontColor": "#0000FFFF"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Avisos",
			"type": "Character",
			"characterFormat": {
				"fontColor": "#FF0000FF"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Header",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {},
				"tabs": [
					{
						"position": 212.60000610351563,
						"deletePosition": 0,
						"tabJustification": "Center",
						"tabLeader": "None"
					},
					{
						"position": 425.20001220703127,
						"deletePosition": 0,
						"tabJustification": "Right",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"next": "Header"
		},
		{
			"name": "Footer",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {},
				"tabs": [
					{
						"position": 212.60000610351563,
						"deletePosition": 0,
						"tabJustification": "Center",
						"tabLeader": "None"
					},
					{
						"position": 425.20001220703127,
						"deletePosition": 0,
						"tabJustification": "Right",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"next": "Footer"
		},
		{
			"name": "Page Number",
			"type": "Character",
			"characterFormat": {},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Balloon Text",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 8,
				"fontFamily": "Tahoma",
				"fontSizeBidi": 8,
				"fontFamilyBidi": "Tahoma"
			},
			"basedOn": "Normal",
			"next": "Balloon Text"
		},
		{
			"name": "Campos_0",
			"type": "Character",
			"characterFormat": {
				"fontColor": "#0000FFFF"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Normal_0",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"next": "Normal_0"
		}
	],
	"lists": [],
	"abstractLists": [],
	"comments": [],
	"revisions": [],
	"customXml": [],
	"footnotes": {
		"separator": [
			{
				"paragraphFormat": {
					"styleName": "Normal",
					"listFormat": {}
				},
				"characterFormat": {},
				"inlines": [
					{
						"characterFormat": {},
						"text": "\u0003"
					}
				]
			}
		],
		"continuationSeparator": [
			{
				"paragraphFormat": {
					"styleName": "Normal",
					"listFormat": {}
				},
				"characterFormat": {},
				"inlines": [
					{
						"characterFormat": {},
						"text": "\u0004"
					}
				]
			}
		],
		"continuationNotice": [
			{
				"paragraphFormat": {
					"styleName": "Normal",
					"listFormat": {}
				},
				"characterFormat": {},
				"inlines": []
			}
		]
	},
	"endnotes": {
		"separator": [
			{
				"paragraphFormat": {
					"styleName": "Normal",
					"listFormat": {}
				},
				"characterFormat": {},
				"inlines": [
					{
						"characterFormat": {},
						"text": "\u0003"
					}
				]
			}
		],
		"continuationSeparator": [
			{
				"paragraphFormat": {
					"styleName": "Normal",
					"listFormat": {}
				},
				"characterFormat": {},
				"inlines": [
					{
						"characterFormat": {},
						"text": "\u0004"
					}
				]
			}
		],
		"continuationNotice": [
			{
				"paragraphFormat": {
					"styleName": "Normal",
					"listFormat": {}
				},
				"characterFormat": {},
				"inlines": []
			}
		]
	}
}
describe('Backspace validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, enableEditorHistory: true, enableComment: true, enableSelection: true, enableSfdtExport:true });
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
    it("Backspace validation",()=>{
        console.log("Backspace validation");
        editor.open(JSON.stringify(Doc));
        editor.selection.select("0;133;0","0;133;504");
        expect(()=>{ for(let i=0;i<37;i++){
            editor.editor.onBackSpace();
        } }).not.toThrowError();
    });
});
let formField: any = {"sections":[{"sectionFormat":{"pageWidth":595.2999877929688,"pageHeight":841.9000244140625,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false,"pageNumberStyle":"Arabic"},"blocks":[{"paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"fieldType":0,"hasFieldEnd":true,"formFieldData":{"name":"Secção/Brigada","enabled":true,"helpText":"","statusText":"","textInput":{"type":"Text","maxLength":0,"defaultValue":"","format":"None"}}},{"characterFormat":{},"bookmarkType":0,"name":"Secção/Brigada"},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"FORMTEXT"},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"   "},{"characterFormat":{},"fieldType":1},{"characterFormat":{},"bookmarkType":1,"name":"Secção/Brigada"}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"textAlignment":"Right","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontFamily":"Arial","fontSizeBidi":9,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":9,"fontFamily":"Arial","fontSizeBidi":9,"fontFamilyBidi":"Arial"},"text":"Pág. "},{"characterFormat":{"fontSize":9,"fontFamily":"Arial","fontSizeBidi":9,"fontFamilyBidi":"Arial"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontSize":9,"fontFamily":"Arial","fontSizeBidi":9,"fontFamilyBidi":"Arial"},"text":"PAGE  \\* MERGEFORMAT"},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontSize":9,"fontFamily":"Arial","fontSizeBidi":9,"fontFamilyBidi":"Arial"},"text":"1"},{"characterFormat":{},"fieldType":1}]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":true,"hashValue":"LqZyy5RQnX3NY5RFxfr+uXvo24vzjlKXOKEcjLwn7u/8lXA9k2TbKTOFf/V2ll1MS/IlOy2CYeFAxqR7rPlWkw==","saltValue":"M+wGFtJiY64rtHzyC2lmrQ==","formatting":false,"protectionType":"FormFieldsOnly","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"beforeSpacing":12,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","next":"Normal"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","next":"Normal"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","next":"Normal"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","next":"Normal"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","next":"Normal"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Document broken layout after pressing enter in formfield', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, enableEditorHistory: true, enableComment: true, enableSelection: true, enableSfdtExport:true });
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
	it("Document broken layout after pressing enter in formfield",()=>{
		console.log("Document broken layout after pressing enter in formfield");
		editor.open(JSON.stringify(formField));
		editor.selection.checkForCursorVisibility();
		editor.selection.handleTabKey(false,false);
		editor.editor.insertText("hello");
		editor.editor.onEnter();
		expect(()=>{ 
            editor.editor.insertText("world");
        } ).not.toThrowError();
	});
	it("BackSpace validation",()=>{
		console.log("BackSpace validation");
		editor.selection.checkForCursorVisibility();
		let i : number = 0;
		while(i<5){
			editor.editor.onBackSpace();
			i++;
		}
		editor.selection.select("0;0;0","0;0;5");
		expect(editor.selection.text).toBe("hello");
	});
});