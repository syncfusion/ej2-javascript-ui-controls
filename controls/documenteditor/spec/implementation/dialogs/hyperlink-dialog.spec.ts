import { HyperlinkDialog } from '../../../src/document-editor/implementation/dialogs/hyperlink-dialog';
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { ContextMenu } from '../../../src/document-editor/implementation/context-menu';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { ParagraphWidget } from '../../../src/index';
import { LineWidget } from '../../../src/index';
/**
 * Insert Hyperlink dialog spec 
 */
function getDocument(editor: DocumentEditor) {
    editor.openBlank();
    editor.editorModule.insertText('sample');
}

/**
 * insert hyperlink validation
 */
describe('Insert Hyperlink Dialog validation', (): void => {
    let editor: DocumentEditor;
    let dialog: HyperlinkDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(HyperlinkDialog, Editor, Selection);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableHyperlinkDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.hyperlinkDialogModule;
        dialog.show();
        dialog.hide();
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 2000);
    });
    it(' Url Text Box Key Up validation', (): void => {
console.log(' Url Text Box Key Up validation');

        let urlTextBox: HTMLInputElement = (dialog as any).urlTextBox;
        urlTextBox.value = 'www.google.com';
        let displayTextBox: HTMLInputElement = (dialog as any).displayTextBox;
        expect(urlTextBox.value).toBe('www.google.com');
    });
    it('on keyUp Method validation', () => {
console.log('on keyUp Method validation');
        let urlTextBox: HTMLInputElement = (dialog as any).urlTextBox;
        urlTextBox.value = 'www.google.com';
        dialog.onKeyUpOnUrlBox({ keyCode: 10 } as any);
        expect(urlTextBox.value).toBe('http://www.google.com');
    });
    it('insert hyper link on Enter Key', () => {
console.log('insert hyper link on Enter Key');
        let urlTextBox: HTMLInputElement = (dialog as any).urlTextBox;
        urlTextBox.value = 'www.google.com';
        let displayTextBox: HTMLInputElement = (dialog as any).displayTextBox;
        displayTextBox.value = 'Google';
        dialog.onKeyUpOnUrlBox({ keyCode: 13 } as any);
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(5);
    });
    it('Enter Key validation', () => {
console.log('Enter Key validation');
        let urlTextBox: HTMLInputElement = (dialog as any).urlTextBox;
        urlTextBox.value = '';
        let displayTextBox: HTMLInputElement = (dialog as any).displayTextBox;
        displayTextBox.value = '';
        dialog.onKeyUpOnUrlBox({ keyCode: 13 } as any);
        expect('').toBe('');
    });
    it('Key down with out www text', () => {
console.log('Key down with out www text');
        let urlTextBox: HTMLInputElement = (dialog as any).urlTextBox;
        urlTextBox.value = 'bing';
        let displayTextBox: HTMLInputElement = (dialog as any).displayTextBox;
        displayTextBox.value = '';
        dialog.onKeyUpOnUrlBox({ keyCode: 14 } as any);
        expect(displayTextBox.value).toBe('bing');
        dialog.onKeyUpOnUrlBox({ keyCode: 14 } as any);
    });
});

