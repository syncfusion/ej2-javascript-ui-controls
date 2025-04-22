/**
 * Insert HTML spec document
 */
import { detach } from '@syncfusion/ej2-base';
import { InsertHtml } from '../../../src/editor-manager/plugin/inserthtml';
import { NodeCutter } from '../../../src/editor-manager/plugin/nodecutter';
import { NodeSelection } from '../../../src/selection/index';

describe('Testing the insert method for html content paste', function () {
    let innervalue: string = '<p>Values</p><p>Testing 1</p><p>Testing 2</p>';
    let range: Range;
    let divElement: HTMLElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    let domSelection: NodeSelection = new NodeSelection();
    beforeAll(function () {
        document.body.appendChild(divElement);
    });
    afterAll(function () {
        detach(divElement);
    });
    it('Pasting html string content', function () {
        range = document.createRange();
        range.setStart(divElement.childNodes[0].firstChild, 0);
        range.setEnd(divElement.childNodes[2].firstChild, 0);
        domSelection.setSelectionText(document, divElement.childNodes[0].firstChild, divElement.childNodes[2], 0, 0);
        (InsertHtml as any).Insert(document, innervalue, divElement ,true);
        expect((divElement as any).childElementCount).toBe(4);
    });
});

describe('Insert HTML', () => {
    //HTML value
    let innervalue: string = '<div id="parentDiv"><p id="paragraph1"><b>Description:</b><span id="span1">Span1 Element</span>'+
    '<span id="span2">Span2<b>Element</b>tag</span>'+
    '<span id="span3">Span3<b>Element</b>tag</span></p>' +
        '<p id="paragraph2">The Rich Text Editor (RTE) control is an easy to render in' +
        'client side. Customer easy to edit the contents and get the HTML content for' +
        'the displayed content. A rich text editor control provides users with a toolbar' +
        'that helps them to apply rich text formats to the text entered in the text' +
        'area. </p>' +
        '<p id="imgParagraph"><img style="width: 177px; height: 177px;" src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png"></p>' +
        '<p id="paragraph3">Functional' +
        'Specifications/Requirements:</p>' +
        '<ol>'+
        '<li><p id="paragraph4">Provide the tool bar support, it’s also customizable.</p></li>'+
        '<li><p id="paragraph5">Options to get the HTML elements with styles.</p></li>'+
        '<li><p id="paragraph6">Support to insert image from a defined path.</p></li>'+
        '<li><p id="paragraph7">Footer elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li>'+
        '<li><p id="paragraph8">Re-size the editor support.</p></li>'+
        '<li><p id="paragraph9">Provide efficient public methods and client side events.</p></li>'+
        '<li><p id="paragraph10">Keyboard navigation support.</p></li>'+
        '</ol>'+
        '<p id="paragraph11">The Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</p>'+
        '<span id="boldparent"><span id="bold1" style="font-weight:bold;">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<b id="bold2">the Rich Text Editor (RTE) control is an easy to render in'+
        'client side.</b></span>'+
        '<span id="italicparent"><span id="italic1" style="font-style:italic;">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<i id="italic2">the Rich Text Editor (RTE) control is an easy to render in'+
        'client side.</i></span>'+
        '<span id="underlineparent"><u id="underline1">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</u>'+
        '<span id="underline2" style="text-decoration:underline;">the Rich Text Editor (RTE) control is an easy to render in'+
        'client side.</span></span>'+
        '<span id="strikeparent"><del id="strike1">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</del>'+
        '<span id="strike2" style="text-decoration:line-through;">the Rich Text Editor (RTE) control is an easy to render in'+
        'client side.</span></span>'+
        '<sup id="sup1" style="text-decoration:line-through;">the Rich Text Editor (RTE) control is an easy to render in'+
        'client side.</sup>'+
        '<sub id="sub1" style="text-decoration:line-through;">the Rich Text Editor (RTE) control is an easy to render in'+
        'client side.</sub>'+
        '<span id="upper1" style="text-transform:uppercase;">the Rich Text Editor (RTE) control is an easy to render in'+
        'client side.</span>'+
        '<span id="lower1" style="text-transform:lowercase;">the Rich Text Editor (RTE) control is an easy to render in'+
        'client side.</span>'+
        '<span id="color1" style="color:yellow;">the Rich Text Editor (RTE) control is an easy to render in'+
        'client side.</span>'+
        '<span id="backcolor1" style="background-color:yellow;">the Rich Text Editor (RTE) control is an easy to render in'+
        'client side.</span>'+
        '<span id="name1" style="font-family:Arial;">the Rich Text Editor (RTE) control is an easy to render in'+
        'client side.</span>'+
        '<span id="size1" style="font-size:20px;">the Rich Text Editor (RTE) control is an easy to render in'+
        'client side.</span>'+
        '<span id="cursor1">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="cursor2">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="unstyle1">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="inner1">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="inner2">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="inner3">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="inner4">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '</div>';

    let domSelection: NodeSelection = new NodeSelection();

    //DIV Element
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;

    beforeAll(() => {
        document.body.appendChild(divElement);
    });
    afterAll(() => {
        detach(divElement);
    });

    // insert HTML
    it('Insert HTML in  cursor position', () => {
        let node1: Node = document.getElementById('inner1');
        let text1: Node = node1.childNodes[0];
        domSelection.setSelectionText(document, text1, text1, 5, 5);
        let node: Node = document.createElement('span');
        node.textContent = 'Span Node';
        new InsertHtml();
        InsertHtml.Insert(document, node);
        expect(domSelection.getParentNodeCollection(domSelection.getRange(document))[0]).toEqual(node);
    });

    it('Insert HTML in  cursor position with Text', () => {
        let node1: Node = document.getElementById('inner1');
        let text1: Node = node1.childNodes[0];
        domSelection.setSelectionText(document, text1, text1, 4, 4);
        let node: Node = document.createTextNode('Text Content');
        InsertHtml.Insert(document, node);
        expect(domSelection.getParentNodeCollection(domSelection.getRange(document))[0]).toEqual(node1);
    });

    it('Insert HTML in  specific selection', () => {
        let node1: Node = document.getElementById('inner2');
        let text1: Node = node1.childNodes[0];
        domSelection.setSelectionText(document, text1, text1, 2, 5);
        let node: Node = document.createElement('span');
        node.textContent = 'Span Node';
        InsertHtml.Insert(document, node);
        expect(domSelection.getParentNodeCollection(domSelection.getRange(document))[0]).toEqual(node);
    });

    it('Insert HTML in  specific selection', () => {
        let node1: Node = document.getElementById('inner2');
        let text1: Node = node1.childNodes[0];
        domSelection.setSelectionText(document, text1, text1, 0, 1);
        let node: Node = document.createTextNode('Text Content');
        InsertHtml.Insert(document, node);
        expect(domSelection.getParentNodeCollection(domSelection.getRange(document))[0]).toEqual(node1);
    });

    it('Insert HTML in  whole node selection', () => {
        let node1: Node = document.getElementById('inner3');
        domSelection.setSelectionText(document, node1, node1, 0, 1);
        let node: Node = document.createElement('span');
        node.textContent = 'Span Node';
        InsertHtml.Insert(document, node);
        expect(domSelection.getParentNodeCollection(domSelection.getRange(document))[0]).toEqual(node);
    });

    it('Insert HTML in  cursor position with string node', () => {
        let node1: Node = document.getElementById('cursor2');
        let text1: Node = node1.childNodes[0];
        domSelection.setSelectionText(document, text1, text1, 4, 4);
        InsertHtml.Insert(document, 'Text Content');
        expect(domSelection.getParentNodeCollection(domSelection.getRange(document))[0]).toEqual(node1);
        expect(node1.childNodes[1].textContent).toEqual('Text Content');
    });

    it('Insert HTML in  specific selection with string node', () => {
        let node1: Node = document.getElementById('inner4');
        let text1: Node = node1.childNodes[0];
        domSelection.setSelectionText(document, text1, text1, 2, 5);
        InsertHtml.Insert(document, 'Text Content');
        expect(domSelection.getParentNodeCollection(domSelection.getRange(document))[0]).toEqual(node1);
        expect(node1.childNodes[1].textContent).toEqual('Text Content');
    });

    it('Insert table next to image cursor position', () => {
        let editNode: Element = document.getElementById('parentDiv');
        let node1: Element = document.getElementById('imgParagraph');
        let table: HTMLElement = document.createElement('table') as HTMLElement;
        table.id = 'testTable';
        table.style.height = '10px';
        table.style.width = '10px';
        domSelection.setCursorPoint(document, node1, 1);
        InsertHtml.Insert(document, table, editNode);
        expect(document.querySelectorAll('#parentDiv > #imgParagraph > img').length).toEqual(1);
        expect(document.querySelectorAll('#parentDiv > table').length).toEqual(1);
        expect(document.querySelector('#parentDiv > table').id).toEqual('testTable');
    });

    it('Insert table next to table cursor position', () => {
        let editNode: Element = document.getElementById('parentDiv');
        let table: Element = document.getElementById('testTable');
        let table1: Element = document.createElement('table');
        table1.id = 'testTable1';
        domSelection.setCursorPoint(document, editNode, 0);
        InsertHtml.Insert(document, table1, editNode);
        expect(document.querySelectorAll('#parentDiv > #imgParagraph > img').length).toEqual(1);
        expect(document.querySelectorAll('#parentDiv > table').length).toEqual(2);
        expect(document.querySelectorAll('#parentDiv > table')[0].id).toEqual('testTable1');
        expect(document.querySelectorAll('#parentDiv > table')[1].id).toEqual('testTable');
        expect(document.querySelectorAll('#parentDiv > #inner4').length).toEqual(1);
    });

    it('Insert table by selecting all the content', () => {
        let editNode: Element = document.getElementById('divElement');
        let editNode1: Element = document.getElementById('paragraph1');
        let editNode2: Element = document.getElementById('inner4');
        let table: Element = document.getElementById('testTable');
        let table1: Element = document.createElement('table');
        table1.id = 'testTable1';
        let startNode: Node = editNode1.childNodes[0].childNodes[0];
        let endNode: Node = editNode2.childNodes[2];
        domSelection.setSelectionText(document, startNode, endNode, 0, 65);
        InsertHtml.Insert(document, table1, editNode);
        expect(document.getElementById('divElement').children.length === 1).toBe(true);
        expect(document.getElementById('divElement').children[0].tagName === 'TABLE').toBe(true);
    });
});

