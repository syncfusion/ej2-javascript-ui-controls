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
let mergetext: any = {"sections":[{"sectionFormat":{"pageWidth":595.4500122070312,"pageHeight":841.7000122070312,"leftMargin":70.55000305175781,"rightMargin":71.4000015258789,"topMargin":70.55000305175781,"bottomMargin":56.900001525878906,"differentFirstPage":true,"differentOddAndEvenPages":false,"headerDistance":28.350000381469727,"footerDistance":28.350000381469727,"bidi":false,"restartPageNumbering":true,"pageStartingNumber":1,"pageNumberStyle":"Arabic"},"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{},"tabs":[{"position":35.400001525878906,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":70.80000305175781,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":106.19999694824219,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":141.60000610351562,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":177,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":212.39999389648438,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":247.8000030517578,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":283.20001220703125,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":318.6000061035156,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":354,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":389.3999938964844,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":424.79998779296875,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":460.20001220703125,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":495.6000061035156,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontSize":18,"fontFamily":"Calibri Light","fontColor":"#2A2A2AFF","fontSizeBidi":18,"fontFamilyBidi":"Calibri Light"},"inlines":[{"characterFormat":{"fontSize":18,"fontFamily":"Calibri Light","fontColor":"#2A2A2AFF","fontSizeBidi":18,"fontFamilyBidi":"Calibri Light"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontSize":18,"fontFamily":"Calibri Light","fontColor":"#2A2A2AFF","fontSizeBidi":18,"fontFamilyBidi":"Calibri Light"},"text":" MERGEFIELD 80dfcc68-7882-4aae-954b-15c4081cbe63 "},{"characterFormat":{"fontSize":18,"fontFamily":"Calibri Light","fontColor":"#2A2A2AFF","fontSizeBidi":18,"fontFamilyBidi":"Calibri Light"},"fieldType":2},{"characterFormat":{"fontSize":18,"fontFamily":"Calibri Light","fontColor":"#2A2A2AFF","fontSizeBidi":18,"fontFamilyBidi":"Calibri Light"},"text":"Nutzungsausfall/Vorhalte- u. Betriebskosten"},{"characterFormat":{"fontSize":18,"fontFamily":"Calibri Light","fontColor":"#2A2A2AFF","fontSizeBidi":18,"fontFamilyBidi":"Calibri Light"},"fieldType":1}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{"backgroundColor":"#ECECECFF","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":345.70001220703125,"preferredWidthType":"Point","cellWidth":345.70001220703125,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"textAlignment":"Right","afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{},"tabs":[{"position":35.400001525878906,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":70.80000305175781,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":106.19999694824219,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":141.60000610351562,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":177,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":212.39999389648438,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":247.8000030517578,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":283.20001220703125,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":318.6000061035156,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":354,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":389.3999938964844,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":424.79998779296875,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":460.20001220703125,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":495.6000061035156,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontSize":18,"fontFamily":"Calibri Light","fontColor":"#2A2A2AFF","fontSizeBidi":18,"fontFamilyBidi":"Calibri Light"},"inlines":[{"characterFormat":{"fontSize":18,"fontFamily":"Calibri Light","fontColor":"#2A2A2AFF","fontSizeBidi":18,"fontFamilyBidi":"Calibri Light"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontSize":18,"fontFamily":"Calibri Light","fontColor":"#2A2A2AFF","fontSizeBidi":18,"fontFamilyBidi":"Calibri Light"},"text":" MERGEFIELD ce23861d-696f-4353-b15a-4a78b0653705 "},{"characterFormat":{"fontSize":18,"fontFamily":"Calibri Light","fontColor":"#2A2A2AFF","fontSizeBidi":18,"fontFamilyBidi":"Calibri Light"},"fieldType":2},{"characterFormat":{"fontSize":18,"fontFamily":"Calibri Light","fontColor":"#2A2A2AFF","fontSizeBidi":18,"fontFamilyBidi":"Calibri Light"},"fieldType":1},{"characterFormat":{"fontSize":18,"fontFamily":"Calibri Light","fontColor":"#2A2A2AFF","fontSizeBidi":18,"fontFamilyBidi":"Calibri Light"},"text":"  "},{"characterFormat":{"fontSize":18,"fontFamily":"Calibri Light","fontColor":"#2A2A2AFF","fontSizeBidi":18,"fontFamilyBidi":"Calibri Light"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontSize":18,"fontFamily":"Calibri Light","fontColor":"#2A2A2AFF","fontSizeBidi":18,"fontFamilyBidi":"Calibri Light"},"text":" MERGEFIELD 2e0ba773-cf74-4ec4-b601-c3fcee7775f7 "},{"characterFormat":{"fontSize":18,"fontFamily":"Calibri Light","fontColor":"#2A2A2AFF","fontSizeBidi":18,"fontFamilyBidi":"Calibri Light"},"fieldType":2},{"characterFormat":{"fontSize":18,"fontFamily":"Calibri Light","fontColor":"#2A2A2AFF","fontSizeBidi":18,"fontFamilyBidi":"Calibri Light"},"fieldType":1}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{"backgroundColor":"#ECECECFF","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":100.5,"preferredWidthType":"Point","cellWidth":100.5,"columnSpan":2,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0,"leftMargin":1.8,"topMargin":0,"rightMargin":1.8,"bottomMargin":0,"leftIndent":1.8}}],"grid":[345.70001220703125,0,100.5],"tableFormat":{"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"leftIndent":1.7999999523162842,"tableAlignment":"Left","topMargin":0,"rightMargin":1.7999999523162842,"leftMargin":1.7999999523162842,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":false},"description":null,"title":null,"columnCount":3},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"[Normal]","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"[Normal]","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"[Normal]","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"[Normal]","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"[Normal]","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"text":" MERGEFIELD "},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":2},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":1}]}]},"footer":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"[Normal]","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"[Normal]","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"textAlignment":"Right","styleName":"[Normal]","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"text":" PAGE \\* Arabic \\* MERGEFORMAT "},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":2},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"text":"2"},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":1},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"text":" von "},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"text":" NUMPAGES 1320085e-e102-4088-b0a1-34c20ef37c49 "},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":2},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"text":"1"},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":1}]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"[Normal]","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"text":" MERGEFIELD "},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":2},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":1}]}]},"firstPageHeader":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"[Normal]","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"[Normal]","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"[Normal]","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"[Normal]","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"[Normal]","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"[Normal]","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"text":" MERGEFIELD "},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":2},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":1}]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"[Normal]","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"text":" MERGEFIELD "},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":2},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":1}]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":12,"fontFamily":"Arial","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":12,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":56.70000076293945,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"[Normal]","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":56.70000076293945,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":113.4000015258789,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":170.10000610351562,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":226.8000030517578,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":283.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":340.20001220703125,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":396.8999938964844,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":453.6000061035156,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":510.29998779296875,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":567,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":623.7000122070312,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":680.4000244140625,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":737.0999755859375,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":793.7999877929688,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}],"widowControl":false},"characterFormat":{"bold":false,"italic":false,"fontSize":12,"fontFamily":"Arial","strikethrough":"None","fontColor":"#00000000","bidi":false,"boldBidi":false,"italicBidi":false,"fontSizeBidi":12,"fontFamilyBidi":"Arial"},"next":"[Normal]"},{"name":"Normal","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":10,"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple","listFormat":{},"widowControl":true},"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","strikethrough":"None","fontColor":"#00000000","bidi":false,"boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Validate the merged cell width', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1280px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableEditorHistory: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
    it('Validate the merged cell width', () => {
        console.log('Validate the merged cell width');
        editor.open(JSON.stringify(mergetext));
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[1] as TableCellWidget).width).toBe(129.2);
    });
});