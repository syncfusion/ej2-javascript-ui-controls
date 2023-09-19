import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, TableCellWidget, TextElementBox, TextHelper, RtlInfo, FieldElementBox } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { BorderSettings } from '../../src/document-editor/implementation/editor/editor';
/**
 * Section Break Validation
 */
describe('Rtl text editing validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
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
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
//     it('arabic text insert', () => {
// console.log('arabic text insert');
//         editor.editor.insertText('سشةحمث');
//         expect(editor.selection.start.currentWidget.children[0].characterFormat.bidi).toBe(true)
//         expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('سشةحمث')
//     });
//     it('arabic and english text insert', () => {
// console.log('arabic and english text insert');
//         editor.openBlank();
//         editor.editor.insertText('sample');
//         editor.editor.insertText('سشةحمث');
//         expect(editor.selection.start.currentWidget.children[1].characterFormat.bidi).toBe(true)
//         expect((editor.selection.start.currentWidget.children[1] as TextElementBox).text).toBe('سشةحمث')
//     });
//     it('space after arabic text-consider as single text element box', () => {
// console.log('space after arabic text-consider as single text element box');
//         editor.openBlank();
//         editor.editor.insertText('سشةحمث');
//         editor.editor.insertText('    ');
//         editor.editor.insertText('سشةحمث');
//         expect(editor.selection.start.currentWidget.children[0].characterFormat.bidi).toBe(true)
//         expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('سشةحمث')
//     });
//     it('space after normal text followed by arabic text', () => {
// console.log('space after normal text followed by arabic text');
//         editor.openBlank();
//         editor.editor.insertText('سشةحمث');
//         editor.editor.insertText('    ');
//         editor.editor.insertText('sample');
//         expect(editor.selection.start.currentWidget.children[0].characterFormat.bidi).toBe(true)
//         expect((editor.selection.start.currentWidget.children[1] as TextElementBox).text).toBe(' ')
//     });
});

describe('Rtl text editing validation- combination of hebrew and arabic text', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
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
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
//     it('Hebrew text after arabic text insert', () => {
// console.log('Hebrew text after arabic text insert');
//         editor.editor.insertText('سشةحمث');
//         editor.editor.insertText('דשצפךק');
//         expect(editor.selection.start.currentWidget.children[0].characterFormat.bidi).toBe(true)
//         expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('سشةحمث')
//     });
//     it('arabic and english text insert', () => {
// console.log('arabic and english text insert');
//         editor.openBlank();
//         editor.editor.insertText('sample');
//         editor.editor.insertText('سشةحمث');
//         editor.editor.insertText('דשצפךק');
//         expect(editor.selection.start.currentWidget.children[1].characterFormat.bidi).toBe(true)
//         expect((editor.selection.start.currentWidget.children[1] as TextElementBox).text).toBe('سشةحمث')
//     });
//     it('space after arabic text-consider as single text element box-2', () => {
// console.log('space after arabic text-consider as single text element box-2');
//         editor.openBlank();
//         editor.editor.insertText('سشةحمث');
//         editor.editor.insertText('    ');
//         editor.editor.insertText('דשצפךק');
//         expect(editor.selection.start.currentWidget.children[0].characterFormat.bidi).toBe(true)
//         expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('سشةحمث')
//     });
//     it('space after hebrew text followed by arabic text and normal text', () => {
// console.log('space after hebrew text followed by arabic text and normal text');
//         editor.openBlank();
//         editor.editor.insertText('سشةحمث');
//         editor.editor.insertText('    ');
//         editor.editor.insertText('sample');
//         editor.editor.insertText('דשצפךק');
//         expect(editor.selection.start.currentWidget.children[0].characterFormat.bidi).toBe(true)
//         expect((editor.selection.start.currentWidget.children[2] as TextElementBox).text).toBe(' ')
//     });
});

describe('Text helper getRTLlanguage() method validation', () => {
    let textHelper: TextHelper = undefined;
    beforeAll(() => {
        textHelper = new TextHelper(undefined);
    });
    afterAll(() => {
        textHelper = undefined;
    });
    it('input text is undefined', () => {
console.log('input text is undefined');
        let text: RtlInfo = textHelper.getRtlLanguage(undefined);
        expect(text.isRtl).toBe(false);
        expect(text.id).toBe(0);
    });
    it('input text is empty', () => {
console.log('input text is empty');
        let text: RtlInfo = textHelper.getRtlLanguage('');
        expect(text.isRtl).toBe(false);
        expect(text.id).toBe(0);
    });
    it('input text is normal text', () => {
console.log('input text is normal text');
        let text: RtlInfo = textHelper.getRtlLanguage('Sample');
        expect(text.isRtl).toBe(false);
        expect(text.id).toBe(0);
    });
    it('input text is hebrew', () => {
console.log('input text is hebrew');
        let text: RtlInfo = textHelper.getRtlLanguage('דשצפךק');
        expect(text.isRtl).toBe(true);
        expect(text.id).toBe(1);
    });
    it('input text is arabic', () => {
console.log('input text is arabic');
        let text: RtlInfo = textHelper.getRtlLanguage('سشةحمث');
        expect(text.isRtl).toBe(true);
        expect(text.id).toBe(2);
    });
    it('input text is Syriac', () => {
console.log('input text is Syriac');
        let text: RtlInfo = textHelper.getRtlLanguage('ܨܨܨ');
        expect(text.isRtl).toBe(true);
        expect(text.id).toBe(4);
    });
    it('input text is NKo', () => {
console.log('input text is NKo');
        let text: RtlInfo = textHelper.getRtlLanguage('ߍߍߍ');
        expect(text.isRtl).toBe(true);
        expect(text.id).toBe(7);
    });
    it('input text is tifinagh', () => {
console.log('input text is tifinagh');
        let text: RtlInfo = textHelper.getRtlLanguage('ⵙⵇ,ⵃⵍⴻ');
        expect(text.isRtl).toBe(true);
        expect(text.id).toBe(9);
    });
});


