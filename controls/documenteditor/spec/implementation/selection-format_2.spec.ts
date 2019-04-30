import { SelectionCharacterFormat, SelectionParagraphFormat, SelectionSectionFormat, SelectionTableFormat, SelectionCellFormat, SelectionRowFormat } from '../../src/index';
import { WParagraphFormat, WSectionFormat, WRowFormat, WCellFormat, WCharacterFormat } from '../../src/document-editor/implementation/format/index';
import { WidthType, HeightType, Strikethrough, CellVerticalAlignment, Underline, BaselineAlignment } from '../../src/document-editor/base/types';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { LayoutViewer, PageLayoutViewer } from '../../src/index';
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
    let viewer: LayoutViewer;
    beforeEach(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(json));
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterEach((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        viewer = undefined;
        setTimeout(() => {
            done();
        }, 1000);
    });

    it('Page width and Page Height validation', () => {
        editor.selection.sectionFormat.pageHeight = 100;
        expect(editor.selection.sectionFormat.pageHeight).toBe(100);
        editor.editorHistory.undo();
        expect(editor.selection.sectionFormat.pageHeight).toBe(792);
        editor.editorHistory.redo();
        expect(editor.selection.sectionFormat.pageHeight).toBe(100);
    });
    it('Left and right margin validation', () => {
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
        editor.selection.sectionFormat.bottomMargin = -2;
        editor.selection.sectionFormat.rightMargin = -2;
        editor.selection.sectionFormat.topMargin = -2;
        editor.selection.sectionFormat.leftMargin = -2;
        editor.selection.sectionFormat.pageWidth = -2;
        editor.selection.sectionFormat.pageHeight = -2;
        expect('').toBe('');
    });
    it('header and footer validation', () => {
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
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(json));
        editor.selection.selectAll();
        viewer = editor.viewer as PageLayoutViewer;
    });
    beforeEach(() => {
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        viewer = undefined;
        setTimeout(() => {
            done();
        }, 1000);
    });

    it('character format validation', () => {
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