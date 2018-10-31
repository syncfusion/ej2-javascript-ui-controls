import { Toolbar } from '../../../src/rich-text-editor/index';
import { dispatchEvent } from '../../../src/rich-text-editor/base/util';
import { RichTextEditor } from '../../../src/rich-text-editor/base/rich-text-editor';
import { NodeSelection } from '../../../src/selection/index';

import { renderRTE, destroy } from './../render.spec';
import { createElement, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { QuickToolbar, MarkdownEditor, HtmlEditor, Link, Image } from "../../../src/rich-text-editor/index";
import { editLink } from '../../../src/rich-text-editor';
import { Browser, detach, getUniqueID } from "@syncfusion/ej2-base";
import { FormValidator } from "@syncfusion/ej2-inputs";

RichTextEditor.Inject(MarkdownEditor);
RichTextEditor.Inject(HtmlEditor);

RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(QuickToolbar, Link, Image);

function setCursorPoint(curDocument: Document, element: Element, point: number) {
    let range: Range = curDocument.createRange();
    let sel: Selection = curDocument.defaultView.getSelection();
    range.setStart(element, point);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}
let keyboardEventArgs = {
    preventDefault: function () { },
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    char: '',
    key: '',
    charCode: 22,
    keyCode: 22,
    which: 22,
    code: 22,
    action: '',
    type: 'keydown'
};
L10n.load({
    'de-DE': {
        'richtexteditor': {
            alignments: 'Alignments',
            justifyLeft: 'Ausrichten von Text links',
            justifyCenter: "Text-Zentrum",
            justifyRight: "Ausrichten von Text rechts",
            justifyFull: "rechtfertigen",
            fontName: "Wählen Sie Schriftfamilie",
            fontSize: "Wählen Sie Schriftgröße",
            fontColor: "Wählen Sie die Farbe",
            backgroundColor: "Hintergrundfarbe",
            bold: "fett",
            italic: "kursiv",
            underline: "unterstreichen",
            strikethrough: "Durchgestrichen",
            clearAll: "Alles",
            clearFormat: "Klar Format",
            cut: "schneiden",
            copy: "Kopieren",
            paste: "Paste",
            unorderedList: "Legen Sie ungeordnete Liste",
            orderedList: "Geordnete Liste einfügen",
            indent: "Einzug",
            outdent: "Einzug verkleinern",
            undo: "lösen",
            redo: "Wiederherstellen",
            superscript: "Überschrift",
            subscript: "index",
            createLink: "Einfügen / Hyperlink Bearbeiten",
            removeLink: "fjern Hyperlink",
            openLink: "Open link",
            editLink: "Edit link",
            image: "Bild einfügen",
            replace: 'ersetzen',
            align: 'ausrichten',
            caption: 'Bildbeschriftung',
            formats: 'Formats',
            remove: 'Löschen',
            insertLink: 'Link einfügen',
            display: 'Anzeige',
            alttext: 'alternativer Text',
            dimension: 'Größe',
            fullscreen: 'Vollbild',
            maximize: 'Maximieren',
            minimize: 'minimieren',
            zoomIn: 'hineinzoomen',
            zoomOut: 'Rauszoomen',
            upperCase: "Großbuchstaben",
            lowerCase: "Kleinbuchstaben",
            print: 'Drucken',
            sourcecode: 'Quellcode',
            preview: 'Vorschau',
            viewside: 'Seite anzeigen',
            insertcode: 'Code eingeben',
            linkText: 'Displaytekst',
            linkTooltipLabel: 'tooltip',
            linkWebUrl: 'Webadres',
            linkOpenInNewWindow: 'Open de link in een nieuw venster',
            linkHeader: 'Link invoegen',
            dialogInsert: 'invoegen',
            dialogCancel: 'Annuleer',
            dialogUpdate: 'Bijwerken',
            imageHeader: 'Voeg afbeelding in',
            imageLinkHeader: 'U kunt ook een link van internet opgeven',
            imageUploadMessage: 'Zet hier een afbeelding neer of klik om te uploaden',
            imageDeviceUploadMessage: 'Klik hier om te uploaden',
            imageAlternateText: 'Alternatieve tekst',
            alternateHeader: 'Alternatieve tekst',
            browse: 'Blader',
            imageUrl: 'URL',
            imageCaption: 'onderschrift',
            imageSizeHeader: 'Afbeeldingsgrootte',
            imageHeight: 'Hoogte',
            imageWidth: 'Breedte'
        }
    }
});

describe('RTE base module', () => {

    describe('RTE without iframe', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            rteObj = renderRTE({});
            elem = rteObj.element;
            done();
        });

        it('check content div element', () => {
            expect(rteObj.element.querySelector('.e-rte-content')).not.toBe(null);
        });

        it('getContent public method', () => {
            expect(rteObj.getContent().classList.contains('e-rte-content')).toBe(true);
        });

        it('Width setting', () => {
            rteObj.width = 'auto';
            rteObj.dataBind();
            expect(rteObj.getContent().classList.contains('e-rte-content')).toBe(true);
        });

        it('getPersistData public method', () => {
            rteObj.refresh();
            let stringItems: any = rteObj.getPersistData();
            expect(stringItems.search('value')).toBe(2);
        });
        it('selectAll public method', () => {
            rteObj.selectAll();
            let selection: Selection = rteObj.formatter.editorManager.nodeSelection.get(rteObj.contentModule.getDocument());
            expect(selection.anchorNode).toBe(rteObj.contentModule.getEditPanel());
            expect(selection.focusNode).toBe(rteObj.contentModule.getEditPanel());
            expect(selection.anchorOffset).toBe(0);
            expect(selection.focusOffset).toBe(rteObj.contentModule.getEditPanel().childNodes.length);
        });
        it('selectRange public method', () => {
            let range: Range = rteObj.contentModule.getDocument().createRange();
            range.setStart(rteObj.contentModule.getEditPanel(), 0);
            range.setEnd(rteObj.contentModule.getEditPanel(), rteObj.contentModule.getEditPanel().childNodes.length);
            rteObj.selectRange(range);
            let selection: Selection = rteObj.formatter.editorManager.nodeSelection.get(rteObj.contentModule.getDocument());
            expect(selection.anchorNode).toBe(rteObj.contentModule.getEditPanel());
            expect(selection.focusNode).toBe(rteObj.contentModule.getEditPanel());
            expect(selection.anchorOffset).toBe(0);
            expect(selection.focusOffset).toBe(rteObj.contentModule.getEditPanel().childNodes.length);
        });
        it('getSelection public method', () => {
            let range: Range = rteObj.contentModule.getDocument().createRange();
            range.setStart(rteObj.contentModule.getEditPanel(), 0);
            range.setEnd(rteObj.contentModule.getEditPanel(), rteObj.contentModule.getEditPanel().childNodes.length);
            rteObj.selectRange(range);
            let str = rteObj.getSelection();
            expect(range.toString()).toBe(str);
        });
        /*it('executeCommand', () => {
            rteObj.focus();
            var img = document.createElement('img');
            img.src = 'https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
            img.width = 250;
            img.height = 250;
            img.id ='myImg';
            rteObj.execCommand("Image", img);
            let ele: Element = rteObj.getContent();
            expect(ele.querySelector('#myImg')).not.toBe(null);
        })*/
        afterAll(() => {
            destroy(rteObj);
        });

    });

    describe("DIV - RTE value property testing", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                enableHtmlEncode: true,
                focus: () => {

                },
                blur: () => {

                }
            });
            rteEle = rteObj.element;
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('check value Html Encode property', () => {
            expect(rteObj.value !== rteObj.contentModule.getEditPanel().innerHTML).toBe(true);
        });
        it('check value Html Encode property', () => {
            expect(rteObj.value).toBe('&lt;p&gt;Sample&lt;/p&gt;');
        });
        it('disable Html Encode property', () => {
            rteObj.setProperties({ enableHtmlEncode: false });
            expect(rteObj.value === rteObj.contentModule.getEditPanel().innerHTML).toBe(true);
        });
    });

    describe("DIV - RTE content focus and blur event handler testing", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let focusIn: boolean = false;
        let focusOut: boolean = false;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                focus: () => {
                    focusIn = true;
                },
                blur: () => {
                    focusOut = true;
                }
            });
            rteEle = rteObj.element;
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('focus event trigger while click on edit area', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            dispatchEvent(rteObj.contentModule.getEditPanel(), 'focusin');
            expect(focusIn).toBe(true);
            expect(focusOut).toBe(false);
            focusIn = false;
            focusOut = false;
        });
        it('blur event trigger while click on edit area', () => {
            document.body.focus();
            (rteObj as any).onDocumentClick({ target: document.body });
            dispatchEvent(rteObj.contentModule.getEditPanel(), 'focusout');
            expect(focusIn).toBe(false);
            expect(focusOut).toBe(true);
            focusIn = false;
            focusOut = false;
        });
        it('focus event trigger while click on target element', () => {
            (rteObj.element as HTMLElement).focus();
            dispatchEvent(rteObj.element, 'focusin');
            expect(focusIn).toBe(true);
            expect(focusOut).toBe(false);
            focusIn = false;
            focusOut = false;
        });
        it('blur event trigger while click on target element', () => {
            document.body.focus();
            (rteObj as any).onDocumentClick({ target: document.body });
            dispatchEvent(rteObj.element, 'focusout');
            expect(focusIn).toBe(false);
            expect(focusOut).toBe(true);
            focusIn = false;
            focusOut = false;
        });
    });

    describe("Iframe - RTE content focus and blur event handler testing", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let focusIn: boolean = false;
        let focusOut: boolean = false;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                iframeSettings: {
                    enable: true
                },
                focus: () => {
                    focusIn = true;
                },
                blur: () => {
                    focusOut = true;
                }
            });
            rteEle = rteObj.element;
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('focus event trigger while click on edit area', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            dispatchEvent(rteObj.contentModule.getEditPanel(), 'focusin');
            expect(focusIn).toBe(true);
            expect(focusOut).toBe(false);
            focusIn = false;
            focusOut = false;

        });
        it('blur event trigger while click on edit area', () => {
            document.body.focus();
            (rteObj as any).onDocumentClick({ target: document.body });
            dispatchEvent(rteObj.contentModule.getEditPanel(), 'focusout');
            expect(focusIn).toBe(false);
            expect(focusOut).toBe(true);
            focusIn = false;
            focusOut = false;
        });
        it('focus event trigger while click on target element', () => {
            (rteObj.element as HTMLElement).focus();
            dispatchEvent(rteObj.element, 'focusin');
            expect(focusIn).toBe(true);
            expect(focusOut).toBe(false);
            focusIn = false;
            focusOut = false;
        });
        it('blur event trigger while click on target element', () => {
            document.body.focus();
            (rteObj as any).onDocumentClick({ target: document.body });
            dispatchEvent(rteObj.element, 'focusout');
            expect(focusIn).toBe(false);
            expect(focusOut).toBe(true);
            focusIn = false;
            focusOut = false;
        });
    });

    describe('RTE iframe', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                }
            });
            elem = rteObj.element;
            done();
        });

        it('check content iframe element', () => {
            expect(rteObj.element.querySelector('iframe')).not.toBe(null);
        });

        afterAll(() => {
            destroy(rteObj);
        });

    });

    describe('RTE toolbar', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({});
            elem = rteObj.element;
        });

        it('ensure the module', () => {
            expect(rteObj.ensureModuleInjected(rteObj.getInjectedModules()[0] as any)).toBe(true);
        });

        it('ensure the module', () => {
            expect(rteObj.ensureModuleInjected(rteObj.getInjectedModules()[0] as any)).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });

    });

    describe('setContentHeight method testing', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let actionBegin: boolean = false;
        let actionComplete: boolean = false;

        beforeAll((done: Function) => {
            let css: string = ".e-richtexteditor { height: 200px }" +
                ".e-toolbar { display: block; white-space: nowrap; position: relative; }" +
                ".e-toolbar-item { display: inline-block; }";
            let style: HTMLStyleElement = document.createElement('style');
            style.type = "text/css";
            style.id = "scroll";
            style.appendChild(document.createTextNode(css));
            document.body.appendChild(style);
            rteObj = renderRTE({
                height: '200px',
                value: '<p>data</p><ol><li>manager</li></ol>',
                enableTabKey: true,
                toolbarSettings: {
                    items: ['Cut', 'Copy', 'Paste', 'Undo', 'Redo']
                },
                actionBegin: () => {
                    actionBegin = true;
                },
                actionComplete: () => {
                    actionComplete = true;
                }

            });
            elem = rteObj.element;
            done();
        });

        it('Content element height testing', (done) => {
            //height is default is auto, so the content wrapper holds without content height is 18px whether toolbar enabled or not
            expect((<HTMLElement>elem.querySelector('.e-rte-content')).style.height).toBe('182px');
            rteObj.toolbarSettings.enable = false;
            rteObj.dataBind();
            expect(rteObj.element.querySelector('.e-toolbar-items')).toBe(null);
            expect((<HTMLElement>elem.querySelector('.e-rte-content')).style.height).toBe('200px');
            rteObj.toolbarSettings.enable = true;
            rteObj.dataBind();
            expect((<HTMLElement>elem.querySelector('.e-rte-content')).style.height).toBe('182px');
            let node = rteObj.contentModule.getEditPanel().childNodes[0];
            let sel = new NodeSelection().setSelectionText(document, node.childNodes[0], node.childNodes[0], 1, 2);
            let parentNodes = new NodeSelection().getParentNodeCollection(new NodeSelection().getRange(document));
            expect(parentNodes[0]).toEqual(node);
            (elem.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            (elem.querySelectorAll(".e-toolbar-item")[2] as HTMLElement).click();
            expect(parentNodes[0]).toEqual(node);
            (elem.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            (<any>rteObj).onPaste();
            setTimeout(() => {
                expect(parentNodes[0]).toEqual(node);
                keyboardEventArgs.ctrlKey = true;
                keyboardEventArgs.keyCode = 67;
                keyboardEventArgs.action = 'copy';
                (<any>rteObj).keyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 86;
                keyboardEventArgs.action = 'paste';
                (<any>rteObj).keyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 88;
                keyboardEventArgs.action = 'cut';
                (<any>rteObj).keyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 86;
                keyboardEventArgs.action = 'paste';
                (<any>rteObj).keyDown(keyboardEventArgs);
                keyboardEventArgs.action = 'toolbar-focus';
                (<any>rteObj).keyDown(keyboardEventArgs);
                let focusEle: HTMLElement = rteObj.toolbarModule.baseToolbar.toolbarObj.element.querySelector('button');
                expect(document.activeElement === focusEle).toBe(true);
                rteObj.toolbarSettings.enable = false;
                rteObj.dataBind();
                (<any>rteObj).keyDown(keyboardEventArgs);
                done();
            }, 100);

        });
        it('tab key', () => {
            let node = rteObj.contentModule.getEditPanel().childNodes[0];
            let sel = new NodeSelection().setSelectionText(document, node.childNodes[0], node.childNodes[0], 2, 2);
            let parentNodes = new NodeSelection().getParentNodeCollection(new NodeSelection().getRange(document));
            expect(parentNodes[0]).toEqual(node);
            keyboardEventArgs.keyCode = 9;
            keyboardEventArgs.action = 'tab';
            (<any>rteObj.htmlEditorModule).onKeyDown({ args: keyboardEventArgs });
            expect(actionBegin).toBe(true);
            actionBegin = false;
            keyboardEventArgs.keyCode = 9;
            keyboardEventArgs.shiftKey = true,
                (<any>rteObj.htmlEditorModule).onKeyDown({ args: keyboardEventArgs });
            expect(actionBegin).toBe(false);
            actionBegin = false;
            keyboardEventArgs.shiftKey = false,
                keyboardEventArgs.keyCode = 9;
            (<any>rteObj.htmlEditorModule).onKeyDown({ args: keyboardEventArgs });
            expect(actionBegin).toBe(false);
            actionBegin = false;
        });
        it('space key', function () {
            rteObj.contentModule.getEditPanel().innerHTML = 'datamanager https://www.google.com';
            let nodetext: any = rteObj.contentModule.getEditPanel().childNodes[0];
            let sel = new NodeSelection().setSelectionText(document, nodetext, nodetext, nodetext.textContent.length, nodetext.textContent.length);
            keyboardEventArgs.action = 'space';
            keyboardEventArgs.keyCode = 32;
            (<any>rteObj).keyDown(keyboardEventArgs);
            expect(actionBegin).toBe(true);
            expect(actionComplete).toBe(true);
            actionBegin = false;
            actionComplete = false;
            expect(rteObj.contentModule.getEditPanel().querySelector('a')).not.toBe(null);
            var node = rteObj.contentModule.getEditPanel().innerHTML = 'data';
            keyboardEventArgs.action = 'space';
            keyboardEventArgs.keyCode = 32;
            (<any>rteObj.htmlEditorModule).onKeyDown({ args: keyboardEventArgs });
            expect(actionBegin).toBe(false);
            actionBegin = false;
        });

        it('space key', function () {
            rteObj.destroy();
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    enableFloating: true,
                }
            });
            rteObj.setContentHeight('', true);
            expect(rteObj.toolbarModule.getToolbarElement()).not.toBe(null);
        });

        afterAll(() => {
            destroy(rteObj);
        });

    });

    describe('RTE Events', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let keyBoardEvent: any = { preventDefault: () => { }, key: 'A', stopPropagation: () => { }, shiftKey: false, which: 8 };
        beforeAll(() => {
            rteObj = renderRTE({
                value: ''
            });
            elem = rteObj.element;
        });

        it('backspace key press while empty content in editable element', () => {
            rteObj.contentModule.getEditPanel().innerHTML = '';
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.contentModule.getEditPanel().innerHTML !== '').toBe(true);
            expect((rteObj.contentModule.getEditPanel().childNodes[0] as Element).tagName === 'P').toBe(true);
            keyboardEventArgs.ctrlKey = true;
            (rteObj as any).keyUp(keyboardEventArgs);
        });

        it('delete key press while empty content in editable element', () => {
            rteObj.contentModule.getEditPanel().innerHTML = '';
            keyBoardEvent.which = 46;
            (rteObj as any).keyDown(keyBoardEvent);
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.contentModule.getEditPanel().innerHTML !== '').toBe(true);
            expect((rteObj.contentModule.getEditPanel().childNodes[0] as Element).tagName === 'P').toBe(true);
        });

        it('backspace key press while <BR> content in editable element - Firefox', () => {
            rteObj.contentModule.getEditPanel().innerHTML = '<br/>';
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.contentModule.getEditPanel().innerHTML !== '').toBe(true);
            expect((rteObj.contentModule.getEditPanel().childNodes[0] as Element).tagName === 'P').toBe(true);
            keyboardEventArgs.ctrlKey = true;
            (rteObj as any).keyUp(keyboardEventArgs);
        });

        it('delete key press while <BR> content in editable element - Firefox', () => {
            rteObj.contentModule.getEditPanel().innerHTML = '<br/>';
            keyBoardEvent.which = 46;
            (rteObj as any).keyDown(keyBoardEvent);
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.contentModule.getEditPanel().innerHTML !== '').toBe(true);
            expect((rteObj.contentModule.getEditPanel().childNodes[0] as Element).tagName === 'P').toBe(true);
        });

        it('delete key press while <p> with text content in editable element - Firefox', () => {
            rteObj.contentModule.getEditPanel().innerHTML = '<p>test</p>';
            keyBoardEvent.which = 46;
            (rteObj as any).keyDown(keyBoardEvent);
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.contentModule.getEditPanel().innerHTML === '<p>test</p>').toBe(true);
            expect((rteObj.contentModule.getEditPanel().childNodes[0] as Element).tagName === 'P').toBe(true);
        });

        it('backspace key press while <P> content in editable element - Firefox', () => {
            rteObj.contentModule.getEditPanel().innerHTML = '<p></p>';
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.contentModule.getEditPanel().innerHTML === '<p><br></p>').toBe(true);
            expect((rteObj.contentModule.getEditPanel().childNodes[0] as Element).tagName === 'P').toBe(true);
            keyboardEventArgs.ctrlKey = true;
            (rteObj as any).keyUp(keyboardEventArgs);
        });

        it('delete key press while <P> content in editable element - Firefox', () => {
            rteObj.contentModule.getEditPanel().innerHTML = '<p></p>';
            keyBoardEvent.which = 46;
            (rteObj as any).keyDown(keyBoardEvent);
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.contentModule.getEditPanel().innerHTML === '<p><br></p>').toBe(true);
            expect((rteObj.contentModule.getEditPanel().childNodes[0] as Element).tagName === 'P').toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });

    });

    describe('Toolbar - Print Module', () => {
        describe('Print rendering testing', () => {
            let beforeCount: number = 0;
            let afterCount: number = 0;
            let bool: boolean;
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;

            beforeAll(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'Italic', 'Underline', 'Print']
                    },
                    actionComplete: (() => {
                        afterCount++;
                    }),
                    actionBegin: ((args: any) => {
                        bool = args.cancel;
                        beforeCount++;
                    })
                });
                rteEle = rteObj.element;
            });

            it('with cancel is false', () => {
                expect(rteEle.querySelectorAll(".e-toolbar-item")[3].getAttribute("title")).toBe("Print");
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[3];
                trgEle.click();
                expect(beforeCount).toBe(1);
                expect(bool).toBe(false);
                expect(beforeCount).toBe(1);
            });

            afterAll(() => {
                destroy(rteObj);
            });
        });

        describe('Print rendering testing', () => {
            let beforeCount: number = 0;
            let afterCount: number = 0;
            let bool: boolean;
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;

            beforeAll(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'Italic', 'Underline', 'Print']
                    },
                    actionComplete: (() => {
                        afterCount++;
                    }),
                    actionBegin: ((args) => {
                        args.cancel = true;
                        bool = args.cancel;
                        beforeCount++;
                    })
                });
                rteEle = rteObj.element;
            });

            it('with cancel value as true', () => {
                expect(rteEle.querySelectorAll(".e-toolbar-item")[3].getAttribute("title")).toBe("Print");
                let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[3];
                trgEle.click();
                expect(beforeCount).toBe(1);
                expect(bool).toBe(true);
                expect(afterCount).toBe(0);
            });

            afterAll(() => {
                destroy(rteObj);
            });
        });
    });

    describe('actionBegin and actionComplete testing', () => {
        let beforeCount: boolean = false;
        let afterCount: boolean = false;
        let bool: boolean;
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let editNode: HTMLElement;
        let selectNode: Element;
        let curDocument: Document;
        let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: null, which: 64, key: '' };
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'Italic', 'Underline', 'Print']
                },
                value: `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`,
                actionComplete: ((args) => {
                    afterCount = true;
                }),
                actionBegin: ((args: any) => {
                    if (args.originalEvent && args.originalEvent.action == 'paste' && args.originalEvent.pastePrevent) {
                        args.cancel = true;
                    }
                    beforeCount = true;
                })
            });
            rteEle = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLElement;
            curDocument = rteObj.contentModule.getDocument();
        });

        it(' does not trigger the actionBegin and actionComplete while type the character', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.which = 64;
            keyBoardEvent.keyCode = 64;
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(false);
            expect(afterCount).toBe(false);
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in unordered-list', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "unordered-list";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in ordered-list', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "ordered-list";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in undo', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "undo";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in redo', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "redo";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });


        it(' trigger the actionBegin and actionComplete while pressing the action key in copy', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "copy";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in cut', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "cut";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in paste', (done) => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "paste";
            (rteObj as any).keyDown(keyBoardEvent);
            (rteObj as any).onPaste(keyBoardEvent);
            setTimeout(() => {
                expect(beforeCount).toBe(true);
                expect(afterCount).toBe(true);
                afterCount = false;
                beforeCount = false;
                done();
            }, 10);
        });

        it(' trigger the actionBegin and args.cancel for actionComplete while pressing the action key in paste', (done) => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "paste";
            keyBoardEvent.pastePrevent = true;
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect(beforeCount).toBe(true);
                expect(afterCount).toBe(false);
                afterCount = false;
                beforeCount = false;
                done();
            }, 10);
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in bold', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.action = "bold";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' trigger the actionBegin and actionComplete while pressing the action key in italic', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "italic";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' trigger the actionBegin and actionComplete while pressing the action key in underline', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "underline";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' trigger the actionBegin and actionComplete while pressing the action key in strikethrough', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "strikethrough";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' trigger the actionBegin and actionComplete while pressing the action key in uppercase', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "uppercase";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' trigger the actionBegin and actionComplete while pressing the action key in lowercase', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "lowercase";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' trigger the actionBegin and actionComplete while pressing the action key in superscript', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "superscript";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in subscript', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "subscript";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in indents', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "indents";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });


        it(' trigger the actionBegin and actionComplete while pressing the action key in outdents', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "outdents";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in html-source', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "html-source";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in full-screen', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "full-screen";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in justify-center', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "justify-center";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' trigger the actionBegin and actionComplete while pressing the action key in justify-full', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "justify-full";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' trigger the actionBegin and actionComplete while pressing the action key in justify-left', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "justify-left";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' trigger the actionBegin and actionComplete while pressing the action key in justify-right', () => {
            rteObj.value = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
            rteObj.dataBind();
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "justify-right";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });

        it(' EJ2-14543- trigger the actionBegin and actionComplete while pressing the action key in cut', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "cut";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' EJ2-14543- trigger the actionBegin and actionComplete while pressing the action key in copy', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "copy";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(true);
            afterCount = false;
            beforeCount = false;
        });
        it(' EJ2-14543- trigger the actionBegin and actionComplete while pressing the action key in paste', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.action = "paste";
            (rteObj as any).keyDown(keyBoardEvent);
            expect(beforeCount).toBe(true);
            expect(afterCount).toBe(false);
            afterCount = false;
            beforeCount = false;
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('div with inner element', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            elem = document.createElement('div');
            elem.innerHTML = ` <p><b>Description:</b></p>
            <p>The Rich Text Editor (RTE) control is an easy to render in
            client side. Customer easy to edit the contents and get the HTML content for
            the displayed content. A rich text editor control provides users with a toolbar
            that helps them to apply rich text formats to the text entered in the text
            area. </p>
            <p><b>Functional
            Specifications/Requirements:</b></p>
            <ol><li><p>Provide
            the tool bar support, it’s also customizable.</p></li><li><p>Options
            to get the HTML elements with styles.</p></li><li><p>Support
            to insert image from a defined path.</p></li><li><p>Footer
            elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
            the editor support.</p></li><li><p>Provide
            efficient public methods and client side events.</p></li><li><p>Keyboard
            navigation support.</p></li></ol>`;
            elem.id = 'defaultRTE';
            document.body.appendChild(elem);
            rteObj = new RichTextEditor({
                created: function (args: any) {
                    done();
                }
            });
            rteObj.appendTo("#defaultRTE");
        });
        it('value property', () => {
            expect(rteObj.value).not.toBe(null);
        });
        afterAll(() => {
            destroy(rteObj);
            document.body.innerHTML = '';
        });

    });
    describe('RTE text area', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            elem = document.createElement('textarea');
            elem.innerHTML = ` <p><b>Description:</b></p>
            <p>The Rich Text Editor (RTE) control is an easy to render in
            client side. Customer easy to edit the contents and get the HTML content for
            the displayed content. A rich text editor control provides users with a toolbar
            that helps them to apply rich text formats to the text entered in the text
            area. </p>
            <p><b>Functional
            Specifications/Requirements:</b></p>
            <ol><li><p>Provide
            the tool bar support, it’s also customizable.</p></li><li><p>Options
            to get the HTML elements with styles.</p></li><li><p>Support
            to insert image from a defined path.</p></li><li><p>Footer
            elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
            the editor support.</p></li><li><p>Provide
            efficient public methods and client side events.</p></li><li><p>Keyboard
            navigation support.</p></li></ol>`;
            elem.id = 'defaultRTE';
            document.body.appendChild(elem);
            rteObj = new RichTextEditor({
                created: function (args: any) {
                    done();
                }
            });
            rteObj.appendTo("#defaultRTE");
        });

        it('check textarea', () => {
            expect(rteObj.valueContainer).not.toBe(null);
            expect((rteObj.valueContainer as HTMLTextAreaElement).value).not.toBe(null);
            expect(rteObj.valueContainer.style.display).toBe('none');
        });
        it('value property', () => {
            expect(rteObj.value).not.toBe(null);
        });
        afterAll(() => {
            destroy(rteObj);
            document.body.innerHTML = '';
        });

    });
    describe('RTE text area - value property', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            elem = document.createElement('textarea');
            elem.id = 'defaultRTE';
            document.body.appendChild(elem);
            rteObj = new RichTextEditor({
                value: ` <p><b>Description:</b></p>
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>
                <p><b>Functional
                Specifications/Requirements:</b></p>
                <ol><li><p>Provide
                the tool bar support, it’s also customizable.</p></li><li><p>Options
                to get the HTML elements with styles.</p></li><li><p>Support
                to insert image from a defined path.</p></li><li><p>Footer
                elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
                the editor support.</p></li><li><p>Provide
                efficient public methods and client side events.</p></li><li><p>Keyboard
                navigation support.</p></li></ol>`,
                created: function (args: any) {
                    done();
                }
            });
            rteObj.appendTo("#defaultRTE");
        });

        it('check textarea', () => {
            expect(rteObj.valueContainer).not.toBe(null);
            expect((rteObj.valueContainer as HTMLTextAreaElement).value).not.toBe(null);
            expect(rteObj.valueContainer.style.display).toBe('none');
        });
        it('value property', () => {
            expect(rteObj.value).not.toBe(null);
        });
        afterAll(() => {
            destroy(rteObj);
            document.body.innerHTML = '';
        });

    });
    describe('RTE without iframe - value property', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: ` <p><b>Description:</b></p>
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>
                <p><b>Functional
                Specifications/Requirements:</b></p>
                <ol><li><p>Provide
                the tool bar support, it’s also customizable.</p></li><li><p>Options
                to get the HTML elements with styles.</p></li><li><p>Support
                to insert image from a defined path.</p></li><li><p>Footer
                elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
                the editor support.</p></li><li><p>Provide
                efficient public methods and client side events.</p></li><li><p>Keyboard
                navigation support.</p></li></ol>`,
            });
            elem = rteObj.element;
            done();
        });
        it('check textarea', () => {
            expect(rteObj.valueContainer).not.toBe(null);
            expect((rteObj.valueContainer as HTMLTextAreaElement).value).not.toBe(null);
            expect(rteObj.valueContainer.style.display).toBe('none');
        });
        it('value property', () => {
            expect(rteObj.value).not.toBe(null);
        });

        it('getContent public method', () => {
            expect(rteObj.getContent().classList.contains('e-rte-content')).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });

    });
    describe('RTE iframe - value property', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: ` <p><b>Description:</b></p>
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>
                <p><b>Functional
                Specifications/Requirements:</b></p>
                <ol><li><p>Provide
                the tool bar support, it’s also customizable.</p></li><li><p>Options
                to get the HTML elements with styles.</p></li><li><p>Support
                to insert image from a defined path.</p></li><li><p>Footer
                elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
                the editor support.</p></li><li><p>Provide
                efficient public methods and client side events.</p></li><li><p>Keyboard
                navigation support.</p></li></ol>`,
                iframeSettings: {
                    enable: true
                }
            });
            elem = rteObj.element;
            done();
        });
        it('check textarea', () => {
            expect(rteObj.valueContainer).not.toBe(null);
            expect((rteObj.valueContainer as HTMLTextAreaElement).value).not.toBe(null);
            expect(rteObj.valueContainer.style.display).toBe('none');
        });
        it('value property', () => {
            expect(rteObj.value).not.toBe(null);
        });

        it('getContent public method', () => {
            expect(rteObj.getContent().classList.contains('e-rte-content')).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });

    });
    describe('RTE - Public Methods', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                height: '200px',
                width: '400px',
                value: '<p> adsafasdfsd <span> fdsfds </span></p>'
            });
            elem = rteObj.element;
            done();
        });
        it('focus method', () => {
            rteObj.focusIn();
            expect(document.activeElement.classList.contains('e-content')).toBe(true);
            rteObj.focusOut();
        });
        it('focus method in disable state', () => {
            rteObj.enabled = false;
            rteObj.dataBind();
            rteObj.focusIn();
            expect(document.activeElement.classList.contains('e-content')).toBe(false);
            rteObj.enabled = true;
            rteObj.dataBind();
            rteObj.focusIn();
        });

        it('blur method', () => {
            rteObj.focusOut();
            expect(document.activeElement.classList.contains('e-content')).toBe(false);
        });
        it('getHtml method', () => {
            expect(rteObj.getHtml()).toBe('<p> adsafasdfsd <span> fdsfds </span></p>');
        });
        it('refresh method', () => {
            rteObj.refresh();
            expect(rteObj.value).toBe('<p> adsafasdfsd <span> fdsfds </span></p>');
        });
        it('showFullScreen method', () => {
            rteObj.showFullScreen();
            expect(rteObj.element.classList.contains("e-rte-full-screen")).toBe(true);
        });
        it('showSourceCode method', () => {
            rteObj.showSourceCode();
            let ele: HTMLTextAreaElement = rteObj.element.querySelector('.e-rte-srctextarea');
            expect(ele.value).toBe('<p> adsafasdfsd <span> fdsfds </span></p>');
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe("enable/disable ToolbarItem public method testing", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;

        beforeEach(() => {
            rteObj = renderRTE({});
            rteEle = rteObj.element;
            rteObj.enableToolbarItem(["Italic", "Bold"]);
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("Single item with disable and enable ToolbarItem method testing", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(false);
            rteObj.disableToolbarItem("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(true);
            rteObj.enableToolbarItem("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(false);
        });

        it("Array of item with disable and enable ToolbarItem method testing", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(false);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].classList.contains("e-overlay")).toBe(false);
            rteObj.disableToolbarItem(["Bold", "Italic"]);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].classList.contains("e-overlay")).toBe(true);
            rteObj.enableToolbarItem(["Bold", "Italic"]);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(false);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].classList.contains("e-overlay")).toBe(false);
        });

        it("Different order of array of item with disable and enable ToolbarItem method testing", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(false);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].classList.contains("e-overlay")).toBe(false);
            rteObj.disableToolbarItem(["Italic", "Bold"]);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].classList.contains("e-overlay")).toBe(true);
            rteObj.enableToolbarItem(["Italic", "Bold"]);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].classList.contains("e-overlay")).toBe(false);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].classList.contains("e-overlay")).toBe(false);
        });
    });

    describe("removeToolbarItem public method testing", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;

        beforeEach(() => {
            rteObj = renderRTE({});
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("Single item with disable and enable ToolbarItem method testing", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Bold") > 0).toBe(true);
            rteObj.removeToolbarItem("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Italic") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].firstElementChild.id.indexOf("Underline") > 0).toBe(true);
        });

        it("Array of item with disable and enable ToolbarItem method testing", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Bold") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].firstElementChild.id.indexOf("Italic") > 0).toBe(true);
            rteObj.removeToolbarItem(["Bold", "Italic"]);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Bold") > 0).not.toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].firstElementChild).toBe(null);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Underline") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].classList.contains("e-separator")).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[2].firstElementChild.id.indexOf("Formats") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[3].firstElementChild.id.indexOf("Alignments") > 0).toBe(true);
        });

        it("Different order with array of item with disable and enable ToolbarItem method testing", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Bold") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].firstElementChild.id.indexOf("Italic") > 0).toBe(true);
            rteObj.removeToolbarItem(["Undo", "Italic"]);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[2].classList.contains("e-separator")).toBe(true);
        });
    });

    describe("Toolbar module addTBarItem private method testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;

        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Bold"]
                }
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("addTBarItem method testing with text as empty string", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(1);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Bold") > 0).toBe(true);
            rteObj.toolbarModule.addTBarItem({ updateItem: 'Undo', targetItem: 'Undo', baseToolbar: rteObj.getBaseToolbarObject() }, 0);
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-tbar-btn-text").length).toBe(0);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Undo") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].firstElementChild.id.indexOf("Bold") > 0).toBe(true);
        });
    });
    describe('RTE Properties', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                height: '200px',
                width: '400px',
                readonly: true,
                cssClass: 'myClass',
                enableRtl: true,
                placeholder: 'type something',
                locale: 'de-DE'
            });
            elem = rteObj.element;
            done();
        });
        it('Ensure Width property', () => {
            expect(rteObj.element.style.width).toBe('400px');
        });
        it('Ensure height property', () => {
            expect(rteObj.element.style.height).toBe('200px');
        });
        it('through onproperty change widht property', () => {
            rteObj.width = '600px';
            rteObj.dataBind();
            expect(rteObj.element.style.width).toBe('600px');
        });
        it('through onproperty change height property', () => {
            rteObj.height = '600px';
            rteObj.dataBind();
            expect(rteObj.element.style.height).toBe('600px');
            let toolWrap: HTMLElement = rteObj.element.querySelector('#' + rteObj.element.id + '_toolbar_wrapper');
            let view: HTMLElement = rteObj.element.querySelector('#' + rteObj.element.id + 'rte-view');
            expect(toolWrap.style.height === '21px').toBe(true);
            expect(view.style.height === '579px').toBe(true);
        });
        it('Ensure readonly property', () => {
            let contentEle: HTMLElement = rteObj.element.querySelector(".e-content");
            expect(contentEle.getAttribute('contenteditable')).toBe('false');
            expect(rteObj.element.classList.contains('e-rte-readonly')).toBe(true);
        });
        it('through onproperty change readOnly property', () => {
            rteObj.readonly = false;
            rteObj.dataBind();
            let contentEle: HTMLElement = rteObj.element.querySelector(".e-content");
            expect(contentEle.getAttribute('contenteditable')).toBe('true');
        });
        it('Ensure cssClass property', () => {
            expect(rteObj.element.classList.contains('myClass')).toBe(true);
        });
        it('through onproperty change cssClass property', () => {
            rteObj.cssClass = 'textClass';
            rteObj.dataBind();
            expect(rteObj.element.classList.contains('textClass')).toBe(true);
            expect(rteObj.element.classList.contains('myClass')).toBe(false);
        });
        it('Ensure enabled property', () => {
            expect(rteObj.element.classList.contains('e-disabled')).toBe(false);
        });
        it('through onproperty change enabled property', () => {
            rteObj.enabled = false;
            rteObj.dataBind();
            expect(rteObj.element.classList.contains('e-disabled')).toBe(true);
            expect(rteObj.element.classList.contains('e-rte-readonly')).not.toBe(true);
        });
        it('Ensure enableRTL property', () => {
            expect(rteObj.element.classList.contains('e-rtl')).toBe(true);
        });
        it('ensure through onproperty change - enableRTL', () => {
            rteObj.enableRtl = false;
            rteObj.dataBind();
            expect(rteObj.element.classList.contains('e-rtl')).toBe(false);
        });
        it('Ensure Locale property', () => {
            let rteEle: HTMLElement = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("fett");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("kursiv");
        });
        it('ensure through onproperty change - Locale property', () => {
            rteObj.locale = 'en-US';
            rteObj.dataBind();
            let rteEle: HTMLElement = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Italic");
        });
        it('Ensure placeholder property', () => {
            expect((rteObj as any).placeHolderWrapper.style.display).toBe('block');
            expect((rteObj as any).placeHolderWrapper.innerText).toBe('type something');
        });
        it('ensure through onproperty change - placeholder', () => {
            rteObj.placeholder = 'changed';
            rteObj.value = '<p> jadskfasfese <p>';
            rteObj.dataBind();
            expect((rteObj as any).placeHolderWrapper.style.display).toBe('none');
            expect((rteObj as any).placeHolderWrapper.innerText).toBe('changed');
        });
        it('ensure through onproperty change - value', () => {
            rteObj.placeholder = 'changed';
            rteObj.value = null;
            rteObj.dataBind();
            expect((rteObj as any).value === null).toBe(true);
            expect((rteObj as any).valueContainer.value === '').toBe(true);
            expect((rteObj as any).placeHolderWrapper.style.display).toBe('block');
            expect((rteObj as any).placeHolderWrapper.innerText).toBe('changed');
        });
        it('ensure through onproperty change - value', () => {
            destroy(rteObj);
            rteObj = renderRTE({
                height: '200px',
                width: '400px',
                readonly: true,
                cssClass: 'myClass',
                enableRtl: true,
                placeholder: 'type something',
                locale: 'de-DE',
                value: '<p>test</p>'
            });
            elem = rteObj.element;
            expect((rteObj as any).placeHolderWrapper.style.display).toBe('none');
            expect((rteObj as any).placeHolderWrapper.innerText).toBe('type something');
            rteObj.placeholder = 'changed';
            rteObj.value = null;
            rteObj.dataBind();
            expect((rteObj as any).value === null).toBe(true);
            expect((rteObj as any).valueContainer.value === '').toBe(true);
            expect((rteObj as any).placeHolderWrapper.style.display).toBe('block');
            expect((rteObj as any).placeHolderWrapper.innerText).toBe('changed');
        });
        it('ensure through onproperty change - valueTemplate', () => {
            destroy(rteObj);
            rteObj = renderRTE({
                height: '200px',
                width: '400px',
                readonly: true,
                cssClass: 'myClass',
                enableRtl: true,
                placeholder: 'type something',
                locale: 'de-DE',
                valueTemplate: '<p>test</p>'
            });
            elem = rteObj.element;
            expect((rteObj as any).placeHolderWrapper.style.display).toBe('none');
            expect((rteObj as any).placeHolderWrapper.innerText).toBe('type something');
            rteObj.placeholder = 'changed';
            rteObj.value = null;
            rteObj.dataBind();
            expect((rteObj as any).value === null).toBe(true);
            expect((rteObj as any).valueContainer.value === '').toBe(true);
            expect((rteObj as any).placeHolderWrapper.style.display).toBe('block');
            expect((rteObj as any).placeHolderWrapper.innerText).toBe('changed');
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('RTE enablePersistence Properties', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: ` <p><b>Description:</b></p>
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>
                <p><b>Functional
                Specifications/Requirements:</b></p>
                <ol><li><p>Provide
                the tool bar support, it’s also customizable.</p></li><li><p>Options
                to get the HTML elements with styles.</p></li><li><p>Support
                to insert image from a defined path.</p></li><li><p>Footer
                elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
                the editor support.</p></li><li><p>Provide
                efficient public methods and client side events.</p></li><li><p>Keyboard
                navigation support.</p></li></ol>`,
            });
            elem = rteObj.element;
            done();
        });
        it('Ensure enablePersistence property', () => {
            rteObj.refresh();
            expect(rteObj.value).not.toBe(null);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('RTE htmlAttributes Properties', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            elem = document.createElement('div');
            elem.id = 'defaultRTE';
            document.body.appendChild(elem);
            rteObj = new RichTextEditor({
                width: 'auto',
                value: ` <p><b>Description:</b></p>
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>
                <p><b>Functional
                Specifications/Requirements:</b></p>
                <ol><li><p>Provide
                the tool bar support, it’s also customizable.</p></li><li><p>Options
                to get the HTML elements with styles.</p></li><li><p>Support
                to insert image from a defined path.</p></li><li><p>Footer
                elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
                the editor support.</p></li><li><p>Provide
                efficient public methods and client side events.</p></li><li><p>Keyboard
                navigation support.</p></li></ol>`,
                created: function (args: any) {
                    done();
                },
                htmlAttributes: {
                    class: 'myClass', title: 'RTE', disabled: 'disabled',
                    placeholder: 'typesomething', readonly: 'readonly', style: 'width:200px', name: 'rte-sample'
                },
            });
            rteObj.appendTo("#defaultRTE");
        });
        it('Ensure htmlAttributes property', () => {
            expect(rteObj.element.classList.contains('myClass')).toBe(true);
            expect(rteObj.element.title).toBe('RTE');
        });
        it('ensure through onproperty change - htmlAttributes', () => {
            rteObj.htmlAttributes = { class: 'e-testing' };
            rteObj.dataBind();
            expect(rteObj.element.classList.contains('e-testing')).toBe(true);
            expect(rteObj.element.title).toBe('RTE');
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('RTE IFRame htmlAttributes Properties', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let iframe: HTMLDocument;
        let iframeHeader: HTMLHeadElement;
        let iframeBody: HTMLBodyElement;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true,
                    attributes: {
                        class: 'myClass', title: 'RTE', disabled: 'disabled',
                        placeholder: 'typesomething', readonly: 'readonly', style: 'width:200px', name: 'rte-sample'
                    },
                    resources: {
                        scripts: ['../mytext.js'],
                        styles: ['../myText.css']
                    }
                }
            });
            done();
        });
        it('Ensure IFrame htmlAttributes property', () => {
            elem = rteObj.element;
            iframe = rteObj.contentModule.getDocument() as HTMLDocument;
            iframeBody = iframe.querySelector('body');
            expect(iframeBody.classList.contains('myClass')).toBe(true);
            expect(iframeBody.title).toBe('RTE');
        });
        it('Iframe resource', () => {
            elem = rteObj.element;
            iframe = rteObj.contentModule.getDocument() as HTMLDocument;
            iframeHeader = iframe.querySelector('head');
            let scriptSheet: HTMLScriptElement = iframeHeader.querySelector('script');
            expect(scriptSheet.src.search('mytext.js')).not.toBe(-1);
            let styleSheet: HTMLLinkElement = iframeHeader.querySelector('link');
            expect(styleSheet.href.search('myText.css')).not.toBe(-1);

        });
        it('Iframe resource - onproperty change', () => {
            rteObj.iframeSettings = {
                attributes: {
                    class: 'myClass2'
                },
                resources: {
                    scripts: ['../mytext1.js'],
                    styles: ['../myText2.css']
                }
            };
            rteObj.dataBind();
            iframe = rteObj.contentModule.getDocument() as HTMLDocument;
            iframeHeader = iframe.querySelector('head');
            let scriptSheet: HTMLScriptElement = iframeHeader.querySelector('script');
            expect(scriptSheet.src.search('mytext1.js')).not.toBe(-1);
            iframeBody = iframe.querySelector('body');
            expect(iframeBody.classList.contains('myClass2')).toBe(true);

        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    function setCursorPoint(curDocument: Document, element: Element, point: number) {
        let range: Range = curDocument.createRange();
        let sel: Selection = curDocument.defaultView.getSelection();
        range.setStart(element, point);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }
    describe('RTE shortcut key - HTML', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let selectNode: Element;
        let editNode: HTMLElement;
        let curDocument: Document;
        let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: '', which: 8 };
        let innerHTML: string = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
        beforeAll(() => {
            rteObj = renderRTE({ height: 200 });
            elem = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLElement;
            curDocument = rteObj.contentModule.getDocument();
            editNode.innerHTML = innerHTML;
        });

        it('insert-image: ctrl+shift+i', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'insert-image';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(rteObj.imageModule.dialogObj).not.toBeNull();
            keyBoardEvent.action = 'escape';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(rteObj.imageModule.dialogObj).toBeNull();
        });
        it('insert-link: ctrl+k', () => {
            editNode.innerHTML = innerHTML;
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'insert-link';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((rteObj.linkModule as any).dialogObj).not.toBeNull();
            keyBoardEvent.action = 'escape';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((rteObj.linkModule as any).dialogObj).toBeNull();
        });

        it('indents: ctrl+]', () => {
            editNode.innerHTML = innerHTML;
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'indents';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((selectNode as HTMLElement).style.marginLeft === '20px').toBe(true);
        });

        it('outdents: ctrl+[', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'outdents';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((selectNode as HTMLElement).style.marginLeft === '0px').toBe(true);
        });

        it('full-screen: ctrl+shift+f', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'full-screen';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(rteObj.element.classList.contains('e-rte-full-screen')).toBe(true);
            keyBoardEvent.action = 'escape';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(rteObj.element.classList.contains('e-rte-full-screen')).toBe(false);
        });

        it('justify-center: ctrl+e', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'justify-center';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((selectNode as HTMLElement).style.textAlign === 'center').toBe(true);
        });

        it('justify-full: ctrl+j', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'justify-full';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((selectNode as HTMLElement).style.textAlign === 'justify').toBe(true);
        });

        it('justify-left: ctrl+l', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'justify-left';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((selectNode as HTMLElement).style.textAlign === 'left').toBe(true);
        });
        it('justify-right: ctrl+r', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'justify-right';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((selectNode as HTMLElement).style.textAlign === 'right').toBe(true);
        });
        it('clear-format: ctrl+shift+r', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, selectNode.childNodes[0], selectNode.childNodes[0], 0, 4); keyBoardEvent.action = 'bold';
            (rteObj as any).keyDown(keyBoardEvent);
            selectNode = editNode.querySelector('.first-p');
            expect(!isNullOrUndefined(selectNode.querySelector('strong'))).toBe(true);
            selectNode = editNode.querySelector('.first-p');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, selectNode.childNodes[0], selectNode.childNodes[1], 0, 4);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'clear-format';
            (rteObj as any).keyDown(keyBoardEvent);
            selectNode = editNode.querySelector('.first-p');
            expect(isNullOrUndefined(selectNode.querySelector('strong'))).toBe(true);
        });

        it('ordered-list: ctrl+shift+o', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'ordered-list';
            (rteObj as any).keyDown(keyBoardEvent);
            selectNode = editNode.querySelector('.first-p');
            expect((selectNode as HTMLElement).tagName === 'OL').toBe(true);
        });

        it('unordered-list: ctrl+alt+o', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'unordered-list';
            (rteObj as any).keyDown(keyBoardEvent);
            selectNode = editNode.querySelector('.first-p');
            expect((selectNode as HTMLElement).tagName === 'UL').toBe(true);
        });

        it('html-source: ctrl+shift+h - Preview mode', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(curDocument, selectNode, 0);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'html-source';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(!isNullOrUndefined(rteObj.element.querySelector('.e-content'))).toBe(true);
        });

        it('html-source: ctrl+shift+h - Normal', () => {
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'html-source';
            (rteObj.sourceCodeModule as any).previewKeyDown(keyBoardEvent);
            expect(!isNullOrUndefined(rteObj.element.querySelector('.e-content'))).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });

    });

    describe('RTE shortcut key - Markdown', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let editNode: HTMLTextAreaElement;
        let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: '', which: 8 };
        let innerHTML: string = `# Lists are a piece of cake
        They even auto continue as you type
        A double enter will end them
        Tabs and shift-tabs work too`;
        beforeAll(() => {
            rteObj = renderRTE({ editorMode: 'Markdown' });
            elem = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLTextAreaElement;
            editNode.value = innerHTML;
        });

        it('insert-image: ctrl+shift+i', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'insert-image';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(rteObj.imageModule.dialogObj).not.toBeNull();
            keyBoardEvent.action = 'escape';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(rteObj.imageModule.dialogObj).toBeNull();
        });

        it('insert-link: ctrl+k', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'insert-link';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((rteObj.linkModule as any).dialogObj).not.toBeNull();
            keyBoardEvent.action = 'escape';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((rteObj.linkModule as any).dialogObj).toBeNull();
        });

        it('bold: ctrl+b', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'bold';
            (rteObj as any).keyDown(keyBoardEvent);
            let line = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(/^(\*\*)/gim.test(line)).toBe(true);
        });

        it('italic: ctrl+i', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'italic';
            (rteObj as any).keyDown(keyBoardEvent);
            let line = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(/^(\*)/gim.test(line)).toBe(true);
        });
        it('strikethrough: ctrl+shift+s', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'strikethrough';
            (rteObj as any).keyDown(keyBoardEvent);
            let line = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(/^(\~\~)/gim.test(line)).toBe(true);
        });

        it('uppercase: ctrl+shift+u', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let prev = rteObj.formatter.editorManager.markdownSelection.getSelectedText(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'uppercase';
            (rteObj as any).keyDown(keyBoardEvent);
            let current = rteObj.formatter.editorManager.markdownSelection.getSelectedText(editNode);
            expect(prev !== current).toBe(true);
        });
        it('lowercase: ctrl+shift+l', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let prev = rteObj.formatter.editorManager.markdownSelection.getSelectedText(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'lowercase';
            (rteObj as any).keyDown(keyBoardEvent);
            let current = rteObj.formatter.editorManager.markdownSelection.getSelectedText(editNode);
            expect(prev !== current).toBe(true);
        });

        it('full-screen: ctrl+shift+f', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'full-screen';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(rteObj.element.classList.contains('e-rte-full-screen')).toBe(true);
            keyBoardEvent.action = 'escape';
            (rteObj as any).keyDown(keyBoardEvent);
            expect(rteObj.element.classList.contains('e-rte-full-screen')).toBe(false);
        });

        it('ordered-list: ctrl+shift+o', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'ordered-list';
            (rteObj as any).keyDown(keyBoardEvent);
            let line = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(new RegExp('^(1. )', 'gim').test(line)).toBe(true);
        });
        it('unordered-list: ctrl+alt+o', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'unordered-list';
            (rteObj as any).keyDown(keyBoardEvent);
            let line = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(/^(- )/gim.test(line)).toBe(true);
        });
        it('superscript: ctrl+shift+=', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = true;
            keyBoardEvent.action = 'superscript';
            (rteObj as any).keyDown(keyBoardEvent);
            let line = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(/^(<sup>)/gim.test(line)).toBe(true);
        });
        it('subscript: ctrl+=', () => {
            editNode.value = innerHTML;
            rteObj.formatter.editorManager.markdownSelection.save(0, 5);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            keyBoardEvent.ctrlKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'subscript';
            (rteObj as any).keyDown(keyBoardEvent);
            let line = rteObj.formatter.editorManager.markdownSelection.getSelectedLine(editNode);
            expect(/^(<sub>)/gim.test(line)).toBe(true);
        });
        it('selectAll & getSelection public method', () => {
            editNode.value = innerHTML;
            rteObj.selectAll();
            let selection: string = rteObj.getSelection();
            expect(selection.length).toBe((rteObj.contentModule.getEditPanel() as HTMLTextAreaElement).value.length);
        });
        afterAll(() => {
            destroy(rteObj);
        });

    });
    describe('RTE Change Events', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let change: boolean = false;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: 'testing',
                change: function (args: any) {
                    change = true;
                    expect(change).toBe(true);
                    expect(rteObj.value).toBe('changed');
                }
            });
            elem = rteObj.element;
            done();
        });
        it('Ensure Width property', () => {
            expect(rteObj.value).toBe('testing');
            rteObj.value = 'changed';
            rteObj.dataBind();
        });
    });

    describe(' valueTemplate property', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            elem = document.createElement('div');
            let innerHTML = ` <p><b>Description:</b></p>
            <p>The Rich Text Editor (RTE) control is an easy to render in
            client side. Customer easy to edit the contents and get the HTML content for
            the displayed content. A rich text editor control provides users with a toolbar
            that helps them to apply rich text formats to the text entered in the text
            area. </p>
            <p><b>Functional
            Specifications/Requirements:</b></p>
            <ol><li><p>Provide
            the tool bar support, it’s also customizable.</p></li><li><p>Options
            to get the HTML elements with styles.</p></li><li><p>Support
            to insert image from a defined path.</p></li><li><p>Footer
            elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
            the editor support.</p></li><li><p>Provide
            efficient public methods and client side events.</p></li><li><p>Keyboard
            navigation support.</p></li></ol>`;
            elem.id = 'defaultRTE';
            document.body.appendChild(elem);
            rteObj = new RichTextEditor({
                valueTemplate: innerHTML
            });
            rteObj.appendTo("#defaultRTE");
            done();
        });
        it(' check value property', () => {
            expect(rteObj.value).not.toBe(null);
        });

        afterAll(() => {
            destroy(rteObj);
            document.body.innerHTML = '';
        });
    });

    describe(' Markdown properties', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            elem = document.createElement('div');
            elem.id = 'defaultRTE';
            document.body.appendChild(elem);
            rteObj = new RichTextEditor({
                editorMode: 'Markdown',
                value: 'Test'
            });
            rteObj.appendTo("#defaultRTE");
            done();
        });
        it(' check value property', () => {
            expect(rteObj.value).not.toBe(null);
        });
        it(' change the value property', () => {
            rteObj.value = "Updated";
            rteObj.dataBind();
            expect((rteObj as any).inputElement.value === 'Updated').toBe(true);
        });
        it(' change the value property as null', () => {
            rteObj.value = null;
            rteObj.dataBind();
            expect((rteObj as any).inputElement.value === '').toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
            document.body.innerHTML = '';
        });
    });
});
describe(' Image selection prevent - msie ', () => {
    let rteObj: RichTextEditor;
    let rteEle: Element;
    let mouseEventArgs: any;
    let curDocument: Document;
    let editNode: Element;
    let selectNode: HTMLElement;

    let innerHTML: string = `<p>First p node-0</p><p>First p node-1</p>

    <p class='first-p-node'>dom node<label class='first-label'>label node</label></p>
            
    <p class='second-p-node'><label class='second-label'>label node</label></p>
    <ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>
    <img id="rteimg" width="10" height="10" src=" ">`;

    beforeAll(() => {
        Browser.info.name = 'msie';
        rteObj = renderRTE({});
        rteEle = rteObj.element;
        editNode = rteObj.contentModule.getEditPanel();
        rteObj.contentModule.getEditPanel().innerHTML = innerHTML;
        curDocument = rteObj.contentModule.getDocument();
    });
    it("Image element resize prevent in msie", () => {
        selectNode = editNode.querySelector('#rteimg') as HTMLElement;
        selectNode.click();
        expect(selectNode.nodeName.toLocaleLowerCase()).toBe('img');
    });
    afterAll(() => {
        destroy(rteObj);
        detach(rteEle);
    });
});
describe(' Image selection prevent - mozilla ', () => {
    let rteObj: RichTextEditor;
    let rteEle: Element;
    let mouseEventArgs: any;
    let curDocument: Document;
    let editNode: Element;
    let selectNode: HTMLElement;

    let innerHTML: string = `<p>First p node-0</p><p>First p node-1</p>

    <p class='first-p-node'>dom node<label class='first-label'>label node</label></p>
            
    <p class='second-p-node'><label class='second-label'>label node</label></p>
    <ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>
    <img id="rteimg" width="10" height="10" src=" ">`;

    beforeAll(() => {
        Browser.userAgent = 'mozilla/5.0 (windows nt 10.0; win64; x64; rv:60.0) gecko/20100101 firefox/60.0';
        rteObj = renderRTE({});
        rteEle = rteObj.element;
        editNode = rteObj.contentModule.getEditPanel();
        rteObj.contentModule.getEditPanel().innerHTML = innerHTML;
        curDocument = rteObj.contentModule.getDocument();
    });
    it("Image element resize prevent in mozilla", () => {
        selectNode = editNode.querySelector('#rteimg') as HTMLElement;
        selectNode.click();
        expect(selectNode.nodeName.toLocaleLowerCase()).toBe('img');
        expect(Browser.info.name).toBe('mozilla');
    });
    afterAll(() => {
        destroy(rteObj);
        detach(rteEle);
    });
});

