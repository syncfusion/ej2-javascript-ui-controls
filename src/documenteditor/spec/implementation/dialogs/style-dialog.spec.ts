import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer, SfdtExport } from '../../../src/index';
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
import { StylesDialog } from '../../../src/document-editor/implementation/dialogs/styles-dialog';
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
        // expect(((styleDialog as any).styleParagraph as HTMLInputElement).value).toBe('style 1');
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

//     it('Create New ParagraphStyle', () => {
// console.log('Create New ParagraphStyle');
//         createDocument(editor);
//         let event: any;
//         event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
//         editor.documentHelper.onKeyDownInternal(event);
//         styleDialog.show();
//         (styleDialog as any).styleNameElement.value = 'style 1';
//         styleDialog.updateOkButton();

//         let eve: Event = new Event('blur');
//         ((styleDialog as any).styleNameElement as HTMLInputElement).dispatchEvent(eve);

//         styleDialog.onOkButtonClick();
//         let style: any = editor.documentHelper.styles.findByName('style 1');
//         expect(style.name).toBe('style 1');
//         expect(style.basedOn.name).toBe('Normal');
//         expect(style.next.name).toBe('style 1');
//         expect(style.type).toBe('Paragraph');
//     });
//     it('Create New LinkedStyle', () => {
// console.log('Create New LinkedStyle');
//         createDocument(editor);
//         let event: any;
//         event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
//         editor.documentHelper.onKeyDownInternal(event);
//         styleDialog.show();
//         (styleDialog as any).styleNameElement.value = 'style 1';
//         styleDialog.updateOkButton();

//         let downEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
//         (styleDialog as any).styleType.keyActionHandler(downEventArgs);
//         (styleDialog as any).styleType.keyActionHandler(downEventArgs);

//         let eve: Event = new Event('blur');
//         ((styleDialog as any).styleNameElement as HTMLInputElement).dispatchEvent(eve);

//         styleDialog.onOkButtonClick();
//         let style: any = editor.documentHelper.styles.findByName('style 1');
//         expect(style.name).toBe('style 1');
//         // expect(style.basedOn.name).toBe('Normal');
//         expect(style.link.name).toBe('style 1 Char');
//         expect(style.next.name).toBe('style 1');
//         expect(style.type).toBe('Paragraph');

//         style = editor.documentHelper.styles.findByName('style 1 Char');
//         expect(style.name).toBe('style 1 Char');
//     });
});
describe('Style dialog validation create - Next Different', () => {
    let editor: DocumentEditor;
    let styleDialog: StyleDialog;
    let stylesDialog:StylesDialog;
    let fontDialog: FontDialog;
    let paragraphDialog: ParagraphDialog;
    let numBulletDialog: BulletsAndNumberingDialog;
    let menu: ContextMenu;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, StyleDialog, FontDialog, ParagraphDialog, ContextMenu, EditorHistory,StylesDialog);
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
        stylesDialog = editor.stylesDialogModule;
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
//     it('Create New ParagraphStyle-Change Next Paragraph', () => {
// console.log('Create New ParagraphStyle-Change Next Paragraph');
//         createDocument(editor);
//         let event: any;
//         event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
//         editor.documentHelper.onKeyDownInternal(event);
//         stylesDialog.addNewStyles();
//         // styleDialog.show();
//         (styleDialog as any).styleNameElement.value = 'style 2';
//         styleDialog.updateOkButton();

//         let eve: Event = new Event('blur');
//         ((styleDialog as any).styleNameElement as HTMLInputElement).dispatchEvent(eve);

//         //Change to Character type
//         let upEventArgs: any = { preventDefault: (): void => { }, action: 'up' };
//         (styleDialog as any).styleParagraph.keyActionHandler(upEventArgs);

//         styleDialog.onOkButtonClick();
//         let style: any = editor.documentHelper.styles.findByName('style 2');
//         expect(style.name).toBe('style 2');
//         expect(style.basedOn.name).toBe('Normal');
//         expect(style.next.name).toBe('Footer');
//         expect(style.type).toBe('Paragraph');
//     });
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

//     it('Create New ParagraphStyle', () => {
// console.log('Create New ParagraphStyle');
//         createDocument(editor);
//         let event: any;
//         event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
//         editor.documentHelper.onKeyDownInternal(event);
//         styleDialog.show();
//         (styleDialog as any).styleNameElement.value = 'style 1';
//         styleDialog.updateOkButton();

//         let eve: Event = new Event('blur');
//         ((styleDialog as any).styleNameElement as HTMLInputElement).dispatchEvent(eve);

//         styleDialog.onOkButtonClick();
//         let style: any = editor.documentHelper.styles.findByName('style 1');
//         expect(style.name).toBe('style 1');
//         expect(style.basedOn.name).toBe('Normal');
//         expect(style.next.name).toBe('style 1');
//         expect(style.type).toBe('Paragraph');
//     });
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
        DocumentEditor.Inject(Editor, Selection, StyleDialog, FontDialog, ParagraphDialog, ContextMenu, EditorHistory, StylesDialog, SfdtExport);
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
    it('Apply Outline level to the paragraph', () => {
        console.log('Apply Outline level to the paragraph');
        editor.openBlank();
        editor.editor.insertText('Hello World');
        expect(editor.selection.paragraphFormat.outlineLevel).toBe('BodyText');
        });
});
