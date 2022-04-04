import { ContextMenu } from '../../../src/document-editor/implementation/context-menu';
import { createElement, L10n } from "@syncfusion/ej2-base";
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { TestHelper } from "../../test-helper.spec";
import { SpellChecker } from "../../../src/document-editor/implementation/spell-check/spell-checker";
import { DocumentEditor } from '../../../src/document-editor/document-editor';

describe('Spell check insert page break issues', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1100px;height:700px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ContextMenu, SpellChecker);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, enableContextMenu: true, enableSpellCheck: true, enableSearch: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.spellChecker.enableOptimizedSpellCheck = true;
        editor.spellChecker.allowSpellCheckAndSuggestion = true;
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Spell check insert page break issues', () => {
        editor.openBlank();
        editor.editor.insertPageBreak();
        expect(editor.selection.start.paragraph.bodyWidget.page.index).toBe(1);
        editor.editor.handleBackKey();
        expect(editor.selection.start.paragraph.bodyWidget.page.index).toBe(0);
    });
});
