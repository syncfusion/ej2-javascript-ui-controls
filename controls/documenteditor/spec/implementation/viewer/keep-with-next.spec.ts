import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, Page, HelperMethods, TableWidget, ParagraphWidget } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { TableCellWidget, TableRowWidget } from '../../../src/index';


describe('Keep lines together Paragraph case validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, height: '700px' });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
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
        setTimeout(function () {
            done();
        }, 500);
    });
    it('Move whole paragraph to next page', () => {
        var sfdt = {
            "sections": [
                {
                    "blocks": [
                        {
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "italic": true,
                                        fontSize: 32
                                    },
                                    "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.Adventure Works Cycles"
                                }
                            ]
                        },
                        {
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "italic": true
                                    },
                                    "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."
                                }
                            ],
                            paragraphFormat: {
                                keepLinesTogether: true
                            }
                        }
                    ],
                    "headersFooters": {
                    }
                }
            ]
        };
        editor.open(JSON.stringify(sfdt));
        expect(editor.documentHelper.pages.length).toBe(2);
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(1);
        expect(editor.documentHelper.pages[1].bodyWidgets[0].childWidgets.length).toBe(1);
    });
    it("Page's first paragraph move has keep line together", () => {
        var sfdt = {
            "sections": [
                {
                    "blocks": [
                        {
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "italic": true,
                                        fontSize: 37
                                    },
                                    "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."
                                }
                            ],
                            paragraphFormat: {
                                keepLinesTogether: true
                            }
                        },
                        {
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "italic": true
                                    },
                                    "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."
                                }
                            ],
                            paragraphFormat: {
                                keepLinesTogether: true
                            }
                        }
                    ],
                    "headersFooters": {
                    }
                }
            ]
        };
        editor.open(JSON.stringify(sfdt));
        // If first paragraph of the page has keep line together
        // we should not move the paragraph to next page while splitting.
        expect(editor.documentHelper.pages.length).toBe(2);
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(1);
        expect(editor.documentHelper.pages[1].bodyWidgets[0].childWidgets.length).toBe(2);
    });
});

