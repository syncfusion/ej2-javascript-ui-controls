import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget, SfdtExport, Widget } from '../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, TableCellWidget, TextElementBox, TextHelper, RtlInfo, ListTextElementBox, LineWidget, TabElementBox, TextPosition } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { BorderSettings } from '../../src/document-editor/implementation/editor/editor';
let listJson: any = {
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
                        "leftIndent": 36,
                        "firstLineIndent": -18,
                        "styleName": "Normal",
                        "listFormat": {
                            "listId": 0,
                            "listLevelNumber": 0
                        }
                    },
                    "characterFormat": {
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bidi": false
                            },
                            "text": "welcome"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -18,
                        "styleName": "Normal",
                        "listFormat": {
                            "listId": 0,
                            "listLevelNumber": 0
                        }
                    },
                    "characterFormat": {
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bidi": false
                            },
                            "text": "to the new world"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -18,
                        "styleName": "Normal",
                        "listFormat": {
                            "listId": 0,
                            "listLevelNumber": 0
                        }
                    },
                    "characterFormat": {
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bidi": false
                            },
                            "text": "hsdf"
                        }
                    ]
                }
            ],
            "headersFooters": {
                "header": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "listFormat": {
                                }
                            },
                            "characterFormat": {
                            },
                            "inlines": [
                            ]
                        }
                    ]
                },
                "footer": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "listFormat": {
                                }
                            },
                            "characterFormat": {
                            },
                            "inlines": [
                            ]
                        }
                    ]
                },
                "evenHeader": {
                },
                "evenFooter": {
                },
                "firstPageHeader": {
                },
                "firstPageFooter": {
                }
            }
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
        "fontColor": "#000000",
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Calibri"
    },
    "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 0,
        "afterSpacing": 0,
        "lineSpacing": 1,
        "lineSpacingType": "Multiple",
        "listFormat": {
        },
        "bidi": false
    },
    "defaultTabWidth": 36,
    "enforcement": false,
    "hashValue": "",
    "saltValue": "",
    "formatting": false,
    "protectionType": "NoProtection",
    "styles": [
        {
            "name": "Normal",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "next": "Normal"
        },
        {
            "name": "Heading 1",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 12,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level1",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 16,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
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
                "fontColor": "#2F5496"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {
            }
        },
        {
            "name": "Heading 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level2",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 13,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
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
                "fontColor": "#2F5496"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 3",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level3",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763"
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
                "fontColor": "#1F3763"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 4",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level4",
                "listFormat": {
                }
            },
            "characterFormat": {
                "italic": true,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
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
                "fontColor": "#2F5496"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 5",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level5",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
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
                "fontColor": "#2F5496"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 6",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level6",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763"
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
                "fontColor": "#1F3763"
            },
            "basedOn": "Default Paragraph Font"
        }
    ],
    "lists": [
        {
            "abstractListId": 0,
            "listId": 0
        }
    ],
    "abstractLists": [
        {
            "abstractListId": 0,
            "levels": [
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.",
                    "restartLevel": 0,
                    "startAt": 1
                }
            ]
        }
    ]
};
let rtlJson: any = {
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
                        "textAlignment": "Right",
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {
                        },
                        "bidi": true
                    },
                    "characterFormat": {
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bidi": true
                            },
                            "text": "חגעע"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "textAlignment": "Right",
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {
                        },
                        "bidi": true
                    },
                    "characterFormat": {
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bidi": true
                            },
                            "text": "גכעגכע"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "textAlignment": "Right",
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {
                        },
                        "bidi": true
                    },
                    "characterFormat": {
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bidi": true
                            },
                            "text": "גכעגע"
                        }
                    ]
                }
            ],
            "headersFooters": {
                "header": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "listFormat": {
                                }
                            },
                            "characterFormat": {
                            },
                            "inlines": [
                            ]
                        }
                    ]
                },
                "footer": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "listFormat": {
                                }
                            },
                            "characterFormat": {
                            },
                            "inlines": [
                            ]
                        }
                    ]
                },
                "evenHeader": {
                },
                "evenFooter": {
                },
                "firstPageHeader": {
                },
                "firstPageFooter": {
                }
            }
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
        "fontColor": "#000000",
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Calibri"
    },
    "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 0,
        "afterSpacing": 0,
        "lineSpacing": 1,
        "lineSpacingType": "Multiple",
        "listFormat": {
        },
        "bidi": false
    },
    "defaultTabWidth": 36,
    "enforcement": false,
    "hashValue": "",
    "saltValue": "",
    "formatting": false,
    "protectionType": "NoProtection",
    "styles": [
        {
            "name": "Normal",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "next": "Normal"
        },
        {
            "name": "Heading 1",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 12,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level1",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 16,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
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
                "fontColor": "#2F5496"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {
            }
        },
        {
            "name": "Heading 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level2",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 13,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
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
                "fontColor": "#2F5496"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 3",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level3",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763"
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
                "fontColor": "#1F3763"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 4",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level4",
                "listFormat": {
                }
            },
            "characterFormat": {
                "italic": true,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
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
                "fontColor": "#2F5496"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 5",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level5",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
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
                "fontColor": "#2F5496"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 6",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level6",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763"
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
                "fontColor": "#1F3763"
            },
            "basedOn": "Default Paragraph Font"
        }
    ],
    "lists": [
    ],
    "abstractLists": [
    ]
};
/**
 * RTL with list format validation.
 */
