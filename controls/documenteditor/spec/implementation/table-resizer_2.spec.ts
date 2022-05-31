import { LayoutViewer, PageLayoutViewer, DocumentHelper } from '../../src/index';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { TextPosition } from '../../src/index';
import { Point } from '../../src/document-editor/implementation/editor/editor-helper';
import { Editor } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { TableWidget, TableRowWidget, TableCellWidget } from '../../src/index';

describe('Nested Table Row Resizing validation and After merge cell resize cell at middle validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1000px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Nested Table Row Resizing validation', () => {
console.log('Nested Table Row Resizing validation');
        documentHelper = editor.documentHelper;
        editor.editor.insertTable(2, 2);
        editor.editor.insertTable(2, 2);
        editor.editorModule.tableResize.currentResizingTable = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        editor.editorModule.tableResize.resizeNode = 1;
        documentHelper.isRowOrCellResizing = true;
        editor.editorModule.tableResize.resizerPosition = 0;
        editor.editorModule.tableResize.startingPoint = new Point(227.5, 114);
        editor.editorModule.tableResize.resizeTableRow(2);
        expect(editor.editorModule.tableResize.resizerPosition).toBe(0);
    });
    it('After merge cell resize cell at middle validation', () => {
console.log('After merge cell resize cell at middle validation');
        documentHelper = editor.documentHelper;
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.selection.handleShiftDownKey();
        editor.editor.mergeCells();
        editor.selection.handleUpKey();
        editor.selection.handleShiftRightKey();
        editor.editorModule.tableResize.currentResizingTable = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget
        editor.editorModule.tableResize.resizeNode = 0;
        documentHelper.isRowOrCellResizing = true;
        editor.editorModule.tableResize.resizerPosition = 1;
        editor.editorModule.tableResize.startingPoint = new Point(408.5, 104);
        documentHelper.currentPage = documentHelper.pages[0];
        editor.editorModule.tableResize.resizeTableCellColumn(-1);
        expect(editor.editorModule.tableResize.resizerPosition).toBe(1);
    });

});

describe('After resize cell validation without selection', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:100%;height:100%'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Resize without selection', () => {
console.log('Resize without selection');
        documentHelper = editor.documentHelper;
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.selection.handleShiftDownKey();
        editor.editor.mergeCells();
        editor.selection.handleUpKey();
        editor.editorModule.tableResize.currentResizingTable = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget
        editor.editorModule.tableResize.resizeNode = 0;
        documentHelper.isRowOrCellResizing = true;
        editor.editorModule.tableResize.resizerPosition = 1;
        editor.editorModule.tableResize.startingPoint = new Point(1075, 124);
        editor.editorModule.tableResize.resizeTableCellColumn(500.5);
        expect(((editor.selection.tableFormat.table.childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.cellWidth).toBe(468);
    });
    it('Resize without selection and merge cell in first column', () => {
console.log('Resize without selection and merge cell in first column');
        documentHelper = editor.documentHelper;
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.selection.handleRightKey();
        editor.selection.handleShiftDownKey();
        editor.editor.mergeCells();
        editor.selection.handleUpKey();
        editor.editorModule.tableResize.currentResizingTable = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget
        editor.editorModule.tableResize.resizeNode = 0;
        documentHelper.isRowOrCellResizing = true;
        editor.editorModule.tableResize.resizerPosition = 1;
        editor.editorModule.tableResize.startingPoint = new Point(407.5, 127);
        documentHelper.currentPage = documentHelper.pages[0];
        editor.editorModule.tableResize.resizeTableCellColumn(1);
        expect(editor.editorModule.tableResize.resizerPosition).toBe(1);
    });
});
describe('After resize cell validation with selection', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:100%;height:100%'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Resize with selection', () => {
console.log('Resize with selection');
        documentHelper = editor.documentHelper;
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.selection.handleShiftDownKey();
        editor.editor.mergeCells();
        editor.editorModule.tableResize.currentResizingTable = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget
        editor.editorModule.tableResize.resizeNode = 0;
        documentHelper.isRowOrCellResizing = true;
        editor.editorModule.tableResize.resizerPosition = 1;
        editor.editorModule.tableResize.startingPoint = new Point(407, 122);
        editor.editorModule.tableResize.resizeTableCellColumn(-80);
        expect(editor.editorModule.tableResize.resizerPosition).toBe(1);
    });
});


