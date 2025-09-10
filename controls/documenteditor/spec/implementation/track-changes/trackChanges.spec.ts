import { Toolbar } from "../../../src/document-editor-container/tool-bar/tool-bar"
import { createElement } from "@syncfusion/ej2-base";
import { TestHelper } from "../../test-helper.spec";
import { DocumentEditor } from "../../../src/document-editor/document-editor";
import { Editor } from "../../../src/document-editor/implementation/editor/editor";
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { EditorHistory } from "../../../src/document-editor/implementation/editor-history/editor-history";
import { SfdtExport } from "../../../src/document-editor/implementation/writer/sfdt-export";
import { FootnoteEndnoteMarkerElementBox, HeaderFooterWidget, LineWidget, ParagraphWidget, TableCellWidget, TableRowWidget, TableWidget, TextElementBox } from "../../../src/document-editor/implementation/viewer/page";
import { WRowFormat } from "../../../src/document-editor/implementation/format/row-format";
describe('Track changes Validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Enabling Tracking Changes  And enabling Readonly mode', function () {
        console.log('Enabling Tracking Changes And enabling Readonly mode');
        container.currentUser = "Guest";
        container.editor.insertText("Hello");
        container.enableTrackChanges = true;
        container.editor.insertText("world");
        container.isReadOnly = true;
        container.revisions.acceptAll();
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
});
describe('Track changes Pane in RTL Validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableRtl: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track Changes Pane close button validation', function () {
        console.log('Track Changes Pane close button validation');
        let left: string = container.trackChangesPane.closeButton.style.left;
        let right: string = container.trackChangesPane.closeButton.style.right;
        expect(left).toBe('1px');
        expect(right).toBe('');
    });
});

describe('Track changes in Table validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableRtl: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Delete Table validation when Track Changes is enabled', () => {
        console.log('Delete Table validation when Track Changes is enabled');
        container.enableTrackChanges = true;
        container.currentUser = "Guest User";
        container.editor.insertTable(2, 2);
        container.selection.moveToDocumentStart();
        container.editor.deleteTable();
        let flag : number = 0;
        if(!(container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] instanceof TableWidget)) {
            flag = 1;
        } 
        expect(flag).not.toBe(0);
    });

});

describe('Track changes Select all and replace text', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableRtl: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track changes Select all and replace text and insert new para validation', () => {
        console.log('Track changes Select all and replace text and insert new para validation');
        container.enableTrackChanges = true;
        container.editor.insertText("Hello");
        container.selection.selectAll();
        container.editor.insertText("Hello");
        container.editor.onEnter();
        container.editor.insertText("World");
        var count = container.revisions.changes.length;
        expect(count).toBe(3);
        expect(container.revisions.length).toBe(1);
    });
});
describe('Track changes hyperlink reject validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Test hyperlink formatting preservation on rejecting action', function () {
        console.log('Test hyperlink formatting preservation on rejecting action');
        container.openBlank();
        container.editor.insertHyperlink('https://www.syncfusion.com/', 'Syncfusion');
        container.enableTrackChanges = true;
        container.selection.select('0;0;0', '0;0;43');
        container.editor.removeHyperlink();
        container.revisions.changes[0].reject();
        container.selection.select('0;0;43', '0;0;53');
        expect(container.selection.characterFormat.underline).toBe('Single');
        expect(container.selection.characterFormat.fontColor).toBe('#0563c1');
    });
});
describe('Track changes hyperlink inserting validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableRtl: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track changes hyperlink inserting validation', () => {
        console.log('Track changes hyperlink inserting validation');
        container.enableTrackChanges = true;
        container.editor.insertText("Google");  
        container.selection.select('0;0;0', '0;0;6');
        container.editor.insertHyperlink('https://www.syncfusion.com/', container.selection.text, container.selection.text);
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
});
let sfdt: any = {"sfdt":"UEsDBAoAAAAIAN1cK1nPaSW/JwUAAGg2AAAEAAAAc2ZkdO1bW2+jOBT+K5H3tRNxMwTeVrPK7sNqNdLM01bzAAGDW24FJ5RW89/Xt9wKpKSTJp5uIrXHtc3xd875ju3Y9BkUJcEZfoq+opAAj1TL6AbU0QJ4t8+AyrIC3jMoG+DZunEDygR4jksLaUYLVFZSEikDKZMQeKZ9A5CUISqBp1FZRKIQYCHoSOCfqPnixxG4AVGOgEcfR0zS5gqvZcQlRjnwdCojIcs4r6mC3ys/wAv6fL4o0pq3RA8Nl2lAFvxR0XL7/QcdlFtX8d/CUlFTImZsEFY1k4QCfaa9UyJkFQsZyL8TIVZMsG445+MgKWuSM9OKKvNTwJqR7LgQo1D7kZ/WETMuZMjAyjSyzA7vYPz00ATZTNNqwOBiAXT/MVpPUooQ+L4PXtNBtXx06xSJpjSIgqIWyOwZCyEMpVz2QqplM0tGaE41d/djUSRD9ZT4Jc+FquEFhpplH3Pb1VVjXKVzjJXAmHArEyLmr9MAjgOuLfblbCfobqRRa+E7uMRhUUd248cwfryjjGeRu1L9SvWPQ3XYorsFhhGaZanptvHKt5siZVSncOKKqrztsaJbxcAHaY+HAVv96YAp9Yc2hWv83WpuTrc66O/dZ2y316qndid2a1qxTZQm9lRwaolNFi8EoqFsCOcyCx5Nf+Pjr+pntO5EoN83w3XdESktCopOd1svNUae6zmK21WBZ9p90Ub109H8GFCiwqb2zfZdzVMvvceAViG9dWXSe0ash9C+d9sHmAXLkjxU/qotj2XIoBYVUuBq4q9m4slgq5DrhjK5biZO0Ca187jEzQo+tgGGSzM8liWDWlRIhKuJv5qJR+4kD+BWIdnNc373vuQh0pnOQ1T+tqSUC/SrC4yrC848/WwO9hionZ//0xGe9dPr5Xh+JaLl+2Z3sNkcbLcJiH7NpSShBdoFfPZTHFSYql1KLgs2iKPbRNyr0kfYsiseYqWdx/zFVjPy95oQylH0omavglH3FIlYvUhIItAHIpS+jKi4NE6lhUW6uaOW8O/ZqOtyk2/KzWJ9ab71PKolIoJSSS3SiGtwdhety2tu5kIKFlDTaylRJsYvhQgTkgkkCAmAiyIrZShamiQCJWc7u0f/bc4/gNOi5XPZHjmk8p/z6kt+5Y/bIRib2Yh/RX6I83iin2rQV0PJXk7YjeVUc1zdtm2oOY6huZazH1y9u1kW1Lf3qT/5G8d0DqSV3L/GHFquDV6wedtpn9M79T3V4j2Enczd9dvkc+JX4BXnrjsRQY1LWvFHhPxlSiZf/MqPK79MJvMiJxvIA8170H+8tM84G3mO444xxB1TCe4YY7hjDHPHVIw7a8imonQwh+hgHHSkPjcd23x/Ophj6GAO0+HsVoykg6UoHawuHfB6i6DA7GCNoYPVR4cLWTGSDlBROsCe2eHyLIBjWAB7JwUVg28rGnz7qOCfa0WwxwTfPjL4l1sIHEWD77xtITgXC5wxLHDeuhBcjg4zRekwG9omalN40JUm/7w/IWZjCDEb3ihewI6RlHAVpYR7aIZQihvuGG64hycLhUkSVadhSP9hYvfIbM/P3KUSxRrUvCjI5UFJFOzEOOWnyFRZKuQiE1L81wUL1Z/LqCaTZc1hs38lAoZmWJ8095Ouf9N1z3Q8y5pqtvkvu48VFKlwSPv1vUnJHDFK68zT7Kk5gx2tA+/OH6vY7igeeFN5tGLqB3fqum5Hce87Z0eoheYUQq2jduAFl2MUO1PN6MZt4DKdXzA8CnrgLK45zf4DUEsBAhQACgAAAAgA3VwrWc9pJb8nBQAAaDYAAAQAAAAAAAAAAAAAAAAAAAAAAHNmZHRQSwUGAAAAAAEAAQAyAAAASQUAAAAA"};
describe('Track changes deletion validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableRtl: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track changes single cell deletion validation', () => {
        console.log('Track changes single cell deletion validation');
        container.open(sfdt);
        container.enableTrackChanges = true;
        expect(container.revisions.changes.length).toBe(30);
        expect(container.revisions.length).toBe(6);
        container.selection.select('0;0;0;0;0;0', '0;0;0;0;4;4');
        container.editor.delete();
        expect(container.revisions.changes.length).toBe(21);
        expect(container.revisions.length).toBe(3);
        container.editorHistoryModule.undo();
        expect(container.revisions.changes.length).toBe(30);
        expect(container.revisions.length).toBe(6);
        container.editorHistoryModule.redo();
        expect(container.revisions.changes.length).toBe(21);
        expect(container.revisions.length).toBe(3);
    });
    // it('Track changes two cell deletion validation', () => {
    //     console.log('Track changes tow cell deletion validation');
    //     container.open(sfdt);
    //     container.enableTrackChanges = true;
    //     expect(container.revisions.length).toBe(6);
    //     container.selection.select('0;0;0;0;0;0', '0;0;0;1;3;3');
    //     container.editor.delete();
    //     expect(container.revisions.length).toBe(2);
    //     container.editorHistoryModule.undo();
    //     expect(container.revisions.length).toBe(6);
    //     container.editorHistoryModule.redo();
    //     expect(container.revisions.length).toBe(2);
    // });
    // it('Track changes three cell deletion validation', () => {
    //     console.log('Track changes three cell deletion validation');
    //     container.open(sfdt);
    //     container.enableTrackChanges = true;
    //     expect(container.revisions.length).toBe(6);
    //     container.selection.select('0;0;0;0;0;0', '0;0;0;2;3;3');
    //     container.editor.delete();
    //     expect(container.revisions.length).toBe(1);
    //     container.editorHistoryModule.undo();
    //     expect(container.revisions.length).toBe(6);
    //     container.editorHistoryModule.redo();
    //     expect(container.revisions.length).toBe(1);
    // });
});

