import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer, DocumentHelper } from '../../../src/index';
import { ListDialog } from '../../../src/document-editor/implementation/dialogs/list-dialog';
import { ListViewModel } from '../../../src/document-editor/implementation/dialogs/list-view-model';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { L10n } from '@syncfusion/ej2-base';
import { Editor } from '../../../src/index';

/**
 * List Dialog Spec
 */
function createDocument(editor: DocumentEditor) {
    editor.openBlank();
    editor.editorModule.insertText('Adventure Works cycles');
}
let arabic: any = {
    "sections": [
        {
            "blocks": [
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 12,
                        "fontFamily": "Calibri",
                        "fontColor": "#FF000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 0,
                        "lineSpacing": 1.149999976158142,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 0,
                            "listId": 7
                        }
                    },
                    "inlines": [
                        {
                            "text": "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company.",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 12,
                                "fontFamily": "Calibri",
                                "fontColor": "#FF000000"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 12,
                        "fontFamily": "Calibri",
                        "fontColor": "#FF000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 0,
                        "lineSpacing": 1.149999976158142,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 0,
                            "listId": 7
                        }
                    },
                    "inlines": [
                        {
                            "text": "The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets.",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 12,
                                "fontFamily": "Calibri",
                                "fontColor": "#FF000000"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 12,
                        "fontFamily": "Calibri",
                        "fontColor": "#FF000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 0,
                        "lineSpacing": 1.149999976158142,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 0,
                            "listId": 7
                        }
                    },
                    "inlines": [
                        {
                            "text": "Whileits base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 12,
                                "fontFamily": "Calibri",
                                "fontColor": "#FF000000"
                            }
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
        "bold": false,
        "italic": false,
        "strikethrough": "None",
        "baselineAlignment": "Normal",
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#FF000000"
    },
    "lists": [
        {
            "listId": 7,
            "abstractListId": 7
        }
    ],
    "abstractLists": [
        {
            "abstractListId": 7,
            "levels": [
                {
                    "startAt": 1,
                    "restartLevel": 0,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%1.",
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "fontSize": 8,
                        "fontFamily": "Verdana",
                        "fontColor": "#FF000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left"
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 1,
                    "listLevelPattern": "UpRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%2.",
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "fontSize": 8,
                        "fontFamily": "Verdana",
                        "fontColor": "#FF000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 72,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left"
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 2,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%3.",
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "fontSize": 8,
                        "fontFamily": "Verdana",
                        "fontColor": "#FF000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 108,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left"
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 3,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%4.",
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "fontSize": 8,
                        "fontFamily": "Verdana",
                        "fontColor": "#FF000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 144,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left"
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 4,
                    "listLevelPattern": "UpRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%5.",
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "fontSize": 8,
                        "fontFamily": "Verdana",
                        "fontColor": "#FF000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 180,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left"
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 5,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%6.",
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "fontSize": 8,
                        "fontFamily": "Verdana",
                        "fontColor": "#FF000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 216,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left"
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 6,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%7.",
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "fontSize": 8,
                        "fontFamily": "Verdana",
                        "fontColor": "#FF000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 252,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left"
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 7,
                    "listLevelPattern": "UpRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%8.",
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "fontSize": 8,
                        "fontFamily": "Verdana",
                        "fontColor": "#FF000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 288,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left"
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 8,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%9.",
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "fontSize": 8,
                        "fontFamily": "Verdana",
                        "fontColor": "#FF000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 324,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left"
                    }
                }
            ]
        }
    ]
};
// describe('List dialog validation - 1', () => {
//     let editor: DocumentEditor;
//     let viewer: LayoutViewer;
//     let dialog: ListDialog;
//     beforeAll((): void => {
//         editor = undefined;
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.appendChild(ele);
//         DocumentEditor.Inject(Editor, Selection, ListDialog, EditorHistory);
//         editor = new DocumentEditor({ isReadOnly: false,enableEditor: true, enableSelection: true, enableListDialog: true });
//         editor.enableEditorHistory = true;
//         (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.appendTo('#container');
//         dialog = new ListDialog(editor.documentHelper);
//     });
//     afterAll((done): void => {
//         editor.destroy();
//         dialog.destroy();
//         dialog = undefined;
//         document.body.removeChild(document.getElementById('container'));
//         editor = undefined;
//         viewer = undefined;
//         setTimeout(function () {
//             done();
//         }, 1000);
//     });
//     // it('Dialog intial load testing', () => {
//     //     viewer = editor.viewer as PageLayoutViewer;
//     //     editor.open(JSON.stringify(arabic));
//     //     viewer = editor.viewer as PageLayoutViewer;
//     //     viewer.selection.selectAll();
//     //     dialog.showListDialog();
//     //     let event: any = { target: { value: "UpRoman" } };
//     //     expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
//     //     (dialog as any).onApplyList();
//     //     editor.editorHistory.undo();
//     //     editor.editorHistory.redo();

