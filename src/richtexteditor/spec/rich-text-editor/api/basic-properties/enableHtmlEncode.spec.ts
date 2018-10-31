import { Toolbar, HtmlEditor, RichTextEditor, Link, Image, QuickToolbar } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent, setCursorPoint } from './../../render.spec';
import { detach, isNullOrUndefined, } from '@syncfusion/ej2-base';

RichTextEditor.Inject(HtmlEditor);
RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(Link);
RichTextEditor.Inject(Image);
RichTextEditor.Inject(QuickToolbar);

describe('RTE BASIC PROPERTIES - enableHtmlEncode - ', () => {

    describe(' Default value  - ', () => {
        let rteObj: RichTextEditor;
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the default value ', () => {
            rteObj = renderRTE({
            });
            expect(rteObj.enableHtmlEncode).toBe(false);
        });
    })
    describe(' PUBLIC METHODS - ', () => {
        describe(' refresh  - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            })
            it(' Test the value maintain with encoded after refreshed the component ', () => {
                rteObj = renderRTE({
                    value: '<p id="encode">Encode</p>'
                });
                rteObj.enableHtmlEncode = true;
                rteObj.dataBind();
                rteObj.refresh();
                expect(rteObj.value === '&lt;p id="encode"&gt;Encode&lt;/p&gt;').toBe(true);
            });
        });
    });
    describe(' PROPERTIES - ', () => {
        describe(' Encoded value at initial render - ', () => {
            let rteObj: RichTextEditor;
            let controlID: string;
            beforeAll((done) => {
                rteObj = renderRTE({
                    enableHtmlEncode: true,
                    value: '&lt;p id="encode"&gt;Encode&lt;/p&gt;'
                });
                controlID = rteObj.element.id;
                done();
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            })
            it(' Test with value property  ', () => {
                let editNode: HTMLElement = (rteObj as any).inputElement;
                let node: Element = editNode.querySelector("#encode");
                expect(!isNullOrUndefined(node)).toBe(true);
            });

            it(' Test with valueTemplate property  ', () => {
                let editNode: HTMLElement = (rteObj as any).inputElement;
                let node: Element = editNode.querySelector("#encode");
                expect(!isNullOrUndefined(node)).toBe(true);
            });

            it(' Test with getHtml public method ', () => {
                expect(rteObj.getHtml() === '&lt;p id="encode"&gt;Encode&lt;/p&gt;').toBe(true);
            });
            it(' Test with getText public method ', () => {
                expect(rteObj.getText() === 'Encode').toBe(true);
            });

            it(' Test sourceCode textarea value ', () => {
                let sourceBtn: HTMLElement = rteObj.element.querySelector("#" + controlID + '_toolbar_SourceCode');
                sourceBtn.click();
                let sourceCode: HTMLTextAreaElement = rteObj.element.querySelector('.e-rte-srctextarea');
                expect(sourceCode.value === '&lt;p id="encode"&gt;Encode&lt;/p&gt;').toBe(true);
            });
        });

        describe(' Without Encoded value at initial render - ', () => {
            let rteObj: RichTextEditor;
            let controlID: string;
            beforeAll((done) => {
                rteObj = renderRTE({
                    enableHtmlEncode: true,
                    value: '<p id="encode">Encode</p>'
                });
                controlID = rteObj.element.id;
                done();
            });

            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            })

            it(' Test with value property  ', () => {
                let editNode: HTMLElement = (rteObj as any).inputElement;
                let node: Element = editNode.querySelector("#encode");
                expect(!isNullOrUndefined(node)).toBe(true);
                expect(rteObj.value === '&lt;p id="encode"&gt;Encode&lt;/p&gt;').toBe(true);
            });

            it(' Test with valueTemplate property  ', () => {
                let editNode: HTMLElement = (rteObj as any).inputElement;
                let node: Element = editNode.querySelector("#encode");
                expect(!isNullOrUndefined(node)).toBe(true);
            });

            it(' Test with getHtml public method ', () => {
                expect(rteObj.getHtml() === '&lt;p id="encode"&gt;Encode&lt;/p&gt;').toBe(true);
            });

            it(' Test with getText public method ', () => {
                expect(rteObj.getText() === 'Encode').toBe(true);
            });

            it(' Test sourceCode textarea value ', () => {
                let sourceBtn: HTMLElement = rteObj.element.querySelector("#" + controlID + '_toolbar_SourceCode');
                sourceBtn.click();
                let sourceCode: HTMLTextAreaElement = rteObj.element.querySelector('.e-rte-srctextarea');
                expect(sourceCode.value === '&lt;p id="encode"&gt;Encode&lt;/p&gt;').toBe(true);
            });
        });
    });
    describe(' onPropertyChange  - ', () => {
        let rteObj: RichTextEditor;
        let controlID: string;
        beforeAll((done) => {
            rteObj = renderRTE({
                value: '<p id="encode">Encode</p>'
            });
            controlID = rteObj.element.id;
            rteObj.enableHtmlEncode = true;
            rteObj.dataBind();
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        })

        it(' Test with value property ', () => {
            expect(rteObj.value === '&lt;p id="encode"&gt;Encode&lt;/p&gt;').toBe(true);
        });

        it(' Test with getHtml public method ', () => {
            expect(rteObj.getHtml() === '&lt;p id="encode"&gt;Encode&lt;/p&gt;').toBe(true);
        });

        it(' Test with getText public method ', () => {
            expect(rteObj.getText() === 'Encode').toBe(true);
        });

        it(' Test sourceCode textarea value ', () => {
            let sourceBtn: HTMLElement = rteObj.element.querySelector("#" + controlID + '_toolbar_SourceCode');
            sourceBtn.click();
            let sourceCode: HTMLTextAreaElement = rteObj.element.querySelector('.e-rte-srctextarea');
            expect(sourceCode.value === '&lt;p id="encode"&gt;Encode&lt;/p&gt;').toBe(true);
        });
    })

});