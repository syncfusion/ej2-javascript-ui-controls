import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { DocumentHelper, Editor, LineWidget, ParagraphWidget, Selection, TabElementBox, TableRowWidget, TableWidget, TableCellWidget, EditorHistory, TextElementBox, WordExport, SfdtExport, ElementBox, FootnoteElementBox } from '../../src/index';
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
    // it('Tab width calculation validation', () => {
    //     editor.open(JSON.stringify(tabstop));
    //     //tab element width is different for element with normal style
    //     expect(Math.round((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as TabElementBox).width)).toBe(30);
    //     //tab element width is different for element with font size 10 and font family time new roman
    //     expect(Math.round((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as TabElementBox).width)).toBe(10);
    // });
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
    // it('Table with Footnote Layout validation', () => {
    //     editor.open(JSON.stringify(json));
    //     //editor.editor.insertTable(1, 1);
    //     //editor.editor.insertFootnote();
    //     //editor.editor.insertText("thanver");
    //     expect(editor.documentHelper.layout.footHeight).toBeGreaterThan(0);
    // });
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
    // it('Tab after list element width calculation validation', () => {
    //     editor.editor.insertText('check');
    //     editor.selection.selectAll();
    //     editor.editor.applyNumbering('%1.', 'UpLetter');
    //     expect(Math.round((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as any).width)).toBe(10);
    // });
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
    // it('Field end element validation', () => {
    //     editor.openBlank();
    //     editor.editor.insertField('MERGEFIELD ' + 'Field1' + ' \\* MERGEFORMAT');
    //     editor.editor.onEnter();
    //     editor.editor.insertField('MERGEFIELD ' + 'Field2' + ' \\* MERGEFORMAT');
    //     editor.selection.handleHomeKey();
    //     editor.selection.handleUpKey();
    //     editor.selection.handleControlRightKey();
    //     editor.editor.onEnter();
    //     editor.editor.onEnter();
    //     editor.editorHistory.undo();
    //     expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget).y).toBe(112);
    // });    
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
    it('Square wrapping text alignment validation',()  =>{
        let sfdt = '{"sections":[{"blocks":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"textAlignment":"Left","styleName":"Normal"},"inlines":[{"shapeId":6,"name":"Text Box 6","alternativeText":null,"title":null,"visible":true,"width":94.32,"height":46.8,"widthScale":100.0,"heightScale":100.0,"lineFormat":{"lineFormatType":"Solid","color":"#000000FF","weight":0.5,"lineStyle":"Solid"},"fillFormat":{"color":"#FFFFFFFF","fill":true},"verticalPosition":88.71,"verticalOrigin":"Page","verticalAlignment":"None","horizontalPosition":251.0,"horizontalOrigin":"Column","horizontalAlignment":"None","zOrderPosition":251660288,"allowOverlap":true,"layoutInCell":true,"lockAnchor":false,"textWrappingStyle":"Square","textWrappingType":"Both","distanceBottom":0.0,"distanceLeft":7.2,"distanceRight":7.2,"distanceTop":0.0,"autoShapeType":"Rectangle","textFrame":{"textVerticalAlignment":"Top","leftMargin":7.2,"rightMargin":7.2,"topMargin":3.6,"bottomMargin":3.6,"blocks":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"Text Box with ","characterFormat":{"fontColor":"empty"}},{"text":"TopAndBottom","characterFormat":{"fontColor":"empty"}}]}]}},{"shapeId":7,"name":"Text Box 7","alternativeText":null,"title":null,"visible":true,"width":94.32,"height":46.8,"widthScale":100.0,"heightScale":100.0,"lineFormat":{"lineFormatType":"Solid","color":"#000000FF","weight":0.5,"lineStyle":"Solid"},"fillFormat":{"color":"#FFFFFFFF","fill":true},"verticalPosition":88.41,"verticalOrigin":"Page","verticalAlignment":"None","horizontalPosition":40.28,"horizontalOrigin":"Column","horizontalAlignment":"None","zOrderPosition":251662336,"allowOverlap":true,"layoutInCell":true,"lockAnchor":false,"textWrappingStyle":"Square","textWrappingType":"Both","distanceBottom":0.0,"distanceLeft":0.0,"distanceRight":0.0,"distanceTop":0.0,"autoShapeType":"Rectangle","textFrame":{"textVerticalAlignment":"Top","leftMargin":7.2,"rightMargin":7.2,"topMargin":3.6,"bottomMargin":3.6,"blocks":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"Text Box with ","characterFormat":{"fontColor":"empty"}},{"text":"TopAndBottom","characterFormat":{"fontColor":"empty"}}]}]}},{"text":"Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.","characterFormat":{"fontColor":"empty"}}]},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"styleName":"Normal"},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"styleName":"Header"},"inlines":[{"text":" ","characterFormat":{"fontColor":"empty"}}]}]},"footer":{"blocks":[{"inlines":[]}]},"evenHeader":{"blocks":[{"inlines":[]}]},"evenFooter":{"blocks":[{"inlines":[]}]},"firstPageHeader":{"blocks":[{"inlines":[]}]},"firstPageFooter":{"blocks":[{"inlines":[]}]}},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0,"endnoteNumberFormat":"LowerCaseRoman","footNoteNumberFormat":"Arabic","restartIndexForFootnotes":"DoNotRestart","restartIndexForEndnotes":"DoNotRestart"}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontColor":"empty","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"fontColor":"empty"}},{"type":"Character","name":"Default Paragraph Font","characterFormat":{"fontColor":"empty"}},{"type":"Paragraph","name":"Header","basedOn":"Normal","next":"Header","link":"Header Char","characterFormat":{"fontColor":"empty"},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","tabs":[{"tabJustification":"Center","position":234.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Header Char","basedOn":"Default Paragraph Font","characterFormat":{"fontColor":"empty"}},{"type":"Paragraph","name":"Footer","basedOn":"Normal","next":"Footer","link":"Footer Char","characterFormat":{"fontColor":"empty"},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","tabs":[{"tabJustification":"Center","position":234.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Footer Char","basedOn":"Default Paragraph Font","characterFormat":{"fontColor":"empty"}}],"defaultTabWidth":36.0,"formatting":false,"trackChanges":false,"protectionType":"NoProtection","enforcement":false,"dontUseHTMLParagraphAutoSpacing":false,"alignTablesRowByRow":false,"formFieldShading":true,"footnotes":{"separator":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","styleName":"Normal"},"inlines":[{"text":"\\u0003","characterFormat":{"fontColor":"empty"}}]}],"continuationSeparator":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","styleName":"Normal"},"inlines":[{"text":"\\u0004","characterFormat":{"fontColor":"empty"}}]}],"continuationNotice":[{"inlines":[]}]},"endnotes":{"separator":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","styleName":"Normal"},"inlines":[{"text":"\\u0003","characterFormat":{"fontColor":"empty"}}]}],"continuationSeparator":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","styleName":"Normal"},"inlines":[{"text":"\\u0004","characterFormat":{"fontColor":"empty"}}]}],"continuationNotice":[{"inlines":[]}]}}'; 
        
        editor.open(sfdt);
        
        let paragraph: ParagraphWidget = editor.selection.start.paragraph;

        expect((paragraph.childWidgets[1] as LineWidget).children[1].margin.left).toBe(0)

        expect((paragraph.childWidgets[1] as LineWidget).children[2].margin.left).toBe(0);

        expect((paragraph.childWidgets[2] as LineWidget).children[0].margin.left).toBe(0)

        expect((paragraph.childWidgets[2] as LineWidget).children[1].margin.left).toBe(0);

        editor.editorModule.toggleTextAlignment("Center");

        let firstLeft = (paragraph.childWidgets[1] as LineWidget).children[1].margin.left;
        
        expect(firstLeft).toBeGreaterThan(0)

        let secondLeft = (paragraph.childWidgets[1] as LineWidget).children[2].margin.left;

        expect(secondLeft).toBeGreaterThan(0);

        let thirdLeft = (paragraph.childWidgets[2] as LineWidget).children[0].margin.left;
        
        expect(thirdLeft).toBeGreaterThan(0)

        let fourthLeft = (paragraph.childWidgets[2] as LineWidget).children[1].margin.left;

        expect(fourthLeft).toBeGreaterThan(0);

        editor.editorModule.toggleTextAlignment("Right");

        expect((paragraph.childWidgets[1] as LineWidget).children[1].margin.left).toBe(firstLeft*2)

        expect((paragraph.childWidgets[1] as LineWidget).children[2].margin.left).toBe(secondLeft *2);

        expect((paragraph.childWidgets[2] as LineWidget).children[0].margin.left).toBe(thirdLeft *2)

        expect((paragraph.childWidgets[2] as LineWidget).children[1].margin.left).toBe(fourthLeft * 2);

        editor.editorModule.toggleTextAlignment("Justify");
    }); 
});

let shapeJson: any = {
    "sections": [
        {
            "blocks": [
                {
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 8.0,
                        "fontFamily": "Source Sans Pro",
                        "fontColor": "empty",
                        "fontSizeBidi": 8.0
                    },
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "BUSINESS RELATIONSHIP",
                            "characterFormat": {
                                "bold": true,
                                "highlightColor": "Yellow",
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 8.0,
                        "fontFamily": "Source Sans Pro",
                        "fontColor": "empty",
                        "fontSizeBidi": 8.0
                    },
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "shapeId": 15,
                            "name": "Rectangle 183",
                            "visible": true,
                            "width": 16.5,
                            "height": 14.25,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "line": true,
                                "lineFormatType": "Solid",
                                "color": "#000000FF",
                                "weight": 0.75,
                                "lineStyle": "Solid"
                            },
                            "fillFormat": {
                                "color": "#FFFFFFFF",
                                "fill": true
                            },
                            "textWrappingStyle": "InFrontOfText",
                            "textWrappingType": "Both",
                            "verticalPosition": 12.05,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 49.5,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251659264,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "distanceBottom": 0.0,
                            "distanceLeft": 9.0,
                            "distanceRight": 9.0,
                            "distanceTop": 0.0,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 7.2,
                                "rightMargin": 7.2,
                                "topMargin": 3.6,
                                "bottomMargin": 3.6,
                                "blocks": [
                                    {
                                        "inlines": []
                                    }
                                ]
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "fontSize": 8.0,
                        "fontFamily": "Source Sans Pro",
                        "fontColor": "empty",
                        "fontSizeBidi": 8.0
                    },
                    "paragraphFormat": {
                        "leftIndent": 72.0,
                        "afterSpacing": 12.0,
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "shapeId": 14,
                            "name": "Rectangle 184",
                            "visible": true,
                            "width": 16.5,
                            "height": 14.25,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "line": true,
                                "lineFormatType": "Solid",
                                "color": "#000000FF",
                                "weight": 0.75,
                                "lineStyle": "Solid"
                            },
                            "fillFormat": {
                                "color": "#FFFFFFFF",
                                "fill": true
                            },
                            "textWrappingStyle": "InFrontOfText",
                            "textWrappingType": "Both",
                            "verticalPosition": 22.35,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 49.5,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251660288,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "distanceBottom": 0.0,
                            "distanceLeft": 9.0,
                            "distanceRight": 9.0,
                            "distanceTop": 0.0,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 7.2,
                                "rightMargin": 7.2,
                                "topMargin": 3.6,
                                "bottomMargin": 3.6,
                                "blocks": [
                                    {
                                        "inlines": []
                                    }
                                ]
                            }
                        },
                        {
                            "text": "Purchasing residential property for personal use",
                            "characterFormat": {
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "fontSize": 8.0,
                        "fontFamily": "Source Sans Pro",
                        "fontColor": "empty",
                        "fontSizeBidi": 8.0
                    },
                    "paragraphFormat": {
                        "leftIndent": 72.0,
                        "afterSpacing": 12.0,
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "shapeId": 13,
                            "name": "Rectangle 185",
                            "visible": true,
                            "width": 16.5,
                            "height": 14.25,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "line": true,
                                "lineFormatType": "Solid",
                                "color": "#000000FF",
                                "weight": 0.75,
                                "lineStyle": "Solid"
                            },
                            "fillFormat": {
                                "color": "#FFFFFFFF",
                                "fill": true
                            },
                            "textWrappingStyle": "InFrontOfText",
                            "textWrappingType": "Both",
                            "verticalPosition": 22.45,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 49.5,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251661312,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "distanceBottom": 0.0,
                            "distanceLeft": 9.0,
                            "distanceRight": 9.0,
                            "distanceTop": 0.0,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 7.2,
                                "rightMargin": 7.2,
                                "topMargin": 3.6,
                                "bottomMargin": 3.6,
                                "blocks": [
                                    {
                                        "inlines": []
                                    }
                                ]
                            }
                        },
                        {
                            "text": "Purchasing residential property for investment purposes",
                            "characterFormat": {
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "fontSize": 8.0,
                        "fontFamily": "Source Sans Pro",
                        "fontColor": "empty",
                        "fontSizeBidi": 8.0
                    },
                    "paragraphFormat": {
                        "leftIndent": 72.0,
                        "afterSpacing": 12.0,
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "shapeId": 12,
                            "name": "Rectangle 186",
                            "visible": true,
                            "width": 16.5,
                            "height": 14.25,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "line": true,
                                "lineFormatType": "Solid",
                                "color": "#000000FF",
                                "weight": 0.75,
                                "lineStyle": "Solid"
                            },
                            "fillFormat": {
                                "color": "#FFFFFFFF",
                                "fill": true
                            },
                            "textWrappingStyle": "InFrontOfText",
                            "textWrappingType": "Both",
                            "verticalPosition": 22.0,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 49.5,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251662336,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "distanceBottom": 0.0,
                            "distanceLeft": 9.0,
                            "distanceRight": 9.0,
                            "distanceTop": 0.0,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 7.2,
                                "rightMargin": 7.2,
                                "topMargin": 3.6,
                                "bottomMargin": 3.6,
                                "blocks": [
                                    {
                                        "inlines": []
                                    }
                                ]
                            }
                        },
                        {
                            "text": "Purchasing residential property for family, close ",
                            "characterFormat": {
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "associate",
                            "characterFormat": {
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": " or associate purposes",
                            "characterFormat": {
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "fontSize": 8.0,
                        "fontFamily": "Source Sans Pro",
                        "fontColor": "empty",
                        "fontSizeBidi": 8.0
                    },
                    "paragraphFormat": {
                        "leftIndent": 72.0,
                        "afterSpacing": 12.0,
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "shapeId": 11,
                            "name": "Rectangle 187",
                            "visible": true,
                            "width": 16.5,
                            "height": 14.25,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "line": true,
                                "lineFormatType": "Solid",
                                "color": "#000000FF",
                                "weight": 0.75,
                                "lineStyle": "Solid"
                            },
                            "fillFormat": {
                                "color": "#FFFFFFFF",
                                "fill": true
                            },
                            "textWrappingStyle": "InFrontOfText",
                            "textWrappingType": "Both",
                            "verticalPosition": 20.1,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 49.5,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251663360,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "distanceBottom": 0.0,
                            "distanceLeft": 9.0,
                            "distanceRight": 9.0,
                            "distanceTop": 0.0,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 7.2,
                                "rightMargin": 7.2,
                                "topMargin": 3.6,
                                "bottomMargin": 3.6,
                                "blocks": [
                                    {
                                        "inlines": []
                                    }
                                ]
                            }
                        },
                        {
                            "text": "Selling residential property that was held for personal or investment purposes",
                            "characterFormat": {
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "fontSize": 8.0,
                        "fontFamily": "Source Sans Pro",
                        "fontColor": "empty",
                        "fontSizeBidi": 8.0,
                        "fontFamilyBidi": "Arial"
                    },
                    "paragraphFormat": {
                        "leftIndent": 72.0,
                        "afterSpacing": 12.0,
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "Other (provide details):",
                            "characterFormat": {
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": " _____________________________________________________________________",
                            "characterFormat": {
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0,
                                "fontFamilyBidi": "Arial"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 8.0,
                        "fontFamily": "Source Sans Pro",
                        "fontColor": "empty",
                        "fontSizeBidi": 8.0
                    },
                    "paragraphFormat": {
                        "afterSpacing": 12.0,
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "Multiple Purchases Question",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        }
                    ]
                }
            ],
            "headersFooters": {
                "header": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                },
                "footer": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                },
                "evenHeader": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                },
                "evenFooter": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                },
                "firstPageHeader": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                },
                "firstPageFooter": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                }
            },
            "sectionFormat": {
                "headerDistance": 36.0,
                "footerDistance": 36.0,
                "pageWidth": 612.0,
                "pageHeight": 792.0,
                "leftMargin": 72.0,
                "rightMargin": 72.0,
                "topMargin": 72.0,
                "bottomMargin": 72.0,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "bidi": false,
                "restartPageNumbering": false,
                "pageStartingNumber": 0,
                "endnoteNumberFormat": "LowerCaseRoman",
                "footNoteNumberFormat": "Arabic",
                "restartIndexForFootnotes": "DoNotRestart",
                "restartIndexForEndnotes": "DoNotRestart"
            }
        }
    ],
    "characterFormat": {
        "fontSize": 11.0,
        "fontFamily": "Calibri",
        "fontColor": "empty",
        "fontSizeBidi": 11.0,
        "fontFamilyBidi": "Arial"
    },
    "paragraphFormat": {
        "afterSpacing": 8.0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple"
    },
    "background": {
        "color": "#FFFFFFFF"
    },
    "styles": [
        {
            "type": "Paragraph",
            "name": "Normal",
            "next": "Normal",
            "characterFormat": {
                "fontSize": 10.0,
                "fontFamily": "Times New Roman",
                "fontColor": "empty",
                "fontSizeBidi": 10.0,
                "fontFamilyBidi": "Times New Roman"
            },
            "paragraphFormat": {
                "afterSpacing": 0.0,
                "lineSpacing": 1.0,
                "lineSpacingType": "Multiple"
            }
        },
        {
            "type": "Character",
            "name": "Default Paragraph Font",
            "characterFormat": {
                "fontColor": "empty"
            }
        }
    ],
    "defaultTabWidth": 36.0,
    "formatting": false,
    "trackChanges": false,
    "protectionType": "NoProtection",
    "enforcement": false,
    "dontUseHTMLParagraphAutoSpacing": false,
    "alignTablesRowByRow": false,
    "formFieldShading": true,
    "footnotes": {
        "separator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0003",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0004",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "inlines": []
            }
        ]
    },
    "endnotes": {
        "separator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0003",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0004",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "inlines": []
            }
        ]
    }
};

describe('TextBox position validation', () => {
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
    it('Text box position', () => {
        editor.open(JSON.stringify(shapeJson));
        let bodyWidget = editor.documentHelper.pages[0].bodyWidgets[0];
        expect(((bodyWidget.childWidgets[2] as ParagraphWidget).childWidgets[0] as LineWidget).children[0].x).toBeGreaterThan(160);
        expect(((bodyWidget.childWidgets[2] as ParagraphWidget).childWidgets[0] as LineWidget).children[0].x).toBeLessThan(164);
    });
});

