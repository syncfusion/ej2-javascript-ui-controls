import { NodeSelection } from '../../../src/selection/selection';
import { SelectionCommands } from '../../../src/editor-manager/plugin/selection-commands';
/**
 * Selection spec document
 */
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
        '<span id="format6">the Rich Text Editor (RTE) <span style="color:rgb(102, 102, 0);">control</span> is an easy to render in' +
        'client side.</span>'+
        '</div>';


    let domSelection: NodeSelection = new NodeSelection();
    let selectionCommands: SelectionCommands = new SelectionCommands();
    //DIV Element
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    let ptag: Node = null;
    let fontTag: Node = null;
    let backTag: Node = null;
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
    it('Apply italic tag for end nodes', () => {
        let node1: Node = document.getElementById('bold01');
        let text1: Text = node1.childNodes[0] as Text;
        let node2: HTMLElement = document.getElementById('paragraph02');
        let text2: Text = node2.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text2, 12, 16);
        SelectionCommands.applyFormat(document, 'italic', parentDiv);
        expect(node1.childNodes.length).toEqual(2);
    });
    it('Apply italic tag for None nodes', () => {
        let node1: Node = document.getElementById('paragraph03');
        domSelection.setSelectionText(document, node1, node1, 0, 0);
        SelectionCommands.applyFormat(document, 'italic', parentDiv);
        expect(node1.childNodes.length).toEqual(2);
    });
    it('Apply Bold tag for multiple nodes', () => {
        let node1: Node = document.getElementById('paragraph4');
        let text1: Text = node1.childNodes[0] as Text;
        let node2: HTMLElement = document.getElementById('paragraph9');
        let text2: Text = node2.childNodes[0] as Text;
        ptag = node1;
        domSelection.setSelectionText(document, text1, text2, 0, 16);
        SelectionCommands.applyFormat(document, 'bold', parentDiv);
        expect(node1.childNodes[0].nodeName.toLowerCase()).toEqual('strong');
    });
    it('Apply subscript tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document, 'subscript', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('sub');
    });
    it('Apply underline tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document, 'underline', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('span');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0] as HTMLElement)
        .style.textDecoration).toEqual('underline');
    });
    it('Apply strikethrough tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document, 'strikethrough', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('span');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0] as HTMLElement)
        .style.textDecoration).toEqual('line-through');
    });
    it('Apply superscript tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document, 'superscript', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('sup');
    });
    it('Apply Italic tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document, 'italic', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0]
            .childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('em');
    });
    it('Revert Italic tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document,'italic', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0]
            .childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert superscript tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document,'superscript', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert strikethrough tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document,'strikethrough', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert underline tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document,'underline', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert subscript tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document,'subscript', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert Bold tag for multiple nodes', () => {
        SelectionCommands.applyFormat(document,'bold', parentDiv);
        expect(ptag.childNodes[0].nodeName).toEqual('#text');
    });
    it('Apply Bold tag for cursor position', () => {
        let node1: Node = document.getElementById('paragraph4');
        let text1: Text = node1.childNodes[0] as Text;
        ptag = node1;
        domSelection.setSelectionText(document, text1, text1, 1, 1);
        SelectionCommands.applyFormat(document, 'bold', parentDiv);
        expect(node1.childNodes[0].nodeName.toLowerCase()).toEqual('strong');
    });
    it('Apply subscript tag for cursor position', () => {
        SelectionCommands.applyFormat(document, 'subscript', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('sub');
    });
    it('Apply underline tag for cursor position', () => {
        SelectionCommands.applyFormat(document, 'underline', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('span');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0] as HTMLElement).style.textDecoration).toEqual('underline');
    });
    it('Apply strikethrough tag for cursor position', () => {
        SelectionCommands.applyFormat(document, 'strikethrough', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply superscript tag for cursor position', () => {
        SelectionCommands.applyFormat(document, 'superscript', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('sup');
    });
    it('Apply Italic tag for cursor position', () => {
        SelectionCommands.applyFormat(document, 'italic', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0]
            .childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('em');
    });
    it('Revert Italic tag for cursor position', () => {
        SelectionCommands.applyFormat(document,'italic', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0]
            .childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert superscript tag for cursor position', () => {
        SelectionCommands.applyFormat(document,'superscript', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert strikethrough tag for cursor position', () => {
        SelectionCommands.applyFormat(document,'strikethrough', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert underline tag for cursor position', () => {
        SelectionCommands.applyFormat(document,'underline', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert subscript tag for cursor position', () => {
        SelectionCommands.applyFormat(document,'subscript', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert Bold tag for cursor position', () => {
        SelectionCommands.applyFormat(document,'bold', parentDiv);
        expect(ptag.childNodes[0].nodeName).toEqual('#text');
    });
    it('Apply Bold tag for text node', () => {
        let node1: Node = document.getElementById('paragraph4');
        let text1: Text = node1.childNodes[0] as Text;
        ptag = node1;
        domSelection.setSelectionText(document, text1, text1, 0, 7);
        SelectionCommands.applyFormat(document, 'bold', parentDiv);
        expect(node1.childNodes[0].nodeName.toLowerCase()).toEqual('strong');
    });
    it('Apply subscript tag for text node', () => {
        SelectionCommands.applyFormat(document, 'subscript', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('sub');
    });
    it('Apply underline tag for text node', () => {
        SelectionCommands.applyFormat(document, 'underline', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('span');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0] as HTMLElement)
        .style.textDecoration).toEqual('underline');
    });
    it('Apply strikethrough tag for text node', () => {
        SelectionCommands.applyFormat(document, 'strikethrough', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('span');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0] as HTMLElement)
        .style.textDecoration).toEqual('line-through');
    });
    it('Apply superscript tag for text node', () => {
        SelectionCommands.applyFormat(document, 'superscript', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('sup');
    });
    it('Apply Italic tag for text node', () => {
        SelectionCommands.applyFormat(document, 'italic', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0]
            .childNodes[0].childNodes[0].childNodes[0].nodeName.toLowerCase()).toEqual('em');
    });
    it('Revert Italic tag for text node', () => {
        SelectionCommands.applyFormat(document,'italic', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0]
            .childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert superscript tag for text node', () => {
        SelectionCommands.applyFormat(document,'superscript', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert strikethrough tag for text node', () => {
        SelectionCommands.applyFormat(document,'strikethrough', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert underline tag for text node', () => {
        SelectionCommands.applyFormat(document,'underline', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert subscript tag for  text node', () => {
        SelectionCommands.applyFormat(document,'subscript', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].nodeName).toEqual('#text');
    });
    it('Revert Bold tag for text node', () => {
        SelectionCommands.applyFormat(document,'bold', parentDiv);
        expect(ptag.childNodes[0].nodeName).toEqual('#text');
    });

    // Apply font color
    it('Apply fontcolor tag for text node', () => {
        let node1: Node = document.getElementById('paragraph11');
        let text1: Text = node1.childNodes[0] as Text;
        ptag = node1;
        domSelection.setSelectionText(document, text1, text1, 0, 26);
        SelectionCommands.applyFormat(document, 'fontcolor', parentDiv, 'rgb(102, 102, 0)');
        expect((node1.childNodes[0] as HTMLElement).style.color).toEqual('rgb(102, 102, 0)');
        expect((node1.childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply fontname tag for text node', () => {
        SelectionCommands.applyFormat(document, 'fontname', parentDiv, 'Arial');
        expect((ptag.childNodes[0].childNodes[0] as HTMLElement).style.fontFamily).toEqual('Arial');
        expect((ptag.childNodes[0].childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply fontsize tag for text node', () => {
        SelectionCommands.applyFormat(document, 'fontsize', parentDiv, '20px');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0] as HTMLElement).style.fontSize).toEqual('20px');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply backgroundcolor tag for text node', () => {
        SelectionCommands.applyFormat(document, 'backgroundcolor', parentDiv,  'rgb(246, 198, 206)');
        expect(
        (ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0] as HTMLElement).style.backgroundColor).toEqual('rgb(246, 198, 206)');
        expect(
            (ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply uppercase tag for text node', () => {
        SelectionCommands.applyFormat(document, 'uppercase', parentDiv);
        expect(ptag.childNodes[0].childNodes[0].childNodes[0]
        .childNodes[0].textContent).toEqual('THE RICH TEXT EDITOR (RTE)');
    });
    it('Re - Apply lowercase tag for text node', () => {
        SelectionCommands.applyFormat(document, 'lowercase', parentDiv);
        fontTag = ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
        expect(ptag.childNodes[0].childNodes[0].childNodes[0]
            .childNodes[0].textContent).toEqual('the rich text editor (rte)');
    });
    it('Re - Apply backgroundcolor tag for text node', () => {
        SelectionCommands.applyFormat(document, 'backgroundcolor', parentDiv, 'rgb(246, 198, 2)');
        expect(
        (ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0] as HTMLElement).style.backgroundColor).toEqual('rgb(246, 198, 2)');
        expect(
            (ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Re - Apply fontsize tag for text node', () => {
        SelectionCommands.applyFormat(document, 'fontsize', parentDiv, '40px');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0] as HTMLElement).style.fontSize).toEqual('40px');
        expect((ptag.childNodes[0].childNodes[0].childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Re - Apply fontname tag for text node', () => {
        SelectionCommands.applyFormat(document, 'fontname', parentDiv, 'monospace');
        expect((ptag.childNodes[0].childNodes[0] as HTMLElement).style.fontFamily).toEqual('monospace');
        expect((ptag.childNodes[0].childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Re - Apply fontcolor tag for text node', () => {
        SelectionCommands.applyFormat(document, 'fontcolor', parentDiv, 'rgb(226, 10, 10)');
        expect((ptag.childNodes[0] as HTMLElement).style.color).toEqual('rgb(226, 10, 10)');
        expect((ptag.childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply fontcolor tag for already applied specific text node', () => {
        fontTag = ptag.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
        let text1: Text = fontTag.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 3, 10);
        SelectionCommands.applyFormat(document, 'fontcolor', parentDiv, 'rgb(102, 102, 0)');
        expect((ptag.childNodes[1] as HTMLElement).style.color).toEqual('rgb(102, 102, 0)');
        expect((ptag.childNodes[1] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply fontname tag for already applied specific text node', () => {
        SelectionCommands.applyFormat(document, 'fontname', parentDiv, 'Arial');
        expect((ptag.childNodes[1].childNodes[0] as HTMLElement).style.fontFamily).toEqual('Arial');
        expect((ptag.childNodes[1].childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply fontsize tag for already applied specific text node', () => {
        SelectionCommands.applyFormat(document, 'fontsize', parentDiv, '20px');
        expect((ptag.childNodes[1].childNodes[0].childNodes[0] as HTMLElement).style.fontSize).toEqual('20px');
        expect((ptag.childNodes[1].childNodes[0].childNodes[0] as HTMLElement).nodeName.toLowerCase()).toEqual('span');
    });
    it('Apply backgroundcolor tag for already applied specific text node', () => {
        SelectionCommands.applyFormat(document, 'backgroundcolor', parentDiv, 'rgb(246, 198, 206)');
        expect(
        (ptag.childNodes[1].childNodes[0].childNodes[0].childNodes[0] as HTMLElement).style.backgroundColor)
        .toEqual('rgb(246, 198, 206)');
        expect(
            (ptag.childNodes[1].childNodes[0].childNodes[0].childNodes[0] as HTMLElement).nodeName.toLowerCase())
            .toEqual('span');
        backTag = fontTag.parentNode;
    });
    it('Apply uppercase tag for already applied specific text node', () => {
        SelectionCommands.applyFormat(document, 'uppercase', parentDiv);
        expect(ptag.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent)
        .toEqual(' RICH T');
    });

    // spec coverage 
    it('Apply Bold tag for span style node', () => {
        let node1: Node = document.getElementById('bold1');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 0, 3);
        SelectionCommands.applyFormat(document, 'bold', parentDiv);
        expect(document.getElementById('boldparent').childNodes[0].textContent).toEqual('the');
    });
    it('Apply Italic tag for span style node', () => {
        let node1: Node = document.getElementById('italic1');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 0, 3);
        SelectionCommands.applyFormat(document, 'italic', parentDiv);
        expect(document.getElementById('italicparent').childNodes[0].textContent).toEqual('the');
    });
    it('Apply Underline tag for span style node', () => {
        let node1: Node = document.getElementById('underline1');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 0, 3);
        SelectionCommands.applyFormat(document, 'underline', parentDiv);
        expect(document.getElementById('italicparent').childNodes[0].textContent).toEqual('the');
    });
    it('Apply Strike tag for span style node', () => {
        let node1: Node = document.getElementById('strike1');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 0, 3);
        SelectionCommands.applyFormat(document, 'strikethrough', parentDiv);
        expect(document.getElementById('italicparent').childNodes[0].textContent).toEqual('the');
    });
    it('Apply Bold tag for cursor position 1', () => {
        let node1: Node = document.getElementById('cursor1');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 5, 5);
        SelectionCommands.applyFormat(document, 'bold', parentDiv);
        expect(node1.childNodes[1].nodeName.toLowerCase()).toEqual('strong');
    });
    it('Apply Bold tag for cursor position 2', () => {
        let node1: Node = document.getElementById('cursor5');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 4, 4);
        SelectionCommands.applyFormat(document, 'bold', parentDiv);
        expect(document.getElementById('cursor4').childNodes[1].nodeName.toLowerCase()).toEqual('#text');
    });
    it('Apply Bold tag for cursor position 3', () => {
        let node1: Node = document.getElementById('cursor7');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 4, 4);
        SelectionCommands.applyFormat(document, 'bold', parentDiv);
        expect(document.getElementById('cursor6').childNodes.length).toEqual(3);
    });
    it('Apply uppercase tag for cursor position 1', () => {
        let node1: Node = document.getElementById('cursor7');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 4, 4);
        SelectionCommands.applyFormat(document, 'uppercase', parentDiv);
        expect(document.getElementById('cursor6').childNodes.length).toEqual(3);
    });
    it('Apply strikethrough tag for cursor position 1', () => {
        let node1: Node = document.getElementById('cursor9');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 3, 3);
        SelectionCommands.applyFormat(document, 'strikethrough', parentDiv);
        expect(document.getElementById('cursor8').childNodes.length).toEqual(2);
    });
    // Branch coverage
    it('Unknown tag for cursor position', () => {
        let node1: Node = document.getElementById('cursor1');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 0, 3);
        SelectionCommands.applyFormat(document, 'scripts', parentDiv);
        expect(node1.nodeName.toLowerCase()).toEqual('span');
    });
    it('un formatted tag for selection', () => {
        let node1: Node = document.getElementById('cursor2');
        let node2: Node = document.getElementById('cursor3');
        let text1: Text = node1.childNodes[0] as Text;
        let text2: Text = node2.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text2, 0, 3);
        SelectionCommands.applyFormat(document, 'bold', parentDiv);
        expect(node1.childNodes[0].nodeName.toLowerCase()).toEqual('strong');
    });
    it('Edge browser formatted issue', () => {
        let node1: Node = document.getElementById('format1');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 0, text1.nodeValue.length);
        SelectionCommands.applyFormat(document, 'bold', parentDiv);
        expect(node1.childNodes[0].nodeName.toLowerCase()).toEqual('strong');
        SelectionCommands.applyFormat(document, 'bold', parentDiv);
        expect(node1.childNodes[0].nodeName.toLowerCase()).toEqual('#text');
    });
    it('Cursor pointer multiple style with empty node applied issue', () => {
        let node1: Node = document.getElementById('format4');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, 0, 0);
        SelectionCommands.applyFormat(document, 'bold', parentDiv);
        SelectionCommands.applyFormat(document, 'italic', parentDiv);
        SelectionCommands.applyFormat(document, 'underline', parentDiv);
        SelectionCommands.applyFormat(document, 'bold', parentDiv);
        expect(node1.childNodes[2].nodeName.toLowerCase()).toEqual('em');
        expect(node1.childNodes[2].childNodes[1].nodeName.toLowerCase()).toEqual('span');
    });
    it('Cursor pointer multiple style with textnode applied issue', () => {
        let node1: Node = document.getElementById('format5').querySelector('u');
        let text1: Text = node1.childNodes[0] as Text;
        domSelection.setSelectionText(document, text1, text1, text1.nodeValue.length, text1.nodeValue.length);
        SelectionCommands.applyFormat(document, 'bold', parentDiv);
        expect(document.getElementById('format5').nextSibling.nodeName.toLowerCase()).toEqual('em');
        expect(document.getElementById('format5').nextSibling.childNodes[0].nodeName.toLowerCase()).toEqual('u');
    });
    it('transparent background color not apllied issue', () => {
        let node1: Node = document.getElementById('format6');
        domSelection.setSelectionText(document, node1, node1, 0, node1.childNodes.length);
        SelectionCommands.applyFormat(document, 'fontcolor', parentDiv, '');
        expect((document.getElementById('format6').childNodes[1] as HTMLElement).style.color).toEqual('');
    });
});
