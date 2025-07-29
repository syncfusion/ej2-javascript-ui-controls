import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { Editor } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { TableRowWidget, TableWidget } from '../../blazor/document-editor/implementation/viewer/page';
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