let tabJson: any = {
    "sections": [
        {
            "blocks": [
                {
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 8.0,
                        "fontFamily": "Source Sans Pro",
                        "fontColor": "empty",
                        "fontSizeBidi": 8.0
                    },
                    "paragraphFormat": {
                        "leftIndent": 4.5,
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "Purpose of Transaction",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 8.0,
                        "fontFamily": "Source Sans Pro",
                        "fontColor": "empty",
                        "fontSizeBidi": 8.0
                    },
                    "paragraphFormat": {
                        "leftIndent": 4.5,
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "shapeId": 29,
                            "name": "Rectangle 176",
                            "visible": true,
                            "width": 16.5,
                            "height": 14.25,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "line": true,
                                "lineFormatType": "Solid",
                                "color": "#000000FF",
                                "weight": 0.75,
                                "lineStyle": "Solid"
                            },
                            "fillFormat": {
                                "color": "#FFFFFFFF",
                                "fill": true
                            },
                            "textWrappingStyle": "InFrontOfText",
                            "textWrappingType": "Both",
                            "verticalPosition": 1.45,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 49.5,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251652608,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "distanceBottom": 0.0,
                            "distanceLeft": 9.0,
                            "distanceRight": 9.0,
                            "distanceTop": 0.0,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 7.2,
                                "rightMargin": 7.2,
                                "topMargin": 3.6,
                                "bottomMargin": 3.6,
                                "blocks": [
                                    {
                                        "inlines": []
                                    }
                                ]
                            }
                        },
                        {
                            "shapeId": 28,
                            "name": "Rectangle 175",
                            "visible": true,
                            "width": 16.5,
                            "height": 14.25,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "line": true,
                                "lineFormatType": "Solid",
                                "color": "#000000FF",
                                "weight": 0.75,
                                "lineStyle": "Solid"
                            },
                            "fillFormat": {
                                "color": "#FFFFFFFF",
                                "fill": true
                            },
                            "textWrappingStyle": "InFrontOfText",
                            "textWrappingType": "Both",
                            "verticalPosition": 1.45,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 194.25,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251651584,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "distanceBottom": 0.0,
                            "distanceLeft": 9.0,
                            "distanceRight": 9.0,
                            "distanceTop": 0.0,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 7.2,
                                "rightMargin": 7.2,
                                "topMargin": 3.6,
                                "bottomMargin": 3.6,
                                "blocks": [
                                    {
                                        "inlines": []
                                    }
                                ]
                            }
                        },
                        {
                            "shapeId": 27,
                            "name": "Rectangle 174",
                            "visible": true,
                            "width": 16.5,
                            "height": 14.25,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "line": true,
                                "lineFormatType": "Solid",
                                "color": "#000000FF",
                                "weight": 0.75,
                                "lineStyle": "Solid"
                            },
                            "fillFormat": {
                                "color": "#FFFFFFFF",
                                "fill": true
                            },
                            "textWrappingStyle": "InFrontOfText",
                            "textWrappingType": "Both",
                            "verticalPosition": 1.45,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 374.25,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251650560,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "distanceBottom": 0.0,
                            "distanceLeft": 9.0,
                            "distanceRight": 9.0,
                            "distanceTop": 0.0,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 7.2,
                                "rightMargin": 7.2,
                                "topMargin": 3.6,
                                "bottomMargin": 3.6,
                                "blocks": [
                                    {
                                        "inlines": []
                                    }
                                ]
                            }
                        },
                        {
                            "text": "\t",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "\t",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "Deposit",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "\t",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "\t",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "\t",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "\t",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "Partial Deposit",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "\t",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "\t",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "\t",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "\t",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "Upgrades",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 8.0,
                        "fontFamily": "Source Sans Pro",
                        "fontColor": "empty",
                        "fontSizeBidi": 8.0
                    },
                    "paragraphFormat": {
                        "leftIndent": 4.5,
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 8.0,
                        "fontFamily": "Source Sans Pro",
                        "fontColor": "empty",
                        "fontSizeBidi": 8.0
                    },
                    "paragraphFormat": {
                        "leftIndent": 4.5,
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "Method of Payment",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 8.0,
                        "fontFamily": "Source Sans Pro",
                        "fontColor": "empty",
                        "fontSizeBidi": 8.0
                    },
                    "paragraphFormat": {
                        "leftIndent": 4.5,
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "shapeId": 26,
                            "name": "Rectangle 173",
                            "visible": true,
                            "width": 16.5,
                            "height": 14.25,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "line": true,
                                "lineFormatType": "Solid",
                                "color": "#000000FF",
                                "weight": 0.75,
                                "lineStyle": "Solid"
                            },
                            "fillFormat": {
                                "color": "#FFFFFFFF",
                                "fill": true
                            },
                            "textWrappingStyle": "InFrontOfText",
                            "textWrappingType": "Both",
                            "verticalPosition": 1.55,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 374.25,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251649536,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "distanceBottom": 0.0,
                            "distanceLeft": 9.0,
                            "distanceRight": 9.0,
                            "distanceTop": 0.0,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 7.2,
                                "rightMargin": 7.2,
                                "topMargin": 3.6,
                                "bottomMargin": 3.6,
                                "blocks": [
                                    {
                                        "inlines": []
                                    }
                                ]
                            }
                        },
                        {
                            "shapeId": 25,
                            "name": "Rectangle 172",
                            "visible": true,
                            "width": 16.5,
                            "height": 14.25,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "line": true,
                                "lineFormatType": "Solid",
                                "color": "#000000FF",
                                "weight": 0.75,
                                "lineStyle": "Solid"
                            },
                            "fillFormat": {
                                "color": "#FFFFFFFF",
                                "fill": true
                            },
                            "textWrappingStyle": "InFrontOfText",
                            "textWrappingType": "Both",
                            "verticalPosition": 1.55,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 194.25,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251648512,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "distanceBottom": 0.0,
                            "distanceLeft": 9.0,
                            "distanceRight": 9.0,
                            "distanceTop": 0.0,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 7.2,
                                "rightMargin": 7.2,
                                "topMargin": 3.6,
                                "bottomMargin": 3.6,
                                "blocks": [
                                    {
                                        "inlines": []
                                    }
                                ]
                            }
                        },
                        {
                            "shapeId": 24,
                            "name": "Rectangle 171",
                            "visible": true,
                            "width": 16.5,
                            "height": 14.25,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "line": true,
                                "lineFormatType": "Solid",
                                "color": "#000000FF",
                                "weight": 0.75,
                                "lineStyle": "Solid"
                            },
                            "fillFormat": {
                                "color": "#FFFFFFFF",
                                "fill": true
                            },
                            "textWrappingStyle": "InFrontOfText",
                            "textWrappingType": "Both",
                            "verticalPosition": 1.55,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 49.5,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251647488,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "distanceBottom": 0.0,
                            "distanceLeft": 9.0,
                            "distanceRight": 9.0,
                            "distanceTop": 0.0,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 7.2,
                                "rightMargin": 7.2,
                                "topMargin": 3.6,
                                "bottomMargin": 3.6,
                                "blocks": [
                                    {
                                        "inlines": []
                                    }
                                ]
                            }
                        },
                        {
                            "text": "\t",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "\t",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "Cheque/ Debit",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "\t",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "\t",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "\t",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "Certified Cheque/ Money Order",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "\t",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "\t",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        },
                        {
                            "text": "Credit Card",
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8.0,
                                "fontFamily": "Source Sans Pro",
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0
                            }
                        }
                    ]
                }
            ],
            "headersFooters": {
                "header": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                },
                "footer": {
                    "blocks": [
                        {
                            "characterFormat": {
                                "fontSize": 8.0,
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0,
                                "fontFamilyBidi": "Calibri"
                            },
                            "paragraphFormat": {
                                "styleName": "Footer"
                            },
                            "inlines": [
                                {
                                    "text": "Availability of options are subject to lot conditions, model and construction status",
                                    "characterFormat": {
                                        "fontSize": 8.0,
                                        "fontColor": "empty",
                                        "fontSizeBidi": 8.0,
                                        "fontFamilyBidi": "Calibri"
                                    }
                                },
                                {
                                    "text": "\t",
                                    "characterFormat": {
                                        "fontSize": 8.0,
                                        "fontColor": "empty",
                                        "fontSizeBidi": 8.0,
                                        "fontFamilyBidi": "Calibri"
                                    }
                                },
                                {
                                    "text": "Issued: April 4, 2020",
                                    "characterFormat": {
                                        "fontSize": 8.0,
                                        "fontColor": "empty",
                                        "fontSizeBidi": 8.0,
                                        "fontFamilyBidi": "Calibri"
                                    }
                                }
                            ]
                        },
                        {
                            "characterFormat": {
                                "fontSize": 8.0,
                                "fontColor": "empty",
                                "fontSizeBidi": 8.0,
                                "fontFamilyBidi": "Calibri"
                            },
                            "paragraphFormat": {
                                "styleName": "Footer"
                            },
                            "inlines": [
                                {
                                    "text": "\t",
                                    "characterFormat": {
                                        "fontSize": 8.0,
                                        "fontColor": "empty",
                                        "fontSizeBidi": 8.0,
                                        "fontFamilyBidi": "Calibri"
                                    }
                                },
                                {
                                    "text": "\t",
                                    "characterFormat": {
                                        "fontSize": 8.0,
                                        "fontColor": "empty",
                                        "fontSizeBidi": 8.0,
                                        "fontFamilyBidi": "Calibri"
                                    }
                                },
                                {
                                    "text": "Errors & Omissions Excluded",
                                    "characterFormat": {
                                        "fontSize": 8.0,
                                        "fontColor": "empty",
                                        "fontSizeBidi": 8.0,
                                        "fontFamilyBidi": "Calibri"
                                    }
                                }
                            ]
                        }
                    ]
                },
                "evenHeader": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                },
                "evenFooter": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                },
                "firstPageHeader": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                },
                "firstPageFooter": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                }
            },
            "sectionFormat": {
                "headerDistance": 28.350000381469727,
                "footerDistance": 15.100000381469727,
                "pageWidth": 612.0,
                "pageHeight": 1008.0,
                "leftMargin": 28.100000381469727,
                "rightMargin": 36.0,
                "topMargin": 34.700000762939453,
                "bottomMargin": 28.100000381469727,
                "differentFirstPage": false,
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
        "fontFamily": "Times New Roman",
        "fontColor": "empty",
        "fontFamilyBidi": "Times New Roman"
    },
    "lists": [
        {
            "listId": 15,
            "abstractListId": 15
        },
        {
            "listId": 21,
            "abstractListId": 21
        },
        {
            "listId": 26,
            "abstractListId": 3,
            "levelOverrides": [
                {
                    "startAt": 1,
                    "levelNumber": 0
                },
                {
                    "startAt": 1,
                    "levelNumber": 1
                },
                {
                    "startAt": 1,
                    "levelNumber": 2
                },
                {
                    "startAt": 1,
                    "levelNumber": 3
                },
                {
                    "startAt": 1,
                    "levelNumber": 4
                },
                {
                    "startAt": 1,
                    "levelNumber": 5
                },
                {
                    "startAt": 1,
                    "levelNumber": 6
                },
                {
                    "startAt": 1,
                    "levelNumber": 7
                },
                {
                    "startAt": 1,
                    "levelNumber": 8
                }
            ]
        }
    ],
    "abstractLists": [
        {
            "abstractListId": 3,
            "levels": [
                {
                    "startAt": 1,
                    "restartLevel": 0,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "None",
                    "numberFormat": "Article %1",
                    "characterFormat": {
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontFamily": "Times New Roman",
                        "fontColor": "#000000FF",
                        "italicBidi": false,
                        "fontFamilyBidi": "Times New Roman",
                        "allCaps": false
                    },
                    "paragraphFormat": {
                        "leftIndent": 0.0,
                        "firstLineIndent": 0.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 1,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%1.%2",
                    "characterFormat": {
                        "bold": true,
                        "fontFamily": "Arial",
                        "fontColor": "empty",
                        "fontFamilyBidi": "Arial"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36.0,
                        "firstLineIndent": -36.0,
                        "tabs": [
                            {
                                "tabJustification": "List",
                                "position": 36.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            }
                        ]
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 2,
                    "listLevelPattern": "LowLetter",
                    "followCharacter": "Tab",
                    "numberFormat": "(%3)",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 72.0,
                        "firstLineIndent": -36.0,
                        "tabs": [
                            {
                                "tabJustification": "List",
                                "position": 72.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            }
                        ]
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 3,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "(%4)",
                    "characterFormat": {
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontFamily": "Times New Roman",
                        "fontColor": "#000000FF",
                        "italicBidi": false,
                        "fontFamilyBidi": "Times New Roman",
                        "allCaps": false
                    },
                    "paragraphFormat": {
                        "leftIndent": 108.0,
                        "firstLineIndent": -21.600000381469727,
                        "tabs": [
                            {
                                "tabJustification": "List",
                                "position": 108.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            }
                        ]
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 4,
                    "listLevelPattern": "UpLetter",
                    "followCharacter": "Tab",
                    "numberFormat": "(%5)",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 144.0,
                        "firstLineIndent": -36.0,
                        "tabs": [
                            {
                                "tabJustification": "List",
                                "position": 144.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            }
                        ]
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 5,
                    "listLevelPattern": "UpRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "(%6)",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 180.0,
                        "firstLineIndent": -21.600000381469727,
                        "tabs": [
                            {
                                "tabJustification": "List",
                                "position": 180.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            }
                        ]
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 6,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "(%7)",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 216.0,
                        "firstLineIndent": -36.0,
                        "tabs": [
                            {
                                "tabJustification": "List",
                                "position": 216.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            }
                        ]
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 7,
                    "listLevelPattern": "LowLetter",
                    "followCharacter": "Tab",
                    "numberFormat": "%8)",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 252.0,
                        "firstLineIndent": -36.0,
                        "tabs": [
                            {
                                "tabJustification": "List",
                                "position": 252.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            }
                        ]
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 8,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%9)",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 288.0,
                        "firstLineIndent": -21.600000381469727,
                        "tabs": [
                            {
                                "tabJustification": "List",
                                "position": 288.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            }
                        ]
                    }
                }
            ]
        },
        {
            "abstractListId": 15,
            "levels": [
                {
                    "startAt": 1,
                    "restartLevel": 0,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "Article %1.",
                    "characterFormat": {
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontFamily": "Times New Roman",
                        "fontColor": "#000000FF",
                        "boldBidi": false,
                        "italicBidi": false,
                        "fontFamilyBidi": "Times New Roman",
                        "allCaps": false
                    },
                    "paragraphFormat": {
                        "leftIndent": 36.0,
                        "firstLineIndent": -18.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 1,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%2.%1",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 72.5999984741211,
                        "firstLineIndent": -18.600000381469727
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 2,
                    "listLevelPattern": "LowLetter",
                    "followCharacter": "Tab",
                    "numberFormat": "(%3)",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 108.0,
                        "firstLineIndent": -9.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 3,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%4.",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 144.0,
                        "firstLineIndent": -18.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 4,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%5.",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 180.0,
                        "firstLineIndent": -18.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 5,
                    "listLevelPattern": "LowLetter",
                    "followCharacter": "Tab",
                    "numberFormat": "%6.",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 216.0,
                        "firstLineIndent": -9.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 6,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%7.",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 252.0,
                        "firstLineIndent": -18.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 7,
                    "listLevelPattern": "LowLetter",
                    "followCharacter": "Tab",
                    "numberFormat": "%8.",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 288.0,
                        "firstLineIndent": -18.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 8,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%9.",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 324.0,
                        "firstLineIndent": -9.0
                    }
                }
            ]
        },
        {
            "abstractListId": 21,
            "levels": [
                {
                    "startAt": 1,
                    "restartLevel": 0,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "None",
                    "numberFormat": "Article %1",
                    "characterFormat": {
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontFamily": "Times New Roman",
                        "fontColor": "#000000FF",
                        "italicBidi": false,
                        "fontFamilyBidi": "Times New Roman",
                        "allCaps": false
                    },
                    "paragraphFormat": {
                        "leftIndent": 0.0,
                        "firstLineIndent": 0.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 1,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%1.%2",
                    "characterFormat": {
                        "bold": true,
                        "fontFamily": "Arial",
                        "fontColor": "empty",
                        "fontFamilyBidi": "Arial"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36.0,
                        "firstLineIndent": -36.0,
                        "tabs": [
                            {
                                "tabJustification": "List",
                                "position": 36.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            }
                        ]
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 2,
                    "listLevelPattern": "LowLetter",
                    "followCharacter": "Tab",
                    "numberFormat": "(%3)",
                    "characterFormat": {
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 9.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "#000000FF",
                        "italicBidi": false,
                        "fontSizeBidi": 9.0,
                        "fontFamilyBidi": "Times New Roman",
                        "allCaps": false
                    },
                    "paragraphFormat": {
                        "leftIndent": 72.0,
                        "firstLineIndent": -36.0,
                        "tabs": [
                            {
                                "tabJustification": "List",
                                "position": 72.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            }
                        ]
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 3,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "(%4)",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 108.0,
                        "firstLineIndent": -21.600000381469727,
                        "tabs": [
                            {
                                "tabJustification": "List",
                                "position": 108.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            }
                        ]
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 4,
                    "listLevelPattern": "UpLetter",
                    "followCharacter": "Tab",
                    "numberFormat": "(%5)",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 144.0,
                        "firstLineIndent": -36.0,
                        "tabs": [
                            {
                                "tabJustification": "List",
                                "position": 144.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            }
                        ]
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 5,
                    "listLevelPattern": "UpRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "(%6)",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 180.0,
                        "firstLineIndent": -21.600000381469727,
                        "tabs": [
                            {
                                "tabJustification": "List",
                                "position": 180.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            }
                        ]
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 6,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "(%7)",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 216.0,
                        "firstLineIndent": -36.0,
                        "tabs": [
                            {
                                "tabJustification": "List",
                                "position": 216.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            }
                        ]
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 7,
                    "listLevelPattern": "LowLetter",
                    "followCharacter": "Tab",
                    "numberFormat": "%8)",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 252.0,
                        "firstLineIndent": -36.0,
                        "tabs": [
                            {
                                "tabJustification": "List",
                                "position": 252.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            }
                        ]
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 8,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%9)",
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "leftIndent": 288.0,
                        "firstLineIndent": -21.600000381469727,
                        "tabs": [
                            {
                                "tabJustification": "List",
                                "position": 288.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            }
                        ]
                    }
                }
            ]
        }
    ],
    "background": {
        "color": "#FFFFFFFF"
    },
    "styles": [
        {
            "type": "Paragraph",
            "name": "Normal",
            "next": "Normal",
            "characterFormat": {
                "fontColor": "empty"
            }
        },
        {
            "type": "Paragraph",
            "name": "Heading 1",
            "basedOn": "Normal",
            "next": "Normal",
            "link": "Heading 1 Char",
            "characterFormat": {
                "bold": true,
                "fontSize": 9.0,
                "fontFamily": "Tahoma",
                "fontColor": "empty",
                "boldBidi": true,
                "fontSizeBidi": 9.0
            },
            "paragraphFormat": {
                "outlineLevel": "Level1"
            }
        },
        {
            "type": "Paragraph",
            "name": "Heading 2",
            "basedOn": "Normal",
            "next": "Normal",
            "characterFormat": {
                "bold": true,
                "fontSize": 9.0,
                "fontFamily": "Tahoma",
                "fontColor": "empty",
                "boldBidi": true,
                "fontSizeBidi": 9.0
            },
            "paragraphFormat": {
                "outlineLevel": "Level2",
                "textAlignment": "Center"
            }
        },
        {
            "type": "Paragraph",
            "name": "Heading 3",
            "basedOn": "Normal",
            "next": "Normal",
            "characterFormat": {
                "bold": true,
                "fontSize": 9.0,
                "fontFamily": "Tahoma",
                "fontColor": "empty",
                "boldBidi": true,
                "fontSizeBidi": 9.0
            },
            "paragraphFormat": {
                "outlineLevel": "Level3",
                "textAlignment": "Justify"
            }
        },
        {
            "type": "Paragraph",
            "name": "Heading 4",
            "basedOn": "Normal",
            "next": "Normal",
            "characterFormat": {
                "italic": true,
                "fontSize": 9.0,
                "fontColor": "empty"
            },
            "paragraphFormat": {
                "leftIndent": 18.0,
                "rightIndent": -4.0,
                "firstLineIndent": -18.0,
                "outlineLevel": "Level4",
                "textAlignment": "Justify"
            }
        },
        {
            "type": "Paragraph",
            "name": "Heading 5",
            "basedOn": "Normal",
            "next": "Normal",
            "characterFormat": {
                "italic": true,
                "fontSize": 8.0,
                "fontColor": "empty"
            },
            "paragraphFormat": {
                "rightIndent": -4.0,
                "outlineLevel": "Level5"
            }
        },
        {
            "type": "Paragraph",
            "name": "Heading 6",
            "basedOn": "Normal",
            "next": "Normal",
            "characterFormat": {
                "bold": true,
                "fontSize": 9.0,
                "fontColor": "empty",
                "boldBidi": true
            },
            "paragraphFormat": {
                "outlineLevel": "Level6",
                "textAlignment": "Right"
            }
        },
        {
            "type": "Paragraph",
            "name": "Heading 7",
            "basedOn": "Normal",
            "next": "Normal",
            "characterFormat": {
                "bold": true,
                "fontColor": "empty",
                "boldBidi": true
            },
            "paragraphFormat": {
                "outlineLevel": "Level7",
                "textAlignment": "Justify"
            }
        },
        {
            "type": "Paragraph",
            "name": "Heading 8",
            "basedOn": "Normal",
            "next": "Normal",
            "characterFormat": {
                "bold": true,
                "fontSize": 9.0,
                "fontColor": "empty",
                "boldBidi": true
            },
            "paragraphFormat": {
                "leftIndent": -9.3999996185302734,
                "firstLineIndent": 9.3999996185302734,
                "outlineLevel": "Level8"
            }
        },
        {
            "type": "Paragraph",
            "name": "Heading 9",
            "basedOn": "Normal",
            "next": "Normal",
            "characterFormat": {
                "underline": "Single",
                "fontColor": "empty"
            },
            "paragraphFormat": {
                "outlineLevel": "Level9"
            }
        },
        {
            "type": "Character",
            "name": "Default Paragraph Font",
            "characterFormat": {
                "fontColor": "empty"
            }
        },
        {
            "type": "Paragraph",
            "name": "Title",
            "basedOn": "Normal",
            "next": "Title",
            "characterFormat": {
                "bold": true,
                "fontSize": 12.0,
                "fontColor": "empty",
                "boldBidi": true,
                "fontSizeBidi": 12.0
            },
            "paragraphFormat": {
                "textAlignment": "Center"
            }
        },
        {
            "type": "Paragraph",
            "name": "Body Text",
            "basedOn": "Normal",
            "next": "Body Text",
            "link": "Body Text Char",
            "characterFormat": {
                "fontSize": 12.0,
                "fontColor": "empty",
                "fontSizeBidi": 12.0
            },
            "paragraphFormat": {
                "textAlignment": "Justify"
            }
        },
        {
            "type": "Paragraph",
            "name": "Subtitle",
            "basedOn": "Normal",
            "next": "Subtitle",
            "characterFormat": {
                "bold": true,
                "fontSize": 12.0,
                "fontColor": "empty",
                "boldBidi": true,
                "fontSizeBidi": 12.0
            },
            "paragraphFormat": {
                "textAlignment": "Center"
            }
        },
        {
            "type": "Paragraph",
            "name": "Body Text Indent",
            "basedOn": "Normal",
            "next": "Body Text Indent",
            "characterFormat": {
                "fontSize": 11.0,
                "fontColor": "empty",
                "fontSizeBidi": 11.0
            },
            "paragraphFormat": {
                "textAlignment": "Justify"
            }
        },
        {
            "type": "Paragraph",
            "name": "Header",
            "basedOn": "Normal",
            "next": "Header",
            "link": "Header Char",
            "characterFormat": {
                "fontColor": "empty"
            },
            "paragraphFormat": {
                "tabs": [
                    {
                        "tabJustification": "Center",
                        "position": 216.0,
                        "tabLeader": "None",
                        "deletePosition": 0.0
                    },
                    {
                        "tabJustification": "Right",
                        "position": 432.0,
                        "tabLeader": "None",
                        "deletePosition": 0.0
                    }
                ]
            }
        },
        {
            "type": "Paragraph",
            "name": "Footer",
            "basedOn": "Normal",
            "next": "Footer",
            "link": "Footer Char",
            "characterFormat": {
                "fontColor": "empty"
            },
            "paragraphFormat": {
                "tabs": [
                    {
                        "tabJustification": "Center",
                        "position": 216.0,
                        "tabLeader": "None",
                        "deletePosition": 0.0
                    },
                    {
                        "tabJustification": "Right",
                        "position": 432.0,
                        "tabLeader": "None",
                        "deletePosition": 0.0
                    }
                ]
            }
        },
        {
            "type": "Paragraph",
            "name": "Document Map",
            "basedOn": "Normal",
            "next": "Document Map",
            "characterFormat": {
                "fontFamily": "Tahoma",
                "fontColor": "empty",
                "fontFamilyBidi": "Tahoma"
            }
        },
        {
            "type": "Paragraph",
            "name": "Block Text",
            "basedOn": "Normal",
            "next": "Block Text",
            "characterFormat": {
                "fontSize": 11.0,
                "fontColor": "empty",
                "fontSizeBidi": 11.0
            },
            "paragraphFormat": {
                "leftIndent": 18.0,
                "rightIndent": 0.10000000149011612,
                "firstLineIndent": -18.0,
                "textAlignment": "Justify"
            }
        },
        {
            "type": "Paragraph",
            "name": "Body Text Indent 2",
            "basedOn": "Normal",
            "next": "Body Text Indent 2",
            "characterFormat": {
                "fontSize": 9.0,
                "fontFamily": "Tahoma",
                "fontColor": "empty",
                "fontSizeBidi": 9.0
            },
            "paragraphFormat": {
                "leftIndent": 18.0,
                "textAlignment": "Justify"
            }
        },
        {
            "type": "Paragraph",
            "name": "Body Text Indent 3",
            "basedOn": "Normal",
            "next": "Body Text Indent 3",
            "characterFormat": {
                "fontFamily": "Times",
                "fontColor": "empty"
            },
            "paragraphFormat": {
                "leftIndent": 36.0,
                "firstLineIndent": -36.0,
                "textAlignment": "Justify"
            }
        },
        {
            "type": "Character",
            "name": "Hyperlink",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "underline": "Single",
                "fontColor": "#0000FFFF"
            }
        },
        {
            "type": "Paragraph",
            "name": "Body Text 2",
            "basedOn": "Normal",
            "next": "Body Text 2",
            "characterFormat": {
                "fontColor": "empty"
            },
            "paragraphFormat": {
                "rightIndent": -6.9000000953674316
            }
        },
        {
            "type": "Character",
            "name": "FollowedHyperlink",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "underline": "Single",
                "fontColor": "#800080FF"
            }
        },
        {
            "type": "Paragraph",
            "name": "HTML Top of Form",
            "basedOn": "Normal",
            "next": "Normal",
            "characterFormat": {
                "fontSize": 8.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 8.0,
                "fontFamilyBidi": "Arial"
            },
            "paragraphFormat": {
                "textAlignment": "Center"
            }
        },
        {
            "type": "Paragraph",
            "name": "HTML Bottom of Form",
            "basedOn": "Normal",
            "next": "Normal",
            "characterFormat": {
                "fontSize": 8.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 8.0,
                "fontFamilyBidi": "Arial"
            },
            "paragraphFormat": {
                "textAlignment": "Center"
            }
        },
        {
            "type": "Character",
            "name": "Page Number",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontColor": "empty"
            }
        },
        {
            "type": "Paragraph",
            "name": "Body Text 3",
            "basedOn": "Normal",
            "next": "Body Text 3",
            "characterFormat": {
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 16.0,
                "fontFamilyBidi": "Arial"
            }
        },
        {
            "type": "Paragraph",
            "name": "Balloon Text",
            "basedOn": "Normal",
            "next": "Balloon Text",
            "characterFormat": {
                "fontSize": 8.0,
                "fontFamily": "Tahoma",
                "fontColor": "empty",
                "fontSizeBidi": 8.0,
                "fontFamilyBidi": "Tahoma"
            }
        },
        {
            "type": "Paragraph",
            "name": "Style1",
            "basedOn": "Heading 1",
            "next": "Style1",
            "link": "Style1 Char",
            "characterFormat": {
                "fontFamily": "Arial",
                "fontColor": "empty"
            }
        },
        {
            "type": "Paragraph",
            "name": "Style2",
            "basedOn": "Normal",
            "next": "Normal",
            "link": "Style2 Char",
            "characterFormat": {
                "bold": true,
                "fontSize": 9.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "allCaps": true
            },
            "paragraphFormat": {
                "textAlignment": "Center",
                "listFormat": {
                    "listId": 15
                }
            }
        },
        {
            "type": "Character",
            "name": "Heading 1 Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "bold": true,
                "fontSize": 9.0,
                "fontFamily": "Tahoma",
                "fontColor": "empty",
                "boldBidi": true,
                "fontSizeBidi": 9.0
            }
        },
        {
            "type": "Character",
            "name": "Style1 Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "bold": true,
                "fontSize": 9.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "boldBidi": true,
                "fontSizeBidi": 9.0,
                "fontFamilyBidi": "Arial"
            }
        },
        {
            "type": "Paragraph",
            "name": "MTIndent2",
            "basedOn": "Normal",
            "next": "MTIndent2",
            "characterFormat": {
                "fontSize": 11.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontFamilyBidi": "Arial"
            },
            "paragraphFormat": {
                "leftIndent": 72.0,
                "afterSpacing": 11.0,
                "textAlignment": "Justify"
            }
        },
        {
            "type": "Character",
            "name": "Style2 Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "bold": true,
                "fontSize": 9.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "allCaps": true
            }
        },
        {
            "type": "Character",
            "name": "chrbold",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "bold": true,
                "fontColor": "empty"
            }
        },
        {
            "type": "Character",
            "name": "chritalics",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "italic": true,
                "fontColor": "empty"
            }
        },
        {
            "type": "Paragraph",
            "name": "MTArt2 L1",
            "basedOn": "Normal",
            "next": "MTArt2 L2",
            "link": "MTArt2 L1 Char",
            "characterFormat": {
                "bold": true,
                "fontSize": 11.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 12.0,
                "allCaps": true
            },
            "paragraphFormat": {
                "beforeSpacing": 6.0,
                "afterSpacing": 11.0,
                "outlineLevel": "Level1",
                "textAlignment": "Center",
                "listFormat": {
                    "listId": 21
                }
            }
        },
        {
            "type": "Paragraph",
            "name": "MTArt2 L2",
            "basedOn": "Normal",
            "next": "Normal",
            "link": "MTArt2 L2 Char",
            "characterFormat": {
                "bold": true,
                "fontSize": 11.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 12.0
            },
            "paragraphFormat": {
                "afterSpacing": 11.0,
                "outlineLevel": "Level2",
                "textAlignment": "Justify",
                "listFormat": {
                    "listLevelNumber": 1,
                    "listId": 21
                }
            }
        },
        {
            "type": "Paragraph",
            "name": "MTArt2 L3",
            "basedOn": "Normal",
            "next": "MTArt2 L3",
            "link": "MTArt2 L3 Char",
            "characterFormat": {
                "fontSize": 11.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 12.0
            },
            "paragraphFormat": {
                "afterSpacing": 11.0,
                "outlineLevel": "Level3",
                "textAlignment": "Justify",
                "listFormat": {
                    "listLevelNumber": 2,
                    "listId": 21
                }
            }
        },
        {
            "type": "Paragraph",
            "name": "MTArt2 L4",
            "basedOn": "Normal",
            "next": "MTArt2 L4",
            "link": "MTArt2 L4 Char",
            "characterFormat": {
                "fontSize": 11.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 12.0
            },
            "paragraphFormat": {
                "afterSpacing": 11.0,
                "outlineLevel": "Level4",
                "textAlignment": "Justify",
                "listFormat": {
                    "listLevelNumber": 3,
                    "listId": 21
                }
            }
        },
        {
            "type": "Paragraph",
            "name": "MTArt2 L5",
            "basedOn": "Normal",
            "next": "MTArt2 L5",
            "characterFormat": {
                "fontSize": 11.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 12.0,
                "fontFamilyBidi": "Arial"
            },
            "paragraphFormat": {
                "afterSpacing": 11.0,
                "textAlignment": "Justify",
                "listFormat": {
                    "listLevelNumber": 4,
                    "listId": 21
                }
            }
        },
        {
            "type": "Paragraph",
            "name": "MTArt2 L6",
            "basedOn": "Normal",
            "next": "MTArt2 L6",
            "characterFormat": {
                "fontSize": 11.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 12.0,
                "fontFamilyBidi": "Arial"
            },
            "paragraphFormat": {
                "afterSpacing": 11.0,
                "textAlignment": "Justify",
                "listFormat": {
                    "listLevelNumber": 5,
                    "listId": 21
                }
            }
        },
        {
            "type": "Paragraph",
            "name": "MTArt2 L7",
            "basedOn": "Normal",
            "next": "MTArt2 L7",
            "characterFormat": {
                "fontSize": 11.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 12.0,
                "fontFamilyBidi": "Arial"
            },
            "paragraphFormat": {
                "afterSpacing": 11.0,
                "textAlignment": "Justify",
                "listFormat": {
                    "listLevelNumber": 6,
                    "listId": 21
                }
            }
        },
        {
            "type": "Paragraph",
            "name": "MTArt2 L8",
            "basedOn": "Normal",
            "next": "MTArt2 L8",
            "characterFormat": {
                "fontSize": 11.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 12.0,
                "fontFamilyBidi": "Arial"
            },
            "paragraphFormat": {
                "afterSpacing": 11.0,
                "textAlignment": "Justify",
                "listFormat": {
                    "listLevelNumber": 7,
                    "listId": 21
                }
            }
        },
        {
            "type": "Paragraph",
            "name": "MTArt2 L9",
            "basedOn": "Normal",
            "next": "MTArt2 L9",
            "characterFormat": {
                "fontSize": 11.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 12.0,
                "fontFamilyBidi": "Arial"
            },
            "paragraphFormat": {
                "afterSpacing": 11.0,
                "textAlignment": "Justify",
                "listFormat": {
                    "listLevelNumber": 8,
                    "listId": 21
                }
            }
        },
        {
            "type": "Character",
            "name": "MTArt2 L3 Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontSize": 11.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 12.0
            }
        },
        {
            "type": "Paragraph",
            "name": "Style3",
            "basedOn": "MTArt2 L1",
            "next": "Style3",
            "link": "Style3 Char",
            "characterFormat": {
                "fontSize": 9.0,
                "fontColor": "empty",
                "fontSizeBidi": 9.0
            },
            "paragraphFormat": {
                "outlineLevel": "BodyText"
            }
        },
        {
            "type": "Paragraph",
            "name": "Style4",
            "basedOn": "MTArt2 L2",
            "next": "Style4",
            "link": "Style4 Char",
            "characterFormat": {
                "fontSize": 9.0,
                "fontColor": "empty",
                "fontSizeBidi": 11.0
            },
            "paragraphFormat": {
                "outlineLevel": "BodyText"
            }
        },
        {
            "type": "Character",
            "name": "MTArt2 L1 Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "bold": true,
                "fontSize": 11.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 12.0,
                "allCaps": true
            }
        },
        {
            "type": "Character",
            "name": "Style3 Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "bold": true,
                "fontSize": 9.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 9.0,
                "allCaps": true
            }
        },
        {
            "type": "Paragraph",
            "name": "Style5",
            "basedOn": "MTArt2 L3",
            "next": "Style5",
            "link": "Style5 Char",
            "characterFormat": {
                "fontSize": 9.0,
                "fontColor": "empty",
                "fontSizeBidi": 11.0
            },
            "paragraphFormat": {
                "outlineLevel": "BodyText"
            }
        },
        {
            "type": "Character",
            "name": "MTArt2 L2 Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "bold": true,
                "fontSize": 11.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 12.0
            }
        },
        {
            "type": "Character",
            "name": "Style4 Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "bold": true,
                "fontSize": 9.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 11.0
            }
        },
        {
            "type": "Character",
            "name": "Header Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontColor": "empty"
            }
        },
        {
            "type": "Character",
            "name": "Style5 Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontSize": 9.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 11.0
            }
        },
        {
            "type": "Paragraph",
            "name": "List Paragraph",
            "basedOn": "Normal",
            "next": "List Paragraph",
            "characterFormat": {
                "fontColor": "empty"
            },
            "paragraphFormat": {
                "leftIndent": 36.0
            }
        },
        {
            "type": "Paragraph",
            "name": "Style6",
            "basedOn": "MTArt2 L4",
            "next": "Style6",
            "link": "Style6 Char",
            "characterFormat": {
                "fontSize": 9.0,
                "fontColor": "empty",
                "fontSizeBidi": 9.0
            },
            "paragraphFormat": {
                "leftIndent": 90.0,
                "firstLineIndent": -18.0,
                "listFormat": {
                    "listId": 26
                },
                "tabs": [
                    {
                        "tabJustification": "Left",
                        "position": 0.0,
                        "tabLeader": "None",
                        "deletePosition": 108.0
                    }
                ]
            }
        },
        {
            "type": "Paragraph",
            "name": "TOC Heading",
            "basedOn": "Heading 1",
            "next": "Normal",
            "characterFormat": {
                "fontSize": 14.0,
                "fontFamily": "Cambria",
                "fontColor": "#365F91FF",
                "fontSizeBidi": 14.0
            },
            "paragraphFormat": {
                "beforeSpacing": 24.0,
                "lineSpacing": 1.1499999761581421,
                "lineSpacingType": "Multiple",
                "outlineLevel": "BodyText"
            }
        },
        {
            "type": "Character",
            "name": "MTArt2 L4 Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontSize": 11.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 12.0
            }
        },
        {
            "type": "Character",
            "name": "Style6 Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontSize": 9.0,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 9.0
            }
        },
        {
            "type": "Paragraph",
            "name": "TOC 1",
            "basedOn": "Normal",
            "next": "Normal",
            "characterFormat": {
                "fontSize": 9.0,
                "fontFamily": "Arial",
                "fontColor": "empty"
            }
        },
        {
            "type": "Paragraph",
            "name": "TOC 2",
            "basedOn": "Normal",
            "next": "Normal",
            "characterFormat": {
                "fontColor": "empty"
            },
            "paragraphFormat": {
                "leftIndent": 10.0
            }
        },
        {
            "type": "Paragraph",
            "name": "TOC 3",
            "basedOn": "Normal",
            "next": "Normal",
            "characterFormat": {
                "fontColor": "empty"
            },
            "paragraphFormat": {
                "leftIndent": 20.0
            }
        },
        {
            "type": "Character",
            "name": "annotation reference",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontSize": 8.0,
                "fontColor": "empty",
                "fontSizeBidi": 8.0
            }
        },
        {
            "type": "Paragraph",
            "name": "annotation text",
            "basedOn": "Normal",
            "next": "annotation text",
            "link": "Comment Text Char",
            "characterFormat": {
                "fontColor": "empty"
            }
        },
        {
            "type": "Character",
            "name": "Comment Text Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontColor": "empty"
            }
        },
        {
            "type": "Paragraph",
            "name": "annotation subject",
            "basedOn": "annotation text",
            "next": "annotation text",
            "link": "Comment Subject Char",
            "characterFormat": {
                "bold": true,
                "fontColor": "empty",
                "boldBidi": true
            }
        },
        {
            "type": "Character",
            "name": "Comment Subject Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "bold": true,
                "fontColor": "empty",
                "boldBidi": true
            }
        },
        {
            "type": "Character",
            "name": "Body Text Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontSize": 12.0,
                "fontColor": "empty",
                "fontSizeBidi": 12.0
            }
        },
        {
            "type": "Character",
            "name": "Prompt",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontColor": "#0000FFFF"
            }
        },
        {
            "type": "Paragraph",
            "name": "SigningLine",
            "basedOn": "Normal",
            "next": "SigningLine",
            "characterFormat": {
                "fontSize": 12.0,
                "fontColor": "empty",
                "fontSizeBidi": 12.0
            },
            "paragraphFormat": {
                "beforeSpacing": 2.0,
                "afterSpacing": 2.0
            }
        },
        {
            "type": "Character",
            "name": "Footer Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontColor": "empty"
            }
        },
        {
            "type": "Paragraph",
            "name": "No Spacing",
            "next": "No Spacing",
            "link": "No Spacing Char",
            "characterFormat": {
                "fontSize": 11.0,
                "fontFamily": "Calibri",
                "fontColor": "empty",
                "fontSizeBidi": 11.0
            }
        },
        {
            "type": "Character",
            "name": "No Spacing Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontSize": 11.0,
                "fontFamily": "Calibri",
                "fontColor": "empty",
                "fontSizeBidi": 11.0
            }
        },
        {
            "type": "Paragraph",
            "name": "Default",
            "next": "Default",
            "characterFormat": {
                "fontSize": 12.0,
                "fontFamily": "Calibri",
                "fontColor": "#000000FF",
                "fontSizeBidi": 12.0,
                "fontFamilyBidi": "Calibri"
            }
        },
        {
            "type": "Paragraph",
            "name": "CM2",
            "basedOn": "Default",
            "next": "Default",
            "characterFormat": {
                "fontColor": "#00000000",
                "fontFamilyBidi": "Times New Roman"
            },
            "paragraphFormat": {
                "lineSpacing": 13.550000190734863,
                "lineSpacingType": "AtLeast"
            }
        },
        {
            "type": "Paragraph",
            "name": "CM7",
            "basedOn": "Default",
            "next": "Default",
            "characterFormat": {
                "fontColor": "#00000000",
                "fontFamilyBidi": "Times New Roman"
            }
        },
        {
            "type": "Paragraph",
            "name": "CM4",
            "basedOn": "Default",
            "next": "Default",
            "characterFormat": {
                "fontColor": "#00000000",
                "fontFamilyBidi": "Times New Roman"
            }
        },
        {
            "type": "Paragraph",
            "name": "Footnote Text",
            "basedOn": "Normal",
            "next": "Footnote Text",
            "link": "Footnote Text Char",
            "characterFormat": {
                "fontColor": "empty"
            }
        },
        {
            "type": "Character",
            "name": "Footnote Text Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontColor": "empty"
            }
        },
        {
            "type": "Character",
            "name": "Footnote Reference",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "baselineAlignment": "Superscript",
                "fontColor": "empty"
            }
        },
        {
            "type": "Character",
            "name": "Unresolved Mention",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontColor": "#605E5CFF"
            }
        }
    ],
    "defaultTabWidth": 36.0,
    "formatting": false,
    "trackChanges": false,
    "protectionType": "NoProtection",
    "enforcement": false,
    "dontUseHTMLParagraphAutoSpacing": true,
    "alignTablesRowByRow": false,
    "formFieldShading": true,
    "footnotes": {
        "separator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0003",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0004",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "inlines": []
            }
        ]
    },
    "endnotes": {
        "separator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0003",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0004",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "inlines": []
            }
        ]
    }
};

