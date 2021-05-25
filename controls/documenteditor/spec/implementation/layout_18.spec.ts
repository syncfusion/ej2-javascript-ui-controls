import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { DocumentHelper, Editor, LineWidget, ParagraphWidget, Selection, TabElementBox, TableRowWidget, TableWidget, EditorHistory } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
describe('Merge cell index validtaion', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
    it('Row merge index validation', () => {
        editor.openBlank();
        editor.editor.insertTable(45, 2);
        editor.editor.handleEnterKey();
        editor.editor.handleEnterKey();
        editor.editor.handleEnterKey();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[42] as TableRowWidget).index).toBe(42);
    });
});
describe('Track changes revision validation for justify alignment', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
    it('Track changes revision validation for justify alignmentTrack changes revision validation for justify alignment', () => {
        editor.openBlank();
        editor.editor.insertText('Syncfusion');
        editor.selection.handleHomeKey();
        editor.selection.selectAll();
        editor.selection.paragraphFormat.textAlignment = 'Justify';
        editor.selection.handleHomeKey();
        editor.enableTrackChanges = true;
        editor.editor.insertText('Hello');
        editor.editor.insertText(' ');
        editor.editor.insertText('World');
        expect((editor.documentHelper.revisionsInternal as any).valuesInternal[0].range[0].text).toBe('Hello ');
        expect((editor.documentHelper.revisionsInternal as any).valuesInternal[0].range[1].text).toBe('World');
    });
});
let tabstop: any = {
    "sections": [
        {
            "blocks": [
                {
                    "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "text": "_________________________________________"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "text": "\t"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "text": "           "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "styleName": "DPSTNR10",
                        "listFormat": {}
                    },
                    "characterFormat": {},
                    "inlines": [
                        {
                            "characterFormat": {},
                            "text": "_________________________________________"
                        },
                        {
                            "characterFormat": {},
                            "text": "\t"
                        },
                        {
                            "characterFormat": {},
                            "text": "           "
                        }
                    ]
                }
            ],
            "headersFooters": {}
        }
    ],
    "defaultTabWidth": 35.45000076293945,
    "styles": [
        {
            "name": "Normal",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {}
            },
            "characterFormat": {
                "fontColor": "empty"
            },
            "next": "Normal"
        },
        {
            "name": "DPSTNR10 Char",
            "type": "Character",
            "characterFormat": {
                "fontColor": "empty"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "DPSTNR10",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {}
            },
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Times New Roman",
                "fontColor": "#000000FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "next": "DPSTNR10"
        }
    ]
};
describe('Tab width calculation validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
    it('Tab width calculation validation', () => {
        editor.open(JSON.stringify(tabstop));
        //tab element width is different for element with normal style
        expect(Math.round((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as TabElementBox).width)).toBe(30);
        //tab element width is different for element with font size 10 and font family time new roman
        expect(Math.round((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as TabElementBox).width)).toBe(10);
    });
});
let sectionbreak: any = {
    "sections": [
      {
        "blocks": [
          {
            "paragraphFormat": {
              "styleName": "Normal",
              "listFormat": {}
            },
            "characterFormat": {
              "fontColor": "empty"
            },
            "inlines": [
              {
                "characterFormat": {
                  "fontColor": "empty"
                },
                "text": "Page break"
              }
            ]
          },
          {
            "paragraphFormat": {
              "styleName": "Normal",
              "listFormat": {}
            },
            "characterFormat": {
              "fontColor": "empty"
            },
            "inlines": [
              {
                "characterFormat": {
                  "fontColor": "empty"
                },
                "text": "\f"
              }
            ]
          }
        ]
      }
    ]
  };  
describe('Page break and section break validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
    it('Page break and section break validation', () => {
        editor.open(JSON.stringify(sectionbreak));
        //if section break come before page break only one page shoul be added and one should be skipped
        expect(editor.documentHelper.pages.length).toBe(2);
    });
});
describe('Table with merged cell spilts into page validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
    it('Table with merged cell spilts into page validation', () => {
        editor.editor.insertTable(10, 4);
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.editor.mergeCells();
        editor.editor.onEnter();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.onEnter();
        expect(() => { editor.editor.onEnter(); }).not.toThrowError();
    });
});
    let json: any = {
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
                    "bidi": false,
                    "restartPageNumbering": false,
                    "pageStartingNumber": 0,
                    "endnoteNumberFormat": "LowerCaseRoman",
                    "footNoteNumberFormat": "Arabic",
                    "restartIndexForFootnotes": "DoNotRestart",
                    "restartIndexForEndnotes": "DoNotRestart",
                    "initialFootNoteNumber": 1,
                    "initialEndNoteNumber": 1
                },
                "blocks": [
                    {
                        "rows": [
                            {
                                "cells": [
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {
                                                    "styleName": "Normal",
                                                    "listFormat": {}
                                                },
                                                "characterFormat": {},
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "bidi": false
                                                        },
                                                        "text": "dfihgdishg"
                                                    },
                                                    {
                                                        "footnoteType": "Footnote",
                                                        "characterFormat": {
                                                            "baselineAlignment": "Superscript"
                                                        },
                                                        "blocks": [
                                                            {
                                                                "paragraphFormat": {
                                                                    "listFormat": {}
                                                                },
                                                                "characterFormat": {},
                                                                "inlines": [
                                                                    {
                                                                        "characterFormat": {
                                                                            "baselineAlignment": "Superscript"
                                                                        },
                                                                        "text": "1"
                                                                    },
                                                                    {
                                                                        "characterFormat": {},
                                                                        "text": " "
                                                                    },
                                                                    {
                                                                        "characterFormat": {
                                                                            "bidi": false
                                                                        },
                                                                        "text": "dfgdsghdsjfsd"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "cellFormat": {
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
                                            "shading": {},
                                            "preferredWidth": 468,
                                            "cellWidth": 468,
                                            "columnSpan": 1,
                                            "rowSpan": 1
                                        },
                                        "columnIndex": 0
                                    }
                                ],
                                "rowFormat": {
                                    "height": 0,
                                    "heightType": "Auto",
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
                                    "gridBefore": 0,
                                    "gridAfter": 0
                                }
                            }
                        ],
                        "grid": [
                            468
                        ],
                        "tableFormat": {
                            "borders": {
                                "top": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5
                                },
                                "left": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5
                                },
                                "right": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5
                                },
                                "bottom": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5
                                },
                                "diagonalDown": {},
                                "diagonalUp": {},
                                "horizontal": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5
                                },
                                "vertical": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5
                                }
                            },
                            "shading": {},
                            "topMargin": 0,
                            "rightMargin": 5.4,
                            "leftMargin": 5.4,
                            "bottomMargin": 0,
                            "preferredWidthType": "Auto"
                        },
                        "columnCount": 1
                    },
                    {
                        "paragraphFormat": {
                            "styleName": "Normal",
                            "listFormat": {}
                        },
                        "characterFormat": {},
                        "inlines": []
                    }
                ],
                "headersFooters": {
                    "header": {
                        "blocks": [
                            {
                                "paragraphFormat": {
                                    "listFormat": {}
                                },
                                "characterFormat": {},
                                "inlines": []
                            }
                        ]
                    },
                    "footer": {
                        "blocks": [
                            {
                                "paragraphFormat": {
                                    "listFormat": {}
                                },
                                "characterFormat": {},
                                "inlines": []
                            }
                        ]
                    },
                    "evenHeader": {},
                    "evenFooter": {},
                    "firstPageHeader": {},
                    "firstPageFooter": {}
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
            "fontColor": "empty",
            "boldBidi": false,
            "italicBidi": false,
            "fontSizeBidi": 11,
            "fontFamilyBidi": "Calibri",
            "allCaps": false
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
            "listFormat": {},
            "bidi": false
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
        "styles": [
            {
                "name": "Normal",
                "type": "Paragraph",
                "paragraphFormat": {
                    "listFormat": {}
                },
                "characterFormat": {},
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
                    "lineSpacing": 1.0791666507720948,
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
                "name": "Default Paragraph Font",
                "type": "Character",
                "characterFormat": {}
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
                    "lineSpacing": 1.0791666507720948,
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
                    "leftIndent": 0,
                    "rightIndent": 0,
                    "firstLineIndent": 0,
                    "textAlignment": "Left",
                    "beforeSpacing": 2,
                    "afterSpacing": 0,
                    "lineSpacing": 1.0791666507720948,
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
                    "leftIndent": 0,
                    "rightIndent": 0,
                    "firstLineIndent": 0,
                    "textAlignment": "Left",
                    "beforeSpacing": 2,
                    "afterSpacing": 0,
                    "lineSpacing": 1.0791666507720948,
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
                    "leftIndent": 0,
                    "rightIndent": 0,
                    "firstLineIndent": 0,
                    "textAlignment": "Left",
                    "beforeSpacing": 2,
                    "afterSpacing": 0,
                    "lineSpacing": 1.0791666507720948,
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
                    "leftIndent": 0,
                    "rightIndent": 0,
                    "firstLineIndent": 0,
                    "textAlignment": "Left",
                    "beforeSpacing": 2,
                    "afterSpacing": 0,
                    "lineSpacing": 1.0791666507720948,
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
                        "listFormat": {}
                    },
                    "characterFormat": {},
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "text": "\u0003"
                        }
                    ]
                }
            ],
            "continuationSeparator": [
                {
                    "paragraphFormat": {
                        "listFormat": {}
                    },
                    "characterFormat": {},
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "text": "\u0004"
                        }
                    ]
                }
            ]
        }
    }
