import { ContextMenu } from '../../../src/document-editor/implementation/context-menu';
import { createElement } from "@syncfusion/ej2-base";
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { TestHelper } from "../../test-helper.spec";
import { SpellChecker } from "../../../src/document-editor/implementation/spell-check/spell-checker";
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { ParagraphWidget, LineInfo, TextElementBox } from '../../../src';
import { Search } from '../../../src/document-editor/implementation/search/index';
import { SpellCheckDialog } from '../../../src/document-editor/implementation/dialogs/spellCheck-dialog';

describe('Spell Checker dialog API', () => {
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
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Call Spell checker dialog', () => {
console.log('Call Spell checker dialog');
        editor.openBlank();
        editor.spellChecker.languageID = 1;
        editor.serviceUrl='';
        editor.spellChecker.allowSpellCheckAndSuggestion = true;
        editor.editor.insertTextInternal('eacock', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        editor.spellCheckDialogModule.show(element.text, element);
    });
    it('Spell checker dialog module name validation', () => {
console.log('Spell checker dialog module name validation');
        expect((editor.spellCheckDialogModule as any).getModuleName()).toBe('SpellCheckDialog');
    });
    it('Spell checker dialog ignore button test', () => {
console.log('Spell checker dialog ignore button test');
        editor.openBlank();
        editor.editor.insertTextInternal('helo', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': ['hello', 'halo', 'help'] };
        (editor.spellCheckDialogModule as any).handleRetrievedSuggestion('helo', jsonData.Suggestions);
        jsonData = { "HasSpellingError": true, "Suggestions": [] }
        editor.spellChecker.handleWordByWordSpellCheck(jsonData, element, 196, 196, 11, undefined, true);
        editor.spellCheckDialogModule.onIgnoreClicked();
        expect(element.ignoreOnceItems.length).toBe(1);
    });
    it('Spell checker dialog Cancel button test', () => {
console.log('Spell checker dialog Cancel button test');
        editor.openBlank();
        editor.editor.insertTextInternal('eacock', false);
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': ['peacock', 'petcock'] };
        (editor.spellCheckDialogModule as any).handleRetrievedSuggestion('eacock', jsonData.Suggestions);
        editor.spellCheckDialogModule.onCancelButtonClick();
    });
    it('Spell checker dialog Ignore All button test', () => {
console.log('Spell checker dialog Ignore All button test');
        editor.openBlank();
        editor.editor.insertTextInternal('eacock', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        (editor.spellCheckDialogModule as any).elementBox = element;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': ['peacock', 'petcock'] };
        (editor.spellCheckDialogModule as any).handleRetrievedSuggestion('eacock', jsonData.Suggestions);
        editor.spellCheckDialogModule.onIgnoreAllClicked();
        expect(editor.spellChecker.errorWordCollection.containsKey(element.text)).toBe(false);
    });
    it('Spell checker dialog change button test', () => {
console.log('Spell checker dialog change button test');
        editor.openBlank();
        editor.editor.insertTextInternal('helo', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        (editor.spellCheckDialogModule as any).elementBox = element;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': ['hello', 'halo', 'help'] };
        (editor.spellCheckDialogModule as any).handleRetrievedSuggestion('eacock', jsonData.Suggestions);
        (editor.spellCheckDialogModule as any).selectedText = 'hello';
        editor.spellCheckDialogModule.changeButtonClicked();
        expect((lineInfo.line.children[0] as TextElementBox).text).toBe('hello');
    });
    it('Spell checker dialog change All button test', () => {
console.log('Spell checker dialog change All button test');
        editor.openBlank();
        editor.editor.insertTextInternal('helo', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        (editor.spellCheckDialogModule as any).elementBox = element;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': ['hello', 'halo', 'help'] };
        (editor.spellCheckDialogModule as any).handleRetrievedSuggestion('helo', jsonData.Suggestions);
        jsonData = { "HasSpellingError": true, "Suggestions": [] }
        editor.spellChecker.handleWordByWordSpellCheck(jsonData, element, 196, 196, 11, undefined, true);
        (editor.spellCheckDialogModule as any).selectedText = 'hello';
        editor.spellCheckDialogModule.changeAllButtonClicked();
        expect(editor.spellChecker.errorWordCollection.length).toBe(0);
    });
    it('Spell checker dialog change All button test 1', () => {
console.log('Spell checker dialog change All button test 1');
        editor.openBlank();
        editor.editor.insertTextInternal('helo world', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        (editor.spellCheckDialogModule as any).elementBox = element;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': ['hello', 'halo', 'help'] };
        (editor.spellCheckDialogModule as any).handleRetrievedSuggestion('helo', jsonData.Suggestions);
        jsonData = { "HasSpellingError": true, "Suggestions": [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'helo', element, true, 11, 0, 0);
        (editor.spellCheckDialogModule as any).selectedText = 'hello';
        editor.spellCheckDialogModule.changeAllButtonClicked();
        expect(editor.spellChecker.errorWordCollection.length).toBe(0);
    });
    it('Spell checker dialog Add to Dictionary button test', () => {
console.log('Spell checker dialog Add to Dictionary button test');
        editor.openBlank();
        editor.serviceUrl= undefined;
        editor.editor.insertTextInternal('eacock', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        (editor.spellCheckDialogModule as any).elementBox = element;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': ['peacock', 'petcock'] };
        (editor.spellCheckDialogModule as any).handleRetrievedSuggestion('eacock', jsonData.Suggestions);
        expect(() => { editor.spellCheckDialogModule.addToDictClicked() }).not.toThrowError();
    });

    it('custom header validation', () => {
console.log('custom header validation');
        editor.openBlank();
        editor.serviceUrl= undefined;
       editor.headers=[{"syncfusion":"true"}];
       let httpRequest:XMLHttpRequest=new XMLHttpRequest();
        expect(() => { (editor.spellChecker as any).setCustomHeaders(httpRequest) }).toThrowError();
    });
//     it('Public API Spell checker dialog validation', () => {
// console.log('Public API Spell checker dialog validation');
//         editor.openBlank();
//         editor.spellChecker.languageID = 1;
//         editor.serviceUrl='';
//         editor.spellChecker.allowSpellCheckAndSuggestion = true;
//         editor.editor.insertTextInternal('eacock', false);
//         expect(() => { editor.showSpellCheckDialog(); }).not.toThrowError();
//     });
}); 
