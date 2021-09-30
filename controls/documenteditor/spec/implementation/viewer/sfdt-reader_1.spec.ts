import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { DocumentHelper } from '../../../src/document-editor/implementation/viewer/viewer';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { ParagraphWidget, LineWidget, BlockWidget, FootnoteElementBox, ShapeElementBox, ShapeBase, ElementBox } from '../../../src/document-editor/implementation/viewer/page';
import { FootnoteType, WSectionFormat, FootnoteRestartIndex, FootEndNoteNumberFormat } from '../../../src';
import { FieldTextElementBox } from '../../../src';

let footendNoteJson: any = {
    "sections": [
        {
            "blocks": [
                {
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "Hello",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "footnoteType": "Endnote",
                            "markerCharacterFormat": {
                                "fontColor": "empty",
                                "styleName": "Endnote Reference"
                            },
                            "blocks": [
                                {
                                    "characterFormat": {
                                        "fontColor": "empty"
                                    },
                                    "paragraphFormat": {
                                        "styleName": "Endnote Text"
                                    },
                                    "inlines": [
                                        {
                                            "text": "\u0002",
                                            "characterFormat": {
                                                "fontColor": "empty",
                                                "styleName": "Endnote Reference"
                                            }
                                        },
                                        {
                                            "text": " Hello endnote",
                                            "characterFormat": {
                                                "fontColor": "empty"
                                            }
                                        }
                                    ]
                                }
                            ],
                            "symbolCode": 0,
                            "symbolFontName": "Symbol"
                        },
                        {
                            "text": " have a nice day",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "footnoteType": "Footnote",
                            "markerCharacterFormat": {
                                "fontColor": "empty",
                                "styleName": "Footnote Reference"
                            },
                            "blocks": [
                                {
                                    "characterFormat": {
                                        "fontColor": "empty"
                                    },
                                    "paragraphFormat": {
                                        "styleName": "Footnote Text"
                                    },
                                    "inlines": [
                                        {
                                            "text": "\u0002",
                                            "characterFormat": {
                                                "fontColor": "empty",
                                                "styleName": "Footnote Reference"
                                            }
                                        },
                                        {
                                            "text": " Nice day endnote",
                                            "characterFormat": {
                                                "fontColor": "empty"
                                            }
                                        }
                                    ]
                                }
                            ],
                            "symbolCode": 0,
                            "symbolFontName": "Symbol"
                        }
                    ]
                }
            ],
            "headersFooters": {},
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
                "restartPageNumbering": false,
                "pageStartingNumber": 0,
                "footnotePosition": "PrintImmediatelyBeneathText",
                "endnotePosition": "DisplayEndOfDocument",
                "endnoteNumberFormat": "Arabic",
                "footNoteNumberFormat": "UpperCaseLetter",
                "restartIndexForFootnotes": "RestartForEachPage",
                "restartIndexForEndnotes": "RestartForEachSection"
            }
        }
    ],
    "characterFormat": {
        "fontSize": 11.0,
        "fontFamily": "Calibri",
        "fontColor": "empty",
        "fontSizeBidi": 11.0,
        "fontFamilyBidi": "Arial"
    },
    "paragraphFormat": {
        "afterSpacing": 8.0,
        "lineSpacing": 1.0791666507720948,
        "lineSpacingType": "Multiple"
    },
    "background": {
        "color": "#FFFFFFFF"
    },
    "styles": [
        {
            "type": "Paragraph",
            "name": "Normal",
            "next": "Normal",
            "characterFormat": {
                "fontColor": "empty"
            }
        },
        {
            "type": "Character",
            "name": "Default Paragraph Font",
            "characterFormat": {
                "fontColor": "empty"
            }
        },
        {
            "type": "Paragraph",
            "name": "Footnote Text",
            "basedOn": "Normal",
            "next": "Footnote Text",
            "link": "Footnote Text Char",
            "characterFormat": {
                "fontSize": 10.0,
                "fontColor": "empty",
                "fontSizeBidi": 10.0
            },
            "paragraphFormat": {
                "afterSpacing": 0.0,
                "lineSpacing": 1.0,
                "lineSpacingType": "Multiple"
            }
        },
        {
            "type": "Character",
            "name": "Footnote Text Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontSize": 10.0,
                "fontColor": "empty",
                "fontSizeBidi": 10.0
            }
        },
        {
            "type": "Character",
            "name": "Footnote Reference",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "baselineAlignment": "Superscript",
                "fontColor": "empty"
            }
        },
        {
            "type": "Paragraph",
            "name": "Endnote Text",
            "basedOn": "Normal",
            "next": "Endnote Text",
            "link": "Endnote Text Char",
            "characterFormat": {
                "fontSize": 10.0,
                "fontColor": "empty",
                "fontSizeBidi": 10.0
            },
            "paragraphFormat": {
                "afterSpacing": 0.0,
                "lineSpacing": 1.0,
                "lineSpacingType": "Multiple"
            }
        },
        {
            "type": "Character",
            "name": "Endnote Text Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontSize": 10.0,
                "fontColor": "empty",
                "fontSizeBidi": 10.0
            }
        },
        {
            "type": "Character",
            "name": "Endnote Reference",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "baselineAlignment": "Superscript",
                "fontColor": "empty"
            }
        },
        {
            "type": "Paragraph",
            "name": "Header",
            "basedOn": "Normal",
            "next": "Header",
            "link": "Header Char",
            "characterFormat": {
                "fontColor": "empty"
            },
            "paragraphFormat": {
                "afterSpacing": 0.0,
                "lineSpacing": 1.0,
                "lineSpacingType": "Multiple",
                "tabs": [
                    {
                        "tabJustification": "Center",
                        "position": 234.0,
                        "tabLeader": "None",
                        "deletePosition": 0.0
                    },
                    {
                        "tabJustification": "Right",
                        "position": 468.0,
                        "tabLeader": "None",
                        "deletePosition": 0.0
                    }
                ]
            }
        },
        {
            "type": "Character",
            "name": "Header Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontColor": "empty"
            }
        },
        {
            "type": "Paragraph",
            "name": "Footer",
            "basedOn": "Normal",
            "next": "Footer",
            "link": "Footer Char",
            "characterFormat": {
                "fontColor": "empty"
            },
            "paragraphFormat": {
                "afterSpacing": 0.0,
                "lineSpacing": 1.0,
                "lineSpacingType": "Multiple",
                "tabs": [
                    {
                        "tabJustification": "Center",
                        "position": 234.0,
                        "tabLeader": "None",
                        "deletePosition": 0.0
                    },
                    {
                        "tabJustification": "Right",
                        "position": 468.0,
                        "tabLeader": "None",
                        "deletePosition": 0.0
                    }
                ]
            }
        },
        {
            "type": "Character",
            "name": "Footer Char",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontColor": "empty"
            }
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
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "afterSpacing": 0.0,
                    "lineSpacing": 1.0,
                    "lineSpacingType": "Multiple",
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0003",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "afterSpacing": 0.0,
                    "lineSpacing": 1.0,
                    "lineSpacingType": "Multiple",
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0004",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ]
    },
    "endnotes": {
        "separator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "afterSpacing": 0.0,
                    "lineSpacing": 1.0,
                    "lineSpacingType": "Multiple",
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0003",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "afterSpacing": 0.0,
                    "lineSpacing": 1.0,
                    "lineSpacingType": "Multiple",
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0004",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ]
    }
};