describe('Table Column resizing validation with selection', () => {
    let editor: DocumentEditor = undefined;
    beforeEach((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterEach((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Resize Table Row', () => {
console.log('Resize Table Row');
        editor.editor.insertTable(2, 2);
        let event: any = { offsetX: 557, offsetY: 134, preventDefault: function () { }, ctrlKey: false, which: 1 };
        editor.documentHelper.onMouseDownInternal(event);
        editor.editorModule.tableResize.resizerPosition = 1;
        editor.editorModule.tableResize.resizeNode = 1;
        editor.editorModule.tableResize.startingPoint.x = 305.5;
        editor.editorModule.tableResize.startingPoint.y = 114;
        let point: Point = new Point(305.5, 115);
        editor.editorModule.tableResize.handleResizing(point);

        event = { offsetX: 557, offsetY: 135, preventDefault: function () { }, ctrlKey: false, which: 0 };
        editor.documentHelper.onMouseMoveInternal(event);
        event = { offsetX: 561, offsetY: 193, preventDefault: function () { }, ctrlKey: false, which: 0 };
        editor.documentHelper.onMouseMoveInternal(event);
        editor.documentHelper.onMouseUpInternal(event);
        editor.editorHistory.undo();
        editor.editorHistory.redo();
    });

});


describe(' Table Row Resizing validation in header', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1000px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it(' Table Row Resizing validation in header', () => {
console.log(' Table Row Resizing validation header');
        documentHelper = editor.documentHelper;
       documentHelper.owner.selection.goToHeader();
        editor.editor.insertTable(2, 2);
        editor.editorModule.tableResize.currentResizingTable = documentHelper.pages[0].headerWidget.childWidgets[0] as TableWidget;
        let height: number = documentHelper.pages[0].headerWidget.height;
        editor.editorModule.tableResize.resizeNode = 1;
        documentHelper.isRowOrCellResizing = true;
        editor.editorModule.tableResize.resizerPosition = 0;
        editor.editorModule.tableResize.startingPoint = new Point(227.5, 114);
        editor.editorModule.tableResize.resizeTableRow(2);
        expect(documentHelper.pages[0].headerWidget.height).toBeGreaterThan(height);
    });
});
describe('Check the minimum width for cell', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:100%;height:100%'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Check the minimum width for cell', () => {
        console.log('Check the minimum width for cell');
        documentHelper = editor.documentHelper;
        editor.openBlank();
        editor.editor.insertTable(1, 1);
        editor.selection.handleShiftDownKey();
        editor.selection.handleUpKey();
        editor.editorModule.tableResize.currentResizingTable = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget
        editor.editorModule.tableResize.resizeNode = 0;
        documentHelper.isRowOrCellResizing = true;
        editor.editorModule.tableResize.resizerPosition = 1;
        editor.editorModule.tableResize.startingPoint = new Point(1075, 124);
        editor.editorModule.tableResize.resizeTableCellColumn(-608);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).width).toBe(5.9);
    });
});
let text: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false,"pageNumberStyle":"Arabic"},"blocks":[{"rows":[{"cells":[{"blocks":[{"rows":[{"cells":[{"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"afterSpacing":7.5,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":15,"fontFamily":"Helvetica","fontColor":"#0A0A0AFF","fontSizeBidi":15,"fontFamilyBidi":"Helvetica"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":388.19999998807907,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":15,"fontFamily":"Helvetica","fontColor":"#0A0A0AFF","fontSizeBidi":15,"fontFamilyBidi":"Helvetica"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":0.30000001192092896,"preferredWidthType":"Point","cellWidth":0.30000001192092896,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1}],"rowFormat":{"height":4,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0,"leftMargin":0,"rightMargin":0}}],"grid":[388.19999998807907,0.30000001192092896],"tableFormat":{"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":0,"leftMargin":0,"bottomMargin":0,"preferredWidth":388.5,"preferredWidthType":"Point","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":2,"wrapTextAround":true,"positioning":{"allowOverlap":false,"distanceBottom":0,"distanceLeft":9,"distanceRight":9,"distanceTop":0,"verticalAlignment":"None","verticalOrigin":"Margin","verticalPosition":-73.5,"horizontalAlignment":"Left","horizontalOrigin":"Margin","horizontalPosition":0}},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"afterSpacing":7.5,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":15,"fontFamily":"Helvetica","fontColor":"#0A0A0AFF","fontSizeBidi":15,"fontFamilyBidi":"Helvetica"},"inlines":[{"characterFormat":{"fontSize":15,"fontFamily":"Helvetica","fontColor":"#0A0A0AFF","fontSizeBidi":15,"fontFamilyBidi":"Helvetica"},"text":"Address"},{"characterFormat":{"fontSize":15,"fontFamily":"Helvetica","fontColor":"#0A0A0AFF","fontSizeBidi":15,"fontFamilyBidi":"Helvetica"},"text":"\u000b"},{"characterFormat":{"bold":true,"fontSize":15,"fontFamily":"Helvetica","fontColor":"#0A0A0AFF","boldBidi":true,"fontSizeBidi":15,"fontFamilyBidi":"Helvetica"},"text":"1407 Lexington Ave, New York, NY 10001"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":388.19999998807907,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":15,"fontFamily":"Helvetica","fontColor":"#0A0A0AFF","fontSizeBidi":15,"fontFamilyBidi":"Helvetica"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":0.30000001192092896,"preferredWidthType":"Point","cellWidth":0.30000001192092896,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0,"leftMargin":0,"rightMargin":0}}],"grid":[388.19999998807907,0.30000001192092896],"tableFormat":{"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":0,"leftMargin":0,"bottomMargin":0,"preferredWidth":388.5,"preferredWidthType":"Point","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":2,"wrapTextAround":true,"positioning":{"allowOverlap":false,"distanceBottom":0,"distanceLeft":9,"distanceRight":9,"distanceTop":0,"verticalAlignment":"None","verticalOrigin":"Paragraph","verticalPosition":-5.1,"horizontalAlignment":"Left","horizontalOrigin":"Margin","horizontalPosition":0}},{"paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":15,"fontFamily":"Helvetica","fontColor":"#0A0A0AFF","fontSizeBidi":15,"fontFamilyBidi":"Helvetica"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"topMargin":0,"rightMargin":0,"leftMargin":0,"bottomMargin":12,"preferredWidth":388.5,"preferredWidthType":"Point","cellWidth":388.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":4,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0,"leftMargin":0,"rightMargin":0}}],"grid":[388.5],"tableFormat":{"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":0,"leftMargin":0,"bottomMargin":0,"preferredWidth":388.5,"preferredWidthType":"Point","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":1,"wrapTextAround":true,"positioning":{"allowOverlap":false,"distanceBottom":0,"distanceLeft":9,"distanceRight":9,"distanceTop":0,"verticalAlignment":"None","verticalOrigin":"Margin","verticalPosition":-71.25,"horizontalAlignment":"Left","horizontalOrigin":"Column","horizontalPosition":0}},{"paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Helvetica","fontColor":"#FFFFFFFF","fontSizeBidi":8,"fontFamilyBidi":"Helvetica"},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Helvetica","fontColor":"#0A0A0AFF","fontSizeBidi":8,"fontFamilyBidi":"Helvetica"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"topMargin":0,"rightMargin":0,"leftMargin":0,"bottomMargin":12,"preferredWidth":388.5,"preferredWidthType":"Point","cellWidth":388.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0,"leftMargin":0,"rightMargin":0}}],"grid":[388.5],"tableFormat":{"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":0,"leftMargin":0,"bottomMargin":0,"preferredWidth":388.5,"preferredWidthType":"Point","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":1},{"paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Helvetica","fontColor":"#FFFFFFFF","fontSizeBidi":8,"fontFamilyBidi":"Helvetica"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#375866FF","foregroundColor":"empty","textureStyle":"TextureNone"},"topMargin":11.25,"rightMargin":11.25,"leftMargin":11.25,"bottomMargin":11.25,"preferredWidth":411,"preferredWidthType":"Point","cellWidth":410.9999877899603,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Times New Roman","fontSizeBidi":8,"fontFamilyBidi":"Times New Roman"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#FEFEFEFF","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":0.30000001192092896,"preferredWidthType":"Point","cellWidth":0.30000000300849083,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":42.75,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0,"leftMargin":0,"rightMargin":0}}],"grid":[410.9999877899603,0.30000000300849083],"tableFormat":{"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#FEFEFEFF","foregroundColor":"empty","textureStyle":"TextureNone"},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":0,"leftMargin":0,"bottomMargin":0,"preferredWidth":411.29998779296875,"preferredWidthType":"Point","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":2,"wrapTextAround":true,"positioning":{"allowOverlap":true,"distanceBottom":0,"distanceLeft":9,"distanceRight":9,"distanceTop":0,"verticalAlignment":"None","verticalOrigin":"Margin","verticalPosition":-60,"horizontalAlignment":"Left","horizontalOrigin":"Margin","horizontalPosition":0}},{"paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"inlines":[]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"leftIndent":36,"listFormat":{},"contextualSpacing":true},"characterFormat":{},"basedOn":"Normal","next":"List Paragraph"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Nested table height validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1000px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Nested table height validation', () => {
        console.log('Nested table height validation');
        editor.openBlank();
        editor.open(text);
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).height).toBe(144.15000000000003);
    });
});