describe('904084 - Copy and Paste of Mention Item Updates Inside Existing Span Tag', () => {
    let innervalue: string = '<div id="parentDiv"><p><span id="span2">Span2tag</span></p></div>';
    let domSelection: NodeSelection = new NodeSelection();
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    beforeAll(() => {
        document.body.appendChild(divElement);
    });
    afterAll(() => {
        detach(divElement);
    });
    it('Copy and Paste of Mention Item Updates Inside Existing Span Tag', () => {
        let editNode: Element = document.getElementById('divElement');
        let selectNode: Element = document.getElementById('parentDiv');
        let pasteElement: HTMLElement = document.createElement('div');
        pasteElement.classList.add('pasteContent');
        let span: Element = document.createElement('span');
        span.innerHTML= 'testTable1';
        pasteElement.appendChild(span);
        domSelection.setSelectionNode(document, selectNode);
        InsertHtml.Insert(document, pasteElement, editNode);
        expect(document.getElementById('divElement').innerHTML === '<div id="parentDiv"><p><span>testTable1</span></p></div>').toBe(true);
    });
});

describe('878730 - Bullet format list not removed properly when we replace the content in RichTextEditor', () => {
    let innervalue: string = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fhdfhdh<span id="start">dhdhdhgdghdgh</span></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li></ul>';
    let domSelection: NodeSelection = new NodeSelection();
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    beforeAll(() => {
        document.body.appendChild(divElement);
    });
    afterAll(() => {
        detach(divElement);
    });
    it('Bullet format list not removed properly when we replace the content in RichTextEditor - select all and replace single line.', () => {
        let editNode: Element = document.getElementById('divElement');
        let selectNode: Element = document.getElementById('parentDiv');
        let pasteElement: HTMLElement = document.createElement('div');
        pasteElement.classList.add('pasteContent');
        let paragraph: Element = document.createElement('P');
        paragraph.innerHTML= 'testTable1';
        pasteElement.appendChild(paragraph);
        domSelection.setSelectionNode(document, selectNode);
        InsertHtml.Insert(document, pasteElement, editNode);
        expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>testTable1</p></li>').toBe(true);
    });
    it('Bullet format list not removed properly when we replace the content in RichTextEditor - select all and replace multiple line.', () => {
        let editNode: Element = document.getElementById('divElement');
        editNode.innerHTML = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fhdfhdh<span id="start">dhdhdhgdghdgh</span></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li></ul>';
        let selectNode: Element = document.getElementById('parentDiv');
        let pasteElement: HTMLElement = document.createElement('div');
        pasteElement.classList.add('pasteContent');
        let paragraph: Element = document.createElement('P');
        paragraph.innerHTML= 'testTable1';
        let paragraph1: Element = document.createElement('P');
        paragraph1.innerHTML= 'testTable1';
        pasteElement.appendChild(paragraph);
        pasteElement.appendChild(paragraph1);
        domSelection.setSelectionNode(document, selectNode);
        InsertHtml.Insert(document, pasteElement, editNode);
        expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>testTable1</p><p>testTable1</p></li>').toBe(true);
    });
    it('Bullet format list not removed properly when we replace the content in RichTextEditor - partial selection and replace single line.', () => {
        let editNode: Element = document.getElementById('divElement');
        editNode.innerHTML = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fhdfhdh<span id="start">dhdhdhgdghdgh</span></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li></ul>';
        let startNode: Element = document.getElementById('start');
        let endNode: Element = document.getElementById('end');
        let pasteElement: HTMLElement = document.createElement('div');
        pasteElement.classList.add('pasteContent');
        let paragraph: Element = document.createElement('P');
        paragraph.innerHTML= 'testTable1';
        pasteElement.appendChild(paragraph);
        domSelection.setSelectionText(document, startNode.firstChild, endNode.firstChild, 0, 6);
        InsertHtml.Insert(document, pasteElement, editNode);
        expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fhdfhdh</p><p>testTable1</p></li>').toBe(true);
    });
    it('Bullet format list not removed properly when we replace the content in RichTextEditor - partial selection and replace single span line.', () => {
        let editNode: Element = document.getElementById('divElement');
        editNode.innerHTML = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fhdfhdh<span id="start">dhdhdhgdghdgh</span></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li></ul>';
        let startNode: Element = document.getElementById('start');
        let endNode: Element = document.getElementById('end');
        let pasteElement: HTMLElement = document.createElement('div');
        pasteElement.classList.add('pasteContent');
        let span: Element = document.createElement('span');
        span.innerHTML= 'testTable1';
        pasteElement.appendChild(span);
        domSelection.setSelectionText(document, startNode.firstChild, endNode.firstChild, 0, 6);
        InsertHtml.Insert(document, pasteElement, editNode);
        expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fhdfhdh<span>testTable1</span></p></li>').toBe(true);
    });
    it('Bullet format list not removed properly when we replace the content in RichTextEditor - partial selection and replace multiple line.', () => {
        let editNode: Element = document.getElementById('divElement');
        editNode.innerHTML = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fhdfhdh<span id="start">dhdhdhgdghdgh</span></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li></ul>';
        let startNode: Element = document.getElementById('start');
        let endNode: Element = document.getElementById('end');
        let pasteElement: HTMLElement = document.createElement('div');
        pasteElement.classList.add('pasteContent');
        let paragraph: Element = document.createElement('P');
        paragraph.innerHTML= 'testTable1';
        let paragraph1: Element = document.createElement('P');
        paragraph1.innerHTML= 'testTable1';
        pasteElement.appendChild(paragraph);
        pasteElement.appendChild(paragraph1);
        domSelection.setSelectionText(document, startNode.firstChild, endNode.firstChild, 0, 6);
        InsertHtml.Insert(document, pasteElement, editNode);
        expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fhdfhdh</p><p>testTable1</p><p>testTable1</p></li>').toBe(true);
    });
    it('Bullet format list not removed properly when we replace the content in RichTextEditor - middle selection and replace single line.', () => {
        let editNode: Element = document.getElementById('divElement');
        editNode.innerHTML = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fhdfhdh<span id="start">dhdhdhgdghdgh</span></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li></ul>';
        let startNode: Element = document.getElementById('start');
        let endNode: Element = document.getElementById('middle');
        let pasteElement: HTMLElement = document.createElement('div');
        pasteElement.classList.add('pasteContent');
        let paragraph: Element = document.createElement('P');
        paragraph.innerHTML= 'testTable1';
        pasteElement.appendChild(paragraph);
        domSelection.setSelectionText(document, startNode.firstChild, endNode.firstChild, 0, 6);
        InsertHtml.Insert(document, pasteElement, editNode);
        expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fhdfhdh</p><p>testTable1</p></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif; list-style-type: none;"><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif; list-style-type: none;"><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p><span id="end">HDHDFH</span></p></li></ul></li></ul></li>').toBe(true);
    });
});

