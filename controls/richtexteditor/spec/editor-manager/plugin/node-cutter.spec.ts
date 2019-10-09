import { InsertMethods } from '../../../src/editor-manager/plugin/insert-methods';
import { InsertHtml } from '../../../src/editor-manager/plugin/inserthtml';
import { IsFormatted } from '../../../src/editor-manager/plugin/isformatted';
import { NodeCutter } from '../../../src/editor-manager/plugin/nodecutter';
import { NodeSelection } from '../../../src/selection/index';
/**
 * Selection spec document
 */
describe('Node Cutter', () => {
    //HTML value
    let innervalue: string = '<div id="parentDiv"><p id="paragraph1"><b>Description:</b><span id="span1">Span1 Element</span>'+
    '<span id="span2">Span2<b>Element</b>tag</span>'+
    '<span id="span3">Span3<b>Element</b>tag</span></p>' +
        '<p id="paragraph2">The Rich Text Editor (RTE) control is an easy to render in' +
        'client side. Customer easy to edit the contents and get the HTML content for' +
        'the displayed content. A rich text editor control provides users with a toolbar' +
        'that helps them to apply rich text formats to the text entered in the text' +
        'area. </p>' +
        '<p id="paragraph3"><b id="boldcursor">Functional' +
        'Specifications/Requirements:</b></p>' +
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
        '<span id="unstyle1">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="inner1">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="inner2">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="inner3">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '</div>';
    
    let domSelection: NodeSelection = new NodeSelection();
    let nodeCutter: NodeCutter = new NodeCutter();


    //DIV Element
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;

    beforeAll(() => {
        document.body.appendChild(divElement);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });

    // Split Node 

    it('Split Left and Right node', () => {
        let node1: Node = document.getElementById('paragraph4').childNodes[0];
        domSelection.setSelectionText(document, node1, node1, 0, 7);
        let node2: Node = nodeCutter.GetSpliceNode(domSelection.getRange(document), node1 as HTMLElement);
        expect(node2.textContent).toEqual('Provide');
    });

    it('Split Left and Right node with existing node', () => {
        let node1: Node = document.getElementById('paragraph4').childNodes[1];
        domSelection.setSelectionText(document, node1, node1, 1, 4);
        let node2: Node = nodeCutter.GetSpliceNode(domSelection.getRange(document), node1 as HTMLElement);
        expect(node2.textContent).toEqual('the');
    });

    it('Split empty text node', () => {
        let node1: Node = document.getElementById('paragraph2').childNodes[1];
        domSelection.setSelectionText(document,
            document.getElementById('paragraph2'),
            document.getElementById('paragraph3'),
            0,
            0);
        let node2: Node = nodeCutter.GetSpliceNode(domSelection.getRange(document),
        document.getElementById('boldcursor').childNodes[0] as HTMLElement);
        expect(node2.textContent.trim()).toEqual('');
    });

    // Cursor Node

    it('Get cursor position for whitespace', () => {
        let node1: Node = document.getElementById('cursor1');
        let text1: Node = node1.childNodes[0];
        domSelection.setSelectionText(document, text1, text1, 5, 5);
        let node2: Node = nodeCutter.GetCursorNode(document, domSelection.getRange(document), text1);
        expect(node2.textContent).toEqual('');
    });
    // branch coverage
    it('Null element', () => {
        let node2: Node = nodeCutter.GetSpliceNode(domSelection.getRange(document), null);
        expect(node2).toEqual(null);
    });
});
