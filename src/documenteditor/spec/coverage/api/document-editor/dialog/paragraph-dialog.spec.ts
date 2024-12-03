import { DocumentEditor } from '../../../../../src/document-editor/document-editor';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ParagraphDialog } from '../../../../../src/document-editor/implementation/dialogs/paragraph-dialog';
import { TabDialog } from '../../../../../src/document-editor/implementation/dialogs/tab-dialog';
import { SelectionParagraphFormat, TextElementBox } from '../../../../../src/index';
import { TestHelper } from '../../../../test-helper.spec';
import { Editor } from '../../../../../src/index';
import { Selection } from '../../../../../src/index';
import { EditorHistory } from '../../../../../src/document-editor/implementation/editor-history/editor-history';
import { ChangeArgs } from '@syncfusion/ej2-buttons';
import { StylesDialog } from '../../../../../src/document-editor/implementation/dialogs/styles-dialog';
import { StyleDialog } from '../../../../../src/document-editor/implementation/dialogs/style-dialog';
describe('Displayed Auto of Before & After spacing in Paragraph Dialog', function () {
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Displayed Auto of Before spacing in Paragraph Dialog', function () {
        console.log('Auto in Before spacing applying validation');
        editor.editor.insertText('Sample');
        dialog.show();
        let event = { value: -1, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        (dialog as any).changeBeforeSpacing(event);
        dialog.closeParagraphDialog();
        dialog.show();
        expect((dialog as any).beforeSpacingIn.element.value).toBe('Auto');
    });
    it('Displayed Auto of Before spacing in Paragraph Dialog', function () {
        console.log('Auto in After spacing applying validation');
        editor.editor.insertText('Sample');
        dialog.show();
        let event = { value: -1, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        (dialog as any).changeAfterSpacing(event);
        dialog.closeParagraphDialog();
        dialog.show();
        expect((dialog as any).afterSpacingIn.element.value).toBe('Auto');
    });
});

describe('Paragraph format-before spacing and left Indent Applying validation via dialog in empty selection', function () {
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Before spacing applying validation', function () {
        console.log('Before spacing applying validation');
        editor.editor.insertText('Sample');
        let height = editor.selection.start.paragraph.height;
        dialog.show();
        let event = { value: 48, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        (dialog as any).changeBeforeSpacing(event);
        event = { value: 48, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        (dialog as any).changeLeftIndent(event);
        dialog.applyParagraphFormat();
        expect(editor.selection.start.paragraph.x).not.toBe(96);
    });

    it('After left indent via paragraph dialog-undo validation', function () {
        console.log('After left indent via paragraph dialog-undo validation');
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.x).toBe(96);
    });
    it('After left indent via paragraph dialog-Redo validation', function () {
        console.log('After left indent via paragraph dialog-Redo validation');
        editor.editorHistory.redo();
        expect(editor.selection.start.paragraph.x).not.toBe(96);
    });
    it('After left indent via paragraph dialog-Multiple undo and redo validation', function () {
        console.log('After left indent via paragraph dialog-Multiple undo and redo validation');

        for (let i: number = 0; i < 5; i++) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
        }
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.x).toBe(96);
    });


});

describe('Paragraph format-after spacing and left Indent Applying validation via dialog in empty selection', function () {
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('after spacing applying validation', function () {
        console.log('after spacing applying validation');
        editor.editor.insertText('Sample');
        let height = editor.selection.start.paragraph.height;
        dialog.show();
        let event = { value: 48, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        (dialog as any).changeBeforeSpacing(event);
        event = { value: 48, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        (dialog as any).changeLeftIndent(event);
        event = { value: 20, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        (dialog as any).changeAfterSpacing(event);
        dialog.applyParagraphFormat();
        expect(editor.selection.start.paragraph.height).toBeGreaterThanOrEqual(48);
    });

    it('After after spacing via paragraph dialog- undo validation', function () {
        console.log('After after spacing via paragraph dialog- undo validation');
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.height).toBeLessThan(48);
    });
    it('After after spacing via paragraph dialog- Redo validation', function () {
        console.log('After after spacing via paragraph dialog- Redo validation');
        editor.editorHistory.redo();
        expect(editor.selection.start.paragraph.height).toBeGreaterThanOrEqual(48);
    });
    it('After after spacing via paragraph dialog-Multiple undo and redo validation', function () {
        console.log('After after spacing via paragraph dialog-Multiple undo and redo validation');

        for (let i: number = 0; i < 5; i++) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
        }
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.height).toBeLessThan(48);
    });

});