describe('Rtl text with list format validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
        }, 1000);
    });
    it('Apply list on empty selection in para bidi', () => {
console.log('Apply list on empty selection in para bidi');
        editor.editorModule.onApplyParagraphFormat('bidi', true, false, false);
        editor.editor.applyNumbering('%1.', 'Arabic');
        expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).toBe('\t');
    });
    it('Apply tab key for the list format to change the list level', () => {
console.log('Apply tab key for the list format to change the list level');
        editor.open(JSON.stringify(rtlJson));
        editor.selection.selectAll();
        editor.editor.applyNumbering('%1.', 'Arabic');
        editor.selection.handleDownKey();
        editor.selection.handleUpKey();
        editor.selection.handleHomeKey();
        editor.selection.handleTabKey(false, false);
        expect(((editor.selection.start.currentWidget.paragraph.nextWidget.childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('גכעגע');
    });
    it('Apply bidi for the paragraphs with list', () => {
console.log('Apply bidi for the paragraphs with list');
        editor.open(JSON.stringify(listJson));
        editor.selection.selectAll();
        editor.editorModule.onApplyParagraphFormat('bidi', true, false, false);
        expect((editor.selection.start.currentWidget.children[editor.selection.start.currentWidget.children.length - 1] as TextElementBox).text).toBe('welcome');
        expect((editor.selection.start.currentWidget.layoutedElements[0] as TextElementBox).text).toBe('welcome');
    });
    it('Test undo for the list with para', () => {
console.log('Test undo for the list with para');
        editor.editorHistory.undo();
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('1.');
    });
    it('Test redo for the list with para', () => {
console.log('Test redo for the list with para');
        editor.editorHistory.redo();
        expect((editor.selection.start.currentWidget.children[editor.selection.start.currentWidget.children.length - 1] as TextElementBox).text).toBe('welcome');
        expect((editor.selection.start.currentWidget.layoutedElements[0] as TextElementBox).text).toBe('welcome');
    });
    it('Apply tab to move to next line', () => {
console.log('Apply tab to move to next line');
        editor.selection.handleDownKey();
        editor.selection.handleControlHomeKey();
        editor.selection.handleHomeKey();
        for (let i: number = 0; i <= 12; i++) {
            editor.selection.handleTabKey(false, false);
        }
        expect(((editor.selection.start.currentWidget.paragraph.nextWidget.childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('to the new world');
    });
});

describe('Rtl text with list format validation 2', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
        }, 1000);
    });
    it('Apply tab on first element of RTL para', () => {
console.log('Apply tab on first element of RTL para');
        editor.open(JSON.stringify(rtlJson));
        editor.selection.selectAll();
        editor.editor.applyNumbering('%1.', 'Arabic');
        editor.selection.handleDownKey();
        editor.selection.handleTabKey(false, false);
        expect(((editor.selection.start.currentWidget as LineWidget).children[0] as TabElementBox).text).toBe('\t');
    });
    it('Test Undo tab applied on the last element', () => {
console.log('Test Undo tab applied on the last element');
        editor.editorHistory.undo();
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('גכעגע');
    });
    it('Test redo applied on the last element', () => {
console.log('Test redo applied on the last element');
        editor.editorHistory.redo();
        expect((editor.selection.start.currentWidget.children[0] as TabElementBox).text).toBe('\t');
    });
});

describe('Paste content validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, isReadOnly: false, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
        }, 1000);
    });
    it('Paste content validation if the result is null', () => {
console.log('Paste content validation if the result is null');
        (editor.editor as any).copiedTextContent = "Hello world";
        (editor.editor as any).pasteFormattedContent({ data: null });
        expect(((editor.selection.start.currentWidget as LineWidget).children[0] as TextElementBox).text).toBe('Hello world');
    });
});

describe('Paste Text Formatting formatting option', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
        }, 1000);
    });
    it('Paste Text Formatting formatting option', () => {
console.log('Paste Text Formatting formatting option');
        (editor.editor as any).copiedTextContent = 'Welcome to the new world';
        (editor.editor as any).copiedContent = '';
        (editor.editor as any).pasteContents((editor.editor as any).copiedTextContent);
        (editor.editor as any).applyPasteOptions('KeepSourceFormatting');
        expect((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children.length).toBe(1);
    });
});
/**
 * Toc content creation validation.
 */
