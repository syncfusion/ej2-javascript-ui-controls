import { createElement } from "@syncfusion/ej2-base";
import { TestHelper } from "../../../test-helper.spec";
import { DocumentEditor } from "../../../../src/document-editor/document-editor";
import { Editor } from "../../../../src/document-editor/implementation/editor/editor";
import { Selection } from '../../../../src/document-editor/implementation/selection/selection';
import { EditorHistory } from "../../../../src/document-editor/implementation/editor-history/editor-history";
import { SfdtExport } from "../../../../src/document-editor/implementation/writer/sfdt-export";
import { SpellCheckDialog } from '../../../../src/document-editor/implementation/dialogs/spellCheck-dialog';
import { SpellChecker } from "../../../../src/document-editor/implementation/spell-check/spell-checker";
import { ParagraphWidget, LineInfo, TextElementBox, TextPosition, ContextElementInfo, LineWidget, ElementInfo, ErrorInfo, SpaceCharacterInfo, SpecialCharacterInfo, ElementBox, WordSpellInfo } from '../../../../src';
describe('Track changes pane Validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('onSelection', function () {
        console.log('onSelection');
        container.enableTrackChanges = true;
        container.editor.insertText('hello');
        container.showRevisions = true;
        var a = container.revisions.get(0);
        container.trackChangesPane.onSelection(a);
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('navigateChanges', function () {
        console.log('navigateChanges');
        container.editor.insertText('hello');
        container.enableTrackChanges = true;
        container.editor.onBackSpace();
        container.editor.insertText('hello');
        container.showRevisions = true;
        container.trackChangesPane.navigateNextChanges();
        container.trackChangesPane.navigatePreviousChanges();
        (container.trackChangesPane.changes.get(container.trackChangesPane.revisions[0]) as any).rejectButtonClick();
    });
    it('onMenuSelect', function () {
        console.log('onMenuSelect');
        container.enableTrackChanges = true;
        container.editor.insertText('hello');
        container.showRevisions = true;
        let arg = { item: { text: 'Accept all Changes' } };
        (container.trackChangesPane as any).onMenuSelect(arg);
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('onMenuSelect-rejectAll', function () {
        console.log('onMenuSelect');
        container.enableTrackChanges = true;
        container.editor.insertText('hello');
        container.showRevisions = true;
        let arg = { item: { text: 'Reject all Changes' } };
        (container.trackChangesPane as any).onMenuSelect(arg);
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('appendRowToTable', function () {
        console.log('appendRowToTable');
        container.enableTrackChanges = true;
        container.editor.insertTable(2, 2);
        container.showRevisions = true;
        expect(container.revisions.changes.length).toBe(2);
        (container.trackChangesPane.changes.get(container.trackChangesPane.revisions[0]) as any).acceptButtonClick();
    });
    it('beforeDropDownItemRender', function () {
        console.log('beforeDropDownItemRender');
        container.enableTrackChanges = true;
        container.editor.insertTable(2, 2);
        container.showRevisions = true;
        expect(container.revisions.changes.length).toBe(2);
        (document.getElementsByClassName('e-de-track-span-user')[0] as any).click();
    });
    it('Inserting table and text with trackchanges reject changes', function () {
        console.log('Inserting table and text with trackchanges reject changes');
        container.enableTrackChanges = true;
        container.editor.insertTable(2, 2);
        container.selection.select('0;0;1;1;0;0', '0;0;1;1;0;0');
        container.editor.insertText('hello');
        (container.trackChangesPane.changes.get(container.trackChangesPane.revisions[0]) as any).rejectButtonClick();
        expect(container.revisions.changes.length).toBe(3);

    });
    it('Inserting table and text with trackchanges accept changes', function () {
        console.log('Inserting table and text with trackchanges accept changes');
        container.enableTrackChanges = true;
        container.editor.insertTable(2, 2);
        container.selection.select('0;0;1;1;0;0', '0;0;1;1;0;0');
        container.editor.insertText('hello');
        (container.trackChangesPane.changes.get(container.trackChangesPane.revisions[0]) as any).acceptButtonClick();
        expect(container.revisions.changes.length).toBe(3);

    });
    it('Inserting text with para mark with trackchanges accept changes', function () {
        console.log('Inserting table and text with trackchanges accept changes');
        container.enableTrackChanges = true;
        container.editor.insertText('hello');
        container.editor.onEnter();
        container.editor.insertText('world');
        (container.trackChangesPane.changes.get(container.trackChangesPane.revisions[0]) as any).acceptButtonClick();
        expect(container.revisions.changes.length).toBe(2);
    });
    it('Inserting text with para mark with trackchanges reject changes', function () {
        console.log('Inserting table and text with trackchanges reject changes');
        container.enableTrackChanges = true;
        container.editor.insertText('hello');
        container.editor.onEnter();
        container.editor.insertText('world');
        (container.trackChangesPane.changes.get(container.trackChangesPane.revisions[0]) as any).rejectButtonClick();
        expect(container.revisions.changes.length).toBe(1);
    });
    it('Table of content with trackchanges -reject', () => {
        console.log('Table of content with trackchanges -reject');
        container.editor.insertText("Hello world");
        container.editorModule.applyStyle('Heading 1');
        container.enableTrackChanges = true;
        container.editor.insertTableOfContents();
        (container.trackChangesPane.changes.get(container.trackChangesPane.revisions[0]) as any).rejectButtonClick();
        expect(container.revisions.changes.length).toBe(1);
    });
    it('Table of content with trackchanges -reject', () => {
        console.log('Table of content with trackchanges -reject');
        container.editor.insertText("Hello world");
        container.editorModule.applyStyle('Heading 1');
        container.enableTrackChanges = true;
        container.editor.insertTableOfContents();
        (container.trackChangesPane.changes.get(container.trackChangesPane.revisions[0]) as any).acceptButtonClick();
        expect(container.revisions.changes.length).toBe(1);
    });
    it('Enabling Tracking Changes - acceptAll', function () {
        console.log('Enabling Tracking Changes - acceptAll');
        container.currentUser = "Guest";
        container.editor.insertText("Hello");
        container.enableTrackChanges = true;
        container.editor.insertText("world");
        container.revisions.acceptAll();
        var count = container.revisions.changes.length;
        expect(count).toBe(0);
    });
    it('Enabling Tracking Changes - rejectAll', function () {
        console.log('Enabling Tracking Changes - rejectAll');
        container.currentUser = "Guest";
        container.editor.insertText("Hello");
        container.enableTrackChanges = true;
        container.editor.insertText("world");
        container.revisions.rejectAll();
        var count = container.revisions.changes.length;
        expect(count).toBe(0);
    });
    it('onTypeSelect - Inserted', function () {
        console.log('onTypeSelect - Inserted');
        container.editor.insertText("Hello");
        container.enableTrackChanges = true;
        container.editor.insertText("world");
        let args = { item: { text: 'Inserted' } };
        (container.trackChangesPane as any).onTypeSelect(args);
        container.revisions.rejectAll();
        var count = container.revisions.changes.length;
        expect(count).toBe(0);
    });
    it('onUserSelect - Guest user', function () {
        console.log('onUserSelect - Guest user');
        container.editor.insertText("Hello");
        container.enableTrackChanges = true;
        container.editor.insertText("world");
        let args = { item: { text: 'Guest User' } };
        (container.trackChangesPane as any).onUserSelect(args);
        let args1 = { item: { text: 'All' } };
        (container.trackChangesPane as any).onTypeSelect(args1);
        container.revisions.rejectAll();
        var count = container.revisions.changes.length;
        expect(count).toBe(0);
    });
    it('onUserSelect - Guest user-acceptAll', function () {
        console.log('onUserSelect - Guest user-acceptAll');
        container.editor.insertText("Hello");
        container.enableTrackChanges = true;
        container.editor.insertText("world");
        let args = { item: { text: 'Guest User' } };
        (container.trackChangesPane as any).onUserSelect(args);
        let args1 = { item: { text: 'All' } };
        (container.trackChangesPane as any).onTypeSelect(args1);
        container.revisions.acceptAll();
        var count = container.revisions.changes.length;
        expect(count).toBe(0);
    });
    it('onTypeSelect - Deleted', function () {
        console.log('onTypeSelect - Deleted');
        container.editor.insertText("Hello");
        container.enableTrackChanges = true;
        container.editor.insertText("world");
        let args = { item: { text: 'Deleted' } };
        (container.trackChangesPane as any).onTypeSelect(args);
        container.revisions.rejectAll();
        var count = container.revisions.changes.length;
        expect(count).toBe(0);
    });
});
