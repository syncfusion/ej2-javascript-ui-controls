import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget, TableWidget, FieldElementBox, TextFormField, ElementBox, WParagraphFormat, WCharacterFormat, HelperMethods, ContentControlWidgetType, ContentControlType, IWidget, TableRowWidget, DocumentHelper, Page, PageSetupDialog } from '../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { ImageResizer } from '../../src/document-editor/implementation/editor/image-resizer';
import { Editor, EditorHistory, TableCellWidget, TextElementBox, TextHelper, RtlInfo, ListTextElementBox, LineWidget, TabElementBox, TextPosition } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';
/**
 * Merge format paste validation
 */
describe('Paste sfdt', () => {
  let editor: DocumentEditor = undefined;
  beforeAll(() => {
    document.body.innerHTML = '';
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
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
  it('Merge With ExistingFormatting option validation', () => {
    console.log('Merge With ExistingFormatting option validation');
    editor.editorModule.insertText('sample');
    editor.selection.handleLeftKey();
    editor.selection.handleLeftKey();
    let str = '{"sections":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left","styleName":"Normal","bidi":false},"inlines":[{"text":"Sadsadsadsa","characterFormat":{"bold":true,"italic":true,"underline":"Single","strikethrough":"None","fontSize":18,"fontFamily":"Calibri","fontColor":"#70AD47FF","bidi":false,"fontSizeBidi":18,"fontFamilyBidi":"Calibri"}}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36,"footerDistance":36,"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#00000000","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left"}},{"type":"Character","name":"Default Paragraph Font"}],"defaultTabWidth":36,"formatting":false,"protectionType":"NoProtection","enforcement":false}';
    editor.editorModule.paste(str, 'MergeWithExistingFormatting');
    expect(editor.selection.start.currentWidget.children[1].characterFormat.fontSize).toBe(11);
  });
});

describe('Merge List on paste', () => {
  let editor: DocumentEditor = undefined;
  beforeAll(() => {
    document.body.innerHTML = '';
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
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
  it('Merge List validation', () => {
    let doc: any = {
      "sections": [
          {
              "blocks": [
                  {
                      "characterFormat": {
                          "bold": true,
                          "fontColor": "empty",
                          "boldBidi": true,
                          "fontFamilyBidi": "Arial"
                      },
                      "paragraphFormat": {
                          "leftIndent": 2.8499999046325684,
                          "beforeSpacing": 4.0,
                          "textAlignment": "Justify",
                          "styleName": "Normal",
                          "tabs": [
                              {
                                  "tabJustification": "Left",
                                  "position": 31.5,
                                  "tabLeader": "None",
                                  "deletePosition": 0.0
                              },
                              {
                                  "tabJustification": "Left",
                                  "position": 40.5,
                                  "tabLeader": "None",
                                  "deletePosition": 0.0
                              }
                          ]
                      },
                      "inlines": [
                          {
                              "text": "    ",
                              "characterFormat": {
                                  "fontColor": "empty",
                                  "fontFamilyBidi": "Arial"
                              }
                          },
                          {
                              "text": "Commercial terms and conditions ",
                              "characterFormat": {
                                  "bold": true,
                                  "fontColor": "empty",
                                  "boldBidi": true,
                                  "fontFamilyBidi": "Arial"
                              }
                          },
                          {
                              "text": "are ",
                              "characterFormat": {
                                  "bold": true,
                                  "fontColor": "empty",
                                  "boldBidi": true,
                                  "fontFamilyBidi": "Arial"
                              }
                          },
                          {
                              "text": "mentioned below",
                              "characterFormat": {
                                  "bold": true,
                                  "fontColor": "empty",
                                  "boldBidi": true,
                                  "fontFamilyBidi": "Arial"
                              }
                          },
                          {
                              "text": ":",
                              "characterFormat": {
                                  "bold": true,
                                  "fontColor": "empty",
                                  "boldBidi": true,
                                  "fontFamilyBidi": "Arial"
                              }
                          }
                      ]
                  },
                  {
                      "characterFormat": {
                          "bold": false,
                          "fontSize": 12.0,
                          "fontColor": "empty",
                          "boldBidi": true,
                          "fontSizeBidi": 12.0,
                          "allCaps": false
                      },
                      "paragraphFormat": {
                          "leftIndent": 42.5,
                          "firstLineIndent": -24.649999618530273,
                          "beforeSpacing": 6.0,
                          "afterSpacing": 0.0,
                          "lineSpacing": 1.5,
                          "lineSpacingType": "Multiple",
                          "styleName": "Heading 1",
                          "listFormat": {
                              "listLevelNumber": 0,
                              "listId": 1
                          },
                          "tabs": [
                              {
                                  "tabJustification": "Left",
                                  "position": 40.5,
                                  "tabLeader": "None",
                                  "deletePosition": 0.0
                              }
                          ]
                      },
                      "inlines": [
                          {
                              "text": "The term ‘",
                              "characterFormat": {
                                  "bold": false,
                                  "fontSize": 12.0,
                                  "fontColor": "empty",
                                  "boldBidi": true,
                                  "fontSizeBidi": 12.0,
                                  "allCaps": false
                              }
                          },
                          {
                              "text": "Contract",
                              "characterFormat": {
                                  "bold": false,
                                  "fontSize": 12.0,
                                  "fontColor": "empty",
                                  "boldBidi": true,
                                  "fontSizeBidi": 12.0,
                                  "allCaps": false
                              }
                          },
                          {
                              "text": "or’, ‘Purchaser’ and ‘",
                              "characterFormat": {
                                  "bold": false,
                                  "fontSize": 12.0,
                                  "fontColor": "empty",
                                  "boldBidi": true,
                                  "fontSizeBidi": 12.0,
                                  "allCaps": false
                              }
                          },
                          {
                              "text": "Contract",
                              "characterFormat": {
                                  "bold": false,
                                  "fontSize": 12.0,
                                  "fontColor": "empty",
                                  "boldBidi": true,
                                  "fontSizeBidi": 12.0,
                                  "allCaps": false
                              }
                          },
                          {
                              "text": "’ have the following meanings in these terms & conditions.",
                              "characterFormat": {
                                  "bold": false,
                                  "fontSize": 12.0,
                                  "fontColor": "empty",
                                  "boldBidi": true,
                                  "fontSizeBidi": 12.0,
                                  "allCaps": false
                              }
                          },
                          {
                              "name": "_Ref523215804",
                              "bookmarkType": 0
                          },
                          {
                              "name": "_Toc177987971",
                              "bookmarkType": 0
                          }
                      ]
                  },
                  {
                      "characterFormat": {
                          "fontSize": 12.0,
                          "fontColor": "empty",
                          "fontSizeBidi": 12.0
                      },
                      "paragraphFormat": {
                          "leftIndent": 17.850000381469727,
                          "rightIndent": -5.650000095367432,
                          "firstLineIndent": 0.0,
                          "beforeSpacing": 6.0,
                          "afterSpacing": 0.0,
                          "lineSpacing": 1.5,
                          "lineSpacingType": "Multiple",
                          "styleName": "Heading 1",
                          "listFormat": {
                              "listLevelNumber": 0,
                              "listId": 1
                          },
                          "tabs": [
                              {
                                  "tabJustification": "Left",
                                  "position": 40.5,
                                  "tabLeader": "None",
                                  "deletePosition": 0.0
                              }
                          ]
                      },
                      "inlines": [
                          {
                              "name": "_Ref523215804",
                              "bookmarkType": 1
                          },
                          {
                              "name": "_Toc177987971",
                              "bookmarkType": 1
                          },
                          {
                              "name": "_Ref523215854",
                              "bookmarkType": 0
                          },
                          {
                              "name": "_Toc177987973",
                              "bookmarkType": 0
                          },
                          {
                              "text": "TERMS of PAYMENT",
                              "characterFormat": {
                                  "fontSize": 12.0,
                                  "fontColor": "empty",
                                  "fontSizeBidi": 12.0
                              }
                          },
                          {
                              "name": "_Ref523215854",
                              "bookmarkType": 1
                          },
                          {
                              "name": "_Toc177987973",
                              "bookmarkType": 1
                          }
                      ]
                  },
                  {
                      "characterFormat": {
                          "bold": false,
                          "fontSizeBidi": 12.0,
                          "fontFamilyBidi": "Arial"
                      },
                      "paragraphFormat": {
                          "leftIndent": 59.79999923706055,
                          "firstLineIndent": -17.850000381469727,
                          "styleName": "Body Text Indent 2",
                          "listFormat": {
                              "listLevelNumber": 0,
                              "listId": 2
                          }
                      },
                      "inlines": [
                          {
                              "text": "Payment ter",
                              "characterFormat": {
                                  "bold": false,
                                  "fontSizeBidi": 12.0,
                                  "fontFamilyBidi": "Arial"
                              }
                          }
                      ]
                  },
                  {
                      "characterFormat": {
                          "bold": false,
                          "fontSizeBidi": 12.0,
                          "fontFamilyBidi": "Arial"
                      },
                      "paragraphFormat": {
                          "leftIndent": 59.79999923706055,
                          "firstLineIndent": -17.850000381469727,
                          "beforeSpacing": 3.0,
                          "styleName": "Body Text Indent 2",
                          "listFormat": {
                              "listLevelNumber": 0,
                              "listId": 2
                          }
                      },
                      "inlines": [
                          {
                              "name": "_Ref523215868",
                              "bookmarkType": 0
                          },
                          {
                              "text": "Credit Period",
                              "characterFormat": {
                                  "bold": false,
                                  "fontSizeBidi": 12.0,
                                  "fontFamilyBidi": "Arial"
                              }
                          },
                          {
                              "text": ":",
                              "characterFormat": {
                                  "bold": false,
                                  "fontSizeBidi": 12.0,
                                  "fontFamilyBidi": "Arial"
                              }
                          }
                      ]
                  },
                  {
                      "characterFormat": {
                          "fontSize": 12.0,
                          "fontColor": "empty",
                          "fontSizeBidi": 12.0
                      },
                      "paragraphFormat": {
                          "leftIndent": 17.850000381469727,
                          "rightIndent": -5.650000095367432,
                          "firstLineIndent": 0.0,
                          "beforeSpacing": 6.0,
                          "afterSpacing": 0.0,
                          "lineSpacing": 1.5,
                          "lineSpacingType": "Multiple",
                          "styleName": "Heading 1",
                          "listFormat": {
                              "listLevelNumber": 0,
                              "listId": 1
                          },
                          "tabs": [
                              {
                                  "tabJustification": "Left",
                                  "position": 40.5,
                                  "tabLeader": "None",
                                  "deletePosition": 0.0
                              }
                          ]
                      },
                      "inlines": [
                          {
                              "name": "_Ref523215868",
                              "bookmarkType": 1
                          },
                          {
                              "text": "delivery / ",
                              "characterFormat": {
                                  "fontSize": 12.0,
                                  "fontColor": "empty",
                                  "fontSizeBidi": 12.0
                              }
                          },
                          {
                              "text": "Co",
                              "characterFormat": {
                                  "fontSize": 12.0,
                                  "fontColor": "empty",
                                  "fontSizeBidi": 12.0
                              }
                          },
                          {
                              "text": "n",
                              "characterFormat": {
                                  "fontSize": 12.0,
                                  "fontColor": "empty",
                                  "fontSizeBidi": 12.0
                              }
                          },
                          {
                              "text": "tract Period",
                              "characterFormat": {
                                  "fontSize": 12.0,
                                  "fontColor": "empty",
                                  "fontSizeBidi": 12.0
                              }
                          }
                      ]
                  },
                  {
                      "characterFormat": {
                          "fontColor": "empty",
                          "boldBidi": true,
                          "fontSizeBidi": 12.0,
                          "fontFamilyBidi": "Arial"
                      },
                      "paragraphFormat": {
                          "leftIndent": 54.75,
                          "firstLineIndent": -14.199999809265137,
                          "beforeSpacing": 0.0,
                          "afterSpacing": 0.0,
                          "textAlignment": "Left",
                          "styleName": "Block Text",
                          "listFormat": {
                              "listLevelNumber": 0,
                              "listId": 3
                          }
                      },
                      "inlines": [
                          {
                              "text": "Delivery period",
                              "characterFormat": {
                                  "fontColor": "empty",
                                  "boldBidi": true,
                                  "fontSizeBidi": 12.0,
                                  "fontFamilyBidi": "Arial"
                              }
                          }
                      ]
                  },
                  {
                      "characterFormat": {
                          "fontColor": "empty",
                          "boldBidi": true,
                          "fontSizeBidi": 12.0,
                          "fontFamilyBidi": "Arial"
                      },
                      "paragraphFormat": {
                          "leftIndent": 54.75,
                          "firstLineIndent": -14.199999809265137,
                          "beforeSpacing": 0.0,
                          "afterSpacing": 0.0,
                          "textAlignment": "Left",
                          "styleName": "Block Text",
                          "listFormat": {
                              "listLevelNumber": 0,
                              "listId": 3
                          }
                      },
                      "inlines": [
                          {
                              "text": "Contract period for ‘operation and training",
                              "characterFormat": {
                                  "fontColor": "empty",
                                  "boldBidi": true,
                                  "fontSizeBidi": 12.0,
                                  "fontFamilyBidi": "Arial"
                              }
                          },
                          {
                              "text": "’",
                              "characterFormat": {
                                  "fontColor": "empty",
                                  "boldBidi": true,
                                  "fontSizeBidi": 12.0,
                                  "fontFamilyBidi": "Arial"
                              }
                          },
                          {
                              "text": " ",
                              "characterFormat": {
                                  "bold": true,
                                  "fontColor": "empty",
                                  "fontSizeBidi": 12.0,
                                  "fontFamilyBidi": "Arial"
                              }
                          },
                          {
                              "text": "o",
                              "characterFormat": {
                                  "fontColor": "empty",
                                  "boldBidi": true,
                                  "fontSizeBidi": 12.0,
                                  "fontFamilyBidi": "Arial"
                              }
                          },
                          {
                              "text": "f SDCFFTF: ",
                              "characterFormat": {
                                  "fontColor": "empty",
                                  "boldBidi": true,
                                  "fontSizeBidi": 12.0,
                                  "fontFamilyBidi": "Arial"
                              }
                          },
                          {
                              "text": "10 ",
                              "characterFormat": {
                                  "bold": true,
                                  "fontColor": "empty",
                                  "fontSizeBidi": 12.0,
                                  "fontFamilyBidi": "Arial"
                              }
                          },
                          {
                              "text": "(Ten) ",
                              "characterFormat": {
                                  "bold": true,
                                  "fontColor": "empty",
                                  "fontSizeBidi": 12.0,
                                  "fontFamilyBidi": "Arial"
                              }
                          },
                          {
                              "text": "Years",
                              "characterFormat": {
                                  "bold": true,
                                  "fontColor": "empty",
                                  "fontSizeBidi": 12.0,
                                  "fontFamilyBidi": "Arial"
                              }
                          }
                      ]
                  },
                  {
                      "characterFormat": {
                          "fontColor": "empty",
                          "boldBidi": true,
                          "fontSizeBidi": 12.0,
                          "fontFamilyBidi": "Arial"
                      },
                      "paragraphFormat": {
                          "leftIndent": 54.75,
                          "firstLineIndent": -14.199999809265137,
                          "beforeSpacing": 0.0,
                          "afterSpacing": 0.0,
                          "textAlignment": "Left",
                          "styleName": "Block Text",
                          "listFormat": {
                              "listLevelNumber": 0,
                              "listId": 3
                          }
                      },
                      "inlines": [
                          {
                              "text": "Contract period",
                              "characterFormat": {
                                  "fontColor": "empty",
                                  "boldBidi": true,
                                  "fontSizeBidi": 12.0,
                                  "fontFamilyBidi": "Arial"
                              }
                          }
                      ]
                  },
                  {
                      "characterFormat": {
                          "fontSize": 12.0,
                          "fontColor": "empty",
                          "fontSizeBidi": 12.0
                      },
                      "paragraphFormat": {
                          "leftIndent": 17.850000381469727,
                          "rightIndent": -5.650000095367432,
                          "firstLineIndent": 0.0,
                          "beforeSpacing": 6.0,
                          "afterSpacing": 0.0,
                          "lineSpacing": 1.5,
                          "lineSpacingType": "Multiple",
                          "styleName": "Heading 1",
                          "listFormat": {
                              "listLevelNumber": 0,
                              "listId": 1
                          },
                          "tabs": [
                              {
                                  "tabJustification": "Left",
                                  "position": 40.5,
                                  "tabLeader": "None",
                                  "deletePosition": 0.0
                              }
                          ]
                      },
                      "inlines": [
                          {
                              "name": "_Toc341851418",
                              "bookmarkType": 0
                          },
                          {
                              "name": "_Toc341877181",
                              "bookmarkType": 0
                          },
                          {
                              "name": "_Toc349110276",
                              "bookmarkType": 0
                          },
                          {
                              "name": "_Toc349113786",
                              "bookmarkType": 0
                          },
                          {
                              "name": "_Toc349114135",
                              "bookmarkType": 0
                          },
                          {
                              "name": "_Toc349114519",
                              "bookmarkType": 0
                          },
                          {
                              "name": "_Toc349114656",
                              "bookmarkType": 0
                          },
                          {
                              "name": "_Toc349114765",
                              "bookmarkType": 0
                          },
                          {
                              "name": "_Toc349114950",
                              "bookmarkType": 0
                          },
                          {
                              "name": "_Toc349115247",
                              "bookmarkType": 0
                          },
                          {
                              "name": "_Toc349115432",
                              "bookmarkType": 0
                          },
                          {
                              "name": "_Toc349115512",
                              "bookmarkType": 0
                          },
                          {
                              "name": "_Toc349115580",
                              "bookmarkType": 0
                          },
                          {
                              "name": "_Ref523215974",
                              "bookmarkType": 0
                          },
                          {
                              "name": "_Toc177987982",
                              "bookmarkType": 0
                          },
                          {
                              "text": "LIQUIDAtED DAMAGES",
                              "characterFormat": {
                                  "fontSize": 12.0,
                                  "fontColor": "empty",
                                  "fontSizeBidi": 12.0
                              }
                          },
                          {
                              "name": "_Toc341851418",
                              "bookmarkType": 1
                          },
                          {
                              "name": "_Toc341877181",
                              "bookmarkType": 1
                          },
                          {
                              "name": "_Toc349110276",
                              "bookmarkType": 1
                          },
                          {
                              "name": "_Toc349113786",
                              "bookmarkType": 1
                          },
                          {
                              "name": "_Toc349114135",
                              "bookmarkType": 1
                          },
                          {
                              "name": "_Toc349114519",
                              "bookmarkType": 1
                          },
                          {
                              "name": "_Toc349114656",
                              "bookmarkType": 1
                          },
                          {
                              "name": "_Toc349114765",
                              "bookmarkType": 1
                          },
                          {
                              "name": "_Toc349114950",
                              "bookmarkType": 1
                          },
                          {
                              "name": "_Toc349115247",
                              "bookmarkType": 1
                          },
                          {
                              "name": "_Toc349115432",
                              "bookmarkType": 1
                          },
                          {
                              "name": "_Toc349115512",
                              "bookmarkType": 1
                          },
                          {
                              "name": "_Toc349115580",
                              "bookmarkType": 1
                          },
                          {
                              "name": "_Ref523215974",
                              "bookmarkType": 1
                          },
                          {
                              "name": "_Toc177987982",
                              "bookmarkType": 1
                          }
                      ]
                  },
                  {
                      "characterFormat": {
                          "fontColor": "empty",
                          "fontFamilyBidi": "Arial"
                      },
                      "paragraphFormat": {
                          "leftIndent": 58.70000076293945,
                          "textAlignment": "Justify",
                          "styleName": "Normal",
                          "listFormat": {
                              "listLevelNumber": 0,
                              "listId": 4
                          }
                      },
                      "inlines": [
                          {
                              "text": "Supply, ",
                              "characterFormat": {
                                  "underline": "Single",
                                  "fontColor": "empty",
                                  "boldBidi": true,
                                  "fontFamilyBidi": "Arial"
                              }
                          },
                          {
                              "text": "installation ",
                              "characterFormat": {
                                  "underline": "Single",
                                  "fontColor": "empty",
                                  "boldBidi": true,
                                  "fontFamilyBidi": "Arial"
                              }
                          }
                      ]
                  },
                  {
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 58.70000076293945,
                          "textAlignment": "Justify",
                          "styleName": "Normal",
                          "listFormat": {
                              "listLevelNumber": 0,
                              "listId": 4
                          }
                      },
                      "inlines": [
                          {
                              "text": "Operation",
                              "characterFormat": {
                                  "underline": "Single",
                                  "fontColor": "empty",
                                  "boldBidi": true,
                                  "fontFamilyBidi": "Arial"
                              }
                          }
                      ]
                  }
              ],
              "headersFooters": {
                  "header": {
                      "blocks": [
                          {
                              "characterFormat": {
                                  "bold": true,
                                  "fontSize": 11.0,
                                  "fontColor": "empty"
                              },
                              "paragraphFormat": {
                                  "lineSpacing": 1.0,
                                  "lineSpacingType": "Multiple",
                                  "styleName": "Header",
                                  "tabs": [
                                      {
                                          "tabJustification": "Left",
                                          "position": 0.0,
                                          "tabLeader": "None",
                                          "deletePosition": 216.0
                                      },
                                      {
                                          "tabJustification": "Left",
                                          "position": 0.0,
                                          "tabLeader": "None",
                                          "deletePosition": 432.0
                                      },
                                      {
                                          "tabJustification": "Left",
                                          "position": 271.6499938964844,
                                          "tabLeader": "None",
                                          "deletePosition": 0.0
                                      }
                                  ]
                              },
                              "inlines": [
                                  {
                                      "text": "\t",
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty"
                                      }
                                  }
                              ]
                          },
                          {
                              "characterFormat": {
                                  "bold": true,
                                  "fontSize": 11.0,
                                  "fontColor": "empty",
                                  "fontSizeBidi": 11.0
                              },
                              "paragraphFormat": {
                                  "leftIndent": 7.099999904632568,
                                  "lineSpacing": 1.3000000715255737,
                                  "lineSpacingType": "Multiple",
                                  "styleName": "Header",
                                  "tabs": [
                                      {
                                          "tabJustification": "Left",
                                          "position": 0.0,
                                          "tabLeader": "None",
                                          "deletePosition": 432.0
                                      },
                                      {
                                          "tabJustification": "Right",
                                          "position": 446.54998779296875,
                                          "tabLeader": "None",
                                          "deletePosition": 0.0
                                      }
                                  ]
                              },
                              "inlines": [
                                  {
                                      "text": "DEFENCE/SUP/E03180482/T",
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "fontSizeBidi": 11.0
                                      }
                                  },
                                  {
                                      "text": "\t",
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "fontSizeBidi": 11.0
                                      }
                                  },
                                  {
                                      "text": "\t",
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "fontSizeBidi": 11.0
                                      }
                                  },
                                  {
                                      "text": "L&T DEFENCE",
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "fontSizeBidi": 11.0
                                      }
                                  }
                              ]
                          },
                          {
                              "characterFormat": {
                                  "bold": true,
                                  "fontSize": 11.0,
                                  "fontColor": "empty",
                                  "fontSizeBidi": 11.0
                              },
                              "paragraphFormat": {
                                  "leftIndent": 7.099999904632568,
                                  "lineSpacing": 1.3000000715255737,
                                  "lineSpacingType": "Multiple",
                                  "styleName": "Header",
                                  "tabs": [
                                      {
                                          "tabJustification": "Left",
                                          "position": 0.0,
                                          "tabLeader": "None",
                                          "deletePosition": 432.0
                                      },
                                      {
                                          "tabJustification": "Right",
                                          "position": 446.54998779296875,
                                          "tabLeader": "None",
                                          "deletePosition": 0.0
                                      }
                                  ]
                              },
                              "inlines": [
                                  {
                                      "text": "22 OCTOBER",
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "fontSizeBidi": 11.0
                                      }
                                  },
                                  {
                                      "text": " 2018",
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "fontSizeBidi": 11.0
                                      }
                                  },
                                  {
                                      "text": "\t",
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "fontSizeBidi": 11.0
                                      }
                                  },
                                  {
                                      "text": "\t",
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "fontSizeBidi": 11.0
                                      }
                                  },
                                  {
                                      "text": "Technical",
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "fontSizeBidi": 11.0,
                                          "allCaps": true
                                      }
                                  },
                                  {
                                      "text": " BID",
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "fontSizeBidi": 11.0
                                      }
                                  }
                              ]
                          },
                          {
                              "characterFormat": {
                                  "bold": true,
                                  "underline": "Single",
                                  "fontSize": 11.0,
                                  "fontColor": "empty",
                                  "fontSizeBidi": 11.0,
                                  "allCaps": true
                              },
                              "paragraphFormat": {
                                  "leftIndent": 7.099999904632568,
                                  "textAlignment": "Center",
                                  "styleName": "Header",
                                  "tabs": [
                                      {
                                          "tabJustification": "Left",
                                          "position": 0.0,
                                          "tabLeader": "None",
                                          "deletePosition": 432.0
                                      },
                                      {
                                          "tabJustification": "Right",
                                          "position": 477.0,
                                          "tabLeader": "None",
                                          "deletePosition": 0.0
                                      }
                                  ]
                              },
                              "inlines": [
                                  {
                                      "text": "part-IV ",
                                      "characterFormat": {
                                          "bold": true,
                                          "underline": "Single",
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "fontSizeBidi": 11.0,
                                          "allCaps": true
                                      }
                                  },
                                  {
                                      "text": ": Commercia",
                                      "characterFormat": {
                                          "bold": true,
                                          "underline": "Single",
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "fontSizeBidi": 11.0,
                                          "allCaps": true
                                      }
                                  },
                                  {
                                      "text": "l terms & conditions",
                                      "characterFormat": {
                                          "bold": true,
                                          "underline": "Single",
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "fontSizeBidi": 11.0,
                                          "allCaps": true
                                      }
                                  }
                              ]
                          }
                      ]
                  },
                  "footer": {
                      "blocks": [
                          {
                              "characterFormat": {
                                  "bold": true,
                                  "fontSize": 11.0,
                                  "fontColor": "empty",
                                  "fontSizeBidi": 11.0
                              },
                              "paragraphFormat": {
                                  "leftIndent": 7.099999904632568,
                                  "styleName": "Footer",
                                  "tabs": [
                                      {
                                          "tabJustification": "Left",
                                          "position": 0.0,
                                          "tabLeader": "None",
                                          "deletePosition": 432.0
                                      },
                                      {
                                          "tabJustification": "Right",
                                          "position": 446.54998779296875,
                                          "tabLeader": "None",
                                          "deletePosition": 0.0
                                      }
                                  ]
                              },
                              "inlines": [
                                  {
                                      "text": "COMMERCIAL IN CONFIDEN",
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "fontSizeBidi": 11.0
                                      }
                                  },
                                  {
                                      "text": "CE ",
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "fontSizeBidi": 11.0
                                      }
                                  },
                                  {
                                      "text": "\t",
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "fontSizeBidi": 11.0
                                      }
                                  },
                                  {
                                      "text": "\t",
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "fontSizeBidi": 11.0
                                      }
                                  },
                                  {
                                      "text": "Page ",
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "fontSizeBidi": 11.0,
                                          "fontFamilyBidi": "Arial"
                                      }
                                  },
                                  {
                                      "hasFieldEnd": true,
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "styleName": "Page Number",
                                          "fontSizeBidi": 11.0,
                                          "fontFamilyBidi": "Arial"
                                      },
                                      "fieldType": 0
                                  },
                                  {
                                      "text": " PAGE ",
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "styleName": "Page Number",
                                          "fontSizeBidi": 11.0,
                                          "fontFamilyBidi": "Arial"
                                      }
                                  },
                                  {
                                      "fieldType": 2
                                  },
                                  {
                                      "text": "10",
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "styleName": "Page Number",
                                          "fontSizeBidi": 11.0,
                                          "fontFamilyBidi": "Arial"
                                      }
                                  },
                                  {
                                      "fieldType": 1
                                  },
                                  {
                                      "text": " ",
                                      "characterFormat": {
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "styleName": "Page Number",
                                          "fontSizeBidi": 11.0,
                                          "fontFamilyBidi": "Arial"
                                      }
                                  },
                                  {
                                      "text": "of 10",
                                      "characterFormat": {
                                          "bold": true,
                                          "fontSize": 11.0,
                                          "fontColor": "empty",
                                          "fontSizeBidi": 11.0,
                                          "fontFamilyBidi": "Arial"
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
                  "headerDistance": 53.849998474121094,
                  "footerDistance": 43.650001525878906,
                  "pageWidth": 595.3499755859375,
                  "pageHeight": 841.9500122070312,
                  "leftMargin": 77.69999694824219,
                  "rightMargin": 70.9000015258789,
                  "topMargin": 127.5999984741211,
                  "bottomMargin": 70.9000015258789,
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
      "paragraphFormat": {
          "lineSpacing": 1.5,
          "lineSpacingType": "Multiple"
      },
      "lists": [
          {
              "listId": 0,
              "abstractListId": 0
          },
          {
              "listId": 1,
              "abstractListId": 1
          },
          {
              "listId": 2,
              "abstractListId": 2
          },
          {
              "listId": 3,
              "abstractListId": 3
          },
          {
              "listId": 4,
              "abstractListId": 4
          }
      ],
      "abstractLists": [
          {
              "abstractListId": 0,
              "levels": [
                  {
                      "startAt": 1,
                      "restartLevel": 0,
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "%1",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 72.0,
                          "firstLineIndent": -57.599998474121094,
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
                      "restartLevel": 1,
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "%1.%2",
                      "characterFormat": {
                          "bold": true,
                          "italic": false,
                          "fontSize": 12.0,
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 72.0,
                          "firstLineIndent": -57.599998474121094,
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
                      "restartLevel": 2,
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "17.%3",
                      "characterFormat": {
                          "fontColor": "#00000000"
                      },
                      "paragraphFormat": {
                          "leftIndent": 72.0,
                          "firstLineIndent": -57.599998474121094,
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
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "17.3.%4",
                      "characterFormat": {
                          "fontColor": "#00000000"
                      },
                      "paragraphFormat": {
                          "leftIndent": 72.0,
                          "firstLineIndent": -57.599998474121094,
                          "tabs": [
                              {
                                  "tabJustification": "List",
                                  "position": 86.4000015258789,
                                  "tabLeader": "None",
                                  "deletePosition": 0.0
                              }
                          ]
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 4,
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "%1.%2.%3.%4.%5",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 39.599998474121094,
                          "firstLineIndent": -50.400001525878906,
                          "tabs": [
                              {
                                  "tabJustification": "List",
                                  "position": 39.599998474121094,
                                  "tabLeader": "None",
                                  "deletePosition": 0.0
                              }
                          ]
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 5,
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "%1.%2.%3.%4.%5.%6",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 46.79999923706055,
                          "firstLineIndent": -57.599998474121094,
                          "tabs": [
                              {
                                  "tabJustification": "List",
                                  "position": 46.79999923706055,
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
                      "numberFormat": "%1.%2.%3.%4.%5.%6.%7",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 54.0,
                          "firstLineIndent": -64.80000305175781,
                          "tabs": [
                              {
                                  "tabJustification": "List",
                                  "position": 54.0,
                                  "tabLeader": "None",
                                  "deletePosition": 0.0
                              }
                          ]
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 7,
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 61.20000076293945,
                          "firstLineIndent": -72.0,
                          "tabs": [
                              {
                                  "tabJustification": "List",
                                  "position": 61.20000076293945,
                                  "tabLeader": "None",
                                  "deletePosition": 0.0
                              }
                          ]
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 8,
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.%9",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 68.4000015258789,
                          "firstLineIndent": -79.19999694824219,
                          "tabs": [
                              {
                                  "tabJustification": "List",
                                  "position": 68.4000015258789,
                                  "tabLeader": "None",
                                  "deletePosition": 0.0
                              }
                          ]
                      }
                  }
              ]
          },
          {
              "abstractListId": 1,
              "levels": [
                  {
                      "startAt": 1,
                      "restartLevel": 0,
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "%1.",
                      "characterFormat": {
                          "bold": true,
                          "fontSize": 12.0,
                          "fontColor": "empty",
                          "fontSizeBidi": 12.0
                      },
                      "paragraphFormat": {
                          "leftIndent": 39.29999923706055,
                          "firstLineIndent": -18.0
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 1,
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "%1.%2.",
                      "characterFormat": {
                          "bold": false,
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 75.9000015258789,
                          "firstLineIndent": -21.600000381469727
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 2,
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "%1.%2.%3.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 129.0,
                          "firstLineIndent": -25.200000762939453
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 3,
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "%1.%2.%3.%4.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 122.69999694824219,
                          "firstLineIndent": -32.400001525878906
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 4,
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "%1.%2.%3.%4.%5.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 147.89999389648438,
                          "firstLineIndent": -39.599998474121094
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 5,
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "%1.%2.%3.%4.%5.%6.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 173.10000610351562,
                          "firstLineIndent": -46.79999923706055
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 6,
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "%1.%2.%3.%4.%5.%6.%7.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 198.3000030517578,
                          "firstLineIndent": -54.0
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 7,
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 223.5,
                          "firstLineIndent": -61.20000076293945
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 8,
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.%9.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 252.3000030517578,
                          "firstLineIndent": -72.0
                      }
                  }
              ]
          },
          {
              "abstractListId": 2,
              "levels": [
                  {
                      "startAt": 1,
                      "restartLevel": 0,
                      "listLevelPattern": "LowLetter",
                      "followCharacter": "Tab",
                      "numberFormat": "%1)",
                      "characterFormat": {
                          "bold": false,
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 60.0,
                          "firstLineIndent": -18.0
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 1,
                      "listLevelPattern": "LowLetter",
                      "followCharacter": "Tab",
                      "numberFormat": "%2.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 96.0,
                          "firstLineIndent": -18.0
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 2,
                      "listLevelPattern": "LowRoman",
                      "followCharacter": "Tab",
                      "numberFormat": "%3.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 132.0,
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
                          "leftIndent": 168.0,
                          "firstLineIndent": -18.0
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 4,
                      "listLevelPattern": "LowLetter",
                      "followCharacter": "Tab",
                      "numberFormat": "%5.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 204.0,
                          "firstLineIndent": -18.0
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 5,
                      "listLevelPattern": "LowRoman",
                      "followCharacter": "Tab",
                      "numberFormat": "%6.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 240.0,
                          "firstLineIndent": -9.0
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 6,
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "%7.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 276.0,
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
                          "leftIndent": 312.0,
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
                          "leftIndent": 348.0,
                          "firstLineIndent": -9.0
                      }
                  }
              ]
          },
          {
              "abstractListId": 3,
              "levels": [
                  {
                      "startAt": 1,
                      "restartLevel": 0,
                      "listLevelPattern": "LowLetter",
                      "followCharacter": "Tab",
                      "numberFormat": "%1)",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 58.54999923706055,
                          "firstLineIndent": -18.0
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 1,
                      "listLevelPattern": "LowLetter",
                      "followCharacter": "Tab",
                      "numberFormat": "%2.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 94.55000305175781,
                          "firstLineIndent": -18.0
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 2,
                      "listLevelPattern": "LowRoman",
                      "followCharacter": "Tab",
                      "numberFormat": "%3.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 130.5500030517578,
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
                          "leftIndent": 166.5500030517578,
                          "firstLineIndent": -18.0
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 4,
                      "listLevelPattern": "LowLetter",
                      "followCharacter": "Tab",
                      "numberFormat": "%5.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 202.5500030517578,
                          "firstLineIndent": -18.0
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 5,
                      "listLevelPattern": "LowRoman",
                      "followCharacter": "Tab",
                      "numberFormat": "%6.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 238.5500030517578,
                          "firstLineIndent": -9.0
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 6,
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "%7.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 274.54998779296875,
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
                          "leftIndent": 310.54998779296875,
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
                          "leftIndent": 346.54998779296875,
                          "firstLineIndent": -9.0
                      }
                  }
              ]
          },
          {
              "abstractListId": 4,
              "levels": [
                  {
                      "startAt": 1,
                      "restartLevel": 0,
                      "listLevelPattern": "LowLetter",
                      "followCharacter": "Tab",
                      "numberFormat": "%1)",
                      "characterFormat": {
                          "fontColor": "#00000000"
                      },
                      "paragraphFormat": {
                          "leftIndent": 58.54999923706055,
                          "firstLineIndent": -18.0
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 1,
                      "listLevelPattern": "LowLetter",
                      "followCharacter": "Tab",
                      "numberFormat": "%2.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 94.55000305175781,
                          "firstLineIndent": -18.0
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 2,
                      "listLevelPattern": "LowRoman",
                      "followCharacter": "Tab",
                      "numberFormat": "%3.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 130.5500030517578,
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
                          "leftIndent": 166.5500030517578,
                          "firstLineIndent": -18.0
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 4,
                      "listLevelPattern": "LowLetter",
                      "followCharacter": "Tab",
                      "numberFormat": "%5.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 202.5500030517578,
                          "firstLineIndent": -18.0
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 5,
                      "listLevelPattern": "LowRoman",
                      "followCharacter": "Tab",
                      "numberFormat": "%6.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 238.5500030517578,
                          "firstLineIndent": -9.0
                      }
                  },
                  {
                      "startAt": 1,
                      "restartLevel": 6,
                      "listLevelPattern": "Arabic",
                      "followCharacter": "Tab",
                      "numberFormat": "%7.",
                      "characterFormat": {
                          "fontColor": "empty"
                      },
                      "paragraphFormat": {
                          "leftIndent": 274.54998779296875,
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
                          "leftIndent": 310.54998779296875,
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
                          "leftIndent": 346.54998779296875,
                          "firstLineIndent": -9.0
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
                  "fontSize": 12.0,
                  "fontFamily": "Arial",
                  "fontColor": "empty",
                  "fontSizeBidi": 12.0
              },
              "paragraphFormat": {
                  "lineSpacing": 1.5,
                  "lineSpacingType": "Multiple"
              }
          },
          {
              "type": "Paragraph",
              "name": "Heading 1",
              "basedOn": "Normal",
              "next": "Heading 1",
              "link": "Heading 1 Char",
              "characterFormat": {
                  "bold": true,
                  "fontSize": 14.0,
                  "fontColor": "empty",
                  "fontSizeBidi": 10.0,
                  "fontFamilyBidi": "Arial",
                  "allCaps": true
              },
              "paragraphFormat": {
                  "beforeSpacing": 12.0,
                  "afterSpacing": 6.0,
                  "lineSpacing": 16.0,
                  "lineSpacingType": "AtLeast",
                  "outlineLevel": "Level1",
                  "textAlignment": "Justify",
                  "listFormat": {
                      "listLevelNumber": 0,
                      "listId": 0
                  }
              }
          },
          {
              "type": "Paragraph",
              "name": "Heading 2",
              "basedOn": "Normal",
              "next": "Normal",
              "link": "Heading 2 Char",
              "characterFormat": {
                  "bold": true,
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.0
              },
              "paragraphFormat": {
                  "beforeSpacing": 3.0,
                  "afterSpacing": 1.0,
                  "outlineLevel": "Level2"
              }
          },
          {
              "type": "Paragraph",
              "name": "Heading 3",
              "basedOn": "Normal",
              "next": "Normal",
              "link": "Heading 3 Char",
              "characterFormat": {
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.0
              },
              "paragraphFormat": {
                  "beforeSpacing": 3.0,
                  "afterSpacing": 3.0,
                  "outlineLevel": "Level3",
                  "listFormat": {
                      "listLevelNumber": 2,
                      "listId": 0
                  }
              }
          },
          {
              "type": "Paragraph",
              "name": "Heading 4",
              "basedOn": "Normal",
              "next": "Normal",
              "link": "Heading 4 Char",
              "characterFormat": {
                  "fontColor": "empty",
                  "fontSizeBidi": 10.0
              },
              "paragraphFormat": {
                  "beforeSpacing": 3.0,
                  "afterSpacing": 3.0,
                  "outlineLevel": "Level4",
                  "textAlignment": "Justify"
              }
          },
          {
              "type": "Paragraph",
              "name": "Heading 5",
              "basedOn": "Normal",
              "next": "Normal",
              "link": "Heading 5 Char",
              "characterFormat": {
                  "fontSize": 11.0,
                  "fontColor": "empty",
                  "fontSizeBidi": 10.0
              },
              "paragraphFormat": {
                  "beforeSpacing": 12.0,
                  "afterSpacing": 3.0,
                  "outlineLevel": "Level5",
                  "listFormat": {
                      "listLevelNumber": 4,
                      "listId": 0
                  }
              }
          },
          {
              "type": "Paragraph",
              "name": "Heading 6",
              "basedOn": "Normal",
              "next": "Normal",
              "link": "Heading 6 Char",
              "characterFormat": {
                  "italic": true,
                  "fontSize": 11.0,
                  "fontColor": "empty",
                  "fontSizeBidi": 10.0
              },
              "paragraphFormat": {
                  "beforeSpacing": 12.0,
                  "afterSpacing": 3.0,
                  "outlineLevel": "Level6",
                  "listFormat": {
                      "listLevelNumber": 5,
                      "listId": 0
                  }
              }
          },
          {
              "type": "Paragraph",
              "name": "Heading 7",
              "basedOn": "Normal",
              "next": "Normal",
              "link": "Heading 7 Char",
              "characterFormat": {
                  "fontColor": "empty",
                  "fontSizeBidi": 10.0
              },
              "paragraphFormat": {
                  "beforeSpacing": 12.0,
                  "afterSpacing": 3.0,
                  "outlineLevel": "Level7",
                  "listFormat": {
                      "listLevelNumber": 6,
                      "listId": 0
                  }
              }
          },
          {
              "type": "Paragraph",
              "name": "Heading 8",
              "basedOn": "Normal",
              "next": "Normal",
              "link": "Heading 8 Char",
              "characterFormat": {
                  "italic": true,
                  "fontColor": "empty",
                  "fontSizeBidi": 10.0
              },
              "paragraphFormat": {
                  "beforeSpacing": 12.0,
                  "afterSpacing": 3.0,
                  "outlineLevel": "Level8",
                  "listFormat": {
                      "listLevelNumber": 7,
                      "listId": 0
                  }
              }
          },
          {
              "type": "Paragraph",
              "name": "Heading 9",
              "basedOn": "Normal",
              "next": "Normal",
              "link": "Heading 9 Char",
              "characterFormat": {
                  "italic": true,
                  "fontSize": 9.0,
                  "fontColor": "empty",
                  "fontSizeBidi": 10.0
              },
              "paragraphFormat": {
                  "beforeSpacing": 12.0,
                  "afterSpacing": 3.0,
                  "outlineLevel": "Level9",
                  "listFormat": {
                      "listLevelNumber": 8,
                      "listId": 0
                  }
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
              "name": "Table Normal",
              "next": "Table Normal",
              "characterFormat": {
                  "fontColor": "empty"
              }
          },
          {
              "type": "Paragraph",
              "name": "No List",
              "next": "No List",
              "characterFormat": {
                  "fontFamily": "Calibri",
                  "fontColor": "empty"
              }
          },
          {
              "type": "Character",
              "name": "Heading 1 Char",
              "basedOn": "Default Paragraph Font",
              "characterFormat": {
                  "bold": true,
                  "fontSize": 14.0,
                  "fontFamily": "Arial",
                  "fontColor": "empty",
                  "fontFamilyBidi": "Arial",
                  "allCaps": true
              }
          },
          {
              "type": "Character",
              "name": "Heading 2 Char",
              "basedOn": "Default Paragraph Font",
              "characterFormat": {
                  "bold": true,
                  "fontSize": 12.0,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.0,
                  "fontFamilyBidi": "Times New Roman"
              }
          },
          {
              "type": "Character",
              "name": "Heading 3 Char",
              "basedOn": "Default Paragraph Font",
              "characterFormat": {
                  "fontSize": 12.0,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF"
              }
          },
          {
              "type": "Character",
              "name": "Heading 4 Char",
              "basedOn": "Default Paragraph Font",
              "characterFormat": {
                  "fontSize": 12.0,
                  "fontFamily": "Arial",
                  "fontColor": "empty",
                  "fontSizeBidi": 10.0,
                  "fontFamilyBidi": "Times New Roman"
              }
          },
          {
              "type": "Character",
              "name": "Heading 5 Char",
              "basedOn": "Default Paragraph Font",
              "characterFormat": {
                  "fontSize": 11.0,
                  "fontFamily": "Arial",
                  "fontColor": "empty"
              }
          },
          {
              "type": "Character",
              "name": "Heading 6 Char",
              "basedOn": "Default Paragraph Font",
              "characterFormat": {
                  "italic": true,
                  "fontSize": 11.0,
                  "fontFamily": "Arial",
                  "fontColor": "empty"
              }
          },
          {
              "type": "Character",
              "name": "Heading 7 Char",
              "basedOn": "Default Paragraph Font",
              "characterFormat": {
                  "fontSize": 12.0,
                  "fontFamily": "Arial",
                  "fontColor": "empty"
              }
          },
          {
              "type": "Character",
              "name": "Heading 8 Char",
              "basedOn": "Default Paragraph Font",
              "characterFormat": {
                  "italic": true,
                  "fontSize": 12.0,
                  "fontFamily": "Arial",
                  "fontColor": "empty"
              }
          },
          {
              "type": "Character",
              "name": "Heading 9 Char",
              "basedOn": "Default Paragraph Font",
              "characterFormat": {
                  "italic": true,
                  "fontSize": 9.0,
                  "fontFamily": "Arial",
                  "fontColor": "empty"
              }
          },
          {
              "type": "Paragraph",
              "name": "Header",
              "basedOn": "Normal",
              "next": "Header",
              "link": "Header Char",
              "characterFormat": {
                  "fontSize": 14.0,
                  "fontColor": "empty",
                  "fontSizeBidi": 10.0
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
              "type": "Character",
              "name": "Header Char",
              "basedOn": "Default Paragraph Font",
              "characterFormat": {
                  "fontSize": 14.0,
                  "fontFamily": "Arial",
                  "fontColor": "empty",
                  "fontSizeBidi": 10.0,
                  "fontFamilyBidi": "Times New Roman"
              }
          },
          {
              "type": "Paragraph",
              "name": "Block Text",
              "basedOn": "Normal",
              "next": "Block Text",
              "characterFormat": {
                  "fontColor": "empty",
                  "fontSizeBidi": 10.0
              },
              "paragraphFormat": {
                  "leftIndent": 72.0,
                  "rightIndent": 5.650000095367432,
                  "beforeSpacing": 3.0,
                  "afterSpacing": 1.0,
                  "textAlignment": "Justify"
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
              "name": "Footer",
              "basedOn": "Normal",
              "next": "Footer",
              "link": "Footer Char",
              "characterFormat": {
                  "fontSize": 14.0,
                  "fontColor": "empty",
                  "fontSizeBidi": 10.0
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
              "type": "Character",
              "name": "Footer Char",
              "basedOn": "Default Paragraph Font",
              "characterFormat": {
                  "fontSize": 14.0,
                  "fontFamily": "Arial",
                  "fontColor": "empty",
                  "fontSizeBidi": 10.0,
                  "fontFamilyBidi": "Times New Roman"
              }
          },
          {
              "type": "Paragraph",
              "name": "Body Text Indent 2",
              "basedOn": "Normal",
              "next": "Body Text Indent 2",
              "link": "Body Text Indent 2 Char",
              "characterFormat": {
                  "bold": true,
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.0
              },
              "paragraphFormat": {
                  "leftIndent": 72.0,
                  "firstLineIndent": -72.0,
                  "textAlignment": "Justify"
              }
          },
          {
              "type": "Character",
              "name": "Body Text Indent 2 Char",
              "basedOn": "Default Paragraph Font",
              "characterFormat": {
                  "bold": true,
                  "fontSize": 12.0,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.0,
                  "fontFamilyBidi": "Times New Roman"
              }
          },
          {
              "type": "Paragraph",
              "name": "Body Text Indent 3",
              "basedOn": "Normal",
              "next": "Body Text Indent 3",
              "link": "Body Text Indent 3 Char",
              "characterFormat": {
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.0
              },
              "paragraphFormat": {
                  "textAlignment": "Justify"
              }
          },
          {
              "type": "Character",
              "name": "Body Text Indent 3 Char",
              "basedOn": "Default Paragraph Font",
              "characterFormat": {
                  "fontSize": 12.0,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.0,
                  "fontFamilyBidi": "Times New Roman"
              }
          },
          {
              "type": "Paragraph",
              "name": "Normal1",
              "basedOn": "Normal",
              "next": "Normal1",
              "characterFormat": {
                  "fontColor": "empty",
                  "fontSizeBidi": 10.0
              },
              "paragraphFormat": {
                  "leftIndent": 43.20000076293945,
                  "beforeSpacing": 2.0,
                  "afterSpacing": 2.0,
                  "textAlignment": "Justify"
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
                  "leftIndent": 36.0,
                  "contextualSpacing": true
              }
          },
          {
              "type": "Paragraph",
              "name": "Table Centred",
              "basedOn": "Normal",
              "next": "Table Centred",
              "characterFormat": {
                  "fontColor": "empty",
                  "fontSizeBidi": 10.0
              },
              "paragraphFormat": {
                  "beforeSpacing": 2.0,
                  "afterSpacing": 2.0,
                  "textAlignment": "Center"
              }
          },
          {
              "type": "Character",
              "name": "pageheader1",
              "basedOn": "Default Paragraph Font",
              "characterFormat": {
                  "bold": true,
                  "strikethrough": "None",
                  "fontSize": 12.0,
                  "fontFamily": "Arial",
                  "fontColor": "#990000FF",
                  "boldBidi": true,
                  "fontSizeBidi": 12.0,
                  "fontFamilyBidi": "Arial"
              }
          },
          {
              "type": "Paragraph",
              "name": "Table-Data",
              "basedOn": "Normal",
              "next": "Table-Data",
              "characterFormat": {
                  "fontSize": 11.0,
                  "fontColor": "empty",
                  "fontSizeBidi": 10.0,
                  "fontFamilyBidi": "Arial"
              },
              "paragraphFormat": {
                  "leftIndent": 0.5,
                  "textAlignment": "Justify"
              }
          },
          {
              "type": "Paragraph",
              "name": "Table Grid",
              "basedOn": "Table Normal",
              "next": "Table Grid",
              "characterFormat": {
                  "fontColor": "empty"
              }
          },
          {
              "type": "Paragraph",
              "name": "Default",
              "next": "Default",
              "characterFormat": {
                  "fontSize": 12.0,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 12.0,
                  "fontFamilyBidi": "Arial"
              }
          },
          {
              "type": "Character",
              "name": "Hyperlink",
              "basedOn": "Default Paragraph Font",
              "characterFormat": {
                  "underline": "Single",
                  "fontColor": "#0563C1FF"
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
                      "lineSpacing": 1.0,
                      "lineSpacingType": "Multiple",
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
                      "lineSpacing": 1.0,
                      "lineSpacingType": "Multiple",
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
                      "lineSpacing": 1.0,
                      "lineSpacingType": "Multiple",
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
                      "lineSpacing": 1.0,
                      "lineSpacingType": "Multiple",
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
    editor.open(JSON.stringify(doc));
    editor.selection.selectAll();
    editor.editor.handleBackKey();
    let str: any = {
      "sections": [
        {
          "blocks": [
            {
              "characterFormat": {
                "bold": true,
                "italic": false,
                "strikethrough": "None",
                "fontSize": 12,
                "fontFamily": "Arial",
                "fontColor": "#00000000",
                "bidi": false,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Arial",
                "allCaps": false
              },
              "paragraphFormat": {
                "leftIndent": 2.8499999046325684,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "beforeSpacing": 4,
                "afterSpacing": 0,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "BodyText",
                "textAlignment": "Justify",
                "styleName": "Normal",
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 31.5,
                    "tabLeader": "None",
                    "deletePosition": 0
                  },
                  {
                    "tabJustification": "Left",
                    "position": 40.5,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ],
                "bidi": false,
                "contextualSpacing": false
              },
              "inlines": [
                {
                  "text": "    ",
                  "characterFormat": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                },
                {
                  "text": "Commercial terms and conditions are mentioned below:",
                  "characterFormat": {
                    "bold": true,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                }
              ]
            },
            {
              "characterFormat": {
                "bold": false,
                "italic": false,
                "strikethrough": "None",
                "fontSize": 12,
                "fontFamily": "Arial",
                "fontColor": "#00000000",
                "bidi": false,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Arial",
                "allCaps": false
              },
              "paragraphFormat": {
                "leftIndent": 42.5,
                "rightIndent": 0,
                "firstLineIndent": -24.649999618530273,
                "beforeSpacing": 6,
                "afterSpacing": 0,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level1",
                "textAlignment": "Justify",
                "styleName": "heading1,Main Title,Main Title1,Para1,Para11,1,Para level 1,Level 1,hd1,Heading 1A,h1,heading 1,11,level 1,12,level 11,Level 11,13,14,111,level 12,Level 12,121,level 111,Level 111,131,Heading Annex0",
                "listFormat": {
                  "listLevelNumber": 0,
                  "listId": 1
                },
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 40.5,
                    "tabLeader": "None",
                    "deletePosition": 0
                  },
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 72
                  }
                ],
                "bidi": false,
                "contextualSpacing": false
              },
              "inlines": [
                {
                  "text": "The term ‘",
                  "characterFormat": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                },
                {
                  "text": "Contractor’",
                  "characterFormat": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                },
                {
                  "text": ", ‘",
                  "characterFormat": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                },
                {
                  "text": "Purchaser’",
                  "characterFormat": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                },
                {
                  "text": " and ‘",
                  "characterFormat": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                },
                {
                  "text": "Contract’",
                  "characterFormat": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                },
                {
                  "text": " have the following meanings in these terms & conditions.",
                  "characterFormat": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                },
                {
                  "name": "_Ref523215804",
                  "bookmarkType": 0
                },
                {
                  "name": "_Toc177987971",
                  "bookmarkType": 0
                }
              ]
            },
            {
              "characterFormat": {
                "bold": true,
                "italic": false,
                "strikethrough": "None",
                "fontSize": 12,
                "fontFamily": "Arial",
                "fontColor": "#00000000",
                "bidi": false,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Arial",
                "allCaps": true
              },
              "paragraphFormat": {
                "leftIndent": 17.850000381469727,
                "rightIndent": -5.650000095367432,
                "firstLineIndent": 0,
                "beforeSpacing": 6,
                "afterSpacing": 0,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level1",
                "textAlignment": "Justify",
                "styleName": "heading1,Main Title,Main Title1,Para1,Para11,1,Para level 1,Level 1,hd1,Heading 1A,h1,heading 1,11,level 1,12,level 11,Level 11,13,14,111,level 12,Level 12,121,level 111,Level 111,131,Heading Annex0",
                "listFormat": {
                  "listLevelNumber": 0,
                  "listId": 1
                },
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 40.5,
                    "tabLeader": "None",
                    "deletePosition": 0
                  },
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 72
                  }
                ],
                "bidi": false,
                "contextualSpacing": false
              },
              "inlines": [
                {
                  "name": "_Ref523215854",
                  "bookmarkType": 0
                },
                {
                  "name": "_Toc177987973",
                  "bookmarkType": 0
                },
                {
                  "name": "_Ref523215804",
                  "bookmarkType": 1
                },
                {
                  "name": "_Toc177987971",
                  "bookmarkType": 1
                },
                {
                  "text": "TERMS of PAYMENT",
                  "characterFormat": {
                    "bold": true,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": true
                  }
                },
                {
                  "name": "_Ref523215854",
                  "bookmarkType": 1
                },
                {
                  "name": "_Toc177987973",
                  "bookmarkType": 1
                }
              ]
            },
            {
              "characterFormat": {
                "bold": false,
                "italic": false,
                "strikethrough": "None",
                "fontSize": 12,
                "fontFamily": "Arial",
                "fontColor": "#000000FF",
                "bidi": false,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Arial",
                "allCaps": false
              },
              "paragraphFormat": {
                "leftIndent": 59.79999923706055,
                "rightIndent": 0,
                "firstLineIndent": -17.850000381469727,
                "beforeSpacing": 0,
                "afterSpacing": 0,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "BodyText",
                "textAlignment": "Justify",
                "styleName": "Body Text Indent 2",
                "listFormat": {
                  "listLevelNumber": 0,
                  "listId": 2
                },
                "bidi": false,
                "contextualSpacing": false
              },
              "inlines": [
                {
                  "text": "Payment ter",
                  "characterFormat": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#000000FF",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                }
              ]
            },
            {
              "characterFormat": {
                "bold": false,
                "italic": false,
                "strikethrough": "None",
                "fontSize": 12,
                "fontFamily": "Arial",
                "fontColor": "#000000FF",
                "bidi": false,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Arial",
                "allCaps": false
              },
              "paragraphFormat": {
                "leftIndent": 59.79999923706055,
                "rightIndent": 0,
                "firstLineIndent": -17.850000381469727,
                "beforeSpacing": 3,
                "afterSpacing": 0,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "BodyText",
                "textAlignment": "Justify",
                "styleName": "Body Text Indent 2",
                "listFormat": {
                  "listLevelNumber": 0,
                  "listId": 2
                },
                "bidi": false,
                "contextualSpacing": false
              },
              "inlines": [
                {
                  "name": "_Ref523215868",
                  "bookmarkType": 0
                },
                {
                  "text": "Credit Period",
                  "characterFormat": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#000000FF",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                },
                {
                  "text": ":",
                  "characterFormat": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#000000FF",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                }
              ]
            },
            {
              "characterFormat": {
                "bold": true,
                "italic": false,
                "strikethrough": "None",
                "fontSize": 12,
                "fontFamily": "Arial",
                "fontColor": "#00000000",
                "bidi": false,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Arial",
                "allCaps": true
              },
              "paragraphFormat": {
                "leftIndent": 17.850000381469727,
                "rightIndent": -5.650000095367432,
                "firstLineIndent": 0,
                "beforeSpacing": 6,
                "afterSpacing": 0,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level1",
                "textAlignment": "Justify",
                "styleName": "heading1,Main Title,Main Title1,Para1,Para11,1,Para level 1,Level 1,hd1,Heading 1A,h1,heading 1,11,level 1,12,level 11,Level 11,13,14,111,level 12,Level 12,121,level 111,Level 111,131,Heading Annex0",
                "listFormat": {
                  "listLevelNumber": 0,
                  "listId": 1
                },
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 40.5,
                    "tabLeader": "None",
                    "deletePosition": 0
                  },
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 72
                  }
                ],
                "bidi": false,
                "contextualSpacing": false
              },
              "inlines": [
                {
                  "name": "_Ref523215868",
                  "bookmarkType": 1
                },
                {
                  "text": "delivery / Contract Period",
                  "characterFormat": {
                    "bold": true,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": true
                  }
                }
              ]
            },
            {
              "characterFormat": {
                "bold": false,
                "italic": false,
                "strikethrough": "None",
                "fontSize": 12,
                "fontFamily": "Arial",
                "fontColor": "#00000000",
                "bidi": false,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Arial",
                "allCaps": false
              },
              "paragraphFormat": {
                "leftIndent": 54.75,
                "rightIndent": 5.650000095367432,
                "firstLineIndent": -14.199999809265137,
                "beforeSpacing": 0,
                "afterSpacing": 0,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "BodyText",
                "textAlignment": "Left",
                "styleName": "Block Text",
                "listFormat": {
                  "listLevelNumber": 0,
                  "listId": 3
                },
                "bidi": false,
                "contextualSpacing": false
              },
              "inlines": [
                {
                  "text": "Delivery period",
                  "characterFormat": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
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
                "highlightColor": "NoColor",
                "fontSize": 12,
                "fontFamily": "Arial",
                "fontColor": "#00000000",
                "bidi": false,
                "boldBidi": false,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Arial",
                "allCaps": false
              },
              "paragraphFormat": {
                "leftIndent": 54.75,
                "rightIndent": 5.650000095367432,
                "firstLineIndent": -14.199999809265137,
                "beforeSpacing": 0,
                "afterSpacing": 0,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "BodyText",
                "textAlignment": "Left",
                "styleName": "Block Text",
                "listFormat": {
                  "listLevelNumber": 0,
                  "listId": 3
                },
                "bidi": false,
                "contextualSpacing": false
              },
              "inlines": [
                {
                  "text": "Contract period for ‘",
                  "characterFormat": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                },
                {
                  "text": "operation and training’",
                  "characterFormat": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                },
                {
                  "text": " ",
                  "characterFormat": {
                    "bold": true,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                },
                {
                  "text": "of SDCFFTF: ",
                  "characterFormat": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                },
                {
                  "text": "10 ",
                  "characterFormat": {
                    "bold": true,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                },
                {
                  "text": "(Ten) ",
                  "characterFormat": {
                    "bold": true,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                },
                {
                  "text": "Years",
                  "characterFormat": {
                    "bold": true,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
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
                "highlightColor": "NoColor",
                "fontSize": 12,
                "fontFamily": "Arial",
                "fontColor": "#00000000",
                "bidi": false,
                "boldBidi": false,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Arial",
                "allCaps": false
              },
              "paragraphFormat": {
                "leftIndent": 54.75,
                "rightIndent": 5.650000095367432,
                "firstLineIndent": -14.199999809265137,
                "beforeSpacing": 0,
                "afterSpacing": 0,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "BodyText",
                "textAlignment": "Left",
                "styleName": "Block Text",
                "listFormat": {
                  "listLevelNumber": 0,
                  "listId": 3
                },
                "bidi": false,
                "contextualSpacing": false
              },
              "inlines": [
                {
                  "text": "Contract period",
                  "characterFormat": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                }
              ]
            },
            {
              "characterFormat": {
                "bold": true,
                "italic": false,
                "strikethrough": "None",
                "fontSize": 12,
                "fontFamily": "Arial",
                "fontColor": "#00000000",
                "bidi": false,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Arial",
                "allCaps": true
              },
              "paragraphFormat": {
                "leftIndent": 17.850000381469727,
                "rightIndent": -5.650000095367432,
                "firstLineIndent": 0,
                "beforeSpacing": 6,
                "afterSpacing": 0,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level1",
                "textAlignment": "Justify",
                "styleName": "heading1,Main Title,Main Title1,Para1,Para11,1,Para level 1,Level 1,hd1,Heading 1A,h1,heading 1,11,level 1,12,level 11,Level 11,13,14,111,level 12,Level 12,121,level 111,Level 111,131,Heading Annex0",
                "listFormat": {
                  "listLevelNumber": 0,
                  "listId": 1
                },
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 40.5,
                    "tabLeader": "None",
                    "deletePosition": 0
                  },
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 72
                  }
                ],
                "bidi": false,
                "contextualSpacing": false
              },
              "inlines": [
                {
                  "name": "_Toc341851418",
                  "bookmarkType": 0
                },
                {
                  "name": "_Toc341877181",
                  "bookmarkType": 0
                },
                {
                  "name": "_Toc349110276",
                  "bookmarkType": 0
                },
                {
                  "name": "_Toc349113786",
                  "bookmarkType": 0
                },
                {
                  "name": "_Toc349114135",
                  "bookmarkType": 0
                },
                {
                  "name": "_Toc349114519",
                  "bookmarkType": 0
                },
                {
                  "name": "_Toc349114656",
                  "bookmarkType": 0
                },
                {
                  "name": "_Toc349114765",
                  "bookmarkType": 0
                },
                {
                  "name": "_Toc349114950",
                  "bookmarkType": 0
                },
                {
                  "name": "_Toc349115247",
                  "bookmarkType": 0
                },
                {
                  "name": "_Toc349115432",
                  "bookmarkType": 0
                },
                {
                  "name": "_Toc349115512",
                  "bookmarkType": 0
                },
                {
                  "name": "_Toc349115580",
                  "bookmarkType": 0
                },
                {
                  "name": "_Ref523215974",
                  "bookmarkType": 0
                },
                {
                  "name": "_Toc177987982",
                  "bookmarkType": 0
                },
                {
                  "text": "LIQUIDAtED DAMAGES",
                  "characterFormat": {
                    "bold": true,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": true
                  }
                },
                {
                  "name": "_Toc341851418",
                  "bookmarkType": 1
                },
                {
                  "name": "_Toc341877181",
                  "bookmarkType": 1
                },
                {
                  "name": "_Toc349110276",
                  "bookmarkType": 1
                },
                {
                  "name": "_Toc349113786",
                  "bookmarkType": 1
                },
                {
                  "name": "_Toc349114135",
                  "bookmarkType": 1
                },
                {
                  "name": "_Toc349114519",
                  "bookmarkType": 1
                },
                {
                  "name": "_Toc349114656",
                  "bookmarkType": 1
                },
                {
                  "name": "_Toc349114765",
                  "bookmarkType": 1
                },
                {
                  "name": "_Toc349114950",
                  "bookmarkType": 1
                },
                {
                  "name": "_Toc349115247",
                  "bookmarkType": 1
                },
                {
                  "name": "_Toc349115432",
                  "bookmarkType": 1
                },
                {
                  "name": "_Toc349115512",
                  "bookmarkType": 1
                },
                {
                  "name": "_Toc349115580",
                  "bookmarkType": 1
                },
                {
                  "name": "_Ref523215974",
                  "bookmarkType": 1
                },
                {
                  "name": "_Toc177987982",
                  "bookmarkType": 1
                }
              ]
            },
            {
              "characterFormat": {
                "bold": false,
                "italic": false,
                "strikethrough": "None",
                "fontSize": 12,
                "fontFamily": "Arial",
                "fontColor": "#00000000",
                "bidi": false,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Arial",
                "allCaps": false
              },
              "paragraphFormat": {
                "leftIndent": 58.70000076293945,
                "rightIndent": 0,
                "firstLineIndent": -18,
                "beforeSpacing": 0,
                "afterSpacing": 0,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "BodyText",
                "textAlignment": "Justify",
                "styleName": "Normal",
                "listFormat": {
                  "listLevelNumber": 0,
                  "listId": 4
                },
                "bidi": false,
                "contextualSpacing": false
              },
              "inlines": [
                {
                  "text": "Supply, ",
                  "characterFormat": {
                    "bold": false,
                    "italic": false,
                    "underline": "Single",
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                },
                {
                  "text": "installation ",
                  "characterFormat": {
                    "bold": false,
                    "italic": false,
                    "underline": "Single",
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
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
                "highlightColor": "NoColor",
                "fontSize": 12,
                "fontFamily": "Arial",
                "fontColor": "#00000000",
                "bidi": false,
                "boldBidi": false,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Arial",
                "allCaps": false
              },
              "paragraphFormat": {
                "leftIndent": 58.70000076293945,
                "rightIndent": 0,
                "firstLineIndent": -18,
                "beforeSpacing": 0,
                "afterSpacing": 0,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "BodyText",
                "textAlignment": "Justify",
                "styleName": "Normal",
                "listFormat": {
                  "listLevelNumber": 0,
                  "listId": 4
                },
                "bidi": false,
                "contextualSpacing": false
              },
              "inlines": [
                {
                  "text": "Operation",
                  "characterFormat": {
                    "bold": false,
                    "italic": false,
                    "underline": "Single",
                    "strikethrough": "None",
                    "fontSize": 12,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 12,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  }
                }
              ]
            }
          ],
          "headersFooters": {
            "header": {
              "blocks": [
                {
                  "characterFormat": {
                    "bold": true,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 11,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 11,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  },
                  "paragraphFormat": {
                    "leftIndent": 0,
                    "rightIndent": 0,
                    "firstLineIndent": 0,
                    "beforeSpacing": 0,
                    "afterSpacing": 0,
                    "lineSpacing": 1,
                    "lineSpacingType": "Multiple",
                    "outlineLevel": "BodyText",
                    "textAlignment": "Left",
                    "styleName": "header,Department",
                    "tabs": [
                      {
                        "tabJustification": "Left",
                        "position": 271.6499938964844,
                        "tabLeader": "None",
                        "deletePosition": 0
                      },
                      {
                        "tabJustification": "Left",
                        "position": 0,
                        "tabLeader": "None",
                        "deletePosition": 216
                      },
                      {
                        "tabJustification": "Left",
                        "position": 0,
                        "tabLeader": "None",
                        "deletePosition": 432
                      }
                    ],
                    "bidi": false,
                    "contextualSpacing": false
                  },
                  "inlines": [
                    {
                      "text": "\t",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": false
                      }
                    }
                  ]
                },
                {
                  "characterFormat": {
                    "bold": true,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 11,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 11,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  },
                  "paragraphFormat": {
                    "leftIndent": 7.099999904632568,
                    "rightIndent": 0,
                    "firstLineIndent": 0,
                    "beforeSpacing": 0,
                    "afterSpacing": 0,
                    "lineSpacing": 1.3000000715255737,
                    "lineSpacingType": "Multiple",
                    "outlineLevel": "BodyText",
                    "textAlignment": "Left",
                    "styleName": "header,Department",
                    "tabs": [
                      {
                        "tabJustification": "Center",
                        "position": 216,
                        "tabLeader": "None",
                        "deletePosition": 0
                      },
                      {
                        "tabJustification": "Right",
                        "position": 446.54998779296875,
                        "tabLeader": "None",
                        "deletePosition": 0
                      },
                      {
                        "tabJustification": "Left",
                        "position": 0,
                        "tabLeader": "None",
                        "deletePosition": 432
                      }
                    ],
                    "bidi": false,
                    "contextualSpacing": false
                  },
                  "inlines": [
                    {
                      "text": "DEFENCE/SUP/E03180482/T",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": false
                      }
                    },
                    {
                      "text": "\t",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": false
                      }
                    },
                    {
                      "text": "\t",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": false
                      }
                    },
                    {
                      "text": "L&T DEFENCE",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": false
                      }
                    }
                  ]
                },
                {
                  "characterFormat": {
                    "bold": true,
                    "italic": false,
                    "strikethrough": "None",
                    "baselineAlignment": "Normal",
                    "highlightColor": "NoColor",
                    "fontSize": 11,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "boldBidi": false,
                    "fontSizeBidi": 11,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  },
                  "paragraphFormat": {
                    "leftIndent": 7.099999904632568,
                    "rightIndent": 0,
                    "firstLineIndent": 0,
                    "beforeSpacing": 0,
                    "afterSpacing": 0,
                    "lineSpacing": 1.3000000715255737,
                    "lineSpacingType": "Multiple",
                    "outlineLevel": "BodyText",
                    "textAlignment": "Left",
                    "styleName": "header,Department",
                    "tabs": [
                      {
                        "tabJustification": "Center",
                        "position": 216,
                        "tabLeader": "None",
                        "deletePosition": 0
                      },
                      {
                        "tabJustification": "Right",
                        "position": 446.54998779296875,
                        "tabLeader": "None",
                        "deletePosition": 0
                      },
                      {
                        "tabJustification": "Left",
                        "position": 0,
                        "tabLeader": "None",
                        "deletePosition": 432
                      }
                    ],
                    "bidi": false,
                    "contextualSpacing": false
                  },
                  "inlines": [
                    {
                      "text": "22 OCTOBER",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": false
                      }
                    },
                    {
                      "text": " 2018",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": false
                      }
                    },
                    {
                      "text": "\t",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": false
                      }
                    },
                    {
                      "text": "\t",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": false
                      }
                    },
                    {
                      "text": "Technical",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": true
                      }
                    },
                    {
                      "text": " BID",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": false
                      }
                    }
                  ]
                },
                {
                  "characterFormat": {
                    "bold": true,
                    "italic": false,
                    "underline": "Single",
                    "strikethrough": "None",
                    "fontSize": 11,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 11,
                    "fontFamilyBidi": "Arial",
                    "allCaps": true
                  },
                  "paragraphFormat": {
                    "leftIndent": 7.099999904632568,
                    "rightIndent": 0,
                    "firstLineIndent": 0,
                    "beforeSpacing": 0,
                    "afterSpacing": 0,
                    "lineSpacing": 1.5,
                    "lineSpacingType": "Multiple",
                    "outlineLevel": "BodyText",
                    "textAlignment": "Center",
                    "styleName": "header,Department",
                    "tabs": [
                      {
                        "tabJustification": "Center",
                        "position": 216,
                        "tabLeader": "None",
                        "deletePosition": 0
                      },
                      {
                        "tabJustification": "Right",
                        "position": 477,
                        "tabLeader": "None",
                        "deletePosition": 0
                      },
                      {
                        "tabJustification": "Left",
                        "position": 0,
                        "tabLeader": "None",
                        "deletePosition": 432
                      }
                    ],
                    "bidi": false,
                    "contextualSpacing": false
                  },
                  "inlines": [
                    {
                      "shapeId": 1026,
                      "name": null,
                      "alternativeText": null,
                      "title": null,
                      "visible": true,
                      "width": 467.7,
                      "height": 0,
                      "widthScale": 100,
                      "heightScale": 100,
                      "lineFormat": {
                        "lineFormatType": "Solid",
                        "color": "#000000FF",
                        "weight": 1.75,
                        "lineStyle": "Solid"
                      },
                      "fillFormat": {
                        "color": "#FFFFFFFF",
                        "fill": true
                      },
                      "verticalPosition": 19.8,
                      "verticalOrigin": "Paragraph",
                      "verticalAlignment": "None",
                      "horizontalPosition": -0.1,
                      "horizontalOrigin": "Column",
                      "horizontalAlignment": "None",
                      "zOrderPosition": 1,
                      "allowOverlap": true,
                      "layoutInCell": true,
                      "lockAnchor": false,
                      "textWrappingStyle": "InFrontOfText",
                      "textWrappingType": "Both",
                      "distanceBottom": 0,
                      "distanceLeft": 0,
                      "distanceRight": 0,
                      "distanceTop": 0,
                      "autoShapeType": "StraightConnector",
                      "textFrame": {
                        "textVerticalAlignment": "Top",
                        "leftMargin": 7.087,
                        "rightMargin": 7.087,
                        "topMargin": 3.685,
                        "bottomMargin": 3.685,
                        "blocks": [
                          {
                            "inlines": []
                          }
                        ]
                      }
                    },
                    {
                      "text": "part-IV ",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "underline": "Single",
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": true
                      }
                    },
                    {
                      "text": ": Commercial terms & conditions",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "underline": "Single",
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": true
                      }
                    }
                  ]
                }
              ]
            },
            "footer": {
              "blocks": [
                {
                  "characterFormat": {
                    "bold": true,
                    "italic": false,
                    "strikethrough": "None",
                    "fontSize": 11,
                    "fontFamily": "Arial",
                    "fontColor": "#00000000",
                    "bidi": false,
                    "fontSizeBidi": 11,
                    "fontFamilyBidi": "Arial",
                    "allCaps": false
                  },
                  "paragraphFormat": {
                    "leftIndent": 7.099999904632568,
                    "rightIndent": 0,
                    "firstLineIndent": 0,
                    "beforeSpacing": 0,
                    "afterSpacing": 0,
                    "lineSpacing": 1.5,
                    "lineSpacingType": "Multiple",
                    "outlineLevel": "BodyText",
                    "textAlignment": "Left",
                    "styleName": "Footer",
                    "tabs": [
                      {
                        "tabJustification": "Center",
                        "position": 216,
                        "tabLeader": "None",
                        "deletePosition": 0
                      },
                      {
                        "tabJustification": "Right",
                        "position": 446.54998779296875,
                        "tabLeader": "None",
                        "deletePosition": 0
                      },
                      {
                        "tabJustification": "Left",
                        "position": 0,
                        "tabLeader": "None",
                        "deletePosition": 432
                      }
                    ],
                    "bidi": false,
                    "contextualSpacing": false
                  },
                  "inlines": [
                    {
                      "shapeId": 1025,
                      "name": null,
                      "alternativeText": null,
                      "title": null,
                      "visible": true,
                      "width": 467.7,
                      "height": 0,
                      "widthScale": 100,
                      "heightScale": 100,
                      "lineFormat": {
                        "lineFormatType": "Solid",
                        "color": "#000000FF",
                        "weight": 1.25,
                        "lineStyle": "Solid"
                      },
                      "fillFormat": {
                        "color": "#FFFFFFFF",
                        "fill": true
                      },
                      "verticalPosition": 774,
                      "verticalOrigin": "Page",
                      "verticalAlignment": "None",
                      "horizontalPosition": -0.1,
                      "horizontalOrigin": "Column",
                      "horizontalAlignment": "None",
                      "zOrderPosition": 0,
                      "allowOverlap": true,
                      "layoutInCell": true,
                      "lockAnchor": false,
                      "textWrappingStyle": "InFrontOfText",
                      "textWrappingType": "Both",
                      "distanceBottom": 0,
                      "distanceLeft": 0,
                      "distanceRight": 0,
                      "distanceTop": 0,
                      "autoShapeType": "StraightConnector",
                      "textFrame": {
                        "textVerticalAlignment": "Top",
                        "leftMargin": 7.087,
                        "rightMargin": 7.087,
                        "topMargin": 3.685,
                        "bottomMargin": 3.685,
                        "blocks": [
                          {
                            "inlines": []
                          }
                        ]
                      }
                    },
                    {
                      "text": "COMMERCIAL IN CONFIDENCE ",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": false
                      }
                    },
                    {
                      "text": "\t",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": false
                      }
                    },
                    {
                      "text": "\t",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": false
                      }
                    },
                    {
                      "text": "Page ",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": false
                      }
                    },
                    {
                      "hasFieldEnd": true,
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "styleName": "page number",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": false
                      },
                      "fieldType": 0
                    },
                    {
                      "text": " PAGE ",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "styleName": "page number",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": false
                      }
                    },
                    {
                      "fieldType": 2
                    },
                    {
                      "text": "10",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "styleName": "page number",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": false
                      }
                    },
                    {
                      "fieldType": 1
                    },
                    {
                      "text": " ",
                      "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "styleName": "page number",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": false
                      }
                    },
                    {
                      "text": "of 10",
                      "characterFormat": {
                        "bold": true,
                        "italic": false,
                        "strikethrough": "None",
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#00000000",
                        "bidi": false,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": false
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
            "headerDistance": 53.849998474121094,
            "footerDistance": 43.650001525878906,
            "pageWidth": 595.3499755859375,
            "pageHeight": 841.9500122070312,
            "leftMargin": 77.69999694824219,
            "rightMargin": 70.9000015258789,
            "topMargin": 127.5999984741211,
            "bottomMargin": 70.9000015258789,
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
        "fontColor": "empty"
      },
      "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "lineSpacing": 1.5,
        "lineSpacingType": "Multiple",
        "textAlignment": "Left"
      },
      "lists": [
        {
          "listId": 1,
          "abstractListId": 1
        },
        {
          "listId": 2,
          "abstractListId": 2
        },
        {
          "listId": 3,
          "abstractListId": 3
        },
        {
          "listId": 4,
          "abstractListId": 4
        }
      ],
      "abstractLists": [
        {
          "abstractListId": 1,
          "levels": [
            {
              "startAt": 1,
              "restartLevel": 0,
              "listLevelPattern": "Arabic",
              "followCharacter": "Tab",
              "numberFormat": "%1.",
              "characterFormat": {
                "bold": true,
                "italic": false,
                "strikethrough": "None",
                "fontSize": 12,
                "fontFamily": "Arial",
                "fontColor": "#00000000",
                "fontFamilyBidi": "Arial",
                "allCaps": true
              },
              "paragraphFormat": {
                "leftIndent": 39.29999923706055,
                "firstLineIndent": -18,
                "lineSpacing": 16,
                "lineSpacingType": "AtLeast",
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 1,
              "listLevelPattern": "Arabic",
              "followCharacter": "Tab",
              "numberFormat": "%1.%2.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 75.9000015258789,
                "firstLineIndent": -21.600000381469727,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 2,
              "listLevelPattern": "Arabic",
              "followCharacter": "Tab",
              "numberFormat": "%1.%2.%3.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 129,
                "firstLineIndent": -25.200000762939453,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 3,
              "listLevelPattern": "Arabic",
              "followCharacter": "Tab",
              "numberFormat": "%1.%2.%3.%4.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 122.69999694824219,
                "firstLineIndent": -32.400001525878906,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 4,
              "listLevelPattern": "Arabic",
              "followCharacter": "Tab",
              "numberFormat": "%1.%2.%3.%4.%5.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 147.89999389648438,
                "firstLineIndent": -39.599998474121094,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 5,
              "listLevelPattern": "Arabic",
              "followCharacter": "Tab",
              "numberFormat": "%1.%2.%3.%4.%5.%6.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 173.10000610351562,
                "firstLineIndent": -46.79999923706055,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 6,
              "listLevelPattern": "Arabic",
              "followCharacter": "Tab",
              "numberFormat": "%1.%2.%3.%4.%5.%6.%7.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 198.3000030517578,
                "firstLineIndent": -54,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 7,
              "listLevelPattern": "Arabic",
              "followCharacter": "Tab",
              "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 223.5,
                "firstLineIndent": -61.20000076293945,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 8,
              "listLevelPattern": "Arabic",
              "followCharacter": "Tab",
              "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.%9.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 252.3000030517578,
                "firstLineIndent": -72,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            }
          ]
        },
        {
          "abstractListId": 2,
          "levels": [
            {
              "startAt": 1,
              "restartLevel": 0,
              "listLevelPattern": "LowLetter",
              "followCharacter": "Tab",
              "numberFormat": "%1)",
              "characterFormat": {
                "bold": false,
                "italic": false,
                "strikethrough": "None",
                "fontFamily": "Arial",
                "fontColor": "#000000FF",
                "fontFamilyBidi": "Arial",
                "allCaps": false
              },
              "paragraphFormat": {
                "leftIndent": 60,
                "firstLineIndent": -18,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 1,
              "listLevelPattern": "LowLetter",
              "followCharacter": "Tab",
              "numberFormat": "%2.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 96,
                "firstLineIndent": -18,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 2,
              "listLevelPattern": "LowRoman",
              "followCharacter": "Tab",
              "numberFormat": "%3.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 132,
                "firstLineIndent": -9,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 3,
              "listLevelPattern": "Arabic",
              "followCharacter": "Tab",
              "numberFormat": "%4.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 168,
                "firstLineIndent": -18,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 4,
              "listLevelPattern": "LowLetter",
              "followCharacter": "Tab",
              "numberFormat": "%5.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 204,
                "firstLineIndent": -18,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 5,
              "listLevelPattern": "LowRoman",
              "followCharacter": "Tab",
              "numberFormat": "%6.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 240,
                "firstLineIndent": -9,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 6,
              "listLevelPattern": "Arabic",
              "followCharacter": "Tab",
              "numberFormat": "%7.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 276,
                "firstLineIndent": -18,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 7,
              "listLevelPattern": "LowLetter",
              "followCharacter": "Tab",
              "numberFormat": "%8.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 312,
                "firstLineIndent": -18,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 8,
              "listLevelPattern": "LowRoman",
              "followCharacter": "Tab",
              "numberFormat": "%9.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 348,
                "firstLineIndent": -9,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            }
          ]
        },
        {
          "abstractListId": 3,
          "levels": [
            {
              "startAt": 1,
              "restartLevel": 0,
              "listLevelPattern": "LowLetter",
              "followCharacter": "Tab",
              "numberFormat": "%1)",
              "characterFormat": {
                "bold": false,
                "italic": false,
                "strikethrough": "None",
                "fontFamily": "Arial",
                "fontColor": "#00000000",
                "fontFamilyBidi": "Arial",
                "allCaps": false
              },
              "paragraphFormat": {
                "leftIndent": 58.54999923706055,
                "firstLineIndent": -18,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 1,
              "listLevelPattern": "LowLetter",
              "followCharacter": "Tab",
              "numberFormat": "%2.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 94.55000305175781,
                "firstLineIndent": -18,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 2,
              "listLevelPattern": "LowRoman",
              "followCharacter": "Tab",
              "numberFormat": "%3.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 130.5500030517578,
                "firstLineIndent": -9,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 3,
              "listLevelPattern": "Arabic",
              "followCharacter": "Tab",
              "numberFormat": "%4.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 166.5500030517578,
                "firstLineIndent": -18,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 4,
              "listLevelPattern": "LowLetter",
              "followCharacter": "Tab",
              "numberFormat": "%5.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 202.5500030517578,
                "firstLineIndent": -18,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 5,
              "listLevelPattern": "LowRoman",
              "followCharacter": "Tab",
              "numberFormat": "%6.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 238.5500030517578,
                "firstLineIndent": -9,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 6,
              "listLevelPattern": "Arabic",
              "followCharacter": "Tab",
              "numberFormat": "%7.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 274.54998779296875,
                "firstLineIndent": -18,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 7,
              "listLevelPattern": "LowLetter",
              "followCharacter": "Tab",
              "numberFormat": "%8.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 310.54998779296875,
                "firstLineIndent": -18,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 8,
              "listLevelPattern": "LowRoman",
              "followCharacter": "Tab",
              "numberFormat": "%9.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 346.54998779296875,
                "firstLineIndent": -9,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            }
          ]
        },
        {
          "abstractListId": 4,
          "levels": [
            {
              "startAt": 1,
              "restartLevel": 0,
              "listLevelPattern": "LowLetter",
              "followCharacter": "Tab",
              "numberFormat": "%1)",
              "characterFormat": {
                "bold": false,
                "italic": false,
                "strikethrough": "None",
                "fontFamily": "Arial",
                "fontColor": "#00000000",
                "fontFamilyBidi": "Arial",
                "allCaps": false
              },
              "paragraphFormat": {
                "leftIndent": 58.54999923706055,
                "firstLineIndent": -18,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 1,
              "listLevelPattern": "LowLetter",
              "followCharacter": "Tab",
              "numberFormat": "%2.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 94.55000305175781,
                "firstLineIndent": -18,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 2,
              "listLevelPattern": "LowRoman",
              "followCharacter": "Tab",
              "numberFormat": "%3.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 130.5500030517578,
                "firstLineIndent": -9,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 3,
              "listLevelPattern": "Arabic",
              "followCharacter": "Tab",
              "numberFormat": "%4.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 166.5500030517578,
                "firstLineIndent": -18,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 4,
              "listLevelPattern": "LowLetter",
              "followCharacter": "Tab",
              "numberFormat": "%5.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 202.5500030517578,
                "firstLineIndent": -18,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 5,
              "listLevelPattern": "LowRoman",
              "followCharacter": "Tab",
              "numberFormat": "%6.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 238.5500030517578,
                "firstLineIndent": -9,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 6,
              "listLevelPattern": "Arabic",
              "followCharacter": "Tab",
              "numberFormat": "%7.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 274.54998779296875,
                "firstLineIndent": -18,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 7,
              "listLevelPattern": "LowLetter",
              "followCharacter": "Tab",
              "numberFormat": "%8.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 310.54998779296875,
                "firstLineIndent": -18,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
                  }
                ]
              }
            },
            {
              "startAt": 1,
              "restartLevel": 8,
              "listLevelPattern": "LowRoman",
              "followCharacter": "Tab",
              "numberFormat": "%9.",
              "characterFormat": {
                "bold": false,
                "fontFamily": "Times New Roman",
                "fontColor": "empty"
              },
              "paragraphFormat": {
                "leftIndent": 346.54998779296875,
                "firstLineIndent": -9,
                "tabs": [
                  {
                    "tabJustification": "Left",
                    "position": 0,
                    "tabLeader": "None",
                    "deletePosition": 0
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
            "bold": false,
            "italic": false,
            "strikethrough": "None",
            "fontSize": 12,
            "fontFamily": "Arial",
            "fontColor": "#00000000",
            "bidi": false,
            "fontSizeBidi": 12,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          },
          "paragraphFormat": {
            "leftIndent": 0,
            "rightIndent": 0,
            "lineSpacing": 1.5,
            "lineSpacingType": "Multiple",
            "textAlignment": "Left"
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
          "name": "heading1,Main Title,Main Title1,Para1,Para11,1,Para level 1,Level 1,hd1,Heading 1A,h1,heading 1,11,level 1,12,level 11,Level 11,13,14,111,level 12,Level 12,121,level 111,Level 111,131,Heading Annex0",
          "basedOn": "Normal",
          "next": "heading1,Main Title,Main Title1,Para1,Para11,1,Para level 1,Level 1,hd1,Heading 1A,h1,heading 1,11,level 1,12,level 11,Level 11,13,14,111,level 12,Level 12,121,level 111,Level 111,131,Heading Annex0",
          "characterFormat": {
            "bold": true,
            "italic": false,
            "strikethrough": "None",
            "fontSize": 14,
            "fontFamily": "Arial",
            "fontColor": "#00000000",
            "bidi": false,
            "fontSizeBidi": 14,
            "fontFamilyBidi": "Arial",
            "allCaps": true
          },
          "paragraphFormat": {
            "leftIndent": 72,
            "rightIndent": 0,
            "firstLineIndent": -57.599998474121094,
            "beforeSpacing": 12,
            "afterSpacing": 6,
            "lineSpacing": 16,
            "lineSpacingType": "AtLeast",
            "outlineLevel": "Level1",
            "textAlignment": "Justify",
            "tabs": [
              {
                "tabJustification": "Left",
                "position": 72,
                "tabLeader": "None",
                "deletePosition": 0
              }
            ]
          }
        },
        {
          "type": "Paragraph",
          "name": "Heading 3",
          "basedOn": "Normal",
          "next": "Heading 3",
          "characterFormat": {
            "bold": false,
            "italic": false,
            "strikethrough": "None",
            "fontSize": 12,
            "fontFamily": "Arial",
            "fontColor": "#000000FF",
            "bidi": false,
            "fontSizeBidi": 12,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          },
          "paragraphFormat": {
            "leftIndent": 72,
            "rightIndent": 0,
            "firstLineIndent": -57.599998474121094,
            "beforeSpacing": 3,
            "afterSpacing": 3,
            "lineSpacing": 1.5,
            "lineSpacingType": "Multiple",
            "outlineLevel": "Level3",
            "textAlignment": "Left",
            "tabs": [
              {
                "tabJustification": "Left",
                "position": 72,
                "tabLeader": "None",
                "deletePosition": 0
              }
            ]
          }
        },
        {
          "type": "Paragraph",
          "name": "Heading 5",
          "basedOn": "Normal",
          "next": "Heading 5",
          "characterFormat": {
            "bold": false,
            "italic": false,
            "strikethrough": "None",
            "fontSize": 11,
            "fontFamily": "Arial",
            "fontColor": "#00000000",
            "bidi": false,
            "fontSizeBidi": 11,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          },
          "paragraphFormat": {
            "leftIndent": 39.599998474121094,
            "rightIndent": 0,
            "firstLineIndent": -50.400001525878906,
            "beforeSpacing": 12,
            "afterSpacing": 3,
            "lineSpacing": 1.5,
            "lineSpacingType": "Multiple",
            "outlineLevel": "Level5",
            "textAlignment": "Left",
            "tabs": [
              {
                "tabJustification": "Left",
                "position": 39.599998474121094,
                "tabLeader": "None",
                "deletePosition": 0
              }
            ]
          }
        },
        {
          "type": "Paragraph",
          "name": "Heading 6",
          "basedOn": "Normal",
          "next": "Heading 6",
          "characterFormat": {
            "bold": false,
            "italic": true,
            "strikethrough": "None",
            "fontSize": 11,
            "fontFamily": "Arial",
            "fontColor": "#00000000",
            "bidi": false,
            "fontSizeBidi": 11,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          },
          "paragraphFormat": {
            "leftIndent": 46.79999923706055,
            "rightIndent": 0,
            "firstLineIndent": -57.599998474121094,
            "beforeSpacing": 12,
            "afterSpacing": 3,
            "lineSpacing": 1.5,
            "lineSpacingType": "Multiple",
            "outlineLevel": "Level6",
            "textAlignment": "Left",
            "tabs": [
              {
                "tabJustification": "Left",
                "position": 46.79999923706055,
                "tabLeader": "None",
                "deletePosition": 0
              }
            ]
          }
        },
        {
          "type": "Paragraph",
          "name": "Heading 7",
          "basedOn": "Normal",
          "next": "Heading 7",
          "characterFormat": {
            "bold": false,
            "italic": false,
            "strikethrough": "None",
            "fontSize": 12,
            "fontFamily": "Arial",
            "fontColor": "#00000000",
            "bidi": false,
            "fontSizeBidi": 12,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          },
          "paragraphFormat": {
            "leftIndent": 54,
            "rightIndent": 0,
            "firstLineIndent": -64.80000305175781,
            "beforeSpacing": 12,
            "afterSpacing": 3,
            "lineSpacing": 1.5,
            "lineSpacingType": "Multiple",
            "outlineLevel": "Level7",
            "textAlignment": "Left",
            "tabs": [
              {
                "tabJustification": "Left",
                "position": 54,
                "tabLeader": "None",
                "deletePosition": 0
              }
            ]
          }
        },
        {
          "type": "Paragraph",
          "name": "Heading 8",
          "basedOn": "Normal",
          "next": "Heading 8",
          "characterFormat": {
            "bold": false,
            "italic": true,
            "strikethrough": "None",
            "fontSize": 12,
            "fontFamily": "Arial",
            "fontColor": "#00000000",
            "bidi": false,
            "fontSizeBidi": 12,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          },
          "paragraphFormat": {
            "leftIndent": 61.20000076293945,
            "rightIndent": 0,
            "firstLineIndent": -72,
            "beforeSpacing": 12,
            "afterSpacing": 3,
            "lineSpacing": 1.5,
            "lineSpacingType": "Multiple",
            "outlineLevel": "Level8",
            "textAlignment": "Left",
            "tabs": [
              {
                "tabJustification": "Left",
                "position": 61.20000076293945,
                "tabLeader": "None",
                "deletePosition": 0
              }
            ]
          }
        },
        {
          "type": "Paragraph",
          "name": "Heading 9",
          "basedOn": "Normal",
          "next": "Heading 9",
          "characterFormat": {
            "bold": false,
            "italic": true,
            "strikethrough": "None",
            "fontSize": 9,
            "fontFamily": "Arial",
            "fontColor": "#00000000",
            "bidi": false,
            "fontSizeBidi": 9,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          },
          "paragraphFormat": {
            "leftIndent": 68.4000015258789,
            "rightIndent": 0,
            "firstLineIndent": -79.19999694824219,
            "beforeSpacing": 12,
            "afterSpacing": 3,
            "lineSpacing": 1.5,
            "lineSpacingType": "Multiple",
            "outlineLevel": "Level9",
            "textAlignment": "Left",
            "tabs": [
              {
                "tabJustification": "Left",
                "position": 68.4000015258789,
                "tabLeader": "None",
                "deletePosition": 0
              }
            ]
          }
        },
        {
          "type": "Character",
          "name": "Heading1 Char,Main Title Char,Main Title1 Char,Para1 Char,Para11 Char,1 Char,Para level 1 Char,Level 1 Char,hd1 Char,Heading 1A Char,h1 Char,heading 1 Char,11 Char,level 1 Char,12 Char,level 11 Char,Level 11 Char,13 Char,14 Char,111 Char,level 12 Char",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
            "bold": true,
            "italic": false,
            "strikethrough": "None",
            "fontSize": 14,
            "fontFamily": "Arial",
            "fontColor": "#00000000",
            "bidi": false,
            "fontSizeBidi": 14,
            "fontFamilyBidi": "Arial",
            "allCaps": true
          }
        },
        {
          "type": "Character",
          "name": "Heading 3 Char",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
            "bold": false,
            "italic": false,
            "strikethrough": "None",
            "fontSize": 12,
            "fontFamily": "Arial",
            "fontColor": "#000000FF",
            "bidi": false,
            "fontSizeBidi": 12,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          }
        },
        {
          "type": "Character",
          "name": "Heading 5 Char",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
            "bold": false,
            "italic": false,
            "strikethrough": "None",
            "fontSize": 11,
            "fontFamily": "Arial",
            "fontColor": "#00000000",
            "bidi": false,
            "fontSizeBidi": 11,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          }
        },
        {
          "type": "Character",
          "name": "Heading 6 Char",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
            "bold": false,
            "italic": true,
            "strikethrough": "None",
            "fontSize": 11,
            "fontFamily": "Arial",
            "fontColor": "#00000000",
            "bidi": false,
            "fontSizeBidi": 11,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          }
        },
        {
          "type": "Character",
          "name": "Heading 7 Char",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
            "bold": false,
            "italic": false,
            "strikethrough": "None",
            "fontSize": 12,
            "fontFamily": "Arial",
            "fontColor": "#00000000",
            "bidi": false,
            "fontSizeBidi": 12,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          }
        },
        {
          "type": "Character",
          "name": "Heading 8 Char",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
            "bold": false,
            "italic": true,
            "strikethrough": "None",
            "fontSize": 12,
            "fontFamily": "Arial",
            "fontColor": "#00000000",
            "bidi": false,
            "fontSizeBidi": 12,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          }
        },
        {
          "type": "Character",
          "name": "Heading 9 Char",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
            "bold": false,
            "italic": true,
            "strikethrough": "None",
            "fontSize": 9,
            "fontFamily": "Arial",
            "fontColor": "#00000000",
            "bidi": false,
            "fontSizeBidi": 9,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          }
        },
        {
          "type": "Paragraph",
          "name": "header,Department",
          "basedOn": "Normal",
          "next": "header,Department",
          "characterFormat": {
            "bold": false,
            "italic": false,
            "strikethrough": "None",
            "fontSize": 14,
            "fontFamily": "Arial",
            "fontColor": "#00000000",
            "bidi": false,
            "fontSizeBidi": 14,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          },
          "paragraphFormat": {
            "leftIndent": 0,
            "rightIndent": 0,
            "lineSpacing": 1.5,
            "lineSpacingType": "Multiple",
            "textAlignment": "Left",
            "tabs": [
              {
                "tabJustification": "Center",
                "position": 216,
                "tabLeader": "None",
                "deletePosition": 0
              },
              {
                "tabJustification": "Right",
                "position": 432,
                "tabLeader": "None",
                "deletePosition": 0
              }
            ]
          }
        },
        {
          "type": "Character",
          "name": "HeaderChar,Department Char",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
            "bold": false,
            "italic": false,
            "strikethrough": "None",
            "fontSize": 14,
            "fontFamily": "Arial",
            "fontColor": "#00000000",
            "bidi": false,
            "fontSizeBidi": 14,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          }
        },
        {
          "type": "Paragraph",
          "name": "Block Text",
          "basedOn": "Normal",
          "next": "Block Text",
          "characterFormat": {
            "bold": false,
            "italic": false,
            "strikethrough": "None",
            "fontSize": 12,
            "fontFamily": "Arial",
            "fontColor": "#00000000",
            "bidi": false,
            "fontSizeBidi": 12,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          },
          "paragraphFormat": {
            "leftIndent": 72,
            "rightIndent": 5.650000095367432,
            "beforeSpacing": 3,
            "afterSpacing": 1,
            "lineSpacing": 1.5,
            "lineSpacingType": "Multiple",
            "textAlignment": "Justify"
          }
        },
        {
          "type": "Character",
          "name": "page number",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
            "bold": false,
            "italic": false,
            "strikethrough": "None",
            "fontColor": "#00000000",
            "bidi": false,
            "allCaps": false
          }
        },
        {
          "type": "Paragraph",
          "name": "Footer",
          "basedOn": "Normal",
          "next": "Footer",
          "characterFormat": {
            "bold": false,
            "italic": false,
            "strikethrough": "None",
            "fontSize": 14,
            "fontFamily": "Arial",
            "fontColor": "#00000000",
            "bidi": false,
            "fontSizeBidi": 14,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          },
          "paragraphFormat": {
            "leftIndent": 0,
            "rightIndent": 0,
            "lineSpacing": 1.5,
            "lineSpacingType": "Multiple",
            "textAlignment": "Left",
            "tabs": [
              {
                "tabJustification": "Center",
                "position": 216,
                "tabLeader": "None",
                "deletePosition": 0
              },
              {
                "tabJustification": "Right",
                "position": 432,
                "tabLeader": "None",
                "deletePosition": 0
              }
            ]
          }
        },
        {
          "type": "Character",
          "name": "Footer Char",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
            "bold": false,
            "italic": false,
            "strikethrough": "None",
            "fontSize": 14,
            "fontFamily": "Arial",
            "fontColor": "#00000000",
            "bidi": false,
            "fontSizeBidi": 14,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          }
        },
        {
          "type": "Paragraph",
          "name": "Body Text Indent 2",
          "basedOn": "Normal",
          "next": "Body Text Indent 2",
          "characterFormat": {
            "bold": true,
            "italic": false,
            "strikethrough": "None",
            "fontSize": 12,
            "fontFamily": "Arial",
            "fontColor": "#000000FF",
            "bidi": false,
            "fontSizeBidi": 12,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          },
          "paragraphFormat": {
            "leftIndent": 72,
            "rightIndent": 0,
            "firstLineIndent": -72,
            "lineSpacing": 1.5,
            "lineSpacingType": "Multiple",
            "textAlignment": "Justify"
          }
        },
        {
          "type": "Character",
          "name": "Body Text Indent 2 Char",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
            "bold": true,
            "italic": false,
            "strikethrough": "None",
            "fontSize": 12,
            "fontFamily": "Arial",
            "fontColor": "#000000FF",
            "bidi": false,
            "fontSizeBidi": 12,
            "fontFamilyBidi": "Arial",
            "allCaps": false
          }
        }
      ],
      "defaultTabWidth": 36,
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
    editor.editorModule.paste(JSON.stringify(str));
    expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[6] as ParagraphWidget).paragraphFormat.listFormat.listId).toBe(3);
    let listText: string = (((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[6] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as ListTextElementBox).text;
    expect(listText).toBe('a)');
  });
});

