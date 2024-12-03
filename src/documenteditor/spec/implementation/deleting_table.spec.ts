import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { SfdtExport } from '../../src/document-editor/implementation/writer/sfdt-export';
/**
 * Deleting table of content
 */
let sfdtContent: any ='{"sfdt":"UEsDBAoAAAAIAEJmLFmodiA0KQQAAMMfAAAEAAAAc2ZkdO2ZWW/bOBCA/4rBfXUN3bL0tujCuw+LRYH2aYM86KKkhDpK0VWaIP99hxwq8SEnSpPGKrAOnKF5zvGRHEh3pGlFWZW32WeaChIKvs2WpMsSEl7cEZAtJ+EdaXsSeqa1JG1BQj+AAqugAJJrKbSMtSxSEtreklAtU9qS0ADZZFiISxSwEvkn6z9FeUaWJKspCWE4lRKaeTnITMmS1iQ0QWYo27zuYILfeRSXCYyvk4Z1qiX72ivJYpGoodhycXkPiyrruPqPlmJNS6Wxcco7KQUoege9mUDJc5Sx/l2g+CaF7FbWah2qZSdqaVrDq4gR2Ux1x4TiwBLXxzXhB41Yl0G9YLAwibqU5kRankq1iVPWjdWbPRU39dXXrLkqErNKyeU9/MEYHaipuqeplttRWzrdLONu2Q7o/FAAL7bKsbxXBWmQDOX9co5evL4qcvrreNFUWnDUolAOKATuk7dRKY/VbHmkd9UzXpFBnesGge1RXO2EVtRb12WGt+bsJmor+9axTOv//THBide/jBfPtD9OOUVqk3OY8UJqDV+pXcxGnETk3QMzMrDQWLmDgsfVSt/j6ni895g1x72+jdTuuH9ASl7hBt7o7srBK14VYmxoe6E4ltGBQ8GSRL+K5UnsKvAKbLlcDiBrjlUXXaLdLQACyFDoQj5GrIx5CdNu9T5BTDCwBaYEMERuCRwkSzvDouRxZhrtNVHITrKDmr0KyfRbbHJ+sNkFah9jKCMdUcx3mLawYQ/plVb/Wq46lPv6odwnQ7736HnaaY0EZRot0WMGJ9MoU2do0oWgLAHTOy1pheu3KNJCVKgJpahg0lStDsV32CSopaJdpoC/bdSHKCy+qzNrDw49+eu8eshXffO4hKRZrvhXFqVlnS/Mt1r02VDKvHo3livDD0zP81zD9y0jcPz94JpHlmj0vX30F3+XORyOUKn8a21cJ/DIAc2PnfaZ3qkfqcYUemfn7vpt8bGIOHnGuUMngWic04o/MhptmVh8iniU86gtFpumFg8qn2jeU/3+0D7r3eB5GTvWKXbsWbBjTWHHOs2OPTN2BpXtmeJgn8LBetKR5sb2Pfvn42BPwcE+jcO7WzERB2emODjHOJRDijCD08GZgoMzhsOZrJiIgztTHNyR0+H8FLhTKHBHD4U5Bt+bafC9FwX/vW4Eb0rwvRcG/3wXgT/T4Ps/dhG8FwX+FAr8H70IzofDeqY4rE+licbKfdKVtvr8fCDWU4BYn04Uz2DHRCSCmSIRPHVCzIqNYAobwdOHxYwhyfjbEDL+MPH4kdmen5VLtRaDUpumEedXSmshnxgz9RQZJmMokwolvv6Vofpzm3Vise2U2vItOLEMy/lgBB9M64tphnYQmt4KdsO/8kUJIsLLFPqdeHEmffG6icffOKgH4DeoflnlnXLDf1BLAQIUAAoAAAAIAEJmLFmodiA0KQQAAMMfAAAEAAAAAAAAAAAAAAAAAAAAAABzZmR0UEsFBgAAAAABAAEAMgAAAEsEAAAAAA=="}';
describe('907890-Resolve script error when deleting table', () => {
    let editor: DocumentEditor = undefined;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('deleting the table of content', () => {
        editor.open(sfdtContent);
        editor.selection.select('0;0;0;0;0;5','0;0;1;1;0;7');
        expect(() => { editor.editor.onBackSpace(); }).not.toThrowError();
        expect(editor.revisions.length).toBe(0);
        //undo process
        expect(() => { editor.editorHistory.undo(); }).not.toThrowError();
        expect(editor.revisions.length).toBe(2);
        //redo process
        expect(() => { editor.editorHistory.redo(); }).not.toThrowError();
        expect(editor.revisions.length).toBe(0);
    });
   
});



