import { IsFormatted } from '../../../src/editor-manager/plugin/isformatted';
import { NodeSelection } from '../../../src/selection/index';
/**
 * Selection spec document
 */
describe('IsFormatted', () => {
    //HTML value
    let innervalue: string = '<div id="parentDiv"><p id="paragraph1"><b>Description:</b><span id="span1">Span1 Element</span>'+
    '<span id="span2">Span2<b>Element</b>tag</span>'+
    '<span id="span3">Span3<b>Element</b>tag</span></p>' +
        '<p id="paragraph2">The Rich Text Editor (RTE) control is an easy to render in' +
        'client side. Customer easy to edit the contents and get the HTML content for' +
        'the displayed content. A rich text editor control provides users with a toolbar' +
        'that helps them to apply rich text formats to the text entered in the text' +
        'area. </p>' +
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
    let isFormatted: IsFormatted = new IsFormatted();
    

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
    /**
     * Get Formatted Node
     */

     it('Bold Span tag Format node check', () => {
        let node: Node = document.getElementById('bold1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'bold', document.getElementById("parentDiv"));
        expect(formatNode.nodeName.toLowerCase()).toEqual('span');
        expect(formatNode).toEqual(document.getElementById('bold1'));
    });

    it('Bold B tag Format node check', () => {
        let node: Node = document.getElementById('bold2').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'bold', document.getElementById("parentDiv"));
        expect(formatNode.nodeName.toLowerCase()).toEqual('b');
        expect(formatNode).toEqual(document.getElementById('bold2'));
    });

    it('Bold Un styled tag Format node check', () => {
        let node: Node = document.getElementById('unstyle1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'bold', document.getElementById("parentDiv"));
        expect(formatNode).toEqual(null);
    });

    it('Italic Span tag Format node check', () => {
        let node: Node = document.getElementById('italic1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'italic', document.getElementById("parentDiv"));
        expect(formatNode.nodeName.toLowerCase()).toEqual('span');
        expect(formatNode).toEqual(document.getElementById('italic1'));
    });

    it('Italic I tag Format node check', () => {
        let node: Node = document.getElementById('italic2').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'italic', document.getElementById("parentDiv"));
        expect(formatNode.nodeName.toLowerCase()).toEqual('i');
        expect(formatNode).toEqual(document.getElementById('italic2'));
    });

    it('Italic Un styled tag Format node check', () => {
        let node: Node = document.getElementById('unstyle1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'italic', document.getElementById("parentDiv"));
        expect(formatNode).toEqual(null);
    });

    it('Underline Span tag Format node check', () => {
        let node: Node = document.getElementById('underline2').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'underline', document.getElementById("parentDiv"));
        expect(formatNode.nodeName.toLowerCase()).toEqual('span');
        expect(formatNode).toEqual(document.getElementById('underline2'));
    });

    it('Underline U tag Format node check', () => {
        let node: Node = document.getElementById('underline1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'underline', document.getElementById("parentDiv"));
        expect(formatNode.nodeName.toLowerCase()).toEqual('u');
        expect(formatNode).toEqual(document.getElementById('underline1'));
    });

    it('Underline Un styled tag Format node check', () => {
        let node: Node = document.getElementById('unstyle1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'underline', document.getElementById("parentDiv"));
        expect(formatNode).toEqual(null);
    });


    it('Strike Span tag Format node check', () => {
        let node: Node = document.getElementById('strike2').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'strikethrough', document.getElementById("parentDiv"));
        expect(formatNode.nodeName.toLowerCase()).toEqual('span');
        expect(formatNode).toEqual(document.getElementById('strike2'));
    });

    it('Strike Del tag Format node check', () => {
        let node: Node = document.getElementById('strike1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'strikethrough', document.getElementById("parentDiv"));
        expect(formatNode.nodeName.toLowerCase()).toEqual('del');
        expect(formatNode).toEqual(document.getElementById('strike1'));
    });

    it('Strike Un styled tag Format node check', () => {
        let node: Node = document.getElementById('unstyle1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'strikethrough', document.getElementById("parentDiv"));
        expect(formatNode).toEqual(null);
    });

    it('SuperScript Sup tag Format node check', () => {
        let node: Node = document.getElementById('sup1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'superscript', document.getElementById("parentDiv"));
        expect(formatNode.nodeName.toLowerCase()).toEqual('sup');
        expect(formatNode).toEqual(document.getElementById('sup1'));
    });

    it('SuperScript Un styled tag Format node check', () => {
        let node: Node = document.getElementById('unstyle1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'superscript', document.getElementById("parentDiv"));
        expect(formatNode).toEqual(null);
    });

    it('SubScript Sub tag Format node check', () => {
        let node: Node = document.getElementById('sub1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'subscript', document.getElementById("parentDiv"));
        expect(formatNode.nodeName.toLowerCase()).toEqual('sub');
        expect(formatNode).toEqual(document.getElementById('sub1'));
    });

    it('SubScript Un styled tag Format node check', () => {
        let node: Node = document.getElementById('unstyle1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'subscript', document.getElementById("parentDiv"));
        expect(formatNode).toEqual(null);
    });

    it('Color Span tag Format node check', () => {
        let node: Node = document.getElementById('color1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'fontcolor', document.getElementById("parentDiv"));
        expect(formatNode.nodeName.toLowerCase()).toEqual('span');
        expect(formatNode).toEqual(document.getElementById('color1'));
    });

    it('Color Un styled tag Format node check', () => {
        let node: Node = document.getElementById('unstyle1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'fontcolor', document.getElementById("parentDiv"));
        expect(formatNode).toEqual(null);
    });

    it('Back Color Span tag Format node check', () => {
        let node: Node = document.getElementById('backcolor1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'backgroundcolor', document.getElementById("parentDiv"));
        expect(formatNode.nodeName.toLowerCase()).toEqual('span');
        expect(formatNode).toEqual(document.getElementById('backcolor1'));
    });

    it(' Back Color Un styled tag Format node check', () => {
        let node: Node = document.getElementById('unstyle1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'backgroundcolor', document.getElementById("parentDiv"));
        expect(formatNode).toEqual(null);
    });

    it('Font Family  Span tag Format node check', () => {
        let node: Node = document.getElementById('name1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'fontname', document.getElementById("parentDiv"));
        expect(formatNode.nodeName.toLowerCase()).toEqual('span');
        expect(formatNode).toEqual(document.getElementById('name1'));
    });

    it('Font Family  Un styled tag Format node check', () => {
        let node: Node = document.getElementById('unstyle1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'fontname', document.getElementById("parentDiv"));
        expect(formatNode).toEqual(null);
    });

    it('Font Size  Span tag Format node check', () => {
        let node: Node = document.getElementById('size1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'fontsize', document.getElementById("parentDiv"));
        expect(formatNode.nodeName.toLowerCase()).toEqual('span');
        expect(formatNode).toEqual(document.getElementById('size1'));
    });

    it('Font Size  Un styled tag Format node check', () => {
        let node: Node = document.getElementById('unstyle1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'fontsize', document.getElementById("parentDiv"));
        expect(formatNode).toEqual(null);
    });

    it('UnKnown Format node check', () => {
        let node: Node = document.getElementById('size1').childNodes[0];
        let formatNode: Node = isFormatted.getFormattedNode(node,'unknown', document.getElementById("parentDiv"));
        expect(formatNode).toEqual(null);
    });

});
