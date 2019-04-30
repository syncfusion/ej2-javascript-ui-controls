import { LayoutViewer, PageLayoutViewer, } from '../../src/index';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Search } from '../../src/document-editor/implementation/search/index';
import { TextSearchResult } from '../../src/document-editor/implementation/search/text-search-result';
import { TextSearchResults } from '../../src/document-editor/implementation/search/text-search-results';
import { TestHelper } from '../test-helper.spec';
//import { EditorHistory } from '../../src/index';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
/**
 * Replace Spec
 */
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

describe('Search module testing', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, Search);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableSearch: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        viewer = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            done();
        }, 1000);
    });

    it('find method testing with findoptions none value', () => {
        editor.open(getJson());
        setTimeout(() => {
            let result = editor.searchModule.find('adventure', 'None');
            expect(result).toBe(undefined);
        }, 10);
    });
    it('find all method testing', () => {
        let results = editor.searchModule.findAll('adventure', 'None');
        expect(results).toBe(undefined);
    });
    it('findnext method testing', () => {
        let pattern: RegExp = editor.searchModule.textSearch.stringToRegex('adventure', 'WholeWord');
        let result = editor.searchModule.textSearch.findNext(pattern, 'WholeWord', undefined);
        expect(result.text).toBe('Adventure');
    });
});
describe('Search module testing-replace', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, Search);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableSearch: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        viewer = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    // it('replace method testing', () => {
    //     editor.open(getJson());
    //     viewer = editor.viewer as PageLayoutViewer;
    //     let result = editor.searchModule.replaceInternal('adventure', 'adventures', undefined);
    //     expect(result).toBe(undefined);
    // });
    // it('replace method testing with empty text', () => {
    //     editor.open(getJson());
    //     viewer = editor.viewer as PageLayoutViewer;
    //     let result = editor.searchModule.replaceInternal('', 'adventures', undefined);
    //     expect(result).toBe(undefined);
    // });
    // it('replaceall method testing', () => {
    //     editor.open(getJson());
    //     viewer = editor.viewer as PageLayoutViewer;
    //     let result = editor.searchModule.replaceAllInternal('adventure', 'adventures', undefined);
    // });
    // it('replaceall method testing', () => {
    //     editor.open(getJson());
    //     viewer = editor.viewer as PageLayoutViewer;
    //     let results = editor.searchModule.replaceAllInternal('adventure', 'adventures', undefined);
    //     expect(results).toBe(undefined);
    // });
    // it('replaceall method testing with empty string', () => {
    //     editor.open(getJson());
    //     viewer = editor.viewer as PageLayoutViewer;
    //     let results = editor.searchModule.replaceAllInternal('', 'adventures', undefined);
    //     expect(results).toBe(undefined);
    // });
    it('find method validation', () => {
        editor.open(getJson());
        setTimeout(() => {
            editor.searchModule.find('adventure', undefined);
        }, 10);
    });
    it('findall method validation', () => {
        editor.searchModule.findAll('adventure', undefined);
    });
    it('addSearchResultItems method validation1', () => {
        editor.searchModule.addSearchResultItems(undefined);
    });
    it('addSearchResultItems method validation2', () => {
        editor.findResultsList = undefined;
        editor.searchModule.addSearchResultItems('<li></li>');
    });
    it('textsearchresults indexof method testing', () => {
        let results = new TextSearchResults(editor);
        results.innerList = undefined;
        let value: number = results.indexOf(undefined);
        expect(value).toBe(-1);
    });
});