import { createElement } from "@syncfusion/ej2-base";
import { DocumentEditor } from "../../src/document-editor/document-editor";
import { TestHelper } from "../test-helper.spec";
import { Editor } from "../../src/index";
import { Selection } from "../../src/index";

describe ('Document Editor properties pane', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() : void => {
        let ele : HTMLElement = createElement('div', { id : 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSfdtExport: true });
        DocumentEditor.Inject(Editor, Selection);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll(() : void => {
        if(editor){
            editor.destroy();
        }
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
    });
    it('Check text style not changing after applying Heading 1 style', () => {
        editor.editor.insertText("Normal");
        editor.selection.characterFormat.bold = true;
        editor.editor.insertText("Bold");
        editor.selection.characterFormat.bold = false;
        editor.selection.characterFormat.italic = true;
        editor.editor.insertText("Italic");
        editor.selection.characterFormat.italic = false;
        editor.selection.characterFormat.underline = "Dash";
        editor.editor.insertText("Underline");
        editor.selection.characterFormat.underline = "None";
        editor.selection.characterFormat.strikethrough = "SingleStrike";
        editor.editor.insertText("Strikethrough");
        editor.selection.characterFormat.strikethrough = "None";
        editor.selection.characterFormat.baselineAlignment = "Superscript";
        editor.editor.insertText("Superscript");
        editor.selection.characterFormat.baselineAlignment = "Normal";
        editor.selection.characterFormat.baselineAlignment = "Subscript";
        editor.editor.insertText("Subscript");
        editor.selection.characterFormat.baselineAlignment = "Normal";
        
        editor.editor.applyStyle("Heading 1");

        editor.selection.select('0;0;0', '0;0;5');
        expect(editor.selection.characterFormat.bold).toBe(false);
        expect(editor.selection.characterFormat.fontSize).toBe(16);
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");

        editor.selection.select('0;0;6', '0;0;9');
        expect(editor.selection.characterFormat.bold).toBe(true);
        expect(editor.selection.characterFormat.fontSize).toBe(16);
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");

        editor.selection.select('0;0;10', '0;0;15');
        expect(editor.selection.characterFormat.italic).toBe(true);
        expect(editor.selection.characterFormat.fontSize).toBe(16);
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");

        editor.selection.select('0;0;16', '0;0;24');
        expect(editor.selection.characterFormat.underline).toBe("Dash");
        expect(editor.selection.characterFormat.fontSize).toBe(16);
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");

        editor.selection.select('0;0;25', '0;0;37');
        expect(editor.selection.characterFormat.strikethrough).toBe("SingleStrike");
        expect(editor.selection.characterFormat.fontSize).toBe(16);
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");

        editor.selection.select('0;0;38', '0;0;48');
        expect(editor.selection.characterFormat.baselineAlignment).toBe("Superscript");
        expect(editor.selection.characterFormat.fontSize).toBe(16);
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");

        editor.selection.select('0;0;49', '0;0;57');
        expect(editor.selection.characterFormat.baselineAlignment).toBe("Subscript");
        expect(editor.selection.characterFormat.fontSize).toBe(16);
        expect(editor.selection.characterFormat.fontFamily).toBe("Calibri Light");
    });
    
});