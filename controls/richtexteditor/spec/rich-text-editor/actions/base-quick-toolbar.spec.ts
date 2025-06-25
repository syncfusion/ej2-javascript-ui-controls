import { RichTextEditor } from "../../../src/rich-text-editor/base";
import { renderRTE, destroy } from "../render.spec";
import { BASIC_MOUSE_EVENT_INIT } from "../../constant.spec";
import { createElement } from "@syncfusion/ej2-base";

describe('Base Quick Toolbar', ()=> {

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
    
    const TABLE_TOP_POSITION_CONTENT: string = '<h2>Welcome to the Syncfusion<sup>®</sup> Rich Text Editor</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h3>Elevating Your Content with Images</h3><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-imginline"></p>';
   
    const TABLE_FIT_POSITION_CONTENT: string = '<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h3>Elevating Your Content with Images</h3><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-imginline"></p>';
    
    const TABLE_BOT_POSITION_CONTENT: string = '<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 13.5417%;"> <tr style="height: 13.5417%;"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 17.1875%;"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 17.1875%;"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 17.1875%;"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 17.1875%;"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 17.1875%;"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><p><br></p>';
    
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

    describe('IFrame rendering position testing.', ()=> {
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

    describe ('Last block collision Position testing', ()=> {

        describe('Case 1: DIV rendering.', ()=> {
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
                    // const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    // expect(quickPopup.style.top).toBe('139.703px');
                    // expect(quickPopup.style.left).toBe('56px');
                    done();
                }, 100);
            });
        });
        describe('Case 2: IFrame rendering.', ()=> {
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
    
            it('Should flip and open the quick toolbar.', (done : DoneFn)=> {
                editor.focusIn();
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('li');
                setSelection(target.firstChild, 1, 2);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    // const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    // expect(quickPopup.style.top).toBe('139.703px');
                    // expect(quickPopup.style.left).toBe('56px');
                    done();
                }, 100);
            });
        });
    });

    describe ('Content scrolled Position testing ', ()=> {

        describe('Case 1: DIV rendering.', ()=> {
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
                    // const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    // expect(quickPopup.style.top).toBe('62.3281px');
                    // expect(quickPopup.style.left).toBe('38px');
                    done();
                }, 100);
            });
        });
        describe('Case 2: IFrame rendering.', ()=> {
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
                const target: HTMLElement = editor.inputElement.querySelector('h2');
                setSelection(target.firstChild, 1, 2);
                editor.inputElement.parentElement.scrollTop = 130;
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    // const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    // expect(quickPopup.style.top).toBe('160.703px');
                    // expect(quickPopup.style.left).toBe('43px');
                    done();
                }, 100);
            });
        });
    });

    describe('Backwards selection testing', ()=> {
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

        it('Should open the quick toolbar above the selected text content and tip pointer should be bottom center.', (done : DoneFn)=> {
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
                // const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                // expect(quickPopup.style.top).toBe('40.3281px');
                // expect(quickPopup.style.left).toBe('103.531px');
                // const tipPointer: HTMLElement = quickPopup.querySelector('.e-rte-tip-pointer');
                // expect(tipPointer.classList.contains('e-rte-tip-bottom')).toBe(true);
                // expect(tipPointer.classList.contains('e-rte-tip-center')).toBe(true);
                done();
            }, 100);
        });
    });

    describe('IFrame Backwards selection testing', ()=> {
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

        it('Should open the quick toolbar above the selected text content and tip pointer should be bottom center.', (done : DoneFn)=> {
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
                // const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                // expect(quickPopup.style.top).toBe('40.3281px');
                // expect(quickPopup.style.left).toBe('103.531px');
                // const tipPointer: HTMLElement = quickPopup.querySelector('.e-rte-tip-pointer');
                // expect(tipPointer.classList.contains('e-rte-tip-bottom')).toBe(true);
                // expect(tipPointer.classList.contains('e-rte-tip-center')).toBe(true);
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
                    height: '300px',
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
                    done();
                }, 100);
            });
            it('CASE 3: Should open table quick toolbar with fit collision.', (done : DoneFn)=> {
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
                    expect(quikTBarRect.top).toBeGreaterThanOrEqual(mainTBarRect.bottom);
                    done();
                }, 100);
            });
            it('CASE 4: Should open table quick toolbar with bottom with main toolbar expanded.', (done : DoneFn)=> {
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
                        text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                    },
                    height: '300px',
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
                    done();
                }, 100);
            });
            it('CASE 3: Should open table quick toolbar with fit collision.', (done : DoneFn)=> {
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
                    expect(quikTBarRect.top).toBeGreaterThanOrEqual(editPanelRect.top);
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

    
});