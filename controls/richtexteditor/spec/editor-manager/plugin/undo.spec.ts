/**
 * Content renderer spec
 */
import { selectAll, removeClass } from '@syncfusion/ej2-base';
import { RichTextEditor, Toolbar, NodeSelection } from './../../../src/index';
RichTextEditor.Inject(Toolbar);

import { renderRTE, destroy } from "./../../rich-text-editor/render.spec";

let keyboardEventArgs = {
    preventDefault: function () { },
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    char: '',
    key: '',
    charCode: 22,
    keyCode: 22,
    which: 22,
    code: 22,
    action: ''
};
describe('Undo and Redo module', () => {

    describe('div content-rte testing', () => {
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    enable: false
                },
                undoRedoSteps: 5
            });
        });
        it('Content div testing', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
        });

        it('undo', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            rteObj.getContent().firstElementChild.innerHTML = "<p>data</p>";
            rteObj.formatter.saveData();
            rteObj.getContent().firstElementChild.innerHTML = "<p>dataManager</p>";
            let node: Node= rteObj.contentModule.getEditPanel().childNodes[0];
            new NodeSelection().setSelectionText(document, node.childNodes[0], node.childNodes[0], 11,11);
            (<any>rteObj).formatter.editorManager.undoRedoManager.keyUp({ event: keyboardEventArgs });
            (<any>rteObj).formatter.editorManager.execCommand("Actions", 'Undo', null);
            expect((rteObj.getContent().firstElementChild as HTMLElement).innerText === 'data').toBe(true);
            keyboardEventArgs.keyCode = 17;
            (<any>rteObj).formatter.editorManager.undoRedoManager.keyUp({ event: keyboardEventArgs });
            rteObj.getContent().firstElementChild.innerHTML = "<p>data</p>";
        });
        it('redo', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<any>rteObj).formatter.editorManager.execCommand("Actions", 'Redo', null);
            expect((rteObj.getContent().firstElementChild as HTMLElement).innerText === 'dataManager').toBe(true);
        });
        it('keyboard functionality undo', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            rteObj.getContent().firstElementChild.innerHTML = "<p>data</p>";
            (<any>rteObj).formatter.saveData();
            rteObj.getContent().firstElementChild.innerHTML = "<p>dataManager</p>";
            let node: Node= rteObj.contentModule.getEditPanel().childNodes[0];
            new NodeSelection().setSelectionText(document, node.childNodes[0], node.childNodes[0], 11,11);
            (<any>rteObj).formatter.saveData();
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.keyCode = 90;
            keyboardEventArgs.action = 'undo';
            (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
            expect((rteObj.getContent().firstElementChild as HTMLElement).innerText === 'data').toBe(true);
        });
        it('keyboard functionality redo', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.keyCode = 89;
            (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
            expect((rteObj.getContent().firstElementChild as HTMLElement).innerText === 'dataManager').toBe(true);
            keyboardEventArgs.ctrlKey = false;
            keyboardEventArgs.keyCode = 22;
            (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
        });
        it('undo steps', () => {
            rteObj.getContent().firstElementChild.innerHTML = "<p>rte</p>";
            (<any>rteObj).formatter.saveData();
            rteObj.getContent().firstElementChild.innerHTML = "<p>rtecomponent</p>";
            let node: Node= rteObj.contentModule.getEditPanel().childNodes[0];
            new NodeSelection().setSelectionText(document, node.childNodes[0], node.childNodes[0], 12,12);
            (<any>rteObj).formatter.saveData();
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.keyCode = 89;
            keyboardEventArgs.action = 'redo';
            (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
            expect((rteObj.getContent().firstElementChild as HTMLElement).innerText === 'rtecomponent').toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe(' Toolbar click testing', () => {
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                },
                undoRedoSteps: 5
            });
            let elements: HTMLElement[] = selectAll('.e-toolbar-item');
            for (let i: number = 0; i < elements.length; i++) {
                removeClass([elements[i]], ['e-overlay']);
            }
        });
        it('undo', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            rteObj.getContent().firstElementChild.innerHTML = "<p>data</p>";
            (<any>rteObj).formatter.saveData();
            rteObj.getContent().firstElementChild.innerHTML = "<p>dataManager</p>";
            let node: Node= rteObj.contentModule.getEditPanel().childNodes[0];
            new NodeSelection().setSelectionText(document, node.childNodes[0], node.childNodes[0], 11,11);
            (<any>rteObj).formatter.saveData();
            let trgEle: HTMLElement = <HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0];
            (trgEle.childNodes[0] as HTMLElement).click();
            expect((rteObj.getContent().firstElementChild as HTMLElement).innerText === 'data').toBe(true);
        });
        it('redo', () => {
            let trgEle: HTMLElement = <HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[1];
            (trgEle.childNodes[0] as HTMLElement).click();
            expect((rteObj.getContent().firstElementChild as HTMLElement).innerText === 'dataManager').toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe(' Toolbar click testing', () => {
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                },
                undoRedoSteps: 5
            });
            let elements: HTMLElement[] = selectAll('.e-toolbar-item.e-overlay');
            for (let i: number = 0; i < elements.length; i++) {
                removeClass([elements[i]], ['e-overlay']);
            }
        });
        it('undo', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            rteObj.getContent().firstElementChild.innerHTML = "<p>data</p>";
            (<any>rteObj).formatter.saveData();
            rteObj.getContent().firstElementChild.innerHTML = "<p>dataManager</p>";
            let node: Node= rteObj.contentModule.getEditPanel().childNodes[0];
            new NodeSelection().setSelectionText(document, node.childNodes[0], node.childNodes[0], 11,11);
            (<any>rteObj).formatter.saveData();
            let trgEle: HTMLElement = <HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0];
            (trgEle.childNodes[0] as HTMLElement).click();
            expect((rteObj.getContent().firstElementChild as HTMLElement).innerText.trim() === 'data').toBe(true);
        });
        it('redo', () => {
            let trgEle: HTMLElement = <HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[1];
            (trgEle.childNodes[0] as HTMLElement).click();
            expect((rteObj.getContent().firstElementChild as HTMLElement).innerText.trim() === 'dataManager').toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('rte Iframe content- testing', () => {
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    enable: false
                },
                iframeSettings: {
                    enable: true
                }
            });
        });

        it('Content iframe testing', () => {
            expect(rteObj.element.querySelectorAll('iframe.e-rte-content').length).toBe(1);
        });
        it('iframe-undo', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            rteObj.contentModule.getEditPanel().innerHTML = "<p>data</p>";
            (<any>rteObj).formatter.saveData();
            rteObj.contentModule.getEditPanel().innerHTML = "<p>dataManager</p>";
            let node: Node= rteObj.contentModule.getEditPanel().childNodes[0];
            new NodeSelection().setSelectionText(rteObj.contentModule.getDocument(), node.childNodes[0], node.childNodes[0], 11,11);
            keyboardEventArgs.ctrlKey = false;
            (<any>rteObj).formatter.editorManager.undoRedoManager.keyUp({ event: keyboardEventArgs });
            (<any>rteObj).formatter.editorManager.execCommand("Actions", 'Undo', null);
            expect((rteObj.contentModule.getEditPanel() as HTMLElement).innerText === 'data').toBe(true);
        });
        it('iframe-redo', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<any>rteObj).formatter.editorManager.execCommand("Actions", 'Redo', null);
            expect((rteObj.contentModule.getEditPanel() as HTMLElement).innerText === 'dataManager').toBe(true);
        });
        it('iframe-keyboard functionality undo', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            rteObj.contentModule.getEditPanel().innerHTML = "<p>data</p>";
            (<any>rteObj).formatter.saveData();
            rteObj.contentModule.getEditPanel().innerHTML = "<p>dataManager</p>";
            let node: Node= rteObj.contentModule.getEditPanel().childNodes[0];
            new NodeSelection().setSelectionText(rteObj.contentModule.getDocument(), node.childNodes[0], node.childNodes[0], 11,11);
            (<any>rteObj).formatter.saveData();
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.keyCode = 90;
            keyboardEventArgs.action = 'undo';
            (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
            expect((rteObj.contentModule.getEditPanel() as HTMLElement).innerText === 'data').toBe(true);
        });
        it('iframe-keyboard functionality redo', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.keyCode = 89;
            (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
            expect((rteObj.contentModule.getEditPanel() as HTMLElement).innerText === 'dataManager').toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

});