describe('Toc content creation validation', () => {
    let editor: DocumentEditor = undefined;
    let tocSettings: TableOfContentsSettings = {
        startLevel: 1,
        endLevel: 3,
        includeHyperlink: true,
        includePageNumber: true,
        rightAlign: true
    };
    let text: string = "welcome";
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, enableEditorHistory: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
        }, 1000);
    });
    it('Applying style on selection including para mark and inserting Toc', () => {
console.log('Applying style on selection including para mark and inserting Toc');
        editor.editor.insertText(text);
        editor.selection.selectAll();
        editor.editor.applyStyle('Heading 1');
        editor.selection.handleHomeKey();
        editor.editor.handleEnterKey();
        editor.selection.handleUpKey();
        editor.editor.insertTableOfContents(tocSettings);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[6] as TextElementBox).text).toBe(text);
    });
    it('Applying style on selection not including para mark and inserting Toc', () => {
console.log('Applying style on selection not including para mark and inserting Toc');
        editor.openBlank();
        editor.editor.insertText(text);
        editor.selection.handleHomeKey();
        editor.selection.selectCurrentWord();
        editor.editor.applyStyle('Heading 1');
        editor.selection.handleHomeKey();
        editor.editor.handleEnterKey();
        editor.selection.handleUpKey();
        editor.editor.insertTableOfContents(tocSettings);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[6] as TextElementBox).text).toBe(text);
    });
});

describe('Paste Heading content and TOC validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, enableEditorHistory: true, isReadOnly: false, enableSfdtExport: true, enableLocalPaste: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
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
        }, 500);
    });
    it('Copy Paste Heading and Inserting TOC', () => {
console.log('Copy Paste Heading and Inserting TOC');
        editor.editor.insertText('Heading1');
        editor.selection.selectAll();
        editor.editor.applyStyle('Heading 1');
        editor.selection.copy();
        editor.selection.handleRightKey();
        editor.editor.onEnter();
        editor.editor.paste();
        editor.selection.handleUpKey();
        editor.selection.handleHomeKey();
        editor.editor.onEnter();
        editor.selection.handleUpKey();
        editor.editor.insertTableOfContents();
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(6);
    });
    it('Copy Paste word in paragraph', () => {
console.log('Copy Paste word in paragraph');
        editor.openBlank();
        editor.editor.insertText('Hello World');
        editor.selection.selectAll();
        editor.editor.applyStyle('Heading 1');
        editor.selection.handleRightKey();
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        editor.selection.copy();
        editor.selection.handleRightKey();
        editor.editor.onEnter();
        editor.editor.paste();
        expect(editor.selection.paragraphFormat.styleName).toBe('Normal');
    });
    it('Copy Paste whole paragraph', () => {
console.log('Copy Paste whole paragraph');
        editor.openBlank();
        editor.editor.insertText('Hello World');
        editor.selection.selectAll();
        editor.editor.applyStyle('Heading 1');
        editor.selection.copy();
        editor.selection.handleRightKey();
        editor.editor.onEnter();
        editor.editor.paste();
        expect(editor.selection.paragraphFormat.styleName).toBe('Heading 1');
    });
});

// undo and redo validation for list

describe('apply list to rtl paragraph with history validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, isReadOnly: false, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
        }, 1000);
    });
//     it('apply RTL', () => {
// console.log('apply RTL');
//         editor.selection.paragraphFormat.bidi = true;
//         editor.editor.insertText('יקךךם');
//         editor.editor.onEnter();
//         editor.editor.insertText('יקךךם');
//         editor.editor.onEnter();
//         editor.editor.insertText('יקךךם');
//         editor.selection.selectAll();
//         editor.editor.applyNumbering('%1.', 'Arabic');
//         editor.selection.handleDownKey();
//         editor.selection.handleHomeKey();
//         editor.selection.handleUpKey();
//         editor.selection.handleTabKey(true, false);
//         expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
//         expect(((editor.selection.start.paragraph.nextWidget as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(3);
//     });
    it('undo after list apply to RTL', () => {
console.log('undo after list apply to RTL');
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);

    });
//     it('redo after list apply to RTL', () => {
// console.log('redo after list apply to RTL');
//         editor.editorHistory.redo();
//         expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);

//     });
    it('Footer widgets y position validation', () => {
console.log('Footer widgets y position validation');
        editor.openBlank();
        editor.selection.goToFooter();
        editor.editor.insertTable(2,2);
        editor.editor.insertText('Check');
        expect((editor.documentHelper.pages[0].footerWidget.childWidgets[0] as Widget).y).toBeLessThan((editor.documentHelper.pages[0].footerWidget.childWidgets[1] as Widget).y);
    });
});