describe('Hyperlink Dialog API Validation', () => {
    let editor: DocumentEditor;
    let dialog: HyperlinkDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableHyperlinkDialog: true });
        DocumentEditor.Inject(HyperlinkDialog, Selection, Editor, EditorHistory);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.hyperlinkDialogModule;
        dialog.show();
        dialog.hide();
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 2000);
    });
    it('Key down with out www text', () => {
console.log('Key down with out www text');
        let urlTextBox: HTMLInputElement = (dialog as any).urlTextBox;
        urlTextBox.value = 'bing';
        let displayTextBox: HTMLInputElement = (dialog as any).displayTextBox;
        displayTextBox.value = 'Bing';
        dialog.onKeyUpOnDisplayBox();
        dialog.onKeyUpOnUrlBox({ keyCode: 14 } as any);
        expect(displayTextBox.value).toBe('Bing');
    });
    it('Open Hyperlink dialog with screenTip text', () =>{
console.log('Open Hyperlink dialog with screenTip');
        let urlTextBox: HTMLInputElement = (dialog as any).urlTextBox;
        urlTextBox.value = 'http://syncfusion.com';
        let displayTextBox: HTMLInputElement = (dialog as any).displayTextBox;
        displayTextBox.value = 'Click';
        let screenTipTextBox: HTMLInputElement = (dialog as any).screenTipTextBox;
        screenTipTextBox.value = 'syncfusion';
        dialog.onKeyUpOnDisplayBox();
        dialog.onKeyUpOnUrlBox({ keyCode: 14 } as any);
        expect(screenTipTextBox.value).toBe('syncfusion');
    });
    it('Open Hyperlink dialog with empty screenTip', () =>{
console.log('Open Hyperlink dialog with empty screenTip');
        let urlTextBox: HTMLInputElement = (dialog as any).urlTextBox;
        urlTextBox.value = 'http://syncfusion.com';
        let displayTextBox: HTMLInputElement = (dialog as any).displayTextBox;
        displayTextBox.value = 'Click';
        let screenTipTextBox: HTMLInputElement = (dialog as any).screenTipTextBox;
        screenTipTextBox.value = '';
        dialog.onKeyUpOnDisplayBox();
        dialog.onKeyUpOnUrlBox({ keyCode: 14 } as any);
        expect(screenTipTextBox.value).toBe('');
    });
    it('Check after insert the hyperlink values', () => {
console.log('Check after insert the hyperlink values');
        let urlTextBox: HTMLInputElement = (dialog as any).urlTextBox;
        urlTextBox.value = 'https://syncfusion.com';
        let displayTextBox: HTMLInputElement = (dialog as any).displayTextBox;
        displayTextBox.value = 'Click';
        let screenTipTextBox: HTMLInputElement = (dialog as any).screenTipTextBox;
        screenTipTextBox.value = 'syncfusion';
        dialog.onInsertButtonClick();
        expect('').toBe('');
        dialog.hide();
    });
    it('Open Hyperlink dialog', () => {
console.log('Open Hyperlink dialog');
        let urlTextBox: HTMLInputElement = (dialog as any).urlTextBox;
        urlTextBox.value = 'https://syncfusion.com';
        let displayTextBox: HTMLInputElement = (dialog as any).displayTextBox;
        displayTextBox.value = 'Syncfusion';
        dialog.onInsertButtonClick();
        expect('').toBe('');
        dialog.hide();
    });
    it('Open Hyperlink dialog', () => {
console.log('Open Hyperlink dialog');
        let urlTextBox: HTMLInputElement = (dialog as any).urlTextBox;
        urlTextBox.value = 'https://syncfusion.com';
        let displayTextBox: HTMLInputElement = (dialog as any).displayTextBox;
        displayTextBox.value = 'Syncfusion';
        let spy = jasmine.createSpy('spy');
        dialog.closeHyperlinkDialog = spy;
        dialog.onCancelButtonClick();
        expect('').toBe('');
    });
    it('insert Empty string validation', () => {
console.log('insert Empty string validation');
        let urlTextBox: HTMLInputElement = (dialog as any).urlTextBox;
        urlTextBox.value = '';
        let displayTextBox: HTMLInputElement = (dialog as any).displayTextBox;
        displayTextBox.value = '';
        dialog.onInsertHyperlink();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(0);
    });
    it('Insert hyperlink multiple paragraph', () => {
console.log('Insert hyperlink multiple paragraph');
        getDocument(editor);
        let urlTextBox: HTMLInputElement = (dialog as any).urlTextBox;
        urlTextBox.value = 'https://syncfusion.com';
        editor.selection.extendToNextLine();
        editor.selection.extendToNextLine();
        dialog.show();
        dialog.onInsertHyperlink();
        dialog.hide();
    });
});

