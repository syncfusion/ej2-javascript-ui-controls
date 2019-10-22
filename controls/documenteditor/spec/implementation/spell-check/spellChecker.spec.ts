import { ContextMenu } from '../../../src/document-editor/implementation/context-menu';
import { createElement, L10n } from "@syncfusion/ej2-base";
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { TestHelper } from "../../test-helper.spec";
import { SpellChecker } from "../../../src/document-editor/implementation/spell-check/spell-checker";
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { ParagraphWidget, LineInfo, TextElementBox, TextPosition, ContextElementInfo, LineWidget, ElementInfo, ErrorInfo, SpaceCharacterInfo, SpecialCharacterInfo, ElementBox } from '../../../src';
import { Search, TextSearchResults } from '../../../src/document-editor/implementation/search/index';
import { SpellCheckDialog } from '../../../src/document-editor/implementation/dialogs/spellCheck-dialog';

describe('Spell Checker API', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1100px;height:700px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ContextMenu, SpellChecker, Search, SpellCheckDialog);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, enableContextMenu: true, enableSpellCheck: true, enableSearch: true, isReadOnly: false });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Spell check for Handle IgnoreAll API testing', () => {
        editor.openBlank();
        editor.spellChecker.ignoreAllItems = [];
        editor.spellChecker.errorWordCollection.clear();
        editor.editorModule.insertTextInternal('heloSyncfusion', false);
        editor.selection.start.offset = 0;
        editor.spellChecker.handleIgnoreAllItems();
        expect(editor.spellChecker.ignoreAllItems.length).toBe(1);
    });
    it('Spell check for Handle IgnoreAll API testing 1', () => {
        editor.openBlank();
        editor.spellChecker.ignoreAllItems = [];
        editor.spellChecker.errorWordCollection.clear();
        editor.editorModule.insertTextInternal('heloSyncfusion', false);
        editor.selection.start.offset = 0;
        editor.spellChecker.handleIgnoreAllItems(editor.spellChecker.findCurretText());
        expect(editor.spellChecker.ignoreAllItems.length).toBe(1);
    });
    it('Error count testing single word', () => {
        editor.editorModule.insertTextInternal('Syncfusion', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, "Suggestions": [] }
        editor.spellChecker.handleWordByWordSpellCheck(jsonData, element, 196, 196, 11, undefined, true);
        expect(editor.spellChecker.errorWordCollection.length).toBe(1);
    });
    it('Error count testing for words in a line', () => {
        editor.openBlank();
        editor.editorModule.insertTextInternal('This sction elains the stps to create a Word document editor within your applation and demonstrates the sction', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'sction', element, true, 11, 0, 0);
        expect(editor.spellChecker.errorWordCollection.get('sction').length).toBe(element.errorCollection.length);
    });
    it('Error count testing for words in a line for combination', () => {
        editor.openBlank();
        editor.spellChecker.languageID = 1;
        editor.serviceUrl='';
        editor.spellChecker.allowSpellCheckAndSuggestion = true;
        editor.editorModule.insertTextInternal('par', false);
        editor.selection.characterFormat.fontFamily = 'Calibri Light';
        editor.editorModule.insertTextInternal('agra', false);
        editor.selection.characterFormat.fontSize = 23;
        editor.editorModule.insertTextInternal('ph', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        expect(editor.spellChecker.checkElementCanBeCombined(element, 11, 0, false)).toBe(true);
        element = lineInfo.line.children[2] as TextElementBox;
        expect(editor.spellChecker.checkElementCanBeCombined(element, 11, 0, false)).toBe(true);
    });
    it('Spell check combination testing 1', () => {
        editor.openBlank();
        editor.spellChecker.languageID = 1;
        editor.serviceUrl='';
        editor.spellChecker.allowSpellCheckAndSuggestion = true;
        editor.editorModule.insertTextInternal('par', false);
        editor.selection.characterFormat.fontFamily = 'Calibri Light';
        editor.editorModule.insertTextInternal('agra', false);
        editor.selection.characterFormat.fontSize = 23;
        editor.editorModule.insertTextInternal('ph', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        (lineInfo.line.children[0] as TextElementBox).istextCombined = true;
        (lineInfo.line.children[1] as TextElementBox).istextCombined = true;
        (lineInfo.line.children[2] as TextElementBox).istextCombined = true;
        let element: TextElementBox = lineInfo.line.children[2] as TextElementBox;
        let retrievedElement: ElementBox = editor.spellChecker.getCombinedElement(element);
        expect((retrievedElement as TextElementBox).text).toBe('par');
    });
    it('Error count testing for words in a line for combination 1', () => {
        editor.openBlank();
        editor.spellChecker.languageID = 1;
        editor.serviceUrl='';
        editor.spellChecker.allowSpellCheckAndSuggestion = true;
        editor.editorModule.insertTextInternal('Syncfusion ', false);
        editor.selection.characterFormat.fontFamily = 'Calibri Light';
        editor.editorModule.insertTextInternal('software', false);
        editor.selection.characterFormat.fontSize = 23;
        editor.editorModule.insertTextInternal(' private', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[1] as TextElementBox;
        expect(editor.spellChecker.checkElementCanBeCombined(element, 11, 0, false)).toBe(false);
    });
    it('Handle combined elements API testing', () => {
        editor.openBlank();
        editor.spellChecker.languageID = 1;
        editor.serviceUrl = undefined;
        editor.editorModule.insertTextInternal('par', false);
        editor.selection.characterFormat.fontFamily = 'Calibri Light';
        editor.editorModule.insertTextInternal('agra', false);
        editor.selection.characterFormat.fontSize = 23;
        editor.editorModule.insertTextInternal('ph', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        expect(() => { editor.spellChecker.handleCombinedElements(element,'paragraph', 0, 0)}).not.toThrowError();
    });
    it('Handle combined elements API testing 1', () => {
        editor.openBlank();
        editor.spellChecker.languageID = 1;
        editor.serviceUrl= undefined;
        editor.editorModule.insertTextInternal('Empty Txt', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        expect(() => { editor.spellChecker.handleCombinedElements(element,'Empty Txt', 0, 0)}).not.toThrowError();
    });
    it('Spell check for HandleErrorCollection testing', () => {
        editor.openBlank();
        editor.serviceUrl='';
        editor.spellChecker.allowSpellCheckAndSuggestion = true;
        editor.spellChecker.errorWordCollection.clear();
        editor.editorModule.insertTextInternal('heloSyncfusion', false);
        editor.editorModule.insertTextInternal(' ', false);
        editor.editorModule.insertTextInternal('SpllingErorr', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[2] as TextElementBox;
        editor.spellChecker.errorWordCollection.add('SpllingErorr', [element]);
        editor.spellChecker.ignoreAllItems.push('SpllingErorr');
        editor.spellChecker.handleErrorCollection(element);
        expect(editor.spellChecker.errorWordCollection.length).toBe(0);
    });
    it('Spell check for HandleErrorCollection testing 1', () => {
        editor.openBlank();
        editor.spellChecker.errorWordCollection.clear();
        editor.editorModule.insertTextInternal('heloSyncfusion', false);
        editor.editorModule.insertTextInternal(' ', false);
        editor.editorModule.insertTextInternal('SpllingErorr', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[2] as TextElementBox;
        expect(editor.spellChecker.handleErrorCollection(element)).toBe(false);
    });
    it('Spell check for replace case', () => {
        editor.openBlank();
        let start: TextPosition = editor.viewer.selection.start;
        editor.editorModule.insertTextInternal('helo', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        editor.viewer.selection.start = start;
        editor.viewer.selection.end = start;
        editor.spellChecker.manageReplace('hello');
        expect((lineInfo.line.children[0] as TextElementBox).text).toBe('hello');
    });
    it('Spell check for replace case 1', () => {
        editor.openBlank();
        editor.editorModule.insertTextInternal('Helo world', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        editor.spellChecker.manageReplace('Ignore Once', (lineInfo.line.children[0] as TextElementBox).errorCollection[0]);
        expect((lineInfo.line.children[0] as TextElementBox).ignoreOnceItems.length).toBe(1);
    });
    it('Spell check for CheckArrayHasSameElement API', () => {
        editor.openBlank();
        editor.editorModule.insertTextInternal('Helo wrld', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'wrld', element, true, 11, 0, 0);
        expect((lineInfo.line.children[0] as TextElementBox).errorCollection.length).toBe(2);
        expect(editor.spellChecker.CheckArrayHasSameElement(element.errorCollection,element.errorCollection[0])).toBe(true);
    });
    it('Spell check for ignore once case', () => {
        editor.openBlank();
        let start: TextPosition = editor.viewer.selection.start;
        editor.editorModule.insertTextInternal('helo', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        editor.viewer.selection.start = start;
        editor.viewer.selection.end = start;
        editor.spellChecker.manageReplace('Ignore Once');
        expect(element.ignoreOnceItems.length).toBe(1);
    });
    it('Spell module name validation', () => {
        expect((editor.spellChecker as any).getModuleName()).toBe('SpellChecker');
    });
    it('Spell check find text API test', () => {
        editor.openBlank();
        let start: TextPosition = editor.viewer.selection.start;
        editor.editorModule.insertTextInternal('Helo Wlcome', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Wlcome', element, true, 11, 0, 0);
        editor.viewer.selection.start = start;
        let currentContext: ContextElementInfo = editor.spellChecker.findCurretText();
        expect(currentContext.text).toBe('Wlcome');
        expect(element.errorCollection.length).toBe(2);
    });
    it('Spell check find text API test 1', () => {
        editor.openBlank();
        let start: TextPosition = editor.viewer.selection.start;
        editor.editorModule.insertTextInternal(' ', false);
        editor.editorModule.insertTextInternal('Hello', false);
        editor.viewer.selection.start.offset = 1;
        let currentContext: ContextElementInfo = editor.spellChecker.findCurretText();
        expect(currentContext.text).toBe('Hello');
    });
    it('Spell check find text API test 2', () => {
        editor.openBlank();
        let start: TextPosition = editor.viewer.selection.start;
        editor.editorModule.insertTextInternal('Helo', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleWordByWordSpellCheck(jsonData, element, 196, 196, 11, undefined, true);
        editor.viewer.selection.start.offset = 0;
        let currentContext: ContextElementInfo = editor.spellChecker.findCurretText();
        expect(currentContext.text).toBe('Helo');
    });
    it('Spell check suggestion test on context menu', () => {
        editor.openBlank();
        editor.editorModule.insertTextInternal('Helo', false);
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': ['Hello', 'Halo', 'Help', 'Helm', 'hide'] };
        editor.spellChecker.handleSuggestions(jsonData);
    });
    it('Spell check suggestion test on context menu 1', () => {
        editor.openBlank();
        editor.editorModule.insertTextInternal('Helo', false);
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] };
        let suggestions: string[] = editor.spellChecker.handleSuggestions(jsonData);
        expect(suggestions.length).toBe(1);
    });
    it('Spell check retrieveText API test on context menu', () => {
        editor.openBlank();
        let start: TextPosition = editor.viewer.selection.start;
        editor.editorModule.insertTextInternal('Helo Wlcome', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Wlcome', element, true, 11, 0, 0);
        editor.viewer.selection.start = start;
        editor.spellChecker.currentContextInfo = editor.spellChecker.findCurretText();
        let retrievedText: ContextElementInfo = editor.spellChecker.retriveText();
        expect(retrievedText.text).toBe(editor.spellChecker.currentContextInfo.text);
    });
    it('Spell check replace element with context item', () => {
        editor.openBlank();
        let start: TextPosition = editor.viewer.selection.start;
        editor.editorModule.insertTextInternal('Helo world', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        (lineInfo.line.children[0] as TextElementBox).errorCollection[0].start = editor.viewer.selection.start;
        (lineInfo.line.children[0] as TextElementBox).errorCollection[0].end = editor.viewer.selection.end;
        editor.spellChecker.currentContextInfo = editor.spellChecker.findCurretText();
        editor.viewer.selection.start.offset = 0;
        editor.spellChecker.manageReplace('Hello');
        expect((lineInfo.line.children[0] as TextElementBox).text).toBe('Hello');
    });
    it('Spell check ignore element with context item', () => {
        editor.openBlank();
        let start: TextPosition = editor.viewer.selection.start;
        editor.editorModule.insertTextInternal('Helo world', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        (lineInfo.line.children[0] as TextElementBox).errorCollection[0].start = editor.viewer.selection.start;
        (lineInfo.line.children[0] as TextElementBox).errorCollection[0].end = editor.viewer.selection.end;
        editor.spellChecker.currentContextInfo = editor.spellChecker.findCurretText();
        let startInlineObj: ElementInfo = (start.currentWidget as LineWidget).getInline(start.offset, 0, false, true);
        editor.spellChecker.handleIgnoreOnce(startInlineObj);
        expect((lineInfo.line.children[0] as TextElementBox).text).toBe('Helo world');
    });
    it('Spell check handle ignore once testing', () => {
        editor.openBlank();
        let start: TextPosition = editor.viewer.selection.start;
        editor.editorModule.insertTextInternal('Helo', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleWordByWordSpellCheck(jsonData, element, 196, 196, 11, undefined, true);
        editor.selection.start.offset = 0;
        editor.spellChecker.currentContextInfo = undefined;
        editor.spellChecker.handleReplace('Ignore Once');
        expect((lineInfo.line.children[0] as TextElementBox).ignoreOnceItems.length).toBe(1);
    });
    it('Spell check handleAddToDictionary', () => {
        editor.openBlank();
        let start: TextPosition = editor.viewer.selection.start;
        editor.editorModule.insertTextInternal('Helo world', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        editor.selection.start = start;
        editor.serviceUrl = undefined;
        expect(() => { editor.spellChecker.handleAddToDictionary() }).not.toThrowError();
    });
    it('Spell check remove errors from collection', () => {
        editor.openBlank();
        editor.spellChecker.errorWordCollection.clear();
        editor.spellChecker.languageID = 1;
        editor.serviceUrl='';
        editor.spellChecker.allowSpellCheckAndSuggestion = true;
        let start: TextPosition = editor.viewer.selection.start;
        editor.editorModule.insertTextInternal('Helo world', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        (lineInfo.line.children[0] as TextElementBox).errorCollection[0].start = editor.viewer.selection.start;
        (lineInfo.line.children[0] as TextElementBox).errorCollection[0].end = editor.viewer.selection.end;
        editor.spellChecker.currentContextInfo = editor.spellChecker.findCurretText();
        editor.spellChecker.removeErrorsFromCollection(editor.spellChecker.currentContextInfo);
        expect(editor.spellChecker.errorWordCollection.length).toBe(0);
    });
    it('Spell check ManageSpecial character API testing', () => {
        editor.openBlank();
        let text: string = editor.spellChecker.manageSpecialCharacters(',&helo*#', undefined, true);
        expect(text).toBe('helo');
    });
    it('Spell check ManageSpecial character API testing 1', () => {
        editor.openBlank();
        let text: string = editor.spellChecker.manageSpecialCharacters(',&helo*#', 'helo', false);
        expect(text).toBe(',&helo*#');
    });
    it('Spell check CheckTextElementError API testing', () => {
        editor.openBlank();
        let start: TextPosition = editor.viewer.selection.start;
        editor.editorModule.insertTextInternal('Helo world', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        lineInfo.line.children[0].ischangeDetected = true;
        let errorInfo: ErrorInfo = editor.spellChecker.checktextElementHasErrors((lineInfo.line.children[0] as TextElementBox).text, lineInfo.line.children[0], 96);
        expect(errorInfo.errorFound).toBe(false);

    });
    it('Spell check CheckTextElementError API testing 1', () => {
        editor.openBlank();
        let start: TextPosition = editor.viewer.selection.start;
        editor.editorModule.insertTextInternal('Helo world', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        let errorInfo: ErrorInfo = editor.spellChecker.checktextElementHasErrors((lineInfo.line.children[0] as TextElementBox).text, lineInfo.line.children[0], 96);
        expect(errorInfo.errorFound).toBe(true);
    });
    it('Spell check CheckTextElementError API testing 2', () => {
        editor.openBlank();
        editor.editorModule.insertTextInternal('Helo', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleWordByWordSpellCheck(jsonData, element, 196, 196, 11, undefined, true);
        lineInfo.line.children[0].paragraph.isChangeDetected = true;
        editor.spellChecker.checktextElementHasErrors((lineInfo.line.children[0] as TextElementBox).text, lineInfo.line.children[0], 96);
        expect(lineInfo.line.children[0].ischangeDetected).toBe(true);
    });
    it('Spell check add error collection API testing', () => {
        editor.openBlank();
        editor.editorModule.insertTextInternal('Helo', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, "Suggestions": [] }
        editor.spellChecker.handleWordByWordSpellCheck(jsonData, element, 196, 196, 11, undefined, true);
        editor.editorModule.insertTextInternal('Helo', false);
        let textElement: TextElementBox = lineInfo.line.children[1] as TextElementBox;
        editor.spellChecker.handleWordByWordSpellCheck(jsonData, element, 196, 196, 11, undefined, true);
        expect(editor.spellChecker.errorWordCollection.length).toBe(2);
    });
    it('Spell check checkNextError API testing', () => {
        editor.openBlank();
        editor.spellChecker.errorWordCollection.clear();
        editor.editorModule.insertTextInternal('Helo', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, "Suggestions": ['Hello', 'Halo', 'Help'] }
        editor.spellChecker.handleWordByWordSpellCheck(jsonData, element, 196, 196, 11, undefined, true);
        editor.serviceUrl = undefined;
        editor.spellCheckDialog.localValue = new L10n('documenteditor', editor.defaultLocale);
        editor.spellCheckDialog.localValue.setLocale(editor.locale);
        expect(() => { editor.spellChecker.checkForNextError() }).not.toThrowError();
    });
    it('Spell check checkNextError API testing 1', () => {
        editor.openBlank();
        editor.spellChecker.errorWordCollection.clear();
        editor.editorModule.insertTextInternal('Syncfusion company', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, "Suggestions": ['sync', 'fusion'] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Syncfusion', element, true, 11, 0, 0);
        expect(() => { editor.spellChecker.checkForNextError() }).not.toThrowError();
    });
    it('Spell check on trigger ContextMenu', () => {
        editor.openBlank();
        editor.editorModule.insertTextInternal('Helo', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, "Suggestions": [] }
        editor.spellChecker.handleWordByWordSpellCheck(jsonData, element, 196, 196, 11, undefined, true);
        expect(() => { editor.contextMenu.onContextMenuInternal(new PointerEvent('context')) }).not.toThrowError();
    });
    it('Spell check handle Context Item', () => {
        editor.openBlank();
        let start: TextPosition = editor.viewer.selection.start;
        editor.editorModule.insertTextInternal('Helo world', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        editor.viewer.selection.start.offset = 0;
        let item: string = editor.element.id + '_contextmenu_otherSuggestions_spellcheck_';
        expect(() => { editor.contextMenu.handleContextMenuItem(item) }).not.toThrowError();
        editor.serviceUrl='';
        editor.spellChecker.allowSpellCheckAndSuggestion = true;
    });
    it('Spell check on trigger ContextMenu ', () => {
        editor.openBlank();
        editor.serviceUrl='';
        editor.spellChecker.allowSpellCheckAndSuggestion = true;
        expect(() => { editor.contextMenu.onContextMenuInternal(new PointerEvent('context')) }).not.toThrowError();
    });
    it('Spell check Construct context menu testing', () => {
        editor.openBlank();
        let jsonData: any = { 'HasSpellingError': true, 'Suggestions': ['Hello', 'Halo', 'Help'] };
        let spellingSuggestion: any = ['Add To Dicitonary', 'Ignore All'];
        let suggestions: any[] = editor.contextMenu.constructContextmenu(jsonData.Suggestions, spellingSuggestion);
        expect(suggestions.length).toBe(11);
    });
    it('Spell check CompareTextElementAPI testing', () => {
        editor.openBlank();
        editor.editorModule.insertTextInternal('Helo world', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        expect(editor.spellChecker.compareTextElement(element,[element])).toBe(true);
    });
    it('Spell check WhiteSpace testing', () => {
        editor.openBlank();
        editor.editorModule.insertTextInternal(' hello ', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let spaceCharacterInfo: SpaceCharacterInfo = editor.spellChecker.getWhiteSpaceCharacterInfo(element.text, element.characterFormat);
        expect(spaceCharacterInfo.wordLength).toBe(1);
    });
    it('Spell check specialCharacter testing', () => {
        editor.openBlank();
        editor.editorModule.insertTextInternal('#!hello*&', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let specialInfo: SpecialCharacterInfo = editor.spellChecker.getSpecialCharactersInfo(element.text, element.characterFormat);
        expect(Math.round(specialInfo.beginningWidth)).toBe(12);
    });
    it('Spell check specialCharacter testing', () => {
        editor.openBlank();
        editor.editorModule.insertTextInternal('[hello]', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let pattern = editor.searchModule.textSearch.stringToRegex('[hello]', 'None');
        let searchResult: TextSearchResults = editor.searchModule.textSearch.findAll(pattern, undefined, '0;0;0;0;0;0');
        expect(searchResult.length).toBe(1);
    });
    it('Spell check retrieve element API testing', () => {
        editor.openBlank();
        editor.editorModule.insertTextInternal('hello', false);
        let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
        let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let elementInfo: ElementInfo = lineInfo.line.getInline(0, 0);
        expect(() => { editor.spellChecker.retrieveExactElementInfo(elementInfo)}).not.toThrowError();
    });
    // it('Spell check text search result',() => {
    //     editor.openBlank();
    //     editor.editorModule.insertText('Helo world', false);
    //     editor.editorModule.insertText(' ', false);
    //     editor.editorModule.insertText('Helo world', false);
    //     let paragraph: ParagraphWidget = editor.viewer.selection.start.paragraph;
    //     let lineInfo: LineInfo = editor.viewer.selection.getLineInfo(paragraph, 0);
    //     let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
    //     let matchResults: MatchResults = this.getMatchedResultsFromElement(element);
    //     let results: TextSearchResults = matchResults.textResults;
    //     let markIndex: number = element.line.getOffset(element, 0);
    //     // tslint:disable-next-line:max-line-length
    //     editor.searchModule.textSearch.updateMatchedTextLocation(matchResults.matches, results, matchResults.elementInfo, 0,element , false, null, markIndex);  
    // });
});
