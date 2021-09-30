import { TextExport } from '../../../src/index';
import { createElement, } from '@syncfusion/ej2-base';
import { StreamWriter } from '@syncfusion/ej2-file-utils';
import { LayoutViewer, PageLayoutViewer } from '../../../src/index';
import { SfdtExport } from '../../../src/document-editor/implementation/writer/sfdt-export';
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { Layout } from '../../../src/document-editor/implementation/viewer/layout';
import { ParagraphWidget } from '../../../src/index';

describe('Style Load Testing', () => {
    let editor: DocumentEditor = undefined;
    let event: any;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });

        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });

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
//     it('Load Document with style', () => {
// console.log('Load Document with style');
//         let json: string = '{"sections":[{"blocks":[{"paragraphFormat":{"styleName":"Heading 1"},"inlines":[{"text":"Heading1"}]},{"paragraphFormat":{"styleName":"Heading 2"},"inlines":[{"text":"Heading2"}]},{"paragraphFormat":{"styleName":"Heading 3"},"inlines":[{"text":"Heading3"}]},{"paragraphFormat":{"styleName":"Heading 4"},"inlines":[{"text":"Heading4"}]},{"paragraphFormat":{"styleName":"Heading 5"},"inlines":[{"text":"Heading5"}]},{"paragraphFormat":{"styleName":"Heading 6"},"inlines":[{"text":"Heading6"}]},{"characterFormat":{"styleName":"Style1"},"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"Style1","characterFormat":{"styleName":"Style1"}}]},{"characterFormat":{"styleName":"Style1"},"paragraphFormat":{"styleName":"Heading 1"},"inlines":[{"text":"Combine case","characterFormat":{"styleName":"Style1"}}]},{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"Normal"},{"name":"_GoBack","bookmarkType":0},{"name":"_GoBack","bookmarkType":1}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Paragraph","name":"Heading 1","basedOn":"Normal","next":"Normal","link":"Heading 1 Char","characterFormat":{"fontSize":16.0,"fontFamily":"Calibri Light","fontColor":"#FF2F5496"},"paragraphFormat":{"beforeSpacing":12.0,"afterSpacing":0.0,"outlineLevel":"Level1"}},{"type":"Paragraph","name":"Heading 2","basedOn":"Normal","next":"Normal","link":"Heading 2 Char","characterFormat":{"fontSize":13.0,"fontFamily":"Calibri Light","fontColor":"#FF2F5496"},"paragraphFormat":{"beforeSpacing":2.0,"afterSpacing":0.0,"outlineLevel":"Level2"}},{"type":"Paragraph","name":"Heading 3","basedOn":"Normal","next":"Normal","link":"Heading 3 Char","characterFormat":{"fontSize":12.0,"fontFamily":"Calibri Light","fontColor":"#FF1F3763"},"paragraphFormat":{"beforeSpacing":2.0,"afterSpacing":0.0,"outlineLevel":"Level3"}},{"type":"Paragraph","name":"Heading 4","basedOn":"Normal","next":"Normal","link":"Heading 4 Char","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#FF2F5496"},"paragraphFormat":{"beforeSpacing":2.0,"afterSpacing":0.0,"outlineLevel":"Level4"}},{"type":"Paragraph","name":"Heading 5","basedOn":"Normal","next":"Normal","link":"Heading 5 Char","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#FF2F5496"},"paragraphFormat":{"beforeSpacing":2.0,"afterSpacing":0.0,"outlineLevel":"Level5"}},{"type":"Paragraph","name":"Heading 6","basedOn":"Normal","next":"Normal","link":"Heading 6 Char","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#FF1F3763"},"paragraphFormat":{"beforeSpacing":2.0,"afterSpacing":0.0,"outlineLevel":"Level6"}},{"type":"Character","name":"Default Paragraph Font"},{"type":"Character","name":"Heading 1 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":16.0,"fontFamily":"Calibri Light","fontColor":"#FF2F5496"}},{"type":"Character","name":"Heading 2 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":13.0,"fontFamily":"Calibri Light","fontColor":"#FF2F5496"}},{"type":"Character","name":"Heading 3 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":12.0,"fontFamily":"Calibri Light","fontColor":"#FF1F3763"}},{"type":"Character","name":"Heading 4 Char","basedOn":"Default Paragraph Font","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#FF2F5496"}},{"type":"Character","name":"Heading 5 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#FF2F5496"}},{"type":"Character","name":"Heading 6 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#FF1F3763"}},{"type":"Character","name":"Style1","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":10.0,"fontFamily":"Algerian"}}]}';
//         editor.open(json);
//         let currentPara: ParagraphWidget = undefined;
//         //Heading 1
//         expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
//         expect(editor.selection.characterFormat.fontSize).toBe(16.0);
//         expect(editor.selection.characterFormat.fontColor).toBe("#FF2F5496");
//         expect(editor.selection.paragraphFormat.beforeSpacing).toBe(12.0);
//         expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);