let delSfdt: any = {"sfdt":"UEsDBAoAAAAIACl6LFm79fzkMQUAAPQ5AAAEAAAAc2ZkdO1bS2/jNhD+KwZ7zRqinpZuxRZpD0WxQHtqsAfqQUmxLGkl+hnsfy9fdqxI8kp52GwrA8kwJDX8ZvjNkKGpJ1CUJF2lh+hPHBLgkWod3YE6CoD38ASoLCvgPYFyCzwb6negTIDnuLSQrWiBykpKIqUvZRICz7DvAJYyxCXwNCqLSBT8VAg6Evgj2n5BcQTuQJRj4NHHMZO0uUqPMuIyxTnwIJWRkGWc11TBzxXy04A+nwdFVvOW6NuWy8wnAX9UtDx8/U4H5dZV/LewVNSUmBnrh1XNJKFAn2jvjAhZxUL68u9EiA0TrFua83GwlDXJmWlFtUIZYM1YdgzEKNR+jLI6YsaFDBnQs7hIdhu4L8nSIEuYZxoxAsAQpwJr80laTzIKEiAEBmihev69Jvr+YBMVmVdpEgVFbZBxNBRCGEq57oRUy2YWlpYx19zzj0mR9NXTECh5VFRbXmCoWRwyt02uGuIqyDFWAmPCrUyIyGTvAzj2ubYYybwnGK+htYHCeG0jVBowjL/lDjxsYkp5NnUT1yeu/3e4vl09WjAvazt4tA7LPdksDyEjOgUTV1ThQ4cN7SoG3c86/AvYNoAOl1FvaHPriL5dzY1pV/vdvbtMbffadNSezdyRVGw3pYnNlTU3xW6LF3zRUG4JZzKbOhr8+pVX9h+u1kFwtlrHu8f0EIe2SxI318IkT3CQlny1/tgYgNARpBcFRRPC2bYmznzbx5Gvh7blk4O29QtrP3r/16dFif3fa01s7v9UMXFcIFyArUIgQGUCYa+vdu4GZY8RWi8jHdeGu8uisYHQq0WFQHi1iY1AUMbEcYFwAbYKgaDfJBCutDEc5gLjmlu/W/4Po5TXtYl4cHLBlH6m9DOlnyn9TOlnSj9T+pnSz5R+pvTzkenndK7OQJ39/J9O0M03n5cM51ciWr6eTodOh0PPx0S4PjCS0ALtAj6jLPWrlKpdSy4LNojvTRJxv4E+wo5dxEOsdPYYCp41Y9RowjjH0YuaRgWj7nsEYvUiIIlA74upRHJGxeWNTFpYZKe7IhL+ko16LG/zU3kbHC+vPHse1xIRwZmkFtmK6yjsTgiU102YCylYQE2vpcQrMX4pRJiQlUCCsQAYFKtSTsWeBolAydnO7rP8dM8/gNNiz3NZgxxS+du8+pJf+e55CMZmNuJvEQrTPJ7B9xr0h1PJLgmdz+Vcc1xo27alOY6uuabTnFzYPiwV1Leb1J/9nsY0B9JK7l/93jJdG7xg83OnJqfP6juqxX2gs8g999vsc4Iq8APnHjsRQY1bWvFLhNE6I7MvqEJxhcpkdl/k5AS5p7kB/ftL+/SrkWccd/Q+7hhKcEcfwh29nzuGYtw5QjYUpYPRRwf9oiPhveHYxsfTwRhCB6OfDle3YiAdTEXpYLbpkB63CApkB3MIHcwuOtzIioF0sBSlg9WRHW7PAmsIC6zOpKDi5NuKTr49avKvtSLYQybfHjn5t1sIHEUn33ndQnAtFjhDWOC8diG4HR0WitJh0bdN1ObWRVca/PPxhFgMIcSif6N4AzsGUsJVlBLupQyhFDfcIdxwLycLhUkSVe/DkO7DxPaRWcPP3KUSxRHUfVGQ24OSKNiJccZPkamyTMhgJaR454lN1a/rqCazdc1hs1f6gK7p5ifN/QT1v6DlQcfT7PliYf7NLuQRHitVGrJ+3W9VMV+MUay3FPe9vPJ2zZ2vCoxU6yxaanturI9QTAPMtbW2i7tvAI9RbM7tBWwp7rlRyb9k2AmKpKu45lT7B1BLAQIUAAoAAAAIACl6LFm79fzkMQUAAPQ5AAAEAAAAAAAAAAAAAAAAAAAAAABzZmR0UEsFBgAAAAABAAEAMgAAAFMFAAAAAA=="};
describe('Track changes deletion validation with deleted text', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableRtl: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    // it('Track changes single cell deletion validation with deleted text', () => {
    //     console.log('Track changes single cell deletion validation');
    //     container.open(JSON.stringify(delSfdt));
    //     container.enableTrackChanges = true;
    //     expect(container.revisions.length).toBe(6);
    //     container.selection.select('0;0;0;0;0;0', '0;0;0;0;3;3');
    //     container.editor.delete();
    //     expect(container.revisions.length).toBe(6);
    //     container.editorHistoryModule.undo();
    //     expect(container.revisions.length).toBe(6);
    //     container.editorHistoryModule.redo();
    //     expect(container.revisions.length).toBe(6);
    // });
    // it('Track changes two cell deletion validation with deleted text', () => {
    //     console.log('Track changes tow cell deletion validation');
    //     container.open(JSON.stringify(delSfdt));
    //     container.enableTrackChanges = true;
    //     expect(container.revisions.length).toBe(6);
    //     container.selection.select('0;0;0;0;0;0', '0;0;0;1;2;3');
    //     container.editor.delete();
    //     expect(container.revisions.length).toBe(6);
    //     container.editorHistoryModule.undo();
    //     expect(container.revisions.length).toBe(6);
    //     container.editorHistoryModule.redo();
    //     expect(container.revisions.length).toBe(6);
    // });
    // it('Track changes three cell deletion validation with deleted text', () => {
    //     console.log('Track changes three cell deletion validation');
    //     container.open(JSON.stringify(delSfdt));
    //     container.enableTrackChanges = true;
    //     expect(container.revisions.length).toBe(6);
    //     container.selection.select('0;0;0;0;0;0', '0;0;0;2;2;3');
    //     container.editor.delete();
    //     expect(container.revisions.length).toBe(6);
    //     container.editorHistoryModule.undo();
    //     expect(container.revisions.length).toBe(6);
    //     container.editorHistoryModule.redo();
    //     expect(container.revisions.length).toBe(6);
    // });
    // it('Track changes in-between cell deletion validation with deleted text', () => {
    //     console.log('Track changes in-between cell deletion validation with deleted text');
    //     container.open(JSON.stringify(delSfdt));
    //     container.enableTrackChanges = true;
    //     expect(container.revisions.length).toBe(6);
    //     container.selection.select('0;0;0;1;0;0', '0;0;0;2;2;3');
    //     container.editor.delete();
    //     expect(container.revisions.length).toBe(6);
    //     container.editorHistoryModule.undo();
    //     expect(container.revisions.length).toBe(6);
    //     container.editorHistoryModule.redo();
    //     expect(container.revisions.length).toBe(6);
    // });
    it('Track changes cell insert and delete validation with deleted text', () => {
        console.log('Track changes cell insert and delete validation with deleted text');
        container.open(JSON.stringify(delSfdt));
        container.enableTrackChanges = false;
        container.selection.select('0;0;1;0;0;0', '0;0;1;0;0;0');
        container.editor.insertText('hello');
        container.editor.onEnter();
        container.editor.insertText('hello');
        container.editor.onEnter();
        container.editor.insertText('hello');
        container.selection.select('0;0;1;1;0;0', '0;0;1;1;0;0');
        container.editor.insertText('hello');
        container.editor.onEnter();
        container.editor.insertText('hello');
        container.editor.onEnter();
        container.editor.insertText('hello');
        container.enableTrackChanges = true;
        container.selection.select('0;0;1;0;0;0', '0;0;1;1;2;6');
        container.editor.delete();
        expect(container.revisions.changes.length).toBe(27);
        expect(container.revisions.length).toBe(7);
    });
    it('Track changes para mark validation', () => {
        console.log('Track changes para mark validation');
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertTable(2,2);
        container.editor.insertText('hello');
        container.editor.onEnter();
        container.editor.insertText('hello');
        container.editor.onEnter();
        container.editor.insertText('hello');
        container.enableTrackChanges = true;
        container.selection.select('0;0;0;0;0;0', '0;0;0;0;2;6');
        container.editor.delete();
        let length: number = container.revisions.changes.length;
        expect(length).toBe(5);
        expect(container.revisions.revisions.length).toBe(1);
    });
    // it('Track changes cell insert and delete validation with deleted text', () => {
    //     console.log('16');
    //     let sfdt: any = {"sfdt":"UEsDBAoAAAAIABp9LFm5Pk8FfwQAADcsAAAEAAAAc2ZkdO2aS2/jNhDHv4rBXrOGHpZk6VZs4fZQFAtsTw180IOUlMiylqLjZIN89x1yKD/lRN5NLAG1gXgYkiL/HP748NjPZFmJfJF/p19ZIkgg+IrekJrGJLh9JmArToJnUq1J4JrWDakyEng+JIoFJMBybYW2kbZZQgLbvSFM24RVJDDALikmohwN9ET+oesvYUrJDaElIwE8zqSFYp43liqbs5IEJliKtkrLGhr4nYdRHsPzZbwsalVCv62VLSIRq0ex5Hb+Ap2q0XH1jiPFnIrJwUYJr6UVIPQZahcCLU/RRvr/DM2DNLJaXqp+mLa1KOXQlnwRFkQWM10xxl5g/Cwsago5OSo5yhcFSCBhSF5A9VDlRZGWNyx/zl/moFDz21VCkmi7apVU62K5HDxrDFjH2xTgVSni+FolpDLJuHTN1R2NO0ylg6OOTI0kE7gTvI+oNFKtpaF0vfT9FcgrkMMBEjpLOTxwq1TJN9l9VLT4gcjzCp4sYAzG2GkUHGcrQcfZUXvtNrnHtR5acnc83Ey+PPYNvAU44wleC1QiwoJqLRRx0v2wEK0LH2NvHl5xLA+vjyXRdDSImBjUsrzQYuzmAvPqAuuSu5G8VifyTkzW3DJMeudTh90/hq7veD4n8z6Pz0HNynVtXtdmb2uTPpXsrszuq/tpXE7zKnkqy4heV+d1dV5XZ/+rszAf7Oiu9G36aOQizI3UUSfn5p4vReu//9NN3/7lm3539jIsmW8+aupbvqqiU6z+DqwANQyqkM9hkUc8h2ZXmnMkBec2w4AhPCI/MOBDMrXzWBhvW2bhXhFjJaMHOXsZEuv3WKT8YLEKVB/hVIZ6RjEaWugRLotN8FXLv5e9Nul1uUmv4yYavPU8q7UiwQqNllhjfFcGWU0dv5UuBLEEhl5ryxbYf4UmycQClTCGAuPlotJT8QSLBFUq2mWA+LeZehGFxZPa5/bg0I3/mlcP+Soft11ImmWPf9Ewyct0ZL5Xp29OpYy6787l2PB803Vdx/A8y/An3v7kmseRF0Tf3Ud/9Heewv4Imcq/1syZ+C45oHlbaZ/pnfyWbAyw76zcXb+NPmchJ284t6kkEI0+R/EHZeGqEKMvIQ9THlbZaLYsxUbyieI96S+H47MuBs957Fin2LEHwY7VhR3rNDv2wNhpJNsDxcE+hYP1qiPNme259sfjYHfBwT6Nw8VH0RGHyUBxmBzjkDdXhAHsDpMuOEzacOhpFB1xcAaKg9OyO/RPgdOFAqd1Uxji5LsDnXz3rMm/1Ingdpl898zJ7+8g8AY6+d7PHQSXosDrQoH3swdBfzhMB4rD9NQ10Rg7r7rSVq+PB2LaBYjp6YtiD+PoiIQ/UCT813aIQbHhd2HDf32zGDAklL8PIe3BxOOQ2Z6flUu1ikbUbLkU/YvSKmTEuFBRZGisQBsv0OKPGeVU/bmitRitaiVb/kaWWIY1+WT4n0zrX9MJJkZge+Opa/wH5RwR4XkC9Vq/VZeeOKdZ86jZE18IntuwddRw63cZKqz+iE7JF2mtnPsDUEsBAhQACgAAAAgAGn0sWbk+TwV/BAAANywAAAQAAAAAAAAAAAAAAAAAAAAAAHNmZHRQSwUGAAAAAAEAAQAyAAAAoQQAAAAA"};
    //     container.open(sfdt);
    //     container.enableTrackChanges = true;
    //     container.selection.select('0;0;0;0;0;0', '0;0;0;0;3;3');
    //     container.editor.delete();
    //     expect(container.revisions.length).toBe(4);
    //     container.editorHistoryModule.undo();
    //     expect(container.revisions.length).toBe(1);
    //     container.editorHistoryModule.redo();
    //     expect(container.revisions.length).toBe(4);
    // });
});



