import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer, DocumentHelper } from '../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { FontDialog } from '../../../src/document-editor/implementation/dialogs/font-dialog';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { ContextMenu } from '../../../src/document-editor/implementation/context-menu';

import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { WCharacterFormat } from '../../../src/document-editor/implementation/format/character-format';
/**
 * Font dialog spec
 */
function createDocument(editor: DocumentEditor) {
    editor.openBlank();
    editor.editorModule.insertText('Adventure Works cycles');
}
describe('Font dialog validation bold,italic,underLine', () => {
    let editor: DocumentEditor;
    let dialog: FontDialog;
    let menu: ContextMenu;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, FontDialog, ContextMenu, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableContextMenu: true, enableFontDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.fontDialogModule;
        menu = editor.contextMenuModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Dialog with bold and italic property apply testing', () => {
console.log('Dialog with bold and italic property apply testing');
        createDocument(editor)
        let event: any;
        event = { keyCode: 35, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        dialog.showFontDialog();
        dialog.fontStyle = 'BoldItalic';
        dialog.onInsertFontFormat();
        expect(editor.selection.characterFormat.bold).toBe(true);
        expect(editor.selection.characterFormat.italic).toBe(true);
    });
    it('Underline value changed and apply testing', () => {
console.log('Underline value changed and apply testing');
        createDocument(editor)
        let event: any;
        event = { keyCode: 35, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 66, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        expect(editor.selection.characterFormat.bold).toBe(true);
        event = { keyCode: 73, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        dialog.showFontDialog();
        dialog.loadFontDialog();
        dialog.fontStyle = "Regular";
        event = { preventDefault: function () { }, value: 'Single' };
        (dialog as any).underlineUpdate(event);
        dialog.onInsertFontFormat();
        expect(editor.selection.characterFormat.underline).toBe('Single');
    });
    it('handle context menu validation', () => {
console.log('handle context menu validation');
        menu.handleContextMenuItem('container_contextmenu_font_dialog');
        expect(() => { editor.fontDialogModule.onCancelButtonClick(); }).not.toThrowError();
        let event: any = { keyCode: 68, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        expect(() => { editor.fontDialogModule.onCancelButtonClick(); }).not.toThrowError();
    });
});
describe('Font dialog validation bold,italic,underLine', () => {
    let editor: DocumentEditor;
    let dialog: FontDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, FontDialog);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableFontDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.fontDialogModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Strikethrough value retrieval in dialog and apply testing', () => {
console.log('Strikethrough value retrieval in dialog and apply testing');
        createDocument(editor)
        let event: any;
        event = { keyCode: 35, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 66, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        editor.editorModule.onApplyCharacterFormat('underline', 'Single');
        expect(editor.selection.characterFormat.bold).toBe(true);
        editor.editorModule.onApplyCharacterFormat('strikethrough', 'SingleStrike');
        dialog.showFontDialog();
        dialog.loadFontDialog();
        dialog.fontStyle = 'Bold';
        (dialog as any).strikethroughBox.checked = true;
        (dialog as any).doublestrikethrough.checked = true;
        let doubleStrikeThrough: any = document.getElementById((dialog as any).target.id + '_doubleStrikeThrough');
        doubleStrikeThrough.checked = true;
        event = { checked: true, event: { currentTarget: doubleStrikeThrough } };
        (dialog as any).doublestrikethrough.change(event);
        dialog.onInsertFontFormat();
    });
    it('BaseLineAlignment value retrieval in dialog and apply testing', () => {
console.log('BaseLineAlignment value retrieval in dialog and apply testing');
        createDocument(editor)
        let event: any;
        event = { keyCode: 35, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 73, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        editor.editorModule.onApplyCharacterFormat('underline', 'Double');
        expect(editor.selection.characterFormat.italic).toBe(true);
        editor.editorModule.toggleBaselineAlignment('Subscript');
        dialog.showFontDialog();
        dialog.loadFontDialog();
        dialog.fontStyle = 'Italic';
        let superScript: any = document.getElementById((dialog as any).target.id + '_superScript');
        superScript.checked = true;
        event = { checked: true, event: { currentTarget: superScript } };
        (dialog as any).superscript.change(event);
        dialog.onInsertFontFormat();
        expect(editor.selection.characterFormat.baselineAlignment).toBe('Superscript');
    });
    it('Add modified property for character format  validation', () => {
console.log('Add modified property for character format  validation');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        let event: any;
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleControlShiftHomeKey();
        let format: WCharacterFormat = new WCharacterFormat();
        dialog.onCharacterFormat(editor.selection, format);
        editor.selection.handleLeftKey();
        editor.selection.handleControlShiftRightKey();
        editor.editorModule.delete();
        editor.editorHistory.undo();
        expect(() => { editor.editorHistory.undo(); }).not.toThrowError();
    });
});
describe('Font dialog validation bold,italic,underLine', () => {
    let editor: DocumentEditor;
    let dialog: FontDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, FontDialog);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableFontDialog: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.fontDialogModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });

    it('Font size event change and apply testing', () => {
console.log('Font size event change and apply testing');
        createDocument(editor)
        let event: any;
        event = { keyCode: 35, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        editor.editorModule.onApplyCharacterFormat('strikethrough', 'DoubleStrike');
        let prevFormat = editor.selection.characterFormat.fontSize;
        dialog.showFontDialog();
        dialog.loadFontDialog();
        dialog.fontStyle = 'Italic';
        event = { preventDefault: function () { }, value: "32" };
        (dialog as any).fontSizeText.change(event)
        dialog.onInsertFontFormat();
        expect(editor.selection.characterFormat.fontSize).not.toBe(prevFormat);
    });
});
describe('Font Dialog Font family,color,stikethrough validation -1 ', () => {
    let editor: DocumentEditor;
    let dialog: FontDialog
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, FontDialog);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableFontDialog: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.fontDialogModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Font Family event change and apply testing', () => {
console.log('Font Family event change and apply testing');
        createDocument(editor)
        let event: any;
        event = { keyCode: 35, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        editor.editorModule.toggleBaselineAlignment('Superscript');
        let prevFormat = editor.selection.characterFormat.fontFamily;
        dialog.showFontDialog();
        dialog.loadFontDialog();
        let fontName: any = document.getElementById((dialog as any).target.id + '_fontName');
        event = { preventDefault: function () { }, value: "Algebrian" };
        (dialog as any).fontNameList.change(event);
        dialog.onInsertFontFormat();
        expect(editor.selection.characterFormat.fontFamily).not.toBe(prevFormat);
    });
    it('Font Color event change and apply testing', () => {
console.log('Font Color event change and apply testing');
        createDocument(editor)
        let event: any;
        event = { keyCode: 35, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        let prevFormat = editor.selection.characterFormat.fontColor;
        dialog.showFontDialog();
        dialog.loadFontDialog();
        event = { preventDefault: function () { }, target: { value: { rgba: "#0000ff" } }, shiftKey: true, which: 0 };
        (dialog as any).fontColorUpdate(event);
        dialog.onInsertFontFormat();
        expect(editor.selection.characterFormat.fontFamily).not.toBe(prevFormat);
    });
});
describe('Font Dialog Font family,color,stikethrough validation-2', () => {
    let editor: DocumentEditor;
    let dialog: FontDialog
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = new FontDialog(editor.documentHelper);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Font Family event change and apply testing', (done) => {
console.log('Font Family event change and apply testing');
        createDocument(editor)
        let event: any;
        event = { keyCode: 35, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        let prevFormat = editor.selection.characterFormat.bold;
        dialog.showFontDialog();
        dialog.loadFontDialog();
        // let fontStyle: any = document.getElementById((dialog as any).target.id + '_fontStyle');
        // event = { preventDefault: function () { }, target: { value: "Bold" }, shiftKey: true, which: 0 };
        (dialog as any).fontStyleText.index = 1;
        setTimeout(() => {
            dialog.onCancelButtonClick();
            expect(editor.selection.characterFormat.bold).toBe(prevFormat);
            done();
        }, 50);
    });
    it('double Strikethrough value apply testing', () => {
console.log('double Strikethrough value apply testing');
        createDocument(editor)
        let event: any;
        event = { keyCode: 35, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        let prevFormat = editor.selection.characterFormat.strikethrough;
        dialog.showFontDialog();
        dialog.loadFontDialog();
        let doubleStrikeThrough: any = document.getElementById((dialog as any).target.id + '_doubleStrikeThrough');
        doubleStrikeThrough.checked = true;
        (dialog as any).doublestrikethrough.checked = true;
        event = { preventDefault: function () { }, checked: true, event: { currentTarget: doubleStrikeThrough } };
        (dialog as any).doublestrikethrough.change(event);
        event = { preventDefault: function () { }, checked: true, event: { currentTarget: doubleStrikeThrough } };
        (dialog as any).doublestrikethrough.change(event);
        dialog.onCancelButtonClick();
        expect(editor.selection.characterFormat.strikethrough).toBe(prevFormat);
    });
});
describe('Font Dialog Font family,color,stikethrough validation-3', () => {
    let editor: DocumentEditor;
    let dialog: FontDialog
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = new FontDialog(editor.documentHelper);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('SubScript value apply testing', () => {
console.log('SubScript value apply testing');
        createDocument(editor)
        let event: any;
        event = { keyCode: 35, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        let prevFormat = editor.selection.characterFormat.strikethrough;
        dialog.showFontDialog();
        dialog.loadFontDialog();
        let subScript: any = document.getElementById((dialog as any).target.id + '_subScript');
        let superScript: any = document.getElementById((dialog as any).target.id + '_superScript');
        subScript.checked = true;
        superScript.checked = true;
        event = { preventDefault: function () { }, checked: false, event: { currentTarget: superScript } };
        superScript.checked = false;
        (dialog as any).superscript.change(event);
        subScript.checked = true;
        event = { preventDefault: function () { }, checked: true, event: { currentTarget: subScript } };

        (dialog as any).subscript.change(event);
        subScript.checked = true;
        event = { preventDefault: function () { }, checked: true, event: { currentTarget: subScript } };
        (dialog as any).subscript.change(event);
        dialog.onInsertFontFormat();
        expect(editor.selection.characterFormat.strikethrough).toBe(prevFormat);
    });
    it('Strikethrough value apply testing', () => {
console.log('Strikethrough value apply testing');
        createDocument(editor)
        let event: any;
        event = { keyCode: 35, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        let prevFormat = editor.selection.characterFormat.strikethrough;
        dialog.showFontDialog();
        dialog.loadFontDialog();
        let strikethroughBox: any = document.getElementById((dialog as any).target.id + '_strikeThrough');
        let doubleStrikeThrough: any = document.getElementById((dialog as any).target.id + '_doubleStrikeThrough');
        doubleStrikeThrough.checked = true;
        strikethroughBox.checked = true;
        event = { preventDefault: function () { }, checked: true, event: { currentTarget: strikethroughBox } };
        (dialog as any).strikethroughBox.change(event);
        dialog.onInsertFontFormat();
        expect(editor.selection.characterFormat.strikethrough).toBe(prevFormat);
    });
});
describe('font dialog api validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let dialog: FontDialog;
    beforeEach((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, FontDialog);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableFontDialog: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.fontDialogModule;
    });
    afterEach((done) => {
        editor.destroy();
        dialog.destroy();
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 2000);
    });
    it(' onInsertFontFormat api validation', () => {
console.log(' onInsertFontFormat api validation');
        documentHelper = editor.documentHelper;
        dialog.showFontDialog();
        dialog.characterFormat = null;
        expect(() => { dialog.onInsertFontFormat(); }).not.toThrowError();
    });
    it(' destroy api validation', () => {
console.log(' destroy api validation');
        documentHelper = editor.documentHelper;
        dialog.showFontDialog();
        expect(() => { dialog.destroy(); }).not.toThrowError();
    });
    it('Dialog with bold property with selection is empty', () => {
console.log('Dialog with bold property with selection is empty');
        let event: any;
        event = { keyCode: 40, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        let dialog: FontDialog = new FontDialog(editor.documentHelper);
        dialog.showFontDialog();
        dialog.fontStyle = 'BoldItalic';
        expect(() => { dialog.onInsertFontFormat(); }).not.toThrowError();
    });
    it(' close Dialog Api validation', () => {
console.log(' close Dialog Api validation');
        documentHelper = editor.documentHelper;
        dialog.showFontDialog();
        expect(() => { dialog.closeFontDialog() }).not.toThrowError();
    });
    it('Module name validation', () => {
console.log('Module name validation');
        let name: string = dialog.getModuleName();
        expect(name).toBe('FontDialog');
    });
});