describe('Table with Footnote Layout validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
    it('Table with Footnote Layout validation', () => {
        editor.open(JSON.stringify(json));
        //editor.editor.insertTable(1, 1);
        //editor.editor.insertFootnote();
        //editor.editor.insertText("thanver");
        expect(editor.documentHelper.layout.footHeight).toBeGreaterThan(0);
    });
});
describe('List update validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
    it('List update validation', () => {
        editor.editorModule.insertText('hello');
        editor.selection.selectAll();
        editor.editorModule.applyBulletOrNumbering('%1.', 'Arabic', 'Verdana');
        editor.selection.selectAll();
        editor.editorModule.applyBulletOrNumbering('%1.', 'UpLetter', 'Verdana');
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as any).childWidgets[0] as any).children[0] as any).text).toBe('A.');
    });    
});
describe('Tab after list element width calculation validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
    it('Tab after list element width calculation validation', () => {
        editor.editor.insertText('check');
        editor.selection.selectAll();
        editor.editor.applyNumbering('%1.', 'UpLetter');
        expect(Math.round((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as any).width)).toBe(10);
    });
})
describe('Field end element validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableEditorHistory: true });
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
    it('Field end element validation', () => {
        editor.openBlank();
        editor.editor.insertField('MERGEFIELD ' + 'Field1' + ' \\* MERGEFORMAT');
        editor.editor.onEnter();
        editor.editor.insertField('MERGEFIELD ' + 'Field2' + ' \\* MERGEFORMAT');
        editor.selection.handleHomeKey();
        editor.selection.handleUpKey();
        editor.selection.handleControlRightKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget).y).toBe(112);
    });    
});

