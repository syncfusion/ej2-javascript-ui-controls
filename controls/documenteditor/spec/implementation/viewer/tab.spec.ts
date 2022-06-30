import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { BodyWidget, Editor, ParagraphWidget, TabElementBox } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Selection, ElementBox, LineWidget } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { SfdtExport } from "../../../src/document-editor/implementation/writer/sfdt-export";


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
    it('default tab width validation', () => {
        var tab = [{ "position": 175.6999969482422, "tabLeader": "None", "deletePosition": 0, "tabJustification": "Left" }]
        var content = 'LTF Design Services Agreement | Issued 7/15/2013';
        editor.openBlank();
        editor.parser.parseParagraphFormat({ tabs: tab }, editor.selection.start.paragraph.paragraphFormat);
        let childWidgets = (editor.selection.start.paragraph.childWidgets[0] as LineWidget).children as ElementBox[];
        editor.editorModule.insertText(content);
        editor.selection.handleTabKey(false, false);
        expect((childWidgets[childWidgets.length -1] as ElementBox).width).toBeLessThan(36);
        editor.editorModule.insertText('          ');
        editor.selection.handleTabKey(false, false);
        expect((childWidgets[childWidgets.length -1] as ElementBox).width).toBeLessThan(17);
        editor.selection.handleTabKey(false, false);
        expect((childWidgets[childWidgets.length -1] as ElementBox).width).toBe(48);
    });
    it('Tab character layout in footer validation', () => {
        let content: any = {
            "sections": [
                {
                    "sectionFormat": {
                        "pageWidth": 612,
                        "pageHeight": 792,
                        "leftMargin": 28.799999237060547,
                        "rightMargin": 28.799999237060547,
                        "topMargin": 36,
                        "bottomMargin": 36,
                        "differentFirstPage": false,
                        "differentOddAndEvenPages": false,
                        "headerDistance": 36,
                        "footerDistance": 28.799999237060547,
                        "bidi": false
                    },
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "styleName": "Normal",
                                "listFormat": {}
                            },
                            "characterFormat": {
                                "fontSize": 72,
                                "fontSizeBidi": 72
                            },
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "fontSize": 72,
                                        "fontSizeBidi": 72
                                    },
                                    "text": "A"
                                }
                            ]
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
                                        "rightIndent": 1.7999999523162842,
                                        "styleName": "Normal",
                                        "listFormat": {},
                                        "tabs": [
                                            {
                                                "position": 552.5999755859375,
                                                "deletePosition": 0,
                                                "tabJustification": "Right",
                                                "tabLeader": "None"
                                            }
                                        ]
                                    },
                                    "characterFormat": {
                                        "fontSize": 7,
                                        "fontSizeBidi": 7
                                    },
                                    "inlines": [
                                        {
                                            "characterFormat": {
                                                "fontSize": 7,
                                                "fontSizeBidi": 7
                                            },
                                            "text": "R"
                                        },
                                        {
                                            "characterFormat": {
                                                "fontSize": 7,
                                                "fontSizeBidi": 7
                                            },
                                            "text": "evision 0"
                                        },
                                        {
                                            "characterFormat": {
                                                "fontSize": 7,
                                                "fontSizeBidi": 7
                                            },
                                            "text": "\t"
                                        },
                                        {
                                            "characterFormat": {
                                                "fontSize": 7,
                                                "fontSizeBidi": 7
                                            },
                                            "text": "Page "
                                        },
                                        {
                                            "characterFormat": {
                                                "fontSize": 7,
                                                "styleName": "Page Number",
                                                "fontSizeBidi": 7
                                            },
                                            "fieldType": 0,
                                            "hasFieldEnd": true
                                        },
                                        {
                                            "characterFormat": {
                                                "fontSize": 7,
                                                "styleName": "Page Number",
                                                "fontSizeBidi": 7
                                            },
                                            "text": " PAGE "
                                        },
                                        {
                                            "characterFormat": {},
                                            "fieldType": 2
                                        },
                                        {
                                            "characterFormat": {
                                                "fontSize": 7,
                                                "styleName": "Page Number",
                                                "fontSizeBidi": 7
                                            },
                                            "text": "1"
                                        },
                                        {
                                            "characterFormat": {},
                                            "fieldType": 1
                                        },
                                        {
                                            "characterFormat": {
                                                "fontSize": 7,
                                                "styleName": "Page Number",
                                                "fontSizeBidi": 7
                                            },
                                            "text": " of "
                                        },
                                        {
                                            "characterFormat": {
                                                "fontSize": 7,
                                                "styleName": "Page Number",
                                                "fontSizeBidi": 7
                                            },
                                            "fieldType": 0,
                                            "hasFieldEnd": true
                                        },
                                        {
                                            "characterFormat": {
                                                "fontSize": 7,
                                                "styleName": "Page Number",
                                                "fontSizeBidi": 7
                                            },
                                            "text": " NUMPAGES "
                                        },
                                        {
                                            "characterFormat": {},
                                            "fieldType": 2
                                        },
                                        {
                                            "characterFormat": {
                                                "fontSize": 7,
                                                "styleName": "Page Number",
                                                "fontSizeBidi": 7
                                            },
                                            "text": "1"
                                        },
                                        {
                                            "characterFormat": {},
                                            "fieldType": 1
                                        },
                                        {
                                            "characterFormat": {
                                                "fontSize": 7,
                                                "fontFamily": "Arial",
                                                "fontSizeBidi": 7,
                                                "fontFamilyBidi": "Arial"
                                            },
                                            "text": "\t"
                                        },
                                        {
                                            "characterFormat": {
                                                "fontSize": 7,
                                                "fontFamily": "Arial",
                                                "fontSizeBidi": 7,
                                                "fontFamilyBidi": "Arial"
                                            },
                                            "text": "\t"
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
                "fontFamily": "Times New Roman",
                "underline": "None",
                "strikethrough": "None",
                "baselineAlignment": "Normal",
                "highlightColor": "NoColor",
                "fontColor": "#00000000",
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
            "compatibilityMode": "Word2013",
            "styles": [
                {
                    "name": "Normal",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "listFormat": {}
                    },
                    "characterFormat": {},
                    "next": "Normal"
                }
            ],
            "lists": [],
            "abstractLists": [],
            "comments": [],
            "revisions": [],
            "customXml": []
        }
        editor.open(content);
        editor.editorModule.insertPageBreak();
        expect(editor.documentHelper.pages.length).toBe(2);
    })
});

