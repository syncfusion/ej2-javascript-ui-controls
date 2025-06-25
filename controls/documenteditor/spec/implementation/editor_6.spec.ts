import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, FieldElementBox, BookmarkDialog } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import {
    LineWidget, ParagraphWidget, TextElementBox, TableWidget, TableRowWidget, TableCellWidget
} from '../../src/index';
import { ListView } from '@syncfusion/ej2-lists';





describe('ApplyStyle API validation - 1', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
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
        setTimeout(function () {
            
            done();
        }, 1000);
    });

    it('set ClearDirectFormatting as true', () => {
console.log('set ClearDirectFormatting as true');
        editor.editor.insertText('Sample');
        editor.selection.selectAll();
        editor.selection.characterFormat.fontSize = 24;
        editor.selection.characterFormat.fontFamily = 'Algerian';
        editor.selection.paragraphFormat.textAlignment = 'Right';
        editor.editor.applyStyle('Heading 1', true);
        expect(editor.selection.characterFormat.fontFamily).toBe('Calibri Light');
        expect(editor.selection.characterFormat.fontSize).toBe(16);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Left');
    });
    it('undo -after applyStyle validation', () => {
console.log('undo -after applyStyle validation');
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.fontFamily).toBe('Algerian');
        expect(editor.selection.characterFormat.fontSize).toBe(24);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Right');
    });

    it('redo -after applyStyle validation', () => {
console.log('redo -after applyStyle validation');
        editor.editorHistory.redo();
        expect(editor.selection.characterFormat.fontFamily).toBe('Calibri Light');
        expect(editor.selection.characterFormat.fontSize).toBe(16);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Left');
    });

    it('multiple undo and redo -after applyStyle validation', () => {
console.log('multiple undo and redo -after applyStyle validation');
        let count: number = 1;
        while (count <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            count++;
        }
        expect(editor.selection.characterFormat.fontFamily).toBe('Calibri Light');
        expect(editor.selection.characterFormat.fontSize).toBe(16);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Left');
    });
});


describe('ApplyStyle API validation - 2', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
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
        setTimeout(function () {
            
            done();
        }, 1000);
    });

    it('The paragraph already contains style and direct formatting, set ClearDirectFormatting as true', () => {
console.log('The paragraph already contains style and direct formatting, set ClearDirectFormatting as true');
        editor.editor.insertText('Sample');
        editor.editor.applyStyle('Heading 1', true);
        editor.selection.selectAll();
        editor.selection.characterFormat.fontSize = 24;
        editor.editor.applyStyle('Heading 4', true);
        expect(editor.selection.characterFormat.italic).toBe(true);
        expect(editor.selection.characterFormat.fontSize).toBe(11);
    });
    it('undo -after applyStyle validation', () => {
console.log('undo -after applyStyle validation');
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.italic).toBe(false);
        expect(editor.selection.characterFormat.fontSize).toBe(24);
    });

    it('redo -after applyStyle validation', () => {
console.log('redo -after applyStyle validation');
        editor.editorHistory.redo();
        expect(editor.selection.characterFormat.italic).toBe(true);
        expect(editor.selection.characterFormat.fontSize).toBe(11);
    });

    it('multiple undo and redo -after applyStyle validation', () => {
console.log('multiple undo and redo -after applyStyle validation');
        let count: number = 1;
        while (count <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            count++;
        }
        expect(editor.selection.characterFormat.italic).toBe(true);
        expect(editor.selection.characterFormat.fontSize).toBe(11);
    });
});


describe('ApplyStyle API validation - 2 without History', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection);
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
        setTimeout(function () {
            
            done();
        }, 1000);
    });

//     it('without specify ClearDirectFormatting', () => {
// console.log('without specify ClearDirectFormatting');
//         editor.editor.insertText('Sample');
//         editor.selection.selectAll();
//         editor.selection.characterFormat.fontSize = 24;
//         editor.editor.applyStyle('Heading 4');
//         expect(editor.selection.characterFormat.fontSize).toBe(24);
//     });
//     it('with ClearDirectFormatting', () => {
// console.log('with ClearDirectFormatting');
//         editor.editor.insertText('Sample');
//         editor.selection.selectAll();
//         editor.selection.characterFormat.fontSize = 24;
//         editor.editor.applyStyle('Heading 4', true);
//         expect(editor.selection.characterFormat.fontSize).toBe(11);
//     });
});

