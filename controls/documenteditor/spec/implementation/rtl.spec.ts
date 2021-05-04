import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../spec/test-helper.spec';

// eslint-disable-next-line max-len
import { LayoutViewer, StyleDialog, StylesDialog, FontDialog, TablePropertiesDialog, BordersAndShadingDialog, TableOptionsDialog, TableOfContentsDialog, CellOptionsDialog, ListDialog, PageSetupDialog, BookmarkDialog, DocumentHelper } from '../../src/index';
import { Editor, EditorHistory } from '../../src/index';
import { Selection, PageLayoutViewer } from '../../src/index';
/**
 * RTL Spec
 */
describe('Table Dialog testing', () => {
    let editor: DocumentEditor = undefined;
    let tablePropertiesDialog: TablePropertiesDialog;
    let borderAndShadingDialog: BordersAndShadingDialog;
    beforeAll((done) => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        // eslint-disable-next-line max-len
        DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog, BordersAndShadingDialog, EditorHistory, TableOptionsDialog, CellOptionsDialog);
        editor = new DocumentEditor({ enableRtl: true, enableSelection: true, enableEditor: true, isReadOnly: false, enableTablePropertiesDialog: true, enableBordersAndShadingDialog: true, enableEditorHistory: true, enableTableOptionsDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        tablePropertiesDialog = editor.tablePropertiesDialogModule;
        borderAndShadingDialog = editor.bordersAndShadingDialogModule;
        setTimeout(function () {
            done();
        }, 100);
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        tablePropertiesDialog.destroy();
        borderAndShadingDialog.destroy();
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Show tableProperties, tableOptions, borders and shading dialog in rtl view', () => {
console.log('Show tableProperties, tableOptions, borders and shading dialog in rtl view');
        editor.open(getJson());
        editor.showTablePropertiesDialog();
        editor.showTableOptionsDialog();
        editor.showBordersAndShadingDialog();
    });
});


describe('List Dialog testing', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ListDialog);
        // eslint-disable-next-line max-len
        editor = new DocumentEditor({ enableRtl: true, enableSelection: true, enableEditor: true, isReadOnly: false, enableListDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });

    it('Show ListDialog dialog testing in rtl view', () => {
console.log('Show ListDialog dialog testing in rtl view');
        editor.showListDialog();
        expect((editor.listDialogModule as any).target).not.toBeNull();
        expect((editor.listDialogModule as any).target).not.toBeUndefined();
    });
});


describe('Style dialog validation', () => {
    let editor: DocumentEditor;
    let styleDialog: StyleDialog;
    let stylesDialog: StylesDialog;
    let fontDialog: FontDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, StyleDialog, StylesDialog, FontDialog, EditorHistory);
        // eslint-disable-next-line max-len
        editor = new DocumentEditor({
            enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableContextMenu: true, enableStyleDialog: true, enableRtl: true, enableFontDialog: true, enableParagraphDialog: true
        });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        styleDialog = editor.styleDialogModule;
        stylesDialog = editor.stylesDialogModule;
        fontDialog = editor.fontDialogModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        styleDialog = undefined;
        stylesDialog = undefined;
        fontDialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Show style and font dialog testing in rtl view', () => {
console.log('Show style and font dialog testing in rtl view');
        editor.showFontDialog();
        editor.showStyleDialog();
        editor.showStylesDialog();
    });
});

describe('TableOfContents dialog validation', () => {
    let editor: DocumentEditor;
    let tableOfContents: TableOfContentsDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(TableOfContentsDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableRtl: true });
        editor.enableEditorHistory = true;
        editor.enableTableOfContentsDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        tableOfContents = editor.tableOfContentsDialogModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        tableOfContents = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Show toc in rtl view', () => {
console.log('Show toc in rtl view');
        editor.showTableOfContentsDialog();
    });
    it('Show toc in ltr view', function () {
console.log('Show toc in ltr view');
        editor.enableRtl = false;
        editor.showTableOfContentsDialog();
    });
});


describe('PageSetup Dialog Test Case Validation', () => {
    let editor: DocumentEditor;
    let dialog: PageSetupDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(PageSetupDialog, Selection, Editor, EditorHistory);
        // eslint-disable-next-line max-len
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableRtl: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        editor.enablePageSetupDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.pageSetupDialogModule;
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Load PageSetup Dialog testing', () => {
console.log('Load PageSetup Dialog testing');
        dialog.loadPageSetupDialog();
    });
});


