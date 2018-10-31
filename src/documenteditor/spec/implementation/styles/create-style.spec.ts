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
import { WStyle } from '../../../src/document-editor/implementation/format/style';

describe('New Document - Create and Apply Style', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    let event: any;
    let currentPara: ParagraphWidget = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true,isReadOnly: false, enableSelection: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
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
    it('Character Style', () => {
        editor.openBlank();
        let styleJson: string = '{"type":"Character","name":"Style1","basedOn":"Default Paragraph Font","characterFormat":{"fontFamily":"Algerian"}}'
        let style: WStyle = editor.editorModule.createStyleIn(styleJson) as WStyle;
        editor.editorModule.insertText('Heading', false);
        editor.editorModule.applyStyle(style.name);
        expect(editor.selection.characterFormat.fontFamily).toBe("Algerian");
        event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.viewer.onKeyDownInternal(event);
        editor.editorModule.insertText('Heading', false);
        expect(editor.selection.characterFormat.fontFamily).toBe("Algerian");
    });
    it('Paragraph Style', () => {
        editor.openBlank();
        let styleJson: string = '{"type":"Paragraph","name":"Style3","basedOn":"Normal","next":"Normal","characterFormat":{"bold":true,"italic":true,"underline":"Single","fontSize":24.0,"fontFamily":"Monotype Corsiva"}}'
        let style: WStyle = editor.editorModule.createStyleIn(styleJson) as WStyle;
        editor.editorModule.insertText('Heading', false);
        editor.editorModule.applyStyle(style.name);
        expect(editor.selection.characterFormat.fontFamily).toBe("Monotype Corsiva");
        expect(editor.selection.characterFormat.fontSize).toBe(24.0);
        expect(editor.selection.characterFormat.bold).toBe(true);
        expect(editor.selection.characterFormat.italic).toBe(true);
        expect(editor.selection.characterFormat.underline).toBe('Single');
        expect(editor.selection.characterFormat.fontColor).toBe("#000000");

        event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.viewer.onKeyDownInternal(event);

        editor.editorModule.insertText('Heading', false);
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri");
        expect(editor.selection.characterFormat.fontSize).toBe(11.0);
        expect(editor.selection.characterFormat.bold).toBe(false);
        expect(editor.selection.characterFormat.italic).toBe(false);
        expect(editor.selection.characterFormat.underline).toBe('None');
        expect(editor.selection.characterFormat.fontColor).toBe("#000000");
    });
    it('Paragraph-Character-Linked Style', () => {
        editor.openBlank();
        let styleJson: string = '{"type":"Paragraph","name":"Style2","basedOn":"Normal","next":"Normal","link":"Style2 Char","characterFormat":{"bold":true,"italic":true,"underline":"Single","fontSize":24.0}}'
        let style: WStyle = editor.editorModule.createStyleIn(styleJson) as WStyle;
        editor.editorModule.insertText('Heading', false);
        editor.editorModule.applyStyle(style.name);
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri");
        expect(editor.selection.characterFormat.fontSize).toBe(24.0);
        expect(editor.selection.characterFormat.bold).toBe(true);
        expect(editor.selection.characterFormat.italic).toBe(true);
        expect(editor.selection.characterFormat.underline).toBe('Single');
        expect(editor.selection.characterFormat.fontColor).toBe("#000000");

        event = { keyCode: 13, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.viewer.onKeyDownInternal(event);

        editor.editorModule.insertText('Heading', false);
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri");
        expect(editor.selection.characterFormat.fontSize).toBe(11.0);
        expect(editor.selection.characterFormat.bold).toBe(false);
        expect(editor.selection.characterFormat.italic).toBe(false);
        expect(editor.selection.characterFormat.underline).toBe('None');
        expect(editor.selection.characterFormat.fontColor).toBe("#000000");
    });
});