describe('Tab Width validation', () => {
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
    it('Tab Width', () => {
        editor.open(JSON.stringify(tabJson));
        let bodyWidget = editor.documentHelper.pages[0].bodyWidgets[0];
        expect(Math.round(((bodyWidget.childWidgets[1] as ParagraphWidget).childWidgets[0] as LineWidget).children[4].width)).toBe(48);
    });
});

let refFieldJson: any = {
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
                        "styleName": "Normal",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "inlines": [
                        {
                            "characterFormat": {},
                            "bookmarkType": 0,
                            "name": "Text1"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "fieldType": 0,
                            "hasFieldEnd": true,
                            "formFieldData": {
                                "name": "Text1",
                                "enabled": true,
                                "helpText": "",
                                "statusText": "",
                                "textInput": {
                                    "type": "Text",
                                    "maxLength": 0,
                                    "defaultValue": "Form field 2",
                                    "format": ""
                                }
                            }
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "text": " FORMTEXT "
                        },
                        {
                            "characterFormat": {},
                            "fieldType": 2
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "text": "Form field 2"
                        },
                        {
                            "characterFormat": {},
                            "fieldType": 1
                        },
                        {
                            "characterFormat": {},
                            "bookmarkType": 1,
                            "name": "Text1"
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
                    "inlines": []
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
                            "fieldType": 0,
                            "hasFieldEnd": true
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "text": " REF Text1 \\h "
                        },
                        {
                            "characterFormat": {},
                            "fieldType": 2
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "text": "Form field"
                        },
                        {
                            "characterFormat": {},
                            "fieldType": 1
                        }
                    ]
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
                "evenHeader": {
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
                "evenFooter": {
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
                "firstPageHeader": {
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
                "firstPageFooter": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "characterFormat": {},
                            "inlines": []
                        }
                    ]
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
        "afterSpacing": 8,
        "lineSpacing": 1.0791666507720947,
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
            "characterFormat": {
                "fontColor": "empty"
            },
            "next": "Normal"
        },
        {
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {
                "fontColor": "empty"
            }
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
                        "text": "\u0003"
                    }
                ]
            }
        ],
        "continuationSeparator": [
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
                        "text": "\u0004"
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "paragraphFormat": {
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
                        "text": "\u0003"
                    }
                ]
            }
        ],
        "continuationSeparator": [
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
                        "text": "\u0004"
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "paragraphFormat": {
                    "listFormat": {}
                },
                "characterFormat": {},
                "inlines": []
            }
        ]
    }
};
describe('Update ref field Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, SfdtExport, WordExport);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableWordExport: true, enableSfdtExport: true });
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
    it('ref field', () => {
        editor.open(JSON.stringify(refFieldJson));
        editor.updateFields();
        let bodyWidget = editor.documentHelper.pages[0].bodyWidgets[0];
        let element: TextElementBox = ((bodyWidget.childWidgets[2] as ParagraphWidget).childWidgets[0] as LineWidget).children[3] as TextElementBox;
        expect(element.text).toBe('Form field 2');
    });
});
let data: any = {
	"sections": [
		{
			"sectionFormat": {
				"pageWidth": 612,
				"pageHeight": 792,
				"leftMargin": 72,
				"rightMargin": 72,
				"topMargin": 72,
				"bottomMargin": 72,
				"differentFirstPage": true,
				"differentOddAndEvenPages": false,
				"headerDistance": 36,
				"footerDistance": 36,
				"bidi": false,
				"endnoteNumberFormat": "LowerCaseRoman",
				"footNoteNumberFormat": "Arabic",
				"restartIndexForFootnotes": "DoNotRestart",
				"restartIndexForEndnotes": "DoNotRestart",
				"initialFootNoteNumber": 1,
				"initialEndNoteNumber": 1
			},
			"blocks": [
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "[In engagements relating to financial statement elements, "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "accounts"
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": " or items, add: "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "an audit "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "or"
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "]"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": ", examination or review, the objective of which would be the expression of an opinion "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "or conclusion on "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "the "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "[identify subject matter, e.g., [the accuracy of certain attributes of the collateral assets "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "included in the securitization]]"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": ".  Accordingly, we will not express such an opinion or conclusion.  "
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "The procedures set forth in the Attachment to this letter hav"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "e been agreed upon by the Company and you "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "(collectively “the Specified Parties”) and"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": " the sufficiency (i.e., nature, timing, and extent) of these "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "procedures for your purposes is solely the responsibility of the Specified Parties "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "[add the following "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "phrase wh"
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "ere deemed appropriate, especially if the financial information is directly "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "related to a purchase price adjustment: and we have no responsibility for verification of "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "any underlying data]"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": ". "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "[Include the following sentence if applicable. "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "Materiality for purpo"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "ses of "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "these agreed-upon procedures is as described within the procedures included within our AUP Report."
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "]"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "[Include the following if we will engage an external expert to be involved in the "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "agreed-upon procedures engagement. "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "We will involve an external expe"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "rt to "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "[identify the "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "involvement of our external expert]]"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "."
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "Consequently, we make no representation regarding the sufficiency of the procedures either for the "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "purpose of this engagement or for any other purpose.  If we were to perform additional procedures,"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": " other "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "matters might come to our attention that would be reported to you. These procedures should not be taken "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "to supplant any additional inquiries or procedures that you would undertake in consideration of the "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "Transaction.  "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "Our engagement cannot ensure th"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "at errors, "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "fraud"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": " or other illegal acts, if present, will be "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "detected."
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "Our independent accountants’ report (the “AUP "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "Report”)"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": " is intended solely for the information and use of "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "the Specified Parties "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "(including for purposes of substantiating the Specified Pa"
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "rties’ \"due "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "diligence defense\" under the Securities Act of 1933 or similar defenses to alleged securities "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "law violations under the Securities Exchange Act of 1934)"
						},
						{
							"footnoteType": "Footnote",
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"styleName": "Footnote Reference",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"blocks": [
								{
									"paragraphFormat": {
										"styleName": "Normal",
										"listFormat": {}
									},
									"characterFormat": {
										"fontSize": 8,
										"fontFamily": "Georgia",
										"fontColor": "#FF0000FF",
										"fontSizeBidi": 8,
										"fontFamilyBidi": "Georgia"
									},
									"inlines": [
										{
											"characterFormat": {
												"fontSize": 8,
												"fontFamily": "Georgia",
												"fontColor": "#FF0000FF",
												"styleName": "Footnote Reference",
												"fontSizeBidi": 8,
												"fontFamilyBidi": "Georgia"
											},
											"text": "1"
										},
										{
											"characterFormat": {
												"fontSize": 8,
												"fontFamily": "Georgia",
												"fontColor": "#FF0000FF",
												"fontSizeBidi": 8,
												"fontFamilyBidi": "Georgia"
											},
											"text": " This is an acceptable addition where requested, where the work in being performed in connection with"
										},
										{
											"characterFormat": {
												"fontSize": 8,
												"fontFamily": "Georgia",
												"fontColor": "#FF0000FF",
												"fontSizeBidi": 8,
												"fontFamilyBidi": "Georgia"
											},
											"text": " a registered offering, and "
										},
										{
											"characterFormat": {
												"fontSize": 8,
												"fontFamily": "Georgia",
												"fontColor": "#FF0000FF",
												"fontSizeBidi": 8,
												"fontFamilyBidi": "Georgia"
											},
											"text": "the issuer or the underwriters are specified parties."
										}
									]
								},
								{
									"paragraphFormat": {
										"styleName": "Normal",
										"listFormat": {}
									},
									"characterFormat": {
										"fontSize": 8,
										"fontFamily": "Georgia",
										"fontColor": "#FF0000FF",
										"fontSizeBidi": 8,
										"fontFamilyBidi": "Georgia"
									},
									"inlines": []
								},
								{
									"paragraphFormat": {
										"styleName": "Normal",
										"listFormat": {}
									},
									"characterFormat": {
										"fontSize": 8,
										"fontFamily": "Georgia",
										"fontColor": "#FF0000FF",
										"fontSizeBidi": 8,
										"fontFamilyBidi": "Georgia"
									},
									"inlines": [
										{
											"characterFormat": {
												"fontSize": 8,
												"fontFamily": "Georgia",
												"baselineAlignment": "Superscript",
												"fontColor": "#FF0000FF",
												"fontSizeBidi": 8,
												"fontFamilyBidi": "Georgia"
											},
											"text": "3"
										},
										{
											"characterFormat": {
												"fontSize": 8,
												"fontFamily": "Georgia",
												"fontColor": "#FF0000FF",
												"fontSizeBidi": 8,
												"fontFamilyBidi": "Georgia"
											},
											"text": "This language is intended for an engagement where the entity signing this acknowledgement letter is not working on behalf of the "
										},
										{
											"characterFormat": {
												"fontSize": 8,
												"fontFamily": "Georgia",
												"fontColor": "#FF0000FF",
												"fontSizeBidi": 8,
												"fontFamilyBidi": "Georgia"
											},
											"text": "Issuer and is not disclosing our Form 15E o"
										},
										{
											"characterFormat": {
												"fontSize": 8,
												"fontFamily": "Georgia",
												"fontColor": "#FF0000FF",
												"fontSizeBidi": 8,
												"fontFamilyBidi": "Georgia"
											},
											"text": "r furnishing Form 15G"
										}
									]
								},
								{
									"paragraphFormat": {
										"styleName": "Footnote Text",
										"listFormat": {}
									},
									"characterFormat": {
										"fontColor": "empty"
									},
									"inlines": []
								}
							],
							"symbolCode": 0
						},
						{
							"footnoteType": "Footnote",
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"styleName": "Footnote Reference",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"blocks": [
								{
									"paragraphFormat": {
										"leftIndent": 18,
										"firstLineIndent": -18,
										"styleName": "Footnote Text",
										"listFormat": {}
									},
									"characterFormat": {
										"fontColor": "empty"
									},
									"inlines": []
								}
							],
							"symbolCode": 0
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": " and is not intended to be and should "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "not be used by anyone other than the Specified Part"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "ies.  If a third party obtains our AUP Report, in any "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "form, or has access to it or its contents without executing an acknowledgement letter (materially "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "consistent in form with this acknowledgement letter) (each, a \"Non-Specified Party\"), that Non-Specified"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "Party cannot rely upon the AUP Report or its contents and any such unauthorized use of the AUP Report "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "or its contents by such Non-Specified Party is their responsibility and at their sole and exclusive risk."
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "A Non-Specified Party "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "does not acquire any rights or claims against "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "XxX"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": " or any other party "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "as a result of"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "its access to the AUP Report or part thereof and "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "XxX"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": " has no duty or obligation to the Non-Specified Party "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "arising from this engagement for any reason or circumstance whatso"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "ever."
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"lineSpacing": 12,
						"lineSpacingType": "AtLeast",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "In consideration of our "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "allowing"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": " you access to the AUP Report or its contents, you agree that you do not "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "acquire any rights as a result of such access which you would not otherwise have had and acknowledge "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "that we do not assume any duties or obligat"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "ions to you in connection with such access."
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "XxX"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": " and you acknowledge and agree that the Procedures are considered third-party due diligence services "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "as defined by U.S. Securities and Exchange Commission (“SEC”) Rule 15Ga-2(d) and SEC Rule "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "17g-10(d)(1) unde"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "r the Securities Exchange Act of 1934 (the “Exchange Act”).  "
						}
					]
				},
				{
					"paragraphFormat": {
						"lineSpacing": 12,
						"lineSpacingType": "AtLeast",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "You agree that you will not"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"styleName": "Footnote Reference",
								"fontFamilyBidi": "Georgia"
							},
							"text": "3"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": ":"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"leftIndent": 54,
						"styleName": "List Paragraph",
						"listFormat": {
							"listId": 3,
							"listLevelNumber": 0
						}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "disclose or distribute the AUP Report or information received orally or in writing about its "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "contents to any Non-Specified Party"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": " (including but not limited to electronic distribution "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "and/or posting to a website pursuant to Rule 17g-5 of Securities Exchange Act of 1934); or"
						}
					]
				},
				{
					"paragraphFormat": {
						"leftIndent": 36,
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "List Paragraph",
						"listFormat": {
							"listId": 2,
							"listLevelNumber": 0
						}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "quote or otherwise refer to our AUP Report or its contents, in whole or in part, to any other "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "party (includin"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "g in any publicly filed document), "
						}
					]
				},
				{
					"paragraphFormat": {
						"leftIndent": 18,
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "without our prior written consent, except for distribution to your parent company or other affiliates and "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "subsidiaries (provided that such affiliates and subsidiaries are included in the consolidated financial "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "statement"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "s of the parent company), and your legal counsel (solely in its capacity as legal advisors in "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "connection with "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "or arising from the Transaction); provided, however, that reference to our AUP Report "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "may be made without reference to "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "XxX"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": " to any Specified Party "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "involved in the transaction, in any note "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "purchase agreement, underwriting agreement or similar agreement, or in any closing list or index relating "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "to the Transaction"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": ".  "
						}
					]
				},
				{
					"paragraphFormat": {
						"lineSpacing": 12,
						"lineSpacingType": "AtLeast",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"highlightColor": "Yellow",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"lineSpacing": 12,
						"lineSpacingType": "AtLeast",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "Notwithstanding the foregoing, you may disclose the AUP Report:"
						}
					]
				},
				{
					"paragraphFormat": {
						"lineSpacing": 12,
						"lineSpacingType": "AtLeast",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"firstLineIndent": -31.5,
						"styleName": "List Paragraph",
						"listFormat": {
							"listId": 1,
							"listLevelNumber": 0
						}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "In connection with le"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "gal or administrative proceedings related to the Transaction or where "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "compelled by subpoena or other similar form of legal process (including litigation discovery "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "demands), provided you promptly inform us, if you are lawfully permitted to do so, so that we"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "may have the opportunity to object and/or seek an appropriate protective order; or"
						}
					]
				},
				{
					"paragraphFormat": {
						"leftIndent": 54,
						"styleName": "List Paragraph",
						"listFormat": {}
					},
					"characterFormat": {
						"fontColor": "empty"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"firstLineIndent": -31.5,
						"styleName": "List Paragraph",
						"listFormat": {
							"listId": 1,
							"listLevelNumber": 0
						}
					},
					"characterFormat": {
						"fontColor": "empty"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "Where requested by a governmental agency or regulatory authority (including a "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "self-regulatory organization) having or claiming to have the authority to compel such "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "disclos"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "ure, upon such agency or authority's request, provided you promptly inform us of any "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "such request to the extent you have knowledge of such request and are permitted to do so by "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Georgia"
							},
							"text": "law."
						}
					]
				},
				{
					"paragraphFormat": {
						"leftIndent": 94.5,
						"firstLineIndent": -22.5,
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"lineSpacing": 12,
						"lineSpacingType": "AtLeast",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "This agreement and all matters arising under or relating hereto (whether "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "in contract, statute, tort, such as "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "negligence, or otherwise) shall be governed by, and construed in accordance with, the laws of the State of "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "New York (without regard to its conflicts of laws principles)."
						}
					]
				},
				{
					"paragraphFormat": {
						"lineSpacing": 12,
						"lineSpacingType": "AtLeast",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"lineSpacing": 12,
						"lineSpacingType": "AtLeast",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "If you agree to the terms and conditions of this "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "letter and accept responsibility for the sufficiency of the "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "procedures enumerated in the Attachment to this letter for your purposes and wish to be named as a "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "designated user of the AUP Report, please sign one copy of this letter in the space provided belo"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "w and "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "return it to us. You may return the signed copy by hand, by mail, by air courier, by facsimile to my "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "attention at"
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": " [insert fax number]"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": ", or attached to an email as a pdf, jpeg or similar file type sent to me at"
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "[insert email address]"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": ".  If you have any "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "questions about this letter, please discuss them with "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "[insert "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontFamily": "Georgia",
								"fontColor": "#FF0000FF",
								"boldBidi": true,
								"fontFamilyBidi": "Georgia"
							},
							"text": "name and phone number]"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "."
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "Very truly yours,"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "PricewaterhouseCoopers LLP"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "Merrill Lynch, Pierce, "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "Fenner"
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": " & Smith Incorporated"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"underline": "Single",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "By:    "
						},
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": " _________________________________"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "           (Name)"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 33.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 55.400001525878909,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 77,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 98.55000305175781,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 120.1500015258789,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 141.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 163.35000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 185,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 206.60000610351563,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 228.14999389648438,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 249.8000030517578,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 271.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 293,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 314.6000061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 336.20001220703127,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 357.75,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 379.3500061035156,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 401,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontFamily": "Georgia",
						"underline": "Single",
						"fontColor": "empty",
						"fontFamilyBidi": "Georgia"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "           _________________________________"
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
								"fontFamily": "Georgia",
								"fontColor": "empty",
								"fontFamilyBidi": "Georgia"
							},
							"text": "           (Date)"
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
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Footnote Text",
						"listFormat": {}
					},
					"characterFormat": {
						"fontColor": "empty"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontColor": "empty"
					},
					"inlines": []
				}
			],
			"headersFooters": {
				"header": {
					"blocks": [
						{
							"paragraphFormat": {
								"styleName": "Header",
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
								"styleName": "Footer",
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
									"fieldType": 0,
									"hasFieldEnd": true
								},
								{
									"characterFormat": {
										"fontColor": "empty"
									},
									"text": " PAGE   \\* MERGEFORMAT "
								},
								{
									"characterFormat": {},
									"fieldType": 2
								},
								{
									"characterFormat": {
										"fontColor": "empty"
									},
									"text": "3"
								},
								{
									"characterFormat": {},
									"fieldType": 1
								}
							]
						}
					]
				},
				"evenHeader": {
					"blocks": [
						{
							"paragraphFormat": {
								"styleName": "Header",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": []
						}
					]
				},
				"evenFooter": {
					"blocks": [
						{
							"paragraphFormat": {
								"styleName": "Footer",
								"listFormat": {}
							},
							"characterFormat": {
								"fontColor": "empty"
							},
							"inlines": []
						}
					]
				},
				"firstPageHeader": {
					"blocks": [
						{
							"paragraphFormat": {
								"styleName": "Header",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": [
								{
									"characterFormat": {},
									"imageString": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3IAAALqCAYAAABwlWZ7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAANxxJREFUeNrs3Xe8JXV9//H33G10kL4LShSliA2lGH9q0ERsoMYUY+81RmM0tkTR2E0zxpjEksSYxBiNxqAoRqxYiBqwoCginaUjy7Jsn98f37m6LLB77rnnnjNz5vl8PO5jEe89zJkz5+68zmdKVdd1AAAA6I5KyAEAAAg5AAAAhBwAAABCDgAAQMgBAAAg5AAAABByAAAAQg4AAAAhBwAAgJADAAAQcgAAAAg5AAAAhBwAAICQAwAAQMgBAAAg5AAAAIQcAAAAQg4AAAAhBwAAIOQAAAAQcgAAAAg5AAAAIQcAAICQAwAAQMgBAAAIOQAAAIQcAAAAQg4AAEDICTkAAAAhBwAAgJADAABAyAEAAAg5AAAAhBwAAABCDgAAQMgBAAAg5AAAABByAAAAQg4AAAAhBwAAgJADAAAQcgAAAAg5AAAAhBwAAICQAwAAQMgBAAAg5AAAAIQcAAAAQg4AAAAhBwAAIOQAAAAQcgAAAAg5AAAAIQcAAICQAwAAQMgBAAAIOQAAAIQcAAAAQg4AAAAhBwAAIOQAAAAQcgAAAAg5AAAAIQcAAICQAwAAQMgBAAAIOQAAAIQcAAAAQg4AAEDIAQAAIOQAAAAQcgAAAEIOAAAAIQcAAICQAwAAEHIAAAAIOQAAAIQcAACAkAMAAEDIAQAAIOQAAACEHAAAAEIOAAAAIQcAACDkAAAAEHIAAAAIOQAAAIQcAACAkAMAAEDIAQAAIOQAAACEHAAAAEIOAAAAIQcAACDkAAAAEHIAAAAIOQAAACEHAACAkAMAAEDIAQAACDkAAACEHAAAAEIOAABAyAEAACDkAAAAEHIAAABCDgAAACEHAACAkAMAABByAAAACDkAAACEHAAAgJADAABAyAEAACDkAAAAEHIAAABCDgAAACEHAACAkAMAABByAAAACDkAAACEHAAAgJADAABAyAEAACDkAAAAhBwAAABCDgAAACEHAAAg5AAAABByAAAACDkAAAAhBwAAgJADAABAyAEAAAg5AAAAhBwAAABCDgAAQMgBAAAg5AAAABByAAAAQg4AAAAhBwAAgJADAAAQckIOAABAyAEAACDkAAAAEHIAAABCDgAAACEHAACAkAMAABByAAAACDkAAACEHAAAgJADAABAyAEAACDkAAAAhBwADOu69x9tJbSfHYOO7MON5FE2b0y1bI8sXvGQZGZRMvb9wpkka5OZj5Q/MzOW/+ouD/qRLYjOW2wVAAD0MdnrpKoys/thycySpN7Um6e++guHCkGEHAAAHYy4bM6ifY7NzG53STav79XTF2IIOQAARFzHmMgh5AAAEHEdI8QQcgAAiLiOMZFDyAEAIOI6Rogh5AAAEHEdYyKHkAMAQMR1jBBDyAEAIOI6xkQOIQcAgIjrGCGGkAMAQMR1jIkcQg4AABHXMUIMIQcAgIjrGBM5hBwAACKuY4QYQg4AgJZE3DEibkAmcgg5AABaEnGHiDghhpADAEDETScTOYQcAAAirmOEGEIOAIAJEHHzYSKHkAOAuaisgtarrYIumK6IWzT2Xw5CDCEHAHOw9sJrrYSW23Sj6U4X7PHwX6oXIOIm8FHLkiRXJFk/1v+8iRxCDgDmEgk3rLMS2m7G2JRxWZrksmTmM0k2pkzmxkOIIeQAQCQAQ0XcymTmlCRrx75LaiKHkAMAgA5FnBBDyAEAQMciLjGRQ8gBAECnIk6IIeQAAGDgiLu8FRGXmMgh5AAAYMCI+1QrIk6IIeQAAKBjEZeYyCHkAACgUxEnxBByAADQsYhLTOQQcgAA0KmIE2IIOQAA6FjEJSZyCDkAAOhUxAkxhBwAAHQs4hITOYQcAAAirlMRJ8QQcgAAiLiORVxiIoeQAwBAxHUq4oQYQg4AABHXsYhLTOQQcgAAiLjOPQMhhpADAEDEdYyJHEIOAAAR1zFCDCEHAICI6xgTOYQcAAAirmOEGEIOAAAR1zEmcgg5AABEXMcIMYQcAAAirmNM5BByAACIuI4RYgg5AABEXMeYyCHkAACYooi7Ipk5ZaojTogh5AAAmCJXNJO4m6Z+F9FEDiEHAHNRVdZB29W1ddBXPYk4IcbU/JVa+4UNwJj89Jm7Wwktt2H1GjsGHbDHMXuM/DF3vveeU7mvKwSZViZyAIzN+lU3Wglt3+udMTVl+gkxhBwAiASgY5wjh5ADAICOEWIIOQAA6BgTOYQcAAB0jBBDyAEAQMeYyCHkAACgY4QYQg4AADrGRA4hBwAAHSPEEHIAANAxJnIIOQAA6BghhpADAICOMZFDyAEAQMcIMYQcAAB0jIkcQg4AADpGiCHkAACgY0zkEHIAANAxQgwhBwAAHWMih5ADAICOEWIIOQAA6BgTOYQcAAB0jBBDyAEAQMeYyCHkAACgY4QYQg4AADrGRA4hBwAAHSPEEHIAMBdVUiWpa6sCmBwTOYQcAMzByvPqHHCXKtks5oDJEWIIOQCYg6suLvUm5oBJMpFDyAHAHCxaLOaAyRNiCDkAEHNAx5jIIeQAQMwBHSPEEHIAIOaAjjGRQ8gBgJgDOkaIIeQAQMwBHWMih5ADADEHdIwQQ8gBgJgDOsZEDiEHAGIO6BghhpADgAWKuSrJCjEHLAATOYQcACxQzF3ZTObEHDBqQgwhBwBiDugYEzmEHACIOaBjhBhCDgDEHNAxJnIIOQAQc0DHCDGEHACMO+aqZMWdxRwwPBM5hBwAjDvmLmomc2IOEGIIOQAQc0A/mMgh5ABAzAEdI8QQcgAg5oCOMZFDyAGAmAM6Rogh5ABAzAEdYyKHkAMAMQd0jBBDyAFAi2MuYm7OrDL6wEQOIQcALYu5qy6qs259suuKpJ6Nucq6GdTGjdZBkuy3l41mmgkxhBwAtMzM4mTV5XU2bqqyy/ItYo6BVPqFHjCRQ8gBQEtj7qar61SpsssKMQcIMYQcAHRCtShZc3U5rlLMAVuaz0SuWrIuO9//AisRIQcAYg4YJxM5hBwAiDmgY4aZyFVL1mXTtSuy5vNPz/7veLaViJADADEHjNN8JnK7Pcr6Q8gBgJgDxm4uE7ktJ3Gb1+yWavH6LH/3k61EhBwAjD3mKrcmgD4bZiJnEoeQA4BJx9xVzWROzEEvDTKR+8Uk7mnZvGb3VIvX//z/M5FDyAGAmAPGbC4TOZM4hBwAiDmgBbY1kdvWJG6WiRxCDgDEHDBmg0zkTOIQcgAg5oAWubWJ3CCTuFkmcgg5ABBzwJhtayJnEoeQAwAxB7TQlhO5asm6bLpuRdactv1J3CwTOYQcAIg5YMxubSK324nWC0IOAMQc0Fqrv3DoUJO4WSZyCDkAEHPAmG05kTOJQ8gBgJgD2v7eXrIuq06+31CTuFkmcgg5ABBzwBgjbtN1y7PbiV8ziUPIAYCYA7oScWtOe3pWn/zhoSZxs0zkEHIAIOaAMUbc5jW7Z8V7HmelIOQAQMwBXYm4avH6rHzBB+f1mCZyCDkAEHPAGCNOiCHkAEDMTV3I1Zu9xkyPEnG3vDqliRxT8fdRXfsoEYDx+NiBi6YneDYlO+1dZcmuSaYoflZdYscgSfbZoWr18u2+704jf8yd9tl56l7HnQ94+9j+W8vf/eTKO4dxMpEDgCFUi5I119TJNVP2vGa8tgBCDgCmOeZEDwAT4q8gAAAAIQcAAICQAwAAQMgBAAAIOQAAAIQcAAAAQg4AAEDIAQAAIOQAAAAQcgAAAEIOAAAAIQcAAICQAwAAEHIAAAAIOQAAAIQcAACAkAMAAEDIAQAAIOQAAACEHAAAAEIOAAAAIQcAACDkAAAAEHIAAAAIOQAAACEHAACAkAMAAEDIAQAACDkAAACEHAAAAEIOAAAAIQcAACDkAAAAEHIAAAAIOQAAACEHAACAkAMAAEDIAQAACDkAAACEHAAAAEIOAABAyAEAACDkAAAAEHIAAADTa7FVAMC4PPaSTVZCy33swEVWAkAHmMgBAAAIOQAAAIQcAAAAQg4AAEDIAQAAIOQAAAC4JbcfAGBsPnbgotpaaLfHXrKpGtO20Np1UCXZVCeLq6RtG2xd11m205JUVVKPauHqZOluy1JVVep6Ot6idb0+i3e8e/NqNk9yC8vf/WRvdoQcAEBXIg2SZOULPjivnxeCCDkAYOoMcuN3scckCTGEHACASKNjTOQQcgAAWzGRo+2EGEIOAECk0TEmcgg5AICtmMjRdkIMIQcAINLoGBM5hBwAwFZM5Gg7IYaQAwAQaXSMiRxCDgBgKyZytJ0QQ8gBAIg0OsZEDiEHALAVEznaTogh5AAARBodYyKHkAMA2IqJHG0nxBByAAAijY4xkUPIAQBsxUSOthNiCDkAAJFGx5jIIeQAALZiIkfbCTGEHACASKNjTOQQcgAAWzGRo+2EGEIOAECk0TEmcgg5AICtmMjRdkIMIQfAxLRxR3iQHXhsm7Y1ACEHAHQw6Ocbe/P9eSEICDkAGNyGJJuT1FZF61RJZkbxQCZyAGP4pV3X/i4F6CKHVmL7ta0C/WUiBwB0LtKEGNB3JnIAdpbtXNO77de2CnSdiRwA0LlIE2JA35nIAdhZtnNN77Zf2yrQdSZyAEDnIk2IAX1nIgdgZ9nONb3bfm2rQNeZyAEAnYs0IQb0nYkcgJ1lO9f0bvu1rQJdZyIHAHQu0oQY0HcmcgB2lu1c07vt17YKdJ2JHADQuUgTYkDfmcgB2Fm2c03vtl/bKtB1JnIAQOciTYgBfWciB2Bn2c41vdt+bauAkANAyDE1RhE4JnIAQg4AIccURd6sU25/29vv2rpbzwVgEpwjB9BRO1Sje6y1PtNjjub6QUKdZElVttuLNyYrN9z69y2qkrsvSxY1P3Nb26oQA/rORA6go964z2gmcrM7zjOCju0YZTxV1W1/EnH40iqLm/97SZWcsHOVpVUycxuRN8x2KwQBIQfAZH6BV6Mbyd1zWZXf2LXKvXdIKkHHAPGzvYnclhO4Kzclp95Y59Or61wzz366axN531m72QsCCDkA+h1ygo65hlybtt+7Lq2y40xywi5VDlqSHLA42VAn6+rxPBcAIQfARENO0DFoyG09kVuoCdxtsf8CCDm/CAGEnKBjjiHXhe33rkur3GuH5OG7VNl3Udl+N9RlWzaRA4QcAFMbcoKO2wq5/zxw0VgncFuz/wIIOb8IAYTcgO61Q5Xf2KXKkYKu9yHXxe13r0XJI3apcvzOVZ50qYkcIOQA6EnICTohN+vpe8zk5DFO4LZm/wUQcn4RAgg5Qce2oinJ0io58eJNU7P92v8BhBwAvQ05QTf9AbekSnaskvM3JM9ZuUmIAQg5AKYl5ATddNp5JrlqU/LZG+ucsrrO1Rvrqdl+7f8AQg4AIdexoJudNC2e48+s68lfmTtUyeIq+dCq+mbnwW25zyDEAIQcAFMWclsG3W82QZcJBd3W0VYlWVQll25MVm4c/HEWJTliWXmczc2/25hf3Jesy5ZV5TlUzXM7a23y0dV1ztrqBRvlPoMQBBByAEJO0N1mvC1uou2aTcmZa+t8f135dxdtqHP1HK/dccSyKouboDtyhyp7LUoOWFxirgvTutlgmw3aqonRs9clm5r//5tr63x4Vb3d+BFiAEIOgCkPuXEF3WzA7VAll21MLtyQfPrGOuetn3u0DWLvRcnBS6ucsHO5Wfo4InWuIZskM1sE2+Yk6+vk5NV1Ntaz/36whTaRAxByAPQw5BYq6LYMuJtdnGNTd5/TMGYnbrNTyMs3lmj75Oo6N9WDB9sg8SPEAIQcAD0LuVHFTxsCbtJBt6wqE7dNSc5dn3xrbZ1z1g936Og440kIAgg5ACHXs6BrY8CNM+i2jrdvr61z1rr5T9zmEj9CDEDIAdDzkJt15Ba3Lbi1+OlCwM31OQ0ULc3zXrJVvH1nXfL9MV5lxUQOQMgBIOTmFD+LOxZwowi6rcP106vHH2+3FT9CDEDIASDkthk/R+2QXLM5ObWDATdM0LV18mgiByDkABByA7vXsiqXbqxz1abpeU63FnRtP3TURA5AyAEg5Ngq6JZUyZUtPnTURA5AyAEg5NjCsTtWOXhJibi2HjpqIgcg5AAQcnSMiRyAkANAyNHhkBNiAEIOACFHx0Ku69uv/R9AyAEg5OhdyAkxACEHgJCjYyHX9e3X/g8g5AAQcvQu5IQYgJADQMjRsZDr+vZr/wcQcgAIOXoXckIMQMgBIOToWMh1ffu1/wMIOQCEHL0LOSEGIOQAEHJ0LOS6vv3a/wGEHABCjt6FnBADEHIACDk6FnJd337t/wBCDgAhR+9CTogBCDkAhBwdC7mub7/2fwAhB4CQo3chJ8QAhBwAQo6OhVzXt1/7P4CQA0DI0buQE2IAQg4AIUfHQq7r26/9H0DIwXTufB6U5J5JdkqyvTdJleSyJF9uybIv3mKZqyQbbXVwm5YnOTjJ4UnunGT3JJtn9/WTrEzygyQ/ar76/n7aLcntkuzZfO2bZP8kOyQ5IMnMttqpWZ9rm9+ZVyS5Osk1zZ9rhRiAkEPIzXmxmh25X03ysCTHJtlrDj//xSQPGuPy/lKS2yc5LMmdkqxIsk+zM7XrFiE3k2R1khubHafzk5yT5LwkFyS53hZJD92heZ8/JuUDmxUD/Mz6JN9LcmqSDyX5/pSvo5lmPR2c5G7NerpjE757z/H34/ZcmeTyJJc00fx/zZ/nJlmzUE/Q/g8g5KC7IbdrkrsneXiSX0ty7yRLh3ysU5sdw4WyX5Jjkhyf5Kgkh6R8Gj4fP2p2lv4nyReawOOWlqVMIeb6y3ImyboOxfJezTIv1F8KM81O+eoJPscjkzwvyWObGBnWuiQnJ3l7km9OUbgdluQ+SR6c5K5J7pIyfZuEOsnZTTB/NsnXt/4dZf8FEHJ+EdKvkFue5OgkJyR5QLPjMgoLEXJ7JDkuyW8meWDKBG6hrE1yRpJ/SfLJlE/H+2qnZgf2mGa9363ZmR0m5L6Y5KkdeM7HJ/nbJIsWOOQ+lOSVE3h+eyd5bZJnJdlxhI97U5J3JnlDytS7a3Zuwu3EJL+SMnVb2tJlXZvkG01Afyrlg6j5laL9H0DIQetD7i5J7p/kUU3EHbAA/41RhtxdkjytCbhDJvASXZLkn5O8P8lPe7BJ7p5y+Nh9Ug6PvVvzNYoN9fMph+u22Y5JvpbkXmP4b32g2bbH6cQkf5VyWOBCOb15Xud14VdwyqHjj0vykCRHdPA9uybJ55K8L8mpdV2v9zcr0EeLrQKm0LJm5+ShKZOGo1M+eW67B6Qc9nViymGfk3JgklcneX6Sd6dMHK6cou1jr5RzDH85ZeJ5tySHLtB/a0MH1seLxhRxyXgvFFIl+f0kb83CT5nun+QzKR8W/bClr/P+KYeUPqnZ9rtsp2ZdPyrJmVVV/X2SD2aO59P5IBvoOhM5xr/RLcxEbu+Uw4Ie3exUHTnmpzWfidwJSV6Y8un4TAtfsouSnJTknzq6ye2dMuV8QPN115QLxLR9uxiHOyb5VuZ/vuWg3p9yeOM4vDjJO8a8Ps9L+QCpTZO5Ozfr/IkpH9JMq7OSvLWu6w/7WxboCxM5uuyOKYcInZDkflnYQ6cWwiOTvDTjvdrlMO6Q5B+b9fzSJBe2fHmXpxySelyzXRySMoHjlt40xogbt/tM4L95cMpk6CGZ/Dlzd0n5gOgpKefbTrt7Jfn3qqoen+RVGWAy6oNsQMjB+Myk3CLgISmHTN43k7ui2nw8oAmiR3dsuX8j5ZCsFyT5RIuWa/Y2DA9OufLoEVmY8yCnzcOSPH6Kn9+kzpv65ZSLn/zBhP77+za/X57Tk4Db2uxRGSfVdf033uaAkIPJ2T3lFgGP3GJHvavb7d2S/GHKIU6LOvocViT5z5QrAL55Qstwx5Rz2n6lifkjUu6hx+B2TPIWq2HBvDDJR1IumT8uS1IOoXxlyhS9z/ZK8q6qqn455VzfG27tm0zkACEHCxMLRyd5RLOzfmjHn89+TcA9O+V+ZF23KOWQvAObHdbNC/jfmmnC7fAm5I9uwu123ibz8uKM7wInfbQkyR+nfAA1Dkcm+dO0/wqp4/bEJAcleVJd1xdaHYCQg4VxaMrhMI9MmbIsn4LntEMTb3+Yhb0H3KQ8P+XQrWem3E9rVJF4pyT3aHZK791E3G7eIiNzSCZzL7e+eWiSo1IuJrNQFiV5SZLXeI/cpvsn+VxVVSfGDcUBIQcji5x7JPm1Zofn6Iz2Rr2T9uhm5+o+U/46Pj7JLimXNZ/vpeWPT/LGJtx28RZZMG9KOWSZhbUo5V5tCxVyd0i5ifsjWr4erk3y42Y9fCnlfnuPHPMy3DnlRuLH13V9vk0TEHIwvNcleUzK7QKmxabmzyNSLtX/Wz16PU9sdiifk2Q+H3HfqQl6Fs4JKTeaZzwekXKI5boRP+7xKTfDbuukf2WSLyb5eJJv13X909n/o6qqSR3+eeck/1ZV1UOTrEpM5AAhB8N42JRFXFImSCelHObUx2nHs5JcnXLZ72Ft8NZYUDsneZvVMFaHNAFx9ggf84VJ3p52HsHwjZT7TZ6c5LIt4m3L71kyweW7b5K/ruv6qTZNQMjBcG6awuf0wOarz16Zcg7KB2zirfT7KTdDZ7x/x959RCE3k3Kl0Ze38HmenuQvkvx3XdebtvWNW0XdJDylqqrPJvlXEzmg62asAmCE3plygRLa5ZCUi+4wfgeN6O/qv29hxF2Wckj1g1IOo9xUVVW29dUSb0+yv00TEHIAv7Bbyrk7LlbSLi5wMjl7jCjintWy5/UfSe5b1/V767reWNd1BvlqiRVJXmHTBIQcwM0dmXJBG9rh0XGBk0nab8oibkOSl9R1/bgkF29vAtfSiVySPLOqqjvYPAEhB3BzL0pynNUwcbvFBU4m7fp5/Ozftizi1iT5nbqu35Ekg07hWjiRS5JdkzzD5gkIOYCbW5Jy8YMdrYqJelmSQ62GiVo15M+9NuX8s7ZYneTX67r+2Oy/mOs0rmUTuST57aqqltlEASEHcHNHJnneHL5/qVU2UoelXKmSybpmiJ95QsrtTNripmaZPrvlv+z4RG72PeLelUBnuf0Ak2CHvT9eluRfklw1wPee1oTHgSlXlLtDktulHB64a/O1xCod2FubdcZkXTDH7z8q5ZDKNn3Q+oKUe8PdTAsnbHNVpVxx83SbKSDkYPAdm+VJNg/583WSZc0Of1f2JDakHJq0NuU8ky13JHZJslOm80qPK5K8NOUec9vz4+Zra3s2QTf7tXfzuAc028DylCsD7t6sw92SLOr5e+zXUy5ywmStT7m34qBul+T9zTbcFu9Mucn3LX8RDzFha2H8HVtVVVW7qRwg5GAgz06ZrAz7F+fmJEck+VITdG0JtUuTXNv8eXGSC5NclHJo1XUpFz24MckNTcDVzZ97pExO9kqZQt0jybEph/3sOyWv97uSXDLkz1/bfG3LTLP+dm/+3KP58ylJHtqz99euKTeOZvIuyNwmcn/avP/b4rtJXt2hKBvGYc3fI2ttroCQg+1bM4LHWNWy5/T1lAnIz0b4XG7fBN3jkhyfdn1KPxd7NjG3kOf8bE45fPOqJD/Z4t//Ug9DzgVO2uPLKVO5QTwmyTNbtOwbk7ww5cOnWzUlE7n9UyahK22uQNe42Ald1bZD524cMuK25eIkH03yW03QvTnbn0y11dMzmfO1+nY+5uFJXuLXQ2t8bsDv2zvJX7Zs2d+X5Cvbi7KOX7UyKR9o721TBYQceC8tlHOS/FGSY5K8J8OfXzgpt2+ClIX1p3GBk7a4NMmpA37v61Kmx21xTZI3bO+bpuCqlT9/KjZXwM4nsNDOS/LclMOwLunYsj/F75wF9dtJHmk1tMbHM9iU/tiUQ4/b5L1JLtveN03JRA5AyAFjdXKSB2Q7hz61zP9Lck8v3YLYI8mbrIbWWJdy9clBvC7tOgT4hiTvHuQbp2giZ18IEHLAWF2Q5MQk/92R5V2c5De9bAvi5UnubDW0xqeTnDXA9z0yycNatuwfTTk/d7umZCK3KYPd5xJAyAEjdX2Sxyf5QkeW9zFxU+9Ru3uSF1sNrbEhyV8M+Pfvy1u4/B8Y9BunZCJ3Wbp7ESlAyAEdtybJE5Kc24FlPTTtuk/WNHhLyg3laYePZrBDnh+a5IEtW/azknxt0G+ekonc9+q6XmezBYQcMCmXJ3lqkptavpyLkjzcyzUyLnDSLjdmgKs9Np7XwuX/RMpEcSBTMpH7us0WEHJAG3ZI3tyB5TzOSzUSe8QFTtrmr5P8cIDvu2fad6P6OoPf9y7JVEzkNiQ5xWYLCDmgDf48g11kYZLunWQfL9W8vSoucNImP0nytgG/94lJlrVs+S9M8u05lV/3J3Jfquv6bJsuIOSANrgpyUktX8bbJTnaSzXvGP49q6FVXp7B7hu3S9p59davZI6HZk/BRO6dNltAyAFtcnKSL7d8GYXc8Kokb02yo1XRGh9KuQH4IH41yR1b+BzOmOsPdHwid0qST9l0ASEHtEmd5F0tX0Y3Bh/e45M8xGpojZVJ/nAO339iC5/D5iTfmfMnCt2dyF2T5A/qut5s8wWEHNA2n0y7b0dwRJKlXqY52zPduKBNn7woyaUDfu/Oad9FTpJySOgP5/pDQ07kFk34udZJXpjkRzZdQMgBbXRTkn9v8fIdlOQOXqY5e2Wz7miHf0y5b9yg7pfkgBY+j3OTXDfXHxpyInfDhCPu+XVd/3tLb4UAIOSAJOWeUBtbumzL4oqLc3Vkkt+1GlrjnCQvm+PPPDDlHMe2+UnK4ZVzq6LhJnJvSvInGezCMKO0Nsmzk/x9i29ODiDkgCTlnJcftHj5TJYGN3uBk52silZYl+Q5Sa6d42t4/5Y+nwuH2iiHm8hdkXJl3WOSvGNMQXdmkofUdf3+lt+cHEDIAUnKNO4LLV4+h1YO7glJjrcaWuOklMv1z8Xeae9Ffi4d5oeGmcht8XVukpc0Qff6JD9dgOd1eZI/TnJcktNbfisEACEH3MxXWrxst/fyDGSvJG8ZweNcnXI4IPPzqSR/PsTPHZlyD8U2WjnMDw0zkbuVkDo3yetS7o34WynnHF48j+eyPuXG5i9NclRd12+q63pVB25ODjBni60CmGpnppwbskMLl20/L89AXjui6H19yjlah1mlQ7swyfMz3LmnbZ3GbUo53HHO5htDW03Frm8i7qMp08t7N/F7VMr5tLsn2TXJkpSLllRJNqRcPOW6JGcn+WoTcd9uvmebkzcxBwg5oM0uSXJ+ksNbuGx7NjtlG7xMt+noJM8dweOckeQ9SR5mlQ5tY/NaDDstOqzFz2uoK0ku4OGJVyf5bPM1a7fmd8ayLUJuXZJr67peZfMEhBwwbdanXPCkjSG3e/M7SMjdukUpFzhZNoId9Zc120KffueP+mbPf5Lk1CF/dibJIS1dTxuSXDXMD454Irc9q5qvkQWliRwg5IC2+0lLl2u/lJuC3+QlulVPTvLgETzOPyY5vYfrb+cRPtZ/ZX7nKe6Q5I4tXU+bkqwZQ4iNnBADhBww7S5o6XLVGf3UZFrslXJO23xdnnIhib751SSPGdFjnZfkeZnfPRn3TzkssK2GKrIxT+RG/vNCEBByQNutbOlyLUmyb4Y8P2fKvTajuT3Da5Nc1rN1tyLJ+zKae+6tSfKUDHkxkK2WaVlL19eVKYfdjj2k5kuIAUIOmHaXpUwT2vZ+X5TRHv42LY7KaC5w8uUk/9CzdVcl+dskvzSix3tpkq+N4HH2SXtv97M2Q07GTeQAhBywsK5Jey904dDKW8btn2X+05v1SV6ecv5Tn7wqyaNG9FjvS/J3I3qsvVoevxMJqfkSYoCQA6bd1Znf+T2MzzOS/MoIHuc9Kbcc6JMHZ3TnA34jyR+McNn2mcYVbiIHIOSAhecS/+23/4hC5KKM5kIpXbI8ZYK2ZASPdWXKFUNHee7mshavu31Trh67btwhNemQBBByQNutT7lYw14tXK4rvTw/95qUi2KM4nGu7tF6q1IOgRzF5f03JXl6Rn/LjkUtXn87xFUrAYQc0Eptvcx/nXKhBZL7JXnOCB7nf5J8sGfrbpTnxb0mySkLsIz7tXwdLp1ESM37F4gQA4QcwESstwqSlGnNW0fw+3hNkpc1gdwXD05y0oge6z+SvG2BlnOmxetwWROac57imsgBCDmgn67IEOflTKGnJ3nACB7nXUm+26P1Nnte3NIRPNb3Um76vVCT6zaH3JIMebNyEzkAIQeMYZ+nhct0bVyEZb+M5gIn56ZM9fpi9n5xozgv7mdJnprkugVc3utavC5nMuS5mSZyAEIOWPgdtZ1auFzXxH3kXpvkgBE8zitbHguj9qokjx7RY70wyZkLvLyrWr4+h9oGTeQAhBywsJamnfexurTnr8sDM5oLnJyc5OM9Wm+jPC/uz5P86xiWuWr5Or3DJELKRA5AyAHb1tbzcy7ueVy/bQS/g1cleUX6c4GT5Unem9GcF3daklePabmvavl6vfMkQmq+hBgg5IBpt09Gc6PkUbuox6/Js5LcdwSP82dJftiTdTZ7XtydRvBYFyZ5RsZ35dQbWr5u75pkxyQ3jTOkTOQAhBywbbu18L2+McmPe/p6rEi5X9l8/SDJX/Zovb0yozkvbl0TceP8IGFlytS0rYdYHpDkoCTnjDOk5kuIAUIOmHb7pX0TuRuS/LSnr8frk+w/gsd5eZLVPVlnD8poru45G4SfH/PyX55yhdalLV2/S5McOdeQM5EDmKwZqwCm3v4tXKazk1zfw9fiAUmeNoLH+XCST/VknY3yfnEfTPKOCTyHy1Ju2N5mxwwTUvP5mq+6ruf1BdB1JnIw/Q5qacj17dYDS5K8fQS/d69Lufx+H4zyvLj/S7nVwCSsSrm4zx4tXte/kmRRkk1zCal5vbgmcgBCDtimO7Vwmb7Zw9fhORnNBU7emuT8nqyzV2Q058Vdm3LT70ndz21Dyjmhd2/xur5bkkNTzr0cS0jNlxADhBwwzRYlObhly7Qxybd69jockNHc++zbSf6qJ+vsQSnnE47C85N8f8LP55yWr+8lSR4+l5AzkQOYLOfIwXTbNUPeI2oB/WguO4sdN7un+CeZ/03ZN6ccUrmuB+tt/4zuvLi3JPmPFjynszqw3h8115ByjhzA5JjIwXS7e5K9WrZMX0451KwPVqdMlp42gsf65yT/04N1Nsrz4k7JaCaho/C9lPvWLW3xur9vknsk+e6gITWvF9pEDkDIAbfpyLTv3lWf69H63ydlIjTfox+uyGjuPdcFr0jymBE8zvkpN15vy4cGP01ybpIjWrzulyZ5wqAh5xw5gMlyaCVMt2Natjwrk5zWo/V//yTHjuBx3pDkkh6sr1GdF3dTysVNVrbouW1I8tUOvAZPzIBX15z0oY2TPrQTQMgBC2WnlPuWtcmp6df94xaN4DG+nuQ9PVhX+yd5b0Zz6OEfJPlKC5/jFzvwOhyY5He6EFLOkQOEHDCtjk5y+5Yt0ye8LHOyoYmSaT+ncPa8uFFcYfX9Sf6upc/zy0lu6MDr8eKUD4JaHVImcoCQA6bVw9Ou8+POSz8u1jFK70/yjR48z5dnNOfFnZHk91v8PC9NN6ZyhyV5XttDykQOEHLANFqW5NdbtkwfSnKjl2Zgl2R091Frs+NSbs8wX1cneUrKlULb7OSOvC4vS7K8zSFlIgcIOWAaPSjJIS1anhuTfNDLMievSXL5lD/HUd0vblOSZyT5cQee8ylJruvAci7fXmCbyAEIOWD0ntGy5fmvjuxkt8UXknxgyp/jKM+Le0O6M+m6NMlnOvR75FFtDSkTOUDIAdPmHklObNHybEjyTi/LwNYmeWWSaR8ZjOq8uP9O8saOPfd/7NA+wrtSrmTZupAaVUhWVbWsqqpd/eoBhBwwaS9LskOLlufjSf7XyzKwv+nB+npgRnNe3LlJnp1yaGWXfD7JNzuyrLdPuejOsoUKqWHNNySrqlpaVdWTU+7v90C/egAhB0zSvZL8douWZ32SP/WyDOynSd48xc/vpiR7NmEw3/PiViV5UpIrO7geNjXB3hXHJ/nrUYfUfM0jIHdNuWH8V5P8c5L7dPDDAIAstgpgqrwht/LJ+QR9MMm3vCwDe02Sa6f4+e2QcpjtnUfwWC9NtyeX/9m83gd3ZHmfnXLY74u2DKn5mG/MDfHze6d80PXCJIf7dQMIOaAtnpTkhBYtz3Xp3rlLk/SplFs0TLPfSrL7CB7nb1Oudtllq5O8Pcnfd2iZf6+qqtR1/aJRhNh8DRqSVVUdkHJriucmOcivGkDIAW1yUJI/a9kyvT7JBV6agaxJPy5wMoqI+2rKNG4afCDJ76ZcoKhLMbdbkhfUdb1mPg80honc4Sk3Nn9ckv38mgGmjXPkoPuWpEwn2rSj8oV06xygSfuLJN+3GrbrkpRzm26akuezLt286ftTk3ymqqrD23aOXJJFSX41yUdSLijzIhEHCDmgrd6R5NdatDw3JPm9JBu9NAP5YcohdmzbxpTpynlT9rz+K8knO7jcD0jypSTPTzLTgqtW7ldV1fOTfDnJ55L8ZpKdvW0AIQe01auSvKBly/TqJGd7aQb2R038sm2vTTmPcNpsTvKHKVfh7Jp9krw7yWlVVT14AjfkXprk/innGZ7ZLMv9vFUAIQe03avTvkvV/1vKDYQZzMdS7rPHtv1nkrdO8fM7J908xHLWcUlOS/KJlFsVLF3AidySlNsFvDHJ6Um+kuQ5SZZ7mwB942In0D1LUg6nbNsk7syUCzcwmJ+lTGLYtu82O+rTfiGYdyZ5aBNCXfWo5uubVVV9POWQ0Z9k/uc0rki5IMxDUiZwx3hbAAg56JpDmx2+tu3sXZpyZbifeYkG9vaUG4Bz265P8oxM9731Zm1M+SDk9HT/4hxHN19vSvKdlA95zkxyVpLLUw4lvnGrn6mS7JJyXtt+KVecvGfz591TDuMEQMhB51RJnplyw+/9W7iz/cQk53qZBnZWE+Rs24uTfLtHz/cnKdPHj2c6Tn2oktyr+Xp68+82JLk65T6TW05ZZ5LslWSPlHPfABBytM2orlbWI7+WckGM41q4bOubHbQv2bIHtjnJK3LLicSCv5c69r75q5T7rPXNfyc5KeVDm2m0JOV8Nue0AQg5uqxnQTYXOyd5WMoU7uEtXcb1SZ4cF+uYq39L8tlhQqxH75/TmtjtqzcmOTjJ07xdABBytNKwO7JTugO7W5K7pVws4OEpJ/e31fVJnp1y010Gd22S14xqO57SidzFSZ6VcrPsPntBymHUD/O2AUDI0TpTFGQb5vC9M0203S7JgUmOTTmH5KiUi5m03eVJHp/ki7bgOXt9kguGDbEpfv9s+T565pbrqMduSrmA0MeTPNjqAEDI0SpTNJG7T5J/bf75Zykn8s9erKBOsnd+cUW2vVOuwHZA87+75KwkT4obfg/jf5P83Si34ymcyL0iyf/YVH5uVZInJDklyb2tDgCEHK0xRROF5c0O1zT7aMrhXlfZcudsYxMp6+cTYlP8/kmSDyb5S5vKLVyR5IQk/xKTOQCEHG3hHLlOWJfkj5P8eab/pswL5R9yK4eimsj93HeSvMhmcptWJnlsyoVyHmF1LIglVgEg5ECQTZNvptzL6+tWxdAuTzk3bt4hNqXvn58leUrcTH57rk/yG0nenV/ck435W53k5CTfsioAIQdzYCLXWmuSvD3JXyS5weqYl5OSXLYQ2/GUTOSem+S7NpOBrE3yjJQbh78h03HT8Em5MuW85n+o6/r7Vgcg5ECQTYOPNjuJdq7n74tJ3jeqEJvC989bkvyHzWTO3pzke0n+JsntrY45+WGS9yb5SF3Xl1gdgJCDIZnItcqXk7wt5Qp5zN+GJK9KsnmhtuOOT+Q+m+R1NpOhnZzk+ylT88dYHdu0Lsnnk7y/+f12k1UCCDmYJ0HWCl9K8o4kn4iLmYzSu5N8Y5QhNkXvn4tSDhFcbzOZV8ifX1XVY1MOTz0p5Qbi/MLFKUcY/Ftd186BA4QcjHhHRABOxvVJPplyNcXPWx0jd0HK4akLuh13dCK3NuVehJfaTOaneT3rlPsTfjrJq1MuhNLnKzDemOQrKVf4PCXJNbe17c/3gxQAIYcdEcZlY8p5NR9O8l9JfmSVLJjXzu5AjjLEpuT987JmR5t52mr7uTDJc6uq+ockv59yhcs+Bd13knwkySdcvAQQcjD+HREBOHo3NsH2iZRzks6IwycX2mkpV8Nb8O24gxO5f0q5QAcjcBuv5xlJHp/k2CboHplk1yldBT9MOVfwlCSnJ9k0l+3cRA4QcjD6HRGGtyrl5sH/m3Lu2xkpF0RgPNYkeUm2cYGTUe5Iduz986246fdIbWf7OSPJ46uqumsTdr+d5JCOP+Ubk/ygibfTk3y1rmvnWQJCDlq4I9KlHdirmmBanmSXJDsl2bH5Wqgdmp8luTbJOSm3Cji7+edzUw6jZPyHlr0z5fDVsWzHQ0zkdpjg++PJcU/CkRpw+/lBktekXJH2/klOTPLQJAd34CluSDmX8qspt/I4Y+v313zeQyZygJCDhd8R6YJvJXlE8897JNkzyW7Nn7s0/7xLkr1SbuJ7QJJFKYcC7ZZk79z8kMc6ZbK2ofm6IuWcq2uSXJ1yM9tLM8B5WD13TrMDuNCf2s8kuS7lJupj25Ec4v3z1WabG1foV822/DfNa8EIzXH7WZ3kM0k+U1XVjimHXt4vyXFJDkuyovmdNCmbm99rFzW/T89sou27uY3bBQgxoPf70X4R0tEAvFvzl/2ylizSqUke5pWhxTvyowhBpnD7qapq9yRHpEzpjmjC7i5Jdk/5oGnn5sOK+VqTcjTBDSkfTp2f5CfN1wVJftz8+068fwAmzUSOSQeZlYAQ8/5hgiFS1/X1Sb7WfG25fe2ZZL+UIwt2T3K7JEtTDiHf1sZXpUzBV6ZM2q5NmapdmzK5viIjmJILMUDIQQd3ROzAMg3GfY4czHH7uraJLwCEHAgyEGIAgJCjlzuyApBpYCIHAAg5erkjC10mxAAAIUevdmQFINPARA4AEHL0ckcWukyIAQBCjl7tyApApoGJHAAg5Ojljix0mRADAIQcvdqRFYBMAxM5AEDI0csdWegyIQYACDl6tSMrAJkGJnIAgJCjlzuy0GVCDAAQcvRqR1YAMg1M5AAAIUcvd2Shy4QYACDk6NWOrABkGpjIAQBCjl7uyEKXCTEAQMjRqx1ZAcg0MJEDAIQcvdyRhS4TYgCAkKNXO7ICkGlgIgcACDl6uSMLXSbEAAAhR692ZAUg08BEDgAQcvRyRxa6TIgBAEKOXu3ICkCmgYkcACDk6OWOLHSZEAMAhBy92pEVgEwDEzkAQMjRyx1Z6DIhBgAIOXq1IysAmQYmcgCAkKOXO7LQZUIMABBy9GpHVgAyDUzkAAAhRy93ZKHLhBgAIOTo1Y5sVVWrk7RpL3ijV5MhtmMhCAAIOXqxI7tXkkOSPCbJkhY9lcOTPD/JN5JckOQ6ry5CDABYsP1oOxK0PPT2TXJwkuOSHJPk3knu0PLFPj/J95qvryf5TpIrkmzwiiIEAQAhxzSE2tb/at8kd23C7agk90myf8ef5uok309ydpJvx9QOIQYACDk6HnLTGG6DMLVDCAIAQo5ORtzbkjylJ+G2PbNTu99N8n9WhxADANiWGauACTpWxP3cLknum2SFVdEfVVXN6wsA6C9XrWSS1loFt+A2Bj1iIgcACDmAjnEfOQBAyAF0jBADAIQcQMeYyAEAQg6gY4QYACDkADrGRA4AEHIAHSPEAAAhRxftahXcwhKroD9M5AAAIUcXfTXJeqvhZq6wCvpDiAEAw6rsSAAAAAg5AAAAhBwAAABCDgAAQMgBAAAg5AAAABByAAAAQg4AAAAhBwAAgJADAAAQcgAAAAg5AAAAhBwAAICQAwAAQMgBAAAg5AAAAIQcAAAAQg4AAAAhBwAAIOQAAAAQcgAAAAg5AAAAIQcAAICQAwAAQMgBAAAIOQAAAIQcAAAAQg4AAEDICTkAAAAhBwAAgJADAABAyAEAAAg5AAAAhBwAAABCDgAAQMgBAAAg5AAAABByAAAAQg4AAAAhBwAAgJADAAAQcgAAAAg5AAAAhBwAAICQAwAAQMgBAAAg5AAAAIQcAAAAQg4AAAAhBwAAIOQAAAAQcgAAAAg5AAAAIQcAAICQAwAAQMgBAAAIOQAAAIQcAAAAQg4AAAAhBwAAIOQAAAAQcgAAAAg5AAAAIQcAAICQAwAAQMgBAAAIOQAAAIQcAAAAQg4AAEDIAQAAIOQAAAAQcgAAAEIOAAAAIQcAAICQAwAAEHIAAAAIOQAAAIQcAACAkAMAAEDIAQAAIOQAAACEHAAAAEIOAAAAIQcAACDkAAAAEHIAAAAIOQAAAIQcAACAkAMAAEDIAQAAIOQAAACEHAAAAEIOAAAAIQcAACDkAAAAEHIAAAAIOQAAACEHAACAkAMAAEDIAQAACDkAAACEHAAAAEIOAABAyAEAACDkAAAAEHIAAABCDgAAACEHAACAkAMAABByAAAACDkAAACEHAAAgJADAABAyAEAACDkAAAAEHIAAABCDgAAACEHAACAkAMAABByAAAACDkAAACEHAAAgJADAABAyAEAACDkAAAAhBwAAABCDgAAACEHAAAg5AAAABByAAAACDkAAAAhBwAAgJADAABAyAEAAAg5AAAAhBwAAABCDgAAQMgBAAAg5AAAABByAAAAQg4AAAAhBwAAgJADAAAQckIOAABAyAEAACDkAAAAEHIAAABCDgAAACEHAACAkAMAABByAAAACDkAAACEHAAAgJADAABAyAEAACDkAAAAhBwAAACT9f8HAExm8OmXqTthAAAAAElFTkSuQmCC",
									"isMetaFile": false,
									"width": 110.99999,
									"height": 93.75,
									"iscrop": false,
									"verticalPosition": null,
									"horizontalPosition": null,
									"textWrappingStyle": "Inline"
								}
							]
						}
					]
				},
				"firstPageFooter": {
					"blocks": [
						{
							"paragraphFormat": {
								"firstLineIndent": 36,
								"styleName": "PwC Address",
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
									"text": "PricewaterhouseCoopers LLP, street, city, state, zip code"
								}
							]
						},
						{
							"paragraphFormat": {
								"firstLineIndent": 36,
								"styleName": "PwC Address",
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
									"text": "T: (xxx) xxx "
								},
								{
									"characterFormat": {
										"fontColor": "empty"
									},
									"text": "xxxx"
								},
								{
									"characterFormat": {
										"fontColor": "empty"
									},
									"text": ", F: (xxx) xxx "
								},
								{
									"characterFormat": {
										"fontColor": "empty"
									},
									"text": "xxxx"
								},
								{
									"characterFormat": {
										"fontColor": "empty"
									},
									"text": ", www.XxX.com/us"
								}
							]
						}
					]
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
		"afterSpacing": 10,
		"lineSpacing": 1.149999976158142,
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
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "empty",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"next": "Normal"
		},
		{
			"name": "Heading 1",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 12,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level1",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 16,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496FF",
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
				"fontColor": "#2F5496FF",
				"fontSizeBidi": 16,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Default Paragraph Font",
			"type": "Character",
			"characterFormat": {
				"fontColor": "empty"
			}
		},
		{
			"name": "Heading 2",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 2,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level2",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 13,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496FF",
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
				"fontColor": "#2F5496FF",
				"fontSizeBidi": 13,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 3",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 2,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level3",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 12,
				"fontFamily": "Calibri Light",
				"fontColor": "#1F3763FF",
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
				"fontColor": "#1F3763FF",
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 4",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 2,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level4",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496FF",
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
				"fontColor": "#2F5496FF",
				"italicBidi": true,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 5",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 2,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level5",
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496FF",
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
				"fontColor": "#2F5496FF",
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 6",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 2,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level6",
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Calibri Light",
				"fontColor": "#1F3763FF",
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
				"fontColor": "#1F3763FF",
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Footnote Text",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontColor": "empty"
			},
			"basedOn": "Normal",
			"link": "Footnote Text Char",
			"next": "Footnote Text"
		},
		{
			"name": "Footnote Text Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#00000000",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Footnote Reference",
			"type": "Character",
			"characterFormat": {
				"baselineAlignment": "Superscript",
				"fontColor": "#00000000"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "annotation text",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontColor": "empty"
			},
			"basedOn": "Normal",
			"link": "Comment Text Char",
			"next": "annotation text"
		},
		{
			"name": "Comment Text Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#00000000",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "List Paragraph",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 36,
				"listFormat": {},
				"contextualSpacing": true
			},
			"characterFormat": {
				"fontColor": "empty"
			},
			"basedOn": "Normal",
			"next": "List Paragraph"
		},
		{
			"name": "Table Bullet 1",
			"type": "Paragraph",
			"paragraphFormat": {
				"textAlignment": "Justify",
				"lineSpacing": 14.5,
				"lineSpacingType": "AtLeast",
				"listFormat": {
					"listId": 0
				}
			},
			"characterFormat": {
				"fontSize": 12,
				"fontColor": "empty",
				"fontSizeBidi": 12
			},
			"basedOn": "Normal",
			"next": "Table Bullet 1"
		},
		{
			"name": "List",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 18,
				"firstLineIndent": -18,
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 12,
				"fontColor": "empty",
				"fontSizeBidi": 12
			},
			"basedOn": "Normal",
			"next": "List"
		},
		{
			"name": "Balloon Text",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 8,
				"fontFamily": "Tahoma",
				"fontColor": "empty",
				"fontSizeBidi": 8,
				"fontFamilyBidi": "Tahoma"
			},
			"basedOn": "Normal",
			"link": "Balloon Text Char",
			"next": "Balloon Text"
		},
		{
			"name": "Balloon Text Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 8,
				"fontFamily": "Tahoma",
				"fontColor": "#00000000",
				"fontSizeBidi": 8,
				"fontFamilyBidi": "Tahoma"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "annotation reference",
			"type": "Character",
			"characterFormat": {
				"fontSize": 8,
				"fontColor": "#00000000",
				"fontSizeBidi": 8
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "annotation subject",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"bold": true,
				"fontColor": "empty",
				"boldBidi": true
			},
			"basedOn": "annotation text",
			"link": "Comment Subject Char",
			"next": "annotation text"
		},
		{
			"name": "Comment Subject Char",
			"type": "Character",
			"characterFormat": {
				"bold": true,
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#00000000",
				"boldBidi": true,
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Comment Text Char"
		},
		{
			"name": "Footer",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {},
				"tabs": [
					{
						"position": 207.60000610351563,
						"deletePosition": 0,
						"tabJustification": "Center",
						"tabLeader": "None"
					},
					{
						"position": 415.25,
						"deletePosition": 0,
						"tabJustification": "Right",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {
				"fontColor": "empty"
			},
			"basedOn": "Normal",
			"link": "Footer Char",
			"next": "Footer"
		},
		{
			"name": "Footer Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#00000000",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Page Number",
			"type": "Character",
			"characterFormat": {
				"fontColor": "#00000000"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Header",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {},
				"tabs": [
					{
						"position": 207.60000610351563,
						"deletePosition": 0,
						"tabJustification": "Center",
						"tabLeader": "None"
					},
					{
						"position": 415.25,
						"deletePosition": 0,
						"tabJustification": "Right",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {
				"bold": true,
				"fontSize": 12,
				"fontColor": "#FF0000FF",
				"boldBidi": true,
				"fontSizeBidi": 12
			},
			"basedOn": "Normal",
			"link": "Header Char",
			"next": "Header"
		},
		{
			"name": "Header Char",
			"type": "Character",
			"characterFormat": {
				"bold": true,
				"fontSize": 12,
				"fontFamily": "Times New Roman",
				"fontColor": "#FF0000FF",
				"boldBidi": true,
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Revision",
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
				"fontColor": "empty",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"next": "Revision"
		},
		{
			"name": "Body Text Indent",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 36,
				"firstLineIndent": -36,
				"lineSpacing": 12,
				"lineSpacingType": "AtLeast",
				"listFormat": {}
			},
			"characterFormat": {
				"bold": true,
				"fontColor": "#000000FF",
				"boldBidi": true
			},
			"basedOn": "Normal",
			"link": "Body Text Indent Char",
			"next": "Body Text Indent"
		},
		{
			"name": "Body Text Indent Char",
			"type": "Character",
			"characterFormat": {
				"bold": true,
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"boldBidi": true,
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "PwC Address",
			"type": "Paragraph",
			"paragraphFormat": {
				"lineSpacing": 10,
				"lineSpacingType": "AtLeast",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontSize": 9,
				"fontFamily": "Georgia",
				"fontColor": "empty",
				"italicBidi": true,
				"fontSizeBidi": 9,
				"fontFamilyBidi": "Georgia"
			},
			"basedOn": "Normal",
			"link": "PwC Address Char",
			"next": "PwC Address"
		},
		{
			"name": "PwC Address Char",
			"type": "Character",
			"characterFormat": {
				"italic": true,
				"fontSize": 9,
				"fontFamily": "Georgia",
				"fontColor": "#00000000",
				"italicBidi": true,
				"fontSizeBidi": 9,
				"fontFamilyBidi": "Georgia"
			},
			"basedOn": "Default Paragraph Font"
		}
	],
	"lists": [
		{
			"abstractListId": 0,
			"levelOverrides": [],
			"listId": 0
		},
		{
			"abstractListId": 1,
			"levelOverrides": [],
			"listId": 1
		},
		{
			"abstractListId": 2,
			"levelOverrides": [],
			"listId": 2
		},
		{
			"abstractListId": 3,
			"levelOverrides": [],
			"listId": 3
		}
	],
	"abstractLists": [
		{
			"abstractListId": 0,
			"levels": [
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 36,
						"firstLineIndent": -36,
						"listFormat": {},
						"tabs": [
							{
								"position": 36,
								"deletePosition": 0,
								"tabJustification": "List",
								"tabLeader": "None"
							}
						]
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%1.",
					"restartLevel": 0,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 72,
						"firstLineIndent": -36,
						"listFormat": {},
						"tabs": [
							{
								"position": 72,
								"deletePosition": 0,
								"tabJustification": "List",
								"tabLeader": "None"
							}
						]
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%2.",
					"restartLevel": 1,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 108,
						"firstLineIndent": -36,
						"listFormat": {},
						"tabs": [
							{
								"position": 108,
								"deletePosition": 0,
								"tabJustification": "List",
								"tabLeader": "None"
							}
						]
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%3.",
					"restartLevel": 2,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 144,
						"firstLineIndent": -36,
						"listFormat": {},
						"tabs": [
							{
								"position": 144,
								"deletePosition": 0,
								"tabJustification": "List",
								"tabLeader": "None"
							}
						]
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%4.",
					"restartLevel": 3,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 180,
						"firstLineIndent": -36,
						"listFormat": {},
						"tabs": [
							{
								"position": 180,
								"deletePosition": 0,
								"tabJustification": "List",
								"tabLeader": "None"
							}
						]
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%5.",
					"restartLevel": 4,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 216,
						"firstLineIndent": -36,
						"listFormat": {},
						"tabs": [
							{
								"position": 216,
								"deletePosition": 0,
								"tabJustification": "List",
								"tabLeader": "None"
							}
						]
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%6.",
					"restartLevel": 5,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 252,
						"firstLineIndent": -36,
						"listFormat": {},
						"tabs": [
							{
								"position": 252,
								"deletePosition": 0,
								"tabJustification": "List",
								"tabLeader": "None"
							}
						]
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%7.",
					"restartLevel": 6,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 288,
						"firstLineIndent": -36,
						"listFormat": {},
						"tabs": [
							{
								"position": 288,
								"deletePosition": 0,
								"tabJustification": "List",
								"tabLeader": "None"
							}
						]
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%8.",
					"restartLevel": 7,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 324,
						"firstLineIndent": -36,
						"listFormat": {},
						"tabs": [
							{
								"position": 324,
								"deletePosition": 0,
								"tabJustification": "List",
								"tabLeader": "None"
							}
						]
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%9.",
					"restartLevel": 8,
					"startAt": 1
				}
			]
		},
		{
			"abstractListId": 1,
			"levels": [
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 54,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowRoman",
					"numberFormat": "(%1)",
					"restartLevel": 0,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 90,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowLetter",
					"numberFormat": "%2.",
					"restartLevel": 1,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 126,
						"firstLineIndent": -9,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowRoman",
					"numberFormat": "%3.",
					"restartLevel": 2,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 162,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%4.",
					"restartLevel": 3,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 198,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowLetter",
					"numberFormat": "%5.",
					"restartLevel": 4,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 234,
						"firstLineIndent": -9,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowRoman",
					"numberFormat": "%6.",
					"restartLevel": 5,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 270,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%7.",
					"restartLevel": 6,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 306,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowLetter",
					"numberFormat": "%8.",
					"restartLevel": 7,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 342,
						"firstLineIndent": -9,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowRoman",
					"numberFormat": "%9.",
					"restartLevel": 8,
					"startAt": 1
				}
			]
		},
		{
			"abstractListId": 2,
			"levels": [
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 54,
						"firstLineIndent": -36,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowRoman",
					"numberFormat": "(%1)",
					"restartLevel": 0,
					"startAt": 2
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 72,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowLetter",
					"numberFormat": "%2.",
					"restartLevel": 1,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 108,
						"firstLineIndent": -9,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowRoman",
					"numberFormat": "%3.",
					"restartLevel": 2,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 144,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%4.",
					"restartLevel": 3,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 180,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowLetter",
					"numberFormat": "%5.",
					"restartLevel": 4,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 216,
						"firstLineIndent": -9,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowRoman",
					"numberFormat": "%6.",
					"restartLevel": 5,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 252,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%7.",
					"restartLevel": 6,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 288,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowLetter",
					"numberFormat": "%8.",
					"restartLevel": 7,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 324,
						"firstLineIndent": -9,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowRoman",
					"numberFormat": "%9.",
					"restartLevel": 8,
					"startAt": 1
				}
			]
		},
		{
			"abstractListId": 3,
			"levels": [
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 72,
						"firstLineIndent": -36,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowRoman",
					"numberFormat": "(%1)",
					"restartLevel": 0,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 72,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowLetter",
					"numberFormat": "%2.",
					"restartLevel": 1,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 108,
						"firstLineIndent": -9,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowRoman",
					"numberFormat": "%3.",
					"restartLevel": 2,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 144,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%4.",
					"restartLevel": 3,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 180,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowLetter",
					"numberFormat": "%5.",
					"restartLevel": 4,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 216,
						"firstLineIndent": -9,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowRoman",
					"numberFormat": "%6.",
					"restartLevel": 5,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 252,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%7.",
					"restartLevel": 6,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 288,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowLetter",
					"numberFormat": "%8.",
					"restartLevel": 7,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "#00000000"
					},
					"paragraphFormat": {
						"leftIndent": 324,
						"firstLineIndent": -9,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "LowRoman",
					"numberFormat": "%9.",
					"restartLevel": 8,
					"startAt": 1
				}
			]
		}
	],
	"comments": [],
	"revisions": [],
	"customXml": [],
	"footnotes": {
		"separator": [
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
						"text": "\u0003"
					}
				]
			}
		],
		"continuationSeparator": [
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
						"text": "\u0004"
					}
				]
			}
		],
		"continuationNotice": [
			{
				"paragraphFormat": {
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
						"text": "\u0003"
					}
				]
			}
		],
		"continuationSeparator": [
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
						"text": "\u0004"
					}
				]
			}
		],
		"continuationNotice": [
			{
				"paragraphFormat": {
					"listFormat": {}
				},
				"characterFormat": {},
				"inlines": []
			}
		]
	}
};
describe('Footnote Layout validation', () => {
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
    // it('Footnote with Multiline Layout validation', () => {
    //     console.log('Footnote with Multiline Layout validation');
    //     editor.open(JSON.stringify(data)); let footNote: number = editor.documentHelper.footnoteCollection[0].blocks.length;
    //     let foot: number = editor.documentHelper.pages[0].footnoteWidget.childWidgets.length;
    //     expect(footNote).toBe(4);
    //     expect(foot).toBe(6);
    // });
});

