import { TextExport, DocumentHelper } from '../../../src/index';
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

describe('Load Empty Document - Edit and Apply Style', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let event: any;
    let currentPara: ParagraphWidget = undefined;
    let json: string = '{"sections":[{"blocks":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"name":"_GoBack","bookmarkType":0},{"name":"_GoBack","bookmarkType":1}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Character","name":"Default Paragraph Font"}]}';

    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        json = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
//     it('Apply Heading1', () => {
// console.log('Apply Heading1');
//         editor.open(json);
//         editor.editorModule.insertText('Heading');
//         editor.editorModule.onEnter();
//         editor.selection.handleUpKey();
//         editor.selection.handleEndKey();
//         editor.editorModule.applyStyle('Heading 1');
//         expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
//         expect(editor.selection.characterFormat.fontSize).toBe(16.0);
//         expect(editor.selection.characterFormat.fontColor).toBe("#2F5496");
//         expect(editor.selection.paragraphFormat.beforeSpacing).toBe(12.0);
//         expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);
//         event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
//         editor.documentHelper.onKeyDownInternal(event);

//         currentPara = editor.selection.start.currentWidget.paragraph;
//         editor.editorModule.insertText('Heading');
//         currentPara = editor.selection.start.currentWidget.paragraph;
//         expect(editor.selection.characterFormat.fontFamily).toBe("Calibri");
//         expect(editor.selection.characterFormat.fontSize).toBe(11.0);
//         expect(editor.selection.characterFormat.fontColor).toBe("empty");
//     });
//     it('Apply Heading2', () => {
// console.log('Apply Heading2');
//         editor.open(json);
//         editor.editorModule.insertText('Heading');
//         editor.editorModule.onEnter();
//         editor.selection.handleUpKey();
//         editor.selection.handleEndKey();
//         editor.editorModule.applyStyle('Heading 2');
//         expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
//         expect(editor.selection.characterFormat.fontSize).toBe(13.0);
//         expect(editor.selection.characterFormat.fontColor).toBe("#2F5496");
//         expect(editor.selection.paragraphFormat.beforeSpacing).toBe(2.0);
//         expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);

//         event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
//         editor.documentHelper.onKeyDownInternal(event);

//         editor.editorModule.insertText('Heading');
//         expect(editor.selection.characterFormat.fontFamily).toBe("Calibri");
//         expect(editor.selection.characterFormat.fontSize).toBe(11.0);
//         expect(editor.selection.characterFormat.fontColor).toBe("empty");
//     });
//     it('Apply Heading3', () => {
// console.log('Apply Heading3');
//         editor.open(json);
//         editor.editorModule.insertText('Heading');
//         editor.editorModule.onEnter();
//         editor.selection.handleUpKey();
//         editor.selection.handleEndKey();
//         editor.editorModule.applyStyle('Heading 3');

//         expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
//         expect(editor.selection.characterFormat.fontSize).toBe(12.0);
//         expect(editor.selection.characterFormat.fontColor).toBe("#1F3763");
//         expect(editor.selection.paragraphFormat.beforeSpacing).toBe(2.0);
//         expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);

//         event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
//         editor.documentHelper.onKeyDownInternal(event);

//         editor.editorModule.insertText('Heading');
//         expect(editor.selection.characterFormat.fontFamily).toBe("Calibri");
//         expect(editor.selection.characterFormat.fontSize).toBe(11.0);
//         expect(editor.selection.characterFormat.fontColor).toBe("empty");
//     });
//     it('Apply Heading4', () => {
// console.log('Apply Heading4');
//         editor.open(json);
//         editor.editorModule.insertText('Heading');
//         editor.editorModule.onEnter();
//         editor.selection.handleUpKey();
//         editor.selection.handleEndKey();
//         editor.editorModule.applyStyle('Heading 4');
//         expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
//         expect(editor.selection.characterFormat.italic).toBe(true);
//         expect(editor.selection.characterFormat.fontColor).toBe("#2F5496");
//         expect(editor.selection.paragraphFormat.beforeSpacing).toBe(2.0);
//         expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);

//         event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
//         editor.documentHelper.onKeyDownInternal(event);

//         editor.editorModule.insertText('Heading');
//         expect(editor.selection.characterFormat.fontFamily).toBe("Calibri");
//         expect(editor.selection.characterFormat.fontSize).toBe(11.0);
//         expect(editor.selection.characterFormat.fontColor).toBe("empty");
//     });
//     it('Apply Heading5', () => {
// console.log('Apply Heading5');
//         editor.open(json);
//         editor.editorModule.insertText('Heading');
//         editor.editorModule.onEnter();
//         editor.selection.handleUpKey();
//         editor.selection.handleEndKey();
//         editor.editorModule.applyStyle('Heading 5');
//         expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
//         expect(editor.selection.characterFormat.fontColor).toBe("#2F5496");
//         expect(editor.selection.paragraphFormat.beforeSpacing).toBe(2.0);
//         expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);

//         event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
//         editor.documentHelper.onKeyDownInternal(event);

//         editor.editorModule.insertText('Heading');
//         expect(editor.selection.characterFormat.fontFamily).toBe("Calibri");
//         expect(editor.selection.characterFormat.fontSize).toBe(11.0);
//         expect(editor.selection.characterFormat.fontColor).toBe("empty");
//     });
//     it('Apply Heading6', () => {
// console.log('Apply Heading6');
//         editor.open(json);
//         editor.editorModule.insertText('Heading');
//         editor.editorModule.onEnter();
//         editor.selection.handleUpKey();
//         editor.selection.handleEndKey();
//         editor.editorModule.applyStyle('Heading 6');
//         expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
//         expect(editor.selection.characterFormat.fontColor).toBe("#1F3763");
//         expect(editor.selection.paragraphFormat.beforeSpacing).toBe(2.0);
//         expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);

//         event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
//         editor.documentHelper.onKeyDownInternal(event);

//         editor.editorModule.insertText('Heading');
//         expect(editor.selection.characterFormat.fontFamily).toBe("Calibri");
//         expect(editor.selection.characterFormat.fontSize).toBe(11.0);
//         expect(editor.selection.characterFormat.fontColor).toBe("empty");
//     });
});
