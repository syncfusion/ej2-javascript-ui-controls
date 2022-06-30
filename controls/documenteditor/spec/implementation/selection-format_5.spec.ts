import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { LayoutViewer, PageLayoutViewer, DocumentHelper } from '../../src/index';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/index';
import { TestHelper } from '../test-helper.spec';
let json:Object={
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
                "footerDistance": 36,
                "bidi": false
            },
            "blocks": [
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "color": "#FF0000FF",
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 1,
                                "shadow": false,
                                "space": 1
                            },
                            "left": {
                                "color": "#FF0000FF",
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 1,
                                "shadow": false,
                                "space": 4
                            },
                            "right": {
                                "color": "#FF0000FF",
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 1,
                                "shadow": false,
                                "space": 4
                            },
                            "bottom": {
                                "color": "#FF0000FF",
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 1,
                                "shadow": false,
                                "space": 1
                            },
                            "diagonalDown": {},
                            "diagonalUp": {},
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            }
                        },
                        "styleName": "Normal",
                        "listFormat": {}
                    },
                    "characterFormat": {},
                    "inlines": [
                        {
                            "characterFormat": {},
                            "text": "This is unit test for Paragraph "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#FF0000FF"
                            },
                            "text": "border properties"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "color": "#FF0000FF",
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 1,
                                "shadow": false,
                                "space": 1
                            },
                            "diagonalDown": {},
                            "diagonalUp": {},
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            }
                        },
                        "styleName": "Normal",
                        "listFormat": {}
                    },
                    "characterFormat": {},
                    "inlines": [
                        {
                            "characterFormat": {},
                            "text": "Test-1"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "color": "#000000FF",
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 1,
                                "shadow": false,
                                "space": 1
                            },
                            "left": {
                                "color": "#000000FF",
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 1,
                                "shadow": false,
                                "space": 4
                            },
                            "right": {
                                "color": "#000000FF",
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 1,
                                "shadow": false,
                                "space": 4
                            },
                            "bottom": {
                                "color": "#000000FF",
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 1,
                                "shadow": false,
                                "space": 1
                            },
                            "diagonalDown": {},
                            "diagonalUp": {},
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            }
                        },
                        "styleName": "Normal",
                        "listFormat": {}
                    },
                    "characterFormat": {},
                    "inlines": [
                        {
                            "characterFormat": {},
                            "text": "Test-2"
                        }
                    ]
                }
            ],
            "headersFooters": {}
        }
    ],
    "characterFormat": {
        "bold": false,
        "italic": false,
        "fontSize": 11,
        "fontFamily": "Calibri",
        "underline": "None",
        "strikethrough": "None",
        "baselineAlignment": "Normal",
        "highlightColor": "NoColor",
        "fontColor": "#00000000",
        "boldBidi": false,
        "italicBidi": false,
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Calibri",
        "allCaps": false
    },
    "paragraphFormat": {
        "borders": {
            "top": {
                "hasNoneStyle": false,
                "lineStyle": "None",
                "lineWidth": 0,
                "shadow": false,
                "space": 0
            },
            "left": {
                "hasNoneStyle": false,
                "lineStyle": "None",
                "lineWidth": 0,
                "shadow": false,
                "space": 0
            },
            "right": {
                "hasNoneStyle": false,
                "lineStyle": "None",
                "lineWidth": 0,
                "shadow": false,
                "space": 0
            },
            "bottom": {
                "hasNoneStyle": false,
                "lineStyle": "None",
                "lineWidth": 0,
                "shadow": false,
                "space": 0
            },
            "diagonalDown": {},
            "diagonalUp": {},
            "horizontal": {
                "hasNoneStyle": false,
                "lineStyle": "None",
                "lineWidth": 0,
                "shadow": false,
                "space": 0
            },
            "vertical": {
                "hasNoneStyle": false,
                "lineStyle": "None",
                "lineWidth": 0,
                "shadow": false,
                "space": 0
            }
        },
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 0,
        "afterSpacing": 8,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "listFormat": {},
        "bidi": false,
        "keepLinesTogether": false,
        "keepWithNext": false,
        "widowControl": true
    },
    "defaultTabWidth": 36,
    "trackChanges": false,
    "enforcement": false,
    "hashValue": "",
    "saltValue": "",
    "formatting": false,
    "protectionType": "NoProtection",
    "dontUseHTMLParagraphAutoSpacing": false,
    "formFieldShading": true,
    "compatibilityMode": "Word2013",
    "styles": [
        {
            "name": "Normal",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0,
                        "shadow": false,
                        "space": 0
                    },
                    "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0,
                        "shadow": false,
                        "space": 0
                    },
                    "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0,
                        "shadow": false,
                        "space": 0
                    },
                    "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0,
                        "shadow": false,
                        "space": 0
                    },
                    "diagonalDown": {},
                    "diagonalUp": {},
                    "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0,
                        "shadow": false,
                        "space": 0
                    },
                    "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0,
                        "shadow": false,
                        "space": 0
                    }
                },
                "listFormat": {}
            },
            "characterFormat": {},
            "next": "Normal"
        },
        {
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {}
        },
        {
            "name": "Heading 1",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "diagonalDown": {},
                    "diagonalUp": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 12,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level1",
                "listFormat": {}
            },
            "characterFormat": {
                "fontSize": 16,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496",
                "fontSizeBidi": 16,
                "fontFamilyBidi": "Calibri Light"
            },
            "basedOn": "Normal",
            "link": "Heading 1 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 1 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 16,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496",
                "fontSizeBidi": 16,
                "fontFamilyBidi": "Calibri Light"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "diagonalDown": {},
                    "diagonalUp": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level2",
                "listFormat": {}
            },
            "characterFormat": {
                "fontSize": 13,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496",
                "fontSizeBidi": 13,
                "fontFamilyBidi": "Calibri Light"
            },
            "basedOn": "Normal",
            "link": "Heading 2 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 2 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 13,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496",
                "fontSizeBidi": 13,
                "fontFamilyBidi": "Calibri Light"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 3",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "diagonalDown": {},
                    "diagonalUp": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level3",
                "listFormat": {}
            },
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763",
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Calibri Light"
            },
            "basedOn": "Normal",
            "link": "Heading 3 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 3 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763",
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Calibri Light"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 4",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "diagonalDown": {},
                    "diagonalUp": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level4",
                "listFormat": {}
            },
            "characterFormat": {
                "italic": true,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496",
                "italicBidi": true,
                "fontFamilyBidi": "Calibri Light"
            },
            "basedOn": "Normal",
            "link": "Heading 4 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 4 Char",
            "type": "Character",
            "characterFormat": {
                "italic": true,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496",
                "italicBidi": true,
                "fontFamilyBidi": "Calibri Light"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 5",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "diagonalDown": {},
                    "diagonalUp": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level5",
                "listFormat": {}
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496",
                "fontFamilyBidi": "Calibri Light"
            },
            "basedOn": "Normal",
            "link": "Heading 5 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 5 Char",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496",
                "fontFamilyBidi": "Calibri Light"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 6",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "diagonalDown": {},
                    "diagonalUp": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level6",
                "listFormat": {}
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763",
                "fontFamilyBidi": "Calibri Light"
            },
            "basedOn": "Normal",
            "link": "Heading 6 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 6 Char",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763",
                "fontFamilyBidi": "Calibri Light"
            },
            "basedOn": "Default Paragraph Font"
        }
    ],
    "lists": [],
    "abstractLists": [],
    "comments": [],
    "revisions": [],
    "customXml": [],
    "footnotes": {
        "separator": [
            {
                "paragraphFormat": {
                    "borders": {
                        "top": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "left": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "right": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "bottom": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "diagonalDown": {},
                        "diagonalUp": {},
                        "horizontal": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "vertical": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        }
                    },
                    "styleName": "Normal",
                    "listFormat": {}
                },
                "characterFormat": {},
                "inlines": [
                    {
                        "characterFormat": {},
                        "text": "\u0003"
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
                "paragraphFormat": {
                    "borders": {
                        "top": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "left": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "right": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "bottom": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "diagonalDown": {},
                        "diagonalUp": {},
                        "horizontal": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "vertical": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        }
                    },
                    "styleName": "Normal",
                    "listFormat": {}
                },
                "characterFormat": {},
                "inlines": [
                    {
                        "characterFormat": {},
                        "text": "\u0004"
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "paragraphFormat": {
                    "borders": {
                        "top": {},
                        "left": {},
                        "right": {},
                        "bottom": {},
                        "diagonalDown": {},
                        "diagonalUp": {},
                        "horizontal": {},
                        "vertical": {}
                    },
                    "styleName": "Normal",
                    "listFormat": {}
                },
                "characterFormat": {},
                "inlines": []
            }
        ]
    },
    "endnotes": {
        "separator": [
            {
                "paragraphFormat": {
                    "borders": {
                        "top": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "left": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "right": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "bottom": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "diagonalDown": {},
                        "diagonalUp": {},
                        "horizontal": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "vertical": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        }
                    },
                    "styleName": "Normal",
                    "listFormat": {}
                },
                "characterFormat": {},
                "inlines": [
                    {
                        "characterFormat": {},
                        "text": "\u0003"
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
                "paragraphFormat": {
                    "borders": {
                        "top": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "left": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "right": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "bottom": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "diagonalDown": {},
                        "diagonalUp": {},
                        "horizontal": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        },
                        "vertical": {
                            "hasNoneStyle": false,
                            "lineStyle": "None",
                            "lineWidth": 0,
                            "shadow": false,
                            "space": 0
                        }
                    },
                    "styleName": "Normal",
                    "listFormat": {}
                },
                "characterFormat": {},
                "inlines": [
                    {
                        "characterFormat": {},
                        "text": "\u0004"
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "paragraphFormat": {
                    "borders": {
                        "top": {},
                        "left": {},
                        "right": {},
                        "bottom": {},
                        "diagonalDown": {},
                        "diagonalUp": {},
                        "horizontal": {},
                        "vertical": {}
                    },
                    "styleName": "Normal",
                    "listFormat": {}
                },
                "characterFormat": {},
                "inlines": []
            }
        ]
    }
}
describe('Selection Paragraph format line  spacing apply validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Linespacing Double apply validation', () => {
console.log('Linespacing Double apply validation');
        editor.editor.insertText('Hello World');
        editor.selection.paragraphFormat.lineSpacingType = 'AtLeast';
        editor.selection.paragraphFormat.lineSpacing = 15;
        editor.selection.paragraphFormat.lineSpacing = 2;
        expect(editor.selection.paragraphFormat.lineSpacingType).toBe('Multiple');
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(2);
    });
    it('undo after Linespacing Double apply validation', () => {
console.log('undo after Linespacing Double apply validation');
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(15);
        expect(editor.selection.paragraphFormat.lineSpacingType).toBe('AtLeast');
    });
    it('redo after Linespacing Double apply validation', () => {
console.log('redo after Linespacing Double apply validation');
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.lineSpacingType).toBe('Multiple');
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(2);
    });
});


