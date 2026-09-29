/**
 * ClearFormat spec document
 */
import { detach } from '@syncfusion/ej2-base';
import { NodeSelection } from '../../../src/selection/selection';
import { ClearFormat } from '../../../src/editor-manager/plugin/clearformat';
import { selectTableCell, drawCellSelection, renderRTE, destroy } from "../../rich-text-editor/render.spec";
import { RichTextEditor } from "../../../src/rich-text-editor/base/rich-text-editor";
import { BASIC_MOUSE_EVENT_INIT } from '../../constant.spec';

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

describe('Clear Format tests', ()=> {
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

    describe('Bug 1006407: Clear Format not working properly on a table cells in RichTextEditor', () => {
        let innervalue: string = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 14.2857%;">egrege</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;" class="">ergerg</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;" class="">ergeg</td><td style="width: 14.2857%; background-color: rgb(0, 0, 128);" class=""><br></td></tr><tr><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%; background-color: rgb(255, 255, 0);" class="">erg</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;" class="">ergeg</td><td style="width: 14.2857%; background-color: rgb(255, 0, 0);" class="">ergege</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;"><br></td></tr><tr><td style="width: 14.2857%; background-color: rgb(255, 51, 51);" class="">ergeg</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%; background-color: rgb(0, 255, 0);" class="">ergre</td><td style="width: 14.2857%;" class=""><br></td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;" class="last">erge</td></tr></tbody></table><p><br></p>'
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

        it('When selecting table, inline style for table element also should be cleared', () => {
            new ClearFormat();
            let node1: Node = document.getElementsByClassName('e-rte-table')[0];
            let node2: HTMLElement = document.getElementsByClassName('last')[0] as HTMLElement;
            domSelection.setSelectionText(document, node1, node2, 0, 1);
            ClearFormat.clear(document, divElement, 'P');
            expect(document.querySelector('table').getAttribute('style')).toBe(null);
        });
    });

    describe('Bug 1006407: Clear Format not working properly on a table cells in RichTextEditor', () => {
        let innervalue: string = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr style="background-color: blue;"><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select">egrege</td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select">ergerg</td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select">ergeg</td><td style="width: 14.2857%; background-color: rgb(0, 0, 128);" class="e-cell-select e-multi-cells-select"><br></td></tr><tr style="background-color: blue;"><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%; background-color: rgb(255, 255, 0);" class="e-cell-select e-multi-cells-select">erg</td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select">ergeg</td><td style="width: 14.2857%; background-color: rgb(255, 0, 0);" class="e-cell-select e-multi-cells-select">ergege</td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%;" class="last e-cell-select e-multi-cells-select"><br></td></tr><tr style="background-color: blue;"><td style="width: 14.2857%; background-color: rgb(255, 51, 51);" class="e-cell-select e-multi-cells-select">ergeg</td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%; background-color: rgb(0, 255, 0);" class="e-cell-select e-multi-cells-select">ergre</td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%;" class="lastNode e-cell-select e-multi-cells-select e-cell-select-end">erge</td></tr></tbody></table><p><br></p>'
        let domSelection: NodeSelection = new NodeSelection();
        let divElement: HTMLDivElement = document.createElement('div');
        divElement.id = 'divElement';
        divElement.contentEditable = 'true';
        divElement.innerHTML = innervalue;

        beforeEach(() => {
            document.body.appendChild(divElement);
        });
        afterEach(() => {
            detach(divElement);
        });

        it('When selecting few cells in table, inline style for table element also should not be cleared', () => {
            new ClearFormat();
            let node1: Node = document.getElementsByClassName('e-rte-table')[0];
            let node2: HTMLElement = document.getElementsByClassName('last')[0] as HTMLElement;
            domSelection.setSelectionText(document, node1, node2, 0, 1);
            ClearFormat.clear(document, divElement, 'P');
            expect(document.querySelector('table').getAttribute('style')).not.toBe(null);
            expect(document.querySelectorAll('tr[style]').length).toBe(1);
        });

        it('When selecting few cells in table using multi select, inline style for table element also should not be cleared', () => {
            new ClearFormat();
            divElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr style="background-color: blue;"><td style="width: 14.2857%;">egrege</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;">ergerg</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;">ergeg</td><td style="width: 14.2857%; background-color: rgb(0, 0, 128);"><br></td></tr><tr style="background-color: blue;"><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%; background-color: rgb(255, 255, 0);">erg</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;">ergeg</td><td style="width: 14.2857%; background-color: rgb(255, 0, 0);">ergege</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;" class="last"><br></td></tr><tr style="background-color: blue;"><td style="width: 14.2857%; background-color: rgb(255, 51, 51);">ergeg</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%; background-color: rgb(0, 255, 0);">ergre</td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;"><br></td><td style="width: 14.2857%;" class="lastNode e-cell-select-end">erge</td></tr></tbody></table>`;
            const table: HTMLTableElement = document.querySelector('table');
            selectTableCell(table, 0, 0);
            drawCellSelection(table, 0, 1);
            let node: HTMLElement = document.getElementsByClassName('last')[0] as HTMLElement;
            domSelection.setSelectionText(document, node, node, 0, 1);
            ClearFormat.clear(document, divElement, 'P', null, 'ClearFormat');
            expect(document.querySelector('table').getAttribute('style')).not.toBe(null);
            expect(document.querySelectorAll('tr[style]').length).toBe(3);
        });

        it('When selecting all cells in table using multi select, inline style for table element also should be cleared', () => {
            new ClearFormat();
            divElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr style="background-color: blue;"><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select">egrege</td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select">ergerg</td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select">ergeg</td><td style="width: 14.2857%; background-color: rgb(0, 0, 128);" class="e-cell-select e-multi-cells-select"><br></td></tr><tr style="background-color: blue;"><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%; background-color: rgb(255, 255, 0);" class="e-cell-select e-multi-cells-select">erg</td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select">ergeg</td><td style="width: 14.2857%; background-color: rgb(255, 0, 0);" class="e-cell-select e-multi-cells-select">ergege</td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%;" class="last e-cell-select e-multi-cells-select"><br></td></tr><tr style="background-color: blue;"><td style="width: 14.2857%; background-color: rgb(255, 51, 51);" class="e-cell-select e-multi-cells-select">ergeg</td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%; background-color: rgb(0, 255, 0);" class="e-cell-select e-multi-cells-select">ergre</td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 14.2857%;" class="lastNode e-cell-select e-multi-cells-select e-cell-select-end">erge</td></tr></tbody></table>`;
            const table: HTMLTableElement = document.querySelector('table');
            selectTableCell(table, 0, 0);
            drawCellSelection(table, 2, 6);
            let node1: Node = document.getElementsByClassName('e-rte-table')[0];
            let node2: HTMLElement = document.getElementsByClassName('lastNode')[0] as HTMLElement;
            domSelection.setSelectionText(document, node1, node2.childNodes[0], 0, 4);
            ClearFormat.clear(document, divElement, 'P', null, 'ClearFormat');
            expect(document.querySelector('table').getAttribute('style')).toBe(null);
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
        let innervalue: string = '<p><span class="e-img-caption-container e-img-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-focus" alt="test.png" width="auto" height="auto" style="min-width: 0px; max-width: 871px; min-height: 0px;"><span class="e-img-caption-text" contenteditable="true"><strong><em><span id="test" style="text-decoration: underline;">Testing</span></em></strong></span></span></span> </p>'
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
            let node1: Node = document.querySelector('.e-img-caption-text #test').lastChild;
            domSelection.setSelectionText(document, node1, node1, 0, 7);
            ClearFormat.clear(document, node1, 'P');
            expect(document.querySelector('.e-img-caption-text').childElementCount === 0).toBe(true);
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

    describe('Bug 1003130: Clear Format Does Not Remove Inline Styles from Table Content specifically for tbody and tr tags', () => {
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
        it('clear format should remove the inline styles of tbody and tr tags', () => {
            divElement.innerHTML = `<p style="color: red; background: yellow;">First line</p>
        <table data-mc-module-version="2019-10-22" data-muid="65921ceb-990e-4437-838c-c7b8ba7a420d" width="100%" cellspacing="0" cellpadding="0" border="0" data-type="text" role="module" class="x_module e-rte-paste-table" style="font-style: normal; font-weight: 400; font-size: 16px; line-height: inherit; font-family: arial, helvetica, sans-serif; text-align: left; white-space: normal; table-layout: fixed;">
        <tbody style="background: aqua;">
            <tr style="height: 40%">
                <td role="module-content" bgcolor="#ffffff" valign="top" height="100%" style="padding: 18px 75px 12px;line-height: 22px;text-align: inherit;white-space: normal !important;background: grey;">
                    <p><br/></p>
                    <p style="color: red; background: yellow;">Thank you for choosing BoldDesk. We're happy to have you.</p>
                    <p><br/></p>
                </td>
            </tr>
            <tr style="height: 60%">
                <td role="module-content" bgcolor="#ffffff" valign="top" height="100%" style="padding: 0px 75px 4px;line-height: 22px;text-align: inherit;white-space: normal !important;background: grey;">
                    <p><br/></p>
                    <p style="color: red; background: yellow;">Please verify your email address to activate your BoldDesk account.</p>
                    <p><br/></p>
                </td>
            </tr>
        </tbody>
        </table>
        <p style="color: red; background: yellow;">Last line</p>`;
            new ClearFormat();
            let node1: Node = document.getElementById('divElement').childNodes[0];
            let node2: Node = document.getElementById('divElement').childNodes[4].lastChild;
            domSelection.setSelectionText(document, node1, node2, 0, node2.textContent.length);
            ClearFormat.clear(document, divElement, 'P');
            expect(document.getElementById('divElement').innerHTML === `<p>First line</p>\n        <table data-mc-module-version="2019-10-22" data-muid="65921ceb-990e-4437-838c-c7b8ba7a420d" width="100%" cellspacing="0" cellpadding="0" border="0" data-type="text" role="module" class="e-rte-paste-table">\n        <tbody>\n            <tr>\n                <td role="module-content" bgcolor="#ffffff" valign="top" height="100%">\n                    <p><br></p>\n                    <p>Thank you for choosing BoldDesk. We're happy to have you.</p>\n                    <p><br></p>\n                </td>\n            </tr>\n            <tr>\n                <td role="module-content" bgcolor="#ffffff" valign="top" height="100%">\n                    <p><br></p>\n                    <p>Please verify your email address to activate your BoldDesk account.</p>\n                    <p><br></p>\n                </td>\n            </tr>\n        </tbody>\n        </table>\n        <p>Last line</p>`).toBe(true);
        });
    });

    describe('Bug 978745: Clear Format Does Not Remove Inline Styles from Table Content', () => {
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
        it('Now, the Rich Text Editor works properly when using Clear Format to remove inline styles from table content', () => {
            divElement.innerHTML = `<p style="color: red; background: yellow;">First line</p>
        <table data-mc-module-version="2019-10-22" data-muid="65921ceb-990e-4437-838c-c7b8ba7a420d" width="100%" cellspacing="0" cellpadding="0" border="0" data-type="text" role="module" class="x_module e-rte-paste-table" style="font-style: normal; font-weight: 400; font-size: 16px; line-height: inherit; font-family: arial, helvetica, sans-serif; text-align: left; white-space: normal; table-layout: fixed;">
        <tbody>
            <tr>
                <td role="module-content" bgcolor="#ffffff" valign="top" height="100%" style="padding: 18px 75px 12px;line-height: 22px;text-align: inherit;white-space: normal !important;background: grey;">
                    <p><br/></p>
                    <p style="color: red; background: yellow;">Thank you for choosing BoldDesk. We're happy to have you.</p>
                    <p><br/></p>
                </td>
            </tr>
            <tr>
                <td role="module-content" bgcolor="#ffffff" valign="top" height="100%" style="padding: 0px 75px 4px;line-height: 22px;text-align: inherit;white-space: normal !important;background: grey;">
                    <p><br/></p>
                    <p style="color: red; background: yellow;">Please verify your email address to activate your BoldDesk account.</p>
                    <p><br/></p>
                </td>
            </tr>
        </tbody>
        </table>
        <p style="color: red; background: yellow;">Last line</p>`;
            new ClearFormat();
            let node1: Node = document.getElementById('divElement').childNodes[0];
            let node2: Node = document.getElementById('divElement').childNodes[4].lastChild;
            domSelection.setSelectionText(document, node1, node2, 0, node2.textContent.length);
            ClearFormat.clear(document, divElement, 'P');
            expect(document.getElementById('divElement').innerHTML === `<p>First line</p>\n        <table data-mc-module-version="2019-10-22" data-muid="65921ceb-990e-4437-838c-c7b8ba7a420d" width="100%" cellspacing="0" cellpadding="0" border="0" data-type="text" role="module" class="e-rte-paste-table">\n        <tbody>\n            <tr>\n                <td role="module-content" bgcolor="#ffffff" valign="top" height="100%">\n                    <p><br></p>\n                    <p>Thank you for choosing BoldDesk. We're happy to have you.</p>\n                    <p><br></p>\n                </td>\n            </tr>\n            <tr>\n                <td role="module-content" bgcolor="#ffffff" valign="top" height="100%">\n                    <p><br></p>\n                    <p>Please verify your email address to activate your BoldDesk account.</p>\n                    <p><br></p>\n                </td>\n            </tr>\n        </tbody>\n        </table>\n        <p>Last line</p>`).toBe(true);
        });
    });

describe('Bug 1020265: Clear Format Completely Converts Content to Plain Text without Preserving Hyperlinks in RichTextEditor', () => {
    let rteObj: RichTextEditor;
    let controlId: string;
    let rteElement: HTMLElement;
    const value = `<p><strong>Ticket</strong>: <a class="e-rte-anchor" href="https://support.syncfusion.com/agent/tickets/826956" title="https://support.syncfusion.com/agent/tickets/826956" target="_blank" aria-label="Open in new window">https://support.syncfusion.com/agent/tickets/826956</a></p>
<p><strong>Sample</strong>: <a class="e-rte-anchor" href="https://ej2.syncfusion.com/angular/demos/#/tailwind3/rich-text-editor/tools" title="https://ej2.syncfusion.com/angular/demos/#/tailwind3/rich-text-editor/tools" target="_blank" aria-label="Open in new window">https://ej2.syncfusion.com/angular/demos/#/tailwind3/rich-text-editor/tools</a></p>`;
    beforeAll(() => {
        rteObj = renderRTE({
            value: value,
            toolbarSettings: {
                items: ['Bold', 'ClearFormat', 'Formats', 'Alignments', 'Indent', 'Outdent', 'OrderedList', 'UnorderedList']
            }
        });
        controlId = rteObj.element.id;
        rteElement = rteObj.element;
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('Apply clearformat to the hyperlink and it should not remove', () => {
        rteObj.focusIn();
        rteObj.selectAll();
        const clearFormatButton = rteElement.querySelector(`#${controlId}_toolbar_ClearFormat`) as HTMLElement;
        let mouseEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
        clearFormatButton.dispatchEvent(mouseEvent);
        clearFormatButton.click();
        expect(rteObj.inputElement.innerHTML).toEqual('<p>Ticket: <a class="e-rte-anchor" href="https://support.syncfusion.com/agent/tickets/826956" title="https://support.syncfusion.com/agent/tickets/826956" target="_blank" aria-label="Open in new window">https://support.syncfusion.com/agent/tickets/826956</a></p><p>Sample: <a class="e-rte-anchor" href="https://ej2.syncfusion.com/angular/demos/#/tailwind3/rich-text-editor/tools" title="https://ej2.syncfusion.com/angular/demos/#/tailwind3/rich-text-editor/tools" target="_blank" aria-label="Open in new window">https://ej2.syncfusion.com/angular/demos/#/tailwind3/rich-text-editor/tools</a></p>');
    });
});

    describe('1030250: Script error occurs after clearing format on selected table cell', () => {
        let domSelection: NodeSelection = new NodeSelection();
        let rteObj: RichTextEditor;
        let controlId: string;
        let rteElement: HTMLElement;

        beforeEach(() => {
            rteObj = renderRTE({
                value: `<table class="e-rte-table"><thead><tr><th id="th1">Header</th></tr></thead><tbody><tr><td id="td1">Cell</td></tr></tbody></table>`,
                toolbarSettings: { items: ['ClearFormat'] }
            });
            controlId = rteObj.element.id;
            rteElement = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it('Selecting a table header and applying ClearFormat toolbar should convert th to td inside tbody tr', () => {
            rteObj.focusIn();
            let thTextNode: Node = document.getElementById('th1').childNodes[0];
            domSelection.setSelectionText(document, thTextNode, thTextNode, 0, thTextNode.textContent.length);
            const clearFormatButton = rteElement.querySelector(`#${controlId}_toolbar_ClearFormat`) as HTMLElement;
            let mouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            clearFormatButton.dispatchEvent(mouseEvent);
            clearFormatButton.click();
            expect(document.querySelector('tbody tr').children[0].nodeName.toLowerCase()).toBe('td');
            expect(document.querySelectorAll('th').length).toBe(0);
        });
    });
     describe('Bug 997309: ClearFormat doesnt work properly when the content includes an empty line in the RichTextEditor', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            let rteElement: HTMLElement;
            let domSelection: NodeSelection = new NodeSelection();
            const value = `<h1><br></h1><h1>Welcome to the Syncfusion Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p id='paragraph'><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%" class="e-rte-image e-img-inline"></p>`;
            beforeAll(() => {
                rteObj = renderRTE({
                    value: value,
                    toolbarSettings: {
                        items: ['Bold', 'ClearFormat', 'Formats', 'Alignments', 'Indent', 'Outdent', 'OrderedList', 'UnorderedList']
                    },
                    
                });
                controlId = rteObj.element.id;
                rteElement = rteObj.element;
            });
            afterAll(() => {
                destroy(rteObj);
            });
            it('When a text selection begins with a br tag, the clear formatting function is not working as expected.', (done) => {
                let endNode: HTMLElement = document.getElementById('paragraph');
                domSelection.setSelectionText(document, rteObj.inputElement.firstChild, endNode, 0, 1);
                const clearFormatButton = rteElement.querySelector(`#${controlId}_toolbar_ClearFormat`) as HTMLElement;
                let mouseEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
                clearFormatButton.dispatchEvent(mouseEvent);
                clearFormatButton.click();
                expect(rteObj.inputElement.innerHTML).toEqual('<p><br></p><p>Welcome to the Syncfusion Rich Text Editor</p><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><p>Do you know the key features of the editor?</p><p>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</p><p>Inline styles include bold, italic, underline, strikethrough, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.</p><p>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</p><p>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</p><p>Paste from MS Word - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</p><p>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</p><p>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</p><p>Unlock the Power of Tables</p><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table"><tr><th>S No<br></th><th>Name<br></th><th>Age<br></th><th>Gender<br></th><th>Occupation<br></th><th>Mode of Transport</th></tr><tbody><tr><td>1</td><td>Selma Rose</td><td>30</td><td>Female</td><td>Engineer<br></td><td>🚴</td></tr><tr><td>2</td><td>Robert<br></td><td>28</td><td>Male</td><td>Graphic Designer</td><td>🚗</td></tr><tr><td>3</td><td>William<br></td><td>35</td><td>Male</td><td>Teacher</td><td>🚗</td></tr><tr><td>4</td><td>Laura Grace<br></td><td>42</td><td>Female</td><td>Doctor</td><td>🚌</td></tr><tr><td>5</td><td>Andrew James<br></td><td>45</td><td>Male</td><td>Lawyer</td><td>🚕</td></tr></tbody></table><p>Elevating Your Content with Images</p><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them.</p><p>The Editor can integrate with the Syncfusion Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%" class="e-rte-image e-img-inline"></p>');
                done();
            });
        });

    describe('Bug 1053619: Clear Format splits the RTE content into multiple elements when the editor is rendered inside a li element', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        let rteElement: HTMLElement;
        let ulElement: HTMLUListElement;
        let liElement: HTMLLIElement;
        let originalConsoleError: { (...data: any[]): void; (...data: any[]): void; };
        let errorSpy: jasmine.Spy;
        beforeEach(() => {
            ulElement = document.createElement('ul');
            liElement = document.createElement('li');
            ulElement.appendChild(liElement);
            document.body.appendChild(ulElement);
            rteObj = renderRTE({
                value: '<p>sample test content</p>',
                toolbarSettings: { items: ['ClearFormat'] }
            });
            liElement.appendChild(rteObj.element);
            controlId = rteObj.element.id;
            rteElement = rteObj.element;
            originalConsoleError = console.error;
            errorSpy = jasmine.createSpy('error');
            console.error = errorSpy;
        });
        afterEach(() => {
            console.error = originalConsoleError;
            destroy(rteObj);
            detach(ulElement);
        });
        it('Clearing format on entire content when RTE is rendered inside a li should not throw console error and should preserve content structure', (done: DoneFn) => {
            rteObj.focusIn();
            setTimeout(() => {
                rteObj.selectAll();
                const clearFormatButton = rteElement.querySelector(`#${controlId}_toolbar_ClearFormat`) as HTMLElement;
                const mouseEvent: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
                clearFormatButton.dispatchEvent(mouseEvent);
                clearFormatButton.click();
                setTimeout(() => {
                    expect(errorSpy).not.toHaveBeenCalled();
                    expect(rteObj.inputElement.innerHTML).toBe('<p>sample test content</p>');
                    expect(liElement.querySelectorAll('.e-richtexteditor').length).toBe(1);
                    done();
                }, 100);
            }, 100);
        });
    });

}); // Do Not Add tests below this line.
