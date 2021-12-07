import { LayoutViewer, PageLayoutViewer, DocumentHelper } from '../../src/index';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { TextSearch } from '../../src/document-editor/implementation/search/text-search';
import { TextSearchResult } from '../../src/document-editor/implementation/search/text-search-result';
import { TestHelper } from '../test-helper.spec';
import { OptionsPane } from '../../src/index';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { Search } from '../../src/document-editor/implementation/search/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/index';
function getEventObject(eventType: string, eventName: string): Object {
    let event: any = document.createEvent(eventType);
    event.initEvent(eventName, true, true);
    let object: any = extend({}, event);
    object.preventDefault = () => { return true; };
    return object;
}
function getJson() {
    let json = {
        "sections": [
            {
                "blocks": [
                    {
                        "characterFormat": {
                            "bold": false,
                            "italic": false,
                            "strikethrough": "None",
                            "baselineAlignment": "Normal",
                            "fontSize": 12,
                            "fontFamily": "Calibri",
                            "fontColor": "#FF000000"
                        },
                        "paragraphFormat": {
                            "leftIndent": 36,
                            "rightIndent": 0,
                            "firstLineIndent": 0,
                            "beforeSpacing": 0,
                            "afterSpacing": 8,
                            "lineSpacing": 1.149999976158142,
                            "lineSpacingType": "Multiple",
                            "textAlignment": "left"
                        },
                        "inlines": [
                            {
                                "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company.",
                                "characterFormat": {
                                    "bold": false,
                                    "italic": false,
                                    "underline": "None",
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 12,
                                    "fontFamily": "Calibri",
                                    "fontColor": "#FF000000"
                                }
                            },
                            {
                                "text": "The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets.While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.",
                                "characterFormat": {
                                    "bold": false,
                                    "italic": false,
                                    "underline": "None",
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 12,
                                    "fontFamily": "Calibri",
                                    "fontColor": "#FF000000"
                                }
                            },
                            {
                                "text": "In 2000, Adventure Works Cycles bought a small manufacturing plant, Importadores Neptuno, located in Mexico. Importadores Neptuno manufactures several critical subcomponents for the Adventure Works Cycles product line. These subcomponents are shipped to the Bothell location for final product assembly. In 2001, Importadores Neptuno, became the sole manufacturer and distributor of the touring bicycle product group.",
                                "characterFormat": {
                                    "bold": false,
                                    "italic": false,
                                    "underline": "Single",
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 0,
                                    "fontFamily": "Calibri",
                                    "fontColor": "#FF000000"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };
    return JSON.stringify(json);
}
describe('Options pane testing', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    let optionsPane: OptionsPane;
    let keydown: any = getEventObject('KeyboardEvent', 'keydown');
    beforeEach(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, OptionsPane, Search);
        editor = new DocumentEditor({ enableEditor: true, enableOptionsPane: true, enableSelection: true, isReadOnly: false, enableSearch: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        optionsPane = editor.optionsPaneModule;
    });
    afterEach((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        optionsPane.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });

    it('Showing optionspane testing using key press with single word', () => {
console.log('Showing optionspane testing using key press with single word');
        editor.open(getJson());
        documentHelper= editor.documentHelper;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'the';
        keydown.keyCode = 13;
        keydown.ctrlKey = false;
        keydown.shiftKey = false;
        optionsPane.onKeyDown(keydown);
        (optionsPane as any).searchInput.value = 'the';
        optionsPane.onKeyDown(keydown);
    });
    it('Displayed optionspane testing using key press with more line ', () => {
console.log('Displayed optionspane testing using key press with more line ');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets';
        keydown.keyCode = 13;
        keydown.ctrlKey = false;
        keydown.shiftKey = false;
        optionsPane.onKeyDown(keydown);
    });
});
describe('Previous & Next navigation Options pane support testing', () => {
    let editor: DocumentEditor = undefined;
    let optionsPane: OptionsPane;
    let documentHelper: DocumentHelper;
    let keydown: any = getEventObject('KeyboardEvent', 'keydown');
    beforeEach((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, OptionsPane, Search);
        editor = new DocumentEditor({ enableEditor: true, enableOptionsPane: true, enableSelection: true, isReadOnly: false, enableSearch: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        optionsPane = editor.optionsPaneModule;
    });
    afterEach((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        optionsPane.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });
    it('previous navigation testing', () => {
console.log('previous navigation testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'the';
        keydown.keyCode = 13;
        keydown.ctrlKey = false;
        keydown.shiftKey = false;
        optionsPane.onKeyDown(keydown);
        optionsPane.navigatePreviousResultButtonClick();
    });
    it('next navigation testing', () => {
console.log('next navigation testing');
        editor.open(getJson());
        documentHelper= editor.documentHelper;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'the';
        keydown.keyCode = 13;
        keydown.ctrlKey = false;
        keydown.shiftKey = false;
        optionsPane.onKeyDown(keydown);
        optionsPane.navigateNextResultButtonClick();
    });
});
describe('Options pane support testing with clicking list & hovering list', () => {
    let editor: DocumentEditor = undefined;
    let optionsPane: OptionsPane;
    let documentHelper: DocumentHelper;
    let keydown: any = getEventObject('KeyboardEvent', 'keydown');
    beforeEach((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, OptionsPane, Search);
        editor = new DocumentEditor({ enableEditor: true, enableOptionsPane: true, enableSelection: true, isReadOnly: false, enableSearch: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        optionsPane = editor.optionsPaneModule;
    });
    afterEach((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        optionsPane.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });
    it('result list block with clicking testing', () => {
console.log('result list block with clicking testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'the';
        keydown.keyCode = 13;
        keydown.ctrlKey = false;
        keydown.shiftKey = false;
        optionsPane.onKeyDown(keydown);
        let event: any = getEventObject('MouseEvent', 'click');
        let dig: any = editor.optionsPaneModule as any;
        let list: any = dig.resultsListBlock.children[0];
        event.target = list;
        optionsPane.resultListBlockClick(event);
    });
    it('Getting results with clicking search icon testing', () => {
console.log('Getting results with clicking search icon testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'the';
        optionsPane.searchIconClickInternal();
    });
});
describe('Options pane support validation', () => {
    let editor: DocumentEditor = undefined;
    let optionsPane: OptionsPane;
    let documentHelper: DocumentHelper;
    let keydown: any = getEventObject('KeyboardEvent', 'keydown');
    beforeEach((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, OptionsPane, Search);
        editor = new DocumentEditor({ enableEditor: true, enableOptionsPane: true, enableSelection: true, isReadOnly: false, enableSearch: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        optionsPane = editor.optionsPaneModule;
    });
    afterEach((done) => {
        document.body.removeChild(document.getElementById('container'));
        optionsPane.destroy();
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });
    it('Empty text with clicking search icon testing', () => {
console.log('Empty text with clicking search icon testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        optionsPane.showHideOptionsPane(true);
        let input: HTMLInputElement = optionsPane.optionsPane.querySelector('input');
        input.value = '';
        optionsPane.searchIconClickInternal();
        input.value = 'xyz';
        optionsPane.searchIconClickInternal();
        // input.value = '';
        // keydown.keyCode = 13;
        // keydown.ctrlKey = false;
        // keydown.shiftKey = false;
        // optionsPane.onKeyDown(keydown);
        // keydown.keyCode = 19;
        // optionsPane.onKeyDown(keydown);
        // input.value = 'xyz';
        // keydown.keyCode = 13;
        // keydown.ctrlKey = false;
        // keydown.shiftKey = false;
        // optionsPane.onKeyDown(keydown);
    });
    it('previous navigation with end testing', () => {
console.log('previous navigation with end testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'the';
        let event: any = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        optionsPane.onKeyDown(event);
        let dig = editor.optionsPaneModule as any;
        let results = dig.results;
        results.currentIndex = 1;
        optionsPane.navigatePreviousResultButtonClick();
    });
    it('next navigation with start testing', () => {
console.log('next navigation with start testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'the';
        keydown.keyCode = 13;
        keydown.ctrlKey = false;
        keydown.shiftKey = false;
        optionsPane.onKeyDown(keydown);
        let dig: any = editor.optionsPaneModule as any;
        let results: any = dig.results;
        results.currentIndex = 10;
        dig.navigateSearchResult(true);
        optionsPane.navigateNextResultButtonClick();
        expect(dig.results.currentIndex).toBe(0);
    });
});
describe('Options pane replace support', () => {
    let editor: DocumentEditor;
    let optionsPane: OptionsPane;
    let documentHelper: DocumentHelper;;
    let keydown: any = getEventObject('KeyboardEvent', 'keydown');
    beforeEach((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, OptionsPane, Search);
        editor = new DocumentEditor({ enableEditor: true, enableOptionsPane: true, enableSelection: true, isReadOnly: false, enableSearch: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        optionsPane = editor.optionsPaneModule;
    });
    afterEach((done) => {
        document.body.removeChild(document.getElementById('container'));
        optionsPane.destroy();
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });
    it('Replace with empty content testing', () => {
console.log('Replace with empty content testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'the';
        let replaceelementbox: any = (optionsPane as any).replaceWith;
        replaceelementbox.value = '';
        optionsPane.onReplaceButtonClick();
    });
    it('Replace with text content testing', () => {
console.log('Replace with text content testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'Adventure';
        let replaceelementbox: any = (optionsPane as any).replaceWith;
        replaceelementbox.value = 'Editor';
        optionsPane.onReplaceButtonClick();
        optionsPane.onReplaceButtonClick();
        let pattern: RegExp = editor.searchModule.textSearch.stringToRegex('Adventure ', 'None');
        let result: TextSearchResult = editor.searchModule.textSearch.find(pattern, 'None');
        expect(result).not.toBe(null);
    });
    it('Replace with backward selection testing', () => {
console.log('Replace with backward selection testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'Adventure';
        keydown.keyCode = 39;
        keydown.ctrlKey = true;
        keydown.shiftKey = false;
        documentHelper.onKeyDownInternal(keydown);
        keydown.keyCode = 37;
        keydown.ctrlKey = true;
        keydown.shiftKey = true;
        documentHelper.onKeyDownInternal(keydown);
        optionsPane.onReplaceButtonClick();
    });
});
describe('Replace validation', () => {
    let editor: DocumentEditor;
    let optionsPane: OptionsPane;
    let documentHelper: DocumentHelper;
    let keydown: any = getEventObject('KeyboardEvent', 'keydown');
    beforeEach((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, OptionsPane, Search);
        editor = new DocumentEditor({ enableEditor: true, enableOptionsPane: true, enableSelection: true, isReadOnly: false, enableSearch: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        optionsPane = editor.optionsPaneModule;
    });
    afterEach((done) => {
        document.body.removeChild(document.getElementById('container'));
        optionsPane.destroy();
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });
    it('Replace text has no matches testing', () => {
console.log('Replace text has no matches testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        optionsPane.onReplacePane();
        (optionsPane as any).searchInput.value = 'z';
        (optionsPane as any).replaceWith.value = 'w';
        optionsPane.onReplaceButtonClick();
    });
    it('Replace text has no matches with end testing', () => {
console.log('Replace text has no matches with end testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        optionsPane.onReplacePane();
        (optionsPane as any).searchInput.value = 'fictitious';
        (optionsPane as any).replaceWith.value = 'document';
        optionsPane.onReplaceButtonClick();
        optionsPane.onReplaceButtonClick();
    });
    it('Replace text has empty string testing', () => {
console.log('Replace text has empty string testing');
        editor.open(getJson());
        documentHelper= editor.documentHelper;
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        optionsPane.onReplacePane();
        (optionsPane as any).searchInput.value = '';
        (optionsPane as any).replaceWith.value = '';
        optionsPane.onReplaceButtonClick();
    });
});
describe('Replace All testing', () => {
    let editor: DocumentEditor;
    let optionsPane: OptionsPane;
    let documentHelper:DocumentHelper;
    let keydown: any = getEventObject('KeyboardEvent', 'keydown');
    beforeEach((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, OptionsPane, Search, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableOptionsPane: true, enableSelection: true, isReadOnly: false, enableSearch: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        optionsPane = editor.optionsPaneModule;
    });
    afterEach((done) => {
        document.body.removeChild(document.getElementById('container'));
        optionsPane.destroy();
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });
    it('Replace All testing without EditorHistory', () => {
console.log('Replace All testing without EditorHistory');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'the';
        let replaceelementbox: any = (optionsPane as any).replaceWith;
        replaceelementbox.value = 'Adventuress';
        optionsPane.onReplaceAllButtonClick();
    });
});
describe('Search options testing', () => {
    let editor: DocumentEditor = undefined;
    let optionsPane: OptionsPane;
    let documentHelper: DocumentHelper;
    let keydown: any = getEventObject('KeyboardEvent', 'keydown');
    beforeEach((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, OptionsPane, Search);
        editor = new DocumentEditor({ enableEditor: true, enableOptionsPane: true, enableSelection: true, isReadOnly: false, enableSearch: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        optionsPane = editor.optionsPaneModule;
    });
    afterEach((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        optionsPane.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });
    // it('regular change testing', () => {
    //     editor.open(getJson());
    //     documentHelper = editor.documentHelper;
    //     let event: any;
    //     event = { preventDefault: function () { }, target: { checked: true }, shiftKey: true, which: 0 };
    //     let optionsPane = editor.optionsPaneModule;
    //     optionsPane.showHideOptionsPane(true);
    //     let regular = (optionsPane as any).regular;
    //     let args: any = { checked: true };
    //     optionsPane.regularChange(args);
    //     let match: any = (optionsPane as any).matchCase;
    //     let wholeword: any = (optionsPane as any).wholeWord;
    //     expect(match.checked).toBe(false);
    //     expect(wholeword.checked).toBe(false);
    //     event = { preventDefault: function () { }, target: { checked: false }, shiftKey: true, which: 0 };
    //     args = { checked: false };
    //     optionsPane.regularChange(args);
    //     expect(match.checked).toBe(false);
    //     expect(wholeword.checked).toBe(false);
    // });
    it('match case testing', () => {
console.log('match case testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let event: any;
        event = { preventDefault: function () { }, target: { checked: true }, shiftKey: true, which: 0 };
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'the';
        (optionsPane as any).matchInput.checked = true;
        (optionsPane as any).wholeInput.checked = false;
        let args: any = { checked: true };
        optionsPane.matchChange();
        expect((optionsPane as any).findOption).toBe('CaseSensitive');
        (optionsPane as any).wholeInput.checked = true;
        optionsPane.matchChange();
        expect((optionsPane as any).findOption).toBe('CaseSensitiveWholeWord');
        (optionsPane as any).matchInput.checked = false;
        optionsPane.matchChange();
        expect((optionsPane as any).findOption).toBe('WholeWord');
    });
    it('wholeWord case testing', () => {
console.log('wholeWord case testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let event: any;
        event = { preventDefault: function () { }, target: { checked: true }, shiftKey: true, which: 0 };
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'the';
        (optionsPane as any).matchInput.checked = false;
        (optionsPane as any).wholeInput.checked = true;
        let args: any = { checked: true };
        optionsPane.wholeWordsChange();
        expect((optionsPane as any).findOption).toBe('WholeWord');
        (optionsPane as any).matchInput.checked = true;
        optionsPane.wholeWordsChange();
        expect((optionsPane as any).findOption).toBe('CaseSensitiveWholeWord');
        (optionsPane as any).wholeInput.checked = false;
        optionsPane.wholeWordsChange();
        expect((optionsPane as any).findOption).toBe('CaseSensitive');
    });
});
describe('Search options testing', () => {
    let editor: DocumentEditor = undefined;
    let optionsPane: OptionsPane;
    let documentHelper: DocumentHelper;;
    let keydown: any = getEventObject('KeyboardEvent', 'keydown');
    beforeEach((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, OptionsPane, Search);
        editor = new DocumentEditor({ enableEditor: true, enableOptionsPane: true, enableSelection: true, isReadOnly: false, enableSearch: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        optionsPane = editor.optionsPaneModule;
    });
    afterEach((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        optionsPane.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });
    it('match case change validation', () => {
console.log('match case change validation');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let event: any;
        event = { preventDefault: function () { }, target: { checked: true }, shiftKey: true, which: 0 };
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'the';
        let args: any = { checked: true };
        (optionsPane as any).matchCase.checked = false;
        (optionsPane as any).wholeWord.checked = false;
        optionsPane.matchChange();
        expect('').toBe('');
    });
    it('whole word change validation', () => {
console.log('whole word change validation');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let event: any;
        event = { preventDefault: function () { }, target: { checked: true }, shiftKey: true, which: 0 };
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'the';
        let args: any = { checked: true };
        (optionsPane as any).matchCase.checked = false;
        (optionsPane as any).wholeWord.checked = false;
        optionsPane.wholeWordsChange();
        expect('').toBe('');
    });
});
describe('search options down arrow click testing', () => {
    let editor: DocumentEditor = undefined;
    let optionsPane: OptionsPane;
    let documentHelper: DocumentHelper;;
    let keydown: any = getEventObject('KeyboardEvent', 'keydown');
    beforeEach((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, OptionsPane, Search);
        editor = new DocumentEditor({ enableEditor: true, enableOptionsPane: true, enableSelection: true, isReadOnly: false, enableSearch: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        optionsPane = editor.optionsPaneModule;
    });
    afterEach((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        optionsPane.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });
    it('search optionspane testing', () => {
console.log('search optionspane testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let event: any;
        event = { preventDefault: function () { }, target: { checked: true }, shiftKey: true, which: 0 };
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'a';
        optionsPane.searchIconClickInternal();
        expect('').toBe('');
    });
    it('onkeydown validation1', () => {
console.log('onkeydown validation1');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let event: any;
        event = { preventDefault: function () { }, target: { checked: true }, shiftKey: true, which: 39 };
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        event.keyCode = 40;
        optionsPane.onKeyDown(event);
        expect('').toBe('');
    });
    it('onkeydown validation2', () => {
console.log('onkeydown validation2');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let event: any;
        event = { preventDefault: function () { }, target: { checked: true }, shiftKey: true, which: 39 };
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        event.keyCode = 13;
        event.which = 13;
        (optionsPane as any).searchInput.value = 'Cycle';
        optionsPane.onKeyDown(event);
        (optionsPane as any).searchInput.value = 'Cycleq';
        event.keyCode = 81;
        event.which = 81;
        optionsPane.onKeyDown(event);
        expect((optionsPane as any).focusedElement.length).toBe(7);
    });
});
describe('tab navigation testing', () => {
    let editor: DocumentEditor = undefined;
    let optionsPane: OptionsPane;
    let documentHelper: DocumentHelper;;
    let keydown: any = getEventObject('KeyboardEvent', 'keydown');
    beforeEach((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, OptionsPane, Search);
        editor = new DocumentEditor({ enableEditor: true, enableOptionsPane: true, enableSelection: true, isReadOnly: false, enableSearch: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        optionsPane = editor.optionsPaneModule;
    });
    afterEach((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        optionsPane.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });
    it('search- tab navigation testing', () => {
console.log('search- tab navigation testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let event: any;
        event = { preventDefault: function () { }, target: { checked: true }, shiftKey: false, which: 9 };
        event.keyCode = 9;
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'Cycle';
        let activeElement = document.activeElement;
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains('e-de-op-search-icon')).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains('e-arrow-up')).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains('e-arrow-down')).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains('e-checkbox')).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains('e-checkbox')).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        optionsPane.onKeyDownOnOptionPane(event);
    });
    it('search shift + tab navigation testing', () => {
console.log('search shift + tab navigation testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let event: any;
        event = { preventDefault: function () { }, target: { checked: true }, shiftKey: true, which: 9 };
        event.keyCode = 9;
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).focusedIndex = 0;
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains('e-checkbox')).toBe(true);
    });
    it('replace-tab focus testing', () => {
console.log('replace-tab focus testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let event: any;
        event = { preventDefault: function () { }, target: { checked: true }, shiftKey: true, which: 9 };
        event.keyCode = 9;
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        optionsPane.onReplacePane();
        (optionsPane as any).focusedIndex = 7;
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains('e-checkbox')).toBe(true);
    });
    it('replace- tab navigation with origin', () => {
console.log('replace- tab navigation with origin');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let event: any;
        event = { preventDefault: function () { }, target: { checked: true }, shiftKey: false, which: 9 };
        event.keyCode = 9;
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        optionsPane.onReplacePane();
        (optionsPane as any).searchInput.value = 'Cycle';
        (optionsPane as any).focusedIndex = 5;
        optionsPane.onKeyDownOnOptionPane(event);
        expect('').toBe('');
        optionsPane.onKeyDownOnOptionPane(event);
        event.keyCode = 13;
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains('e-de-op-replacewith')).toBe(true);
    });
});
describe('open find pane and repalce pane testing', () => {
    let editor: DocumentEditor = undefined;
    let optionsPane: OptionsPane;
    let documentHelper: DocumentHelper;;
    let keydown: any = getEventObject('KeyboardEvent', 'keydown');
    beforeEach((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(OptionsPane, Search, Selection);
        editor = new DocumentEditor({ enableOptionsPane: true, enableSelection: true, isReadOnly: false, enableSearch: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        optionsPane = editor.optionsPaneModule;
    });
    afterEach((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        optionsPane.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });
    it('focus list element testing', () => {
console.log('focus list element testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let event: any;
        event = { preventDefault: function () { }, target: { checked: true }, shiftKey: false, which: 9 };
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'Adventure';
        event.which = 13;
        optionsPane.onKeyDown(event);
        event.keyCode = 9;
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains("e-checkbox")).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains("e-checkbox")).toBe(true);
        event.keyCode = 13;
        event.target = (optionsPane as any).resultsListBlock.children[0];
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains("e-de-search-result-hglt")).toBe(true);
        event.target = undefined;
        optionsPane.onKeyDownOnOptionPane(event);
    });
    it('previous and next list element navigation testing', () => {
console.log('previous and next list element navigation testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        editor.optionsPaneModule.showHideOptionsPane(false);
        let event: any;
        event = { preventDefault: function () { }, target: { checked: true }, shiftKey: false, which: 13 };
        event.keyCode = 13;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'Adventure';
        optionsPane.onKeyDown(event);
        event.keyCode = 40;
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains("e-de-search-result-item")).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains("e-de-search-result-item")).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains("e-de-search-result-item")).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains("e-de-search-result-item")).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains("e-de-search-result-item")).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains("e-de-search-result-item")).toBe(true);
        event.keyCode = 38;
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains("e-de-search-result-item")).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains("e-de-search-result-item")).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains("e-de-search-result-hglt")).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains("e-de-search-result-item")).toBe(false);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains("e-checkbox")).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains("e-checkbox")).toBe(true);
    });
    it('previous and next list element navigation testing validation', () => {
console.log('previous and next list element navigation testing validation');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let event: any;
        event = { preventDefault: function () { }, target: { checked: true }, shiftKey: false, which: 13 };
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'Adventure';
        event.keyCode = 40;
        optionsPane.onKeyDownOnOptionPane(event);
        event.keyCode = 39;
        optionsPane.onKeyDownOnOptionPane(event);
    });
});
describe('open find pane and repalce pane testing', () => {
    let editor: DocumentEditor = undefined;
    let optionsPane: OptionsPane;
    let documentHelper: DocumentHelper;
    let keydown: any = getEventObject('KeyboardEvent', 'keydown');
    beforeEach((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, OptionsPane, Search);
        editor = new DocumentEditor({ enableEditor: true, enableOptionsPane: true, enableSelection: true, isReadOnly: false, enableSearch: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        optionsPane = editor.optionsPaneModule;
    });
    afterEach((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        optionsPane.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });
    it('find pane testing', () => {
console.log('find pane testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let event: any;
        event = { preventDefault: function () { }, target: { checked: true }, shiftKey: true, which: 9 };
        event.keyCode = 9;
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        optionsPane.onFindPane();
    });
    it('replace pane testing', () => {
console.log('replace pane testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let event: any;
        event = { preventDefault: function () { }, target: { checked: true }, shiftKey: true, which: 9 };
        event.keyCode = 9;
        let optionsPane = editor.optionsPaneModule;
        optionsPane.showHideOptionsPane(true);
        optionsPane.onReplacePane();
    });
    it('active class element testing in findPane', () => {
console.log('active class element testing in findPane');
        editor.open(getJson());
        let event: any = { keyCode: 9, preventDefault: function () { }, target: { checked: true }, shiftKey: true, which: 27 };
        documentHelper = editor.documentHelper;
        optionsPane.showHideOptionsPane(true);
        optionsPane.onReplacePane();
        expect(document.activeElement.classList.contains('e-de-search-input')).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains('e-de-op-close-button')).toBe(true);
        (optionsPane as any).replaceAllButton.disabled = false;
        (optionsPane as any).replaceButton.disabled = false;
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains('e-replaceall')).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains('e-replace')).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        event.keyCode = 13;
        event.which = 13;
        optionsPane.onKeyDown(event);
        optionsPane.onFindPane();
        expect(document.activeElement.classList.contains('e-input')).toBe(true);
    });
    it('onkeydownoptionspane method validation', () => {
console.log('onkeydownoptionspane method validation');
        editor.open(getJson());
        let event: any = { keyCode: 13, preventDefault: function () { }, target: { checked: true }, shiftKey: true, which: 27 };
        documentHelper = editor.documentHelper;
        optionsPane.showHideOptionsPane(true);
        event.target = (optionsPane as any).searchInput;
        optionsPane.onKeyDownOnOptionPane(event);
        expect("").toBe("");
    });
    it('active class element testing in replacePane', () => {
console.log('active class element testing in replacePane');
        editor.open(getJson());
        let event: any = { keyCode: 9, preventDefault: function () { }, target: { checked: true }, shiftKey: true, which: 27 };
        documentHelper = editor.documentHelper;
        optionsPane.showHideOptionsPane(true);
        optionsPane.onReplacePane();
        expect(document.activeElement.classList.contains('e-de-search-input')).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains('e-de-op-close-button')).toBe(true);
        (optionsPane as any).replaceAllButton.disabled = false;
        (optionsPane as any).replaceButton.disabled = false;
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains('e-replaceall')).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains('e-replace')).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        expect(document.activeElement.classList.contains('e-de-op-replacewith')).toBe(true);
        optionsPane.onKeyDownOnOptionPane(event);
        event.keyCode = 13;
        event.which = 13;
        optionsPane.onKeyDown(event);
        optionsPane.onReplacePane();
        expect(document.activeElement.classList.contains('e-de-search-input')).toBe(true);
    });

});

describe("Find and Replace tab switch testing", function () {
    let editor: DocumentEditor = undefined;
    let optionsPane: OptionsPane;
    let documentHelper: DocumentHelper;
    let keydown: any = getEventObject('KeyboardEvent', 'keydown');
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, OptionsPane, Search);
        editor = new DocumentEditor({ enableEditor: true, enableOptionsPane: true, enableSelection: true, isReadOnly: false, enableSearch: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        optionsPane = editor.optionsPaneModule;
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        optionsPane.destroy();
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 500);
    });
    it('replace tab click testing using tab instance', (done) => {
console.log('replace tab click testing using tab instance');
        editor.open(getJson());
        let event: any = { previousIndex: 0, selectedIndex: 1 };
        documentHelper = editor.documentHelper;
        optionsPane.showHideOptionsPane(true);
        optionsPane.tabInstance.select(1);
        setTimeout(() => {
            expect(document.activeElement.classList.contains('e-de-search-input')).toBe(true);
            optionsPane.close();
            done();
        }, 10);
    });
    it('find tab click testing using tab instance', (done) => {
console.log('find tab click testing using tab instance');
        editor.open(getJson());
        let event: any = { previousIndex: 0, selectedIndex: 1 };
        documentHelper = editor.documentHelper;
        optionsPane.showHideOptionsPane(true);
        setTimeout(() => {
            optionsPane.tabInstance.select(0);
            setTimeout(() => {
                expect(document.activeElement.classList.contains('e-de-search-input')).toBe(true);
                optionsPane.close();
                done();
            });
        }, 10);
    });
});

describe('Close Options pane support testing', () => {
    let editor: DocumentEditor = undefined;
    let optionsPane: OptionsPane;
    let documentHelper:DocumentHelper;
    let keydown: any = getEventObject('KeyboardEvent', 'keydown');
    beforeEach((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(OptionsPane, Search);
        editor = new DocumentEditor({ enableOptionsPane: true, enableSelection: true, isReadOnly: false, enableSearch: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        optionsPane = editor.optionsPaneModule;
        documentHelper = editor.documentHelper;
    });
    afterEach((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        optionsPane.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });
    it('Pressing back space testing with single character', () => {
console.log('Pressing back space testing with single character');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let optionsPane = editor.optionsPaneModule;
        let event: any = { keyCode: 8, preventDefault: function () { }, target: { checked: true }, shiftKey: true, which: 8 };
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = '';
        optionsPane.onKeyDown(event);
    });
    it('Pressing ctrl+H for opening replace pane', () => {
console.log('Pressing ctrl+H for opening replace pane');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let optionsPane = editor.optionsPaneModule;
        optionsPane.isReplace = true;
        optionsPane.showHideOptionsPane(true);
        expect(document.activeElement.classList.contains('replacewith')).not.toBe(true);
    });
    it('close optionspane testing', () => {
console.log('close optionspane testing');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        let event: any = { keyCode: 8, preventDefault: function () { }, target: { checked: true }, shiftKey: true, which: 13 };
        optionsPane.showHideOptionsPane(true);
        (optionsPane as any).searchInput.value = 'a';
        optionsPane.onKeyDown(event);
        optionsPane.close();
    });
    it('close options pane using escape key testing', () => {
console.log('close options pane using escape key testing');
        editor.open(getJson());
        let event: any = { keyCode: 27, preventDefault: function () { }, target: { checked: true }, shiftKey: true, which: 27 };
        documentHelper = editor.documentHelper;
        optionsPane.onKeyDown(event);
    });
    it('selection (tab) character testing', () => {
console.log('selection (tab) character testing');
        editor.open(getJson());
        let event: any = { preventDefault: function () { }, target: {}, shiftKey: false, which: 65, ctrlKey: true };
        let optionsPane = editor.optionsPaneModule;
        documentHelper.onKeyDownInternal(event);
        optionsPane.showHideOptionsPane(true);
    });
});
describe('Close Options pane support testing', () => {
    let editor: DocumentEditor = undefined;
    let optionsPane: OptionsPane;
    let documentHelper: DocumentHelper;;
    let keydown: any = getEventObject('KeyboardEvent', 'keydown');
    beforeEach((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(OptionsPane, Search);
        editor = new DocumentEditor({ enableOptionsPane: true, enableSelection: true, isReadOnly: false, enableSearch: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        optionsPane = editor.optionsPaneModule;
    });
    afterEach((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        optionsPane.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });
    it('destroy method validation1', () => {
console.log('destroy method validation1');
        (optionsPane as any).searchText = undefined;
        (optionsPane as any).resultsText = undefined;
        (optionsPane as any).messageDivText = undefined;
        optionsPane.destroy();
    });
    it('destroy method validation2', () => {
console.log('destroy method validation2');
        documentHelper = editor.documentHelper;
        optionsPane.destroy();
        optionsPane.navigateNextResultButtonClick();
        optionsPane.navigatePreviousResultButtonClick();
    });

});
