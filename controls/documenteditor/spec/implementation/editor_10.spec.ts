import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, TableCellWidget, TextElementBox, TextHelper, RtlInfo, FieldElementBox } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { BorderSettings } from '../../src/document-editor/implementation/editor/editor';
/**
 * Section Break Validation
 */
describe('Rtl text editing validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection);
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
        }, 1000);
    });
    it('arabic text insert', () => {
console.log('arabic text insert');
        editor.editor.insertText('سشةحمث');
        expect(editor.selection.start.currentWidget.children[0].characterFormat.bidi).toBe(true)
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('سشةحمث')
    });
    it('arabic and english text insert', () => {
console.log('arabic and english text insert');
        editor.openBlank();
        editor.editor.insertText('sample');
        editor.editor.insertText('سشةحمث');
        expect(editor.selection.start.currentWidget.children[1].characterFormat.bidi).toBe(true)
        expect((editor.selection.start.currentWidget.children[1] as TextElementBox).text).toBe('سشةحمث')
    });
    it('space after arabic text-consider as single text element box', () => {
console.log('space after arabic text-consider as single text element box');
        editor.openBlank();
        editor.editor.insertText('سشةحمث');
        editor.editor.insertText('    ');
        editor.editor.insertText('سشةحمث');
        expect(editor.selection.start.currentWidget.children[0].characterFormat.bidi).toBe(true)
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('سشةحمث    سشةحمث')
    });
    it('space after normal text followed by arabic text', () => {
console.log('space after normal text followed by arabic text');
        editor.openBlank();
        editor.editor.insertText('سشةحمث');
        editor.editor.insertText('    ');
        editor.editor.insertText('sample');
        expect(editor.selection.start.currentWidget.children[0].characterFormat.bidi).toBe(true)
        expect((editor.selection.start.currentWidget.children[1] as TextElementBox).text).toBe('sample')
    });
});

describe('Rtl text editing validation- combination of hebrew and arabic text', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection);
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
        }, 1000);
    });
    it('Hebrew text after arabic text insert', () => {
console.log('Hebrew text after arabic text insert');
        editor.editor.insertText('سشةحمث');
        editor.editor.insertText('דשצפךק');
        expect(editor.selection.start.currentWidget.children[0].characterFormat.bidi).toBe(true)
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('سشةحمثדשצפךק')
    });
    it('arabic and english text insert', () => {
console.log('arabic and english text insert');
        editor.openBlank();
        editor.editor.insertText('sample');
        editor.editor.insertText('سشةحمث');
        editor.editor.insertText('דשצפךק');
        expect(editor.selection.start.currentWidget.children[1].characterFormat.bidi).toBe(true)
        expect((editor.selection.start.currentWidget.children[1] as TextElementBox).text).toBe('سشةحمثדשצפךק')
    });
    it('space after arabic text-consider as single text element box-2', () => {
console.log('space after arabic text-consider as single text element box-2');
        editor.openBlank();
        editor.editor.insertText('سشةحمث');
        editor.editor.insertText('    ');
        editor.editor.insertText('דשצפךק');
        expect(editor.selection.start.currentWidget.children[0].characterFormat.bidi).toBe(true)
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('سشةحمث')
    });
    it('space after hebrew text followed by arabic text and normal text', () => {
console.log('space after hebrew text followed by arabic text and normal text');
        editor.openBlank();
        editor.editor.insertText('سشةحمث');
        editor.editor.insertText('    ');
        editor.editor.insertText('sample');
        editor.editor.insertText('דשצפךק');
        expect(editor.selection.start.currentWidget.children[0].characterFormat.bidi).toBe(true)
        expect((editor.selection.start.currentWidget.children[2] as TextElementBox).text).toBe('דשצפךק')
    });
});