describe('Adding bookmark link in empty paragraph validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableBookmarkDialog: true });
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog);
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
        setTimeout(function () {
            
            done();
        }, 1000);
    });

//     it('Adding bookmark link in empty paragraph', () => {
// console.log('Adding bookmark link in empty paragraph');
//         editor.showBookmarkDialog();
//         (document.getElementById('bookmark_text_box') as any).value = 'firstpage';
//         editor.bookmarkDialogModule.onKeyUpOnTextBox();
//         (document.getElementById('add') as HTMLButtonElement).disabled = false;
//         document.getElementById('add').click();
//         expect(editor.documentHelper.bookmarks.length).toBe(1);
//     });
});


describe('Apply Character format in empty selection and paragraph is Empty', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
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
        setTimeout(function () {
            
            done();
        }, 1000);
    });

    it('Apply character format value and paragraph is empty', () => {
console.log('Apply character format value and paragraph is empty');
        editor.selection.characterFormat.bold = true;
        editor.selection.handleRightKey();
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
    it('undo -after apply character format in empty selection', () => {
console.log('undo -after apply character format in empty selection');
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.bold).toBe(false);
    });

    it('redo -after apply character format in empty selection', () => {
console.log('redo -after apply character format in empty selection');
        editor.editorHistory.redo();
        expect(editor.selection.characterFormat.bold).toBe(true);
    });

    it('multiple undo and redo -after apply character format in empty selection', () => {
console.log('multiple undo and redo -after apply character format in empty selection');
        let count: number = 1;
        while (count <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            count++;
        }
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
});

describe('Apply Character format in empty selection and paragraph is not Empty', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
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
        setTimeout(function () {
            
            done();
        }, 1000);
    });

    it('Apply character format value and paragraph is empty', () => {
console.log('Apply character format value and paragraph is empty');
        editor.editor.insertText('Sample');
        editor.selection.characterFormat.fontSize = 48;
        editor.selection.characterFormat.fontColor = 'Red';
        expect(editor.selection.characterFormat.fontSize).toBe(48);
        expect(editor.selection.characterFormat.fontColor).toBe('Red');
    });
    it('Enter -after apply character format and paragraph is not empty', () => {
console.log('Enter -after apply character format and paragraph is not empty');
        editor.editor.onEnter();
        expect(editor.selection.characterFormat.fontSize).toBe(48);
        expect(editor.selection.characterFormat.fontColor).toBe('Red');
    });
    it('Undo - Enter -after apply character format and paragraph is not empty', () => {
console.log('Undo - Enter -after apply character format and paragraph is not empty');
        editor.editorHistory.undo();
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.fontSize).toBe(11);
    });
});