describe('Keep lines together Table case validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, height: '700px' });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
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
        setTimeout(function () {
            done();
        }, 500);
    });
    it('Move whole table to next page', () => {
        var sfdt: any = {
            "sections": [
                {
                    "blocks": [
                        {
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "italic": true,
                                        fontSize: 32
                                    },
                                    "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.Adventure Works Cycles"
                                }
                            ]
                        },
                        {
                            "rows": [
                                {
                                    "rowFormat": {
                                        "allowBreakAcrossPages": true,
                                        "isHeader": false,
                                        "height": 0,
                                        "heightType": "AtLeast",
                                        "borders": {}
                                    },
                                    "cells": [
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal",
                                                        "keepLinesTogether": true
                                                    },
                                                    "inlines": [
                                                        {
                                                            "characterFormat": {
                                                                "bold": true,
                                                                "italic": true
                                                            },
                                                            "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."
                                                        }
                                                    ]
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {},
                                                "cellWidth": 233.75
                                            }
                                        },
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {},
                                                "cellWidth": 233.75
                                            }
                                        }
                                    ]
                                },
                                {
                                    "rowFormat": {
                                        "allowBreakAcrossPages": true,
                                        "isHeader": false,
                                        "height": 0,
                                        "heightType": "AtLeast",
                                        "borders": {}
                                    },
                                    "cells": [
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {},
                                                "cellWidth": 233.75
                                            }
                                        },
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {},
                                                "cellWidth": 233.75
                                            }
                                        }
                                    ]
                                }
                            ],
                            "title": null,
                            "description": null,
                            "tableFormat": {
                                "allowAutoFit": true,
                                "leftIndent": 0,
                                "tableAlignment": "Left",
                                "preferredWidthType": "Auto",
                                "borders": {},
                                "bidi": false,
                                "horizontalPositionAbs": "Left",
                                "horizontalPosition": 0
                            }
                        },
                    ],
                    "headersFooters": {
                    }
                }
            ]
        };
        editor.open(JSON.stringify(sfdt));
        expect(editor.documentHelper.pages.length).toBe(2);
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(1);
        // Entire table moved to next page.
        expect(editor.documentHelper.pages[1].bodyWidgets[0].childWidgets.length).toBe(1);
    });
    it("First cell's second paragraph has Keep line together", () => {
        var sfdt: any = {
            "sections": [
                {
                    "blocks": [
                        {
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "italic": true,
                                        fontSize: 32
                                    },
                                    "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.Adventure Works Cycles"
                                }
                            ]
                        },
                        {
                            "rows": [
                                {
                                    "rowFormat": {
                                        "allowBreakAcrossPages": true,
                                        "isHeader": false,
                                        "height": 0,
                                        "heightType": "AtLeast",
                                        "borders": {}
                                    },
                                    "cells": [
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal",
                                                        "keepLinesTogether": false
                                                    },
                                                    "inlines": [
                                                        {
                                                            "characterFormat": {
                                                                "bold": true,
                                                                "italic": true
                                                            },
                                                            "text": "Adventure Works Cycles"
                                                        },

                                                    ]
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal",
                                                        "keepLinesTogether": true
                                                    },
                                                    "inlines": [
                                                        {
                                                            "characterFormat": {
                                                                "bold": true,
                                                                "italic": true
                                                            },
                                                            "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."
                                                        },

                                                    ]
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {},
                                                "cellWidth": 233.75
                                            }
                                        },
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {},
                                                "cellWidth": 233.75
                                            }
                                        }
                                    ]
                                },
                                {
                                    "rowFormat": {
                                        "allowBreakAcrossPages": true,
                                        "isHeader": false,
                                        "height": 0,
                                        "heightType": "AtLeast",
                                        "borders": {}
                                    },
                                    "cells": [
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {},
                                                "cellWidth": 233.75
                                            }
                                        },
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {},
                                                "cellWidth": 233.75
                                            }
                                        }
                                    ]
                                }
                            ],
                            "title": null,
                            "description": null,
                            "tableFormat": {
                                "allowAutoFit": true,
                                "leftIndent": 0,
                                "tableAlignment": "Left",
                                "preferredWidthType": "Auto",
                                "borders": {},
                                "bidi": false,
                                "horizontalPositionAbs": "Left",
                                "horizontalPosition": 0
                            }
                        },
                    ],
                    "headersFooters": {
                    }
                }
            ]
        };
        editor.open(JSON.stringify(sfdt));
        expect(editor.documentHelper.pages.length).toBe(2);
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
        expect(editor.documentHelper.pages[1].bodyWidgets[0].childWidgets.length).toBe(1);
        // Second paragraph moved to next page. Due to Keep with lines property.
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets.length).toBe(1);
    });
    it('Move whole table to next page - second cell first paragraph', () => {
        var sfdt: any = {
            "sections": [
                {
                    "blocks": [
                        {
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "italic": true,
                                        fontSize: 32
                                    },
                                    "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.Adventure Works Cycles"
                                }
                            ]
                        },
                        {
                            "rows": [
                                {
                                    "rowFormat": {
                                        "allowBreakAcrossPages": true,
                                        "isHeader": false,
                                        "height": 0,
                                        "heightType": "AtLeast",
                                        "borders": {}
                                    },
                                    "cells": [
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {},
                                                "cellWidth": 233.75
                                            }
                                        },
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal",
                                                        "keepLinesTogether": true
                                                    },
                                                    "inlines": [
                                                        {
                                                            "characterFormat": {
                                                                "bold": true,
                                                                "italic": true
                                                            },
                                                            "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."
                                                        },

                                                    ]
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal",
                                                        "keepLinesTogether": true
                                                    },
                                                    "inlines": [
                                                        {
                                                            "characterFormat": {
                                                                "bold": true,
                                                                "italic": true
                                                            },
                                                            "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."
                                                        },

                                                    ]
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {},
                                                "cellWidth": 233.75
                                            }
                                        }
                                    ]
                                },
                                {
                                    "rowFormat": {
                                        "allowBreakAcrossPages": true,
                                        "isHeader": false,
                                        "height": 0,
                                        "heightType": "AtLeast",
                                        "borders": {}
                                    },
                                    "cells": [
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {},
                                                "cellWidth": 233.75
                                            }
                                        },
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {},
                                                "cellWidth": 233.75
                                            }
                                        }
                                    ]
                                }
                            ],
                            "title": null,
                            "description": null,
                            "tableFormat": {
                                "allowAutoFit": true,
                                "leftIndent": 0,
                                "tableAlignment": "Left",
                                "preferredWidthType": "Auto",
                                "borders": {},
                                "bidi": false,
                                "horizontalPositionAbs": "Left",
                                "horizontalPosition": 0
                            }
                        },
                    ],
                    "headersFooters": {
                    }
                }
            ]
        };
        editor.open(JSON.stringify(sfdt));
        expect(editor.documentHelper.pages.length).toBe(2);
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(1);
        // Entire table moved to next page.
        expect(editor.documentHelper.pages[1].bodyWidgets[0].childWidgets.length).toBe(1);
    });
    it('Move whole table to next page - second cell second paragraph', () => {
        var sfdt: any = {
            "sections": [
                {
                    "blocks": [
                        {
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "italic": true,
                                        fontSize: 32
                                    },
                                    "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.Adventure Works Cycles"
                                }
                            ]
                        },
                        {
                            "rows": [
                                {
                                    "rowFormat": {
                                        "allowBreakAcrossPages": true,
                                        "isHeader": false,
                                        "height": 0,
                                        "heightType": "AtLeast",
                                        "borders": {}
                                    },
                                    "cells": [
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {},
                                                "cellWidth": 233.75
                                            }
                                        },
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal",
                                                        "keepLinesTogether": false
                                                    },
                                                    "inlines": [
                                                        {
                                                            "characterFormat": {
                                                                "bold": true,
                                                                "italic": true
                                                            },
                                                            "text": "Adventure Works Cycles"
                                                        },

                                                    ]
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal",
                                                        "keepLinesTogether": true
                                                    },
                                                    "inlines": [
                                                        {
                                                            "characterFormat": {
                                                                "bold": true,
                                                                "italic": true
                                                            },
                                                            "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."
                                                        },

                                                    ]
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {},
                                                "cellWidth": 233.75
                                            }
                                        }
                                    ]
                                },
                                {
                                    "rowFormat": {
                                        "allowBreakAcrossPages": true,
                                        "isHeader": false,
                                        "height": 0,
                                        "heightType": "AtLeast",
                                        "borders": {}
                                    },
                                    "cells": [
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {},
                                                "cellWidth": 233.75
                                            }
                                        },
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {},
                                                "cellWidth": 233.75
                                            }
                                        }
                                    ]
                                }
                            ],
                            "title": null,
                            "description": null,
                            "tableFormat": {
                                "allowAutoFit": true,
                                "leftIndent": 0,
                                "tableAlignment": "Left",
                                "preferredWidthType": "Auto",
                                "borders": {},
                                "bidi": false,
                                "horizontalPositionAbs": "Left",
                                "horizontalPosition": 0
                            }
                        },
                    ],
                    "headersFooters": {
                    }
                }
            ]
        };
        editor.open(JSON.stringify(sfdt));
        expect(editor.documentHelper.pages.length).toBe(2);
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
        expect(editor.documentHelper.pages[1].bodyWidgets[0].childWidgets.length).toBe(1);
    });
    it('Table is first item of the page', () => {
        var sfdt: any = {
            "sections": [
                {
                    "blocks": [
                        {
                            "rows": [
                                {
                                    "rowFormat": {
                                        "allowBreakAcrossPages": true,
                                        "isHeader": false,
                                        "height": 0,
                                        "heightType": "AtLeast",
                                        "borders": {}
                                    },
                                    "cells": [
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal",
                                                        "keepLinesTogether": true
                                                    },
                                                    "inlines": [
                                                        {
                                                            "characterFormat": {
                                                                "bold": true,
                                                                "italic": true
                                                            },
                                                            "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."
                                                        },

                                                    ]
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal",
                                                        "keepLinesTogether": true
                                                    },
                                                    "inlines": [
                                                        {
                                                            "characterFormat": {
                                                                "bold": true,
                                                                "italic": true
                                                            },
                                                            "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."
                                                        },

                                                    ]
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {},
                                                "cellWidth": 233.75
                                            }
                                        },
                                        {
                                            "blocks": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {},
                                                "cellWidth": 233.75
                                            }
                                        }

                                    ]
                                }
                            ],
                            "title": null,
                            "description": null,
                            "tableFormat": {
                                "allowAutoFit": true,
                                "leftIndent": 0,
                                "tableAlignment": "Left",
                                "preferredWidthType": "Auto",
                                "borders": {},
                                "bidi": false,
                                "horizontalPositionAbs": "Left",
                                "horizontalPosition": 0
                            }
                        },
                    ],
                    "headersFooters": {
                    }
                }
            ]
        };
        editor.open(JSON.stringify(sfdt));
        expect(editor.documentHelper.pages.length).toBe(2);
        // Table should not move to next page. Since it is first block of the page.
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(1);
        expect(editor.documentHelper.pages[1].bodyWidgets[0].childWidgets.length).toBe(1);
    });
});

