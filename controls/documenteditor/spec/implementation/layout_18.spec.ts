import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, LineWidget, ParagraphWidget, Selection, TabElementBox, TableRowWidget, TableWidget } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
describe('Merge cell index validtaion', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Row merge index validation', () => {
        editor.openBlank();
        editor.editor.insertTable(45, 2);
        editor.editor.handleEnterKey();
        editor.editor.handleEnterKey();
        editor.editor.handleEnterKey();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[42] as TableRowWidget).index).toBe(42);
    });
});
describe('Track changes revision validation for justify alignment', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Track changes revision validation for justify alignmentTrack changes revision validation for justify alignment', () => {
        editor.openBlank();
        editor.editor.insertText('Syncfusion');
        editor.selection.handleHomeKey();
        editor.selection.selectAll();
        editor.selection.paragraphFormat.textAlignment = 'Justify';
        editor.selection.handleHomeKey();
        editor.enableTrackChanges = true;
        editor.editor.insertText('Hello');
        editor.editor.insertText(' ');
        editor.editor.insertText('World');
        expect((editor.documentHelper.revisionsInternal as any).valuesInternal[0].range[0].text).toBe('Hello ');
        expect((editor.documentHelper.revisionsInternal as any).valuesInternal[0].range[1].text).toBe('World');
    });
});
let tabstop: any = {
    "sections": [
        {
            "blocks": [
                {
                    "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "text": "_________________________________________"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "text": "\t"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "text": "           "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "styleName": "DPSTNR10",
                        "listFormat": {}
                    },
                    "characterFormat": {},
                    "inlines": [
                        {
                            "characterFormat": {},
                            "text": "_________________________________________"
                        },
                        {
                            "characterFormat": {},
                            "text": "\t"
                        },
                        {
                            "characterFormat": {},
                            "text": "           "
                        }
                    ]
                }
            ],
            "headersFooters": {}
        }
    ],
    "defaultTabWidth": 35.45000076293945,
    "styles": [
        {
            "name": "Normal",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {}
            },
            "characterFormat": {
                "fontColor": "empty"
            },
            "next": "Normal"
        },
        {
            "name": "DPSTNR10 Char",
            "type": "Character",
            "characterFormat": {
                "fontColor": "empty"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "DPSTNR10",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {}
            },
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Times New Roman",
                "fontColor": "#000000FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "next": "DPSTNR10"
        }
    ]
};
describe('Tab width calculation validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Tab width calculation validation', () => {
        editor.open(JSON.stringify(tabstop));
        //tab element width is different for element with normal style
        expect(Math.round((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as TabElementBox).width)).toBe(30);
        //tab element width is different for element with font size 10 and font family time new roman
        expect(Math.round((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as TabElementBox).width)).toBe(10);
    });
});
let sectionbreak: any = {
    "sections": [
      {
        "blocks": [
          {
            "paragraphFormat": {
              "styleName": "Normal",
              "listFormat": {}
            },
            "characterFormat": {
              "fontColor": "empty"
            },
            "inlines": [
              {
                "characterFormat": {
                  "fontColor": "empty"
                },
                "text": "Page break"
              }
            ]
          },
          {
            "paragraphFormat": {
              "styleName": "Normal",
              "listFormat": {}
            },
            "characterFormat": {
              "fontColor": "empty"
            },
            "inlines": [
              {
                "characterFormat": {
                  "fontColor": "empty"
                },
                "text": "\f"
              }
            ]
          }
        ]
      }
    ]
  };  
describe('Page break and section break validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Page break and section break validation', () => {
        editor.open(JSON.stringify(sectionbreak));
        //if section break come before page break only one page shoul be added and one should be skipped
        expect(editor.documentHelper.pages.length).toBe(2);
    });
});
describe('Table with merged cell spilts into page validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Table with merged cell spilts into page validation', () => {
        editor.editor.insertTable(10, 4);
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.editor.mergeCells();
        editor.editor.onEnter();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.onEnter();
        expect(() => { editor.editor.onEnter(); }).not.toThrowError();
    });
});