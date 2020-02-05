/**
 * value spec
 */
import { RichTextEditor } from './../../../../src/index';
import { renderRTE, destroy } from './../../render.spec';

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
                rteObj = renderRTE({ });
                rteObj.valueTemplate = '<p>RichTextEditor</p>';
                rteObj.dataBind();
                expect(rteObj.value === '<p>RichTextEditor</p>').toBe(true);
                let editNode: HTMLElement = (rteObj as any).inputElement;
                let textArea: HTMLTextAreaElement = (rteObj as any).valueContainer;
                expect(editNode.innerHTML === '<p>RichTextEditor</p>').toBe(true);
                expect(textArea.value === '<p>RichTextEditor</p>').toBe(true);
            });
        });

        describe(' Plain text in value API with onproperty testing - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' plaintext ', () => {
                rteObj = renderRTE({
                    value: 'Test'
                });
                expect(rteObj.value === '<p>Test</p>').toBe(true);
                rteObj.value = 'Testing';
                rteObj.dataBind();
                expect(rteObj.value === '<p>Testing</p>').toBe(true);
                rteObj.value = '<p>Test</p>';
                rteObj.dataBind();
                expect(rteObj.value === '<p>Test</p>').toBe(true);
                rteObj.value = 'Testing';
                rteObj.dataBind();
                expect(rteObj.value === '<p>Testing</p>').toBe(true);
            });

            it(' enableHtmlEncode as true with plaintext ', () => {
                rteObj = renderRTE({
                    value: 'Test',
                    enableHtmlEncode: true
                });
                expect(rteObj.value === '&lt;p&gt;Test&lt;/p&gt;').toBe(true);
                rteObj.value = 'Testing';
                rteObj.dataBind();
                expect(rteObj.value === '&lt;p&gt;Testing&lt;/p&gt;').toBe(true);
                rteObj.value = '<p>Test</p>';
                rteObj.dataBind();
                expect(rteObj.value === '&lt;p&gt;Test&lt;/p&gt;').toBe(true);
                rteObj.value = 'Testing';
                rteObj.dataBind();
                expect(rteObj.value === '&lt;p&gt;Testing&lt;/p&gt;').toBe(true);
            });
        });
    });
});