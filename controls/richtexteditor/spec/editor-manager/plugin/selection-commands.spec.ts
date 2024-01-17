/**
 * Selection commands spec document
 */
import { detach, Browser } from '@syncfusion/ej2-base';
import { NodeSelection } from '../../../src/selection/selection';
import { SelectionCommands } from '../../../src/editor-manager/plugin/selection-commands';
import { renderRTE, destroy } from '../../rich-text-editor/render.spec';

describe('Selection commands', () => {
    //HTML value
    let innervalue: string = '<div id="div1"><p id="paragraph1"><b>Description:</b></p>' +
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
        'client side.</span></span>'+
        '<span id="italicparent"><span id="italic1" style="font-style:italic;">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span></span>'+
        '<span id="underlineparent"><u id="underline1">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</u></span>'+
        '<span id="strikeparent"><del id="strike1">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</del></span>'+
        '<span id="cursor1">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="cursor2">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<strong id="cursor3">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</strong>'+
        '<p id="cursor4"><strong id="cursor5">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</strong></p>'+
        '<p id="cursor6"><strong><em><u id="cursor7">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</u></em></strong></p>'+
        '<p id="cursor8"><strong><em><u id="cursor9">the                     Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</u></em></strong>'+
        '<strong id="cursor10">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</strong>'+
        '</p>'+
        '<p id="paragraph01"><b id="bold01">Description:</b></p>' +
        '<p id="paragraph02">The Rich Text Editor (RTE) control is an easy to render in' +
        'client side. Customer easy to edit the contents and get the HTML content for' +
        'the displayed content. A rich text editor control provides users with a toolbar' +
        'that helps them to apply rich text formats to the text entered in the text' +
        'area. </p>' +
        '<p id="paragraph03"><br/></p>' +
        '<span id="format1">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="format2">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client <span id="format3">side</span>.</span>'+
        '<span id="format4">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span><strong id="format5">the   <em><u>Rich Text Editor (RTE)</u></em></strong> control is an easy to render in' +
        'client side.</span>'+
        '<p><span id="format6">the Rich Text Editor (RTE) <span style="color:rgb(102, 102, 0);">control</span> is an easy to render in' +
        'client side.</span></p>'+
        '<ol>'+
        '<li><p id="paragraph20">paragraph20</p></li>'+
        '<li><p id="paragraph21">paragraph21</p></li>'+
        '<li><p id="paragraph22">paragraph22</p></li>'+
        '<li><p id="paragraph23">paragraph23</p></li>'+
        '<li><p id="paragraph24">paragraph24</p></li>'+
        '<li><p id="paragraph25">paragraph25</p></li>'+
        '<li><p id="paragraph26">paragraph26</p></li>'+
        '</ol>'+
        '<ol>'+
        '<li><p id="paragraph27">paragraph27&nbsp;</p></li>'+
        '<li><p id="paragraph28">paragraph28</p></li>'+
        '<li><p id="paragraph30">paragraph30</p></li>'+
        '<li><p id="paragraph31">paragraph31</p></li>'+
        '<li><p id="paragraph32">paragraph32</p></li>'+
        '<li><p id="paragraph33">paragraph33</p></li>'+
        '<li><p id="paragraph34">paragraph34</p></li>'+
        '<li><p id="paragraph35">paragraph35</p></li>'+
        '</ol>'+
        '<p id="paragraph29"><strong>paragraph29</strong></p>'+
        '</div>';

    let domSelection: NodeSelection = new NodeSelection();
    //DIV Element
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    let ptag: Node = null;
    let fontTag: Node = null;
    let parentDiv: HTMLDivElement;

    beforeAll(() => {
        document.body.appendChild(divElement);
        parentDiv = document.getElementById('div1') as HTMLDivElement;
    });
    afterAll(() => {
        detach(divElement);
    });
    /**
     * Text Node Direct Parent
     */
    it('Apply italic tag for end nodes', () => {
        let node1: Node = document.getElementById('bold01');
        let text1: Text = node1.childNodes[0] as Text;
        let node2: HTMLElement = document.getElementById('paragraph02');
        let text2: Text = node2.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text2, 12, 16);
        SelectionCommands.applyFormat(document, 'italic', parentDiv, 'P');
        expect(node1.childNodes.length).toEqual(2);
    });
    it('Apply italic tag for None nodes', () => {
        let node1: Node = document.getElementById('paragraph03');
        domSelection.setSelectionText(document, node1, node1, 0, 0);
        SelectionCommands.applyFormat(document, 'italic', parentDiv, 'P');
        expect(node1.childNodes.length).toEqual(1);
    });
    it('Apply Bold tag for multiple nodes', () => {
        let node1: Node = document.getElementById('paragraph4');
        let text1: Text = node1.childNodes[0] as Text;
        let node2: HTMLElement = document.getElementById('paragraph9');
        let text2: Text = node2.childNodes[0] as Text;
        ptag = node1;
        domSelection.setSelectionText(document, text1, text2, 0, 16);
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect(node1.childNodes[0].nodeName.toLowerCase()).toEqual('strong');
    });
    it('Apply subscript tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document, 'subscript', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('sub');
    });
    it('Apply underline tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document, 'underline', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('span');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0] as HTMLElement)
        .style.textDecoration).toEqual('underline');
    });
    it('Apply strikethrough tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document, 'strikethrough', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('span');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0] as HTMLElement)
        .style.textDecoration).toEqual('line-through');
    });
    it('Apply superscript tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document, 'superscript', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('sup');
    });
    it('Apply Italic tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document, 'italic', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0]
            .childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('em');
    });
    it('Revert Italic tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document,'italic', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0]
            .childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert superscript tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document,'superscript', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert strikethrough tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document,'strikethrough', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert underline tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document,'underline', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert Bold tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document,'bold', parentDiv, 'P');
        expect(ptag.childNodes[0].nodeName).toEqual('#text');
    });
    it('Apply Bold tag for cursor position', () => {
        let node1: Node = document.getElementById('paragraph4');
        let text1: Text = node1.childNodes[0] as Text;
        ptag = node1;
        domSelection.setSelectionText(document, text1, text1, 1, 1);
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect(node1.childNodes[0].nodeName.toLowerCase()).toEqual('strong');
    });
    it('Apply subscript tag for cursor position', () => {
        SelectionCommands.applyFormat(document, 'subscript', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('sub');
    });
    it('Apply underline tag for cursor position', () => {
        SelectionCommands.applyFormat(document, 'underline', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('span');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0] as HTMLElement).style.textDecoration).toEqual('underline');
    });
    it('Apply strikethrough tag for cursor position', () => {
        SelectionCommands.applyFormat(document, 'strikethrough', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply superscript tag for cursor position', () => {
        SelectionCommands.applyFormat(document, 'superscript', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('sup');
    });
    it('Apply Italic tag for cursor position', () => {
        SelectionCommands.applyFormat(document, 'italic', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0]
            .childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('em');
    });
    it('Revert Italic tag for cursor position', () => {
        SelectionCommands.applyFormat(document,'italic', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0]
            .childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert superscript tag for cursor position', () => {
        SelectionCommands.applyFormat(document,'superscript', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert strikethrough tag for cursor position', () => {
        SelectionCommands.applyFormat(document,'strikethrough', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert underline tag for cursor position', () => {
        SelectionCommands.applyFormat(document,'underline', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert Bold tag for cursor position', () => {
        SelectionCommands.applyFormat(document,'bold', parentDiv, 'P');
        expect(ptag.childNodes[0].nodeName).toEqual('#text');
    });
    it('Apply Bold tag for text node', () => {
        let node1: Node = document.getElementById('paragraph4');
        let text1: Text = node1.childNodes[0] as Text;
        ptag = node1;
        domSelection.setSelectionText(document, text1, text1, 0, 7);
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect(node1.childNodes[0].nodeName.toLowerCase()).toEqual('strong');
    });
    it('Apply subscript tag for text node', () => {
        SelectionCommands.applyFormat(document, 'subscript', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('sub');
    });
    it('Apply underline tag for text node', () => {
        SelectionCommands.applyFormat(document, 'underline', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('span');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0] as HTMLElement)
        .style.textDecoration).toEqual('underline');
    });
    it('Apply strikethrough tag for text node', () => {
        SelectionCommands.applyFormat(document, 'strikethrough', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('span');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0] as HTMLElement)
        .style.textDecoration).toEqual('line-through');
    });
    it('Apply superscript tag for text node', () => {
        SelectionCommands.applyFormat(document, 'superscript', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('sup');
    });
    it('Apply Italic tag for text node', () => {
        SelectionCommands.applyFormat(document, 'italic', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0]
            .childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('em');
    });
    it('Revert Italic tag for text node', () => {
        SelectionCommands.applyFormat(document,'italic', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0]
            .childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert superscript tag for text node', () => {
        SelectionCommands.applyFormat(document,'superscript', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert strikethrough tag for text node', () => {
        SelectionCommands.applyFormat(document,'strikethrough', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert underline tag for text node', () => {
        SelectionCommands.applyFormat(document,'underline', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert Bold tag for text node', () => {
        SelectionCommands.applyFormat(document,'bold', parentDiv, 'P');
        expect(ptag.childNodes[0].nodeName).toEqual('#text');
    });

    // Apply font color
    it('Apply fontcolor tag for text node', () => {
        let node1: Node = document.getElementById('paragraph11');
        let text1: Text = node1.childNodes[0] as Text;
        ptag = node1;
        domSelection.setSelectionText(document, text1, text1, 0, 26);
        SelectionCommands.applyFormat(document, 'fontcolor', parentDiv, 'P', 'rgb(102, 102, 0)');
        expect((node1.childNodes[0] as HTMLElement).style.color).toEqual('rgb(102, 102, 0)');
        expect((node1.childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply fontname tag for text node', () => {
        SelectionCommands.applyFormat(document, 'fontname', parentDiv, 'P', 'Arial');
        expect((ptag.childNodes[0] as HTMLElement).style.fontFamily).toEqual('Arial');
        expect((ptag.childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply fontsize tag for text node', () => {
        SelectionCommands.applyFormat(document, 'fontsize', parentDiv, 'P', '20px');
        expect((ptag.childNodes[0] as HTMLElement).style.fontSize).toEqual('20px');
        expect((ptag.childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply backgroundcolor tag for text node', () => {
        SelectionCommands.applyFormat(document, 'backgroundcolor', parentDiv, 'P', 'rgb(246, 198, 206)');
        expect((ptag.childNodes[0].childNodes[0] as HTMLElement).style.backgroundColor).toEqual('rgb(246, 198, 206)');
        expect((ptag.childNodes[0].childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply uppercase tag for text node', () => {
        SelectionCommands.applyFormat(document, 'uppercase', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0]
        .childNodes[0].textContent).toEqual('THE RICH TEXT EDITOR (RTE)');
    });
    it('Re - Apply lowercase tag for text node', () => {
        SelectionCommands.applyFormat(document, 'lowercase', parentDiv, 'P');
        fontTag = ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
        expect(ptag.childNodes[0].childNodes[0].childNodes[0]
            .childNodes[0].textContent).toEqual('the rich text editor (rte)');
    });
    it('Re - Apply backgroundcolor tag for text node', () => {
        SelectionCommands.applyFormat(document, 'backgroundcolor', parentDiv, 'P', 'rgb(246, 198, 2)');
        expect((ptag.childNodes[0].childNodes[0] as HTMLElement).style.backgroundColor).toEqual('rgb(246, 198, 2)');
        expect((ptag.childNodes[0].childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Re - Apply fontsize tag for text node', () => {
        SelectionCommands.applyFormat(document, 'fontsize', parentDiv, 'P', '40px');
        expect((ptag.childNodes[0] as HTMLElement).style.fontSize).toEqual('40px');
        expect((ptag.childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Re - Apply fontname tag for text node', () => {
        SelectionCommands.applyFormat(document, 'fontname', parentDiv, 'P', 'monospace');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0] as HTMLElement).style.fontFamily).toEqual('monospace');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Re - Apply fontcolor tag for text node', () => {
        SelectionCommands.applyFormat(document, 'fontcolor', parentDiv, 'P', 'rgb(226, 10, 10)');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0] as HTMLElement).style.color).toEqual('rgb(226, 10, 10)');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply fontcolor tag for already applied specific text node', () => {
        fontTag = ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
        let text1: Text = fontTag.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 3, 10);
        SelectionCommands.applyFormat(document, 'fontcolor', parentDiv, 'P', 'rgb(102, 102, 0)');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[1] as HTMLElement).style.color).toEqual('rgb(102, 102, 0)');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[1] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply fontname tag for already applied specific text node', () => {
        SelectionCommands.applyFormat(document, 'fontname', parentDiv, 'P', 'Arial');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[1] as HTMLElement).style.fontFamily).toEqual('Arial');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[1] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply fontsize tag for already applied specific text node', () => {
        SelectionCommands.applyFormat(document, 'fontsize', parentDiv, 'P', '20px');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[1] as HTMLElement).style.fontSize).toEqual('20px');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[1] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply backgroundcolor tag for already applied specific text node', () => {
        SelectionCommands.applyFormat(document, 'backgroundcolor', parentDiv, 'P', 'rgb(246, 198, 206)');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0] as HTMLElement).style.backgroundColor).toEqual('rgb(246, 198, 206)');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply uppercase tag for already applied specific text node', () => {
        SelectionCommands.applyFormat(document, 'uppercase', parentDiv, 'P');
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].textContent).toEqual(' RICH T');
    });

    // spec coverage 
    it('Apply Bold tag for span style node', () => {
        let node1: Node = document.getElementById('bold1');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 0, 3);
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect(document.getElementById('boldparent').childNodes[0].textContent).toEqual('the');
    });
    it('Apply Italic tag for span style node', () => {
        let node1: Node = document.getElementById('italic1');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 0, 3);
        SelectionCommands.applyFormat(document, 'italic', parentDiv, 'P');
        expect(document.getElementById('italicparent').childNodes[0].textContent).toEqual('the');
    });
    it('Apply Underline tag for span style node', () => {
        let node1: Node = document.getElementById('underline1');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 0, 3);
        SelectionCommands.applyFormat(document, 'underline', parentDiv, 'P');
        expect(document.getElementById('italicparent').childNodes[0].textContent).toEqual('the');
    });
    it('Apply Strike tag for span style node', () => {
        let node1: Node = document.getElementById('strike1');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 0, 3);
        SelectionCommands.applyFormat(document, 'strikethrough', parentDiv, 'P');
        expect(document.getElementById('italicparent').childNodes[0].textContent).toEqual('the');
    });
    it('Apply Bold tag for cursor position 1', () => {
        let node1: Node = document.getElementById('cursor1');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 5, 5);
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect(node1.childNodes[1].nodeName.toLowerCase()).toEqual('strong');
    });
    it('Apply Bold tag for cursor position 2', () => {
        let node1: Node = document.getElementById('cursor5');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 4, 4);
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect(document.getElementById('cursor4').childNodes[1].nodeName.toLowerCase()).toEqual('#text');
    });
    it('Apply Bold tag for cursor position 3', () => {
        let node1: Node = document.getElementById('cursor7');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 4, 4);
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect(document.getElementById('cursor6').childNodes.length).toEqual(3);
    });
    it('Apply uppercase tag for cursor position 1', () => {
        let node1: Node = document.getElementById('cursor7');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 4, 4);
        SelectionCommands.applyFormat(document, 'uppercase', parentDiv, 'P');
        expect(document.getElementById('cursor6').childNodes.length).toEqual(3);
    });
    it('Apply strikethrough tag for cursor position 1', () => {
        let node1: Node = document.getElementById('cursor9');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 3, 3);
        SelectionCommands.applyFormat(document, 'strikethrough', parentDiv, 'P');
        expect(document.getElementById('cursor8').childNodes.length).toEqual(2);
    });
    // Branch coverage
    it('Unknown tag for cursor position', () => {
        let node1: Node = document.getElementById('cursor1');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 0, 3);
        SelectionCommands.applyFormat(document, 'scripts', parentDiv, 'P');
        expect(node1.nodeName.toLowerCase()).toEqual('span');
    });
    it('un formatted tag for selection', () => {
        let node1: Node = document.getElementById('cursor2');
        let node2: Node = document.getElementById('cursor3');
        let text1: Text = node1.childNodes[0] as Text;
        let text2: Text = node2.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text2, 0, 3);
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect(node1.childNodes[0].nodeName.toLowerCase()).toEqual('strong');
    });
    it('Edge browser formatted issue', () => {
        let node1: Node = document.getElementById('format1');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 0, text1.nodeValue.length);
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect(node1.childNodes[0].nodeName.toLowerCase()).toEqual('strong');
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect(node1.childNodes[0].nodeName.toLowerCase()).toEqual('#text');
    });
    it('Cursor pointer multiple style with empty node applied issue', () => {
        let regEx: RegExp = new RegExp(String.fromCharCode(8203), 'g');
        let node1: Node = document.getElementById('format4');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 0, 0);
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect((node1 as HTMLElement).children[0].textContent.match(regEx)).not.toBe(null);
        SelectionCommands.applyFormat(document, 'italic', parentDiv, 'P');
        expect((node1 as HTMLElement).children[0].children[0].textContent.match(regEx)).not.toBe(null);
        SelectionCommands.applyFormat(document, 'underline', parentDiv, 'P');
        expect((node1 as HTMLElement).children[0].children[0].textContent.match(regEx)).not.toBe(null);
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect(node1.childNodes[2].nodeName.toLowerCase()).toEqual('em');
        expect(node1.childNodes[2].childNodes[1].nodeName.toLowerCase()).toEqual('span');
    });
    it('Cursor pointer multiple style with textnode applied issue', () => {
        let node1: Node = document.getElementById('format5').querySelector('u');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, text1.nodeValue.length, text1.nodeValue.length);
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect(document.getElementById('format5').nextSibling.nodeName.toLowerCase()).toEqual('em');
        expect(document.getElementById('format5').nextSibling.childNodes[0].nodeName.toLowerCase()).toEqual('u');
    });
    it('transparent background color not apllied issue', () => {
        let node1: Node = document.getElementById('format6');
        domSelection.setSelectionText(document, node1, node1, 0, node1.childNodes.length);
        SelectionCommands.applyFormat(document, 'fontcolor', parentDiv, 'P', '');
        expect((document.getElementById('format6').childNodes[1] as HTMLElement).style.color).toEqual('');
    });
    it('Apply fontsize tag for list elements', () => {
        let node1: Node = document.getElementById('paragraph20');
        let listNode1: Text = node1.childNodes[0] as Text;
        let node2: Node = document.getElementById('paragraph26');
        let listNode2: Text = node2.childNodes[0] as Text;
        domSelection.setSelectionText(document, listNode1, listNode2, 0, 11);
        SelectionCommands.applyFormat(document, 'fontsize', parentDiv, 'P', '36px');
        expect(document.getElementById('paragraph20').parentElement.style.fontSize).toEqual('36px');
        expect(document.getElementById('paragraph21').parentElement.style.fontSize).toEqual('36px');
        expect(document.getElementById('paragraph22').parentElement.style.fontSize).toEqual('36px');
        expect(document.getElementById('paragraph23').parentElement.style.fontSize).toEqual('36px');
        expect(document.getElementById('paragraph24').parentElement.style.fontSize).toEqual('36px');
        expect(document.getElementById('paragraph25').parentElement.style.fontSize).toEqual('36px');
        expect(document.getElementById('paragraph26').parentElement.style.fontSize).toEqual('36px');
    });
    it('Apply fontcolor tag for list elements', () => {
        let node1: Node = document.getElementById('paragraph30');
        let listNode1: Text = node1.childNodes[0] as Text;
        let node2: Node = document.getElementById('paragraph35');
        let listNode2: Text = node2.childNodes[0] as Text;
        domSelection.setSelectionText(document, listNode1, listNode2, 0, 11);
        SelectionCommands.applyFormat(document, 'fontcolor', parentDiv, 'P', 'rgb(83, 129, 53)');
        expect(document.getElementById('paragraph30').parentElement.style.color).toEqual('rgb(83, 129, 53)');
        expect(document.getElementById('paragraph31').parentElement.style.color).toEqual('rgb(83, 129, 53)');
        expect(document.getElementById('paragraph32').parentElement.style.color).toEqual('rgb(83, 129, 53)');
        expect(document.getElementById('paragraph33').parentElement.style.color).toEqual('rgb(83, 129, 53)');
        expect(document.getElementById('paragraph34').parentElement.style.color).toEqual('rgb(83, 129, 53)');
        expect(document.getElementById('paragraph35').parentElement.style.color).toEqual('rgb(83, 129, 53)');
    });

    it('Apply fontsize tag for list elements', () => {
        let node1: Node = document.getElementById('paragraph20');
        //The childnode changed because the span element is added to list element with styles
        let listNode1: Text = node1.childNodes[0].childNodes[0] as Text;
        let node2: Node = document.getElementById('paragraph26');
        let listNode2: Text = node2.childNodes[0].childNodes[0] as Text;
        domSelection.setSelectionText(document, listNode1, listNode2, 5, 5);
        SelectionCommands.applyFormat(document, 'fontsize', parentDiv, 'P', '10px');
        expect(document.getElementById('paragraph20').parentElement.style.fontSize).not.toEqual('10px');
        expect(((document.getElementById('paragraph20').firstElementChild as HTMLElement).tagName.toLowerCase()) === 'span').toBe(true);
        expect((document.getElementById('paragraph20').childNodes[1] as HTMLElement).style.fontSize).toEqual('10px');
        expect(document.getElementById('paragraph21').parentElement.style.fontSize).toEqual('10px');
        expect(document.getElementById('paragraph22').parentElement.style.fontSize).toEqual('10px');
        expect(document.getElementById('paragraph23').parentElement.style.fontSize).toEqual('10px');
        expect(document.getElementById('paragraph24').parentElement.style.fontSize).toEqual('10px');
        expect(document.getElementById('paragraph25').parentElement.style.fontSize).toEqual('10px');
        expect(document.getElementById('paragraph26').parentElement.style.fontSize).not.toEqual('10px');
        expect((document.getElementById('paragraph26').firstElementChild.tagName.toLowerCase()) === 'span').toBe(true);
        expect((document.getElementById('paragraph26').firstElementChild as HTMLElement).style.fontSize).toEqual('10px');
    });
    it('Apply fontsize tag for list elements with space', () => {
        let node1: Node = document.getElementById('paragraph27');
        let listNode1: Text = node1.childNodes[0] as Text;
        let node2: Node = document.getElementById('paragraph28');
        let listNode2: Text = node2.childNodes[0] as Text;
        domSelection.setSelectionText(document, listNode1, listNode2, 0, 11);
        SelectionCommands.applyFormat(document, 'fontsize', parentDiv, 'P', '36px');
        expect(document.getElementById('paragraph27').parentElement.style.fontSize).toEqual('36px');
        expect(document.getElementById('paragraph28').parentElement.style.fontSize).toEqual('36px');
    });
    it('Apply Bold tag for cursor position with next element as empty', () => {
        let node1: Node = document.getElementById('paragraph29');
        let text1: Text = node1.childNodes[0].childNodes[0] as Text;
        ptag = node1;
        domSelection.setSelectionText(document, text1, text1, 11, 11);
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect((node1 as HTMLElement).querySelectorAll('strong').length).toEqual(1);
    });
});

