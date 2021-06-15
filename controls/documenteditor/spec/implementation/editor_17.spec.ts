import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget, BookmarkDialog, BookmarkElementBox, BorderSettings } from '../../src/document-editor/index';
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
    let restrictJson: string = '{"sections":[{"blocks":[{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"name":"_GoBack","bookmarkType":0},{"editRangeId":"76489596","columnFirst":0,"columnLast":0,"group":"everyone"},{"editRangeId":"1283593602","columnFirst":1,"columnLast":1,"group":"everyone"},{"name":"_GoBack","bookmarkType":1},{"editRangeId":"76489596","editableRangeStart":{"editRangeId":"76489596","columnFirst":0,"columnLast":0,"group":"everyone"}},{"editRangeId":"1283593602","editableRangeStart":{"editRangeId":"1283593602","columnFirst":1,"columnLast":1,"group":"everyone"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Top","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false}},{"paragraphFormat":{"styleName":"Normal"},"inlines":[]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Character","name":"Default Paragraph Font"},{"type":"Paragraph","name":"Normal (Web)","basedOn":"Normal","next":"Normal (Web)","characterFormat":{"fontSize":12.0,"fontFamily":"Times New Roman","fontSizeBidi":12.0,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"beforeSpacing":5.0,"afterSpacing":5.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"}}],"defaultTabWidth":36.0,"formatting":false,"protectionType":"ReadOnly","enforcement":true,"hashValue":"TCxiQ0q35iQIo6TqY+Nt/fkYblPiB9+D5pV5DdK2hIe+NqzJPJeZ0E2hpJSz3YL+VVPvrpQG8VnRLh8lyqlOIw==","saltValue":"UNBPXLxCmZ737H4/B2p0xg=="}';
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