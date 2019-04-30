import { InsertMethods } from '../../../src/editor-manager/plugin/insert-methods';
import { NodeSelection } from '../../../src/selection/index';
/**
 * Selection spec document
 */
describe('Insert- Methods', () => {
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
     * Common method
     */
    it('WrapBefore method with existing node', () => {
        let node: Text = document.getElementById('span1').childNodes[0] as Text;
        new InsertMethods();
        InsertMethods.WrapBefore(node, document.createElement('strong'));
        expect(document.getElementById('span1').childNodes[0].nodeName.toLowerCase()).toEqual('strong');
    });

    it('WrapBefore method with Non - existing node', () => {
        let node: Text = document.createTextNode('Text Node');
        let textnode: Text = InsertMethods.WrapBefore(node, document.createElement('strong'));
        expect(textnode.textContent).toEqual('Text Node');
        expect(textnode.parentNode.parentNode).toEqual(null);
    });

    it('WrapAfter method with existing node', () => {
        let node: Text = document.getElementById('span2').childNodes[2] as Text;
        InsertMethods.WrapBefore(node, document.createElement('strong'), true);
        expect(document.getElementById('span2').childNodes[2].nodeName.toLowerCase()).toEqual('strong');
    });

    it('WrapAfter method with Non - existing node', () => {
        let node: Text = document.createTextNode('Text Node');
        let textnode: Text = InsertMethods.WrapBefore(node, document.createElement('strong'), true);
        expect(textnode.textContent).toEqual('Text Node');
        expect(textnode.parentNode.parentNode).toEqual(null);
    });

    it('Wrap method with existing node', () => {
        let node: HTMLElement = document.getElementById('span3').childNodes[0] as HTMLElement;
        InsertMethods.Wrap(node, document.createElement('strong'));
        expect(document.getElementById('span3').childNodes[0].nodeName.toLowerCase()).toEqual('strong');
    });

    it('UnWrap method with existing node', () => {
        let node: HTMLElement = document.getElementById('span3').childNodes[0] as HTMLElement;
        InsertMethods.unwrap(node);
        expect(document.getElementById('span3').childNodes[0].nodeName.toLowerCase()).toEqual('#text');
    });
});