describe('911546 - List order not maintained when Heading 6 is pasted.', () => {
    let innervalue: string = '<ol id="parentDiv"><li style=""><h6 style="font-size: 1.142em; line-height: 1.5; margin: 10px 0px;">djslkfjsdjflk</h6></li></ol>';
    let domSelection: NodeSelection = new NodeSelection();
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    beforeAll(() => {
        document.body.appendChild(divElement);
    });
    afterAll(() => {
        detach(divElement);
    });
    it('List order not maintained when Heading 6 is pasted.', () => {
        let editNode: Element = document.getElementById('divElement');
        let selectNode: Element = document.getElementById('parentDiv');
        let pasteElement: HTMLElement = document.createElement('div');
        pasteElement.classList.add('pasteContent');
        const liTag: HTMLElement = document.createElement('li');
        const h6Tag: HTMLElement = document.createElement('h6');
        h6Tag.style.fontSize = '1.142em';
        h6Tag.style.lineHeight = '1.5';
        h6Tag.style.margin = '10px 0';
        h6Tag.textContent = 'djslkfjsdjflk';
        liTag.appendChild(h6Tag);
        pasteElement.appendChild(liTag);
        domSelection.setSelectionNode(document, selectNode);
        InsertHtml.Insert(document, pasteElement, editNode);
        expect(document.getElementById('parentDiv').innerHTML === '<li><h6 style="font-size: 1.142em; line-height: 1.5; margin: 10px 0px;">djslkfjsdjflk</h6></li>').toBe(true);
    });
});

