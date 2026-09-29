/**
 * Insert HTML spec document - Reorganized
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { InsertHtml } from '../../../src/editor-manager/plugin/inserthtml';
import { NodeCutter } from '../../../src/editor-manager/plugin/nodecutter';
import { NodeSelection } from '../../../src/selection/index';
import { EditorManager } from '../../../src/editor-manager/index';
import { destroy, renderRTE } from '../../rich-text-editor/render.spec';
import { RichTextEditor } from '../../../src/rich-text-editor/base/rich-text-editor';

describe('InsertHtml Plugin', () => {

  // ============================================
  // Basic HTML Insertion Tests
  // ============================================
  describe('Basic HTML Insertion', () => {
    let innervalue: string = '<p>Values</p><p>Testing 1</p><p>Testing 2</p>';
    let range: Range;
    let divElement: HTMLElement = document.createElement('div');
    divElement.id = 'divElement';
    divElement.contentEditable = 'true';
    divElement.innerHTML = innervalue;
    let domSelection: NodeSelection = new NodeSelection();
    
    beforeAll(function () {
      document.body.appendChild(divElement);
    });
    
    afterAll(function () {
      detach(divElement);
    });
    
    it('Pasting html string content', function () {
      range = document.createRange();
      range.setStart(divElement.childNodes[0].firstChild, 0);
      range.setEnd(divElement.childNodes[2].firstChild, 0);
      domSelection.setSelectionText(document, divElement.childNodes[0].firstChild, divElement.childNodes[2], 0, 0);
      (InsertHtml as any).Insert(document, innervalue, divElement ,true);
      expect((divElement as any).childElementCount).toBe(4);
      (InsertHtml as any).isMediaElement(null);
    });
  });

  // ============================================
  // Span Element Insertion Tests
  // ============================================
  describe('Span Element Insertion', () => {
    let innervalue: string = '<div id="parentDiv"><p id="paragraph1"><b>Description:</b><span id="span1">Span1 Element</span>'+
    '<span id="span2">Span2<b>Element</b>tag</span>'+
    '<span id="span3">Span3<b>Element</b>tag</span></p>' +
        '<p id="paragraph2">The Rich Text Editor (RTE) control is an easy to render in' +
        'client side. Customer easy to edit the contents and get the HTML content for' +
        'the displayed content. A rich text editor control provides users with a toolbar' +
        'that helps them to apply rich text formats to the text entered in the text' +
        'area. </p>' +
        '<p id="imgParagraph"><img style="width: 177px; height: 177px;" src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png"></p>' +
        '<p id="paragraph3">Functional' +
        'Specifications/Requirements:</p>' +
        '<ol>'+
        '<li><p id="paragraph4">Provide the tool bar support, it\'s also customizable.</p></li>'+
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
        '<span id="cursor2">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="unstyle1">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="inner1">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="inner2">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="inner3">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="inner4">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '</div>';

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

    it('Insert HTML in cursor position', () => {
      let node1: Node = document.getElementById('inner1');
      let text1: Node = node1.childNodes[0];
      domSelection.setSelectionText(document, text1, text1, 5, 5);
      let node: Node = document.createElement('span');
      node.textContent = 'Span Node';
      new InsertHtml();
      InsertHtml.Insert(document, node, divElement);
      expect(domSelection.getParentNodeCollection(domSelection.getRange(document))[0]).toEqual(node);
    });

    it('Insert HTML in cursor position with Text', () => {
      let node1: Node = document.getElementById('inner1');
      let text1: Node = node1.childNodes[0];
      domSelection.setSelectionText(document, text1, text1, 4, 4);
      let node: Node = document.createTextNode('Text Content');
      InsertHtml.Insert(document, node, divElement);
      expect(domSelection.getParentNodeCollection(domSelection.getRange(document))[0]).toEqual(node1);
    });

    it('Insert HTML in specific selection', () => {
      let node1: Node = document.getElementById('inner2');
      let text1: Node = node1.childNodes[0];
      domSelection.setSelectionText(document, text1, text1, 2, 5);
      let node: Node = document.createElement('span');
      node.textContent = 'Span Node';
      InsertHtml.Insert(document, node, divElement);
      expect(domSelection.getParentNodeCollection(domSelection.getRange(document))[0]).toEqual(node);
    });

    it('Insert HTML in specific selection', () => {
      let node1: Node = document.getElementById('inner2');
      let text1: Node = node1.childNodes[0];
      domSelection.setSelectionText(document, text1, text1, 0, 1);
      let node: Node = document.createTextNode('Text Content');
      InsertHtml.Insert(document, node, divElement);
      expect(domSelection.getParentNodeCollection(domSelection.getRange(document))[0]).toEqual(node1);
    });

    it('Insert HTML in whole node selection', () => {
      let node1: Node = document.getElementById('inner3');
      domSelection.setSelectionText(document, node1, node1, 0, 1);
      let node: Node = document.createElement('span');
      node.textContent = 'Span Node';
      InsertHtml.Insert(document, node, divElement);
      expect(domSelection.getParentNodeCollection(domSelection.getRange(document))[0]).toEqual(node);
    });

    it('Insert HTML in cursor position with string node', () => {
      let node1: Node = document.getElementById('cursor2');
      let text1: Node = node1.childNodes[0];
      domSelection.setSelectionText(document, text1, text1, 4, 4);
      InsertHtml.Insert(document, 'Text Content', divElement);
      expect(domSelection.getParentNodeCollection(domSelection.getRange(document))[0]).toEqual(node1);
      expect(node1.childNodes[1].textContent).toEqual('Text Content');
    });

    it('Insert HTML in specific selection with string node', () => {
      let node1: Node = document.getElementById('inner4');
      let text1: Node = node1.childNodes[0];
      domSelection.setSelectionText(document, text1, text1, 2, 5);
      InsertHtml.Insert(document, 'Text Content', divElement);
      expect(domSelection.getParentNodeCollection(domSelection.getRange(document))[0]).toEqual(node1);
      expect(node1.childNodes[1].textContent).toEqual('Text Content');
    });

    it('Copy and Paste of Mention Item Updates Inside Existing Span Tag (904084)', () => {
      let innervalue2: string = '<div id="parentDiv"><p><span id="span2">Span2tag</span></p></div>';
      divElement.innerHTML = innervalue2;
      let editNode: Element = document.getElementById('divElement');
      let selectNode: Element = document.getElementById('parentDiv');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let span: Element = document.createElement('span');
      span.innerHTML= 'testTable1';
      pasteElement.appendChild(span);
      domSelection.setSelectionNode(document, selectNode);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('divElement').innerHTML === '<div id="parentDiv"><p><span>testTable1</span></p></div>').toBe(true);
    });
  });

  // ============================================
  // Table Insertion Tests
  // ============================================
  describe('Table Insertion', () => {
    let innervalue: string = '<div id="parentDiv"><p id="paragraph1"><b>Description:</b><span id="span1">Span1 Element</span>'+
    '<span id="span2">Span2<b>Element</b>tag</span>'+
    '<span id="span3">Span3<b>Element</b>tag</span></p>' +
        '<p id="paragraph2">The Rich Text Editor (RTE) control is an easy to render in' +
        'client side. Customer easy to edit the contents and get the HTML content for' +
        'the displayed content. A rich text editor control provides users with a toolbar' +
        'that helps them to apply rich text formats to the text entered in the text' +
        'area. </p>' +
        '<p id="imgParagraph"><img style="width: 177px; height: 177px;" src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png"></p>' +
        '<p id="paragraph3">Functional' +
        'Specifications/Requirements:</p>' +
        '<ol>'+
        '<li><p id="paragraph4">Provide the tool bar support, it\'s also customizable.</p></li>'+
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
        '<span id="cursor2">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="unstyle1">the   Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="inner1">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="inner2">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="inner3">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '<span id="inner4">the Rich Text Editor (RTE) control is an easy to render in' +
        'client side.</span>'+
        '</div>';

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

    it('Insert table next to image cursor position', () => {
      let editNode: Element = document.getElementById('parentDiv');
      let node1: Element = document.getElementById('imgParagraph');
      let table: HTMLElement = document.createElement('table') as HTMLElement;
      table.id = 'testTable';
      table.style.height = '10px';
      table.style.width = '10px';
      domSelection.setCursorPoint(document, node1, 1);
      InsertHtml.Insert(document, table, editNode);
      expect(document.querySelectorAll('#parentDiv > #imgParagraph > img').length).toEqual(1);
      expect(document.querySelectorAll('#parentDiv > table').length).toEqual(1);
      expect(document.querySelector('#parentDiv > table').id).toEqual('testTable');
    });

    it('Insert table next to table cursor position', () => {
      let editNode: Element = document.getElementById('parentDiv');
      let table: Element = document.getElementById('testTable');
      let table1: Element = document.createElement('table');
      table1.id = 'testTable1';
      domSelection.setCursorPoint(document, editNode, 0);
      InsertHtml.Insert(document, table1, editNode);
      expect(document.querySelectorAll('#parentDiv > #imgParagraph > img').length).toEqual(1);
      expect(document.querySelectorAll('#parentDiv > table').length).toEqual(2);
      expect(document.querySelectorAll('#parentDiv > table')[0].id).toEqual('testTable1');
      expect(document.querySelectorAll('#parentDiv > table')[1].id).toEqual('testTable');
      expect(document.querySelectorAll('#parentDiv > #inner4').length).toEqual(1);
    });

    it('Insert table by selecting all the content', () => {
      let editNode: Element = document.getElementById('divElement');
      let editNode1: Element = document.getElementById('paragraph1');
      let editNode2: Element = document.getElementById('inner4');
      let table: Element = document.getElementById('testTable');
      let table1: Element = document.createElement('table');
      table1.id = 'testTable1';
      let startNode: Node = editNode1.childNodes[0].childNodes[0];
      let endNode: Node = editNode2.childNodes[0]; // changed
      domSelection.setSelectionText(document, startNode, endNode, 0, 65);
      InsertHtml.Insert(document, table1, editNode);
      expect(document.getElementById('divElement').children.length === 1).toBe(true);
      expect((document.getElementById('divElement').children[0].firstChild as HTMLElement).tagName === 'TABLE').toBe(true);
    });

    it('Table Insertion Occurs in Wrong Place When Cursor Is in a Span Element (917388)', function () {
      let innervalue2: string = `<div class="content-container">
              <div class="content-title">
                  <img class="content-logo" alt="PJM Logo" width="auto" height="auto" />
                  <h2 class="content-title">Help Topic Title</h2>
              </div>
              <div class="content-inner">
                  <hr />
                  <p style="text-align: left;">
                      <span class="focusElement" style="color: rgb(0, 0, 0); font-family: Helvetica, Arial, " segoe ui" , tahoma, geneva, verdana, sans-serif; font-size: 15px; font-style: normal; font-weight: 400; text-align: left; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;">Help topic text goes here.
          
                      </span>
                  </p>
              </div>
          </div>`;
      let range: Range;
      let divElement2: HTMLDivElement = document.createElement('div');
      divElement2.id = 'divElement2';
      divElement2.contentEditable = 'true';
      divElement2.innerHTML = innervalue2;
      document.body.appendChild(divElement2);
      let domSelection2: NodeSelection = new NodeSelection();
      let focusElement: any = divElement2.querySelector('.focusElement');
      range = document.createRange();
      let textLength = focusElement.textContent.length;
      range.setStart(focusElement.firstChild, textLength);
      range.setEnd(focusElement.firstChild, textLength);
      let table: Element = document.createElement('table');
      domSelection2.setSelectionText(document, focusElement.firstChild, focusElement.firstChild, textLength, textLength);
      (InsertHtml as any).Insert(document, table, divElement2, true);
      expect(divElement2.getElementsByClassName('content-inner')[0].children.length === 4).toBe(true);
      expect(divElement2.getElementsByClassName('content-inner')[0].children[2].tagName === 'TABLE').toBe(true);
      detach(divElement2);
    });

    it('Should correctly insert a nested table inside a specific list item', () => {
      let innervalue2: string = '<ul><li id="listItem">Initial content</li></ul>';
      let divElement2: HTMLDivElement = document.createElement('div');
      divElement2.id = 'divElement2';
      divElement2.contentEditable = 'true';
      divElement2.innerHTML = innervalue2;
      document.body.appendChild(divElement2);
      const listItem: Element = divElement2.querySelector('#listItem') as Element;
      let outerTable: HTMLElement = document.createElement('table');
      outerTable.innerHTML = '<tr><td id="outerCell">Outer Table Cell</td></tr>';
      listItem.appendChild(outerTable);
      let outerCell: HTMLElement = divElement2.querySelector('#outerCell') as HTMLElement;
      let nestedTable: HTMLElement = document.createElement('table');
      nestedTable.innerHTML = '<tr><td>Nested Table Cell</td></tr>';
      outerCell.appendChild(nestedTable);
      expect((listItem as HTMLElement).querySelectorAll('table').length).toBe(2);
      expect(outerCell.querySelector('table td').textContent).toBe('Nested Table Cell');
      expect(divElement2.querySelectorAll('ul > li > table').length).toBe(1);
      expect(listItem.querySelectorAll('table')[1]).not.toBeNull();
      detach(divElement2);
    });
  });

  // ============================================
  // List Order Issues
  // ============================================
  describe('List Order Issues', () => {
    let divElement: HTMLDivElement;

    beforeAll(() => {
      divElement = document.createElement('div');
      divElement.id = 'divElement';
      divElement.contentEditable = 'true';
      document.body.appendChild(divElement);
    });
    
    afterAll(() => {
      detach(divElement);
    });

    it('List order not maintained when Heading 6 is pasted (911546)', () => {
      let innervalue: string = '<ol id="parentDiv"><li style=""><h6 style="font-size: 1.142em; line-height: 1.5; margin: 10px 0px;">djslkfjsdjflk</h6></li></ol>';
      divElement.innerHTML = innervalue;
      let domSelection: NodeSelection = new NodeSelection();
      let editNode: Element = divElement;
      let selectNode: Element = document.getElementById('parentDiv');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      const liTag: HTMLElement = document.createElement('li');
      const h6Tag: HTMLElement = document.createElement('h6');
      h6Tag.style.fontSize = '1.142em';
      h6Tag.style.lineHeight = '1.5';
      h6Tag.style.margin = '10px 0';
      h6Tag.textContent = 'djslkfjsdjflk';
      liTag.appendChild(h6Tag);
      pasteElement.appendChild(liTag);
      domSelection.setSelectionNode(document, selectNode);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li><h6 style="font-size: 1.142em; line-height: 1.5; margin: 10px 0px;">djslkfjsdjflk</h6></li>').toBe(true);
    });

    it('Pasting a list inside another list is not working as expected (923287)', () => {
      let innervalue: string = '<ol><li style="">test1</li><li id="parentDiv" style="">test2</li><li style="">test3</li></ol>';
      divElement.innerHTML = innervalue;
      let domSelection: NodeSelection = new NodeSelection();
      let editNode: Element = divElement;
      let selectNode: Element = document.getElementById('parentDiv');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      pasteElement.innerHTML = '<ol id="parentDiv"><li style="">test4</li><li style="">test5</li><li style="">test6</li></ol>';
      domSelection.setSelectionText(document, selectNode.firstChild, selectNode.firstChild, 0, 0);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(divElement.innerHTML === '<ol><li style="">test1</li><li>test4</li><li>test5</li><li>test6</li><li>test2</li><li style="">test3</li></ol>').toBe(true);
    });

    it('Inserting li element at last in the existing OL (EJ2-53098)', function () {
      let innervalue: string = '<ol><li>Initial 1</li><li>Initial 2</li><li>Initial 3<br></li></ol>';
      divElement.innerHTML = innervalue;
      let rangeNodes: Node[] = [];
      let range: Range;
      let nodeCutter: NodeCutter = new NodeCutter();
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      pasteElement.style.display = 'inline';
      pasteElement.innerHTML = innervalue;
      range = document.createRange();
      range.setStart(divElement.lastElementChild.lastElementChild.firstChild, 9);
      range.setEnd(divElement.lastElementChild.lastElementChild.firstChild, 9);
      rangeNodes.push(divElement.lastElementChild.lastElementChild.firstChild);
      (InsertHtml as any).insertTempNode(range, pasteElement, rangeNodes, nodeCutter, divElement);
      expect(divElement.childNodes[0].childNodes[2].childNodes[1].childNodes[1].textContent).toBe('Initial 1');
      expect(divElement.childNodes[0].childNodes[2].childNodes[1].childNodes[2].textContent).toBe('Initial 2');
      expect(divElement.childNodes[0].childNodes[2].childNodes[1].childNodes[3].textContent).toBe('Initial 3');
    });

    it('Inserting li element at middle in the existing OL (EJ2-53098)', function () {
      let innervalue: string = '<ol><li>Initial 1</li><li>Initial 2</li><li>Initial 3<br></li></ol>';
      divElement.innerHTML = innervalue;
      let rangeNodes: Node[] = [];
      let range: Range;
      let nodeCutter: NodeCutter = new NodeCutter();
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      pasteElement.style.display = 'inline';
      pasteElement.innerHTML = innervalue;
      range = document.createRange();
      range.setStart(divElement.lastElementChild.childNodes[1].firstChild, 9);
      range.setEnd(divElement.lastElementChild.childNodes[1].firstChild, 9);
      rangeNodes.push(divElement.lastElementChild.childNodes[1].firstChild);
      (InsertHtml as any).insertTempNode(range, pasteElement, rangeNodes, nodeCutter, divElement);
      expect(divElement.childNodes[0].childNodes[1].childNodes[1].childNodes[1].textContent).toBe('Initial 1');
      expect(divElement.childNodes[0].childNodes[1].childNodes[1].childNodes[2].textContent).toBe('Initial 2');
      expect(divElement.childNodes[0].childNodes[1].childNodes[1].childNodes[3].textContent).toBe('Initial 3');
    });

    it('Inserting li element at last in the existing UL (EJ2-53098)', function () {
      let innervalue: string = '<ul><li>Initial 1</li><li>Initial 2</li><li>Initial 3<br></li></ul>';
      divElement.innerHTML = innervalue;
      let rangeNodes: Node[] = [];
      let range: Range;
      let nodeCutter: NodeCutter = new NodeCutter();
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      pasteElement.style.display = 'inline';
      pasteElement.innerHTML = innervalue;
      range = document.createRange();
      range.setStart(divElement.lastElementChild.lastElementChild.firstChild, 9);
      range.setEnd(divElement.lastElementChild.lastElementChild.firstChild, 9);
      rangeNodes.push(divElement.lastElementChild.lastElementChild.firstChild);
      (InsertHtml as any).insertTempNode(range, pasteElement, rangeNodes, nodeCutter, divElement);
      expect(divElement.childNodes[0].childNodes[2].childNodes[1].childNodes[1].textContent).toBe('Initial 1');
      expect(divElement.childNodes[0].childNodes[2].childNodes[1].childNodes[2].textContent).toBe('Initial 2');
      expect(divElement.childNodes[0].childNodes[2].childNodes[1].childNodes[3].textContent).toBe('Initial 3');
    });

    it('Inserting li element at middle in the existing UL (EJ2-53098)', function () {
      let innervalue: string = '<ul><li>Initial 1</li><li>Initial 2</li><li>Initial 3<br></li></ul>';
      divElement.innerHTML = innervalue;
      let rangeNodes: Node[] = [];
      let range: Range;
      let nodeCutter: NodeCutter = new NodeCutter();
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      pasteElement.style.display = 'inline';
      pasteElement.innerHTML = innervalue;
      range = document.createRange();
      range.setStart(divElement.lastElementChild.childNodes[1].firstChild, 9);
      range.setEnd(divElement.lastElementChild.childNodes[1].firstChild, 9);
      rangeNodes.push(divElement.lastElementChild.childNodes[1].firstChild);
      (InsertHtml as any).insertTempNode(range, pasteElement, rangeNodes, nodeCutter, divElement);
      expect(divElement.childNodes[0].childNodes[1].childNodes[1].childNodes[1].textContent).toBe('Initial 1');
      expect(divElement.childNodes[0].childNodes[1].childNodes[1].childNodes[2].textContent).toBe('Initial 2');
      expect(divElement.childNodes[0].childNodes[1].childNodes[1].childNodes[3].textContent).toBe('Initial 3');
    });
  });

  // ============================================
  // Empty Block Node Insertion
  // ============================================
  describe('Empty Block Node Insertion', () => {
    let divElement: HTMLElement;

    beforeAll(() => {
      divElement = document.createElement('div');
      divElement.id = 'divElement';
      divElement.contentEditable = 'true';
      document.body.appendChild(divElement);
    });
    
    afterAll(() => {
      detach(divElement);
    });

    it('Inserting pasted element in the empty node (EJ2-49169)', function () {
      let innervalue: string = '<p><span>Please click this link to download a calendar reminder for this date and time</span></p><p><a classname="e-rte-anchor" href="https://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics" title="https://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics" target="_blank">https://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics </a></p><p><br></p><p>This will affect both the US and DK production site.</p><p><br></p>';
      divElement.innerHTML = innervalue;
      let rangeNodes: Node[] = [];
      let range: Range;
      let nodeCutter: NodeCutter = new NodeCutter();
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      pasteElement.style.display = 'inline';
      pasteElement.innerHTML = innervalue;
      range = document.createRange();
      range.setStart(divElement.childNodes[0].childNodes[0].firstChild, 0);
      range.setEnd(divElement.childNodes[4], 0);
      rangeNodes.push(divElement.childNodes[0].childNodes[0].firstChild);
      rangeNodes.push(divElement.childNodes[1].childNodes[0].firstChild);
      rangeNodes.push(divElement.childNodes[2].firstChild);
      rangeNodes.push(divElement.childNodes[3].firstChild);
      rangeNodes.push(divElement.childNodes[4].firstChild);
      (InsertHtml as any).insertTempNode(range, pasteElement, rangeNodes, nodeCutter, divElement);
      expect((divElement as any).childNodes[4].childNodes[0].childNodes.length).toBe(5);
    });

    it('Inserting pasted element for empty blocknodes (BLAZ-13456)', function () {
      let innervalue: string = '<p>testing 1</p><p><br></p>';
      divElement.innerHTML = innervalue;
      let rangeNodes: Node[] = [];
      let range: Range;
      let nodeCutter: NodeCutter = new NodeCutter();
      let nonElement: HTMLElement = document.createElement('br');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      pasteElement.style.display = 'inline';
      pasteElement.innerHTML = innervalue;
      range = document.createRange();
      range.setStart(divElement.childNodes[0].firstChild, 0);
      range.setEnd(divElement.childNodes[1], 0);
      rangeNodes.push(divElement.childNodes[0].firstChild);
      rangeNodes.push(nonElement);
      (InsertHtml as any).insertTempNode(range, pasteElement, rangeNodes, nodeCutter, divElement);
      expect((divElement as any).childNodes[1].childNodes[0].childNodes.length).toBe(2);
    });

    it('Inserting pasted element for empty blocknodes (BLAZ-13456)', function () {
      let innervalue: string = '<p>testing 1</p><p></p>';
      divElement.innerHTML = innervalue;
      let rangeNodes: Node[] = [];
      let range: Range;
      let nodeCutter: NodeCutter = new NodeCutter();
      let nonElement: HTMLElement = document.createElement('br');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      pasteElement.style.display = 'inline';
      pasteElement.innerHTML = innervalue;
      range = document.createRange();
      range.setStart(divElement.childNodes[0].firstChild, 0);
      range.setEnd(divElement.childNodes[1], 0);
      rangeNodes.push(divElement.childNodes[0].firstChild);
      rangeNodes.push(nonElement);
      (InsertHtml as any).insertTempNode(range, pasteElement, rangeNodes, nodeCutter, divElement);
      expect((divElement as any).childNodes[1].childNodes.length).toBe(2);
    });
  });

  // ============================================
  // Nested Block Elements Insertion
  // ============================================
  describe('Nested Block Elements Insertion', () => {
    let divElement: HTMLDivElement;
    let nonElement: HTMLElement;

    beforeAll(() => {
      divElement = document.createElement('div');
      nonElement = document.createElement('div');
      divElement.id = 'divElement';
      divElement.contentEditable = 'true';
      document.body.appendChild(divElement);
      document.body.appendChild(nonElement);
    });
    
    afterAll(() => {
      detach(divElement);
      detach(nonElement);
    });

    it('Insert HTML insert content outside when P has two br tags (EJ2-55078)', function () {
      let innervalue: string = '<div style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">test auto reply<br /><p class="focusElement"><br /><br /></p></div>';
      divElement.innerHTML = innervalue;
      let range: Range;
      let domSelection: NodeSelection = new NodeSelection();
      let focusElement: any = divElement.querySelector('.focusElement');
      range = document.createRange();
      range.setStart(focusElement, 1);
      range.setEnd(focusElement, 1);
      domSelection.setSelectionText(document, focusElement, focusElement, 1, 1);
      (InsertHtml as any).Insert(document, '<p>Inserted Content</p>', divElement, true);
      expect((divElement as any).innerHTML === '<div style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">test auto reply<br><p class="focusElement"><br></p><p>Inserted Content</p></div>').toBe(true);
    });

    it('Issue when entering multiple line breaks and inserting new text removes all lines (924996)', function () {
      let innervalue: string = '<br><br><br><br><br><br><br><br><br class="focusElement">';
      divElement.innerHTML = innervalue;
      let domSelection: NodeSelection = new NodeSelection();
      let focusElement: any = divElement.querySelector('.focusElement');
      domSelection.setSelectionNode(document, focusElement);
      (InsertHtml as any).Insert(document, '<p>Inserted Content</p>', divElement, true);
      expect((divElement as any).innerHTML === '<br><br><br><br><br><br><br><br><p>Inserted Content</p>').toBe(true);
    });

    it('Inserting HTML with shift + enter action (EJ2-52641)', function () {
      let innervalue: string = '<p>Testing<br/></br/></p>';
      divElement.innerHTML = innervalue;
      let rangeNodes: Node[] = [];
      let range: Range;
      let nodeCutter: NodeCutter = new NodeCutter();
      //let nonElement: HTMLElement = document.createElement('div');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.innerHTML = "<p>NewWord</p>";
      range = document.createRange();
      range.setStart(divElement.childNodes[0], 2);
      range.setEnd(divElement.childNodes[0], 2);
      rangeNodes.push(divElement.childNodes[0].lastChild);
      rangeNodes.push(nonElement);
      (InsertHtml as any).insertTempNode(range, pasteElement, rangeNodes, nodeCutter, divElement);
      expect((divElement as any).childNodes[1].childNodes.length).toBe(1);
    });

    it('The execCommand method does not replace the text wrapped inside a span element in the editor (923872)', function () {
      let innervalue: string = `<table class="e-rte-table" style="width: 100%; min-width: 0px;">
              <tbody>
                <tr>
                  <td class="e-cell-select" style="width: 33.3333%; text-align: start;">
                    <span class="focusElement" style="color: rgb(33, 37, 41); font-family: system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, arial, &quot;Noto Sans&quot;, &quot;Liberation Sans&quot;, sans-serif, &quot;apple color emoji&quot;, &quot;Segoe UI emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto color emoji&quot;; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;">The Rich Text Editor, a WYSIWYG (what you see is what you get)
                        editor, is a user interface that allows you to create, edit, and
                        format rich text content.<span>&nbsp;</span></span>
                  </td>
                  <td style="width: 33.3333%;"><br></td>
                  <td style="width: 33.3333%;"><br></td>
                </tr>
                <tr>
                  <td style="width: 33.3333%;"><br></td>
                  <td style="width: 33.3333%;"><br></td>
                  <td style="width: 33.3333%;"><br></td>
                </tr>
                <tr>
                  <td style="width: 33.3333%;"><br></td>
                  <td style="width: 33.3333%;"><br></td>
                  <td style="width: 33.3333%;"><br></td>
                </tr>
              </tbody>
          </table><p><br></p>`;
      divElement.innerHTML = innervalue;
      let range: Range;
      let domSelection: NodeSelection = new NodeSelection();
      let focusElement: any = divElement.querySelector('.focusElement');
      range = document.createRange();
      let textLength = focusElement.textContent.length - 1;
      range.setStart(focusElement.firstChild, 0);
      range.setEnd(focusElement.firstChild, textLength);
      let paragraph: Element = document.createElement('p');
      paragraph.textContent = "Hello Rich Text Editor";
      domSelection.setSelectionText(document, focusElement.firstChild, focusElement.firstChild, 0, textLength);
      (InsertHtml as any).Insert(document, paragraph, divElement, true);
      expect(divElement.getElementsByClassName("e-cell-select")[0].firstElementChild.outerHTML).toBe('<p>Hello Rich Text Editor</p>');
    });
  });

  // ============================================
  // Bullet List Insertion (878730)
  // ============================================
  describe('Bullet List Insertion (878730)', () => {
    let innervalue: string = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fhdfhdh<span id="start">dhdhdhgdghdgh</span></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li></ul>';
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

    it('Bullet format list not removed properly when we replace the content in RichTextEditor - select all and replace single line.', () => {
      let editNode: Element = divElement;
      let selectNode: Element = document.getElementById('parentDiv');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph: Element = document.createElement('P');
      paragraph.innerHTML= 'testTable1';
      pasteElement.appendChild(paragraph);
      domSelection.setSelectionNode(document, selectNode);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>testTable1</p></li>').toBe(true);
    });

    it('Bullet format list not removed properly when we replace the content in RichTextEditor - select all and replace multiple line.', () => {
      divElement.innerHTML = innervalue;
      let editNode: Element = divElement;
      let selectNode: Element = document.getElementById('parentDiv');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph: Element = document.createElement('P');
      paragraph.innerHTML= 'testTable1';
      let paragraph1: Element = document.createElement('P');
      paragraph1.innerHTML= 'testTable1';
      pasteElement.appendChild(paragraph);
      pasteElement.appendChild(paragraph1);
      domSelection.setSelectionNode(document, selectNode);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li><p>testTable1</p></li><li><p>testTable1</p></li>').toBe(true);
    });

    it('Bullet format list not removed properly when we replace the content in RichTextEditor - partial selection and replace single line.', () => {
      divElement.innerHTML = innervalue;
      let editNode: Element = divElement;
      let startNode: Element = document.getElementById('start');
      let endNode: Element = document.getElementById('end');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph: Element = document.createElement('P');
      paragraph.innerHTML= 'testTable1';
      pasteElement.appendChild(paragraph);
      domSelection.setSelectionText(document, startNode.firstChild, endNode.firstChild, 0, 6);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fhdfhdh<span id="start"></span>testTable1</p></li>').toBe(true);
    });

    it('Bullet format list not removed properly when we replace the content in RichTextEditor - partial selection and replace single span line.', () => {
      divElement.innerHTML = innervalue;
      let editNode: Element = divElement;
      let startNode: Element = document.getElementById('start');
      let endNode: Element = document.getElementById('end');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let span: Element = document.createElement('span');
      span.innerHTML= 'testTable1';
      pasteElement.appendChild(span);
      domSelection.setSelectionText(document, startNode.firstChild, endNode.firstChild, 0, 6);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fhdfhdh<span>testTable1</span></p></li>').toBe(true);
    });

    it('Bullet format list not removed properly when we replace the content in RichTextEditor - partial selection and replace multiple line.', () => {
      divElement.innerHTML = innervalue;
      let editNode: Element = divElement;
      let startNode: Element = document.getElementById('start');
      let endNode: Element = document.getElementById('end');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph: Element = document.createElement('P');
      paragraph.innerHTML= 'testTable1';
      let paragraph1: Element = document.createElement('P');
      paragraph1.innerHTML= 'testTable1';
      pasteElement.appendChild(paragraph);
      pasteElement.appendChild(paragraph1);
      domSelection.setSelectionText(document, startNode.firstChild, endNode.firstChild, 0, 6);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>FhdfhdhtestTable1</p></li><li><p>testTable1</p></li>').toBe(true);
    });

    it('Bullet format list not removed properly when we replace the content in RichTextEditor - middle selection and replace single line.', () => {
      divElement.innerHTML = innervalue;
      let editNode: Element = divElement;
      let startNode: Element = document.getElementById('start');
      let endNode: Element = document.getElementById('middle');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph: Element = document.createElement('P');
      paragraph.innerHTML= 'testTable1';
      pasteElement.appendChild(paragraph);
      domSelection.setSelectionText(document, startNode.firstChild, endNode.firstChild, 0, 6);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fhdfhdh<span id="start"></span></p></li><li><p>testTable1</p></li><li style="list-style-type: none;"><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif; list-style-type: none;"><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p><span id="middle"></span><span id="end">HDHDFH</span></p></li></ul></li></ul></li>').toBe(true);
    });
  });

  // ============================================
  // Nested Table & List Insertion (957633)
  // ============================================
  describe('Nested Table & List Insertion (957633)', () => {
    let innervalue: string = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;" id="parentLi"><p>Fhdfhdh<span id="start">dhdhdhgdghdgh</span></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li></ul>';
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

    it('Bullet list should be maintained when pasting block elements in start of list', () => {
      let editNode: Element = divElement;
      let selectNode: Element = document.getElementById('parentLi');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph: Element = document.createElement('P');
      paragraph.innerHTML = 'testTable1';
      pasteElement.appendChild(paragraph);
      domSelection.setSelectionText(document, selectNode.firstChild, selectNode.firstChild, 0, 0);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;" id="parentLi"><p>testTable1Fhdfhdh<span id="start">dhdhdhgdghdgh</span></p><p></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li>').toBe(true);
    });

    it('Bullet list should be maintained when pasting block elements in middle of list', () => {
      divElement.innerHTML = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;" id="parentLi"><p id="parentP">Fhdfhdh<span id="start">dhdhdhgdghdgh</span></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li></ul>';
      let editNode: Element = divElement;
      let selectNode: Element = document.getElementById('parentP');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph: Element = document.createElement('P');
      paragraph.innerHTML = 'testTable1';
      pasteElement.appendChild(paragraph);
      domSelection.setSelectionText(document, selectNode.firstChild, selectNode.firstChild, 4, 4);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;" id="parentLi"><p id="parentP">FhdftestTable1hdh<span id="start">dhdhdhgdghdgh</span></p><p id="parentP"></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li>').toBe(true);
    });

    it('Bullet list should be maintained when pasting block elements in end of list', () => {
      divElement.innerHTML = innervalue;
      let editNode: Element = divElement;
      let selectNode: Element = document.getElementById('start');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph: Element = document.createElement('P');
      paragraph.innerHTML = 'testTable1';
      pasteElement.appendChild(paragraph);
      domSelection.setSelectionText(document, selectNode.firstChild, selectNode.firstChild, selectNode.textContent.length, selectNode.textContent.length);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;" id="parentLi"><p>Fhdfhdh<span id="start">dhdhdhgdghdghtestTable1</span></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li>').toBe(true);
    });

    it('Bullet list should be maintained when pasting non-block elements in end of list', () => {
      divElement.innerHTML = innervalue;
      let editNode: Element = divElement;
      let selectNode: Element = document.getElementById('start');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph: Element = document.createElement('P');
      paragraph.innerHTML = 'testTable1';
      pasteElement.appendChild(paragraph);
      domSelection.setSelectionText(document, selectNode.firstChild, selectNode.firstChild, selectNode.textContent.length, selectNode.textContent.length);
      InsertHtml.Insert(document, paragraph.innerHTML, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;" id="parentLi"><p>Fhdfhdh<span id="start">dhdhdhgdghdghtestTable1</span></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li>').toBe(true);
    });

    it('Bullet list should be maintained when pasting block elements in start of list for non collapse selection', () => {
      divElement.innerHTML = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;" id="parentLi"><p id="parentP">Fhdfhdh<span id="start">dhdhdhgdghdgh</span></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li></ul>';
      let editNode: Element = divElement;
      let selectNode: Element = document.getElementById('parentP');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph: Element = document.createElement('P');
      paragraph.innerHTML = 'testTable1';
      pasteElement.appendChild(paragraph);
      domSelection.setSelectionText(document, selectNode.firstChild, selectNode.firstChild, 0, 3);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;" id="parentLi"><p>testTable1fhdh<span id="start">dhdhdhgdghdgh</span></p></li><li style="list-style-type: none;"><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li>').toBe(true);
    });

    it('Bullet list should be maintained when pasting two block elements in middle of list', () => {
      divElement.innerHTML = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;" id="parentLi"><p id="parentP">Fhdfhdh<span id="start">dhdhdhgdghdgh</span></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li></ul>';
      let editNode: Element = divElement;
      let selectNode: Element = document.getElementById('parentP');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph1: Element = document.createElement('P');
      paragraph1.innerHTML = 'testTable1';
      pasteElement.appendChild(paragraph1);
      let paragraph2: Element = document.createElement('P');
      paragraph2.innerHTML = 'testTable2';
      pasteElement.appendChild(paragraph2);
      domSelection.setSelectionText(document, selectNode.firstChild, selectNode.firstChild, 4, 4);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;" id="parentLi"><p id="parentP">FhdftestTable1</p><p id="parentP"></p></li><li><p>testTable2hdh<span id="start">dhdhdhgdghdgh</span></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li>').toBe(true);
    });

    it('Bullet list should be maintained when pasting non-block elements in end of list', () => {
      divElement.innerHTML = innervalue;
      let editNode: Element = divElement;
      let selectNode: Element = document.getElementById('start');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      pasteElement.innerHTML = 'testTable1<b>Hello</b><p>Hi</p><span>testTable2</span>';
      domSelection.setSelectionText(document, selectNode.firstChild, selectNode.firstChild, selectNode.textContent.length, selectNode.textContent.length);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;" id="parentLi"><p>Fhdfhdh<span id="start">dhdhdhgdghdghtestTable1<b>Hello</b></span></p></li><li><p>Hi</p></li><li><p><span>testTable2</span></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li>').toBe(true);
    });

    it('Bullet list should be maintained when pasting two block elements in multiple selection of list', () => {
      divElement.innerHTML = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li id="firstLi">Hellloooo</li><li id="secondLi">Hiiiiiiii<ul><li>List1</li><li>List2</li></ul></li><li>List3</li><li>List4</li></ul>';
      let editNode: Element = divElement;
      let selectNode: Element = divElement.querySelector('#firstLi');
      let endNode: Element = divElement.querySelector('#secondLi');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph1: Element = document.createElement('P');
      paragraph1.innerHTML = 'testTable1';
      pasteElement.appendChild(paragraph1);
      let paragraph2: Element = document.createElement('P');
      paragraph2.innerHTML = 'testTable2';
      pasteElement.appendChild(paragraph2);
      domSelection.setSelectionText(document, selectNode.firstChild, endNode.firstChild, 4, 4);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li id="firstLi">HelltestTable1</li><li id="secondLi"><p>testTable2iiiii</p></li><li style="list-style-type: none;"><ul><li>List1</li><li>List2</li></ul></li><li>List3</li><li>List4</li>').toBe(true);
    });

    it('Bullet list should be maintained when pasting two block elements in multiple selection of nested list', () => {
      divElement.innerHTML = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li>Hellloooo</li><li>Hiiiiiiii<ul><li id="firstLi">List1</li><li id="secondLi">List2</li></ul></li><li>List3</li><li>List4</li></ul>';
      let editNode: Element = divElement;
      let selectNode: Element = divElement.querySelector('#firstLi');
      let endNode: Element = divElement.querySelector('#secondLi');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph1: Element = document.createElement('P');
      paragraph1.innerHTML = 'testTable1';
      pasteElement.appendChild(paragraph1);
      let paragraph2: Element = document.createElement('P');
      paragraph2.innerHTML = 'testTable2';
      pasteElement.appendChild(paragraph2);
      domSelection.setSelectionText(document, selectNode.firstChild, endNode.firstChild, 4, 4);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li>Hellloooo</li><li>Hiiiiiiii<ul><li id="firstLi">ListtestTable1</li><li id="secondLi"><p>testTable22</p></li></ul></li><li>List3</li><li>List4</li>').toBe(true);
    });

    it('Bullet list should be maintained when pasting two block elements in start of the list', () => {
      divElement.innerHTML = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li id="firstLi">Hellloooo</li><li>Hiiiiiiii<ul><li>List1</li><li id="secondLi">List2</li></ul></li><li>List3</li><li>List4</li></ul>';
      let editNode: Element = divElement;
      let selectNode: Element = divElement.querySelector('#firstLi');
      let endNode: Element = divElement.querySelector('#secondLi');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph1: Element = document.createElement('P');
      paragraph1.innerHTML = 'testTable1';
      pasteElement.appendChild(paragraph1);
      let paragraph2: Element = document.createElement('P');
      paragraph2.innerHTML = 'testTable2';
      pasteElement.appendChild(paragraph2);
      domSelection.setSelectionText(document, selectNode.firstChild, selectNode.firstChild, 0, 0);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li><p>testTable1</p></li><li id="firstLi"><p>testTable2Hellloooo</p></li><li>Hiiiiiiii<ul><li>List1</li><li id="secondLi">List2</li></ul></li><li>List3</li><li>List4</li>').toBe(true);
    });

    it('Bullet list should be maintained when pasting two block elements in end of the list which anchor tag', () => {
      divElement.innerHTML = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li>Hellloooo</li><li><a  id="firstLi" class="e-rte-anchor" href="https://www" title="https://www" target="_blank" aria-label="Open in new window">Hiiiiiiii</a><ul><li>List1</li><li id="secondLi">List2</li></ul></li><li>List3</li><li>List4</li></ul>';
      let editNode: Element = divElement;
      let selectNode: Element = divElement.querySelector('#firstLi');
      let endNode: Element = divElement.querySelector('#secondLi');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph1: Element = document.createElement('P');
      paragraph1.innerHTML = 'testTable1';
      pasteElement.appendChild(paragraph1);
      let paragraph2: Element = document.createElement('P');
      paragraph2.innerHTML = 'testTable2';
      pasteElement.appendChild(paragraph2);
      domSelection.setSelectionText(document, selectNode.firstChild, selectNode.firstChild, selectNode.firstChild.textContent.length, selectNode.firstChild.textContent.length);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li>Hellloooo</li><li><a id="firstLi" class="e-rte-anchor" href="https://www" title="https://www" target="_blank" aria-label="Open in new window">Hiiiiiiii</a>testTable1</li><li><p>testTable2</p><ul><li>List1</li><li id="secondLi">List2</li></ul></li><li>List3</li><li>List4</li>').toBe(true);
    });

    it('Bullet list should be maintained when pasting two block elements in middle of the list which anchor tag', () => {
      divElement.innerHTML = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li>Hellloooo</li><li><a  id="firstLi" class="e-rte-anchor" href="https://www" title="https://www" target="_blank" aria-label="Open in new window">Hiiiiiiii</a><ul><li>List1</li><li id="secondLi">List2</li></ul></li><li>List3</li><li>List4</li></ul>';
      let editNode: Element = divElement;
      let selectNode: Element = divElement.querySelector('#firstLi') as Element;
      let endNode: Element = divElement.querySelector('#secondLi') as Element;
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph1: Element = document.createElement('P');
      paragraph1.innerHTML = 'testTable1';
      pasteElement.appendChild(paragraph1);
      let paragraph2: Element = document.createElement('P');
      paragraph2.innerHTML = 'testTable2';
      pasteElement.appendChild(paragraph2);
      domSelection.setSelectionText(document, selectNode.firstChild, selectNode.firstChild, 3, 3);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li>Hellloooo</li><li><a id="firstLi" class="e-rte-anchor" href="https://www" title="https://www" target="_blank" aria-label="Open in new window">Hii</a>testTable1</li><li><p>testTable2<a id="firstLi" class="e-rte-anchor" href="https://www" title="https://www" target="_blank" aria-label="Open in new window">iiiiii</a></p><ul><li>List1</li><li id="secondLi">List2</li></ul></li><li>List3</li><li>List4</li>').toBe(true);
    });

    it('Bullet list should be maintained when pasting block elements in end of list when it is having nested list', () => {
      divElement.innerHTML = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;" id="start">Fhdfhdh<ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li></ul>';
      let editNode: Element = divElement;
      let selectNode: Element = divElement.querySelector('#start');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph: Element = document.createElement('P');
      paragraph.innerHTML = 'testTable1';
      pasteElement.appendChild(paragraph);
      let paragraph2: Element = document.createElement('P');
      paragraph2.innerHTML = 'testTable2';
      pasteElement.appendChild(paragraph2);
      domSelection.setSelectionText(document, selectNode.firstChild, selectNode.firstChild, selectNode.firstChild.textContent.length, selectNode.firstChild.textContent.length);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;" id="start">FhdfhdhtestTable1</li><li><p>testTable2</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgfsfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li>').toBe(true);
    });

    it('Bullet list should be maintained when pasting block elements in middle of list when list has no block elements in it', () => {
      divElement.innerHTML = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p id="parentP">Fhdfhdh<span id="start">dhdhdhgdghdgh</span></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;" id="parentLi">Sfgfsfsfshsfhfshsfhfs</li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li></ul>';
      let editNode: Element = divElement;
      let selectNode: Element = divElement.querySelector('#parentLi');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph: Element = document.createElement('P');
      paragraph.innerHTML = 'testTable1';
      pasteElement.appendChild(paragraph);
      let paragraph2: Element = document.createElement('P');
      paragraph2.innerHTML = 'testTable2';
      pasteElement.appendChild(paragraph2);
      domSelection.setSelectionText(document, selectNode.firstChild, selectNode.firstChild, 4, 4);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p id="parentP">Fhdfhdh<span id="start">dhdhdhgdghdgh</span></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;" id="parentLi">SfgftestTable1</li><li><p>testTable2sfsfshsfhfshsfhfs</p></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li>').toBe(true);
    });

    it('Bullet list should be maintained when pasting non-block elements in middle of list when list has no block elements in it', () => {
      divElement.innerHTML = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p id="parentP">Fhdfhdh<span id="start">dhdhdhgdghdgh</span></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;" id="parentLi">Sfgfsfsfshsfhfshsfhfs</li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li></ul>';
      let editNode: Element = divElement;
      let selectNode: Element = divElement.querySelector('#parentLi');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph: Element = document.createElement('B');
      paragraph.innerHTML = 'testTable1';
      pasteElement.appendChild(paragraph);
      let paragraph2: Element = document.createElement('B');
      paragraph2.innerHTML = 'testTable2';
      pasteElement.appendChild(paragraph2);
      domSelection.setSelectionText(document, selectNode.firstChild, selectNode.firstChild, 4, 4);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p id="parentP">Fhdfhdh<span id="start">dhdhdhgdghdgh</span></p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;" id="parentLi">Sfgf<b>testTable1</b><b>testTable2</b>sfsfshsfhfshsfhfs</li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfsfhsfsfhsfhsfhfs</p><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Sfgsfhfsshsfhsfsfh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dffdhdfhdhdfhdfh</p><ul level="4" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Fdhfdhfdhdfhdfhdfh</p></li></ul></li></ul></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>Dfhfdhdhdhdh</p><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Aptos, sans-serif;"><p>DFH<span id="middle">FDHDHD</span><span id="end">HDHDFH</span></p></li></ul></li></ul></li>').toBe(true);
    });

    it('Bullet list should be maintained when pasting multiple block elements in multiple selection of list', () => {
      divElement.innerHTML = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li id="firstLi">Hellloooo</li><li id="secondLi">Hiiiiiiii<ul><li>List1</li><li>List2</li></ul></li><li>List3</li><li>List4</li></ul>';
      let editNode: Element = divElement;
      let selectNode: Element = divElement.querySelector('#firstLi');
      let endNode: Element = divElement.querySelector('#secondLi');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph1: Element = document.createElement('P');
      paragraph1.innerHTML = 'testTable1';
      pasteElement.appendChild(paragraph1);
      let paragraph2: Element = document.createElement('P');
      paragraph2.innerHTML = 'testTable2';
      pasteElement.appendChild(paragraph2);
      let paragraph3: Element = document.createElement('P');
      paragraph3.innerHTML = 'testTable3';
      pasteElement.appendChild(paragraph3);
      domSelection.setSelectionText(document, selectNode.firstChild, endNode.firstChild, 4, 4);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li id="firstLi">HelltestTable1</li><li><p>testTable2</p></li><li id="secondLi"><p>testTable3iiiii</p></li><li style="list-style-type: none;"><ul><li>List1</li><li>List2</li></ul></li><li>List3</li><li>List4</li>').toBe(true);
    });

    it('Bullet list should be maintained when pasting multiple block elements in single li selection of list', () => {
      divElement.innerHTML = '<ul id="parentDiv" level="1" style="margin-bottom:0in;list-style-type: disc;"><li>Hellloooo</li><li><a  id="firstLi" class="e-rte-anchor" href="https://www" title="https://www" target="_blank" aria-label="Open in new window">Hiiiiiiii</a><ul><li>List1</li><li id="secondLi">List2</li></ul></li><li>List3</li><li>List4</li></ul>';
      let editNode: Element = divElement;
      let selectNode: Element = divElement.querySelector('#firstLi');
      let endNode: Element = divElement.querySelector('#secondLi');
      let pasteElement: HTMLElement = document.createElement('div');
      pasteElement.classList.add('pasteContent');
      let paragraph1: Element = document.createElement('P');
      paragraph1.innerHTML = 'testTable1';
      pasteElement.appendChild(paragraph1);
      let paragraph2: Element = document.createElement('P');
      paragraph2.innerHTML = 'testTable2';
      pasteElement.appendChild(paragraph2);
      let paragraph3: Element = document.createElement('P');
      paragraph3.innerHTML = 'testTable3';
      pasteElement.appendChild(paragraph3);
      domSelection.setSelectionText(document, selectNode.firstChild, selectNode.firstChild, 2, 4);
      InsertHtml.Insert(document, pasteElement, editNode);
      expect(document.getElementById('parentDiv').innerHTML === '<li>Hellloooo</li><li><a id="firstLi" class="e-rte-anchor" href="https://www" title="https://www" target="_blank" aria-label="Open in new window">Hi</a>testTable1</li><li><p>testTable2</p></li><li><p>testTable3<a id="firstLi" class="e-rte-anchor" href="https://www" title="https://www" target="_blank" aria-label="Open in new window">iiiii</a></p></li><li style="list-style-type: none;"><ul><li>List1</li><li id="secondLi">List2</li></ul></li><li>List3</li><li>List4</li>').toBe(true);
    });
  });

  // ============================================
  // Horizontal Rule (HR) Insertion
  // ============================================
  describe('InsertHtml - insertHorizontalRule method', () => {
    let divElement: HTMLElement;
    let domSelection: NodeSelection;
    let editorObj: EditorManager;

    beforeAll(() => {
      divElement = document.createElement('div');
      divElement.id = 'divElement';
      divElement.contentEditable = 'true';
      domSelection = new NodeSelection();
      document.body.appendChild(divElement);
    });

    afterAll(() => {
      detach(divElement);
    });

    beforeEach(() => {
      // Reset the div element content before each test
      divElement.innerHTML = '';
    });

    it('should insert HR in list item', (done) => {
      divElement.innerHTML = '<ul><li>First item</li><li id="target">Second item</li><li>Third item</li></ul>';
      const li = divElement.querySelector('#target');
      const textNode = li.firstChild;
      const range = document.createRange();
      range.setStart(textNode, 6);
      range.setEnd(textNode, 6);
      domSelection.setSelectionText(document, textNode, textNode, 6, 6);

      InsertHtml.Insert(document, '<hr/>', divElement, true, 'P');

      expect(divElement.innerHTML).toBe('<ul><li>First item</li><li id="target">Second<hr> item</li><li>Third item</li></ul>');
      done();
    });

    it('should insert HR in list item at end', (done) => {
      divElement.innerHTML = '<ul><li>First item</li><li>Second item</li><li id="target">Third item</li></ul>';
      const li = divElement.querySelector('#target');
      const textNode = li.firstChild;
      const range = document.createRange();
      range.setStart(textNode, 10);
      range.setEnd(textNode, 10);
      domSelection.setSelectionText(document, textNode, textNode, 10, 10);

      InsertHtml.Insert(document, '<hr/>', divElement, true, 'P');

      expect(divElement.innerHTML).toBe('<ul><li>First item</li><li>Second item</li><li id="target">Third item<hr><p><br></p></li></ul>');
      done();
    });

    it('should insert HR after a table', (done) => {
      divElement.innerHTML = '<table id="targetTable"><tbody><tr><td>Cell 1</td></tr></tbody></table><p>Paragraph after table</p>';
      const table = divElement.querySelector('#targetTable');
      // Creating the range at the end of the table
      const range = document.createRange();
      range.setStartAfter(table);
      range.setEndAfter(table);
      domSelection.setSelectionText(document, range.startContainer, range.endContainer, range.startOffset, range.endOffset);

      InsertHtml.Insert(document, '<hr/>', divElement, true, 'P');
      expect(divElement.innerHTML).toBe('<table id="targetTable"><tbody><tr><td>Cell 1</td></tr></tbody></table><hr><p>Paragraph after table</p>');
      done();
    });

    it('should insert HR in an empty list', (done) => {
      divElement.innerHTML = '<ul><li></li></ul>';
      const li = divElement.querySelector('li');
      const range = document.createRange();

      range.setStart(li, 0);
      range.setEnd(li, 0);
      domSelection.setSelectionText(document, li, li, 0, 0);

      InsertHtml.Insert(document, '<hr/>', divElement, true, 'P');

      expect(divElement.innerHTML).toBe('<ul><li><hr><p><br></p></li></ul>');
      done();
    });

    it('should replace the first list item with an HR', (done) => {
      divElement.innerHTML = '<ul><li>First Item</li><li>Second Item</li></ul>';
      const firstLi = divElement.querySelector('li:first-child');
      const range = document.createRange();

      range.selectNodeContents(firstLi);
      domSelection.setSelectionText(document, firstLi, firstLi, 0, firstLi.childNodes.length);

      InsertHtml.Insert(document, '<hr/>', divElement, true, 'P');

      expect(divElement.innerHTML).toBe('<ul><li><hr></li><li>Second Item</li></ul>');
      done();
    });

    it('should replace multiple list items with an HR', (done) => {
      divElement.innerHTML = '<ul><li>First Item</li><li>Second Item</li><li>Third Item</li></ul>';
      const li1 = divElement.querySelector('li:first-child');
      const li3 = divElement.querySelector('li:last-child');
      const range = document.createRange();

      range.setStartBefore(li1);
      range.setEndAfter(li3);
      domSelection.setSelectionText(document, li1, li3, 0, li3.childNodes.length);

      InsertHtml.Insert(document, '<hr/>', divElement, true, 'P');

      expect(divElement.innerHTML).toBe('<ul><li><hr><p><br></p></li></ul>');
      done();
    });

    it('should apply indentation to h1 and p tags but not hr tag', function () {
      const editableDiv = document.createElement('div');
      editableDiv.id = 'content-edit';
      document.body.appendChild(editableDiv);
      // Initialize editorObj
      editorObj = new EditorManager({ document: document, editableElement: editableDiv });
      // Set up the inner HTML for the test
      editableDiv.innerHTML = `<h1>Header</h1><hr><p>Paragraph</p>`;
      var start = editableDiv.querySelector('h1');
      var hr = editableDiv.querySelector('hr');
      var end = editableDiv.querySelector('p');
      // Set selection from h1 to p
      editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 0, end.childNodes[0].textContent.length);
      // Execute indent command
      editorObj.execCommand("Indents", 'Indent', null);
      // Check marginLeft for start and end
      expect(start.style.marginLeft).toBe('20px');
      expect(end.style.marginLeft).toBe('20px');
      // Verify hr margin stays unchanged
      expect(hr.style.marginLeft).toBe('');
      // Clear selection
      editorObj.nodeSelection.Clear(document);
      // Clean up the DOM
      document.body.removeChild(editableDiv);
    });

    it('961373-Text Gets Deleted After Inserting Horizontal Line Before It in Nested List', (done) => {
      divElement.innerHTML = '<ul><li><hr>Some text</li></ul>';
      // Select the HR element
      const hr = divElement.querySelector('li > hr');
      const range = document.createRange();
      range.setStartBefore(hr.nextSibling);
      range.setEndBefore(hr.nextSibling);
      // Set the selection
      domSelection.setSelectionText(document, hr.parentNode, hr.parentNode, 0, 0);
      // Insert another HR
      InsertHtml.Insert(document, '<hr/>', divElement, true, 'P');
      expect(divElement.innerHTML).toBe('<ul><li><hr><hr>Some text</li></ul>');
      done();
    });

    it('961415-Horizontal line: Inconsistent (hr)Insertion Behavior Inside Block Quote', (done) => {
      // Setup: Create and configure the HTML structure.
      divElement.innerHTML = '<blockquote><p>Example text node</p></blockquote>';
      const paragraph = divElement.querySelector('p');
      const textNode = paragraph.firstChild as Text;
      // Create a range and set the cursor at the end of the text node.
      const range = document.createRange();
      range.setStart(textNode, textNode.length);
      range.setEnd(textNode, textNode.length);
      domSelection.setSelectionText(document, textNode, textNode, textNode.length, textNode.length);
      // Perform the action: Insert HR.
      InsertHtml.Insert(document, '<hr/>', divElement, true, 'P');
      // Assertion: Check the expected HTML structure.
      expect(divElement.innerHTML).toBe('<blockquote><p>Example text node</p><hr><p><br></p></blockquote>');
      done();
    });

    it('961426-Horizontal Line- Script error thrown and insertion fails when inserting a horizontal line before a table', (done) => {
      divElement.innerHTML = '<table><tbody><tr><td>Cell 1</td></tr><tr><td>Cell 2</td></tr></tbody></table>';
      domSelection.setCursorPoint(document, divElement, 0);
      // Insert an HR element before the table
      InsertHtml.Insert(document, '<hr/>', divElement, true, 'P');
      expect(divElement.innerHTML).toBe('<hr><p><br></p><table><tbody><tr><td>Cell 1</td></tr><tr><td>Cell 2</td></tr></tbody></table>');
      done();
    });

    it('961424-Horizontal Line :  Inserting a horizontal line at the end of a nested table removes the nested table', (done) => {
      divElement.innerHTML = `<table><tbody><tr><td class="e-cell-select"><table><tbody><tr><td class=""><br></td></tr></tbody></table><p><br></p></td></tr></tbody></table>`;

      const innerTable = divElement.querySelector('.e-cell-select table');
      const paragraph = divElement.querySelector('.e-cell-select p');
      const range = document.createRange();
      range.setStartAfter(innerTable);
      range.setEndBefore(paragraph.firstChild);
      // Set cursor after the inner table and before the paragraph
      domSelection.setCursorPoint(document, range.endContainer as Element, range.endOffset);

      InsertHtml.Insert(document, '<hr/>', divElement, true, 'P');

      expect(divElement.innerHTML).toBe('<table><tbody><tr><td class="e-cell-select"><table><tbody><tr><td class=""><br></td></tr></tbody></table><hr><p><br></p></td></tr></tbody></table>');
      done();
    });
  });

    describe('1031317: Script Exception Occurs When Copy-Pasting Image Next to Bold Text in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let consoleSpy: jasmine.Spy;

        beforeEach(() => {
            consoleSpy = jasmine.createSpy('console');
            rteObj = renderRTE({
                value: '<p><strong>Syncfusion</strong></p>'
            });
        });

        afterEach(() => {
            destroy(rteObj);
            consoleSpy = null;
        });

        it('does not call console.error when pasting an image after the last strong character', (done) => {
            rteObj.focusIn();
            const strong = rteObj.contentModule.getEditPanel().querySelector('strong');
            expect(strong).not.toBeNull();
            const textNode = strong.firstChild;
            const len = textNode.textContent.length;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, textNode, textNode, len, len);
            const data = new DataTransfer();
            data.setData('text/html', '<img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png">');
            const pasteEvent = new ClipboardEvent('paste', {
                clipboardData: data,
                bubbles: true,
                cancelable: true
            } as any);
            rteObj.inputElement.dispatchEvent(pasteEvent);
            setTimeout(() => {
                expect(consoleSpy).not.toHaveBeenCalled();
                const range: Range = rteObj.formatter.editorManager.nodeSelection.getRange(document);
                const strong = rteObj.contentModule.getEditPanel().querySelector('strong');
                expect(strong.querySelector('img')).not.toBe(null);
                expect(range.startContainer.nodeName === '#text').toBe(true);
                expect(range.startContainer.textContent === '\u00A0').toBe(true);
                done();
            }, 100);
        });
    });

    describe('1031317: InsertHTML should be placed inside formatted span', () => {
        let rteObj: RichTextEditor;
        let editor: HTMLElement;

        beforeEach(() => {
            rteObj = renderRTE({
                value: '<p><span style="font-size: 12pt;"><span style="font-family: Arial;">\u200B</span></span></p>'
            });
            editor = rteObj.contentModule.getEditPanel() as HTMLElement;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it('Case 1: Insert text string', (done) => {
            const span = editor.querySelector('span > span');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, span.firstChild, span.firstChild, 1, 1);
            rteObj.executeCommand('insertHTML', 'Lorem ipsum dolor sit amet and so on');
            setTimeout(() => {
                const expected = '<span style="font-size: 12pt;"><span style="font-family: Arial;">\u200BLorem ipsum dolor sit amet and so on</span></span>';
                expect(editor.querySelector('p').innerHTML).toBe(expected);
                const range: Range = rteObj.formatter.editorManager.nodeSelection.getRange(document);
                expect(range.startContainer.textContent).toBe('Lorem ipsum dolor sit amet and so on');
                expect(range.startOffset).toBe(range.startContainer.textContent.length);
                done();
            }, 100);
        });
    });

    describe('1031317: InsertHTML should be placed inside formatted span with text and span', () => {
        let rteObj: RichTextEditor;
        let editor: HTMLElement;

        beforeEach(() => {
            rteObj = renderRTE({
                value: '<p><span style="font-size: 12pt;"><span style="font-family: Arial;">\u200B</span></span></p>'
            });
            editor = rteObj.contentModule.getEditPanel() as HTMLElement;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it('Case 2: Text with span Insertion', (done) => {
            const span = editor.querySelector('span > span');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, span.firstChild, span.firstChild, 1, 1);
            const insertContent: string = 'Lorem ipsum dolor sit amet and so on <span>Hi asdasdassa</span>';
            rteObj.executeCommand('insertHTML', insertContent);
            setTimeout(() => {
                const expected = '<span style="font-size: 12pt;"><span style="font-family: Arial;">\u200BLorem ipsum dolor sit amet and so on <span>Hi asdasdassa</span></span></span>';
                expect(editor.querySelector('p').innerHTML).toBe(expected);
                const range: Range = rteObj.formatter.editorManager.nodeSelection.getRange(document);
                expect(range.startContainer.textContent).toBe('Hi asdasdassa');
                expect(range.startOffset).toBe(range.startContainer.textContent.length);
                done();
            }, 100);
        });
    });

    describe('1031317: InsertHTML should be placed inside formatted span with text span and p', () => {
        let rteObj: RichTextEditor;
        let editor: HTMLElement;

        beforeEach(() => {
            rteObj = renderRTE({
                value: '<p><span style="font-size: 12pt;"><span style="font-family: Arial;">\u200B</span></span></p>'
            });
            editor = rteObj.contentModule.getEditPanel() as HTMLElement;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it('Case 3: Insertion of text with span and p', (done) => {
            const span = editor.querySelector('span > span');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, span.firstChild, span.firstChild, 1, 1);
            const insertContent = 'Lorem ipsum dolor sit amet and so on <span>Hi asdasdassa</span><p>Hello</p>';
            rteObj.executeCommand('insertHTML', insertContent);
            setTimeout(() => {
                const expectedFirstP = '<span style="font-size: 12pt;"><span style="font-family: Arial;">\u200BLorem ipsum dolor sit amet and so on <span>Hi asdasdassa</span></span></span>';
                expect(editor.querySelectorAll('p')[0].innerHTML).toBe(expectedFirstP);
                expect(editor.querySelectorAll('p')[1].innerHTML).toBe('Hello');
                const range: Range = rteObj.formatter.editorManager.nodeSelection.getRange(document);
                expect(range.startContainer.textContent).toBe('Hello');
                expect(range.startOffset).toBe(range.startContainer.textContent.length);
                done();
            }, 100);
        });
    });
    describe('Bug 966213: Table insertion does not replace selected content when selection is made bottom to top', () => {
            let rteEle: HTMLElement;
            let rteObj: RichTextEditor;
            beforeAll(() => {
                rteObj = renderRTE({
                    height: 400,
                    value: `<p class='start'>1</p><p>2</p><p class='end'>3</p>`,
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable']
                    },
                });
                rteEle = rteObj.element;
            });
            afterAll(() => {
                destroy(rteObj);
            });
            it(' While selecting multiple elements and applying table, table should replace all the content selected', (done: DoneFn) => {
                const startNode: Element = rteObj.inputElement.querySelector('.start').firstChild as Element;
                const endNode: Element = rteObj.inputElement.querySelector('.end').firstChild as Element;
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, endNode, 0, endNode.textContent.length);
                (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
                let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
                let clickEvent: any = document.createEvent("MouseEvents");
                clickEvent.initEvent("click", false, true);
                target.dispatchEvent(clickEvent);
                rteEle.querySelector('.e-table-row').dispatchEvent(new Event("change"));
                (rteEle.querySelector('.e-table-row') as HTMLInputElement).blur();
                target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
                target.dispatchEvent(clickEvent);
                setTimeout(() => {
                    let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
                    expect(table.querySelectorAll('tr').length === 3).toBe(true);
                    expect(rteObj.contentModule.getEditPanel().innerHTML === `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td class="e-cell-select"><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p>`).toBe(true);
                    done();
                }, 200);
            });
        });
     describe('Bug 993693: Table inserted outside the Editor, when RichTextEditor is placed inside an ordered list', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let listHost: HTMLElement;
        let rteHost: HTMLElement;
        beforeEach(() => {
            listHost = document.createElement('ol');
            const listItem = document.createElement('li');
            rteHost = document.createElement('div');
            rteHost.id = 'rteElement';
            listItem.appendChild(rteHost);
            listHost.appendChild(listItem);
            document.body.appendChild(listHost);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['CreateTable']
                }
            });
            rteObj.appendTo('#rteElement');
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
            listHost.remove();
            rteHost.remove();
            listHost = null;
            rteHost = null;
        });
        it(' A table must be inserted inside the Rich Text Editor even when the editor is rendered within a list.', (done) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            const createTableButton: HTMLElement = rteEle.querySelector('[aria-label="Create Table (Ctrl+Shift+E)"]');
            createTableButton.click();
            var tableDialogPrimaryButton: HTMLElement = document.body.querySelector('#' + rteObj.element.id + '_insertTable');
            tableDialogPrimaryButton.click();
            var insertButton: HTMLElement = document.querySelector('button.e-rte-elements.e-control.e-btn.e-lib.e-flat.e-insert-table.e-primary');
            insertButton.click();
            const tables = rteObj.contentModule.getEditPanel().querySelectorAll('table');
            expect(tables.length).toBe(1);
            done();
        });
    });
    describe('945968 - Listed table got removed while inserting new table into the RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                }
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should not remove existing tables when inserting a new table below a numbered list', (done) => {
            rteObj.value = `<ol>
                                <li>Point 1</li>
                                <li>
                                    <table>
                                        <tr><td>Cell 1</td><td>Cell 2</td></tr>
                                    </table>
                                    <br>
                                </li>
                            </ol>`;
            rteObj.dataBind();
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            const node = rteObj.contentModule.getDocument().querySelector('table') as HTMLElement;
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(rteObj.contentModule.getDocument(), node.parentNode as HTMLElement, 1);
            const createTableButton: HTMLElement = rteEle.querySelector('[aria-label="Create Table (Ctrl+Shift+E)"]');
            createTableButton.click();
            var tableDialogPrimaryButton: HTMLElement = document.body.querySelector('#' + rteObj.element.id + '_insertTable');
            tableDialogPrimaryButton.click();
            var insertButton: HTMLElement = document.querySelector('button.e-rte-elements.e-control.e-btn.e-lib.e-flat.e-insert-table.e-primary');
            insertButton.click();
            const tables = rteObj.contentModule.getEditPanel().querySelectorAll('table');
            expect(tables.length).toBe(2);
            done();
        });
    });
    describe('923869 - The empty textarea element is not inserted using the ExecuteCommandAsync method', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p id="rte">RichTextEditor</p>`
            });
        });
        it('The empty textarea element is not inserted using the ExecuteCommandAsync method', () => {
            rteObj.executeCommand('insertHTML',`<textarea id="text" name="text" miplato_id="text"></textarea>`);
            expect(rteObj.inputElement.innerHTML).toBe('<p id="rte"><textarea id="text" name="text" miplato_id="text"></textarea>RichTextEditor</p>');
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('924546 - The content does not scroll into the cursor position when inserted through the executeCommand method', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 150,
                width: 150,
                value: ``
            });
            rteEle = rteObj.element;
        });
        it('The content does not scroll into the cursor position when inserted through the executeCommand method', () => {
            rteObj.executeCommand('insertHTML', `HTML tags are like keywords which defines that how web browser will format and display the content. With the help of tags, a web browser can distinguish between an HTML content and a simple content. HTML tags contain three main parts: opening tag, content and closing tag. But some HTML tags are unclosed tags.When a web browser reads an HTML document, browser reads it from top to bottom and left to right. HTML tags are used to create HTML documents and render their properties. Each HTML tags have different properties.An HTML file must have some essential tags so that web browser can differentiate between a simple text and HTML text. You can use as many tags you want as per your code requirement.HTML tags are like keywords which defines that how web browser will format and display the content. With the help of tags, a web browser can distinguish between an HTML content and a simple content. HTML tags contain three main parts: opening tag, content and closing tag. But some HTML tags are unclosed tags.When a web browser reads an HTML document, browser reads it from top to bottom and left to right. HTML tags are used to create HTML documents and render their properties. Each HTML tags have different properties.An HTML file must have some essential tags so that web browser can differentiate between a simple text and HTML text. You can use as many tags you want as per your code requirement.`);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
});
