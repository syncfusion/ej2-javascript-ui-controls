/**
 * Toolbar status spec document
 */
import { detach } from '@syncfusion/ej2-base';
import { NodeSelection } from '../../../src/selection/selection';
import { ToolbarStatus } from '../../../src/editor-manager/plugin/toolbar-status';
import { IToolbarStatus } from '../../../src/common/interface';

describe('Update Toolbar commands', () => {
    //HTML value
    let innervalue: string = '<div id="div1"><p id="paragraph1"><b>Description:</b></p>' +
        '<p><strong id="italic53">&ZeroWidthSpace;<em>&ZeroWidthSpace;<span style="text-decoration: underline;">&ZeroWidthSpace;</span></em></strong></p>' +
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
        detach(divElement);
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
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], ['10pt'], ['Arial']);
        expect(format.unorderedlist).toEqual(true);
        expect(format.formats).toEqual('p');
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
    it('Checking the Bold, Italic and Underline toolbar enabled when focusing in/out the editor', () => {
        let node: HTMLElement = document.getElementById('italic53');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 1, 1);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], ['8pt'], ['Segoe UI']);
        expect(format.bold).toEqual(true);
        expect(format.italic).toEqual(true);
        expect(format.underline).toEqual(true);
    });
});
describe('EJ2-61863 - Font-family value property as case-sensitive', () => {
    var innervalue = '<div id="div1"><p id="paragraph1"><b>Description:</b></p>' +'<span id="MScontent" style="font-family:Arial, sans-serif">MS-content</span>'+'</div>';
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
    it('Check Font-family value property as case-Insensitive ', () => {
        let node: Node = document.getElementById('MScontent');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], ['8pt'], ['arial,sans-serif']);
        expect(format.fontname).toEqual('arial,sans-serif');
        expect(format.fontcolor).toEqual('rgb(0, 0, 0)');
    });
});

describe('EJ2-69534 - Font-Size dynamic update using custom class name style tags status not updated properly issue ', () => {
    var innervalue = '<div id="div1" class="customClass e-content"><p id="paragraph1">Rich Text Editor Content</span>'+'</div>';
    let domSelection: NodeSelection = new NodeSelection();
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    let style = '.customClass.e-content{ font-size:24px; }';
    let styleElement: HTMLElement = document.createElement('style');
    styleElement.innerHTML = style;
    document.head.appendChild(styleElement);
    let parentDiv: HTMLDivElement;
    beforeAll(() => {
        document.body.appendChild(divElement);
        parentDiv = document.getElementById('div1') as HTMLDivElement;
    });
    afterAll(() => {
        detach(divElement);
    });
    it('Check Font-size value property ', () => {
        let node: Node = document.getElementById('paragraph1');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], null, ['arial,sans-serif']);
        expect(format.fontsize).toEqual('24px');
    });
});

describe('863471 - Font Family with dynamic font family with similar name doesnt update the correct font family in toobar ', () => {
    var innervalue = `<div id="div3"><p><span id="currentNode" style="font-family: Arial;">RTE Content with Arial only</span></p><p>RTE Content with Verdana only</p><p><span style="font-family: &quot;Arial Black&quot;;">RTE Content with Arial Black only</span></p></div>`;
    let domSelection: NodeSelection = new NodeSelection();
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    let parentDiv: HTMLDivElement;
    beforeAll(() => {
        document.body.appendChild(divElement);
        parentDiv = document.getElementById('div3') as HTMLDivElement;
    });
    afterAll(() => {
        detach(divElement);
    });
    it('Check Font-family value property ', () => {
        let node: Node = document.getElementById('currentNode');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], null, ['Verdana', 'Arial', 'Arial Black', 'Consolas']);
        expect(format.fontname).toEqual('Arial');
    });
});

describe('872419 - List status testing with sub list changed to a different list format', () => {
    var innervalue = `<div id="div3"><ol><li>dfb<ul style="list-style-image: none; list-style-type: disc;"><li id="UlInsideOlFocus">bdfb</li></ul><ol style="list-style-image: none; list-style-type: lower-greek;"><li>dbfd</li></ol></li><li>bdb</li></ol></div>`;
    let domSelection: NodeSelection = new NodeSelection();
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    let parentDiv: HTMLDivElement;
    beforeAll(() => {
        document.body.appendChild(divElement);
        parentDiv = document.getElementById('div3') as HTMLDivElement;
    });
    afterAll(() => {
        detach(divElement);
    });
    it('List status testing with sub list changed to a different list format UL inside a OL ', () => {
        let node: Node = document.getElementById('UlInsideOlFocus');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 3, 3);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['div'], ['10pt'], ['Arial']);
        expect(format.unorderedlist).toEqual(true);
        expect(format.orderedlist).toEqual(false);
        expect(format.numberFormatList).toEqual(false);
        expect(format.bulletFormatList).toEqual('Disc');
    });
});

