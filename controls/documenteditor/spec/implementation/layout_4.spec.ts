import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, Selection, Layout, PageLayoutViewer } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
/**
 * Layout spec
 */
let sfdt: object = {
    'sections': [
        {
            'blocks': [
                {
                    'inlines': [
                        {
                            'characterFormat': {
                                'bold': true,
                                'italic': true
                            },
                            'text': 'Hello World'
                        }
                    ]
                }
            ],
            'headersFooters': {
            }
        },
        {
            'blocks': [
                {
                    'inlines': [
                        {
                            'characterFormat': {
                                'bold': true,
                                'italic': true
                            },
                            'text': 'Hello World'
                        }
                    ]
                }
            ],
            'headersFooters': {
            }
        }
    ]
};

describe('Layout multiple section', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Enter press multiple times', () => {
        editor.open(JSON.stringify(sfdt));
        expect((editor.viewer as PageLayoutViewer).pages.length).toBe(2);
        for (let i: number = 0; i < 60; i++) {
            editor.editorModule.onEnter();
        }
        expect((editor.viewer as PageLayoutViewer).pages.length).toBe(3);
    })
});

describe('Layout Module branches validation', () => {
    let layout: any = new Layout({} as any);
    it('Shift next widget validation', () => {
        expect(() => { layout.shiftNextWidgets({}); }).not.toThrowError();
    });
    it('Get Top margin validation', () => {
        expect(layout.getMaxTopOrBottomCellMargin({})).toBe(0);
    });
    it('Get laine spacing validation', () => {
        expect(layout.getLineSpacing({})).toBe(0);
    });
    it('Layout body widget collection', () => {
        expect(() => { layout.layoutBodyWidgetCollection(); }).not.toThrowError();
    });
});