/* eslint-disable jsdoc/require-jsdoc */
import { RichTextEditorUI } from '../../../src/richtexteditor-ui/index';
import { renderRTE, destroyRTE } from '../../base.spec';
import { BASIC_MOUSE_EVENT_INIT } from '../../constant.spec';
import { getComponent } from '@syncfusion/ej2-base';
import { BaseQuickToolbar } from '../../../src/base/renderer/base-quick-toolbar';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';

function setCursorPoint(element: Element | HTMLElement | ChildNode, point: number): void {
    const ownerDocument: Document = element.nodeType === Node.TEXT_NODE ? element.parentElement.ownerDocument : element.ownerDocument;
    const range: Range = ownerDocument.createRange();
    const sel: Selection = ownerDocument.defaultView.getSelection();
    range.setStart(element, point);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    ownerDocument.dispatchEvent(new Event('selectionchange'));
}

function setSelection(element: Element | HTMLElement | ChildNode, start: number, end: number): void {
    const ownerDocument: Document = element.nodeType === Node.TEXT_NODE ? element.parentElement.ownerDocument : element.ownerDocument;
    const range: Range = ownerDocument.createRange();
    const sel: Selection = ownerDocument.defaultView.getSelection();
    range.setStart(element, start);
    range.setEnd(element, end);
    sel.removeAllRanges();
    sel.addRange(range);
    ownerDocument.dispatchEvent(new Event('selectionchange'));
}

const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);

const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);

const imageSRC: string = 'https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png';

const EDITOR_CONTENT: string = `<p>Text Content</p>
            <p><a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/tailwind3/rich-text-editor/tools.html"  aria-label="Open in new window">Link Content</a></p>
            <p><img alt="Logo" style="width: 300px;" src="${imageSRC}" class="e-rte-image e-img-inline"></p>
            <p><span class="e-video-wrap" contenteditable="false"><video controls="" style="width: 30%;" class="e-rte-video e-video-inline"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4" type="video/mp4"></video></span><br></p>
            <table class="e-rte-table" style="width: 80.4728%; min-width: 0px; height: 406px;"><tbody><tr style="height: 6.38821%;"><td style="width: 50%;">Issues</td><td style="width: 50%;">Status<br></td></tr><tr style="height: 6.38821%;"><td style="width: 50%;" class="">Color picker popup opens outside the editor</td><td style="width: 50%;" class="">Not started</td></tr><tr style="height: 11.5479%;"><td style="width: 50%;" class="">Native quick toolbar opened when text selection on Mobile device</td><td style="width: 50%;" class="">Not Started<br></td></tr><tr style="height: 6.38821%;"><td style="width: 50%;" class="">On window resize dialog does not close.</td><td style="width: 50%;" class="">Not Started</td></tr><tr style="height: 11.5479%;"><td style="width: 50%;" class="">Text quick toolbar opened when the Image resize is completed.</td><td style="width: 50%;" class="">Not Started</td></tr></tbody></table>`;

const OVERVIEW_CONTENT: string = '<h2>Welcome to the Syncfusion<sup>®</sup> Rich Text Editor</h2><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h3>Do you know the key features of the editor?</h3><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">Strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>,<code>InlineCode</code>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion<sup>®</sup> Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h3>Unlock the Power of Tables</h3><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h3>Elevating Your Content with Images</h3><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-img-inline"></p>';

const TABLE_TOP_POSITION_CONTENT: string = '<h2>Welcome to the Syncfusion<sup>®</sup> Rich Text Editor</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h3>Elevating Your Content with Images</h3><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-img-inline"></p>';

const TABLE_FIT_POSITION_CONTENT: string = '<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h3>Elevating Your Content with Images</h3><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-img-inline"></p>';

const TABLE_BOT_POSITION_CONTENT: string = '<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 13.5417%;"> <tr style="height: 13.5417%;"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 17.1875%;"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 17.1875%;"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 17.1875%;"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 17.1875%;"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 17.1875%;"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><p><br></p><p><br></p>';

