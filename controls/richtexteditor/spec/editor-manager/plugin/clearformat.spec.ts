/**
 * ClearFormat spec document
 */
import { detach } from '@syncfusion/ej2-base';
import { NodeSelection } from '../../../src/selection/selection';
import { ClearFormat } from '../../../src/editor-manager/plugin/clearformat';

// describe('Clear multiple formats', () => {
//     let innervalue: string = '<p>Th<strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="color: rgb(255, 0, 0); text-decoration: inherit;"><span id="selectId" style="background-color: rgb(255, 255, 0);">is is a rich text editor content with style formats to be cleare</span></span></span></span></em></strong>d</p>'
//     let domSelection: NodeSelection = new NodeSelection();
//     let divElement: HTMLDivElement = document.createElement('div');
//     divElement.id = 'divElement';
//     divElement.contentEditable = 'true';
//     divElement.innerHTML = innervalue;

//     beforeAll(() => {
//         document.body.appendChild(divElement);
//     });
//     afterAll(() => {
//         detach(divElement);
//     });
    
//     it(' - Clear format when multiple style formats are applied', () => {
//         new ClearFormat();
//         let node1: Node = document.getElementById('selectId');
//         let node2: HTMLElement = document.getElementById('paragraph10');
//         domSelection.setSelectionText(document, node1.childNodes[0], node1.childNodes[0], 3, node1.childNodes[0].textContent.length - 2);
//         ClearFormat.clear(document, divElement, 'P');
//         setTimeout(() => {
//             expect(divElement.innerHTML === '<p>Th<strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="color: rgb(255, 0, 0); text-decoration: inherit;"><span id="selectId" style="background-color: rgb(255, 255, 0);">is </span></span></span></span></em></strong>is a rich text editor content with style formats to be clea<strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;"><span style="color: rgb(255, 0, 0); text-decoration: inherit;"><span id="selectId" style="background-color: rgb(255, 255, 0);">re</span></span></span></span></em></strong>d</p>').toBe(true);
//         }, 100);
//     });
// });

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

    beforeAll(() => {
        document.body.appendChild(divElement);
    });
    afterAll(() => {
        detach(divElement);
    });
    /**
     * Text Node Direct Parent
     */
    it('Clear OL LI img element', () => {
        new ClearFormat();
        let node1: Node = document.getElementById('paragraph4');
        let node2: HTMLElement = document.getElementById('paragraph10');
        domSelection.setSelectionText(document, node1, node2, 0, 2);
        ClearFormat.clear(document, divElement, 'P');
        expect(document.getElementById('div2').childNodes[0].nodeName.toLowerCase()).toEqual('p');
    });
    it('Clear OL LI textnode element', () => {
        let node1: Node = document.getElementById('paragraph11');
        let node2: HTMLElement = document.getElementById('paragraph17');
        domSelection.setSelectionText(document, node1, node2, 0, 1);
        ClearFormat.clear(document, divElement, 'P');
        expect(document.getElementById('div3').childNodes[0].nodeName.toLowerCase()).toEqual('p');
    });
    it('Clear inline element', () => {
        let node1: Node = document.getElementById('div5');
        let node2: HTMLElement = document.getElementById('paragraph26');
        domSelection.setSelectionText(document, node1.childNodes[0], node2, 2, node2.childNodes.length - 1);
        ClearFormat.clear(document, divElement, 'P');
        expect(document.getElementById('div5').childNodes[1].nodeName.toLowerCase()).toEqual('#text');
        expect(document.getElementById('div5').querySelectorAll('b').length).toEqual(0);
    });
    it('Clear LI  element', () => {
        new ClearFormat();
        let node1: Node = document.getElementById('paragraph18');
        let node2: HTMLElement = document.getElementById('paragraph23');
        domSelection.setSelectionText(document, node1, node2, 0, node2.childNodes.length);
        ClearFormat.clear(document, divElement, 'P');
        expect(document.getElementById('div4').childNodes[0].nodeName.toLowerCase()).toEqual('p');
        expect(document.getElementById('div4').querySelectorAll("p")[5].nextElementSibling.nodeName.toLowerCase()).toEqual('ol');
    });
    it('Paragraph with bold  element specific selection', () => {
        new ClearFormat();
        let node: Node = document.getElementById('paragraph3').childNodes[0];
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 11,
            node.childNodes[0].textContent.length);
        ClearFormat.clear(document, divElement, 'P');
        expect(document.getElementById('paragraph3').childNodes[0].nodeName.toLowerCase()).toEqual('b');
    });
    it('Paragraph with bold  element Complete selection', () => {
        new ClearFormat();
        let node: Node = document.getElementById('paragraph3');
        domSelection.setSelectionText(document, node, node, 0,
            node.childNodes.length);
        ClearFormat.clear(document, divElement, 'P');
        expect(document.getElementById('paragraph3') === null).toBe(true);
    });
    it('mulitple Paragraph with specific selection', () => {
        new ClearFormat();
        let node1: Node = document.getElementById('paragraph1').childNodes[0];
        let node2: Node = document.getElementById('paragraph2');
        domSelection.setSelectionText(document, node1.childNodes[0], node2, 6,
            node2.childNodes.length);
        ClearFormat.clear(document, divElement, 'P');
        expect(document.getElementById('paragraph1').childNodes[1].nodeName.toLowerCase()).toEqual('#text');
    });
    it('mulitple Paragraph with Complete selection', () => {
        new ClearFormat();
        let node1: Node = document.getElementById('paragraph1');
        let node2: Node = document.getElementById('paragraph31');
        domSelection.setSelectionText(document, node1, node2, 0,
            node2.childNodes.length);
        ClearFormat.clear(document, divElement, 'P');
        expect(document.getElementById('paragraph1') === null).toBe(true);
    });
    it('OL with Complete selection append paragraph', () => {
        new ClearFormat();
        let node1: Node = document.getElementById('div21');
        domSelection.setSelectionText(document, node1.childNodes[0], node1.childNodes[0], 0, 1);
        ClearFormat.clear(document, divElement, 'P');
        expect(node1.childNodes[0].nodeName.toLocaleLowerCase()).toBe('p');
    });
});