//         currentPara = editor.selection.start.currentWidget.paragraph;
//         event = { keyCode: 40, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
//         editor.documentHelper.onKeyDownInternal(event);

//         //Heading 2
//         expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
//         expect(editor.selection.characterFormat.fontSize).toBe(13.0);
//         expect(editor.selection.characterFormat.fontColor).toBe("#FF2F5496");
//         expect(editor.selection.paragraphFormat.beforeSpacing).toBe(2.0);
//         expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);

//         currentPara = editor.selection.start.currentWidget.paragraph;
//         event = { keyCode: 40, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
//         editor.documentHelper.onKeyDownInternal(event);

//         //Heading 3
//         expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
//         expect(editor.selection.characterFormat.fontSize).toBe(12.0);
//         expect(editor.selection.characterFormat.fontColor).toBe("#FF1F3763");
//         expect(editor.selection.paragraphFormat.beforeSpacing).toBe(2.0);
//         expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);

//         currentPara = editor.selection.start.currentWidget.paragraph;
//         event = { keyCode: 40, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
//         editor.documentHelper.onKeyDownInternal(event);

//         //Heading 4
//         expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
//         expect(editor.selection.characterFormat.italic).toBe(true);
//         expect(editor.selection.characterFormat.fontColor).toBe("#FF2F5496");
//         expect(editor.selection.paragraphFormat.beforeSpacing).toBe(2.0);
//         expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);

//         currentPara = editor.selection.start.currentWidget.paragraph;
//         event = { keyCode: 40, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
//         editor.documentHelper.onKeyDownInternal(event);

//         //Heading 5
//         expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
//         expect(editor.selection.characterFormat.fontColor).toBe("#FF2F5496");
//         expect(editor.selection.paragraphFormat.beforeSpacing).toBe(2.0);
//         expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);


//         currentPara = editor.selection.start.currentWidget.paragraph;
//         event = { keyCode: 40, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
//         editor.documentHelper.onKeyDownInternal(event);

//         //Heading 6
//         expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
//         expect(editor.selection.characterFormat.fontColor).toBe("#FF1F3763");
//         expect(editor.selection.paragraphFormat.beforeSpacing).toBe(2.0);
//         expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);


//         currentPara = editor.selection.start.currentWidget.paragraph;
//         event = { keyCode: 40, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
//         editor.documentHelper.onKeyDownInternal(event);

//         //Style 1
//         expect(editor.selection.characterFormat.fontFamily).toBe("Algerian");
//         expect(editor.selection.characterFormat.fontColor).toBe("empty");
//         expect(editor.selection.paragraphFormat.beforeSpacing).toBe(0.0);
//         expect(editor.selection.paragraphFormat.afterSpacing).toBe(8);

//         currentPara = editor.selection.start.currentWidget.paragraph;
//         event = { keyCode: 40, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
//         editor.documentHelper.onKeyDownInternal(event);

//         //Normal + Style 1
//         expect(editor.selection.characterFormat.fontFamily).toBe("Algerian");
//         expect(editor.selection.characterFormat.fontColor).toBe("#FF2F5496");
//         expect(editor.selection.paragraphFormat.beforeSpacing).toBe(12.0);
//         expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);

//         currentPara = editor.selection.start.currentWidget.paragraph;
//         event = { keyCode: 40, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
//         editor.documentHelper.onKeyDownInternal(event);

