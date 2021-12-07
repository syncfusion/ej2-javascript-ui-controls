import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, DocumentHelper, ParagraphWidget, LineWidget, TextElementBox } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { LayoutViewer, PageLayoutViewer } from '../../../src/index';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';

/**
 * RTL layout validation
 */

describe('Rtl with special charater layout with bidi true', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let letterTemplate: string = '{"sections":[{"blocks":[{"characterFormat":{"fontSize":12.0,"bidi":true,"fontSizeBidi":12.0},"paragraphFormat":{"styleName":"Normal","bidi":true},"inlines":[{"text":"قم  ( ","characterFormat":{"fontSize":12.0,"bidi":true,"fontSizeBidi":12.0}},{"hasFieldEnd":true,"fieldType":0},{"text":" ","characterFormat":{"bold":true,"fontSize":12.0,"bidi":true,"boldBidi":true,"fontSizeBidi":12.0}},{"text":"MERGEFIELD","characterFormat":{"bold":true,"fontSize":12.0,"boldBidi":true,"fontSizeBidi":12.0}},{"text":" ","characterFormat":{"bold":true,"fontSize":12.0,"bidi":true,"boldBidi":true,"fontSizeBidi":12.0}},{"text":"BookId","characterFormat":{"bold":true,"fontSize":12.0,"boldBidi":true,"fontSizeBidi":12.0}},{"text":" ","characterFormat":{"bold":true,"fontSize":12.0,"bidi":true,"boldBidi":true,"fontSizeBidi":12.0}},{"fieldType":2},{"text":"«","characterFormat":{"bold":true,"fontSize":12.0,"bidi":true,"boldBidi":true,"fontSizeBidi":12.0}},{"text":"BookId","characterFormat":{"bold":true,"fontSize":12.0,"fontColor":"#FF0000FF","boldBidi":true,"fontSizeBidi":12.0}},{"text":"»","characterFormat":{"bold":true,"fontSize":12.0,"bidi":true,"boldBidi":true,"fontSizeBidi":12.0}},{"fieldType":1},{"text":" ) المؤرخ ","characterFormat":{"fontSize":12.0,"bidi":true,"fontSizeBidi":12.0}}]},{"characterFormat":{"bold":true,"fontSize":12.0,"boldBidi":true,"fontSizeBidi":12.0},"paragraphFormat":{"styleName":"Normal","bidi":true},"inlines":[{"text":"نود الاحاطة انه بالاطلاع على المراسة المرسلة بتصيف ","characterFormat":{"fontSize":12.0,"bidi":true,"fontSizeBidi":12.0}},{"hasFieldEnd":true,"fieldType":0},{"text":" ","characterFormat":{"fontSize":12.0,"bidi":true,"fontSizeBidi":12.0}},{"text":"MERGEFIELD","characterFormat":{"fontSize":12.0,"fontSizeBidi":12.0}},{"text":" ","characterFormat":{"fontSize":12.0,"bidi":true,"fontSizeBidi":12.0}},{"text":"Category","characterFormat":{"fontSize":12.0,"fontSizeBidi":12.0}},{"text":" ","characterFormat":{"fontSize":12.0,"bidi":true,"fontSizeBidi":12.0}},{"fieldType":2},{"text":"«","characterFormat":{"fontSize":12.0,"bidi":true,"fontSizeBidi":12.0}},{"text":"Category","characterFormat":{"fontSize":12.0,"fontSizeBidi":12.0}},{"text":"»","characterFormat":{"fontSize":12.0,"bidi":true,"fontSizeBidi":12.0}},{"fieldType":1},{"text":" مع اجراء ","characterFormat":{"fontSize":12.0,"bidi":true,"fontSizeBidi":12.0}},{"hasFieldEnd":true,"fieldType":0},{"text":" ","characterFormat":{"fontSize":12.0,"bidi":true,"fontSizeBidi":12.0}},{"text":"MERGEFIELD","characterFormat":{"fontSize":12.0,"fontSizeBidi":12.0}},{"text":" ","characterFormat":{"fontSize":12.0,"bidi":true,"fontSizeBidi":12.0}},{"text":"Procedure","characterFormat":{"fontSize":12.0,"fontSizeBidi":12.0}},{"text":" ","characterFormat":{"fontSize":12.0,"bidi":true,"fontSizeBidi":12.0}},{"fieldType":2},{"text":"«","characterFormat":{"fontSize":12.0,"bidi":true,"fontSizeBidi":12.0}},{"text":"Procedure","characterFormat":{"fontSize":12.0,"fontColor":"#FF0000FF","fontSizeBidi":12.0}},{"text":"»","characterFormat":{"fontSize":12.0,"bidi":true,"fontSizeBidi":12.0}},{"fieldType":1},{"text":"  مع ","characterFormat":{"fontSize":12.0,"bidi":true,"fontSizeBidi":12.0}},{"hasFieldEnd":true,"fieldType":0},{"text":" ","characterFormat":{"bold":true,"fontSize":12.0,"bidi":true,"boldBidi":true,"fontSizeBidi":12.0}},{"text":"MERGEFIELD","characterFormat":{"bold":true,"fontSize":12.0,"boldBidi":true,"fontSizeBidi":12.0}},{"text":" ","characterFormat":{"bold":true,"fontSize":12.0,"bidi":true,"boldBidi":true,"fontSizeBidi":12.0}},{"text":"Note","characterFormat":{"bold":true,"fontSize":12.0,"boldBidi":true,"fontSizeBidi":12.0}},{"text":" ","characterFormat":{"bold":true,"fontSize":12.0,"bidi":true,"boldBidi":true,"fontSizeBidi":12.0}},{"fieldType":2},{"text":"«","characterFormat":{"bold":true,"fontSize":12.0,"bidi":true,"boldBidi":true,"fontSizeBidi":12.0}},{"text":"Note","characterFormat":{"bold":true,"fontSize":12.0,"fontColor":"#FF0000FF","boldBidi":true,"fontSizeBidi":12.0}},{"text":"»","characterFormat":{"bold":true,"fontSize":12.0,"bidi":true,"boldBidi":true,"fontSizeBidi":12.0}},{"fieldType":1}]},{"characterFormat":{"fontSize":12.0,"fontSizeBidi":12.0},"paragraphFormat":{"styleName":"Normal","bidi":true},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","bidi":true},"inlines":[{"text":"لذا يرجي التكرم بموافتنا بتدرج","characterFormat":{"fontSize":12.0,"bidi":true,"fontSizeBidi":12.0}},{"name":"_GoBack","bookmarkType":0},{"name":"_GoBack","bookmarkType":1},{"text":" مرتب التأمين التكميلي المذكور  من الفترة 1-2-2018 الى","characterFormat":{"fontSize":12.0,"bidi":true,"fontSizeBidi":12.0}}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Character","name":"Default Paragraph Font"}],"defaultTabWidth":36.0,"formatting":false,"protectionType":"NoProtection","enforcement":false}';
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
        editor.open(letterTemplate);
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        letterTemplate = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Number validation with RTL bidi true', () => {
console.log('Number validation with RTL bidi true');
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[3] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((lineWidget.children[2] as TextElementBox).text).toBe('1-2-2018');
    });
    it('special character validation with Rtl Text', () => {
console.log('special character validation with Rtl Text');
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((lineWidget.children[12] as TextElementBox).text).toBe('«');
    });
    it('insert field at start of text element with line widget contains special character', () => {
console.log('insert field at start of text element with line widget contains special character');
        editor.editor.insertField('MERGEFIELD  MyField  \\* MERGEFORMAT', '«MyField»');
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((lineWidget.children[12] as TextElementBox).text).toBe('«');
    });
});

describe('Rtl special charater layout with bidi true and combinational text', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let specialCharacter: string = '{"sections":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","bidi":true},"inlines":[{"text":"דשצפךק@#$% ","characterFormat":{"fontSize":12.0,"bidi":true,"fontSizeBidi":12.0}},{"text":"sample@#$% ","characterFormat":{"fontSize":12.0,"fontSizeBidi":12.0}},{"name":"_GoBack","bookmarkType":0},{"name":"_GoBack","bookmarkType":1}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Character","name":"Default Paragraph Font"}],"defaultTabWidth":36.0,"formatting":false,"protectionType":"NoProtection","enforcement":false}';
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
        editor.open(specialCharacter);
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        specialCharacter = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('English with special character', () => {
console.log('English with special character');
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((lineWidget.children[0] as TextElementBox).text).toBe('sample@#$% ');
    });
    it('Hebrew with special character', () => {
console.log('Hebrew with special character');
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((lineWidget.children[3] as TextElementBox).text).toBe(' ');
    });
});
