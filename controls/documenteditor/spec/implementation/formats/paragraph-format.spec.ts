import { WParagraphFormat } from '../../../src/document-editor/implementation/format/paragraph-format';
import { WListFormat } from '../../../src/document-editor/implementation/format/list-format';
import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { TestHelper } from '../../test-helper.spec';
import { SfdtExport } from '../../../src/document-editor/implementation/writer/sfdt-export';
import { BodyWidget, DocumentHelper, Page, ParagraphWidget } from '../../../src/index';
/**
 * Paragraph format spec
 */
describe('Paragraph Validation Testing', () => {
    afterEach(() => {
        WParagraphFormat.clear();
        WListFormat.clear();
    });
    it('Copy format setting  Testing', () => {
console.log('Copy format setting  Testing');
        let para: WListFormat = new WListFormat();
        para.listLevelNumber = 20;
        expect('').toBe('');
    });
    it('Copy format Testing', () => {
console.log('Copy format Testing');
        let para: WParagraphFormat = new WParagraphFormat();
        let para1: WParagraphFormat = new WParagraphFormat();
        para.copyFormat(para1);
        expect('').toBe('');
    });
    it('Copy format undefined Testing', () => {
console.log('Copy format undefined Testing');
        let para: WParagraphFormat = new WParagraphFormat();
        para.copyFormat(undefined);
        expect('').toBe('');
    });
    it('Clone format Testing', () => {
console.log('Clone format Testing');
        let para: WParagraphFormat = new WParagraphFormat();
        para.cloneFormat();
        expect('').toBe('');
    });
    it('destroy Testing', () => {
console.log('destroy Testing');
        let para: WParagraphFormat = new WParagraphFormat();
        para.destroy();
        para.cloneFormat();
        expect(() => { para.destroy() }).not.toThrowError();
    });
    it('Clear Format validation', () => {
console.log('Clear Format validation');
        let format: WParagraphFormat = new WParagraphFormat();
        format.leftIndent = 10;
        format.rightIndent = 12;
        format.afterSpacing = 10;
        format.listFormat.listId = 1;
        format.listFormat.listLevelNumber = 0;
        format.clearFormat();
        expect((format as any).uniqueParagraphFormat).toBeUndefined();
        expect(format.leftIndent).toBe(0);
        expect(format.rightIndent).toBe(0);
        expect(format.listFormat.listId).toBe(-1);
    });
    it('Text alignment right valdiation', () => {
console.log('Text alignment right valdiation');
        let format: WParagraphFormat = new WParagraphFormat();
        format.textAlignment = 'Right';
        format.bidi = true;
        expect(format.textAlignment).toBe("Left");
    });
    it('style property default value', () => {
console.log('style property default value');
        expect((WParagraphFormat as any).getPropertyDefaultValue('styleName')).toBe('Normal');
    });
});


