import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, FieldElementBox, FieldInfo, TableWidget, TextElementBox } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';
import { LineWidget, ImageElementBox,ParagraphWidget } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { LayoutViewer, DocumentHelper, TableCellWidget, TableRowWidget } from '../../../src/index';
import { Paragraph } from '../../../src/document-editor-container/properties-pane/paragraph-properties';

/**
 * Section Break Validation
 */
describe('Auto fit command ', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
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
        }, 750);
    });
    it('apply Fit to content', () => {
console.log('apply Fit to content');
        editor.editor.insertTable(2, 2);
        editor.editor.autoFitTable('FitToContents');
        let table: TableWidget = editor.selection.start.paragraph.associatedCell.ownerTable;
        expect(table.tableFormat.allowAutoFit).toBe(true);
        //expect(table.tableHolder.getTotalWidth(0)).toBeGreaterThan(25);
        expect(table.tableHolder.getTotalWidth(0)).toBeGreaterThan(20);
    });
    it('Insert text in table', () => {
console.log('Insert text in table');
        editor.editor.insertText('Syncfusion');
        let table: TableWidget = editor.selection.start.paragraph.associatedCell.ownerTable;
        expect(table.tableHolder.getTotalWidth(0)).toBeGreaterThan(25);
    });
    it('Undo operation after insert text ', () => {
console.log('Undo operation after insert text ');
        editor.editorHistory.undo();
        let table: TableWidget = editor.selection.start.paragraph.associatedCell.ownerTable;
        //expect(table.tableHolder.getTotalWidth(0)).toBeGreaterThan(25);
        expect(table.tableHolder.getTotalWidth(0)).toBeGreaterThan(20);
        editor.editorHistory.redo();
        table = editor.selection.start.paragraph.associatedCell.ownerTable;
        expect(table.tableHolder.getTotalWidth(0)).toBeGreaterThan(25);
    });
    it('Apply fit to window', () => {
console.log('Apply fit to window');
        editor.editor.autoFitTable('FitToWindow');
        let table: TableWidget = editor.selection.start.paragraph.associatedCell.ownerTable;
        expect(table.tableFormat.preferredWidthType).toBe('Percent');
        expect(table.tableFormat.preferredWidth).toBe(100);
        expect(table.tableHolder.getTotalWidth(0)).toBeGreaterThan(465);
        expect(table.tableHolder.getTotalWidth(0)).toBeLessThan(471);
    });
    it('Undo fit to window operation after insert text ', () => {
console.log('Undo fit to window operation after insert text ');
        editor.editorHistory.undo();
        let table: TableWidget = editor.selection.start.paragraph.associatedCell.ownerTable;
        expect(table.tableFormat.allowAutoFit).toBe(true);
        //expect(table.tableHolder.getTotalWidth(0)).toBeGreaterThan(75);
        expect(table.tableHolder.getTotalWidth(0)).toBeGreaterThan(67);

    });
    it('Redo fit to window operation', () => {
console.log('Redo fit to window operation');
        editor.editorHistory.redo();
        let table: TableWidget = editor.selection.start.paragraph.associatedCell.ownerTable;
        expect(table.tableFormat.preferredWidthType).toBe('Percent');
        expect(table.tableFormat.preferredWidth).toBe(100);
        expect(table.tableHolder.getTotalWidth(0)).toBeGreaterThan(465);
        expect(table.tableHolder.getTotalWidth(0)).toBeLessThan(471);
    });
    it('Apply Fixed column width for Fit to window table', () => {
console.log('Apply Fixed column width for Fit to window table');
        editor.editor.autoFitTable('FixedColumnWidth');
        let table: TableWidget = editor.selection.start.paragraph.associatedCell.ownerTable;
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.preferredWidthType).toBe('Point');
        expect(table.tableHolder.getTotalWidth(0)).toBeGreaterThan(465);
        expect(table.tableHolder.getTotalWidth(0)).toBeLessThan(471);
        editor.editorHistory.undo();
    });
    it('Apply Fixed column width in Fit to content table', () => {
console.log('Apply Fixed column width in Fit to content table');
        editor.editor.autoFitTable('FitToContents');
        let table: TableWidget = editor.selection.start.paragraph.associatedCell.ownerTable;
        let previousTableWidth: number = table.tableHolder.getTotalWidth(0);
        editor.editor.autoFitTable('FixedColumnWidth');
        editor.editor.insertText('Syncfusion');
        table = editor.selection.start.paragraph.associatedCell.ownerTable;
        expect(table.tableHolder.getTotalWidth(0)).toBe(previousTableWidth);
    });
});

