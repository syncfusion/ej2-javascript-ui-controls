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
