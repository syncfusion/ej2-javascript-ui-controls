import { LayoutViewer, PageLayoutViewer, DocumentHelper } from '../../src/index';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { TextSearch } from '../../src/document-editor/implementation/search/text-search';
import { TextSearchResult } from '../../src/document-editor/implementation/search/text-search-result';
import { TestHelper } from '../test-helper.spec';
import { OptionsPane } from '../../src/index';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { Search } from '../../src/document-editor/implementation/search/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/index';
function getEventObject(eventType: string, eventName: string): Object {
    let event: any = document.createEvent(eventType);
    event.initEvent(eventName, true, true);
    let object: any = extend({}, event);
    object.preventDefault = () => { return true; };
    return object;
}
describe('Close Options pane support testing', () => {
    let editor: DocumentEditor = undefined;
    let optionsPane: OptionsPane;
    let documentHelper: DocumentHelper;;
    let keydown: any = getEventObject('KeyboardEvent', 'keydown');
    beforeEach((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(OptionsPane, Search);
        editor = new DocumentEditor({ enableOptionsPane: true, enableSelection: true, isReadOnly: false, enableSearch: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        optionsPane = editor.optionsPaneModule;
    });
    afterEach((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        optionsPane.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });
    it('destroy method validation1', () => {
console.log('destroy method validation1');
        (optionsPane as any).searchText = undefined;
        (optionsPane as any).resultsText = undefined;
        (optionsPane as any).messageDivText = undefined;
        optionsPane.destroy();
    });
//     it('destroy method validation2', () => {
// console.log('destroy method validation2');
//         documentHelper = editor.documentHelper;
//         optionsPane.destroy();
//         optionsPane.navigateNextResultButtonClick();
//         optionsPane.navigatePreviousResultButtonClick();
//     });

});