describe('Paragraph format using paragraph dialog- right to left changes in empty selection', function () {
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    let event: ChangeArgs;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('apply bidi true', function () {
        console.log('apply bidi true');
        editor.editor.insertText('Sample');
        editor.editor.insertText('سشةحمث');
        editor.editor.insertText('سشةحمث');
        expect(editor.selection.paragraphFormat.bidi).toBe(false);
        dialog.show();
        if (isNullOrUndefined((dialog as any).textAlignment)) {
            (dialog as any).textAlignment = editor.selection.paragraphFormat.textAlignment;
        }
        event = { value: 'rtl' };
        (dialog as any).changeBidirectional(event);
        dialog.applyParagraphFormat();
        expect(editor.selection.start.paragraph.paragraphFormat.bidi).toBe(true);
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('Sample');
    });

    it('undo after apply bidi', function () {
        console.log('undo after apply bidi');
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.paragraphFormat.bidi).toBe(false);
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('Sample');
    });
    it('after apply bidi- Redo validation', function () {
        console.log('after apply bidi- Redo validation');
        editor.editorHistory.redo();
        expect(editor.selection.start.paragraph.paragraphFormat.bidi).toBe(true);
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('Sample');
    });
    it('after apply bidi-Multiple undo and redo validation', function () {
        console.log('after apply bidi-Multiple undo and redo validation');

        for (let i: number = 0; i < 5; i++) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
        }
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.paragraphFormat.bidi).toBe(false);
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('Sample');
    });

});
describe('Paragraph format using paragraph dialog- right to left changes in empty selection at center', function () {
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    let event: ChangeArgs;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('apply bidi true at center alignment', function () {
        console.log('apply bidi true at center alignment');
        editor.editor.insertText('Sample');
        editor.editor.insertText('سشةحمث');
        editor.editor.insertText('سشةحمث');
        editor.selection.paragraphFormat.textAlignment = 'Center';
        dialog.show();
        event = { value: 'rtl' };
        (dialog as any).changeBidirectional(event);
        dialog.applyParagraphFormat();
        expect(editor.selection.start.paragraph.paragraphFormat.bidi).toBe(true);
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });

    it('undo apply bidi true at center alignment', function () {
        console.log('undo apply bidi true at center alignment');
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.paragraphFormat.bidi).toBe(false);
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it('apply bidi true at center alignment- Redo validation', function () {
        console.log('apply bidi true at center alignment- Redo validation');
        editor.editorHistory.redo();
        expect(editor.selection.start.paragraph.paragraphFormat.bidi).toBe(true);
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it('apply bidi true at center alignment-Multiple undo and redo validation', function () {
        console.log('apply bidi true at center alignment-Multiple undo and redo validation');

        for (let i: number = 0; i < 5; i++) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
        }
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.paragraphFormat.bidi).toBe(false);
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });

});

describe('Paragraph format using paragraph dialog- right to left changes in non-empty selection', function () {
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    let event: ChangeArgs;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('apply bidi true in non-empty selection', function () {
        console.log('apply bidi true in non-empty selection');
        editor.editor.insertText('Sample');
        editor.editor.insertText('سشةحمث');
        editor.editor.insertText('سشةحمث');
        editor.editor.onEnter();
        editor.editor.insertText('Sample');
        editor.editor.insertText('سشةحمث');
        editor.editor.insertText('سشةحمث');
        editor.selection.selectAll();
        dialog.show();
        if (isNullOrUndefined((dialog as any).textAlignment)) {
            (dialog as any).textAlignment = 'Left';
        }
        event = { value: 'rtl' };
        (dialog as any).changeBidirectional(event);
        dialog.applyParagraphFormat();
        expect(editor.selection.start.paragraph.paragraphFormat.bidi).toBe(true);
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });

    it('undo apply bidi true in non-empty selection', function () {
        console.log('undo apply bidi true in non-empty selection');
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.paragraphFormat.bidi).toBe(false);
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it('apply bidi true in non-empty selection- Redo validation', function () {
        console.log('apply bidi true in non-empty selection- Redo validation');
        editor.editorHistory.redo();
        expect(editor.selection.start.paragraph.paragraphFormat.bidi).toBe(true);
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it('apply bidi true in non-empty selection-Multiple undo and redo validation', function () {
        console.log('apply bidi true in non-empty selection-Multiple undo and redo validation');

        for (let i: number = 0; i < 5; i++) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
        }
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.paragraphFormat.bidi).toBe(false);
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });

});

describe('Paragraph format using paragraph dialog- right to left changes in non-empty selection', function () {
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    let event: ChangeArgs;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('apply bidi true in non-empty selection- alignment left', function () {
        console.log('apply bidi true in non-empty selection- alignment left');
        editor.editor.insertText('Sample');
        editor.editor.insertText('سشةحمث');
        editor.editor.insertText('سشةحمث');
        editor.editor.onEnter();
        editor.editor.insertText('Sample');
        editor.editor.insertText('سشةحمث');
        editor.editor.insertText('سشةحمث');
        editor.selection.selectAll();
        editor.selection.paragraphFormat.bidi = true;
        dialog.show();
        if (isNullOrUndefined((dialog as any).textAlignment)) {
            (dialog as any).textAlignment = 'Right';
        }
        event = { value: 'ltr' };
        (dialog as any).changeBidirectional(event);
        dialog.applyParagraphFormat();
        expect(editor.selection.start.paragraph.paragraphFormat.bidi).toBe(false);
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });

    it('apply bidi true in non-empty selection- aligment justify', function () {
        console.log('apply bidi true in non-empty selection- aligment justify');
        editor.openBlank();
        editor.editor.insertText('Sample');
        editor.editor.insertText('سشةحمث');
        editor.editor.insertText('سشةحمث');
        editor.editor.onEnter();
        editor.editor.insertText('Sample');
        editor.editor.insertText('سشةحمث');
        editor.editor.insertText('سشةحمث');
        editor.selection.selectAll();
        editor.selection.paragraphFormat.textAlignment = 'Justify';
        dialog.show();
        (dialog as any).textAlignment = 'Justify';
        event = { value: 'rtl' };
        (dialog as any).changeBidirectional(event);
        dialog.applyParagraphFormat();
        expect(editor.selection.start.paragraph.paragraphFormat.bidi).toBe(true);
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Justify');
    });

});
function createDocument(editor: DocumentEditor) {
    editor.openBlank();
    editor.editorModule.insertText('Adventure Works cycles');
}
describe('Paragraph Format Apply Dialog Test Case Validation', function () {
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    let selectionParaFormat: SelectionParagraphFormat;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory, TabDialog);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Validate FirstLine indent', function () {
        console.log('Validate FirstLine indent');
        let changeEvent: any;
        dialog.loadParagraphDialog();
        selectionParaFormat = editor.documentHelper.selection.paragraphFormat;
        selectionParaFormat.firstLineIndent = -10;
        dialog.loadParagraphDialog();
        dialog.changeByValue();
        expect((dialog as any).special.index).toBe(2);
    });

    it('Validate Hanging indent', function () {
        console.log('Validate Hanging indent');
        let changeEvent: any;
        dialog.loadParagraphDialog();
        selectionParaFormat = editor.documentHelper.selection.paragraphFormat;
        selectionParaFormat.firstLineIndent = 10;
        dialog.loadParagraphDialog();
        dialog.changeByValue();
        expect((dialog as any).special.index).toBe(1);
    });

    it('Validate Hanging indent', function () {
        console.log('Validate Hanging indent');
        let changeEvent: any;
        dialog.loadParagraphDialog();
        selectionParaFormat = editor.documentHelper.selection.paragraphFormat;
        selectionParaFormat.firstLineIndent = 10;
        (dialog as any).special.index = 2;
        selectionParaFormat.leftIndent = 20;
        dialog.loadParagraphDialog();
        dialog.changeByValue();
        expect((dialog as any).leftIndentIn.value).toBe(20);
    });
    it('open tab dialog', () => {
        console.log('open tab dialog');
        dialog.loadParagraphDialog();
        dialog.openTabDialog();
    });
});
