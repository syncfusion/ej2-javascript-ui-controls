import { createElement } from "@syncfusion/ej2-base";
import { TestHelper } from "../../../test-helper.spec";
import { DocumentEditor } from "../../../../src/document-editor/document-editor";
import { Editor } from "../../../../src/document-editor/implementation/editor/editor";
import { Selection } from '../../../../src/document-editor/implementation/selection/selection';
import { EditorHistory } from "../../../../src/document-editor/implementation/editor-history/editor-history";
import { SfdtExport } from "../../../../src/document-editor/implementation/writer/sfdt-export";
import { SpellCheckDialog } from '../../../../src/document-editor/implementation/dialogs/spellCheck-dialog';
import { SpellChecker } from "../../../../src/document-editor/implementation/spell-check/spell-checker";
import { ParagraphWidget, LineInfo, TextElementBox, TextPosition, ElementBox, WordSpellInfo } from '../../../../src';
describe('Spell Checker API', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1100px;height:700px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, SpellChecker, SpellCheckDialog);
        editor = new DocumentEditor({ isReadOnly: false });
        editor.enableAllModules();
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
        }, 1000);
    });
    it('Spell check for Handle IgnoreAll API testing', () => {
        console.log('Spell check for Handle IgnoreAll API testing');
        editor.openBlank();
        editor.spellChecker.ignoreAllItems = [];
        editor.spellChecker.errorWordCollection.clear();
        editor.editorModule.insertTextInternal('heloSyncfusion', false);
        editor.selection.start.offset = 0;
        editor.spellChecker.handleIgnoreAllItems();
        expect(editor.spellChecker.ignoreAllItems.length).toBe(1);
    });
    it('Spell check for Handle IgnoreAll API testing 1', () => {
        console.log('Spell check for Handle IgnoreAll API testing 1');
        editor.openBlank();
        editor.spellChecker.ignoreAllItems = [];
        editor.spellChecker.errorWordCollection.clear();
        editor.editorModule.insertTextInternal('heloSyncfusion', false);
        editor.selection.start.offset = 0;
        editor.spellChecker.handleIgnoreAllItems(editor.spellChecker.findCurretText());
        expect(editor.spellChecker.ignoreAllItems.length).toBe(1);
    });
    it('Error count testing single word', () => {
        console.log('Error count testing single word');
        editor.editorModule.insertTextInternal('Syncfusion', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, "Suggestions": [] }
        editor.spellChecker.handleWordByWordSpellCheck(jsonData, element, 196, 196, 11, undefined, true);
        expect(editor.spellChecker.errorWordCollection.length).toBe(1);
    });
        it('Error count testing for words in a line', () => {
    console.log('Error count testing for words in a line');
            editor.openBlank();
            editor.editorModule.insertTextInternal('This sction elains the stps to create a Word document editor within your applation and demonstrates the sction', false);
            let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
            let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
            let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
            let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
            editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'sction', element, true, 11, 0, 0);
            expect(editor.spellChecker.errorWordCollection.get('sction').length).toBe(element.errorCollection.length);
        });
    it('Error count testing for words in a line for combination', () => {
        console.log('Error count testing for words in a line for combination');
        editor.openBlank();
        editor.spellChecker.languageID = 1;
        editor.serviceUrl = '';
        editor.spellChecker.allowSpellCheckAndSuggestion = true;
        editor.editorModule.insertTextInternal('par', false);
        editor.selection.characterFormat.fontFamily = 'Calibri Light';
        editor.editorModule.insertTextInternal('agra', false);
        editor.selection.characterFormat.fontSize = 23;
        editor.editorModule.insertTextInternal('ph', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        expect(editor.spellChecker.checkElementCanBeCombined(element, 11, 0, false)).toBe(true);
        element = lineInfo.line.children[2] as TextElementBox;
        expect(editor.spellChecker.checkElementCanBeCombined(element, 11, 0, false)).toBe(true);
    });
    it('Spell check combination testing 1', () => {
        console.log('Spell check combination testing 1');
        editor.openBlank();
        editor.spellChecker.languageID = 1;
        editor.serviceUrl = '';
        editor.spellChecker.allowSpellCheckAndSuggestion = true;
        editor.editorModule.insertTextInternal('par', false);
        editor.selection.characterFormat.fontFamily = 'Calibri Light';
        editor.editorModule.insertTextInternal('agra', false);
        editor.selection.characterFormat.fontSize = 23;
        editor.editorModule.insertTextInternal('ph', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        (lineInfo.line.children[0] as TextElementBox).istextCombined = true;
        (lineInfo.line.children[1] as TextElementBox).istextCombined = true;
        (lineInfo.line.children[2] as TextElementBox).istextCombined = true;
        let element: TextElementBox = lineInfo.line.children[2] as TextElementBox;
        let retrievedElement: ElementBox = editor.spellChecker.getCombinedElement(element);
        expect((retrievedElement as TextElementBox).text).toBe('par');
    });
    it('Error count testing for words in a line for combination 1', () => {
        console.log('Error count testing for words in a line for combination 1');
        editor.openBlank();
        editor.spellChecker.languageID = 1;
        editor.serviceUrl = '';
        editor.spellChecker.allowSpellCheckAndSuggestion = true;
        editor.editorModule.insertTextInternal('Syncfusion ', false);
        editor.selection.characterFormat.fontFamily = 'Calibri Light';
        editor.editorModule.insertTextInternal('software', false);
        editor.selection.characterFormat.fontSize = 23;
        editor.editorModule.insertTextInternal(' private', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[1] as TextElementBox;
        expect(editor.spellChecker.checkElementCanBeCombined(element, 11, 0, false)).toBe(false);
    });
    it('Handle combined elements API testing', () => {
        console.log('Handle combined elements API testing');
        editor.openBlank();
        editor.spellChecker.languageID = 1;
        editor.serviceUrl = undefined;
        editor.editorModule.insertTextInternal('par', false);
        editor.selection.characterFormat.fontFamily = 'Calibri Light';
        editor.editorModule.insertTextInternal('agra', false);
        editor.selection.characterFormat.fontSize = 23;
        editor.editorModule.insertTextInternal('ph', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        expect(() => { editor.spellChecker.handleCombinedElements(element, 'paragraph', 0, 0) }).not.toThrowError();
    });
    it('Handle combined elements API testing 1', () => {
        console.log('Handle combined elements API testing 1');
        editor.openBlank();
        editor.spellChecker.languageID = 1;
        editor.serviceUrl = undefined;
        editor.editorModule.insertTextInternal('Empty Txt', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        expect(() => { editor.spellChecker.handleCombinedElements(element, 'Empty Txt', 0, 0) }).not.toThrowError();
    });
    it('Spell check for HandleErrorCollection testing', () => {
        console.log('Spell check for HandleErrorCollection testing');
        editor.openBlank();
        editor.serviceUrl = '';
        editor.spellChecker.allowSpellCheckAndSuggestion = true;
        editor.spellChecker.errorWordCollection.clear();
        editor.editorModule.insertTextInternal('heloSyncfusion', false);
        editor.editorModule.insertTextInternal(' ', false);
        editor.editorModule.insertTextInternal('SpllingErorr', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[2] as TextElementBox;
        editor.spellChecker.errorWordCollection.add('SpllingErorr', [element]);
        editor.spellChecker.ignoreAllItems.push('SpllingErorr');
        editor.spellChecker.handleErrorCollection(element);
        expect(editor.spellChecker.errorWordCollection.length).toBe(0);
    });
    it('Spell check for HandleErrorCollection testing 1', () => {
        console.log('Spell check for HandleErrorCollection testing 1');
        editor.openBlank();
        editor.spellChecker.errorWordCollection.clear();
        editor.editorModule.insertTextInternal('heloSyncfusion', false);
        editor.editorModule.insertTextInternal(' ', false);
        editor.editorModule.insertTextInternal('SpllingErorr', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[2] as TextElementBox;
        expect(editor.spellChecker.handleErrorCollection(element)).toBe(false);
    });
    it('Spell check for ignore once case', () => {
        console.log('Spell check for ignore once case');
        editor.openBlank();
        let start: TextPosition = editor.documentHelper.selection.start;
        editor.editorModule.insertTextInternal('helo', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        editor.documentHelper.selection.start = start;
        editor.documentHelper.selection.end = start;
        editor.spellChecker.manageReplace('Ignore Once');
        expect(element.ignoreOnceItems.length).toBe(1);
    });
    it('Spell check handleAddToDictionary', () => {
        console.log('Spell check handleAddToDictionary');
        editor.openBlank();
        let start: TextPosition = editor.documentHelper.selection.start;
        editor.editorModule.insertTextInternal('Helo world', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        editor.selection.start = start;
        editor.serviceUrl = undefined;
        expect(() => { editor.spellChecker.handleAddToDictionary() }).not.toThrowError();
    });
    it('Spell check suggestion test on context menu', () => {
        console.log('Spell check suggestion test on context menu');
        editor.openBlank();
        editor.editorModule.insertTextInternal('Helo', false);
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': ['Hello', 'Halo', 'Help', 'Helm', 'hide'] };
        editor.spellChecker.handleSuggestions(jsonData);
    });
    it('Spell check for CheckArrayHasSameElement API', () => {
        console.log('Spell check for CheckArrayHasSameElement API');
        editor.openBlank();
        editor.editorModule.insertTextInternal('Helo wrld', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'wrld', element, true, 11, 0, 0);
        expect((lineInfo.line.children[0] as TextElementBox).errorCollection.length).toBe(2);
        expect(editor.spellChecker.checkArrayHasSameElement(element.errorCollection, element.errorCollection[0])).toBe(true);
    });
    it('Spell check CompareTextElementAPI testing', () => {
        console.log('Spell check CompareTextElementAPI testing');
        editor.openBlank();
        editor.editorModule.insertTextInternal('Helo world', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        expect(editor.spellChecker.compareTextElement(element, [element])).toBe(true);
    });
});