describe('Table Style validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
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
        setTimeout(function () {
            
            done();
        }, 1000);
    });

    it('Document opening with table style test', () => {
        console.log('Document opening with table style test');
        expect(() => { editor.open(getJson()); }).not.toThrowError();
    });

    function getJson(): string {
        const json: any = {
            "optimizeSfdt": false,
            "sections": [
                {
                    "blocks": [
                        {
                            "inlines": []
                        },
                        {
                            "rows": [
                                {
                                    "rowFormat": {
                                        "allowBreakAcrossPages": true,
                                        "isHeader": false,
                                        "height": 0.0,
                                        "heightType": "AtLeast",
                                        "borders": {
                                            "left": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": true
                                            },
                                            "right": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": true
                                            },
                                            "top": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": true
                                            },
                                            "bottom": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": true
                                            },
                                            "vertical": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": true
                                            },
                                            "horizontal": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": true
                                            },
                                            "diagonalDown": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalUp": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            }
                                        },
                                        "leftIndent": 13.25
                                    },
                                    "cells": [
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 11.0,
                                                        "fontFamily": "Arial",
                                                        "fontSizeBidi": 11.0,
                                                        "fontFamilyBidi": "Arial",
                                                        "fontFamilyAscii": "Arial",
                                                        "fontFamilyFarEast": "minorHAnsi",
                                                        "fontFamilyNonFarEast": "Arial"
                                                    },
                                                    "paragraphFormat": {
                                                        "lineSpacing": 1.0,
                                                        "lineSpacingType": "Multiple"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 31.25,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "borders": {
                                                    "left": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "right": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "top": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "bottom": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "vertical": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "horizontal": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "diagonalDown": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "diagonalUp": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    }
                                                },
                                                "cellWidth": 31.25
                                            }
                                        },
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 11.0,
                                                        "fontFamily": "Arial",
                                                        "fontSizeBidi": 11.0,
                                                        "fontFamilyBidi": "Arial",
                                                        "fontFamilyAscii": "Arial",
                                                        "fontFamilyFarEast": "minorHAnsi",
                                                        "fontFamilyNonFarEast": "Arial"
                                                    },
                                                    "paragraphFormat": {
                                                        "lineSpacing": 1.0,
                                                        "lineSpacingType": "Multiple"
                                                    },
                                                    "inlines": [
                                                        {
                                                            "text": "Video content production and editing ",
                                                            "characterFormat": {
                                                                "fontSize": 11.0,
                                                                "fontFamily": "Arial",
                                                                "fontSizeBidi": 11.0,
                                                                "fontFamilyBidi": "Arial",
                                                                "fontFamilyAscii": "Arial",
                                                                "fontFamilyFarEast": "minorHAnsi",
                                                                "fontFamilyNonFarEast": "Arial"
                                                            }
                                                        }
                                                    ]
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 436.25,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "borders": {
                                                    "left": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "right": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "top": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "bottom": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "vertical": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "horizontal": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "diagonalDown": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "diagonalUp": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    }
                                                },
                                                "cellWidth": 436.25
                                            }
                                        }
                                    ]
                                }
                            ],
                            "title": null,
                            "description": null,
                            "tableFormat": {
                                "allowAutoFit": true,
                                "leftIndent": 13.25,
                                "tableAlignment": "Left",
                                "preferredWidth": 467.5,
                                "preferredWidthType": "Point",
                                "borders": {
                                    "left": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": true
                                    },
                                    "right": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": true
                                    },
                                    "top": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": true
                                    },
                                    "bottom": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": true
                                    },
                                    "vertical": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": true
                                    },
                                    "horizontal": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": true
                                    },
                                    "diagonalDown": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    },
                                    "diagonalUp": {
                                        "lineStyle": "None",
                                        "lineWidth": 0.0,
                                        "shadow": false,
                                        "space": 0.0,
                                        "hasNoneStyle": false
                                    }
                                },
                                "bidi": false,
                                "horizontalPositionAbs": "Left",
                                "horizontalPosition": 0.0,
                                "styleName": "Table Grid"
                            }
                        },
                        {
                            "inlines": []
                        }
                    ],
                    "headersFooters": {
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
                        "pageStartingNumber": 1,
                        "endnoteNumberFormat": "LowerCaseRoman",
                        "footNoteNumberFormat": "Arabic",
                        "restartIndexForFootnotes": "DoNotRestart",
                        "restartIndexForEndnotes": "DoNotRestart",
                        "pageNumberStyle": "Arabic",
                        "breakCode": "NewPage"
                    }
                }
            ],
            "characterFormat": {
                "fontSize": 11.0,
                "fontFamily": "Arial",
                "fontSizeBidi": 11.0,
                "fontFamilyBidi": "Arial",
                "fontFamilyAscii": "Arial",
                "fontFamilyFarEast": "Arial",
                "fontFamilyNonFarEast": "Arial",
                "localeId": 9,
                "localeIdFarEast": 1033,
                "localeIdBidi": 1025
            },
            "paragraphFormat": {
                "lineSpacing": 1.149999976158142,
                "lineSpacingType": "Multiple"
            },
            "background": {
                "color": "#FFFFFFFF"
            },
            "styles": [
                {
                    "type": "Paragraph",
                    "name": "Normal",
                    "next": "Normal"
                },
                {
                    "type": "Paragraph",
                    "name": "Heading 1",
                    "basedOn": "Normal",
                    "next": "Normal",
                    "characterFormat": {
                        "fontSize": 20.0,
                        "fontSizeBidi": 20.0
                    },
                    "paragraphFormat": {
                        "beforeSpacing": 20.0,
                        "afterSpacing": 6.0,
                        "outlineLevel": "Level1",
                        "keepWithNext": true,
                        "keepLinesTogether": true
                    }
                },
                {
                    "type": "Paragraph",
                    "name": "Heading 2",
                    "basedOn": "Normal",
                    "next": "Normal",
                    "characterFormat": {
                        "fontSize": 16.0,
                        "fontSizeBidi": 16.0
                    },
                    "paragraphFormat": {
                        "beforeSpacing": 18.0,
                        "afterSpacing": 6.0,
                        "outlineLevel": "Level2",
                        "keepWithNext": true,
                        "keepLinesTogether": true
                    }
                },
                {
                    "type": "Paragraph",
                    "name": "Heading 3",
                    "basedOn": "Normal",
                    "next": "Normal",
                    "characterFormat": {
                        "fontSize": 14.0,
                        "fontColor": "#434343FF",
                        "fontSizeBidi": 14.0
                    },
                    "paragraphFormat": {
                        "beforeSpacing": 16.0,
                        "afterSpacing": 4.0,
                        "outlineLevel": "Level3",
                        "keepWithNext": true,
                        "keepLinesTogether": true
                    }
                },
                {
                    "type": "Paragraph",
                    "name": "Heading 4",
                    "basedOn": "Normal",
                    "next": "Normal",
                    "characterFormat": {
                        "fontSize": 12.0,
                        "fontColor": "#666666FF",
                        "fontSizeBidi": 12.0
                    },
                    "paragraphFormat": {
                        "beforeSpacing": 14.0,
                        "afterSpacing": 4.0,
                        "outlineLevel": "Level4",
                        "keepWithNext": true,
                        "keepLinesTogether": true
                    }
                },
                {
                    "type": "Paragraph",
                    "name": "Heading 5",
                    "basedOn": "Normal",
                    "next": "Normal",
                    "characterFormat": {
                        "fontColor": "#666666FF"
                    },
                    "paragraphFormat": {
                        "beforeSpacing": 12.0,
                        "afterSpacing": 4.0,
                        "outlineLevel": "Level5",
                        "keepWithNext": true,
                        "keepLinesTogether": true
                    }
                },
                {
                    "type": "Paragraph",
                    "name": "Heading 6",
                    "basedOn": "Normal",
                    "next": "Normal",
                    "characterFormat": {
                        "italic": true,
                        "fontColor": "#666666FF"
                    },
                    "paragraphFormat": {
                        "beforeSpacing": 12.0,
                        "afterSpacing": 4.0,
                        "outlineLevel": "Level6",
                        "keepWithNext": true,
                        "keepLinesTogether": true
                    }
                },
                {
                    "type": "Character",
                    "name": "Default Paragraph Font"
                },
                {
                    "type": "Table",
                    "name": "Normal Table",
                    "next": "Normal Table"
                },
                {
                    "type": "Paragraph",
                    "name": "Title",
                    "basedOn": "Normal",
                    "next": "Normal",
                    "characterFormat": {
                        "fontSize": 26.0,
                        "fontSizeBidi": 26.0
                    },
                    "paragraphFormat": {
                        "afterSpacing": 3.0,
                        "keepWithNext": true,
                        "keepLinesTogether": true
                    }
                },
                {
                    "type": "Paragraph",
                    "name": "Subtitle",
                    "basedOn": "Normal",
                    "next": "Normal",
                    "characterFormat": {
                        "fontSize": 15.0,
                        "fontColor": "#666666FF",
                        "fontSizeBidi": 15.0
                    },
                    "paragraphFormat": {
                        "afterSpacing": 16.0,
                        "keepWithNext": true,
                        "keepLinesTogether": true
                    }
                },
                {
                    "type": "Table",
                    "name": "a",
                    "basedOn": "Normal Table",
                    "next": "a"
                },
                {
                    "type": "Character",
                    "name": "Hyperlink",
                    "basedOn": "Default Paragraph Font",
                    "characterFormat": {
                        "underline": "Single",
                        "fontColor": "#0000FFFF"
                    }
                },
                {
                    "type": "Paragraph",
                    "name": "List Paragraph",
                    "basedOn": "Normal",
                    "next": "List Paragraph",
                    "paragraphFormat": {
                        "leftIndent": 36.0,
                        "contextualSpacing": true
                    }
                },
                {
                    "type": "Table",
                    "name": "Table Grid",
                    "basedOn": "Normal Table",
                    "next": "Table Grid"
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
                        "paragraphFormat": {
                            "lineSpacing": 1.0,
                            "lineSpacingType": "Multiple"
                        },
                        "inlines": [
                            {
                                "text": "\u0003"
                            }
                        ]
                    }
                ],
                "continuationSeparator": [
                    {
                        "paragraphFormat": {
                            "lineSpacing": 1.0,
                            "lineSpacingType": "Multiple"
                        },
                        "inlines": [
                            {
                                "text": "\u0004"
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
                        "paragraphFormat": {
                            "lineSpacing": 1.0,
                            "lineSpacingType": "Multiple"
                        },
                        "inlines": [
                            {
                                "text": "\u0003"
                            }
                        ]
                    }
                ],
                "continuationSeparator": [
                    {
                        "paragraphFormat": {
                            "lineSpacing": 1.0,
                            "lineSpacingType": "Multiple"
                        },
                        "inlines": [
                            {
                                "text": "\u0004"
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
            "compatibilityMode": "Word2013",
            "allowSpaceOfSameStyleInTable": false,
            "themeFontLanguages": {
                "localeId": 1033,
                "localeIdBidi": 1025
            },
            "themes": {
                "fontScheme": {
                    "fontSchemeName": "Office",
                    "majorFontScheme": {
                        "fontSchemeList": [
                            {
                                "name": "latin",
                                "typeface": "Calibri"
                            },
                            {
                                "name": "ea"
                            },
                            {
                                "name": "cs"
                            }
                        ],
                        "fontTypeface": {
                            "Jpan": "ＭＳ ゴシック",
                            "Hang": "맑은 고딕",
                            "Hans": "宋体",
                            "Hant": "新細明體",
                            "Arab": "Times New Roman",
                            "Hebr": "Times New Roman",
                            "Thai": "Angsana New",
                            "Ethi": "Nyala",
                            "Beng": "Vrinda",
                            "Gujr": "Shruti",
                            "Khmr": "MoolBoran",
                            "Knda": "Tunga",
                            "Guru": "Raavi",
                            "Cans": "Euphemia",
                            "Cher": "Plantagenet Cherokee",
                            "Yiii": "Microsoft Yi Baiti",
                            "Tibt": "Microsoft Himalaya",
                            "Thaa": "MV Boli",
                            "Deva": "Mangal",
                            "Telu": "Gautami",
                            "Taml": "Latha",
                            "Syrc": "Estrangelo Edessa",
                            "Orya": "Kalinga",
                            "Mlym": "Kartika",
                            "Laoo": "DokChampa",
                            "Sinh": "Iskoola Pota",
                            "Mong": "Mongolian Baiti",
                            "Viet": "Times New Roman",
                            "Uigh": "Microsoft Uighur",
                            "Geor": "Sylfaen"
                        }
                    },
                    "minorFontScheme": {
                        "fontSchemeList": [
                            {
                                "name": "latin",
                                "typeface": "Cambria"
                            },
                            {
                                "name": "ea"
                            },
                            {
                                "name": "cs"
                            }
                        ],
                        "fontTypeface": {
                            "Jpan": "ＭＳ 明朝",
                            "Hang": "맑은 고딕",
                            "Hans": "宋体",
                            "Hant": "新細明體",
                            "Arab": "Arial",
                            "Hebr": "Arial",
                            "Thai": "Cordia New",
                            "Ethi": "Nyala",
                            "Beng": "Vrinda",
                            "Gujr": "Shruti",
                            "Khmr": "DaunPenh",
                            "Knda": "Tunga",
                            "Guru": "Raavi",
                            "Cans": "Euphemia",
                            "Cher": "Plantagenet Cherokee",
                            "Yiii": "Microsoft Yi Baiti",
                            "Tibt": "Microsoft Himalaya",
                            "Thaa": "MV Boli",
                            "Deva": "Mangal",
                            "Telu": "Gautami",
                            "Taml": "Latha",
                            "Syrc": "Estrangelo Edessa",
                            "Orya": "Kalinga",
                            "Mlym": "Kartika",
                            "Laoo": "DokChampa",
                            "Sinh": "Iskoola Pota",
                            "Mong": "Mongolian Baiti",
                            "Viet": "Arial",
                            "Uigh": "Microsoft Uighur",
                            "Geor": "Sylfaen"
                        }
                    }
                }
            }
        };
        return JSON.stringify(json);
    }
});