describe('Track changes deletion validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection:true, enableEditorHistory: true, enableSfdtExport: true, enableRtl: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track nested table insert, undo,redo validation', () => {
        console.log('Track nested table insert, undo,redo validation');
        container.openBlank(); 
        container.editor.insertTable(2,3);
        container.editor.insertText("Hello world")
        container.editor.insertText("Hello World")
        container.editor.insertText("Hello World")
        container.editor.insertText("Hello World")
        container.selection.moveUp();
        container.selection.moveUp();
        container.enableTrackChanges = true;
        container.editor.insertTable();
        container.editorHistory.undo();
        expect(container.revisions.length).toBe(0);
        container.editorHistory.redo();
        expect(container.revisions.length).toBe(1);
    });
    it('Cell with nested table deletion validation', () => {
        console.log('Cell with nested table deletion validation');
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertTable(3, 3);
       
        let table = container.selection.start.paragraph.associatedCell.ownerTable;

        for(let i=0; i< table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for(let j=0; j< row.childWidgets.length; j++) {
                let cell = row.childWidgets[j];
                container.selection.selectParagraphInternal((cell as TableCellWidget).childWidgets[0] as ParagraphWidget, true);
                 container.editor.insertText("Hello");
                if(i==1 && j==1) {
                  container.editor.insertTable(2,2);
                }
            }
        }

        container.selection.select('0;0;2;2;0;6', '0;0;1;1;1;0;0;0;1');
        container.editor.onBackSpace();

        let currentTable = container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0];
        expect(((currentTable as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(3);
        expect(((currentTable as TableWidget).childWidgets[1] as TableRowWidget).childWidgets.length).toBe(1);
        expect(((currentTable as TableWidget).childWidgets[2] as TableRowWidget).childWidgets.length).toBe(1);

        container.editorHistory.undo();

        currentTable = container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0];
        expect(((currentTable as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(3);
        expect(((currentTable as TableWidget).childWidgets[1] as TableRowWidget).childWidgets.length).toBe(3);
        expect(((currentTable as TableWidget).childWidgets[2] as TableRowWidget).childWidgets.length).toBe(3);

        container.editorHistory.redo();
        currentTable = container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0];
        expect(((currentTable as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(3);
        expect(((currentTable as TableWidget).childWidgets[1] as TableRowWidget).childWidgets.length).toBe(1);
        expect(((currentTable as TableWidget).childWidgets[2] as TableRowWidget).childWidgets.length).toBe(1);
    });
   
    it('Start and end Cell with nested table deletion validation ', () => {
        console.log('Start and end Cell with nested table deletion validation');
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertTable(3, 3);
       
        let table = container.selection.start.paragraph.associatedCell.ownerTable;

        for (let i = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for (let j = 0; j < row.childWidgets.length; j++) {
                let cell = row.childWidgets[j];
                container.selection.selectParagraphInternal((cell as TableCellWidget).childWidgets[0] as ParagraphWidget, true);
                container.editor.insertText("Hello");
                if (i == 1 && j == 1 || i == 2 && j == 2) {
                    container.editor.insertTable(2, 2);
                }
            }
        }

        container.selection.select('0;0;1;1;0;0', '0;0;2;2;2;1');
        container.editor.onBackSpace();

        let currentTable = container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0];
        expect(((currentTable as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(3);
        expect(((currentTable as TableWidget).childWidgets[1] as TableRowWidget).childWidgets.length).toBe(1);
        expect(((currentTable as TableWidget).childWidgets[2] as TableRowWidget).childWidgets.length).toBe(1);

        container.editorHistory.undo();

        currentTable = container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0];
        expect(((currentTable as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(3);
        expect(((currentTable as TableWidget).childWidgets[1] as TableRowWidget).childWidgets.length).toBe(3);
        expect(((currentTable as TableWidget).childWidgets[2] as TableRowWidget).childWidgets.length).toBe(3);

        container.editorHistory.redo();
        currentTable = container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0];
        expect(((currentTable as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(3);
        expect(((currentTable as TableWidget).childWidgets[1] as TableRowWidget).childWidgets.length).toBe(1);
        expect(((currentTable as TableWidget).childWidgets[2] as TableRowWidget).childWidgets.length).toBe(1);
    });
    it('Start and end Cell with nested table deletion validation ', () => {
        console.log('Start and end Cell with nested table deletion validation');
        container.openBlank();
        container.enableTrackChanges = false;

        for (let i = 0; i < 30; i++) {
            container.editor.onEnter();
        }
        container.editor.insertTable(3, 3);
        for (let i = 0; i < 30; i++) {
            container.editor.onEnter();
        }

        container.selection.selectCell();
        container.enableTrackChanges = true;
        container.editor.delete();

        expect(container.revisions.changes.length).toBe(30);
        expect(container.revisions.length).toBe(1);
        container.editorHistory.undo();
        expect(container.revisions.changes.length).toBe(0);
        expect(container.revisions.length).toBe(0);
        container.editorHistory.redo();
        expect(container.revisions.changes.length).toBe(30);
        expect(container.revisions.length).toBe(1);
    });
    it("Revision on last row and paragraph combination", () => {
       let gettingStarted = '{"sfdt":"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"}';
       container.open(gettingStarted);
       container.enableTrackChanges = true;
       container.selection.select('0;4;2;0;0;0','0;6;4' );
       container.editorModule.onBackSpace();
       expect(container.revisions.changes.length).toBe(17);
       expect(container.revisions.length).toBe(2);
       container.editorHistory.undo();
    //    expect(container.revisions.length).toBe(0)
    //      container.editorHistory.redo();
    //      expect(container.revisions.length).toBe(3)
    });
    it("Validate pane updation when deleting a row using different user",()=>{
        console.log("Validate pane updation when deleting a row using different user");
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertTable(5,2);
        container.currentUser = 'New User';
        container.selection.select('0;0;0;0;0;0','0;0;1;1;0;1');
        container.editor.onBackSpace();
        expect(container.revisions.length).toBe(2);
        container.editorHistory.undo();
        expect(container.revisions.length).toBe(1);
        container.editorHistory.redo();
        expect(container.revisions.length).toBe(2);
    })
});
// describe('EndNote insertion validation', () => {
//     let container: DocumentEditor;
//     beforeAll(() => {
//         
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.appendChild(ele);
//         DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
//         container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableRtl: true });
//         (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         container.appendTo('#container');
//     });
//     afterAll((done): void => {
//         container.destroy();
//         document.body.removeChild(document.getElementById('container'));
//         container = undefined;
//         
//         setTimeout(function () {
//             done();
//         }, 1000);
//     });
//     it('EndNote insertion validation', () => {
//         console.log('EndNote insertion validation');
//         let sfdt: any = {"sfdt":"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"};
//         container.open(JSON.stringify(sfdt));
//         container.enableTrackChanges = true;
//         container.selection.select('0;1;201', '0;1;201');
//         container.editor.insertEndnote();
//         container.editor.insertText('first');
//         container.selection.select('0;1;327', '0;1;327');
//         container.editor.insertEndnote();
//         container.editor.insertText('two');
//         expect(container.revisions.changes[1].range[0] instanceof FootnoteEndnoteMarkerElementBox).toBe(true);
//     });
// });
// describe('Footnote insertion validation', () => {
//     let container: DocumentEditor;
//     beforeAll(() => {
//         
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.appendChild(ele);
//         DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
//         container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableRtl: true });
//         (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         container.appendTo('#container');
//     });
//     afterAll((done): void => {
//         container.destroy();
//         document.body.removeChild(document.getElementById('container'));
//         container = undefined;
//         
//         setTimeout(function () {
//             done();
//         }, 1000);
//     });
//     it('Footnote reject validation', () => {
//         console.log('Footnote reject validation');
//         let sfdt: any = {"sfdt":"UEsDBAoAAAAIAHFzLVnimpYCPggAAO0vAAAEAAAAc2ZkdO1aX2/byBH/KgT76jP4VxL9FsdOnMRO3NgX4HrNw5Jaimsv/4RLWpGNAEXuqS8FClyLPvSAvvWhKHpAD+ihL/dhAiS4Xj/EzeySsmSJFmXLdtBGfBhyZ3d25jezw1lxz/Q0K1jMTulB2C/0jSIv6ZouaKBvfHmmA81yfeNMz4b6htUz1rue5/W6Xc/yOr2uu6Znkb5hG9a6De2e3fM6Ts9x1nQe6xtda03PK1pU1K9o1IdhnTU9rGg/zPQNA2hK1Y3PFAE19Kd0uE8GVF/TaRKCGjAMKbBzVlMqKQsTfcMEShXNBokAAfdy4rMAxidByoXk0FdDSblfBHKo4nz58g1MKk3PQrTb7+cCaQFqnQGPF4rmA0X96jlS5AQJUFEkqHiax4TDvBz1lIwgVB2ZnCNMCqlFoOYi8LCa+YmQRl2uBsDWR5v1iMY+H/BTr9Mv4q554h+VLnjq5VjPaf0KDsrovy4Nw7D0tRZSzsZmq6HaMqNkKISECzoeTwhpIwGu815mxxu5RZYfjUa+5Q1NOypNV3Za+7/ytWdy0aEpN6zgNLEJT1NfdMiyvm6WcpmvF46a42vf99tImPL1setmsWsQvzfkeZ4y63TQe3Xrvjbu3NelYyQlN102cF/xbs/NhiecLuvqRiGXeXrRoDmODsOwhYApP8dWx4xCxo89kXdG4bAbZOZJcnuO/l+bBqCNFOdlHUqhOIXowFduiC/SrEgFCIBWdKBqxzs9Zkmab7I+Ay7rS6ZhuXiPd7aNHUndb+deIrBjCO9xOtt4sQ30u5b1nCVVlaBoWNGCqBpDrSlcWj3ojPXBuun2bPgZpus4Zs9zsV0t6ZSP6xMZv2v6MapR3w+T8f0wqKupc7xDUalYhBwtmQcVcPvFUNVFWJyYVd0Ds0Zgkg4YiYqGsVIqU6QfFbFSLwxVmROkcVZljFHhK14RxcqzQUUwNp6FIQuwxIrJUSgUg8skgVxOCsAMhtYxoG0xkXEygjZcu4ZlmpA2HMMaX46OUYuDKWnTKxCX9oKADBE6/XFGsPv7779/9/a7d2//9e6rr969/Ye2ywZRARJ2SALBoP/019//95vfaP/5519++voPqhkLwQ9//+2Hf/8w2Rktev/Hbz989+37P/3ux799Da1YLULrIYup0KD21J6nMUHrd6ifz2UcRgTXwL1kIEhCkAWN20WEjU9HhCMAm1Qq9gKCsI/PD8sjFHYQ5WWBYf8kivF5L035ZppLsU+wJ8xXJgM1Ii/h8TkhJzjgvjJpu8ygAGLY4X5EUcQ+B7OgXk5ooWFTekzRsV8whvrssSBPRRoW2hdM2yRMTn7IcOlM8HYYZAoyIso41GLvhbaZcuy8RU9kAyAts8kh5ajXQ1IWJJbSCEahvkuKCAUcjHKs4rdFAWYNKE+17T4VAlnP8hGKekJgiUob9/golg15wY6xYZekKTRspcf3IxJnUh5LYIHrj8QxYEW0/bSQI1OJLxJQkyRj214wWsz12ucQBVNGY0OZI9I0lb4Z8ZDQRIZEnMh9BJMWb5YDhHKXUk6GpE+p9vkjbE6zdErg4wicvkNRi8dEgoYkoYJqh/Q1RuAuE4jdAR2klZC9kYqDEUliktf9nh5LGLb9HByDwPHgGIOLYUYnauQzEZPJPvsRQUSQiKxyRNLgCGAdNbNoEwsC9aIWh4TTKRAOCdN2qeKUUxx0huSWkh1KB1bqY7KEV0CLVHSXKQhyxvs/f9My7SxKOHV0VWmmfqySy/0077Pr5ZYtUib7FBbPp9Sy0tRSe+pTQvmoEwqmFB8rRR1j5hcPqp8u6+PROMGMq+SqtLpe5Xmx0E5en09R550dSvoQpJq5mkmxnjV7qqB1VMFqVlWqKkdlkXqxMp0o9y1jstyfKPVCCZzxwOl2TABuvA9QA9Q+gByN9wFVxY8tMxX/dON52zYRxT0BOUftl8+9cSlwkIxIrtAzP1pTtmhISl5o+yQng5xkkfYghddBbUwDe8qoNxctt1YXMtMRYy0VMWZnSZjVgLuLGKsxYj4mUxZETG2MfVNBYC8XBM4lIDkNIF3Tj3azH1erTUtXOKtzhaNcYSlXOG1dwWrGjPHMP+fdgCucea64CW1ausK9KVe4rVfFTPjdAOzu3BVwzZlbQtxZHcTW+L9thLhzxWh3PbxuI9o7LaJ9Jdq0dEX3plzRXS7aJ2y+Cdi7zdF+9ZlbQtxbDcQT2PauGOZWF6/bCPNeizBdescribeYtfeCt3AfecvE9YexN4O01x/fVZ16A7SErOF0drk71DeX8k0kgLt9u9poq7mpL1rubvYLEpXlneXdaL/DnQekXq3OpchkQnqT4nbip5p9MvzdT89d2tSj5V6LMAph/WabFijDGD5HmeAO2IPk7Bl7T6bYNfFLfFun8EvkLENllYoK3qvBL1JfQxiQy1/YLqtQaPkoKmgiqbcdZRAQTy+9W2iFRz7MwRvSLE0WJejXxigyBrMOOQ0TqM26G34ib4LuytHmgO/a6ZeCv27E823Pc6gP6nPaJ+K3/eDR7V9qatgnkKXCvuOlczo3PaUhzmgT0wkR+40T+chPh65/mK61tLryD2yyaSotaqQcp4HvnSlVa4Nc3Lk+pgDCuaBArmsv/7vG9+rCksO5LIdXG06y6ZVjOZ4b3mWkfmjbELryX123L/BUeNVKuzPHcRcPxQIRiGbn2jNyGw4lLCLbtdceYFTz/jNuycp0ZuQ0n7JYR3Fs3HW9GcMNhrSUFu8aM4PlHxeQRptcqQFg8ECq+8HzwmS5u7YDv9Ak5ebbO1tUhtuBOtXBqLZJb0kIeytPpJ/zvEP83PwNQSwECFAAKAAAACABxcy1Z4pqWAj4IAADtLwAABAAAAAAAAAAAAAAAAAAAAAAAc2ZkdFBLBQYAAAAAAQABADIAAABgCAAAAAA="};
//         container.open(JSON.stringify(sfdt));
//         container.enableTrackChanges = true;
//         container.revisions.get(5).reject();
//         container.revisions.get(4).reject();
//         expect(()=>{container.revisions.get(3).reject()}).not.toThrowError();
//     });
// });

// Track changes
describe('Track changes-para mark track validation when delete the same user inserted para', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track changes-para mark track validation when delete the same user inserted para', function () {
        console.log('Track changes-para mark track validation when delete the same user inserted para');
        container.enableTrackChanges = true;
        container.currentUser = "Guest";
        container.editor.insertText("Hello");
        container.editor.onEnter();
        container.editor.insertText("world");
        container.editor.onEnter();
        container.editor.insertText("syncfusion");
        container.selection.select('0;0;2','0;1;3');
        container.editor.delete();
        container.editorHistory.undo();
        container.editorHistory.redo();
        expect((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).characterFormat.revisionLength).toBe(1);
    });
});
describe('Track changes- para mark delete validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    // it('Track changes- para mark delete validation', function () {
    //     console.log('Track changes- para mark delete validation');
    //     container.currentUser = "Guest";
    //     container.editor.insertText("Hello");
    //     container.editor.onEnter();
    //     container.enableTrackChanges = true;
    //     container.selection.select('0;0;5', '0;1;1');
    //     container.editor.delete();
    //     container.editorHistory.undo();
    //     container.editorHistory.redo();
    //     expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
    //     expect((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).characterFormat.revisionLength).toBe(1);
    // });
    it('Track changes- para mark single delete validation(combine)', function () {
        console.log('Track changes- para mark single delete validation(combine)');
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertText("Hello");
        container.editor.onEnter();
        container.enableTrackChanges = true;
        container.editor.onEnter();
        expect((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget).characterFormat.revisionLength).toBe(1);
        container.enableTrackChanges = false;
        container.selection.select('0;0;5', '0;0;5');
        container.editor.delete();
        expect((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).characterFormat.revisionLength).toBe(1);
        container.editorHistory.undo();
        expect((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget).characterFormat.revisionLength).toBe(1);
        container.editorHistory.redo();
        expect((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).characterFormat.revisionLength).toBe(1);
        expect(container.revisions.changes.length).toBe(1);
    });
    it('Track changes- para mark select and delete validation(combine)', function () {
        console.log('Track changes- para mark select and delete validation(combine)');
        container.openBlank();
        container.editor.insertText("Hello");
        container.editor.onEnter();
        container.enableTrackChanges = true;
        container.editor.onEnter();
        expect((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget).characterFormat.revisionLength).toBe(1);
        container.enableTrackChanges = false;
        container.selection.select('0;0;5', '0;0;6');
        container.editor.delete();
        expect((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).characterFormat.revisionLength).toBe(1);
        container.editorHistory.undo();
        expect((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget).characterFormat.revisionLength).toBe(1);
        container.editorHistory.redo();
        expect((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).characterFormat.revisionLength).toBe(1);
        expect(container.revisions.changes.length).toBe(1);
    });
});
describe('Track changes-onEnter validation with different user', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track changes-onEnter validation with different user', function () {
        console.log('Track changes-onEnter validation with different user');
        container.enableTrackChanges = true;
        container.currentUser = "Guest";
        container.editor.insertText("Hello");
        container.editor.onEnter();
        container.selection.select('0;0;5', '0;0;5');
        container.currentUser = "Henry";
        container.editor.onEnter();
        expect((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).characterFormat.getRevision(0).author).toBe('Henry');
        expect((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget).characterFormat.getRevision(0).author).toBe('Guest');
        container.editorHistory.undo();
        expect((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).characterFormat.getRevision(0).author).toBe('Guest');
        container.editorHistory.redo();
        expect((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).characterFormat.getRevision(0).author).toBe('Henry');
        expect((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget).characterFormat.getRevision(0).author).toBe('Guest');
    });
});
describe('Track changes-insert text validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track changes-insert text in between tracked content', function () {
        console.log('Track changes-insert text in between tracked content');
        container.enableTrackChanges = true;
        container.editor.insertText("HelloWorld");
        container.enableTrackChanges = false;
        container.selection.select('0;0;5', '0;0;5');
        container.editor.insertText("S");
        expect(container.revisions.length).toBe(2);
        expect(container.revisions.changes.length).toBe(2);
        container.editorHistory.undo();
        expect(container.revisions.length).toBe(1);
        expect(container.revisions.changes.length).toBe(1);
        container.editorHistory.redo();
        expect(container.revisions.length).toBe(2);
        expect(container.revisions.changes.length).toBe(2);
    });
});
describe('Track changes-revision splitting and combine validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track changes-revision splitting and combine validation', function () {
        console.log('Track changes-revision splitting and combine validation');
        container.editor.insertText("Hello");
        container.editor.onEnter();
        container.editor.insertText("Hello");
        container.editor.onEnter();
        container.editor.insertText("World");
        container.editor.onEnter();
        container.editor.insertText("World");
        container.enableTrackChanges = true;
        container.selection.select('0;0;0', '0;0;5');
        container.editor.delete();
        container.selection.select('0;1;0', '0;3;5');
        container.editor.delete();
        container.selection.select('0;0;5', '0;0;5');
        container.editor.delete();
        expect(container.revisions.length).toBe(1);
        expect(container.revisions.changes.length).toBe(7);
        container.editorHistory.undo();
        container.editorHistory.redo();
        expect(container.revisions.length).toBe(1);
        expect(container.revisions.changes.length).toBe(7);
    });
});