let shapeInTableJson1: any = {
    "sections": [
        {
            "blocks": [
                {
                    "rows": [
                        {
                            "rowFormat": {
                                "allowBreakAcrossPages": true,
                                "isHeader": false,
                                "height": 221.5,
                                "heightType": "AtLeast",
                                "borders": {
                                    "left": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "right": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "top": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "bottom": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "vertical": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "horizontal": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "diagonalDown": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "diagonalUp": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    }
                                }
                            },
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "characterFormat": {
                                                "fontColor": "empty"
                                            },
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "preferredWidth": 233.75,
                                        "preferredWidthType": "Point",
                                        "verticalAlignment": "Top",
                                        "isSamePaddingAsTable": true,
                                        "borders": {
                                            "left": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "right": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "top": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "bottom": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "vertical": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "horizontal": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalDown": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalUp": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            }
                                        },
                                        "cellWidth": 233.75
                                    }
                                },
                                {
                                    "blocks": [
                                        {
                                            "characterFormat": {
                                                "fontColor": "empty"
                                            },
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": [
                                                {
                                                    "shapeId": 1,
                                                    "name": "Text Box 1",
                                                    "alternativeText": null,
                                                    "title": null,
                                                    "visible": true,
                                                    "width": 93.0,
                                                    "height": 86.0,
                                                    "widthScale": 100.0,
                                                    "heightScale": 100.0,
                                                    "lineFormat": {
                                                        "lineFormatType": "Solid",
                                                        "color": "#000000FF",
                                                        "weight": 0.5,
                                                        "lineStyle": "Solid"
                                                    },
                                                    "fillFormat": {
                                                        "color": "#FFFFFFFF",
                                                        "fill": true
                                                    },
                                                    "verticalPosition": 6.0,
                                                    "verticalOrigin": "Paragraph",
                                                    "verticalAlignment": "None",
                                                    "horizontalPosition": 11.6,
                                                    "horizontalOrigin": "Column",
                                                    "horizontalAlignment": "None",
                                                    "zOrderPosition": 251659264,
                                                    "allowOverlap": true,
                                                    "layoutInCell": true,
                                                    "lockAnchor": false,
                                                    "textWrappingStyle": "InFrontOfText",
                                                    "textWrappingType": "Both",
                                                    "distanceBottom": 0.0,
                                                    "distanceLeft": 9.0,
                                                    "distanceRight": 9.0,
                                                    "distanceTop": 0.0,
                                                    "autoShapeType": "Rectangle",
                                                    "textFrame": {
                                                        "textVerticalAlignment": "Top",
                                                        "leftMargin": 7.2,
                                                        "rightMargin": 7.2,
                                                        "topMargin": 3.6,
                                                        "bottomMargin": 3.6,
                                                        "blocks": [
                                                            {
                                                                "characterFormat": {
                                                                    "fontColor": "empty"
                                                                },
                                                                "paragraphFormat": {
                                                                    "styleName": "Normal"
                                                                },
                                                                "inlines": [
                                                                    {
                                                                        "text": "Test",
                                                                        "characterFormat": {
                                                                            "fontColor": "empty"
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                },
                                                {
                                                    "text": "Test",
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    }
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "preferredWidth": 233.75,
                                        "preferredWidthType": "Point",
                                        "verticalAlignment": "Bottom",
                                        "isSamePaddingAsTable": true,
                                        "borders": {
                                            "left": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "right": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "top": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "bottom": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "vertical": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "horizontal": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalDown": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalUp": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            }
                                        },
                                        "cellWidth": 233.75
                                    }
                                }
                            ]
                        },
                        {
                            "rowFormat": {
                                "allowBreakAcrossPages": true,
                                "isHeader": false,
                                "height": 0.0,
                                "heightType": "AtLeast",
                                "borders": {
                                    "left": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "right": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "top": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "bottom": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "vertical": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "horizontal": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "diagonalDown": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "diagonalUp": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    }
                                }
                            },
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "characterFormat": {
                                                "fontColor": "empty"
                                            },
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "preferredWidth": 233.75,
                                        "preferredWidthType": "Point",
                                        "verticalAlignment": "Top",
                                        "isSamePaddingAsTable": true,
                                        "borders": {
                                            "left": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "right": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "top": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "bottom": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "vertical": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "horizontal": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalDown": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalUp": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            }
                                        },
                                        "cellWidth": 233.75
                                    }
                                },
                                {
                                    "blocks": [
                                        {
                                            "characterFormat": {
                                                "fontColor": "empty"
                                            },
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "preferredWidth": 233.75,
                                        "preferredWidthType": "Point",
                                        "verticalAlignment": "Top",
                                        "isSamePaddingAsTable": true,
                                        "borders": {
                                            "left": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "right": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "top": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "bottom": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "vertical": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "horizontal": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalDown": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalUp": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            }
                                        },
                                        "cellWidth": 233.75
                                    }
                                }
                            ]
                        }
                    ],
                    "title": null,
                    "description": null,
                    "tableFormat": {
                        "allowAutoFit": true,
                        "leftIndent": 0.0,
                        "tableAlignment": "Left",
                        "preferredWidthType": "Auto",
                        "borders": {
                            "left": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "right": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "top": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "bottom": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "vertical": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "horizontal": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "diagonalDown": {
                                "lineStyle": "None",
                                "lineWidth": 0.0,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "diagonalUp": {
                                "lineStyle": "None",
                                "lineWidth": 0.0,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            }
                        },
                        "bidi": false,
                        "horizontalPositionAbs": "Left",
                        "horizontalPosition": 0.0
                    }
                },
                {
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                }
            ],
            "headersFooters": {
                "header": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                },
                "footer": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                },
                "evenHeader": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                },
                "evenFooter": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                },
                "firstPageHeader": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                },
                "firstPageFooter": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                }
            },
            "sectionFormat": {
                "headerDistance": 36.0,
                "footerDistance": 36.0,
                "pageWidth": 612.0,
                "pageHeight": 792.0,
                "leftMargin": 72.0,
                "rightMargin": 72.0,
                "topMargin": 72.0,
                "bottomMargin": 72.0,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "bidi": false,
                "restartPageNumbering": false,
                "pageStartingNumber": 0,
                "endnoteNumberFormat": "LowerCaseRoman",
                "footNoteNumberFormat": "Arabic",
                "restartIndexForFootnotes": "DoNotRestart",
                "restartIndexForEndnotes": "DoNotRestart"
            }
        }
    ],
    "characterFormat": {
        "fontSize": 11.0,
        "fontFamily": "Calibri",
        "fontColor": "empty",
        "fontSizeBidi": 11.0,
        "fontFamilyBidi": "Arial"
    },
    "paragraphFormat": {
        "afterSpacing": 8.0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple"
    },
    "background": {
        "color": "#FFFFFFFF"
    },
    "styles": [
        {
            "type": "Paragraph",
            "name": "Normal",
            "next": "Normal",
            "characterFormat": {
                "fontColor": "empty"
            }
        },
        {
            "type": "Character",
            "name": "Default Paragraph Font",
            "characterFormat": {
                "fontColor": "empty"
            }
        }
    ],
    "defaultTabWidth": 36.0,
    "formatting": false,
    "trackChanges": false,
    "protectionType": "NoProtection",
    "enforcement": false,
    "dontUseHTMLParagraphAutoSpacing": false,
    "alignTablesRowByRow": false,
    "formFieldShading": true,
    "footnotes": {
        "separator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0003",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0004",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "inlines": []
            }
        ]
    },
    "endnotes": {
        "separator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0003",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0004",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "inlines": []
            }
        ]
    }
};
let shapeInTableJson2: any = {
    "sections": [
        {
            "blocks": [
                {
                    "rows": [
                        {
                            "rowFormat": {
                                "allowBreakAcrossPages": true,
                                "isHeader": false,
                                "height": 221.5,
                                "heightType": "AtLeast",
                                "borders": {
                                    "left": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "right": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "top": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "bottom": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "vertical": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "horizontal": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "diagonalDown": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "diagonalUp": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    }
                                }
                            },
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "characterFormat": {
                                                "fontColor": "empty"
                                            },
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "preferredWidth": 233.75,
                                        "preferredWidthType": "Point",
                                        "verticalAlignment": "Top",
                                        "isSamePaddingAsTable": true,
                                        "borders": {
                                            "left": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "right": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "top": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "bottom": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "vertical": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "horizontal": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalDown": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalUp": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            }
                                        },
                                        "cellWidth": 233.75
                                    }
                                },
                                {
                                    "blocks": [
                                        {
                                            "characterFormat": {
                                                "fontColor": "empty"
                                            },
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": [
                                                {
                                                    "shapeId": 1,
                                                    "name": "Text Box 1",
                                                    "alternativeText": null,
                                                    "title": null,
                                                    "visible": true,
                                                    "width": 167.0,
                                                    "height": 215.5,
                                                    "widthScale": 100.0,
                                                    "heightScale": 100.0,
                                                    "lineFormat": {
                                                        "lineFormatType": "Solid",
                                                        "color": "#000000FF",
                                                        "weight": 0.5,
                                                        "lineStyle": "Solid"
                                                    },
                                                    "fillFormat": {
                                                        "color": "#FFFFFFFF",
                                                        "fill": true
                                                    },
                                                    "verticalPosition": 48.3,
                                                    "verticalOrigin": "Paragraph",
                                                    "verticalAlignment": "None",
                                                    "horizontalPosition": 15.85,
                                                    "horizontalOrigin": "Column",
                                                    "horizontalAlignment": "None",
                                                    "zOrderPosition": 251659264,
                                                    "allowOverlap": true,
                                                    "layoutInCell": true,
                                                    "lockAnchor": false,
                                                    "textWrappingStyle": "InFrontOfText",
                                                    "textWrappingType": "Both",
                                                    "distanceBottom": 0.0,
                                                    "distanceLeft": 9.0,
                                                    "distanceRight": 9.0,
                                                    "distanceTop": 0.0,
                                                    "autoShapeType": "Rectangle",
                                                    "textFrame": {
                                                        "textVerticalAlignment": "Top",
                                                        "leftMargin": 7.2,
                                                        "rightMargin": 7.2,
                                                        "topMargin": 3.6,
                                                        "bottomMargin": 3.6,
                                                        "blocks": [
                                                            {
                                                                "characterFormat": {
                                                                    "fontColor": "empty"
                                                                },
                                                                "paragraphFormat": {
                                                                    "styleName": "Normal"
                                                                },
                                                                "inlines": [
                                                                    {
                                                                        "text": "Test",
                                                                        "characterFormat": {
                                                                            "fontColor": "empty"
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                },
                                                {
                                                    "text": "Test",
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    }
                                                },
                                                {
                                                    "text": " Adventure Works Cycles, the fictitious company on which the ",
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    }
                                                },
                                                {
                                                    "text": "AdventureWorks",
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    }
                                                },
                                                {
                                                    "text": " sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to ",
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    }
                                                },
                                                {
                                                    "text": "NorthAdventure",
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    }
                                                },
                                                {
                                                    "text": " Works Cycles, the fictitious company on which the ",
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    }
                                                },
                                                {
                                                    "text": "AdventureWorks",
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    }
                                                },
                                                {
                                                    "text": " sample databases are based, is a large",
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    }
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "preferredWidth": 233.75,
                                        "preferredWidthType": "Point",
                                        "verticalAlignment": "Bottom",
                                        "isSamePaddingAsTable": true,
                                        "borders": {
                                            "left": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "right": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "top": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "bottom": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "vertical": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "horizontal": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalDown": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalUp": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            }
                                        },
                                        "cellWidth": 233.75
                                    }
                                }
                            ]
                        },
                        {
                            "rowFormat": {
                                "allowBreakAcrossPages": true,
                                "isHeader": false,
                                "height": 0.0,
                                "heightType": "AtLeast",
                                "borders": {
                                    "left": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "right": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "top": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "bottom": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "vertical": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "horizontal": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "diagonalDown": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "diagonalUp": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    }
                                }
                            },
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "characterFormat": {
                                                "fontColor": "empty"
                                            },
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "preferredWidth": 233.75,
                                        "preferredWidthType": "Point",
                                        "verticalAlignment": "Top",
                                        "isSamePaddingAsTable": true,
                                        "borders": {
                                            "left": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "right": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "top": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "bottom": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "vertical": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "horizontal": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalDown": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalUp": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            }
                                        },
                                        "cellWidth": 233.75
                                    }
                                },
                                {
                                    "blocks": [
                                        {
                                            "characterFormat": {
                                                "fontColor": "empty"
                                            },
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "preferredWidth": 233.75,
                                        "preferredWidthType": "Point",
                                        "verticalAlignment": "Top",
                                        "isSamePaddingAsTable": true,
                                        "borders": {
                                            "left": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "right": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "top": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "bottom": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "vertical": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "horizontal": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalDown": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalUp": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            }
                                        },
                                        "cellWidth": 233.75
                                    }
                                }
                            ]
                        }
                    ],
                    "title": null,
                    "description": null,
                    "tableFormat": {
                        "allowAutoFit": true,
                        "leftIndent": 0.0,
                        "tableAlignment": "Left",
                        "preferredWidthType": "Auto",
                        "borders": {
                            "left": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "right": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "top": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "bottom": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "vertical": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "horizontal": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "diagonalDown": {
                                "lineStyle": "None",
                                "lineWidth": 0.0,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "diagonalUp": {
                                "lineStyle": "None",
                                "lineWidth": 0.0,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            }
                        },
                        "bidi": false,
                        "horizontalPositionAbs": "Left",
                        "horizontalPosition": 0.0
                    }
                },
                {
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                }
            ],
            "headersFooters": {
                "header": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                },
                "footer": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                },
                "evenHeader": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                },
                "evenFooter": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                },
                "firstPageHeader": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                },
                "firstPageFooter": {
                    "blocks": [
                        {
                            "inlines": []
                        }
                    ]
                }
            },
            "sectionFormat": {
                "headerDistance": 36.0,
                "footerDistance": 36.0,
                "pageWidth": 612.0,
                "pageHeight": 792.0,
                "leftMargin": 72.0,
                "rightMargin": 72.0,
                "topMargin": 72.0,
                "bottomMargin": 72.0,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "bidi": false,
                "restartPageNumbering": false,
                "pageStartingNumber": 0,
                "endnoteNumberFormat": "LowerCaseRoman",
                "footNoteNumberFormat": "Arabic",
                "restartIndexForFootnotes": "DoNotRestart",
                "restartIndexForEndnotes": "DoNotRestart"
            }
        }
    ],
    "characterFormat": {
        "fontSize": 11.0,
        "fontFamily": "Calibri",
        "fontColor": "empty",
        "fontSizeBidi": 11.0,
        "fontFamilyBidi": "Arial"
    },
    "paragraphFormat": {
        "afterSpacing": 8.0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple"
    },
    "background": {
        "color": "#FFFFFFFF"
    },
    "styles": [
        {
            "type": "Paragraph",
            "name": "Normal",
            "next": "Normal",
            "characterFormat": {
                "fontColor": "empty"
            }
        },
        {
            "type": "Character",
            "name": "Default Paragraph Font",
            "characterFormat": {
                "fontColor": "empty"
            }
        }
    ],
    "defaultTabWidth": 36.0,
    "formatting": false,
    "trackChanges": false,
    "protectionType": "NoProtection",
    "enforcement": false,
    "dontUseHTMLParagraphAutoSpacing": false,
    "alignTablesRowByRow": false,
    "formFieldShading": true,
    "footnotes": {
        "separator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0003",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0004",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "inlines": []
            }
        ]
    },
    "endnotes": {
        "separator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0003",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0004",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "inlines": []
            }
        ]
    }
};
describe('Shape inside table', () => {
	let editor: DocumentEditor = undefined;
	beforeAll(() => {
		document.body.innerHTML = '';
		let ele: HTMLElement = createElement('div', { id: 'container' });
		document.body.appendChild(ele);
		DocumentEditor.Inject(Selection, Editor, SfdtExport, WordExport);
		editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableWordExport: true, enableSfdtExport: true });
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
	it('Shape inside table vaidation 1', () => {
		editor.open(JSON.stringify(shapeInTableJson1));
		let bodyWidget = editor.documentHelper.pages[0].bodyWidgets[0];
		let cell: TableCellWidget = ((bodyWidget.childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[1] as TableCellWidget;
		expect((cell.childWidgets[0] as ParagraphWidget).y).toBeGreaterThan(268);
		expect((cell.childWidgets[0] as ParagraphWidget).y).toBeLessThan(271);
	});
	it('Shape inside table vaidation 2', () => {
		editor.open(JSON.stringify(shapeInTableJson2));
		let bodyWidget = editor.documentHelper.pages[0].bodyWidgets[0];
		let cell: TableCellWidget = ((bodyWidget.childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[1] as TableCellWidget;
		expect((cell.childWidgets[0] as ParagraphWidget).y).toBeGreaterThan(95);
		expect((cell.childWidgets[0] as ParagraphWidget).y).toBeLessThan(97);
	});
});
let tablefloat: any = {
	"sections": [
		{
			"sectionFormat": {
				"pageWidth": 612,
				"pageHeight": 792,
				"leftMargin": 54,
				"rightMargin": 54,
				"topMargin": 41.04999923706055,
				"bottomMargin": 72,
				"differentFirstPage": false,
				"differentOddAndEvenPages": false,
				"headerDistance": 25.200000762939454,
				"footerDistance": 25.200000762939454,
				"bidi": false,
				"restartPageNumbering": true,
				"pageStartingNumber": 1
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
												"textAlignment": "Justify",
												"lineSpacing": 1.0791666507720948,
												"lineSpacingType": "Multiple",
												"styleName": "Normal",
												"listFormat": {}
											},
											"characterFormat": {
												"fontFamily": "Cambria",
												"fontColor": "#00000000",
												"fontFamilyBidi": "Cambria"
											},
											"inlines": [
												{
													"characterFormat": {
														"bold": true,
														"fontFamily": "Cambria",
														"fontColor": "#00000000",
														"boldBidi": true,
														"fontFamilyBidi": "Cambria"
													},
													"fieldType": 0,
													"hasFieldEnd": true
												},
												{
													"characterFormat": {
														"fontFamily": "Cambria",
														"fontColor": "#00000000",
														"fontFamilyBidi": "Cambria"
													},
													"text": " REF F8 \\h "
												},
												{
													"characterFormat": {},
													"fieldType": 2
												},
												{
													"characterFormat": {
														"fontFamily": "Cambria",
														"fontColor": "#00000000",
														"fontFamilyBidi": "Cambria"
													},
													"text": "Error! "
												},
												{
													"characterFormat": {
														"fontFamily": "Cambria",
														"fontColor": "#00000000",
														"fontFamilyBidi": "Cambria"
													},
													"text": "Reference "
												},
												{
													"characterFormat": {
														"fontFamily": "Cambria",
														"fontColor": "#00000000",
														"fontFamilyBidi": "Cambria"
													},
													"text": "source "
												},
												{
													"characterFormat": {
														"fontFamily": "Cambria",
														"fontColor": "#00000000",
														"fontFamilyBidi": "Cambria"
													},
													"text": "not "
												},
												{
													"characterFormat": {
														"fontFamily": "Cambria",
														"fontColor": "#00000000",
														"fontFamilyBidi": "Cambria"
													},
													"text": "found."
												},
												{
													"characterFormat": {},
													"fieldType": 1
												}
											]
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"color": "#000000FF",
												"hasNoneStyle": false,
												"lineStyle": "Single",
												"lineWidth": 1.5
											},
											"left": {
												"color": "#000000FF",
												"hasNoneStyle": false,
												"lineStyle": "Single",
												"lineWidth": 1.5
											},
											"right": {
												"color": "#000000FF",
												"hasNoneStyle": false,
												"lineStyle": "Single",
												"lineWidth": 1.5
											},
											"bottom": {
												"color": "#000000FF",
												"hasNoneStyle": false,
												"lineStyle": "Single",
												"lineWidth": 1.5
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"preferredWidth": 24.700000762939454,
										"preferredWidthType": "Point",
										"cellWidth": 48.56317,
										"columnSpan": 1,
										"rowSpan": 1,
										"verticalAlignment": "Top"
									},
									"columnIndex": 0
								}
							],
							"rowFormat": {
								"height": 49.95000076293945,
								"allowBreakAcrossPages": true,
								"heightType": "AtLeast",
								"isHeader": false,
								"borders": {
									"top": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"left": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"right": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"bottom": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalDown": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalUp": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"horizontal": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"vertical": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									}
								},
								"gridBefore": 0,
								"gridAfter": 0,
								"leftMargin": 3.6,
								"topMargin": 2.55,
								"rightMargin": 2.85
							}
						}
					],
					"grid": [
						48.56317
					],
					"tableFormat": {
						"borders": {
							"top": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"left": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"right": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"bottom": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"diagonalDown": {
								"hasNoneStyle": false,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"diagonalUp": {
								"hasNoneStyle": false,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"horizontal": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"vertical": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							}
						},
						"shading": {},
						"leftIndent": 0,
						"tableAlignment": "Left",
						"topMargin": 2.549999952316284,
						"rightMargin": 2.8499999046325685,
						"leftMargin": 3.5999999046325685,
						"bottomMargin": 0,
						"preferredWidth": 24.700000762939454,
						"preferredWidthType": "Point",
						"bidi": false,
						"allowAutoFit": true
					},
					"description": null,
					"title": null,
					"columnCount": 1,
					"wrapTextAround": true,
					"positioning": {
						"allowOverlap": false,
						"distanceBottom": 0,
						"distanceLeft": 0,
						"distanceRight": 0,
						"distanceTop": 0,
						"verticalOrigin": "Paragraph",
						"verticalPosition": -3.1,
						"horizontalAlignment": "Left",
						"horizontalOrigin": "Column",
						"horizontalPosition": 28.7
					}
				},
				{
					"paragraphFormat": {
						"rightIndent": 32.54999923706055,
						"textAlignment": "Justify",
						"afterSpacing": 2,
						"lineSpacing": 1.1041666269302369,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Cambria",
						"fontColor": "#00000000",
						"fontFamilyBidi": "Cambria"
					},
					"inlines": []
				},
				{
					"rows": [
						{
							"cells": [
								{
									"blocks": [
										{
											"paragraphFormat": {
												"textAlignment": "Justify",
												"lineSpacing": 1.0791666507720948,
												"lineSpacingType": "Multiple",
												"styleName": "Normal",
												"listFormat": {}
											},
											"characterFormat": {
												"fontFamily": "Cambria",
												"fontColor": "#00000000",
												"fontFamilyBidi": "Cambria"
											},
											"inlines": [
												{
													"characterFormat": {
														"bold": true,
														"fontFamily": "Cambria",
														"fontColor": "#00000000",
														"boldBidi": true,
														"fontFamilyBidi": "Cambria"
													},
													"fieldType": 0,
													"hasFieldEnd": true
												},
												{
													"characterFormat": {
														"fontFamily": "Cambria",
														"fontColor": "#00000000",
														"fontFamilyBidi": "Cambria"
													},
													"text": " REF F9 \\h "
												},
												{
													"characterFormat": {},
													"fieldType": 2
												},
												{
													"characterFormat": {
														"fontFamily": "Cambria",
														"fontColor": "#00000000",
														"fontFamilyBidi": "Cambria"
													},
													"text": "Refere"
												},
												{
													"characterFormat": {
														"fontFamily": "Cambria",
														"fontColor": "#00000000",
														"fontFamilyBidi": "Cambria"
													},
													"text": " "
												},
												{
													"characterFormat": {
														"fontFamily": "Cambria",
														"fontColor": "#00000000",
														"fontFamilyBidi": "Cambria"
													},
													"text": "nce"
												},
												{
													"characterFormat": {
														"fontFamily": "Cambria",
														"fontColor": "#00000000",
														"fontFamilyBidi": "Cambria"
													},
													"text": " "
												},
												{
													"characterFormat": {
														"fontFamily": "Cambria",
														"fontColor": "#00000000",
														"fontFamilyBidi": "Cambria"
													},
													"text": "sourcd"
												},
												{
													"characterFormat": {
														"fontFamily": "Cambria",
														"fontColor": "#00000000",
														"fontFamilyBidi": "Cambria"
													},
													"text": " "
												},
												{
													"characterFormat": {
														"fontFamily": "Cambria",
														"fontColor": "#00000000",
														"fontFamilyBidi": "Cambria"
													},
													"text": "dfdfge"
												},
												{
													"characterFormat": {
														"fontFamily": "Cambria",
														"fontColor": "#00000000",
														"fontFamilyBidi": "Cambria"
													},
													"text": " "
												},
												{
													"characterFormat": {
														"fontFamily": "Cambria",
														"fontColor": "#00000000",
														"fontFamilyBidi": "Cambria"
													},
													"text": "not "
												},
												{
													"characterFormat": {
														"fontFamily": "Cambria",
														"fontColor": "#00000000",
														"fontFamilyBidi": "Cambria"
													},
													"text": "found."
												},
												{
													"characterFormat": {},
													"fieldType": 1
												}
											]
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"color": "#000000FF",
												"hasNoneStyle": false,
												"lineStyle": "Single",
												"lineWidth": 1.5
											},
											"left": {
												"color": "#000000FF",
												"hasNoneStyle": false,
												"lineStyle": "Single",
												"lineWidth": 1.5
											},
											"right": {
												"color": "#000000FF",
												"hasNoneStyle": false,
												"lineStyle": "Single",
												"lineWidth": 1.5
											},
											"bottom": {
												"color": "#000000FF",
												"hasNoneStyle": false,
												"lineStyle": "Single",
												"lineWidth": 1.5
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"preferredWidth": 24.700000762939454,
										"preferredWidthType": "Point",
										"cellWidth": 39.79016,
										"columnSpan": 1,
										"rowSpan": 1,
										"verticalAlignment": "Top"
									},
									"columnIndex": 0
								}
							],
							"rowFormat": {
								"height": 11.75,
								"allowBreakAcrossPages": true,
								"heightType": "AtLeast",
								"isHeader": false,
								"borders": {
									"top": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"left": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"right": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"bottom": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalDown": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalUp": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"horizontal": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"vertical": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									}
								},
								"gridBefore": 0,
								"gridAfter": 0,
								"leftMargin": 3.6,
								"topMargin": 2.55,
								"rightMargin": 2.85
							}
						}
					],
					"grid": [
						39.79016
					],
					"tableFormat": {
						"borders": {
							"top": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"left": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"right": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"bottom": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"diagonalDown": {
								"hasNoneStyle": false,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"diagonalUp": {
								"hasNoneStyle": false,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"horizontal": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"vertical": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							}
						},
						"shading": {},
						"leftIndent": 0,
						"tableAlignment": "Left",
						"topMargin": 2.549999952316284,
						"rightMargin": 2.8499999046325685,
						"leftMargin": 3.5999999046325685,
						"bottomMargin": 0,
						"preferredWidth": 24.700000762939454,
						"preferredWidthType": "Point",
						"bidi": false,
						"allowAutoFit": true
					},
					"description": null,
					"title": null,
					"columnCount": 1,
					"wrapTextAround": true,
					"positioning": {
						"allowOverlap": false,
						"distanceBottom": 0,
						"distanceLeft": 0,
						"distanceRight": 0,
						"distanceTop": 0,
						"verticalOrigin": "Paragraph",
						"verticalPosition": -2.5,
						"horizontalAlignment": "Left",
						"horizontalOrigin": "Column",
						"horizontalPosition": 28.7
					}
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
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": [
								{
									"characterFormat": {},
									"text": "\u000B"
								}
							]
						}
					]
				},
				"footer": {
					"blocks": [
						{
							"paragraphFormat": {
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": [
								{
									"characterFormat": {},
									"text": "\u000B"
								}
							]
						}
					]
				},
				"evenHeader": {
					"blocks": [
						{
							"paragraphFormat": {
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": [
								{
									"characterFormat": {},
									"text": "\u000B"
								}
							]
						}
					]
				},
				"evenFooter": {
					"blocks": [
						{
							"paragraphFormat": {
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": [
								{
									"characterFormat": {},
									"text": "\u000B"
								}
							]
						}
					]
				},
				"firstPageHeader": {
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
				"firstPageFooter": {
					"blocks": [
						{
							"paragraphFormat": {
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": []
						}
					]
				}
			}
		}
	],
	"characterFormat": {
		"bold": false,
		"italic": false,
		"fontSize": 12,
		"fontFamily": "Arial",
		"underline": "None",
		"strikethrough": "None",
		"baselineAlignment": "Normal",
		"highlightColor": "NoColor",
		"fontColor": "empty",
		"boldBidi": false,
		"italicBidi": false,
		"fontSizeBidi": 12,
		"fontFamilyBidi": "Arial",
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
	"defaultTabWidth": 35.400001525878909,
	"trackChanges": false,
	"enforcement": false,
	"hashValue": "",
	"saltValue": "",
	"formatting": false,
	"protectionType": "NoProtection",
	"dontUseHTMLParagraphAutoSpacing": false,
	"formFieldShading": true,
	"compatibilityMode": 1,
	"styles": [
		{
			"name": "Normal",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"next": "Normal"
		},
		{
			"name": "Heading 1",
			"type": "Paragraph",
			"paragraphFormat": {
				"outlineLevel": "Level1",
				"listFormat": {},
				"keepWithNext": true
			},
			"characterFormat": {
				"bold": true,
				"fontFamily": "Arial",
				"fontColor": "#00000000",
				"boldBidi": true,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Normal",
			"link": "Heading 1 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 1 Char",
			"type": "Character",
			"characterFormat": {
				"bold": true,
				"fontSize": 10,
				"fontColor": "empty",
				"boldBidi": true,
				"fontSizeBidi": 10
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Default Paragraph Font",
			"type": "Character",
			"characterFormat": {
				"fontColor": "empty"
			}
		},
		{
			"name": "Heading 2",
			"type": "Paragraph",
			"paragraphFormat": {
				"outlineLevel": "Level2",
				"listFormat": {},
				"keepWithNext": true
			},
			"characterFormat": {
				"bold": true,
				"fontFamily": "Arial",
				"boldBidi": true,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Normal",
			"link": "Heading 2 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 2 Char",
			"type": "Character",
			"characterFormat": {
				"bold": true,
				"fontSize": 10,
				"fontColor": "#000000FF",
				"boldBidi": true,
				"fontSizeBidi": 10
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "DPSAR11BOLDCENTER",
			"type": "Paragraph",
			"paragraphFormat": {
				"textAlignment": "Center",
				"listFormat": {}
			},
			"characterFormat": {
				"bold": true,
				"fontSize": 11,
				"fontColor": "#000000FF",
				"boldBidi": true,
				"fontSizeBidi": 11
			},
			"link": "DPSAR11BOLDCENTERCar",
			"next": "DPSAR11BOLDCENTER"
		},
		{
			"name": "DPSAR11BOLDCENTERCar",
			"type": "Character",
			"characterFormat": {
				"bold": true,
				"fontSize": 11,
				"fontFamily": "Arial",
				"fontColor": "#000000FF",
				"boldBidi": true,
				"fontSizeBidi": 11,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "DPSAR11LISTNUMBERUPPERCASE",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 11,
				"fontColor": "#000000FF",
				"fontSizeBidi": 11
			},
			"link": "DPSAR11LISTNUMBERUPPERCASECar",
			"next": "DPSAR11LISTNUMBERUPPERCASE"
		},
		{
			"name": "DPSAR11LISTNUMBERUPPERCASECar",
			"type": "Character",
			"characterFormat": {
				"fontSize": 11,
				"fontFamily": "Arial",
				"fontColor": "#000000FF",
				"fontSizeBidi": 11,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "DPSTM10Column2",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"link": "DPSTM10Column2Car",
			"next": "DPSTM10Column2"
		},
		{
			"name": "DPSTM10Column2Car",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "DPSTMR10Column2",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"link": "DPSTMR10Column2Car",
			"next": "DPSTMR10Column2"
		},
		{
			"name": "DPSTMR10Column2Car",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "DPSTNR1011",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"link": "DPSTNR1011Car",
			"next": "DPSTNR1011"
		},
		{
			"name": "DPSTNR1011Car",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "DPSTNR1011pt",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 11,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 11,
				"fontFamilyBidi": "Times New Roman"
			},
			"link": "DPSTNR1011ptCar",
			"next": "DPSTNR1011pt"
		},
		{
			"name": "DPSTNR1011ptCar",
			"type": "Character",
			"characterFormat": {
				"fontSize": 11,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 11,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "DPSTNR10RIGHT",
			"type": "Paragraph",
			"paragraphFormat": {
				"textAlignment": "Right",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"link": "DPSTNR10RIGHTCar",
			"next": "DPSTNR10RIGHT"
		},
		{
			"name": "DPSTNR10RIGHTCar",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "DPSTNR10UPPERCASE",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman",
				"allCaps": true
			},
			"link": "DPSTNR10UPPERCASECar",
			"next": "DPSTNR10UPPERCASE"
		},
		{
			"name": "DPSTNR10UPPERCASECar",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman",
				"allCaps": true
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "DPSTNR11",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"link": "DPSTNR11Car",
			"next": "DPSTNR11"
		},
		{
			"name": "DPSTNR11Car",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "DPSTNR12",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontFamilyBidi": "Times New Roman"
			},
			"link": "DPSTNR12Car",
			"next": "DPSTNR12"
		},
		{
			"name": "DPSTNR12Car",
			"type": "Character",
			"characterFormat": {
				"fontSize": 12,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "DPSTNR8",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 8,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 8,
				"fontFamilyBidi": "Times New Roman"
			},
			"link": "DPSTNR8Car",
			"next": "DPSTNR8"
		},
		{
			"name": "DPSTNR8Car",
			"type": "Character",
			"characterFormat": {
				"fontSize": 8,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 8,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "DPSTNR8ArialnarrowArialNarrow8pt",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 7,
				"fontFamily": "Arial Narrow",
				"fontColor": "#000000FF",
				"fontSizeBidi": 7,
				"fontFamilyBidi": "Arial Narrow"
			},
			"link": "DPSTNR8ArialnarrowArialNarrow8ptCar",
			"next": "DPSTNR8ArialnarrowArialNarrow8pt"
		},
		{
			"name": "DPSTNR8ArialnarrowArialNarrow8ptCar",
			"type": "Character",
			"characterFormat": {
				"fontSize": 7,
				"fontFamily": "Arial Narrow",
				"fontColor": "#000000FF",
				"fontSizeBidi": 7,
				"fontFamilyBidi": "Arial Narrow"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "DPSTNR8BoldCentered",
			"type": "Paragraph",
			"paragraphFormat": {
				"textAlignment": "Center",
				"listFormat": {}
			},
			"characterFormat": {
				"bold": true,
				"fontSize": 8,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"boldBidi": true,
				"fontSizeBidi": 8,
				"fontFamilyBidi": "Times New Roman"
			},
			"link": "DPSTNR8BoldCenteredCar",
			"next": "DPSTNR8BoldCentered"
		},
		{
			"name": "DPSTNR8BoldCenteredCar",
			"type": "Character",
			"characterFormat": {
				"bold": true,
				"fontSize": 8,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"boldBidi": true,
				"fontSizeBidi": 8,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "heading1",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontFamilyBidi": "Times New Roman"
			},
			"link": "heading1Car",
			"next": "heading1"
		},
		{
			"name": "heading1Car",
			"type": "Character",
			"characterFormat": {
				"fontSize": 12,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "TableText",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontFamilyBidi": "Times New Roman"
			},
			"link": "TableTextCar",
			"next": "TableText"
		},
		{
			"name": "TableTextCar",
			"type": "Character",
			"characterFormat": {
				"fontSize": 12,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Placeholder Text",
			"type": "Character",
			"characterFormat": {
				"fontColor": "#808080FF"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Header",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {},
				"tabs": [
					{
						"position": 234,
						"deletePosition": 0,
						"tabJustification": "Center",
						"tabLeader": "None"
					},
					{
						"position": 468,
						"deletePosition": 0,
						"tabJustification": "Right",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"link": "Header Char",
			"next": "Header"
		},
		{
			"name": "Header Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Footer",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {},
				"tabs": [
					{
						"position": 234,
						"deletePosition": 0,
						"tabJustification": "Center",
						"tabLeader": "None"
					},
					{
						"position": 468,
						"deletePosition": 0,
						"tabJustification": "Right",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"link": "Footer Char",
			"next": "Footer"
		},
		{
			"name": "Footer Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "DPSTNR10B01",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {
					"listId": 0
				}
			},
			"characterFormat": {},
			"basedOn": "DPSTNR10",
			"next": "DPSTNR10B01"
		},
		{
			"name": "DPSTNR10",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"link": "DPSTNR10Car",
			"next": "DPSTNR10"
		},
		{
			"name": "DPSTNR10Car",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "DPSTNR10B02",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 36,
				"firstLineIndent": -36,
				"listFormat": {},
				"tabs": [
					{
						"position": 36,
						"deletePosition": 0,
						"tabJustification": "List",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {},
			"basedOn": "DPSTNR10",
			"next": "DPSTNR10B02"
		},
		{
			"name": "DPSTNR10B03",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 36,
				"firstLineIndent": -36,
				"listFormat": {},
				"tabs": [
					{
						"position": 36,
						"deletePosition": 0,
						"tabJustification": "List",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {},
			"basedOn": "DPSTNR10",
			"next": "DPSTNR10B03"
		},
		{
			"name": "DPSTNR10B04",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 36,
				"firstLineIndent": -36,
				"listFormat": {},
				"tabs": [
					{
						"position": 36,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 72,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 108,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 144,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 180,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 216,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 252,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 288,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 324,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 360,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 396,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 432,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 468,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {},
			"basedOn": "DPSTNR10",
			"next": "DPSTNR10B04"
		},
		{
			"name": "DPSTNR10LISTNUMBER",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 36,
				"firstLineIndent": -36,
				"listFormat": {},
				"tabs": [
					{
						"position": 36,
						"deletePosition": 0,
						"tabJustification": "List",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"next": "DPSTNR10LISTNUMBER"
		},
		{
			"name": "DPSTNR10LIST",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 36,
				"firstLineIndent": -36,
				"afterSpacing": 0,
				"listFormat": {},
				"tabs": [
					{
						"position": 36,
						"deletePosition": 0,
						"tabJustification": "List",
						"tabLeader": "None"
					},
					{
						"position": 432,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 468,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {},
			"basedOn": "List Continue",
			"next": "DPSTNR10LIST"
		},
		{
			"name": "List Continue",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 14.149999618530274,
				"afterSpacing": 6,
				"listFormat": {}
			},
			"characterFormat": {},
			"basedOn": "DPSTNR10",
			"next": "List Continue"
		},
		{
			"name": "DPSTNR10Column2",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontColor": "empty"
			},
			"next": "DPSTNR10Column2"
		},
		{
			"name": "DPSTNR10LISTLETTER",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 36,
				"firstLineIndent": -36,
				"listFormat": {},
				"tabs": [
					{
						"position": 36,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 72,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 108,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 144,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 180,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 216,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 252,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 288,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 324,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 360,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 396,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 432,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"next": "DPSTNR10LISTLETTER"
		},
		{
			"name": "Signature",
			"type": "Paragraph",
			"paragraphFormat": {
				"afterSpacing": 6,
				"listFormat": {}
			},
			"characterFormat": {
				"bold": true,
				"fontSize": 30,
				"fontFamily": "Script",
				"fontColor": "empty",
				"boldBidi": true,
				"fontSizeBidi": 30,
				"fontFamilyBidi": "Script"
			},
			"next": "Signature"
		},
		{
			"name": "Balloon Text",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 8,
				"fontFamily": "Tahoma",
				"fontSizeBidi": 8,
				"fontFamilyBidi": "Tahoma"
			},
			"basedOn": "Normal",
			"link": "Balloon Text Char",
			"next": "Balloon Text"
		},
		{
			"name": "Balloon Text Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 8,
				"fontFamily": "Tahoma",
				"fontColor": "empty",
				"fontSizeBidi": 8,
				"fontFamilyBidi": "Tahoma"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Salutation",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"link": "Salutation Char",
			"next": "Normal"
		},
		{
			"name": "Salutation Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "List Paragraph",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 36,
				"afterSpacing": 8,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"listFormat": {},
				"contextualSpacing": true
			},
			"characterFormat": {
				"fontSize": 11,
				"fontFamily": "Calibri",
				"fontColor": "#00000000",
				"fontSizeBidi": 11,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Normal",
			"next": "List Paragraph"
		},
		{
			"name": "Hyperlink",
			"type": "Character",
			"characterFormat": {
				"underline": "Single",
				"fontColor": "#0563C1FF"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "DPSCOURRIERCar",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Calibri",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "DPSCOURRIER",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Calibri",
				"fontColor": "#000000FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Calibri"
			},
			"link": "DPSCOURRIERCar",
			"next": "DPSCOURRIER"
		},
		{
			"name": "NormalSubCar",
			"type": "Character",
			"characterFormat": {
				"fontColor": "empty"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "TOC 1",
			"type": "Paragraph",
			"paragraphFormat": {
				"afterSpacing": 5,
				"lineSpacing": 1.1999999284744263,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontColor": "#000000FF",
				"fontSizeBidi": 10
			},
			"next": "TOC 1"
		},
		{
			"name": "H1",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 12,
				"listFormat": {},
				"tabs": [
					{
						"position": 36,
						"deletePosition": 0,
						"tabJustification": "List",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {
				"fontSize": 16,
				"fontColor": "#000000FF",
				"fontSizeBidi": 16
			},
			"next": "H1"
		},
		{
			"name": "TOC 2",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 11.050000190734864,
				"afterSpacing": 5,
				"lineSpacing": 1.1999999284744263,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontColor": "#000000FF",
				"fontSizeBidi": 10
			},
			"next": "TOC 2"
		},
		{
			"name": "H2",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 36,
				"firstLineIndent": 0,
				"beforeSpacing": 2,
				"listFormat": {
					"listId": 8,
					"listLevelNumber": 1
				}
			},
			"characterFormat": {
				"fontSize": 13,
				"fontColor": "#000000FF",
				"fontSizeBidi": 13
			},
			"next": "H2"
		},
		{
			"name": "TOC 3",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 22.100000381469728,
				"afterSpacing": 5,
				"lineSpacing": 1.1999999284744263,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontColor": "#000000FF",
				"fontSizeBidi": 10
			},
			"next": "TOC 3"
		},
		{
			"name": "H3",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 72,
				"firstLineIndent": 0,
				"beforeSpacing": 2,
				"listFormat": {
					"listId": 8,
					"listLevelNumber": 2
				}
			},
			"characterFormat": {
				"fontColor": "#000000FF"
			},
			"next": "H3"
		},
		{
			"name": "TOC 4",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 32.900001525878909,
				"afterSpacing": 5,
				"lineSpacing": 1.1999999284744263,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontColor": "#000000FF",
				"fontSizeBidi": 10
			},
			"next": "TOC 4"
		},
		{
			"name": "H4",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 108,
				"firstLineIndent": 0,
				"beforeSpacing": 2,
				"listFormat": {
					"listId": 8,
					"listLevelNumber": 3
				}
			},
			"characterFormat": {
				"fontColor": "#000000FF"
			},
			"next": "H4"
		},
		{
			"name": "TOC 5",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 43.95000076293945,
				"afterSpacing": 5,
				"lineSpacing": 1.1999999284744263,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontColor": "#000000FF",
				"fontSizeBidi": 10
			},
			"next": "TOC 5"
		},
		{
			"name": "H5",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 144,
				"firstLineIndent": 0,
				"beforeSpacing": 2,
				"listFormat": {
					"listId": 8,
					"listLevelNumber": 4
				}
			},
			"characterFormat": {
				"fontColor": "#000000FF"
			},
			"next": "H5"
		},
		{
			"name": "TOC 6",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 55,
				"afterSpacing": 5,
				"lineSpacing": 1.1999999284744263,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontColor": "#000000FF",
				"fontSizeBidi": 10
			},
			"next": "TOC 6"
		},
		{
			"name": "H6",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 180,
				"firstLineIndent": 0,
				"beforeSpacing": 2,
				"listFormat": {
					"listId": 8,
					"listLevelNumber": 5
				}
			},
			"characterFormat": {
				"fontColor": "#000000FF"
			},
			"next": "H6"
		},
		{
			"name": "TOC 7",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 66.05000305175781,
				"afterSpacing": 5,
				"lineSpacing": 1.1999999284744263,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontColor": "#000000FF",
				"fontSizeBidi": 10
			},
			"next": "TOC 7"
		},
		{
			"name": "H7",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 216.0500030517578,
				"firstLineIndent": 0,
				"beforeSpacing": 2,
				"listFormat": {
					"listId": 8,
					"listLevelNumber": 6
				}
			},
			"characterFormat": {
				"fontColor": "#000000FF"
			},
			"next": "H7"
		},
		{
			"name": "TOC 8",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 77.0999984741211,
				"afterSpacing": 5,
				"lineSpacing": 1.1999999284744263,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontColor": "#000000FF",
				"fontSizeBidi": 10
			},
			"next": "TOC 8"
		},
		{
			"name": "H8",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 252.0500030517578,
				"firstLineIndent": 0,
				"beforeSpacing": 2,
				"listFormat": {
					"listId": 8,
					"listLevelNumber": 7
				}
			},
			"characterFormat": {
				"fontColor": "#000000FF"
			},
			"next": "H8"
		},
		{
			"name": "TOC 9",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 87.9000015258789,
				"afterSpacing": 5,
				"lineSpacing": 1.1999999284744263,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontColor": "#000000FF",
				"fontSizeBidi": 10
			},
			"next": "TOC 9"
		},
		{
			"name": "H9",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 288.04998779296877,
				"firstLineIndent": 0,
				"beforeSpacing": 2,
				"listFormat": {
					"listId": 8,
					"listLevelNumber": 8
				}
			},
			"characterFormat": {
				"fontColor": "#000000FF"
			},
			"next": "H9"
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
	"lists": [
		{
			"abstractListId": 0,
			"levelOverrides": [],
			"listId": 0
		},
		{
			"abstractListId": 0,
			"levelOverrides": [
				{
					"levelNumber": 0,
					"startAt": 1
				},
				{
					"levelNumber": 1,
					"startAt": 1
				},
				{
					"levelNumber": 2,
					"startAt": 1
				},
				{
					"levelNumber": 3,
					"startAt": 1
				},
				{
					"levelNumber": 4,
					"startAt": 1
				},
				{
					"levelNumber": 5,
					"startAt": 1
				},
				{
					"levelNumber": 6,
					"startAt": 1
				},
				{
					"levelNumber": 7,
					"startAt": 1
				},
				{
					"levelNumber": 8,
					"startAt": 1
				}
			],
			"listId": 8
		}
	],
	"abstractLists": [
		{
			"abstractListId": 0,
			"levels": [
				{
					"characterFormat": {
						"fontColor": "empty"
					},
					"paragraphFormat": {
						"leftIndent": 36,
						"firstLineIndent": -36,
						"listFormat": {},
						"tabs": [
							{
								"position": 36,
								"deletePosition": 0,
								"tabJustification": "List",
								"tabLeader": "None"
							}
						]
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%1.",
					"restartLevel": 0,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "empty"
					},
					"paragraphFormat": {
						"leftIndent": 72,
						"firstLineIndent": -36,
						"listFormat": {},
						"tabs": [
							{
								"position": 72,
								"deletePosition": 0,
								"tabJustification": "List",
								"tabLeader": "None"
							}
						]
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%2.",
					"restartLevel": 1,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "empty"
					},
					"paragraphFormat": {
						"leftIndent": 108,
						"firstLineIndent": -36,
						"listFormat": {},
						"tabs": [
							{
								"position": 108,
								"deletePosition": 0,
								"tabJustification": "List",
								"tabLeader": "None"
							}
						]
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%3.",
					"restartLevel": 2,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "empty"
					},
					"paragraphFormat": {
						"leftIndent": 144,
						"firstLineIndent": -36,
						"listFormat": {},
						"tabs": [
							{
								"position": 144,
								"deletePosition": 0,
								"tabJustification": "List",
								"tabLeader": "None"
							}
						]
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%4.",
					"restartLevel": 3,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "empty"
					},
					"paragraphFormat": {
						"leftIndent": 180,
						"firstLineIndent": -36,
						"listFormat": {},
						"tabs": [
							{
								"position": 180,
								"deletePosition": 0,
								"tabJustification": "List",
								"tabLeader": "None"
							}
						]
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%5.",
					"restartLevel": 4,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "empty"
					},
					"paragraphFormat": {
						"leftIndent": 216,
						"firstLineIndent": -36,
						"listFormat": {},
						"tabs": [
							{
								"position": 216,
								"deletePosition": 0,
								"tabJustification": "List",
								"tabLeader": "None"
							}
						]
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%6.",
					"restartLevel": 5,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "empty"
					},
					"paragraphFormat": {
						"leftIndent": 252,
						"firstLineIndent": -36,
						"listFormat": {},
						"tabs": [
							{
								"position": 252,
								"deletePosition": 0,
								"tabJustification": "List",
								"tabLeader": "None"
							}
						]
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%7.",
					"restartLevel": 6,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "empty"
					},
					"paragraphFormat": {
						"leftIndent": 288,
						"firstLineIndent": -36,
						"listFormat": {},
						"tabs": [
							{
								"position": 288,
								"deletePosition": 0,
								"tabJustification": "List",
								"tabLeader": "None"
							}
						]
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%8.",
					"restartLevel": 7,
					"startAt": 1
				},
				{
					"characterFormat": {
						"fontColor": "empty"
					},
					"paragraphFormat": {
						"leftIndent": 324,
						"firstLineIndent": -36,
						"listFormat": {},
						"tabs": [
							{
								"position": 324,
								"deletePosition": 0,
								"tabJustification": "List",
								"tabLeader": "None"
							}
						]
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Arabic",
					"numberFormat": "%9.",
					"restartLevel": 8,
					"startAt": 1
				}
			]
		}
	],
	"comments": [],
	"revisions": [],
	"customXml": [],
	"footnotes": {
		"separator": [
			{
				"paragraphFormat": {
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
					"listFormat": {}
				},
				"characterFormat": {},
				"inlines": []
			}
		]
	}
}
describe('table with wrap style Validation', () => {
	let editor: DocumentEditor = undefined;
	beforeAll(() => {
		document.body.innerHTML = '';
		let ele: HTMLElement = createElement('div', { id: 'container' });
		document.body.appendChild(ele);
		DocumentEditor.Inject(Selection, Editor, SfdtExport, WordExport);
		editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableWordExport: true, enableSfdtExport: true });
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
	it('multiple floating table validation', () => {
        let isoverlap: boolean = false;
		editor.open(JSON.stringify(tablefloat));
		let bodyWidget = editor.documentHelper.pages[0].bodyWidgets[0];
		let floatTable1: TableWidget = bodyWidget.childWidgets[0] as TableWidget;
        let width: number = floatTable1.getTableCellWidth();
        let floatTable2: TableWidget = bodyWidget.childWidgets[2] as TableWidget;
        if (floatTable1.x + width < floatTable2.x) {
            isoverlap = true;
        }
		expect(isoverlap).toBe(true);
	});
});
let paraCheck: any = {
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
						"beforeSpacing": 12,
						"afterSpacing": 0,
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
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						}
					]
				},
				{
					"paragraphFormat": {
						"beforeSpacing": 12,
						"afterSpacing": 0,
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
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						}
					]
				},
				{
					"paragraphFormat": {
						"beforeSpacing": 12,
						"afterSpacing": 0,
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
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						}
					]
				},
				{
					"paragraphFormat": {
						"beforeSpacing": 12,
						"afterSpacing": 0,
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
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						}
					]
				},
				{
					"paragraphFormat": {
						"beforeSpacing": 12,
						"afterSpacing": 0,
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
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						}
					]
				},
				{
					"paragraphFormat": {
						"beforeSpacing": 12,
						"afterSpacing": 0,
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
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						}
					]
				},
				{
					"paragraphFormat": {
						"beforeSpacing": 12,
						"afterSpacing": 0,
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
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello "
						}
					]
				},
				{
					"paragraphFormat": {
						"beforeSpacing": 12,
						"afterSpacing": 0,
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontColor": "empty"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"beforeSpacing": 12,
						"afterSpacing": 0,
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
							"text": "world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						}
					]
				},
				{
					"paragraphFormat": {
						"beforeSpacing": 12,
						"afterSpacing": 0,
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
							"text": "Hello world"
						}
					]
				},
				{
					"paragraphFormat": {
						"beforeSpacing": 12,
						"afterSpacing": 0,
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
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						}
					]
				},
				{
					"paragraphFormat": {
						"beforeSpacing": 12,
						"afterSpacing": 0,
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
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontColor": "empty"
							},
							"text": "Hello world"
						}
					]
				},
				{
					"paragraphFormat": {
						"beforeSpacing": 12,
						"afterSpacing": 0,
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontColor": "empty"
					},
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
				"evenHeader": {
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
				"evenFooter": {
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
				"firstPageHeader": {
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
				"firstPageFooter": {
					"blocks": [
						{
							"paragraphFormat": {
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": []
						}
					]
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
		"afterSpacing": 8,
		"lineSpacing": 1.0791666507720948,
		"lineSpacingType": "Multiple",
		"listFormat": {},
		"bidi": false,
		"keepLinesTogether": false,
		"keepWithNext": false
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
	"compatibilityMode": 3,
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
			"name": "Default Paragraph Font",
			"type": "Character",
			"characterFormat": {
				"fontColor": "empty"
			}
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
						"text": "\u0003"
					}
				]
			}
		],
		"continuationSeparator": [
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
						"text": "\u0004"
					}
				]
			}
		],
		"continuationNotice": [
			{
				"paragraphFormat": {
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
						"text": "\u0003"
					}
				]
			}
		],
		"continuationSeparator": [
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
						"text": "\u0004"
					}
				]
			}
		],
		"continuationNotice": [
			{
				"paragraphFormat": {
					"listFormat": {}
				},
				"characterFormat": {},
				"inlines": []
			}
		]
	}
}
describe('Paragraph Before Spacing Behaviour', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, SfdtExport, WordExport);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableWordExport: true, enableSfdtExport: true });
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
    it('Paragraph Behaviour Validation', () => {
        editor.open(JSON.stringify(paraCheck));
        let bodyWidget1 = editor.documentHelper.pages[1].bodyWidgets[0];
        expect((bodyWidget1.childWidgets[0] as ParagraphWidget).paragraphFormat.beforeSpacing).not.toBe(0);
        expect(((bodyWidget1.childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0].margin.top).toBe(0);
    });
});

