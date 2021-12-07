import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, Page, HelperMethods, DocumentHelper, ParagraphWidget, LineWidget, TextElementBox, WebLayoutViewer } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';

/**
 * Editor Spec
 */

describe('Position editable div on', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            document.body.innerHTML = '';
            done();
        }, 750);
    });
    it('IME start event', (done: DoneFn) => {
console.log('IME start event');
        editor.editor.insertText('Syncfusion Software ');
        expect(editor.documentHelper.iframe.getAttribute('style')).toBe('pointer-events:none;position:absolute;left:0px;top:0px;outline:none;background-color:transparent;width:0px;height:0px;overflow:hidden');
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionstart', true, true);
        editor.documentHelper.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.documentHelper.iframe.getAttribute('style')).not.toBe('pointer-events:none;position:absolute;left:0px;top:0px;outline:none;background-color:transparent;width:0px;height:0px;overflow:hidden');
            let left: string = editor.documentHelper.iframe.style.left;
            let page: Page = editor.selection.start.paragraph.bodyWidget.page;
            let marginLeft: number = HelperMethods.convertPointToPixel(editor.selection.start.paragraph.bodyWidget.sectionFormat.leftMargin);
            expect(parseFloat(left.substring(0, left.length - 1))).toBe(page.boundingRectangle.x + marginLeft);

            let top: string = editor.documentHelper.iframe.style.top;
            let pageTop: number = page.boundingRectangle.y;
            expect(parseFloat(top.substring(0, top.length - 1))).toBe(pageTop + editor.selection.start.location.y);
            done();
        }, 10);
    });
    //TODO
    // it('IME start end', (done: DoneFn) => {
    //     let event: CompositionEvent = document.createEvent('CompositionEvent');
    //     event.initEvent('compositionend', true, true);
    //     editor.documentHelper.editableDiv.dispatchEvent(event);
    //     setTimeout(() => {
    //         expect(editor.documentHelper.iframe.getAttribute('style')).toBe('pointer-events:none;position:absolute;left:' + editor.documentHelper.containerLeft + 'px;top:' + editor.documentHelper.containerTop + 'px;outline:none;background-color:transparent;width:0px;height:0px;overflow:hidden');
    //         done();
    //     });
    // });
});

describe('IME Text processing with History', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 750);
    });
    it('Trigger Composition start event validation', () => {
console.log('Trigger Composition start event validation');
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionstart', true, true);
        editor.documentHelper.editableDiv.dispatchEvent(event);
        expect(editor.documentHelper.isComposingIME).toBe(true);
    });
    it('Composition Update event', (done: DoneFn) => {
console.log('Composition Update event');
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.documentHelper.editableDiv.innerText = 'S';
        editor.documentHelper.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('S');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition Update event 2', (done: DoneFn) => {
console.log('Composition Update event 2');
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.documentHelper.editableDiv.innerText = 'Sy';
        editor.documentHelper.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('Sy');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition Update event 3', (done: DoneFn) => {
console.log('Composition Update event 3');
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.documentHelper.editableDiv.innerText = 'Syncfusion';
        editor.documentHelper.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('Syncfusion');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
//     it('Composition end event', () => {
// console.log('Composition end event');
//         let event: CompositionEvent = document.createEvent('CompositionEvent');
//         event.initEvent('compositionend', true, true);
//         editor.documentHelper.editableDiv.dispatchEvent(event);
//         expect(editor.selection.text).toBe('');
//         expect(editor.selection.isEmpty).toBe(true);
//         expect(editor.documentHelper.isComposingIME).toBe(false);
//         expect(editor.editorHistory.undoStack.length).toBe(1);
//     });
//     it('Undo IME Text', () => {
// console.log('Undo IME Text');
//         editor.editorHistory.undo();
//         expect(editor.selection.start.paragraph.isEmpty()).toBe(true);
//         expect(editor.selection.start.offset).toBe(0);
//     });
//     it('Redo IME text', () => {
// console.log('Redo IME text');
//         editor.editorHistory.redo();
//         expect(editor.selection.start.paragraph.isEmpty()).toBe(false);
//         expect(editor.selection.isEmpty).toBe(true);
//         expect(editor.selection.start.offset).toBe(10);
//     });
});