let tabStop: object = { "sections": [{ "blocks": [{ "characterFormat": { "fontSize": 8.0, "fontFamily": "Times New Roman" }, "paragraphFormat": { "styleName": "[Normal]", "tabs": [{ "tabJustification": "Left", "position": 0.0, "tabLeader": "None", "deletePosition": 56.7 }, { "tabJustification": "Left", "position": 0.0, "tabLeader": "None", "deletePosition": 113.4 }, { "tabJustification": "Left", "position": 0.0, "tabLeader": "None", "deletePosition": 170.1 }, { "tabJustification": "Left", "position": 0.0, "tabLeader": "None", "deletePosition": 226.8 }, { "tabJustification": "Left", "position": 0.0, "tabLeader": "None", "deletePosition": 283.5 }, { "tabJustification": "Left", "position": 0.0, "tabLeader": "None", "deletePosition": 340.2 }, { "tabJustification": "Left", "position": 0.0, "tabLeader": "None", "deletePosition": 396.9 }, { "tabJustification": "Left", "position": 0.0, "tabLeader": "None", "deletePosition": 453.6 }, { "tabJustification": "Left", "position": 0.0, "tabLeader": "None", "deletePosition": 510.3 }, { "tabJustification": "Center", "position": 270.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 539.25, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 850.5, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 907.20001220703125, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 963.9000244140625, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 1020.5999755859375, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 1077.300048828125, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 1134.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 1190.699951171875, "tabLeader": "None", "deletePosition": 0.0 }] }, "inlines": [{ "text": "Tab stop with delete position", "characterFormat": { "fontSize": 8.0, "fontFamily": "Times New Roman" } }, { "text": "\t", "characterFormat": { "fontSize": 8.0, "fontFamily": "Times New Roman" } }, { "hasFieldEnd": true, "fieldType": 0 }, { "text": " PAGE \\* Arabic \\* MERGEFORMAT ", "characterFormat": { "fontSize": 8.0, "fontFamily": "Times New Roman" } }, { "fieldType": 2 }, { "text": "1", "characterFormat": { "fontSize": 8.0, "fontFamily": "Times New Roman" } }, { "fieldType": 1 }, { "text": " of 4", "characterFormat": { "fontSize": 8.0, "fontFamily": "Times New Roman" } }, { "text": "\t", "characterFormat": { "fontSize": 8.0, "fontFamily": "Times New Roman" } }, { "text": "right aligned", "characterFormat": { "fontSize": 8.0, "fontFamily": "Times New Roman" } }, { "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }] }, { "characterFormat": { "fontSize": 7.0, "fontFamily": "Times New Roman" }, "paragraphFormat": { "styleName": "Header", "tabs": [{ "tabJustification": "Left", "position": 36.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 72.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 108.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 144.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 180.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 216.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 252.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 288.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 324.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 360.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 396.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 432.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 504.0, "tabLeader": "None", "deletePosition": 0.0 }] }, "inlines": [] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 33.200000762939453, "pageWidth": 612.0, "pageHeight": 1008.0, "leftMargin": 36.0, "rightMargin": 21.600000381469727, "topMargin": 8.5500001907348633, "bottomMargin": 8.5500001907348633, "differentFirstPage": false, "differentOddAndEvenPages": false } }], "characterFormat": { "fontSize": 12.0, "fontFamily": "Arial" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal", "characterFormat": { "fontSize": 10.0, "fontFamily": "CG Times" }, "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple" } }, { "type": "Paragraph", "name": "Heading 1", "basedOn": "Normal", "next": "Normal", "characterFormat": { "bold": true, "fontSize": 8.0 }, "paragraphFormat": { "outlineLevel": "Level1" } }, { "type": "Paragraph", "name": "Heading 2", "basedOn": "Normal", "next": "Normal", "characterFormat": { "bold": true, "fontSize": 8.0 }, "paragraphFormat": { "outlineLevel": "Level2", "textAlignment": "Center" } }, { "type": "Paragraph", "name": "Heading 4", "basedOn": "Normal", "next": "Normal", "characterFormat": { "bold": true }, "paragraphFormat": { "outlineLevel": "Level4", "textAlignment": "Justify", "tabs": [{ "tabJustification": "Left", "position": 276.75, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Paragraph", "name": "[Normal]", "next": "Normal", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Left", "position": 56.700000762939453, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 113.40000152587891, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 170.10000610351563, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 226.80000305175781, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 283.5, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 340.20001220703125, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 396.89999389648438, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 453.60000610351562, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 510.29998779296875, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 567.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 623.70001220703125, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 680.4000244140625, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 737.0999755859375, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Left", "position": 793.79998779296875, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Paragraph", "name": "Header", "basedOn": "Normal", "next": "Normal", "paragraphFormat": { "tabs": [{ "tabJustification": "Center", "position": 216.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 432.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Paragraph", "name": "Body Text", "basedOn": "Normal", "characterFormat": { "fontSize": 8.0 } }, { "type": "Paragraph", "name": "Body Text 2", "basedOn": "Normal", "characterFormat": { "fontSize": 8.0 }, "paragraphFormat": { "textAlignment": "Justify" } }, { "type": "Paragraph", "name": "Body Text Indent 2", "basedOn": "Normal", "characterFormat": { "fontSize": 8.0 }, "paragraphFormat": { "leftIndent": 26.100000381469727 } }, { "type": "Paragraph", "name": "Footer", "basedOn": "Normal", "link": "Footer Char", "paragraphFormat": { "tabs": [{ "tabJustification": "Center", "position": 234.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Footer Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 10.0, "fontFamily": "CG Times" } }], "defaultTabWidth": 56.700000762939453 };

describe('Tab stop with delete position', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
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
        }, 500);
    });

    it('Get tab stop from paragraph', () => {
        console.log('Get tab stop from paragraph');
        editor.open(JSON.stringify(tabStop));
        // Excluding delete position.
        expect(editor.selection.start.paragraph.paragraphFormat.getUpdatedTabs().length).toBe(14);
    });
    it('Get tab stop from list format', () => {
        console.log('Get tab stop from list format');
        let sfdt: any = {
            "sections": [
                {
                    "sectionFormat": {
                    },
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "leftIndent": 18,
                                "firstLineIndent": 0,
                                "styleName": "DPSTNR10",
                                "listFormat": {
                                    "listId": 9,
                                    "listLevelNumber": 0
                                },
                                "tabs": [
                                    {
                                        "position": 135,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "characterFormat": {},
                            "inlines": [
                                {
                                    "characterFormat": {},
                                    "text": "Our medical and or wage investigation is continuing."
                                }
                            ]
                        }
                    ],
                    "headersFooters": {}
                }
            ],
            "characterFormat": {
            },
            "paragraphFormat": {
            },
            "defaultTabWidth": 35.400001525878906,
            "trackChanges": false,
            "enforcement": false,
            "hashValue": "",
            "saltValue": "",
            "formatting": false,
            "protectionType": "NoProtection",
            "dontUseHTMLParagraphAutoSpacing": false,
            "formFieldShading": true,
            "compatibilityMode": "Word2007",
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
                    "name": "Default Paragraph Font",
                    "type": "Character",
                    "characterFormat": {}
                }
            ],
            "lists": [
                {
                    "abstractListId": 9,
                    "levelOverrides": [],
                    "listId": 9
                }
            ],
            "abstractLists": [
                {
                    "abstractListId": 9,
                    "levels": [
                        {
                            "characterFormat": {
                                "fontFamily": "Symbol",
                                "fontFamilyBidi": "Symbol"
                            },
                            "paragraphFormat": {
                                "leftIndent": 36,
                                "firstLineIndent": -18,
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
                            "listLevelPattern": "Bullet",
                            "numberFormat": "",
                            "restartLevel": 0,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontFamily": "Courier New",
                                "fontFamilyBidi": "Courier New"
                            },
                            "paragraphFormat": {
                                "leftIndent": 72,
                                "firstLineIndent": -18,
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
                            "listLevelPattern": "Bullet",
                            "numberFormat": "o",
                            "restartLevel": 0,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontFamily": "Wingdings",
                                "fontFamilyBidi": "Wingdings"
                            },
                            "paragraphFormat": {
                                "leftIndent": 108,
                                "firstLineIndent": -18,
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
                            "listLevelPattern": "Bullet",
                            "numberFormat": "",
                            "restartLevel": 0,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontFamily": "Symbol",
                                "fontFamilyBidi": "Symbol"
                            },
                            "paragraphFormat": {
                                "leftIndent": 144,
                                "firstLineIndent": -18,
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
                            "listLevelPattern": "Bullet",
                            "numberFormat": "",
                            "restartLevel": 0,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontFamily": "Courier New",
                                "fontFamilyBidi": "Courier New"
                            },
                            "paragraphFormat": {
                                "leftIndent": 180,
                                "firstLineIndent": -18,
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
                            "listLevelPattern": "Bullet",
                            "numberFormat": "o",
                            "restartLevel": 0,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontFamily": "Wingdings",
                                "fontFamilyBidi": "Wingdings"
                            },
                            "paragraphFormat": {
                                "leftIndent": 216,
                                "firstLineIndent": -18,
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
                            "listLevelPattern": "Bullet",
                            "numberFormat": "",
                            "restartLevel": 0,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontFamily": "Symbol",
                                "fontFamilyBidi": "Symbol"
                            },
                            "paragraphFormat": {
                                "leftIndent": 252,
                                "firstLineIndent": -18,
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
                            "listLevelPattern": "Bullet",
                            "numberFormat": "",
                            "restartLevel": 0,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontFamily": "Courier New",
                                "fontFamilyBidi": "Courier New"
                            },
                            "paragraphFormat": {
                                "leftIndent": 288,
                                "firstLineIndent": -18,
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
                            "listLevelPattern": "Bullet",
                            "numberFormat": "o",
                            "restartLevel": 0,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontFamily": "Wingdings",
                                "fontFamilyBidi": "Wingdings"
                            },
                            "paragraphFormat": {
                                "leftIndent": 324,
                                "firstLineIndent": -18,
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
                            "listLevelPattern": "Bullet",
                            "numberFormat": "",
                            "restartLevel": 0,
                            "startAt": 0
                        }
                    ]
                }
            ],
            "comments": [],
            "revisions": [],
            "customXml": []
        }
        editor.open(JSON.stringify(sfdt));
        // Excluding delete position.
        expect(editor.selection.start.paragraph.paragraphFormat.getUpdatedTabs().length).toBe(2);
    });
});

describe("Pargarph format in baseOn style", function () {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
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
        }, 500);
    });
    it("Get first indent validation", () => {
        editor.open(getStyleDocument());
        let paragraphFormat: WParagraphFormat = editor.selection.start.paragraph.paragraphFormat;
        //Defined in baseStyle.
        expect(paragraphFormat.afterSpacing).toBe(0);
        //Defined in basestyle.
        expect(paragraphFormat.beforeSpacing).toBe(24);
        //Defined in based on style list format.
        expect(paragraphFormat.leftIndent).toBe(21.600000381469727);
        //Defined in based on style list's pargraph format.
        expect(paragraphFormat.firstLineIndent).toBe(-21.600000381469727);
    });
    it("Remove Paragraph formats", () => {
        editor.openBlank();
        editor.open(getStyleDocument());
        let paragraphFormat: WParagraphFormat = editor.selection.start.paragraph.paragraphFormat;
        editor.editor.applyStyle('Heading 2', true);
         //Defined in baseStyle.
        expect(paragraphFormat.afterSpacing).toBe(6);
        //Defined in basestyle.
        expect(paragraphFormat.beforeSpacing).toBe(16);
        //Defined in based on style list format.
        expect(paragraphFormat.leftIndent).toBe(28.799999237060547);
        //Defined in based on style list's pargraph format.
        expect(paragraphFormat.firstLineIndent).toBe(-28.799999237060547);
    });
});

describe('Default Paragraph Format API Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        let defaultParagraphFormat: object = {
            leftIndent: 30,
            afterSpacing: 20,
            textAlignment: 'Center'
        }
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        //setDefaultParagraphFormat API
        editor.setDefaultParagraphFormat(defaultParagraphFormat);
        editor.appendTo('#container');
    });
    afterAll(() => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
    });

    it('Check Text Alignment is center', () => {
        console.log('Check Text Alignment is center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
});

function getStyleDocument() {
    return `{
        "sections": [
            {
                "sectionFormat": {
                       "pageWidth": 595,
                    "pageHeight": 842,
                    "leftMargin": 70.8499984741211,
                    "rightMargin": 70.8499984741211,
                    "topMargin": 70.8499984741211,
                    "bottomMargin": 70.8499984741211,
                    "differentFirstPage": false,
                    "differentOddAndEvenPages": false,
                    "headerDistance": 35.400001525878906,
                    "footerDistance": 35.400001525878906,
                    "bidi": false
                },
                "blocks": [
                    {
                        "paragraphFormat": {
                            "styleName": "TOC Heading",
                            "listFormat": {}
                        },
                        "characterFormat": {},
                        "inlines": [
                            {
                                "characterFormat": {},
                                "bookmarkType": 0,
                                "name": "_Toc511665392"
                            },
                            {
                                "characterFormat": {},
                                "bookmarkType": 0,
                                "name": "_Toc514760868"
                            },
                            {
                                "characterFormat": {},
                                "bookmarkType": 0,
                                "name": "_Toc499919425"
                            },
                            {
                                "characterFormat": {},
                                "bookmarkType": 0,
                                "name": "_Hlk500932317"
                            },
                            {
                                "characterFormat": {},
                                "bookmarkType": 0,
                                "name": "_Toc511665397"
                            },
                            {
                                "characterFormat": {},
                                "text": "Table of Contents"
                            }
                        ]
                    }
                ],
                "headersFooters": {
                }
            }
        ],
        "characterFormat": {
        },
        "paragraphFormat": {
        },
        "defaultTabWidth": 36,
        "enforcement": false,
        "hashValue": "",
        "saltValue": "",
        "formatting": false,
        "protectionType": "NoProtection",
        "styles": [
            {
                "name": "TOC Heading",
                "type": "Paragraph",
                "paragraphFormat": {
                    "beforeSpacing": 24,
                    "afterSpacing": 0,
                    "lineSpacing": 1.149999976158142,
                    "lineSpacingType": "Multiple",
                    "outlineLevel": "BodyText",
                    "listFormat": {
                        "listId": -1,
                        "listLevelNumber": 0
                    }
                },
                "characterFormat": {
                    "fontSize": 14,
                    "fontColor": "#2F5496FF",
                    "boldBidi": true,
                    "fontSizeBidi": 14,
                    "fontFamilyBidi": "majorBidi"
                },
                "basedOn": "Heading 1",
                "next": "Normal"
            },
            {
                "name": "Normal",
                "type": "Paragraph",
                "paragraphFormat": {
                    "lineSpacing": 1.100000023841858,
                    "lineSpacingType": "Multiple",
                    "listFormat": {},
                    "contextualSpacing": true
                },
                "characterFormat": {
                    "fontSize": 10,
                    "fontFamily": "Calibri Light",
                    "fontSizeBidi": 10
                },
                "next": "Normal"
            },
            {
                "name": "Heading 1",
                "type": "Paragraph",
                "paragraphFormat": {
                    "leftIndent": 21.600000381469727,
                    "afterSpacing": 18,
                    "outlineLevel": "Level1",
                    "listFormat": {
                        "listId": 0
                    },
                    "contextualSpacing": false
                },
                "characterFormat": {
                    "bold": true,
                    "fontSize": 16,
                    "fontFamily": "Calibri Light",
                    "fontColor": "#EB5015FF"
                },
                "basedOn": "Normal",
                "link": "Heading 1 Char",
                "next": "Heading 2"
            },
            {
                "name": "Heading 1 Char",
                "type": "Character",
                "characterFormat": {
                    "bold": true,
                    "fontSize": 16,
                    "fontFamily": "Calibri Light",
                    "fontColor": "#EB5015FF",
                    "fontSizeBidi": 10
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
                    "leftIndent": 28.799999237060547,
                    "beforeSpacing": 16,
                    "afterSpacing": 6,
                    "lineSpacing": 1.5,
                    "lineSpacingType": "Multiple",
                    "outlineLevel": "Level2",
                    "listFormat": {
                        "listId": 0,
                        "listLevelNumber": 1
                    },
                    "contextualSpacing": false
                },
                "characterFormat": {
                    "fontSize": 13,
                    "fontFamily": "Calibri Light",
                    "fontColor": "#EB5015FF",
                    "boldBidi": true,
                    "fontSizeBidi": 14,
                    "fontFamilyBidi": "majorBidi"
                },
                "basedOn": "Normal",
                "link": "Heading 2 Char",
                "next": "Body"
            },
            {
                "name": "Heading 2 Char",
                "type": "Character",
                "characterFormat": {
                    "fontSize": 13,
                    "fontFamily": "Calibri Light",
                    "fontColor": "#EB5015FF",
                    "boldBidi": true,
                    "fontSizeBidi": 14,
                    "fontFamilyBidi": "majorBidi"
                },
                "basedOn": "Default Paragraph Font"
            },
            {
                "name": "Body",
                "type": "Paragraph",
                "paragraphFormat": {
                    "afterSpacing": 6,
                    "lineSpacing": 1.100000023841858,
                    "lineSpacingType": "Multiple",
                    "listFormat": {}
                },
                "characterFormat": {
                    "fontSize": 10,
                    "fontFamily": "Calibri Light",
                    "fontColor": "#404040FF",
                    "fontSizeBidi": 10
                },
                "link": "Body Char"
            },
            {
                "name": "Body Char",
                "type": "Character",
                "characterFormat": {
                    "fontSize": 10,
                    "fontFamily": "Calibri Light",
                    "fontColor": "#404040FF",
                    "fontSizeBidi": 10
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
                        "characterFormat": {},
                        "paragraphFormat": {
                            "leftIndent": 35.75,
                            "firstLineIndent": -21.600000381469727,
                            "listFormat": {}
                        },
                        "followCharacter": "Tab",
                        "listLevelPattern": "Arabic",
                        "numberFormat": "%1",
                        "restartLevel": 0,
                        "startAt": 1
                    },
                    {
                        "characterFormat": {},
                        "paragraphFormat": {
                            "leftIndent": 482.3999938964844,
                            "firstLineIndent": -28.799999237060547,
                            "listFormat": {}
                        },
                        "followCharacter": "Tab",
                        "listLevelPattern": "Arabic",
                        "numberFormat": "%1.%2",
                        "restartLevel": 1,
                        "startAt": 1
                    },
                    {
                        "characterFormat": {},
                        "paragraphFormat": {
                            "leftIndent": 36,
                            "firstLineIndent": -36,
                            "listFormat": {}
                        },
                        "followCharacter": "Tab",
                        "listLevelPattern": "Arabic",
                        "numberFormat": "%1.%2.%3",
                        "restartLevel": 2,
                        "startAt": 1
                    },
                    {
                        "characterFormat": {},
                        "paragraphFormat": {
                            "leftIndent": 61.20000076293945,
                            "firstLineIndent": -43.20000076293945,
                            "listFormat": {}
                        },
                        "followCharacter": "Tab",
                        "listLevelPattern": "Arabic",
                        "numberFormat": "%1.%2.%3.%4",
                        "restartLevel": 3,
                        "startAt": 1
                    },
                    {
                        "characterFormat": {},
                        "paragraphFormat": {
                            "leftIndent": 50.400001525878906,
                            "firstLineIndent": -50.400001525878906,
                            "listFormat": {}
                        },
                        "followCharacter": "Tab",
                        "listLevelPattern": "Arabic",
                        "numberFormat": "%1.%2.%3.%4.%5",
                        "restartLevel": 4,
                        "startAt": 1
                    },
                    {
                        "characterFormat": {},
                        "paragraphFormat": {
                            "leftIndent": 57.599998474121094,
                            "firstLineIndent": -57.599998474121094,
                            "listFormat": {}
                        },
                        "followCharacter": "Tab",
                        "listLevelPattern": "Arabic",
                        "numberFormat": "%1.%2.%3.%4.%5.%6",
                        "restartLevel": 5,
                        "startAt": 1
                    },
                    {
                        "characterFormat": {},
                        "paragraphFormat": {
                            "leftIndent": 64.80000305175781,
                            "firstLineIndent": -64.80000305175781,
                            "listFormat": {}
                        },
                        "followCharacter": "Tab",
                        "listLevelPattern": "Arabic",
                        "numberFormat": "%1.%2.%3.%4.%5.%6.%7",
                        "restartLevel": 6,
                        "startAt": 1
                    },
                    {
                        "characterFormat": {},
                        "paragraphFormat": {
                            "leftIndent": 72,
                            "firstLineIndent": -72,
                            "listFormat": {}
                        },
                        "followCharacter": "Tab",
                        "listLevelPattern": "Arabic",
                        "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8",
                        "restartLevel": 7,
                        "startAt": 1
                    },
                    {
                        "characterFormat": {},
                        "paragraphFormat": {
                            "leftIndent": 79.19999694824219,
                            "firstLineIndent": -79.19999694824219,
                            "listFormat": {}
                        },
                        "followCharacter": "Tab",
                        "listLevelPattern": "Arabic",
                        "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.%9",
                        "restartLevel": 8,
                        "startAt": 1
                    }
                ]
            }
        ]
    }`;
}

describe('Checking AutoSpacing value is appending or not', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
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
        }, 500);
    });
    it('Return true if spaceBeforeAuto  is set to false', () => {
        console.log('spaceBeforeAuto');
        editor.editor.insertText('In 2000, Adventure Works Cycles bought a small manufacturing plant, Importadores Neptuno, located in Mexico. Importadores Neptuno manufactures several critical subcomponents for the Adventure Works Cycles product line. These subcomponents are shipped to the Bothell location for final product assembly.');
        expect(editor.documentHelper.paragraphFormat.spaceBeforeAuto).toBe(false);
    });
    it('Return true if spaceAfterAuto  is set to false', () => {
        console.log('spaceAfterAuto');
        expect(editor.documentHelper.paragraphFormat.spaceAfterAuto).toBe(false);
    });
    it('Return true if spaceAfterAuto value is set to true', () => {
        console.log('spaceAfterAuto');
        editor.documentHelper.paragraphFormat.spaceAfterAuto = true;
        expect(editor.documentHelper.paragraphFormat.spaceAfterAuto).toBe(true);
    });
    it('Return true if spaceBeforeAuto value is set to true', () => {
        console.log('spaceBeforeAuto');
        editor.documentHelper.paragraphFormat.spaceBeforeAuto = true;
        expect(editor.documentHelper.paragraphFormat.spaceBeforeAuto).toBe(true);
    });
    it('Return true if the spaceAfterAuto value is set to false', () => {
        console.log('spaceAfterAuto');
        editor.documentHelper.paragraphFormat.spaceAfterAuto = false;
        expect(editor.documentHelper.paragraphFormat.spaceAfterAuto).toBe(false);
    });
    it('Return true if the spaceBeforeAuto value is set to false', () => {
        console.log('spaceBeforeAuto');
        editor.documentHelper.paragraphFormat.spaceBeforeAuto = false;
        expect(editor.documentHelper.paragraphFormat.spaceBeforeAuto).toBe(false);
    });
});
let fieldText: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"text":"para 1"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontSize":36,"fontFamily":"DokChampa","fontSizeBidi":36,"fontFamilyBidi":"DokChampa"},"text":"MERGEFIELD "},{"characterFormat":{},"fieldType":2},{"characterFormat":{},"fieldType":1}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"text":"para 2"}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"text":"para 1"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"text":" MERGEFIELD "},{"characterFormat":{},"fieldType":2},{"characterFormat":{},"fieldType":1}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"inlines":[{"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Calibri"},"text":"para 3"}]}]},"footer":{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Toc3","type":"Paragraph","paragraphFormat":{"leftIndent":22,"afterSpacing":5,"listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Normal"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Check the para height which contains empty field', () => {
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
    it('Check the para height which contains empty field', function () {
        console.log('Check the para height which contains empty field');
        container.openBlank();
        container.open(JSON.stringify(fieldText));
        let paragraphWidget: ParagraphWidget = (container.documentHelper.pages[0].bodyWidgets[0] as BodyWidget).childWidgets[1] as ParagraphWidget;
        expect(paragraphWidget.height).toBe(17.930000000000007);
    });
    it('Check the para height which contains empty field in header', function () {
        console.log('Check the para height which contains empty field in header');
        container.openBlank();
        container.open(JSON.stringify(fieldText));
        let paragraphWidget: ParagraphWidget = container.documentHelper.pages[0].headerWidgetIn.childWidgets[1] as ParagraphWidget;
        expect(paragraphWidget.height).toBe(17.930000000000007);
    });
});
var json: object = { "sections": [{ "blocks": [{ "inlines": [{ "text": "No border-" }, { "text": "default" }] }, { "paragraphFormat": { "borders": { "right": { "lineStyle": "Single", "lineWidth": 1.0, "shadow": false, "space": 4.0, "hasNoneStyle": false, "color": "#FF0000FF" } } }, "inlines": [{ "text": "Inline" }] }, { "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [{ "text": "Style-" }] }, { "paragraphFormat": { "styleName": "Heading 2" }, "inlines": [{ "text": "Based no" }] }, { "paragraphFormat": { "styleName": "Heading 4" }, "inlines": [{ "text": "Based no to -based" }, { "text": " on" }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false, "restartPageNumbering": false, "pageStartingNumber": 0, "endnoteNumberFormat": "LowerCaseRoman", "footNoteNumberFormat": "Arabic", "restartIndexForFootnotes": "DoNotRestart", "restartIndexForEndnotes": "DoNotRestart", "columns": { "column": [{ "width": 468.0, "space": 36.0 }], "numberOfColumns": 1, "equalWidth": true } } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "borders": { "left": { "lineStyle": "Single", "lineWidth": 1.0, "shadow": false, "space": 4.0, "hasNoneStyle": false, "color": "#FF0000FF" } } }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Paragraph", "name": "Heading 1", "basedOn": "Normal", "next": "Normal", "link": "Heading 1 Char", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16.0, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "beforeSpacing": 12.0, "afterSpacing": 0.0, "outlineLevel": "Level1", "keepWithNext": true, "keepLinesTogether": true, "borders": { "right": { "lineStyle": "Single", "lineWidth": 1.0, "shadow": false, "space": 4.0, "hasNoneStyle": false, "color": "#FF0000FF" }, "bottom": { "lineStyle": "Single", "lineWidth": 1.0, "shadow": false, "space": 1.0, "hasNoneStyle": false, "color": "#00B0F0FF" } } } }, { "type": "Paragraph", "name": "Heading 2", "basedOn": "Heading 1", "next": "Normal", "link": "Heading 2 Char", "characterFormat": { "fontSize": 13.0, "fontSizeBidi": 13.0 }, "paragraphFormat": { "beforeSpacing": 2.0, "outlineLevel": "Level2", "borders": { "top": { "lineStyle": "Double", "lineWidth": 0.5, "shadow": false, "space": 1.0, "hasNoneStyle": false, "color": "#FF0000FF" }, "bottom": { "lineStyle": "Double", "lineWidth": 0.5, "shadow": false, "space": 1.0, "hasNoneStyle": false, "color": "#FF0000FF" } } } }, { "type": "Paragraph", "name": "Heading 3", "basedOn": "Heading 1", "next": "Normal", "link": "Heading 3 Char", "characterFormat": { "fontSize": 12.0, "fontColor": "#1F3763FF", "fontSizeBidi": 12.0 }, "paragraphFormat": { "outlineLevel": "Level3", "borders": { "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": true } } } }, { "type": "Paragraph", "name": "Heading 4", "basedOn": "Heading 5", "next": "Normal", "link": "Heading 4 Char", "characterFormat": { "italic": true, "italicBidi": true }, "paragraphFormat": { "outlineLevel": "Level4", "borders": { "top": { "lineStyle": "Single", "lineWidth": 1.0, "shadow": false, "space": 1.0, "hasNoneStyle": false, "color": "#FF0000FF" } } } }, { "type": "Paragraph", "name": "Heading 5", "basedOn": "Heading 3", "next": "Normal", "link": "Heading 5 Char", "characterFormat": { "fontColor": "#2F5496FF" }, "paragraphFormat": { "beforeSpacing": 2.0, "outlineLevel": "Level5" } }, { "type": "Paragraph", "name": "Heading 9", "basedOn": "Normal", "next": "Normal", "link": "Heading 9 Char", "characterFormat": { "italic": true, "fontSize": 10.5, "fontFamily": "Calibri Light", "fontColor": "#272727FF", "italicBidi": true, "fontSizeBidi": 10.5, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "beforeSpacing": 2.0, "afterSpacing": 0.0, "outlineLevel": "Level9", "keepWithNext": true, "keepLinesTogether": true } }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Heading 2 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 13.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 13.0, "fontFamilyBidi": "Times New Roman" } }, { "type": "Character", "name": "Heading 1 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16.0, "fontFamilyBidi": "Times New Roman" } }, { "type": "Character", "name": "Heading 3 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 12.0, "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontSizeBidi": 12.0, "fontFamilyBidi": "Times New Roman" } }, { "type": "Character", "name": "Heading 4 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "italic": true, "fontSize": 12.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "italicBidi": true, "fontSizeBidi": 12.0, "fontFamilyBidi": "Times New Roman" } }, { "type": "Character", "name": "Heading 5 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 12.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 12.0, "fontFamilyBidi": "Times New Roman" } }, { "type": "Paragraph", "name": "Title", "basedOn": "Normal", "next": "Normal", "link": "Title Char", "characterFormat": { "fontSize": 28.0, "fontFamily": "Calibri Light", "fontSizeBidi": 28.0, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "contextualSpacing": true, "borders": { "bottom": { "lineStyle": "Single", "lineWidth": 1.0, "shadow": false, "space": 1.0, "hasNoneStyle": false, "color": "#00B050FF" } } } }, { "type": "Character", "name": "Title Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 28.0, "fontFamily": "Calibri Light", "fontSizeBidi": 28.0, "fontFamilyBidi": "Times New Roman" } }, { "type": "Paragraph", "name": "No Spacing", "next": "No Spacing", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "borders": { "bottom": { "lineStyle": "Single", "lineWidth": 1.0, "shadow": false, "space": 1.0, "hasNoneStyle": false, "color": "#FF0000FF" } } } }, { "type": "Paragraph", "name": "List Paragraph", "basedOn": "Normal", "next": "List Paragraph", "paragraphFormat": { "leftIndent": 36.0, "contextualSpacing": true, "borders": { "bottom": { "lineStyle": "Single", "lineWidth": 1.0, "shadow": false, "space": 1.0, "hasNoneStyle": false, "color": "#FF0000FF" } } } }, { "type": "Paragraph", "name": "Subtitle", "basedOn": "Heading 9", "next": "Normal", "link": "Subtitle Char", "characterFormat": { "fontColor": "#5A5A5AFF" }, "paragraphFormat": { "listFormat": { "listLevelNumber": 1 }, "borders": { "bottom": { "lineStyle": "Single", "lineWidth": 1.0, "shadow": false, "space": 1.0, "hasNoneStyle": false, "color": "#92D050FF" } } } }, { "type": "Character", "name": "Subtitle Char", "basedOn": "Default Paragraph Font", "characterFormat": { "italic": true, "fontSize": 10.5, "fontFamily": "Calibri Light", "fontColor": "#5A5A5AFF", "italicBidi": true, "fontSizeBidi": 10.5, "fontFamilyBidi": "Times New Roman" } }, { "type": "Character", "name": "Heading 9 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "italic": true, "fontSize": 10.5, "fontFamily": "Calibri Light", "fontColor": "#272727FF", "italicBidi": true, "fontSizeBidi": 10.5, "fontFamilyBidi": "Times New Roman" } }], "defaultTabWidth": 36.0, "formatting": false, "trackChanges": false, "protectionType": "NoProtection", "enforcement": false, "dontUseHTMLParagraphAutoSpacing": false, "alignTablesRowByRow": false, "formFieldShading": true, "footnotes": { "separator": [{ "inlines": [{ "text": "\\u0003" }] }], "continuationSeparator": [{ "inlines": [{ "text": "\\u0004" }] }], "continuationNotice": [{ "inlines": [] }] }, "endnotes": { "separator": [{ "inlines": [{ "text": "\\u0003" }] }], "continuationSeparator": [{ "inlines": [{ "text": "\\u0004" }] }], "continuationNotice": [{ "inlines": [] }] }, "compatibilityMode": "Word2013" }
describe('Selection header and footer  validation weblayout', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true, layoutType: 'Continuous' });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(json));
        editor.selection.selectAll();
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
    it('Default paragraph border validation', () => {
        console.log('Default paragraph border validation');
        editor.selection.moveDown();
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.color).toBe("#FF0000FF");
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.isBorderDefined).toBe(true);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.hasNoneStyle).toBe(false);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.lineStyle).toBe("Single");
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.lineWidth).toBe(1);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.shadow).toBe(false);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.space).toBe(4);
    });
    it('inline style paragraph border validation', () => {
        console.log('inline style paragraph border validation');
        editor.selection.moveDown();
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.color).toBe("#FF0000FF");
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.isBorderDefined).toBe(true);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.hasNoneStyle).toBe(false);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.lineStyle).toBe("Single");
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.lineWidth).toBe(1);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.shadow).toBe(false);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.space).toBe(4);
    });
    it('apply style paragraph border validation', () => {
        console.log('base style paragraph border validation');
        editor.selection.moveDown();
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.color).toBe("#FF0000FF");
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.isBorderDefined).toBe(true);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.hasNoneStyle).toBe(false);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.lineStyle).toBe("Single");
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.lineWidth).toBe(1);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.shadow).toBe(false);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.space).toBe(4);
    });
    it('based on style paragraph border validation', () => {
        console.log('based on style paragraph border validation');
        editor.selection.moveDown();
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.color).toBe("#FF0000FF");
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.isBorderDefined).toBe(true);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.hasNoneStyle).toBe(false);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.lineStyle).toBe("Single");
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.lineWidth).toBe(1);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.shadow).toBe(false);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.space).toBe(4);
    });
    it('based on-to based on style paragraph border validation', () => {
        console.log('based on-to based on style paragraph border validation');
        editor.selection.moveDown();
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.color).toBe("#FF0000FF");
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.isBorderDefined).toBe(true);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.hasNoneStyle).toBe(false);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.lineStyle).toBe("Single");
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.lineWidth).toBe(1);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.shadow).toBe(false);
        expect(editor.selection.start.paragraph.paragraphFormat.borders.left.space).toBe(4);
    });
});

