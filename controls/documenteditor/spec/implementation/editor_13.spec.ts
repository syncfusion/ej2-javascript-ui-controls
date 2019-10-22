import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget } from '../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, TableCellWidget, TextElementBox, TextHelper, RtlInfo, ListTextElementBox, LineWidget, TabElementBox, TextPosition } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
let content: any = { "sections": [{ "blocks": [{ "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "bidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 36, "rightIndent": 0, "firstLineIndent": -18, "beforeSpacing": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "BodyText", "textAlignment": "Left", "styleName": "List Paragraph", "listFormat": { "listLevelNumber": 0, "listId": 0 }, "bidi": false, "contextualSpacing": true }, "inlines": [{ "text": "Welcome", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "bidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" } }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36, "footerDistance": 36, "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false, "restartPageNumbering": false, "pageStartingNumber": 0 } }], "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "textAlignment": "Left" }, "lists": [{ "listId": 0, "abstractListId": 0 }], "abstractLists": [{ "abstractListId": 0, "levels": [{ "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Symbol", "fontColor": "#00000000", "fontFamilyBidi": "Symbol" }, "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -18, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "o", "characterFormat": { "bold": false, "fontFamily": "Courier New" }, "paragraphFormat": { "leftIndent": 72, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Wingdings" }, "paragraphFormat": { "leftIndent": 108, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Symbol" }, "paragraphFormat": { "leftIndent": 144, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "o", "characterFormat": { "bold": false, "fontFamily": "Courier New" }, "paragraphFormat": { "leftIndent": 180, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Wingdings" }, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Symbol" }, "paragraphFormat": { "leftIndent": 252, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "o", "characterFormat": { "bold": false, "fontFamily": "Courier New" }, "paragraphFormat": { "leftIndent": 288, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Wingdings" }, "paragraphFormat": { "leftIndent": 324, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }] }], "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "bidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "textAlignment": "Left" } }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Paragraph", "name": "List Paragraph", "basedOn": "Normal", "next": "List Paragraph", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "bidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 36, "rightIndent": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "textAlignment": "Left", "contextualSpacing": true } }], "defaultTabWidth": 36, "formatting": false, "protectionType": "NoProtection", "enforcement": false };
describe('Paste list content from outside editor ', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection);
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Paste list on new page', () => {
        (editor.editor as any).pasteFormattedContent({ data: content });
        expect(editor.viewer.lists.length).toBe(1);
    });
    it('Paste list on page with same existing list', () => {
        editor.viewer.lists = [];
        editor.viewer.abstractLists = [];
        editor.openBlank();
        editor.editor.applyBullet('\uf0b7', 'Symbol');
        editor.editor.insertText('Welcome');
        editor.editor.onEnter();
        editor.editor.onEnter();
        (editor.editor as any).pasteFormattedContent({ data: content });
        expect(editor.viewer.lists.length).toBe(1);
    });
    it('Paste list on page with different format existing list', () => {
        editor.viewer.lists = [];
        editor.viewer.abstractLists = [];
        editor.openBlank();
        editor.editor.applyNumbering('%1.', 'LowRoman');
        editor.editor.insertText('Welcome');
        editor.editor.onEnter();
        editor.editor.onEnter();
        content = { "sections": [{ "blocks": [{ "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "bidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 36, "rightIndent": 0, "firstLineIndent": -18, "beforeSpacing": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "BodyText", "textAlignment": "Left", "styleName": "List Paragraph", "listFormat": { "listLevelNumber": 0, "listId": 0 }, "bidi": false, "contextualSpacing": true }, "inlines": [{ "text": "Welcome", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "bidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" } }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36, "footerDistance": 36, "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false, "restartPageNumbering": false, "pageStartingNumber": 0 } }], "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "textAlignment": "Left" }, "lists": [{ "listId": 0, "abstractListId": 0 }], "abstractLists": [{ "abstractListId": 0, "levels": [{ "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Symbol", "fontColor": "#00000000", "fontFamilyBidi": "Symbol" }, "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -18, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "o", "characterFormat": { "bold": false, "fontFamily": "Courier New" }, "paragraphFormat": { "leftIndent": 72, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Wingdings" }, "paragraphFormat": { "leftIndent": 108, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Symbol" }, "paragraphFormat": { "leftIndent": 144, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "o", "characterFormat": { "bold": false, "fontFamily": "Courier New" }, "paragraphFormat": { "leftIndent": 180, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Wingdings" }, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Symbol" }, "paragraphFormat": { "leftIndent": 252, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "o", "characterFormat": { "bold": false, "fontFamily": "Courier New" }, "paragraphFormat": { "leftIndent": 288, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Wingdings" }, "paragraphFormat": { "leftIndent": 324, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }] }], "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "bidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "textAlignment": "Left" } }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Paragraph", "name": "List Paragraph", "basedOn": "Normal", "next": "List Paragraph", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "bidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 36, "rightIndent": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "textAlignment": "Left", "contextualSpacing": true } }], "defaultTabWidth": 36, "formatting": false, "protectionType": "NoProtection", "enforcement": false };
        (editor.editor as any).pasteFormattedContent({ data: content });
        expect(editor.viewer.lists.length).toBe(2);
    });
    it('copy paste list internal', () => {
        editor.viewer.lists = [];
        editor.viewer.abstractLists = [];
        editor.enableLocalPaste = true;
        editor.openBlank();
        editor.editor.insertText('Welcome');
        editor.editor.onEnter();
        editor.editor.applyNumbering('%1.', 'LowRoman');
        editor.editor.insertText('Welcome');
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.selection.selectAll();
        editor.selection.copy();
        editor.editor.paste();
        expect(editor.viewer.lists.length).toBe(1);
    });
});
