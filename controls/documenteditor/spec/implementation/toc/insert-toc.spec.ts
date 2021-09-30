import { createElement, } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer, DocumentHelper } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { Layout } from '../../../src/document-editor/implementation/viewer/layout';
import { TableOfContentsSettings } from '../../../src/index';
import { ParagraphWidget, FieldElementBox, LineWidget, TextElementBox, HelperMethods, ElementBox } from '../../../src/index';
import { WStyle } from '../../../src/document-editor/implementation/format/style';
function getJson(): any {
    let wordDocumentJson: any = {
        "sections": [{ "blocks": [{ "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [{ "text": "First " }, { "text": "head", "characterFormat": { "bold": true } }, { "text": "ing", "characterFormat": { "bold": true, "underline": "Single" } }] }, { "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [{ "text": "Second " }, { "text": "he", "characterFormat": { "bold": true } }, { "text": "a" }, { "text": "d", "characterFormat": { "italic": true } }, { "text": "i" }, { "text": "ng", "characterFormat": { "underline": "Single" } }] }, { "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [{ "text": "Third " }, { "text": "hea", "characterFormat": { "bold": true } }, { "text": "di", "characterFormat": { "italic": true } }, { "text": "ng", "characterFormat": { "underline": "Single" } }, { "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }] }, { "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [{ "text": "Fourth " }, { "text": "h", "characterFormat": { "bold": true } }, { "text": "ea", "characterFormat": { "underline": "Single" } }, { "text": "d" }, { "text": "ing", "characterFormat": { "italic": true } }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }, { "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Paragraph", "name": "Heading 1", "basedOn": "Normal", "next": "Normal", "link": "Heading 1 Char", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#FF2F5496" }, "paragraphFormat": { "beforeSpacing": 12.0, "afterSpacing": 0.0, "outlineLevel": "Level1" } }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Heading 1 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#FF2F5496" } }]
    }
    return wordDocumentJson;
}
describe('Insert Toc (hyperlink,page number,right alignment)', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
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
    it('Field element', () => {
console.log('Field element');
        editor.openBlank();
        editor.open(JSON.stringify(getJson()));
        editor.editorModule.insertTableOfContents(tocSettings);
        let field: FieldElementBox = ((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FieldElementBox;
        expect(field instanceof FieldElementBox).toBe(true);
    });
    it('Filed code', () => {
console.log('Filed code');
        editor.openBlank();
        editor.open(JSON.stringify(getJson()));
        editor.editorModule.insertTableOfContents(tocSettings);
        let field: FieldElementBox = ((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FieldElementBox;
        expect((field.nextNode as TextElementBox).text.toLowerCase()).toBe('toc \\o "1-3" \\h \\z');
    });
    it('paragraph style', () => {
console.log('paragraph style');
        editor.openBlank();
        editor.open(JSON.stringify(getJson()));
        editor.editorModule.insertTableOfContents(tocSettings);
        let paragraph: ParagraphWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget);
        expect(paragraph.paragraphFormat.baseStyle.name).toBe('Toc1');
    });
    it('Right Tab', () => {
console.log('Right Tab');
        editor.openBlank();
        editor.open(JSON.stringify(getJson()));
        editor.editorModule.insertTableOfContents(tocSettings);
        let paragraph: ParagraphWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget);
        expect(paragraph.paragraphFormat.tabs.length).toBe(1);
    });
    it('Hyperlink style', () => {
console.log('Hyperlink style');
        editor.openBlank();
        editor.open(JSON.stringify(getJson()));
        editor.editorModule.insertTableOfContents(tocSettings);
        let text: TextElementBox = ((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[6] as TextElementBox;
        expect(text.text).toBe('First heading');
    });
    it('Toc styles', () => {
console.log('Toc styles');
        editor.openBlank();
        editor.open(JSON.stringify(getJson()));
        editor.editorModule.insertTableOfContents(tocSettings);
        expect(editor.editorModule.tocStyles['Heading 3']).toBe(undefined);
    });
});

describe('Insert Toc - page number and right alignment', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let event: any;
    let currentPara: ParagraphWidget = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
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
    it('Widgets to be paste', () => {
console.log('Widgets to be paste');
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

let tocwithstyle: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false,"restartPageNumbering":true,"pageStartingNumber":1},"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"toc","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"Table Of Contents"}]},{"paragraphFormat":{"styleName":"TOC 1","listFormat":{},"tabs":[{"position":467.5,"deletePosition":0,"tabJustification":"Right","tabLeader":"Dot"}]},"characterFormat":{"fontSize":11,"fontFamily":"Calibri","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"inlines":[{"characterFormat":{},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontColor":"empty"},"text":"TOC \\t \"MyStyle,1,\"\\h \\z "},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontColor":"empty"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontColor":"empty"},"text":"HYPERLINK \\l \"_Toc72946619\""},{"characterFormat":{},"fieldType":2},{"characterFormat":{"styleName":"TOC 1"},"text":"Part  1        Chapter1"},{"characterFormat":{"fontColor":"empty"},"text":"\t"},{"characterFormat":{"fontColor":"empty"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontColor":"empty"},"text":" PAGEREF _Toc72946619 \\h "},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontColor":"empty"},"text":"2"},{"characterFormat":{},"fieldType":1},{"characterFormat":{},"fieldType":1}]},{"paragraphFormat":{"styleName":"TOC 1","listFormat":{},"tabs":[{"position":467.5,"deletePosition":0,"tabJustification":"Right","tabLeader":"Dot"}]},"characterFormat":{"fontSize":11,"fontFamily":"Calibri","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"inlines":[{"characterFormat":{"fontColor":"empty"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontColor":"empty"},"text":"HYPERLINK \\l \"_Toc72946620\""},{"characterFormat":{},"fieldType":2},{"characterFormat":{"styleName":"TOC 1"},"text":"Part  2        Chapter 2"},{"characterFormat":{"fontColor":"empty"},"text":"\t"},{"characterFormat":{"fontColor":"empty"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontColor":"empty"},"text":" PAGEREF _Toc72946620 \\h "},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontColor":"empty"},"text":"3"},{"characterFormat":{},"fieldType":1},{"characterFormat":{},"fieldType":1}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"toc","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{},"fieldType":1}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{},"tabs":[{"position":523,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"},{"position":523,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"inlines":[]}]},"evenHeader":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenFooter":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageHeader":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]}}},{"sectionFormat":{"pageWidth":595.2999877929688,"pageHeight":841.9000244140625,"leftMargin":50,"rightMargin":20,"topMargin":20,"bottomMargin":20,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"MyStyle","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"_Toc72946619"},{"characterFormat":{"fontColor":"empty"},"text":"Part  1        Chapter1"},{"characterFormat":{},"bookmarkType":1,"name":"_Toc72946619"},{"characterFormat":{"fontColor":"empty"},"text":" "}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{},"tabs":[{"position":523,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenHeader":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenFooter":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageHeader":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]}}},{"sectionFormat":{"pageWidth":595.2999877929688,"pageHeight":841.9000244140625,"leftMargin":50,"rightMargin":20,"topMargin":20,"bottomMargin":20,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"MyStyle","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"_Toc72946620"},{"characterFormat":{"fontColor":"empty"},"text":"Part  2        Chapter 2"},{"characterFormat":{},"bookmarkType":1,"name":"_Toc72946620"},{"characterFormat":{"fontColor":"empty"},"text":" "}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{},"tabs":[{"position":523,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenHeader":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenFooter":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageHeader":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Times New Roman","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{"fontColor":"empty"}},{"name":"toc","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"bold":true,"fontSize":18,"fontFamily":"Verdana","fontColor":"empty","boldBidi":true,"fontSizeBidi":18,"fontFamilyBidi":"Verdana"},"basedOn":"Normal","next":"toc"},{"name":"MyStyle","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":14,"fontFamily":"Verdana","fontColor":"empty","fontSizeBidi":14,"fontFamilyBidi":"Verdana"},"basedOn":"Normal","next":"MyStyle"},{"name":"Hyperlink","type":"Character","characterFormat":{"underline":"Single","fontColor":"#0000FFFF"},"basedOn":"Default Paragraph Font"},{"name":"TOC 1","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","next":"Normal"},{"name":"Header","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":225.64999389648438,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":451.29998779296875,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":225.64999389648438,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":451.29998779296875,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"basedOn":"Default Paragraph Font"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Update TOC validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let event: any;
    let currentPara: ParagraphWidget = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
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
    it('Update table of contents by context menu', () => {
        editor.open(JSON.stringify(tocwithstyle));
        editor.selection.moveDown();
        editor.editor.updateToc();
        expect(editor.selection.start.paragraph.bodyWidget.childWidgets.length).toBe(5);
    });
    // it('Insert table of contents by Toc pane', () => {
    //     editor.open(JSON.stringify(tocwithstyle));
    //     let tocSetting: TableOfContentsSettings = {'endLevel': 3,
    //         'includeHyperlink': true,
    //         'includePageNumber': true,
    //         'rightAlign': true,
    //         'startLevel': 1,
    //         'tabLeader': 'Dot'};
    //     editor.selection.moveDown();
    //     editor.editor.insertTableOfContents(tocSetting);
    //     expect(editor.selection.start.paragraph.bodyWidget.childWidgets.length).toBe(4);
    // });
    // it('Field link validation', () => {
    //     editor.open(JSON.stringify(tocwithstyle));
    //     let tocSetting: TableOfContentsSettings = {'endLevel': 3,
    //         'includeHyperlink': true,
    //         'includePageNumber': true,
    //         'rightAlign': true,
    //         'startLevel': 1,
    //         'tabLeader': 'Dot'}
    //     editor.selection.moveDown();
    //     editor.editor.insertTableOfContents(tocSetting);
    //     let isLinked = HelperMethods.isLinkedFieldCharacter((editor.selection.start.paragraph.lastChild as LineWidget).children[0] as FieldElementBox);
    //     expect(isLinked).toBe(true);
    // });
});