describe('Keep with next with page break', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, height: '700px' });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
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
        setTimeout(function () {
            done();
        }, 500);
    });
    it('Paragraph has page break', () => {
        var sfdt = {
            "sections": [
                {
                    "blocks": [
                        {
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "italic": true,
                                        fontSize: 32
                                    },
                                    "text": "Adventure Works Cycles"
                                }
                            ]
                        },
                        {
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "italic": true
                                    },
                                    "text": "Adventure Works Cycles"
                                }
                            ],
                            "paragraphFormat": {
                                "keepWithNext": true
                            }
                        },
                        {
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "italic": true
                                    },
                                    "text": "\f"
                                }
                            ],
                            "paragraphFormat": {
                                "keepWithNext": true
                            }
                        },
                        {
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "italic": true
                                    },
                                    "text": "Adventure Works Cycles"
                                }
                            ],
                            "paragraphFormat": {
                                "keepWithNext": true
                            }
                        }
                    ],
                    "headersFooters": {
                    }
                }
            ]
        };
        editor.open(JSON.stringify(sfdt));
        expect(editor.documentHelper.pages.length).toBe(2);
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(3);
        expect(editor.documentHelper.pages[1].bodyWidgets[0].childWidgets.length).toBe(1);
    });
    it('Paragraph ends with page break', () => {
        var sfdt = {
            "sections": [
                {
                    "blocks": [
                        {
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "italic": true,
                                        fontSize: 32
                                    },
                                    "text": "Adventure Works Cycles"
                                }
                            ]
                        },
                        {
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "italic": true
                                    },
                                    "text": "Adventure Works Cycles"
                                }
                            ],
                            "paragraphFormat": {
                                "keepWithNext": true
                            }
                        },
                        {
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "italic": true
                                    },
                                    "text": "Adventure Works Cycles"
                                },
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "italic": true
                                    },
                                    "text": "\f"
                                }
                            ],
                            "paragraphFormat": {
                                "keepWithNext": true
                            }
                        },
                        {
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "italic": true
                                    },
                                    "text": "Adventure Works Cycles"
                                }
                            ],
                            "paragraphFormat": {
                                "keepWithNext": true
                            }
                        }
                    ],
                    "headersFooters": {
                    }
                }
            ]
        };
        editor.open(JSON.stringify(sfdt));
        expect(editor.documentHelper.pages.length).toBe(2);
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(3);
        expect(editor.documentHelper.pages[1].bodyWidgets[0].childWidgets.length).toBe(1);
    });
});

