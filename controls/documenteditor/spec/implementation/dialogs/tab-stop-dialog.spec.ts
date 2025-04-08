import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Editor, WTabStop } from '../../../src/index';
import { Selection } from '../../../src/index';

import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { ParagraphWidget } from '../../../src/index';

// describe('Tab stop API validation', () => {
//     let editor: DocumentEditor;
//     beforeAll((): void => {
//         editor = undefined;
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.appendChild(ele);
//         DocumentEditor.Inject(Editor, Selection, EditorHistory);
//         editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
//         (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.appendTo('#container');

//     });
//     afterAll((done) => {
//         editor.destroy();
//         document.body.removeChild(document.getElementById('container'));
//         editor = undefined;
//         document.body.innerHTML = '';
//         setTimeout(function () {
//             done();
//         }, 2000);
//     });
//     it('Add tab stop validation', () => {
//         console.log('Add tab stop validation');
//         editor.openBlank();
//         let paragraph: ParagraphWidget = editor.selection.start.currentWidget.paragraph;
//         let tab1: WTabStop = new WTabStop();
//         tab1.deletePosition = 0;
//         tab1.position = 150;
//         tab1.tabJustification = 'Left';
//         tab1.tabLeader = 'None';
//         editor.editor.updateTabStopCollection(paragraph, [tab1]);
//         let tabs: WTabStop[] = paragraph.paragraphFormat.tabs;
//         expect(tabs.length).toBe(1);
        
//         let tab2: WTabStop = new WTabStop();
//         tab2.deletePosition = 0;
//         tab2.position = 250;
//         tab2.tabJustification = 'Center';
//         tab2.tabLeader = 'Underscore';
//         editor.editor.updateTabStopCollection(paragraph, [tab2]);
//         expect(tabs.length).toBe(2);
//     });
//     it('Edit tab stop validation', () => {
//         console.log('Edit tab stop validation');
//         editor.openBlank();
//         let paragraph: ParagraphWidget = editor.selection.start.currentWidget.paragraph;
//         let tab1: WTabStop = new WTabStop();
//         tab1.deletePosition = 0;
//         tab1.position = 150;
//         tab1.tabJustification = 'Left';
//         tab1.tabLeader = 'None';
//         let tab2: WTabStop = new WTabStop();
//         tab2.deletePosition = 0;
//         tab2.position = 150;
//         tab2.tabJustification = 'Center';
//         tab2.tabLeader = 'Underscore';

//         editor.editor.updateTabStopCollection(paragraph, [tab1]);
//         editor.editor.updateTabStopCollection(paragraph, [tab2]);
//         let tabs: WTabStop[] = paragraph.paragraphFormat.tabs;
//         expect(tabs.length).toBe(1);
//         expect(tabs[0].tabLeader).toBe('Underscore');
//         expect(tabs[0].tabJustification).toBe('Center');
//     });
//     it('Remove tab stop validation', () => {
//         console.log('Remove tab stop validation');
//         editor.openBlank();
//         let paragraph: ParagraphWidget = editor.selection.start.currentWidget.paragraph;
//         let tab1: WTabStop = new WTabStop();
//         tab1.deletePosition = 0;
//         tab1.position = 150;
//         tab1.tabJustification = 'Left';
//         tab1.tabLeader = 'None';
//         let tab2: WTabStop = new WTabStop();
//         tab2.deletePosition = 0;
//         tab2.position = 250;
//         tab2.tabJustification = 'Center';
//         tab2.tabLeader = 'Underscore';

//         editor.editor.updateTabStopCollection(paragraph, [tab1, tab2]);
//         editor.editor.removeTabStops(editor.selection.getParagraphsInSelection(), [tab1]);
//         let tabs: WTabStop[] = paragraph.paragraphFormat.tabs;
//         expect(tabs.length).toBe(1);
//     });
//     it('Undo tab stop validation', () => {
//         console.log('Undo tab stop validation');
//         editor.openBlank();
//         let paragraph: ParagraphWidget = editor.selection.start.currentWidget.paragraph;
//         let tab1: WTabStop = new WTabStop();
//         tab1.deletePosition = 0;
//         tab1.position = 150;
//         tab1.tabJustification = 'Left';
//         tab1.tabLeader = 'None';
//         let tab2: WTabStop = new WTabStop();
//         tab2.deletePosition = 0;
//         tab2.position = 250;
//         tab2.tabJustification = 'Center';
//         tab2.tabLeader = 'Underscore';
//         editor.editor.onApplyParagraphFormat('tabStop', [tab1], false, false);
//         editor.editor.onApplyParagraphFormat('tabStop', [tab2], false, false);
//         editor.editorHistory.undo();
//         expect(paragraph.paragraphFormat.tabs.length).toBe(1);
//         editor.editorHistory.undo();
//         expect(paragraph.paragraphFormat.tabs.length).toBe(0);
//     });
//     it('Redo tab stop validation', () => {
//         console.log('Redo tab stop validation');
//         let paragraph: ParagraphWidget = editor.selection.start.currentWidget.paragraph;
//         editor.editorHistory.redo();
//         expect(paragraph.paragraphFormat.tabs.length).toBe(1);
//         editor.editorHistory.redo();
//         expect(paragraph.paragraphFormat.tabs.length).toBe(2);
//     });
// });