import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { DocumentHelper, Editor, LineWidget, ParagraphWidget, Selection, TabElementBox, TableRowWidget, TableWidget } from '../../src/index';
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
})