describe('829581 -  Underline and strikethrough toolbars are not highlighted properly in RichTextEditor toolbar', () => {
    var innervalue = '<div id="div1"><p><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;" class="focusNode">Testing</span></span></em></strong></p></div>';
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
    it('Check Underline and strikethrough toolbar status when text-decoration is text-deocoration-line', () => {
        let node: Node = document.querySelector('.focusNode');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 5, 5);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], ['8pt'], ['arial,sans-serif']);
        expect(format.underline).toEqual(true);
        expect(format.strikethrough).toEqual(true);
    });
});

describe('861659 - Format toolbar name is blank in overview/Online HTML editor tab Case 1', () => {
    let innervalue = '<p>The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to cre<img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline" alt="snow.jpg" width="auto" height="auto" style="min-width: 0px; min-height: 0px;"> ate and edit content and return the valid of the content</p>';
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
    // When the cursor is placed after the image and the getNodeCollection should return only the text node.
    it('Should not traverse over entire dom and should provide only one text node as output', () => {
        let node: Node = document.querySelector('p');
        domSelection.setSelectionText(document, node, node, 2, 2);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], ['8pt'], ['arial,sans-serif']);
        const selection: NodeSelection = new NodeSelection();
        expect(selection.getNodeCollection(window.getSelection().getRangeAt(0))[0]).toEqual(node.childNodes[2]);
        expect(format.formats).toEqual("p");
    });
    // When the cursor is placed after the image and the getNodeCollection should return only the text node.
    it('Case 2 Should not traverse over entire dom and should provide only one text node as output', () => {
        innervalue = '<p><img alt="Logo" src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline" style="border: 0px; vertical-align: bottom; cursor: pointer; display: inline-block; float: none; margin: auto; position: relative; padding: 1px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); width: 300px;"> <br></p>';
        divElement.innerHTML = innervalue;
        let node: Node = document.querySelector('p');
        domSelection.setSelectionText(document, node, node, 1, 1);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], ['8pt'], ['arial,sans-serif']);
        const selection: NodeSelection = new NodeSelection();
        expect(selection.getNodeCollection(window.getSelection().getRangeAt(0))[0]).toEqual(node.childNodes[1]);
        expect(format.formats).toEqual("p");
    });
});

describe('888232 - Blockquote toolbar icon and Format dropdown status checking', () => {
    let innervalue = '<blockquote><ol><li><h1 class="focusNode1">Welcome to the Syncfusion Rich Text Editor</h1></li><li class="focusNode2">The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</li></ol></blockquote>';
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
    it('- Blockquote toolbar icon and Format dropdown status checking', () => {
        let node: Node = document.querySelector('.focusNode1');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 2, 2);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p', 'h1', 'h2', 'h3', 'pre'], ['8pt'], ['arial,sans-serif']);
        expect(format.blockquote).toBe(true);
        expect(format.formats).toBe('h1');
    });
});

describe('924326 - Both Bullet and Number Format Toolbar Icons Highlighted After Switching List Items to None', () => {
    let innervalue = '<div id="div1"><ul style="list-style-type: none;"><li id="focusNode">Item 1</li><li>Item 2</li></ul></div>';
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

    it('Should not highlight both Bullet List and Numbered List icons when list format is None', () => {
        let node: Node = document.getElementById('focusNode');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 2, 2);
        let format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], ['8pt'], ['Arial']);

        expect(format.unorderedlist).toEqual(true);
        expect(format.orderedlist).toEqual(false);
        expect(format.bulletFormatList).toEqual('None');
        expect(format.numberFormatList).toEqual(false);
    });
});
describe('962591 - FontName and FontSize should not be detected from block element like <p> when using ToolbarStatus.get', () => {
    const domSelection: NodeSelection = new NodeSelection();
    const divElement: HTMLDivElement = document.createElement('div');
    let parentDiv: HTMLDivElement;
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    beforeAll(() => {
        document.body.appendChild(divElement);
    });
    afterAll(() => {
        detach(divElement);
    });

    it('Should return null for fontname and fontsize when inline style is on <p> tag', () => {
        divElement.innerHTML = `<div id="div1"><p id="focusNode" style="font-family: Arial; font-size: 18pt;">Syncfusion</p></div>`;
        parentDiv = document.getElementById('div1') as HTMLDivElement;
        const node = document.getElementById('focusNode');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 5);
        const format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], ['18pt'], ['Arial']);
        expect(format.fontname).toBe(null);
        expect(format.fontsize).toBe(null);
    });

    it('Should return fontname and fontsize when style is on inline <span> tag', () => {
        divElement.innerHTML = `<div id="div1"><p><span id="focusNode" style="font-family: Arial; font-size: 18pt;">Syncfusion</span></p></div>`;
        parentDiv = document.getElementById('div1') as HTMLDivElement;
        const node = document.getElementById('focusNode');
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 5);
        const format: IToolbarStatus = ToolbarStatus.get(document, parentDiv, ['p'], ['18pt'], ['Arial']);
        expect(format.fontname.toLowerCase()).toBe('arial');
        expect(format.fontsize).toBe('18pt');
    });
});