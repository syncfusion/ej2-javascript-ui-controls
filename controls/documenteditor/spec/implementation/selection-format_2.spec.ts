import { SelectionCharacterFormat, SelectionParagraphFormat, SelectionSectionFormat, SelectionTableFormat, SelectionCellFormat, SelectionRowFormat, DocumentHelper, Page, Point } from '../../src/index';
import { WParagraphFormat, WSectionFormat, WRowFormat, WCellFormat, WCharacterFormat } from '../../src/document-editor/implementation/format/index';
import { WidthType, HeightType, Strikethrough, CellVerticalAlignment, Underline, BaselineAlignment } from '../../src/document-editor/base/types';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { LayoutViewer, PageLayoutViewer, WebLayoutViewer } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/index';
import { LineWidget, ParagraphWidget } from '../../src/index';
let json: Object = {
    "sections": [
        {
            "blocks": [
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 0,
                        "rightIndent": 0,
                        "firstLineIndent": 0,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left"
                    },
                    "inlines": [
                        {
                            "text": "Hi Hello",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 0,
                        "rightIndent": 0,
                        "firstLineIndent": 0,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left"
                    },
                    "inlines": [
                        {
                            "text": "welcome",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        },
                        {
                            "text": " ",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                }
            ],
            "headersFooters": {},
            "sectionFormat": {
                "headerDistance": 36,
                "footerDistance": 36,
                "pageWidth": 612,
                "pageHeight": 792,
                "leftMargin": 72,
                "rightMargin": 72,
                "topMargin": 72,
                "bottomMargin": 72,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false
            }
        }
    ],
    "characterFormat": {
        "bold": false,
        "italic": false,
        "strikethrough": "None",
        "baselineAlignment": "Normal",
        "fontSize": 11,
        "fontFamily": "Calibri"
    },
    "background": {
        "color": "#FFFFFFFF"
    }
};
describe('Selection section Format validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeEach(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(json));
        documentHelper = editor.documentHelper;
    });
    afterEach((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        setTimeout(() => {
            done();
        }, 1000);
    });

    it('Page width and Page Height validation', () => {
console.log('Page width and Page Height validation');
        editor.selection.sectionFormat.pageHeight = 100;
        expect(editor.selection.sectionFormat.pageHeight).toBe(100);
        editor.editorHistory.undo();
        expect(editor.selection.sectionFormat.pageHeight).toBe(792);
        editor.editorHistory.redo();
        expect(editor.selection.sectionFormat.pageHeight).toBe(100);
    });
    it('Left and right margin validation', () => {
console.log('Left and right margin validation');
        editor.selection.sectionFormat.leftMargin = 172;
        expect(editor.selection.sectionFormat.leftMargin).toBe(172);
        editor.editorHistory.undo();
        expect(editor.selection.sectionFormat.leftMargin).toBe(72);
        editor.editorHistory.redo();
        expect(editor.selection.sectionFormat.leftMargin).toBe(172);
        editor.selection.sectionFormat.rightMargin = 172;
        expect(editor.selection.sectionFormat.rightMargin).toBe(172);
        editor.editorHistory.undo();
        expect(editor.selection.sectionFormat.rightMargin).toBe(72);
    });
    it('top and bottom margin validation', () => {
console.log('top and bottom margin validation');
        editor.selection.sectionFormat.bottomMargin = 172;
        expect(editor.selection.sectionFormat.bottomMargin).toBe(172);
        editor.editorHistory.undo();
        expect(editor.selection.sectionFormat.bottomMargin).toBe(72);
        editor.editorHistory.redo();
        expect(editor.selection.sectionFormat.bottomMargin).toBe(172);
        editor.selection.sectionFormat.topMargin = 172;
        expect(editor.selection.sectionFormat.topMargin).toBe(172);
        editor.editorHistory.undo();
        expect(editor.selection.sectionFormat.topMargin).toBe(72);
    });
    it('section format value as invalid cases', () => {
console.log('section format value as invalid cases');
        editor.selection.sectionFormat.bottomMargin = -2;
        editor.selection.sectionFormat.rightMargin = -2;
        editor.selection.sectionFormat.topMargin = -2;
        editor.selection.sectionFormat.leftMargin = -2;
        editor.selection.sectionFormat.pageWidth = -2;
        editor.selection.sectionFormat.pageHeight = -2;
        expect('').toBe('');
    });
    it('header and footer validation', () => {
console.log('header and footer validation');
        editor.selection.sectionFormat.differentFirstPage = true;
        expect(editor.selection.sectionFormat.differentFirstPage).toBeTruthy();
        editor.editorHistory.undo();
        expect(editor.selection.sectionFormat.differentFirstPage).toBeFalsy();
        editor.selection.sectionFormat.differentOddAndEvenPages = true;
        expect(editor.selection.sectionFormat.differentOddAndEvenPages).toBeTruthy();
        editor.editorHistory.undo();
        expect(editor.selection.sectionFormat.differentOddAndEvenPages).toBeFalsy();
    });
});
describe('Selection character and paragraph Format validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(json));
        editor.selection.selectAll();
        documentHelper = editor.documentHelper;
    });
    beforeEach(() => {
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

    it('character format validation', () => {
console.log('character format validation');
        editor.editorModule.onApplyCharacterFormat('bold', true, false);
        expect(editor.selection.characterFormat.bold).toBe(true);
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.bold).toBe(false);
        editor.editorHistory.redo();
        expect(editor.selection.characterFormat.bold).toBe(true);
        editor.editorModule.onApplyCharacterFormat('underline', 'Single', false);
        expect(editor.selection.characterFormat.underline).toBe('Single');
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.underline).toBe('None');
    });
    it('paragraph format validation', () => {
console.log('paragraph format validation');
        editor.editorModule.onApplyParagraphFormat('textAlignment', 'Right', false, false);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Right');
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Left');
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Right');
        editor.editorModule.onApplyParagraphFormat('beforeSpacing', 15, false, false)
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(15);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(0);
        // editor.editorHistory.redo();
        // expect(editor.selection.paragraphFormat.beforeSpacing).toBe(15);
    });

});
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
    beforeEach(() => {
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
    it('header and footer validation for weblayout', () => {
console.log('header and footer validation for weblayout');
        let page: Page = (editor.documentHelper.pages[0]);
        let point: Point = new Point(0, 0);
        let isheader: Boolean = editor.selection.isCursorInHeaderRegion(point, page);
        let isfooter: Boolean = editor.selection.isCursorInFooterRegion(point, page);
        expect(isheader).toBe(false);
        expect(isfooter).toBe(false);
    });
    // it('selection highlighter validation', () => {
    //   expect(editor.documentHelper.containerContext.globalAlpha).toBe(1);
    //   expect(editor.documentHelper.selectionContext.globalAlpha).toBe(0.4);
    //});
});