describe('Strikethrough and basline alignment validation', () => {
    let editor: DocumentEditor;
    let dialog: FontDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableFontDialog: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.fontDialogModule;

    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Strikethrough value retrieval in dialog and apply testing', () => {
console.log('Strikethrough value retrieval in dialog and apply testing');
        createDocument(editor)
        let event: any;
        editor.editorModule.onApplyCharacterFormat('strikethrough', 'SingleStrike');
        dialog.showFontDialog();
        dialog.loadFontDialog();
        dialog.fontStyle = 'Bold';
        (dialog as any).strikethroughBox.checked = true;
        (dialog as any).doublestrikethrough.checked = true;
        let doubleStrikeThrough: any = document.getElementById((dialog as any).target.id + '_doubleStrikeThrough');
        doubleStrikeThrough.checked = false;
        event = { checked: false, event: { currentTarget: doubleStrikeThrough } };
        (dialog as any).doublestrikethrough.change(event);
        dialog.onInsertFontFormat();
    });
    it('Strikethrough value retrieval in dialog and apply testing', () => {
console.log('Strikethrough value retrieval in dialog and apply testing');
        createDocument(editor)
        let event: any;
        editor.editorModule.onApplyCharacterFormat('strikethrough', 'SingleStrike');
        dialog.showFontDialog();
        dialog.loadFontDialog();
        dialog.fontStyle = 'Bold';
        (dialog as any).strikethroughBox.checked = true;
        (dialog as any).doublestrikethrough.checked = true;
        let doubleStrikeThrough: any = document.getElementById((dialog as any).target.id + '_strikeThrough');
        doubleStrikeThrough.checked = false;
        event = { checked: false, event: { currentTarget: doubleStrikeThrough } };
        (dialog as any).doublestrikethrough.change(event);
        dialog.onInsertFontFormat();
    });
    it('DoubleStrikeThrough value retrieval in dialog and apply testing', () => {
console.log('DoubleStrikeThrough value retrieval in dialog and apply testing');
        createDocument(editor)
        let event: any;
        editor.editorModule.onApplyCharacterFormat('strikethrough', 'SingleStrike');
        dialog.showFontDialog();
        dialog.loadFontDialog();
        dialog.fontStyle = 'Bold';
        (dialog as any).subscript.checked = true;
        (dialog as any).superscript.checked = true;
        let doubleStrikeThrough: any = document.getElementById((dialog as any).target.id + '_subScript');
        doubleStrikeThrough.checked = false;
        event = { checked: false, event: { currentTarget: doubleStrikeThrough } };
        (dialog as any).doublestrikethrough.change(event);
        dialog.onInsertFontFormat();
    });
    it('Strikethrough Testing', () => {
console.log('Strikethrough Testing');
        createDocument(editor)
        let event: any;
        editor.editorModule.onApplyCharacterFormat('strikethrough', 'SingleStrike');
        dialog.showFontDialog();
        dialog.loadFontDialog();
        dialog.fontStyle = 'Bold';
        let doubleStrikeThrough: any = document.getElementById((dialog as any).target.id + '_subScript');
        doubleStrikeThrough.checked = false;
        event = { checked: false, event: { currentTarget: doubleStrikeThrough } };
        (dialog as any).subscript.change(event);
        let strikethroughBox: any = document.getElementById((dialog as any).target.id + '_strikeThrough');
        doubleStrikeThrough.checked = false;
        event = { checked: false, event: { currentTarget: strikethroughBox } };
        (dialog as any).strikethroughBox.change(event);
        dialog.onInsertFontFormat();
    });
});

describe('Font dialog validation for allCaps', () => {
    let editor: DocumentEditor;
    let dialog: FontDialog;
    let menu: ContextMenu;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, FontDialog, ContextMenu, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableContextMenu: true, enableFontDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.fontDialogModule;
        menu = editor.contextMenuModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('allCaps property value apply testing', () => {
console.log('allCaps property value apply testing');
        createDocument(editor)
        let event: any;
        event = { keyCode: 35, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        dialog.showFontDialog();
        dialog.loadFontDialog();
        let allCaps: any = document.getElementById((dialog as any).target.id + '_allCaps');
        allCaps.checked = true;
        event = { preventDefault: function () { }, checked: true, event: { currentTarget: allCaps } };
        (dialog as any).allcaps.change(event);
        dialog.onInsertFontFormat();
        expect(editor.selection.characterFormat.allCaps).toBe(true);
    });
});
