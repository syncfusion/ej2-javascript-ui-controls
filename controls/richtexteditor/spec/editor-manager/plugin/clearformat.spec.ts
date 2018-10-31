import { NodeSelection } from '../../../src/selection/selection';
import { ClearFormat } from '../../../src/editor-manager/plugin/clearformat';
/**
 * Selection spec document
 */
describe('Clear Format commands', () => {
    //HTML value
    let innervalue: string = '<div id="div1">'+
    '<div id="div5">Div Element<p id="paragraph25">Key'+
        '<b>bo<i>ar<u>d n<del>avigat<b><i>ion support.</i></b></del></u></i></b></p></div>' +
    '<div id="div6">Div Element<p id="paragraph26">Key'+
        '<b>bo<i>ar<u>d n<del>avigation support.</del></u></i></b></p></div>' +
    '<p id="paragraph1"><b>Description:</b></p>' +
        '<p id="paragraph2">The Rich Text Editor (RTE) control is an easy to render in' +
        'client side. Customer easy to edit the contents and get the HTML content for' +
        'the displayed content. A rich text editor control provides users with a toolbar' +
        'that helps them to apply rich text formats to the text entered in the text' +
        'area. </p>' +
        '<p id="paragraph31"><b>Functional ' +
        'Specifications/Requirements:</b></p>' +
        '<p id="paragraph3"><b>Functional ' +
        'Specifications/Requirements:</b></p>' +
        '<div id="div2">'+
        '<ol>'+
        '<li><p id="paragraph4">Provide the tool bar support, it’s also customizable.</p></li>'+
        '<li><p id="paragraph5">Options to get the HTML elements with styles.</p></li>'+
        '<li><p id="paragraph6">Support to insert image from <p></p>a defined path.</p></li>'+
        '<li><p id="paragraph7">Footer elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li>'+
        '<li><p id="paragraph8">Re-size the editor support.</p></li>'+
        '<li><p id="paragraph9">Provide efficient public methods and client side events.</p></li>'+
        '<li><p id="paragraph10">Keyboard navigation support.<img width="250" height="250"></p></li>'+
        '</ol>'+
        '<span>Span Element</span>' +
        '</div>'+
        '<div id="div3">'+
        '<ol>'+
        '<li><p id="paragraph11">Provide the tool bar support, it’s also customizable.</p></li>'+
        '<li><p id="paragraph12">Options to get the HTML elements with styles.</p></li>'+
        '<li><p id="paragraph13">Support to insert image from a defined path.</p></li>'+
        '<li><p id="paragraph14">Footer elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li>'+
        '<li><p id="paragraph15">Re-size the editor support.</p></li>'+
        '<li><p id="paragraph16">Provide efficient public methods and client side events.</p></li>'+
        '<li><p id="paragraph17">Keyboard navigation support.</p></li>'+
        '</ol>'+
        '<span>Span Element</span>' +
        '</div>'+
        '<div id="div4">'+
        '<ol>'+
        '<li><p id="paragraph18">Provide the tool bar support, it’s also customizable.</p></li>'+
        '<li><p id="paragraph19">Options to get the HTML elements with styles.</p></li>'+
        '<li><p id="paragraph20">Support to insert image from a defined path.</p></li>'+
        '<li><p id="paragraph21">Footer elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li>'+
        '<li><p id="paragraph22">Re-size the editor support.</p></li>'+
        '<li><p id="paragraph23">Provide efficient public methods and client side events.</p></li>'+
        '<li><p id="paragraph24">Keyboard navigation support.</p></li>'+
        '</ol>'+
        '<span>Span Element</span>' +
        '</div>'+
        '<div id="div21">'+
        '<ol>'+
        '<li>Provide the tool bar support, it’s also customizable.</li>'+
        '<li>Options to get the HTML elements with styles.</li>'+
        '<li>Support to insert image from <p></p>a defined path.</li>'+
        '<li>Footer elements and styles(tag / Element information , Action button (Upload, Cancel))</li>'+
        '<li>Re-size the editor support.</li>'+
        '<li>Provide efficient public methods and client side events.</li>'+
        '<li>>Keyboard navigation support.<img width="250" height="250"></li>'+
        '</ol>'+
        '</div>'+
        '</div>';


    let domSelection: NodeSelection = new NodeSelection();
    //DIV Element
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    let parentDiv: HTMLDivElement;

    beforeAll(() => {
        document.body.appendChild(divElement);
        parentDiv = document.getElementById('div1') as HTMLDivElement;
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
    /**
     * Text Node Direct Parent
     */
    it('Clear OL LI img element', () => {
        new ClearFormat();
        let node1: Node = document.getElementById('paragraph4');
        let node2: HTMLElement = document.getElementById('paragraph10');
        domSelection.setSelectionText(document, node1, node2, 0, 2);
        ClearFormat.clear(document, divElement);
        expect(document.getElementById('div2').childNodes[0].nodeName.toLowerCase()).toEqual('p');
    });
    it('Clear OL LI textnode element', () => {
        let node1: Node = document.getElementById('paragraph11');
        let node2: HTMLElement = document.getElementById('paragraph17');
        domSelection.setSelectionText(document, node1, node2, 0, 1);
        ClearFormat.clear(document, divElement);
        expect(document.getElementById('div3').childNodes[0].nodeName.toLowerCase()).toEqual('p');
    });
    it('Clear inline element', () => {
        let node1: Node = document.getElementById('div5');
        let node2: HTMLElement = document.getElementById('paragraph26');
        domSelection.setSelectionText(document, node1.childNodes[0], node2, 2, node2.childNodes.length - 1);
        ClearFormat.clear(document, divElement);
        expect(document.getElementById('div5').childNodes[1].nodeName.toLowerCase()).toEqual('#text');
        expect(document.getElementById('div5').querySelectorAll('b').length).toEqual(0);
    });
    it('Clear LI  element', () => {
        new ClearFormat();
        let node1: Node = document.getElementById('paragraph18');
        let node2: HTMLElement = document.getElementById('paragraph23');
        domSelection.setSelectionText(document, node1, node2, 0, node2.childNodes.length);
        ClearFormat.clear(document, divElement);
        expect(document.getElementById('div4').childNodes[0].nodeName.toLowerCase()).toEqual('p');
        expect(document.getElementById('paragraph23').nextElementSibling.nodeName.toLowerCase()).toEqual('ol');
    });
    it('Paragraph with bold  element specific selection', () => {
        new ClearFormat();
        let node: Node = document.getElementById('paragraph3').childNodes[0];
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 11,
            node.childNodes[0].textContent.length);
        ClearFormat.clear(document, divElement);
        expect(document.getElementById('paragraph3').childNodes[0].nodeName.toLowerCase()).toEqual('b');
    });
    it('Paragraph with bold  element Complete selection', () => {
        new ClearFormat();
        let node: Node = document.getElementById('paragraph3');
        domSelection.setSelectionText(document, node, node, 0,
            node.childNodes.length);
        ClearFormat.clear(document, divElement);
        expect(document.getElementById('paragraph3') === null).toBe(true);
    });
    it('mulitple Paragraph with specific selection', () => {
        new ClearFormat();
        let node1: Node = document.getElementById('paragraph1').childNodes[0];
        let node2: Node = document.getElementById('paragraph2');
        domSelection.setSelectionText(document, node1.childNodes[0], node2, 6,
            node2.childNodes.length);
        ClearFormat.clear(document, divElement);
        expect(document.getElementById('paragraph1').childNodes[1].nodeName.toLowerCase()).toEqual('#text');
    });
    it('mulitple Paragraph with Complete selection', () => {
        new ClearFormat();
        let node1: Node = document.getElementById('paragraph1');
        let node2: Node = document.getElementById('paragraph31');
        domSelection.setSelectionText(document, node1, node2, 0,
            node2.childNodes.length);
        ClearFormat.clear(document, divElement);
        expect(document.getElementById('paragraph1') === null).toBe(true);
    });
    it('OL with Complete selection append paragraph', () => {
        new ClearFormat();
        let node1: Node = document.getElementById('div21');
        domSelection.setSelectionText(document, node1.childNodes[0], node1.childNodes[0], 0, 1);
        ClearFormat.clear(document, divElement);
        expect(node1.childNodes[0].nodeName.toLocaleLowerCase()).toBe('p');
    });
});