describe('Selection Paragraph format line  spacing type apply validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('LinespacingType atleast apply validation', () => {
console.log('LinespacingType atleast apply validation');
        editor.editor.insertText('Hello World');
        editor.selection.paragraphFormat.lineSpacing = 2;
        editor.selection.paragraphFormat.lineSpacingType = 'AtLeast';
        expect(editor.selection.paragraphFormat.lineSpacingType).toBe('AtLeast');
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(12);
    });
    it('undo after LinespacingType atleast apply validation', () => {
console.log('undo after LinespacingType atleast apply validation');
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(2);
        expect(editor.selection.paragraphFormat.lineSpacingType).toBe('Multiple');
    });
    it('redo after LinespacingType atleast apply validation', () => {
console.log('redo after LinespacingType atleast apply validation');
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.lineSpacingType).toBe('AtLeast');
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(12);
    });
});

describe('Selection character format with empty paragraph inside', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Character format validation', () => {
console.log('Character format validation');
        
        editor.editor.insertText('Hello World');
        editor.selection.selectAll();
        editor.selection.characterFormat.bold = true;
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.toggleBold();
        editor.editor.insertText('sample');
        expect(editor.selection.characterFormat.bold).toBe(false);
    });
    it('multipl paragraph validation', () => {
console.log('multipl paragraph validation');
        editor.selection.handleShiftUpKey();
        editor.selection.handleShiftUpKey();
        expect(editor.selection.characterFormat.bold).toBeUndefined();
    });
    it('Character format underline validation ', () => {
console.log('Character format underline validation ');
        editor.openBlank();
        editor.selection.selectAll();
        editor.selection.characterFormat.underline = 'Single';
        editor.selection.handleEndKey();
        editor.editor.insertText('Hello World');
        editor.editor.onEnter();
        editor.editor.toggleUnderline('None');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        expect(editor.selection.characterFormat.underline ).toBe('None');
    });
    it('multipl paragraph underline validation', () => {
console.log('multipl paragraph underline validation');
        editor.selection.handleShiftUpKey();
        editor.selection.handleShiftUpKey();
        expect(editor.selection.characterFormat.underline).toBeUndefined();
    });
    it('paragraph format different style validation', () => {
console.log('paragraph format different style validation');
        editor.openBlank();
        editor.editor.applyStyle('Heading 1');
        editor.editor.insertText('Hello world');
        editor.editor.onEnter();
        editor.editor.applyStyle('Normal');
        editor.editor.insertText('sample');
        editor.selection.handleShiftUpKey();
        expect(editor.selection.paragraphFormat.styleName).toBeUndefined();
    });
    it('paragraph format sample style validation', () => {
console.log('paragraph format sample style validation');
        editor.openBlank();
        editor.editor.applyStyle('Heading 1');
        editor.editor.insertText('Hello world');
        editor.editor.onEnter();
        editor.editor.applyStyle('Heading 1')
        editor.editor.insertText('sample');
        editor.selection.handleShiftUpKey();
        expect(editor.selection.paragraphFormat.styleName).toBe('Heading 1');
    });
    it('paragraph format different style with empty paragraph validation', () => {
console.log('paragraph format different style with empty paragraph validation');
        editor.openBlank();
        editor.editor.applyStyle('Heading 1');
        editor.editor.insertText('Hello world');
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.applyStyle('Normal');
        editor.editor.insertText('sample');
        editor.selection.handleShiftUpKey();
        editor.selection.handleShiftUpKey();
        expect(editor.selection.paragraphFormat.styleName).toBeUndefined();
    });
    it('Character format strikethrough validation',()=>{
        console.log("'Character format strikethrough validation'");
        editor.openBlank();
        editor.editor.insertText('hello world');
        editor.editor.onEnter();
        editor.editor.insertText('hello world');
        editor.selection.selectAll();
        editor.editor.applyBullet(String.fromCharCode(61623), 'Symbol');
        expect(editor.selection.characterFormat.strikethrough).toBe('None');
        editor.editor.toggleStrikethrough();
        expect(editor.selection.characterFormat.strikethrough).toBe('SingleStrike');
        editor.editor.toggleStrikethrough();
        expect(editor.selection.characterFormat.strikethrough).toBe('None');
    });
}); 
describe('Selection Paragraph format borders apply validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(json));
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it(' Selection Paragraph format top border validation', () => {
        console.log(' Selection Paragraph format top border validation');
        expect(editor.selection.paragraphFormat.borders.top.color).toBe("#FF0000FF");
        editor.selection.paragraphFormat.borders.top.color="#000000FF";
        expect(editor.selection.paragraphFormat.borders.top.color).toBe("#000000FF");
        expect(editor.selection.paragraphFormat.borders.top.lineStyle).toBe('Single');
    });
    it('Copy Format method of Selection Paragraph format for bottom border color validation', () => {
        console.log('Copy Format method of Selection Paragraph format for bottom border color validation');
        editor.selection.moveDown();
        expect(editor.selection.paragraphFormat.borders.bottom.color).toBe("#FF0000FF");

    });
    it('Copy Format method of Selection Paragraph format for bottom border lineStyle validation', () => {
        console.log('Copy Format method of Selection Paragraph format for bottom border lineStyle validation');
        expect(editor.selection.paragraphFormat.borders.bottom.lineStyle).toBe('Single');
    });
    it('Copy Format method of Selection Paragraph format for bottom border shadow validation', () => {
        console.log('Copy Format method of Selection Paragraph format for bottom border shadow validation');
        expect(editor.selection.paragraphFormat.borders.bottom.shadow).toBe(false);
    });
    it('Copy Format method of Selection Paragraph format for bottom border space validation', () => {
        console.log('Copy Format method of Selection Paragraph format for bottom border space validation');
        expect(editor.selection.paragraphFormat.borders.bottom.space).toBe(1);
    });
    it('Copy Format method of Selection Paragraph format for bottom border lineWidth validation', () => {
        console.log('Copy Format method of Selection Paragraph format for bottom border lineWidth validation');
        expect(editor.selection.paragraphFormat.borders.bottom.lineWidth).toBe(1);
    });
    it('Combine Format method of Selection Paragraph format for top border lineWidth validation', () => {
        console.log('Combine Format method of Selection Paragraph format for top border lineWidth validation');
        editor.selection.moveUp();
        editor.selection.handleShiftDownKey();
        expect(editor.selection.paragraphFormat.borders.top.lineWidth).toBe(undefined);
    });
    it('Combine Format method of Selection Paragraph format for top border color validation', () => {
        console.log('Combine Format method of Selection Paragraph format for top border color validation');
        expect(editor.selection.paragraphFormat.borders.top.color).toBe(undefined);
    });
    it('Combine Format method of Selection Paragraph format for bottom border color validation', () => {
        console.log('Combine Format method of Selection Paragraph format for bottom border color validation');
        editor.selection.handleShiftDownKey();
        expect(editor.selection.paragraphFormat.borders.bottom.color).toBe(undefined);
    });
    it('Combine Format method of Selection Paragraph format for bottom border lineWidth validation', function () {
        console.log('Combine Format method of Selection Paragraph format for bottom border lineWidth validation');
        editor.selection.handleShiftDownKey();
        expect(editor.selection.paragraphFormat.borders.bottom.lineWidth).toBe(1);
    });
    it('Modifying of borders for paragraph format apply validation', function () {
        console.log('Modifying of borders for paragraph format apply validation');
        editor.selection.handleShiftUpKey();
        editor.selection.handleShiftUpKey();
        editor.selection.paragraphFormat.borders.top.color = '#000000FF';
        expect(editor.selection.paragraphFormat.borders.top.color).toBe("#000000FF");
    });
    it('border color for paragraph format undo apply validation', function () {
        console.log('border color for paragraph format undo apply validation');
        editor.selection.paragraphFormat.borders.top.color = '#000000FF';
        editor.editorHistory.undo();
        expect(documentHelper.selection.start.paragraph.paragraphFormat.borders.top.color).toBe("#FF0000FF");
    });
    it('border color for paragraph format redo apply validation', function () {
        console.log('border color for paragraph format redo apply validation');
        editor.editorHistory.redo();
        expect(documentHelper.selection.start.paragraph.paragraphFormat.borders.top.color).toBe("#000000FF");
    });
    it('Multiple undo and redo after apply border color for paragraph format validation', () => {
        console.log('Multiple undo and redo after apply border color for paragraph format validation');
        for (let i: number = 0; i < 5; i++) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
        }
        editor.editorHistory.undo();
        expect(documentHelper.selection.start.paragraph.paragraphFormat.borders.top.color).toBe("#FF0000FF");
    });
    it('Multiple undo and redo after apply border for paragraph format validation', () => {
        console.log('Multiple undo and redo after apply border for paragraph format validation');
        editor.selection.paragraphFormat.borders.bottom.color = '#000000FF';
        editor.selection.paragraphFormat.borders.bottom.lineWidth = 10;
        for (let i: number = 0; i < 1; i++) {
            editor.editorHistory.undo();
        }
        for (let i: number = 0; i < 1; i++) {
            editor.editorHistory.redo();
        }
        editor.editorHistory.undo();
        expect(documentHelper.selection.start.paragraph.paragraphFormat.borders.bottom.color).toBe("#000000FF");
    });
    it('undo and redo of bottom borders for paragraph format apply validation', function () {
        console.log('undo and redo  of bottom borders for paragraph format apply validation');
        editor.selection.paragraphFormat.borders.bottom.color = '#000000FF';
        editor.editorHistory.undo();
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.borders.bottom.color).toBe("#000000FF");
    });
    it('undo and redo of left borders for paragraph format apply validation', function () {
        console.log('undo and redo  of left borders for paragraph format apply validation');
        editor.selection.paragraphFormat.borders.left.color = '#000000FF';
        editor.editorHistory.undo();
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.borders.left.color).toBe("#000000FF");
    });
    it('undo and redo of right borders for paragraph format apply validation', function () {
        console.log('undo and redo  of right borders for paragraph format apply validation');
        editor.selection.paragraphFormat.borders.right.color = '#000000FF';
        editor.editorHistory.undo();
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.borders.right.color).toBe("#000000FF");
    });
    it('undo and redo of horizontal borders for paragraph format apply validation', function () {
        console.log('undo and redo of horizontal borders for paragraph format apply validation');
        editor.selection.paragraphFormat.borders.horizontal.color = '#000000FF';
        editor.editorHistory.undo();
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.borders.horizontal.color).toBe("#000000FF");
    });
    it('undo and redo of vertical borders for paragraph format apply validation', function () {
        console.log('undo and redo of vertical borders for paragraph format apply validation');
        editor.selection.paragraphFormat.borders.vertical.color = '#000000FF';
        editor.editorHistory.undo();
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.borders.vertical.color).toBe("#000000FF");
    });
});

