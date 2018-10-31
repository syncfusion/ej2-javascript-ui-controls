import { NodeSelection } from '../../src/selection/selection'

describe('Selection Possible Cases', () => {
    //HTML value
    let innervalue: string = '<div id="div-node-1">'+
    '<p id="p-node-1"><b id="b-node-1">Description:</b></p>'+
    '<p id="p-node-2">The Rich Text Editor (RTE) control is an easy to render in'+
    'client side. Customer easy to edit the contents and get the HTML content for'+
    'the displayed content. A rich text editor control provides users with a toolbar'+
    'that helps them to apply rich text formats to the text entered in the text'+
    'area. </p>'+
   '<p id="p-node-3"><b id="b-node-2">Functional'+
    'Specifications/Requirements:</b></p>'+
    '<ol id="ol-node-1">'+
    '<li><p id="p-node-4">Provide'+
    'the tool bar support,</p>'+
    '<span id="span-node-1"> it’s also customizable.</span>'+
    '</li>'+
    '<li><p id="p-node-5">Options'+
    'to get</p>'+
    '<span id="span-node-2"> the HTML elements with styles.</span>'+
    '</li>'+
    '<li><p id="p-node-6">Support'+
    'to insert image</p>'+
    '<span id="span-node-3"> from a defined path.</span>'+
    '</li>'+
    '<li><p id="p-node-7">Footer'+
    'elements and styles(tag / Element information ,</p>'+
    '<span id="span-node-4"> Action button (Upload, Cancel))</span>'+
    '</li>'+
    '<li><p id="p-node-8">Re-size</p>'+
    '<span id="span-node-5"> the editor support.</span>'+
    '</li>'+
    '<li><p id="p-node-9">Provide </p>'+
    '<span id="span-node-6">efficient public methods and client side events.</span>'+
    '</li>'+
    '<li><p id="p-node-10">Keyboard </p>'+
    '<span id="span-node-7">navigation support.</span>'+
    '</li>'+
    '</ol>'+
    '<img id="img-node-1" alt="Smiley face" height="42" width="42">'+
    '</div>'+


    '<div id="div-node-2">'+
    '<ul id="ul-node-1">'+
    '<li><p id="p-node-11">Provide'+
    'the tool bar support,</p>'+
    '<span id="span-node-8"> it’s also customizable.</span>'+
    '</li>'+
    '<li><p id="p-node-12">Options'+
    'to get</p>'+
    '<span id="span-node-9"> the HTML elements with styles.</span>'+
    '</li>'+
    '<li><p id="p-node-13">Support'+
    'to insert image</p>'+
    '<span id="span-node-10"> from a defined path.</span>'+
    '</li>'+
    '<li><p id="p-node-14">Footer'+
    'elements and styles(tag / Element information ,</p>'+
    '<span id="span-node-11"> Action button (Upload, Cancel))</span>'+
    '</li>'+
    '<li><p id="p-node-15">Re-size</p>'+
    '<span id="span-node-12"> the editor support.</span>'+
    '</li>'+
    '<li><p id="p-node-16">Provide </p>'+
    '<span id="span-node-13">efficient public methods and client side events.</span>'+
    '</li>'+
    '<li><p id="p-node-17">Keyboard </p>'+
    '<span id="span-node-14">navigation support.</span>'+
    '</li>'+
    '</ul>'+
    '</div>';

    let domSelection: NodeSelection = new NodeSelection();

    //DIV Element
    let divElement: HTMLDivElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    beforeAll(() => {
        document.body.contentEditable = 'true';
        document.body.appendChild(divElement);
    });

    afterAll(() => {
        document.body.contentEditable = 'false';
        document.body.innerHTML = '';
    });

    describe('setSelectionText', () => {
    // setSelectionText
        it('Check setSelectionText - Exisitng selection remove', () => {
            domSelection.Clear(document);
            let node1: Node = document.getElementById('b-node-1').childNodes[0];
            domSelection.setSelectionText(document, node1, node1, 0, node1.nodeValue.length);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(node1);
            expect(selection.focusNode).toEqual(node1);
            expect(selection.anchorOffset).toEqual(0);
            expect(selection.focusOffset).toEqual(node1.nodeValue.length);
            let node2: Node = document.getElementById('img-node-1');
            domSelection.setSelectionText(document, node2, node2, 0, node2.childNodes.length);
            selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(node2);
            expect(selection.focusNode).toEqual(node2);
            expect(selection.anchorOffset).toEqual(0);
            expect(selection.focusOffset).toEqual(node2.childNodes.length);
            domSelection.Clear(document);
        });

        it('Check setSelectionText - Select - All No leaf node - image tag', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('img-node-1');
            domSelection.setSelectionText(document, node, node, 0, node.childNodes.length);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(node);
            expect(range.startContainer).toEqual(node);
            expect(range.endContainer).toEqual(node);
            expect(range.startOffset).toEqual(0);
            expect(range.endOffset).toEqual(node.childNodes.length);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(node);
            expect(selection.focusNode).toEqual(node);
            expect(selection.anchorOffset).toEqual(0);
            expect(selection.focusOffset).toEqual(node.childNodes.length);
            domSelection.Clear(document);
        });

        it('Check setSelectionText - Select  - All leaf node - OL tag', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('ol-node-1');
            domSelection.setSelectionText(document, node, node, 0, node.childNodes.length);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(node);
            expect(range.startContainer).toEqual(node);
            expect(range.endContainer).toEqual(node);
            expect(range.startOffset).toEqual(0);
            expect(range.endOffset).toEqual(node.childNodes.length);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(node);
            expect(selection.focusNode).toEqual(node);
            expect(selection.anchorOffset).toEqual(0);
            expect(selection.focusOffset).toEqual(node.childNodes.length);
            domSelection.Clear(document);
        });

        it('Check setSelectionText - Select - All text node content', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('p-node-2').childNodes[0];
            domSelection.setSelectionText(document, node, node, 0, node.nodeValue.length);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(node);
            expect(range.startContainer).toEqual(node);
            expect(range.endContainer).toEqual(node);
            expect(range.startOffset).toEqual(0);
            expect(range.endOffset).toEqual(node.nodeValue.length);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(node);
            expect(selection.focusNode).toEqual(node);
            expect(selection.anchorOffset).toEqual(0);
            expect(selection.focusOffset).toEqual(node.nodeValue.length);
            domSelection.Clear(document);
        });

        it('Check setSelectionText - Select  - Specific leaf node - OL tag', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('ol-node-1');
            domSelection.setSelectionText(document, node, node, 0, node.childNodes.length - 2);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(node);
            expect(range.startContainer).toEqual(node);
            expect(range.endContainer).toEqual(node);
            expect(range.startOffset).toEqual(0);
            expect(range.endOffset).toEqual(node.childNodes.length - 2);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(node);
            expect(selection.focusNode).toEqual(node);
            expect(selection.anchorOffset).toEqual(0);
            expect(selection.focusOffset).toEqual(node.childNodes.length - 2 );
            domSelection.Clear(document);
        });

        it('Check setSelectionText - Select - Specific text node content', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('p-node-2').childNodes[0];
            domSelection.setSelectionText(document, node, node, 0, node.nodeValue.length - 10);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(node);
            expect(range.startContainer).toEqual(node);
            expect(range.endContainer).toEqual(node);
            expect(range.startOffset).toEqual(0);
            expect(range.endOffset).toEqual(node.nodeValue.length - 10);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(node);
            expect(selection.focusNode).toEqual(node);
            expect(selection.anchorOffset).toEqual(0);
            expect(selection.focusOffset).toEqual(node.nodeValue.length - 10);
            domSelection.Clear(document);
        });

        it('Check setSelectionText - Select  - Mixed different node textcontent 1', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('ol-node-1');
            domSelection.setSelectionText(document, node.childNodes[3], node.childNodes[5], 0, node.childNodes[5].childNodes.length);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(node);
            expect(range.startContainer).toEqual(node.childNodes[3]);
            expect(range.endContainer).toEqual(node.childNodes[5]);
            expect(range.startOffset).toEqual(0);
            expect(range.endOffset).toEqual(node.childNodes[5].childNodes.length);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(node.childNodes[3]);
            expect(selection.focusNode).toEqual(node.childNodes[5]);
            expect(selection.anchorOffset).toEqual(0);
            expect(selection.focusOffset).toEqual(node.childNodes[5].childNodes.length);
            domSelection.Clear(document);
        });

        it('Check setSelectionText - Select  - Mixed different node textcontent 2', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('ol-node-1');
            domSelection.setSelectionText(document, node.childNodes[3], node.childNodes[5], 1, node.childNodes[5].childNodes.length -1);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(node);
            expect(range.startContainer).toEqual(node.childNodes[3]);
            expect(range.endContainer).toEqual(node.childNodes[5]);
            expect(range.startOffset).toEqual(1);
            expect(range.endOffset).toEqual(node.childNodes[5].childNodes.length - 1);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(node.childNodes[3]);
            expect(selection.focusNode).toEqual(node.childNodes[5]);
            expect(selection.anchorOffset).toEqual(1);
            expect(selection.focusOffset).toEqual(node.childNodes[5].childNodes.length - 1);
            domSelection.Clear(document);
        });

        it('Check setSelectionText - Select  - Mixed different node textcontent 3', () => {
            domSelection.Clear(document);
            let olNode: Node = document.getElementById('ol-node-1');
            let imgNode: Node = document.getElementById('img-node-1');
            domSelection.setSelectionText(document, olNode.childNodes[3], imgNode, 1, imgNode.childNodes.length);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(olNode.parentNode);
            expect(range.startContainer).toEqual(olNode.childNodes[3]);
            expect(range.endContainer).toEqual(imgNode);
            expect(range.startOffset).toEqual(1);
            expect(range.endOffset).toEqual(imgNode.childNodes.length);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(olNode.childNodes[3]);
            expect(selection.focusNode).toEqual(imgNode);
            expect(selection.anchorOffset).toEqual(1);
            expect(selection.focusOffset).toEqual(imgNode.childNodes.length);
            domSelection.Clear(document);
        });

        it('Check setSelectionText - Select  - Mixed different node textcontent 4', () => {
            domSelection.Clear(document);
            let olNode: Node = document.getElementById('ol-node-1');
            let textNode: Node = olNode.childNodes[3].childNodes[0].childNodes[0];
            let bNode: Node = document.getElementById('b-node-1');
            domSelection.setSelectionText(document, bNode.childNodes[0], textNode, 3,
                4);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(olNode.parentNode);
            expect(range.startContainer).toEqual(bNode.childNodes[0]);
            expect(range.endContainer).toEqual(textNode);
            expect(range.startOffset).toEqual(3);
            expect(range.endOffset).toEqual(4);
            let selection: Selection = domSelection.get(document);
            expect(selection.focusNode).toEqual(textNode);
            expect(selection.anchorNode).toEqual(bNode.childNodes[0]);
            expect(selection.focusOffset).toEqual(4);
            expect(selection.anchorOffset).toEqual(3);
            domSelection.Clear(document);
        });

        it('Check setSelectionText - Select  - Mixed different node textcontent 5', () => {
            domSelection.Clear(document);
            let olNode: Node = document.getElementById('ol-node-1');
            let textNode1: Node = olNode.childNodes[3].childNodes[0].childNodes[0];
            let ulNode: Node = document.getElementById('ul-node-1');
            let textNode2: Node = ulNode.childNodes[3].childNodes[0].childNodes[0];
            domSelection.setSelectionText(document, textNode1, textNode2, 3,
                4);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(olNode.parentNode.parentNode);
            expect(range.startContainer).toEqual(textNode1);
            expect(range.endContainer).toEqual(textNode2);
            expect(range.startOffset).toEqual(3);
            expect(range.endOffset).toEqual(4);
            let selection: Selection = domSelection.get(document);
            expect(selection.focusNode).toEqual(textNode2);
            expect(selection.anchorNode).toEqual(textNode1);
            expect(selection.focusOffset).toEqual(4);
            expect(selection.anchorOffset).toEqual(3);
            domSelection.Clear(document);
        });

        it('Check setSelectionText - Select - Specific text node content', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('p-node-2').childNodes[0];
            domSelection.setSelectionText(document, node, node, 0, node.nodeValue.length - 10);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(node);
            expect(range.startContainer).toEqual(node);
            expect(range.endContainer).toEqual(node);
            expect(range.startOffset).toEqual(0);
            expect(range.endOffset).toEqual(node.nodeValue.length - 10);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(node);
            expect(selection.focusNode).toEqual(node);
            expect(selection.anchorOffset).toEqual(0);
            expect(selection.focusOffset).toEqual(node.nodeValue.length - 10);
            domSelection.Clear(document);
        });

        // cursor

        it('Check setSelectionText - Cursor Position with middle position', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('p-node-2').childNodes[0];
            domSelection.setSelectionText(document, node, node, 1, 1);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(node);
            expect(range.startContainer).toEqual(node);
            expect(range.endContainer).toEqual(node);
            expect(range.startOffset).toEqual(1);
            expect(range.endOffset).toEqual(1);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(node);
            expect(selection.focusNode).toEqual(node);
            expect(selection.anchorOffset).toEqual(1);
            expect(selection.focusOffset).toEqual(1);
            domSelection.Clear(document);
        });

        it('Check setSelectionText - Cursor Position with start position', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('p-node-2').childNodes[0];
            domSelection.setSelectionText(document, node, node, 0, 0);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(node);
            expect(range.startContainer).toEqual(node);
            expect(range.endContainer).toEqual(node);
            expect(range.startOffset).toEqual(0);
            expect(range.endOffset).toEqual(0);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(node);
            expect(selection.focusNode).toEqual(node);
            expect(selection.anchorOffset).toEqual(0);
            expect(selection.focusOffset).toEqual(0);
            domSelection.Clear(document);
        });

        it('Check setSelectionText - Cursor Position with end position', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('p-node-2').childNodes[0];
            domSelection.setSelectionText(document, node, node, node.nodeValue.length, node.nodeValue.length);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(node);
            expect(range.startContainer).toEqual(node);
            expect(range.endContainer).toEqual(node);
            expect(range.startOffset).toEqual(node.nodeValue.length);
            expect(range.endOffset).toEqual(node.nodeValue.length);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(node);
            expect(selection.focusNode).toEqual(node);
            expect(selection.anchorOffset).toEqual(node.nodeValue.length);
            expect(selection.focusOffset).toEqual(node.nodeValue.length);
            domSelection.Clear(document);
        });
    });

    // getRange public method
    describe('getRange', () => {
        it('Check getRange - Cursor Position', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('p-node-2').childNodes[0];
            domSelection.setSelectionText(document, node, node, node.nodeValue.length, node.nodeValue.length);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(node);
            expect(range.startContainer).toEqual(node);
            expect(range.endContainer).toEqual(node);
            expect(range.startOffset).toEqual(node.nodeValue.length);
            expect(range.endOffset).toEqual(node.nodeValue.length);
            domSelection.Clear(document);
        });

        it('Check getRange - Selected text content', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('p-node-2').childNodes[0];
            domSelection.setSelectionText(document, node, node, 0, node.nodeValue.length - 10);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(node);
            expect(range.startContainer).toEqual(node);
            expect(range.endContainer).toEqual(node);
            expect(range.startOffset).toEqual(0);
            expect(range.endOffset).toEqual(node.nodeValue.length - 10);
            domSelection.Clear(document);
        });

        it('Check getRange - no selection', () => {
            domSelection.Clear(document);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(document.body);
            expect(range.startContainer).toEqual(document.body);
            expect(range.endContainer).toEqual(document.body);
            expect(range.startOffset).toEqual(0);
            expect(range.endOffset).toEqual(0);
            domSelection.Clear(document);
        });

        it('Check getRange - document selection', () => {
            domSelection.Clear(document);
            domSelection.setSelectionText(document, document, document, 0, 0);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(document.body);
            expect(range.startContainer).toEqual(document.body);
            expect(range.endContainer).toEqual(document.body);
            expect(range.startOffset).toEqual(0);
            expect(range.endOffset).toEqual(0);
            domSelection.Clear(document);
        });

        it('Check getRange - body selection', () => {
            domSelection.Clear(document);
            domSelection.setSelectionText(document, document.body, document.body, 0, document.body.childNodes.length);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(document.body);
            expect(range.startContainer).toEqual(document.body);
            expect(range.endContainer).toEqual(document.body);
            expect(range.startOffset).toEqual(0);
            expect(range.endOffset).toEqual(document.body.childNodes.length);
            domSelection.Clear(document);
        });
    });
    // clear public method
    describe('clear', () => {
        it('Check clear - Cursor Position', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('p-node-2').childNodes[0];
            domSelection.setSelectionText(document, node, node, node.nodeValue.length, node.nodeValue.length);
            domSelection.Clear(document);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(document.body);
            expect(range.startContainer).toEqual(document.body);
            expect(range.endContainer).toEqual(document.body);
            expect(range.startOffset).toEqual(0);
            expect(range.endOffset).toEqual(0);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(null);
            expect(selection.focusNode).toEqual(null);
            expect(selection.anchorOffset).toEqual(0);
            expect(selection.focusOffset).toEqual(0);
            domSelection.Clear(document);
        });

        it('Check clear - Selected text content', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('p-node-2').childNodes[0];
            domSelection.setSelectionText(document, node, node, 0, node.nodeValue.length - 10);
            domSelection.Clear(document);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(document.body);
            expect(range.startContainer).toEqual(document.body);
            expect(range.endContainer).toEqual(document.body);
            expect(range.startOffset).toEqual(0);
            expect(range.endOffset).toEqual(0);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(null);
            expect(selection.focusNode).toEqual(null);
            expect(selection.anchorOffset).toEqual(0);
            expect(selection.focusOffset).toEqual(0);
            domSelection.Clear(document);
        });

        it('Check clear - no selection', () => {
            domSelection.Clear(document);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(document.body);
            expect(range.startContainer).toEqual(document.body);
            expect(range.endContainer).toEqual(document.body);
            expect(range.startOffset).toEqual(0);
            expect(range.endOffset).toEqual(0);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(null);
            expect(selection.focusNode).toEqual(null);
            expect(selection.anchorOffset).toEqual(0);
            expect(selection.focusOffset).toEqual(0);
            domSelection.Clear(document);
        });

        it('Check clear - document selection', () => {
            domSelection.Clear(document);
            domSelection.setSelectionText(document, document, document, 0, 0);
            domSelection.Clear(document);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(document.body);
            expect(range.startContainer).toEqual(document.body);
            expect(range.endContainer).toEqual(document.body);
            expect(range.startOffset).toEqual(0);
            expect(range.endOffset).toEqual(0);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(null);
            expect(selection.focusNode).toEqual(null);
            expect(selection.anchorOffset).toEqual(0);
            expect(selection.focusOffset).toEqual(0);
            domSelection.Clear(document);
        });

        it('Check clear - body selection', () => {
            domSelection.Clear(document);
            domSelection.setSelectionText(document, document.body, document.body, 0, document.body.childNodes.length);
            domSelection.Clear(document);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(document.body);
            expect(range.startContainer).toEqual(document.body);
            expect(range.endContainer).toEqual(document.body);
            expect(range.startOffset).toEqual(0);
            expect(range.endOffset).toEqual(0);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(null);
            expect(selection.focusNode).toEqual(null);
            expect(selection.anchorOffset).toEqual(0);
            expect(selection.focusOffset).toEqual(0);
            domSelection.Clear(document);
        });

        it('Check clear - Select  - Mixed different node textcontent 5', () => {
            domSelection.Clear(document);
            let olNode: Node = document.getElementById('ol-node-1');
            let textNode1: Node = olNode.childNodes[3].childNodes[0].childNodes[0];
            let ulNode: Node = document.getElementById('ul-node-1');
            let textNode2: Node = ulNode.childNodes[3].childNodes[0].childNodes[0];
            domSelection.setSelectionText(document, textNode1, textNode2, 3,
                4);
            domSelection.Clear(document);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(document.body);
            expect(range.startContainer).toEqual(document.body);
            expect(range.endContainer).toEqual(document.body);
            expect(range.startOffset).toEqual(0);
            expect(range.endOffset).toEqual(0);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(null);
            expect(selection.focusNode).toEqual(null);
            expect(selection.anchorOffset).toEqual(0);
            expect(selection.focusOffset).toEqual(0);
            domSelection.Clear(document);
        });
    });
    // getIndex public method
    describe('getIndex', () => {
        it('Check getIndex - First Child', () => {
            expect(domSelection.getIndex(document.getElementById('ol-node-1').childNodes[0])).toEqual(0);
        });

        it('Check getIndex - Last Child', () => {
            let node: Node = document.getElementById('ol-node-1');
            expect(domSelection.getIndex(node.childNodes[node.childNodes.length - 1])).toEqual(node.childNodes.length - 1);
        });

        it('Check getIndex - Middle Child', () => {
            expect(domSelection.getIndex(document.getElementById('ol-node-1').childNodes[3])).toEqual(3);
        });

        it('Check getIndex - Body Element', () => {
            expect(domSelection.getIndex(document.body)).toEqual(2);
        });

        it('Check getIndex - Document Element', () => {
            expect(domSelection.getIndex(document)).toEqual(0);
        });
    });
    // setSelectionContents public method
    describe('setSelectionContents', () => {
        it('Check setSelectionContents - Select  - OL Element', () => {
            domSelection.Clear(document);
            let olNode: Node = document.getElementById('ol-node-1');
            domSelection.setSelectionContents(document, olNode);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(olNode.parentNode);
            expect(range.startContainer).toEqual(olNode.parentNode);
            expect(range.endContainer).toEqual(olNode.parentNode);
            expect(range.startOffset).toEqual(domSelection.getIndex(olNode));
            expect(range.endOffset).toEqual(domSelection.getIndex(olNode) + 1);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(olNode.parentNode);
            expect(selection.focusNode).toEqual(olNode.parentNode);
            expect(selection.anchorOffset).toEqual(domSelection.getIndex(olNode));
            expect(selection.focusOffset).toEqual(domSelection.getIndex(olNode) + 1);
            domSelection.Clear(document);
        });

        it('Check setSelectionContents - Select  - LI Element', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('ol-node-1').childNodes[1];
            domSelection.setSelectionContents(document, node);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(node.parentNode);
            expect(range.startContainer).toEqual(node.parentNode);
            expect(range.endContainer).toEqual(node.parentNode);
            expect(range.startOffset).toEqual(domSelection.getIndex(node));
            expect(range.endOffset).toEqual(domSelection.getIndex(node) + 1);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(node.parentNode);
            expect(selection.focusNode).toEqual(node.parentNode);
            expect(selection.anchorOffset).toEqual(domSelection.getIndex(node));
            expect(selection.focusOffset).toEqual(domSelection.getIndex(node) + 1);
            domSelection.Clear(document);
        });

        it('Check setSelectionContents - Select  - Span Element', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('span-node-1');
            domSelection.setSelectionContents(document, node);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(node.parentNode);
            expect(range.startContainer).toEqual(node.parentNode);
            expect(range.endContainer).toEqual(node.parentNode);
            expect(range.startOffset).toEqual(domSelection.getIndex(node));
            expect(range.endOffset).toEqual(domSelection.getIndex(node) + 1);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(node.parentNode);
            expect(selection.focusNode).toEqual(node.parentNode);
            expect(selection.anchorOffset).toEqual(domSelection.getIndex(node));
            expect(selection.focusOffset).toEqual(domSelection.getIndex(node) + 1);
            domSelection.Clear(document);
        });

        it('Check setSelectionContents - Select  - P Element', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('p-node-1');
            domSelection.setSelectionContents(document, node);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(node.parentNode);
            expect(range.startContainer).toEqual(node.parentNode);
            expect(range.endContainer).toEqual(node.parentNode);
            expect(range.startOffset).toEqual(domSelection.getIndex(node));
            expect(range.endOffset).toEqual(domSelection.getIndex(node) + 1);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(node.parentNode);
            expect(selection.focusNode).toEqual(node.parentNode);
            expect(selection.anchorOffset).toEqual(domSelection.getIndex(node));
            expect(selection.focusOffset).toEqual(domSelection.getIndex(node) + 1);
            domSelection.Clear(document);
        });

        it('Check setSelectionContents - Select  - Image Element', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('img-node-1');
            domSelection.setSelectionContents(document, node);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(node.parentNode);
            expect(range.startContainer).toEqual(node.parentNode);
            expect(range.endContainer).toEqual(node.parentNode);
            expect(range.startOffset).toEqual(domSelection.getIndex(node));
            expect(range.endOffset).toEqual(domSelection.getIndex(node) + 1);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(node.parentNode);
            expect(selection.focusNode).toEqual(node.parentNode);
            expect(selection.anchorOffset).toEqual(domSelection.getIndex(node));
            expect(selection.focusOffset).toEqual(domSelection.getIndex(node) + 1);
            domSelection.Clear(document);
        });

        it('Check setSelectionContents - Select  - Body Element', () => {
            domSelection.Clear(document);
            let node: Node = document.body;
            domSelection.setSelectionContents(document, node);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(node.parentNode);
            expect(range.startContainer).toEqual(node.parentNode);
            expect(range.endContainer).toEqual(node.parentNode);
            expect(range.startOffset).toEqual(domSelection.getIndex(node));
            expect(range.endOffset).toEqual(domSelection.getIndex(node) + 1);
            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(node.parentNode);
            expect(selection.focusNode).toEqual(node.parentNode);
            expect(selection.anchorOffset).toEqual(domSelection.getIndex(node));
            expect(selection.focusOffset).toEqual(domSelection.getIndex(node) + 1);
            domSelection.Clear(document);
        });

        it('Check setSelectionContents - Select  - Text Node', () => {
            domSelection.Clear(document);
            let node: Node = document.getElementById('span-node-1');
            domSelection.setSelectionContents(document, node.childNodes[0]);
            let range: Range = domSelection.getRange(document);
            expect(range.commonAncestorContainer).toEqual(node);
            expect(range.startContainer).toEqual(node);
            expect(range.endContainer).toEqual(node);
            expect(range.startOffset).toEqual(domSelection.getIndex(node.childNodes[0]));
            expect(range.endOffset).toEqual(domSelection.getIndex(node.childNodes[0]) + 1);

            let selection: Selection = domSelection.get(document);
            expect(selection.anchorNode).toEqual(node);
            expect(selection.focusNode).toEqual(node);
            expect(selection.anchorOffset).toEqual(domSelection.getIndex(node.childNodes[0]));
            expect(selection.focusOffset).toEqual(domSelection.getIndex(node.childNodes[0]) + 1);
            domSelection.Clear(document);
        });
    });

 });