describe("Insert and delete table validation", () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
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
        }, 750);
    });
    it("Insert Table Validation", () => {
        editor.editorModule.applyStyle("Heading 1");
        editor.editorModule.insertTable(30, 2);
        expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
        expect(editor.pageCount).toBe(2);
    });
    it("Delete Table Validation", () => {
        editor.editorModule.deleteTable();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(false);
        expect(editor.pageCount).toBe(1);
    });
    it("Undo and redo delete operation", () => {
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
        expect(editor.pageCount).toBe(2);
        editor.editorHistory.redo();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(false);
        expect(editor.pageCount).toBe(1);
    });
    it("Insert table undo and redo", () => {
        editor.openBlank();
        editor.editorModule.applyStyle("Heading 1");
        editor.editorModule.insertTable(30, 2);
        expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
        expect(editor.pageCount).toBe(2);
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(false);
        expect(editor.pageCount).toBe(1);
        editor.editorHistory.redo();
        //expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
        expect(editor.pageCount).toBe(2);
    });
    it("Apply cell format validation", () => {
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        editor.selection.selectColumn();
        editor.selection.cellFormat.preferredWidth = 400;
        expect(editor.selection.start.paragraph.associatedCell.ownerTable.tableHolder.tableWidth).toBeGreaterThan(630);
    });
});
describe("Insert new paragraph by considering \r, \n, \r\n validation", () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
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
        }, 750);
    });
    it("Insert new paragraph by considering \r", () => {
        editor.openBlank();
        editor.editorModule.insertText('first paragraph\rsecond paragraph');
        let paragraph = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length;
        expect(paragraph).toEqual(2);
    });
    it("Insert new paragraph by considering \n", () => {
        editor.openBlank();
        editor.editorModule.insertText('first paragraph\nsecond paragraph');
        let paragraph = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length;
        expect(paragraph).toEqual(2);
    });
    it("Insert new paragraph by considering \r\n", () => {
        editor.openBlank();
        editor.editorModule.insertText('first paragraph\r\nsecond paragraph');
        let paragraph = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length;
        expect(paragraph).toEqual(2);
    });
    it("Insert new paragraph by considering both combination of \r, \n, \r\n", () => {
        editor.openBlank();
        editor.editorModule.insertText('first paragraph\rsecond paragraph\nthird paragraph\r\nfourth paragraph');
        let paragraph = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length;
        expect(paragraph).toEqual(4);
    });
    it("Insert text contains \r only to insert new paragraph", () => {
        editor.openBlank();
        editor.editorModule.insertText('\r');
        let paragraph = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length;
        expect(paragraph).toEqual(2);
    });
    it("Insert text contains \n only to insert new paragraph", () => {
        editor.openBlank()
        editor.editorModule.insertText('\n')
        let paragraph = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length
        expect(paragraph).toEqual(2)
    });
    it("Insert text contains \r\n only to insert new paragraph", () => {
        editor.openBlank();
        editor.editorModule.insertText('\r\n');
        let paragraph = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length;
        expect(paragraph).toEqual(2);
    });
    it("undo and redo", () => {
        editor.openBlank();
        editor.editorModule.insertText('first paragraph\rsecond paragraph\nthird paragraph\r\nfourth paragraph');
        editor.editorHistory.undo();
        let undoAction = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length;
        expect(undoAction).toEqual(1);
        editor.editorHistory.redo();
        let redoAction = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length;
        expect(redoAction).toEqual(4);
    });
});
describe("Insert Hyperlink and bookmark validation", () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
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
        }, 750);
    });
    it("Insert Hyperlink with display text", () => {
        editor.editorModule.insertHyperlink('https://syncfusion.com', 'Syncfusion');
        editor.selection.movePreviousPosition();
        var field = editor.selection.getHyperlinkField();
        expect(field).toBeDefined();
    });
    it("InsertHyperlik with out display text", () => {
        editor.openBlank();
        editor.editorModule.insertHyperlink('https://syncfusion.com');
        editor.selection.selectAll();
        expect(editor.selection.text).toBe('https://syncfusion.com\r');
    });
    it("Insert bookmark", () => {
        editor.openBlank();
        editor.editorModule.insertText("Syncfusion");
        editor.selection.selectAll();
        editor.editorModule.insertBookmark("testbookmark");
        var bookmars = editor.getBookmarks();
        expect(bookmars.length).toBe(1);
        expect(bookmars[0]).toBe("testbookmark");
    });
});
describe("Paste Validation", () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        document.body.innerHTML = "";
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1000px;height:600px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
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
        viewer = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 750);
    });
    it("Paste image Validation", async () => {
        let data: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADQSURBVFhH7ZbRDYQgDIYZ5UZhFEdxlBuFUUhY4N7vwWtTURJz5tem8GAbTYS0/eGjWsN7hJVSAuku3c2FuyF31BvqBNu90/mLmnSRjKDbMZULt2csz/kV8hRbVjSkSZkxRC0yKcbl+6FLhttSDIV5W6vYnKeZVWkR1WyFGbhIHrAbCzPhEcL1XCvqptYMd7xXExUXM4+pT3ENe53OP5yGqJ8kDDZGpIld6E730uFR/uuDs1J6OmolQDzcUeOslJ6OWgkQD3fUOCulJ6Ome4j9AGEu0k90WN54AAAAAElFTkSuQmCC';
        editor.openBlank();
        editor.editorModule.onPasteImage(data);
        let isimage: boolean = (editor.selection.start.paragraph.childWidgets[0] as LineWidget).children[0] instanceof ImageElementBox;
        setTimeout(function () { expect(isimage).toBe(true); }, 300);
    });
});
describe("TOC Validation", () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
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
        }, 750);
    });
    it("TOC without styles Validation", () => {
        editor.editor.insertTableOfContents();
        expect(editor.editorHistory.canUndo()).toBe(false);
        expect((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children[0]).toBe(undefined);
    });
    it("TOC with styles Validation", () => {
        let json = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Heading 1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"TOC"}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{}}]},"footer":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{}}]},"evenHeader":{},"evenFooter":{},"firstPageHeader":{},"firstPageFooter":{}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}]};
        editor.open(JSON.stringify(json));
        editor.selection.selectAll();
        editor.editorModule.insertTableOfContents();
        expect(editor.selection.start.paragraph.index).toBe(2);
    });
});