//         //Nomral
//         expect(editor.selection.characterFormat.fontFamily).toBe("Calibri");
//         expect(editor.selection.characterFormat.fontColor).toBe("empty");
//     });
    it('List With AppliedParastyle ', () => {
console.log('List With AppliedParastyle ');
        let json: string = '{"sections":[{"blocks":[{"paragraphFormat":{"styleName":"Heading 1","listFormat":{"listLevelNumber":0,"listId":1}},"inlines":[{"name":"_GoBack","bookmarkType":0},{"text":"List"}]},{"paragraphFormat":{"styleName":"Heading 1","listFormat":{"listLevelNumber":0,"listId":1}},"inlines":[{"text":"List"}]},{"paragraphFormat":{"styleName":"Heading 1","listFormat":{"listLevelNumber":0,"listId":1}},"inlines":[{"text":"List"},{"name":"_GoBack","bookmarkType":1}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"lists":[{"listId":1,"abstractListId":1}],"abstractLists":[{"abstractListId":1,"levels":[{"startAt":1,"restartLevel":0,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%1.","paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":1,"listLevelPattern":"LowLetter","followCharacter":"Tab","numberFormat":"%2.","paragraphFormat":{"leftIndent":72.0,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":2,"listLevelPattern":"LowRoman","followCharacter":"Tab","numberFormat":"%3.","paragraphFormat":{"leftIndent":108.0,"firstLineIndent":-9.0}},{"startAt":1,"restartLevel":3,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%4.","paragraphFormat":{"leftIndent":144.0,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":4,"listLevelPattern":"LowLetter","followCharacter":"Tab","numberFormat":"%5.","paragraphFormat":{"leftIndent":180.0,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":5,"listLevelPattern":"LowRoman","followCharacter":"Tab","numberFormat":"%6.","paragraphFormat":{"leftIndent":216.0,"firstLineIndent":-9.0}},{"startAt":1,"restartLevel":6,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%7.","paragraphFormat":{"leftIndent":252.0,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":7,"listLevelPattern":"LowLetter","followCharacter":"Tab","numberFormat":"%8.","paragraphFormat":{"leftIndent":288.0,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":8,"listLevelPattern":"LowRoman","followCharacter":"Tab","numberFormat":"%9.","paragraphFormat":{"leftIndent":324.0,"firstLineIndent":-9.0}}]}],"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Paragraph","name":"Heading 1","basedOn":"Normal","next":"Normal","link":"Heading 1 Char","characterFormat":{"fontSize":16.0,"fontFamily":"Calibri Light","fontColor":"#FF2F5496"},"paragraphFormat":{"beforeSpacing":12.0,"afterSpacing":0.0,"outlineLevel":"Level1"}},{"type":"Character","name":"Default Paragraph Font"},{"type":"Paragraph","name":"List Paragraph","basedOn":"Normal","paragraphFormat":{"leftIndent":36.0}},{"type":"Character","name":"Heading 1 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":16.0,"fontFamily":"Calibri Light","fontColor":"#FF2F5496"}}]}';
        editor.open(json);
        let currentPara: ParagraphWidget = undefined;
        //Line 1
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
        expect(editor.selection.characterFormat.fontSize).toBe(16.0);
        expect(editor.selection.characterFormat.fontColor).toBe("#FF2F5496");
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(12.0);
        expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);

        currentPara = editor.selection.start.currentWidget.paragraph;
        event = { keyCode: 40, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);

        //Line 2
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
        expect(editor.selection.characterFormat.fontSize).toBe(16.0);
        expect(editor.selection.characterFormat.fontColor).toBe("#FF2F5496");
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(12.0);
        expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);

        currentPara = editor.selection.start.currentWidget.paragraph;
        event = { keyCode: 40, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);

        //Line 3
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
        expect(editor.selection.characterFormat.fontSize).toBe(16.0);
        expect(editor.selection.characterFormat.fontColor).toBe("#FF2F5496");
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(12.0);
        expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);

        event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);

        editor.editorModule.insertText('NewList');

        //Add new Line
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
        expect(editor.selection.characterFormat.fontSize).toBe(16.0);
        expect(editor.selection.characterFormat.fontColor).toBe("#FF2F5496");
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(12.0);
        expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);

    });

});
