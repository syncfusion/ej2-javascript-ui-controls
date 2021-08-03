import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, Page, HelperMethods, TableWidget } from '../../../src/index';
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
                                    "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."
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
                            paragraphFormat : {
                                keepLinesTogether: true
                            }
                        }
                    ],
                    "headersFooters": {
                    }
                }
            ]
        };
        editor.open( JSON.stringify(sfdt));
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
                            paragraphFormat : {
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
                            paragraphFormat : {
                                keepLinesTogether: true
                            }
                        }
                    ],
                    "headersFooters": {
                    }
                }
            ]
        };
        editor.open( JSON.stringify(sfdt));
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
                                    "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."
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
                                                "borders":{},
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
                                    "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."
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
                                                "borders":{},
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
                                    "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."
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
                                                "borders":{},
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
                                    "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."
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
                                                "borders":{},
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