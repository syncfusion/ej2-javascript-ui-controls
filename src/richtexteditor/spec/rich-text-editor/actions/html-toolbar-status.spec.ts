/**
 * Content renderer spec
 */
import { detach } from '@syncfusion/ej2-base';
import { RichTextEditor, Toolbar } from './../../../src/index';
import { dispatchEvent } from './../../../src/rich-text-editor/base/util';
import { NodeSelection } from '../../../src/selection/selection';
import { QuickToolbar, MarkdownEditor, HtmlEditor } from "../../../src/rich-text-editor/index";

RichTextEditor.Inject(MarkdownEditor);
RichTextEditor.Inject(HtmlEditor);

RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(QuickToolbar);

import { renderRTE, destroy } from "./../render.spec";


describe(' HTML editor update toolbar ', () => {
    let rteObj: RichTextEditor;
    let curDocument: Document;
    let editNode: HTMLDivElement;
    let rteEle: Element;
    let domSelection: NodeSelection = new NodeSelection();
    let innervalue: string = '<div id="div1"><p id="paragraph1"><b>Description:</b></p>' +
        '<p id="paragraph2">The Rich Text Editor (RTE) control is an easy to render in' +
        'client side. Customer easy to edit the contents and get the HTML content for' +
        'the displayed content. A rich text editor control provides users with a toolbar' +
        'that helps them to apply rich text formats to the text entered in the text' +
        'area. </p>' +
        '<p id="paragraph3"><b>Functional' +
        'Specifications/Requirements:</b></p>' +
        '<strong id="bold31">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</strong>' +
        '<em id="italic31">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</em>' +
        '<u id="underline31">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</u>' +
        '<del id="strike31">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</del>' +
        '<sup id="sup31">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</sup>' +
        '<sub id="sub31">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</sub>' +
        '<span id="color31" style="color:rgb(231,231,231);">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>' +
        '<span id="back31" style="background-color:rgb(231,231,231);">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>' +
        '<span id="name31" style="font-family:Segoe UI">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>' +
        '<span id="size31" style="font-size:8pt;">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>' +
        '<span id="left31" style="text-align:left;">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>' +
        '<span id="right31" style="text-align:right;">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>' +
        '<span id="center31" style="text-align:center;">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>' +
        '<span id="justify31" style="text-align:justify;">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>' +
        '<ol id="order31">' +
        '<li><p id="paragraph31">Provide the tool bar support, it’s also customizable.</p></li>' +
        '<li><p>Options to get the HTML elements with styles.</p></li>' +
        '<li><p>Support to insert image from a defined path.</p></li>' +
        '<li><p>Footer elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li>' +
        '<li><p>Re-size the editor support.</p></li>' +
        '<li><p>Provide efficient public methods and client side events.</p></li>' +
        '<li><p>Keyboard navigation support.</p></li>' +
        '</ol>' +
        '<div><ul id="unorder31">' +
        '<li><p id="paragraph32">Provide the tool bar support, it’s also customizable.</p></li>' +
        '<li><p>Options to get the HTML elements with styles.</p></li>' +
        '<li><p>Support to insert image from a defined path.</p></li>' +
        '<li><p>Footer elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li>' +
        '<li><p>Re-size the editor support.</p></li>' +
        '<li><p>Provide efficient public methods and client side events.</p></li>' +
        '<li><p>Keyboard navigation support.</p></li>' +
        '</ul></div>' +
        '<div><ol id="order41">' +
        '<li><p id="paragraph41" style="text-align:right;">Provide the tool bar support, it’s also customizable.' +
        '<strong id="bold41">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.' +
        '<em id="italic41">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.' +
        '<u id="underline41">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.' +
        '<del id="strike41">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.' +
        '<sup id="sup41">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.' +
        '<sub id="sub41">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.' +
        '<span id="color41" style="color:rgb(231,231,231);">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.' +
        '<span id="back41" style="background-color:rgb(231,231,231);">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.' +
        '<span id="name41" style="font-family:Segoe UI">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.' +
        '<span id="size41" style="font-size:8pt;">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.' +
        '<span id="justify41" style="text-align:justify;">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>' +
        '</span>' +
        '</span>' +
        '</span>' +
        '</span>' +
        '</sub>' +
        '</sup>' +
        '</del>' +
        '</u>' +
        '</em>' +
        '</strong>' +
        '</p></li>' +
        '<li><p>Options to get the HTML elements with styles.</p></li>' +
        '<li><p>Support to insert image from a defined path.</p></li>' +
        '<li><p>Footer elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li>' +
        '<li><p>Re-size the editor support.</p></li>' +
        '<li><p>Provide efficient public methods and client side events.</p></li>' +
        '<li><p>Keyboard navigation support.</p></li>' +
        '</ol></div>' +
        '</div>' +
        '<b id="bold41">bold</b>';

    describe(' RTE tools update ', () => {
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['|', 'formats', '|', 'orderedlist', 'unorderedlist']
                },
                value: innervalue
            });
            rteEle = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLDivElement;
            editNode.style.width = "200px;";
            editNode.style.height = "200px";
            curDocument = rteObj.contentModule.getDocument();
        });
        it('Check single Bold tag', () => {
            let node: Node = document.getElementById('bold31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.bold).toEqual(true);
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.italic).toEqual(false);
        });
        it('Check single Bold tag for keyup', () => {
            let node: Node = document.getElementById('bold31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            (rteObj as any).keyUp({ target: editNode, key: 'A' });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.bold).toEqual(true);
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.italic).toEqual(false);
        });
        it('Check single Italic tag', () => {
            let node: Node = document.getElementById('italic31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.italic).toEqual(true);
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.underline).toEqual(false);
        });
        it('Check single underline tag', () => {
            let node: Node = document.getElementById('underline31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.underline).toEqual(true);
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.strikethrough).toEqual(false);
        });
        it('Check single strikethrough tag', () => {
            let node: Node = document.getElementById('strike31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.strikethrough).toEqual(true);
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.superscript).toEqual(false);
        });
        it('Check single Superscript tag', () => {
            let node: Node = document.getElementById('sup31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.superscript).toEqual(true);
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.subscript).toEqual(false);
        });
        it('Check single subscript tag', () => {
            let node: Node = document.getElementById('sub31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.subscript).toEqual(true);
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.fontname).toEqual(null);
        });
        it('Check single font name tag without specfic family', () => {
            let node: Node = document.getElementById('name31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.fontname).toEqual('Segoe UI');
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.fontsize).toEqual(null);
        });
        it('Check single font name tag with specific incoorect family', () => {
            let node: Node = document.getElementById('name31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            rteObj.fontFamily = {
                default: 'Arial', items: [
                    { text: 'Arial', value: 'Arial,Helvetica,sans-serif' }
                ]
            };
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.fontname).toEqual(null);
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.fontcolor).toEqual('rgb(0, 0, 0)');
        });
        it('Check single font name tag with specfic correct family', () => {
            let node: Node = document.getElementById('name31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            rteObj.fontFamily = {
                default: 'Segoe UI', items: [
                    { text: 'Segoe UI', value: 'Segoe UI' }
                ]
            };
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.fontname).toEqual('Segoe UI');
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.fontsize).toEqual(null);
        });
        it('Check single font size tag without specfic size', () => {
            let node: Node = document.getElementById('size31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.fontsize).toEqual('8pt');
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.fontname).toEqual(null);
        });
        it('Check single font size tag with specific incorrect size', () => {
            let node: Node = document.getElementById('size31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            rteObj.fontSize = {
                default: '10', items: [
                    { text: '10', value: '10pt' }
                ]
            };
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.fontsize).toEqual(null);
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.fontcolor).toEqual('rgb(0, 0, 0)');
        });
        it('Check single font size tag with specfic coorect size', () => {
            let node: Node = document.getElementById('size31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            rteObj.fontSize = {
                default: '8', items: [
                    { text: '8', value: '8pt' }
                ]
            };
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.fontsize).toEqual('8pt');
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.fontname).toEqual(null);
        });
        it('Check single font color tag ', () => {
            let node: Node = document.getElementById('color31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.fontcolor).toEqual('rgb(231, 231, 231)');
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.orderedlist).toEqual(false);
        });
        it('Check single back ground color tag ', () => {
            let node: Node = document.getElementById('back31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.backgroundcolor).toEqual('rgb(231, 231, 231)');
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.unorderedlist).toEqual(false);
        });
        it('Check single alignment left tag ', () => {
            let node: Node = document.getElementById('left31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.alignments).toEqual('justifyleft');
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.bold).toEqual(false);
        });
        it('Check single alignment right tag ', () => {
            let node: Node = document.getElementById('right31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.alignments).toEqual('justifyright');
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.italic).toEqual(false);
        });
        it('Check single alignment center tag ', () => {
            let node: Node = document.getElementById('center31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.alignments).toEqual('justifycenter');
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.strikethrough).toEqual(false);
        });
        it('Check single alignment full tag ', () => {
            let node: Node = document.getElementById('justify31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.alignments).toEqual('justifyfull');
        });
        it('Check orderlist tag ', () => {
            let node: Node = document.getElementById('paragraph31');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.orderedlist).toEqual(true);
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.formats).toEqual('p');
        });
        it('Check unorderlist tag ', () => {
            let node: Node = document.getElementById('paragraph32');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.unorderedlist).toEqual(true);
        });
        it('Check multiple formatted values ', () => {
            let node: Node = document.getElementById('justify41');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.bold).toEqual(true);
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.italic).toEqual(true);
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.underline).toEqual(true);
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.strikethrough).toEqual(true);
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.superscript).toEqual(true);
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.superscript).toEqual(true);
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.orderedlist).toEqual(true);
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.fontcolor).toEqual('rgb(231, 231, 231)');
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.backgroundcolor).toEqual('rgb(231, 231, 231)');
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.fontname).toEqual('Segoe UI');
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.fontsize).toEqual('8pt');
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.alignments).toEqual('justifyfull');
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.formats).toEqual('p');
        });
        it('Check Bold tag with paragraph', () => {
            let node: Node = document.getElementById('paragraph3').childNodes[0];
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.bold).toEqual(true);
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.formats).toEqual('p');
        });
        afterAll(() => {
            detach(rteEle);
            destroy(rteObj);
        });
    });
    describe(' RTE tools update ', () => {
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontName', 'FontSize']
                },
                value: innervalue
            });
            rteEle = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLDivElement;
            editNode.style.width = "200px;";
            editNode.style.height = "200px";
            curDocument = rteObj.contentModule.getDocument();
        });
        it('Check multiple formatted values ', () => {
            let node: Node = document.getElementById('bold41');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 2, 2);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.bold).toEqual(true);
        });
        afterAll(() => {
            detach(rteEle);
            destroy(rteObj);
        });
    });

    describe(' EJ2-13502 - Toolbar active state on focusOut', () => {
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold']
                },
                value: innervalue
            });
            rteEle = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLDivElement;
            editNode.style.width = "200px;";
            editNode.style.height = "200px";
            curDocument = rteObj.contentModule.getDocument();
            controlId = rteObj.element.id;
        });
        it(' Remove the active state of Bold toolbar item while click on document ', () => {
            let node: Node = document.getElementById('paragraph2');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 2, 6);
            document.getElementById(controlId + "_toolbar_Bold").click();
            domSelection.setCursorPoint(document, document.body, 0);
            document.body.focus();
            (rteObj as any).onDocumentClick({ target: document.body });
            (rteObj as any).inputElement.blur();
            document.body.click();
            dispatchEvent(rteObj.contentModule.getEditPanel(), 'focusout');
            expect((rteObj.htmlEditorModule as any).toolbarUpdate.toolbarStatus.bold).toEqual(false);
        });
        afterAll(() => {
            detach(rteEle);
            destroy(rteObj);
        });
    });
    describe(' EJ2-15943 - RTE getSelection is not properly show the selected content', () => {
        let controlId: string;
        let editNode: HTMLElement;
        let button: HTMLButtonElement;
        beforeAll(() => {
            button = document.createElement('button') as HTMLButtonElement;
            button.id = 'getSelection';
            button.innerHTML = 'getSelection';
            document.body.appendChild(button);
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold']
                },
                value: innervalue
            });
            rteEle = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLDivElement;
            editNode.style.width = "200px;";
            editNode.style.height = "200px";
            curDocument = rteObj.contentModule.getDocument();
            controlId = rteObj.element.id;
        });
        it(' Remove the active state of Bold toolbar item while click on document ', (done) => {
            let node: Node = document.getElementById('paragraph2');
            domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 2, 6);
            document.getElementById(controlId + "_toolbar_Bold").click();
            button.addEventListener('click', () => {
                expect(rteObj.getSelection() !== '').toBe(true);
                done();
            })
            button.click();
        });
        afterAll(() => {
            detach(button);
            detach(rteEle);
            destroy(rteObj);
        });
    });
});