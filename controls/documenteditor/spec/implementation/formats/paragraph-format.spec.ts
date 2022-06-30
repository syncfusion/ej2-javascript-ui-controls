import { WParagraphFormat } from '../../../src/document-editor/implementation/format/paragraph-format';
import { WListFormat } from '../../../src/document-editor/implementation/format/list-format';
import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { TestHelper } from '../../test-helper.spec';
import { SfdtExport } from '../../../src/document-editor/implementation/writer/sfdt-export';
import { BodyWidget, DocumentHelper, ParagraphWidget } from '../../../src/index';
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