describe('Clear Format commands', () => {
    let innervalue: string = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 14.2857%;">egrege</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;" class="">ergerg</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;" class="">ergeg</td><td style="width: 14.2857%; background-color: rgb(0, 0, 128);" class=""><br></td></tr><tr><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%; background-color: rgb(255, 255, 0);" class="">erg</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;" class="">ergeg</td><td style="width: 14.2857%; background-color: rgb(255, 0, 0);" class="">ergege</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;"><br></td></tr><tr><td style="width: 14.2857%; background-color: rgb(255, 51, 51);" class="">ergeg</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%; background-color: rgb(0, 255, 0);" class="">ergre</td><td style="width: 14.2857%;" class=""><br></td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;" class="">erge</td></tr></tbody></table>'
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
    
    it('EJ2-37160 - Clear Fromat testing for Table element contents', () => {
        new ClearFormat();
        let node1: Node = document.getElementById('divElement');
        let node2: HTMLElement = document.getElementById('paragraph10');
        domSelection.setSelectionText(document, node1, node1, 0, 1);
        ClearFormat.clear(document, divElement, 'P');
        expect(document.querySelectorAll('table').length === 1).toBe(true);
    });
});

describe('905773 - Error When Selecting Table and Clicking Clear Format Toolbar Item in Rich Text Editor', () => {
    let innervalue: string = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 14.2857%;">egrege</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;" class="">ergerg</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;" class="">ergeg</td><td style="width: 14.2857%; background-color: rgb(0, 0, 128);" class=""><br></td></tr><tr><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%; background-color: rgb(255, 255, 0);" class="">erg</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;" class="">ergeg</td><td style="width: 14.2857%; background-color: rgb(255, 0, 0);" class="">ergege</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;"><br></td></tr><tr><td style="width: 14.2857%; background-color: rgb(255, 51, 51);" class="">ergeg</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%; background-color: rgb(0, 255, 0);" class="">ergre</td><td style="width: 14.2857%;" class=""><br></td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;" class="">erge</td></tr></tbody></table><p><br></p>'
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

    it('Error When Selecting Table and Clicking Clear Format Toolbar Item in Rich Text Editor', () => {
        new ClearFormat();
        let node1: Node = document.getElementsByClassName('e-rte-table')[0];
        let node2: HTMLElement = document.getElementsByTagName('p')[0];
        domSelection.setSelectionText(document, node1, node2, 0, 1);
        ClearFormat.clear(document, divElement, 'P');
        expect(document.querySelectorAll('table').length === 1).toBe(true);
    });
});

