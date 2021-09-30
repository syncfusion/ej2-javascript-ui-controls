import { ContextMenu } from '../../../src/document-editor/implementation/context-menu';
import { createElement, L10n } from "@syncfusion/ej2-base";
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { TestHelper } from "../../test-helper.spec";
import { SpellChecker } from "../../../src/document-editor/implementation/spell-check/spell-checker";
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { ParagraphWidget, LineInfo, TextElementBox, TextPosition, ContextElementInfo, LineWidget, ElementInfo, ErrorInfo, SpaceCharacterInfo, SpecialCharacterInfo, ElementBox, WordSpellInfo } from '../../../src';
import { Search, TextSearchResults } from '../../../src/document-editor/implementation/search/index';
import { SpellCheckDialog } from '../../../src/document-editor/implementation/dialogs/spellCheck-dialog';

let data: any = {
    "sections": [
        {
            "blocks": [
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "Spell error sdwewe kdjkjwkewe "
                        },
                        {
                            "name": "_GoBack",
                            "bookmarkType": 0
                        },
                        {
                            "name": "_GoBack",
                            "bookmarkType": 1
                        }
                    ]
                }
            ],
            "headersFooters": {},
            "sectionFormat": {
                "headerDistance": 36.0,
                "footerDistance": 36.0,
                "pageWidth": 612.0,
                "pageHeight": 792.0,
                "leftMargin": 72.0,
                "rightMargin": 72.0,
                "topMargin": 72.0,
                "bottomMargin": 72.0,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "bidi": false,
                "restartPageNumbering": false,
                "pageStartingNumber": 0
            }
        }
    ],
    "characterFormat": {
        "fontSize": 11.0,
        "fontFamily": "Calibri",
        "fontSizeBidi": 11.0,
        "fontFamilyBidi": "Arial"
    },
    "paragraphFormat": {
        "afterSpacing": 8.0,
        "lineSpacing": 1.0791666507720948,
        "lineSpacingType": "Multiple"
    },
    "background": {
        "color": "#FFFFFFFF"
    },
    "styles": [
        {
            "type": "Paragraph",
            "name": "Normal",
            "next": "Normal"
        },
        {
            "type": "Character",
            "name": "Default Paragraph Font"
        }
    ],
    "defaultTabWidth": 36.0,
    "formatting": false,
    "protectionType": "NoProtection",
    "enforcement": false
};
describe('Spell Checker API', () => {
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
    it('Spell check for replace case', () => {
console.log('Spell check for replace case');
        editor.openBlank();
        let start: TextPosition = editor.documentHelper.selection.start;
        editor.editorModule.insertTextInternal('helo', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        editor.documentHelper.selection.start = start;
        editor.documentHelper.selection.end = start;
        editor.spellChecker.manageReplace('hello');
        expect((lineInfo.line.children[0] as TextElementBox).text).toBe('hello');
    });
    it('Spell check for replace case 1', () => {
console.log('Spell check for replace case 1');
        editor.openBlank();
        editor.editorModule.insertTextInternal('Helo world', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        editor.spellChecker.manageReplace('Ignore Once', (lineInfo.line.children[0] as TextElementBox).errorCollection[0]);
        expect((lineInfo.line.children[0] as TextElementBox).ignoreOnceItems.length).toBe(1);
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
    it('Spell module name validation', () => {
console.log('Spell module name validation');
        expect((editor.spellChecker as any).getModuleName()).toBe('SpellChecker');
    });
    it('Spell check find text API test', () => {
console.log('Spell check find text API test');
        editor.openBlank();
        let start: TextPosition = editor.documentHelper.selection.start;
        editor.editorModule.insertTextInternal('Helo Wlcome', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Wlcome', element, true, 11, 0, 0);
        editor.documentHelper.selection.start = start;
        let currentContext: ContextElementInfo = editor.spellChecker.findCurretText();
        expect(currentContext.text).toBe('Wlcome');
        expect(element.errorCollection.length).toBe(2);
    });
    it('Spell check find text API test 1', () => {
console.log('Spell check find text API test 1');
        editor.openBlank();
        let start: TextPosition = editor.documentHelper.selection.start;
        editor.editorModule.insertTextInternal(' ', false);
        editor.editorModule.insertTextInternal('Hello', false);
        editor.documentHelper.selection.start.offset = 1;
        let currentContext: ContextElementInfo = editor.spellChecker.findCurretText();
        expect(currentContext.text).toBe('Hello');
    });
    it('Spell check find text API test 2', () => {
console.log('Spell check find text API test 2');
        editor.openBlank();
        let start: TextPosition = editor.documentHelper.selection.start;
        editor.editorModule.insertTextInternal('Helo', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleWordByWordSpellCheck(jsonData, element, 196, 196, 11, undefined, true);
        editor.documentHelper.selection.start.offset = 0;
        let currentContext: ContextElementInfo = editor.spellChecker.findCurretText();
        expect(currentContext.text).toBe('Helo');
    });
    it('Spell check suggestion test on context menu', () => {
console.log('Spell check suggestion test on context menu');
        editor.openBlank();
        editor.editorModule.insertTextInternal('Helo', false);
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': ['Hello', 'Halo', 'Help', 'Helm', 'hide'] };
        editor.spellChecker.handleSuggestions(jsonData);
    });
    it('Spell check suggestion test on context menu 1', () => {
console.log('Spell check suggestion test on context menu 1');
        editor.openBlank();
        editor.editorModule.insertTextInternal('Helo', false);
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] };
        let suggestions: string[] = editor.spellChecker.handleSuggestions(jsonData);
        expect(suggestions.length).toBe(1);
    });
    it('Spell check retrieveText API test on context menu', () => {
console.log('Spell check retrieveText API test on context menu');
        editor.openBlank();
        let start: TextPosition = editor.documentHelper.selection.start;
        editor.editorModule.insertTextInternal('Helo Wlcome', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Wlcome', element, true, 11, 0, 0);
        editor.documentHelper.selection.start = start;
        editor.spellChecker.currentContextInfo = editor.spellChecker.findCurretText();
        let retrievedText: ContextElementInfo = editor.spellChecker.retriveText();
        expect(retrievedText.text).toBe(editor.spellChecker.currentContextInfo.text);
    });
    it('Spell check replace element with context item', () => {
console.log('Spell check replace element with context item');
        editor.openBlank();
        let start: TextPosition = editor.documentHelper.selection.start;
        editor.editorModule.insertTextInternal('Helo world', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        (lineInfo.line.children[0] as TextElementBox).errorCollection[0].start = editor.documentHelper.selection.start;
        (lineInfo.line.children[0] as TextElementBox).errorCollection[0].end = editor.documentHelper.selection.end;
        editor.spellChecker.currentContextInfo = editor.spellChecker.findCurretText();
        editor.documentHelper.selection.start.offset = 0;
        editor.spellChecker.manageReplace('Hello');
        expect((lineInfo.line.children[0] as TextElementBox).text).toBe('Hello');
    });
    it('Spell check ignore element with context item', () => {
console.log('Spell check ignore element with context item');
        editor.openBlank();
        let start: TextPosition = editor.documentHelper.selection.start;
        editor.editorModule.insertTextInternal('Helo world', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        (lineInfo.line.children[0] as TextElementBox).errorCollection[0].start = editor.documentHelper.selection.start;
        (lineInfo.line.children[0] as TextElementBox).errorCollection[0].end = editor.documentHelper.selection.end;
        editor.spellChecker.currentContextInfo = editor.spellChecker.findCurretText();
        let startInlineObj: ElementInfo = (start.currentWidget as LineWidget).getInline(start.offset, 0, false, true);
        editor.spellChecker.handleIgnoreOnce(startInlineObj);
        expect((lineInfo.line.children[0] as TextElementBox).text).toBe('Helo world');
    });
    it('Spell check handle ignore once testing', () => {
console.log('Spell check handle ignore once testing');
        editor.openBlank();
        let start: TextPosition = editor.documentHelper.selection.start;
        editor.editorModule.insertTextInternal('Helo', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleWordByWordSpellCheck(jsonData, element, 196, 196, 11, undefined, true);
        editor.selection.start.offset = 0;
        editor.spellChecker.currentContextInfo = undefined;
        editor.spellChecker.handleReplace('Ignore Once');
        expect((lineInfo.line.children[0] as TextElementBox).ignoreOnceItems.length).toBe(1);
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
    it('Spell check remove errors from collection', () => {
console.log('Spell check remove errors from collection');
        editor.openBlank();
        editor.spellChecker.errorWordCollection.clear();
        editor.spellChecker.languageID = 1;
        editor.serviceUrl = '';
        editor.spellChecker.allowSpellCheckAndSuggestion = true;
        let start: TextPosition = editor.documentHelper.selection.start;
        editor.editorModule.insertTextInternal('Helo world', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        (lineInfo.line.children[0] as TextElementBox).errorCollection[0].start = editor.documentHelper.selection.start;
        (lineInfo.line.children[0] as TextElementBox).errorCollection[0].end = editor.documentHelper.selection.end;
        editor.spellChecker.currentContextInfo = editor.spellChecker.findCurretText();
        editor.spellChecker.removeErrorsFromCollection(editor.spellChecker.currentContextInfo);
        expect(editor.spellChecker.errorWordCollection.length).toBe(0);
    });
    it('Spell check ManageSpecial character API testing', () => {
console.log('Spell check ManageSpecial character API testing');
        editor.openBlank();
        let text: string = editor.spellChecker.manageSpecialCharacters(',&helo*#', undefined, true);
        expect(text).toBe('helo');
    });
    it('Spell check ManageSpecial character API testing 1', () => {
console.log('Spell check ManageSpecial character API testing 1');
        editor.openBlank();
        let text: string = editor.spellChecker.manageSpecialCharacters(',&helo*#', 'helo', false);
        expect(text).toBe(',&helo');
    });
    it('Spell check CheckTextElementError API testing', () => {
console.log('Spell check CheckTextElementError API testing');
        editor.openBlank();
        let start: TextPosition = editor.documentHelper.selection.start;
        editor.editorModule.insertTextInternal('Helo world', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        lineInfo.line.children[0].ischangeDetected = true;
        let errorInfo: ErrorInfo = editor.spellChecker.checktextElementHasErrors((lineInfo.line.children[0] as TextElementBox).text, lineInfo.line.children[0], 96);
        expect(errorInfo.errorFound).toBe(false);

    });
    it('Spell check CheckTextElementError API testing 1', () => {
console.log('Spell check CheckTextElementError API testing 1');
        editor.openBlank();
        let start: TextPosition = editor.documentHelper.selection.start;
        editor.editorModule.insertTextInternal('Helo world', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        let errorInfo: ErrorInfo = editor.spellChecker.checktextElementHasErrors((lineInfo.line.children[0] as TextElementBox).text, lineInfo.line.children[0], 96);
        expect(errorInfo.errorFound).toBe(true);
    });
    it('Spell check CheckTextElementError API testing 2', () => {
console.log('Spell check CheckTextElementError API testing 2');
        editor.openBlank();
        editor.editorModule.insertTextInternal('Helo', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleWordByWordSpellCheck(jsonData, element, 196, 196, 11, undefined, true);
        lineInfo.line.children[0].paragraph.isChangeDetected = true;
        editor.spellChecker.checktextElementHasErrors((lineInfo.line.children[0] as TextElementBox).text, lineInfo.line.children[0], 96);
        expect(lineInfo.line.children[0].ischangeDetected).toBe(true);
    });
//     it('Spell check add error collection API testing', () => {
// console.log('Spell check add error collection API testing');
//         editor.openBlank();
//         editor.editorModule.insertTextInternal('Helo', false);
//         let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
//         let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
//         let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
//         let jsonData: any = { "HasSpellingError": true, "Suggestions": [] }
//         editor.spellChecker.handleWordByWordSpellCheck(jsonData, element, 196, 196, 11, undefined, true);
//         editor.editorModule.insertTextInternal('Helo', false);
//         let textElement: TextElementBox = lineInfo.line.children[1] as TextElementBox;
//         editor.spellChecker.handleWordByWordSpellCheck(jsonData, element, 196, 196, 11, undefined, true);
//         expect(editor.spellChecker.errorWordCollection.length).toBe(2);
//     });
    it('Spell check checkNextError API testing', () => {
console.log('Spell check checkNextError API testing');
        editor.openBlank();
        editor.spellChecker.errorWordCollection.clear();
        editor.editorModule.insertTextInternal('Helo', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, "Suggestions": ['Hello', 'Halo', 'Help'] }
        editor.spellChecker.handleWordByWordSpellCheck(jsonData, element, 196, 196, 11, undefined, true);
        editor.serviceUrl = undefined;
        editor.spellCheckDialog.localValue = new L10n('documenteditor', editor.defaultLocale);
        editor.spellCheckDialog.localValue.setLocale(editor.locale);
        expect(() => { editor.spellChecker.checkForNextError() }).not.toThrowError();
    });
    it('Spell check checkNextError API testing 1', () => {
console.log('Spell check checkNextError API testing 1');
        editor.openBlank();
        editor.spellChecker.errorWordCollection.clear();
        editor.editorModule.insertTextInternal('Syncfusion company', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, "Suggestions": ['sync', 'fusion'] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Syncfusion', element, true, 11, 0, 0);
        expect(() => { editor.spellChecker.checkForNextError() }).not.toThrowError();
    });
    it('Spell check on trigger ContextMenu', () => {
console.log('Spell check on trigger ContextMenu');
        editor.openBlank();
        editor.editorModule.insertTextInternal('Helo', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, "Suggestions": [] }
        editor.spellChecker.handleWordByWordSpellCheck(jsonData, element, 196, 196, 11, undefined, true);
        expect(() => { editor.contextMenu.onContextMenuInternal(new PointerEvent('context')) }).not.toThrowError();
    });
    it('Spell check handle Context Item', () => {
console.log('Spell check handle Context Item');
        editor.openBlank();
        let start: TextPosition = editor.documentHelper.selection.start;
        editor.editorModule.insertTextInternal('Helo world', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'Helo', element, true, 11, 0, 0);
        editor.documentHelper.selection.start.offset = 0;
        let item: string = editor.element.id + '_contextmenu_otherSuggestions_spellcheck_';
        expect(() => { editor.contextMenu.handleContextMenuItem(item) }).not.toThrowError();
        editor.serviceUrl = '';
        editor.spellChecker.allowSpellCheckAndSuggestion = true;
    });
    it('Spell check on trigger ContextMenu ', () => {
console.log('Spell check on trigger ContextMenu ');
        editor.openBlank();
        editor.serviceUrl = '';
        editor.spellChecker.allowSpellCheckAndSuggestion = true;
        expect(() => { editor.contextMenu.onContextMenuInternal(new PointerEvent('context')) }).not.toThrowError();
    });
    it('Spell check Construct context menu testing', () => {
console.log('Spell check Construct context menu testing');
        editor.openBlank();
        let jsonData: any = { 'HasSpellingError': true, 'Suggestions': ['Hello', 'Halo', 'Help'] };
        let spellingSuggestion: any = ['Add To Dicitonary', 'Ignore All'];
        let suggestions: any[] = editor.contextMenu.constructContextmenu(jsonData.Suggestions, spellingSuggestion);
        expect(suggestions.length).toBe(11);
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
    it('Spell check WhiteSpace testing', () => {
console.log('Spell check WhiteSpace testing');
        editor.openBlank();
        editor.editorModule.insertTextInternal(' hello ', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let spaceCharacterInfo: SpaceCharacterInfo = editor.spellChecker.getWhiteSpaceCharacterInfo(element.text, element.characterFormat);
        expect(spaceCharacterInfo.wordLength).toBe(1);
    });
    it('Spell check specialCharacter testing', () => {
console.log('Spell check specialCharacter testing');
        editor.openBlank();
        editor.editorModule.insertTextInternal('#!hello*&', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let specialInfo: SpecialCharacterInfo = editor.spellChecker.getSpecialCharactersInfo(element.text, element.characterFormat);
        expect(Math.round(specialInfo.beginningWidth)).toBe(12);
    });
    it('Spell check specialCharacter testing', () => {
console.log('Spell check specialCharacter testing');
        editor.openBlank();
        editor.editorModule.insertTextInternal('[hello]', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let pattern = editor.searchModule.textSearch.stringToRegex('[hello]', 'None');
        let searchResult: TextSearchResults = editor.searchModule.textSearch.findAll(pattern, undefined, '0;0;0;0;0;0');
        expect(searchResult.length).toBe(1);
    });
    it('Spell check retrieve element API testing', () => {
console.log('Spell check retrieve element API testing');
        editor.openBlank();
        editor.editorModule.insertTextInternal('hello', false);
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let elementInfo: ElementInfo = lineInfo.line.getInline(0, 0);
        expect(() => { editor.spellChecker.retrieveExactElementInfo(elementInfo) }).not.toThrowError();
    });
    it('Spell checked unique count', () => {
console.log('Spell checked unique count');
        editor.open(data)
        editor.spellChecker.uniqueWordsCount = 10;
        editor.spellChecker.clearCache();
        editor.spellChecker.enableOptimizedSpellCheck = true;
        let data1: string = '{"SpellCollection":[{"Text":"Spell","HasSpellError":false},{"Text":"error","HasSpellError":false},{"Text":"sdwewe","HasSpellError":true},{"Text":"kdjkjwkewe","HasSpellError":true}],"HasSpellingError":true,"Suggestions":null}';
        let jsonObject: any = JSON.parse(data1);
        editor.spellChecker.updateUniqueWords(jsonObject.SpellCollection);
        jsonObject = JSON.parse(localStorage.getItem(editor.spellChecker.uniqueKey));
        expect(Object.keys(jsonObject).length).toBe(4);
    });
    it('Spell check by page content', () => {
console.log('Spell check by page content');
        editor.open(data);
        let wordSpec: WordSpellInfo = editor.spellChecker.checkSpellingInPageInfo('error')
        expect(wordSpec.hasSpellError).toBe(false);
        expect(wordSpec.isElementPresent).toBe(true);
    });
    it('Remove underline API validation', () => {
console.log('Remove underline API validation');
        editor.openBlank();
        editor.editor.insertText('AdventureWorks')
        editor.spellChecker.removeUnderline = false;
        let wordSpec: WordSpellInfo = editor.spellChecker.checkSpellingInPageInfo('AdventureWorks');
        expect(wordSpec.hasSpellError).toBe(false);
        expect(editor.spellChecker.removeUnderline).toBe(false)
    });
    //     let markIndex: number = element.line.getOffset(element, 0);
    // eslint-disable-next-line
    //     editor.searchModule.textSearch.updateMatchedTextLocation(matchResults.matches, results, matchResults.elementInfo, 0,element , false, null, markIndex);  
    // });
});

let findText:any={"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"textAlignment":"Left","lineSpacing":14.25,"lineSpacingType":"AtLeast","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"This sction elains the stps to create a Word document editor within your applati"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"on and demonstrates the sction"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":" "},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"This sction elains the stps to create a Word document editor within your applati"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"on and demonstrates the sction"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":" "},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"This sction elains the stps to create a Word dsccsscocument editor within your a"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"p"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"p"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"l"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"a"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"t"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"i"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"on and demonstrates the sction"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":" "},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"This sction elains the stps to create a Word document editor within your applati"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"on and demonstrates the sction"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":" "},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"This sction elains the stps to create a Word document editor within your applati"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"on and demonstrates the sction"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":" "},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"This sction elains the stps to create a Word document editor within your applati"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"on and demonstrates the sction"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":" "},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"This sction elains the stps to create a Word document editor within your applati"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"on and demonstrates the sction"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":" "},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"This sction elains the stps to create a Word document editor within your applati"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"on and demonstrates the sction"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":" "},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"This sction elains the stps to create a Word document editor within your applati"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"on and demonstrates the sction"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":" "},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"This sction elains the stps to create a Word document editor within your applati"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"on and demonstrates the sction"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":" "},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"This sction elains the stps to create a Word document editor within your applati"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"on and demonstrates the sction"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":" "},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"This sction elains the stps to create a Word document editor within your applati"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"on and demonstrates the sction"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":" "},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"This sction elains the stps to create a Word document editor within your applati"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"on and demonstrates the sction"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":" "},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"This sction elains the stps to create a Word document editor within your applati"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"on and demonstrates the sction"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":" "},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"This sction elains the stps to create a Word document editor within your applati"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"on and demonstrates the sction"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":" "},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"This sction elains the stps to create a Word document editor within your applati"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":"on and demonstrates the sction"},{"characterFormat":{"bold":false,"fontSize":10.526315689086914,"fontFamily":"consolas","fontColor":"#A31515FF","boldBidi":false,"fontFamilyBidi":"consolas"},"text":" "}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenHeader":{},"evenFooter":{},"firstPageHeader":{},"firstPageFooter":{}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[]};
describe('Find validation when spell check enabled', () => {
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
        editor.open(JSON.stringify(findText));
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
    it('Find validation', () => {
console.log('Find validation');
        let paragraph: ParagraphWidget = editor.documentHelper.selection.start.paragraph;
        let lineInfo: LineInfo = editor.documentHelper.selection.getLineInfo(paragraph, 0);
        let element: TextElementBox = lineInfo.line.children[0] as TextElementBox;
        let jsonData: any = { "HasSpellingError": true, 'Suggestions': [] }
        editor.spellChecker.handleSplitWordSpellCheck(jsonData, 'sction', element, true, 11, 0, 0);
        editor.search.findAll('This');
        expect(editor.selection.start.paragraph.index).toBe(0);
        editor.search.findAll('This');
        expect(editor.search.textSearchResults.length).not.toBe(0);
    });
    it('Check uniqueWordcount validation', () => {
console.log('Check uniqueWordcount validation');
        expect(editor.spellChecker.uniqueWordsCount).toBe(15000);
    });
});