let nestedTable: any = {
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
                    "rows": [
                        {
                            "cells": [
                                {
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
                                                                    "characterFormat": {
                                                                        "fontColor": "empty"
                                                                    },
                                                                    "inlines": []
                                                                }
                                                            ],
                                                            "cellFormat": {
                                                                "borders": {
                                                                    "top": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "left": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "right": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "bottom": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "diagonalDown": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "diagonalUp": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "horizontal": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "vertical": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    }
                                                                },
                                                                "shading": {},
                                                                "preferredWidth": 111.19999694824219,
                                                                "preferredWidthType": "Point",
                                                                "cellWidth": 111.19999694824219,
                                                                "columnSpan": 1,
                                                                "rowSpan": 1,
                                                                "verticalAlignment": "Top"
                                                            },
                                                            "columnIndex": 0
                                                        },
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
                                                                    "inlines": []
                                                                }
                                                            ],
                                                            "cellFormat": {
                                                                "borders": {
                                                                    "top": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "left": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "right": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "bottom": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "diagonalDown": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "diagonalUp": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "horizontal": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "vertical": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    }
                                                                },
                                                                "shading": {},
                                                                "preferredWidth": 111.25,
                                                                "preferredWidthType": "Point",
                                                                "cellWidth": 111.25,
                                                                "columnSpan": 1,
                                                                "rowSpan": 1,
                                                                "verticalAlignment": "Top"
                                                            },
                                                            "columnIndex": 1
                                                        }
                                                    ],
                                                    "rowFormat": {
                                                        "height": 1,
                                                        "allowBreakAcrossPages": true,
                                                        "heightType": "AtLeast",
                                                        "isHeader": false,
                                                        "borders": {
                                                            "top": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "left": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "right": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "bottom": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "diagonalDown": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "diagonalUp": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "horizontal": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "vertical": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            }
                                                        },
                                                        "gridBefore": 0,
                                                        "gridAfter": 0
                                                    }
                                                },
                                                {
                                                    "cells": [
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
                                                                    "inlines": []
                                                                }
                                                            ],
                                                            "cellFormat": {
                                                                "borders": {
                                                                    "top": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "left": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "right": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "bottom": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "diagonalDown": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "diagonalUp": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "horizontal": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "vertical": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    }
                                                                },
                                                                "shading": {},
                                                                "preferredWidth": 111.19999694824219,
                                                                "preferredWidthType": "Point",
                                                                "cellWidth": 111.19999694824219,
                                                                "columnSpan": 1,
                                                                "rowSpan": 1,
                                                                "verticalAlignment": "Top"
                                                            },
                                                            "columnIndex": 0
                                                        },
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
                                                                    "inlines": []
                                                                }
                                                            ],
                                                            "cellFormat": {
                                                                "borders": {
                                                                    "top": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "left": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "right": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "bottom": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "diagonalDown": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "diagonalUp": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "horizontal": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    },
                                                                    "vertical": {
                                                                        "hasNoneStyle": false,
                                                                        "lineStyle": "None",
                                                                        "lineWidth": 0
                                                                    }
                                                                },
                                                                "shading": {},
                                                                "preferredWidth": 111.25,
                                                                "preferredWidthType": "Point",
                                                                "cellWidth": 111.25,
                                                                "columnSpan": 1,
                                                                "rowSpan": 1,
                                                                "verticalAlignment": "Top"
                                                            },
                                                            "columnIndex": 1
                                                        }
                                                    ],
                                                    "rowFormat": {
                                                        "height": 1,
                                                        "allowBreakAcrossPages": true,
                                                        "heightType": "AtLeast",
                                                        "isHeader": false,
                                                        "borders": {
                                                            "top": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "left": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "right": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "bottom": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "diagonalDown": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "diagonalUp": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "horizontal": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "vertical": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            }
                                                        },
                                                        "gridBefore": 0,
                                                        "gridAfter": 0
                                                    }
                                                }
                                            ],
                                            "grid": [
                                                111.19999694824219,
                                                111.25
                                            ],
                                            "tableFormat": {
                                                "borders": {
                                                    "top": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Single",
                                                        "lineWidth": 0.5
                                                    },
                                                    "left": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Single",
                                                        "lineWidth": 0.5
                                                    },
                                                    "right": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Single",
                                                        "lineWidth": 0.5
                                                    },
                                                    "bottom": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Single",
                                                        "lineWidth": 0.5
                                                    },
                                                    "diagonalDown": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "None",
                                                        "lineWidth": 0
                                                    },
                                                    "diagonalUp": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "None",
                                                        "lineWidth": 0
                                                    },
                                                    "horizontal": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Single",
                                                        "lineWidth": 0.5
                                                    },
                                                    "vertical": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Single",
                                                        "lineWidth": 0.5
                                                    }
                                                },
                                                "shading": {},
                                                "leftIndent": 0,
                                                "tableAlignment": "Left",
                                                "topMargin": 0,
                                                "rightMargin": 5.4,
                                                "leftMargin": 5.4,
                                                "bottomMargin": 0,
                                                "preferredWidthType": "Auto",
                                                "bidi": false,
                                                "allowAutoFit": true
                                            },
                                            "description": null,
                                            "title": null,
                                            "columnCount": 2
                                        },
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {
                                                "fontColor": "empty"
                                            },
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 233.75,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 233.75,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 0
                                },
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
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 233.75,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 233.75,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 1
                                }
                            ],
                            "rowFormat": {
                                "height": 1,
                                "allowBreakAcrossPages": true,
                                "heightType": "AtLeast",
                                "isHeader": false,
                                "borders": {
                                    "top": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "left": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "right": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "bottom": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "diagonalDown": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "diagonalUp": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "horizontal": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "vertical": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    }
                                },
                                "gridBefore": 0,
                                "gridAfter": 0
                            }
                        },
                        {
                            "cells": [
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
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 233.75,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 233.75,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 0
                                },
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
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 233.75,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 233.75,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 1
                                }
                            ],
                            "rowFormat": {
                                "height": 1,
                                "allowBreakAcrossPages": true,
                                "heightType": "AtLeast",
                                "isHeader": false,
                                "borders": {
                                    "top": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "left": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "right": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "bottom": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "diagonalDown": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "diagonalUp": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "horizontal": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "vertical": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    }
                                },
                                "gridBefore": 0,
                                "gridAfter": 0
                            }
                        }
                    ],
                    "grid": [
                        233.75,
                        233.75
                    ],
                    "tableFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 0.5
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 0.5
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 0.5
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 0.5
                            },
                            "diagonalDown": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "diagonalUp": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 0.5
                            },
                            "vertical": {
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 0.5
                            }
                        },
                        "shading": {},
                        "leftIndent": 0,
                        "tableAlignment": "Left",
                        "topMargin": 0,
                        "rightMargin": 5.4,
                        "leftMargin": 5.4,
                        "bottomMargin": 0,
                        "preferredWidthType": "Auto",
                        "bidi": false,
                        "allowAutoFit": true
                    },
                    "description": null,
                    "title": null,
                    "columnCount": 2
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontColor": "empty"
                    },
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
                "evenHeader": {
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
                "evenFooter": {
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
                "firstPageHeader": {
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
                "firstPageFooter": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "characterFormat": {},
                            "inlines": []
                        }
                    ]
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
    "compatibilityMode": 3,
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
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {
                "fontColor": "empty"
            }
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
                        "text": "\u0003"
                    }
                ]
            }
        ],
        "continuationSeparator": [
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
                        "text": "\u0004"
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "paragraphFormat": {
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
                        "text": "\u0003"
                    }
                ]
            }
        ],
        "continuationSeparator": [
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
                        "text": "\u0004"
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "paragraphFormat": {
                    "listFormat": {}
                },
                "characterFormat": {},
                "inlines": []
            }
        ]
    }
};

