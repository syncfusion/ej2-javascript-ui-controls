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
        setTimeout(() => {
            done();
        }, 700);
    });
    it('Square wrapping style', () => {
        let sfdtContent = "{\"sections\":[{\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"shapeId\":3,\"name\":\"Text Box 3\",\"visible\":true,\"width\":94.32,\"height\":46.8,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":90.5,\"verticalOrigin\":\"Page\",\"verticalAlignment\":\"None\",\"horizontalPosition\":91.5,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251666432,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":true,\"distanceBottom\":0,\"distanceLeft\":21.6,\"distanceRight\":21.6,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"shapeId\":2,\"name\":\"Text Box 2\",\"visible\":true,\"width\":94.15,\"height\":47.05,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":90.5,\"verticalOrigin\":\"Page\",\"verticalAlignment\":\"None\",\"horizontalPosition\":91.5,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251659264,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":50,\"distanceRight\":40,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"text\":\"Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.\",\"characterFormat\":{\"fontColor\":\"empty\"}}]},{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"shapeId\":4,\"name\":\"Text Box 4\",\"visible\":true,\"width\":63.65,\"height\":72,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":28.55,\"verticalOrigin\":\"Paragraph\",\"verticalAlignment\":\"None\",\"horizontalPosition\":242.5,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251664384,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":9,\"distanceRight\":9,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"shapeId\":1,\"name\":\"Text Box 1\",\"visible\":true,\"width\":94.15,\"height\":47.05,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":31.55,\"verticalOrigin\":\"Paragraph\",\"verticalAlignment\":\"None\",\"horizontalPosition\":76,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251661312,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":50,\"distanceRight\":40,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"text\":\"Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.\",\"characterFormat\":{\"fontColor\":\"empty\"}}]},{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"shapeId\":6,\"name\":\"Text Box 6\",\"visible\":true,\"width\":94.32,\"height\":46.8,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":311.85,\"verticalOrigin\":\"Page\",\"verticalAlignment\":\"None\",\"horizontalPosition\":40,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251670528,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":0,\"distanceRight\":0,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"shapeId\":5,\"name\":\"Text Box 5\",\"visible\":true,\"width\":94.32,\"height\":46.8,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":306.35,\"verticalOrigin\":\"Page\",\"verticalAlignment\":\"None\",\"horizontalPosition\":249.5,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251668480,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":7.2,\"distanceRight\":7.2,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"text\":\"Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.\",\"characterFormat\":{\"fontColor\":\"empty\"}}]},{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"textAlignment\":\"Justify\",\"styleName\":\"Normal\"},\"inlines\":[{\"shapeId\":11,\"name\":\"Text Box 11\",\"visible\":true,\"width\":94.32,\"height\":46.8,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":506.7,\"verticalOrigin\":\"Page\",\"verticalAlignment\":\"None\",\"horizontalPosition\":-19.5,\"horizontalOrigin\":\"Margin\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251679744,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":0,\"distanceRight\":0,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"shapeId\":10,\"name\":\"Text Box 10\",\"visible\":true,\"width\":94.32,\"height\":46.8,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":417.3,\"verticalOrigin\":\"Page\",\"verticalAlignment\":\"None\",\"horizontalPosition\":65,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251677696,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":0,\"distanceRight\":0,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"shapeId\":9,\"name\":\"Text Box 9\",\"visible\":true,\"width\":94.32,\"height\":46.8,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":419.8,\"verticalOrigin\":\"Page\",\"verticalAlignment\":\"None\",\"horizontalPosition\":279.5,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251675648,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":0,\"distanceRight\":0,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"shapeId\":7,\"name\":\"Text Box 7\",\"visible\":true,\"width\":94.32,\"height\":46.8,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":311.85,\"verticalOrigin\":\"Page\",\"verticalAlignment\":\"None\",\"horizontalPosition\":40,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251673600,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":0,\"distanceRight\":0,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"shapeId\":8,\"name\":\"Text Box 8\",\"visible\":true,\"width\":94.32,\"height\":46.8,\"widthScale\":100,\"heightScale\":100,\"lineFormat\":{\"line\":true,\"lineFormatType\":\"Solid\",\"color\":\"#000000FF\",\"weight\":0.5,\"lineStyle\":\"Solid\"},\"fillFormat\":{\"color\":\"#FFFFFFFF\",\"fill\":true},\"textWrappingStyle\":\"Square\",\"textWrappingType\":\"Both\",\"verticalPosition\":306.35,\"verticalOrigin\":\"Page\",\"verticalAlignment\":\"None\",\"horizontalPosition\":249.5,\"horizontalOrigin\":\"Column\",\"horizontalAlignment\":\"None\",\"zOrderPosition\":251672576,\"allowOverlap\":true,\"layoutInCell\":true,\"lockAnchor\":false,\"distanceBottom\":0,\"distanceLeft\":7.2,\"distanceRight\":7.2,\"distanceTop\":0,\"autoShapeType\":\"Rectangle\",\"textFrame\":{\"textVerticalAlignment\":\"Top\",\"leftMargin\":7.2,\"rightMargin\":7.2,\"topMargin\":3.6,\"bottomMargin\":3.6,\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"Text Box with \",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"text\":\"TopAndBottom\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]}},{\"text\":\"Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.\",\"characterFormat\":{\"fontColor\":\"empty\"}}]},{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"textAlignment\":\"Justify\",\"styleName\":\"Normal\"},\"inlines\":[]},{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Normal\"},\"inlines\":[]}],\"headersFooters\":{\"header\":{\"blocks\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"styleName\":\"Header\"},\"inlines\":[{\"text\":\" \",\"characterFormat\":{\"fontColor\":\"empty\"}}]}]},\"footer\":{\"blocks\":[{\"inlines\":[]}]},\"evenHeader\":{\"blocks\":[{\"inlines\":[]}]},\"evenFooter\":{\"blocks\":[{\"inlines\":[]}]},\"firstPageHeader\":{\"blocks\":[{\"inlines\":[]}]},\"firstPageFooter\":{\"blocks\":[{\"inlines\":[]}]}},\"sectionFormat\":{\"headerDistance\":36,\"footerDistance\":36,\"pageWidth\":612,\"pageHeight\":792,\"leftMargin\":72,\"rightMargin\":72,\"topMargin\":72,\"bottomMargin\":72,\"differentFirstPage\":false,\"differentOddAndEvenPages\":false,\"bidi\":false,\"restartPageNumbering\":false,\"pageStartingNumber\":0,\"endnoteNumberFormat\":\"LowerCaseRoman\",\"footNoteNumberFormat\":\"Arabic\",\"restartIndexForFootnotes\":\"DoNotRestart\",\"restartIndexForEndnotes\":\"DoNotRestart\"}}],\"characterFormat\":{\"fontSize\":11,\"fontFamily\":\"Calibri\",\"fontColor\":\"empty\",\"fontSizeBidi\":11,\"fontFamilyBidi\":\"Arial\"},\"paragraphFormat\":{\"afterSpacing\":8,\"lineSpacing\":1.0791666507720947,\"lineSpacingType\":\"Multiple\"},\"background\":{\"color\":\"#FFFFFFFF\"},\"styles\":[{\"type\":\"Paragraph\",\"name\":\"Normal\",\"next\":\"Normal\",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"type\":\"Character\",\"name\":\"Default Paragraph Font\",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"type\":\"Paragraph\",\"name\":\"Header\",\"basedOn\":\"Normal\",\"next\":\"Header\",\"link\":\"Header Char\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"afterSpacing\":0,\"lineSpacing\":1,\"lineSpacingType\":\"Multiple\",\"tabs\":[{\"tabJustification\":\"Center\",\"position\":234,\"tabLeader\":\"None\",\"deletePosition\":0},{\"tabJustification\":\"Right\",\"position\":468,\"tabLeader\":\"None\",\"deletePosition\":0}]}},{\"type\":\"Character\",\"name\":\"Header Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"fontColor\":\"empty\"}},{\"type\":\"Paragraph\",\"name\":\"Footer\",\"basedOn\":\"Normal\",\"next\":\"Footer\",\"link\":\"Footer Char\",\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"afterSpacing\":0,\"lineSpacing\":1,\"lineSpacingType\":\"Multiple\",\"tabs\":[{\"tabJustification\":\"Center\",\"position\":234,\"tabLeader\":\"None\",\"deletePosition\":0},{\"tabJustification\":\"Right\",\"position\":468,\"tabLeader\":\"None\",\"deletePosition\":0}]}},{\"type\":\"Character\",\"name\":\"Footer Char\",\"basedOn\":\"Default Paragraph Font\",\"characterFormat\":{\"fontColor\":\"empty\"}}],\"defaultTabWidth\":36,\"formatting\":false,\"trackChanges\":false,\"protectionType\":\"NoProtection\",\"enforcement\":false,\"dontUseHTMLParagraphAutoSpacing\":false,\"alignTablesRowByRow\":false,\"formFieldShading\":true,\"footnotes\":{\"separator\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"afterSpacing\":0,\"lineSpacing\":1,\"lineSpacingType\":\"Multiple\",\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"\\u0003\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}],\"continuationSeparator\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"afterSpacing\":0,\"lineSpacing\":1,\"lineSpacingType\":\"Multiple\",\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"\\u0004\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}],\"continuationNotice\":[{\"inlines\":[]}]},\"endnotes\":{\"separator\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"afterSpacing\":0,\"lineSpacing\":1,\"lineSpacingType\":\"Multiple\",\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"\\u0003\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}],\"continuationSeparator\":[{\"characterFormat\":{\"fontColor\":\"empty\"},\"paragraphFormat\":{\"afterSpacing\":0,\"lineSpacing\":1,\"lineSpacingType\":\"Multiple\",\"styleName\":\"Normal\"},\"inlines\":[{\"text\":\"\\u0004\",\"characterFormat\":{\"fontColor\":\"empty\"}}]}],\"continuationNotice\":[{\"inlines\":[]}]}}"
        editor.open(sfdtContent);
        expect(editor.documentHelper.pages.length).toBe(1);
    });    
});