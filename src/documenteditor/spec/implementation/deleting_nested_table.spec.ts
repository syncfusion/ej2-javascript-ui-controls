// import { DocumentEditor } from '../../src/document-editor/document-editor';
// import { createElement } from '@syncfusion/ej2-base';
// import { Editor, TableCellWidget, TableRowWidget, TableWidget } from '../../src/index';
// import { TestHelper } from '../test-helper.spec';
// import { Selection } from '../../src/index';
// import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
// import { SfdtExport } from '../../src/document-editor/implementation/writer/sfdt-export';
// /**
//  * Deleting table of content
//  */
// let sfdtContent: any ='{"sfdt":"UEsDBAoAAAAIAFRxLFn6p9vTmwQAADIuAAAEAAAAc2ZkdO2aSW/bOBSA/4rBubqGdlm6DTrwzGEwKNCeJvBBGyU1tKSh6Cipkf8+j4t3yZXbxBJQG4gfw/UtHxdR3qCyYvkq/5Z8xjFDPqPrZIrqJEL+wwaBrCjyN6hqkO/oxhRVGfJdDxJkBQmQVEmmZKhkFiPfdKYIKxnjCvkayDKRiTCXAkZC/yTNpyBN0BQlBUY+NMdcQjHNtzIRMscF8nWQiZRVWtTQwe80CPMI2hdRSWpRkvzXCElCFommsuRh+QqDCuuo+JaWypwKc2PDmNZcMlB0A7UJk5KmUobq/0yKJy54tbwQ42Ala1Zw00q6CgjixVhVjLBsmAttluA75eW+A8exkutWRWpVzIOm2+D7aJcAF1TCK7QRCa4Nj8Pr9Fd3gX53gSG0oFKLTGifMTlJ30alNBS9pQEnjvv7PveGmnti+cUBqRO+tsZ8YURWDIvzS/1Y0WfTSh6f5l4UlhVaKndtTltCPiOgJArqGKeoR0dLbusgVvazIettxKB7x5lZ702ya8wUyio1UpZH5g79lgvqntzGteOvVUgK5oRJDMM3a2wCuAOuuHdi78ReIJY4j9ZXjbhJSEqnScPmJQswJxa0SSn0+CDU5l9cv5C0OArx0z30ScBIbWZvVTzPFhqfZ4fttdvsOa/11JJ7EIItHfwhSZPPTPbMkg9RIhHKgqphAkken4gfyKZjPxQsx69i955/3ZZ/+wPqxdNKP73vj1b3R6v7o9X9WuM+924193ZHFq6U+vuVDi3mT++V/dnKZMlydzjYnQ32pwRcfwMWgAoMVdDHgOQhzaHbteJYkiDPo5m8KYYmfMuVjXjqoFkQ7XvGwVERxgVOTnKOMji2bzEJ6clkZFL7UIYyUBGV1+BEWViS3a27Uv+Rj7pNN8Uu3UTb1wB7z+NaacQwUWixRl7s89t1XV3ccxeCsghMr5XEKzl+JUWcsZXUBGOpYFSuKhWKF5gkUktBO38z8NtCfJDA4kWsY0dwqM5/zqunfBXP+yE4zXzEv5Igzot0or/VoN8NJX/dchjLmeZ6uuM4tua6huZZ7nFw9fOzskTfOUZ/8neewvoHmcK/xsK2PAed0LyvdMz0QX5LtnyzcjBzD/02+ZgFFH3HudtKTKIxpBV/JDhYEzb5FNAgpUGVTRZlwXYqdxQfqf56ap9xM3iuY8foYsccBTtGH3aMbnbMkbGzVdkcKQ5mFw7GRUfqC9N1zPfHweyDg9mNw82t6ImDNVIcrHMc8u0RYQSrg9UHB6sNh4Gs6ImDPVIc7JbVYXgK7D4U2K2LwhiD74w0+M5Vwb/VjuD0Cb5zZfCH2wjckQbf/bGN4FYUuH0ocH90IxgOh/lIcZh3HRO1mX3Rlab4vD8Q8z5AzLsPigPY0RMJb6RIeJdWiFGx4fVhw7u8WIwYkoS+DSHtl4nnV2ZHfhYuVVpslVqUJRteKaUFvzEm4hYZOiNSRisp5S+7eKj+XCc1m6xroTb/cTQyNMP6oHkfdOOLbvia6ZvGTNfMf/m7WIkIzWOo1/FClvuiZ8eWMdO8+VnH7T/tubZf76zf9h9giIv1Z+mWfJXWwr3/A1BLAQIUAAoAAAAIAFRxLFn6p9vTmwQAADIuAAAEAAAAAAAAAAAAAAAAAAAAAABzZmR0UEsFBgAAAAABAAEAMgAAAL0EAAAAAA=="}';
// describe('907949-Resolve script error when deleting nested table', () => {
//     let editor: DocumentEditor = undefined;
//     let event: any;
//     beforeAll((): void => {
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.appendChild(ele);
//         editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
//         DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport); editor.enableEditorHistory = true;
//         (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.appendTo('#container');
//     });
//     afterAll((done): void => {
//         editor.destroy();
//         document.body.removeChild(document.getElementById('container'));
//         editor = undefined;
//         setTimeout(function () {
//             document.body.innerHTML = '';
//             done();
//         }, 1000);
//     });
//     it('deleting the nested table', () => {
//         editor.open(sfdtContent);
//         editor.selection.select('0;0;1;1;0;0','0;0;1;1;5;4');
//         expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[1] as TableRowWidget).childWidgets[1] as TableCellWidget).childWidgets.length).toBe(6);
//         expect(() => { editor.editor.delete(); }).not.toThrowError();
//         expect(editor.revisions.length).toBe(0);
//         expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[1] as TableRowWidget).childWidgets[1] as TableCellWidget).childWidgets.length).toBe(1);
//         //undo process
//         editor.editorHistory.undo();
//         expect(editor.revisions.length).toBe(2);
//         expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[1] as TableRowWidget).childWidgets[1] as TableCellWidget).childWidgets.length).toBe(6);
//         //redo process
//         editor.editorHistory.redo();
//         expect(editor.revisions.length).toBe(0);
//         expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[1] as TableRowWidget).childWidgets[1] as TableCellWidget).childWidgets.length).toBe(1);
//     });
   
// });



