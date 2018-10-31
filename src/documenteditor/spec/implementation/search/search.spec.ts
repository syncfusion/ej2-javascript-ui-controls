import { LayoutViewer, ParagraphWidget, LineWidget, TextElementBox } from '../../../src/index';
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Search } from '../../../src/document-editor/implementation/search/index';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection, Page, EditorHistory } from '../../../src/index';
/**
 * Replace all spec
 */
describe('Find and Replace all in Header footer validation', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, Search, EditorHistory);
        editor = new DocumentEditor({
            enableEditor: true, enableSelection: true, isReadOnly: false, enableSearch: true, enableEditorHistory: true
        });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        viewer = undefined;
        setTimeout(function () {
            done();
        }, 750);
    });
    it('Find All validation', () => {
        editor.open(JSON.stringify(sfdtText));
        editor.search.findAll('Adventure Cycle');
        expect(editor.search.textSearchResults.length).toBe(6);
    });
    it('Replace all validation', () => {
        editor.search.replaceAll('Giant Panda', editor.search.textSearchResults);
        for (let i: number = 0; i < editor.viewer.pages.length; i++) {
            let page: Page = editor.viewer.pages[i];
            expect((((page.headerWidget.firstChild as ParagraphWidget).firstChild as LineWidget).children[0] as TextElementBox).text).toBe('Giant Panda');
            expect((((page.footerWidget.firstChild as ParagraphWidget).firstChild as LineWidget).children[0] as TextElementBox).text).toBe('Giant Panda')
        }
    });
});
let sfdtText: object = {
    sections: [
        {
            blocks: [
                {
                    inlines: [
                        {
                            text: 'Adventure Cycle'
                        }
                    ]
                },
                {
                    inlines: [
                        {
                            text: '\f'
                        }
                    ]
                },
                {
                    inlines: []
                },
                {
                    inlines: [
                        {
                            text: 'Adventure Cycle'
                        }
                    ]
                },
                {
                    inlines: []
                }
            ],
            headersFooters: {
                header: {
                    blocks: [
                        {
                            inlines: [
                                {
                                    text: 'Adventure Cycle'
                                }
                            ]
                        }
                    ]
                },
                footer: {
                    blocks: [
                        {
                            inlines: [
                                {
                                    text: 'Adventure Cycle'
                                }
                            ]
                        }
                    ]
                }
            }
        }
    ]
};