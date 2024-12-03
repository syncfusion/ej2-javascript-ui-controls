import { DialogType, RichTextEditor } from "../../../src/rich-text-editor/base";
import { renderRTE } from "../../rich-text-editor/render.spec";

describe('Markdown Parser base module ', () => {
    let editor: RichTextEditor;
    beforeAll(() => {
        editor = renderRTE({
            editorMode: 'Markdown'
        });
    });
    afterAll(() => {
        editor.destroy();
    });
    it ('Calling the image show dialog programmatically', () => {
        editor.showDialog(DialogType.InsertImage);
        expect(document.body.querySelector('.e-rte-img-dialog')).not.toBe(null);
    });
});