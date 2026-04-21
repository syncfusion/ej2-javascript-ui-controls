/**
 * Enter Key spec
 */
import { RichTextEditor} from './../../../../src/index';
import { renderRTE, destroy, setCursorPoint } from './../../render.spec';
import { NodeSelection } from './../../../../src/selection/index';
import { ENTERKEY_EVENT_INIT, SHFIT_ENTERKEY_EVENT_INIT, SPACE_EVENT_INIT } from '../../../constant.spec';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

let keyboardEventArgs = new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT);

let shiftkeyboarArgs = new KeyboardEvent('keydown', SHFIT_ENTERKEY_EVENT_INIT);

describe('Shift Enter Tests', () => {

    describe('When `BR` is configured', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px'
            });
        });

        it('Press shift enter when RTE content is empty', (done: DoneFn) => {
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, nodetext, nodetext, 0, 0);
            rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<p><br><br></p>');
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('905285 - List Creation Misplacement When Pressing 1. + Space in Rich Text Editor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px'
            });
        });

        it('List Creation Misplacement When Pressing 1. + Space in Rich Text Editor', (done: DoneFn) => {
            const nodetext: any = rteObj.inputElement.childNodes[0];
            new NodeSelection().setSelectionText(document, nodetext, nodetext, 0, 0);
            rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
            expect(rteObj.inputElement.innerHTML).toBe('<p><br><br></p>');
            rteObj.inputElement.innerHTML = '<p>Abc<br>1.</p>';
            let node: any = document.getElementsByTagName('p')[0];
            let targetTextNode: any = node.childNodes[2];
            new NodeSelection().setSelectionText(document, targetTextNode, targetTextNode, targetTextNode.length, targetTextNode.length);
            const spaceKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(spaceKeyDownEvent);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<p>Abc<br>1.</p>');
                done();
            }, 100);
        });

        it('console error raised while keydown enter key br and shift enter key p', (done: DoneFn) => {
            (<any>rteObj).enterKey = 'BR';
            (<any>rteObj).shiftEnterKey = 'P';
            rteObj.dataBind();
            rteObj.inputElement.innerHTML = '<p>Abc<br>1.</p>';
            setTimeout(() => {
                const nodetext: any = rteObj.inputElement.childNodes[0];
                new NodeSelection().setSelectionText(document, nodetext, nodetext, 0, 0);
                rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
                setTimeout(() => {
                    expect(rteObj.inputElement.innerHTML).toBe('<p><br></p><p>Abc<br>1.</p>');
                    done();
                }, 100);
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('919006 - Unordered list created while selecting the mentioned item from dropdown and after pressing - and space.', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px'
            });
        });

        it('Unordered list created while selecting the mentioned item from dropdown and after pressing - and space.', (done: DoneFn) => {
            const nodetext: any = rteObj.inputElement.childNodes[0];
            new NodeSelection().setSelectionText(document, nodetext, nodetext, 0, 0);
            rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
            expect(rteObj.inputElement.innerHTML).toBe('<p><br><br></p>');
            rteObj.inputElement.innerHTML = '<p><span contenteditable="false" class="e-mention-chip">Selma Rose</span>-</p>';
            let node: any = document.getElementsByTagName('p')[0];
            let targetTextNode: any = node.childNodes[1];
            new NodeSelection().setSelectionText(document, targetTextNode, targetTextNode, targetTextNode.length, targetTextNode.length);
            const spaceKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(spaceKeyDownEvent);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<p><span contenteditable="false" class="e-mention-chip">Selma Rose</span>-</p>');
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Shift Enter key support - When `P` is configured', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value: '<div>RTE Content</div>',
                shiftEnterKey: 'P'
            });
        });

        it('Press shift enter at the end of the div tag', (done: DoneFn) => {
            const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, nodetext.textContent.length);
            rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<div>RTE Content</div><p><br></p>');
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Shift Enter key support - When `DIV` is configured', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value: '<div>RTE Content</div>',
                shiftEnterKey: 'DIV'
            });
        });

        it('Press shift enter at the end of the div tag', (done: DoneFn) => {
            const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, nodetext.textContent.length);
            rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<div>RTE Content</div><div><br></div>');
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('940762: Unwanted spacing with Enter and Shift+Enter around bullet points and images', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: '<ul><li>Bullet point 1</li></ul><p><br><br><img src="https://example.com/image.png" alt="Sample Image"/>&#8203;<br></p>'
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Should not create unwanted spacing when pressing Enter and Shift+Enter', (done: Function) => {
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
            const imageNode = rteObj.inputElement.querySelector('img');
            new NodeSelection().setCursorPoint(document, imageNode.nextSibling as Element, 0);
            rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
            setTimeout(() => {
                const content = rteObj.inputElement.innerHTML;
                expect(content).toBe('<ul><li>Bullet point 1</li></ul><p><br><br><img src="https://example.com/image.png" alt="Sample Image" class="e-rte-image e-img-inline"><br>​<br></p>');
                done();
            }, 100);
        });
    });

    describe('969195 - Script error thrown when we press the Shift Enter key before the image in RichTextEditor', function () {
        let rteObj: RichTextEditor;
        beforeAll(function (done) {
            rteObj = renderRTE({
                value: "<div style='font-family: Arial; font-size: 10pt'> <span class='focusNode'><img alt='Sky with sun' src='https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png' width='309' style='min-width: 10px; min-height: 10px; width: 309px; height: 174px;' class='e-rte-image e-img-inline' height='174'> </span><br> </div>",
            });
            done();
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('Now the Rich Text Editor works properly when pressing the Shift + Enter key before an image without throwing a script error', () => {
            const nodetext: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setCursorPoint(document, nodetext, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
            rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
            expect(rteObj.inputElement.innerHTML).toBe('<div style="font-family: Arial; font-size: 10pt"><span class="focusNode"><br></span></div><div style="font-family: Arial; font-size: 10pt"><span class="focusNode"><br><br><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" width="309" style="min-width: 10px; min-height: 10px; width: 309px; height: 174px;" class="e-rte-image e-img-inline" height="174"> </span><br></div>');
        });
    });

    describe('972091 - Enter key action not working properly when pressing the shift enter key', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p class="focusNode">The Rich Text Editor content</p>`
            });
            done();
        });

        it('Rich Text Editor Enter key action works properly after pressing the Shift + Enter keys action', function (): void {
            rteObj.dataBind();
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode.childNodes[0], startNode.childNodes[0], 0, 0);
            rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
            rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
            rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            expect(rteObj.inputElement.innerHTML === '<p class="focusNode"><br></p><p class="focusNode"><br><br><br>The Rich Text Editor content</p>').toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('Shift Enter key support - When image is rendered', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value:  `<p><img alt="Logo" src="https://ej2.syncfusion.com/angular/demos/assets/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px;"></p>`
            });
        });

        it('Press shift enter when image is focused initially', (done: DoneFn) => {
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, nodetext, nodetext, 0, 0);
            (<any>rteObj).keyDown(shiftkeyboarArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<p><br><img alt="Logo" src="https://ej2.syncfusion.com/angular/demos/assets/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px;" class="e-rte-image e-img-inline"></p>');
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Shift Enter key support - When image is rendered', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value:  `<p><img alt="Logo" src="https://ej2.syncfusion.com/angular/demos/assets/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px;"></p>`
            });
        });
        it("Image is pasted in the editor and press shift enter when image is focused initially", (done) => {
            const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
            document, nodetext, nodetext.textContent.length);
            rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe(`<p><br><img alt="Logo" src="https://ej2.syncfusion.com/angular/demos/assets/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px;" class="e-rte-image e-img-inline"></p>`);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('890906 - Clicking shift and Enter after inserting link causes the page to collapse in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value: `<p><span><a class="e-rte-anchor" href="https://www.syncfusion.com/" title="https://www.syncfusion.com/" target="_blank" aria-label="Open in new window">https://www.syncfusion.com/ </a></span><br></p>`
            });
        });
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
        it("Press the Shift+Enter after the link", (done) => {
            const nodetext: any = rteObj.inputElement.querySelector("A");
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext.childNodes[0], nodetext.textContent.length);
            rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
            keyBoardEvent.clipboardData = {
                getData: () => { return `<span><a class="e-rte-anchor" id="anchorEle2" href="https://www.syncfusion.com/" title="https://www.syncfusion.com/" target="_blank" aria-label="Open in new window">https://www.syncfusion.com/ </a></span>`; },
                items: []
            };
            expect(nodetext.querySelector("BR")).toBe(null);
            (<any>rteObj).onPaste(keyBoardEvent);
            setTimeout(() => {
                const anchorText: any = rteObj.inputElement.querySelector("#anchorEle2");
                const sel2: void = new NodeSelection().setCursorPoint(
                    document, anchorText.childNodes[0], anchorText.textContent.length);
                rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
                expect(anchorText.querySelector("BR")).toBe(null);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Shift Enter and Backspace behavior', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value: '<p>Hello worl</p>'
            });
        });

   it('should handle Shift+Enter and Backspace correctly', (done) => {
        rteObj.focusIn();
        var paragraph = rteObj.inputElement.childNodes[0];
        paragraph.textContent += ' d This is appended text.';
        const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
        const specificPosition = 10;
        const sel: void = new NodeSelection().setCursorPoint(document, nodetext, specificPosition);
        rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
        setTimeout(() => {
            const brElm = paragraph.childNodes[1] as HTMLElement;
            paragraph.insertBefore(document.createTextNode(''), brElm.nextSibling);
            expect(rteObj.inputElement.innerHTML).toBe('<p>Hello worl<br>&nbsp;d This is appended text.</p>');
            done(); 
        }, 100);

        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Enter Key press multiple line when BR configured', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                enterKey: 'BR',
                value: `Line 1<br>Line 2<br>Line 3<br>Line 4<br>Line 5`
            });
        });

        it('EJ2-62201 - Enter Key press multiple line when start is at one line which is in middle and end is a whole line', (done: DoneFn) => {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.childNodes[4];
            const endNode: any = rteObj.inputElement.childNodes[6];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, endNode, 1, 6);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === `Line 1<br>Line 2<br>L<br><br>Line 5`).toBe(true);
                done();
            }, 100);
        });

        it('Enter Key testing in table when BR is configured and P content is inside', (done: DoneFn) => {
            rteObj.enterKey = 'BR';
            rteObj.value = '<p>RTE Content</p><p>RTE Content</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p class="focusNode">RTE Content</p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>';
            rteObj.inputElement.innerHTML = '<p>RTE Content</p><p>RTE Content</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p class="focusNode">RTE Content</p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setCursorPoint(
                document, startNode.childNodes[0], 11);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelector('.focusNode').nextElementSibling.tagName === 'BR').toBe(true);
                done();
            }, 100);
        });

        it(' Enter Key press just outside the table at the start when BR is configured', (done: DoneFn) => {
            rteObj.enterKey = 'BR';
            rteObj.value = `<table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>`;
            rteObj.inputElement.innerHTML = `<table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>`;
            rteObj.dataBind();
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.querySelector('.focusNode');
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML === `<br><table class="e-rte-table focusNode" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>`).toBe(true);
                done();
            }, 100);
        });
        it('Press shift enter when cursor is after the image', (done: DoneFn) => {
            rteObj.value = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
            rteObj.inputElement.innerHTML = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 1, 1);
            rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"><br><br></p>');
                done();
            }, 100);
        });
        it('Press shift enter when cursor is before the image', (done: DoneFn) => {
            rteObj.value = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
            rteObj.inputElement.innerHTML = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 0);
            rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<p><br><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>');
                done();
            }, 100);
        });
        it('Press shift enter when cursor is at the image', (done: DoneFn) => {
            rteObj.value = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
            rteObj.inputElement.innerHTML = '<p><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 1);
            rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<p><br><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></p>');
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-62200 Cursor position is wrong when pressing enter in the empty line when BR is configured as enter key.', () => {
        let rteObj: RichTextEditor;
        beforeEach( () => {
            rteObj = renderRTE( {
                height: '200px',
                enterKey: "BR",
                value: 'Text',
            } );
        } );
        afterEach(() => {
            destroy(rteObj);
        });
        it('Enter at start of Text', (done: DoneFn) => {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.childNodes[ 0 ];
            const sel: void = new NodeSelection().setCursorPoint(
                document, startNode, 0 );
            let cursorElem: HTMLElement;
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                cursorElem = document.querySelector( 'br' );
                expect( cursorElem.nextSibling.textContent === "Text" ).toBe( true );
                done();
            }, 100);
        });
        it('Enter at start of Empty node with Text as next', (done: DoneFn) => {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.childNodes[ 0 ];
            const sel: void = new NodeSelection().setCursorPoint(
                document, startNode, 0 );
            let cursorElem: HTMLElement;
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                cursorElem = rteObj.inputElement.childNodes[ 0 ] as HTMLElement;
                const sel2: void = new NodeSelection().setCursorPoint(
                    document, cursorElem, 0 );
                rteObj.inputElement.dispatchEvent(keyboardEventArgs);
                setTimeout(() => {
                    expect( cursorElem.previousElementSibling === null && cursorElem.textContent.length === 0 ).toBe( true );
                    done();
                }, 100);
            }, 100);
        });
    } );

    describe('916641: Shift+Enter before an audio element', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p><span class="e-audio-wrap" contenteditable="false" title="RTE-Audio.wav"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls="" style="outline: rgb(74, 144, 226) solid 2px;"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Audio.wav" type="audio/wav"></audio></span></span> </p>`
            });
        });
        it('should insert a <br> when Shift+Enter is pressed before an audio element', (done: DoneFn) => {
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, 0);
            rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
            setTimeout(() => {
                expect(window.getSelection().getRangeAt(0).startContainer.nodeName === 'SPAN').toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('924578 - A script error hinders the use of the Enter+Shift key combination to insert a new line after an image, leading to a disrupted user experience', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%" class="e-rte-image e-img-inline"><br></p>`
            });
        });
        it('When shift enter is pressed at the middle and then pressing enter at the start of the second line', (done: DoneFn) => {
            rteObj.dataBind();
            rteObj.focusIn();
            const startNode: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 1, 1);
            rteObj.inputElement.dispatchEvent(shiftkeyboarArgs);
            setTimeout(() => {
                //Need to confirm this case
                expect(rteObj.inputElement.innerHTML===`<p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%" class="e-rte-image e-img-inline"><br></p><p><br></p>`).toBe(true)
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('972091 - Enter key action not working properly when pressing the shift enter key', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                height: '200px',
                enterKey: 'P',
                value: `<p class="focusNode">The Rich Text Editor content</p>`
            });
        });
        it('Enter key action works properly after pressing the Shift + Enter keys action', (done: Function) => {
            editor.focusIn();
            const startNode: Element = editor.inputElement.querySelector('.focusNode');
            editor.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.childNodes[0], startNode.childNodes[0], 0, 0);
            editor.inputElement.dispatchEvent(shiftkeyboarArgs);
            editor.inputElement.dispatchEvent(shiftkeyboarArgs);
            editor.inputElement.dispatchEvent(shiftkeyboarArgs);
            editor.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                const expectedElem: string = '<p class="focusNode"><br></p><p class="focusNode"><br><br><br>The Rich Text Editor content</p>';
                expect(editor.inputElement.innerHTML === expectedElem).toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(editor);
        });
    });

    describe('969195 - Script error thrown when we press the Shift Enter key before the image in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: "<div style='font-family: Arial; font-size: 10pt'> <span class='focusNode'> <img alt='Sky with sun' src='https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png' width='309' style='min-width: 10px; min-height: 10px; width: 309px; height: 174px;' class='e-rte-image e-img-inline' height='174'> </span><br> </div>",
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Now the Rich Text Editor works properly when pressing the Shift + Enter key before an image without throwing a script error', (done: Function) => {
            const startNode: HTMLElement = rteObj.element.querySelector('.focusNode') as HTMLElement;
            setCursorPoint(startNode, 0);
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', keyboardEventArgs));
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', shiftkeyboarArgs));
            setTimeout(() => {
                const expectedElem: string = '<div style="font-family: Arial; font-size: 10pt"><span class="focusNode"><br></span></div><div style="font-family: Arial; font-size: 10pt"><br><span class="focusNode">&nbsp;<img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" width="309" style="min-width: 10px; min-height: 10px; width: 309px; height: 174px;" class="e-rte-image e-img-inline" height="174"> </span><br></div>';
                expect(rteObj.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });
    });

    describe('List revert with BR configured - ', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value: 'RTE BR configured',
                enterKey: 'BR',
                toolbarSettings: {
                    items: ['OrderedList', 'UnorderedList']
                }
            });
            rteEle = rteObj.element;
        });

        it('Default value when `BR` is configured with OL', (done:DoneFn)=> {
            rteObj.focusIn();
            const orderListEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
            orderListEle.click();
            orderListEle.click();
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('RTE BR configured<br>');
                done();
            }, 100);
        });

        it('Default value when `BR` is configured with UL', (done:DoneFn)=> {
            rteObj.focusIn();
            const unorderListEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[1];
            unorderListEle.click();
            unorderListEle.click();
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('RTE BR configured<br>');
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Enter key support - When `BR` is configured', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value: 'RTE Content',
                enterKey: 'BR'
            });
        });

        it('Press enter at the end of the line', (done: DoneFn) => {
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, nodetext.textContent.length);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('RTE Content<br><br>');
                done();
            }, 100);
        });

        it('EJ2-58543 - Press enter at the end of the line twice to check the text node removed properly', (done: DoneFn) => {
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, nodetext.textContent.length);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            rteObj.formatter.saveData();
            setTimeout(() => {
                expect(rteObj.inputElement.childNodes.length === 5).toBe(true);
                done();
            }, 100);
        });

        it('Press enter at the end of the line - Style Applied -', (done: DoneFn) => {
            rteObj.value = '<strong>​Line 1</strong>';
            rteObj.inputElement.innerHTML = '<strong>​Line 1</strong>';
            rteObj.dataBind();
            const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, nodetext.textContent.length);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1</strong><br><strong><br></strong>');
                done();
            }, 100);
        });

        it('Press enter by selecting whole line 1 - Style Applied -', (done: DoneFn) => {
            rteObj.value = '<strong>​Line 1</strong>';
            rteObj.inputElement.innerHTML = '<strong>​Line 1</strong>';
            rteObj.dataBind();
            const selectNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, selectNode, selectNode, 0, selectNode.length);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                //Need to Confirm this case
                expect(rteObj.inputElement.innerHTML).toBe('<strong><br>​</strong>');
                done();
            }, 100);
        });

        it('Press enter at the start of the line', (done: DoneFn) => {
            rteObj.value = 'RTE Content';
            rteObj.inputElement.innerHTML = 'RTE Content';
            rteObj.dataBind();
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<br>RTE Content');
                done();
            }, 100);
        });

        it('Press enter at the start of the line - Style Applied -', (done: DoneFn) => {
            rteObj.value = '<strong>​Line 1</strong>';
            rteObj.inputElement.innerHTML = '<strong>​Line 1</strong>';
            rteObj.dataBind();
            const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<br><strong>​Line 1</strong>');
                done();
            }, 100);
        });

        it('Press enter at the middle of the line', (done: DoneFn) => {
            rteObj.value = 'RTE Content';
            rteObj.inputElement.innerHTML = 'RTE Content';
            rteObj.dataBind();
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, 2);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('RT<br>E Content');
                done();
            }, 100);
        });

        it('Press enter at the middle of the line - Style Applied', (done: DoneFn) => {
            rteObj.value = '<strong>​Line 1</strong>';
            rteObj.inputElement.innerHTML = '<strong>​Line 1</strong>';
            rteObj.dataBind();
            const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, 3);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<strong>​Li</strong><br><strong>ne 1</strong>');
                done();
            }, 100);
        });

        it('Multiple lines - Press enter at the end of the first line', (done: DoneFn) => {
            rteObj.value = 'Line 1<br>Line 2';
            rteObj.inputElement.innerHTML = 'Line 1<br>Line 2';
            rteObj.dataBind();
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, nodetext.length);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('Line 1<br><br>Line 2');
                done();
            }, 100);
        });

        it('Multiple lines - Press enter at the end of the first line - Style Applied', (done: DoneFn) => {
            rteObj.value = '<strong>​Line 1</strong><br><strong>Line 2​</strong>';
            rteObj.inputElement.innerHTML = '<strong>​Line 1</strong><br><strong>Line 2​</strong>';
            rteObj.dataBind();
            const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, nodetext.length);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1</strong><br><strong><br></strong><br><strong>Line 2​</strong>');
                done();
            }, 100);
        });

        it('Multiple lines - Press enter at the start of the second line', (done: DoneFn) => {
            rteObj.value = 'Line 1<br>Line 2';
            rteObj.inputElement.innerHTML = 'Line 1<br>Line 2';
            rteObj.dataBind();
            const nodetext: any = rteObj.inputElement.childNodes[2];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('Line 1<br><br>Line 2');
                done();
            }, 100);
        });

        it('Multiple lines - Press enter at the start of the second line - Style Applied', (done: DoneFn) => {
            rteObj.value = '<strong>​Line 1</strong><br><strong>Line 2​</strong>';
            rteObj.inputElement.innerHTML = '<strong>​Line 1</strong><br><strong>Line 2​</strong>';
            rteObj.dataBind();
            const nodetext: any = rteObj.inputElement.childNodes[2].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                //Need to confirm this case
                expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1</strong><br><br><strong>Line 2​</strong>');
                done();
            }, 100);
        });

        it('Multiple lines - Press enter by selecting the whole line 2', (done: DoneFn) => {
            rteObj.value = 'Line 1<br>Line 2<br>Line 3';
            rteObj.inputElement.innerHTML = 'Line 1<br>Line 2<br>Line 3';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[2];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, startNode.length);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('Line 1<br><br><br>Line 3');
                done();
            }, 100);
        });

        it('Multiple lines - Press enter by selecting the whole line 2 - Style Applied', (done: DoneFn) => {
            rteObj.value = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3​</strong>';
            rteObj.inputElement.innerHTML = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3​</strong>';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[2].childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, startNode, 0, startNode.length);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                //Need to confirm this case
                expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1</strong><br><br><strong>​</strong><br><strong>Line 3​</strong>');
                done();
            }, 100);
        });

        it('Multiple lines - Press enter by selecting few chars from line 2 and few chars from line 3', (done: DoneFn) => {
            rteObj.value = 'Line 1<br>Line 2<br>Line 3';
            rteObj.inputElement.innerHTML = 'Line 1<br>Line 2<br>Line 3';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[2];
            const endNode: any = rteObj.inputElement.childNodes[4];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, endNode, 2, 2);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('Line 1<br>Li<br>ne 3');
                done();
            }, 100);
        });

        it('Multiple lines - Press enter by selecting few chars from line 2 and few chars from line 3 - Styles Applied', (done: DoneFn) => {
            rteObj.value = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3​</strong>';
            rteObj.inputElement.innerHTML = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3​</strong>';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[2].childNodes[0];
            const endNode: any = rteObj.inputElement.childNodes[4].childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, endNode, 2, 2);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1</strong><br><strong>Li</strong><br><strong>ne 3​</strong>');
                done();
            }, 100);
        });

        it('Multiple lines - Press enter on empty line', (done: DoneFn) => {
            rteObj.value = 'Line 1<br><br>Line 2';
            rteObj.inputElement.innerHTML = 'Line 1<br><br>Line 2';
            rteObj.dataBind();
            const nodetext: any = rteObj.inputElement.childNodes[1];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('Line 1<br><br><br>Line 2');
                done();
            }, 100);
        });

        it('Multiple lines - Press enter on empty line - Style Applied', (done: DoneFn) => {
            rteObj.value = '<strong>​Line 1</strong><br><strong>​</strong><br><strong>​</strong><br><strong>Line 2​</strong>';
            rteObj.inputElement.innerHTML = '<strong>​Line 1</strong><br><strong>​</strong><br><strong>​</strong><br><strong>Line 2​</strong>';
            rteObj.dataBind();
            const nodetext: any = rteObj.inputElement.childNodes[2].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                //Need to confirm this case
                expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1</strong><br><br><strong>​</strong><br><strong>​</strong><br><strong>Line 2​</strong>');
                done();
            }, 100);
        });

        it('Press enter by at the empty list by configuring the enter as BR tag', (done: DoneFn) => {
            rteObj.enterKey = 'BR'
            rteObj.value = '<ol><li>List 1</li><li><br></li></ol>';
            rteObj.inputElement.innerHTML = '<ol><li>List 1</li><li><br></li></ol>';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[0].childNodes[1];
            const sel: void = new NodeSelection().setCursorPoint(
                document, startNode, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<ol><li>List 1</li></ol><br>');
                done();
            }, 100);
        });

        it('Press enter by at the end of the heading by configuring the enter as BR tag', (done: DoneFn) => {
            rteObj.enterKey = 'BR'
            rteObj.value = '<h1>Heading</h1>';
            rteObj.inputElement.innerHTML = '<h1>Heading</h1>';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, startNode, startNode.length);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<h1>Heading</h1><br>');
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('BR Configured - Apply parent based selection formats', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let curDocument: Document;
        let mouseEventArgs: { [key: string]: HTMLElement };
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value: 'RTE Content',
                enterKey: 'BR',
                toolbarSettings: {
                    items: ['Formats']
                },
                format: {
                    types: [
                        { text: 'Paragraph', value: 'P' },
                        { text: 'Code', value: 'Pre'},
                        { text: 'Quotation', value: 'BlockQuote'},
                        { text: 'Heading 1', value: 'H1' },
                        { text: 'Heading 2', value: 'H2' },
                        { text: 'Heading 3', value: 'H3' },
                        { text: 'Heading 4', value: 'H4' }
                    ]
                }
            });
            rteEle = rteObj.element;
            curDocument = rteObj.contentModule.getDocument();
        });

        it('Apply H1 format when cursor at the end of the line', (done: DoneFn) => {
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, nodetext.textContent.length);
            const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
            (sourceTrgEle.childNodes[0] as HTMLElement).click();
            const popupElement: Element = curDocument.querySelectorAll('.e-rte-dropdown-popup.e-popup-open')[0];
            mouseEventArgs = {
                target: (popupElement.childNodes[0].childNodes[3] as HTMLElement)
            };
            (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<h1>RTE Content</h1>');
                done();
            }, 100);
        });

        it('Apply H1 format when cursor at the end of the line - Style Applied', (done: DoneFn) => {
            rteObj.value = '<strong>​RTE Content</strong>';
            rteObj.inputElement.innerHTML = '<strong>​RTE Content</strong>';
            rteObj.dataBind();
            const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, nodetext.textContent.length);
            const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
            (sourceTrgEle.childNodes[0] as HTMLElement).click();
            const popupElement: Element = curDocument.querySelectorAll('.e-rte-dropdown-popup.e-popup-open')[0];
            mouseEventArgs = {
                target: (popupElement.childNodes[0].childNodes[3] as HTMLElement)
            };
            (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<h1><strong>​RTE Content</strong></h1>');
                done();
            }, 100);
        });

        it('Apply H1 format when cursor at the start of the line', (done: DoneFn) => {
            rteObj.value = 'RTE Content';
            rteObj.inputElement.innerHTML = 'RTE Content';
            rteObj.dataBind();
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, 0);
            const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
            (sourceTrgEle.childNodes[0] as HTMLElement).click();
            const popupElement: Element = curDocument.querySelectorAll('.e-rte-dropdown-popup.e-popup-open')[0];
            mouseEventArgs = {
                target: (popupElement.childNodes[0].childNodes[3] as HTMLElement)
            };
            (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<h1>RTE Content</h1>');
                done();
            }, 100);
        });

        it('Apply H2 format when cursor at the start of the second line', (done: DoneFn) => {
            rteObj.value = 'Line 1<br>Line 2';
            rteObj.inputElement.innerHTML = 'Line 1<br>Line 2';
            rteObj.dataBind();
            const nodetext: any = rteObj.inputElement.childNodes[2];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, 0);
            const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
            (sourceTrgEle.childNodes[0] as HTMLElement).click();
            const popupElement: Element = curDocument.querySelectorAll('.e-rte-dropdown-popup.e-popup-open')[0];
            mouseEventArgs = {
                target: (popupElement.childNodes[0].childNodes[4] as HTMLElement)
            };
            (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('Line 1<h2>Line 2</h2>');
                done();
            }, 100);
        });

        it('Apply H2 format when cursor at the start of the second line - Style Applied', (done: DoneFn) => {
            rteObj.value = '<strong>​Line 1</strong><br><strong>Line 2​</strong>';
            rteObj.inputElement.innerHTML = '<strong>​Line 1</strong><br><strong>Line 2​</strong>';
            rteObj.dataBind();
            const nodetext: any = rteObj.inputElement.childNodes[2];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, 0);
            const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
            (sourceTrgEle.childNodes[0] as HTMLElement).click();
            const popupElement: Element = curDocument.querySelectorAll('.e-rte-dropdown-popup.e-popup-open')[0];
            mouseEventArgs = {
                target: (popupElement.childNodes[0].childNodes[4] as HTMLElement)
            };
            (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1</strong><h2><strong>Line 2​</strong></h2>');
                done();
            }, 100);
        });

        it('Apply H3 format by selecting the whole second line', (done: DoneFn) => {
            rteObj.value = 'Line 1<br>Line 2<br>Line 3';
            rteObj.inputElement.innerHTML = 'Line 1<br>Line 2<br>Line 3';
            rteObj.dataBind();
            const selectNode: any = rteObj.inputElement.childNodes[2];
            const sel: void = new NodeSelection().setSelectionText(
                document, selectNode, selectNode, 0, selectNode.length);
            const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
            (sourceTrgEle.childNodes[0] as HTMLElement).click();
            const popupElement: Element = curDocument.querySelectorAll('.e-rte-dropdown-popup.e-popup-open')[0];
            mouseEventArgs = {
                target: (popupElement.childNodes[0].childNodes[5] as HTMLElement)
            };
            (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('Line 1<h3>Line 2</h3>Line 3');
                done();
            }, 100);
        });

        it('Apply H3 format by selecting the whole second line - Style Applied', (done: DoneFn) => {
            rteObj.value = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3​</strong>';
            rteObj.inputElement.innerHTML = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3​</strong>';
            rteObj.dataBind();
            const selectNode: any = rteObj.inputElement.childNodes[2].childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, selectNode, selectNode, 0, selectNode.length);
            const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
            (sourceTrgEle.childNodes[0] as HTMLElement).click();
            const popupElement: Element = curDocument.querySelectorAll('.e-rte-dropdown-popup.e-popup-open')[0];
            mouseEventArgs = {
                target: (popupElement.childNodes[0].childNodes[5] as HTMLElement)
            };
            (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1</strong><h3><strong>Line 2</strong></h3><strong>Line 3​</strong>');
                done();
            }, 100);
        });

        it('Apply H4 format by selecting the whole second line', (done: DoneFn) => {
            rteObj.value = 'Line 1<br>Line 2<br>Line 3';
            rteObj.inputElement.innerHTML = 'Line 1<br>Line 2<br>Line 3';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[2];
            const endNode: any = rteObj.inputElement.childNodes[4];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, endNode, 2, 2);
            const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
            (sourceTrgEle.childNodes[0] as HTMLElement).click();
            const popupElement: Element = curDocument.querySelectorAll('.e-rte-dropdown-popup.e-popup-open')[0];
            mouseEventArgs = {
                target: (popupElement.childNodes[0].childNodes[6] as HTMLElement)
            };
            (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('Line 1<h4>Line 2</h4><h4>Line 3</h4>');
                done();
            }, 100);
        });

        it('Apply H4 format by selecting the whole second line - Style Applied', (done: DoneFn) => {
            rteObj.value = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3​</strong>';
            rteObj.inputElement.innerHTML = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3​</strong>';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
            const endNode: any = rteObj.inputElement.childNodes[4].childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, endNode, 2, 2);
            const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
            (sourceTrgEle.childNodes[0] as HTMLElement).click();
            const popupElement: Element = curDocument.querySelectorAll('.e-rte-dropdown-popup.e-popup-open')[0];
            mouseEventArgs = {
                target: (popupElement.childNodes[0].childNodes[6] as HTMLElement)
            };
            (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<h4><strong>​Line 1</strong></h4><h4><strong>Line 2</strong></h4><h4><strong>Line 3​</strong></h4>');
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Enter key support - When `BR` is configured', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value: '<p>RTE Content</p>',
                enterKey: 'BR'
            });
        });

        it('Press enter at the end of the paragraph', (done: DoneFn)=> {
            const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, nodetext.textContent.length);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<p>RTE Content</p><br>');
                done();
            }, 100);
        });

        it('Press enter by selecting few chars of the p tag', (done: DoneFn)=> {
            rteObj.value = '<p>RTE Content</p>';
            rteObj.inputElement.innerHTML = '<p>RTE Content</p>';
            rteObj.dataBind();
            const nodetext: any = rteObj.inputElement.childNodes[0].childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, nodetext, nodetext, 7, nodetext.length);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<p>RTE Con</p><br>');
                done();
            }, 100);
        });

        it('Press enter by selecting all the three lines', (done: DoneFn)=> {
            rteObj.value = 'Line 1<br>Line 2<br>Line 3';
            rteObj.inputElement.innerHTML = 'Line 1<br>Line 2<br>Line 3';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[0];
            const endNode: any = rteObj.inputElement.childNodes[4];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, endNode, 0, endNode.length);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<br><br>');
                done();
            }, 100);
        });

        it('Press enter by selecting second and the third lines fully', (done: DoneFn)=> {
            rteObj.value = 'Line 1<br>Line 2<br>Line 3<br>Line 4';
            rteObj.inputElement.innerHTML = 'Line 1<br>Line 2<br>Line 3';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[2];
            const endNode: any = rteObj.inputElement.childNodes[4];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, endNode, 0, endNode.length);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('Line 1<br><br><br>Line 4');
                done();
            }, 100);
        });

        it('Press enter by selecting second and the third lines fully - Styles Applied', (done: DoneFn)=> {
            rteObj.value = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3</strong><br><strong>Line 4​</strong>';
            rteObj.inputElement.innerHTML = '<strong>​Line 1</strong><br><strong>Line 2</strong><br><strong>Line 3</strong><br><strong>Line 4​</strong>';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[2].childNodes[0];
            const endNode: any = rteObj.inputElement.childNodes[6].childNodes[0];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, endNode, 0, 0);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                //Need to confirm this case
                expect(rteObj.inputElement.innerHTML).toBe('<strong>​Line 1</strong><br><br><strong>Line 4​</strong>');
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('BR Configured - Apply parent based selection formats', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let curDocument: Document;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value: 'RTE Content',
                enterKey: 'BR',
                toolbarSettings: {
                    items: [ 'UnorderedList']
                }
            });
            rteEle = rteObj.element;
            curDocument = rteObj.contentModule.getDocument();
        });

        it('Apply List format when cursor at the end of the line', (done: DoneFn) => {
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, nodetext.textContent.length);
            const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
            (sourceTrgEle.childNodes[0] as HTMLElement).click();
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<ul><li>RTE Content</li></ul>');
                done();
            }, 100);
        });

        it('Apply List format by selecting multiple lines', (done: DoneFn) => {
            rteObj.value = 'List 1<br>List 2<br>List 3';
            rteObj.inputElement.innerHTML = 'List 1<br>List 2<br>List 3';
            rteObj.dataBind();
            const startNode: any = rteObj.inputElement.childNodes[0];
            const endNode: any = rteObj.inputElement.childNodes[4];
            const sel: void = new NodeSelection().setSelectionText(
                document, startNode, endNode, 0, endNode.length);
            const sourceTrgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
            (sourceTrgEle.childNodes[0] as HTMLElement).click();
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe('<ul><li>List 1</li><li>List 2</li><li>List 3</li></ul>');
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
        describe('Bug 880237: Bullet list not working properly and throws script error when we use enterKey as "BR" in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let domSelection: NodeSelection = new NodeSelection();
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<ul><li level="1" style="list-style-type: disc;margin-bottom:0in;">One</li><li level="1" style="list-style-type: disc;margin-bottom:0in;">Two</li><li level="1" style="list-style-type: disc;margin-bottom:0in;">Three</li><li level="1" style="list-style-type: disc;margin-bottom:0in;">Four</li></ul>`,
                enterKey: 'BR',
                toolbarSettings: {
                    items: ['OrderedList', 'UnorderedList']
                }
            });
            rteEle = rteObj.element;
        });
        it('Default value when `BR` is configured with UL', (done: DoneFn) => {
            const unorderListEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[1];
            let startElement = rteObj.inputElement.querySelector('ul');
            domSelection.setSelectionText(document, startElement.childNodes[0], startElement.childNodes[3], 0, 1);
            unorderListEle.click();
            unorderListEle.click();
            unorderListEle.click();
            unorderListEle.click();
            setTimeout(() => {
                expect(!isNullOrUndefined(rteObj.inputElement.querySelector('ul'))).toBe(true);
                done();
            }, 100);
        });
        it('Default value when `BR` is configured with UL and with more inline tags', (done: DoneFn) => {
            rteObj.value=`<ul><li>One&nbsp;<strong>asdasd</strong></li><li>Two&nbsp;<strong>asdasd</strong></li><li>Three&nbsp;<strong>asdasd</strong></li><li>Four&nbsp;<strong>asdasd</strong></li></ul>`;
            rteObj.dataBind();
            const unorderListEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[1];
            let startElement = rteObj.inputElement.querySelector('ul');
            domSelection.setSelectionText(document, startElement.childNodes[0], startElement.childNodes[3], 0, 1);
            unorderListEle.click();
            unorderListEle.click();
            unorderListEle.click();
            unorderListEle.click();
            setTimeout(() => {
                expect(!isNullOrUndefined(rteObj.inputElement.querySelector('ul'))).toBe(true);
                done();
            }, 100);
        });
        it('Default value when `BR` is configured , applying list without selecting', (done: DoneFn) => {
            rteObj.value=`<ul><li>hello&nbsp;<strong>world&nbsp;</strong>&nbsp;this is&nbsp;<strong>&nbsp;ME&nbsp;</strong></li></ul>`;
            rteObj.dataBind();
            const unorderListEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[1];
            unorderListEle.click();
            unorderListEle.click();
            unorderListEle.click();
            unorderListEle.click();
            setTimeout(() => {
                expect(!isNullOrUndefined(rteObj.inputElement.querySelector('ul'))).toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('884734 : Pasted images get duplicated when using enterKey as BR in RichTextEditor', () => {
        let editor: RichTextEditor
        beforeEach(() => {
            editor = renderRTE({
                enterKey: 'BR',
                value: `<img alt="image 1" src="/base/spec/content/image/RTEImage-Feather.png" style="width: 450px; height: 300px;" />`
            });
        });
        afterEach(() => {
            destroy(editor);
        });
        it ('Case 1 The cursot at the start of the image', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = document.createRange();
            range.setStart(editor.inputElement.querySelector('img'), 0);
            range.setEnd(editor.inputElement.querySelector('img'), 0);
            const selection: Selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
            setTimeout(() => {
                expect(window.getSelection().getRangeAt(0).startContainer.nodeName === 'IMG').toBe(true);
                done();
            }, 100);
        });
        it ('Case 2 The cursot at the end of the image', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = document.createRange();
            range.setStart(editor.inputElement, 1);
            range.setEnd(editor.inputElement, 1);
            const selection: Selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
            setTimeout(() => {
                expect(window.getSelection().getRangeAt(0).startContainer.nodeName === 'BR').toBe(true);
                done();
            }, 100);
        });
        it ('Case 3 The cursot at the start of the image, Multiple enter action', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = document.createRange();
            range.setStart(editor.inputElement.querySelector('img'), 0);
            range.setEnd(editor.inputElement.querySelector('img'), 0);
            const selection: Selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
            setTimeout(() => {
                expect(window.getSelection().getRangeAt(0).startContainer.nodeName === 'IMG').toBe(true);
                done();
            }, 100);
        });
    });

    describe('968970 - Enter key as BR breaks the content when pressing Enter in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                enterKey: 'BR',
                value: "Hey,<br><br>Thanks for getting in touch. Do you have a copy of what the customer printed, or can you replicate the issue on your end?<br><br>We could definitely go down the track of building a custom report for printing if you would like more control over the layout. Please see the image below for reference.<br><br><img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' class='e-rte-image e-img-inline'>",
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('When enter key as BR and RTE content has image element, enter action should work properly', (done: Function) => {
            const nodeToSelect = rteObj.inputElement.childNodes[3] as HTMLElement;
            setCursorPoint(nodeToSelect, 28);
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', keyboardEventArgs));
            setTimeout(() => {
                const expectedElem: string = 'Hey,<br><br>Thanks for getting in touch.<br>&nbsp;Do you have a copy of what the customer printed, or can you replicate the issue on your end?<br><br>We could definitely go down the track of building a custom report for printing if you would like more control over the layout. Please see the image below for reference.<br><br><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline">';
                expect(rteObj.inputElement.innerHTML).toBe(expectedElem);
                done();
            }, 100);
        });
    });

    describe('936623 - Cursor moves to next node instead of creating new element on Enter key press in Rich Text Editor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: '200px',
                value: `In Rich text Editor, the enter key and shift + enter key actions can be customized using the enterKey and shiftEnterKey APIs. And the possible values are as follows:<ul><li>P - When 'P' is configured, pressing enter or shift + enter will create a 'p' tag</li><li>DIV - When 'DIV' is configured, pressing enter or shift + enter will create a 'div' tag</li><li>BR - When 'BR' is configured, pressing enter or shift + enter will create a 'br' tag</li></ul>`,
                enterKey: "BR",
                shiftEnterKey: "P",
            });
        });

        it('Press the enter key at the end of the P tag the BR element was created', (done: DoneFn) => {
            const nodetext: any = rteObj.inputElement.childNodes[0];
            const sel: void = new NodeSelection().setCursorPoint(
                document, nodetext, nodetext.textContent.length);
            rteObj.inputElement.dispatchEvent(keyboardEventArgs);
            setTimeout(() => {
                expect(rteObj.inputElement.innerHTML).toBe(`In Rich text Editor, the enter key and shift + enter key actions can be customized using the enterKey and shiftEnterKey APIs. And the possible values are as follows:<br><br><ul><li>P - When 'P' is configured, pressing enter or shift + enter will create a 'p' tag</li><li>DIV - When 'DIV' is configured, pressing enter or shift + enter will create a 'div' tag</li><li>BR - When 'BR' is configured, pressing enter or shift + enter will create a 'br' tag</li></ul>`);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
});