describe("RTE ExecuteCommand public method testing", () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    beforeAll(() => {
        rteObj = renderRTE({
            value: '<p id="pnode1">Sample</p>' +
                '<p id="pnode4">Sample</p>' +
                '<p id="pnode2">Sample</p>' +
                '<p id="pnode3">Sample</p>'
        });
        rteEle = rteObj.element;
    });

    afterAll(() => {
        destroy(rteObj);
    });
    it('check bold Executecommand public method', () => {
        let nodeSelection: NodeSelection = new NodeSelection();
        let node: HTMLElement = document.getElementById("pnode1");
        nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 1, 1);
        rteObj.executeCommand('bold');
        expect(node.childNodes[0].nodeName.toLocaleLowerCase()).toBe('strong');
    });
    it('check insertHtml Executecommand public method', () => {
        let nodeSelection: NodeSelection = new NodeSelection();
        let node: HTMLElement = document.getElementById("pnode2");
        nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 1, 1);
        let span: HTMLElement = document.createElement('span');
        span.id = "spannode1";
        span.innerHTML = "ABC";
        rteObj.executeCommand('insertHTML', span);
        expect(node.childNodes[1].nodeName.toLocaleLowerCase()).toBe('span');
    });
    it('check OL Executecommand public method', () => {
        let nodeSelection: NodeSelection = new NodeSelection();
        let node: HTMLElement = document.getElementById("pnode3");
        nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 1, 1);
        rteObj.executeCommand('insertOrderedList');
        expect(document.getElementById("pnode2").nextSibling.nodeName.toLocaleLowerCase()).toBe('ol');
    });
    it('check Font color Executecommand public method', () => {
        let nodeSelection: NodeSelection = new NodeSelection();
        let node: HTMLElement = document.getElementById("pnode4");
        nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 1, 1);
        rteObj.executeCommand('fontColor', 'rgb(102, 102, 0)');
        expect(node.childNodes[0].nodeName.toLocaleLowerCase()).toBe('span');
        expect((node.childNodes[0] as HTMLElement).style.color).toBe('rgb(102, 102, 0)');
    });
});

