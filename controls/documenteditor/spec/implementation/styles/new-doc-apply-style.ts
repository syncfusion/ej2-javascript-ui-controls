import { TextExport } from '../../../src/index';
import { createElement, } from '@syncfusion/ej2-base';
import { StreamWriter } from '@syncfusion/ej2-file-utils';
import { LayoutViewer } from '../../../src/index';
import { SfdtExport } from '../../../src/document-editor/implementation/writer/sfdt-export';
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { Layout } from '../../../src/document-editor/implementation/viewer/layout';
import { ParagraphWidget } from '../../../src/index';

describe('New Document - Edit and Apply Style', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    let event: any;
    let currentPara: ParagraphWidget = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true });
        editor.acceptTab = true;
        (editor as any).viewer.containerCanvasIn = TestHelper.containerCanvas;
        (editor as any).viewer.selectionCanvasIn = TestHelper.selectionCanvas;
        (editor as any).viewer.render.pageCanvasIn = TestHelper.pageCanvas;
        (editor as any).viewer.render.selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = (editor as any).viewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Apply Heading1', () => {
        editor.openBlank();
        editor.editorModule.insertText('Heading', false);
        editor.editorModule.applyStyle('Heading 1');
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
        expect(editor.selection.characterFormat.fontSize).toBe(16.0);
        expect(editor.selection.characterFormat.fontColor).toBe("#2F5496");
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(12.0);
        expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);
        
        event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);

        editor.editorModule.insertText('Heading', false);
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri");
        expect(editor.selection.characterFormat.fontSize).toBe(11.0);
        expect(editor.selection.characterFormat.fontColor).toBe("#000000");
    });
    it('Apply Heading2', () => {
        editor.openBlank();
        editor.editorModule.insertText('Heading', false);
        editor.editorModule.applyStyle('Heading 2');
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
        expect(editor.selection.characterFormat.fontSize).toBe(13.0);
        expect(editor.selection.characterFormat.fontColor).toBe("#2F5496");
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(2.0);
        expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);
        
        event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);

        editor.editorModule.insertText('Heading', false);
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri");
        expect(editor.selection.characterFormat.fontSize).toBe(11.0);
        expect(editor.selection.characterFormat.fontColor).toBe("#000000");
    });
    it('Apply Heading3', () => {
        editor.openBlank();
        editor.editorModule.insertText('Heading', false);
        editor.editorModule.applyStyle('Heading 3');
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
        expect(editor.selection.characterFormat.fontSize).toBe(12.0);
        expect(editor.selection.characterFormat.fontColor).toBe("#1F3763");
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(2.0);
        expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);
        
        event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);

        editor.editorModule.insertText('Heading', false);
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri");
        expect(editor.selection.characterFormat.fontSize).toBe(11.0);
        expect(editor.selection.characterFormat.fontColor).toBe("#000000");
    });
    it('Apply Heading4', () => {
        editor.openBlank();
        editor.editorModule.insertText('Heading', false);
        editor.editorModule.applyStyle('Heading 4');
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
        expect(editor.selection.characterFormat.italic).toBe(true);
        expect(editor.selection.characterFormat.fontColor).toBe("#2F5496");
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(2.0);
        expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);
        
        event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);

        editor.editorModule.insertText('Heading', false);
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri");
        expect(editor.selection.characterFormat.fontSize).toBe(11.0);
        expect(editor.selection.characterFormat.fontColor).toBe("#000000");
    });
    it('Apply Heading5', () => {
        editor.openBlank();
        editor.editorModule.insertText('Heading', false);
        editor.editorModule.applyStyle('Heading 5');
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
        expect(editor.selection.characterFormat.fontColor).toBe("#2F5496");
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(2.0);
        expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);
        
        event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);

        editor.editorModule.insertText('Heading', false);
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri");
        expect(editor.selection.characterFormat.fontSize).toBe(11.0);
        expect(editor.selection.characterFormat.fontColor).toBe("#000000");
    });
    it('Apply Heading6', () => {
        editor.openBlank();
        editor.editorModule.insertText('Heading', false);
        editor.editorModule.applyStyle('Heading 6');
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
        expect(editor.selection.characterFormat.fontColor).toBe("#1F3763");
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(2.0);
        expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);
        
        event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);

        editor.editorModule.insertText('Heading', false);
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri");
        expect(editor.selection.characterFormat.fontSize).toBe(11.0);
        expect(editor.selection.characterFormat.fontColor).toBe("#000000");
    });
    it('Apply Heading1 Char-Link Style', () => {
        editor.openBlank();
        editor.editorModule.insertText('Heading', false);
        editor.editorModule.applyStyle('Heading 6');
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
        expect(editor.selection.characterFormat.fontColor).toBe("#1F3763");
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(2.0);
        expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);
        
        event = { keyCode: 37, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);

        event = { keyCode: 37, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);

        event = { keyCode: 37, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);

        event = { keyCode: 37, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);

        editor.editorModule.applyStyle("Heading 1");

        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
        expect(editor.selection.characterFormat.fontSize).toBe(16.0);
        expect(editor.selection.characterFormat.fontColor).toBe("#2F5496");
    });
    it('Apply Style-MutipleParagraph', () => {
        editor.openBlank();
        editor.editorModule.applyStyle('Heading 2');
        editor.editorModule.insertText('First Paragrapgh', false);
        event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);
        editor.editorModule.applyStyle('Heading 3');
        editor.editorModule.insertText('Second Paragrapgh', false);
        event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);
        editor.editorModule.applyStyle('Heading 4');
        editor.editorModule.insertText('Third Paragrapgh', false);
        event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);
        editor.editorModule.applyStyle('Heading 5');
        editor.editorModule.insertText('Fourth Paragrapgh', false);
        event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);
        
        event = { keyCode: 37, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);
        event = { keyCode: 37, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);
        event = { keyCode: 37, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);
        event = { keyCode: 37, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);
        event = { keyCode: 37, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);
        event = { keyCode: 37, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);

        event = { keyCode: 38, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);

        event = { keyCode: 38, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);

        event = { keyCode: 37, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);
        event = { keyCode: 37, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        (editor as any).viewer.onKeyDownInternal(event);

        editor.editorModule.applyStyle('Heading 1');

        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
        expect(editor.selection.characterFormat.fontSize).toBe(16.0);
        expect(editor.selection.characterFormat.fontColor).toBe("#2F5496");

        editor.editorModule.applyStyle('Heading 3');

        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
        expect(editor.selection.characterFormat.fontSize).toBe(12.0);
        expect(editor.selection.characterFormat.fontColor).toBe("#1F3763");

        editor.editorModule.applyStyle('Heading 1 Char');

        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
        expect(editor.selection.characterFormat.fontSize).toBe(16.0);
        expect(editor.selection.characterFormat.fontColor).toBe("#2F5496");

        editor.editorModule.applyStyle('Heading 6');

        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
        expect(editor.selection.characterFormat.fontColor).toBe("#1F3763");
    });
});