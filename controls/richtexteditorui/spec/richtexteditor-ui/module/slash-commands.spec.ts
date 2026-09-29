import { RichTextEditorUI } from '../../../src';
import { renderRTE, destroyRTE } from '../../base.spec';


describe('Slash Commands Module', () => {
    let editor: RichTextEditorUI;
    beforeEach(()=> {
        editor = renderRTE({
            slashCommandSettings: {
                enable: true
            }
        })
    });
    afterEach(()=> {
        destroyRTE(editor);
    });
    it ('Should render after the initialize end', ()=> {
        expect(editor.slashCommandModule.mentionPopup.mention.target).toBe(editor.inputElement);
    });
});
