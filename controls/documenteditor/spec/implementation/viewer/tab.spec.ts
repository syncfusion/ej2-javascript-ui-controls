import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';

describe("Tab character ", () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 750);
    });
    it("Layouting at line end validation", () => {
        //Task Id - EJ2-53518
        let sfdtDocument: any = {
            "sections": [
                {
                    "blocks": [
                        {
                            "characterFormat": {
                                "fontSize": 9.0
                            },
                            "inlines": [
                                {
                                    "text": "1",
                                    "characterFormat": {
                                        "fontSize": 9.0
                                    }
                                },
                                {
                                    "text": "sdasdfsadfsadfsdfsadf",
                                    "characterFormat": {
                                        "fontSize": 9.0
                                    }
                                },
                                {
                                    "text": " ",
                                    "characterFormat": {
                                        "fontSize": 9.0
                                    }
                                },
                                {
                                    "text": "\t",
                                    "characterFormat": {
                                        "underline": "Single",
                                        "fontSize": 9.0
                                    }
                                },
                                {
                                    "text": "\t",
                                    "characterFormat": {
                                        "underline": "Single",
                                        "fontSize": 9.0
                                    }
                                },
                                {
                                    "text": "\t",
                                    "characterFormat": {
                                        "underline": "Single",
                                        "fontSize": 9.0
                                    }
                                },
                                {
                                    "text": "\t",
                                    "characterFormat": {
                                        "underline": "Single",
                                        "fontSize": 9.0
                                    }
                                },
                                {
                                    "text": "\t",
                                    "characterFormat": {
                                        "underline": "Single",
                                        "fontSize": 9.0
                                    }
                                },
                                {
                                    "text": " ",
                                    "characterFormat": {
                                        "fontSize": 9.0
                                    }
                                },
                                {
                                    "text": " ",
                                    "characterFormat": {
                                        "fontSize": 9.0
                                    }
                                },
                                {
                                    "text": " ",
                                    "characterFormat": {
                                        "fontSize": 9.0
                                    }
                                },
                                {
                                    "text": "\t",
                                    "characterFormat": {
                                        "fontSize": 9.0
                                    }
                                },
                                {
                                    "text": "\t",
                                    "characterFormat": {
                                        "fontSize": 9.0
                                    }
                                },
                                {
                                    "text": "\t",
                                    "characterFormat": {
                                        "fontSize": 9.0
                                    }
                                },
                                {
                                    "text": "\t",
                                    "characterFormat": {
                                        "fontSize": 9.0
                                    }
                                },
                                {
                                    "text": "\t",
                                    "characterFormat": {
                                        "fontSize": 9.0
                                    }
                                },
                                {
                                    "text": "\t",
                                    "characterFormat": {
                                        "fontSize": 9.0
                                    }
                                },
                                {
                                    "text": "\t",
                                    "characterFormat": {
                                        "fontSize": 9.0
                                    }
                                },
                                {
                                    "text": "\t",
                                    "characterFormat": {
                                        "fontSize": 9.0
                                    }
                                }
                            ]
                        }
                    ],
                    "headersFooters": {},
                    "sectionFormat": {
                        "headerDistance": 25.200000762939453,
                        "footerDistance": 25.200000762939453,
                        "pageWidth": 612.0,
                        "pageHeight": 792.0,
                        "leftMargin": 54.0,
                        "rightMargin": 54.0,
                        "topMargin": 41.04999923706055,
                        "bottomMargin": 72.0,
                        "differentFirstPage": true,
                        "differentOddAndEvenPages": false,
                        "bidi": false,
                        "restartPageNumbering": true,
                        "pageStartingNumber": 1,
                        "endnoteNumberFormat": "LowerCaseRoman",
                        "footNoteNumberFormat": "Arabic",
                        "restartIndexForFootnotes": "DoNotRestart",
                        "restartIndexForEndnotes": "DoNotRestart"
                    }
                }
            ],
            "characterFormat": {
                "fontSize": 12.0,
                "fontFamily": "Arial",
                "fontSizeBidi": 12.0,
                "fontFamilyBidi": "Arial"
            },
            "lists": [
            ],
            "abstractLists": [
            ],
            "background": {
                "color": "#FFFFFFFF"
            },
            "defaultTabWidth": 35.400001525878906,
            "formatting": false,
            "trackChanges": false,
            "protectionType": "NoProtection",
            "enforcement": false,
            "dontUseHTMLParagraphAutoSpacing": false,
            "alignTablesRowByRow": false,
            "formFieldShading": true,
            "compatibilityMode": "Word2013"
        };
        editor.open(JSON.stringify(sfdtDocument));
        //Last tab character in first should be moved to second line.
        expect(editor.selection.start.paragraph.childWidgets.length).toBe(2);
    });

});