describe('Text helper getRTLlanguage() method validation', () => {
    let textHelper: TextHelper = undefined;
    beforeAll(() => {
        textHelper = new TextHelper(undefined);
    });
    afterAll(() => {
        textHelper = undefined;
    });
    it('input text is undefined', () => {
console.log('input text is undefined');
        let text: RtlInfo = textHelper.getRtlLanguage(undefined);
        expect(text.isRtl).toBe(false);
        expect(text.id).toBe(0);
    });
    it('input text is empty', () => {
console.log('input text is empty');
        let text: RtlInfo = textHelper.getRtlLanguage('');
        expect(text.isRtl).toBe(false);
        expect(text.id).toBe(0);
    });
    it('input text is normal text', () => {
console.log('input text is normal text');
        let text: RtlInfo = textHelper.getRtlLanguage('Sample');
        expect(text.isRtl).toBe(false);
        expect(text.id).toBe(0);
    });
    it('input text is hebrew', () => {
console.log('input text is hebrew');
        let text: RtlInfo = textHelper.getRtlLanguage('דשצפךק');
        expect(text.isRtl).toBe(true);
        expect(text.id).toBe(1);
    });
    it('input text is arabic', () => {
console.log('input text is arabic');
        let text: RtlInfo = textHelper.getRtlLanguage('سشةحمث');
        expect(text.isRtl).toBe(true);
        expect(text.id).toBe(2);
    });
    it('input text is Syriac', () => {
console.log('input text is Syriac');
        let text: RtlInfo = textHelper.getRtlLanguage('ܨܨܨ');
        expect(text.isRtl).toBe(true);
        expect(text.id).toBe(4);
    });
    it('input text is NKo', () => {
console.log('input text is NKo');
        let text: RtlInfo = textHelper.getRtlLanguage('ߍߍߍ');
        expect(text.isRtl).toBe(true);
        expect(text.id).toBe(7);
    });
    it('input text is tifinagh', () => {
console.log('input text is tifinagh');
        let text: RtlInfo = textHelper.getRtlLanguage('ⵙⵇ,ⵃⵍⴻ');
        expect(text.isRtl).toBe(true);
        expect(text.id).toBe(9);
    });
});


let rtlPara: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "textAlignment": "Right", "styleName": "Normal", "listFormat": {}, "bidi": true }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bidi": true }, "text": "דשצפךק " }, { "characterFormat": { "bidi": false }, "text": "sample " }, { "characterFormat": { "bidi": true }, "text": "דשצפךק" }, { "characterFormat": { "bidi": false }, "text": "?" }] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "footer": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "evenHeader": {}, "evenFooter": {}, "firstPageHeader": {}, "firstPageFooter": {} } }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "defaultTabWidth": 36, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "NoProtection", "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [], "comments": [] };

describe('Field insert with rtl para', () => {
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
        editor.open(JSON.stringify(rtlPara));
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
    it('Insert Field at begin of RTL paragraph', () => {
console.log('Insert Field at begin of RTL paragraph');
        let text = 'Lead#Email';

        editor.editor.insertField('MERGEFIELD ' + text + ' \\* MERGEFORMAT');
        expect(editor.selection.start.currentWidget.children[8] instanceof FieldElementBox).toBe(false);
    });
    it('Insert field at middle of RTL paragraph', () => {
console.log('Insert field at middle of RTL paragraph');
        editor.selection.handleControlRightKey();
        editor.selection.handleControlRightKey();
        editor.selection.handleControlRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        let text = 'Lead#Email';

        editor.editor.insertField('MERGEFIELD ' + text + ' \\* MERGEFORMAT');
        expect(editor.selection.start.currentWidget.children[10] instanceof FieldElementBox).toBe(false);
    });
    it('Insert field at last of RTL paragraph', () => {
console.log('Insert field at last of RTL paragraph');
        editor.selection.handleControlRightKey();
        editor.selection.handleControlRightKey();
        editor.selection.handleControlRightKey();
        editor.selection.handleControlRightKey();
        editor.selection.handleControlRightKey();
        let text = 'Lead#Email';

        editor.editor.insertField('MERGEFIELD ' + text + ' \\* MERGEFORMAT');
        expect(editor.selection.start.currentWidget.children[0] instanceof FieldElementBox).toBe(true);
    });

});
