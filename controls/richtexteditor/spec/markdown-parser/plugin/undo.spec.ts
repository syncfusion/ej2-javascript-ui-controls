/**
 * Content renderer spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { MarkdownSelection, MarkdownParser } from '../../../src/markdown-parser/index';


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
        let editorObj: MarkdownParser;
        let textArea: HTMLTextAreaElement = <HTMLTextAreaElement>createElement('textarea', {
            id: 'markdown-editor',
            styles: 'width:200px;height:200px'
        });
        let rangEnd: number;
        let rangStart: number;
        beforeAll(() => {
            document.body.appendChild(textArea);
            editorObj = new MarkdownParser({element:textArea});
            textArea.focus();
        });

        it('undo', () => {
            (<any>editorObj).undoRedoManager.undo();
            textArea.value = 'data';
            editorObj.undoRedoManager.saveData();
            textArea.value = 'datamanager';
            (<any>editorObj).undoRedoManager.keyUp({ event: keyboardEventArgs });
            editorObj.execCommand("Actions", 'Undo', null);
            expect(textArea.value === 'data').toBe(true);
            keyboardEventArgs.keyCode = 17;
            (<any>editorObj).undoRedoManager.keyUp({ event: keyboardEventArgs });
            textArea.value = 'data';
        });
        it('redo', () => {
            (<any>editorObj).undoRedoManager.onAction({subCommand: 'Redo'});
            expect(textArea.value === 'datamanager').toBe(true);
        });
        it('keyboard functionality undo', () => {
            textArea.value = "data";
            rangStart = textArea.selectionStart;
            (<any>editorObj).undoRedoManager.saveData();
            textArea.value = "datamanager";
            (<any>editorObj).undoRedoManager.saveData();
            rangEnd = textArea.selectionStart;
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.keyCode = 90;
            keyboardEventArgs.action = 'undo';
            (<any>editorObj).undoRedoManager.keyDown({ event: keyboardEventArgs });
            expect(textArea.selectionStart === rangStart).toBe(true);
            expect(textArea.value === 'data').toBe(true);
        });
        it('keyboard functionality redo', () => {
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.keyCode = 89;
            (<any>editorObj).undoRedoManager.keyDown({ event: keyboardEventArgs });
            expect(textArea.selectionStart === rangEnd).toBe(true);
            expect(textArea.value === 'datamanager').toBe(true);
            keyboardEventArgs.ctrlKey = false;
            keyboardEventArgs.keyCode = 22;
            (<any>editorObj).undoRedoManager.keyDown({ event: keyboardEventArgs });
        });
        it('undo steps', () => {
            textArea.value = "rte";
            (<any>editorObj).undoRedoManager.saveData();
            textArea.value = "rtecomponent";
            (<any>editorObj).undoRedoManager.saveData();
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.keyCode = 89;
            keyboardEventArgs.action = 'redo';
            (<any>editorObj).undoRedoManager.keyDown({ event: keyboardEventArgs });
            expect(textArea.value === 'rtecomponent').toBe(true);
        });
        afterAll(() => {
            detach(textArea);
        });
    });

});