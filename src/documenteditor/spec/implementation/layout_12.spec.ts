import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, Selection, ParagraphWidget, LineWidget, TableWidget, TextElementBox, Layout, FieldElementBox } from '../../src/index';
import { TestHelper } from '../test-helper.spec';

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
                "bidi": false
            },
            "blocks": [
                {
                    "paragraphFormat": {
                        "textAlignment": "Right",
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
                            "text": "יעדגכעגדכ"
                        },
                        {
                            "characterFormat": {
                                "bidi": true
                            },
                            "text": "%"
                        },
                        {
                            "characterFormat": {
                                "bidi": true
                            },
                            "text": ""
                        },
                        {
                            "characterFormat": {
                                "bidi": true
                            },
                            "text": "%"
                        },
                        {
                            "characterFormat": {
                                "bidi": true
                            },
                            "text": ""
                        },
                        {
                            "characterFormat": {
                                "bidi": true
                            },
                            "text": "%"
                        },
                        {
                            "characterFormat": {
                                "bidi": true
                            },
                            "text": "דעכידעגכ"
                        },
                        {
                            "characterFormat": {
                                "bidi": true
                            },
                            "text": "@"
                        },
                        {
                            "characterFormat": {
                                "bidi": true
                            },
                            "text": ""
                        },
                        {
                            "characterFormat": {
                                "bidi": true
                            },
                            "text": "@"
                        },
                        {
                            "characterFormat": {
                                "bidi": true
                            },
                            "text": ""
                        },
                        {
                            "characterFormat": {
                                "bidi": true
                            },
                            "text": "@"
                        },
                        {
                            "characterFormat": {
                            },
                            "text": "shgfsdfgdf"
                        },
                        {
                            "characterFormat": {
                            },
                            "text": " sgfdf%"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_GoBack"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_GoBack"
                        }
                    ]
                }
            ],
            "headersFooters": {
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
        "fontFamilyBidi": "Arial"
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
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {
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

// describe('RTL special character validation', () => {
//     let editor: DocumentEditor = undefined;
//     beforeAll(() => {
//         document.body.innerHTML = '';
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.appendChild(ele);
//         DocumentEditor.Inject(Selection, Editor);
//         editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
//         (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.appendTo('#container');
//     });
//     afterAll(() => {
//         editor.destroy();
//         document.body.removeChild(document.getElementById('container'));
//         editor = undefined;
//     });
//     it('RTl with special character validation', () => {
//         editor.open(JSON.stringify(json));
//         expect((editor.selection.start.currentWidget.children[4] as TextElementBox).text).toBe('@');
//     });
// });

let FiedlCodeSfdt: any ={"sections":[{"blocks":[{"characterFormat":{"bold":true,"fontColor":"empty","fontSizeBidi":10},"paragraphFormat":{"styleName":"Normal_fcdbefec-3955-4075-897f-fd04704755cb"},"inlines":[{"name":"_GoBack","bookmarkType":0},{"hasFieldEnd":true,"characterFormat":{"fontColor":"empty","fontSizeBidi":10},"fieldType":0},{"text":" IF \"1\" = \"1\" \"","characterFormat":{"fontColor":"empty","fontSizeBidi":10}}]},{"characterFormat":{"bold":true,"fontColor":"empty","fontSizeBidi":10},"paragraphFormat":{"styleName":"Normal_fcdbefec-3955-4075-897f-fd04704755cb"},"inlines":[{"text":"Riego","characterFormat":{"bold":true,"fontColor":"empty","fontSizeBidi":10}}]},{"characterFormat":{"fontColor":"empty","fontSizeBidi":10},"paragraphFormat":{"styleName":"Normal_fcdbefec-3955-4075-897f-fd04704755cb"},"inlines":[]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":1,"heightType":"AtLeast","borders":{}},"cells":[{"blocks":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"empty","fontSizeBidi":9},"paragraphFormat":{"styleName":"Normal_fcdbefec-3955-4075-897f-fd04704755cb"},"inlines":[{"text":"Nº CAPT","characterFormat":{"bold":true,"fontSize":9,"fontColor":"empty","fontSizeBidi":9}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":59.400001525878906,"preferredWidthType":"Point","verticalAlignment":"Top","isSamePaddingAsTable":true,"borders":{},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":59.400001525878906}},{"blocks":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"empty","fontSizeBidi":9},"paragraphFormat":{"styleName":"Normal_fcdbefec-3955-4075-897f-fd04704755cb"},"inlines":[{"text":"SISTEMA RIEGO","characterFormat":{"bold":true,"fontSize":9,"fontColor":"empty","fontSizeBidi":9}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":135,"preferredWidthType":"Point","verticalAlignment":"Top","isSamePaddingAsTable":true,"borders":{},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":135}},{"blocks":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"empty","fontSizeBidi":9},"paragraphFormat":{"styleName":"Normal_fcdbefec-3955-4075-897f-fd04704755cb"},"inlines":[{"text":"TIPO CULTIVO","characterFormat":{"bold":true,"fontSize":9,"fontColor":"empty","fontSizeBidi":9}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":135,"preferredWidthType":"Point","verticalAlignment":"Top","isSamePaddingAsTable":true,"borders":{},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":135}},{"blocks":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"empty","fontSizeBidi":9},"paragraphFormat":{"styleName":"Normal_fcdbefec-3955-4075-897f-fd04704755cb"},"inlines":[{"text":"SUPERFICIE","characterFormat":{"bold":true,"fontSize":9,"fontColor":"empty","fontSizeBidi":9}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":126,"preferredWidthType":"Point","verticalAlignment":"Top","isSamePaddingAsTable":true,"borders":{},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":126}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0}},{"characterFormat":{"fontColor":"empty","fontSizeBidi":10},"paragraphFormat":{"styleName":"Normal_fcdbefec-3955-4075-897f-fd04704755cb"},"inlines":[{"text":"\" \"\" ","characterFormat":{"fontColor":"empty","fontSizeBidi":10}},{"fieldType":2}]},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"styleName":"Normal_fcdbefec-3955-4075-897f-fd04704755cb"},"inlines":[{"fieldType":1},{"name":"_GoBack","bookmarkType":1}]}],"headersFooters":{},"sectionFormat":{"headerDistance":14.199999809265137,"footerDistance":14.199999809265137,"pageWidth":595.2999877929688,"pageHeight":841.9000244140625,"leftMargin":35.45000076293945,"rightMargin":56.70000076293945,"topMargin":83.3499984741211,"bottomMargin":56.70000076293945,"differentFirstPage":true,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"characterFormat":{},"background":{"color":"#FFFFFFFF"},"styles":{},"defaultTabWidth":35.400001525878906,"formatting":false,"trackChanges":false,"protectionType":"NoProtection","enforcement":false,"dontUseHTMLParagraphAutoSpacing":false,"alignTablesRowByRow":false,"formFieldShading":true};

describe('Field code contains table', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor)
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, layoutType: 'Continuous' });
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Field code contains table validation', () => {
      expect(() => { editor.open(JSON.stringify(FiedlCodeSfdt)) }).not.toThrowError();
      let fieldCode = editor.selection.getFieldCode((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children[1] as FieldElementBox)
      expect(fieldCode).toBe('IF "1" = "1" "RiegoNº CAPTSISTEMA RIEGOTIPO CULTIVOSUPERFICIE" ""');
  });
});