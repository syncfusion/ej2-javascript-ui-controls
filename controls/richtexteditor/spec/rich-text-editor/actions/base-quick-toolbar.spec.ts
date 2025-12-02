import { RichTextEditor } from "../../../src/rich-text-editor/base";
import { renderRTE, destroy } from "../render.spec";
import { BASIC_MOUSE_EVENT_INIT } from "../../constant.spec";
import { createElement } from "@syncfusion/ej2-base";
import { BeforeQuickToolbarOpenArgs } from "../../../src/components";
import { TipPointerPosition } from "../../../src/common/types";

function setCursorPoint(element: Element | HTMLElement | ChildNode, point: number) {
    const ownerDocument: Document = element.nodeType === Node.TEXT_NODE ? element.parentElement.ownerDocument : element.ownerDocument;
    let range: Range = ownerDocument.createRange();
    let sel: Selection = ownerDocument.defaultView.getSelection();
    range.setStart(element, point);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

function setSelection(element: Element | HTMLElement | ChildNode, start: number, end: number) {
    const ownerDocument: Document = element.nodeType === Node.TEXT_NODE ? element.parentElement.ownerDocument : element.ownerDocument;
    let range: Range = ownerDocument.createRange();
    let sel: Selection = ownerDocument.defaultView.getSelection();
    range.setStart(element, start);
    range.setEnd(element, end);
    sel.removeAllRanges();
    sel.addRange(range);
}

const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);

const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);

const imageSRC: string = 'https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png';

const EDITOR_CONTENT: string = `<p>Text Content</p>
            <p><a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/tailwind3/rich-text-editor/tools.html"  aria-label="Open in new window">Link Content</a></p>
            <p><img alt="Logo" style="width: 300px;" src="${imageSRC}" class="e-rte-image e-imginline"></p>
            <p><span class="e-video-wrap" contenteditable="false"><video controls="" style="width: 30%;" class="e-rte-video e-video-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4" type="video/mp4"></video></span><br></p>
            <table class="e-rte-table" style="width: 80.4728%; min-width: 0px; height: 406px;"><tbody><tr style="height: 6.38821%;"><td style="width: 50%;">Issues</td><td style="width: 50%;">Status<br></td></tr><tr style="height: 6.38821%;"><td style="width: 50%;" class="">Color picker popup opens outside the editor</td><td style="width: 50%;" class="">Not started</td></tr><tr style="height: 11.5479%;"><td style="width: 50%;" class="">Native quick toolbar opened when text selection on Mobile device</td><td style="width: 50%;" class="">Not Started<br></td></tr><tr style="height: 6.38821%;"><td style="width: 50%;" class="">On window resize dialog does not close.</td><td style="width: 50%;" class="">Not Started</td></tr><tr style="height: 11.5479%;"><td style="width: 50%;" class="">Text quick toolbar opened when the Image resize is completed.</td><td style="width: 50%;" class="">Not Started</td></tr></tbody></table>`;

const OVERVIEW_CONTENT: string = `<h2>Welcome to the Syncfusion<sup>®</sup> Rich Text Editor</h2><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h3>Do you know the key features of the editor?</h3><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>,<code>InlineCode</code>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion<sup>®</sup> Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h3>Unlock the Power of Tables</h3><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h3>Elevating Your Content with Images</h3><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-imginline"></p>`;

const TABLE_TOP_POSITION_CONTENT: string = '<h2>Welcome to the Syncfusion<sup>®</sup> Rich Text Editor</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h3>Elevating Your Content with Images</h3><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-imginline"></p>';

const TABLE_FIT_POSITION_CONTENT: string = '<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h3>Elevating Your Content with Images</h3><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-imginline"></p>';

const TABLE_BOT_POSITION_CONTENT: string = '<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 13.5417%;"> <tr style="height: 13.5417%;"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 17.1875%;"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 17.1875%;"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 17.1875%;"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 17.1875%;"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 17.1875%;"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><p><br></p><p><br></p>';


