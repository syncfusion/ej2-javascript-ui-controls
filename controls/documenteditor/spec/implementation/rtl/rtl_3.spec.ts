import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, DocumentHelper, ParagraphWidget, LineWidget, TextElementBox, FieldElementBox } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { LayoutViewer, PageLayoutViewer } from '../../../src/index';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';

/**
 * RTL Formatting validation
 */

let text: string = '{"sections":[{"blocks":[{"characterFormat":{"bidi":true},"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"הגיעה קולקציית ","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","bidi":true,"fontFamilyBidi":"Arial"}},{"text":"<<","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","fontFamilyBidi":"Arial"}},{"text":"Lead#First","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","fontFamilyBidi":"Arial"}},{"text":" name>>","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","fontFamilyBidi":"Arial"}},{"text":" ","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","bidi":true,"fontFamilyBidi":"Arial"}},{"text":"מרהיבה! עשרות דגמים חדשים במחירים מפתיעים לחברי מועדון בלבד. מחכים לכם ב","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","bidi":true,"fontFamilyBidi":"Arial"}},{"text":" ","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","bidi":true,"fontFamilyBidi":"Arial"}},{"text":"<<","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","fontFamilyBidi":"Arial"}},{"text":"Lead#Last","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","fontFamilyBidi":"Arial"}},{"text":" name>>","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","fontFamilyBidi":"Arial"}},{"text":".","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","bidi":true,"fontFamilyBidi":"Arial"}},{"name":"_GoBack","bookmarkType":0},{"name":"_GoBack","bookmarkType":1}]}],"headersFooters":{},"sectionFormat":{"headerDistance":35.400001525878906,"footerDistance":35.400001525878906,"pageWidth":595.29998779296875,"pageHeight":841.9000244140625,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":true,"restartPageNumbering":false,"pageStartingNumber":0}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","paragraphFormat":{"bidi":true}},{"type":"Character","name":"Default Paragraph Font"}],"defaultTabWidth":36.0,"formatting":false,"protectionType":"NoProtection","enforcement":false}';
describe('Character formatting in RTL paragraph', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(text);
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('bold apply', () => {
        editor.selection.handleControlLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.characterFormat.bold=true;
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((lineWidget.children[lineWidget.children.length-1] as TextElementBox).text).toBe('הגיעה');
    });
});


describe('Character formatting with RTL and english paragraph', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('bold apply', () => {
        editor.selection.paragraphFormat.bidi = true;
        editor.editor.insertText('سشةحمث');
        editor.editor.insertText(' ');
        editor.editor.insertText('اثممخ');
        editor.editor.insertText(' ');
        editor.editor.insertText('sample');
        editor.editor.insertText('?');
        editor.selection.handleControlRightKey();
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((lineWidget.children[0] as TextElementBox).text).toBe('sample?');
    });
});