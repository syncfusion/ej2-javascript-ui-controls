import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer, DocumentHelper } from '../../../src/index';
import { ListDialog } from '../../../src/document-editor/implementation/dialogs/list-dialog';
import { ListViewModel } from '../../../src/document-editor/implementation/dialogs/list-view-model';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { L10n } from '@syncfusion/ej2-base';
import { Editor } from '../../../src/index';

/**
 * List Dialog Spec
 */
function createDocument(editor: DocumentEditor) {
    editor.openBlank();
    editor.editorModule.insertText('Adventure Works cycles');
}
describe('List dialog validation-2', () => {
    let editor: DocumentEditor;
    let dialog: ListDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ListDialog);
        DocumentEditor.Inject(EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableListDialog: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.listDialogModule;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('followCharacter API validation', () => {
console.log('followCharacter API validation');
        dialog.showListDialog();
        let number = (dialog as any).followCharacterConverter('None');
        (dialog as any).followCharacterConverter('Space');
        (dialog as any).followCharacterConverter('Tab');
        expect(number).toBe(2);
    });
    it('List Pattern API validation', () => {
console.log('List Pattern API validation');
        let number = (dialog as any).listPatternConverter('Arabic');
        (dialog as any).listPatternConverter('LowRoman');
        (dialog as any).listPatternConverter('UpRoman');
        (dialog as any).listPatternConverter('LowLetter');
        (dialog as any).listPatternConverter('UpLetter');
        (dialog as any).listPatternConverter('Number');
        (dialog as any).listPatternConverter('LeadingZero');
        (dialog as any).listPatternConverter('Bullet');
        (dialog as any).listPatternConverter('Ordinal');
        (dialog as any).listPatternConverter('OrdinalText');
        (dialog as any).listPatternConverter('Special');
        (dialog as any).listPatternConverter('FarEast');
        (dialog as any).listPatternConverter('None');
        expect(number).toBe(0);
    });
    it('Applylist API validation', () => {
console.log('Applylist API validation');
        let dialog: any = new ListDialog(editor.documentHelper);
        createDocument(editor);
        dialog.showListDialog();
        dialog.documentHelper = undefined;
        expect(() => { (dialog as any).onApplyList(); }).toThrowError();
        dialog.destroy();
    });

});
describe('ListDialogViewModel class validation', () => {
    let editor: DocumentEditor;
    let dialog: ListDialog;
    let viewModel: ListViewModel
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ListDialog);
        DocumentEditor.Inject(EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = new ListDialog(editor.documentHelper);
        viewModel = (dialog as any).viewModel;
    });
    afterAll((done): void => {
        editor.destroy();
        dialog.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog = undefined;
        viewModel = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('viewmodel property validation', () => {
console.log('viewmodel property validation');
        dialog.showListDialog();
        viewModel.listLevelPattern = 'Arabic';
        expect(viewModel.listLevelPattern).not.toBe(undefined);
    });
    it('viewmodel property validation', () => {
console.log('viewmodel property validation');
        dialog.showListDialog();
        viewModel.followCharacter = 'Space';
        expect(viewModel.followCharacter).not.toBe(undefined);
    });
    it('Create List and addListLevel API validation', () => {
console.log('Create List and addListLevel API validation');

        dialog.showListDialog();
        let dialogview: ListViewModel = new ListViewModel();
        (dialogview as any).addListLevels();
    });

});
describe('dialog event validation-1', () => {
    let editor: DocumentEditor;
    let dialog: ListDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ListDialog);
        DocumentEditor.Inject(EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = new ListDialog(editor.documentHelper);
    });
    afterAll((done): void => {
        editor.destroy();
        dialog.destroy();
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        
        setTimeout(function () {
            done();
        }, 500);
    });
    it('NumberFormat event validation', (done) => {
console.log('NumberFormat event validation');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        editor.editor.applyNumbering('%1.', 'Number');
        dialog.showListDialog();
        setTimeout(() => {
            let event: any = { target: { value: "%0." } };
            (dialog as any).onNumberFormatChanged(event);
            expect((dialog as any).viewModel.listLevel.numberFormat).toBe('%0.');
            (dialog as any).onCancelButtonClick();
            done();
        });
    });
    it('follow character event validation', () => {
console.log('follow character event validation');
        createDocument(editor);
        editor.editorModule.insertText('Syncfusion Software');
        editor.editor.applyBullet('\uf0b7', 'Symbol');
        let locale: L10n = new L10n('documenteditor', editor.defaultLocale);
        locale.setLocale(editor.locale);
        dialog.initListDialog(locale);
        let event: any = { target: { value: "Space" } };
        (dialog as any).onFollowCharacterValueChanged(event);
        expect((dialog as any).viewModel.followCharacter).toBe('None');
    });
    it('follow character event validation', () => {
console.log('follow character event validation');
        let event: any = { target: { value: "Tab" } };
        (dialog as any).onFollowCharacterValueChanged(event);
        expect((dialog as any).viewModel.followCharacter).toBe('None');
    });
    it('follow character event validation', () => {
console.log('follow character event validation');
        let event: any = { target: { value: "None" } };
        (dialog as any).onFollowCharacterValueChanged(event);
        expect((dialog as any).viewModel.followCharacter).toBe('None');
    });
});
describe('dialog event validation', () => {
    let editor: DocumentEditor;
    let dialog: ListDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ListDialog);
        DocumentEditor.Inject(EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableListDialog: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.listDialogModule;
    });
    afterAll((done): void => {
        editor.destroy();
        dialog.destroy();
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        
        setTimeout(function () {
            done();
        }, 500);
    });
    it('ListLevel event validation', () => {
console.log('ListLevel event validation');
        createDocument(editor);
        dialog.showListDialog();
        let event: any = { value: 'Level 3', target: { selectedIndex: 2 } };
        expect(() => { (dialog as any).onListLevelValueChanged(event); }).not.toThrowError();
        (dialog as any).onApplyList();
    });