let afterSpacingDocument :any = {"sections":[{"sectionFormat":{"pageWidth":595.2999877929688,"pageHeight":841.9000244140625,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":35.400001525878906,"footerDistance":5.650000095367432,"bidi":false,"pageNumberStyle":"Arabic"},"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{},"tabs":[{"position":188.4499969482422,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\t"}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"firstLineIndent":-42.54999923706055,"textAlignment":"Justify","styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"imageString":"data:image/png;base64,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","isMetaFile":false,"width":176.57141,"height":25.12748,"iscrop":false,"name":"Picture 28","alternativeText":"A picture containing drawing, stool, table\n\nDescription automatically generated","visible":true,"widthScale":42.419556,"heightScale":42.40925,"verticalPosition":0,"verticalOrigin":"Margin","verticalAlignment":"None","horizontalPosition":0,"horizontalOrigin":"Margin","horizontalAlignment":"None","allowOverlap":true,"textWrappingStyle":"Inline","textWrappingType":"Both","layoutInCell":true,"zOrderPosition":2147483647}]}]},"footer":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":468,"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":11,"name":"Straight Connector 11","visible":true,"width":560,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":13.4,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":-50.089999999999996,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251659264,"allowOverlap":true,"textWrappingStyle":"InFrontOfText","textWrappingType":"Both","distanceBottom":0,"distanceLeft":9,"distanceRight":9,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"lineFormatType":"Solid","color":"#4472C4FF","weight":0.5,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":7.087000000000001,"rightMargin":7.087000000000001,"topMargin":3.685,"bottomMargin":3.685,"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":-49.650001525878906,"firstLineIndent":-7.050000190734863,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#648AB1FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"inlines":[{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#648AB1FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"\u000b"},{"characterFormat":{},"imageString":"data:image/jpeg;base64,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","isMetaFile":false,"width":38.35,"height":23.1,"iscrop":false,"name":"Picture 30","visible":true,"widthScale":52.534245,"heightScale":52.5,"verticalPosition":16.15,"verticalOrigin":"Paragraph","verticalAlignment":"None","horizontalPosition":471.55,"horizontalOrigin":"Column","horizontalAlignment":"None","allowOverlap":true,"textWrappingStyle":"Square","textWrappingType":"Both","layoutInCell":true,"zOrderPosition":251660288},{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#648AB1FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"180 Grand Avenue, Suite 600, Oakland, California 94612"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"}]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"firstLineIndent":-49.650001525878906,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#648AB1FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"marqeta.com"},{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#648AB1FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"\t"},{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#648AB1FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"\t"},{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#648AB1FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"\t"},{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#648AB1FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"\t"},{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#648AB1FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"\t"},{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#648AB1FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"\t"},{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#648AB1FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"\t"},{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#648AB1FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"\t"},{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#648AB1FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"\t"},{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#648AB1FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"\t"},{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#648AB1FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"\t"},{"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#648AB1FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"text":"\t"}]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":468,"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\t"}]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false,"localeIdBidi":1025},"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Header","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":225.64999389648438,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":451.29998779296875,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":225.64999389648438,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":451.29998779296875,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"_Hlk99714206"},{"characterFormat":{},"bookmarkType":1,"name":"_Hlk99714206"},{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Document default paragraph format validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
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
        }, 500);
    });
    it("Document default paragraph format validation",()=>{
        console.log("Document default paragraph format validation");
        editor.open(JSON.stringify(afterSpacingDocument));
        let paragraph: ParagraphWidget = (editor.documentHelper.pages[0] as Page).footerWidgetIn.childWidgets[2] as ParagraphWidget;
        expect(editor.documentHelper.paragraphFormat.afterSpacing).toBe(8);
        expect(paragraph.isInHeaderFooter).toBe(true);
        expect(paragraph.paragraphFormat.afterSpacing).toBe(8);
    });
});