describe('EJ2-52289- Textcolor is removed for the range node, when removing the formats', () => {
    //HTML value
    let innervalue: string = `<p>Value <span style="text-decoration: underline;"><span style="color: rgb(255, 0, 0); text-decoration: inherit;">Testing</span></span><span style="color: rgb(255, 0, 0); text-decoration: inherit;">​</span></p><p><span style="color: rgb(68, 114, 196); text-decoration: inherit;"><strong><em><span style="text-decoration: underline;">TextColorTesting</span></em></strong></span></p>`;
    let rteObj: any;
    let rteID: any;
    let boldItem: any;
    let italicItem: any;
    let underlineItem: any;

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: innervalue,
            toolbarSettings: {
                items: ['Bold', 'Italic', 'Underline']
            },
            created: function() {
                rteID = document.body.querySelector('.e-richtexteditor').id;
                boldItem = document.body.querySelector('#' + rteID + '_toolbar_Bold')
                italicItem = document.body.querySelector('#' + rteID + '_toolbar_Italic')
                underlineItem = document.body.querySelector('#' + rteID + '_toolbar_Underline')
            }
        });
        done();
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('Checking the fontColor for the node not being removed', (done) => {
        rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.inputElement.lastElementChild.firstElementChild.lastElementChild.lastElementChild.lastElementChild.firstChild, rteObj.inputElement.lastElementChild.firstElementChild.lastElementChild.lastElementChild.lastElementChild.firstChild.textContent.length);
        underlineItem.click();
        italicItem.click();
        boldItem.click();
        expect((rteObj as any).inputElement.children[1].firstElementChild.style.color).toBe('rgb(68, 114, 196)');
        done();
    });
});