describe('Table cell last empty paragraph layout', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, SfdtExport, WordExport);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableWordExport: true, enableSfdtExport: true });
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
    it('Last empty Paragraph next to nested table Validation', () => {
        editor.open(JSON.stringify(nestedTable));
        let table: TableWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        let lastPara: ParagraphWidget = ((table.childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[1] as ParagraphWidget;
        expect(lastPara.height).toBe(0);
        expect((lastPara.childWidgets[0] as LineWidget).height).toBe(0);
    });
});

let cellBorder: any = {
    "sections": [
        {
            "sectionFormat": {
                "pageWidth": 595.2999877929688,
                "pageHeight": 841.9000244140625,
                "leftMargin": 36,
                "rightMargin": 36,
                "topMargin": 36,
                "bottomMargin": 36,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "headerDistance": 36,
                "footerDistance": 36,
                "bidi": false
            },
            "blocks": [
                {
                    "paragraphFormat": {
                        "leftIndent": 0,
                        "rightIndent": 0,
                        "firstLineIndent": 0,
                        "textAlignment": "Left",
                        "beforeSpacing": 0,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "BodyText",
                        "listFormat": {},
                        "bidi": false,
                        "keepLinesTogether": false,
                        "keepWithNext": false,
                        "contextualSpacing": false
                    },
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "fontSize": 11,
                        "fontFamily": "Calibri",
                        "strikethrough": "None",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "boldBidi": false,
                        "italicBidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Calibri",
                        "allCaps": false
                    },
                    "inlines": []
                },
                {
                    "rows": [
                        {
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "leftIndent": 0,
                                                "rightIndent": -59.849998474121094,
                                                "firstLineIndent": 0,
                                                "textAlignment": "Left",
                                                "beforeSpacing": 0,
                                                "afterSpacing": 0,
                                                "lineSpacing": 1,
                                                "lineSpacingType": "Multiple",
                                                "styleName": "Normal",
                                                "outlineLevel": "BodyText",
                                                "listFormat": {},
                                                "bidi": false,
                                                "keepLinesTogether": false,
                                                "keepWithNext": false,
                                                "contextualSpacing": false
                                            },
                                            "characterFormat": {
                                                "bold": true,
                                                "italic": false,
                                                "fontSize": 11,
                                                "fontFamily": "Calibri",
                                                "strikethrough": "None",
                                                "fontColor": "#000000FF",
                                                "bidi": false,
                                                "boldBidi": true,
                                                "italicBidi": false,
                                                "fontSizeBidi": 11,
                                                "fontFamilyBidi": "Calibri",
                                                "allCaps": false
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "italic": false,
                                                        "fontSize": 11,
                                                        "fontFamily": "Calibri CE",
                                                        "strikethrough": "None",
                                                        "fontColor": "#000000FF",
                                                        "bidi": false,
                                                        "boldBidi": true,
                                                        "italicBidi": false,
                                                        "fontSizeBidi": 11,
                                                        "fontFamilyBidi": "Calibri CE",
                                                        "allCaps": false
                                                    },
                                                    "text": "Na życzenie Klienta wykonano:"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "color": "#000000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5
                                            },
                                            "left": {
                                                "color": "#000000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5
                                            },
                                            "right": {
                                                "color": "#000000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5
                                            },
                                            "bottom": {
                                                "color": "#000000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": true,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": true,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            }
                                        },
                                        "shading": {
                                            "backgroundColor": "empty",
                                            "foregroundColor": "empty",
                                            "textureStyle": "TextureNone"
                                        },
                                        "topMargin": 0,
                                        "rightMargin": 5.400000095367432,
                                        "leftMargin": 5.400000095367432,
                                        "bottomMargin": 0,
                                        "preferredWidth": 464.6499938964844,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 464.6499938964844,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Center"
                                    },
                                    "columnIndex": 1
                                }
                            ],
                            "rowFormat": {
                                "height": 1,
                                "allowBreakAcrossPages": true,
                                "heightType": "AtLeast",
                                "isHeader": false,
                                "borders": {
                                    "top": {
                                        "color": "#000000FF",
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "left": {
                                        "color": "#000000FF",
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "right": {
                                        "color": "#000000FF",
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "bottom": {
                                        "color": "#000000FF",
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "diagonalDown": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "diagonalUp": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "horizontal": {
                                        "color": "#000000FF",
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "vertical": {
                                        "color": "#000000FF",
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    }
                                },
                                "gridBefore": 1,
                                "gridBeforeWidth": 6.349999904632568,
                                "gridBeforeWidthType": "Point",
                                "gridAfter": 0,
                                "leftMargin": 5.4,
                                "topMargin": 0,
                                "rightMargin": 5.4,
                                "bottomMargin": 0,
                                "leftIndent": 4.95
                            }
                        },
                        {
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "leftIndent": 0,
                                                "rightIndent": 0,
                                                "firstLineIndent": 0,
                                                "textAlignment": "Left",
                                                "beforeSpacing": 0,
                                                "afterSpacing": 0,
                                                "lineSpacing": 1,
                                                "lineSpacingType": "Multiple",
                                                "styleName": "Normal",
                                                "outlineLevel": "BodyText",
                                                "listFormat": {},
                                                "bidi": false,
                                                "keepLinesTogether": false,
                                                "keepWithNext": false,
                                                "contextualSpacing": false
                                            },
                                            "characterFormat": {
                                                "bold": false,
                                                "italic": false,
                                                "fontSize": 11,
                                                "fontFamily": "Calibri",
                                                "strikethrough": "None",
                                                "fontColor": "#00000000",
                                                "bidi": false,
                                                "boldBidi": false,
                                                "italicBidi": false,
                                                "fontSizeBidi": 11,
                                                "fontFamilyBidi": "Calibri",
                                                "allCaps": false
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "bold": false,
                                                        "italic": false,
                                                        "fontSize": 11,
                                                        "fontFamily": "Calibri",
                                                        "strikethrough": "None",
                                                        "fontColor": "#00000000",
                                                        "bidi": false,
                                                        "boldBidi": false,
                                                        "italicBidi": false,
                                                        "fontSizeBidi": 11,
                                                        "fontFamilyBidi": "Calibri",
                                                        "allCaps": false
                                                    },
                                                    "text": "sd"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "Cleared",
                                                "lineWidth": 0.5
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "Cleared",
                                                "lineWidth": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "Cleared",
                                                "lineWidth": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "Cleared",
                                                "lineWidth": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": true,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": true,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            }
                                        },
                                        "shading": {
                                            "backgroundColor": "empty",
                                            "foregroundColor": "empty",
                                            "textureStyle": "TextureNone"
                                        },
                                        "topMargin": 0,
                                        "rightMargin": 5.400000095367432,
                                        "leftMargin": 5.400000095367432,
                                        "bottomMargin": 0,
                                        "preferredWidth": 522.4500122070312,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 522.4500122070312,
                                        "columnSpan": 3,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Center"
                                    },
                                    "columnIndex": 0
                                }
                            ],
                            "rowFormat": {
                                "height": 1,
                                "allowBreakAcrossPages": true,
                                "heightType": "AtLeast",
                                "isHeader": false,
                                "borders": {
                                    "top": {
                                        "color": "#000000FF",
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "left": {
                                        "color": "#000000FF",
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "right": {
                                        "color": "#000000FF",
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "bottom": {
                                        "color": "#000000FF",
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "diagonalDown": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "diagonalUp": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "horizontal": {
                                        "color": "#000000FF",
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "vertical": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0
                                    }
                                },
                                "gridBefore": 0,
                                "gridAfter": 0,
                                "leftMargin": 5.4,
                                "topMargin": 0,
                                "rightMargin": 5.4,
                                "bottomMargin": 0,
                                "leftIndent": 4.95
                            }
                        }
                    ],
                    "grid": [
                        6.300167092270025,
                        461.00356613146846,
                        51.04625475996513
                    ],
                    "tableFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "diagonalDown": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "diagonalUp": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "vertical": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0
                            }
                        },
                        "shading": {},
                        "leftIndent": 4.949999809265137,
                        "tableAlignment": "Left",
                        "topMargin": 0,
                        "rightMargin": 5.400000095367432,
                        "leftMargin": 5.400000095367432,
                        "bottomMargin": 0,
                        "preferredWidthType": "Auto",
                        "bidi": false,
                        "allowAutoFit": true
                    },
                    "description": null,
                    "title": null,
                    "columnCount": 3
                },
                {
                    "paragraphFormat": {
                        "leftIndent": 0,
                        "rightIndent": 0,
                        "firstLineIndent": 0,
                        "textAlignment": "Left",
                        "beforeSpacing": 0,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "BodyText",
                        "listFormat": {},
                        "bidi": false,
                        "keepLinesTogether": false,
                        "keepWithNext": false,
                        "contextualSpacing": false
                    },
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "fontSize": 11,
                        "fontFamily": "Calibri",
                        "strikethrough": "None",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "boldBidi": false,
                        "italicBidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Calibri",
                        "allCaps": false
                    },
                    "inlines": []
                }
            ],
            "headersFooters": {
                "header": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "leftIndent": 0,
                                "rightIndent": 0,
                                "firstLineIndent": 0,
                                "textAlignment": "Right",
                                "beforeSpacing": 0,
                                "afterSpacing": 0,
                                "lineSpacing": 1,
                                "lineSpacingType": "Multiple",
                                "styleName": "Normal",
                                "outlineLevel": "BodyText",
                                "listFormat": {},
                                "bidi": false,
                                "keepLinesTogether": false,
                                "keepWithNext": false,
                                "contextualSpacing": false
                            },
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "fontSize": 11,
                                "fontFamily": "Calibri",
                                "strikethrough": "None",
                                "fontColor": "#00000000",
                                "bidi": false,
                                "boldBidi": false,
                                "italicBidi": false,
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Calibri",
                                "allCaps": false
                            },
                            "inlines": []
                        },
                        {
                            "paragraphFormat": {
                                "leftIndent": 0,
                                "rightIndent": 0,
                                "firstLineIndent": 0,
                                "textAlignment": "Right",
                                "beforeSpacing": 0,
                                "afterSpacing": 0,
                                "lineSpacing": 1,
                                "lineSpacingType": "Multiple",
                                "styleName": "Normal",
                                "outlineLevel": "BodyText",
                                "listFormat": {},
                                "bidi": false,
                                "keepLinesTogether": false,
                                "keepWithNext": false,
                                "contextualSpacing": false
                            },
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "fontSize": 11,
                                "fontFamily": "Calibri",
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "highlightColor": "NoColor",
                                "fontColor": "#00000000",
                                "bidi": false,
                                "boldBidi": false,
                                "italicBidi": false,
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Calibri",
                                "allCaps": false
                            },
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
                "evenHeader": {
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
                "evenFooter": {
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
                "firstPageHeader": {
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
                "firstPageFooter": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "characterFormat": {},
                            "inlines": []
                        }
                    ]
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
    "compatibilityMode": 1,
    "styles": [
        {
            "name": "Normal",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "textAlignment": "Left",
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {}
            },
            "characterFormat": {
                "bold": false,
                "italic": false,
                "fontSize": 11,
                "fontFamily": "Calibri",
                "strikethrough": "None",
                "fontColor": "#00000000",
                "bidi": false,
                "boldBidi": false,
                "italicBidi": false,
                "fontSizeBidi": 11,
                "fontFamilyBidi": "Calibri",
                "allCaps": false
            },
            "next": "Normal"
        },
        {
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {
                "fontColor": "empty"
            }
        },
        {
            "name": "line number",
            "type": "Character",
            "characterFormat": {
                "bold": false,
                "italic": false,
                "fontSize": 11,
                "strikethrough": "None",
                "fontColor": "#00000000",
                "bidi": false,
                "boldBidi": false,
                "italicBidi": false,
                "fontSizeBidi": 11,
                "allCaps": false
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Hyperlink",
            "type": "Character",
            "characterFormat": {
                "bold": false,
                "italic": false,
                "fontSize": 11,
                "underline": "Single",
                "strikethrough": "None",
                "fontColor": "#0000FFFF",
                "bidi": false,
                "boldBidi": false,
                "italicBidi": false,
                "fontSizeBidi": 11,
                "allCaps": false
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Header",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "textAlignment": "Left",
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {},
                "tabs": [
                    {
                        "position": 234,
                        "deletePosition": 0,
                        "tabJustification": "Center",
                        "tabLeader": "None"
                    },
                    {
                        "position": 468,
                        "deletePosition": 0,
                        "tabJustification": "Right",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {
                "bold": false,
                "italic": false,
                "fontSize": 11,
                "fontFamily": "Calibri",
                "strikethrough": "None",
                "fontColor": "#00000000",
                "bidi": false,
                "boldBidi": false,
                "italicBidi": false,
                "fontSizeBidi": 11,
                "fontFamilyBidi": "Calibri",
                "allCaps": false
            },
            "basedOn": "Normal",
            "next": "Header"
        },
        {
            "name": "Header Char",
            "type": "Character",
            "characterFormat": {
                "bold": false,
                "italic": false,
                "fontFamily": "Calibri",
                "strikethrough": "None",
                "fontColor": "#00000000",
                "bidi": false,
                "boldBidi": false,
                "italicBidi": false,
                "fontFamilyBidi": "Calibri",
                "allCaps": false
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Footer",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "textAlignment": "Left",
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {},
                "tabs": [
                    {
                        "position": 234,
                        "deletePosition": 0,
                        "tabJustification": "Center",
                        "tabLeader": "None"
                    },
                    {
                        "position": 468,
                        "deletePosition": 0,
                        "tabJustification": "Right",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {
                "bold": false,
                "italic": false,
                "fontSize": 11,
                "fontFamily": "Calibri",
                "strikethrough": "None",
                "fontColor": "#00000000",
                "bidi": false,
                "boldBidi": false,
                "italicBidi": false,
                "fontSizeBidi": 11,
                "fontFamilyBidi": "Calibri",
                "allCaps": false
            },
            "basedOn": "Normal",
            "next": "Footer"
        },
        {
            "name": "Footer Char",
            "type": "Character",
            "characterFormat": {
                "bold": false,
                "italic": false,
                "fontFamily": "Calibri",
                "strikethrough": "None",
                "fontColor": "#00000000",
                "bidi": false,
                "boldBidi": false,
                "italicBidi": false,
                "fontFamilyBidi": "Calibri",
                "allCaps": false
            },
            "basedOn": "Default Paragraph Font"
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
                        "text": "\u0003"
                    }
                ]
            }
        ],
        "continuationSeparator": [
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
                        "text": "\u0004"
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "paragraphFormat": {
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
                        "text": "\u0003"
                    }
                ]
            }
        ],
        "continuationSeparator": [
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
                        "text": "\u0004"
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "paragraphFormat": {
                    "listFormat": {}
                },
                "characterFormat": {},
                "inlines": []
            }
        ]
    }
};