describe('IME Text processing without History', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
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
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 750);
    });
    it('Trigger Composition start event validation', () => {
console.log('Trigger Composition start event validation');
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionstart', true, true);
        editor.documentHelper.editableDiv.dispatchEvent(event);
        expect(editor.documentHelper.isComposingIME).toBe(true);
    });
    it('Composition Update event', (done: DoneFn) => {
console.log('Composition Update event');
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.documentHelper.editableDiv.innerText = 'S';
        editor.documentHelper.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('S');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition Update event 2', (done: DoneFn) => {
console.log('Composition Update event 2');
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.documentHelper.editableDiv.innerText = 'Sy';
        editor.documentHelper.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('Sy');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition Update event 3', (done: DoneFn) => {
console.log('Composition Update event 3');
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.documentHelper.editableDiv.innerText = 'Syncfusion';
        editor.documentHelper.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('Syncfusion');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition end event', () => {
console.log('Composition end event');
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionend', true, true);
        editor.documentHelper.editableDiv.dispatchEvent(event);
        expect(editor.selection.text).toBe('');
        expect(editor.selection.isEmpty).toBe(true);
        expect(editor.documentHelper.isComposingIME).toBe(false);
    });
});

describe('Composition event on Device validation', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 750);
    });
    it('Composition updated without start', () => {
console.log('Composition updated without start');
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.documentHelper.editableDiv.dispatchEvent(event);
        expect(editor.documentHelper.isComposingIME).toBe(false);
        expect(editor.selection.isEmpty).toBe(true);
    });
    it('IME start end', () => {
console.log('IME start end');
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionend', true, true);
        editor.documentHelper.editableDiv.dispatchEvent(event);
        expect(editor.documentHelper.isComposingIME).toBe(false);
        expect(editor.selection.isEmpty).toBe(true);
        expect(editor.editorHistory.undoStack).toBeUndefined();
    });
});

describe('Composition event cancel by undo operation', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 750);
    });
    it('Trigger Composition start event validation', () => {
console.log('Trigger Composition start event validation');
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionstart', true, true);
        editor.documentHelper.editableDiv.dispatchEvent(event);
        expect(editor.documentHelper.isComposingIME).toBe(true);
    });
    it('Composition Update event', (done: DoneFn) => {
console.log('Composition Update event');
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.documentHelper.editableDiv.innerText = 'S';
        editor.documentHelper.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('S');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition Update event 2', (done: DoneFn) => {
console.log('Composition Update event 2');
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.documentHelper.editableDiv.innerText = 'S';
        editor.documentHelper.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('S');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition end event', () => {
console.log('Composition end event');
        // Composition event end on undo operation update empty string in editable div
        editor.documentHelper.editableDiv.innerText = '';
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionend', true, true);
        editor.documentHelper.editableDiv.dispatchEvent(event);
        expect(editor.selection.text).toBe('');
        expect(editor.selection.isEmpty).toBe(true);
        expect(editor.documentHelper.isComposingIME).toBe(false);
        expect(editor.editorHistory.redoStack.length).toBe(0);
    });
});

