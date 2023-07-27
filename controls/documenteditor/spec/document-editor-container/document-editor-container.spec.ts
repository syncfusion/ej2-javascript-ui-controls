import { DocumentEditorContainer } from '../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../src/document-editor-container/tool-bar/tool-bar';
import { createElement } from '@syncfusion/ej2-base';
import { ContextMenu } from '../../src/document-editor/implementation/context-menu';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { LineWidget, ParagraphWidget } from '../../src';
/**
 * Document Editor container
 */

describe('Document Editor container initialization', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({ showPropertiesPane: true });
        container.appendTo(element);
    });
    it('Init container with toolbar', () => {
console.log('Init container with toolbar');
        container.onPropertyChanged({}, {});
        expect(container.toolbarContainer.childNodes.length).toBeGreaterThan(0);
    });
    it('Get Persist Data', () => {
console.log('Get Persist Data');
        expect(container.getPersistData()).toBe('documenteditor-container');
    });
    it('Test control destroy 1', (done) => {
console.log('Test control destroy 1');
        let element: HTMLElement = container.element;
        
        setTimeout(function () {
            expect(function () { container.destroy(); }).not.toThrowError();
            expect(element.childNodes.length).toBe(0);
            document.body.innerHTML = '';
            element = undefined;
            container = undefined;
            done();
        }, 1000);
    });
});

describe('Property vaidation', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({ showPropertiesPane: true, enableComment: false });
        container.appendTo(element);
    });
    afterAll(() => {
        container.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        expect(() => { container.destroy(); }).not.toThrowError();
        document.body.innerHTML = '';
        element = undefined;
        container = undefined;
    });
    it('Check enable comment in DocumentEditor', (done) => {
console.log('Check enable comment in DocumentEditor');
        setTimeout(() => {
            expect(container.documentEditor.enableComment).toBe(false);
            done();
        }, 10);
    });
    it('Properties pane enable validation' , ()=> {
console.log('Properties pane enable validation');
        (container.documentEditor as any).openBlank();
        container.restrictEditing = true;
        container.showPropertiesPane = true;
        expect(container.showPropertiesPane).toBe(true);
    });
});
// describe('Restrict editing enable validation', () => {
//     let container: DocumentEditorContainer;
//     let menu: ContextMenu;
//     let element: HTMLElement;
//     beforeAll(() => {
//         element = createElement('div');
//         document.body.appendChild(element);
//         DocumentEditorContainer.Inject(Toolbar);
//         container = new DocumentEditorContainer({ restrictEditing: true, showPropertiesPane: true });
//         container.appendTo(element);
        
//     });
//     afterAll(() => {
//         container.destroy();
//         expect(element.childNodes.length).toBe(0);
//         document.body.removeChild(element);
//         expect(() => { container.destroy(); }).not.toThrowError();
//         document.body.innerHTML = '';
//         element = undefined;
//         container = undefined;
//     });
    
//     it('Restrict editing enable validation', () => {
//         console.log('Restrict editing enable validation');
//                 (container.documentEditor as any).openBlank();
//         let classele: any = document.getElementsByClassName('e-toolbar-item');
//         for (let i: number = 0; i< classele.length; i++) {
//             let ele: any =classele[i];
//             let disabled: any = ele.ariaDisabled;
//             let label: any = ele.children[0];
//             if (isNullOrUndefined(label))
//             {
//                 continue;
//             }
//             let item: any = label.ariaLabel;
//             if (item === 'New' || item === 'Open' || item ==='Find' || item === 'LocalClipboard' || item === 'RestrictEditing') {
//                 expect(disabled).toBe('false');
//             }
//             if (item === 'Undo' || item === 'Redo' || item === 'Image dropdownbutton' || item === 'Table' || item === 'Link' || item ===  'Break dropdownbutton'|| item === 'PageNumber' || item === 'PageSetup' || item === 'Footer' || item === 'FormFields' || item === 'Header' || item === 'Comments' || item === 'TrackChanges' || item === 'Bookmark' || item === 'TableOfContents' ) {
//                 expect(disabled).toBe('true');
//             }
//         }
//         expect(container.toolbarModule.propertiesPaneButton.element.parentElement.classList.contains('e-de-overlay')).toBe(true);
//                 expect(container.showPropertiesPane).toBe(false);
//             });
// });