describe('923287 - Pasting a list inside another list is not working as expected.', () => {
    let innervalue: string = '<ol><li style="">test1</li><li id="parentDiv" style="">test2</li><li style="">test3</li></ol>';
    let domSelection: NodeSelection = new NodeSelection();
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    beforeAll(() => {
        document.body.appendChild(divElement);
    });
    afterAll(() => {
        detach(divElement);
    });
    it('Pasting a list inside another list is not working as expected.', () => {
        let editNode: Element = document.getElementById('divElement');
        let selectNode: Element = document.getElementById('parentDiv');
        let pasteElement: HTMLElement = document.createElement('div');
        pasteElement.classList.add('pasteContent');
        pasteElement.innerHTML = '<ol id="parentDiv"><li style="">test4</li><li style="">test5</li><li style="">test6</li></ol>';
        domSelection.setSelectionText(document, selectNode.firstChild, selectNode.firstChild, 0, 0);
        InsertHtml.Insert(document, pasteElement, editNode);
        expect(document.getElementById('divElement').innerHTML === '<ol><li style="">test1</li><li style="">test4</li><li style="">test5</li><li style="">test6</li><li id="parentDiv" style="">test2</li><li style="">test3</li></ol>').toBe(true);
    });
});

describe('EJ2-49169-InsertHtml for the pasted elements not inserted properly', function () {
    let innervalue: string = '<p><span>Please click this link to download a calendar reminder for this date and time</span></p><p><a classname="e-rte-anchor" href="https://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics" title="https://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics" target="_blank">https://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics </a></p><p><br></p><p>This will affect both the US and DK production site.</p><p><br></p>';
    let nonDOMvalue: string = '<br>';
    let rangeNodes: Node[] = [];
    let range: Range;
    let nodeCutter: NodeCutter = new NodeCutter();
    let divElement: HTMLElement = document.createElement('div');
    let pasteElement: HTMLElement = document.createElement('div');
    let pElement: HTMLElement = document.createElement('p');
    divElement.id = 'divElement';
    pElement.id='nonDOM';
    pasteElement.classList.add('pasteContent');
    pasteElement.style.display = 'inline';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    pasteElement.innerHTML = innervalue;
    pElement.innerHTML = nonDOMvalue;
    beforeAll(function () {
        document.body.appendChild(divElement);
    });
    afterAll(function () {
        detach(divElement);
    });
    it('Inserting pasted element in the empty node', function () {
        range = document.createRange();
        range.setStart(divElement.childNodes[0].childNodes[0].firstChild, 0);
        range.setEnd(divElement.childNodes[4], 0);
        rangeNodes.push(divElement.childNodes[0].childNodes[0].firstChild);
        rangeNodes.push(divElement.childNodes[1].childNodes[0].firstChild);
        rangeNodes.push(divElement.childNodes[2].firstChild);
        rangeNodes.push(divElement.childNodes[3].firstChild);
        rangeNodes.push(divElement.childNodes[4].firstChild);
        (InsertHtml as any).insertTempNode(range, pasteElement, rangeNodes, nodeCutter, divElement);
        expect((divElement as any).childNodes[4].childNodes[0].childNodes.length).toBe(5);
    });
});