describe('Clear Format commands', () => {
    let innervalue: string = '<div><b>Content</b></div>'
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
    
    it('Clear format when enter key is configured as `div` - ', () => {
        new ClearFormat();
        let node1: Node = document.getElementById('divElement').childNodes[0].childNodes[0].childNodes[0];
        domSelection.setSelectionText(document, node1, node1, 0, node1.textContent.length);
        ClearFormat.clear(document, divElement, 'DIV');
        expect(document.getElementById('divElement').children[0].nodeName !== 'P').toBe(true);
        expect(document.getElementById('divElement').children[0].nodeName === 'DIV').toBe(true);
    });
});

describe('Clear Format with image caption', () => {
    let innervalue: string = '<p><span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="test.png" width="auto" height="auto" style="min-width: 0px; max-width: 871px; min-height: 0px;"><span class="e-img-inner" contenteditable="true"><strong><em><span id="test" style="text-decoration: underline;">Testing</span></em></strong></span></span></span> </p>'
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
    
    it('EJ2-56310 - Clear format testing for the image caption', () => {
        new ClearFormat();
        let node1: Node = document.querySelector('.e-img-inner #test').lastChild;
        domSelection.setSelectionText(document, node1, node1, 0, 7);
        ClearFormat.clear(document, node1, 'P');
        expect(document.querySelector('.e-img-inner').childElementCount === 0).toBe(true);
    });
});

