/**
 * TOC dialog spec
 */
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { ParagraphWidget, FieldElementBox } from '../../../src/index';
import { TableOfContentsDialog } from '../../../src/document-editor/implementation/dialogs/index';
import { Editor } from '../../../src/index';
import { LayoutViewer, PageLayoutViewer } from '../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';

function tocJson(): string {
    let json: any = {
        "sections": [
            {
                "blocks": [
                    {
                        "paragraphFormat": {
                            "styleName": "TOC 1",
                            "tabs": [
                                {
                                    "tabJustification": "Right",
                                    "position": 467.5,
                                    "tabLeader": "Dot",
                                    "deletePosition": 0
                                }
                            ]
                        },
                        "inlines": [
                            {
                                "hasFieldEnd": true,
                                "fieldType": 0
                            },
                            {
                                "text": " TOC \\o \"1-3\" \\p \" \" \\h \\z \\u "
                            },
                            {
                                "fieldType": 2
                            },
                            {
                                "hasFieldEnd": true,
                                "fieldType": 0
                            },
                            {
                                "text": "HYPERLINK \\l \"_Toc512501388\""
                            },
                            {
                                "fieldType": 2
                            },
                            {
                                "text": "Heading1",
                                "characterFormat": {
                                    "styleName": "Hyperlink"
                                }
                            },
                            {
                                "text": " "
                            },
                            {
                                "hasFieldEnd": true,
                                "fieldType": 0
                            },
                            {
                                "text": " PAGEREF _Toc512501388 \\h "
                            },
                            {
                                "fieldType": 2
                            },
                            {
                                "text": "1"
                            },
                            {
                                "fieldType": 1
                            },
                            {
                                "fieldType": 1
                            }
                        ]
                    },
                    {
                        "paragraphFormat": {
                            "styleName": "TOC 2",
                            "tabs": [
                                {
                                    "tabJustification": "Right",
                                    "position": 467.5,
                                    "tabLeader": "Dot",
                                    "deletePosition": 0
                                }
                            ]
                        },
                        "inlines": [
                            {
                                "hasFieldEnd": true,
                                "fieldType": 0
                            },
                            {
                                "text": "HYPERLINK \\l \"_Toc512501389\""
                            },
                            {
                                "fieldType": 2
                            },
                            {
                                "text": "Head",
                                "characterFormat": {
                                    "styleName": "Hyperlink"
                                }
                            },
                            {
                                "text": "i",
                                "characterFormat": {
                                    "styleName": "Hyperlink"
                                }
                            },
                            {
                                "text": "n",
                                "characterFormat": {
                                    "styleName": "Hyperlink"
                                }
                            },
                            {
                                "text": "g 2",
                                "characterFormat": {
                                    "styleName": "Hyperlink"
                                }
                            },
                            {
                                "text": " "
                            },
                            {
                                "hasFieldEnd": true,
                                "fieldType": 0
                            },
                            {
                                "text": " PAGEREF _Toc512501389 \\h "
                            },
                            {
                                "fieldType": 2
                            },
                            {
                                "text": "1"
                            },
                            {
                                "fieldType": 1
                            },
                            {
                                "fieldType": 1
                            }
                        ]
                    },
                    {
                        "paragraphFormat": {
                            "styleName": "Normal"
                        },
                        "inlines": [
                            {
                                "fieldType": 1
                            }
                        ]
                    },
                    {
                        "paragraphFormat": {
                            "styleName": "Heading 1"
                        },
                        "inlines": [
                            {
                                "name": "_Toc512292613",
                                "bookmarkType": 0
                            },
                            {
                                "name": "_Toc512501388",
                                "bookmarkType": 0
                            },
                            {
                                "text": "Heading1"
                            },
                            {
                                "name": "_Toc512292613",
                                "bookmarkType": 1
                            },
                            {
                                "name": "_Toc512501388",
                                "bookmarkType": 1
                            }
                        ]
                    },
                    {
                        "paragraphFormat": {
                            "styleName": "Heading 2"
                        },
                        "inlines": [
                            {
                                "name": "_Toc512501389",
                                "bookmarkType": 0
                            },
                            {
                                "text": "Heading 2"
                            },
                            {
                                "name": "_Toc512501389",
                                "bookmarkType": 1
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
                "type": "Paragraph",
                "name": "Heading 1",
                "basedOn": "Normal",
                "next": "Normal",
                "link": "Heading 1 Char",
                "characterFormat": {
                    "fontSize": 16,
                    "fontFamily": "Calibri Light",
                    "fontColor": "#FF2F5496"
                },
                "paragraphFormat": {
                    "beforeSpacing": 12,
                    "afterSpacing": 0,
                    "outlineLevel": "Level1"
                }
            },
            {
                "type": "Paragraph",
                "name": "Heading 2",
                "basedOn": "Normal",
                "next": "Normal",
                "link": "Heading 2 Char",
                "characterFormat": {
                    "fontSize": 13,
                    "fontFamily": "Calibri Light",
                    "fontColor": "#FF2F5496"
                },
                "paragraphFormat": {
                    "beforeSpacing": 2,
                    "afterSpacing": 0,
                    "outlineLevel": "Level2"
                }
            },
            {
                "type": "Character",
                "name": "Default Paragraph Font"
            },
            {
                "type": "Character",
                "name": "Heading 1 Char",
                "basedOn": "Default Paragraph Font",
                "characterFormat": {
                    "fontSize": 16,
                    "fontFamily": "Calibri Light",
                    "fontColor": "#FF2F5496"
                }
            },
            {
                "type": "Paragraph",
                "name": "TOC 1",
                "basedOn": "Normal",
                "next": "Normal",
                "paragraphFormat": {
                    "afterSpacing": 5
                }
            },
            {
                "type": "Character",
                "name": "Hyperlink",
                "basedOn": "Default Paragraph Font",
                "characterFormat": {
                    "underline": "Single",
                    "fontColor": "#FF0563C1"
                }
            },
            {
                "type": "Character",
                "name": "Heading 2 Char",
                "basedOn": "Default Paragraph Font",
                "characterFormat": {
                    "fontSize": 13,
                    "fontFamily": "Calibri Light",
                    "fontColor": "#FF2F5496"
                }
            },
            {
                "type": "Paragraph",
                "name": "TOC2",
                "basedOn": "Normal",
                "next": "Normal",
                "paragraphFormat": {
                    "leftIndent": 11,
                    "afterSpacing": 5
                }
            },
            {
                "type": "Paragraph",
                "name": "TOC 2",
                "basedOn": "Normal",
                "next": "Normal",
                "paragraphFormat": {
                    "leftIndent": 11,
                    "afterSpacing": 5
                }
            }
        ]
    };
    return JSON.stringify(json);
}


describe('TOC test case validation - 2', () => {
    let editor: DocumentEditor;
    let dialog: TableOfContentsDialog;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(TableOfContentsDialog, Selection, Editor, EditorHistory);
        editor.enableEditorHistory = true;
        editor.enableTableOfContentsDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(tocJson());
        dialog = editor.tableOfContentsDialogModule
        dialog.show()
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        dialog = undefined;
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('On Insert Button testing', function () {
console.log('On Insert Button testing');
        (dialog as any).heading1.value = 1;
        (dialog as any).heading2.value = 2;
        dialog.applyTableOfContentProperties();
    });
    it('On close Button testing', function () {
console.log('On close Button testing');
        dialog.closeTableOfContentDialog();
    });
    it('On cancel Button testing', function () {
console.log('On cancel Button testing');
        dialog.onCancelButtonClick();
    });
    // it('TOC page number validation', () => {
    //     editor.open(tocJson());
    //     dialog.show();
    //     (dialog as any).showLevel.value = 2;
    //     (dialog as any).hyperlink.checked = false;
    //     (dialog as any).pageNumber.checked = true;
    //     (dialog as any).heading1.value = 1;
    //     (dialog as any).heading2.value = 2;
    //     dialog.applyTableOfContentProperties();
    //     let childWidgets: any = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0];
    //     let fieldCode: any = childWidgets.paragraph.childWidgets[0].children[5];
    //     expect(fieldCode.text).toBe(' PAGEREF_Toc512292613 \\h ');
    // });
//     it('undo and redo testing', () => {
// console.log('undo and redo testing');
//         editor.editorHistory.undo();
//         let childWidgets: any = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget).childWidgets[0];
//         let fieldCode: any = childWidgets.paragraph.childWidgets[0].children[9];
//         expect(fieldCode.text.match('PAGEREF')).not.toBe(true);
//         editor.editorHistory.redo();
//         let childWidget: any = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget).childWidgets[0];
//         let fieldCodes: any = childWidget.paragraph.childWidgets[0].children[6];
//         expect(fieldCode.text.match('PAGEREF')).not.toBe(true);
//     });
});
describe('TOC test case validation - 3', () => {
    let editor: DocumentEditor;
    let dialog: TableOfContentsDialog;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(TableOfContentsDialog, Selection, Editor, EditorHistory);
        editor.enableEditorHistory = true;
        editor.enableTableOfContentsDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(tocJson());
        dialog = editor.tableOfContentsDialogModule
        dialog.show()
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        dialog = undefined;
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    //failed case
    // it('TOC styleLevel validation', () => {
    //     (dialog as any).showLevel.value = 1;
    //     (dialog as any).hyperlink.checked = false;
    //     (dialog as any).pageNumber.checked = false;
    //     (dialog as any).rightAlign.checked = false;
    //     dialog.applyTableOfContentProperties();
    //     let childWidgets : any = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0];
    //     expect(childWidgets.paragraph.containerWidget.childWidgets.length).toBe(4);
    // })
    it('TOC hyperlink validation', () => {
console.log('TOC hyperlink validation');
        editor.open(tocJson());
        dialog.show();
        (dialog as any).showLevel.value = 1;
        (dialog as any).hyperlink.checked = true;
        (dialog as any).pageNumber.checked = false;
        (dialog as any).rightAlign.checked = false;
        (dialog as any).heading1.value = 1;
        dialog.applyTableOfContentProperties();
        let childWidgets: any = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0];
        let fieldCode: any = childWidgets.paragraph.childWidgets[0].children[4];
        expect(fieldCode.text).toBe(' HYPERLINK \\l "_Toc512292613" ');
    })
    it('reset Button validation', () => {
console.log('reset Button validation');
        editor.open(tocJson());
        dialog.show();
        (dialog as any).heading1.value = 1;
        (dialog as any).heading2.value = 2;
        (dialog as any).heading3.value = 3;
        (dialog as any).heading4.value = 4;
        (dialog as any).reset();
        expect((dialog as any).heading1.value).toBe('1');
    })
});
