import { Toolbar } from '../../src/rich-text-editor/index';
import { dispatchEvent } from '../../src/rich-text-editor/base/util';
import { RichTextEditor } from '../../src/rich-text-editor/base/rich-text-editor';
import { NodeSelection } from '../../src/selection/index';

import { renderRTE, destroy } from './../rich-text-editor/render.spec';
import { createElement, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { QuickToolbar, MarkdownEditor, HtmlEditor, Link, Image } from "../../src/rich-text-editor/index";
import { Browser, detach, getUniqueID } from "@syncfusion/ej2-base";
import { FormValidator } from "@syncfusion/ej2-inputs";

RichTextEditor.Inject(MarkdownEditor);
RichTextEditor.Inject(HtmlEditor);

RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(QuickToolbar, Link, Image);

describe('RTE CR issues', () => {
    describe('RTE - Incident issues', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let innerHTML:string =`<ol>
        <li>
            <p>Provide
        the tool bar support, it’s also customizable.</p>
        </li>
        <li>
            <p>Options
            to get the HTML elements with styles.</p></li>
        <li>
            <p>Support
            to insert image from a defined path.</p></li>
        <li>
            <p>Footer
            elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li>
        <li>
            <p>Re-size
            the editor support.</p></li>
        <li>
            <p>Provide
            efficient public methods and client side events.</p></li>
        <li>
            <p>Keyboard
            navigation support.</p></li>
        </ol>`;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: innerHTML
            });
            elem = rteObj.element;
            done();
        });

        it('I213118 => EJ2-15261 - RTE removes spacing between words when content is pasted from a word document', () => {
            expect((rteObj as any).inputElement.innerHTML === innerHTML.replace(/>\s+</g,'><')).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
    
    describe('EJ2-18135 - name attribute of textarea element', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLTextAreaElement;
        beforeEach((done: Function) => {
            done();
        });

        it('name attribute to textarea element', (done) => {
            elem = <HTMLTextAreaElement>createElement('textarea', { id: 'rte_test_EJ2_18135', attrs: { name: 'formName' } });
            document.body.appendChild(elem);
            rteObj = new RichTextEditor({
            });
            rteObj.appendTo(elem);
            expect((rteObj as any).valueContainer.getAttribute('name') === 'formName').toBe(true);
            done();
        });

        it('name attribute to div element', (done) => {
            elem = <HTMLTextAreaElement>createElement('div', { id: 'rte_test_div_EJ2_18135', attrs: { name: 'formName' } });
            document.body.appendChild(elem);
            rteObj = new RichTextEditor({
            });
            rteObj.appendTo(elem);
            expect((rteObj as any).valueContainer.getAttribute('name') === 'rte_test_div_EJ2_18135').toBe(true);
            done();
        });

        afterEach((done) => {
            destroy(rteObj);
            done();
        });
    });
})