let sectionFormatJson : Object ={
    "sections": [
      {
        "blocks": [
          {
            "characterFormat": { "fontColor": "empty" },
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": [
              {
                "text": "First section",
                "characterFormat": { "fontColor": "empty" }
              }
            ]
          }
        ],
        "headersFooters": {
          "header": {
            "blocks": [
              {
                "characterFormat": { "fontColor": "empty" },
                "paragraphFormat": { "styleName": "Header" },
                "inlines": []
              }
            ]
          },
          "footer": {
            "blocks": [
              {
                "characterFormat": { "fontColor": "empty" },
                "paragraphFormat": { "styleName": "Footer" },
                "inlines": [
                  {
                    "name": "_GoBack",
                    "bookmarkType": 0
                  },
                  {
                    "name": "_GoBack",
                    "bookmarkType": 1
                  },
                  {
                    "hasFieldEnd": true,
                    "characterFormat": { "fontColor": "empty" },
                    "fieldType": 0
                  },
                  {
                    "text": " PAGE \\* MERGEFORMAT ",
                    "characterFormat": { "fontColor": "empty" }
                  },
                  { "fieldType": 2 },
                  {
                    "text": "1",
                    "characterFormat": { "fontColor": "empty" }
                  },
                  { "fieldType": 1 }
                ]
              }
            ]
          },
          "evenHeader": {
            "blocks": [
              {
                "characterFormat": { "fontColor": "empty" },
                "paragraphFormat": { "styleName": "Header" },
                "inlines": []
              }
            ]
          },
          "evenFooter": {
            "blocks": [
              {
                "characterFormat": { "fontColor": "empty" },
                "paragraphFormat": { "styleName": "Footer" },
                "inlines": []
              }
            ]
          },
          "firstPageHeader": {
            "blocks": [
              {
                "characterFormat": { "fontColor": "empty" },
                "paragraphFormat": { "styleName": "Header" },
                "inlines": []
              }
            ]
          },
          "firstPageFooter": {
            "blocks": [
              {
                "characterFormat": { "fontColor": "empty" },
                "paragraphFormat": { "styleName": "Footer" },
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
          "pageStartingNumber": 0
        }
      },
      {
        "blocks": [
          {
            "characterFormat": { "fontColor": "empty" },
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": []
          }
        ],
        "headersFooters": {},
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
          "restartPageNumbering": true,
          "pageStartingNumber": 1
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
    "background": { "color": "#FFFFFFFF" },
    "styles": [
      {
        "type": "Paragraph",
        "name": "Normal",
        "next": "Normal",
        "characterFormat": { "fontColor": "empty" }
      },
      {
        "type": "Character",
        "name": "Default Paragraph Font",
        "characterFormat": { "fontColor": "empty" }
      },
      {
        "type": "Paragraph",
        "name": "Header",
        "basedOn": "Normal",
        "next": "Header",
        "link": "Header Char",
        "characterFormat": { "fontColor": "empty" },
        "paragraphFormat": {
          "afterSpacing": 0.0,
          "lineSpacing": 1.0,
          "lineSpacingType": "Multiple",
          "tabs": [
            {
              "tabJustification": "Center",
              "position": 225.64999389648438,
              "tabLeader": "None",
              "deletePosition": 0.0
            },
            {
              "tabJustification": "Right",
              "position": 451.29998779296875,
              "tabLeader": "None",
              "deletePosition": 0.0
            }
          ]
        }
      },
      {
        "type": "Character",
        "name": "Header Char",
        "basedOn": "Default Paragraph Font",
        "characterFormat": { "fontColor": "empty" }
      },
      {
        "type": "Paragraph",
        "name": "Footer",
        "basedOn": "Normal",
        "next": "Footer",
        "link": "Footer Char",
        "characterFormat": { "fontColor": "empty" },
        "paragraphFormat": {
          "afterSpacing": 0.0,
          "lineSpacing": 1.0,
          "lineSpacingType": "Multiple",
          "tabs": [
            {
              "tabJustification": "Center",
              "position": 225.64999389648438,
              "tabLeader": "None",
              "deletePosition": 0.0
            },
            {
              "tabJustification": "Right",
              "position": 451.29998779296875,
              "tabLeader": "None",
              "deletePosition": 0.0
            }
          ]
        }
      },
      {
        "type": "Character",
        "name": "Footer Char",
        "basedOn": "Default Paragraph Font",
        "characterFormat": { "fontColor": "empty" }
      }
    ],
    "defaultTabWidth": 35.400001525878906,
    "formatting": false,
    "trackChanges": false,
    "protectionType": "NoProtection",
    "enforcement": false,
    "dontUseHTMLParagraphAutoSpacing": false,
    "alignTablesRowByRow": false
  };

describe('Add support to apply restart page number and pageStartingNumber for different sections', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeEach(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(sectionFormatJson));
        documentHelper = editor.documentHelper;
    });
    afterEach((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        setTimeout(() => {
            done();
        }, 1000);
    });

    it('PageStartingNumber validation', () => {
console.log('PageStartingNumber validation');
        // Before apply restart page number
        expect(editor.documentHelper.pages[1].currentPageNum).toBe(1);
        editor.selection.goToPage(2);
        editor.selection.goToFooter();
        editor.selection.sectionFormat.pageStartingNumber = 2;
        // After apply restart page number
        expect(editor.documentHelper.pages[1].currentPageNum).toBe(2);
    });
});
