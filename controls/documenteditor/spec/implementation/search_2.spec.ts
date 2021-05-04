import { LayoutViewer, PageLayoutViewer, } from '../../src/index';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Search } from '../../src/document-editor/implementation/search/index';
import { TestHelper } from '../test-helper.spec';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { OptionsPane } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/index'
/**
 * Search Spec
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
                            "fontSize": 10.5,
                            "fontFamily": "Arial",
                            "fontColor": "#FF006621"
                        },
                        "paragraphFormat": {
                            "leftIndent": 0,
                            "rightIndent": 0,
                            "firstLineIndent": 0,
                            "beforeSpacing": 0,
                            "afterSpacing": 0,
                            "lineSpacing": 1,
                            "lineSpacingType": "Multiple",
                            "textAlignment": "Left"
                        },
                        "inlines": [
                            {
                                "hasFieldEnd": true,
                                "fieldCharacterType": 0
                            },
                            {
                                "text": " HYPERLINK \"https://office.live.com/start/Word.aspx\"",
                                "characterFormat": {
                                    "bold": false,
                                    "italic": false,
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 11,
                                    "fontFamily": "Calibri"
                                }
                            },
                            {
                                "fieldCharacterType": 1
                            },
                            {
                                "text": "https://office.live.com/start/",
                                "characterFormat": {
                                    "bold": false,
                                    "italic": false,
                                    "underline": "Single",
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 10.5,
                                    "fontFamily": "Arial",
                                    "fontColor": "#FF0563C1"
                                }
                            },
                            {
                                "text": "Word",
                                "characterFormat": {
                                    "bold": true,
                                    "italic": false,
                                    "underline": "Single",
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 10.5,
                                    "fontFamily": "Arial",
                                    "fontColor": "#FF0563C1"
                                }
                            },
                            {
                                "text": ".aspx",
                                "characterFormat": {
                                    "bold": false,
                                    "italic": false,
                                    "underline": "Single",
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 10.5,
                                    "fontFamily": "Arial",
                                    "fontColor": "#FF0563C1"
                                }
                            },
                            {
                                "fieldCharacterType": 2
                            }
                        ]
                    },
                    {
                        "characterFormat": {
                            "bold": false,
                            "italic": false,
                            "strikethrough": "None",
                            "baselineAlignment": "Normal",
                            "fontSize": 10.5,
                            "fontFamily": "Arial",
                            "fontColor": "#FF006621"
                        },
                        "paragraphFormat": {
                            "leftIndent": 0,
                            "rightIndent": 0,
                            "firstLineIndent": 0,
                            "beforeSpacing": 0,
                            "afterSpacing": 0,
                            "lineSpacing": 1,
                            "lineSpacingType": "Multiple",
                            "textAlignment": "Left"
                        },
                        "inlines": [
                            {
                                "hasFieldEnd": true,
                                "fieldCharacterType": 0
                            },
                            {
                                "text": " HYPERLINK \"http://www.ckeditor.com\"",
                                "characterFormat": {
                                    "bold": false,
                                    "italic": false,
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 11,
                                    "fontFamily": "Calibri"
                                }
                            },
                            {
                                "fieldCharacterType": 1
                            },
                            {
                                "text": "www.ckeditor.com",
                                "characterFormat": {
                                    "bold": false,
                                    "italic": false,
                                    "underline": "Single",
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 10.5,
                                    "fontFamily": "Arial",
                                    "fontColor": "#FF0563C1"
                                }
                            },
                            {
                                "fieldCharacterType": 2
                            }
                        ]
                    },
                    {
                        "characterFormat": {
                            "bold": false,
                            "italic": false,
                            "underline": "Single",
                            "strikethrough": "None",
                            "baselineAlignment": "Normal",
                            "fontSize": 10.5,
                            "fontFamily": "Arial",
                            "fontColor": "#FF0563C1"
                        },
                        "paragraphFormat": {
                            "leftIndent": 0,
                            "rightIndent": 0,
                            "firstLineIndent": 0,
                            "beforeSpacing": 0,
                            "afterSpacing": 0,
                            "lineSpacing": 1,
                            "lineSpacingType": "Multiple",
                            "textAlignment": "Left"
                        },
                        "inlines": [
                            {
                                "hasFieldEnd": true,
                                "fieldCharacterType": 0
                            },
                            {
                                "text": " HYPERLINK \"https://www.zoho.com/docs/writer.html\"",
                                "characterFormat": {
                                    "bold": false,
                                    "italic": false,
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 11,
                                    "fontFamily": "Calibri"
                                }
                            },
                            {
                                "fieldCharacterType": 1
                            },
                            {
                                "text": "https://www.zoho.com/docs/writer.html",
                                "characterFormat": {
                                    "bold": false,
                                    "italic": false,
                                    "underline": "Single",
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 10.5,
                                    "fontFamily": "Arial",
                                    "fontColor": "#FF0563C1"
                                }
                            },
                            {
                                "fieldCharacterType": 2
                            }
                        ]
                    },
                    {
                        "characterFormat": {
                            "bold": false,
                            "italic": false,
                            "strikethrough": "None",
                            "baselineAlignment": "Normal",
                            "fontSize": 10.5,
                            "fontFamily": "Arial",
                            "fontColor": "#FF006621"
                        },
                        "paragraphFormat": {
                            "leftIndent": 0,
                            "rightIndent": 0,
                            "firstLineIndent": 0,
                            "beforeSpacing": 0,
                            "afterSpacing": 0,
                            "lineSpacing": 1,
                            "lineSpacingType": "Multiple",
                            "textAlignment": "Left"
                        },
                        "inlines": [
                            {
                                "hasFieldEnd": true,
                                "fieldCharacterType": 0
                            },
                            {
                                "text": " HYPERLINK \"http://www.editpad.org/\"",
                                "characterFormat": {
                                    "bold": false,
                                    "italic": false,
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 11,
                                    "fontFamily": "Calibri"
                                }
                            },
                            {
                                "fieldCharacterType": 1
                            },
                            {
                                "text": "http://www.editpad.org/",
                                "characterFormat": {
                                    "bold": false,
                                    "italic": false,
                                    "underline": "Single",
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 10.5,
                                    "fontFamily": "Arial",
                                    "fontColor": "#FF0563C1"
                                }
                            },
                            {
                                "fieldCharacterType": 2
                            }
                        ]
                    },
                    {
                        "characterFormat": {
                            "bold": false,
                            "italic": false,
                            "strikethrough": "None",
                            "baselineAlignment": "Normal",
                            "fontSize": 10.5,
                            "fontFamily": "Arial"
                        },
                        "paragraphFormat": {
                            "leftIndent": 0,
                            "rightIndent": 0,
                            "firstLineIndent": 0,
                            "beforeSpacing": 0,
                            "afterSpacing": 0,
                            "lineSpacing": 1,
                            "lineSpacingType": "Multiple",
                            "textAlignment": "Left"
                        },
                        "inlines": [
                            {
                                "hasFieldEnd": true,
                                "fieldCharacterType": 0
                            },
                            {
                                "text": " HYPERLINK \"https://www.google.com/docs/about/\"",
                                "characterFormat": {
                                    "bold": false,
                                    "italic": false,
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 11,
                                    "fontFamily": "Calibri"
                                }
                            },
                            {
                                "fieldCharacterType": 1
                            },
                            {
                                "text": "https://www.google.com/",
                                "characterFormat": {
                                    "bold": false,
                                    "italic": false,
                                    "underline": "Single",
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 10.5,
                                    "fontFamily": "Arial",
                                    "fontColor": "#FF0563C1"
                                }
                            },
                            {
                                "text": "doc",
                                "characterFormat": {
                                    "bold": true,
                                    "italic": false,
                                    "underline": "Single",
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 10.5,
                                    "fontFamily": "Arial",
                                    "fontColor": "#FF0563C1"
                                }
                            },
                            {
                                "text": "s/about/",
                                "characterFormat": {
                                    "bold": false,
                                    "italic": false,
                                    "underline": "Single",
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 10.5,
                                    "fontFamily": "Arial",
                                    "fontColor": "#FF0563C1"
                                }
                            },
                            {
                                "fieldCharacterType": 2
                            }
                        ]
                    },
                    {
                        "characterFormat": {
                            "bold": false,
                            "italic": false,
                            "strikethrough": "None",
                            "baselineAlignment": "Normal",
                            "fontSize": 11,
                            "fontFamily": "Calibri"
                        },
                        "paragraphFormat": {
                            "leftIndent": 0,
                            "rightIndent": 0,
                            "firstLineIndent": 0,
                            "beforeSpacing": 0,
                            "afterSpacing": 0,
                            "lineSpacing": 1,
                            "lineSpacingType": "Multiple",
                            "textAlignment": "Left"
                        },
                        "inlines": []
                    }
                ],
                "headersFooters": {},
                "sectionFormat": {
                    "headerDistance": 36,
                    "footerDistance": 36,
                    "pageWidth": 612,
                    "pageHeight": 792,
                    "leftMargin": 72,
                    "rightMargin": 72,
                    "topMargin": 72,
                    "bottomMargin": 72,
                    "differentFirstPage": false,
                    "differentOddAndEvenPages": false
                }
            }
        ],
        "characterFormat": {
            "bold": false,
            "italic": false,
            "strikethrough": "None",
            "baselineAlignment": "Normal",
            "fontSize": 11,
            "fontFamily": "Calibri"
        },
        "background": {
            "color": "#FFFFFFFF"
        }
    };
    return JSON.stringify(json);
}
describe('Search module testing', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, Search, OptionsPane, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableSearch: true, enableOptionsPane: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('field text testing using search', () => {
console.log('field text testing using search');
        editor.open(getJson());
        let optionsPane = editor.optionsPaneModule;
        editor.showOptionsPane();
        (optionsPane as any).searchInput.value = 'www';
        optionsPane.searchIconClickInternal();
    });   
    it('find validation', () => {
console.log('find validation');
        editor.open(getJson());
        editor.searchModule.find('xyz', 'None');
    });
    it('findall validation', () => {
console.log('findall validation');
        editor.open(getJson());
        editor.searchModule.findAll('xyz', 'None');
    });
    it('findOption undefind validation', () => {
console.log('findOption undefind validation');
        editor.open(getJson());
        let pattern = editor.searchModule.textSearch.stringToRegex('the', 'None');
        editor.searchModule.textSearch.findAll(pattern, undefined, '0;0;0;0;0;0');
    });
    // it('replace method validation', () => {
    //     editor.open(getJson());
    //     viewer = editor.documentHelper as PageLayoutViewer;
    //     let results = editor.searchModule.replaceInternal('adventure', 'adventures', 'None');
    //     expect(results).toBe(undefined);
    // });
    // it('replaceall method validation', () => {
    //     editor.open(getJson());
    //     viewer = editor.documentHelper as PageLayoutViewer;
    //     let results = editor.searchModule.replaceAllInternal('adventure', 'adventures', 'None');
    //     expect(results).toBe(undefined);
    // });
});