describe('BLAZ-13456 - Pasting on the content by selecting "ctrl+a" throws console errors', function () {
    let innervalue: string = '<p>testing 1</p><p><br></p>';
    let nonDOMvalue: string = '<br>';
    let rangeNodes: Node[] = [];
    let range: Range;
    let nodeCutter: NodeCutter = new NodeCutter();
    let divElement: HTMLElement = document.createElement('div');
    let nonElement: HTMLElement = document.createElement('br');
    let pasteElement: HTMLElement = document.createElement('div');
    let pElement: HTMLElement = document.createElement('p');
    divElement.id = 'divElement';
    pElement.id='nonDOM';
    pasteElement.classList.add('pasteContent');
    pasteElement.style.display = 'inline';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    pasteElement.innerHTML = innervalue;
    pElement.innerHTML = nonDOMvalue;
    beforeAll(function () {
        document.body.appendChild(divElement);
    });
    afterAll(function () {
        detach(divElement);
    });
    it('Inserting pasted element for empty blocknodes', function () {
        range = document.createRange();
        range.setStart(divElement.childNodes[0].firstChild, 0);
        range.setEnd(divElement.childNodes[1], 0);
        rangeNodes.push(divElement.childNodes[0].firstChild);
        rangeNodes.push(nonElement);
        (InsertHtml as any).insertTempNode(range, pasteElement, rangeNodes, nodeCutter, divElement);
        expect((divElement as any).childNodes[1].childNodes[0].childNodes.length).toBe(2);
    });
});

