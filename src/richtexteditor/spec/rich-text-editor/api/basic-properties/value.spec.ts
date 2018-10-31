import { Toolbar, HtmlEditor, RichTextEditor, Count, Link, Image, QuickToolbar } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent } from './../../render.spec';

RichTextEditor.Inject(HtmlEditor);
RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(Link);
RichTextEditor.Inject(Count);
RichTextEditor.Inject(Image);
RichTextEditor.Inject(QuickToolbar);

describe('RTE BASIC PROPERTIES - value - ', () => {


    describe(' onPropertyChange - ', () => {

        describe(' showCharCount- ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            })

            it(' Test the count value ', () => {
                rteObj = renderRTE({
                    showCharCount: true,
                    maxLength: 50
                });
                rteObj.value = '<p>RichTextEditor</p>';
                rteObj.dataBind();
                let countEle: HTMLElement = rteObj.element.querySelector('.e-rte-character-count');
                expect(countEle.innerHTML === '14 / 50').toBe(true);
            });

            it(' Test the count value ', () => {
                rteObj = renderRTE({
                    showCharCount: true,
                    maxLength: 10
                });
                rteObj.value = '<p>RichTextEditor</p>';
                rteObj.dataBind();
                let countEle: HTMLElement = rteObj.element.querySelector('.e-rte-character-count');
                expect(countEle.innerHTML === '14 / 10').toBe(true);
                expect(countEle.classList.contains('e-error')).toBe(true);
            });
        });
        describe(' valueTemplate - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            })

            it(' Test the value property value and edit area ', () => {
                rteObj = renderRTE({

                });
                rteObj.valueTemplate = '<p>RichTextEditor</p>';
                rteObj.dataBind();
                expect(rteObj.value === '<p>RichTextEditor</p>').toBe(true);
                let editNode: HTMLElement = (rteObj as any).inputElement;
                let textArea: HTMLTextAreaElement = (rteObj as any).valueContainer;
                expect(editNode.innerHTML === '<p>RichTextEditor</p>').toBe(true);
                expect(textArea.value === '<p>RichTextEditor</p>').toBe(true);
            });
        });
    });
});