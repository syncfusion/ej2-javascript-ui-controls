import { createElement, } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer, DocumentHelper } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { Layout } from '../../../src/document-editor/implementation/viewer/layout';
import { TableOfContentsSettings } from '../../../src/index';
import { ParagraphWidget, FieldElementBox, LineWidget, TextElementBox } from '../../../src/index';
import { WStyle } from '../../../src/document-editor/implementation/format/style';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
function getJson(): any {
    let wordDocumentJson: any = {
        "sections": [{ "blocks": [{ "paragraphFormat": { "lineSpacing": 1.0, "lineSpacingType": "Multiple", "styleName": "Heading 1" }, "inlines": [{ "text": "heading" }] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "lineSpacing": 1.0, "lineSpacingType": "Multiple", "styleName": "Normal" }, "inlines": [] }] }, "footer": { "blocks": [{ "paragraphFormat": { "lineSpacing": 1.0, "lineSpacingType": "Multiple", "styleName": "Normal" }, "inlines": [] }] } }, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false } }], "paragraphFormat": { "lineSpacing": 1.0, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Character", "name": "Default Paragraph Font" }, { "type": "Paragraph", "name": "Normal", "next": "Normal", "paragraphFormat": { "lineSpacing": 1.0, "lineSpacingType": "Multiple" } }, { "type": "Character", "name": "Heading 1 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#FF2F5496" } }, { "type": "Paragraph", "name": "Heading 1", "basedOn": "Normal", "next": "Normal", "link": "Heading 1 Char", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#FF2F5496" }, "paragraphFormat": { "beforeSpacing": 12.0, "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple" } }]
    }
    return wordDocumentJson;
}
describe('undo and redo toc', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let event: any;
    let currentPara: ParagraphWidget = undefined;
    let tocSettings: TableOfContentsSettings =
    {
        startLevel: 1, endLevel: 3, includeHyperlink: true, includePageNumber: true, rightAlign: true, includeOutlineLevels: true
    };
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, Editor, EditorHistory);
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
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('paragraph length - undo and redo', () => {
console.log('paragraph length - undo and redo');
        editor.openBlank();
        editor.open(JSON.stringify(getJson()));
        let paraWidgets: ParagraphWidget[] = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets as ParagraphWidget[];
        expect(paraWidgets.length).toBe(1);
        editor.editorModule.insertTableOfContents();
        paraWidgets = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets as ParagraphWidget[];
        expect(paraWidgets.length).toBe(3);
        editor.editorHistory.undo();
        paraWidgets = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets as ParagraphWidget[];
        expect(paraWidgets.length).toBe(1);
        editor.editorHistory.redo();
        paraWidgets = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets as ParagraphWidget[];
        expect(paraWidgets.length).toBe(3);
    });
    it('paragraph length - multiple undo', () => {
console.log('paragraph length - multiple undo');
        editor.openBlank();
        editor.open(JSON.stringify(getJson()));
        editor.editorModule.insertTableOfContents();
        editor.editorModule.insertTableOfContents();
        editor.editorModule.insertTableOfContents();
        let paraWidgets: ParagraphWidget[] = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets as ParagraphWidget[];
        expect(paraWidgets.length).toBe(7);
        editor.editorHistory.undo();
        paraWidgets = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets as ParagraphWidget[];
        expect(paraWidgets.length).toBe(5);
        editor.editorHistory.undo();
        paraWidgets = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets as ParagraphWidget[];
        expect(paraWidgets.length).toBe(3);
        editor.editorHistory.undo();
        paraWidgets = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets as ParagraphWidget[];
        expect(paraWidgets.length).toBe(1);
    });
    it('paragraph length - multiple undo', () => {
console.log('paragraph length - multiple undo');
        editor.openBlank();
        editor.open(JSON.stringify(getJson()));
        editor.editorModule.insertTableOfContents();
        editor.editorModule.insertTableOfContents();
        editor.editorModule.insertTableOfContents();
        let paraWidgets: ParagraphWidget[] = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets as ParagraphWidget[];
        expect(paraWidgets.length).toBe(7);
        editor.editorHistory.undo();
        editor.editorHistory.redo();
        paraWidgets = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets as ParagraphWidget[];
        expect(paraWidgets.length).toBe(7);
        editor.editorHistory.undo();
        editor.editorHistory.undo();
        editor.editorHistory.redo();
        editor.editorHistory.redo();
        paraWidgets = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets as ParagraphWidget[];
        expect(paraWidgets.length).toBe(7);
    });
});
