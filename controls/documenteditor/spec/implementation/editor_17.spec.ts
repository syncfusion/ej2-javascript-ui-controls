import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget } from '../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, EditorHistory, TableCellWidget, TextElementBox, TextHelper, RtlInfo, ListTextElementBox, LineWidget, TabElementBox, TextPosition } from '../../src/index';
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
        editor.selection.goToHeader();
        editor.editor.insertComment();
        expect(editor.documentHelper.comments.length).toBe(0);
    });
});


//Restrict editing test cases

let restrictJson: string = '{"sections":[{"blocks":[{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"name":"_GoBack","bookmarkType":0},{"editRangeId":"76489596","columnFirst":0,"columnLast":0,"group":"everyone"},{"editRangeId":"1283593602","columnFirst":1,"columnLast":1,"group":"everyone"},{"name":"_GoBack","bookmarkType":1},{"editRangeId":"76489596","editableRangeStart":{"editRangeId":"76489596","columnFirst":0,"columnLast":0,"group":"everyone"}},{"editRangeId":"1283593602","editableRangeStart":{"editRangeId":"1283593602","columnFirst":1,"columnLast":1,"group":"everyone"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Top","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false}},{"paragraphFormat":{"styleName":"Normal"},"inlines":[]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Character","name":"Default Paragraph Font"},{"type":"Paragraph","name":"Normal (Web)","basedOn":"Normal","next":"Normal (Web)","characterFormat":{"fontSize":12.0,"fontFamily":"Times New Roman","fontSizeBidi":12.0,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"beforeSpacing":5.0,"afterSpacing":5.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"}}],"defaultTabWidth":36.0,"formatting":false,"protectionType":"ReadOnly","enforcement":true,"hashValue":"TCxiQ0q35iQIo6TqY+Nt/fkYblPiB9+D5pV5DdK2hIe+NqzJPJeZ0E2hpJSz3YL+VVPvrpQG8VnRLh8lyqlOIw==","saltValue":"UNBPXLxCmZ737H4/B2p0xg=="}';

describe('Open restrict document with para mark at end of table cell', () => {
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
    it('Document open', () => {
        expect(() => { editor.open(restrictJson) }).not.toThrowError();
    });
    it('insert text at non-editable region', () => {
        let currentLineLength: number = editor.selection.start.currentWidget.children.length;
        editor.editor.handleTextInput('s');
        expect(editor.selection.start.currentWidget.children.length).toBe(currentLineLength);
    });
    it('insert text at editable region', () => {
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
        editor.editor.insertText('Sample hello world');
        editor.selection.handleControlLeftKey();
        editor.selection.handleControlLeftKey();
        editor.selection.selectCurrentWord();
        editor.selection.characterFormat.bold = true;
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
    it('Bold property for multiple different inline', () => {
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleShiftEndKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.characterFormat.bold = true;
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
    it('Undo after bold', () => {
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.bold).toBeUndefined();
    });
    it('Redo after bold', () => {
        editor.editorHistory.redo();
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
});

/**
 * Paste match formatting validation
 */

let pasteString: string = '{"sections":[{"blocks":[{"characterFormat":{"bold":true,"italic":true,"underline":"Single","strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#ED7D31FF","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"BodyText","textAlignment":"Left","styleName":"Normal","bidi":false,"contextualSpacing":false},"inlines":[{"text":"Source format","characterFormat":{"bold":true,"italic":true,"underline":"Single","strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#ED7D31FF","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"}}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36,"footerDistance":36,"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#00000000","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left"}},{"type":"Character","name":"Default Paragraph Font"}],"defaultTabWidth":35.400001525878906,"formatting":false,"protectionType":"NoProtection","enforcement":false,"dontUseHTMLParagraphAutoSpacing":false}';

describe('Paste formatting with underline validation', () => {
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
    it('Merge formatting', () => {
        editor.editor.insertText('Sample');
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.editor.paste(pasteString, 'MergeWithExistingFormatting');
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        expect(editor.selection.characterFormat.underline).toBe('Single');
    });
    it('undo after merge formatting', () => {
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.underline).toBe('None');
    });
    it('redo after merge formatting', () => {
        editor.editorHistory.redo();
        editor.selection.handleLeftKey();
        expect(editor.selection.characterFormat.underline).toBe('Single');
    });
    it('Alignment after para delete', () => {
        editor.openBlank();
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.editor.onApplyParagraphFormat('textAlignment', 'Center', false, true);
        editor.editor.insertText('check');
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).paragraphFormat.textAlignment).toBe('Center');
    });
});