describe("RTE content remove issue", () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    let keyBoardEvent: any = { preventDefault: () => { }, key: 'A', stopPropagation: () => { }, shiftKey: false, which: 8 };
    beforeAll(() => {
        rteObj = renderRTE({
            value: '<p id="pnode1"><br></p>' +
                '<p id="pnode2"><br></p>' +
                '<p id="pnode4">Sample</p>' +
                '<p id="pnode3">Sample</p>'
        });
        rteEle = rteObj.element;
    });

    afterAll(() => {
        destroy(rteObj);
    });
    it('check empty content issue', () => {
        let nodeSelection: NodeSelection = new NodeSelection();
        let node: HTMLElement = document.getElementById("pnode4");
        nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 0);
        (rteObj as any).keyUp(keyBoardEvent);
        expect(rteObj.contentModule.getEditPanel().textContent !== '').toBe(true);
    });
});


describe('RTE Placeholder DIV', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['SourceCode']
            },
            value: `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`,
            placeholder: 'Type something'
        });
        rteEle = rteObj.element;
        done();
    });
    it("Ensuring placeholder property", () => {
        expect((rteObj as any).placeHolderWrapper.style.display).toBe('none');
        rteObj.value = ``;
        rteObj.dataBind();
        expect((rteObj as any).placeHolderWrapper.style.display).toBe('block');
        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
        trgEle.click();
        expect((rteObj as any).placeHolderWrapper.style.display).toBe('none');
        trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
        trgEle.click();
        expect((rteObj as any).placeHolderWrapper.style.display).toBe('block');
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('RTE Form reset', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    let element: HTMLElement;
    beforeAll((done: Function) => {
        element = createElement('form', {
            id: "form-element", innerHTML:
                ` <div class="form-group">
                <textarea id="defaultRTE" name="defaultRTE" required maxlength="100" minlength="20" data-msg-containerid="dateError">
                </textarea>
                <div id="dateError"></div>
            </div>
            <div class="row">
                <div style="width: 320px;margin:0px auto;height: 100px;padding-top: 25px;">
                    <div style="display: inline-block;">
                        <button id="validateSubmit" class="samplebtn e-control e-btn e-primary" type="submit" style="height:40px;width: 150px;" data-ripple="true">Submit</button>
                    </div>
                    <div style="float: right;">
                        <button id="resetbtn" class="samplebtn e-control e-btn" type="reset" style="height:40px;width: 150px;" data-ripple="true">Clear</button>
                    </div>
                </div>
            </div>` });
        document.body.appendChild(element);
        rteObj = new RichTextEditor({
            value: `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`,
            placeholder: 'Type something'
        });
        rteObj.appendTo('#defaultRTE');
        let formObject: FormValidator = new FormValidator('#form-element');
        rteEle = rteObj.element;
        done();
    });
    it(" Clear the value property while click on reset button", () => {
        expect(rteObj.value !== null).toBe(true);
        document.getElementById('resetbtn').click();
        expect(rteObj.value === null).toBe(true);
    });
    afterAll(() => {
        rteObj.destroy();
        detach(element);
    });
});

describe('EJ2-13507: RTE ng feature matrix - Markdown two way binding is not working', () => {
    let rteObj: RichTextEditor;
    let innerHTML: string = `Markdown content`;
    beforeAll(() => {
        rteObj = renderRTE({ editorMode: 'Markdown', value: innerHTML });
    });

    it(' update the value through onPropertyChange', () => {
        expect((rteObj as any).inputElement.value === innerHTML).toBe(true);
        rteObj.value = 'Markdown content updated';
        rteObj.dataBind();
        expect((rteObj as any).inputElement.value !== innerHTML).toBe(true);
        expect((rteObj as any).inputElement.value === 'Markdown content updated').toBe(true);
    });
    afterAll(() => {
        destroy(rteObj);
    });
    describe('EJ2-14075: getText public method html mode', () => {
        let rteObj: RichTextEditor;
        let innerHTML: string = `<p><b>Description:</b></p>`;
        beforeAll(() => {
            rteObj = renderRTE({ value: innerHTML });
        });

        it(' check getText', () => {
            expect(rteObj.getText() === 'Description:').toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('EJ2-14075: getText public method html mode with iframe', () => {
        let rteObj: RichTextEditor;
        let innerHTML: string = `<p><b>Description:</b></p>`;
        beforeAll(() => {
            rteObj = renderRTE({ iframeSettings: { enable: true }, value: innerHTML });
        });

        it(' check getText', () => {
            expect(rteObj.getText() === 'Description:').toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('EJ2-14075: getText public method markdown mode', () => {
        let rteObj: RichTextEditor;
        let innerHTML: string = `Markdown content`;
        beforeAll(() => {
            rteObj = renderRTE({ editorMode: 'Markdown', value: innerHTML });
        });

        it(' check getText', () => {
            expect(rteObj.getText() === innerHTML).toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-13504 - Key board action RequestType ', () => {
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9, key: 'Tab' };
        let innerHTMLStr: string = `<p>First p node-0</p><p>First p node-1</p>

<p class='first-p-node'>dom node<label class='first-label'>label node</label></p>

<p class='second-p-node'><label class='second-label'>label node</label></p>
<p class='third-p-node'>dom node<label class='third-label'>label node</label></p>
<ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>`;
        let rteObj: RichTextEditor;
        let curDocument: Document;
        let editNode: Element;
        let rteEle: Element;
        let selectNode: Element;
        let actionBegin: string;
        let actionComplete: string;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['|', 'Formats', '|', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|', 'Indent', 'Outdent', '|',
                        'FontName']
                },
                value: innerHTMLStr,
                actionComplete: (e): void => {
                    actionComplete = e.requestType;
                },
                actionBegin: (e): void => {
                    actionBegin = e.requestType;
                }
            });
            rteEle = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel();
            curDocument = rteObj.contentModule.getDocument();
        });
        afterAll(() => {
            destroy(rteObj);
            detach(rteEle);
        });
        it(' tab key navigation from second li start point', () => {
            selectNode = editNode.querySelector('.ul-third-node');
            expect(selectNode.querySelector('ul')).toBeNull();
            setCursorPoint(curDocument, selectNode.childNodes[2] as Element, 0);
            (rteObj as any).keyDown(keyBoardEvent);
            expect(actionComplete === 'UL').toBe(true);
            expect(actionBegin === 'TabKey').toBe(true);
        });
    });
});

describe('EJ2-15017 - Toolbar refresh', () => {
    let rteObj: RichTextEditor;
    let elem: HTMLElement;
    beforeAll((done: Function) => {
        elem = document.createElement('div');
        elem.innerHTML = ` <p><b>Description:</b></p>
            <p>The Rich Text Editor (RTE) control is an easy to render in
            client side. Customer easy to edit the contents and get the HTML content for
            the displayed content. A rich text editor control provides users with a toolbar
            that helps them to apply rich text formats to the text entered in the text
            area. </p>`;
        elem.id = 'defaultRTE';
        elem.style.display = 'none';
        document.body.appendChild(elem);
        rteObj = new RichTextEditor({
            width: 200,
        });
        rteObj.appendTo("#defaultRTE");
        done();
    });
    it(' Set the display block to component and refresh the component', () => {
        rteObj.element.style.display = 'block';
        rteObj.refresh();
        let toolWrap: HTMLElement = rteObj.element.querySelector('#defaultRTE_toolbar_wrapper');
        expect(toolWrap.style.height).toBe("21px");
    });
    afterAll(() => {
        destroy(rteObj);
        document.body.innerHTML = '';
    });
});