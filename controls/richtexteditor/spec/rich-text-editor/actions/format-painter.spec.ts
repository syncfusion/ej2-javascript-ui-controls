/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderRTE, destroy, setCursorPoint } from '../render.spec';
import { ActionBeginEventArgs, RichTextEditor } from '../../../src/rich-text-editor';
import { Button } from '@syncfusion/ej2-buttons';
import { createElement, detach } from '@syncfusion/ej2-base';


const copyKeyBoardEventArgs: any = {
    action: 'format-copy',
    shiftKey: true,
    ctrlKey: true,
    key: 'C',
    preventDefault: () => { }

};

const pasteKeyBoardEventArgs: any = {
    action: 'format-paste',
    shiftKey: true,
    ctrlKey: true,
    key: 'V',
    preventDefault: () => { }
};

const escapeKeyBoardEventArgs: any = {
    action: 'escape',
    shiftKey: false,
    ctrlKey: false,
    key: 'Escape',
    preventDefault: () => { }
};

const htmlToolbarClickArgs: any = {
    item: {
        subCommand: 'FormatPainter',
        command: 'FormatPainter'
    },
    originalEvent: {
        detail: 1,
        target: null
    },
    name: 'html-toolbar-click'
};
const editAreaClickArgs: any = {
    args: {
        which: 1,
        target: null
    },
    name: 'editAreaClick',
    member: 'editAreaClick'
};

