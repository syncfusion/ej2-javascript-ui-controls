import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TextPosition } from '../../src/index';
import { LayoutViewer, PageLayoutViewer } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { createElement } from '@syncfusion/ej2-base';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
//import { EditorHistory } from '../../src/index';
import { ParagraphWidget, LineWidget, ImageElementBox } from '../../src/index';

/**
 * Selection Spec test case
 */

//Insert image validation 
let jsonStr =
{
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
              "text": "Document editor",
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
}
let imageString: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADQSURBVFhH7ZbRDYQgDIYZ5UZhFEdxlBuFUUhY4N7vwWtTURJz5tem8GAbTYS0/eGjWsN7hJVSAuku3c2FuyF31BvqBNu90/mLmnSRjKDbMZULt2csz/kV8hRbVjSkSZkxRC0yKcbl+6FLhttSDIV5W6vYnKeZVWkR1WyFGbhIHrAbCzPhEcL1XCvqptYMd7xXExUXM4+pT3ENe53OP5yGqJ8kDDZGpIld6E730uFR/uuDs1J6OmolQDzcUeOslJ6OWgkQD3fUOCulJ6Ome4j9AGEu0k90WN54AAAAAElFTkSuQmCC';
describe('Insert Picture', () => {
  let editor: DocumentEditor = undefined;
  let viewer: LayoutViewer;
  beforeAll(() => {
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    DocumentEditor.Inject(Editor, Selection);
    editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
    (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
    (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
    (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
    (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
    editor.appendTo('#container');
  });
  afterAll((done) => {
    document.body.removeChild(document.getElementById('container'));
    editor.destroy();
    editor = undefined;
    viewer = undefined;
    setTimeout(function () {
      done();
    }, 1000);
  });

  it('insert Image with specific string , width and height', () => {
    editor.open(JSON.stringify(jsonStr));
    editor.editor.insertImage(imageString, 100, 100);
    expect((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children[0] instanceof ImageElementBox).toBe(true);
  });
  it('insert Image with specific string and  width and height are undefined', () => {
    editor.open(JSON.stringify(jsonStr));
    editor.editor.insertImage(imageString);
    expect((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children[0] instanceof ImageElementBox).toBe(true);
  });
  it('insert Image with specific string and  width  greater than page width', () => {
    editor.open(JSON.stringify(jsonStr));
    editor.editor.insertImage(imageString, 2000, 100);
    expect((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children[0] instanceof ImageElementBox).toBe(true);
  });
});
describe('Insert Picture Validation', () => {
  let editor: DocumentEditor = undefined;
  let viewer: LayoutViewer;
  beforeAll(() => {
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    DocumentEditor.Inject(Selection, Editor);
    editor = new DocumentEditor({ enableSelection: true, enableEditor: true });
    (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
    (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
    (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
    (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
    editor.appendTo('#container');
  });
  afterAll((done) => {
    document.body.removeChild(document.getElementById('container'));
    editor.destroy();
    editor = undefined;
    viewer = undefined;
    setTimeout(function () {
      done();
    }, 1000);
  });
  it('insert image api return when readonly is true', () => {
    editor.open(JSON.stringify(jsonStr));
    editor.isReadOnly = true;
    editor.editor.insertImage(imageString, 500, 400);
    expect((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children[0] instanceof ImageElementBox).not.toBe(true);
  });
  it('caret not to be shown when editable lose its focus', () => {
    let event: any = { preventDefault: function () { } };
    editor.viewer.onFocusOut();
    expect(editor.selection.caret.style.display).toBe('none');
  });
});
describe('Selection Based on client Coordinated validation', () => {
  let editor: DocumentEditor = undefined;
  let viewer: LayoutViewer;
  beforeAll(() => {
    document.body.innerHTML = "";
    let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1000px;height:600px' });
    document.body.appendChild(ele);
    DocumentEditor.Inject(Editor, Selection);
    editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
    (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
    (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
    (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
    (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
    editor.appendTo('#container');
  });
  afterAll((done) => {
    document.body.removeChild(document.getElementById('container'));
    editor.destroy();
    editor = undefined;
    viewer = undefined;
    setTimeout(function () {
      done();
    }, 1000);
  });
  it('Selection content based on cilent coordinated corresponding to View port', () => {
    editor.editorModule.insertText('Syncfusion', true);
    for (let i: number = 0; i < 9; i++) {
      editor.editorModule.onEnter();
      editor.editorModule.insertText('Syncfusion', true);
    }
    editor.selection.select({ x: 97.5 + editor.selection.start.paragraph.bodyWidget.page.boundingRectangle.x, y: 108 });
    expect(editor.selection.start.paragraph.index).toBe(0);
  });
  it('Extent selection based on sursor position relative to view port', () => {
    editor.selection.select({ x: 162.5 + editor.selection.start.paragraph.bodyWidget.page.boundingRectangle.x, y: 289, extend: true });
    expect(editor.selection.start.paragraph.index).toBe(0);
    expect(editor.selection.end.paragraph.index).toBe(9);
  })
  it('Extend to selection start', () => {
    editor.selection.select({ x: 97.5 + editor.selection.start.paragraph.bodyWidget.page.boundingRectangle.x, y: 108 });
    expect(editor.selection.start.paragraph.index).toBe(0);
    expect(editor.selection.end.paragraph.index).toBe(0);
  })
});