let authorColorSfdt: any = {
    "sections": [
        {
            "blocks": [
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "Test",
                            "characterFormat": {
                                "fontSize": 10.0,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 10.0,
                                "fontFamilyBidi": "Arial"
                            },
                            "revisionIds": [
                                "4b228d11-12e3-4e3a-9f4d-363045e5036b"
                            ]
                        },
                        {
                            "text": "Test",
                            "characterFormat": {
                                "fontSize": 10.0,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 10.0,
                                "fontFamilyBidi": "Arial"
                            },
                            "revisionIds": [
                                "41717215-af68-45d0-8e74-1541a4b3aa80"
                            ]
                        },
                        {
                            "text": "Test",
                            "characterFormat": {
                                "fontSize": 10.0,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 10.0,
                                "fontFamilyBidi": "Arial"
                            },
                            "revisionIds": [
                                "60582391-5ed1-4b1f-9ffe-55e7cbb5771e"
                            ]
                        },
                        {
                            "text": "Test",
                            "characterFormat": {
                                "fontSize": 10.0,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 10.0,
                                "fontFamilyBidi": "Arial"
                            },
                            "revisionIds": [
                                "ff387f4d-38fe-4373-a56e-544659093c6d"
                            ]
                        },
                        {
                            "text": "Test",
                            "characterFormat": {
                                "fontSize": 10.0,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 10.0,
                                "fontFamilyBidi": "Arial"
                            },
                            "revisionIds": [
                                "33d0dc04-ba6d-4e33-8b70-99fa9dddb899"
                            ]
                        },
                        {
                            "text": "Test",
                            "characterFormat": {
                                "fontSize": 10.0,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 10.0,
                                "fontFamilyBidi": "Arial"
                            },
                            "revisionIds": [
                                "c01dacc3-bc0e-4a82-b083-e32d2de00ffb"
                            ]
                        },
                        {
                            "text": "Test",
                            "characterFormat": {
                                "fontSize": 10.0,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 10.0,
                                "fontFamilyBidi": "Arial"
                            },
                            "revisionIds": [
                                "609c5046-d4f2-41f5-8116-5bf293a5aa31"
                            ]
                        },
                        {
                            "text": "Test",
                            "characterFormat": {
                                "fontSize": 10.0,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 10.0,
                                "fontFamilyBidi": "Arial"
                            },
                            "revisionIds": [
                                "6a672c01-d679-4027-9a9e-af86876ee814"
                            ]
                        },
                        {
                            "text": "Test",
                            "characterFormat": {
                                "fontSize": 10.0,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 10.0,
                                "fontFamilyBidi": "Arial"
                            },
                            "revisionIds": [
                                "1263ce78-4dce-418f-9da5-f9143fb770db"
                            ]
                        },
                        {
                            "text": "Test",
                            "characterFormat": {
                                "fontSize": 10.0,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 10.0,
                                "fontFamilyBidi": "Arial"
                            },
                            "revisionIds": [
                                "fafdfe22-fa4c-429c-9f0a-075c83ccc4a8"
                            ]
                        },
                        {
                            "text": "Test",
                            "characterFormat": {
                                "fontSize": 10.0,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 10.0,
                                "fontFamilyBidi": "Arial"
                            },
                            "revisionIds": [
                                "8d8315e0-94a3-4a4f-8652-97a72b522e91"
                            ]
                        },
                        {
                            "text": "Test",
                            "characterFormat": {
                                "fontSize": 10.0,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 10.0,
                                "fontFamilyBidi": "Arial"
                            },
                            "revisionIds": [
                                "5c426548-7908-4a5d-ae23-13e6d7082d0a"
                            ]
                        },
                        {
                            "text": "Test",
                            "characterFormat": {
                                "fontSize": 10.0,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 10.0,
                                "fontFamilyBidi": "Arial"
                            },
                            "revisionIds": [
                                "8780a07a-3b41-427f-8940-599e96e8cd1b"
                            ]
                        },
                        {
                            "name": "_GoBack",
                            "bookmarkType": 0
                        },
                        {
                            "name": "_GoBack",
                            "bookmarkType": 1
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
                "pageStartingNumber": 0
            }
        }
    ],
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
        }
    ],
    "revisions": [
        {
            "author": "Stephen Raj Chandra Sekar",
            "date": "2020-05-28T20:29:00Z",
            "revisionType": "Insertion",
            "revisionId": "4b228d11-12e3-4e3a-9f4d-363045e5036b"
        },
        {
            "author": "Stephen Raj",
            "date": "2020-05-28T20:29:00Z",
            "revisionType": "Insertion",
            "revisionId": "41717215-af68-45d0-8e74-1541a4b3aa80"
        },
        {
            "author": "Stephen Raj 1",
            "date": "2020-05-28T20:29:00Z",
            "revisionType": "Insertion",
            "revisionId": "60582391-5ed1-4b1f-9ffe-55e7cbb5771e"
        },
        {
            "author": "Stephen Raj2",
            "date": "2020-05-28T20:29:00Z",
            "revisionType": "Insertion",
            "revisionId": "ff387f4d-38fe-4373-a56e-544659093c6d"
        },
        {
            "author": "Stephen Raj 4",
            "date": "2020-05-28T20:29:00Z",
            "revisionType": "Insertion",
            "revisionId": "33d0dc04-ba6d-4e33-8b70-99fa9dddb899"
        },
        {
            "author": "Stephen Raj 5",
            "date": "2020-05-28T20:29:00Z",
            "revisionType": "Insertion",
            "revisionId": "c01dacc3-bc0e-4a82-b083-e32d2de00ffb"
        },
        {
            "author": "Stephen Raj 6",
            "date": "2020-05-28T20:29:00Z",
            "revisionType": "Insertion",
            "revisionId": "609c5046-d4f2-41f5-8116-5bf293a5aa31"
        },
        {
            "author": "Stephen Raj 8",
            "date": "2020-05-28T20:29:00Z",
            "revisionType": "Insertion",
            "revisionId": "6a672c01-d679-4027-9a9e-af86876ee814"
        },
        {
            "author": "Stephen Raj 9",
            "date": "2020-05-28T20:29:00Z",
            "revisionType": "Insertion",
            "revisionId": "1263ce78-4dce-418f-9da5-f9143fb770db"
        },
        {
            "author": "Stephen Raj 10",
            "date": "2020-05-28T20:29:00Z",
            "revisionType": "Insertion",
            "revisionId": "fafdfe22-fa4c-429c-9f0a-075c83ccc4a8"
        },
        {
            "author": "Stephen Raj 11",
            "date": "2020-05-28T20:29:00Z",
            "revisionType": "Insertion",
            "revisionId": "8d8315e0-94a3-4a4f-8652-97a72b522e91"
        },
        {
            "author": "Stephen Raj 12",
            "date": "2020-05-28T20:29:00Z",
            "revisionType": "Insertion",
            "revisionId": "5c426548-7908-4a5d-ae23-13e6d7082d0a"
        },
        {
            "author": "Stephen Raj 13",
            "date": "2020-05-28T20:29:00Z",
            "revisionType": "Insertion",
            "revisionId": "8780a07a-3b41-427f-8940-599e96e8cd1b"
        }
    ],
    "defaultTabWidth": 36.0,
    "formatting": false,
    "trackChanges": true,
    "protectionType": "NoProtection",
    "enforcement": false,
    "dontUseHTMLParagraphAutoSpacing": false
};