describe('Adding Indentation for paragraph', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true, layoutType: 'Continuous' });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(json));
        editor.selection.selectAll();
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
    it('Decreasing indent for paragraph that is indented using increase indent functionality', () => {
        console.log('Decreasing indent for paragraph that is indented using increase indent functionality');
        editor.editor.insertText("Test");
        let initialLeftIndent : number = editor.selection.start.paragraph.paragraphFormat.leftIndent;
        editor.editor.increaseIndent();
        expect(editor.selection.start.paragraph.paragraphFormat.leftIndent).toBe(36);
        editor.editor.decreaseIndent();
        expect(editor.selection.start.paragraph.paragraphFormat.leftIndent).toBe(initialLeftIndent);
    });
    it('Decreasing indent for paragraph that is indented using Tab key functionality', () => {
        console.log('Decreasing indent for paragraph that is indented using increase indent functionality');
        editor.openBlank();
        editor.editor.insertText("Test");
        editor.selection.moveToDocumentStart();
        let initialLeftIndent : number = editor.selection.start.paragraph.paragraphFormat.leftIndent;
        editor.selection.handleTabKey(true,false);
        expect(editor.selection.start.paragraph.paragraphFormat.leftIndent).toBe(36);
        editor.selection.handleTabKey(false,true);
        expect(editor.selection.start.paragraph.paragraphFormat.leftIndent).toBe(initialLeftIndent);
    });
});

