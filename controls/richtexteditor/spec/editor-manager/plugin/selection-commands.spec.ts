/**
 * Selection commands spec document
 */
import { detach, Browser } from '@syncfusion/ej2-base';
import { NodeSelection } from '../../../src/selection/selection';
import { SelectionCommands } from '../../../src/editor-manager/plugin/selection-commands';
import { renderRTE, destroy, setCursorPoint } from '../../rich-text-editor/render.spec';

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
        SelectionCommands.applyFormat(document, 'fontcolor', parentDiv, 'P', null, 'rgb(102, 102, 0)');
        expect((node1.childNodes[0] as HTMLElement).style.color).toEqual('rgb(102, 102, 0)');
        expect((node1.childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply fontname tag for text node', () => {
        SelectionCommands.applyFormat(document, 'fontname', parentDiv, 'P', null, 'Arial');
        expect((ptag.childNodes[0] as HTMLElement).style.fontFamily).toEqual('Arial');
        expect((ptag.childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply fontsize tag for text node', () => {
        SelectionCommands.applyFormat(document, 'fontsize', parentDiv, 'P', null, '20px');
        expect((ptag.childNodes[0] as HTMLElement).style.fontSize).toEqual('20px');
        expect((ptag.childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply backgroundcolor tag for text node', () => {
        SelectionCommands.applyFormat(document, 'backgroundcolor', parentDiv, 'P', null, 'rgb(246, 198, 206)');
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
        SelectionCommands.applyFormat(document, 'backgroundcolor', parentDiv, 'P',  null,'rgb(246, 198, 2)');
        expect((ptag.childNodes[0].childNodes[0] as HTMLElement).style.backgroundColor).toEqual('rgb(246, 198, 2)');
        expect((ptag.childNodes[0].childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Re - Apply fontsize tag for text node', () => {
        SelectionCommands.applyFormat(document, 'fontsize', parentDiv, 'P', null, '40px');
        expect((ptag.childNodes[0] as HTMLElement).style.fontSize).toEqual('40px');
        expect((ptag.childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Re - Apply fontname tag for text node', () => {
        SelectionCommands.applyFormat(document, 'fontname', parentDiv, 'P', null, 'monospace');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0] as HTMLElement).style.fontFamily).toEqual('monospace');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Re - Apply fontcolor tag for text node', () => {
        SelectionCommands.applyFormat(document, 'fontcolor', parentDiv, 'P', null, 'rgb(226, 10, 10)');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0] as HTMLElement).style.color).toEqual('rgb(226, 10, 10)');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply fontcolor tag for already applied specific text node', () => {
        fontTag = ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
        let text1: Text = fontTag.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 3, 10);
        SelectionCommands.applyFormat(document, 'fontcolor', parentDiv, 'P', null, 'rgb(102, 102, 0)');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[1] as HTMLElement).style.color).toEqual('rgb(102, 102, 0)');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[1] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply fontname tag for already applied specific text node', () => {
        SelectionCommands.applyFormat(document, 'fontname', parentDiv, 'P', null, 'Arial');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[1] as HTMLElement).style.fontFamily).toEqual('Arial');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[1] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply fontsize tag for already applied specific text node', () => {
        SelectionCommands.applyFormat(document, 'fontsize', parentDiv, 'P', null, '20px');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[1] as HTMLElement).style.fontSize).toEqual('20px');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[1] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply backgroundcolor tag for already applied specific text node', () => {
        SelectionCommands.applyFormat(document, 'backgroundcolor', parentDiv, 'P', null, 'rgb(246, 198, 206)');
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
        expect(node1.childNodes[2].nodeName.toLowerCase()).toEqual('#text');
        expect(node1.childNodes[1].nodeName.toLowerCase()).toEqual('em');
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
        SelectionCommands.applyFormat(document, 'fontcolor', parentDiv, 'P',  null,'');
        expect((document.getElementById('format6').childNodes[1] as HTMLElement).nodeName).toEqual('#text');
    });
    it('Apply fontsize tag for list elements', () => {
        let node1: Node = document.getElementById('paragraph20');
        let listNode1: Text = node1.childNodes[0] as Text;
        let node2: Node = document.getElementById('paragraph26');
        let listNode2: Text = node2.childNodes[0] as Text;
        domSelection.setSelectionText(document, listNode1, listNode2, 0, 11);
        SelectionCommands.applyFormat(document, 'fontsize', parentDiv, 'P', null, '36px');
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
        SelectionCommands.applyFormat(document, 'fontcolor', parentDiv, 'P', null, 'rgb(83, 129, 53)');
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
        SelectionCommands.applyFormat(document, 'fontsize', parentDiv, 'P', null, '10px');
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
        SelectionCommands.applyFormat(document, 'fontsize', parentDiv, 'P', null, '36px');
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
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
    it('Checking the fontColor for the node not being removed', (done) => {
        rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.inputElement.lastElementChild.firstElementChild.lastElementChild.lastElementChild.lastElementChild.firstChild, rteObj.inputElement.lastElementChild.firstElementChild.lastElementChild.lastElementChild.lastElementChild.firstChild.textContent.length);
        underlineItem.click();
        italicItem.click();
        boldItem.click();
        setTimeout(() => {
            expect((rteObj as any).inputElement.children[1].firstElementChild.style.color).toBe('rgb(68, 114, 196)');
            done();
        }, 200);
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
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
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
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
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
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
    it('The font name is not changed properly issue - EJ2-59075 ', (done) => {
        let focusNode = rteObj.inputElement.querySelector('.focusNode');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, focusNode.childNodes[0], focusNode.childNodes[0], 1, 1);
        SelectionCommands.applyFormat(document, 'fontname', rteObj.inputElement, 'P', null, 'Arial');
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
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
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
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
    it('Case 1 of the formating issue - EJ2-58803 ', (done) => {
        let focusNode = rteObj.inputElement.querySelector('.focusNode');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, focusNode.childNodes[0], focusNode.childNodes[0], 11, 11);
        SelectionCommands.applyFormat(document, 'underline', rteObj.inputElement, 'P');
        SelectionCommands.applyFormat(document, 'italic', rteObj.inputElement, 'P');
        SelectionCommands.applyFormat(document, 'bold', rteObj.inputElement, 'P');
        expect((rteObj as any).inputElement.innerHTML).toBe(`<p><strong>​<em>​<span style="text-decoration: underline;">​<span style="color: rgb(255, 0, 0); text-decoration: inherit;">​<span class="focusNode" style="background-color: rgb(255, 255, 0);">RTE Content</span></span></span></em></strong><span style="color: rgb(255, 0, 0); text-decoration: inherit;"><span class="focusNode" style="background-color: rgb(255, 255, 0);">​</span></span></p>`);
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
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });

    it('Case 2 of the formating issue - EJ2-58803 ', (done) => {
        let focusNode = rteObj.inputElement.querySelector('.focusNode');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, focusNode.childNodes[0], focusNode.childNodes[0], 11, 11);
        SelectionCommands.applyFormat(document, 'underline', rteObj.inputElement, 'P');
        SelectionCommands.applyFormat(document, 'italic', rteObj.inputElement, 'P');
        SelectionCommands.applyFormat(document, 'bold', rteObj.inputElement, 'P');
        SelectionCommands.applyFormat(document, 'backgroundcolor', rteObj.inputElement, 'P', null, 'rgb(246, 198, 206)');
        expect((rteObj as any).inputElement.innerHTML).toBe(`<p><strong>​<em>​<span style="text-decoration: underline;">​<span class="focusNode" style="color: rgb(255, 0, 0); text-decoration: inherit;">RTE Content</span></span></em></strong><span class="focusNode" style="color: rgb(255, 0, 0); text-decoration: inherit;"><span style="background-color: rgb(246, 198, 206);">​</span></span></p>`);        done();
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
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });

    it('Case 4 of the formating issue - EJ2-58803 ', (done) => {
        let focusNode = rteObj.inputElement.querySelector('.focusNode');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, focusNode.childNodes[0], focusNode.childNodes[0], 11, 11);
        SelectionCommands.applyFormat(document, 'underline', rteObj.inputElement, 'P');
        SelectionCommands.applyFormat(document, 'italic', rteObj.inputElement, 'P');
        SelectionCommands.applyFormat(document, 'bold', rteObj.inputElement, 'P');
        SelectionCommands.applyFormat(document, 'fontcolor', rteObj.inputElement, 'P', null, 'rgb(83, 129, 53)');
        SelectionCommands.applyFormat(document, 'backgroundcolor', rteObj.inputElement, 'P', null, 'rgb(246, 198, 206)');
        expect((rteObj as any).inputElement.innerHTML).toBe(`<p><span style="color: rgb(255, 0, 0); text-decoration: inherit;">​<span style="background-color: rgb(255, 255, 0);">​<strong>​<em>​<span class="focusNode" style="text-decoration: underline;">RTE Content</span></em></strong></span></span><span style="color: rgb(83, 129, 53); text-decoration: inherit;"><span style="background-color: rgb(246, 198, 206);">​</span></span></p>`);
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
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });

    it('Case 5 of the formating issue - EJ2-58803 ', (done) => {
        let focusNode = rteObj.inputElement.querySelector('.focusNode');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, focusNode.childNodes[0], focusNode.childNodes[0], 11, 11);
        SelectionCommands.applyFormat(document, 'backgroundcolor', rteObj.inputElement, 'P', null, 'rgb(246, 198, 206)');
        SelectionCommands.applyFormat(document, 'fontcolor', rteObj.inputElement, 'P', null, 'rgb(83, 129, 53)');
        expect((rteObj as any).inputElement.innerHTML).toBe(`<p><span style="color: rgb(255, 0, 0); text-decoration: inherit;">​<span style="background-color: rgb(255, 255, 0);">​<strong>​<em>​<span class="focusNode" style="text-decoration: underline;">RTE Content</span></em></strong></span></span><span style="color: rgb(83, 129, 53); text-decoration: inherit;"><span style="background-color: rgb(246, 198, 206);"><strong><em><span class="focusNode" style="text-decoration: underline;">​</span></em></strong></span></span></p>`);
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
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
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
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
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

describe('Font Name Apply and Remove - Normal List', () => {
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();

    beforeAll((done: DoneFn) => {
        rteObj = renderRTE({
            value: `<ul><li class='li1'>item1</li><li class='li2'>item2</li><li class='li3'>item3</li></ul>`,
            toolbarSettings: {
                items: ['FontName']
            }
        });
        done();
    });
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
    it('Test for applying and removing font name in a normal list', (done) => {
        const range: Range = document.createRange();
        range.setStart(rteObj.element.querySelector('.li1').childNodes[0], 0);
        range.setEnd(rteObj.element.querySelector('.li3').childNodes[0], 5);
        domSelection.setRange(document, range);
        SelectionCommands.applyFormat(document,
            'fontname',
            rteObj.element.querySelector('.e-content'),
            'P',
            null,
            'Arial, Helvetica, sans-serif'
        );
        const listItems = rteObj.element.querySelectorAll('.li1, .li2, .li3');
        listItems.forEach((li: HTMLElement) => {
            expect(li.style.fontFamily).toEqual('Arial, Helvetica, sans-serif');
        });
        SelectionCommands.applyFormat(
            document,
            'fontname',
            rteObj.element.querySelector('.e-content'),
            'P',
            null,
            ''
        );
        listItems.forEach((li: HTMLElement) => {
            expect(li.style.fontFamily).toEqual('');
        });
        done();
    });
});

describe('Font Name Apply and Remove - Nested List', () => {
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();

    beforeAll((done: DoneFn) => {
        rteObj = renderRTE({
            value: `<ul><li class='li1'>item1</li><li class='li2'>item2<ul><li class='li3'>nested1</li><li class='li4'>nested2</li></ul></li><li class='li5'>item3</li></ul>`,
            toolbarSettings: {
                items: ['FontName']
            }
        });
        done();
    });

    afterAll((done: DoneFn) => {
        destroy(rteObj);
    });

    it('Test for applying and removing font name in a nested list', (done) => {
        const range: Range = document.createRange();
        range.setStart(rteObj.element.querySelector('.li1').childNodes[0], 0);
        range.setEnd(rteObj.element.querySelector('.li5').childNodes[0], 5);
        domSelection.setRange(document, range);
        SelectionCommands.applyFormat(
            document,
            'fontname',
            rteObj.element.querySelector('.e-content'),
            'P',
            null,
            'Arial, Helvetica, sans-serif'
        );
        const listItems = rteObj.element.querySelectorAll('.li1, .li2, .li3, .li4, .li5');
        listItems.forEach((li: HTMLElement) => {
            expect(li.style.fontFamily).toEqual('Arial, Helvetica, sans-serif');
        });
        SelectionCommands.applyFormat(
            document,
            'fontname',
            rteObj.element.querySelector('.e-content'),
            'P',
            null,
            ''
        );
        listItems.forEach((li: HTMLElement) => {
            expect(li.style.fontFamily).toEqual('');
        });
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
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
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
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
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
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
    it('Applying background color for the range li nodes', (done) => {
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.children[0].firstElementChild.firstElementChild.firstElementChild.firstChild.firstChild, rteObj.inputElement.children[0].firstElementChild.lastElementChild.firstElementChild.firstChild.firstChild, 0, 125);
        expect((rteObj as any).inputElement.children[0].firstElementChild.children[0].firstElementChild.style.backgroundColor).toBe('rgb(255, 255, 0)');
        SelectionCommands.applyFormat(document, 'backgroundcolor', parentDiv, 'P', null, 'rgb(246, 198, 206)');
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
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
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
        SelectionCommands.applyFormat(document, 'fontsize', parentDiv, 'P', null, '36px');
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
        SelectionCommands.applyFormat(document, 'fontsize', parentDiv, 'P', null, '8px');
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
        Browser.userAgent = defaultUA;
    });
    it('Apply bold to the content inside the table testing in firefox', () => {
        let node1: Node = document.querySelector('tr');
        domSelection.setSelectionText(document, node1, node1, 0, 3);
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect(node1.childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('strong');
    });
});

describe('862912 - Bold is not applied when using shortcut key (Ctrl+B)', () => {
    let innervalue: string = `<p>The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit content and return the valid <a id="firstLink" href="https://ej2.syncfusion.com/home/" target="_blank" aria-label="Open in new window">HTML markup</a> or <a href="https://ej2.syncfusion.com/home/" target="_blank" aria-label="Open in new window">markdown</a> of the content <a id="lastLink" href="https://ej2.syncfusion.com/home/" target="_blank" aria-label="Open in new window">HTML markup</a></p><p><b>Toolbar</b></p>`;
    let domSelection: NodeSelection = new NodeSelection();
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    let parentDiv: HTMLDivElement;

    beforeAll(() => {
        document.body.appendChild(divElement);
        parentDiv = document.getElementById('divElement') as HTMLDivElement;
    });
    afterAll(() => {
        detach(divElement);
    });
    it('Bold is not applied when using shortcut key (Ctrl+B) at the end of the first link', () => {
        let firstLink: Node = document.getElementById('firstLink');
        domSelection.setSelectionText(document, firstLink.childNodes[0], firstLink.childNodes[0], 11, 11);
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect(document.getElementById('firstLink').nextElementSibling.nodeName.toLowerCase()).toEqual('strong');
    });
    it('Bold is not applied when using shortcut key (Ctrl+B) at the end of the last link', () => {
        let lastLink: Node = document.getElementById('lastLink');
        domSelection.setSelectionText(document, lastLink.childNodes[0], lastLink.childNodes[0], 11, 11);
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect(document.getElementById('lastLink').nextElementSibling.nodeName.toLowerCase()).toEqual('strong');
    });
    it('Bold is not applied when using shortcut key (Ctrl+B) at the start of the first link', () => {
        let lastLink: Node = document.getElementById('lastLink');
        domSelection.setSelectionText(document, lastLink.childNodes[0], lastLink.childNodes[0], 0, 0);
        SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
        expect(document.getElementById('lastLink').previousElementSibling.nodeName.toLowerCase()).toEqual('strong');
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
        (rteObj.element.querySelectorAll(".e-toolbar-item")[7] as HTMLElement).click();
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
        let initialSpanCount: number = rteObj.element.querySelectorAll('.e-content span').length;
        let span1: Node = rteObj.element.querySelectorAll('.e-content span')[0];
        let span2: Node = rteObj.element.querySelectorAll('.e-content span')[1];
        domSelection.setSelectionText(document, span1, span2, 0, 0);
        rteObj.notify('selection-save', {});
        let backgroundColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn")[0];
        backgroundColorPicker.click();
        let noColorItem: HTMLElement = <HTMLElement>document.querySelector(".e-nocolor-item");
        noColorItem.click();
        let afterSpanCount: number = rteObj.element.querySelectorAll('.e-content span').length;
        expect(initialSpanCount).not.toBe(afterSpanCount);
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
        expect(rteObj.element.querySelectorAll('.e-content span > span')[2].style.backgroundColor).toBe('');
        expect(rteObj.element.querySelectorAll('.e-content span > span')[4].style.backgroundColor).toBe('transparent');
        expect(rteObj.element.querySelectorAll('.e-content span > span')[6].style.backgroundColor).toBe('transparent');
    });
    afterEach(() => {
        destroy(rteObj);
    });
});

describe('EJ2-946344: Apply the table cell background color only by clicking on the Quick Toolbar and do not apply when clicking the main toolbar', () => {
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    it(' Apply the background color to text of the table when clicking on main toolbar', () => {
        rteObj = renderRTE({
            value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 33.3333%;" class="">dfbfdb</td><td style="width: 33.3333%;" class="">dfbdfb</td><td style="width: 33.3333%;" class="">dfbfdb</td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`,
            toolbarSettings: {
                items: ['BackgroundColor']
            }
        });
        let rteEle = rteObj.element;
        let td: Node = rteObj.element.querySelectorAll('td')[1];
        const range: Range = document.createRange();
        range.setStart(td.childNodes[0], 1);
        range.setEnd(td.childNodes[0], 1);
        domSelection.setRange(document, range);
        let backgroundColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn")[0];
        backgroundColorPicker.click();
        const colorElement: HTMLElement = document.querySelector('[aria-label="#ffff00ff"]');
        colorElement.click();
        expect(rteObj.inputElement.innerHTML).toBe('<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 33.3333%;" class="">dfbfdb</td><td style="width: 33.3333%;" class=""><span style="background-color: rgb(255, 255, 0);">dfbdfb</span></td><td style="width: 33.3333%;" class="">dfbfdb</td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>');
    });
    afterEach(() => {
        destroy(rteObj);
    });
});

describe('Background Color Apply and Remove - Auto Span Creation in List Item', function () {
    let rteObj: any;
    let domSelection = new NodeSelection();

    beforeAll(function (done) {
        rteObj = renderRTE({
            value: `<ul><li class='li1'>item1</li></ul>`,
            toolbarSettings: {
                items: ['BackgroundColor']
            }
        });
        done();
    });
    afterAll(function (done) {
        destroy(rteObj);
        done();
    });
    it('Test for applying and removing background color with auto span creation', function (done) {
        let range = document.createRange();
        let liElement = rteObj.element.querySelector('.li1');
        range.setStart(liElement.childNodes[0], 0);
        range.setEnd(liElement.childNodes[0], liElement.textContent.length);
        domSelection.setRange(document, range);
        SelectionCommands.applyFormat(
            document,
            'backgroundcolor',
            rteObj.element.querySelector('.e-content'),
            'SPAN', 
            null,
            'rgb(255, 255, 0)'
        );
        let spanElement = liElement.querySelector('span');
        expect(spanElement).not.toBeNull();
        expect(spanElement.style.backgroundColor).toEqual('rgb(255, 255, 0)');
        SelectionCommands.applyFormat(
            document,
            'backgroundcolor',
            rteObj.element.querySelector('.e-content'),
            'SPAN',
            null,
            ''
        );
        expect(liElement.querySelector('span')).toBeNull();
        expect(liElement.innerHTML).toEqual('item1'); 
        done();
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
        SelectionCommands.applyFormat(document, 'fontcolor', rteObj.element.querySelector('.e-content'), 'P', null, 'rgb(255, 0, 0)');
        const spanElem = rteObj.element.querySelector('.e-content').querySelector('span');
        expect(spanElem.parentElement.nodeName).toEqual('A');
        expect(spanElem.querySelector('a')).toEqual(null);
    });
});
describe('EJ2-70136 - Font Size value not updating while on selected text', () => {
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    beforeAll(() => {
        rteObj = renderRTE({
            value: `<p class="focusNode">The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit content and return the valid <a href='https://ej2.syncfusion.com/home/'>HTML markup</a> or <a href='https://ej2.syncfusion.com/home/'>markdown</a> of the content</p>`,
            toolbarSettings: {
                items: ['FontSize']
            }
        });
    });
    it('EJ2-70136 - Font Size value not updating while on selected text', (done) => {
        let rteEle = rteObj.rootContainer;
        let focusNode = rteObj.inputElement.querySelector('.focusNode');
        const range:Range = new Range();
        range.setStart(focusNode.childNodes[0],0);
        range.setEnd (focusNode.childNodes[4],focusNode.childNodes[4].textContent.length);
        domSelection.setRange(document,range);
        let fontSizePicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn")[0];
        fontSizePicker.click();
        setTimeout(() => {
            var fontSizeChooser : HTMLElement = <HTMLElement>document.querySelectorAll(".e-item")[6];
            fontSizeChooser.click();
            setTimeout(() => {
                expect(rteEle.childNodes[2].childNodes[0].innerHTML).toBe('<p class="focusNode"><span style="font-size: 24pt;">The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit content and return the valid </span><span style="font-size: 24pt;"><a href="https://ej2.syncfusion.com/home/">HTML markup</a></span><span style="font-size: 24pt;"> or </span><span style="font-size: 24pt;"><a href="https://ej2.syncfusion.com/home/">markdown</a></span><span style="font-size: 24pt;"> of the content</span></p>');
                expect(fontSizePicker.childNodes[0].textContent).toEqual('24 pt');
                done();
            }, 100);
        }, 100);
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
});
describe('Bug 901952: In Rich Text Editor, style is inconsistently maintained', () => {
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    let rteID: any;
    let strikethroughItem: any;

    it(' To validate the strikethrough and fontsize combination', () => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['Strikethrough', 'FontSize']
            },
            created: function () {
                rteID = document.body.querySelector('.e-richtexteditor').id;
                strikethroughItem = document.body.querySelector('#' + rteID + '_toolbar_StrikeThrough');
            }

        });
        rteObj.inputElement.focus();
        strikethroughItem.click();
        let rteEle = rteObj.rootContainer;
        let fontSizePicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn")[0];
        fontSizePicker.click();
        var fontSizeChooser: HTMLElement = <HTMLElement>document.querySelectorAll(".e-item")[7];
        fontSizeChooser.click();
        expect(rteObj.inputElement.innerHTML).toBe('<p><span style="font-size: 36pt;"><span style="text-decoration: line-through;">​</span></span></p>');
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
        SelectionCommands.applyFormat(document, 'fontname', rteObj.element.querySelector('.e-content'), 'P', null, 'Arial');
        // Apply font color
        SelectionCommands.applyFormat(document, 'fontcolor', rteObj.element.querySelector('.e-content'), 'P', null, 'rgb(255, 0, 0)');
        // Apply background color
        SelectionCommands.applyFormat(document, 'backgroundcolor', rteObj.element.querySelector('.e-content'), 'P', null, 'rgb(0, 255, 0)');
        // Apply font size
        SelectionCommands.applyFormat(document, 'fontsize', rteObj.element.querySelector('.e-content'), 'P', null, '24pt');
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
        var fontSizeChooser : HTMLElement = <HTMLElement>document.querySelectorAll(".e-item")[6];
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
        SelectionCommands.applyFormat(document, 'fontname', rteObj.element.querySelector('.e-content'), 'P', null, 'Arial');
        // Apply font color
        SelectionCommands.applyFormat(document, 'fontcolor', rteObj.element.querySelector('.e-content'), 'P', null, 'rgb(255, 0, 0)');
        // Apply background color
        SelectionCommands.applyFormat(document, 'backgroundcolor', rteObj.element.querySelector('.e-content'), 'P', null, 'rgb(0, 255, 0)');
        // Apply font size
        SelectionCommands.applyFormat(document, 'fontsize', rteObj.element.querySelector('.e-content'), 'P', null, '24pt');
        const imageCaptionWrapper = rteObj.element.querySelector('.e-img-inner');
        expect(imageCaptionWrapper.firstChild.nodeName).toEqual('SPAN');
        expect(imageCaptionWrapper.firstChild.style.fontSize).toEqual('24pt');
    });
});

describe('Reverting font color to the list element.', () => {
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    beforeEach(() => {
        rteObj = renderRTE({
            value: `<ul>
            <li style="color: rgb(255, 0, 0); text-decoration: inherit;"><span style="color: rgb(255, 0, 0); text-decoration: inherit;">Saves time and effort in formatting</span></li>
            <li style="color: rgb(255, 0, 0); text-decoration: inherit;"><span style="color: rgb(255, 0, 0); text-decoration: inherit;">Consistent formatting throughout the document or website</span></li>
            <li style="color: rgb(255, 0, 0); text-decoration: inherit;"><span style="color: rgb(255, 0, 0); text-decoration: inherit;">Quick and easy to use</span></li>
        </ul>`,
            toolbarSettings: {
                items: ['FontColor']
            }
        });
    });
    afterEach(() => {
        destroy(rteObj);
    });
    it('Should remove the color from link and then the span element.', () => {
        const range: Range = document.createRange();
        const spanELemCollection = rteObj.inputElement.querySelectorAll('span');
        range.setStart(spanELemCollection[0].firstChild, 0);
        range.setEnd(spanELemCollection[2].firstChild, spanELemCollection[2].firstChild.textContent.length);
        domSelection.setRange(document, range);
        SelectionCommands.applyFormat(document, 'fontcolor', rteObj.element.querySelector('.e-content'), 'P', null, 'rgb(255, 0, 0)');
        const updatedSpanElemCollection = rteObj.inputElement.querySelectorAll('span');
        expect(updatedSpanElemCollection.length).toEqual(3);
        const liElementCollection = rteObj.inputElement.querySelectorAll('li');
        expect(liElementCollection[0].style.color).toEqual('rgb(255, 0, 0)');
        expect(liElementCollection[1].style.color).toEqual('rgb(255, 0, 0)');
        expect(liElementCollection[2].style.color).toEqual('rgb(255, 0, 0)');
    });
});

describe('850066 - Font color does not applied not properly', () => {   
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    beforeEach(() => {
        rteObj = renderRTE({
            value: `<ol><li class="li1">FristLI<ol><li class="li2">SecondLI<ol><li class="li3">ThirdLI</li><li class="li4">FourthLI<ol><li class="li5">FIfthLI<ol><li class="li6">SixthLI</li></ol></li></ol></li></ol></li></ol></li></ol>`,
            toolbarSettings: {
                items: ['FontColor']
            }
        });
    });
    afterEach(() => {
        destroy(rteObj);
    });
    it('Test for font color for select all text node', () => {
        const range: Range = document.createRange();
        range.setStart(rteObj.element.querySelector('.li1').childNodes[0], 0);
        range.setEnd(rteObj.element.querySelector('.li6').childNodes[0], 7);
        domSelection.setRange(document, range);
        // Apply font color
        SelectionCommands.applyFormat(document, 'fontcolor', rteObj.element.querySelector('.e-content'), 'P', null, 'rgb(255, 0, 0)');
        let fristLI: HTMLElement = rteObj.element.querySelector('.li1')
        expect(fristLI.style.color === 'rgb(255, 0, 0)').toEqual(true);
        let lastLI: HTMLElement = rteObj.element.querySelector('.li6')
        expect(lastLI.style.color === 'rgb(255, 0, 0)').toEqual(true);
    });
    it('Test for font color for selected text node', () => {
        const range: Range = document.createRange();
        range.setStart(rteObj.element.querySelector('.li2').childNodes[0], 3);
        range.setEnd(rteObj.element.querySelector('.li5').childNodes[0], 2);
        domSelection.setRange(document, range);
        // Apply font color
        SelectionCommands.applyFormat(document, 'fontcolor', rteObj.element.querySelector('.e-content'), 'P', null, 'rgb(255, 0, 0)');
        let fristLI: HTMLElement = rteObj.element.querySelector('.li1')
        expect(fristLI.style.color === '').toEqual(true);
        let thirdLI: HTMLElement = rteObj.element.querySelector('.li3')
        expect(thirdLI.style.color === 'rgb(255, 0, 0)').toEqual(true);
        let fourthLI: HTMLElement = rteObj.element.querySelector('.li4')
        expect(fourthLI.style.color === 'rgb(255, 0, 0)').toEqual(true);
    });
});

describe('930869 - Inconsistent Font Color Reset When Applying "No Color" to Multiple List Items', function () {
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    beforeEach(() => {
        rteObj = renderRTE({
            value: `<ol><li class="li1">FristLI<ol><li class="li2">SecondLI<ol><li class="li3">ThirdLI</li><li class="li4">FourthLI<ol><li class="li5">FIfthLI<ol><li class="li6">SixthLI</li></ol></li></ol></li></ol></li></ol></li></ol>`,
            toolbarSettings: {
                items: ['FontColor']
            }
        });
    });
    afterEach(() => {
        destroy(rteObj);
    });
    it('Test for font color for select all text node', function () {
        var range = document.createRange();
        range.setStart(rteObj.element.querySelector('.li1').childNodes[0], 0);
        range.setEnd(rteObj.element.querySelector('.li6').childNodes[0], 7);
        domSelection.setRange(document, range);
        SelectionCommands.applyFormat(document, 'fontcolor', rteObj.element.querySelector('.e-content'), 'P', null, 'rgb(255, 0, 0)');
        var fristLI = rteObj.element.querySelector('.li1');
        expect(fristLI.style.color === 'rgb(255, 0, 0)').toEqual(true);
        var lastLI = rteObj.element.querySelector('.li6');
        expect(lastLI.style.color === 'rgb(255, 0, 0)').toEqual(true);
        let rteEle = rteObj.element;
        let fontColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn")[0];
        fontColorPicker.click();
        let blackItem: HTMLElement = <HTMLElement>document.querySelector(".e-nocolor-item").nextElementSibling;
        blackItem.click();
        SelectionCommands.applyFormat(
            document,
            'fontcolor',
            rteObj.element.querySelector('.e-content'),
            'P',
            null,
            '' 
        );
        expect(fristLI.style.color).toEqual('');
        expect(lastLI.style.color).toEqual('');

    });
});
describe('872185 - Font family does not applied properly in nested list', () => {   
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    beforeEach(() => {
        rteObj = renderRTE({
            value: `<ol><li class='li1'>material</li><li class='li2'>fluent<ol><li class='li3'>tailwind</li></ol></li><li class='li4'>bootstrap</li><li class='li5'>fabric</li><li class='li6'>highContrast</li></ol>`,
            toolbarSettings: {
                items: ['FontName']
            }
        });
    });
    afterEach(() => {
        destroy(rteObj);
    });
    it('Test for font name for select all text node', () => {
        const range: Range = document.createRange();
        range.setStart(rteObj.element.querySelector('.li1').childNodes[0], 0);
        range.setEnd(rteObj.element.querySelector('.li6').childNodes[0], 12);
        domSelection.setRange(document, range);
        // Apply font name
        SelectionCommands.applyFormat(document, 'fontname', rteObj.element.querySelector('.e-content'), 'P', null, 'Impact,Charcoal,sans-serif');
        let fristLI: HTMLElement = rteObj.element.querySelector('.li1')
        expect(fristLI.style.fontFamily === 'Impact, Charcoal, sans-serif').toEqual(true);
    });
});

describe(' 873091 - Hyperlinks got removed when we apply font color to the link text in RichTextEditor', () => {   
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    beforeEach(() => {
        rteObj = renderRTE({
            value: `<p id="parentP" style="text-align: center; margin: 0px;">You <strong id ="strongNode" style="color:red;">received</strong> this email at {{Contact.Email}}. You <em id="bgNode" style="background-color:red;">can</em> <a href="{{System.Link.Form.ProfileUpdate}}" style="color: inherit;" target="_blank" aria-label="Open in new window">change your preferences</a> or <a href="{{System.Link.Unsubscribe}}" id="anchorNode" style="color: inherit;" target="_blank" aria-label="Open in new window">unsubscribe</a>.  <br>  <br>  © {{System.CurrentYear}} {{Account.Company}} <strong style="fontsize:16pt;" id="fontSizeEle">All</strong> rights <em style="font-family: Impact, Charcoal, sans-serif;" id="fontFamNode">reserved</em>. {{Account.StreetAddress}}, {{Account.StreetAddress2}}, {{Account.AddressLocality}}, {{Account.AddressRegion}} {{Account.PostalCode}}  </p>`,
            toolbarSettings: {
                items: ['FontColor']
            }
        });
    });
    afterEach(() => {
        destroy(rteObj);
    });
    it('Test for font color applied anchor element', () => {
        let anchorNode: Node = document.getElementById('anchorNode');
        let parentP: Node = document.getElementById('parentP');
        let text: Text = anchorNode.nextSibling as Text;
        domSelection.setSelectionText(document, anchorNode, text, 0, 1);
        SelectionCommands.applyFormat(document, 'fontcolor', parentP, 'P', null, 'rgb(102, 102, 0)');
        expect((anchorNode as HTMLElement).style.color === 'rgb(102, 102, 0)').toEqual(true);
    });
    it('Test for backgroundColor applied strong element',()=>{
        let strongNode: Node = document.getElementById('strongNode');
        let parentP: Node = document.getElementById('parentP');
        domSelection.setSelectionText(document, strongNode, strongNode, 0, 1);
        SelectionCommands.applyFormat(document, 'fontcolor', parentP, 'P', null, 'rgb(102, 102, 0)');
        expect((strongNode as HTMLElement).parentElement.style.color === 'rgb(102, 102, 0)').toEqual(true);
    });
    it('Test for background color applied italic element',()=>{
        let bgNode: Node = document.getElementById('bgNode');
        let parentP: Node = document.getElementById('parentP');
        domSelection.setSelectionText(document, bgNode, bgNode, 0, 1);
        SelectionCommands.applyFormat(document, 'backgroundcolor', parentP, 'P', null, 'rgb(102, 102, 0)');
        expect((bgNode as HTMLElement).parentElement.style.backgroundColor === 'rgb(102, 102, 0)').toEqual(true);
    });
    it('Test for fontSize applied strong element',()=>{
        let fontSizeNode: Node = document.getElementById('fontSizeEle');
        let parentP: Node = document.getElementById('parentP');
        domSelection.setSelectionText(document, fontSizeNode, fontSizeNode, 0, 1);
        SelectionCommands.applyFormat(document, 'fontsize', parentP, 'P', null, '16pt');
        expect((fontSizeNode as HTMLElement).parentElement.style.fontSize === '16pt').toEqual(true);
    });
    it('Test for fontFamily applied italic element',()=>{
        let fontFamNode: Node = document.getElementById('fontFamNode');
        let parentP: Node = document.getElementById('parentP');
        domSelection.setSelectionText(document, fontFamNode, fontFamNode, 0, 1);
        SelectionCommands.applyFormat(document, 'fontname', parentP, 'P', null, 'Tahoma,Geneva,sans-serif');
        expect((fontFamNode as HTMLElement).parentElement.style.fontFamily === 'Tahoma, Geneva, sans-serif').toEqual(true);
    });
});

describe('876813 - Font color did not apply all lists properly', () => {
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    beforeEach(() => {
        rteObj = renderRTE({
            value: `<ol><li class="li1">FristLI<ol><li class="li2">SecondLI<ol><li class="li3">ThirdLI</li><li class="li4">FourthLI<ol><li class="li5">FIfthLI<ol><li class="li6">SixthLI</li></ol></li></ol></li></ol></li></ol></li></ol>`,
            toolbarSettings: {
                items: ['FontSize']
            }
        });
    });
    afterEach(() => {
        destroy(rteObj);
    });
    it('Test for font size for select all text node', () => {
        const range: Range = document.createRange();
        range.setStart(rteObj.element.querySelector('.li1').childNodes[0], 0);
        range.setEnd(rteObj.element.querySelector('.li6').childNodes[0], 7);
        domSelection.setRange(document, range);
        // Apply font size
        SelectionCommands.applyFormat(document, 'fontsize', rteObj.element.querySelector('.e-content'), 'P', null, '18pt');
        let fristLI: HTMLElement = rteObj.element.querySelector('.li1')
        expect(fristLI.style.fontSize === '18pt').toEqual(true);
        let lastLI: HTMLElement = rteObj.element.querySelector('.li6')
        expect(lastLI.style.fontSize === '18pt').toEqual(true);
    });
    it('Test for font size for selected text node', () => {
        const range: Range = document.createRange();
        range.setStart(rteObj.element.querySelector('.li2').childNodes[0], 3);
        range.setEnd(rteObj.element.querySelector('.li5').childNodes[0], 2);
        domSelection.setRange(document, range);
        // Apply font size
        SelectionCommands.applyFormat(document, 'fontsize', rteObj.element.querySelector('.e-content'), 'P', null, '18pt');
        let fristLI: HTMLElement = rteObj.element.querySelector('.li1')
        expect(fristLI.style.fontSize === '').toEqual(true);
        let thirdLI: HTMLElement = rteObj.element.querySelector('.li3')
        expect(thirdLI.style.fontSize === '18pt').toEqual(true);
        let fourthLI: HTMLElement = rteObj.element.querySelector('.li4')
        expect(fourthLI.style.fontSize === '18pt').toEqual(true);
    });
});
describe("876837: Bold format not applied to the list number when already bold content is present in the list content.", () => {
    let rteEle: HTMLElement;
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    beforeEach(() => {
        rteObj = renderRTE({
            value:`<ol><li id="list"><p id="paragraph1">Options
            to get the HTML elements with styles.<strong>Hello</strong></p></li></ol>`
        });
        rteEle = rteObj.element;
    });
    afterEach(() => {
        destroy(rteObj);
    });
    it('Apply Bold tag for the list', () => {
        let node1: Node = document.querySelector('p');
        let text1: Text = node1.childNodes[0] as Text;
        let text2: Text = node1.childNodes[1] as Text;
        domSelection.setSelectionText(document, text1, text2, 0, 1);
        SelectionCommands.applyFormat(document, 'bold', rteObj.element.querySelector('.e-content'), 'P');
        let LiContent=document.querySelector('li');
        let style=LiContent.getAttribute('style');
        expect(style).toEqual('font-weight: bold;');
    });
    it('Apply italic for the list', () => {
        let node1: Node = document.querySelector('p');
        let text1: Text = node1.childNodes[0] as Text;
        let text2: Text = node1.childNodes[1] as Text;
        domSelection.setSelectionText(document, text1, text2, 0, 1);
        SelectionCommands.applyFormat(document, 'italic', rteObj.element.querySelector('.e-content'), 'P');
        let LiContent=document.querySelector('li');
        let style1=LiContent.getAttribute('style');
        expect(style1).toEqual('font-style: italic;');
    });
    it('Apply font family for the list', () => {
        let node1: Node = document.querySelector('p');
        let text1: Text = node1.childNodes[0] as Text;
        let text2: Text = node1.childNodes[1] as Text;
        domSelection.setSelectionText(document, text1, text2, 0, 1);
        SelectionCommands.applyFormat(document, 'fontname', rteObj.element.querySelector('.e-content'), 'P',  null,'Tahoma,Geneva,sans-serif');
        let LiContent=document.querySelector('li');
        let style1=LiContent.getAttribute('style');
        expect(style1).toEqual('font-family: Tahoma, Geneva, sans-serif;');
    });
    it('Apply font color for the list', () => {
        let node1: Node = document.querySelector('p');
        let text1: Text = node1.childNodes[0] as Text;
        let text2: Text = node1.childNodes[1] as Text;
        domSelection.setSelectionText(document, text1, text2, 0, 1);
        SelectionCommands.applyFormat(document, 'fontcolor', rteObj.element.querySelector('.e-content'), 'P', null, 'rgb(255, 0, 0)');
        let LiContent=document.querySelector('li');
        let style1=LiContent.getAttribute('style');
        expect(style1).toEqual('color: rgb(255, 0, 0); text-decoration: inherit;');
    });
    it('Apply font size for the list', () => {
        let node1: Node = document.querySelector('p');
        let text1: Text = node1.childNodes[0] as Text;
        let text2: Text = node1.childNodes[1] as Text;
        domSelection.setSelectionText(document, text1, text2, 0, 1);
        SelectionCommands.applyFormat(document, 'fontsize', rteObj.element.querySelector('.e-content'), 'P', null, '14px');
        let LiContent=document.querySelector('li');
        let style1=LiContent.getAttribute('style');
        expect(style1).toEqual('font-size: 14px;');
    });
});
describe("921530: Font Color Not Updating Correctly on Certain Text.", () => {
    let rteEle: HTMLElement;
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    beforeEach(() => {
        rteObj = renderRTE({
            value:`<ol><li><span>S</span><span>A</span></li></ol>`
        });
        rteEle = rteObj.element;
    });
    afterEach(() => {
        destroy(rteObj);
    });
    it('parse font tag into span tag', () => {
        const value: string = rteObj.htmlEditorModule.sanitizeHelper(`<span><font color="#0070c0">Sample4</font></span>`); 
        expect(value).toEqual(`<span><span style="color: rgb(0, 112, 192);">Sample4</span></span>`);
    });
    it('Apply font family for the list while have multiple span', () => {
        let node1: Node = document.querySelector('ol');
        domSelection.setSelectionNode(document, node1);
        SelectionCommands.applyFormat(document, 'fontname', rteObj.element.querySelector('.e-content'), 'P',  null,'Tahoma,Geneva,sans-serif');
        let LiContent=document.querySelector('li');
        let style1=LiContent.getAttribute('style');
        expect(style1).toEqual('font-family: Tahoma, Geneva, sans-serif;');
    });
    it('Apply font color for the list while have multiple span', () => {
        let node1: Node = document.querySelector('ol');
        domSelection.setSelectionNode(document, node1);
        SelectionCommands.applyFormat(document, 'fontcolor', rteObj.element.querySelector('.e-content'), 'P', null, 'rgb(255, 0, 0)');
        let LiContent=document.querySelector('li');
        let style1=LiContent.getAttribute('style');
        expect(style1).toEqual('color: rgb(255, 0, 0); text-decoration: inherit;');
    });
    it('Apply font size for the list while have multiple span', () => {
        let node1: Node = document.querySelector('ol');
        domSelection.setSelectionNode(document, node1);
        SelectionCommands.applyFormat(document, 'fontsize', rteObj.element.querySelector('.e-content'), 'P', null, '14px');
        let LiContent=document.querySelector('li');
        let style1=LiContent.getAttribute('style');
        expect(style1).toEqual('font-size: 14px;');
    });
});
describe('888161 - Font color applied to full line instead of selected text', () => {
    let innervalue: string = `<ul><li>hello <span style="background-color: rgb(255, 255, 0);">word </span>this is me</li></ul>`;
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
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });

    it('select text and apply background color and font color', (done) => {
        let focusNode = rteObj.inputElement.querySelector('span');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, focusNode, focusNode, 0, 1);
        SelectionCommands.applyFormat(document, 'fontcolor', rteObj.inputElement, 'P', null, 'rgb(102, 102, 0)');
        expect((rteObj as any).inputElement.innerHTML).toBe(`<ul><li>hello <span style="color: rgb(102, 102, 0); text-decoration: inherit;"><span style="background-color: rgb(255, 255, 0);">word </span></span>this is me</li></ul>`);
        done();
    });
});
describe('922981 - Background color is not applied properly when formatting multiple contents in the editor', () => {
    let innervalue: string = `<p style="text-align: left;"><span style="color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif; font-size: 10px; font-style: normal; font-weight: 400; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;"><strong><span style="text-decoration: line-through;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula</span></strong><span style="text-decoration: line-through;">, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus va</span><strong><span style="text-decoration: line-through;">rius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,</span></strong></span></p>`;
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
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });

    it('Background color is not applied properly when formatting multiple contents in the editor', (done) => {
        let focusNode = rteObj.inputElement.querySelector('p');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, focusNode, focusNode, 0, 1);
        SelectionCommands.applyFormat(document, 'backgroundcolor', rteObj.inputElement, 'P', null, 'rgb(255, 255, 0)');
        expect((rteObj as any).inputElement.innerHTML).toBe(`<p style="text-align: left;"><span style="color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif; font-size: 10px; font-style: normal; font-weight: 400; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 0); float: none; display: inline !important;"><strong><span style="text-decoration: line-through; font-size: 10px;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula</span></strong></span><span style="color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif; font-size: 10px; font-style: normal; font-weight: 400; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 0); float: none; display: inline !important;"><span style="text-decoration: line-through; font-size: 10px;">, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus va</span></span><span style="color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif; font-size: 10px; font-style: normal; font-weight: 400; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 0); float: none; display: inline !important;"><strong><span style="text-decoration: line-through; font-size: 10px;">rius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,</span></strong></span></p>`);
        done();
    });
});
describe('888243 - Single sentence break into double sentence', () => {
    let innervalue: string = `<p>hello world this is me</p>`;
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
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
    it('select text and apply background color and font color', () => {
        let focusNode = rteObj.inputElement.querySelector('p');
        setCursorPoint(focusNode, 0);
        SelectionCommands.applyFormat(document, 'fontsize', focusNode, 'P', null, '20px');
        SelectionCommands.applyFormat(document, 'fontsize', focusNode, 'P', null, '24px');
        SelectionCommands.applyFormat(document, 'fontsize', focusNode, 'P', null, '18px');
        focusNode = rteObj.inputElement.querySelector('p');
        expect(focusNode.innerHTML===`<span style="font-size: 18px;">​</span>hello world this is me`).toBe(true);
    });
});
describe(' - feature for code format', () => {
    let innervalue: string = `<p>Hello world this is the sample for code feature .</p>`;
    let rteObj: any;

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: innervalue,
            toolbarSettings: {
                items: ['InlineCode']
            }
        });
        done();
    });
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });

    it('select text and apply code format', (done) => {
        let focusNode = rteObj.inputElement.querySelector('p');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, focusNode, focusNode, 0, 1);
        SelectionCommands.applyFormat(document, 'inlinecode', focusNode, 'P');
        expect((rteObj as any).inputElement.innerHTML).toBe(`<p><code>Hello world this is the sample for code feature .</code></p>`);
        SelectionCommands.applyFormat(document, 'inlinecode', focusNode, 'P');
        expect((rteObj as any).inputElement.innerHTML).toBe(`<p>Hello world this is the sample for code feature .</p>`);
        done();
    })
    it('select text apply code format using and checking toolbar status', (done) => {
        let focusNode = rteObj.inputElement.querySelector('p');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, focusNode, focusNode, 0, 1);
        let codeButton: HTMLElement = document.querySelectorAll(".e-toolbar-item")[0] as HTMLElement;
        codeButton.click();
        expect(codeButton.classList.contains('e-active')).toBe(true);
        codeButton.click();
        expect(codeButton.classList.contains('e-active')).toBe(false);
        done();
    });
});

