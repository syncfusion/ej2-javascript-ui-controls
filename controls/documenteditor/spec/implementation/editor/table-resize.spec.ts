import { LayoutViewer } from '../../../src/index';
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';
import { Editor } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
/**
 * Table resize on with table auto fit true
 */
describe('Table Resize at simple case in table middle validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1280px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableEditorHistory: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    beforeEach((done) => {
        editor.open(getSfdt());
        setTimeout(() => {
            editor.selection.selectTable();
            editor.editorModule.applyBorders({ type: 'AllBorders', lineWidth: 1, borderColor: 'black', borderStyle: 'Single' });
            editor.selection.selectPosition(editor.documentStart, editor.documentStart);
            done();
        });
    });
    afterEach(() => {
        editor.editorModule.tableResize.currentResizingTable = undefined;
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Table resize at resizePosition 0', () => {
console.log('Table resize at resizePosition 0');
        expect(editor.selection.start.paragraph.associatedCell.ownerTable.tableFormat.leftIndent).toBe(0);
        editor.documentHelper.isRowOrCellResizing = true;
        editor.editorModule.tableResize.currentResizingTable = editor.selection.start.paragraph.associatedCell.ownerTable;
        editor.editorModule.tableResize.resizeNode = 0;
        editor.editorModule.tableResize.resizerPosition = 0;
        editor.editorModule.tableResize.resizeTableCellColumn(10);
        editor.documentHelper.isRowOrCellResizing = false;
        expect(editor.selection.start.paragraph.associatedCell.ownerTable.tableFormat.leftIndent).not.toBe(0);
        expect(editor.selection.start.paragraph.associatedCell.ownerTable.tableFormat.allowAutoFit).toBe(true);
    });
    it('Table resize at resizePosition 1', () => {
console.log('Table resize at resizePosition 1');
        editor.documentHelper.isRowOrCellResizing = true;
        editor.editorModule.tableResize.currentResizingTable = editor.selection.start.paragraph.associatedCell.ownerTable;
        editor.editorModule.tableResize.resizeNode = 0;
        editor.editorModule.tableResize.resizerPosition = 1;
        editor.editorModule.tableResize.resizeTableCellColumn(10);
        editor.documentHelper.isRowOrCellResizing = false;
        expect(editor.selection.start.paragraph.associatedCell.ownerTable.tableFormat.allowAutoFit).toBe(false);
    });
    it('Table resize at resizePosition 2', () => {
console.log('Table resize at resizePosition 2');
        editor.documentHelper.isRowOrCellResizing = true;
        editor.editorModule.tableResize.currentResizingTable = editor.selection.start.paragraph.associatedCell.ownerTable;
        editor.editorModule.tableResize.resizeNode = 0;
        editor.editorModule.tableResize.resizerPosition = 2;
        editor.editorModule.tableResize.resizeTableCellColumn(10);
        editor.documentHelper.isRowOrCellResizing = false;
        expect(editor.selection.start.paragraph.associatedCell.ownerTable.tableFormat.allowAutoFit).toBe(false);
    });
});