describe('Undo and Redo validation for paragraph using increase functionality', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true, layoutType: 'Continuous' });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(json));
        editor.selection.selectAll();
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
    it('Increasing indent in paragraph and perform undo and redo action - 1', () => {
        console.log('Increasing indent in paragraph and perform undo and redo action - 1');
        editor.editor.insertText("Test");
        let initialLeftIndent : number = editor.selection.start.paragraph.paragraphFormat.leftIndent;
        for(let i = 0; i < 5; i++) {
            editor.editor.increaseIndent();
        }
        let indentedLeftIndent : number = editor.selection.start.paragraph.paragraphFormat.leftIndent;
        for(let i = 0; i < 5; i++) {
            editor.editorHistory.undo();
        }
        expect(editor.selection.start.paragraph.paragraphFormat.leftIndent).toBe(initialLeftIndent);
        for(let i = 0; i < 5; i++) {
            editor.editorHistory.redo();
        }
        expect(editor.selection.start.paragraph.paragraphFormat.leftIndent).toBe(indentedLeftIndent);
    });

    it('Increasing indent in paragraph and perform undo and redo action - 2', () => {
        console.log('Increasing indent in paragraph and perform undo and redo action - 2');
        editor.openBlank();
        editor.editor.insertText("Test");
        let initialLeftIndent : number = editor.selection.start.paragraph.paragraphFormat.leftIndent;
        editor.editor.increaseIndent();
        let indentedLeftIndent : number = editor.selection.start.paragraph.paragraphFormat.leftIndent;
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.paragraphFormat.leftIndent).toBe(initialLeftIndent);
        editor.editorHistory.redo();
        for(let i = 0; i < 5; i++) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
        }
        expect(editor.selection.start.paragraph.paragraphFormat.leftIndent).toBe(indentedLeftIndent);
    });
});