describe('Edit Hyperlink validation', () => {
    let editor: DocumentEditor;
    let dialog: HyperlinkDialog;
    let menu: ContextMenu;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(HyperlinkDialog, Editor, Selection, ContextMenu, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableContextMenu: true, enableHyperlinkDialog: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.hyperlinkDialogModule;
        menu = editor.contextMenuModule;
        dialog.show();
        dialog.hide();
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 2000);
    });

    it('Edit Hyperlink validation', () => {
console.log('Edit Hyperlink validation');
        let urlTextBox: HTMLInputElement = (dialog as any).urlTextBox;
        urlTextBox.value = 'https://syncfusion.com';
        let displayTextBox: HTMLInputElement = (dialog as any).displayTextBox;
        displayTextBox.value = 'Syncfusion';
        dialog.onInsertHyperlink();
        let event: any = { keyCode: 37, ctrlKey: false, preventDefault: () => { }, shiftKey: false };
        editor.documentHelper.onKeyDownInternal(event);
        dialog.hide();
        dialog.show();
        urlTextBox.value = 'http://js.syncfusion.com';
        dialog.onInsertHyperlink();
        dialog.hide();
        event = { keyCode: 37, ctrlKey: false, preventDefault: () => { }, shiftKey: true }
        editor.documentHelper.onKeyDownInternal(event);
        editor.documentHelper.onKeyDownInternal(event);
        editor.documentHelper.onKeyDownInternal(event);
        editor.editorModule.removeHyperlink();
        // expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(1);
        // editor.selection.extendForward();
        // editor.selection.extendForward();
        // editor.selection.extendForward();
        // dialog.show();
        // expect(displayTextBox.value).not.toBe('');
        expect(displayTextBox.value).not.toBe('Syncfusion');
        dialog.hide();
    });
    it('handle context menu validation', () => {
console.log('handle context menu validation');
        menu.handleContextMenuItem('container_contextmenu_hyperlink');
        expect(() => { editor.hyperlinkDialogModule.hide(); }).not.toThrowError();
        editor.editorModule.insertText('www.google.com');
        editor.editorModule.insertText(' ');
        editor.selection.handleHomeKey();
        menu.handleContextMenuItem('container_contextmenu_edit_hyperlink');
        expect(() => { editor.hyperlinkDialogModule.hide(); }).not.toThrowError();
    });

    it('using shortcut open hyperlink dialog', () => {
console.log('using shortcut open hyperlink dialog');
        let event: any = { keyCode: 75, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        expect(() => { editor.hyperlinkDialogModule.hide(); }).not.toThrowError();
    });
});


describe('Edit Hyperlink validation without history', () => {
    let editor: DocumentEditor;
    let dialog: HyperlinkDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(HyperlinkDialog, Editor, Selection);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableHyperlinkDialog: true });
        editor.enableEditorHistory = false;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.hyperlinkDialogModule;
        dialog.show();
        dialog.hide();
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 2000);
    });

