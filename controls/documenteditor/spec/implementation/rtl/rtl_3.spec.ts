import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, DocumentHelper, ParagraphWidget, LineWidget, TextElementBox, FieldElementBox, ListTextElementBox } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { LayoutViewer, PageLayoutViewer } from '../../../src/index';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';

/**
 * RTL Formatting validation
 */

describe('Character formatting in RTL paragraph', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let text: string = '{"sections":[{"blocks":[{"characterFormat":{"bidi":true},"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"הגיעה קולקציית ","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","bidi":true,"fontFamilyBidi":"Arial"}},{"text":"<<","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","fontFamilyBidi":"Arial"}},{"text":"Lead#First","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","fontFamilyBidi":"Arial"}},{"text":" name>>","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","fontFamilyBidi":"Arial"}},{"text":" ","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","bidi":true,"fontFamilyBidi":"Arial"}},{"text":"מרהיבה! עשרות דגמים חדשים במחירים מפתיעים לחברי מועדון בלבד. מחכים לכם ב","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","bidi":true,"fontFamilyBidi":"Arial"}},{"text":" ","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","bidi":true,"fontFamilyBidi":"Arial"}},{"text":"<<","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","fontFamilyBidi":"Arial"}},{"text":"Lead#Last","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","fontFamilyBidi":"Arial"}},{"text":" name>>","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","fontFamilyBidi":"Arial"}},{"text":".","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","bidi":true,"fontFamilyBidi":"Arial"}},{"name":"_GoBack","bookmarkType":0},{"name":"_GoBack","bookmarkType":1}]}],"headersFooters":{},"sectionFormat":{"headerDistance":35.400001525878906,"footerDistance":35.400001525878906,"pageWidth":595.29998779296875,"pageHeight":841.9000244140625,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":true,"restartPageNumbering":false,"pageStartingNumber":0}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","paragraphFormat":{"bidi":true}},{"type":"Character","name":"Default Paragraph Font"}],"defaultTabWidth":36.0,"formatting":false,"protectionType":"NoProtection","enforcement":false}';
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
        text = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('bold apply', () => {
console.log('bold apply');
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
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('bold apply', () => {
console.log('bold apply');
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
let rtlList: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":63.79999923706055,"rightMargin":37.900001525878906,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":0,"footerDistance":8.5,"bidi":true},"blocks":[{"paragraphFormat":{"textAlignment":"Right","styleName":"List Paragraph","listFormat":{"listId":8,"listLevelNumber":0},"bidi":true},"characterFormat":{"fontSize":10,"fontFamily":"Calibri","bidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"inlines":[{"characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Calibri","bidi":true,"boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"ניהול מו"},{"characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Calibri","bidi":true,"boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"\""},{"characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Calibri","bidi":true,"boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"מ"},{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","bidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":" "},{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","bidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"עם ספקים בארץ ובחול"},{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":" "}]},{"paragraphFormat":{"textAlignment":"Right","styleName":"List Paragraph","listFormat":{},"bidi":true},"characterFormat":{"fontSize":10,"fontFamily":"Calibri","bidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"textAlignment":"Right","styleName":"Normal","listFormat":{},"bidi":true},"characterFormat":{"fontSize":10,"fontFamily":"Calibri","bidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"textAlignment":"Right","styleName":"Footer","listFormat":{}},"characterFormat":{"fontSize":8.5,"bidi":true,"fontSizeBidi":8.5},"inlines":[{"characterFormat":{"fontSize":8.5,"fontSizeBidi":8.5},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontSize":8.5,"fontSizeBidi":8.5},"text":" PAGE   \\* MERGEFORMAT "},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontSize":8.5,"fontSizeBidi":8.5},"text":"1"},{"characterFormat":{},"fieldType":1},{"characterFormat":{"fontSize":8.5,"bidi":true,"fontSizeBidi":8.5},"text":"                   "}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Footer","listFormat":{}},"characterFormat":{"fontSize":8.5,"fontFamily":"Calibri Light","fontColor":"#595959FF","fontSizeBidi":8.5,"fontFamilyBidi":"Calibri Light"},"inlines":[{"characterFormat":{"fontSize":8.5,"fontFamily":"Calibri Light","fontColor":"#595959FF","bidi":true,"fontSizeBidi":8.5,"fontFamilyBidi":"Calibri Light"},"text":"עמית עתיר ניהול פרויקטים והפקות, קיבוץ אפיקים"},{"characterFormat":{"fontSize":8.5,"fontFamily":"Calibri Light","fontColor":"#595959FF","bidi":true,"fontSizeBidi":8.5,"fontFamilyBidi":"Calibri Light"},"text":" /"},{"characterFormat":{"fontSize":8.5,"fontFamily":"Calibri Light","fontColor":"#595959FF","bidi":true,"fontSizeBidi":8.5,"fontFamilyBidi":"Calibri Light"},"text":" רמת גן , טל-052-4252484"}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Footer","listFormat":{}},"characterFormat":{"fontSize":8.5,"fontFamily":"Calibri Light","fontColor":"#595959FF","fontSizeBidi":8.5,"fontFamilyBidi":"Calibri Light"},"inlines":[{"characterFormat":{"fontSize":8.5,"fontFamily":"Calibri Light","fontColor":"#595959FF","fontSizeBidi":8.5,"fontFamilyBidi":"Calibri Light"},"text":"Email – "},{"characterFormat":{},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{},"text":"HYPERLINK \"mailto:amitatir@gmail.com\" "},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontSize":8.5,"fontFamily":"Calibri Light","fontColor":"#1F497DFF","styleName":"Hyperlink","fontSizeBidi":8.5,"fontFamilyBidi":"Calibri Light"},"text":"amitatir@gmail.com"},{"characterFormat":{},"fieldType":1}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8.5,"fontSizeBidi":8.5},"inlines":[]}]},"evenHeader":{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenFooter":{"blocks":[{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageHeader":{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Times New Roman","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"apple-converted-space","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"Header","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":207.64999389648438,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":415.29998779296875,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{"fontSize":12,"fontSizeBidi":12},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":207.64999389648438,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":415.29998779296875,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{"fontSize":12,"fontSizeBidi":12},"basedOn":"Default Paragraph Font"},{"name":"Hyperlink","type":"Character","characterFormat":{"underline":"Single","fontColor":"#0000FFFF"},"basedOn":"Default Paragraph Font"},{"name":"Unresolved Mention1","type":"Character","characterFormat":{"fontColor":"#808080FF"},"basedOn":"Default Paragraph Font"},{"name":"FollowedHyperlink","type":"Character","characterFormat":{"underline":"Single","fontColor":"#800080FF"},"basedOn":"Default Paragraph Font"},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"leftIndent":36,"listFormat":{},"contextualSpacing":true},"characterFormat":{},"basedOn":"Normal","next":"List Paragraph"},{"name":"annotation reference","type":"Character","characterFormat":{"fontSize":8,"fontSizeBidi":8},"basedOn":"Default Paragraph Font"},{"name":"annotation text","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontSizeBidi":10},"basedOn":"Normal","link":"Comment Text Char","next":"annotation text"},{"name":"Comment Text Char","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"annotation subject","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"bold":true,"boldBidi":true},"basedOn":"annotation text","link":"Comment Subject Char","next":"annotation text"},{"name":"Comment Subject Char","type":"Character","characterFormat":{"bold":true,"boldBidi":true},"basedOn":"Comment Text Char"},{"name":"Balloon Text","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":9,"fontFamily":"Tahoma","fontSizeBidi":9,"fontFamilyBidi":"Tahoma"},"basedOn":"Normal","link":"Balloon Text Char","next":"Balloon Text"},{"name":"Balloon Text Char","type":"Character","characterFormat":{"fontSize":9,"fontFamily":"Tahoma","fontSizeBidi":9,"fontFamilyBidi":"Tahoma"},"basedOn":"Default Paragraph Font"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[{"abstractListId":8,"levelOverrides":[],"listId":8}],"abstractLists":[{"abstractListId":8,"levels":[{"characterFormat":{"fontFamily":"Symbol","fontFamilyBidi":"Symbol"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings","fontFamilyBidi":"Wingdings"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Symbol","fontFamilyBidi":"Symbol"},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings","fontFamilyBidi":"Wingdings"},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Symbol","fontFamilyBidi":"Symbol"},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings","fontFamilyBidi":"Wingdings"},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0}]}],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8.5,"fontSizeBidi":8.5},"inlines":[{"characterFormat":{"fontSize":8.5,"fontSizeBidi":8.5},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8.5,"fontSizeBidi":8.5},"inlines":[{"characterFormat":{"fontSize":8.5,"fontSizeBidi":8.5},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8.5,"fontSizeBidi":8.5},"inlines":[{"characterFormat":{"fontSize":8.5,"fontSizeBidi":8.5},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":8.5,"fontSizeBidi":8.5},"inlines":[{"characterFormat":{"fontSize":8.5,"fontSizeBidi":8.5},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Rtl list delete validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true, enableRtl: true });
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
    it('Rtl list delete validation', () => {
        editor.open(JSON.stringify(rtlList));
        editor.selection.select('0;0;0','0;0;32');
        editor.editor.onBackSpace();
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect(lineWidget.children.length).toBe(2);
        expect(lineWidget.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });
});