describe('Bug 907771: BlockQuote Applied Paragraphs Convert to Single Paragraph When Using Clear Format', () => {
    let domSelection: NodeSelection = new NodeSelection();
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    beforeAll(() => {
        document.body.appendChild(divElement);
    });
    afterAll(() => {
        detach(divElement);
    });
    it(' - single line with p tag and blockquote', () => {
        divElement.innerHTML = `<blockquote><p>Testing</p></blockquote>`;
        new ClearFormat();
        let node1: Node = document.getElementById('divElement').childNodes[0].childNodes[0].childNodes[0];
        domSelection.setSelectionText(document, node1, node1, 0, node1.textContent.length);
        ClearFormat.clear(document, divElement, 'P');
        expect(document.getElementById('divElement').childElementCount).toBe(1);
    });
    it(' - single line with p tag and blockquote', () => {
        divElement.innerHTML = `<blockquote><p>Testing</p></blockquote>`;
        new ClearFormat();
        let node1: Node = document.getElementById('divElement').childNodes[0].childNodes[0].childNodes[0];
        domSelection.setSelectionText(document, node1, node1, 0, node1.textContent.length);
        ClearFormat.clear(document, divElement, 'P');
        expect(document.getElementById('divElement').childElementCount).toBe(1);
    });
    it(' - double line with p tags and blockquote', () => {
        divElement.innerHTML = `<blockquote><p>Testing 1</p><p>Testing 2</p></blockquote>`;
        new ClearFormat();
        let node1: Node = document.getElementById('divElement').childNodes[0].childNodes[0].childNodes[0];
        let node2: Node = document.getElementById('divElement').childNodes[0].childNodes[1].childNodes[0];
        domSelection.setSelectionText(document, node1, node2, 0, node1.textContent.length);
        ClearFormat.clear(document, divElement, 'P');
        expect(document.getElementById('divElement').childElementCount).toBe(2);
    });
    it(' - double line with h1 tags and blockquote', () => {
        divElement.innerHTML = `<blockquote><h1>Testing 1</h1><h1>Testing 2</h1></blockquote>`;
        new ClearFormat();
        let node1: Node = document.getElementById('divElement').childNodes[0].childNodes[0].childNodes[0];
        let node2: Node = document.getElementById('divElement').childNodes[0].childNodes[1].childNodes[0];
        domSelection.setSelectionText(document, node1, node2, 0, node1.textContent.length);
        ClearFormat.clear(document, divElement, 'P');
        expect(document.getElementById('divElement').children[0].childElementCount).toBe(2);
    });
    it(' - double line with p tags and blockquote with other styles', () => {
        divElement.innerHTML = `<blockquote><h1>Te<em><span style="text-decoration: underline;">st<span style="background-color: rgb(255, 255, 0);"><span style="color: rgb(255, 0, 0); text-decoration: inherit;">ing 1</span></span></span></em></h1><h1><span style="background-color: rgb(255, 255, 0);"><span style="color: rgb(255, 0, 0); text-decoration: inherit;"><em><span style="text-decoration: underline;">Te</span></em></span></span><span style="background-color: rgb(255, 255, 0);"><span style="color: rgb(255, 0, 0); text-decoration: inherit;">sti</span></span>ng 2</h1></blockquote>`;
        new ClearFormat();
        let node1: Node = document.getElementById('divElement').childNodes[0].childNodes[0].childNodes[0];
        let node2: Node = document.getElementById('divElement').childNodes[0].childNodes[1].childNodes[2];
        domSelection.setSelectionText(document, node1, node2, 0, node2.textContent.length);
        ClearFormat.clear(document, divElement, 'P');
        expect(document.getElementById('divElement').children[0].childElementCount).toBe(2);
    });
});

describe('Bug 969820: Clear format doesnot remove the highlighted color in the new lines in RichTextEditor', () => {
    let domSelection: NodeSelection = new NodeSelection();
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    beforeAll(() => {
        document.body.appendChild(divElement);
    });
    afterAll(() => {
        detach(divElement);
    });
    it('Clear Format action in the Rich Text Editor works properly by removing the highlighted background color from new lines', () => {
        divElement.innerHTML = `<p><code>I have validated that performance issues occur in the RichTextEditor when it is rendered in the dashboard panel. I also checked the Grid component and found that it experiences the same performance issues due to the use of the StateHasChanged method in the dashboard.</code></p><p><code><br></code></p><p><code><br></code></p><p><code>After removing the StateHasChanged method, the performance improved. I have reported this issue to the dashboard team.</code></p>`;
        new ClearFormat();
        let node1: Node = document.getElementById('divElement').childNodes[0].childNodes[0].childNodes[0];
        let node2: Node = document.getElementById('divElement').childNodes[3].childNodes[0].childNodes[0];
        domSelection.setSelectionText(document, node1, node2, 0, node2.textContent.length);
        ClearFormat.clear(document, divElement, 'P');
        expect(document.getElementById('divElement').innerHTML === '<p>I have validated that performance issues occur in the RichTextEditor when it is rendered in the dashboard panel. I also checked the Grid component and found that it experiences the same performance issues due to the use of the StateHasChanged method in the dashboard.</p><p><br></p><p><br></p><p>After removing the StateHasChanged method, the performance improved. I have reported this issue to the dashboard team.</p>').toBe(true);
    });
});