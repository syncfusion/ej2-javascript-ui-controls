import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, Selection, Layout, PageLayoutViewer, TableRowWidget, TableCellWidget } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
/**
 * Layout spec
 */
let sfdt: object = {
    'sections': [
        {
            'blocks': [
                {
                    'inlines': [
                        {
                            'characterFormat': {
                                'bold': true,
                                'italic': true
                            },
                            'text': 'Hello World'
                        }
                    ]
                }
            ],
            'headersFooters': {
            }
        },
        {
            'blocks': [
                {
                    'inlines': [
                        {
                            'characterFormat': {
                                'bold': true,
                                'italic': true
                            },
                            'text': 'Hello World'
                        }
                    ]
                }
            ],
            'headersFooters': {
            }
        }
    ]
};

describe('Layout multiple section', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true });
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
    it('Enter press multiple times', () => {
console.log('Enter press multiple times');
        editor.open(JSON.stringify(sfdt));
        expect(editor.documentHelper.pages.length).toBe(2);
        for (let i: number = 0; i < 60; i++) {
            editor.editorModule.onEnter();
        }
        expect(editor.documentHelper.pages.length).toBe(3);
    })
    // it('Table widhtout column span', () => {
    //     editor.open(JSON.stringify(tableWidthOutColumnSpan));
    //     let table = editor.selection.start.paragraph.associatedCell.ownerTable;
    //     let row = table.childWidgets[0] as TableRowWidget;
    //     expect((row.childWidgets[0] as TableCellWidget).cellFormat.columnSpan).toBe(1);
    //     expect((row.childWidgets[1] as TableCellWidget).cellFormat.columnSpan).toBe(3);
    //     expect((row.childWidgets[2] as TableCellWidget).cellFormat.columnSpan).toBe(1);
    //     expect((row.childWidgets[3] as TableCellWidget).cellFormat.columnSpan).toBe(1);
    //     row = row.nextRow;
    //     expect((row.childWidgets[0] as TableCellWidget).cellFormat.columnSpan).toBe(1);
    //     expect((row.childWidgets[1] as TableCellWidget).cellFormat.columnSpan).toBe(2);
    //     expect((row.childWidgets[2] as TableCellWidget).cellFormat.columnSpan).toBe(2);
    //     expect((row.childWidgets[3] as TableCellWidget).cellFormat.columnSpan).toBe(1);
    //     row = row.nextRow;
    //     expect((row.childWidgets[0] as TableCellWidget).cellFormat.columnSpan).toBe(2);
    //     expect((row.childWidgets[1] as TableCellWidget).cellFormat.columnSpan).toBe(3);
    //     expect((row.childWidgets[2] as TableCellWidget).cellFormat.columnSpan).toBe(1);
    //     row = row.nextRow;
    //     expect((row.childWidgets[0] as TableCellWidget).cellFormat.columnSpan).toBe(2);
    //     expect((row.childWidgets[1] as TableCellWidget).cellFormat.columnSpan).toBe(3);
    //     expect((row.childWidgets[2] as TableCellWidget).cellFormat.columnSpan).toBe(1);
    // });
});

describe('Layout Module branches validation', () => {
    let layout: any = new Layout({} as any);
    it('Shift next widget validation', () => {
console.log('Shift next widget validation');
        expect(() => { layout.shiftNextWidgets({}); }).not.toThrowError();
    });
    it('Get Top margin validation', () => {
console.log('Get Top margin validation');
        expect(layout.getMaxTopCellMargin({})).toBe(0);
    });
    it('Get laine spacing validation', () => {
console.log('Get laine spacing validation');
        expect(layout.getLineSpacing({})).toBe(0);
    });
    it('Layout body widget collection', () => {
console.log('Layout body widget collection');
        expect(() => { layout.layoutBodyWidgetCollection(); }).not.toThrowError();
    });
});

let tableWidthOutColumnSpan: any = {
    "sections": [
        {
            "blocks": [
                {
                    "rows": [
                        {
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "preferredWidth": 115.39905043619645,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 115.39905043619645,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 0
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {},
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "preferredWidth": 156.30754936108042,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 156.30754936108042,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 1
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {},
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "preferredWidth": 57.34397801014558,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 57.34397801014558,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 4
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {},
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "preferredWidth": 138.9494221925776,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 138.9494221925776,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 5
                                }
                            ],
                            "rowFormat": {
                                "height": 0,
                                "allowBreakAcrossPages": true,
                                "heightType": "Auto",
                                "isHeader": false,
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
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {},
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "preferredWidth": 115.39905043619645,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 115.39905043619645,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 0
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {},
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "preferredWidth": 116.72255936107864,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 116.72255936107864,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 1
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {},
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "preferredWidth": 96.92896801014734,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 96.92896801014734,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 3
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {},
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "preferredWidth": 138.9494221925776,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 138.9494221925776,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 5
                                }
                            ],
                            "rowFormat": {
                                "height": 0,
                                "allowBreakAcrossPages": true,
                                "heightType": "Auto",
                                "isHeader": false,
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
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {},
                                            "inlines": []
                                        },
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {},
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "preferredWidth": 190.52348209668986,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 190.52348209668986,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 0
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {},
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "preferredWidth": 138.52709571073257,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 138.52709571073257,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 2
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {},
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "preferredWidth": 138.9494221925776,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 138.9494221925776,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 5
                                }
                            ],
                            "rowFormat": {
                                "height": 0,
                                "allowBreakAcrossPages": true,
                                "heightType": "Auto",
                                "isHeader": false,
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
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {},
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "preferredWidth": 190.52348209668986,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 190.52348209668986,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 0
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {},
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "preferredWidth": 138.52709571073257,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 138.52709571073257,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 2
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {},
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "preferredWidth": 138.9494221925776,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 138.9494221925776,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 5
                                }
                            ],
                            "rowFormat": {
                                "height": 0,
                                "allowBreakAcrossPages": true,
                                "heightType": "Auto",
                                "isHeader": false,
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
                        115.39905043619645,
                        75.12443166049341,
                        41.59812770058522,
                        39.58499000000177,
                        57.34397801014558,
                        138.9494221925776
                    ],
                    "tableFormat": {
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
                        "allowAutoFit": false
                    }
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                    },
                    "characterFormat": {},
                    "inlines": []
                }
            ],
            "headersFooters": {}
        }
    ]
};

