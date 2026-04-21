import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../test-helper.spec';
import { ParagraphWidget, Selection, TableWidget } from '../../src/index';
import { Editor } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { TableRowWidget} from '../../blazor/document-editor/implementation/viewer/page';
import { WRowFormat } from '../../blazor/document-editor/implementation/format/row-format';

describe('validation for Tracking changes of DocumentEditor errors', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1000px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Deleting the already deleting content multiple times while track changes enabled', () => {
        let sfdtText = '{"sfdt":"UEsDBBQAAAAIAIFWWVn5dzrk5AIAAG0VAAAEAAAAc2ZkdNyYS2+bQBDHv4q1vVoRz8Vwq1JZPVRRpB7bHBZ7eSgYEKzlNhbfvTO7GMdoTUBKndg+sMPsa+b/W7A9e1KUIt2kL/xntBYkENWWz0nNVyT4tSehvKbyKrKSBMQkzVMzP/VZGp+t8Tkan6vxUY3P0/gWGp+Pvqc5SSIS7BuZSVmBSZI1CWx6Z8xJ1FnljgTUtKSZkMDzpZltwJRW1Vmis8LOWkewIbYFV0YIgeCsMpdtWauW5xCLBftii/3poeVqXJzXEPnXioXpisAyoD154LtHFnPSYDIrTAZhwGi1x1Zea6H2ZbKJ6hcSmKZMESaQe5alYZUS2YOxHfrQft0bwfyT+4j3HHnPwyBEA9QtZWBZiolKwTor6qywbg12MDIwZChZm0CRyUaoPJ53SrfnTPXuYDMTNgtj3AzF+bJsPwQJi7+KvxwMU8lDUW1YBmHmf453eFCOQ75ztk7zeGai3uemQICvh87uE1aRAw2lNu2rPfuRxolA0WSg1tJ1fAqB9mQ+DjsR+5U71/gnKK5OdV9yzzcppa7heZbhO94pAbMl0LRSmT2pDvmjXt94xLaZmD2yisUVK5PZssjFx4pzGvaZCPXHwBp/DCzdMbA/6zGYfgqs4VNgTT4FF9ZGD9geD9jWAbbeSMJc2h61rwKwPQzYngz4wtroATvjATungPGL8VYeXmeYrTOB7aVl0WN1x2N1e8/tTQB1h4G6Ux7WD0ZJx6Oko1Fe0XuXDqOk74PyIi9bbzxKb+LL9oqAesNAvfd82V4E62I81oXuR5Jx5w4mYcvPVbBdDLNdTP6RdGFt9ID98YB97XN7a5j9Ycz+9Ef4c8DmlZZ016UUPVeQ6S24LApxZsGu660FoYi1FlBtaytwG7W6wMoOTFZ3sk6G9bREbFRBiIkKanfy3wUuiCU03AbsXlXy99YwDFlyxGrZmX5ZfsR+WKTth3s4X/y/rLoqNqosCAUqEWJCzT8AAAD//wMAUEsBAi0AFAAAAAgAgVZZWfl3OuTkAgAAbRUAAAQAAAAAAAAAAAAgAAAAAAAAAHNmZHRQSwUGAAAAAAEAAQAyAAAABgMAAAAA"}';
        editor.open(sfdtText);
        editor.selection.select('0;1;0', '0;1;2');
        editor.editor.handleDelete();
        editor.selection.select('0;3;0', '0;3;2');
        editor.editor.handleDelete();
        editor.selection.select('0;4;0', '0;4;2');
        editor.editor.handleDelete();
        editor.selection.select('0;1;0', '0;4;2');
        editor.editor.handleDelete();
        editor.editor.handleDelete();
        expect(() => { editor.editor.handleDelete() }).not.toThrowError();
    })
});
describe('Track changes - script error issue', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1000px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('track changes script error issue', () => {
        editor.enableTrackChanges = true;
        editor.editor.insertText('HelloWorld');
        editor.editor.onEnter();
        editor.editor.insertTable(2,2);
        editor.selection.select('0;0;0', '0;1;0;0;0;1');
        editor.editor.delete();
        editor.revisions.acceptAll();
        editor.editorHistory.undo();
        expect(() => { editor.editorHistory.undo(); }).not.toThrowError();
    })
});
describe('Track changes - To update the removed revision for row', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1000px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('To update the removed revision for row', () => {
        editor.enableTrackChanges = true;
        editor.editor.insertText('HelloWorld');
        editor.editor.onEnter();
        editor.editor.insertTable(2,2);
        editor.enableTrackChanges = false;
        editor.selection.select('0;0;0', '0;1;0;0;0;1');
        editor.editor.delete();
        editor.editorHistory.undo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat as WRowFormat).revisions.length).toBe(1);
    })
});
describe('Track changes - deletecell script error', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1000px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('deletecell script error', () => {
        editor.openBlank();
        editor.editor.insertTable(2,2);
        editor.enableTrackChanges = true;
        editor.selection.select('0;0;0;0;0;0', '0;0;0;0;0;0');
        editor.editor.insertText('HelloWorld');
        editor.editor.insertTable(2,2);
        editor.enableTrackChanges = false;
        editor.selection.select('0;0;0;0;0;0', '0;0;0;0;2;1');
        editor.editor.delete();
        expect(editor.revisions.length).toBe(0);
    })
});
describe('Track changes - para to whole table deletion redo script error', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1000px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('para to whole table deletion - redo script error', () => {
        editor.openBlank();
        editor.editor.insertText('HelloWorld');
        editor.editor.insertTable(2,2);
        editor.enableTrackChanges = true;
        editor.selection.selectAll();
        editor.editor.delete();
        editor.revisions.acceptAll()
        editor.editorHistory.undo();
        editor.editorHistory.undo();
        editor.editorHistory.redo()
        expect(() => { editor.editorHistory.redo(); }).not.toThrowError();
    })
});
describe('Track changes - para to whole table deletion undo script error', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1000px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('para to whole table deletion undo script error', () => {
        editor.enableTrackChanges = true;
        editor.editor.insertTable(2,2);
        editor.editor.insertText('HelloWorld');
        editor.editor.insertTable(2,2);
        editor.currentUser = 'Synfusion';
        editor.selection.select('0;0;0;0;0;0', '0;0;0;0;1;1;1;0;1');
        editor.editor.delete();
        editor.selection.select('0;0;0;1;0;0', '0;0;0;1;0;0');
        editor.editor.insertColumn();
        editor.editorHistory.undo();
        expect(() => { editor.editorHistory.undo(); }).not.toThrowError();
    })
});
describe('Track changes - revision removed issue in nested table', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1000px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('revision removed issue in nested table', () => {
        editor.enableTrackChanges = true;
        editor.editor.insertTable(2,2);
        editor.editor.insertText('HelloWorld');
        editor.selection.select('0;0;0;0;0;0', '0;0;0;0;0;0');
        editor.editor.insertTable(2,2);
        editor.currentUser = 'Synfusion';
        editor.selection.select('0;0;0;0;0;0;0;0;0', '0;0;0;0;1;11');
        editor.editor.delete();
        editor.editorHistory.undo();
        expect(editor.revisions.length).toBe(1);
    })
});
describe('Track changes - para to table combination deletion', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1000px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('para mark to table deletion', () => {
        editor.editor.insertText('Hello');
        editor.editor.insertTable(2,2);
        editor.selection.select('0;2;0', '0;2;0');
        editor.editor.insertText('World');
        editor.selectionModule.toggleTextAlignment('Center');
        editor.enableTrackChanges = true;
        editor.selection.select('0;0;5', '0;1;1;1;0;1');
        editor.editor.delete();
        expect(editor.revisions.length).toBe(2);
        expect(editor.revisions.changes.length).toBe(7);
        editor.editorHistory.undo();
        expect(editor.revisions.length).toBe(0);
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets).length).toBe(3);
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[2] as ParagraphWidget).paragraphFormat.textAlignment).toBe('Center');
        editor.editorHistory.redo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets).length).toBe(3);
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[2] as ParagraphWidget).paragraphFormat.textAlignment).toBe('Center');
        expect(editor.revisions.length).toBe(2);
        expect(editor.revisions.changes.length).toBe(7);
    });
    it('para mid position to table deletion', () => {
        editor.enableTrackChanges = false;
        editor.editor.insertText('Hello');
        editor.editor.insertTable(2,2);
        editor.selection.select('0;2;0', '0;2;0');
        editor.editor.insertText('World');
        editor.selectionModule.toggleTextAlignment('Center');
        editor.enableTrackChanges = true;
        editor.selection.select('0;0;2', '0;1;1;1;0;1');
        editor.editor.delete();
        expect(editor.revisions.length).toBe(2);
        expect(editor.revisions.changes.length).toBe(8);
        editor.editorHistory.undo();
        expect(editor.revisions.length).toBe(0);
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets).length).toBe(3);
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[2] as ParagraphWidget).paragraphFormat.textAlignment).toBe('Center');
        editor.editorHistory.redo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets).length).toBe(3);
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[2] as ParagraphWidget).paragraphFormat.textAlignment).toBe('Center');
        expect(editor.revisions.length).toBe(2);
        expect(editor.revisions.changes.length).toBe(8);
    })
    it('deletion of partial para to full table and partial para', () => {
        editor.enableTrackChanges = false;
        editor.editor.insertText('Hello');
        editor.editor.insertTable(2,2);
        editor.selection.select('0;2;0', '0;2;0');
        editor.editor.insertText('World');
        editor.selectionModule.toggleTextAlignment('Center');
        editor.enableTrackChanges = true;
        editor.selection.select('0;0;2', '0;2;3');
        editor.editor.delete();
        expect(editor.revisions.length).toBe(3);
        expect(editor.revisions.changes.length).toBe(9);
        editor.editorHistory.undo();
        expect(editor.revisions.length).toBe(0);
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets).length).toBe(3);
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[2] as ParagraphWidget).paragraphFormat.textAlignment).toBe('Center');
        editor.editorHistory.redo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets).length).toBe(3);
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[2] as ParagraphWidget).paragraphFormat.textAlignment).toBe('Center');
        expect(editor.revisions.length).toBe(3);
        expect(editor.revisions.changes.length).toBe(9);
    })
});
describe('Track changes - combined untracked and content of para to table row deletion', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1000px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('combined untracked and content of para to table row deletion', () => {
        editor.enableTrackChanges = false;
        editor.editor.insertText('Hello');
        editor.enableTrackChanges = true;
        editor.editor.insertText('World');
        editor.editor.onEnter()
        editor.editor.insertTable(2,2);
        editor.selection.select('0;0;0', '0;1;0;1;0;1');
        editor.editor.delete();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] instanceof TableWidget)).toBe(true);
        editor.editorHistory.redo();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
    })
});