describe('Base Quick Toolbar', () => {

    describe('Last block collision Position testing', () => {
        let editor: RichTextEditorUI;
        beforeAll(() => {
            editor = renderRTE({
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline', 'Strikethrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'NumberedList', 'BulletList']
                },
                height: '300px',
                valueFormat: 'html',
                value: '<h1>Welcome to the Syncfusion<sup>®</sup> Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">Strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>,<code>InlineCode</code>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion<sup>®</sup> Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br/></th> <th style="width: 23.2295%"><span>Name</span><br/></th> <th style="width: 9.91501%"><span>Age</span><br/></th> <th style="width: 15.5807%"><span>Gender</span><br/></th> <th style="width: 17.9887%"><span>Occupation</span><br/></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br/></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br/></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br/></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br/></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br/></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-img-inline" /></p>'
            });
        });

        afterAll(() => {
            destroyRTE(editor);
        });

        it('Should flip and open the quick toolbar.', (done : DoneFn) => {
            editor.focus();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('li');
            setSelection(target.firstChild.firstChild, 1, 2);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(editor.quickToolbarModule.quickToolbars['Text'].currentTipPosition).toBe('Bottom-Left');
                done();
            }, 100);
        });

        it('Should treat H1 selection as a large block', (done: DoneFn) => {
            editor.focus();
            (editor as any).inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = (editor as any).inputElement.querySelector('h1');
            expect(target).toBeTruthy();
            expect(target.firstChild).toBeTruthy();
            setSelection(target.firstChild as ChildNode, 1, 5);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const qtBar: BaseQuickToolbar = editor.quickToolbarModule.quickToolbars['Text'];
                expect(qtBar).toBeTruthy();
                expect(qtBar.popupObj).toBeTruthy();
                const blockRect: DOMRect = target.getBoundingClientRect() as DOMRect;
                const popupRect: DOMRect = qtBar.popupObj.element.getBoundingClientRect() as DOMRect;
                expect(blockRect.height > popupRect.height).toBe(true);
                done();
            }, 200);
        });
    });

    describe('Content scrolled Position testing ', () => {

        let editor: RichTextEditorUI;
        beforeAll(() => {
            editor = renderRTE({
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline', 'Strikethrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'NumberedList', 'BulletList']
                },
                height: '300px',
                valueFormat: 'html',
                value: '<h1>Welcome to the Syncfusion<sup>®</sup> Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">Strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>,<code>InlineCode</code>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion<sup>®</sup> Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br/></th> <th style="width: 23.2295%"><span>Name</span><br/></th> <th style="width: 9.91501%"><span>Age</span><br/></th> <th style="width: 15.5807%"><span>Gender</span><br/></th> <th style="width: 17.9887%"><span>Occupation</span><br/></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br/></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br/></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br/></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br/></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br/></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-img-inline" /></p>'
            });
        });

        afterAll(() => {
            destroyRTE(editor);
        });

        it('Should open the quick toolbar with respect to scroll position.', (done : DoneFn) => {
            editor.focus();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('h2');
            setSelection(target.firstChild, 1, 2);
            editor.inputElement.scrollTop = 130;
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(editor.quickToolbarModule.quickToolbars['Text'].currentTipPosition).toBe('Top-Left');
                done();
            }, 100);
        });
    });

    describe('Backwards selection testing', () => {
        let editor: RichTextEditorUI;
        beforeAll(() => {
            editor = renderRTE({
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline', 'Strikethrough']
                },
                height: '300px',
                valueFormat: 'html',
                value: '<h1>Welcome to the Syncfusion<sup>®</sup> Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">Strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>,<code>InlineCode</code>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion<sup>®</sup> Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br/></th> <th style="width: 23.2295%"><span>Name</span><br/></th> <th style="width: 9.91501%"><span>Age</span><br/></th> <th style="width: 15.5807%"><span>Gender</span><br/></th> <th style="width: 17.9887%"><span>Occupation</span><br/></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br/></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br/></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br/></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br/></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br/></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-img-inline" /></p>'
            });
        });

        afterAll(() => {
            destroyRTE(editor);
        });

        it('Should open the quick toolbar below the selected text content and tip pointer should be Bottom right.', (done : DoneFn) => {
            editor.focus();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('p');
            const range: Range = new Range();
            range.setEnd(editor.inputElement.querySelector('li').firstElementChild.firstChild, 60);
            range.setStart(editor.inputElement.querySelector('li').firstElementChild.firstChild, 0);
            editor.selectRange(range);
            window.getSelection().extend(editor.inputElement.querySelector('p').firstChild, 59);
            document.dispatchEvent(new Event('selectionchange'));
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                // Only SUCCESS in HEADLESS CHROME.
                expect(editor.quickToolbarModule.quickToolbars['Text'].currentTipPosition).toBe('Bottom-Right');
                const popupElement: HTMLElement = editor.quickToolbarModule.quickToolbars['Text'].popupObj.element;
                const blockElement: HTMLElement = editor.quickToolbarModule.quickToolbars['Text'].popupObj.relateTo as HTMLElement;
                expect(blockElement.getBoundingClientRect().top).toBeGreaterThan(popupElement.getBoundingClientRect().bottom);
                done();
            }, 100);
        });
        it('Should not open the quick toolbar above the selected text content and tip pointer should be Top right.', (done : DoneFn) => {
            editor.focus();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('h1');
            const range: Range = new Range();
            range.setEnd(editor.inputElement.querySelector('li').firstElementChild.firstChild, 60);
            range.setStart(editor.inputElement.querySelector('li').firstElementChild.firstChild, 0);
            editor.selectRange(range);
            window.getSelection().extend(editor.inputElement.querySelector('h1').firstChild, 15);
            document.dispatchEvent(new Event('selectionchange'));
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(editor.quickToolbarModule.quickToolbars['Text'].currentTipPosition).toBe('Top-Right');
                const popupElement: HTMLElement = editor.quickToolbarModule.quickToolbars['Text'].popupObj.element;
                const blockElement: HTMLElement = editor.quickToolbarModule.quickToolbars['Text'].popupObj.relateTo as HTMLElement;
                expect(blockElement.getBoundingClientRect().top).not.toBeGreaterThan(popupElement.getBoundingClientRect().bottom);
                done();
            }, 100);
        });
    });

    describe('Dropdown State.', () => {
        let editor: RichTextEditorUI;
        beforeAll(() => {
            editor = renderRTE({
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline', 'Strikethrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'NumberedList', 'BulletList']
                },
                valueFormat: 'html',
                value: '<h1>Welcome to the Syncfusion<sup>®</sup> Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">Strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>,<code>InlineCode</code>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion<sup>®</sup> Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br/></th> <th style="width: 23.2295%"><span>Name</span><br/></th> <th style="width: 9.91501%"><span>Age</span><br/></th> <th style="width: 15.5807%"><span>Gender</span><br/></th> <th style="width: 17.9887%"><span>Occupation</span><br/></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br/></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br/></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br/></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br/></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br/></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-img-inline" /></p>'
            });
        });
        afterAll(() => {
            destroyRTE(editor);
        });
        it('Should update the Format dropdown value after showing the quick toolbar', (done: DoneFn) => {
            editor.focus();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('h1');
            setSelection(target.firstChild, 15 , 25);
            editor.quickToolbarModule.quickToolbars['Text'].showPopup(target, null);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const dropDownvalue: string = '<span class="e-rte-ui-dropdown-btn-text-wrapper"><span class="e-rte-ui-dropdown-btn-text">Heading 1</span></span>';
                const dropdownButton: DropDownButton = getComponent(editor.quickToolbarModule.quickToolbars['Text'].element.querySelector('[title="Formats"]').firstElementChild as HTMLElement, 'dropdown-btn');
                expect(dropdownButton.content).toBe(dropDownvalue);
                done();
            }, 100);
        });
    });

    // xdescribe('Quick toolbar collision', () => {
    //     describe('Height static Enable floating true', () => {
    //         let editor: RichTextEditorUI;
    //         beforeEach(() => {
    //             editor = renderRTE({
    //                 valueFormat: 'html',
    //                 toolbarSettings: {
    //                     items: [
    //                         'Undo', 'Redo', '|',
    //                         'Bold', 'Italic', 'Underline', 'Strikethrough', 'InlineCode', 'Superscript', 'Subscript', '|',
    //                         'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
    //                         'Formats', 'Alignment', 'Quote', '|', 'NumberFormatList', 'BulletFormatList', '|',
    //                         'Outdent', 'Indent', '|', 'Link', 'Image',  'Table', '|', 'ClearFormat']
    //                 },
    //                 quickToolbarSettings: {
    //                     text: ['Bold', 'Italic', 'Underline', 'Strikethrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'NumberedList', 'BulletList']
    //                 },
    //                 height: '350px'
    //             });
    //         });

    //         afterEach(() => {
    //             destroyRTE(editor);
    //         });

    //         it('CASE 1: Should open table quick toolbar with top.', (done : DoneFn) => {
    //             editor.focus();
    //             editor.inputElement.innerHTML = TABLE_TOP_POSITION_CONTENT;
    //             editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
    //             const target: HTMLElement = editor.inputElement.querySelector('td');
    //             setCursorPoint(target.firstChild, 0);
    //             target.dispatchEvent(MOUSEUP_EVENT);
    //             setTimeout(() => {
    //                 const quickToolbar: HTMLElement = document.querySelector('.e-rte-ui-quick-popup');
    //                 const mainToolbar: HTMLElement = editor.element.querySelector('.e-rte-ui-toolbar-wrapper');
    //                 const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
    //                 const mainTBarRect: ClientRect = mainToolbar.getBoundingClientRect();
    //                 expect(quikTBarRect.top).toBeGreaterThanOrEqual(mainTBarRect.bottom);
    //                 expect(editor.quickToolbarModule.quickToolbars['Table'].popupObj.collision.Y).toBe('flip');
    //                 expect(editor.quickToolbarModule.quickToolbars['Table'].popupObj.position.Y).toBe('top');
    //                 done();
    //             }, 100);
    //         });
    //         it('CASE 2: Should open table quick toolbar with bottom.', (done : DoneFn) => {
    //             editor.focus();
    //             editor.inputElement.innerHTML = TABLE_BOT_POSITION_CONTENT;
    //             editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
    //             const target: HTMLElement = editor.inputElement.querySelector('td');
    //             setCursorPoint(target.firstChild, 0);
    //             target.dispatchEvent(MOUSEUP_EVENT);
    //             setTimeout(() => {
    //                 const quickToolbar: HTMLElement = document.querySelector('.e-rte-ui-quick-popup');
    //                 const mainToolbar: HTMLElement = editor.element.querySelector('.e-rte-ui-toolbar-wrapper');
    //                 const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
    //                 const mainTBarRect: ClientRect = mainToolbar.getBoundingClientRect();
    //                 expect(quikTBarRect.top).toBeGreaterThanOrEqual(mainTBarRect.bottom);
    //                 expect(editor.quickToolbarModule.quickToolbars['Table'].popupObj.collision.Y).toBe('flip');
    //                 expect(editor.quickToolbarModule.quickToolbars['Table'].popupObj.position.Y).toBe('bottom');
    //                 done();
    //             }, 100);
    //         });
    //         it('CASE 3: Should open table quick toolbar with fit collision.', (done : DoneFn) => {
    //             editor.height = '300px';
    //             editor.focus();
    //             editor.inputElement.innerHTML = TABLE_FIT_POSITION_CONTENT;
    //             editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
    //             const target: HTMLElement = editor.inputElement.querySelector('td');
    //             setCursorPoint(target.firstChild, 0);
    //             target.dispatchEvent(MOUSEUP_EVENT);
    //             setTimeout(() => {
    //                 const quickToolbar: HTMLElement = document.querySelector('.e-rte-ui-quick-popup');
    //                 const mainToolbar: HTMLElement = editor.element.querySelector('.e-rte-ui-toolbar-wrapper');
    //                 const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
    //                 const mainTBarRect: ClientRect = mainToolbar.getBoundingClientRect();
    //                 const editPanel: HTMLElement = editor.inputElement;
    //                 const editPanelRect: ClientRect = editPanel.getBoundingClientRect();
    //                 expect(quikTBarRect.top).toBeGreaterThanOrEqual(mainTBarRect.bottom);
    //                 expect(quikTBarRect.top).toBeGreaterThanOrEqual(editPanelRect.top);
    //                 //This case is currently working properly in local sample and sb samples need to cover this case in playwrite
    //                 //expect(editor.quickToolbarModule.quickToolbars['Table'].popupObj.collision.Y).toBe('fit');
    //                 done();
    //             }, 100);
    //         });
    //         it('CASE 4: Should open table quick toolbar with fit position with main toolbar expanded.', (done : DoneFn) => {
    //             editor.height = '300px';
    //             editor.focus();
    //             editor.inputElement.innerHTML = TABLE_FIT_POSITION_CONTENT;
    //             const expandButton: HTMLElement = editor.element.querySelector('.e-rte-ui-toolbar-wrapper .e-hor-nav.e-expended-nav');
    //             expandButton.click();
    //             editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
    //             const target: HTMLElement = editor.inputElement.querySelector('td');
    //             setCursorPoint(target.firstChild, 0);
    //             target.dispatchEvent(MOUSEUP_EVENT);
    //             setTimeout(() => {
    //                 const quickToolbar: HTMLElement = document.querySelector('.e-rte-ui-quick-popup');
    //                 const mainToolbar: HTMLElement = editor.element.querySelector('.e-rte-ui-toolbar-wrapper');
    //                 const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
    //                 const mainTBarRect: ClientRect = mainToolbar.getBoundingClientRect();
    //                 expect(quikTBarRect.top).toBeGreaterThanOrEqual(mainTBarRect.bottom);
    //                 expect(editor.quickToolbarModule.quickToolbars['Table'].popupObj.collision.Y).toBe('fit');
    //                 done();
    //             }, 100);
    //         });
    //     });

    //     describe('Height static Enable floating false', () => {
    //         let editor: RichTextEditorUI;
    //         beforeAll(() => {
    //             document.body.style.height = '150vh';
    //         });
    //         afterAll(() => {
    //             document.body.style.height = '';
    //         });
    //         beforeEach(() => {
    //             editor = renderRTE({
    //                 valueFormat: 'html',
    //                 toolbarSettings: {
    //                     enableFloating: false,
    //                     items: [
    //                         'Undo', 'Redo', '|', '|',
    //                         'Bold', 'Italic', 'Underline', 'Strikethrough', 'InlineCode', 'Superscript', 'Subscript', '|',
    //                         'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
    //                         'Formats', '|', 'NumberFormatList', 'BulletFormatList', '|',
    //                         'Outdent', 'Indent', '|', 'Link', 'Image', 'Table', '|', 'ClearFormat']
    //                 },
    //                 quickToolbarSettings: {
    //                     text: ['Bold', 'Italic', 'Underline', 'Strikethrough']
    //                 },
    //                 height: '350px'
    //             });
    //         });

    //         afterEach(() => {
    //             destroyRTE(editor);
    //         });

    //         it('CASE 1: Should open table quick toolbar with top.', (done : DoneFn) => {
    //             editor.focus();
    //             window.scrollTo(0, 100);
    //             editor.inputElement.innerHTML = TABLE_TOP_POSITION_CONTENT;
    //             editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
    //             const target: HTMLElement = editor.inputElement.querySelector('td');
    //             setCursorPoint(target.firstChild, 0);
    //             target.dispatchEvent(MOUSEUP_EVENT);
    //             setTimeout(() => {
    //                 const quickToolbar: HTMLElement = document.querySelector('.e-rte-ui-quick-popup');
    //                 const editPanel: HTMLElement = editor.inputElement;
    //                 const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
    //                 const editPanelRect: ClientRect = editPanel.getBoundingClientRect();
    //                 expect(quikTBarRect.top).toBeGreaterThanOrEqual(editPanelRect.top);
    //                 expect(editor.quickToolbarModule.quickToolbars['Table'].popupObj.collision.Y).toBe('flip');
    //                 expect(editor.quickToolbarModule.quickToolbars['Table'].popupObj.position.Y).toBe('top');
    //                 done();
    //             }, 100);
    //         });
    //         it('CASE 2: Should open table quick toolbar with bottom.', (done : DoneFn) => {
    //             editor.focus();
    //             window.scrollTo(0, 100);
    //             editor.inputElement.innerHTML = TABLE_BOT_POSITION_CONTENT;
    //             editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
    //             const target: HTMLElement = editor.inputElement.querySelector('td');
    //             setCursorPoint(target.firstChild, 0);
    //             target.dispatchEvent(MOUSEUP_EVENT);
    //             setTimeout(() => {
    //                 const quickToolbar: HTMLElement = document.querySelector('.e-rte-ui-quick-popup');
    //                 const editPanel: HTMLElement = editor.inputElement;
    //                 const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
    //                 const editPanelRect: ClientRect = editPanel.getBoundingClientRect();
    //                 expect(quikTBarRect.top).toBeGreaterThanOrEqual(editPanelRect.top);
    //                 expect(editor.quickToolbarModule.quickToolbars['Table'].popupObj.collision.Y).toBe('flip');
    //                 expect(editor.quickToolbarModule.quickToolbars['Table'].popupObj.position.Y).toBe('bottom');
    //                 done();
    //             }, 100);
    //         });
    //         it('CASE 3: Should open table quick toolbar with fit collision.', (done : DoneFn) => {
    //             editor.height = '300px';
    //             editor.focus();
    //             window.scrollTo(0, 100);
    //             editor.inputElement.innerHTML = TABLE_FIT_POSITION_CONTENT;
    //             editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
    //             const target: HTMLElement = editor.inputElement.querySelector('td');
    //             setCursorPoint(target.firstChild, 0);
    //             target.dispatchEvent(MOUSEUP_EVENT);
    //             setTimeout(() => {
    //                 const quickToolbar: HTMLElement = document.querySelector('.e-rte-ui-quick-popup');
    //                 const editPanel: HTMLElement = editor.inputElement;
    //                 const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
    //                 const editPanelRect: ClientRect = editPanel.getBoundingClientRect();
    //                 expect(quikTBarRect.top).toBeGreaterThanOrEqual(editPanelRect.top);
    //                 //This case is currently working properly in local sample and sb samples need to cover this case in playwrite
    //                 //expect(editor.quickToolbarModule.quickToolbars['Table'].popupObj.collision.Y).toBe('fit');
    //                 done();
    //             }, 100);
    //         });
    //         it('CASE 4: Should open table quick toolbar with bottom with main toolbar expanded.', (done : DoneFn) => {
    //             editor.focus();
    //             window.scrollTo(0, 100);
    //             editor.inputElement.innerHTML = TABLE_FIT_POSITION_CONTENT;
    //             const expandButton: HTMLElement = editor.element.querySelector('.e-rte-ui-toolbar-wrapper .e-hor-nav.e-expended-nav');
    //             expandButton.click();
    //             editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
    //             const target: HTMLElement = editor.inputElement.querySelector('td');
    //             setCursorPoint(target.firstChild, 0);
    //             target.dispatchEvent(MOUSEUP_EVENT);
    //             setTimeout(() => {
    //                 const quickToolbar: HTMLElement = document.querySelector('.e-rte-ui-quick-popup');
    //                 const editPanel: HTMLElement = editor.inputElement;
    //                 const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
    //                 const editPanelRect: ClientRect = editPanel.getBoundingClientRect();
    //                 expect(quikTBarRect.top).toBeGreaterThanOrEqual(editPanelRect.top);
    //                 const mainToolbarRect: DOMRect = editor.getToolbarElement().getBoundingClientRect() as DOMRect;
    //                 expect(quikTBarRect.top).toBeGreaterThanOrEqual(mainToolbarRect.bottom);
    //                 done();
    //             }, 100);
    //         });
    //     });
    // });

    // xdescribe('962038: Table quick toolbar fit collision does not work in Overview sample demos.', () => {
    //     let editor: RichTextEditorUI;
    //     let wrapperElement: HTMLElement;
    //     beforeAll(() => {
    //         wrapperElement = createElement('div', { className: 'e-editor-wrapper'});
    //         wrapperElement.style.overflow = 'auto';
    //         wrapperElement.style.height = '500px';
    //         const editorRoot: HTMLElement = createElement('div', { className: 'editor'});
    //         editorRoot.id = 'element_962038';
    //         wrapperElement.append(editorRoot);
    //         document.body.append(wrapperElement);
    //         editor = new RichTextEditorUI({
    //             valueFormat: 'html',
    //             toolbarSettings: {
    //                 items: ['Table']
    //             }
    //         }, '#element_962038');
    //     });
    //     afterAll(() => {
    //         editor.destroy();
    //         wrapperElement.remove();
    //     });
    //     it('Should open the table quick toolbar on correct position when clicking on the table.', (done: DoneFn) => {
    //         editor.inputElement.innerHTML = TABLE_FIT_POSITION_CONTENT;
    //         editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
    //         wrapperElement.scrollTop = 50;
    //         const target: HTMLElement = editor.inputElement.querySelector('td');
    //         setCursorPoint(target.firstChild, 0);
    //         target.dispatchEvent(MOUSEUP_EVENT);
    //         setTimeout(() => {
    //             const quickToolbar: HTMLElement = document.querySelector('.e-rte-ui-quick-popup');
    //             const editPanel: HTMLElement = editor.inputElement;
    //             const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
    //             const editPanelRect: ClientRect = editPanel.getBoundingClientRect();
    //             expect(quikTBarRect.top).toBeGreaterThanOrEqual(editPanelRect.top);
    //             done();
    //         }, 100);
    //     });
    // });

    // xdescribe('966006: Text Quick toolbar shows on three rows only when the last table column is selected..', () => {
    //     let editor: RichTextEditorUI;
    //     beforeAll(() => {
    //         editor = renderRTE({
    //             valueFormat: 'html',
    //             quickToolbarSettings: {
    //                 text: ['Bold', 'Italic', 'Underline', 'Strikethrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'NumberedList', 'BulletList']
    //             },
    //             value: OVERVIEW_CONTENT
    //         });
    //     });
    //     afterAll(() => {
    //         destroyRTE(editor);
    //     });
    //     it('Should have proper relateTo Element to the Quick toolbar popup.', (done : DoneFn) => {
    //         editor.focus();
    //         editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
    //         const target: HTMLElement = editor.inputElement.querySelectorAll('th')[5];
    //         setSelection(target.firstChild.firstChild, 16, 17);
    //         target.dispatchEvent(MOUSEUP_EVENT);
    //         setTimeout(() => {
    //             expect((editor.quickToolbarModule.quickToolbars['Text'].popupObj.relateTo as HTMLElement).nodeName).toBe('TABLE');
    //             done();
    //         }, 100);
    //     });
    // });

    // xdescribe('965993: Last character selection results in quick toolbar with improper tip pointer position.', () => {
    //     let editor: RichTextEditorUI;
    //     beforeAll(() => {
    //         editor = renderRTE({
    //             valueFormat: 'html',
    //             quickToolbarSettings: {
    //                 text: ['Bold', 'Italic', 'Underline', 'Strikethrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'NumberedList', 'BulletList']
    //             },
    //             value: EDITOR_CONTENT,
    //             // beforeQuickToolbarOpen: (args: BeforeQuickToolbarOpenArgs) => {
    //             //     args.cancel = true;
    //             // }
    //         });
    //     });
    //     afterAll(() => {
    //         destroyRTE(editor);
    //     });

    //     it('Should have the maxwidth 75% before rendering the quick toolbar.', (done : DoneFn) => {
    //         editor.focus();
    //         editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
    //         const target: HTMLElement = editor.inputElement.querySelector('p');
    //         setSelection(target.firstChild, 1, 2);
    //         target.dispatchEvent(MOUSEUP_EVENT);
    //         setTimeout(() => {
    //             expect(editor.quickToolbarModule.quickToolbars['Text'].element.style.maxWidth).toBe('75%');
    //             done();
    //         }, 100);
    //     });
    // });

    describe('962330: Text Quick Toolbar: Format Options Disappear After Scrolling the Page', () => {
        let editor: RichTextEditorUI;
        beforeAll(() => {
            editor = renderRTE({
                valueFormat: 'html',
                quickToolbarSettings: {
                    text: ['Formats', 'FontName']
                },
                value: '<p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>'
            });
        });
        afterAll(() => {
            destroyRTE(editor);
        });
        it('should show toolbar with status applied', (done : DoneFn) => {
            editor.focus();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('p');
            setSelection(target.firstChild, 1, 2);
            editor.inputElement.parentElement.scrollTop = 130;
            target.dispatchEvent(MOUSEUP_EVENT);
            editor.quickToolbarModule.quickToolbars['Text'].showPopup(target, null);
            setTimeout(() => {
                const dropDownvalue: string = '<span class="e-rte-ui-dropdown-btn-text-wrapper"><span class="e-rte-ui-dropdown-btn-text">Paragraph</span></span>';
                const dropdownButton: DropDownButton = getComponent(editor.quickToolbarModule.quickToolbars['Text'].element.querySelector('[title="Formats"]').firstElementChild as HTMLElement, 'dropdown-btn');
                expect(dropdownButton.content).toBe(dropDownvalue);
                done();
            }, 100);
        });
    });

    describe('964505: Quick toolbar position is not refreshed when the window is resized.', () => {
        let editor: RichTextEditorUI;
        let refreshMethodSpy: jasmine.Spy;
        beforeAll(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: EDITOR_CONTENT,
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline', 'Strikethrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'NumberedList', 'BulletList']
                }
            });
        });
        afterAll(() => {
            destroyRTE(editor);
        });
        it('Should call the RefreshPopup method on window resize.', (done: DoneFn) => {
            editor.focus();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('p');
            setSelection(target.firstChild, 1, 2);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickPopup: HTMLElement = document.querySelector('.e-rte-ui-quick-popup');
                expect(quickPopup).not.toBe(null);
                refreshMethodSpy = spyOn(editor.quickToolbarModule, 'refreshQuickToolbarPopup' as any);
                window.dispatchEvent(new Event('resize'));
                setTimeout(() => {
                    expect(refreshMethodSpy).toHaveBeenCalled();
                    done();
                }, 200);
            }, 100);
        });
    });

    // xdescribe('966020: Table Quick toolbar position is not refreshed instantly when scrolling.', () => {
    //     let editor: RichTextEditorUI;
    //     let dataBindSpy: jasmine.Spy;
    //     beforeAll(() => {
    //         editor = renderRTE({
    //             valueFormat: 'html',
    //             value: EDITOR_CONTENT,
    //             quickToolbarSettings: {
    //                 text: ['Bold', 'Italic', 'Underline', 'Strikethrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'NumberedList', 'BulletList']
    //             }
    //         });
    //     });
    //     afterAll(() => {
    //         destroyRTE(editor);
    //     });
    //     it('Should call the dataBind method when the quick toolbar is shown.', (done: DoneFn) => {
    //         editor.focus();
    //         editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
    //         const target: HTMLElement = editor.inputElement.querySelector('p');
    //         setSelection(target.firstChild, 1, 2);
    //         target.dispatchEvent(MOUSEUP_EVENT);
    //         dataBindSpy = spyOn(editor.quickToolbarModule.quickToolbars['Text'].popupObj, 'dataBind');
    //         setTimeout(() => {
    //             expect(dataBindSpy).toHaveBeenCalled();
    //             done();
    //         }, 100);
    //     });
    // });

    describe('966000: Link Quick toolbar not collided when there is no bottom space reference to viewport.' , () => {
        let editor: RichTextEditorUI;
        beforeAll(() => {
            editor = renderRTE({
                valueFormat: 'html',
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline', 'Strikethrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'NumberedList', 'BulletList']
                },
                value: OVERVIEW_CONTENT,
                height: '300px'
            });
        });
        afterAll(() => {
            destroyRTE(editor);
        });

        it('Should Open on top position instead of bottom.', (done : DoneFn) => {
            editor.focus();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelectorAll('li')[1];
            setSelection(target.firstChild, 1, 2);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(editor.quickToolbarModule.quickToolbars['Text'].currentTipPosition).toBe('Bottom-LeftMiddle'); // Local TDD different value due to pixel difference.
                done();
            }, 100);
        });
    });

    // xdescribe('968649: Quick toolbar is shown on bottom position in Bold Desk Agent portal.', () => {
    //     let editor: RichTextEditorUI;
    //     let wrapperElement: HTMLElement;
    //     beforeAll(() => {
    //         wrapperElement = createElement('div', { className: 'e-editor-wrapper'});
    //         wrapperElement.style.overflow = 'auto';
    //         wrapperElement.style.height = '500px';
    //         const editorRoot: HTMLElement = createElement('div', { className: 'editor'});
    //         editorRoot.id = 'element_968649';
    //         wrapperElement.append(editorRoot);
    //         wrapperElement.append(createElement('h1').innerHTML = 'This issues is only replicated inside the Bold desk source.');
    //         document.body.append(wrapperElement);
    //         editor = new RichTextEditorUI({
    //             valueFormat: 'html',
    //             toolbarSettings: {
    //                 enableFloating : false
    //             }
    //         }, '#element_968649');
    //     });
    //     afterAll(() => {
    //         editor.destroy();
    //         wrapperElement.remove();
    //     });
    //     it('Should open the table quick toolbar on correct position when clicking on the table.', (done: DoneFn) => {
    //         editor.inputElement.innerHTML = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p>';
    //         editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
    //         wrapperElement.scrollTop = 50;
    //         const target: HTMLElement = editor.inputElement.querySelector('td');
    //         setCursorPoint(target.firstChild, 0);
    //         target.dispatchEvent(MOUSEUP_EVENT);
    //         setTimeout(() => {
    //             const quickToolbar: HTMLElement = document.querySelector('.e-rte-ui-quick-popup');
    //             const editPanel: HTMLElement = editor.inputElement;
    //             const quikTBarRect: ClientRect = quickToolbar.getBoundingClientRect();
    //             const editPanelRect: ClientRect = editPanel.getBoundingClientRect();
    //             expect(quikTBarRect.top).toBeGreaterThanOrEqual(editPanelRect.top);
    //             expect(editor.quickToolbarModule.quickToolbars['Table'].popupObj.collision.Y).toBe('fit');
    //             done();
    //         }, 100);
    //     });
    // });

});
