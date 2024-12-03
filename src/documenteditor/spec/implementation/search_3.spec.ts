import { LayoutViewer } from '../../src/index';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Search } from '../../src/document-editor/implementation/search/index';
import { TestHelper } from '../test-helper.spec';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { OptionsPane } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/index'

/**
 * Search Module public API
 */
//To-Do-Cases
// describe('Search Public API validation Replace All Validation ', () => {
//     let editor: DocumentEditor = undefined;
//     beforeAll(() => {
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.innerHTML = '';
//         document.body.appendChild(ele);
//         DocumentEditor.Inject(Editor, Selection, Search);
//         editor = new DocumentEditor({
//             enableEditor: true, enableSelection: true, isReadOnly: false, enableSearch: true,
//         });
//         (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.appendTo('#container');
//     });
//     afterAll((done) => {
//         document.body.removeChild(document.getElementById('container'));
//         editor.destroy();
//         editor = undefined;
//         document.body.innerHTML = '';
//         setTimeout(() => {
//             done();
//         }, 1000);
//     });
//     it('Replace Operation with out search result', () => {
// console.log('Replace Operation with out search result');
//         editor.editorModule.insertText('Syncfusion sft pvt ltd');
//         let spy = jasmine.createSpy('searchChange');
//         editor.searchResultsChange = spy;
//         editor.search.searchResults.replaceAll("Software");
//         editor.search.searchResults.replace("Software");
//         expect(spy).not.toHaveBeenCalled();
//     });
//     it('Search result change event validtion', () => {
// console.log('Search result change event validtion');
//         editor.editorModule.insertText('Syncfusion sft pvt ltd');
//         editor.editorModule.insertText('Syncfusion sft pvt ltd');
//         editor.editorModule.insertText('Syncfusion sft pvt ltd');
//         editor.editorModule.insertText('Syncfusion sft pvt ltd');
//         editor.editorModule.insertText('Syncfusion sft pvt ltd');
//         editor.searchModule.findAll('sft');
//         expect(editor.search.searchResults.length).toBe(6);
//         let spy = jasmine.createSpy('findOperation');
//         editor.searchResultsChange = spy;
//         editor.search.searchResults.replaceAll("Software");
//         expect(spy).toHaveBeenCalled();
//         expect(editor.search.searchResults.length).toBe(0);
//     });
//     it('Search result change event validtion', () => {
// console.log('Search result change event validtion');
//         editor.editorModule.insertText('Syncfusion sft pvt ltd');
//         editor.editorModule.insertText('Syncfusion sft pvt ltd');
//         editor.editorModule.insertText('Syncfusion sft pvt ltd');
//         editor.editorModule.insertText('Syncfusion sft pvt ltd');
//         editor.editorModule.insertText('Syncfusion sft pvt ltd');
//         editor.editorModule.insertText('Syncfusion sft pvt ltd');
//         editor.searchModule.findAll('sft');
//         let spy = jasmine.createSpy('replaceOperation');
//         editor.searchResultsChange = spy;
//         editor.search.searchResults.replace("Software");
//         expect(spy).toHaveBeenCalled();
//     });
//});