/**
 * Insert Table below current table validation
 */

describe('Insert table', () => {
  let editor: DocumentEditor = undefined;
  beforeAll(() => {
    document.body.innerHTML = '';
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
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
  it('below current table validation', () => {
    console.log('below current table validation');
    editor.editorModule.insertTable(2, 2);
    editor.selection.handleDownKey();
    editor.selection.handleDownKey();
    editor.editorModule.insertTable(1, 1);
    expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
  });
  it('undo after insert table', () => {
    console.log('undo after insert table');
    editor.editorHistory.undo();
    expect(editor.selection.start.paragraph.isInsideTable).toBe(false);
  });
  it('redo after undo insert table', () => {
    console.log('redo after undo insert table');
    editor.editorHistory.redo();
    expect(editor.selection.start.paragraph.previousWidget instanceof TableWidget).toBe(true);
  });
  it('Multiple undo and redo after insertTable', () => {
    console.log('Multiple undo and redo after insertTable');
    editor.editorHistory.undo();
    editor.editorHistory.redo();
    expect(editor.selection.start.paragraph.previousWidget instanceof TableWidget).toBe(true);
  });
});

/**
 * Insert text before page break validation
 */

describe('Insert text after page break', () => {
  let editor: DocumentEditor = undefined;
  beforeAll(() => {
    document.body.innerHTML = '';
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
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
  it('In non-empty paragraph insert text and page break validation', () => {
    console.log('In non-empty paragraph insert text and page break validation');
    editor.editor.insertText('sample');
    editor.editorModule.insertPageBreak();
    editor.editor.insertText('s');
    editor.selection.handleUpKey();
    editor.editor.insertText('s');
    expect(editor.documentHelper.pages.indexOf(editor.documentHelper.currentPage)).toBe(0);
  });
  it('In empty paragraph insert text and page break validation', () => {
    console.log('In empty paragraph insert text and page break validation');
    editor.editorModule.insertPageBreak();
    editor.editor.insertText('sample');
    editor.selection.handleUpKey();
    editor.editor.insertText('s');
    expect(editor.documentHelper.pages.indexOf(editor.documentHelper.currentPage)).toBe(0);
  });
  it('undo after insert text', () => {
    console.log('undo after insert text');
    editor.editorHistory.undo();
    expect(editor.selection.start.currentWidget.children.length).toBe(1);
  });
  it('redo after insert text', () => {
    console.log('redo after insert text');
    editor.editorHistory.redo();
    expect(editor.selection.start.currentWidget.children.length).toBe(2);
  });
});


/**
 * delete before page break
 */

describe('Delete before page break', () => {
  let editor: DocumentEditor = undefined;
  beforeAll(() => {
    document.body.innerHTML = '';
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
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
  it('Insert page break and delete', () => {
    console.log('Insert page break and delete');
    editor.editorModule.insertPageBreak();
    editor.selection.selectAll();
    editor.editor.insertBookmark('sample');
    editor.selection.handleUpKey();
    expect(() => { editor.editor.delete(); }).not.toThrowError();
  });
});



describe('Paste sfdt', () => {
  let editor: DocumentEditor = undefined;
  beforeAll(() => {
    document.body.innerHTML = '';
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
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
  it('Merge With ExistingFormatting option validation', () => {
    console.log('Merge With ExistingFormatting option validation');
    let str = '{"sections":[{"blocks":[{"characterFormat":{"bold":false,"italic":true,"strikethrough":"SingleStrike","highlightColor":"Yellow","fontSize":16,"fontFamily":"Calibri Light","fontColor":"#FF0000FF","bidi":false,"fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","textAlignment":"Left","styleName":"Heading 1","bidi":false,"contextualSpacing":false},"inlines":[{"text":"Adventure work cycle","characterFormat":{"bold":false,"italic":true,"strikethrough":"SingleStrike","highlightColor":"Yellow","fontSize":16,"fontFamily":"Calibri Light","fontColor":"#FF0000FF","bidi":false,"fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"}}]},{"characterFormat":{"bold":false,"italic":true,"strikethrough":"SingleStrike","highlightColor":"Yellow","fontSize":11,"fontFamily":"Calibri","fontColor":"#FF0000FF","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"BodyText","textAlignment":"Left","styleName":"Normal","bidi":false,"contextualSpacing":false},"inlines":[]},{"characterFormat":{"bold":false,"italic":true,"strikethrough":"SingleStrike","baselineAlignment":"Normal","highlightColor":"NoColor","fontSize":11,"fontFamily":"Calibri","fontColor":"#FF0000FF","bidi":false,"boldBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"BodyText","textAlignment":"Left","styleName":"Normal","bidi":false,"contextualSpacing":false},"inlines":[{"text":"asdasdsadsadasdasdadasdasdasdasd","characterFormat":{"bold":false,"italic":true,"strikethrough":"SingleStrike","highlightColor":"Yellow","fontSize":11,"fontFamily":"Calibri","fontColor":"#FF0000FF","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"}}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36,"footerDistance":36,"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#00000000","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left"}},{"type":"Character","name":"Default Paragraph Font"},{"type":"Paragraph","name":"Heading 1","basedOn":"Normal","next":"Heading 1","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","bidi":false,"fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"beforeSpacing":12,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","textAlignment":"Left"}},{"type":"Character","name":"Heading 1 Char","basedOn":"Default Paragraph Font","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","bidi":false,"fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"}}],"defaultTabWidth":35.400001525878906,"formatting":false,"protectionType":"NoProtection","enforcement":false,"dontUseHTMLParagraphAutoSpacing":false}';
    editor.editorModule.paste(str);
    (editor.editorModule as any).copiedTextContent = 'Adventure work cycle\r\n\r\nasdasdsadsadasdasdadasdasdasdasd\r\n';
    (editor.editorModule as any).previousParaFormat = new WParagraphFormat();
    (editor.editorModule as any).previousCharFormat = new WCharacterFormat();
    expect(() => { editor.editorModule.applyPasteOptions('KeepTextOnly') }).not.toThrowError();
  });
});

/**
 * Paste with bookmark validation
 */

describe('Paste sfdt with bookmark', () => {
  let editor: DocumentEditor = undefined;
  let sfdt: string = '{"sections":[{"blocks":[{"characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#00000000","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"BodyText","textAlignment":"Left","styleName":"Normal","bidi":false,"contextualSpacing":false},"inlines":[{"name":"sample","bookmarkType":0},{"text":"Sample","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#00000000","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"}},{"name":"sample","bookmarkType":1}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36,"footerDistance":36,"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#00000000","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left"}},{"type":"Character","name":"Default Paragraph Font"}],"defaultTabWidth":35.400001525878906,"formatting":false,"protectionType":"NoProtection","enforcement":false,"dontUseHTMLParagraphAutoSpacing":false}';
  beforeAll(() => {
    document.body.innerHTML = '';
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
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
    sfdt = undefined;
    document.body.innerHTML = '';
    setTimeout(() => {
      done();
    }, 1000);
  });
  it('paste with same bookmark name', () => {
    console.log('paste with same bookmark name');
    editor.editor.insertText('sample');
    editor.selection.selectAll();
    editor.editor.insertBookmark('sample');
    editor.selection.handleEndKey();
    editor.editor.onEnter();
    editor.editor.paste(sfdt);
    expect(editor.selection.start.currentWidget.children.length).toBe(1);
  });
  it('paste with different bookmark name', () => {
    console.log('paste with different bookmark name');
    editor.openBlank();
    editor.editor.insertText('sample');
    editor.selection.selectAll();
    editor.editor.insertBookmark('sample1');
    editor.selection.handleEndKey();
    editor.editor.onEnter();
    editor.editor.paste(sfdt);
    expect(editor.selection.start.currentWidget.children.length).toBe(3);
  });
});

describe('Insert text after page break', () => {
  let editor: DocumentEditor = undefined;
  beforeAll(() => {
    document.body.innerHTML = '';
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
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
  it('In non-empty paragraph insert text and page break validation', () => {
    console.log('In non-empty paragraph insert text and page break validation');
    editor.editor.insertText('sample');
    editor.editorModule.insertPageBreak();
    editor.editor.insertText('s');
    editor.selection.handleUpKey();
    editor.editor.insertText('s');
    expect(editor.documentHelper.pages.indexOf(editor.documentHelper.currentPage)).toBe(0);
  });
  it('In empty paragraph insert text and page break validation', () => {
    console.log('In empty paragraph insert text and page break validation');
    editor.editorModule.insertPageBreak();
    editor.editor.insertText('sample');
    editor.selection.handleUpKey();
    editor.editor.insertText('s');
    expect(editor.documentHelper.pages.indexOf(editor.documentHelper.currentPage)).toBe(0);
  });
  it('undo after insert text', () => {
    console.log('undo after insert text');
    editor.editorHistory.undo();
    expect(editor.selection.start.currentWidget.children.length).toBe(1);
  });
  it('redo after insert text', () => {
    console.log('redo after insert text');
    editor.editorHistory.redo();
    expect(editor.selection.start.currentWidget.children.length).toBe(2);
  });
});

let InlineTextFormField: any = {
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
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
            {
              "characterFormat": {
              },
              "text": "    "
            },
            {
              "characterFormat": {
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
                  "maxLength": 7,
                  "defaultValue": "abcdefi",
                  "format": ""
                }
              }
            },
            {
              "characterFormat": {
              },
              "bookmarkType": 0,
              "name": "Text1"
            },
            {
              "characterFormat": {
              },
              "text": " FORMTEXT "
            },
            {
              "characterFormat": {
              },
              "fieldType": 2
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
              "text": "abcd"
            },
            {
              "characterFormat": {
              },
              "bookmarkType": 1,
              "name": "_GoBack"
            },
            {
              "characterFormat": {
              },
              "fieldType": 1
            },
            {
              "characterFormat": {
              },
              "bookmarkType": 1,
              "name": "Text1"
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
  "hashValue": "bOO6R8mcZJYNW8+tPdFsn0PUVi83/gXfcjeQ8FhX0I3ky1i0H9KBncmYDbNfyJyNPWZHFQ5kRxq+crA5J7VmkA==",
  "saltValue": "B4u5TipjFYLAVlxrAo7JdQ==",
  "formatting": false,
  "protectionType": "FormFieldsOnly",
  "dontUseHTMLParagraphAutoSpacing": false,
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
  ],
  "comments": [
  ]
}

describe('Form Filling validation For Formatting', () => {
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
    editor.open(JSON.stringify(InlineTextFormField));
    editor.selection.isHighlightEditRegion = true;
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
  it('Inline TextFormField validation For Paste', () => {
    console.log('Inline TextFormField validation For Paste');
    editor.editor.addProtection('', 'FormFieldsOnly');
    editor.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
    let formfields: FieldElementBox[] = editor.documentHelper.formFields;
    let formfield: TextFormField = formfields[0].formFieldData as TextFormField;
    let resultText: String = formfields[0].resultText;
    let maxLength: number = formfield.maxLength;
    editor.selection.handleControlRightKey();
    editor.selection.handleRightKey();
    editor.selection.handleRightKey();
    editor.enableLocalPaste = true;
    editor.editorModule.pasteContents('syncfusion');
    expect(maxLength).toBe(7);
    let afterpasteText: string = formfields[0].resultText;
    expect(resultText).not.toBe(afterpasteText);
    expect(editor.documentHelper.protectionType).toBe('FormFieldsOnly');
    expect(editor.documentHelper.isDocumentProtected).toBe(true);
  });
  it('Inline TextFormField validation For Textformatting', () => {
    console.log('Inline TextFormField validation For Textformatting');
    editor.editor.addProtection('', 'FormFieldsOnly');
    editor.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
    let formfield: FieldElementBox = editor.documentHelper.formFields[0];
    (formfield.formFieldData as TextFormField).format = 'uppercase';
    editor.editor.applyFormTextFormat(formfield);
    let resultText: string = formfield.resultText;
    let formattedText: string = resultText.toUpperCase();
    expect(resultText).toBe(formattedText);
    (formfield.formFieldData as TextFormField).format = 'lowercase';
    editor.editor.applyFormTextFormat(formfield);
    resultText = formfield.resultText;
    formattedText = resultText.toLowerCase();
    expect(resultText).toBe(formattedText);
    (formfield.formFieldData as TextFormField).format = 'first capital';
    editor.editor.applyFormTextFormat(formfield);
    resultText = formfield.resultText;
    formattedText = HelperMethods.formatText('first capital', resultText);
    expect(resultText).toBe(formattedText);
  });
  it('Inline TextFormField validation For delete', () => {
    console.log('Inline TextFormField validation For delete');
    editor.editor.addProtection('', 'FormFieldsOnly');
    editor.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
    let formfield: FieldElementBox = editor.documentHelper.formFields[0];
    editor.selection.selectFieldInternal(formfield);
    editor.editor.delete();
    let resultText: string = editor.editor.getFormFieldText(formfield);
    let text: string = editor.documentHelper.textHelper.repeatChar(editor.documentHelper.textHelper.getEnSpaceCharacter(), 5);
    expect(resultText).toBe(text);
  });
  it('Inline TextFormField validation For insert text', () => {
    console.log('Inline TextFormField validation For insert text');
    editor.editor.addProtection('', 'FormFieldsOnly');
    editor.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
    let formfield: FieldElementBox = editor.documentHelper.formFields[0];
    editor.selection.handleControlRightKey();
    editor.selection.handleRightKey();;
    editor.editor.insertText('Hello');
    let resultText: string = editor.editor.getFormFieldText(formfield);
    expect(resultText).toBe('Hello');
  });
  it('Inline TextFormField validation For backspace', () => {
    console.log('Inline TextFormField validation For backspace');
    editor.editor.addProtection('', 'FormFieldsOnly');
    editor.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
    let formfield: FieldElementBox = editor.documentHelper.formFields[0];
    editor.selection.selectFieldInternal(formfield);
    editor.editor.onBackSpace();
    let resultText: string = editor.editor.getFormFieldText(formfield);
    let text: string = editor.documentHelper.textHelper.repeatChar(editor.documentHelper.textHelper.getEnSpaceCharacter(), 5);
    expect(resultText).toBe(text);
  });
});


describe('Insert row below validation', () => {
  let editor: DocumentEditor = undefined;
  beforeAll(() => {
    document.body.innerHTML = '';
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
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
  it('with different border', () => {
    console.log('with different border');
    editor.editorModule.insertTable(2, 2);
    editor.selection.handleDownKey();
    editor.selection.selectRow();
    let settings: any = { type: 'BottomBorder', borderColor: '#000000', lineWidth: 3, borderStyle: 'Single' };
    editor.editorModule.applyBorders(settings);
    editor.editor.insertRow();
    editor.selection.handleUpKey();
    expect(editor.selection.start.paragraph.associatedCell.ownerRow.bottomBorderWidth).toBe(0);
  });
});

describe('Update Revision Collection validation', () => {
  let editor: DocumentEditor = undefined;
  beforeAll(() => {
    document.body.innerHTML = '';
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
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
  it('Update Revision Collection validation', () => {
    console.log('Update Revision Collection validation');
    editor.enableTrackChanges = true;
    editor.editorModule.insertText('Syncfusion');
    editor.enableTrackChanges = false;
    editor.selection.handleControlLeftKey();
    editor.selection.handleControlHomeKey();
    editor.enableTrackChanges = false;
    editor.editor.onEnter();
    editor.selection.handleControlHomeKey();
    editor.enableTrackChanges = true;
    editor.editorModule.insertText('Document Editor');
    let text: string = (editor.revisions.changes[0].range[0] as TextElementBox).text;
    expect(text).toBe('Document Editor');
    text = (editor.revisions.changes[1].range[0] as TextElementBox).text;
    expect(text).toBe('Syncfusion');

  });
});

describe('Validate Track Change have Page Break', () => {
  let container: DocumentEditor;
  let imageResizer: ImageResizer;
  beforeAll(() => {
    document.body.innerHTML = '';
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    DocumentEditor.Inject(Editor, Selection, EditorHistory, ImageResizer);
    container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableImageResizer: true });
    (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
    (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
    (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
    (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
    container.appendTo('#container');
    imageResizer = container.imageResizerModule;
  });
  afterAll((done): void => {
    container.destroy();
    imageResizer.destroy();
    imageResizer = undefined;
    document.body.removeChild(document.getElementById('container'));
    container = undefined;
    document.body.innerHTML = '';
    setTimeout(function () {
      done();
    }, 1000);
  });
  // it('Rejected page break revision Validation', function () {
  //   console.log('Rejected page break revision Validation');
  //   container.editor.insertText('Hello World');
  //   container.selection.handleControlLeftKey();
  //   container.enableTrackChanges = true;
  //   container.showRevisions = true;
  //   container.editor.insertPageBreak();
  //   expect(container.documentHelper.pages.length).toBe(2);
  //   expect(container.selection.start.currentWidget.children.length).toBe(1);
  //   expect(container.revisions.length).toBe(1);
  //   container.revisions.rejectAll();
  //   expect(container.trackChangesPane.isTrackingPageBreak).toBe(true);
  //   expect(container.selection.start.currentWidget.children.length).toBe(2);
  //   expect(container.revisions.length).toBe(0);
  //   container.editorHistory.undo();
  //   expect(container.revisions.length).toBe(1);
  //   container.editorHistory.redo();
  //   expect(container.revisions.length).toBe(0);
  // });
  // it('image resizer validation', function () {
  //   console.log('image resizer validation');
  //   container.openBlank();
  //   let imageString: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADQSURBVFhH7ZbRDYQgDIYZ5UZhFEdxlBuFUUhY4N7vwWtTURJz5tem8GAbTYS0/eGjWsN7hJVSAuku3c2FuyF31BvqBNu90/mLmnSRjKDbMZULt2csz/kV8hRbVjSkSZkxRC0yKcbl+6FLhttSDIV5W6vYnKeZVWkR1WyFGbhIHrAbCzPhEcL1XCvqptYMd7xXExUXM4+pT3ENe53OP5yGqJ8kDDZGpIld6E730uFR/uuDs1J6OmolQDzcUeOslJ6OWgkQD3fUOCulJ6Ome4j9AGEu0k90WN54AAAAAElFTkSuQmCC';
  //   container.editor.insertImage(imageString, 100, 100);
  //   container.editor.insertBookmark('check');
  //   let event: any = { offsetX: 173, offsetY: 116, preventDefault: function () { }, ctrlKey: false, which: 1 };
  //   container.documentHelper.onMouseDownInternal(event);
  //   let event2: any = { offsetX: 173, offsetY: 116, preventDefault: function () { }, ctrlKey: false, which: 0 };
  //   container.documentHelper.onMouseMoveInternal(event2);
  //   container.documentHelper.onMouseDownInternal(event);
  //   container.documentHelper.onMouseMoveInternal(event2);
  //   container.documentHelper.onMouseUpInternal(event2);
  //   imageResizer.isImageResizing = true;
  //   let event3: any = { offsetX: 153, offsetY: 106, preventDefault: function () { }, ctrlKey: false, which: 0 };
  //   container.documentHelper.onMouseMoveInternal(event3);
  //   container.documentHelper.onMouseUpInternal(event3);
  //   container.documentHelper.onMouseMoveInternal(event);
  //   let eventArgs: any = { keyCode: 90, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
  //   container.documentHelper.onKeyDownInternal(eventArgs);
  //   expect(container.editorHistory.undoStack[container.editorHistory.undoStack.length - 1].action).toBe('ImageResizing');
  // });
  it('Style validation', function () {
    console.log('Style validation');
    container.openBlank();
    container.editor.applyStyle('Heading 1');
    container.editor.insertText('h');
    expect(container.documentHelper.selection.start.offset).toBe(1);
  });
});

let plainContentControl: any = { "sections": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Test " }, { "inlines": [{ "text": "ContentControl" }], "contentControlProperties": { "lockContentControl": false, "lockContents": false, "color": "#00000000", "type": "Text", "hasPlaceHolderText": false, "multiline": false, "isTemporary": false, "dateCalendarType": "Gregorian", "isChecked": false } }, { "text": " Test" }, { "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false, "restartPageNumbering": false, "pageStartingNumber": 0 } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Placeholder Text", "basedOn": "Default Paragraph Font", "characterFormat": { "fontColor": "#808080FF" } }], "defaultTabWidth": 36.0, "formatting": false, "trackChanges": false, "protectionType": "NoProtection", "enforcement": false, "dontUseHTMLParagraphAutoSpacing": false, "alignTablesRowByRow": false };
let headerContentControl: any = { "sections": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Test " }, { "inlines": [{ "text": "ContentControl" }], "contentControlProperties": { "lockContentControl": false, "lockContents": false, "color": "#00000000", "type": "Text", "hasPlaceHolderText": false, "multiline": false, "isTemporary": false, "dateCalendarType": "Gregorian", "isChecked": false } }, { "text": " Test" }] }, { "paragraphFormat": { "styleName": "Header" }, "inlines": [] }] } }, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false, "restartPageNumbering": false, "pageStartingNumber": 0 } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Paragraph", "name": "Header", "basedOn": "Normal", "next": "Header", "link": "Header Char", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Center", "position": 234.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Header Char", "basedOn": "Default Paragraph Font" }, { "type": "Paragraph", "name": "Footer", "basedOn": "Normal", "next": "Footer", "link": "Footer Char", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Center", "position": 234.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Footer Char", "basedOn": "Default Paragraph Font" }], "defaultTabWidth": 36.0, "formatting": false, "trackChanges": false, "protectionType": "NoProtection", "enforcement": false, "dontUseHTMLParagraphAutoSpacing": false, "alignTablesRowByRow": false };
let tableContentControl: any = { "sections": [{ "blocks": [{ "blocks": [{ "rows": [{ "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast" }, "cells": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "cellWidth": 233.75 } }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "cellWidth": 233.75 } }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast" }, "cells": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "cellWidth": 233.75 } }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "cellWidth": 233.75 } }] }], "title": null, "description": null, "tableFormat": { "allowAutoFit": true, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "borders": { "left": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "bidi": false, "horizontalPositionAbs": "Left", "horizontalPosition": 0.0 } }], "contentControlProperties": { "lockContentControl": false, "lockContents": true, "color": "#00000000", "type": "RichText", "hasPlaceHolderText": false, "multiline": false, "isTemporary": false, "dateCalendarType": "Gregorian", "isChecked": false } }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }, { "rows": [{ "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast" }, "cells": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal", "tabs": [{ "tabJustification": "Center", "position": 111.44999694824219, "tabLeader": "None", "deletePosition": 0.0 }] }, "inlines": [{ "text": "e" }, { "text": "\t" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "cellWidth": 233.75 } }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "e" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "cellWidth": 233.75 } }], "contentControlProperties": { "lockContentControl": true, "lockContents": false, "color": "#00000000", "type": "RichText", "hasPlaceHolderText": false, "multiline": false, "isTemporary": false, "dateCalendarType": "Gregorian", "isChecked": false } }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast" }, "cells": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "cellWidth": 233.75 } }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "cellWidth": 233.75 } }] }], "title": null, "description": null, "tableFormat": { "allowAutoFit": true, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "borders": { "left": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "bidi": false, "horizontalPositionAbs": "Left", "horizontalPosition": 0.0 } }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }, { "rows": [{ "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast" }, "cells": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "a" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 467.5, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "cellWidth": 467.5 }, "contentControlProperties": { "lockContentControl": true, "lockContents": true, "color": "#00000000", "type": "RichText", "hasPlaceHolderText": false, "multiline": false, "isTemporary": false, "dateCalendarType": "Gregorian", "isChecked": false } }] }], "title": null, "description": null, "tableFormat": { "allowAutoFit": true, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "borders": { "left": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "bidi": false, "horizontalPositionAbs": "Left", "horizontalPosition": 0.0 } }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false, "restartPageNumbering": false, "pageStartingNumber": 0 } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Placeholder Text", "basedOn": "Default Paragraph Font", "characterFormat": { "fontColor": "#808080FF" } }], "defaultTabWidth": 35.400001525878906, "formatting": false, "trackChanges": false, "protectionType": "NoProtection", "enforcement": false, "dontUseHTMLParagraphAutoSpacing": false, "alignTablesRowByRow": false }

describe('Content control Validation', () => {
  let editor: DocumentEditor;
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
  afterAll((done): void => {
    editor.destroy();
    document.body.removeChild(document.getElementById('container'));
    editor = undefined;
    document.body.innerHTML = '';
    setTimeout(function () {
      done();
    }, 1000);
  });
  it('Plain text content control & Character format Validation & delete after contents locked', function () {
    console.log('Plain text content control & Character format Validation & delete after contents locked');
    editor.open(JSON.stringify(plainContentControl));
    let para: ParagraphWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget;
    let elementCollec: ElementBox[] = (para.childWidgets[0] as LineWidget).children;
    let eleLength: number = (para.childWidgets[0] as LineWidget).children.length;
    let element: ElementBox = elementCollec[2];
    let text: string = (element as TextElementBox).text;
    let widgetType: ContentControlWidgetType = 'Inline';
    let controlType: ContentControlType = 'Text';
    expect(element.contentControlProperties).toBeDefined;
    expect(element.contentControlProperties.contentControlWidgetType).toBe(widgetType);
    expect(element.contentControlProperties.type).toBe(controlType);
    editor.selection.start.setPositionParagraph(para.childWidgets[0] as LineWidget, 8);
    editor.selection.end.setPositionParagraph(para.childWidgets[0] as LineWidget, 8);
    editor.selection.characterFormat.bold = true;
    expect((para.childWidgets[0] as LineWidget).children.length).toBe(eleLength);
    expect(((para.childWidgets[0] as LineWidget).children[2] as TextElementBox).text).toBe(text);
    expect(((para.childWidgets[0] as LineWidget).children[2] as TextElementBox).characterFormat.bold).toBe(true);
    editor.selection.start.setPositionParagraph(para.childWidgets[0] as LineWidget, 8);
    editor.selection.end.setPositionParagraph(para.childWidgets[0] as LineWidget, 8);
    element.contentControlProperties.lockContents = true;
    editor.selection.characterFormat.bold = false;
    expect(((para.childWidgets[0] as LineWidget).children[2] as TextElementBox).characterFormat.bold).toBe(true);
    element.contentControlProperties.lockContents = false;
    editor.selection.start.setPositionParagraph(para.childWidgets[0] as LineWidget, 3);
    editor.selection.end.setPositionParagraph(para.childWidgets[0] as LineWidget, 9);
    editor.editorModule.handleBackKey();
    expect((para.childWidgets[0] as LineWidget).children.length).toBe(eleLength);
  });
  it('Heaader backspace on half selection of content control', function () {
    console.log('Heaader backspace on half selection of content control');
    editor.open(JSON.stringify(headerContentControl));
    let para: ParagraphWidget = editor.documentHelper.pages[0].headerWidget.childWidgets[0] as ParagraphWidget;
    let elementCollec: ElementBox[] = (para.childWidgets[0] as LineWidget).children;
    let eleLength: number = (para.childWidgets[0] as LineWidget).children.length;
    let element: ElementBox = elementCollec[2];
    let text: string = (element as TextElementBox).text;
    editor.selection.start.setPositionParagraph(para.childWidgets[0] as LineWidget, 3);
    editor.selection.end.setPositionParagraph(para.childWidgets[0] as LineWidget, 9);
    expect(element.contentControlProperties).toBeDefined;
    editor.editorModule.handleBackKey();
    expect((para.childWidgets[0] as LineWidget).children.length).toBe(eleLength);
    expect(((para.childWidgets[0] as LineWidget).children[2] as TextElementBox).text).toBe(text);
  });
  it('Table Content control Validation', function () {
    console.log('Table Content control Validation');
    editor.open(JSON.stringify(tableContentControl));
    let paraCollec: IWidget[] = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets;
    let table: TableWidget = paraCollec[0] as TableWidget;
    expect(table.contentControlProperties).toBeDefined;
    let para: ParagraphWidget = ((table.firstChild as TableRowWidget).firstChild as TableCellWidget).firstChild as ParagraphWidget;
    editor.selection.start.setPositionParagraph(para.childWidgets[0] as LineWidget, 1);
    editor.selection.end.setPositionParagraph(para.childWidgets[0] as LineWidget, 1);
    editor.selection.selectTable();
    editor.editorModule.handleBackKey();
    expect((paraCollec[0] as TableWidget)).toBeDefined;
  });
});
describe('Footnote api validation', () => {
  let container: DocumentEditor;
  let imageResizer: ImageResizer;
  beforeAll(() => {
    document.body.innerHTML = '';
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    DocumentEditor.Inject(Editor, Selection, EditorHistory, ImageResizer);
    container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableImageResizer: true });
    (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
    (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
    (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
    (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
    container.appendTo('#container');
    imageResizer = container.imageResizerModule;
  });
  afterAll((done): void => {
    container.destroy();
    imageResizer.destroy();
    imageResizer = undefined;
    document.body.removeChild(document.getElementById('container'));
    container = undefined;
    document.body.innerHTML = '';
    setTimeout(function () {
      done();
    }, 1000);
  });
  // it('Footnote validation', function () {
  //   console.log('Footnote validation');
  //   container.editor.insertFootnote();
  //   container.editor.insertText('Hello World');
  //   expect(container.editor.documentHelper.footnoteCollection.length).toBe(1);
  // });

});
describe('endnote api validation', () => {
  let container: DocumentEditor;
  let imageResizer: ImageResizer;
  beforeAll(() => {
    document.body.innerHTML = '';
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    DocumentEditor.Inject(Editor, Selection, EditorHistory, ImageResizer);
    container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableImageResizer: true });
    (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
    (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
    (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
    (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
    container.appendTo('#container');
    imageResizer = container.imageResizerModule;
  });
  afterAll((done): void => {
    container.destroy();
    imageResizer.destroy();
    imageResizer = undefined;
    document.body.removeChild(document.getElementById('container'));
    container = undefined;
    document.body.innerHTML = '';
    setTimeout(function () {
      done();
    }, 1000);
  });
  it('endnote validation', function () {
    console.log('endtnote validation');
    container.editor.insertEndnote();
    container.editor.insertText('World');
    expect(container.editor.documentHelper.endnoteCollection.length).toBe(1);
  });

});

describe('Insert comment validation at end of paragraph', () => {
  let container: DocumentEditor;
  beforeAll(() => {
    document.body.innerHTML = '';
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    DocumentEditor.Inject(Editor, Selection, EditorHistory);
    container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true ,enableComment:true });
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
  it('comment insert', function () {
    console.log('comment insert');
    container.editor.insertText('World');
    container.editor.insertComment();
    expect(container.selection.end.currentWidget.children.length).toBe(3);
  });
  // it('undo after comment insert', function () {
  //   console.log('undo after comment insert');
  //   container.editorHistory.undo();
  //   expect(container.selection.end.currentWidget.children.length).toBe(1);
  // });
  it('redo after comment insert', function () {
    console.log('redo after comment insert');
    container.editorHistory.redo();
    expect(container.selection.end.currentWidget.children.length).toBe(3);
  });

});
let multilevelList: any = {
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
        "bidi": false
      },
      "blocks": [
        {
          "paragraphFormat": {
            "textAlignment": "Justify",
            "styleName": "Normal",
            "listFormat": {
              "listId": 0,
              "listLevelNumber": 1
            }
          },
          "characterFormat": {
            "fontSize": 11,
            "fontColor": "empty",
            "fontSizeBidi": 11
          },
          "inlines": [
            {
              "characterFormat": {},
              "bookmarkType": 0,
              "name": "1.1"
            },
            {
              "characterFormat": {
                "fontSize": 11,
                "fontFamily": "Arial",
                "fontColor": "empty",
                "fontSizeBidi": 11,
                "fontFamilyBidi": "Arial"
              },
              "text": "The "
            }
          ]
        }
      ]
    }
  ],
  "lists": [
    {
      "abstractListId": 0,
      "levelOverrides": [],
      "listId": 0
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
            "leftIndent": 28.350000381469727,
            "firstLineIndent": -28.350000381469727,
            "listFormat": {}
          },
          "followCharacter": "Tab",
          "listLevelPattern": "Arabic",
          "numberFormat": "%1",
          "restartLevel": 0,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "leftIndent": 28.350000381469727,
            "firstLineIndent": -28.350000381469727,
            "listFormat": {}
          },
          "followCharacter": "Tab",
          "listLevelPattern": "Arabic",
          "numberFormat": "%1.%2",
          "restartLevel": 1,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "leftIndent": 51.04999923706055,
            "firstLineIndent": -22.700000762939453,
            "listFormat": {}
          },
          "followCharacter": "Tab",
          "listLevelPattern": "LowLetter",
          "numberFormat": "(%3)",
          "restartLevel": 2,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "leftIndent": 73.75,
            "firstLineIndent": -22.700000762939453,
            "listFormat": {}
          },
          "followCharacter": "Tab",
          "listLevelPattern": "LowRoman",
          "numberFormat": "(%4)",
          "restartLevel": 3,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "leftIndent": 96.44999694824219,
            "firstLineIndent": -22.700000762939453,
            "listFormat": {}
          },
          "followCharacter": "Tab",
          "listLevelPattern": "Arabic",
          "numberFormat": "(%5).",
          "restartLevel": 4,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "leftIndent": 119.1500015258789,
            "firstLineIndent": -22.700000762939453,
            "listFormat": {}
          },
          "followCharacter": "Tab",
          "listLevelPattern": "UpLetter",
          "numberFormat": "(%6).",
          "restartLevel": 5,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "leftIndent": 162,
            "firstLineIndent": -54,
            "listFormat": {}
          },
          "followCharacter": "Tab",
          "listLevelPattern": "Arabic",
          "numberFormat": "%1.%2.%3.%4.%5.%6.%7",
          "restartLevel": 6,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "leftIndent": 187.1999969482422,
            "firstLineIndent": -61.20000076293945,
            "listFormat": {}
          },
          "followCharacter": "Tab",
          "listLevelPattern": "Arabic",
          "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8",
          "restartLevel": 7,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "leftIndent": 216,
            "firstLineIndent": -72,
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
};
describe('Multilevel list undo and redo validation', () => {
  let container: DocumentEditor;
  beforeAll(() => {
    document.body.innerHTML = '';
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    DocumentEditor.Inject(Editor, Selection, EditorHistory);
    container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true ,enableComment:true });
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
  it('Inserting a list', function () {
    container.open(JSON.stringify(multilevelList));
    expect(container.documentHelper.lists[0].abstractList.levels[1].numberFormat).toBe('%1.%2');
    expect(container.documentHelper.lists[0].abstractList.levels[1].listLevelPattern).toBe('Arabic');
    container.selection.selectAll();
    container.editor.applyNumbering('%1.', 'UpLetter');
    expect(container.documentHelper.lists[0].abstractList.levels[1].numberFormat).toBe('%1.');
    expect(container.documentHelper.lists[0].abstractList.levels[1].listLevelPattern).toBe('UpLetter');
  });
  it('undo the list validation', function () {
    container.editorHistory.undo();
    expect(container.documentHelper.lists[0].abstractList.levels[1].numberFormat).toBe('%1.%2');
    expect(container.documentHelper.lists[0].abstractList.levels[1].listLevelPattern).toBe('Arabic');
  });
  it('redo the list validation', function () {
    container.editorHistory.redo();
    expect(container.documentHelper.lists[0].abstractList.levels[1].numberFormat).toBe('%1.');
    expect(container.documentHelper.lists[0].abstractList.levels[1].listLevelPattern).toBe('UpLetter');
  });
});
let spell: any = {
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
						"textAlignment": "Center",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"italic": true,
						"fontSize": 10,
						"fontFamily": "Calibri",
						"fontColor": "#FF0000FF",
						"italicBidi": true,
						"fontSizeBidi": 10,
						"fontFamilyBidi": "Calibri"
					},
					"inlines": [
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "_Hlk64379019"
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "_Hlk64379019"
						}
					]
				},
				{
					"paragraphFormat": {
						"textAlignment": "Center",
						"beforeSpacing": 6,
						"afterSpacing": 6,
						"styleName": "Heading 9",
						"listFormat": {}
					},
					"characterFormat": {
						"fontSize": 20,
						"fontFamily": "Calibri",
						"fontSizeBidi": 20,
						"fontFamilyBidi": "Calibri"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Center",
						"beforeSpacing": 6,
						"afterSpacing": 6,
						"styleName": "Heading 9",
						"listFormat": {}
					},
					"characterFormat": {
						"fontSize": 20,
						"fontFamily": "Verdana",
						"fontSizeBidi": 20,
						"fontFamilyBidi": "Verdana"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontSize": 20,
								"fontFamily": "Verdana",
								"fontSizeBidi": 20,
								"fontFamilyBidi": "Verdana"
							},
							"text": "Environmental, Occupational Health & Safety "
						},
						{
							"characterFormat": {
								"fontSize": 20,
								"fontFamily": "Verdana",
								"fontSizeBidi": 20,
								"fontFamilyBidi": "Verdana"
							},
							"text": "and Responsible Recycling (R2:2013) Manual"
						}
					]
				},
				{
					"paragraphFormat": {
						"beforeSpacing": 6,
						"afterSpacing": 6,
						"styleName": "Table Heading",
						"listFormat": {}
					},
					"characterFormat": {
						"italic": true,
						"fontSize": 12,
						"italicBidi": true,
						"fontSizeBidi": 12
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"beforeSpacing": 6,
						"afterSpacing": 6,
						"styleName": "Table Heading",
						"listFormat": {}
					},
					"characterFormat": {
						"italic": true,
						"fontSize": 14,
						"italicBidi": true,
						"fontSizeBidi": 14
					},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 14,
								"boldBidi": true,
								"fontSizeBidi": 14
							},
							"text": "Asset Cellutions-CT Cellutions-Cellphones For Soldiers"
						}
					]
				},
				{
					"paragraphFormat": {
						"beforeSpacing": 6,
						"afterSpacing": 6,
						"styleName": "Table Heading",
						"listFormat": {}
					},
					"characterFormat": {
						"fontSize": 14,
						"fontSizeBidi": 14
					},
					"inlines": [
						{
							"characterFormat": {
								"fontSize": 14,
								"fontSizeBidi": 14
							},
							"text": "5705 Commerce Blvd. Alpharetta GA. 30004"
						},
						{
							"characterFormat": {
								"fontSize": 14,
								"fontSizeBidi": 14
							},
							"text": "\u000B"
						},
						{
							"characterFormat": {
								"fontSize": 14,
								"fontSizeBidi": 14
							},
							"text": "\u000B"
						},
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 14,
								"boldBidi": true,
								"fontSizeBidi": 14
							},
							"text": "Phone:"
						},
						{
							"characterFormat": {
								"fontSize": 14,
								"fontSizeBidi": 14
							},
							"text": " 678.580.0916 "
						},
						{
							"characterFormat": {
								"fontSize": 14,
								"fontSizeBidi": 14
							},
							"text": "\u000B"
						},
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 14,
								"boldBidi": true,
								"fontSizeBidi": 14
							},
							"text": "    Fax:"
						},
						{
							"characterFormat": {
								"fontSize": 14,
								"fontSizeBidi": 14
							},
							"text": " 678.669.2832 "
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontSize": 10,
						"fontSizeBidi": 10
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontSize": 10,
						"fontSizeBidi": 10
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontSize": 10,
						"fontSizeBidi": 10
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontSize": 10,
						"fontSizeBidi": 10
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontSize": 10,
						"fontSizeBidi": 10
					},
					"inlines": [
						{
							"characterFormat": {
								"fontSize": 10,
								"fontSizeBidi": 10
							},
							"text": "The MR of this manual is cautioned that the information contained herein must not be "
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontSizeBidi": 10
							},
							"text": "loaned or circulated outside of "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 10,
								"boldBidi": true,
								"fontSizeBidi": 10
							},
							"text": "AC-CTC-CPFS"
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontSizeBidi": 10
							},
							"text": " except where authorized in accordance with "
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontSizeBidi": 10
							},
							"text": "the Company’s policies and administration procedures. This manual is proprietary to "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 10,
								"boldBidi": true,
								"fontSizeBidi": 10
							},
							"text": "AC-CTC-CPFS"
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontSizeBidi": 10
							},
							"text": " and shall be returned when request."
						}
					]
				},
				{
					"paragraphFormat": {
						"beforeSpacing": 0,
						"afterSpacing": 0,
						"lineSpacing": 1,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 72,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 432,
								"deletePosition": 0,
								"tabJustification": "Right",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontSize": 10,
						"fontSizeBidi": 10
					},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 10,
								"boldBidi": true,
								"fontSizeBidi": 10
							},
							"text": "MANUAL APPROVAL:  "
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontSizeBidi": 10
							},
							"text": "\t"
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontSizeBidi": 10
							},
							"text": "This manual has been approved, released for circulation, used by "
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontSizeBidi": 10
							},
							"text": "the employees and available at the following locations:"
						}
					]
				},
				{
					"paragraphFormat": {
						"beforeSpacing": 0,
						"afterSpacing": 0,
						"lineSpacing": 1,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontSize": 10,
						"fontFamily": "Calibri",
						"fontSizeBidi": 10,
						"fontFamilyBidi": "Calibri"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "\t"
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "\t"
						}
					]
				},
				{
					"paragraphFormat": {
						"leftIndent": 143.5,
						"firstLineIndent": -143.5,
						"textAlignment": "Justify",
						"beforeSpacing": 0,
						"afterSpacing": 0,
						"lineSpacing": 1,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 72,
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
								"position": 288,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 432,
								"deletePosition": 0,
								"tabJustification": "Right",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"bold": true,
						"fontSize": 10,
						"fontFamily": "Calibri",
						"underline": "Single",
						"boldBidi": true,
						"fontSizeBidi": 10,
						"fontFamilyBidi": "Calibri"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"leftIndent": 143.5,
						"firstLineIndent": -143.5,
						"textAlignment": "Justify",
						"beforeSpacing": 0,
						"afterSpacing": 0,
						"lineSpacing": 1,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 72,
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
								"position": 288,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 432,
								"deletePosition": 0,
								"tabJustification": "Right",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"bold": true,
						"fontSize": 10,
						"fontFamily": "Calibri",
						"underline": "Single",
						"boldBidi": true,
						"fontSizeBidi": 10,
						"fontFamilyBidi": "Calibri"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"leftIndent": 143.5,
						"firstLineIndent": -143.5,
						"textAlignment": "Justify",
						"beforeSpacing": 0,
						"afterSpacing": 0,
						"lineSpacing": 1,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 72,
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
								"position": 288,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 432,
								"deletePosition": 0,
								"tabJustification": "Right",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"bold": true,
						"fontSize": 10,
						"fontFamily": "Calibri",
						"underline": "Single",
						"boldBidi": true,
						"fontSizeBidi": 10,
						"fontFamilyBidi": "Calibri"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"leftIndent": 143.5,
						"firstLineIndent": -143.5,
						"textAlignment": "Justify",
						"beforeSpacing": 0,
						"afterSpacing": 0,
						"lineSpacing": 1,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 72,
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
								"position": 288,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 432,
								"deletePosition": 0,
								"tabJustification": "Right",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"bold": true,
						"fontSize": 10,
						"fontFamily": "Calibri",
						"underline": "Single",
						"boldBidi": true,
						"fontSizeBidi": 10,
						"fontFamilyBidi": "Calibri"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"beforeSpacing": 0,
						"afterSpacing": 0,
						"lineSpacing": 1,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 72,
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
								"position": 288,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 432,
								"deletePosition": 0,
								"tabJustification": "Right",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"bold": true,
						"fontSize": 10,
						"fontFamily": "Calibri",
						"underline": "Single",
						"boldBidi": true,
						"fontSizeBidi": 10,
						"fontFamilyBidi": "Calibri"
					},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 10,
								"fontFamily": "Calibri",
								"underline": "Single",
								"boldBidi": true,
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "Location"
						},
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 10,
								"fontFamily": "Calibri",
								"boldBidi": true,
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "\t"
						},
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 10,
								"fontFamily": "Calibri",
								"boldBidi": true,
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "                      "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 10,
								"fontFamily": "Calibri",
								"boldBidi": true,
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "\t"
						},
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 10,
								"fontFamily": "Calibri",
								"boldBidi": true,
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 10,
								"fontFamily": "Calibri",
								"boldBidi": true,
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "      "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 10,
								"fontFamily": "Calibri",
								"underline": "Single",
								"boldBidi": true,
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "Controlled "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 10,
								"fontFamily": "Calibri",
								"underline": "Single",
								"boldBidi": true,
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "Copy "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 10,
								"fontFamily": "Calibri",
								"underline": "Single",
								"boldBidi": true,
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "Number"
						},
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 10,
								"fontFamily": "Calibri",
								"boldBidi": true,
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 10,
								"fontFamily": "Calibri",
								"boldBidi": true,
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "\t"
						},
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 10,
								"fontFamily": "Calibri",
								"boldBidi": true,
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "\t"
						},
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 10,
								"fontFamily": "Calibri",
								"underline": "Single",
								"boldBidi": true,
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "Number "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 10,
								"fontFamily": "Calibri",
								"underline": "Single",
								"boldBidi": true,
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "of "
						},
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 10,
								"fontFamily": "Calibri",
								"underline": "Single",
								"boldBidi": true,
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "Copies"
						}
					]
				},
				{
					"paragraphFormat": {
						"leftIndent": 143.5,
						"firstLineIndent": -143.5,
						"textAlignment": "Justify",
						"beforeSpacing": 0,
						"afterSpacing": 0,
						"lineSpacing": 1,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 72,
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
								"position": 288,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 432,
								"deletePosition": 0,
								"tabJustification": "Right",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"bold": true,
						"fontSize": 10,
						"fontFamily": "Calibri",
						"underline": "Single",
						"boldBidi": true,
						"fontSizeBidi": 10,
						"fontFamilyBidi": "Calibri"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"leftIndent": 143.5,
						"firstLineIndent": -143.5,
						"textAlignment": "Justify",
						"beforeSpacing": 0,
						"afterSpacing": 0,
						"lineSpacing": 1,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 72,
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
								"position": 216,
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
								"position": 396,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 432,
								"deletePosition": 0,
								"tabJustification": "Right",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontSize": 10,
						"fontFamily": "Calibri",
						"fontSizeBidi": 10,
						"fontFamilyBidi": "Calibri"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "President’s "
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "Office"
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "\t"
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": " Stamped "
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "Original "
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "\t"
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "                        "
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "\t"
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "\t"
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": " 1"
						}
					]
				},
				{
					"paragraphFormat": {
						"leftIndent": 143.5,
						"firstLineIndent": -143.5,
						"textAlignment": "Justify",
						"beforeSpacing": 0,
						"afterSpacing": 0,
						"lineSpacing": 1,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 72,
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
								"position": 216,
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
								"position": 396,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 432,
								"deletePosition": 0,
								"tabJustification": "Right",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontSize": 10,
						"fontFamily": "Calibri",
						"fontSizeBidi": 10,
						"fontFamilyBidi": "Calibri"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"textAlignment": "Justify",
						"beforeSpacing": 0,
						"afterSpacing": 0,
						"lineSpacing": 1,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 72,
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
								"position": 216,
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
								"position": 396,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 432,
								"deletePosition": 0,
								"tabJustification": "Right",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontSize": 10,
						"fontFamily": "Calibri",
						"fontSizeBidi": 10,
						"fontFamilyBidi": "Calibri"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "Approved "
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "by: "
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "Moe "
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "S"
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "algaonka"
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "r "
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "CEO"
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
		},
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
						"beforeSpacing": 0,
						"afterSpacing": 8,
						"lineSpacing": 1.0791666507720948,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"bold": true,
						"fontSize": 10,
						"fontFamily": "Calibri",
						"boldBidi": true,
						"fontSizeBidi": 10,
						"fontFamilyBidi": "Calibri"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"beforeSpacing": 0,
						"afterSpacing": 8,
						"lineSpacing": 1.0791666507720948,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"bold": true,
						"fontSize": 10,
						"fontFamily": "Calibri",
						"boldBidi": true,
						"fontSizeBidi": 10,
						"fontFamilyBidi": "Calibri"
					},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"fontSize": 10,
								"fontFamily": "Calibri",
								"boldBidi": true,
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "Change Control History"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 36,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 432,
								"deletePosition": 0,
								"tabJustification": "Right",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontSize": 10,
						"fontFamily": "Calibri",
						"fontSizeBidi": 10,
						"fontFamilyBidi": "Calibri"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "The MR controls this EH&SMS Manual and is the designee for distribution and issue control. All others should be "
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "verified against the Master List of Documents or the Master Folder on the Server.  If the Manual is revised, all "
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "applicable sections and/or paragraphs shall reflect the latest changes. The portions that are changed are described "
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "in the table below.  The EH&SMS Manual may be assigned its own copy number upon issue as controlled.  The "
						},
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "signature of the President indicates approval of this Manual."
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 208.5,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontSize": 10,
						"fontFamily": "Calibri",
						"fontSizeBidi": 10,
						"fontFamilyBidi": "Calibri"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Calibri",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Calibri"
							},
							"text": "\t"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {},
						"tabs": [
							{
								"position": 36,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							},
							{
								"position": 432,
								"deletePosition": 0,
								"tabJustification": "Right",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {
						"fontSize": 10,
						"fontFamily": "Calibri",
						"fontSizeBidi": 10,
						"fontFamilyBidi": "Calibri"
					},
					"inlines": [
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "_Toc311702516"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "TOC 2",
						"listFormat": {}
					},
					"characterFormat": {
						"fontSize": 11,
						"fontSizeBidi": 11
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontSize": 10,
						"fontSizeBidi": 10
					},
					"inlines": [
						{
							"characterFormat": {},
							"fieldType": 1
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "_Toc311702516"
						}
					]
				}
			],
			"headersFooters": {
				"header": {
					"blocks": [
						{
							"paragraphFormat": {
								"afterSpacing": 12,
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {
								"bold": true,
								"fontSize": 12,
								"fontColor": "#7F7F7FFF",
								"boldBidi": true,
								"fontSizeBidi": 12
							},
							"inlines": [
								{
									"characterFormat": {},
									"imageString": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANQAAAAtCAYAAAGhRHVfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAACT2SURBVHhe7Z0JeFbVtfe3ftZaap1aa/2c6tBqr4pe+znU4TpU6m0d6pB6a1tr1ateUFGKzCRvJkIgDAJVwaGKoALaXkEBmRRoAWUURAYZAiqoTAqYkJDkPd/vv959Tt4pIVisRfN/nvXsvdee99prD+fsfY77QhCPuW3eGmGtc4d6awbieW6WtxqCYheQRo53Ng4iLw96usA7DQ1lFvS2hGd6pwtKXBAUJTKT3bNdPN/lBoX45XsemTwv8+02ZObcfsZMxT7eNAR3uq/JrOqWyCxe7I7c0MEFy+8hs0KXs7O7+1T8EGTYXuaObu4TY6wkjVXO/e7vmHIXFhaeXlBQUBiLxQ7CvBj3jzD73XnnnV8rLi6eVFpaugVee6hv+/btv5mfnz+gR48ecy0xoLhFRUVTMX+OeaHn9TbPIAnG+FIgXuDWBTH3He+M8I5zr3lrCgjbIihN7UgCsr/XWzMx4Xf1XTWe61rJXE1aUIfleMutXkTid0Iyz7SM6LFBj9TMyOhuOkJP9ciMgpDJAzU+o03OnStzGmmXO/fKVEy5l9ztgrp8N3JJGwqV73oEQ1yLjzv5XlfgrlCYeA93OH531+a7meK/c28iLt39WpnSnTX0vM5v+EQFelUvessf1evoPf8B/Sfue9QbS0pKFmAfgt8kzDzMAZg3QIVQR/HpoRN69uy5sEOHDt/CPZF43/2S9rp/JhhJ1qhz0XGeo3+sV4cK+qR1HI91iBPRznjXucPUQSuTxCtozKXjRQOGDYuFjj6MnQ6rYTMcZpPzCPp6njo3/pTlJqidePEi94qV6Vfu/8gtwJuc3PHV6W0Y1vCL4/naXPeAPGq6u5y3WkcF2C9ekuj0AhU4d4VzvbzTxnvU+lXvlLKcBD3tnYq/rxWwVxJRqbo8N3MnFVeYOipsgcFOb69jDpBJWjkq6I7c+jDE/wP83+/oXs9TxVG06+C3qeyKMuZ5Pw3nMol0+add3Iuyb8BJoW3ISAaVW4uU8rxT4VDyeqC9a5hPenqn3O/Qqo+Yva/7Bu7x8Z4aJBKgQPPwf8k7DUh2AYW8hgLfbu5idz/x3jdPgF99fCoD/UI8wm8K84qAJNZA6z927hDPiqC5iLnpYDR+P8gGY9lHjRplXWLAgAFfx32A7Mlg7rqAUeM8Rprj5FY4Ro7TZU9K53vQ0Ywf+xB+uOziY/83mQLxTxTJzmh0NpRPuBbKPwwvEOZ4b/2Koba2NqV7fSnw/vvv772VQjkLNFqhuM95lmHu3LlZK8VgEY1ATYWGe5kodcZSXdBK2VtdEI5inxVKgMrUWqXy3TKZ3suNHTs2qhTD+NT1vjLYgw+8PUT6fIL7Gc0b8c7u23JrzjJ+ntsaDEiLm+cqbdhX+Fx3bvJyP33uE5QPgmAVlICF0Tyl+W7N/S7Y2MH91jySKhPan3jiCavUZlhrXGI+E1QpbzVYYQpciXdqKN+Ke6jsoYRSKkUFZA8B76NkXph/uG8hvZvCyTriFbrbgjJrhAuQfj/xDExWs73V9bq8PlEKZBMvw6pVahlpyQwRzm0hkidJoUrL33DShSjUI1W+oEz2W2uSJCHA+2hnEo89kVYWJ1DZYZ5lPCpyBhV42LOMJ1Ndlzk2qCtwH6l/R5Wa/Pv6RLWCkDlo0CCrFMuMOJIaJ/ti5/ankusJgzWB6u6uggRnyE4rH7Iz1y1mOY7qEbGLO03mu+0S6W/rjBTz3X01Xm+2dqawZe6bFDi32jfOUpbqMrVkl0naTwQFhOvhWlLmweIJYbgQ5ffhZmoOlrpE99vWxc03HxBKYsSIEZFOYelCRaygwnvO3emthoyZv8jdjBvVS4BC20qA1rc06Q1nU8BN7HBbyC3AuyDe3f07YepXDUmrFPxOxa+veQCFkw6aybrVs21rpp1TLa1/IRVcPtZXSJg8ebIVgFXAq+xu2zFjv4x9BnQ9ewuTHPbJ7EfGYT4EPQJ/QZ8+fcbIj9n+IOhCVhVV8mMl0Ar6Ke5R8qd7vwH/KXidSf8W0pnUq1evN+VHXhdCx+FXQpgi6NR27dp9Qztv7NrbjMN/InktLCsrewm37FWKa6D575XeMAD8ybMMCxcujCRF4U4gkWOgS0jgUAp0sfhk8GMyOkd2/E6kEOf279/fdnMh4EfLF9I5ROFkJ53LSOcIpSuTuBv69u37De93upZVVPTbfjnUwjfSsfg9TviLML8/ZMiQr/Xu3ftn8LXc+r6rq6vrl9i2pSIejx+uhNetWxdV6kuDmpqaL1+lmoJPPvnkq1nxvQ3Lli1rsqAYVfdjLNIga1uqzwtMlfuygLmQGeAMc5diz3U/Mc8mQnGUhndGiPevfyDwhYBp7zE9p9OqK4P0+KSoflpNxrRp05osKIR0qFaNrE8metbnAsrcwsrsn477RzlbzbOJsAWeX60mI97b3eGt/1xs7+IeqWHBZcvsmLtRPMwcCYjK2aOleAf3LSu4eEWuTrwQI0eOTBHUAucO+YR6roC0BhPJXgNR630kKCIYXzwfLQJ57K/luPZD0YpYnWVQfdgMf62eVf5c93Pzb0RQFj7p2VoyLA22C2YP85WZeCVyXlK73G1hGiorJtr8A4UR4u3dNy1cmF4YTul2c8cojN6G2N5Je6gwjOhBykrG52zt5EZU5bqRlqLHxx1djlbLoaBC0BDD/UPP6BXKwIEDI0Etce7brOQlmFWelYJQo5KfFybDKk5BWcBGi9l0mNYnyrATqkuicJN7K+aeEVSaRiULKqmsbDVTgf9kK2PMnUW4A31ZMkYkwr3hw/2QcAfYBlsCVDkK3P+iFLaUDF9jKOBtxvDQg9rnbnDBnDtSBZUNpaWlkaCoVYvnMNi+fOxZGXgZ/9kWNBOo3D5jbnLBunau2rMy8Pfb7A1H3DuzIpjrWozMcQEdzgQ16WY27fclBLW6rQteTdo2hoj3cz/78y9dUNHVjZd7FeH+dmuaoEpdzqNX015FCKqRsn7S2S0bei3hBrsT4w+5lkq3Lrd+CxiCnVh7pUenSLyp8QiGuGMrY+7x8b91wbPIQVI4BxrBvipFoxBczqLWVrkUQeEYrq0jGhFpVPgEIxm0iMIEekQjkp0aR5WmyxpvexIvGRoSrGeph2k40NDyp/qw7H1rzD981CL7QGhU4nEP7hbW2xuYo2ig2dpD25tb/Cx+Iow95A5BuLcsnDSigG2oNCqhzTb0CVnL2hcaknixS5yWtl9P2quHIJ32XlmuJf1LbbRQeUShdqHZFphd4SNqNPRSW1+bo9JByAMnY/wFYieZMkeNGTMmQ1DpYNcWPRDH3rJz585ZX4/Dt+doyehSWJq1TNnAbvH37BpbemeTEYsVn+WtEdipXuCtGejGbtZbP3dQjrO9NQFa+zH/6sYmf2mOTBHL6YD5J+uqb+bMmZGgSNS27/n5+b9lez8TmsEWvTXuLuLjfha6j3D/g9kF6iQ+7g+9eV1xcbHeyeKl16wF+dB8yJ5YwXsUQd+P+Qu5Cft70r4Z3gGEWQN/KrQc3u2Yj8Mbj7kZ/30px12Kw1D9YllZWb7s+A+RSZhBvXr1mtW3b988wh6L+yH8ijF/A80lvVfgR8L0/GmyU4YzZRJe74T1zngxdAVkr8Dg3Unc08h/Cfa12PfDvAbKJd32hJuP39iuXbseiV3vnlW/G7E/Ci2Tv9KJUF1dXczmNWDnHmytrAw2VlQEW6uqzF1RUbEkHo/bY7t0rFixYpca1Yx/ATQ/mdhLUFtbm+utzfhXBhrVLKi9AevXr28W1N6Ad955p8mCYkV5HnuojAedexrsWc7RQ1Wzd3ensg+6MNzXNAXxbu549jAXxnu5b3mWAd4BpH2Qd35xiBe7s9gETqUwVVA8nu+WsQu/xXtnxfz583dHUFu02fXOzw2Ufb02jWbPc+P9I5zvmmcTEM91fWyT6t/ghwj6sQHVs7cvCkEbd6Dtqv0jpQzS+QT/wDYd06ZN2x1Bbf6nCCrPrVN9zB5z4/QEYrcElefK/DO4aKMuoGnHxbuk8v5pUOb2AFICwaRwL9ujlUTlBtrjDD0WUQ/Lc/19tAjjx4/PEBTr9V+vdq6SXayedlRBppUSlDbUOvEjYjP9d4uQhnihu4revE2NjVmjZ2vey0CPPxv+RutcKleRK/RehoYERbxie1SUmzglnQzizPdPyQ8yQak9wkdU/jFO0B97+omjWONlDYHfDdCnPlw1dfxv7xWBEW2t5ZdE8a7uPPOs1TOlRGUrjAFMOCpkzO0rNwkPs4JLgDFnO/EQzz33XIqgEMp8Pc3QkWG9ytCzPniiO0JBJb3+iI5IhWC4tSfPlr86kAqc6N3F5p9L51E5GM7M33ckKllrCYAGBZXnci2tXPdTC5gE/P5mQyTzUiQopa08wlNQ3m0RAGWdlFFWlaUw6VgKoP1mWHpq6zAcbsLRLAmQ5ypTCPknEWX9idvc0b084zYXzL8rtZekC0qgUNPDwnuW4cknn4wERcNfo0dPEhKBotsnCMfCSFCNDX005nlWceUfc/t7tvh9ZML7jpWLCuvwknkCKrzUGsjfiMH8xwWlcIXuZO9tSBYUaZwbljV+r/u6BQB0+B2+LPZ4jDJfbuEknNQz5/ZgmXCt5bZ6ZbnpYSDw81s6uhEUKOXV+PL7EpFIKBKUYE+KVZmSxCFEYeDAgZGgEMT296xsqfFCSFAaDr0zAxR6rTVq2morBP5jfeV2QMnvoirEjxpxTwkqfTGRLKiYW+PTzVgFWjjSkh3/DbJTvqjjhVAZUQB7ZUOe75lGSfAF7gPoHgskIKjZ8R5ujndGmHgzw/EVRApSG5xMz/EUTcwlJSWRoPTSUA92vTMDyxGUntJ7ZwZqcl1dDdrinRmozXMrq3SWUZ3IDw0p5F+F1Oa6ddU0oux1CKpKPdwLSpcNsgmqDkHpTCVpHChBWbhiZ2fGQmiaCM9a7sx1tQ2VtY7GrvXhakkz+SxmMpSW0vROyeMDCU/HHa2eElrMHa2ubxX04SLMvcMFT1+HX5qgsqG0tDQSFBL/4BkEQRex82bpeMu5KX/Gf6Nzl3hWCjZ1cIuHkW/84dQhJwSN88wT1+BfmrkYSMb77dy6sb9J1Gt7Fzdu+PXEeRpB9XUXK35lt8w3zGsYRV69JREHrbrqccJV57rR5umx7B4XLG6dCLOpo3tLZQ0GulPM00MvFF+6yQWr2iZeB+kq16zbM9tY0Ds/+XtnBPK/aW17t1kyYHr6OKFRpZkatZpC66JbuqD0onEVxDwUaVTy0MdK7rRZlFWLCWZJOwGElv0bcabIzgLioDfxWwKtde5y8ZJBDz7qvT+6wE77FidWO/SqExiG7Ky2Nq1bOlnhtbCxt6J2v61Yo2o9EM66DQ8kGmBndzdO9WFOszJr4bSyrQvqChPXieis+9ayX9QdOsJSrAQ09Ckew5a9EhHwV5iEMH1ZEbqGKjvhRHsej9YHK+618v9SvG1oR0XX7IJKTi8d1O/HOvyLZm12zBfPU8MRNHzKK4xPSPxNFhjpgtI5dN0S0NkIz9Ib3khQAmkN0jyFcAItHLTi0zkJ3HY1dZlzrTVPadFB3vYGNhkMOzFbHfmJWg1rq1K/oMDM8fNnwp8hzsLG3FRLAJBG6hyluccP15iHRQdSCOMXTWaXfwiWxUcmH1wRz/JLGoFIKy+jrJq3CuqvSRkvy6gl2HBNPLPrrbDSCElpqtxsRdQNX4Yy5hV6xoJt3dwC9TbP0rA1PVvY9OW5gOYdhSZNRbM2YU5HOCnXl15z7kD4Y/F/wbNSoBsTLHAm0RCbqPQs7D/yXgad2KGMf0UgG/FfQIVSHkvBX4ym2QEZ0hhBmE3UJeWuLWkOZCJfD63CnrGnCYHfw+RlJ851b41hydINYWUtSCpr+iY5PzNOCPHDu3Dkk7i/ljh1rrQWmJBChOcb6PXRPiodCGnYI4TRQgAhpOyjxo4dmyGodBQWFv67zIKCgiuhrK+4i4qKMuatkwbEv37vgHHR0rcx6E44+fw4luVeXWN4oGhA4qRPEijjpd6aFeSTdQ79PEB9ElcO3nbuOERqwpLJUDUR+9XQxQxPAxFMMBH6X4jJLOPJxGuvvRYJqri4eCKVsKP7cpeVlS3UhUVWhuX46Xi/3rG/DuXAs6sEAvaF+H9EA+mU/MuYtljAbMP4uw9pvEmcq3Dr9bS9PkewJ/bo0UNXBXTCfx7+XfAbCFFU57p06XIEvN8R9y14zxN2Cnkc1bt37zFU3kYK/F8g76VqDF1tkJAffPDB6fn5+XdhPwH/qcQ5i7h6pf8HxSGtseQXnfmA/wo0nXTteoOuORCmn2+LKaRzvjf/L36LsSuta0nzJXjflx9kV8KhfOozEvf1+M/Gfhm8xIcFBA1FeqSjeUULAZHmEJk6L6FlNwLM+qxv1qxZkaBIVA2q8wVHU9kO4skNjSJTjMLh0ETCfUJBOhLuAGh/eKdDb8P/ELO9rj/0798/kD+8PyodL7CFNKjl57+qsIzwOoegcLbvwH5Qv379AvgV2A9p06bNgfgtgXQPZS48nUkINfwZ7GWYD4tPGc8njzHwBsCzMxGYV+N3CaYJAjM8v2HtgXs5NFTlIb5tXvGbCW8OpPv2NKGF+2W3bt2Ow28ptJWydxBPfrTVzdjfoNN8iDC74i4Sv3v37ieT9w9lT8EWtKvcuZeYU6rRpGrsM9Y7d733zopFixZFgiLR71PYYzBtc0eD2cpOPOi40PS882UKFPJs4hwrOwW1YUcaofsnstODL/P3VA5THuJh6pDIqbIT/1zcNkRg7g99N+z15KOLP0eF+SLoaGlPZzmcsJZveK8G8xLxaazbidcHe0tGhm+G8QUa9CfhXRr4xxPuSNIxLaX8ulh0pMKHaVNODckHUqZHsdP/bVtzITwbprEfTPgT/fB9OvzwmrPqUr9Rrqqq+lFFRcViHWTZUVUVbK6oCDZXVgY7dNBl69Zgx44dpT5oBlauXLnLOaoZ/yDi8fhhDClNBuEH+agRmt/w7iVoPjOxl6D5FNJXCJWVleVQs8Cb0Yw9gQ0bNpRDzQrVjGbsCaxevbp8zZo1zQrVjK8WdJokKHXHBjF3Sjzmfhjv4Y5Ifg/yWbFo0aLyxYsX73GFete5w95hRamXYv4VgX0GaG8Fbd0inue22Ms4HbTMd/O8l97rTLGXZz3txdvOeBd3hPfaoyDtB+0Uql7CUY64f2OaDXqvRPj5VtYCtwK3PU/7SoKGuCxe5Cba6RmdPNKbUNn1tlJvHv2bzPCIk95UxgvttE2pGtIn0yToxmLyE/g9hbWJr3Vu1ttlvVHGnvUm/t4Cr1DrTA7IAxlFb8exj7O3wnq7nOe24m7yqeDdAWmX2Vvp8O1z2imtZMS7u5Pxr9ShVfpSXMfrvNdXA7rAQMXf1IjijyAkSMojYUmpdHxAPJn+KEB05CDkh6NXvuvhk24UkyZNKp8yZcpuKdT7zh2z2rmL1zh35XvOXbLeuegNRIhkhdKLaewLlxN+JYT9qg8g3J9JyAwy36NDXUiHuRL6Ke2W8ZK4MdCeh8aL3TkMQr8g7s8wT6X9sn1BPQL+u61Q+iZJvKe7GvdV5HEVaTRpsCP8+fGSRBwUoVVYthSFUl4x90f8r7T0PSH7gy2sjpz0dJdIkeK93MXUM0NG6cho15g7yXt9Juj8ESupi3x6l1KG3fqgrb7jYnIqcD9PrmMK0U60T/1Hfu1zw4Vuoc1EUghRKLQCNww/O0NLpMttNpLioEQ07tuevx/KcxOFXWaNHSqXGj3xjcr7Fa4hvPjii+WjR49uVKEWoRwoz+gtZKclXDkUvn+WiXLZLCR/FGgyvB+sc65FqFDJ76xD0hEdeE36IpMOLNMWQ63+onCmDusqtwYc1bfQvUFD/z8fNQK8PIRTZ+2s2T05vuwamBS/yK2lzTKOhxJu9xVK54JDBWCgy5ZuNhDvb1YfzUJ5bgMKYeeWsScUKix3MimPhJJZ3TFzrEzyIw5xM65OqF1pu6eidk1vl/R2TfpoUTYQ50DijLIyhnIK08pMb1rQKfsylLLeakvo8HxZchrpJFmER5CkffqwrL4/ozPMM253wcYurpLOc5EFSEJKAyUUajn2jD0U4QZbp1E4KScVI8O/ee8MDBs2rHzo0KENKhSzyGjtgXTCRoojRVjl3AKUoSd0N0pTjILM3gj/YwheN8VD6Q4JFUoHEbEvh1ovI47iMUPJvMYyaQTUc4gduFN91LiqT75bSj37QPfgH8M9zQRFONwpp39w3yUBRoJJxP9Q6RK/LdQR92gTtgToZ3kEvl2rBp/MF6lQH2VVKMorN9Qa0m8kElR/eLJRhUI5hlinTW7XggbaVXVWuyidmFtMnIxjZtTt2egQZr2cFpFOLytfzBVCMy09Ka7C0U/xe4P0otWBlqoWX6R8Y24uYboRV9+kb2NpJVORpf1dOyaMxY4G67u8Hz4AtU98rCkbCJsTdYxGFEqAfwoZVUcjRKJB7QhXOgYPHlwOZVUoOvwkKQqKoLPqkbI0BclLvs+6h0JIw6OZWwLKcxnHEBoD4e+zNlMbqM3y3Vu2DNOtRT3YCakQXrE7kvyuo912WBurw+a72lCpSONfR6F8Z0MBGt5DNaJQ2IeltGss9aO/6aDNcqLZItH31pBu/ZWsPAYklUt5JeQU/fwhG/C/NSqb2jLPlNT6MnmdkTJTqp6FbgykJd6eu7tdRaWevd4FD1/pgg9QQjJoUKEEhNfKKqkOINJo4L95mIyysrLy8JheMpiRztRRQi3vdNwdhXjMezUJoULpCLxf3tkdhaaCjnwMDVhlZU90iJe9V5MQOLcPcd62jhkKR6YGmcZI4UJK5GudA3dCobQ0pDNQtlSFoiOZ8NMVSh1X6arjdHOXWYRdgPjTrcMlOm+qQoXpKa+0G0nJII3E9QDVWbL3CkWco7DvSGrXsRZhFyBcO8tb6SndPPcr4+vhR76LmxIk0kv5yUJDIFxBVBe1Z9JNYcp+m812autQFspXbvVpLRmLXBX7s+H4nWCRLIAaTZrfzwW1ua6zeTQAfWZx+q0u0I2hh37hgml/QKGacHNqVygqKiovLCzMUKgq5340nWLqtPtoiA2bXfhsKujQ+7/h3LtDsQ6D5thVx6Yj/qw7YlVb9+mQq1zwwo32ecYGl60NYWMHt2BEDnVgEHr3fmabYvc4wnq4ydTLTPuGmj4TSRrr9HnGUb9ywSb/uUhhW2c3bvRNLlBZV7ZFof7iFarE3TPvrsR1xAW6l1Ps7EB2Y9DNrnXt3Oqh1yVux61v71YFr/mHEoWu2+v/nUhPt7riZQ0fy9XnJxf+TyLsnDutAyYUaqQ7nHbdHrbrlo7Zr9qng7wL9DlNpfeWfjBW5q42/kOu5WLcg37uAv1hoSbLpyuzAWVo/8Yd9XVBgVI+aynQ9odR7tbV+e7V8vtd5ULymXKLC5661gWDKb/qMBWd2JnHYB8plEbQB6HYrhXqbRIc/WsX/PW/XEBj7RGF6tu3b3m/fv0aWvI9NR8Z+5sJ2julXP1LxyhXf4tZYO90t27LKb7+/kZ6S/V+ynvvEox8PfUfQu0xdSWwLs/NiA+ov1GdjvTPwiC063WDbQqC1vXN6u72hRI7i50N8XbOzkdnQzDGtWB5vk7XFhfRUT/tUq9QO7q5cfo1hr6p+tEDKNTDCYUKnnQHbO3s3ptHh1YZdPuPjnmfRcoC3fKjQ654k/QnU2ddkGMQiO4ixYe5gz7u5DarI+papv6Wh3/K921DUPcc3SJU27GViBRKYKlYktKu+Y23K2XuS72sTPrFB/V93Xu5+IOuJUpv5dGNv2zfgs0G0mz/AfFUBpWFiSVDoRoCA9bR2zq5LfpCgfJt6IZio0Bbc1QACVQjxYp7G1copoNWur6jBwIiLduWucwlX2N7KAEl6qa4zFDBQkhLOBQjTvrzoFewz4Zq9GhcSzuWiBNWJl1ZxX6lvnGhhxqKryWk9lUfOLeEeI2utQWU6nYNPJXdE5efbWnBMoElw0La5BWUbFZdzFXackDLqkI3m84TPSLWPgNebTXLBsUnrC0diLeCNCYwkOlTRptspaAlVoH7MNvehHAt6OzrGA0VJqjNq1co0rIb/yzLNUJHSz6BePuSz2sq2/YuKCLCl51yfEK46SoDtNSWYAyydsFbn1VPlCXjB3bBKLc/8WarvEpPncnqne82Q9Pxs0fdmDlKQ2EUFr/UhxJaVjXSrtBMa1fibgvLndhvRX/+E3C31DXcCl1KVz5ZvtmbDeTTPqyDyS7mrxjH3GnIbxzlHUuYdBoPzSO/up20URgX3nPao5ygjqpHzdrwV0Pw7Nc12UBGv1aj6+GFRgTo/YYUap1zp6BE1XoqR6e1e3F0/qwPJZ5++ulGn/KFIJ17UaYtepKnhwxS0vAJntziY9+OAnXST5N8tAjkfxXxVyqcFM+fnsj699VsoNFupqHX20MGzezqgOoEMjXLa11d7KrphCV6f+GjRWCNfhHxE68ntAeQEMP4CNb46pgF7lnSOdJHiyCFogwbLW/tSfLr78bDn2TlUnx9eiPLSQl7p6KfRChf5aU8wzqIpzIp3SK3nL3Wf/poDSLo7A5loBieXHZffnuETH+50cqk9PX0M9e1tYhpsHYtZm+4q3bVz2jT/mwsUIYzrPwKr3xi7nHv1SgI19Ge3iov5RFLLF8p/0Up5Ugn8X2dmYX1wjr6pZp9hEAfwVHHp3NZB6XTVcLPeGzeVMxl0tHHtmf7dKWspNfg/uOFF14of/7553epUOlgpjmAweBgGnm3buqGkNIxS2V0/KaCDr5/uFn/LNCX2enEB5POgZ7VKOwhR8wdZHHS4klZQr6FYR/kvRqFP05mL2L3BFQmyPZbWv5GZd2NPNSuFocBxLMahT5WlJyP3qt6r0Zh78CS4oW/HVf5U/hppDazBBoCo/o36PgLw1vWIo36usiLgj2NPeu3s0Mg6K/RuW9607llM3A+D+lfD08m4muJ1eiL3XHjxpVPmDChSQoVBEFKRwl/LSvk5+cPguyHiiEKCgqeKSoqugtzEWTnzmL+3mZjIOw7hEv+Sonlmx63Z8+eJxB2FvxwiZXRkfXfNW9tMkjvspKSkgrSvhRagruhDwM2qDi6W+qtdq/UW7OCdiObgmh/mqXMlg9t2Y9w9mm33YHu1lKfBbTXwsLCwphnN4j0dk53/4NoNK30PrartqM9yrPKB4U4HuV5U78R0o34ULk0y2hJJYWTqT1MuF/R7KOwenCgv7LrqZyUSu4lrmlHj/TPqWxfzqSglyLAnZhnIwT9GUA//vs17sXQDbjLdfmZMENxD4Ha4p5D5fSl/pdw9ybMKISpL/RP8HE24/cQ4V7E/nHYcaSYuJfjdy/hzsZcTzr/gf0dwuoWv/4iXwudDm8ZftdiX4r9XGgR9hzM9cXFxef4C9Znkm8n4m6BX0xn2o5pX5sRsF+B307CtSWtg4j/Hp3tl4TTXwXeJm5r8pwDnYh7NeF/gjkNfrs+ffroln8P6O/w9afIlYpL2J/B26jOi7mBdL+D319IU59sKKFcAfnd4IugS9+5xJmLeSr8sZj6IkBnwn+AqTJXw2sHTSTuFMIeD38wZgnmaMze1KElcTfg1jdDpuHuDf9u4tjt/xCU6b8Ip68c/AZzBmWLLtdjPw1+nHjnk4a+HjAWu+qyVulirofOIF4Rbv1J4mL8KzHVL/SE+EbodeVLmHMwt0GXw1tBu/xK4bFvxbwAcyN+jxFOn4VQPa/ArFQ87Kux/5k66M8Nku3V2KsJT1OU6OsFI6D2uN9WeOz6K8VZ2PWVBfshZoNgH3IZyjVRM5X2WJqt9E4IfkTa3EuxpFTai6F4G+GVbnO7dzhWP2OeM2dONoVqReHtVxQUXp+n+AP0A/gLqeC3sU9H0K9TIX1fRA3ZmgZUY+qXHFKIloQdCbWFphHmTMw/lZaW6rei6kApT3Xw60i6a+G/RthKzJPhdYU3hTgvYm+jcKR/Iu5NpH80pE4rBfsepr4NMgs/jcK/gXcS5tyysjJ9vuIF3NF5L8JeRLr6Jspq8tLP2bsTdwkkwamj69sfmvn2xb0U93EI93DoPX3dAN5U/G1Pgn0APA0G+pzF+5i3wLMHFpj6lsic3r17P4df9IdfAb+TIQ1K0yjLRuy9oFOheSoz4Z/VlxowB6PEs+D/CeqPW78sOYd4+vXIaMqswaIVfvbtFvLXN09Svn0G/zHKqG+/jCGvD4kbPeyAdwZkCoj5NMrXrVOnTgcTR+36HXiTkfMs4ugzIpPhXYZpH0vFfA26hjzvohz2OxbJjjAnaWCBNwee+s52+PrdyYPwxkH65e1V0I8h+14NaYxVHOJq1fEWpmQ6SW1H3mOJfxTuroS3PRrm24Q5BXMe5i4/LbzPrHnzWr66atVvX1m+vHD89Ol/feWFF5a98vjjOyYMHhyfOGTI9snDh7/56oQJj0758MObXo7Hd3nwsSEsWbKkHNrtPVQzvjjQgU6jUz5ER5fiXefZ/1KgXK1Q4icp41MoQ8bZys8V+scQNByqsU99/AMgjTowEmvKZ8cawtq1a8vffffdZoVqxt4POv+R0HVQKxTgkj1JNTU1rXzaR/vssmLjxo3lmzZtalaoZjRjT6CioqL5Iy3N2Mvh3P8HpzpwLTFIiYsAAAAASUVORK5CYII=",
									"isMetaFile": false,
									"width": 44.8263,
									"height": 9.51496,
									"iscrop": false,
									"name": "Picture 4",
									"visible": true,
									"widthScale": 28.19264,
									"heightScale": 28.1924744,
									"verticalPosition": 0,
									"verticalOrigin": "Margin",
									"verticalAlignment": "None",
									"horizontalPosition": 0,
									"horizontalOrigin": "Margin",
									"horizontalAlignment": "None",
									"allowOverlap": true,
									"textWrappingStyle": "Inline",
									"textWrappingType": "Both",
									"layoutInCell": true,
									"zOrderPosition": 2147483647
								},
								{
									"characterFormat": {
										"fontSize": 16,
										"fontFamily": "Bookman Old Style",
										"fontSizeBidi": 16,
										"fontFamilyBidi": "Bookman Old Style"
									},
									"text": "\t"
								},
								{
									"characterFormat": {
										"fontSize": 16,
										"fontFamily": "Bookman Old Style",
										"fontSizeBidi": 16,
										"fontFamilyBidi": "Bookman Old Style"
									},
									"text": "\t"
								},
								{
									"characterFormat": {
										"fontSize": 16,
										"fontFamily": "Bookman Old Style",
										"fontSizeBidi": 16,
										"fontFamilyBidi": "Bookman Old Style"
									},
									"text": "\t"
								},
								{
									"characterFormat": {
										"fontSize": 16,
										"fontFamily": "Bookman Old Style",
										"fontSizeBidi": 16,
										"fontFamilyBidi": "Bookman Old Style"
									},
									"text": "\t"
								},
								{
									"characterFormat": {
										"fontSize": 16,
										"fontFamily": "Bookman Old Style",
										"fontSizeBidi": 16,
										"fontFamilyBidi": "Bookman Old Style"
									},
									"text": "\t"
								},
								{
									"characterFormat": {
										"fontSize": 16,
										"fontFamily": "Bookman Old Style",
										"fontSizeBidi": 16,
										"fontFamilyBidi": "Bookman Old Style"
									},
									"text": "\t"
								},
								{
									"characterFormat": {
										"fontSize": 16,
										"fontFamily": "Bookman Old Style",
										"fontSizeBidi": 16,
										"fontFamilyBidi": "Bookman Old Style"
									},
									"text": "\t"
								},
								{
									"characterFormat": {
										"fontSize": 16,
										"fontFamily": "Bookman Old Style",
										"fontSizeBidi": 16,
										"fontFamilyBidi": "Bookman Old Style"
									},
									"text": "\t"
								},
								{
									"characterFormat": {
										"bold": true,
										"fontSize": 12,
										"fontColor": "#7F7F7FFF",
										"boldBidi": true,
										"fontSizeBidi": 12
									},
									"text": "EH&SMS"
								},
								{
									"characterFormat": {
										"bold": true,
										"fontSize": 12,
										"fontColor": "#7F7F7FFF",
										"boldBidi": true,
										"fontSizeBidi": 12
									},
									"text": " Manual"
								}
							]
						},
						{
							"paragraphFormat": {
								"styleName": "Normal",
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
								"beforeSpacing": 18,
								"styleName": "Footer",
								"listFormat": {}
							},
							"characterFormat": {
								"fontSize": 8,
								"fontSizeBidi": 8
							},
							"inlines": [
								{
									"characterFormat": {
										"fontSize": 8,
										"fontSizeBidi": 8
									},
									"text": "Revision 3.0                                   "
								},
								{
									"characterFormat": {
										"bold": true,
										"fontSize": 10,
										"boldBidi": true,
										"fontSizeBidi": 10
									},
									"text": "This document is UNCONTROLLED if COPIED OR DUPLICATED"
								},
								{
									"characterFormat": {
										"fontSize": 8,
										"fontSizeBidi": 8
									},
									"text": "\t"
								},
								{
									"characterFormat": {
										"fontSize": 8,
										"fontSizeBidi": 8
									},
									"text": "Page "
								},
								{
									"characterFormat": {
										"fontSize": 8,
										"styleName": "Page Number",
										"fontSizeBidi": 8
									},
									"fieldType": 0,
									"hasFieldEnd": true
								},
								{
									"characterFormat": {
										"fontSize": 8,
										"styleName": "Page Number",
										"fontSizeBidi": 8
									},
									"text": " PAGE "
								},
								{
									"characterFormat": {},
									"fieldType": 2
								},
								{
									"characterFormat": {
										"fontSize": 8,
										"styleName": "Page Number",
										"fontSizeBidi": 8
									},
									"text": "4"
								},
								{
									"characterFormat": {},
									"fieldType": 1
								},
								{
									"characterFormat": {
										"fontSize": 8,
										"styleName": "Page Number",
										"fontSizeBidi": 8
									},
									"text": " of "
								},
								{
									"characterFormat": {
										"fontSize": 8,
										"styleName": "Page Number",
										"fontSizeBidi": 8
									},
									"fieldType": 0,
									"hasFieldEnd": true
								},
								{
									"characterFormat": {
										"fontSize": 8,
										"styleName": "Page Number",
										"fontSizeBidi": 8
									},
									"text": " NUMPAGES "
								},
								{
									"characterFormat": {},
									"fieldType": 2
								},
								{
									"characterFormat": {
										"fontSize": 8,
										"styleName": "Page Number",
										"fontSizeBidi": 8
									},
									"text": "4"
								},
								{
									"characterFormat": {},
									"fieldType": 1
								}
							]
						},
						{
							"paragraphFormat": {
								"styleName": "Footer",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": [
								{
									"characterFormat": {
										"fontSize": 8,
										"fontSizeBidi": 8
									},
									"text": "Date "
								},
								{
									"characterFormat": {
										"fontSize": 8,
										"fontSizeBidi": 8
									},
									"text": "12/20/2020"
								},
								{
									"characterFormat": {
										"fontSize": 8,
										"fontSizeBidi": 8
									},
									"text": "                          "
								},
								{
									"characterFormat": {},
									"text": "\t"
								}
							]
						},
						{
							"paragraphFormat": {
								"styleName": "Normal",
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
		"fontColor": "#00000000",
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
	"compatibilityMode": "Word2013",
	"styles": [
		{
			"name": "Normal",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 6,
				"afterSpacing": 6,
				"lineSpacing": 1.3000000715255738,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Verdana",
				"fontFamilyBidi": "Verdana"
			},
			"next": "Normal"
		},
		{
			"name": "Heading 1",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 36,
				"firstLineIndent": 36,
				"textAlignment": "Center",
				"beforeSpacing": 24,
				"outlineLevel": "Level1",
				"listFormat": {},
				"keepLinesTogether": true,
				"keepWithNext": true
			},
			"characterFormat": {
				"bold": true,
				"fontColor": "#385623FF",
				"boldBidi": true
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
				"fontFamily": "Verdana",
				"fontColor": "#385623FF",
				"boldBidi": true,
				"fontFamilyBidi": "Verdana"
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
				"beforeSpacing": 15,
				"outlineLevel": "Level2",
				"listFormat": {},
				"keepLinesTogether": true,
				"keepWithNext": true
			},
			"characterFormat": {
				"bold": true,
				"italic": true,
				"fontSize": 10,
				"fontColor": "#538135FF",
				"boldBidi": true,
				"italicBidi": true,
				"fontSizeBidi": 10
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
				"italic": true,
				"fontSize": 10,
				"fontFamily": "Verdana",
				"fontColor": "#538135FF",
				"boldBidi": true,
				"italicBidi": true,
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Verdana"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 3",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 5.75,
				"beforeSpacing": 12,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level3",
				"listFormat": {}
			},
			"characterFormat": {
				"bold": true,
				"italic": true,
				"fontFamily": "Arial",
				"fontColor": "#538135FF",
				"boldBidi": true,
				"italicBidi": true,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Normal",
			"link": "Heading 3 Char",
			"next": "Heading 3"
		},
		{
			"name": "Heading 3 Char",
			"type": "Character",
			"characterFormat": {
				"bold": true,
				"italic": true,
				"fontFamily": "Arial",
				"fontColor": "#538135FF",
				"boldBidi": true,
				"italicBidi": true,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 4",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 10,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level4",
				"listFormat": {},
				"keepLinesTogether": true,
				"keepWithNext": true
			},
			"characterFormat": {
				"bold": true,
				"fontFamily": "Calibri Light",
				"fontColor": "#4472C4FF",
				"boldBidi": true,
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
				"bold": true,
				"italic": true,
				"fontFamily": "Calibri Light",
				"fontColor": "#4472C4FF",
				"boldBidi": true,
				"italicBidi": true,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 9",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 10,
				"afterSpacing": 0,
				"outlineLevel": "Level9",
				"listFormat": {},
				"keepLinesTogether": true,
				"keepWithNext": true
			},
			"characterFormat": {
				"italic": true,
				"fontSize": 10,
				"fontFamily": "Calibri Light",
				"fontColor": "#404040FF",
				"italicBidi": true,
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Normal",
			"link": "Heading 9 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 9 Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Calibri Light",
				"fontColor": "#404040FF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Table Heading",
			"type": "Paragraph",
			"paragraphFormat": {
				"textAlignment": "Center",
				"beforeSpacing": 2,
				"afterSpacing": 2,
				"listFormat": {}
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"next": "Table Heading"
		},
		{
			"name": "QM Tier II Char",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 36,
				"beforeSpacing": 2,
				"afterSpacing": 4,
				"listFormat": {}
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"next": "QM Tier II Char"
		},
		{
			"name": "Hyperlink",
			"type": "Character",
			"characterFormat": {
				"underline": "Single",
				"fontColor": "#0000FFFF"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "TOC Heading",
			"type": "Paragraph",
			"paragraphFormat": {
				"outlineLevel": "BodyText",
				"listFormat": {}
			},
			"characterFormat": {},
			"basedOn": "Heading 1",
			"next": "Normal"
		},
		{
			"name": "TOC 2",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 11,
				"afterSpacing": 5,
				"listFormat": {},
				"tabs": [
					{
						"position": 467.5,
						"deletePosition": 0,
						"tabJustification": "Right",
						"tabLeader": "Dot"
					}
				]
			},
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Calibri",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Normal",
			"next": "Normal"
		},
		{
			"name": "TOC 1",
			"type": "Paragraph",
			"paragraphFormat": {
				"afterSpacing": 5,
				"listFormat": {}
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"next": "Normal"
		},
		{
			"name": "TOC 3",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 22,
				"afterSpacing": 5,
				"listFormat": {}
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"next": "Normal"
		},
		{
			"name": "List Paragraph",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 36,
				"listFormat": {},
				"contextualSpacing": true
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"next": "List Paragraph"
		},
		{
			"name": "Body Text",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 5.849999904632568,
				"beforeSpacing": 8.399999618530274,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontFamily": "Cambria",
				"italicBidi": true,
				"fontFamilyBidi": "Cambria"
			},
			"basedOn": "Normal",
			"link": "Body Text Char",
			"next": "Body Text"
		},
		{
			"name": "Body Text Char",
			"type": "Character",
			"characterFormat": {
				"fontFamily": "Cambria",
				"fontFamilyBidi": "Cambria"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Table Paragraph",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontFamily": "Calibri",
				"italicBidi": true,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Normal",
			"next": "Table Paragraph"
		},
		{
			"name": "Header",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {},
				"tabs": [
					{
						"position": 240.9499969482422,
						"deletePosition": 0,
						"tabJustification": "Center",
						"tabLeader": "None"
					},
					{
						"position": 481.95001220703127,
						"deletePosition": 0,
						"tabJustification": "Right",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {
				"italic": true,
				"fontFamily": "Calibri",
				"italicBidi": true,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Normal",
			"link": "Header Char",
			"next": "Header"
		},
		{
			"name": "Header Char",
			"type": "Character",
			"characterFormat": {},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Footer",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {},
				"tabs": [
					{
						"position": 240.9499969482422,
						"deletePosition": 0,
						"tabJustification": "Center",
						"tabLeader": "None"
					},
					{
						"position": 481.95001220703127,
						"deletePosition": 0,
						"tabJustification": "Right",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {
				"italic": true,
				"fontFamily": "Calibri",
				"italicBidi": true,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Normal",
			"link": "Footer Char",
			"next": "Footer"
		},
		{
			"name": "Footer Char",
			"type": "Character",
			"characterFormat": {},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Заголовок 21",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 28.450000762939454,
				"firstLineIndent": -23.399999618530275,
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level3",
				"listFormat": {}
			},
			"characterFormat": {
				"bold": true,
				"italic": true,
				"fontSize": 14,
				"fontFamily": "Arial",
				"boldBidi": true,
				"italicBidi": true,
				"fontSizeBidi": 14,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Normal",
			"next": "Заголовок 21"
		},
		{
			"name": "Заголовок 11",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 18.399999618530275,
				"firstLineIndent": -13.350000381469727,
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level2",
				"listFormat": {}
			},
			"characterFormat": {
				"bold": true,
				"italic": true,
				"fontSize": 16,
				"fontFamily": "Arial",
				"boldBidi": true,
				"italicBidi": true,
				"fontSizeBidi": 16,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Normal",
			"next": "Заголовок 11"
		},
		{
			"name": "Заголовок 31",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 32.599998474121097,
				"firstLineIndent": -27.549999237060548,
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level4",
				"listFormat": {}
			},
			"characterFormat": {
				"bold": true,
				"italic": true,
				"fontSize": 12,
				"fontFamily": "Arial",
				"boldBidi": true,
				"italicBidi": true,
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Normal",
			"next": "Заголовок 31"
		},
		{
			"name": "Заголовок 41",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 32.599998474121097,
				"firstLineIndent": -27.549999237060548,
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level5",
				"listFormat": {}
			},
			"characterFormat": {
				"bold": true,
				"italic": true,
				"fontFamily": "Arial",
				"boldBidi": true,
				"italicBidi": true,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Normal",
			"next": "Заголовок 41"
		},
		{
			"name": "Оглавление 41",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 61,
				"firstLineIndent": -27.549999237060548,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontFamily": "Arial",
				"italicBidi": true,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Normal",
			"next": "Оглавление 41"
		},
		{
			"name": "Balloon Text",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontSize": 8,
				"fontFamily": "Tahoma",
				"italicBidi": true,
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
				"fontSizeBidi": 8,
				"fontFamilyBidi": "Tahoma"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "apple-converted-space",
			"type": "Character",
			"characterFormat": {},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Normal (Web)",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 1.399999976158142,
				"afterSpacing": 1.399999976158142,
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontSize": 12,
				"fontFamily": "Times New Roman",
				"fontColor": "#00000AFF",
				"italicBidi": true,
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Normal",
			"next": "Normal (Web)"
		},
		{
			"name": "WW-Базовый",
			"type": "Paragraph",
			"paragraphFormat": {
				"afterSpacing": 10,
				"lineSpacing": 1.149999976158142,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 12,
				"fontFamily": "Times New Roman",
				"fontColor": "#00000AFF",
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Times New Roman"
			},
			"next": "WW-Базовый"
		},
		{
			"name": "Базовый",
			"type": "Paragraph",
			"paragraphFormat": {
				"afterSpacing": 10,
				"lineSpacing": 1.149999976158142,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Calibri",
				"fontColor": "#00000AFF",
				"fontFamilyBidi": "Calibri"
			},
			"next": "Базовый"
		},
		{
			"name": "Цитата 21",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontSize": 11,
				"fontFamily": "Calibri",
				"fontColor": "#000000FF",
				"italicBidi": true,
				"fontSizeBidi": 11,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "WW-Базовый",
			"next": "Цитата 21"
		},
		{
			"name": "Section Title",
			"type": "Paragraph",
			"paragraphFormat": {
				"textAlignment": "Center",
				"listFormat": {},
				"keepLinesTogether": true,
				"keepWithNext": true
			},
			"characterFormat": {
				"bold": true,
				"italic": true,
				"fontSize": 14,
				"fontFamily": "Cambria",
				"fontColor": "#365F91FF",
				"boldBidi": true,
				"italicBidi": true,
				"fontSizeBidi": 14,
				"fontFamilyBidi": "Cambria"
			},
			"basedOn": "Normal",
			"next": "Section Title"
		},
		{
			"name": "???????",
			"type": "Paragraph",
			"paragraphFormat": {
				"afterSpacing": 0,
				"lineSpacing": 5,
				"lineSpacingType": "AtLeast",
				"listFormat": {},
				"tabs": [
					{
						"position": 0,
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
						"position": 144,
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
						"position": 288,
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
						"position": 432,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 504,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 576,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 648,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 720,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					},
					{
						"position": 792,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {
				"fontSize": 24,
				"fontFamily": "Arial",
				"fontColor": "#000000FF",
				"fontSizeBidi": 24,
				"fontFamilyBidi": "Arial"
			},
			"next": "???????"
		},
		{
			"name": "Содержимое таблицы",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontSize": 14,
				"fontFamily": "Times New Roman",
				"italicBidi": true,
				"fontSizeBidi": 14,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Normal",
			"next": "Содержимое таблицы"
		},
		{
			"name": "Plain Text",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontSize": 10,
				"fontFamily": "Courier New",
				"italicBidi": true,
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Courier New"
			},
			"basedOn": "Normal",
			"link": "Plain Text Char",
			"next": "Plain Text"
		},
		{
			"name": "Plain Text Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Courier New",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Courier New"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Body Text Indent 2",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 14.149999618530274,
				"beforeSpacing": 0,
				"lineSpacing": 2,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontFamily": "Calibri",
				"italicBidi": true,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Normal",
			"link": "Body Text Indent 2 Char",
			"next": "Body Text Indent 2"
		},
		{
			"name": "Body Text Indent 2 Char",
			"type": "Character",
			"characterFormat": {
				"fontFamily": "Calibri",
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "apple-style-span",
			"type": "Character",
			"characterFormat": {},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Заголовок2",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 13,
				"fontFamily": "Calibri",
				"fontSizeBidi": 13,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Heading 2",
			"link": "Заголовок2 Знак",
			"next": "Заголовок2"
		},
		{
			"name": "Заголовок2 Знак",
			"type": "Character",
			"characterFormat": {
				"bold": true,
				"italic": true,
				"fontSize": 13,
				"fontFamily": "Calibri",
				"fontColor": "#4472C4FF",
				"boldBidi": true,
				"italicBidi": true,
				"fontSizeBidi": 13,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Heading 2 Char"
		},
		{
			"name": "Body Text Indent 3",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 14.149999618530274,
				"beforeSpacing": 0,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontSize": 8,
				"fontFamily": "Calibri",
				"italicBidi": true,
				"fontSizeBidi": 8,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Normal",
			"link": "Body Text Indent 3 Char",
			"next": "Body Text Indent 3"
		},
		{
			"name": "Body Text Indent 3 Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 8,
				"fontFamily": "Calibri",
				"fontSizeBidi": 8,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Основной текст с отступом 21",
			"type": "Paragraph",
			"paragraphFormat": {
				"firstLineIndent": 35.45000076293945,
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontSize": 12,
				"fontFamily": "Arial",
				"italicBidi": true,
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Normal",
			"next": "Основной текст с отступом 21"
		},
		{
			"name": "No Spacing1",
			"type": "Paragraph",
			"paragraphFormat": {
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {},
			"next": "No Spacing"
		},
		{
			"name": "No Spacing",
			"type": "Paragraph",
			"paragraphFormat": {
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontFamily": "Calibri",
				"italicBidi": true,
				"fontFamilyBidi": "Calibri"
			},
			"next": "No Spacing"
		},
		{
			"name": "TOC 41",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 33,
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontSize": 9,
				"fontFamily": "Calibri",
				"italicBidi": true,
				"fontSizeBidi": 9,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Normal",
			"next": "Normal"
		},
		{
			"name": "TOC 51",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 44,
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontSize": 9,
				"fontFamily": "Calibri",
				"italicBidi": true,
				"fontSizeBidi": 9,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Normal",
			"next": "Normal"
		},
		{
			"name": "TOC 61",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 55,
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontSize": 9,
				"fontFamily": "Calibri",
				"italicBidi": true,
				"fontSizeBidi": 9,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Normal",
			"next": "Normal"
		},
		{
			"name": "TOC 71",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 66,
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontSize": 9,
				"fontFamily": "Calibri",
				"italicBidi": true,
				"fontSizeBidi": 9,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Normal",
			"next": "Normal"
		},
		{
			"name": "TOC 81",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 77,
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontSize": 9,
				"fontFamily": "Calibri",
				"italicBidi": true,
				"fontSizeBidi": 9,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Normal",
			"next": "Normal"
		},
		{
			"name": "TOC 91",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 88,
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontSize": 9,
				"fontFamily": "Calibri",
				"italicBidi": true,
				"fontSizeBidi": 9,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Normal",
			"next": "Normal"
		},
		{
			"name": "Body Text 2",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 0,
				"lineSpacing": 2,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontFamily": "Calibri",
				"italicBidi": true,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Normal",
			"link": "Body Text 2 Char",
			"next": "Body Text 2"
		},
		{
			"name": "Body Text 2 Char",
			"type": "Character",
			"characterFormat": {
				"fontFamily": "Calibri",
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Default",
			"type": "Paragraph",
			"paragraphFormat": {
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 12,
				"fontFamily": "Wingdings",
				"fontColor": "#000000FF",
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Wingdings"
			},
			"next": "Default"
		},
		{
			"name": "Strong",
			"type": "Character",
			"characterFormat": {
				"bold": true,
				"boldBidi": true
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
			"name": "Page Number",
			"type": "Character",
			"characterFormat": {},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Unresolved Mention1",
			"type": "Character",
			"characterFormat": {
				"fontColor": "#808080FF"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "List 2",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 36,
				"firstLineIndent": -18,
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Arial",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Normal",
			"next": "List 2"
		},
		{
			"name": "Body Text 25",
			"type": "Paragraph",
			"paragraphFormat": {
				"textAlignment": "Justify",
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {},
				"tabs": [
					{
						"position": -112.5,
						"deletePosition": 0,
						"tabJustification": "Left",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {
				"fontFamily": "Tahoma",
				"fontFamilyBidi": "Tahoma"
			},
			"basedOn": "Normal",
			"next": "Body Text 25"
		},
		{
			"name": "List 3",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 54,
				"firstLineIndent": -18,
				"listFormat": {},
				"contextualSpacing": true
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"next": "List 3"
		},
		{
			"name": "List",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 18,
				"firstLineIndent": -18,
				"listFormat": {},
				"contextualSpacing": true
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"next": "List"
		},
		{
			"name": "List 4",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 72,
				"firstLineIndent": -18,
				"listFormat": {},
				"contextualSpacing": true
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"next": "List 4"
		},
		{
			"name": "Body Text Indent",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 18,
				"listFormat": {}
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"link": "Body Text Indent Char",
			"next": "Body Text Indent"
		},
		{
			"name": "Body Text Indent Char",
			"type": "Character",
			"characterFormat": {
				"fontFamily": "Verdana",
				"fontFamilyBidi": "Verdana"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "List 5",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 90,
				"firstLineIndent": -18,
				"listFormat": {},
				"contextualSpacing": true
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"next": "List 5"
		},
		{
			"name": "annotation text",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Arial",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Arial"
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
				"fontFamily": "Arial",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Body Text 26",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 72,
				"firstLineIndent": -72,
				"textAlignment": "Justify",
				"beforeSpacing": 0,
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {},
				"tabs": [
					{
						"position": -121.5,
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
						"position": 90,
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
						"position": 468,
						"deletePosition": 0,
						"tabJustification": "Right",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {
				"fontFamily": "Tahoma",
				"fontFamilyBidi": "Tahoma"
			},
			"basedOn": "Normal",
			"next": "Body Text 26"
		},
		{
			"name": "List Continue 5",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 90,
				"listFormat": {},
				"contextualSpacing": true
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"next": "List Continue 5"
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
					"beforeSpacing": 0,
					"afterSpacing": 0,
					"lineSpacing": 1,
					"lineSpacingType": "Multiple",
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
					"beforeSpacing": 0,
					"afterSpacing": 0,
					"lineSpacing": 1,
					"lineSpacingType": "Multiple",
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
					"beforeSpacing": 0,
					"afterSpacing": 0,
					"lineSpacing": 1,
					"lineSpacingType": "Multiple",
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
					"beforeSpacing": 0,
					"afterSpacing": 0,
					"lineSpacing": 1,
					"lineSpacingType": "Multiple",
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
describe('spell check page trigger', () => {
  let editor: DocumentEditor = undefined;
  beforeAll(() => {
      document.body.innerHTML = '';
      let ele: HTMLElement = createElement('div', { id: 'container' });
      document.body.appendChild(ele);
      DocumentEditor.Inject(Selection, Editor);
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
  it('Spell Check Page trigger validation', () => {
      editor.open(JSON.stringify(spell));
      editor.scrollToPage(2);
      expect(editor.editor.triggerPageSpellCheck).toBe(true);
     
  });
  it('Spell Check trigger Validation', () => {
      editor.open(JSON.stringify(spell));
      editor.scrollToPage(1);
      editor.editor.insertText('aa');
      expect(editor.editor.triggerPageSpellCheck).toBe(false);
     
  });
});
describe('Section break validation', () => {
  let editor: DocumentEditor = undefined;
  let dialog: PageSetupDialog;
  beforeAll(() => {
      document.body.innerHTML = '';
      let ele: HTMLElement = createElement('div', { id: 'container' });
      document.body.appendChild(ele);
      DocumentEditor.Inject(Selection, Editor);
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
  it('section break validation', () => {
      editor.openBlank();
      editor.editor.insertSectionBreak();
      editor.editor.insertSectionBreak();
      editor.selection.movePreviousPosition();
      editor.editor.insertSectionBreak();
      expect(editor.documentHelper.headersFooters.length).toBe(4);
     
  });
});
let field: any = {
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
						"bold": true,
						"boldBidi": true
					},
					"inlines": [
						{
							"characterFormat": {
								"bold": true,
								"bidi": false,
								"boldBidi": true
							},
							"text": "sdfsdf"
						},
						{
							"characterFormat": {
								"bold": true,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"baselineAlignment": "Normal",
								"highlightColor": "NoColor",
								"fontColor": "#00000000",
								"bidi": false,
								"bdo": "None",
								"boldBidi": true,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false
							},
							"fieldType": 0,
							"hasFieldEnd": true
						},
						{
							"characterFormat": {
								"bold": true,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"baselineAlignment": "Normal",
								"highlightColor": "NoColor",
								"fontColor": "#00000000",
								"bidi": false,
								"bdo": "None",
								"boldBidi": true,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false
							},
							"text": "MERGEFIELD  MyField  \\* MERGEFORMAT"
						},
						{
							"characterFormat": {
								"bold": true,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"baselineAlignment": "Normal",
								"highlightColor": "NoColor",
								"fontColor": "#00000000",
								"bidi": false,
								"bdo": "None",
								"boldBidi": true,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false
							},
							"fieldType": 2
						},
						{
							"characterFormat": {
								"bold": true,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"baselineAlignment": "Normal",
								"highlightColor": "NoColor",
								"fontColor": "#00000000",
								"bidi": false,
								"bdo": "None",
								"boldBidi": true,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false
							},
							"text": "«MyField»"
						},
						{
							"characterFormat": {
								"bold": true,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"baselineAlignment": "Normal",
								"highlightColor": "NoColor",
								"fontColor": "#00000000",
								"bidi": false,
								"bdo": "None",
								"boldBidi": true,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false
							},
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
		"fontColor": "#00000000",
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
	"customXml": []
}
describe('Mail Merge field validation', () => {
  let editor: DocumentEditor = undefined;
  let dialog: PageSetupDialog;
  beforeAll(() => {
      document.body.innerHTML = '';
      let ele: HTMLElement = createElement('div', { id: 'container' });
      document.body.appendChild(ele);
      DocumentEditor.Inject(Selection, Editor);
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
  it('Field validation', () => {
    editor.open(JSON.stringify(field));
    let para: ElementBox = (((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2]);
      expect(para.characterFormat.bold).toBe(true);
     
  });
});

