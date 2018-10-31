import { NodeSelection } from '../../../src/selection/selection';
import { ToolbarStatus } from '../../../src/editor-manager/plugin/toolbar-status';
import { IToolbarStatus } from '../../../src/common/interface';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * Selection spec document
 */
describe('Update Toolbar commands', () => {
    //HTML value
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
        '<strong><u><em id="italic51"></em></u></strong>' +
        '</div>'+
        '<em id="italic52">abc</em>';


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
    it('Check single Bold tag', () => {
        let node: Node = document.getElementById('bold31');
        new ToolbarStatus();
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], ['8pt'], ['Segoe UI']);
        expect(format.bold).toEqual(true);
        expect(format.italic).toEqual(false);
    });
    it('Check single Italic tag', () => {
        let node: Node = document.getElementById('italic31');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], ['8pt'], ['Segoe UI']);
        expect(format.italic).toEqual(true);
        expect(format.underline).toEqual(false);
    });
    it('Check single underline tag', () => {
        let node: Node = document.getElementById('underline31');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv);
        expect(format.underline).toEqual(true);
        expect(format.strikethrough).toEqual(false);
    });
    it('Check single strikethrough tag', () => {
        let node: Node = document.getElementById('strike31');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv);
        expect(format.strikethrough).toEqual(true);
        expect(format.superscript).toEqual(false);
    });
    it('Check single Superscript tag', () => {
        let node: Node = document.getElementById('sup31');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv);
        expect(format.superscript).toEqual(true);
        expect(format.subscript).toEqual(false);
    });
    it('Check single subscript tag', () => {
        let node: Node = document.getElementById('sub31');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv);
        expect(format.subscript).toEqual(true);
        expect(format.fontname).toEqual('Times New Roman');
    });
    it('Check single font name tag without specfic family', () => {
        let node: Node = document.getElementById('name31');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv);
        expect(format.fontname).toEqual('Segoe UI');
        expect(format.fontsize).toEqual(null);
    });
    it('Check single font name tag with specific incoorect family', () => {
        let node: Node = document.getElementById('name31');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], ['8pt'], ['Arial']);
        expect(format.fontname).toEqual(null);
        expect(format.fontcolor).toEqual('rgb(0, 0, 0)');
    });
    it('Check single font name tag with specfic correct family', () => {
        let node: Node = document.getElementById('name31');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], ['8pt'], ['Segoe UI']);
        expect(format.fontname).toEqual('Segoe UI');
        expect(format.fontsize).toEqual(null);
    });
    it('Check single font size tag without specfic size', () => {
        let node: Node = document.getElementById('size31');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv);
        expect(format.fontsize).toEqual('8pt');
        expect(format.fontname).toEqual('Times New Roman');
    });
    it('Check single font size tag with specific incorrect size', () => {
        let node: Node = document.getElementById('size31');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], ['10pt'], ['Arial']);
        expect(format.fontsize).toEqual(null);
        expect(format.fontcolor).toEqual('rgb(0, 0, 0)');
    });
    it('Check single font size tag with specfic coorect size', () => {
        let node: Node = document.getElementById('size31');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], ['8pt'], ['Arial']);
        expect(format.fontsize).toEqual('8pt');
        expect(format.fontname).toEqual(null);
    });
    it('Check single font color tag ', () => {
        let node: Node = document.getElementById('color31');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv);
        expect(format.fontcolor).toEqual('rgb(231, 231, 231)');
        expect(format.orderedlist).toEqual(false);
    });
    it('Check single back ground color tag ', () => {
        let node: Node = document.getElementById('back31');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv);
        expect(format.backgroundcolor).toEqual('rgb(231, 231, 231)');
        expect(format.unorderedlist).toEqual(false);
    });
    it('Check single alignment left tag ', () => {
        let node: Node = document.getElementById('left31');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv);
        expect(format.alignments).toEqual('justifyleft');
        expect(format.bold).toEqual(false);
    });
    it('Check single alignment right tag ', () => {
        let node: Node = document.getElementById('right31');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv);
        expect(format.alignments).toEqual('justifyright');
        expect(format.italic).toEqual(false);
    });
    it('Check single alignment center tag ', () => {
        let node: Node = document.getElementById('center31');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv);
        expect(format.alignments).toEqual('justifycenter');
        expect(format.strikethrough).toEqual(false);
    });
    it('Check single alignment full tag ', () => {
        let node: Node = document.getElementById('justify31');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv);
        expect(format.alignments).toEqual('justifyfull');
        expect(format.formats).toEqual(null);
    });
    it('Check orderlist tag ', () => {
        let node: Node = document.getElementById('paragraph31');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv);
        expect(format.orderedlist).toEqual(true);
        expect(format.formats).toEqual('p');
    });
    it('Check unorderlist tag ', () => {
        let node: Node = document.getElementById('paragraph32');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['div'], ['10pt'], ['Arial']);
        expect(format.unorderedlist).toEqual(true);
        expect(format.formats).toEqual('div');
    });
    it('Check multiple formatted values ', () => {
        let node: Node = document.getElementById('justify41');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv);
        expect(format.bold).toEqual(true);
        expect(format.italic).toEqual(true);
        expect(format.underline).toEqual(true);
        expect(format.strikethrough).toEqual(true);
        expect(format.superscript).toEqual(true);
        expect(format.superscript).toEqual(true);
        expect(format.orderedlist).toEqual(true);
        expect(format.fontcolor).toEqual('rgb(231, 231, 231)');
        expect(format.backgroundcolor).toEqual('rgb(231, 231, 231)');
        expect(format.fontname).toEqual('Segoe UI');
        expect(format.fontsize).toEqual('8pt');
        expect(format.alignments).toEqual('justifyfull');
        expect(format.formats).toEqual('p');
    });
    it('Check Bold tag with paragraph', () => {
        let node: Node = document.getElementById('paragraph3').childNodes[0];
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], ['8pt'], ['Segoe UI']);
        expect(format.bold).toEqual(true);
        expect(format.formats).toEqual('p');
    });
    it('Check Bold tag with paragraph', () => {
        let node: HTMLElement = document.getElementById('italic51');
        node.innerHTML = '&#65279;&#65279;';
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 1, 1);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], ['8pt'], ['Segoe UI']);
        expect(format.bold).toEqual(true);
        expect(format.italic).toEqual(true);
        expect(format.underline).toEqual(true);
    });
    it('Check em tag for outside content', () => {
        let node: HTMLElement = document.getElementById('italic52');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 1, 1);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], ['8pt'], ['Segoe UI']);
        expect(format.italic).toEqual(false);
    });
});