describe('Document Editor container initialization without element id', () => {
    let container: DocumentEditorContainer;
    let container2: DocumentEditorContainer;
    let element: HTMLElement;
    let element2: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        element2 = createElement('div');
        document.body.appendChild(element);
        document.body.appendChild(element2);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({ showPropertiesPane: false });
        container.appendTo(element);
        container2 = new DocumentEditorContainer({ showPropertiesPane: false });
        container2.appendTo(element2);
    });
    afterAll(() => {
        container.destroy();
        container2.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        document.body.removeChild(element2);
        expect(() => { container.destroy(); }).not.toThrowError();
        document.body.innerHTML = '';
        element = undefined;
        container = undefined;
    });
    it('Open context menu with mutiple document editor in same page', () => {
        let event: MouseEvent = new MouseEvent('contextmenu', { clientX: 122, clientY: 156 });

        container.documentEditor.documentHelper.viewerContainer.dispatchEvent(event);
        var elements = document.getElementsByClassName('e-contextmenu-wrapper');
        for (let j: number = 0; j < elements.length; j++) {
            expect(elements[j].getElementsByClassName('e-de-copy').length).toBe(1);
        }
    });
});

let numberList: any = {
    "sections": [
        {
            "blocks": [
                {
                    "paragraphFormat": {
                        "styleName": "List Paragraph",
                        "listFormat": {
                            "listLevelNumber": 0,
                            "listId": 0
                        }
                    },
                    "inlines": [
                        {
                            "text": "Test"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "styleName": "List Paragraph",
                        "listFormat": {
                            "listLevelNumber": 1,
                            "listId": 0
                        }
                    },
                    "inlines": [
                        {
                            "text": "Test1"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "styleName": "List Paragraph",
                        "listFormat": {
                            "listLevelNumber": 1,
                            "listId": 0
                        }
                    },
                    "inlines": [
                        {
                            "text": "Test2"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "styleName": "List Paragraph",
                        "listFormat": {
                            "listLevelNumber": 0,
                            "listId": 0
                        }
                    },
                    "inlines": [
                        {
                            "text": "Tmsd"
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
                "restartIndexForEndnotes": "DoNotRestart",
                "columns": {
                    "column": [
                        {
                            "width": 468.0,
                            "space": 36.0
                        }
                    ],
                    "numberOfColumns": 1,
                    "equalWidth": true
                }
            }
        }
    ],
    "fontSubstitutionTable": {
        "DengXian": "等线",
        "DengXian Light": "等线 Light"
    },
    "characterFormat": {
        "fontSize": 11.0,
        "fontFamily": "Calibri",
        "fontSizeBidi": 11.0,
        "fontFamilyBidi": "Arial"
    },
    "paragraphFormat": {
        "afterSpacing": 8.0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple"
    },
    "lists": [
        {
            "listId": 0,
            "abstractListId": 0
        }
    ],
    "abstractLists": [
        {
            "abstractListId": 0,
            "levels": [
                {
                    "startAt": 1,
                    "restartLevel": 0,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%1.",
                    "paragraphFormat": {
                        "leftIndent": 36.0,
                        "firstLineIndent": -18.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 1,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%2.1",
                    "paragraphFormat": {
                        "leftIndent": 72.0,
                        "firstLineIndent": -18.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 2,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%3.",
                    "paragraphFormat": {
                        "leftIndent": 108.0,
                        "firstLineIndent": -9.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 3,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%4.",
                    "paragraphFormat": {
                        "leftIndent": 144.0,
                        "firstLineIndent": -18.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 4,
                    "listLevelPattern": "LowLetter",
                    "followCharacter": "Tab",
                    "numberFormat": "%5.",
                    "paragraphFormat": {
                        "leftIndent": 180.0,
                        "firstLineIndent": -18.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 5,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%6.",
                    "paragraphFormat": {
                        "leftIndent": 216.0,
                        "firstLineIndent": -9.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 6,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%7.",
                    "paragraphFormat": {
                        "leftIndent": 252.0,
                        "firstLineIndent": -18.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 7,
                    "listLevelPattern": "LowLetter",
                    "followCharacter": "Tab",
                    "numberFormat": "%8.",
                    "paragraphFormat": {
                        "leftIndent": 288.0,
                        "firstLineIndent": -18.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 8,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%9.",
                    "paragraphFormat": {
                        "leftIndent": 324.0,
                        "firstLineIndent": -9.0
                    }
                }
            ]
        }
    ],
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
            "name": "List Paragraph",
            "basedOn": "Normal",
            "next": "List Paragraph",
            "paragraphFormat": {
                "leftIndent": 36.0,
                "contextualSpacing": true
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
                "inlines": [
                    {
                        "text": "\u0003"
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
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
                "inlines": [
                    {
                        "text": "\u0003"
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
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
    "compatibilityMode": "Word2013"
};
let listAlignmentDoc: any = {
    "sections": [
        {
            "blocks": [
                {
                    "paragraphFormat": {
                        "leftIndent": 18.0,
                        "styleName": "List Paragraph",
                        "listFormat": {
                            "listLevelNumber": 0,
                            "listId": 0
                        }
                    },
                    "inlines": [
                        {
                            "text": "Test1"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "leftIndent": 18.0,
                        "styleName": "List Paragraph",
                        "listFormat": {
                            "listLevelNumber": 1,
                            "listId": 0
                        }
                    },
                    "inlines": [
                        {
                            "text": "Test11"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "leftIndent": 18.0,
                        "styleName": "List Paragraph",
                        "listFormat": {
                            "listLevelNumber": 1,
                            "listId": 0
                        }
                    },
                    "inlines": [
                        {
                            "text": "Test22"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "leftIndent": 18.0,
                        "styleName": "List Paragraph",
                        "listFormat": {
                            "listLevelNumber": 0,
                            "listId": 0
                        }
                    },
                    "inlines": [
                        {
                            "text": "Test2"
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
                "restartIndexForEndnotes": "DoNotRestart",
                "columns": {
                    "column": [
                        {
                            "width": 468.0,
                            "space": 36.0
                        }
                    ],
                    "numberOfColumns": 1,
                    "equalWidth": true
                }
            }
        }
    ],
    "fontSubstitutionTable": {
        "DengXian": "等线",
        "DengXian Light": "等线 Light"
    },
    "characterFormat": {
        "fontSize": 11.0,
        "fontFamily": "Calibri",
        "fontSizeBidi": 11.0,
        "fontFamilyBidi": "Arial"
    },
    "paragraphFormat": {
        "afterSpacing": 8.0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple"
    },
    "lists": [
        {
            "listId": 0,
            "abstractListId": 0
        }
    ],
    "abstractLists": [
        {
            "abstractListId": 0,
            "levels": [
                {
                    "startAt": 1,
                    "restartLevel": 0,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%1.",
                    "paragraphFormat": {
                        "leftIndent": 36.0,
                        "firstLineIndent": -18.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 1,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%2.1",
                    "paragraphFormat": {
                        "leftIndent": 72.0,
                        "firstLineIndent": -18.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 2,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%3.",
                    "paragraphFormat": {
                        "leftIndent": 108.0,
                        "firstLineIndent": -9.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 3,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%4.",
                    "paragraphFormat": {
                        "leftIndent": 144.0,
                        "firstLineIndent": -18.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 4,
                    "listLevelPattern": "LowLetter",
                    "followCharacter": "Tab",
                    "numberFormat": "%5.",
                    "paragraphFormat": {
                        "leftIndent": 180.0,
                        "firstLineIndent": -18.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 5,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%6.",
                    "paragraphFormat": {
                        "leftIndent": 216.0,
                        "firstLineIndent": -9.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 6,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%7.",
                    "paragraphFormat": {
                        "leftIndent": 252.0,
                        "firstLineIndent": -18.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 7,
                    "listLevelPattern": "LowLetter",
                    "followCharacter": "Tab",
                    "numberFormat": "%8.",
                    "paragraphFormat": {
                        "leftIndent": 288.0,
                        "firstLineIndent": -18.0
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 8,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%9.",
                    "paragraphFormat": {
                        "leftIndent": 324.0,
                        "firstLineIndent": -9.0
                    }
                }
            ]
        }
    ],
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
            "name": "List Paragraph",
            "basedOn": "Normal",
            "next": "List Paragraph",
            "paragraphFormat": {
                "leftIndent": 36.0,
                "contextualSpacing": true
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
                "inlines": [
                    {
                        "text": "\u0003"
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
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
                "inlines": [
                    {
                        "text": "\u0003"
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
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
    "compatibilityMode": "Word2013"
};
describe('Apply Numbered List', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({ showPropertiesPane: true, enableComment: false });
        container.appendTo(element);
    });
    afterAll(() => {
        container.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        expect(() => { container.destroy(); }).not.toThrowError();
        document.body.innerHTML = '';
        element = undefined;
        container = undefined;
    });
    it('Apply Numbered List' , ()=> {
        container.documentEditor.open(JSON.stringify(numberList));
        container.documentEditor.selection.select('0;1;2','0;1;2');
        container.tableProperties.tableTextProperties.paragraph.appliedNumberingStyle = 'lowletter';
        container.tableProperties.tableTextProperties.paragraph.applyLastAppliedNumbering();
        expect(container.documentEditor.documentHelper.lists[0].abstractList.levels[1].numberFormat).toBe('%2.');
    });
    it('List Alignment issues', () => {
        container.documentEditor.open(JSON.stringify(listAlignmentDoc));
        let para: ParagraphWidget = container.documentEditor.documentHelper.pages[0].bodyWidgets[0].childWidgets[2] as ParagraphWidget;
        let line: LineWidget = para.childWidgets[0] as LineWidget;
        const elementWidth: number = line.children[0].width + line.children[1].width;
        container.documentEditor.selection.select('0;1;3', '0;1;3');
        container.tableProperties.tableTextProperties.paragraph.appliedNumberingStyle = 'lowletter';
        container.tableProperties.tableTextProperties.paragraph.applyLastAppliedNumbering();
        expect(elementWidth).toBe(line.children[0].width + line.children[1].width);
    });
});

describe('Show/Hide properties pane tooltip validation', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({ showPropertiesPane: false });
        container.appendTo(element);
    });
    it('Show/Hide properties pane tooltip validation', () => {
    console.log('Show/Hide properties pane tooltip validation');
        let element : HTMLButtonElement= container.toolbarContainer.childNodes[1].childNodes[0] as HTMLButtonElement;
        expect(element.title).toBe('Show properties pane');
    });
});

describe("insertText API validation when restrictEditing is enabled", () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({ showPropertiesPane: false });
        container.appendTo(element);
    });
    afterAll(() => {
        container.destroy();
        document.body.removeChild(element);
        document.body.innerHTML = '';
        element = undefined;
        container = undefined;
    });
    it("insertText API validation when restrictEditing is enabled", () => {
        console.log("insertText API validation when restrictEditing is enabled");
        container.restrictEditing = true;
        setTimeout(function () {
            container.documentEditor.editor.insertText("Hello");
            expect(container.documentEditor.selection.start.currentWidget.children.length).toBe(0);
        });
    });
});
describe("getStyles api validation for pargraph Format", () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({ showPropertiesPane: false });
        container.appendTo(element);
    });
    afterAll(() => {
        container.destroy();
        document.body.removeChild(element);
        document.body.innerHTML = '';
        element = undefined;
        container = undefined;
    });
    it("getStyles api validation", () => {
        container.documentEditor.openBlank();
        const style = (container.documentEditor.getStyles('Paragraph')[0] as any).style;
        console.log(style);
        const exptectedStyle = '{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"spaceBeforeAuto":false,"spaceAfterAuto":false,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"BodyText","bidi":false,"keepLinesTogether":false,"keepWithNext":false,"contextualSpacing":false,"widowControl":true},"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false,"localeIdBidi":0,"complexScript":false}}';
        expect(style).toEqual(exptectedStyle);
    });
});