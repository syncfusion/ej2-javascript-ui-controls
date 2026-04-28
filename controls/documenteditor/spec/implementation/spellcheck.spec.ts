import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../test-helper.spec';
import { ContextMenu, Search, Selection, SpellCheckDialog, SpellChecker } from '../../src/index';
import { Editor } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
describe('Insert text while spellcheck enabled', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1100px;height:700px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ContextMenu, SpellChecker, Search, SpellCheckDialog);
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
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Spell checker lag issue', () => {
        editor.openBlank();
       editor.editor.insertText('n 2000, Adventure Works Cycles bought a small manufacturing plant, Importadores Neptuno, located in Mexico. Importadores Neptuno manufactures several critical subcomponents for the Adventure Works Cycles product line. These subcomponents are shipped to the Bothell location for final product assembly. In 2001, Importadores Neptuno, became the sole manufacturer and distributor of the touring bicycle product group.');
    });
    it('Spell check Construct context menu testing', () => {
console.log('Spell check Construct context menu testing');
        editor.openBlank();
        let jsonData: any = { 'HasSpellingError': true, 'Suggestions': ['Hello', 'Halo', 'Help'] };
        let spellingSuggestion: any = ['Add To Dicitonary', 'Ignore All'];
        let suggestions: any[] = editor.contextMenu.constructContextmenu(jsonData.Suggestions, spellingSuggestion);
        expect(suggestions.length).toBe(11);
    });
});

describe('Context menu - spell checker', () => {
    let sfdtContent: string = '{"sfdt":"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"}'
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1100px;height:700px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ContextMenu, SpellChecker, Search, SpellCheckDialog);
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
        
        setTimeout(function () {
            done();
        }, 1000);
    });
       it('validate context menu', () => {
        console.log('validate context menu');
        editor.open(sfdtContent);
        let jsonData: any = { 'HasSpellingError': true, 'Suggestions': ['Hello', 'Halo', 'Help'] };
        let spellingSuggestion: any = ['Add To Dicitonary', 'Ignore All'];
        editor.selection.selectAll();
        let suggestions: any[] = editor.contextMenu.constructContextmenu(jsonData.Suggestions, spellingSuggestion);
        expect(suggestions.length).toBe(2);
    });
});