//     it('ListLevel event validation with index 0', () => {
// console.log('ListLevel event validation with index 0');
//         createDocument(editor);
//         dialog.showListDialog();
//         let event: any = { value: 'Level 1', target: { selectedIndex: 0 } };
//         expect(() => { (dialog as any).onListLevelValueChanged(event); }).not.toThrowError();
//         (dialog as any).onApplyList();
//     });
//     it('ListLevel event validation with index 0', () => {
// console.log('ListLevel event validation with index 0');
//         editor.editorHistory.undo();
//         expect(() => { editor.editorHistory.redo(); }).not.toThrowError();
//     });
//     it('Dialog property validation', (done) => {
// console.log('Dialog property validation');
//         createDocument(editor);
//         dialog.showListDialog();
//         setTimeout(() => {
//             (dialog as any).viewModel = undefined;
//             expect(dialog.list).toBe(undefined);
//             expect(dialog.listLevel).toBe(undefined);
//             done();
//         });
//     });
});
describe('dialog event validation', () => {
    let editor: DocumentEditor;
    let dialog: ListDialog;
    let event: any;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, ListDialog);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = new ListDialog(editor.documentHelper);
        createDocument(editor);
        dialog.showListDialog();
    });
    afterAll((done): void => {
        editor.destroy();
        dialog.destroy();
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('LevelPattern event validation', () => {
console.log('LevelPattern event validation');
        event = { target: { value: "UpRoman" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation', () => {
console.log('LevelPattern event validation');
        event = { target: { value: "LowRoman" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation', () => {
console.log('LevelPattern event validation');
        event = { target: { value: "UpLetter" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation', () => {
console.log('LevelPattern event validation');
        event = { target: { value: "LowLetter" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation', () => {
console.log('LevelPattern event validation');
        event = { target: { value: "Arabic" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation', () => {
console.log('LevelPattern event validation');
        event = { target: { value: "Bullet" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation-2', () => {
console.log('LevelPattern event validation-2');
        event = { target: { value: "Number" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation-2', () => {
console.log('LevelPattern event validation-2');
        event = { target: { value: "LeadingZero" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation-2', () => {
console.log('LevelPattern event validation-2');
        event = { target: { value: "Ordinal" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation-2', () => {
console.log('LevelPattern event validation-2');
        event = { target: { value: "OrdinalText" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation-2', () => {
console.log('LevelPattern event validation-2');
        event = { target: { value: "FarEast" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation-2', () => {
console.log('LevelPattern event validation-2');
        event = { target: { value: "Special" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation-2', () => {
console.log('LevelPattern event validation-2');
        event = { target: { value: "None" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('module name validation', () => {
console.log('module name validation');
        let name: string = dialog.getModuleName();
        expect(name).toBe('ListDialog')
    });
});

describe('List dialog event validation-3', () => {
    let editor: DocumentEditor;
    let dialog: ListDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ListDialog);
        DocumentEditor.Inject(EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = new ListDialog(editor.documentHelper);
    });
    afterAll((done): void => {
        editor.destroy();
        dialog.destroy();
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        
        setTimeout(function () {
            done();
        }, 500);
    });
    it('List NumberFormat event validation', (done) => {
console.log('List NumberFormat event validation');
        editor.openBlank();
        editor.editorModule.insertText('Hello World');
        editor.editor.applyNumbering('%1.', 'Number');
        dialog.showListDialog();
        setTimeout(() => {
            let event: any = { target: { value: "%2." } };
            (dialog as any).onNumberFormatChanged(event);
            expect((dialog as any).viewModel.listLevel.numberFormat).toBe('%2.');
            (dialog as any).onCancelButtonClick();
            done();
        });
    });
});
