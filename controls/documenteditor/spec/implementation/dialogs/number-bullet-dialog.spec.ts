import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer } from '../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { ContextMenu } from '../../../src/document-editor/implementation/context-menu';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { WCharacterFormat } from '../../../src/document-editor/implementation/format/character-format';
import { BulletsAndNumberingDialog } from '../../../src/document-editor/implementation/dialogs/index';
import { WListFormat } from '../../../src/document-editor/implementation/format/list-format';
import { WList } from '../../../src/document-editor/implementation/list/list';
import { WAbstractList } from '../../../src/document-editor/implementation/list/abstract-list';
/**
 * Style dialog spec
 */
function createDocument(editor: DocumentEditor) {
    editor.openBlank();
    editor.editorModule.insertText('Adventure Works cycles');
}

describe('NumberBullet dialog', () => {
    let editor: DocumentEditor;
    let numBulletDialog: BulletsAndNumberingDialog;
    let menu: ContextMenu;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ContextMenu, EditorHistory);
        editor = new DocumentEditor({
            enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableContextMenu: true
        });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        numBulletDialog = new BulletsAndNumberingDialog(editor.documentHelper);
        menu = editor.contextMenuModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        numBulletDialog.destroy();
        numBulletDialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('module name validation', () => {
console.log('module name validation');
        let name: string = numBulletDialog.getModuleName();
        expect(name).toBe('BulletsAndNumberingDialog')
    });
    it('Select bullet style tab', (done) => {
console.log('Select bullet style tab');
        createDocument(editor);
        let event: any;
        numBulletDialog.showNumberBulletDialog(undefined, undefined);
        (numBulletDialog as any).tabObj.select(1);
        setTimeout(function () {
            expect((numBulletDialog as any).bulletListDiv.style.display).not.toBe("none");
            done();
        }, 10);
    });
    it('Select number style tab', (done) => {
console.log('Select number style tab');
        createDocument(editor);
        let event: any;
        numBulletDialog.showNumberBulletDialog(undefined, undefined);
        (numBulletDialog as any).tabObj.select(0);
        setTimeout(function () {
            expect((numBulletDialog as any).numberListDiv.style.display).not.toBe("none");
            done();
        }, 10);
    });
    it('Show & Cancel', () => {
console.log('Show & Cancel');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);

        numBulletDialog.showNumberBulletDialog(undefined, undefined);
        numBulletDialog.onCancelButtonClick();
    });
    it('Show & Close', () => {
console.log('Show & Close');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);

        numBulletDialog.showNumberBulletDialog(undefined, undefined);
        numBulletDialog.closeNumberingBulletDialog();
    });
    it('numbered-none', () => {
console.log('numbered-none');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        numBulletDialog.showNumberBulletDialog(undefined, undefined);
        editor.documentHelper.dialog.element.getElementsByClassName('e-de-list-numbered-none').item(0).dispatchEvent(new Event('click'));
        numBulletDialog.onOkButtonClick();
    });
    it('e-de-list-numbered-number-dot', () => {
console.log('e-de-list-numbered-number-dot');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        numBulletDialog.showNumberBulletDialog(undefined, undefined);
        editor.documentHelper.dialog.element.getElementsByClassName('e-de-list-numbered-number-dot').item(0).dispatchEvent(new Event('click'));
        numBulletDialog.onOkButtonClick();
    });
    it('e-de-list-numbered-number-brace', () => {
console.log('e-de-list-numbered-number-brace');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        numBulletDialog.showNumberBulletDialog(undefined, undefined);
        editor.documentHelper.dialog.element.getElementsByClassName('e-de-list-numbered-number-brace').item(0).dispatchEvent(new Event('click'));
        numBulletDialog.onOkButtonClick();
    });
    it('e-de-list-numbered-up-roman', () => {
console.log('e-de-list-numbered-up-roman');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        numBulletDialog.showNumberBulletDialog(undefined, undefined);
        editor.documentHelper.dialog.element.getElementsByClassName('e-de-list-numbered-up-roman').item(0).dispatchEvent(new Event('click'));
        numBulletDialog.onOkButtonClick();
    });
    it('e-de-list-numbered-up-letter', () => {
console.log('e-de-list-numbered-up-letter');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        numBulletDialog.showNumberBulletDialog(undefined, undefined);
        editor.documentHelper.dialog.element.getElementsByClassName('e-de-list-numbered-up-letter').item(0).dispatchEvent(new Event('click'));
        numBulletDialog.onOkButtonClick();
    });
    it('e-de-list-numbered-low-letter-brace', () => {
console.log('e-de-list-numbered-low-letter-brace');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        numBulletDialog.showNumberBulletDialog(undefined, undefined);
        editor.documentHelper.dialog.element.getElementsByClassName('e-de-list-numbered-low-letter-brace').item(0).dispatchEvent(new Event('click'));
        numBulletDialog.onOkButtonClick();
    });
    it('e-de-numbered-low-letter-dot', () => {
console.log('e-de-numbered-low-letter-dot');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        numBulletDialog.showNumberBulletDialog(undefined, undefined);
        editor.documentHelper.dialog.element.getElementsByClassName('e-de-numbered-low-letter-dot').item(0).dispatchEvent(new Event('click'));
        numBulletDialog.onOkButtonClick();
    });
    it('e-de-list-numbered-low-roman', () => {
console.log('e-de-list-numbered-low-roman');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        numBulletDialog.showNumberBulletDialog(undefined, undefined);
        editor.documentHelper.dialog.element.getElementsByClassName('e-de-list-numbered-low-roman').item(0).dispatchEvent(new Event('click'));
        numBulletDialog.onOkButtonClick();
    });
    it('e-de-icon-bullet-list-none', () => {
console.log('e-de-icon-bullet-list-none');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        numBulletDialog.showNumberBulletDialog(undefined, undefined);
        numBulletDialog.bulletListDiv.getElementsByClassName('e-de-icon-bullet-list-none').item(0).dispatchEvent(new Event('click'));
        numBulletDialog.onOkButtonClick();
    });
    it('e-de-list-bullet-dot', () => {
console.log('e-de-list-bullet-dot');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        numBulletDialog.showNumberBulletDialog(undefined, undefined);
        numBulletDialog.bulletListDiv.getElementsByClassName('e-de-icon-bullet-list-dot').item(0).dispatchEvent(new Event('click'));
        numBulletDialog.onOkButtonClick();
    });
    it('e-de-list-bullet-circle', () => {
console.log('e-de-list-bullet-circle');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        numBulletDialog.showNumberBulletDialog(undefined, undefined);
        numBulletDialog.bulletListDiv.getElementsByClassName('e-de-icon-bullet-list-circle').item(0).dispatchEvent(new Event('click'));
        numBulletDialog.onOkButtonClick();
    });
    it('e-de-list-bullet-square', () => {
console.log('e-de-list-bullet-square');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        numBulletDialog.showNumberBulletDialog(undefined, undefined);
        numBulletDialog.bulletListDiv.getElementsByClassName('e-de-icon-bullet-list-square').item(0).dispatchEvent(new Event('click'));
        numBulletDialog.onOkButtonClick();
    });
    it('e-de-list-bullet-flower', () => {
console.log('e-de-list-bullet-flower');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        numBulletDialog.showNumberBulletDialog(undefined, undefined);
        numBulletDialog.bulletListDiv.getElementsByClassName('e-de-icon-bullet-list-flower').item(0).dispatchEvent(new Event('click'));
        numBulletDialog.onOkButtonClick();
    });
    it('e-de-list-bullet-arrow', () => {
console.log('e-de-list-bullet-arrow');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        numBulletDialog.showNumberBulletDialog(undefined, undefined);
        numBulletDialog.bulletListDiv.getElementsByClassName('e-de-icon-bullet-list-arrow').item(0).dispatchEvent(new Event('click'));
        numBulletDialog.onOkButtonClick();
    });
    it('e-de-icon-bullet-list-tick', () => {
console.log('e-de-icon-bullet-list-tick');
        createDocument(editor);
        let event: any;
        event = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        numBulletDialog.showNumberBulletDialog(undefined, undefined);
        numBulletDialog.bulletListDiv.getElementsByClassName('e-de-icon-bullet-list-tick').item(0).dispatchEvent(new Event('click'));
        numBulletDialog.onOkButtonClick();
    });
});
