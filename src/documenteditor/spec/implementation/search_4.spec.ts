import { LayoutViewer } from '../../src/index';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Search } from '../../src/document-editor/implementation/search/index';
import { TestHelper } from '../test-helper.spec';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { OptionsPane } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/index';

function getJson() {
    let json = {
        "sections": [
            {
                "sectionFormat": {
                    "pageWidth": 612,
                    "pageHeight": 792,
                    "leftMargin": 72,
                    "rightMargin": 72,
                    "topMargin": 72,
                    "bottomMargin": 72,
                    "differentFirstPage": false,
                    "differentOddAndEvenPages": false,
                    "headerDistance": 36,
                    "footerDistance": 36
                },
                "blocks": [
                    {
                        "paragraphFormat": {
                            "styleName": "Normal",
                            "listFormat": {}
                        },
                        "characterFormat": {
                            "fontSize": 10.5,
                            "fontFamily": "Arial",
                            "fontColor": "#006621FF"
                        },
                        "inlines": [
                            {
                                "characterFormat": {},
                                "fieldType": 0
                            },
                            {
                                "characterFormat": {},
                                "text": "HYPERLINK \"https://office.live.com/start/Word.aspx\" "
                            },
                            {
                                "characterFormat": {},
                                "fieldType": 2
                            },
                            {
                                "characterFormat": {
                                    "fontSize": 10.5,
                                    "fontFamily": "Arial",
                                    "styleName": "Hyperlink"
                                },
                                "text": "https://office.live.com/start/"
                            },
                            {
                                "characterFormat": {
                                    "bold": true,
                                    "fontSize": 10.5,
                                    "fontFamily": "Arial",
                                    "styleName": "Hyperlink"
                                },
                                "text": "Word"
                            },
                            {
                                "characterFormat": {
                                    "fontSize": 10.5,
                                    "fontFamily": "Arial",
                                    "styleName": "Hyperlink"
                                },
                                "text": ".aspx"
                            },
                            {
                                "characterFormat": {},
                                "fieldType": 1
                            }
                        ]
                    },
                    {
                        "paragraphFormat": {
                            "styleName": "Normal",
                            "listFormat": {}
                        },
                        "characterFormat": {
                            "fontSize": 10.5,
                            "fontFamily": "Arial",
                            "fontColor": "#006621FF"
                        },
                        "inlines": [
                            {
                                "characterFormat": {},
                                "fieldType": 0
                            },
                            {
                                "characterFormat": {},
                                "text": "HYPERLINK \"http://www.ckeditor.com\" "
                            },
                            {
                                "characterFormat": {},
                                "fieldType": 2
                            },
                            {
                                "characterFormat": {
                                    "fontSize": 10.5,
                                    "fontFamily": "Arial",
                                    "styleName": "Hyperlink"
                                },
                                "text": "www.ckeditor.com"
                            },
                            {
                                "characterFormat": {},
                                "fieldType": 1
                            }
                        ]
                    },
                    {
                        "paragraphFormat": {
                            "styleName": "Normal",
                            "listFormat": {}
                        },
                        "characterFormat": {
                            "fontSize": 10.5,
                            "fontFamily": "Arial"
                        },
                        "inlines": [
                            {
                                "characterFormat": {},
                                "fieldType": 0
                            },
                            {
                                "characterFormat": {},
                                "text": "HYPERLINK \"https://www.zoho.com/docs/writer.html\" "
                            },
                            {
                                "characterFormat": {},
                                "fieldType": 2
                            },
                            {
                                "characterFormat": {
                                    "fontSize": 10.5,
                                    "fontFamily": "Arial",
                                    "styleName": "Hyperlink"
                                },
                                "text": "https://www.zoho.com/docs/writer.html"
                            },
                            {
                                "characterFormat": {},
                                "fieldType": 1
                            }
                        ]
                    },
                    {
                        "paragraphFormat": {
                            "styleName": "Normal",
                            "listFormat": {}
                        },
                        "characterFormat": {
                            "fontSize": 10.5,
                            "fontFamily": "Arial",
                            "fontColor": "#006621FF"
                        },
                        "inlines": [
                            {
                                "characterFormat": {},
                                "fieldType": 0
                            },
                            {
                                "characterFormat": {},
                                "text": "HYPERLINK \"http://www.editpad.org/\" "
                            },
                            {
                                "characterFormat": {},
                                "fieldType": 2
                            },
                            {
                                "characterFormat": {
                                    "fontSize": 10.5,
                                    "fontFamily": "Arial",
                                    "styleName": "Hyperlink"
                                },
                                "text": "http://www.editpad.org/"
                            },
                            {
                                "characterFormat": {},
                                "fieldType": 1
                            }
                        ]
                    },
                    {
                        "paragraphFormat": {
                            "styleName": "Normal",
                            "listFormat": {}
                        },
                        "characterFormat": {
                            "fontSize": 10.5,
                            "fontFamily": "Arial"
                        },
                        "inlines": [
                            {
                                "characterFormat": {},
                                "fieldType": 0
                            },
                            {
                                "characterFormat": {},
                                "text": "HYPERLINK \"https://www.google.com/docs/about/\" "
                            },
                            {
                                "characterFormat": {},
                                "fieldType": 2
                            },
                            {
                                "characterFormat": {
                                    "fontSize": 10.5,
                                    "fontFamily": "Arial",
                                    "styleName": "Hyperlink"
                                },
                                "text": "https://www.google.com/"
                            },
                            {
                                "characterFormat": {
                                    "bold": true,
                                    "fontSize": 10.5,
                                    "fontFamily": "Arial",
                                    "styleName": "Hyperlink"
                                },
                                "text": "doc"
                            },
                            {
                                "characterFormat": {
                                    "fontSize": 10.5,
                                    "fontFamily": "Arial",
                                    "styleName": "Hyperlink"
                                },
                                "text": "s/about/"
                            },
                            {
                                "characterFormat": {},
                                "fieldType": 1
                            },
                            {
                                "characterFormat": {},
                                "bookmarkType": 0,
                                "name": "_GoBack"
                            },
                            {
                                "characterFormat": {},
                                "bookmarkType": 1,
                                "name": "_GoBack"
                            }
                        ]
                    },
                    {
                        "paragraphFormat": {
                            "styleName": "Normal",
                            "listFormat": {}
                        },
                        "characterFormat": {},
                    }
                ],
            }
        ],
        "characterFormat": {
            "fontSize": 11,
            "fontFamily": "Calibri"
        },
        "paragraphFormat": {
            "afterSpacing": 8,
            "lineSpacing": 1.0791666507720947,
            "lineSpacingType": "Multiple",
            "listFormat": {}
        }
    }

return JSON.stringify(json);
}

describe('Text Search module testing', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeEach(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, Search, OptionsPane, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableSearch: true, enableOptionsPane: true, enableEditorHistory: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterEach((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        viewer = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
it('field end validation testing', () => {
    editor.open(getJson());
    let optionsPane = editor.optionsPaneModule;
    editor.showOptionsPane();
    (optionsPane as any).searchInput.value = 'https';
    optionsPane.searchIconClickInternal();
    expect((optionsPane as any).results.innerList.length).toBe(3);
});
});