describe('929888 - Bold and Shift+Enter Handling in Empty RTE', () => {
    let rteObj: any;
    let rteEle: HTMLElement;
    let boldItem: HTMLElement;
    let keyboardEventArgs = {
        preventDefault: function () { },
        altKey: false,
        ctrlKey: false,
        shiftKey: true,
        char: '',
        key: '',
        charCode: 13,
        keyCode: 13,
        which: 13,
        code: 'Enter',
        action: 'enter',
        type: 'keydown'
    };

    beforeEach((done: Function) => {
        rteObj = renderRTE({
            value: '',
            toolbarSettings: {
                items: ['Bold']
            }
        });
        rteEle = rteObj.element;
        done();
    });

    afterEach((done: Function) => {
        destroy(rteObj);
        done();
    });

    it('Testing bold and Shift+Enter behavior in an empty RTE', (done) => {
        rteObj.focusIn();
        boldItem = rteEle.querySelector('#' + rteObj.element.id + '_toolbar_Bold');
        boldItem.click();
        (<any>rteObj).keyDown(keyboardEventArgs);
        boldItem.click();
        (<any>rteObj).keyDown(keyboardEventArgs);
        setTimeout(() => {
            expect(rteObj.getHtml()).toBe('<p><br><br><br><br></p>');
            done();
        }, 0);
    });
});