//     // });

// });
describe('List dialog validation-2', () => {
    let editor: DocumentEditor;
    let dialog: ListDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ListDialog);
        DocumentEditor.Inject(EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableListDialog: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.listDialogModule;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('followCharacter API validation', () => {
console.log('followCharacter API validation');
        dialog.showListDialog();
        let number = (dialog as any).followCharacterConverter('None');
        (dialog as any).followCharacterConverter('Space');
        (dialog as any).followCharacterConverter('Tab');
        expect(number).toBe(2);
    });
    it('List Pattern API validation', () => {
console.log('List Pattern API validation');
        let number = (dialog as any).listPatternConverter('Arabic');
        (dialog as any).listPatternConverter('LowRoman');
        (dialog as any).listPatternConverter('UpRoman');
        (dialog as any).listPatternConverter('LowLetter');
        (dialog as any).listPatternConverter('UpLetter');
        (dialog as any).listPatternConverter('Number');
        (dialog as any).listPatternConverter('LeadingZero');
        (dialog as any).listPatternConverter('Bullet');
        (dialog as any).listPatternConverter('Ordinal');
        (dialog as any).listPatternConverter('OrdinalText');
        (dialog as any).listPatternConverter('Special');
        (dialog as any).listPatternConverter('FarEast');
        (dialog as any).listPatternConverter('None');
        expect(number).toBe(0);
    });
    it('Applylist API validation', () => {
console.log('Applylist API validation');
        let dialog: any = new ListDialog(editor.documentHelper);
        createDocument(editor);
        dialog.showListDialog();
        dialog.documentHelper = undefined;
        expect(() => { (dialog as any).onApplyList(); }).toThrowError();
        dialog.destroy();
    });

});
describe('ListDialogViewModel class validation', () => {
    let editor: DocumentEditor;
    let dialog: ListDialog;
    let viewModel: ListViewModel
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ListDialog);
        DocumentEditor.Inject(EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = new ListDialog(editor.documentHelper);
        viewModel = (dialog as any).viewModel;
    });
    afterAll((done): void => {
        editor.destroy();
        dialog.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog = undefined;
        viewModel = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('viewmodel property validation', () => {
console.log('viewmodel property validation');
        dialog.showListDialog();
        viewModel.listLevelPattern = 'Arabic';
        expect(viewModel.listLevelPattern).not.toBe(undefined);
    });
    it('viewmodel property validation', () => {
console.log('viewmodel property validation');
        dialog.showListDialog();
        viewModel.followCharacter = 'Space';
        expect(viewModel.followCharacter).not.toBe(undefined);
    });
    it('Create List and addListLevel API validation', () => {
console.log('Create List and addListLevel API validation');

        dialog.showListDialog();
        let dialogview: ListViewModel = new ListViewModel();
        (dialogview as any).addListLevels();
    });

});
describe('dialog event validation-1', () => {
    let editor: DocumentEditor;
    let dialog: ListDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ListDialog);
        DocumentEditor.Inject(EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = new ListDialog(editor.documentHelper);
    });
    afterAll((done): void => {
        editor.destroy();
        dialog.destroy();
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 500);
    });
    it('NumberFormat event validation', (done) => {
console.log('NumberFormat event validation');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        editor.editor.applyNumbering('%1.', 'Number');
        dialog.showListDialog();
        setTimeout(() => {
            let event: any = { target: { value: "%0." } };
            (dialog as any).onNumberFormatChanged(event);
            expect((dialog as any).viewModel.listLevel.numberFormat).toBe('%0.');
            (dialog as any).onCancelButtonClick();
            done();
        });
    });
    it('follow character event validation', () => {
console.log('follow character event validation');
        createDocument(editor);
        editor.editorModule.insertText('Syncfusion Software');
        editor.editor.applyBullet('\uf0b7', 'Symbol');
        let locale: L10n = new L10n('documenteditor', editor.defaultLocale);
        locale.setLocale(editor.locale);
        dialog.initListDialog(locale);
        let event: any = { target: { value: "Space" } };
        (dialog as any).onFollowCharacterValueChanged(event);
        expect((dialog as any).viewModel.followCharacter).toBe('None');
    });
    it('follow character event validation', () => {
console.log('follow character event validation');
        let event: any = { target: { value: "Tab" } };
        (dialog as any).onFollowCharacterValueChanged(event);
        expect((dialog as any).viewModel.followCharacter).toBe('None');
    });
    it('follow character event validation', () => {
console.log('follow character event validation');
        let event: any = { target: { value: "None" } };
        (dialog as any).onFollowCharacterValueChanged(event);
        expect((dialog as any).viewModel.followCharacter).toBe('None');
    });
});
describe('dialog event validation', () => {
    let editor: DocumentEditor;
    let dialog: ListDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ListDialog);
        DocumentEditor.Inject(EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableListDialog: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.listDialogModule;
    });
    afterAll((done): void => {
        editor.destroy();
        dialog.destroy();
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 500);
    });
    it('ListLevel event validation', () => {
console.log('ListLevel event validation');
        createDocument(editor);
        dialog.showListDialog();
        let event: any = { value: 'Level 3', target: { selectedIndex: 2 } };
        expect(() => { (dialog as any).onListLevelValueChanged(event); }).not.toThrowError();
        (dialog as any).onApplyList();
    });