describe('BookMark add validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog, EditorHistory);
        // eslint-disable-next-line max-len
        editor = new DocumentEditor({ enableEditorHistory: true, enableRtl: true, enableEditor: true, enableSelection: true, enableBookmarkDialog: true, isReadOnly: false, enableContextMenu: true, enableFontDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;

    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Bookmark dialog testing in rtl view', () => {
console.log('Bookmark dialog testing in rtl view');
        editor.showBookmarkDialog();
    });
});

function getJson() {
    let json: any = {
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
                                    "borders": {
                                        "left": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "right": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "top": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "bottom": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "vertical": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "horizontal": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalDown": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalUp": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        }
                                    }
                                },
                                "gridBeforeWidth": 0,
                                "gridAfterWidth": 0,
                                "gridBefore": 0,
                                "gridAfter": 0,
                                "cells": [
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {
                                                    "styleName": "Normal"
                                                },
                                                "inlines": []
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    },
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {
                                                    "styleName": "Normal"
                                                },
                                                "inlines": []
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    }
                                ]
                            },
                            {
                                "rowFormat": {
                                    "allowBreakAcrossPages": true,
                                    "isHeader": false,
                                    "height": 0,
                                    "heightType": "AtLeast",
                                    "borders": {
                                        "left": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "right": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "top": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "bottom": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "vertical": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "horizontal": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalDown": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalUp": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        }
                                    }
                                },
                                "gridBeforeWidth": 0,
                                "gridAfterWidth": 0,
                                "gridBefore": 0,
                                "gridAfter": 0,
                                "cells": [
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {
                                                    "styleName": "Normal"
                                                },
                                                "inlines": []
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    },
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {
                                                    "styleName": "Normal"
                                                },
                                                "inlines": []
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    }
                                ]
                            },
                            {
                                "rowFormat": {
                                    "allowBreakAcrossPages": true,
                                    "isHeader": false,
                                    "height": 0,
                                    "heightType": "AtLeast",
                                    "borders": {
                                        "left": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "right": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "top": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "bottom": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "vertical": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "horizontal": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalDown": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalUp": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        }
                                    }
                                },
                                "gridBeforeWidth": 0,
                                "gridAfterWidth": 0,
                                "gridBefore": 0,
                                "gridAfter": 0,
                                "cells": [
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {
                                                    "styleName": "Normal"
                                                },
                                                "inlines": []
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    },
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {
                                                    "styleName": "Normal"
                                                },
                                                "inlines": []
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
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
                            "borders": {
                                "left": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "right": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "top": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "bottom": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "vertical": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "horizontal": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "diagonalDown": {
                                    "lineStyle": "None",
                                    "lineWidth": 0,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "diagonalUp": {
                                    "lineStyle": "None",
                                    "lineWidth": 0,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                }
                            }
                        }
                    },
                    {
                        "paragraphFormat": {
                            "styleName": "Normal"
                        },
                        "inlines": [
                            {
                                "name": "_GoBack",
                                "bookMarkType": 0
                            },
                            {
                                "name": "_GoBack",
                                "bookMarkType": 1
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
            "fontSize": 11,
            "fontFamily": "Calibri"
        },
        "paragraphFormat": {
            "afterSpacing": 8,
            "lineSpacing": 1.0791666507720947,
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
                "type": "Character",
                "name": "Default Paragraph Font"
            },
            {
                "type": "Paragraph",
                "name": "Header",
                "basedOn": "Normal",
                "link": "Header Char",
                "paragraphFormat": {
                    "afterSpacing": 0,
                    "lineSpacing": 1,
                    "lineSpacingType": "Multiple",
                    "tabs": [
                        {
                            "tabJustification": "Centered",
                            "position": 234
                        },
                        {
                            "tabJustification": "Right",
                            "position": 468
                        }
                    ]
                }
            },
            {
                "type": "Character",
                "name": "Header Char",
                "basedOn": "Default Paragraph Font"
            },
            {
                "type": "Paragraph",
                "name": "Footer",
                "basedOn": "Normal",
                "link": "Footer Char",
                "paragraphFormat": {
                    "afterSpacing": 0,
                    "lineSpacing": 1,
                    "lineSpacingType": "Multiple",
                    "tabs": [
                        {
                            "tabJustification": "Centered",
                            "position": 234
                        },
                        {
                            "tabJustification": "Right",
                            "position": 468
                        }
                    ]
                }
            },
            {
                "type": "Character",
                "name": "Footer Char",
                "basedOn": "Default Paragraph Font"
            }
        ]
    };
    return JSON.stringify(json);
}
