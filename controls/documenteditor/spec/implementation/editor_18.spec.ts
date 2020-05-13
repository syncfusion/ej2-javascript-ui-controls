import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget, TableWidget, FieldElementBox, TextFormField, ElementBox, WParagraphFormat, WCharacterFormat } from '../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
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
    editor.editorModule.insertTable(2, 2);
    editor.selection.handleDownKey();
    editor.selection.handleDownKey();
    editor.editorModule.insertTable(1, 1);
    expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
  });
  it('undo after insert table', () => {
    editor.editorHistory.undo();
    expect(editor.selection.start.paragraph.isInsideTable).toBe(false);
  });
  it('redo after undo insert table', () => {
    editor.editorHistory.redo();
    expect(editor.selection.start.paragraph.previousWidget instanceof TableWidget).toBe(true);
  });
  it('Multiple undo and redo after insertTable', () => {
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
    editor.editor.insertText('sample');
    editor.editorModule.insertPageBreak();
    editor.editor.insertText('s');
    editor.selection.handleUpKey();
    editor.editor.insertText('s');
    expect(editor.documentHelper.pages.indexOf(editor.documentHelper.currentPage)).toBe(0);
  });
  it('In empty paragraph insert text and page break validation', () => {
    editor.editorModule.insertPageBreak();
    editor.editor.insertText('sample');
    editor.selection.handleUpKey();
    editor.editor.insertText('s');
    expect(editor.documentHelper.pages.indexOf(editor.documentHelper.currentPage)).toBe(0);
  });
  it('undo after insert text', () => {
    editor.editorHistory.undo();
    expect(editor.selection.start.currentWidget.children.length).toBe(1);
  });
  it('redo after insert text', () => {
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
    editor.editor.insertText('sample');
    editor.selection.selectAll();
    editor.editor.insertBookmark('sample');
    editor.selection.handleEndKey();
    editor.editor.onEnter();
    editor.editor.paste(sfdt);
    expect(editor.selection.start.currentWidget.children.length).toBe(1);
  });
  it('paste with different bookmark name', () => {
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
    editor.editor.insertText('sample');
    editor.editorModule.insertPageBreak();
    editor.editor.insertText('s');
    editor.selection.handleUpKey();
    editor.editor.insertText('s');
    expect(editor.documentHelper.pages.indexOf(editor.documentHelper.currentPage)).toBe(0);
  });
  it('In empty paragraph insert text and page break validation', () => {
    editor.editorModule.insertPageBreak();
    editor.editor.insertText('sample');
    editor.selection.handleUpKey();
    editor.editor.insertText('s');
    expect(editor.documentHelper.pages.indexOf(editor.documentHelper.currentPage)).toBe(0);
  });
  it('undo after insert text', () => {
    editor.editorHistory.undo();
    expect(editor.selection.start.currentWidget.children.length).toBe(1);
  });
  it('redo after insert text', () => {
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

});