describe('Track changes-Validation for manual tesing', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track changes-Validation for reject the different user revision', () => {
        console.log('Track changes-Validation for reject the different user revision');
        container.enableTrackChanges = true;
        container.currentUser = "Guest";
        container.editor.insertText("Hello");
        container.editor.onEnter();
        container.currentUser = "Henry";
        container.selection.select('0;0;5', '0;0;5');
        container.editor.onEnter();
        container.revisions.get(1).reject();
        expect(container.revisions.changes.length).toBe(2);
        expect(container.revisions.changes[0].revisionType).toBe('Insertion');
        expect(container.revisions.groupedView.keys.length).toBe(1);
    });
    it('Track changes validation for revision not combined on delete', () => {
        container.openBlank();
        container.editor.insertText('Hello');
        container.enableTrackChanges = true;
        container.editor.insertText('World');
        container.editor.onEnter();
        container.revisions.get(0).reject();
        expect(container.revisions.changes.length).toBe(0);
        expect(container.revisions.revisions.length).toBe(0);
    });
    it('Track changes validation for paramark revision not removed', () => {
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertText('Hello');
        container.editor.onEnter();
        container.editor.insertText('World');
        container.selection.select('0;0;5', '0;0;5');
        container.editor.delete();
        expect(container.revisions.changes.length).toBe(1);
        expect(container.revisions.revisions.length).toBe(1);
    });
    it('Track changes validation for revisions combine', () => {
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertText('HelloWorld');
        container.editor.onEnter();
        expect(container.revisions.changes.length).toBe(2);
        expect(container.revisions.revisions.length).toBe(1);
        container.selection.select('0;0;5', '0;0;5');
        container.currentUser = "new"
        container.editor.insertText('S');
        expect(container.revisions.changes.length).toBe(4);
        expect(container.revisions.revisions.length).toBe(3);
        container.editor.onBackSpace();
        container.editorHistory.undo();
        expect(container.revisions.changes.length).toBe(4);
        expect(container.revisions.revisions.length).toBe(3);
        container.editorHistory.redo();
        expect(container.revisions.changes.length).toBe(2);
        expect(container.revisions.revisions.length).toBe(1);
    });
    it('Press enter in the first cell of table', () => {
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertTable(2, 2);
        container.enableTrackChanges = true;
        container.editor.onEnter();
        expect(container.revisions.changes.length).toBe(1);
        expect(container.revisions.revisions.length).toBe(1);
        container.editorHistory.undo();
        expect(container.revisions.changes.length).toBe(0);
        expect(container.revisions.revisions.length).toBe(0);
        container.editorHistory.redo();
        expect(container.revisions.changes.length).toBe(1);
        expect(container.revisions.revisions.length).toBe(1);
    });
    it('Track changes validation for inserting comment', () => {
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertComment('HelloWorld');
        expect(container.revisions.changes.length).toBe(0);
        expect(container.revisions.revisions.length).toBe(0);
    });
    it('Track changes validation for inserting content control', () => {
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertContentControl('Text');
        expect(container.revisions.changes.length).toBe(1);
        expect(container.revisions.revisions.length).toBe(1);
    });
    it('Track changes validation for inserting hyperlink', () => {
        container.openBlank();
        container.editor.insertText('Hello');
        container.editor.onEnter();
        container.editor.insertText('world');
        container.enableTrackChanges = true;
        container.selection.selectAll();
        container.editor.insertHyperlinkInternal('https://www.google.com', "<<Selection in document>>", false);
        expect(container.revisions.changes.length).toBe(3);
        expect(container.revisions.revisions.length).toBe(1);
        container.editorHistory.undo();
        expect(container.revisions.changes.length).toBe(0);
        expect(container.revisions.revisions.length).toBe(0);
    });
    // it('Rejecting the insert revision which has comment', () => {
    //     container.openBlank();
    //     container.enableTrackChanges = true;
    //     container.editor.insertText('Hello');
    //     container.editor.insertComment('HelloWorld');
    //     container.revisions.get(0).reject();
    //     expect(container.documentHelper.comments.length).toBe(0);
    //     expect(container.revisions.changes.length).toBe(0);
    //     expect(container.revisions.revisions.length).toBe(0);
    // });
    it('Track changes validation for delete revision', () => {
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertText('Helloworld');
        container.enableTrackChanges = true;
        container.selection.selectAll();
        container.editor.delete();
        expect(container.revisions.changes.length).toBe(1);
        expect(container.revisions.revisions.length).toBe(1);
        container.editorHistory.undo();
        expect(container.revisions.changes.length).toBe(0);
        expect(container.revisions.revisions.length).toBe(0);
        container.editorHistory.redo();
        expect(container.revisions.changes.length).toBe(1);
        expect(container.revisions.revisions.length).toBe(1);
    });
    it('Track changes validation for deleting paragraph and table', () => {
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertText('HelloWorld');
        container.editor.onEnter();
        container.editor.insertTable(2, 2);
        container.selection.selectAll();
        container.editor.delete();
        expect(container.revisions.changes.length).toBe(0);
        expect(container.revisions.revisions.length).toBe(0);
        container.editorHistory.undo();
        expect(container.revisions.changes.length).toBe(4);
        expect(container.revisions.revisions.length).toBe(2);
        container.editorHistory.redo();
        expect(container.revisions.changes.length).toBe(0);
        expect(container.revisions.revisions.length).toBe(0);
    });
    it('Track changes validation for deleting table and paragraph with insert revision-1', () => {
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertTable(2, 2);
        container.selection.handleDownKey();
        container.selection.handleDownKey();
        container.editor.insertText('HelloWorld');
        container.selection.selectAll();
        container.editor.delete();
        expect(container.revisions.changes.length).toBe(0);
        expect(container.revisions.revisions.length).toBe(0);
        container.editorHistory.undo();
        expect(container.revisions.changes.length).toBe(3);
        expect(container.revisions.revisions.length).toBe(2);
        container.editorHistory.redo();
        expect(container.revisions.changes.length).toBe(0);
        expect(container.revisions.revisions.length).toBe(0);
    });
    it('Track changes validation for deleting table and paragraph with insert revision-2', () => {
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertTable(2, 2);
        container.selection.handleDownKey();
        container.selection.handleDownKey();
        container.editor.insertText('Hello');
        container.editor.onEnter();
        container.editor.insertText('World');
        container.selection.selectAll();
        container.editor.delete();
        expect(container.revisions.changes.length).toBe(0);
        expect(container.revisions.revisions.length).toBe(0);
        container.editorHistory.undo();
        expect(container.revisions.changes.length).toBe(5);
        expect(container.revisions.revisions.length).toBe(2);
        container.editorHistory.redo();
        expect(container.revisions.changes.length).toBe(0);
        expect(container.revisions.revisions.length).toBe(0);
    });
    it('Deleting the delete revision with track changes disabled', () => {
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertText('Hello');
        container.editor.onEnter();
        container.editor.onEnter();
        container.enableTrackChanges = true;
        container.selection.select('0;0;5', '0;0;5');
        container.editor.delete();
        container.enableTrackChanges = false;
        container.editor.onBackSpace();
        expect(container.revisions.changes.length).toBe(0);
        expect(container.revisions.revisions.length).toBe(0);
    });
    it('Track changes validation for paragraph removed on undo', () => {
        container.openBlank();
        container.editor.insertText('HelloWorld');
        container.editor.onEnter();
        container.editor.insertTable(2, 2);
        container.enableTrackChanges = true;
        container.selection.select('0;0;0','0;1;0;1;0;1');
        container.editor.delete();
        container.editorHistory.undo();
        expect(container.selection.text).toBe('HelloWorld\r\r\r');
    });
    it('Track changes validation for revision not combined on deleting untracked content', () => {
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertText('Hello');
        container.enableTrackChanges = false;
        container.editor.insertText('S');
        container.enableTrackChanges = true;
        container.editor.insertText('World');
        container.enableTrackChanges = false;
        container.selection.select('0;0;5', '0;0;5');
        container.editor.delete();
        expect(container.revisions.changes.length).toBe(1);
        expect(container.revisions.revisions.length).toBe(1);
    });
    it('Track changes validation for para mark revision not removed undo', () => {
        container.openBlank();
        container.editor.insertTable(2, 2);
        container.enableTrackChanges = true;
        container.editor.onEnter();
        container.editorHistory.undo();
        expect(container.revisions.changes.length).toBe(0);
        expect(container.revisions.revisions.length).toBe(0);
        container.editorHistory.redo();
        expect(container.revisions.changes.length).toBe(1);
        expect(container.revisions.revisions.length).toBe(1);
    });
    it('Track changes validation for revision not removed in header & footer ', () => {
        container.openBlank();
        container.enableTrackChanges = true;
        container.selection.goToHeader();
        container.editor.insertText('HelloWorld');
        container.revisions.get(0).reject();
        container.editorHistory.undo();
        container.editorHistory.redo();
        expect(container.revisions.changes.length).toBe(0);
        expect(container.revisions.revisions.length).toBe(0);
        container.selection.goToFooter();
        container.editor.insertText('HelloWorld');
        container.revisions.get(0).reject();
        container.editorHistory.undo();
        container.editorHistory.redo();
        expect(container.revisions.changes.length).toBe(0);
        expect(container.revisions.revisions.length).toBe(0);
    });
    it('Track changes validation for revisions splitted in the pane', () => {
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertText('HelloWorld');
        container.selection.select('0;0;5', '0;0;5');
        container.editor.onEnter();
        container.editorHistory.undo();
        container.editorHistory.redo();
        expect(container.revisions.changes.length).toBe(3);
        expect(container.revisions.revisions.length).toBe(1);
    });
    it('Track changes validation for insert row between table revision', () => {
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertTable(2, 2);
        container.enableTrackChanges = false;
        container.editor.insertRow();
        expect(container.revisions.changes.length).toBe(2);
        let newRow: TableRowWidget = container.selection.start.paragraph.associatedCell.ownerRow as TableRowWidget;
        expect(newRow.rowFormat.revisionLength).toBe(0);
    });
});