describe('Layout shape with', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableEditorHistory: true });
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
        }, 700);
    });
    it('Square wrapping style', () => {
        let sfdtContent = "{\"sections\":[{\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"shapeId\":3,\"name\":\"Text Box 3\",\"visible\":true,\"width\":94.32,\"height\":46.8,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":90.5,\"verticalOrigin\":\"Page\",\"verticalAlignment\":\"None\",\"horizontalPosition\":91.5,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251666432,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":true,\"distanceBottom\":0,\"distanceLeft\":21.6,\"distanceRight\":21.6,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"shapeId\":2,\"name\":\"Text Box 2\",\"visible\":true,\"width\":94.15,\"height\":47.05,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":90.5,\"verticalOrigin\":\"Page\",\"verticalAlignment\":\"None\",\"horizontalPosition\":91.5,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251659264,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":50,\"distanceRight\":40,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"text\":\"Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.\",\"characterFormat\":{\"fontColor\":\"empty\"}}]},{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"shapeId\":4,\"name\":\"Text Box 4\",\"visible\":true,\"width\":63.65,\"height\":72,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":28.55,\"verticalOrigin\":\"Paragraph\",\"verticalAlignment\":\"None\",\"horizontalPosition\":242.5,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251664384,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":9,\"distanceRight\":9,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"shapeId\":1,\"name\":\"Text Box 1\",\"visible\":true,\"width\":94.15,\"height\":47.05,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":31.55,\"verticalOrigin\":\"Paragraph\",\"verticalAlignment\":\"None\",\"horizontalPosition\":76,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251661312,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":50,\"distanceRight\":40,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"text\":\"Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.\",\"characterFormat\":{\"fontColor\":\"empty\"}}]},{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"shapeId\":6,\"name\":\"Text Box 6\",\"visible\":true,\"width\":94.32,\"height\":46.8,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":311.85,\"verticalOrigin\":\"Page\",\"verticalAlignment\":\"None\",\"horizontalPosition\":40,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251670528,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":0,\"distanceRight\":0,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"shapeId\":5,\"name\":\"Text Box 5\",\"visible\":true,\"width\":94.32,\"height\":46.8,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":306.35,\"verticalOrigin\":\"Page\",\"verticalAlignment\":\"None\",\"horizontalPosition\":249.5,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251668480,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":7.2,\"distanceRight\":7.2,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"text\":\"Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.\",\"characterFormat\":{\"fontColor\":\"empty\"}}]},{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"textAlignment\":\"Justify\",\"styleName\":\"Normal\"},\"inlines\":[{\"shapeId\":11,\"name\":\"Text Box 11\",\"visible\":true,\"width\":94.32,\"height\":46.8,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":506.7,\"verticalOrigin\":\"Page\",\"verticalAlignment\":\"None\",\"horizontalPosition\":-19.5,\"horizontalOrigin\":\"Margin\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251679744,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":0,\"distanceRight\":0,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"shapeId\":10,\"name\":\"Text Box 10\",\"visible\":true,\"width\":94.32,\"height\":46.8,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":417.3,\"verticalOrigin\":\"Page\",\"verticalAlignment\":\"None\",\"horizontalPosition\":65,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251677696,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":0,\"distanceRight\":0,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"shapeId\":9,\"name\":\"Text Box 9\",\"visible\":true,\"width\":94.32,\"height\":46.8,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":419.8,\"verticalOrigin\":\"Page\",\"verticalAlignment\":\"None\",\"horizontalPosition\":279.5,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251675648,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":0,\"distanceRight\":0,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"shapeId\":7,\"name\":\"Text Box 7\",\"visible\":true,\"width\":94.32,\"height\":46.8,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":311.85,\"verticalOrigin\":\"Page\",\"verticalAlignment\":\"None\",\"horizontalPosition\":40,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251673600,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":0,\"distanceRight\":0,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"shapeId\":8,\"name\":\"Text Box 8\",\"visible\":true,\"width\":94.32,\"height\":46.8,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":306.35,\"verticalOrigin\":\"Page\",\"verticalAlignment\":\"None\",\"horizontalPosition\":249.5,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251672576,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":7.2,\"distanceRight\":7.2,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"text\":\"Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.\",\"characterFormat\":{\"fontColor\":\"empty\"}}]},{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"textAlignment\":\"Justify\",\"styleName\":\"Normal\"},\"inlines\":[]},{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[]}],\"headersFooters\":{\"header\":{\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Header\"},\"inlines\":[{\"text\":\" \",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]},\"footer\":{\"blocks\":[{\"inlines\":[]}]},\"evenHeader\":{\"blocks\":[{\"inlines\":[]}]},\"evenFooter\":{\"blocks\":[{\"inlines\":[]}]},\"firstPageHeader\":{\"blocks\":[{\"inlines\":[]}]},\"firstPageFooter\":{\"blocks\":[{\"inlines\":[]}]}},\"sectionFormat\":{\"headerDistance\":36,\"footerDistance\":36,\"pageWidth\":612,\"pageHeight\":792,\"leftMargin\":72,\"rightMargin\":72,\"topMargin\":72,\"bottomMargin\":72,\"differentFirstPage\":false,\"differentOddAndEvenPages\":false,\"bidi\":false,\"restartPageNumbering\":false,\"pageStartingNumber\":0,\"endnoteNumberFormat\":\"LowerCaseRoman\",\"footNoteNumberFormat\":\"Arabic\",\"restartIndexForFootnotes\":\"DoNotRestart\",\"restartIndexForEndnotes\":\"DoNotRestart\"}}],\"characterFormat\":{\"fontSize\":11,\"fontFamily\":\"Calibri\",\"fontColor\":\"empty\",\"fontSizeBidi\":11,\"fontFamilyBidi\":\"Arial\"},\"paragraphFormat\":{\"afterSpacing\":8,\"lineSpacing\":1.0791666507720947,\"lineSpacingType\":\"Multiple\"},\"background\":{\"color\":\"#FFFFFFFF\"},\"styles\":[{\"type\":\"Paragraph\",\"name\":\"Normal\",\"next\":\"Normal\",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"type\":\"Character\",\"name\":\"Default Paragraph Font\",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"type\":\"Paragraph\",\"name\":\"Header\",\"basedOn\":\"Normal\",\"next\":\"Header\",\"link\":\"Header Char\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"afterSpacing\":0,\"lineSpacing\":1,\"lineSpacingType\":\"Multiple\",\"tabs\":[{\"tabJustification\":\"Center\",\"position\":234,\"tabLeader\":\"None\",\"deletePosition\":0},{\"tabJustification\":\"Right\",\"position\":468,\"tabLeader\":\"None\",\"deletePosition\":0}]}},{\"type\":\"Character\",\"name\":\"Header Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"type\":\"Paragraph\",\"name\":\"Footer\",\"basedOn\":\"Normal\",\"next\":\"Footer\",\"link\":\"Footer Char\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"afterSpacing\":0,\"lineSpacing\":1,\"lineSpacingType\":\"Multiple\",\"tabs\":[{\"tabJustification\":\"Center\",\"position\":234,\"tabLeader\":\"None\",\"deletePosition\":0},{\"tabJustification\":\"Right\",\"position\":468,\"tabLeader\":\"None\",\"deletePosition\":0}]}},{\"type\":\"Character\",\"name\":\"Footer Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"fontColor\":\"empty\"}}],\"defaultTabWidth\":36,\"formatting\":false,\"trackChanges\":false,\"protectionType\":\"NoProtection\",\"enforcement\":false,\"dontUseHTMLParagraphAutoSpacing\":false,\"alignTablesRowByRow\":false,\"formFieldShading\":true,\"footnotes\":{\"separator\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"afterSpacing\":0,\"lineSpacing\":1,\"lineSpacingType\":\"Multiple\",\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"\\u0003\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}],\"continuationSeparator\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"afterSpacing\":0,\"lineSpacing\":1,\"lineSpacingType\":\"Multiple\",\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"\\u0004\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}],\"continuationNotice\":[{\"inlines\":[]}]},\"endnotes\":{\"separator\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"afterSpacing\":0,\"lineSpacing\":1,\"lineSpacingType\":\"Multiple\",\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"\\u0003\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}],\"continuationSeparator\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"afterSpacing\":0,\"lineSpacing\":1,\"lineSpacingType\":\"Multiple\",\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"\\u0004\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}],\"continuationNotice\":[{\"inlines\":[]}]}}"
        editor.open(sfdtContent);
        expect(editor.documentHelper.pages.length).toBe(1);
    });
    it("Square wrapping split by character", () => {
        let sfdtContent = "{\"sections\":[{\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"shapeId\":2,\"name\":\"Text Box 2\",\"visible\":true,\"width\":94.15,\"height\":47.05,\"widthScale\":100.0,\"heightScale\":100.0,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":77.0,\"verticalOrigin\":\"Page\",\"verticalAlignment\":\"None\",\"horizontalPosition\":152.5,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251659264,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0.0,\"distanceLeft\":50.0,\"distanceRight\":40.0,\"distanceTop\":0.0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]},\"isTextBox\":true},{\"text\":\"ALKENGLWKENLLKNWLEKGNWLEGKNLKQENGLQKENGLQKENGQEGPQOEGPQENGNLQKENGLQKGNQLKEGNLQEKGLQEKNGQLEGNL\",\"characterFormat\":{\"fontColor\":\"empty\"}}]},{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[]}],\"headersFooters\":{\"header\":{\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Header\"},\"inlines\":[{\"text\":\" \",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]},\"footer\":{\"blocks\":[{\"inlines\":[]}]},\"evenHeader\":{\"blocks\":[{\"inlines\":[]}]},\"evenFooter\":{\"blocks\":[{\"inlines\":[]}]},\"firstPageHeader\":{\"blocks\":[{\"inlines\":[]}]},\"firstPageFooter\":{\"blocks\":[{\"inlines\":[]}]}},\"sectionFormat\":{\"headerDistance\":36.0,\"footerDistance\":36.0,\"pageWidth\":612.0,\"pageHeight\":792.0,\"leftMargin\":72.0,\"rightMargin\":72.0,\"topMargin\":72.0,\"bottomMargin\":72.0,\"differentFirstPage\":false,\"differentOddAndEvenPages\":false,\"bidi\":false,\"restartPageNumbering\":false,\"pageStartingNumber\":0,\"endnoteNumberFormat\":\"LowerCaseRoman\",\"footNoteNumberFormat\":\"Arabic\",\"restartIndexForFootnotes\":\"DoNotRestart\",\"restartIndexForEndnotes\":\"DoNotRestart\"}}],\"characterFormat\":{\"fontSize\":11.0,\"fontFamily\":\"Calibri\",\"fontColor\":\"empty\",\"fontSizeBidi\":11.0,\"fontFamilyBidi\":\"Arial\"},\"paragraphFormat\":{\"afterSpacing\":8.0,\"lineSpacing\":1.0791666507720947,\"lineSpacingType\":\"Multiple\"},\"background\":{\"color\":\"#FFFFFFFF\"},\"styles\":[{\"type\":\"Paragraph\",\"name\":\"Normal\",\"next\":\"Normal\",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"type\":\"Character\",\"name\":\"Default Paragraph Font\",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"type\":\"Paragraph\",\"name\":\"Header\",\"basedOn\":\"Normal\",\"next\":\"Header\",\"link\":\"Header Char\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"afterSpacing\":0.0,\"lineSpacing\":1.0,\"lineSpacingType\":\"Multiple\",\"tabs\":[{\"tabJustification\":\"Center\",\"position\":234.0,\"tabLeader\":\"None\",\"deletePosition\":0.0},{\"tabJustification\":\"Right\",\"position\":468.0,\"tabLeader\":\"None\",\"deletePosition\":0.0}]}},{\"type\":\"Character\",\"name\":\"Header Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"fontColor\":\"empty\"}}],\"defaultTabWidth\":36.0,\"formatting\":false,\"trackChanges\":false,\"protectionType\":\"NoProtection\",\"enforcement\":false,\"dontUseHTMLParagraphAutoSpacing\":false,\"alignTablesRowByRow\":false,\"formFieldShading\":true,\"footnotes\":{\"separator\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"\\u0003\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}],\"continuationSeparator\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"\\u0004\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}],\"continuationNotice\":[{\"inlines\":[]}]},\"endnotes\":{\"separator\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"\\u0003\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}],\"continuationSeparator\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"\\u0004\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}],\"continuationNotice\":[{\"inlines\":[]}]}}"
        editor.open(sfdtContent);
        expect(editor.documentHelper.pages.length).toBe(1);
        let firstParagrap = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget;
        expect(firstParagrap.y).toBeGreaterThan(96);
        let shapeBottom: number = firstParagrap.floatingElements[0].y + firstParagrap.floatingElements[0].height;
        expect(firstParagrap.y).toBe(shapeBottom);
    });
    it('Square wrapping shape exceed page width', () => {
        let sfdtContent = "{\"sections\":[{\"blocks\":[{\"characterFormat\":{\"bold\":true,\"fontSize\":12.0,\"fontFamily\":\"Calibri\",\"fontColor\":\"empty\",\"fontSizeBidi\":12.0},\"paragraphFormat\":{\"beforeSpacing\":12.0,\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"PURCHASER IDENTIFICATION INFORMATION\",\"characterFormat\":{\"bold\":true,\"fontSize\":12.0,\"fontFamily\":\"Calibri\",\"fontColor\":\"empty\",\"fontSizeBidi\":12.0}}]},{\"characterFormat\":{\"fontFamily\":\"Calibri\",\"fontColor\":\"empty\"},\"paragraphFormat\":{\"beforeSpacing\":12.0,\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Complete for \",\"characterFormat\":{\"fontFamily\":\"Calibri\",\"fontColor\":\"empty\"}},{\"text\":\"each individual\",\"characterFormat\":{\"bold\":true,\"highlightColor\":\"Yellow\",\"fontFamily\":\"Calibri\",\"fontColor\":\"empty\"}},{\"text\":\" signing the agreement of purchase and sale \",\"characterFormat\":{\"fontFamily\":\"Calibri\",\"fontColor\":\"empty\"}}]},{\"characterFormat\":{\"bold\":true,\"fontSize\":12.0,\"fontFamily\":\"Calibri\",\"fontColor\":\"empty\",\"fontSizeBidi\":12.0},\"paragraphFormat\":{\"beforeSpacing\":12.0,\"styleName\":\"Normal\"},\"inlines\":[{\"shapeId\":0,\"visible\":true,\"width\":540.0,\"height\":642.3,\"widthScale\":100.0,\"heightScale\":100.0,\"lineFormat\":{\"line\":true,\"color\":\"#00000000\",\"weight\":0.75,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":86.35,\"verticalOrigin\":\"Margin\",\"verticalAlignment\":\"None\",\"horizontalPosition\":3.6,\"horizontalOrigin\":\"Margin\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":1,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0.0,\"distanceLeft\":0.0,\"distanceRight\":0.0,\"distanceTop\":0.0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.087,\"rightMargin\":7.087,\"topMargin\":3.685,\"bottomMargin\":3.685,\"blocks\":[{\"inlines\":[]}]},\"isTextBox\":false},{\"text\":\"Face-to-Face Identification \",\"characterFormat\":{\"bold\":true,\"fontSize\":12.0,\"fontFamily\":\"Calibri\",\"fontColor\":\"empty\",\"fontSizeBidi\":12.0}}]},{\"characterFormat\":{\"bold\":true,\"fontFamily\":\"Calibri\",\"fontColor\":\"empty\"},\"paragraphFormat\":{\"textAlignment\":\"Center\",\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Photocopy of Valid Original ID\",\"characterFormat\":{\"bold\":true,\"fontFamily\":\"Calibri\",\"fontColor\":\"empty\"}}]}],\"headersFooters\":{\"header\":{\"blocks\":[{\"rows\":[{\"rowFormat\":{\"allowBreakAcrossPages\":true,\"isHeader\":false,\"height\":26.899999618530273,\"heightType\":\"AtLeast\",\"borders\":{\"left\":{\"lineStyle\":\"Single\",\"lineWidth\":0.5,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"right\":{\"lineStyle\":\"Single\",\"lineWidth\":0.5,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"top\":{\"lineStyle\":\"Single\",\"lineWidth\":0.5,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"bottom\":{\"lineStyle\":\"Single\",\"lineWidth\":0.5,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"vertical\":{\"lineStyle\":\"Single\",\"lineWidth\":0.5,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"horizontal\":{\"lineStyle\":\"Single\",\"lineWidth\":0.5,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"diagonalDown\":{\"lineStyle\":\"None\",\"lineWidth\":0.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"diagonalUp\":{\"lineStyle\":\"None\",\"lineWidth\":0.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false}}},\"cells\":[{\"blocks\":[{\"characterFormat\":{\"bold\":true,\"fontSize\":16.0,\"fontColor\":\"empty\",\"fontSizeBidi\":16.0,\"fontFamilyBidi\":\"Calibri\"},\"paragraphFormat\":{\"leftIndent\":-5.4000000953674316,\"afterSpacing\":6.0,\"textAlignment\":\"Justify\",\"styleName\":\"Normal\",\"tabs\":[{\"tabJustification\":\"Right\",\"position\":457.20001220703125,\"tabLeader\":\"None\",\"deletePosition\":0.0}]},\"inlines\":[{\"text\":\"\\t\",\"characterFormat\":{\"bold\":true,\"fontSize\":16.0,\"fontColor\":\"empty\",\"fontSizeBidi\":16.0,\"fontFamilyBidi\":\"Calibri\"}},{\"text\":\"Design Centre Options Guide\",\"characterFormat\":{\"bold\":true,\"fontSize\":16.0,\"fontColor\":\"empty\",\"fontSizeBidi\":16.0,\"fontFamilyBidi\":\"Calibri\"}}]}],\"cellFormat\":{\"columnSpan\":1,\"rowSpan\":1,\"preferredWidth\":468.0,\"preferredWidthType\":\"Point\",\"verticalAlignment\":\"Top\",\"isSamePaddingAsTable\":true,\"borders\":{\"left\":{\"lineStyle\":\"Cleared\",\"lineWidth\":0.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"right\":{\"lineStyle\":\"Cleared\",\"lineWidth\":0.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"top\":{\"lineStyle\":\"Cleared\",\"lineWidth\":0.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"bottom\":{\"lineStyle\":\"Single\",\"lineWidth\":1.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false,\"color\":\"#000000FF\"},\"vertical\":{\"lineStyle\":\"None\",\"lineWidth\":0.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"horizontal\":{\"lineStyle\":\"None\",\"lineWidth\":0.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"diagonalDown\":{\"lineStyle\":\"None\",\"lineWidth\":0.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"diagonalUp\":{\"lineStyle\":\"None\",\"lineWidth\":0.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false}},\"shading\":{\"texture\":\"TextureNone\"},\"cellWidth\":468.0}}]},{\"rowFormat\":{\"allowBreakAcrossPages\":true,\"isHeader\":false,\"height\":46.799999237060547,\"heightType\":\"AtLeast\",\"borders\":{\"left\":{\"lineStyle\":\"Single\",\"lineWidth\":0.5,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"right\":{\"lineStyle\":\"Single\",\"lineWidth\":0.5,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"top\":{\"lineStyle\":\"Single\",\"lineWidth\":0.5,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"bottom\":{\"lineStyle\":\"Single\",\"lineWidth\":0.5,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"vertical\":{\"lineStyle\":\"Single\",\"lineWidth\":0.5,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"horizontal\":{\"lineStyle\":\"Single\",\"lineWidth\":0.5,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"diagonalDown\":{\"lineStyle\":\"None\",\"lineWidth\":0.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"diagonalUp\":{\"lineStyle\":\"None\",\"lineWidth\":0.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false}}},\"cells\":[{\"blocks\":[{\"characterFormat\":{\"bold\":true,\"fontSize\":9.0,\"fontColor\":\"empty\",\"fontSizeBidi\":9.0,\"fontFamilyBidi\":\"Calibri\"},\"paragraphFormat\":{\"beforeSpacing\":6.0,\"textAlignment\":\"Justify\",\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"As part of your new home purchase with Minto, you \",\"characterFormat\":{\"fontSize\":9.0,\"fontColor\":\"empty\",\"fontSizeBidi\":9.0,\"fontFamilyBidi\":\"Calibri\"}},{\"text\":\"have the opportunity to\",\"characterFormat\":{\"fontSize\":9.0,\"fontColor\":\"empty\",\"fontSizeBidi\":9.0,\"fontFamilyBidi\":\"Calibri\"}},{\"text\":\" make a number of selections to personalize your new home.  This guide outlines the options available to you during your Design Centre appointments. Please note that \",\"characterFormat\":{\"fontSize\":9.0,\"fontColor\":\"empty\",\"fontSizeBidi\":9.0,\"fontFamilyBidi\":\"Calibri\"}},{\"text\":\"a number of\",\"characterFormat\":{\"fontSize\":9.0,\"fontColor\":\"empty\",\"fontSizeBidi\":9.0,\"fontFamilyBidi\":\"Calibri\"}},{\"text\":\" options are subject to architectural approval and may change at any time without notice.\",\"characterFormat\":{\"fontSize\":9.0,\"fontColor\":\"empty\",\"fontSizeBidi\":9.0,\"fontFamilyBidi\":\"Calibri\"}}]}],\"cellFormat\":{\"columnSpan\":1,\"rowSpan\":1,\"preferredWidth\":468.0,\"preferredWidthType\":\"Point\",\"verticalAlignment\":\"Top\",\"isSamePaddingAsTable\":true,\"borders\":{\"left\":{\"lineStyle\":\"Cleared\",\"lineWidth\":0.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"right\":{\"lineStyle\":\"Cleared\",\"lineWidth\":0.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"top\":{\"lineStyle\":\"Single\",\"lineWidth\":1.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false,\"color\":\"#000000FF\"},\"bottom\":{\"lineStyle\":\"Single\",\"lineWidth\":1.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false,\"color\":\"#000000FF\"},\"vertical\":{\"lineStyle\":\"None\",\"lineWidth\":0.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"horizontal\":{\"lineStyle\":\"None\",\"lineWidth\":0.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"diagonalDown\":{\"lineStyle\":\"None\",\"lineWidth\":0.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"diagonalUp\":{\"lineStyle\":\"None\",\"lineWidth\":0.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false}},\"shading\":{\"texture\":\"TextureNone\"},\"cellWidth\":468.0}}]}],\"title\":null,\"description\":null,\"tableFormat\":{\"allowAutoFit\":true,\"leftIndent\":0.0,\"tableAlignment\":\"Left\",\"preferredWidthType\":\"Auto\",\"borders\":{\"left\":{\"lineStyle\":\"Single\",\"lineWidth\":0.5,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"right\":{\"lineStyle\":\"Single\",\"lineWidth\":0.5,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"top\":{\"lineStyle\":\"Single\",\"lineWidth\":0.5,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"bottom\":{\"lineStyle\":\"Single\",\"lineWidth\":0.5,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"vertical\":{\"lineStyle\":\"Single\",\"lineWidth\":0.5,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"horizontal\":{\"lineStyle\":\"Single\",\"lineWidth\":0.5,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"diagonalDown\":{\"lineStyle\":\"None\",\"lineWidth\":0.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false},\"diagonalUp\":{\"lineStyle\":\"None\",\"lineWidth\":0.0,\"shadow\":false,\"space\":0.0,\"hasNoneStyle\":false}},\"bidi\":false,\"horizontalPositionAbs\":\"Left\",\"horizontalPosition\":0.0}},{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Header\"},\"inlines\":[]}]},\"footer\":{\"blocks\":[{\"characterFormat\":{\"fontSize\":8.0,\"fontColor\":\"empty\",\"fontSizeBidi\":8.0,\"fontFamilyBidi\":\"Calibri\"},\"paragraphFormat\":{\"styleName\":\"Footer\"},\"inlines\":[{\"text\":\"Availability of options are subject to lot conditions, model and construction status\",\"characterFormat\":{\"fontSize\":8.0,\"fontColor\":\"empty\",\"fontSizeBidi\":8.0,\"fontFamilyBidi\":\"Calibri\"}},{\"text\":\"\\t\",\"characterFormat\":{\"fontSize\":8.0,\"fontColor\":\"empty\",\"fontSizeBidi\":8.0,\"fontFamilyBidi\":\"Calibri\"}},{\"text\":\"Issued: April 4, 2020\",\"characterFormat\":{\"fontSize\":8.0,\"fontColor\":\"empty\",\"fontSizeBidi\":8.0,\"fontFamilyBidi\":\"Calibri\"}}]},{\"characterFormat\":{\"fontSize\":8.0,\"fontColor\":\"empty\",\"fontSizeBidi\":8.0,\"fontFamilyBidi\":\"Calibri\"},\"paragraphFormat\":{\"styleName\":\"Footer\"},\"inlines\":[{\"text\":\"\\t\",\"characterFormat\":{\"fontSize\":8.0,\"fontColor\":\"empty\",\"fontSizeBidi\":8.0,\"fontFamilyBidi\":\"Calibri\"}},{\"text\":\"\\t\",\"characterFormat\":{\"fontSize\":8.0,\"fontColor\":\"empty\",\"fontSizeBidi\":8.0,\"fontFamilyBidi\":\"Calibri\"}},{\"text\":\"Errors & Omissions Excluded\",\"characterFormat\":{\"fontSize\":8.0,\"fontColor\":\"empty\",\"fontSizeBidi\":8.0,\"fontFamilyBidi\":\"Calibri\"}}]}]},\"evenHeader\":{\"blocks\":[{\"inlines\":[]}]},\"evenFooter\":{\"blocks\":[{\"inlines\":[]}]},\"firstPageHeader\":{\"blocks\":[{\"inlines\":[]}]},\"firstPageFooter\":{\"blocks\":[{\"inlines\":[]}]}},\"sectionFormat\":{\"headerDistance\":31.5,\"footerDistance\":21.200000762939453,\"pageWidth\":612.0,\"pageHeight\":1008.0,\"leftMargin\":72.0,\"rightMargin\":72.0,\"topMargin\":72.0,\"bottomMargin\":49.5,\"differentFirstPage\":false,\"differentOddAndEvenPages\":false,\"bidi\":false,\"restartPageNumbering\":false,\"pageStartingNumber\":0,\"endnoteNumberFormat\":\"LowerCaseRoman\",\"footNoteNumberFormat\":\"Arabic\",\"restartIndexForFootnotes\":\"DoNotRestart\",\"restartIndexForEndnotes\":\"DoNotRestart\"}}],\"characterFormat\":{\"fontFamily\":\"Times New Roman\",\"fontColor\":\"empty\",\"fontFamilyBidi\":\"Times New Roman\"},\"lists\":[{\"listId\":15,\"abstractListId\":15},{\"listId\":21,\"abstractListId\":21},{\"listId\":26,\"abstractListId\":3,\"levelOverrides\":[{\"startAt\":1,\"levelNumber\":0},{\"startAt\":1,\"levelNumber\":1},{\"startAt\":1,\"levelNumber\":2},{\"startAt\":1,\"levelNumber\":3},{\"startAt\":1,\"levelNumber\":4},{\"startAt\":1,\"levelNumber\":5},{\"startAt\":1,\"levelNumber\":6},{\"startAt\":1,\"levelNumber\":7},{\"startAt\":1,\"levelNumber\":8}]}],\"abstractLists\":[{\"abstractListId\":3,\"levels\":[{\"startAt\":1,\"restartLevel\":0,\"listLevelPattern\":\"Arabic\",\"followCharacter\":\"None\",\"numberFormat\":\"Article %1\",\"characterFormat\":{\"italic\":false,\"strikethrough\":\"None\",\"baselineAlignment\":\"Normal\",\"fontFamily\":\"Times New Roman\",\"fontColor\":\"empty\",\"italicBidi\":false,\"fontFamilyBidi\":\"Times New Roman\",\"allCaps\":false},\"paragraphFormat\":{\"leftIndent\":0.0,\"firstLineIndent\":0.0}},{\"startAt\":1,\"restartLevel\":1,\"listLevelPattern\":\"Arabic\",\"followCharacter\":\"Tab\",\"numberFormat\":\"%1.%2\",\"characterFormat\":{\"bold\":true,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontFamilyBidi\":\"Arial\"},\"paragraphFormat\":{\"leftIndent\":36.0,\"firstLineIndent\":-36.0,\"tabs\":[{\"tabJustification\":\"List\",\"position\":36.0,\"tabLeader\":\"None\",\"deletePosition\":0.0}]}},{\"startAt\":1,\"restartLevel\":2,\"listLevelPattern\":\"LowLetter\",\"followCharacter\":\"Tab\",\"numberFormat\":\"(%3)\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":72.0,\"firstLineIndent\":-36.0,\"tabs\":[{\"tabJustification\":\"List\",\"position\":72.0,\"tabLeader\":\"None\",\"deletePosition\":0.0}]}},{\"startAt\":1,\"restartLevel\":3,\"listLevelPattern\":\"LowRoman\",\"followCharacter\":\"Tab\",\"numberFormat\":\"(%4)\",\"characterFormat\":{\"italic\":false,\"strikethrough\":\"None\",\"baselineAlignment\":\"Normal\",\"fontFamily\":\"Times New Roman\",\"fontColor\":\"empty\",\"italicBidi\":false,\"fontFamilyBidi\":\"Times New Roman\",\"allCaps\":false},\"paragraphFormat\":{\"leftIndent\":108.0,\"firstLineIndent\":-21.600000381469727,\"tabs\":[{\"tabJustification\":\"List\",\"position\":108.0,\"tabLeader\":\"None\",\"deletePosition\":0.0}]}},{\"startAt\":1,\"restartLevel\":4,\"listLevelPattern\":\"UpLetter\",\"followCharacter\":\"Tab\",\"numberFormat\":\"(%5)\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":144.0,\"firstLineIndent\":-36.0,\"tabs\":[{\"tabJustification\":\"List\",\"position\":144.0,\"tabLeader\":\"None\",\"deletePosition\":0.0}]}},{\"startAt\":1,\"restartLevel\":5,\"listLevelPattern\":\"UpRoman\",\"followCharacter\":\"Tab\",\"numberFormat\":\"(%6)\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":180.0,\"firstLineIndent\":-21.600000381469727,\"tabs\":[{\"tabJustification\":\"List\",\"position\":180.0,\"tabLeader\":\"None\",\"deletePosition\":0.0}]}},{\"startAt\":1,\"restartLevel\":6,\"listLevelPattern\":\"Arabic\",\"followCharacter\":\"Tab\",\"numberFormat\":\"(%7)\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":216.0,\"firstLineIndent\":-36.0,\"tabs\":[{\"tabJustification\":\"List\",\"position\":216.0,\"tabLeader\":\"None\",\"deletePosition\":0.0}]}},{\"startAt\":1,\"restartLevel\":7,\"listLevelPattern\":\"LowLetter\",\"followCharacter\":\"Tab\",\"numberFormat\":\"%8)\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":252.0,\"firstLineIndent\":-36.0,\"tabs\":[{\"tabJustification\":\"List\",\"position\":252.0,\"tabLeader\":\"None\",\"deletePosition\":0.0}]}},{\"startAt\":1,\"restartLevel\":8,\"listLevelPattern\":\"LowRoman\",\"followCharacter\":\"Tab\",\"numberFormat\":\"%9)\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":288.0,\"firstLineIndent\":-21.600000381469727,\"tabs\":[{\"tabJustification\":\"List\",\"position\":288.0,\"tabLeader\":\"None\",\"deletePosition\":0.0}]}}]},{\"abstractListId\":15,\"levels\":[{\"startAt\":1,\"restartLevel\":0,\"listLevelPattern\":\"Arabic\",\"followCharacter\":\"Tab\",\"numberFormat\":\"Article %1.\",\"characterFormat\":{\"italic\":false,\"strikethrough\":\"None\",\"baselineAlignment\":\"Normal\",\"fontFamily\":\"Times New Roman\",\"fontColor\":\"empty\",\"boldBidi\":false,\"italicBidi\":false,\"fontFamilyBidi\":\"Times New Roman\",\"allCaps\":false},\"paragraphFormat\":{\"leftIndent\":36.0,\"firstLineIndent\":-18.0}},{\"startAt\":1,\"restartLevel\":1,\"listLevelPattern\":\"Arabic\",\"followCharacter\":\"Tab\",\"numberFormat\":\"%2.%1\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":72.5999984741211,\"firstLineIndent\":-18.600000381469727}},{\"startAt\":1,\"restartLevel\":2,\"listLevelPattern\":\"LowLetter\",\"followCharacter\":\"Tab\",\"numberFormat\":\"(%3)\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":108.0,\"firstLineIndent\":-9.0}},{\"startAt\":1,\"restartLevel\":3,\"listLevelPattern\":\"Arabic\",\"followCharacter\":\"Tab\",\"numberFormat\":\"%4.\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":144.0,\"firstLineIndent\":-18.0}},{\"startAt\":1,\"restartLevel\":4,\"listLevelPattern\":\"LowRoman\",\"followCharacter\":\"Tab\",\"numberFormat\":\"%5.\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":180.0,\"firstLineIndent\":-18.0}},{\"startAt\":1,\"restartLevel\":5,\"listLevelPattern\":\"LowLetter\",\"followCharacter\":\"Tab\",\"numberFormat\":\"%6.\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":216.0,\"firstLineIndent\":-9.0}},{\"startAt\":1,\"restartLevel\":6,\"listLevelPattern\":\"LowRoman\",\"followCharacter\":\"Tab\",\"numberFormat\":\"%7.\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":252.0,\"firstLineIndent\":-18.0}},{\"startAt\":1,\"restartLevel\":7,\"listLevelPattern\":\"LowLetter\",\"followCharacter\":\"Tab\",\"numberFormat\":\"%8.\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":288.0,\"firstLineIndent\":-18.0}},{\"startAt\":1,\"restartLevel\":8,\"listLevelPattern\":\"LowRoman\",\"followCharacter\":\"Tab\",\"numberFormat\":\"%9.\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":324.0,\"firstLineIndent\":-9.0}}]},{\"abstractListId\":21,\"levels\":[{\"startAt\":1,\"restartLevel\":0,\"listLevelPattern\":\"Arabic\",\"followCharacter\":\"None\",\"numberFormat\":\"Article %1\",\"characterFormat\":{\"italic\":false,\"strikethrough\":\"None\",\"baselineAlignment\":\"Normal\",\"fontFamily\":\"Times New Roman\",\"fontColor\":\"empty\",\"italicBidi\":false,\"fontFamilyBidi\":\"Times New Roman\",\"allCaps\":false},\"paragraphFormat\":{\"leftIndent\":0.0,\"firstLineIndent\":0.0}},{\"startAt\":1,\"restartLevel\":1,\"listLevelPattern\":\"Arabic\",\"followCharacter\":\"Tab\",\"numberFormat\":\"%1.%2\",\"characterFormat\":{\"bold\":true,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontFamilyBidi\":\"Arial\"},\"paragraphFormat\":{\"leftIndent\":36.0,\"firstLineIndent\":-36.0,\"tabs\":[{\"tabJustification\":\"List\",\"position\":36.0,\"tabLeader\":\"None\",\"deletePosition\":0.0}]}},{\"startAt\":1,\"restartLevel\":2,\"listLevelPattern\":\"LowLetter\",\"followCharacter\":\"Tab\",\"numberFormat\":\"(%3)\",\"characterFormat\":{\"italic\":false,\"strikethrough\":\"None\",\"baselineAlignment\":\"Normal\",\"fontSize\":9.0,\"fontFamily\":\"Times New Roman\",\"fontColor\":\"empty\",\"italicBidi\":false,\"fontSizeBidi\":9.0,\"fontFamilyBidi\":\"Times New Roman\",\"allCaps\":false},\"paragraphFormat\":{\"leftIndent\":72.0,\"firstLineIndent\":-36.0,\"tabs\":[{\"tabJustification\":\"List\",\"position\":72.0,\"tabLeader\":\"None\",\"deletePosition\":0.0}]}},{\"startAt\":1,\"restartLevel\":3,\"listLevelPattern\":\"LowRoman\",\"followCharacter\":\"Tab\",\"numberFormat\":\"(%4)\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":108.0,\"firstLineIndent\":-21.600000381469727,\"tabs\":[{\"tabJustification\":\"List\",\"position\":108.0,\"tabLeader\":\"None\",\"deletePosition\":0.0}]}},{\"startAt\":1,\"restartLevel\":4,\"listLevelPattern\":\"UpLetter\",\"followCharacter\":\"Tab\",\"numberFormat\":\"(%5)\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":144.0,\"firstLineIndent\":-36.0,\"tabs\":[{\"tabJustification\":\"List\",\"position\":144.0,\"tabLeader\":\"None\",\"deletePosition\":0.0}]}},{\"startAt\":1,\"restartLevel\":5,\"listLevelPattern\":\"UpRoman\",\"followCharacter\":\"Tab\",\"numberFormat\":\"(%6)\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":180.0,\"firstLineIndent\":-21.600000381469727,\"tabs\":[{\"tabJustification\":\"List\",\"position\":180.0,\"tabLeader\":\"None\",\"deletePosition\":0.0}]}},{\"startAt\":1,\"restartLevel\":6,\"listLevelPattern\":\"Arabic\",\"followCharacter\":\"Tab\",\"numberFormat\":\"(%7)\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":216.0,\"firstLineIndent\":-36.0,\"tabs\":[{\"tabJustification\":\"List\",\"position\":216.0,\"tabLeader\":\"None\",\"deletePosition\":0.0}]}},{\"startAt\":1,\"restartLevel\":7,\"listLevelPattern\":\"LowLetter\",\"followCharacter\":\"Tab\",\"numberFormat\":\"%8)\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":252.0,\"firstLineIndent\":-36.0,\"tabs\":[{\"tabJustification\":\"List\",\"position\":252.0,\"tabLeader\":\"None\",\"deletePosition\":0.0}]}},{\"startAt\":1,\"restartLevel\":8,\"listLevelPattern\":\"LowRoman\",\"followCharacter\":\"Tab\",\"numberFormat\":\"%9)\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":288.0,\"firstLineIndent\":-21.600000381469727,\"tabs\":[{\"tabJustification\":\"List\",\"position\":288.0,\"tabLeader\":\"None\",\"deletePosition\":0.0}]}}]}],\"background\":{\"color\":\"#FFFFFFFF\"},\"styles\":[{\"type\":\"Paragraph\",\"name\":\"Normal\",\"next\":\"Normal\",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"type\":\"Paragraph\",\"name\":\"Heading 1\",\"basedOn\":\"Normal\",\"next\":\"Normal\",\"link\":\"Heading 1 Char\",\"characterFormat\":{\"bold\":true,\"fontSize\":9.0,\"fontFamily\":\"Tahoma\",\"fontColor\":\"empty\",\"boldBidi\":true,\"fontSizeBidi\":9.0},\"paragraphFormat\":{\"outlineLevel\":\"Level1\"}},{\"type\":\"Paragraph\",\"name\":\"Heading 2\",\"basedOn\":\"Normal\",\"next\":\"Normal\",\"characterFormat\":{\"bold\":true,\"fontSize\":9.0,\"fontFamily\":\"Tahoma\",\"fontColor\":\"empty\",\"boldBidi\":true,\"fontSizeBidi\":9.0},\"paragraphFormat\":{\"outlineLevel\":\"Level2\",\"textAlignment\":\"Center\"}},{\"type\":\"Paragraph\",\"name\":\"Heading 3\",\"basedOn\":\"Normal\",\"next\":\"Normal\",\"characterFormat\":{\"bold\":true,\"fontSize\":9.0,\"fontFamily\":\"Tahoma\",\"fontColor\":\"empty\",\"boldBidi\":true,\"fontSizeBidi\":9.0},\"paragraphFormat\":{\"outlineLevel\":\"Level3\",\"textAlignment\":\"Justify\"}},{\"type\":\"Paragraph\",\"name\":\"Heading 4\",\"basedOn\":\"Normal\",\"next\":\"Normal\",\"characterFormat\":{\"italic\":true,\"fontSize\":9.0,\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":18.0,\"rightIndent\":-4.0,\"firstLineIndent\":-18.0,\"outlineLevel\":\"Level4\",\"textAlignment\":\"Justify\"}},{\"type\":\"Paragraph\",\"name\":\"Heading 5\",\"basedOn\":\"Normal\",\"next\":\"Normal\",\"characterFormat\":{\"italic\":true,\"fontSize\":8.0,\"fontColor\":\"empty\"},\"paragraphFormat\":{\"rightIndent\":-4.0,\"outlineLevel\":\"Level5\"}},{\"type\":\"Paragraph\",\"name\":\"Heading 6\",\"basedOn\":\"Normal\",\"next\":\"Normal\",\"characterFormat\":{\"bold\":true,\"fontSize\":9.0,\"fontColor\":\"empty\",\"boldBidi\":true},\"paragraphFormat\":{\"outlineLevel\":\"Level6\",\"textAlignment\":\"Right\"}},{\"type\":\"Paragraph\",\"name\":\"Heading 7\",\"basedOn\":\"Normal\",\"next\":\"Normal\",\"characterFormat\":{\"bold\":true,\"fontColor\":\"empty\",\"boldBidi\":true},\"paragraphFormat\":{\"outlineLevel\":\"Level7\",\"textAlignment\":\"Justify\"}},{\"type\":\"Paragraph\",\"name\":\"Heading 8\",\"basedOn\":\"Normal\",\"next\":\"Normal\",\"characterFormat\":{\"bold\":true,\"fontSize\":9.0,\"fontColor\":\"empty\",\"boldBidi\":true},\"paragraphFormat\":{\"leftIndent\":-9.3999996185302734,\"firstLineIndent\":9.3999996185302734,\"outlineLevel\":\"Level8\"}},{\"type\":\"Paragraph\",\"name\":\"Heading 9\",\"basedOn\":\"Normal\",\"next\":\"Normal\",\"characterFormat\":{\"underline\":\"Single\",\"fontColor\":\"empty\"},\"paragraphFormat\":{\"outlineLevel\":\"Level9\"}},{\"type\":\"Character\",\"name\":\"Default Paragraph Font\",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"type\":\"Paragraph\",\"name\":\"Title\",\"basedOn\":\"Normal\",\"next\":\"Title\",\"characterFormat\":{\"bold\":true,\"fontSize\":12.0,\"fontColor\":\"empty\",\"boldBidi\":true,\"fontSizeBidi\":12.0},\"paragraphFormat\":{\"textAlignment\":\"Center\"}},{\"type\":\"Paragraph\",\"name\":\"Body Text\",\"basedOn\":\"Normal\",\"next\":\"Body Text\",\"link\":\"Body Text Char\",\"characterFormat\":{\"fontSize\":12.0,\"fontColor\":\"empty\",\"fontSizeBidi\":12.0},\"paragraphFormat\":{\"textAlignment\":\"Justify\"}},{\"type\":\"Paragraph\",\"name\":\"Subtitle\",\"basedOn\":\"Normal\",\"next\":\"Subtitle\",\"characterFormat\":{\"bold\":true,\"fontSize\":12.0,\"fontColor\":\"empty\",\"boldBidi\":true,\"fontSizeBidi\":12.0},\"paragraphFormat\":{\"textAlignment\":\"Center\"}},{\"type\":\"Paragraph\",\"name\":\"Body Text Indent\",\"basedOn\":\"Normal\",\"next\":\"Body Text Indent\",\"characterFormat\":{\"fontSize\":11.0,\"fontColor\":\"empty\",\"fontSizeBidi\":11.0},\"paragraphFormat\":{\"textAlignment\":\"Justify\"}},{\"type\":\"Paragraph\",\"name\":\"Header\",\"basedOn\":\"Normal\",\"next\":\"Header\",\"link\":\"Header Char\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"tabs\":[{\"tabJustification\":\"Center\",\"position\":216.0,\"tabLeader\":\"None\",\"deletePosition\":0.0},{\"tabJustification\":\"Right\",\"position\":432.0,\"tabLeader\":\"None\",\"deletePosition\":0.0}]}},{\"type\":\"Paragraph\",\"name\":\"Footer\",\"basedOn\":\"Normal\",\"next\":\"Footer\",\"link\":\"Footer Char\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"tabs\":[{\"tabJustification\":\"Center\",\"position\":216.0,\"tabLeader\":\"None\",\"deletePosition\":0.0},{\"tabJustification\":\"Right\",\"position\":432.0,\"tabLeader\":\"None\",\"deletePosition\":0.0}]}},{\"type\":\"Paragraph\",\"name\":\"Document Map\",\"basedOn\":\"Normal\",\"next\":\"Document Map\",\"characterFormat\":{\"fontFamily\":\"Tahoma\",\"fontColor\":\"empty\",\"fontFamilyBidi\":\"Tahoma\"}},{\"type\":\"Paragraph\",\"name\":\"Block Text\",\"basedOn\":\"Normal\",\"next\":\"Block Text\",\"characterFormat\":{\"fontSize\":11.0,\"fontColor\":\"empty\",\"fontSizeBidi\":11.0},\"paragraphFormat\":{\"leftIndent\":18.0,\"rightIndent\":0.10000000149011612,\"firstLineIndent\":-18.0,\"textAlignment\":\"Justify\"}},{\"type\":\"Paragraph\",\"name\":\"Body Text Indent 2\",\"basedOn\":\"Normal\",\"next\":\"Body Text Indent 2\",\"characterFormat\":{\"fontSize\":9.0,\"fontFamily\":\"Tahoma\",\"fontColor\":\"empty\",\"fontSizeBidi\":9.0},\"paragraphFormat\":{\"leftIndent\":18.0,\"textAlignment\":\"Justify\"}},{\"type\":\"Paragraph\",\"name\":\"Body Text Indent 3\",\"basedOn\":\"Normal\",\"next\":\"Body Text Indent 3\",\"characterFormat\":{\"fontFamily\":\"Times\",\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":36.0,\"firstLineIndent\":-36.0,\"textAlignment\":\"Justify\"}},{\"type\":\"Character\",\"name\":\"Hyperlink\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"underline\":\"Single\",\"fontColor\":\"#0000FFFF\"}},{\"type\":\"Paragraph\",\"name\":\"Body Text 2\",\"basedOn\":\"Normal\",\"next\":\"Body Text 2\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"rightIndent\":-6.9000000953674316}},{\"type\":\"Character\",\"name\":\"FollowedHyperlink\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"underline\":\"Single\",\"fontColor\":\"#800080FF\"}},{\"type\":\"Paragraph\",\"name\":\"HTML Top of Form\",\"basedOn\":\"Normal\",\"next\":\"Normal\",\"characterFormat\":{\"fontSize\":8.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":8.0,\"fontFamilyBidi\":\"Arial\"},\"paragraphFormat\":{\"textAlignment\":\"Center\"}},{\"type\":\"Paragraph\",\"name\":\"HTML Bottom of Form\",\"basedOn\":\"Normal\",\"next\":\"Normal\",\"characterFormat\":{\"fontSize\":8.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":8.0,\"fontFamilyBidi\":\"Arial\"},\"paragraphFormat\":{\"textAlignment\":\"Center\"}},{\"type\":\"Character\",\"name\":\"Page Number\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"type\":\"Paragraph\",\"name\":\"Body Text 3\",\"basedOn\":\"Normal\",\"next\":\"Body Text 3\",\"characterFormat\":{\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":16.0,\"fontFamilyBidi\":\"Arial\"}},{\"type\":\"Paragraph\",\"name\":\"Balloon Text\",\"basedOn\":\"Normal\",\"next\":\"Balloon Text\",\"characterFormat\":{\"fontSize\":8.0,\"fontFamily\":\"Tahoma\",\"fontColor\":\"empty\",\"fontSizeBidi\":8.0,\"fontFamilyBidi\":\"Tahoma\"}},{\"type\":\"Paragraph\",\"name\":\"Style1\",\"basedOn\":\"Heading 1\",\"next\":\"Style1\",\"link\":\"Style1 Char\",\"characterFormat\":{\"fontFamily\":\"Arial\",\"fontColor\":\"empty\"}},{\"type\":\"Paragraph\",\"name\":\"Style2\",\"basedOn\":\"Normal\",\"next\":\"Normal\",\"link\":\"Style2 Char\",\"characterFormat\":{\"bold\":true,\"fontSize\":9.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"allCaps\":true},\"paragraphFormat\":{\"textAlignment\":\"Center\",\"listFormat\":{\"listId\":15}}},{\"type\":\"Character\",\"name\":\"Heading 1 Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"bold\":true,\"fontSize\":9.0,\"fontFamily\":\"Tahoma\",\"fontColor\":\"empty\",\"boldBidi\":true,\"fontSizeBidi\":9.0}},{\"type\":\"Character\",\"name\":\"Style1 Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"bold\":true,\"fontSize\":9.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"boldBidi\":true,\"fontSizeBidi\":9.0,\"fontFamilyBidi\":\"Arial\"}},{\"type\":\"Paragraph\",\"name\":\"MTIndent2\",\"basedOn\":\"Normal\",\"next\":\"MTIndent2\",\"characterFormat\":{\"fontSize\":11.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontFamilyBidi\":\"Arial\"},\"paragraphFormat\":{\"leftIndent\":72.0,\"afterSpacing\":11.0,\"textAlignment\":\"Justify\"}},{\"type\":\"Character\",\"name\":\"Style2 Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"bold\":true,\"fontSize\":9.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"allCaps\":true}},{\"type\":\"Character\",\"name\":\"chrbold\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"bold\":true,\"fontColor\":\"empty\"}},{\"type\":\"Character\",\"name\":\"chritalics\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"italic\":true,\"fontColor\":\"empty\"}},{\"type\":\"Paragraph\",\"name\":\"MTArt2 L1\",\"basedOn\":\"Normal\",\"next\":\"MTArt2 L2\",\"link\":\"MTArt2 L1 Char\",\"characterFormat\":{\"bold\":true,\"fontSize\":11.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":12.0,\"allCaps\":true},\"paragraphFormat\":{\"beforeSpacing\":6.0,\"afterSpacing\":11.0,\"outlineLevel\":\"Level1\",\"textAlignment\":\"Center\",\"listFormat\":{\"listId\":21}}},{\"type\":\"Paragraph\",\"name\":\"MTArt2 L2\",\"basedOn\":\"Normal\",\"next\":\"Normal\",\"link\":\"MTArt2 L2 Char\",\"characterFormat\":{\"bold\":true,\"fontSize\":11.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":12.0},\"paragraphFormat\":{\"afterSpacing\":11.0,\"outlineLevel\":\"Level2\",\"textAlignment\":\"Justify\",\"listFormat\":{\"listLevelNumber\":1,\"listId\":21}}},{\"type\":\"Paragraph\",\"name\":\"MTArt2 L3\",\"basedOn\":\"Normal\",\"next\":\"MTArt2 L3\",\"link\":\"MTArt2 L3 Char\",\"characterFormat\":{\"fontSize\":11.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":12.0},\"paragraphFormat\":{\"afterSpacing\":11.0,\"outlineLevel\":\"Level3\",\"textAlignment\":\"Justify\",\"listFormat\":{\"listLevelNumber\":2,\"listId\":21}}},{\"type\":\"Paragraph\",\"name\":\"MTArt2 L4\",\"basedOn\":\"Normal\",\"next\":\"MTArt2 L4\",\"link\":\"MTArt2 L4 Char\",\"characterFormat\":{\"fontSize\":11.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":12.0},\"paragraphFormat\":{\"afterSpacing\":11.0,\"outlineLevel\":\"Level4\",\"textAlignment\":\"Justify\",\"listFormat\":{\"listLevelNumber\":3,\"listId\":21}}},{\"type\":\"Paragraph\",\"name\":\"MTArt2 L5\",\"basedOn\":\"Normal\",\"next\":\"MTArt2 L5\",\"characterFormat\":{\"fontSize\":11.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":12.0,\"fontFamilyBidi\":\"Arial\"},\"paragraphFormat\":{\"afterSpacing\":11.0,\"textAlignment\":\"Justify\",\"listFormat\":{\"listLevelNumber\":4,\"listId\":21}}},{\"type\":\"Paragraph\",\"name\":\"MTArt2 L6\",\"basedOn\":\"Normal\",\"next\":\"MTArt2 L6\",\"characterFormat\":{\"fontSize\":11.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":12.0,\"fontFamilyBidi\":\"Arial\"},\"paragraphFormat\":{\"afterSpacing\":11.0,\"textAlignment\":\"Justify\",\"listFormat\":{\"listLevelNumber\":5,\"listId\":21}}},{\"type\":\"Paragraph\",\"name\":\"MTArt2 L7\",\"basedOn\":\"Normal\",\"next\":\"MTArt2 L7\",\"characterFormat\":{\"fontSize\":11.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":12.0,\"fontFamilyBidi\":\"Arial\"},\"paragraphFormat\":{\"afterSpacing\":11.0,\"textAlignment\":\"Justify\",\"listFormat\":{\"listLevelNumber\":6,\"listId\":21}}},{\"type\":\"Paragraph\",\"name\":\"MTArt2 L8\",\"basedOn\":\"Normal\",\"next\":\"MTArt2 L8\",\"characterFormat\":{\"fontSize\":11.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":12.0,\"fontFamilyBidi\":\"Arial\"},\"paragraphFormat\":{\"afterSpacing\":11.0,\"textAlignment\":\"Justify\",\"listFormat\":{\"listLevelNumber\":7,\"listId\":21}}},{\"type\":\"Paragraph\",\"name\":\"MTArt2 L9\",\"basedOn\":\"Normal\",\"next\":\"MTArt2 L9\",\"characterFormat\":{\"fontSize\":11.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":12.0,\"fontFamilyBidi\":\"Arial\"},\"paragraphFormat\":{\"afterSpacing\":11.0,\"textAlignment\":\"Justify\",\"listFormat\":{\"listLevelNumber\":8,\"listId\":21}}},{\"type\":\"Character\",\"name\":\"MTArt2 L3 Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"fontSize\":11.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":12.0}},{\"type\":\"Paragraph\",\"name\":\"Style3\",\"basedOn\":\"MTArt2 L1\",\"next\":\"Style3\",\"link\":\"Style3 Char\",\"characterFormat\":{\"fontSize\":9.0,\"fontColor\":\"empty\",\"fontSizeBidi\":9.0},\"paragraphFormat\":{\"outlineLevel\":\"BodyText\"}},{\"type\":\"Paragraph\",\"name\":\"Style4\",\"basedOn\":\"MTArt2 L2\",\"next\":\"Style4\",\"link\":\"Style4 Char\",\"characterFormat\":{\"fontSize\":9.0,\"fontColor\":\"empty\",\"fontSizeBidi\":11.0},\"paragraphFormat\":{\"outlineLevel\":\"BodyText\"}},{\"type\":\"Character\",\"name\":\"MTArt2 L1 Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"bold\":true,\"fontSize\":11.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":12.0,\"allCaps\":true}},{\"type\":\"Character\",\"name\":\"Style3 Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"bold\":true,\"fontSize\":9.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":9.0,\"allCaps\":true}},{\"type\":\"Paragraph\",\"name\":\"Style5\",\"basedOn\":\"MTArt2 L3\",\"next\":\"Style5\",\"link\":\"Style5 Char\",\"characterFormat\":{\"fontSize\":9.0,\"fontColor\":\"empty\",\"fontSizeBidi\":11.0},\"paragraphFormat\":{\"outlineLevel\":\"BodyText\"}},{\"type\":\"Character\",\"name\":\"MTArt2 L2 Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"bold\":true,\"fontSize\":11.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":12.0}},{\"type\":\"Character\",\"name\":\"Style4 Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"bold\":true,\"fontSize\":9.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":11.0}},{\"type\":\"Character\",\"name\":\"Header Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"type\":\"Character\",\"name\":\"Style5 Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"fontSize\":9.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":11.0}},{\"type\":\"Paragraph\",\"name\":\"List Paragraph\",\"basedOn\":\"Normal\",\"next\":\"List Paragraph\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":36.0}},{\"type\":\"Paragraph\",\"name\":\"Style6\",\"basedOn\":\"MTArt2 L4\",\"next\":\"Style6\",\"link\":\"Style6 Char\",\"characterFormat\":{\"fontSize\":9.0,\"fontColor\":\"empty\",\"fontSizeBidi\":9.0},\"paragraphFormat\":{\"leftIndent\":90.0,\"firstLineIndent\":-18.0,\"listFormat\":{\"listId\":26},\"tabs\":[{\"tabJustification\":\"Left\",\"position\":0.0,\"tabLeader\":\"None\",\"deletePosition\":108.0}]}},{\"type\":\"Paragraph\",\"name\":\"TOC Heading\",\"basedOn\":\"Heading 1\",\"next\":\"Normal\",\"characterFormat\":{\"fontSize\":14.0,\"fontFamily\":\"Cambria\",\"fontColor\":\"#365F91FF\",\"fontSizeBidi\":14.0},\"paragraphFormat\":{\"beforeSpacing\":24.0,\"lineSpacing\":1.150000015894572,\"lineSpacingType\":\"Multiple\",\"outlineLevel\":\"BodyText\"}},{\"type\":\"Character\",\"name\":\"MTArt2 L4 Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"fontSize\":11.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":12.0}},{\"type\":\"Character\",\"name\":\"Style6 Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"fontSize\":9.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\",\"fontSizeBidi\":9.0}},{\"type\":\"Paragraph\",\"name\":\"TOC 1\",\"basedOn\":\"Normal\",\"next\":\"Normal\",\"characterFormat\":{\"fontSize\":9.0,\"fontFamily\":\"Arial\",\"fontColor\":\"empty\"}},{\"type\":\"Paragraph\",\"name\":\"TOC 2\",\"basedOn\":\"Normal\",\"next\":\"Normal\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":10.0}},{\"type\":\"Paragraph\",\"name\":\"TOC 3\",\"basedOn\":\"Normal\",\"next\":\"Normal\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"leftIndent\":20.0}},{\"type\":\"Character\",\"name\":\"annotation reference\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"fontSize\":8.0,\"fontColor\":\"empty\",\"fontSizeBidi\":8.0}},{\"type\":\"Paragraph\",\"name\":\"annotation text\",\"basedOn\":\"Normal\",\"next\":\"annotation text\",\"link\":\"Comment Text Char\",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"type\":\"Character\",\"name\":\"Comment Text Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"type\":\"Paragraph\",\"name\":\"annotation subject\",\"basedOn\":\"annotation text\",\"next\":\"annotation text\",\"link\":\"Comment Subject Char\",\"characterFormat\":{\"bold\":true,\"fontColor\":\"empty\",\"boldBidi\":true}},{\"type\":\"Character\",\"name\":\"Comment Subject Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"bold\":true,\"fontColor\":\"empty\",\"boldBidi\":true}},{\"type\":\"Character\",\"name\":\"Body Text Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"fontSize\":12.0,\"fontColor\":\"empty\",\"fontSizeBidi\":12.0}},{\"type\":\"Character\",\"name\":\"Prompt\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"fontColor\":\"#0000FFFF\"}},{\"type\":\"Paragraph\",\"name\":\"SigningLine\",\"basedOn\":\"Normal\",\"next\":\"SigningLine\",\"characterFormat\":{\"fontSize\":12.0,\"fontColor\":\"empty\",\"fontSizeBidi\":12.0},\"paragraphFormat\":{\"beforeSpacing\":2.0,\"afterSpacing\":2.0}},{\"type\":\"Character\",\"name\":\"Footer Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"type\":\"Paragraph\",\"name\":\"No Spacing\",\"next\":\"No Spacing\",\"link\":\"No Spacing Char\",\"characterFormat\":{\"fontSize\":11.0,\"fontFamily\":\"Calibri\",\"fontColor\":\"empty\",\"fontSizeBidi\":11.0}},{\"type\":\"Character\",\"name\":\"No Spacing Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"fontSize\":11.0,\"fontFamily\":\"Calibri\",\"fontColor\":\"empty\",\"fontSizeBidi\":11.0}},{\"type\":\"Paragraph\",\"name\":\"Default\",\"next\":\"Default\",\"characterFormat\":{\"fontSize\":12.0,\"fontFamily\":\"Calibri\",\"fontColor\":\"#000000FF\",\"fontSizeBidi\":12.0,\"fontFamilyBidi\":\"Calibri\"}},{\"type\":\"Paragraph\",\"name\":\"CM2\",\"basedOn\":\"Default\",\"next\":\"Default\",\"characterFormat\":{\"fontColor\":\"#00000000\",\"fontFamilyBidi\":\"Times New Roman\"},\"paragraphFormat\":{\"lineSpacing\":13.550000190734863,\"lineSpacingType\":\"AtLeast\"}},{\"type\":\"Paragraph\",\"name\":\"CM7\",\"basedOn\":\"Default\",\"next\":\"Default\",\"characterFormat\":{\"fontColor\":\"#00000000\",\"fontFamilyBidi\":\"Times New Roman\"}},{\"type\":\"Paragraph\",\"name\":\"CM4\",\"basedOn\":\"Default\",\"next\":\"Default\",\"characterFormat\":{\"fontColor\":\"#00000000\",\"fontFamilyBidi\":\"Times New Roman\"}},{\"type\":\"Paragraph\",\"name\":\"Footnote Text\",\"basedOn\":\"Normal\",\"next\":\"Footnote Text\",\"link\":\"Footnote Text Char\",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"type\":\"Character\",\"name\":\"Footnote Text Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"type\":\"Character\",\"name\":\"Footnote Reference\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"baselineAlignment\":\"Superscript\",\"fontColor\":\"empty\"}},{\"type\":\"Character\",\"name\":\"Unresolved Mention\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"fontColor\":\"#605E5CFF\"}}],\"defaultTabWidth\":36.0,\"formatting\":false,\"trackChanges\":false,\"protectionType\":\"NoProtection\",\"enforcement\":false,\"dontUseHTMLParagraphAutoSpacing\":true,\"alignTablesRowByRow\":true,\"formFieldShading\":true,\"footnotes\":{\"separator\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"\\u0003\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}],\"continuationSeparator\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"\\u0004\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}],\"continuationNotice\":[{\"inlines\":[]}]},\"endnotes\":{\"separator\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"\\u0003\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}],\"continuationSeparator\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"\\u0004\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}],\"continuationNotice\":[{\"inlines\":[]}]}}";
        editor.open(sfdtContent);
        expect(editor.documentHelper.pages.length).toBe(1);
        let bodyWidget = editor.documentHelper.pages[0].bodyWidgets[0];
        let lastBlock = bodyWidget.childWidgets[bodyWidget.childWidgets.length - 1] as ParagraphWidget;
        let previousBlock = lastBlock.previousWidget as ParagraphWidget;
        expect(lastBlock.y).toBeGreaterThan(previousBlock.y + previousBlock.height);
        let shapeBottom: number = previousBlock.floatingElements[0].y + previousBlock.floatingElements[0].height;
        expect(lastBlock.y).toBe(shapeBottom);
    });
});
