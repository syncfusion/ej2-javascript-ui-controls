/**
 * Sanitize HTML helper renderer spec
 */
import { detach } from '@syncfusion/ej2-base';
import { RichTextEditor } from "../../../src/rich-text-editor/index";
import { BeforeSanitizeHtmlArgs } from "../../../src/common/interface";
import { CLS_RTE_PASTE_KEEP_FORMAT, CLS_RTE_PASTE_OK } from "../../../src/rich-text-editor/base/classes";
import { renderRTE, destroy, setCursorPoint } from './../render.spec';

describe('Sanitize Html Helper', () => {
    let innerHTML: string = `<div>
    <div id="inline-event" onmouseover='javascript:alert(1)'>div element</div>
    <script>alert('hi')</script>
    <img src="javascript:alert('XSS Image');"/>
    <iframe src="http://evil.com/xss.html"></iframe>
    <input type="image" src="javascript:alert('XSS Image');"/>
    <link rel="stylesheet" href="javascript:alert('XSS CSS');"/>
    <div id="background" style="background-image: url(javascript:alert('XSS Background'))">BackGround Image</div>
    <div id="expression" style="width: expression(alert('XSS'));">Expression</div>
    <object type="text/x-scriptlet" data="http://hacker.com/xss.html">
    </object>
    </div>
    `;
    let encodeValue: string = `"&lt;div&gt;<br>    &lt;div id="inline-event" onmouseover='javascript:alert(1)'&gt;&lt;/div&gt;<br>    &lt;script&gt;alert('hi')&lt;/script&gt;<br>    &lt;img src="javascript:alert('XSS Image');"/&gt;<br>    &lt;iframe src="http://evil.com/xss.html"&gt;&lt;/iframe&gt;<br>    &lt;input type="image" src="javascript:alert('XSS Image');"/&gt;<br>    &lt;link rel="stylesheet" href="javascript:alert('XSS CSS');"/&gt;<br>    &lt;div id="background" style="background-image: url(javascript:alert('XSS Background'))"&gt;BackGround Image&lt;/div&gt;<br>    &lt;div id="expression" style="width: expression(alert('XSS'));"&gt;Expression&lt;/div&gt;<br>    &lt;object type="text/x-scriptlet" data="http://hacker.com/xss.html"&gt;<br>    &lt;/object&gt;<br>    &lt;/div&gt;"`;
    describe('xss attack while component initial rendering : ', () => {
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
                value: innerHTML
            });
        });

        it('check the script element', () => {
            expect(rteObj.inputElement.querySelectorAll('script').length).toBe(0);
        });
        it('check the iframe element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('iframe').length).toBe(0);
        });
        it('check the image element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('img').length).toBe(0);
        });
        it('check the link element while href set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('link').length).toBe(0);
        });
        it('check the object element while attribute set as type="text/x-scriptlet"', () => {
            expect(rteObj.inputElement.querySelectorAll('object').length).toBe(0);
        });
        it('check the input element while set the type="image" and srce as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('input').length).toBe(0);
        });

        it('check the div element attribute while background image style set as wrong', () => {
            expect(rteObj.inputElement.querySelector('#background').hasAttribute('style')).toBe(false);
            expect(rteObj.inputElement.querySelector('#expression').hasAttribute('style')).toBe(false);
        });

        it('check the div element attribute while inline event bind', () => {
            expect(rteObj.inputElement.querySelector('#inline-event').hasAttribute('onmouseover')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('xss attack while dynamic set the value property : ', () => {
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
            });
            rteObj.value = innerHTML;
            rteObj.dataBind();
        });

        it('check the script element', () => {
            expect(rteObj.inputElement.querySelectorAll('script').length).toBe(0);
        });
        it('check the iframe element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('iframe').length).toBe(0);
        });
        it('check the image element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('img').length).toBe(0);
        });
        it('check the link element while href set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('link').length).toBe(0);
        });
        it('check the object element while attribute set as type="text/x-scriptlet"', () => {
            expect(rteObj.inputElement.querySelectorAll('object').length).toBe(0);
        });
        it('check the input element while set the type="image" and srce as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('input').length).toBe(0);
        });

        it('check the div element attribute while background image style set as wrong', () => {
            expect(rteObj.inputElement.querySelector('#background').hasAttribute('style')).toBe(false);
            expect(rteObj.inputElement.querySelector('#expression').hasAttribute('style')).toBe(false);
        });

        it('check the div element attribute while inline event bind', () => {
            expect(rteObj.inputElement.querySelector('#inline-event').hasAttribute('onmouseover')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('xss attack while component initial rendering with enableHtmlEncode: ', () => {
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
                value: encodeValue,
                enableHtmlEncode: true
            });
        });

        it('check the script element', () => {
            expect(rteObj.inputElement.querySelectorAll('script').length).toBe(0);
        });
        it('check the iframe element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('iframe').length).toBe(0);
        });
        it('check the image element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('img').length).toBe(0);
        });
        it('check the link element while href set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('link').length).toBe(0);
        });
        it('check the object element while attribute set as type="text/x-scriptlet"', () => {
            expect(rteObj.inputElement.querySelectorAll('object').length).toBe(0);
        });
        it('check the input element while set the type="image" and srce as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('input').length).toBe(0);
        });

        it('check the div element attribute while background image style set as wrong', () => {
            expect(rteObj.inputElement.querySelector('#background').hasAttribute('style')).toBe(false);
            expect(rteObj.inputElement.querySelector('#expression').hasAttribute('style')).toBe(false);
        });

        it('check the div element attribute while inline event bind', () => {
            expect(rteObj.inputElement.querySelector('#inline-event').hasAttribute('onmouseover')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('xss attack while dynamic set the value property with enableHtmlEncode : ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                enableHtmlEncode: true
            });
            rteObj.value = encodeValue;
            rteObj.dataBind();
        });

        it('check the script element', () => {
            expect(rteObj.inputElement.querySelectorAll('script').length).toBe(0);
        });
        it('check the iframe element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('iframe').length).toBe(0);
        });
        it('check the image element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('img').length).toBe(0);
        });
        it('check the link element while href set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('link').length).toBe(0);
        });
        it('check the object element while attribute set as type="text/x-scriptlet"', () => {
            expect(rteObj.inputElement.querySelectorAll('object').length).toBe(0);
        });
        it('check the input element while set the type="image" and srce as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('input').length).toBe(0);
        });

        it('check the div element attribute while background image style set as wrong', () => {
            expect(rteObj.inputElement.querySelector('#background').hasAttribute('style')).toBe(false);
            expect(rteObj.inputElement.querySelector('#expression').hasAttribute('style')).toBe(false);
        });

        it('check the div element attribute while inline event bind', () => {
            expect(rteObj.inputElement.querySelector('#inline-event').hasAttribute('onmouseover')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('xss attack while source code to preview : ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode']
                }
            });
            let trgEle: HTMLElement = <HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0];
            (trgEle.firstElementChild as HTMLElement).click();
            let textArea: HTMLTextAreaElement = rteObj.element.querySelector('.e-rte-srctextarea');
            textArea.value = innerHTML;
            trgEle = <HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0];
            (trgEle.firstElementChild as HTMLElement).click();
        });

        it('check the script element', () => {
            expect(rteObj.inputElement.querySelectorAll('script').length).toBe(0);
        });
        it('check the iframe element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('iframe').length).toBe(0);
        });
        it('check the image element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('img').length).toBe(0);
        });
        it('check the link element while href set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('link').length).toBe(0);
        });
        it('check the object element while attribute set as type="text/x-scriptlet"', () => {
            expect(rteObj.inputElement.querySelectorAll('object').length).toBe(0);
        });
        it('check the input element while set the type="image" and srce as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('input').length).toBe(0);
        });

        it('check the div element attribute while background image style set as wrong', () => {
            expect(rteObj.inputElement.querySelector('#background').hasAttribute('style')).toBe(false);
            expect(rteObj.inputElement.querySelector('#expression').hasAttribute('style')).toBe(false);
        });

        it('check the div element attribute while inline event bind', () => {
            expect(rteObj.inputElement.querySelector('#inline-event').hasAttribute('onmouseover')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('xss attack while executeCommand insertHTML : ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
            });
            rteObj.focusIn();
            rteObj.executeCommand('insertHTML', innerHTML);
        });

        it('check the script element', () => {
            expect(rteObj.inputElement.querySelectorAll('script').length).toBe(0);
        });
        it('check the iframe element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('iframe').length).toBe(0);
        });
        it('check the image element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('img').length).toBe(0);
        });
        it('check the link element while href set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('link').length).toBe(0);
        });
        it('check the object element while attribute set as type="text/x-scriptlet"', () => {
            expect(rteObj.inputElement.querySelectorAll('object').length).toBe(0);
        });
        it('check the input element while set the type="image" and srce as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('input').length).toBe(0);
        });

        it('check the div element attribute while background image style set as wrong', () => {
            expect(rteObj.inputElement.querySelector('#background').hasAttribute('style')).toBe(false);
            expect(rteObj.inputElement.querySelector('#expression').hasAttribute('style')).toBe(false);
        });

        it('check the div element attribute while inline event bind', () => {
            expect(rteObj.inputElement.querySelector('#inline-event').hasAttribute('onmouseover')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('prevent the xss attack in sanitizeHtml method : ', () => {
        let rteObj: RichTextEditor;
        let value: string;
        beforeAll(() => {
            rteObj = renderRTE({
            });
            value = rteObj.sanitizeHtml(innerHTML);
            rteObj.inputElement.innerHTML = value;
        });

        it('check the script element', () => {
            expect(rteObj.inputElement.querySelectorAll('script').length).toBe(0);
        });
        it('check the iframe element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('iframe').length).toBe(0);
        });
        it('check the image element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('img').length).toBe(0);
        });
        it('check the link element while href set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('link').length).toBe(0);
        });
        it('check the object element while attribute set as type="text/x-scriptlet"', () => {
            expect(rteObj.inputElement.querySelectorAll('object').length).toBe(0);
        });
        it('check the input element while set the type="image" and srce as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('input').length).toBe(0);
        });

        it('check the div element attribute while background image style set as wrong', () => {
            expect(rteObj.inputElement.querySelector('#background').hasAttribute('style')).toBe(false);
            expect(rteObj.inputElement.querySelector('#expression').hasAttribute('style')).toBe(false);
        });

        it('check the div element attribute while inline event bind', () => {
            expect(rteObj.inputElement.querySelector('#inline-event').hasAttribute('onmouseover')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('xss attack while executeCommand createLink : ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
            });
            rteObj.focusIn();
            let range = rteObj.formatter.editorManager.nodeSelection.getRange(document);
            let selection = rteObj.formatter.editorManager.nodeSelection.save(range, document);
            rteObj.executeCommand('createLink', {
                selection: selection,
                selectParent: [],
                url: 'javascript:alert("XSS")',
                text: "Google"
            })
        });

        it('check the anchor tag href', () => {
            expect((rteObj.inputElement.querySelector('a') as HTMLElement).getAttribute('href') === '').toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('xss attack while executeCommand image : ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
            });
            rteObj.focusIn();
            let range = rteObj.formatter.editorManager.nodeSelection.getRange(document);
            let selection = rteObj.formatter.editorManager.nodeSelection.save(range, document);
            rteObj.executeCommand('insertImage', {
                selection: selection,
                selectParent: null,
                url: 'javascript:alert("XSS")'
            })
        });

        it('check the image tag src', () => {
            expect((rteObj.inputElement.querySelector('img') as HTMLElement).getAttribute('src') === '').toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('prevent xss attack via helper : ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<script>alert(1)</script>',
                beforeSanitizeHtml: (args: BeforeSanitizeHtmlArgs) => {
                    args.helper = (value: string) => {
                        args.cancel = true;
                        let temp: HTMLElement = document.createElement('div');
                        temp.innerHTML = value;
                        detach(temp.querySelector('script'));
                        return temp.innerHTML;
                    }
                }
            });
        });

        it('check the script element', () => {
            expect((rteObj.inputElement.querySelectorAll('script')).length).toBe(0);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('prevent xss attack by add the selectors : ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<style>bod{width:100px;}</style>',
                beforeSanitizeHtml: (args: BeforeSanitizeHtmlArgs) => {
                    args.selectors.tags.push('style');
                }
            });
        });

        it('check the style element', () => {
            expect((rteObj.inputElement.querySelectorAll('script')).length).toBe(0);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });


    describe("prevent xss attack", () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = {
          preventDefault: () => { },
          type: "keydown",
          stopPropagation: () => { },
          ctrlKey: false,
          shiftKey: false,
          action: null,
          which: 64,
          key: ""
        };
        let defaultString: string = `
        <div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
        <div>
        <div id="inline-event" onmouseover='javascript:alert(1)'>div element</div>
        <script>alert('hi')</script>
        <img src="javascript:alert('XSS Image');"/>
        <iframe src="http://evil.com/xss.html"></iframe>
        <input type="image" src="javascript:alert('XSS Image');"/>
        <link rel="stylesheet" href="javascript:alert('XSS CSS');"/>
        <div id="background" style="background-image: url(javascript:alert('XSS Background'))">BackGround Image</div>
        <div id="expression" style="width: expression(alert('XSS'));">Expression</div>
        <object type="text/x-scriptlet" data="http://hacker.com/xss.html">
        </object>
        </div>
         </div>
         `;

        beforeAll((done: Function) => {
          rteObj = renderRTE({
            pasteCleanupSettings: {
              prompt: true
            },
            beforeDialogOpen: beforeDialogOpen
          });
          function beforeDialogOpen(args: any): void { }
          done();
        });
        it("prevent xss attack when pasting", (done) => {
          keyBoardEvent.clipboardData = {
            getData: () => {
              return defaultString;
            },
            items: []
          };
          setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
          rteObj.onPaste(keyBoardEvent);
          setTimeout(() => {
            if (rteObj.pasteCleanupSettings.prompt) {
              let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
              keepFormat[0].click();
              let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
              pasteOK[0].click();
            }
            expect(rteObj.inputElement.querySelectorAll('script').length).toBe(0);
            expect(rteObj.inputElement.querySelectorAll('iframe').length).toBe(0);
            expect(rteObj.inputElement.querySelectorAll('img').length).toBe(0);
            expect(rteObj.inputElement.querySelectorAll('link').length).toBe(0);
            expect(rteObj.inputElement.querySelectorAll('object').length).toBe(0);
            expect(rteObj.inputElement.querySelectorAll('input').length).toBe(0);
            expect(rteObj.inputElement.querySelector('#background').hasAttribute('style')).toBe(false);
            expect(rteObj.inputElement.querySelector('#expression').hasAttribute('style')).toBe(true);
            expect(rteObj.inputElement.querySelector('#inline-event').hasAttribute('onmouseover')).toBe(false);
            done();
          }, 50);
        });

        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
    });
    describe('prevent xss attack when enableHtmlSanitizer is true', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<script>alert("1")</script>',
                beforeSanitizeHtml: (args: BeforeSanitizeHtmlArgs) => {
                    args.cancel = true;
                    args.helper = (value: string) => {
                       return value;
                    }
                }
            });
        });

        it('check the script element', () => {
            expect((rteObj.inputElement.querySelectorAll('script')).length).toBeGreaterThan(0);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('prevent xss attack when enableHtmlSanitizer is fasle', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<script>alert("1")</script>',
                enableHtmlSanitizer: false
             });
        });

        it('check the script element', () => {
            expect((rteObj.inputElement.querySelectorAll('script')).length).toBeGreaterThan(0);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('prevent xss when args.cancel is false', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<script>alert("1")</script>',
                enableHtmlSanitizer: true,
                beforeSanitizeHtml: (args: BeforeSanitizeHtmlArgs) => {
                    args.cancel = false;
                    args.helper = null;
                }
            });
        });

        it('check the script element', () => {
            expect((rteObj.inputElement.querySelectorAll('script')).length).toBe(0);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('prevent xss when args.cancel is true', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<script>alert("1")</script>',
                enableHtmlSanitizer: true,
                beforeSanitizeHtml: (args: BeforeSanitizeHtmlArgs) => {
                    args.cancel = true;
                    args.helper = null;
                }
            });
        });

        it('check the script with args.helper null', () => {
            expect((rteObj.inputElement.querySelectorAll('script')).length).toBeGreaterThan(0);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('enableHtmlSanitizer is set to false when insertHTML is used in execueCommand', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>syncfusion RTE</p>',
                enableHtmlSanitizer: false,
            });
        });

        it('check the script with args.helper null', () => {
            rteObj.executeCommand('insertHTML', "<div style='position: relative;width: 100%;height: 0;padding-bottom: 50%;'><iframe frameborder='0' scrolling='no' marginheight='0' marginwidth='0' style='position: absolute;top: 0;left: 0;width: 100%;height: 100%;' frameborder='0' type='text/html' src='https://www.youtube.com/embed/tgbNymZ7vqY?fs=1'></iframe></div>");
            expect(rteObj.inputElement.innerHTML === '<div style="position: relative;width: 100%;height: 0;padding-bottom: 50%;"><iframe frameborder="0" scrolling="no" marginheight="0" marginwidth="0" style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" type="text/html" src="https://www.youtube.com/embed/tgbNymZ7vqY?fs=1"></iframe></div><p>syncfusion RTE</p>').toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
});