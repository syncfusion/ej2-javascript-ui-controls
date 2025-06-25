/**
 * Undo Redo spec
 */
import { selectAll, removeClass } from '@syncfusion/ej2-base';
import { RichTextEditor, NodeSelection, ToolbarStatusEventArgs } from './../../../src/index';
import { IToolbarStatus } from './../../../src/common/interface';
import { renderRTE, destroy, setCursorPoint } from "./../../rich-text-editor/render.spec";

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
    describe('undo redo status testing with custom tool', () => {
        let rteObj: RichTextEditor;
        let mdsource: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'Italic', 'StrikeThrough', '|',
                    'Formats', 'OrderedList', 'UnorderedList', '|',
                    'CreateLink', 'Image', 'CreateTable', '|',
                    {
                        tooltipText: 'Preview',
                        template: '<button id="preview-code" class="e-tbar-btn  e-control e-btn e-icon-btn">' +
                        '<span class="e-btn-icon e-md-preview e-icons"></span></button>'
                    }, '|','undo', 'redo']
                },
                undoRedoSteps: 5,
                editorMode: 'Markdown',
                updatedToolbarStatus: function statusUpdate() {
                    if (mdsource.classList.contains('e-active')) {
                        rteObj.disableToolbarItem(['Undo', 'Redo'], true);
                    }
                },
                created: () => {
                    mdsource = document.getElementById('preview-code');
                    mdsource.addEventListener('click', (e: Event) => {
                        if (mdsource.classList.contains('e-active')) {
                            mdsource.classList.remove('e-active');    
                            rteObj.disableToolbarItem(['Undo', 'Redo'],true);

                        } else {
                            mdsource.classList.add('e-active'); 
                            rteObj.enableToolbarItem(['Undo', 'Redo'],true);                          
                        }
                    });                   
                },
            });
        });
        it('check after custom tool click', () => {
            var undoElement = document.querySelector('[title="Undo (Ctrl+Z)"]');
            var redoElement = document.querySelector('[title="Redo (Ctrl+Y)"]');
            rteObj.value = 'Markdown content updated';
            rteObj.dataBind();
            rteObj.formatter.saveData();
            rteObj.formatter.enableUndo(rteObj);
            expect(undoElement.classList.contains('e-overlay')).toBe(true);
            expect(redoElement.classList.contains('e-overlay')).toBe(true);
            rteObj.value = ' updated';
            rteObj.dataBind();
            rteObj.formatter.saveData();
            rteObj.formatter.enableUndo(rteObj);
            expect(undoElement.classList.contains('e-overlay')).toBe(false);
            expect(redoElement.classList.contains('e-overlay')).toBe(true);
            mdsource.click();
            expect(undoElement.classList.contains('e-overlay')).toBe(false);
            expect(redoElement.classList.contains('e-overlay')).toBe(true);
            mdsource.click();
            expect(undoElement.classList.contains('e-overlay')).toBe(false);
            expect(redoElement.classList.contains('e-overlay')).toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe(' BLAZ-11465 - Undo/Redo updatedToolbarStatus with toolbar action testing', () => {
        let controlId: string;
        let eventArgs: any;
        let status: IToolbarStatus;
        let rteObj: RichTextEditor;
        let editNode: HTMLElement;
        let domSelection: NodeSelection = new NodeSelection();
        let innervalue: string = '<div id="div1"><p id="paragraph1"><b>Description:</b></p>' +
        '<p id="paragraph2">The Rich Text Editor (RTE) control is an easy to render in' +
        'client side. Customer easy to edit the contents and get the HTML content for' +
        'the displayed content. A rich text editor control provides users with a toolbar' +
        'that helps them to apply rich text formats to the text entered in the text' +
        'area. </p></div>';
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo', '|', 'Bold']
                },
                value: innervalue,
                updatedToolbarStatus: (e: ToolbarStatusEventArgs) => {
                    status = e.html;
                    eventArgs = e;
                }
            });
            editNode = rteObj.contentModule.getEditPanel() as HTMLDivElement;
            editNode.style.width = "200px;";
            editNode.style.height = "200px";
            controlId = rteObj.element.id;
        });
        it(' toolbar interaction ', () => {
            let node: Node = document.getElementById('paragraph2');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 2, 6);
            (rteObj as any).mouseUp({ target: editNode });
            expect(eventArgs.undo).toEqual(false);
            expect(eventArgs.redo).toEqual(false);
            document.getElementById(controlId + "_toolbar_Bold").click();
            expect(eventArgs.undo).toEqual(true);
            expect(eventArgs.redo).toEqual(false);
            expect(status.bold).toEqual(true);
            document.getElementById(controlId + "_toolbar_Undo").click();
            expect(status.bold).toEqual(false);
            expect(eventArgs.undo).toEqual(false);
            expect(eventArgs.redo).toEqual(true);
            document.getElementById(controlId + "_toolbar_Redo").click();
            expect(eventArgs.undo).toEqual(true);
            expect(eventArgs.redo).toEqual(false);
            expect(status.bold).toEqual(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe(' BLAZ-11465 - Undo/Redo updatedToolbarStatus with keyboard action testing', () => {
        let controlId: string;
        let eventArgs: ToolbarStatusEventArgs;
        let status: IToolbarStatus;
        let rteObj: RichTextEditor;
        let editNode: HTMLElement;
        let domSelection: NodeSelection = new NodeSelection();
        let keyboardEventArgs = {
            preventDefault: function () { },
            stopPropagation: () => { },
            type: 'keydown', ctrlKey: false, shiftKey: false, action: '', which: 8
        };
        let innervalue: string = '<div id="div1"><p id="paragraph1"><b>Description:</b></p>' +
        '<p id="paragraph2">The Rich Text Editor (RTE) control is an easy to render in' +
        'client side. Customer easy to edit the contents and get the HTML content for' +
        'the displayed content. A rich text editor control provides users with a toolbar' +
        'that helps them to apply rich text formats to the text entered in the text' +
        'area. </p></div>';
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo', '|', 'Bold']
                },
                value: innervalue,
                updatedToolbarStatus: (e: ToolbarStatusEventArgs) => {
                    status = e.html;
                    eventArgs = e;
                }
            });
            editNode = rteObj.contentModule.getEditPanel() as HTMLDivElement;
            editNode.style.width = "200px;";
            editNode.style.height = "200px";
            controlId = rteObj.element.id;
        });
        it(' keyboard interaction ', () => {
            let node: Node = document.getElementById('paragraph2');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 2, 6);
            (rteObj as any).mouseUp({ target: editNode });
            expect(eventArgs.undo).toEqual(false);
            expect(eventArgs.redo).toEqual(false);
            keyboardEventArgs.action = 'bold';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.shiftKey = false;
            (rteObj as any).keyDown(keyboardEventArgs);
            expect(eventArgs.undo).toEqual(true);
            expect(eventArgs.redo).toEqual(false);
            expect(status.bold).toEqual(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Additional test for Undo button with clearUndoRedo', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                },
                undoRedoSteps: 5
            });
        });
        it('should check e-overlay class is managed correctly for undo button', () => {
            const undoButton = document.querySelector('[title="Undo (Ctrl+Z)"]') as HTMLElement;
            rteObj.value = ' updated';
            rteObj.dataBind();
            rteObj.formatter.saveData();
            rteObj.formatter.enableUndo(rteObj);
            expect(undoButton.classList.contains('e-overlay')).toBe(true);
            rteObj.value = 'Markdown content updated';
            rteObj.dataBind();
            rteObj.formatter.saveData();
            rteObj.formatter.enableUndo(rteObj);
            expect(undoButton.classList.contains('e-overlay')).toBe(false);
            rteObj.clearUndoRedo();
            rteObj.formatter.enableUndo(rteObj);
            expect(undoButton.classList.contains('e-overlay')).toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('964457 - Not able to resize the video', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                },
                value: `<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px; height: 200px; outline: rgb(74, 144, 226) solid 2px;" class="e-rte-image e-imginline e-resize e-img-focus"></p>
                        <span class="e-img-resize" id="insertMediaRTE_imgResize"><span class="e-rte-imageboxmark e-rte-topLeft" style="cursor: nwse-resize; left: 15px; top: 10px;"></span><span class="e-rte-imageboxmark e-rte-topRight" style="cursor: nesw-resize; left: 317px; top: 10px;"></span><span class="e-rte-imageboxmark e-rte-botLeft" style="cursor: nesw-resize; left: 15px; top: 210px;"></span><span class="e-rte-imageboxmark e-rte-botRight" style="cursor: nwse-resize; left: 317px; top: 210px;"></span></span>`
            });
        });
        it('Should not store the resizable element in the stack', () => {
            let img: HTMLElement = rteObj.element.querySelector('img');
            img.click();
            setCursorPoint(img, 0);
            (rteObj as any).mouseUp({ target: img });
            expect((rteObj.formatter.editorManager.undoRedoManager.undoRedoStack[0].text as DocumentFragment).querySelectorAll('.e-img-resize').length === 0).toBe(true);
            expect((rteObj.formatter.editorManager.undoRedoManager.undoRedoStack[0].text as DocumentFragment).querySelectorAll('.e-img-focus').length === 0).toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
});
