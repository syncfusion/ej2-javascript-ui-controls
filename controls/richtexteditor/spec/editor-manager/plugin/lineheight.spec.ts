/**
* LineHeight plugin spec
*/
import { Browser, createElement, detach } from '@syncfusion/ej2-base';
import { RichTextEditor } from '../../../src';
import { renderRTE, destroy, dispatchEvent, setSelection } from '../../rich-text-editor/render.spec';
import { BASIC_MOUSE_EVENT_INIT } from '../../constant.spec';

describe('LineHeight plugin', () => {
    describe('Applying lineheight via dropdown button', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['LineHeight', 'StrikeThrough',
                        'FontName', 'FontSize', 'FontColor', 'BackgroundColor']
                },
                value: `<p id="rte">RichTextEditor</p><p id="rte1">RichTextEditor</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it(' Applying lineheight via dropdown button', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[2] as HTMLElement;
            item.click();
            dispatchEvent(item, 'mousedown');
            setTimeout(() => {
                expect(pEle.style.lineHeight === '1.15').toBe(true);
                done();
            }, 100);
        });
        it('Apply the LineHeight by curosr point at word', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            let pEle1: HTMLElement = rteObj.element.querySelector('#rte1');

            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte1').childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[2] as HTMLElement;
            item.click();
            dispatchEvent(item, 'mousedown');
            setTimeout(() => {
                expect(pEle.style.lineHeight === '1.15').toBe(true);
                expect(pEle1.style.lineHeight === '1.15').toBe(true);
                done();
            }, 100);
        });
        it('Selecting 2 paragraoh and then apply lineHeight', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.focusIn();
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[2] as HTMLElement;
            item.click();
            dispatchEvent(item, 'mousedown');
            setTimeout(() => {
                expect(pEle.style.lineHeight === '1.15').toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('Apply lineHeight with enterkey as BR', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['LineHeight', 'StrikeThrough',
                        'FontName', 'FontSize', 'FontColor', 'BackgroundColor']
                },
                value: `RichTextEditor`,
                enterKey: "BR"
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it('Apply lineHeight with enterkey as BR', (done) => {
            rteObj.value = `<p>Hello<br/>World<br/>this</p>`;
            rteObj.dataBind();
            rteObj.focusIn();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.firstChild, rteObj.inputElement.firstChild, 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[2] as HTMLElement;
            item.click();
            dispatchEvent(item, 'mousedown');
            setTimeout(() => {
                expect((rteObj.inputElement.firstChild as HTMLElement).style.lineHeight === '1.15').toBe(true);
                done();
            }, 100);
        });
        it('for multiple nodes', (done) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.firstChild, rteObj.inputElement.lastChild, 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[3] as HTMLElement;
            item.click();
            dispatchEvent(item, 'mousedown');
            setTimeout(() => {
                expect((rteObj.inputElement.firstChild as HTMLElement).style.lineHeight === '1.5').toBe(true);
                expect((rteObj.inputElement.lastChild as HTMLElement).style.lineHeight === '1.5').toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('Adding Custom lineheight', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['LineHeight', 'StrikeThrough',
                        'FontName', 'FontSize', 'FontColor', 'BackgroundColor']
                },
                value: `<p id="rte">RichTextEditor</p>`,
                enterKey: "BR",
                lineHeight: {
                    default: "10pt",
                    items: [
                        { text: "8", value: "8pt" },
                        { text: "10", value: "10pt" },
                        { text: "12", value: "12pt" },
                        { text: "14", value: "14pt" },
                        { text: "18", value: "18pt" },
                        { text: "24", value: "24pt" },
                        { text: "hoda", value: "36pt" }
                    ],
                    supportAllValues: true
                },
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it('Select a line and then apply custom lineheight', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            expect(document.querySelectorAll('.e-rte-dropdown-popup .e-item')[0].textContent === '8').toBe(true);
            expect(document.querySelectorAll('.e-rte-dropdown-popup .e-item')[1].textContent === '10').toBe(true);
            expect(document.querySelectorAll('.e-rte-dropdown-popup .e-item')[2].textContent === '12').toBe(true);
            expect(document.querySelectorAll('.e-rte-dropdown-popup .e-item')[3].textContent === '14').toBe(true);
            expect(document.querySelectorAll('.e-rte-dropdown-popup .e-item')[4].textContent === '18').toBe(true);
            expect(document.querySelectorAll('.e-rte-dropdown-popup .e-item')[5].textContent === '24').toBe(true);
            expect(document.querySelectorAll('.e-rte-dropdown-popup .e-item')[6].textContent === 'hoda').toBe(true);
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[2] as HTMLElement;
            item.click();
            dispatchEvent(item, 'mousedown');
            setTimeout(() => {
                expect(pEle.style.lineHeight === '12pt').toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('Selecting deafult value to set default lineHeight', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['LineHeight', 'StrikeThrough',
                        'FontName', 'FontSize', 'FontColor', 'BackgroundColor']
                },
                value: `<p id="rte">RichTextEditor</p>`,
                enterKey: "BR",
                lineHeight: {
                    default: "10pt",
                    supportAllValues: true
                },
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it(' Selecting deafult value to set default lineHeight', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[0] as HTMLElement;
            item.click();
            dispatchEvent(item, 'mousedown');
            setTimeout(() => {
                expect(pEle.style.lineHeight === '').toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('Removing lineHeight by selecting default ', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['LineHeight', 'StrikeThrough',
                        'FontName', 'FontSize', 'FontColor', 'BackgroundColor']
                },
                value: `<p id="rte"  style="line-height: 1.5;">RichTextEditor</p>`,
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it('Removing lineHeight by selecting default', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[0] as HTMLElement;
            item.click();
            dispatchEvent(item, 'mousedown');
            setTimeout(() => {
                expect(pEle.style.lineHeight === '').toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('Mobile case for the iframe lineheight', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultUserAgent = navigator.userAgent;
        beforeAll(() => {
            Browser.userAgent = "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Mobile Safari/537.36"
            "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Mobile Safari/537.36";
            rteObj = renderRTE({
                value: '<p id="rte">RichTextEditor</p>',
                toolbarSettings: {
                    items: ['LineHeight', 'BackgroundColor', 'Bold']
                }
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it('Applying line Height as 1', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[1] as HTMLElement;
            item.click();
            dispatchEvent(item, 'mousedown');
            setTimeout(() => {
                expect(pEle.style.lineHeight === '1').toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
            Browser.userAgent = defaultUserAgent;
        });
    });
    describe('Testing for the case of inline toolbar', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['LineHeight', 'StrikeThrough',
                        'FontName', 'FontSize', 'FontColor', 'BackgroundColor']
                },
                inlineMode: {
                    enable: true,
                    onSelection: true

                },
                value: `<p id="rte"  style="line-height: 1.5;">RichTextEditor</p>`,
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it('opening inline toolbar and then selecting lineHeight feature ', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 3);
            rteObj.showInlineToolbar();
            let item: HTMLElement = document.querySelector('#' + controlId + '_quick' + '_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[1] as HTMLElement;
            item.click();
            dispatchEvent(item, 'mousedown');
            setTimeout(() => {
                expect(pEle.style.lineHeight === '1').toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('Iframe Testing for the lineHeight', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['LineHeight', 'StrikeThrough',
                        'FontName', 'FontSize', 'FontColor', 'BackgroundColor']
                },
                iframeSettings: {
                    enable: true
                },

                value: `<p id="rte"  style="line-height: 1.5;">RichTextEditor</p>`,
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it('Applying lineheight as one by dropdown', (done) => {
            let pEle: HTMLElement = rteObj.contentModule.getDocument().querySelector('#rte');;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = document.querySelector('#' + controlId + '_toolbar_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[1] as HTMLElement;
            item.click();
            dispatchEvent(item, 'mousedown');
            setTimeout(() => {
                expect(pEle.style.lineHeight === '1').toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('Tooltip checking for the lineHeight', () => {
        let rteObj: RichTextEditor;
        beforeAll((done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['LineHeight'],
                },
                value: "Rich Text Editor"
            });
            done();
        });
        it('Tooltip Testing for lineHeight', (done: Function) => {
            const toolbarItems: NodeListOf<Element> = document.querySelectorAll('.e-toolbar-item');
            event = new MouseEvent('mouseover', { bubbles: true, cancelable: true });
            toolbarItems[0].dispatchEvent(event);
            let toolTipContent = document.querySelector('.e-tip-content');
            expect(toolTipContent).not.toBe(null);
            rteObj.destroy();
            setTimeout(function () {
                expect(document.body.contains(toolTipContent)).toBe(false);
                done();
            }, 100)
        });
        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
    });
    describe('Adding line height via using the execute command ', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p id="rte">RichTextEditor</p>`,
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it('Addling line HEight of 10', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 3);
            rteObj.executeCommand('lineHeight', '10');
            setTimeout(() => {
                expect(pEle.style.lineHeight === '10').toBe(true);
                done();
            }, 100);
        });
        it('Removing lineHeight via execute command', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 3);
            rteObj.executeCommand('lineHeight');
            setTimeout(() => {
                expect(pEle.style.lineHeight === '').toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('Nested List case .', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll((done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['LineHeight'],
                },
                value: `<ol>
   <li id="rte">Hello World
      <ol>
         <li>this is a sample text
            <ol>
               <li id="rte1">to check the nested list </li>
               <li>Hello</li>
            </ol>
         </li>
         <li>this will check</li>
      </ol>
   </li>
</ol>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        it('LineHeight selection for the nested list case', (done: Function) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            let pEle1: HTMLElement = rteObj.element.querySelector('#rte1');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte1').childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[1] as HTMLElement;
            item.click();
            dispatchEvent(item, 'mousedown');
            setTimeout(() => {
                expect(pEle.style.lineHeight === '1').toBe(true);
                expect(pEle1.style.lineHeight === '1').toBe(true);
                done();
            }, 100);
        });
        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
    });
    describe('Testing action Begin and action Complete', () => {
        let rteObj: RichTextEditor;
        let actionBeginTiggered: boolean = false;
        let actionCompleteTiggered: boolean = false;
        let controlId: string;
        let rteEle: HTMLElement

        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p id="rte">RichTextEditor</p>',
                toolbarSettings: {
                    items: ['LineHeight', 'StrikeThrough',
                        'FontName', 'FontSize', 'FontColor', 'BackgroundColor']
                },
                actionBegin: onActionBeginfun,
                actionComplete: onActionCompletefun,
            });
            function onActionBeginfun(): void {
                actionBeginTiggered = true;
            }
            function onActionCompletefun(): void {
                actionCompleteTiggered = true;
            }
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });

        it('Checking actionBegin and action Complete', (done: DoneFn) => {
            rteObj.focusIn();
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = document.querySelector('#' + controlId + '_toolbar_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[1] as HTMLElement;
            item.click();
            setTimeout(() => {
                expect(pEle.style.lineHeight === '1').toBe(true);
                expect(actionBeginTiggered === true);
                expect(actionCompleteTiggered === true);
                done();
            }, 100);

        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('UNdo Redo checks', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        let rteEle: HTMLElement
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p id="rte">RichTextEditor</p>',
                toolbarSettings: {
                    items: ['Undo', 'Redo',
                        'LineHeight', 'FontSize', 'FontColor', 'BackgroundColor']
                },
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });

        it('applying lineheihgt and cilcing undo and redo', (done: DoneFn) => {
            rteObj.focusIn();
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = document.querySelector('#' + controlId + '_toolbar_LineHeight');
            let item1: HTMLElement = document.querySelector('#' + controlId + '_toolbar_Undo');
            let item2: HTMLElement = document.querySelector('#' + controlId + '_toolbar_Redo');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[1] as HTMLElement;
            item.click();
            item.click();
            setTimeout(() => {
                expect(pEle.style.lineHeight === '1').toBe(true);
                item1.click();
                setTimeout(() => {
                    const undoStatus = rteObj.formatter.editorManager.undoRedoManager.getUndoStatus();
                    expect(undoStatus.redo).toBe(true);
                    item2.click();
                    setTimeout(() => {
                        const redoStatus = rteObj.formatter.editorManager.undoRedoManager.getUndoStatus();
                        expect(redoStatus.undo).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 100);

        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('allow custom API', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        let rteEle: HTMLElement
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p id="rte" style="line-height: 10;">RichTextEditor</p>',
                toolbarSettings: {
                    items: ['Undo', 'Redo',
                        'LineHeight', 'FontSize', 'FontColor', 'BackgroundColor']
                },
                lineHeight: {
                    supportAllValues: true
                }
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });

        it('Checking dropdown for the allow Custom API', (done: DoneFn) => {
            rteObj.focusIn();
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = document.querySelector('#' + controlId + '_toolbar_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[7] as HTMLElement;
            expect(item.textContent === 'Custom: 10').toBe(true);
            item.click();
            done()
        });

        it('Checking custom lineheight for the mulitple line selection', (done: DoneFn) => {
            rteObj.value = `<p style="line-height: 10;">Hello world</p> <p>this</p> <p>this the sample</p>`;
            rteObj.dataBind();
            rteObj.focusIn();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.firstChild, rteObj.inputElement.lastChild, 0, 1);
            let item: HTMLElement = document.querySelector('#' + controlId + '_toolbar_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[7] as HTMLElement;
            expect(item.textContent === 'Custom: 10').toBe(true);
            done();
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('Quick Toolbar Testing', () => {
        let editor: RichTextEditor;
        const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
        let controlId: string;
        let rteEle: HTMLElement
        beforeAll(() => {
            editor = renderRTE({
                quickToolbarSettings: {
                    text: ['LineHeight', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                },
                value: `<p id="rte">RichTextEditor</p>`
            });
            rteEle = editor.element;
            controlId = rteEle.id;
        });
        afterAll(() => {
            destroy(editor)
        });
        it('Testing line Height via quick toolbar', (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('#rte');
            setSelection(target.firstChild, 0, 3);
            editor.quickToolbarModule.textQTBar.showPopup(target, null);
            let item: HTMLElement = document.querySelector('#' + controlId + '_quick' + '_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[1] as HTMLElement;
            item.click();
            dispatchEvent(item, 'mousedown');
            setTimeout(() => {
                expect(target.style.lineHeight === '1').toBe(true);
                done();
            }, 100);
        });
    });
    describe('Selecting deafult value to set default lineHeight', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['LineHeight', 'StrikeThrough',
                        'FontName', 'FontSize', 'FontColor', 'BackgroundColor'],
                    position: "Bottom"
                },
                value: `<p id="rte">RichTextEditor</p>`,
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it(' Selecting deafult value to set default lineHeight', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[0] as HTMLElement;
            item.click();
            dispatchEvent(item, 'mousedown');
            setTimeout(() => {
                expect(pEle.style.lineHeight === '').toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

     describe('Testing action Begin and action Complete', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        let rteEle: HTMLElement

        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p id="rte">RichTextEditor</p>',
                toolbarSettings: {
                    items: ['LineHeight', 'StrikeThrough',
                        'FontName', 'FontSize', 'FontColor', 'BackgroundColor']
                },
                actionBegin: onActionBeginfun,
            });
            function onActionBeginfun(args: any): void {
                args.cancel = true;
            }
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });

        it('Checking lineheight by disabling in the actionbegin', (done: DoneFn) => {
            rteObj.focusIn();
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = document.querySelector('#' + controlId + '_toolbar_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[1] as HTMLElement;
            item.click();
            setTimeout(() => {
                expect(pEle.style.lineHeight === '').toBe(true);
                done();
            }, 100);

        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
     describe('Testing action Begin and action Complete', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        let rteEle: HTMLElement

        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p id="rte">RichTextEditor</p>',
                toolbarSettings: {
                    items: ['LineHeight', 'StrikeThrough',
                        'FontName', 'FontSize', 'FontColor', 'BackgroundColor']
                },
                actionComplete: onActionCompletefun,
            });
            function onActionCompletefun(args: any): void {
                args.cancel = true;
            }
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });

        it('Checking lineheight by disabling in the actioncomplete', (done: DoneFn) => {
            rteObj.focusIn();
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = document.querySelector('#' + controlId + '_toolbar_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[1] as HTMLElement;
            item.click();
            setTimeout(() => {
                expect(pEle.style.lineHeight === '1').toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('993183: Testing action Begin with its request type', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        let rteEle: HTMLElement

        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p id="rte">RichTextEditor</p>',
                toolbarSettings: {
                    items: ['LineHeight', 'StrikeThrough',
                        'FontName', 'FontSize', 'FontColor', 'BackgroundColor']
                },
                actionBegin: onActionBeginfun,
            });
            function onActionBeginfun(args: any): void {
                if (args.requestType === 'LineHeight') {
                    args.cancel = true;
                }
            }
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });

        it('Checking lineheight by disabling in the actionbegin', (done: DoneFn) => {
            rteObj.focusIn();
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = document.querySelector('#' + controlId + '_toolbar_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[1] as HTMLElement;
            item.click();
            setTimeout(() => {
                expect(pEle.style.lineHeight === '').toBe(true);
                done();
            }, 100);

        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('994432: Adding Custom lineheight testing with the percentage case ', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['LineHeight', 'StrikeThrough',
                        'FontName', 'FontSize', 'FontColor', 'BackgroundColor']
                },
                value: `<p id="rte" style="line-height: 250%">RichTextEditor</p>`,
                lineHeight: {
                    default: "10pt",
                    supportAllValues: true
                },
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it('Select a line and then apply custom lineheight', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_LineHeight');
            dispatchEvent(item, 'mousedown');
            item.click();
            const items = document.querySelectorAll('.e-rte-dropdown-popup .e-item');
            expect(items[items.length - 1].textContent === 'Custom: 250%').toBe(true);
            item = document.querySelectorAll('.e-rte-dropdown-popup .e-item')[2] as HTMLElement;
            setTimeout(() => {
                expect(pEle.style.lineHeight === '250%').toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
});