describe('BLAZ-13456 - Pasting on the content by selecting "ctrl+a" throws console errors', function () {
    let innervalue: string = '<p>testing 1</p><p></p>';
    let nonDOMvalue: string = '<br>';
    let rangeNodes: Node[] = [];
    let range: Range;
    let nodeCutter: NodeCutter = new NodeCutter();
    let divElement: HTMLElement = document.createElement('div');
    let nonElement: HTMLElement = document.createElement('br');
    let pasteElement: HTMLElement = document.createElement('div');
    let pElement: HTMLElement = document.createElement('p');
    divElement.id = 'divElement';
    pElement.id='nonDOM';
    pasteElement.classList.add('pasteContent');
    pasteElement.style.display = 'inline';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    pasteElement.innerHTML = innervalue;
    pElement.innerHTML = nonDOMvalue;
    beforeAll(function () {
        document.body.appendChild(divElement);
    });
    afterAll(function () {
        detach(divElement);
    });
    it('Inserting pasted element for empty blocknodes', function () {
        range = document.createRange();
        range.setStart(divElement.childNodes[0].firstChild, 0);
        range.setEnd(divElement.childNodes[1], 0);
        rangeNodes.push(divElement.childNodes[0].firstChild);
        rangeNodes.push(nonElement);
        (InsertHtml as any).insertTempNode(range, pasteElement, rangeNodes, nodeCutter, divElement);
        expect((divElement as any).childNodes[1].childNodes.length).toBe(2);
    });
});

describe('EJ2-55078 - Insert HTML insert content outside', function () {
    let innervalue: string = '<div style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">test auto reply<br /><p class="focusElement"><br /><br /></p></div>';
    let range: Range;
    let divElement: HTMLElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    let domSelection: NodeSelection = new NodeSelection();
    beforeAll(function () {
        document.body.appendChild(divElement);
    });
    afterAll(function () {
        detach(divElement);
    });
    it('Insert HTML insert content outside when P has two br tags', function () {
        let focusElement: any = document.querySelector('.focusElement');
        range = document.createRange();
        range.setStart(focusElement, 1);
        range.setEnd(focusElement, 1);
        domSelection.setSelectionText(document, focusElement, focusElement, 1, 1);
        (InsertHtml as any).Insert(document, '<p>Inserted Content</p>', divElement ,true);
        expect((divElement as any).innerHTML === '<div style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">test auto reply<br><p class="focusElement"><br></p><p>Inserted Content</p></div>').toBe(true);
    });
});

describe('924996 - Issue when entering multiple line breaks and inserting new text removes all lines', function () {
    let innervalue: string = '<br><br><br><br><br><br><br><br><br class="focusElement">';
    let divElement: HTMLElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    let domSelection: NodeSelection = new NodeSelection();
    beforeAll(function () {
        document.body.appendChild(divElement);
    });
    afterAll(function () {
        detach(divElement);
    });
    it('Issue when entering multiple line breaks and inserting new text removes all lines', function () {
        let focusElement: any = document.querySelector('.focusElement');
        domSelection.setSelectionNode(document, focusElement);
        (InsertHtml as any).Insert(document, '<p>Inserted Content</p>', divElement, true);
        expect((divElement as any).innerHTML === '<br><br><br><br><br><br><br><br><p>Inserted Content</p>').toBe(true);
    });
});

describe('EJ2-52641- Text inserted outside of the RichTextEditor after Shift + Enter Key pressed', function () {
    let innervalue: string = '<p>Testing<br/></br/></p>';
    let rangeNodes: Node[] = [];
    let range: Range;
    let nodeCutter: NodeCutter = new NodeCutter();
    let divElement: HTMLElement = document.createElement('div');
    let nonElement: HTMLElement = document.createElement('div');
    let pasteElement: HTMLElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    pasteElement.innerHTML = "<p>NewWord</p>";
    beforeAll(function () {
        document.body.appendChild(divElement);
        document.body.appendChild(nonElement);
    });
    afterAll(function () {
        detach(divElement);
        detach(nonElement);
    });
    it('Inserting HTML with shift + enter action', function () {
        range = document.createRange();
        range.setStart(divElement.childNodes[0], 2);
        range.setEnd(divElement.childNodes[0], 2);
        rangeNodes.push(divElement.childNodes[0].lastChild);
        rangeNodes.push(nonElement);
        (InsertHtml as any).insertTempNode(range, pasteElement, rangeNodes, nodeCutter, divElement);
        expect((divElement as any).childNodes[1].childNodes.length).toBe(1);
    });
});