function getSfdt() {
    return JSON.stringify({
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
                        "rows": [
                            {
                                "cells": [
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {},
                                                "characterFormat": {},
                                                "inlines": [
                                                    {
                                                        "characterFormat": {},
                                                        "text": "Syncfusion"
                                                    }
                                                ]
                                            }
                                        ],
                                        "cellFormat": {
                                            "borders": {},
                                            "shading": {},
                                            "preferredWidth": 12.5,
                                            "preferredWidthType": "Point",
                                            "cellWidth": 59.850759999999994,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "verticalAlignment": "Top"
                                        },
                                        "columnIndex": 0
                                    },
                                    {
                                        "blocks": [
                                            {
                                                "rows": [
                                                    {
                                                        "cells": [
                                                            {
                                                                "blocks": [
                                                                    {
                                                                        "paragraphFormat": {},
                                                                        "characterFormat": {},
                                                                        "inlines": [
                                                                            {
                                                                                "characterFormat": {},
                                                                                "text": "Syncfusion"
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "borders": {},
                                                                    "shading": {},
                                                                    "preferredWidth": 111.19999694824219,
                                                                    "preferredWidthType": "Point",
                                                                    "cellWidth": 111.19999694824219,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "verticalAlignment": "Top"
                                                                },
                                                                "columnIndex": 0
                                                            },
                                                            {
                                                                "blocks": [
                                                                    {
                                                                        "paragraphFormat": {},
                                                                        "characterFormat": {},
                                                                        "inlines": [
                                                                            {
                                                                                "characterFormat": {},
                                                                                "text": "Syncfusion"
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "borders": {},
                                                                    "shading": {},
                                                                    "preferredWidth": 111.25,
                                                                    "preferredWidthType": "Point",
                                                                    "cellWidth": 111.25,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "verticalAlignment": "Top"
                                                                },
                                                                "columnIndex": 1
                                                            }
                                                        ],
                                                        "rowFormat": {
                                                            "height": 1,
                                                            "allowBreakAcrossPages": true,
                                                            "heightType": "AtLeast",
                                                            "isHeader": false,
                                                            "borders": {},
                                                            "gridBefore": 0,
                                                            "gridBeforeWidth": 0,
                                                            "gridBeforeWidthType": "Point",
                                                            "gridAfter": 0,
                                                            "gridAfterWidth": 0,
                                                            "gridAfterWidthType": "Point"
                                                        }
                                                    },
                                                    {
                                                        "cells": [
                                                            {
                                                                "blocks": [
                                                                    {
                                                                        "paragraphFormat": {},
                                                                        "characterFormat": {},
                                                                        "inlines": [
                                                                            {
                                                                                "characterFormat": {},
                                                                                "text": "Syncfusion"
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "borders": {},
                                                                    "shading": {},
                                                                    "preferredWidth": 111.19999694824219,
                                                                    "preferredWidthType": "Point",
                                                                    "cellWidth": 111.19999694824219,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "verticalAlignment": "Top"
                                                                },
                                                                "columnIndex": 0
                                                            },
                                                            {
                                                                "blocks": [
                                                                    {
                                                                        "paragraphFormat": {},
                                                                        "characterFormat": {},
                                                                        "inlines": [
                                                                            {
                                                                                "characterFormat": {},
                                                                                "text": "Syncfusion"
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "borders": {},
                                                                    "shading": {},
                                                                    "preferredWidth": 111.25,
                                                                    "preferredWidthType": "Point",
                                                                    "cellWidth": 111.25,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "verticalAlignment": "Top"
                                                                },
                                                                "columnIndex": 1
                                                            }
                                                        ],
                                                        "rowFormat": {
                                                            "height": 1,
                                                            "allowBreakAcrossPages": true,
                                                            "heightType": "AtLeast",
                                                            "isHeader": false,
                                                            "borders": {},
                                                            "gridBefore": 0,
                                                            "gridBeforeWidth": 0,
                                                            "gridBeforeWidthType": "Point",
                                                            "gridAfter": 0,
                                                            "gridAfterWidth": 0,
                                                            "gridAfterWidthType": "Point"
                                                        }
                                                    }
                                                ],
                                                "grid": [
                                                    111.19999694824219,
                                                    111.25
                                                ],
                                                "tableFormat": {
                                                    "borders": {},
                                                    "shading": {},
                                                    "cellSpacing": 0,
                                                    "leftIndent": 0,
                                                    "tableAlignment": "Left",
                                                    "topMargin": 0,
                                                    "rightMargin": 5.4,
                                                    "leftMargin": 5.4,
                                                    "bottomMargin": 0,
                                                    "preferredWidth": 0,
                                                    "preferredWidthType": "Auto",
                                                    "bidi": false,
                                                    "allowAutoFit": true
                                                },
                                                "description": null,
                                                "title": null
                                            },
                                            {
                                                "paragraphFormat": {},
                                                "characterFormat": {},
                                                "inlines": []
                                            }
                                        ],
                                        "cellFormat": {
                                            "borders": {},
                                            "shading": {},
                                            "preferredWidth": 198.75,
                                            "preferredWidthType": "Point",
                                            "cellWidth": 234.95,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "verticalAlignment": "Top"
                                        },
                                        "columnIndex": 1
                                    }
                                ],
                                "rowFormat": {
                                    "height": 1,
                                    "allowBreakAcrossPages": true,
                                    "heightType": "AtLeast",
                                    "isHeader": false,
                                    "borders": {},
                                    "gridBefore": 0,
                                    "gridBeforeWidth": 0,
                                    "gridBeforeWidthType": "Point",
                                    "gridAfter": 0,
                                    "gridAfterWidth": 0,
                                    "gridAfterWidthType": "Point"
                                }
                            },
                            {
                                "cells": [
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {},
                                                "characterFormat": {},
                                                "inlines": [
                                                    {
                                                        "characterFormat": {},
                                                        "text": "Syncfusion"
                                                    }
                                                ]
                                            }
                                        ],
                                        "cellFormat": {
                                            "borders": {},
                                            "shading": {},
                                            "preferredWidth": 0,
                                            "preferredWidthType": "Auto",
                                            "cellWidth": 59.850759999999994,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "verticalAlignment": "Top"
                                        },
                                        "columnIndex": 0
                                    },
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {},
                                                "characterFormat": {},
                                                "inlines": [
                                                    {
                                                        "characterFormat": {},
                                                        "text": "Syncfusion"
                                                    }
                                                ]
                                            }
                                        ],
                                        "cellFormat": {
                                            "borders": {},
                                            "shading": {},
                                            "preferredWidth": 199.4499969482422,
                                            "preferredWidthType": "Point",
                                            "cellWidth": 234.95,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "verticalAlignment": "Top"
                                        },
                                        "columnIndex": 1
                                    }
                                ],
                                "rowFormat": {
                                    "height": 1,
                                    "allowBreakAcrossPages": true,
                                    "heightType": "AtLeast",
                                    "isHeader": false,
                                    "borders": {},
                                    "gridBefore": 0,
                                    "gridBeforeWidth": 0,
                                    "gridBeforeWidthType": "Point",
                                    "gridAfter": 0,
                                    "gridAfterWidth": 0,
                                    "gridAfterWidthType": "Point"
                                }
                            }
                        ],
                        "grid": [
                            59.850759999999994,
                            234.95
                        ],
                        "tableFormat": {
                            "borders": {},
                            "shading": {},
                            "cellSpacing": 0,
                            "leftIndent": 0,
                            "tableAlignment": "Left",
                            "topMargin": 0,
                            "rightMargin": 5.75,
                            "leftMargin": 5.75,
                            "bottomMargin": 0,
                            "preferredWidth": 0,
                            "preferredWidthType": "Auto",
                            "bidi": false,
                            "allowAutoFit": true
                        },
                        "description": null,
                        "title": null
                    },
                    {
                        "paragraphFormat": {},
                        "characterFormat": {},
                        "inlines": []
                    }
                ],
                "headersFooters": {}
            }
        ],
        "characterFormat": {
            "fontSize": 11,
            "fontFamily": "Calibri"
        },
        "paragraphFormat": {
            "afterSpacing": 8,
            "lineSpacing": 1.0791666507720947,
            "lineSpacingType": "Multiple",
            "listFormat": {}
        },
        "styles": [],
        "lists": [],
        "abstractLists": []
    })
}
