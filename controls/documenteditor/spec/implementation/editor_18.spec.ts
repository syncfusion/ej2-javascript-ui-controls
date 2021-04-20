import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget, TableWidget, FieldElementBox, TextFormField, ElementBox, WParagraphFormat, WCharacterFormat, HelperMethods, ContentControlWidgetType, ContentControlType, IWidget, TableRowWidget, DocumentHelper } from '../../src/document-editor/index';
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
let sfdt: string = '{"sections":[{"blocks":[{"characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#00000000","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"BodyText","textAlignment":"Left","styleName":"Normal","bidi":false,"contextualSpacing":false},"inlines":[{"name":"sample","bookmarkType":0},{"text":"Sample","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#00000000","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"}},{"name":"sample","bookmarkType":1}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36,"footerDistance":36,"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#00000000","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left"}},{"type":"Character","name":"Default Paragraph Font"}],"defaultTabWidth":35.400001525878906,"formatting":false,"protectionType":"NoProtection","enforcement":false,"dontUseHTMLParagraphAutoSpacing":false}';
describe('Paste sfdt with bookmark', () => {
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
  it('Rejected page break revision Validation', function () {
    console.log('Rejected page break revision Validation');
    container.editor.insertText('Hello World');
    container.selection.handleControlLeftKey();
    container.enableTrackChanges = true;
    container.showRevisions = true;
    container.editor.insertPageBreak();
    expect(container.documentHelper.pages.length).toBe(2);
    expect(container.selection.start.currentWidget.children.length).toBe(1);
    expect(container.revisions.length).toBe(1);
    container.revisions.rejectAll();
    expect(container.trackChangesPane.isTrackingPageBreak).toBe(true);
    expect(container.selection.start.currentWidget.children.length).toBe(2);
    expect(container.revisions.length).toBe(0);
    container.editorHistory.undo();
    expect(container.revisions.length).toBe(1);
    container.editorHistory.redo();
    expect(container.revisions.length).toBe(0);
  });
  it('image resizer validation', function () {
    console.log('image resizer validation');
    container.openBlank();
    let imageString: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADQSURBVFhH7ZbRDYQgDIYZ5UZhFEdxlBuFUUhY4N7vwWtTURJz5tem8GAbTYS0/eGjWsN7hJVSAuku3c2FuyF31BvqBNu90/mLmnSRjKDbMZULt2csz/kV8hRbVjSkSZkxRC0yKcbl+6FLhttSDIV5W6vYnKeZVWkR1WyFGbhIHrAbCzPhEcL1XCvqptYMd7xXExUXM4+pT3ENe53OP5yGqJ8kDDZGpIld6E730uFR/uuDs1J6OmolQDzcUeOslJ6OWgkQD3fUOCulJ6Ome4j9AGEu0k90WN54AAAAAElFTkSuQmCC';
    container.editor.insertImage(imageString, 100, 100);
    container.editor.insertBookmark('check');
    let event: any = { offsetX: 173, offsetY: 116, preventDefault: function () { }, ctrlKey: false, which: 1 };
    container.documentHelper.onMouseDownInternal(event);
    let event2: any = { offsetX: 173, offsetY: 116, preventDefault: function () { }, ctrlKey: false, which: 0 };
    container.documentHelper.onMouseMoveInternal(event2);
    container.documentHelper.onMouseDownInternal(event);
    container.documentHelper.onMouseMoveInternal(event2);
    container.documentHelper.onMouseUpInternal(event2);
    imageResizer.isImageResizing = true;
    let event3: any = { offsetX: 153, offsetY: 106, preventDefault: function () { }, ctrlKey: false, which: 0 };
    container.documentHelper.onMouseMoveInternal(event3);
    container.documentHelper.onMouseUpInternal(event3);
    container.documentHelper.onMouseMoveInternal(event);
    let eventArgs: any = { keyCode: 90, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
    container.documentHelper.onKeyDownInternal(eventArgs);
    expect(container.editorHistory.undoStack[container.editorHistory.undoStack.length - 1].action).toBe('ImageResizing');
  });
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
  it('Footnote validation', function () {
    console.log('Footnote validation');
    container.editor.insertFootnote();
    container.editor.insertText('Hello World');
    expect(container.editor.documentHelper.footnoteCollection.length).toBe(1);
  });

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
  it('undo after comment insert', function () {
    console.log('undo after comment insert');
    container.editorHistory.undo();
    expect(container.selection.end.currentWidget.children.length).toBe(1);
  });
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