describe("Merge Cells Validation", () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
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
        }, 750);
    });
    it("Merge cells", () => {
        console.log('Merge cells');
        editor.editor.insertTable(4,4);
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.editor.mergeCells();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).width).toBe(608.93333);
    });
});
describe('Update top border validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:100%' });
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
    afterAll((done) => {
        editor.destroy();
        //destroy validation
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Update top border validation', () => {
        editor.openBlank();
        editor.editor.insertTable(4, 4);
        editor.selection.handleDownKey();
        editor.selection.handleDownKey();
        editor.selection.handleDownKey();
        editor.selection.handleControlShiftLeftKey();
        editor.selection.handleControlShiftLeftKey();
        editor.selection.handleControlShiftLeftKey();
        editor.selection.handleControlShiftLeftKey();
        editor.editor.mergeCells();
        editor.selection.handleHomeKey();
        let cell: TableCellWidget = ((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[3] as TableRowWidget).childWidgets[0] as TableCellWidget;
        expect(cell.updatedTopBorders.length).toBe(1);
    });
});
describe('insert image', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
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
        }, 750);
    });
    it('insert picture', () => {
        console.log('insert picture');
        let data:string = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iMTI4MC4wMDAwMDBwdCIgaGVpZ2h0PSIxMjgwLjAwMDAwMHB0IiB2aWV3Qm94PSIwIDAgMTI4MC4wMDAwMDAgMTI4MC4wMDAwMDAiCiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0Ij4KPG1ldGFkYXRhPgpDcmVhdGVkIGJ5IHBvdHJhY2UgMS4xNSwgd3JpdHRlbiBieSBQZXRlciBTZWxpbmdlciAyMDAxLTIwMTcKPC9tZXRhZGF0YT4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsMTI4MC4wMDAwMDApIHNjYWxlKDAuMTAwMDAwLC0wLjEwMDAwMCkiCmZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSI+CjxwYXRoIGQ9Ik02MjY5IDEyNjkzIGMtMTE3OSAtMjEgLTIzNTAgLTM4NSAtMzMzNCAtMTAzOCAtMTI5MiAtODU2IC0yMjE4Ci0yMTM4IC0yNjE1IC0zNjIzIC0xNDYgLTU0NSAtMjEwIC0xMDQzIC0yMTAgLTE2MzIgMCAtMzk4IDIxIC02NjggODEgLTEwMzMKMzI5IC0yMDAxIDE2MTYgLTM3MjggMzQ0NCAtNDYyMiA2NjkgLTMyNyAxMzUyIC01MjQgMjA5NSAtNjA0IDQxNCAtNDUgOTUzCi00MyAxMzg1IDUgMTYwNCAxNzkgMzA5MiA5ODUgNDEzMiAyMjM5IDc4MiA5NDQgMTI3MyAyMDk0IDE0MDcgMzMwMCA1MCA0NTEKNTAgOTgwIDEgMTQyNSAtMjUzIDIyNDcgLTE3MDMgNDE5MiAtMzc5MCA1MDgzIC04MTUgMzQ4IC0xNjg5IDUxNiAtMjU5NiA1MDB6Cm00MTQgLTIwMCBjLTIzIC0yIC02NCAtMiAtOTAgMCAtMjYgMiAtNyAzIDQyIDMgNTAgMCA3MSAtMSA0OCAtM3ogbTE3NSAtMTAKYy0xNSAtMiAtNDIgLTIgLTYwIDAgLTE4IDIgLTYgNCAyNyA0IDMzIDAgNDggLTIgMzMgLTR6IG04NSAtMTAgYy03IC0yIC0xOQotMiAtMjUgMCAtNyAzIC0yIDUgMTIgNSAxNCAwIDE5IC0yIDEzIC01eiBtLTMwOTcgLTUyOSBjMSAtNSAtNzMgLTQ2IC0xNjYKLTkxIC0xMTkgLTU4IC0xNjcgLTc3IC0xNjYgLTY2IDMgMTYgMzAyIDE3NCAzMjAgMTY5IDYgLTEgMTEgLTYgMTIgLTEyegptMzA1NCAtMTM5IGMxMTMxIC0xMDcgMjE3NCAtNTQ5IDMwMzUgLTEyODYgMTU0IC0xMzIgNDUyIC00MzAgNTg0IC01ODQgNjYzCi03NzUgMTA5MSAtMTcwNSAxMjQ1IC0yNzA1IDQ2IC0zMDAgNjAgLTQ5MCA2MCAtODMwIDAgLTM0MCAtMTQgLTUyOCAtNjAgLTgzMAotMTUxIC05OTEgLTU4NiAtMTkzNyAtMTI0NSAtMjcwNSAtMTMyIC0xNTQgLTQzMCAtNDUyIC01ODQgLTU4NCAtNzY4IC02NTkKLTE3MTQgLTEwOTQgLTI3MDUgLTEyNDUgLTMwMiAtNDYgLTQ5MCAtNjAgLTgzMCAtNjAgLTM0MCAwIC01MzAgMTQgLTgzMCA2MAotMTAwMCAxNTQgLTE5MzAgNTgyIC0yNzA1IDEyNDUgLTE1NCAxMzIgLTQ1MiA0MzAgLTU4NCA1ODQgLTczOSA4NjMgLTExNzQKMTg5MiAtMTI4NyAzMDQ1IC0yNCAyNDEgLTI0IDczOSAwIDk4MCAxMTIgMTE0MSA1MjYgMjEzMiAxMjYwIDMwMTUgMTI5IDE1NQo0ODYgNTEyIDY0MSA2NDEgOTQzIDc4NCAyMDQ0IDEyMTYgMzI1NSAxMjc4IDE0OCA3IDU4OCAtNCA3NTAgLTE5eiBtLTM0MDgKLTM5IGM3IDQgOCAyIDQgLTQgLTExIC0xOCAtMjYgLTE0IC0yNSA2IDAgMTAgMyAxMiA2IDQgMiAtNiAxMCAtOSAxNSAtNnoKbTYxMDggLTE3MiBjMCAtMiAtOSAwIC0yMCA2IC0xMSA2IC0yMCAxMyAtMjAgMTYgMCAyIDkgMCAyMCAtNiAxMSAtNiAyMCAtMTMKMjAgLTE2eiBtODAgLTUwIGMwIC0yIC05IDAgLTIwIDYgLTExIDYgLTIwIDEzIC0yMCAxNiAwIDIgOSAwIDIwIC02IDExIC02IDIwCi0xMyAyMCAtMTZ6IG0yMjAgLTE1MCBjMCAtMyAtMTMgNCAtMzAgMTYgLTE2IDEyIC0zMCAyNCAtMzAgMjYgMCAzIDE0IC00IDMwCi0xNiAxNyAtMTIgMzAgLTI0IDMwIC0yNnogbS04NDkwIC0xNDk4IGMwIC0yIC04IC0xMCAtMTcgLTE3IC0xNiAtMTMgLTE3IC0xMgotNCA0IDEzIDE2IDIxIDIxIDIxIDEzeiBtLTE2MCAtMjM2IGMtNiAtMTEgLTEzIC0yMCAtMTYgLTIwIC0yIDAgMCA5IDYgMjAgNgoxMSAxMyAyMCAxNiAyMCAyIDAgMCAtOSAtNiAtMjB6IG0xMDUxNCAtMzQ2IGMzIC04IDIgLTEyIC00IC05IC02IDMgLTEwIDEwCi0xMCAxNiAwIDE0IDcgMTEgMTQgLTd6IG05NyAtMTg1IGMyNyAtNTYgNDkgLTEwMyA0NyAtMTA1IC0yIC0yIC0yNyA0NCAtNTYKMTAxIC0yOCA1OCAtNTAgMTA1IC00NyAxMDUgMyAwIDI4IC00NSA1NiAtMTAxeiBtLTExNTM0IC0yMjA2IGMtMyAtMTAgLTUgLTIKLTUgMTcgMCAxOSAyIDI3IDUgMTggMiAtMTAgMiAtMjYgMCAtMzV6IG0tMTAgLTEyNSBjLTIgLTE4IC00IC02IC00IDI3IDAgMzMKMiA0OCA0IDMzIDIgLTE1IDIgLTQyIDAgLTYweiBtLTEwIC0yMTEgYy0yIC0yMyAtMyAtMSAtMyA0OCAwIDUwIDEgNjggMyA0MiAyCi0yNiAyIC02NyAwIC05MHogbTEyMTkwIC00NzkgYy0yIC0yOSAtMyAtOCAtMyA0NyAwIDU1IDEgNzkgMyA1MyAyIC0yNiAyIC03MQowIC0xMDB6IG0xMCAtMTI1IGMtMiAtMTYgLTQgLTUgLTQgMjIgMCAyOCAyIDQwIDQgMjggMiAtMTMgMiAtMzUgMCAtNTB6IG0tMTQKLTQ4IGM0IC02OCAzIC04NyAtMyAtNjAgLTkgMzkgLTE0IDE3MiAtNiAxNjQgMiAtMiA2IC00OSA5IC0xMDR6IG0wIC0xMDcgYzgKLTUgNiAtOCAtNSAtOCAtMTQgMCAtMTggOCAtMTcgMzggMiAzNCAyIDM0IDYgNyAzIC0xNiAxMCAtMzMgMTYgLTM3eiBtLTExNTQ0Ci0yMTU1IGMyOCAtNTcgNDkgLTEwMyA0NiAtMTAzIC01IDAgLTEwNSAxOTYgLTEwNSAyMDYgMCAxMyA3IDAgNTkgLTEwM3ogbTk5Ci0xOTggYy0zIC0zIC05IDIgLTEyIDEyIC02IDE0IC01IDE1IDUgNiA3IC03IDEwIC0xNSA3IC0xOHogbTEwMzkyIC01MTkgYzAKLTIgLTggLTEwIC0xNyAtMTcgLTE2IC0xMyAtMTcgLTEyIC00IDQgMTMgMTYgMjEgMjEgMjEgMTN6IG0tODUxOSAtMTU2MyBjMTMKLTE2IDEyIC0xNyAtMyAtNCAtMTcgMTMgLTIyIDIxIC0xNCAyMSAyIDAgMTAgLTggMTcgLTE3eiBtMjM5IC0xNTkgYzAgLTIgLTkKMCAtMjAgNiAtMTEgNiAtMjAgMTMgLTIwIDE2IDAgMiA5IDAgMjAgLTYgMTEgLTYgMjAgLTEzIDIwIC0xNnogbTgwIC01MCBjMAotMiAtOSAwIC0yMCA2IC0xMSA2IC0yMCAxMyAtMjAgMTYgMCAyIDkgMCAyMCAtNiAxMSAtNiAyMCAtMTMgMjAgLTE2eiBtNTk3MAotMTk5IGMwIC02IC0xNzcgLTk1IC0xODcgLTk0IC02IDAgMTc0IDk2IDE4NSA5OCAxIDEgMiAtMSAyIC00eiBtLTMzMjcgLTY2MgpjLTcgLTIgLTE5IC0yIC0yNSAwIC03IDMgLTIgNSAxMiA1IDE0IDAgMTkgLTIgMTMgLTV6IG0xMjUgLTEwIGMtMTUgLTIgLTQyCi0yIC02MCAwIC0xOCAyIC02IDQgMjcgNCAzMyAwIDQ4IC0yIDMzIC00eiBtMjA1IC0xMCBjLTIzIC0yIC02NCAtMiAtOTAgMAotMjYgMiAtNyAzIDQyIDMgNTAgMCA3MSAtMSA0OCAtM3oiLz4KPHBhdGggZD0iTTM1OTAgMTE4MzAgYy00MSAtMjEgLTcyIC0zOSAtNjcgLTQwIDEwIDAgMTQ3IDY5IDE0NyA3NSAwIDcgMyA4Ci04MCAtMzV6Ii8+CjwvZz4KPC9zdmc+Cg==';
        editor.openBlank();
        editor.editorModule.insertPicture(data,200,100,false);
        let isMetaFile:boolean=((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] instanceof ImageElementBox;
        expect(isMetaFile).toBe(true);
        let metaFileImageString=((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] instanceof ImageElementBox;
        expect(metaFileImageString).toBeDefined(data);
    });   
    it('svg to image', () => {
        console.log('svg to image');
        let data:string = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iMTI4MC4wMDAwMDBwdCIgaGVpZ2h0PSIxMjgwLjAwMDAwMHB0IiB2aWV3Qm94PSIwIDAgMTI4MC4wMDAwMDAgMTI4MC4wMDAwMDAiCiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0Ij4KPG1ldGFkYXRhPgpDcmVhdGVkIGJ5IHBvdHJhY2UgMS4xNSwgd3JpdHRlbiBieSBQZXRlciBTZWxpbmdlciAyMDAxLTIwMTcKPC9tZXRhZGF0YT4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsMTI4MC4wMDAwMDApIHNjYWxlKDAuMTAwMDAwLC0wLjEwMDAwMCkiCmZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSI+CjxwYXRoIGQ9Ik02MjY5IDEyNjkzIGMtMTE3OSAtMjEgLTIzNTAgLTM4NSAtMzMzNCAtMTAzOCAtMTI5MiAtODU2IC0yMjE4Ci0yMTM4IC0yNjE1IC0zNjIzIC0xNDYgLTU0NSAtMjEwIC0xMDQzIC0yMTAgLTE2MzIgMCAtMzk4IDIxIC02NjggODEgLTEwMzMKMzI5IC0yMDAxIDE2MTYgLTM3MjggMzQ0NCAtNDYyMiA2NjkgLTMyNyAxMzUyIC01MjQgMjA5NSAtNjA0IDQxNCAtNDUgOTUzCi00MyAxMzg1IDUgMTYwNCAxNzkgMzA5MiA5ODUgNDEzMiAyMjM5IDc4MiA5NDQgMTI3MyAyMDk0IDE0MDcgMzMwMCA1MCA0NTEKNTAgOTgwIDEgMTQyNSAtMjUzIDIyNDcgLTE3MDMgNDE5MiAtMzc5MCA1MDgzIC04MTUgMzQ4IC0xNjg5IDUxNiAtMjU5NiA1MDB6Cm00MTQgLTIwMCBjLTIzIC0yIC02NCAtMiAtOTAgMCAtMjYgMiAtNyAzIDQyIDMgNTAgMCA3MSAtMSA0OCAtM3ogbTE3NSAtMTAKYy0xNSAtMiAtNDIgLTIgLTYwIDAgLTE4IDIgLTYgNCAyNyA0IDMzIDAgNDggLTIgMzMgLTR6IG04NSAtMTAgYy03IC0yIC0xOQotMiAtMjUgMCAtNyAzIC0yIDUgMTIgNSAxNCAwIDE5IC0yIDEzIC01eiBtLTMwOTcgLTUyOSBjMSAtNSAtNzMgLTQ2IC0xNjYKLTkxIC0xMTkgLTU4IC0xNjcgLTc3IC0xNjYgLTY2IDMgMTYgMzAyIDE3NCAzMjAgMTY5IDYgLTEgMTEgLTYgMTIgLTEyegptMzA1NCAtMTM5IGMxMTMxIC0xMDcgMjE3NCAtNTQ5IDMwMzUgLTEyODYgMTU0IC0xMzIgNDUyIC00MzAgNTg0IC01ODQgNjYzCi03NzUgMTA5MSAtMTcwNSAxMjQ1IC0yNzA1IDQ2IC0zMDAgNjAgLTQ5MCA2MCAtODMwIDAgLTM0MCAtMTQgLTUyOCAtNjAgLTgzMAotMTUxIC05OTEgLTU4NiAtMTkzNyAtMTI0NSAtMjcwNSAtMTMyIC0xNTQgLTQzMCAtNDUyIC01ODQgLTU4NCAtNzY4IC02NTkKLTE3MTQgLTEwOTQgLTI3MDUgLTEyNDUgLTMwMiAtNDYgLTQ5MCAtNjAgLTgzMCAtNjAgLTM0MCAwIC01MzAgMTQgLTgzMCA2MAotMTAwMCAxNTQgLTE5MzAgNTgyIC0yNzA1IDEyNDUgLTE1NCAxMzIgLTQ1MiA0MzAgLTU4NCA1ODQgLTczOSA4NjMgLTExNzQKMTg5MiAtMTI4NyAzMDQ1IC0yNCAyNDEgLTI0IDczOSAwIDk4MCAxMTIgMTE0MSA1MjYgMjEzMiAxMjYwIDMwMTUgMTI5IDE1NQo0ODYgNTEyIDY0MSA2NDEgOTQzIDc4NCAyMDQ0IDEyMTYgMzI1NSAxMjc4IDE0OCA3IDU4OCAtNCA3NTAgLTE5eiBtLTM0MDgKLTM5IGM3IDQgOCAyIDQgLTQgLTExIC0xOCAtMjYgLTE0IC0yNSA2IDAgMTAgMyAxMiA2IDQgMiAtNiAxMCAtOSAxNSAtNnoKbTYxMDggLTE3MiBjMCAtMiAtOSAwIC0yMCA2IC0xMSA2IC0yMCAxMyAtMjAgMTYgMCAyIDkgMCAyMCAtNiAxMSAtNiAyMCAtMTMKMjAgLTE2eiBtODAgLTUwIGMwIC0yIC05IDAgLTIwIDYgLTExIDYgLTIwIDEzIC0yMCAxNiAwIDIgOSAwIDIwIC02IDExIC02IDIwCi0xMyAyMCAtMTZ6IG0yMjAgLTE1MCBjMCAtMyAtMTMgNCAtMzAgMTYgLTE2IDEyIC0zMCAyNCAtMzAgMjYgMCAzIDE0IC00IDMwCi0xNiAxNyAtMTIgMzAgLTI0IDMwIC0yNnogbS04NDkwIC0xNDk4IGMwIC0yIC04IC0xMCAtMTcgLTE3IC0xNiAtMTMgLTE3IC0xMgotNCA0IDEzIDE2IDIxIDIxIDIxIDEzeiBtLTE2MCAtMjM2IGMtNiAtMTEgLTEzIC0yMCAtMTYgLTIwIC0yIDAgMCA5IDYgMjAgNgoxMSAxMyAyMCAxNiAyMCAyIDAgMCAtOSAtNiAtMjB6IG0xMDUxNCAtMzQ2IGMzIC04IDIgLTEyIC00IC05IC02IDMgLTEwIDEwCi0xMCAxNiAwIDE0IDcgMTEgMTQgLTd6IG05NyAtMTg1IGMyNyAtNTYgNDkgLTEwMyA0NyAtMTA1IC0yIC0yIC0yNyA0NCAtNTYKMTAxIC0yOCA1OCAtNTAgMTA1IC00NyAxMDUgMyAwIDI4IC00NSA1NiAtMTAxeiBtLTExNTM0IC0yMjA2IGMtMyAtMTAgLTUgLTIKLTUgMTcgMCAxOSAyIDI3IDUgMTggMiAtMTAgMiAtMjYgMCAtMzV6IG0tMTAgLTEyNSBjLTIgLTE4IC00IC02IC00IDI3IDAgMzMKMiA0OCA0IDMzIDIgLTE1IDIgLTQyIDAgLTYweiBtLTEwIC0yMTEgYy0yIC0yMyAtMyAtMSAtMyA0OCAwIDUwIDEgNjggMyA0MiAyCi0yNiAyIC02NyAwIC05MHogbTEyMTkwIC00NzkgYy0yIC0yOSAtMyAtOCAtMyA0NyAwIDU1IDEgNzkgMyA1MyAyIC0yNiAyIC03MQowIC0xMDB6IG0xMCAtMTI1IGMtMiAtMTYgLTQgLTUgLTQgMjIgMCAyOCAyIDQwIDQgMjggMiAtMTMgMiAtMzUgMCAtNTB6IG0tMTQKLTQ4IGM0IC02OCAzIC04NyAtMyAtNjAgLTkgMzkgLTE0IDE3MiAtNiAxNjQgMiAtMiA2IC00OSA5IC0xMDR6IG0wIC0xMDcgYzgKLTUgNiAtOCAtNSAtOCAtMTQgMCAtMTggOCAtMTcgMzggMiAzNCAyIDM0IDYgNyAzIC0xNiAxMCAtMzMgMTYgLTM3eiBtLTExNTQ0Ci0yMTU1IGMyOCAtNTcgNDkgLTEwMyA0NiAtMTAzIC01IDAgLTEwNSAxOTYgLTEwNSAyMDYgMCAxMyA3IDAgNTkgLTEwM3ogbTk5Ci0xOTggYy0zIC0zIC05IDIgLTEyIDEyIC02IDE0IC01IDE1IDUgNiA3IC03IDEwIC0xNSA3IC0xOHogbTEwMzkyIC01MTkgYzAKLTIgLTggLTEwIC0xNyAtMTcgLTE2IC0xMyAtMTcgLTEyIC00IDQgMTMgMTYgMjEgMjEgMjEgMTN6IG0tODUxOSAtMTU2MyBjMTMKLTE2IDEyIC0xNyAtMyAtNCAtMTcgMTMgLTIyIDIxIC0xNCAyMSAyIDAgMTAgLTggMTcgLTE3eiBtMjM5IC0xNTkgYzAgLTIgLTkKMCAtMjAgNiAtMTEgNiAtMjAgMTMgLTIwIDE2IDAgMiA5IDAgMjAgLTYgMTEgLTYgMjAgLTEzIDIwIC0xNnogbTgwIC01MCBjMAotMiAtOSAwIC0yMCA2IC0xMSA2IC0yMCAxMyAtMjAgMTYgMCAyIDkgMCAyMCAtNiAxMSAtNiAyMCAtMTMgMjAgLTE2eiBtNTk3MAotMTk5IGMwIC02IC0xNzcgLTk1IC0xODcgLTk0IC02IDAgMTc0IDk2IDE4NSA5OCAxIDEgMiAtMSAyIC00eiBtLTMzMjcgLTY2MgpjLTcgLTIgLTE5IC0yIC0yNSAwIC03IDMgLTIgNSAxMiA1IDE0IDAgMTkgLTIgMTMgLTV6IG0xMjUgLTEwIGMtMTUgLTIgLTQyCi0yIC02MCAwIC0xOCAyIC02IDQgMjcgNCAzMyAwIDQ4IC0yIDMzIC00eiBtMjA1IC0xMCBjLTIzIC0yIC02NCAtMiAtOTAgMAotMjYgMiAtNyAzIDQyIDMgNTAgMCA3MSAtMSA0OCAtM3oiLz4KPHBhdGggZD0iTTM1OTAgMTE4MzAgYy00MSAtMjEgLTcyIC0zOSAtNjcgLTQwIDEwIDAgMTQ3IDY5IDE0NyA3NSAwIDcgMyA4Ci04MCAtMzV6Ii8+CjwvZz4KPC9zdmc+Cg==';
        editor.openBlank();
        editor.editorModule.insertPicture(data,200,100,false);
        let imageUrl:string='data:image/png;base64,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';
        let imageString=((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] instanceof ImageElementBox;
        expect(imageString).toBeDefined(imageUrl);
    });    
});
describe('Character Formatting of Heading', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSfdtExport: true });
        DocumentEditor.Inject(Editor, Selection);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((): void => {
        if (editor) {
            editor.destroy();
        }
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
    });
    it('changing from Normal to heading 1', () => {
        editor.editor.insertText('Syncfusion')
        editor.selection.selectAll();
        editor.selection.characterFormat.fontFamily = 'Algerian'
        editor.editor.applyStyle("Heading 1", true);
        editor.selection.selectAll();
        expect(editor.selection.characterFormat.fontFamily).toBe('Calibri Light');
    });
});
describe('To check whether revisions are added after pressing enter inside table', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSfdtExport: true });
        DocumentEditor.Inject(Editor, Selection);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((): void => {
        if (editor) {
            editor.destroy();
        }
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
    });
    it('Press Enter inside the table', () => {
        editor.editor.insertTable(1,1);
        editor.editor.insertBookmark('S');
        editor.enableTrackChanges = true;
        editor.selection.handleDownKey();
        editor.selection.handleUpKey();
        editor.editor.onEnter();
        expect(editor.revisions.length).toBe(1);
    });
});
describe('Removing newly created line after enableTrackChanges', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSfdtExport: true });
        DocumentEditor.Inject(Editor, Selection);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((): void => {
        if (editor) {
            editor.destroy();
        }
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
    });
    it('Removing newly created line after enableTrackChanges', () => {
        editor.editor.insertText('HellowWorld');
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.enableTrackChanges = true;
        editor.editor.onEnter();
        editor.editor.onBackSpace();
        let paraLength: number = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length;
        let textElement1: string = (((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text;
        let textElement2: string = (((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as TextElementBox).text;
        expect(editor.revisions.length).toBe(0);
        expect(textElement1).toBe('Hellow');
        expect(textElement2).toBe('World');
        expect(paraLength).toBe(1);
    });
});
// describe("Paste Validation", () => {
//     let editor: DocumentEditor = undefined;
//     let viewer: LayoutViewer;
//     beforeAll(() => {
//         document.body.innerHTML = "";
//         let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1000px;height:600px' });
//         document.body.appendChild(ele);
//         DocumentEditor.Inject(Editor, Selection);
//         editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
//         (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.appendTo('#container');
//     });
//     afterAll((done) => {
//         document.body.removeChild(document.getElementById('container'));
//         editor.destroy();
//         editor = undefined;
//         viewer = undefined;
//         setTimeout(function () {
//            done();
//         },750);
//     });
//     it("Paste image Validation", async () => {
//         let data: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADQSURBVFhH7ZbRDYQgDIYZ5UZhFEdxlBuFUUhY4N7vwWtTURJz5tem8GAbTYS0/eGjWsN7hJVSAuku3c2FuyF31BvqBNu90/mLmnSRjKDbMZULt2csz/kV8hRbVjSkSZkxRC0yKcbl+6FLhttSDIV5W6vYnKeZVWkR1WyFGbhIHrAbCzPhEcL1XCvqptYMd7xXExUXM4+pT3ENe53OP5yGqJ8kDDZGpIld6E730uFR/uuDs1J6OmolQDzcUeOslJ6OWgkQD3fUOCulJ6Ome4j9AGEu0k90WN54AAAAAElFTkSuQmCC';
//         editor.openBlank();
//         editor.editorModule.onPasteImage(data);
//         let isimage: boolean = (editor.selection.start.paragraph.childWidgets[0] as LineWidget).children[0] instanceof ImageElementBox;
//         setTimeout(function () { expect(isimage).toBe(true); }, 300);
//     });
// });