describe('Merged cells table cell border', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, SfdtExport, WordExport);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableWordExport: true, enableSfdtExport: true });
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
    it('Cell Top Border validation', () => {
        editor.open(JSON.stringify(cellBorder));
        let table: TableWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as TableWidget;
        let cell: TableCellWidget = (table.childWidgets[1] as TableRowWidget).childWidgets[0] as TableCellWidget;
        expect(cell.updatedTopBorders.length).toBe(3);
    });
});
let tab: any = {
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
                        "textAlignment": "Justify",
                        "lineSpacing": 1.1041666269302369,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontFamily": "Cambria",
                        "fontColor": "#00000000",
                        "fontFamilyBidi": "Cambria"
                    },
                    "inlines": []
                },
                {
                    "rows": [
                        {
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "textAlignment": "Justify",
                                                "lineSpacing": 1.0791666507720948,
                                                "lineSpacingType": "Multiple",
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {
                                                "fontFamily": "Cambria",
                                                "fontColor": "#00000000",
                                                "fontFamilyBidi": "Cambria"
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontFamily": "Cambria",
                                                        "fontColor": "#00000000",
                                                        "boldBidi": true,
                                                        "fontFamilyBidi": "Cambria"
                                                    },
                                                    "fieldType": 0,
                                                    "hasFieldEnd": true
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontFamily": "Cambria",
                                                        "fontColor": "#00000000",
                                                        "fontFamilyBidi": "Cambria"
                                                    },
                                                    "text": " REF F8 \\h "
                                                },
                                                {
                                                    "characterFormat": {},
                                                    "fieldType": 2
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontFamily": "Cambria",
                                                        "fontColor": "#00000000",
                                                        "fontFamilyBidi": "Cambria"
                                                    },
                                                    "text": "Error! "
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontFamily": "Cambria",
                                                        "fontColor": "#00000000",
                                                        "fontFamilyBidi": "Cambria"
                                                    },
                                                    "text": "Reference "
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontFamily": "Cambria",
                                                        "fontColor": "#00000000",
                                                        "fontFamilyBidi": "Cambria"
                                                    },
                                                    "text": "source "
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontFamily": "Cambria",
                                                        "fontColor": "#00000000",
                                                        "fontFamilyBidi": "Cambria"
                                                    },
                                                    "text": "not "
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontFamily": "Cambria",
                                                        "fontColor": "#00000000",
                                                        "fontFamilyBidi": "Cambria"
                                                    },
                                                    "text": "found."
                                                },
                                                {
                                                    "characterFormat": {},
                                                    "fieldType": 1
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "color": "#000000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 1.5
                                            },
                                            "left": {
                                                "color": "#000000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 1.5
                                            },
                                            "right": {
                                                "color": "#000000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 1.5
                                            },
                                            "bottom": {
                                                "color": "#000000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 1.5
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 24.700000762939454,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 49.349998474121097,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 0
                                }
                            ],
                            "rowFormat": {
                                "height": 11.75,
                                "allowBreakAcrossPages": true,
                                "heightType": "AtLeast",
                                "isHeader": false,
                                "borders": {
                                    "top": {
                                        "hasNoneStyle": true,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "left": {
                                        "hasNoneStyle": true,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "right": {
                                        "hasNoneStyle": true,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "bottom": {
                                        "hasNoneStyle": true,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "diagonalDown": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "diagonalUp": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "horizontal": {
                                        "hasNoneStyle": true,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "vertical": {
                                        "hasNoneStyle": true,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    }
                                },
                                "gridBefore": 0,
                                "gridAfter": 0,
                                "leftMargin": 3.6,
                                "topMargin": 2.55,
                                "rightMargin": 2.85
                            }
                        }
                    ],
                    "grid": [
                        24.700000762939454
                    ],
                    "tableFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": true,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "left": {
                                "hasNoneStyle": true,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "right": {
                                "hasNoneStyle": true,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "bottom": {
                                "hasNoneStyle": true,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "diagonalDown": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "diagonalUp": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": true,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "vertical": {
                                "hasNoneStyle": true,
                                "lineStyle": "None",
                                "lineWidth": 0
                            }
                        },
                        "shading": {},
                        "leftIndent": 0,
                        "tableAlignment": "Left",
                        "topMargin": 2.549999952316284,
                        "rightMargin": 2.8499999046325685,
                        "leftMargin": 3.5999999046325685,
                        "bottomMargin": 0,
                        "preferredWidth": 24.700000762939454,
                        "preferredWidthType": "Point",
                        "bidi": false,
                        "allowAutoFit": true
                    },
                    "description": null,
                    "title": null,
                    "columnCount": 1,
                    "wrapTextAround": true,
                    "positioning": {
                        "allowOverlap": false,
                        "distanceBottom": 0,
                        "distanceLeft": 0,
                        "distanceRight": 0,
                        "distanceTop": 0,
                        "verticalOrigin": "Paragraph",
                        "verticalPosition": -3.1,
                        "horizontalAlignment": "Left",
                        "horizontalOrigin": "Column",
                        "horizontalPosition": 28.7
                    }
                },
                {
                    "paragraphFormat": {
                        "leftIndent": 63,
                        "rightIndent": 32.54999923706055,
                        "textAlignment": "Justify",
                        "afterSpacing": 2,
                        "lineSpacing": 1.1041666269302369,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontFamily": "Cambria",
                        "fontColor": "#00000000",
                        "fontFamilyBidi": "Cambria"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "("
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "1) "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "I "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "hereby "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "certify "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "that "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "the "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "odometer "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "reading "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "reflects "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "the "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "amount "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "of "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "mileage "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "in "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "excess "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "of"
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": " "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "its "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "mechanical "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "limits."
                        }
                    ]
                },
                {
                    "rows": [
                        {
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "textAlignment": "Justify",
                                                "lineSpacing": 1.0791666507720948,
                                                "lineSpacingType": "Multiple",
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {
                                                "fontFamily": "Cambria",
                                                "fontColor": "#00000000",
                                                "fontFamilyBidi": "Cambria"
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontFamily": "Cambria",
                                                        "fontColor": "#00000000",
                                                        "boldBidi": true,
                                                        "fontFamilyBidi": "Cambria"
                                                    },
                                                    "fieldType": 0,
                                                    "hasFieldEnd": true
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontFamily": "Cambria",
                                                        "fontColor": "#00000000",
                                                        "fontFamilyBidi": "Cambria"
                                                    },
                                                    "text": " REF F9 \\h "
                                                },
                                                {
                                                    "characterFormat": {},
                                                    "fieldType": 2
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontFamily": "Cambria",
                                                        "fontColor": "#00000000",
                                                        "fontFamilyBidi": "Cambria"
                                                    },
                                                    "text": "Error! "
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontFamily": "Cambria",
                                                        "fontColor": "#00000000",
                                                        "fontFamilyBidi": "Cambria"
                                                    },
                                                    "text": "Reference "
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontFamily": "Cambria",
                                                        "fontColor": "#00000000",
                                                        "fontFamilyBidi": "Cambria"
                                                    },
                                                    "text": "source "
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontFamily": "Cambria",
                                                        "fontColor": "#00000000",
                                                        "fontFamilyBidi": "Cambria"
                                                    },
                                                    "text": "not "
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontFamily": "Cambria",
                                                        "fontColor": "#00000000",
                                                        "fontFamilyBidi": "Cambria"
                                                    },
                                                    "text": "found."
                                                },
                                                {
                                                    "characterFormat": {},
                                                    "fieldType": 1
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "color": "#000000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 1.5
                                            },
                                            "left": {
                                                "color": "#000000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 1.5
                                            },
                                            "right": {
                                                "color": "#000000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 1.5
                                            },
                                            "bottom": {
                                                "color": "#000000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 1.5
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 24.700000762939454,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 49.349998474121097,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 0
                                }
                            ],
                            "rowFormat": {
                                "height": 11.75,
                                "allowBreakAcrossPages": true,
                                "heightType": "AtLeast",
                                "isHeader": false,
                                "borders": {
                                    "top": {
                                        "hasNoneStyle": true,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "left": {
                                        "hasNoneStyle": true,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "right": {
                                        "hasNoneStyle": true,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "bottom": {
                                        "hasNoneStyle": true,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "diagonalDown": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "diagonalUp": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "horizontal": {
                                        "hasNoneStyle": true,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "vertical": {
                                        "hasNoneStyle": true,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    }
                                },
                                "gridBefore": 0,
                                "gridAfter": 0,
                                "leftMargin": 3.6,
                                "topMargin": 2.55,
                                "rightMargin": 2.85
                            }
                        }
                    ],
                    "grid": [
                        24.700000762939454
                    ],
                    "tableFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": true,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "left": {
                                "hasNoneStyle": true,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "right": {
                                "hasNoneStyle": true,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "bottom": {
                                "hasNoneStyle": true,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "diagonalDown": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "diagonalUp": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": true,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "vertical": {
                                "hasNoneStyle": true,
                                "lineStyle": "None",
                                "lineWidth": 0
                            }
                        },
                        "shading": {},
                        "leftIndent": 0,
                        "tableAlignment": "Left",
                        "topMargin": 2.549999952316284,
                        "rightMargin": 2.8499999046325685,
                        "leftMargin": 3.5999999046325685,
                        "bottomMargin": 0,
                        "preferredWidth": 24.700000762939454,
                        "preferredWidthType": "Point",
                        "bidi": false,
                        "allowAutoFit": true
                    },
                    "description": null,
                    "title": null,
                    "columnCount": 1,
                    "wrapTextAround": true,
                    "positioning": {
                        "allowOverlap": false,
                        "distanceBottom": 0,
                        "distanceLeft": 0,
                        "distanceRight": 0,
                        "distanceTop": 0,
                        "verticalOrigin": "Paragraph",
                        "verticalPosition": -2.5,
                        "horizontalAlignment": "Left",
                        "horizontalOrigin": "Column",
                        "horizontalPosition": 28.7
                    }
                },
                {
                    "paragraphFormat": {
                        "leftIndent": 54,
                        "firstLineIndent": 9,
                        "lineSpacing": 2.5,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontSize": 8,
                        "fontFamily": "Cambria",
                        "fontColor": "#00000000",
                        "fontSizeBidi": 8,
                        "fontFamilyBidi": "Cambria"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "("
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontSizeBidi": 9,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "2) I hereby certify that the odometer reading is not the actual mileage"
                        },
                        {
                            "characterFormat": {
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": ". "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "boldBidi": true,
                                "fontSizeBidi": 8,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "WARNING – "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "boldBidi": true,
                                "fontSizeBidi": 8,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "ODOMETER "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "boldBidi": true,
                                "fontSizeBidi": 8,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "D"
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 8,
                                "fontFamily": "Cambria",
                                "fontColor": "#00000000",
                                "boldBidi": true,
                                "fontSizeBidi": 8,
                                "fontFamilyBidi": "Cambria"
                            },
                            "text": "ISCREPENCY"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "rightIndent": 26.549999237060548,
                        "lineSpacing": 1.0958333015441895,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontSize": 4,
                        "fontFamily": "Cambria",
                        "fontColor": "#00000000",
                        "fontSizeBidi": 4,
                        "fontFamilyBidi": "Cambria"
                    },
                    "inlines": []
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
                "evenHeader": {
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
                "evenFooter": {
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
                "firstPageHeader": {
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
                "firstPageFooter": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "characterFormat": {},
                            "inlines": []
                        }
                    ]
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
        "afterSpacing": 8,
        "lineSpacing": 1.0791666507720948,
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
    "compatibilityMode": 3,
    "styles": [
        {
            "name": "Normal",
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
            "next": "Normal"
        },
        {
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {
                "fontColor": "empty"
            }
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
                    "listFormat": {}
                },
                "characterFormat": {},
                "inlines": []
            }
        ]
    }
}
describe('Split text after float table validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, SfdtExport, WordExport);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableWordExport: true, enableSfdtExport: true });
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
    it('Split text after float table validation', () => {
        editor.open(JSON.stringify(tab));
        let table: ElementBox = ((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[4] as ParagraphWidget).childWidgets[1] as LineWidget).children[0];
        expect(table.padding.left).not.toBe(0);
    });
});
describe('FootNote order validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, SfdtExport, WordExport);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableWordExport: true, enableSfdtExport: true });
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
    it('FootNote order validation', () => {
        editor.openBlank();
        editor.editor.insertText('Hello World');
        editor.editor.onEnter();
        editor.editor.insertText('Hello World Test');
        editor.selection.moveToPreviousCharacter();
        editor.selection.moveToPreviousCharacter();
        editor.selection.moveToPreviousCharacter();
        editor.editor.insertFootnote();
        editor.editor.insertText('Test');
        editor.selection.select('0;0;7','0;0;7');
        editor.editor.insertFootnote();
        let line: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((line.children[1] as FootnoteElementBox).text).toBe('1');
        line = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((line.children[1] as FootnoteElementBox).text).toBe('2');
    });
});

