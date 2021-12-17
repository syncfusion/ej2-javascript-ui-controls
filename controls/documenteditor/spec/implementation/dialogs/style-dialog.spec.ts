import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer } from '../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { StyleDialog } from '../../../src/document-editor/implementation/dialogs/style-dialog';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { ContextMenu } from '../../../src/document-editor/implementation/context-menu';

import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { WCharacterFormat } from '../../../src/document-editor/implementation/format/character-format';
import { FontDialog } from '../../../src/document-editor/implementation/dialogs/font-dialog';
import { ParagraphDialog } from '../../../src/document-editor/implementation/dialogs/paragraph-dialog';
import { BulletsAndNumberingDialog } from '../../../src/document-editor/implementation/dialogs/index';
/**
 * Style dialog spec
 */
function createDocument(editor: DocumentEditor) {
    editor.openBlank();
    editor.editorModule.insertText('Adventure Works cycles');
}

describe('Style dialog validation', () => {
    let editor: DocumentEditor;
    let styleDialog: StyleDialog;
    let fontDialog: FontDialog;
    let paragraphDialog: ParagraphDialog;
    let numBulletDialog: BulletsAndNumberingDialog;
    let menu: ContextMenu;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, StyleDialog, FontDialog, ParagraphDialog, ContextMenu, EditorHistory);
        editor = new DocumentEditor({
            enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableContextMenu: true, enableStyleDialog: true,
            enableFontDialog: true, enableParagraphDialog: true
        });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        styleDialog = editor.styleDialogModule;
        fontDialog = editor.fontDialogModule;
        paragraphDialog = editor.paragraphDialogModule;
        menu = editor.contextMenuModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        styleDialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('module name validation', () => {
console.log('module name validation');
        let name: string = styleDialog.getModuleName();
        expect(name).toBe('StyleDialog')
    });
    it('Show Dialog Diable Ok', () => {
console.log('Show Dialog Diable Ok');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        styleDialog.show();
        expect((styleDialog as any).okButton.disabled).toBe(true);
        (styleDialog as any).styleNameElement.value = 'style 1';
        let blurEvent: Event = new Event('blur');
        ((styleDialog as any).styleNameElement as HTMLInputElement).dispatchEvent(blurEvent);
        ((styleDialog as any).styleNameElement as HTMLInputElement).dispatchEvent(new Event('keyup'));
        expect(((styleDialog as any).styleParagraph as HTMLInputElement).value).toBe('style 1');
        expect((styleDialog as any).okButton.disabled).toBe(false);

        (styleDialog as any).styleNameElement.value = null;
        ((styleDialog as any).styleNameElement as HTMLInputElement).dispatchEvent(new Event('keyup'));
        expect((styleDialog as any).okButton.disabled).toBe(true);

        styleDialog.closeStyleDialog();
    });
    it('Show Font dialog', () => {
console.log('Show Font dialog');
        createDocument(editor);
        styleDialog.show();
        styleDialog.showFontDialog();
        fontDialog.closeFontDialog();
        styleDialog.closeStyleDialog();
    });
    it('Show Paragrph dialog', () => {
console.log('Show Paragrph dialog');
        createDocument(editor);
        styleDialog.show();
        styleDialog.showParagraphDialog();
        paragraphDialog.closeParagraphDialog();
        styleDialog.closeStyleDialog();
    });
    it('Show NumberingBullet dialog', () => {
console.log('Show NumberingBullet dialog');
        createDocument(editor);
        styleDialog.show();
        styleDialog.showNumberingBulletDialog();
        (styleDialog as any).numberingBulletDialog.closeNumberingBulletDialog();
        styleDialog.closeStyleDialog();
    });
    it('Click Cancel', () => {
console.log('Click Cancel');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        styleDialog.show();
        styleDialog.onCancelButtonClick();
    });
    it('StyleType change', () => {
console.log('StyleType change');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        styleDialog.show();

        //Change to Character type
        let downEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
        (styleDialog as any).styleType.keyActionHandler(downEventArgs);
        //Next para disable
        expect((styleDialog as any).styleParagraph.enabled).toBe(false);

        //Change to Linked(Paragraph and Character) type
        (styleDialog as any).styleType.keyActionHandler(downEventArgs);
        //Next para disable
        expect((styleDialog as any).styleParagraph.enabled).toBe(true);

        //Change to Character
        let upEventArgs: any = { preventDefault: (): void => { }, action: 'up' };
        (styleDialog as any).styleType.keyActionHandler(upEventArgs);
        //Next para disable
        expect((styleDialog as any).styleParagraph.enabled).toBe(false);

        //Change to Paragraph
        (styleDialog as any).styleType.keyActionHandler(upEventArgs);
        //Next para disable
        expect((styleDialog as any).styleParagraph.enabled).toBe(true);

        styleDialog.closeStyleDialog();
    });

});
describe('getStyles API', () => {
    let editor: DocumentEditor;
    let styleDialog: StyleDialog;
    let fontDialog: FontDialog;
    let paragraphDialog: ParagraphDialog;
    let numBulletDialog: BulletsAndNumberingDialog;
    let menu: ContextMenu;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, StyleDialog, FontDialog, ParagraphDialog, ContextMenu, EditorHistory);
        editor = new DocumentEditor({
            enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableContextMenu: true, enableStyleDialog: true,
            enableFontDialog: true, enableParagraphDialog: true
        });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        styleDialog = editor.styleDialogModule;
        fontDialog = editor.fontDialogModule;
        paragraphDialog = editor.paragraphDialogModule;
        menu = editor.contextMenuModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        styleDialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });

    it('GetStyles Validation', () => {
        console.log('GetStyles Validation');
                createDocument(editor);
                let styles: any[] = editor.getStyles('Paragraph');
        
                expect(styles[0].name).toBe('Normal');
                expect(styles[0].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[1].name).toBe('Heading 1');
                expect(styles[1].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":16,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#2F5496","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[2].name).toBe('Heading 2');
                expect(styles[2].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":13,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#2F5496","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[3].name).toBe('Heading 3');
                expect(styles[3].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":12,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#1F3763","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[4].name).toBe('Heading 4');
                expect(styles[4].style).toBe('{"characterFormat":{"bold":false,"italic":true,"fontSize":11,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#2F5496","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[5].name).toBe('Heading 5');
                expect(styles[5].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#2F5496","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[6].name).toBe('Heading 6');
                expect(styles[6].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#1F3763","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
        
                styles = editor.getStyles('Character');
        
                expect(styles[0].name).toBe('Heading 1 Char');
                expect(styles[0].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":16,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#2F5496","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[1].name).toBe('Default Paragraph Font');
                expect(styles[1].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[2].name).toBe('Heading 2 Char');
                expect(styles[2].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":13,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#2F5496","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[3].name).toBe('Heading 3 Char');
                expect(styles[3].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":12,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#1F3763","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[4].name).toBe('Heading 4 Char');
                expect(styles[4].style).toBe('{"characterFormat":{"bold":false,"italic":true,"fontSize":11,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#2F5496","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[5].name).toBe('Heading 5 Char');
                expect(styles[5].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#2F5496","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[6].name).toBe('Heading 6 Char');
                expect(styles[6].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#1F3763","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
            });
            it('GetStyles Validation-Opened Document', () => {
        console.log('GetStyles Validation-Opened Document');
                createDocument(editor);
                editor.open('{"sections":[{"blocks":[{"paragraphFormat":{"styleName":"Bold"},"inlines":[{"text":"Bold"}]},{"paragraphFormat":{"styleName":"Italic"},"inlines":[{"text":"Italic"}]},{"paragraphFormat":{"styleName":"Style1"},"inlines":[{"text":"Underline"}]},{"paragraphFormat":{"styleName":"Strike"},"inlines":[{"text":"Strike"},{"name":"_GoBack","bookmarkType":0},{"name":"_GoBack","bookmarkType":1}]},{"paragraphFormat":{"styleName":"fontfamily"},"inlines":[{"text":"Font-family"}]},{"paragraphFormat":{"styleName":"fontsize"},"inlines":[{"text":"Fontsize"}]},{"paragraphFormat":{"styleName":"FontColor"},"inlines":[{"text":"Font color"}]},{"paragraphFormat":{"styleName":"Style2"},"inlines":[{"text":"superscript"}]},{"paragraphFormat":{"styleName":"Style3"},"inlines":[{"text":"subscript"}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Character","name":"Default Paragraph Font"},{"type":"Paragraph","name":"BoldStyle","basedOn":"Normal","link":"BoldStyle Char","paragraphFormat":{"lineSpacing":1.0,"lineSpacingType":"Multiple"}},{"type":"Paragraph","name":"Bold","basedOn":"Normal","next":"Normal","link":"Bold Char","characterFormat":{"bold":true}},{"type":"Character","name":"BoldStyle Char","basedOn":"Default Paragraph Font"},{"type":"Paragraph","name":"Italic","basedOn":"Bold","next":"Normal","link":"Italic Char","characterFormat":{"italic":true}},{"type":"Character","name":"Bold Char","basedOn":"Default Paragraph Font","characterFormat":{"bold":true}},{"type":"Paragraph","name":"Style1","basedOn":"Italic","next":"Normal","link":"Style1 Char","characterFormat":{"underline":"Single"}},{"type":"Character","name":"Italic Char","basedOn":"Bold Char","characterFormat":{"bold":true,"italic":true}},{"type":"Paragraph","name":"fontfamily","basedOn":"Style1","next":"Normal","link":"fontfamily Char","characterFormat":{"fontFamily":"Algerian"}},{"type":"Character","name":"Style1 Char","basedOn":"Italic Char","characterFormat":{"bold":true,"italic":true,"underline":"Single"}},{"type":"Paragraph","name":"fontsize","basedOn":"fontfamily","next":"Normal","link":"fontsize Char","characterFormat":{"fontSize":24.0}},{"type":"Character","name":"fontfamily Char","basedOn":"Style1 Char","characterFormat":{"bold":true,"italic":true,"underline":"Single","fontFamily":"Algerian"}},{"type":"Paragraph","name":"FontColor","basedOn":"fontsize","next":"Normal","link":"FontColor Char","characterFormat":{"fontColor":"#FF0000FF"}},{"type":"Character","name":"fontsize Char","basedOn":"fontfamily Char","characterFormat":{"bold":true,"italic":true,"underline":"Single","fontSize":24.0,"fontFamily":"Algerian"}},{"type":"Paragraph","name":"Style2","basedOn":"FontColor","next":"Normal","link":"Style2 Char","characterFormat":{"baselineAlignment":"Superscript"}},{"type":"Character","name":"FontColor Char","basedOn":"fontsize Char","characterFormat":{"bold":true,"italic":true,"underline":"Single","fontSize":24.0,"fontFamily":"Algerian","fontColor":"#FF0000FF"}},{"type":"Paragraph","name":"Style3","basedOn":"Style2","next":"Normal","link":"Style3 Char","characterFormat":{"baselineAlignment":"Subscript"}},{"type":"Character","name":"Style2 Char","basedOn":"FontColor Char","characterFormat":{"bold":true,"italic":true,"underline":"Single","baselineAlignment":"Superscript","fontSize":24.0,"fontFamily":"Algerian","fontColor":"#FF0000FF"}},{"type":"Character","name":"Style3 Char","basedOn":"Style2 Char","characterFormat":{"bold":true,"italic":true,"underline":"Single","baselineAlignment":"Subscript","fontSize":24.0,"fontFamily":"Algerian","fontColor":"#FF0000FF"}},{"type":"Paragraph","name":"Strike","basedOn":"Style1","next":"Normal","link":"Strike Char","characterFormat":{"strikethrough":"SingleStrike"}},{"type":"Character","name":"Strike Char","basedOn":"Style1 Char","characterFormat":{"bold":true,"italic":true,"underline":"Single","strikethrough":"SingleStrike"}}]}');
        
                let styles: any[] = editor.getStyles('Paragraph');
                expect(styles[0].name).toBe('Normal');
                expect(styles[0].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[1].name).toBe('BoldStyle');
                expect(styles[1].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[2].name).toBe('Bold');
                expect(styles[2].style).toBe('{"characterFormat":{"bold":true,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[3].name).toBe('Italic');
                expect(styles[3].style).toBe('{"characterFormat":{"bold":true,"italic":true,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[4].name).toBe('Style1');
                expect(styles[4].style).toBe('{"characterFormat":{"bold":true,"italic":true,"fontSize":11,"fontFamily":"Calibri","underline":"Single","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[5].name).toBe('fontfamily');
                expect(styles[5].style).toBe('{"characterFormat":{"bold":true,"italic":true,"fontSize":11,"fontFamily":"Algerian","underline":"Single","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[6].name).toBe('fontsize');
                expect(styles[6].style).toBe('{"characterFormat":{"bold":true,"italic":true,"fontSize":24,"fontFamily":"Algerian","underline":"Single","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[7].name).toBe('FontColor');
                expect(styles[7].style).toBe('{"characterFormat":{"bold":true,"italic":true,"fontSize":24,"fontFamily":"Algerian","underline":"Single","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#FF0000FF","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[8].name).toBe('Style2');
                expect(styles[8].style).toBe('{"characterFormat":{"bold":true,"italic":true,"fontSize":24,"fontFamily":"Algerian","underline":"Single","strikethrough":"None","baselineAlignment":"Superscript","highlightColor":"NoColor","fontColor":"#FF0000FF","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[9].name).toBe('Style3');
                expect(styles[9].style).toBe('{"characterFormat":{"bold":true,"italic":true,"fontSize":24,"fontFamily":"Algerian","underline":"Single","strikethrough":"None","baselineAlignment":"Subscript","highlightColor":"NoColor","fontColor":"#FF0000FF","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[10].name).toBe('Strike');
                expect(styles[10].style).toBe('{"characterFormat":{"bold":true,"italic":true,"fontSize":11,"fontFamily":"Calibri","underline":"Single","strikethrough":"SingleStrike","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[11].name).toBe('Heading 1');
                expect(styles[11].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":16,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#2F5496","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[12].name).toBe('Heading 2');
                expect(styles[12].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":13,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#2F5496","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[13].name).toBe('Heading 3');
                expect(styles[13].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":12,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#1F3763","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[14].name).toBe('Heading 4');
                expect(styles[14].style).toBe('{"characterFormat":{"bold":false,"italic":true,"fontSize":11,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#2F5496","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[15].name).toBe('Heading 5');
                expect(styles[15].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#2F5496","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[16].name).toBe('Heading 6');
                expect(styles[16].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#1F3763","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                styles = editor.getStyles('Character');
        
                expect(styles[0].name).toBe('Default Paragraph Font');
                expect(styles[0].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[1].name).toBe('BoldStyle Char');
                expect(styles[1].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[2].name).toBe('Bold Char');
                expect(styles[2].style).toBe('{"characterFormat":{"bold":true,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[3].name).toBe('Italic Char');
                expect(styles[3].style).toBe('{"characterFormat":{"bold":true,"italic":true,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[4].name).toBe('Style1 Char');
                expect(styles[4].style).toBe('{"characterFormat":{"bold":true,"italic":true,"fontSize":11,"fontFamily":"Calibri","underline":"Single","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[5].name).toBe('fontfamily Char');
                expect(styles[5].style).toBe('{"characterFormat":{"bold":true,"italic":true,"fontSize":11,"fontFamily":"Algerian","underline":"Single","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[6].name).toBe('fontsize Char');
                expect(styles[6].style).toBe('{"characterFormat":{"bold":true,"italic":true,"fontSize":24,"fontFamily":"Algerian","underline":"Single","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[7].name).toBe('FontColor Char');
                expect(styles[7].style).toBe('{"characterFormat":{"bold":true,"italic":true,"fontSize":24,"fontFamily":"Algerian","underline":"Single","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#FF0000FF","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[8].name).toBe('Style2 Char');
                expect(styles[8].style).toBe('{"characterFormat":{"bold":true,"italic":true,"fontSize":24,"fontFamily":"Algerian","underline":"Single","strikethrough":"None","baselineAlignment":"Superscript","highlightColor":"NoColor","fontColor":"#FF0000FF","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[9].name).toBe('Style3 Char');
                expect(styles[9].style).toBe('{"characterFormat":{"bold":true,"italic":true,"fontSize":24,"fontFamily":"Algerian","underline":"Single","strikethrough":"None","baselineAlignment":"Subscript","highlightColor":"NoColor","fontColor":"#FF0000FF","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[10].name).toBe('Strike Char');
                expect(styles[10].style).toBe('{"characterFormat":{"bold":true,"italic":true,"fontSize":11,"fontFamily":"Calibri","underline":"Single","strikethrough":"SingleStrike","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[11].name).toBe('Heading 1 Char');
                expect(styles[11].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":16,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#2F5496","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[12].name).toBe('Heading 2 Char');
                expect(styles[12].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":13,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#2F5496","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[13].name).toBe('Heading 3 Char');
                expect(styles[13].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":12,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#1F3763","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[14].name).toBe('Heading 4 Char');
                expect(styles[14].style).toBe('{"characterFormat":{"bold":false,"italic":true,"fontSize":11,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#2F5496","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[15].name).toBe('Heading 5 Char');
                expect(styles[15].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#2F5496","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
                expect(styles[16].name).toBe('Heading 6 Char');
                expect(styles[16].style).toBe('{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri Light","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#1F3763","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false}}');
        
            });
});
describe('Style dialog validation create', () => {
    let editor: DocumentEditor;
    let styleDialog: StyleDialog;
    let fontDialog: FontDialog;
    let paragraphDialog: ParagraphDialog;
    let numBulletDialog: BulletsAndNumberingDialog;
    let menu: ContextMenu;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, StyleDialog, FontDialog, ParagraphDialog, ContextMenu, EditorHistory);
        editor = new DocumentEditor({
            enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableContextMenu: true, enableStyleDialog: true,
            enableFontDialog: true, enableParagraphDialog: true
        });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        styleDialog = editor.styleDialogModule;
        fontDialog = editor.fontDialogModule;
        paragraphDialog = editor.paragraphDialogModule;
        menu = editor.contextMenuModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        styleDialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });

    it('Create New ParagraphStyle', () => {
console.log('Create New ParagraphStyle');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        styleDialog.show();
        (styleDialog as any).styleNameElement.value = 'style 1';
        styleDialog.updateOkButton();

        let eve: Event = new Event('blur');
        ((styleDialog as any).styleNameElement as HTMLInputElement).dispatchEvent(eve);

        styleDialog.onOkButtonClick();
        let style: any = editor.documentHelper.styles.findByName('style 1');
        expect(style.name).toBe('style 1');
        expect(style.basedOn.name).toBe('Normal');
        expect(style.next.name).toBe('style 1');
        expect(style.type).toBe('Paragraph');
    });
    it('Create New LinkedStyle', () => {
console.log('Create New LinkedStyle');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        styleDialog.show();
        (styleDialog as any).styleNameElement.value = 'style 1';
        styleDialog.updateOkButton();

        let downEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
        (styleDialog as any).styleType.keyActionHandler(downEventArgs);
        (styleDialog as any).styleType.keyActionHandler(downEventArgs);

        let eve: Event = new Event('blur');
        ((styleDialog as any).styleNameElement as HTMLInputElement).dispatchEvent(eve);

        styleDialog.onOkButtonClick();
        let style: any = editor.documentHelper.styles.findByName('style 1');
        expect(style.name).toBe('style 1');
        // expect(style.basedOn.name).toBe('Normal');
        expect(style.link.name).toBe('style 1 Char');
        expect(style.next.name).toBe('style 1');
        expect(style.type).toBe('Paragraph');

        style = editor.documentHelper.styles.findByName('style 1 Char');
        expect(style.name).toBe('style 1 Char');
    });
});
describe('Style dialog validation create - Next Different', () => {
    let editor: DocumentEditor;
    let styleDialog: StyleDialog;
    let fontDialog: FontDialog;
    let paragraphDialog: ParagraphDialog;
    let numBulletDialog: BulletsAndNumberingDialog;
    let menu: ContextMenu;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, StyleDialog, FontDialog, ParagraphDialog, ContextMenu, EditorHistory);
        editor = new DocumentEditor({
            enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableContextMenu: true, enableStyleDialog: true,
            enableFontDialog: true, enableParagraphDialog: true
        });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        styleDialog = editor.styleDialogModule;
        fontDialog = editor.fontDialogModule;
        paragraphDialog = editor.paragraphDialogModule;
        menu = editor.contextMenuModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        styleDialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Create New ParagraphStyle-Change Next Paragraph', () => {
console.log('Create New ParagraphStyle-Change Next Paragraph');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        styleDialog.show();
        (styleDialog as any).styleNameElement.value = 'style 2';
        styleDialog.updateOkButton();

        let eve: Event = new Event('blur');
        ((styleDialog as any).styleNameElement as HTMLInputElement).dispatchEvent(eve);

        //Change to Character type
        let upEventArgs: any = { preventDefault: (): void => { }, action: 'up' };
        (styleDialog as any).styleParagraph.keyActionHandler(upEventArgs);

        styleDialog.onOkButtonClick();
        let style: any = editor.documentHelper.styles.findByName('style 2');
        expect(style.name).toBe('style 2');
        expect(style.basedOn.name).toBe('Normal');
        expect(style.next.name).toBe('Heading 6');
        expect(style.type).toBe('Paragraph');
    });
});
describe('Style dialog validation create', () => {
    let editor: DocumentEditor;
    let styleDialog: StyleDialog;
    let fontDialog: FontDialog;
    let paragraphDialog: ParagraphDialog;
    let numBulletDialog: BulletsAndNumberingDialog;
    let menu: ContextMenu;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, StyleDialog, FontDialog, ParagraphDialog, ContextMenu, EditorHistory);
        editor = new DocumentEditor({
            enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableContextMenu: true, enableStyleDialog: true,
            enableFontDialog: true, enableParagraphDialog: true
        });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        styleDialog = editor.styleDialogModule;
        fontDialog = editor.fontDialogModule;
        paragraphDialog = editor.paragraphDialogModule;
        menu = editor.contextMenuModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        styleDialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });

    it('Create New ParagraphStyle', () => {
console.log('Create New ParagraphStyle');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        styleDialog.show();
        (styleDialog as any).styleNameElement.value = 'style 1';
        styleDialog.updateOkButton();

        let eve: Event = new Event('blur');
        ((styleDialog as any).styleNameElement as HTMLInputElement).dispatchEvent(eve);

        styleDialog.onOkButtonClick();
        let style: any = editor.documentHelper.styles.findByName('style 1');
        expect(style.name).toBe('style 1');
        expect(style.basedOn.name).toBe('Normal');
        expect(style.next.name).toBe('style 1');
        expect(style.type).toBe('Paragraph');
    });
});
describe('Style dialog - Editing', () => {
    let editor: DocumentEditor;
    let styleDialog: StyleDialog;
    let fontDialog: FontDialog;
    let paragraphDialog: ParagraphDialog;
    let numBulletDialog: BulletsAndNumberingDialog;
    let menu: ContextMenu;
    let jsonString: string = '{"sections":[{"blocks":[{"paragraphFormat":{"styleName":"Style1"},"inlines":[{"text":"Testing"}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Character","name":"Default Paragraph Font"},{"type":"Paragraph","name":"Style1","basedOn":"Normal","next":"Normal","link":"Style1 Char","characterFormat":{"fontFamily":"Algerian"}},{"type":"Character","name":"Style1 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontFamily":"Algerian"}}]}';
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, StyleDialog, FontDialog, ParagraphDialog, ContextMenu, EditorHistory);
        editor = new DocumentEditor({
            enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableContextMenu: true, enableStyleDialog: true,
            enableFontDialog: true, enableParagraphDialog: true
        });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        styleDialog = editor.styleDialogModule;
        fontDialog = editor.fontDialogModule;
        paragraphDialog = editor.paragraphDialogModule;
        menu = editor.contextMenuModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        jsonString = undefined;
        styleDialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Edit', () => {
console.log('Edit');
        editor.open(jsonString);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        styleDialog.show('Style1');
        // (styleDialog as any).styleNameElement.value = 'style 2';
        styleDialog.updateOkButton();

        let eve: Event = new Event('blur');
        ((styleDialog as any).styleNameElement as HTMLInputElement).dispatchEvent(eve);

        //Change to Character type
        let upEventArgs: any = { preventDefault: (): void => { }, action: 'up' };
        (styleDialog as any).styleParagraph.keyActionHandler(upEventArgs);

        styleDialog.onOkButtonClick();
        let style: any = editor.documentHelper.styles.findByName('Style1');
        expect(style.name).toBe('Style1');
        expect(style.basedOn.name).toBe('Normal');
        expect(style.next.name).toBe('Normal');
        expect(style.type).toBe('Paragraph');
    });
});

describe('Modify Styles for Heading 1 validation', () => {
    let editor: DocumentEditor;
    let styleDialog: StyleDialog;
    let fontDialog: FontDialog;
    let paragraphDialog: ParagraphDialog;
    let numBulletDialog: BulletsAndNumberingDialog;
    let menu: ContextMenu;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, StyleDialog, FontDialog, ParagraphDialog, ContextMenu, EditorHistory);
        editor = new DocumentEditor({
            enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableContextMenu: true, enableStyleDialog: true,
            enableFontDialog: true, enableParagraphDialog: true
        });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        styleDialog = editor.styleDialogModule;
        fontDialog = editor.fontDialogModule;
        paragraphDialog = editor.paragraphDialogModule;
        menu = editor.contextMenuModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        styleDialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Modify heading 1 style validation', () => {
console.log('Modify heading 1 style validation');
        editor.editor.insertText('Heading 1');
        editor.editor.applyStyle('Heading 1');
        editor.styleDialogModule.show('Heading 1');
        editor.styleDialogModule.onOkButtonClick();
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Left');
    });
    it('Open Paragraph dialog validation', () => {
console.log('Open Paragraph dialog validation');
        editor.openBlank();
        editor.editor.insertText('Heading 1');
        editor.editor.applyStyle('Heading 1');
        editor.styleDialogModule.show('Heading 1');
        styleDialog.showParagraphDialog();
        paragraphDialog.closeParagraphDialog();
        styleDialog.closeStyleDialog();
    });
});