describe('917388 - Table Insertion Occurs in Wrong Place When Cursor Is in a Span Element', function () {
    let innervalue: string = `<div class="content-container">
            <div class="content-title">
                <img class="content-logo" alt="PJM Logo" width="auto" height="auto" />
                <h2 class="content-title">Help Topic Title</h2>
            </div>
            <div class="content-inner">
                <hr />
                <p style="text-align: left;">
                    <span class="focusElement" style="color: rgb(0, 0, 0); font-family: Helvetica, Arial, " segoe ui" , tahoma, geneva, verdana, sans-serif; font-size: 15px; font-style: normal; font-weight: 400; text-align: left; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;">Help topic text goes here.
        
                    </span>
                </p>
            </div>
        </div>`;
    let range: Range; 
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    let domSelection: NodeSelection = new NodeSelection();
    beforeAll(() => {
        document.body.appendChild(divElement);
    });
    afterAll(() => {
        detach(divElement);
    });
    it('Table Insertion Occurs in Wrong Place When Cursor Is in a Span Element', function () {
        let focusElement: any = document.querySelector('.focusElement');
        range = document.createRange();
        let textLength = focusElement.textContent.length;
        range.setStart(focusElement.firstChild, textLength);
        range.setEnd(focusElement.firstChild, textLength);
        let table: Element = document.createElement('table');
        domSelection.setSelectionText(document, focusElement.firstChild, focusElement.firstChild, textLength, textLength);
        (InsertHtml as any).Insert(document, table, divElement,true);
        expect(document.getElementsByClassName('content-inner')[0].children.length === 4).toBe(true);
        expect(document.getElementsByClassName('content-inner')[0].children[2].tagName === 'TABLE').toBe(true);
    });
});

describe('923872 - The execCommand method does not replace the text wrapped inside a span element in the editor', function () {
    let innervalue: string = `<table class="e-rte-table" style="width: 100%; min-width: 0px;">
            <tbody>
              <tr>
                <td class="e-cell-select" style="width: 33.3333%; text-align: start;">
                  <span class="focusElement" style="color: rgb(33, 37, 41); font-family: system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, arial, &quot;Noto Sans&quot;, &quot;Liberation Sans&quot;, sans-serif, &quot;apple color emoji&quot;, &quot;Segoe UI emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto color emoji&quot;; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;">The Rich Text Editor, a WYSIWYG (what you see is what you get)
                    editor, is a user interface that allows you to create, edit, and
                    format rich text content.<span>&nbsp;</span></span>
                </td>
                <td style="width: 33.3333%;"><br></td>
                <td style="width: 33.3333%;"><br></td>
              </tr>
              <tr>
                <td style="width: 33.3333%;"><br></td>
                <td style="width: 33.3333%;"><br></td>
                <td style="width: 33.3333%;"><br></td>
              </tr>
              <tr>
                <td style="width: 33.3333%;"><br></td>
                <td style="width: 33.3333%;"><br></td>
                <td style="width: 33.3333%;"><br></td>
              </tr>
            </tbody>
        </table><p><br></p>`;
    let range: Range; 
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    let domSelection: NodeSelection = new NodeSelection();
    beforeAll(() => {
        document.body.appendChild(divElement);
    });
    afterAll(() => {
        detach(divElement);
    });
    it('The execCommand method does not replace the text wrapped inside a span element in the editor', function () {
        let focusElement: any = document.querySelector('.focusElement');
        range = document.createRange();
        let textLength = focusElement.textContent.length - 1;
        range.setStart(focusElement.firstChild, 0);
        range.setEnd(focusElement.firstChild, textLength);
        let paragraph: Element = document.createElement('p');
        paragraph.textContent = "Hello Rich Text Editor";
        domSelection.setSelectionText(document, focusElement.firstChild, focusElement.firstChild, 0, textLength);
        (InsertHtml as any).Insert(document, paragraph, divElement, true);
        expect(document.getElementsByClassName("e-cell-select")[0].firstElementChild.outerHTML).toBe('<p>Hello Rich Text Editor</p>');
    });
});

