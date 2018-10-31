import { createElement, } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { Layout } from '../../../src/document-editor/implementation/viewer/layout';
import { TableOfContentsSettings } from '../../../src/index';
import { ParagraphWidget, FieldElementBox, LineWidget, TextElementBox } from '../../../src/index';
import { WStyle } from '../../../src/document-editor/implementation/format/style';
function getJson(): any {
    let wordDocumentJson: any = {
        "sections": [{ "blocks": [{ "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [{ "text": "First " }, { "text": "head", "characterFormat": { "bold": true } }, { "text": "ing", "characterFormat": { "bold": true, "underline": "Single" } }] }, { "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [{ "text": "Second " }, { "text": "he", "characterFormat": { "bold": true } }, { "text": "a" }, { "text": "d", "characterFormat": { "italic": true } }, { "text": "i" }, { "text": "ng", "characterFormat": { "underline": "Single" } }] }, { "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [{ "text": "Third " }, { "text": "hea", "characterFormat": { "bold": true } }, { "text": "di", "characterFormat": { "italic": true } }, { "text": "ng", "characterFormat": { "underline": "Single" } }, { "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }] }, { "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [{ "text": "Fourth " }, { "text": "h", "characterFormat": { "bold": true } }, { "text": "ea", "characterFormat": { "underline": "Single" } }, { "text": "d" }, { "text": "ing", "characterFormat": { "italic": true } }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }, { "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Paragraph", "name": "Heading 1", "basedOn": "Normal", "next": "Normal", "link": "Heading 1 Char", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#FF2F5496" }, "paragraphFormat": { "beforeSpacing": 12.0, "afterSpacing": 0.0, "outlineLevel": "Level1" } }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Heading 1 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#FF2F5496" } }]
    }
    return wordDocumentJson;
}
describe('Insert Toc (hyperlink,page number,right alignment)', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    let event: any;
    let currentPara: ParagraphWidget = undefined;
    let tocSettings: TableOfContentsSettings =
        {
            startLevel: 1, endLevel: 3, includeHyperlink: true, includePageNumber: true, rightAlign: true
        };
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Field element', () => {
        editor.openBlank();
        editor.open(JSON.stringify(getJson()));
        editor.editorModule.insertTableOfContents(tocSettings);
        let field: FieldElementBox = ((editor.viewer.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FieldElementBox;
        expect(field instanceof FieldElementBox).toBe(true);
    });
    it('Filed code', () => {
        editor.openBlank();
        editor.open(JSON.stringify(getJson()));
        editor.editorModule.insertTableOfContents(tocSettings);
        let field: FieldElementBox = ((editor.viewer.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FieldElementBox;
        expect((field.nextNode as TextElementBox).text.toLowerCase()).toBe('toc \\o "1-3" \\h \\z');
    });
    it('paragraph style', () => {
        editor.openBlank();
        editor.open(JSON.stringify(getJson()));
        editor.editorModule.insertTableOfContents(tocSettings);
        let paragraph: ParagraphWidget = (editor.viewer.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget);
        expect(paragraph.paragraphFormat.baseStyle.name).toBe('Toc1');
    });
    it('Right Tab', () => {
        editor.openBlank();
        editor.open(JSON.stringify(getJson()));
        editor.editorModule.insertTableOfContents(tocSettings);
        let paragraph: ParagraphWidget = (editor.viewer.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget);
        expect(paragraph.paragraphFormat.tabs.length).toBe(1);
    });
    it('Hyperlink style', () => {
        editor.openBlank();
        editor.open(JSON.stringify(getJson()));
        editor.editorModule.insertTableOfContents(tocSettings);
        let text: TextElementBox = ((editor.viewer.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[6] as TextElementBox;
        expect(text.text).toBe('First heading');
    });
    it('Toc styles', () => {
        editor.openBlank();
        editor.open(JSON.stringify(getJson()));
        editor.editorModule.insertTableOfContents(tocSettings);
        expect(editor.editorModule.tocStyles['Heading 3']).toBe(undefined);
    });
});

describe('Insert Toc - page number and right alignment', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    let event: any;
    let currentPara: ParagraphWidget = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Widgets to be paste', () => {
        editor.openBlank();
        editor.open(JSON.stringify(getJson()));
        let tocSettings: TableOfContentsSettings =
            {
                startLevel: 1, endLevel: 3, includeHyperlink: true, includePageNumber: true, rightAlign: true
            };
        let widgets: ParagraphWidget[] = editor.editorModule.buildToc(tocSettings, 'toc /mergeformat', true);
        expect(widgets.length).toBe(4);
        for (let i: number = 0; i < widgets.length; i++) {
            expect(widgets[i].paragraphFormat.baseStyle.name).toBe('Toc1');
        }
    });
});