describe(' - feature for code format using execCommand', () => {
    let innervalue: string = `<p>Hello world this is the sample for code feature .</p>`;
    let rteObj: any;

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            value: innervalue,
            toolbarSettings: {
                items: [{
                    click: function () {
                        let customBtn = rteObj.element.querySelector('#custom_tbar');
                        rteObj.executeCommand('InlineCode');
                    },
                    tooltipText: 'Insert Symbol',
                    template:
                        '<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%"><div class="e-tbar-btn-text" style="font-weight: 500;"> Apply code</div></button>',
                },
                    '|',
                    'Undo',
                ]
            },
        });
        done();
    });
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });

    it('select text and apply code format', (done) => {
        let focusNode = rteObj.inputElement.querySelector('p');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, focusNode, focusNode, 0, 1);
        document.getElementById('custom_tbar').click();
        expect((rteObj as any).inputElement.innerHTML).toBe(`<p><code>Hello world this is the sample for code feature .</code></p>`);
        done();
    });
});

describe('876813 - Apply and revert font size for nested list', () => {
    let rteObj: any;   
    let domSelection: NodeSelection = new NodeSelection();
    beforeEach((done: Function) => {
        rteObj = renderRTE({
            value: `<ul><li class=\"li1\">First item<ul><li class=\"li2\">Second item<ul><li class=\"li3\">Third item</li><li class=\"li4\">Fourth item<ul><li class=\"li5\">Fifth item<ul><li class=\"li6\">Sixth item</li></ul></li></ul></li></ul></li></ul></li></ul>`,
            toolbarSettings: {
                items: ['FontSize']
            }
        });
        done();
    });
    
    afterEach((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
    it('Test for applying and reverting font size for inline styles in a nested list', (done) => {
        const range: Range = document.createRange();
        range.setStart(rteObj.element.querySelector('.li1').childNodes[0], 0);
        range.setEnd(rteObj.element.querySelector('.li6').childNodes[0], 10);
        domSelection.setRange(document, range);
        SelectionCommands.applyFormat(document, 'fontsize', rteObj.element.querySelector('.e-content'), 'P', null, '18pt');
        const liElements = rteObj.element.querySelectorAll('li');
        liElements.forEach((li: HTMLElement) => {
            expect(li.style.fontSize).toEqual('18pt');
        });
        SelectionCommands.applyFormat(document, 'fontsize', rteObj.element.querySelector('.e-content'), 'P', null, '');
        liElements.forEach((li: HTMLElement) => {
            expect(li.style.fontSize).toEqual('');
        });
        done();
    });
});

describe('938238 - MAC - Safari - Selection not maintaiend when bold format reverted', () => {
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    let defaultUA: string = navigator.userAgent;
    let defaultVendor: string = navigator.vendor;
    let safari: string = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15";
    let safariVendor: string = "Apple Computer, Inc.";
    beforeAll(() => {
        Browser.userAgent = safari;
        rteObj = renderRTE({
            value: `<p><strong class="startNode">The</strong> Rich <span style="text-decoration: underline;" class="endNode">Text</span> Editor</p>`,
            toolbarSettings: {
                items: ['FontSize']
            }
        });
    });
    
    afterAll(() => {
        destroy(rteObj);
        Browser.userAgent = defaultUA;
    });
    it('Safari - Testing selection is restored when bold format is reverted', (done) => {
        const range: Range = document.createRange();
        range.setStart(rteObj.element.querySelector('.startNode').childNodes[0], 0);
        range.setEnd(rteObj.element.querySelector('.endNode').childNodes[0], 4);
        domSelection.setRange(document, range);
        SelectionCommands.applyFormat(document, 'bold', rteObj.element.querySelector('.e-content'), 'P');
        expect(rteObj.element.querySelector('.e-content').innerHTML).toBe('<p>The Rich <span style="text-decoration: underline;" class="endNode">Text</span> Editor</p>');
        expect(window.getSelection().getRangeAt(0).startContainer.textContent === 'The').toBe(true);
        done();
    });
});

describe('939682: Console error occurs when applying bold (Ctrl+B) on a selected link in Safari browser', () => {
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    let defaultUA: string = navigator.userAgent;
    let safari: string = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15";
    beforeAll(() => {
        Browser.userAgent = safari;
        rteObj = renderRTE({
            value: `<p><img alt="Sky with <br><p style=" font-size:="" 16px;="" font-style:="" normal;="" font-weight:="" 400;="" text-align:="" start;="" text-indent:="" 0px;="" text-transform:="" none;="" white-space:="" text-decoration:="" margin:="" 0.5em="" 0px="" 1em;="" color:="" rgb(32,="" 33,="" 34);="" font-family:="" sans-serif;"="" class="e-rte-image e-imginline">In 1986, Midland re-organised its British and Irish operations, and as part of this process it separated its Northern Bank branches in the Republic of Ireland and transferred into a newly formed company called<span class="Apple-converted-space">&nbsp;</span><a href="https://en.wikipedia.org/wiki/Northern_Bank_(Ireland)_Limited" class="mw-redirect" title="Northern Bank (Ireland) Limited" style="text-decoration: none; color: var(--color-visited,#6a60b0); background: none; border-radius: 2px;">Northern Bank (Ireland) Limited</a>.<sup id="cite_ref-Freitag_4-1" class="reference" style="line-height: 1; white-space: nowrap; font-weight: normal; font-style: normal; font-size: 12.8px;"><a href="https://en.wikipedia.org/wiki/Danske_Bank_(Northern_Ireland)#cite_note-Freitag-4" style="text-decoration: none; color: var(--color-visited,#6a60b0); background: none; border-radius: 2px;"><span class="cite-bracket">[</span>4<span class="cite-bracket">]</span></a></sup></p><div class="mw-heading mw-heading3" style="font-style: normal; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; text-decoration: none; color: var(--color-emphasized,#101418); font-weight: bold; margin: 0.25em 0px; padding-top: 0.5em; padding-bottom: 0px; display: flow-root; font-size: 1.2em; line-height: 1.6; font-family: sans-serif;"><h3 id="Acquisition_by_National_Australia_Bank" style="color: inherit; font-weight: bold; margin: 0px 0px 0.25em; padding: 0px; display: inline; font-size: inherit; border: 0px; font-style: inherit; line-height: 1.6; font-family: inherit;">Acquisition by National Australia Ban</h3></div>`,
            toolbarSettings: {
                items: ['Bold']
            }
        });
    });
    afterAll(() => {
        destroy(rteObj);
        Browser.userAgent = defaultUA;
    });
    it('should apply bold format without console errors', (done) => {
        const range: Range = document.createRange();
        const startTextNode = rteObj.element.querySelector('p').childNodes[3].childNodes[0];
        const endTextNode = rteObj.element.querySelector('h3').childNodes[0];
        const startOffset = startTextNode.textContent.indexOf('rthern');
        const endOffset = endTextNode.textContent.indexOf('Ba') + 2;
        range.setStart(startTextNode, startOffset);
        range.setEnd(endTextNode, endOffset);
        domSelection.setRange(document, range);
        SelectionCommands.applyFormat(document, 'bold', rteObj.element.querySelector('.e-content'), 'P');
        expect(rteObj.element.querySelector('strong')).not.toBeNull();
        done();
    });
});

describe('943013: Script Error Occurs After Pasting a Web URL in a Bold Formatted List and Removing Bold Formatting', () => {
    let rteObj: any;
    beforeAll(() => {
        rteObj = renderRTE({
            value: `<ul><li style="font-weight: bold;"><strong class="startNode">Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.<br><a class="e-rte-anchor" href="https://npmci.syncfusion.com/development/demos/#/tailwind3/rich-text-editor/tools.html" title="https://npmci.syncfusion.com/development/demos/#/tailwind3/rich-text-editor/tools.html" target="_blank" aria-label="Open in new window">https://npmci.syncfusion.com/development/demos/#/tailwind3/rich-text-editor/tools.html </a><br></strong></li><li><strong>Inline styles include </strong><b>bold</b><strong>, </strong><em><strong>italic</strong></em><strong>, </strong><span style="text-decoration: underline"><strong>underline</strong></span><strong>, </strong><span style="text-decoration: line-through"><strong>strikethrough</strong></span><strong>, </strong><a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window"><strong>hyperlinks</strong></a><strong class="endNode">, 😀 and more.</strong></li></ul>`,
            toolbarSettings: {
                items: ['Bold']
            }
        });
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('Script Error Occurs After Pasting a Web URL in a Bold Formatted List and Removing Bold Formatting', (done) => {
        let startNode = rteObj.inputElement.querySelector('.startNode');
        let endNode = rteObj.inputElement.querySelector('.endNode');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 14);
        SelectionCommands.applyFormat(document, 'bold', rteObj.element.querySelector('.e-content'), 'P');
        expect(rteObj.element.querySelectorAll('strong').length === 0).toBe(true);
        done();
    });
});

describe('942951: IndexSizeError Shown in Console After Applying Bold Format to Selected Heading 1 Text', () => {
    let rteObj: any;
    let domSelection: NodeSelection = new NodeSelection();
    let defaultUA: string = navigator.userAgent;
    let defaultVendor: string = navigator.vendor;
    let safari: string = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15";
    let safariVendor: string = "Apple Computer, Inc.";
    beforeAll(() => {
        Object.defineProperty(navigator, 'userAgent', {
            value: safari,
            configurable: true
        });
        Object.defineProperty(navigator, 'vendor', {
            value: safariVendor,
            configurable: true
        });

        rteObj = renderRTE({
            value: `<h1>Welcome to the Syncfusion<sup>®</sup> Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>`,
            toolbarSettings: {
                items: ['Bold']
            }
        });
    });
    afterAll(() => {
        destroy(rteObj);
        Object.defineProperty(navigator, 'userAgent', {
            value: defaultUA,
            configurable: true
        });
        Object.defineProperty(navigator, 'vendor', {
            value: defaultVendor,
            configurable: true
        });
    });
    it('should apply bold formatting to the entire H1 element', (done) => {
        const range: Range = document.createRange();
        const h1Element = rteObj.element.querySelector('h1');
        range.setStart(h1Element.firstChild, 0);
        range.setEnd(h1Element.lastChild, h1Element.lastChild.textContent.length);
        domSelection.setRange(document, range);
        SelectionCommands.applyFormat(document, 'bold', rteObj.element.querySelector('.e-content'), 'P');
        expect(h1Element.querySelector('strong')).not.toBeNull();
        done();
    });
});
describe('943182 - Font Weight Normal added to the List item.', () => {
    let rteObj: any;
    beforeAll(() => {
        rteObj = renderRTE({
            value: `<ol><li style="font-weight: bold;"><strong>RichTextEditor</strong></li></ol>`,
            toolbarSettings: {
                items: ['Bold', 'Italic', 'Underline']
            }
        });
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
    it('Should revert the font weight and italic style from the LI element when applied to the list element.', (done) => {
        var element = rteObj.inputElement.querySelector('OL li').childNodes[0];
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, element.childNodes[0], element.childNodes[0], 0, element.childNodes[0].length);
        expect(rteObj.inputElement.querySelector('OL LI').style.fontWeight === 'bold').toBe(true);
        rteObj.element.querySelector('#' + rteObj.getID() + '_toolbar_Bold').click();
        expect(rteObj.inputElement.querySelector('OL LI').style.fontWeight === '').toBe(true);
        rteObj.value = `<ol><li style="font-weight: bold; font-style: italic;"><strong><em>RichTextEditor</em></strong></li></ol>`;
        rteObj.dataBind();
        element = rteObj.inputElement.querySelector('OL li').childNodes[0];
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, element.childNodes[0].childNodes[0], element.childNodes[0].childNodes[0], 4, 8);
        expect(rteObj.inputElement.querySelector('OL LI').style.fontWeight === 'bold').toBe(true);
        rteObj.element.querySelector('#' + rteObj.getID() + '_toolbar_Bold').click();
        expect(rteObj.inputElement.querySelector('OL LI').style.fontWeight === '').toBe(true);
        expect(rteObj.inputElement.querySelector('OL LI').style.fontStyle === 'italic').toBe(true);
        rteObj.element.querySelector('#' + rteObj.getID() + '_toolbar_Italic').click();
        expect(rteObj.inputElement.querySelector('OL LI').style.fontStyle === '').toBe(true);
        done();
    });
});