describe('Keep with next', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, height: '700px' });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
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
        setTimeout(function () {
            done();
        }, 500);
    });
    it('Shape affecting same paragraph', () => {
        let content: any = '{"sections":[{"blocks":[{"paragraphFormat":{"firstLineIndent":36,"styleName":"Normal"},"inlines":[{"text":"Adventure Works Cycles, the fictitious company on which the "},{"text":"AdventureWorks"},{"text":" sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, "},{"text":"European"},{"text":" and Asian commercial markets. While its base operation "},{"text":"is located in"},{"text":" Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."}]},{"paragraphFormat":{"firstLineIndent":36,"styleName":"Normal","keepWithNext":true,"keepLinesTogether":true},"inlines":[{"shapeId":1,"name":"Rectangle 1","visible":true,"width":62.5055122,"height":37.97803,"widthScale":100,"heightScale":100,"lineFormat":{"line":true,"color":"#2F528FFF","weight":1,"lineStyle":"Solid"},"fillFormat":{"color":"#4472C4FF","fill":true},"textWrappingStyle":"Square","textWrappingType":"Both","verticalPosition":16.62,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.40282347e+38,"horizontalPosition":175.65,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.40282347e+38,"zOrderPosition":251659264,"allowOverlap":true,"layoutInCell":true,"lockAnchor":false,"distanceBottom":0,"distanceLeft":9,"distanceRight":9,"distanceTop":0,"autoShapeType":"Rectangle","textFrame":{"textVerticalAlignment":"Middle","leftMargin":7.2,"rightMargin":7.2,"topMargin":3.6,"bottomMargin":3.6,"blocks":[{"inlines":[]}]}},{"text":"Adventure Works Cycles, the fictitious company on which the "},{"text":"AdventureWorks"},{"text":" sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, "},{"text":"European"},{"text":" and Asian commercial markets. While its base operation "},{"text":"is located in"},{"text":" Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."}]},{"paragraphFormat":{"firstLineIndent":36,"styleName":"Normal","keepWithNext":true,"keepLinesTogether":true},"inlines":[{"text":"Adventure Works Cycles, the fictitious company on which the "},{"text":"AdventureWorks"},{"text":" sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, "},{"text":"European"},{"text":" and Asian commercial markets. While its base operation "},{"text":"is located in"},{"text":" Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."}]},{"paragraphFormat":{"firstLineIndent":36,"styleName":"Normal","keepWithNext":true,"keepLinesTogether":true},"inlines":[{"text":"Adventure Works Cycles, the fictitious company on which the "},{"text":"AdventureWorks"},{"text":" sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, "},{"text":"European"},{"text":" and Asian commercial markets. While its base operation "},{"text":"is located in"},{"text":" Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."}]},{"paragraphFormat":{"firstLineIndent":36,"styleName":"Normal","keepWithNext":true,"keepLinesTogether":true},"inlines":[{"text":"Adventure Works Cycles, the fictitious company on which the "},{"text":"AdventureWorks"},{"text":" sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, "},{"text":"European"},{"text":" and Asian commercial markets. While its base operation "},{"text":"is located in"},{"text":" Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."}]},{"paragraphFormat":{"firstLineIndent":36,"afterSpacing":0,"styleName":"Normal","keepWithNext":true,"keepLinesTogether":true},"inlines":[{"text":"Adventure Works Cycles, the fictitious company on which the "},{"text":"AdventureWorks"},{"text":" sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, "},{"text":"European"},{"text":" and Asian commercial markets. While its base operation "},{"text":"is located in"},{"text":" Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."}]},{"paragraphFormat":{"firstLineIndent":36,"afterSpacing":0,"styleName":"Normal","keepWithNext":true,"keepLinesTogether":true},"inlines":[{"text":"Adventure Works Cycles, the fictitious company on which the "},{"text":"AdventureWorks"},{"text":" sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, "},{"text":"European"},{"text":" and Asian commercial markets. While its base operation "},{"text":"is located in"},{"text":" Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."}]},{"paragraphFormat":{"afterSpacing":0,"styleName":"Normal","keepWithNext":true,"keepLinesTogether":true},"inlines":[]},{"characterFormat":{"fontSize":12,"fontSizeBidi":12},"paragraphFormat":{"firstLineIndent":36,"afterSpacing":0,"styleName":"Normal","keepWithNext":true,"keepLinesTogether":true},"inlines":[{"text":"Adventure Works Cycles, the fictitious company on which the ","characterFormat":{"fontSize":12,"fontSizeBidi":12}},{"text":"AdventureWorks","characterFormat":{"fontSize":12,"fontSizeBidi":12}},{"text":" sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, ","characterFormat":{"fontSize":12,"fontSizeBidi":12}},{"text":"European","characterFormat":{"fontSize":12,"fontSizeBidi":12}},{"text":" and Asian commercial markets. While its base operation ","characterFormat":{"fontSize":12,"fontSizeBidi":12}},{"text":"is located in","characterFormat":{"fontSize":12,"fontSizeBidi":12}},{"text":" Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.","characterFormat":{"fontSize":12,"fontSizeBidi":12}}]},{"paragraphFormat":{"firstLineIndent":36,"styleName":"Normal"},"inlines":[{"text":"Adventure Works Cycles, the fictitious company on which the "},{"text":"AdventureWorks"},{"text":" sample databases are based, is a large, multinational manufacturing company. The company manufactures and "}]}],"headersFooters":{"header":{"blocks":[{"inlines":[]}]},"footer":{"blocks":[{"inlines":[]}]},"evenHeader":{"blocks":[{"inlines":[]}]},"evenFooter":{"blocks":[{"inlines":[]}]},"firstPageHeader":{"blocks":[{"inlines":[]}]},"firstPageFooter":{"blocks":[{"inlines":[]}]}},"sectionFormat":{"headerDistance":36,"footerDistance":36,"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0,"endnoteNumberFormat":"LowerCaseRoman","footNoteNumberFormat":"Arabic","restartIndexForFootnotes":"DoNotRestart","restartIndexForEndnotes":"DoNotRestart"}}],"characterFormat":{"fontSize":11,"fontFamily":"Calibri","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Character","name":"Default Paragraph Font"}],"defaultTabWidth":36,"formatting":false,"trackChanges":false,"protectionType":"NoProtection","enforcement":false,"dontUseHTMLParagraphAutoSpacing":false,"alignTablesRowByRow":false,"formFieldShading":true,"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"\\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"\\u0004"}]}],"continuationNotice":[{"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"\\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"\\u0004"}]}],"continuationNotice":[{"inlines":[]}]},"compatibilityMode":"Word2013"}';
        editor.open(content);
        expect(editor.documentHelper.pages[0].bodyWidgets[0].floatingElements.length).toBe(0);
        expect(editor.documentHelper.pages[1].bodyWidgets[0].floatingElements.length).toBe(1);
        expect((editor.documentHelper.pages[1].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets.length).toBe(5);
    });
    it('Shape affect previous paragraph', () => {
        let content: any = '{"sections":[{"blocks":[{"paragraphFormat":{"firstLineIndent":36,"styleName":"Normal"},"inlines":[{"text":"Adventure Works Cycles, the fictitious company on which the "},{"text":"AdventureWorks"},{"text":" sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, "},{"text":"European"},{"text":" and Asian commercial markets. While its base operation "},{"text":"is located in"},{"text":" Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."}]},{"paragraphFormat":{"firstLineIndent":36,"styleName":"Normal","keepWithNext":true,"keepLinesTogether":true},"inlines":[{"text":"Adventure Works Cycles, the fictitious company on which the "},{"text":"AdventureWorks"},{"text":" sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, "},{"text":"European"},{"text":" and Asian commercial markets. While its base operation "},{"text":"is located in"},{"text":" Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."}]},{"paragraphFormat":{"firstLineIndent":36,"styleName":"Normal","keepWithNext":true,"keepLinesTogether":true},"inlines":[{"shapeId":1,"name":"Rectangle 1","visible":true,"width":62.5055122,"height":37.97803,"widthScale":100,"heightScale":100,"lineFormat":{"line":true,"color":"#2F528FFF","weight":1,"lineStyle":"Solid"},"fillFormat":{"color":"#4472C4FF","fill":true},"textWrappingStyle":"Square","textWrappingType":"Both","verticalPosition":-60,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.40282347e+38,"horizontalPosition":175.6,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.40282347e+38,"zOrderPosition":251659264,"allowOverlap":true,"layoutInCell":true,"lockAnchor":false,"distanceBottom":0,"distanceLeft":9,"distanceRight":9,"distanceTop":0,"autoShapeType":"Rectangle","textFrame":{"textVerticalAlignment":"Middle","leftMargin":7.2,"rightMargin":7.2,"topMargin":3.6,"bottomMargin":3.6,"blocks":[{"inlines":[]}]}},{"text":"Adventure Works Cycles, the fictitious company on which the "},{"text":"AdventureWorks"},{"text":" sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, "},{"text":"European"},{"text":" and Asian commercial markets. While its base operation "},{"text":"is located in"},{"text":" Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."}]},{"paragraphFormat":{"firstLineIndent":36,"styleName":"Normal","keepWithNext":true,"keepLinesTogether":true},"inlines":[{"text":"Adventure Works Cycles, the fictitious company on which the "},{"text":"AdventureWorks"},{"text":" sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, "},{"text":"European"},{"text":" and Asian commercial markets. While its base operation "},{"text":"is located in"},{"text":" Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."}]},{"paragraphFormat":{"firstLineIndent":36,"styleName":"Normal","keepWithNext":true,"keepLinesTogether":true},"inlines":[{"text":"Adventure Works Cycles, the fictitious company on which the "},{"text":"AdventureWorks"},{"text":" sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, "},{"text":"European"},{"text":" and Asian commercial markets. While its base operation "},{"text":"is located in"},{"text":" Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."}]},{"paragraphFormat":{"firstLineIndent":36,"afterSpacing":0,"styleName":"Normal","keepWithNext":true,"keepLinesTogether":true},"inlines":[{"text":"Adventure Works Cycles, the fictitious company on which the "},{"text":"AdventureWorks"},{"text":" sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, "},{"text":"European"},{"text":" and Asian commercial markets. While its base operation "},{"text":"is located in"},{"text":" Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."}]},{"paragraphFormat":{"firstLineIndent":36,"afterSpacing":0,"styleName":"Normal","keepWithNext":true,"keepLinesTogether":true},"inlines":[{"text":"Adventure Works Cycles, the fictitious company on which the "},{"text":"AdventureWorks"},{"text":" sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, "},{"text":"European"},{"text":" and Asian commercial markets. While its base operation "},{"text":"is located in"},{"text":" Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."}]},{"paragraphFormat":{"afterSpacing":0,"styleName":"Normal","keepWithNext":true,"keepLinesTogether":true},"inlines":[]},{"characterFormat":{"fontSize":12,"fontSizeBidi":12},"paragraphFormat":{"firstLineIndent":36,"afterSpacing":0,"styleName":"Normal","keepWithNext":true,"keepLinesTogether":true},"inlines":[{"text":"Adventure Works Cycles, the fictitious company on which the ","characterFormat":{"fontSize":12,"fontSizeBidi":12}},{"text":"AdventureWorks","characterFormat":{"fontSize":12,"fontSizeBidi":12}},{"text":" sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, ","characterFormat":{"fontSize":12,"fontSizeBidi":12}},{"text":"European","characterFormat":{"fontSize":12,"fontSizeBidi":12}},{"text":" and Asian commercial markets. While its base operation ","characterFormat":{"fontSize":12,"fontSizeBidi":12}},{"text":"is located in","characterFormat":{"fontSize":12,"fontSizeBidi":12}},{"text":" Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.","characterFormat":{"fontSize":12,"fontSizeBidi":12}}]},{"paragraphFormat":{"firstLineIndent":36,"styleName":"Normal"},"inlines":[{"text":"Adventure Works Cycles, the fictitious company on which the "},{"text":"AdventureWorks"},{"text":" sample databases are based, is a large, multinational manufacturing company. The company manufactures and "}]},{"paragraphFormat":{"styleName":"Normal"},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"inlines":[]}]},"footer":{"blocks":[{"inlines":[]}]},"evenHeader":{"blocks":[{"inlines":[]}]},"evenFooter":{"blocks":[{"inlines":[]}]},"firstPageHeader":{"blocks":[{"inlines":[]}]},"firstPageFooter":{"blocks":[{"inlines":[]}]}},"sectionFormat":{"headerDistance":36,"footerDistance":36,"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0,"endnoteNumberFormat":"LowerCaseRoman","footNoteNumberFormat":"Arabic","restartIndexForFootnotes":"DoNotRestart","restartIndexForEndnotes":"DoNotRestart"}}],"characterFormat":{"fontSize":11,"fontFamily":"Calibri","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Character","name":"Default Paragraph Font"}],"defaultTabWidth":36,"formatting":false,"trackChanges":false,"protectionType":"NoProtection","enforcement":false,"dontUseHTMLParagraphAutoSpacing":false,"alignTablesRowByRow":false,"formFieldShading":true,"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"\\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"\\u0004"}]}],"continuationNotice":[{"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"\\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"\\u0004"}]}],"continuationNotice":[{"inlines":[]}]},"compatibilityMode":"Word2013"}';
        editor.open(content);
        expect(editor.documentHelper.pages[0].bodyWidgets[0].floatingElements.length).toBe(0);
        expect(editor.documentHelper.pages[1].bodyWidgets[0].floatingElements.length).toBe(1);
        expect((editor.documentHelper.pages[1].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets.length).toBe(6);
    });
});