describe('EJ2-57778- Console error occurs and format not applied, when removing the formats', () => {
    //HTML value
    let innervalue: string = `<p><strong>​<em>​<span style="text-decoration: underline;">Testing</span></em></strong></p>`;
    let rteObj: any;
    let rteID: any;
    let boldItem: any;
    let italicItem: any;
    let underlineItem: any;

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: innervalue,
            toolbarSettings: {
                items: ['Bold', 'Italic', 'Underline']
            },
            created: function() {
                rteID = document.body.querySelector('.e-richtexteditor').id;
                boldItem = document.body.querySelector('#' + rteID + '_toolbar_Bold')
                italicItem = document.body.querySelector('#' + rteID + '_toolbar_Italic')
                underlineItem = document.body.querySelector('#' + rteID + '_toolbar_Underline')
            }
        });
        done();
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('when removing all formats in the editor', (done) => {
        rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.inputElement.lastElementChild.firstElementChild.lastElementChild.firstElementChild.lastChild, 7);
        boldItem.click();
        expect((rteObj as any).inputElement.innerHTML).toBe('<p><strong>​<em>​<span style="text-decoration: underline;">Testing</span></em></strong><em><span style="text-decoration: underline;">​</span></em></p>');
        italicItem.click();
        expect((rteObj as any).inputElement.innerHTML).toBe('<p><strong>​<em>​<span style="text-decoration: underline;">Testing</span></em></strong><span style="text-decoration: underline;">​</span></p>');
        underlineItem.click();
        expect((rteObj as any).inputElement.innerHTML).toBe('<p><strong>​<em>​<span style="text-decoration: underline;">Testing</span></em></strong>​</p>');
        done();
    });
});

describe('EJ2-57778- Console error occurs, when removing the particular format', () => {
    let innervalue: string = `<p>Testing</p>`;
    let rteObj: any;
    let rteID: any;
    let boldItem: any;
    let italicItem: any;
    let underlineItem: any;

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: innervalue,
            toolbarSettings: {
                items: ['Bold', 'Italic', 'Underline']
            },
            created: function() {
                rteID = document.body.querySelector('.e-richtexteditor').id;
                boldItem = document.body.querySelector('#' + rteID + '_toolbar_Bold')
                italicItem = document.body.querySelector('#' + rteID + '_toolbar_Italic')
                underlineItem = document.body.querySelector('#' + rteID + '_toolbar_Underline')
            }
        });
        done();
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('when adding/removing bold format', (done) => {
        rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.inputElement.lastElementChild.lastChild, 7);
        boldItem.click();
        expect((rteObj as any).inputElement.innerHTML).toBe('<p>Testing<strong>​</strong></p>');
        boldItem.click();
        expect((rteObj as any).inputElement.innerHTML).toBe('<p>Testing​</p>');
        done();
    });
});

describe('EJ2-59075 - The font name is not getting properly while loading custom font ', () => {
    let innervalue: string = `<p><span class="focusNode" style="font-family: &quot;Kaushan Script&quot;;">​</span></p>`;
    let rteObj: any;

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: innervalue,
            toolbarSettings: {
                items: ['Bold', 'Italic', 'Underline', 'FontColor', 'BackgroundColor']
            }
        });
        done();
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('The font name is not changed properly issue - EJ2-59075 ', (done) => {
        let focusNode = rteObj.inputElement.querySelector('.focusNode');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, focusNode.childNodes[0], focusNode.childNodes[0], 1, 1);
        SelectionCommands.applyFormat(document, 'fontname', rteObj.inputElement, 'P', 'Arial');
        expect((rteObj as any).inputElement.innerHTML).toBe(`<p><span class="focusNode" style="font-family: Arial;"><br></span></p>`);
        done();
    });
});

describe('EJ2-60277 - Formatting is not maintained properly while unselecting the strikethrough style', () => {
    let innervalue: string = `<p><span style="text-decoration: underline;">​<span style="text-decoration: line-through;" class="focusNode">RTE Content</span></span></p>`;
    let rteObj: any;

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: innervalue,
            toolbarSettings: {
                items: ['StrikeThrough']
            }
        });
        done();
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('Formatting is not maintained properly while unselecting the strikethrough style', (done) => {
        let focusNode = rteObj.inputElement.querySelector('.focusNode');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, focusNode.childNodes[0], focusNode.childNodes[0], 11, 11);
        SelectionCommands.applyFormat(document, 'strikethrough', rteObj.inputElement, 'P');
        expect((rteObj as any).inputElement.innerHTML).toBe(`<p><span style="text-decoration: underline;">​<span style="text-decoration: line-through;" class="focusNode">RTE Content</span>​</span></p>`);
        done();
    });
});

describe('EJ2-58803 - Styles format not maintain properly when applied different formats Xamarin reported', () => {
    let innervalue: string = `<p><strong>​<em>​<span style="text-decoration: underline;">​<span style="color: rgb(255, 0, 0); text-decoration: inherit;">​<span class="focusNode" style="background-color: rgb(255, 255, 0);">RTE Content</span></span></span></em></strong></p>`;
    let rteObj: any;

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: innervalue,
            toolbarSettings: {
                items: ['Bold', 'Italic', 'Underline', 'FontColor', 'BackgroundColor']
            }
        });
        done();
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('Case 1 of the formating issue - EJ2-58803 ', (done) => {
        let focusNode = rteObj.inputElement.querySelector('.focusNode');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, focusNode.childNodes[0], focusNode.childNodes[0], 11, 11);
        SelectionCommands.applyFormat(document, 'underline', rteObj.inputElement, 'P');
        SelectionCommands.applyFormat(document, 'italic', rteObj.inputElement, 'P');
        SelectionCommands.applyFormat(document, 'bold', rteObj.inputElement, 'P');
        expect((rteObj as any).inputElement.innerHTML).toBe(`<p><strong>​<em>​<span style="text-decoration: underline;">​<span style="color: rgb(255, 0, 0); text-decoration: inherit;">​<span class="focusNode" style="background-color: rgb(255, 255, 0);">RTE Content</span></span></span><span style="color: rgb(255, 0, 0); text-decoration: inherit;"><span class="focusNode" style="background-color: rgb(255, 255, 0);">​</span></span></em><span style="color: rgb(255, 0, 0); text-decoration: inherit;"><span class="focusNode" style="background-color: rgb(255, 255, 0);">​</span></span></strong><span style="color: rgb(255, 0, 0); text-decoration: inherit;"><span class="focusNode" style="background-color: rgb(255, 255, 0);">​</span></span></p>`);
        done();
    });
});

describe('EJ2-58803 - Styles format not maintain properly when applied different formats Xamarin reported', () => {
    let innervalue: string = `<p><strong>​<em>​<span style="text-decoration: underline;">​<span class="focusNode" style="color: rgb(255, 0, 0); text-decoration: inherit;">RTE Content</span></span></em></strong></p>`;
    let rteObj: any;

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: innervalue,
            toolbarSettings: {
                items: ['Bold', 'Italic', 'Underline', 'FontColor', 'BackgroundColor']
            }
        });
        done();
    });
    afterAll(() => {
        destroy(rteObj);
    });

    it('Case 2 of the formating issue - EJ2-58803 ', (done) => {
        let focusNode = rteObj.inputElement.querySelector('.focusNode');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, focusNode.childNodes[0], focusNode.childNodes[0], 11, 11);
        SelectionCommands.applyFormat(document, 'underline', rteObj.inputElement, 'P');
        SelectionCommands.applyFormat(document, 'italic', rteObj.inputElement, 'P');
        SelectionCommands.applyFormat(document, 'bold', rteObj.inputElement, 'P');
        SelectionCommands.applyFormat(document, 'backgroundcolor', rteObj.inputElement, 'P', 'rgb(246, 198, 206)');
        expect((rteObj as any).inputElement.innerHTML).toBe(`<p><strong>​<em>​<span style="text-decoration: underline;">​<span class="focusNode" style="color: rgb(255, 0, 0); text-decoration: inherit;">RTE Content</span></span><span class="focusNode" style="color: rgb(255, 0, 0); text-decoration: inherit;">​</span></em><span class="focusNode" style="color: rgb(255, 0, 0); text-decoration: inherit;">​</span></strong><span class="focusNode" style="color: rgb(255, 0, 0); text-decoration: inherit;">​<span style="background-color: rgb(246, 198, 206);">​</span></span></p>`);
        done();
    });
});

describe('EJ2-58803 - Styles format not maintain properly when applied different formats Xamarin reported', () => {
    let innervalue: string = `<p><span style="color: rgb(255, 0, 0); text-decoration: inherit;">​<span style="background-color: rgb(255, 255, 0);">​<strong>​<em>​<span class="focusNode" style="text-decoration: underline;">RTE Content</span></em></strong></span></span></p>`;
    let rteObj: any;

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: innervalue,
            toolbarSettings: {
                items: ['Bold', 'Italic', 'Underline', 'FontColor', 'BackgroundColor']
            }
        });
        done();
    });
    afterAll(() => {
        destroy(rteObj);
    });

    it('Case 4 of the formating issue - EJ2-58803 ', (done) => {
        let focusNode = rteObj.inputElement.querySelector('.focusNode');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, focusNode.childNodes[0], focusNode.childNodes[0], 11, 11);
        SelectionCommands.applyFormat(document, 'underline', rteObj.inputElement, 'P');
        SelectionCommands.applyFormat(document, 'italic', rteObj.inputElement, 'P');
        SelectionCommands.applyFormat(document, 'bold', rteObj.inputElement, 'P');
        SelectionCommands.applyFormat(document, 'fontcolor', rteObj.inputElement, 'P', 'rgb(83, 129, 53)');
        SelectionCommands.applyFormat(document, 'backgroundcolor', rteObj.inputElement, 'P', 'rgb(246, 198, 206)');
        expect((rteObj as any).inputElement.innerHTML).toBe(`<p><span style="color: rgb(255, 0, 0); text-decoration: inherit;">​<span style="background-color: rgb(255, 255, 0);">​<strong>​<em>​<span class="focusNode" style="text-decoration: underline;">RTE Content</span>​</em>​</strong>​</span></span><span style="color: rgb(83, 129, 53); text-decoration: inherit;"><span style="background-color: rgb(246, 198, 206);">​</span></span></p>`);
        done();
    });
});

describe('EJ2-58803 - Styles format not maintain properly when applied different formats Xamarin reported', () => {
    let innervalue: string = `<p><span style="color: rgb(255, 0, 0); text-decoration: inherit;">​<span style="background-color: rgb(255, 255, 0);">​<strong>​<em>​<span class="focusNode" style="text-decoration: underline;">RTE Content</span></em></strong></span></span></p>`;
    let rteObj: any;

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: innervalue,
            toolbarSettings: {
                items: ['Bold', 'Italic', 'Underline', 'FontColor', 'BackgroundColor']
            }
        });
        done();
    });
    afterAll(() => {
        destroy(rteObj);
    });

    it('Case 5 of the formating issue - EJ2-58803 ', (done) => {
        let focusNode = rteObj.inputElement.querySelector('.focusNode');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, focusNode.childNodes[0], focusNode.childNodes[0], 11, 11);
        SelectionCommands.applyFormat(document, 'backgroundcolor', rteObj.inputElement, 'P', 'rgb(246, 198, 206)');
        SelectionCommands.applyFormat(document, 'fontcolor', rteObj.inputElement, 'P', 'rgb(83, 129, 53)');
        expect((rteObj as any).inputElement.innerHTML).toBe(`<p><span style="color: rgb(255, 0, 0); text-decoration: inherit;">​<span style="background-color: rgb(255, 255, 0);">​<strong>​<em>​<span class="focusNode" style="text-decoration: underline;">RTE Content</span></em></strong></span><span style="background-color: rgb(246, 198, 206);"><strong><em><span class="focusNode" style="text-decoration: underline;">​</span></em></strong></span></span><span style="color: rgb(83, 129, 53); text-decoration: inherit;"><span style="background-color: rgb(246, 198, 206);"><strong><em><span class="focusNode" style="text-decoration: underline;">​</span></em></strong></span></span></p>`);
        done();
    });
});

describe('Selection Testing with Multiple nodes', () => {
    //HTML value
    let innervalue: string = '<p><strong>​<em>​<span style="text-decoration: underline;">​Testing</span></em>'
    + '</strong><br></p><p><strong><em><span style="text-decoration: underline;"><br></span></em></strong></p>';

    let rteEle: HTMLElement;
    let rteObj: any;
    let rteID: any;
    let boldItem: any;
    let italicItem: any;
    let underlineItem: any;

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: innervalue,
            toolbarSettings: {
                items: ['Bold', 'Italic', 'Underline']
            },
            created: function() {
                rteID = document.body.querySelector('.e-richtexteditor').id;
                boldItem = document.body.querySelector('#' + rteID + '_toolbar_Bold')
                italicItem = document.body.querySelector('#' + rteID + '_toolbar_Italic')
                underlineItem = document.body.querySelector('#' + rteID + '_toolbar_Underline')
            }
        });
        done();
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('Checking the nodes innerHTML', (done) => {
        rteObj.inputElement.childNodes[1].focus();
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[1], rteObj.inputElement.childNodes[1], 0, 0);
        boldItem.click();
        expect(rteObj.inputElement.childNodes[1].firstElementChild.tagName.toLowerCase()).not.toBe('strong');
        italicItem.click();
        expect(rteObj.inputElement.childNodes[1].firstElementChild.tagName.toLowerCase()).not.toBe('em');
        underlineItem.click();
        expect(rteObj.inputElement.childNodes[1].firstElementChild.tagName.toLowerCase()).not.toBe('span');
        done();
    });
});

describe('Remove non zero width space testing', () => {
    let rteEle: HTMLElement;
    let rteObj: any;
    let rteID: any;
    let boldItem: any;
    let italicItem: any;
    let underlineItem: any;

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['Bold', 'Italic', 'Underline']
            },
            created: function() {
                rteID = document.body.querySelector('.e-richtexteditor').id;
                boldItem = document.body.querySelector('#' + rteID + '_toolbar_Bold')
                italicItem = document.body.querySelector('#' + rteID + '_toolbar_Italic')
                underlineItem = document.body.querySelector('#' + rteID + '_toolbar_Underline')
            }
        });
        done();
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('EJ2-46922 - Non zero width space removed testing', (done) => {
        rteObj.inputElement.focus();
        boldItem.click();
        expect(rteObj.inputElement.innerHTML).toBe('<p><strong>​</strong></p>');
        rteObj.inputElement.childNodes[0].childNodes[0].focus();
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0].childNodes[0], rteObj.inputElement.childNodes[0].childNodes[0], 0, 0);
        boldItem.click();
        expect(rteObj.inputElement.innerHTML).toBe('<p><br></p>');
        done();
    });
});

describe('Removing multiple strong node Testing', () => {
    //HTML value
    let innervalue: string = '<p><strong><strong>Testing</br></strong></strong></p>';

    let rteEle: HTMLElement;
    let rteObj: any;
    let rteID: any;
    let boldItem: any;
    let italicItem: any;
    let underlineItem: any;

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: innervalue,
            toolbarSettings: {
                items: ['Bold', 'Italic', 'Underline']
            },
            created: function() {
                rteID = document.body.querySelector('.e-richtexteditor').id;
                boldItem = document.body.querySelector('#' + rteID + '_toolbar_Bold')
                italicItem = document.body.querySelector('#' + rteID + '_toolbar_Italic')
                underlineItem = document.body.querySelector('#' + rteID + '_toolbar_Underline')
            }
        });
        done();
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('Checking the multiple strong tags removal', (done) => {
        rteObj.inputElement.childNodes[0].focus();
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0].childNodes[0].childNodes[0].childNodes[0], rteObj.inputElement.childNodes[0].childNodes[0].childNodes[0].childNodes[0], 0, 7);
        boldItem.click();
        expect(rteObj.inputElement.innerHTML).toBe('<p>Testing<br></p>');            
        done();
    });
});

describe('Removing multiple strong and em nodes Testing', () => {
    //HTML value
    let innervalue: string = '<strong><em><strong><em id="multiple">Testing</em></strong><br></em></strong>';

    let rteEle: HTMLElement;
    let rteObj: any;
    let rteID: any;
    let boldItem: any;
    let italicItem: any;
    let underlineItem: any;

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: innervalue,
            toolbarSettings: {
                items: ['Bold', 'Italic', 'Underline']
            },
            created: function() {
                rteID = document.body.querySelector('.e-richtexteditor').id;
                boldItem = document.body.querySelector('#' + rteID + '_toolbar_Bold')
                italicItem = document.body.querySelector('#' + rteID + '_toolbar_Italic')
                underlineItem = document.body.querySelector('#' + rteID + '_toolbar_Underline')
            }
        });
        done();
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('Checking the multiple strong and em tags removal', (done) => {
        rteObj.inputElement.childNodes[0].focus();
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0].querySelector('#multiple').childNodes[0], rteObj.inputElement.childNodes[0].querySelector('#multiple').childNodes[0], 0, 4);
        italicItem.click();
        expect(rteObj.inputElement.childNodes[0].querySelectorAll('em').length).toBe(1);
        boldItem.click();            
        expect(rteObj.inputElement.childNodes[0].firstChild.nodeType).toBe(3);
        expect(rteObj.inputElement.childNodes[0].querySelectorAll('em').length).toBe(1);
        expect(rteObj.inputElement.childNodes[0].querySelectorAll('strong').length).toBe(1);
        done();
    });
});

describe('EJ2-52390 - When using the list which contains multiple spans inside will create a new list while applying background color', () => {
    //HTML value
    let innervalue: string = `<div id="div1"><ol>
    <li>
      <span style="background-color:rgb(255, 255, 0)"><span>Stakeholders identificeren en groeperen;</span>
    </span></li>
    <li>
      <span style="background-color:rgb(255, 255, 0)"><span>Belangen van stakeholders met betrekking tot het managementsysteem bepalen;</span>
    </span></li>
    <li>
      <span style="background-color:rgb(255, 255, 0)"><span>Risico’s en kansen inschatten van belangen;</span>
    </span></li>
    <li>
      <span style="background-color:rgb(255, 255, 0)"><span>Acties om de risico’s en kansen op te pakken definiëren;</span>
    </span></li>
    <li>
      <span style="background-color:rgb(255, 255, 0)"><span>Doelstellingen bepalen op basis van belangen, risico’s, kansen en acties;</span>
    </span></li>
    <li>
      <span style="background-color:rgb(255, 255, 0)"><span>KPI’s koppelen aan doelstellingen, om de doelstellingen te concretiseren en meetbaar te maken;</span>
    </span></li>
    <li>
      <span style="background-color:rgb(255, 255, 0)"><span>Processen koppelen aan KPI’s, om te waarborgen dat deze KPI’s worden nageleefd;</span>
    </span></li>
    <li>
      <span style="background-color:rgb(255, 255, 0)"><span>En sturingselementen koppelen aan de processen, om te sturen op basis van de informatie die wordt verkregen uit de processen.</span>
    </span></li>
  </ol></div>`;
    let rteObj: any;
    let parentDiv: HTMLDivElement;

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: innervalue,
            toolbarSettings: {
                items: ['BackgroundColor']
            }
        });
        parentDiv = document.getElementById('div1') as HTMLDivElement;
        done();
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('Applying background color for the range li nodes', (done) => {
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.children[0].firstElementChild.firstElementChild.firstElementChild.firstChild.firstChild, rteObj.inputElement.children[0].firstElementChild.lastElementChild.firstElementChild.firstChild.firstChild, 0, 125);
        expect((rteObj as any).inputElement.children[0].firstElementChild.children[0].firstElementChild.style.backgroundColor).toBe('rgb(255, 255, 0)');
        SelectionCommands.applyFormat(document, 'backgroundcolor', parentDiv, 'P', 'rgb(246, 198, 206)');
        expect((rteObj as any).inputElement.children[0].firstElementChild.children[0].firstElementChild.style.backgroundColor).toBe('rgb(246, 198, 206)');
        expect((rteObj as any).inputElement.children[0].firstElementChild.children[1].firstElementChild.style.backgroundColor).toBe('rgb(246, 198, 206)');
        expect((rteObj as any).inputElement.children[0].firstElementChild.children[2].firstElementChild.style.backgroundColor).toBe('rgb(246, 198, 206)');
        expect((rteObj as any).inputElement.children[0].firstElementChild.children[3].firstElementChild.style.backgroundColor).toBe('rgb(246, 198, 206)');
        done();
    });
});

describe('Remove Br tags when applying formatting', () => {
    //HTML value
    let innervalue: string = '<p><br></p>';

    let rteEle: HTMLElement;
    let rteObj: any;
    let controlId: string;

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: innervalue,
            toolbarSettings: {
                items: ['Bold', 'Italic', 'Underline']
            }
        });
        controlId = rteObj.element.id;
        done();
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('if value is empty', (done) => {
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0], rteObj.inputElement.childNodes[0], 0, 0);
        let boldItem: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
        boldItem.click();
        expect(rteObj.inputElement.childNodes[0].firstElementChild.tagName.toLowerCase()).not.toBe('br');
        done();
    });
});

describe('Font size change with br', () => {
    let innervalue: string = `<div id="div1"><p id="paragraphfirst">line1</p><p><br></p><p>line 2 with previous as br</p><p>line 3</p><p><br></p><p><br></p><p>line 4 with two previous br</p><p>line 5</p><p><br></p><p><br></p><p id="paragraphlast"><br></p></div>`;
    let domSelection: NodeSelection = new NodeSelection();
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
        detach(divElement);
    });
    it('Apply fontsize elements with br', () => {
        let node1: Node = document.getElementById('paragraphfirst');
        let listNode1: Text = node1.childNodes[0] as Text;
        let node2: Node = document.getElementById('paragraphlast');
        let listNode2: Text = node2.childNodes[0] as Text;
        domSelection.setSelectionText(document, listNode1, listNode2, 0, 0);
        SelectionCommands.applyFormat(document, 'fontsize', parentDiv, 'P', '36px');
        let brelement = document.querySelectorAll('br');
        for (let i: number = 0; i < brelement.length; i++) {
            expect(brelement[i].parentElement.style.fontSize).toBe('36px');
        }
    });

    it('Apply fontsize elements with br for already applied styles', () => {
        let node1: Node = document.getElementById('paragraphfirst');
        let listNode1: Text = node1.childNodes[0] as Text;
        let node2: Node = document.getElementById('paragraphlast');
        let listNode2: Text = node2.childNodes[0] as Text;
        domSelection.setSelectionText(document, listNode1, listNode2, 0, 0);
        SelectionCommands.applyFormat(document, 'fontsize', parentDiv, 'P', '8px');
        let brelement = document.querySelectorAll('br');
        for (let i: number = 0; i < brelement.length; i++) {
            expect(brelement[i].parentElement.style.fontSize).toBe('8px');
        }
    });
});
describe('Bold the content', () => {
    let innervalue: string = `<p>The rich text editor component is WYSIWYG ("what you see is what you get") editor that provides the best user experience to create and update the content. 
    Users can format their content using standard toolbar commands.</p>
      <table contenteditable="false">
    <tbody><tr>
    <td>first row
      <table contenteditable="false">
        <tbody><tr>
          <td>
            <div contenteditable="true" id="nestedTable">editable content</div>
          </td>
        </tr>
      </tbody></table>
    </td>
    </tr>
    </tbody></table>`;
    let domSelection: NodeSelection = new NodeSelection();
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
        detach(divElement);
    });
    it('Apply Bold with parent element contenteditable as false', () => {
        let node1: Node = document.getElementById('nestedTable');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 1, 1);
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect(node1.childNodes[0].nodeName.toLowerCase()).toEqual('strong');
    });
});

