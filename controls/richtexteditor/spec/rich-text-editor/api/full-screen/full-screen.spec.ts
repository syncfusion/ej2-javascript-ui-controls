/**
 * Full screen spec
 */
import { createElement, detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import { RichTextEditor} from './../../../../src/index';
import { renderRTE, destroy } from './../../render.spec';

describe(' showFullScreen method  - ', () => {
    let rteObj: RichTextEditor;
    let onActionBegin: jasmine.Spy;
    let onActionComplete: jasmine.Spy;
    let controlId: string;
    beforeAll((done: Function) => {
        onActionBegin = jasmine.createSpy('onBegin');
        onActionComplete = jasmine.createSpy('OnComplete');
        rteObj = renderRTE({
            value: '<span id="rte">RTE</span>',
            actionComplete: onActionComplete,
            actionBegin: onActionBegin
        });
        controlId = rteObj.element.id;
        done();
    })
    afterAll((done: Function) => {
        destroy(rteObj);
        done();
    })
    it(' Test - trigger the actionBegin and actionComplete event', () => {
        rteObj.showFullScreen();
        expect(onActionBegin).toHaveBeenCalled();
        expect(onActionComplete).toHaveBeenCalled();
    });
    it(' Test - minimize element in full screen', () => {
        let minimizeEle: HTMLElement = rteObj.toolbarModule.baseToolbar.toolbarObj.element.querySelector('#' + controlId + "_toolbar_Minimize");
        expect(!isNullOrUndefined(minimizeEle)).toBe(true);
    });
});
    describe('EJ2-20672 - Full Screen not working properly when render inside the overflow element', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLTextAreaElement;
        let divElem: HTMLTextAreaElement;
        let innerData: string = `<textarea style = "overflow: auto; width: 100%; height: 200px;"> In RichTextEditor , you click the toolbar buttons to format the words and the changes are visible immediately.
        Markdown is not like that. When you format the word in Markdown format, you need to add Markdown syntax to the word to indicate which words 
        and phrases should look different from each other.
        RichTextEditor supports markdown editing when the editorMode set as **markdown** and using both *keyboard interaction* and *toolbar action*, you can apply the formatting to text.Q
        We can add our own custom formation syntax for the Markdown formation, [sample link](https://ej2.syncfusion.com/home/).
        The third-party library <b>Marked</b> is used in this sample to convert markdown into HTML content. </textarea>`
        beforeAll(() => {
            divElem = <HTMLTextAreaElement>createElement('div', { styles: 'overflow: auto; border: 1px solid;' });
            elem = <HTMLTextAreaElement>createElement('textarea', { id: 'rte_test_EJ2_20672', attrs: { name: 'formName' } });
            document.body.appendChild(divElem);
            divElem.appendChild(elem);
            rteObj = new RichTextEditor({
            });
            rteObj.appendTo(elem);
        });

        it('Full Screen Handler when render inside the overflow element', (done: DoneFn) => {
            rteObj.focusIn();
            (rteObj as any).inputElement.innerHTML = innerData;
            rteObj.showFullScreen();
            expect(divElem.classList.contains("e-rte-overflow")).toBe(true);
            expect(rteObj.element.classList.contains("e-rte-full-screen")).toBe(true);
            done();
        });

        afterAll(() => {
            destroy(rteObj);
            detach(divElem);
        });
    }); 
    describe('EJ2-41995 - RichTextEditor showFullscreen method call when read-only is enabled', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FullScreen']
                },
                readonly : true
            });
        });
        it('Checking Fullscreen view', (done) => {
            rteObj.showFullScreen();
            expect(rteObj.element.classList.contains("e-rte-full-screen")).toBe(true);
            done();
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });