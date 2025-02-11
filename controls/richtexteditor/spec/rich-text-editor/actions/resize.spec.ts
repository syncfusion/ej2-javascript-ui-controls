/**
 * Resize spec
 */
import { Browser } from "@syncfusion/ej2-base";
import { CLS_RTE_RES_HANDLE } from "../../../src/rich-text-editor/base/classes";
import { renderRTE, destroy } from "./../render.spec";
import { RichTextEditor } from "../../../src/rich-text-editor/index";
import { BASIC_MOUSE_EVENT_INIT } from "../../constant.spec";

describe("Resize - Actions Module", () => {

    describe("Rendering Resizable RTE with Div element", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let clickEvent: any;
        let resizeStartSpy: jasmine.Spy = jasmine.createSpy('onresizeStart');
        let resizingSpy: jasmine.Spy = jasmine.createSpy('onresizing');
        let resizeStopSpy: jasmine.Spy = jasmine.createSpy('onresizeStop');

        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                enableResize: true,
                enableRtl: true,
                resizeStart: resizeStartSpy,
                resizing: resizingSpy,
                resizeStop: resizeStopSpy
            });
            rteEle = rteObj.element;
            done();
        });

        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });

        it("Element availability testing", () => {
            expect(rteEle.querySelector('.' + CLS_RTE_RES_HANDLE) != null).toBe(true);
        });

        it('resize start', (done) => {
            let trg = (rteEle.querySelector('.' + CLS_RTE_RES_HANDLE) as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.resizeModule as any).resizeStart(clickEvent);
            setTimeout(() => {
                expect(resizeStartSpy).toHaveBeenCalled();
                done();
            }, 400);
        });

        it('resizing - mousemove', (done) => {
            let trg = (rteObj.element.querySelector('.' + CLS_RTE_RES_HANDLE) as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.resizeModule as any).resizeStart(clickEvent);
            setTimeout(() => {
                clickEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent("mousemove", false, true);
                trg.dispatchEvent(clickEvent);
                (rteObj.resizeModule as any).performResize(clickEvent);
                setTimeout(() => {
                    expect(resizingSpy).toHaveBeenCalled();
                    done();
                }, 400);
            }, 400);
        });

        it('resize end', (done) => {
            let trg = (rteEle.querySelector('.' + CLS_RTE_RES_HANDLE) as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.resizeModule as any).resizeStart(clickEvent);
            setTimeout(() => {
                clickEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent("mouseup", false, true);
                trg.dispatchEvent(clickEvent);
                (rteObj.resizeModule as any).stopResize(clickEvent);
                setTimeout(() => {
                    expect(resizeStopSpy).toHaveBeenCalled();
                    done();
                }, 400);
            }, 400);
        });
    });


    describe("Rendering Resizable RTE with Iframe element", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let clickEvent: any;
        function callbackfunction(args: any){
            args.cancel = true;
        }
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                enableResize: true,
                iframeSettings: {
                    enable: true
                },
                resizeStart: callbackfunction,
                resizing: callbackfunction
            });
            rteEle = rteObj.element;
            done();
        });

        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });

        it("Element availability testing", () => {
            expect(rteEle.querySelector('.' + CLS_RTE_RES_HANDLE) != null).toBe(true);
        });

        it('resize event - cancel', (done) => {
            let trg = (rteEle.querySelector('.' + CLS_RTE_RES_HANDLE) as HTMLElement);
            clickEvent = document.createEvent("UIEvent");
            clickEvent.initUIEvent("touchstart", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.resizeModule as any).resizeStart(clickEvent);
            setTimeout(() => {
                clickEvent = document.createEvent("UIEvent");
                clickEvent.initUIEvent("touchmove", false, true);
                clickEvent.pointerType = 'touch';
                clickEvent.touches = [{
                    pageX: 100,
                    pageY: 100,
                }]
                trg.dispatchEvent(clickEvent);
                (rteObj.resizeModule as any).performResize(clickEvent);
                done();
            }, 400);
        });
    });

    describe('Resize for blazor and IE coverage', () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let clickEvent: any;
        let browseinfo: any;

        beforeAll((done: Function) => {
            browseinfo = Browser.info.name;
            Browser.info.name = 'msie';
            (window as any).sfBlazor={ renderComplete:()=> {return true;}};
            (window as any).Blazor = null;
            rteObj = renderRTE({
                enableResize: true
            });
            rteEle = rteObj.element;
            done();
        });

        afterAll((done: Function) => {
            Browser.info.name = browseinfo;
            delete (window as any).Blazor;
            delete (window as any).sfBlazor;
            destroy(rteObj);
            done();
        });

        it('resize event - mouse', (done) => {
            let trg = (rteEle.querySelector('.' + CLS_RTE_RES_HANDLE) as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.resizeModule as any).resizeStart(clickEvent);
            setTimeout(() => {
                clickEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent("mousemove", false, true);
                trg.dispatchEvent(clickEvent);
                (rteObj.resizeModule as any).performResize(clickEvent);
                setTimeout(() => {
                    clickEvent = document.createEvent("MouseEvents");
                    clickEvent.initEvent("mouseup", false, true);
                    trg.dispatchEvent(clickEvent);
                    (rteObj.resizeModule as any).stopResize(clickEvent);
                    expect(Object.keys(window).indexOf('Blazor') >= 0).toBe(true);
                    done();
                }, 400);
            }, 400);
        });

        it('resize event - touch', (done) => {
            let trg = (rteEle.querySelector('.' + CLS_RTE_RES_HANDLE) as HTMLElement);
            clickEvent = document.createEvent("UIEvent");
            clickEvent.initUIEvent("touchstart", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.resizeModule as any).resizeStart(clickEvent);
            setTimeout(() => {
                clickEvent = document.createEvent("UIEvent");
                clickEvent.initUIEvent("touchmove", false, true);
                clickEvent.pointerType = 'touch';
                clickEvent.touches = [{
                    pageX: 100,
                    pageY: 100,
                }]
                trg.dispatchEvent(clickEvent);
                (rteObj.resizeModule as any).performResize(clickEvent);
                done();
            }, 400);
        });
    });

    describe('EJ2-49434 - Resize icon on RTL mode', () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                enableRtl:true,
                enableResize:true
            });
            rteEle = rteObj.element;
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });

        it("class availability testing", () => {
            let trg = (rteEle.querySelector('.' + CLS_RTE_RES_HANDLE) as HTMLElement);
            expect(trg.classList.contains('e-south-west')).toBe(true);
        });
    });

    describe("915419 - Resize is not working properly in code view when there are more contents.", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let clickEvent: any;
        let resizeStartSpy: jasmine.Spy = jasmine.createSpy('onresizeStart');
        let resizingSpy: jasmine.Spy = jasmine.createSpy('onresizing');
        let resizeStopSpy: jasmine.Spy = jasmine.createSpy('onresizeStop');

        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode', 'CreateTable']
                },
                enableResize: true,
                enableRtl: true,
                resizeStart: resizeStartSpy,
                resizing: resizingSpy,
                resizeStop: resizeStopSpy
            });
            rteEle = rteObj.element;
            done();
        });

        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });

        it('Resize is not working properly in code view when there are more contents.', (done) => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Code View (Ctrl+Shift+H)");
            rteObj.contentModule.getEditPanel().innerHTML = '<p>data</p>';
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea')).not.toBe(null);
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea').value === '<p>data</p>').toBe(true);
            let trg = (rteObj.element.querySelector('.' + CLS_RTE_RES_HANDLE) as HTMLElement);
            clickEvent = new MouseEvent('mousemove', {
                clientX: rteObj.inputElement.getBoundingClientRect().left + 10,
                clientY: rteObj.inputElement.getBoundingClientRect().top + 10,
                bubbles: true,
                cancelable: true,
                detail: 1
            });
            trg.dispatchEvent(clickEvent);
            (rteObj.resizeModule as any).performResize(clickEvent);
            const rteHeight = document.getElementById(rteObj.getID()).style.height;
            const sourceViewHeight = document.getElementById(rteObj.getID() + "_source-view").style.height;
            expect(rteHeight === sourceViewHeight).toBe(true);
            done();
        });
    });

    describe('915389 - Iframe editor resize event not unbound after mouse up in the editor content.', () => {
        let editor: RichTextEditor;
        beforeAll((done: Function) => {
            editor = renderRTE({
                iframeSettings: {
                    enable: true
                },
                enableResize: true
            });
            done();
        });
        afterAll((done: Function) => {
            destroy(editor);
            done();
        });
        it('Should stop resize when mouse out over the iframe document', (done) => {
            const resizeElement: HTMLElement = editor.element.querySelector('.e-resize-handle');
            const mouseDown: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            resizeElement.dispatchEvent(mouseDown);
            const iframeDocument: Document = editor.inputElement.ownerDocument;
            const mousemove: MouseEvent = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
            resizeElement.dispatchEvent(mousemove);
            const moveInsideIframe: MouseEvent = new MouseEvent('mousemove', {
                clientX: editor.inputElement.getBoundingClientRect().left + 10,
                clientY: editor.inputElement.getBoundingClientRect().top + 10,
                view: iframeDocument.defaultView,
                bubbles: true,
                cancelable: true,
                detail: 1
            });
            resizeElement.dispatchEvent(moveInsideIframe);
            const mouseUp: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            iframeDocument.dispatchEvent(mouseUp);
            setTimeout(() => {
                expect((editor.resizeModule as any).isResizing).toBe(false);
                done();
            }, 100);
        });
    });
    describe('Bug 919439: Editor resize not completed when the mouse is out outside of chrome window.', () => {
        let editor: RichTextEditor;
        let externalIframe: HTMLIFrameElement;
        beforeAll(() => {
            editor = renderRTE({
                iframeSettings: {
                    enable: true
                },
                enableResize: true
            });
            externalIframe = document.createElement('iframe');
            externalIframe.width = '600';
            externalIframe.height = '400';
            externalIframe.style.backgroundColor = 'lightblue';
            document.body.appendChild(externalIframe);
        });
        afterAll(() => {
            destroy(editor);
            document.body.removeChild(externalIframe);
        });
        it('Should stop resize when mouse out over the iframe document', (done) => {
            const resizeElement: HTMLElement = editor.element.querySelector('.e-resize-handle');
            const mouseDown: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            resizeElement.dispatchEvent(mouseDown);
            const iframeDocument: Document = editor.inputElement.ownerDocument;
            const mousemove: MouseEvent = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
            resizeElement.dispatchEvent(mousemove);
            const moveInsideIframe: MouseEvent = new MouseEvent('mousemove', {
                clientX: editor.inputElement.getBoundingClientRect().left + 10,
                clientY: editor.inputElement.getBoundingClientRect().top + 10,
                view: iframeDocument.defaultView,
                bubbles: true,
                cancelable: true,
                detail: 1
            });
            resizeElement.dispatchEvent(moveInsideIframe);
            const mouseUp: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            externalIframe.dispatchEvent(mouseUp);
            setTimeout(() => {
                expect((editor.resizeModule as any).isResizing).toBe(false);
                (editor.resizeModule as any).iframeMouseUp(mouseUp);
                expect((editor.resizeModule as any).isResizing).toBe(false);
                done();
            }, 100);
        });
    });

    describe('934144: Console error is throwing when 2 iframes are rendered in Rich text editor', ()=> {
        let editor: RichTextEditor;
        let consoleSpy = jasmine.createSpy('console');
        const iframes: HTMLIFrameElement[] = [];
        beforeAll(()=>{
            const urls = [
                'https://example.com',
                'https://example.com',
                'https://example.com',
            ];
            for (let i = 0; i < urls.length; i++) {
                const iframe = document.createElement('iframe');
                iframe.className= "ej2-rte"
                iframe.src = urls[i];
                iframe.width = '100%';
                iframe.height = '600px';
                document.body.appendChild(iframe);
                iframes.push(iframe);
            }
            editor = renderRTE({
                enableResize: true
            });
        });
        afterAll(()=> {
            destroy(editor);
            for (let i:number = 0; i < iframes.length; i++) {
                const element = iframes[i];
                element.remove();
            }
        });
        it('Should not throw error when the contentDocument property of the iframe element is accessed.', (done: DoneFn) => {
            setTimeout(() => {
                expect(consoleSpy).not.toHaveBeenCalled();
                done();
            }, 1000);
        });
    });

    describe('934144: Console error is throwing when 2 iframes are rendered in Rich text editor', ()=> {
        let editor: RichTextEditor;
        let consoleSpy = jasmine.createSpy('console');
        const iframes: HTMLIFrameElement[] = [];
        beforeAll(()=>{
            const iframe = document.createElement('iframe');
            iframe.className= "ej2-rte"
            iframe.src = window.location.href;
            iframe.width = '100%';
            iframe.height = '600px';
            document.body.appendChild(iframe);
            iframes.push(iframe);
            editor = renderRTE({
                enableResize: true
            });
        });
        afterAll(()=> {
            destroy(editor);
            for (let i:number = 0; i < iframes.length; i++) {
                const element = iframes[i];
                element.remove();
            }
        });
        it('For coverage.', (done: DoneFn) => {
            setTimeout(() => {
                expect(consoleSpy).not.toHaveBeenCalled();
                (editor.resizeModule as any).destroy();
                done();
            }, 2000);
        });
    });
});