describe('Bold the content inside table in fire fox', () => {
    let fireFox: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0";
    let defaultUA: string = navigator.userAgent;
    
    let innervalue: string = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 33.3333%;" class="">dfbfdb</td><td style="width: 33.3333%;" class="">dfbdfb</td><td style="width: 33.3333%;" class="">dfbfdb</td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`;
    let domSelection: NodeSelection = new NodeSelection();
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    let parentDiv: HTMLDivElement;

    beforeAll(() => {
        Browser.userAgent = fireFox;
        document.body.appendChild(divElement);
        parentDiv = document.getElementById('divElement') as HTMLDivElement;
    });
    afterAll(() => {
        detach(divElement);
    });
    it('Apply bold to the content inside the table testing in firefox', () => {
        let node1: Node = document.querySelector('tr');
        domSelection.setSelectionText(document, node1, node1, 0, 3);
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect(node1.childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('strong');
    });
});

describe('EJ2-46060: bold remove testing', () => {    
    let innervalue: string = `<p><strong><br></strong></p>`;
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
    it('Remove bold', () => {
        let node1: Node = document.querySelector('strong');
        domSelection.setSelectionText(document, node1, node1, 0, 0);
        SelectionCommands.applyFormat(document, 'bold', divElement, 'P');
        expect(divElement.innerHTML).toEqual('<p><br></p>');
    });
});

describe('EJ2-46060: List not generated after enter key press and bold format changed', () => {
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    beforeEach(() => { });
    it(' Apply list', () => {
        rteObj = renderRTE({ value: '<p><strong>a</strong><br></p><p><strong><br></strong></p>' });
        let node1: Node = rteObj.element.querySelectorAll('.e-content p')[1];
        domSelection.setSelectionText(document, node1, node1, 0, 0);
        (rteObj.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
        (rteObj.element.querySelectorAll(".e-toolbar-item")[6] as HTMLElement).click();
        expect((rteObj.element.querySelector('.e-content') as HTMLElement).innerHTML.replace(/\uFEFF/g,"")).toBe('<p><strong>a</strong><br></p><ol><li><br></li></ol>');    
    });
    afterEach(() => {
        destroy(rteObj);
    });
});

describe('EJ2-46956: Applying background color to multiple span element does not work properly', () => {
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    it(' Apply transparent first parent', () => {
        rteObj = renderRTE({
            value: `<p>
            <span style="font-family: helvetica; font-size: 13px; background-color: rgb(255, 255, 0);">Bij
                het toekennen van rechten
                moet
                altijd rekening worden
                gehouden met het beleid voor dataclassificatie. Dit door te kijken naar de classificatie
                van de
                informatie zoals aanwezig in de map of applicatie waar de gebruiker toegang tot wil. Als
                er in de map of
                rechten binnen een applicatie waar de medewerker toegang tot wil informatie met een
                classificatieniveau
                hoger dan het niveau dat deze medewerker mag inzien aanwezig zijn, dienen de rechten
                niet te worden
                toegekend. De toegangsrechten worden minimaal iedere drie maanden
                gecontroleerd
                door de
            </span>
            <span style="font-family: helvetica; font-size: 13px; background-color: unset;">
                <span class="Apple-converted-space"> m</span>
            </span>
            <span style="font-family: helvetica; font-size: 13px; background-color: unset;">anager
                alarmcentrale
                <span class="Apple-converted-space"></span>en
                waar no﻿﻿﻿﻿
            </span>
            <span style="font-family: helvetica; font-size: 13px; background-color: unset;">dig
                worden de toegangsrechten bijgesteld.
            </span>
            </p>`,
            toolbarSettings: {
                items: ['BackgroundColor']
            }
        });
        let rteEle = rteObj.element;
        let span1: Node = rteObj.element.querySelectorAll('.e-content span')[0];
        let span2: Node = rteObj.element.querySelectorAll('.e-content span')[1];
        domSelection.setSelectionText(document, span1, span2, 0, 0);
        rteObj.notify('selection-save', {});
        let backgroundColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn")[0];
        backgroundColorPicker.click();
        let noColorItem: HTMLElement = <HTMLElement>document.querySelector(".e-nocolor-item");
        noColorItem.click();
        expect(rteObj.element.querySelectorAll('.e-content span')[0].style.backgroundColor).toBe('transparent');
    });
    it(' Apply transparent to text selection', () => {
        rteObj = renderRTE({
            value: `<p style="margin:0px 0px 10px;font-size:13px;line-height:18px;color:rgb(51, 51, 51);font-family:helvetica;font-style:normal;font-weight:normal;text-align:start;text-indent:0px;white-space:normal;text-decoration:none"><span><span style="background-color:rgb(255, 255, 0)"><span style="color:rgb(51, 51, 51);font-family:helvetica;font-size:13px;font-style:normal;font-weight:normal;text-align:start;text-indent:0px;white-space:normal;text-decoration:none;float:none;display:inline">Bij het toekennen van rech</span><span style="color:rgb(51, 51, 51);font-family:helvetica;font-size:13px;font-style:normal;font-weight:normal;text-align:start;text-indent:0px;white-space:normal;text-decoration:none;float:none;display:inline">ten</span><span style="color:rgb(51, 51, 51);font-family:helvetica;font-size:13px;font-style:normal;font-weight:normal;text-align:start;text-indent:0px;white-space:normal;text-decoration:none;float:none;display:inline">moet altijd rek</span><span style="font-family: helvetica; font-size: 13px; font-style: normal; font-weight: normal; text-align: start; text-indent: 0px; white-space: normal;  text-decoration: inherit; float: none; display: inline;">ening wor</span><span style="font-family: helvetica; font-size: 13px; font-style: normal; font-weight: normal; text-align: start; text-indent: 0px; white-space: normal;  text-decoration: inherit; float: none; display: inline;">de</span><span style="font-family: helvetica; font-size: 13px; font-style: normal; font-weight: normal; text-align: start; text-indent: 0px; white-space: normal;  text-decoration: inherit; float: none; display: inline;">n gehouden met het bele</span><span style="color:rgb(51, 51, 51);font-family:helvetica;font-size:13px;font-style:normal;font-weight:normal;text-align:start;text-indent:0px;white-space:normal;text-decoration:none;float:none;display:inline">id</span><span style="color:rgb(51, 51, 51);font-family:helvetica;font-size:13px;font-style:normal;font-weight:normal;text-align:start;text-indent:0px;white-space:normal;text-decoration:none;float:none;display:inline">den gecont</span><span style="color:rgb(51, 51, 51);font-family:helvetica;font-size:13px;font-style:normal;font-weight:normal;text-align:start;text-indent:0px;white-space:normal;text-decoration:none;float:none;display:inline">roleer</span><span style="color:rgb(51, 51, 51);font-family:helvetica;font-size:13px;font-style:normal;font-weight:normal;text-align:start;text-indent:0px;white-space:normal;text-decoration:none;float:none;display:inline">d door def</span></span></span></p>`,
            toolbarSettings: {
                items: ['BackgroundColor']
            }
        });
        let rteEle = rteObj.element;
        let startSpan: Node = rteObj.element.querySelectorAll('.e-content span')[2];
        let endSpan: Node = rteObj.element.querySelectorAll('.e-content span')[4];
        domSelection.setSelectionText(document, startSpan.childNodes[0], endSpan.childNodes[0], 1, 1);
        rteObj.notify('selection-save', {});
        let backgroundColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn")[0];
        backgroundColorPicker.click();
        let noColorItem: HTMLElement = <HTMLElement>document.querySelector(".e-nocolor-item");
        noColorItem.click();
        expect(rteObj.element.querySelectorAll('.e-content span > span')[2].style.backgroundColor).toBe('transparent');
        expect(rteObj.element.querySelectorAll('.e-content span > span')[4].style.backgroundColor).toBe('transparent');
        expect(rteObj.element.querySelectorAll('.e-content span > span')[6].style.backgroundColor).toBe('transparent');
    });
    afterEach(() => {
        destroy(rteObj);
    });
});

describe('EJ2-55031 - Selecting some texts and applying Font and background colors alternatively, will create some new elements Issue', () => {
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    it('EJ2-55031 - Selecting some texts and applying Font and background colors alternatively, will create some new elements', () => {
        rteObj = renderRTE({
            value: `<p><b><span class="firstFocusNode" style="color: rgb(255, 0, 0); text-decoration: inherit;">Description:</span></b></p><p><span style="color: rgb(255, 0, 0); text-decoration: inherit;">The Rich Text Editor (RTE) c<span style="background-color: rgb(255, 255, 0);">ontrol is an easy to rende</span>r in the client side. Customer easy to edit the contents and get the HTML content for the displayed content. A rich text editor control provides users with a toolbar that helps them to apply rich text formats to the text entered in the text area. </span></p><p><b><span style="color: rgb(255, 0, 0); text-decoration: inherit;">Functional Specifications/Requirements:</span></b></p><p><b><span style="color: rgb(255, 0, 0); text-decoration: inherit;">Description:</span></b></p><p><span class="lastFocusNode" style="color: rgb(255, 0, 0); text-decoration: inherit;">The Rich Text Editor (RTE) control is an easy to render in client side. Customer easy to edit the contents and get the HTML content for the displayed content. A rich text editor control provides users with a toolbar that helps them to apply rich text formats to the text entered in the text area.</span></p>`,
            toolbarSettings: {
                items: ['FontColor']
            }
        });
        let rteEle = rteObj.element;
        let startSpan: Node = rteObj.element.querySelector('.firstFocusNode');
        let endSpan: Node = rteObj.element.querySelector('.lastFocusNode');
        domSelection.setSelectionText(document, startSpan.childNodes[0], endSpan.childNodes[0], 0, endSpan.childNodes[0].textContent.length);
        rteObj.notify('selection-save', {});
        let fontColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn")[0];
        fontColorPicker.click();
        let blackItem: HTMLElement = <HTMLElement>document.querySelector(".e-nocolor-item").nextElementSibling;
        blackItem.click();
        expect(rteObj.element.querySelectorAll('p')[2].textContent).toBe('Functional Specifications/Requirements:');
    });

    afterEach(() => {
        destroy(rteObj);
    });
});

describe('BLAZ-29736 - Font Color not Applying for the hyperlink Text', () => {
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    beforeEach(() => {
        rteObj = renderRTE({
            value: `<p><a href="https://www.google.com/">Google</a></p>`,
            toolbarSettings: {
                items: ['FontColor']
            }
        });
    });
    afterEach(() => {
        destroy(rteObj);
    });
    it('Should wrap the span element around the text content of the hyperlink', () => {
        const range: Range = document.createRange();
        range.setStart(rteObj.element.querySelector('a').childNodes[0], 0);
        range.setEnd(rteObj.element.querySelector('a').childNodes[0], 6);
        domSelection.setRange(document, range);
        SelectionCommands.applyFormat(document, 'fontcolor', rteObj.element.querySelector('.e-content'), 'P', 'rgb(255, 0, 0)');
        const spanElem = rteObj.element.querySelector('.e-content').querySelector('span');
        expect(spanElem.parentElement.nodeName).toEqual('A');
        expect(spanElem.querySelector('a')).toEqual(null);
    });
});
describe('EJ2-70136 - Font Size value not updating while on selected text', () => {
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    it('EJ2-70136 - Font Size value not updating while on selected text', () => {
        rteObj = renderRTE({
            value: `<p class="focusNode">The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit content and return the valid <a href='https://ej2.syncfusion.com/home/'>HTML markup</a> or <a href='https://ej2.syncfusion.com/home/'>markdown</a> of the content</p>`,
            toolbarSettings: {
                items: ['FontSize']
            }
        });
        let rteEle = rteObj.element;
        let focusNode = rteObj.inputElement.querySelector('.focusNode');
        const range:Range =new Range();
        range.setStart(focusNode.childNodes[0],0);
        range.setEnd (focusNode.childNodes[4],focusNode.childNodes[4].textContent.length);
        domSelection.setRange(document,range);
        let fontSizePicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn")[0];
        fontSizePicker.click();
        var fontSizeChooser : HTMLElement = <HTMLElement>document.querySelectorAll(".e-item")[5];
        fontSizeChooser.click();
        expect(rteEle.childNodes[2].childNodes[0].innerHTML).toBe('<p class="focusNode"><span style="font-size: 24pt;">The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit content and return the valid </span><span style="font-size: 24pt;"><a href="https://ej2.syncfusion.com/home/">HTML markup</a></span><span style="font-size: 24pt;"> or </span><span style="font-size: 24pt;"><a href="https://ej2.syncfusion.com/home/">markdown</a></span><span style="font-size: 24pt;"> of the content</span></p>');
        expect(fontSizePicker.childNodes[0].textContent).toEqual('24 pt');
    });
    afterEach(() => {
        destroy(rteObj);
    });
});
describe('EJ2-70405 - Background Color not applied properly when nested styles are applied', () => {
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    beforeEach(() => {
        rteObj = renderRTE({
            value: `<p>Testing for the selection commands</p>`,
            toolbarSettings: {
                items: ['FontColor']
            }
        });
    });
    afterEach(() => {
        destroy(rteObj);
    });
    it('Test for background color application of selected text node', () => {
        const range: Range = document.createRange();
        range.setStart(rteObj.element.querySelector('p').childNodes[0], 0);
        range.setEnd(rteObj.element.querySelector('p').childNodes[0], 7);
        domSelection.setRange(document, range);
        SelectionCommands.applyFormat(document, 'bold', rteObj.element.querySelector('.e-content'), 'P');
        SelectionCommands.applyFormat(document, 'italic', rteObj.element.querySelector('.e-content'), 'P');
        SelectionCommands.applyFormat(document, 'underline', rteObj.element.querySelector('.e-content'), 'P');
        SelectionCommands.applyFormat(document, 'strikethrough', rteObj.element.querySelector('.e-content'), 'P');
        // Apply font family
        SelectionCommands.applyFormat(document, 'fontname', rteObj.element.querySelector('.e-content'), 'P', 'Arial');
        // Apply font color
        SelectionCommands.applyFormat(document, 'fontcolor', rteObj.element.querySelector('.e-content'), 'P', 'rgb(255, 0, 0)');
        // Apply background color
        SelectionCommands.applyFormat(document, 'backgroundcolor', rteObj.element.querySelector('.e-content'), 'P', 'rgb(0, 255, 0)');
        // Apply font size
        SelectionCommands.applyFormat(document, 'fontsize', rteObj.element.querySelector('.e-content'), 'P', '24pt');
        const allSpanNodes = rteObj.element.querySelector('.e-content').querySelectorAll('span');
        expect(allSpanNodes.length).toEqual(6);
        // Test font size
        expect(allSpanNodes[0].style.fontSize).toEqual('24pt');
        // Test font color
        expect(allSpanNodes[1].style.color).toEqual('rgb(255, 0, 0)');
        // Test background color
        expect(allSpanNodes[2].style.backgroundColor).toEqual('rgb(0, 255, 0)');
        // Test font family
        expect(allSpanNodes[3].style.fontFamily).toEqual('Arial');
        // Test bold
        expect(rteObj.element.querySelector('.e-content').querySelectorAll('strong').length).toEqual(1);
        // Test italic
        expect(rteObj.element.querySelector('.e-content').querySelectorAll('em').length).toEqual(1);
        // Test underline
        expect(allSpanNodes[4].style.textDecoration).toEqual('underline');
        // Test strikethrough
        expect(allSpanNodes[5].style.textDecoration).toEqual('line-through');
    });
});
describe('EJ2-69958 - Font size fails to works properly after applying the subscript or superscript', () => {
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    it('EJ2-69958 - update the font size after applying the subscript or superscript', () => {
        rteObj = renderRTE({
            value: `<ol class="focusNode"><li><p>List1</p></li><li><p>List2</p></li></ol>`,
            toolbarSettings: {
                items: ['Subscript','FontSize']
            }
        });
        let rteEle = rteObj.element;
        let focusNode = rteObj.inputElement.querySelector('.focusNode');
        const olTag = document.querySelector('ol'); // Select the <ol> tag
        const range = document.createRange(); // Create a new range object
        range.selectNode(olTag);
        domSelection.setRange(document,range);
        let SubscriptPicker : HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
        SubscriptPicker.click();
        let fontSizePicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn")[0];
        fontSizePicker.click();
        var fontSizeChooser : HTMLElement = <HTMLElement>document.querySelectorAll(".e-item")[5];
        fontSizeChooser.click();
        expect(focusNode.childNodes[1].style.fontSize).toEqual('24pt');
    });
    afterEach(() => {
        destroy(rteObj);
    });
});
describe('EJ2-70405 - Background Color not applied properly when nested styles are applied', () => {
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    beforeEach(() => {
        rteObj = renderRTE({
            value: `<p><span class="e-img-caption e-rte-img-caption null e-caption-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap null"><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline" alt="RTEImage-Feather.png" width="auto" height="auto" style="min-width: 0px; max-width: 1839px; min-height: 0px;"><span class="e-img-inner null" contenteditable="true">This is the caption of the image.</span></span></span> </p>        <p>Getting started with <strong>Format </strong> Painter.</p>
        <h2 class ='sourceformatnode' title="heading1"><span style="font-family: Tahoma, Geneva, sans-serif;">
            <span style="color: rgb(68, 114, 196); text-decoration: inherit;">
            <span style="background-color: rgb(204, 255, 255);">
                <b><u>FORMAT PAINTER:</u></b>
            </span></span></span>
        </h2>`,
            toolbarSettings: {
                items: ['FontColor']
            }
        });
    });
    afterEach(() => {
        destroy(rteObj);
    });
    it('Test for background color application of selected text node', () => {
        const range: Range = document.createRange();
        range.setStart(rteObj.element.querySelector('.e-img-inner').childNodes[0], 0);
        range.setEnd(rteObj.element.querySelector('.e-img-inner').childNodes[0], 7);
        domSelection.setRange(document, range);
        SelectionCommands.applyFormat(document, 'bold', rteObj.element.querySelector('.e-content'), 'P');
        SelectionCommands.applyFormat(document, 'italic', rteObj.element.querySelector('.e-content'), 'P');
        SelectionCommands.applyFormat(document, 'underline', rteObj.element.querySelector('.e-content'), 'P');
        SelectionCommands.applyFormat(document, 'strikethrough', rteObj.element.querySelector('.e-content'), 'P');
        // Apply font family
        SelectionCommands.applyFormat(document, 'fontname', rteObj.element.querySelector('.e-content'), 'P', 'Arial');
        // Apply font color
        SelectionCommands.applyFormat(document, 'fontcolor', rteObj.element.querySelector('.e-content'), 'P', 'rgb(255, 0, 0)');
        // Apply background color
        SelectionCommands.applyFormat(document, 'backgroundcolor', rteObj.element.querySelector('.e-content'), 'P', 'rgb(0, 255, 0)');
        // Apply font size
        SelectionCommands.applyFormat(document, 'fontsize', rteObj.element.querySelector('.e-content'), 'P', '24pt');
        const imageCaptionWrapper = rteObj.element.querySelector('.e-img-inner');
        expect(imageCaptionWrapper.firstChild.nodeName).toEqual('SPAN');
        expect(imageCaptionWrapper.firstChild.style.fontSize).toEqual('24pt');
    });
});
