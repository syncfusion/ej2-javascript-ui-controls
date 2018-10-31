import { NodeSelection } from '../../src/selection/selection'
/**
 * Selection spec document
 */
describe('Selection', () => {
    //HTML value
    let innervalue: string = '<p id="selectionTag"><b>Description:</b></p>' +
        '<p>The <span id="spantag">Rich Text Editor (RTE)</span> control is an easy to render in' +
        'client side. Customer easy to edit the contents and get the HTML content for' +
        'the displayed content. A rich text editor control provides users with a toolbar' +
        'that helps them to apply rich text formats to the text entered in the text' +
        'area. </p>' +
        '<p><b>ABCD</b><span id="complex1">Hello World</span></p>'+
        '<p><b id="complex2">Functional' +
        'Specifications/Requirements:</b><span>EFGH</span></p>' +
        '<ol><li><p>Provide' +
        'the tool bar support, it’s also customizable.</p></li><li><p>Options' +
        'to get the HTML elements with styles.</p></li><li><p>Support' +
        'to insert image from a defined path.</p></li><li><p>Footer' +
        'elements and styles(tag / Element information , Action button (Upload, Cancel))' +
        '</p></li><li><p>Re-size' +
        'the editor support.</p></li><li><p>Provide' +
        'efficient public methods and client side events.</p></li><li><p>Keyboard' +
        'navigation support.</p></li></ol>' +
        '<p id="first-p-node">Functional Specifications/Requirements:</p>';

    //IFRAME Element
    let iframeElement: HTMLIFrameElement = document.createElement('iframe');
    iframeElement.id = 'iframe';
    let editor: Document;
    iframeElement.onload = function (args: Event): void {
        editor = iframeElement.contentDocument;
        editor.open();
        editor.write('<!DOCTYPE html> <html> <head> <meta charset="utf-8" /></head><body spellcheck="false"' +
            'autocorrect="off"></body></html>');
        editor.close();
        editor.body.contentEditable = 'true';
        editor.body.innerHTML = innervalue;
    };

    let domSelection: NodeSelection = new NodeSelection();

    //DIV Element
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;

    beforeAll(() => {
        document.body.appendChild(divElement);
        document.body.appendChild(document.createElement('br'));
        document.body.appendChild(iframeElement);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
    /**
     * DIV initialize
     */
    it('DIV Element check GetRange & setSelectionNode public method', () => {
        domSelection.Clear(document);
        let node: Node = document.getElementById('selectionTag');
        domSelection.setSelectionNode(document, node);
        let range: Range = domSelection.getRange(document);
        expect(range.commonAncestorContainer).toEqual(node);
        expect(range.startContainer).toEqual(node);
        expect(range.endContainer).toEqual(node);
    });

    it('DIV Element check GetRange & setSelectionContents  public method', () => {
        domSelection.Clear(document);
        let node: Node = document.getElementById('selectionTag');
        domSelection.setSelectionContents(document, node);
        let range: Range = domSelection.getRange(document);
        expect(range.toString()).toEqual('Description:');
    });

    it('DIV Element check removeAllSelection public method', () => {
        domSelection.Clear(document);
        let range: Range = domSelection.getRange(document);
        expect(range.commonAncestorContainer).toEqual(document.body);
    });

    it('DIV Element check getSelection public method', () => {
        let node: Node = document.getElementById('selectionTag');
        domSelection.setSelectionNode(document, node);
        let selection: Selection = domSelection.get(document);
        expect(selection.focusNode).toEqual(node);
        domSelection.Clear(document);
    });

    it('DIV Element check saveSelection public method', () => {
        let node: Node = document.getElementById('selectionTag');
        domSelection.setSelectionNode(document, node);
        let range: Range = domSelection.getRange(document);
        let selectionObj: NodeSelection = domSelection.save(range,document);
        let childNodes: HTMLSpanElement = document.createElement('span');
        childNodes.innerHTML = 'Span Element';
        node.appendChild(childNodes);
        selectionObj.restore();
        range = domSelection.getRange(document);
        expect(range.commonAncestorContainer).toEqual(node);
        expect(range.startContainer).toEqual(node);
        expect(range.endContainer).toEqual(node);
        domSelection.Clear(document);
    });

    it('DIV Element check getParentNodeCollection public method', () => {
        let node: Node = document.getElementById('selectionTag');
        domSelection.setSelectionContents(document, node);
        let parentNodes: Node[] = domSelection.getParentNodeCollection(domSelection.getRange(document));
        expect(parentNodes[0]).toEqual(node);
        expect(parentNodes.length).toEqual(1);
        domSelection.Clear(document);
    });

    it('DIV Element check setSelectionText public method', () => {
        let node: Node = document.getElementById('selectionTag').childNodes[0];
        domSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 1,3);
        let parentNodes: Node[] = domSelection.getParentNodeCollection(domSelection.getRange(document));
        expect(parentNodes[0]).toEqual(node);
        domSelection.Clear(document);
    });

    it('DIV Element check getSelectionNodeCollection  public method', () => {
        let node: Node = document.getElementById('selectionTag');
        domSelection.setSelectionNode(document, node);
        let selectNodes: Node[] = domSelection.getSelectionNodeCollection(domSelection.getRange(document));
        expect(selectNodes[0].nodeType).toEqual(3);
        domSelection.Clear(document);
    });

    it('DIV Element check getSelectedNodes  public method', () => {
        let node: Node = document.getElementById('selectionTag');
        domSelection.setSelectionNode(document, node);
        let selectNodes: Node[] = domSelection.getSelectedNodes(document);
        expect(selectNodes.length).toEqual(4);
        domSelection.Clear(document);
    });

    it('DIV Element check insertParentNode  public method', () => {
        let node: Node = document.getElementById('selectionTag');
        domSelection.setSelectionNode(document, node);
        domSelection.insertParentNode(document,document.createElement('h1'),
                domSelection.getRange(document));
        expect(node.childNodes[0].nodeName.toLowerCase()).toEqual('h1');
        domSelection.Clear(document);
    });

    it('DIV Element check mulitple parent Selection', () => {
        let complex1: Node = document.getElementById('complex1');
        let complex2: Node = document.getElementById('complex2');
        domSelection.setSelectionText(document, complex1.childNodes[0], complex2.childNodes[0], 1,3);
        let parentNodes: Node[] = domSelection.getParentNodeCollection(domSelection.getRange(document));
        expect(parentNodes[0]).toEqual(complex2.parentNode);
        domSelection.Clear(document);
    });

    /**
     * IFRAME initialize
    */

    it('IFRAME Element GetRange & setSelectionNode', () => {
        domSelection.Clear(document);
        let node: Node = editor.getElementById('selectionTag');
        domSelection.setSelectionNode(editor, node);
        let range: Range = domSelection.getRange(editor);
        expect(range.commonAncestorContainer).toEqual(node);
        expect(range.startContainer).toEqual(node);
        expect(range.endContainer).toEqual(node);
    });

    it('IFRAME Element remove all selection', () => {
        domSelection.Clear(editor);
        let range: Range = domSelection.getRange(editor);
        expect(range.commonAncestorContainer).toEqual(editor.body);
    });

    it('IFRAME Element check getSelection public method', () => {
        let node: Node = editor.getElementById('selectionTag');
        domSelection.setSelectionNode(editor, node);
        let selection: Selection = domSelection.get(editor);
        expect(selection.focusNode).toEqual(node);
        domSelection.Clear(editor);
    });

    it('IFRAME Element check saveSelection public method', () => {
        let node: Node = editor.getElementById('selectionTag');
        domSelection.setSelectionNode(editor, node);
        let range: Range = domSelection.getRange(editor);
        let selectionObj: NodeSelection = domSelection.save(range,editor);
        let childNodes: HTMLSpanElement = editor.createElement('span');
        childNodes.innerHTML = 'Span Element';
        node.appendChild(childNodes);
        selectionObj.restore();
        range = domSelection.getRange(editor);
        expect(range.commonAncestorContainer).toEqual(node);
        expect(range.startContainer).toEqual(node);
        expect(range.endContainer).toEqual(node);
        domSelection.Clear(editor);
    });

    it('DIV Element get document from range', () => {
        domSelection.setSelectionText(document, document, document, 0,1);
        let inst: NodeSelection = domSelection.save(domSelection.getRange(document), document);
        expect(inst.rootNode).toEqual(document);
        domSelection.Clear(document);
    });

    it('DIV Element get document without range', () => {
        domSelection.setSelectionText(document, document, document, 0,1);
        let inst: NodeSelection = domSelection.save( null, document);
        expect(inst.rootNode).toEqual(document);
        domSelection.Clear(document);
    });

    it('DIV Element restore splitted text node', () => {
        let p: HTMLElement = document.getElementById('first-p-node');
        let textnode1: Text = p.firstChild as Text;
        textnode1.splitText(10);
        let textnode2: Text = p.childNodes[1] as Text;
        textnode2.splitText(16);
        domSelection.setSelectionText(document, p.childNodes[2], p.childNodes[2], 0, 5);
        let inst: NodeSelection = domSelection.save( domSelection.getRange(document), document);
        inst.restore();
        expect(inst.startOffset).toEqual(0);
        domSelection.Clear(document);
    });

    it('DIV Element check get node array', () => {
        let p: HTMLElement = document.getElementById('first-p-node');
        domSelection.rootNode = null;
        let inst: number[] = domSelection.getNodeArray( p, true, document );
        expect(inst.length).toEqual(4);
        domSelection.Clear(document);
    });

});