let tableAlign: any = {
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
                                            "characterFormat": {
                                                "bold": true,
                                                "fontFamily": "Arial",
                                                "fontColor": "empty",
                                                "boldBidi": true,
                                                "fontFamilyBidi": "Arial"
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontFamily": "Arial",
                                                        "fontColor": "empty",
                                                        "boldBidi": true,
                                                        "fontFamilyBidi": "Arial"
                                                    },
                                                    "text": "Number"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 85.5,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 85.5,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 0
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {
                                                "bold": true,
                                                "fontFamily": "Arial",
                                                "fontColor": "empty",
                                                "boldBidi": true,
                                                "fontFamilyBidi": "Arial"
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontFamily": "Arial",
                                                        "fontColor": "empty",
                                                        "boldBidi": true,
                                                        "fontFamilyBidi": "Arial"
                                                    },
                                                    "text": "Description"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 193.5,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 193.5,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 1
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {
                                                "bold": true,
                                                "fontFamily": "Arial",
                                                "fontColor": "empty",
                                                "boldBidi": true,
                                                "fontFamilyBidi": "Arial"
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontFamily": "Arial",
                                                        "fontColor": "empty",
                                                        "boldBidi": true,
                                                        "fontFamilyBidi": "Arial"
                                                    },
                                                    "text": "Data Sent"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 85.5,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 85.5,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 2
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {
                                                "bold": true,
                                                "fontFamily": "Arial",
                                                "fontColor": "empty",
                                                "boldBidi": true,
                                                "fontFamilyBidi": "Arial"
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontFamily": "Arial",
                                                        "fontColor": "empty",
                                                        "boldBidi": true,
                                                        "fontFamilyBidi": "Arial"
                                                    },
                                                    "text": "Data Required"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 90,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 90,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 3
                                }
                            ],
                            "rowFormat": {
                                "height": 1,
                                "allowBreakAcrossPages": true,
                                "heightType": "AtLeast",
                                "isHeader": false,
                                "borders": {
                                    "top": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "left": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "right": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "bottom": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "diagonalDown": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "diagonalUp": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "horizontal": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "vertical": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    }
                                },
                                "gridBefore": 0,
                                "gridAfter": 0,
                                "leftMargin": 5.4,
                                "rightMargin": 5.4,
                                "leftIndent": 5.4
                            }
                        },
                        {
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {
                                                "fontFamily": "Arial",
                                                "fontColor": "empty",
                                                "fontFamilyBidi": "Arial"
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "fontFamily": "Arial",
                                                        "fontColor": "empty",
                                                        "fontFamilyBidi": "Arial"
                                                    },
                                                    "text": "001"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidthType": "Auto",
                                        "cellWidth": 85.5,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 0
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {
                                                "fontFamily": "Arial",
                                                "fontColor": "empty",
                                                "fontFamilyBidi": "Arial"
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "fontFamily": "Arial",
                                                        "fontColor": "empty",
                                                        "fontFamilyBidi": "Arial"
                                                    },
                                                    "text": "2Test Concrete strength for footings"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidthType": "Auto",
                                        "cellWidth": 193.5,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 1
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {
                                                "fontFamily": "Arial",
                                                "fontColor": "empty",
                                                "fontFamilyBidi": "Arial"
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "fontFamily": "Arial",
                                                        "fontColor": "empty",
                                                        "fontFamilyBidi": "Arial"
                                                    },
                                                    "text": "9/23/2008"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidthType": "Auto",
                                        "cellWidth": 85.5,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 2
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {
                                                "fontFamily": "Arial",
                                                "fontColor": "empty",
                                                "fontFamilyBidi": "Arial"
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "fontFamily": "Arial",
                                                        "fontColor": "empty",
                                                        "fontFamilyBidi": "Arial"
                                                    },
                                                    "text": "9/29/2008"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidthType": "Auto",
                                        "cellWidth": 90,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 3
                                }
                            ],
                            "rowFormat": {
                                "height": 1,
                                "allowBreakAcrossPages": true,
                                "heightType": "AtLeast",
                                "isHeader": false,
                                "borders": {
                                    "top": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "left": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "right": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "bottom": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "diagonalDown": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "diagonalUp": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0
                                    },
                                    "horizontal": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    },
                                    "vertical": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5
                                    }
                                },
                                "gridBefore": 0,
                                "gridAfter": 0,
                                "leftMargin": 5.4,
                                "rightMargin": 5.4,
                                "leftIndent": 5.4
                            }
                        }
                    ],
                    "grid": [
                        85.5,
                        193.5,
                        85.5,
                        90
                    ],
                    "tableFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 0.5
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 0.5
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 0.5
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 0.5
                            },
                            "diagonalDown": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "diagonalUp": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 0.5
                            },
                            "vertical": {
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 0.5
                            }
                        },
                        "shading": {},
                        "leftIndent": 5.400000095367432,
                        "tableAlignment": "Left",
                        "topMargin": 0,
                        "rightMargin": 5.400000095367432,
                        "leftMargin": 5.400000095367432,
                        "bottomMargin": 0,
                        "preferredWidthType": "Auto",
                        "bidi": false,
                        "allowAutoFit": false
                    },
                    "description": null,
                    "title": null,
                    "columnCount": 4
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "empty",
                        "fontFamilyBidi": "Arial"
                    },
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
                "evenHeader": {
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
                "evenFooter": {
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
                "firstPageHeader": {
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
                "firstPageFooter": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "characterFormat": {},
                            "inlines": []
                        }
                    ]
                }
            }
        }
    ],
    "characterFormat": {
        "bold": false,
        "italic": false,
        "fontSize": 11,
        "fontFamily": "Times New Roman",
        "underline": "None",
        "strikethrough": "None",
        "baselineAlignment": "Normal",
        "highlightColor": "NoColor",
        "fontColor": "empty",
        "boldBidi": false,
        "italicBidi": false,
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Times New Roman",
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
    "dontUseHTMLParagraphAutoSpacing": true,
    "formFieldShading": true,
    "compatibilityMode": 1,
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
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {
                "fontColor": "empty"
            }
        },
        {
            "name": "Document Map",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {}
            },
            "characterFormat": {
                "fontFamily": "Tahoma",
                "fontColor": "empty",
                "fontFamilyBidi": "Tahoma"
            },
            "basedOn": "Normal",
            "next": "Document Map"
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
                        "text": "\u0003"
                    }
                ]
            }
        ],
        "continuationSeparator": [
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
                        "text": "\u0004"
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "paragraphFormat": {
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
                        "text": "\u0003"
                    }
                ]
            }
        ],
        "continuationSeparator": [
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
                        "text": "\u0004"
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "paragraphFormat": {
                    "listFormat": {}
                },
                "characterFormat": {},
                "inlines": []
            }
        ]
    }
};

describe('Table Align Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, SfdtExport, WordExport);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableWordExport: true, enableSfdtExport: true });
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
    it('Table Align Validation', () => {
        editor.open(JSON.stringify(tableAlign));
        let table: TableWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        let cell1: TableCellWidget = (table.childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget;
        let cell2: TableCellWidget = (table.childWidgets[1] as TableRowWidget).childWidgets[0] as TableCellWidget;
        expect(cell1.width).toBe(cell2.width);
    });
});
describe('RTL character format validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, SfdtExport, WordExport);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableWordExport: true, enableSfdtExport: true });
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
    it('RTL character format validation', () => {
        editor.openBlank();
        editor.editor.insertText('شلاؤي شلاؤي شلا');
        editor.selection.select('0;0;6', '0;0;11');
        editor.selection.toggleBold();
        editor.selection.toggleHighlightColor();
        let para: ParagraphWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget;
        let line: LineWidget = para.childWidgets[0] as LineWidget;
        expect(line.children[1].characterFormat.bold).toBe(true);
        expect(line.children[1].characterFormat.highlightColor).toBe('Yellow');
        expect(line.children[0].characterFormat.bold).toBe(false);
        expect(line.children[0].characterFormat.highlightColor).toBe('NoColor');
        expect(line.children[2].characterFormat.bold).toBe(false);
        expect(line.children[2].characterFormat.highlightColor).toBe('NoColor');

        editor.openBlank();
        editor.editor.insertText('شلاؤي شلاؤي شلا');
        editor.selection.paragraphFormat.bidi = true;
        editor.selection.select('0;0;6', '0;0;11');
        editor.selection.toggleBold();
        editor.selection.toggleHighlightColor();
        para = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget;
        line = para.childWidgets[0] as LineWidget;
        expect(line.children[2].characterFormat.bold).toBe(true);
        expect(line.children[2].characterFormat.highlightColor).toBe('Yellow');
        expect(line.children[0].characterFormat.bold).toBe(false);
        expect(line.children[0].characterFormat.highlightColor).toBe('NoColor');
        expect(line.children[4].characterFormat.bold).toBe(false);
        expect(line.children[4].characterFormat.highlightColor).toBe('NoColor');
    });
});