let shapeJson: any = {
    "sections": [
        {
            "blocks": [
                {
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "shapeId": 1,
                            "name": "Text Box 1",
                            "alternativeText": null,
                            "title": null,
                            "visible": true,
                            "width": 60.92307,
                            "height": 33.7846451,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "lineFormatType": "Solid",
                                "color": "#000000FF",
                                "weight": 0.5,
                                "lineStyle": "Solid"
                            },
                            "fillFormat": {
                                "color": "#FFFFFFFF",
                                "fill": true
                            },
                            "verticalPosition": 2.17,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 36.51,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251659264,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "textWrappingStyle": "Square",
                            "textWrappingType": "Both",
                            "distanceBottom": 0.0,
                            "distanceLeft": 9.0,
                            "distanceRight": 9.0,
                            "distanceTop": 0.0,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 7.2,
                                "rightMargin": 7.2,
                                "topMargin": 3.6,
                                "bottomMargin": 3.6,
                                "blocks": [
                                    {
                                        "characterFormat": {
                                            "fontColor": "empty"
                                        },
                                        "paragraphFormat": {
                                            "styleName": "Normal"
                                        },
                                        "inlines": [
                                            {
                                                "text": "Square",
                                                "characterFormat": {
                                                    "fontColor": "empty"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "text": "Test Doc",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "shapeId": 2,
                            "name": "Text Box 2",
                            "alternativeText": null,
                            "title": null,
                            "visible": true,
                            "width": 91.38457,
                            "height": 43.7538567,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "lineFormatType": "Solid",
                                "color": "#000000FF",
                                "weight": 0.5,
                                "lineStyle": "Solid"
                            },
                            "fillFormat": {
                                "color": "#FFFFFFFF",
                                "fill": true
                            },
                            "verticalPosition": 6.85,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 156.18,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251660288,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "textWrappingStyle": "TopAndBottom",
                            "textWrappingType": "Both",
                            "distanceBottom": 0.0,
                            "distanceLeft": 9.0,
                            "distanceRight": 9.0,
                            "distanceTop": 0.0,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 7.2,
                                "rightMargin": 7.2,
                                "topMargin": 3.6,
                                "bottomMargin": 3.6,
                                "blocks": [
                                    {
                                        "characterFormat": {
                                            "fontColor": "empty"
                                        },
                                        "paragraphFormat": {
                                            "styleName": "Normal"
                                        },
                                        "inlines": [
                                            {
                                                "text": "Top & bottom",
                                                "characterFormat": {
                                                    "fontColor": "empty"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "text": "Test Top and Bottom",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "shapeId": 3,
                            "name": "Text Box 3",
                            "alternativeText": null,
                            "title": null,
                            "visible": true,
                            "width": 70.89228,
                            "height": 29.9077168,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "lineFormatType": "Solid",
                                "color": "#000000FF",
                                "weight": 0.5,
                                "lineStyle": "Solid"
                            },
                            "fillFormat": {
                                "color": "#FFFFFFFF",
                                "fill": true
                            },
                            "verticalPosition": 7.8,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 63.63,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251661312,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "textWrappingStyle": "Tight",
                            "textWrappingType": "Both",
                            "distanceBottom": 0.0,
                            "distanceLeft": 9.0,
                            "distanceRight": 9.0,
                            "distanceTop": 0.0,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 7.2,
                                "rightMargin": 7.2,
                                "topMargin": 3.6,
                                "bottomMargin": 3.6,
                                "blocks": [
                                    {
                                        "characterFormat": {
                                            "fontColor": "empty"
                                        },
                                        "paragraphFormat": {
                                            "styleName": "Normal"
                                        },
                                        "inlines": [
                                            {
                                                "text": "Tight",
                                                "characterFormat": {
                                                    "fontColor": "empty"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "text": "Tight",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        }
                    ]
                }
            ],
            "headersFooters": {},
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
                "restartPageNumbering": false,
                "pageStartingNumber": 0,
                "endnoteNumberFormat": "LowerCaseRoman",
                "footNoteNumberFormat": "Arabic",
                "restartIndexForFootnotes": "DoNotRestart",
                "restartIndexForEndnotes": "DoNotRestart"
            }
        }
    ],
    "characterFormat": {
        "fontSize": 11.0,
        "fontFamily": "Calibri",
        "fontColor": "empty",
        "fontSizeBidi": 11.0,
        "fontFamilyBidi": "Arial"
    },
    "paragraphFormat": {
        "afterSpacing": 8.0,
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
            "next": "Normal",
            "characterFormat": {
                "fontColor": "empty"
            }
        },
        {
            "type": "Character",
            "name": "Default Paragraph Font",
            "characterFormat": {
                "fontColor": "empty"
            }
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
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0003",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0004",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ]
    },
    "endnotes": {
        "separator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0003",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0004",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ]
    }
};

describe('Content Control Validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let blocks: BlockWidget[];
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(footendNoteJson);
        blocks = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets as ParagraphWidget[];
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 500);
    });
    // it('Inline footnote', () => {
    //     console.log('Inline footnote');
    //     let footnoteTypes: FootnoteType = 'Endnote';
    //     let code: any = 0;
    //     expect(((blocks[0].childWidgets[0] as LineWidget).children[1] as FootnoteElementBox).footnoteType).toBe(footnoteTypes);
    //     expect(((blocks[0].childWidgets[0] as LineWidget).children[1] as FootnoteElementBox).symbolFontName).toBe('Symbol');
    //     expect(((blocks[0].childWidgets[0] as LineWidget).children[1] as FootnoteElementBox).symbolCode).toBe(code);
    //     expect(((blocks[0].childWidgets[0] as LineWidget).children[1] as FootnoteElementBox).customMarker).toBe(undefined);
    //     expect(((blocks[0].childWidgets[0] as LineWidget).children[1] as FootnoteElementBox).blocks.length >= 1).toBe(true)
    // });
    // it('footnote in section format', () => {
    //     console.log('footnote in section format');
    //     let section: WSectionFormat = editor.documentHelper.pages[0].bodyWidgets[0].sectionFormat;
    //     let endNoteFormat: FootEndNoteNumberFormat = 'Arabic';
    //     let footNoteFormat: FootEndNoteNumberFormat = 'UpperCaseLetter';
    //     let endNoteRestartIndex: FootnoteRestartIndex = 'RestartForEachSection';
    //     let footNoteRestartIndex: FootnoteRestartIndex = 'RestartForEachPage';
    //     expect(section.endnoteNumberFormat).toBe(endNoteFormat);
    //     expect(section.footNoteNumberFormat).toBe(footNoteFormat);
    //     expect(section.restartIndexForEndnotes).toBe(endNoteRestartIndex);
    //     expect(section.restartIndexForFootnotes).toBe(footNoteRestartIndex);
    // });
    // it('footnote in document', () => {
    //     expect(editor.documentHelper.footnotes.continuationSeparator.length >= 1).toBe(true);
    //     expect(editor.documentHelper.footnotes.separator.length >= 1).toBe(true);
    // });
    // it('endnotes in document', () => {
    //     expect(editor.documentHelper.endnotes.continuationSeparator.length >= 1).toBe(true);
    //     expect(editor.documentHelper.endnotes.separator.length >= 1).toBe(true);
    // });
});



describe('Shape Validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let para: ParagraphWidget[];
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(shapeJson);
        para = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets as ParagraphWidget[];
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 500);
    });
    it('Square, TopAndBottom, Tight Shape', () => {
        let shape1: ShapeBase = para[0].floatingElements[0];
        let shape2: ShapeBase = para[1].floatingElements[0];
        let shape3: ShapeBase = para[2].floatingElements[0];
        expect(shape1.textWrappingStyle).toBe('Square');
        expect(shape1.textWrappingType).toBe('Both');
        expect(shape1.distanceBottom).toBe(0.0);
        expect(shape1.distanceLeft).toBe(12.0);
        expect(shape1.distanceRight).toBe(12.0);
        expect(shape1.distanceTop).toBe(0.0);

        expect(shape2.textWrappingStyle).toBe('TopAndBottom');
        expect(shape2.textWrappingType).toBe('Both');

        expect(shape3.textWrappingStyle).toBe('Tight');
        expect(shape3.textWrappingType).toBe('Both');
    });
});
let footer: any = {
    "sections": [
        {
            "blocks": [
                {
                    "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontSize": 11,
                        "fontColor": "empty",
                        "fontSizeBidi": 11
                    },
                    "inlines": []
                }
            ],
            "headersFooters": {
                "footer": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "textAlignment": "Center",
                                "styleName": "Footer",
                                "listFormat": {}
                            },
                            "characterFormat": {
                                "fontSize": 8,
                                "fontColor": "empty",
                                "fontSizeBidi": 8
                            },
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "fontSize": 8,
                                        "fontColor": "empty",
                                        "styleName": "Page Number",
                                        "fontSizeBidi": 8
                                    },
                                    "text": "Page "
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 8,
                                        "fontColor": "empty",
                                        "styleName": "Page Number",
                                        "fontSizeBidi": 8
                                    },
                                    "fieldType": 0,
                                    "hasFieldEnd": true
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 8,
                                        "fontColor": "empty",
                                        "styleName": "Page Number",
                                        "fontSizeBidi": 8
                                    },
                                    "text": " PAGE  \\* Arabic  \\* MERGEFOR"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 8,
                                        "fontColor": "empty",
                                        "styleName": "Page Number",
                                        "fontSizeBidi": 8
                                    },
                                    "text": "MAT "
                                },
                                {
                                    "characterFormat": {},
                                    "fieldType": 2
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 8,
                                        "fontColor": "empty",
                                        "styleName": "Page Number",
                                        "fontSizeBidi": 8
                                    },
                                    "text": "1"
                                },
                                {
                                    "characterFormat": {},
                                    "fieldType": 1
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 8,
                                        "fontColor": "empty",
                                        "styleName": "Page Number",
                                        "fontSizeBidi": 8
                                    },
                                    "text": " of "
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 8,
                                        "fontColor": "empty",
                                        "styleName": "Page Number",
                                        "fontSizeBidi": 8
                                    },
                                    "fieldType": 0,
                                    "hasFieldEnd": true
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 8,
                                        "fontColor": "empty",
                                        "styleName": "Page Number",
                                        "fontSizeBidi": 8
                                    },
                                    "text": " NUMP"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 8,
                                        "fontColor": "empty",
                                        "styleName": "Page Number",
                                        "fontSizeBidi": 8
                                    },
                                    "text": "AG"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 8,
                                        "fontColor": "empty",
                                        "styleName": "Page Number",
                                        "fontSizeBidi": 8
                                    },
                                    "text": "ES  \\* Arabic  \\* MERGEFORMAT "
                                },
                                {
                                    "characterFormat": {},
                                    "fieldType": 2
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 8,
                                        "fontColor": "empty",
                                        "styleName": "Page Number",
                                        "fontSizeBidi": 8
                                    },
                                    "text": "8"
                                },
                                {
                                    "characterFormat": {},
                                    "fieldType": 1
                                }
                            ]
                        }
                    ]
                }
            }
        }
    ]
};
describe('Page number validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let para: ParagraphWidget[];
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(footer);
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 500);
    });
    it('Page number validaton', () => {
        let element: ElementBox = ((editor.documentHelper.pages[0].footerWidget.childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[5];
        expect((element as any).text).toBe('1');
    });
});