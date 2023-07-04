/* eslint-disable quotes */
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
    ctrlkey: false,
    shiftKey: true,
    altKey: true,
    key: 'C',
    preventDefault: () => { },
    stopPropagation: () => { },
    type: 'keydown'

};

const pasteKeyBoardEventArgs: any = {
    action: 'format-paste',
    ctrlkey: false,
    shiftKey: true,
    altKey: true,
    key: 'V',
    preventDefault: () => { },
    stopPropagation: () => { },
    type: 'keydown'
};

const escapeKeyBoardEventArgs: any = {
    action: 'escape',
    shiftKey: false,
    ctrlKey: false,
    key: 'Escape',
    preventDefault: () => { },
    stopPropagation: () => { },
    type: 'keydown'
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
        it('Should disable sticky mode on click of format painter toolbar', (done: Function) => {
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
                htmlToolbarClickArgs.originalEvent.target = toolbarELem;
                htmlToolbarClickArgs.originalEvent.detail = 1;
                rteObject.notify('html-toolbar-click', htmlToolbarClickArgs);
                setTimeout(() => {
                    expect(rteObject.element.querySelector('.e-content').classList.contains('e-rte-cursor-brush')).toEqual(false);
                    expect(toolbarELem.parentElement.parentElement.classList.contains('e-active')).toEqual(false);
                    done();
                }, 500);
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
            expect(startElement.querySelectorAll('li').length).toEqual(2);
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
            startElement = rteObject.inputElement.querySelectorAll('.sourceParent')[0];
            expect(startElement.nodeName).toEqual('UL');
            expect(startElement.querySelectorAll('li').length).toEqual(2);
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

    describe('Action Begin event testing' , () => {
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
            // Bug 830340: Format Painter redo action not working properly
            expect(rteObject.element.querySelector('.e-redo').parentElement.parentElement.classList.contains('e-overlay')).toEqual(false);
            expect(rteObject.element.querySelector('.e-undo').parentElement.parentElement.classList.contains('e-overlay')).toEqual(true);
            rteObject.element.querySelector('.e-undo').parentElement.parentElement.click();
            expect(rteObject.element.querySelector('.e-undo').parentElement.parentElement.classList.contains('e-overlay')).toEqual(true);
            expect(rteObject.element.querySelector('.e-redo').parentElement.parentElement.classList.contains('e-overlay')).toEqual(false);
            rteObject.element.querySelector('.e-undo').parentElement.parentElement.click();
            expect(rteObject.element.querySelector('.e-undo').parentElement.parentElement.classList.contains('e-overlay')).toEqual(true);
            expect(rteObject.element.querySelector('.e-redo').parentElement.parentElement.classList.contains('e-overlay')).toEqual(false);
            // Testomg  the redo action after undo action
            rteObject.element.querySelector('.e-redo').parentElement.parentElement.click();
            expect(rteObject.element.querySelector('.e-redo').parentElement.parentElement.classList.contains('e-overlay')).toEqual(true);
            expect(rteObject.element.querySelector('.e-undo').parentElement.parentElement.classList.contains('e-overlay')).toEqual(false);
            rteObject.element.querySelector('.e-redo').parentElement.parentElement.click();
            expect(rteObject.element.querySelector('.e-undo').parentElement.parentElement.classList.contains('e-overlay')).toEqual(false);
            expect(rteObject.element.querySelector('.e-redo').parentElement.parentElement.classList.contains('e-overlay')).toEqual(true);
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
            const content: string = '<span style="font-family: Tahoma, Geneva, sans-serif;"><span style="color: rgb(68, 114, 196); text-decoration: inherit;"><span style="background-color: rgb(204, 255, 255);"><b><u class="sourceformatnode">                                     "Put your heart, mind, intellect, and soul even to your smallest acts. This is the secret of success." -                                      - Swami Sivananda</u></b></span></span></span>';
            expect(startElement.innerHTML.trim()).toEqual(content);
            expect(startElement.nodeName).toEqual('H2');
            expect(startElement.className).toEqual('sourceParent');
            done();
        });
        it('Tests for painting inline fornmat and block format from P element to H2 element Case 3: Range collapsed', (done: Function) => {
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

    describe('EJ2-71347 Console error when copying the multiple format nodes with selection' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = `<p class ='goalformatnode'>Getting started with <strong>Format </strong> Painter.</p>
        <h2 class ='sourceParent1' title="heading1"><span style="font-family: Tahoma, Geneva, sans-serif;">
            <span style="color: rgb(68, 114, 196); text-decoration: inherit;">
            <span style="background-color: rgb(204, 255, 255);">
                <b><u>FORMAT PAINTER:</u></b>
            </span></span></span>
        </h2>
        <p class ='sourceParent2'><span style="background-color: rgb(255, 204, 204);"><span style="color: rgb(255, 0, 0); text-decoration: inherit;">
            <span style="font-size: 14pt;"><strong><em><span style="text-decoration: underline;">
            <span style="text-decoration: line-through;">Getting started with the format painter:</span></span></em>
        </strong></span></span></span></p>`;
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
        it('Should remove the nested node and insert it to previos element instead of the Nested Paragraph element', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceParent1');
            let endElement = rteObject.inputElement.querySelector('.sourceParent2');
            range.setStart(startElement, 0);
            range.setEnd(endElement, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode');
            //const endElement = rteObject.inputElement.querySelector('.goalformatnode2');
            range.setStart(startElement, 0);
            range.setEnd(startElement.firstChild, 5);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            const correctInnerHTML: string  = `<span style="font-family: Tahoma, Geneva, sans-serif;"><span style="color: rgb(68, 114, 196); text-decoration: inherit;"><span style="background-color: rgb(204, 255, 255);"><b><u>Getti</u></b></span></span></span>ng started with <strong>Format </strong> Painter.`;
            expect(startElement.innerHTML).toEqual(correctInnerHTML);
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

    describe('EJ2-71348 Selecting the image caption and painting the copied format removes the image, selecting and applying removes outside the caption span' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = `<p><span class="e-img-caption e-rte-img-caption null e-caption-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap null"><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline" alt="RTEImage-Feather.png" width="auto" height="auto" style="min-width: 0px; max-width: 1839px; min-height: 0px;"><span class="e-img-inner null" contenteditable="true">This is the caption of the image.</span></span></span> </p>        <p>Getting started with <strong>Format </strong> Painter.</p>
        <h2 title="heading1"><span style="font-family: Tahoma, Geneva, sans-serif;">
            <span style="color: rgb(68, 114, 196); text-decoration: inherit;">
            <span style="background-color: rgb(204, 255, 255);">
                <b><u  class ='sourceformatnode'>FORMAT PAINTER:</u></b>
            </span></span></span>
        </h2>`;
        beforeAll( (done: Function) => {
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
        afterAll( () => {
            destroy(rteObject);
        });
        it('Copy and pasting nested styles should not split the span containing the e-img-inner', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.e-img-inner');
            setCursorPoint(startElement.firstChild as Element, 9);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            const immgCaptionInnerHTML: string = `This is<span style="font-family: Tahoma, Geneva, sans-serif;"><span style="color: rgb(68, 114, 196); text-decoration: inherit;"><span style="background-color: rgb(204, 255, 255);"><b><u class="sourceformatnode"> the</u></b></span></span></span> caption of the image.`;
            expect(startElement.innerHTML).toEqual(immgCaptionInnerHTML);
            done();
        });
    });

    describe('EJ2-71342 Painting format to already applied format causes console error and block format applied with selection' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = `<h2 class ='sourceParent'><b>Format Painter:</b></h2>
                                   <p class='goalParent'>Getting Starteed with the format painter , format painter allows to <em class ='goalformatnode1'>copy</em> and paste formatting.</p>`;
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
        it('Testing for removing old formats, should apply the copied format should not apply the block level formats', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceParent');
            range.setStart(startElement.firstChild.firstChild, 0);
            range.setEnd(startElement.firstChild.firstChild, 15);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode1');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 4);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalParent');
            expect(startElement.nodeName).toEqual('P');
            expect(startElement.nodeName).not.toEqual('H2');
            expect(startElement.querySelectorAll('b').length).toEqual(1);
            expect(startElement.querySelectorAll('em').length).toEqual(0);
            done();
        });
    });

    describe('EJ2-71345 Cursor position not maintained when pasting the content with cursor click between the text nodes' , () => {
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
        it('CASE 1 Range collapsed Tests for cursor maintained check', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 16);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode');
            setCursorPoint(startElement.firstChild as Element, 9);
            expect(window.getSelection().getRangeAt(0).startContainer).toEqual(startElement.firstChild);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceParent');
            expect(window.getSelection().getRangeAt(0).startContainer).toEqual(startElement.childNodes[1].childNodes[0].childNodes[0]);
            done();
        });
    });

    describe('EJ2-71199 Hyperlink got deleted after pasting the format', () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = `<p class='sourceformatnode1'>Getting started with <strong>Format </strong> Painter.</p>
                                <h2  title="heading1"><span style="font-family: Tahoma, Geneva, sans-serif;">
                                            <span style="color: rgb(68, 114, 196); text-decoration: inherit;">
                                            <span style="background-color: rgb(204, 255, 255);">
                                                <b><u class='sourceformatnode2'>FORMAT PAINTER:</u></b>
                                            </span></span></span>
                                </h2>
                                <p>Format painter is configured not to work on <a class='goalformatnode' href="https://ej2.syncfusion.com/home/" target="_blank">the link node.</a></p>
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
        it('Should not remove the anchor element. Test for anchor element not getting removed', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode1');
            range.setStart(startElement.childNodes[1], 0);
            range.setEnd(startElement.childNodes[1], 1);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode');
            const endElement = rteObject.inputElement.querySelector('.goalformatnode');
            range.setStart(startElement.parentElement, 0);
            range.setEnd(endElement, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            expect(startElement.nodeName).toEqual('A');
            done();
        });
        it('Should not remove the anchor element. Test for anchor element not getting removed with nested styles', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode2');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode');
            const endElement = rteObject.inputElement.querySelector('.goalformatnode');
            range.setStart(startElement.parentElement, 0);
            range.setEnd(endElement, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            expect(startElement.nodeName).toEqual('A');
            startElement = rteObject.inputElement.querySelector('.sourceformatnode1');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 5);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode');
            const endElement2 = rteObject.inputElement.querySelector('.goalformatnode');
            range.setStart(startElement.parentElement, 0);
            range.setEnd(endElement2, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            expect(startElement.nodeName).toEqual('A');
            done();
        });
    });

    describe('EJ2-71349 Converting nested list to paragraph results in nested paragraph' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = `<p class='sourceformatnode'>How to use the format painter:</p>
                                    <ol>
                                    <li class='goalformatnode1'>List 1 content.</li>
                                    <li>List 2 content.</li>
                                    <li>
                                        List 3 content.
                                        <ul>
                                            <li>Sub List 1 content.</li>
                                            <li>Sub List 2 content.</li>
                                            <li>Sub List 2 content.</li>
                                        </ul>
                                    </li>
                                    
                                    <li>List 4 content.</li>
                                    <li class='goalformatnode2'>List 5 content.</li></ol>`;
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
        it('Should remove the nested node and insert it to previos element instead of the Nested Paragraph element', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 5);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode1');
            const endElement = rteObject.inputElement.querySelector('.goalformatnode2');
            range.setStart(startElement, 0);
            range.setEnd(endElement, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            const correctInnerHTML: string  = `<p class="sourceformatnode">How to use the format painter:</p><p class="sourceformatnode">List 1 content.</p><p class="sourceformatnode">List 2 content.</p><p class="sourceformatnode">                                         List 3 content.                                         </p><p class="sourceformatnode">Sub List 1 content.</p><p class="sourceformatnode">Sub List 2 content.</p><p class="sourceformatnode">Sub List 2 content.</p><p class="sourceformatnode">List 4 content.</p><p class="sourceformatnode">List 5 content.</p>`;
            expect(rteObject.inputElement.innerHTML).toEqual(correctInnerHTML);
            done();
        });
    });

    describe('EJ2-71343 With multiple nodes selected Previously applied format not getting removed when nested styles are present' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = ` <p class = 'sourceformatnode'>Getting started with format painter</p>            
        <p class= 'goalformatnode1'>Getting started with <strong>Format </strong> Painter.</p>
        <h2 class= 'goalformatnode3' title="heading1"><span style="font-family: Tahoma, Geneva, sans-serif;">
            <span style="color: rgb(68, 114, 196); text-decoration: inherit;">
            <span style="background-color: rgb(204, 255, 255);">
                <b><u>FORMAT PAINTER:</u></b>
            </span></span></span>
        </h2>
        <p><span style="background-color: rgb(255, 204, 204);"><span style="color: rgb(255, 0, 0); text-decoration: inherit;">
            <span style="font-size: 14pt;"><strong><em><span style="text-decoration: underline;">
            <span style="text-decoration: line-through;">Getting started with the format painter:</span></span></em>
        </strong></span></span></span></p>
        <p>The format painter toolbar button allows you to copy the formatting of a selected text or object and 
            apply it to another text or object. 
            This is a quick and easy way to ensure consistent formatting throughout your document or website.
        </p>
        <p>By copying inline styles, you can easily transfer the font style, size, color, 
            and other properties from one element to another without having to manually adjust each property individually. 
            This saves you time and ensures that your design is consistent and professional.
        </p>
        <blockquote><span style="font-size: 18pt;"><span style="background-color: rgb(217, 217, 217);">
            <span style="color: rgb(31, 55, 99); text-decoration: inherit;"><strong style="background-color: rgb(217, 217, 217);">
            "Put your heart, mind, intellect, and soul even to your smallest acts. This is the secret of success." - 
            - Swami Sivananda</strong></span></span></span>
        </blockquote>
        <div class= 'goalformatnode2'><span style="font-size: 24pt;">This block content is of type  </span>
            <span style="color: rgb(112, 173, 71); text-decoration: inherit;"><span style="font-size: 24pt;"><strong><em>
                <span style="text-decoration: underline;"> &lt;div&gt;</span></em></strong></span></span>
                <span style="font-size: 24pt;"> 
                    element with font size of 24 pts.
                </span>
        </div>`;
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
        it('Case 1 SELECTION Copying without inline styles and painting Partial text with styles of a block node, should remove the old styles', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 5);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode1');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.childNodes[1].firstChild, startElement.childNodes[1].firstChild.textContent.length);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelectorAll('.goalformatnode1')[0];
            expect(startElement.innerHTML).toEqual('Getting started with Format  Painter.');
            done();
        });
        it('Case 2 MULTIPLE Copying without inline styles and painting to multiple block node, should remove the old styles', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 5);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode1');
            const endElement = rteObject.inputElement.querySelector('.goalformatnode2');
            range.setStart(startElement, 0);
            range.setEnd(endElement.lastElementChild, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            const correctInnerHTML: string  = `<p> </p><p class="sourceformatnode">Getting started with format painter</p><p class="sourceformatnode">Getting started with Format  Painter.</p><p class="sourceformatnode">\n            \n            \n                FORMAT PAINTER:</p><p class="sourceformatnode">\n            \n            Getting started with the format painter:</p><p class="sourceformatnode">The format painter toolbar button allows you to copy the formatting of a selected text or object and              apply it to another text or object.              This is a quick and easy way to ensure consistent formatting throughout your document or website.         </p><p class="sourceformatnode">By copying inline styles, you can easily transfer the font style, size, color,              and other properties from one element to another without having to manually adjust each property individually.              This saves you time and ensures that your design is consistent and professional.         </p><p class="sourceformatnode">\n                         "Put your heart, mind, intellect, and soul even to your smallest acts. This is the secret of success." -              - Swami Sivananda</p><p class="sourceformatnode">This block content is of type  \n            \n                 &lt;div&gt;\n                                      element with font size of 24 pts.                 </p>`;
            expect(rteObject.inputElement.innerHTML).toEqual(correctInnerHTML);
            done();
        });
        it('Case 3 FULL NODE Copying without inline styles and painting to full text node, should remove the old styles', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 5);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode3');
            range.setStart(startElement, 0);
            range.setEnd(startElement, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelectorAll('.sourceformatnode')[1];
            expect(startElement.innerHTML).toEqual(`\n            \n            \n                FORMAT PAINTER:`);
            done();
        });
    });

    describe('EJ2-71343 With multiple nodes selected Previously applied format not getting removed when nested styles are present' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = `<p class = 'sourceformatnode1'>Getting started with <strong>Format </strong> Painter.</p>
        <ul>
            <li class = 'sourceformatnode2'>Saves time and effort in formatting</li>
            <li>Consistent formatting throughout the document or website</li>
            <li>Quick and easy to use</li>
        </ul>
        <table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 50%;" class="goalformatnode1">The format painter toolbar button allows you to copy the formatting of a selected text or object and apply it to another text or object. This is a quick and easy way to ensure consistent formatting throughout your document or website.<br></td></tr></tbody></table>
        <table class="e-rte-table" style="width: 39.2876%; min-width: 0px;">
        <thead>
            <tr>
                <th class="">HEADING</th>
                <th>VALUE</th>
            </tr>
        </thead>
        <tbody>
            <tr style="height: 24px;">
                <td style="width: 50%;" class="">
                    <p><span style="font-family: Verdana, Geneva, sans-serif;"><strong><em  class="sourceformatnode3" >The format painter toolbar button allows you to                                      copy the formatting of a selected text or object and apply it to another text or object.                                      This is a quick and easy way to ensure consistent formatting throughout your document or website.</em></strong></span></p>
                    <p style="margin-bottom: 10px;"><span style="font-family: Verdana, Geneva, sans-serif;"><strong><em>By copying inline styles,                                      you can easily transfer the font style, size, color, and other properties from one element to another                                      without having to manually adjust each property individually. This saves you time and ensures                                      that your design is consistent and professional.</em></strong></span><br></p>
                </td>
                <td><br></td>
            </tr>
        </tbody>
</table>`;
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
        it('Case 1 Pasting a inline style with paragraph format to the Table td element.', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode1');
            range.setStart(startElement.childNodes[1], 0);
            range.setEnd(startElement.childNodes[1], 1);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode1');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, startElement.firstChild.textContent.length);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelectorAll('.goalformatnode1')[0];
            expect(startElement.nodeName).toEqual('TD');
            expect(startElement.firstChild.nodeName).toEqual('P');
            expect(startElement.firstChild.firstChild.nodeName).toEqual('STRONG');
            done();
        });
        it('Case 2 Pasting a list format to the Table td element', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode2');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 5);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode1');
            range.setStart(startElement, 0);
            range.setEnd(startElement.firstChild, startElement.firstChild.textContent.length);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelectorAll('.goalformatnode1')[0];
            expect(startElement.nodeName).toEqual('TD');
            expect(startElement.firstChild.nodeName).toEqual('UL');
            expect(startElement.firstChild.firstChild.nodeName).toEqual('LI');
            done();
        });
        it('Case 3 Pasting a inline style with paragraph format to the Table td element.', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode3');
            range.setStart(startElement, 0);
            range.setEnd(startElement, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode1');
            range.setStart(startElement, 0);
            range.setEnd(startElement.firstChild, startElement.firstChild.textContent.length);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelectorAll('.goalformatnode1')[0];
            expect(startElement.nodeName).toEqual('TD');
            expect(startElement.firstChild.nodeName).toEqual('P');
            expect(startElement.firstChild.firstChild.firstChild.nodeName).toEqual('STRONG');
            done();
        });
    });

    describe('EJ2-70359 List order changed after pasting the format ' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = `<p class='goalformatnode2'>Format Painter</p><p class='goalformatnode6'><b>Advantages of using the format painter:</b></p>
                                    <ul class='goalformatnode5'>
                                    <li>List Item 1 Saves time and effort in formatting</li>
                                    <li class='goalformatnode4'>List Item 2 Consistent formatting throughout the document or website</li>
                                    <li>List Item 3 Quick and easy to use</li>
                                    </ul><p><b>Advantages of using the format painter:</b></p>
                                    <ol>
                                        <li class='sourceformatnode1'>List Item 1 Saves time and effort in formatting</li>
                                        <li class='goalformatnode1'>List Item 2 Consistent formatting throughout the document or website</li>
                                        <li>List Item 3 Quick and easy to use</li>
                                    </ol>
                                    <p><b>Advantages of using the format painter:</b></p>
                                    <ul style="list-style-image: none; list-style-type: circle;">
                                        <li>Saves time and effort in formatting</li>
                                        <li class='sourceformatnode'>Consistent formatting throughout the document or website</li>
                                        <li>Quick and easy to use</li>
                                    </ul>
                                    <p class='goalformatnode3'>
                                        <b>How to use the format painter:</b>
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
                } , value: innerHTML
            });
            done();
        });
        afterEach( () => {
            destroy(rteObject);
        });
        it('CASE 1 When copied and pasted list type not match,', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 5);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode1');
            range.setStart(startElement, 0);
            range.setEnd(startElement, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            expect(startElement.parentElement.querySelectorAll('li').length).toEqual(1);
            expect(startElement.parentElement.style.listStyleType).toEqual('circle');
            expect(startElement.textContent).toEqual('List Item 2 Consistent formatting throughout the document or website');
            done();
        });
        it('CASE 2 Selecting all the element and then applying the disc list', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 5);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode2');
            const endElement = rteObject.inputElement.querySelector('.goalformatnode3');
            range.setStart(startElement, 0);
            range.setEnd(endElement, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('ul');
            expect(startElement.childElementCount).toEqual(13);
            expect((startElement as HTMLElement).style.listStyleType).toEqual('circle');
            const correctInnerHTML: string = `<li class="sourceformatnode">Format Painter</li><li class="sourceformatnode">Advantages of using the format painter:</li><li class="sourceformatnode">List Item 1 Saves time and effort in formatting</li><li class="sourceformatnode">List Item 2 Consistent formatting throughout the document or website</li><li class="sourceformatnode">List Item 3 Quick and easy to use</li><li class="sourceformatnode">Advantages of using the format painter:</li><li class="sourceformatnode">List Item 1 Saves time and effort in formatting</li><li class="sourceformatnode">List Item 2 Consistent formatting throughout the document or website</li><li class="sourceformatnode">List Item 3 Quick and easy to use</li><li class="sourceformatnode">Advantages of using the format painter:</li><li class="sourceformatnode">Saves time and effort in formatting</li><li class="sourceformatnode">Consistent formatting throughout the document or website</li><li class="sourceformatnode">Quick and easy to use</li>`;
            expect(startElement.innerHTML).toEqual(correctInnerHTML);
            done();
        });
        it('CASE 3 change the list type from Disc to Circle for a single node', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 5);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode4');
            range.setStart(startElement, 0);
            range.setEnd(startElement, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('ul');
            expect(startElement.childElementCount).toEqual(3);
            expect((startElement as HTMLElement).style.listStyleType).toEqual('circle');
            done();
        });
        it('CASE 4 copying and pasting the circle type bullet to disc shaped list (Multi Nodes)', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 5);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode5');
            range.setStart(startElement, 0);
            range.setEnd(startElement.lastElementChild, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            expect(startElement.parentElement.querySelectorAll('li').length).toEqual(3);
            expect(startElement.parentElement.style.listStyleType).toEqual('circle');
            expect(startElement.parentElement.textContent).toEqual('List Item 1 Saves time and effort in formattingList Item 2 Consistent formatting throughout the document or websiteList Item 3 Quick and easy to use');
            done();
        });
        it('CASE 5 copying and pasting the number type list to paragraph before the disc type bullet list', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode1');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 5);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode6');
            range.setStart(startElement, 0);
            range.setEnd(startElement, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceformatnode1');
            expect(startElement.parentElement.nodeName).toEqual('OL');
            expect(startElement.parentElement.querySelectorAll('li').length).toEqual(1);
            expect(startElement.parentElement.textContent).toEqual('Advantages of using the format painter:');
            done();
        });
        it('CASE 6 copying and pasting the circle bullet type list to paragraph before the disc type bullet list', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 5);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode6');
            range.setStart(startElement, 0);
            range.setEnd(startElement, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            expect(startElement.parentElement.querySelectorAll('li').length).toEqual(4);
            expect(startElement.parentElement.style.listStyleType).toEqual('circle');
            const textContent: string = 'Advantages of using the format painter:\n                                    List Item 1 Saves time and effort in formatting\n                                    List Item 2 Consistent formatting throughout the document or website\n                                    List Item 3 Quick and easy to use\n                                    ';
            expect(startElement.parentElement.textContent).toEqual(textContent);
            done();
        });
    });

    describe('Action Complete event testing' , () => {
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
                } , value: innerHTML, actionComplete: actionComplete
            });
            // eslint-disable-next-line jsdoc/require-jsdoc
            function actionComplete(args: any): void {
                if (args.requestType === 'FormatPainter') {
                    switch(args.action) {
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
        it('Action Complete event testing Case 1 Format Copy', (done: Function) => {
            toolbarELem.click();
            expect(isCopytriggered).toBe(true);
            done();
        });
        it('Action Complete event testing Case 2 Format Paste', (done: Function) => {
            toolbarELem.click();
            rteObject.notify('editAreaClick', { args: { target: rteObject.inputElement.querySelector('p') } });
            expect(isPasteTriggered).toBe(true);
            done();
        });
        it('Action Complete event testing Case 3 Format Clear', (done: Function) => {
            toolbarELem.click();
            rteObject.inputElement.querySelector('p').click();
            rteObject.keyDown(escapeKeyBoardEventArgs);
            expect(isEscapeTriggered).toBe(true);
            done();
        });
        it('Action Complete event testing Case 4 Keyboard', (done: Function) => {
            rteObject.keyDown(copyKeyBoardEventArgs);
            expect(isCopytriggered).toBe(true);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            expect(isPasteTriggered).toBe(true);
            rteObject.keyDown(escapeKeyBoardEventArgs);
            expect(isEscapeTriggered).toBe(true);
            done();
        });
    });

    describe('830677 - Format Painter not working inside the Table', () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = `<p class="goalformatnode1">Getting started with format painter</p>
                                        <table class="e-rte-table" style="width: 100%; min-width: 0px;">
                                            <tbody>
                                                <tr>
                                                <td style="width: 33.3333%;">
                                                    <strong>
                                                        <em>
                                                            <span style="text-decoration: underline;">
                                                                <span  class ="sourceformatnode" style="text-decoration: line-through;">
                                                                    Test the TD element of the table
                                                                </span>
                                                            </span>
                                                        </em>
                                                    </strong>
                                                </td>
                                            <td style="width: 33.3333%;">
                                                <br>
                                            </td>
                                            <td style="width: 33.3333%;">
                                                <br>
                                            </td>
                                            </tr>
                                            <tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr>
                                        </tbody>
                                    </table>
                                `
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

        it('CASE 1 Copy and paste the format from the td element ,', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 5);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode1');
            range.setStart(startElement, 0);
            range.setEnd(startElement, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            expect(startElement.textContent).toEqual('Getting started with format painter');
            expect(startElement.parentElement.parentElement.parentElement.nodeName).toEqual('STRONG');
            expect(startElement.parentElement.parentElement.parentElement.parentElement.nodeName).toEqual('P');
            expect(startElement.parentElement.parentElement.parentElement.innerHTML).toEqual(`<em><span style="text-decoration: underline;"><span class="sourceformatnode" style="text-decoration: line-through;">Getting started with format painter</span></span></em>`)
            done();
        });
    });

    describe('Format Painter API configuration without separator not handled' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = `<p><span class="important" style="color:red">Format Painter</span> Getting started with <span class="goalformatnode1">format </span> painter</p>
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
                } , value: innerHTML , 
                    formatPainterSettings:{
                        allowedFormats: 'span',
                        deniedFormats: 'span(important)'
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
            let startElement = rteObject.inputElement.querySelector('.important');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode1');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 6);
            rteObject.selectRange(range);
            expect(startElement.nodeName).toEqual('SPAN');
            expect(startElement.classList.contains('goalformatnode1')).toBe(true);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = startElement.childNodes[0] as HTMLElement;
            expect(rteObject.element.querySelectorAll('goalformatnode1').length).toBe(0);
            expect(rteObject.element.querySelectorAll('important').length).toBe(0);
            done();
        });
    });

    describe('Format Painter module destroy testing' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = `<p><span class="important" style="color:red">Format Painter</span> Getting started with <span class="goalformatnode1">format </span> painter</p>
            `;
        beforeEach( (done: Function) => {
            rteObject = renderRTE({
                toolbarSettings : { items: ['FormatPainter']
                } , value: innerHTML 
            });
            done();
        });
        afterEach( () => {
            destroy(rteObject);
        });
        it('Destroy the format painter module', (done: Function) => {
            rteObject.focusIn();
            rteObject.destroy();
            setTimeout(() => {
                expect(rteObject.formatPainterModule.previousAction).toBeUndefined();
                done();
            }, 50);
        });
    });

    describe('Dynamic property change Format Painter API configuration ' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = `<p><span class="important" style="color:red">Format Painter</span> Getting started with <span class="goalformatnode1">format </span> painter</p>
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
        it('Dynamic property change to test denied attributes', (done: Function) => {
            rteObject.formatPainterSettings = {
                allowedFormats: 'span',
                deniedFormats: 'span(important)'
            }
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.important');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode1');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 6);
            rteObject.selectRange(range);
            expect(startElement.nodeName).toEqual('SPAN');
            expect(startElement.classList.contains('goalformatnode1')).toBe(true);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = startElement.childNodes[0] as HTMLElement;
            expect(rteObject.element.querySelectorAll('goalformatnode1').length).toBe(0);
            expect(rteObject.element.querySelectorAll('important').length).toBe(0);
            done();
        });
    });

    describe(' BUG 832317 - Format Painter Copy Action not working properly' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = `<p>The <span class="e-text-red e-rte-text-red" style="color:brown; font-weight: 800;" data-main="brown text" title="This is a red text"><strong>Format Painter</strong></span>
        is a tool that allows you to <em class="e-rte-em" title="This is a color">copy</em> the 
        <strong class="e-text-red-bg" style="background-color: rgb(255, 0, 0);">formatting </strong> 
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
                } , value: innerHTML 
            });
            done();
        });
        afterEach( () => {
            destroy(rteObject);
        });
        it('Test for span not getting pasted properly', (done: Function) => {
            rteObject.formatPainterSettings = {
                allowedFormats: 'span'
            }
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.e-rte-text-red');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.e-rte-em');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 4);
            rteObject.selectRange(range);
            expect(startElement.nodeName).toEqual('EM');
            expect(startElement.classList.contains('e-rte-em')).toBe(true);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelectorAll('.e-rte-text-red')[1];
            expect(rteObject.element.querySelectorAll('.e-rte-text-red').length).toBe(2);
            done();
        });
    });

    describe('BUG 832315-Format Painter Parent format is not working' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = `<p>The <span class="e-text-red e-rte-text-red" style="color:brown; font-weight: 800;" data-main="brown text" title="This is a red text"><strong>Format Painter</strong></span>
        is a tool that allows you to <em class="e-rte-em" title="This is a color">copy</em> the 
        <strong class="e-text-red-bg" style="background-color: rgb(255, 0, 0);">formatting </strong> 
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
                } , value: innerHTML 
            });
            done();
        });
        afterEach( () => {
            destroy(rteObject);
        });
        it('Test for span not getting pasted properly', (done: Function) => {
            rteObject.formatPainterSettings = {
                allowedFormats: 'span;strong;'
            }
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.e-rte-text-red');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 1);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.e-rte-em');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 4);
            rteObject.selectRange(range);
            expect(startElement.nodeName).toEqual('EM');
            expect(startElement.classList.contains('e-rte-em')).toBe(true);
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelectorAll('.e-rte-text-red')[1];
            expect(startElement.querySelectorAll('strong').length).toBe(1);
            done();
        });
    });

    describe('833006 - One note Content Format copying and pasting removes the text content', () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = `<h3>Format Painter</h3>
                                    <p>
                                        A Format Painter is a Rich Text Editor feature allowing users to quickly 
                                        <span style="background-color: rgb(198, 140, 83);"><strong>copy</strong></span>
                                        and 
                                        <span style="background-color: rgb(198, 140, 83);"><strong>paste</strong></span>
                                        formatting from one text to another. With a rich text editor, utilize the format painter as follows:
                                    </p>
                                    <p style="color: rgb(51, 51, 51); font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">The&nbsp;<span style="font-weight: 700;">Format Painter</span>&nbsp;feature allows you to copy the formats and apply them to content without formatting thus saving time to reformat the content.</p>
                                    <ul style="color: rgb(51, 51, 51); font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">
                                        <li>
                                            Format painter can be accessed via the toolbar or the keyboard shortcuts.
                                            <p><br></p>
                                            <p class="goalformatnode1">Engineer name</p>
                                            <p><br></p>
                                            <p>Issue details</p>
                                            <p><br></p>
                                            <p>Status</p>
                                            <p><br></p>
                                            <p>Revanth</p>
                                            <p><br></p>
                                            <p class="sourceParentNode"><a class="e-rte-anchor sourceformatnode" href="https://dev.azure.com/EssentialStudio/Ej2-Web/_workitems/edit/830370" title="https://dev.azure.com/EssentialStudio/Ej2-Web/_workitems/edit/830370" target="_blank">https://dev.azure.com/EssentialStudio/Ej2-Web/_workitems/edit/830370 </a>- (CR Issue</p>
                                        </li>
                                    </ul>`
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

        it('Test for content not getting deleted after the format paste action.', (done: Function) => {
            rteObject.focusIn();
            let range = new Range();
            let startElement = rteObject.inputElement.querySelector('.sourceformatnode');
            range.setStart(startElement.firstChild, 0);
            range.setEnd(startElement.firstChild, 60);
            rteObject.selectRange(range);
            rteObject.keyDown(copyKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.goalformatnode1');
            range.setStart(startElement, 0);
            range.setEnd(startElement.firstChild, 13);
            rteObject.selectRange(range);
            expect(startElement.nodeName).toEqual('P');
            expect(startElement.classList.contains('goalformatnode1')).toBe(true);
            expect(startElement.textContent).toEqual('Engineer name');
            rteObject.keyDown(pasteKeyBoardEventArgs);
            startElement = rteObject.inputElement.querySelector('.sourceParentNode');
            expect(startElement.nodeName).toEqual('P');
            expect(startElement.classList.contains('sourceParentNode')).toBe(true);
            expect(startElement.textContent).toEqual('Engineer name');
            done();
        });
    });
});