describe('Format Painter Module', () => {

    describe('Click action and Double click action Cursor and Toolbar update test' , () => {
        let rteObject : RichTextEditor ;
        let toolbarELem: HTMLElement;
        const innerHTML: string = '<p>Getting started with format painter</p>';
        beforeEach( (done: Function) => {
            rteObject = renderRTE({
                toolbarSettings : { items: ['FormatPainter', 'ClearFormat', 'Undo', 'Redo', '|',
                    'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                    'SubScript', 'SuperScript', '|',
                    'LowerCase', 'UpperCase', '|',
                    'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                    'Indent', 'Outdent', '|',
                    'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                    'SourceCode', '|', 'ClearFormat', 'Print', 'InsertCode']
                } , value: innerHTML
            });
            toolbarELem = document.body.querySelector('.e-rte-format-painter');
            editAreaClickArgs.args.target = rteObject.element.querySelector('.e-content');
            done();
        });
        afterEach( () => {
            destroy(rteObject);

        });
        it('Should add cursor and activate toolbar after copy action and remove after paste action', (done: Function) => {
            rteObject.focusIn();
            htmlToolbarClickArgs.originalEvent.target = toolbarELem;
            rteObject.notify('html-toolbar-click', htmlToolbarClickArgs);
            setTimeout(() => {
                expect(rteObject.element.querySelector('.e-content').classList.contains('e-rte-cursor-brush')).toEqual(true);
                expect(toolbarELem.parentElement.parentElement.classList.contains('e-active')).toEqual(true);
                rteObject.notify('editAreaClick', editAreaClickArgs);
                expect(rteObject.element.querySelector('.e-content').classList.contains('e-rte-cursor-brush')).toEqual(false);
                expect(toolbarELem.parentElement.parentElement.classList.contains('e-active')).toEqual(false);
                done();
            }, 1000);
        });
        it('Should add cursor and activate toolbar after copy action , should not remove after paste action remove after escape action', (done: Function) => {
            rteObject.focusIn();
            htmlToolbarClickArgs.originalEvent.target = toolbarELem;
            htmlToolbarClickArgs.originalEvent.detail = 2;
            rteObject.notify('html-toolbar-click', htmlToolbarClickArgs);
            setTimeout(() => {
                expect(rteObject.element.querySelector('.e-content').classList.contains('e-rte-cursor-brush')).toEqual(true);
                expect(toolbarELem.parentElement.parentElement.classList.contains('e-active')).toEqual(true);
                rteObject.notify('editAreaClick', editAreaClickArgs);
                expect(rteObject.element.querySelector('.e-content').classList.contains('e-rte-cursor-brush')).toEqual(true);
                expect(toolbarELem.parentElement.parentElement.classList.contains('e-active')).toEqual(true);
                rteObject.notify('editAreaClick', editAreaClickArgs);
                expect(rteObject.element.querySelector('.e-content').classList.contains('e-rte-cursor-brush')).toEqual(true);
                expect(toolbarELem.parentElement.parentElement.classList.contains('e-active')).toEqual(true);
                rteObject.keyDown(pasteKeyBoardEventArgs);
                expect(rteObject.element.querySelector('.e-content').classList.contains('e-rte-cursor-brush')).toEqual(true);
                expect(toolbarELem.parentElement.parentElement.classList.contains('e-active')).toEqual(true);
                rteObject.keyDown(escapeKeyBoardEventArgs);
                expect(rteObject.element.querySelector('.e-content').classList.contains('e-rte-cursor-brush')).toEqual(false);
                expect(toolbarELem.parentElement.parentElement.classList.contains('e-active')).toEqual(false);
                done();
            }, 1000);
        });
    } );

    describe('Keyboard action' , () => {
        let rteObject : RichTextEditor ;
        let toolbarELem: HTMLElement;
        const innerHTML: string = '<p>Getting started with format painter</p>';
        beforeEach( (done: Function) => {
            rteObject = renderRTE({
                toolbarSettings : { items: ['FormatPainter', 'ClearFormat', 'Undo', 'Redo', '|',
                    'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                    'SubScript', 'SuperScript', '|',
                    'LowerCase', 'UpperCase', '|',
                    'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                    'Indent', 'Outdent', '|',
                    'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                    'SourceCode', '|', 'ClearFormat', 'Print', 'InsertCode']
                } , value: innerHTML
            });
            toolbarELem = document.body.querySelector('.e-rte-format-painter');
            done();
        });
        afterEach( () => {
            destroy(rteObject);
        });
        it('Check for the toolbar update and cursor update after Format Copy action', (done: Function) => {
            rteObject.focusIn();
            rteObject.keyDown(copyKeyBoardEventArgs);
            expect(rteObject.element.querySelector('.e-content').classList.contains('e-rte-cursor-brush')).toEqual(false);
            expect(toolbarELem.parentElement.parentElement.classList.contains('e-active')).toEqual(true);
            done();
        });
        it('Check for the toolbar update and cursor update after Format paste action', (done: Function) => {
            rteObject.focusIn();
            rteObject.keyDown(pasteKeyBoardEventArgs);
            expect(rteObject.element.querySelector('.e-content').classList.contains('e-rte-cursor-brush')).toEqual(false);
            expect(toolbarELem.parentElement.parentElement.classList.contains('e-active')).toEqual(true);
            done();
        });
        it('Check for the toolbar update and cursor update after Escape', (done: Function) => {
            rteObject.focusIn();
            rteObject.keyDown(copyKeyBoardEventArgs);
            expect(rteObject.element.querySelector('.e-content').classList.contains('e-rte-cursor-brush')).toEqual(false);
            expect(toolbarELem.parentElement.parentElement.classList.contains('e-active')).toEqual(true);
            rteObject.keyDown(escapeKeyBoardEventArgs);
            expect(rteObject.element.querySelector('.e-content').classList.contains('e-rte-cursor-brush')).toEqual(false);
            expect(toolbarELem.parentElement.parentElement.classList.contains('e-active')).toEqual(false);
            done();
        });
    } );

    describe('Basic Functionality testing' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = `<h2 class ='goalformatnode'>Getting started with format painter</h2>
                                    <p>Convert this P Node to UL node</p>
                                    <p class ='sourceParent'>
                                        <strong><em class ='sourceformatnode'>Copy this format</em></strong>
                                    </p>
                                    <ul>
                                    <li>This is Heading 2 Node</li>
                                    </ul>`;
        beforeEach( (done: Function) => {
            rteObject = renderRTE({
                toolbarSettings : { items: ['FormatPainter', 'ClearFormat', 'Undo', 'Redo', '|',
                    'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                    'SubScript', 'SuperScript', '|',
                    'LowerCase', 'UpperCase', '|',
                    'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                    'Indent', 'Outdent', '|',
                    'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                    'SourceCode', '|', 'ClearFormat', 'Print', 'InsertCode']
                } , value: innerHTML
            });
            done();
        });
        afterEach( () => {
            destroy(rteObject);
        });
        it('Tests for painting inline format from P element to H2 element Case 1: With selection, Should only paste inline styles', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 16);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode');
            range.setStart(startElement.firstChild, 8);
            range.setEnd(startElement.firstChild, 20);
            rteObject.selectRange(range);
            expect(startElement.querySelectorAll('strong').length).toEqual(0);
            expect(startElement.querySelectorAll('em').length).toEqual(0);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceParent');
            expect(startElement.querySelectorAll('strong').length).toEqual(1);
            expect(startElement.querySelectorAll('em').length).toEqual(1);
            done();
        });
        it('Tests for painting inline fornmat and block format from P element to H2 element Case 2: With full node selected, Should paste inline styles and block level styles', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 16);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 35);
            rteObject.selectRange(range);
            expect(startElement.nodeName).toEqual('H2');
            expect(startElement.querySelectorAll('strong').length).toEqual(0);
            expect(startElement.querySelectorAll('em').length).toEqual(0);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceParent');
            expect(startElement.nodeName).toEqual('P');
            expect(startElement.querySelectorAll('strong').length).toEqual(1);
            expect(startElement.querySelectorAll('em').length).toEqual(1);
            done();
        });
        it('Tests for painting inline fornmat and block format from P element to H2 element Case 3: Multiple node selected, Should paste inline styles and block level styles', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 16);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.nextElementSibling.firstChild, 30);
            rteObject.selectRange(range);
            expect(startElement.nodeName).toEqual('H2');
            expect(startElement.nextElementSibling.className).toEqual('');
            expect(startElement.querySelectorAll('strong').length).toEqual(0);
            expect(startElement.querySelectorAll('em').length).toEqual(0);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceParent');
            expect(startElement.nodeName).toEqual('P');
            expect(startElement.nextElementSibling.className).toEqual('sourceParent');
            expect(startElement.querySelectorAll('strong').length).toEqual(1);
            expect(startElement.querySelectorAll('em').length).toEqual(1);
            done();
        });
        it('Tests for painting inline fornmat and block format from P element to H2 element Case 4: Range collapsed, Should paste inline styles only cursor word and block level styles', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 16);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode');
            setCursorPoint(startElement.firstChild as Element, 9);
            expect(startElement.nodeName).toEqual('H2');
            expect(startElement.querySelectorAll('strong').length).toEqual(0);
            expect(startElement.querySelectorAll('em').length).toEqual(0);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceParent');
            expect(startElement.nodeName).toEqual('P');
            expect(startElement.querySelectorAll('strong').length).toEqual(1);
            expect(startElement.querySelectorAll('em').length).toEqual(1);
            expect(startElement.querySelectorAll('em')[0].textContent).toEqual(' started');
            expect(startElement.querySelectorAll('strong')[0].textContent).toEqual(' started');
            done();
        });
    });

    describe('Clear Format Testing' , () => {
        let rteObject : RichTextEditor ;
        let toolbarELem: HTMLElement;
        const innerHTML: string = `<p class ='goalformatnode'>Getting<strong>started </strong>  with format painter</p>
                                    <p>Convert this P Node to UL node</p>
                                    <p class ='sourceParent'>
                                        <strong><em class ='sourceformatnode'>Copy this format</em></strong>
                                    </p>
                                    <ul>
                                    <li>This is Heading 2 Node</li>
                                    </ul>`;
        beforeEach( (done: Function) => {
            rteObject = renderRTE({
                toolbarSettings : { items: ['FormatPainter', 'ClearFormat', 'Undo', 'Redo', '|',
                    'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                    'SubScript', 'SuperScript', '|',
                    'LowerCase', 'UpperCase', '|',
                    'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                    'Indent', 'Outdent', '|',
                    'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                    'SourceCode', '|', 'ClearFormat', 'Print', 'InsertCode']
                } , value: innerHTML
            });
            toolbarELem = document.body.querySelector('.e-rte-format-painter');
            done();
        });
        afterEach( () => {
            destroy(rteObject);
        });
        it(' with focus outside rte and click the toolbar button, should remove the strong inline styles', (done: Function) => {
            toolbarELem.click();
            let startElement = rteObject.inputElement.querySelector('.goalformatnode');
            setCursorPoint(startElement.firstElementChild.firstChild as Element, 2);
            expect(startElement.querySelectorAll('strong').length).toEqual(1);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode');
            expect(startElement.querySelectorAll('strong').length).toEqual(0);
            done();
        });
    });

    describe('List use case Testing, Copying from one UL and painting to p node' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = `<p class='firstParaNode'>Getting started first node</p>
        <p class='secondParaNode'>Getting started first node</p>
        <ul class = 'sourceParent'>
            <li class = 'sourceformatnode'>This is Heading 2 Node</li>
        </ul>
        <p class='lastParaNode'>Getting started first node</p> 
        `;
        beforeEach( (done: Function) => {
            rteObject = renderRTE({
                toolbarSettings : { items: ['FormatPainter', 'ClearFormat', 'Undo', 'Redo', '|',
                    'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                    'SubScript', 'SuperScript', '|',
                    'LowerCase', 'UpperCase', '|',
                    'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                    'Indent', 'Outdent', '|',
                    'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                    'SourceCode', '|', 'ClearFormat', 'Print', 'InsertCode']
                } , value: innerHTML
            });
            done();
        });
        afterEach( () => {
            destroy(rteObject);
        });
        it('should create one li and ul when one node is painted', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 22);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.secondParaNode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 26);
            rteObject.selectRange(range);
            expect(startElement.nodeName).toEqual('P');
            expect(startElement.querySelectorAll('li').length).toEqual(0);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceParent');
            expect(startElement.nodeName).toEqual('UL');
            expect(startElement.querySelectorAll('li').length).toEqual(1);
            done();
        });
        it('should create multiple li and ul when more than one node is painted', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 22);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.firstParaNode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.nextElementSibling.firstChild, 26);
            rteObject.selectRange(range);
            expect(startElement.nodeName).toEqual('P');
            expect(startElement.querySelectorAll('li').length).toEqual(0);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceParent');
            expect(startElement.nodeName).toEqual('UL');
            expect(startElement.querySelectorAll('li').length).toEqual(2);
            done();
        });
        it('should create one li and ul when p node is at start', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 22);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.firstParaNode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 26);
            rteObject.selectRange(range);
            expect(startElement.nodeName).toEqual('P');
            expect(startElement.querySelectorAll('li').length).toEqual(0);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceParent');
            expect(startElement.nodeName).toEqual('UL');
            expect(startElement.querySelectorAll('li').length).toEqual(1);
            expect(startElement.previousElementSibling).toEqual(null);
            done();
        });
        it('should create one li and ul when p node is at end', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 22);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.lastParaNode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 26);
            rteObject.selectRange(range);
            expect(startElement.nodeName).toEqual('P');
            expect(startElement.querySelectorAll('li').length).toEqual(0);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelectorAll('.sourceParent')[1];
            expect(startElement.nodeName).toEqual('UL');
            expect(startElement.querySelectorAll('li').length).toEqual(1);
            expect(startElement.nextElementSibling).toEqual(null);
            done();
        });
    });

    describe('List use case Testing, Copying from one UL and painting to OL node' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = ` <ol class = 'firstOrderList'>
                                        <li class = 'firstOrderListNode'>This is List 1 Node</li>
                                        <li class = 'firstOrderListNode'>This is List 2 Node</li>
                                        <li class = 'firstOrderListNode'>This is List 3 Node</li>
                                    </ol>
                                    <ul class = 'sourceParent'>
                                        <li class = 'sourceformatnode'>This is Heading 2 Node</li>
                                    </ul>
                                    <p class='lastParaNode'>Getting started first node</p> 
                                    <ol class = 'lastOrderList'>
                                        <li class = 'lastOrderListNode'>This is List 1 Node</li>
                                    </ol>
        `;
        beforeEach( (done: Function) => {
            rteObject = renderRTE({
                toolbarSettings : { items: ['FormatPainter', 'ClearFormat', 'Undo', 'Redo', '|',
                    'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                    'SubScript', 'SuperScript', '|',
                    'LowerCase', 'UpperCase', '|',
                    'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                    'Indent', 'Outdent', '|',
                    'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                    'SourceCode', '|', 'ClearFormat', 'Print', 'InsertCode']
                } , value: innerHTML
            });
            done();
        });
        afterEach( () => {
            destroy(rteObject);
        });
        it('should split ol and create a new ul Case 1 Middle list', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 22);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelectorAll('.firstOrderListNode')[1];
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 19);
            rteObject.selectRange(range);
            expect(startElement.parentElement.nodeName).toEqual('OL');
            expect(rteObject.inputElement.querySelectorAll('ul').length).toEqual(1);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            expect(startElement.parentElement.nodeName).toEqual('UL');
            expect(startElement.parentElement.querySelectorAll('li').length).toEqual(1);
            expect(rteObject.inputElement.querySelectorAll('ul').length).toEqual(2);
            done();
        });
        it('should split ol and create a new ul Case 1 Middle list items', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 22);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelectorAll('.firstOrderListNode')[0];
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.nextElementSibling.nextElementSibling.firstChild, 19);
            rteObject.selectRange(range);
            expect(startElement.parentElement.nodeName).toEqual('OL');
            expect(rteObject.inputElement.querySelectorAll('ul').length).toEqual(1);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            expect(startElement.parentElement.nodeName).toEqual('UL');
            expect(startElement.parentElement.querySelectorAll('li').length).toEqual(3);
            expect(rteObject.inputElement.querySelectorAll('ul').length).toEqual(2);
            done();
        });
        it('should create one li and ul when p node is at start', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 22);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelectorAll('.firstOrderListNode')[0];
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 19);
            rteObject.selectRange(range);
            expect(startElement.parentElement.nodeName).toEqual('OL');
            expect(rteObject.inputElement.querySelectorAll('ul').length).toEqual(1);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            expect(startElement.parentElement.nodeName).toEqual('UL');
            expect(startElement.parentElement.querySelectorAll('li').length).toEqual(1);
            expect(rteObject.inputElement.querySelectorAll('ul').length).toEqual(2);
            expect(startElement.previousElementSibling).toBeNull();
            done();
        });
        it('should create one li and ul when p node is at end', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 22);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelectorAll('.lastOrderListNode')[0];
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 19);
            rteObject.selectRange(range);
            expect(startElement.parentElement.nodeName).toEqual('OL');
            expect(rteObject.inputElement.querySelectorAll('ul').length).toEqual(1);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelectorAll('.sourceformatnode')[1];
            expect(startElement.parentElement.nodeName).toEqual('UL');
            expect(startElement.parentElement.querySelectorAll('li').length).toEqual(1);
            expect(rteObject.inputElement.querySelectorAll('ul').length).toEqual(2);
            expect(startElement.nextElementSibling).toBeNull();
            done();
        });
    });

    describe('Format Painter Setting testing' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = `<h1 class="title">Format Painter</h1>
        <p>The <span class="e-text-red e-rte-text-red" style="color:brown; font-weight: 800;" data-main="brown text" title="This is a red text"><strong>Format Painter</strong></span>
        is a tool that allows you to <em class="e-rte-em" title="This is a color">copy</em> the <strong class="e-text-red-bg" style="background-color: rgb(255, 0, 0);">formatting </strong> 
        of one element and apply it to another element.
        </p>`;
        beforeEach( (done: Function) => {
            rteObject = renderRTE({
                toolbarSettings : { items: ['FormatPainter', 'ClearFormat', 'Undo', 'Redo', '|',
                    'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                    'SubScript', 'SuperScript', '|',
                    'LowerCase', 'UpperCase', '|',
                    'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                    'Indent', 'Outdent', '|',
                    'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                    'SourceCode', '|', 'ClearFormat', 'Print', 'InsertCode']
                } , value: innerHTML , formatPainterSettings:{
                    allowedContext: ['Text'],
                    deniedFormats: 'span(e-bigger,e-text-red)[title,data-main]{color,background-color}; strong{background-color}; em[title]; p{background-color}(e-rte-text)[title];'
                }
            });
            done();
        });
        afterEach( () => {
            destroy(rteObject);
        });
        it('Denied Format Testing Content 1 Should remove only the value in deniedFormats', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.e-rte-text-red');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.title');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 6);
            rteObject.selectRange(range);
            expect(startElement.querySelectorAll('span').length).toEqual(0);
            expect(startElement.querySelectorAll('strong').length).toEqual(0);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.e-rte-text-red');
            expect(startElement.parentElement.nodeName).toEqual('H1');
            expect(startElement.className).toEqual('e-rte-text-red');
            expect((startElement as HTMLElement).style.color).toEqual('');
            expect((startElement as HTMLElement).style.fontWeight).toEqual('800');
            expect(startElement.getAttribute('title')).toEqual(null);
            expect(startElement.getAttribute('data-main')).toEqual(null);
            done();
        });
        it('Denied Format Testing Content 2 Should remove only the value in deniedFormats', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.e-rte-em');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 4);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.title');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 6);
            rteObject.selectRange(range);
            expect(startElement.querySelectorAll('span').length).toEqual(0);
            expect(startElement.querySelectorAll('strong').length).toEqual(0);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.e-rte-em');
            expect(startElement.parentElement.nodeName).toEqual('H1');
            expect(startElement.className).toEqual('e-rte-em');
            expect(startElement.getAttribute('title')).toEqual(null);
            done();
        });
        it('Denied Format Testing Content 3 Should remove only the value in deniedFormats', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.e-text-red-bg');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 4);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.title');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 6);
            rteObject.selectRange(range);
            expect(startElement.querySelectorAll('span').length).toEqual(0);
            expect(startElement.querySelectorAll('strong').length).toEqual(0);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.e-text-red-bg');
            expect(startElement.parentElement.nodeName).toEqual('H1');
            expect(startElement.className).toEqual('e-text-red-bg');
            expect((startElement as HTMLElement).style.backgroundColor).toEqual('');
            done();
        });
    });

    describe('Action Beginv eent testing' , () => {
        let rteObject : RichTextEditor ;
        let toolbarELem: HTMLElement;
        let isCopytriggered: boolean = false;
        let isPasteTriggered: boolean = false;
        let isEscapeTriggered: boolean = false;
        const innerHTML: string = '<p>Getting started with format painter</p>';
        beforeEach( (done: Function) => {
            rteObject = renderRTE({
                toolbarSettings : { items: ['FormatPainter', 'ClearFormat', 'Undo', 'Redo', '|',
                    'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                    'SubScript', 'SuperScript', '|',
                    'LowerCase', 'UpperCase', '|',
                    'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                    'Indent', 'Outdent', '|',
                    'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                    'SourceCode', '|', 'ClearFormat', 'Print', 'InsertCode']
                } , value: innerHTML, actionBegin: actionBegin
            });
            // eslint-disable-next-line jsdoc/require-jsdoc
            function actionBegin(args: ActionBeginEventArgs): void {
                if (args.requestType === 'FormatPainter') {
                    switch(args.selectType) {
                    case 'format-copy':
                        isCopytriggered = true;
                        break;
                    case 'format-paste':
                        isPasteTriggered = true;
                        break;
                    case 'escape':
                        isEscapeTriggered = true;
                        break;
                    }
                }
            }
            toolbarELem = document.body.querySelector('.e-rte-format-painter');
            done();
        });
        afterEach( () => {
            destroy(rteObject);
        });
        it('Action Begin event testing Case 1 Format Copy', (done: Function) => {
            toolbarELem.click();
            expect(isCopytriggered).toBe(true);
            done();
        });
        it('Action Begin event testing Case 2 Format Paste', (done: Function) => {
            toolbarELem.click();
            rteObject.notify('editAreaClick', { args: { target: rteObject.inputElement.querySelector('p') } });
            expect(isPasteTriggered).toBe(true);
            done();
        });
        it('Action Begin event testing Case 3 Format Clear', (done: Function) => {
            toolbarELem.click();
            rteObject.inputElement.querySelector('p').click();
            rteObject.keyDown(escapeKeyBoardEventArgs);
            expect(isEscapeTriggered).toBe(true);
            done();
        });
        it('Action Begin event testing Case 4 Keyboard', (done: Function) => {
            rteObject.keyDown(copyKeyBoardEventArgs);
            expect(isCopytriggered).toBe(true);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            expect(isPasteTriggered).toBe(true);
            rteObject.keyDown(escapeKeyBoardEventArgs);
            expect(isEscapeTriggered).toBe(true);
            done();
        });
    });
    describe('Execute command testing' , () => {
        let rteObject : RichTextEditor ;
        let copyButton: Button;
        let pasteButton: Button;
        let escapeButton: Button;
        let buttonWrapper: HTMLElement;
        const innerHTML: string = ` <h2 class ='goalformatnode'>Getting started with format painter</h2>
                                    <p>Convert this P Node to UL node</p>
                                    <p class ='sourceParent'>
                                        <strong><em class ='sourceformatnode'>Copy this format</em></strong>
                                    </p>
                                    <ul>
                                    <li>This is Heading 2 Node</li>
                                    </ul>`;
        beforeEach( () => {
            rteObject = renderRTE({
                toolbarSettings : { items: ['ClearFormat', 'Undo', 'Redo', '|',
                    'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                    'SubScript', 'SuperScript', '|',
                    'LowerCase', 'UpperCase', '|',
                    'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                    'Indent', 'Outdent', '|',
                    'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                    'SourceCode', '|', 'ClearFormat', 'Print', 'InsertCode']
                } , value: innerHTML
            });
            copyButton = new Button({
                iconCss: 'e-icons e-copy', isPrimary: true
            });
            pasteButton = new Button({
                iconCss: 'e-icons e-paste', isPrimary: true
            });
            escapeButton = new Button({
                iconCss: 'e-icons e-remove', isPrimary: true
            });
            buttonWrapper = createElement('div');
            buttonWrapper.innerHTML = ` <button id="btn1">Copy</button>
                                        <button id="btn2">Paste</button>
                                        <button id="btn3">Escape</button>`;
            document.body.append(buttonWrapper);
            copyButton.appendTo('#btn1');
            pasteButton.appendTo('#btn2');
            escapeButton.appendTo('#btn3');
            document.getElementById('btn1').onclick  = () => {
                rteObject.executeCommand('copyFormatPainter',null);
            };
            document.getElementById('btn2').onclick   = () => {
                rteObject.executeCommand('applyFormatPainter',null, {undo: true});
            };
            document.getElementById('btn3').onclick   = () => {
                rteObject.executeCommand('escapeFormatPainter',null);
            };
        });
        afterEach( () => {
            destroy(rteObject);
            copyButton.destroy();
            pasteButton.destroy();
            escapeButton.destroy();
            detach(buttonWrapper);
        });
        it( 'Test for Copy, paste, escape action with Execute Command', () => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 16);
            rteObject.selectRange(range);
            (document.body.querySelector('#btn1') as HTMLElement).click();
            startElement = rteObject.inputElement.querySelector('.goalformatnode');
            range.setStart(startElement.firstChild, 8);
            range.setEnd(startElement.firstChild, 20);
            rteObject.selectRange(range);
            expect(startElement.querySelectorAll('strong').length).toEqual(0);
            expect(startElement.querySelectorAll('em').length).toEqual(0);
            (document.body.querySelector('#btn2') as HTMLElement).click();
            startElement = rteObject.inputElement.querySelector('.sourceParent');
            expect(startElement.querySelectorAll('strong').length).toEqual(1);
            expect(startElement.querySelectorAll('em').length).toEqual(1);
            startElement = rteObject.inputElement.querySelectorAll('.sourceformatnode')[1];
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 12);
            rteObject.selectRange(range);
            (document.body.querySelector('#btn3') as HTMLElement).click();
            expect(startElement.querySelectorAll('strong').length).toEqual(0);
            expect(startElement.querySelectorAll('em').length).toEqual(0);
            (document.body.querySelector('#btn2') as HTMLElement).click();
            expect(startElement.querySelectorAll('strong').length).toEqual(0);
            expect(startElement.querySelectorAll('em').length).toEqual(0);
        });
    } );

    describe('Format Painter testing with undo redo', () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = '<p>Getting started with format painter</p>';
        beforeEach( (done: Function) => {
            rteObject = renderRTE({
                toolbarSettings : { items: ['FormatPainter', 'ClearFormat', 'Undo', 'Redo', '|',
                    'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                    'SubScript', 'SuperScript', '|',
                    'LowerCase', 'UpperCase', '|',
                    'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                    'Indent', 'Outdent', '|',
                    'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                    'SourceCode', '|', 'ClearFormat', 'Print', 'InsertCode']
                } , value: innerHTML
            });
            done();
        });
        afterEach( () => {
            destroy(rteObject);
        });
        it('Check for the undo after Format Copy action', (done: Function) => {
            rteObject.focusIn();
            rteObject.keyDown(copyKeyBoardEventArgs);
            expect(rteObject.element.querySelector('.e-undo').parentElement.parentElement.classList.contains('e-overlay')).toEqual(true);
            expect(rteObject.element.querySelector('.e-redo').parentElement.parentElement.classList.contains('e-overlay')).toEqual(true);
            done();
        });
        it('Check for the undo after Format paste action', (done: Function) => {
            rteObject.focusIn();
            rteObject.keyDown(copyKeyBoardEventArgs);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            expect(rteObject.element.querySelector('.e-undo').parentElement.parentElement.classList.contains('e-overlay')).toEqual(false);
            expect(rteObject.element.querySelector('.e-redo').parentElement.parentElement.classList.contains('e-overlay')).toEqual(true);
            done();
        });
        it('Check for the redo after Format paste action and undo action', (done: Function) => {
            rteObject.focusIn();
            rteObject.keyDown(copyKeyBoardEventArgs);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            expect(rteObject.element.querySelector('.e-undo').parentElement.parentElement.classList.contains('e-overlay')).toEqual(false);
            expect(rteObject.element.querySelector('.e-redo').parentElement.parentElement.classList.contains('e-overlay')).toEqual(true);
            rteObject.element.querySelector('.e-undo').parentElement.parentElement.click();
            expect(rteObject.element.querySelector('.e-undo').parentElement.parentElement.classList.contains('e-overlay')).toEqual(true);
            expect(rteObject.element.querySelector('.e-redo').parentElement.parentElement.classList.contains('e-overlay')).toEqual(false);
            done();
        });
    } );

    describe('Format Painter Painting inline styles to block node of type one other', () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = `<h2 class ='sourceParent'><span style="font-family: Tahoma, Geneva, sans-serif;">
                                    <span style="color: rgb(68, 114, 196); text-decoration: inherit;">
                                    <span style="background-color: rgb(204, 255, 255);">
                                        <b><u class = "sourceformatnode">FORMAT PAINTER:</u></b>
                                    </span></span></span>
                                    </h2>
                                    <blockquote class='goalParent' ><span style="font-size: 18pt;"><span style="background-color: rgb(217, 217, 217);">
                                    <span style="color: rgb(31, 55, 99); text-decoration: inherit;"><strong class = "goalformatnode"style="background-color: rgb(217, 217, 217);">
                                    "Put your heart, mind, intellect, and soul even to your smallest acts. This is the secret of success." - 
                                    - Swami Sivananda</strong></span></span></span>
                                    </blockquote>`;
        beforeEach( (done: Function) => {
            rteObject = renderRTE({
                toolbarSettings : { items: ['FormatPainter', 'ClearFormat', 'Undo', 'Redo', '|',
                    'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                    'SubScript', 'SuperScript', '|',
                    'LowerCase', 'UpperCase', '|',
                    'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                    'Indent', 'Outdent', '|',
                    'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                    'SourceCode', '|', 'ClearFormat', 'Print', 'InsertCode']
                } , value: innerHTML
            });
            done();
        });
        afterEach( () => {
            destroy(rteObject);
        });
        it('Tests for painting inline format from H2 element to Blockquote element Case 1: With selection', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 15);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 96);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalParent');
            const content: string = '<span style="font-family: Tahoma, Geneva, sans-serif;"><span style="color: rgb(68, 114, 196); text-decoration: inherit;"><span style="background-color: rgb(204, 255, 255);"><b><u class="sourceformatnode">                                     "Put your heart, mind, intellect, and soul even to your sma</u></b></span></span></span><span style="font-size: 18pt;"><span style="background-color: rgb(217, 217, 217);"><span style="color: rgb(31, 55, 99); text-decoration: inherit;"><strong class="goalformatnode" style="background-color: rgb(217, 217, 217);">llest acts. This is the secret of success." - \n                                    - Swami Sivananda</strong></span></span></span>';
            expect(startElement.innerHTML).toEqual(content);
            expect(startElement.nodeName).toEqual('BLOCKQUOTE');
            expect(startElement.className).toEqual('goalParent');
            done();
        });
        it('Tests for painting inline fornmat and block format from P element to H2 element Case 2: With full node selected', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 15);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, startElement.firstChild.textContent.length);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelectorAll('.sourceParent')[1];
            const content: string = '<span style="background-color: rgb(217, 217, 217);">\n                                    <span style="color: rgb(31, 55, 99); text-decoration: inherit;"><strong class="goalformatnode" style="background-color: rgb(217, 217, 217);"><span style="font-family: Tahoma, Geneva, sans-serif;"><span style="color: rgb(68, 114, 196); text-decoration: inherit;"><span style="background-color: rgb(204, 255, 255);"><b><u class="sourceformatnode">                                     "Put your heart, mind, intellect, and soul even to your smallest acts. This is the secret of success." -                                      - Swami Sivananda</u></b></span></span></span></strong></span></span>\n                                    ';
            expect(startElement.innerHTML).toEqual(content);
            expect(startElement.nodeName).toEqual('H2');
            expect(startElement.className).toEqual('sourceParent');
            done();
        });
        it('Tests for painting inline fornmat and block format from P element to H2 element Case 4: Range collapsed', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 15);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode');
            setCursorPoint(startElement.firstChild as Element, 90);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelectorAll('.sourceformatnode')[1];
            expect(startElement.innerHTML).toEqual(' your');
            startElement = rteObject.inputElement.querySelectorAll('.sourceParent')[1];
            const content: string = '<span style="font-size: 18pt;"><span style="background-color: rgb(217, 217, 217);">\n                                    <span style="color: rgb(31, 55, 99); text-decoration: inherit;"><strong class="goalformatnode" style="background-color: rgb(217, 217, 217);">\n                                    "Put your heart, mind, intellect, and soul even to</strong></span></span></span><span style="font-family: Tahoma, Geneva, sans-serif;"><span style="color: rgb(68, 114, 196); text-decoration: inherit;"><span style="background-color: rgb(204, 255, 255);"><b><u class="sourceformatnode"> your</u></b></span></span></span><span style="font-size: 18pt;"><span style="background-color: rgb(217, 217, 217);"><span style="color: rgb(31, 55, 99); text-decoration: inherit;"><strong class="goalformatnode" style="background-color: rgb(217, 217, 217);"> smallest acts. This is the secret of success." - \n                                    - Swami Sivananda</strong></span></span></span>';
            expect(startElement.nodeName).toEqual('H2');
            expect(startElement.className).toEqual('sourceParent');
            expect(startElement.innerHTML).toEqual(content);
            done();
        });
    });
    describe('Basic Functionality testing' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = ` <h2 class ='goalformatnode1'>Getting started with format painter</h2>
                                    <h2 class ='goalformatnode2'>Getting started with format painter</h2>
                                    <h2 class ='goalformatnode3'>Getting started with format painter</h2>
                                    <h2 class ='goalformatnode4'>Getting started with format painter</h2>
                                    <p>Convert this P Node to UL node</p>
                                    <p class ='sourceParent'>
                                        <strong><em class ='sourceformatnode'>Copy this format</em></strong>
                                    </p>
                                    <ul>
                                    <li>This is Heading 2 Node</li>
                                    </ul>`;
        beforeEach( (done: Function) => {
            rteObject = renderRTE({
                toolbarSettings : { items: ['FormatPainter', 'ClearFormat', 'Undo', 'Redo', '|',
                    'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                    'SubScript', 'SuperScript', '|',
                    'LowerCase', 'UpperCase', '|',
                    'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                    'Indent', 'Outdent', '|',
                    'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                    'SourceCode', '|', 'ClearFormat', 'Print', 'InsertCode']
                } , value: innerHTML
            });
            done();
        });
        afterEach( () => {
            destroy(rteObject);
        });
        it('Tests for painting inline format from P element to H2 element Case 1: With selection, Should only paste inline styles', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 16);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode1');
            range.setStart(startElement.firstChild, 8);
            range.setEnd(startElement.firstChild, 20);
            rteObject.selectRange(range);
            expect(startElement.querySelectorAll('strong').length).toEqual(0);
            expect(startElement.querySelectorAll('em').length).toEqual(0);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceParent');
            expect(startElement.querySelectorAll('strong').length).toEqual(1);
            expect(startElement.querySelectorAll('em').length).toEqual(1);
            startElement = rteObject.inputElement.querySelector('.goalformatnode2');
            range.setStart(startElement.firstChild, 8);
            range.setEnd(startElement.firstChild, 20);
            rteObject.selectRange(range);
            expect(startElement.querySelectorAll('strong').length).toEqual(0);
            expect(startElement.querySelectorAll('em').length).toEqual(0);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceParent');
            expect(startElement.querySelectorAll('strong').length).toEqual(1);
            expect(startElement.querySelectorAll('em').length).toEqual(1);
            startElement = rteObject.inputElement.querySelector('.goalformatnode3');
            range.setStart(startElement.firstChild, 8);
            range.setEnd(startElement.firstChild, 20);
            rteObject.selectRange(range);
            expect(startElement.querySelectorAll('strong').length).toEqual(0);
            expect(startElement.querySelectorAll('em').length).toEqual(0);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceParent');
            expect(startElement.querySelectorAll('strong').length).toEqual(1);
            expect(startElement.querySelectorAll('em').length).toEqual(1);
            startElement = rteObject.inputElement.querySelector('.goalformatnode4');
            range.setStart(startElement.firstChild, 8);
            range.setEnd(startElement.firstChild, 20);
            rteObject.selectRange(range);
            expect(startElement.querySelectorAll('strong').length).toEqual(0);
            expect(startElement.querySelectorAll('em').length).toEqual(0);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceParent');
            expect(startElement.querySelectorAll('strong').length).toEqual(1);
            expect(startElement.querySelectorAll('em').length).toEqual(1);
            done();
        });
    });
});