describe('EJ2-53098- Numbered List order in the Rich Text Editor goes incorrect when copying and pasting a list from MS word', function () {
    let innervalue: string = '<ol><li>Initial 1</li><li>Initial 2</li><li>Initial 3<br></li></ol>';
    let rangeNodes: Node[] = [];
    let range: Range;
    let nodeCutter: NodeCutter = new NodeCutter();
    let divElement: HTMLElement = document.createElement('div');
    let wrapperDivElement: HTMLElement = document.createElement('div');
    let pasteElement: HTMLElement = document.createElement('div');
    divElement.id = 'divElement';
    pasteElement.classList.add('pasteContent');
    pasteElement.style.display = 'inline';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    pasteElement.innerHTML = innervalue;
    beforeAll(function () {
        wrapperDivElement.appendChild(divElement);
        document.body.appendChild(wrapperDivElement);
    });
    afterAll(function () {
        detach(divElement);
        detach(wrapperDivElement);
    });
    it('Inserting li element at last in the existing OL', function () {
        range = document.createRange();
        range.setStart(divElement.lastElementChild.lastElementChild.firstChild, 9);
        range.setEnd(divElement.lastElementChild.lastElementChild.firstChild, 9);
        rangeNodes.push(divElement.lastElementChild.lastElementChild.firstChild);
        (InsertHtml as any).insertTempNode(range, pasteElement, rangeNodes, nodeCutter, divElement);
        expect(divElement.childNodes[0].childNodes[2].childNodes[1].childNodes[1].textContent).toBe('Initial 1');
        expect(divElement.childNodes[0].childNodes[2].childNodes[1].childNodes[2].textContent).toBe('Initial 2');
        expect(divElement.childNodes[0].childNodes[2].childNodes[1].childNodes[3].textContent).toBe('Initial 3');
    });
    it('Inserting li element at middle in the existing OL', function () {
        divElement.innerHTML = innervalue;
        range = document.createRange();
        range.setStart(divElement.lastElementChild.childNodes[1].firstChild, 9);
        range.setEnd(divElement.lastElementChild.childNodes[1].firstChild, 9);
        rangeNodes.push(divElement.lastElementChild.childNodes[1].firstChild);
        (InsertHtml as any).insertTempNode(range, pasteElement, rangeNodes, nodeCutter, divElement);
        expect(divElement.childNodes[0].childNodes[1].childNodes[1].childNodes[1].textContent).toBe('Initial 1');
        expect(divElement.childNodes[0].childNodes[1].childNodes[1].childNodes[2].textContent).toBe('Initial 2');
        expect(divElement.childNodes[0].childNodes[1].childNodes[1].childNodes[3].textContent).toBe('Initial 3');
    });
});

describe('EJ2-53098- Unordered List order in the Rich Text Editor goes incorrect when copying and pasting a list from MS word', function () {
    let innervalue: string = '<ul><li>Initial 1</li><li>Initial 2</li><li>Initial 3<br></li></ul>';
    let rangeNodes: Node[] = [];
    let range: Range;
    let nodeCutter: NodeCutter = new NodeCutter();
    let divElement: HTMLElement = document.createElement('div');
    let wrapperDivElement: HTMLElement = document.createElement('div');
    let pasteElement: HTMLElement = document.createElement('div');
    divElement.id = 'divElement';
    pasteElement.classList.add('pasteContent');
    pasteElement.style.display = 'inline';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    pasteElement.innerHTML = innervalue;
    beforeAll(function () {
        wrapperDivElement.appendChild(divElement);
        document.body.appendChild(wrapperDivElement);
    });
    afterAll(function () {
        detach(divElement);
        detach(wrapperDivElement);
    });
    it('Inserting li element at last in the existing UL', function () {
        range = document.createRange();
        range.setStart(divElement.lastElementChild.lastElementChild.firstChild, 9);
        range.setEnd(divElement.lastElementChild.lastElementChild.firstChild, 9);
        rangeNodes.push(divElement.lastElementChild.lastElementChild.firstChild);
        (InsertHtml as any).insertTempNode(range, pasteElement, rangeNodes, nodeCutter, divElement);
        expect(divElement.childNodes[0].childNodes[2].childNodes[1].childNodes[1].textContent).toBe('Initial 1');
        expect(divElement.childNodes[0].childNodes[2].childNodes[1].childNodes[2].textContent).toBe('Initial 2');
        expect(divElement.childNodes[0].childNodes[2].childNodes[1].childNodes[3].textContent).toBe('Initial 3');
    });
    it('Inserting li element at middle in the existing UL', function () {
        divElement.innerHTML = innervalue;
        range = document.createRange();
        range.setStart(divElement.lastElementChild.childNodes[1].firstChild, 9);
        range.setEnd(divElement.lastElementChild.childNodes[1].firstChild, 9);
        rangeNodes.push(divElement.lastElementChild.childNodes[1].firstChild);
        (InsertHtml as any).insertTempNode(range, pasteElement, rangeNodes, nodeCutter, divElement);
        expect(divElement.childNodes[0].childNodes[1].childNodes[1].childNodes[1].textContent).toBe('Initial 1');
        expect(divElement.childNodes[0].childNodes[1].childNodes[1].childNodes[2].textContent).toBe('Initial 2');
        expect(divElement.childNodes[0].childNodes[1].childNodes[1].childNodes[3].textContent).toBe('Initial 3');
    });
});