describe('Undo and Redo validation for paragraph using Tab key functionality', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true, layoutType: 'Continuous' });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(json));
        editor.selection.selectAll();
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
    it('Increasing indent in paragraph and perform undo and redo action - 1', () => {
        console.log('Increasing indent in paragraph and perform undo and redo action - 1');
        editor.editor.insertText("Test");
        editor.selection.moveToDocumentStart();
        let initialLeftIndent : number = editor.selection.start.paragraph.paragraphFormat.leftIndent;
        for(let i = 0; i < 5; i++) {
            editor.selection.handleTabKey(true,false);
        }
        let indentedLeftIndent : number = editor.selection.start.paragraph.paragraphFormat.leftIndent;
        for(let i = 0; i < 5; i++) {
            editor.editorHistory.undo();
        }
        expect(editor.selection.start.paragraph.paragraphFormat.leftIndent).toBe(initialLeftIndent);
        for(let i = 0; i < 5; i++) {
            editor.editorHistory.redo();
        }
        expect(editor.selection.start.paragraph.paragraphFormat.leftIndent).toBe(indentedLeftIndent);
    });

    it('Increasing indent in paragraph and perform undo and redo action - 2', () => {
        console.log('Increasing indent in paragraph and perform undo and redo action - 2');
        editor.openBlank();
        editor.editor.insertText("Test");
        editor.selection.moveToDocumentStart();
        let initialLeftIndent : number = editor.selection.start.paragraph.paragraphFormat.leftIndent;
        editor.selection.handleTabKey(true,false);
        let indentedLeftIndent : number = editor.selection.start.paragraph.paragraphFormat.leftIndent;
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.paragraphFormat.leftIndent).toBe(initialLeftIndent);
        editor.editorHistory.redo();
        for(let i = 0; i < 5; i++) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
        }
        expect(editor.selection.start.paragraph.paragraphFormat.leftIndent).toBe(indentedLeftIndent);
    });
});