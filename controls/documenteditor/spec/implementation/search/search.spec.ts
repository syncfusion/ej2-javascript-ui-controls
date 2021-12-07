import { LayoutViewer, ParagraphWidget, LineWidget, TextElementBox } from '../../../src/index';
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Search } from '../../../src/document-editor/implementation/search/index';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection, Page, EditorHistory } from '../../../src/index';
/**
 * Replace all spec
 */
describe('Find and Replace all in Header footer validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, Search, EditorHistory);
        editor = new DocumentEditor({
            enableEditor: true, enableSelection: true, isReadOnly: false, enableSearch: true, enableEditorHistory: true
        });
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
        }, 750);
    });
    it('Find All validation', () => {
console.log('Find All validation');
        editor.open(JSON.stringify(sfdtText));
        editor.search.findAll('Adventure Cycle');
        expect(editor.search.textSearchResults.length).toBe(6);
    });
//     it('Replace all validation', () => {
// console.log('Replace all validation');
//         editor.search.replaceAll('Giant Panda', editor.search.textSearchResults);
//         for (let i: number = 0; i < editor.documentHelper.pages.length; i++) {
//             let page: Page = editor.documentHelper.pages[i];
//             expect((((page.headerWidget.firstChild as ParagraphWidget).firstChild as LineWidget).children[0] as TextElementBox).text).toBe('Giant Panda');
//             expect((((page.footerWidget.firstChild as ParagraphWidget).firstChild as LineWidget).children[0] as TextElementBox).text).toBe('Giant Panda')
//         }
//     });
});
let sfdtText: object = {
    sections: [
        {
            blocks: [
                {
                    inlines: [
                        {
                            text: 'Adventure Cycle'
                        }
                    ]
                },
                {
                    inlines: [
                        {
                            text: '\f'
                        }
                    ]
                },
                {
                    inlines: []
                },
                {
                    inlines: [
                        {
                            text: 'Adventure Cycle'
                        }
                    ]
                },
                {
                    inlines: []
                }
            ],
            headersFooters: {
                header: {
                    blocks: [
                        {
                            inlines: [
                                {
                                    text: 'Adventure Cycle'
                                }
                            ]
                        }
                    ]
                },
                footer: {
                    blocks: [
                        {
                            inlines: [
                                {
                                    text: 'Adventure Cycle'
                                }
                            ]
                        }
                    ]
                }
            }
        }
    ]
};
let rtl_doc: any = { "sections": [{ "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "سشةحمث أثممخ صخقمي ", "characterFormat": { "bidi": true } }, { "text": "sample Hello world " }, { "text": "سشةحمث أثممخص صخقمي", "characterFormat": { "bidi": true } }] }, { "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "سشةحمث اثممخص صخقمي ", "characterFormat": { "bidi": true } }, { "text": "sample hello world " }, { "text": "سشةحثم اثممخ صخقي ", "characterFormat": { "bidi": true } }] }, { "rows": [{ "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "سشةحث اثممخ صخقمي ", "characterFormat": { "bidi": true } }, { "text": "sample hello world " }, { "text": "سشةحمث اثممخص صخقي", "characterFormat": { "bidi": true } }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 467.5, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }] }], "title": null, "description": null, "tableFormat": { "allowAutoFit": true, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "borders": { "left": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "bidi": false } }, { "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "سشةحمث أثممخ صخقمي ", "characterFormat": { "bidi": true } }, { "text": "sample Hello world " }, { "text": "سشةحمث أثممخص صخقمي", "characterFormat": { "bidi": true } }, { "text": " ", "characterFormat": { "bidi": true } }, { "text": "سشةحمث أثممخ صخقمي ", "characterFormat": { "bidi": true } }, { "text": "sample Hello world " }, { "text": "سشةحمث أثممخص صخقمي", "characterFormat": { "bidi": true } }, { "text": " ", "characterFormat": { "bidi": true } }, { "text": "سشةحمث أثممخ صخقمي ", "characterFormat": { "bidi": true } }, { "text": "sample Hello world " }, { "text": "سشةحمث أثممخص صخقمي", "characterFormat": { "bidi": true } }, { "text": " ", "characterFormat": { "bidi": true } }, { "text": "سشةحمث أثممخ صخقمي ", "characterFormat": { "bidi": true } }, { "text": "sample Hello world " }, { "text": "سشةحمث أثممخص صخقمي", "characterFormat": { "bidi": true } }, { "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Paragraph", "name": "Header", "basedOn": "Normal", "link": "Header Char", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Center", "position": 234.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Header Char", "basedOn": "Default Paragraph Font" }, { "type": "Paragraph", "name": "Footer", "basedOn": "Normal", "link": "Footer Char", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Center", "position": 234.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Footer Char", "basedOn": "Default Paragraph Font" }] };
describe('search rtl text', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, Search, EditorHistory);
        editor = new DocumentEditor({
            enableEditor: true, enableSelection: true, isReadOnly: false, enableSearch: true, enableEditorHistory: true
        });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(rtl_doc));
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 750);
    });
    it('find all in rtl document', () => {
console.log('find all in rtl document');
        editor.search.findAll('سشةحمث');
        expect(editor.search.textSearchResults.length).toBe(12);
    });
    it('find all in rtl document', () => {
console.log('find all in rtl document');
        editor.search.findAll('hello');
        expect(editor.search.textSearchResults.length).toBe(7);
    });

});


// Text search with $symbol validation

describe('Find and find all with $ validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, Search, EditorHistory);
        editor = new DocumentEditor({
            enableEditor: true, enableSelection: true, isReadOnly: false, enableSearch: true, enableEditorHistory: true
        });
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
        }, 750);
    });
    it('Find $symbol validation', () => {
console.log('Find $symbol validation');
        let text: string = 'Adventure Works Cycles, $4000 fictitious company on which $4000 AdventureWorks sample databases are based, is a large, multinational manufacturing company. $4000 company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bo$4000ll, Washington with 290 employees, several regional sales teams are located throughout $4000ir market base.';
        editor.editor.insertText(text);
        editor.search.find('$4000');
        expect(editor.selection.text).toBe('$4000');
    });
    it('Replace after find $symbol validation', () => {
console.log('Replace after find $symbol validation');
        editor.editor.insertText('sample');
        editor.editorHistory.undo();
        expect(editor.selection.text).toBe('$4000');
    });
    it('find all validation', () => {
console.log('find all validation');
        editor.openBlank();
        let text: string = 'Adventure Works Cycles, $4000 fictitious company on which $4000 AdventureWorks sample databases are based, is a large, multinational manufacturing company. $4000 company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bo$4000ll, Washington with 290 employees, several regional sales teams are located throughout $4000ir market base.';
        editor.editor.insertText(text);
        editor.search.findAll('$4000');
        expect(editor.selection.text).toBe('$4000');
    });
    it('find curly braces validation', () => {
console.log('find curly braces validation');
        editor.openBlank();
        editor.editor.insertText('{2}');
        editor.search.findAll('{2}');
        expect(editor.selection.text).toBe('{2}');
    });
});