//     it('ListLevel event validation with index 0', () => {
// console.log('ListLevel event validation with index 0');
//         createDocument(editor);
//         dialog.showListDialog();
//         let event: any = { value: 'Level 1', target: { selectedIndex: 0 } };
//         expect(() => { (dialog as any).onListLevelValueChanged(event); }).not.toThrowError();
//         (dialog as any).onApplyList();
//     });
//     it('ListLevel event validation with index 0', () => {
// console.log('ListLevel event validation with index 0');
//         editor.editorHistory.undo();
//         expect(() => { editor.editorHistory.redo(); }).not.toThrowError();
//     });
//     it('Dialog property validation', (done) => {
// console.log('Dialog property validation');
//         createDocument(editor);
//         dialog.showListDialog();
//         setTimeout(() => {
//             (dialog as any).viewModel = undefined;
//             expect(dialog.list).toBe(undefined);
//             expect(dialog.listLevel).toBe(undefined);
//             done();
//         });
//     });
});
describe('dialog event validation', () => {
    let editor: DocumentEditor;
    let dialog: ListDialog;
    let event: any;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, ListDialog);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = new ListDialog(editor.documentHelper);
        createDocument(editor);
        dialog.showListDialog();
    });
    afterAll((done): void => {
        editor.destroy();
        dialog.destroy();
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('LevelPattern event validation', () => {
console.log('LevelPattern event validation');
        event = { target: { value: "UpRoman" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation', () => {
console.log('LevelPattern event validation');
        event = { target: { value: "LowRoman" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation', () => {
console.log('LevelPattern event validation');
        event = { target: { value: "UpLetter" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation', () => {
console.log('LevelPattern event validation');
        event = { target: { value: "LowLetter" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation', () => {
console.log('LevelPattern event validation');
        event = { target: { value: "Arabic" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation', () => {
console.log('LevelPattern event validation');
        event = { target: { value: "Bullet" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation-2', () => {
console.log('LevelPattern event validation-2');
        event = { target: { value: "Number" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation-2', () => {
console.log('LevelPattern event validation-2');
        event = { target: { value: "LeadingZero" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation-2', () => {
console.log('LevelPattern event validation-2');
        event = { target: { value: "Ordinal" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation-2', () => {
console.log('LevelPattern event validation-2');
        event = { target: { value: "OrdinalText" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation-2', () => {
console.log('LevelPattern event validation-2');
        event = { target: { value: "FarEast" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation-2', () => {
console.log('LevelPattern event validation-2');
        event = { target: { value: "Special" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('LevelPattern event validation-2', () => {
console.log('LevelPattern event validation-2');
        event = { target: { value: "None" } };
        expect(() => { (dialog as any).onLevelPatternValueChanged(event); }).not.toThrowError();
    });
    it('module name validation', () => {
console.log('module name validation');
        let name: string = dialog.getModuleName();
        expect(name).toBe('ListDialog')
    });
});
