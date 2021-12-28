import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, TableWidget } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';
import { LineWidget, ImageElementBox } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { LayoutViewer, DocumentHelper, TableCellWidget, TableRowWidget } from '../../../src/index';

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