// 1. First Describe - DIV Rendering
// 2. Second Describe - IFrame Rendering
describe('Base Quick Toolbar', ()=> {

    describe('DIV', ()=> {

        beforeAll((done: DoneFn)=> {
            const link: HTMLLinkElement = document.createElement('link');
            link.href = '/base/demos/themes/material.css';
            link.rel = 'stylesheet';
            link.id = 'materialTheme';
            link.onload= ()=> {
                done(); // Style should be loaded before done() called
            };
            link.onerror = (e) => {
                fail(`Failed to load stylesheet: ${link.href}`);
                done(); // still end the test run to avoid hanging
            };
            document.head.appendChild(link);

        });
        afterAll((done: DoneFn)=> {
            document.getElementById('materialTheme').remove();
            done();
        });

        describe ('Last block collision Position testing', ()=> {
            let editor: RichTextEditor;
            beforeAll(()=> {
                editor = renderRTE({
                    quickToolbarSettings: {
                        text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                    },
                    height: '300px',
                    value: `<h1>Welcome to the Syncfusion<sup>®</sup> Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>,<code>InlineCode</code>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion<sup>®</sup> Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br/></th> <th style="width: 23.2295%"><span>Name</span><br/></th> <th style="width: 9.91501%"><span>Age</span><br/></th> <th style="width: 15.5807%"><span>Gender</span><br/></th> <th style="width: 17.9887%"><span>Occupation</span><br/></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br/></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br/></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br/></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br/></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br/></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-imginline" /></p>`
                });
            });

            afterAll(()=> {
                destroy(editor);
            });

            it('Should flip and open the quick toolbar.', (done : DoneFn)=> {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('li');
                setSelection(target.firstChild, 1, 2);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.textQTBar as any).currentTipPosition).toBe('Bottom-Left');
                    const popupElement: HTMLElement = editor.quickToolbarModule.textQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.textQTBar.popupObj.relateTo as HTMLElement;
                    expect(blockElement.getBoundingClientRect().bottom).toBeGreaterThan(popupElement.getBoundingClientRect().bottom);
                    done();
                }, 100);
            });
        });

        describe ('Content scrolled Position testing ', ()=> {

            let editor: RichTextEditor;
            beforeAll(()=> {
                editor = renderRTE({
                    quickToolbarSettings: {
                        text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                    },
                    height: '300px',
                    value: `<h1>Welcome to the Syncfusion<sup>®</sup> Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>,<code>InlineCode</code>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion<sup>®</sup> Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br/></th> <th style="width: 23.2295%"><span>Name</span><br/></th> <th style="width: 9.91501%"><span>Age</span><br/></th> <th style="width: 15.5807%"><span>Gender</span><br/></th> <th style="width: 17.9887%"><span>Occupation</span><br/></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br/></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br/></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br/></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br/></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br/></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-imginline" /></p>`
                });
            });

            afterAll(()=> {
                destroy(editor);
            });

            it('Should open the quick toolbar with respect to scroll position.', (done : DoneFn)=> {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('h2');
                setSelection(target.firstChild, 1, 2);
                editor.inputElement.scrollTop = 130;
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.textQTBar as any).currentTipPosition).toBe('Top-Left');
                    const popupElement: HTMLElement = editor.quickToolbarModule.textQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.textQTBar.popupObj.relateTo as HTMLElement;
                    expect(popupElement.getBoundingClientRect().top).toBeGreaterThan(blockElement.getBoundingClientRect().bottom);
                    done();
                }, 100);
            });
        });

        describe('Backwards selection testing', ()=> {
            let editor: RichTextEditor;
            beforeAll(()=> {
                editor = renderRTE({
                    quickToolbarSettings: {
                        text: ['Bold', 'Italic', 'Underline', 'StrikeThrough'],
                    },
                    height: '300px',
                    value: `<h1>Welcome to the Syncfusion<sup>®</sup> Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>,<code>InlineCode</code>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion<sup>®</sup> Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br/></th> <th style="width: 23.2295%"><span>Name</span><br/></th> <th style="width: 9.91501%"><span>Age</span><br/></th> <th style="width: 15.5807%"><span>Gender</span><br/></th> <th style="width: 17.9887%"><span>Occupation</span><br/></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br/></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br/></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br/></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br/></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br/></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-imginline" /></p>`
                });
            });

            afterAll(()=> {
                destroy(editor);
            });

            it('Should open the quick toolbar below the selected text content and tip pointer should be Bottom right.', (done : DoneFn)=> {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('p');
                const range: Range = new Range();
                range.setEnd(editor.inputElement.querySelector('li').firstChild, 60);
                range.setStart(editor.inputElement.querySelector('li').firstChild, 0);
                editor.selectRange(range);
                window.getSelection().extend(editor.inputElement.querySelector('p').firstChild, 59)
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    // Only SUCCESS in HEADLESS CHROME.
                    expect((editor.quickToolbarModule.textQTBar as any).currentTipPosition).toBe('Bottom-Right');
                    const popupElement: HTMLElement = editor.quickToolbarModule.textQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.textQTBar.popupObj.relateTo as HTMLElement;
                    expect(blockElement.getBoundingClientRect().top).toBeGreaterThan(popupElement.getBoundingClientRect().bottom);
                    done();
                }, 100);
            });
            it('Should not open the quick toolbar above the selected text content and tip pointer should be Top right.', (done : DoneFn)=> {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('h1');
                const range: Range = new Range();
                range.setEnd(editor.inputElement.querySelector('li').firstChild, 60);
                range.setStart(editor.inputElement.querySelector('li').firstChild, 0);
                editor.selectRange(range);
                window.getSelection().extend(editor.inputElement.querySelector('h1').firstChild, 15)
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    // Only SUCCESS in HEADLESS CHROME.
                    expect((editor.quickToolbarModule.textQTBar as any).currentTipPosition).toBe('Top-Right');
                    const popupElement: HTMLElement = editor.quickToolbarModule.textQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.textQTBar.popupObj.relateTo as HTMLElement;
                    expect(blockElement.getBoundingClientRect().top).not.toBeGreaterThan(popupElement.getBoundingClientRect().bottom);
                    done();
                }, 100);
            });
        });

        describe('960610: Text quick toolbar tip pointer horizontal alignment issue.', ()=> {
            let editor: RichTextEditor;
            beforeAll(()=> {
                editor = renderRTE({
                    quickToolbarSettings: {
                        text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                    },
                    value: `<h1>Welcome to the Syncfusion<sup>®</sup> Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>,<code>InlineCode</code>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion<sup>®</sup> Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br/></th> <th style="width: 23.2295%"><span>Name</span><br/></th> <th style="width: 9.91501%"><span>Age</span><br/></th> <th style="width: 15.5807%"><span>Gender</span><br/></th> <th style="width: 17.9887%"><span>Occupation</span><br/></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br/></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br/></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br/></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br/></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br/></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-imginline" /></p>`
                });
            });
            afterAll(()=> {
                destroy(editor)
            });
            it('Should update the Format dropdown value after showing the quick toolbar', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('h1');
                setSelection(target.firstChild, 15 , 25);
                editor.quickToolbarModule.textQTBar.showPopup(target, null)
                setTimeout(() => {
                    const dropDownvalue: string = '<span style="display: inline-flex;width:65px" ><span class="e-rte-dropdown-btn-text></span></span>';
                    expect((editor.quickToolbarModule.textQTBar as any).dropDownButtons.formatDropDown.content).toBe(dropDownvalue);
                    done();
                }, 100);
            });
        });

        describe('961316: Audio quick toolbar appears off-screen or hidden after inserting audio.', ()=> {
            let editor: RichTextEditor;
            beforeAll(()=> {
                editor = renderRTE({
                    toolbarSettings: {
                        items: ['Audio']
                    }
                });
            });
            afterAll(()=> {
                destroy(editor)
            });
            it('Should open the quick toolbar on correct position when the Audio is inserted via dialog.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const insertAudioButton: HTMLElement = editor.element.querySelector('.e-audio').parentElement.parentElement;
                insertAudioButton.click();
                setTimeout(() => {
                    const dialog: HTMLElement = editor.element.querySelector('.e-rte-audio-dialog');
                    const input: HTMLInputElement = dialog.querySelector('input.e-input');
                    input.value = 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Audio.wav';
                    const inputEvent: Event = new Event('input');
                    input.dispatchEvent(inputEvent);
                    setTimeout(() => {
                        const primaryButton: HTMLElement = dialog.querySelector('.e-footer-content .e-primary');
                        primaryButton.click();
                        setTimeout(() => {
                            const quickToolbar: HTMLElement = document.querySelector('.e-rte-quick-popup');
                            const mainToolbar: HTMLElement = editor.element.querySelector('.e-toolbar-wrapper');
                            const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
                            const mainTBarRect: ClientRect = mainToolbar.getBoundingClientRect();
                            expect(quikTBarRect.top).toBeGreaterThanOrEqual(mainTBarRect.bottom);
                            done();
                        }, 1000); // To load the Audio takes some time.
                    }, 100);
                }, 100);
            });
        });

        describe('960503: To test and write test case for Quick toolbar collision', ()=> {
            describe('Height static Enable floating true', ()=> {
                let editor: RichTextEditor;
                beforeEach(()=> {
                    editor = renderRTE({
                        toolbarSettings: {
                            items: [
                                'Undo', 'Redo', '|', 'ImportWord', 'ExportWord', 'ExportPdf', '|',
                                'Bold', 'Italic', 'Underline', 'StrikeThrough', 'InlineCode', 'SuperScript', 'SubScript', '|',
                                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                                'LowerCase', 'UpperCase', '|',
                                'Formats', 'Alignments', 'Blockquote', '|', 'NumberFormatList', 'BulletFormatList', '|',
                                'Outdent', 'Indent', '|', 'CreateLink', 'Image', 'FileManager', 'Video', 'Audio', 'CreateTable', '|', 'FormatPainter', 'ClearFormat',
                                '|', 'EmojiPicker', 'Print', '|',
                                'SourceCode', 'FullScreen']
                        },
                        quickToolbarSettings: {
                            text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                        },
                        height: '350px',
                    });
                });

                afterEach(()=> {
                    destroy(editor);
                });

                it('CASE 1: Should open table quick toolbar with top.', (done : DoneFn)=> {
                    editor.focusIn();
                    editor.inputElement.innerHTML = TABLE_TOP_POSITION_CONTENT;
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    const target: HTMLElement = editor.inputElement.querySelector('td');
                    setCursorPoint(target.firstChild, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickToolbar: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const mainToolbar: HTMLElement = editor.element.querySelector('.e-toolbar-wrapper');
                        const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
                        const mainTBarRect: ClientRect = mainToolbar.getBoundingClientRect();
                        expect(quikTBarRect.top).toBeGreaterThanOrEqual(mainTBarRect.bottom);
                        expect(editor.quickToolbarModule.tableQTBar.popupObj.collision.Y).toBe('flip');
                        expect(editor.quickToolbarModule.tableQTBar.popupObj.position.Y).toBe('top');
                        done();
                    }, 100);
                });
                it('CASE 2: Should open table quick toolbar with bottom.', (done : DoneFn)=> {
                    editor.focusIn();
                    editor.inputElement.innerHTML = TABLE_BOT_POSITION_CONTENT;
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    const target: HTMLElement = editor.inputElement.querySelector('td');
                    setCursorPoint(target.firstChild, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickToolbar: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const mainToolbar: HTMLElement = editor.element.querySelector('.e-toolbar-wrapper');
                        const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
                        const mainTBarRect: ClientRect = mainToolbar.getBoundingClientRect();
                        expect(quikTBarRect.top).toBeGreaterThanOrEqual(mainTBarRect.bottom);
                        expect(editor.quickToolbarModule.tableQTBar.popupObj.collision.Y).toBe('flip');
                        expect(editor.quickToolbarModule.tableQTBar.popupObj.position.Y).toBe('bottom');
                        done();
                    }, 100);
                });
                it('CASE 3: Should open table quick toolbar with fit collision.', (done : DoneFn)=> {
                    editor.height = '300px';
                    editor.focusIn();
                    editor.inputElement.innerHTML = TABLE_FIT_POSITION_CONTENT;
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    const target: HTMLElement = editor.inputElement.querySelector('td');
                    setCursorPoint(target.firstChild, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickToolbar: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const mainToolbar: HTMLElement = editor.element.querySelector('.e-toolbar-wrapper');
                        const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
                        const mainTBarRect: ClientRect = mainToolbar.getBoundingClientRect();
                        const editPanel: HTMLElement = editor.inputElement;
                        const editPanelRect: ClientRect = editPanel.getBoundingClientRect();
                        expect(quikTBarRect.top).toBeGreaterThanOrEqual(mainTBarRect.bottom);
                        expect(quikTBarRect.top).toBeGreaterThanOrEqual(editPanelRect.top)
                        expect(editor.quickToolbarModule.tableQTBar.popupObj.collision.Y).toBe('fit');
                        done();
                    }, 100);
                });
                it('CASE 4: Should open table quick toolbar with fit position with main toolbar expanded.', (done : DoneFn)=> {
                    editor.height = '300px';
                    editor.focusIn();
                    editor.inputElement.innerHTML = TABLE_FIT_POSITION_CONTENT;
                    const expandButton: HTMLElement = editor.element.querySelector('.e-toolbar-wrapper .e-hor-nav.e-expended-nav');
                    expandButton.click();
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    const target: HTMLElement = editor.inputElement.querySelector('td');
                    setCursorPoint(target.firstChild, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickToolbar: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const mainToolbar: HTMLElement = editor.element.querySelector('.e-toolbar-wrapper');
                        const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
                        const mainTBarRect: ClientRect = mainToolbar.getBoundingClientRect();
                        expect(quikTBarRect.top).toBeGreaterThanOrEqual(mainTBarRect.bottom);
                        expect(editor.quickToolbarModule.tableQTBar.popupObj.collision.Y).toBe('fit');
                        done();
                    }, 100);
                });
            });

            describe('Height static Enable floating false', ()=> {
                let editor: RichTextEditor;
                beforeAll(()=> {
                    document.body.style.height= '150vh';
                });
                afterAll(()=> {
                    document.body.style.height = '';
                });
                beforeEach(()=> {
                    editor = renderRTE({
                        toolbarSettings: {
                            enableFloating: false,
                            items: [
                                'Undo', 'Redo', '|', 'ImportWord', 'ExportWord', 'ExportPdf', '|',
                                'Bold', 'Italic', 'Underline', 'StrikeThrough', 'InlineCode', 'SuperScript', 'SubScript', '|',
                                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                                'LowerCase', 'UpperCase', '|',
                                'Formats', 'Alignments', 'Blockquote', '|', 'NumberFormatList', 'BulletFormatList', '|',
                                'Outdent', 'Indent', '|', 'CreateLink', 'Image', 'FileManager', 'Video', 'Audio', 'CreateTable', '|', 'FormatPainter', 'ClearFormat',
                                '|', 'EmojiPicker', 'Print', '|',
                                'SourceCode', 'FullScreen']
                        },
                        quickToolbarSettings: {
                            text: ['Bold', 'Italic', 'Underline', 'StrikeThrough'],
                        },
                        height: '350px',
                    });
                });

                afterEach(()=> {
                    destroy(editor);
                });

                it('CASE 1: Should open table quick toolbar with top.', (done : DoneFn)=> {
                    editor.focusIn();
                    window.scrollTo(0, 100);
                    editor.inputElement.innerHTML = TABLE_TOP_POSITION_CONTENT;
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    const target: HTMLElement = editor.inputElement.querySelector('td');
                    setCursorPoint(target.firstChild, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickToolbar: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const editPanel: HTMLElement = editor.inputElement;
                        const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
                        const editPanelRect: ClientRect = editPanel.getBoundingClientRect();
                        expect(quikTBarRect.top).toBeGreaterThanOrEqual(editPanelRect.top);
                        expect(editor.quickToolbarModule.tableQTBar.popupObj.collision.Y).toBe('flip');
                        expect(editor.quickToolbarModule.tableQTBar.popupObj.position.Y).toBe('top');
                        done();
                    }, 100);
                });
                it('CASE 2: Should open table quick toolbar with bottom.', (done : DoneFn)=> {
                    editor.focusIn();
                    window.scrollTo(0, 100);
                    editor.inputElement.innerHTML = TABLE_BOT_POSITION_CONTENT;
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    const target: HTMLElement = editor.inputElement.querySelector('td');
                    setCursorPoint(target.firstChild, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickToolbar: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const editPanel: HTMLElement = editor.inputElement;
                        const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
                        const editPanelRect: ClientRect = editPanel.getBoundingClientRect();
                        expect(quikTBarRect.top).toBeGreaterThanOrEqual(editPanelRect.top);
                        expect(editor.quickToolbarModule.tableQTBar.popupObj.collision.Y).toBe('flip');
                        expect(editor.quickToolbarModule.tableQTBar.popupObj.position.Y).toBe('bottom');
                        done();
                    }, 100);
                });
                it('CASE 3: Should open table quick toolbar with fit collision.', (done : DoneFn)=> {
                    editor.height = '300px';
                    editor.focusIn();
                    window.scrollTo(0, 100);
                    editor.inputElement.innerHTML = TABLE_FIT_POSITION_CONTENT;
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    const target: HTMLElement = editor.inputElement.querySelector('td');
                    setCursorPoint(target.firstChild, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickToolbar: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const editPanel: HTMLElement = editor.inputElement;
                        const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
                        const editPanelRect: ClientRect = editPanel.getBoundingClientRect();
                        expect(quikTBarRect.top).toBeGreaterThanOrEqual(editPanelRect.top)
                        expect(editor.quickToolbarModule.tableQTBar.popupObj.collision.Y).toBe('fit');
                        done();
                    }, 100);
                });
                it('CASE 4: Should open table quick toolbar with bottom with main toolbar expanded.', (done : DoneFn)=> {
                    editor.focusIn();
                    window.scrollTo(0, 100);
                    editor.inputElement.innerHTML = TABLE_FIT_POSITION_CONTENT;
                    const expandButton: HTMLElement = editor.element.querySelector('.e-toolbar-wrapper .e-hor-nav.e-expended-nav');
                    expandButton.click();
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    const target: HTMLElement = editor.inputElement.querySelector('td');
                    setCursorPoint(target.firstChild, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickToolbar: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const editPanel: HTMLElement = editor.inputElement;
                        const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
                        const editPanelRect: ClientRect = editPanel.getBoundingClientRect();
                        expect(quikTBarRect.top).toBeGreaterThanOrEqual(editPanelRect.top);
                        const mainToolbarRect: DOMRect = editor.getToolbarElement().getBoundingClientRect() as DOMRect;
                        expect(quikTBarRect.top).toBeGreaterThanOrEqual(mainToolbarRect.bottom);
                        done();
                    }, 100);
                });
            });
        });

        describe('962038: Table quick toolbar fit collision does not work in Overview sample demos.', ()=> {
            let editor: RichTextEditor;
            let wrapperElement: HTMLElement;
            beforeAll(()=> {
                wrapperElement = createElement('div', { className: 'e-editor-wrapper'});
                wrapperElement.style.overflow = 'auto';
                wrapperElement.style.height = '500px';
                const editorRoot: HTMLElement = createElement('div', { className: 'editor'});
                editorRoot.id = 'element_962038';
                wrapperElement.append(editorRoot);
                document.body.append(wrapperElement);
                editor = new RichTextEditor({
                    toolbarSettings: {
                        items: ['Audio']
                    }
                }, '#element_962038');
            });
            afterAll(()=> {
                editor.destroy();
                wrapperElement.remove();
            });
            it('Should open the table quick toolbar on correct position when clicking on the table.', (done: DoneFn)=> {
                editor.inputElement.innerHTML = TABLE_FIT_POSITION_CONTENT;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                wrapperElement.scrollTop = 50;
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickToolbar: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const editPanel: HTMLElement = editor.inputElement;
                    const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
                    const editPanelRect: ClientRect = editPanel.getBoundingClientRect();
                    expect(quikTBarRect.top).toBeGreaterThanOrEqual(editPanelRect.top);
                    done();
                }, 100);
            });
        });

        describe('966006: Text Quick toolbar shows on three rows only when the last table column is selected..', () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    quickToolbarSettings: {
                            text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                    },
                    value: OVERVIEW_CONTENT
                });
            });
            afterAll(() => {
                destroy(editor);
            });
            
            it('Should have proper relateTo Element to the Quick toolbar popup.', (done : DoneFn)=> {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelectorAll('th')[5];
                setSelection(target.firstChild, 16, 17);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.textQTBar.popupObj.relateTo as HTMLElement).nodeName).toBe('TABLE');
                    done();
                }, 100);
            });
        });

        describe('965993: Last character selection results in quick toolbar with improper tip pointer position.', () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    quickToolbarSettings: {
                            text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                    },
                    value: EDITOR_CONTENT,
                    beforeQuickToolbarOpen: (args: BeforeQuickToolbarOpenArgs)=> {
                        args.cancel = true;  
                    }
                    
                });
            });
            afterAll(() => {
                destroy(editor);
            });
            
            it('Should have the maxwidth 75% before rendering the quick toolbar.', (done : DoneFn)=> {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('p');
                setSelection(target.firstChild, 1, 2);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect(editor.quickToolbarModule.textQTBar.element.style.maxWidth).toBe('75%');
                    done();
                }, 100);
            });
        });

        describe('962330: Text Quick Toolbar: Format Options Disappear After Scrolling the Page', () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    quickToolbarSettings: {
                        text: ['Formats', 'FontName']
                    },
                    value: `<p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>`
                });
            });
            afterAll(() => {
                destroy(editor);
            });
            
            it('should show toolbar with status applied', (done : DoneFn)=> {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('p');
                setSelection(target.firstChild, 1, 2);
                editor.inputElement.parentElement.scrollTop = 130;
                target.dispatchEvent(MOUSEUP_EVENT);
                editor.quickToolbarModule.textQTBar.showPopup(target, null)
                setTimeout(() => {
                    const dropDownvalue: string = '<span style="display: inline-flex;width:65px" ><span class="e-rte-dropdown-btn-text">Paragraph</span></span>';
                    expect((editor.quickToolbarModule.textQTBar as any).dropDownButtons.formatDropDown.content).toBe(dropDownvalue);
                    done();
                }, 100);
            });
        
        });

        describe('964505: Quick toolbar position is not refreshed when the window is resized.', ()=> {
            let editor: RichTextEditor;
            let refreshMethodSpy: jasmine.Spy;
            beforeAll(()=> {
                editor = renderRTE({
                    value: EDITOR_CONTENT,
                    quickToolbarSettings: {
                        text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                    },
                });
            });
            afterAll(()=> {
                destroy(editor);
            });
            it('Should call the RefreshPopup method on window resize.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('p');
                setSelection(target.firstChild, 1, 2);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    expect(quickPopup).not.toBe(null);
                    refreshMethodSpy = spyOn(editor.quickToolbarModule, "refreshQuickToolbarPopup");
                    window.dispatchEvent(new Event('resize'));
                    setTimeout(() => {
                        expect(refreshMethodSpy).toHaveBeenCalled();
                        done();
                    }, 100);
                }, 100);
            });
        });

        describe('966020: Table Quick toolbar position is not refreshed instantly when scrolling.', ()=> {
            let editor: RichTextEditor;
            let dataBindSpy: jasmine.Spy;
            beforeAll(()=> {
                editor = renderRTE({
                    value: EDITOR_CONTENT,
                    quickToolbarSettings: {
                        text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                    },
                });
            });
            afterAll(()=> {
                destroy(editor);
            });
            it('Should call the dataBind method when the quick toolbar is shown.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('p');
                setSelection(target.firstChild, 1, 2);
                target.dispatchEvent(MOUSEUP_EVENT);
                dataBindSpy = spyOn(editor.quickToolbarModule.textQTBar.popupObj, "dataBind");
                setTimeout(() => {
                    expect(dataBindSpy).toHaveBeenCalled();
                    done();
                }, 100);
            });
        });

        describe('966000: Link Quick toolbar not collided when there is no bottom space reference to viewport.' , () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    quickToolbarSettings: {
                            text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                    },
                    value: OVERVIEW_CONTENT,
                    height: '300px'
                });
            });
            afterAll(() => {
                destroy(editor);
            });
            
            it('Should Open on top position instead of bottom.', (done : DoneFn)=> {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelectorAll('li')[1];
                setSelection(target.firstChild, 1, 2);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.textQTBar as any).currentTipPosition).toBe('Bottom-Left');
                    done();
                }, 100);
            });
        });

        describe('968649: Quick toolbar is shown on bottom position in Bold Desk Agent portal.', ()=> {
            let editor: RichTextEditor;
            let wrapperElement: HTMLElement;
            beforeAll(()=> {
                wrapperElement = createElement('div', { className: 'e-editor-wrapper'});
                wrapperElement.style.overflow = 'auto';
                wrapperElement.style.height = '500px';
                const editorRoot: HTMLElement = createElement('div', { className: 'editor'});
                editorRoot.id = 'element_968649';
                wrapperElement.append(editorRoot);
                wrapperElement.append(createElement('h1').innerHTML = 'This issues is only replicated inside the Bold desk source.')
                document.body.append(wrapperElement);
                editor = new RichTextEditor({
                    toolbarSettings: {
                        enableFloating : false
                    },
                }, '#element_968649');
            });
            afterAll(()=> {
                editor.destroy();
                wrapperElement.remove();
            });
            it('Should open the table quick toolbar on correct position when clicking on the table.', (done: DoneFn)=> {
                editor.inputElement.innerHTML = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p>';
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                wrapperElement.scrollTop = 50;
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickToolbar: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const editPanel: HTMLElement = editor.inputElement;
                    const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
                    const editPanelRect: ClientRect = editPanel.getBoundingClientRect();
                    expect(quikTBarRect.top).toBeGreaterThanOrEqual(editPanelRect.top)
                    expect(editor.quickToolbarModule.tableQTBar.popupObj.collision.Y).toBe('fit');
                    done();
                }, 100);
            });
        });

        describe('963453: To provide Quick Toolbar Fit collision support for the media elements in IFrame editor.', ()=> {
            let editor: RichTextEditor;
            beforeAll(()=> {
                editor = renderRTE({
                    value: OVERVIEW_CONTENT,
                    quickToolbarSettings: {
                        text: ['Formats', '|', 'Bold', 'Italic', 'Fontcolor', 'BackgroundColor', '|', 'CreateLink', 'Image', 'CreateTable', 'Blockquote', '|' , 'Unorderedlist', 'Orderedlist', 'Indent', 'Outdent']
                    }
                });
            });
            afterAll(()=> {
                destroy(editor);
            });
            it ('Should not have action on scroll property set to popup.', (done : DoneFn)=> {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('p');
                setSelection(target.firstChild, 1, 2);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect(editor.quickToolbarModule.textQTBar.popupObj.actionOnScroll).toBe('none'); // Reposition causes memory leak.
                    done();
                }, 100);
            });
        });
    });

    describe('IFrame', ()=> {
        beforeAll((done: DoneFn)=> {
            const link: HTMLLinkElement = document.createElement('link');
            link.href = '/base/demos/themes/material.css';
            link.rel = 'stylesheet';
            link.id = 'materialTheme';
            link.onload= ()=> {
                done(); // Style should be loaded before done() called
            };
            link.onerror = (e) => {
                fail(`Failed to load stylesheet: ${link.href}`);
                done(); // still end the test run to avoid hanging
            };
            document.head.appendChild(link);

        });
        afterAll((done: DoneFn)=> {
            document.getElementById('materialTheme').remove();
            done();
        });

        describe('Rendering testing.', ()=> {
            let editor: RichTextEditor;

            beforeAll(() => {
                editor = renderRTE({
                    iframeSettings: {
                        enable: true
                    },
                    quickToolbarSettings: {
                        text: ['Cut', 'Copy', 'Paste']
                    },
                    value: EDITOR_CONTENT
                });
            });

            afterAll(() => {
                destroy(editor);
            });

            it("Should open Link quick toolbar.", (done: DoneFn) => {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('a');
                setCursorPoint(target.firstChild, 2);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Link_Quick_Popup') >= 0).toBe(true);
                    expect(editor.quickToolbarSettings.link.length).toBe(3);
                    editor.inputElement.blur();
                    done();
                }, 100);
            });

            it("Should open Image quick toolbar.", (done: DoneFn) => {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Image_Quick_Popup') >= 0).toBe(true);
                    expect(editor.quickToolbarSettings.image.length).toBe(14);
                    editor.inputElement.blur();
                    done();
                }, 100);
            });

            it("Should open Video quick toolbar.", (done: DoneFn) => {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('video');
                setSelection(target, 0, 1);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect(editor.quickToolbarSettings.video.length).toBe(6);
                    expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Video_Quick_Popup') >= 0).toBe(true);
                    editor.inputElement.blur();
                    done();
                }, 100);
            });

            it("Should open Text quick toolbar.", (done: DoneFn) => {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('p');
                setSelection(target.firstChild, 1, 2);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect(editor.quickToolbarSettings.text.length).toBe(3);
                    expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Text_Quick_Popup') >= 0).toBe(true);
                    editor.inputElement.blur();
                    done();
                }, 100);
            });

            it("Should open Table quick toolbar.", (done: DoneFn) => {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect(editor.quickToolbarSettings.text.length).toBe(3);
                    expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Table_Quick_Popup') >= 0).toBe(true);
                    editor.inputElement.blur();
                    done();
                }, 100);
            });
        });

        describe('Backwards selection testing', ()=> {
            let editor: RichTextEditor;
            beforeAll(()=> {
                editor = renderRTE({
                    iframeSettings: {
                        enable: true
                    },
                    quickToolbarSettings: {
                        text: ['Bold', 'Italic', 'Underline', 'StrikeThrough'],
                    },
                    height: '300px',
                    value: `<h1>Welcome to the Syncfusion<sup>®</sup> Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>,<code>InlineCode</code>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion<sup>®</sup> Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br/></th> <th style="width: 23.2295%"><span>Name</span><br/></th> <th style="width: 9.91501%"><span>Age</span><br/></th> <th style="width: 15.5807%"><span>Gender</span><br/></th> <th style="width: 17.9887%"><span>Occupation</span><br/></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br/></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br/></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br/></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br/></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br/></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-imginline" /></p>`
                });
            });

            afterAll(()=> {
                destroy(editor);
            });

            it('Should open the quick toolbar above the selected text content and tip pointer should be bottom right middle.', (done : DoneFn)=> {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('p');
                const range: Range = new Range();
                range.setEnd(editor.inputElement.querySelector('li').firstChild, 60);
                range.setStart(editor.inputElement.querySelector('li').firstChild, 0);
                editor.selectRange(range);
                editor.inputElement.ownerDocument.defaultView.getSelection().extend(editor.inputElement.querySelector('p').firstChild, 15)
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    // Only SUCCESS in HEADLESS CHROME.
                    expect((editor.quickToolbarModule.textQTBar as any).currentTipPosition).toBe('Bottom-RightMiddle');
                    const popupElement: HTMLElement = editor.quickToolbarModule.textQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.textQTBar.previousTarget as HTMLElement;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(iframeRect.top + blockElement.getBoundingClientRect().top).toBeGreaterThan(popupElement.getBoundingClientRect().bottom);
                    done();
                }, 100);
            });
        });

        describe('Backwards selection testing', () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    iframeSettings: {
                        enable: true
                    },
                    quickToolbarSettings: {
                        text: ['Bold', 'Italic', 'Underline', 'StrikeThrough'],
                    },
                    height: '300px',
                    value: `<h1>Welcome to the Syncfusion<sup>®</sup> Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>,<code>InlineCode</code>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion<sup>®</sup> Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br/></th> <th style="width: 23.2295%"><span>Name</span><br/></th> <th style="width: 9.91501%"><span>Age</span><br/></th> <th style="width: 15.5807%"><span>Gender</span><br/></th> <th style="width: 17.9887%"><span>Occupation</span><br/></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br/></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br/></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br/></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br/></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br/></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-imginline" /></p>`
                });
            });
            afterAll(() => {
                destroy(editor);
            });
            it('Should not open the quick toolbar above the selected text content and tip pointer should be Top center.', (done: DoneFn) => {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('h1');
                const range: Range = new Range();
                range.setEnd(editor.inputElement.querySelector('li').firstChild, 60);
                range.setStart(editor.inputElement.querySelector('li').firstChild, 0);
                editor.inputElement.ownerDocument.defaultView.getSelection().extend(editor.inputElement.querySelector('h1').firstChild, 15)
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    // Only SUCCESS in HEADLESS CHROME.
                    expect((editor.quickToolbarModule.textQTBar as any).currentTipPosition).toBe('Top-Right');
                    const popupElement: HTMLElement = editor.quickToolbarModule.textQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.textQTBar.previousTarget as HTMLElement;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(iframeRect.top + blockElement.getBoundingClientRect().top).not.toBeGreaterThan(popupElement.getBoundingClientRect().bottom);
                    done();
                }, 100);
            });
        });

        describe ('Last block collision Position testing', ()=> {
            let editor: RichTextEditor;
            beforeAll(()=> {
                editor = renderRTE({
                    iframeSettings: {
                        enable: true
                    },
                    quickToolbarSettings: {
                        text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                    },
                    height: '300px',
                    value: `<h1>Welcome to the Syncfusion<sup>®</sup> Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>,<code>InlineCode</code>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion<sup>®</sup> Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br/></th> <th style="width: 23.2295%"><span>Name</span><br/></th> <th style="width: 9.91501%"><span>Age</span><br/></th> <th style="width: 15.5807%"><span>Gender</span><br/></th> <th style="width: 17.9887%"><span>Occupation</span><br/></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br/></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br/></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br/></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br/></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br/></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-imginline" /></p>`
                });
            });

            afterAll(()=> {
                destroy(editor);
            });

            it('Should flip and open the quick toolbar.', (done : DoneFn)=> {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('li');
                setSelection(target.firstChild, 1, 2);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(()=>{
                    expect((editor.quickToolbarModule.textQTBar as any).currentTipPosition).toBe('Bottom-Left');
                    const popupElement: HTMLElement = editor.quickToolbarModule.textQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.textQTBar.previousTarget as HTMLElement;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(iframeRect.top + blockElement.getBoundingClientRect().bottom).toBeGreaterThan(popupElement.getBoundingClientRect().bottom);
                    done();
                }, 100);
            });
        });

        describe ('Content scrolled Position testing ', ()=> {

            let editor: RichTextEditor;
            beforeAll(()=> {
                editor = renderRTE({
                    iframeSettings: {
                        enable: true
                    },
                    quickToolbarSettings: {
                        text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                    },
                    height: '320px',
                    value: `<h1>Welcome to the Syncfusion<sup>®</sup> Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>,<code>InlineCode</code>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion<sup>®</sup> Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br/></th> <th style="width: 23.2295%"><span>Name</span><br/></th> <th style="width: 9.91501%"><span>Age</span><br/></th> <th style="width: 15.5807%"><span>Gender</span><br/></th> <th style="width: 17.9887%"><span>Occupation</span><br/></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br/></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br/></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br/></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br/></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br/></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-imginline" /></p>`
                });
            });

            afterAll(()=> {
                destroy(editor);
            });

            it('Should open the quick toolbar with respect to scroll position.', (done : DoneFn)=> {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('p');
                setSelection(target.firstChild, 1, 2);
                editor.inputElement.parentElement.scrollTop = 130;
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.textQTBar as any).currentTipPosition).toBe('Top-Left');
                    const popupElement: HTMLElement = editor.quickToolbarModule.textQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.textQTBar.previousTarget as HTMLElement;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(popupElement.getBoundingClientRect().top).toBeGreaterThan(iframeRect.top + blockElement.getBoundingClientRect().top);
                    done();
                }, 100);
            });
        });

        describe('963991: Image Quick Toolbar Appears in Middle of Editor Instead of on Image After Scrolling and Right-Click.', ()=> {
            let editor: RichTextEditor;
            let wrapperElement: HTMLElement;
            beforeAll(()=> {
                wrapperElement = createElement('div', { className: 'e-editor-wrapper'});
                wrapperElement.style.overflow = 'auto';
                wrapperElement.style.height = '500px';
                const editorRoot: HTMLElement = createElement('div', { className: 'editor'});
                editorRoot.id = 'element_963991';
                wrapperElement.append(editorRoot);
                document.body.append(wrapperElement);
                editor = new RichTextEditor({
                    toolbarSettings: {
                        items: ['Audio']
                    },
                    iframeSettings: {
                        enable: true
                    }
                }, '#element_963991');
            });
            afterAll(()=> {
                editor.destroy();
                wrapperElement.remove();
            });
            it('Should open the table quick toolbar on correct position when clicking on the table.', (done: DoneFn)=> {
                editor.inputElement.innerHTML = TABLE_FIT_POSITION_CONTENT;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                wrapperElement.scrollTop = 50;
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickToolbar: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const editPanel: HTMLElement = editor.inputElement;
                    const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
                    const editPanelRect: ClientRect = editPanel.getBoundingClientRect();
                    expect(quikTBarRect.top).toBeGreaterThanOrEqual(editPanelRect.top);
                    done();
                }, 100);
            });
        });

        describe('963453: To provide Quick Toolbar Fit collision support for the media elements in IFrame editor.', ()=> {
            let editor: RichTextEditor;
            beforeEach(()=> {
                editor = renderRTE({
                    iframeSettings: {
                        enable: true
                    },
                    toolbarSettings: {
                        items: ['Undo', 'Redo', '|', 'ImportWord', 'ExportWord', 'ExportPdf', '|',
                            'Bold', 'Italic', 'Underline', 'StrikeThrough', 'InlineCode', 'SuperScript', 'SubScript', '|',
                            'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                            'LowerCase', 'UpperCase', '|',
                            'Formats', 'Alignments', 'Blockquote', '|', 'NumberFormatList', 'BulletFormatList', '|',
                            'Outdent', 'Indent', '|', 'CreateLink', 'Image', 'FileManager', 'Video', 'Audio', 'CreateTable', '|', 'FormatPainter', 'ClearFormat',
                            '|', 'EmojiPicker', 'Print', '|',
                            'SourceCode', 'FullScreen']
                    },
                    quickToolbarSettings: {
                        text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                    },
                    height: '350px',
                });
            });

            afterEach(()=> {
                destroy(editor);
            });

            it('CASE 1: Should open table quick toolbar with top.', (done : DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = TABLE_TOP_POSITION_CONTENT;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickToolbar: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const mainToolbar: HTMLElement = editor.element.querySelector('.e-toolbar-wrapper');
                    const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
                    const mainTBarRect: ClientRect = mainToolbar.getBoundingClientRect();
                    expect(quikTBarRect.top).toBeGreaterThanOrEqual(mainTBarRect.bottom);
                    expect(editor.quickToolbarModule.tableQTBar.popupObj.collision.Y).toBe('flip');
                    expect(editor.quickToolbarModule.tableQTBar.popupObj.position.Y).toBe('top');
                    done();
                }, 100);
            });
            it('CASE 2: Should open table quick toolbar with bottom.', (done : DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = TABLE_BOT_POSITION_CONTENT;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickToolbar: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const mainToolbar: HTMLElement = editor.element.querySelector('.e-toolbar-wrapper');
                    const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
                    const mainTBarRect: ClientRect = mainToolbar.getBoundingClientRect();
                    expect(quikTBarRect.top).toBeGreaterThanOrEqual(mainTBarRect.bottom);
                    expect(editor.quickToolbarModule.tableQTBar.popupObj.collision.Y).toBe('flip');
                    expect(editor.quickToolbarModule.tableQTBar.popupObj.position.Y).toBe('top');
                    const tipPointer: TipPointerPosition = (editor.quickToolbarModule.tableQTBar as any).currentTipPosition as TipPointerPosition;
                    expect(tipPointer).toBe('Top-Center');
                    done();
                }, 100);
            });
        });

        describe('963453: To provide Quick Toolbar Fit collision support for the media elements in IFrame editor.', ()=> {
            let editor: RichTextEditor;
            let wrapperElement: HTMLElement;
            beforeAll(()=> {
                wrapperElement = createElement('div', { className: 'e-editor-wrapper'});
                wrapperElement.style.overflow = 'auto';
                wrapperElement.style.height = '200px';
                const editorRoot: HTMLElement = createElement('div', { className: 'editor'});
                editorRoot.id = 'element_963453';
                wrapperElement.append(editorRoot);
                document.body.append(wrapperElement);
                editor = new RichTextEditor({
                    iframeSettings: {
                        enable: true
                    }
                }, '#element_963453');
            });
            afterAll(()=> {
                editor.destroy();
                wrapperElement.remove();
            });
            it('Should open with fit position with tip pointer as none.', (done: DoneFn)=> {
                editor.inputElement.innerHTML = TABLE_FIT_POSITION_CONTENT;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('None');
                    done();
                }, 100);
            });
        });

        describe('971203: Image Quick toolbar fails to trigger in IFrame Editor - Case 1 Height Auto Enable Floating true.', ()=> {
            let editor: RichTextEditor;
    
            beforeEach(()=> {
                editor = renderRTE({
                    iframeSettings: {
                        enable: true
                    },
                    toolbarSettings: {
                        items: ['Undo', 'Redo', '|', 'ImportWord', 'ExportWord', 'ExportPdf', '|',
                            'Bold', 'Italic', 'Underline', 'StrikeThrough', 'InlineCode', 'SuperScript', 'SubScript', '|',
                            'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                            'LowerCase', 'UpperCase', '|',
                            'Formats', 'Alignments', 'Blockquote', '|', 'NumberFormatList', 'BulletFormatList', '|',
                            'Outdent', 'Indent', '|', 'CreateLink', 'Image', 'FileManager', 'Video', 'Audio', 'CreateTable', '|', 'FormatPainter', 'ClearFormat',
                            '|', 'EmojiPicker', 'Print', '|',
                            'SourceCode', 'FullScreen']
                    },
                    quickToolbarSettings: {
                        text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                    },
                });
            });
            afterEach(()=> {
                destroy(editor);
            });
            it ('Top Position Testing Should open on top position.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = TABLE_TOP_POSITION_CONTENT;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('Bottom-Center');
                    const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                    const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(iframeRect.top + blockRect.top).toBeGreaterThan(popupElement.getBoundingClientRect().bottom);
                    done();
                }, 100);
            });
            it ('Bottom Position Testing Should open on top position.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p><p><br></p><p><br></p>';
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const inputEvent: Event = new Event('input', BASIC_MOUSE_EVENT_INIT);
                setTimeout(() => {
                    editor.inputElement.dispatchEvent(inputEvent);
                    const target: HTMLElement = editor.inputElement.querySelector('td');
                    setCursorPoint(target.firstChild, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        // Only SUCCESS in HEADLESS CHROME.
                        expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('Top-Center');
                        const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                        const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                        const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                        const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                        expect(popupElement.getBoundingClientRect().bottom).toBeGreaterThan(iframeRect.top + blockRect.bottom);
                        done();
                    }, 100);
                }, 100);
            });
            it ('Fit Position Testing Should open on top position.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p>`;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('None');
                    const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                    const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(popupElement.getBoundingClientRect().bottom).toBeGreaterThan(iframeRect.top + blockRect.top);
                    expect(editor.quickToolbarModule.tableQTBar.popupObj.offsetY as number).toBe(-1);
                    done();
                }, 100);
            });
        });

        describe('971203: Image Quick toolbar fails to trigger in IFrame Editor - Case 2 Height Auto Enable Floating false.', ()=> {
            let editor: RichTextEditor;
    
            beforeEach(()=> {
                document.body.style.height= '150vh';
                editor = renderRTE({
                    iframeSettings: {
                        enable: true
                    },
                    toolbarSettings: {
                        enableFloating: false,
                        items: ['Undo', 'Redo', '|', 'ImportWord', 'ExportWord', 'ExportPdf', '|',
                            'Bold', 'Italic', 'Underline', 'StrikeThrough', 'InlineCode', 'SuperScript', 'SubScript', '|',
                            'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                            'LowerCase', 'UpperCase', '|',
                            'Formats', 'Alignments', 'Blockquote', '|', 'NumberFormatList', 'BulletFormatList', '|',
                            'Outdent', 'Indent', '|', 'CreateLink', 'Image', 'FileManager', 'Video', 'Audio', 'CreateTable', '|', 'FormatPainter', 'ClearFormat',
                            '|', 'EmojiPicker', 'Print', '|',
                            'SourceCode', 'FullScreen']
                    },
                    quickToolbarSettings: {
                        text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                    },
                });
            });
            afterEach(()=> {
                destroy(editor);
                document.body.style.height = '';
            });
            it ('Top Position Testing Should open on top position.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = TABLE_TOP_POSITION_CONTENT;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('Bottom-Center');
                    const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                    const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(iframeRect.top + blockRect.top).toBeGreaterThan(popupElement.getBoundingClientRect().bottom);
                    done();
                }, 100);
            });
            it ('Bottom Position Testing Should open on top position.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p><p><br></p><p><br></p>';
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const inputEvent: Event = new Event('input', BASIC_MOUSE_EVENT_INIT);
                editor.inputElement.dispatchEvent(inputEvent);
                setTimeout(() => {
                    const target: HTMLElement = editor.inputElement.querySelector('td');
                    setCursorPoint(target.firstChild, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        // Only SUCCESS in HEADLESS CHROME.
                        expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('Top-Center');
                        const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                        const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                        const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                        const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                        expect(popupElement.getBoundingClientRect().bottom).toBeGreaterThan(iframeRect.top + blockRect.bottom);
                        done();
                    }, 100);
                }, 100);
            });
            it ('Fit Position Testing Should open on top position.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p>`;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('None');
                    const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                    const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(popupElement.getBoundingClientRect().bottom).toBeGreaterThan(iframeRect.top + blockRect.top);
                    expect(editor.quickToolbarModule.tableQTBar.popupObj.offsetY as number).toBe(-1);
                    done();
                }, 100);
            });
            it ('Top Position Testing Should open on top position. Toolbar hidden in ViewPort.', (done: DoneFn)=> {
                window.scrollTo(0, 60);
                editor.focusIn();
                editor.inputElement.innerHTML = TABLE_TOP_POSITION_CONTENT;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('Bottom-Center');
                    const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                    const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(iframeRect.top + blockRect.top).toBeGreaterThan(popupElement.getBoundingClientRect().bottom);
                    done();
                }, 100);
            });
            it ('Bottom Position Testing Should open on top position. Toolbar hidden in ViewPort.', (done: DoneFn)=> {
                window.scrollTo(0, 60);
                editor.focusIn();
                editor.inputElement.innerHTML = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p><p><br></p><p><br></p>';
                const inputEvent: Event = new Event('input', BASIC_MOUSE_EVENT_INIT);
                editor.inputElement.dispatchEvent(inputEvent);
                setTimeout(() => {
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    const target: HTMLElement = editor.inputElement.querySelector('td');
                    setCursorPoint(target.firstChild, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        // Only SUCCESS in HEADLESS CHROME.
                        expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('Top-Center');
                        const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                        const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                        const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                        const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                        expect(popupElement.getBoundingClientRect().bottom).toBeGreaterThan(iframeRect.top + blockRect.bottom);
                        done();
                    }, 100);
                }, 100);
            });
            it ('Fit Position Testing Should open on top position. Toolbar hidden in ViewPort.', (done: DoneFn)=> {
                window.scrollTo(0, 60);
                editor.focusIn();
                editor.inputElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p>`;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('None');
                    const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                    const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(popupElement.getBoundingClientRect().bottom).toBeGreaterThan(iframeRect.top + blockRect.top);
                    done();
                }, 100);
            });
        });

        describe('971203: Image Quick toolbar fails to trigger in IFrame Editor - Case 3 Height Static Enable Floating true.', ()=> {
            let editor: RichTextEditor;
    
            beforeEach(()=> {
                editor = renderRTE({
                    iframeSettings: {
                        enable: true
                    },
                    toolbarSettings: {
                        items: ['Undo', 'Redo', '|', 'ImportWord', 'ExportWord', 'ExportPdf', '|',
                            'Bold', 'Italic', 'Underline', 'StrikeThrough', 'InlineCode', 'SuperScript', 'SubScript', '|',
                            'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                            'LowerCase', 'UpperCase', '|',
                            'Formats', 'Alignments', 'Blockquote', '|', 'NumberFormatList', 'BulletFormatList', '|',
                            'Outdent', 'Indent', '|', 'CreateLink', 'Image', 'FileManager', 'Video', 'Audio', 'CreateTable', '|', 'FormatPainter', 'ClearFormat',
                            '|', 'EmojiPicker', 'Print', '|',
                            'SourceCode', 'FullScreen']
                    },
                    quickToolbarSettings: {
                        text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                    },
                    height: '350px',
                });
            });
            afterEach(()=> {
                destroy(editor);
            });
            it ('Top Position Testing Should open on top position.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = TABLE_TOP_POSITION_CONTENT;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('Bottom-Center');
                    const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                    const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(iframeRect.top + blockRect.top).toBeGreaterThan(popupElement.getBoundingClientRect().bottom);
                    done();
                }, 100);
            });
            it ('Bottom Position Testing Should open on top position.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p><p><br></p><p><br></p>';
                const inputEvent: Event = new Event('input', BASIC_MOUSE_EVENT_INIT);
                editor.inputElement.dispatchEvent(inputEvent);
                setTimeout(() => {
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    const target: HTMLElement = editor.inputElement.querySelector('td');
                    setCursorPoint(target.firstChild, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        // Only SUCCESS in HEADLESS CHROME.
                        expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('Top-Center');
                        const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                        const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                        const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                        const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                        expect(popupElement.getBoundingClientRect().bottom).toBeGreaterThan(iframeRect.top + blockRect.bottom);
                        done();
                    }, 100);
                }, 100);
            });
            it ('Fit Position Testing Should open on top position.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p>`;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('None');
                    const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                    const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(popupElement.getBoundingClientRect().bottom).toBeGreaterThan(iframeRect.top + blockRect.top);
                    expect(editor.quickToolbarModule.tableQTBar.popupObj.offsetY as number).toBe(-1);
                    done();
                }, 100);
            });
        });

        describe('971203: Image Quick toolbar fails to trigger in IFrame Editor - Case 4 Height Static Enable Floating false.', ()=> {
            let editor: RichTextEditor;
    
            beforeEach(()=> {
                document.body.style.height= '150vh';
                editor = renderRTE({
                    iframeSettings: {
                        enable: true
                    },
                    toolbarSettings: {
                        enableFloating: false,
                        items: ['Undo', 'Redo', '|', 'ImportWord', 'ExportWord', 'ExportPdf', '|',
                            'Bold', 'Italic', 'Underline', 'StrikeThrough', 'InlineCode', 'SuperScript', 'SubScript', '|',
                            'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                            'LowerCase', 'UpperCase', '|',
                            'Formats', 'Alignments', 'Blockquote', '|', 'NumberFormatList', 'BulletFormatList', '|',
                            'Outdent', 'Indent', '|', 'CreateLink', 'Image', 'FileManager', 'Video', 'Audio', 'CreateTable', '|', 'FormatPainter', 'ClearFormat',
                            '|', 'EmojiPicker', 'Print', '|',
                            'SourceCode', 'FullScreen']
                    },
                    quickToolbarSettings: {
                        text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                    },
                    height: '350px',
                });
            });
            afterEach(()=> {
                destroy(editor);
                document.body.style.height = '';
            });
            it ('Top Position Testing Should open on top position.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = TABLE_TOP_POSITION_CONTENT;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('Bottom-Center');
                    const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                    const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(iframeRect.top + blockRect.top).toBeGreaterThan(popupElement.getBoundingClientRect().bottom);
                    done();
                }, 100);
            });
            it ('Bottom Position Testing Should open on top position.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p><p><br></p><p><br></p>';
                const inputEvent: Event = new Event('input', BASIC_MOUSE_EVENT_INIT);
                editor.inputElement.dispatchEvent(inputEvent);
                setTimeout(() => {
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    const target: HTMLElement = editor.inputElement.querySelector('td');
                    setCursorPoint(target.firstChild, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        // Only SUCCESS in HEADLESS CHROME.
                        expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('Top-Center');
                        const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                        const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                        const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                        const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                        expect(popupElement.getBoundingClientRect().bottom).toBeGreaterThan(iframeRect.top + blockRect.bottom);
                        done();
                    }, 100);
                }, 100);
            });
            it ('Fit Position Testing Should open on top position.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p>`;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('None');
                    const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                    const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(popupElement.getBoundingClientRect().bottom).toBeGreaterThan(iframeRect.top + blockRect.top);
                    expect(editor.quickToolbarModule.tableQTBar.popupObj.offsetY as number).toBe(-1);
                    done();
                }, 100);
            });
            it ('Top Position Testing Should open on top position. Toolbar hidden in ViewPort.', (done: DoneFn)=> {
                window.scrollTo(0, 60);
                editor.focusIn();
                editor.inputElement.innerHTML = TABLE_TOP_POSITION_CONTENT;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('Bottom-Center');
                    const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                    const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(iframeRect.top + blockRect.top).toBeGreaterThan(popupElement.getBoundingClientRect().bottom);
                    done();
                }, 100);
            });
            it ('Bottom Position Testing Should open on top position. Toolbar hidden in ViewPort.', (done: DoneFn)=> {
                window.scrollTo(0, 60);
                editor.focusIn();
                editor.inputElement.innerHTML = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p><p><br></p><p><br></p>';
                const inputEvent: Event = new Event('input', BASIC_MOUSE_EVENT_INIT);
                editor.inputElement.dispatchEvent(inputEvent);
                setTimeout(() => {
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    const target: HTMLElement = editor.inputElement.querySelector('td');
                    setCursorPoint(target.firstChild, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        // Only SUCCESS in HEADLESS CHROME.
                        expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('Top-Center');
                        const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                        const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                        const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                        const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                        expect(popupElement.getBoundingClientRect().bottom).toBeGreaterThan(iframeRect.top + blockRect.bottom);
                        done();
                    }, 100);
                }, 100);
            });
            it ('Fit Position Testing Should open on top position. Toolbar hidden in ViewPort.', (done: DoneFn)=> {
                window.scrollTo(0, 60);
                editor.focusIn();
                editor.inputElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p>`;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('None');
                    const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                    const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(popupElement.getBoundingClientRect().bottom).toBeGreaterThan(iframeRect.top + blockRect.top);
                    done();
                }, 100);
            });
        });

        describe('971203: Image Quick toolbar fails to trigger in IFrame Editor - Case 5 Overflow Parent Element Enable Floating true.', ()=> {
            let editor: RichTextEditor;
    
            beforeEach(()=> {
                const rootElem: HTMLElement = createElement('div', { className: 'e-rtetesting-root'});
                document.body.append(rootElem);
                rootElem.innerHTML = `<h3>Text Quick Toolbar Rich Text Editor</h3>
    <table id="property" title="Properties">
        <tbody>
            <tr>
                <td>
                    <div>Action On scroll </div>
                </td>
                <td>
                    <div>
                        <select id="actionOnScroll"> 
                            <option selected ="0">None</option>
                            <option value="1">Hide</option>
                        </select>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div>Enable Show on Right click</div>
                </td>
                <td>
                    <div class="checkbox-container">
                        <input type="checkbox" id="rightClick" checked="false">
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div>Enable IFrame</div>
                </td>
                <td>
                    <div class="checkbox-container">
                        <input type="checkbox" id="ifrmaeCheckbox">
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div>Enable Floating</div>
                </td>
                <td>
                    <div class="checkbox-container">
                        <input type="checkbox" id="floatingCheckbox" checked>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div>Configuration</div>
                </td>
                <td>
                    <div>
                        <select id="configOption"> 
                            <option value="1">Single Row</option>
                            <option value="2">Multi Row</option>
                        </select>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <br>
        <div id="textQuickToolbarRTE" >
        </div>`;
                editor = new RichTextEditor({
                    iframeSettings: {
                        enable: true
                    },
                    toolbarSettings: {
                        items: ['Undo', 'Redo', '|', 'ImportWord', 'ExportWord', 'ExportPdf', '|',
                            'Bold', 'Italic', 'Underline', 'StrikeThrough', 'InlineCode', 'SuperScript', 'SubScript', '|',
                            'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                            'LowerCase', 'UpperCase', '|',
                            'Formats', 'Alignments', 'Blockquote', '|', 'NumberFormatList', 'BulletFormatList', '|',
                            'Outdent', 'Indent', '|', 'CreateLink', 'Image', 'FileManager', 'Video', 'Audio', 'CreateTable', '|', 'FormatPainter', 'ClearFormat',
                            '|', 'EmojiPicker', 'Print', '|',
                            'SourceCode', 'FullScreen']
                    },
                    quickToolbarSettings: {
                        text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                    },
                }, '#textQuickToolbarRTE');
            });
            afterEach(()=> {
                destroy(editor);
                document.body.querySelector('.e-rtetesting-root').remove();
            });
            it ('Top Position Testing Should open on top position.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = TABLE_TOP_POSITION_CONTENT;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('Bottom-Center');
                    const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                    const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(iframeRect.top + blockRect.top).toBeGreaterThan(popupElement.getBoundingClientRect().bottom);
                    done();
                }, 100);
            });
            it ('Bottom Position Testing Should open on top position.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p><p><br></p><p><br></p>';
                const inputEvent: Event = new Event('input', BASIC_MOUSE_EVENT_INIT);
                editor.inputElement.dispatchEvent(inputEvent);
                setTimeout(() => {
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    const target: HTMLElement = editor.inputElement.querySelector('td');
                    setCursorPoint(target.firstChild, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        // Only SUCCESS in HEADLESS CHROME.
                        expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('Top-Center');
                        const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                        const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                        const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                        const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                        expect(popupElement.getBoundingClientRect().bottom).toBeGreaterThan(iframeRect.top + blockRect.bottom);
                        done();
                    }, 100);
                }, 100);
            });
            it ('Fit Position Testing Should open on top position.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p>`;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('None');
                    const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                    const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(popupElement.getBoundingClientRect().bottom).toBeGreaterThan(iframeRect.top + blockRect.top);
                    expect(editor.quickToolbarModule.tableQTBar.popupObj.offsetY as number).toBe(-1);
                    done();
                }, 100);
            });
        });

        describe('971203: Image Quick toolbar fails to trigger in IFrame Editor - Case 6 Overflow Parent Element Enable Floating false.', ()=> {
            let editor: RichTextEditor;
    
            beforeEach(()=> {
                document.body.style.height= '150vh';
                const rootElem: HTMLElement = createElement('div', { className: 'e-rtetesting-root'});
                document.body.append(rootElem);
                rootElem.innerHTML = `<h3>Text Quick Toolbar Rich Text Editor</h3>
    <table id="property" title="Properties">
        <tbody>
            <tr>
                <td>
                    <div>Action On scroll </div>
                </td>
                <td>
                    <div>
                        <select id="actionOnScroll"> 
                            <option selected ="0">None</option>
                            <option value="1">Hide</option>
                        </select>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div>Enable Show on Right click</div>
                </td>
                <td>
                    <div class="checkbox-container">
                        <input type="checkbox" id="rightClick" checked="false">
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div>Enable IFrame</div>
                </td>
                <td>
                    <div class="checkbox-container">
                        <input type="checkbox" id="ifrmaeCheckbox">
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div>Enable Floating</div>
                </td>
                <td>
                    <div class="checkbox-container">
                        <input type="checkbox" id="floatingCheckbox" checked>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div>Configuration</div>
                </td>
                <td>
                    <div>
                        <select id="configOption"> 
                            <option value="1">Single Row</option>
                            <option value="2">Multi Row</option>
                        </select>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <br>
        <div id="textQuickToolbarRTE" >
        </div>`;
                editor = new RichTextEditor({
                    iframeSettings: {
                        enable: true
                    },
                    toolbarSettings: {
                        items: ['Undo', 'Redo', '|', 'ImportWord', 'ExportWord', 'ExportPdf', '|',
                            'Bold', 'Italic', 'Underline', 'StrikeThrough', 'InlineCode', 'SuperScript', 'SubScript', '|',
                            'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                            'LowerCase', 'UpperCase', '|',
                            'Formats', 'Alignments', 'Blockquote', '|', 'NumberFormatList', 'BulletFormatList', '|',
                            'Outdent', 'Indent', '|', 'CreateLink', 'Image', 'FileManager', 'Video', 'Audio', 'CreateTable', '|', 'FormatPainter', 'ClearFormat',
                            '|', 'EmojiPicker', 'Print', '|',
                            'SourceCode', 'FullScreen']
                    },
                    quickToolbarSettings: {
                        text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                    },
                }, '#textQuickToolbarRTE');
            });
            afterEach(()=> {
                destroy(editor);
                document.body.querySelector('.e-rtetesting-root').remove();
                document.body.style.height = '';
            });
            it ('Top Position Testing Should open on top position.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = TABLE_TOP_POSITION_CONTENT;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('Bottom-Center');
                    const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                    const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(iframeRect.top + blockRect.top).toBeGreaterThan(popupElement.getBoundingClientRect().bottom);
                    done();
                }, 100);
            });
            it ('Bottom Position Testing Should open on top position.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p><p><br></p><p><br></p>';
                const inputEvent: Event = new Event('input', BASIC_MOUSE_EVENT_INIT);
                editor.inputElement.dispatchEvent(inputEvent);
                setTimeout(() => {
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    const target: HTMLElement = editor.inputElement.querySelector('td');
                    setCursorPoint(target.firstChild, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        // Only SUCCESS in HEADLESS CHROME.
                        expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('Top-Center');
                        const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                        const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                        const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                        const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                        expect(popupElement.getBoundingClientRect().bottom).toBeGreaterThan(iframeRect.top + blockRect.bottom);
                        done();
                    }, 100);
                }, 100);
            });
            it ('Fit Position Testing Should open on top position.', (done: DoneFn)=> {
                editor.focusIn();
                editor.inputElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p>`;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('None');
                    const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                    const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(popupElement.getBoundingClientRect().bottom).toBeGreaterThan(iframeRect.top + blockRect.top);
                    expect(editor.quickToolbarModule.tableQTBar.popupObj.offsetY as number).toBe(-1);
                    done();
                }, 100);
            });
            it ('Top Position Testing Should open on top position. Toolbar hidden in ViewPort.', (done: DoneFn)=> {
                window.scrollTo(0, 60);
                editor.focusIn();
                editor.inputElement.innerHTML = TABLE_TOP_POSITION_CONTENT;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('Bottom-Center');
                    const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                    const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(iframeRect.top + blockRect.top).toBeGreaterThan(popupElement.getBoundingClientRect().bottom);
                    done();
                }, 100);
            });
            it ('Bottom Position Testing Should open on top position. Toolbar hidden in ViewPort.', (done: DoneFn)=> {
                window.scrollTo(0, 60);
                editor.focusIn();
                editor.inputElement.innerHTML = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p><p><br></p><p><br></p>';
                const inputEvent: Event = new Event('input', BASIC_MOUSE_EVENT_INIT);
                editor.inputElement.dispatchEvent(inputEvent);
                setTimeout(() => {
                    editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    const target: HTMLElement = editor.inputElement.querySelector('td');
                    setCursorPoint(target.firstChild, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        // Only SUCCESS in HEADLESS CHROME.
                        expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('Top-Center');
                        const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                        const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                        const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                        const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                        expect(popupElement.getBoundingClientRect().bottom).toBeGreaterThan(iframeRect.top + blockRect.bottom);
                        done();
                    }, 100);
                }, 100);
            });
            it ('Fit Position Testing Should open on top position. Toolbar hidden in ViewPort.', (done: DoneFn)=> {
                window.scrollTo(0, 60);
                editor.focusIn();
                editor.inputElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p>`;
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('td');
                setCursorPoint(target.firstChild, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect((editor.quickToolbarModule.tableQTBar as any).currentTipPosition).toBe('None');
                    const popupElement: HTMLElement = editor.quickToolbarModule.tableQTBar.popupObj.element;
                    const blockElement: HTMLElement = editor.quickToolbarModule.tableQTBar.previousTarget as HTMLElement;
                    const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;
                    const iframeRect: DOMRect = editor.contentModule.getPanel().getBoundingClientRect() as DOMRect;
                    expect(popupElement.getBoundingClientRect().bottom).toBeGreaterThan(iframeRect.top + blockRect.top);
                    expect(editor.quickToolbarModule.tableQTBar.popupObj.offsetY as number).toBe(-1);
                    done();
                }, 100);
            });
        });
    });

    describe('984019: Inline Toolbar position is not properly calculated on an empty RichTextEditor', () => {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                inlineMode: {
                    enable: true
                },
                focus: ()=> {
                    editor.showInlineToolbar();
                }
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should show the Quick toolbar in View port and add range when the showInlineToolbar method is called.', (done: DoneFn) => {
            editor.focusIn();
            setTimeout(() => {
                const inlineToolbar: HTMLElement = editor.element.querySelector('.e-rte-inline-popup');
                expect(editor).not.toBeNull();
                const range: Range = window.getSelection().getRangeAt(0);
                expect(range.startContainer).toBe(editor.inputElement.firstChild);
                expect(inlineToolbar.getBoundingClientRect().top).toBeGreaterThan(editor.element.getBoundingClientRect().top);
                done();
            }, 100);
        });
    });

    describe('Bug 984457: Inline toolbar doesn"t show properly for the texts with Images in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p><img alt="Editor Features Overview" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" width="400" height="200" class= "e-img-left e-rte-image e-imginline"/>image</p>`,
                inlineMode: {
                    enable: true,
                    onSelection: true
                },
            });
        });
        it('Should show the Quick toolbar in View port', (done) => {
            const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            const mouseDownEvent: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(mouseDownEvent);
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0].childNodes[1], rteObj.inputElement.childNodes[0].childNodes[1], 1, 3);
            const target: HTMLElement = rteObj.inputElement.firstChild as HTMLElement;
            target.dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                const inlineToolbar: HTMLElement = rteObj.element.querySelector('.e-rte-inline-popup');
                expect(rteObj).not.toBeNull();
                expect(inlineToolbar.getBoundingClientRect().top).toBeGreaterThan(rteObj.element.getBoundingClientRect().top);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
});