let text: any = {"sections":[{"sectionFormat":{"pageWidth":595.2999877929688,"pageHeight":841.9000244140625,"leftMargin":85.05000305175781,"rightMargin":85.05000305175781,"topMargin":116.25,"bottomMargin":70.9000015258789,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":35.45000076293945,"footerDistance":35.45000076293945,"bidi":false},"blocks":[{"paragraphFormat":{"textAlignment":"Left","beforeSpacing":6,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{},"tabs":[{"position":425.25,"deletePosition":0,"tabJustification":"Right","tabLeader":"Single"}]},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[]},{"paragraphFormat":{"textAlignment":"Left","beforeSpacing":6,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{},"tabs":[{"position":425.25,"deletePosition":0,"tabJustification":"Right","tabLeader":"Single"}]},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Signature1"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"\t"},{"characterFormat":{},"bookmarkType":0,"name":"_Hlk88516693"}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"Normal","listFormat":{},"tabs":[{"position":425.25,"deletePosition":0,"tabJustification":"Right","tabLeader":"Single"}]},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"Normal","listFormat":{},"tabs":[{"position":425.25,"deletePosition":0,"tabJustification":"Right","tabLeader":"Single"}]},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Signature2"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"\t"}]},{"paragraphFormat":{"textAlignment":"Center","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"blocks":[{"paragraphFormat":{"textAlignment":"Left","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontSizeBidi":9},"inlines":[]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","title":"Categoria","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":35.400001525878906,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Header","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":212.60000610351562,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":425.20001220703125,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":212.60000610351562,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":425.20001220703125,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"annotation reference","type":"Character","characterFormat":{"fontSize":8,"fontSizeBidi":8},"basedOn":"Default Paragraph Font"},{"name":"annotation text","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"basedOn":"Normal","link":"Comment Text Char","next":"annotation text"},{"name":"Comment Text Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"annotation subject","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"bold":true,"boldBidi":true},"basedOn":"annotation text","link":"Comment Subject Char","next":"annotation text"},{"name":"Comment Subject Char","type":"Character","characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Times New Roman","boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Comment Text Char"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}
describe('TabElementBox testing while rendering', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Check the TabElementBox', function () {
        console.log('Check the TabElementBox');
        container.openBlank();
        container.open(text);
        let bodyWidget: BodyWidget = container.documentHelper.pages[0].bodyWidgets[0] as BodyWidget;
        let paragraph: ParagraphWidget = bodyWidget.childWidgets[3] as ParagraphWidget;
        let lineWidget: LineWidget = paragraph.childWidgets[0] as LineWidget;
        let tabElementBox: TabElementBox = lineWidget.children[2] as TabElementBox;
        expect(container.documentHelper.render.getTabLeader(tabElementBox)).toBe('');
    });
    it('Check the ElementBox text while rendering', function () {
        console.log('Check the ElementBox text while rendering');
        container.openBlank();
        container.open(text);
        let bodyWidget: BodyWidget = container.documentHelper.pages[0].bodyWidgets[0] as BodyWidget;
        let paragraph: ParagraphWidget = bodyWidget.childWidgets[1] as ParagraphWidget;
        let lineWidget: LineWidget = paragraph.childWidgets[0] as LineWidget;
        let tabElementBox: TabElementBox = lineWidget.children[1] as TabElementBox;
        expect(container.documentHelper.render.getTabLeader(tabElementBox)).toBe('');
    });
});