describe('Track changes-Validation for nested table', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableSelection: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Deleting the insert revision in the nested table', () => {
        container.openBlank();
        container.editor.insertTable(2, 2);
        container.enableTrackChanges = true;
        container.selection.selectAll();
        container.editor.onBackSpace();
        container.editor.insertText('Hello');
        expect(container.revisions.changes.length).toBe(7);
        expect(container.revisions.length).toBe(2);
        container.selection.selectRow();
        container.editor.onBackSpace();
        expect(container.revisions.changes.length).toBe(6);
        expect(container.revisions.length).toBe(1);
    });
    it('On undo delete revision should be removed', () => {
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertTable(2, 2);
        container.editor.insertTable(2, 2);
        container.enableTrackChanges = true;
        container.selection.select('0;0;0;1;0;0', '0;0;0;1;0;0');
        container.selection.selectRow();
        container.editor.onBackSpace();
        expect(container.revisions.changes.length).toBe(9);
        container.editorHistory.undo();
        expect(container.revisions.changes.length).toBe(0);
    });
});

describe('Track changes-Validation for combination of insert and delete', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableSelection: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Splitting the revision based on author', () => {
        console.log('Splitting the revision based on author');
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertText('HelloWorld');
        container.editor.onEnter();
        container.currentUser = 'Syncfusion';
        container.selection.select('0;0;0', '0;0;11');
        container.editor.onBackSpace();
        container.selection.select('0;0;5', '0;0;5');
        container.editor.insertText('B');
        expect(container.revisions.changes.length).toBe(7);
        expect(container.revisions.revisions.length).toBe(5);
    });
    it('splitting the revision based on insertion and deletion', () => {
        console.log('splitting the revision based on insertion and deletion');
        container.openBlank();
        container.currentUser = '';
        container.enableTrackChanges = true;
        container.editor.insertText('HelloWorld');
        container.editor.onEnter();
        container.currentUser = 'Syncfusion';
        container.selection.select('0;0;3', '0;0;8');
        container.editor.onBackSpace();
        expect(container.revisions.revisions.length).toBe(2);
        expect(container.revisions.changes.length).toBe(3);
    });    
    it('Checking the owner node for delete action', () => {
        console.log('Checking the owner node for delete action');
        container.openBlank();
        container.currentUser = '';
        container.editor.insertText('HelloWorld');
        container.editor.onEnter();
        container.currentUser = 'Syncfusion';
        container.selection.selectAll();
        container.editor.onBackSpace();
        expect((container.revisions.revisions[0].getRange()[0] as TextElementBox).text).toBe('HelloWorld');
    });
    it('Checking the owner node for delete action', () => {
        console.log('Checking the owner node for delete action');
        container.openBlank();
        container.currentUser = '';
        container.editor.insertTable(2,2);
        container.currentUser = 'Syncfusion';
        container.selection.select('0;0;0;0;0;0', '0;0;0;0;0;0') ;
        container.editor.insertRow(false, 1);
        expect((container.revisions.revisions[0].getRange()[0] as WRowFormat).ownerBase.indexInOwner).toBe(0);
        expect((container.revisions.revisions[1].getRange()[0] as WRowFormat).ownerBase.indexInOwner).toBe(1);
        expect((container.revisions.revisions[2].getRange()[0] as WRowFormat).ownerBase.indexInOwner).toBe(2);
    });
});
describe('Nested table -track changes pane validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableSelection: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Nested table -track changes pane validation', () => {
        console.log('Nested table -track changes pane validation');
        container.openBlank();
        container.editor.insertTable(2,2)
        container.selection.select('0;0;0;1;0;0', '0;0;0;1;0;0');
        container.enableTrackChanges = true;
        container.editor.insertTable(2,2)
        container.selection.select('0;0;0;1;0;0;0;0;0', '0;0;0;1;0;0;0;0;0');
        container.editor.insertText('1');
        container.selection.select('0;0;0;1;0;0;1;0;0', '0;0;0;1;0;0;1;0;0');
        container.editor.insertText('2');
        container.selection.select('0;0;0;1;0;1;0;0;0', '0;0;0;1;0;1;0;0;0');
        container.editor.insertText('3');
        container.selection.select('0;0;0;1;0;1;1;0;0', '0;0;0;1;0;1;1;0;0');
        container.editor.insertText('4');
        container.currentUser = 'Syncfusion';
        container.selection.select('0;0;0;1;0;0;0;0;1', '0;0;0;1;0;1;1;0;2');
        container.editor.onBackSpace();
        expect(container.revisions.revisions.length).toBe(2);
        expect(container.revisions.revisions[0].ownerNode instanceof WRowFormat).toBe(true);
        expect(container.revisions.revisions[1].ownerNode instanceof WRowFormat).toBe(true);
        let revisions1 = container.revisions.groupedView.get(container.trackChangesPane.changes.get(container.revisions.revisions[0]));
        let revisions2 = container.revisions.groupedView.get(container.trackChangesPane.changes.get(container.revisions.revisions[1]));
        expect(revisions1[0].ownerNode instanceof WRowFormat).toBe(true);
        expect(revisions2[0].ownerNode instanceof WRowFormat).toBe(true);
    });
});
describe('Track changes - Nested table combination', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableSelection: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('deleting the nested table', () => {
        console.log('deleting the nested table');
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertTable(2,2);
        container.currentUser = 'Syncfusion';
        container.selection.select('0;0;0;0;0;0', '0;0;0;0;0;0');
        container.editor.insertTable(2,2);
        container.selection.select('0;1;0', '0;0;0;0;0;0;0;0;0');
        expect(() => { container.editor.delete(); }).not.toThrowError();
    });
    it('nested table - row backspace', () => {
        console.log('nested table backspace');
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertTable(2,2);
        container.currentUser = 'Syncfusion1';
        container.selection.select('0;0;0;0;0;0', '0;0;0;0;0;0');
        container.editor.insertTable(2,2);
        container.selection.select('0;0;0;1;0;1', '0;0;0;0;0;1;1;0;1');
        container.editor.onBackSpace();
        const widget = (((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0];
        expect(widget instanceof ParagraphWidget).toBe(true);
    });
    it('nested table - undo/redo', () => {
        console.log('nested table - undo,redo');
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertTable(2,2);
        container.currentUser = 'Syncfusion';
        container.selection.select('0;0;0;0;0;0', '0;0;0;0;0;0');
        container.editor.insertTable(2,2);
        container.selection.select('0;0;0;1;0;1', '0;0;0;0;0;0;1;0;1');
        container.editor.delete();
        container.editorHistoryModule.undo();
        expect(() => { container.editorHistoryModule.redo(); }).not.toThrowError();
    });
});
describe('Track changes - Paramark Combine and split revisions', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableSelection: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Combine and split revisions in Paramark.', () => {
        console.log('Combine and split revisions in Paramark.');
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertText("Helloworld");
        container.enableTrackChanges = false;
        container.editor.onEnter();
        container.enableTrackChanges = true;
        container.editor.onEnter();
        container.enableTrackChanges = false;
        container.selection.select('0;0;11', '0;0;11')
        container.editor.delete();
        expect(container.revisions.length).toBe(1);
        container.editorHistory.undo();
        expect(container.revisions.length).toBe(2);
        container.editorHistory.redo();
        expect(container.revisions.length).toBe(1);
    });
});
describe('Track changes - Nested table undo redo', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableSelection: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Nested table undo redo', () => {
        console.log('Nested table undo redo');
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertTable(2,2);
        container.selection.select('0;0;0;0;0;0', '0;0;0;0;0;0');
        container.editor.insertTable(2,2);
        container.revisions.acceptAll();
        expect(((((((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] instanceof ParagraphWidget).toBe(true);

        container.editorHistory.undo();
        expect(((((((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] instanceof ParagraphWidget).toBe(true);

        container.editorHistory.redo();
        expect(((((((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] instanceof ParagraphWidget).toBe(true);
    });
});
describe('Track changes - Paragraph and table row combination', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableSelection: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('deleting the tracked para and row', () => {
        console.log('deleting the nested table');
        container.openBlank();
        container.editor.insertText("Helloworld");
        container.editor.onEnter();
        container.enableTrackChanges = true;
        container.editor.insertTable(2,2);
        container.selection.select('0;0;0', '0;1;0;0;0;1');
        container.editor.delete();
        container.editorHistory.undo();
        expect(container.revisions.length).toBe(1);
    });
    it('skip delete track', () => {
        console.log('skip delete track');
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertTable(2,2);
        container.selection.select('0;0;0;0;0;0', '0;0;0;0;0;0');
        container.editor.insertText("Helloworld");
        container.editor.insertTable(2,2);
        container.enableTrackChanges = true;
        container.selection.select('0;0;0;0;0;5', '0;0;0;0;1;0;0;0;1');
        container.editor.delete();
        expect(container.revisions.length).toBe(0);
    });
});
describe('Track changes - Command Validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableSelection: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Inserting revision - Track changes enabled', () => {
        console.log('Inserting revision - Track changes enabled');
        container.openBlank();
        container.enableTrackChanges = true;
        setTimeout(function () {
            container.editor.insertText('HelloWorld');
            expect(container.revisions.revisions.length).toBe(1);
            container.selection.select('0;0;2', '0;0;6');
            container.editor.insertComment('Sync');
            expect(container.revisions.revisions.length).toBe(1);
            container.editorHistoryModule.undo();
            expect(container.revisions.revisions.length).toBe(1);
        }, 1000)
        container.enableTrackChanges = false;
        setTimeout(function () {
            container.editorHistoryModule.redo();
            expect(container.revisions.revisions.length).toBe(1);
        }, 1000)
    });
    it('Inserting revision - Track changes disabled', () => {
        console.log('Inserting revision - Track changes disabled');
        container.openBlank();
        container.enableTrackChanges = false;
        setTimeout(function () {
            container.editor.insertText('HelloWorld');
            expect(container.revisions.revisions.length).toBe(1);
            container.selection.select('0;0;2', '0;0;6');
            container.editor.insertComment('Sync');
            expect(container.revisions.revisions.length).toBe(2);
            container.editorHistoryModule.undo();
            expect(container.revisions.revisions.length).toBe(1);
            container.enableTrackChanges = true;
        }, 1000)
        setTimeout(function () {
            container.editorHistoryModule.redo();
            expect(container.revisions.revisions.length).toBe(2);
        }, 1000)
    });
    it('Deleting revision - Track changes enabled', () => {
        console.log('Deleting revision - Track changes enabled');
        container.openBlank();
        container.editor.insertText('HelloWorld');
        container.enableTrackChanges = true;
        setTimeout(function () {
            container.selection.select('0;0;0', '0;0;11');
            container.editor.delete();
            expect(container.revisions.revisions.length).toBe(1);
            container.selection.select('0;0;2', '0;0;6');
            container.editor.insertComment('Sync');
            expect(container.revisions.revisions.length).toBe(2);
            container.editorHistoryModule.undo();
            expect(container.revisions.revisions.length).toBe(1);
        }, 1000)
        container.enableTrackChanges = false;
        setTimeout(function () {
            container.editorHistoryModule.redo();
            expect(container.revisions.revisions.length).toBe(2);
        }, 1000)
    });
    it('Deleting revision - Track changes disabled', () => {
        console.log('Deleting revision - Track changes disabled');
        container.openBlank();
        container.editor.insertText('HelloWorld');
        container.enableTrackChanges = true;
        setTimeout(function () {
            container.selection.select('0;0;0', '0;0;11');
            container.editor.delete();
            expect(container.revisions.revisions.length).toBe(1);
            container.enableTrackChanges = false;
            container.selection.select('0;0;2', '0;0;6');
            container.editor.insertComment('Sync');
            expect(container.revisions.revisions.length).toBe(2);
            container.editorHistoryModule.undo();
            expect(container.revisions.revisions.length).toBe(1);
        }, 1000)
        container.enableTrackChanges = true;
        setTimeout(function () {
            container.editorHistoryModule.redo();
            expect(container.revisions.revisions.length).toBe(2);
        }, 1000)
    });
});
describe('Track changes - ParaMark Revision', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableSelection: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track changes - ParaMark Revision', function () {
        console.log('Track changes - ParaMark Revision');
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertText("Hello");
        container.editor.onEnter();
        container.editor.onEnter();
        container.enableTrackChanges = false;
        container.selection.select('0;0;5', '0;0;5');
        container.editor.onEnter();
        expect((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).characterFormat.revisionLength).toBe(0);
    });
});
describe('Track changes - Reject on Bookmark', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableSelection: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track changes - Reject on Bookmark', function () {
        console.log('Track changes - Reject on Bookmark');
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertText("Hello");
        container.editor.onEnter();
        container.editor.insertText("world");
        container.selection.select('0;0;0', '0;1;6');
        container.editor.insertBookmark('b1');
        container.revisions.get(0).reject();
        expect(((container.selection.start.paragraph.childWidgets[0]) as LineWidget).children.length).toBe(0);
    });
});

describe('Track changes - Select para mark only, select next paragraph partially and delete', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableSelection: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track changes - Select para mark only, select next paragraph partially and delete - Undo / Redo', function () {
        console.log('Track changes - Select para mark only, select next paragraph partially and delete - Undo / Redo');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = 'Syncfusion';
        container.editor.insertText("Hello");
        container.currentUser = 'DocumentEditor';
        container.editor.onEnter();
        container.editor.insertText("World");
        container.currentUser = 'Syncfusion';
        container.selection.select('0;0;5', '0;1;2');
        container.editor.delete();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
        container.editorHistoryModule.undo();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
        container.editorHistoryModule.redo();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
    });

    it('Track changes - Select para mark only, select next paragraph partially and delete - Accept and Undo / Redo', function () {
        console.log('Track changes - Select para mark only, select next paragraph partially and delete - Accept and Undo / Redo');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = 'Syncfusion';
        container.editor.insertText("Hello");
        container.currentUser = 'DocumentEditor';
        container.editor.onEnter();
        container.editor.insertText("World");
        container.currentUser = 'Syncfusion';
        container.selection.select('0;0;5', '0;1;2');
        container.editor.delete();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
        container.revisions.revisions[2].accept();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(1);
        container.editorHistoryModule.undo();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
        container.editorHistoryModule.redo();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(1);
    });
    it('Track changes - Select para mark only, select next paragraph partially and delete - Reject and Undo / Redo', function () {
        console.log('Track changes - Select para mark only, select next paragraph partially and delete - Reject and Undo / Redo');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = 'Syncfusion';
        container.editor.insertText("Hello");
        container.currentUser = 'DocumentEditor';
        container.editor.onEnter();
        container.editor.insertText("World");
        container.currentUser = 'Syncfusion';
        container.selection.select('0;0;5', '0;1;2');
        container.editor.delete();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
        container.revisions.revisions[2].reject();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
        container.editorHistoryModule.undo();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
        container.editorHistoryModule.redo();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
    });

    it('Track changes - Select para mark only, select next paragraph partially and delete - Undo / Redo, Accept and Undo / Redo', function () {
        console.log('Track changes - Select para mark only, select next paragraph partially and delete - Undo / Redo, Accept and Undo / Redo');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = 'Syncfusion';
        container.editor.insertText("Hello");
        container.currentUser = 'DocumentEditor';
        container.editor.onEnter();
        container.editor.insertText("World");
        container.currentUser = 'Syncfusion';
        container.selection.select('0;0;5', '0;1;2');
        container.editor.delete();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
        container.editorHistoryModule.undo();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
        container.editorHistoryModule.redo();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
        container.revisions.revisions[2].accept();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(1);
        container.editorHistoryModule.undo();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
        container.editorHistoryModule.redo();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(1);
    });
    it('Track changes - Select para mark only, select next paragraph partially and delete - Undo / Redo, Reject and Undo / Redo', function () {
        console.log('Track changes - Select para mark only, select next paragraph partially and delete - Undo / Redo, Reject and Undo / Redo');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = 'Syncfusion';
        container.editor.insertText("Hello");
        container.currentUser = 'DocumentEditor';
        container.editor.onEnter();
        container.editor.insertText("World");
        container.currentUser = 'Syncfusion';
        container.selection.select('0;0;5', '0;1;2');
        container.editor.delete();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
        container.editorHistoryModule.undo();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
        container.editorHistoryModule.redo();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
        container.revisions.revisions[2].reject();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
        container.editorHistoryModule.undo();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
        container.editorHistoryModule.redo();
        expect(container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
    });
});

describe('Track changes - Select first para mark and next paragraph partially', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableSelection: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track changes - Select first para partially and next para mark alone - Undo / Redo', function () {
        console.log('Track changes - Select first para partially and next para mark alone - Undo / Redo');
        container.openBlank();
        container.editor.insertText("Hello");
        container.editor.onEnter();
        container.editor.onEnter();
        container.enableTrackChanges = true;
        container.selection.select('0;0;2', '0;1;1');
        container.editor.delete();
        expect(container.revisions.revisions.length).toBe(1);
        container.editorHistory.undo();
        expect(container.revisions.revisions.length).toBe(0);
        container.editorHistory.redo();
        expect(container.revisions.revisions.length).toBe(1);
    });

    it('Track changes - Select first para partially and next para mark alone - Accept and Undo / Redo', function () {
        console.log('Track changes - Select first para partially and next para mark alone - Accept and Undo / Redo');
        container.openBlank();
        container.editor.insertText("Hello");
        container.editor.onEnter();
        container.editor.onEnter();
        container.enableTrackChanges = true;
        container.selection.select('0;0;2', '0;1;1');
        container.editor.delete();
        expect(container.revisions.revisions.length).toBe(1);
        container.revisions.revisions[0].accept();
        expect(container.revisions.revisions.length).toBe(0);
        container.editorHistory.undo();
        expect(container.revisions.revisions.length).toBe(1);
        container.editorHistory.redo();
        expect(container.revisions.revisions.length).toBe(0);
    });

    it('Track changes - Select first para partially and next para mark alone - Reject and Undo / Redo', function () {
        console.log('Track changes - Select first para partially and next para mark alone - Reject and Undo / Redo');
        container.openBlank();
        container.editor.insertText("Hello");
        container.editor.onEnter();
        container.editor.onEnter();
        container.enableTrackChanges = true;
        container.selection.select('0;0;2', '0;1;1');
        container.editor.delete();
        expect(container.revisions.revisions.length).toBe(1);
        container.revisions.revisions[0].reject();
        expect(container.revisions.revisions.length).toBe(0);
        container.editorHistory.undo();
        expect(container.revisions.revisions.length).toBe(1);
        container.editorHistory.redo();
        expect(container.revisions.revisions.length).toBe(0);
    });

    it('Track changes - Select first para partially and next para mark alone - Undo / Redo, Accept and Undo / Redo', function () {
        console.log('Track changes - Select first para partially and next para mark alone - Undo / Redo, Accept and Undo / Redo');
        container.openBlank();
        container.editor.insertText("Hello");
        container.editor.onEnter();
        container.editor.onEnter();
        container.enableTrackChanges = true;
        container.selection.select('0;0;2', '0;1;1');
        container.editor.delete();
        expect(container.revisions.revisions.length).toBe(1);
        container.revisions.revisions[0].accept();
        expect(container.revisions.revisions.length).toBe(0);
        container.editorHistory.undo();
        expect(container.revisions.revisions.length).toBe(1);
        container.editorHistory.redo();
        expect(container.revisions.revisions.length).toBe(0);
    });

    it('Track changes - Select first para partially and next para mark alone - Undo / Redo, Reject and Undo / Redo', function () {
        console.log('Track changes - Select first para partially and next para mark alone - Undo / Redo, Reject and Undo / Redo');
        container.openBlank();
        container.editor.insertText("Hello");
        container.editor.onEnter();
        container.editor.onEnter();
        container.enableTrackChanges = true;
        container.selection.select('0;0;2', '0;1;1');
        container.editor.delete();
        expect(container.revisions.revisions.length).toBe(1);
        container.revisions.revisions[0].reject();
        expect(container.revisions.revisions.length).toBe(0);
        container.editorHistory.undo();
        expect(container.revisions.revisions.length).toBe(1);
        container.editorHistory.redo();
        expect(container.revisions.revisions.length).toBe(0);
    });
});
describe('Track changes - to retrieves the content of the revision as an HTML string', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableSelection: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track changes - table validation', function () {
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertTable(2, 2);
        expect(container.revisions.get(0).getContent()).toBe('<table class="e-de-track-chng-table"><tbody><tr><td class="e-de-tc-tble-cell"></td><td class="e-de-tc-tble-cell"></td></tr><tr><td class="e-de-tc-tble-cell"></td><td class="e-de-tc-tble-cell"></td></tr></tbody></table><span></span>');
    });
    it('Track changes - image validation', function () {
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertImage('https://cdn.syncfusion.com/content/images/dashboard/release-announcement-iconV2.png');
        setTimeout(function () {
            expect(container.revisions.get(0).getContent()).toBe('<img src="https://cdn.syncfusion.com/content/images/dashboard/release-announcement-iconV2.png" class="e-de-tc-shrink-img"><span></span>');
        }, 1000)
    });
    it('Track changes - text validation', function () {
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertText("HelloWorld");
        container.editor.onEnter();
        expect(container.revisions.get(0).getContent()).toBe('<span>HelloWorld</span><span class="e-de-tc-pmark">¶</span><br><span></span>');
    });
    it('multiple paragraph single track changes', function () {
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertText("Hello");
        container.editor.onEnter();
        container.editor.insertText("World");
        container.editor.onEnter();
        container.editor.insertText("Hello");
        container.editor.onEnter();
        container.editor.insertText("Syncfusion");
        expect(container.revisions.get(0).getContent()).toBe('<span>Hello</span><span class="e-de-tc-pmark">¶</span><br><span>World</span><span class="e-de-tc-pmark">¶</span><br><span>Hello</span><span class="e-de-tc-pmark">¶</span><br><span>Syncfusion</span>');
    });
    it('multiple paragraph Multiple track changes', function () {
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertText("Helloworld");
        container.editor.onEnter();
        container.editor.insertText("HelloSyncfusion");
        container.editor.onEnter();
        container.editor.insertText("HelloTrackchanges");
        container.selection.select('0;0;10', '0;0;10');
        container.editor.onEnter();
        container.editor.insertTable(2,2);
        container.selection.select('0;3;15','0;3;15');
        container.editor.onEnter();
        container.editor.insertTable(2,2);
        expect(container.revisions.get(0).getContent()).toBe('<span>Helloworld</span><span class="e-de-tc-pmark">¶</span><br><span></span>');
        expect(container.revisions.get(3).getContent()).toBe('<table class="e-de-track-chng-table"><tbody><tr><td class="e-de-tc-tble-cell"></td><td class="e-de-tc-tble-cell"></td></tr><tr><td class="e-de-tc-tble-cell"></td><td class="e-de-tc-tble-cell"></td></tr></tbody></table><span></span>');
        expect(container.revisions.get(4).getContent()).toBe('<span class="e-de-tc-pmark">¶</span><br><span>HelloTrackchanges</span>');
    });
});