describe('Author color Validation for different authors', () => {
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
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('author color validate', () => {
console.log('author color validate');
        editor.open(authorColorSfdt);
        let documentHelper: DocumentHelper = editor.documentHelper;
        let colors: string[] = ['#b5082e', '#2e97d3', '#bb00ff', '#f37e43', '#03a60b', '#881824', '#e09a2b', '#50565e'];
        expect(documentHelper.authors.get(documentHelper.authors.keys[0])).toBe(colors[0]);
        expect(documentHelper.authors.get(documentHelper.authors.keys[1])).toBe(colors[1]);
        expect(documentHelper.authors.get(documentHelper.authors.keys[2])).toBe(colors[2]);
        expect(documentHelper.authors.get(documentHelper.authors.keys[3])).toBe(colors[3]);
        expect(documentHelper.authors.get(documentHelper.authors.keys[4])).toBe(colors[4]);
        expect(documentHelper.authors.get(documentHelper.authors.keys[5])).toBe(colors[5]);
        expect(documentHelper.authors.get(documentHelper.authors.keys[6])).toBe(colors[6]);
        expect(documentHelper.authors.get(documentHelper.authors.keys[7])).toBe(colors[7]);
        expect(documentHelper.authors.get(documentHelper.authors.keys[8])).toBe(colors[0]);
        expect(documentHelper.authors.get(documentHelper.authors.keys[9])).toBe(colors[1]);
        expect(documentHelper.authors.get(documentHelper.authors.keys[10])).toBe(colors[2]);
    });
    it('Polish char validation', () => {
console.log('Polish char validation');
        editor.openBlank();
        let event: any = { keyCode: 18, preventDefault: function () { }, ctrlKey: false, shiftKey: false, altKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        let event1: any = { keyCode: 263, preventDefault: function () { }, ctrlKey: false, shiftKey: false, altKey: false, which: 0 };
        editor.documentHelper.onKeyPressInternal(event1);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('ć');
    });
    describe('validation for WebLayout', () => {
        let editor: DocumentEditor = undefined;
        beforeAll(() => {
            let ele: HTMLElement = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, layoutType: 'Continuous' });
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
            document.body.innerHTML = '';
            setTimeout(function () {
                done();
            }, 100);
        });
        it('Validation for Weblayout Width', () => {
console.log('WebLayout Width');
            let containerWidth: number = ((editor.viewer as WebLayoutViewer).getContentWidth());// * editor.documentHelper.zoomFactor) + (editor.viewer as WebLayoutViewer).padding.left + editor.viewer.padding.right;
            let width: number = editor.viewer.documentHelper.containerCanvas.clientWidth;
            containerWidth = Math.floor(containerWidth);
            expect(containerWidth).toBe(width);
        });
    });
});
