import { DocumentEditorContainer } from '../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../src/document-editor-container/tool-bar/tool-bar';
import { createElement } from '@syncfusion/ej2-base';
/**
 * Document Editor container ParaMark toggling
 */
let sfdtText = '{"sfdt":"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"}';
describe('Document Editor container ParaMark toggling ', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer();
        container.appendTo(element);
    });
    afterAll(() => {
        container.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        expect(() => { container.destroy(); }).not.toThrowError();
        document.body.innerHTML = '';
        element = undefined;
        container = undefined;
    });
    it('Default ShowHiddenMarks property', (done) => {
        console.log('Default ShowHiddenMarks property');
        container.documentEditor.open(sfdtText);
        let ele: Element = document.getElementById("e-de-tc-pane-revision");
        expect((ele as HTMLDivElement).classList.contains('e-de-tc-hide-para-mark')).toBe(true);
        expect((ele as HTMLDivElement).className).toBe('e-de-tc-hide-para-mark');
        expect((ele as HTMLDivElement).classList.length).toBe(1);
        container.documentEditorSettings = { showHiddenMarks: true };
        setTimeout(() => {
            expect((ele as HTMLDivElement).classList.length).toBe(0);
            expect((ele as HTMLDivElement).className).toBe('');
            container.documentEditorSettings = { showHiddenMarks: false };
            setTimeout(() => {
                expect((ele as HTMLDivElement).classList.contains('e-de-tc-hide-para-mark')).toBe(true);
                expect((ele as HTMLDivElement).className).toBe('e-de-tc-hide-para-mark');
                expect((ele as HTMLDivElement).classList.length).toBe(1);
                done();
            }, 100);
        }, 100);
    });
});