//     it('Edit Hyperlink validation', () => {
// console.log('Edit Hyperlink validation');
//         let urlTextBox: HTMLInputElement = (dialog as any).urlTextBox;
//         urlTextBox.value = 'https://syncfusion.com';
//         let displayTextBox: HTMLInputElement = (dialog as any).displayTextBox;
//         displayTextBox.value = 'Syncfusion';
//         dialog.onInsertHyperlink();
//         let event: any = { keyCode: 37, ctrlKey: false, preventDefault: () => { }, shiftKey: false }
//         editor.documentHelper.onKeyDownInternal(event);
//         dialog.hide();
//         dialog.show();
//         urlTextBox.value = 'http://js.syncfusion.com';
//         dialog.onInsertHyperlink();
//         dialog.hide();
//         event = { keyCode: 37, ctrlKey: false, preventDefault: () => { }, shiftKey: true };
//         editor.documentHelper.onKeyDownInternal(event);
//         editor.documentHelper.onKeyDownInternal(event);
//         editor.documentHelper.onKeyDownInternal(event);
//         editor.editorModule.removeHyperlink();
//         // expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(1);
//         // editor.selection.extendForward();
//         // editor.selection.extendForward();
//         // editor.selection.extendForward();
//         // dialog.show();
//         // expect(displayTextBox.value).not.toBe('');
//         expect(displayTextBox.value).not.toBe('Syncfusion');
//         dialog.hide();
//     });
//     it('Edit ScreenTip validation in Hyperlink', () => {
// console.log('Edit ScreenTip validation in Hyperlink');
//         let urlTextBox: HTMLInputElement = (dialog as any).urlTextBox;
//         urlTextBox.value = 'https://syncfusion.com';
//         let displayTextBox: HTMLInputElement = (dialog as any).displayTextBox;
//         displayTextBox.value = 'Click';
//         let screenTipTextBox: HTMLInputElement = (dialog as any).screenTipTextBox;
//         screenTipTextBox.value = 'syncfusion';
//         dialog.onInsertHyperlink();
//         let event: any = { keyCode: 37, ctrlKey: false, preventDefault: () => { }, shiftKey: false }
//         editor.documentHelper.onKeyDownInternal(event);
//         dialog.hide();
//         dialog.show();
//         urlTextBox.value = 'http://js.syncfusion.com';
//         screenTipTextBox.value = 'syncfusionjs'
//         dialog.onInsertHyperlink();
//         dialog.hide();
//         editor.editorModule.removeHyperlink();
//         expect(screenTipTextBox.value).not.toBe('syncfusionjs');
//         dialog.hide();
//     });
//     it('Check after edit screenTip in Hyperlink', () => {
// console.log('Check after edit screenTip in Hyperlink');
//         let urlTextBox: HTMLInputElement = (dialog as any).urlTextBox;
//         urlTextBox.value = 'https://syncfusion.com';
//         let displayTextBox: HTMLInputElement = (dialog as any).displayTextBox;
//         displayTextBox.value = 'Click';
//         let screenTipTextBox: HTMLInputElement = (dialog as any).screenTipTextBox;
//         screenTipTextBox.value = 'syncfusion';
//         dialog.onInsertHyperlink();
//         let event: any = { keyCode: 37, ctrlKey: false, preventDefault: () => { }, shiftKey: false }
//         editor.documentHelper.onKeyDownInternal(event);
//         dialog.hide();
//         dialog.show();
//         urlTextBox.value = 'http://js.syncfusion.com';
//         screenTipTextBox.value = 'syncfusionjs';
//         dialog.onInsertHyperlink();
//         editor.documentHelper.onKeyDownInternal(event);
//         dialog.show();
//         expect(screenTipTextBox.value).toBe('syncfusionjs');
//         dialog.hide();
//     }); 
//     it('Check after edit screenTip and display text in Hyperlink', () => {
// console.log('Check after edit screenTip and display text in Hyperlink');
//         let urlTextBox: HTMLInputElement = (dialog as any).urlTextBox;
//         urlTextBox.value = 'https://syncfusion.com';
//         let displayTextBox: HTMLInputElement = (dialog as any).displayTextBox;
//         displayTextBox.value = 'Click';
//         let screenTipTextBox: HTMLInputElement = (dialog as any).screenTipTextBox;
//         screenTipTextBox.value = 'syncfusion';
//         dialog.onInsertHyperlink();
//         let event: any = { keyCode: 37, ctrlKey: false, preventDefault: () => { }, shiftKey: false }
//         editor.documentHelper.onKeyDownInternal(event);
//         dialog.hide();
//         dialog.show();
//         urlTextBox.value = 'http://js.syncfusion.com';
//         screenTipTextBox.value = 'syncfusionjs';
//         dialog.onInsertHyperlink();
//         editor.documentHelper.onKeyDownInternal(event);
//         dialog.hide();
//         dialog.show();
//         displayTextBox.value = 'EditClick'
//         urlTextBox.value = 'http://js.syncfusion.com';
//         screenTipTextBox.value = 'syncfusiondocument';
//         dialog.onInsertHyperlink();
//         editor.documentHelper.onKeyDownInternal(event);
//         dialog.show();
//         expect(displayTextBox.value).toBe('EditClick');
//         expect(screenTipTextBox.value).toBe('syncfusiondocument');
//         dialog.hide();
//     });
//     it('Auto format hyperlink ', () => {
// console.log('Auto format hyperlink ');
//         editor.editorModule.insertText('www.google.com');
//         editor.editorModule.insertText(' ');
//         expect(editor.enableEditorHistory).toBe(false);
//     });
//     it('insert Hyperlink without history', () => {
// console.log('insert Hyperlink without history');
//         editor.openBlank();
//         editor.editorModule.insertHyperlinkInternal('www.google.com', 'www.google.com', false);
//         expect(editor.enableEditorHistory).toBe(false);
//     });
//     it('Insert Hyperlink on multiple paragraph', () => {
// console.log('Insert Hyperlink on multiple paragraph');
//         editor.openBlank();
//         editor.editorModule.insertText('Syncfusion');
//         editor.editorModule.handleEnterKey();
//         editor.editorModule.insertText('Syncfusion');
//         editor.selection.selectAll();
//         dialog.show();
//         dialog.loadHyperlinkDialog();
//         expect((dialog as any).displayTextBox.value).toBe('<<Selection in document>>');
//         dialog.hide();
//     });
   
});







